import { BrandLayout, Muted, P, formatCents, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface SubscriptionRenewedProps {
  name?: string | null;
  productTitle: string;
  amountCents: number;
  /** ISO date of the end of the new period, or null. */
  periodEnd: string | null;
  currency?: string;
  billingUrl?: string;
}

export function subject(props: SubscriptionRenewedProps): string {
  return `Your ${props.productTitle} membership renewed`;
}

export const example: SubscriptionRenewedProps = {
  name: "Jordan Lee",
  productTitle: "All-Access · monthly",
  amountCents: 2900,
  periodEnd: new Date(Date.now() + 30 * 86_400_000).toISOString(),
  currency: "USD",
  billingUrl: `${site.url}/account/billing`,
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(d);
}

export default function SubscriptionRenewed({ name, productTitle, amountCents, periodEnd, currency = "USD", billingUrl = `${site.url}/account/billing` }: SubscriptionRenewedProps) {
  const until = formatDate(periodEnd);
  return (
    <BrandLayout preview="Thanks for staying with us. Here are the details." heading="Your membership renewed" eyebrow="Billing">
      <P>{greeting(name)}</P>
      <P>
        Your <strong>{productTitle}</strong> membership has renewed and {formatCents(amountCents, currency)} was charged to your payment
        method on file.{until ? ` Your access continues through ${until}.` : ""}
      </P>
      <P>Thank you for continuing to learn with us.</P>
      <Muted>
        Manage or cancel your membership any time at {billingUrl}. Questions about a charge? Write to {site.supportEmail}.
      </Muted>
    </BrandLayout>
  );
}
