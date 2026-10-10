import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, Gift } from "lucide-react";
import { getServices } from "@/services";
import { site } from "@/lib/config/site";
import { formatDate, formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/account/section-card";
import { ResendReceiptButton } from "@/components/account/resend-receipt-button";
import { requireProfile } from "../_shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Purchases", robots: { index: false } };

const STATUS: Record<string, { label: string; variant: "success" | "gold" | "muted" | "rose" }> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "gold" },
  failed: { label: "Failed", variant: "rose" },
  refunded: { label: "Refunded", variant: "muted" },
  partially_refunded: { label: "Partly refunded", variant: "muted" },
};

export default async function AccountPurchasesPage() {
  const { session } = await requireProfile("/account/purchases");
  const { db } = await getServices();
  const orders = (await db.from("orders").list({ where: { user_id: session.user_id }, orderBy: ["created_at", "desc"] })).filter((o) => o.status !== "pending" || o.items.length > 0);

  return (
    <>
      <SectionCard title="Purchases" description="Every order on this account, newest first.">
        {orders.length === 0 ? (
          <EmptyState
            icon={<Receipt />}
            title="No purchases yet"
            description="When you enrol in a course, your receipts will live here."
            action={
              <Button asChild>
                <Link href="/courses">Browse courses</Link>
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4">
            {orders.map((order) => {
              const status = STATUS[order.status] ?? { label: order.status, variant: "muted" as const };
              const canResend = order.status === "paid" || order.status === "partially_refunded" || order.status === "refunded";
              return (
                <li key={order.id} className="rounded-lg border border-border bg-card/60 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{formatDate(order.paid_at ?? order.created_at)}</p>
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {order.gift ? (
                          <Badge variant="gold">
                            <Gift aria-hidden="true" /> Gift for {order.gift.recipient_name}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">Order {order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    {canResend ? <ResendReceiptButton orderId={order.id} /> : null}
                  </div>
                  <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
                    {order.items.map((item, i) => (
                      <li key={`${item.product_id}-${i}`} className="flex items-baseline justify-between gap-4 py-2">
                        <span className="min-w-0">
                          {item.title}
                          {item.quantity > 1 ? <span className="text-muted-foreground"> × {item.quantity}</span> : null}
                        </span>
                        <span className="shrink-0 tabular-nums">{formatMoney(item.unit_cents * item.quantity, order.currency)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-3 grid gap-1 text-sm sm:ml-auto sm:max-w-xs">
                    {order.discount_cents > 0 ? (
                      <div className="flex justify-between text-muted-foreground">
                        <dt>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</dt>
                        <dd className="tabular-nums">−{formatMoney(order.discount_cents, order.currency)}</dd>
                      </div>
                    ) : null}
                    {order.tax_cents > 0 ? (
                      <div className="flex justify-between text-muted-foreground">
                        <dt>Tax</dt>
                        <dd className="tabular-nums">{formatMoney(order.tax_cents, order.currency)}</dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between font-semibold">
                      <dt>Total</dt>
                      <dd className="tabular-nums">{formatMoney(order.total_cents, order.currency)}</dd>
                    </div>
                    {order.refunded_cents > 0 ? (
                      <div className="flex justify-between text-muted-foreground">
                        <dt>Refunded</dt>
                        <dd className="tabular-nums">{formatMoney(order.refunded_cents, order.currency)}</dd>
                      </div>
                    ) : null}
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>
      <p className="text-xs text-muted-foreground">
        Changed your mind? You can ask for a refund within {site.refundDays} days of purchase — see the{" "}
        <Link href="/refund-policy" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
          refund policy
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
          get in touch
        </Link>
        .
      </p>
    </>
  );
}
