---
id: pymupdf
title: PyMuPDF (fitz)
icon: 🔍
track: Document Engineering
color: #D35400
runner: none
tagline: The fastest Python toolkit for reading, rendering and editing PDFs.
description: PyMuPDF from opening a file to expert PDF surgery: text extraction (plain, blocks, words, dict, HTML), rendering pages to images, searching and highlighting, annotations, redaction, inserting text/images, merging and splitting, links and bookmarks, form fields (widgets), OCR integration, page geometry and matrices, and performance at scale.
---

# LEVEL: Beginner

## Installing and opening documents

PyMuPDF is a Python binding for **MuPDF**, a small, very fast C library that renders and edits PDF, XPS, EPUB, CBZ and image files. Because the heavy lifting happens in C, PyMuPDF opens a 767-page handbook in milliseconds and renders pages faster than any pure-Python library. It is the tool you reach for when a Fiverr client sends a 40 MB scanned policy manual and asks "can you just fix this?".

### Installing

PyMuPDF ships as a pre-built wheel for Windows, macOS and Linux, so installation is a single command and there is nothing to compile:

```bash
python -m pip install --upgrade pymupdf
python -c "import pymupdf; print(pymupdf.__doc__)"
```

The second line prints something like `PyMuPDF 1.26.x: Python bindings for the MuPDF 1.26.x library`. If it does, you are ready.

### `import pymupdf` or `import fitz`?

For most of its life the package was imported as `fitz` (the name of MuPDF's original rendering engine). Since version **1.24.3** the official name is `pymupdf`, and `fitz` remains as an alias so that old scripts keep working. New code should use `pymupdf`; you will still see `fitz` in thousands of Stack Overflow answers, and both names refer to the same module.

```python
import pymupdf          # preferred since 1.24.3
import fitz             # legacy alias, identical module
print(fitz is pymupdf)  # True
```

### Opening a document

`pymupdf.open()` returns a `Document` object. You can pass a file path, or raw bytes plus a `filetype` hint if the file came from a web request or a database blob.

```python
import pymupdf

doc = pymupdf.open("policy_manual.pdf")
print(doc.page_count)          # 135
print(doc.is_pdf, doc.is_encrypted, doc.needs_pass)
print(doc.name)                # the path you opened

# from memory, e.g. downloaded with requests
data = open("policy_manual.pdf", "rb").read()
doc2 = pymupdf.open(stream=data, filetype="pdf")
```

`page_count` is the number of pages. `is_encrypted` tells you the file has an encryption dictionary, and `needs_pass` tells you that you cannot read it until you call `doc.authenticate("secret")`, which returns a non-zero integer on success.

### Other formats open the same way

| Extension | Opens as | Notes |
|---|---|---|
| `.pdf` | PDF | full read/write |
| `.xps`, `.oxps` | XPS | read-only, convert with `doc.convert_to_pdf()` |
| `.epub`, `.mobi`, `.fb2` | reflowable e-book | pagination depends on `doc.layout()` |
| `.cbz` | comic archive | pages are images |
| `.png`, `.jpg`, `.svg` | single-page image document | handy for image-to-PDF |

```python
epub = pymupdf.open("handbook.epub")
pdf_bytes = epub.convert_to_pdf()     # bytes of a new PDF
pdf = pymupdf.open("pdf", pdf_bytes)  # positional form: (filetype, stream)
pdf.save("handbook_from_epub.pdf")
```

### Always close what you open

A `Document` holds a file handle and MuPDF memory. Use it as a context manager so it closes even if your code raises an exception:

```python
with pymupdf.open("policy_manual.pdf") as doc:
    print(f"{doc.name}: {doc.page_count} pages")
# doc is closed here
```

> **Tip:** Opening a file that does not exist raises `pymupdf.FileNotFoundError`, and opening a corrupt file raises `pymupdf.FileDataError`. Catch these explicitly in batch jobs so one bad client upload does not stop a 500-file run.

### Try It Yourself

```python
import pymupdf, sys

path = sys.argv[1] if len(sys.argv) > 1 else "policy_manual.pdf"
try:
    with pymupdf.open(path) as doc:
        print("File      :", doc.name)
        print("Pages     :", doc.page_count)
        print("Is PDF    :", doc.is_pdf)
        print("Encrypted :", doc.is_encrypted, "| needs password:", doc.needs_pass)
        print("Version   :", pymupdf.__doc__)
except pymupdf.FileNotFoundError:
    print("No such file:", path)
except pymupdf.FileDataError as e:
    print("Cannot parse file:", e)
```

### Quiz

1. Which import is preferred in new code since PyMuPDF 1.24.3?
- [ ] `import fitz`
- [x] `import pymupdf`
- [ ] `import mupdf`
> `pymupdf` is the official name; `fitz` is kept only as a backwards-compatible alias.

2. How do you open a PDF that you already hold as bytes in memory?
- [ ] `pymupdf.open(bytes_obj)`
- [x] `pymupdf.open(stream=bytes_obj, filetype="pdf")`
- [ ] `pymupdf.Document.from_bytes(bytes_obj)`
> The `stream` keyword takes bytes (or a BytesIO) and `filetype` tells MuPDF how to parse them.

3. What does `doc.needs_pass` being `True` mean?
- [x] The file cannot be read until `doc.authenticate()` succeeds
- [ ] The file has no pages
- [ ] The file is an EPUB
> `is_encrypted` says an encryption dictionary exists; `needs_pass` says you still have to supply a password.

### Exercises

1. **Batch page counter** — Write a script that takes a folder path, opens every `.pdf` inside it and prints `filename: N pages`, skipping unreadable files with a warning instead of crashing.
<details><summary>Solution</summary>

```python
import pymupdf, pathlib, sys

folder = pathlib.Path(sys.argv[1])
for pdf in sorted(folder.glob("*.pdf")):
    try:
        with pymupdf.open(pdf) as doc:
            print(f"{pdf.name}: {doc.page_count} pages")
    except (pymupdf.FileDataError, RuntimeError) as e:
        print(f"WARNING {pdf.name}: {e}")
```

</details>

2. **EPUB to PDF** — Convert `handbook.epub` to `handbook.pdf` and print both page counts.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("handbook.epub") as epub:
    pdf_bytes = epub.convert_to_pdf()
    epub_pages = epub.page_count
with pymupdf.open("pdf", pdf_bytes) as pdf:
    pdf.save("handbook.pdf")
    print("EPUB pages:", epub_pages, "PDF pages:", pdf.page_count)
```

</details>

### Interview Questions

**Q: What is the relationship between PyMuPDF, fitz and MuPDF?**
MuPDF is a C library by Artifex that parses, renders and edits PDF, XPS and EPUB. PyMuPDF is the Python binding around it, historically imported as `fitz` because MuPDF's rendering engine was once called Fitz. Since 1.24.3 the import name is `pymupdf`, with `fitz` retained as an alias. The practical consequence is that PyMuPDF is much faster than pure-Python libraries such as pypdf because parsing and rasterising happen in compiled C, and it can render pages, which pypdf cannot do at all.

**Q: Why would you open a PDF from a byte stream rather than a path?**
In production pipelines the file usually arrives from an HTTP upload, an S3 object or a database blob and never touches disk, so `pymupdf.open(stream=data, filetype="pdf")` avoids a temp-file round trip and the associated cleanup and permission issues. It also lets you process files inside a sandbox where the working directory is read-only. The trade-off is memory: the whole byte string lives in RAM, which matters when a client sends a 400 MB scanned handbook, so for very large files I stream them to disk first and open by path.

**Q: How do you handle a password-protected PDF in PyMuPDF?**
Open it normally, check `doc.needs_pass`, then call `doc.authenticate(password)`. The return value is an int: 0 means failure, and non-zero bits tell you whether the owner or user password matched. Only after a successful authenticate can you load pages or extract text; before that, `doc[0]` raises an error. If only an owner password exists, `needs_pass` is `False` and the file opens directly, though permission flags may still restrict printing or copying in viewers.

## Pages, metadata and page geometry

A PDF `Document` is a container of `Page` objects. Everything you do, from extracting text to drawing a stamp, happens on a page, so understanding how pages are addressed and measured is the foundation of every PyMuPDF script.

### Loading pages

Pages are zero-indexed. `doc[0]` is the first page and `doc[-1]` the last, exactly like a Python list. You can also iterate the document directly.

```python
import pymupdf

doc = pymupdf.open("title_report.pdf")
first = doc[0]                 # same as doc.load_page(0)
last  = doc[-1]
for page in doc:               # iterates every page in order
    print(page.number, page.rect)
```

`page.number` is the zero-based index. Remember that people read page numbers starting at 1, so a production report that says "page 12" is `doc[11]`.

### Metadata

`doc.metadata` is a plain dictionary read from the PDF's Info dictionary. It is what Adobe Reader shows under File → Properties.

```python
meta = doc.metadata
for key in ("title", "author", "subject", "keywords", "creator", "producer",
            "creationDate", "modDate", "format", "encryption"):
    print(f"{key:13}: {meta.get(key)}")
```

Dates are PDF-formatted strings such as `D:20260115093012+05'00'`, meaning 15 January 2026 at 09:30:12 in the UTC+5 zone (Lahore). Writing metadata is just as easy:

```python
doc.set_metadata({
    "title": "Stewart Title - Weekly Production Report",
    "author": "Ali Raza",
    "subject": "Week 37, 2026",
    "keywords": "title insurance, production, KPI",
})
doc.save("title_report_tagged.pdf")
```

Keys you do not mention keep their old values; pass an empty string to blank one out.

### Page geometry: points, not pixels

PDF measures everything in **points**, where 1 point = 1/72 inch. US Letter is 612 × 792 pt and A4 is 595 × 842 pt. PyMuPDF exposes a page's size through several rectangles:

| Property | Meaning |
|---|---|
| `page.mediabox` | The physical page as stored in the file |
| `page.cropbox` | The visible region a viewer shows (defaults to mediabox) |
| `page.rect` | The cropbox after applying `page.rotation`; this is what you work with |
| `page.rotation` | 0, 90, 180 or 270 degrees |
| `page.bound()` | Same as `page.rect` |

```python
p = doc[0]
print(p.mediabox)   # Rect(0.0, 0.0, 612.0, 792.0)
print(p.rect)       # Rect(0.0, 0.0, 612.0, 792.0)
print(p.rotation)   # 0
print(p.rect.width / 72, "in wide,", p.rect.height / 72, "in tall")
```

### The coordinate system

PyMuPDF's origin `(0, 0)` is the **top-left** corner of `page.rect`, with y growing downward, which is what most programmers expect. Internally PDF uses a bottom-left origin, but PyMuPDF hides that conversion from you. A `Rect` is `(x0, y0, x1, y1)` where `(x0, y0)` is top-left and `(x1, y1)` is bottom-right.

```python
r = pymupdf.Rect(72, 72, 300, 120)   # 1 inch from the top-left, 228 pt wide, 48 pt tall
print(r.width, r.height, r.is_empty, r.tl, r.br)
header_zone = pymupdf.Rect(0, 0, p.rect.width, 60)
print(pymupdf.Rect(50, 50, 100, 100) in header_zone)   # False: it extends below y=60
```

Rectangles support `&` (intersection), `|` (union), `in` (containment) and can be moved by adding a `Point` or scaled with a `Matrix`, which you will meet in the Advanced level.

> **Warning:** `page.rect` and `page.mediabox` differ whenever a page is rotated or cropped. If a scanned invoice was saved rotated 90° and you use `mediabox` to place a stamp, it lands sideways. Always use `page.rect` for placement.

### Paper sizes helper

```python
w, h = pymupdf.paper_size("a4")        # (595, 842)
rect = pymupdf.paper_rect("letter")    # Rect(0, 0, 612, 792)
landscape = pymupdf.paper_size("a4-l") # (842, 595)
```

### Try It Yourself

```python
import pymupdf

with pymupdf.open("title_report.pdf") as doc:
    print("Title   :", doc.metadata.get("title"))
    print("Producer:", doc.metadata.get("producer"))
    print("Created :", doc.metadata.get("creationDate"))
    for page in doc:
        r = page.rect
        size = "Letter" if abs(r.width - 612) < 1 and abs(r.height - 792) < 1 else \
               "A4" if abs(r.width - 595) < 1 and abs(r.height - 842) < 1 else "other"
        print(f"page {page.number + 1:3}: {r.width:.0f} x {r.height:.0f} pt "
              f"rotation={page.rotation:3} size={size}")
```

### Quiz

1. How many points are in one inch?
- [ ] 96
- [x] 72
- [ ] 100
> PDF uses the PostScript convention of 72 points per inch, so Letter is 612 × 792 pt.

2. Where is `(0, 0)` in PyMuPDF's page coordinate system?
- [x] Top-left corner
- [ ] Bottom-left corner
- [ ] Centre of the page
> PyMuPDF converts PDF's bottom-left origin to a top-left origin with y increasing downward.

3. Which property should you use to place content on a rotated page?
- [ ] `page.mediabox`
- [x] `page.rect`
- [ ] `page.cropbox_position`
> `page.rect` already accounts for rotation and the cropbox; the mediabox is the raw stored size.

### Exercises

1. **Mixed-size detector** — Print the page numbers (1-based) of every page in a document whose size differs from the first page. Title reports often have a landscape rate schedule stapled in.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("title_report.pdf") as doc:
    ref = doc[0].rect
    odd = [p.number + 1 for p in doc
           if abs(p.rect.width - ref.width) > 1 or abs(p.rect.height - ref.height) > 1]
    print("Pages with a different size:", odd or "none")
```

</details>

2. **Stamp the metadata** — Set title, author and keywords on `sop.pdf`, save as `sop_meta.pdf`, reopen and verify the title changed.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("sop.pdf") as doc:
    doc.set_metadata({"title": "Data Processing SOP v3", "author": "Ali Raza",
                      "keywords": "SOP, BPO, quality"})
    doc.save("sop_meta.pdf")
with pymupdf.open("sop_meta.pdf") as check:
    assert check.metadata["title"] == "Data Processing SOP v3"
    print("Metadata verified:", check.metadata["title"])
```

</details>

### Interview Questions

**Q: What is the difference between the MediaBox and the CropBox?**
The MediaBox is the full physical page stored in the file, including any bleed or printer marks; the CropBox is the sub-rectangle a viewer actually displays and defaults to the MediaBox when absent. Print shops care about the MediaBox and TrimBox, while end users only see the CropBox. In PyMuPDF `page.rect` is the CropBox transformed by the page rotation, so it is the rectangle you should use for text placement, rendering and hit-testing. A classic bug is stamping a "DRAFT" watermark using MediaBox coordinates on a cropped page and having it fall outside the visible area.

**Q: How does PyMuPDF's coordinate system differ from raw PDF, and why does it matter?**
Raw PDF uses a bottom-left origin with y pointing up, and every content stream operates in that space. PyMuPDF flips this to a top-left origin with y pointing down so that a rectangle's `y0` is its top edge, matching screen conventions. It matters when you mix libraries: if you take a bounding box from pdfminer or reportlab and pass it to PyMuPDF unchanged, it will be vertically mirrored. The conversion is `y_pymupdf = page_height - y_pdf`, and `page.transformation_matrix` does it for you.

**Q: Is `doc.metadata` the same as XMP metadata?**
No. `doc.metadata` reads the classic Info dictionary in the trailer, which has fixed keys like Title, Author and CreationDate. XMP is an XML packet stored in the catalog's Metadata stream and can carry arbitrary schemas such as Dublin Core or PDF/A identification. PyMuPDF exposes XMP through `doc.get_xml_metadata()` and `doc.set_xml_metadata()`, and viewers generally prefer XMP when both exist. For PDF/A deliverables I keep both in sync, which is easier in pikepdf's `open_metadata()`, but for quick tagging of a weekly report the Info dictionary is enough.

## Extracting text with get_text variants

Text extraction is the most common reason people install PyMuPDF. A single method, `page.get_text()`, has several output modes that range from a plain string to a full structural tree with fonts and bounding boxes. Choosing the right mode saves hours of regex cleanup.

### The plain string

```python
import pymupdf

doc = pymupdf.open("sop.pdf")
page = doc[0]
text = page.get_text()            # same as get_text("text")
print(text[:500])
```

The default mode returns text in the order the PDF's content stream draws it, one line per text line, with a newline between blocks. That order is usually reading order for documents produced by Word, but for two-column layouts or PDFs assembled by a print driver it can jump around.

### Sorting into reading order

```python
text = page.get_text("text", sort=True)
```

`sort=True` (added in 1.19.1) orders blocks top-to-bottom then left-to-right by their bounding boxes, which fixes most "the footer appears in the middle" surprises.

### Blocks, words and lines

| Mode | Returns | Use it for |
|---|---|---|
| `"text"` | `str` | full-text search, dumping to `.txt` |
| `"blocks"` | list of `(x0, y0, x1, y1, text, block_no, block_type)` | paragraph-level positions |
| `"words"` | list of `(x0, y0, x1, y1, word, block_no, line_no, word_no)` | locating individual words |
| `"dict"` / `"json"` | nested dict: blocks → lines → spans with fonts | structural extraction |
| `"rawdict"` | like dict but down to individual characters | OCR-style analysis |
| `"html"` / `"xhtml"` | HTML preserving position and fonts | web preview |
| `"xml"` | XML with character details | debugging |

```python
for x0, y0, x1, y1, txt, bno, btype in page.get_text("blocks"):
    kind = "image" if btype == 1 else "text"
    print(f"block {bno:2} {kind:5} at y={y0:6.1f}: {txt.strip()[:40]!r}")
```

`block_type` 0 is text and 1 is an image, so this loop also tells you where the letterhead logo sits.

### Extracting only part of a page

Rate tables and signature blocks live in known places. Pass `clip=` to restrict extraction to a rectangle:

```python
footer = pymupdf.Rect(0, page.rect.height - 50, page.rect.width, page.rect.height)
print(page.get_text("text", clip=footer))       # e.g. "Page 3 of 12"
print(page.get_textbox(footer))                 # shortcut with the same result
```

### Flags: what counts as text

`get_text` accepts `flags=` built from constants such as `pymupdf.TEXT_PRESERVE_LIGATURES`, `TEXT_PRESERVE_WHITESPACE`, `TEXT_PRESERVE_IMAGES`, `TEXT_DEHYPHENATE` and `TEXT_INHIBIT_SPACES`. A common need is joining words hyphenated at line ends in a policy manual:

```python
flags = pymupdf.TEXT_DEHYPHENATE | pymupdf.TEXTFLAGS_TEXT
clean = page.get_text("text", flags=flags)
```

`pymupdf.TEXTFLAGS_TEXT` is the default flag set for the `"text"` mode; combining it with `TEXT_DEHYPHENATE` keeps the defaults and adds de-hyphenation.

### Whole-document extraction

```python
with pymupdf.open("policy_manual.pdf") as doc:
    with open("policy_manual.txt", "w", encoding="utf-8") as out:
        for page in doc:
            out.write(page.get_text(sort=True))
            out.write("\f")            # form feed marks a page break
```

This is exactly the pattern used to feed 767-page handbooks into a search index or an LLM.

> **Interview note:** Interviewers often ask why extracted text has no spaces or has words glued together. The honest answer is that PDF has no concept of words; it positions glyphs. PyMuPDF infers spaces from glyph gaps, and fonts with broken width tables or PDFs generated by "print to PDF" drivers defeat that heuristic. The fix is to fall back to the `"words"` mode and rebuild lines from coordinates, or to OCR the page.

### Try It Yourself

```python
import pymupdf, collections

with pymupdf.open("policy_manual.pdf") as doc:
    counter = collections.Counter()
    for page in doc:
        for w in page.get_text("words"):
            word = w[4].strip(".,;:()\"'").lower()
            if len(word) > 3:
                counter[word] += 1
    print("Pages:", doc.page_count)
    for word, n in counter.most_common(15):
        print(f"{word:15} {n}")
```

### Quiz

1. Which `get_text` mode returns tuples with `block_no`, `line_no` and `word_no`?
- [ ] `"blocks"`
- [x] `"words"`
- [ ] `"dict"`
> `"words"` gives one tuple per word: four coordinates, the word, and the block/line/word indices.

2. What does `sort=True` do?
- [x] Orders blocks top-to-bottom, left-to-right by position
- [ ] Sorts the words alphabetically
- [ ] Removes duplicate lines
> The content stream order is not always reading order; `sort=True` reorders blocks geometrically.

3. Which flag joins words that were hyphenated across line breaks?
- [ ] `TEXT_PRESERVE_LIGATURES`
- [x] `TEXT_DEHYPHENATE`
- [ ] `TEXT_INHIBIT_SPACES`
> `TEXT_DEHYPHENATE` removes the hyphen and joins the two parts into one word.

### Exercises

1. **Find the page** — Print the 1-based page number of every page in `policy_manual.pdf` that contains the phrase "termination of coverage" (case-insensitive).
<details><summary>Solution</summary>

```python
import pymupdf

needle = "termination of coverage"
with pymupdf.open("policy_manual.pdf") as doc:
    hits = [p.number + 1 for p in doc if needle in p.get_text().lower()]
    print("Found on pages:", hits)
```

</details>

2. **Footer stripper** — Extract the text of each page without the bottom 40 points (where the running footer lives) and write everything to one file.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("policy_manual.pdf") as doc, \
     open("body_only.txt", "w", encoding="utf-8") as out:
    for page in doc:
        r = page.rect
        body = pymupdf.Rect(r.x0, r.y0, r.x1, r.y1 - 40)
        out.write(page.get_text("text", clip=body, sort=True) + "\n")
```

</details>

### Interview Questions

**Q: Why can text extraction from a PDF return words out of order or without spaces?**
A PDF content stream is a sequence of drawing instructions, not a text document. Text can be emitted in any order the generator chose, for example the footer first, or column two before column one, and spaces are frequently not stored at all because the generator simply moves the pen. PyMuPDF reconstructs words by measuring gaps between glyphs and reconstructs order by content-stream sequence unless you pass `sort=True`. When both heuristics fail I switch to `"words"` or `"dict"` mode and cluster by the `y` coordinate myself, and for scanned pages there is no text to extract at all until OCR runs.

**Q: When would you use the `"dict"` mode instead of `"text"`?**
Whenever the layout carries meaning: headings, bold labels, table cells, font sizes or exact positions. `"dict"` returns blocks, lines and spans, and each span has `font`, `size`, `flags` (bold, italic, monospaced), `color` and `bbox`. For a client's 168-field form I used span sizes to detect section headings and span bboxes to align labels with values. The cost is a much larger data structure and more code, so for a plain full-text search index `"text"` with `sort=True` is faster and sufficient.

**Q: How would you extract text from just one region of a page, and why is that useful?**
Pass a `clip=pymupdf.Rect(...)` to `get_text()`, or use `page.get_textbox(rect)`. It is useful because production documents have fixed layouts: the order number is always in the top-right 150 × 40 pt box, the running footer always in the bottom 40 pt. Clipping avoids regex battles with unrelated text and lets you skip footers before concatenating pages. Combined with `"words"` mode you can also verify that the clip caught whole words by checking that their bboxes are fully inside the rectangle.

## Rendering pages to PNG

Rendering turns a vector page into a raster image. You need it for thumbnails, for OCR input, for previews in a web app, for QA screenshots of a Fiverr deliverable, and for "convert PDF to images" requests. PyMuPDF renders through MuPDF, so it is both fast and faithful to what Acrobat shows.

### The one-liner

```python
import pymupdf

doc = pymupdf.open("cover.pdf")
pix = doc[0].get_pixmap()         # 72 dpi, RGB, no alpha
pix.save("cover_page1.png")
print(pix.width, pix.height, pix.n)  # e.g. 612 792 3
```

A `Pixmap` is a raw bitmap in memory. `pix.n` is the number of bytes per pixel: 3 for RGB, 4 for RGB with alpha, 1 for grayscale. `save()` chooses the format from the extension (`.png`, `.jpg`, `.pnm`, `.pgm`, `.ppm`, `.pam`, `.psd`, `.ps`).

### Controlling resolution with `dpi` or `Matrix`

At the default 72 dpi one point becomes one pixel, which looks blurry on modern screens. Two ways to scale:

```python
pix = doc[0].get_pixmap(dpi=200)                     # simplest (1.19.2+)
pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(2, 2)) # 2x zoom = 144 dpi
```

The `Matrix(zoom_x, zoom_y)` form is the older API and still the most flexible, because a matrix can also rotate and shear. `dpi=300` is the standard input resolution for Tesseract OCR; `dpi=150` is plenty for on-screen previews.

| Purpose | dpi | Letter page size |
|---|---|---|
| Thumbnail | 36 | 306 × 396 px |
| Screen preview | 110–150 | 935 × 1210 px |
| OCR input | 300 | 2550 × 3300 px |
| Print proof | 600 | 5100 × 6600 px |

### Colour, alpha and clipping

```python
gray = doc[0].get_pixmap(dpi=150, colorspace=pymupdf.csGRAY)
rgba = doc[0].get_pixmap(dpi=150, alpha=True)           # transparent background
logo = doc[0].get_pixmap(dpi=300, clip=pymupdf.Rect(36, 36, 236, 96))
```

`clip` renders only that rectangle, which is how you produce a crisp crop of a signature or a letterhead logo without cutting a full-page image afterwards.

### Getting bytes instead of a file

Web servers and tests want bytes, not files:

```python
png_bytes = pix.tobytes("png")        # also "jpeg", "pnm", "pam", "psd"
jpg_bytes = pix.tobytes("jpeg", jpg_quality=85)
```

And if you use Pillow, `pix.pil_image()` returns a `PIL.Image`, or `pix.pil_save("x.webp")` saves through Pillow to any format it supports.

### Rendering every page

```python
with pymupdf.open("cover.pdf") as doc:
    for page in doc:
        pix = page.get_pixmap(dpi=150)
        pix.save(f"pages/page_{page.number + 1:03}.png")
```

Zero-padding the number keeps the files sorted correctly in a folder listing, which matters when you later stitch them into a contact sheet or a ZIP for the client.

### Vector output instead of pixels

When the target is a web page or an SVG editor, `page.get_svg_image(matrix=pymupdf.Matrix(1, 1))` returns the page as an SVG string with text kept as vector paths, so it scales without blurring. It is larger than a PNG for image-heavy scans, but ideal for line-art forms and letterheads.

> **Tip:** Annotations are rendered by default. Pass `annots=False` to `get_pixmap()` to see the page without highlights and sticky notes, which is useful for a "clean" proof.

### Try It Yourself

```python
import pymupdf, pathlib

src = "cover.pdf"
out = pathlib.Path("pages"); out.mkdir(exist_ok=True)
with pymupdf.open(src) as doc:
    for page in doc:
        pix = page.get_pixmap(dpi=150, alpha=False)
        name = out / f"page_{page.number + 1:03}.png"
        pix.save(name)
        print(f"{name}  {pix.width}x{pix.height}px  {len(pix.tobytes('png')) // 1024} KB")
```

### Quiz

1. What resolution does `page.get_pixmap()` use by default?
- [x] 72 dpi (1 point = 1 pixel)
- [ ] 96 dpi
- [ ] 300 dpi
> Without `dpi` or `matrix`, the identity matrix maps one point to one pixel, i.e. 72 dpi.

2. `pymupdf.Matrix(3, 3)` renders at approximately which dpi?
- [ ] 72
- [ ] 150
- [x] 216
> A zoom factor of 3 multiplies the base 72 dpi, giving 216 dpi.

3. Which method returns PNG data without writing a file?
- [ ] `pix.save()`
- [x] `pix.tobytes("png")`
- [ ] `pix.samples`
> `tobytes()` encodes to the named format in memory; `samples` is the raw uncompressed pixel buffer.

### Exercises

1. **Contact sheet thumbnails** — Render the first 12 pages of a handbook at 36 dpi and save them as `thumb_01.png` … `thumb_12.png`.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("handbook.pdf") as doc:
    for i in range(min(12, doc.page_count)):
        doc[i].get_pixmap(dpi=36).save(f"thumb_{i + 1:02}.png")
```

</details>

2. **Logo cropper** — Render only the top-left 200 × 60 pt of page 1 at 300 dpi with a transparent background and save as `logo.png`.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("letterhead.pdf") as doc:
    clip = pymupdf.Rect(0, 0, 200, 60)
    pix = doc[0].get_pixmap(dpi=300, clip=clip, alpha=True)
    pix.save("logo.png")
    print(pix.width, pix.height)   # about 833 x 250
```

</details>

### Interview Questions

**Q: How do `dpi` and `Matrix` relate when rendering a page?**
Both control the transformation from page space (points) to device space (pixels). `Matrix(z, z)` scales by `z`, and since the base is 72 dpi the effective resolution is `72 * z`; `dpi=d` is sugar that builds `Matrix(d/72, d/72)` for you and also records the DPI in the PNG header. The matrix form is still needed when you want rotation or non-uniform scaling, for example `Matrix(2, 2).prerotate(90)` to render a landscape scan upright at 144 dpi. I use `dpi=` for OCR pipelines and `Matrix` when I need geometry.

**Q: What does a Pixmap contain and how would you hand it to Pillow or OpenCV?**
A Pixmap is an uncompressed bitmap with `width`, `height`, `n` bytes per pixel, a `stride`, and a `samples` bytes buffer. For Pillow, `pix.pil_image()` or `Image.frombytes("RGB", (pix.width, pix.height), pix.samples)`; for OpenCV or NumPy, `np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)` and then convert RGB to BGR. Rendering without alpha keeps `n=3`, which avoids a channel mismatch that is a very common source of "colours look wrong" bugs.

**Q: A client wants 500 pages as PNG for a web viewer. What choices affect speed and size?**
Resolution dominates: 150 dpi is four times fewer pixels than 300 dpi. Grayscale (`colorspace=pymupdf.csGRAY`) cuts bytes by two-thirds for text-heavy scans. JPEG via `tobytes("jpeg", jpg_quality=80)` is far smaller than PNG for scanned images but worse for crisp text. Disabling annotations avoids re-rendering sticky notes. Finally I run pages in a multiprocessing pool, one worker per core, each opening its own copy of the document, because PyMuPDF documents must not be shared across processes.

## Saving, closing and incremental saves

Every edit you make lives in memory until you call `save()`. Knowing the save options, and the difference between a full rewrite and an incremental update, prevents the two classic disasters: a corrupted file and an accidental overwrite of the client's original.

### The basic save

```python
import pymupdf

doc = pymupdf.open("draft.pdf")
doc.set_metadata({"title": "Employee Handbook 2026"})
doc.save("handbook_final.pdf")
doc.close()
```

`save()` writes a complete new file. By default it does **not** let you save to the same path you opened, because MuPDF is still reading from that file; trying raises `ValueError: save to original must be incremental`. You have three choices:

1. Save to a new name (safest).
2. Save incrementally with `incremental=True` (fast, appends to the original).
3. Load into memory, close, then write back (`doc.tobytes()` then `open("x.pdf","wb").write(...)`).

### Incremental saves

An incremental save appends the changed objects and a new cross-reference table to the end of the existing file. The original bytes are untouched, so it is quick even for a 400 MB scan, and it is how Acrobat saves annotations.

```python
doc = pymupdf.open("handbook_final.pdf")
doc[0].insert_text((72, 72), "Reviewed 2026-09-15", fontsize=9)
doc.save(doc.name, incremental=True, encryption=pymupdf.PDF_ENCRYPT_KEEP)
```

`encryption=pymupdf.PDF_ENCRYPT_KEEP` is required for incremental saves (it keeps the existing security settings). Incremental saves are impossible on files opened from a stream, on files that were repaired on open, and after `doc.select()` or other structural page changes. In those cases fall back to `save("new.pdf")`.

### Useful save options

| Option | Effect |
|---|---|
| `garbage=0..4` | 0 none; 1 remove unused objects; 2 also compact xref; 3 also merge duplicate objects; 4 also check stream contents |
| `deflate=True` | compress uncompressed streams |
| `deflate_images` / `deflate_fonts` | compress those object types specifically |
| `clean=True` | sanitise page content streams |
| `pretty=True` | human-readable object formatting for debugging |
| `linear=True` | linearise for fast web view |
| `use_objstms=1` | pack objects into object streams (1.24+) |
| `expand=` | decompress everything (useful with `pretty` for debugging) |

```python
doc.save("handbook_small.pdf", garbage=4, deflate=True, clean=True)
```

`doc.ez_save("out.pdf")` is a shortcut with `garbage=3, deflate=True, use_objstms=1`, which is the right default for almost every deliverable.

### Saving to memory

```python
pdf_bytes = doc.tobytes(garbage=3, deflate=True)
response.write(pdf_bytes)        # e.g. a Flask/FastAPI response
```

`tobytes()` takes the same options as `save()`. Since it produces a complete file it can also be used to overwrite the original path after `doc.close()`.

### Closing and the danger of stale objects

After `doc.close()` every `Page`, `Pixmap` or `Annot` created from it becomes invalid and raises `ValueError: document closed`. Do not keep page references beyond the `with` block. Also note that some page operations invalidate other page objects: after `doc.delete_page(3)`, a variable holding `doc[5]` now points at the wrong page, so re-fetch pages after structural changes.

> **Warning:** Never let a script save over the client's original by default. My pipelines always write to `output/<name>_v2.pdf` and only overwrite when an explicit `--in-place` flag is passed; a corrupted 767-page handbook with no backup costs a day of work.

### Try It Yourself

```python
import pymupdf, os

src, dst = "draft.pdf", "draft_optimised.pdf"
with pymupdf.open(src) as doc:
    doc.set_metadata({"producer": "Ali Raza / PyMuPDF pipeline"})
    doc.save(dst, garbage=4, deflate=True, clean=True)
before, after = os.path.getsize(src), os.path.getsize(dst)
print(f"{src}: {before/1024:.0f} KB -> {dst}: {after/1024:.0f} KB "
      f"({100 * (1 - after/before):.1f}% smaller)")
```

### Quiz

1. Which call is required to save changes back to the file you opened by path?
- [ ] `doc.save(doc.name)`
- [x] `doc.save(doc.name, incremental=True, encryption=pymupdf.PDF_ENCRYPT_KEEP)`
- [ ] `doc.overwrite()`
> Saving to the original path is only allowed as an incremental update, and that requires keeping the encryption settings.

2. What does `garbage=3` do beyond `garbage=1`?
- [ ] Nothing extra
- [x] Also compacts the xref and merges duplicate objects
- [ ] Also re-renders images at lower resolution
> Level 2 compacts the cross-reference table; level 3 additionally de-duplicates identical objects such as repeated fonts.

3. `doc.ez_save()` is equivalent to which options?
- [x] `garbage=3, deflate=True, use_objstms=1`
- [ ] `garbage=0, deflate=False`
- [ ] `incremental=True`
> `ez_save` is a convenience wrapper with sensible optimisation defaults.

### Exercises

1. **Safe in-place tool** — Write a function `optimise(path, in_place=False)` that saves an optimised copy to `path` with `_opt` suffix, or, when `in_place` is true, writes the bytes back to the original after closing.
<details><summary>Solution</summary>

```python
import pymupdf, pathlib

def optimise(path, in_place=False):
    p = pathlib.Path(path)
    with pymupdf.open(p) as doc:
        data = doc.tobytes(garbage=4, deflate=True, clean=True)
    target = p if in_place else p.with_name(p.stem + "_opt" + p.suffix)
    target.write_bytes(data)
    return target

print(optimise("draft.pdf"))
```

</details>

2. **Incremental annotation save** — Open a PDF, add a text note on page 1 with `page.add_text_annot((50, 50), "Checked by QA")`, and save incrementally. Verify the file grew rather than being rewritten by comparing sizes.
<details><summary>Solution</summary>

```python
import pymupdf, os, shutil

shutil.copy("draft.pdf", "draft_inc.pdf")
before = os.path.getsize("draft_inc.pdf")
with pymupdf.open("draft_inc.pdf") as doc:
    doc[0].add_text_annot((50, 50), "Checked by QA")
    doc.save(doc.name, incremental=True, encryption=pymupdf.PDF_ENCRYPT_KEEP)
after = os.path.getsize("draft_inc.pdf")
print("grew by", after - before, "bytes")   # a few hundred bytes appended
```

</details>

### Interview Questions

**Q: What is an incremental save and when would you avoid it?**
An incremental save appends new or changed objects plus a new xref section and trailer to the end of the existing file instead of rewriting it, so the original bytes are preserved and the write is fast regardless of file size. Acrobat uses it for comments, and it is what makes signature workflows possible, because earlier signed revisions remain byte-identical. I avoid it when I want a smaller file (garbage collection is impossible incrementally), when the file must be linearised, when the client should not be able to recover earlier content that was redacted, and when the structure changed through `select()` or page deletion, which PyMuPDF refuses to save incrementally anyway.

**Q: Why does PyMuPDF refuse `doc.save(doc.name)` without `incremental=True`?**
Because the `Document` still maps and reads from the source file lazily; page content and images are fetched on demand. Truncating and rewriting that file while it is being read would corrupt both the read and the write. Incremental mode is safe because it only appends. The alternative is to produce the full file in memory with `tobytes()`, close the document, and then write the bytes to the original path, which is what I do in a helper guarded by an explicit in-place flag.

**Q: What do the `garbage` levels do and which do you use in practice?**
Level 1 drops objects no longer referenced, level 2 also renumbers and compacts the xref, level 3 also merges duplicate objects, which matters when a merge pulled in the same font ten times, and level 4 additionally inspects stream contents for duplicates. Higher levels cost more time. My default deliverable save is `garbage=4, deflate=True, clean=True`, or simply `ez_save()`, which typically shrinks a Word-generated 50 MB handbook by 20–40 percent. For a quick annotation pass on a huge scan I skip garbage collection entirely and save incrementally.

# LEVEL: Intermediate

## Searching text and highlighting

Finding a phrase and marking it visually is the core of review workflows: a quality checker highlighting every "N/A" in an agent's output, a title examiner flagging every occurrence of a lien holder's name, or a client asking you to highlight all changed clauses in a 135-page manual. PyMuPDF does both halves with two calls.

### `page.search_for()`

```python
import pymupdf

doc = pymupdf.open("policy_manual.pdf")
page = doc[4]
hits = page.search_for("Termination of Coverage")
print(len(hits), hits[0] if hits else None)
# 2 Rect(72.0, 301.2, 249.8, 314.1)
```

`search_for()` returns a list of `Rect` objects, one per occurrence, in page coordinates. The search is case-insensitive by default and ignores whitespace differences, so `"Termination  of coverage"` still matches. If a phrase wraps across two lines you get **two** rectangles for the one hit, one per line fragment, which is exactly what you want for highlighting.

Useful keyword arguments:

| Argument | Meaning |
|---|---|
| `quads=True` | return `Quad` objects instead of `Rect` (needed for rotated or skewed text) |
| `clip=rect` | restrict the search to a region |
| `flags=` | text extraction flags, e.g. `TEXT_DEHYPHENATE` to find words split by hyphens |
| `textpage=` | reuse a pre-built `TextPage` for many searches on one page |

### Highlighting the hits

```python
for rect in hits:
    annot = page.add_highlight_annot(rect)
annot_all = page.add_highlight_annot(hits)   # or pass the whole list at once
doc.save("manual_highlighted.pdf")
```

`add_highlight_annot()` accepts a single `Rect`, a `Quad`, or a list of them, and returns an `Annot`. Passing the list creates one annotation covering all fragments, which is what a human reviewer expects (one comment, one deletion). By default highlights are yellow; change it and give it an author:

```python
annot = page.add_highlight_annot(hits)
annot.set_colors(stroke=(1, 0.6, 0))        # orange, RGB floats 0..1
annot.set_info(title="Ali Raza", content="Clause renumbered in v3")
annot.update()                              # required after changing properties
```

The `update()` call rebuilds the annotation's appearance stream. Forgetting it is the number-one reason "my colour change did not show up".

### Searching a whole document

```python
needle = "Stewart Title Guaranty"
with pymupdf.open("policy_manual.pdf") as doc:
    total = 0
    for page in doc:
        rects = page.search_for(needle)
        if rects:
            page.add_highlight_annot(rects)
            total += len(rects)
    print(f"{total} occurrences highlighted")
    doc.save("policy_manual_marked.pdf")
```

### Other text-markup annotations

The same rectangles feed three sibling methods:

```python
page.add_underline_annot(rects)
page.add_strikeout_annot(rects)
page.add_squiggly_annot(rects)
```

Strikeout is the standard way to mark superseded rate lines in a redlined rate schedule; squiggly signals spelling or formatting problems in BPO QA.

### Searching with a TextPage for speed

Each `search_for()` call re-extracts the page text. When you search for fifty different lien holder names on each page, build the text page once:

```python
tp = page.get_textpage()
for name in lien_holders:
    for r in page.search_for(name, textpage=tp):
        page.add_highlight_annot(r)
```

> **Tip:** `search_for` finds text, not the concept of a word boundary; searching `"rate"` also matches `"accurate"`. Post-filter with `"words"` mode or search for `" rate "` with the surrounding spaces when whole-word matching matters.

### Try It Yourself

```python
import pymupdf, sys

pdf, needle = "policy_manual.pdf", "coverage"
with pymupdf.open(pdf) as doc:
    total = 0
    for page in doc:
        rects = page.search_for(needle)
        if not rects:
            continue
        a = page.add_highlight_annot(rects)
        a.set_info(title="QA bot", content=f"{len(rects)} x '{needle}'")
        a.update()
        total += len(rects)
        print(f"page {page.number + 1}: {len(rects)} hit(s), first at {rects[0]}")
    doc.save("policy_manual_marked.pdf", garbage=3, deflate=True)
    print("total hits:", total)
```

### Quiz

1. What does `page.search_for("abc")` return?
- [ ] A boolean
- [x] A list of `Rect` objects, one per occurrence (or line fragment)
- [ ] The page text with "abc" wrapped in brackets
> Each rectangle covers one occurrence; multi-line matches produce one rectangle per line.

2. After `annot.set_colors(stroke=(1,0,0))`, why is the highlight still yellow in the saved file?
- [ ] Highlights cannot change colour
- [x] `annot.update()` was not called, so the appearance stream was not regenerated
- [ ] The colour must be given as hex
> Property setters change the annotation dictionary; `update()` rebuilds its visual appearance.

3. Which argument avoids re-extracting text for many searches on the same page?
- [ ] `clip=`
- [ ] `quads=True`
- [x] `textpage=`
> Passing a pre-built `TextPage` reuses the extracted text across searches.

### Exercises

1. **Multi-term highlighter** — Highlight a list of terms across a document, using a different colour per term (yellow, green, cyan), and print a per-term count.
<details><summary>Solution</summary>

```python
import pymupdf, collections

terms = {"premium": (1, 1, 0), "endorsement": (0.6, 1, 0.6), "lien": (0.6, 1, 1)}
counts = collections.Counter()
with pymupdf.open("policy_manual.pdf") as doc:
    for page in doc:
        tp = page.get_textpage()
        for term, colour in terms.items():
            rects = page.search_for(term, textpage=tp)
            if rects:
                a = page.add_highlight_annot(rects)
                a.set_colors(stroke=colour); a.update()
                counts[term] += len(rects)
    doc.save("multi_marked.pdf")
print(dict(counts))
```

</details>

2. **Strike superseded rates** — In `rate_schedule.pdf`, strike out every line containing "SUPERSEDED" by searching for the word and striking the full text line width.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("rate_schedule.pdf") as doc:
    for page in doc:
        for r in page.search_for("SUPERSEDED"):
            full_line = pymupdf.Rect(36, r.y0, page.rect.width - 36, r.y1)
            a = page.add_strikeout_annot(full_line)
            a.set_colors(stroke=(1, 0, 0)); a.update()
    doc.save("rate_schedule_struck.pdf")
```

</details>

### Interview Questions

**Q: How does PyMuPDF locate a search string inside a PDF page?**
It extracts a `TextPage`, which is the geometric text tree of blocks, lines, characters and their bounding boxes, and then scans that character sequence for the needle, ignoring case and normalising whitespace. Because it works on extracted characters, it is only as good as extraction: text drawn as vector outlines, scanned images and fonts with broken ToUnicode maps are invisible to it. The result is geometry rather than a boolean, which lets you highlight, redact or crop the match. For repeated searches on one page I build the `TextPage` once and pass it in, which is several times faster.

**Q: What is the difference between a Rect and a Quad in search results, and when do you need quads?**
A `Rect` is axis-aligned, while a `Quad` is four arbitrary points and can describe rotated or sheared text. On an upright page they are interchangeable, but on a page where the scan was rotated 90° or where a "CONFIDENTIAL" banner runs diagonally, a rectangle would cover a huge area and the highlight would look wrong. `search_for(..., quads=True)` returns quads and every text-markup annotation method accepts them, so for rotated or artistic text I always ask for quads.

**Q: A reviewer says the highlight annotations you added do not appear in their viewer. What do you check?**
First that `annot.update()` was called after any property change, because without it the appearance stream may be missing and some viewers draw nothing. Then whether the file was saved at all and not just rendered in memory, and whether an incremental save was needed on a signed file. Then the viewer: browser built-ins such as Chrome render text-markup annotations but may hide their pop-ups, and some mobile apps ignore annotations entirely. Finally I render the page with `get_pixmap(annots=True)` to prove the annotation exists in the file, which separates a data problem from a viewer problem.

## Annotations: types, properties and deletion

Annotations are objects attached to a page that sit on top of the content: sticky notes, highlights, shapes, free-text boxes, stamps, file attachments and, importantly, redaction marks and form widgets. PyMuPDF can create, inspect, modify and delete all of them, which lets you script the review workflow that a human would do in Acrobat.

### Creating the common types

Every `add_*_annot` method returns an `Annot` object:

```python
import pymupdf

doc = pymupdf.open("sop.pdf")
page = doc[0]

note   = page.add_text_annot((500, 40), "Reviewed by QA", icon="Comment")
box    = page.add_rect_annot(pymupdf.Rect(72, 200, 400, 260))
circle = page.add_circle_annot(pymupdf.Rect(420, 200, 480, 260))
line   = page.add_line_annot(pymupdf.Point(72, 300), pymupdf.Point(400, 300))
stamp  = page.add_stamp_annot(pymupdf.Rect(400, 700, 560, 740), stamp=0)  # "Approved"
free   = page.add_freetext_annot(pymupdf.Rect(72, 320, 300, 350),
                                 "Section renumbered in v3",
                                 fontsize=10, fontname="helv",
                                 text_color=(0.8, 0, 0), fill_color=(1, 1, 0.8))
ink    = page.add_ink_annot([[pymupdf.Point(72, 400), pymupdf.Point(120, 380),
                              pymupdf.Point(160, 410)]])
```

`add_stamp_annot` takes an integer index into a fixed list (`0` Approved, `1` AsIs, `2` Confidential, `3` Departmental, `4` Draft, `5` Experimental, `6` Expired, `7` Final, `8` ForComment, `9` ForPublicRelease, `10` NotApproved, `11` NotForPublicRelease, `12` Sold, `13` TopSecret). `add_freetext_annot` writes visible text with a border and background, which is what people mean when they say "add a text box comment".

### Common properties

| Property / method | Purpose |
|---|---|
| `annot.type` | tuple like `(8, 'Highlight')` |
| `annot.rect` | bounding rectangle |
| `annot.info` | dict with `title` (author), `content`, `subject`, `creationDate`, `modDate`, `id` |
| `annot.set_info(...)` | set author, content, subject |
| `annot.colors` / `set_colors(stroke=, fill=)` | RGB tuples with values 0–1 |
| `annot.set_border(width=, dashes=[3, 3])` | line style |
| `annot.set_opacity(0.5)` | transparency |
| `annot.set_rect(rect)` | move or resize |
| `annot.set_flags(pymupdf.PDF_ANNOT_IS_LOCKED)` | locked, hidden, print flags |
| `annot.update()` | regenerate appearance after changes |
| `annot.xref` | object number, handy for logs |

```python
box.set_colors(stroke=(1, 0, 0), fill=(1, 0.9, 0.9))
box.set_border(width=1.5, dashes=[4, 2])
box.set_opacity(0.6)
box.set_info(title="Ali Raza", subject="Layout", content="Table overflows the margin")
box.update()
```

### Reading annotations back

```python
for annot in page.annots():
    kind = annot.type[1]
    print(f"{kind:10} xref={annot.xref:5} by {annot.info['title']!r}: "
          f"{annot.info['content'][:40]!r} at {annot.rect}")
```

`page.annots(types=[pymupdf.PDF_ANNOT_HIGHLIGHT, pymupdf.PDF_ANNOT_TEXT])` filters by type. `page.first_annot` and `annot.next` walk the linked list manually.

### Deleting

```python
for annot in list(page.annots()):     # materialise first: deleting while iterating is unsafe
    if annot.info["title"] == "QA bot":
        page.delete_annot(annot)
```

To strip every annotation from a whole document, loop pages and delete each one. This is standard before delivering a "clean" final PDF to a client who received a marked-up review copy.

### Flattening (baking) annotations

Some clients want comments visible but no longer editable. Since 1.24.x `doc.bake(annots=True, widgets=True)` draws every annotation's appearance permanently into the page content and removes the annotation objects.

```python
doc.bake(annots=True, widgets=False)
doc.save("sop_flattened.pdf")
```

> **Warning:** `bake()` is irreversible. Keep the annotated version alongside the flattened deliverable, because the client always comes back with "can you change the wording of comment three".

### Try It Yourself

```python
import pymupdf

with pymupdf.open("sop.pdf") as doc:
    page = doc[0]
    a = page.add_freetext_annot(pymupdf.Rect(360, 20, 580, 50),
                                "DRAFT - not for distribution",
                                fontsize=11, text_color=(0.8, 0, 0),
                                fill_color=(1, 0.95, 0.8))
    a.set_info(title="Ali Raza", subject="Status")
    a.update()
    page.add_text_annot((540, 60), "Check table on p.3", icon="Note")
    print("Annotations on page 1:")
    for annot in page.annots():
        print(" -", annot.type[1], annot.rect, annot.info.get("content"))
    doc.save("sop_annotated.pdf")
```

### Quiz

1. Which method is required after changing an annotation's colour or border?
- [ ] `annot.save()`
- [x] `annot.update()`
- [ ] `page.refresh()`
> `update()` regenerates the appearance stream so viewers draw the new look.

2. What does `annot.type` return for a highlight?
- [x] `(8, 'Highlight')`
- [ ] `"Highlight"`
- [ ] `8`
> `type` is a tuple of the numeric PDF annotation type and its name.

3. Why should you wrap `page.annots()` in `list()` before deleting?
- [ ] `annots()` returns a string
- [x] Deleting while iterating the underlying linked list is unsafe
- [ ] `delete_annot` needs a list argument
> Materialising the generator first avoids skipping or crashing when the list changes.

### Exercises

1. **Annotation report** — Produce a CSV of every annotation in a document with page, type, author, content and creation date.
<details><summary>Solution</summary>

```python
import pymupdf, csv

with pymupdf.open("review_copy.pdf") as doc, open("annots.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["page", "type", "author", "content", "created"])
    for page in doc:
        for a in page.annots():
            i = a.info
            w.writerow([page.number + 1, a.type[1], i.get("title"),
                        i.get("content"), i.get("creationDate")])
```

</details>

2. **Clean copy** — Remove every annotation whose author is not "Client" and save the result as `clean.pdf`.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("review_copy.pdf") as doc:
    removed = 0
    for page in doc:
        for a in list(page.annots()):
            if a.info.get("title") != "Client":
                page.delete_annot(a); removed += 1
    doc.save("clean.pdf", garbage=3)
print("removed", removed)
```

</details>

### Interview Questions

**Q: What is an appearance stream and why does PyMuPDF need `update()`?**
An annotation dictionary describes intent (a rectangle, a colour, an author), but viewers draw the `/AP` appearance stream, which is a small content stream rendered on top of the page. When you change colour or border, the dictionary changes but the stream still contains the old drawing, so PyMuPDF asks you to call `update()` to regenerate it. Acrobat regenerates appearances itself, but many lighter viewers and browsers do not, so a missing or stale appearance stream is the usual cause of "the annotation is there in Acrobat but invisible in Chrome".

**Q: How do you flatten annotations, and what is lost?**
`doc.bake(annots=True)` draws each annotation's appearance into the page content and deletes the annotation objects; older versions needed a workaround of rendering to an image or using `page.show_pdf_page`. After baking, comments are no longer selectable or editable, pop-up text that was not part of the appearance disappears, and authors and dates are gone, so the file becomes a static record. I use it for final deliverables and for archival copies where reviewers must not alter marks, and always keep the unflattened source.

**Q: How would you migrate annotations from one version of a document to the next?**
Read each annotation's type, rect, colours and info from the old file, then locate the same text in the new file with `search_for` on the annotation's covered text, and re-create it at the new coordinates with the matching `add_*_annot` call. Pure copying by rect fails whenever pagination shifted, which is why anchoring to text rather than position is essential; for shapes without text I fall back to relative position within the nearest paragraph. It is not perfect, so the script logs annotations it could not place for manual review.

## Inserting text and images

Adding content to an existing page is how you build Bates numbering, "Received" stamps, letterhead logos, watermark text and signature images. PyMuPDF offers three levels: `insert_text` for a single line at a point, `insert_textbox` for wrapped text in a rectangle, and `insert_image` for raster images.

### `insert_text`: one line at a point

```python
import pymupdf

doc = pymupdf.open("order.pdf")
page = doc[0]
page.insert_text(pymupdf.Point(72, 60), "RECEIVED 2026-09-15",
                 fontsize=12, fontname="helv", color=(0.8, 0, 0))
```

The point is the **baseline start** of the text, not its top-left corner. So `(72, 60)` puts the bottom of the letters at y=60. Newlines in the string start new lines below the first, spaced by `lineheight`. `fontname` accepts the 14 built-in PDF fonts by short alias:

| Alias | Font |
|---|---|
| `helv`, `hebo`, `heit`, `hebi` | Helvetica regular, bold, italic, bold-italic |
| `tiro`, `tibo`, `tiit`, `tibi` | Times-Roman variants |
| `cour`, `cobo`, `coit`, `cobi` | Courier variants |
| `symb`, `zadb` | Symbol, ZapfDingbats |

These need no embedding because every viewer has them; for Arabic, Urdu or a client's brand font you supply a `fontfile=` (covered in the Expert level).

### `insert_textbox`: wrapped text in a rectangle

```python
rect = pymupdf.Rect(72, 700, 540, 760)
rc = page.insert_textbox(rect,
        "This document was produced by Ali Raza for Stewart Title. "
        "Internal use only; do not distribute without written approval.",
        fontsize=9, fontname="tiro", align=pymupdf.TEXT_ALIGN_JUSTIFY, color=(0.3, 0.3, 0.3))
print(rc)   # positive: points of space left; negative: text did not fit
```

`insert_textbox` wraps words and returns the unused height. A **negative** return value means the text overflowed and nothing was written, so the standard pattern is to shrink the font until `rc >= 0`:

```python
size = 11
while size > 5:
    rc = page.insert_textbox(rect, long_text, fontsize=size, fontname="helv")
    if rc >= 0:
        break
    size -= 0.5
```

Alignment constants are `TEXT_ALIGN_LEFT`, `CENTER`, `RIGHT` and `JUSTIFY`. `rotate=90` writes the text sideways, which is handy for spine labels on print-ready covers.

### `insert_htmlbox`: styled text (1.23.8+)

```python
page.insert_htmlbox(pymupdf.Rect(72, 80, 540, 140),
    "<p style='font-family:sans-serif'><b>Status:</b> <span style='color:red'>SUPERSEDED</span> "
    "by <i>Rate Manual v4</i></p>")
```

This uses MuPDF's Story engine to lay out HTML/CSS, so you get bold, italic, colour and mixed fonts in one call without manual positioning.

### `insert_image`

```python
logo_rect = pymupdf.Rect(36, 24, 196, 74)
page.insert_image(logo_rect, filename="stewart_logo.png", keep_proportion=True)
```

The image is scaled to fit the rectangle. With `keep_proportion=True` (default) it is centred inside without distortion. Other sources:

```python
page.insert_image(rect, stream=png_bytes)              # bytes from memory
page.insert_image(rect, pixmap=some_pixmap)             # a Pixmap you rendered
page.insert_image(rect, filename="sig.png", rotate=90, overlay=False)
```

`overlay=False` draws the image **under** existing content, which is how you add a background letterhead behind text. `insert_image` returns the xref of the image object, and if you insert the same file on 200 pages, pass `xref=` from the first call to reuse it and keep the file small.

### Bates numbering example

```python
with pymupdf.open("exhibits.pdf") as doc:
    for page in doc:
        label = f"STEWART-{page.number + 1:06}"
        w = pymupdf.get_text_length(label, fontname="cour", fontsize=9)
        page.insert_text((page.rect.width - 36 - w, page.rect.height - 20),
                         label, fontsize=9, fontname="cour")
    doc.save("exhibits_bates.pdf")
```

`get_text_length` measures a string so you can right-align it exactly.

> **Tip:** Inserted text becomes real page content, not an annotation, so it survives flattening and is extracted by `get_text()`. If the client must be able to remove it later, use a `FreeText` annotation instead.

### Try It Yourself

```python
import pymupdf

with pymupdf.open("order.pdf") as doc:
    for page in doc:
        r = page.rect
        page.insert_image(pymupdf.Rect(36, 20, 156, 60), filename="logo.png")
        page.insert_text((36, 80), "Stewart Title - Production Copy",
                         fontsize=10, fontname="hebo", color=(0, 0.2, 0.5))
        stamp = f"Page {page.number + 1} of {doc.page_count}"
        w = pymupdf.get_text_length(stamp, fontname="helv", fontsize=8)
        page.insert_text((r.width - 36 - w, r.height - 18), stamp, fontsize=8)
        rc = page.insert_textbox(pymupdf.Rect(36, r.height - 60, r.width - 36, r.height - 30),
                                 "Confidential - prepared for internal review only.",
                                 fontsize=8, align=pymupdf.TEXT_ALIGN_CENTER)
        print(f"page {page.number + 1}: footer fit ok = {rc >= 0}")
    doc.save("order_stamped.pdf")
```

### Quiz

1. In `insert_text(point, ...)`, what does the point represent?
- [ ] The top-left corner of the text
- [x] The start of the baseline
- [ ] The centre of the text
> Text is anchored at its baseline; letters rise above the point, descenders hang below.

2. What does a negative return from `insert_textbox` mean?
- [x] The text did not fit and nothing was written
- [ ] The text was clipped at the rectangle bottom
- [ ] The rectangle was invalid
> The return is remaining height; negative means overflow and the call wrote nothing.

3. How do you draw an image behind existing page content?
- [ ] `insert_image(rect, background=True)`
- [x] `insert_image(rect, filename=..., overlay=False)`
- [ ] `page.set_background(rect)`
> `overlay=False` places the new content before existing content in the stream.

### Exercises

1. **Auto-shrinking disclaimer** — Write `fit_text(page, rect, text)` that starts at 12 pt and reduces by 0.5 pt until `insert_textbox` succeeds, returning the size used.
<details><summary>Solution</summary>

```python
import pymupdf

def fit_text(page, rect, text, fontname="helv"):
    size = 12.0
    while size >= 4:
        if page.insert_textbox(rect, text, fontsize=size, fontname=fontname) >= 0:
            return size
        size -= 0.5
    raise ValueError("text cannot fit")

with pymupdf.open("order.pdf") as doc:
    r = pymupdf.Rect(72, 650, 540, 700)
    print("used", fit_text(doc[0], r, "Long disclaimer text " * 20), "pt")
    doc.save("order_fit.pdf")
```

</details>

2. **Shared logo** — Insert the same logo on every page but embed the image only once by reusing its xref.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("handbook.pdf") as doc:
    rect = pymupdf.Rect(36, 20, 156, 60)
    xref = doc[0].insert_image(rect, filename="logo.png")
    for page in list(doc)[1:]:
        page.insert_image(rect, xref=xref)
    doc.save("handbook_logo.pdf", garbage=3)
```

</details>

### Interview Questions

**Q: What is the difference between inserting text as page content and adding a FreeText annotation?**
`insert_text` appends drawing operators to the page's content stream, so the text becomes permanent, is extracted by text tools, prints everywhere and cannot be removed without editing the stream. A FreeText annotation is a separate object layered over the page: reviewers can move, edit or delete it, it can be hidden or excluded from printing via flags, and some viewers handle it inconsistently. Bates numbers, letterheads and legal disclaimers belong in content; review comments and temporary "DRAFT" markers belong in annotations.

**Q: How do you place text accurately without overlapping existing content?**
First measure: `pymupdf.get_text_length(text, fontname, fontsize)` gives the width, and the font size approximates the line height. Then find free space with `page.get_text("blocks")` or `page.get_bbox_log()` to see where existing content lives, and choose a rectangle in the margin. `insert_textbox` returns the leftover height, so I loop the font size down until it fits, and I run a render-to-PNG check on a sample page during development. On rotated pages I use `page.rect` and pass `rotate=page.rotation` so text reads upright.

**Q: When you stamp a 500-page exhibit bundle with a logo, how do you keep the file size down?**
`insert_image` returns the xref of the created image object; passing that xref back on subsequent pages references the same object instead of embedding 500 copies, and `garbage=3` at save time would also merge duplicates but only after they have been written to memory. I also pre-shrink the logo to the pixel size it will be printed at (roughly 300 dpi at the target rectangle), and prefer PNG for flat logos and JPEG for photos. On one 767-page handbook this reduced the output from 180 MB to 9 MB.

## Merging, splitting and reordering

Assembling PDFs is bread-and-butter freelance work: combining a cover, a body and appendices into one deliverable, splitting a 3,000-page scan into per-client files, or reordering pages a scanner fed backwards. PyMuPDF does all of this in memory with a few `Document` methods.

### Merging with `insert_pdf`

```python
import pymupdf

out = pymupdf.open()                        # new empty document
for name in ["cover.pdf", "body.pdf", "appendix.pdf"]:
    with pymupdf.open(name) as src:
        out.insert_pdf(src)                 # append all pages
out.save("handbook_merged.pdf", garbage=3, deflate=True)
```

`insert_pdf(src, from_page=, to_page=, start_at=, rotate=, links=True, annots=True, show_progress=0)` copies a page range from `src` into the target at position `start_at` (default: the end). Page numbers are zero-based and inclusive, so `from_page=2, to_page=4` copies pages 3–5. Links and annotations are carried across; the table of contents is **not**, so rebuild it with `set_toc()` afterwards (next chapter).

```python
out.insert_pdf(src, from_page=0, to_page=0, start_at=0)   # put src page 1 at the very front
```

### Splitting

```python
with pymupdf.open("scan_batch.pdf") as src:
    for start in range(0, src.page_count, 10):
        part = pymupdf.open()
        part.insert_pdf(src, from_page=start, to_page=min(start + 9, src.page_count - 1))
        part.save(f"batch_{start // 10 + 1:03}.pdf")
        part.close()
```

Splitting by a **marker**, for example each order starts with a page containing "ORDER NO", is the same loop but you decide the boundaries by `page.get_text()`.

### Selecting and reordering with `select`

`doc.select(list_of_page_numbers)` keeps only the listed pages **in that order**, duplicates allowed. It is the fastest way to reorder or subset:

```python
doc = pymupdf.open("report.pdf")
doc.select([0, 2, 1, 3])          # swap pages 2 and 3
doc.select(list(range(0, doc.page_count, 2)))   # keep only odd pages (1, 3, 5, ...)
doc.save("report_reordered.pdf")
```

Because `select` changes structure, subsequent saves must be full saves, not incremental.

### Deleting, moving and copying

| Method | Effect |
|---|---|
| `doc.delete_page(pno)` | remove one page |
| `doc.delete_pages(from_page=, to_page=)` or `delete_pages([1, 5, 9])` | remove a range or a list |
| `doc.move_page(pno, to=-1)` | move a page to a new index |
| `doc.copy_page(pno, to=-1)` | duplicate a page within the document |
| `doc.new_page(pno=-1, width=595, height=842)` | insert a blank page |
| `doc.fullcopy_page(pno, to=-1)` | duplicate as an independent object (safe to edit separately) |

```python
doc.delete_pages([0, 1])                 # drop two cover sheets
doc.new_page(0, width=612, height=792)   # insert a blank Letter page at the front
doc.move_page(doc.page_count - 1, 1)     # move last page to position 2
```

### Reversing a backwards scan

```python
with pymupdf.open("scan_reverse.pdf") as doc:
    doc.select(list(range(doc.page_count - 1, -1, -1)))
    doc.save("scan_fixed.pdf")
```

### Interleaving front and back scans

A single-sided scanner produces `fronts.pdf` (1, 3, 5, ...) and `backs.pdf` (n, n-2, ..., 2). Merge and interleave:

```python
fronts, backs = pymupdf.open("fronts.pdf"), pymupdf.open("backs.pdf")
out = pymupdf.open()
n = fronts.page_count
for i in range(n):
    out.insert_pdf(fronts, from_page=i, to_page=i)
    out.insert_pdf(backs, from_page=n - 1 - i, to_page=n - 1 - i)
out.save("duplex.pdf")
```

> **Warning:** `insert_pdf` cannot insert a document into itself. To duplicate pages within one file use `copy_page` or `fullcopy_page`, or open a second handle to the same path.

### Try It Yourself

```python
import pymupdf, pathlib

parts = ["cover.pdf", "body.pdf", "appendix.pdf"]
out = pymupdf.open()
for name in parts:
    if not pathlib.Path(name).exists():
        print("missing:", name); continue
    with pymupdf.open(name) as src:
        first = out.page_count
        out.insert_pdf(src)
        print(f"{name:14} -> pages {first + 1}-{out.page_count}")
out.set_metadata({"title": "Employee Handbook 2026 (merged)"})
out.save("handbook_merged.pdf", garbage=3, deflate=True)
print("total pages:", out.page_count)
out.close()
```

### Quiz

1. `doc.insert_pdf(src, from_page=2, to_page=4)` copies how many pages?
- [ ] 2
- [x] 3
- [ ] 4
> Page numbers are zero-based and inclusive, so pages 2, 3 and 4 are copied.

2. What does `doc.select([3, 0])` leave in the document?
- [x] Two pages: old page 4 followed by old page 1
- [ ] All pages except 3 and 0
- [ ] Pages 0 through 3
> `select` keeps exactly the listed pages, in the listed order.

3. Which is NOT carried over by `insert_pdf` automatically?
- [ ] Annotations
- [ ] Links
- [x] The table of contents (bookmarks)
> Links and annotations are copied; the outline must be rebuilt with `set_toc()`.

### Exercises

1. **Split by marker** — Split `orders.pdf` into one file per order, where each order starts on a page containing the text "ORDER NO".
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("orders.pdf") as src:
    starts = [p.number for p in src if "ORDER NO" in p.get_text()]
    bounds = list(zip(starts, starts[1:] + [src.page_count]))
    for k, (a, b) in enumerate(bounds, 1):
        part = pymupdf.open()
        part.insert_pdf(src, from_page=a, to_page=b - 1)
        part.save(f"order_{k:03}.pdf"); part.close()
    print(len(bounds), "orders written")
```

</details>

2. **Remove blank pages** — Delete every page whose extracted text is empty and which has no images.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("scan_batch.pdf") as doc:
    blank = [p.number for p in doc
             if not p.get_text().strip() and not p.get_images()]
    if blank:
        doc.delete_pages(blank)
    doc.save("scan_noblanks.pdf", garbage=3)
    print("removed", len(blank), "blank pages")
```

</details>

### Interview Questions

**Q: How does `insert_pdf` differ from copying page objects with a lower-level library?**
`insert_pdf` performs a deep copy of each page's object graph, including fonts, images, XObjects and annotations, into the target document while de-duplicating within the operation through a graft map, so resources shared between the copied pages are copied once. pypdf's `add_page` and pikepdf's `pages.extend` do similar copying but pikepdf's is closer to the raw object model and retains more structure such as tagged-PDF trees. `insert_pdf` drops the outline, which you rebuild from `get_toc()` of each source with page offsets, and it cannot insert a document into itself.

**Q: You must combine 40 PDFs from different vendors into one 3,000-page bundle. What can go wrong?**
Fonts: each source may embed the same font under different subset prefixes, so the output balloons unless you save with `garbage=3` or later run `subset_fonts()`. Page sizes and rotations differ, so I normalise with `set_rotation` and, if the client wants uniform Letter, use `show_pdf_page` to place each page on a fresh page. Form fields with the same names collide, so I flatten or rename widgets first. Bookmarks must be rebuilt with offsets. One damaged source can abort the run, so every open is wrapped in try/except and logged, and I verify the output page count equals the sum of inputs.

**Q: When would you use `select` versus `delete_pages`?**
`select` expresses the final page list explicitly, which is ideal for reordering, reversing, deduplicating and subsetting in one call, and its intent is easy to review in code. `delete_pages` is clearer when the rule is "remove these", such as blank pages found by a scan, and it keeps the remaining order untouched. Both invalidate previously loaded `Page` objects and forbid incremental saves afterwards, so I do structural work first and content edits second.

## Links, bookmarks and the table of contents

Navigation is what turns a 767-page handbook from a scroll marathon into a usable document. PDFs have two navigation systems: **links** (clickable areas on a page) and the **outline**, which viewers show as a bookmark panel and PyMuPDF calls the table of contents (TOC).

### Reading the TOC

```python
import pymupdf

doc = pymupdf.open("handbook.pdf")
toc = doc.get_toc()             # list of [level, title, page]
for level, title, page in toc[:10]:
    print("  " * (level - 1) + f"{title}  (p. {page})")
```

Each entry is `[level, title, page]` with `level` starting at 1 and `page` being **1-based**. `get_toc(simple=False)` adds a fourth element, a dict with the destination details (`kind`, `to` point, `zoom`, `collapse`).

### Writing the TOC

```python
toc = [
    [1, "Part I - Policies", 1],
    [2, "1. Code of Conduct", 2],
    [2, "2. Attendance", 9],
    [1, "Part II - Procedures", 30],
    [2, "3. Data Processing SOP", 31],
    [3, "3.1 Quality Checks", 35],
]
doc.set_toc(toc)
doc.save("handbook_toc.pdf")
```

Rules: levels may only increase by one at a time (a level-3 entry cannot follow a level-1 entry), and page numbers must be within range; `set_toc` raises `ValueError` otherwise. Passing an empty list removes the outline. To jump to a precise point on the page rather than its top, use the four-element form: `[2, "3.1 Quality Checks", 35, {"kind": pymupdf.LINK_GOTO, "to": pymupdf.Point(0, 300)}]`.

### Building a TOC from headings

When a Word-exported handbook lost its bookmarks, rebuild them from font sizes:

```python
toc = []
for page in doc:
    for b in page.get_text("dict")["blocks"]:
        for line in b.get("lines", []):
            for span in line["spans"]:
                if span["size"] >= 16:
                    toc.append([1, span["text"].strip(), page.number + 1])
                elif span["size"] >= 13 and toc:
                    toc.append([2, span["text"].strip(), page.number + 1])
doc.set_toc(toc)
```

### Reading links

```python
for link in doc[0].get_links():
    print(link["kind"], link["from"], link.get("uri") or link.get("page"))
```

`kind` is one of `LINK_NONE`, `LINK_GOTO` (internal page), `LINK_URI` (web), `LINK_LAUNCH`, `LINK_NAMED`, `LINK_GOTOR` (another file). `from` is the clickable rectangle; `page` is **zero-based** for GOTO links, unlike the TOC.

### Creating links

```python
page = doc[0]
# external link over the company name
for r in page.search_for("stewart.com"):
    page.insert_link({"kind": pymupdf.LINK_URI, "from": r, "uri": "https://www.stewart.com"})
# internal link: "see Appendix B" jumps to page 120 (zero-based 119)
for r in page.search_for("Appendix B"):
    page.insert_link({"kind": pymupdf.LINK_GOTO, "from": r, "page": 119,
                      "to": pymupdf.Point(0, 0), "zoom": 0})
```

`page.update_link(link_dict)` modifies an existing link (the dict must keep its `xref`), and `page.delete_link(link_dict)` removes it.

### Making a clickable contents page

```python
toc_page = doc.new_page(0)                 # blank page at the front
y = 72
for level, title, pno in doc.get_toc():
    label = ("    " * (level - 1)) + f"{title}  ....  {pno + 1}"   # +1: we inserted a page
    toc_page.insert_text((72, y), label, fontsize=10, fontname="helv")
    w = pymupdf.get_text_length(label, fontname="helv", fontsize=10)
    toc_page.insert_link({"kind": pymupdf.LINK_GOTO, "page": pno,
                          "from": pymupdf.Rect(72, y - 10, 72 + w, y + 2)})
    y += 14
```

> **Interview note:** Candidates confuse the two numbering schemes. `get_toc()` and `set_toc()` use 1-based page numbers because that is what the bookmark panel shows; link dictionaries use 0-based pages because they map to `doc[n]`. Off-by-one bugs here are the most common navigation defect in delivered PDFs.

### Try It Yourself

```python
import pymupdf

with pymupdf.open("handbook_merged.pdf") as doc:
    toc = doc.get_toc()
    print("existing entries:", len(toc))
    if not toc:
        # build a minimal TOC: one entry per page that starts with a big span
        for page in doc:
            d = page.get_text("dict")
            for b in d["blocks"]:
                spans = [s for l in b.get("lines", []) for s in l["spans"]]
                if spans and spans[0]["size"] >= 15:
                    toc.append([1, spans[0]["text"].strip()[:60], page.number + 1])
                    break
        doc.set_toc(toc)
        print("built", len(toc), "entries")
    links = sum(len(p.get_links()) for p in doc)
    print("links in document:", links)
    doc.save("handbook_nav.pdf")
```

### Quiz

1. In `doc.get_toc()` entries, what does the third element hold?
- [ ] A zero-based page index
- [x] A one-based page number
- [ ] A byte offset
> The TOC mirrors the bookmark panel, which is 1-based; link dicts are 0-based.

2. Which `set_toc` input raises `ValueError`?
- [ ] `[[1, "A", 1], [2, "B", 2]]`
- [x] `[[1, "A", 1], [3, "B", 2]]`
- [ ] `[[1, "A", 1], [1, "B", 2]]`
> Levels may only increase by one step at a time; jumping from 1 to 3 is invalid.

3. Which link `kind` opens a web address?
- [x] `LINK_URI`
- [ ] `LINK_GOTO`
- [ ] `LINK_NAMED`
> `LINK_URI` carries a `uri` key; `LINK_GOTO` targets a page inside the same file.

### Exercises

1. **Merge with bookmarks** — Merge three PDFs and create a level-1 bookmark for each source file pointing to its first page, followed by each file's own bookmarks nested one level deeper.
<details><summary>Solution</summary>

```python
import pymupdf

out, toc = pymupdf.open(), []
for name in ["cover.pdf", "body.pdf", "appendix.pdf"]:
    with pymupdf.open(name) as src:
        offset = out.page_count
        toc.append([1, name.replace(".pdf", "").title(), offset + 1])
        for lvl, title, pno in src.get_toc():
            toc.append([lvl + 1, title, pno + offset])
        out.insert_pdf(src)
out.set_toc(toc)
out.save("merged_bookmarked.pdf")
```

</details>

2. **Dead-link checker** — List every internal (`LINK_GOTO`) link whose target page is outside the document.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("handbook_nav.pdf") as doc:
    for page in doc:
        for l in page.get_links():
            if l["kind"] == pymupdf.LINK_GOTO and not (0 <= l["page"] < doc.page_count):
                print(f"page {page.number + 1}: link to missing page {l['page']}")
```

</details>

### Interview Questions

**Q: What is the difference between the PDF outline and a table-of-contents page?**
The outline is a tree of `/Outlines` dictionaries in the catalog that viewers show in the bookmark panel; it is structured metadata, not page content, and PyMuPDF exposes it through `get_toc()`/`set_toc()`. A contents page is ordinary text on a page, made navigable only if you add `LINK_GOTO` link annotations over each line. Clients usually want both: the outline for the sidebar and a printed contents page for the PDF's paper twin. When I generate 767-page handbooks I build the outline from heading styles and then render a contents page with links from the same list, so both stay consistent.

**Q: After merging documents, the bookmarks disappeared. Why, and how do you fix it?**
`insert_pdf` copies pages but not the catalog-level outline, because outlines reference pages by object and merging would need re-pointing every destination. The fix is to capture `src.get_toc()` before each insert, add the current `out.page_count` offset to every page number, optionally nest under a per-file level-1 entry, and call `out.set_toc()` once at the end. Do the same for named destinations if the sources used them, and validate that levels only step up by one, otherwise `set_toc` rejects the list.

**Q: How do you make a "see Appendix B" cross-reference clickable in a generated PDF?**
Search each page for the phrase with `search_for`, which returns rectangles, then call `page.insert_link({"kind": pymupdf.LINK_GOTO, "from": rect, "page": target_index, "to": pymupdf.Point(0, 0)})`. The target index is zero-based, and the page must exist, so I look it up from the outline by title rather than hard-coding. For cross-file references use `LINK_GOTOR` with a `file` key, and for web links `LINK_URI`. I verify by re-reading `get_links()` and rendering a page, because viewers do not draw link borders by default, so a missing link is silent.

# LEVEL: Advanced

## Structured extraction with dict and rawdict

Plain text throws away everything that makes a document readable: font, size, weight, colour and position. `page.get_text("dict")` keeps all of it in a nested structure, which is what you need to detect headings, rebuild tables, pair labels with values on a form, or convert a PDF to structured JSON or Markdown.

### The shape of the dict

```python
import pymupdf, json

doc = pymupdf.open("sop.pdf")
d = doc[0].get_text("dict")
print(d.keys())                 # dict_keys(['width', 'height', 'blocks'])
b = d["blocks"][0]
print(b.keys())                 # 'number', 'type', 'bbox', 'lines'  (or 'image' data for type 1)
line = b["lines"][0]
print(line.keys())              # 'spans', 'wmode', 'dir', 'bbox'
span = line["spans"][0]
print(json.dumps(span, indent=1, default=str)[:400])
```

The hierarchy is **page → blocks → lines → spans**. A span is a run of characters that share the same font, size, colour and flags. A typical span looks like:

```python
{"size": 11.0, "flags": 16, "font": "Calibri-Bold", "color": 0,
 "ascender": 0.75, "descender": -0.25, "text": "Quality Checks",
 "origin": (72.0, 110.4), "bbox": (72.0, 101.9, 152.3, 113.6)}
```

| Key | Meaning |
|---|---|
| `size` | font size in points |
| `flags` | bit field: 1 superscript, 2 italic, 4 serif, 8 monospace, 16 bold |
| `font` | font name as stored in the PDF (subset prefix removed) |
| `color` | sRGB integer, e.g. `0` black, `16711680` red; decode with `pymupdf.sRGB_to_rgb()` |
| `origin` | baseline start point |
| `bbox` | bounding rectangle of the span |
| `line["dir"]` | writing direction, `(1, 0)` for horizontal left-to-right |

Image blocks (`type == 1`) carry `width`, `height`, `ext`, `bpc`, `colorspace`, `xres`, `yres` and the raw `image` bytes.

### Decoding flags

```python
def style(span):
    f = span["flags"]
    return {"bold": bool(f & 16), "italic": bool(f & 2),
            "mono": bool(f & 8), "superscript": bool(f & 1)}
```

Bold detection through the flag is reliable when the font declares weight; some fonts named `*-Bold` do not set it, so the safe check is `span["flags"] & 16 or "bold" in span["font"].lower()`.

### Finding headings by size

```python
sizes = {}
for b in d["blocks"]:
    for l in b.get("lines", []):
        for s in l["spans"]:
            sizes[round(s["size"])] = sizes.get(round(s["size"]), 0) + len(s["text"])
body_size = max(sizes, key=sizes.get)     # most-used size = body text
print("body size:", body_size)
for b in d["blocks"]:
    for l in b.get("lines", []):
        text = "".join(s["text"] for s in l["spans"]).strip()
        big = l["spans"][0]["size"] > body_size + 1.5
        if text and big:
            print("HEADING:", text)
```

The "most common size is body text" heuristic works on almost every Word or InDesign export and is the basis of pymupdf4llm's Markdown conversion.

### Pairing labels with values on a form

Fixed layouts put a label and its value on the same baseline. Use the words mode with the block and line indices to group them:

```python
words = doc[0].get_text("words")      # (x0, y0, x1, y1, word, block, line, word_no)
lines = {}
for w in words:
    lines.setdefault((w[5], w[6]), []).append(w)
for key, ws in lines.items():
    txt = " ".join(w[4] for w in ws)
    if ":" in txt:
        label, _, value = txt.partition(":")
        print(f"{label.strip():20} -> {value.strip()}")
```

### rawdict: down to characters

`"rawdict"` replaces each span's `text` with a `chars` list, each holding `c`, `origin` and `bbox`. Use it when you need character-level accuracy, for example to detect kerned column gaps in a rate table or to measure exactly where a signature line ends:

```python
r = doc[0].get_text("rawdict")
span = r["blocks"][0]["lines"][0]["spans"][0]
for ch in span["chars"][:5]:
    print(ch["c"], ch["bbox"])
```

### Fonts on the page

```python
for xref, ext, ftype, basefont, name, encoding, referencer in doc[0].get_fonts(full=True):
    print(f"{basefont:30} {ftype:10} {ext:5} xref={xref}")
```

`get_fonts()` lists fonts referenced by the page, including the subset prefix (`ABCDEF+Calibri-Bold`) and whether they are TrueType, Type1 or Type0 (CID). That is your evidence when a client's "fonts look wrong" complaint turns out to be a missing embedding.

> **Tip:** Colours in spans are integers. `pymupdf.sRGB_to_rgb(16711680)` returns `(255, 0, 0)` and `pymupdf.sRGB_to_pdf(16711680)` returns `(1.0, 0.0, 0.0)` ready for `insert_text(color=...)`.

### Try It Yourself

```python
import pymupdf, collections

with pymupdf.open("sop.pdf") as doc:
    size_hist = collections.Counter()
    spans = []
    for page in doc:
        for b in page.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                for s in l["spans"]:
                    if s["text"].strip():
                        size_hist[round(s["size"])] += len(s["text"])
                        spans.append((page.number + 1, s))
    body = max(size_hist, key=size_hist.get)
    print("body text size:", body, "| size histogram:", dict(size_hist))
    for pno, s in spans:
        if s["size"] > body + 1.5 or (s["flags"] & 16 and s["size"] >= body):
            print(f"p{pno:3} {s['size']:5.1f} {'B' if s['flags'] & 16 else ' '} {s['text'].strip()[:60]}")
```

### Quiz

1. Which flag bit marks a span as bold?
- [ ] 2
- [ ] 8
- [x] 16
> Bit 16 is bold; 2 is italic, 8 monospace, 1 superscript, 4 serif.

2. What is the hierarchy of the `dict` output?
- [x] blocks → lines → spans
- [ ] pages → paragraphs → words
- [ ] lines → words → chars
> Each block holds lines, each line holds spans of uniform font/size/colour.

3. What does `rawdict` add compared to `dict`?
- [ ] Font file bytes
- [x] A `chars` list per span with per-character bboxes
- [ ] Annotation data
> `rawdict` swaps the span's `text` string for a list of individual characters with geometry.

### Exercises

1. **PDF to Markdown headings** — Convert a document to Markdown where spans larger than body size become `#`/`##` headings and everything else is paragraphs.
<details><summary>Solution</summary>

```python
import pymupdf, collections

with pymupdf.open("sop.pdf") as doc, open("sop.md", "w", encoding="utf-8") as out:
    hist = collections.Counter()
    pages = [p.get_text("dict")["blocks"] for p in doc]
    for blocks in pages:
        for b in blocks:
            for l in b.get("lines", []):
                for s in l["spans"]:
                    hist[round(s["size"])] += len(s["text"])
    body = max(hist, key=hist.get)
    for blocks in pages:
        for b in blocks:
            if b["type"] != 0: continue
            text = " ".join(s["text"] for l in b["lines"] for s in l["spans"]).strip()
            size = b["lines"][0]["spans"][0]["size"]
            if not text: continue
            prefix = "# " if size >= body + 4 else "## " if size > body + 1.5 else ""
            out.write(prefix + text + "\n\n")
```

</details>

2. **Red text finder** — List every span whose colour is predominantly red (R > 150, G < 100, B < 100) with its page number.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("sop.pdf") as doc:
    for page in doc:
        for b in page.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                for s in l["spans"]:
                    r, g, bl = pymupdf.sRGB_to_rgb(s["color"])
                    if r > 150 and g < 100 and bl < 100 and s["text"].strip():
                        print(page.number + 1, repr(s["text"]))
```

</details>

### Interview Questions

**Q: How would you detect headings in a PDF that has no bookmarks?**
Extract spans with `get_text("dict")`, build a histogram of font sizes weighted by character count, and treat the most frequent size as body text. Spans noticeably larger than body, or bold spans at body size that begin a block, are heading candidates; I then rank sizes to assign levels. Numbering patterns like `3.1` in the text confirm the level, and short line length filters out big-font quotes. This works for Word and InDesign exports; it fails on scanned documents, where I OCR first, and on designs using colour rather than size, where I add the span colour to the rule.

**Q: What does a "span" represent and why does the same line often split into several spans?**
A span is a maximal run of characters in one line that share font, size, colour and style flags. A line like "**Premium:** $1,250.00" produces two spans, one bold and one regular, and a line that switches fonts for a currency symbol produces three. Generators sometimes also break spans at kerning adjustments or after each word, so you should never assume one span per line; join `s["text"]` across a line's spans when you want the line text, and use `bbox` union for its geometry.

**Q: How do you turn a fixed-layout form PDF into key-value JSON?**
For text-based forms I use `"words"` mode and group by block and line indices, then split on the colon or on a known x-position boundary between the label column and the value column, which I measure once from a sample. For forms with drawn boxes I use `page.get_drawings()` to find rectangles and assign words to the box that contains their bbox. Multi-line values are joined when consecutive lines start beyond the label column. Every extractor gets a validation step, such as regex for order numbers and dates, so bad layout guesses fail loudly instead of producing silent garbage.

## Tables with find_tables

Since version **1.23.0** PyMuPDF has a built-in table detector, `page.find_tables()`, adapted from pdfplumber's algorithm but running on MuPDF's fast geometry. It finds tables by ruling lines or by text alignment and hands you rows of cells you can send straight to pandas. For a Data & Reporting Analyst this is the shortest path from a vendor rate schedule PDF to a rate matrix in Excel.

### Basic use

```python
import pymupdf

doc = pymupdf.open("rate_schedule.pdf")
page = doc[0]
tabs = page.find_tables()          # a TableFinder
print(f"{len(tabs.tables)} table(s) found")
for i, t in enumerate(tabs.tables):
    print(i, t.bbox, f"{t.row_count} rows x {t.col_count} cols")
```

`tabs.tables` is a list of `Table` objects. Each has `bbox`, `rows`, `cells`, `row_count`, `col_count` and `header`.

### Extracting cell text

```python
t = tabs[0]                        # TableFinder supports indexing
data = t.extract()                 # list of rows, each a list of strings (None for empty)
for row in data[:5]:
    print(row)
print(t.header.names)              # header cell texts as detected
df = t.to_pandas()                 # pandas DataFrame with header names as columns
print(t.to_markdown()[:300])       # Markdown table, handy for LLM prompts
```

`header` is a `TableHeader` object whose `names` list becomes the DataFrame columns. When PyMuPDF thinks the first row is not a header (`t.header.external` is `True` when it found the header above the table bbox), you can override: `t.to_pandas()` still uses the detected names, so post-fix with `df.columns = data[0]` if needed.

### Strategies

The detector needs to decide where the row and column boundaries are:

| `strategy=` | Column/row edges come from | Best for |
|---|---|---|
| `"lines_strict"` (default) | drawn ruling lines only, ignoring lines that do not form cells | classic grid tables from Word or Excel |
| `"lines"` | all drawn lines and rectangle edges | tables with partial borders |
| `"text"` | alignment of word bounding boxes | borderless tables, plain-text rate sheets |

```python
tabs = page.find_tables(strategy="text")
tabs = page.find_tables(vertical_strategy="lines", horizontal_strategy="text")
```

You can mix strategies per axis, which suits tables with vertical rules but no horizontal ones.

### Tuning parameters

| Parameter | Default | Effect |
|---|---|---|
| `clip=Rect` | page | search only inside this rectangle |
| `snap_tolerance` | 3 | merge edges closer than this many points |
| `join_tolerance` | 3 | join line segments with gaps below this |
| `edge_min_length` | 3 | ignore shorter edges |
| `min_words_vertical` | 3 | text strategy: words needed to form a column edge |
| `min_words_horizontal` | 1 | text strategy: words needed to form a row edge |
| `intersection_tolerance` | 3 | how close edges must cross to count as a corner |
| `text_tolerance` | 3 | glue characters into words within this distance |
| `add_lines` | None | extra `[(p1, p2), ...]` line segments to inject |

```python
tabs = page.find_tables(clip=pymupdf.Rect(36, 150, 576, 700),
                        strategy="text", snap_tolerance=5, min_words_vertical=2)
```

`add_lines` is the escape hatch for a table whose header row lacks a rule: inject a horizontal line where the boundary should be.

### Multi-page tables into one DataFrame

Rate schedules run for pages with the header repeated. Collect them and drop repeated headers:

```python
import pandas as pd

frames = []
with pymupdf.open("rate_schedule.pdf") as doc:
    for page in doc:
        for t in page.find_tables().tables:
            df = t.to_pandas()
            if frames and list(df.columns) == list(frames[0].columns):
                pass                      # same header, keep body
            frames.append(df)
matrix = pd.concat(frames, ignore_index=True)
matrix = matrix[matrix.iloc[:, 0].notna()]
print(matrix.shape)                       # e.g. (3346, 6) for a combined rate matrix
matrix.to_excel("rate_matrix.xlsx", index=False)
```

### Visual check

```python
pix = page.get_pixmap(dpi=100)
for t in tabs.tables:
    page.draw_rect(t.bbox, color=(1, 0, 0), width=1)
    for cell in t.cells:
        page.draw_rect(pymupdf.Rect(cell), color=(0, 0, 1), width=0.3)
page.get_pixmap(dpi=100).save("table_debug.png")
```

`draw_rect` writes into the page content, so do this on a throwaway copy, not the deliverable.

> **Warning:** `find_tables` works on extracted text geometry. A scanned rate sheet has no text, so it finds nothing; OCR the page first (Expert level) or use `page.get_textpage_ocr()` and pass its text through your own clustering.

### Try It Yourself

```python
import pymupdf

with pymupdf.open("rate_schedule.pdf") as doc:
    total_rows = 0
    for page in doc:
        tabs = page.find_tables(strategy="lines_strict")
        if not tabs.tables:
            tabs = page.find_tables(strategy="text")      # fall back for borderless pages
        for t in tabs.tables:
            rows = t.extract()
            total_rows += len(rows) - 1
            print(f"page {page.number + 1}: {t.row_count}x{t.col_count} header={t.header.names}")
            for row in rows[1:3]:
                print("   ", row)
    print("data rows across document:", total_rows)
```

### Quiz

1. Which strategy uses the alignment of words rather than drawn lines?
- [ ] `"lines_strict"`
- [ ] `"lines"`
- [x] `"text"`
> The text strategy clusters word bounding boxes into columns and rows; it is the choice for borderless tables.

2. What does `Table.to_pandas()` use for column names?
- [x] The detected header cell texts (`t.header.names`)
- [ ] Integers 0..n
- [ ] The page number
> The header object supplies names; fix them manually if detection picked the wrong row.

3. Why does `find_tables` return nothing on a scanned page?
- [ ] The page is too large
- [x] There is no extractable text or vector lines, only an image
- [ ] Scans need `strategy="image"`
> Detection relies on text geometry and vector edges; a raster scan has neither until OCR runs.

### Exercises

1. **Rate schedule to Excel** — Extract every table in a document into a single DataFrame, dropping repeated header rows, and save it to `rates.xlsx` with a `page` column.
<details><summary>Solution</summary>

```python
import pymupdf, pandas as pd

frames = []
with pymupdf.open("rate_schedule.pdf") as doc:
    header = None
    for page in doc:
        for t in page.find_tables().tables:
            rows = t.extract()
            if header is None:
                header = rows[0]
            body = [r for r in rows if r != header]
            df = pd.DataFrame(body, columns=header)
            df.insert(0, "page", page.number + 1)
            frames.append(df)
out = pd.concat(frames, ignore_index=True)
out.to_excel("rates.xlsx", index=False)
print(out.shape)
```

</details>

2. **Strategy comparer** — For page 1, run all three strategies and print how many tables and total cells each finds.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("rate_schedule.pdf") as doc:
    page = doc[0]
    for s in ("lines_strict", "lines", "text"):
        tabs = page.find_tables(strategy=s)
        cells = sum(len(t.cells) for t in tabs.tables)
        print(f"{s:13} tables={len(tabs.tables)} cells={cells}")
```

</details>

### Interview Questions

**Q: How does PyMuPDF's table detection work under the hood?**
It follows the pdfplumber approach: collect candidate edges either from vector drawings (`page.get_drawings()` lines and rectangle borders) or, in text mode, from the left and right edges of aligned words; snap nearby edges together within `snap_tolerance`; join collinear segments; compute intersections; and then form the largest set of rectangular cells whose corners are intersections. Cells are grouped into tables by adjacency, and text is assigned to cells by bbox containment. Knowing this explains every failure: a missing rule produces merged cells, a decorative underline produces a phantom row, and both are fixed with `add_lines` or the tolerance parameters.

**Q: A vendor rate PDF has vertical rules but no horizontal lines. How do you extract it?**
Use mixed strategies: `find_tables(vertical_strategy="lines", horizontal_strategy="text")`, so columns come from the drawn rules and rows from text baselines. If rows still merge because of tight line spacing, lower `snap_tolerance` and `text_tolerance`, and clip to the table region to keep headings out. I validate the result by checking that every row has the expected column count and that numeric columns parse as numbers; on a 3,346-row combined rate matrix that validation caught two pages where a footnote had been absorbed as a row.

**Q: When would you choose pdfplumber or Camelot over PyMuPDF's find_tables?**
pdfplumber gives finer control, its visual debugger draws every edge and intersection, and it exposes per-character geometry, so for a stubborn layout I prototype there. Camelot's lattice mode is excellent on scanned-then-vectorised grids and its stream mode is strong for whitespace tables, but it drags in OpenCV and Ghostscript. PyMuPDF's detector is the fastest of the three by a wide margin and needs no extra dependencies, so once a strategy is proven I move it into the PyMuPDF pipeline for the production run.

## Redaction

Redaction means **permanently removing** content, not painting a black box over it. Title-insurance files and BPO records are full of social security numbers, account numbers and signatures that must not leave the building. PyMuPDF implements true redaction in two steps: mark areas with redaction annotations, then apply them to delete underlying text, images and vector graphics.

### Step 1: mark

```python
import pymupdf, re

doc = pymupdf.open("closing_package.pdf")
page = doc[0]
ssn = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")

for x0, y0, x1, y1, word, *_ in page.get_text("words"):
    if ssn.fullmatch(word):
        page.add_redact_annot(pymupdf.Rect(x0, y0, x1, y1), text="[SSN]",
                              fontsize=8, fill=(0, 0, 0), text_color=(1, 1, 1))
```

`add_redact_annot(quad, text=None, fontname="helv", fontsize=11, align=0, fill=(0,0,0), text_color=(0,0,0), cross_out=True)` creates a redaction annotation. `text` is optional replacement text drawn inside the box after applying; `fill` is the box colour. Until you apply, the file is **not** redacted, only marked, and the sensitive text is still extractable.

### Step 2: apply

```python
page.apply_redactions()
doc.save("closing_package_redacted.pdf", garbage=4, deflate=True)
```

`apply_redactions(images=PDF_REDACT_IMAGE_PIXELS, graphics=PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED, text=PDF_REDACT_TEXT_REMOVE)` (keyword defaults as of 1.24) removes every character whose bbox intersects a redaction rectangle, blanks the affected image pixels, and deletes vector art that touches the area. Parameter options:

| Parameter | Values |
|---|---|
| `images` | `PDF_REDACT_IMAGE_NONE` (leave images), `PDF_REDACT_IMAGE_REMOVE` (drop whole image), `PDF_REDACT_IMAGE_PIXELS` (blank only the covered pixels, default), `PDF_REDACT_IMAGE_REMOVE_UNLESS_INVISIBLE` |
| `graphics` | `PDF_REDACT_LINE_ART_NONE`, `PDF_REDACT_LINE_ART_REMOVE_IF_COVERED`, `PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED` |
| `text` | `PDF_REDACT_TEXT_REMOVE` (default), `PDF_REDACT_TEXT_NONE` (keep text, only images/graphics) |

Always save with `garbage` ≥ 1 after redaction so orphaned objects, such as the original image stream, are physically dropped.

### Redacting by search

```python
for page in doc:
    for rect in page.search_for("John Q. Borrower"):
        page.add_redact_annot(rect, fill=(0, 0, 0))
    page.apply_redactions()
```

Because `search_for` returns one rectangle per line fragment, wrapped names are handled.

### The "whole line" problem

Redaction removes any character whose bbox **touches** the rectangle. If your rectangle is slightly too tall it clips the line above or below, deleting a neighbouring character. Shrink the rect vertically by a point or two:

```python
r = pymupdf.Rect(x0, y0 + 1, x1, y1 - 1)
```

Conversely, if you want to remove the entire line, extend the rectangle to the full text width.

### Redacting images and metadata

A signature scan is an image, and the redaction rectangle blanks only the covered pixels by default. To remove the whole image object regardless of overlap use `images=pymupdf.PDF_REDACT_IMAGE_REMOVE`. Do not forget the invisible channels:

```python
doc.set_metadata({})                       # blank the Info dictionary
doc.del_xml_metadata()                     # drop XMP
for page in doc:
    for a in list(page.annots()):
        page.delete_annot(a)               # comments may quote the redacted text
doc.scrub()                                # one call that removes metadata, annotations,
                                           # embedded files, JavaScript, thumbnails, etc.
```

`doc.scrub(attached_files=True, clean_pages=True, embedded_files=True, hidden_text=True, javascript=True, metadata=True, redactions=True, redact_images=0, remove_links=True, reset_fields=True, reset_responses=True, thumbnails=True, xml_metadata=True)` is the nuclear option; it also applies pending redactions.

### Verifying

```python
check = pymupdf.open("closing_package_redacted.pdf")
leak = [p.number + 1 for p in check if ssn.search(p.get_text())]
print("pages still containing an SSN:", leak or "none")
```

Never deliver a redacted file without an automated re-scan; the search is the proof.

> **Warning:** Drawing a black rectangle with `draw_rect` or adding a Square annotation is not redaction. The text is still in the content stream, and anyone can select-all and paste it into Notepad. Several real-world court filings have leaked exactly this way.

### Try It Yourself

```python
import pymupdf, re

patterns = [re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),      # SSN
            re.compile(r"\b\d{10,16}\b")]              # account numbers
with pymupdf.open("closing_package.pdf") as doc:
    marked = 0
    for page in doc:
        for x0, y0, x1, y1, word, *_ in page.get_text("words"):
            if any(p.fullmatch(word) for p in patterns):
                page.add_redact_annot(pymupdf.Rect(x0, y0 + 1, x1, y1 - 1), text="XXX",
                                      fontsize=7, fill=(0, 0, 0), text_color=(1, 1, 1))
                marked += 1
        page.apply_redactions()
    doc.scrub(metadata=True, xml_metadata=True)
    doc.save("closing_package_redacted.pdf", garbage=4, deflate=True)
    print("redacted", marked, "items")
with pymupdf.open("closing_package_redacted.pdf") as check:
    leaks = sum(bool(p.search(page.get_text())) for page in check for p in patterns)
    print("verification leaks:", leaks)
```

### Quiz

1. After `add_redact_annot()` but before `apply_redactions()`, is the text removed?
- [ ] Yes, immediately
- [x] No, the file is only marked; text is still extractable
- [ ] Only in the rendered image
> Redaction annotations are markers; `apply_redactions()` performs the removal.

2. What does `images=pymupdf.PDF_REDACT_IMAGE_PIXELS` do?
- [x] Blanks only the pixels under the redaction rectangle
- [ ] Removes every image on the page
- [ ] Leaves images untouched
> It is the default: covered pixels are cleared while the rest of the image survives.

3. Why save with `garbage=4` after redacting?
- [ ] To speed up rendering
- [x] So orphaned objects such as the original image stream are physically removed
- [ ] It is required by `apply_redactions()`
> Without garbage collection, unreferenced objects can remain in the file bytes.

### Exercises

1. **Name redactor from a list** — Given a list of names in `names.txt`, redact each occurrence across a document and print counts per name.
<details><summary>Solution</summary>

```python
import pymupdf, collections

names = [l.strip() for l in open("names.txt", encoding="utf-8") if l.strip()]
counts = collections.Counter()
with pymupdf.open("closing_package.pdf") as doc:
    for page in doc:
        tp = page.get_textpage()
        for n in names:
            rects = page.search_for(n, textpage=tp)
            for r in rects:
                page.add_redact_annot(r, fill=(0, 0, 0))
            counts[n] += len(rects)
        page.apply_redactions()
    doc.save("names_redacted.pdf", garbage=4, deflate=True)
print(dict(counts))
```

</details>

2. **Region redaction** — Redact the top-right 200 × 80 pt corner (where a scanned signature sits) on every page, removing the image entirely.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("signed_forms.pdf") as doc:
    for page in doc:
        r = page.rect
        page.add_redact_annot(pymupdf.Rect(r.width - 200, 0, r.width, 80))
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_REMOVE)
    doc.save("signed_forms_redacted.pdf", garbage=4)
```

</details>

### Interview Questions

**Q: What is the difference between redaction and covering text with a black box?**
A black box drawn with a rectangle or annotation sits on top of the content stream, and the original text, image and vector data remain in the file; copy-paste, text extraction or deleting the annotation reveals everything. True redaction rewrites the content stream to remove the glyphs, clears the pixels of underlying images and deletes touched vector art, and then garbage collection removes the orphaned objects so the bytes are gone. PyMuPDF's `add_redact_annot` plus `apply_redactions` does the latter. I always finish with a re-extraction scan and a metadata scrub, because comments and XMP can still quote the redacted values.

**Q: How do you avoid removing neighbouring characters when redacting a word?**
`apply_redactions` deletes any character whose bounding box intersects the redaction rectangle, and word bboxes from `get_text("words")` often overlap adjacent lines vertically by a point or two because of ascenders and descenders. I shrink each rectangle inward by about one point vertically, and horizontally only when adjacent words are tight, then render the page to check. For whole-line redaction I do the opposite and extend to the text column width so no partial word survives at the edges.

**Q: Which parts of a PDF can leak sensitive data even after page text is redacted?**
The Info dictionary and XMP metadata, annotation contents and pop-up notes, form field values and default values, embedded file attachments, bookmarks whose titles quote names, hidden layers (optional content), previous incremental revisions if the file was saved incrementally, thumbnails, and image data outside the redaction area. `doc.scrub()` handles most of them in one call, but incremental history requires a full save, which is why my redaction scripts always write a fresh file with `garbage=4` rather than appending.

## Form fields and widgets

A fillable PDF form stores its fields as **widget annotations** linked to an AcroForm dictionary. Ali has built forms with up to 168 fields; PyMuPDF lets you read, fill, create and flatten those fields programmatically, which turns a static form into a mail-merge engine.

### Detecting a form

```python
import pymupdf

doc = pymupdf.open("intake_form.pdf")
print(doc.is_form_pdf)           # False, or the number of fields (e.g. 168)
```

### Reading fields

```python
for page in doc:
    for w in page.widgets():
        print(f"p{page.number + 1} {w.field_type_string:10} {w.field_name:30} = {w.field_value!r}")
```

`page.widgets()` yields `Widget` objects. Important attributes:

| Attribute | Meaning |
|---|---|
| `field_name` | fully qualified name, e.g. `borrower.name` |
| `field_type` / `field_type_string` | `PDF_WIDGET_TYPE_TEXT`, `CHECKBOX`, `RADIOBUTTON`, `COMBOBOX`, `LISTBOX`, `BUTTON`, `SIGNATURE` |
| `field_value` | current value (str for text, `True`/`False` or on-state for checkboxes) |
| `field_label` | alternate name shown as a tooltip |
| `rect` | position on the page |
| `choice_values` | options for combo/list boxes |
| `field_flags` | bit flags: read-only, required, multiline, password |
| `text_font`, `text_fontsize`, `text_color`, `fill_color`, `border_color` | appearance |
| `xref` | object number |

### Filling fields

```python
values = {"borrower.name": "Ayesha Khan", "order.no": "ST-2026-04471",
          "state": "TX", "escrow": True}
for page in doc:
    for w in page.widgets():
        if w.field_name in values:
            v = values[w.field_name]
            if w.field_type == pymupdf.PDF_WIDGET_TYPE_CHECKBOX:
                w.field_value = w.on_state() if v else "Off"
            else:
                w.field_value = v
            w.update()               # regenerate appearance
doc.save("intake_filled.pdf")
```

`w.update()` is mandatory after every change, exactly like annotations. For checkboxes the "on" value is not always `Yes`; `w.on_state()` returns the correct export value for that specific box. For radio groups, set `field_value` on the specific button that should be selected.

### Creating fields

```python
page = doc[0]
w = pymupdf.Widget()
w.field_type = pymupdf.PDF_WIDGET_TYPE_TEXT
w.field_name = "reviewer.name"
w.field_label = "Name of QA reviewer"
w.rect = pymupdf.Rect(72, 700, 300, 720)
w.text_fontsize = 10
w.border_color = (0.5, 0.5, 0.5)
w.fill_color = (0.95, 0.95, 1)
page.add_widget(w)

cb = pymupdf.Widget()
cb.field_type = pymupdf.PDF_WIDGET_TYPE_CHECKBOX
cb.field_name = "reviewer.approved"
cb.rect = pymupdf.Rect(320, 702, 334, 716)
page.add_widget(cb)

combo = pymupdf.Widget()
combo.field_type = pymupdf.PDF_WIDGET_TYPE_COMBOBOX
combo.field_name = "state"
combo.choice_values = ["TX", "FL", "NY", "WY"]
combo.rect = pymupdf.Rect(350, 700, 420, 720)
page.add_widget(combo)
doc.save("form_with_fields.pdf")
```

`add_widget` returns the created widget; setting `w.field_value` before adding pre-fills it. Field names must be unique per document unless you deliberately want linked fields that mirror each other, which is how "name on every page" forms work.

### Mail merge from a spreadsheet

```python
import csv

with open("borrowers.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        with pymupdf.open("intake_form.pdf") as tpl:
            for page in tpl:
                for w in page.widgets():
                    if w.field_name in row:
                        w.field_value = row[w.field_name]; w.update()
            tpl.save(f"out/intake_{row['order.no']}.pdf")
```

### Flattening

To lock the filled values so they cannot be edited, bake widgets into page content:

```python
doc.bake(annots=False, widgets=True)       # 1.24.x+
doc.save("intake_flat.pdf", garbage=3)
```

After baking `doc.is_form_pdf` is `False` and the values are ordinary text.

### NeedAppearances

Some viewers show empty boxes after programmatic filling because they trust the missing appearance stream. `w.update()` builds appearances, and as extra insurance set `doc.need_appearances(True)`, which tells viewers to regenerate on open.

> **Interview note:** Be ready to explain the difference between the AcroForm field (the logical value, stored once) and its widget annotations (the visual boxes, possibly several per field). PyMuPDF's `Widget` merges both views, but a field with three widgets on three pages appears three times in `widgets()` with the same `field_name`.

### Try It Yourself

```python
import pymupdf, json

with pymupdf.open("intake_form.pdf") as doc:
    print("fields:", doc.is_form_pdf)
    fields = {}
    for page in doc:
        for w in page.widgets():
            fields[w.field_name] = {"type": w.field_type_string, "page": page.number + 1,
                                    "value": w.field_value, "rect": list(w.rect)}
    print(json.dumps(fields, indent=1)[:1500])
    for page in doc:
        for w in page.widgets():
            if w.field_type == pymupdf.PDF_WIDGET_TYPE_TEXT and not w.field_value:
                w.field_value = "N/A"; w.update()
    doc.save("intake_defaults.pdf")
```

### Quiz

1. What does `doc.is_form_pdf` return for a form with 168 fields?
- [ ] `True`
- [x] `168`
- [ ] A list of field names
> It returns the field count (truthy) or `False` when there is no AcroForm.

2. How do you find the correct "checked" value for a checkbox widget?
- [ ] It is always `"Yes"`
- [x] `w.on_state()`
- [ ] `w.field_value = 1`
> The on-state export value is defined per widget; `on_state()` reads it.

3. What does `doc.bake(widgets=True)` do?
- [x] Draws field values permanently into the page and removes the widgets
- [ ] Sets all fields to read-only
- [ ] Deletes the field values
> Baking flattens the form so the values become static page content.

### Exercises

1. **Required-field checker** — List every text field whose value is empty, so QA can reject incomplete intake forms.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("intake_filled.pdf") as doc:
    missing = [w.field_name for page in doc for w in page.widgets()
               if w.field_type == pymupdf.PDF_WIDGET_TYPE_TEXT and not (w.field_value or "").strip()]
    print("empty fields:", missing or "none")
```

</details>

2. **Signature line generator** — Add a text field named `sign.date` and a checkbox `sign.agree` to the last page of every PDF in a folder, 1 inch from the bottom.
<details><summary>Solution</summary>

```python
import pymupdf, pathlib

for pdf in pathlib.Path("forms").glob("*.pdf"):
    with pymupdf.open(pdf) as doc:
        page = doc[-1]; r = page.rect
        t = pymupdf.Widget(); t.field_type = pymupdf.PDF_WIDGET_TYPE_TEXT
        t.field_name = "sign.date"; t.rect = pymupdf.Rect(72, r.height - 92, 250, r.height - 72)
        page.add_widget(t)
        c = pymupdf.Widget(); c.field_type = pymupdf.PDF_WIDGET_TYPE_CHECKBOX
        c.field_name = "sign.agree"; c.rect = pymupdf.Rect(270, r.height - 90, 286, r.height - 74)
        page.add_widget(c)
        doc.save(pdf.with_name(pdf.stem + "_sig.pdf"))
```

</details>

### Interview Questions

**Q: What is the relationship between AcroForm fields and widget annotations?**
The AcroForm dictionary in the catalog holds a tree of field dictionaries with the logical name (`/T`), type (`/FT`) and value (`/V`). Each field is displayed by one or more widget annotations on pages, which carry the rectangle, appearance stream and visual properties; often the field and its single widget are merged into one dictionary. PyMuPDF's `Widget` class presents the union, so changing `field_value` updates the shared `/V` and `update()` regenerates that widget's `/AP`. Understanding this explains why a field mirrored on three pages shows the same value everywhere and why deleting one widget does not delete the field.

**Q: Filled values show in Acrobat but not in Chrome or a phone viewer. What happened?**
The `/V` value was written but the widget's appearance stream was not regenerated, so viewers that do not build appearances themselves draw the old, empty look. In PyMuPDF the fix is calling `w.update()` after every change, and optionally `doc.need_appearances(True)` so viewers know to rebuild. If the form must look identical everywhere, including in viewers that ignore forms entirely, I bake the widgets into page content with `doc.bake()`, accepting that the form becomes non-editable.

**Q: How would you build a 168-field form from a Word layout and populate it from Excel?**
I export the Word layout to PDF, then use `get_text("words")` and `get_drawings()` to locate each label and its underline or box, which gives me the widget rectangles automatically instead of clicking 168 times in Acrobat. A CSV maps label text to field names, types and options; a script creates the widgets with `add_widget`, sets fonts and border colours for a consistent look, and saves the template. Population is a loop over `pandas.read_excel` rows that fills a copy of the template, calls `update()` on every widget and writes one file per row, followed by a checker that reads the fields back to confirm nothing was dropped.

## Rotation, cropbox and transformations

Geometry is where PyMuPDF beginners get stuck: a stamp lands sideways, a crop cuts the wrong edge, or a rendered image is mirrored. This chapter explains rotation, the cropbox and the `Matrix` class so you can place anything anywhere with confidence.

### Page rotation

```python
import pymupdf

doc = pymupdf.open("scan.pdf")
page = doc[0]
print(page.rotation)          # 0, 90, 180 or 270
page.set_rotation(90)         # view rotated clockwise by 90°
print(page.rect)              # width and height are swapped now
```

`set_rotation` changes the `/Rotate` entry, which is an instruction to the viewer; content is untouched. That is cheap and reversible, and it is the right fix for a scanner that fed pages sideways. `page.rect` always reflects the rotated view, so a Letter page rotated 90° reports `Rect(0, 0, 792, 612)`.

### Working on a rotated page

Content coordinates live in the **unrotated** page space, but everything PyMuPDF gives you (`search_for`, `get_text`, annotations) is already in the rotated `page.rect` space. Two helper matrices convert between them:

| Matrix | Converts |
|---|---|
| `page.rotation_matrix` | unrotated space → rotated (viewer) space |
| `page.derotation_matrix` | rotated space → unrotated space |
| `page.transformation_matrix` | PDF bottom-left coordinates → PyMuPDF top-left coordinates |

When you insert text on a rotated page you want it to read upright in the viewer, so tell `insert_text` about the rotation:

```python
page.insert_text((72, 72), "RECEIVED", fontsize=14, rotate=page.rotation)
```

### Cropping

The cropbox restricts what viewers show. Values are in **unrotated** mediabox coordinates:

```python
mb = page.mediabox
page.set_cropbox(pymupdf.Rect(mb.x0 + 36, mb.y0 + 36, mb.x1 - 36, mb.y1 - 36))
print(page.rect)   # 540 x 720 for Letter
```

Cropping is non-destructive; content outside remains in the file and `page.set_cropbox(page.mediabox)` restores it. To physically remove margins, redact the outside strips or render the clipped page to an image. `page.set_mediabox()` changes the physical page and is used when you want to extend a page, for example to add a bleed area for a print-ready cover.

### The Matrix class

`pymupdf.Matrix(a, b, c, d, e, f)` is a standard 2D affine transform. Convenience constructors:

```python
pymupdf.Matrix(2, 2)                 # scale x and y
pymupdf.Matrix(90)                   # rotate 90° (positive is clockwise in PyMuPDF space)
pymupdf.Matrix(1, 0, 0, 1, 50, 20)   # translate by (50, 20)
pymupdf.Identity
m = pymupdf.Matrix(2, 2).prerotate(90).pretranslate(10, 0)
```

Matrices multiply points and rectangles with `*`:

```python
r = pymupdf.Rect(0, 0, 100, 50)
print(r * pymupdf.Matrix(2, 2))        # Rect(0, 0, 200, 100)
p = pymupdf.Point(10, 10) * pymupdf.Matrix(90)
print(p)                               # Point(-10, 10)
```

### Rendering rotated views

`get_pixmap` accepts a matrix, so you can produce an upright image of a sideways scan without touching the file:

```python
pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2).prerotate(270))
```

### Placing pages inside pages

`show_pdf_page` draws an entire source page into a rectangle on a target page, applying scaling and rotation. This is how you build 2-up imposition, N-up handouts, or normalise mixed A4/Letter files to one size:

```python
src = pymupdf.open("mixed_sizes.pdf")
out = pymupdf.open()
for sp in src:
    tgt = out.new_page(width=612, height=792)
    margin = pymupdf.Rect(18, 18, 594, 774)
    tgt.show_pdf_page(margin, src, sp.number, rotate=-sp.rotation, keep_proportion=True)
out.save("normalised_letter.pdf")
```

Two-up imposition uses two calls per target page with left and right halves of the rectangle.

### Fixing a mirrored render

A page whose content stream applies a negative scale renders mirrored. `page.get_pixmap(matrix=pymupdf.Matrix(-1, 1))` mirrors it back for a preview; for a permanent fix wrap the page content with a corrective transform using `page.wrap_contents()` and prepend a `cm` operator through `doc.update_stream()` (Expert territory).

> **Tip:** `page.get_bbox_log()` is not what you want for content bounds; use `page.get_text("blocks")` and `page.get_drawings()` bboxes, or simply `page.rect`, and remember that `page.bound()` equals `page.rect`.

### Try It Yourself

```python
import pymupdf

with pymupdf.open("scan.pdf") as doc:
    fixed = 0
    for page in doc:
        r = page.rect
        landscape = r.width > r.height
        # heuristic: text lines are vertical when a scan is sideways
        d = page.get_text("dict")
        vertical = sum(1 for b in d["blocks"] for l in b.get("lines", [])
                       if abs(l["dir"][1]) > 0.9)
        horizontal = sum(1 for b in d["blocks"] for l in b.get("lines", [])
                         if abs(l["dir"][0]) > 0.9)
        if vertical > horizontal:
            page.set_rotation((page.rotation + 90) % 360); fixed += 1
        print(f"page {page.number + 1}: {r.width:.0f}x{r.height:.0f} "
              f"landscape={landscape} vlines={vertical} hlines={horizontal} rot={page.rotation}")
    doc.save("scan_upright.pdf")
    print("rotated", fixed, "pages")
```

### Quiz

1. What does `page.set_rotation(90)` change?
- [x] The `/Rotate` viewer instruction only; content is untouched
- [ ] The content stream, permanently rotating every glyph
- [ ] The cropbox
> Rotation is a display attribute; `page.rect` swaps width and height accordingly.

2. In which coordinate space does `set_cropbox()` expect its rectangle?
- [ ] Rotated `page.rect` space
- [x] Unrotated mediabox space
- [ ] Pixel space at 72 dpi
> Cropbox and mediabox are stored in the page's native, unrotated coordinates.

3. Which method draws one PDF page inside a rectangle on another page?
- [ ] `insert_pdf`
- [x] `show_pdf_page`
- [ ] `insert_image`
> `show_pdf_page` embeds the source page as a Form XObject with scaling and rotation.

### Exercises

1. **2-up handout** — Produce a landscape Letter document that shows two consecutive source pages side by side on each output page.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("sop.pdf") as src:
    out = pymupdf.open()
    for i in range(0, src.page_count, 2):
        tgt = out.new_page(width=792, height=612)
        tgt.show_pdf_page(pymupdf.Rect(18, 18, 387, 594), src, i)
        if i + 1 < src.page_count:
            tgt.show_pdf_page(pymupdf.Rect(405, 18, 774, 594), src, i + 1)
    out.save("sop_2up.pdf")
```

</details>

2. **Margin trim** — Set the cropbox of every page to remove a 0.5-inch border, then print the new `page.rect` size and restore the mediabox on page 1 only.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("sop.pdf") as doc:
    for page in doc:
        mb = page.mediabox
        page.set_cropbox(pymupdf.Rect(mb.x0 + 36, mb.y0 + 36, mb.x1 - 36, mb.y1 - 36))
        print(page.number + 1, page.rect.width, page.rect.height)
    doc[0].set_cropbox(doc[0].mediabox)
    doc.save("sop_trimmed.pdf")
```

</details>

### Interview Questions

**Q: Explain how a PDF page's rotation, mediabox and cropbox interact with the coordinates PyMuPDF exposes.**
The mediabox defines the physical canvas and the cropbox a visible sub-rectangle, both stored in unrotated, bottom-left-origin PDF space. `/Rotate` tells viewers to spin the cropped view by a multiple of 90°. PyMuPDF presents `page.rect` as the rotated cropbox with a top-left origin, and every extraction and annotation API speaks that space; `set_cropbox` and `set_mediabox` however take unrotated coordinates. `rotation_matrix` and `derotation_matrix` convert between the two, and `transformation_matrix` handles the y-flip. Placing a stamp correctly on a rotated, cropped scan means computing it in `page.rect` space and passing `rotate=page.rotation` to text calls.

**Q: What is the difference between `set_rotation` and physically rotating page content?**
`set_rotation` writes a `/Rotate` value and costs nothing; viewers rotate at display time, text extraction still works, and it is fully reversible. Physically rotating means transforming the content stream with a `cm` operator or re-drawing the page into a new one with `show_pdf_page(rotate=...)`, which produces a page whose mediabox actually has the new dimensions. The physical route is needed when downstream tools ignore `/Rotate`, for example some print RIPs and older image converters, or when you must merge with pages of a fixed orientation. I use `set_rotation` by default and physical rotation only when a consumer proves it cannot cope.

**Q: How would you normalise a bundle of mixed A4, Letter and landscape scans to portrait Letter?**
Create a new document and, for each source page, add a Letter page and call `show_pdf_page` with a margin rectangle, `keep_proportion=True` and `rotate=-page.rotation` so landscape scans are turned upright if the client wants that, or left landscape and scaled if they do not. The source page becomes a Form XObject, so vector quality is preserved and fonts are carried over. Afterwards I rebuild the outline with page offsets, save with `garbage=3` to merge duplicated resources, and spot-check by rendering a few pages, because `show_pdf_page` silently scales tiny if the source has a huge mediabox with a small cropbox.

# LEVEL: Expert

## OCR with Tesseract integration

A scanned PDF is a stack of images: `get_text()` returns nothing and `search_for()` finds nothing. Since version **1.19.0** PyMuPDF can call Tesseract directly, because MuPDF links against the Tesseract library. That gives you two abilities: extract text from images with position information, and produce a searchable PDF by writing an invisible text layer over the scan.

### Prerequisites

1. Install Tesseract (`apt install tesseract-ocr` on Debian/Ubuntu, `brew install tesseract` on macOS, the UB Mannheim installer on Windows).
2. Point PyMuPDF at the language data: set the `TESSDATA_PREFIX` environment variable to the folder containing `eng.traineddata`, or pass `tessdata=` to the OCR calls.

```bash
export TESSDATA_PREFIX=/usr/share/tesseract-ocr/5/tessdata
python -c "import pymupdf; print(pymupdf.TESSDATA_PREFIX)"
```

### OCR a page: `get_textpage_ocr`

```python
import pymupdf

doc = pymupdf.open("scanned_manual.pdf")
page = doc[0]
tp = page.get_textpage_ocr(language="eng", dpi=300, full=True)
text = page.get_text("text", textpage=tp)
words = page.get_text("words", textpage=tp)
hits = page.search_for("Termination", textpage=tp)
print(len(text), "chars,", len(words), "words,", len(hits), "hits")
```

`get_textpage_ocr(flags=3, language="eng", dpi=72, full=False, tessdata=None)` returns a `TextPage` that every extraction and search method accepts through `textpage=`. Parameters:

| Parameter | Meaning |
|---|---|
| `full=False` | OCR only the **images** on the page, keep existing real text (best for mixed pages) |
| `full=True` | render the whole page at `dpi` and OCR everything |
| `dpi` | render resolution when `full=True`; 300 is the sweet spot for Tesseract |
| `language` | Tesseract language code(s), e.g. `"eng+urd"` for English and Urdu |

Because the result is a normal `TextPage`, `find_tables` can also work on OCR output: `page.find_tables(strategy="text")` does not accept a textpage, but you can cluster the `"words"` yourself.

### Making a searchable PDF

The second route works on `Pixmap` objects and produces a **PDF with an invisible text layer**:

```python
doc = pymupdf.open("scanned_manual.pdf")
out = pymupdf.open()
for page in doc:
    pix = page.get_pixmap(dpi=300, colorspace=pymupdf.csGRAY)
    pdf_bytes = pix.pdfocr_tobytes(language="eng", compress=True)
    ocr_page = pymupdf.open("pdf", pdf_bytes)
    out.insert_pdf(ocr_page)
out.save("searchable_manual.pdf", garbage=3, deflate=True)
```

`pix.pdfocr_save(filename, compress=True, language="eng", tessdata=None)` writes directly to a file; `pdfocr_tobytes` returns the bytes of a one-page PDF. The image is embedded and Tesseract's text is drawn in render mode 3 (invisible), so copy, search and highlight all work while the page still looks like the scan.

### Choosing between the two routes

| Need | Use |
|---|---|
| Extract text or search a scan in memory | `get_textpage_ocr` |
| Deliver a searchable PDF to a client | `pdfocr_save` / `pdfocr_tobytes` |
| Mixed pages: real text plus a scanned signature block | `get_textpage_ocr(full=False)` |
| Highest accuracy with layout analysis and de-skew | pre-process with OpenCV, then either route, or use OCRmyPDF |

### Improving accuracy

- Render at **300 dpi**; 150 dpi loses small text, 600 dpi is slower for no gain on office scans.
- Use grayscale (`csGRAY`); colour adds nothing for text and triples the pixel data.
- De-skew tilted scans before OCR (OpenCV `minAreaRect` on the text mask) because Tesseract's accuracy drops steeply beyond 2°.
- Pass the right `language`; `eng` on an Urdu form yields garbage.
- Detect which pages actually need OCR: `if not page.get_text().strip() and page.get_images()`.

### Verifying OCR quality automatically

```python
import re
words = [w[4] for w in page.get_text("words", textpage=tp)]
alpha = [w for w in words if re.fullmatch(r"[A-Za-z]{2,}", w)]
ratio = len(alpha) / max(1, len(words))
print(f"{ratio:.0%} clean words")   # below ~70% usually means a bad scan or wrong language
```

> **Warning:** OCR output is a guess. Never redact based on OCR alone; a mis-read digit means an SSN survives. For redaction of scans, redact the **image region** found by OCR bboxes with a generous margin, then verify visually.

### Try It Yourself

```python
import pymupdf, os, pathlib

os.environ.setdefault("TESSDATA_PREFIX", "/usr/share/tesseract-ocr/5/tessdata")
src = "scanned_manual.pdf"
out = pymupdf.open()
with pymupdf.open(src) as doc:
    for page in doc:
        if page.get_text().strip():                 # already has text: keep as is
            out.insert_pdf(doc, from_page=page.number, to_page=page.number)
            continue
        pix = page.get_pixmap(dpi=300, colorspace=pymupdf.csGRAY)
        one = pymupdf.open("pdf", pix.pdfocr_tobytes(language="eng"))
        out.insert_pdf(one); one.close()
        print(f"page {page.number + 1}: OCR'd ({pix.width}x{pix.height})")
out.save("searchable_manual.pdf", garbage=3, deflate=True)
with pymupdf.open("searchable_manual.pdf") as check:
    print("first 200 chars:", check[0].get_text()[:200].replace("\n", " "))
```

### Quiz

1. What must be configured before `get_textpage_ocr()` works?
- [ ] `pip install tesseract`
- [x] Tesseract installed and `TESSDATA_PREFIX` pointing to the traineddata folder
- [ ] A Pillow version above 10
> PyMuPDF calls the Tesseract library; it needs the language data files to be located.

2. What does `full=False` do in `get_textpage_ocr`?
- [x] OCRs only the images on the page and keeps existing real text
- [ ] Skips OCR entirely
- [ ] OCRs at half resolution
> Partial mode is ideal for pages that mix genuine text with scanned inserts.

3. Which method produces a searchable PDF with an invisible text layer?
- [ ] `page.get_text("ocr")`
- [x] `pix.pdfocr_save()` or `pix.pdfocr_tobytes()`
- [ ] `doc.ocr()`
> The Pixmap OCR methods embed the image plus Tesseract text in render mode 3.

### Exercises

1. **OCR-needed report** — For every PDF in a folder, count pages with real text versus image-only pages and print a summary.
<details><summary>Solution</summary>

```python
import pymupdf, pathlib

for pdf in pathlib.Path("inbox").glob("*.pdf"):
    with pymupdf.open(pdf) as doc:
        img_only = sum(1 for p in doc if not p.get_text().strip() and p.get_images())
        print(f"{pdf.name:30} pages={doc.page_count:4} need_ocr={img_only}")
```

</details>

2. **Search a scan** — Print each page of `scanned_manual.pdf` where the phrase "Effective Date" appears, using OCR text pages, plus the bbox of the first hit.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("scanned_manual.pdf") as doc:
    for page in doc:
        tp = page.get_textpage_ocr(language="eng", dpi=300, full=True)
        hits = page.search_for("Effective Date", textpage=tp)
        if hits:
            print(page.number + 1, hits[0])
```

</details>

### Interview Questions

**Q: How does PyMuPDF integrate OCR, and how does that differ from calling pytesseract yourself?**
MuPDF is compiled with Tesseract support, so `get_textpage_ocr` renders the page (or its images), runs Tesseract inside the C layer and returns a regular `TextPage` whose characters carry PDF-space bounding boxes, so `search_for`, `get_text("words")` and highlighting work unchanged. With pytesseract you render to an image, call the Tesseract binary, and get pixel coordinates that you must convert back to points and to the page's rotation yourself. The PyMuPDF route is faster and keeps geometry consistent; pytesseract exposes more Tesseract options such as page segmentation modes and custom configs, so I use it when I need `--psm 6` for a single dense table.

**Q: A client wants a 500-page scanned handbook made searchable. Walk through your pipeline.**
Detect image-only pages, because some scans include born-digital inserts that should not be re-OCR'd. Render those pages at 300 dpi grayscale, de-skew with OpenCV if the skew estimate exceeds one degree, and run `pdfocr_tobytes` in a multiprocessing pool with one worker per core, each opening its own document copy. Reassemble with `insert_pdf`, preserving the original page order and rotation, rebuild the outline if the source had one, and save with `garbage=3, deflate=True`. Then QA: a clean-word ratio per page flags bad OCR, and I sample ten pages by highlighting search hits to prove the layer aligns with the image.

**Q: What are the main causes of poor OCR results, and how do you diagnose them?**
Low resolution, skew, wrong language pack, heavy JPEG artefacts, coloured backgrounds, and multi-column layouts that Tesseract reads across columns. I diagnose by rendering the page at the OCR resolution and looking at it, because a human sees a 3° tilt or a faint fax immediately, then by computing the ratio of dictionary-looking words. Fixes are re-rendering at 300 dpi, de-skewing, binarising with an adaptive threshold, cropping to columns and OCRing each separately, and choosing the correct traineddata. When a scan is beyond repair I tell the client so rather than delivering a layer full of noise.

## Fonts: embedding, subsetting and Base14

Fonts decide whether your inserted text looks like part of the document or like a sticky note, whether Urdu renders as boxes, and whether a 5 MB handbook becomes 50 MB after ten merges. This chapter covers the built-in fonts, embedding your own, measuring text, and shrinking font data.

### The Base-14 fonts

PDF guarantees fourteen fonts every viewer can render without embedding: Helvetica, Times, Courier in four styles each, plus Symbol and ZapfDingbats. PyMuPDF refers to them by short names (`helv`, `hebo`, `tiro`, `cour`, `symb`, `zadb` and so on). They cover Latin text only. `insert_text(fontname="helv")` produces a tiny file, but it cannot draw "ا" or "€" reliably, and it will not match a client's brand font.

### Embedding a TrueType/OpenType font

```python
import pymupdf

doc = pymupdf.open("letterhead.pdf")
page = doc[0]
page.insert_font(fontname="brand", fontfile="fonts/Montserrat-SemiBold.ttf")
page.insert_text((72, 100), "Stewart Title Guaranty Company",
                 fontname="brand", fontsize=14)
```

`insert_font` registers the font file with the page under the reference name you choose; use that name in later `insert_text`/`insert_textbox` calls. The font is embedded once per document even if you call `insert_font` on several pages, because PyMuPDF checks for an existing embedding by file digest.

### The Font class and TextWriter

For precise typography, use `pymupdf.Font` and `pymupdf.TextWriter`:

```python
font = pymupdf.Font(fontfile="fonts/NotoNaskhArabic-Regular.ttf")
print(font.name, font.is_writable, font.glyph_count)
print(font.text_length("Lahore", fontsize=12))          # width in points
print(font.has_glyph(ord("ا")))                        # True

tw = pymupdf.TextWriter(page.rect)
tw.append((72, 140), "لاہور", font=font, fontsize=14, right_to_left=True)
tw.append((72, 160), "Lahore office", font=pymupdf.Font("helv"), fontsize=10)
tw.write_text(page, color=(0, 0, 0.4))
```

`TextWriter` collects text in different fonts and writes them in one content-stream update, supports right-to-left and vertical text, and returns the final bbox. `Font("helv")`, `Font("tiro")` and `Font("cjk")` give you built-ins; `Font("cjk")` is the Droid Sans Fallback font MuPDF ships for Chinese, Japanese and Korean.

### Extra fonts via pymupdf-fonts

`pip install pymupdf-fonts` adds open fonts such as Fira Mono (`figo`, `fibo`), Fira Sans, Noto Sans and Ubuntu, referenced by short names exactly like the Base-14 set. They are embedded automatically, so `insert_text(fontname="figo")` gives you a clean monospaced font for code samples in an SOP.

### Inspecting and extracting fonts

```python
for xref, ext, ftype, basefont, name, enc, ref in doc[0].get_fonts(full=True):
    embedded = ext != "n/a"
    print(f"{basefont:35} {ftype:8} embedded={embedded}")
info = doc.extract_font(xref)        # (basefont, ext, type, bytes)
open(f"extracted.{info[1]}", "wb").write(info[3])
```

`ext == "n/a"` means the font is referenced but not embedded, which is the cause of substitution in viewers. Extracting is legal only if the font licence allows it; brand fonts usually do not.

### Subsetting

Merging ten documents that each embed the full Calibri family produces a bloated file. `doc.subset_fonts()` (requires `pip install fonttools`) rewrites each embedded TrueType/OpenType font to contain only the glyphs actually used:

```python
doc = pymupdf.open("merged_handbook.pdf")
doc.subset_fonts(verbose=False)
doc.save("merged_handbook_subset.pdf", garbage=4, deflate=True)
```

On a 767-page handbook with six Word fonts this typically removes 60–80 percent of the font bytes. Fonts that are already subset (names prefixed like `ABCDEF+Calibri`) are left alone, and Type1/CFF fonts are not subset.

### Text that will not extract

If `get_text()` returns gibberish such as `(cid:23)` or wrong letters, the font lacks a **ToUnicode** CMap. The glyphs draw correctly but no library can map them back to characters. Options are OCR (`get_textpage_ocr(full=True)`), or asking the producer to regenerate the PDF with proper font encoding. Check with `page.get_text("rawdict")` and look for `chr(0xFFFD)` characters.

> **Interview note:** "Embedded" and "subset" are different. Embedded means the font program is inside the PDF; subset means only the used glyphs are included, indicated by the six-letter tag prefix. Print shops and PDF/A require embedding; subsetting is an optimisation, and a subset font cannot be used to add new characters later, which is why editing text in a subset font sometimes produces missing glyphs.

### Try It Yourself

```python
import pymupdf, os

with pymupdf.open("merged_handbook.pdf") as doc:
    seen = {}
    for page in doc:
        for xref, ext, ftype, basefont, name, enc, ref in page.get_fonts(full=True):
            seen.setdefault(basefont, (ftype, ext != "n/a", "+" in basefont))
    print(f"{'font':40} {'type':10} embedded subset")
    for bf, (ft, emb, sub) in sorted(seen.items()):
        print(f"{bf:40} {ft:10} {emb!s:8} {sub}")
    before = os.path.getsize("merged_handbook.pdf")
    doc.subset_fonts()
    doc.save("merged_handbook_subset.pdf", garbage=4, deflate=True)
after = os.path.getsize("merged_handbook_subset.pdf")
print(f"{before/1e6:.1f} MB -> {after/1e6:.1f} MB")
```

### Quiz

1. Which of these can NOT render Arabic text?
- [x] `fontname="helv"`
- [ ] `pymupdf.Font(fontfile="NotoNaskhArabic-Regular.ttf")`
- [ ] `TextWriter` with an embedded Noto font
> Base-14 Helvetica covers Latin glyphs only; you need an embedded font with Arabic glyphs.

2. What does a six-letter prefix like `ABCDEF+Calibri` indicate?
- [ ] The font is corrupt
- [x] The font is a subset containing only the glyphs used
- [ ] The font is not embedded
> Subset fonts carry a random tag prefix by convention.

3. What extra package does `doc.subset_fonts()` need?
- [ ] Pillow
- [x] fontTools
- [ ] pymupdf-fonts
> Subsetting is delegated to the fontTools library.

### Exercises

1. **Missing-embedding audit** — Print every font across a document that is referenced but not embedded, so a print-ready cover can be fixed before it goes to press.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("cover.pdf") as doc:
    missing = set()
    for page in doc:
        for xref, ext, ftype, basefont, *_ in page.get_fonts(full=True):
            if ext == "n/a" and basefont.split("+")[-1] not in
               ("Helvetica", "Times-Roman", "Courier", "Symbol", "ZapfDingbats"):
                missing.add(basefont)
    print("not embedded:", sorted(missing) or "none")
```

</details>

2. **Bilingual stamp** — Write "Approved / منظور شدہ" on page 1 using an Urdu-capable font with `TextWriter`.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("sop.pdf") as doc:
    page = doc[0]
    urdu = pymupdf.Font(fontfile="fonts/NotoNastaliqUrdu-Regular.ttf")
    tw = pymupdf.TextWriter(page.rect)
    tw.append((72, 60), "Approved / ", font=pymupdf.Font("hebo"), fontsize=12)
    w = pymupdf.Font("hebo").text_length("Approved / ", fontsize=12)
    tw.append((72 + w, 60), "منظور شدہ", font=urdu, fontsize=12, right_to_left=True)
    tw.write_text(page, color=(0, 0.5, 0))
    doc.save("sop_bilingual.pdf")
```

</details>

### Interview Questions

**Q: What are the Base-14 fonts and why do they still matter?**
They are the fourteen fonts the PDF specification requires every conforming reader to supply: Helvetica, Times and Courier in regular, bold, italic and bold-italic, plus Symbol and ZapfDingbats. Text set in them needs no embedded font program, so files stay small and appear identical everywhere, which is why Bates numbers, page stamps and quick annotations use `helv` or `cour`. Their limits are the WinAnsi character set, so no Urdu, Arabic or CJK, and no brand consistency, and PDF/A forbids relying on them unembedded, so for archival or branded deliverables I embed a real font.

**Q: How does font subsetting reduce file size, and what is the risk?**
A full TrueType font like Noto Sans can be several megabytes because it carries thousands of glyphs; a document uses perhaps two hundred. Subsetting rewrites the font program to keep only used glyphs and their metrics, marking it with a tag prefix. PyMuPDF's `subset_fonts()` does this with fontTools and then rewrites references so the page looks identical. The risk is that later edits need a glyph that is no longer present, producing a missing-glyph box, so you subset as the last step before delivery, and you keep the un-subset master for future revisions.

**Q: Text extraction returns garbage from a PDF that displays perfectly. What is happening and what can you do?**
The font is embedded with a custom encoding and no ToUnicode CMap, so glyph IDs cannot be mapped back to Unicode; viewers render glyph outlines fine but extraction sees meaningless codes. Sometimes the map exists but is wrong, producing shifted letters. Options in order of preference: obtain a regenerated PDF from the source application with standard encoding, build a manual mapping table if the font is consistent and the job is one-off, or OCR the rendered page with `get_textpage_ocr(full=True)`. I also check `get_fonts()` for Type3 fonts, which are drawn from procedures and often extract poorly.

## Optimising and garbage collection

Clients notice file size before anything else: a 90 MB handbook bounces from email, a portal rejects uploads over 25 MB, and print bureaus complain about slow RIPs. PyMuPDF gives you several levers, and knowing which one applies to a given file is the skill.

### Diagnose first

```python
import pymupdf, collections

doc = pymupdf.open("handbook.pdf")
sizes = collections.Counter()
for xref in range(1, doc.xref_length()):
    if doc.xref_is_stream(xref):
        obj = doc.xref_object(xref)
        kind = "image" if "/Image" in obj else "font" if "/FontFile" in obj else \
               "content" if "/Length" in obj and "/Subtype" not in obj else "other"
        sizes[kind] += len(doc.xref_stream_raw(xref))
for k, v in sizes.most_common():
    print(f"{k:8} {v/1e6:7.1f} MB")
```

`xref_length()` is the number of objects, `xref_is_stream` tells you whether an object carries binary data, `xref_object` returns its dictionary as text and `xref_stream_raw` returns the compressed bytes. In most bloated files, images dominate; in merged Word exports, fonts do.

### Lever 1: save options

```python
doc.save("out.pdf", garbage=4, deflate=True, deflate_images=True, deflate_fonts=True,
         clean=True, use_objstms=1)
```

- `garbage=4` removes unreferenced objects, compacts the xref, merges duplicates and checks streams.
- `deflate=True` compresses uncompressed streams; images stored as raw bitmaps drop sharply.
- `use_objstms=1` packs small objects into object streams, a modest saving on files with thousands of objects.
- `clean=True` normalises content streams, useful after heavy annotation editing.

`doc.ez_save()` bundles `garbage=3, deflate=True, use_objstms=1` and is the right default.

### Lever 2: recompress images

Word and scanners embed 300–600 dpi photographs that are displayed at a fraction of that. Since **1.24.11** PyMuPDF can rewrite them in one call:

```python
doc.rewrite_images(dpi_threshold=200, dpi_target=150, quality=75,
                   lossy=True, lossless=True, bitonal=True, color=True, gray=True)
doc.save("handbook_light.pdf", garbage=4, deflate=True)
```

Images above 200 dpi are resampled to 150 dpi and lossy ones re-encoded as JPEG at quality 75. For manual control iterate `page.get_images(full=True)`, render each with `pymupdf.Pixmap(doc, xref)`, shrink through Pillow, and replace with `page.replace_image(xref, stream=new_bytes)`; `page.delete_image(xref)` removes one entirely.

### Lever 3: fonts

Covered in the previous chapter: `doc.subset_fonts()` then `garbage=4` to merge duplicate font objects created by repeated merges.

### Lever 4: remove what nobody needs

```python
doc.scrub(metadata=False, thumbnails=True, embedded_files=True, javascript=True,
          attached_files=True, reset_fields=False, xml_metadata=False)
```

Thumbnails (pre-rendered page previews), attachments and JavaScript are common leftovers. `doc.del_xml_metadata()` alone can save a megabyte in files that went through several Adobe products, each adding history to the XMP packet.

### Linearisation

`doc.save("web.pdf", linear=True)` arranges objects so the first page can be displayed while the rest downloads. It slightly increases size and is only useful for PDFs served over HTTP to a viewer that supports byte-range requests; do not linearise archival copies.

### Measuring

```python
import os
def report(before, after):
    b, a = os.path.getsize(before), os.path.getsize(after)
    print(f"{b/1e6:.2f} MB -> {a/1e6:.2f} MB ({100*(1-a/b):.0f}% smaller)")
```

Always compare page count, `get_text()` length on a sample page and a rendered pixel checksum before and after; an optimisation that silently drops a page or blurs a rate table is a defect.

| File type | First lever to pull | Typical result |
|---|---|---|
| Scanned handbook | `rewrite_images` to 150 dpi grayscale JPEG | 60–80% smaller |
| Merged Word exports | `subset_fonts` + `garbage=4` | 30–60% smaller |
| Adobe-edited with history | `del_xml_metadata`, `scrub`, full save | 10–30% smaller |
| Already optimised | nothing; `deflate` alone gains under 2% | stop |

> **Tip:** Garbage collection only helps when something is unreferenced. A file with one huge image that is genuinely used will not shrink with `garbage=4`; only image recompression helps, and that changes appearance, so get client sign-off for lossy changes.

### Try It Yourself

```python
import pymupdf, os, hashlib

src, dst = "handbook.pdf", "handbook_optimised.pdf"
with pymupdf.open(src) as doc:
    pages, sample_text = doc.page_count, doc[0].get_text()
    doc.subset_fonts()
    doc.rewrite_images(dpi_threshold=200, dpi_target=150, quality=75)
    doc.scrub(metadata=False, xml_metadata=False, thumbnails=True, javascript=True)
    doc.save(dst, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1)
with pymupdf.open(dst) as check:
    assert check.page_count == pages, "page count changed!"
    assert check[0].get_text() == sample_text, "text changed on page 1!"
b, a = os.path.getsize(src), os.path.getsize(dst)
print(f"{b/1e6:.2f} MB -> {a/1e6:.2f} MB ({100*(1-a/b):.0f}% smaller), pages={pages}")
```

### Quiz

1. Which save option merges duplicate objects created by repeated merges?
- [ ] `deflate=True`
- [x] `garbage=3` or higher
- [ ] `clean=True`
> Levels 3 and 4 de-duplicate identical objects such as fonts embedded many times.

2. What does `doc.rewrite_images(dpi_threshold=200, dpi_target=150)` do?
- [x] Resamples images above 200 dpi down to 150 dpi
- [ ] Deletes all images above 200 dpi
- [ ] Converts every image to PNG
> It re-encodes oversized images at the target resolution, usually the biggest single saving on scans.

3. When is `linear=True` worthwhile?
- [ ] For every archival copy
- [x] For PDFs served over HTTP to viewers that support byte-range requests
- [ ] To reduce file size
> Linearisation reorders objects for fast first-page display; it slightly increases size.

### Exercises

1. **Size profiler** — Print the ten largest stream objects in a PDF with their xref, type hint and size in KB.
<details><summary>Solution</summary>

```python
import pymupdf

with pymupdf.open("handbook.pdf") as doc:
    rows = []
    for xref in range(1, doc.xref_length()):
        if doc.xref_is_stream(xref):
            obj = doc.xref_object(xref)
            hint = "Image" if "/Image" in obj else "Font" if "/FontFile" in obj else "Stream"
            rows.append((len(doc.xref_stream_raw(xref)), xref, hint))
    for size, xref, hint in sorted(rows, reverse=True)[:10]:
        print(f"xref {xref:6} {hint:7} {size/1024:8.0f} KB")
```

</details>

2. **Under-25-MB enforcer** — Try progressively stronger settings (ez_save, then subset fonts, then images at 150 dpi, then 110 dpi) until the output is below 25 MB, and print which step succeeded.
<details><summary>Solution</summary>

```python
import pymupdf, os

LIMIT = 25 * 1024 * 1024
steps = [("ez_save", lambda d: None),
         ("subset fonts", lambda d: d.subset_fonts()),
         ("images 150dpi", lambda d: d.rewrite_images(dpi_threshold=180, dpi_target=150, quality=70)),
         ("images 110dpi", lambda d: d.rewrite_images(dpi_threshold=120, dpi_target=110, quality=60))]
for name, action in steps:
    with pymupdf.open("handbook.pdf") as doc:
        for _, a in steps[:steps.index((name, action)) + 1]:
            a(doc)
        doc.ez_save("handbook_small.pdf")
    size = os.path.getsize("handbook_small.pdf")
    print(f"{name:14} -> {size/1e6:.1f} MB")
    if size < LIMIT:
        break
```

</details>

### Interview Questions

**Q: A 767-page handbook exported from Word is 120 MB. How do you decide what to do?**
Profile before touching anything: iterate the xref table, sum stream sizes by type, and look at `get_images()` for resolution versus displayed size. Word exports usually have two problems, full font programs repeated per section and screenshots at 300+ dpi, so `subset_fonts()` and `rewrite_images(dpi_target=150)` fix most of it, followed by a `garbage=4, deflate=True` save. I verify the page count, sample text and a rendered checksum, and I keep lossy image changes behind client approval, because a downsampled rate table can become unreadable. On a real job this took 118 MB to 14 MB with no visible change.

**Q: Why might `garbage=4` produce no saving at all?**
Because garbage collection only removes objects nothing references and merges exact duplicates. A file with a single referenced 80 MB image, or images that are similar but not byte-identical, has nothing to collect. Likewise fonts that are already subset with different glyph sets are not duplicates. In those cases the levers are content-changing: recompressing or downsampling images, subsetting fonts, or removing attachments and thumbnails. Recognising which category a file falls in comes from profiling the streams, not from trying options at random.

**Q: What checks do you run after optimising a client deliverable?**
Structural: page count and outline entries unchanged, `is_form_pdf` field count unchanged, links still resolve. Content: `get_text()` on sampled pages is identical, and rendered pixmaps at 72 dpi have a small mean difference against the original, which catches a dropped image or a font substitution. Compliance: if the source claimed PDF/A, I confirm the XMP identification survived or explicitly tell the client the optimised copy is not PDF/A. Finally I open it in Acrobat and Chrome, because MuPDF being happy with a file does not guarantee every viewer is.

## Batch pipelines, performance and threading

The difference between a script and a pipeline is that a pipeline survives 5,000 files, a corrupt input at file 3,412, and a Monday-morning deadline. This chapter covers how PyMuPDF behaves under load, how to parallelise it correctly, and the habits that keep long runs stable.

### Where the time goes

| Operation | Typical cost per page |
|---|---|
| `open()` | milliseconds regardless of size; pages load lazily |
| `get_text("text")` | 1–5 ms |
| `get_text("dict")` | 5–20 ms |
| `get_pixmap(dpi=150)` | 20–80 ms |
| `get_pixmap(dpi=300)` | 80–300 ms |
| `find_tables()` | 20–200 ms depending on drawings |
| OCR at 300 dpi | 1–4 s |

Rendering and OCR dominate. Text extraction of a 767-page handbook takes about two seconds; rendering it at 300 dpi takes minutes; OCRing it takes half an hour on one core.

### Reuse TextPages

```python
tp = page.get_textpage()
text  = page.get_text("text", textpage=tp)
words = page.get_text("words", textpage=tp)
hits  = page.search_for("premium", textpage=tp)
```

Every `get_text`/`search_for` call rebuilds the text page unless you pass one in; for a dozen operations per page that is a 10x saving.

### Threads versus processes

PyMuPDF's documentation is explicit: **PyMuPDF is not thread-safe**. Even with recent versions that release the GIL around some MuPDF calls, sharing a `Document` between threads can crash the interpreter. The safe pattern is multiprocessing with one document per process:

```python
import pymupdf, multiprocessing as mp

def render_range(args):
    path, start, stop, dpi = args
    with pymupdf.open(path) as doc:              # each worker opens its own copy
        for pno in range(start, stop):
            doc[pno].get_pixmap(dpi=dpi).save(f"out/p{pno + 1:04}.png")
    return stop - start

if __name__ == "__main__":
    path = "handbook.pdf"
    n = pymupdf.open(path).page_count
    workers = mp.cpu_count()
    chunk = (n + workers - 1) // workers
    jobs = [(path, i, min(i + chunk, n), 150) for i in range(0, n, chunk)]
    with mp.Pool(workers) as pool:
        print(sum(pool.map(render_range, jobs)), "pages rendered")
```

Pass paths or bytes to workers, never `Document` or `Page` objects; they cannot be pickled. On Windows and macOS the `if __name__ == "__main__":` guard is mandatory because processes are spawned, not forked.

### Memory

MuPDF caches decoded images and fonts in a global store. Long runs over thousands of files can grow steadily:

```python
pymupdf.TOOLS.store_maxsize          # cache limit in bytes (default 256 MB)
pymupdf.TOOLS.store_shrink(100)      # release 100% of the cache now
pymupdf.TOOLS.store_size             # current usage
```

Call `store_shrink(100)` between documents in a long loop, close every document, and drop references to `Pixmap` objects promptly; a 300 dpi RGB Letter page is 25 MB uncompressed.

### Robust loop skeleton

```python
import pymupdf, pathlib, logging, time

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

def process(path: pathlib.Path) -> dict:
    t0 = time.perf_counter()
    with pymupdf.open(path) as doc:
        if doc.needs_pass:
            raise PermissionError("password protected")
        words = sum(len(p.get_text("words")) for p in doc)
        result = {"file": path.name, "pages": doc.page_count, "words": words}
    result["seconds"] = round(time.perf_counter() - t0, 2)
    return result

rows, failures = [], []
for pdf in sorted(pathlib.Path("inbox").glob("**/*.pdf")):
    try:
        rows.append(process(pdf))
    except Exception as e:                     # one bad file must not stop the run
        failures.append((pdf.name, repr(e)))
        logging.warning("skipped %s: %s", pdf.name, e)
    finally:
        pymupdf.TOOLS.store_shrink(100)
logging.info("done: %d ok, %d failed", len(rows), len(failures))
```

Write results incrementally (CSV append or SQLite) so a crash at file 3,412 does not lose the first 3,411.

### Quieting MuPDF warnings

Damaged files make MuPDF print warnings to stderr. Capture them instead:

```python
pymupdf.TOOLS.mupdf_display_errors(False)
doc = pymupdf.open("damaged.pdf")
warnings = pymupdf.TOOLS.mupdf_warnings()      # returns and clears the buffer
```

Log the warnings with the file name; "repaired xref" on a client upload is worth knowing before you promise a turnaround time.

### Opening from bytes for workers

When files live in S3 or a database, download once in the parent and pass bytes to workers; `pymupdf.open(stream=data, filetype="pdf")` costs nothing extra. Note that stream-opened documents cannot be saved incrementally.

> **Warning:** A `Page` object is only valid while its `Document` is open and unchanged. Storing pages in a list, then deleting or reordering pages, then using the stored objects leads to wrong pages or crashes. Re-index with `doc[n]` after any structural change.

### Try It Yourself

```python
import pymupdf, multiprocessing as mp, pathlib, time

def count_words(path):
    try:
        with pymupdf.open(path) as doc:
            return (pathlib.Path(path).name, doc.page_count,
                    sum(len(p.get_text("words")) for p in doc), None)
    except Exception as e:
        return (pathlib.Path(path).name, 0, 0, repr(e))

if __name__ == "__main__":
    files = [str(p) for p in pathlib.Path("inbox").glob("*.pdf")]
    t0 = time.perf_counter()
    with mp.Pool(mp.cpu_count()) as pool:
        results = pool.map(count_words, files, chunksize=4)
    ok = [r for r in results if r[3] is None]
    print(f"{len(ok)}/{len(results)} files, {sum(r[1] for r in ok)} pages, "
          f"{sum(r[2] for r in ok)} words in {time.perf_counter() - t0:.1f}s")
    for name, _, _, err in results:
        if err: print("FAILED", name, err)
```

### Quiz

1. What is the recommended way to parallelise PyMuPDF work?
- [ ] `threading.Thread` sharing one Document
- [x] `multiprocessing` with each worker opening its own Document
- [ ] `asyncio` with `await page.get_text()`
> PyMuPDF is not thread-safe; processes with independent documents are safe and scale across cores.

2. What does `pymupdf.TOOLS.store_shrink(100)` do?
- [x] Frees MuPDF's internal cache of decoded images and fonts
- [ ] Reduces the file size by 100 KB
- [ ] Shrinks all images to 100 dpi
> It releases the given percentage of the global resource store, useful between documents in long runs.

3. Why can a stored `Page` object become invalid?
- [ ] Pages expire after 60 seconds
- [x] Structural changes (delete/select/insert) or closing the document invalidate it
- [ ] Only pixmaps are persistent
> Page objects are views into the document; re-fetch them with `doc[n]` after edits.

### Exercises

1. **Resumable extractor** — Extract text from every PDF in a folder to `.txt`, skipping files whose `.txt` already exists and is newer than the PDF.
<details><summary>Solution</summary>

```python
import pymupdf, pathlib

for pdf in pathlib.Path("inbox").glob("*.pdf"):
    txt = pdf.with_suffix(".txt")
    if txt.exists() and txt.stat().st_mtime >= pdf.stat().st_mtime:
        continue
    try:
        with pymupdf.open(pdf) as doc:
            txt.write_text("\f".join(p.get_text(sort=True) for p in doc), encoding="utf-8")
        print("done", pdf.name)
    except Exception as e:
        print("FAILED", pdf.name, e)
    finally:
        pymupdf.TOOLS.store_shrink(100)
```

</details>

2. **Parallel thumbnails** — Render page 1 of every PDF at 48 dpi using a process pool and report the throughput in files per second.
<details><summary>Solution</summary>

```python
import pymupdf, multiprocessing as mp, pathlib, time

def thumb(path):
    p = pathlib.Path(path)
    with pymupdf.open(p) as doc:
        doc[0].get_pixmap(dpi=48).save(f"thumbs/{p.stem}.png")
    return 1

if __name__ == "__main__":
    pathlib.Path("thumbs").mkdir(exist_ok=True)
    files = [str(f) for f in pathlib.Path("inbox").glob("*.pdf")]
    t0 = time.perf_counter()
    with mp.Pool() as pool:
        n = sum(pool.map(thumb, files))
    print(f"{n} thumbnails, {n / (time.perf_counter() - t0):.1f} files/s")
```

</details>

### Interview Questions

**Q: Why is PyMuPDF not thread-safe, and what does that mean for a web service?**
MuPDF keeps global state, including the resource store and error stack, and its context objects are not designed for concurrent access from multiple threads; PyMuPDF's documentation states that only one thread should use it at a time. In a web service that means you do not share a `Document` between request threads and you avoid running two PyMuPDF operations concurrently in one process. The robust design is a worker pool of processes, for example Gunicorn with several sync workers or a Celery queue, each handling one PDF at a time, with results returned as bytes. This also isolates a MuPDF crash on a malformed file to one worker instead of the whole service.

**Q: How do you keep memory flat when processing tens of thousands of PDFs?**
Open each document in a `with` block so it closes deterministically, avoid keeping `Pixmap` or `Page` objects beyond their use, and call `pymupdf.TOOLS.store_shrink(100)` after each file to clear MuPDF's decoded-resource cache. In multiprocessing, set `maxtasksperchild` on the pool so workers are recycled periodically, which releases any fragmentation. I monitor RSS in the log every hundred files; if it climbs, the usual culprit is a list accumulating extracted dicts, so I stream results to disk instead of holding them.

**Q: Describe how you would design a nightly pipeline that OCRs, splits and files incoming title documents.**
A watcher picks up files from the inbox and records them in SQLite with status "new". A pool of worker processes claims files one at a time: open with warnings captured, authenticate if needed, detect image-only pages, OCR those at 300 dpi, then split on order-number pages using `search_for` on the OCR text page, save each part with `ez_save`, and update the database with page counts and any warnings. Failures mark the row "failed" with the exception and move on, and the run is idempotent so it can be restarted. A morning report lists counts, failures and per-file timings; the whole thing is a few hundred lines of Python because PyMuPDF handles every step.

## PyMuPDF vs pikepdf vs pdfplumber and interview questions

No single library covers everything. Senior document engineers keep three in their toolbox and know exactly when to switch. This chapter compares them honestly and finishes with the questions interviewers actually ask about PyMuPDF.

### The three tools at a glance

| Aspect | PyMuPDF | pikepdf | pdfplumber |
|---|---|---|---|
| Engine | MuPDF (C) | qpdf (C++) | pdfminer.six (pure Python) + pypdfium2 for images |
| Rendering pages | Yes, fast | No | Via pypdfium2, for debugging |
| Text extraction | Yes, with layout modes | No (only raw content streams) | Yes, character-level |
| Table extraction | `find_tables` | No | Best-in-class, configurable |
| Editing content | insert text/images, annotations, redaction | Object-level surgery | No |
| Object model access | `xref_*` helpers | First-class, Pythonic | Read-only via pdfminer |
| Encryption/permissions | Basic (set on save) | Full (R2–R6, permissions) | Password to open |
| Repair damaged files | MuPDF's lenient parser | qpdf's robust recovery | Limited (`repair=True` via Ghostscript) |
| Speed | Fastest | Fast | Slowest |
| Licence | AGPL / commercial | MPL 2.0 | MIT |

### When to reach for which

- **PyMuPDF**: anything involving rendering, searching, highlighting, redaction, OCR, page assembly, fast bulk text extraction, or interactive form filling. It is the default.
- **pikepdf**: when you must manipulate the PDF object model directly, such as fixing a broken page tree, editing content streams, setting AES-256 encryption with specific permissions, adding XMP metadata correctly, or performing standards-critical work like PDF/A preparation. Also when the AGPL licence is a problem for a commercial product.
- **pdfplumber**: when a table refuses to extract cleanly and you need per-character geometry plus its visual debugger, or when you want pure-Python dependencies.

### They combine well

```python
import pymupdf, pikepdf, pdfplumber

# 1. pikepdf: repair and decrypt
with pikepdf.open("vendor_rates.pdf", password="abc123") as pdf:
    pdf.save("rates_clean.pdf")

# 2. pdfplumber: extract a stubborn table
with pdfplumber.open("rates_clean.pdf") as pdf:
    rows = pdf.pages[2].extract_table({"vertical_strategy": "text", "horizontal_strategy": "lines"})

# 3. PyMuPDF: highlight every rate that changed and render a proof
with pymupdf.open("rates_clean.pdf") as doc:
    for r in doc[2].search_for("SUPERSEDED"):
        doc[2].add_highlight_annot(r)
    doc[2].get_pixmap(dpi=120).save("proof.png")
    doc.save("rates_marked.pdf")
```

### The licence question

PyMuPDF and MuPDF are AGPL-3.0, with a commercial licence from Artifex. AGPL means that if you distribute software built on PyMuPDF, or run it as a network service, you must release your source under AGPL or buy the commercial licence. Internal scripts and freelance deliverables where you hand over the PDFs, not the code, are fine. Interviewers at product companies ask this to see whether you think about compliance.

### Common interview topics

1. Coordinates: top-left origin in PyMuPDF versus bottom-left in raw PDF; points, not pixels.
2. Why extracted text is out of order or missing spaces, and how `sort=True`, `"words"` and OCR help.
3. Redaction versus black boxes.
4. Annotation appearance streams and why `update()` exists.
5. Incremental saves, garbage collection levels and what `ez_save` does.
6. Thread safety and multiprocessing.
7. `insert_pdf` versus `show_pdf_page` versus `select`.
8. Forms: fields versus widgets, `on_state()`, baking.
9. Fonts: Base-14, embedding, subsetting, ToUnicode.
10. How `find_tables` works and when pdfplumber is better.

> **Interview note:** When asked "which PDF library do you use?", the strong answer names the task first: "PyMuPDF for rendering, extraction and edits, pikepdf when I need the object model or encryption, pdfplumber for hard tables, and I have used pypdf where licensing ruled out AGPL." Then give one concrete example from your own work with numbers.

### Try It Yourself

```python
import pymupdf, time, pathlib

path = "rate_schedule.pdf"
t0 = time.perf_counter()
with pymupdf.open(path) as doc:
    text_len = sum(len(p.get_text()) for p in doc)
    tables = sum(len(p.find_tables().tables) for p in doc)
    fonts = {f[3] for p in doc for f in p.get_fonts()}
    images = sum(len(p.get_images()) for p in doc)
    forms = doc.is_form_pdf
    toc = len(doc.get_toc())
elapsed = time.perf_counter() - t0
print(f"""PyMuPDF profile of {pathlib.Path(path).name}
  characters : {text_len}
  tables     : {tables}
  fonts      : {len(fonts)} -> {sorted(fonts)[:5]}
  images     : {images}
  form fields: {forms}
  bookmarks  : {toc}
  time       : {elapsed:.2f}s""")
```

### Quiz

1. Which library exposes the PDF object model (dictionaries, arrays, streams) most directly?
- [ ] PyMuPDF
- [x] pikepdf
- [ ] pdfplumber
> pikepdf wraps qpdf and models every object as a Python type you can read and write.

2. Which library cannot render a page to an image on its own?
- [ ] PyMuPDF
- [x] pikepdf
- [ ] pdfplumber
> pikepdf has no rasteriser; pdfplumber delegates to pypdfium2 and PyMuPDF uses MuPDF.

3. What is the licensing implication of PyMuPDF?
- [x] AGPL-3.0, so distributing or hosting derived software requires open-sourcing or a commercial licence
- [ ] Public domain
- [ ] MIT, no obligations
> MuPDF and PyMuPDF are AGPL with a commercial option from Artifex.

### Exercises

1. **Library chooser** — For each task below write one line naming the library and the API you would use: (a) AES-256 encrypt with print-only permission, (b) extract a borderless table, (c) make a scan searchable, (d) add a "DRAFT" watermark.
<details><summary>Solution</summary>

```text
(a) pikepdf   - pdf.save(..., encryption=pikepdf.Encryption(owner=..., user=..., R=6,
               allow=pikepdf.Permissions(extract=False, modify_other=False, print_highres=True)))
(b) pdfplumber - page.extract_table({"vertical_strategy": "text", "horizontal_strategy": "text"})
(c) PyMuPDF   - pix.pdfocr_tobytes(language="eng") per page, reassembled with insert_pdf
(d) PyMuPDF   - page.insert_text(..., rotate=45, fontsize=60, color=(0.8,0.8,0.8)) or insert_textbox with overlay=False
```

</details>

2. **Timing comparison** — Time full-document text extraction with PyMuPDF and pdfplumber on the same file and print the ratio.
<details><summary>Solution</summary>

```python
import time, pymupdf, pdfplumber

path = "policy_manual.pdf"
t = time.perf_counter()
with pymupdf.open(path) as doc:
    a = "".join(p.get_text() for p in doc)
t_mu = time.perf_counter() - t
t = time.perf_counter()
with pdfplumber.open(path) as pdf:
    b = "".join((p.extract_text() or "") for p in pdf.pages)
t_pl = time.perf_counter() - t
print(f"PyMuPDF {t_mu:.2f}s, pdfplumber {t_pl:.2f}s, ratio {t_pl / t_mu:.1f}x")
```

</details>

### Interview Questions

**Q: Compare PyMuPDF, pikepdf and pdfplumber and say when you use each.**
PyMuPDF binds MuPDF and does rendering, extraction, search, annotation, redaction, OCR and page assembly at C speed, so it is my default for pipelines. pikepdf binds qpdf and exposes the raw object model with excellent encryption, metadata and repair support, so I use it for structural fixes, standards-correct XMP, permissions and anything a viewer's "file is damaged" complaint points at. pdfplumber sits on pdfminer and gives character-level geometry and the best table tooling with a visual debugger, so I prototype hard rate tables there. A real job often uses all three: pikepdf to decrypt and repair, pdfplumber to extract the table, PyMuPDF to highlight and render the proof.

**Q: What are the limitations of PyMuPDF that you have hit in practice?**
Thread safety, so parallelism means processes. The AGPL licence, which rules it out for some commercial products. Table detection that is fast but less tunable than pdfplumber. No first-class PDF/A conversion or validation, so I pair it with Ghostscript or veraPDF. Structural edits below the page level require the `xref_*` helpers and knowledge of PDF syntax, where pikepdf is more natural. And OCR depends on a Tesseract build being present, which complicates deployment on locked-down Windows machines. None of these stops me using it as the default, but I state them upfront so the team is not surprised.

**Q: How would you convince a team to adopt PyMuPDF for a document pipeline?**
With a benchmark and a risk review rather than opinion. I would take a representative sample, say 200 title documents, and measure extraction time, rendering time and failure count against pypdf and pdfplumber; in my experience PyMuPDF extracts text ten to twenty times faster than pdfminer-based tools and renders where the others cannot. Then I address risk: licensing (AGPL or the commercial licence budget), thread-safety design, and a fallback plan for files MuPDF cannot open. Finally I show a working prototype of the hardest step, usually redaction or OCR, because one demo of `apply_redactions` followed by a verification scan is more persuasive than any feature list.

**Q: What would you check first when a PyMuPDF script produces a PDF that Acrobat refuses to open?**
Whether the file was saved after structural changes with a full save rather than incremental, whether the script wrote to the same path it was reading, and whether an exception interrupted the save leaving a truncated file. Then I open the output in PyMuPDF with `mupdf_warnings()` enabled and run `qpdf --check` or `pikepdf.Pdf.check()` to get the exact object that is malformed. Common culprits are TOC entries whose levels jump, links pointing outside the page range, and widgets with duplicate names; `set_toc` and `insert_link` validate some of this, but not all. A `clean=True, garbage=4` save often repairs the file, and if not, the qpdf output tells me what to fix.

