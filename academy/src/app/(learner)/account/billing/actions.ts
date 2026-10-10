"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServices } from "@/services";
import { site } from "@/lib/config/site";
import { nowIso } from "@/lib/utils";
import { logAudit } from "@/lib/usecases/users";
import { formError, type FormState } from "@/components/auth/types";
import { requireProfile } from "../_shared";

export async function openBillingPortalAction(): Promise<FormState> {
  const me = await requireProfile("/account/billing");
  if (!me.profile.stripe_customer_id) return formError("There's no billing profile on this account yet — it appears after your first purchase.");
  const { payments } = await getServices();
  let url: string;
  try {
    const portal = await payments.createCustomerPortalSession({ customer_id: me.profile.stripe_customer_id, return_url: `${site.url}/account/billing` });
    url = portal.url;
  } catch (err) {
    console.warn("[account/billing] portal failed", err);
    return formError("The billing portal isn't available right now. Please try again in a moment.");
  }
  redirect(url);
}

const cancelSchema = z.object({ subscription_id: z.string().min(1).max(120) });

export async function cancelSubscriptionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireProfile("/account/billing");
  const parsed = cancelSchema.safeParse({ subscription_id: formData.get("subscription_id") });
  if (!parsed.success) return formError("We couldn't find that membership.");
  const { db, payments } = await getServices();
  const sub = await db.from("subscriptions").get(parsed.data.subscription_id);
  if (!sub || sub.user_id !== me.session.user_id) return formError("We couldn't find that membership.");
  if (sub.cancel_at_period_end) return { status: "success", message: "This membership is already set to end at the close of the period.", stamp: Date.now() };

  const result = await payments.cancelSubscription({ subscription_id: sub.provider_subscription_id ?? sub.id, at_period_end: true });
  if (!result.ok) return formError(result.error ?? "We couldn't cancel just now. Please try again or contact support.");
  // Mirror the flag locally; the provider webhook (subscription.updated) sets the same value.
  await db.from("subscriptions").update(sub.id, { cancel_at_period_end: true, updated_at: nowIso() });
  await logAudit(me.session.user_id, "subscription.cancel_requested", "subscription", sub.id, { at_period_end: true });
  revalidatePath("/account/billing");
  return { status: "success", message: "Done. Your membership ends at the close of this period.", stamp: Date.now() };
}
