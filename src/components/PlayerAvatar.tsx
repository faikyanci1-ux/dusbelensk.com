const PALETTE = [
  "from-emerald-500/30 to-emerald-900/40 text-emerald-300",
  "from-sky-500/30 to-sky-900/40 text-sky-300",
  "from-rose-500/30 to-rose-900/40 text-rose-300",
  "from-amber-500/30 to-amber-900/40 text-amber-300",
  "from-violet-500/30 to-violet-900/40 text-violet-300",
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
