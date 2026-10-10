import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { getEmailEvent } from "../queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Email", robots: { index: false, follow: false } };

/** Full-page view of one logged email (the dialog's no-JS fallback and a shareable link for the team). */
export default async function AdminEmailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEmailEvent(id);
  if (!event) notFound();
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Link href="/admin/emails" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> Email log
      </Link>
      <PageHeader
        eyebrow="Email"
        title={event.subject}
        description={`To ${event.to} · ${formatDate(event.created_at, { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`}
        actions={
          <>
            <Badge variant="outline" className="font-mono text-[11px]">
              {event.template}
            </Badge>
            <Badge variant={event.status === "sent" ? "success" : event.status === "failed" ? "rose" : "gold"} className="capitalize">
              {event.status}
            </Badge>
          </>
        }
      />
      {event.error ? (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          {event.error}
        </p>
      ) : null}
      <div className="card-soft overflow-hidden bg-white">
        {event.html ? (
          <iframe title={`Email: ${event.subject}`} srcDoc={event.html} sandbox="allow-popups allow-popups-to-escape-sandbox" className="h-[75vh] w-full" />
        ) : (
          <pre className="max-h-[75vh] overflow-auto p-6 text-sm whitespace-pre-wrap text-ink">{JSON.stringify(event.payload, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
