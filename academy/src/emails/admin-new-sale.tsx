import { BrandLayout, ItemsTable, Muted, P, type ReceiptItem } from "./components/brand-layout";
import { site } from "@/lib/config/site";

/** Internal notice to the admin inbox after each paid order. */
export interface AdminNewSaleProps {
  buyerEmail: string;
  items: ReceiptItem[];
  totalCents: number;
  orderId: string;
  gift: boolean;
  currency?: string;
  adminUrl?: string;
}

export function subject(props: AdminNewSaleProps): string {
  const first = props.items[0]?.title ?? "order";
  return `${props.gift ? "New gift order" : "New sale"}: ${first}${props.items.length > 1 ? ` +${props.items.length - 1}` : ""}`;
}

export const example: AdminNewSaleProps = {
  buyerEmail: "jordan@example.com",
  items: [{ title: "Baby Steps: Your Health Journey Toward Conception", unit_cents: 19700, quantity: 1 }],
  totalCents: 19700,
  orderId: "7f3c2a1e-0000-4000-8000-000000000000",
  gift: false,
  currency: "USD",
  adminUrl: `${site.url}/admin/orders`,
};

export default function AdminNewSale({ buyerEmail, items, totalCents, orderId, gift, currency = "USD", adminUrl = `${site.url}/admin/orders` }: AdminNewSaleProps) {
  return (
    <BrandLayout preview={`${buyerEmail} just purchased.`} heading={gift ? "A new gift order came in" : "A new sale came in"} eyebrow="Admin">
      <P>
        <strong>{buyerEmail}</strong> {gift ? "bought a gift" : "made a purchase"}.
      </P>
      <ItemsTable items={items} currency={currency} totalCents={totalCents} />
      <Muted>Order {orderId}</Muted>
      <Muted>Open it in the admin panel: {adminUrl}</Muted>
    </BrandLayout>
  );
}
