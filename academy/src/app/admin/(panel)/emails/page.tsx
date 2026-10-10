import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Mail, Plus } from "lucide-react";
import { env } from "@/lib/env";
import { getServices } from "@/services";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmailLogFilters } from "@/components/admin/emails/email-log-filters";
import { EmailPreviewDialog } from "@/components/admin/emails/email-preview-dialog";
import { EmailsTabs } from "@/components/admin/emails/emails-tabs";
import { getEmailLog, type EmailStatusFilter } from "./queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Email log", robots: { index: false, follow: false } };

const statusVariant = { sent: "success", failed: "rose", queued: "gold" } as const;

export default async function AdminEmailsPage({ searchParams }: { searchParams: Promise<{ template?: string; status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status: EmailStatusFilter = sp.status === "sent" || sp.status === "failed" || sp.status === "queued" ? sp.status : "all";
  const template = sp.template?.trim() || null;
  const q = sp.q?.trim().slice(0, 120) || null;
  const [data, { mode }] = await Promise.all([getEmailLog({ template, status, q }), getServices()]);
  const demoMailbox = env.demo && mode.email === "mock";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow="Email"
        title="Emails"
        description="Every email the app sent or tried to send, newest first. Open one to see exactly what the learner received."
        actions={
          <>
            {demoMailbox ? (
              <Button asChild variant="outline">
                <Link href="/dev/mailbox" target="_blank" rel="noopener">
                  <ExternalLink aria-hidden="true" /> Demo mailbox
                </Link>
              </Button>
            ) : null}
            <Button asChild>
              <Link href="/admin/emails/broadcasts/new">
                <Plus aria-hidden="true" /> New broadcast
              </Link>
            </Button>
          </>
        }
      />

      <EmailsTabs active="log" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sent" value={data.counts.sent} tone="sage" icon={<Mail />} />
        <StatCard label="Failed" value={data.counts.failed} tone={data.counts.failed > 0 ? "rose" : "default"} icon={<Mail />} hint={data.counts.failed > 0 ? "Check the provider status" : undefined} />
        <StatCard label="Queued" value={data.counts.queued} tone="gold" icon={<Mail />} />
      </div>

      <EmailLogFilters templates={data.templates} template={template} status={status} q={q ?? ""} />

      {data.rows.length === 0 ? (
        <EmptyState icon={<Mail />} title="No emails match" description={template || status !== "all" || q ? "Try clearing a filter." : "Emails show up here as soon as the app sends one — a sign-up, a receipt, a nudge."} size="sm" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-muted-foreground">{formatDate(e.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</TableCell>
                <TableCell className="max-w-[220px] truncate">{e.to}</TableCell>
                <TableCell className="max-w-[320px] truncate font-medium">{e.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {e.template}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[e.status]} className="capitalize">
                    {e.status}
                  </Badge>
                  {e.error ? <span className="block max-w-[200px] truncate text-xs text-danger">{e.error}</span> : null}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <EmailPreviewDialog id={e.id} subject={e.subject} />
                    {demoMailbox ? (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dev/mailbox?id=${e.id}`} target="_blank" rel="noopener" aria-label={`Open in demo mailbox: ${e.subject}`}>
                          <ExternalLink aria-hidden="true" /> Mailbox
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {data.total > data.rows.length ? <p className="text-xs text-muted-foreground">Showing the newest {data.rows.length} of {data.total.toLocaleString("en-US")}. Narrow by template, status or recipient to see older ones.</p> : null}
    </div>
  );
}
