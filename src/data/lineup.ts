export type LineupSlot = {
  position: string;
  player: string;
  number: number;
  /** Saha diziliminde konumu (yüzde), pitch görselleştirmesi için. */
  x: number;
  y: number;
};

/** Bugünün İlk 11'i tablosu — gerçek kadro netleşince "player" alanları güncellenecek. */
export const lineup: LineupSlot[] = [
  { position: "Kaleci", player: "Oyuncu Adı", number: 1, x: 50, y: 92 },
  { position: "Sağ Bek", player: "Oyuncu Adı", number: 2, x: 82, y: 72 },
  { position: "Stoper", player: "Oyuncu Adı", number: 4, x: 62, y: 78 },
  { position: "Stoper", player: "Oyuncu Adı", number: 5, x: 38, y: 78 },
  { position: "Sol Bek", player: "Oyuncu Adı", number: 3, x: 18, y: 72 },
  { position: "Orta Saha", player: "Oyuncu Adı", number: 6, x: 65, y: 52 },
  { position: "Orta Saha", player: "Oyuncu Adı", number: 8, x: 35, y: 52 },
  { position: "10 Numara", player: "Oyuncu Adı", number: 10, x: 50, y: 36 },
  { position: "Sağ Kanat", player: "Oyuncu Adı", number: 7, x: 82, y: 22 },
  { position: "Sol Kanat", player: "Oyuncu Adı", number: 11, x: 18, y: 22 },
  { position: "Santrafor", player: "Oyuncu Adı", number: 9, x: 50, y: 12 },
];

export const lineupNote = "Saha dizilişi örnektir, maçtan maça güncellenebilir.";
