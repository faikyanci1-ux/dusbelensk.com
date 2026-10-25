"use client";

import { useEffect } from "react";

/** Kök layout'un kendisi çökerse devreye girer; kendi <html>/<body> etiketlerini içermek zorundadır (stil satır içi). */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1628",
          color: "#eef1f6",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>Bir şeyler ters gitti</h1>
          <p style={{ color: "#96a3b8", lineHeight: 1.6, margin: "0 0 24px" }}>
            Düşbelen SK sitesi şu anda yüklenemiyor. Lütfen tekrar deneyin.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: "#d41e37",
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            Tekrar dene
          </button>
        </main>
      </body>
    </html>
  );
}
