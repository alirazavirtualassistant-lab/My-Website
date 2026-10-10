import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, KeyRound, Mail, MessageSquare, Receipt, ShieldAlert, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { formatDate, formatMoney, initials } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/admin/students/action-button";
import { ConfirmActionDialog } from "@/components/admin/students/confirm-action-dialog";
import { EnrollForm } from "@/components/admin/students/enroll-form";
import { RoleEditor, ROLE_LABELS } from "@/components/admin/students/role-editor";
import { getStudentDetail } from "../queries";
import {
  deleteUserAction,
  reactivateEnrollmentAction,
  refundOrderAction,
  removeUserPostsAction,
  resendReceiptAction,
  revokeEnrollmentAction,
  sendPasswordResetAction,
  setCertificateRevokedAction,
  setUnlockAllAction,
} from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Student", robots: { index: false, follow: false } };

const roleVariant = { learner: "muted", assistant: "gold", admin: "rose" } as const;
const enrollmentVariant = { active: "success", revoked: "rose", expired: "muted" } as const;
const orderVariant = { paid: "success", pending: "muted", refunded: "rose", partially_refunded: "gold", failed: "rose" } as const;
const shortDate = (iso: string | null | undefined) => (iso ? formatDate(iso, { month: "short", day: "numeric", year: "numeric" }) : "—");

function Section({ title, description, icon, children, id }: { title: string; description?: string; icon?: React.ReactNode; children: React.ReactNode; id: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="card-soft p-5 sm:p-6">
      <header className="mb-4 flex items-start gap-3">
        {icon ? (
          <span aria-hidden="true" className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-soft/70 text-rose-strong [&>svg]:size-4.5">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 id={`${id}-title`} className="font-serif text-2xl leading-tight">
            {title}
          </h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}

export default async function AdminStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin(`/admin/students/${id}`);
  const detail = await getStudentDetail(id);
  if (!detail) notFound();
  const { profile, enrollments, enrollableCourses, progress, certificates, orders, subscriptions, communityCounts, audit } = detail;
  const isSelf = session.user_id === profile.id;
  const isOwner = session.role === "admin";
  const prefs = profile.email_preferences ?? { progress_nudges: false, drip_unlocks: false, newsletter: false, community: false };
  const prefLabels: Array<[keyof typeof prefs, string]> = [
    ["drip_unlocks", "Module unlocks"],
    ["progress_nudges", "Progress nudges"],
    ["community", "Community replies"],
    ["newsletter", "Newsletter"],
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Link href="/admin/students" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-rose-strong">
        <ArrowLeft className="size-4" aria-hidden="true" /> All students
      </Link>
      <PageHeader
        eyebrow="Student"
        title={profile.name}
        description={`${profile.email} · joined ${shortDate(profile.created_at)}`}
        actions={
          <>
            <ActionButton action={sendPasswordResetAction} fields={{ user_id: profile.id }} variant="outline" pendingLabel="Sending…">
              <KeyRound aria-hidden="true" /> Send password reset
            </ActionButton>
            {!isSelf ? (
              <ConfirmActionDialog
                action={deleteUserAction}
                fields={{ user_id: profile.id }}
                trigger={
                  <Button variant="destructive">
                    <Trash2 aria-hidden="true" /> Delete user
                  </Button>
                }
                title={`Delete ${profile.name}?`}
                description={
                  <>
                    This removes their progress, notes, uploads, certificates and sign-in for <span className="font-semibold">{profile.email}</span>. Community posts become “Deleted member”. Order records are kept for accounting. This can’t be undone.
                  </>
                }
                confirmWord="DELETE"
                confirmLabel="Delete this account"
                warning="If they only want fewer emails, their Account → Emails page can do that instead."
              />
            ) : null}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Profile column */}
        <div className="flex flex-col gap-6">
          <section aria-label="Profile" className="card-soft p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
                <AvatarFallback className="text-lg">{initials(profile.name) || "?"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-serif text-xl leading-tight">{profile.name}</p>
                <Badge variant={roleVariant[profile.role]} className="mt-1 capitalize">
                  {ROLE_LABELS[profile.role]}
                </Badge>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="truncate text-right font-medium">{profile.email}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Joined</dt>
                <dd className="font-medium">{shortDate(profile.created_at)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Timezone</dt>
                <dd className="font-medium">{profile.timezone ?? "Not set"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Disclaimer</dt>
                <dd className="font-medium">{profile.disclaimer_accepted_at ? `Accepted ${shortDate(profile.disclaimer_accepted_at)}` : "Not yet accepted"}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Email preferences</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {prefLabels.map(([key, label]) => (
                  <li key={key}>
                    <Badge variant={prefs[key] ? "success" : "muted"}>{label}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            {isOwner ? (
              <div className="mt-6 border-t border-border pt-5">
                {isSelf ? <p className="text-sm text-muted-foreground">This is your own account. Another owner can change your role.</p> : <RoleEditor userId={profile.id} role={profile.role} />}
              </div>
            ) : null}
          </section>

          <Section id="subscriptions" title="Memberships" icon={<Receipt />}>
            {subscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No membership or payment plan.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {subscriptions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{s.product_title}</p>
                      <p className="text-xs text-muted-foreground">{s.current_period_end ? `Renews ${shortDate(s.current_period_end)}` : "No renewal date"}</p>
                    </div>
                    <Badge variant={s.status === "active" || s.status === "trialing" ? "success" : s.status === "past_due" ? "gold" : "muted"} className="capitalize">
                      {s.status.replace("_", " ")}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="community" title="Community" icon={<MessageSquare />} description="Posts and replies by this member.">
            <p className="text-sm">
              <span className="font-semibold tabular-nums">{communityCounts.posts}</span> {communityCounts.posts === 1 ? "post" : "posts"} ·{" "}
              <span className="font-semibold tabular-nums">{communityCounts.replies}</span> {communityCounts.replies === 1 ? "reply" : "replies"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/community?author=${profile.id}`}>Review their posts</Link>
              </Button>
              {communityCounts.posts + communityCounts.replies > 0 ? (
                <ConfirmActionDialog
                  action={removeUserPostsAction}
                  fields={{ user_id: profile.id }}
                  trigger={
                    <Button variant="outline" size="sm" className="border-danger/40 text-danger hover:bg-danger-soft">
                      <ShieldAlert aria-hidden="true" /> Remove all posts
                    </Button>
                  }
                  title="Remove everything this member posted?"
                  description="Every post and reply they wrote is marked removed and disappears from the community. Their account stays active."
                  confirmLabel="Remove all posts"
                />
              ) : null}
            </div>
          </Section>
        </div>

        {/* Detail column */}
        <div className="flex min-w-0 flex-col gap-6">
          <Section id="enrollments" title="Enrollments" description="Access to each course, where it came from, and the drip override.">
            {enrollments.length === 0 ? (
              <p className="mb-4 text-sm text-muted-foreground">Not enrolled in anything yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Drip</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="max-w-[240px] truncate font-semibold">{e.course?.title ?? "Unknown course"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {e.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{shortDate(e.started_at)}</TableCell>
                      <TableCell>
                        <Badge variant={enrollmentVariant[e.status]} className="capitalize">
                          {e.status}
                        </Badge>
                        {e.expires_at ? <span className="ml-2 text-xs text-muted-foreground">until {shortDate(e.expires_at)}</span> : null}
                      </TableCell>
                      <TableCell>
                        <ActionButton
                          action={setUnlockAllAction}
                          fields={{ enrollment_id: e.id, user_id: profile.id, unlock_all: e.unlock_all ? "0" : "1" }}
                          variant={e.unlock_all ? "secondary" : "outline"}
                          size="sm"
                          aria-pressed={e.unlock_all}
                          pendingLabel="Saving…"
                        >
                          {e.unlock_all ? "All unlocked" : "Unlock all"}
                        </ActionButton>
                      </TableCell>
                      <TableCell className="text-right">
                        {e.status === "active" ? (
                          <ActionButton action={revokeEnrollmentAction} fields={{ enrollment_id: e.id, user_id: profile.id }} variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger" pendingLabel="Revoking…">
                            Revoke
                          </ActionButton>
                        ) : (
                          <ActionButton action={reactivateEnrollmentAction} fields={{ enrollment_id: e.id, user_id: profile.id }} variant="ghost" size="sm" pendingLabel="Re-activating…">
                            Re-activate
                          </ActionButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-5 border-t border-border pt-5">
              <EnrollForm userId={profile.id} courses={enrollableCourses.map((c) => ({ id: c.id, title: c.title, status: c.status }))} />
            </div>
          </Section>

          <Section id="progress" title="Progress" description="Completion status only. Notes, journals, uploads and quiz answers stay private to the learner.">
            {progress.length === 0 ? (
              <p className="text-sm text-muted-foreground">No course progress yet.</p>
            ) : (
              <ul className="grid gap-5">
                {progress.map((p) => (
                  <li key={p.course.id} className="grid gap-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold">{p.course.title}</p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {p.percent}% · {p.completedLessons}/{p.totalLessons} lessons · {p.xp.toLocaleString("en-US")} XP · {p.level}
                      </p>
                    </div>
                    <Progress value={p.percent} aria-label={`${p.course.title}: ${p.percent}% complete`} />
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="certificates" title="Certificates" icon={<Award />}>
            {certificates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No certificate issued yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Verify code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="max-w-[240px] truncate font-semibold">{c.course?.title ?? c.course_title}</TableCell>
                      <TableCell className="text-muted-foreground">{shortDate(c.issued_at)}</TableCell>
                      <TableCell>
                        <Link href={`/verify/${c.verify_code}`} className="font-mono text-xs text-rose-strong underline underline-offset-4">
                          {c.verify_code}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.revoked_at ? "rose" : "success"}>{c.revoked_at ? `Revoked ${shortDate(c.revoked_at)}` : "Valid"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButton
                          action={setCertificateRevokedAction}
                          fields={{ certificate_id: c.id, user_id: profile.id, revoked: c.revoked_at ? "0" : "1" }}
                          variant="ghost"
                          size="sm"
                          className={c.revoked_at ? undefined : "text-danger hover:bg-danger-soft hover:text-danger"}
                          pendingLabel="Saving…"
                        >
                          {c.revoked_at ? "Restore" : "Revoke"}
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Section>

          <Section id="orders" title="Orders" icon={<Receipt />} description="Refunds go through the payment provider and remove the access tied to the order.">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="text-muted-foreground">
                        {shortDate(o.paid_at ?? o.created_at)}
                        <span className="block font-mono text-[11px]">{o.id.slice(0, 8)}</span>
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate">{o.items.map((i) => `${i.title}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`).join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant={orderVariant[o.status]} className="capitalize">
                          {o.status.replace("_", " ")}
                        </Badge>
                        {o.coupon_code ? <span className="ml-2 text-xs text-muted-foreground">{o.coupon_code}</span> : null}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(o.total_cents, o.currency)}
                        {o.refunded_cents > 0 ? <span className="block text-xs text-muted-foreground">−{formatMoney(o.refunded_cents, o.currency)} refunded</span> : null}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          {["paid", "partially_refunded", "refunded"].includes(o.status) ? (
                            <ActionButton action={resendReceiptAction} fields={{ order_id: o.id }} variant="ghost" size="sm" pendingLabel="Sending…">
                              <Mail aria-hidden="true" /> Resend receipt
                            </ActionButton>
                          ) : null}
                          {o.status === "paid" ? (
                            <ConfirmActionDialog
                              action={refundOrderAction}
                              fields={{ order_id: o.id, user_id: profile.id }}
                              trigger={
                                <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger">
                                  Refund
                                </Button>
                              }
                              title={`Refund ${formatMoney(o.total_cents, o.currency)}?`}
                              description={`The full amount goes back to the original payment method and the access this order granted is removed. ${profile.name} will keep their account.`}
                              confirmLabel="Issue refund"
                            />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Section>

          <Section id="activity" title="Activity log" description="Admin actions and account events for this student, newest first.">
            {audit.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing logged yet.</p>
            ) : (
              <ol className="divide-y divide-border text-sm">
                {audit.map((a) => (
                  <li key={a.id} className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-3">
                    <time dateTime={a.created_at} className="shrink-0 text-xs text-muted-foreground tabular-nums sm:w-36">
                      {formatDate(a.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </time>
                    <span className="font-mono text-xs text-rose-strong">{a.action}</span>
                    <span className="text-muted-foreground">
                      {a.actor_name ? `by ${a.actor_user_id === profile.id ? "the student" : a.actor_name}` : "by the system"}
                      {a.target_type !== "profile" ? ` · ${a.target_type.replace("_", " ")}` : ""}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
