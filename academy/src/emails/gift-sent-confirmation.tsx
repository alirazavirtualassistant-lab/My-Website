import { BrandLayout, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface GiftSentConfirmationProps {
  name?: string | null;
  recipientEmail: string;
  orderId: string;
  productTitle?: string | null;
}

export function subject(): string {
  return "Your gift is on its way";
}

export const example: GiftSentConfirmationProps = {
  name: "Jordan Lee",
  recipientEmail: "sam@example.com",
  orderId: "7f3c2a1e-0000-4000-8000-000000000000",
  productTitle: "Baby Steps: Your Health Journey Toward Conception",
};

export default function GiftSentConfirmation({ name, recipientEmail, orderId, productTitle }: GiftSentConfirmationProps) {
  return (
    <BrandLayout preview="We’ve sent your gift along with your note." heading="Your gift is on its way" eyebrow="Gift sent">
      <P>{greeting(name)}</P>
      <P>
        We have emailed {productTitle ? <strong>{productTitle}</strong> : "your gift"} to <strong>{recipientEmail}</strong>, along with
        your note. They can open it whenever they are ready; there is no deadline.
      </P>
      <P>Thank you for giving something so thoughtful.</P>
      <Muted>Order reference: {orderId}</Muted>
      <Muted>If the email address was wrong, reply to this message or write to {site.supportEmail} and we will fix it.</Muted>
    </BrandLayout>
  );
}
