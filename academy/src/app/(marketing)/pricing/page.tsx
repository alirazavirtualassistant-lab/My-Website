import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Gift, Layers, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { site } from "@/lib/config/site";
import { siteFaq } from "@/content/faq";
import { buyNowAction } from "@/lib/actions/cart";
import { listProducts } from "@/lib/usecases/access";
import { listPublishedCourses } from "@/lib/usecases/catalog";
import { formatMoney, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/layout/page-section";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { AllAccessToggle } from "@/components/marketing/all-access-toggle";
import { FaqList } from "@/components/marketing/faq-list";
import { Price, effectiveUnitPrice, paymentPlanLabel } from "@/components/marketing/price";
import { SubmitButton } from "@/components/marketing/submit-button";
import { allAccessProducts, bundleProducts } from "../_lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Buy a single course with lifetime access, or join All-Access for every current and future course. Clear prices, a money-back guarantee, no surprises.",
  alternates: { canonical: "/pricing" },
  openGraph: { title: `Pricing · ${site.name}`, description: "Single course, All-Access membership or bundles. Clear prices and a money-back guarantee.", url: "/pricing" },
};

const PRICING_FAQ_QUESTIONS = ["How long do I have access?", "What if it is not for me?", "Can I gift the course?", "Do I need my partner to take the course?"];

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <Check className="mt-0.5 size-4 shrink-0 text-sage-strong" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function BuyForm({ product, label, variant = "default" }: { product: Product; label: string; variant?: "default" | "outline" }) {
  return (
    <form action={buyNowAction}>
      <input type="hidden" name="product_id" value={product.id} />
      <SubmitButton size="lg" variant={variant} className="w-full" pendingText="Taking you to checkout…">
        {label}
      </SubmitButton>
    </form>
  );
}

function PlanCard({ eyebrow, title, children, highlight = false, badge }: { eyebrow: string; title: string; children: React.ReactNode; highlight?: boolean; badge?: string }) {
  return (
    <section
      aria-label={title}
      className={highlight ? "relative flex flex-col rounded-lg border-2 border-rose bg-card p-6 shadow-card sm:p-7" : "card-soft relative flex flex-col p-6 sm:p-7"}
    >
      {badge ? (
        <Badge variant={highlight ? "default" : "gold"} className="absolute -top-3 left-6">
          {badge}
        </Badge>
      ) : null}
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl">{title}</h2>
      <div className="mt-4 flex flex-1 flex-col gap-5">{children}</div>
    </section>
  );
}

function SubscriptionBody({ product, courseCount }: { product: Product; courseCount: number }) {
  const price = effectiveUnitPrice(product);
  const per = product.interval === "year" ? "year" : "month";
  return (
    <>
      <div>
        <Price price={price} size="lg" showSaleBadge />
        <span className="ml-1 text-sm text-muted-foreground">/ {per}</span>
      </div>
      <p className="text-sm text-muted-foreground">{product.description}</p>
      <ul className="space-y-2">
        <Feature>
          Every course, now and in future ({pluralize(courseCount, "course")} today)
        </Feature>
        <Feature>Full access while your membership is active</Feature>
        <Feature>Cancel any time from your account</Feature>
        <Feature>Community, resources, certificates and partner seats included</Feature>
      </ul>
      <div className="mt-auto">
        <BuyForm product={product} label={`Join All-Access · ${formatMoney(price.cents, price.currency)}/${per}`} />
      </div>
    </>
  );
}

export default async function PricingPage() {
  const [products, courses] = await Promise.all([listProducts(), listPublishedCourses()]);
  const courseProducts = products.filter((p) => p.active && p.type === "course");
  const plans = products.filter((p) => p.active && p.type === "payment_plan");
  const subs = allAccessProducts(products);
  const monthly = subs.find((p) => p.interval === "month") ?? null;
  const annual = subs.find((p) => p.interval === "year") ?? null;
  const bundles = bundleProducts(products);
  const annualSaving = monthly && annual ? monthly.price_cents * 12 - annual.price_cents : 0;
  const faq = siteFaq.filter((f) => PRICING_FAQ_QUESTIONS.includes(f.q));

  return (
    <>
      <Section spacing="md">
        <Container>
          <PageHeader
            eyebrow="Pricing"
            title="Simple, honest pricing"
            description={`One payment for lifetime access to a course, or one membership for everything. Every purchase comes with a ${site.refundDays}-day money-back guarantee.`}
            align="center"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
            {/* Single course */}
            <PlanCard eyebrow="Single course" title="Own it for life">
              {courseProducts.length === 0 ? (
                <EmptyState size="sm" title="No courses on sale yet" description="Enrolment opens soon." />
              ) : (
                courseProducts.map((product) => {
                  const price = effectiveUnitPrice(product);
                  const course = courses.find((c) => product.course_ids.includes(c.id)) ?? null;
                  const plan = plans.find((p) => p.course_ids.some((id) => product.course_ids.includes(id))) ?? null;
                  const planLabel = paymentPlanLabel(plan, formatMoney);
                  return (
                    <div key={product.id} className="flex flex-col gap-4 border-t border-border pt-4 first:border-t-0 first:pt-0">
                      <div>
                        <p className="font-serif text-xl font-medium">{course?.title ?? product.title}</p>
                        <div className="mt-2 flex flex-wrap items-baseline gap-2">
                          <Price price={price} size="lg" showSaleBadge />
                          {planLabel ? <span className="text-sm text-muted-foreground">or {planLabel}</span> : null}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <ul className="space-y-2">
                        <Feature>{course?.lifetime_access === false && course.access_days ? `${pluralize(course.access_days, "day")} of access` : "Lifetime access, including updates"}</Feature>
                        <Feature>Every resource, bonus and replay</Feature>
                        {course?.partner_seat_enabled !== false ? <Feature>One free partner seat</Feature> : null}
                        {course?.certificate_enabled !== false ? <Feature>Certificate of completion</Feature> : null}
                      </ul>
                      <div className="mt-auto space-y-2">
                        <BuyForm product={product} label={price.cents === 0 ? "Enrol for free" : `Buy now · ${formatMoney(price.cents, price.currency)}`} />
                        {plan ? <BuyForm product={plan} label={`Pay ${plan.installments} × ${formatMoney(plan.price_cents, plan.currency)}`} variant="outline" /> : null}
                        {course ? (
                          <Button asChild variant="link" className="w-full">
                            <Link href={`/courses/${course.slug}`}>
                              See what’s inside
                              <ArrowRight aria-hidden="true" />
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </PlanCard>

            {/* All-Access */}
            <PlanCard eyebrow="All-Access" title="Everything, as it grows" highlight badge="Best value">
              {monthly || annual ? (
                monthly && annual ? (
                  <AllAccessToggle
                    monthly={<SubscriptionBody product={monthly} courseCount={courses.length} />}
                    annual={<SubscriptionBody product={annual} courseCount={courses.length} />}
                    annualNote={annualSaving > 0 ? `Save ${formatMoney(annualSaving, annual.currency)} a year with annual billing` : null}
                  />
                ) : (
                  <SubscriptionBody product={(monthly ?? annual)!} courseCount={courses.length} />
                )
              ) : (
                <EmptyState size="sm" icon={<Sparkles />} title="All-Access is coming" description="A single membership for every course. Not available just yet." />
              )}
            </PlanCard>

            {/* Bundles */}
            <PlanCard eyebrow="Bundles" title="Courses that go together">
              {bundles.length === 0 ? (
                <EmptyState
                  size="sm"
                  icon={<Layers />}
                  title="No bundles yet"
                  description="As more courses arrive, we will pair the ones that belong together at a lower price."
                  action={
                    <Button asChild variant="outline" size="sm">
                      <Link href="/courses">Browse courses</Link>
                    </Button>
                  }
                />
              ) : (
                bundles.map((b) => {
                  const price = effectiveUnitPrice(b);
                  return (
                    <div key={b.id} className="flex flex-col gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0">
                      <p className="font-serif text-xl font-medium">{b.title}</p>
                      <Price price={price} size="lg" showSaleBadge />
                      <p className="text-sm text-muted-foreground">{b.description}</p>
                      <Feature>{pluralize(b.course_ids.length, "course")} with lifetime access</Feature>
                      <BuyForm product={b} label={`Buy bundle · ${formatMoney(price.cents, price.currency)}`} />
                    </div>
                  );
                })
              )}
            </PlanCard>
          </div>

          <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-lg border border-border bg-cream-2/60 p-4 text-sm text-muted-foreground">
            <Gift className="mt-0.5 size-4 shrink-0 text-rose-strong" aria-hidden="true" />
            <p>
              Want to gift a course? Choose “Gift this course” on any course page; you pay and the recipient gets an email to redeem it on their own
              account. Prices are in {site.currency}.
            </p>
          </div>
        </Container>
      </Section>

      <PageSection eyebrow="Questions" title="Before you buy" tone="cream2" containerSize="md">
        <FaqList items={faq} openFirst idPrefix="pricing-faq" />
        <p className="mt-4 text-sm text-muted-foreground">
          More questions?{" "}
          <Link href="/faq" className="font-semibold text-rose-strong underline underline-offset-4">
            Read the full FAQ
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-rose-strong underline underline-offset-4">
            get in touch
          </Link>
          .
        </p>
      </PageSection>

      <Section spacing="sm">
        <Container size="md">
          <MedicalDisclaimer />
        </Container>
      </Section>
    </>
  );
}
