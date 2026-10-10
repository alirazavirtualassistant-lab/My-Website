import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { site } from "@/lib/config/site";
import { Logo } from "@/components/shared/logo";
import { Illustration } from "@/components/shared/illustration";

/**
 * Auth screens: a centred card on cream, the logo above, a calm line-art
 * panel beside it from lg up. Renders its own <main id="main"> for the skip link.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-cream">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none" aria-label="Cradle Your Cravings Academy home">
          <Logo height={36} />
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-foreground/80 hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-6xl flex-1 items-start px-4 pb-16 outline-none sm:px-6 lg:items-center lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,480px)_1fr] lg:items-center">
          <div className="mx-auto w-full max-w-[480px] lg:mx-0">{children}</div>
          <aside className="hidden lg:flex lg:flex-col lg:items-center lg:gap-6 lg:px-8" aria-hidden="true">
            <Illustration name="path" size={300} className="text-rose-strong" />
            <blockquote className="max-w-sm text-center font-serif text-2xl leading-snug text-foreground/90 italic">
              “{site.signatureQuote}”
              <footer className="mt-2 font-sans text-xs tracking-[0.18em] not-italic text-muted-foreground uppercase">{site.instructor.name}</footer>
            </blockquote>
            <p className="text-sm text-muted-foreground">{site.tagline}</p>
          </aside>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/terms" className="hover:text-rose-strong hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-rose-strong hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-rose-strong hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
