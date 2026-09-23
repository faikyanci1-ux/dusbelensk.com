# Düşbelen SK — Web Sitesi Yol Haritası

## Faz 1 — Kurumsal site (şu an, local)

**Durum: Tamamlandı ✅** — proje local'de çalışıyor (`npm run dev`).

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Marka kimliği eski statik siteden birebir taşındı: koyu lacivert zemin (`#020617`), yeşil vurgu (`#22c55e`), Inter font
- Çok sayfalı yapı (SPA yerine ayrı route'lar — SEO ve profesyonel görünüm için):
  - `/` — Anasayfa (video arka planlı hero, istatistik şeridi, değerler, video şöleni, hızlı linkler)
  - `/hakkimizda` — Kulüp tanıtımı, tesis fotoğrafları, hoca notu, sayılarla kulüp
  - `/teknik-kadro` — Teknik kadro (gerçek fotoğraflarla)
  - `/ilk-11` — Muhtemel 11 (tablo + saha diziliş görseli)
  - `/yonetim` — Yönetim Kurulu + Denetleme Kurulu
  - `/veliler-icin` — Veli bilgilendirme sayfası
  - `/galeri` — Fotoğraf galerisi (takım/maç fotoğrafları dahil)
  - `/haberler` — Haberler/duyurular (admin panelle dolacak, şimdilik boş)
  - `/iletisim` — İletişim bilgileri + çalışan mesaj formu
- Anasayfa herosu artık `tesis-havadan.mp4` ile otomatik oynatılan video arka plana sahip; altında SilverRing referansındaki gibi ikonlu istatistik şeridi (47 lisanslı oyuncu, 4 yaş grubu, 2022 kuruluş, +50 maç) var
- Anasayfada "Kulüpten Kareler" video şöleni bölümü eklendi — drone görüntüsü, tesis havadan, kaleci röportajı, takım konuşması (4 video, kontrol edilebilir)
- Veri katmanı `src/data/*.ts` dosyalarında; `src/lib/queries.ts` tek giriş noktası olarak tasarlandı — Faz 2'de sadece bu dosyanın içi değişecek, sayfalar (`page.tsx`) dokunulmadan kalacak
- Mevcut placeholder veriler (İlk 11'deki "Oyuncu Adı") bilinçli olarak aynen taşındı

### Sporcularımız (kadro) sayfası — şimdilik yok

Netleştirme sonrası karar: **"Sporcularımız" bölümü/sayfası şimdilik hiç yayınlanmayacak** (ne fotoğraflı ne fotoğrafsız). `/sporcularimiz` route'u kaldırıldı, nav'dan çıkarıldı. Veri (`src/data/players.ts`), bileşenler (`PlayerAvatar`, `PlayerGrid`) ve Drizzle şeması korunuyor — admin panel/gerçek veri netleşince tek route dosyası eklenerek geri getirilebilir.

### Video/foto kullanımı

- Galeri: eski sitedeki `img/gallery/*.jpg` (takım/maç fotoğrafları dahil) onayınızla eklendi.
- Anasayfa videoları: `legacy-static-site/media/` içindeki 4 video (drone, tesis, kaleci röportajı, takım konuşması — sporcuların göründüğü klipler dahil) onayınızla eklendi.
- `legacy-static-site/videolar/` (16 adet etiketsiz WhatsApp videosu) henüz kullanılmadı — içerikleri incelenip hangilerinin siteye uygun olduğuna birlikte karar vermemiz gerekiyor.
- **`resimler/` klasörü**: eski taslakta yönetim kurulu üyelerinin fotoğrafı olarak yanlışlıkla sporcu (çocuk) fotoğrafları kullanılmıştı — bunu düzelttim, yeni sitede kullanılmıyor.

### Not: video dosya boyutları

`public/videos/` altındaki 4 dosya toplam ~30MB. Local geliştirme için sorun değil, ancak Vercel'e alırken bu büyüklükte video dosyalarını doğrudan `public/` üzerinden servis etmek yerine bir video/CDN servisi (örn. Mux, Cloudflare Stream, Vercel Blob) kullanmak daha performanslı olur — Faz 3'te değerlendirilecek.

## Faz 2 — Vercel Postgres + Admin Panel

Altyapı hazır, henüz bağlanmadı. Şema: `src/db/schema.ts` (players, staff, board_members,
lineup_slots, gallery_items, news_items, contact_messages), bağlantı `src/db/client.ts`,
mevcut verileri aktaracak script `src/db/seed.ts`.

`DATABASE_URL` Vercel'de tanımlı, Neon veritabanı bağlandı ve migration uygulandı (bkz. aşağı).

**Adım adım plan:**

0. ~~DATABASE_URL'in gerçek değerini bul~~ ✅ — Neon connection string alındı, `.env.local`'e eklendi
1. ~~`npm run db:generate && npm run db:migrate`~~ ✅ — 7 tablo oluşturuldu
2. ~~`npm run db:seed`~~ ✅ — mevcut içerik aktarıldı (47 oyuncu, 6 personel, 8 kurul üyesi,
   11 kadro slotu, 26 galeri, 4 haber)
3. ~~Basit admin girişi~~ ✅ — `/admin` şifre korumalı (tek şifre + imzalı, 12 saatlik cookie
   oturumu). Şifre: `.env.local` / Vercel `ADMIN_PASSWORD`. Canlıda test edildi.
   **Not:** Next.js 16'da `middleware.ts` kaldırılıp `src/proxy.ts` (+ `proxy` adında export)
   oldu — bu proje o yeni convention'ı kullanıyor.
4. **(Sıradaki)** İlk CRUD modülü: **Haberler** — listele / ekle / düzenle / sil
5. `src/lib/queries.ts` içindeki `getNews()`'ü Drizzle sorgusuna çevir — `page.tsx` dosyaları
   hiç değişmez, veri kaynağı arkada değişir
6. Sırayla diğer modüller: Galeri → Teknik Kadro → Yönetim Kurulu → (ileride) Sporcularımız
   (gerçek kadro verisi/foto politikası netleşince)
7. Görsel yükleme kararı: yeni haber/galeri fotoğrafı admin panelden nasıl yüklenecek
   (Vercel Blob mu, yoksa dosya sisteminden manuel mi)
8. Her modül bitince: commit → push → Vercel otomatik deploy (bu akış zaten kurulu ve çalışıyor)

## Faz 3 — Yayına alma

**Durum: Tamamlandı ✅**

1. ~~GitHub reposu oluştur, projeyi push'la~~ — yapıldı (`faikyanci1-ux/dusbelensk.com`)
2. ~~Vercel'de repo'yu import et, env değişkenlerini gir~~ — yapıldı, Git push'ta otomatik deploy tetikleniyor
3. ~~`dusbelensk.com` domainini Vercel projesine bağla~~ — yapıldı, site canlıda
4. Eski statik site (`legacy-static-site/`) zaten yayında değil, sadece arşiv olarak duruyor

## Onayınızı bekleyen kararlar

- [x] **Galeri/takım fotoğrafları**: eklenmesine karar verildi, siteye eklendi.
- [x] **Anasayfa videoları**: drone, tesis, röportaj, takım konuşması eklendi.
- [ ] **`videolar/` klasöründeki 16 WhatsApp videosu**: hangileri kullanılacak, ne başlıkla?
- [ ] **Sponsorlar sayfası**: eski sitede nav'da vardı ama içerik yoktu — sponsor bilgisi geldiğinde ekleyelim mi?
- [ ] **İletişim formu**: [resend.com](https://resend.com) üzerinden ücretsiz bir API key alıp `.env.local`'e eklemeniz gerekiyor (`RESEND_API_KEY`, `CONTACT_EMAIL_TO`) — yoksa form "henüz yapılandırılmadı" hatası verir
- [ ] **Sporcularımız sayfası**: gerçek/tam kadro verisi ve fotoğraf politikası netleşince hangi formatta (fotoğraflı/fotoğrafsız) geri eklenecek?
- [ ] **Git/GitHub/Vercel**: sizin belirttiğiniz gibi şimdilik yapılmıyor, ileride birlikte yapacağız.

## Nasıl çalıştırılır

```bash
npm run dev
```

Site `http://localhost:3000` adresinde açılır.
