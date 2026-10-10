import "server-only";
import { cookies } from "next/headers";
import type { CartItem } from "@/lib/types";

const CART_COOKIE = "cyc_cart";
const COUPON_COOKIE = "cyc_coupon";
const CURRENCY_COOKIE = "cyc_currency";

/** Cart lives in a cookie so guests can build a cart before signing in. */
export async function readCart(): Promise<CartItem[]> {
  const jar = await cookies();
  const raw = jar.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed.filter((i) => typeof i.product_id === "string" && i.quantity > 0).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export async function writeCart(items: CartItem[]): Promise<void> {
  const jar = await cookies();
  if (items.length === 0) {
    jar.delete(CART_COOKIE);
    return;
  }
  jar.set(CART_COOKIE, JSON.stringify(items), { path: "/", httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
}

export async function addToCart(productId: string, quantity = 1): Promise<CartItem[]> {
  const items = await readCart();
  const existing = items.find((i) => i.product_id === productId);
  if (existing) existing.quantity = Math.min(existing.quantity + quantity, 5);
  else items.push({ product_id: productId, quantity });
  await writeCart(items);
  return items;
}

export async function removeFromCart(productId: string): Promise<CartItem[]> {
  const items = (await readCart()).filter((i) => i.product_id !== productId);
  await writeCart(items);
  return items;
}

export async function clearCart(): Promise<void> {
  await writeCart([]);
  const jar = await cookies();
  jar.delete(COUPON_COOKIE);
}

export async function readCoupon(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COUPON_COOKIE)?.value?.toUpperCase() ?? null;
}

export async function writeCoupon(code: string | null): Promise<void> {
  const jar = await cookies();
  if (!code) jar.delete(COUPON_COOKIE);
  else jar.set(COUPON_COOKIE, code.toUpperCase().slice(0, 40), { path: "/", httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
}

export async function readDisplayCurrency(): Promise<string> {
  const jar = await cookies();
  return jar.get(CURRENCY_COOKIE)?.value ?? "USD";
}

export async function writeDisplayCurrency(code: string): Promise<void> {
  const jar = await cookies();
  jar.set(CURRENCY_COOKIE, code.toUpperCase().slice(0, 3), { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
}

export const cartCookieNames = { CART_COOKIE, COUPON_COOKIE, CURRENCY_COOKIE };
