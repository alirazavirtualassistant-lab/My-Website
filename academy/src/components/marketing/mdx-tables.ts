/**
 * MDX has no GFM tables (and remark-gfm is not installed), so pipe tables in a
 * post are split out and rendered by the shared safe Markdown renderer while
 * the rest of the body goes through MDX. Pure: no I/O.
 */
export interface MdxSegment {
  kind: "mdx" | "table";
  text: string;
}

const ROW_RE = /^\|.*\|$/;
const SEP_RE = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/;

export function splitMdxTables(body: string): MdxSegment[] {
  const lines = (body ?? "").replace(/\r\n?/g, "\n").split("\n");
  const out: MdxSegment[] = [];
  let buf: string[] = [];
  let kind: MdxSegment["kind"] = "mdx";
  const flush = () => {
    if (buf.length && buf.some((l) => l.trim() !== "")) out.push({ kind, text: buf.join("\n") });
    buf = [];
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const isTableStart = ROW_RE.test(line.trim()) && i + 1 < lines.length && SEP_RE.test(lines[i + 1].trim());
    if (isTableStart) {
      flush();
      kind = "table";
      while (i < lines.length && ROW_RE.test(lines[i].trim())) buf.push(lines[i++]);
      flush();
      kind = "mdx";
      continue;
    }
    buf.push(line);
    i++;
  }
  flush();
  return out;
}
