import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/ui/page-header";
import { BroadcastForm } from "@/components/admin/emails/broadcast-form";
import { getAudienceCounts } from "../../queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New broadcast", robots: { index: false, follow: false } };

export default async function NewBroadcastPage() {
  const session = await requireAdmin("/admin/emails/broadcasts/new");
  const { counts, courses } = await getAudienceCounts();
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Link href="/admin/emails/broadcasts" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> All broadcasts
      </Link>
      <PageHeader eyebrow="Email" title="New broadcast" description="Warm, short, and useful. Send yourself a test first; the real send asks you to confirm." />
      <div className="card-soft p-5 sm:p-8">
        <BroadcastForm courses={courses.map((c) => ({ id: c.id, title: c.title }))} counts={counts} meEmail={session.email} demo={env.demo} />
      </div>
    </div>
  );
}
