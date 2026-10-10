import type { Metadata } from "next";
import { LEGAL_PAGES, loadLegal } from "../_lib/data";
import { LegalPage } from "@/components/marketing/legal-page";

export const dynamic = "force-dynamic";

const SLUG = "terms" as const;

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadLegal(SLUG);
  return {
    title: doc.title,
    description: `${LEGAL_PAGES[SLUG].title} for Cradle Your Cravings Academy.`,
    alternates: { canonical: `/${SLUG}` },
    robots: doc.needsReview ? { index: false, follow: true } : undefined,
  };
}

export default async function Page() {
  const doc = await loadLegal(SLUG);
  return <LegalPage doc={doc} />;
}
