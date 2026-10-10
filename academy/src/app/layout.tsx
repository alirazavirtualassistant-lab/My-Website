import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/components/ui/motion.css";
import { site } from "@/lib/config/site";
import { env } from "@/lib/env";
import { Toaster } from "@/components/ui/toaster";
import { SkipLink } from "@/components/shared/skip-link";
import { ThemeScript } from "@/components/shared/theme-script";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { Analytics } from "@/components/shared/analytics";
import { DemoRibbon } from "@/components/shared/demo-ribbon";

function metadataBase(): URL {
  try {
    return new URL(site.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.instructor.name, url: site.mainSite }],
  creator: site.instructor.name,
  keywords: ["food cravings", "family wellness", "preconception health", "baby steps", "Cynthia Myers Morrison"],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF6EF" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1B19" },
  ],
};

/**
 * Root layout: no data fetching here (route-group layouts do that). Route
 * groups render their own header/footer or shell plus <main id="main">.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SkipLink />
        {children}
        <Toaster />
        <CookieConsent />
        <Analytics />
        <DemoRibbon demo={env.demo} />
      </body>
    </html>
  );
}
