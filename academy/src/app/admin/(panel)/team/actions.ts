"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { validatePassword } from "@/lib/auth/password";
import { addTeamMember, changeUserRole, removeTeamMember } from "@/lib/usecases/admin-people";
import { done, failed, invalid, type AdminFormState } from "@/components/admin/students/form-state";

const id = z.string().trim().min(1).max(120);

const addSchema = z.object({
  name: z.string().trim().min(2, "Please add their name.").max(80, "Please keep the name under 80 characters."),
  email: z.string().trim().toLowerCase().max(254).refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Please enter a valid email address."),
  role: z.enum(["admin", "assistant"], { message: "Choose owner or assistant." }),
  password_mode: z.enum(["email", "password"], { message: "Choose how they will set their password." }),
  password: z.string().max(200).default(""),
});

function refresh() {
  revalidatePath("/admin/team");
  revalidatePath("/admin/students");
}

export async function addTeamMemberAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const parsed = addSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    role: formData.get("role") ?? "",
    password_mode: formData.get("password_mode") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!(key in errors)) errors[key] = issue.message;
    }
    return invalid(errors);
  }
  const { name, email, role, password_mode, password } = parsed.data;
  if (password_mode === "password") {
    const weak = validatePassword(password);
    if (weak) return invalid({ password: weak });
  }
  const res = await addTeamMember(actor, { name, email, role, password: password_mode === "password" ? password : null });
  if (!res.ok) return failed(res.error);
  refresh();
  const who = res.profile.name || email;
  return done(
    res.created
      ? password_mode === "password"
        ? `${who} is on the team. Share the temporary password with them privately; the welcome email has gone out.`
        : `${who} is on the team. They have been emailed a link to set their password.`
      : `${who} already had an account and is now ${role === "admin" ? "an owner" : "an assistant"}. Their existing password is unchanged.`,
  );
}

export async function changeTeamRoleAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const parsed = z.object({ user_id: id, role: z.enum(["admin", "assistant"]) }).safeParse({ user_id: formData.get("user_id"), role: formData.get("role") });
  if (!parsed.success) return failed("Choose owner or assistant.");
  const res = await changeUserRole(actor, parsed.data.user_id, parsed.data.role);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(`${res.profile.name} is now ${parsed.data.role === "admin" ? "an owner" : "an assistant"}.`);
}

export async function removeTeamMemberAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const actor = await requireRole("admin");
  const parsed = z.object({ user_id: id, mode: z.enum(["demote", "delete"]) }).safeParse({ user_id: formData.get("user_id"), mode: formData.get("mode") ?? "demote" });
  if (!parsed.success) return failed("We couldn't find that team member.");
  const res = await removeTeamMember(actor, parsed.data.user_id, parsed.data.mode);
  if (!res.ok) return failed(res.error);
  refresh();
  return done(parsed.data.mode === "delete" ? "Account deleted." : "Removed from the team. They keep a learner account.");
}
