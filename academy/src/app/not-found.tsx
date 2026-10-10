import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <Link href="/" className="mb-10 inline-flex rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        <Logo height={40} />
      </Link>
      <Illustration name="path" size={160} className="text-rose-strong" />
      <p className="eyebrow mt-8">404</p>
      <h1 className="mt-3 max-w-xl text-balance">This page wandered off the path.</h1>
      <p className="mt-4 max-w-md text-pretty text-muted-foreground">
        No harm done. The link may have moved, or it was a small typo. Take a breath, and let’s find your way back together.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/courses">Browse courses</Link>
        </Button>
      </div>
    </main>
  );
}
