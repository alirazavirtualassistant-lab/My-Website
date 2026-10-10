import { describe, expect, it } from "vitest";
import { renderMarkdown, markdownToText, isPlaceholderLink } from "./markdown-render";

describe("renderMarkdown", () => {
  it("escapes raw HTML instead of passing it through", () => {
    const html = renderMarkdown('<script>alert("x")</script> <img src=x onerror=alert(1)>');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders headings, paragraphs and inline marks", () => {
    const html = renderMarkdown("# Title\n\nSome **bold** and *italic* and `code` text.");
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<p>Some <strong>bold</strong> and <em>italic</em> and <code>code</code> text.</p>");
  });

  it("applies a heading offset", () => {
    expect(renderMarkdown("# Title", { headingOffset: 1 })).toBe("<h2>Title</h2>");
  });

  it("renders unordered, ordered and nested lists", () => {
    const html = renderMarkdown("- one\n- two\n  - two-a\n\n1. first\n2. second");
    expect(html).toContain("<ul><li>one</li><li>two<ul><li>two-a</li></ul></li></ul>");
    expect(html).toContain("<ol><li>first</li><li>second</li></ol>");
  });

  it("renders links only with safe protocols and honours the link filter", () => {
    expect(renderMarkdown("[ok](https://example.com)")).toContain('<a href="https://example.com" rel="noopener noreferrer" target="_blank">ok</a>');
    expect(renderMarkdown("[home](/courses)")).toContain('<a href="/courses">home</a>');
    expect(renderMarkdown("[bad](javascript:alert(1))")).toBe("<p>bad</p>");
    expect(renderMarkdown("[form](https://forms.gle/abc)", { linkFilter: (h) => !isPlaceholderLink(h) })).toBe("<p>form</p>");
  });

  it("renders blockquotes, rules, code fences and tables", () => {
    const html = renderMarkdown("> quiet\n\n---\n\n```js\nconst a = '<b>';\n```\n\n| a | b |\n|---|:-:|\n| 1 | 2 |");
    expect(html).toContain("<blockquote><p>quiet</p></blockquote>");
    expect(html).toContain("<hr />");
    expect(html).toContain('<pre><code class="language-js">const a = \'&lt;b&gt;\';</code></pre>');
    expect(html).toContain('<table><thead><tr><th>a</th><th style="text-align:center">b</th></tr></thead><tbody><tr><td>1</td><td style="text-align:center">2</td></tr></tbody></table>');
  });

  it("produces a plain-text excerpt", () => {
    expect(markdownToText("## Hello **world**\n\n- a\n- b")).toBe("Hello world a b");
  });

  it("recognises placeholder sheet links", () => {
    expect(isPlaceholderLink("https://forms.gle/x")).toBe(true);
    expect(isPlaceholderLink("https://www.youtube.com/watch?v=1")).toBe(true);
    expect(isPlaceholderLink("https://www.facebook.com/groups/abc")).toBe(true);
    expect(isPlaceholderLink("https://www.myersmorrison.com")).toBe(false);
  });
});
