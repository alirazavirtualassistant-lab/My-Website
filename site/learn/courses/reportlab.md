---
id: reportlab
title: ReportLab
icon: 🖨️
track: Document Engineering
color: #B03A2E
runner: python
packages: reportlab
tagline: Programmatic PDF generation in Python, from canvas drawing to Platypus flowables.
description: ReportLab from the low-level canvas to expert Platypus document engineering: coordinates and units, text and fonts (TTF embedding), shapes and images, Platypus flowables, paragraph styles and markup, tables and styling, page templates and frames, headers/footers, TOC, charts, forms, and generating branded multi-page reports at scale.
---

# LEVEL: Beginner

## Installing ReportLab & your first canvas

ReportLab is the oldest and most widely deployed PDF library for Python. It does not convert HTML or DOCX; it **draws** PDF pages directly from Python calls. That makes it the right tool when you need pixel-exact control: rate matrices, certificates, production status reports, invoices, or a 700-page handbook generated from a database.

Install it with pip. The wheel is pure Python since version 4.0 (2023), so it installs on Windows, macOS and Linux without a compiler.

```bash
pip install reportlab
python -c "import reportlab; print(reportlab.__version__)"
```

ReportLab has two layers. The **canvas** (`reportlab.pdfgen.canvas`) is the low-level painter: you place every string and line at an x/y position. **Platypus** (`reportlab.platypus`) is the high-level layout engine that flows paragraphs and tables across pages for you. Beginners start with the canvas because everything in Platypus is eventually drawn on one.

### Your first PDF

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

c = canvas.Canvas("hello.pdf", pagesize=A4)
c.setFont("Helvetica", 14)
c.drawString(72, 770, "Title Production Report - Week 37")
c.showPage()
c.save()
```

Line by line: `Canvas()` opens a document and takes a filename or any file-like object. `setFont()` picks one of the 14 built-in PDF fonts and a size in points. `drawString(x, y, text)` paints text with its **baseline** starting at `(72, 770)`. `showPage()` finishes the current page. `save()` writes the whole file to disk. Nothing is written until `save()`, so if your script crashes halfway you get no file at all, which is safer than a half-written one.

### The canvas object model

| Method | What it does |
|---|---|
| `Canvas(file, pagesize=A4)` | Create a document; `file` may be a path or `io.BytesIO()` |
| `setFont(name, size)` | Choose font for subsequent text |
| `drawString(x, y, s)` | Draw text with baseline at (x, y) |
| `showPage()` | End the current page and start a new one |
| `save()` | Serialise the PDF; the canvas cannot be used afterwards |
| `getPageNumber()` | 1-based number of the page currently being drawn |

Every state you set (font, colour, line width) is reset by `showPage()`. That surprises beginners: after `showPage()` you must call `setFont()` again or you will get the default Helvetica 12.

### Writing to memory instead of disk

Web apps and tests rarely want a file on disk. Pass a `BytesIO` buffer and the PDF bytes stay in memory, ready to return from Flask, attach to an email or upload to S3.

```python
import io
from reportlab.pdfgen import canvas

buf = io.BytesIO()
c = canvas.Canvas(buf)
c.drawString(100, 700, "In-memory PDF")
c.save()
pdf_bytes = buf.getvalue()
print(len(pdf_bytes), "bytes, starts with", pdf_bytes[:8])
```

The output begins with `%PDF-1.4`, the PDF header. ReportLab targets PDF 1.4 by default, which every reader since Acrobat 5 opens; you can raise it with `pdfVersion=(1, 7)` when you need newer features such as transparency groups.

> **Tip:** Keep a helper that counts pages in raw bytes while you learn. Each page dictionary contains `/Type /Page`, so `len(re.findall(rb"/Type\s*/Page\b", data))` returns the page count without installing another library.

### Try It Yourself

```python
import io, re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

def page_count(data):
    return len(re.findall(rb"/Type\s*/Page\b", data))

buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=A4)
c.setFont("Helvetica-Bold", 16)
c.drawString(72, 770, "Stewart Title - Weekly Production Status")
c.setFont("Helvetica", 11)
c.drawString(72, 750, "Prepared by Ali Raza, Production Support")
c.showPage()
c.drawString(72, 770, "Page two: state summary")
c.showPage()
c.save()

data = buf.getvalue()
print(len(data), "bytes")
print(page_count(data), "pages")
```

### Quiz

1. When is the PDF actually written to the file or buffer?
- [ ] After every `drawString()`
- [ ] After every `showPage()`
- [x] Only when `save()` is called
> ReportLab buffers all page content in memory and serialises the document in `save()`.

2. What happens to the current font after `showPage()`?
- [x] It resets to the default (Helvetica 12)
- [ ] It is kept for the next page
- [ ] The font is embedded twice
> Graphics state, including font, colour and line width, is reset at every page boundary.

3. Which argument lets you build a PDF without touching the disk?
- [ ] `Canvas(None)`
- [x] `Canvas(io.BytesIO())`
- [ ] `Canvas("memory://pdf")`
> Any object with a `write()` method works; `BytesIO` is the standard choice for web responses and tests.

### Exercises

1. **Three-page skeleton** — Create a three-page PDF in memory where each page shows "Page N" in Helvetica 20, and print the page count.
<details><summary>Solution</summary>

```python
import io, re
from reportlab.pdfgen import canvas

buf = io.BytesIO()
c = canvas.Canvas(buf)
for n in range(1, 4):
    c.setFont("Helvetica", 20)
    c.drawString(72, 700, f"Page {n}")
    c.showPage()
c.save()
data = buf.getvalue()
print(len(re.findall(rb"/Type\s*/Page\b", data)))  # 3
```

</details>

2. **Save to disk and to memory** — Write a function `build(target)` that draws a title and works whether `target` is a filename string or a `BytesIO`.
<details><summary>Solution</summary>

```python
import io
from reportlab.pdfgen import canvas

def build(target):
    c = canvas.Canvas(target)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(72, 720, "Policy Manual")
    c.save()

buf = io.BytesIO()
build(buf)            # memory
build("manual.pdf")   # disk
print(len(buf.getvalue()))
```

</details>

### Interview Questions

**Q: What is the difference between the ReportLab canvas and Platypus, and when do you pick each?**
The canvas is an imperative painter: you set fonts and colours and place each string, line and image at absolute coordinates, so it is ideal for fixed layouts such as certificates, cheque overlays, labels and pre-printed forms. Platypus is a flow layout engine built on top of the canvas: you hand it a list of flowables (paragraphs, tables, images) and it wraps, splits and paginates them across frames. For a 700-page handbook or a data-driven report with variable-length tables you want Platypus, because it handles page breaks. For a one-page rate card matching a client mock-up to the millimetre, the canvas is faster to write and easier to reason about. In practice most real projects mix both: Platypus for the body and canvas callbacks for headers, footers and watermarks.

**Q: Why does nothing appear in the file until `save()` is called, and what are the implications?**
ReportLab builds an in-memory object tree (`PDFDocument`) as you draw, and only in `save()` does it assign object numbers, write the cross-reference table and flush bytes. The implication is that memory grows with the document size, so a 5,000-page batch should be split into chunks and merged afterwards with pypdf or pikepdf. It also means a crash mid-generation leaves no partial file, which is good for pipelines that watch a folder for finished PDFs. Finally, since the canvas is single-use, you cannot append to a saved document; you create a new canvas or post-process the file.

**Q: Which PDF version does ReportLab write and can you change it?**
By default ReportLab writes a PDF 1.4 header, which is a deliberately conservative choice so files open in very old readers. You can pass `pdfVersion=(1, 5)` or higher to `Canvas`, and some features such as transparency (`setFillAlpha`) or 16-bit images require it. Raising the version does not change what is drawn; it only tells readers which feature set to expect. For archival or print workflows you will later combine this with metadata and, if needed, post-conversion to PDF/A or PDF/X.

## Coordinates, units & page sizes

PDF coordinates confuse everyone the first time. The origin `(0, 0)` is the **bottom-left** corner of the page, `x` grows to the right and `y` grows **upward**. This is the opposite of screens and of Word, where you think from the top down.

The unit is the **point**: 1 pt = 1/72 inch. An A4 page is 595.27 × 841.89 pt; US Letter is 612 × 792 pt. Because nobody enjoys multiplying by 72, `reportlab.lib.units` exports constants you multiply by.

```python
from reportlab.lib.units import inch, cm, mm
print(inch, cm, mm)   # 72.0 28.346... 2.834...
print(2.5 * cm)       # 70.86 points
```

### Page sizes

`reportlab.lib.pagesizes` contains every ISO and US size plus helpers to rotate them.

```python
from reportlab.lib.pagesizes import A4, letter, legal, landscape, portrait
w, h = A4
print(w, h)                       # 595.27 841.89
print(landscape(A4))              # (841.89, 595.27)
print(letter)                     # (612.0, 792.0)
```

The page size is a plain `(width, height)` tuple, so a custom size such as a 6 × 9 inch book block is just `(6 * inch, 9 * inch)`. You can also change size per page with `c.setPageSize(landscape(A4))` before drawing that page, which is how you slip a landscape rate matrix into a portrait report.

| Size | Points | Millimetres |
|---|---|---|
| A4 | 595.27 × 841.89 | 210 × 297 |
| Letter | 612 × 792 | 215.9 × 279.4 |
| Legal | 612 × 1008 | 215.9 × 355.6 |
| 6×9 in book | 432 × 648 | 152.4 × 228.6 |

### Thinking from the top

Most layouts are designed top-down, so define your own top margin and count downwards. A small helper keeps the maths in one place.

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm

W, H = A4
MARGIN = 20 * mm

c = canvas.Canvas("coords.pdf", pagesize=A4)
y = H - MARGIN                    # start 20 mm below the top edge
for i in range(5):
    c.drawString(MARGIN, y, f"Line {i + 1} at y = {y:.1f} pt")
    y -= 14                       # move down one line of 14 pt leading
c.save()
```

The `y -= 14` step is the **leading**, the distance between baselines. For 11 pt body text a leading of 13 to 14 pt is comfortable.

### Transforms

The canvas also supports affine transforms. `translate(dx, dy)` moves the origin, `rotate(deg)` rotates anticlockwise, `scale(sx, sy)` stretches. Always wrap transforms in `saveState()` / `restoreState()` so they do not leak into the rest of the page.

```python
c.saveState()
c.translate(W / 2, H / 2)     # origin now at page centre
c.rotate(45)
c.setFont("Helvetica-Bold", 60)
c.drawCentredString(0, 0, "DRAFT")
c.restoreState()
```

Transforms are exactly how watermarks, rotated table headers and vertical spine text on book covers are drawn.

> **Warning:** Anything drawn outside the page box (negative coordinates or beyond the width/height) is silently clipped by the viewer. If text "disappears", print the coordinates first; nine times out of ten `y` went negative.

### Try It Yourself

```python
import io, re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm, inch

buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=A4)
W, H = A4
c.setFont("Helvetica", 10)
# draw a ruler along the bottom edge every 10 mm
for k in range(0, 22):
    x = k * 10 * mm
    c.line(x, 0, x, 5 * mm if k % 5 else 10 * mm)
    if k % 5 == 0:
        c.drawString(x + 1, 11 * mm, f"{k * 10} mm")
c.drawString(20 * mm, H - 20 * mm, f"A4 is {W:.0f} x {H:.0f} pt")
c.showPage()
c.setPageSize(landscape(A4))
c.drawString(inch, inch, "This page is landscape")
c.showPage()
c.save()
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. Where is the origin of a ReportLab page?
- [ ] Top-left, like a screen
- [x] Bottom-left, with y increasing upwards
- [ ] The centre of the page
> PDF uses the PostScript convention: the origin is the bottom-left corner.

2. How many points are in one inch?
- [x] 72
- [ ] 96
- [ ] 100
> A PDF point is 1/72 inch; 96 is the CSS pixel density, not the PDF unit.

3. What does `landscape(A4)` return?
- [ ] A rotated canvas object
- [x] The tuple `(841.89, 595.27)`
- [ ] A new page in the document
> Page sizes are plain tuples; `landscape()` swaps width and height if needed.

### Exercises

1. **Margin grid** — Draw a light rectangle showing the printable area of an A4 page with 15 mm margins on all sides.
<details><summary>Solution</summary>

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
W, H = A4
m = 15 * mm
c = canvas.Canvas("grid.pdf", pagesize=A4)
c.setLineWidth(0.3)
c.rect(m, m, W - 2 * m, H - 2 * m)
c.save()
```

</details>

2. **Book block** — Create a 6 × 9 inch page and print its size in millimetres.
<details><summary>Solution</summary>

```python
from reportlab.lib.units import inch, mm
size = (6 * inch, 9 * inch)
print(round(size[0] / mm, 1), round(size[1] / mm, 1))  # 152.4 228.6
```

</details>

### Interview Questions

**Q: Explain the PDF coordinate system and how you avoid mistakes with it.**
PDF inherits the PostScript model: the origin sits at the bottom-left corner, units are points (1/72 in) and y grows upward, so a top margin of 20 mm on A4 is `841.89 - 20*mm`. The usual mistake is computing positions top-down and forgetting to subtract from the page height, which pushes content off the bottom. I define `W, H = pagesize` once, express every position relative to the top with `H - offset`, and keep a running `y` cursor that I decrement by the leading. For rotated or centred elements I use `translate`/`rotate` inside `saveState`/`restoreState` rather than trigonometry. Print the numbers when something vanishes; the viewer clips silently.

**Q: How would you produce a document that mixes portrait and landscape pages?**
On the canvas you call `c.setPageSize(landscape(A4))` before drawing the landscape page and set it back afterwards; the size is recorded per page in the `/MediaBox`. In Platypus you define two `PageTemplate` objects with different `pagesize` values and switch with `NextPageTemplate('Landscape')` followed by a `PageBreak()`. I used exactly this for a title-insurance production report where the 14-column rate matrix needed landscape while the narrative stayed portrait. The gotcha is that header and footer callbacks must read `doc.pagesize` at draw time rather than assuming A4.

**Q: What unit helpers does ReportLab give you and why use them?**
`reportlab.lib.units` exports `inch`, `cm`, `mm`, `pica` and `toLength()` as multipliers to points. Using `20 * mm` instead of `56.69` makes layouts readable and lets a designer's spec in millimetres translate directly into code. `toLength("2.5cm")` parses strings, which is handy when margins come from a JSON configuration. Under the hood everything is still floats in points, so rounding is only a concern when you compare positions for equality.

## Drawing text & built-in fonts

Text is the bulk of any report, and the canvas gives you several ways to draw it. The simplest is `drawString`, but you also get right-aligned and centred variants, a `stringWidth` measurement function and **text objects** for multi-line output.

### The 14 standard fonts

Every PDF reader ships these fonts, so ReportLab can use them without embedding anything: Helvetica, Times-Roman and Courier, each in regular, Bold, Oblique/Italic and BoldOblique/BoldItalic, plus Symbol and ZapfDingbats.

```python
from reportlab.pdfbase import pdfmetrics
print(pdfmetrics.standardFonts)
```

Their exact names matter: `Helvetica-Bold`, `Times-Italic`, `Courier-BoldOblique`. A misspelled name raises `KeyError` at draw time. These fonts only cover the Latin-1 (WinAnsi) character set; Urdu, Arabic, Chinese or even the Euro sign in some viewers need a TrueType font, covered in the Intermediate level.

### Alignment helpers

```python
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
W, H = A4
c = canvas.Canvas("text.pdf", pagesize=A4)
c.setFont("Helvetica", 12)
c.drawString(72, 750, "Left aligned at x=72")
c.drawCentredString(W / 2, 730, "Centred on the page")
c.drawRightString(W - 72, 710, "Right aligned to x=523")
c.save()
```

`drawCentredString` centres the text on the x you give, and `drawRightString` ends the text at that x. Both use the current font metrics, so change the font before calling them.

### Measuring text

`stringWidth(text, fontName, fontSize)` returns the width in points. You need it to right-align numbers in a column, to decide whether a client name fits in a box, or to draw a rule exactly under a heading.

```python
from reportlab.pdfbase.pdfmetrics import stringWidth
w = stringWidth("Total premium: $1,245.00", "Helvetica-Bold", 12)
print(round(w, 2))
c.setFont("Helvetica-Bold", 12)
c.drawString(72, 690, "Total premium: $1,245.00")
c.line(72, 687, 72 + w, 687)     # underline exactly the text width
```

### Text objects for paragraphs

Calling `drawString` for every line means you manage the y cursor yourself. A **text object** keeps its own cursor and advances by the leading each time you call `textLine`.

```python
t = c.beginText(72, 650)
t.setFont("Times-Roman", 11)
t.setLeading(14)
for line in ["Section 4.2 - Escrow disbursement", "All wires require two approvals.", "Exceptions are logged in the QA tracker."]:
    t.textLine(line)
c.drawText(t)
```

Text objects also support `setCharSpace`, `setWordSpace`, `setRise` (superscript) and `textOut` (no line advance). They are more efficient than repeated `drawString` calls because they emit one `BT ... ET` block in the PDF content stream.

### Colour, rendering mode and simple wrapping

`setFillColor` affects text (glyphs are filled), while `setStrokeColor` affects outlines drawn with `setTextRenderMode(1)`. For wrapping you can use `reportlab.lib.utils.simpleSplit`, which breaks a string into lines that fit a width using real font metrics.

```python
from reportlab.lib.utils import simpleSplit
from reportlab.lib import colors
text = "This clause explains how title commitments are reviewed before closing and who signs off."
lines = simpleSplit(text, "Helvetica", 10, 200)   # 200 pt wide column
c.setFillColor(colors.HexColor("#B03A2E"))
t = c.beginText(72, 600); t.setFont("Helvetica", 10); t.setLeading(12)
for ln in lines: t.textLine(ln)
c.drawText(t)
```

> **Interview note:** Interviewers like to ask why `drawString` does not wrap. The canvas is a painter, not a layout engine; wrapping is a layout decision, which is why `Paragraph` in Platypus exists. `simpleSplit` is the bridge for small canvas-only jobs.

### Try It Yourself

```python
import io, re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.utils import simpleSplit

W, H = A4
buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=A4)
c.setFont("Helvetica-Bold", 18)
c.drawCentredString(W / 2, H - 72, "Escrow Disbursement SOP")
w = stringWidth("Escrow Disbursement SOP", "Helvetica-Bold", 18)
c.line(W / 2 - w / 2, H - 76, W / 2 + w / 2, H - 76)

body = ("Every outgoing wire must be matched to the settlement statement, "
        "verified by a second approver and logged in the QA tracker within "
        "the same business day. Discrepancies above $50 are escalated.")
t = c.beginText(72, H - 110)
t.setFont("Times-Roman", 11); t.setLeading(14)
for ln in simpleSplit(body, "Times-Roman", 11, W - 144):
    t.textLine(ln)
c.drawText(t)
c.setFont("Courier", 9)
c.drawRightString(W - 72, 40, "Rev 3 - Sept 2026")
c.showPage(); c.save()
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. Which of these is a valid standard font name?
- [ ] `Arial-Bold`
- [x] `Helvetica-BoldOblique`
- [ ] `Times-Bold-Italic`
> The 14 standard fonts use PostScript names; Arial is not one of them and Times bold italic is `Times-BoldItalic`.

2. What does `drawRightString(x, y, s)` do?
- [x] Draws `s` so that it ends at `x`
- [ ] Draws `s` starting at `x` in right-to-left order
- [ ] Draws `s` on the right page margin automatically
> It measures the string and shifts the start point left by its width.

3. Why use a text object instead of repeated `drawString` calls?
- [ ] Text objects can wrap automatically
- [x] They keep their own cursor and produce a single efficient text block
- [ ] They embed fonts
> `beginText`/`textLine` manage leading for you and emit one BT/ET block; wrapping still needs `simpleSplit` or Platypus.

### Exercises

1. **Aligned amounts** — Draw three labelled amounts (Premium, Endorsements, Total) with labels left-aligned at x=72 and amounts right-aligned at x=300.
<details><summary>Solution</summary>

```python
from reportlab.pdfgen import canvas
c = canvas.Canvas("amounts.pdf")
rows = [("Premium", "1,245.00"), ("Endorsements", "150.00"), ("Total", "1,395.00")]
y = 700
for label, amt in rows:
    c.setFont("Helvetica-Bold" if label == "Total" else "Helvetica", 11)
    c.drawString(72, y, label)
    c.drawRightString(300, y, amt)
    y -= 16
c.save()
```

</details>

2. **Fit or shrink** — Write `fit_font(text, max_width, start=14)` that returns the largest font size at or below `start` for which Helvetica text fits in `max_width`.
<details><summary>Solution</summary>

```python
from reportlab.pdfbase.pdfmetrics import stringWidth
def fit_font(text, max_width, start=14, font="Helvetica"):
    size = start
    while size > 4 and stringWidth(text, font, size) > max_width:
        size -= 0.5
    return size
print(fit_font("Stewart Title Guaranty Company of Pakistan", 150))
```

</details>

### Interview Questions

**Q: What are the limitations of the 14 standard fonts and how do you get around them?**
They are not embedded, so rendering depends on the viewer's substitutes, and their encoding is WinAnsi, which covers Western European Latin only. Any Urdu, Arabic, Hindi, CJK or even curly quotes outside Latin-1 render as black boxes or raise encoding errors. The fix is to register a TrueType font with `pdfmetrics.registerFont(TTFont(...))`, which ReportLab subsets and embeds, guaranteeing identical output everywhere. For PDF/A you must embed everything, so even Helvetica has to be replaced with an embedded equivalent such as Liberation Sans. I keep a small fonts folder in every project and register at import time.

**Q: How do you right-align a column of numbers on the canvas?**
Use `drawRightString(x, y, text)` with the same x for every row, which measures each string via `stringWidth` and shifts it left. For decimal alignment you can go further: split at the decimal point, right-align the integer part to x and draw the fraction with `drawString` starting at x, so the points line up even when fractions differ in length. Numbers should also be formatted consistently with `f"{value:,.2f}"` before measuring. For anything beyond a handful of rows I would switch to a Platypus `Table` with `('ALIGN', (1,0), (-1,-1), 'RIGHT')`.

**Q: When would you use `simpleSplit` versus `Paragraph`?**
`simpleSplit(text, font, size, width)` just breaks a string into lines using real metrics; it does no styling, no justification and no page splitting, but it is perfect for a two-line address in a fixed box on a canvas form. `Paragraph` understands inline markup, alignment, indents, bullets and can split itself across frames and pages. If the text might exceed its box, or needs bold runs and hyperlinks, use `Paragraph`; you can still draw a single `Paragraph` on a canvas with `p.wrapOn(c, w, h)` followed by `p.drawOn(c, x, y)`.

## Lines, shapes & colours

Rules, boxes and fills turn plain text into a document that looks designed. The canvas offers primitives for lines, rectangles, circles, ellipses, rounded rectangles, Bézier curves and arbitrary paths, plus a rich colour model.

### Stroke and fill

Every shape has two optional aspects: the **stroke** (outline) and the **fill** (interior). You control them with separate colours and pass `stroke=1/0` and `fill=1/0` to each drawing call.

```python
from reportlab.pdfgen import canvas
from reportlab.lib import colors
c = canvas.Canvas("shapes.pdf")
c.setStrokeColor(colors.black)
c.setFillColor(colors.HexColor("#B03A2E"))
c.setLineWidth(1.5)
c.rect(72, 650, 200, 60, stroke=1, fill=1)      # filled box with outline
c.roundRect(300, 650, 200, 60, radius=8, stroke=1, fill=0)
c.circle(120, 560, 30, fill=1)
c.ellipse(200, 530, 320, 590)                    # bounding box x1,y1,x2,y2
c.line(72, 500, 520, 500)
c.save()
```

Note the inconsistency: `rect` takes `(x, y, width, height)` but `ellipse` takes two corners. Read the signature when a shape looks wrong.

### Line style

`setLineWidth(pt)`, `setDash(array, phase)`, `setLineCap(0|1|2)` and `setLineJoin(0|1|2)` control how strokes look. A 0.25 pt hairline is the traditional table rule; dashed lines are `setDash(3, 2)` (3 on, 2 off). Reset dashes with `setDash()` and no arguments, or wrap the change in `saveState()`/`restoreState()`.

```python
c.setDash(4, 2)
c.line(72, 480, 520, 480)      # dashed "cut here" line
c.setDash()                    # back to solid
```

### Colours

`reportlab.lib.colors` gives you named colours (`colors.red`, `colors.whitesmoke`, all CSS names), `HexColor("#16A085")`, `Color(r, g, b, alpha=1)` with components 0–1, `CMYKColor(c, m, y, k)` and `PCMYKColor` (0–100 scale, used by print people). Use CMYK when the file is going to a commercial printer, because RGB will be converted by someone else's profile and the brand red will shift.

```python
from reportlab.lib.colors import CMYKColor, PCMYKColor, Color
brand = PCMYKColor(0, 85, 80, 20)      # percentages
c.setFillColor(brand)
c.rect(72, 400, 100, 40, fill=1, stroke=0)
c.setFillColor(Color(0, 0, 0, alpha=0.3))   # 30% black, needs pdfVersion >= 1.4
c.rect(100, 410, 100, 40, fill=1, stroke=0)
```

`setFillAlpha(0.3)` and `setStrokeAlpha()` are alternatives to alpha in the colour object. Transparency is a PDF 1.4 feature and some print shops will ask you to flatten it, which is covered in the prepress course.

### Paths

For anything not covered by the primitives (arrows, chevrons, a triangular "sold" corner) build a path.

```python
p = c.beginPath()
p.moveTo(72, 300)
p.lineTo(172, 300)
p.lineTo(122, 360)
p.close()
c.setFillColor(colors.HexColor("#7B241C"))
c.drawPath(p, stroke=0, fill=1)
```

Paths also support `curveTo` (cubic Bézier), `arc`, `arcTo` and `rect`. `c.clipPath(p, stroke=0)` turns the path into a clipping region, which is how you crop an image into a circle for a staff photo.

### A table grid by hand

Before you learn Platypus tables, it is worth drawing one manually once, because it teaches how row heights and column widths relate.

```python
cols = [72, 200, 320, 440, 520]        # x edges of 4 columns
rows = [700, 682, 664, 646]            # y edges of 3 rows
c.setLineWidth(0.5)
for x in cols: c.line(x, rows[0], x, rows[-1])
for y in rows: c.line(cols[0], y, cols[-1], y)
c.setFillColor(colors.whitesmoke)
c.rect(cols[0], rows[1], cols[-1] - cols[0], rows[0] - rows[1], fill=1, stroke=0)  # header band
```

> **Tip:** Draw fills first and strokes last. A filled rectangle drawn after a line covers it, and the classic "my grid lines are missing" bug is just draw order.

### Try It Yourself

```python
import io, re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm

W, H = A4
buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=A4)
# letterhead band
c.setFillColor(colors.HexColor("#B03A2E"))
c.rect(0, H - 25 * mm, W, 25 * mm, fill=1, stroke=0)
c.setFillColor(colors.white)
c.setFont("Helvetica-Bold", 20)
c.drawString(20 * mm, H - 16 * mm, "ALI RAZA  |  Document Engineering")
# QA score gauge: 5 boxes, 4 filled
for i in range(5):
    x = 20 * mm + i * 12 * mm
    c.setFillColor(colors.HexColor("#16A085") if i < 4 else colors.white)
    c.setStrokeColor(colors.grey)
    c.roundRect(x, H - 50 * mm, 10 * mm, 10 * mm, 2 * mm, fill=1, stroke=1)
# dashed signature line
c.setStrokeColor(colors.black); c.setDash(3, 2)
c.line(20 * mm, 40 * mm, 100 * mm, 40 * mm); c.setDash()
c.setFillColor(colors.black); c.setFont("Helvetica", 8)
c.drawString(20 * mm, 36 * mm, "Authorised signature")
c.showPage(); c.save()
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. What do `stroke` and `fill` control in `c.rect(x, y, w, h, stroke=1, fill=1)`?
- [x] Whether the outline and the interior are painted
- [ ] The line width and the colour
- [ ] Whether the rectangle is clipped
> Stroke is the outline using the stroke colour; fill is the interior using the fill colour.

2. Which colour class takes percentages 0–100?
- [ ] `CMYKColor`
- [x] `PCMYKColor`
- [ ] `HexColor`
> `CMYKColor` uses 0–1 floats; `PCMYKColor` is the percentage variant designers quote.

3. A grid line disappears after you add a header background. Most likely cause?
- [ ] The line width is too small
- [x] The filled rectangle was drawn after the line and covered it
- [ ] Lines cannot cross filled areas
> PDF paints in order; later fills cover earlier strokes.

### Exercises

1. **Progress bar** — Draw a 150 pt wide bar showing 72% completion with a grey background and green fill, and print the percentage to its right.
<details><summary>Solution</summary>

```python
from reportlab.pdfgen import canvas
from reportlab.lib import colors
c = canvas.Canvas("bar.pdf")
pct = 0.72
c.setFillColor(colors.lightgrey); c.rect(72, 700, 150, 12, fill=1, stroke=0)
c.setFillColor(colors.HexColor("#16A085")); c.rect(72, 700, 150 * pct, 12, fill=1, stroke=0)
c.setFillColor(colors.black); c.drawString(230, 702, f"{pct:.0%}")
c.save()
```

</details>

2. **Circular photo frame** — Use a clipping path to draw a rectangle image area inside a circle of radius 40.
<details><summary>Solution</summary>

```python
from reportlab.pdfgen import canvas
from reportlab.lib import colors
c = canvas.Canvas("clip.pdf")
c.saveState()
p = c.beginPath(); p.circle(150, 600, 40)
c.clipPath(p, stroke=0)
c.setFillColor(colors.HexColor("#7B241C"))
c.rect(100, 550, 100, 100, fill=1, stroke=0)   # would be c.drawImage(...) in practice
c.restoreState()
c.save()
```

</details>

### Interview Questions

**Q: Explain the difference between RGB, CMYK and spot colours in ReportLab output.**
`Color`/`HexColor` write DeviceRGB operators, `CMYKColor`/`PCMYKColor` write DeviceCMYK, and `CMYKColorSep` with a `spotName` writes a Separation colour space so the printer sees a named plate such as PANTONE 186 C. Viewers show all three on screen, but a commercial press needs CMYK or spot values it does not have to guess. I use `enforceColorSpace='CMYK'` on the canvas for print jobs so an accidental RGB call raises an error rather than producing a shifted brand colour. For screen-only reports RGB is fine and smaller.

**Q: How would you draw a dashed cut line that does not affect subsequent drawing?**
Wrap it: `c.saveState()`, `c.setDash(3, 2)`, draw the line, `c.restoreState()`. `saveState` pushes the whole graphics state (colours, line width, dash, transform, clip) and `restoreState` pops it, so nothing leaks. Calling `setDash()` with no arguments also resets, but the state stack is safer when the drawing code is in a helper that others reuse. The same discipline applies to `translate`/`rotate` and to clipping paths, which otherwise clip everything drawn afterwards.

**Q: Why might transparency in a ReportLab PDF cause trouble at a print shop?**
Alpha values write ExtGState transparency, which is a PDF 1.4 feature and is not allowed in PDF/X-1a. Older RIPs flatten transparency themselves and can produce hairline artefacts or colour shifts where transparent objects overlap. The safe approach for print is to avoid alpha and instead pre-compute the blended colour, or to export PDF/X-4 where live transparency is permitted and the RIP is modern. For screen reports alpha is harmless and useful for watermarks.

## Images & saving to files or memory

Reports need logos, signatures, charts exported from Excel and scanned exhibits. The canvas draws raster images with `drawImage`, backed by Pillow, and can read from a path, a URL or an in-memory buffer.

```bash
pip install pillow
```

### drawImage

```python
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
c = canvas.Canvas("logo.pdf")
c.drawImage("logo.png", 20 * mm, 250 * mm, width=40 * mm, height=15 * mm,
            preserveAspectRatio=True, anchor="sw", mask="auto")
c.save()
```

Arguments: position `(x, y)` of the bottom-left corner, optional `width`/`height` in points (omit to use the image's pixel size at 72 dpi, which is usually huge), `preserveAspectRatio=True` to fit inside the box without distortion, `anchor` to say where the image sits inside that box (`'c'`, `'n'`, `'sw'` and so on), and `mask="auto"` so PNG transparency is honoured. Supported formats are whatever Pillow can open: PNG, JPEG, GIF, BMP, TIFF, WebP.

### ImageReader and in-memory images

If the same logo appears on 300 pages, wrap it once in `ImageReader`. ReportLab then embeds the image data a single time as an XObject and reuses it, instead of decoding the file on every page.

```python
import io
from reportlab.lib.utils import ImageReader
from PIL import Image

logo = ImageReader("logo.png")       # from disk, decoded once
w, h = logo.getSize()

# from bytes, e.g. a chart PNG produced by matplotlib
img = Image.new("RGB", (200, 80), "#16A085")
bio = io.BytesIO(); img.save(bio, format="PNG"); bio.seek(0)
chart = ImageReader(bio)
c.drawImage(chart, 72, 500, width=200, height=80)
```

`ImageReader` also accepts a PIL `Image` object directly and an `http(s)://` URL.

### Resolution and file size

A PDF has no dpi; an image simply occupies the box you give it. Effective resolution is `pixels / (points / 72)`. A 1200 px wide logo drawn 2 inches wide is 600 ppi, more than any printer needs. Resize large photographs with Pillow before drawing, and prefer JPEG for photos and PNG for logos and screenshots. ReportLab keeps JPEG data as-is (DCTDecode), so a 300 KB JPEG adds about 300 KB; PNGs are re-encoded with Flate.

| Content | Format | Target effective ppi |
|---|---|---|
| Logo, line art | PNG (or vector via graphics) | 300–600 |
| Photo | JPEG quality 80–85 | 300 for print, 150 for screen |
| Screenshot | PNG | 150–200 |
| Scanned exhibit | JPEG or CCITT via Pillow | 200–300 |

### Saving: files, buffers and web responses

You have already seen filenames and `BytesIO`. A few practical patterns:

```python
import io
from reportlab.pdfgen import canvas

def render(target):
    c = canvas.Canvas(target, pagesize=(612, 792))
    c.drawString(72, 720, "Closing Disclosure summary")
    c.save()

# 1) disk
render("cd_summary.pdf")

# 2) bytes for Flask / FastAPI / email
buf = io.BytesIO(); render(buf); pdf = buf.getvalue()

# 3) Flask example
# return Response(pdf, mimetype="application/pdf",
#                 headers={"Content-Disposition": "inline; filename=cd_summary.pdf"})
```

Set document metadata before `save()` with `c.setTitle("...")`, `c.setAuthor("...")`, `c.setSubject("...")` and `c.setKeywords("...")`; they appear in the reader's Document Properties and in search indexes.

> **Warning:** `drawImage` without `width`/`height` draws at 1 pixel = 1 point. A 3000 px scan therefore becomes 41 inches wide and flows off the page. Always pass a size.

### Try It Yourself

```python
import io, re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import mm
from PIL import Image, ImageDraw

# build a fake logo in memory so no file is needed
img = Image.new("RGBA", (400, 150), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle((0, 0, 399, 149), radius=30, fill=(176, 58, 46, 255))
d.text((30, 60), "AR DOCS", fill="white")
bio = io.BytesIO(); img.save(bio, "PNG"); bio.seek(0)
logo = ImageReader(bio)

W, H = A4
buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=A4)
c.setTitle("Image demo"); c.setAuthor("Ali Raza")
for page in range(3):
    c.drawImage(logo, 20 * mm, H - 30 * mm, width=40 * mm, height=15 * mm,
                preserveAspectRatio=True, mask="auto")
    c.drawString(20 * mm, H - 45 * mm, f"Page {page + 1} reuses the same XObject")
    c.showPage()
c.save()
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
print("image objects:", data.count(b"/Subtype /Image"))
```

### Quiz

1. What does `mask="auto"` do in `drawImage`?
- [x] Uses the PNG alpha channel so transparent areas stay transparent
- [ ] Converts the image to greyscale
- [ ] Crops the image to the page
> Without it, transparent PNG regions are painted as a solid colour, usually black or white.

2. Why wrap a repeated logo in `ImageReader`?
- [ ] It converts the image to vector
- [x] The image is decoded and embedded once, then reused on every page
- [ ] It makes the image print in CMYK
> Repeated `drawImage` calls on the same reader share one XObject, shrinking the file and speeding generation.

3. An image is 1500 px wide and drawn 5 inches wide. What is its effective resolution?
- [ ] 72 ppi
- [x] 300 ppi
- [ ] 1500 ppi
> 1500 px / 5 in = 300 ppi, the standard print target.

### Exercises

1. **Fit any image into a box** — Write `fit(c, reader, x, y, box_w, box_h)` that draws an image centred inside the box without distortion.
<details><summary>Solution</summary>

```python
def fit(c, reader, x, y, box_w, box_h):
    iw, ih = reader.getSize()
    scale = min(box_w / iw, box_h / ih)
    w, h = iw * scale, ih * scale
    c.drawImage(reader, x + (box_w - w) / 2, y + (box_h - h) / 2, width=w, height=h, mask="auto")
```

</details>

2. **Downsample before drawing** — Using Pillow, resize a large photo so its longest side is 1800 px, save as JPEG quality 85 into a buffer, and draw it.
<details><summary>Solution</summary>

```python
import io
from PIL import Image
from reportlab.lib.utils import ImageReader
def shrink(path, longest=1800):
    im = Image.open(path).convert("RGB")
    im.thumbnail((longest, longest))
    b = io.BytesIO(); im.save(b, "JPEG", quality=85); b.seek(0)
    return ImageReader(b)
# c.drawImage(shrink("exhibit.jpg"), 72, 300, width=468, height=300, preserveAspectRatio=True)
```

</details>

### Interview Questions

**Q: How do you keep PDF size under control when a report has many images?**
Three levers: resolution, encoding and reuse. I resize images with Pillow to the effective ppi the output needs (300 for print, 150 for screen) before drawing, because ReportLab embeds whatever pixel data you hand it. I choose JPEG for photographs, which ReportLab passes through without re-encoding, and PNG for flat graphics. For repeated assets such as logos and signatures I create one `ImageReader` and reuse it so a single XObject is written. Setting `rl_config.useA85 = 0` also avoids ASCII85 encoding, which otherwise inflates binary streams by about 25 percent.

**Q: How would you place a scanned signature on a fixed position of a generated letter?**
Store the signature as a transparent PNG, register it once with `ImageReader`, and in the page callback draw it with `drawImage(sig, x, y, width, height, mask="auto")` at coordinates measured from the letter template. Because coordinates are absolute, I compute them from the template's millimetre spec with `mm` and verify against a printed proof. For security I would also add the signer's name and timestamp as text below and lock the document with metadata or a digital signature applied afterwards by a separate tool, since ReportLab does not sign PDFs.

**Q: Can ReportLab place an existing PDF page, such as a letterhead, as an image?**
Not natively; `drawImage` only understands raster formats via Pillow. The common solutions are to rasterise the letterhead to a 300 ppi PNG, which is simple but larger, or to generate the content with ReportLab and overlay it onto the letterhead PDF with pypdf's `merge_page` or pikepdf, which keeps the letterhead as vector. A third option is `pdfrw`, whose `PageMerge` and `makerl` helpers let you draw an imported PDF page as a form XObject directly on a ReportLab canvas. I choose the overlay route for letterheads because it preserves print quality and keeps the letterhead editable by the designer.

# LEVEL: Intermediate

## Platypus: SimpleDocTemplate & flowables

**Platypus** stands for "Page Layout and Typography Using Scripts". Instead of placing every string, you build a **story**: a Python list of **flowables**, objects that know how to measure and draw themselves. A **DocTemplate** then pours the story into **frames** on **page templates**, breaking across pages automatically.

The four layers, top to bottom:

| Layer | Class | Responsibility |
|---|---|---|
| Document | `SimpleDocTemplate`, `BaseDocTemplate` | Page size, margins, page templates, the `build()` loop |
| Page template | `PageTemplate` | Which frames a page has and an `onPage` callback for fixed decoration |
| Frame | `Frame` | A rectangular region that flowables flow into |
| Flowable | `Paragraph`, `Table`, `Image`, `Spacer`, `PageBreak`... | Content that wraps and draws itself |

### Your first story

```python
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm

styles = getSampleStyleSheet()
doc = SimpleDocTemplate("sop.pdf", pagesize=A4,
                        leftMargin=20 * mm, rightMargin=20 * mm,
                        topMargin=20 * mm, bottomMargin=20 * mm,
                        title="Escrow SOP", author="Ali Raza")
story = []
story.append(Paragraph("Escrow Disbursement SOP", styles["Title"]))
story.append(Paragraph("1. Purpose", styles["Heading1"]))
story.append(Paragraph("This procedure defines how outgoing wires are approved.", styles["BodyText"]))
story.append(Spacer(1, 6 * mm))
for i in range(60):
    story.append(Paragraph(f"Step {i + 1}: verify the settlement statement line {i + 1}.", styles["BodyText"]))
doc.build(story)
print("pages:", doc.page)
```

`SimpleDocTemplate` creates one frame per page inside the margins. `build()` walks the story; when a paragraph does not fit in the remaining space, Platypus either **splits** it (paragraphs and tables can split) or moves it to the next page. After `build()`, `doc.page` holds the number of pages produced.

### The sample stylesheet

`getSampleStyleSheet()` returns a dictionary-like object with ready-made `ParagraphStyle`s: `Normal`, `BodyText`, `Title`, `Heading1` to `Heading6`, `Bullet`, `Definition`, `Code`, `Italic`. They are decent defaults for a prototype; every production project defines its own styles, covered in the next chapter.

### What a flowable is

Every flowable implements `wrap(availWidth, availHeight)` returning the `(width, height)` it needs, and `draw()` which paints on `self.canv`. Some also implement `split(availWidth, availHeight)` to return a list of smaller flowables when they do not fit. Knowing this protocol lets you write custom flowables: a signature block, a horizontal rule, a QR code.

```python
from reportlab.platypus import Flowable

class HRule(Flowable):
    def __init__(self, width, thickness=0.5):
        super().__init__()
        self.width, self.thickness = width, thickness
    def wrap(self, aw, ah):
        return self.width, self.thickness + 4
    def draw(self):
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 2, self.width, 2)

story.append(HRule(170 * mm))
```

Inside `draw()`, the origin `(0, 0)` is the flowable's own bottom-left corner; Platypus translates the canvas for you.

### Built-in flowables you will use daily

- `Paragraph(text, style)` — wrapped rich text.
- `Spacer(width, height)` — vertical gap (width is ignored).
- `Table(data)` — grids, next-but-one chapter.
- `Image(path, width, height)` — a picture that flows with the text.
- `PageBreak()`, `CondPageBreak(height)` — force or conditionally force a new page.
- `KeepTogether([...])` — keep a heading with its first paragraph.
- `ListFlowable([...])` — numbered and bulleted lists.
- `Preformatted(text, style)` / `XPreformatted` — code and fixed-width text.

> **Tip:** Build the story as a list of small helper calls (`h1("...")`, `body("...")`) that return flowables. The story then reads like the document outline, and unit tests can assert on it before rendering.

### Try It Yourself

```python
import io, re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Flowable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm

class HRule(Flowable):
    def __init__(self, width, thickness=0.5):
        super().__init__(); self.width = width; self.thickness = thickness
    def wrap(self, aw, ah): return self.width, self.thickness + 4
    def draw(self):
        self.canv.setLineWidth(self.thickness); self.canv.line(0, 2, self.width, 2)

styles = getSampleStyleSheet()
buf = io.BytesIO()
doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm,
                        topMargin=20*mm, bottomMargin=20*mm, title="QA Manual")
story = [Paragraph("BPO Agent QA Manual", styles["Title"]), HRule(170*mm), Spacer(1, 4*mm)]
for section in range(1, 6):
    story.append(Paragraph(f"{section}. Scoring rule {section}", styles["Heading2"]))
    for k in range(12):
        story.append(Paragraph(
            f"Rule {section}.{k+1}: each call is scored on greeting, verification, "
            f"resolution and closing. A miss on verification is an automatic fail.",
            styles["BodyText"]))
doc.build(story)
data = buf.getvalue()
print(len(data), "bytes;", doc.page, "pages (doc.page);",
      len(re.findall(rb"/Type\s*/Page\b", data)), "pages (counted)")
```

### Quiz

1. What is a "story" in Platypus?
- [ ] A template file describing the layout
- [x] A Python list of flowable objects in reading order
- [ ] A text string with markup
> `build()` consumes the list in order and lays each flowable into the current frame.

2. Which method must a custom flowable implement so Platypus knows its size?
- [ ] `size()`
- [x] `wrap(availWidth, availHeight)`
- [ ] `measure()`
> `wrap` returns the `(width, height)` the flowable will occupy; `draw` then paints it.

3. After `doc.build(story)`, where do you read the page count?
- [x] `doc.page`
- [ ] `story.pages`
- [ ] `doc.canv.getPageNumber()`
> The document template tracks the page number as it renders.

### Exercises

1. **Numbered steps** — Build a story with a title and 20 paragraphs, each beginning with its number in bold using `<b>` markup, and print the page count.
<details><summary>Solution</summary>

```python
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
s = getSampleStyleSheet(); buf = io.BytesIO()
doc = SimpleDocTemplate(buf)
story = [Paragraph("Onboarding checklist", s["Title"])]
story += [Paragraph(f"<b>{i}.</b> Complete step {i} and record it in the tracker.", s["BodyText"]) for i in range(1, 21)]
doc.build(story); print(doc.page)
```

</details>

2. **Signature flowable** — Write a `SignatureLine(label)` flowable 60 mm wide with a rule and the label beneath it in 8 pt.
<details><summary>Solution</summary>

```python
from reportlab.platypus import Flowable
from reportlab.lib.units import mm
class SignatureLine(Flowable):
    def __init__(self, label, width=60*mm):
        super().__init__(); self.label = label; self.width = width
    def wrap(self, aw, ah): return self.width, 14 * mm
    def draw(self):
        c = self.canv
        c.line(0, 6*mm, self.width, 6*mm)
        c.setFont("Helvetica", 8); c.drawString(0, 2*mm, self.label)
```

</details>

### Interview Questions

**Q: Walk me through what `SimpleDocTemplate.build()` actually does.**
`build()` creates a canvas, installs the default page template with one frame inside the margins, and then loops over the story. For each flowable it calls `wrap()` with the frame's remaining width and height; if the flowable fits it calls `drawOn()` and reduces the available height, otherwise it tries `split()`, and if that also fails it calls `handle_page_end`, which triggers `onPage` callbacks, calls `showPage()` and starts a fresh frame. Flowables that never fit even on an empty frame raise `LayoutError`, which is the classic "Flowable too large" message. At the end it calls `save()` on the canvas. Understanding this loop is what lets you debug page breaks and write custom flowables.

**Q: How do you decide between writing a custom flowable and drawing on the canvas in a callback?**
If the element belongs to the reading order and should move with the text, such as a signature block, a rule, a KPI tile or a QR code, it should be a flowable so Platypus places it and can push it to the next page. If it is fixed page furniture (header, footer, watermark, page number) it belongs in the `onPage` callback, which draws directly on the canvas at absolute coordinates. A custom flowable needs `wrap` and `draw` and optionally `split`; I keep them stateless and give them explicit widths so they behave predictably inside tables too.

**Q: What causes `LayoutError: Flowable ... too large on page` and how do you fix it?**
It means a flowable's wrapped height or width exceeds the frame even when the frame is empty, and the flowable cannot split. Typical culprits are a `Table` without `splitByRow` behaviour because a single row is taller than the page, an `Image` sized larger than the frame, or a `KeepTogether` group longer than one page. Fixes are to reduce the size, to let tables split by keeping rows short, to wrap oversized content in `KeepInFrame(mode='shrink')`, or to break the group. I also check `doc.width` and `doc.height` at runtime rather than hard-coding sizes, because margins change between clients.

## Paragraph, ParagraphStyle & mini-HTML markup

`Paragraph` is the workhorse flowable. It takes a string with a small XML-like markup language and a `ParagraphStyle`, wraps the text to the frame width and splits across pages when needed.

### Defining styles

A `ParagraphStyle` is a bag of typographic attributes with inheritance via `parent`.

```python
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.lib import colors

base = getSampleStyleSheet()["Normal"]
body = ParagraphStyle("Body", parent=base, fontName="Helvetica", fontSize=10,
                      leading=13, alignment=TA_JUSTIFY, spaceAfter=6)
h1 = ParagraphStyle("H1", parent=body, fontName="Helvetica-Bold", fontSize=16,
                    leading=20, spaceBefore=12, spaceAfter=6,
                    textColor=colors.HexColor("#B03A2E"), keepWithNext=True)
note = ParagraphStyle("Note", parent=body, leftIndent=12, borderWidth=0.5,
                      borderColor=colors.grey, borderPadding=4, backColor=colors.whitesmoke)
```

Key attributes:

| Attribute | Meaning |
|---|---|
| `fontName`, `fontSize`, `leading` | Font, size and baseline distance (leading should be 1.2–1.3× size) |
| `alignment` | `TA_LEFT`, `TA_CENTER`, `TA_RIGHT`, `TA_JUSTIFY` |
| `spaceBefore`, `spaceAfter` | Vertical gaps around the paragraph |
| `leftIndent`, `rightIndent`, `firstLineIndent` | Indents in points |
| `textColor`, `backColor` | Colours |
| `borderWidth`, `borderColor`, `borderPadding`, `borderRadius` | Box around the paragraph |
| `bulletFontName`, `bulletFontSize`, `bulletIndent` | Bullet formatting |
| `keepWithNext` | Do not leave this paragraph at the bottom of a page (headings) |
| `wordWrap` | `None`, `'CJK'` or `'RTL'` |
| `splitLongWords`, `allowWidows`, `allowOrphans` | Wrapping controls |

Setting `keepWithNext=True` on heading styles is the single most useful line in this chapter: it stops a heading from being orphaned at the bottom of a page.

### Inline markup

The text argument accepts a mini-HTML dialect. Tags must be well-formed XML (closed, properly nested) and `&`, `<`, `>` in data must be escaped.

```python
from xml.sax.saxutils import escape
from reportlab.platypus import Paragraph

client = "Smith & Sons <LLC>"
p = Paragraph(
    f"<b>Client:</b> {escape(client)}<br/>"
    "<i>Status:</i> <font color='#16A085' size='11'>Approved</font> "
    "<super>1</super> "
    "<a href='https://example.com/policy' color='blue'><u>view policy</u></a>",
    body)
```

Supported tags include `<b>`, `<i>`, `<u>`, `<strike>`, `<font name= size= color=>`, `<span>` (same attributes), `<br/>`, `<super>`, `<sub>`, `<a href= color=>`, `<link>`, `<img src= width= height= valign=>` for inline images, `<greek>`, `<bullet>` for a hanging bullet, `<seq>` for automatic numbering and `<nobr>` (ReportLab 3.5+) to prevent a break. Unicode characters go straight into the string as long as the font contains them.

### Bullets and hanging indents

```python
bullet = ParagraphStyle("Bullet", parent=body, leftIndent=14, bulletIndent=2, bulletFontName="Helvetica")
Paragraph("Verify the wire instructions by phone.", bullet, bulletText="•")
```

`bulletText` places the character in the gutter defined by `bulletIndent` and `leftIndent`. For real lists with numbering use `ListFlowable([ListItem(Paragraph(...)), ...], bulletType='1')`.

### Automatic numbering with seq

```python
Paragraph("<seq id='step'/>. Open the file", body)   # 1.
Paragraph("<seq id='step'/>. Check the vesting", body) # 2.
Paragraph("<seqreset id='step'/>", body)
```

The `seq` tag is how ReportLab numbers figures, tables and steps across an entire document without you counting.

> **Warning:** Any raw `&` in text (for example "R&D" or "Smith & Sons") breaks the paragraph parser with a `ValueError: paragraph text ... caused exception`. Always pass user data through `xml.sax.saxutils.escape()`.

### Try It Yourself

```python
import io, re
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import mm

base = getSampleStyleSheet()["Normal"]
body = ParagraphStyle("Body", parent=base, fontSize=10, leading=13, alignment=TA_JUSTIFY, spaceAfter=5)
h1 = ParagraphStyle("H1", parent=body, fontName="Helvetica-Bold", fontSize=15, leading=18,
                    textColor=colors.HexColor("#B03A2E"), spaceBefore=10, keepWithNext=True)
note = ParagraphStyle("Note", parent=body, leftIndent=10, backColor=colors.whitesmoke,
                      borderWidth=0.5, borderColor=colors.grey, borderPadding=5)
bullet = ParagraphStyle("Bullet", parent=body, leftIndent=14, bulletIndent=2)

client = "Smith & Sons <LLC>"
story = [
    Paragraph("Title Commitment Review", h1),
    Paragraph(f"<b>Client:</b> {escape(client)} &nbsp; <b>File:</b> 2026-0917", body),
    Paragraph("Schedule B exceptions must be cleared before closing. <i>Standard</i> exceptions "
              "may be removed on receipt of an <font color='#16A085'>owner's affidavit</font>.", body),
    Paragraph("Call the lender to confirm wire instructions.", bullet, bulletText="•"),
    Paragraph("Log the confirmation in the QA tracker.", bullet, bulletText="•"),
    Spacer(1, 4 * mm),
    Paragraph("<b>Note:</b> Steps <seq id='s'/> and <seq id='s'/> are mandatory.", note),
]
buf = io.BytesIO()
SimpleDocTemplate(buf, leftMargin=20*mm, rightMargin=20*mm).build(story)
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. Which style attribute stops a heading from being stranded at the bottom of a page?
- [ ] `spaceAfter`
- [x] `keepWithNext=True`
- [ ] `allowOrphans=0`
> `keepWithNext` glues the paragraph to the following flowable so they move together.

2. What happens if you pass `"Smith & Sons"` unescaped to `Paragraph`?
- [ ] The ampersand is rendered as-is
- [x] The parser raises an error because `&` starts an entity
- [ ] The text is truncated at `&`
> Paragraph text is parsed as XML; escape user data with `xml.sax.saxutils.escape`.

3. Which tag inserts an automatic counter?
- [x] `<seq id='fig'/>`
- [ ] `<number/>`
- [ ] `<counter/>`
> `seq` increments a named sequence each time it appears; `seqreset` restarts it.

### Exercises

1. **Style set** — Define `body`, `h1`, `h2` and `caption` styles that inherit from one another (h2 smaller than h1, caption italic and grey) and render one of each.
<details><summary>Solution</summary>

```python
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib import colors
base = getSampleStyleSheet()["Normal"]
body = ParagraphStyle("body", parent=base, fontSize=10, leading=13)
h1 = ParagraphStyle("h1", parent=body, fontName="Helvetica-Bold", fontSize=16, leading=19, spaceBefore=12, keepWithNext=True)
h2 = ParagraphStyle("h2", parent=h1, fontSize=13, leading=16, spaceBefore=8)
caption = ParagraphStyle("caption", parent=body, fontName="Helvetica-Oblique", fontSize=8, textColor=colors.grey)
```

</details>

2. **Safe paragraph factory** — Write `P(text, style, **kw)` that escapes the text but still allows a small whitelist of tags by passing them through unescaped.
<details><summary>Solution</summary>

```python
from xml.sax.saxutils import escape
from reportlab.platypus import Paragraph
def P(text, style, **kw):
    safe = escape(text)
    for tag in ("b", "i", "u"):
        safe = safe.replace(f"&lt;{tag}&gt;", f"<{tag}>").replace(f"&lt;/{tag}&gt;", f"</{tag}>")
    return Paragraph(safe, style, **kw)
```

</details>

### Interview Questions

**Q: How does ReportLab's Paragraph markup differ from HTML, and what breaks people?**
It is XML-strict, not HTML-lenient: every tag must be closed (`<br/>`, not `<br>`), tags must nest properly, and `&`, `<`, `>` must be escaped in data. Only a fixed set of tags is understood; `<p>`, `<div>`, `<table>` and CSS are not, and block structure comes from the story, not from markup. Attributes use `name`, `size`, `color` rather than CSS. The common failure is unescaped client data, so I run everything through `escape()` at the boundary and keep markup generation on my side. Another surprise is that whitespace is collapsed, so pre-formatted text needs `Preformatted` or `XPreformatted`.

**Q: What is leading and how do you choose it?**
Leading is the vertical distance between consecutive baselines, set independently from font size in `ParagraphStyle`. If leading is smaller than the font size, ascenders and descenders collide; the readable range is 1.2 to 1.35 times the size, so 10 pt body gets 12 to 13.5 pt leading. Dense tables use 1.1 to 1.15 and headings can use 1.1 because they are short. ReportLab does not compute leading from the font, so if you change `fontSize` on a derived style you must change `leading` too, which is a classic bug when styles inherit via `parent`.

**Q: How do you produce automatic figure and table numbering across a long document?**
With the `<seq>` tag: `Figure <seq id='fig'/>: ...` increments a named counter every time it is rendered, and `<seqreset id='fig'/>` restarts it, for example at each chapter. Because the numbering happens at render time, it stays correct when sections are reordered. For hierarchical numbers you can nest counters with `<seq template='%(chapter)s.%(fig+)s' id='fig'/>`, or simply compute the numbers in Python when building the story if you also need them in a TOC. In a 767-page handbook I generated the numbers in Python because the same counters fed cross-references and the index.

## Tables & TableStyle

`Table` lays out a two-dimensional grid of cells. Cells can hold strings, numbers, `Paragraph`s, images or even nested tables. Formatting is applied separately with `TableStyle`, a list of commands that target rectangular cell ranges.

### Data and widths

```python
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.units import mm

data = [
    ["State", "Files", "Avg TAT (days)", "QA score"],
    ["Texas", 412, 3.2, "97.1%"],
    ["Florida", 305, 3.8, "95.4%"],
    ["Wyoming", 41, 2.9, "98.8%"],
]
t = Table(data, colWidths=[40*mm, 25*mm, 35*mm, 30*mm], rowHeights=None, repeatRows=1)
```

`colWidths` and `rowHeights` are lists (or `None` to auto-size). Auto-sizing measures string widths; long strings do not wrap unless the cell contains a `Paragraph`. `repeatRows=1` repeats the first row as a header when the table splits across pages; this is essential for any production report table.

### TableStyle commands

Each command is a tuple: `(NAME, (col0, row0), (col1, row1), *args)`. Coordinates are `(column, row)`, zero-based, and negative indices count from the end, so `(-1, -1)` is the bottom-right cell.

```python
style = TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#B03A2E")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 9),
    ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.whitesmoke]),
    ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),
    ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
])
t.setStyle(style)
```

| Command | Purpose |
|---|---|
| `BACKGROUND`, `ROWBACKGROUNDS`, `COLBACKGROUNDS` | Cell fills, including alternating stripes |
| `GRID`, `BOX`, `INNERGRID`, `LINEABOVE`, `LINEBELOW`, `LINEBEFORE`, `LINEAFTER` | Rules with width and colour |
| `FONTNAME`, `FONTSIZE`, `LEADING`, `TEXTCOLOR` | Text formatting for plain string cells |
| `ALIGN`, `VALIGN` | `LEFT/CENTER/RIGHT/DECIMAL`, `TOP/MIDDLE/BOTTOM` |
| `LEFTPADDING`, `RIGHTPADDING`, `TOPPADDING`, `BOTTOMPADDING` | Cell padding, default 6/6/3/3 |
| `SPAN` | Merge a rectangular range |
| `NOSPLIT` | Keep a row range together when splitting |

`ALIGN ... 'DECIMAL'` aligns numbers on the decimal point, which is what a rate matrix wants.

### Spans and nested content

```python
data = [["Rate matrix - Texas", "", ""],
        ["Coverage", "Owner", "Lender"],
        ["$100,000", "$832", "$832"]]
t = Table(data, colWidths=[50*mm, 30*mm, 30*mm])
t.setStyle(TableStyle([("SPAN", (0, 0), (-1, 0)), ("ALIGN", (0, 0), (-1, 0), "CENTER"),
                       ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey)]))
```

Spanned cells must have empty strings in the covered positions. To wrap long text inside a cell, put a `Paragraph` in it; the cell then honours the column width and grows in height.

### Splitting across pages

Tables split by rows by default. The header repeats when `repeatRows` is set, and `('NOSPLIT', (0, r1), (-1, r2))` keeps a subtotal with its rows. `hAlign='LEFT'` positions the table in the frame (`CENTER` is the default). Very long tables (thousands of rows) are faster with `LongTable`, which avoids measuring every row up front; it takes the same arguments.

> **Interview note:** Interviewers ask "why is my table wider than the page?" The answer is that auto-sized columns never wrap strings. Give `colWidths` that sum to `doc.width` and wrap cell text in `Paragraph`.

### Try It Yourself

```python
import io, re
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, LongTable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4

styles = getSampleStyleSheet()
header = ["File #", "State", "Product", "Premium", "QA"]
rows = [header]
for i in range(1, 121):
    rows.append([f"2026-{i:04d}", ["TX", "FL", "WY"][i % 3],
                 ["Owner", "Lender", "Both"][i % 3], f"{450 + i * 3.75:,.2f}", f"{92 + i % 8}%"])
t = LongTable(rows, colWidths=[30*mm, 20*mm, 30*mm, 30*mm, 20*mm], repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#B03A2E")),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 8.5),
    ("ALIGN", (3, 1), (3, -1), "RIGHT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.whitesmoke]),
    ("GRID", (0, 0), (-1, -1), 0.25, colors.lightgrey),
    ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
]))
buf = io.BytesIO()
doc = SimpleDocTemplate(buf, pagesize=A4)
doc.build([Paragraph("Weekly production detail", styles["Heading1"]), t])
data = buf.getvalue()
print(len(data), "bytes;", doc.page, "pages;", len(re.findall(rb"/Type\s*/Page\b", data)), "counted")
```

### Quiz

1. In `("ALIGN", (1, 1), (-1, -1), "RIGHT")`, what does `(1, 1)` refer to?
- [ ] Row 1, column 1 in one-based numbering
- [x] Column index 1, row index 1, zero-based
- [ ] The second cell of the first row
> TableStyle coordinates are `(column, row)` and zero-based; negative values count from the end.

2. What does `repeatRows=1` do?
- [x] Repeats the first row on each page when the table splits
- [ ] Duplicates the first row of data
- [ ] Prevents the table from splitting
> Header repetition is what makes multi-page reports readable.

3. Why does a long string in a table cell overflow its column?
- [ ] Table cells always clip text
- [x] Plain strings are not wrapped; only `Paragraph` cells wrap
- [ ] `colWidths` was set too small
> Wrap the string in a `Paragraph` and the cell will grow vertically instead.

### Exercises

1. **Subtotal rows** — Build a table of six rows grouped by state with a bold subtotal row after each group and `NOSPLIT` so a subtotal never lands alone on a new page.
<details><summary>Solution</summary>

```python
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
data = [["State", "File", "Premium"]]
cmds = [("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey)]
for state, files in {"TX": [400, 520, 610], "FL": [380, 455, 500]}.items():
    start = len(data)
    for k, p in enumerate(files): data.append([state, f"{state}-{k+1}", f"{p:,.2f}"])
    data.append(["", "Subtotal", f"{sum(files):,.2f}"])
    cmds += [("FONTNAME", (0, len(data)-1), (-1, len(data)-1), "Helvetica-Bold"),
             ("NOSPLIT", (0, start), (-1, len(data)-1))]
t = Table(data, repeatRows=1); t.setStyle(TableStyle(cmds))
```

</details>

2. **Wrapped description column** — Create a two-column table where the second column contains long paragraphs that wrap within 100 mm.
<details><summary>Solution</summary>

```python
from reportlab.platypus import Table, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
s = getSampleStyleSheet()["BodyText"]
rows = [[Paragraph("<b>Exception 3</b>", s), Paragraph("Easement recorded in Volume 120, Page 33, affecting the north 20 feet of the subject property, as shown on the survey dated 2 March 2026." * 2, s)]]
t = Table(rows, colWidths=[40*mm, 100*mm])
```

</details>

### Interview Questions

**Q: How do you make a 3,000-row table render quickly and paginate correctly?**
Use `LongTable` (or `Table` with fixed `rowHeights`) so ReportLab does not measure every row before splitting, set `repeatRows=1` for the header, and keep cells as plain strings where possible because each `Paragraph` costs a wrap calculation. Give explicit `colWidths` summing to `doc.width` to avoid the auto-width pass. If rows are uniform, fixed `rowHeights` make splitting O(1) per page. For the very largest jobs I chunk the data into tables of about 500 rows each, appending them one after another; this gives the same visual result with much lower peak memory, and the header repeats per chunk.

**Q: Explain how spans interact with splitting and styles.**
`SPAN` merges a rectangular block; the content lives in the top-left cell and the other positions must be empty strings. A spanned region cannot be split across a page break, so tall spans near a page boundary push the whole span to the next page, which can leave white space. Style commands still address underlying cell coordinates, so a `BACKGROUND` on the span's top-left cell only paints that cell unless you apply it to the full range. Vertical spans in the first column are handy for grouped rate matrices, but I keep them short and combine them with `NOSPLIT` to control the breaks.

**Q: A client wants alternating row colours and a totals row with a double rule. How?**
`('ROWBACKGROUNDS', (0,1), (-1,-1), [white, whitesmoke])` handles stripes without computing indices, and it works across page splits because ReportLab re-applies the pattern per row index. For the totals row I add `('LINEABOVE', (0,-1), (-1,-1), 0.5, black)` and `('LINEBELOW', (0,-1), (-1,-1), 1.5, black, None, None, None, 2, 2)`; the trailing arguments set a double line with a gap. I also set `FONTNAME` to bold on that row and use `NOSPLIT` so the totals row never appears alone on a fresh page.

## Spacers, page breaks & KeepTogether

Layout is mostly about vertical rhythm and controlling where pages break. Platypus gives you a small set of flowables for exactly that, and understanding them prevents most "ugly page" complaints from clients.

### Spacer

`Spacer(width, height)` inserts an empty gap. Only the height matters. Prefer `spaceBefore`/`spaceAfter` on styles for consistent rhythm, and use `Spacer` for one-off gaps such as before a signature block.

```python
from reportlab.platypus import Spacer
from reportlab.lib.units import mm
story.append(Spacer(1, 8 * mm))
```

A `Spacer` at the top of a new page is dropped automatically by newer versions when `isGlue` behaviour applies, but do not rely on it; conditional breaks are cleaner.

### PageBreak and CondPageBreak

`PageBreak()` forces a new page. `CondPageBreak(height)` starts a new page only if less than `height` remains in the frame, which is how you guarantee a section has room to start without forcing breaks everywhere.

```python
from reportlab.platypus import PageBreak, CondPageBreak
story.append(CondPageBreak(60 * mm))   # need at least 60 mm for the next block
story.append(Paragraph("5. Wire approvals", h1))
```

`PageBreakIfNotEmpty()` (ReportLab 3.5+) breaks only when the current page already has content, avoiding blank pages when a chapter starts at the very top of a page.

### KeepTogether

`KeepTogether([flowables])` tries to keep a group on one page; if the group is taller than a page it falls back to normal splitting rather than raising. Use it for a heading plus its first paragraph, a figure plus its caption, or a short table with its title.

```python
from reportlab.platypus import KeepTogether
story.append(KeepTogether([
    Paragraph("Figure <seq id='fig'/>: QA score trend", caption),
    chart_drawing,
]))
```

For headings the style attribute `keepWithNext=True` does the same job with less code.

### KeepInFrame

Sometimes content must fit a fixed box: a summary panel on a cover page, a cell in a form. `KeepInFrame(maxWidth, maxHeight, content, mode='shrink')` scales, truncates, overflows or raises depending on `mode`.

```python
from reportlab.platypus import KeepInFrame
panel = KeepInFrame(80 * mm, 40 * mm, [Paragraph(long_summary, body)], mode="shrink")
```

`mode='shrink'` scales the content down uniformly; `'truncate'` cuts it off; `'overflow'` lets it spill; `'error'` raises. Shrink is the sensible default for client-supplied text of unknown length.

### Frame breaks and templates

`FrameBreak()` moves to the next frame on the same page, used with multi-column page templates in the Advanced level. `NextPageTemplate('name')` switches templates for the following page.

### Controlling widows and orphans

`ParagraphStyle` has `allowWidows` and `allowOrphans` (both default 1, meaning allowed). Setting them to 0 stops a single line of a paragraph from sitting alone at the top or bottom of a page, at the cost of slightly more white space. Publishing clients usually ask for this on body text.

| Flowable | When to use |
|---|---|
| `Spacer` | One-off vertical gap |
| `PageBreak` | Chapter starts, appendices |
| `CondPageBreak(h)` | Ensure room before a section or table |
| `KeepTogether` | Heading+paragraph, figure+caption |
| `KeepInFrame` | Fixed-size panels with variable text |
| `FrameBreak` | Jump to the next column/frame |

> **Tip:** Never use `Spacer` to push content to the next page. Page sizes and fonts change; `CondPageBreak` and `PageBreak` express the intent and survive edits.

### Try It Yourself

```python
import io, re
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
                                CondPageBreak, KeepTogether, KeepInFrame, Table)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm

s = getSampleStyleSheet()
h = ParagraphStyle("h", parent=s["Heading2"], keepWithNext=True)
story = [Paragraph("Policy Manual - Section 4", s["Title"])]
filler = "Each disbursement is reconciled against the settlement statement before release. " * 3
for n in range(1, 8):
    story.append(CondPageBreak(50 * mm))
    story.append(KeepTogether([Paragraph(f"4.{n} Procedure {n}", h), Paragraph(filler, s["BodyText"])]))
    story.append(Spacer(1, 3 * mm))
story.append(PageBreak())
story.append(Paragraph("Appendix A - Summary panel", h))
long_text = "Summary: " + "risk, control, owner, frequency; " * 40
story.append(KeepInFrame(120 * mm, 40 * mm, [Paragraph(long_text, s["BodyText"])], mode="shrink"))
buf = io.BytesIO()
doc = SimpleDocTemplate(buf, leftMargin=20*mm, rightMargin=20*mm)
doc.build(story)
data = buf.getvalue()
print(len(data), "bytes;", doc.page, "pages;", len(re.findall(rb"/Type\s*/Page\b", data)), "counted")
```

### Quiz

1. What does `CondPageBreak(60 * mm)` do?
- [ ] Always starts a new page 60 mm from the top
- [x] Starts a new page only if less than 60 mm of space remains
- [ ] Adds 60 mm of blank space
> It is a conditional break, ideal before sections and tables that need room to start.

2. What happens if a `KeepTogether` group is taller than a page?
- [ ] `LayoutError` is raised
- [x] The group splits normally as if `KeepTogether` was not there
- [ ] The content is shrunk to fit
> `KeepTogether` is a best-effort hint; use `KeepInFrame` when you need scaling.

3. Which `KeepInFrame` mode scales content down to fit?
- [x] `shrink`
- [ ] `truncate`
- [ ] `overflow`
> `shrink` applies a uniform scale so the whole content stays visible inside the box.

### Exercises

1. **Chapter starter** — Write `chapter(title, paragraphs)` that returns flowables beginning with `PageBreakIfNotEmpty`, a heading with `keepWithNext`, and the paragraphs.
<details><summary>Solution</summary>

```python
from reportlab.platypus import PageBreakIfNotEmpty, Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
s = getSampleStyleSheet()
h1 = ParagraphStyle("h1", parent=s["Heading1"], keepWithNext=True)
def chapter(title, paragraphs):
    out = [PageBreakIfNotEmpty(), Paragraph(title, h1)]
    out += [Paragraph(p, s["BodyText"]) for p in paragraphs]
    return out
```

</details>

2. **Figure with caption** — Wrap a `Table` and a caption `Paragraph` in `KeepTogether` so they never separate.
<details><summary>Solution</summary>

```python
from reportlab.platypus import KeepTogether, Table, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
s = getSampleStyleSheet()
t = Table([["Metric", "Value"], ["Files", "758"]])
block = KeepTogether([t, Paragraph("Table <seq id='tbl'/>: weekly totals", s["Italic"])])
```

</details>

### Interview Questions

**Q: How do you prevent a heading from being orphaned at the bottom of a page?**
Set `keepWithNext=True` on the heading's `ParagraphStyle`; Platypus then treats the heading and the next flowable as a unit and moves both if they do not fit. The equivalent explicit form is wrapping the heading and first paragraph in `KeepTogether`. I combine this with `CondPageBreak` before major sections so a section always starts with a reasonable amount of room, and with `allowOrphans=0`/`allowWidows=0` on body text for publishing clients. The result is that a regenerated 700-page manual has no stranded headings without anyone eyeballing every page.

**Q: A client says "there are random blank pages in the report". What do you check?**
Usually a hard `PageBreak()` placed right after content that already ended exactly at a page boundary, or a `PageBreak()` at the start of every chapter including the first. `PageBreakIfNotEmpty()` fixes the first case, and skipping the break for the first chapter fixes the second. The other cause is a `KeepTogether` or `SPAN` block that could not fit in the remaining space and was pushed, leaving most of a page empty; reducing the group size or replacing it with `CondPageBreak` cures that. I reproduce with a tiny story and print `doc.page` after each addition to locate the culprit.

**Q: What is the difference between `KeepTogether` and `KeepInFrame`?**
`KeepTogether` concerns pagination: it asks Platypus not to split a group across pages and silently gives up if the group is larger than a page. `KeepInFrame` concerns size: it forces content into a fixed width and height by shrinking, truncating, overflowing or erroring, and it never changes where pages break. You use the first for figure-plus-caption and heading-plus-paragraph, and the second for panels, form cells and cover boxes where the box is fixed but the text is variable. They can nest: a `KeepInFrame` panel inside a `KeepTogether` with its title.

## Registering TTF fonts (Unicode, Urdu/Arabic caveats)

The 14 standard fonts are Latin-only and never embedded. Real branded documents need the client's typeface, and anything in Urdu, Arabic, Hindi, Chinese or with extended punctuation needs a Unicode TrueType font. ReportLab embeds TTF fonts as subsets, so file size stays small and the PDF looks identical on every machine.

### Registering a font

```python
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("Roboto", "fonts/Roboto-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Roboto-Bold", "fonts/Roboto-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Roboto-Italic", "fonts/Roboto-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Roboto-BoldItalic", "fonts/Roboto-BoldItalic.ttf"))
```

The first argument is the name you will use everywhere in ReportLab; it does not have to match the font's internal name. Register once at import time, before any canvas or style is created. Registering the same name twice is harmless.

### Font families for bold and italic markup

`<b>` and `<i>` in `Paragraph` markup work by looking up the family mapping. Without it, `<b>Roboto text</b>` silently stays regular or falls back to Helvetica.

```python
pdfmetrics.registerFontFamily("Roboto", normal="Roboto", bold="Roboto-Bold",
                              italic="Roboto-Italic", boldItalic="Roboto-BoldItalic")
```

Now `ParagraphStyle(fontName="Roboto")` plus `<b>` gives Roboto-Bold. Older code uses `reportlab.lib.fonts.addMapping`, which does the same thing per variant.

### Where fonts come from

ReportLab searches `rl_config.TTFSearchPath`, which includes the OS font directories, so on Windows `TTFont("Arial", "arial.ttf")` usually works. For deployable projects ship the `.ttf` files with the code and use absolute paths built from `__file__`. Only `.ttf` and `.ttc` (with `subfontIndex`) are supported; OpenType fonts with CFF outlines (`.otf` with PostScript outlines) are **not** supported and raise `TTFError`. Convert them with FontForge or choose a TTF build; Google Fonts provides TTF for nearly every family.

### Unicode and the standard fonts

```python
c.setFont("Helvetica", 12)
c.drawString(72, 700, "Café – résumé")     # works: Latin-1
c.drawString(72, 680, "€ 1,200")           # works in most viewers
c.drawString(72, 660, "Lahore لاہور")       # black boxes or missing glyphs
```

With a registered Noto font the Urdu string renders, but read the next section before celebrating.

### Urdu, Arabic and right-to-left text

Arabic-script fonts require **shaping**: letters change form depending on neighbours and text runs right-to-left. ReportLab's core text engine writes glyphs one code point at a time, left to right, so raw Urdu comes out disconnected and reversed. Two approaches:

1. **Pre-shape in Python** with `arabic-reshaper` and `python-bidi`, then draw the resulting visual-order string with a font such as Noto Naskh Arabic or Jameel Noori Nastaleeq.

```python
import arabic_reshaper
from bidi.algorithm import get_display
pdfmetrics.registerFont(TTFont("Naskh", "fonts/NotoNaskhArabic-Regular.ttf"))
raw = "معاہدہ برائے فروخت"
visual = get_display(arabic_reshaper.reshape(raw))
c.setFont("Naskh", 14)
c.drawRightString(520, 700, visual)
```

2. **ReportLab 4 shaping.** ReportLab 4.x added optional, still-experimental text shaping built on the `uharfbuzz` package; when it is installed and enabled, ligatures and Arabic joining are handled by HarfBuzz. Check the release notes for your exact version before relying on it in production; the pre-shaping route works on every version.

For `Paragraph`, set `wordWrap='RTL'` on the style so line breaking works right-to-left, and still pre-shape each string. Nastaliq fonts have very deep descenders, so increase leading to about 2× the font size.

| Script | Font suggestion | Notes |
|---|---|---|
| Latin extended | Roboto, Liberation Sans | Drop-in Helvetica replacement, embeddable for PDF/A |
| Urdu (Nastaliq) | Jameel Noori Nastaleeq, Noto Nastaliq Urdu | Needs shaping; leading 2× size |
| Arabic (Naskh) | Noto Naskh Arabic, Amiri | Needs shaping |
| CJK | Noto Sans CJK (TTF/TTC) or `UnicodeCIDFont('HeiseiMin-W3')` | CID fonts are not embedded |
| Symbols | DejaVu Sans | Broad coverage fallback |

> **Warning:** The font you register must actually contain the glyphs. ReportLab does not fall back to another font per character; missing glyphs render as blank or boxes. Use DejaVu Sans as a broad-coverage body font when you cannot control the input.

### Try It Yourself

```python
import io, re, os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register a TTF if one is available; fall back to Helvetica otherwise so the demo runs anywhere.
font_name = "Helvetica"
for path in ["fonts/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
             "C:/Windows/Fonts/arial.ttf"]:
    if os.path.exists(path):
        pdfmetrics.registerFont(TTFont("Body", path)); font_name = "Body"; break

buf = io.BytesIO()
c = canvas.Canvas(buf)
c.setFont(font_name, 14)
c.drawString(72, 720, f"Font in use: {font_name}")
c.drawString(72, 700, "Latin-1 works everywhere: Café résumé naïve")
if font_name != "Helvetica":
    c.drawString(72, 680, "Extended glyphs: ✓ ☐ ☑ — ‘quotes’ €")
c.save()
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
print("embedded TrueType:", b"/FontFile2" in data)
```

### Quiz

1. Which font file types can `TTFont` load?
- [x] `.ttf` and `.ttc`
- [ ] `.otf` with CFF outlines
- [ ] `.woff2`
> ReportLab parses TrueType outlines only; CFF-based OpenType fonts raise `TTFError`.

2. Why does `<b>` not work after registering only `Roboto-Regular`?
- [ ] Bold is not supported for TTF fonts
- [x] No family mapping tells ReportLab which font is the bold variant
- [ ] `<b>` only works with Helvetica
> `registerFontFamily` (or `addMapping`) links normal, bold, italic and bold-italic names.

3. What does Urdu text look like if drawn without shaping?
- [ ] Perfectly joined and right-to-left
- [x] Disconnected letters in left-to-right order
- [ ] It raises an exception
> Arabic script needs contextual forms and bidi reordering; pre-shape with arabic-reshaper and python-bidi.

### Exercises

1. **Font bootstrap** — Write `register_fonts(folder)` that registers Regular/Bold/Italic/BoldItalic files of a family and the family mapping, skipping variants that are missing.
<details><summary>Solution</summary>

```python
import os
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
def register_fonts(folder, family="Roboto"):
    variants = {"": "Regular", "-Bold": "Bold", "-Italic": "Italic", "-BoldItalic": "BoldItalic"}
    names = {}
    for suffix, file_part in variants.items():
        path = os.path.join(folder, f"{family}-{file_part}.ttf")
        if os.path.exists(path):
            pdfmetrics.registerFont(TTFont(family + suffix, path)); names[suffix] = family + suffix
    pdfmetrics.registerFontFamily(family, normal=names.get("", family), bold=names.get("-Bold", family),
                                  italic=names.get("-Italic", family), boldItalic=names.get("-BoldItalic", family))
```

</details>

2. **Shaped Urdu helper** — Write `rtl(text)` returning the shaped, bidi-reordered string, and use it with `drawRightString`.
<details><summary>Solution</summary>

```python
import arabic_reshaper
from bidi.algorithm import get_display
def rtl(text):
    return get_display(arabic_reshaper.reshape(text))
# c.setFont("Naskh", 14); c.drawRightString(520, 700, rtl("شرائط و ضوابط"))
```

</details>

### Interview Questions

**Q: How does ReportLab embed TrueType fonts and what does that mean for file size and compliance?**
When you register a `TTFont`, ReportLab parses the font tables and, at save time, writes a subset containing only the glyphs actually used, as a `/FontFile2` stream with a custom encoding per 256-glyph block. A whole document in a 600 KB font typically adds 20 to 60 KB. Because the glyphs are embedded, output is identical on every viewer and printer, which is a requirement for PDF/A and PDF/X. The base 14 fonts are never embedded, so for compliance you replace them with embeddable equivalents such as Liberation Sans or Noto. One caveat is licensing: some commercial fonts forbid embedding, and ReportLab does not check the font's embedding flags for you.

**Q: Describe how you produced a bilingual English/Urdu contract in ReportLab.**
I registered Noto Naskh Arabic (and a Nastaliq face for headings) and Roboto for English, with family mappings for bold and italic. Every Urdu string went through `arabic_reshaper.reshape` followed by `bidi.get_display`, producing a visual-order string that ReportLab can draw left to right, and Urdu paragraphs used a style with `wordWrap='RTL'`, `alignment=TA_RIGHT` and leading around twice the font size because Nastaliq descenders are deep. Mixed lines were split into runs so digits and Latin names stayed in logical order. I tested on Acrobat, Chrome and a phone viewer, because shaping bugs only show up visually. On ReportLab 4 with HarfBuzz shaping enabled some of this becomes unnecessary, but the pre-shaping pipeline is version-independent.

**Q: Why can't you just use `Arial` in ReportLab on a Linux server?**
`setFont("Arial", 12)` fails with `KeyError` unless a font named Arial has been registered, and Arial is not present on most Linux servers because it is a proprietary Microsoft font. You either ship a licensed copy with the application, install `ttf-mscorefonts-installer`, or use a metric-compatible open font such as Liberation Sans, which has the same character widths so layouts do not reflow. I prefer Liberation Sans or Arimo for exactly this reason, and I register fonts from a project `fonts/` folder using paths derived from `__file__` so the code behaves identically on Windows, Docker and CI.

# LEVEL: Advanced

## PageTemplates, Frames & onPage callbacks

`SimpleDocTemplate` hides the page machinery. Real reports need it exposed: a cover page with no header, a two-column body, landscape appendices, and a footer that reads "Page 3 of 12". That is the job of `BaseDocTemplate`, `PageTemplate`, `Frame` and the `onPage` callback.

### Frames

A `Frame` is the rectangle flowables pour into. You can put several on one page for columns or side panels.

```python
from reportlab.platypus import Frame
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4
W, H = A4
m = 20 * mm
gutter = 8 * mm
col_w = (W - 2 * m - gutter) / 2
left = Frame(m, m, col_w, H - 2 * m, id="left", showBoundary=0)
right = Frame(m + col_w + gutter, m, col_w, H - 2 * m, id="right")
```

Arguments are `x, y, width, height` of the outer box, plus `leftPadding`, `bottomPadding`, `rightPadding`, `topPadding` (default 6 pt each), and `showBoundary=1` draws the frame outline for debugging. When the first frame fills, Platypus moves to the next frame on the same page, then to the next page.

### PageTemplates and the onPage callback

A `PageTemplate` bundles frames with a callback that draws fixed content on every page that uses the template.

```python
from reportlab.platypus import BaseDocTemplate, PageTemplate, NextPageTemplate, PageBreak, Paragraph
from reportlab.lib.pagesizes import landscape

def header_footer(canvas, doc):
    canvas.saveState()
    w, h = doc.pagesize
    canvas.setFont("Helvetica", 8)
    canvas.drawString(m, h - 12 * mm, "Stewart Title - Weekly Production Status")
    canvas.drawRightString(w - m, h - 12 * mm, doc.report_date)
    canvas.line(m, h - 14 * mm, w - m, h - 14 * mm)
    canvas.drawCentredString(w / 2, 10 * mm, f"Page {doc.page}")
    canvas.restoreState()

def cover(canvas, doc):
    canvas.saveState(); canvas.setFont("Helvetica-Bold", 28)
    canvas.drawCentredString(W / 2, H / 2, "Production Status Report"); canvas.restoreState()

body_frame = Frame(m, m, W - 2 * m, H - 2 * m - 16 * mm, id="body")
land_frame = Frame(m, m, H - 2 * m, W - 2 * m - 16 * mm, id="land")

doc = BaseDocTemplate("status.pdf", pagesize=A4, leftMargin=m, rightMargin=m, topMargin=m, bottomMargin=m)
doc.report_date = "15 Sep 2026"
doc.addPageTemplates([
    PageTemplate(id="Cover", frames=[Frame(m, m, W - 2 * m, H - 2 * m)], onPage=cover),
    PageTemplate(id="Body", frames=[body_frame], onPage=header_footer),
    PageTemplate(id="TwoCol", frames=[left, right], onPage=header_footer),
    PageTemplate(id="Landscape", frames=[land_frame], onPage=header_footer, pagesize=landscape(A4)),
])
story = [NextPageTemplate("Body"), PageBreak(), Paragraph("1. Summary", h1), ...,
         NextPageTemplate("Landscape"), PageBreak(), rate_matrix_table,
         NextPageTemplate("Body"), PageBreak(), Paragraph("3. Notes", h1)]
doc.build(story)
```

The first template in the list is used for page one. `NextPageTemplate("id")` schedules a switch that takes effect at the next page break, so it is nearly always followed by `PageBreak()`. The callback receives the live canvas and the document, so it can read `doc.page`, `doc.pagesize` and any attributes you attached (like `doc.report_date`). `onPageEnd` is the sibling hook that fires after the flowables are drawn, useful for overlays that must sit on top of content.

### "Page x of y"

The total page count is unknown while page 1 is drawn. The standard solution is a canvas subclass that defers writing pages until `save()`, when the total is known. Pass it with `canvasmaker`.

```python
from reportlab.pdfgen import canvas as rl_canvas

class NumberedCanvas(rl_canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.setFont("Helvetica", 8)
            self.drawRightString(self._pagesize[0] - 20 * mm, 10 * mm,
                                 f"Page {self._pageNumber} of {total}")
            super().showPage()
        super().save()

doc.build(story, canvasmaker=NumberedCanvas)
```

This works with `SimpleDocTemplate` too. The alternative is `doc.multiBuild()` with a flowable that records the total on the first pass, but `NumberedCanvas` is simpler and single-pass.

> **Tip:** Put shared decoration in one function and parametrise it (`make_header(title)` returning a closure) so all templates draw identical headers from one place. Divergent headers across templates are the most common visual bug in multi-template reports.

### Try It Yourself

```python
import io, re
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, NextPageTemplate, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as rl_canvas

W, H = A4; m = 20 * mm
s = getSampleStyleSheet()

class NumberedCanvas(rl_canvas.Canvas):
    def __init__(self, *a, **k):
        super().__init__(*a, **k); self._saved = []
    def showPage(self):
        self._saved.append(dict(self.__dict__)); self._startPage()
    def save(self):
        total = len(self._saved)
        for st in self._saved:
            self.__dict__.update(st)
            self.setFont("Helvetica", 8)
            self.drawRightString(self._pagesize[0] - m, 10 * mm, f"Page {self._pageNumber} of {total}")
            super().showPage()
        super().save()

def header(c, doc):
    c.saveState(); w, h = doc.pagesize; c.setFont("Helvetica-Bold", 9)
    c.drawString(m, h - 12 * mm, "Weekly Production Status"); c.line(m, h - 14 * mm, w - m, h - 14 * mm)
    c.restoreState()

buf = io.BytesIO()
doc = BaseDocTemplate(buf, pagesize=A4, leftMargin=m, rightMargin=m, topMargin=m, bottomMargin=m)
doc.addPageTemplates([
    PageTemplate("Body", [Frame(m, m, W - 2*m, H - 2*m - 16*mm)], onPage=header),
    PageTemplate("Land", [Frame(m, m, H - 2*m, W - 2*m - 16*mm)], onPage=header, pagesize=landscape(A4)),
])
story = [Paragraph("Summary", s["Heading1"])]
story += [Paragraph("Files processed this week were reconciled against the state matrix. " * 6, s["BodyText"]) for _ in range(8)]
story += [NextPageTemplate("Land"), PageBreak(), Paragraph("Appendix: landscape rate matrix", s["Heading1"])]
doc.build(story, canvasmaker=NumberedCanvas)
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. When does `NextPageTemplate("Land")` take effect?
- [ ] Immediately, on the current page
- [x] At the next page break
- [ ] After `build()` finishes
> The switch is queued; a `PageBreak()` right after it is the usual pattern.

2. Which argument to `build()` installs a custom canvas class?
- [ ] `canvas=`
- [x] `canvasmaker=`
- [ ] `pagefactory=`
> `canvasmaker` receives a callable that constructs the canvas; the `NumberedCanvas` recipe relies on it.

3. What does `showBoundary=1` on a `Frame` do?
- [x] Draws the frame outline, handy for debugging layouts
- [ ] Adds a border to every flowable
- [ ] Prevents flowables from splitting
> It is purely diagnostic; remove it before delivery.

### Exercises

1. **Cover without header** — Build a document whose first page uses a `Cover` template with no header and whose remaining pages use a `Body` template with a header.
<details><summary>Solution</summary>

```python
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, NextPageTemplate, PageBreak, Paragraph
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
W, H = A4; m = 20*mm
def hdr(c, doc): c.setFont("Helvetica", 8); c.drawString(m, H - 12*mm, "Policy Manual")
doc = BaseDocTemplate("cover.pdf", pagesize=A4)
doc.addPageTemplates([PageTemplate("Cover", [Frame(m, m, W-2*m, H-2*m)]),
                      PageTemplate("Body", [Frame(m, m, W-2*m, H-2*m-16*mm)], onPage=hdr)])
from reportlab.lib.styles import getSampleStyleSheet; s = getSampleStyleSheet()
doc.build([Paragraph("Cover", s["Title"]), NextPageTemplate("Body"), PageBreak(), Paragraph("Body starts", s["Heading1"])])
```

</details>

2. **Two-column newsletter** — Create a page template with two frames and a story long enough to flow from the left column into the right.
<details><summary>Solution</summary>

```python
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
W, H = A4; m = 18*mm; g = 8*mm; cw = (W - 2*m - g) / 2
doc = BaseDocTemplate("cols.pdf", pagesize=A4)
doc.addPageTemplates([PageTemplate("Two", [Frame(m, m, cw, H-2*m), Frame(m+cw+g, m, cw, H-2*m)])])
s = getSampleStyleSheet()
doc.build([Paragraph("Column text flows automatically. " * 40, s["BodyText"]) for _ in range(12)])
```

</details>

### Interview Questions

**Q: How do you implement "Page X of Y" in ReportLab and why is it not trivial?**
The total is unknown until the last page is laid out, and the canvas writes each page's content as it goes. The standard fix is a `Canvas` subclass whose `showPage` stores a snapshot of the canvas state instead of emitting the page, and whose `save` replays all snapshots, stamps `Page n of total` on each and then writes them. You pass it via `doc.build(story, canvasmaker=NumberedCanvas)`. The alternative is `multiBuild`, which renders twice and is also needed for a TOC; if I already need multiBuild I record the page count on pass one and draw it on pass two. Both approaches must draw the number inside `saveState`/`restoreState` so the footer font does not leak.

**Q: What is the difference between `onPage` and `onPageEnd`, and when does draw order matter?**
`onPage` fires when a page begins, before any flowables are placed, so whatever it draws sits underneath the content; that is right for backgrounds, letterhead bands and watermarks meant to be behind text. `onPageEnd` fires after the frames are filled, so it draws on top, which is what you want for a "CONFIDENTIAL" stamp that must remain visible over tables with backgrounds, or for crop marks. Both receive `(canvas, doc)` and must not change global state. In practice I draw the header rule and page furniture in `onPage` and only overlays in `onPageEnd`.

**Q: How would you design the templates for a 700-page handbook with a cover, front matter in roman numerals, body and landscape appendices?**
Four `PageTemplate`s: `Cover` with no decoration, `Front` whose footer converts `doc.page` to roman numerals and whose numbering starts at i, `Body` with running headers that read the current chapter from an attribute set by a small flowable, and `Landscape` for wide tables. The story switches with `NextPageTemplate` plus `PageBreak`. For the body numbering to restart at 1, I keep my own counter on the document (`doc.body_page`) that the Body callback increments, instead of relying on `doc.page`, since the canvas page counter cannot be reset. The chapter title for the running header is captured by overriding `afterFlowable` on the document, the same hook used for the TOC.

## Table of contents, bookmarks & outline

Long documents need three navigational features: an in-text **table of contents** with page numbers, **bookmarks** (the outline panel in the reader) and internal **links**. ReportLab supports all three, but the TOC requires two rendering passes because page numbers are only known after layout.

### The TableOfContents flowable

```python
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle

toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle("TOC0", fontName="Helvetica-Bold", fontSize=11, leading=15, leftIndent=0),
    ParagraphStyle("TOC1", fontName="Helvetica", fontSize=10, leading=13, leftIndent=14),
]
toc.dotsMinLevel = 0          # draw dot leaders from level 0
```

The TOC learns about entries through **notifications**. Whenever a heading is drawn, the document must call `self.notify('TOCEntry', (level, text, pageNumber, key))`. The optional fourth element `key` makes the entry a clickable link to a bookmark.

### Hooking headings

Override `afterFlowable` on a `BaseDocTemplate` subclass. It runs after each flowable is drawn, when `self.page` is correct.

```python
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph

class ManualDoc(BaseDocTemplate):
    def __init__(self, filename, **kw):
        super().__init__(filename, **kw)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="F")
        self.addPageTemplates([PageTemplate("Body", [frame])])

    def beforeDocument(self):
        self._hcount = 0                    # reset on every multiBuild pass

    def afterFlowable(self, flowable):
        if not isinstance(flowable, Paragraph):
            return
        level = {"H1": 0, "H2": 1}.get(flowable.style.name)
        if level is None:
            return
        text = flowable.getPlainText()
        self._hcount += 1
        key = f"h{self._hcount}"
        self.canv.bookmarkPage(key)
        self.canv.addOutlineEntry(text, key, level=level, closed=False)
        self.notify("TOCEntry", (level, text, self.page, key))
```

Three things happen per heading: `bookmarkPage(key)` records a named destination on the current page, `addOutlineEntry` adds it to the reader's bookmark panel, and `notify` feeds the TOC. The style names `H1`/`H2` must match the `ParagraphStyle(name=...)` you use for headings.

### multiBuild

```python
doc = ManualDoc("manual.pdf")
story = [Paragraph("Contents", h1_nolevel), toc, PageBreak(), Paragraph("1. Scope", h1), ...]
doc.multiBuild(story)
```

`multiBuild` renders repeatedly (up to `maxPasses`, default 10) until the TOC entries stop changing, which normally takes two passes. Because the TOC itself may grow and push content, pass three sometimes occurs. Everything in `afterFlowable` must be repeatable, hence the counter reset in `beforeDocument`.

### Bookmarks without a TOC

If you only want the outline panel (for example in a 168-field form pack), use the canvas API directly in a callback or custom flowable:

```python
c.bookmarkPage("sec-4")
c.addOutlineEntry("4. Wire Approvals", "sec-4", level=0)
c.addOutlineEntry("4.1 Two-person rule", "sec-4-1", level=1)
c.showOutline()     # open the bookmarks panel when the PDF is opened
```

Levels must not skip: a level 2 entry needs a preceding level 1.

### Internal and external links

Inside `Paragraph` markup, `<a href="#sec-4">see section 4</a>` links to a bookmark key prefixed with `#`, and `<a href="https://...">` links out. On the canvas, `linkRect("", "sec-4", (x1, y1, x2, y2))` creates a clickable area, and `linkURL(url, rect)` an external link. Table cells can include `Paragraph`s with anchors, which is how a rate matrix can link each state to its detail page.

> **Interview note:** "Why is my TOC empty?" Almost always because `notify` was never called: the heading style names did not match, or `build()` was used instead of `multiBuild()`.

### Try It Yourself

```python
import io, re
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, PageBreak, Spacer
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm

base = getSampleStyleSheet()["Normal"]
H1 = ParagraphStyle("H1", parent=base, fontName="Helvetica-Bold", fontSize=15, leading=18, spaceBefore=10)
H2 = ParagraphStyle("H2", parent=base, fontName="Helvetica-Bold", fontSize=12, leading=15, spaceBefore=6)

class ManualDoc(BaseDocTemplate):
    def __init__(self, f, **kw):
        super().__init__(f, **kw)
        self.addPageTemplates([PageTemplate("Body", [Frame(self.leftMargin, self.bottomMargin, self.width, self.height)])])
    def beforeDocument(self): self._n = 0
    def afterFlowable(self, fl):
        if isinstance(fl, Paragraph) and fl.style.name in ("H1", "H2"):
            level = 0 if fl.style.name == "H1" else 1
            self._n += 1; key = f"h{self._n}"
            self.canv.bookmarkPage(key); self.canv.addOutlineEntry(fl.getPlainText(), key, level=level)
            self.notify("TOCEntry", (level, fl.getPlainText(), self.page, key))

toc = TableOfContents()
toc.levelStyles = [ParagraphStyle("T0", parent=base, fontName="Helvetica-Bold", leading=14),
                   ParagraphStyle("T1", parent=base, leftIndent=14, leading=13)]
story = [Paragraph("Contents", ParagraphStyle("plain", parent=H1)), toc, PageBreak()]
for ch in range(1, 4):
    story.append(Paragraph(f"{ch}. Chapter {ch}", H1))
    for sec in range(1, 3):
        story.append(Paragraph(f"{ch}.{sec} Section", H2))
        story += [Paragraph("Body text for this section. " * 30, base) for _ in range(3)]
buf = io.BytesIO()
doc = ManualDoc(buf, leftMargin=20*mm, rightMargin=20*mm)
doc.multiBuild(story)
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages; outline items:", data.count(b"/Title ("))
```

### Quiz

1. Why does a TOC require `multiBuild()`?
- [x] Page numbers are only known after a first layout pass
- [ ] `build()` does not support `PageBreak`
- [ ] The TOC flowable is too large for one page
> The first pass collects entries; the second renders the TOC with correct numbers, repeating until stable.

2. What does `canvas.bookmarkPage(key)` do?
- [ ] Adds an entry to the outline panel
- [x] Records a named destination on the current page
- [ ] Creates a clickable link
> `addOutlineEntry` adds the visible bookmark and links it to that destination key.

3. Which document hook is used to detect headings as they are drawn?
- [ ] `onPage`
- [x] `afterFlowable`
- [ ] `handle_pageBegin`
> `afterFlowable` runs after each flowable with `self.page` set correctly.

### Exercises

1. **Three-level TOC** — Extend the `afterFlowable` hook to support `H3` at level 2 and add a third TOC style with a 28 pt indent.
<details><summary>Solution</summary>

```python
LEVELS = {"H1": 0, "H2": 1, "H3": 2}
def afterFlowable(self, fl):
    if isinstance(fl, Paragraph) and fl.style.name in LEVELS:
        level = LEVELS[fl.style.name]; self._n += 1; key = f"h{self._n}"
        self.canv.bookmarkPage(key); self.canv.addOutlineEntry(fl.getPlainText(), key, level=level)
        self.notify("TOCEntry", (level, fl.getPlainText(), self.page, key))
# toc.levelStyles.append(ParagraphStyle("T2", parent=base, leftIndent=28, leading=12))
```

</details>

2. **Cross-reference link** — Add a paragraph containing a link that jumps to the bookmark of Chapter 2.
<details><summary>Solution</summary>

```python
# Chapter 2's heading is the 3rd heading drawn (H1, H2, H2, H1 ...) so its key is h4 in the demo;
# a robust approach stores keys by title in a dict inside afterFlowable.
Paragraph('See <a href="#h4" color="blue">Chapter 2</a> for the escalation matrix.', base)
```

</details>

### Interview Questions

**Q: Explain the mechanism behind ReportLab's TableOfContents end to end.**
The `TableOfContents` flowable starts empty. During `multiBuild`, the document's `afterFlowable` hook inspects each drawn flowable, and for headings calls `notify('TOCEntry', (level, text, page, key))`; the TOC receives it via `handle_flowable`-style notification and stores the entry for the next pass. When the pass finishes, `multiBuild` compares the entries with the previous pass; if they changed, it rebuilds, and the TOC now renders the stored entries with dot leaders and page numbers using `levelStyles`. Because the rendered TOC can change the pagination of everything after it, a third pass may be needed; `maxPasses` bounds it. Bookmarks and clickable entries are just `bookmarkPage` and `addOutlineEntry` calls made in the same hook.

**Q: How did you handle a 767-page handbook where the TOC alone was eleven pages?**
Pagination of eleven TOC pages shifts every subsequent page number, so the first pass numbers were all wrong by about eleven; `multiBuild` handles that by rerunning, but each pass on a document that size took over a minute. I reduced passes by reserving a fixed number of TOC pages with a `CondPageBreak` after the TOC so growth did not ripple, and I cached the wrapped `Paragraph` objects between passes since their text does not change. I also generated the TOC entries in Python from the outline data model and used ReportLab only to render them, which let me unit test the numbering. Finally the outline panel was built from the same data so bookmarks and TOC could never disagree.

**Q: What are the rules for outline entries, and what happens if you break them?**
Entries must form a proper tree: the first entry has to be level 0 and any entry may be at most one level deeper than the previous one; jumping from 0 to 2 raises a `ValueError` at save time. Each entry needs a destination key that has been created with `bookmarkPage` on some page, otherwise the reader has nowhere to jump. `closed=True` collapses a branch by default, which is kinder for handbooks with hundreds of sub-sections. `showOutline()` makes the panel open on launch, which clients with long manuals appreciate; for one-page forms leave it closed.

## Charts with reportlab.graphics

`reportlab.graphics` is a vector drawing toolkit with a chart library on top. Charts are drawn as PDF vectors, so they stay sharp at any zoom and add only a few kilobytes, which beats pasting matplotlib PNGs for production reports.

### Drawings and shapes

Everything lives inside a `Drawing`, which is itself a flowable. You add shapes (`Rect`, `Circle`, `Line`, `String`, `Polygon`) or chart objects to it.

```python
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.lib import colors

d = Drawing(200, 60)
d.add(Rect(0, 0, 200, 60, fillColor=colors.whitesmoke, strokeColor=None))
d.add(String(10, 25, "QA score: 97.1%", fontName="Helvetica-Bold", fontSize=14, fillColor=colors.HexColor("#16A085")))
story.append(d)                     # in Platypus
# or on a canvas:
from reportlab.graphics import renderPDF
renderPDF.draw(d, c, 72, 600)
```

Drawing coordinates work like the canvas, origin bottom-left, and the drawing's `width`/`height` decide how much space Platypus reserves.

### Bar chart

```python
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.legends import Legend

d = Drawing(420, 220)
bc = VerticalBarChart()
bc.x, bc.y, bc.width, bc.height = 50, 40, 330, 150
bc.data = [(412, 305, 41), (390, 320, 55)]           # two series
bc.categoryAxis.categoryNames = ["Texas", "Florida", "Wyoming"]
bc.valueAxis.valueMin, bc.valueAxis.valueMax, bc.valueAxis.valueStep = 0, 500, 100
bc.bars[0].fillColor = colors.HexColor("#B03A2E")
bc.bars[1].fillColor = colors.HexColor("#16A085")
bc.barLabelFormat = "%d"
bc.barLabels.nudge = 7
bc.groupSpacing = 12
d.add(bc)

leg = Legend()
leg.x, leg.y = 395, 180
leg.colorNamePairs = [(colors.HexColor("#B03A2E"), "Week 36"), (colors.HexColor("#16A085"), "Week 37")]
leg.alignment = "right"
d.add(leg)
```

`HorizontalBarChart` is the same with axes swapped. Each series is a tuple; categories index across the tuple. Bar labels need a format string and a `nudge` so they sit above the bar.

### Line and pie charts

```python
from reportlab.graphics.charts.linecharts import HorizontalLineChart
lc = HorizontalLineChart()
lc.x, lc.y, lc.width, lc.height = 40, 30, 340, 150
lc.data = [(95.1, 96.0, 97.4, 97.1, 98.2)]
lc.categoryAxis.categoryNames = ["W33", "W34", "W35", "W36", "W37"]
lc.valueAxis.valueMin, lc.valueAxis.valueMax = 90, 100
lc.lines[0].strokeColor = colors.HexColor("#B03A2E")
lc.lines[0].strokeWidth = 2

from reportlab.graphics.charts.piecharts import Pie
pie = Pie()
pie.x, pie.y, pie.width, pie.height = 50, 20, 150, 150
pie.data = [412, 305, 41]
pie.labels = ["TX", "FL", "WY"]
pie.sideLabels = 1                       # labels outside with pointer lines
pie.slices.strokeWidth = 0.5
pie.slices[2].popout = 6
pie.slices[0].fillColor = colors.HexColor("#B03A2E")
```

`LinePlot` (x/y numeric data) and `ScatterPlot` exist for non-categorical series, and `reportlab.graphics.charts.axes` lets you format ticks with `labelTextFormat = "%0.1f%%"`.

### Styling checklist

| Property | Where | Effect |
|---|---|---|
| `categoryAxis.labels.angle`, `.dy` | bar/line | Rotate or shift long category labels |
| `valueAxis.labelTextFormat` | all | Format numbers, e.g. `"$%d"` |
| `bars.strokeColor = None` | bar | Remove outlines for a flat look |
| `lines[i].symbol = makeMarker('FilledCircle')` | line | Add point markers |
| `pie.slices.fontName`, `fontSize` | pie | Label font |

### Exporting as PNG

`renderPM.drawToFile(d, "chart.png", fmt="PNG")` rasterises a drawing for email or Excel. Since ReportLab 4 this needs the optional `rlPyCairo` package (`pip install rlPyCairo`); `renderSVG.drawToFile` writes SVG with no extra dependency.

> **Tip:** Charts are data-driven objects; compute `valueMax` from the data (`max(max(s) for s in data) * 1.15`) rather than hard-coding it, otherwise next week's numbers will clip.

### Try It Yourself

```python
import io, re
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

s = getSampleStyleSheet()
weeks = {"Week 36": (412, 305, 41), "Week 37": (390, 320, 55)}
d = Drawing(440, 230)
bc = VerticalBarChart(); bc.x, bc.y, bc.width, bc.height = 50, 40, 360, 160
bc.data = list(weeks.values())
bc.categoryAxis.categoryNames = ["Texas", "Florida", "Wyoming"]
top = max(max(v) for v in weeks.values())
bc.valueAxis.valueMin = 0; bc.valueAxis.valueMax = int(top * 1.2); bc.valueAxis.valueStep = 100
bc.bars[0].fillColor = colors.HexColor("#B03A2E"); bc.bars[1].fillColor = colors.HexColor("#16A085")
bc.barLabelFormat = "%d"; bc.barLabels.nudge = 7; bc.bars.strokeColor = None
d.add(bc); d.add(String(50, 210, "Files closed by state", fontName="Helvetica-Bold", fontSize=11))

p = Drawing(300, 180); pie = Pie(); pie.x, pie.y, pie.width, pie.height = 20, 15, 150, 150
pie.data = [412, 305, 41]; pie.labels = ["TX", "FL", "WY"]; pie.sideLabels = 1
pie.slices[0].fillColor = colors.HexColor("#B03A2E"); pie.slices[1].fillColor = colors.HexColor("#16A085")
pie.slices[2].fillColor = colors.HexColor("#7B241C"); p.add(pie)

buf = io.BytesIO()
doc = SimpleDocTemplate(buf)
doc.build([Paragraph("Production dashboard", s["Heading1"]), d, Paragraph("Share by state", s["Heading2"]), p])
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. What is a `Drawing` in Platypus terms?
- [x] A flowable that reserves `width × height` and renders vector shapes
- [ ] A raster image
- [ ] A page template
> Drawings flow with the story like paragraphs and stay vector in the PDF.

2. How do you display two series in a `VerticalBarChart`?
- [ ] Add two charts
- [x] Set `bc.data` to a list of two tuples
- [ ] Use `bc.series = 2`
> Each tuple is a series; categories are the positions within each tuple.

3. What does `pie.sideLabels = 1` do?
- [ ] Hides the labels
- [x] Places labels outside the pie with pointer lines
- [ ] Sorts slices by size
> Side labels avoid overlapping text on small slices.

### Exercises

1. **KPI tile** — Write `kpi(label, value, color)` returning a 120×60 `Drawing` with a coloured band, the value in 18 pt bold and the label in 8 pt.
<details><summary>Solution</summary>

```python
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.lib import colors
def kpi(label, value, color="#B03A2E"):
    d = Drawing(120, 60)
    d.add(Rect(0, 0, 120, 60, fillColor=colors.whitesmoke, strokeColor=None))
    d.add(Rect(0, 54, 120, 6, fillColor=colors.HexColor(color), strokeColor=None))
    d.add(String(8, 24, str(value), fontName="Helvetica-Bold", fontSize=18))
    d.add(String(8, 8, label, fontName="Helvetica", fontSize=8, fillColor=colors.grey))
    return d
```

</details>

2. **Trend line with markers** — Build a `HorizontalLineChart` for five weekly QA scores with filled-circle markers and a y-axis showing percentages.
<details><summary>Solution</summary>

```python
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.widgets.markers import makeMarker
d = Drawing(400, 200); lc = HorizontalLineChart()
lc.x, lc.y, lc.width, lc.height = 40, 30, 340, 150
lc.data = [(95.1, 96.0, 97.4, 97.1, 98.2)]
lc.categoryAxis.categoryNames = ["W33", "W34", "W35", "W36", "W37"]
lc.valueAxis.valueMin, lc.valueAxis.valueMax, lc.valueAxis.valueStep = 90, 100, 2
lc.valueAxis.labelTextFormat = "%d%%"
lc.lines[0].symbol = makeMarker("FilledCircle"); lc.lines[0].strokeWidth = 2
d.add(lc)
```

</details>

### Interview Questions

**Q: Why use `reportlab.graphics` charts instead of embedding matplotlib images?**
Vector charts scale without pixelation, weigh a few kilobytes instead of hundreds, keep text selectable and searchable, and inherit the document's embedded fonts so the chart typography matches the report. They are also generated in the same process without a matplotlib dependency, which matters in a slim Docker image or a serverless function. The trade-off is expressiveness: matplotlib has far more chart types and statistical helpers, so for a heat map or box plot I render a PNG at 300 ppi and draw it with `Image`. For the bar, line and pie charts that make up 90 percent of a status report, the native library is the better engineering choice.

**Q: How do you keep chart scales consistent across a weekly report series?**
Hard-coding `valueMax` breaks when the data grows, while auto-scaling from each week's data makes week-to-week comparison misleading. I compute the axis from a rolling window, for example the maximum over the last 12 weeks rounded up to a nice step, and store it alongside the data so both the PDF chart and the Power BI dashboard use the same scale. `valueStep` is chosen so there are five to seven gridlines. Category label rotation (`labels.angle = 30`) is set when the longest name exceeds the slot width measured with `stringWidth`, not by hand.

**Q: How would you rasterise a ReportLab chart for an email or Excel sheet?**
`renderPM.drawToFile(drawing, "chart.png", fmt="PNG", dpi=200)` renders the drawing to a bitmap; on ReportLab 4 this requires installing `rlPyCairo` because the old C renderer was split out of the core package. `renderSVG.drawToFile` produces SVG without extra dependencies and is ideal for web pages. For Excel I write the PNG into a `BytesIO` and insert it with openpyxl's `Image`. The same `Drawing` object serves all three outputs, which keeps the PDF report and the emailed summary visually identical.

## Form fields with canvas.acroForm

ReportLab can create **AcroForm** fields directly: text boxes, check boxes, radio buttons, combo boxes and list boxes. This is how you generate fillable intake forms, QA scorecards and closing checklists without opening Acrobat, and it is the same field model behind the 168-field forms produced for Fiverr clients.

### The acroForm object

Every canvas has a lazily created `c.acroForm`. The first access creates the form dictionary; all field methods live on it and take page coordinates like any drawing call.

```python
from reportlab.pdfgen import canvas
from reportlab.lib import colors

c = canvas.Canvas("intake.pdf")
form = c.acroForm
c.setFont("Helvetica", 10)
c.drawString(72, 705, "Client name:")
form.textfield(name="client_name", tooltip="Client legal name", x=150, y=700,
               width=250, height=18, borderStyle="inset", borderWidth=0.5,
               borderColor=colors.grey, fillColor=colors.whitesmoke,
               textColor=colors.black, fontName="Helvetica", fontSize=10,
               value="", maxlen=80, forceBorder=True)
```

`name` must be unique per field (fields with the same name share one value). `tooltip` becomes the accessible label. `forceBorder=True` draws the border in the page appearance so it shows in viewers that do not render field borders.

### Check boxes, radios and choices

```python
form.checkbox(name="agree_terms", tooltip="Agree to terms", x=150, y=670, size=12,
              buttonStyle="check", borderWidth=0.5, checked=False)

# radio group: same name, different values
form.radio(name="product", value="owner", selected=True, x=150, y=640, size=12, buttonStyle="circle")
form.radio(name="product", value="lender", selected=False, x=230, y=640, size=12, buttonStyle="circle")

form.choice(name="state", tooltip="Property state", value="TX", options=["TX", "FL", "WY"],
            x=150, y=610, width=80, height=18, fieldFlags="combo")
form.listbox(name="endorsements", options=["T-19", "T-36", "T-42"], value=["T-19"],
             x=150, y=540, width=120, height=60, fieldFlags="multiSelect")
```

`buttonStyle` accepts `check`, `cross`, `circle`, `star`, `diamond`. Options for `choice` can be strings or `(export_value, display_label)` tuples.

### Field flags

`fieldFlags` is a space-separated string of PDF field flags:

| Flag | Meaning |
|---|---|
| `required` | Viewer must fill it before submit |
| `readOnly` | Cannot be edited |
| `multiline` | Text field wraps and accepts Enter |
| `password` | Masks input |
| `doNotScroll`, `doNotSpellCheck` | Text field behaviour |
| `combo`, `edit`, `sort` | Choice as combo box, editable, sorted |
| `multiSelect` | List box allows several values |
| `noToggleToOff` | Radio group always has one selected |

Example: `fieldFlags="multiline required"` for a notes box. `annotationFlags` (default `"print"`) controls whether the widget prints; use `"print hidden"` for a hidden field carrying an ID.

### Layout strategy for big forms

Generate field positions from a data structure, not by hand. A list of dicts with `label`, `name`, `type`, `y` lets you draw labels and fields in one loop and reuse the same layout for the printable and fillable versions. Keep a consistent 22 pt row height, label column at x=72 and field column at x=180, and page-break when `y` drops below the bottom margin. Prefix names by section (`sec3_notes`) so exports stay readable in Excel.

### What ReportLab cannot do

ReportLab writes fields and their appearance streams but has no JavaScript calculation engine, no submit actions and no signing. For calculated totals, format scripts or field validation, add them afterwards with pypdf (`add_js`), pdftk or Acrobat; for filling generated fields programmatically use pypdf's `update_page_form_field_values`.

> **Warning:** Fields drawn near a page edge are clipped by the reader but still exist, which is a common cause of "invisible required field" complaints. Keep widgets inside the margins and give every field a `tooltip` for accessibility.

### Try It Yourself

```python
import io, re
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4

W, H = A4
buf = io.BytesIO()
c = canvas.Canvas(buf, pagesize=A4)
form = c.acroForm
c.setFont("Helvetica-Bold", 14); c.drawString(72, H - 60, "Title Order Intake Form")
c.setFont("Helvetica", 10)
rows = [("Client name", "client_name", "text"), ("Property address", "address", "text"),
        ("Loan amount", "loan_amount", "text"), ("Rush order", "rush", "check"),
        ("State", "state", "choice"), ("Notes", "notes", "multiline")]
y = H - 100
for label, name, kind in rows:
    c.drawString(72, y + 4, label + ":")
    if kind == "text":
        form.textfield(name=name, tooltip=label, x=180, y=y, width=260, height=18, borderWidth=0.5,
                       borderColor=colors.grey, forceBorder=True, fontSize=10)
    elif kind == "check":
        form.checkbox(name=name, tooltip=label, x=180, y=y + 2, size=12, buttonStyle="check", borderWidth=0.5)
    elif kind == "choice":
        form.choice(name=name, tooltip=label, value="TX", options=["TX", "FL", "WY"], x=180, y=y,
                    width=80, height=18, fieldFlags="combo", borderWidth=0.5)
    else:
        form.textfield(name=name, tooltip=label, x=180, y=y - 42, width=260, height=60,
                       fieldFlags="multiline", borderWidth=0.5, forceBorder=True, fontSize=9)
        y -= 42
    y -= 26
c.save()
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages; widgets:",
      data.count(b"/Subtype /Widget"))
```

### Quiz

1. How do you create a radio group in ReportLab?
- [x] Several `form.radio()` calls with the same `name` and different `value`s
- [ ] One `form.radio()` with a list of values
- [ ] `form.checkbox()` with `buttonStyle="circle"`
> Radios sharing a name form a group; exactly one value can be selected.

2. Which flag makes a text field accept multiple lines?
- [ ] `fieldFlags="wrap"`
- [x] `fieldFlags="multiline"`
- [ ] `height > 18`
> Height alone does not enable wrapping; the flag does.

3. Can ReportLab attach JavaScript calculations to fields?
- [ ] Yes, via `form.script()`
- [x] No, add them afterwards with pypdf, pdftk or Acrobat
- [ ] Only for combo boxes
> ReportLab creates fields and appearances but has no action or JavaScript API.

### Exercises

1. **Field map export** — Extend the intake form generator to also return a list of `(name, type, page)` tuples for documentation.
<details><summary>Solution</summary>

```python
def add_field(form, registry, page, **kw):
    kind = kw.pop("kind")
    getattr(form, kind)(**kw)
    registry.append((kw["name"], kind, page))
registry = []
# add_field(form, registry, 1, kind="textfield", name="client_name", x=180, y=700, width=260, height=18)
print(registry)
```

</details>

2. **Fill generated fields** — Use pypdf to set `client_name` and `state` on the intake PDF.
<details><summary>Solution</summary>

```python
from pypdf import PdfReader, PdfWriter
reader = PdfReader("intake.pdf")
writer = PdfWriter(); writer.append(reader)
writer.update_page_form_field_values(writer.pages[0], {"client_name": "Smith & Sons LLC", "state": "FL"}, auto_regenerate=False)
writer.set_need_appearances_writer(True)
with open("intake_filled.pdf", "wb") as f: writer.write(f)
```

</details>

### Interview Questions

**Q: How do you design a 150-plus field PDF form so it stays maintainable?**
I treat the form as data: a spreadsheet or JSON listing each field's name, label, type, page, position and flags, with a naming convention such as `sec2_borrower_name`. A generator loops over it to draw labels, rules and widgets, so moving a field is a data edit rather than code surgery, and the same list produces the field map the client receives for their automation. Tab order follows creation order, so I sort the list by page, then y, then x. Every field gets a tooltip, required fields get the flag, and I validate the output by reading it back with pypdf and asserting the field count and names match the source.

**Q: What are the limits of ReportLab's AcroForm support compared with Acrobat or pdf-lib?**
ReportLab creates the standard widget types with appearance streams and flags, which covers intake forms and scorecards, but it does not support JavaScript actions, calculated fields, submit buttons, signature fields, date pickers or rich-text fields. It also cannot edit an existing form; it only creates new ones. When a client needs auto-sum totals or validation I generate the fields with ReportLab and inject the scripts with pypdf or finish them in Acrobat's Prepare Form tool. For workflows that must modify existing forms I use pypdf or pdf-lib instead.

**Q: A client reports that filled values do not show in some viewers. What is happening?**
Fields store a value (`/V`) and an appearance stream (`/AP`); if a filler updates the value without regenerating the appearance, viewers that do not rebuild appearances show the old blank widget. The fix is either to regenerate appearances when filling, or to set the document's `NeedAppearances` flag so the viewer redraws fields on open. With pypdf that is `writer.set_need_appearances_writer(True)`. ReportLab-generated fields ship with correct appearances, and `forceBorder=True` bakes the border into the page so it never depends on the viewer.

## Watermarks, backgrounds & letterhead overlays

Fixed decoration such as a "DRAFT" watermark, a coloured header band, a confidential stamp, or a client's designed letterhead is drawn on every page by a callback, or added afterwards by overlaying two PDFs. Both routes are standard, and choosing between them is a matter of whether the letterhead exists as a PDF already.

### Watermark in a callback

Rotated, semi-transparent text drawn in `onPage` sits under the content.

```python
from reportlab.lib import colors

def watermark(canvas, doc):
    canvas.saveState()
    w, h = doc.pagesize
    canvas.setFont("Helvetica-Bold", 90)
    canvas.setFillColor(colors.HexColor("#B03A2E"))
    canvas.setFillAlpha(0.12)
    canvas.translate(w / 2, h / 2)
    canvas.rotate(40)
    canvas.drawCentredString(0, 0, "DRAFT")
    canvas.restoreState()

doc.build(story, onFirstPage=watermark, onLaterPages=watermark)
```

`setFillAlpha` requires PDF 1.4 or later, which is ReportLab's default. If the file is heading to PDF/X-1a, avoid alpha and use a light tint instead (`colors.Color(0.95, 0.85, 0.85)`) drawn before the content.

### Backgrounds and bands

A branded letterhead is often just a band, a logo and a footer line, which you can draw directly.

```python
def letterhead(canvas, doc):
    canvas.saveState()
    w, h = doc.pagesize
    canvas.setFillColor(colors.HexColor("#B03A2E"))
    canvas.rect(0, h - 22 * mm, w, 22 * mm, fill=1, stroke=0)
    canvas.drawImage(LOGO, 20 * mm, h - 19 * mm, width=36 * mm, height=16 * mm,
                     preserveAspectRatio=True, mask="auto")
    canvas.setFillColor(colors.grey); canvas.setFont("Helvetica", 7.5)
    canvas.drawCentredString(w / 2, 10 * mm, "Ali Raza Document Services - Lahore - alirazadocs.example")
    canvas.restoreState()
```

Remember to make the frames shorter (`topMargin` of at least the band height plus spacing) so text never runs under the band.

### Overlaying an existing letterhead PDF

Designers deliver letterheads as vector PDFs. The cleanest approach is to generate the body with ReportLab on plain pages and merge with pypdf, placing the letterhead **under** each content page.

```python
import io
from pypdf import PdfReader, PdfWriter

body_bytes = build_report()                 # your ReportLab function returning bytes
letter = PdfReader("letterhead.pdf")
first, later = letter.pages[0], letter.pages[1 if len(letter.pages) > 1 else 0]

reader = PdfReader(io.BytesIO(body_bytes))
writer = PdfWriter()
for i, page in enumerate(reader.pages):
    page.merge_page(first if i == 0 else later, over=False)   # letterhead beneath the content
    writer.add_page(page)
with open("report_on_letterhead.pdf", "wb") as f:
    writer.write(f)
```

`over=False` (pypdf 3+) draws the merged page underneath. Page sizes must match; if the letterhead is Letter and the body is A4 you will see an offset, so generate the body at the letterhead's size, read with `letter.pages[0].mediabox`.

### Stamping over content

For a "COPY" or "PAID" stamp that must remain visible above tables, either use `onPageEnd` in a `PageTemplate`, or build a one-page stamp PDF with ReportLab and merge it with `over=True` onto every page of any document, including scans. That second pattern is a reusable utility worth keeping.

```python
def make_stamp(text, pagesize):
    buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=pagesize)
    c.setFont("Helvetica-Bold", 36); c.setFillColor(colors.red); c.setFillAlpha(0.5)
    c.translate(pagesize[0] / 2, pagesize[1] / 2); c.rotate(30); c.drawCentredString(0, 0, text)
    c.save(); return PdfReader(io.BytesIO(buf.getvalue())).pages[0]
```

### Page numbering on scanned packets

The same overlay technique adds Bates numbers or "Exhibit A - page 3" to scanned files: generate a numbering PDF with one page per scan page, then merge page by page. This is common in title-search deliverables where hundreds of recorded instruments need consistent labels.

> **Tip:** Keep watermark and letterhead code in a module with functions that accept `(canvas, doc)`, and compose them: `def on_page(c, d): letterhead(c, d); watermark(c, d)`. One template can then mix any combination without duplication.

### Try It Yourself

```python
import io, re
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4

s = getSampleStyleSheet()

def letterhead(c, doc):
    c.saveState(); w, h = doc.pagesize
    c.setFillColor(colors.HexColor("#B03A2E")); c.rect(0, h - 22*mm, w, 22*mm, fill=1, stroke=0)
    c.setFillColor(colors.white); c.setFont("Helvetica-Bold", 16); c.drawString(20*mm, h - 14*mm, "AR Document Services")
    c.setFillColor(colors.grey); c.setFont("Helvetica", 7.5)
    c.drawCentredString(w/2, 10*mm, "Lahore, Pakistan  -  Page %d" % doc.page); c.restoreState()

def watermark(c, doc):
    c.saveState(); w, h = doc.pagesize
    c.setFont("Helvetica-Bold", 90); c.setFillColor(colors.HexColor("#B03A2E")); c.setFillAlpha(0.10)
    c.translate(w/2, h/2); c.rotate(40); c.drawCentredString(0, 0, "DRAFT"); c.restoreState()

def on_page(c, doc):
    letterhead(c, doc); watermark(c, doc)

buf = io.BytesIO()
doc = SimpleDocTemplate(buf, pagesize=A4, topMargin=30*mm, bottomMargin=20*mm)
story = [Paragraph("Engagement letter", s["Heading1"])]
story += [Paragraph("This letter confirms the scope of document production services agreed for the policy manual project. " * 4, s["BodyText"]) for _ in range(14)]
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages; transparency used:", b"/ca " in data)
```

### Quiz

1. Where should a watermark be drawn so that it appears beneath the text?
- [x] In `onPage` / `onFirstPage` / `onLaterPages`, before flowables are placed
- [ ] In `onPageEnd`
- [ ] As the last flowable of the story
> Page-begin callbacks paint first, so content covers them.

2. In pypdf, how do you put a letterhead page underneath a content page?
- [ ] `letterhead.merge_page(content)`
- [x] `content.merge_page(letterhead, over=False)`
- [ ] `writer.add_background(letterhead)`
> `over=False` places the merged page under the existing content.

3. Why keep top margins larger when drawing a header band?
- [ ] Because callbacks cannot draw in the margin
- [x] So the frame starts below the band and text never runs under it
- [ ] To make the PDF smaller
> Frames are defined by the margins; the band is outside the frame only if the margin is big enough.

### Exercises

1. **Confidential stamp utility** — Write `stamp_pdf(src_bytes, text)` that overlays a rotated red stamp on every page of any PDF and returns bytes.
<details><summary>Solution</summary>

```python
import io
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
def stamp_pdf(src_bytes, text):
    reader = PdfReader(io.BytesIO(src_bytes)); writer = PdfWriter()
    for page in reader.pages:
        w, h = float(page.mediabox.width), float(page.mediabox.height)
        b = io.BytesIO(); c = canvas.Canvas(b, pagesize=(w, h))
        c.setFont("Helvetica-Bold", 40); c.setFillColor(colors.red); c.setFillAlpha(0.5)
        c.translate(w/2, h/2); c.rotate(30); c.drawCentredString(0, 0, text); c.save()
        page.merge_page(PdfReader(io.BytesIO(b.getvalue())).pages[0], over=True); writer.add_page(page)
    out = io.BytesIO(); writer.write(out); return out.getvalue()
```

</details>

2. **First page vs later pages** — Use a full letterhead band on page one and a slim 8 mm band on later pages via `onFirstPage` and `onLaterPages`.
<details><summary>Solution</summary>

```python
from reportlab.lib import colors
from reportlab.lib.units import mm
def band(height):
    def draw(c, doc):
        c.saveState(); w, h = doc.pagesize
        c.setFillColor(colors.HexColor("#B03A2E")); c.rect(0, h - height, w, height, fill=1, stroke=0)
        c.restoreState()
    return draw
# doc.build(story, onFirstPage=band(22*mm), onLaterPages=band(8*mm))
```

</details>

### Interview Questions

**Q: When do you draw a letterhead in ReportLab versus overlaying the designer's PDF?**
If the letterhead is simple (band, logo PNG, footer text) I draw it in the page callback because the whole deliverable then comes from one script with no external file dependency, and I can tweak it per client from configuration. If the designer supplies a vector letterhead with exact Pantone colours and typography, I overlay it with pypdf so their artwork is preserved bit-for-bit and they can update it without touching my code. Overlay also lets one body PDF be re-issued on different letterheads. The trade-offs are an extra dependency and the need to match page sizes exactly.

**Q: A watermark must not appear on the final client copy but must on drafts. How do you structure that?**
The generator takes a `draft: bool` option and composes the page callback from a list of decorators: `[letterhead]` for final, `[letterhead, watermark]` for draft. The build function is otherwise identical, so the two outputs differ only by the watermark, and the file name and PDF metadata subject are set to "DRAFT" as well so it cannot be confused. In pipelines I also record the option in a JSON sidecar. If the draft status is decided after generation, the stamp-overlay utility can add the watermark to an existing final without regenerating.

**Q: How do you Bates-number a 400-page scanned exhibit packet?**
Read the packet with pypdf, and for each page create a one-page ReportLab canvas of the same size that draws the label such as `AR-000123` at the bottom right in 8 pt, then `merge_page` it with `over=True`. Because scans are images, the overlay is the only text on the page, which also makes the labels searchable. The label position is measured from the page's `mediabox` so mixed Letter and Legal pages are handled. Generating all overlays into one multi-page PDF first and merging page by page is faster than creating 400 separate canvases.

# LEVEL: Expert

## Data-driven branded reports (JSON to PDF)

The production pattern is: data arrives as JSON (from a database export, an API or a Power BI dataset), a **theme** describes the client brand, and a **builder** turns both into a story. Separating these three keeps the code testable and lets the same builder serve every client with a different theme file.

### The data contract

```json
{
  "client": "Stewart Title - Texas Division",
  "period": "Week 37, 2026",
  "kpis": {"files": 758, "avg_tat_days": 3.4, "qa_score": 0.971},
  "by_state": [
    {"state": "Texas", "files": 412, "tat": 3.2, "qa": 0.971},
    {"state": "Florida", "files": 305, "tat": 3.8, "qa": 0.954},
    {"state": "Wyoming", "files": 41, "tat": 2.9, "qa": 0.988}
  ],
  "notes": ["Two files escalated for vesting issues.", "Wyoming volume up 18% week on week."]
}
```

Validate the payload before rendering. A `pydantic` model or a simple schema check turns a missing key into a clear error at the start rather than a `KeyError` on page 40.

### Theme as configuration

```python
THEME = {
    "primary": "#B03A2E", "accent": "#16A085", "text": "#222222",
    "font": "Helvetica", "font_bold": "Helvetica-Bold",
    "logo": "assets/stewart_logo.png", "pagesize": "A4",
}
```

Styles are derived from the theme once, in a `make_styles(theme)` function returning a dict of `ParagraphStyle`s and a `TableStyle` factory. Nothing in the builder references a literal colour.

### The builder

```python
import io, json
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, KeepTogether
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4

def kpi_row(kpis, st, theme):
    cells = [[Paragraph(f"<b>{v}</b>", st["kpi_value"]), ] for v in
             (f"{kpis['files']:,}", f"{kpis['avg_tat_days']:.1f} d", f"{kpis['qa_score']:.1%}")]
    labels = ["Files closed", "Average TAT", "QA score"]
    data = [[c[0] for c in cells], [Paragraph(l, st["kpi_label"]) for l in labels]]
    t = Table(data, colWidths=[55 * mm] * 3)
    t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(theme["accent"])),
                           ("ALIGN", (0, 0), (-1, -1), "CENTER"), ("TOPPADDING", (0, 0), (-1, 0), 8)]))
    return t

def state_table(rows, st, theme):
    data = [["State", "Files", "TAT (days)", "QA"]]
    data += [[r["state"], f"{r['files']:,}", f"{r['tat']:.1f}", f"{r['qa']:.1%}"] for r in rows]
    t = Table(data, colWidths=[50 * mm, 30 * mm, 30 * mm, 30 * mm], repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(theme["primary"])),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), theme["font_bold"]),
        ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.whitesmoke]),
        ("LINEBELOW", (0, -1), (-1, -1), 0.75, colors.black),
    ]))
    return t

def build_report(payload: dict, theme: dict, st: dict) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm,
                            topMargin=30 * mm, bottomMargin=20 * mm,
                            title=f"{payload['client']} - {payload['period']}", author="Ali Raza")
    story = [Paragraph(escape(payload["client"]), st["h1"]),
             Paragraph(escape(payload["period"]), st["subtitle"]), Spacer(1, 6 * mm),
             kpi_row(payload["kpis"], st, theme), Spacer(1, 8 * mm),
             KeepTogether([Paragraph("Production by state", st["h2"]), state_table(payload["by_state"], st, theme)]),
             Spacer(1, 6 * mm), Paragraph("Notes", st["h2"])]
    story += [Paragraph(escape(n), st["body"], bulletText="•") for n in payload["notes"]]
    doc.build(story, onFirstPage=header_factory(theme), onLaterPages=header_factory(theme))
    return buf.getvalue()
```

Every string from the payload passes through `escape`. Numbers are formatted in one place. The header is produced by a factory that closes over the theme so page decoration also follows the brand.

### Batch generation

For 50 clients a week, loop over payloads, write each PDF to `out/{client_slug}/{period}.pdf`, and log page count and byte size per file. Run independent clients in a `multiprocessing.Pool`; ReportLab is CPU-bound and single-threaded, so processes scale better than threads. Fonts must be registered inside each worker process.

### Testing

Unit test the builder by asserting on the story before `build()` (counts of tables, headings) and on the output (page count, byte size within a range, text extraction with pypdf contains the client name). A golden-file comparison works if you set `invariant=1` on the document so timestamps and IDs are fixed.

> **Interview note:** Interviewers ask how you prevent a bad data row from killing the whole batch. The answer is validation up front, `try/except` per client with an error report, and never letting one client's failure block the others.

### Try It Yourself

```python
import io, re, json
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4

payload = json.loads('''{"client": "Stewart Title - Texas Division", "period": "Week 37, 2026",
 "kpis": {"files": 758, "avg_tat_days": 3.4, "qa_score": 0.971},
 "by_state": [{"state": "Texas", "files": 412, "tat": 3.2, "qa": 0.971},
              {"state": "Florida", "files": 305, "tat": 3.8, "qa": 0.954},
              {"state": "Wyoming", "files": 41, "tat": 2.9, "qa": 0.988}],
 "notes": ["Two files escalated for vesting issues.", "Wyoming volume up 18% week on week."]}''')
theme = {"primary": "#B03A2E", "accent": "#16A085"}
base = getSampleStyleSheet()["Normal"]
st = {"h1": ParagraphStyle("h1", parent=base, fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=colors.HexColor(theme["primary"])),
      "h2": ParagraphStyle("h2", parent=base, fontName="Helvetica-Bold", fontSize=12, leading=15, spaceBefore=6, keepWithNext=True),
      "body": ParagraphStyle("body", parent=base, fontSize=10, leading=13, leftIndent=12, bulletIndent=2)}

def header(c, doc):
    c.saveState(); w, h = doc.pagesize; c.setFillColor(colors.HexColor(theme["primary"]))
    c.rect(0, h - 18*mm, w, 18*mm, fill=1, stroke=0); c.setFillColor(colors.white); c.setFont("Helvetica-Bold", 11)
    c.drawString(20*mm, h - 11*mm, "Weekly Production Status"); c.restoreState()

k = payload["kpis"]
kpi = Table([[f"{k['files']:,}", f"{k['avg_tat_days']:.1f} d", f"{k['qa_score']:.1%}"], ["Files", "Avg TAT", "QA score"]], colWidths=[55*mm]*3)
kpi.setStyle(TableStyle([("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"), ("FONTSIZE", (0,0), (-1,0), 16), ("ALIGN", (0,0), (-1,-1), "CENTER"),
                         ("TEXTCOLOR", (0,1), (-1,1), colors.grey), ("BOX", (0,0), (-1,-1), 0.5, colors.HexColor(theme["accent"]))]))
rows = [["State", "Files", "TAT", "QA"]] + [[r["state"], f"{r['files']:,}", f"{r['tat']:.1f}", f"{r['qa']:.1%}"] for r in payload["by_state"]]
tbl = Table(rows, colWidths=[50*mm, 30*mm, 30*mm, 30*mm], repeatRows=1, hAlign="LEFT")
tbl.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), colors.HexColor(theme["primary"])), ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                         ("ALIGN", (1,1), (-1,-1), "RIGHT"), ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.whitesmoke])]))
story = [Paragraph(escape(payload["client"]), st["h1"]), Paragraph(escape(payload["period"]), base), Spacer(1, 6*mm), kpi,
         Spacer(1, 8*mm), Paragraph("Production by state", st["h2"]), tbl, Spacer(1, 6*mm), Paragraph("Notes", st["h2"])]
story += [Paragraph(escape(n), st["body"], bulletText="•") for n in payload["notes"]]
buf = io.BytesIO()
SimpleDocTemplate(buf, pagesize=A4, topMargin=28*mm, leftMargin=20*mm, rightMargin=20*mm).build(story, onFirstPage=header, onLaterPages=header)
data = buf.getvalue()
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. Why separate theme, data and builder?
- [x] So one builder serves many clients and each piece can be tested alone
- [ ] Because ReportLab requires it
- [ ] To make the PDF smaller
> Separation of concerns is what makes weekly batch generation maintainable.

2. Which option makes two runs of the same report byte-identical?
- [ ] `pageCompression=0`
- [x] `invariant=1`
- [ ] `title=None`
> Invariant mode fixes creation dates and document IDs so golden-file tests work.

3. How should a batch of 50 client reports be parallelised?
- [ ] Threads, because ReportLab releases the GIL
- [x] Processes, because generation is CPU-bound Python
- [ ] It cannot be parallelised
> A `multiprocessing.Pool` scales across cores; register fonts inside each worker.

### Exercises

1. **Schema check** — Write `validate(payload)` that raises `ValueError` listing every missing top-level key and every `by_state` row without a `state`.
<details><summary>Solution</summary>

```python
def validate(payload):
    problems = [f"missing key: {k}" for k in ("client", "period", "kpis", "by_state", "notes") if k not in payload]
    for i, row in enumerate(payload.get("by_state", [])):
        if "state" not in row: problems.append(f"by_state[{i}] has no state")
    if problems: raise ValueError("; ".join(problems))
```

</details>

2. **Batch runner** — Loop over a list of payloads, build each, catch exceptions per client, and print a summary table of client, pages, bytes, status.
<details><summary>Solution</summary>

```python
import re
def run_batch(payloads, build):
    for p in payloads:
        try:
            data = build(p); pages = len(re.findall(rb"/Type\s*/Page\b", data))
            print(f"{p['client'][:30]:30} {pages:5d} {len(data):9d} OK")
        except Exception as e:
            print(f"{p.get('client','?')[:30]:30} {'-':>5} {'-':>9} FAIL {e}")
```

</details>

### Interview Questions

**Q: Describe the architecture of a reporting service you built on ReportLab.**
Data came from SQL Server as JSON per client per week; a validation layer with pydantic rejected malformed payloads before rendering. A theme registry held colours, fonts and logos per client, and a single builder module turned payload plus theme into a Platypus story, with page furniture drawn by callbacks. Rendering ran in a process pool, wrote PDFs to object storage and emitted a manifest with page counts and byte sizes that a QA step compared against expected ranges. Fonts were registered at worker start, `invariant=1` was enabled in tests for golden comparisons, and failures were isolated per client so one bad payload never blocked the batch. The whole thing was about 600 lines and replaced a manual Word process.

**Q: How do you handle text that can contain arbitrary characters, including markup, in a generated PDF?**
Everything from the payload is escaped with `xml.sax.saxutils.escape` before it goes into a `Paragraph`, and only my own code emits tags. If clients legitimately need emphasis I accept a tiny whitelist (`<b>`, `<i>`) and re-enable those tags after escaping. Fonts are chosen with broad Unicode coverage, DejaVu Sans or Noto, so unexpected symbols do not vanish, and RTL text is pre-shaped. I also strip control characters, since a stray form feed in a notes field once produced a blank page in a production report.

**Q: What would you log and measure for a nightly PDF batch?**
Per document: client, pages, bytes, render time, warnings such as shrunk `KeepInFrame` panels, and a hash for change detection. Per batch: counts of success and failure, total time, and the slowest ten documents. Alerts trigger on page counts outside the historical range for that client, which catches truncated data long before a human opens the file, and on byte size jumps, which catches unresized images. Sample PDFs from each run are archived so a client question three months later can be answered by opening the exact artifact.

## Performance & memory for long documents

ReportLab is fast for typical reports, but 700-page manuals and 5,000-page statement runs expose where time and memory go. Knowing the cost model lets you decide between tuning and restructuring.

### Where the time goes

| Operation | Cost | Notes |
|---|---|---|
| `Paragraph.wrap` | High per call | Measures every word; called at least once per placement, more on splits |
| `Table` with `Paragraph` cells | Very high | Each cell wraps; auto widths wrap twice |
| `Table` with strings and fixed widths | Low | Uses `stringWidth` only |
| `multiBuild` | Multiplies everything | Two or three full passes |
| Image decode | Medium | Once per `ImageReader`, per call otherwise |
| `save()` | Medium | Serialises all objects at once |

Profile before guessing: `python -m cProfile -s cumtime build.py` usually shows `wrap` and `split` at the top.

### Table strategies

Long tables are the usual culprit. `Table` computes all row heights before splitting, so a 10,000-row table with `Paragraph` cells wraps 10,000 × columns paragraphs up front. Options in order of preference:

1. Use plain strings and fixed `colWidths`; wrap only columns that need it.
2. Use `LongTable`, which measures rows lazily as pages fill.
3. Chunk into tables of 300–500 rows with `repeatRows=1`; visually identical.
4. Pre-truncate or pre-wrap text in Python with `simpleSplit` so cells are single lines.

```python
from reportlab.platypus import LongTable
CHUNK = 400
for i in range(0, len(rows), CHUNK):
    story.append(LongTable([header] + rows[i:i + CHUNK], colWidths=widths, repeatRows=1, style=style))
```

### Memory model

Everything drawn is kept in memory until `save()`: the canvas code for every page plus every image XObject and font. A 5,000-page run with images can reach gigabytes. Strategies:

- Generate in segments of 200–500 pages into separate files and concatenate with pypdf or pikepdf (fast; both stream pages).
- Share images through a single `ImageReader` per asset so the XObject is written once.
- Set `rl_config.useA85 = 0` to store binary streams instead of ASCII85, which is smaller and quicker.
- Avoid keeping the story after `build()`; `del story` and let the segment finish in its own function so garbage collection reclaims it.

### Cheap wins

```python
from reportlab import rl_config
rl_config.useA85 = 0                  # smaller binary streams
rl_config.invariant = 0               # default; 1 only for tests
doc = SimpleDocTemplate(buf, pageCompression=1)   # Flate-compress page streams (default on)
```

Cache `ParagraphStyle`s (never create them inside loops), register fonts once, and reuse `TableStyle` instances. Formatting numbers with f-strings is fine; building strings with repeated concatenation in a loop is not.

### Optional accelerator

ReportLab 4 is pure Python. The optional `rl_accel` package provides C implementations of `stringWidth`, escaping and ASCII85 encoding; it often shaves 20–30 percent off text-heavy builds. Install it where a compiler is available and check `reportlab.rl_config` reports it loaded.

### Parallelism

Documents are independent, so run them in processes. Inside one document, ReportLab is sequential; splitting a single huge document into segments by chapter and rendering segments in parallel works when page numbering is handled by an overlay pass afterwards (Bates-style), or when each segment's starting page number is known from a first "counting" pass with `invariant` output.

### Measuring

```python
import time, tracemalloc
tracemalloc.start(); t0 = time.perf_counter()
pdf = build_report(payload, theme, st)
print(f"{time.perf_counter() - t0:.2f}s, peak {tracemalloc.get_traced_memory()[1] / 1e6:.1f} MB, {len(pdf) / 1e6:.2f} MB")
```

Record these per run; a sudden increase is the earliest sign of an unresized image or a runaway table.

> **Warning:** `KeepTogether` around a large block forces Platypus to try the whole group on each frame, which is quadratic when groups are big. Keep groups to a heading plus one or two flowables.

### Try It Yourself

```python
import io, re, time
from reportlab.platypus import SimpleDocTemplate, LongTable, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab import rl_config

rl_config.useA85 = 0
s = getSampleStyleSheet()
header = ["File", "State", "Product", "Premium"]
rows = [[f"2026-{i:05d}", ["TX", "FL", "WY"][i % 3], ["Owner", "Lender"][i % 2], f"{400 + i % 900:,.2f}"] for i in range(3000)]
style = TableStyle([("FONTSIZE", (0,0), (-1,-1), 7.5), ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
                    ("ALIGN", (3,1), (3,-1), "RIGHT"), ("TOPPADDING", (0,0), (-1,-1), 1), ("BOTTOMPADDING", (0,0), (-1,-1), 1)])
widths = [35*mm, 20*mm, 30*mm, 30*mm]

def build(chunked):
    buf = io.BytesIO(); doc = SimpleDocTemplate(buf)
    story = [Paragraph("3,000-row production detail", s["Heading2"])]
    if chunked:
        for i in range(0, len(rows), 400):
            story.append(LongTable([header] + rows[i:i+400], colWidths=widths, repeatRows=1, style=style))
    else:
        story.append(Table([header] + rows, colWidths=widths, repeatRows=1, style=style))
    doc.build(story); return buf.getvalue()

for chunked in (False, True):
    t0 = time.perf_counter(); data = build(chunked)
    print(f"chunked={chunked}: {time.perf_counter() - t0:.2f}s, {len(data)} bytes, "
          f"{len(re.findall(rb'/Type\s*/Page\b', data))} pages")
```

### Quiz

1. Which table configuration is cheapest to lay out?
- [x] String cells with fixed `colWidths`
- [ ] `Paragraph` cells with auto widths
- [ ] Nested tables
> Strings only need `stringWidth`; paragraphs require full wrapping, and auto widths wrap twice.

2. Why generate a 5,000-page run in segments?
- [ ] ReportLab has a 1,000-page limit
- [x] All page content stays in memory until `save()`, so segments bound peak memory
- [ ] Segments render faster because of caching
> Segments are then concatenated with pypdf or pikepdf, which stream pages.

3. What does `rl_config.useA85 = 0` change?
- [ ] Disables compression
- [x] Writes binary streams instead of ASCII85, reducing size
- [ ] Disables font embedding
> ASCII85 inflates binary data by about 25 percent; binary streams avoid that.

### Exercises

1. **Segmented build** — Write `build_segments(chapters, size=200)` that renders groups of chapters into separate `BytesIO` objects and merges them with pypdf.
<details><summary>Solution</summary>

```python
import io
from pypdf import PdfWriter, PdfReader
def build_segments(chapters, render, size=5):
    writer = PdfWriter()
    for i in range(0, len(chapters), size):
        seg = render(chapters[i:i+size])           # returns bytes for these chapters
        writer.append(PdfReader(io.BytesIO(seg)))
    out = io.BytesIO(); writer.write(out); return out.getvalue()
```

</details>

2. **Profile a build** — Use `cProfile` to print the ten most expensive functions of a report build.
<details><summary>Solution</summary>

```python
import cProfile, pstats, io
pr = cProfile.Profile(); pr.enable()
data = build(True)          # any build function
pr.disable()
st = pstats.Stats(pr).sort_stats("cumtime"); st.print_stats(10)
```

</details>

### Interview Questions

**Q: A 700-page manual takes eight minutes to build. How do you cut that down?**
Profile first; in my case `Paragraph.wrap` inside table cells dominated because every SOP step table used paragraphs with auto column widths. I fixed the column widths, converted short cells to plain strings and switched to `LongTable`, which brought the build to ninety seconds. The TOC forced `multiBuild` passes, so I reserved TOC pages to stop pagination rippling and kept it at two passes. Finally I installed `rl_accel` and disabled ASCII85, which took another twenty percent off and shrank the file. The remaining time was dominated by legitimate layout work, which is where I stop optimising.

**Q: How does ReportLab's memory usage scale and what do you do about it?**
Linearly with pages plus the size of all embedded assets, because nothing is written until `save()`. For a statement run of thousands of pages that means gigabytes, so I render in segments of a few hundred pages, each in a function so its objects are freed, and concatenate with pikepdf, which streams. Shared images go through a single `ImageReader` so each asset is embedded once per segment. I measure peak memory with `tracemalloc` in CI so a regression such as an unresized 20 MB logo gets caught before production.

**Q: When is parallelism worth it in a ReportLab pipeline, and where does it not help?**
Across documents it is almost free: a process pool renders 50 client reports on 8 cores in roughly an eighth of the time, as long as fonts are registered per worker and outputs are written to distinct paths. Within one document it rarely helps because Platypus layout is sequential and page numbers depend on earlier pages; splitting by chapter only works if numbering is applied afterwards by an overlay pass or chapters start on known pages. Threads do not help because the work is Python bytecode holding the GIL. I/O such as uploading finished PDFs can be threaded or async while the pool renders.

## PDF/A, metadata & compression

A finished report should carry correct metadata, be as small as its content allows, and, when a client or archive demands it, comply with PDF/A. ReportLab covers the first two natively and gets you most of the way to the third.

### Document metadata

```python
from reportlab.pdfgen import canvas
c = canvas.Canvas("report.pdf")
c.setTitle("Weekly Production Status - Week 37")
c.setAuthor("Ali Raza")
c.setSubject("Title production metrics")
c.setKeywords("title insurance, production, QA")
c.setCreator("reporting-service 2.3")
```

Platypus exposes the same as constructor arguments: `SimpleDocTemplate(buf, title=..., author=..., subject=..., keywords=..., creator=...)`. Metadata lands in the Info dictionary; the creation and modification dates are written automatically unless `invariant=1` is set, in which case they are fixed so that output is reproducible. Setting `lang="en-GB"` on the canvas writes the document language, which accessibility checkers look for.

### Compression

Page content streams are Flate-compressed by default (`pageCompression=1`). Images are stored as JPEG (DCT) or Flate-compressed pixel data, and by default binary streams are ASCII85-encoded for safety on old transports; disable that with `rl_config.useA85 = 0` to save about 25 percent. Fonts are subset automatically. To shrink further:

```python
from reportlab import rl_config
rl_config.useA85 = 0
c = canvas.Canvas("report.pdf", pageCompression=1)
```

Reuse image readers, downsample images to the needed ppi, and avoid embedding the same font under two names. For post-processing, `qpdf --optimize-images` or Ghostscript's `pdfwrite` with `-dPDFSETTINGS=/printer` can recompress images further.

### Encryption

```python
from reportlab.lib.pdfencrypt import StandardEncryption
enc = StandardEncryption(userPassword="", ownerPassword="secret", canPrint=1, canModify=0,
                         canCopy=0, canAnnotate=0, strength=128)
c = canvas.Canvas("locked.pdf", encrypt=enc)
```

ReportLab supports RC4 40/128-bit and AES-128/256 (`strength=256`). Encryption is incompatible with PDF/A, so choose one.

### PDF/A: what ReportLab does and does not do

PDF/A-1b and 2b require: all fonts embedded, no encryption, no JavaScript, device-independent colour via an output intent ICC profile, XMP metadata mirroring the Info dictionary, and, for A-1, no transparency. ReportLab embeds TrueType fonts and can avoid transparency, but it does not write an output intent or XMP packet and never embeds the base 14 fonts. So a ReportLab file is "PDF/A-ready" rather than PDF/A-compliant, and the standard workflow is:

1. Use only registered TTF fonts (Liberation Sans instead of Helvetica).
2. No `setFillAlpha`, no encryption, no form JavaScript.
3. Convert with Ghostscript, which adds the output intent and XMP:

```bash
gs -dPDFA=2 -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -sColorConversionStrategy=RGB \
   -dPDFACompatibilityPolicy=1 -sOutputFile=report_pdfa.pdf PDFA_def.ps report.pdf
```

4. Validate with veraPDF (`verapdf --flavour 2b report_pdfa.pdf`) or Acrobat Preflight.

Alternatives are `pikepdf` for injecting XMP and an output intent yourself, or generating with WeasyPrint when a PDF/A switch is required natively (it has `pdf_variant="pdf/a-2b"`).

### Print-oriented options

`Canvas(..., enforceColorSpace="CMYK")` raises if any RGB colour is used, which is how you guarantee a press-ready file. `cropMarks=True` draws crop marks and expands the page by the bleed, and `pdfVersion=(1, 6)` declares a newer feature set. PDF/X compliance, like PDF/A, is finished in Acrobat or with Ghostscript.

| Goal | ReportLab setting | Finish with |
|---|---|---|
| Small file | `useA85=0`, image downsampling, shared readers | qpdf / Ghostscript |
| Reproducible output | `invariant=1` | — |
| Restricted copy/print | `encrypt=StandardEncryption(...)` | — |
| PDF/A archive | TTF fonts only, no alpha | Ghostscript or pikepdf, veraPDF |
| PDF/X press | `enforceColorSpace='CMYK'`, `cropMarks` | Acrobat Preflight |

> **Tip:** Put metadata in the same theme/config object as the brand colours. Clients notice a wrong Title in the browser tab far more often than a wrong font.

### Try It Yourself

```python
import io, re
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab import rl_config

def build(use_a85, compress):
    rl_config.useA85 = 1 if use_a85 else 0
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4, pageCompression=compress, invariant=1)
    c.setTitle("Compression test"); c.setAuthor("Ali Raza"); c.setSubject("ReportLab size options")
    c.setFont("Helvetica", 9)
    for page in range(5):
        for i in range(60):
            c.drawString(40, 800 - i * 12, f"Line {i} of page {page}: Escrow disbursement reconciliation entry.")
        c.showPage()
    c.save(); return buf.getvalue()

for a85 in (True, False):
    for comp in (0, 1):
        data = build(a85, comp)
        print(f"useA85={a85!s:5} compression={comp}: {len(data):7d} bytes, "
              f"{len(re.findall(rb'/Type\s*/Page\b', data))} pages, title set: {b'/Title' in data}")
```

### Quiz

1. Which of these prevents a file from ever being PDF/A compliant?
- [ ] Using TrueType fonts
- [x] Encrypting the document
- [ ] Setting a Title
> PDF/A forbids encryption; fonts must be embedded, which TTF registration provides.

2. What does `invariant=1` do?
- [x] Fixes timestamps and IDs so identical input gives identical bytes
- [ ] Disables compression
- [ ] Removes metadata
> It exists for regression testing with golden files.

3. Why is a ReportLab file not automatically PDF/A even with all TTF fonts?
- [ ] Because ReportLab cannot embed fonts
- [x] It lacks the output intent ICC profile and XMP metadata the standard requires
- [ ] Because PDF 1.4 is not allowed
> Ghostscript or pikepdf add those; veraPDF validates the result.

### Exercises

1. **Metadata from config** — Write `apply_meta(doc_or_canvas, meta)` that sets title, author, subject and keywords from a dict on either a canvas or a Platypus document (which exposes `doc.title` etc. as attributes before build).
<details><summary>Solution</summary>

```python
def apply_meta(target, meta):
    if hasattr(target, "setTitle"):            # canvas
        target.setTitle(meta["title"]); target.setAuthor(meta["author"])
        target.setSubject(meta.get("subject", "")); target.setKeywords(meta.get("keywords", ""))
    else:                                       # SimpleDocTemplate / BaseDocTemplate
        target.title = meta["title"]; target.author = meta["author"]
        target.subject = meta.get("subject", ""); target.keywords = meta.get("keywords", "")
```

</details>

2. **Restricted copy** — Produce a PDF that can be printed but not copied or edited, with owner password from an environment variable.
<details><summary>Solution</summary>

```python
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pdfencrypt import StandardEncryption
enc = StandardEncryption("", os.environ.get("PDF_OWNER_PW", "change-me"), canPrint=1, canModify=0, canCopy=0, canAnnotate=0, strength=128)
c = canvas.Canvas("restricted.pdf", encrypt=enc); c.drawString(72, 720, "Confidential rate matrix"); c.save()
```

</details>

### Interview Questions

**Q: A client archive requires PDF/A-2b. Walk me through delivering it from a ReportLab pipeline.**
I first make the generator PDF/A-ready: every font is a registered TrueType such as Liberation Sans or Noto, so nothing depends on the unembedded base 14; no transparency, encryption or form scripts; metadata title, author and language set. Then a post-processing step runs Ghostscript with `-dPDFA=2`, a `PDFA_def.ps` pointing at an sRGB ICC profile, and `-dPDFACompatibilityPolicy=1` so violations fail loudly instead of being silently dropped. veraPDF validates each file in CI and the report is attached to the delivery. The alternative, if the project is HTML-based, is WeasyPrint's native `pdf/a-2b` variant, but for a ReportLab pipeline Ghostscript plus veraPDF is the reliable path.

**Q: How do you keep generated PDFs small without hurting quality?**
Most bloat is images, so I downsample to the effective ppi needed, pass JPEGs through untouched and share one `ImageReader` per asset. Disabling ASCII85 with `rl_config.useA85 = 0` saves a quarter of every binary stream, page compression stays on, and fonts are subset automatically. I check that the same font is not registered under multiple names and that vector charts are used instead of PNG screenshots. As a final pass for archive delivery, `qpdf --object-streams=generate` or Ghostscript's `/printer` preset compacts structure and images. Typical result is a 40-page report under 400 KB with fonts embedded.

**Q: What is the difference between the Info dictionary and XMP, and why does it matter?**
The Info dictionary is the classic key-value block (`/Title`, `/Author`, `/CreationDate`) that ReportLab writes and that every viewer reads. XMP is an RDF/XML packet embedded as a metadata stream that carries the same fields plus richer schemas and is mandatory for PDF/A and PDF/X, where it must agree with Info. ReportLab writes only Info, so for compliance a post-processor adds a matching XMP packet; pikepdf's `open_metadata()` makes that a few lines. Mismatched Info and XMP is one of the most common veraPDF failures, so the pipeline sets both from the same config.

## ReportLab vs WeasyPrint vs LibreOffice

Choosing a PDF engine is an architecture decision you will defend in interviews and to clients. The three mainstream options for Python document pipelines have very different strengths.

### The candidates

**ReportLab** draws PDF directly from Python: precise, fast, dependency-free, but every layout rule is code. **WeasyPrint** renders HTML and CSS (paged media) to PDF: designers can style it, complex layouts are easier, but it needs Pango and layout is only as good as the CSS you write. **LibreOffice** (headless `soffice --convert-to pdf`) converts DOCX, ODT, XLSX and PPTX: the input is a Word template that clients can edit, but it is slow to start, single-process per instance and fidelity depends on the document.

| Criterion | ReportLab | WeasyPrint | LibreOffice headless |
|---|---|---|---|
| Input | Python code | HTML + CSS | DOCX/ODT/XLSX |
| Layout control | Absolute, pixel-exact | CSS paged media | Word's engine |
| Designer-friendly | No | Yes | Yes (Word templates) |
| Long tables | Excellent (`LongTable`) | Good, slower per page | Good |
| Fonts | TTF embedding, no shaping by default | Full shaping via Pango (Urdu/Arabic fine) | Full shaping |
| Forms | AcroForm creation | Limited (basic fields) | Word content controls become fields |
| Charts | Native vector charts | Pre-rendered SVG/PNG | Native charts in DOCX |
| Speed | Fastest, ms per page | Moderate, 50–300 ms per page | Slow start (seconds) then moderate |
| Dependencies | Pillow only | Pango, HarfBuzz, fontconfig | 300 MB+ install |
| PDF/A | Via Ghostscript | Native switch | Native export option |
| Best for | Data-heavy reports, batch, forms | Branded documents, HTML skills | DOCX-first clients |

### Decision rules

Choose ReportLab when the output is data-heavy and repetitive (statements, matrices, labels, certificates, forms), when startup time and dependencies matter (serverless, small containers), or when you need vector charts and precise positioning. Choose WeasyPrint when the document is content-heavy with rich typography and a designer will maintain a stylesheet, or when Urdu/Arabic shaping must just work. Choose LibreOffice when the client hands you a DOCX template and expects to edit it themselves, or when the source is already an Office document.

### Combining them

Real pipelines mix engines. A common pattern for a policy manual: python-docx or a `.dotx` template for the editable master, LibreOffice headless for the PDF, ReportLab overlays for Bates numbers and watermarks, pypdf to assemble. For a client dashboard: WeasyPrint for the narrative pages, ReportLab for a 40-page appendix table, merged with pikepdf.

```bash
# LibreOffice headless conversion used in pipelines
soffice --headless --convert-to pdf --outdir out/ manual.docx
```

```python
# WeasyPrint equivalent of a ReportLab report
from weasyprint import HTML
HTML(string=html, base_url=".").write_pdf("report.pdf")
```

### Common interview comparison points

- **Fidelity vs control:** Word-based conversion preserves the client's formatting; ReportLab guarantees the same output forever.
- **Testing:** ReportLab output can be made invariant and diffed; LibreOffice output changes between versions.
- **Operations:** LibreOffice needs a warmed-up daemon (unoserver) to be fast; ReportLab needs nothing.
- **Skills:** WeasyPrint lets front-end developers contribute; ReportLab requires Python.

> **Interview note:** The strongest answer names the trade-off, gives a rule, and cites a project: "I used ReportLab for the 3,000-row weekly detail because tables were 10× faster than WeasyPrint, but the executive summary stayed in WeasyPrint so the design team could restyle it."

### Try It Yourself

```python
import io, re, time
from reportlab.platypus import SimpleDocTemplate, Paragraph, LongTable, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

# Benchmark harness: time a data-heavy ReportLab build so you can compare it with
# WeasyPrint (HTML table) or LibreOffice (DOCX) on the same data locally.
s = getSampleStyleSheet()
rows = [["File", "State", "Premium"]] + [[f"2026-{i:05d}", ["TX", "FL", "WY"][i % 3], f"{400 + i % 700:,.2f}"] for i in range(2000)]
t0 = time.perf_counter()
buf = io.BytesIO()
doc = SimpleDocTemplate(buf)
tbl = LongTable(rows, colWidths=[100, 60, 80], repeatRows=1)
tbl.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), colors.lightgrey), ("FONTSIZE", (0,0), (-1,-1), 8),
                         ("ALIGN", (2,1), (2,-1), "RIGHT")]))
doc.build([Paragraph("Engine comparison: 2,000-row table", s["Heading2"]), tbl])
data = buf.getvalue()
elapsed = time.perf_counter() - t0
pages = len(re.findall(rb"/Type\s*/Page\b", data))
print(f"ReportLab: {elapsed:.2f}s, {len(data)} bytes, {pages} pages, {elapsed / pages * 1000:.1f} ms/page")
```

### Quiz

1. Which engine renders Urdu and Arabic correctly without pre-shaping?
- [ ] ReportLab canvas
- [x] WeasyPrint (Pango/HarfBuzz)
- [ ] Neither
> WeasyPrint uses Pango for text layout, which shapes complex scripts natively.

2. A client insists on editing the template in Word. Which engine fits?
- [ ] ReportLab
- [ ] WeasyPrint
- [x] LibreOffice headless from a DOCX template
> Word templates stay editable by the client; conversion happens at build time.

3. Which is the main operational drawback of LibreOffice headless?
- [ ] It cannot embed fonts
- [x] Slow start-up and heavy install, needing a warm daemon for throughput
- [ ] It cannot produce PDF/A
> Tools like unoserver keep an instance warm to amortise start-up.

### Exercises

1. **Decision function** — Write `choose_engine(spec)` that returns an engine name from a dict with keys `editable_by_client`, `rows`, `complex_scripts`, `designer_maintains_css`.
<details><summary>Solution</summary>

```python
def choose_engine(spec):
    if spec.get("editable_by_client"): return "libreoffice"
    if spec.get("complex_scripts") or spec.get("designer_maintains_css"): return "weasyprint"
    if spec.get("rows", 0) > 1000: return "reportlab"
    return "reportlab"
print(choose_engine({"rows": 3000}), choose_engine({"complex_scripts": True}))
```

</details>

2. **Hybrid assembly** — Merge a WeasyPrint narrative PDF and a ReportLab appendix PDF into one file with pypdf, appendix last.
<details><summary>Solution</summary>

```python
from pypdf import PdfWriter
w = PdfWriter()
for path in ("narrative_weasy.pdf", "appendix_reportlab.pdf"):
    w.append(path)
with open("final.pdf", "wb") as f: w.write(f)
```

</details>

### Interview Questions

**Q: Compare ReportLab and WeasyPrint for a branded monthly client report.**
WeasyPrint wins on design iteration: the layout is HTML and CSS, so the brand team can adjust typography and spacing without a Python developer, complex scripts shape correctly, and PDF/A is a switch. ReportLab wins on speed, dependencies and data-heavy content: a 2,000-row table renders in a second with vector charts and no Pango install, and output can be made byte-identical for tests. For a monthly narrative-heavy report I would pick WeasyPrint with Jinja2 templates; for the weekly production detail with thousands of rows I would pick ReportLab. When both exist, I merge with pikepdf and keep the header design identical by sharing colours and fonts through one config.

**Q: Why not just convert DOCX with LibreOffice for everything?**
It preserves the client's Word formatting and lets non-developers own the template, which is a real advantage, but conversion is slow to start, fidelity for advanced Word features (content controls, some field codes, complex tables) varies by version, and output changes when LibreOffice is upgraded, so regression testing is hard. It also cannot generate content by itself; you still need python-docx or docxtpl to fill the template, and control over pagination is indirect. I use it when DOCX is the master format the client edits, run it as a warm unoserver instance for throughput, and pin the LibreOffice version in the container.

**Q: How do you justify an engine choice to a non-technical client?**
In terms of what they experience: turnaround time, how they request changes, and risk. For example, "ReportLab lets us regenerate all 50 reports in under a minute and guarantees they look identical every week; changes to layout go through me. WeasyPrint lets your design agency restyle the report themselves, at the cost of a slightly heavier server. LibreOffice lets your team edit the Word template directly, but every LibreOffice update needs a re-check of the output." Then I recommend one based on who will maintain the template long term, because that is the cost that dominates after launch.

## ReportLab interview questions

This chapter consolidates what interviewers probe for a document-automation or reporting role that lists ReportLab. Questions come in four kinds: fundamentals (coordinates, canvas vs Platypus), layout debugging (page breaks, tables), production engineering (performance, fonts, compliance) and judgment (engine choice, testing). Prepare a two-minute project story for each kind.

### Fundamentals checklist

- Origin bottom-left, points as units, `showPage()` resets state, nothing written until `save()`.
- Canvas is imperative; Platypus is a flow layout of flowables in frames on page templates.
- Flowable protocol: `wrap`, `draw`, optional `split`; `LayoutError` when nothing fits.
- Standard 14 fonts are Latin-1 and unembedded; `TTFont` embeds subsets; families map `<b>`/`<i>`.
- Paragraph markup is XML-strict; escape data.
- TableStyle coordinates are `(col, row)`, zero-based, negatives from the end.

### Layout debugging checklist

| Symptom | Likely cause | Fix |
|---|---|---|
| Heading alone at page bottom | No `keepWithNext` | Set it on heading styles |
| Table wider than page | Auto widths on long strings | `colWidths` + `Paragraph` cells |
| Blank page after chapter | `PageBreak` at boundary | `PageBreakIfNotEmpty` |
| TOC empty | `build()` not `multiBuild()`, style names wrong | Fix hook and use multiBuild |
| `<b>` ignored | No font family mapping | `registerFontFamily` |
| Text under header band | Frame overlaps band | Larger `topMargin` |
| Urdu reversed | No shaping | arabic-reshaper + python-bidi |

### Production checklist

- Segment huge runs; share `ImageReader`s; `useA85=0`; `LongTable`; chunked tables.
- Fonts registered per process; project-relative paths.
- `invariant=1` for golden tests; page-count and size assertions in CI.
- PDF/A via Ghostscript plus veraPDF; PDF/X via Acrobat Preflight; `enforceColorSpace`.
- Watermarks and letterheads via callbacks or pypdf overlay.

### How to answer

Use the shape *concept, trade-off, example, number*. "Page X of Y needs the total before page one is written; the `NumberedCanvas` recipe defers page emission to `save()`; I used it on a 120-page weekly status report; it added under a second." Numbers make the answer credible: page counts, row counts, build times, field counts.

### A short live-coding drill

Interviewers sometimes ask for a minimal document on the spot. Practise until this takes two minutes without reference:

```python
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

def invoice(items):
    s = getSampleStyleSheet(); buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, title="Invoice")
    rows = [["Item", "Qty", "Price"]] + [[n, str(q), f"{p:,.2f}"] for n, q, p in items]
    rows.append(["", "Total", f"{sum(q * p for _, q, p in items):,.2f}"])
    t = Table(rows, colWidths=[250, 60, 80], repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), colors.lightgrey), ("ALIGN", (1,0), (-1,-1), "RIGHT"),
                           ("LINEABOVE", (0,-1), (-1,-1), 1, colors.black), ("FONTNAME", (0,-1), (-1,-1), "Helvetica-Bold")]))
    doc.build([Paragraph("Invoice", s["Title"]), Spacer(1, 12), t])
    return buf.getvalue()
```

Then be ready for the follow-ups: "add a logo on every page" (callback), "make totals bold" (style command), "handle 5,000 items" (LongTable and chunks), "the client name has an ampersand" (escape).

> **Interview note:** If you do not know an API detail, say how you would find it: the ReportLab User Guide PDF, `help(Table)`, or reading `reportlab/platypus/tables.py`. Interviewers value that more than a guessed signature.

### Try It Yourself

```python
import io, re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

def invoice(items, client):
    from xml.sax.saxutils import escape
    s = getSampleStyleSheet(); buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, title=f"Invoice - {client}")
    rows = [["Item", "Qty", "Price"]] + [[n, str(q), f"{p:,.2f}"] for n, q, p in items]
    rows.append(["", "Total", f"{sum(q * p for _, q, p in items):,.2f}"])
    t = Table(rows, colWidths=[250, 60, 80], repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), colors.lightgrey), ("ALIGN", (1,0), (-1,-1), "RIGHT"),
                           ("LINEABOVE", (0,-1), (-1,-1), 1, colors.black), ("FONTNAME", (0,-1), (-1,-1), "Helvetica-Bold")]))
    def logo(c, d):
        c.saveState(); c.setFillColor(colors.HexColor("#B03A2E")); c.rect(40, 790, 60, 20, fill=1, stroke=0); c.restoreState()
    doc.build([Paragraph(f"Invoice for {escape(client)}", s["Title"]), Spacer(1, 12), t], onFirstPage=logo, onLaterPages=logo)
    return buf.getvalue()

items = [("Fillable PDF form, 168 fields", 1, 250.0), ("Branded .dotx template suite", 3, 80.0), ("EPUB3 conversion", 2, 60.0)]
data = invoice(items, "Smith & Sons <LLC>")
print(len(data), "bytes;", len(re.findall(rb"/Type\s*/Page\b", data)), "pages")
```

### Quiz

1. An interviewer asks why `<b>` does nothing in a paragraph using a registered TTF font. Best answer?
- [ ] TTF fonts cannot be bold
- [x] No `registerFontFamily` mapping links the bold variant
- [ ] `<b>` requires `<font>` around it
> Family mapping is how markup resolves bold and italic variants.

2. Which statement about `LayoutError` is correct?
- [x] It is raised when a flowable cannot fit even in an empty frame and cannot split
- [ ] It is raised whenever a page break occurs
- [ ] It only occurs with images
> Tables with a giant single row, oversized images and long `KeepTogether` groups are typical causes.

3. What is the most convincing way to answer a "how would you optimise" question?
- [ ] List every rl_config option
- [x] Describe profiling, the dominant cost found, the fix, and the measured improvement
- [ ] Recommend switching to another library
> Concrete measurement beats generic advice.

### Exercises

1. **Two-minute drill** — From memory, write a function that builds a two-page PDF with a title, a paragraph and a page number footer, and returns the bytes.
<details><summary>Solution</summary>

```python
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
def drill():
    s = getSampleStyleSheet(); buf = io.BytesIO(); doc = SimpleDocTemplate(buf)
    def footer(c, d): c.setFont("Helvetica", 8); c.drawCentredString(300, 20, f"Page {d.page}")
    doc.build([Paragraph("Drill", s["Title"]), Paragraph("Body", s["BodyText"]), PageBreak(), Paragraph("Second page", s["BodyText"])],
              onFirstPage=footer, onLaterPages=footer)
    return buf.getvalue()
```

</details>

2. **Story answers** — Write three two-sentence project stories (a form, a long manual, a batch report) each ending with a number.
<details><summary>Solution</summary>

```text
Form: Generated a 168-field intake form from a JSON field map with canvas.acroForm; validated field names by reading back with pypdf. Zero field-name defects in delivery.
Manual: Built a 767-page policy manual with multiBuild TOC, bookmarks and running headers; reserved TOC pages to stop pagination rippling. Build time 90 seconds, down from 8 minutes.
Batch: Weekly production status for 50 clients from JSON with a shared theme; process pool of 8 workers. Full batch in 40 seconds with per-client failure isolation.
```

</details>

### Interview Questions

**Q: What is Platypus and how does it relate to the canvas?**
Platypus is ReportLab's page-layout layer: a story of flowables is poured into frames defined by page templates, and a document template drives the loop, calling `wrap`, `split` and `draw` on each flowable and `showPage` on the canvas when a page fills. Every flowable ultimately draws on a canvas, so canvas skills transfer directly, and callbacks (`onPage`) let you mix absolute drawing with flowed content. I describe it as "the canvas is the printer, Platypus is the typesetter". A practical consequence is that any custom element is either a flowable (moves with text) or a callback drawing (fixed on the page).

**Q: How do you test PDF generation code?**
At three levels. Unit tests exercise builders on small payloads and assert on the story (number of tables, heading texts) without rendering. Rendering tests build with `invariant=1` and compare bytes to a golden file, or extract text with pypdf and assert key strings and page counts; image-based comparison with pdf2image and a pixel diff catches layout regressions where text extraction cannot. Integration tests run the batch on a fixture set and check the manifest: page counts within range, sizes within range, no failures. I also keep a visual smoke test that opens a sample in a viewer before releasing a template change, because some issues are only visible.

**Q: A client reports that the Urdu text in a generated contract is garbled. Diagnose it.**
Three usual causes, checked in order. First, the font: if the registered font lacks Arabic glyphs you see boxes, so I confirm the TTF contains the Arabic block. Second, shaping: disconnected letters in the wrong order mean no reshaping and bidi reordering was applied, so the strings must pass through `arabic_reshaper` and `python-bidi`, or ReportLab 4 shaping must be enabled. Third, wrapping: a `Paragraph` without `wordWrap='RTL'` breaks lines in the wrong direction. I test with a known phrase in Acrobat and on a phone, because some viewers hide shaping errors, and I keep a fixture PDF of correct output for comparison.

**Q: What would you change about ReportLab if you could, and how do you work around it today?**
Native complex-script shaping and a built-in PDF/A mode are the two gaps I hit most often; shaping is now arriving experimentally in ReportLab 4, and for PDF/A I post-process with Ghostscript and validate with veraPDF. The Paragraph markup being XML-strict causes many production errors, which I solve by escaping at the boundary and wrapping in a factory. Table auto-sizing is slow for large tables, which I avoid with fixed widths and `LongTable`. Knowing a tool's limits and having a workaround for each is what I would describe as senior use of the library.

**Q: How do you keep a ReportLab codebase maintainable as clients and templates grow?**
Separate data, theme and builder; keep styles in one module built from the theme; put page furniture in composable callbacks; and put every magic number in named constants with units (`GUTTER = 8 * mm`). Custom flowables live in their own module with docstrings and a visual test page that renders each one. Fonts are registered in one bootstrap function. Templates are versioned alongside their golden PDFs so a change is reviewed as a diff of images. Finally, a README per client template records the page sizes, margins and any special rules, because the next person to touch it may be me a year later.
