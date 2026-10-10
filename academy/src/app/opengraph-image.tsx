import { ImageResponse } from "next/og";
import { site } from "@/lib/config/site";
import { OG_SIZE, OgFrame, loadOgFonts } from "@/components/marketing/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default async function OpenGraphImage() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    <OgFrame eyebrow="Online courses by Cynthia Myers Morrison, EdD" title={site.tagline} subtitle="Prepare for conception and family wellness with small, repeatable steps grounded in named sources and delivered with grace over guilt." stats={["Science-backed", "Heart-led", "Baby steps"]} serif={fonts.length > 0} />,
    { ...size, ...(fonts.length ? { fonts } : {}) },
  );
}
