import { describe, expect, it } from "vitest";
import { splitMdxTables } from "@/components/marketing/mdx-tables";

describe("splitMdxTables", () => {
  it("separates pipe tables from the surrounding MDX", () => {
    const body = `## Map\n\nIntro text.\n\n| Week | Opens |\n| --- | --- |\n| 1 | Day 0 |\n| 2 | Day 7 |\n\nAfter the table.`;
    expect(splitMdxTables(body)).toEqual([
      { kind: "mdx", text: "## Map\n\nIntro text.\n" },
      { kind: "table", text: "| Week | Opens |\n| --- | --- |\n| 1 | Day 0 |\n| 2 | Day 7 |" },
      { kind: "mdx", text: "\nAfter the table." },
    ]);
  });
  it("returns a single mdx segment when there are no tables and drops blank-only segments", () => {
    expect(splitMdxTables("Just text\n\nmore")).toEqual([{ kind: "mdx", text: "Just text\n\nmore" }]);
    expect(splitMdxTables("")).toEqual([]);
  });
  it("does not treat a lone pipe line as a table", () => {
    expect(splitMdxTables("| not a table |\n\ntext")).toEqual([{ kind: "mdx", text: "| not a table |\n\ntext" }]);
  });
});
