import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, HeartHandshake, Hourglass, Lock, MailCheck, Users } from "lucide-react";
import { getCurrentUser, requireUser } from "@/lib/auth/session";
import { getLearnerAccess } from "@/lib/usecases/access";
import { getCourseBySlug, lessonSlug } from "@/lib/usecases/catalog";
import { getCoupleForCourse } from "@/lib/usecases/partner-gifts";
import { getLearnerCourseState, type LearnerCourseState } from "@/lib/usecases/progress";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Illustration } from "@/components/shared/illustration";
import { PARTNER_LESSON_CODES } from "@/components/checkout/pricing-labels";
import { CoupleProgress } from "@/components/couple/couple-progress";
import { PartnerExercises } from "@/components/couple/partner-exercises";
import { TalkPrompts } from "@/components/couple/talk-prompts";
import { PartnerInviteForm } from "@/components/couple/partner-invite-form";
import { RevokeInviteButton } from "@/components/couple/revoke-invite-button";
import type { PartnerExerciseRow, PersonProgressView } from "@/components/couple/types";
import { invitePartnerAction, revokePartnerInviteAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Couple space", robots: { index: false, follow: false } };

function personView(profile: Profile, state: LearnerCourseState | null, roleLabel: PersonProgressView["roleLabel"], isMe: boolean): PersonProgressView {
  return {
    id: profile.id,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    roleLabel,
    isMe,
    percent: state?.summary.percent ?? 0,
    completedLessons: state?.summary.completedLessons ?? 0,
    totalLessons: state?.summary.totalLessons ?? 0,
    xp: state?.xpTotal ?? 0,
    levelLabel: state?.level.level.label ?? "Seedling",
    streak: state?.streak?.current ?? 0,
  };
}

function exerciseRows(courseSlug: string, mine: LearnerCourseState, theirs: LearnerCourseState | null): PartnerExerciseRow[] {
  const wanted = new Map<string, number>(PARTNER_LESSON_CODES.map((c, i) => [c, i]));
  const rows: PartnerExerciseRow[] = [];
  for (const m of mine.tree.modules) {
    for (const l of m.lessons) {
      if (!wanted.has(l.code)) continue;
      const my = mine.lessons[l.id];
      rows.push({
        lessonId: l.id,
        code: l.code,
        moduleCode: m.code,
        title: l.title,
        href: `/learn/${courseSlug}/${lessonSlug(l)}`,
        unlocked: my?.unlocked ?? false,
        unlocksAt: my?.unlocksAt ?? null,
        me: my?.completed ?? false,
        partner: theirs ? (theirs.lessons[l.id]?.completed ?? false) : null,
        prompts: l.action_steps.map((s) => s.label).filter((s) => s.trim().length > 0),
      });
    }
  }
  return rows.sort((a, b) => (wanted.get(a.code) ?? 99) - (wanted.get(b.code) ?? 99));
}

export default async function CoupleSpacePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const session = await requireUser(`/learn/${slug}/couple`);
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const courseHref = `/learn/${course.slug}`;
  const access = await getLearnerAccess(session.user_id, course.id, session.role);

  if (!access.allowed) {
    return (
      <EmptyState
        icon={<Lock />}
        title="The couple space opens with the course"
        description="Enrol in the course to unlock the shared checklist and the partner seat."
        action={
          <Button asChild>
            <Link href={`/courses/${course.slug}`}>See the course</Link>
          </Button>
        }
      />
    );
  }

  if (!course.partner_seat_enabled) {
    return (
      <EmptyState
        icon={<Users />}
        title="This course doesn't include a partner seat"
        description="Some courses are designed to be walked alone. You can still share what you learn in the community."
        action={
          <Button asChild variant="outline">
            <Link href={courseHref}>Back to the course</Link>
          </Button>
        }
      />
    );
  }

  const [me, couple] = await Promise.all([getCurrentUser(), getCoupleForCourse(session.user_id, course.id)]);
  if (!me) notFound();
  const partnerProfile: Profile | null = couple.link?.status === "accepted" ? (couple.role === "owner" ? couple.partner : couple.owner) : null;
  const [myState, theirState] = await Promise.all([
    getLearnerCourseState(session.user_id, course.id, session.role),
    partnerProfile ? getLearnerCourseState(partnerProfile.id, course.id) : Promise.resolve(null),
  ]);
  if (!myState) notFound();

  const myRole: PersonProgressView["roleLabel"] = couple.role === "partner" ? "Partner" : "Course owner";
  const theirRole: PersonProgressView["roleLabel"] = couple.role === "partner" ? "Course owner" : "Partner";
  const people: PersonProgressView[] = [personView(me.profile, myState, myRole, true)];
  if (partnerProfile) people.push(personView(partnerProfile, theirState, theirRole, false));
  const rows = exerciseRows(course.slug, myState, theirState);
  const invitesRemaining = access.enrollment?.partner_invites_remaining ?? 0;
  const pending = couple.role === "owner" && couple.link?.status === "pending" ? couple.link : null;
  const accepted = couple.link?.status === "accepted" ? couple.link : null;

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        <Link href={courseHref} className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-rose-strong hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to {course.title}
        </Link>
        <PageHeader
          eyebrow={`${course.title} · Couple space`}
          title="Learning together"
          description="One course, two accounts, one shared checklist. Each of you keeps your own progress and notes; this page shows how you are walking it side by side."
        />
      </div>

      <section aria-labelledby="couple-seat" className="card-soft p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="couple-seat" className="flex items-center gap-2 font-serif text-2xl">
            <HeartHandshake className="size-5 text-rose-strong" aria-hidden="true" />
            {accepted ? "You two" : "Partner seat"}
          </h2>
          {accepted ? <Badge variant="success">Seat in use</Badge> : pending ? <Badge variant="gold">Invitation pending</Badge> : <Badge variant="muted">Seat available</Badge>}
        </div>

        {accepted ? (
          <div className="grid gap-5">
            <CoupleProgress people={people} />
            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                {couple.role === "owner"
                  ? `${partnerProfile?.name ?? "Your partner"} joined on ${formatDate(accepted.accepted_at)}.`
                  : `You joined ${partnerProfile?.name ?? "your partner"}'s seat on ${formatDate(accepted.accepted_at)}.`}
              </p>
              {couple.role === "owner" ? <RevokeInviteButton action={revokePartnerInviteAction} courseSlug={course.slug} linkId={accepted.id} accepted /> : null}
            </div>
          </div>
        ) : pending ? (
          <div className="grid gap-5">
            <div className="flex items-start gap-3 rounded-lg border border-gold/50 bg-gold-soft/40 p-4">
              <div aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-soft text-warning">
                <Hourglass className="size-4" />
              </div>
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-foreground">Waiting for {pending.invite_email}</p>
                <p className="mt-0.5 text-muted-foreground">Invitation sent {formatDate(pending.created_at)}. They accept it from the email on their own account — any account, so a different email is fine too.</p>
              </div>
            </div>
            <PartnerInviteForm action={invitePartnerAction} courseSlug={course.slug} defaultEmail={pending.invite_email} submitLabel="Send again" pendingLabel="Sending…" />
            <div className="flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MailCheck className="size-3.5" aria-hidden="true" />
                Change the address above and press “Send again” to redirect the invitation.
              </p>
              <RevokeInviteButton action={revokePartnerInviteAction} courseSlug={course.slug} linkId={pending.id} accepted={false} />
            </div>
          </div>
        ) : couple.role === "owner" ? (
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:items-center">
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Your enrolment includes one seat for a partner. They get the whole course on their own account, on the same unlock schedule as you. Invite them whenever it feels right.
              </p>
              {invitesRemaining > 0 || access.via === "admin" ? (
                <PartnerInviteForm action={invitePartnerAction} courseSlug={course.slug} />
              ) : (
                <p className="rounded-lg bg-cream-2/60 p-4 text-sm text-muted-foreground">
                  The partner seat for this enrolment has already been used. If that seems wrong,{" "}
                  <Link href="/contact" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
                    get in touch
                  </Link>{" "}
                  and we will sort it out.
                </p>
              )}
            </div>
            <Illustration name="family" className="mx-auto hidden w-40 text-rose-strong md:block" />
          </div>
        ) : (
          <CoupleProgress people={people} />
        )}
      </section>

      <section aria-labelledby="couple-exercises" className="grid gap-4">
        <div>
          <p className="eyebrow">Shared checklist</p>
          <h2 id="couple-exercises" className="mt-1">
            Partner exercises
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The lessons that ask the two of you to do something together. Open a lesson, do the step, and mark it complete there — this list keeps score for both of you.
          </p>
        </div>
        {rows.length > 0 ? (
          <PartnerExercises rows={rows} meLabel={me.profile.name} partnerLabel={partnerProfile?.name ?? null} />
        ) : (
          <EmptyState size="sm" icon={<Users />} title="No partner lessons yet" description="The couple exercises will appear here as the course is published." />
        )}
      </section>

      <section aria-labelledby="couple-talk" className="grid gap-4">
        <div>
          <p className="eyebrow">Talk about it</p>
          <h2 id="couple-talk" className="mt-1">
            Conversation starters
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">The action steps from each partner lesson, in Cynthia’s words. Pick one for a walk, a meal, or the end of the day.</p>
        </div>
        {rows.length > 0 ? <TalkPrompts rows={rows} /> : null}
      </section>
    </div>
  );
}
