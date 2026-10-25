# Düşbelen SK — Gece çalışması raporu (15 Ekim 2026)

Durum: **yerelde hazır, commit/push YAPILMADI.** tsc 0 hata, eslint 0 hata (2 eski uyarı `seed.ts`), `npm run build` başarılı (56 sayfa).

## Canlıya almadan önce (SIRA ÖNEMLİ)

1. **Migration `0004`'ü canlı veritabanına uygula**: `npx drizzle-kit migrate` (yalnızca 2 yeni tablo + `contact_messages`'a 4 kolon, eklemeli).
   - Bilgi: yerel `.env.local` canlı Neon DB'ye bağlı. Yeni tablolar zaten bir kez oluşturulmuştu (hero_slides, video_items, ek kolonlar); migrate'in "zaten var" demesi normal olabilir, hata verirse bana söyle.
2. `npx tsx src/db/sync-hero-videos.ts` (hero slaytları ve videoları mevcut içerikten doldurur; tablo doluysa atlar).
3. Sonra commit + push. Migration'dan önce push yapılırsa canlı build bozulur (sorgular yeni tabloları bekliyor).
4. Vercel ortam değişkenleri: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` uzun/rastgele; Blob için `BLOB_READ_WRITE_TOKEN` (fotoğraf yükleme).
5. Temizlik: Neon'daki `test` dalını sil (bağlantı adresi sohbette göründü), `.env.test.local` dosyasını sil, tüm bunlardan sonra `yedek` olarak istersen `RAPOR.md`'yi sil.

## Yapılanlar

### Admin panel (11 modül + yeni)
- Yeni: **Anasayfa Slaytı** (kadraj kaydırıcılı), **Videolar**, **Gelen Mesajlar** (menüde gizli, çünkü sitede iletişim formu yok; URL: /admin/mesajlar).
- Anasayfa slaytı ve videolar artık veritabanından geliyor.
- Genel Bakış: "yayında olanlar" özeti, uyarılar (etkinlik yok, Sıradaki Maç kapalı vb.), mobil taşma düzeltildi.
- Durum bandı odaklanır, kaydedilmemiş değişiklik uyarısı (sekme kapatma + menü bağlantıları).
- Güvenlik: login/logout/upload'a Origin kontrolü, yükleme yolu beyaz listesi sıkılaştırıldı; 47 server action'ın hepsinde yetki kontrolü.
- İletişim API'si (`/api/contact`) mesajı DB'ye kaydeder; e-posta (Resend) sadece ek bildirim.

### Testler (Neon test dalında, canlıya yazılmadı)
- Tur 1: ~270 kontrol geçti, 3 küçük bulgu (düzeltildi).
- Tur 2: 8 modül CRUD + doğrulama + sıralama + public yansıma geçti. **Yüksek bulgu: JSON-LD'de `<` kaçışı bozulmuştu (stored XSS) → düzeltildi ve test DB'de yeniden doğrulandı** (`src/lib/jsonLd.ts`).
- Soft-404 (200 dönen 404): kök `loading.tsx` neden oluyordu → kaldırıldı, 404 geri geldi.
- Tur 2'den sonra yapılan düzeltmeler (askf yönlendirmesi, UnsavedGuard menü uyarısı, jsonLd) için ayrı tam tur YAPILMADI; yalnızca ilgili yerler elle doğrulandı. Yarın hızlı bir 3. tur öneririm.

### SEO
- Anasayfa title/description hedef kelimelerle; anasayfa canonical'ı; H1'de gizli "Köyceğiz Futbol Okulu".
- **Yeni sayfalar:** /yas-gruplari ve /yas-gruplari/u11…u17 (DB'den, SportsTeam + BreadcrumbList şeması, puan durumu).
- Tek kulüp şeması (@id), WebSite, FAQPage (/sss), BreadcrumbList; ContactPage.
- /admin/login noindex, 404 noindex, gizlilik/kvkk/kullanım noindex + sitemap'ten çıktı; sitemap'te sahte lastmod yok.
- Logolu paylaşım kartı (/opengraph-image), manifest, tema rengi.

### Tasarım / performans / erişilebilirlik
- Hero: okunabilirlik, kontroller tek kapsülde (n/N + oklar), WhatsApp çakışması giderildi, ilk kare statik görsel + video gecikmeli.
- Video kartları, galeri ızgarası, yaş kartları (link + mobilde 2 sütun), puan durumu tablosu (yatay kaydırma + sabit takım sütunu), mobil menü (Esc, odak), 44px dokunma alanları, 12px altı yazı yok, footer kontrastı.
- Anasayfa kısaltıldı (Değerler şeride indi; "Düşbelen ruhu nedir?" uzun metni kısaltıldı — eski metni istersen geri koyarız).
- Hata / global-error sayfaları, alt metinler, carousel erişilebilirliği.

## Kalanlar / sizden beklenenler
- **Adres yazımı:** "Döğüşbelen Mahallesi" doğru mu? Google Business ile birebir aynı olmalı. Posta kodu, Facebook/YouTube linkleri varsa verin.
- **İletişim formu:** sitede yok (bilerek kaldırılmış). Geri istenirse Gelen Mesajlar hazır.
- **CSP (güvenlik başlığı)** yok; yanlış kurulursa siteyi bozabilir, önce rapor modunda eklenmeli (yarın).
- **Footer CLS (0.32) ve açılış görseli LCP:** dev sunucusunda ölçüldü; canlıda (production) yeniden ölç.
- **Haberler:** metinde "U-11…U-14" yazıyor, sitede U15/U17 de var (panelden güncelleyin). Haber adreslerinde başlık yok (şema değişikliği gerekir, yapılmadı).
- **Google:** Search Console'da siteyi doğrula, sitemap gönder, /yas-gruplari/* için indeksleme iste; Google Business Profile aç/talep et.
- **Blob** bağlanmadı → panelden fotoğraf yükleme kapalı (görsel seçimi çalışıyor). Yükleme yolu hiç gerçek test edilmedi.
- **Sıradaki Maç** kapalı, yaklaşan etkinlik yok (Genel Bakış uyarıyor).
- `/askf/<geçersiz>` artık /yas-gruplari'na yönlendiriyor.

## Geçici dosyalar
`src/db/_snapshot.ts` silindi, `.claude/launch.json` eski haline döndü. `src/db/sync-hero-videos.ts` kalıcı (tek seferlik aktarım). Test sunucusu kapalı.
