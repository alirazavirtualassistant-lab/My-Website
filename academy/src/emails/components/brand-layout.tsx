/**
 * Shared chrome for every email: cream background, serif heading, a short
 * rose rule, and a footer with the support email, the main site link and the
 * medical disclaimer. Styles are inline (email clients ignore stylesheets);
 * the palette mirrors src/app/globals.css light tokens.
 */
import type { CSSProperties, ReactNode } from "react";
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import { site } from "@/lib/config/site";

export const emailColors = {
  cream: "#fbf6ef",
  cream2: "#f4ecdf",
  paper: "#ffffff",
  rose: "#b5656b",
  roseStrong: "#9a4f56",
  roseSoft: "#f3e3e3",
  gold: "#d9b36c",
  goldSoft: "#f6ecd6",
  ink: "#2e2a27",
  muted: "#6f6660",
  sage: "#8fa88a",
  sageStrong: "#5f7a5b",
  sageSoft: "#e6eee3",
  line: "#e8dfd0",
} as const;

export const emailFonts = {
  serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  sans: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

const styles = {
  body: { backgroundColor: emailColors.cream, fontFamily: emailFonts.sans, color: emailColors.ink, margin: 0, padding: "24px 12px" } as CSSProperties,
  container: {
    backgroundColor: emailColors.paper,
    borderRadius: 14,
    border: `1px solid ${emailColors.line}`,
    maxWidth: 560,
    margin: "0 auto",
    padding: "32px 28px 24px",
  } as CSSProperties,
  brand: { fontFamily: emailFonts.serif, fontSize: 18, color: emailColors.roseStrong, margin: "0 0 18px", letterSpacing: "0.02em" } as CSSProperties,
  eyebrow: { fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: emailColors.sageStrong, margin: "0 0 6px", fontWeight: 700 } as CSSProperties,
  heading: { fontFamily: emailFonts.serif, fontSize: 28, lineHeight: "1.2", fontWeight: 500, color: emailColors.ink, margin: "0 0 10px" } as CSSProperties,
  rule: { width: 48, height: 3, backgroundColor: emailColors.rose, borderRadius: 2, margin: "0 0 20px" } as CSSProperties,
  text: { fontSize: 16, lineHeight: "1.6", color: emailColors.ink, margin: "0 0 14px" } as CSSProperties,
  muted: { fontSize: 13, lineHeight: "1.55", color: emailColors.muted, margin: "0 0 10px" } as CSSProperties,
  button: {
    backgroundColor: emailColors.rose,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    borderRadius: 999,
    padding: "12px 22px",
    textDecoration: "none",
    display: "inline-block",
  } as CSSProperties,
  buttonWrap: { margin: "6px 0 18px" } as CSSProperties,
  card: { backgroundColor: emailColors.cream2, border: `1px solid ${emailColors.line}`, borderRadius: 12, padding: "14px 16px", margin: "0 0 16px" } as CSSProperties,
  quote: {
    borderLeft: `3px solid ${emailColors.gold}`,
    backgroundColor: emailColors.goldSoft,
    borderRadius: 8,
    padding: "12px 14px",
    margin: "0 0 16px",
    fontSize: 15,
    lineHeight: "1.6",
    color: emailColors.ink,
    fontStyle: "italic",
  } as CSSProperties,
  hr: { borderColor: emailColors.line, margin: "22px 0 16px" } as CSSProperties,
  footer: { fontSize: 12, lineHeight: "1.55", color: emailColors.muted, margin: "0 0 8px" } as CSSProperties,
  link: { color: emailColors.roseStrong, textDecoration: "underline" } as CSSProperties,
  fallback: { fontSize: 12, lineHeight: "1.5", color: emailColors.muted, margin: "0 0 10px", wordBreak: "break-all" } as CSSProperties,
} as const;

export interface BrandLayoutProps {
  /** Inbox preview line. */
  preview: string;
  heading: string;
  eyebrow?: string;
  children: ReactNode;
  /** Short note above the disclaimer, e.g. why the person received this. */
  footerNote?: string;
}

export function BrandLayout({ preview, heading, eyebrow, children, footerNote }: BrandLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>{site.name}</Text>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Heading as="h1" style={styles.heading}>
            {heading}
          </Heading>
          <Section style={styles.rule} />
          {children}
          <Hr style={styles.hr} />
          {footerNote ? <Text style={styles.footer}>{footerNote}</Text> : null}
          <Text style={styles.footer}>
            Questions? Write to{" "}
            <Link href={`mailto:${site.supportEmail}`} style={styles.link}>
              {site.supportEmail}
            </Link>
            . More from {site.instructor.shortName} at{" "}
            <Link href={site.mainSite} style={styles.link}>
              myersmorrison.com
            </Link>
            .
          </Text>
          <Text style={styles.footer}>{site.medicalDisclaimer}</Text>
          <Text style={styles.footer}>
            {site.name} · {site.tagline}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/** Body paragraph. */
export function P({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <Text style={{ ...styles.text, ...style }}>{children}</Text>;
}

/** Small, muted paragraph. */
export function Muted({ children }: { children: ReactNode }) {
  return <Text style={styles.muted}>{children}</Text>;
}

/** Primary call to action with a plain-text fallback link underneath. */
export function Cta({ href, children, fallback = true }: { href: string; children: ReactNode; fallback?: boolean }) {
  return (
    <>
      <Section style={styles.buttonWrap}>
        <Button href={href} style={styles.button}>
          {children}
        </Button>
      </Section>
      {fallback ? (
        <Text style={styles.fallback}>
          Or paste this link into your browser: <Link href={href} style={styles.link}>{href}</Link>
        </Text>
      ) : null}
    </>
  );
}

/** Soft card for details (order lines, invite info). */
export function Card({ children }: { children: ReactNode }) {
  return <Section style={styles.card}>{children}</Section>;
}

/** Quoted message (gift notes, testimonials, contact messages). */
export function Quote({ children }: { children: ReactNode }) {
  return <Text style={styles.quote}>{children}</Text>;
}

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} style={styles.link}>
      {children}
    </Link>
  );
}

export interface ReceiptItem {
  title: string;
  unit_cents: number;
  quantity: number;
}

export function formatCents(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(cents / 100);
}

const cell: CSSProperties = { fontSize: 14, lineHeight: "1.5", padding: "6px 0", borderBottom: `1px solid ${emailColors.line}`, verticalAlign: "top" };
const cellRight: CSSProperties = { ...cell, textAlign: "right", whiteSpace: "nowrap", paddingLeft: 12 };
const totalCell: CSSProperties = { fontSize: 14, lineHeight: "1.5", padding: "4px 0", color: emailColors.muted };
const totalCellRight: CSSProperties = { ...totalCell, textAlign: "right", whiteSpace: "nowrap", paddingLeft: 12 };
const grandCell: CSSProperties = { fontSize: 16, lineHeight: "1.5", padding: "8px 0 0", fontWeight: 700, color: emailColors.ink };
const grandCellRight: CSSProperties = { ...grandCell, textAlign: "right", whiteSpace: "nowrap", paddingLeft: 12 };

/** Items + totals table used by receipts and the admin sale notice. */
export function ItemsTable({
  items,
  currency = "USD",
  subtotalCents,
  discountCents = 0,
  taxCents = 0,
  totalCents,
}: {
  items: ReceiptItem[];
  currency?: string;
  subtotalCents?: number;
  discountCents?: number;
  taxCents?: number;
  totalCents: number;
}) {
  const subtotal = subtotalCents ?? items.reduce((sum, i) => sum + i.unit_cents * i.quantity, 0);
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", margin: "0 0 16px" }}>
      <tbody>
        {items.map((item, idx) => (
          <tr key={`${item.title}-${idx}`}>
            <td style={cell}>
              {item.title}
              {item.quantity > 1 ? ` × ${item.quantity}` : ""}
            </td>
            <td style={cellRight}>{formatCents(item.unit_cents * item.quantity, currency)}</td>
          </tr>
        ))}
        {discountCents > 0 || taxCents > 0 ? (
          <tr>
            <td style={totalCell}>Subtotal</td>
            <td style={totalCellRight}>{formatCents(subtotal, currency)}</td>
          </tr>
        ) : null}
        {discountCents > 0 ? (
          <tr>
            <td style={totalCell}>Discount</td>
            <td style={totalCellRight}>−{formatCents(discountCents, currency)}</td>
          </tr>
        ) : null}
        {taxCents > 0 ? (
          <tr>
            <td style={totalCell}>Tax</td>
            <td style={totalCellRight}>{formatCents(taxCents, currency)}</td>
          </tr>
        ) : null}
        <tr>
          <td style={grandCell}>Total</td>
          <td style={grandCellRight}>{formatCents(totalCents, currency)}</td>
        </tr>
      </tbody>
    </table>
  );
}

/** Very small markdown subset for admin broadcasts: headings, bullets, paragraphs, **bold**, [links](url). */
export function SimpleMarkdown({ body }: { body: string }) {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        const headingMatch = /^(#{1,3})\s+(.*)$/.exec(block);
        if (headingMatch) {
          return (
            <Heading as="h2" key={i} style={{ fontFamily: emailFonts.serif, fontSize: 22, fontWeight: 500, margin: "18px 0 8px", color: emailColors.ink }}>
              {renderInline(headingMatch[2])}
            </Heading>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => /^[-*]\s+/.test(l))) {
          return (
            <ul key={i} style={{ margin: "0 0 14px", paddingLeft: 22 }}>
              {lines.map((l, j) => (
                <li key={j} style={{ fontSize: 16, lineHeight: "1.6", color: emailColors.ink, marginBottom: 4 }}>
                  {renderInline(l.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }
        return <P key={i}>{renderInline(lines.join(" "))}</P>;
      })}
    </>
  );
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    if (match[1] !== undefined) out.push(<strong key={key++}>{match[1]}</strong>);
    else if (match[2] !== undefined && match[3] !== undefined)
      out.push(
        <Link key={key++} href={match[3]} style={styles.link}>
          {match[2]}
        </Link>,
      );
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function greeting(name?: string | null): string {
  const first = (name ?? "").trim().split(/\s+/)[0];
  return first ? `Hi ${first},` : "Hello,";
}
