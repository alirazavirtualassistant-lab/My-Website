import { BrandLayout, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface SubscriptionCanceledProps {
  name?: string | null;
  productTitle: string;
  /** ISO date access ends, when known. */
  accessUntil?: string | null;
}

export function subject(props: SubscriptionCanceledProps): string {
  return `Your ${props.productTitle} membership has ended`;
}

export const example: SubscriptionCanceledProps = { name: "Jordan Lee", productTitle: "All-Access · monthly", accessUntil: null };

export default function SubscriptionCanceled({ name, productTitle, accessUntil }: SubscriptionCanceledProps) {
  const until = accessUntil ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(accessUntil)) : null;
  return (
    <BrandLayout preview="Your membership has ended. Thank you for learning with us." heading="Your membership has ended" eyebrow="Billing">
      <P>{greeting(name)}</P>
      <P>
        Your <strong>{productTitle}</strong> membership is now canceled and you will not be charged again.
        {until ? ` You keep access through ${until}.` : ""}
      </P>
      <P>Thank you for the time you spent with us. Your progress, notes and certificates stay in your account.</P>
      <Muted>Changed your mind? You can rejoin any time from {site.url}/pricing, and everything will be right where you left it.</Muted>
    </BrandLayout>
  );
}
