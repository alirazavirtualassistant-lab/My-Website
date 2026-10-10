/**
 * Zod schemas for the checkout forms. Pure (no I/O, no Next imports) so the
 * Server Actions, Client Components and unit tests share one definition.
 */
import { z } from "zod";
import type { CartItem } from "@/lib/types";

export const checkoutEmailSchema = z
  .string({ message: "Please enter an email address." })
  .trim()
  .min(1, "Please enter an email address.")
  .max(254, "That email address is a little long.")
  .toLowerCase()
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Please enter a valid email address.");

export const checkoutNameSchema = z
  .string({ message: "Please tell us your name." })
  .trim()
  .min(1, "Please tell us your name.")
  .max(80, "Please keep the name under 80 characters.");

/** Checkbox values arrive as "on" (or "true"/"1") from FormData; absent means false. */
export const acknowledgementSchema = z.preprocess(
  (v) => v === "on" || v === "true" || v === "1" || v === true,
  z.boolean().refine((v) => v, "Please confirm you have read the medical disclaimer."),
);

export const giftDetailsSchema = z.object({
  recipient_name: z
    .string({ message: "Who is this gift for?" })
    .trim()
    .min(1, "Who is this gift for?")
    .max(80, "Please keep the name under 80 characters."),
  recipient_email: checkoutEmailSchema,
  message: z.string().trim().max(1000, "Please keep the message under 1,000 characters.").default(""),
});

export type GiftDetails = z.infer<typeof giftDetailsSchema>;

/** Signed-in checkout: just the acknowledgement (+ gift details when gifting). */
export const signedInCheckoutSchema = z.object({
  acknowledged: acknowledgementSchema,
});

/** Guest checkout adds the email + name used to create the passwordless account. */
export const guestCheckoutSchema = signedInCheckoutSchema.extend({
  email: checkoutEmailSchema,
  name: checkoutNameSchema,
});

export type CheckoutFieldErrors = Partial<Record<"email" | "name" | "recipient_name" | "recipient_email" | "message" | "acknowledged" | "form", string>>;

export interface ParsedCheckoutInput {
  email: string | null;
  name: string | null;
  acknowledged: true;
  gift: GiftDetails | null;
}

export type CheckoutParseResult = { ok: true; data: ParsedCheckoutInput } | { ok: false; errors: CheckoutFieldErrors };

function collect(issues: z.ZodIssue[], into: CheckoutFieldErrors) {
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form") as keyof CheckoutFieldErrors;
    if (!into[key]) into[key] = issue.message;
  }
}

/**
 * Parses the checkout form for the current mode. `signedIn` drops the guest
 * fields; `gift` requires the recipient block.
 */
export function parseCheckoutForm(raw: Record<string, unknown>, opts: { signedIn: boolean; gift: boolean }): CheckoutParseResult {
  const errors: CheckoutFieldErrors = {};
  const base = opts.signedIn ? signedInCheckoutSchema.safeParse(raw) : guestCheckoutSchema.safeParse(raw);
  if (!base.success) collect(base.error.issues, errors);
  let gift: GiftDetails | null = null;
  if (opts.gift) {
    const g = giftDetailsSchema.safeParse(raw);
    if (g.success) gift = g.data;
    else collect(g.error.issues, errors);
  }
  if (Object.keys(errors).length > 0 || !base.success) return { ok: false, errors };
  const data = base.data as z.infer<typeof guestCheckoutSchema> | z.infer<typeof signedInCheckoutSchema>;
  return {
    ok: true,
    data: {
      email: "email" in data ? data.email : null,
      name: "name" in data ? data.name : null,
      acknowledged: true,
      gift,
    },
  };
}

/**
 * Courses, bundles, memberships and payment plans are all "one per person":
 * the cart cookie may have accumulated a quantity (repeated "Add to cart"),
 * but checkout always charges a single unit per product.
 */
export function normalizeCheckoutLines(items: ReadonlyArray<CartItem>): Array<{ product_id: string; quantity: 1 }> {
  const seen = new Set<string>();
  const out: Array<{ product_id: string; quantity: 1 }> = [];
  for (const item of items) {
    if (typeof item.product_id !== "string" || item.product_id.length === 0 || item.product_id.length > 80) continue;
    if (!(item.quantity > 0)) continue;
    if (seen.has(item.product_id)) continue;
    seen.add(item.product_id);
    out.push({ product_id: item.product_id, quantity: 1 });
  }
  return out;
}

/** Turns FormData into a plain object (first value per key) for the schemas above. */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$")) continue; // React internals
    if (!(key in out)) out[key] = typeof value === "string" ? value : "";
  }
  return out;
}
