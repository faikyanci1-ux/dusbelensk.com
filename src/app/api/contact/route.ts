import { NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { name, email, phone, message, childName, ageGroup, requestType, website } = await request.json();

  // Honeypot: gerçek kullanıcılar bu alanı görmez/doldurmaz, botlar doldurur.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const isTrial = requestType === "trial";

  if (!name || !(email || phone)) {
    return NextResponse.json(
      { error: "Ad Soyad ve en az bir iletişim bilgisi (telefon veya e-posta) zorunludur." },
      { status: 400 }
    );
  }

  if (!isTrial && !message) {
    return NextResponse.json({ error: "Mesaj alanı zorunludur." }, { status: 400 });
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const fieldsWithinLimits =
    name.length <= MAX_FIELD_LENGTH &&
    (!phone || phone.length <= MAX_FIELD_LENGTH) &&
    (!email || email.length <= MAX_FIELD_LENGTH) &&
    (!childName || childName.length <= MAX_FIELD_LENGTH) &&
    (!ageGroup || ageGroup.length <= MAX_FIELD_LENGTH) &&
    (!message || message.length <= MAX_MESSAGE_LENGTH);

  if (!fieldsWithinLimits) {
    return NextResponse.json({ error: "Girilen bilgilerden biri çok uzun." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!apiKey || !to) {
    console.error("RESEND_API_KEY veya CONTACT_EMAIL_TO tanımlı değil.");
    return NextResponse.json(
      { error: "İletişim formu henüz yapılandırılmadı. Lütfen telefonla ulaşın." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const subject = isTrial
    ? `Deneme Antrenmanı / Kayıt Başvurusu: ${name}`
    : `Web sitesi mesajı: ${name}`;

  const bodyLines = [
    `Talep Türü: ${isTrial ? "Deneme Antrenmanı / Kayıt Başvurusu" : "Genel Mesaj"}`,
    `Veli Ad Soyad: ${name}`,
    `Telefon: ${phone ?? "-"}`,
    `E-posta: ${email ?? "-"}`,
  ];

  if (isTrial) {
    bodyLines.push(`Çocuğun Adı Soyadı: ${childName || "-"}`, `Yaş Grubu: ${ageGroup || "-"}`);
  }

  bodyLines.push("", "Not / Mesaj:", message || "-");

  const { error } = await resend.emails.send({
    from: "Düşbelen SK Web Sitesi <onboarding@resend.dev>",
    to,
    replyTo: email || undefined,
    subject,
    text: bodyLines.join("\n"),
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Mesaj gönderilirken bir hata oluştu." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
