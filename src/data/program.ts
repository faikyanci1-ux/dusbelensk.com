export const program = [
  {
    code: "U-12",
    range: "11–12 yaş",
    title: "Temel Teknik",
    description: "Top hakimiyeti, temel teknik beceriler ve oyun zekasının geliştirilmesi.",
    days: "Salı · Perşembe",
    accent: "accent",
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
    accent: "accent",
  },
  {
    code: "U-16",
    range: "14–16 yaş",
    title: "Performans",
    description: "Performans odaklı antrenmanlar, fiziksel hazırlık ve maç deneyimi.",
    days: "Pazartesi · Perşembe",
    accent: "accent",
  },
] as const;

export type ProgramGroup = (typeof program)[number];
