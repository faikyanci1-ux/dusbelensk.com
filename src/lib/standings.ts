/**
 * Muğla ASKF puan durumları (https://muglaaskf.com/puan-durumu): U17 C, U14 E ve U12 F grupları.
 *
 * Site ASP.NET WebForms; API yok. Lig ve grup seçimi "postback" ile yapılır: sayfa alınır,
 * gizli form alanları (__VIEWSTATE vb.) ile lige, sonra gruba geçilir ve tablo ayrıştırılır.
 * Sonuç saatte bir yenilenir. Grubun tablosu henüz yayınlanmamışsa haftanın fikstürü döner;
 * kaynak siteye ulaşılamazsa o grup null döner ve sitede gizlenir.
 */
import { unstable_cache } from "next/cache";

export const STANDINGS_SOURCE_URL = "https://muglaaskf.com/puan-durumu";
const ORIGIN = "https://muglaaskf.com";

/** Sitede gösterilen gruplar; `menu` kaynak sitedeki sol lig menüsündeki sırasıdır (ctl00 = Süper Amatör). */
const GROUPS = [
  { league: "U17", menu: "ctl03", group: "C" },
  { league: "U14", menu: "ctl04", group: "E" },
  { league: "U12", menu: "ctl05", group: "F" },
] as const;

export type StandingRow = {
  rank: number;
  team: string;
  logo: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  isUs: boolean;
};

export type Fixture = {
  date: string;
  day: string;
  time: string;
  home: string;
  away: string;
  score: string | null;
  venue: string;
  isUs: boolean;
};

/** `rows` boşsa federasyon tabloyu henüz yayınlamamıştır; o zaman haftanın fikstürü (`fixtures`) gösterilir. */
export type Standings = {
  league: string;
  group: string;
  title: string;
  week: string | null;
  rows: StandingRow[];
  fixtureWeek: string | null;
  fixtures: Fixture[];
};

const IS_US = /D[ÜU][ŞS]BELEN/i;

function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ouml;/g, "ö")
    .replace(/&nbsp;/g, " ");
}

function formFields(html: string) {
  const fields: Record<string, string> = {};
  for (const [input] of html.matchAll(/<input[^>]*type="hidden"[^>]*>/g)) {
    const name = input.match(/name="([^"]+)"/)?.[1];
    if (name) fields[name] = decode(input.match(/value="([^"]*)"/)?.[1] ?? "");
  }
  for (const [select, name] of html.matchAll(/<select name="([^"]+)"[\s\S]*?<\/select>/g)) {
    const option = select.match(/<option selected="selected" value="([^"]*)"/) ?? select.match(/<option value="([^"]*)"/);
    fields[name] = decode(option?.[1] ?? "");
  }
  return fields;
}

async function load(prev?: { html: string; cookie: string }, target?: string) {
  const headers: Record<string, string> = { "user-agent": "Mozilla/5.0 (dusbelensk.com puan durumu)" };
  let body: URLSearchParams | undefined;
  if (prev && target) {
    headers.cookie = prev.cookie;
    headers["content-type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams({ ...formFields(prev.html), __EVENTTARGET: target, __EVENTARGUMENT: "", __LASTFOCUS: "" });
  }
  const res = await fetch(STANDINGS_SOURCE_URL, {
    method: body ? "POST" : "GET",
    body,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const setCookie = res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  return { html: await res.text(), cookie: setCookie || prev?.cookie || "" };
}

const text = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const num = (s: string | undefined) => Number.parseInt(s ?? "", 10) || 0;

export function parseStandings(html: string, league: string, group: string): Standings | null {
  const rows: StandingRow[] = [];
  for (const [li] of html.matchAll(/<li id="[^"]*PDSatir_\d+"[^>]*>[\s\S]*?<\/li>/g)) {
    const team = text(li.match(/<h6>([\s\S]*?)<\/h6>/)?.[1] ?? "");
    const cells = [...li.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => text(m[1]));
    if (!team || cells.length < 9) continue;
    const logo = li.match(/<img src="([^"]+)"/)?.[1];
    const [rank, played, won, drawn, lost, goalsFor, goalsAgainst, goalDiff, points] = cells.map(num);
    rows.push({
      rank,
      team,
      // Kaynak bazen yolu "images%2fpagesimages%2f..." diye kodlu veriyor; next/image desenine uysun diye çözülür.
      logo: logo ? new URL(decodeURIComponent(decode(logo)), `${ORIGIN}/`).toString() : null,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDiff,
      points,
      isUs: IS_US.test(team),
    });
  }
  const fixtures = parseFixtures(html);
  if (rows.length === 0 && fixtures.length === 0) return null;
  const page = text(html);
  const title = page.match(new RegExp(`${league} \\d{4}/\\d{4} SEZONU`, "i"))?.[0] ?? league;
  const week = page.match(/(\d+)\. HAFTA Takım/i)?.[1] ?? null;
  const fixtureWeek = html.match(/lblFikstureHaftaBilgisi_\d+">\s*(\d+)\. HAFTA/i)?.[1] ?? null;
  return {
    league,
    group,
    title,
    week: week ? `${week}. Hafta` : null,
    rows,
    fixtureWeek: fixtureWeek ? `${fixtureWeek}. Hafta` : null,
    fixtures,
  };
}

/** Seçili haftanın maçları ("rptfikstur"; "Sonraki Hafta" listesi tarihsiz olduğu için alınmaz). */
function parseFixtures(html: string): Fixture[] {
  const fixtures: Fixture[] = [];
  for (const [li] of html.matchAll(/<li id="[^"]*rptfikstur_\d+_musabaka_\d+"[^>]*>[\s\S]*?<\/li>/g)) {
    const cell = (name: string) =>
      text(li.match(new RegExp(`class="fixture-match-${name}[^"]*">([\\s\\S]*?)</div>`))?.[1] ?? "");
    const home = cell("home");
    const away = cell("away");
    if (!home || !away) continue;
    const score = cell("score");
    fixtures.push({
      date: cell("date"),
      day: cell("day"),
      time: cell("time"),
      home,
      away,
      score: score && score !== "-" ? score : null,
      venue: cell("stad"),
      isUs: IS_US.test(home) || IS_US.test(away),
    });
  }
  return fixtures;
}

async function fetchGroup(
  first: Awaited<ReturnType<typeof load>>,
  { league, menu, group }: (typeof GROUPS)[number]
): Promise<Standings | null> {
  try {
    const leaguePage = await load(first, `ctl00$ContentPlaceHolder1$rptAnaLiglerMenu$${menu}$lbl1DevreSec`);
    // Grup düğmelerinin sırası ligden lige değişebilir; doğru düğme harfinden bulunur.
    const groupCtl = [...leaguePage.html.matchAll(/rptGruplar\$(ctl\d+)\$lblGruplar[^>]*>\s*([A-Z])\s*</g)].find(
      (m) => m[2] === group
    )?.[1];
    if (!groupCtl) throw new Error(`${league} ${group} grubu bulunamadı`);
    const groupPage = await load(leaguePage, `ctl00$ContentPlaceHolder1$rptLigler$ctl00$rptGruplar$${groupCtl}$lblGruplar`);
    // Tablo yayınlanmamışsa (sezon başı) yalnız fikstürle döner.
    return parseStandings(groupPage.html, league, group);
  } catch (error) {
    console.error(`[standings] ${league} ${group} grubu okunamadı:`, error);
    return null;
  }
}

async function fetchStandings(): Promise<Standings[]> {
  try {
    const first = await load();
    const results: Standings[] = [];
    // Aynı oturumla sırayla gidilir; kaynak siteye aynı anda çok istek atılmaz.
    for (const g of GROUPS) {
      const standings = await fetchGroup(first, g);
      if (standings) results.push(standings);
    }
    return results;
  } catch (error) {
    console.error("[standings] muglaaskf.com'dan okunamadı:", error);
    return [];
  }
}

export const getStandings = unstable_cache(fetchStandings, ["askf-standings-v2"], { revalidate: 3600 });
