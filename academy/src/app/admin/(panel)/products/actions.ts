"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getServices } from "@/services";
import type { Product } from "@/lib/types";
import { newId, nowIso, slugify } from "@/lib/utils";
import { logAudit } from "@/lib/usecases/users";
import { done, failed, invalid, type AdminFormState } from "@/components/admin/students/form-state";

const PRODUCT_TYPES = ["course", "bundle", "subscription", "payment_plan"] as const;

/** "197", "197.00", "$1,970.50" → cents; "" → null; anything else → NaN. */
function parseCents(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim().replace(/[$,\s]/g, "");
  if (raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return Number.NaN;
  return Math.round(n * 100);
}

function parseDateEnd(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "invalid";
  return `${raw}T23:59:59.000Z`;
}

const on = (v: FormDataEntryValue | null) => v === "on" || v === "true" || v === "1";

const schema = z.object({
  id: z.string().trim().max(120).optional(),
  type: z.enum(PRODUCT_TYPES, { message: "Please choose a product type." }),
  title: z.string().trim().min(2, "Please give the product a title.").max(160, "Please keep the title under 160 characters."),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().max(2000, "Please keep the description under 2,000 characters.").default(""),
  course_ids: z.array(z.string().min(1)).default([]),
  grants_all_courses: z.boolean(),
  price_cents: z.number({ message: "Please enter a price like 197 or 197.00." }).int().min(0),
  sale_price_cents: z.number({ message: "Please enter a sale price like 147 or 147.00." }).int().min(0).nullable(),
  sale_ends_at: z.string().nullable(),
  interval: z.enum(["month", "year"]).nullable(),
  installments: z.number().int().min(2, "A payment plan needs at least 2 instalments.").max(24, "Please keep plans to 24 instalments or fewer.").nullable(),
  active: z.boolean(),
  is_free: z.boolean(),
});

function refreshProducts() {
  revalidatePath("/admin/products");
  revalidatePath("/pricing");
  revalidatePath("/courses", "layout");
  revalidatePath("/cart");
}

export async function saveProductAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const type = String(formData.get("type") ?? "");
  const installmentsRaw = String(formData.get("installments") ?? "").trim();
  const saleEnds = parseDateEnd(formData.get("sale_ends_at"));
  if (saleEnds === "invalid") return invalid({ sale_ends_at: "Please enter the sale end date as YYYY-MM-DD." });
  const raw = {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    type,
    title: formData.get("title"),
    slug: String(formData.get("slug") ?? ""),
    description: formData.get("description") ?? "",
    course_ids: formData.getAll("course_ids").map(String),
    grants_all_courses: on(formData.get("grants_all_courses")),
    price_cents: parseCents(formData.get("price")),
    sale_price_cents: parseCents(formData.get("sale_price")),
    sale_ends_at: saleEnds,
    interval: type === "subscription" ? (formData.get("interval") === "year" ? "year" : "month") : type === "payment_plan" ? "month" : null,
    installments: type === "payment_plan" ? (installmentsRaw ? Number(installmentsRaw) : Number.NaN) : null,
    active: on(formData.get("active")),
    is_free: on(formData.get("is_free")),
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      const field = key === "price_cents" ? "price" : key === "sale_price_cents" ? "sale_price" : key;
      if (!(field in errors)) errors[field] = issue.message;
    }
    return invalid(errors);
  }
  const data = parsed.data;
  if (data.type !== "subscription" && !data.grants_all_courses && data.course_ids.length === 0) {
    return invalid({ course_ids: "Pick at least one course this product unlocks." });
  }
  if (data.sale_price_cents !== null && data.sale_price_cents >= data.price_cents && !data.is_free) {
    return invalid({ sale_price: "The sale price should be lower than the regular price." });
  }

  const { db, payments } = await getServices();
  const courses = await db.from("courses").list({ where: { id: data.course_ids } });
  if (courses.length !== data.course_ids.length) return invalid({ course_ids: "One of the selected courses no longer exists." });

  const existing = data.id ? await db.from("products").get(data.id) : null;
  if (data.id && !existing) return failed("That product no longer exists.");
  const baseSlug = slugify(data.slug || data.title) || `product-${newId().slice(0, 6)}`;
  let slug = baseSlug;
  for (let i = 2; ; i++) {
    const clash = await db.from("products").findOne({ slug });
    if (!clash || clash.id === existing?.id) break;
    slug = `${baseSlug}-${i}`;
  }

  const now = nowIso();
  const id = existing?.id ?? newId();
  const row: Product = {
    id,
    type: data.type,
    slug,
    title: data.title,
    description: data.description,
    course_ids: data.type === "subscription" && data.grants_all_courses ? [] : data.course_ids,
    grants_all_courses: data.type === "subscription" ? data.grants_all_courses : data.grants_all_courses && data.type === "bundle",
    price_cents: data.is_free ? 0 : data.price_cents,
    sale_price_cents: data.is_free ? null : data.sale_price_cents,
    sale_ends_at: data.sale_price_cents === null ? null : data.sale_ends_at,
    currency: existing?.currency ?? "USD",
    interval: data.interval,
    installments: data.type === "payment_plan" ? data.installments : null,
    stripe_product_id: existing?.stripe_product_id ?? null,
    stripe_price_id: existing?.stripe_price_id ?? null,
    stripe_sale_price_id: existing?.stripe_sale_price_id ?? null,
    active: data.active,
    is_free: data.is_free,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };

  // Mirror into the payment provider (mock returns fake ids) before persisting so the ids land in the same write.
  try {
    const synced = await payments.syncProduct({
      product_id: row.id,
      title: row.title,
      description: row.description,
      price_cents: row.price_cents,
      sale_price_cents: row.sale_price_cents,
      currency: row.currency,
      interval: row.interval,
      installments: row.installments,
    });
    row.stripe_product_id = synced.stripe_product_id;
    row.stripe_price_id = synced.stripe_price_id;
    row.stripe_sale_price_id = synced.stripe_sale_price_id;
  } catch (err) {
    console.error("[products] provider sync failed", err);
    return failed(`Saved nothing: the payment provider rejected this product (${err instanceof Error ? err.message : "unknown error"}).`);
  }

  if (existing) await db.from("products").update(id, row);
  else await db.from("products").insert(row);
  await logAudit(actor.user_id, existing ? "product.updated" : "product.created", "product", id, { type: row.type, price_cents: row.price_cents, sale_price_cents: row.sale_price_cents, active: row.active });
  refreshProducts();
  redirect(`/admin/products?saved=${encodeURIComponent(row.title)}`);
}

export async function setProductActiveAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const parsed = z.object({ id: z.string().trim().min(1).max(120), active: z.string() }).safeParse({ id: formData.get("id"), active: formData.get("active") ?? "" });
  if (!parsed.success) return failed("We couldn't find that product.");
  const { db } = await getServices();
  const product = await db.from("products").get(parsed.data.id);
  if (!product) return failed("That product no longer exists.");
  const active = on(parsed.data.active);
  await db.from("products").update(product.id, { active, updated_at: nowIso() });
  await logAudit(actor.user_id, active ? "product.restored" : "product.archived", "product", product.id, {});
  refreshProducts();
  return done(active ? `“${product.title}” is back on sale.` : `“${product.title}” archived. Existing access is unaffected.`);
}
