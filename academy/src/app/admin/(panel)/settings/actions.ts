"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getServices } from "@/services";
import { env } from "@/lib/env";
import { nowIso } from "@/lib/utils";
import { ensureSettings, resetDemoData } from "@/lib/usecases/demo";
import { storePublicAsset } from "@/lib/usecases/uploads";
import { logAudit } from "@/lib/usecases/users";
import { done, failed, invalid, type AdminFormState } from "@/components/admin/students/form-state";
import { LEGAL_PAGES } from "@/components/admin/settings/legal-pages";

const on = (v: FormDataEntryValue | null) => v === "on" || v === "true" || v === "1";

function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

function refreshSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

const brandSchema = z.object({
  site_name: z.string().trim().min(2, "Please add a site name.").max(80, "Please keep the site name under 80 characters."),
  support_email: z.string().trim().toLowerCase().max(254).refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Please enter a valid support email."),
  disclaimer_text: z.string().trim().min(20, "The disclaimer needs a full sentence or two.").max(2000, "Please keep the disclaimer under 2,000 characters."),
  abandoned_cart_emails: z.boolean(),
  weekly_nudges: z.boolean(),
  testimonials_enabled: z.boolean(),
});

export async function saveBrandAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const parsed = brandSchema.safeParse({
    site_name: formData.get("site_name") ?? "",
    support_email: formData.get("support_email") ?? "",
    disclaimer_text: formData.get("disclaimer_text") ?? "",
    abandoned_cart_emails: on(formData.get("abandoned_cart_emails")),
    weekly_nudges: on(formData.get("weekly_nudges")),
    testimonials_enabled: on(formData.get("testimonials_enabled")),
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  const { db } = await getServices();
  await ensureSettings(db);
  await db.from("site_settings").update("default", { ...parsed.data, updated_at: nowIso() });
  await logAudit(actor.user_id, "settings.brand_updated", "site_settings", "default", { ...parsed.data, disclaimer_text: undefined });
  refreshSite();
  return done("Site settings saved.");
}

export async function saveLegalAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const patch: Record<string, string> = {};
  const errors: Record<string, string> = {};
  for (const page of LEGAL_PAGES) {
    const value = String(formData.get(page.key) ?? "");
    if (value.length > 200_000) errors[page.key] = `${page.label} is too long (max 200,000 characters).`;
    patch[page.key] = value;
  }
  if (Object.keys(errors).length) return invalid(errors);
  const { db } = await getServices();
  const current = await ensureSettings(db);
  // Keep every other key (e.g. the bootstrap marker) intact.
  await db.from("site_settings").update("default", { legal: { ...current.legal, ...patch }, updated_at: nowIso() });
  await logAudit(actor.user_id, "settings.legal_updated", "site_settings", "default", { pages: LEGAL_PAGES.map((p) => p.key) });
  refreshSite();
  for (const page of LEGAL_PAGES) revalidatePath(page.href);
  return done("Legal pages saved. Remember they still need a legal review before launch.");
}

export async function saveColorsAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const raw = String(formData.get("colors") ?? "").trim();
  let colors: Record<string, string> | null = null;
  if (raw) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return invalid({ colors: "That isn’t valid JSON. Example: { \"rose\": \"#b5656b\" }" });
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return invalid({ colors: "Please use an object of token → colour, like { \"rose\": \"#b5656b\" }." });
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!/^--?[a-z0-9-]{1,40}$/i.test(key)) return invalid({ colors: `“${key}” isn’t a token name. Use letters, digits and dashes, e.g. rose-soft.` });
      if (typeof value !== "string" || value.length > 64) return invalid({ colors: `The value for “${key}” should be a short colour string like #b5656b.` });
      out[key.replace(/^--/, "")] = value.trim();
    }
    colors = Object.keys(out).length ? out : null;
  }
  const { db } = await getServices();
  await ensureSettings(db);
  await db.from("site_settings").update("default", { colors, updated_at: nowIso() });
  await logAudit(actor.user_id, "settings.colors_updated", "site_settings", "default", { tokens: colors ? Object.keys(colors) : [] });
  refreshSite();
  return done(colors ? "Colour overrides stored." : "Colour overrides cleared.");
}

export async function uploadLogoAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) return invalid({ logo: "Please choose an image file (PNG, JPG, WebP or GIF)." });
  let stored: { path: string; url: string };
  try {
    stored = await storePublicAsset("brand", file, "image");
  } catch (err) {
    return invalid({ logo: err instanceof Error ? err.message : "That file could not be uploaded." });
  }
  const { db } = await getServices();
  await ensureSettings(db);
  await db.from("site_settings").update("default", { logo_path: stored.path, updated_at: nowIso() });
  await logAudit(actor.user_id, "settings.logo_updated", "site_settings", "default", { path: stored.path });
  refreshSite();
  return done("Logo uploaded.");
}

export async function removeLogoAction(_prev: AdminFormState, _formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const { db } = await getServices();
  await ensureSettings(db);
  await db.from("site_settings").update("default", { logo_path: null, updated_at: nowIso() });
  await logAudit(actor.user_id, "settings.logo_removed", "site_settings", "default", {});
  refreshSite();
  return done("Logo removed. The built-in mark is used instead.");
}

export async function resetDemoDataAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  if (!env.demo) return failed("Reset is only available in demo mode.");
  if (String(formData.get("confirm") ?? "").trim() !== "RESET") return invalid({ confirm: "Please type RESET exactly." });
  await logAudit(actor.user_id, "demo.reset_requested", "site_settings", "default", {});
  try {
    await resetDemoData();
  } catch (err) {
    return failed(err instanceof Error ? err.message : "The reset did not complete.");
  }
  revalidatePath("/", "layout");
  redirect("/sign-in?next=%2Fadmin&reset=1");
}
