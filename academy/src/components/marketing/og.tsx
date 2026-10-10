import * as React from "react";

/**
 * Shared bits for the Open Graph images (next/og → Satori). Satori supports
 * flexbox and inline styles only, so everything here is deliberately plain.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;

const COLORS = {
  cream: "#fbf6ef",
  cream2: "#f4ecdf",
  rose: "#b5656b",
  roseStrong: "#9a4f56",
  gold: "#d9b36c",
  ink: "#2e2a27",
  muted: "#6f6660",
  sage: "#5f7a5b",
};

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

let fontCache: Promise<OgFont[]> | null = null;

/**
 * Best-effort serif: fetches a TrueType Cormorant Garamond from Google Fonts
 * once per process. Satori cannot read the bundled woff2 files, so when the
 * fetch fails (offline, blocked) the image falls back to the default sans.
 */
export function loadOgFonts(): Promise<OgFont[]> {
  if (!fontCache) {
    fontCache = (async () => {
      try {
        const css = await fetch("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap", {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0" },
          cache: "force-cache",
        }).then((r) => (r.ok ? r.text() : ""));
        const url = /src:\s*url\(([^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/.exec(css)?.[1];
        if (!url) return [];
        const data = await fetch(url, { cache: "force-cache" }).then((r) => (r.ok ? r.arrayBuffer() : null));
        if (!data) return [];
        return [{ name: "Cormorant Garamond", data, weight: 600 as const, style: "normal" as const }];
      } catch {
        return [];
      }
    })();
  }
  return fontCache;
}

export interface OgFrameProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  stats?: string[];
  serif: boolean;
}

/** Cream card, rose rule, serif title, academy wordmark. */
export function OgFrame({ eyebrow, title, subtitle, stats = [], serif }: OgFrameProps) {
  const titleFont = serif ? "Cormorant Garamond" : "sans serif";
  const titleSize = title.length > 60 ? 56 : title.length > 36 ? 66 : 80;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: COLORS.cream,
        color: COLORS.ink,
        padding: "64px 72px",
        fontFamily: "sans serif",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: -140, right: -140, width: 460, height: 460, borderRadius: 999, background: COLORS.cream2 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: COLORS.roseStrong, fontWeight: 700 }}>{eyebrow}</div>
        <div style={{ display: "flex", width: 160, height: 4, background: COLORS.rose, borderRadius: 2 }} />
        <div style={{ display: "flex", fontFamily: titleFont, fontSize: titleSize, lineHeight: 1.08, fontWeight: 600, maxWidth: 980 }}>{title}</div>
        {subtitle ? <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, color: COLORS.muted, maxWidth: 900 }}>{subtitle}</div> : null}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {stats.map((s) => (
            <div key={s} style={{ display: "flex", padding: "10px 18px", borderRadius: 999, border: `2px solid ${COLORS.gold}`, fontSize: 22, color: COLORS.ink, background: "#ffffff" }}>
              {s}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <path d="M3.5 15.5C5 25 27 25 28.5 15.5" stroke={COLORS.rose} strokeWidth="2" strokeLinecap="round" />
            <path d="M8 24.5c3.5 2.6 12.5 2.6 16 0" stroke={COLORS.rose} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 18.5c-4-3.5-3-10 4.5-12.5c1 6.5-1 10.5-4.5 12.5Z" stroke={COLORS.sage} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M16 18.5l3.6-8.4" stroke={COLORS.sage} strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="25.5" cy="7.5" r="1.8" fill={COLORS.gold} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: titleFont, fontSize: 30, fontWeight: 600 }}>Cradle Your Cravings</div>
            <div style={{ display: "flex", fontSize: 14, letterSpacing: 5, textTransform: "uppercase", color: COLORS.roseStrong, fontWeight: 700 }}>Academy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
