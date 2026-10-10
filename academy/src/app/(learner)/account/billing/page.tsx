import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, ExternalLink, FlaskConical } from "lucide-react";
import { getServices } from "@/services";
import { formatDate, formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/account/section-card";
import { CancelSubscriptionButton } from "@/components/account/cancel-subscription-button";
import { BillingPortalButton } from "@/components/account/billing-portal-button";
import { requireProfile } from "../_shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Billing", robots: { index: false } };

const STATUS_LABEL: Record<string, { label: string; variant: "success" | "gold" | "muted" | "rose" }> = {
  active: { label: "Active", variant: "success" },
  trialing: { label: "Trial", variant: "gold" },
  past_due: { label: "Payment due", variant: "rose" },
  unpaid: { label: "Unpaid", variant: "rose" },
  incomplete: { label: "Incomplete", variant: "muted" },
  canceled: { label: "Ended", variant: "muted" },
};

export default async function AccountBillingPage() {
  const { session, profile } = await requireProfile("/account/billing");
  const { db, mode } = await getServices();
  const subscriptions = await db.from("subscriptions").list({ where: { user_id: session.user_id }, orderBy: ["created_at", "desc"] });
  const products = subscriptions.length ? await db.from("products").list({ where: { id: Array.from(new Set(subscriptions.map((s) => s.product_id))) } }) : [];
  const productById = new Map(products.map((p) => [p.id, p]));
  const mock = mode.payments === "mock";

  return (
    <>
      <SectionCard
        title="Payment details"
        description="Cards, invoices and billing address are managed securely by Stripe."
        actions={profile.stripe_customer_id ? <BillingPortalButton /> : null}
      >
        {profile.stripe_customer_id ? (
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-rose-strong" aria-hidden="true" />
              <span>Open the billing portal to update your card, download invoices or change your billing address. You’ll come straight back here afterwards.</span>
            </p>
            {mock ? (
              <p className="flex items-start gap-2 rounded-lg border border-gold/50 bg-gold-soft/60 px-3 py-2 text-xs text-foreground/90" role="note">
                <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden="true" />
                <span>Demo mode: this opens a mock billing portal. No real cards are involved.</span>
              </p>
            ) : null}
          </div>
        ) : (
          <EmptyState
            size="sm"
            icon={<CreditCard />}
            title="No billing profile yet"
            description="A billing profile is created with your first purchase. Nothing to manage until then."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/pricing">See pricing</Link>
              </Button>
            }
          />
        )}
      </SectionCard>

      <SectionCard title="Memberships" description="All-Access memberships and payment plans on this account.">
        {subscriptions.length === 0 ? (
          <EmptyState
            size="sm"
            icon={<CreditCard />}
            title="No memberships"
            description="One-time course purchases don't appear here — see Purchases for those."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/account/purchases">View purchases</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {subscriptions.map((sub) => {
              const product = productById.get(sub.product_id);
              const status = STATUS_LABEL[sub.status] ?? { label: sub.status, variant: "muted" as const };
              const periodEnd = sub.current_period_end ? formatDate(sub.current_period_end) : null;
              const canCancel = ["active", "trialing", "past_due"].includes(sub.status) && !sub.cancel_at_period_end;
              return (
                <li key={sub.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{product?.title ?? "Membership"}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {sub.cancel_at_period_end ? <Badge variant="muted">Ends at period end</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product ? `${formatMoney(product.price_cents, product.currency)}${product.interval ? ` / ${product.interval}` : ""}` : null}
                      {periodEnd ? ` · ${sub.cancel_at_period_end ? "Access until" : "Renews"} ${periodEnd}` : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {canCancel ? <CancelSubscriptionButton subscriptionId={sub.id} periodEndLabel={periodEnd} /> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <p className="text-xs text-muted-foreground">
        Questions about a charge?{" "}
        <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-rose-strong underline-offset-4 hover:underline">
          Contact us <ExternalLink className="size-3" aria-hidden="true" />
        </Link>{" "}
        and we’ll sort it out together.
      </p>
    </>
  );
}
