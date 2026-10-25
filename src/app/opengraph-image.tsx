import { ImageResponse } from "next/og";

export const alt = "Düşbelen SK | Köyceğiz Futbol Okulu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Harici font indirilmez: ImageResponse'un gömülü varsayılan fontu kullanılır.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a1628",
          padding: "0 96px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 24, background: "#d41e37", display: "flex" }} />
        <div style={{ display: "flex", color: "#ff7f93", fontSize: 30, letterSpacing: 6, textTransform: "uppercase" }}>
          Köyceğiz · Muğla
        </div>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 148, fontWeight: 800, marginTop: 16, lineHeight: 1.05 }}>
          Düşbelen SK
        </div>
        <div style={{ display: "flex", width: 160, height: 8, background: "#d41e37", margin: "32px 0" }} />
        <div style={{ display: "flex", color: "#ffffff", fontSize: 56, opacity: 0.92 }}>Köyceğiz Futbol Okulu</div>
        <div style={{ display: "flex", color: "#9fb0c8", fontSize: 32, marginTop: 20 }}>
          U12 · U14 · U17 altyapı grupları · Online ön kayıt
        </div>
      </div>
    ),
    size,
  );
}
