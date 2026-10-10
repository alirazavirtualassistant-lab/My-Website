/**
 * Filename helpers for the certificate PDF route. Pure, so the route stays thin
 * and the behaviour is unit tested.
 */

/** `Certificate-<course-slug>.pdf`; the slug is reduced to [a-z0-9-] and falls back to "course". */
export function certificateFilename(courseSlug: string | null | undefined): string {
  const slug = (courseSlug ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `Certificate-${slug || "course"}.pdf`;
}

/** `attachment; filename="…"` with anything that could break the header stripped. */
export function attachmentDisposition(filename: string): string {
  const safe = filename.replace(/[^\w.\- ()]/g, "_");
  return `attachment; filename="${safe}"`;
}
