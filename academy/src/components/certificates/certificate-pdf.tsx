import "server-only";
/**
 * The certificate PDF (A4 landscape) rendered with @react-pdf/renderer on the
 * Node runtime. Imported only by the route handler; never from a client bundle.
 *
 * Fonts: @react-pdf needs TTF/OTF and the installed @fontsource-variable
 * packages ship woff2 only, so the document uses the built-in Times-Roman /
 * Helvetica families by default. To use the brand fonts, drop static TTFs in
 * `public/fonts/` (see BRAND_FONT_FILES) and they are registered automatically.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Document, Font, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { site } from "@/lib/config/site";
import { formatDate } from "@/lib/utils";

const COLORS = {
  cream: "#fbf6ef",
  ink: "#2e2a27",
  muted: "#6f6660",
  rose: "#9a4f56",
  gold: "#d9b36c",
  goldSoft: "#eedfbf",
} as const;

/** Static TTFs that switch the document to the brand fonts when present under public/fonts/. */
export const BRAND_FONT_FILES = {
  serif: { family: "Cormorant Garamond", regular: "CormorantGaramond-Medium.ttf", italic: "CormorantGaramond-MediumItalic.ttf" },
  sans: { family: "Nunito Sans", regular: "NunitoSans-Regular.ttf", bold: "NunitoSans-Bold.ttf" },
} as const;

interface FontSet {
  serif: string;
  serifItalic: string;
  sans: string;
  sansBold: string;
}

let fontsResolved: FontSet | null = null;

/** Registers brand TTFs when they exist; otherwise returns the built-in families. */
function resolveFonts(): FontSet {
  if (fontsResolved) return fontsResolved;
  const dir = path.join(process.cwd(), "public", "fonts");
  const exists = (file: string) => {
    try {
      return fs.existsSync(path.join(dir, file));
    } catch {
      return false;
    }
  };
  let fonts: FontSet = { serif: "Times-Roman", serifItalic: "Times-Italic", sans: "Helvetica", sansBold: "Helvetica-Bold" };
  try {
    if (exists(BRAND_FONT_FILES.serif.regular)) {
      Font.register({
        family: BRAND_FONT_FILES.serif.family,
        fonts: [
          { src: path.join(dir, BRAND_FONT_FILES.serif.regular), fontStyle: "normal" },
          ...(exists(BRAND_FONT_FILES.serif.italic) ? [{ src: path.join(dir, BRAND_FONT_FILES.serif.italic), fontStyle: "italic" as const }] : []),
        ],
      });
      fonts = { ...fonts, serif: BRAND_FONT_FILES.serif.family, serifItalic: BRAND_FONT_FILES.serif.family };
    }
    if (exists(BRAND_FONT_FILES.sans.regular)) {
      Font.register({
        family: BRAND_FONT_FILES.sans.family,
        fonts: [
          { src: path.join(dir, BRAND_FONT_FILES.sans.regular), fontWeight: 400 },
          ...(exists(BRAND_FONT_FILES.sans.bold) ? [{ src: path.join(dir, BRAND_FONT_FILES.sans.bold), fontWeight: 700 }] : []),
        ],
      });
      fonts = { ...fonts, sans: BRAND_FONT_FILES.sans.family, sansBold: BRAND_FONT_FILES.sans.family };
    }
  } catch (err) {
    console.warn("[certificate-pdf] brand font registration failed; using built-in fonts", err);
  }
  // Names and titles must never be hyphenated.
  Font.registerHyphenationCallback((word) => [word]);
  fontsResolved = fonts;
  return fonts;
}

export interface CertificatePdfInput {
  certificateId: string;
  verifyCode: string;
  verifyUrl: string;
  learnerName: string;
  courseTitle: string;
  issuedAt: string;
  /** PNG data URL of the QR code pointing at `verifyUrl`. */
  qrDataUrl: string;
}

function makeStyles(f: FontSet) {
  return StyleSheet.create({
    page: { backgroundColor: COLORS.cream, padding: 28, fontFamily: f.sans, color: COLORS.ink },
    frame: { flex: 1, borderWidth: 1.5, borderColor: COLORS.gold, padding: 6 },
    inner: { flex: 1, borderWidth: 0.75, borderColor: COLORS.goldSoft, paddingHorizontal: 56, paddingTop: 40, paddingBottom: 36, position: "relative" },
    content: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 12 },
    eyebrow: { fontFamily: f.sansBold, fontSize: 9, letterSpacing: 3.2, color: COLORS.rose, textTransform: "uppercase" },
    rule: { width: 120, height: 1, backgroundColor: COLORS.gold, marginTop: 10, marginBottom: 18 },
    title: { fontFamily: f.serif, fontSize: 42, color: COLORS.ink, textAlign: "center" },
    lead: { fontSize: 10.5, color: COLORS.muted, marginTop: 20 },
    name: { fontFamily: f.serif, fontSize: 36, color: COLORS.ink, marginTop: 6, textAlign: "center" },
    course: { fontFamily: f.serif, fontSize: 22, color: COLORS.rose, marginTop: 6, textAlign: "center", maxWidth: 620 },
    date: { fontSize: 10.5, color: COLORS.muted, marginTop: 14 },
    bottomRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 18 },
    meta: { width: 220, fontSize: 7.5, color: COLORS.muted, lineHeight: 1.5 },
    metaStrong: { color: COLORS.ink, fontFamily: f.sansBold, letterSpacing: 1 },
    signature: { alignItems: "center", width: 220 },
    signatureLine: { width: 170, height: 1, backgroundColor: COLORS.ink, marginBottom: 6 },
    signatureName: { fontFamily: f.serif, fontSize: 15, color: COLORS.ink },
    signatureTitle: { fontFamily: f.sansBold, fontSize: 7.5, letterSpacing: 2, color: COLORS.rose, textTransform: "uppercase", marginTop: 2 },
    qrWrap: { width: 220, alignItems: "flex-end" },
    qr: { width: 72, height: 72 },
    footer: { position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontSize: 7, letterSpacing: 2, color: COLORS.muted, textTransform: "uppercase" },
  });
}

/** The react-pdf document tree. */
export function CertificateDocument(input: CertificatePdfInput) {
  const fonts = resolveFonts();
  const s = makeStyles(fonts);
  return (
    <Document
      title={`Certificate of Completion — ${input.courseTitle}`}
      author={site.name}
      subject={`${input.learnerName} completed ${input.courseTitle}`}
      creator={site.name}
      producer={site.name}
      language="en"
    >
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.frame}>
          <View style={s.inner}>
            <View style={s.content}>
              <Text style={s.eyebrow}>Cradle Your Cravings Academy</Text>
              <View style={s.rule} />
              <Text style={s.title}>Certificate of Completion</Text>
              <Text style={s.lead}>This certifies that</Text>
              <Text style={s.name}>{input.learnerName}</Text>
              <Text style={s.lead}>has completed</Text>
              <Text style={s.course}>{input.courseTitle}</Text>
              <Text style={s.date}>Completed on {formatDate(input.issuedAt)}</Text>
            </View>
            <View style={s.bottomRow}>
              <View style={s.meta}>
                <Text>
                  Certificate ID <Text style={s.metaStrong}>{input.certificateId}</Text>
                </Text>
                <Text>
                  Verify code <Text style={s.metaStrong}>{input.verifyCode}</Text>
                </Text>
                <Text>{input.verifyUrl.replace(/^https?:\/\//, "")}</Text>
              </View>
              <View style={s.signature}>
                <View style={s.signatureLine} />
                <Text style={s.signatureName}>{site.instructor.name}</Text>
                <Text style={s.signatureTitle}>Instructor</Text>
              </View>
              <View style={s.qrWrap}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
                <Image src={input.qrDataUrl} style={s.qr} />
              </View>
            </View>
            <Text style={s.footer}>Cradle Your Cravings Academy</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/** Renders the certificate to a PDF buffer (Node runtime only). */
export async function renderCertificatePdf(input: CertificatePdfInput): Promise<Buffer> {
  return renderToBuffer(<CertificateDocument {...input} />);
}
