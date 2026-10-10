import { notFound } from "next/navigation";
import Link from "next/link";
import { env } from "@/lib/env";
import { getServices } from "@/services";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Demo mailbox", robots: { index: false } };

/**
 * Demo-mode mailbox: every email the mock provider "sent", newest first, with
 * clickable links (verify, magic link, reset password, partner invite…).
 */
export default async function MailboxPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  if (!env.demo) notFound();
  const { db, mode } = await getServices();
  if (mode.email !== "mock") notFound();
  const { id } = await searchParams;
  const emails = await db.from("email_events").list({ orderBy: ["created_at", "desc"], limit: 100 });
  const open = id ? emails.find((e) => e.id === id) : emails[0];
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Demo mode</p>
          <h1 className="text-3xl">Mailbox</h1>
          <p className="text-muted-foreground">Emails the app would have sent. Links work.</p>
        </div>
        <Link href="/" className="text-rose-strong underline underline-offset-4">
          Back to site
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <ul className="card-soft max-h-[75vh] divide-y divide-border overflow-auto">
          {emails.length === 0 && <li className="p-4 text-sm text-muted-foreground">No emails yet. Sign up or buy something to see some.</li>}
          {emails.map((e) => (
            <li key={e.id}>
              <Link href={`/dev/mailbox?id=${e.id}`} className={`block p-3 text-sm hover:bg-cream-2 ${open?.id === e.id ? "bg-cream-2" : ""}`}>
                <div className="truncate font-semibold">{e.subject}</div>
                <div className="truncate text-muted-foreground">to {e.to}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(e.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} · {e.template} · {e.status}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="card-soft min-h-[50vh] overflow-hidden">
          {open ? (
            <>
              <div className="border-b border-border p-4 text-sm">
                <div className="font-semibold">{open.subject}</div>
                <div className="text-muted-foreground">to {open.to}</div>
              </div>
              {open.html ? (
                <iframe title={open.subject} srcDoc={open.html} className="h-[70vh] w-full bg-white" sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation" />
              ) : (
                <pre className="whitespace-pre-wrap p-4 text-sm">{JSON.stringify(open.payload, null, 2)}</pre>
              )}
            </>
          ) : (
            <p className="p-6 text-muted-foreground">Select an email.</p>
          )}
        </div>
      </div>
    </main>
  );
}
