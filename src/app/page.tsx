import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Users,
  GraduationCap,
  CalendarDays,
  Trophy,
  CheckCircle2,
  MapPin,
  Phone,
} from "lucide-react";
import {
  getClubInfo,
  getStats,
  getValues,
  getVideos,
  getGallery,
  getLeadershipHighlights,
  getNews,
  getUpcomingEvents,
  getFaq,
  getProgram,
} from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { Marquee } from "@/components/Marquee";
import { VideoCard } from "@/components/VideoCard";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { LeadershipSlider } from "@/components/LeadershipSlider";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { NewsCarousel } from "@/components/NewsCarousel";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { SchoolQrCode, SchoolRegisterButton } from "@/components/SchoolRegistration";
import { getDateBadge } from "@/lib/formatDate";
import type { GalleryItem } from "@/data/gallery";

const STAT_ICONS = [Users, GraduationCap, CalendarDays, Trophy];

const storyGallery: GalleryItem[] = [
  { id: 101, src: "/images/hakkinda-1.jpg", alt: "Düşbelen SK Okaliptüs Tesisleri", size: "large" },
  { id: 102, src: "/images/hakkinda-2.jpg", alt: "Düşbelen SK sahası ve kulüp flaması" },
  { id: 103, src: "/images/gallery/rakip-mac-1.jpg", alt: "Maç günü, rakip takımla grup fotoğrafı" },
  { id: 104, src: "/images/hakkinda-3.jpg", alt: "Düşbelen SK yedek kulübesi ve saha aydınlatması" },
  { id: 105, src: "/images/gallery/kupa-toreni-1.jpg", alt: "Kupa töreni" },
  { id: 106, src: "/images/gallery/kulup-ailesi.jpg", alt: "Düşbelen SK aile sıcaklığı" },
  { id: 107, src: "/images/gallery/takim-toplantisi.jpg", alt: "Maç öncesi taktik toplantısı" },
  { id: 108, src: "/images/gallery/tesis-havadan-cati.jpg", alt: "Düşbelen SK tesis binası havadan görünüm" },
  { id: 109, src: "/images/gallery/teknik-ekip-antrenman.jpg", alt: "Teknik ekip antrenman başında" },
];

const JOIN_BENEFITS = [
  "Deneme antrenmanı imkanı",
  "Lisanslı antrenörler eşliğinde eğitim",
  "Modern tesislerde spor yapma fırsatı",
  "Maç ve turnuva katılımları",
  "Düzenli veli bilgilendirmesi",
];

const PROGRAM_ACCENT_CLASSES: Record<string, string> = {
  accent: "border-t-accent",
  "accent-2": "border-t-accent-2",
};

export default async function HomePage() {
  const [club, stats, values, videos, gallery, leadership, news, upcomingEvents, faq, program] =
    await Promise.all([
      getClubInfo(),
      getStats(),
      getValues(),
      getVideos(),
      getGallery(),
      getLeadershipHighlights(),
      getNews(),
      getUpcomingEvents(),
      getFaq(),
      getProgram(),
    ]);
  const whatsappHref = `https://wa.me/${club.whatsappNumber}?text=${encodeURIComponent(
    "Merhaba, ücretsiz deneme antrenmanı hakkında bilgi almak istiyorum."
  )}`;
  const facilityVideo = videos.find((v) => v.caption.includes("Havadan")) ?? videos[1];

  const heroSlides: HeroSlide[] = [
    { type: "video", src: videos[0].src, poster: videos[0].poster, caption: videos[0].caption },
    { type: "image", src: gallery[0].src, caption: gallery[0].alt },
    { type: "image", src: gallery[2].src, caption: gallery[2].alt },
    { type: "video", src: videos[1].src, poster: videos[1].poster, caption: videos[1].caption },
    { type: "image", src: gallery[1].src, caption: gallery[1].alt },
    { type: "image", src: gallery[4].src, caption: gallery[4].alt },
    { type: "video", src: videos[2].src, poster: videos[2].poster, caption: videos[2].caption },
    { type: "image", src: gallery[3].src, caption: gallery[3].alt },
    { type: "image", src: gallery[5].src, caption: gallery[5].alt },
    { type: "video", src: videos[3].src, poster: videos[3].poster, caption: videos[3].caption },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[680px]">
        <div className="absolute inset-0 overflow-hidden">
          <HeroSlider slides={heroSlides} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-main/8 to-bg-main" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main/70 via-bg-main/20 to-transparent sm:from-bg-main/50 sm:via-transparent sm:to-transparent" />
        </div>

        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4 pt-20 pb-8 sm:px-6 sm:pt-0 sm:pb-0">
          <div className="max-w-2xl">
            <span className="font-script mb-5 block -rotate-2 text-3xl leading-none text-accent-bright sm:text-4xl">
              {club.motto}
            </span>
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-bright">
              <span className="h-px w-6 bg-accent-bright" />
              Köyceğiz&apos;in genç futbolcuları için
            </span>
            <h1 className="mt-5 font-display text-4xl uppercase leading-[1.6] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Geleceğin
              <br />
              <span className="text-accent-bright">Sporcularını</span>
              <br />
              Yetiştiriyoruz.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-text-muted">
              {club.ageRange} yaş arası çocuk ve gençlere, {club.nextMatch.location}&apos;nde lisanslı
              antrenörler eşliğinde futbol eğitimi.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/iletisim"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
              >
                Ücretsiz Deneme Kaydı
              </Link>
              <a
                href={club.footballSchool.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-bg-main transition hover:brightness-95"
              >
                Futbol Okulu Kaydı
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white"
              >
                WhatsApp İle Bilgi Al
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 right-6 z-10 hidden h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent-bright text-center shadow-xl sm:flex">
          <span className="text-[11px] font-bold uppercase leading-tight text-bg-main">
            {club.foundedYear}&apos;den
            <br />
            Beri Sahadayız
          </span>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 rounded-2xl border border-border-soft bg-bg-raised/90 p-5 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Sıradaki Maç
            </span>
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt={club.name} width={28} height={28} />
              <span className="text-sm font-semibold text-white">{club.name}</span>
              <span className="text-xs font-bold text-accent-bright">VS</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border-soft text-text-muted">
                <Shield size={14} />
              </div>
              <span className="text-sm text-text-muted">{club.nextMatch.opponent}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-white">
              {club.nextMatch.date} • {club.nextMatch.time}
            </span>
            <span className="text-text-muted">· {club.nextMatch.location}</span>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-bright">
              {club.nextMatch.tag}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-border-soft px-3 py-1 text-xs font-medium text-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
              </span>
              Canlı Skor Yakında
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <Marquee />
      </div>

      {/* HİKAYEMİZ + HAKKIMIZDA */}
      <section className="bg-cream py-20 text-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Bizim Hikayemiz</span>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1.6] tracking-tight sm:text-5xl">
                Mahallenin
                <br />
                Yüreğinden,
                <br />
                <span className="text-accent">Sahanın Kalbine.</span>
              </h2>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-deep">
                  {club.foundedYear}&apos;den beri sahada
                </span>
                <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-deep">
                  {club.licensedPlayerCount} lisanslı sporcu
                </span>
                <span className="rounded-full border border-accent-2/30 bg-accent-2-soft px-3 py-1 text-xs font-semibold text-accent-2">
                  Altyapı odaklı kulüp
                </span>
              </div>

              {club.description.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-ink-muted">
                  {paragraph}
                </p>
              ))}

              <p className="mt-4 font-semibold text-ink">{club.mission}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {club.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 rounded-xl border border-black/10 bg-black/[0.02] p-3.5">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-accent-2" size={18} strokeWidth={2} />
                    <span className="text-sm text-ink">{item}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-6 rounded-r-xl border-l-2 border-accent bg-accent-soft/30 py-3 pl-4 pr-4 text-ink-muted italic">
                &ldquo;{club.quote.text}&rdquo;
                <span className="mt-2 block font-script text-xl not-italic text-accent-deep">{club.quote.author}</span>
                <span className="block text-xs not-italic uppercase tracking-wide text-ink-muted">
                  {club.quote.role}
                </span>
              </blockquote>

              <Link
                href="/hakkimizda"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Kulübümüzü Tanı
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="lg:sticky lg:top-28">
              <GalleryLightbox items={storyGallery} compact />
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <MapPin size={18} />
                </span>
                <p className="text-sm text-ink-muted">
                  <span className="font-semibold text-ink">Köyceğiz, Muğla</span> — Okaliptüs Tesisleri&apos;nde
                  her hafta onlarca genç sporcu antrenman sahasında ter döküyor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUTBOL OKULU — ONLINE ÖN KAYIT */}
      <section className="relative overflow-hidden bg-bg-main py-20">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/kadro-toplu-foto.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/90 to-bg-main/60" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent-light">
                {club.footballSchool.name}
              </span>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1.6] tracking-tight text-white sm:text-5xl">
                {club.footballSchool.athleteCount}
                <br />
                <span className="text-accent-bright">Sporcumuzla Birlikte.</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/80">
                Futbol okulumuz için kayıtlarımızı artık buradan alıyoruz. QR kodu telefonunuzla okutun ya da butona
                dokunun, ön kayıt formunu birkaç dakikada doldurun.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <SchoolRegisterButton />
                <Link
                  href="/futbol-okulu"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Futbol Okulu Hakkında
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <SchoolQrCode size={200} />
              <span className="text-xs uppercase tracking-wider text-text-muted">Telefonunuzla okutun</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESİSTEN BİR KARE */}
      <section className="border-t border-black/10 bg-cream pt-16 pb-20 text-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            tone="light"
            align="left"
            eyebrow="Tesisimiz"
            title="Tesisten Bir Kare"
            description="Okaliptüs Tesisleri'nde sahalarımız, altyapımız ve rakamlarla Düşbelen SK."
          />
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <VideoCard src={facilityVideo.src} poster={facilityVideo.poster} caption={facilityVideo.caption} />
              <div className="grid grid-cols-2 gap-4 p-8 sm:p-10">
                {stats.map((stat, i) => {
                  const Icon = STAT_ICONS[i];
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-center transition duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent-soft/20"
                    >
                      {Icon && <Icon className="mx-auto mb-2 text-accent" size={22} strokeWidth={1.75} />}
                      <div className="font-display text-3xl text-accent sm:text-4xl">{stat.number}</div>
                      <div className="mt-1 text-xs uppercase leading-tight tracking-wide text-ink-muted">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GELİŞİM PROGRAMI */}
      <section className="border-t border-border-soft/40 bg-bg-pitch py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent-light">
                Gelişim Programı
              </span>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1.6] tracking-tight text-white sm:text-5xl">
                Her Yaşta
                <br />
                <span className="text-accent-bright">Bir Sonraki Adım.</span>
              </h2>
            </div>
            <p className="text-text-muted">
              Çocuğun yaşına ve gelişim seviyesine göre şekillenen, disiplinli ama keyifli antrenmanlar.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {program.map((group, i) => (
              <div
                key={group.code}
                className={`group relative overflow-hidden rounded-b-2xl border border-t-4 border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:bg-black/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${PROGRAM_ACCENT_CLASSES[group.accent]}`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-3 font-display text-6xl text-white/[0.06] transition duration-300 group-hover:text-white/10"
                >
                  0{i + 1}
                </span>
                <div className="relative">
                  <div className="font-display text-3xl text-white">{group.code}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent-light">
                    {group.range}
                  </div>
                  <p className="mt-3 text-sm text-text-muted">{group.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* DEĞERLERİMİZ */}
      <section className="bg-bg-pitch py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-light">Düşbelen SK</span>
            <h2 className="mt-2 font-display text-4xl uppercase leading-[1.6] tracking-tight text-white sm:text-5xl">
              Takım Değerlerimiz
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-muted">
              Sahada kazanmaktan önce doğru karakteri kazanmayı hedefleriz.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-tight text-white">Düşbelen ruhu nedir?</h3>
              <p className="mt-4 text-text-muted">
                Düşbelen SK&apos;da &ldquo;kazanan takım&rdquo; olmanın yolu; skordan önce doğru duruşa sahip
                oyuncular yetiştirmekten geçer. Antrenmanlardan maç gününe kadar, her adımda bu dört temel değeri
                merkeze alırız.
              </p>
              <p className="mt-4 border-l-2 border-accent-bright py-3 pl-4 pr-4 text-text-muted">
                Aile ortamı, disiplin ve saygı üzerine kurulu bu yapı; çocuklarımızın hem sahada hem de hayatta
                güçlü bireyler olarak büyümesini hedefler.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-l-4 border-border-soft border-l-accent-bright bg-bg-raised p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-accent-bright/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_34px_rgba(0,0,0,0.4)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-bright bg-accent-bright/10">
                    <value.icon size={24} strokeWidth={2} className="text-accent-bright" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{value.title}</h3>
                  <p className="mt-2 text-sm text-text-muted">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KULÜPTEN KARELER */}
      <section className="bg-navy-tint py-20 text-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            tone="light"
            eyebrow="Sahadan"
            title="Kulüpten Kareler"
            description="Sahamızdan drone görüntüleri, maç anları ve kulüp atmosferi."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-flow-dense lg:grid-cols-3">
            {videos.map((video, i) => (
              <VideoCard
                key={video.id}
                src={video.src}
                poster={video.poster}
                caption={video.caption}
                featured={i === 0}
              />
            ))}
          </div>

          <div className="mt-16 border-t border-black/10 pt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-accent-2">Fotoğraf Galerisi</span>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
                  Maçlardan, Antrenmanlardan Kareler
                </h3>
              </div>
              <Link
                href="/galeri"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-accent-2 decoration-2 underline-offset-4"
              >
                Tüm Galeriyi Gör
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <GalleryLightbox items={gallery.slice(0, 8)} compact />
          </div>
        </div>
      </section>

      {/* SON HABERLER */}
      {news.length > 0 && (
        <section className="border-t border-border-soft/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Kulüp Gündemi"
              title="Son Haberler"
              description="Kulübümüzden en güncel haberler ve duyurular."
            />
            <div className="mt-12">
              <NewsCarousel items={news} />
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/haberler"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Tüm Haberler
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* YAKLAŞAN ETKİNLİKLER */}
      {upcomingEvents.length > 0 && (
        <section className="bg-cream py-20 text-ink">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading
              tone="light"
              eyebrow="Takvim"
              title="Yaklaşan Etkinlikler"
              description="Kulübümüzde gerçekleşecek maç, turnuva ve etkinlikler."
            />
            <div className="mt-12 space-y-4">
              {upcomingEvents.map((event) => {
                const { day, month } = getDateBadge(event.date);
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 rounded-2xl border-l-4 border-accent bg-black/[0.03] p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-black/[0.05] hover:shadow-md"
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center">
                      <span className="font-display text-2xl leading-none text-ink">{day}</span>
                      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                        {month}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-ink">{event.title}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{event.detail}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-deep">
                      {event.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* YÖNETİM VE TEKNİK KADRO */}
      {leadership.length > 0 && (
        <section className="border-t border-border-soft/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Kadromuzla Tanışın"
              title="Yönetim ve Teknik Kadro"
              description="Düşbelen SK'yı sahada ve idari yapıda temsil eden isimler."
            />
            <div className="mt-12">
              <LeadershipSlider items={leadership} />
            </div>
          </div>
        </section>
      )}

      {/* İLK ADIMI AT — CTA + FORM */}
      <section className="relative overflow-hidden bg-bg-pitch py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent-light">
                İlk Adımı At
              </span>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1.6] tracking-tight text-white sm:text-5xl">
                Çocuğunuzun
                <br />
                <span className="text-accent-bright">Oyunu Başlasın.</span>
              </h2>
              <p className="mt-4 max-w-md text-white/80">
                Ücretsiz deneme antrenmanı için formu doldurun. Sizi arayalım, birlikte en uygun grubu bulalım.
              </p>
              <div className="mt-6 space-y-3">
                {JOIN_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2.5">
                    <CheckCircle2 className="shrink-0 text-accent-bright" size={18} strokeWidth={2} />
                    <span className="text-sm text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
              <a
                href={club.phoneHref}
                className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6 text-sm text-white/80 hover:text-white"
              >
                <Phone size={16} className="text-accent-bright" />
                Acil sorularınız için: {club.phone}
              </a>
            </div>

            <div className="rounded-2xl bg-cream p-6 shadow-2xl sm:p-8">
              <h3 className="font-display text-xl uppercase tracking-tight text-ink">Ücretsiz Deneme Kaydı</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Form doldurmanıza gerek yok — WhatsApp&apos;tan yazın, size hemen dönelim.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:brightness-110"
              >
                <WhatsAppIcon size={22} />
                WhatsApp&apos;tan Yaz
              </a>
              <a
                href={club.phoneHref}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-ink-muted transition hover:text-ink"
              >
                <Phone size={16} />
                {club.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VELİ REHBERİ — SSS */}
      <section className="bg-cream py-20 text-ink">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading tone="light" eyebrow="Veli Rehberi" title="Merak Ettikleriniz, Net Cevaplar." />
          <div className="mt-12 space-y-3">
            {faq.slice(0, 4).map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-black/10 bg-black/[0.02] p-5 transition duration-300 hover:border-accent/30 open:border-accent"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:hidden transition group-hover:text-accent-deep">
                  {item.question}
                  <span className="shrink-0 text-lg leading-none text-accent transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-muted">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/sss"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4"
            >
              Tüm Soruları Gör
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* BİZE ULAŞIN */}
      <section className="bg-cream py-20 text-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Bize Ulaşın</span>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1.6] tracking-tight sm:text-5xl">
                Takımın Bir Parçası
                <br />
                <span className="text-accent">Olmaya Hazır Mısın?</span>
              </h2>
              <div className="mt-8 space-y-4">
                <a
                  href={club.phoneHref}
                  className="flex items-center gap-3 text-sm text-ink-muted hover:text-ink"
                >
                  <Phone size={16} className="text-accent-2" /> {club.phone}
                </a>
                <a
                  href={club.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-ink-muted hover:text-ink"
                >
                  <InstagramIcon size={16} className="text-accent-2" /> {club.instagramHandle}
                </a>
                <a
                  href={club.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-ink-muted hover:text-ink"
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent-2" /> {club.address}
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-black/10">
              <iframe
                src={club.mapsEmbedSrc}
                width="100%"
                height="320"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${club.name} Konum`}
              />
              <a
                href={club.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-bg-main/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-accent-2"
              >
                Haritada Aç
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
