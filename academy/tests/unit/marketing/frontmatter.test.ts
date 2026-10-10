import { describe, expect, it } from "vitest";
import { parseFrontmatter, asString, asStringArray } from "@/components/marketing/frontmatter";

describe("parseFrontmatter", () => {
  it("parses quoted strings, inline arrays and leaves the body intact", () => {
    const src = `---\ntitle: "Why the next 90 days matter"\ndate: 2026-10-01\ntags: ["preconception", "science-backed"]\n---\n\n## Heading\n\nBody text.`;
    const { data, body } = parseFrontmatter(src);
    expect(data.title).toBe("Why the next 90 days matter");
    expect(data.date).toBe("2026-10-01");
    expect(data.tags).toEqual(["preconception", "science-backed"]);
    expect(body).toBe("\n## Heading\n\nBody text.");
  });
  it("parses block lists and single quotes", () => {
    const { data } = parseFrontmatter(`---\nauthor: 'Cynthia'\ntags:\n  - a\n  - "b c"\n---\nhi`);
    expect(data.author).toBe("Cynthia");
    expect(data.tags).toEqual(["a", "b c"]);
  });
  it("returns the whole text as body when there is no frontmatter", () => {
    expect(parseFrontmatter("# Just markdown")).toEqual({ data: {}, body: "# Just markdown" });
    expect(parseFrontmatter("---\nunterminated").body).toBe("---\nunterminated");
  });
  it("coerces values", () => {
    expect(asString(["x", "y"])).toBe("x");
    expect(asString(undefined, "fb")).toBe("fb");
    expect(asStringArray("a, b")).toEqual(["a", "b"]);
    expect(asStringArray(undefined)).toEqual([]);
  });
});
