"use server";

import { z } from "zod";
import { getServices } from "@/services";
import { newId, normalizeEmail, nowIso } from "@/lib/utils";
import type { NewsletterState } from "@/components/marketing/newsletter-form";

const schema = z.object({
  email: z.string().trim().min(3, "Please enter your email address.").max(254).email("That email address doesn’t look right."),
  source: z.string().trim().max(40).optional(),
});

/** Newsletter signup: validates, de-duplicates by email and inserts once. */
export async function subscribeNewsletterAction(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const parsed = schema.safeParse({ email: formData.get("email"), source: formData.get("source") ?? undefined });
  if (!parsed.success) {
    return { ok: false, message: null, error: parsed.error.issues[0]?.message ?? "Please check your email address." };
  }
  const email = normalizeEmail(parsed.data.email);
  const source = (parsed.data.source || "home").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "home";
  try {
    const { db } = await getServices();
    const existing = await db.from("newsletter_signups").findOne({ email });
    if (!existing) {
      await db.from("newsletter_signups").insert({ id: newId(), email, source, created_at: nowIso() });
    }
    return {
      ok: true,
      message: existing ? "You are already on the list. Thank you for being here." : "You are on the list. Welcome; we are glad you are here.",
      error: null,
    };
  } catch (err) {
    console.error("[newsletter] signup failed", err);
    return { ok: false, message: null, error: "We couldn’t save that just now. Please try again in a moment." };
  }
}
