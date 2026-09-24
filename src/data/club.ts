import { Trophy, Heart, Scale, TrendingUp, type LucideIcon } from "lucide-react";

export const club = {
  name: "Düşbelen SK",
  tagline: "Sporla Büyüyen Nesiller",
  motto: "Daha Güçlü, Daha İleri Düşbelen!",
  foundedYear: 2022,
  ageRange: "11-17",
  athleteCount: "100'e yakın",
  officialMatchCount: "+50",
  address: "Döğüşbelen Mahallesi Merkez 2. Sokak Köyceğiz/Muğla",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=D%C3%BC%C5%9Fbelen+Spor+Kul%C3%BCb%C3%BC+Okalipt%C3%BCs+Tesisleri",
  mapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3187.0655462208592!2d28.583721279345706!3d36.984368599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bf81002340344d%3A0xbe732e9caffd573c!2zRMO8xZ9iZWxlbiBTcG9yIEt1bMO8YsO8IE9rYWxpcHTDvHMgVGVzaXNsZXJp!5e0!3m2!1str!2str!4v1789826608910!5m2!1str!2str",
  // mapsEmbedSrc içindeki !2d (lng) ve !3d (lat) parametrelerinden çıkarıldı — JSON-LD geo/LocalBusiness için gerçek koordinat.
  geo: {
    latitude: 36.984368599999996,
    longitude: 28.583721279345706,
  },
  phone: "0532 616 00 48",
  phoneHref: "tel:+905326160048",
  whatsappNumber: "905326160048",
  instagramHandle: "@dusbelensk",
  instagramUrl: "https://www.instagram.com/dusbelensk/",
  description: [
    "Düşbelen SK, genç yetenekleri keşfetmek, mahalle kültürünü yaşatmak ve sporu çocukların hayatının merkezine taşımak amacıyla kurulmuş bir futbol kulübüdür.",
    "Alt yapılardan A takıma uzanan yapısıyla; disiplin, takım ruhu ve fair-play ilkelerini ön planda tutar. Antrenman programlarımız, lisanslı antrenörler eşliğinde bilimsel yöntemlerle planlanır.",
  ],
  highlights: [
    "Modern antrenman sahası ve soyunma odaları",
    "Lisanslı antrenör ve kaleci antrenörü ekibi",
    "Her yaş grubuna uygun çalışma programı",
    "Maç analizleri ve performans raporları",
  ],
  mission:
    "Bizim için her çocuk; önce iyi bir insan, sonra iyi bir sporcu olmayı öğrenir. Düşbelen SK, bu yolculuğun başlangıç noktasıdır.",
  quote: {
    text: "Spor, sadece bugünün değil, yarınların da daha iyi bir toplumunun teminatıdır.",
    author: "Yılmaz Erdoğan",
    role: "Kulüp Başkanı",
  },
  coachNote: {
    text: "Düşbelen SK'da her bir çocuğumuzun sahada ve hayatta güçlü durması için çalışıyoruz. Disiplin, karakter, saygı ve mücadele bizim için futbolun önüne geçen değerlerdir. Bu kulüp, sadece futbol oynanan bir yer değil; bir ailedir.",
    signature: "— Teknik Direktör",
  },
  // Futbol okulu online ön kayıt. Canlı değerler admin panelden (Site Ayarları) gelir;
  // QR kod kayıt linkinden her render'da üretilir (src/components/SchoolRegistration.tsx).
  footballSchool: {
    name: "Düşbelen Spor Futbol Okulu",
    athleteCount: "100'e yakın",
    birthYearFrom: 2015,
    birthYearTo: 2020,
    registrationUrl: "https://dusbelensk.sporokullari.org/kayit",
  },
  nextMatch: {
    opponent: "Rakip Takım",
    date: "14 Aralık 2025",
    time: "15:00",
    location: "Düşbelen SK Tesisleri",
    tag: "Hazırlık Maçı",
  },
} as const;

export const stats = [
  { number: "~100", label: "Sporcu" },
  { number: "6", label: "Yaş Grubu" },
  { number: String(club.foundedYear), label: "Kuruluş Yılı" },
  { number: club.officialMatchCount, label: "Resmi / Özel Maç" },
] as const;

export const statsBlurb =
  "Altyapıdan A takıma uzanan yapımızda; her sezon daha fazla çocuğa spor sevgisini aşılamayı hedefliyoruz.";

export type ValueItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

// Tüm ikonlar kasıtlı olarak aynı vurgu rengiyle (accent-bright) render edilir —
// dört değer eşit ağırlıkta olduğu için tek bir tutarlı renk, marka paletindeki
// renk çeşitliliğinin (çok renkli emoji ikonlar) yarattığı uyumsuzluğu ortadan kaldırır.
export const values: ValueItem[] = [
  {
    icon: Trophy,
    title: "Mücadele",
    description:
      "Skor tabelası ne olursa olsun; son düdüğe kadar pes etmeyen, rakibe saygılı ama oyuna asla teslim olmayan bir anlayışla sahadayız.",
  },
  {
    icon: Heart,
    title: "Takım Ruhu",
    description:
      "Her oyuncu, yanında oynayan arkadaşının da sorumluluğunu taşır. Birlikte savunur, birlikte hücum eder, hep beraber seviniriz.",
  },
  {
    icon: Scale,
    title: "Fair-Play",
    description:
      "Hakeme, rakibe ve tribüne duyulan saygı; kulübümüzün kırmızı çizgisidir. Oyunun ruhuna ve kurallarına sadık kalmak, bizim için önceliktir.",
  },
  {
    icon: TrendingUp,
    title: "Gelişim",
    description:
      "Her antrenman, her maç; oyuncularımız için bir öğrenme alanıdır. Hatalardan ders çıkaran, kendini sürekli geliştiren bir yapı hedefleriz.",
  },
];

export const parentInfo = {
  intro: [
    "Düşbelen SK'da her oyuncu, sahada olduğu kadar saha dışında da takip edilir. Antrenman programları, maç katılımları ve akademik hayat ile uyumlu bir planlama yapılmaya özen gösterilir.",
    "Velilerimizle düzenli iletişim kurarak; performans gelişimi, sağlık durumu ve takım içi davranışları hakkında bilgilendirme yapılır.",
  ],
  bullets: [
    "Haftalık antrenman programının önceden paylaşılması",
    "Maç günü toplanma ve ulaşım saatlerinin net planlanması",
    "Temel sağlık ve sakatlık durumlarında bilgilendirme",
    "Disiplin ve kulüp içi kuralların şeffaf şekilde iletilmesi",
  ],
  badges: ["Şeffaf ve yazılı kulüp kuralları", "Düzenli veli bilgilendirmesi"],
  cards: [
    {
      title: "Antrenman Programı",
      description:
        "Yaş gruplarına göre planlanan antrenman günleri ve saatleri sezon başında belirlenir ve gerektiğinde SMS / WhatsApp grupları üzerinden güncellenir.",
    },
    {
      title: "Lisans ve Evrak Süreci",
      description:
        "Oyuncu lisansı, sağlık raporu ve gerekli tüm resmi evraklarla ilgili kulüp yönetimi velilere rehberlik eder ve süreci birlikte yürütür.",
    },
    {
      title: "İletişim & Geri Bildirim",
      description:
        "Velilerimiz, teknik kadro ile belirli saatlerde birebir görüşme talep edebilir; oyuncunun gelişimi ve ihtiyaçları hakkında geri bildirim alabilir.",
    },
  ],
} as const;
