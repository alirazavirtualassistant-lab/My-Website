import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmailsTabs } from "@/components/admin/emails/emails-tabs";
import { listBroadcasts } from "../queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Broadcasts", robots: { index: false, follow: false } };

const audienceLabel = { all: "Everyone opted in", course: "Course", incomplete: "Not finished" } as const;

export default async function AdminBroadcastsPage({ searchParams }: { searchParams: Promise<{ sent?: string; failed?: string }> }) {
  const [rows, sp] = await Promise.all([listBroadcasts(), searchParams]);
  const sentCount = sp.sent ? Number(sp.sent) : null;
  const failedCount = sp.failed ? Number(sp.failed) : 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow="Email"
        title="Broadcasts"
        description="Letters to your learners. Each one is sent to the people who opted in, one at a time, and logged here."
        actions={
          <Button asChild>
            <Link href="/admin/emails/broadcasts/new">
              <Plus aria-hidden="true" /> New broadcast
            </Link>
          </Button>
        }
      />
      <EmailsTabs active="broadcasts" />

      {sentCount !== null ? (
        <Alert variant={failedCount > 0 ? "warning" : "success"}>
          <AlertTitle>{failedCount > 0 ? "Sent, with a few bumps" : "Broadcast sent"}</AlertTitle>
          <AlertDescription>
            <p>
              Delivered to {sentCount.toLocaleString("en-US")} {sentCount === 1 ? "person" : "people"}
              {failedCount > 0 ? `; ${failedCount} could not be sent (see the Log tab for details).` : "."}
            </p>
          </AlertDescription>
        </Alert>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          icon={<Megaphone />}
          title="No broadcasts yet"
          description="Write one when there’s news worth sharing: a new replay, a seasonal note, a gentle reminder."
          action={
            <Button asChild>
              <Link href="/admin/emails/broadcasts/new">Write a broadcast</Link>
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sent</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead className="text-right">Recipients</TableHead>
              <TableHead>By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="text-muted-foreground">{b.sent_at ? formatDate(b.sent_at, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : <Badge variant="muted">Draft</Badge>}</TableCell>
                <TableCell className="max-w-[360px] whitespace-normal">
                  <p className="font-semibold">{b.subject}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{b.body.replace(/[#*_>`-]/g, "").slice(0, 140)}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{audienceLabel[b.audience]}</Badge>
                  {b.course_title ? <span className="block max-w-[200px] truncate text-xs text-muted-foreground">{b.course_title}</span> : null}
                </TableCell>
                <TableCell className="text-right tabular-nums">{b.sent_count.toLocaleString("en-US")}</TableCell>
                <TableCell className="text-muted-foreground">{b.created_by_name ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
