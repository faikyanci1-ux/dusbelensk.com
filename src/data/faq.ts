import { club } from "./club";

export const faq = [
  {
    question: "Hangi yaş gruplarına eğitim veriyorsunuz?",
    answer: `Kulübümüzde ${club.ageRange} yaş aralığındaki çocuklara altyapı futbolu eğitimi veriyoruz.`,
  },
  {
    question: "Futbol okuluna nasıl kayıt olurum?",
    answer: `${club.footballSchool.name} kayıtlarını online alıyoruz: Futbol Okulu sayfamızdaki QR kodu telefonunuzla okutun ya da "Hemen Ön Kayıt Ol" butonuna dokunarak ön kayıt formunu doldurun (${club.footballSchool.registrationUrl}). Formunuz bize ulaştıktan sonra sizi arıyoruz.`,
  },
  {
    question: "Kayıt öncesi sorularım için kime ulaşabilirim?",
    answer:
      "Ücret, antrenman saatleri, yaş grupları veya deneme antrenmanı hakkındaki tüm sorularınızı telefon ya da WhatsApp üzerinden bize sorabilirsiniz. Kayıt ise online ön kayıt formu üzerinden yapılır.",
  },
  {
    question: "Antrenman günleri ve saatleri nasıl öğrenilir?",
    answer:
      "Yaş gruplarına göre antrenman günleri ve saatleri sezon başında belirlenir; güncellemeler SMS ve WhatsApp grupları üzerinden velilerimizle paylaşılır.",
  },
  {
    question: "Lisans ve evrak süreci nasıl işliyor?",
    answer:
      "Oyuncu lisansı, sağlık raporu ve gerekli diğer resmi evraklarla ilgili kulüp yönetimi velilere rehberlik eder ve süreci birlikte yürütür.",
  },
  {
    question: "Aidat / kayıt ücreti ne kadar?",
    answer: "Güncel ücret bilgisi için lütfen bizimle telefon veya WhatsApp üzerinden iletişime geçin.",
  },
  {
    question: "Velilerle iletişim nasıl sağlanıyor?",
    answer:
      "Velilerimiz teknik kadromuzla belirli saatlerde birebir görüşme talep edebilir; oyuncunun gelişimi ve ihtiyaçları hakkında düzenli geri bildirim alır.",
  },
  {
    question: "Kulüp ne zaman kuruldu, kaç sporcunuz var?",
    answer: `Düşbelen SK ${club.foundedYear} yılında kuruldu ve şu anda ${club.athleteCount} sporcumuz bulunuyor.`,
  },
  {
    question: "Maç ve etkinlik duyurularını nereden takip edebilirim?",
    answer: `Güncel duyuruları Instagram hesabımızdan (${club.instagramHandle}) ve WhatsApp/telefon üzerinden takip edebilirsiniz.`,
  },
] as const;

export type FaqItem = (typeof faq)[number];
