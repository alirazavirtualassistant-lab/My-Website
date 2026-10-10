import JSZip from "jszip";
import type { VirtualFiles } from "./types";

const IGNORED = /(^|\/)(__MACOSX\/|\.DS_Store$|Thumbs\.db$|desktop\.ini$|\.git\/)/i;

/** Unpacks a zip (Buffer / Uint8Array / ArrayBuffer) into a virtual file map, dropping a single wrapper folder if present. */
export async function zipToVirtualFiles(data: Buffer | Uint8Array | ArrayBuffer): Promise<VirtualFiles> {
  const zip = await JSZip.loadAsync(data);
  const entries: Array<{ path: string; obj: JSZip.JSZipObject }> = [];
  zip.forEach((relativePath, obj) => {
    if (obj.dir) return;
    const p = normalisePath(relativePath);
    if (!p || IGNORED.test(p) || p.split("/").includes("..")) return;
    entries.push({ path: p, obj });
  });
  entries.sort((a, b) => a.path.localeCompare(b.path));
  const out: VirtualFiles = new Map();
  for (const e of entries) out.set(e.path, await e.obj.async("nodebuffer"));
  return stripCommonRoot(out);
}

export function normalisePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "").replace(/\/{2,}/g, "/");
}

/** A zip made from a folder nests everything under that folder; peel such wrappers off until a file sits at the root. */
export function stripCommonRoot(files: VirtualFiles): VirtualFiles {
  let current = files;
  for (let depth = 0; depth < 8; depth++) {
    const paths = [...current.keys()];
    if (paths.length === 0) return current;
    const roots = new Set<string | null>(paths.map((p) => (p.includes("/") ? p.slice(0, p.indexOf("/")) : null)));
    if (roots.size !== 1 || roots.has(null)) return current;
    const root = [...roots][0] as string;
    const next: VirtualFiles = new Map();
    for (const [p, data] of current) next.set(p.slice(root.length + 1), data);
    current = next;
  }
  return current;
}
