"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { readCart, readCoupon } from "@/lib/usecases/cart";
import { formDataToObject, parseCheckoutForm } from "@/components/checkout/schemas";
import type { CheckoutFormState } from "@/components/checkout/types";
import { CheckoutInputError, startCheckout } from "../_lib/start-checkout";
import { writeGuestCheckout } from "../_lib/guest-cookie";

/**
 * "Pay securely": validates the form for the current mode (guest / signed in,
 * gift / self), creates the pending order + provider session through the
 * fulfilment use case and redirects to the provider (Stripe) or the mock
 * checkout page. Nothing is enrolled here — the webhook does that.
 */
export async function createCheckoutAction(_prev: CheckoutFormState, formData: FormData): Promise<CheckoutFormState> {
  const session = await getSession();
  const gift = formData.get("gift") === "1";
  const parsed = parseCheckoutForm(formDataToObject(formData), { signedIn: !!session, gift });
  if (!parsed.ok) return { status: "error", errors: parsed.errors, stamp: Date.now() };

  const [cart, couponCode] = await Promise.all([readCart(), readCoupon()]);
  let url: string;
  try {
    const result = await startCheckout({
      cart,
      userId: session?.user_id ?? null,
      email: session ? null : parsed.data.email,
      couponCode,
      gift: parsed.data.gift
        ? { recipient_email: parsed.data.gift.recipient_email, recipient_name: parsed.data.gift.recipient_name, message: parsed.data.gift.message }
        : null,
      successPath: "/checkout/success",
      cancelPath: "/cart",
    });
    url = result.url;
  } catch (err) {
    if (err instanceof CheckoutInputError) return { status: "error", code: err.code, errors: { form: err.message }, stamp: Date.now() };
    console.error("[checkout] createCheckout failed", err);
    const message = err instanceof Error && err.message ? err.message : "We couldn't start the payment just now. Nothing was charged — please try again in a moment.";
    return { status: "error", code: "unknown", errors: { form: message }, stamp: Date.now() };
  }
  if (!session && parsed.data.email) await writeGuestCheckout({ email: parsed.data.email, name: parsed.data.name ?? "" });
  revalidatePath("/checkout");
  redirect(url);
}
