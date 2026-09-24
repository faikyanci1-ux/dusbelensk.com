export const program = [
  {
    code: "U-11",
    range: "10–11 yaş",
    title: "Başlangıç",
    description: "Topla tanışma, temel motor beceriler ve oyun sevgisinin aşılanması.",
    days: "Pazartesi · Çarşamba",
    accent: "accent",
  },
  {
    code: "U-12",
    range: "11–12 yaş",
    title: "Temel Teknik",
    description: "Top hakimiyeti, temel teknik beceriler ve oyun zekasının geliştirilmesi.",
    days: "Salı · Perşembe",
    accent: "accent-2",
  },
  {
    code: "U-13",
    range: "12–13 yaş",
    title: "Gelişim",
    description: "Pozisyon bilgisi, takım oyunu ve karar verme becerilerinin pekiştirilmesi.",
    days: "Çarşamba · Cumartesi",
    accent: "accent",
  },
  {
    code: "U-14",
    range: "13–14 yaş",
    title: "Rekabet",
    description: "Rekabetçi oyun anlayışı, taktik disiplin ve maç deneyiminin artırılması.",
    days: "Salı · Cuma",
    accent: "accent-2",
  },
  {
    code: "U-15",
    range: "14–15 yaş",
    title: "İleri Taktik",
    description: "İleri taktik anlayış, fiziksel gelişim ve bireysel oyun kalitesinin yükseltilmesi.",
    days: "Pazartesi · Perşembe",
    accent: "accent",
  },
  {
    code: "U-17",
    range: "15–17 yaş",
    title: "Performans",
    description: "Performans odaklı antrenmanlar, fiziksel hazırlık ve maç deneyimi.",
    days: "Salı · Cumartesi",
    accent: "accent-2",
  },
] as const;

export type ProgramGroup = {
  code: string;
  range: string;
  title: string;
  description: string;
  days: string;
  /** Kart üst çizgisi rengi; sırayla dönüşümlü verilir. */
  accent: "accent" | "accent-2";
};
