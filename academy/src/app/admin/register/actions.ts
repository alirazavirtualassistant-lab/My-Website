"use server";

/**
 * First-admin bootstrap. Guarded by ADMIN_SETUP_CODE (constant-time compare)
 * and by "no live admin exists yet" — except in demo mode, where evaluators may
 * add an extra admin.
 */
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { env } from "@/lib/env";
import { getServices } from "@/services";
import { logAudit } from "@/lib/usecases/users";
import { adminRegisterSchema, errorField, isHoneypotTripped, parseForm } from "@/components/auth/logic";
import { errorState, formError, type FormState } from "@/components/auth/types";
import { registerGuard, setupCodeMatches } from "./logic";
import { liveAdminExists } from "./queries";

export async function adminRegisterAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(adminRegisterSchema, formData);
  if (!parsed.ok) return errorState(parsed.errors, parsed.summary);
  const { name, email, password, setupCode, website } = parsed.data;
  if (isHoneypotTripped(website)) return formError("We couldn't create that account.");

  const guard = registerGuard({ setupCodeConfigured: env.adminSetupCode.length > 0, adminExists: await liveAdminExists(), demo: env.demo });
  if (!guard.allowed) {
    return formError(
      guard.reason === "not_configured"
        ? "Admin registration isn't configured. Set ADMIN_SETUP_CODE in the environment first."
        : "An admin already exists — ask them to add you from Admin → Team.",
    );
  }
  if (!setupCodeMatches(env.adminSetupCode, setupCode)) {
    return errorState({ setupCode: "That setup code doesn't match. Check your environment and try again." });
  }

  const { auth } = await getServices();
  const result = await auth.signUpWithPassword({ email, password, name, role: "admin", autoVerify: true, remember: true });
  if (!result.ok) return errorState({ [errorField(result.code)]: result.error }, [result.error], result.code);
  await logAudit(result.profile.id, "admin.registered", "profile", result.profile.id, { via: "setup_code", reason: guard.reason });
  revalidatePath("/", "layout");
  redirect("/admin");
}
