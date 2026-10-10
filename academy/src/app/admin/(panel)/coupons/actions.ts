"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getServices } from "@/services";
import type { Coupon } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import { logAudit } from "@/lib/usecases/users";
import { normalizeCouponCode } from "@/lib/usecases/admin-people";
import { done, failed, invalid, type AdminFormState } from "@/components/admin/students/form-state";

const on = (v: FormDataEntryValue | null) => v === "on" || v === "true" || v === "1";

const schema = z.object({
  id: z.string().trim().max(120).optional(),
  code: z.string().min(3, "Codes need at least 3 letters or numbers.").max(40),
  kind: z.enum(["percent", "fixed"], { message: "Choose % off or a fixed amount." }),
  amount: z.number({ message: "Please enter the discount amount." }).int().min(1, "The discount has to be more than zero."),
  expires_at: z.string().nullable(),
  max_uses: z.number().int().min(1, "Max uses must be at least 1.").max(1_000_000).nullable(),
  product_ids: z.array(z.string().min(1)).default([]),
  active: z.boolean(),
});

function refreshCoupons() {
  revalidatePath("/admin/coupons");
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function saveCouponAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const kind = formData.get("kind") === "fixed" ? "fixed" : formData.get("kind") === "percent" ? "percent" : "";
  const amountRaw = String(formData.get("amount") ?? "").trim().replace(/[$,%\s]/g, "");
  const amountNumber = amountRaw === "" ? Number.NaN : Number(amountRaw);
  const expiresRaw = String(formData.get("expires_at") ?? "").trim();
  if (expiresRaw && !/^\d{4}-\d{2}-\d{2}$/.test(expiresRaw)) return invalid({ expires_at: "Please enter the expiry as YYYY-MM-DD." });
  const maxUsesRaw = String(formData.get("max_uses") ?? "").trim();
  const raw = {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    code: normalizeCouponCode(String(formData.get("code") ?? "")),
    kind,
    amount: Number.isFinite(amountNumber) ? (kind === "fixed" ? Math.round(amountNumber * 100) : Math.round(amountNumber)) : Number.NaN,
    expires_at: expiresRaw ? `${expiresRaw}T23:59:59.000Z` : null,
    max_uses: maxUsesRaw ? Number(maxUsesRaw) : null,
    product_ids: formData.getAll("product_ids").map(String),
    active: on(formData.get("active")),
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!(key in errors)) errors[key] = issue.message;
    }
    return invalid(errors);
  }
  const data = parsed.data;
  if (data.kind === "percent" && data.amount > 100) return invalid({ amount: "A percentage discount can’t be more than 100%." });

  const { db, payments } = await getServices();
  const existing = data.id ? await db.from("coupons").get(data.id) : null;
  if (data.id && !existing) return failed("That coupon no longer exists.");
  const clash = await db.from("coupons").findOne({ code: data.code });
  if (clash && clash.id !== existing?.id) return invalid({ code: `“${data.code}” is already in use. Pick another code.` });
  if (data.product_ids.length) {
    const products = await db.from("products").list({ where: { id: data.product_ids } });
    if (products.length !== data.product_ids.length) return invalid({ product_ids: "One of the selected products no longer exists." });
  }

  const row: Coupon = {
    id: existing?.id ?? newId(),
    code: data.code,
    kind: data.kind,
    amount: data.amount,
    expires_at: data.expires_at,
    max_uses: data.max_uses,
    uses: existing?.uses ?? 0,
    product_ids: data.product_ids,
    stripe_coupon_id: existing?.stripe_coupon_id ?? null,
    stripe_promotion_code_id: existing?.stripe_promotion_code_id ?? null,
    active: data.active,
    created_at: existing?.created_at ?? nowIso(),
  };
  try {
    const synced = await payments.syncCoupon({ code: row.code, kind: row.kind, amount: row.amount, expires_at: row.expires_at, max_uses: row.max_uses });
    row.stripe_coupon_id = synced.stripe_coupon_id;
    row.stripe_promotion_code_id = synced.stripe_promotion_code_id;
  } catch (err) {
    console.error("[coupons] provider sync failed", err);
    return failed(`Saved nothing: the payment provider rejected this coupon (${err instanceof Error ? err.message : "unknown error"}).`);
  }
  if (existing) await db.from("coupons").update(row.id, row);
  else await db.from("coupons").insert(row);
  await logAudit(actor.user_id, existing ? "coupon.updated" : "coupon.created", "coupon", row.id, { code: row.code, kind: row.kind, amount: row.amount, active: row.active });
  refreshCoupons();
  redirect(`/admin/coupons?saved=${encodeURIComponent(row.code)}`);
}

export async function setCouponActiveAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const parsed = z.object({ id: z.string().trim().min(1).max(120), active: z.string() }).safeParse({ id: formData.get("id"), active: formData.get("active") ?? "" });
  if (!parsed.success) return failed("We couldn't find that coupon.");
  const { db } = await getServices();
  const coupon = await db.from("coupons").get(parsed.data.id);
  if (!coupon) return failed("That coupon no longer exists.");
  const active = on(parsed.data.active);
  await db.from("coupons").update(coupon.id, { active });
  await logAudit(actor.user_id, active ? "coupon.activated" : "coupon.deactivated", "coupon", coupon.id, { code: coupon.code });
  refreshCoupons();
  return done(active ? `${coupon.code} is live again.` : `${coupon.code} deactivated. It can’t be redeemed any more.`);
}
