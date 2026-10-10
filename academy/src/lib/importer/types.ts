import type { CoursePackage } from "@/lib/types";

/**
 * A course package held in memory: package-relative path (forward slashes,
 * no leading "./", no top-level wrapper folder) → file bytes. Produced from a
 * directory on disk (scripts) or from an uploaded zip (admin bulk importer).
 */
export type VirtualFiles = Map<string, Buffer>;

/** A learner-facing file the importer wants copied into the course-resources bucket. */
export interface StoredFile {
  /** Path inside the course-resources bucket, e.g. `baby-steps/01_Module_1_…/Resources/M1T1_Self-Assessment.pdf`. */
  storage_path: string;
  /** Package-relative source path. */
  source_path: string;
  file_name: string;
  size_bytes: number;
  data: Buffer;
}

export interface ImportResult {
  pkg: CoursePackage;
  /** Every learner file (Resources/ folders) in storage order. */
  files: StoredFile[];
  /** Non-fatal notes for the admin preview (fallback durations, unreferenced cells…). */
  warnings: string[];
}

export interface ImportOptions {
  /** Course slug; also the first path segment of every storage path. Default `baby-steps`. */
  slug?: string;
  /** Recorded in `pkg.source.zip` (null for directory imports). */
  zipName?: string | null;
  /** Override for `pkg.generated_at` (tests). */
  now?: string;
}

/** Thrown when the package fails validation. `problems` lists every issue found, not just the first. */
export class ImportError extends Error {
  readonly problems: string[];
  constructor(problems: string[]) {
    super(
      `Course import failed with ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n- ${problems.join("\n- ")}`,
    );
    this.name = "ImportError";
    this.problems = problems;
  }
}
