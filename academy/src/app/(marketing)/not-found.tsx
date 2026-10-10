import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function MarketingNotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <Illustration name="path" size={140} className="text-rose-strong" />
      <p className="eyebrow mt-8">404</p>
      <h1 className="mt-3 max-w-xl text-balance">This page wandered off the path.</h1>
      <p className="mt-4 max-w-md text-pretty text-muted-foreground">
        The link may have moved, or it was a small typo. No harm done; let’s find your way back together.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/courses">Browse courses</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
