import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-bg-main py-16 sm:py-24">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt="" fill sizes="100vw" preload className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-bg-main/85 to-bg-main/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-bg-main/40" />
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-bright">
          <span className="h-px w-6 bg-accent-bright" />
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-2xl font-display text-4xl uppercase leading-[1.6] tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-xl text-text-muted">{description}</p>}
      </div>
    </section>
  );
}
