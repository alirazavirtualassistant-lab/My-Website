"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createTestimonial, deleteTestimonial, moderateTestimonial, setTestimonialFeatured, updateTestimonial } from "@/lib/usecases/admin-people";
import { done, failed, invalid, type AdminFormState } from "@/components/admin/students/form-state";

const id = z.string().trim().min(1).max(120);

const testimonialSchema = z.object({
  author_name: z.string().trim().min(2, "Please add the author's name (or initials).").max(80, "Please keep the name under 80 characters."),
  author_role: z
    .string()
    .trim()
    .max(80, "Please keep the role under 80 characters.")
    .transform((v) => v || null),
  body: z.string().trim().min(10, "Please add the testimonial text (at least 10 characters).").max(2000, "Please keep it under 2,000 characters."),
  rating: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(z.number().int().min(1, "Rating is 1 to 5.").max(5, "Rating is 1 to 5.").nullable()),
  course_id: z
    .string()
    .trim()
    .max(120)
    .transform((v) => (v === "" || v === "__none__" ? null : v)),
});

function refresh() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "layout");
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

export async function moderateTestimonialAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ id, status: z.enum(["pending", "approved", "rejected"]) }).safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return failed("We couldn't find that testimonial.");
  const res = await moderateTestimonial(actor, parsed.data.id, parsed.data.status);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(parsed.data.status === "approved" ? "Approved. It can now appear on the public site." : parsed.data.status === "rejected" ? "Rejected. It stays here for your records." : "Moved back to pending.");
}

export async function setFeaturedAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ id, featured: z.string() }).safeParse({ id: formData.get("id"), featured: formData.get("featured") ?? "" });
  if (!parsed.success) return failed("We couldn't find that testimonial.");
  const featured = parsed.data.featured === "1";
  const res = await setTestimonialFeatured(actor, parsed.data.id, featured);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(featured ? "Featured. It shows first on the public pages." : "No longer featured.");
}

export async function deleteTestimonialAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const parsed = z.object({ id }).safeParse({ id: formData.get("id") });
  if (!parsed.success) return failed("We couldn't find that testimonial.");
  const res = await deleteTestimonial(actor, parsed.data.id);
  if (!res.ok) return failed(res.error);
  refresh();
  return done("Testimonial deleted.");
}

export async function saveTestimonialAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireAdmin();
  const existingId = String(formData.get("id") ?? "").trim();
  const parsed = testimonialSchema.safeParse({
    author_name: formData.get("author_name") ?? "",
    author_role: formData.get("author_role") ?? "",
    body: formData.get("body") ?? "",
    rating: formData.get("rating") ?? "",
    course_id: formData.get("course_id") ?? "",
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  const res = existingId ? await updateTestimonial(actor, existingId, parsed.data) : await createTestimonial(actor, parsed.data);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(existingId ? "Testimonial updated." : "Testimonial added and approved.");
}
