/**
 * Tiny, safe Markdown → HTML renderer for trusted, admin-authored content
 * (course descriptions, legal pages, broadcasts). Every character of the input
 * is HTML-escaped before any markup is added, so raw HTML never passes through.
 *
 * Supported: # headings (1–6), paragraphs, soft/hard line breaks, - * + and
 * 1. lists (one level of nesting by indentation), **bold**, *italic*, `code`,
 * ~~strike~~, [links](url), > blockquotes, --- rules, ``` code fences and
 * simple pipe tables.
 */
import { escapeHtml } from "@/lib/utils";

export interface RenderOptions {
  /** Return false to render a link as plain text (e.g. placeholder links). */
  linkFilter?: (href: string) => boolean;
  /** Add id="…" slugs to headings. */
  headingIds?: boolean;
  /** Shift heading levels, e.g. 1 turns "# Title" into <h2>. */
  headingOffset?: number;
}

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

/** Hosts that only ever appear as placeholders in the source sheet; never rendered as links. */
export const PLACEHOLDER_LINK_HOSTS = ["forms.gle", "youtube.com", "youtu.be", "facebook.com/groups"];

export function isPlaceholderLink(href: string): boolean {
  const h = href.toLowerCase().replace(/^https?:\/\/(www\.)?/, "");
  return PLACEHOLDER_LINK_HOSTS.some((host) => h.startsWith(host));
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function inline(src: string, opts: RenderOptions): string {
  // Work on escaped text; placeholders protect code spans from further processing.
  const codes: string[] = [];
  let s = escapeHtml(src).replace(/`([^`]+)`/g, (_, c: string) => {
    codes.push(`<code>${c}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  // links [text](href "title")
  s = s.replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_m, text: string, href: string, title?: string) => {
    const raw = href.replace(/&amp;/g, "&");
    const allowed = SAFE_HREF.test(raw) && (opts.linkFilter ? opts.linkFilter(raw) : true);
    if (!allowed) return text;
    const external = /^https?:\/\//i.test(raw);
    const attrs = [`href="${escapeHtml(raw)}"`, title ? `title="${title}"` : "", external ? 'rel="noopener noreferrer" target="_blank"' : ""]
      .filter(Boolean)
      .join(" ");
    return `<a ${attrs}>${text}</a>`;
  });
  s = s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/ {2,}$/gm, "<br />")
    .replace(/\\$/gm, "<br />");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i: string) => codes[Number(i)]);
}

interface ListItem {
  text: string;
  children: string[]; // nested raw lines
}

export function renderMarkdown(markdown: string, opts: RenderOptions = {}): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  const offset = opts.headingOffset ?? 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length) out.push(`<p>${inline(buf.join("\n"), opts)}</p>`);
    buf.length = 0;
  };

  const para: string[] = [];
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // blank line
    if (trimmed === "") {
      flushParagraph(para);
      i++;
      continue;
    }

    // fenced code
    if (/^```/.test(trimmed)) {
      flushParagraph(para);
      const lang = trimmed.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) code.push(lines[i++]);
      i++; // closing fence
      const cls = lang ? ` class="language-${escapeHtml(lang.replace(/[^\w-]/g, ""))}"` : "";
      out.push(`<pre><code${cls}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    // heading
    const h = /^(#{1,6})\s+(.+?)\s*#*$/.exec(trimmed);
    if (h) {
      flushParagraph(para);
      const level = Math.min(6, h[1].length + offset);
      const content = inline(h[2], opts);
      const id = opts.headingIds ? ` id="${slug(content)}"` : "";
      out.push(`<h${level}${id}>${content}</h${level}>`);
      i++;
      continue;
    }

    // horizontal rule
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph(para);
      out.push("<hr />");
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(trimmed)) {
      flushParagraph(para);
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) quote.push(lines[i++].trim().replace(/^>\s?/, ""));
      out.push(`<blockquote>${renderMarkdown(quote.join("\n"), opts)}</blockquote>`);
      continue;
    }

    // table: header row + separator row
    if (/^\|.*\|$/.test(trimmed) && i + 1 < lines.length && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/.test(lines[i + 1].trim())) {
      flushParagraph(para);
      const splitRow = (row: string) =>
        row
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());
      const header = splitRow(lines[i]);
      const aligns = splitRow(lines[i + 1]).map((c) => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : c.startsWith(":") ? "left" : null));
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) rows.push(splitRow(lines[i++]));
      const cell = (tag: "th" | "td", c: string, idx: number) => `<${tag}${aligns[idx] ? ` style="text-align:${aligns[idx]}"` : ""}>${inline(c, opts)}</${tag}>`;
      out.push(
        `<table><thead><tr>${header.map((c, idx) => cell("th", c, idx)).join("")}</tr></thead>` +
          (rows.length ? `<tbody>${rows.map((r) => `<tr>${header.map((_, idx) => cell("td", r[idx] ?? "", idx)).join("")}</tr>`).join("")}</tbody>` : "") +
          `</table>`,
      );
      continue;
    }

    // lists
    const listMatch = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (listMatch) {
      flushParagraph(para);
      const baseIndent = listMatch[1].length;
      const ordered = /\d/.test(listMatch[2]);
      const items: ListItem[] = [];
      while (i < lines.length) {
        const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
        if (m && m[1].length === baseIndent && /\d/.test(m[2]) === ordered) {
          items.push({ text: m[3], children: [] });
          i++;
          continue;
        }
        // continuation / nested lines belong to the last item
        if (items.length && lines[i].trim() !== "" && (lines[i].match(/^\s*/)?.[0].length ?? 0) > baseIndent) {
          items[items.length - 1].children.push(lines[i].slice(baseIndent + 2));
          i++;
          continue;
        }
        break;
      }
      const tag = ordered ? "ol" : "ul";
      const startAttr = ordered && /^\d+/.exec(listMatch[2])?.[0] !== "1" ? ` start="${parseInt(listMatch[2], 10)}"` : "";
      out.push(
        `<${tag}${startAttr}>${items
          .map((it) => {
            const task = /^\[([ xX])\]\s+/.exec(it.text);
            const label = task ? it.text.slice(task[0].length) : it.text;
            const box = task
              ? `<input type="checkbox" disabled${task[1] !== " " ? " checked" : ""} aria-label="${task[1] !== " " ? "done" : "not done"}" /> `
              : "";
            const nested = it.children.length ? renderMarkdown(it.children.join("\n"), opts) : "";
            return `<li>${box}${inline(label, opts)}${nested}</li>`;
          })
          .join("")}</${tag}>`,
      );
      continue;
    }

    // paragraph text
    para.push(line.trim());
    i++;
  }
  flushParagraph(para);
  return out.join("\n");
}

/** Plain-text excerpt (strips markdown syntax). */
export function markdownToText(markdown: string): string {
  return renderMarkdown(markdown)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
