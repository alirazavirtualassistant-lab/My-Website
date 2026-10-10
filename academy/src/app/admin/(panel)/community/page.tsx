import type { Metadata } from "next";
import Link from "next/link";
import { Flag, Lock, LockOpen, MessageSquare, Pin, PinOff } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { getServices } from "@/services";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/admin/students/action-button";
import { CommunityFilters } from "@/components/admin/community/community-filters";
import { getModerationData, type ModerationTab, type StatusFilter } from "./queries";
import { resolveReportAction, setPostFlagAction, setPostStatusAction, setReplyStatusAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Community moderation", robots: { index: false, follow: false } };

const statusVariant = { visible: "success", hidden: "gold", removed: "rose" } as const;
const when = (iso: string) => formatDate(iso, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active ? "bg-card text-rose-strong shadow-soft" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export default async function AdminCommunityPage({ searchParams }: { searchParams: Promise<{ tab?: string; course?: string; status?: string; author?: string }> }) {
  const sp = await searchParams;
  const tab: ModerationTab = sp.tab === "posts" || sp.tab === "replies" ? sp.tab : "reports";
  const status: StatusFilter = sp.status === "visible" || sp.status === "hidden" || sp.status === "removed" ? sp.status : "all";
  const courseId = sp.course?.trim() || null;
  const authorId = sp.author?.trim() || null;
  const data = await getModerationData({ tab: authorId && tab === "reports" ? "posts" : tab, courseId, status, authorId });
  const effectiveTab: ModerationTab = authorId && tab === "reports" ? "posts" : tab;
  let authorName: string | null = null;
  if (authorId) {
    const { db } = await getServices();
    authorName = (await db.from("profiles").get(authorId))?.name ?? null;
  }
  const tabHref = (t: ModerationTab) => `/admin/community?tab=${t}${courseId ? `&course=${courseId}` : ""}${authorId ? `&author=${authorId}` : ""}`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader eyebrow="Community" title="Moderation" description="Reports come first. Hide keeps a post out of sight (reversible); remove takes it down for good. Pinned posts stay on top; locked threads take no new replies." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open reports" value={data.counts.open_reports} icon={<Flag />} tone={data.counts.open_reports > 0 ? "rose" : "sage"} hint={data.counts.open_reports > 0 ? "Needs a look" : "All clear"} />
        <StatCard label="Posts" value={data.counts.posts} icon={<MessageSquare />} tone="default" hint={`${data.counts.hidden} hidden`} />
        <StatCard label="Replies" value={data.counts.replies} icon={<MessageSquare />} tone="default" />
      </div>

      <nav aria-label="Moderation sections" className="inline-flex h-11 w-fit max-w-full items-center gap-1 overflow-x-auto rounded-lg bg-muted-bg p-1 no-scrollbar">
        <TabLink href={tabHref("reports")} active={effectiveTab === "reports"}>
          Reports
          {data.counts.open_reports > 0 ? <Badge variant="rose">{data.counts.open_reports}</Badge> : null}
        </TabLink>
        <TabLink href={tabHref("posts")} active={effectiveTab === "posts"}>
          Posts
        </TabLink>
        <TabLink href={tabHref("replies")} active={effectiveTab === "replies"}>
          Replies
        </TabLink>
      </nav>

      {effectiveTab === "reports" ? (
        data.reports.length === 0 ? (
          <EmptyState icon={<Flag />} title="No open reports" description="When a member flags a post or reply it shows up here with their reason." size="sm" />
        ) : (
          <ul className="grid gap-3">
            {data.reports.map((r) => (
              <li key={r.id} className="card-soft p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      Reported by <span className="font-semibold text-foreground">{r.reporter.name}</span> · {when(r.created_at)}
                    </p>
                    <p className="mt-1 rounded-md bg-warning-soft px-2 py-1 text-sm text-warning">
                      <span className="font-semibold">Reason:</span> {r.reason || "No reason given"}
                    </p>
                    {r.target ? (
                      <blockquote className="mt-3 border-l-2 border-gold pl-3 text-sm">
                        <p className="font-semibold">
                          {r.target.kind === "post" ? "Post" : "Reply"}
                          {r.target.title ? ` · ${r.target.title}` : ""} <Badge variant={statusVariant[r.target.status]}>{r.target.status}</Badge>
                        </p>
                        <p className="mt-1 text-foreground/90">{r.target.excerpt}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          by{" "}
                          {r.target.author.deleted ? (
                            r.target.author.name
                          ) : (
                            <Link href={`/admin/students/${r.target.author.id}`} className="text-rose-strong underline underline-offset-4">
                              {r.target.author.name}
                            </Link>
                          )}
                        </p>
                      </blockquote>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">The reported content no longer exists.</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1 sm:flex-col">
                    <ActionButton action={resolveReportAction} fields={{ report_id: r.id, action: "hide" }} variant="outline" size="sm" pendingLabel="Hiding…" disabled={!r.target}>
                      Hide
                    </ActionButton>
                    <ActionButton action={resolveReportAction} fields={{ report_id: r.id, action: "remove" }} variant="outline" size="sm" className="border-danger/40 text-danger hover:bg-danger-soft" pendingLabel="Removing…" disabled={!r.target}>
                      Remove
                    </ActionButton>
                    <ActionButton action={resolveReportAction} fields={{ report_id: r.id, action: "dismiss" }} variant="ghost" size="sm" pendingLabel="Dismissing…">
                      Dismiss
                    </ActionButton>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {effectiveTab === "posts" ? (
        <>
          <CommunityFilters tab="posts" courses={data.courses.map((c) => ({ id: c.id, title: c.title }))} courseId={courseId} status={status} authorId={authorId} authorName={authorName} />
          {data.posts.length === 0 ? (
            <EmptyState icon={<MessageSquare />} title="No posts match" description="Try another course or status." size="sm" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Where</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.posts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[320px] whitespace-normal">
                      <p className="flex flex-wrap items-center gap-1.5 font-semibold">
                        {p.pinned ? <Pin className="size-3.5 text-warning" aria-label="Pinned" /> : null}
                        {p.locked ? <Lock className="size-3.5 text-muted-foreground" aria-label="Locked" /> : null}
                        <span className="line-clamp-1">{p.title}</span>
                      </p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {when(p.created_at)} · {p.reply_count} {p.reply_count === 1 ? "reply" : "replies"} · {p.like_count} {p.like_count === 1 ? "like" : "likes"}
                      </p>
                    </TableCell>
                    <TableCell>
                      {p.author.deleted ? (
                        <span className="text-muted-foreground">{p.author.name}</span>
                      ) : (
                        <Link href={`/admin/students/${p.author.id}`} className="font-medium text-rose-strong underline-offset-4 hover:underline">
                          {p.author.name}
                        </Link>
                      )}
                      {p.anonymous ? <span className="block text-[11px] text-muted-foreground">posted anonymously</span> : null}
                      {p.author.role === "admin" ? <Badge variant="gold" className="mt-1">Instructor</Badge> : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="block max-w-[180px] truncate">{p.course_title}</span>
                      <span className="block max-w-[180px] truncate text-xs">{p.category_title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[p.status]} className="capitalize">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <ActionButton action={setPostFlagAction} fields={{ post_id: p.id, flag: "pinned", value: p.pinned ? "0" : "1" }} variant="ghost" size="sm" pendingLabel="Saving…" aria-pressed={p.pinned}>
                          {p.pinned ? <PinOff aria-hidden="true" /> : <Pin aria-hidden="true" />}
                          {p.pinned ? "Unpin" : "Pin"}
                        </ActionButton>
                        <ActionButton action={setPostFlagAction} fields={{ post_id: p.id, flag: "locked", value: p.locked ? "0" : "1" }} variant="ghost" size="sm" pendingLabel="Saving…" aria-pressed={p.locked}>
                          {p.locked ? <LockOpen aria-hidden="true" /> : <Lock aria-hidden="true" />}
                          {p.locked ? "Unlock" : "Lock"}
                        </ActionButton>
                        {p.status !== "visible" ? (
                          <ActionButton action={setPostStatusAction} fields={{ post_id: p.id, status: "visible" }} variant="ghost" size="sm" pendingLabel="Restoring…">
                            Restore
                          </ActionButton>
                        ) : null}
                        {p.status === "visible" ? (
                          <ActionButton action={setPostStatusAction} fields={{ post_id: p.id, status: "hidden" }} variant="ghost" size="sm" pendingLabel="Hiding…">
                            Hide
                          </ActionButton>
                        ) : null}
                        {p.status !== "removed" ? (
                          <ActionButton action={setPostStatusAction} fields={{ post_id: p.id, status: "removed" }} variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger" pendingLabel="Removing…">
                            Remove
                          </ActionButton>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {data.total > data.posts.length ? <p className="text-xs text-muted-foreground">Showing the newest {data.posts.length} of {data.total}. Narrow by course or status to see the rest.</p> : null}
        </>
      ) : null}

      {effectiveTab === "replies" ? (
        <>
          <CommunityFilters tab="replies" courses={data.courses.map((c) => ({ id: c.id, title: c.title }))} courseId={courseId} status={status} authorId={authorId} authorName={authorName} />
          {data.replies.length === 0 ? (
            <EmptyState icon={<MessageSquare />} title="No replies match" description="Try another course or status." size="sm" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reply</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Thread</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.replies.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[320px] whitespace-normal">
                      <p className="line-clamp-2 text-sm">{r.excerpt}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {when(r.created_at)} · {r.like_count} {r.like_count === 1 ? "like" : "likes"}
                      </p>
                    </TableCell>
                    <TableCell>
                      {r.author.deleted ? (
                        <span className="text-muted-foreground">{r.author.name}</span>
                      ) : (
                        <Link href={`/admin/students/${r.author.id}`} className="font-medium text-rose-strong underline-offset-4 hover:underline">
                          {r.author.name}
                        </Link>
                      )}
                      {r.anonymous ? <span className="block text-[11px] text-muted-foreground">posted anonymously</span> : null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="block max-w-[200px] truncate">{r.post_title}</span>
                      <span className="block max-w-[200px] truncate text-xs">{r.course_title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[r.status]} className="capitalize">
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {r.status !== "visible" ? (
                          <ActionButton action={setReplyStatusAction} fields={{ reply_id: r.id, status: "visible" }} variant="ghost" size="sm" pendingLabel="Restoring…">
                            Restore
                          </ActionButton>
                        ) : null}
                        {r.status === "visible" ? (
                          <ActionButton action={setReplyStatusAction} fields={{ reply_id: r.id, status: "hidden" }} variant="ghost" size="sm" pendingLabel="Hiding…">
                            Hide
                          </ActionButton>
                        ) : null}
                        {r.status !== "removed" ? (
                          <ActionButton action={setReplyStatusAction} fields={{ reply_id: r.id, status: "removed" }} variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger" pendingLabel="Removing…">
                            Remove
                          </ActionButton>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      ) : null}

      <p className="text-xs text-muted-foreground">
        To take down everything one member posted, open their student page and use <strong>Remove all posts</strong>. {" "}
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
          <Link href="/admin/students">Find a student</Link>
        </Button>
      </p>
    </div>
  );
}
