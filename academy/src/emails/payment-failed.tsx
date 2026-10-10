import { BrandLayout, Cta, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface PaymentFailedProps {
  name?: string | null;
  /** Link to /account/billing */
  billingUrl: string;
  productTitle?: string | null;
}

export function subject(): string {
  return "A small hiccup with your payment";
}

export const example: PaymentFailedProps = { name: "Jordan Lee", billingUrl: `${site.url}/account/billing`, productTitle: "All-Access · monthly" };

export default function PaymentFailed({ name, billingUrl, productTitle }: PaymentFailedProps) {
  return (
    <BrandLayout preview="Your latest payment didn’t go through. Easy to fix." heading="A small hiccup with your payment" eyebrow="Billing">
      <P>{greeting(name)}</P>
      <P>
        The most recent payment for {productTitle ? <strong>{productTitle}</strong> : "your membership"} did not go through. This happens
        for all sorts of ordinary reasons, such as an expired card or a bank check.
      </P>
      <P>Your access stays open for now. Updating your payment method takes a minute.</P>
      <Cta href={billingUrl} fallback={false}>
        Update payment method
      </Cta>
      <Muted>We will try the payment again automatically. If you would rather pause or cancel, you can do that on the same page.</Muted>
    </BrandLayout>
  );
}
