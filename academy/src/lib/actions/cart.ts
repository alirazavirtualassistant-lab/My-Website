"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addToCart, removeFromCart, clearCart, writeCoupon, writeDisplayCurrency, readCart } from "@/lib/usecases/cart";
import { getServices } from "@/services";

const id = z.string().min(1).max(80);

/** Adds a product to the cookie cart and stays on the page (revalidates). */
export async function addToCartAction(formData: FormData): Promise<void> {
  const productId = id.parse(formData.get("product_id"));
  const returnTo = String(formData.get("return_to") ?? "/cart");
  const { db } = await getServices();
  const product = await db.from("products").get(productId);
  if (!product || !product.active) throw new Error("Product unavailable");
  await addToCart(productId, 1);
  revalidatePath("/", "layout");
  redirect(returnTo.startsWith("/") ? returnTo : "/cart");
}

/** Buy now: replaces the cart with this product and goes to checkout. */
export async function buyNowAction(formData: FormData): Promise<void> {
  const productId = id.parse(formData.get("product_id"));
  const { db } = await getServices();
  const product = await db.from("products").get(productId);
  if (!product || !product.active) throw new Error("Product unavailable");
  await clearCart();
  await addToCart(productId, 1);
  const coupon = formData.get("coupon");
  if (typeof coupon === "string" && coupon.trim()) await writeCoupon(coupon.trim());
  const gift = formData.get("gift") === "1";
  redirect(gift ? "/checkout?gift=1" : "/checkout");
}

export async function removeFromCartAction(formData: FormData): Promise<void> {
  const productId = id.parse(formData.get("product_id"));
  await removeFromCart(productId);
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function applyCouponAction(formData: FormData): Promise<void> {
  const code = String(formData.get("coupon") ?? "").trim();
  await writeCoupon(code || null);
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function setDisplayCurrencyAction(formData: FormData): Promise<void> {
  const code = String(formData.get("currency") ?? "USD");
  await writeDisplayCurrency(code);
  revalidatePath("/", "layout");
}

export async function cartCount(): Promise<number> {
  return (await readCart()).reduce((n, i) => n + i.quantity, 0);
}
