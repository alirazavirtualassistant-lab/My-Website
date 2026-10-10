/**
 * Module / lesson code helpers. Pure, shared by the use case (server) and the
 * "Add module" / "Add lesson" dialogs (client).
 */

export function normaliseCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
}

/** Next free module code for a course: M<n> after the highest existing M<n>. */
export function suggestModuleCode(existing: Array<{ code: string }>): string {
  let max = -1;
  for (const m of existing) {
    const match = /^M(\d+)$/.exec(m.code);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `M${max + 1}`;
}

/**
 * Next free lesson code inside a module: `<MODULE>T<n>` (or `<MODULE>_T<n>`
 * when the module already uses the underscore style, e.g. BONUS_T1).
 */
export function suggestLessonCode(moduleCode: string, existing: Array<{ code: string }>): string {
  const escaped = moduleCode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^${escaped}(_?)T(\\d+)[A-Za-z]?$`, "i");
  let max = 0;
  let underscore = /^[A-Z]+$/.test(moduleCode) && !/^M\d+$/.test(moduleCode);
  for (const l of existing) {
    const m = re.exec(l.code);
    if (!m) continue;
    max = Math.max(max, Number(m[2]));
    if (m[1] === "_") underscore = true;
  }
  return `${moduleCode}${underscore ? "_T" : "T"}${max + 1}`;
}
