import * as React from "react";
import Link from "next/link";
import { ArrowRight, Award, Clock, FileText, Gift, Infinity as InfinityIcon, Layers, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import type { Course, Product } from "@/lib/types";
import { site } from "@/lib/config/site";
import { addToCartAction, buyNowAction } from "@/lib/actions/cart";
import { cn, formatHoursMinutes, formatMoney, pluralize } from "@/lib/utils";
import type { CourseStats } from "@/lib/usecases/catalog";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Price, effectiveUnitPrice, paymentPlanLabel } from "./price";
import { SubmitButton } from "./submit-button";

export interface PurchaseCardProps extends Omit<React.ComponentProps<"aside">, "children"> {
  course: Course;
  stats: CourseStats;
  product: Product | null;
  plan: Product | null;
  allAccess: Product[];
  enrolled: boolean;
  resourceSummary: string;
}

function IncludeRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span aria-hidden="true" className="mt-0.5 text-rose-strong [&>svg]:size-4">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}

/**
 * Sticky purchase box: price (sale + countdown), buy now / add to cart / gift
 * forms, coupon field, payment-plan and All-Access notes. Shows "Go to course"
 * for enrolled visitors.
 */
function PurchaseCard({ course, stats, product, plan, allAccess, enrolled, resourceSummary, className, ...props }: PurchaseCardProps) {
  const price = product ? effectiveUnitPrice(product) : null;
  const planLabel = paymentPlanLabel(plan, formatMoney);
  const cheapestAllAccess = allAccess.filter((p) => p.interval === "month")[0] ?? allAccess[0] ?? null;
  const returnTo = `/courses/${course.slug}?added=1`;

  return (
    <aside data-slot="purchase-card" aria-label="Enrol in this course" className={cn("card-soft p-6", className)} {...props}>
      {enrolled ? (
        <>
          <p className="eyebrow">You are enrolled</p>
          <p className="mt-2 text-sm text-muted-foreground">Pick up where you left off, or start from the welcome video.</p>
          <Button asChild size="lg" className="mt-5 w-full">
            <Link href={`/learn/${course.slug}`}>
              Go to course
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </>
      ) : price && product ? (
        <>
          <Price price={price} size="lg" showSaleBadge />
          {price.on_sale && price.sale_ends_at ? <Countdown to={price.sale_ends_at} label="Sale ends in" compact hideSeconds className="mt-3" doneText="Sale ended" /> : null}
          {planLabel ? <p className="mt-2 text-sm text-muted-foreground">or {planLabel}</p> : null}

          <form action={buyNowAction} className="mt-5 space-y-3">
            <input type="hidden" name="product_id" value={product.id} />
            <div className="grid gap-1.5">
              <Label htmlFor="coupon" className="text-xs text-muted-foreground">
                Coupon code <span className="font-normal">(optional)</span>
              </Label>
              <Input id="coupon" name="coupon" autoComplete="off" placeholder="Have a code?" className="h-9 uppercase placeholder:normal-case" maxLength={40} />
            </div>
            <SubmitButton size="lg" className="w-full" pendingText="Taking you to checkout…">
              {price.cents === 0 ? "Enrol for free" : "Buy now"}
            </SubmitButton>
          </form>

          {price.cents > 0 ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <form action={addToCartAction}>
                <input type="hidden" name="product_id" value={product.id} />
                <input type="hidden" name="return_to" value={returnTo} />
                <SubmitButton variant="outline" className="w-full" pendingText="Adding…">
                  <ShoppingBag aria-hidden="true" /> Add to cart
                </SubmitButton>
              </form>
              <form action={buyNowAction}>
                <input type="hidden" name="product_id" value={product.id} />
                <input type="hidden" name="gift" value="1" />
                <SubmitButton variant="outline" className="w-full" pendingText="One moment…">
                  <Gift aria-hidden="true" /> Gift this course
                </SubmitButton>
              </form>
            </div>
          ) : null}

          {planLabel && plan ? (
            <form action={buyNowAction} className="mt-2">
              <input type="hidden" name="product_id" value={plan.id} />
              <SubmitButton variant="ghost" size="sm" className="w-full" pendingText="One moment…">
                Pay in {plan.installments} instalments of {formatMoney(plan.price_cents, plan.currency)}
              </SubmitButton>
            </form>
          ) : null}

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage-strong" aria-hidden="true" />
            <span>{site.refundDays}-day money-back guarantee. Secure checkout.</span>
          </p>
          {cheapestAllAccess ? (
            <p className="mt-3 rounded-lg bg-gold-soft/60 p-3 text-xs text-foreground/90">
              Included in <strong>All-Access</strong> from {formatMoney(cheapestAllAccess.price_cents, cheapestAllAccess.currency)}/{cheapestAllAccess.interval === "year" ? "year" : "month"}.{" "}
              <Link href="/pricing" className="font-semibold text-rose-strong underline underline-offset-2">
                Compare plans
              </Link>
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="eyebrow">Enrolment opens soon</p>
          <p className="mt-2 text-sm text-muted-foreground">This course is not on sale yet. Join the newsletter on the home page and we will let you know.</p>
          <Button asChild variant="outline" className="mt-5 w-full">
            <Link href="/#newsletter">Keep me posted</Link>
          </Button>
        </>
      )}

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">This course includes</p>
        <ul className="mt-3 space-y-2">
          {stats.total_video_sec > 0 ? <IncludeRow icon={<Clock />}>{formatHoursMinutes(stats.total_video_sec)} of on-demand video</IncludeRow> : null}
          {stats.resource_count > 0 ? <IncludeRow icon={<FileText />}>{resourceSummary}</IncludeRow> : null}
          <IncludeRow icon={<Layers />}>
            {pluralize(stats.module_count, "module")}
            {stats.bonus_count > 0 ? ` + ${pluralize(stats.bonus_count, "bonus training")}` : ""}
            {stats.replay_count > 0 ? ` + ${pluralize(stats.replay_count, "coaching replay")}` : ""}
          </IncludeRow>
          {course.certificate_enabled ? <IncludeRow icon={<Award />}>Certificate of completion</IncludeRow> : null}
          <IncludeRow icon={<InfinityIcon />}>{course.lifetime_access ? "Lifetime access, including updates" : `${pluralize(course.access_days ?? 0, "day")} of access`}</IncludeRow>
          {course.partner_seat_enabled ? <IncludeRow icon={<Users />}>One free partner seat</IncludeRow> : null}
        </ul>
      </div>
    </aside>
  );
}

export interface PurchaseBarProps {
  course: Course;
  product: Product | null;
  enrolled: boolean;
}

/** Mobile-only bottom bar with the price and the primary action. */
function PurchaseBar({ course, product, enrolled }: PurchaseBarProps) {
  const price = product ? effectiveUnitPrice(product) : null;
  return (
    <div
      data-slot="purchase-bar"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 shadow-card backdrop-blur lg:hidden print:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {enrolled ? (
          <>
            <span className="text-sm font-semibold">You are enrolled</span>
            <Button asChild>
              <Link href={`/learn/${course.slug}`}>Go to course</Link>
            </Button>
          </>
        ) : price && product ? (
          <>
            <Price price={price} size="md" />
            <form action={buyNowAction}>
              <input type="hidden" name="product_id" value={product.id} />
              <SubmitButton pendingText="One moment…">{price.cents === 0 ? "Enrol for free" : "Buy now"}</SubmitButton>
            </form>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Enrolment opens soon</span>
        )}
      </div>
    </div>
  );
}

export { PurchaseCard, PurchaseBar };
