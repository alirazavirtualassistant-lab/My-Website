"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServices } from "@/services";
import { getSession } from "@/lib/auth/session";
import { clearCart } from "@/lib/usecases/cart";
import { updateProfile } from "@/lib/usecases/users";
import { canViewOrder, publicOrderStatus } from "@/components/checkout/ownership";
import { readGuestCheckout } from "../../_lib/guest-cookie";

const schema = z.object({ orderId: z.string().min(1).max(80) });

/**
 * Called once by the confirmation page after the order is confirmed paid:
 * clears the cart + coupon cookies (cookie writes are only allowed in actions)
 * and, for guest checkouts, applies the name typed at checkout to the account
 * the fulfilment use case created (never to a pre-existing account).
 */
export async function finalizeOrderAction(input: { orderId: string }): Promise<{ ok: boolean }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const [{ db }, session, guest] = await Promise.all([getServices(), getSession(), readGuestCheckout()]);
  const order = await db.from("orders").get(parsed.data.orderId);
  const viewer = { userId: session?.user_id ?? null, email: session?.email ?? null, role: session?.role ?? null, guestEmail: guest?.email ?? null };
  if (!order || !canViewOrder(order, viewer) || publicOrderStatus(order.status) !== "paid") return { ok: false };

  await clearCart();

  if (!session && guest?.name && order.user_id) {
    const profile = await db.from("profiles").get(order.user_id);
    const createdByThisOrder = !!profile && !profile.deleted_at && profile.email.toLowerCase() === order.email.toLowerCase() && profile.created_at >= order.created_at;
    if (createdByThisOrder && profile.name !== guest.name) {
      try {
        await updateProfile(profile.id, { name: guest.name });
      } catch (err) {
        console.warn("[checkout] guest name update failed", err);
      }
    }
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
