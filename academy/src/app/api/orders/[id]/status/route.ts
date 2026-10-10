import { NextResponse, type NextRequest } from "next/server";
import { getServices } from "@/services";
import { getSession } from "@/lib/auth/session";
import { readGuestCheckout } from "@/app/(checkout)/_lib/guest-cookie";
import { canViewOrder, publicOrderStatus } from "@/components/checkout/ownership";
import type { OrderStatusResponse } from "@/components/checkout/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Polled by the confirmation page while the payment webhook lands. Only the
 * buyer (signed in, or the guest holding the checkout cookie) and staff can
 * read it; everyone else gets a 404 so order ids leak nothing.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || id.length > 80) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [{ db }, session, guest] = await Promise.all([getServices(), getSession(), readGuestCheckout()]);
  const order = await db.from("orders").get(id);
  if (!order || !canViewOrder(order, { userId: session?.user_id ?? null, email: session?.email ?? null, role: session?.role ?? null, guestEmail: guest?.email ?? null })) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const status = publicOrderStatus(order.status);
  const body: OrderStatusResponse = { id: order.id, status, paid: status === "paid" };
  return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
}
