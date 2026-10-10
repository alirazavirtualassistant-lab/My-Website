import type { Metadata } from "next";
import Link from "next/link";
import { Shield, UserMinus } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { formatDate, initials } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmActionDialog } from "@/components/admin/students/confirm-action-dialog";
import { AddMemberForm } from "@/components/admin/team/add-member-form";
import { TeamRoleEditor } from "@/components/admin/team/team-role-editor";
import { listTeam } from "./queries";
import { removeTeamMemberAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Team", robots: { index: false, follow: false } };

export default async function AdminTeamPage() {
  const session = await requireRole("admin", "/admin/team");
  const { members, adminCount } = await listTeam();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <PageHeader eyebrow="Owner only" title="Team" description="Who can open the admin panel. Owners see everything; assistants get everything except products, coupons, settings and this page." />

      <section aria-labelledby="members-title" className="card-soft overflow-hidden">
        <header className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
          <Shield className="size-5 text-rose-strong" aria-hidden="true" />
          <h2 id="members-title" className="font-serif text-2xl leading-tight">
            Members
          </h2>
          <Badge variant="muted" className="ml-auto">
            {adminCount} {adminCount === 1 ? "owner" : "owners"}
          </Badge>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last admin action</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => {
              const isSelf = m.id === session.user_id;
              const lastOwner = m.role === "admin" && adminCount <= 1;
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {m.avatar_url ? <AvatarImage src={m.avatar_url} alt="" /> : null}
                        <AvatarFallback>{initials(m.name) || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link href={`/admin/students/${m.id}`} className="block truncate font-semibold hover:text-rose-strong hover:underline">
                          {m.name}
                          {isSelf ? <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span> : null}
                        </Link>
                        <span className="block truncate text-xs text-muted-foreground">{m.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isSelf || lastOwner ? (
                      <Badge variant={m.role === "admin" ? "rose" : "gold"}>{m.role === "admin" ? "Owner" : "Assistant"}</Badge>
                    ) : (
                      <TeamRoleEditor userId={m.id} role={m.role as "admin" | "assistant"} name={m.name} />
                    )}
                    {lastOwner && !isSelf ? <span className="block text-[11px] text-muted-foreground">Last owner</span> : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(m.created_at, { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                  <TableCell className="text-muted-foreground">{m.last_action_at ? formatDate(m.last_action_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}</TableCell>
                  <TableCell className="text-right">
                    {isSelf ? (
                      <span className="text-xs text-muted-foreground">Another owner can change your access.</span>
                    ) : lastOwner ? (
                      <span className="text-xs text-muted-foreground">Promote someone else first.</span>
                    ) : (
                      <ConfirmActionDialog
                        action={removeTeamMemberAction}
                        fields={{ user_id: m.id }}
                        trigger={
                          <Button variant="ghost" size="sm" className="text-danger hover:bg-danger-soft hover:text-danger">
                            <UserMinus aria-hidden="true" /> Remove
                          </Button>
                        }
                        title={`Remove ${m.name} from the team?`}
                        description="Choose whether they keep a learner account or lose the account entirely."
                        confirmLabel="Remove"
                      >
                        <RadioGroup name="mode" defaultValue="demote">
                          <Label htmlFor={`mode-demote-${m.id}`} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
                            <RadioGroupItem id={`mode-demote-${m.id}`} value="demote" className="mt-0.5" />
                            <span className="grid gap-0.5">
                              <span>Make them a learner</span>
                              <span className="text-xs font-normal text-muted-foreground">They keep their account and any courses; the admin panel closes.</span>
                            </span>
                          </Label>
                          <Label htmlFor={`mode-delete-${m.id}`} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
                            <RadioGroupItem id={`mode-delete-${m.id}`} value="delete" className="mt-0.5" />
                            <span className="grid gap-0.5">
                              <span>Delete the account</span>
                              <span className="text-xs font-normal text-muted-foreground">Progress, notes and sign-in are removed. Order records are kept. This can’t be undone.</span>
                            </span>
                          </Label>
                        </RadioGroup>
                      </ConfirmActionDialog>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <section aria-labelledby="add-title" className="card-soft p-5 sm:p-6">
        <header className="mb-5">
          <h2 id="add-title" className="font-serif text-2xl leading-tight">
            Add a team member
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">The account is created verified. They get a welcome email, plus either a set-password link or the temporary password you share with them.</p>
        </header>
        <AddMemberForm />
      </section>
    </div>
  );
}
