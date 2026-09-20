const ITEMS = [
  "TUTKU",
  "MÜCADELE",
  "TAKIM RUHU",
  "DÜŞBELEN SK",
  "DİSİPLİN",
  "GELİŞİM",
  "BAŞARI",
  "SPORLA BÜYÜYEN NESİLLER",
];

export function Marquee() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-y border-white/5 bg-bg-pitch py-3 [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {[...track, ...track].map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold tracking-[0.3em] text-white">
            {item}
            <span className="text-accent-bright">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
