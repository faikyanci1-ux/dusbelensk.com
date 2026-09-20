---
name: web-design-guidelines
description: Vercel'in web arayüzü tasarım kılavuzu (interactions, animation, layout, content, forms, performance, design, copywriting). UI kodu incelerken/denetlerken kullan — kaynak https://vercel.com/design/guidelines
---

# Web Interface Guidelines (Vercel)

Bu kılavuz, bir sayfa/bileşenin UI kalitesini denetlerken kontrol listesi olarak kullanılır. Kaynak: https://vercel.com/design/guidelines

## Interactions
- Klavye her yerde çalışır; tüm akışlar WAI-ARIA Authoring Patterns'i izler
- Her odaklanabilir elementte net görünür focus; `:focus` yerine `:focus-visible` kullan
- Gruplanmış kontroller için `:focus-within` ayarla
- Sticky header/footer odaklanmış elementleri asla örtmez
- Focus trap ile odağı yönet; WAI-ARIA Patterns'e göre taşı ve geri döndür
- Görsel ve tıklama alanı eşleşsin; 24px altını ≥24px'e (mobilde 44px) genişlet
- Mobilde input font boyutu ≥16px (iOS Safari otomatik zoom'unu önlemek için)
- Tarayıcı zoom'unu asla devre dışı bırakma
- Input'lar hydration sonrası focus ve değerini korur
- Input/textarea'da yapıştırmayı asla devre dışı bırakma
- Loading butonları orijinal etiketi korurken gösterge gösterir
- Spinner/skeleton'lara show-delay (~150–300ms) ve minimum görünme süresi (~300–500ms) ekle
- Paylaşım, yenileme, İleri/Geri navigasyonu için durumu URL'de tut
- Optimistic update'ler için UI'ı anında güncelle; sunucu yanıtında uzlaştır
- Takip/yükleme açan menü seçenekleri üç nokta ile biter
- Yıkıcı eylemler için onay iste veya Geri Al sağla
- Kontrollerde çift dokunma zoom'unu önlemek için `touch-action: manipulation` ayarla
- `webkit-tap-highlight-color`'ı tasarıma göre ayarla
- Cömert tıklama alanları ve net affordance'larla bağışlayıcı etkileşimler tasarla
- Gruptaki ilk tooltip gecikmeli, sonrakiler gecikmesiz
- Modal/drawer'larda `overscroll-behavior: contain` bilinçli ayarla
- İleri/Geri önceki scroll pozisyonunu geri yükler
- Masaüstünde tek birincil input'a autofocus; mobilde nadiren
- Ölü bölge olmasın; bir kontrolün parçası tıklanabilir görünüyorsa tıklanabilir olsun
- Her şeyi deep-link yap: filtreler, sekmeler, sayfalama, genişletilmiş paneller
- Sürükleme etkileşimlerinde metin seçimini devre dışı bırak, `inert` uygula
- Jest alternatifleri: sürükleme/kaydırma/sıkıştırma tap/click ve klavye ile de çalışır
- Navigasyon için `<a>`/`<Link>` kullan; `<button>`/`<div>` ile değiştirme
- Toast ve doğrulama için polite `aria-live` ile async güncellemeleri duyur
- QWERTY olmayan klavye düzenleri için klavye kısayollarını yerelleştir

## Animations
- `prefers-reduced-motion`'a uyan azaltılmış hareket varyantı sağla
- Tercih sırası: CSS > Web Animations API > JS kütüphaneleri
- GPU hızlandırmalı özellikleri (`transform`, `opacity`) önceliklendir; reflow tetikleyenlerden kaçın
- Sadece neden/sonucu netleştiriyorsa veya bilinçli keyif katıyorsa animasyon uygula
- Easing'i neyin değiştiğine göre seç (boyut, mesafe, tetikleyici)
- Animasyonlar kullanıcı girdisiyle iptal edilebilir olsun
- Sessiz, gerekli olmayan döngüler dışında otomatik oynatmadan kaçın
- 5 saniyeden uzun otomatik oynayan hareket duraklat/durdur/gizle kontrolü gerektirir
- Hareketi "fiziksel" başlangıç noktasına doğru transform-origin ile bağla
- `transition: all` asla kullanma; hedeflenen özellikleri açıkça listele
- SVG için CSS transform/animasyonları `<g>` sarmalayıcılara uygula; `transform-box: fill-box; transform-origin: center;` ayarla

## Layout
- Algı geometriyi yendiğinde hizalamayı ±1px ayarla
- Her element ızgara, taban çizgisi, kenar veya optik merkeze bilinçli hizalanır
- Metin ve ikon yan yana durduğunda ağırlık/boyut/boşluk/rengi ayarla
- Mobil, laptop ve ultra-geniş ekranda (zoom %50'ye kadar) responsive kapsamı doğrula
- Çentik ve insetler için safe-area değişkenlerini kullan
- Sadece gerekli scrollbar'ları render et; overflow sorunlarını düzelt
- JS ölçümü yerine flex/grid/intrinsic layout tercih et

## Content
- Satır içi açıklamaları tercih et; tooltip'i son çare olarak kullan
- Skeleton'lar layout kaymasını önlemek için nihai içeriği birebir yansıtır
- `<title>` mevcut bağlamı yansıtır
- Her ekran bir sonraki adımı veya kurtarma yolunu sunar
- Tüm durumları tasarla: boş, seyrek, yoğun, hata
- Düz tırnak yerine kıvrık tırnak kullan (" ")
- Rag'i düzenle, yetim/dul satırlardan kaçın
- Sayı karşılaştırmaları için `font-variant-numeric: tabular-nums` kullan
- Sadece renge güvenme; durum için metin etiketi de ekle
- İkonların görme engelliler için metin etiketi olsun
- Görsel düzende etiket gizlenebilir ama erişilebilir isim hep var olmalı
- Üç nokta yerine `…` karakterini kullan
- Bölümlere link verirken `scroll-margin-top` ayarla
- Layout'lar kısa, ortalama ve çok uzun içeriği idare eder
- Tarih/saat/sayı/ayraç/para birimini kullanıcının yereline göre biçimlendir
- Dili IP/GPS değil `Accept-Language` header'ı ve `navigator.languages` ile tespit et
- Marka/ürün adlarını, kod token'larını `translate="no"` ile sarmala
- `aria-label` ile doğru isimler ver; dekorasyonu `aria-hidden` ile gizle
- Sadece ikonlu butonlar açıklayıcı `aria-label` sağlar
- `aria-*`'den önce native elementleri tercih et
- Hiyerarşik `<h1–h6>` ve "İçeriğe geç" linki kullan
- Konuşmayı ve anlamlı sesleri altyazılı yap; ses-only içerik için transkript sağla
- Temel görsel bilgiyi betimle; dekoratif medyayı yardımcı teknolojiden gizle
- Medya kontrolleri klavyeyle çalışır
- Yapışık terimler için non-breaking space kullan: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`

## Forms
- Text input odaklıyken (tek kontrol veya son kontrolse) Enter gönderir
- `<textarea>`'da ⌘/⌃+Enter gönderir; Enter yeni satır ekler
- Her kontrolün `<label>`'ı veya ilişkili etiketi var
- `<label>`'a tıklamak ilişkili kontrolü odaklar
- Submit'i gönderim başlayana kadar etkin tut; sonra devre dışı bırak, spinner göster, idempotency key ekle
- Alan sadece sayı kabul etse bile herhangi bir girdiye izin ver; doğrulama geri bildirimi göster
- Submit'i önceden devre dışı bırakma; eksik formların gönderilmesine izin ver
- Checkbox/radio'larda ölü bölge olmasın; etiket ve kontrol tek cömert tıklama alanını paylaşır
- Hataları ilgili alanların yanında göster; gönderimde ilk hataya odaklan
- Autofill için `autocomplete` ve anlamlı `name` değerleri ayarla
- E-posta, kod, kullanıcı adı gibi alanlarda spellcheck'i kapat
- Daha iyi klavye ve doğrulama için doğru `type` ve `inputmode` kullan
- Placeholder boşluğu işaret eder; üç nokta ile biter
- Placeholder değeri örnek/kalıp gösterir, örn. `+1 (123) 456-7890`
- Veri kaybı riski varsa navigasyon öncesi uyar
- Şifre yöneticisi ve 2FA uyumluluğu sağla; tek seferlik kodların yapıştırılmasına izin ver
- Auth olmayan alanlarda şifre yöneticisini tetikleme; `autocomplete="off"` veya özel token kullan
- Kafa karıştırıcı hata mesajlarını önlemek için input değerini trimle
- Windows karanlık modu için native `<select>`'te `background-color` ve `color`'ı açıkça ayarla

## Performance
- iOS Düşük Güç Modu ve macOS Safari'de test et
- Ölçüm sırasında ek yük getiren eklentileri devre dışı bırak
- Re-render'ları minimize et; React DevTools veya React Scan ile takip et
- CPU ve ağ throttling ile test et
- Okuma/yazmaları toplu yap; gereksiz reflow/repaint'ten kaçın
- `POST/PATCH/DELETE` <500ms'de tamamlanır
- Uncontrolled input'ları tercih et; controlled döngüleri ucuz yap
- Büyük listeleri virtualize et (örn. virtua veya `content-visibility: auto`)
- Sadece above-the-fold görselleri preload et; kalanını lazy-load yap
- CLS'yi önlemek için açık görsel boyutları ayarla ve alan ayır
- Asset/CDN domainleri için `<link rel="preconnect">` kullan
- Flash ve layout shift'i önlemek için kritik fontları preload et
- Sadece kullanılan code point/script'leri unicode-range ile subset et
- Uzun görevleri sayfa etkileşimini bloklamamak için Web Worker'lara taşı
- Animasyonlu GIF yerine `<video autoplay muted loop playsinline>` tercih et
- Video için sabit alternatif sağla; `prefers-reduced-motion`'a uy

## Design
- Ortam ve direkt ışığı en az iki gölge katmanıyla taklit et
- Keskin kenarlar için border ve yarı saydam border'ları gölgeyle birleştir
- Çocuk radius ≤ ebeveyn radius ve eğriler hizalansın diye concentric olsun
- Nötr olmayan arka planlarda border/gölge/metni aynı tona doğru tintle
- Grafikler için renk körü dostu paletler kullan
- Daha doğru algısal kontrast için WCAG 2 yerine APCA tercih et
- `:hover`, `:active`, `:focus` durumlarında kontrastı artır
- Tarayıcının tema rengini sayfa arka planıyla hizalamak için `<meta name="theme-color">` ayarla
- Karanlık temalarda doğru kontrast için `<html>`'e `color-scheme: dark` uygula

## Copywriting
- Aktif ses kullan: "CLI'yi kur" — "CLI kurulacak" değil
- Başlık ve butonlarda Title Case
- Net ve öz ol; minimal kelime kullan
- Eylem odaklı dil kullan
- Tutarlı isimler kullan; az sayıda benzersiz terim tanıt
- İkinci şahısla yaz; birinci şahıstan kaçın
- Sayım için rakam kullan: "8 kayıt" — "sekiz kayıt" değil
- Sayı ve birimi boşlukla ayır: `10 MB`, `10MB` değil
- Mesajları cesaretlendirici, çözüm odaklı çerçevele (hatalar dahil)
- Hata mesajları çıkışı yönlendirir: nasıl düzeltileceğini söyle
- Etiketler net ve spesifik olsun: "API Anahtarını Kaydet" — "Devam Et" değil
