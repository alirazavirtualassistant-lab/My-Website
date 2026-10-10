import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, SearchX, UserRound } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getPartnerInviteByToken } from "@/lib/usecases/partner-gifts";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";
import { RedeemForm } from "@/components/checkout/redeem-form";
import { acceptPartnerInviteAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partner invitation", robots: { index: false, follow: false } };

export default async function PartnerInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [invite, session] = await Promise.all([token.length >= 16 && token.length <= 200 ? getPartnerInviteByToken(token) : Promise.resolve(null), getSession()]);
  const nextPath = `/partner/${token}`;

  if (!invite) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="This invitation isn't valid any more"
        description="It may have been accepted already, cancelled, or replaced by a newer invitation. Ask your partner to send a fresh one from their couple space."
        action={
          <Button asChild variant="outline">
            <Link href={session ? "/learn" : "/"}>{session ? "Go to My Learning" : "Back home"}</Link>
          </Button>
        }
      />
    );
  }

  if (session && session.user_id === invite.owner_user_id) {
    return (
      <EmptyState
        icon={<UserRound />}
        title="This is your own invitation"
        description={`Share this link with ${invite.invite_email} — they accept it on their account. You can resend or change it from the couple space.`}
        action={
          <Button asChild>
            <Link href="/learn">Go to My Learning</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Illustration name="family" size={104} className="shrink-0 text-rose-strong" />
        <header className="grid gap-2">
          <p className="eyebrow">Partner seat</p>
          <h1 className="text-balance">{invite.inviter_name || "Your partner"} invited you to learn together</h1>
          <p className="text-pretty text-muted-foreground sm:text-lg">
            Join <span className="font-semibold text-foreground">{invite.course_title}</span> on your own account, at the same pace as {invite.inviter_name || "your partner"}. Lessons, resources and the couple exercises are shared; your progress and notes are your own.
          </p>
        </header>
      </div>

      <section aria-labelledby="partner-accept" className="card-soft p-5 sm:p-6">
        <h2 id="partner-accept" className="flex items-center gap-2 font-serif text-2xl">
          <HeartHandshake className="size-5 text-rose-strong" aria-hidden="true" />
          Accept the invitation
        </h2>
        {session ? (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              The course will be added to <span className="font-semibold text-foreground">{session.email}</span>. The invitation was sent to {invite.invite_email}; any account can accept it.
            </p>
            <RedeemForm className="mt-5" action={acceptPartnerInviteAction} token={token} label="Join as partner" pendingLabel="Adding the course…" icon={<HeartHandshake aria-hidden="true" />} />
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-muted-foreground">Sign in, or create a free account, and we will bring you straight back here.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/sign-up?next=${encodeURIComponent(nextPath)}`}>Create a free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/sign-in?next=${encodeURIComponent(nextPath)}&email=${encodeURIComponent(invite.invite_email)}`}>I already have an account</Link>
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
