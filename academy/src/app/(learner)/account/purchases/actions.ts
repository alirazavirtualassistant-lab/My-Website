"use server";

import { createElement } from "react";
import { z } from "zod";
import { getServices } from "@/services";
import { site } from "@/lib/config/site";
import { formatDate, formatMoney } from "@/lib/utils";
import { logAudit } from "@/lib/usecases/users";
import { formError, type FormState } from "@/components/auth/types";
import { requireProfile } from "../_shared";

const schema = z.object({ order_id: z.string().min(1).max(120) });

/**
 * Re-sends the receipt for one of the signed-in user's paid orders.
 *
 * NOTE: `sendTemplate("purchase-receipt", …)` from `@/lib/email/send` is the
 * intended call; that module (owned by the emails work) does not exist in the
 * tree yet, so this renders a minimal receipt through the EmailProvider
 * directly with the same template name + payload. Swap when it lands.
 */
export async function resendReceiptAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireProfile("/account/purchases");
  const parsed = schema.safeParse({ order_id: formData.get("order_id") });
  if (!parsed.success) return formError("We couldn't find that order.");
  const { db, email } = await getServices();
  const order = await db.from("orders").get(parsed.data.order_id);
  if (!order || order.user_id !== me.session.user_id) return formError("We couldn't find that order.");
  if (order.status !== "paid" && order.status !== "partially_refunded" && order.status !== "refunded") {
    return formError("Receipts are available once a payment has gone through.");
  }

  const to = me.profile.email;
  const props = {
    name: me.profile.name,
    orderId: order.id,
    date: formatDate(order.paid_at ?? order.created_at),
    items: order.items.map((i) => ({ title: i.title, quantity: i.quantity, amount: formatMoney(i.unit_cents * i.quantity, order.currency) })),
    subtotal: formatMoney(order.subtotal_cents, order.currency),
    discount: order.discount_cents ? formatMoney(order.discount_cents, order.currency) : null,
    tax: order.tax_cents ? formatMoney(order.tax_cents, order.currency) : null,
    total: formatMoney(order.total_cents, order.currency),
    status: order.status,
    learnUrl: `${site.url}/learn`,
    supportEmail: site.supportEmail,
  };
  const result = await email.send({
    to,
    subject: `Your receipt from ${site.name}`,
    template: "purchase-receipt",
    react: receiptElement(props),
    text: [
      `Receipt from ${site.name}`,
      `Order ${props.orderId} · ${props.date}`,
      ...props.items.map((i) => `${i.title} × ${i.quantity} — ${i.amount}`),
      `Total: ${props.total}`,
      `Questions? ${props.supportEmail}`,
    ].join("\n"),
    payload: { ...props, resent: true },
  });
  if (!result.ok) return formError(result.error ?? "We couldn't send the receipt just now. Please try again.");
  await logAudit(me.session.user_id, "order.receipt_resent", "order", order.id, {});
  return { status: "sent", email: to, stamp: Date.now() };
}

function receiptElement(p: {
  name: string;
  orderId: string;
  date: string;
  items: Array<{ title: string; quantity: number; amount: string }>;
  subtotal: string;
  discount: string | null;
  tax: string | null;
  total: string;
  status: string;
  learnUrl: string;
  supportEmail: string;
}) {
  const muted = { fontSize: "13px", color: "#6f6660" };
  return createElement(
    "div",
    { style: { fontFamily: "sans-serif", lineHeight: 1.6, color: "#2e2a27" } },
    createElement("h1", { style: { fontSize: "20px", color: "#9a4f56" } }, "Your receipt"),
    createElement("p", null, `Hi ${p.name}, here's a copy of your receipt. Thank you for walking this road with us.`),
    createElement("p", { style: muted }, `Order ${p.orderId} · ${p.date}${p.status !== "paid" ? ` · ${p.status.replace("_", " ")}` : ""}`),
    createElement(
      "table",
      { style: { width: "100%", borderCollapse: "collapse", margin: "16px 0" }, cellPadding: 6 },
      createElement(
        "tbody",
        null,
        ...p.items.map((i) =>
          createElement(
            "tr",
            { key: i.title },
            createElement("td", { style: { borderBottom: "1px solid #e8dfd0" } }, `${i.title}${i.quantity > 1 ? ` × ${i.quantity}` : ""}`),
            createElement("td", { style: { borderBottom: "1px solid #e8dfd0", textAlign: "right" } }, i.amount),
          ),
        ),
        createElement("tr", null, createElement("td", { style: muted }, "Subtotal"), createElement("td", { style: { ...muted, textAlign: "right" } }, p.subtotal)),
        p.discount ? createElement("tr", null, createElement("td", { style: muted }, "Discount"), createElement("td", { style: { ...muted, textAlign: "right" } }, `−${p.discount}`)) : null,
        p.tax ? createElement("tr", null, createElement("td", { style: muted }, "Tax"), createElement("td", { style: { ...muted, textAlign: "right" } }, p.tax)) : null,
        createElement("tr", null, createElement("td", { style: { fontWeight: 700 } }, "Total"), createElement("td", { style: { fontWeight: 700, textAlign: "right" } }, p.total)),
      ),
    ),
    createElement("p", null, createElement("a", { href: p.learnUrl, style: { color: "#9a4f56", fontWeight: 600 } }, "Go to My Learning")),
    createElement("p", { style: muted }, `Questions about this order? Write to ${p.supportEmail}.`),
  );
}
