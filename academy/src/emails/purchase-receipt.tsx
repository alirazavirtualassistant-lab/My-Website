import { BrandLayout, Cta, ItemsTable, Muted, P, greeting, type ReceiptItem } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface PurchaseReceiptProps {
  name?: string | null;
  orderId: string;
  items: ReceiptItem[];
  totalCents: number;
  discountCents?: number;
  taxCents?: number;
  currency?: string;
  /** Where to start learning (usually /learn). */
  learnUrl: string;
}

export function subject(props: PurchaseReceiptProps): string {
  const first = props.items[0]?.title ?? "your course";
  return props.items.length > 1 ? `Your receipt from ${site.name}` : `Your receipt for ${first}`;
}

export const example: PurchaseReceiptProps = {
  name: "Jordan Lee",
  orderId: "7f3c2a1e-0000-4000-8000-000000000000",
  items: [{ title: "Baby Steps: Your Health Journey Toward Conception", unit_cents: 19700, quantity: 1 }],
  totalCents: 17700,
  discountCents: 2000,
  taxCents: 0,
  currency: "USD",
  learnUrl: `${site.url}/learn`,
};

export default function PurchaseReceipt({ name, orderId, items, totalCents, discountCents = 0, taxCents = 0, currency = "USD", learnUrl }: PurchaseReceiptProps) {
  return (
    <BrandLayout preview="Thank you. Your course is ready whenever you are." heading="Thank you for your order" eyebrow="Receipt">
      <P>{greeting(name)}</P>
      <P>Your payment went through and your course is open. Here is a summary for your records.</P>
      <ItemsTable items={items} currency={currency} discountCents={discountCents} taxCents={taxCents} totalCents={totalCents} />
      <Cta href={learnUrl} fallback={false}>
        Start learning
      </Cta>
      <Muted>Order reference: {orderId}</Muted>
      <Muted>
        Changed your mind? You have {site.refundDays} days to ask for a refund. Just reply to this email or write to {site.supportEmail}.
      </Muted>
    </BrandLayout>
  );
}
