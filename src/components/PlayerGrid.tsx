"use client";

import { useMemo, useState } from "react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import type { Player } from "@/data/players";

export function PlayerGrid({ players }: { players: Player[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return players;
    return players.filter(
      (p) => p.name.toLocaleLowerCase("tr").includes(q) || p.position.toLocaleLowerCase("tr").includes(q)
    );
  }, [players, query]);

  return (
    <div>
      <div className="mx-auto max-w-md">
        <label htmlFor="player-search" className="sr-only">
          İsim veya mevki ara
        </label>
        <input
          id="player-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İsim veya mevki ara..."
          className="w-full rounded-full border border-border-soft bg-bg-raised/60 px-5 py-3 text-sm text-white placeholder:text-text-muted focus:border-accent outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
        />
      </div>

      <p className="mt-4 text-center text-sm text-text-muted">
        {filtered.length} / {players.length} sporcu gösteriliyor
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((player) => (
          <div
            key={player.id}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border-soft bg-bg-raised/40 p-5 text-center"
          >
            <PlayerAvatar name={player.name} jerseyNumber={player.jerseyNumber} />
            <div>
              <p className="text-sm font-semibold text-white">{player.name}</p>
              <p className="text-xs text-accent-light">{player.position}</p>
              <p className="mt-1 text-[11px] text-text-muted">Doğum Tarihi: {player.birthYear}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
