export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "dark",
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "dark" | "light";
  align?: "center" | "left";
}) {
  const titleColor = tone === "light" ? "text-ink" : "text-white";
  const descColor = tone === "light" ? "text-ink-muted" : "text-text-muted";
  const eyebrowColor = tone === "light" ? "text-accent" : "text-accent-bright";

  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className={`text-sm font-semibold uppercase tracking-wider ${eyebrowColor}`}>{eyebrow}</span>
      )}
      <h2 className={`mt-2 font-display text-4xl uppercase leading-[1.05] tracking-tight sm:text-5xl ${titleColor}`}>
        {title}
      </h2>
      {description && <p className={`mt-4 ${descColor}`}>{description}</p>}
    </div>
  );
}
