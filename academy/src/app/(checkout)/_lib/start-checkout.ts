import "server-only";
import { createCheckout, quoteCheckout, type CreateCheckoutArgs } from "@/lib/usecases/fulfilment";
import { normalizeCheckoutLines } from "@/components/checkout/schemas";
import type { CartItem } from "@/lib/types";

export class CheckoutInputError extends Error {
  readonly code: "empty_cart" | "coupon" | "email";
  constructor(code: "empty_cart" | "coupon" | "email", message: string) {
    super(message);
    this.name = "CheckoutInputError";
    this.code = code;
  }
}

export interface StartCheckoutArgs extends Omit<CreateCheckoutArgs, "lines"> {
  cart: ReadonlyArray<CartItem>;
}

/**
 * Guard in front of `createCheckout`:
 *   - refuses an empty cart (the use case would otherwise create a $0 order
 *     and fulfil it immediately — see the shared-change request in the report)
 *   - normalises quantities to one unit per product
 *   - refuses to proceed with a coupon that cannot be applied, so the learner
 *     is never silently charged full price while a code sits in the cookie
 */
export async function startCheckout(args: StartCheckoutArgs): Promise<{ url: string; orderId: string }> {
  const lines = normalizeCheckoutLines(args.cart);
  if (lines.length === 0) throw new CheckoutInputError("empty_cart", "Your cart is empty.");
  if (!args.userId && !args.email) throw new CheckoutInputError("email", "Please enter an email address so we can send your access.");
  if (args.couponCode) {
    const quote = await quoteCheckout(lines, args.couponCode);
    if (quote.couponError) throw new CheckoutInputError("coupon", quote.couponError);
  }
  return createCheckout({ ...args, lines });
}
