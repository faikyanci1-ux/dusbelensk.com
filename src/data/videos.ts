export type VideoItem = {
  id: number;
  src: string;
  caption: string;
  poster: string;
};

export const videos: VideoItem[] = [
  { id: 1, src: "/videos/drone-mac.mp4", caption: "Maç Günü · Drone Görüntüsü", poster: "/images/hero-bg.jpg" },
  { id: 2, src: "/videos/tesis-havadan.mp4", caption: "Tesisimiz · Havadan Görünüm", poster: "/images/facility-1.jpg" },
  { id: 3, src: "/videos/kaleci-roportaj.mp4", caption: "Sahadan · Kısa Röportaj", poster: "/images/facility-2.jpg" },
  { id: 4, src: "/videos/takim-konusmasi.mp4", caption: "Maç Öncesi · Takım Konuşması", poster: "/images/coach-bg.jpg" },
];
