export type StaffMember = {
  id: number;
  name: string;
  role: string;
  description: string;
  photo: string;
  quote?: string;
};

export const staff: StaffMember[] = [
  {
    id: 1,
    name: "Arda Dindar",
    role: "Gençlik Gelişim Direktörü / U-13 ve U-14 Teknik Sorumlusu",
    description:
      "Gençlik gelişim direktörü; U-13 ve U-14 yaş gruplarının teknik gelişimini, fiziksel hazırlığını ve takım ruhunu birlikte inşa eder.",
    photo: "/images/staff/arda-dindar.jpg",
    quote: "Altyapı, bugünün çocukları yarının Düşbelen'i...",
  },
  {
    id: 5,
    name: "Polat Ertek",
    role: "U-11 ve U-12 Teknik Sorumlusu",
    description:
      "U-11 ve U-12 yaş gruplarında teknik gelişim, fiziksel gelişim ve takım ruhunu birlikte inşa eden, özgüven ve ahlaki değerlere önem veren bir anlayışla çalışır.",
    photo: "/images/staff/polat-ertek.jpg",
    quote: "Küçük adımlarla büyük yarınlara...",
  },
  {
    id: 2,
    name: "Selim Özkan",
    role: "U-15 ve U-17 Teknik Sorumlusu",
    description:
      "U-15 ve U-17 yaş gruplarında teknik gelişim ve performans takibini, bireysel rehberliği ve hedef odaklı eğitim planlarını yürütür.",
    photo: "/images/staff/selim-ozkan.jpg",
    quote: "Bugünün çalışması, yarının güçlü Düşbelen'ini inşa eder.",
  },
  {
    id: 6,
    name: "Ferdi Sül",
    role: "Malzeme Tedarik Departman Sorumlusu",
    description:
      "Spor malzemeleri tedariği, takım ekipman yönetimi, lojistik ve stok takibini planlayıp takımlara kesintisiz destek sağlar.",
    photo: "/images/staff/ferdi-sul.jpg",
    quote: "Doğru ekipman, daha güçlü yarınlar.",
  },
  {
    id: 3,
    name: "İsmail Kaya",
    role: "Kaleci Departmanı Sorumlusu",
    description:
      "Kalecilerin teknik çalışmaları, refleks gelişimi ve maç performanslarını planlar ve takip eder.",
    photo: "/images/staff/kaleci-antrenoru.jpg",
  },
  {
    id: 4,
    name: "Gökhan Karabıyık",
    role: "Saha ve Ekipman Koordinatörü",
    description: "Saha içindeki düzen, ekipman ve maç günü hazırlıklarının görünmeyen mimarıdır.",
    photo: "/images/staff/fizik-performans.jpg",
  },
];
