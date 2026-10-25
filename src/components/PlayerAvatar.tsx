const PALETTE = [
  "from-accent-2/40 to-bg-navy/70 text-white",
  "from-accent/30 to-bg-navy/70 text-accent-light",
  "from-bg-raised to-bg-main text-white",
  "from-accent-2/50 to-bg-main text-accent-light",
  "from-accent/20 to-accent-2/40 text-white",
];

function initials(name: string) {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PlayerAvatar({ name, jerseyNumber }: { name: string; jerseyNumber: number }) {
  const palette = PALETTE[jerseyNumber % PALETTE.length];

  return (
    <div
      className={`relative flex h-24 w-24 items-center justify-center rounded-2xl border border-border-soft bg-gradient-to-br ${palette} font-bold text-2xl`}
    >
      {initials(name)}
      <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-border-soft bg-bg-main text-xs font-semibold text-text-main">
        {jerseyNumber}
      </span>
    </div>
  );
}
