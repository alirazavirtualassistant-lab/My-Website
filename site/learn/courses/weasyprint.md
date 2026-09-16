---
id: weasyprint
title: WeasyPrint (HTML/CSS to PDF)
icon: 🧾
track: Document Engineering
color: #16A085
runner: html
tagline: Design print-ready PDFs with HTML and CSS.
description: WeasyPrint from install to expert paged-media design: the HTML+CSS to PDF pipeline, @page rules and margins, page sizes, headers and footers with running elements, page numbers and counters, page breaks, fonts and @font-face, tables across pages, layout support limits, images and SVG, PDF metadata, bookmarks, attachments, PDF/A, and templating with Jinja2.
---

# LEVEL: Beginner

## What WeasyPrint is and installing it

WeasyPrint is a Python library and command-line tool that turns HTML and CSS into PDF. Unlike a browser's "Print to PDF", it is a **paged-media** engine: it understands `@page` rules, page margins, running headers and footers, page counters and page breaks. Unlike ReportLab, you do not draw at x/y coordinates; you write a normal web page with a stylesheet and let the engine flow it across pages. That makes it the natural tool for policy manuals, SOPs, invoices, rate sheets and weekly production reports that already exist as HTML templates.

It is written in pure Python but leans on two native libraries: **Pango** (text shaping and fonts, through HarfBuzz and FreeType) and **fontconfig** (font discovery). Since version 53 (2021) it no longer needs Cairo or GDK-PixBuf, which removed most of the historical installation pain. It also uses the pure-Python packages `pydyf` (PDF writing), `tinycss2` and `cssselect2` (CSS parsing and selectors), `tinyhtml5` (HTML parsing, replaced `html5lib` in v63), `Pillow` (raster images) and `fontTools` (font subsetting).

### Installing on Linux

Install the native libraries with your package manager first, then install WeasyPrint with pip.

```bash
# Debian / Ubuntu
sudo apt install libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz-subset0
python3 -m venv .venv && source .venv/bin/activate
pip install weasyprint
weasyprint --info
```

`weasyprint --info` prints the WeasyPrint, pydyf, Pango and cffi versions. If it runs, everything is wired up. On Fedora the package names are `pango` and `harfbuzz`; on Alpine, `pango` and `ttf-dejavu` (you need at least one font installed or every glyph falls back to nothing).

### Installing on Windows

Windows needs the GTK runtime for Pango. The documented route is MSYS2:

```bash
# 1. Install MSYS2 from https://www.msys2.org, then in the MSYS2 shell:
pacman -S mingw-w64-x86_64-pango
# 2. Tell WeasyPrint where the DLLs live (PowerShell):
$env:WEASYPRINT_DLL_DIRECTORIES = "C:\msys64\mingw64\bin"
# 3. In a normal Python environment:
pip install weasyprint
python -m weasyprint --info
```

The `WEASYPRINT_DLL_DIRECTORIES` variable (added in v54) tells WeasyPrint which folders to search for `libpango-1.0-0.dll`, `libgobject-2.0-0.dll` and friends. If you forget it you get `OSError: cannot load library 'libgobject-2.0-0'`. Set it at the user level in System Properties so every terminal inherits it. An alternative is the "GTK3 Runtime Environment Installer" from the `gtk-for-windows-runtime-environment-installer` project, which adds the DLL folder to `PATH`.

### Installing on macOS

```bash
brew install pango
pip install weasyprint
```

Homebrew Pango pulls in HarfBuzz, FreeType and fontconfig. On Apple Silicon the libraries live under `/opt/homebrew/lib`; if `pip install` succeeds but importing fails, export `DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib`.

### How the pipeline works

| Stage | What happens | Library |
|---|---|---|
| Parse HTML | The document becomes an element tree | tinyhtml5 |
| Parse CSS | User-agent stylesheet + your `<style>`, `<link>` and extra stylesheets are cascaded | tinycss2, cssselect2 |
| Build boxes | Elements become block, inline, table and page boxes | WeasyPrint `formatting_structure` |
| Layout | Boxes are laid out and split across pages | WeasyPrint `layout` |
| Draw | Each page is drawn as PDF content streams | pydyf |
| Finish | Fonts are subset and embedded, metadata, bookmarks and attachments are written | fontTools, pydyf |

Two consequences of this design matter from day one. First, there is **no JavaScript engine**: anything rendered by JS in the browser will not appear. Generate the final HTML server-side (with Jinja2, for example) before handing it to WeasyPrint. Second, WeasyPrint implements the CSS specs for print (CSS Paged Media, Generated Content for Paged Media), so it supports things Chrome does not, and it lacks some things Chrome has, such as `box-shadow` and `position: sticky`.

> **Tip:** Pin the version in `requirements.txt` (for example `weasyprint==62.3`). Layout fixes between major versions can move a page break in a 700-page handbook, and you want that to happen when you choose, not during a client's deadline.

### Try It Yourself

```html
<!-- WeasyPrint renders this identically; the browser preview shows the flow content. -->
<style>
  body { font-family: Georgia, serif; margin: 2cm; color: #222; }
  h1 { color: #16A085; border-bottom: 2px solid #16A085; padding-bottom: 4px; }
  .meta { color: #666; font-size: 0.9em; }
</style>
<h1>Policy Manual - Section 1</h1>
<p class="meta">Prepared by Document Production, version 3.2</p>
<p>This paragraph is plain HTML. Save it as <code>manual.html</code> and run
<code>weasyprint manual.html manual.pdf</code> to get a PDF.</p>
```

### Quiz

1. Which native library does WeasyPrint rely on for text shaping and fonts?
- [ ] Cairo
- [x] Pango
- [ ] Skia
> Since version 53 WeasyPrint needs only Pango (with HarfBuzz and FreeType underneath) and fontconfig; Cairo and GDK-PixBuf were dropped.

2. What does the `WEASYPRINT_DLL_DIRECTORIES` environment variable do?
- [x] Tells WeasyPrint where to find the GTK/Pango DLLs on Windows
- [ ] Sets the folder where PDFs are written
- [ ] Enables debug logging
> Windows has no system-wide Pango, so you point WeasyPrint at the MSYS2 or GTK runtime `bin` folder.

3. Why does a chart drawn by Chart.js not appear in the PDF?
- [ ] The canvas is too large
- [x] WeasyPrint has no JavaScript engine
- [ ] Charts need PDF/A
> WeasyPrint only sees the static HTML. Render charts server-side (for example as SVG) before converting.

### Exercises

1. **Verify the install** — Write the command that prints WeasyPrint's version and its dependency versions, and explain what error you would see on Windows if the DLL folder is not configured.
<details><summary>Solution</summary>

```bash
weasyprint --info
# or: python -m weasyprint --info
```

Without `WEASYPRINT_DLL_DIRECTORIES` (or the GTK `bin` folder on `PATH`) the import fails with `OSError: cannot load library 'libgobject-2.0-0'`.

</details>

2. **Requirements file** — Write a `requirements.txt` that pins WeasyPrint and Jinja2 for a reporting project, and explain why pinning matters here more than for most libraries.
<details><summary>Solution</summary>

```text
weasyprint==62.3
jinja2==3.1.4
```

Layout engines change page-breaking behaviour between major versions. A pinned version guarantees that a report that fit on 12 pages last month still fits on 12 pages today; you upgrade deliberately and re-check the output.

</details>

### Interview Questions

**Q: When would you choose WeasyPrint over ReportLab or a headless browser?**
I choose WeasyPrint when the content is document-like and already expressed as HTML: manuals, invoices, reports rendered from templates. It gives me real paged-media features (margin boxes, page counters, named pages, running headers) that headless Chrome only partially supports, and it is far less code than ReportLab because designers can work in CSS. I choose ReportLab when I need coordinate-level control or extreme throughput, and headless Chrome when the page depends on JavaScript or modern CSS such as `box-shadow` and full Grid. For a 700-page handbook with a generated TOC and chapter headers in the footer, WeasyPrint is the least code and the most maintainable.

**Q: What are the main installation gotchas?**
On Linux the wheel installs cleanly but Pango and HarfBuzz must be present as system packages, and at least one font must exist or text renders as nothing. On Windows there is no system Pango, so you install the GTK runtime through MSYS2 and set `WEASYPRINT_DLL_DIRECTORIES`. In Docker images built from `python:slim` I add `libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz-subset0` and `fonts-dejavu` or the brand fonts. Finally, I always pin the version, because the rendering engine evolves and page breaks can shift.

**Q: Describe the WeasyPrint pipeline from HTML to PDF.**
The HTML is parsed into a tree, the CSS cascade is computed with the user-agent stylesheet plus author stylesheets, and elements become boxes. The layout stage lays out the boxes into a sequence of page boxes, splitting content at page breaks and honouring `@page` margins, orphans and widows. Each page is then drawn into PDF content streams using pydyf, and finally fonts are subset with fontTools, metadata, bookmarks, links and attachments are written. Knowing that layout is separate from drawing is useful: `HTML.render()` gives you the laid-out `Document` object, which you can inspect (page count) or write more than once.

## First HTML to PDF: CLI and Python API

You can drive WeasyPrint from the shell or from Python. The shell is quickest for one-off conversions and for checking a template; the Python API is what you use inside a report generator, a Flask endpoint or a batch job that produces 400 client deliverables overnight.

### The command line

```bash
weasyprint input.html output.pdf
weasyprint https://example.com/report report.pdf
weasyprint -s print.css -m print manual.html manual.pdf
weasyprint --pdf-variant pdf/a-3b --uncompressed-pdf manual.html manual.pdf
weasyprint - out.pdf < page.html
```

Useful flags: `-s/--stylesheet` adds a CSS file (repeatable), `-m/--media-type` chooses the media type used for `@media` queries (default is `print`), `-u/--base-url` sets the base URL for relative paths when reading from stdin, `-a/--attachment` embeds a file, `-p/--presentational-hints` honours HTML attributes like `<table width>`, `-O/--optimize-images` recompresses images, `-v/--verbose` and `-d/--debug` show logging, and `-q/--quiet` silences warnings. Run `weasyprint --help` for the full list of the version you have installed; flags such as `--pdf-variant` and `--custom-metadata` exist from v57 onward.

### The Python API

```python
from weasyprint import HTML, CSS

HTML("report.html").write_pdf("report.pdf")

HTML(string="<h1>Weekly Status</h1><p>42 files closed.</p>").write_pdf(
    "status.pdf",
    stylesheets=[CSS(string="h1 { color: #16A085 }")],
)
```

`HTML()` accepts exactly one of `filename=`, `url=`, `string=`, `file_obj=` or a positional guess. `CSS()` accepts the same sources. `write_pdf()` writes to a path, a file object, or returns bytes when called with no target. Every rendering option you can pass on the command line is a keyword argument of `write_pdf()` in v60 and later (`stylesheets`, `media_type`, `attachments`, `pdf_variant`, `pdf_version`, `pdf_forms`, `uncompressed_pdf`, `custom_metadata`, `presentational_hints`, `optimize_images`, `jpeg_quality`, `dpi`, `full_fonts`, `hinting`, `cache`).

### Render, then write

`write_pdf()` is a shortcut for `render()` followed by `Document.write_pdf()`. Splitting the two lets you inspect the result before writing.

```python
from weasyprint import HTML

doc = HTML("handbook.html").render()
print("pages:", len(doc.pages))
first_page = doc.pages[0]
print("page size in CSS px:", first_page.width, first_page.height)
doc.write_pdf("handbook.pdf")
```

`Document.pages` is a list of `Page` objects with `width`, `height`, `bleed`, `bookmarks`, `links` and `anchors`. `Document.copy(pages)` lets you write a subset, for example a proof of only the first three pages.

### Returning a PDF from a web app

```python
from flask import Flask, render_template, make_response
from weasyprint import HTML

app = Flask(__name__)

@app.get("/invoice/<int:no>")
def invoice(no):
    html = render_template("invoice.html", number=no)
    pdf = HTML(string=html, base_url=app.static_folder).write_pdf()
    resp = make_response(pdf)
    resp.headers["Content-Type"] = "application/pdf"
    resp.headers["Content-Disposition"] = f'inline; filename="invoice-{no}.pdf"'
    return resp
```

The important detail is `base_url`. When you pass `string=`, WeasyPrint has no idea where relative paths like `logo.png` should resolve, so you tell it. Django users pass `request.build_absolute_uri()` or a filesystem path to the static folder.

| Source | Sets `base_url` automatically? |
|---|---|
| `HTML("file.html")` | Yes, to the file's directory |
| `HTML(url="https://…")` | Yes, to the URL |
| `HTML(string=…)` | No, pass `base_url=` |
| `HTML(file_obj=…)` | No, pass `base_url=` |

> **Warning:** `HTML(url=...)` fetches remote images and stylesheets for you. If your template can include user-supplied HTML, that is a server-side request forgery vector. Sanitise the HTML or supply a custom `url_fetcher` that only allows a whitelist of paths.

### Try It Yourself

```html
<style>
  @page { size: A4; margin: 20mm; }
  body { font-family: Helvetica, Arial, sans-serif; font-size: 11pt; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #999; padding: 4px 8px; text-align: left; }
  th { background: #16A085; color: white; }
</style>
<h1>Weekly Production Status - Week 37</h1>
<table>
  <thead><tr><th>State</th><th>Files opened</th><th>Files closed</th></tr></thead>
  <tbody>
    <tr><td>Texas</td><td>128</td><td>117</td></tr>
    <tr><td>Wyoming</td><td>41</td><td>39</td></tr>
    <tr><td>Colorado</td><td>66</td><td>70</td></tr>
  </tbody>
</table>
<p>Convert with: <code>weasyprint status.html status.pdf</code></p>
```

### Quiz

1. What does `HTML(string=html).write_pdf()` return when no target is given?
- [x] The PDF as bytes
- [ ] A file path
- [ ] A `Document` object
> With no target the method returns the PDF bytes, which is what a web endpoint sends back.

2. Which argument fixes broken relative image paths when rendering from a string?
- [ ] `media_type`
- [x] `base_url`
- [ ] `stylesheets`
> A string has no location, so `base_url` supplies the directory or URL that relative references resolve against.

3. What does `HTML(...).render()` give you?
- [ ] The PDF bytes
- [x] A laid-out `Document` whose pages you can inspect
- [ ] The HTML tree
> `render()` performs layout only; `Document.write_pdf()` produces the file.

### Exercises

1. **Count pages before writing** — Render `manual.html`, refuse to write the PDF if it has more than 50 pages, and otherwise save it.
<details><summary>Solution</summary>

```python
from weasyprint import HTML

doc = HTML("manual.html").render()
if len(doc.pages) > 50:
    raise SystemExit(f"Too long: {len(doc.pages)} pages")
doc.write_pdf("manual.pdf")
```

</details>

2. **Extra stylesheet from the CLI** — Give the command that converts `sop.html` with an extra `print.css`, treats the media type as `print`, and turns on verbose logging.
<details><summary>Solution</summary>

```bash
weasyprint -s print.css -m print -v sop.html sop.pdf
```

</details>

3. **Write a proof of the first two pages** — Using `Document.copy()`, write only pages 1 and 2 to `proof.pdf`.
<details><summary>Solution</summary>

```python
from weasyprint import HTML

doc = HTML("manual.html").render()
doc.copy(doc.pages[:2]).write_pdf("proof.pdf")
```

</details>

### Interview Questions

**Q: How would you integrate WeasyPrint into a Django or Flask app safely?**
I render the template to a string with the framework's engine, then call `HTML(string=html, base_url=...)` with a base URL pointing at the static folder so logos and CSS resolve without HTTP round trips. I return `write_pdf()` bytes with `Content-Type: application/pdf` and a `Content-Disposition` header. For safety I never pass user-controlled HTML straight in, because `<img src="http://169.254.169.254/...">` would make the server fetch internal URLs; I either sanitise with `bleach`/`nh3` or install a custom `url_fetcher` that only serves whitelisted local files. For heavy reports I move rendering to a Celery task and store the PDF, since a 200-page document can take several seconds.

**Q: What is the difference between `write_pdf()` and `render()`?**
`render()` runs parsing and layout and returns a `Document` with a `pages` list; nothing is written. `write_pdf()` on the `HTML` object is a convenience that calls `render()` and then `Document.write_pdf()`. Separating them lets me count pages, log the page count to a production report, write a subset with `Document.copy()`, or write the same layout twice (a compressed copy and an uncompressed debugging copy) without laying out again, which is the expensive step.

**Q: Which CLI flags do you actually use day to day?**
`-s` to add a print stylesheet without touching the HTML, `-m print` when a template also has screen styles, `-u` when piping HTML from stdin so images resolve, `-v` when a font or image is missing, `--pdf-variant pdf/a-3b` for archival deliverables, `-O` (`--optimize-images`) when a report with many screenshots is too large, and `--uncompressed-pdf` when I need to read the PDF source to debug. I check `weasyprint --help` because flags such as `--pdf-variant` only exist from v57.

## @page: size and margins

Everything that separates a PDF from a web page starts in the `@page` rule. It defines the **page box**: its size, orientation, margins, and later its headers, footers and bleed. Without it WeasyPrint uses A4 portrait with 0.75in margins, which is fine for a draft and wrong for almost every client.

### Setting the size

```css
@page {
  size: A4;                  /* 210mm x 297mm */
  margin: 25mm 20mm 25mm 20mm;
}
@page {
  size: letter landscape;    /* 11in x 8.5in */
}
@page {
  size: 6in 9in;             /* custom trade paperback trim */
}
```

`size` accepts a page size keyword (`A3`, `A4`, `A5`, `B4`, `B5`, `letter`, `legal`, `ledger`), an optional orientation (`portrait`, `landscape`), or two explicit lengths. Margins use the normal shorthand order: top, right, bottom, left. Units are the CSS absolute units, and it pays to remember the conversions because designers speak in millimetres, printers in points, and CSS in pixels.

| Unit | Definition | Example |
|---|---|---|
| `mm` | Millimetre | A4 is 210mm x 297mm |
| `in` | Inch = 25.4mm | US Letter is 8.5in x 11in |
| `pt` | Point = 1/72in | 11pt body text |
| `pc` | Pica = 12pt | Rare in CSS, common in InDesign |
| `px` | CSS pixel = 1/96in = 0.75pt | 96px = 1in |

### Page-specific rules

`@page` takes pseudo-classes so the first page, or left and right pages, can differ.

```css
@page :first { margin-top: 60mm; }       /* room for a cover title block */
@page :left  { margin-left: 15mm; margin-right: 25mm; }
@page :right { margin-left: 25mm; margin-right: 15mm; }
@page :blank { @top-center { content: none; } }
```

`:left` and `:right` alternate starting from the right (page 1 is a right-hand page), which is how bound documents put the wider **gutter** margin on the spine side. `:blank` matches pages inserted automatically when you force a chapter to start on a right-hand page.

### Margins inside the page box

The `@page` margin is the space between the paper edge and the **page area** where your content flows. It is not the same as `body { margin }`. Set `body { margin: 0 }` when using `@page` margins, otherwise you get both and the text area shrinks twice.

```css
@page { size: A4; margin: 20mm 18mm 25mm 18mm; }
html, body { margin: 0; padding: 0; }
body { font-size: 11pt; line-height: 1.4; }
```

The page area is what remains after the margins, and the sixteen margin boxes (covered in the Intermediate level) live inside the margins. A common mistake is to make `margin-bottom` too small for a footer and then wonder why the footer overlaps the text: the footer lives in the margin, so the margin must be tall enough to hold it.

### Checking the result

```python
from weasyprint import HTML, CSS

css = CSS(string="@page { size: A5 landscape; margin: 10mm }")
doc = HTML(string="<p>Rate matrix</p>").render(stylesheets=[css])
page = doc.pages[0]
print(page.width / 96 * 25.4, "mm wide")   # 210.0
print(page.height / 96 * 25.4, "mm tall")  # 148.0
```

`Page.width` and `Page.height` are reported in CSS pixels, so divide by 96 and multiply by 25.4 to get millimetres. Landscape A5 comes out as 210mm x 148mm as expected.

> **Tip:** Put all `@page` rules in one print stylesheet at the top of the cascade. `@page` rules cascade like normal rules, so a later `@page { margin: 0 }` in a component stylesheet silently overrides your careful margins, and the only symptom is text running to the paper edge.

### Try It Yourself

```html
<!-- @page only takes effect in WeasyPrint; the browser preview shows the content and the box simulation. -->
<style>
  @page { size: A5; margin: 15mm; }
  html, body { margin: 0; }
  body { font-family: Arial, sans-serif; font-size: 10.5pt; }
  .page-sim { width: 148mm; height: 210mm; border: 1px dashed #999; padding: 15mm; box-sizing: border-box; }
  h1 { margin-top: 0; color: #16A085; }
</style>
<div class="page-sim">
  <h1>Rate Matrix - Owner's Policy</h1>
  <p>This dashed box simulates an A5 page with 15mm margins so you can see the page area in the browser.</p>
</div>
```

### Quiz

1. Which rule makes every page US Letter in landscape?
- [ ] `@page { size: 8.5in 11in landscape }`
- [x] `@page { size: letter landscape }`
- [ ] `@page { orientation: landscape }`
> `size` takes a keyword plus an optional orientation; there is no `orientation` property.

2. How many CSS pixels are in one inch?
- [ ] 72
- [x] 96
- [ ] 300
> CSS defines `1in = 96px = 72pt`; DPI of the printer is irrelevant to CSS units.

3. Why set `body { margin: 0 }` when using `@page { margin }`?
- [x] Otherwise both margins apply and the text area shrinks twice
- [ ] Because `body` margins are ignored in print
- [ ] To enable margin boxes
> The page margin and the body margin are different boxes; together they add up.

### Exercises

1. **Bound manual margins** — Write `@page` rules for an A4 manual with a 25mm gutter (inside) margin and 15mm outside margin, and a 40mm top margin on the first page only.
<details><summary>Solution</summary>

```css
@page { size: A4; margin: 20mm 15mm 20mm 25mm; }
@page :left  { margin-left: 15mm; margin-right: 25mm; }
@page :right { margin-left: 25mm; margin-right: 15mm; }
@page :first { margin-top: 40mm; }
```

</details>

2. **Verify the page size in Python** — Render an empty document with `size: 6in 9in` and print its width and height in inches.
<details><summary>Solution</summary>

```python
from weasyprint import HTML, CSS

doc = HTML(string="<p></p>").render(stylesheets=[CSS(string="@page { size: 6in 9in }")])
p = doc.pages[0]
print(p.width / 96, p.height / 96)  # 6.0 9.0
```

</details>

### Interview Questions

**Q: Explain the relationship between `@page` margins, margin boxes and the page area.**
The page box is the whole sheet. The `@page` margins carve out a band around it; the rectangle left in the middle is the page area where content flows. The sixteen margin boxes (`@top-left`, `@bottom-center`, and so on) are positioned inside that margin band, which is why headers and footers never overlap content: they are outside the page area by construction. It also means the margin must be large enough to hold them, so I size `margin-bottom` at least as tall as the footer's line height plus a few millimetres of breathing space.

**Q: How do you handle a document that needs a mirrored gutter for binding?**
I use `@page :left` and `@page :right` with swapped left and right margins so the larger margin always faces the spine. Page 1 is a right-hand page by convention, and I make chapters start with `break-before: right` so each opens on a recto. I then check the result by opening the PDF in two-page view with a cover page enabled, because a single-page view hides mirroring errors. For KDP or IngramSpark I also compare the gutter against their minimum for the page count (0.375in for 24 to 150 pages, more beyond that).

**Q: A client says the PDF text is too close to the edge even though you set margins. What do you check?**
First whether a later stylesheet contains another `@page` rule that overrides mine, since `@page` cascades. Second whether the margin is being set on `body` rather than `@page`, which behaves differently on the second and later pages. Third whether the client is printing with "fit to page" or "actual size", because scaling changes the physical margin. Finally I check the page size itself: a US Letter file previewed on A4 paper shifts everything by about 6mm.

## Basic typography for print

Screen CSS habits produce poor print. Pixels are the wrong unit, 16px body text is huge on paper, and line lengths that look fine in a browser window become 120-character lines across A4. This chapter sets up a print type system you can reuse for every document.

### Points, not pixels

```css
body {
  font-family: "Source Serif 4", Georgia, serif;
  font-size: 10.5pt;
  line-height: 1.4;         /* 14.7pt leading */
  color: #1a1a1a;
}
h1 { font-size: 20pt; line-height: 1.2; margin: 0 0 12pt; }
h2 { font-size: 14pt; margin: 18pt 0 6pt; }
p  { margin: 0 0 8pt; text-align: justify; hyphens: auto; }
```

Body text for manuals and reports sits between 9.5pt and 11pt. Leading (line height) of 1.3 to 1.5 keeps lines readable. Use `pt` for font sizes and `mm` for layout, and never `vw` or `rem` tricks that assume a viewport. Unitless `line-height` scales with the font, which is what you want.

### Justification and hyphenation

`text-align: justify` without hyphenation produces rivers of white space, especially in narrow columns. WeasyPrint supports `hyphens: auto` through the Pyphen dictionaries, but only if it knows the language: set `lang="en"` on `<html>` (or on the element). You can tune it with `hyphenate-limit-chars` (minimum word length and minimum characters before and after the hyphen) and `hyphenate-limit-zone`.

```html
<html lang="en">
<style>
  p { text-align: justify; hyphens: auto; hyphenate-limit-chars: 6 3 3; }
</style>
```

Pyphen ships dictionaries for over 40 languages, including `en`, `en-GB`, `de`, `fr` and `ur`. The `lang` attribute also affects language-specific typography in Pango, so set it correctly for Urdu or Arabic documents.

### Widths and measure

A comfortable line holds 55 to 75 characters. On A4 with 20mm margins and 10.5pt text you get about 95, which is too many. Fix it by widening margins, using two columns, or limiting the paragraph width:

```css
.body-text { max-width: 120mm; }
```

### Typographic details WeasyPrint supports

| Property | Notes |
|---|---|
| `font-variant-numeric: tabular-nums` | Aligns digits in rate tables (OpenType `tnum`) |
| `font-variant: small-caps` | Uses real small caps if the font has them |
| `font-feature-settings: "liga" 1` | Ligatures and other OpenType features via HarfBuzz |
| `letter-spacing`, `word-spacing` | Fine for headings; avoid on body text |
| `text-indent` | Classic book-style paragraph indents |
| `orphans`, `widows` | Minimum lines kept at bottom/top of a page (default 2) |
| `text-transform` | Uppercase headings without editing content |
| `text-decoration`, `text-underline-offset` | Underlines are supported; `text-shadow` is not |

### A reusable print base

```css
@page { size: A4; margin: 22mm 20mm 25mm; }
html, body { margin: 0; }
body { font: 10.5pt/1.4 Georgia, serif; }
h1, h2, h3 { font-family: Helvetica, Arial, sans-serif; break-after: avoid; }
p + p { text-indent: 4mm; }
table { font-size: 9.5pt; font-variant-numeric: tabular-nums; }
code, pre { font: 9pt/1.3 "DejaVu Sans Mono", monospace; }
a { color: inherit; text-decoration: none; }
```

`break-after: avoid` on headings stops a heading from being stranded at the bottom of a page with its paragraph on the next. `a { color: inherit }` removes the blue web links that look wrong on paper; if the client needs printed URLs, add `a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 8pt; }`.

> **Interview note:** Interviewers who work in print will ask about leading, measure and widows by name. Being able to say "10.5 on 14.7, 65-character measure, widows and orphans set to 3" signals that you have produced real documents, not just web pages.

### Try It Yourself

```html
<html lang="en">
<style>
  body { font: 10.5pt/1.4 Georgia, serif; margin: 2cm; max-width: 120mm; }
  h1 { font: bold 18pt/1.2 Helvetica, Arial, sans-serif; color: #16A085; }
  p { text-align: justify; hyphens: auto; margin: 0 0 8pt; }
  p + p { text-indent: 4mm; margin-top: 0; }
  .num { font-variant-numeric: tabular-nums; }
</style>
<h1>1.3 Escrow Disbursement Procedure</h1>
<p>Disbursements are released only after the closing package has been reviewed by a second examiner and the funding authorisation has been countersigned by the escrow officer responsible for the file.</p>
<p>Wire instructions must be verified by telephone using a number obtained independently of the email requesting the transfer. Exceptions are documented on form <span class="num">ESC-1042</span>.</p>
```

### Quiz

1. Which unit should you use for print font sizes?
- [ ] `px`
- [x] `pt`
- [ ] `rem`
> Points are the print unit; 1pt is 1/72 inch and every designer and printer speaks in them.

2. What must be present for `hyphens: auto` to work in WeasyPrint?
- [x] A `lang` attribute so Pyphen can pick a dictionary
- [ ] A `@font-face` rule
- [ ] JavaScript
> Hyphenation is language-specific; without `lang` WeasyPrint does not know which dictionary to use.

3. What does `break-after: avoid` on `h2` prevent?
- [ ] Headings from being numbered
- [x] A heading stranded at the bottom of a page
- [ ] Page breaks anywhere in the section
> It asks the layout engine to keep the heading with the content that follows it.

### Exercises

1. **Print base stylesheet** — Write the CSS for a report with 10pt Helvetica body text, 1.45 line height, 13pt bold sub-headings that never separate from the following paragraph, and printed URLs after external links.
<details><summary>Solution</summary>

```css
body { font: 10pt/1.45 Helvetica, Arial, sans-serif; }
h2 { font-size: 13pt; font-weight: bold; break-after: avoid; }
a { color: inherit; text-decoration: none; }
a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 8pt; color: #555; }
```

</details>

2. **Tabular figures** — A rate matrix's dollar amounts do not line up in columns. Give the CSS fix and explain why it works.
<details><summary>Solution</summary>

```css
table td.amount { font-variant-numeric: tabular-nums; text-align: right; }
```

Proportional fonts give "1" less width than "8". `tabular-nums` switches on the OpenType `tnum` feature so every digit has the same advance width, and right alignment lines up the decimal points.

</details>

### Interview Questions

**Q: What print typography settings do you apply to every document you produce?**
Body text at 10 to 11pt with a unitless line height around 1.4, margins that keep the measure near 65 characters, `hyphens: auto` with a `lang` attribute when text is justified, `orphans` and `widows` at 2 or 3, and `break-after: avoid` on headings. I use `pt` for type and `mm` for layout, tabular figures in numeric tables, and I strip link colouring. For a client manual I also switch to the client's brand fonts through `@font-face` so the PDF matches their Word templates.

**Q: Why do justified paragraphs look worse in a PDF than in Word, and how do you fix it?**
Word hyphenates and uses a line-breaking algorithm tuned for print; a naive CSS justify stretches word spaces without hyphenating, so narrow columns show rivers. In WeasyPrint I turn on `hyphens: auto`, set `lang`, and limit hyphenation with `hyphenate-limit-chars: 6 3 3` so short words are never broken. If the column is under 60mm I switch to left alignment, since justification cannot be made to look good at that width without manual intervention.

**Q: How do you keep a heading from ending up alone at the bottom of a page?**
`break-after: avoid` on the heading (or the older `page-break-after: avoid`) tells the engine to move the heading with the first lines of the following block. I combine it with `orphans: 3` on paragraphs so the block after the heading brings at least three lines along. If a heading still strands, it is usually because the following element is a table or a float, so I wrap heading and first block in a `<section>` with `break-inside: avoid` as a last resort.

## Images and assets: base_url and the URL fetcher

Reports contain logos, charts and screenshots; manuals include diagrams. WeasyPrint resolves every `src`, `href` and CSS `url()` against a **base URL**, and getting that right is the single most common support problem beginners hit: the PDF renders but the images are missing and the log says `Failed to load image`.

### How paths resolve

```python
from weasyprint import HTML

# 1. Filename: base_url is the file's directory automatically
HTML("out/report.html").write_pdf("out/report.pdf")

# 2. String: you must supply base_url
HTML(string=html, base_url="/srv/reports/").write_pdf("report.pdf")

# 3. Absolute file URL or absolute path inside the HTML also works
# <img src="file:///srv/reports/assets/logo.png">
```

With `base_url="/srv/reports/"`, an `<img src="assets/logo.png">` resolves to `/srv/reports/assets/logo.png`. The trailing slash matters: `base_url="/srv/reports"` would resolve relative to `/srv/`. On the command line, `-u/--base-url` does the same job when piping HTML from stdin.

### Supported image formats

| Format | Support |
|---|---|
| PNG, JPEG, GIF, WebP, BMP, TIFF | Raster through Pillow |
| SVG | Vector, rendered by WeasyPrint's own SVG module (since v53) |
| `data:` URIs | Base64-inline images work; useful for charts generated in memory |
| PDF | Not supported as `<img>`; convert pages to SVG or PNG first |

Raster images default to 96 dpi, so a 1200px-wide screenshot is 12.5in wide unless you size it. Give every image a CSS width, or set `image-resolution: 300dpi` so a 1200px image occupies 4in on the page and prints crisply.

```css
img { max-width: 100%; height: auto; }
img.screenshot { image-resolution: 300dpi; }
.logo { width: 40mm; }
```

### SVG for charts and logos

Vector graphics stay sharp at any zoom and print size, and an SVG logo is a few kilobytes. Inline SVG inside the HTML works, as does `<img src="chart.svg">`. If you build charts with Matplotlib, save them as SVG and embed them as data URIs so the HTML is self-contained:

```python
import base64, io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(5, 2.5))
ax.bar(["TX", "WY", "CO"], [117, 39, 70])
buf = io.BytesIO()
fig.savefig(buf, format="svg", bbox_inches="tight")
data_uri = "data:image/svg+xml;base64," + base64.b64encode(buf.getvalue()).decode()
img_tag = f'<img src="{data_uri}" style="width:120mm">'
```

Matplotlib SVGs can embed fonts as paths, so the chart text prints even if the server lacks the font.

### Custom URL fetcher

`HTML(url_fetcher=...)` replaces how WeasyPrint loads every resource. This is how you serve images from memory, from S3, or from a database, and how you block anything that is not on a whitelist.

```python
from weasyprint import HTML, default_url_fetcher

ASSETS = {"logo.png": open("brand/logo.png", "rb").read()}

def fetcher(url, timeout=10, ssl_context=None):
    if url.startswith("asset:"):
        name = url[len("asset:"):]
        return {"string": ASSETS[name], "mime_type": "image/png"}
    if url.startswith("file://"):
        return default_url_fetcher(url, timeout, ssl_context)
    raise ValueError(f"Blocked URL: {url}")

HTML(string='<img src="asset:logo.png">', url_fetcher=fetcher).write_pdf("x.pdf")
```

The fetcher returns a dict with either `string` (bytes) or `file_obj`, plus `mime_type` and optionally `encoding`, `redirected_url` and `filename`. The signature gained `ssl_context` in v58; accept it with a default so the code works across versions.

> **Warning:** Large raster images are the usual reason a 20-page report becomes a 40MB PDF. WeasyPrint embeds JPEGs as-is and re-encodes PNGs losslessly. Pass `optimize_images=True`, `jpeg_quality=80` and `dpi=150` to `write_pdf()` (v53 and later) to downsample screenshots for a review copy while keeping the print master untouched.

### Try It Yourself

```html
<style>
  body { font-family: Arial, sans-serif; margin: 2cm; }
  .letterhead { display: flex; align-items: center; gap: 8mm; border-bottom: 1px solid #16A085; padding-bottom: 4mm; }
  .letterhead svg { width: 22mm; height: 22mm; }
  .letterhead .name { font-size: 16pt; font-weight: bold; color: #16A085; }
  .letterhead .addr { font-size: 9pt; color: #555; }
</style>
<div class="letterhead">
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#16A085"/>
    <text x="50" y="62" font-size="36" text-anchor="middle" fill="#fff" font-family="Arial">AR</text>
  </svg>
  <div>
    <div class="name">Ali Raza Document Services</div>
    <div class="addr">Lahore, Pakistan - Inline SVG logos stay sharp at any print size</div>
  </div>
</div>
<p>Replace the inline SVG with <code>&lt;img src="logo.svg"&gt;</code> and set <code>base_url</code> when rendering from a string.</p>
```

### Quiz

1. An `<img src="logo.png">` is missing from a PDF rendered from `HTML(string=...)`. What is the most likely cause?
- [x] No `base_url` was given, so the relative path could not be resolved
- [ ] PNG is not supported
- [ ] Images need `optimize_images=True`
> Strings have no location; supply `base_url` pointing at the assets directory.

2. At what resolution does WeasyPrint place a raster image by default?
- [ ] 72 dpi
- [x] 96 dpi
- [ ] 300 dpi
> CSS pixels are 1/96in, so a 960px image is 10in wide unless sized or given `image-resolution`.

3. Which option lets you serve images from memory or block remote URLs?
- [ ] `stylesheets=`
- [x] `url_fetcher=`
- [ ] `media_type=`
> A custom fetcher intercepts every resource request and returns bytes or raises.

### Exercises

1. **Fix a base URL** — The HTML string contains `<link rel="stylesheet" href="css/print.css">` and `<img src="img/logo.png">`, and the files live under `/srv/app/static/`. Write the rendering call.
<details><summary>Solution</summary>

```python
from weasyprint import HTML
HTML(string=html, base_url="/srv/app/static/").write_pdf("out.pdf")
```

The trailing slash ensures `css/print.css` resolves to `/srv/app/static/css/print.css`.

</details>

2. **Whitelist fetcher** — Write a `url_fetcher` that allows only `file://` URLs under `/srv/app/static/` and raises for everything else.
<details><summary>Solution</summary>

```python
from weasyprint import default_url_fetcher

def safe_fetcher(url, timeout=10, ssl_context=None):
    if url.startswith("file:///srv/app/static/"):
        return default_url_fetcher(url, timeout, ssl_context)
    raise ValueError(f"Blocked: {url}")
```

</details>

3. **Smaller review copy** — Write a `write_pdf()` call that downsamples images to 150 dpi at JPEG quality 75.
<details><summary>Solution</summary>

```python
HTML("report.html").write_pdf("review.pdf", optimize_images=True, jpeg_quality=75, dpi=150)
```

</details>

### Interview Questions

**Q: How does WeasyPrint decide the printed size of an image?**
It uses the CSS box: explicit `width`/`height`, or the image's intrinsic size at the `image-resolution` (96dpi by default) constrained by `max-width`. A 2400px screenshot with no CSS is therefore 25in wide and gets clipped. I always set `img { max-width: 100% }` and use `image-resolution: 300dpi` for screenshots that should print at their native sharpness, which makes a 2400px image exactly 8in. For SVG the viewBox and `width` attributes define the intrinsic size and vector output stays crisp at any scale.

**Q: How do you keep PDFs small when reports contain many screenshots?**
I size images so the embedded pixels match the printed size at 150 to 200dpi rather than shipping 4K captures, and I let `write_pdf(optimize_images=True, jpeg_quality=80, dpi=150)` downsample for review copies. Charts go in as SVG, which is tiny and sharp. I keep the print master unoptimised because printers want 300dpi, and I generate the two variants from one `render()` call. In one Fiverr project this took a 96-page training manual from 58MB to 9MB without visible loss on screen.

**Q: What is the security concern with rendering user-provided HTML, and how does the URL fetcher help?**
WeasyPrint fetches whatever `src` and `url()` point to, including internal network addresses and local files, so untrusted HTML can be used for server-side request forgery or to read files like `/etc/passwd` into an image or attachment. A custom `url_fetcher` is the control point: it receives every URL and can allow only a whitelist of local asset paths or a specific CDN, raising for anything else. I combine that with HTML sanitisation and run the renderer in a container with no network access.

# LEVEL: Intermediate

## Page breaks, orphans and widows

A web page is one infinite column; a PDF is a stack of fixed boxes. Controlling where the stack is cut is what makes a document look produced rather than dumped. CSS gives you three families of properties: **forced breaks**, **avoided breaks**, and **line-level protection** (orphans and widows).

### Forcing a break

```css
h1 { break-before: page; }          /* every chapter starts on a new page */
.cover { break-after: page; }
section.appendix { break-before: right; }   /* start on a right-hand (recto) page */
```

`break-before` and `break-after` accept `auto`, `avoid`, `page`, `left`, `right`, `recto`, `verso` and, inside multi-column layouts, `column`. `right` inserts a blank page if needed so the section opens on an odd-numbered page, which is how printed manuals and books behave. The older aliases `page-break-before`, `page-break-after` and `page-break-inside` still work, and many templates use them because Chrome supported them first.

### Avoiding a break

```css
tr, figure, .signature-block { break-inside: avoid; }
h2, h3 { break-after: avoid; }
```

`break-inside: avoid` keeps a box on one page if it fits on one page at all. If the box is taller than the page area it must break anyway. `break-after: avoid` on headings is the rule that stops a heading from being the last line on a page.

### Orphans and widows

An **orphan** is the first line of a paragraph left alone at the bottom of a page; a **widow** is the last line alone at the top of the next. The properties set the minimum number of lines that must stay together on each side of a break. WeasyPrint's default for both is 2, matching the CSS spec.

```css
p { orphans: 3; widows: 3; }
```

Higher values give cleaner pages but push more text to the next page, which can cascade through a long document. Three is the common compromise for manuals; two is fine for internal reports.

### The break cascade

| Situation | What WeasyPrint does |
|---|---|
| Element with `break-before: page` at top of a page | No extra blank page (breaks collapse) |
| Two consecutive forced breaks (`break-after: page` then `break-before: page`) | Collapsed into one break |
| `break-inside: avoid` on a block taller than the page | Ignored; the block breaks |
| `break-before: right` when the current page is already right | A blank `:blank` page is inserted |
| Table row with `break-inside: avoid` | The row moves whole to the next page |

### Debugging breaks

When a break lands somewhere strange, the usual causes are margins and floats. Vertical margins do not collapse across a page break, so a `margin-top` on the first block of a page adds visible space; use `:first-child` or `margin-bottom` on the previous block instead. A float that reaches the page bottom can push the next block down unexpectedly; `clear: both` before the block fixes it.

```css
h1 { break-before: page; margin-top: 0; }   /* no gap at the top of the new page */
```

A practical technique is to render and log the page where every `h1` lands, using the `Document.pages` bookmarks (each page lists the bookmarks it contains), so you can diff page assignments between template versions.

```python
from weasyprint import HTML
doc = HTML("manual.html").render()
for n, page in enumerate(doc.pages, 1):
    for level, label, target, state in page.bookmarks:
        if level == 1:
            print(f"page {n}: {label}")
```

> **Tip:** Do not sprinkle `break-inside: avoid` on large containers "to be safe". A `<section>` that is 1.5 pages long cannot avoid breaking, and the engine will spend time trying before it gives up; on a 700-page handbook that adds seconds. Apply it to small units: rows, figures, signature blocks, callouts.

### Try It Yourself

```html
<!-- Page breaks only show in WeasyPrint; the preview shows the structure. -->
<style>
  @page { size: A4; margin: 20mm; }
  body { font: 10.5pt/1.4 Georgia, serif; }
  h1 { break-before: page; margin-top: 0; color: #16A085; }
  h2 { break-after: avoid; }
  p { orphans: 3; widows: 3; }
  .callout { break-inside: avoid; border-left: 4px solid #16A085; padding: 4mm; background: #f2faf8; }
</style>
<h1>Chapter 2 - Quality Checking</h1>
<h2>2.1 Sampling</h2>
<p>Each agent's output is sampled at 5 percent per shift. The sample is drawn by the QC lead using the file ID list exported from the tracker.</p>
<div class="callout">This callout will never split across two pages because of <code>break-inside: avoid</code>.</div>
<h1>Chapter 3 - Escalations</h1>
<p>Chapter 3 begins on a new page in the PDF.</p>
```

### Quiz

1. Which value of `break-before` starts a chapter on an odd-numbered page?
- [ ] `page`
- [x] `right`
- [ ] `odd`
> `right` (or `recto`) inserts a blank page when needed so the element opens on a right-hand page.

2. What is a widow?
- [ ] The first line of a paragraph left at the bottom of a page
- [x] The last line of a paragraph alone at the top of a page
- [ ] A heading without a following paragraph
> Widows are at the top of the next page; orphans are at the bottom of the previous one.

3. What happens to `break-inside: avoid` on a box taller than a page?
- [x] It is ignored and the box breaks anyway
- [ ] The box is scaled down to fit
- [ ] Rendering fails
> The engine can only honour it when the box fits on one page.

### Exercises

1. **Chapter rules** — Write CSS so every `h1` starts on a right-hand page with no top gap, sub-headings never strand, and paragraphs keep at least three lines on each side of a break.
<details><summary>Solution</summary>

```css
h1 { break-before: right; margin-top: 0; }
h2, h3 { break-after: avoid; }
p { orphans: 3; widows: 3; }
```

</details>

2. **Log chapter start pages** — Using `Document.pages` and each page's `bookmarks`, print `chapter title -> page number` for all level-1 bookmarks.
<details><summary>Solution</summary>

```python
from weasyprint import HTML
doc = HTML("manual.html").render()
for n, page in enumerate(doc.pages, 1):
    for level, label, target, state in page.bookmarks:
        if level == 1:
            print(f"{label} -> {n}")
```

</details>

### Interview Questions

**Q: Explain orphans and widows and what values you use.**
Orphans are the minimum lines of a paragraph that must stay at the bottom of a page; widows are the minimum at the top of the next. The CSS default and WeasyPrint's default is 2, so a single stranded line never happens by default. For client manuals I raise both to 3 because a two-line fragment still looks broken in a justified column, and I accept that this pushes slightly more text forward. For dense internal reports I leave 2 so the page count stays predictable.

**Q: A heading keeps appearing at the bottom of a page. What do you do?**
I put `break-after: avoid` on the heading, which makes the engine move it with the following block. If it still strands, the following element is usually a table or figure that itself has `break-before: page` or a float in the way, so I inspect what follows. As a final measure I wrap the heading and the first block in a container with `break-inside: avoid`, keeping the container small so the rule can actually be honoured.

**Q: Why does a chapter that starts with `break-before: page` sometimes show a gap at the top of the new page?**
Because CSS margins do not collapse across a page break: the heading's `margin-top` is still applied at the top of the new page even though there is nothing above it. I set `margin-top: 0` on elements that force page breaks and put spacing on the element before them instead. The same effect explains a blank first line under a running header in some templates.

## Headers and footers with margin boxes

Page headers and footers live in the sixteen **margin boxes** defined by CSS Paged Media. They are not elements in your HTML; they are generated by CSS inside the `@page` rule, so every page gets them automatically, including pages created by overflow.

### The sixteen boxes

```text
+-------------+-------------+--------------+-------------+--------------+
| top-left-   | top-left    | top-center   | top-right   | top-right-   |
| corner      |             |              |             | corner       |
+-------------+-------------+--------------+-------------+--------------+
| left-top    |                                          | right-top    |
| left-middle |               page area                  | right-middle |
| left-bottom |                                          | right-bottom |
+-------------+-------------+--------------+-------------+--------------+
| bottom-left-| bottom-left | bottom-center| bottom-right| bottom-right-|
| corner      |             |              |             | corner       |
+-------------+-------------+--------------+-------------+--------------+
```

The four corner boxes are the intersections of the margins; the other twelve sit along the edges. Each is a block box with its own `content`, font, colour, borders, background and `vertical-align`. The top and bottom boxes are as tall as the page margin, which is why the margin must be big enough.

### A basic header and footer

```css
@page {
  size: A4;
  margin: 25mm 20mm 20mm 20mm;
  @top-left { content: "Escrow Operations Manual"; font: 9pt Helvetica; color: #555; }
  @top-right { content: "Rev 3.2 - September 2026"; font: 9pt Helvetica; color: #555; }
  @bottom-center { content: "Page " counter(page); font: 9pt Helvetica; }
  @bottom-right { content: "Confidential"; font: 8pt Helvetica; color: #999; }
}
```

The `content` property is required; without it a margin box is empty. Text, `counter()`, `string()`, `attr()` on the root, `url()` images and the `element()` function (next chapters) can all be combined.

### Removing the header from the first page

```css
@page :first {
  @top-left { content: none; }
  @top-right { content: none; }
}
```

Cover pages should not carry running headers. `:first` applies only to the very first page of the document; for covers on later named pages use named page rules (Advanced level).

### Borders, backgrounds and images

Margin boxes can carry a rule line under the header or a logo in the corner.

```css
@page {
  @top-center {
    content: url("logo.svg");
    width: 30mm;
    vertical-align: bottom;
    border-bottom: 0.5pt solid #16A085;
    padding-bottom: 2mm;
  }
}
```

`vertical-align` positions content within the margin box height: `top`, `middle` and `bottom`. Give a top box `vertical-align: bottom` and a bottom box `vertical-align: top` so the header hugs the content rather than the paper edge.

### Sizing behaviour

| Box | Width | Height |
|---|---|---|
| `@top-center`, `@bottom-center` | Shares horizontal space with left/right boxes; centered | Margin height |
| `@top-left`, `@top-right` | Flexible; shrinks to content unless `width` is set | Margin height |
| Corner boxes | Fixed: margin-left by margin-top, etc. | Fixed |
| `@left-middle`, `@right-middle` | Margin width | Flexible |

If both `@top-left` and `@top-right` have long text the center box gets squeezed; give the side boxes explicit `width` values or shorten the text.

> **Warning:** Chrome's print engine only started supporting margin boxes recently and headless Chrome versions still in wide use ignore them completely. If a client compares your WeasyPrint PDF with "Print to PDF" from their browser, the headers will differ. Tell them up front that the PDF is generated by a paged-media engine.

### Try It Yourself

```html
<!-- Margin boxes render only in WeasyPrint. The preview shows the page content. -->
<style>
  @page {
    size: A4; margin: 25mm 20mm 22mm 20mm;
    @top-left { content: "Escrow Operations Manual"; font: 9pt Helvetica, Arial; color: #555; vertical-align: bottom; padding-bottom: 2mm; }
    @top-right { content: "Rev 3.2"; font: 9pt Helvetica, Arial; color: #555; vertical-align: bottom; padding-bottom: 2mm; }
    @bottom-center { content: "Page " counter(page); font: 9pt Helvetica, Arial; vertical-align: top; }
    @bottom-right { content: "Confidential"; font: 8pt Helvetica, Arial; color: #999; vertical-align: top; }
  }
  @page :first { @top-left { content: none; } @top-right { content: none; } }
  body { font: 10.5pt/1.4 Georgia, serif; }
</style>
<h1>Escrow Operations Manual</h1>
<p>In WeasyPrint every page after this one carries the running header and a centred page number.</p>
```

### Quiz

1. How many margin boxes does CSS Paged Media define?
- [ ] 8
- [x] 16
- [ ] 12
> Four corners plus three boxes on each of the four edges.

2. What must a margin box have to render anything?
- [x] A `content` value
- [ ] A `width`
- [ ] A `position`
> Margin boxes are generated content; without `content` they are empty.

3. Which selector removes the header from the cover page only?
- [ ] `@page :blank`
- [x] `@page :first`
- [ ] `@page :cover`
> `:first` matches the first page of the document.

### Exercises

1. **Three-part footer** — Write `@page` rules for a footer with the document title at left, "Page N" in the centre and the print date at right, all in 8pt grey Helvetica, and nothing on the first page.
<details><summary>Solution</summary>

```css
@page {
  margin-bottom: 20mm;
  @bottom-left { content: "Title Production SOP"; font: 8pt Helvetica; color: #666; }
  @bottom-center { content: "Page " counter(page); font: 8pt Helvetica; color: #666; }
  @bottom-right { content: "Printed 2026-09-16"; font: 8pt Helvetica; color: #666; }
}
@page :first {
  @bottom-left { content: none; }
  @bottom-center { content: none; }
  @bottom-right { content: none; }
}
```

</details>

2. **Header rule line** — Add a 0.5pt teal line under the header that spans the full page width.
<details><summary>Solution</summary>

```css
@page {
  @top-left, @top-center, @top-right { border-bottom: 0.5pt solid #16A085; }
}
```

WeasyPrint accepts a comma-separated list of margin box names; borders on all three top boxes join into a continuous line across the page area width. To extend into the corners add the same border to `@top-left-corner` and `@top-right-corner`.

</details>

### Interview Questions

**Q: How do headers and footers work in WeasyPrint compared with Word?**
Word stores header content in a separate story attached to a section; WeasyPrint generates it from CSS margin boxes attached to the `@page` rule. Both repeat on every page, but the CSS approach is declarative: `@bottom-center { content: "Page " counter(page) }` gives numbering, and `string()` or `element()` pull chapter titles from the body. Section-specific headers map to named pages (`page: appendix` plus `@page appendix { ... }`). The margin box lives inside the page margin, so the margin must be tall enough, which is the equivalent of Word's "Header from top" distance.

**Q: A footer text is being clipped or overlapping the body. Why?**
The footer lives in `margin-bottom`, so if the margin is 10mm and the footer is a 9pt line with padding, it has no room and either clips or looks jammed against the text. I set `margin-bottom` to at least the footer height plus a few millimetres, use `vertical-align: top` so it sits near the content, and check that no later stylesheet has overridden the `@page` margin. Overlap with the body is never a real overlap, because margin boxes are outside the page area; it always turns out to be a margin that is too small.

**Q: Can margin boxes contain images or HTML?**
Images yes, through `content: url(logo.svg)`. Arbitrary HTML only through running elements: mark an element in the body with `position: running(name)` and place it with `content: element(name)` in the margin box. That is how I put a formatted letterhead with a logo, address block and rule line into `@top-center`, since a plain `content` string cannot hold markup.

## Page counters: "Page x of y"

CSS counters drive page numbering. Two are predefined for paged media: `page`, the current page number, and `pages`, the total. WeasyPrint supports both plus the full `counter-reset`, `counter-increment` and `counters()` machinery, so you can number chapters, figures, tables and sections without editing the HTML.

### Page x of y

```css
@page {
  @bottom-center { content: "Page " counter(page) " of " counter(pages); }
}
```

`counter(pages)` is resolved after layout, so the total is correct even though the CSS is evaluated before pagination finishes. The classic browser workaround of JavaScript counting pages does not exist here; this one line is the whole feature.

### Counter styles

`counter(page, lower-roman)` gives `i, ii, iii`, which is how front matter is numbered in books. Supported styles include `decimal`, `decimal-leading-zero`, `lower-roman`, `upper-roman`, `lower-alpha`, `upper-alpha`, `lower-greek` and others from CSS Counter Styles. You can define your own with `@counter-style`.

```css
@counter-style dashed {
  system: extends decimal;
  prefix: "- ";
  suffix: " -";
}
@page { @bottom-center { content: counter(page, dashed); } }
```

### Resetting the page counter

Front matter numbered in roman, body restarting at 1: reset the counter on the element that starts the body.

```css
@page front { @bottom-center { content: counter(page, lower-roman); } }
@page body  { @bottom-center { content: counter(page); } }

.front-matter { page: front; }
.main { page: body; counter-reset: page 1; }
```

`counter-reset: page 1` on the first element of the body pages restarts numbering at 1. Combine it with named pages (Advanced level) so the two parts use different footer styles. `counter(pages)` always counts every physical page, so "of y" would include the front matter; for a body-only total, wrap the body in an element and count the pages of that element with a custom counter instead, or accept the physical total.

### Numbering chapters, sections and figures

```css
body { counter-reset: chapter; }
h1 { counter-increment: chapter; counter-reset: section figure; }
h1::before { content: "Chapter " counter(chapter) ". "; }
h2 { counter-increment: section; }
h2::before { content: counter(chapter) "." counter(section) " "; }
figcaption { counter-increment: figure; }
figcaption::before { content: "Figure " counter(chapter) "." counter(figure) ": "; font-weight: bold; }
```

`counters(section, ".")` (plural) concatenates nested counters of the same name with a separator, which is ideal for nested lists in legal documents: `1.2.3`.

### Where counters can appear

| Location | Example |
|---|---|
| Margin boxes | `@bottom-right { content: counter(page) }` |
| `::before` / `::after` | `h1::before { content: counter(chapter) }` |
| Cross-references | `a::after { content: target-counter(attr(href), page) }` |
| `string-set` | `string-set: chapter-no counter(chapter)` |

`target-counter(attr(href), page)` is the star feature for tables of contents: a link to `#sec-3` prints the page number where `#sec-3` lands. Add dotted leaders with `a::after { content: leader(".") target-counter(attr(href), page) }`.

```css
nav.toc a { text-decoration: none; color: inherit; }
nav.toc a::after { content: leader(". ") target-counter(attr(href), page); }
```

> **Interview note:** "How do you build a table of contents with page numbers in HTML-to-PDF?" is a favourite question. The answer is `target-counter()` plus `leader()`; mention that it needs a paged-media engine because Chrome has neither.

### Try It Yourself

```html
<!-- Counters in margin boxes and target-counter() render only in WeasyPrint. Chapter counters preview in the browser. -->
<style>
  @page { size: A4; margin: 20mm; @bottom-center { content: "Page " counter(page) " of " counter(pages); font: 9pt Helvetica, Arial; } }
  body { font: 10.5pt/1.4 Georgia, serif; counter-reset: chapter; }
  h1 { counter-increment: chapter; counter-reset: section; color: #16A085; }
  h1::before { content: "Chapter " counter(chapter) ". "; }
  h2 { counter-increment: section; }
  h2::before { content: counter(chapter) "." counter(section) " "; }
  nav a { display: block; text-decoration: none; color: inherit; }
  nav a::after { content: leader(". ") target-counter(attr(href), page); }
</style>
<nav>
  <a href="#c1">Sampling</a>
  <a href="#c2">Escalations</a>
</nav>
<h1 id="c1">Sampling</h1>
<h2>Daily sample size</h2>
<h2>Selecting files</h2>
<h1 id="c2">Escalations</h1>
<h2>Tier 1</h2>
```

### Quiz

1. Which counter holds the total number of pages?
- [ ] `page-count`
- [x] `pages`
- [ ] `total`
> `counter(pages)` is predefined by CSS Paged Media and resolved after layout.

2. How do you print a TOC entry's page number?
- [x] `content: target-counter(attr(href), page)`
- [ ] `content: counter(page)`
- [ ] `content: attr(page)`
> `target-counter` reads the page counter at the link's target rather than at the link itself.

3. What does `counters(section, ".")` produce?
- [ ] The section count as a decimal
- [x] Nested section numbers joined by dots, such as 1.2.3
- [ ] A page number
> The plural form concatenates all counters of that name in the ancestor chain.

### Exercises

1. **Roman front matter** — Number front-matter pages in lower roman and body pages in decimal starting at 1.
<details><summary>Solution</summary>

```css
@page front { @bottom-center { content: counter(page, lower-roman); } }
@page body  { @bottom-center { content: counter(page); } }
.front-matter { page: front; }
.main { page: body; counter-reset: page 1; }
```

</details>

2. **Numbered figures** — Number figures per chapter as "Figure 2.3".
<details><summary>Solution</summary>

```css
h1 { counter-increment: chapter; counter-reset: figure; }
figcaption { counter-increment: figure; }
figcaption::before { content: "Figure " counter(chapter) "." counter(figure) ": "; }
```

</details>

3. **Cross-reference with page** — Make links of class `xref` print "(see page N)" after their text.
<details><summary>Solution</summary>

```css
a.xref::after { content: " (see page " target-counter(attr(href), page) ")"; }
```

</details>

### Interview Questions

**Q: How do you generate a table of contents with page numbers from HTML?**
I generate the `<nav>` list of anchors from the headings (either in the template or with a small Python pass over the HTML), then use CSS: `a::after { content: leader(".") target-counter(attr(href), page) }`. WeasyPrint resolves the page each anchor lands on after layout and fills in the numbers, with dotted leaders aligned to the right. Because layout and TOC are computed together there is no second pass and no risk of numbers drifting, unlike Word where a TOC must be updated. For a 767-page handbook I also emit PDF bookmarks so the reader has a clickable outline in addition to the printed TOC.

**Q: How do you restart page numbering after the front matter?**
`counter-reset: page 1` on the first element of the body section restarts the physical page counter, and I pair it with named pages so the front matter footer shows lower-roman numerals and the body shows decimals. The one caveat is that `counter(pages)` still counts all physical pages, so "Page 1 of 120" in a body of 112 pages shows the wrong total; if a client insists on a body-only total I compute the number in Python from a first render and inject it, or I drop "of y" from the body footer.

**Q: What is the difference between `counter()` and `counters()`?**
`counter(name)` prints the innermost counter of that name in scope; `counters(name, sep)` prints every counter of that name from the outermost ancestor down, joined by the separator. Nested `<ol>` clauses in a contract use `counters(item, ".")` to produce 3.2.1 automatically, with `counter-reset: item` on each `ol` and `counter-increment: item` on each `li`.

## Fonts, @font-face and embedding

Fonts decide whether the PDF looks like the client's brand or like a fallback. WeasyPrint finds system fonts through fontconfig and loads web fonts through `@font-face`; it then **subsets and embeds** the glyphs actually used, so the PDF renders identically on any machine.

### System fonts

If the font is installed on the machine that runs WeasyPrint, a normal `font-family` works. On Linux, `fc-list | grep -i "Open Sans"` confirms the font is visible to fontconfig. In Docker images this is the first thing to check: `python:slim` ships no fonts at all, so add `fonts-dejavu-core` or copy the brand fonts into `/usr/share/fonts/` and run `fc-cache -f`.

```dockerfile
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz-subset0 fonts-dejavu-core fontconfig \
 && rm -rf /var/lib/apt/lists/*
COPY fonts/ /usr/share/fonts/truetype/brand/
RUN fc-cache -f
RUN pip install weasyprint==62.3
```

### @font-face

```css
@font-face {
  font-family: "Source Serif";
  src: url("fonts/SourceSerif4-Regular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Source Serif";
  src: url("fonts/SourceSerif4-Bold.otf") format("opentype");
  font-weight: 700;
}
body { font-family: "Source Serif", Georgia, serif; }
```

Declare one `@font-face` per weight and style. If you only declare the regular file, bold text is synthesised by Pango (a smeared fake bold) and italics are slanted. The `url()` resolves against the stylesheet's own location, or the `base_url` when the CSS is a string. TTF, OTF, WOFF and WOFF2 all work; WOFF2 is decompressed with the `brotli` package, which is installed as a WeasyPrint dependency.

### FontConfiguration

When you pass CSS as separate `CSS()` objects, WeasyPrint needs a shared registry for the fonts those stylesheets declare. That is `FontConfiguration`.

```python
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

font_config = FontConfiguration()
css = CSS(string="""
  @font-face { font-family: Brand; src: url(fonts/Brand-Regular.ttf); }
  body { font-family: Brand; }
""", font_config=font_config, base_url="/srv/app/static/")
HTML("report.html").write_pdf("report.pdf", stylesheets=[css], font_config=font_config)
```

Pass the same `font_config` to every `CSS()` and to `write_pdf()`. Forgetting it on either side is why `@font-face` "works in the HTML but not in the stylesheet argument". The import path moved to `weasyprint.text.fonts` in v53; earlier versions used `weasyprint.fonts`.

### Embedding and subsetting

WeasyPrint embeds every font it uses. By default it subsets with fontTools, keeping only the glyphs that appear, which shrinks a 2MB CJK font to a few kilobytes. Two options change that:

| Option | Effect |
|---|---|
| `full_fonts=True` (`--full-fonts`) | Embed the whole font file; needed if the PDF will be edited later |
| `hinting=True` (`--hinting`) | Keep hinting instructions for sharper rendering on low-resolution screens; larger files |

Check the result with `pdffonts report.pdf` (from poppler-utils): every row should say `emb yes` and subset fonts show a six-letter prefix like `ABCDEF+SourceSerif4-Regular`.

### Fallback and missing glyphs

Pango falls back per glyph: if the brand font lacks the rupee sign or an Urdu letter, that character is drawn from another installed font. Provide the fallbacks yourself in the font stack (`"Brand", "Noto Sans", "Noto Naskh Arabic", sans-serif`) so the fallback is a deliberate choice rather than whatever fontconfig picks. Run with `-v` to see `Failed to load font` warnings for `@font-face` URLs that could not be fetched.

> **Warning:** Font licences differ for embedding. Most desktop licences permit "preview and print" embedding; some commercial fonts forbid it and set the OS/2 `fsType` flag. WeasyPrint does not check the flag, so it is your job to confirm the client owns a licence that allows PDF embedding before shipping deliverables.

### Try It Yourself

```html
<style>
  @font-face {
    font-family: "Demo Serif";
    src: local("Georgia"), local("Times New Roman"), local("DejaVu Serif");
  }
  body { font-family: "Demo Serif", serif; margin: 2cm; font-size: 12pt; line-height: 1.45; }
  .weights p { margin: 0; }
  .num { font-variant-numeric: tabular-nums; }
</style>
<div class="weights">
  <p style="font-weight:400">Regular: Owner's policy premium $1,234.50</p>
  <p style="font-weight:700">Bold: Owner's policy premium $1,234.50</p>
  <p style="font-style:italic">Italic: Owner's policy premium $1,234.50</p>
  <p class="num">Tabular: 1111.11 vs 8888.88</p>
</div>
<p>In production, point <code>src: url("fonts/...")</code> at real files and declare one <code>@font-face</code> per weight so bold is not synthesised.</p>
```

### Quiz

1. Why declare a separate `@font-face` for bold?
- [x] Otherwise bold is synthesised from the regular face
- [ ] Bold fonts cannot be subset
- [ ] `font-weight` is ignored in print
> Pango fakes bold and italic when the real face is missing, which looks smeared in print.

2. What must be shared between `CSS()` objects and `write_pdf()` for `@font-face` to work?
- [ ] `base_url`
- [x] A `FontConfiguration` instance
- [ ] `media_type`
> The font configuration is the registry where `@font-face` declarations are stored.

3. How do you verify fonts are embedded in the output?
- [ ] Open the PDF in Chrome
- [x] Run `pdffonts file.pdf` and check the `emb` column
- [ ] Check the file size
> `pdffonts` lists every font with embedding and subset status.

### Exercises

1. **Brand font family** — Write `@font-face` rules for Inter in regular, italic, bold and bold italic from WOFF2 files under `fonts/`.
<details><summary>Solution</summary>

```css
@font-face { font-family: Inter; src: url(fonts/Inter-Regular.woff2) format("woff2"); font-weight: 400; font-style: normal; }
@font-face { font-family: Inter; src: url(fonts/Inter-Italic.woff2) format("woff2"); font-weight: 400; font-style: italic; }
@font-face { font-family: Inter; src: url(fonts/Inter-Bold.woff2) format("woff2"); font-weight: 700; font-style: normal; }
@font-face { font-family: Inter; src: url(fonts/Inter-BoldItalic.woff2) format("woff2"); font-weight: 700; font-style: italic; }
```

</details>

2. **Shared font config** — Fix this code so the font declared in the stylesheet is used: `HTML("r.html").write_pdf("r.pdf", stylesheets=[CSS("brand.css")])`.
<details><summary>Solution</summary>

```python
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

fc = FontConfiguration()
HTML("r.html").write_pdf("r.pdf", stylesheets=[CSS("brand.css", font_config=fc)], font_config=fc)
```

</details>

### Interview Questions

**Q: How does WeasyPrint handle fonts, and what breaks most often?**
It discovers installed fonts through fontconfig and loads `@font-face` files through its own fetcher, shapes text with Pango and HarfBuzz, then subsets the used glyphs with fontTools and embeds them. What breaks most often: a Docker image with no fonts at all, a `@font-face` URL that does not resolve because `base_url` is wrong, a `FontConfiguration` not shared between `CSS()` and `write_pdf()`, and bold declared only by `font-weight` with no bold face, which produces synthetic bold. I check with `-v` for load warnings and with `pdffonts` for embedding.

**Q: When would you disable subsetting?**
When the PDF will be edited or have text added later in Acrobat or another tool, because a subset font only contains the glyphs used and editing may need others. Also for some PDF/A validators that complain about certain subset structures, though modern WeasyPrint subsets are compliant. Otherwise subsetting stays on because it cuts file size dramatically and has no effect on print fidelity.

**Q: How do you produce a bilingual English and Urdu SOP correctly?**
I set `lang` per element (`lang="ur"` on Urdu paragraphs), use `direction: rtl` and `unicode-bidi` where needed, and give the font stack an Arabic-script face such as Noto Nastaliq Urdu or Noto Naskh Arabic after the Latin brand font so fallback is controlled. Pango handles shaping and bidi through HarfBuzz, so contextual forms and ligatures render correctly. I verify glyph coverage by rendering a sample paragraph and looking for tofu boxes, and I confirm the font licence permits embedding.

## Tables and repeating headers

Reports are mostly tables: rate matrices, production status by state, QA scores by agent. WeasyPrint's table support is solid: header rows repeat on every page, rows can be kept whole, and both automatic and fixed layout algorithms are implemented.

### Repeating header rows

```html
<table>
  <thead>
    <tr><th>File #</th><th>State</th><th>Examiner</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>TX-2026-04471</td><td>Texas</td><td>S. Malik</td><td>Closed</td></tr>
    <!-- hundreds more rows -->
  </tbody>
  <tfoot>
    <tr><td colspan="4">Continued on next page</td></tr>
  </tfoot>
</table>
```

Rows inside `<thead>` repeat at the top of every page the table spans, and `<tfoot>` rows repeat at the bottom. This is the default behaviour; you do not need `display: table-header-group` (though it is honoured). The last page still shows the `tfoot`, so use it for column totals or a "continued" note only if that reads correctly at the end too.

### Keeping rows intact

```css
tr { break-inside: avoid; }
thead { display: table-header-group; }
tbody tr:nth-child(even) { background: #f4f9f8; }
```

WeasyPrint can split a tall row across pages (useful for a row containing a long paragraph), but for rate tables you usually want each row whole, which `break-inside: avoid` guarantees.

### Layout algorithms

| `table-layout` | Behaviour |
|---|---|
| `auto` (default) | Column widths from content; slow on thousands of rows because every cell is measured |
| `fixed` | Column widths from the first row or `<col>` widths; fast and predictable |

For long production reports use `fixed` with `<colgroup>`:

```html
<style>
  table { table-layout: fixed; width: 100%; border-collapse: collapse; }
  col.file { width: 32mm; } col.state { width: 22mm; }
  td { overflow-wrap: anywhere; }
</style>
<table>
  <colgroup><col class="file"><col class="state"><col><col></colgroup>
  ...
</table>
```

`overflow-wrap: anywhere` prevents a long file number from pushing the column wider than the page. Without it, an unbreakable string overflows and gets clipped at the page edge.

### Borders, spacing and captions

`border-collapse: collapse` gives the single-rule look of Word tables; `separate` with `border-spacing` gives the spaced look. `<caption>` is supported and can be moved below the table with `caption-side: bottom`. Cell `vertical-align`, `padding`, `text-align` and `colspan`/`rowspan` all work as in browsers.

### Wide tables

A rate matrix with fourteen columns will not fit a portrait A4 page. Options, in order of preference:

1. Put the table on a landscape named page: `.matrix { page: wide; } @page wide { size: A4 landscape; }`.
2. Reduce font size and padding for that table only: `table.matrix { font-size: 8pt; } .matrix td { padding: 1pt 3pt; }`.
3. Rotate the table with `transform: rotate(90deg)`, which WeasyPrint supports but which complicates page breaking, so reserve it for one-page tables.

### Performance note

A 10,000-row table in auto layout can take a minute because of cell measurement and the page-breaking search. Use `table-layout: fixed`, avoid `break-inside: avoid` on `tbody`, and split very long tables into chunks per section so the layout engine handles smaller units. The Expert level covers measuring this.

> **Tip:** Right-align numeric columns and set `font-variant-numeric: tabular-nums`. Combined with `border-collapse` and 2 to 3pt cell padding, that alone turns a browser-looking table into a print-looking one.

### Try It Yourself

```html
<style>
  @page { size: A4; margin: 18mm; }
  body { font: 9.5pt/1.3 Helvetica, Arial, sans-serif; }
  table { table-layout: fixed; width: 100%; border-collapse: collapse; }
  th, td { border: 0.5pt solid #888; padding: 2pt 4pt; }
  th { background: #16A085; color: #fff; text-align: left; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  tr { break-inside: avoid; }
  tbody tr:nth-child(even) { background: #f2faf8; }
  caption { caption-side: bottom; font-size: 8pt; color: #555; text-align: left; padding-top: 2pt; }
</style>
<table>
  <caption>Source: production tracker, week 37. The header row repeats on every page in WeasyPrint.</caption>
  <colgroup><col style="width:34mm"><col style="width:24mm"><col><col style="width:22mm"></colgroup>
  <thead><tr><th>File #</th><th>State</th><th>Examiner</th><th>Premium</th></tr></thead>
  <tbody>
    <tr><td>TX-2026-04471</td><td>Texas</td><td>S. Malik</td><td class="n">1,234.50</td></tr>
    <tr><td>WY-2026-00318</td><td>Wyoming</td><td>R. Khan</td><td class="n">842.00</td></tr>
    <tr><td>CO-2026-01102</td><td>Colorado</td><td>A. Raza</td><td class="n">1,015.75</td></tr>
  </tbody>
  <tfoot><tr><th colspan="3">Total</th><td class="n" style="font-weight:bold">3,092.25</td></tr></tfoot>
</table>
```

### Quiz

1. What happens to rows inside `<thead>` when a table spans pages?
- [x] They repeat at the top of every page
- [ ] They appear only on the first page
- [ ] They are moved to the last page
> Repeating header groups are built into WeasyPrint's table layout.

2. Which setting makes a 5,000-row table lay out fastest?
- [ ] `border-collapse: collapse`
- [x] `table-layout: fixed`
- [ ] `break-inside: avoid` on `tbody`
> Fixed layout takes widths from the first row, avoiding measuring every cell.

3. Why add `overflow-wrap: anywhere` to cells in a fixed-layout table?
- [ ] To repeat headers
- [x] So long unbreakable strings wrap instead of overflowing the column
- [ ] To enable `colspan`
> Fixed columns cannot grow, so unbreakable text must be allowed to wrap.

### Exercises

1. **Landscape rate matrix** — Put a wide table on landscape pages while the rest of the document stays portrait.
<details><summary>Solution</summary>

```css
@page { size: A4; margin: 20mm; }
@page wide { size: A4 landscape; margin: 15mm; }
.matrix-page { page: wide; }
```

```html
<section class="matrix-page"><table class="matrix">...</table></section>
```

</details>

2. **Continued footer** — Show "continued" at the bottom of every page of a long table except the last, using only CSS and HTML.
<details><summary>Solution</summary>

Pure CSS cannot detect the last page of a table, so keep the `tfoot` for totals and instead put "(continued)" in the running header of a named page while the table is on it:

```css
.long-table { page: tbl; }
@page tbl { @top-right { content: "Production report (continued)"; font: 8pt Helvetica; } }
@page tbl:first { @top-right { content: none; } }
```

Named page pseudo-classes such as `tbl:first` apply to the first page of that named group, so the note appears only on continuation pages.

</details>

### Interview Questions

**Q: How do you make a long table print correctly across pages?**
Wrap the header row in `<thead>` so it repeats, put totals in `<tfoot>`, apply `tr { break-inside: avoid }` so rows do not split, and use `table-layout: fixed` with `<colgroup>` widths for predictability and speed. Add `overflow-wrap: anywhere` so long identifiers wrap, right-align numbers with tabular figures, and use zebra striping for readability. For a 14-column matrix I move that section to a landscape named page rather than shrinking the font below 8pt.

**Q: Why is table layout slow, and how do you speed it up?**
Auto layout measures every cell in every column to compute widths, which is O(rows x columns) text shaping before layout even starts, and the page-breaking search then re-measures rows near each page boundary. Fixed layout removes the measurement step, and avoiding `break-inside: avoid` on large groups removes retries. In one 400-page status report, switching to fixed layout and chunking the table per state cut render time from about 90 seconds to under 20.

**Q: Does WeasyPrint support `rowspan`, nested tables and `caption`?**
Yes to all three. `rowspan` and `colspan` behave as in browsers, nested tables lay out inside cells, and `caption` with `caption-side` is supported. The practical limits are page breaking: a cell with a `rowspan` that crosses a page boundary is repeated correctly but can look odd, and nested tables inside `break-inside: avoid` rows make the layout engine work harder. I flatten nested tables into CSS grid-like cell content where possible.

## Multi-column, Flexbox and Grid support notes

WeasyPrint implements much of modern layout, but its coverage is uneven and it changes by version. Knowing what works lets you write templates that render the first time instead of debugging a layout that Chrome shows perfectly and WeasyPrint shows collapsed.

### Multi-column layout

CSS Multi-column is well supported and is the right tool for newsletter-style or glossary content.

```css
.glossary { columns: 2; column-gap: 8mm; column-rule: 0.5pt solid #ccc; }
.glossary dt { break-after: avoid; font-weight: bold; }
.glossary dd { break-inside: avoid; margin: 0 0 4pt; }
h2.span { column-span: all; }
```

`columns`, `column-count`, `column-width`, `column-gap`, `column-rule`, `column-span: all`, `column-fill` and `break-before/after/inside: column` all work. Columns balance by default (`column-fill: balance`); use `column-fill: auto` when you want the first column filled completely before the second.

### Flexbox

Flexbox has been supported since v42 for the common cases: `display: flex`, `flex-direction`, `justify-content`, `align-items`, `flex-grow`/`flex-shrink`/`flex-basis` and `flex-wrap`. Version 65 rewrote large parts of the implementation, fixing many alignment and sizing bugs. Flex containers do not split across pages the way blocks do, so use flex for **within-page components**: letterhead rows, key-value summary strips, signature blocks side by side.

```css
.kpis { display: flex; gap: 6mm; }
.kpi { flex: 1; border: 0.5pt solid #ddd; padding: 3mm; }
```

### Grid

CSS Grid landed in v62 (2024) with support for explicit tracks, `grid-template-columns/rows`, `grid-area` placement, gaps and line-based placement. `repeat()`, `minmax()`, `auto-fill` and subgrid coverage have improved in later releases but remain the area most likely to differ from Chrome. Treat Grid like flex: excellent for a cover page or a dashboard-style summary page that fits on one sheet, risky for content that must break across pages.

```css
.cover { display: grid; grid-template-rows: 1fr auto 1fr; height: 257mm; }
```

### Support matrix

| Feature | Status | Notes |
|---|---|---|
| Floats, `clear` | Full | Including floats intruding across page breaks |
| `position: absolute` | Full | Relative to the page or positioned ancestor |
| `position: fixed` | Full | Repeated on every page, handy for watermarks |
| `position: sticky` | Not supported | Meaningless in paged media anyway |
| Multi-column | Full | Balanced columns, spanning headings |
| Flexbox | Good | One page per container; v65+ much more accurate |
| Grid | Basic to good | Since v62; check the release notes for your version |
| `transform` | Full | 2D transforms including rotate and scale |
| `box-shadow`, `text-shadow`, `filter` | Not supported | Silently ignored |
| `calc()`, custom properties (`var()`) | Full | Since v53 for `calc()`, v65 for `var()` in more contexts |
| `object-fit`, `object-position` | Full | For images |
| `writing-mode` vertical | Partial | Horizontal only in practice |

### Writing resilient templates

- Use block flow for anything that spans pages; use flex and grid only for components that fit on one page.
- Prefer `width` in `mm` and `%` over viewport units, which have no viewport to refer to (WeasyPrint treats `vw` and `vh` relative to the page size, but it confuses readers).
- Test with the real engine early. A template that looks right in Chrome is a hypothesis, not a result.
- Check the `-v` log for `Ignored` warnings, which list unsupported properties and values.

> **Warning:** `position: fixed` repeats the element on every page, which is exactly what you want for a "DRAFT" watermark and exactly what you do not want when a web template uses a fixed navigation bar. Override it in the print stylesheet with `nav { display: none }`.

### Try It Yourself

```html
<style>
  body { font: 10pt/1.35 Helvetica, Arial, sans-serif; margin: 2cm; }
  .kpis { display: flex; gap: 6mm; margin-bottom: 8mm; }
  .kpi { flex: 1; border: 0.5pt solid #ccc; border-top: 3pt solid #16A085; padding: 3mm; }
  .kpi b { display: block; font-size: 18pt; }
  .glossary { columns: 2; column-gap: 8mm; column-rule: 0.5pt solid #ccc; }
  .glossary dt { font-weight: bold; break-after: avoid; }
  .glossary dd { margin: 0 0 4pt; break-inside: avoid; }
</style>
<div class="kpis">
  <div class="kpi"><b>226</b>Files closed</div>
  <div class="kpi"><b>97.8%</b>QA pass rate</div>
  <div class="kpi"><b>1.6 d</b>Avg turnaround</div>
</div>
<dl class="glossary">
  <dt>Abstract</dt><dd>A condensed history of the title to a parcel of land.</dd>
  <dt>Chain of title</dt><dd>The sequence of historical transfers of title to a property.</dd>
  <dt>Encumbrance</dt><dd>A claim or liability attached to real property.</dd>
  <dt>Vesting</dt><dd>The way title is held by the current owner.</dd>
</dl>
```

### Quiz

1. Which layout mode should you use for content that must break across pages?
- [x] Normal block flow
- [ ] Flexbox
- [ ] Grid
> Flex and grid containers are laid out as units; block flow is what the pagination engine splits.

2. What does `position: fixed` do in WeasyPrint?
- [ ] It is ignored
- [x] It repeats the element on every page
- [ ] It pins the element to the first page
> In paged media a fixed element is drawn on each page, which is useful for watermarks.

3. From which version does WeasyPrint support CSS Grid?
- [ ] v42
- [ ] v53
- [x] v62
> Grid arrived in v62 (2024); flexbox has existed since v42.

### Exercises

1. **Two-column glossary with spanning headings** — Write CSS for a two-column definition list where `h2` headings span both columns.
<details><summary>Solution</summary>

```css
.glossary { columns: 2; column-gap: 8mm; }
.glossary h2 { column-span: all; }
.glossary dt { break-after: avoid; }
.glossary dd { break-inside: avoid; }
```

</details>

2. **Draft watermark** — Add a diagonal grey "DRAFT" watermark to every page using only CSS.
<details><summary>Solution</summary>

```css
.watermark {
  position: fixed; top: 45%; left: 20%;
  font: bold 72pt Helvetica; color: rgba(0,0,0,0.08);
  transform: rotate(-30deg);
}
```

```html
<div class="watermark">DRAFT</div>
```

</details>

### Interview Questions

**Q: What CSS layout features does WeasyPrint lack, and how do you design around them?**
No JavaScript, no `position: sticky`, no shadows or filters, and flex and grid containers do not break across pages. I design around that by keeping page-spanning content in block flow and tables, using flex or grid only for single-page components such as covers, KPI strips and letterheads, replacing shadows with borders, and pre-rendering anything JS-driven as SVG. I also read the release notes for the pinned version because grid and flex coverage have changed a lot between v62 and v66.

**Q: How would you build a newsletter-style two-column layout that flows across pages?**
CSS multi-column: `columns: 2` on the article container, with `column-gap` and `column-rule`, `column-span: all` on section headings, and `break-inside: avoid` on figures. Multi-column content paginates naturally in WeasyPrint, whereas a flex or grid two-column layout would be treated as a single unbreakable container. I keep the measure readable by making sure each column is at least 60mm wide and I turn on hyphenation.

**Q: How do you check which properties WeasyPrint ignored in a template?**
Run with `-v` (or configure the `weasyprint` logger at `INFO`) and look for `Ignored` messages, which name the property, the value and the stylesheet line. I keep that log clean in CI by treating new `Ignored` lines as a review item, because they usually mean a designer added a web-only property that will silently do nothing in the PDF.

# LEVEL: Advanced

## Running elements and string-set for chapter titles

A running header that shows the current chapter title is the mark of a professionally produced manual. CSS Generated Content for Paged Media gives two mechanisms: **named strings** (`string-set` and `string()`) for text, and **running elements** (`position: running()` and `element()`) for whole formatted blocks.

### Named strings

```css
h1 { string-set: chapter content(); }
h2 { string-set: section content(); }
@page {
  @top-left  { content: string(chapter); }
  @top-right { content: string(section); font-style: italic; }
}
```

Every time an `h1` is laid out, the named string `chapter` is set to its text. The margin box then prints whatever value the string has on that page. The `content()` function takes an argument for what to copy: `content(text)` (default), `content(before)`, `content(after)` or `content(first-letter)`. You can also set a string from an attribute: `string-set: docid attr(data-id)`.

### Which occurrence on the page?

`string(name, keyword)` selects which assignment counts when a page contains several headings.

| Keyword | Value used |
|---|---|
| `first` (default) | The first assignment on the page, or the value carried from the previous page if none |
| `start` | The value in effect at the start of the page (before any heading on it) |
| `last` | The last assignment on the page |
| `first-except` | Empty on the page where the string is first set; carried value elsewhere |

Dictionary-style headers ("Abstract – Vesting") use `string(term, first)` on the left and `string(term, last)` on the right. `first-except` is how you avoid repeating a chapter title in the header on the chapter's own opening page.

```css
@page { @top-center { content: string(chapter, first-except); } }
```

### Running elements

Named strings are plain text. For a header that combines a logo, a title and a rule line you need a running element: an element removed from the flow and placed in a margin box.

```html
<style>
  header.running { position: running(pageheader); }
  header.running .rule { border-top: 0.5pt solid #16A085; margin-top: 2mm; }
  @page { margin-top: 30mm; @top-center { content: element(pageheader); width: 100%; } }
</style>
<header class="running">
  <img src="logo.svg" style="height:10mm; float:left">
  <span style="float:right; font:8pt Helvetica">Rev 3.2</span>
  <div style="clear:both" class="rule"></div>
</header>
```

`position: running(pageheader)` takes the element out of the normal flow; `content: element(pageheader)` draws it in the margin box on every page. The element keeps its full CSS formatting. Like strings, `element(name, keyword)` accepts `first`, `start`, `last` and `first-except`, so you can have a different running header per chapter by placing a new `header.running` at the start of each chapter.

### Combining counters and strings

```css
h1 { counter-increment: chapter; string-set: chapter "Chapter " counter(chapter) ": " content(); }
```

`string-set` accepts a list of strings, counters and `content()` pieces, so the header can read "Chapter 3: Escalations" without duplicating the numbering logic.

### Where things go wrong

- A running element with `display: none` is not laid out and never appears. Use `position: running()` alone.
- A running header must appear in the source **before** the content it should label; the value is not known until the element is laid out.
- `string-set` on an element hidden by `visibility: hidden` still sets the string, which is a trick for setting a string without printing anything: an empty `<span class="setter" data-title="...">`.
- Strings are reset per page only through the keywords; there is no "unset". To blank a header for an appendix, set the string to `""` on the appendix heading.

> **Interview note:** Be ready to explain the difference between `string-set` and `running()` in one sentence: strings carry text, running elements carry formatted boxes. Then give the "chapter title in the header" example, which every document producer recognises.

### Try It Yourself

```html
<!-- string-set and running elements only take effect in WeasyPrint. -->
<style>
  @page {
    size: A4; margin: 30mm 20mm 20mm;
    @top-center { content: element(pageheader); width: 100%; vertical-align: bottom; }
    @bottom-left { content: string(chapter, first-except); font: 8pt Helvetica, Arial; color: #666; }
    @bottom-right { content: counter(page); font: 8pt Helvetica, Arial; }
  }
  header.running { position: running(pageheader); font: 8pt Helvetica, Arial; border-bottom: 0.5pt solid #16A085; padding-bottom: 2mm; }
  body { font: 10.5pt/1.4 Georgia, serif; counter-reset: chapter; }
  h1 { counter-increment: chapter; string-set: chapter "Chapter " counter(chapter) ": " content(); break-before: page; }
  h1:first-of-type { break-before: auto; }
</style>
<header class="running">Escrow Operations Manual - Confidential</header>
<h1>Quality Checking</h1>
<p>The bottom-left footer prints "Chapter 1: Quality Checking" on every page of this chapter except its first.</p>
<h1>Escalations</h1>
<p>The footer now reads "Chapter 2: Escalations".</p>
```

### Quiz

1. Which mechanism carries a formatted block (logo plus text) into a header?
- [ ] `string-set`
- [x] `position: running()` with `content: element()`
- [ ] `content: attr()`
> Named strings hold text only; running elements hold whole boxes.

2. What does `string(chapter, first-except)` do on the page where the chapter starts?
- [x] Prints nothing
- [ ] Prints the previous chapter
- [ ] Prints the chapter twice
> `first-except` is blank on the page that sets the string and carries the value on later pages.

3. Why must a running element come before the content in the HTML?
- [ ] Because of `z-index`
- [x] Its value is only known once it has been laid out
- [ ] It must be inside `<head>`
> Generated content for a page uses the state of strings and running elements at the time the page is laid out.

### Exercises

1. **Chapter and section header** — Show the chapter title at top-left and the current section at top-right, with the section omitted on a chapter's first page.
<details><summary>Solution</summary>

```css
h1 { string-set: chapter content(); }
h2 { string-set: section content(); }
h1 + * h2, h1 ~ h2 { }
@page {
  @top-left { content: string(chapter); }
  @top-right { content: string(section, first-except); }
}
```

Reset `section` on each `h1` with `h1 { string-set: chapter content(), section ""; }` so the previous chapter's section does not leak onto the new chapter's opening page.

</details>

2. **Per-chapter running letterhead** — Give each chapter its own running header block.
<details><summary>Solution</summary>

```html
<style>
  .chap-head { position: running(ch); font: 8pt Helvetica; }
  @page { @top-center { content: element(ch); } }
</style>
<section>
  <div class="chap-head">Part A - Operations</div>
  <h1>...</h1>
</section>
<section>
  <div class="chap-head">Part B - Compliance</div>
  <h1>...</h1>
</section>
```

</details>

### Interview Questions

**Q: How do you put the current chapter title in the page header?**
`h1 { string-set: chapter content(); }` captures each chapter heading into a named string as it is laid out, and `@page { @top-left { content: string(chapter); } }` prints the current value on every page. On the chapter's own first page I use `string(chapter, first-except)` so the title is not duplicated under the heading. If the header needs a logo and a rule, I switch to a running element: `header { position: running(hdr) }` and `content: element(hdr)`. This is the same outcome as Word's StyleRef field but declarative and version-controlled.

**Q: What is the difference between `first`, `start` and `last` when reading a named string?**
They pick which assignment on the page is used. `start` is the value before the page's first assignment, `first` is the first assignment on the page (falling back to the carried value), and `last` is the final assignment on the page. A glossary running header "Abstract – Vesting" uses `first` on the left and `last` on the right; a chapter header uses `first-except` so the title appears only on continuation pages.

**Q: Why might a running header appear blank on the first page but correct afterwards?**
Because the element that sets it is placed after the content in the source, or the first page has no assignment yet and `first-except` is in use. The engine can only use values assigned by elements already laid out on or before that page, so I move the running element or `string-set` element to the very top of the section it labels, and I use `start` or `first` instead of `first-except` when the title should appear on the opening page.

## Named pages and different layouts (cover, landscape)

One `@page` rule is rarely enough. A manual has a cover with no margins, front matter with roman numerals, body pages with running headers, and a landscape appendix for the rate matrix. **Named pages** let each part of the document select its own `@page` rule.

### Declaring and selecting

```css
@page cover { size: A4; margin: 0; @top-center { content: none; } }
@page body { size: A4; margin: 25mm 20mm; @top-center { content: string(chapter); } }
@page wide { size: A4 landscape; margin: 15mm; }

section.cover { page: cover; }
section.body { page: body; }
section.matrix { page: wide; }
```

The `page` property on an element assigns it to a named page. Whenever consecutive content belongs to different named pages, WeasyPrint inserts a page break automatically, so you do not need `break-before: page` between the cover and the body.

### Named-page pseudo-classes

Named pages combine with `:first`, `:left`, `:right` and `:blank`. `body:first` is the first page **of the named group**, not the first page of the document, which is exactly what chapter-opening pages need.

```css
@page body:first { @top-center { content: none; } margin-top: 45mm; }
@page body:left  { @bottom-left { content: counter(page); } }
@page body:right { @bottom-right { content: counter(page); } }
```

Mixed page sizes work too: a landscape appendix simply has a different `size`, and each PDF page carries its own dimensions. Readers handle this fine; some office printers need "auto-rotate" enabled.

### A full cover page

```html
<style>
  @page cover { margin: 0; }
  .cover { page: cover; height: 297mm; width: 210mm; box-sizing: border-box;
           background: #16A085; color: white; padding: 40mm 25mm; }
  .cover h1 { font: bold 32pt Helvetica; margin-top: 120mm; }
  .cover .sub { font: 14pt Helvetica; opacity: 0.85; }
</style>
<section class="cover">
  <div class="title"><h1>Escrow Operations Manual</h1></div>
  <div class="sub">Revision 3.2 - September 2026</div>
</section>
```

With zero margins the cover background bleeds to the paper edge. For a commercial printer you add actual bleed: `@page cover { size: 216mm 303mm; bleed: 3mm; marks: crop; }` extends the page 3mm on every side and draws crop marks; the `bleed` property is supported since v43.

### Multiple named pages in one document

| Part | Named page | Key rules |
|---|---|---|
| Cover | `cover` | `margin: 0`, no margin boxes, full-bleed background |
| Front matter | `front` | Roman page numbers, no chapter header |
| Body | `body` | Headers, decimal numbers restarted with `counter-reset: page 1` |
| Wide appendix | `wide` | `size: A4 landscape` |
| Back cover | `cover` | Reuse the cover rule |

### Blank pages

When `break-before: right` inserts a blank verso, it belongs to the same named page as the content before it, so its header would print. `@page body:blank { @top-center { content: none; } }` keeps inserted blanks clean, and you can even print "This page intentionally left blank" from there.

### Page groups and page selectors

The `page` property inherits, so setting it on `<body>` applies everywhere, and a nested element with a different `page` value creates a page group of its own. Avoid assigning `page` to inline elements; it only affects block-level boxes.

> **Tip:** Keep a `page` value for every top-level section, even if it maps to the default rule, so the document structure is explicit. When the client asks for "the appendix in landscape", the change is one line.

### Try It Yourself

```html
<!-- Named pages are a WeasyPrint feature; the preview shows the cover styling. -->
<style>
  @page { size: A4; margin: 22mm 20mm; @bottom-center { content: counter(page); font: 9pt Helvetica, Arial; } }
  @page cover { margin: 0; @bottom-center { content: none; } }
  @page wide { size: A4 landscape; margin: 15mm; }
  .cover { page: cover; background: #16A085; color: #fff; padding: 40mm 25mm; min-height: 120mm; }
  .cover h1 { font: bold 30pt Helvetica, Arial; margin: 0 0 6mm; }
  .body { page: auto; }
  .matrix { page: wide; }
  table { border-collapse: collapse; font: 9pt Helvetica, Arial; }
  td, th { border: 0.5pt solid #999; padding: 2pt 5pt; }
</style>
<section class="cover"><h1>Owner's Policy Rate Book</h1><div>Effective 1 October 2026</div></section>
<section class="body"><h2>1. Scope</h2><p>Portrait body pages with a centred page number.</p></section>
<section class="matrix">
  <h2>Appendix A - Rate Matrix (landscape page)</h2>
  <table><tr><th>Liability</th><th>TX</th><th>WY</th><th>CO</th></tr><tr><td>100,000</td><td>832</td><td>610</td><td>690</td></tr></table>
</section>
```

### Quiz

1. How do you assign an element to a named page?
- [ ] `@page name` inside the element's style
- [x] The `page: name` property on the element
- [ ] `break-before: name`
> `page` selects the `@page name` rule; WeasyPrint inserts breaks between different named pages.

2. What does `@page body:first` match?
- [ ] The first page of the document
- [x] The first page of each run of `body` pages
- [ ] The first page after the cover
> Named-page pseudo-classes apply relative to the page group.

3. Which property adds bleed and crop marks for a printer?
- [x] `bleed` and `marks` on `@page`
- [ ] `outline` on `body`
- [ ] `margin: -3mm`
> `bleed: 3mm; marks: crop cross;` extends the page and draws trim marks.

### Exercises

1. **Landscape appendix** — Make everything inside `<section class="appendix">` render on A4 landscape pages with 15mm margins and "Appendix" in the top-right header.
<details><summary>Solution</summary>

```css
@page appendix { size: A4 landscape; margin: 15mm; @top-right { content: "Appendix"; font: 8pt Helvetica; } }
.appendix { page: appendix; }
```

</details>

2. **Clean blanks** — Chapters open on right-hand pages; make inserted blank pages show no header and the text "This page intentionally left blank" centred at the bottom.
<details><summary>Solution</summary>

```css
h1 { break-before: right; }
@page :blank {
  @top-center { content: none; }
  @bottom-center { content: "This page intentionally left blank"; font: 8pt Helvetica; color: #999; }
}
```

</details>

### Interview Questions

**Q: How do you produce a document with a full-bleed cover, portrait body and landscape appendix in one PDF?**
Named pages. `@page cover { margin: 0 }`, `@page body { ... }` and `@page wide { size: A4 landscape }`, then `page: cover`, `page: body` and `page: wide` on the three sections. WeasyPrint inserts page breaks at each transition and each PDF page carries its own size. For a printed cover I add `bleed: 3mm` and `marks: crop` to the cover rule so the printer gets trim marks, and I keep the digital edition's cover rule without bleed by toggling a class in the template.

**Q: What is the difference between `@page :first` and `@page body:first`?**
`:first` alone matches the first page of the document. `body:first` matches the first page of every contiguous group of pages named `body`, so it fires at the start of each chapter if each chapter is its own group. That is how I suppress the running header and add extra top margin on chapter-opening pages, mirroring "Different first page" in Word section headers.

**Q: A client's printer complains that the PDF has mixed page sizes. What do you tell them?**
That it is intentional: the appendix is landscape A4 and each page's MediaBox is set accordingly, which every RIP handles. If their workflow requires uniform sizes I can rotate the appendix content instead (`transform: rotate(90deg)` on a portrait page) or export the appendix as a separate PDF. Mixed sizes are normal in print production; what they usually want is to confirm the sheet size and whether to auto-rotate, and I put that in the job notes.

## Bookmarks, outline and PDF metadata

A PDF that opens with a clickable outline and correct document properties looks finished. WeasyPrint generates both from the HTML: headings become bookmarks, `<title>` and `<meta>` become document info.

### Automatic bookmarks

By default, WeasyPrint's user-agent stylesheet gives `h1` through `h6` bookmark levels 1 to 6, so any document with headings gets an outline for free. You control it with three properties:

```css
h1 { bookmark-level: 1; bookmark-label: content(); }
h2 { bookmark-level: 2; }
h3 { bookmark-level: none; }          /* exclude from the outline */
h1 { bookmark-state: closed; }        /* collapsed in the reader's sidebar */
figcaption { bookmark-level: 3; bookmark-label: "Figure: " content(); }
```

`bookmark-label` accepts the same pieces as `string-set`, so a label can include a counter: `bookmark-label: "Chapter " counter(chapter) " - " content()`. `bookmark-state` (`open` or `closed`) sets whether children are expanded when the file opens; support arrived in v52.

Bookmarks are readable from Python after rendering:

```python
doc = HTML("manual.html").render()
tree = doc.make_bookmark_tree()
for bm in tree:
    print(bm.label, bm.destination[0] + 1)      # label, page number
    for child in bm.children:
        print("  ", child.label)
```

`make_bookmark_tree()` returns nested `BookmarkSubtree` objects with `label`, `destination` (page index, x, y), `children` and `state`.

### Document metadata

| HTML | PDF Info field |
|---|---|
| `<title>` | Title |
| `<meta name="author">` | Author |
| `<meta name="description">` | Subject |
| `<meta name="keywords">` | Keywords |
| `<meta name="generator">` | Creator |
| `<meta name="dcterms.created" content="2026-09-16T09:00:00Z">` | CreationDate |
| `<meta name="dcterms.modified" content="...">` | ModDate |

WeasyPrint always sets Producer to `WeasyPrint <version>`. Dates use W3C DTF (ISO 8601 subset). Anything else in `<meta name=...>` is embedded as custom metadata only if you pass `custom_metadata=True` (`--custom-metadata`, v57+), which some archival workflows use for document IDs.

```html
<head>
  <title>Escrow Operations Manual - Rev 3.2</title>
  <meta name="author" content="Ali Raza, Document Production">
  <meta name="description" content="Standard operating procedures for escrow disbursement">
  <meta name="keywords" content="escrow, SOP, title insurance">
  <meta name="dcterms.created" content="2026-09-16">
</head>
```

Verify with `pdfinfo manual.pdf` or `pikepdf`:

```python
import pikepdf
with pikepdf.open("manual.pdf") as pdf:
    print(pdf.docinfo)
    print(pdf.open_metadata().get("dc:title"))
```

WeasyPrint writes an XMP metadata stream as well as the Info dictionary from v57, which PDF/A requires.

### Links and anchors

Internal links (`<a href="#section-3">`) become PDF go-to link annotations, external links become URI annotations, and every element with an `id` becomes a named destination. `Page.links` and `Page.anchors` expose them after rendering. The `pdf_identifier` option sets the PDF `/ID` trailer entry, useful when a downstream tool must recognise repeated exports as the same document.

### Page labels

Readers show page labels ("i, ii, iii, 1, 2") in the navigation bar if the PDF defines them. WeasyPrint does not generate `/PageLabels` itself; add them with pikepdf after rendering when the front matter uses roman numerals, so the reader's page display matches the printed numbers.

> **Tip:** Set `bookmark-level: none` on the headings inside a table of contents `<nav>`, otherwise every TOC entry that uses a heading element becomes a duplicate bookmark.

### Try It Yourself

```html
<!-- Bookmarks and PDF Info are produced by WeasyPrint; the preview shows the heading structure. -->
<html lang="en">
<head>
  <title>Escrow Operations Manual - Rev 3.2</title>
  <meta name="author" content="Ali Raza, Document Production">
  <meta name="description" content="Standard operating procedures for escrow disbursement">
  <meta name="keywords" content="escrow, SOP, title insurance">
  <style>
    body { font: 10.5pt/1.4 Georgia, serif; margin: 2cm; counter-reset: chapter; }
    h1 { counter-increment: chapter; bookmark-level: 1; bookmark-label: "Chapter " counter(chapter) " - " content(); bookmark-state: open; color: #16A085; }
    h2 { bookmark-level: 2; }
    h3 { bookmark-level: none; }
    nav h2 { bookmark-level: none; }
  </style>
</head>
<body>
  <nav><h2>Contents</h2><a href="#c1">Quality Checking</a></nav>
  <h1 id="c1">Quality Checking</h1>
  <h2>Daily sampling</h2>
  <h3>Selecting files (not bookmarked)</h3>
  <p>Run <code>pdfinfo</code> on the PDF to see the title, author and subject.</p>
</body>
</html>
```

### Quiz

1. Which HTML element sets the PDF Title?
- [x] `<title>`
- [ ] `<h1>`
- [ ] `<meta name="title">`
> `<title>` maps to the Title field in the Info dictionary and XMP.

2. How do you exclude `h3` headings from the outline?
- [ ] `display: none`
- [x] `h3 { bookmark-level: none }`
- [ ] `visibility: hidden`
> `bookmark-level: none` removes the bookmark while keeping the heading visible.

3. What does `make_bookmark_tree()` return?
- [ ] The PDF outline as bytes
- [x] Nested objects with label, destination page and children
- [ ] A list of page numbers only
> It is the programmatic view of the outline, useful for logging or building a TOC.

### Exercises

1. **Numbered bookmarks** — Make level-1 bookmarks read "3. Escalations" and collapse their children by default.
<details><summary>Solution</summary>

```css
body { counter-reset: chapter; }
h1 { counter-increment: chapter; bookmark-level: 1; bookmark-label: counter(chapter) ". " content(); bookmark-state: closed; }
```

</details>

2. **Verify metadata** — Write a script that renders `manual.html` and asserts the PDF Title equals the HTML `<title>`.
<details><summary>Solution</summary>

```python
import pikepdf
from weasyprint import HTML

HTML("manual.html").write_pdf("manual.pdf")
with pikepdf.open("manual.pdf") as pdf:
    title = str(pdf.docinfo.get("/Title", ""))
assert title == "Escrow Operations Manual - Rev 3.2", title
print("ok:", title)
```

</details>

### Interview Questions

**Q: How do you give a generated PDF a proper outline and document properties?**
Headings already produce bookmarks through WeasyPrint's default `bookmark-level` for `h1`–`h6`; I refine that with `bookmark-label` to include chapter numbers, `bookmark-level: none` on TOC and minor headings, and `bookmark-state: closed` for long documents. Document properties come from `<title>` and `<meta>` tags for author, description, keywords and creation date, which WeasyPrint writes into both the Info dictionary and XMP. I verify with `pdfinfo` in CI so a template change cannot ship a PDF titled "Untitled".

**Q: What is the difference between a bookmark and a link in a PDF?**
A bookmark is an entry in the document outline, a hierarchy stored at document level that readers show in a sidebar. A link is an annotation on a page region that jumps somewhere when clicked. WeasyPrint generates bookmarks from headings and links from `<a>` elements; internal `href="#id"` links become go-to actions and `id` attributes become named destinations. A TOC needs both: the printed entries are links, and the sidebar outline is bookmarks.

**Q: How would you add page labels so the reader shows "iii" for the front matter?**
WeasyPrint does not write `/PageLabels`, so I post-process with pikepdf: build a `/PageLabels` number tree with a roman-numeral range starting at page 0 and a decimal range starting at the first body page, and save. Since I already know the body's first page index from the render (via bookmarks or a marker anchor), the script is a dozen lines and runs in the same pipeline.

## Jinja2 templating for data-driven reports

Real reports are not hand-written HTML; they are templates filled from a database, a CSV export or an API. Jinja2 is the standard Python template engine and pairs naturally with WeasyPrint: Jinja produces the HTML string, WeasyPrint produces the PDF.

### The pipeline

```python
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

BASE = Path(__file__).parent
env = Environment(
    loader=FileSystemLoader(BASE / "templates"),
    autoescape=select_autoescape(["html"]),
)

def money(v):
    return f"${v:,.2f}"
env.filters["money"] = money

def build_report(week, rows, out):
    template = env.get_template("status.html")
    html = template.render(week=week, rows=rows, total=sum(r["premium"] for r in rows))
    font_config = FontConfiguration()
    HTML(string=html, base_url=str(BASE / "static") + "/").write_pdf(
        out,
        stylesheets=[CSS(BASE / "static/print.css", font_config=font_config)],
        font_config=font_config,
    )
```

`autoescape` is not optional. A file description containing `<` or `&` would otherwise break the HTML, and a malicious client name could inject markup. Custom filters keep formatting logic out of the template.

### The template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Production Status - Week {{ week }}</title>
  <meta name="author" content="Production Support">
</head>
<body>
  <main><h1>Weekly Production Status - Week {{ week }}</h1>
  <table>
    <thead><tr><th>File #</th><th>State</th><th>Status</th><th>Premium</th></tr></thead>
    <tbody>
    {% for r in rows %}
      <tr class="{{ 'late' if r.days_open > 10 else '' }}">
        <td>{{ r.file_no }}</td>
        <td>{{ r.state }}</td>
        <td>{{ r.status }}</td>
        <td class="n">{{ r.premium | money }}</td>
      </tr>
    {% else %}
      <tr><td colspan="4">No files this week.</td></tr>
    {% endfor %}
    </tbody>
    <tfoot><tr><th colspan="3">Total</th><td class="n">{{ total | money }}</td></tr></tfoot>
  </table>
  </main>
</body>
</html>
```

Jinja's `{% for %}` with `{% else %}` handles the empty case, and the class expression drives CSS such as `tr.late { background: #fdecea }`. Keep presentation in CSS and logic in Python; the template only decides what to show.

### Template inheritance for a document family

```html
{# base.html #}
<!DOCTYPE html>
<html lang="en">
<head>
  <title>{% block title %}{% endblock %}</title>
  <link rel="stylesheet" href="print.css">
</head>
<body>
  <header class="running">{% block header %}{{ client.name }}{% endblock %}</header>
  {% block content %}{% endblock %}
</body>
</html>
```

Each deliverable extends `base.html` and overrides blocks. A Fiverr client with a suite of branded documents (letterhead, invoice, SOP, report) gets one base and one CSS file, and rebranding is a single change.

### Batch generation

```python
import csv
from collections import defaultdict

by_state = defaultdict(list)
with open("tracker.csv", newline="") as f:
    for row in csv.DictReader(f):
        row["premium"] = float(row["premium"]); row["days_open"] = int(row["days_open"])
        by_state[row["state"]].append(row)

for state, rows in by_state.items():
    build_report(week=37, rows=rows, out=f"out/status-{state}.pdf")
```

Rendering many documents is CPU-bound; use `concurrent.futures.ProcessPoolExecutor` to parallelise across cores, creating the Jinja environment and `FontConfiguration` per process.

### Data hygiene

| Problem | Fix |
|---|---|
| Numbers formatted in the template | Custom filters (`money`, `pct`, `date`) |
| Missing values print `None` | `{{ r.examiner or "Unassigned" }}` or the `default` filter |
| Long text breaks layout | CSS `overflow-wrap`, and truncate in Python if truly needed |
| Untrusted strings | `autoescape=True`; never use the `safe` filter on user data |
| Images per row (signatures) | Pass data URIs or `asset:` URLs served by a custom fetcher |

> **Warning:** Do not build HTML with f-strings and `+`. Every f-string report I have been asked to fix had at least one unescaped ampersand in a client name and one column that disappeared when a value was empty. Jinja with autoescape solves both.

### Try It Yourself

```html
<!-- This is the rendered output of the Jinja template above for three rows. -->
<style>
  body { font: 10pt/1.35 Helvetica, Arial, sans-serif; margin: 2cm; }
  h1 { color: #16A085; font-size: 16pt; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 0.5pt solid #999; padding: 3pt 6pt; text-align: left; }
  td.n, tfoot td { text-align: right; font-variant-numeric: tabular-nums; }
  tr.late { background: #fdecea; }
</style>
<h1>Weekly Production Status - Week 37</h1>
<table>
  <thead><tr><th>File #</th><th>State</th><th>Status</th><th>Premium</th></tr></thead>
  <tbody>
    <tr><td>TX-2026-04471</td><td>Texas</td><td>Closed</td><td class="n">$1,234.50</td></tr>
    <tr class="late"><td>WY-2026-00318</td><td>Wyoming</td><td>Open (14 d)</td><td class="n">$842.00</td></tr>
    <tr><td>CO-2026-01102</td><td>Colorado</td><td>Closed</td><td class="n">$1,015.75</td></tr>
  </tbody>
  <tfoot><tr><th colspan="3">Total</th><td>$3,092.25</td></tr></tfoot>
</table>
```

### Quiz

1. Why enable `autoescape` in the Jinja environment?
- [x] So `<`, `>` and `&` in data cannot break or inject HTML
- [ ] To make templates faster
- [ ] WeasyPrint requires it
> Escaping protects both layout integrity and security when data comes from clients or users.

2. Where should number formatting live?
- [ ] In the SQL query
- [x] In Jinja filters or Python, not in CSS
- [ ] In `@page` rules
> Filters like `money` keep the template readable and formatting consistent.

3. How do you speed up generating 400 PDFs?
- [ ] Use `optimize_images=False`
- [x] Parallelise with a process pool, one environment per process
- [ ] Render all reports into one HTML string
> Rendering is CPU-bound, so processes (not threads) give real speed-up on multi-core machines.

### Exercises

1. **Percentage filter** — Add a Jinja filter `pct` that formats 0.978 as "97.8%" and use it in a QA report row.
<details><summary>Solution</summary>

```python
env.filters["pct"] = lambda v: f"{v * 100:.1f}%"
```

```html
<td class="n">{{ agent.pass_rate | pct }}</td>
```

</details>

2. **Per-client branding** — Show how a `client` object with `name`, `logo_url` and `colour` can drive the letterhead and the accent colour without separate templates.
<details><summary>Solution</summary>

```html
<style>
  :root { --accent: {{ client.colour }}; }
  h1 { color: var(--accent); }
  .running { position: running(hdr); border-bottom: 0.5pt solid var(--accent); }
</style>
<header class="running"><img src="{{ client.logo_url }}" style="height:10mm"> {{ client.name }}</header>
```

Custom properties are supported by WeasyPrint, so one template serves every client.

</details>

3. **Empty state** — Ensure the table still renders a sensible row when there is no data.
<details><summary>Solution</summary>

```html
{% for r in rows %}
  <tr>...</tr>
{% else %}
  <tr><td colspan="4" style="text-align:center;color:#777">No files recorded for week {{ week }}.</td></tr>
{% endfor %}
```

</details>

### Interview Questions

**Q: Describe a data-to-PDF pipeline you have built.**
For a weekly title-production status report I read the tracker export with `csv.DictReader`, aggregated per state in Python, and rendered a Jinja2 template with `autoescape` and custom `money`, `pct` and `date` filters. The template extends a base with the client letterhead as a running element and a print stylesheet with named pages for the landscape rate matrix. WeasyPrint rendered each state's report from the HTML string with `base_url` pointing at the static folder and a shared `FontConfiguration` for the brand fonts. The whole run for eleven states took about 40 seconds sequentially and 9 seconds with a four-process pool, and CI asserted the page count and PDF title.

**Q: How do you keep templates maintainable across many client deliverables?**
Template inheritance: a `base.html` with blocks for title, header, content and footer, a single `print.css` driven by CSS custom properties for accent colour and fonts, and a `client` context object. Formatting lives in filters, logic in Python, presentation in CSS, so a designer can change the look without touching Python and a developer can change data without touching markup. I version templates with the code and keep a golden PDF per template in the test suite to detect unintended layout changes.

**Q: What are the security considerations of templating HTML for PDF?**
Two: injection and resource fetching. Autoescaping stops data from injecting markup, and I never mark client data `safe`. Resource fetching is the bigger risk because WeasyPrint will load whatever `src` and `url()` point at, so I use a custom `url_fetcher` that only serves whitelisted local assets and run the renderer without network access. I also cap document size and render time, because a template that loops over a malicious 1,000,000-row input can pin a CPU for minutes.

## CSS features WeasyPrint does not support and workarounds

Everything designers reach for on the web is not available on paper. This chapter lists the gaps that actually bite in document projects and the pattern that replaces each one. Check the release notes for your pinned version, because the list shrinks with every major release.

### The gaps

| Missing or partial | Workaround |
|---|---|
| JavaScript | Render data server-side (Jinja2); pre-draw charts as SVG |
| `box-shadow`, `text-shadow`, `filter`, `backdrop-filter` | Borders, background tints, or an SVG with a filter as an image |
| `position: sticky` | Running elements for repeated headers |
| Flex/grid across pages | Block flow, tables, multi-column |
| `@container` queries, `@layer` | Not available; structure the cascade with plain specificity |
| CSS animations, transitions | Irrelevant for print; remove from print stylesheet |
| `mix-blend-mode`, `isolation` | Pre-composite in an image editor |
| `writing-mode: vertical-*` | Rotate with `transform` for short labels |
| Web fonts via `@import url(fonts.googleapis.com)` | Download the font files and use local `@font-face` |
| `<video>`, `<audio>`, `<iframe>`, `<canvas>` | Static poster image; `<canvas>` never draws |
| `text-overflow: ellipsis` | Truncate in Python, or `overflow: hidden` with fixed width |
| `scroll-*`, `overflow: auto` scrollbars | Irrelevant; `overflow: hidden` clips |

### Replacing shadows

Cards with shadows are the most frequent request. A 0.5pt border and a faint tint reads as a card in print and is invisible-ink safe:

```css
.card { border: 0.5pt solid #d0d5d3; border-top: 3pt solid #16A085; background: #fbfdfc; padding: 4mm; }
```

If the client insists on a shadow, draw the card as an SVG rectangle with an `feGaussianBlur` filter and place it as a background image; WeasyPrint's SVG renderer supports basic filters even though CSS `filter` is not implemented.

### Replacing sticky headers

Web pages keep a header on screen with `position: sticky`; PDFs keep it on every page with running elements or margin boxes. Sticky table headers translate to `<thead>` repetition.

### Fonts from Google Fonts

`@import url("https://fonts.googleapis.com/css2?family=Inter")` returns different CSS per user agent and relies on `unicode-range` slicing; WeasyPrint can fetch it but the result depends on network access at render time. Download the WOFF2 or TTF files once, put them in `static/fonts/` and declare `@font-face` locally. Reproducible, offline, faster.

### Charts

Chart.js, Plotly and D3 draw at runtime in the browser, so the PDF shows an empty box. Options:

1. Matplotlib or Plotly's static export (`fig.write_image` with Kaleido) to SVG or PNG, embedded as a data URI.
2. Hand-written SVG bars for simple charts, generated by the template: a `<rect>` per row with `width="{{ value / max * 100 }}%"`.
3. Pure CSS bars using `div` widths, which WeasyPrint renders perfectly.

```html
<div class="bar-row"><span class="label">Texas</span><div class="bar" style="width: 84%"></div><span>117</span></div>
```

### Detecting unsupported properties

Set up logging once and every ignored declaration shows up with its stylesheet line:

```python
import logging
logging.basicConfig(level=logging.INFO)
logging.getLogger("weasyprint").setLevel(logging.INFO)
```

Messages look like `Ignored 'box-shadow: 0 2px 4px rgba(0,0,0,.2)' at 12:3, unknown property.` Treat these as lint output during template development.

### Print stylesheet strategy

Keep a separate `print.css` rather than a shared web stylesheet with `@media print` blocks. The web stylesheet drags in resets, sticky navigation, shadows and viewport units that produce dozens of `Ignored` warnings and unpredictable results. A print stylesheet written for the paged engine is shorter and renders the first time.

> **Interview note:** When asked "what does WeasyPrint not support", the mature answer lists the gaps and then says how you design around each one. Also mention that you check release notes, because "Grid is not supported" was true before v62 and false afterwards.

### Try It Yourself

```html
<style>
  body { font: 10pt/1.35 Helvetica, Arial, sans-serif; margin: 2cm; }
  /* Shadow replacement */
  .card { border: 0.5pt solid #d0d5d3; border-top: 3pt solid #16A085; background: #fbfdfc; padding: 4mm; margin-bottom: 6mm; }
  /* Pure CSS bar chart: renders in WeasyPrint with no JavaScript */
  .bar-row { display: flex; align-items: center; gap: 3mm; margin: 1.5mm 0; }
  .bar-row .label { width: 22mm; }
  .bar-row .track { flex: 1; background: #eee; height: 5mm; }
  .bar-row .bar { background: #16A085; height: 100%; }
</style>
<div class="card"><b>Files closed by state, week 37</b></div>
<div class="bar-row"><span class="label">Texas</span><div class="track"><div class="bar" style="width:100%"></div></div><span>117</span></div>
<div class="bar-row"><span class="label">Colorado</span><div class="track"><div class="bar" style="width:60%"></div></div><span>70</span></div>
<div class="bar-row"><span class="label">Wyoming</span><div class="track"><div class="bar" style="width:33%"></div></div><span>39</span></div>
```

### Quiz

1. What happens to a `<canvas>` chart in WeasyPrint?
- [x] It renders as nothing because no JavaScript runs
- [ ] It is rasterised at 96 dpi
- [ ] It is converted to SVG
> Canvas content is produced by scripts, which WeasyPrint does not execute.

2. What is the print equivalent of `position: sticky` for a repeated block?
- [ ] `position: absolute`
- [x] A running element placed in a margin box
- [ ] `display: table`
> Running elements repeat formatted content on each page.

3. Why avoid `@import` from Google Fonts in a print stylesheet?
- [ ] WeasyPrint cannot parse `@import`
- [x] The result depends on network access and user-agent-specific CSS at render time
- [ ] Google Fonts are not embeddable
> Local `@font-face` files are reproducible and work offline.

### Exercises

1. **Card without shadow** — Rewrite `.card { box-shadow: 0 2px 6px rgba(0,0,0,.2); border-radius: 6px; }` for print.
<details><summary>Solution</summary>

```css
.card { border: 0.5pt solid #ccc; border-radius: 6px; background: #fafafa; }
```

`border-radius` is supported, so only the shadow needs replacing.

</details>

2. **Server-side chart** — Generate an SVG bar chart in Jinja from a list of `(label, value)` pairs.
<details><summary>Solution</summary>

```html
{% set maxv = rows | map(attribute=1) | max %}
<svg width="120mm" height="{{ rows|length * 8 }}mm" viewBox="0 0 120 {{ rows|length * 8 }}">
{% for label, v in rows %}
  <text x="0" y="{{ loop.index0 * 8 + 5 }}" font-size="3">{{ label }}</text>
  <rect x="25" y="{{ loop.index0 * 8 + 1 }}" width="{{ (v / maxv) * 90 }}" height="5" fill="#16A085"/>
{% endfor %}
</svg>
```

</details>

### Interview Questions

**Q: A designer hands you a web page and asks for it as a PDF. What do you change?**
I write a dedicated print stylesheet instead of reusing the web CSS. Navigation, sticky elements, shadows, animations and viewport units go; `@page` size, margins, margin-box headers and footers, page-break rules and print typography come in. Charts drawn by JavaScript are re-generated server-side as SVG. Flex and grid stay only for one-page components. I then render with verbose logging and clear every `Ignored` warning, and I show the designer the PDF next to the web page so the differences are agreed rather than discovered.

**Q: How do you produce charts in a WeasyPrint report?**
Server-side, always. For anything beyond bars I use Matplotlib with the Agg backend and export SVG so text stays crisp and fonts can be embedded as paths. For simple bar charts I emit SVG or CSS bars from the Jinja template, which keeps the pipeline dependency-free. Plotly works through Kaleido's static export when interactive parity with a dashboard matters. In every case the image is embedded as a data URI so the HTML is self-contained and the render needs no network.

**Q: How do you find out whether a specific CSS feature works in your WeasyPrint version?**
Three sources: the "Supported features" page in the documentation, the changelog for the version I have pinned, and the `Ignored` log lines from a verbose render of a test snippet. I keep a small `features.html` with one example per property that I re-render after every upgrade, so I learn about newly supported or changed behaviour before a client does.

# LEVEL: Expert

## Font subsetting, embedding and print quality

A print shop judges a PDF by three things before it looks at the design: fonts embedded, images at resolution, colours in a predictable space. WeasyPrint gets the first right by default and gives you enough control over the other two to produce files a printer accepts.

### What WeasyPrint embeds

Every font used is embedded as a FontFile2 (TrueType) or FontFile3 (CFF/OpenType) stream, described by a CID-keyed Type0 font so any Unicode text works. By default the font is **subset** with fontTools: only glyphs that appear in the document are kept, the glyph order is preserved, and the font name gets a random six-letter tag prefix (`ABCDEF+Inter-Regular`). Variable fonts are instanced to the requested weight before subsetting.

```bash
pdffonts manual.pdf
# name                              type         encoding   emb sub uni object ID
# ABCDEF+Inter-Regular              CID TrueType Identity-H yes yes yes     12  0
# GHIJKL+Inter-Bold                 CID TrueType Identity-H yes yes yes     15  0
```

`emb yes`, `sub yes`, `uni yes` is what you want: embedded, subset, with a ToUnicode map so text is searchable and copyable.

### Options that change embedding

| Option | When to use |
|---|---|
| `full_fonts=True` | The PDF will be edited later, or a PDF/A validator complains about a specific subset table |
| `hinting=True` | Screen-first documents where hinted rendering at small sizes matters; irrelevant for print |
| `pdf_variant="pdf/a-…"` | Forces embedding of all fonts and ToUnicode maps (already the default) plus colour profile and XMP |

Subsetting failures fall back to embedding the full font, with a warning in the verbose log. Fonts with broken `glyf` or `CFF` tables (some free fonts) are the usual cause; run `fonttools ttx -l font.ttf` to inspect them, or re-export the font from FontForge.

### Synthetic styles and why printers hate them

If bold or italic faces are missing, Pango synthesises them. Synthetic bold is drawn by stroking the outline, which in PDF becomes a text render mode 2 (fill and stroke) and prints thicker and blurrier than a real bold. Synthetic italic is a shear transform. Both look acceptable on screen and wrong on paper. Declare all four faces in `@font-face`, and check the log for `font-synthesis` fallbacks.

### Image resolution for print

Print wants 300 pixels per inch at final size. WeasyPrint embeds raster images at their native pixels; the printed size is the CSS size. Therefore:

- A logo 600px wide placed at 50mm prints at 600 / (50 / 25.4) = 305 ppi. Good.
- A screenshot 1200px wide placed at 170mm prints at 179 ppi. Marginal for text, fine for a review copy.
- `image-resolution: 300dpi` sizes images by their pixel count so 300 ppi is guaranteed whenever no CSS width is set.

Do not pass `dpi=` or `optimize_images=True` for the print master, because `dpi` downsamples images above that resolution. Keep those options for web copies.

### Colour

WeasyPrint writes RGB (`DeviceRGB`) colour operators, and since v63 can tag output with an sRGB profile (`srgb=True`, `--srgb`), which PDF/A also triggers. It does not produce CMYK. For commercial offset printing that expects CMYK, convert afterwards with Ghostscript, keeping fonts and vectors intact:

```bash
gs -o manual-cmyk.pdf -sDEVICE=pdfwrite \
   -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK \
   -dPDFSETTINGS=/prepress -dEmbedAllFonts=true manual.pdf
```

Ghostscript maps RGB to CMYK with its default profiles; for an ICC-managed conversion supply `-sOutputICCProfile=` and `-sDefaultRGBProfile=`. Also be aware that RGB black `#000000` converts to a four-colour rich black rather than 100% K, so set body text to a colour the printer's profile maps to K only, or ask the printer to run their own conversion and preserve black.

### Line weights and hairlines

Rules thinner than 0.25pt may disappear on a press or be rendered as the device's thinnest line, which differs by printer. Use 0.5pt for table rules and 0.75pt for emphasis lines; never `0.1px`. CSS `px` values are converted at 0.75pt per pixel, so a `1px` border is 0.75pt, which is fine.

> **Tip:** Build a `qa.sh` that runs `pdffonts`, `pdfimages -list` (which prints each image's ppi at placed size) and `pdfinfo` on every deliverable. A missing `emb yes` or an image under 200 ppi fails the build before anyone emails the file.

### Try It Yourself

```html
<style>
  body { font: 10pt/1.4 Georgia, serif; margin: 2cm; }
  /* Print-safe line weights and a 300 ppi image placement */
  table { border-collapse: collapse; }
  td, th { border: 0.5pt solid #444; padding: 2pt 6pt; }
  .hairline { border-top: 0.25pt solid #444; margin: 4mm 0; }
  .logo { width: 50mm; }  /* a 600px-wide PNG here prints at ~305 ppi */
  .warn { color: #B03A2E; font-size: 9pt; }
</style>
<table><tr><th>Rule</th><th>Weight</th></tr><tr><td>Table rule</td><td>0.5pt</td></tr><tr><td>Emphasis rule</td><td>0.75pt</td></tr></table>
<div class="hairline"></div>
<p class="warn">A 0.25pt hairline (above) may vanish on some presses. Check the print master with <code>pdffonts</code> and <code>pdfimages -list</code>.</p>
```

### Quiz

1. What does `sub yes` in `pdffonts` output mean?
- [x] Only the glyphs used were embedded
- [ ] The font is a substitute
- [ ] The font is not embedded
> Subsetting keeps the file small; the six-letter prefix on the name is the subset tag.

2. A 900px-wide image placed at 76.2mm (3in) prints at what resolution?
- [ ] 96 ppi
- [x] 300 ppi
- [ ] 900 ppi
> 900 pixels over 3 inches is 300 pixels per inch.

3. How do you get a CMYK PDF from WeasyPrint output?
- [ ] `write_pdf(cmyk=True)`
- [x] Convert afterwards with Ghostscript using `-sColorConversionStrategy=CMYK`
- [ ] Use CMYK colour values in CSS
> WeasyPrint emits RGB; colour conversion is a post-processing step.

### Exercises

1. **Print QA script** — Write a bash script that fails if any font is not embedded or any image is below 250 ppi.
<details><summary>Solution</summary>

```bash
#!/usr/bin/env bash
set -e
f="$1"
if pdffonts "$f" | tail -n +3 | awk '{print $(NF-4)}' | grep -q '^no$'; then
  echo "Unembedded font in $f"; exit 1
fi
if pdfimages -list "$f" | tail -n +3 | awk '$13 < 250 {found=1} END {exit !found}'; then
  echo "Image below 250 ppi in $f"; exit 1
fi
echo "OK $f"
```

Column positions in `pdfimages -list` vary slightly by poppler version; check `x-ppi` is column 13 on your system.

</details>

2. **Full font embedding for editing** — Give the `write_pdf()` call that embeds complete fonts and the reason a client might need it.
<details><summary>Solution</summary>

```python
HTML("letter.html").write_pdf("letter.pdf", full_fonts=True)
```

A client who will add text in Acrobat needs glyphs that are not in the subset; a full embed guarantees the font is usable for edits.

</details>

### Interview Questions

**Q: How do you make sure a WeasyPrint PDF is print-ready?**
Fonts: all four faces declared so nothing is synthesised, embedding verified with `pdffonts`. Images: sized so the effective resolution is 300 ppi at placed size, verified with `pdfimages -list`, and no `dpi`/`optimize_images` on the master. Rules: no lines under 0.25pt. Colour: I know WeasyPrint outputs RGB, so I either agree a digital-press RGB workflow with the printer or convert with Ghostscript to CMYK with their ICC profile, watching for rich black. Page geometry: `bleed` and `marks` on covers. Then an automated QA script gates the deliverable.

**Q: Why is synthetic bold a problem in print?**
Pango fakes bold by stroking the glyph outline when the bold face is missing, which WeasyPrint writes as a fill-and-stroke text render mode. On screen it passes; on paper the stroke thickens every letter unevenly, fills counters at small sizes and looks smeared, and some RIPs render stroked text differently. The fix is to declare the real bold face in `@font-face` and check the verbose log for synthesis warnings during template development.

**Q: What are the trade-offs of subsetting fonts?**
Subsetting cuts size dramatically, which matters for CJK or Arabic fonts of several megabytes, and it is what every commercial tool does. The costs are that the PDF cannot be edited with glyphs outside the subset, that a few validators have historically flagged unusual subset tables, and that some very old font files fail to subset and fall back to full embedding. For deliverables that will be edited I pass `full_fonts=True`; for everything else subsetting stays on.

## PDF/A, PDF/UA and attachments

Archival and accessibility standards turn a PDF from "opens today" into "opens in twenty years" and "works with a screen reader". WeasyPrint supports PDF/A since v57 and PDF/UA since v58, and it can embed files as attachments, which the PDF/A-3 profile explicitly allows for keeping source data with the report.

### PDF/A variants

```python
HTML("manual.html").write_pdf("manual.pdf", pdf_variant="pdf/a-3b")
```

```bash
weasyprint --pdf-variant pdf/a-3b manual.html manual.pdf
```

| Variant | Meaning |
|---|---|
| `pdf/a-1b` | ISO 19005-1, PDF 1.4 features, no transparency, no attachments |
| `pdf/a-2b` | PDF 1.7 features, transparency allowed, JPEG 2000 |
| `pdf/a-3b` | Like 2b plus arbitrary embedded files |
| `pdf/a-2u`, `pdf/a-3u` | Level U: all text must have Unicode mapping |
| `pdf/a-4b`, `pdf/a-4u` | ISO 19005-4 (PDF 2.0 based) |
| `pdf/ua-1` | ISO 14289-1 accessibility, implies tagged PDF |

Choosing a variant makes WeasyPrint embed an sRGB output intent, write XMP metadata with the conformance level, force font embedding, drop features the level forbids (transparency for 1b) and set the PDF version. Validate with veraPDF, the reference validator:

```bash
verapdf --flavour 3b manual.pdf | grep -E "isCompliant|failedChecks"
```

Common failures: an image with an embedded ICC profile that conflicts with the output intent (strip profiles with Pillow), a font with a licensing flag that veraPDF treats as non-embeddable, or `<meta name="dcterms.created">` missing so XMP lacks a creation date.

### PDF/UA and tagged PDF

`pdf_variant="pdf/ua-1"` produces a tagged PDF: a structure tree with paragraphs, headings, lists, tables and figures derived from the HTML, plus a document language from `<html lang>`. Since v65 you can also enable tagging on its own with `pdf_tags=True` (`--pdf-tags`). Requirements for a genuinely accessible file:

- Every `<img>` has `alt` text; decorative images use `alt=""` so they are marked as artifacts.
- Headings form a proper hierarchy (no `h1` to `h3` jumps).
- Tables have `<th>` cells and, ideally, `scope` attributes.
- The document has a `<title>` and `lang`.
- Colour contrast is sufficient, which tags cannot fix.

Test with PAC (PDF Accessibility Checker) or Acrobat's accessibility checker. Tagged output increases file size and render time slightly, which is why it is opt-in.

### Attachments

Three ways to attach files:

```html
<head>
  <link rel="attachment" href="tracker-week37.csv" title="Source data">
</head>
<body>
  <a rel="attachment" href="rate-matrix.xlsx">Download the rate matrix</a>
</body>
```

```python
from weasyprint import HTML, Attachment
HTML("report.html").write_pdf(
    "report.pdf",
    attachments=[Attachment("tracker-week37.csv", description="Source data"),
                 Attachment(string=b"...", name="notes.txt")],
    pdf_variant="pdf/a-3b",
)
```

A `<link rel="attachment">` in the head becomes a document-level embedded file; an `<a rel="attachment">` in the body becomes a file attachment annotation at the link's position. The CLI flag is `-a file` (repeatable). Under PDF/A-3 the attachment must carry a MIME type and an `AFRelationship`; WeasyPrint sets these, and veraPDF checks them.

### Forms

`pdf_forms=True` (`--pdf-forms`, v58+) turns `<input>`, `<textarea>` and `<select>` into real AcroForm fields, with `name`, `value`, `placeholder`, `checked` and `disabled` honoured. That is enough for simple fillable checklists; complex forms with 168 fields and calculations still belong in pdf-lib, PyMuPDF or Acrobat, but WeasyPrint can lay out the page and leave the fields for a second tool to configure.

### Encryption and signatures

WeasyPrint does not encrypt or sign. Post-process with pikepdf (`pdf.save("out.pdf", encryption=pikepdf.Encryption(user="", owner="secret", R=6))`) for AES-256, and with pyHanko for digital signatures. Encryption breaks PDF/A conformance, so choose one.

> **Warning:** PDF/A forbids external content and JavaScript and requires all fonts embedded, including those inside embedded SVGs. Text in an SVG that references a font by name is rendered through Pango and embedded normally, but an SVG that itself embeds a `@font-face` with a remote URL will fail validation. Convert such SVG text to paths first.

### Try It Yourself

```html
<!-- Attachments, forms and PDF/A are WeasyPrint features; the preview shows the accessible structure. -->
<html lang="en">
<head>
  <title>QA Checklist - Week 37</title>
  <meta name="author" content="QA Team">
  <meta name="dcterms.created" content="2026-09-16">
  <link rel="attachment" href="qa-week37.csv" title="Source data">
  <style>
    body { font: 10pt/1.4 Helvetica, Arial, sans-serif; margin: 2cm; }
    label { display: block; margin: 2mm 0; }
    input[type=text] { border: 0.5pt solid #888; width: 60mm; }
  </style>
</head>
<body>
  <h1>Agent QA Checklist</h1>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='20' cy='20' r='18' fill='%2316A085'/></svg>" alt="QA seal">
  <label><input type="checkbox" name="script" checked> Followed call script</label>
  <label><input type="checkbox" name="hold"> Hold time under 60 s</label>
  <label>Reviewer: <input type="text" name="reviewer" placeholder="Name"></label>
  <p>Render with <code>--pdf-forms --pdf-variant pdf/a-3b</code> and validate with veraPDF.</p>
</body>
</html>
```

### Quiz

1. Which PDF/A level allows arbitrary embedded files?
- [ ] PDF/A-1b
- [ ] PDF/A-2b
- [x] PDF/A-3b
> Part 3 was created precisely to allow attachments such as source data.

2. What does `pdf_variant="pdf/ua-1"` add beyond PDF/A-style requirements?
- [x] A structure tree (tagged PDF) for accessibility
- [ ] Encryption
- [ ] CMYK colour
> PDF/UA requires tags, alt text and language; WeasyPrint derives the tags from the HTML.

3. How do you attach a CSV to every generated report from the HTML itself?
- [ ] `<meta name="attachment">`
- [x] `<link rel="attachment" href="data.csv">` in `<head>`
- [ ] `<embed src="data.csv">`
> The link becomes a document-level embedded file.

### Exercises

1. **Archival report** — Write the `write_pdf()` call for a PDF/A-3b report that embeds the source CSV, then the veraPDF command to validate it.
<details><summary>Solution</summary>

```python
from weasyprint import HTML, Attachment
HTML("report.html").write_pdf("report.pdf", pdf_variant="pdf/a-3b",
    attachments=[Attachment("tracker.csv", description="Source data")])
```

```bash
verapdf --flavour 3b report.pdf
```

</details>

2. **Accessible template audit** — List the HTML changes needed to make a report template PDF/UA-ready.
<details><summary>Solution</summary>

- `<html lang="en">` and a meaningful `<title>`.
- `alt` on every image; `alt=""` for decorative images.
- Heading levels in order (`h1`, then `h2`, then `h3`).
- `<th scope="col">` for header cells and `<caption>` on data tables.
- Lists as `<ul>`/`<ol>` rather than paragraphs with dashes.
- Render with `pdf_variant="pdf/ua-1"` and test in PAC.

</details>

3. **Encrypt after rendering** — Render to bytes and save an AES-256 encrypted copy with pikepdf.
<details><summary>Solution</summary>

```python
import io, pikepdf
from weasyprint import HTML
pdf_bytes = HTML("letter.html").write_pdf()
with pikepdf.open(io.BytesIO(pdf_bytes)) as pdf:
    pdf.save("letter-locked.pdf", encryption=pikepdf.Encryption(user="", owner="s3cret", R=6))
```

</details>

### Interview Questions

**Q: What changes when you render with `pdf_variant="pdf/a-3b"`?**
WeasyPrint writes an sRGB ICC output intent, XMP metadata declaring the part and conformance level, sets the PDF version and identifier, guarantees font embedding with Unicode maps, and makes attachments carry MIME types and `AFRelationship` so they are legal under part 3. It does not fix content problems: images with conflicting embedded profiles, remote resources, JavaScript or encryption still fail validation, so I run veraPDF in CI and treat a non-compliant result as a build failure.

**Q: How would you deliver an accessible PDF from HTML?**
Start with semantic HTML because the tags are derived from it: real headings in order, `alt` text, `th` cells with scope, lists, `lang` and `title`. Render with `pdf_variant="pdf/ua-1"` (or `pdf_tags=True` in v65+ when full PDF/UA is not required) and check with PAC or Acrobat. Contrast, reading order across floats, and meaningful link text are template design decisions that no renderer can fix, so they go into the template review checklist.

**Q: When do you use WeasyPrint's form support versus a dedicated forms tool?**
For simple checklists and one-page intake forms, `pdf_forms=True` is enough: fields get names and default values from the HTML and the layout is CSS. For anything with calculations, radio groups with export values, field formatting, or the 168-field applications I have built for clients, I let WeasyPrint produce the static page and then add or configure fields with PyMuPDF or pdf-lib, or I build the form in Acrobat where the client can maintain it. The deciding factor is who maintains the form after delivery.

## Performance: large documents, caching and fonts

A 700-page handbook or a nightly batch of 400 statements pushes WeasyPrint into territory where layout time and memory matter. The engine is single-threaded pure Python, so the levers are: make layout do less work, avoid repeating work, and run several renders in parallel.

### Where the time goes

Profile once before guessing:

```python
import cProfile, pstats
from weasyprint import HTML
cProfile.run('HTML("handbook.html").render()', "render.prof")
pstats.Stats("render.prof").sort_stats("cumtime").print_stats(15)
```

Typical hot spots are text shaping (`weasyprint.text.line_break`), table column measurement, and page-break retries triggered by `break-inside: avoid`. The `weasyprint.progress` logger reports each stage with timing:

```python
import logging
logging.getLogger("weasyprint.progress").setLevel(logging.INFO)
logging.basicConfig(level=logging.INFO)
```

### Layout levers

| Lever | Effect |
|---|---|
| `table-layout: fixed` | Removes per-cell measurement; biggest win on long tables |
| Small `break-inside: avoid` units | Each avoid on a large block causes re-layout attempts |
| Fewer floats and absolute boxes | Floats force line-by-line collision checks |
| Plain block flow over nested flex/grid | Flex/grid resolve intrinsic sizes recursively |
| Shorter font stacks with fonts present | Every fallback lookup costs a fontconfig query |
| `hyphens: auto` only where justified | Hyphenation dictionaries add per-word work |
| Split giant documents by chapter | Render chapters in parallel; merge with pikepdf |

### Caching images

Image decoding repeats for every occurrence unless cached. Since v60 the `cache` option accepts a dict (shared in-process) or a folder path (shared across processes and runs); the CLI equivalent is `--cache-folder`.

```python
from weasyprint import HTML
cache = {}
for state, html in reports.items():
    HTML(string=html, base_url=BASE).write_pdf(f"out/{state}.pdf", cache=cache)
```

A logo used on every page of 400 documents is decoded once. For batch jobs across processes, pass a folder: `cache="/tmp/weasy-cache"`.

### Reusing font configuration and stylesheets

Parsing a stylesheet and loading `@font-face` files takes tens of milliseconds; multiply by 400 and it matters. Create `CSS()` objects and a `FontConfiguration` once per process and reuse them for every render in that process.

```python
font_config = FontConfiguration()
PRINT_CSS = CSS("static/print.css", font_config=font_config)

def render_one(html):
    return HTML(string=html, base_url=BASE).write_pdf(stylesheets=[PRINT_CSS], font_config=font_config)
```

### Parallel rendering

```python
from concurrent.futures import ProcessPoolExecutor

def job(args):
    state, html = args
    from weasyprint import HTML
    HTML(string=html, base_url=BASE).write_pdf(f"out/{state}.pdf", cache="/tmp/weasy-cache")
    return state

with ProcessPoolExecutor(max_workers=4) as pool:
    for done in pool.map(job, reports.items()):
        print("done", done)
```

Threads do not help: layout holds the GIL almost the whole time. Processes scale linearly with cores until memory becomes the limit. A 700-page handbook can peak at over 2GB, so size workers to memory, not just CPU.

### Splitting and merging

Render chapters separately with the same stylesheet, then merge with pikepdf. Page counters restart per file, so use per-chapter `counter-reset: page N` with `N` computed from the previous chapter's page count, and merge bookmarks by re-rendering the outline with pikepdf. This is more work than a single render, but it turns a 6-minute render into six parallel 1-minute renders.

### Memory

`Document` holds every laid-out box; call `write_pdf()` and drop the reference promptly. In long-running web workers, memory fragmentation from large renders makes the process grow, so run WeasyPrint in worker processes that restart after N jobs (Celery `worker_max_tasks_per_child`, or a `maxtasksperchild` pool).

### Timeouts

`HTML(url=...)` and remote resources use a 10-second timeout by default (`--timeout` on the CLI, `timeout=` on the fetcher). A template pointing at a dead CDN otherwise blocks the render for the full timeout per resource, which is the classic "the PDF takes 40 seconds" ticket.

> **Tip:** Keep a benchmark document in the repository and record `render()` time and page count on every version bump. A regression from 20 seconds to 60 after an upgrade is a known class of issue, and having numbers lets you report it upstream precisely.

### Try It Yourself

```html
<style>
  body { font: 9.5pt/1.3 Helvetica, Arial, sans-serif; margin: 2cm; }
  /* Fast table pattern for long reports */
  table { table-layout: fixed; width: 100%; border-collapse: collapse; }
  col.id { width: 30mm; } col.state { width: 20mm; } col.amt { width: 24mm; }
  td, th { border-bottom: 0.4pt solid #ccc; padding: 1.5pt 4pt; overflow-wrap: anywhere; }
  th { text-align: left; border-bottom: 1pt solid #16A085; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  tr { break-inside: avoid; }   /* small unit: cheap */
</style>
<table>
  <colgroup><col class="id"><col class="state"><col><col class="amt"></colgroup>
  <thead><tr><th>File #</th><th>State</th><th>Description</th><th>Premium</th></tr></thead>
  <tbody>
    <tr><td>TX-2026-04471</td><td>TX</td><td>Owner's policy, residential resale</td><td class="n">1,234.50</td></tr>
    <tr><td>WY-2026-00318</td><td>WY</td><td>Lender's policy, refinance</td><td class="n">842.00</td></tr>
    <tr><td>CO-2026-01102</td><td>CO</td><td>Owner's and lender's, simultaneous issue</td><td class="n">1,015.75</td></tr>
  </tbody>
</table>
```

### Quiz

1. Why do threads not speed up WeasyPrint rendering?
- [x] Layout is pure Python and holds the GIL
- [ ] WeasyPrint forbids threads
- [ ] PDF writing is I/O bound
> Use processes to use multiple cores.

2. What does the `cache` option store?
- [ ] Rendered pages
- [x] Decoded images shared across renders
- [ ] Parsed stylesheets
> Images used in many documents (logos) are decoded once.

3. Which CSS change usually gives the largest speed-up on a long tabular report?
- [ ] `hyphens: auto`
- [x] `table-layout: fixed`
- [ ] `break-inside: avoid` on `tbody`
> Fixed layout avoids measuring every cell to compute column widths.

### Exercises

1. **Timed render** — Write a helper that renders a file, prints elapsed seconds and page count, and returns the PDF bytes.
<details><summary>Solution</summary>

```python
import time
from weasyprint import HTML

def timed_render(path):
    t0 = time.perf_counter()
    doc = HTML(path).render()
    pdf = doc.write_pdf()
    print(f"{path}: {len(doc.pages)} pages in {time.perf_counter() - t0:.1f}s")
    return pdf
```

</details>

2. **Batch with shared resources** — Render a list of HTML strings with one `FontConfiguration`, one parsed stylesheet and an image cache.
<details><summary>Solution</summary>

```python
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

fc = FontConfiguration()
css = CSS("static/print.css", font_config=fc)
cache = {}
for i, html in enumerate(pages):
    HTML(string=html, base_url="static/").write_pdf(f"out/{i}.pdf", stylesheets=[css], font_config=fc, cache=cache)
```

</details>

### Interview Questions

**Q: A 700-page handbook takes six minutes to render. How do you attack that?**
Profile first with cProfile and the progress logger to see whether time is in text shaping, tables or page breaking. Then apply the levers in order of payoff: `table-layout: fixed` on every long table, remove `break-inside: avoid` from large containers, replace nested flex layouts in repeated components with block flow, and cut the font stack to fonts that exist. If it is still slow, split by chapter and render in a process pool, restarting page counters per chapter and merging with pikepdf. In one handbook project these steps took a render from around five minutes to under ninety seconds on a single core, and to about thirty seconds across four processes.

**Q: How do you run WeasyPrint in a web service without blocking requests?**
Never inside the request thread. Requests enqueue a job with the template context; a worker pool (Celery, RQ, or a `ProcessPoolExecutor` service) renders with a shared `FontConfiguration`, parsed CSS and image cache, writes the PDF to object storage and notifies the client. Workers are recycled after a fixed number of jobs to control memory growth, resource fetching is restricted to local assets with a custom fetcher, and render time and page count are logged per job so anomalies show up in monitoring.

**Q: What are the memory characteristics of a large render?**
The `Document` keeps every laid-out box for all pages in memory until it is written, so memory is proportional to page count and layout complexity; a few hundred pages of dense tables can reach gigabytes. Images are decoded into memory too, and without the cache option a logo on every page is decoded repeatedly. I size worker processes by memory, drop the `Document` immediately after `write_pdf()`, and split very large documents so no single process holds the whole book.

## Debugging rendering differences versus Chrome print

The most common ticket in HTML-to-PDF work is "it looks different in Chrome". Sometimes Chrome is right, sometimes WeasyPrint is, and often both are following different specs. Knowing the systematic differences turns a mystery into a checklist.

### Systematic differences

| Area | Chrome print | WeasyPrint |
|---|---|---|
| `@page` size and margins | Supported | Supported |
| Margin boxes (`@top-center`) | Only in very recent versions (131+); many headless builds ignore | Full |
| `counter(pages)`, `target-counter()`, `leader()` | Not supported | Full |
| `string-set`, `running()` | Not supported | Full |
| Named pages (`page:`) | Supported since Chrome 85 | Full |
| Flex/grid across pages | Fragments containers | Does not fragment containers |
| `box-shadow`, `filter` | Rendered | Ignored |
| JavaScript | Runs | Does not run |
| Default print scaling | Shrinks to fit unless `size` set; headless may scale | Never scales |
| Fonts | Renders with system fonts, may not embed | Always embeds |
| `-webkit-print-color-adjust` | Needed to print backgrounds | Backgrounds always printed |
| Hyphenation | `hyphens: auto` with limited languages | Pyphen dictionaries |

### A debugging workflow

1. **Render with logging on.** `weasyprint -v` or the `weasyprint` logger at INFO. Every `Ignored` line is a candidate cause.
2. **Isolate.** Copy the offending component into a `debug.html` with only the print stylesheet. Halve the CSS until the difference disappears.
3. **Inspect the boxes.** `HTML(...).render()` gives `Document.pages`; each `Page._page_box` is the box tree with positions (`position_x`, `position_y`, `width`, `height`). Walking it tells you exactly where an element landed.
4. **Read the PDF source.** `--uncompressed-pdf` produces a readable file; `pdftotext -layout` shows what text ended up where.
5. **Compare visually.** Render both to PNG with `pdftoppm -r 72` and diff with Pillow's `ImageChops.difference`.

```python
from weasyprint import HTML

doc = HTML("debug.html").render()
def walk(box, depth=0):
    tag = getattr(box, "element_tag", None)
    if tag:
        print("  " * depth + f"{tag} x={box.position_x:.1f} y={box.position_y:.1f} w={box.width:.1f} h={box.height:.1f}")
    for child in getattr(box, "children", []):
        walk(child, depth + 1)
walk(doc.pages[0]._page_box)
```

`_page_box` is private API and may change, but it is the fastest way to answer "why is this 12pt lower than I expect".

### The usual suspects

- **Missing header/footer in Chrome:** Chrome ignores margin boxes. Not a WeasyPrint bug.
- **Page count differs:** Chrome shrinks content by default; WeasyPrint respects sizes exactly. Also different default fonts (Chrome uses the OS font, WeasyPrint uses whatever fontconfig picks for `serif`), so set an explicit font stack.
- **Backgrounds missing in Chrome:** needs `-webkit-print-color-adjust: exact`; WeasyPrint prints them regardless.
- **Extra blank page:** a `height: 100vh` or `min-height` on `body`, or a trailing element with `break-after: page`. Remove viewport units.
- **Text wraps differently:** different fonts or different hyphenation. Confirm with `pdffonts` that the intended font was used.
- **Image missing only in WeasyPrint:** relative path plus missing `base_url`, or a remote resource blocked by the fetcher.
- **Table column widths differ:** Chrome and WeasyPrint implement auto layout slightly differently; use `table-layout: fixed` with `<col>` widths for determinism.
- **Flex item overflowing:** the flex container does not fragment; give it a small height or use block flow.

### Reproducible bug reports

If it really is a WeasyPrint bug, the maintainers want a minimal HTML file, the `--info` output and the command used. The project's issue tracker is on GitHub (`Kozea/WeasyPrint`), and many layout issues are fixed within a release cycle, which is another reason to pin versions and upgrade deliberately.

### Visual regression testing

```python
import subprocess
from PIL import Image, ImageChops

subprocess.run(["pdftoppm", "-r", "72", "-png", "new.pdf", "new"], check=True)
subprocess.run(["pdftoppm", "-r", "72", "-png", "golden.pdf", "golden"], check=True)
diff = ImageChops.difference(Image.open("new-1.png").convert("RGB"), Image.open("golden-1.png").convert("RGB"))
print("identical" if diff.getbbox() is None else f"differs in {diff.getbbox()}")
```

Keep a golden PDF for each template. A bounding box of the changed area tells you instantly whether a CSS edit moved something it should not have.

> **Interview note:** "Chrome shows it correctly" is a claim you should be able to test, not accept. Explain the checklist above and the two engines' spec coverage, and interviewers will hear a document engineer rather than a template user.

### Try It Yourself

```html
<style>
  /* Rules that look fine in Chrome and misbehave in WeasyPrint, with the fixes commented. */
  body { font: 10pt/1.4 Helvetica, Arial, sans-serif; margin: 2cm; }
  .wrong { min-height: 100vh; }          /* causes an extra blank page in WeasyPrint: remove */
  .fixed { min-height: 0; }
  .card { box-shadow: 0 2px 6px rgba(0,0,0,.3); border: 0.5pt solid #ccc; padding: 4mm; } /* shadow ignored; the border carries the design */
  .kpi-row { display: flex; gap: 4mm; }  /* fine: fits on one page */
  .kpi { flex: 1; border-top: 3pt solid #16A085; padding: 3mm; }
</style>
<div class="fixed">
  <div class="card"><b>Debug checklist</b>: log Ignored properties, isolate the component, walk the box tree, diff against a golden PDF.</div>
  <div class="kpi-row"><div class="kpi">Chrome: 13 pages</div><div class="kpi">WeasyPrint: 14 pages</div><div class="kpi">Cause: 100vh on body</div></div>
</div>
```

### Quiz

1. Chrome's PDF has no page numbers in the footer but WeasyPrint's does. Why?
- [x] Chrome does not support margin boxes and page counters in most versions
- [ ] WeasyPrint invents them
- [ ] The CSS is invalid
> Margin boxes and `counter(page)` are paged-media features WeasyPrint implements and Chrome largely does not.

2. A WeasyPrint PDF has an unexpected blank last page. What is the most likely cause?
- [ ] A missing `<title>`
- [x] A viewport-height rule such as `min-height: 100vh` or a trailing `break-after: page`
- [ ] Too many bookmarks
> Viewport units and trailing forced breaks push an empty page.

3. Which tool turns PDFs into images for pixel comparison?
- [ ] `pdffonts`
- [x] `pdftoppm`
- [ ] `pdfinfo`
> `pdftoppm -r 72 -png` rasterises pages so Pillow can diff them.

### Exercises

1. **Golden test** — Write a pytest test that renders `invoice.html` and asserts the page count equals 2 and the first page matches `golden-1.png` exactly.
<details><summary>Solution</summary>

```python
import subprocess
from PIL import Image, ImageChops
from weasyprint import HTML

def test_invoice(tmp_path):
    doc = HTML("invoice.html").render()
    assert len(doc.pages) == 2
    out = tmp_path / "inv.pdf"
    doc.write_pdf(out)
    subprocess.run(["pdftoppm", "-r", "72", "-png", str(out), str(tmp_path / "p")], check=True)
    new = Image.open(tmp_path / "p-1.png").convert("RGB")
    gold = Image.open("tests/golden-1.png").convert("RGB")
    assert ImageChops.difference(new, gold).getbbox() is None
```

</details>

2. **Box tree dump** — Print the tag, y position and height of every block-level box on page 3 of a rendered document.
<details><summary>Solution</summary>

```python
from weasyprint import HTML
doc = HTML("manual.html").render()

def dump(box, depth=0):
    tag = getattr(box, "element_tag", None)
    if tag and getattr(box, "is_block_level", lambda: False)() if callable(getattr(box, "is_block_level", None)) else tag:
        print("  " * depth + f"{tag} y={box.position_y:.1f} h={box.height:.1f}")
    for c in getattr(box, "children", []):
        dump(c, depth + 1)

dump(doc.pages[2]._page_box)
```

</details>

### Interview Questions

**Q: A client says the PDF has one page more than their browser's print preview. Walk through your diagnosis.**
First I check whether Chrome is scaling: its print dialog shrinks content to fit unless the page size is explicit, whereas WeasyPrint never scales. Second, fonts: if the font stack falls back differently, line breaks move; `pdffonts` confirms which font was embedded. Third, viewport units and trailing forced breaks, which add blank pages in WeasyPrint. Fourth, I render with `-v` and clear `Ignored` warnings that might change box sizes. I isolate the section where the pages diverge by comparing `pdftotext -layout` output page by page, fix the cause in the print stylesheet, and add a page-count assertion to the test suite.

**Q: How do you test HTML-to-PDF templates automatically?**
Three layers. Structural: render and assert page count, PDF title, bookmark labels and that `pdffonts` shows embedded fonts. Visual: rasterise with `pdftoppm` at low resolution and diff against golden images with Pillow, failing on any changed bounding box. Content: `pdftotext` and assert that key strings such as totals appear on the expected page. The golden images are regenerated deliberately when a design change is approved, and the tests run on a pinned WeasyPrint version so an upgrade is a visible diff rather than a surprise.

**Q: Is it ever right to use headless Chrome instead of WeasyPrint?**
Yes: when the page depends on JavaScript that cannot be reproduced server-side, when the design uses shadows, filters or complex grid that must match the web version pixel for pixel, or when the team already runs Playwright and the document has no need for running headers, page counters or a TOC. WeasyPrint wins when paged-media features matter, when fonts must be embedded reliably, and when the render must run in a small container without a browser. I have used both in one pipeline: Chrome for a dashboard snapshot, WeasyPrint for the report that embeds it.

## WeasyPrint interview questions

This chapter collects the questions that come up when a document-engineering role involves HTML-to-PDF, grouped by what the interviewer is really testing. Use it for revision after finishing the other chapters. The answers below are compact; in an interview, add one concrete example from your own work to each.

### Concept questions

These check whether you understand paged media as a model, not just as a tool. Expect: what a page box is, how margins and margin boxes relate, why `counter(pages)` can be known, what named pages are for, and what generated content means. Weak candidates describe WeasyPrint as "print to PDF from Python"; strong candidates describe it as a CSS Paged Media implementation with a Python API.

### Practical questions

These usually take the form "how would you…": chapter title in the header, page x of y, a TOC with page numbers, a landscape appendix, a cover with bleed, a repeated table header, a watermark. The mechanisms are `string-set`/`running()`, `counter(page)`/`counter(pages)`, `target-counter()` with `leader()`, named pages, `bleed`/`marks`, `<thead>`, and `position: fixed`.

### Production questions

These test whether you have shipped: pinning versions, Docker fonts, `base_url`, `FontConfiguration`, the URL fetcher for security, PDF/A validation with veraPDF, batch performance with process pools, and golden-file tests. Bring numbers: page counts, render times, file sizes before and after optimisation.

### Comparison questions

| Question | Key points |
|---|---|
| WeasyPrint vs ReportLab | Declarative CSS vs coordinate drawing; designer-friendly vs full control; both pure Python |
| WeasyPrint vs headless Chrome | Paged-media coverage vs JS and modern CSS; embedded fonts vs OS fonts; small container vs browser |
| WeasyPrint vs wkhtmltopdf | wkhtmltopdf is an unmaintained WebKit from 2012; WeasyPrint is actively developed and standards-based |
| WeasyPrint vs Prince/Antenna House | Commercial engines with broader CSS coverage and CMYK; WeasyPrint is free and good enough for most reports |
| WeasyPrint vs LaTeX | LaTeX has superior line breaking and maths; WeasyPrint has HTML templates, web skills and faster iteration |

### Sample rapid-fire round

```text
Q: Default page size and margin?            A: A4, 0.75in
Q: Import path for FontConfiguration?       A: weasyprint.text.fonts (v53+)
Q: Total page count in CSS?                 A: counter(pages)
Q: TOC page numbers?                        A: target-counter(attr(href), page) + leader()
Q: Chapter title in header?                 A: string-set + string(), or running() + element()
Q: Landscape section?                       A: page: name + @page name { size: A4 landscape }
Q: Start chapters on recto?                 A: break-before: right
Q: Repeat table header?                     A: <thead>
Q: Why images missing from string render?   A: base_url not set
Q: Archival variant flag?                   A: pdf_variant="pdf/a-3b" / --pdf-variant
Q: Validate PDF/A?                          A: veraPDF
Q: Speed up long tables?                    A: table-layout: fixed
Q: Parallelism?                             A: processes, not threads
Q: Unsupported: three examples?             A: JS, box-shadow, position: sticky
Q: Check embedded fonts?                    A: pdffonts
```

### What a strong answer sounds like

Interviewers listen for trade-offs and evidence. Compare two answers to "How do you add page numbers?":

- Weak: "You put `counter(page)` in the footer."
- Strong: "In a `@bottom-center` margin box: `content: 'Page ' counter(page) ' of ' counter(pages)`. The margin has to be tall enough to hold it, I switch to lower-roman for front matter with a named page and reset the counter at the body, and I know `counter(pages)` counts physical pages so 'of y' needs care after a reset. I verified this on a 767-page handbook where the TOC page numbers came from `target-counter`."

> **Interview note:** If you are asked something you have not done, say how you would find out: the supported-features page, the changelog for the pinned version, and a five-line test render. That is a better answer than guessing, and it is what senior engineers actually do.

### Try It Yourself

```html
<!-- A one-page "cheat sheet" you can render to PDF for revision. Page boxes only show in WeasyPrint. -->
<style>
  @page { size: A4; margin: 15mm; @bottom-center { content: "WeasyPrint cheat sheet - page " counter(page) " of " counter(pages); font: 8pt Helvetica, Arial; } }
  body { font: 9pt/1.3 Helvetica, Arial, sans-serif; columns: 2; column-gap: 8mm; }
  h2 { column-span: all; color: #16A085; margin: 0 0 3mm; }
  dt { font-weight: bold; margin-top: 2mm; break-after: avoid; }
  dd { margin: 0; break-inside: avoid; }
  code { background: #f2faf8; padding: 0 2px; }
</style>
<h2>WeasyPrint essentials</h2>
<dl>
  <dt>Page size</dt><dd><code>@page { size: A4; margin: 20mm }</code></dd>
  <dt>Footer numbering</dt><dd><code>@bottom-center { content: counter(page) " / " counter(pages) }</code></dd>
  <dt>Chapter in header</dt><dd><code>h1 { string-set: ch content() }</code> then <code>content: string(ch)</code></dd>
  <dt>TOC numbers</dt><dd><code>a::after { content: leader(".") target-counter(attr(href), page) }</code></dd>
  <dt>Landscape section</dt><dd><code>page: wide</code> + <code>@page wide { size: A4 landscape }</code></dd>
  <dt>Recto chapters</dt><dd><code>h1 { break-before: right }</code></dd>
  <dt>Archival</dt><dd><code>write_pdf(pdf_variant="pdf/a-3b")</code>, validate with veraPDF</dd>
  <dt>Fonts</dt><dd>One <code>@font-face</code> per face; share <code>FontConfiguration</code>; check <code>pdffonts</code></dd>
</dl>
```

### Quiz

1. Which comparison point is true of wkhtmltopdf versus WeasyPrint?
- [x] wkhtmltopdf uses an old, unmaintained WebKit; WeasyPrint is actively developed
- [ ] wkhtmltopdf supports margin boxes and WeasyPrint does not
- [ ] They share the same rendering engine
> wkhtmltopdf froze on a 2012 QtWebKit and was archived; WeasyPrint tracks current CSS specs.

2. An interviewer asks how you would find out whether a CSS property is supported. Best answer?
- [ ] Assume it is if Chrome supports it
- [x] Check the supported-features page and changelog for the pinned version, then test-render
- [ ] Ask the client
> Evidence over assumption; the answer also shows you know coverage changes by version.

3. What is the most convincing element of a production answer?
- [ ] Naming many libraries
- [x] Concrete numbers from real work such as page counts and render times
- [ ] Saying the tool is easy
> Specific measurements separate experience from reading the docs.

### Exercises

1. **Two-minute pitch** — Write a 4-sentence answer to "Tell me about a document pipeline you built with WeasyPrint."
<details><summary>Solution</summary>

I built a weekly production status report for a title-insurance support team: a Jinja2 template with autoescaping, a print stylesheet with named pages for the landscape rate matrix, running headers carrying the section title and a TOC using `target-counter`. Data came from the tracker CSV, was aggregated per state in Python and rendered in a four-process pool with a shared font configuration and image cache, taking about nine seconds for eleven reports. CI asserted page count, PDF title and embedded fonts, and diffed the first page against a golden image. The deliverable was also produced as PDF/A-3b with the source CSV attached for the compliance archive.

</details>

2. **Trade-off table** — Fill a three-row table comparing WeasyPrint, ReportLab and headless Chrome for a 300-page manual with a TOC and running headers.
<details><summary>Solution</summary>

| Tool | Fit | Reason |
|---|---|---|
| WeasyPrint | Best | Native TOC page numbers, running headers, named pages, embedded fonts, CSS templates |
| ReportLab | Possible | Full control but TOC and headers must be coded with Platypus templates and a two-pass build |
| Headless Chrome | Poor | No `target-counter`, weak margin-box support, browser dependency in the container |

</details>

### Interview Questions

**Q: Summarise WeasyPrint in one minute for a non-technical hiring manager.**
WeasyPrint turns web pages into print-quality PDFs. Designers work in HTML and CSS, which their team already knows, and the engine adds everything paper needs: page sizes, margins, headers and footers, page numbers, chapter titles that follow the content, tables that repeat their headings, and a clickable outline. It runs on a server without a browser, embeds fonts so the PDF looks the same everywhere, and can produce archival PDF/A files. I use it whenever a document is generated from data, from invoices to 700-page manuals, because a change to the template updates every future document.

**Q: What would you check before upgrading WeasyPrint in production?**
The changelog for behaviour changes in layout, flex, grid and the API (for example the `write_pdf` keyword changes in v60 and the tagging options in v65), then a render of every template against golden PDFs with page-count and visual diffs, then render timing on the benchmark document, then veraPDF for the archival outputs. I upgrade in a branch, review the diffs with whoever owns the templates, and pin the new version. Skipping this once cost a client a reprint when a page break moved a signature block onto its own page.

**Q: What is a mistake you made with WeasyPrint and what did you learn?**
Early on I rendered from an HTML string without `base_url` and shipped a report with a missing logo because the log was silent at the default level. I learned to run verbose logging in development, to fail the build on `Failed to load` messages, and to add a QA step that lists embedded images. The general lesson is that a PDF generator that quietly degrades needs its warnings promoted to errors in CI, which is now part of every pipeline I set up.

