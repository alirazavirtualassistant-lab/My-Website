import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Sparkles, CheckCircle2, Ban, SearchX } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getGiftByToken } from "@/lib/usecases/partner-gifts";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";
import { RedeemForm } from "@/components/checkout/redeem-form";
import { redeemGiftAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "A gift for you", robots: { index: false, follow: false } };

export default async function GiftPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [gift, session] = await Promise.all([token.length >= 16 && token.length <= 200 ? getGiftByToken(token) : Promise.resolve(null), getSession()]);
  const nextPath = `/gift/${token}`;

  if (!gift) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="This gift link isn't valid"
        description="It may have been copied incompletely. Open the link from the gift email again, or ask the person who sent it to check their order."
        action={
          <Button asChild variant="outline">
            <Link href="/contact">Contact support</Link>
          </Button>
        }
      />
    );
  }

  if (gift.status === "canceled") {
    return (
      <EmptyState
        icon={<Ban />}
        title="This gift was cancelled"
        description="The order behind it was refunded, so the gift can no longer be opened. If that is a surprise, the sender will know more."
        action={
          <Button asChild variant="outline">
            <Link href="/courses">Browse courses</Link>
          </Button>
        }
      />
    );
  }

  if (gift.status === "redeemed") {
    const mine = !!session && gift.redeemed_by_user_id === session.user_id;
    return (
      <EmptyState
        icon={<CheckCircle2 />}
        title={mine ? "You've already opened this gift" : "This gift has already been opened"}
        description={
          mine
            ? `It was added to your account on ${formatDate(gift.redeemed_at)}. Your course is waiting in My Learning.`
            : `It was redeemed on ${formatDate(gift.redeemed_at)}. If you think that was a mistake, get in touch and we will look into it.`
        }
        action={
          mine ? (
            <Button asChild>
              <Link href="/learn">Go to My Learning</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/contact">Contact support</Link>
            </Button>
          )
        }
      />
    );
  }

  const title = gift.product?.title ?? "a course";
  return (
    <div className="grid gap-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Illustration name="cradle" size={104} className="shrink-0 text-rose-strong" />
        <header className="grid gap-2">
          <p className="eyebrow">A gift for you</p>
          <h1 className="text-balance">
            {gift.recipient_name ? `${gift.recipient_name}, someone` : "Someone"} is thinking of you
          </h1>
          <p className="text-pretty text-muted-foreground sm:text-lg">
            A gift from <span className="font-semibold text-foreground">{gift.buyer_email}</span>: <span className="font-semibold text-foreground">{title}</span>.
          </p>
        </header>
      </div>

      {gift.message.trim() ? (
        <blockquote className="rounded-lg border border-gold/50 bg-gold-soft/40 p-5 font-serif text-xl leading-snug text-foreground/90 italic">
          “{gift.message.trim()}”
        </blockquote>
      ) : null}

      <section aria-labelledby="gift-open" className="card-soft p-5 sm:p-6">
        <h2 id="gift-open" className="flex items-center gap-2 font-serif text-2xl">
          <Gift className="size-5 text-rose-strong" aria-hidden="true" />
          Open your gift
        </h2>
        {gift.product?.description ? <p className="mt-2 text-sm text-muted-foreground">{gift.product.description}</p> : null}
        {session ? (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              It will be added to the account you are signed in with (<span className="font-semibold text-foreground">{session.email}</span>). Open it whenever the time feels right — it will wait.
            </p>
            <RedeemForm className="mt-5" action={redeemGiftAction} token={token} label="Add it to my account" pendingLabel="Opening your gift…" icon={<Sparkles aria-hidden="true" />} />
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-muted-foreground">Sign in, or create a free account, and we will bring you straight back here to open it.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/sign-up?next=${encodeURIComponent(nextPath)}`}>Create a free account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/sign-in?next=${encodeURIComponent(nextPath)}&email=${encodeURIComponent(gift.recipient_email)}`}>I already have an account</Link>
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
