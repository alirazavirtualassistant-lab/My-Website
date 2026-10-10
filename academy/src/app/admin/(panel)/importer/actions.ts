"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { loadBundledPackage } from "@/lib/usecases/demo";
import { logAudit } from "@/lib/usecases/users";
import { adminFormError, adminSuccess, type AdminFormState } from "@/components/admin/courses/form-state";
import { createImportSession, deleteImportSession, loadImportSession } from "./_lib/sessions";

/** Demo convenience: previews the bundled content/courses/baby-steps/course.json as if it had been uploaded. */
export async function reimportBundledAction(): Promise<AdminFormState> {
  const session = await requireAdmin("/admin/importer");
  const pkg = await loadBundledPackage("baby-steps");
  if (!pkg) return adminFormError("The bundled Baby Steps package is missing (content/courses/baby-steps/course.json). Run `npm run import:course` first.");
  const files = pkg.modules.flatMap((m) => [...m.resources, ...m.lessons.flatMap((l) => l.resources)]);
  const created = await createImportSession({
    actorId: session.user_id,
    result: { pkg, files: [], warnings: [] },
    source: { kind: "bundled", slug: "baby-steps" },
    zip: null,
    sheet: null,
  });
  await logAudit(session.user_id, "import.bundled_previewed", "import_session", created.id, { files: new Set(files.map((f) => f.file_path)).size });
  redirect(`/admin/importer/${created.id}`);
}

export async function discardImportAction(importId: string): Promise<AdminFormState> {
  const session = await requireAdmin("/admin/importer");
  const id = z.string().uuid().safeParse(importId);
  if (!id.success) return adminFormError("That import could not be found.");
  const existing = await loadImportSession(id.data);
  if (!existing) return adminFormError("That import has already been removed.");
  await deleteImportSession(id.data);
  await logAudit(session.user_id, "import.discarded", "import_session", id.data);
  revalidatePath("/admin/importer");
  return adminSuccess("Import discarded.");
}
