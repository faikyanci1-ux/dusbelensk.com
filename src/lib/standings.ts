/**
 * Muğla ASKF U17 C Grubu puan durumu (https://muglaaskf.com/puan-durumu).
 *
 * Site ASP.NET WebForms; API yok. Lig ve grup seçimi "postback" ile yapılır: sayfa alınır,
 * gizli form alanları (__VIEWSTATE vb.) ile U17'ye, sonra C grubuna geçilir ve tablo ayrıştırılır.
 * Sonuç saatte bir yenilenir; kaynak siteye ulaşılamazsa null döner ve bölüm gizlenir.
 */
import { unstable_cache } from "next/cache";

export const STANDINGS_SOURCE_URL = "https://muglaaskf.com/puan-durumu";
const ORIGIN = "https://muglaaskf.com";
const LEAGUE_U17 = "ctl00$ContentPlaceHolder1$rptAnaLiglerMenu$ctl03$lbl1DevreSec";
const GROUP_C = "ctl00$ContentPlaceHolder1$rptLigler$ctl00$rptGruplar$ctl03$lblGruplar";

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

export type Standings = { title: string; week: string | null; rows: StandingRow[] };

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

export function parseStandings(html: string): Standings | null {
  const rows: StandingRow[] = [];
  for (const [li] of html.matchAll(/<li id="[^"]*PDSatir_\d+">[\s\S]*?<\/li>/g)) {
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
      isUs: /D[ÜU][ŞS]BELEN/i.test(team),
    });
  }
  if (rows.length === 0) return null;
  const page = text(html);
  const title = page.match(/U17 \d{4}\/\d{4} SEZONU/i)?.[0] ?? "U17";
  const week = page.match(/(\d+)\. HAFTA Takım/i)?.[1] ?? null;
  return { title, week: week ? `${week}. Hafta` : null, rows };
}

async function fetchStandings(): Promise<Standings | null> {
  try {
    const first = await load();
    const u17 = await load(first, LEAGUE_U17);
    const groupC = await load(u17, GROUP_C);
    const standings = parseStandings(groupC.html);
    if (!standings) console.error("[standings] puan durumu tablosu ayrıştırılamadı");
    return standings;
  } catch (error) {
    console.error("[standings] muglaaskf.com'dan okunamadı:", error);
    return null;
  }
}

export const getU17GroupCStandings = unstable_cache(fetchStandings, ["u17-c-standings"], { revalidate: 3600 });
