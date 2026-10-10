import { BrandLayout, Cta, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface AbandonedCartProps {
  name?: string | null;
  /** Link to /cart */
  cartUrl: string;
  productTitle?: string | null;
}

export function subject(): string {
  return "Your cart is saved, whenever you’re ready";
}

export const example: AbandonedCartProps = { name: null, cartUrl: `${site.url}/cart`, productTitle: "Baby Steps: Your Health Journey Toward Conception" };

export default function AbandonedCart({ name, cartUrl, productTitle }: AbandonedCartProps) {
  return (
    <BrandLayout preview="No rush. We kept your cart for you." heading="We kept your cart for you" eyebrow="Saved for you">
      <P>{greeting(name)}</P>
      <P>
        You left {productTitle ? <strong>{productTitle}</strong> : "something"} in your cart. There is no rush and no pressure; it is here
        whenever the timing feels right.
      </P>
      <P>If you have a question before deciding, just reply to this email. A real person reads every message.</P>
      <Cta href={cartUrl} fallback={false}>
        Return to my cart
      </Cta>
      <Muted>This is the only reminder we will send. You can also write to {site.supportEmail}.</Muted>
    </BrandLayout>
  );
}
