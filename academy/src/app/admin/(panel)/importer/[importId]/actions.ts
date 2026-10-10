"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getServices } from "@/services";
import { installCoursePackage } from "@/lib/usecases/install-package";
import { logAudit } from "@/lib/usecases/users";
import { guessType } from "@/lib/usecases/uploads";
import { adminFormError, type AdminFormState } from "@/components/admin/courses/form-state";
import { deleteImportSession, loadImportFiles, loadImportSession } from "../_lib/sessions";

const inputSchema = z.object({
  importId: z.string().uuid(),
  mode: z.enum(["draft", "published", "keep"]),
  preserveCourseFields: z.boolean().optional().default(false),
});

/**
 * Installs a previewed package: upserts the course by slug (lesson ids stay
 * stable so learner progress survives), copies the learner files into the
 * course-resources bucket, then clears the session and lands on the
 * curriculum.
 */
export async function installImportAction(input: { importId: string; mode: "draft" | "published" | "keep"; preserveCourseFields?: boolean }): Promise<AdminFormState> {
  const session = await requireAdmin("/admin/importer");
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return adminFormError("That request could not be read.");
  const { importId, mode, preserveCourseFields } = parsed.data;
  const imp = await loadImportSession(importId);
  if (!imp) return adminFormError("That import preview has expired. Please upload the package again.");

  const { db, storage } = await getServices();
  let courseId: string;
  let copied = 0;
  try {
    const status = mode === "keep" ? undefined : mode;
    const result = await installCoursePackage(db, imp.pkg, { status, preserveCourseFields });
    courseId = result.course_id;

    if (imp.source.kind === "zip") {
      const files = await loadImportFiles(imp);
      if (!files) return adminFormError("The uploaded zip is no longer available. Please upload it again.");
      for (const f of files.files) {
        await storage.upload({ bucket: "course-resources", path: f.storage_path, data: f.data, contentType: guessType(f.file_name) || "application/octet-stream" });
        copied += 1;
      }
    } else if (storage.kind !== "mock") {
      // Bundled files live in content/storage (read by the mock adapter directly); real storage needs a copy.
      const root = path.resolve(process.cwd(), "content/storage/course-resources");
      const paths = new Set(imp.pkg.modules.flatMap((m) => [...m.resources.map((r) => r.file_path), ...m.lessons.flatMap((l) => l.resources.map((r) => r.file_path))]));
      for (const p of paths) {
        try {
          const data = await fs.readFile(path.join(root, ...p.split("/")));
          await storage.upload({ bucket: "course-resources", path: p, data, contentType: guessType(p) || "application/octet-stream" });
          copied += 1;
        } catch (err) {
          console.warn("[admin/importer] bundled file missing", p, err);
        }
      }
    }
    await logAudit(session.user_id, "import.installed", "course", courseId, { import_id: importId, mode, preserveCourseFields, created: result.created, lessons: result.lessons, resources: result.resources, files_copied: copied, source: imp.source });
  } catch (err) {
    console.error("[admin/importer] install failed", err);
    return adminFormError(err instanceof Error ? err.message : "The import failed part-way. Nothing visible to learners changes until it succeeds.");
  }
  await deleteImportSession(importId);
  revalidatePath("/", "layout");
  redirect(`/admin/courses/${courseId}/curriculum?toast=imported`);
}
