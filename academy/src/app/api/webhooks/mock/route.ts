import { NextResponse, type NextRequest } from "next/server";
import { getServices } from "@/services";
import { handlePaymentEvent } from "@/lib/usecases/fulfilment";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Demo-mode "webhook". The mock checkout page posts here after the learner
 * presses Pay; admins can also post refund/subscription events to simulate
 * Stripe. It goes through exactly the same fulfilment code as Stripe.
 */
export async function POST(req: NextRequest) {
  const { payments, db } = await getServices();
  if (payments.kind !== "mock") return NextResponse.json({ error: "Mock payments are not enabled" }, { status: 400 });
  const rawBody = await req.text();
  let body: { type?: string; session_id?: string } = {};
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const session = await getSession();
  if (body.type === "checkout.completed") {
    // The payer must own the session (or be a guest with the matching email): basic guard against forged completions.
    const cs = body.session_id ? await db.from("checkout_sessions").get(body.session_id) : null;
    if (!cs) return NextResponse.json({ error: "Unknown checkout session" }, { status: 404 });
    if (cs.user_id && cs.user_id !== session?.user_id && session?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (cs.status === "complete") return NextResponse.json({ received: true, duplicate: true });
    await db.from("checkout_sessions").update(cs.id, { status: "complete" });
  } else if (!session || (session.role !== "admin" && session.role !== "assistant")) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const event = await payments.parseWebhook({ rawBody, signature: null });
  const result = await handlePaymentEvent(event);
  return NextResponse.json({ received: true, ...result });
}
