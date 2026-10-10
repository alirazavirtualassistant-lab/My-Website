import { NextResponse, type NextRequest } from "next/server";
import { getServices } from "@/services";
import { handlePaymentEvent } from "@/lib/usecases/fulfilment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook. The raw body is required for signature verification.
 * Events: checkout.session.completed, invoice.paid, invoice.payment_failed,
 * customer.subscription.updated/deleted, charge.refunded.
 */
export async function POST(req: NextRequest) {
  const { payments } = await getServices();
  if (payments.kind !== "stripe") return NextResponse.json({ error: "Stripe payments are not enabled" }, { status: 400 });
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  let event;
  try {
    event = await payments.parseWebhook({ rawBody, signature });
  } catch (err) {
    console.warn("[stripe webhook] bad signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  try {
    const result = await handlePaymentEvent(event);
    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    console.error("[stripe webhook] handler failed", err);
    // 500 makes Stripe retry; the handler is idempotent.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
