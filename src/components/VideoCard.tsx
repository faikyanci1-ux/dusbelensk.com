"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function VideoCard({
  src,
  poster,
  caption,
  featured = false,
}: {
  src: string;
  poster: string;
  caption: string;
  featured?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Next.js görsel optimize edicisini native <video poster> ile kullanmak için:
  // ham dosya yerine yeniden boyutlandırılmış/sıkıştırılmış sürüm servis edilir.
  const optimizedPoster = `/_next/image?url=${encodeURIComponent(poster)}&w=1080&q=75`;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border-soft bg-black shadow-lg transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_40px_rgba(212,30,55,0.25)] ${
        featured ? "aspect-[16/10] sm:col-span-2 sm:row-span-2" : "aspect-video"
      }`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={optimizedPoster}
        controls={playing}
        preload="none"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />

      {!playing && (
        <button
          type="button"
          onClick={() => videoRef.current?.play()}
          aria-label={`${caption} videosunu oynat`}
          className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/10 to-transparent p-5 text-left transition group-hover:from-black/95"
        >
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-bg-main shadow-lg transition group-hover:scale-110 group-hover:animate-pulse-ring">
            <Play size={22} fill="currentColor" className="ml-0.5" />
          </span>
          <span className={`font-bold text-white drop-shadow ${featured ? "text-xl" : "text-sm"}`}>
            {caption}
          </span>
        </button>
      )}
    </div>
  );
}
