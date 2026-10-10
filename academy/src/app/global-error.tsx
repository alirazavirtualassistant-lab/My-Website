"use client";

import * as React from "react";
import "./globals.css";

/**
 * Replaces the root layout when it throws. Must render <html>/<body>; global
 * styles are imported here explicitly and backed by inline styles so the page
 * is readable even if CSS fails to load.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background: "#fbf6ef",
          color: "#2e2a27",
          fontFamily: '"Nunito Sans Variable", "Nunito Sans", system-ui, sans-serif',
          textAlign: "center",
        }}
      >
        <main id="main" style={{ maxWidth: 520 }}>
          <title>Something went wrong · Cradle Your Cravings Academy</title>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9a4f56" }}>A small bump</p>
          <h1 style={{ fontFamily: '"Cormorant Garamond Variable", Georgia, serif', fontWeight: 500, fontSize: "2.25rem", lineHeight: 1.15, margin: "0.75rem 0 0" }}>
            This page wandered off the path.
          </h1>
          <p style={{ color: "#6f6660", marginTop: "1rem", lineHeight: 1.6 }}>
            Something on our side didn’t load. Nothing you did caused it. Please try again, or head back home and we’ll meet you
            there.
          </p>
          {error.digest ? (
            <p style={{ marginTop: "0.75rem", fontSize: 12, color: "#6f6660", fontFamily: "ui-monospace, monospace" }}>Reference: {error.digest}</p>
          ) : null}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                background: "#b5656b",
                color: "#fff",
                border: 0,
                borderRadius: 14,
                padding: "0.75rem 1.5rem",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: "1px solid #e8dfd0",
                color: "#2e2a27",
                borderRadius: 14,
                padding: "0.75rem 1.5rem",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                background: "#fff",
              }}
            >
              Back home
            </a>
            <a href="/courses" style={{ color: "#9a4f56", padding: "0.75rem 1rem", fontWeight: 600, fontSize: 15, textDecoration: "underline", textUnderlineOffset: 4 }}>
              Browse courses
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
