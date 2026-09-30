/**
 * Muğla ASKF'de grubun kendi sayfasına yönlendirme (örn. /askf/u14-e).
 *
 * Kaynak sitede gruplara doğrudan adres yok; grup seçimi form gönderimiyle (postback) yapılıyor.
 * Bu adres, grubun form alanlarını içeren küçük bir sayfa döndürür ve formu ziyaretçinin
 * tarayıcısından otomatik gönderir. Bir sorun olursa genel puan durumu sayfasına gider.
 */
import { getGroupPostback, STANDINGS_SOURCE_URL } from "@/lib/standings";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET(_request: Request, { params }: { params: Promise<{ grup: string }> }) {
  const { grup } = await params;
  let fields: Record<string, string> | null;
  try {
    fields = await getGroupPostback(grup);
  } catch (error) {
    console.error(`[askf] ${grup} yönlendirmesi hazırlanamadı:`, error);
    return Response.redirect(STANDINGS_SOURCE_URL, 302);
  }
  if (!fields) return new Response("Bulunamadı", { status: 404 });

  const inputs = Object.entries(fields)
    .map(([name, value]) => `<input type="hidden" name="${escape(name)}" value="${escape(value)}">`)
    .join("");
  const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Muğla ASKF puan durumuna yönlendiriliyor…</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1424;color:#e5e7eb;font:15px system-ui,sans-serif}button{margin-top:12px;padding:10px 20px;border:0;border-radius:999px;background:#dc2626;color:#fff;font-weight:600;cursor:pointer}</style>
</head>
<body>
<form id="f" method="post" action="${STANDINGS_SOURCE_URL}">
${inputs}
<p>Muğla ASKF puan durumuna yönlendiriliyorsunuz…</p>
<noscript><button type="submit">Devam et</button></noscript>
</form>
<script>document.getElementById("f").submit()</script>
</body>
</html>`;
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
