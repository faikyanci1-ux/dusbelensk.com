import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Düşbelen SK",
    short_name: "Düşbelen SK",
    description: "Köyceğiz/Muğla'da futbol okulu ve altyapı kulübü Düşbelen SK'nın resmi web sitesi.",
    lang: "tr",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1628",
    theme_color: "#0a1628",
    icons: [
      { src: "/favicon.png", sizes: "256x256", type: "image/png" },
      { src: "/images/logo.png", sizes: "800x800", type: "image/png" },
    ],
  };
}
