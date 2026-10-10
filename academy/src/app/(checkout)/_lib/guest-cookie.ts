import "server-only";
import { cookies } from "next/headers";
import { normalizeEmail, isValidEmail } from "@/lib/utils";

/**
 * Guest checkout identity. Set (httpOnly) by the checkout action when nobody is
 * signed in, so the success page and the order-status route can confirm the
 * order belongs to this browser. Lives for a day; cleared once the order is
 * confirmed.
 */
const GUEST_COOKIE = "cyc_guest_checkout";

export interface GuestCheckout {
  email: string;
  name: string;
}

export async function readGuestCheckout(): Promise<GuestCheckout | null> {
  const jar = await cookies();
  const raw = jar.get(GUEST_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<GuestCheckout>;
    const email = typeof parsed.email === "string" ? normalizeEmail(parsed.email) : "";
    if (!isValidEmail(email)) return null;
    return { email, name: typeof parsed.name === "string" ? parsed.name.slice(0, 80) : "" };
  } catch {
    return null;
  }
}

/** Server Actions / Route Handlers only (cookie writes are not allowed during render). */
export async function writeGuestCheckout(value: GuestCheckout): Promise<void> {
  const jar = await cookies();
  jar.set(GUEST_COOKIE, JSON.stringify({ email: normalizeEmail(value.email), name: value.name.slice(0, 80) }), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearGuestCheckout(): Promise<void> {
  const jar = await cookies();
  jar.delete(GUEST_COOKIE);
}

export const guestCookieName = GUEST_COOKIE;
