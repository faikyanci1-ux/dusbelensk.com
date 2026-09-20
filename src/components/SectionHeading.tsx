export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "dark",
  align = "center",
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "dark" | "light";
  align?: "center" | "left";
  /** Sayfada PageHero (h1) yoksa bu SectionHeading sayfanın tek h1'i olmalı. Varsayılan h2. */
  as?: "h1" | "h2";
}) {
  const titleColor = tone === "light" ? "text-ink" : "text-white";
  const descColor = tone === "light" ? "text-ink-muted" : "text-text-muted";
  const eyebrowColor = tone === "light" ? "text-accent-deep" : "text-accent-light";
  const Heading = as;

  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className={`text-sm font-semibold uppercase tracking-wider ${eyebrowColor}`}>{eyebrow}</span>
      )}
      <Heading className={`mt-2 font-display text-4xl uppercase leading-[1.6] tracking-tight sm:text-5xl ${titleColor}`}>
        {title}
      </Heading>
      {description && <p className={`mt-4 ${descColor}`}>{description}</p>}
    </div>
  );
}
