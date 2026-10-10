import { BrandLayout, Cta, Muted, P, Quote, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface GiftReceivedProps {
  recipientName: string;
  buyerName: string;
  message: string;
  productTitle: string;
  /** Link to /gift/<token> */
  redeemUrl: string;
}

export function subject(props: GiftReceivedProps): string {
  return `${props.buyerName} sent you a gift: ${props.productTitle}`;
}

export const example: GiftReceivedProps = {
  recipientName: "Sam Rivera",
  buyerName: "Jordan Lee",
  message: "Thinking of you both. No pressure, just something gentle for the road ahead.",
  productTitle: "Baby Steps: Your Health Journey Toward Conception",
  redeemUrl: `${site.url}/gift/example-token`,
};

export default function GiftReceived({ recipientName, buyerName, message, productTitle, redeemUrl }: GiftReceivedProps) {
  return (
    <BrandLayout preview={`A gift from ${buyerName} is waiting for you.`} heading="Someone is thinking of you" eyebrow="A gift for you">
      <P>{greeting(recipientName)}</P>
      <P>
        {buyerName} has gifted you <strong>{productTitle}</strong> at {site.name}.
      </P>
      {message.trim() ? <Quote>“{message.trim()}”</Quote> : null}
      <P>Open your gift whenever the time feels right. It will be waiting.</P>
      <Cta href={redeemUrl}>Open my gift</Cta>
      <Muted>You will be asked to create a free account (or sign in) so the course can be added to your dashboard.</Muted>
    </BrandLayout>
  );
}
