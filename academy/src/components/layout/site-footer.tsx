import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";

/** Footer link map; other pages should use these paths so the footer never 404s. */
export const footerLinks = {
  learn: [
    { label: "Courses", href: "/courses" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
  ],
  company: [
    { label: "About Cynthia", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "myersmorrison.com", href: site.mainSite, external: true },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Medical Disclaimer", href: "/medical-disclaimer" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
} as const;

type FooterLink = { label: string; href: string; external?: boolean };

function SocialIcon({ name }: { name: "linkedin" | "instagram" | "facebook" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true as const };
  if (name === "linkedin")
    return (
      <svg {...common}>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg {...common}>
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.69 4.55-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div>
      <h2 className="font-sans text-xs font-bold tracking-[0.18em] text-rose-strong uppercase">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) =>
          l.external ? (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground/85 hover:text-rose-strong hover:underline underline-offset-4">
                {l.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ) : (
            <li key={l.href}>
              <Link href={l.href} className="text-foreground/85 hover:text-rose-strong hover:underline underline-offset-4">
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer data-slot="site-footer" className={cn("mt-auto border-t border-border bg-cream-2/60 print:hidden", className)}>
      <div className="gold-rule-center" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo height={40} />
            <p className="mt-4 text-sm text-muted-foreground">{site.tagline}</p>
            <blockquote className="mt-5 border-l-2 border-gold pl-4 font-serif text-lg leading-snug text-foreground/90 italic">
              “{site.signatureQuote}”
              <footer className="mt-1 font-sans text-xs not-italic text-muted-foreground">— {site.instructor.name}</footer>
            </blockquote>
            <ul className="mt-6 flex items-center gap-2" aria-label="Social links">
              {(
                [
                  ["linkedin", site.social.linkedin, "LinkedIn"],
                  ["instagram", site.social.instagram, "Instagram"],
                  ["facebook", site.social.facebook, "Facebook"],
                ] as const
              ).map(([key, href, label]) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-rose/50 hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none"
                  >
                    <SocialIcon name={key} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <FooterColumn title="Learn" links={footerLinks.learn} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <MedicalDisclaimer variant="inline" />
          <p className="mt-4 text-xs text-muted-foreground">
            © {year} {site.brand} · {site.instructor.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
