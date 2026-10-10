/**
 * Who may look at an order's confirmation / status. Pure, so the success page,
 * the status route handler and the unit tests all agree.
 *
 *   - staff (admin / assistant) can see any order
 *   - the signed-in buyer (order.user_id) can see their order
 *   - a signed-in user whose email matches the order email (guest who later signed in)
 *   - a guest holding the checkout cookie for the same email
 */
import type { Order, Role } from "@/lib/types";

export interface OrderViewer {
  userId: string | null;
  email: string | null;
  role: Role | null;
  /** Email stored in the httpOnly checkout cookie at guest checkout, if any. */
  guestEmail: string | null;
}

function same(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function canViewOrder(order: Pick<Order, "user_id" | "email">, viewer: OrderViewer): boolean {
  if (viewer.role === "admin" || viewer.role === "assistant") return true;
  if (order.user_id && viewer.userId && order.user_id === viewer.userId) return true;
  if (same(order.email, viewer.email)) return true;
  if (same(order.email, viewer.guestEmail)) return true;
  return false;
}

export type OrderPublicStatus = "pending" | "paid" | "refunded" | "failed";

/** Collapses the order status to what the confirmation page cares about. */
export function publicOrderStatus(status: Order["status"]): OrderPublicStatus {
  switch (status) {
    case "paid":
    case "partially_refunded":
      return "paid";
    case "refunded":
      return "refunded";
    case "failed":
      return "failed";
    default:
      return "pending";
  }
}
