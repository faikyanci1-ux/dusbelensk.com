export type BoardMember = {
  name: string;
  role: string;
  photo?: string;
  quote?: string;
  bio?: string;
  values?: string[];
  mottos?: string[];
};

export const managementBoard: BoardMember[] = [
  {
    name: "Yılmaz ERDOĞAN",
    role: "Kulüp Başkanı",
    photo: "/images/board/baskan-yilmaz-erdogan.jpg",
    quote: "Muğla yöresinde futbol oynayan çocuklar benim çocuklarım.",
    bio: "Sinema ve tiyatro dünyasında tanınan bir oyuncu, senarist ve yönetmen olan Yılmaz Erdoğan, Köyceğiz'deki çiftliğinde yıllardır düzenlediği futbol turnuvalarının ardından bu tutkuyu kurumsallaştırmak için Düşbelen SK'yı kurdu. C antrenörlük lisansına sahip olan Erdoğan, kulübün teknik çalışmalarında bizzat yer alarak bölgede lisanssız futbol oynayan çocukları keşfedip yetiştirmeyi kendine hedef edindi.",
    values: ["Takım Ruhu", "Gelişim", "Adalet", "Saygı", "Başarı"],
    mottos: ["Birlikte Daha Güçlüyüz", "İyi Futbolcu, İyi İnsan, İyi Vatandaş", "Futbol Karakterdir!"],
  },
  { name: "Ferat BİLGİN", role: "Yönetim Kurulu Üyesi" },
  { name: "Enes ERARSLAN", role: "Yönetim Kurulu Üyesi" },
  { name: "Koray KÖSE", role: "Yönetim Kurulu Üyesi" },
  { name: "Erdoğan KORKUT", role: "Yönetim Kurulu Üyesi" },
];

export const managementBoardNote =
  "Kulübün sportif ve idari vizyonunu belirleyen, sürdürülebilir yapıyı yöneten kurul.";

export const auditBoard: BoardMember[] = [
  { name: "Şeref DURSUN", role: "Denetleme Kurulu Başkanı" },
  { name: "Arda DİNDAR", role: "Denetleme Kurulu Üyesi" },
  { name: "Pınar YALTIRIK", role: "Denetleme Kurulu Üyesi" },
];

export const auditBoardNote =
  "Kulüp faaliyetlerinin mali ve idari denetimini şeffaflıkla yürüten kurul.";
