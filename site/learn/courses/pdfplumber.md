---
id: pdfplumber
title: pdfplumber
icon: 📊
track: Document Engineering
color: #1F618D
runner: none
tagline: Extract text and tables from PDFs with pixel-level control.
description: pdfplumber from opening a file to expert table extraction: characters, words, lines and rects, bounding boxes and cropping, extract_text with layout, extract_words and clustering, extract_table(s) strategies (lines vs text), tuning settings, visual debugging with .to_image(), handling scanned PDFs, and building reliable rate-matrix extraction pipelines.
---

# LEVEL: Beginner

## Installing and opening a PDF

pdfplumber is a pure-Python library built on top of **pdfminer.six**. Where pdfminer gives you a raw stream of layout objects, pdfplumber gives you a friendly `Page` object with `.chars`, `.lines`, `.rects`, `.extract_text()` and `.extract_table()`. Its speciality is *geometry*: every character knows exactly where it sits on the page, which is what makes it the right tool when a title-insurance rate card has to come out as a clean spreadsheet rather than a blob of text.

### Installing

pdfplumber has no compiled parts, so `pip` is all you need. It pulls in `pdfminer.six` for parsing, `pypdfium2` for rendering pages to images, and `Pillow` for drawing on those images.

```bash
python -m pip install --upgrade pdfplumber
python -c "import pdfplumber; print(pdfplumber.__version__)"
```

You should see a version such as `0.11.x`. Everything in this course targets the 0.10/0.11 API; where an older release behaved differently the chapter says so.

### Opening a file

`pdfplumber.open()` returns a `PDF` object. Use it as a context manager so the underlying file handle is closed even if your code raises.

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    print(len(pdf.pages))        # number of pages
    print(pdf.metadata)          # {'Producer': 'Microsoft: Print To PDF', 'CreationDate': ...}
    first = pdf.pages[0]
    print(first.page_number)     # 1  (pages are numbered from 1, the list is indexed from 0)
    print(first.width, first.height)  # 612.0 792.0 for US Letter
```

`pdf.pages` is a Python list, so `pdf.pages[0]` is the first page while `first.page_number` is `1`. Mixing those two up is the single most common beginner bug. Width and height are floats in **points** (1/72 inch); since pdfplumber 0.6.0 they are plain `float` objects rather than `Decimal`, so arithmetic just works.

### Opening from memory, with a password, or only some pages

| Call | What it does |
|---|---|
| `pdfplumber.open("f.pdf")` | open by path |
| `pdfplumber.open(io.BytesIO(data))` | open from bytes already in memory (an upload, an S3 object) |
| `pdfplumber.open("f.pdf", password="secret")` | open an encrypted file |
| `pdfplumber.open("f.pdf", pages=[1, 2, 3])` | only parse pages 1-3 (1-indexed); the rest are never loaded |
| `pdfplumber.open("f.pdf", repair=True)` | run Ghostscript first to fix a broken file (needs `gs` on PATH) |

```python
import io, pdfplumber, requests

data = requests.get("https://example.com/policy_manual.pdf").content
with pdfplumber.open(io.BytesIO(data), pages=[1]) as pdf:
    print(pdf.pages[0].extract_text()[:200])
```

The `pages=` argument matters for big files: a 767-page handbook takes tens of seconds to parse in full, but opening with `pages=[1]` returns in a fraction of a second because pdfminer only walks the objects you asked for.

### Metadata

`pdf.metadata` is a dictionary straight from the PDF's Info dictionary. Keys are whatever the producing application wrote, typically `Title`, `Author`, `Producer`, `Creator`, `CreationDate` and `ModDate`. Dates come as raw PDF strings such as `D:20260310142233+05'00'`, so parse them yourself if you need real datetimes.

> **Tip:** `pdf.metadata` values can be `bytes` for some producers. Call `str(v, "latin-1")` defensively, or pass `strict_metadata=False` (the default) so pdfplumber does not raise when the Info dictionary is malformed.

### Try It Yourself

```python
import pdfplumber, sys, pathlib

path = sys.argv[1] if len(sys.argv) > 1 else "wy_rate_card.pdf"
with pdfplumber.open(path) as pdf:
    print("File    :", pathlib.Path(path).name)
    print("Pages   :", len(pdf.pages))
    for k, v in pdf.metadata.items():
        print(f"  {k:<14}{v}")
    p = pdf.pages[0]
    print(f"Page 1  : {p.width:.0f} x {p.height:.0f} pt, rotation={p.rotation}")
    print("Chars   :", len(p.chars), "| lines:", len(p.lines), "| rects:", len(p.rects))
```

### Quiz

1. What does `pdf.pages[0].page_number` return?
- [ ] 0
- [x] 1
- [ ] The page label from the PDF
> The list is zero-indexed but `page_number` is the human page number, starting at 1.

2. Which argument makes pdfplumber parse only the pages you need?
- [ ] `limit=`
- [x] `pages=`
- [ ] `range=`
> `pages=[1, 2]` takes 1-indexed page numbers and skips parsing everything else.

3. What unit are `page.width` and `page.height` in?
- [ ] Pixels
- [ ] Millimetres
- [x] PDF points (1/72 inch)
> A US Letter page is 612 x 792 points; A4 is 595 x 842.

### Exercises

1. **Folder inventory** — Print `filename, pages, width x height` for every PDF in a folder, without crashing on files that cannot be opened.
<details><summary>Solution</summary>

```python
import pdfplumber, pathlib, sys

for f in sorted(pathlib.Path(sys.argv[1]).glob("*.pdf")):
    try:
        with pdfplumber.open(f, pages=[1]) as pdf:
            p = pdf.pages[0]
            print(f"{f.name}, {len(pdf.pages)} pages, {p.width:.0f}x{p.height:.0f}")
    except Exception as e:
        print(f"{f.name}, ERROR: {e}")
```

Note that `len(pdf.pages)` still reports the full page count even when `pages=[1]` is passed.

</details>

2. **Password check** — Open `secured.pdf` with the password `title2026` and print the first 100 characters of page 1.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("secured.pdf", password="title2026") as pdf:
    print(pdf.pages[0].extract_text()[:100])
```

</details>

### Interview Questions

**Q: What is pdfplumber and how does it relate to pdfminer.six?**
pdfplumber is a layer on top of pdfminer.six. pdfminer does the hard work of parsing the PDF content stream into layout objects (characters, lines, rectangles, images); pdfplumber wraps each page in a `Page` object that exposes those objects as plain dictionaries with top-left-origin coordinates, adds cropping and filtering, and implements its own word grouping and table-finding algorithms. Because it is pure Python it is slower than PyMuPDF, but it gives far more control over how characters become words and words become table cells, which is exactly what you need for rate matrices and production reports where every cell must land in the right column.

**Q: Why open a PDF with `pages=[...]` instead of slicing `pdf.pages` afterwards?**
Because `pdf.pages` is built eagerly enough that pdfminer has to walk the page tree, and each `Page` parses its content stream when you first touch `.chars` or `.extract_text()`. Passing `pages=[1, 2]` means the other pages are never instantiated at all, which on a 700-page handbook turns a 40-second open into under a second. Slicing afterwards still avoids parsing the content of unused pages, but the `pages=` argument is the cleaner contract and reads as documentation of intent.

**Q: How do you handle a PDF that arrives as bytes from an upload rather than a file on disk?**
Wrap the bytes in `io.BytesIO` and pass that to `pdfplumber.open()`; it accepts any file-like object with `read()` and `seek()`. That avoids writing temp files inside a web request handler, which matters for permissions and cleanup. The trade-off is memory: the entire PDF lives in RAM, so for very large scanned files I stream to disk and open by path instead.

## Page objects: chars, lines, rects and curves

A pdfplumber `Page` is a container of **objects**. Each object is an ordinary Python `dict`, so there are no special classes to learn: you print it, index it and filter it like any other dictionary. The four you will use constantly are `chars`, `lines`, `rects` and `curves`; `images` and `annots` round out the set.

### The coordinate system

PDF itself measures from the **bottom-left** corner. pdfplumber keeps those values (`y0`, `y1`) but adds `top` and `bottom`, measured from the **top-left**, because that is how humans and screens think. Almost every pdfplumber method (cropping, table bboxes, drawing) uses the `(x0, top, x1, bottom)` form.

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    c = page.chars[0]
    print(c["text"], c["fontname"], c["size"])
    print("x0 =", c["x0"], "x1 =", c["x1"])
    print("top =", c["top"], "bottom =", c["bottom"])   # from top of page
    print("y0 =", c["y0"], "y1 =", c["y1"])             # from bottom of page
    print("doctop =", c["doctop"])                      # from top of the whole document
```

`doctop` is `top` plus the heights of every previous page, so it increases across the whole file and is handy for sorting objects document-wide.

### What each char dictionary contains

| Key | Meaning |
|---|---|
| `text` | the character itself (one Unicode string, may be more than one code point for ligatures) |
| `fontname` | e.g. `ABCDEE+Calibri-Bold`; the six letters before `+` mark an embedded subset |
| `size` | font size in points |
| `x0, x1, top, bottom` | bounding box |
| `width, height` | derived from the box |
| `upright` | `True` for normal horizontal text, `False` for rotated glyphs |
| `matrix` | the 6-number text matrix, useful for rotation angle |
| `stroking_color, non_stroking_color` | fill and outline colour tuples |
| `object_type` | always `"char"` |
| `page_number` | 1-indexed page it came from |

### Lines, rects and curves

Vector drawing objects share the same box keys plus a few of their own. A ruled table is usually made of `rect` objects (thin filled rectangles) or `line` objects; that distinction decides which table strategy will work later, so get in the habit of checking counts first.

```python
with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    print(len(page.lines), "lines")
    print(len(page.rects), "rects")
    print(len(page.curves), "curves")
    r = page.rects[0]
    print(r["x0"], r["top"], r["x1"], r["bottom"], r["fill"], r["stroke"], r["linewidth"])
    ln = page.lines[0]
    print(ln["pts"])   # [(x, y), (x, y)] endpoints
```

A Word-generated rate card ("Microsoft: Print To PDF") almost always draws its grid as `rect`s of height 0.5 to 1 pt. A LaTeX or ReportLab document draws real `line`s. A scanned page has neither, only one large `image`.

### The `objects` dictionary and `images`

`page.objects` groups everything by type, which is convenient for a quick census:

```python
with pdfplumber.open("policy_manual.pdf") as pdf:
    for page in pdf.pages[:3]:
        counts = {k: len(v) for k, v in page.objects.items()}
        print(page.page_number, counts)
    img = pdf.pages[0].images[0] if pdf.pages[0].images else None
    if img:
        print(img["srcsize"], img["width"], img["height"], img["name"])
```

`srcsize` is the pixel size of the embedded bitmap; `width`/`height` are the size it is drawn at on the page. A full-page image with zero chars is your signal that the page is a scan.

> **Warning:** `page.chars` can contain duplicates. Some producers "fake bold" by drawing a character twice with a tiny offset. `page.dedupe_chars(tolerance=1)` returns a copy of the page with those duplicates removed, and you should call it before extracting text from anything printed by an old Crystal Reports or mainframe system.

### Try It Yourself

```python
import pdfplumber
from collections import Counter

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    print({k: len(v) for k, v in page.objects.items()})

    fonts = Counter((c["fontname"], round(c["size"], 1)) for c in page.chars)
    for (font, size), n in fonts.most_common(5):
        print(f"{n:5d} chars  {font:<30} {size} pt")

    # thin rects are usually table rules
    rules = [r for r in page.rects if r["height"] < 2 or r["width"] < 2]
    print(len(rules), "rule-like rects")
```

### Quiz

1. Which pair of keys is measured from the top of the page?
- [x] `top` and `bottom`
- [ ] `y0` and `y1`
- [ ] `x0` and `x1`
> PDF's native origin is bottom-left (`y0`/`y1`); pdfplumber adds `top`/`bottom` for a top-left origin.

2. What does `page.dedupe_chars()` remove?
- [ ] Characters outside the page box
- [x] Overlapping duplicate characters used for fake bold
- [ ] Whitespace characters
> Producers sometimes draw a glyph twice, offset by a fraction of a point; dedupe collapses them.

3. A page has 0 chars and 1 image covering the whole page. What is it?
- [x] A scanned page
- [ ] An encrypted page
- [ ] A blank page
> No text objects and a page-sized bitmap means the text exists only as pixels.

### Exercises

1. **Bounding box of all text** — Compute the smallest `(x0, top, x1, bottom)` box that contains every char on page 1.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    chars = pdf.pages[0].chars
    bbox = (min(c["x0"] for c in chars), min(c["top"] for c in chars),
            max(c["x1"] for c in chars), max(c["bottom"] for c in chars))
    print(bbox)
```

</details>

2. **Horizontal vs vertical rules** — Count how many `rect`s on the page are horizontal rules (wide and thin) versus vertical rules (tall and thin).
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    rects = pdf.pages[0].rects
    horiz = sum(1 for r in rects if r["height"] <= 2 and r["width"] > 10)
    vert = sum(1 for r in rects if r["width"] <= 2 and r["height"] > 10)
    print("horizontal:", horiz, "vertical:", vert)
```

</details>

### Interview Questions

**Q: Explain `top` versus `y0` in pdfplumber and why both exist.**
PDF's coordinate space has its origin at the bottom-left of the page, so pdfminer reports `y0` (bottom edge) and `y1` (top edge) growing upward. pdfplumber preserves those but adds `top = page.height - y1` and `bottom = page.height - y0` so that objects can be sorted and cropped the way a screen or spreadsheet is read, top to bottom. All pdfplumber bounding boxes use `(x0, top, x1, bottom)`. Knowing this prevents the classic bug where someone crops with `y0`/`y1` and gets the mirror image of the region they wanted.

**Q: How would you tell whether a table on a page is "ruled" before choosing an extraction approach?**
Count `page.lines` and `page.rects` and look at their shapes. If there are dozens of thin rects or lines whose lengths match the table width and height, the table has drawn borders and the default `lines` strategy will work. If those counts are near zero but `page.chars` is large, the table is whitespace-aligned and needs the `text` strategy or explicit lines. I also render `page.to_image().draw_rects(page.rects)` to confirm, because some producers draw borders as very thin filled rects that are invisible at a glance but present in the data.

**Q: What is `doctop` for?**
`doctop` is the object's `top` plus the cumulative height of all previous pages, so it is monotonic across the whole document. It lets you sort or cluster objects from several pages into a single sequence, for example to stitch a table that continues across a page break, without writing page-aware comparison code. Within a single page it equals `top` offset by a constant.

## extract_text() and layout mode

`page.extract_text()` is the method everyone calls first. It groups the page's chars into lines, joins the lines with newlines, and returns a single string. Under the hood it is `extract_words()` plus line clustering, so the same tolerance settings apply.

### The plain call

```python
import pdfplumber

with pdfplumber.open("weekly_status.pdf") as pdf:
    text = pdf.pages[0].extract_text()
    print(text[:400])
```

Typical output for a status report header:

```text
Stewart Title Production Support - Weekly Status
Week ending 13 Mar 2026
State Files Opened Files Closed Exceptions
WY 412 398 7
TX 1,904 1,877 21
```

Notice that the table came out as space-separated columns. That is fine for reading but useless for parsing, because `Files Opened` also contains a space. Text extraction gives you *words in reading order*; tables need the table methods in later chapters.

### Tolerances

Two arguments control grouping. `x_tolerance` (default `3`) is the maximum horizontal gap, in points, between two chars for them to be in the same word. `y_tolerance` (default `3`) is the maximum vertical difference between chars for them to be on the same line.

```python
page.extract_text(x_tolerance=1)        # tighter: splits "1,904" and "1,877" only if gap > 1pt
page.extract_text(x_tolerance=5)        # looser: may glue "WY412" together
page.extract_text(y_tolerance=1)        # superscripts and footnote markers become their own lines
```

Narrow monospaced fonts may need `x_tolerance=1.5`; wide tracking (letter-spaced headings) may need `x_tolerance=6` or more, otherwise every letter becomes its own word.

### Layout mode

Since pdfplumber 0.6.0, `extract_text(layout=True)` returns text padded with spaces and blank lines so that the string *looks* like the page. It maps the page onto a character grid using `x_density` (points per character, default `7.25`) and `y_density` (points per line, default `13`).

```python
with pdfplumber.open("weekly_status.pdf") as pdf:
    print(pdf.pages[0].extract_text(layout=True, x_density=7.25, y_density=13))
```

```text
       Stewart Title Production Support - Weekly Status
                 Week ending 13 Mar 2026

  State        Files Opened     Files Closed     Exceptions
  WY                412              398                7
  TX                1,904            1,877             21
```

Layout mode is excellent for two things: eyeballing a page in a terminal, and feeding fixed-width text to a regex or to `pandas.read_fwf()`. It is also what you want when a client asks for a `.txt` export that "keeps the columns". Tune `x_density` downward (e.g. `5`) if columns are collapsing into each other and upward if the output is absurdly wide.

### Related methods

| Method | Returns | Use it when |
|---|---|---|
| `extract_text()` | one string | you want reading-order text |
| `extract_text_simple()` | one string | you want the fastest possible extraction with no clustering subtleties |
| `extract_text_lines()` | list of dicts (`text`, `x0`, `top`, `bottom`, `chars`) | you need each line *with* its coordinates |
| `extract_text(layout=True)` | one padded string | you need whitespace to mirror position |
| `extract_text(use_text_flow=True)` | one string | the PDF's own drawing order is more sensible than top-to-bottom sorting (multi-column) |

`extract_text_lines()` is underrated. It returns every line with its bounding box and the chars that made it, so you can find "the line that starts with `Total`" and then read the number to its right by position.

```python
with pdfplumber.open("weekly_status.pdf") as pdf:
    for line in pdf.pages[0].extract_text_lines():
        if line["text"].startswith("TX"):
            print(round(line["top"]), line["text"])
```

> **Tip:** `extract_text()` returns `None` on old versions and `""` on current ones when a page has no chars. Always treat a falsy result as "probably a scanned page" and branch to your OCR path (covered in the Advanced level).

### Try It Yourself

```python
import pdfplumber, re

with pdfplumber.open("weekly_status.pdf") as pdf:
    page = pdf.pages[0]

    plain = page.extract_text()
    print("--- plain ---")
    print(plain[:300])

    fixed = page.extract_text(layout=True, x_density=6)
    print("--- layout ---")
    print(fixed[:600])

    # pull "State  opened  closed  exceptions" rows out of the layout text
    row = re.compile(r"^\s*([A-Z]{2})\s+([\d,]+)\s+([\d,]+)\s+(\d+)\s*$", re.M)
    for st, opened, closed, exc in row.findall(fixed):
        print(st, int(opened.replace(",", "")), int(closed.replace(",", "")), int(exc))
```

### Quiz

1. What does `x_tolerance` control?
- [x] How far apart two chars can be and still be joined into one word
- [ ] How wide the page is
- [ ] How many spaces are inserted between columns
> It is the maximum horizontal gap in points between neighbouring chars of a word.

2. Which call makes the returned text mirror the page's whitespace?
- [ ] `extract_text(simple=False)`
- [x] `extract_text(layout=True)`
- [ ] `extract_text(fixed=True)`
> `layout=True` pads with spaces and newlines using `x_density` and `y_density`.

3. Which method gives you each line together with its coordinates?
- [ ] `extract_text()`
- [x] `extract_text_lines()`
- [ ] `extract_chars()`
> `extract_text_lines()` returns dicts with `text`, `x0`, `top`, `bottom` and `chars`.

### Exercises

1. **Find the total** — Using `extract_text_lines()`, print the line whose text begins with `Total` and the numeric value at the end of it.
<details><summary>Solution</summary>

```python
import pdfplumber, re

with pdfplumber.open("weekly_status.pdf") as pdf:
    for line in pdf.pages[0].extract_text_lines():
        if line["text"].lower().startswith("total"):
            m = re.search(r"([\d,]+)\s*$", line["text"])
            print(line["text"], "->", int(m.group(1).replace(",", "")) if m else None)
```

</details>

2. **Dump every page to a text file** — Write `report.txt` that contains each page's layout-mode text separated by a line of 80 `=` characters.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("weekly_status.pdf") as pdf, open("report.txt", "w", encoding="utf-8") as out:
    for page in pdf.pages:
        out.write(page.extract_text(layout=True) or "")
        out.write("\n" + "=" * 80 + "\n")
```

</details>

### Interview Questions

**Q: A client says the extracted text has words glued together, like "FilesOpened". What do you change?**
Lower `x_tolerance`. The default of 3 points joins any chars whose gap is under 3 pt; condensed fonts or tight kerning make the real inter-word gap smaller than that. I would print a few chars' `x1` and the next char's `x0` to measure the actual gap, then set `x_tolerance` just under it, typically 1 to 1.5. If the opposite happens, letter-spaced headings splitting into single letters, I raise it or use `extract_words(extra_attrs=["size"])` and handle headings separately.

**Q: When is `layout=True` the right choice and what are its limits?**
It is right when downstream code needs position encoded as whitespace: fixed-width parsing with `read_fwf`, regexes across columns, or a plain-text deliverable that must "look like the PDF". Its limits are that it is an approximation on a character grid, so proportional fonts can shift a column by a character or two between rows, and very wide pages produce huge strings. For anything that must be reliably tabular I prefer `extract_words()` with explicit column boundaries or the table finder, and keep layout mode for inspection.

**Q: What is the difference between `extract_text()` and `extract_text(use_text_flow=True)`?**
By default pdfplumber sorts chars top-to-bottom then left-to-right, which is correct for single-column pages but interleaves the columns of a two-column layout. `use_text_flow=True` keeps the order in which the PDF's content stream drew the characters, which for most well-formed documents follows the logical reading order the author intended. It is not guaranteed, since some generators draw text in arbitrary order, so I test both on a sample page and pick whichever produces sentences that read correctly.

## Words and extract_words()

`extract_words()` is the workhorse beneath `extract_text()`. It returns a list of word dictionaries, each with its text and bounding box, and it is the method you reach for whenever "where is this word?" matters: locating a label, reading the value to its right, or building your own column detection.

### Basic usage

```python
import pdfplumber

with pdfplumber.open("weekly_status.pdf") as pdf:
    words = pdf.pages[0].extract_words()
    print(len(words))
    for w in words[:5]:
        print(w["text"], round(w["x0"], 1), round(w["top"], 1), round(w["x1"], 1), round(w["bottom"], 1))
```

Each dictionary has `text`, `x0`, `x1`, `top`, `bottom`, `upright` and `direction`. Words are sorted top-to-bottom then left-to-right by default, matching `extract_text()`.

### How chars become words

The algorithm walks the chars, groups them into lines using `y_tolerance`, then splits each line into words wherever the horizontal gap between consecutive chars exceeds `x_tolerance`. A few options change that behaviour:

| Argument | Default | Effect |
|---|---|---|
| `x_tolerance` | `3` | maximum gap inside a word |
| `y_tolerance` | `3` | maximum vertical offset inside a line |
| `keep_blank_chars` | `False` | `True` keeps literal space chars, so "Files Opened" becomes one word if the space is a real glyph |
| `split_at_punctuation` | `False` | `True` (or a string of characters) splits at punctuation, so `WY-2026` becomes three words |
| `extra_attrs` | `None` | list of char keys such as `["fontname", "size"]`; chars with different values never share a word |
| `use_text_flow` | `False` | keep content-stream order instead of sorting |
| `return_chars` | `False` | attach the constituent chars to each word |
| `line_dir`, `char_dir` | `"ttb"`, `"ltr"` | reading direction (0.11.0+; older versions used `horizontal_ltr`/`vertical_ttb`) |

`extra_attrs` is the trick for headings and bold labels: with `extra_attrs=["fontname", "size"]` a bold "Total" next to a regular "412" will never be merged, and each word carries those attributes so you can filter on them.

```python
words = page.extract_words(extra_attrs=["fontname", "size"])
bold = [w for w in words if "Bold" in w["fontname"]]
print([w["text"] for w in bold])
```

### Finding a label and reading the value beside it

Position-based lookup is the reliable way to pull a single number off a form-like page such as a closing statement or a policy schedule.

```python
def value_right_of(page, label, max_dx=200):
    words = page.extract_words()
    for i, w in enumerate(words):
        if w["text"] == label:
            same_line = [v for v in words
                         if abs(v["top"] - w["top"]) < 3 and w["x1"] < v["x0"] < w["x1"] + max_dx]
            return " ".join(v["text"] for v in same_line)
    return None

with pdfplumber.open("policy_schedule.pdf") as pdf:
    print(value_right_of(pdf.pages[0], "Premium:"))   # e.g. "$1,254.00"
```

### Clustering words into rows and columns

`pdfplumber.utils.cluster_objects()` groups any list of dicts by a key within a tolerance. Cluster by `top` to get rows, by `x0` to get columns. This is the foundation of a hand-rolled table extractor when the built-in finder fails.

```python
from pdfplumber.utils import cluster_objects

rows = cluster_objects(words, lambda w: w["top"], tolerance=3)
for row in rows[:6]:
    print([w["text"] for w in sorted(row, key=lambda w: w["x0"])])
```

`cluster_objects` accepts either a callable or a key name (`"top"`) as its second argument in current versions.

### `page.search()` for regex with coordinates

Added in 0.7, `page.search()` runs a regular expression over the page's text and returns matches *with* their bounding boxes and chars, so you can find "the dollar amount after the word Premium" and know exactly where it is.

```python
hits = page.search(r"\$[\d,]+\.\d{2}", regex=True)
for h in hits:
    print(h["text"], round(h["x0"]), round(h["top"]))
```

> **Interview note:** Interviewers like to ask why you would use `extract_words()` instead of `extract_text().split()`. The answer is coordinates: once you have `x0`/`top` you can do column detection, label-value pairing and page-region filtering, none of which a flat string allows.

### Try It Yourself

```python
import pdfplumber
from pdfplumber.utils import cluster_objects

with pdfplumber.open("weekly_status.pdf") as pdf:
    page = pdf.pages[0]
    words = page.extract_words(x_tolerance=2, extra_attrs=["size"])

    # group into visual rows
    rows = cluster_objects(words, lambda w: w["top"], tolerance=3)
    print(len(rows), "rows")
    for row in rows:
        row = sorted(row, key=lambda w: w["x0"])
        print(f"{row[0]['top']:6.1f} | " + "  ".join(w["text"] for w in row))

    # find every dollar amount with its position
    for h in page.search(r"\$[\d,]+\.\d{2}"):
        print("amount", h["text"], "at x=", round(h["x0"]), "top=", round(h["top"]))
```

### Quiz

1. Which option prevents a bold heading from being merged with regular text on the same line?
- [ ] `keep_blank_chars=True`
- [x] `extra_attrs=["fontname"]`
- [ ] `use_text_flow=True`
> Chars whose `extra_attrs` values differ are never joined into one word.

2. What does `cluster_objects(words, lambda w: w["top"], tolerance=3)` produce?
- [x] Lists of words that share (within 3 pt) the same vertical position, i.e. rows
- [ ] Words sorted alphabetically
- [ ] A dictionary keyed by page number
> Clustering by `top` groups visual rows; clustering by `x0` would give columns.

3. Which method returns regex matches with bounding boxes?
- [ ] `page.find()`
- [x] `page.search()`
- [ ] `page.match()`
> `page.search(pattern)` returns dicts with `text`, `groups`, `x0`, `top`, `x1`, `bottom` and `chars`.

### Exercises

1. **Column detector** — From the words on page 1, cluster by `x0` with tolerance 5 and print the left edge and first word of each cluster that has at least 3 members.
<details><summary>Solution</summary>

```python
import pdfplumber
from pdfplumber.utils import cluster_objects

with pdfplumber.open("weekly_status.pdf") as pdf:
    words = pdf.pages[0].extract_words()
    cols = cluster_objects(words, lambda w: w["x0"], tolerance=5)
    for col in cols:
        if len(col) >= 3:
            print(round(col[0]["x0"], 1), col[0]["text"], f"({len(col)} words)")
```

</details>

2. **Key-value extractor** — Build a dict of `label -> value` for every word ending in `:` on the page, taking the rest of that visual line as the value.
<details><summary>Solution</summary>

```python
import pdfplumber
from pdfplumber.utils import cluster_objects

with pdfplumber.open("policy_schedule.pdf") as pdf:
    words = pdf.pages[0].extract_words()
    kv = {}
    for row in cluster_objects(words, lambda w: w["top"], tolerance=3):
        row = sorted(row, key=lambda w: w["x0"])
        for i, w in enumerate(row):
            if w["text"].endswith(":"):
                kv[w["text"][:-1]] = " ".join(v["text"] for v in row[i + 1:])
                break
    print(kv)
```

</details>

### Interview Questions

**Q: Walk me through how pdfplumber turns characters into words.**
It first sorts chars (or keeps content order with `use_text_flow`), then clusters them into lines: two chars are on the same line if their `top` values differ by no more than `y_tolerance`. Within a line it walks left to right and starts a new word whenever the gap between one char's `x1` and the next char's `x0` exceeds `x_tolerance`, or when `split_at_punctuation` says so, or when any `extra_attrs` differ. Each resulting word gets the union bounding box of its chars. Understanding this means you can predict failures: condensed fonts need a smaller `x_tolerance`, superscripts need a larger `y_tolerance`, and letter-spaced headings need a larger `x_tolerance` or separate handling.

**Q: How would you extract "the premium amount" from a one-page policy schedule whose layout varies slightly between underwriters?**
I would not rely on absolute coordinates. I would use `page.search(r"Premium")` or `extract_words()` to find the label, then collect words on the same line (within a few points of `top`) to the right of it, or if the value sits below the label, words whose `x0` is within the label's horizontal span and whose `top` is just below. That label-relative approach survives shifts in margins and font sizes. I would wrap it in a function with a fallback regex over the full text and log which path fired so QA can spot drift.

**Q: When would `keep_blank_chars=True` matter?**
Some PDFs, especially those from Word or from OCR engines, emit real space glyphs between words rather than relying on positioning. With the default `False`, those spaces are dropped and words are split by gap, which is usually what you want. With `True`, the space glyph is kept inside the word, so "Files Opened" stays as one token when the space is a glyph but the gap is small. It is useful for column headers that contain spaces, but it makes word boundaries depend on the producer, so I use it deliberately and only on known sources.

## Visual debugging with to_image()

The fastest way to understand why an extraction went wrong is to *look* at what pdfplumber sees. `page.to_image()` renders the page to a bitmap and returns a `PageImage` that you can draw objects onto, save, or display in a Jupyter notebook. Since 0.10.0 rendering uses **pypdfium2**, so there is no ImageMagick or Ghostscript to install.

### Rendering a page

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    im = page.to_image(resolution=150)   # default is 72 dpi; 150 is good for reading
    im.save("page1.png", format="PNG")
```

You can also pass `width=1200` or `height=` instead of `resolution`; pdfplumber computes the scale. In a notebook, simply putting `im` as the last expression in a cell displays it.

### Drawing objects

`PageImage` has drawing helpers that accept the same dictionaries the page gives you, so debugging is one line per question:

| Method | Draws |
|---|---|
| `im.draw_rects(objs, stroke="red", fill=(255,0,0,40), stroke_width=1)` | a box for each object (chars, words, rects, cells) |
| `im.draw_rect(bbox)` | one box from a `(x0, top, x1, bottom)` tuple or object |
| `im.draw_lines(objs)` | each `line` object using its `pts` |
| `im.draw_vline(x)` / `im.draw_hline(y)` | a full-height vertical / full-width horizontal guide |
| `im.draw_vlines([x...])` / `im.draw_hlines([y...])` | many guides at once |
| `im.draw_circles(points, radius=3)` | dots at `(x, y)` points or objects |
| `im.reset()` | discard drawings; `im.original` is the untouched PIL image |

```python
with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    im = page.to_image(resolution=120)
    im.draw_rects(page.extract_words(), stroke="blue", stroke_width=1)
    im.draw_rects(page.rects, stroke="red", fill=(255, 0, 0, 30))
    im.draw_lines(page.lines, stroke="green", stroke_width=2)
    im.save("debug_words_rects.png")
```

Open the PNG and you can immediately answer: are the words split where I expect? Are the table borders really rects? Is that "line" actually four tiny rects? Colours can be names, hex strings, or RGBA tuples; the alpha channel in a tuple makes fills translucent.

### Debugging the table finder

`im.debug_tablefinder(table_settings)` draws what the table algorithm found: the candidate edges, the intersection points, and the resulting cells. It is the single most useful call in this library when a table comes out with merged or missing columns.

```python
with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    im = page.to_image(resolution=120)
    im.debug_tablefinder({"vertical_strategy": "text", "horizontal_strategy": "lines"})
    im.save("debug_tables.png")
```

Edges show as thin coloured lines, intersections as dots, and cells as shaded boxes. If a column boundary is missing you will see two cells where you expected three, which tells you to adjust the strategy or supply an explicit line (Advanced level).

### Drawing guides to plan a crop

Before writing `page.crop((x0, top, x1, bottom))`, draw the guides so you can see the box against the content:

```python
im = page.to_image(resolution=100)
im.draw_hline(72)                      # 1 inch from top
im.draw_hline(page.height - 54)        # 0.75 inch from bottom
im.draw_vlines([40, 300, 420, 560], stroke="orange")
im.save("crop_plan.png")
```

Iterate on the numbers until the lines sit exactly on the column boundaries, then copy them into your crop or into `explicit_vertical_lines`.

> **Tip:** Keep `resolution` modest (100-150) while debugging. A 300 dpi render of a Letter page is 2550 x 3300 pixels, and drawing thousands of char boxes on it is slow and hard to read. Use 300 dpi only when the image is going to an OCR engine.

### Try It Yourself

```python
import pdfplumber

SETTINGS = {"vertical_strategy": "lines", "horizontal_strategy": "lines"}

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]

    im = page.to_image(resolution=120)
    im.draw_rects(page.extract_words(), stroke="blue")
    im.save("01_words.png")

    im.reset()
    im.draw_rects(page.rects, stroke="red", fill=(255, 0, 0, 40))
    im.draw_lines(page.lines, stroke="green", stroke_width=2)
    im.save("02_vectors.png")

    im.reset()
    im.debug_tablefinder(SETTINGS)
    im.save("03_tables.png")

    print("wrote 01_words.png, 02_vectors.png, 03_tables.png")
    print("tables found:", len(page.find_tables(SETTINGS)))
```

### Quiz

1. What does `page.to_image()` use to rasterise the page in pdfplumber 0.10 and later?
- [ ] ImageMagick via Wand
- [x] pypdfium2
- [ ] Ghostscript
> 0.10.0 replaced Wand/ImageMagick with pypdfium2, removing the system dependency.

2. Which call visualises the edges, intersections and cells the table algorithm detected?
- [ ] `im.draw_tables()`
- [x] `im.debug_tablefinder()`
- [ ] `page.show_tables()`
> `debug_tablefinder` accepts the same settings dict as `extract_table` and draws its intermediate results.

3. How do you get back to the clean render after drawing on a `PageImage`?
- [x] `im.reset()`
- [ ] `im.clear()`
- [ ] Re-open the PDF
> `reset()` restores the original bitmap; `im.original` also holds the untouched PIL image.

### Exercises

1. **Highlight large text** — Render page 1 and draw a box around every char with `size >= 14`, then save the image.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("policy_manual.pdf") as pdf:
    page = pdf.pages[0]
    big = [c for c in page.chars if c["size"] >= 14]
    im = page.to_image(resolution=120)
    im.draw_rects(big, stroke="purple", stroke_width=2)
    im.save("headings.png")
    print(len(big), "large chars boxed")
```

</details>

2. **Contact sheet** — Save a 60 dpi PNG for each of the first 10 pages, named `p01.png` to `p10.png`.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("policy_manual.pdf") as pdf:
    for page in pdf.pages[:10]:
        page.to_image(resolution=60).save(f"p{page.page_number:02d}.png")
```

</details>

### Interview Questions

**Q: How do you debug a table that extracts with the wrong number of columns?**
I render the page with `to_image()` and call `debug_tablefinder()` with the settings I am using. That shows me which edges were detected and where the cells were placed, so I can see whether a column border is missing (no vertical edge found), whether two columns were merged because the words are close, or whether a decorative rect was mistaken for a border. From there I either switch strategy for that axis, adjust `snap_tolerance`/`join_tolerance`, or add `explicit_vertical_lines` at the x positions I can read straight off the image. I keep those debug PNGs with the extraction script so a reviewer can see why the settings are what they are.

**Q: Why did pdfplumber switch from ImageMagick to pypdfium2 and what did it change for users?**
ImageMagick via Wand required a system install with the right policy file and Ghostscript underneath, which was a constant source of "it works on my machine" failures, especially on Windows and in Docker. pypdfium2 wheels bundle the PDFium renderer, so `pip install pdfplumber` is enough on every platform. The API stayed the same (`to_image`, `draw_*`, `save`), but rendering is faster and colour handling differs slightly, so images produced before and after 0.10.0 are not pixel-identical.

**Q: What resolution do you render at, and why?**
It depends on the consumer. For human debugging 100 to 150 dpi is plenty and keeps the PNG small. For OCR I render at 300 dpi because Tesseract's accuracy drops sharply below roughly 200 dpi for 10-point text. For thumbnails or contact sheets 50 to 72 dpi is fine. Note that drawing coordinates are automatically scaled, so you never convert points to pixels yourself regardless of resolution.

# LEVEL: Intermediate

## Cropping and bounding boxes

Most extraction bugs are really *scope* bugs: the running header gets mixed into the table, a footnote becomes a row, or two side-by-side tables are read as one. pdfplumber solves this with cropping. You give a page a bounding box and get back a new `Page`-like object that only contains the objects inside it, with every method (`extract_text`, `extract_words`, `extract_table`, `to_image`) still available.

### `crop()` versus `within_bbox()` versus `outside_bbox()`

All three take a `(x0, top, x1, bottom)` tuple in points.

| Method | Keeps an object if... | Then |
|---|---|---|
| `page.crop(bbox)` | it *intersects* the box | clips its coordinates to the box edges |
| `page.within_bbox(bbox)` | it is *entirely* inside the box | leaves it untouched |
| `page.outside_bbox(bbox)` | it is entirely outside the box | leaves it untouched |

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    body = page.crop((0, 72, page.width, page.height - 60))   # drop 1in header, 60pt footer
    print(len(page.chars), "->", len(body.chars))
    print(body.extract_text()[:200])
```

`crop` is the everyday choice. `within_bbox` is stricter and is better for tables, because a char that straddles the boundary would otherwise be clipped into a fragment that pollutes the first row. `outside_bbox` is the elegant way to *remove* a logo or a watermark region.

### Relative and strict cropping

Crops can be chained. By default the bbox is in page coordinates; pass `relative=True` to express it relative to the current crop's own top-left corner.

```python
right_half = page.crop((page.width / 2, 0, page.width, page.height))
first_inch = right_half.crop((0, 0, right_half.width, 72), relative=True)
```

`strict=True` (the default) raises a `ValueError` if the bbox is not fully inside the page. Set `strict=False` when you compute boxes from data that may run slightly past the edge, for example a table bbox from `find_tables()` plus a margin.

### Cropped pages keep their origin

A cropped page's `bbox` records where it came from, and its objects keep their *page* coordinates. So a word at `top=300` on the page is still at `top=300` after cropping. That is why relative bboxes need the `relative=True` flag: pdfplumber does not shift the coordinate system for you.

```python
tbl = page.within_bbox((36, 150, 576, 700))
print(tbl.bbox)              # (36, 150, 576, 700)
print(tbl.width, tbl.height) # 540 550
print(tbl.chars[0]["top"])   # >= 150, page coordinates
```

### `filter()`: crop by predicate instead of geometry

`page.filter(fn)` returns a page containing only objects for which `fn(obj)` is true. It is the way to strip watermarks by colour, ignore tiny fonts, or keep only bold chars.

```python
no_watermark = page.filter(lambda o: o.get("non_stroking_color") not in [(0.8, 0.8, 0.8)])
big_text = page.filter(lambda o: o["object_type"] != "char" or o["size"] >= 9)
print(big_text.extract_text())
```

Because the predicate sees every object type, remember to let non-char objects through (as the second example does) or your rects and lines vanish and the table finder loses its borders.

### A practical recipe: isolate each table region first

The most robust extraction pattern is *find the region, then extract inside it*. Use `find_tables()` to get the bboxes, pad them slightly, crop, and only then call `extract_table()` with tuned settings.

```python
with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    for t in page.find_tables():
        x0, top, x1, bottom = t.bbox
        region = page.within_bbox((x0 - 2, top - 2, x1 + 2, bottom + 2), strict=False)
        rows = region.extract_table()
        print(len(rows), "rows in table at", round(top))
```

> **Warning:** Never crop with `y0`/`y1`. Those keys count from the bottom of the page. A crop of `(0, y0, w, y1)` silently gives you the vertically mirrored region and, on a symmetric layout, the results look *almost* right, which is worse than an error.

### Try It Yourself

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    header = page.crop((0, 0, page.width, 72))
    footer = page.crop((0, page.height - 60, page.width, page.height))
    body = page.within_bbox((0, 72, page.width, page.height - 60))

    print("HEADER:", header.extract_text())
    print("FOOTER:", footer.extract_text())
    print("BODY chars:", len(body.chars))

    im = page.to_image(resolution=100)
    im.draw_hlines([72, page.height - 60], stroke="orange", stroke_width=2)
    for t in body.find_tables():
        im.draw_rect(t.bbox, stroke="red", stroke_width=2)
    im.save("crop_regions.png")
```

### Quiz

1. Which method keeps only objects that lie *completely* inside the box?
- [ ] `crop()`
- [x] `within_bbox()`
- [ ] `filter()`
> `crop()` keeps intersecting objects and clips them; `within_bbox()` requires full containment.

2. After `sub = page.crop((100, 100, 400, 400))`, what is the `top` of a char that was at `top=250` on the page?
- [x] 250
- [ ] 150
- [ ] 0
> Cropping does not shift coordinates; objects keep their page-space positions.

3. What does `strict=False` allow?
- [ ] Cropping by object type
- [x] A bbox that extends beyond the page edges
- [ ] Negative tolerances
> With `strict=True` (default) an out-of-page bbox raises `ValueError`.

### Exercises

1. **Strip running headers on every page** — Extract the text of each page with the top 60 pt and bottom 40 pt removed and count total words.
<details><summary>Solution</summary>

```python
import pdfplumber

total = 0
with pdfplumber.open("policy_manual.pdf") as pdf:
    for page in pdf.pages:
        body = page.crop((0, 60, page.width, page.height - 40))
        total += len(body.extract_words())
print("words in body regions:", total)
```

</details>

2. **Left and right columns** — Split a two-column page at its midpoint and print the first line of each column.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("newsletter.pdf") as pdf:
    page = pdf.pages[0]
    mid = page.width / 2
    left = page.crop((0, 0, mid, page.height))
    right = page.crop((mid, 0, page.width, page.height))
    print("L:", left.extract_text().splitlines()[0])
    print("R:", right.extract_text().splitlines()[0])
```

</details>

### Interview Questions

**Q: What is the difference between `crop` and `within_bbox`, and when does it matter?**
`crop` keeps every object that touches the box and clips its coordinates to the box, while `within_bbox` keeps only objects entirely inside and leaves them intact. It matters at boundaries: if your box cuts through a line of text, `crop` returns those chars clipped, which can create half-words and phantom rows, whereas `within_bbox` simply excludes them. For table regions I use `within_bbox` with a small padding so whole cells are either in or out; for "everything below the header" I use `crop` because a clean horizontal cut is what I want.

**Q: How do you remove a watermark or a "DRAFT" stamp before extracting text?**
Two approaches. If the stamp has its own region, `page.outside_bbox()` excludes it geometrically. If it overlaps the content, I use `page.filter()` with a predicate on a distinguishing attribute: watermarks are usually a distinct light grey `non_stroking_color`, a large `size`, a rotated `upright=False` orientation, or a separate `fontname`. I inspect a few chars to find the attribute, then filter on it while letting non-char objects through so the table borders survive.

**Q: A cropped page's `extract_table()` still returns a row from the header. Why?**
Most likely the crop used `crop()` and the header's bottom edge intersected the box, so its chars were clipped rather than excluded, or the `bottom` of the header text is a point or two lower than the visual baseline suggests because of descenders. I would draw the crop guides with `draw_hline`, look at the actual `bottom` values of the header chars, and either move the box down a few points or switch to `within_bbox`.

## extract_table() and extract_tables() defaults

pdfplumber's table finder is a geometry algorithm. It looks for **edges** (from lines, rect borders or word alignments), finds where they **intersect**, builds **cells** from the intersections, groups cells into **tables**, and finally reads the chars inside each cell. `extract_table()` and `extract_tables()` run that whole pipeline with one call.

### The two methods

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    table = page.extract_table()          # the single largest table, as a list of rows
    tables = page.extract_tables()        # every table on the page, list of lists of rows
    print(len(table), "rows;", len(tables), "tables on the page")
    for row in table[:4]:
        print(row)
```

Sample output for a Wyoming owner's policy rate card:

```text
30 rows; 1 tables on the page
['Liability From', 'Liability To', "Owner's Premium", 'Loan Premium']
['$0', '$50,000', '$325.00', '$250.00']
['$50,001', '$100,000', '$425.00', '$325.00']
['$100,001', '$150,000', '$525.00', '$400.00']
```

Every row is a list of strings, and every cell that had no text is `None`, not `""`. `extract_table()` returns `None` if no table is found, so guard for it. "Largest" means the table with the most cells, not the biggest area.

### The `Table` objects underneath

`find_table()` and `find_tables()` return `Table` objects instead of rows, which is what you want when you also need geometry.

```python
with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    for t in page.find_tables():
        print("bbox:", t.bbox)
        print("rows:", len(t.rows), "cells:", len(t.cells))
        print("first row cells:", t.rows[0].cells)   # list of (x0, top, x1, bottom) or None
        data = t.extract()                            # same rows as extract_table()
```

`t.cells` is a flat list of cell bboxes; `t.rows` groups them; `t.extract()` reads the text. Because you have the bboxes you can draw them, crop to them, or check that every row has the same number of cells before trusting the output.

### What the defaults assume

The default `table_settings` are tuned for **ruled** tables:

```python
{
    "vertical_strategy": "lines",
    "horizontal_strategy": "lines",
    "snap_tolerance": 3,
    "join_tolerance": 3,
    "edge_min_length": 3,
    "min_words_vertical": 3,
    "min_words_horizontal": 1,
    "intersection_tolerance": 3,
    "text_tolerance": 3,
}
```

`lines` means "use the page's `line` objects and the edges of `rect` objects". So a Word-generated rate card with visible grid lines works out of the box. A borderless table, or one with only horizontal rules, yields either `None` or a single giant cell, and that is your cue to change strategies (next chapter).

### Reading the output correctly

Cells inherit the text-grouping behaviour of `extract_words`, so multi-line cells contain `\n`. Merged header cells appear once and the covered positions are `None`. Numbers keep their currency symbols and thousands separators. None of that is a bug; cleaning belongs in pandas, two chapters from now.

```python
rows = page.extract_table()
header = [h.replace("\n", " ") if h else "" for h in rows[0]]
print(header)   # ['Liability From', 'Liability To', "Owner's Premium", 'Loan Premium']
```

> **Tip:** Call `page.extract_tables()` and check `len()` even when you expect one table. Rate cards frequently have a small "simultaneous issue" or "endorsements" table under the main matrix, and `extract_table()` will silently pick whichever has more cells.

### Try It Yourself

```python
import pdfplumber, json

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    tables = page.find_tables()
    print(f"{len(tables)} table(s) found")
    for i, t in enumerate(tables, 1):
        rows = t.extract()
        widths = {len(r) for r in rows}
        print(f"table {i}: bbox={tuple(round(v) for v in t.bbox)} rows={len(rows)} col-widths={widths}")
        print("  header:", rows[0])
        print("  last  :", rows[-1])
    with open("tables_page1.json", "w") as f:
        json.dump([t.extract() for t in tables], f, indent=1)
```

### Quiz

1. What does `extract_table()` return when the page has two tables?
- [ ] Both tables concatenated
- [x] The table with the most cells
- [ ] An error
> It picks the largest by cell count; use `extract_tables()` to get all of them.

2. What value does an empty cell have in the returned rows?
- [ ] `""`
- [x] `None`
- [ ] `0`
> Empty cells are `None`; clean them to `""` or `NaN` in pandas.

3. Which default strategy do both axes use?
- [x] `lines`
- [ ] `text`
- [ ] `explicit`
> The defaults assume ruled tables; borderless tables need `text` or explicit lines.

### Exercises

1. **Row-width audit** — For every table on every page, print any row whose length differs from the header row's length.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    for page in pdf.pages:
        for ti, rows in enumerate(page.extract_tables(), 1):
            n = len(rows[0])
            for ri, r in enumerate(rows):
                if len(r) != n:
                    print(f"page {page.page_number} table {ti} row {ri}: {len(r)} cells, expected {n}")
```

</details>

2. **Draw the cells** — Render page 1 and outline every cell of every detected table in red, then save `cells.png`.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    im = page.to_image(resolution=120)
    for t in page.find_tables():
        im.draw_rects(t.cells, stroke="red", stroke_width=1)
    im.save("cells.png")
```

</details>

### Interview Questions

**Q: Describe pdfplumber's table-finding algorithm at a high level.**
It has five stages. First it collects candidate edges: with the `lines` strategy these come from `line` objects and the four sides of each `rect`; with `text` they come from the left/right (or top/bottom) alignment of words. Edges are snapped together within `snap_tolerance` and joined end-to-end within `join_tolerance`, and any shorter than `edge_min_length` are dropped. Second it computes intersections between vertical and horizontal edges within `intersection_tolerance`. Third it builds the smallest rectangles bounded by four intersections, which are the cells. Fourth it groups touching cells into tables. Fifth it extracts the chars inside each cell using the `text_*` tolerances. Knowing the stages tells you which knob to turn when a result is wrong.

**Q: Why might `extract_table()` return `None` on a page that visibly contains a table?**
Because the default strategy needs drawn borders on both axes. If the table is borderless, or has only horizontal rules, there are no vertical edges, hence no intersections, hence no cells. Other causes are borders drawn as images rather than vectors, or edges shorter than `edge_min_length`, or a scanned page with no text at all. I confirm by checking `len(page.lines)`, `len(page.rects)` and `debug_tablefinder()`, then switch the failing axis to `text` or provide `explicit_vertical_lines`.

**Q: What is the difference between `find_tables()` and `extract_tables()`?**
`find_tables()` returns `Table` objects with `bbox`, `rows` and `cells`, without reading any text yet; `extract_tables()` calls `find_tables()` and then `.extract()` on each, returning plain lists of rows. Use `find_tables()` when you need geometry, for example to crop to the table, to validate that the cell grid is rectangular, to draw debug images, or to detect that a table continues to the next page by comparing its `bbox` with the page bottom.

## Table settings: lines versus text strategies

Every knob of the table finder lives in one dictionary, `table_settings`, passed to `extract_table()`, `extract_tables()`, `find_tables()` and `debug_tablefinder()`. The two most important keys are `vertical_strategy` and `horizontal_strategy`, and the secret to reliable extraction is that they are set *independently*: a table with horizontal rules and no vertical rules is solved by `horizontal_strategy="lines"` plus `vertical_strategy="text"`.

### The four strategies

| Value | Edges come from | Good for |
|---|---|---|
| `"lines"` | `line` objects plus `rect` borders | fully ruled grids (Word, Excel exports) |
| `"lines_strict"` | `line` objects only, ignoring rects | pages where filled rects (shading, highlights) confuse the finder |
| `"text"` | alignment of words: left/right edges for vertical, top/bottom for horizontal | borderless tables with consistent columns |
| `"explicit"` | only the coordinates you pass in `explicit_vertical_lines` / `explicit_horizontal_lines` | when you know the geometry exactly |

```python
import pdfplumber

settings = {
    "vertical_strategy": "text",
    "horizontal_strategy": "lines",
}
with pdfplumber.open("tx_rate_card.pdf") as pdf:
    rows = pdf.pages[0].extract_table(settings)
    for r in rows[:3]:
        print(r)
```

### How the text strategy decides where a column is

With `vertical_strategy="text"`, pdfplumber extracts words, then looks for x positions where at least `min_words_vertical` (default `3`) words share a left edge (or right edge) within `snap_x_tolerance`. Each such position becomes a vertical edge. Horizontal works the same way with `min_words_horizontal` (default `1`) words sharing a top or bottom.

That explains the two classic failures. Right-aligned numeric columns line up on their *right* edges, so the left-edge cluster is weak; pdfplumber considers both edges, but a column with only two rows never reaches `min_words_vertical=3` and disappears, merging into its neighbour. And a wide text column whose values start at slightly different x positions (because of a leading `$` on some rows) may produce *two* edges a few points apart, creating a phantom empty column. Both are fixed with tolerances or explicit lines.

### The tolerance keys

| Key | Default | Meaning |
|---|---|---|
| `snap_tolerance` (`snap_x_tolerance`, `snap_y_tolerance`) | 3 | edges within this distance are merged into one |
| `join_tolerance` (`join_x_`, `join_y_`) | 3 | collinear edge segments with a gap under this are joined |
| `edge_min_length` | 3 | edges shorter than this are discarded |
| `min_words_vertical` | 3 | words needed to form a text-derived vertical edge |
| `min_words_horizontal` | 1 | words needed to form a text-derived horizontal edge |
| `intersection_tolerance` (`_x_`, `_y_`) | 3 | how close a vertical and horizontal edge must come to count as crossing |
| `text_tolerance` (`text_x_tolerance`, `text_y_tolerance`) | 3 | passed to the word extractor when reading cell text |

Any key beginning with `text_` is forwarded to `extract_words`, so `"text_keep_blank_chars": True` or `"text_extra_attrs": ["size"]` are valid as well.

### A worked tuning session

A Texas rate card has horizontal rules between every row but no vertical rules, and the premium columns are right-aligned. First attempt:

```python
s1 = {"vertical_strategy": "text", "horizontal_strategy": "lines"}
rows = page.extract_table(s1)
print(rows[1])   # ['$0 $25,000', '$238.00 $189.00']  <- columns merged
```

Two columns merged because the gap between them is narrow and the left edges do not align (some values have five digits, some six). Raise `min_words_vertical` to require stronger evidence and reduce `snap_x_tolerance` so nearby edges stay separate:

```python
s2 = {"vertical_strategy": "text", "horizontal_strategy": "lines",
      "snap_x_tolerance": 1, "min_words_vertical": 8, "text_x_tolerance": 2}
rows = page.extract_table(s2)
print(rows[1])   # ['$0', '$25,000', '$238.00', '$189.00']
```

If the tuning still will not settle, read the column x positions off a debug image and switch that axis to `explicit` (Advanced level). Spend no more than fifteen minutes tuning before doing so; explicit lines are more robust anyway.

> **Interview note:** Be able to say *why* `text` fails on right-aligned numbers and short columns. It shows you understand the algorithm rather than having copied a settings dict from a forum.

### Try It Yourself

```python
import pdfplumber, itertools

CANDIDATES = [
    {"vertical_strategy": "lines", "horizontal_strategy": "lines"},
    {"vertical_strategy": "text",  "horizontal_strategy": "lines"},
    {"vertical_strategy": "text",  "horizontal_strategy": "text"},
    {"vertical_strategy": "text",  "horizontal_strategy": "text",
     "snap_x_tolerance": 1, "min_words_vertical": 6},
]

with pdfplumber.open("tx_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    for i, s in enumerate(CANDIDATES, 1):
        rows = page.extract_table(s)
        if not rows:
            print(f"#{i}: no table"); continue
        widths = sorted({len(r) for r in rows})
        print(f"#{i}: {len(rows)} rows, column counts {widths}, row 1 = {rows[1] if len(rows) > 1 else rows[0]}")
        page.to_image(resolution=100).debug_tablefinder(s).save(f"strategy_{i}.png")
```

### Quiz

1. A table has horizontal rules but no vertical rules. Which combination is the best starting point?
- [ ] `vertical="lines"`, `horizontal="text"`
- [x] `vertical="text"`, `horizontal="lines"`
- [ ] `vertical="lines"`, `horizontal="lines"`
> Use `lines` on the axis that has drawn rules and `text` on the axis that does not.

2. What does `min_words_vertical` control?
- [x] How many words must align to create a text-derived vertical edge
- [ ] The minimum number of columns
- [ ] The minimum word length
> Columns with fewer aligned words than this threshold are not detected.

3. Which strategy ignores `rect` objects and uses only `line` objects?
- [ ] `lines`
- [x] `lines_strict`
- [ ] `explicit`
> `lines_strict` is for pages where shaded rects would otherwise create false edges.

### Exercises

1. **Settings sweep** — Try `snap_x_tolerance` values 1, 2, 3, 5 with the text strategy and print the number of columns each produces.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("tx_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    for tol in (1, 2, 3, 5):
        s = {"vertical_strategy": "text", "horizontal_strategy": "lines", "snap_x_tolerance": tol}
        rows = page.extract_table(s) or []
        print(f"snap_x_tolerance={tol}: {len(rows[0]) if rows else 0} columns")
```

</details>

2. **Shaded-header table** — A table's header row has a grey fill rect that creates a false edge. Extract it with `lines_strict` and compare the column count to plain `lines`.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("shaded_header.pdf") as pdf:
    page = pdf.pages[0]
    for strat in ("lines", "lines_strict"):
        rows = page.extract_table({"vertical_strategy": strat, "horizontal_strategy": strat}) or []
        print(strat, "->", len(rows), "rows,", len(rows[0]) if rows else 0, "columns")
```

</details>

### Interview Questions

**Q: Explain how the `text` strategy detects columns and why it struggles with numeric columns.**
It clusters the left and right edges of extracted words along x and keeps any position where at least `min_words_vertical` words align within `snap_x_tolerance`. Numeric columns are usually right-aligned, so their left edges scatter as the number of digits changes; the right edges do align, and pdfplumber does consider them, but a mixed column (some values with `$`, some without, some with decimals) can produce several weak clusters instead of one strong edge. Short columns with only a couple of rows never reach the threshold at all. The fixes are tightening `snap_x_tolerance`, raising `min_words_vertical` so only real columns survive, or supplying explicit vertical lines.

**Q: When would you choose `lines_strict` over `lines`?**
When the page contains filled rectangles that are not table borders: zebra-striped rows, highlighted cells, a shaded header band, or a coloured background box behind the table. With `lines`, every edge of those rects becomes a candidate edge, which can insert phantom rows or columns exactly at the shading boundaries. `lines_strict` uses only genuine `line` objects, so the shading is ignored. The trade-off is that tables whose borders are drawn as thin rects, which Word does, will then have no edges at all, so I check `len(page.lines)` first.

**Q: How do you keep a settings dictionary maintainable across dozens of rate-card layouts?**
I store one settings dict per source layout in a small registry keyed by underwriter and state, alongside the debug PNG that justified it and a fixture PDF page. The extraction function looks up the layout, applies the settings, and asserts the expected column count. When a client changes their template the assertion fails loudly, and the fix is to re-tune one entry and regenerate one debug image rather than hunt through code. This is the same discipline as keeping rate-calculator formulas under version control.

## Cleaning extracted tables into pandas

`extract_table()` gives you lists of strings. Real work happens in pandas: typed columns, numeric premiums, filled-down merged cells, and a DataFrame you can validate and write to Excel. This chapter is the bridge, and every step here is one you will repeat on every rate card and production report you ever process.

### From rows to DataFrame

```python
import pdfplumber, pandas as pd

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    rows = pdf.pages[0].extract_table()

header = [h.replace("\n", " ").strip() if h else "" for h in rows[0]]
df = pd.DataFrame(rows[1:], columns=header)
print(df.head())
print(df.dtypes)      # every column is object (string)
```

The two immediate problems are visible: multi-line headers contain `\n`, and every column is `object`. Fix headers first, because you will refer to them by name in every later line.

### Normalising column names

```python
import re

def clean_name(s):
    s = (s or "").replace("\n", " ")
    s = re.sub(r"[^0-9a-zA-Z]+", "_", s).strip("_").lower()
    return s

df.columns = [clean_name(c) for c in df.columns]
print(list(df.columns))   # ['liability_from', 'liability_to', 'owner_s_premium', 'loan_premium']
```

Snake-case names survive round trips through Excel, SQL and Power BI without quoting.

### Money and numbers

Currency strings need the `$`, commas and occasional trailing `*` footnote markers removed before `to_numeric`. Do it with a regex so one function handles every money column.

```python
def money(series):
    cleaned = series.astype(str).str.replace(r"[^\d.\-]", "", regex=True)
    return pd.to_numeric(cleaned.replace("", pd.NA), errors="coerce")

for col in ["liability_from", "liability_to", "owner_s_premium", "loan_premium"]:
    df[col] = money(df[col])

print(df.dtypes)
print(df.describe())
```

`errors="coerce"` turns anything unparseable into `NaN` instead of raising, so a stray "N/A" or "Call for quote" cell does not stop the pipeline; you catch those in the validation step later.

### Empty cells, merged cells and fill-down

A rate matrix often prints the state or the policy type once and leaves the cells below blank (a visually merged cell). pdfplumber returns `None` for those, and `ffill()` restores the value on every row.

```python
df = df.replace({None: pd.NA, "": pd.NA})
df["state"] = df["state"].ffill()
df = df.dropna(how="all")                 # rows that were entirely empty (spacer rows)
df = df[df["liability_from"].notna()]     # drop subtotal / note rows without a range
df = df.reset_index(drop=True)
```

Be careful with the order: fill down *before* dropping rows, or the first row after a spacer loses its state.

### Footnotes and multi-line cells

Cells with wrapped text contain newlines. For descriptive columns, join them with a space; for cells where the wrap separates two values (a premium and a footnote marker), split them.

```python
df["notes"] = df["notes"].str.replace("\n", " ", regex=False).str.strip()
```

### A reusable function

```python
def table_to_frame(rows, money_cols=(), ffill_cols=()):
    header = [clean_name(h) for h in rows[0]]
    df = pd.DataFrame(rows[1:], columns=header).replace({None: pd.NA, "": pd.NA})
    for c in ffill_cols:
        df[c] = df[c].ffill()
    for c in money_cols:
        df[c] = money(df[c])
    return df.dropna(how="all").reset_index(drop=True)
```

| Step | Why |
|---|---|
| clean names | stable references, Excel/SQL safe |
| replace `None`/`""` with `NA` | one missing-value representation |
| fill down | restore visually merged cells |
| coerce money | numeric maths and validation |
| drop empty rows | spacer rows from the layout |

> **Warning:** `pd.to_numeric` on `"1,904"` fails without stripping the comma, and `"$325.00"` becomes `NaN` silently under `errors="coerce"`. Always print `df.isna().sum()` after conversion; a column that is 100% `NaN` means your regex did not match the format, not that the data is missing.

### Try It Yourself

```python
import pdfplumber, pandas as pd, re

def clean_name(s):
    return re.sub(r"[^0-9a-zA-Z]+", "_", (s or "").replace("\n", " ")).strip("_").lower()

def money(series):
    return pd.to_numeric(series.astype(str).str.replace(r"[^\d.\-]", "", regex=True)
                         .replace("", pd.NA), errors="coerce")

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    rows = pdf.pages[0].extract_table()

df = pd.DataFrame(rows[1:], columns=[clean_name(h) for h in rows[0]])
df = df.replace({None: pd.NA, "": pd.NA}).dropna(how="all")
for c in df.columns:
    if "premium" in c or "liability" in c:
        df[c] = money(df[c])
print(df.dtypes, "\n")
print(df.head(), "\n")
print("missing per column:\n", df.isna().sum())
df.to_csv("wy_rates_clean.csv", index=False)
```

### Quiz

1. Why does `pd.to_numeric(df["premium"])` fail on `"$325.00"`?
- [x] The `$` is not numeric; strip symbols first
- [ ] pandas cannot handle decimals
- [ ] The column must be renamed first
> Remove `$`, commas and stray characters with a regex before converting.

2. What does `ffill()` do for a visually merged "State" column?
- [ ] Deletes the empty rows
- [x] Copies the last non-missing value into the empty cells below it
- [ ] Sorts the column
> Forward fill restores the state on every row so each row is self-describing.

3. What is the risk of `errors="coerce"`?
- [ ] It raises on the first bad value
- [x] It silently turns unparseable values into `NaN`
- [ ] It converts everything to strings
> Always inspect `isna().sum()` after coercing so silent failures are caught.

### Exercises

1. **Range sanity** — After cleaning, add a column `width = liability_to - liability_from + 1` and print any row where the width is not positive.
<details><summary>Solution</summary>

```python
df["width"] = df["liability_to"] - df["liability_from"] + 1
bad = df[df["width"] <= 0]
print("bad ranges:", len(bad))
print(bad)
```

</details>

2. **Wide to long** — Convert the cleaned rate table so each row has `liability_from, liability_to, policy_type, premium` with `policy_type` being `owner` or `loan`.
<details><summary>Solution</summary>

```python
long = df.melt(id_vars=["liability_from", "liability_to"],
               value_vars=["owner_s_premium", "loan_premium"],
               var_name="policy_type", value_name="premium")
long["policy_type"] = long["policy_type"].str.replace("_s_premium", "").str.replace("_premium", "")
print(long.head())
```

</details>

### Interview Questions

**Q: Walk me through cleaning a pdfplumber table into an analysis-ready DataFrame.**
First I normalise headers: join wrapped lines, strip non-alphanumerics, snake_case. Then I build the DataFrame from `rows[1:]` and replace `None` and empty strings with `pd.NA` so there is one missing-value representation. I forward-fill columns that were visually merged, such as state or policy type, and only then drop fully empty spacer rows. Money and count columns go through a regex that strips everything except digits, dot and minus, then `pd.to_numeric(errors="coerce")`. Finally I print `isna().sum()` and `describe()` to catch a column that failed to parse. On a rate card the whole function is fifteen lines and I reuse it across every state.

**Q: A cleaned premium column shows all `NaN`. What happened?**
The conversion regex did not match the format, so every value was coerced to `NaN`. Typical causes: the cells contain a non-breaking space or a thin space between `$` and the digits, a Unicode minus sign, or the header row was not actually row 0 so the column contains labels rather than values. I look at `df[col].head().tolist()` with `repr()` to see the raw characters, then fix the regex or the header index. This is why coerced conversion must always be followed by a null check.

**Q: Why forward-fill before dropping empty rows rather than after?**
A spacer row between two states is entirely empty, so it is dropped by `dropna(how="all")`. If I drop it first, the next state's first row still has its own state value, so that particular case is fine, but a subtotal row that has text only in one column is *not* all-empty, survives the drop, and then receives a forward-filled state that it should not have. Filling first and then filtering on the presence of a required column (such as `liability_from`) is the deterministic order: every real row gets its state, and every non-data row is removed by a positive rule rather than by accident.

## Multi-page tables and repeated headers

Rate matrices rarely fit on one page. A Texas owner's rate schedule runs to four pages, each with the same header row, a running page header, and sometimes a "continued" note. The task is to extract the table from every page, drop the repeated headers, and produce one continuous DataFrame with the right number of rows.

### Extract page by page, then concatenate

```python
import pdfplumber, pandas as pd

frames = []
with pdfplumber.open("tx_rate_schedule.pdf") as pdf:
    for page in pdf.pages:
        body = page.crop((0, 60, page.width, page.height - 40))    # remove running header/footer
        rows = body.extract_table({"vertical_strategy": "text", "horizontal_strategy": "lines"})
        if not rows:
            continue
        frames.append(pd.DataFrame(rows))
raw = pd.concat(frames, ignore_index=True)
print(len(raw), "raw rows including repeated headers")
```

Using `pd.DataFrame(rows)` without a header at this stage keeps every row, including the repeated headers, so you can inspect and remove them deliberately.

### Detecting and dropping repeated headers

The safest rule is "a row equal to the first row is a header". Compare after normalising whitespace, because line wrapping can differ slightly between pages.

```python
def norm(row):
    return tuple((c or "").replace("\n", " ").strip().lower() for c in row)

header = norm(raw.iloc[0].tolist())
is_header = raw.apply(lambda r: norm(r.tolist()) == header, axis=1)
print("header rows found:", is_header.sum())
data = raw[~is_header].copy()
data.columns = [c.replace("\n", " ").strip() for c in raw.iloc[0].tolist()]
```

For a four-page schedule you expect `is_header.sum() == 4`. If it is 1, the later headers wrapped differently (perhaps "Owner's\nPremium" versus "Owner's Premium") and you should compare on a looser key such as the first cell only.

### Rows that split across a page break

A row whose description wraps can land with its first line at the bottom of page 2 and its second line at the top of page 3. The tell-tale sign is a row with an empty range column and text only in the description column. Merge it into the previous row:

```python
def merge_continuations(df, key="liability_from", text_col="notes"):
    out = []
    for _, r in df.iterrows():
        if (r[key] is None or str(r[key]).strip() == "") and out:
            out[-1][text_col] = (str(out[-1][text_col] or "") + " " + str(r[text_col] or "")).strip()
        else:
            out.append(r.to_dict())
    return pd.DataFrame(out)
```

### Cropping per page versus per table bbox

Fixed crops (`top=60`) work when every page has the same margins. When the header height varies, locate the table on each page with `find_tables()` and crop to its bbox instead:

```python
for page in pdf.pages:
    tables = page.find_tables({"vertical_strategy": "text", "horizontal_strategy": "lines"})
    if not tables:
        continue
    t = max(tables, key=lambda t: len(t.cells))
    rows = t.extract()
```

Choosing the largest table by cell count skips small side tables such as endorsement fees.

### Expected-count checks

Multi-page extraction is where rows go missing silently. Establish the expected count independently: count the rows on each page visually once, or count the horizontal rules, and assert against it.

```python
expected = 3346
assert len(data) == expected, f"got {len(data)} rows, expected {expected}"
```

| Symptom | Likely cause |
|---|---|
| a few rows short | last row on a page clipped by the bottom crop |
| a few rows extra | repeated headers or "continued" lines survived |
| one page missing entirely | `extract_table()` returned `None` because that page's layout differs |
| count right, values shifted | a wrapped row created a phantom row and pushed data down |

> **Tip:** Log `page.page_number` and `len(rows)` for every page. A per-page row histogram (`{1: 62, 2: 64, 3: 64, 4: 31}`) makes a clipped page obvious at a glance, and it is the first thing to paste into a bug report.

### Try It Yourself

```python
import pdfplumber, pandas as pd

SETTINGS = {"vertical_strategy": "text", "horizontal_strategy": "lines"}

def norm(row):
    return tuple((c or "").replace("\n", " ").strip().lower() for c in row)

frames, per_page = [], {}
with pdfplumber.open("tx_rate_schedule.pdf") as pdf:
    for page in pdf.pages:
        tables = page.find_tables(SETTINGS)
        if not tables:
            per_page[page.page_number] = 0
            continue
        rows = max(tables, key=lambda t: len(t.cells)).extract()
        per_page[page.page_number] = len(rows)
        frames.append(pd.DataFrame(rows))

raw = pd.concat(frames, ignore_index=True)
header = norm(raw.iloc[0].tolist())
mask = raw.apply(lambda r: norm(r.tolist()) == header, axis=1)
data = raw[~mask].reset_index(drop=True)
data.columns = [c.replace("\n", " ").strip() for c in raw.iloc[0]]

print("rows per page:", per_page)
print("headers removed:", int(mask.sum()))
print("data rows:", len(data))
print(data.head(3).to_string(index=False))
```

### Quiz

1. Why build the per-page DataFrames *without* assigning the header row first?
- [x] So repeated headers stay visible and can be removed deliberately
- [ ] Because pandas cannot set columns later
- [ ] To save memory
> Keeping every row lets you count and drop repeated headers with a rule instead of assuming position.

2. What indicates a row that split across a page break?
- [ ] Two identical rows
- [x] A row with the key column empty but text in a description column
- [ ] A row with more cells than the header
> The continuation fragment has no range value; merge its text into the previous row.

3. Which is the most robust way to locate the table when page margins vary?
- [ ] A fixed crop at `top=60`
- [x] `find_tables()` and crop to the largest table's bbox
- [ ] Extracting the whole page without cropping
> Table bboxes adapt to each page's layout; fixed crops assume identical margins.

### Exercises

1. **Row histogram** — Print how many data rows each page contributed, after removing header rows.
<details><summary>Solution</summary>

```python
import pdfplumber

SETTINGS = {"vertical_strategy": "text", "horizontal_strategy": "lines"}
with pdfplumber.open("tx_rate_schedule.pdf") as pdf:
    header = None
    for page in pdf.pages:
        rows = page.extract_table(SETTINGS) or []
        if rows and header is None:
            header = rows[0]
        data_rows = [r for r in rows if r != header]
        print(page.page_number, len(data_rows))
```

</details>

2. **Continued-line filter** — Remove any row whose first cell matches `(continued)` case-insensitively, and report how many were removed.
<details><summary>Solution</summary>

```python
import re
mask = data.iloc[:, 0].astype(str).str.contains(r"\(continued\)", case=False, regex=True)
print("removed:", int(mask.sum()))
data = data[~mask].reset_index(drop=True)
```

</details>

### Interview Questions

**Q: How do you reliably stitch a table that spans several pages?**
Extract per page with the same settings, keep the raw rows including headers, and concatenate. Then remove repeated headers by comparing each row to the known header after normalising whitespace and case, not by position, because some pages carry a "continued" line before the header. Handle rows that wrapped across the break by merging fragments with an empty key column into the previous row. Finally assert the total against an independently established expected count and log the per-page row counts so a clipped page is visible. For the 3,346-row combined matrix I built, the per-page histogram was the check that caught a page where the bottom crop had cut off the last row.

**Q: The header row is detected on page 1 but not on pages 2 to 4. Why?**
The header text wrapped differently, or a page has an extra blank line inside a header cell, so an exact tuple comparison fails. I loosen the match: compare only the first two cells, or compare after collapsing all whitespace with `re.sub(r"\s+", " ", ...)`. Another cause is that the header on later pages is drawn as part of the running page header rather than the table, so the crop removed it; that is actually fine, and the count of removed headers being 1 is then expected. The lesson is to print what was removed rather than assume.

**Q: When would you avoid a fixed crop across pages?**
Whenever the vertical position of the table varies: a first page with a title block, later pages without; a page with a notes paragraph above the table; landscape pages mixed with portrait. In those cases I use `find_tables()` per page and crop to the chosen table's bbox with a small margin. A fixed crop is faster and simpler, so I keep it for sources I control, such as our own weekly production reports, and use bbox-driven crops for client documents.

# LEVEL: Advanced

## Custom table-finding with explicit lines

When the automatic strategies cannot agree on where columns are, stop tuning and *tell* pdfplumber. The `explicit` strategy uses only the coordinates you supply, which makes extraction deterministic: same PDF, same lines, same table, forever. It is the approach that finally made a 14-underwriter rate-card collection extract identically every week.

### Explicit vertical lines

`explicit_vertical_lines` accepts a list where each item is either a number (an x coordinate) or a `line`/`rect`/`curve` object. `explicit_horizontal_lines` does the same with `top` coordinates. Include the outer edges of the table as well as the internal boundaries.

```python
import pdfplumber

settings = {
    "vertical_strategy": "explicit",
    "explicit_vertical_lines": [36, 150, 264, 400, 520, 576],
    "horizontal_strategy": "lines",
}
with pdfplumber.open("nm_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    rows = page.extract_table(settings)
    print(len(rows[0]), "columns")   # 5
```

Six x positions produce five columns. You read those numbers off a debug image (`draw_vlines`) and adjust until each guide sits in the gutter between columns, not on top of any glyph.

### Mixing explicit with detected edges

Strategies can be combined by adding explicit lines to `lines` or `text`; explicit lines are always included as candidate edges regardless of strategy. That is the fix for "the finder gets every column but one": keep `text` and add the single missing boundary.

```python
settings = {
    "vertical_strategy": "text",
    "explicit_vertical_lines": [400],   # the boundary text alignment keeps missing
    "horizontal_strategy": "lines",
    "min_words_vertical": 6,
}
```

### Deriving explicit lines from the data

Hard-coded numbers break when a client changes margins. A more resilient approach computes the lines from something stable, such as the header words' positions.

```python
def column_edges_from_header(page, header_words, pad=4):
    words = page.extract_words()
    xs = []
    for label in header_words:
        w = next(w for w in words if w["text"] == label)
        xs.append(w["x0"] - pad)
    xs.append(max(w["x1"] for w in words) + pad)   # right edge of the table
    return xs

with pdfplumber.open("nm_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    edges = column_edges_from_header(page, ["From", "To", "Owner", "Loan", "Simultaneous"])
    rows = page.extract_table({"vertical_strategy": "explicit", "explicit_vertical_lines": edges,
                               "horizontal_strategy": "lines"})
```

Now a margin change moves the header words and the edges follow. Right-aligned columns need `x1`-based edges instead; choose per column.

### Horizontal lines from text rows

Borderless tables with no horizontal rules can use the rows themselves: cluster words by `top` and place a boundary halfway between consecutive rows.

```python
from pdfplumber.utils import cluster_objects

def row_edges(page, tolerance=3):
    rows = cluster_objects(page.extract_words(), lambda w: w["top"], tolerance)
    tops = [min(w["top"] for w in r) for r in rows]
    bottoms = [max(w["bottom"] for w in r) for r in rows]
    edges = [tops[0] - 2]
    for b, t in zip(bottoms, tops[1:]):
        edges.append((b + t) / 2)
    edges.append(bottoms[-1] + 2)
    return edges
```

Pass the result as `explicit_horizontal_lines` with `horizontal_strategy="explicit"`.

### Snapping and joining, precisely

Even with explicit lines the snap and join tolerances still apply, because detected edges from the other axis must meet your lines within `intersection_tolerance`. When a rule is drawn as several short dashes, `join_tolerance` decides whether they become one edge; when two rules are drawn a point apart (double borders), `snap_tolerance` decides whether they merge. Typical adjustments:

| Problem | Setting |
|---|---|
| dashed or segmented borders | raise `join_tolerance` to 5-10 |
| double borders create thin phantom cells | raise `snap_tolerance` to 4-6 |
| your explicit lines miss the horizontal rules by a hair | raise `intersection_x_tolerance` |
| tiny decorative ticks become edges | raise `edge_min_length` to 10+ |

> **Warning:** Explicit lines are in *page* coordinates. If you extract from a cropped page, the numbers are still page coordinates, not offsets from the crop. And lines outside the cropped bbox are ignored, so a horizontal line at `top=50` does nothing on a page cropped from `top=60`.

### Try It Yourself

```python
import pdfplumber

EDGES = [36, 150, 264, 400, 520, 576]   # tune these against the debug image

with pdfplumber.open("nm_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    settings = {"vertical_strategy": "explicit", "explicit_vertical_lines": EDGES,
                "horizontal_strategy": "lines", "join_tolerance": 6, "snap_tolerance": 4}

    im = page.to_image(resolution=110)
    im.draw_vlines(EDGES, stroke="orange", stroke_width=2)
    im.debug_tablefinder(settings)
    im.save("explicit_debug.png")

    rows = page.extract_table(settings) or []
    print(len(rows), "rows x", len(rows[0]) if rows else 0, "columns")
    for r in rows[:5]:
        print(r)
```

### Quiz

1. What can an item in `explicit_vertical_lines` be?
- [ ] Only an integer pixel position
- [x] A number (x coordinate) or a line/rect/curve object
- [ ] A column name
> Numbers are interpreted as x coordinates; objects contribute their own geometry.

2. To get four columns, how many explicit vertical lines do you need?
- [ ] 4
- [x] 5
- [ ] 3
> Columns sit between boundaries, so n columns require n + 1 lines including the outer edges.

3. Dashed table borders are being detected as many short edges. Which setting joins them?
- [ ] `snap_tolerance`
- [x] `join_tolerance`
- [ ] `edge_min_length`
> `join_tolerance` merges collinear segments separated by small gaps into one edge.

### Exercises

1. **Header-driven edges** — Write a function that returns explicit vertical lines from a list of header labels, using `x1 + pad` for labels you mark as right-aligned.
<details><summary>Solution</summary>

```python
def edges_from_header(page, spec, pad=4):
    # spec: list of (label, "left"|"right")
    words = {w["text"]: w for w in page.extract_words()}
    xs = []
    for label, align in spec:
        w = words[label]
        xs.append(w["x0"] - pad if align == "left" else w["x1"] + pad)
    return sorted(xs)
```

</details>

2. **Fully explicit grid** — Combine `row_edges()` from this chapter with a fixed list of column edges and extract a borderless table with both strategies set to `explicit`.
<details><summary>Solution</summary>

```python
import pdfplumber
from pdfplumber.utils import cluster_objects

def row_edges(page, tolerance=3):
    rows = cluster_objects(page.extract_words(), lambda w: w["top"], tolerance)
    tops = [min(w["top"] for w in r) for r in rows]
    bottoms = [max(w["bottom"] for w in r) for r in rows]
    edges = [tops[0] - 2] + [(b + t) / 2 for b, t in zip(bottoms, tops[1:])] + [bottoms[-1] + 2]
    return edges

with pdfplumber.open("borderless.pdf") as pdf:
    page = pdf.pages[0].crop((0, 80, 612, 720))
    s = {"vertical_strategy": "explicit", "explicit_vertical_lines": [40, 200, 330, 460, 580],
         "horizontal_strategy": "explicit", "explicit_horizontal_lines": row_edges(page)}
    for r in page.extract_table(s)[:5]:
        print(r)
```

</details>

### Interview Questions

**Q: When do you switch from automatic strategies to explicit lines, and what are the trade-offs?**
I switch when a layout needs more than a couple of tolerance tweaks, when the same source must extract identically every run, or when the automatic result is *almost* right but misses one boundary. Explicit lines are deterministic and easy to review on a debug image, and they can be mixed with `lines` or `text` on the other axis. The cost is coupling to geometry: if the client changes margins the numbers go stale. I mitigate that by deriving the lines from header word positions where possible and by asserting the expected column count so drift fails fast rather than silently shifting data.

**Q: Explain snap, join and intersection tolerances with a concrete failure each.**
Snap merges near-parallel edges: a double border drawn as two lines 1 pt apart becomes two edges and a 1-pt phantom column unless `snap_tolerance` covers the gap. Join merges collinear segments: a dashed rule becomes thirty short edges, each shorter than `edge_min_length`, and vanishes unless `join_tolerance` bridges the dashes. Intersection decides when a vertical and a horizontal edge count as crossing: a vertical rule that stops 4 pt short of the bottom rule yields no corner, so the last row's cells are never formed, unless `intersection_y_tolerance` is raised. Each of these is visible in `debug_tablefinder` output, which is how I diagnose which one applies.

**Q: How would you make explicit-line extraction survive a template change?**
Anchor the lines to content rather than to absolute positions: compute them from header words, from the widest row's word gaps, or from the table bbox returned by `find_tables()` scaled proportionally. Keep a fixture page and a test that asserts column count and a few known cell values, so a template change breaks the test rather than the report. When the change is intentional, updating the anchor spec and the fixture is a five-minute job, which is exactly what you want for a weekly automated rate-matrix refresh.

## Rotated pages and columnar layouts

Not every table is upright. Landscape rate schedules are often embedded in a portrait document with a `/Rotate 90` attribute, some producers draw a wide table rotated 90 degrees without setting `/Rotate`, and multi-column text (newsletters, policy manuals) needs to be read column by column rather than line by line across the page. pdfplumber handles each case, but you have to know which one you are looking at.

### Case 1: the page itself is rotated (`/Rotate`)

pdfplumber reads the page's `/Rotate` value and exposes it as `page.rotation`. For 90 and 270 it swaps `width` and `height` and transforms every object's coordinates into the *displayed* orientation, so `chars`, `extract_text()` and the table finder all work as if the page were upright.

```python
import pdfplumber

with pdfplumber.open("landscape_schedule.pdf") as pdf:
    page = pdf.pages[2]
    print(page.rotation, page.width, page.height)   # 90 792.0 612.0
    print(page.extract_text()[:120])                # reads normally
```

Nothing else to do. The one caveat is older pdfplumber versions (before 0.5.x) did not apply the rotation, so if you inherit a script that manually rotates coordinates, remove that code after upgrading.

### Case 2: rotated text on an unrotated page

Here `page.rotation` is `0` but the glyphs are drawn sideways. Each such char has `upright: False`, and its `matrix` tells you the direction. The default word extractor reads top-to-bottom, left-to-right, so sideways text comes out scrambled.

```python
with pdfplumber.open("sideways_table.pdf") as pdf:
    page = pdf.pages[0]
    rotated = [c for c in page.chars if not c["upright"]]
    print(len(rotated), "rotated chars of", len(page.chars))
    a, b, c_, d, e, f = rotated[0]["matrix"]
    print("matrix:", (a, b, c_, d))   # (0, 1, -1, 0) = rotated 90 deg counter-clockwise
```

Since 0.11.0 `extract_words()` and `extract_text()` accept `line_dir` and `char_dir` (`"ttb"`, `"btt"`, `"ltr"`, `"rtl"`) and their `_rotated` variants that apply only to non-upright chars. For text rotated 90 degrees counter-clockwise (you tilt your head left to read it), characters run bottom-to-top and successive lines progress left-to-right:

```python
words = page.extract_words(line_dir_rotated="ltr", char_dir_rotated="btt")
print(" ".join(w["text"] for w in words[:12]))
```

For text rotated clockwise, use `line_dir_rotated="rtl"` and `char_dir_rotated="ttb"`. Try both on a sample and pick the one that reads correctly. Before 0.11, the equivalents were the boolean pair `horizontal_ltr` / `vertical_ttb`.

### Case 3: rotate the PDF first

When the whole table is sideways and you also need the table finder, the pragmatic route is to rotate the page with pypdf or pikepdf and re-open it. The table finder then sees an upright grid.

```python
from pypdf import PdfReader, PdfWriter
import io, pdfplumber

reader, writer = PdfReader("sideways_table.pdf"), PdfWriter()
for p in reader.pages:
    writer.add_page(p)
    writer.pages[-1].rotate(90)      # sets /Rotate; pdfplumber will honour it
buf = io.BytesIO(); writer.write(buf); buf.seek(0)
with pdfplumber.open(buf) as pdf:
    print(pdf.pages[0].rotation, len(pdf.pages[0].extract_table() or []))
```

### Case 4: multi-column text

Two-column policy manuals produce interleaved lines if you call `extract_text()` naively. Three techniques, in order of preference:

1. `extract_text(use_text_flow=True)` keeps the content-stream order, which usually follows the columns.
2. Crop each column separately and concatenate (column boundaries are stable within a document).
3. Open with `laparams={}` so pdfminer's layout analysis groups text into `textboxhorizontal` objects, then sort those boxes by column.

```python
with pdfplumber.open("policy_manual.pdf", laparams={"line_margin": 0.3}) as pdf:
    page = pdf.pages[4]
    boxes = page.objects.get("textboxhorizontal", [])
    left  = sorted([b for b in boxes if b["x0"] < page.width / 2], key=lambda b: b["top"])
    right = sorted([b for b in boxes if b["x0"] >= page.width / 2], key=lambda b: b["top"])
    print(len(left), "left boxes,", len(right), "right boxes")
```

| Situation | Signal | Fix |
|---|---|---|
| page rotated | `page.rotation in (90, 270)` | nothing; already handled |
| sideways glyphs | `upright == False` | `*_dir_rotated` args, or rotate the PDF |
| columns interleaved | sentences alternate between topics | `use_text_flow`, crop per column, or `laparams` |

> **Interview note:** "How do you know text is rotated?" The precise answer is the `upright` flag and the text matrix, not "it looks sideways in the viewer".

### Try It Yourself

```python
import pdfplumber
from collections import Counter

with pdfplumber.open("mixed_layout.pdf") as pdf:
    for page in pdf.pages[:5]:
        n = len(page.chars)
        rot = sum(1 for c in page.chars if not c["upright"])
        mats = Counter(tuple(round(v) for v in c["matrix"][:4]) for c in page.chars if not c["upright"])
        print(f"page {page.page_number}: /Rotate={page.rotation} size={page.width:.0f}x{page.height:.0f} "
              f"chars={n} rotated={rot} matrices={dict(mats.most_common(2))}")
        if rot > n / 2:
            words = page.extract_words(line_dir_rotated="ltr", char_dir_rotated="btt")
            print("   rotated read:", " ".join(w["text"] for w in words[:10]))
```

### Quiz

1. A page has `rotation == 90`. What must you do before calling `extract_table()`?
- [x] Nothing; pdfplumber transforms coordinates into the displayed orientation
- [ ] Manually swap `x` and `y` of every object
- [ ] Re-save the PDF without rotation
> `/Rotate` is honoured: width/height are swapped and objects are rotated for you.

2. Which char attribute tells you a glyph is drawn sideways?
- [ ] `size`
- [x] `upright`
- [ ] `doctop`
> `upright` is `False` for rotated glyphs; `matrix` gives the exact transform.

3. What does `use_text_flow=True` change?
- [ ] It enables OCR
- [x] It keeps the PDF's drawing order instead of sorting top-to-bottom
- [ ] It removes hyphenation
> Content-stream order usually follows the logical column order in multi-column documents.

### Exercises

1. **Rotation census** — Report, for a whole document, how many pages have `/Rotate` set and how many contain a majority of non-upright chars.
<details><summary>Solution</summary>

```python
import pdfplumber

rotated_pages, sideways_text = 0, 0
with pdfplumber.open("mixed_layout.pdf") as pdf:
    for page in pdf.pages:
        if page.rotation in (90, 180, 270):
            rotated_pages += 1
        chars = page.chars
        if chars and sum(not c["upright"] for c in chars) > len(chars) / 2:
            sideways_text += 1
print("pages with /Rotate:", rotated_pages, "| pages with sideways text:", sideways_text)
```

</details>

2. **Column-by-column dump** — For a two-column page, write the left column's text followed by the right column's text to `page.txt`.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("policy_manual.pdf") as pdf:
    page = pdf.pages[4]
    mid = page.width / 2
    left = page.crop((0, 0, mid, page.height)).extract_text()
    right = page.crop((mid, 0, page.width, page.height)).extract_text()
    with open("page.txt", "w", encoding="utf-8") as f:
        f.write(left + "\n\n" + right)
```

</details>

### Interview Questions

**Q: A landscape rate table inside a portrait PDF extracts as gibberish. How do you diagnose and fix it?**
First I check `page.rotation`. If it is 90 or 270 pdfplumber has already handled it, so the problem lies elsewhere. If it is 0, I count chars with `upright == False` and inspect their `matrix`; a majority of `(0, 1, -1, 0)` matrices means the text is drawn rotated on an unrotated page. Then I either pass `line_dir_rotated`/`char_dir_rotated` to `extract_words` for text, or, if I need the table finder too, set `/Rotate` with pypdf and re-open so the grid becomes upright. I verify by rendering the page with `to_image()` and drawing the resulting words.

**Q: How do you extract two-column text in the right reading order?**
I try `extract_text(use_text_flow=True)` first because it is one argument and works for most generators. If the content order is unreliable, I crop each column by a fixed x boundary, which is stable within a document, and concatenate. For documents with complex flows, I open with `laparams` so pdfminer groups text into boxes and sort the boxes by column then by `top`. I choose by reading a sample page's output aloud; a paragraph that jumps topics mid-sentence means the columns are interleaved.

**Q: What does the char `matrix` contain and how do you get the rotation angle from it?**
It is the six-element PDF text matrix `(a, b, c, d, e, f)`: `a`-`d` encode scale and rotation, `e`-`f` the translation. For upright text `a = d = size` and `b = c = 0`. For 90-degree rotations `a = d = 0` and `b`, `c` are non-zero with opposite signs. The angle is `math.degrees(math.atan2(b, a))`, so `(0, 1, -1, 0)` is 90 degrees counter-clockwise and `(0, -1, 1, 0)` is clockwise. Knowing this lets me detect rotated watermarks and filter them out with `page.filter()` as well.

## Font and size information per character

Every char carries `fontname` and `size`, and that metadata is a structural signal. Headings are bigger, labels are bold, footnotes are small, and a rate card's "Effective Date" line is usually italic. By grouping chars on these attributes you can rebuild a document's outline, split a 767-page handbook into sections, or pull out just the bold totals from a production report.

### Reading the attributes

```python
import pdfplumber
from collections import Counter

with pdfplumber.open("policy_manual.pdf") as pdf:
    page = pdf.pages[3]
    combos = Counter((c["fontname"], round(c["size"], 1)) for c in page.chars)
    for (font, size), n in combos.most_common():
        print(f"{n:5d}  {size:5.1f}pt  {font}")
```

Typical output:

```text
 2140   10.0pt  ABCDEE+Calibri
  118   10.0pt  ABCDEE+Calibri-Bold
   42   16.0pt  ABCDEE+Calibri-Light
   17   20.0pt  ABCDEE+Calibri-Light
   11    8.0pt  ABCDEE+Calibri-Italic
```

The `ABCDEE+` prefix is a subset tag added when the producer embedded only the glyphs it used. Strip it with `fontname.split("+")[-1]` before comparing across files, because the tag differs from document to document.

### Words with font attributes

Rather than working char by char, pass `extra_attrs` to `extract_words()`. Each word then carries the attribute and words never span a font change.

```python
words = page.extract_words(extra_attrs=["fontname", "size"])
headings = [w for w in words if w["size"] >= 16]
bold = [w for w in words if "Bold" in w["fontname"]]
print([w["text"] for w in headings])
```

### Rebuilding headings as lines

Group heading words into lines by `top`, then join, to get the actual heading strings with their positions. This is enough to build a table of contents or to know which section a table belongs to.

```python
from pdfplumber.utils import cluster_objects

def headings_on_page(page, min_size=14):
    words = page.extract_words(extra_attrs=["size"])
    big = [w for w in words if w["size"] >= min_size]
    lines = cluster_objects(big, lambda w: w["top"], tolerance=3)
    return [(" ".join(w["text"] for w in sorted(l, key=lambda w: w["x0"])), l[0]["top"], l[0]["size"])
            for l in lines]

with pdfplumber.open("policy_manual.pdf") as pdf:
    for page in pdf.pages[:20]:
        for text, top, size in headings_on_page(page):
            level = "H1" if size >= 20 else "H2"
            print(f"p{page.page_number:>3} {level} {text}")
```

### Inferring heading levels from size clusters

Hard-coding "20 pt is H1" fails on the next client's template. Instead, collect every distinct size across the document, drop the body size (the most common), and rank the rest descending.

```python
def size_ranks(pdf, sample=40):
    counts = Counter()
    for page in pdf.pages[:sample]:
        counts.update(round(c["size"]) for c in page.chars)
    body = counts.most_common(1)[0][0]
    bigger = sorted((s for s in counts if s > body), reverse=True)
    return {s: f"H{i + 1}" for i, s in enumerate(bigger)}
```

Now `size_ranks(pdf)` might return `{20: "H1", 16: "H2", 12: "H3"}` for one manual and `{18: "H1", 14: "H2"}` for another, and the same code handles both.

### Colour as a signal

`non_stroking_color` is the fill colour of the glyph. Many templates render section headings in the brand colour and negative numbers in red. Values are tuples whose length depends on the colour space: 1 element for grey, 3 for RGB, 4 for CMYK.

```python
red_words = [w for w in page.extract_words(extra_attrs=["non_stroking_color"])
             if w["non_stroking_color"] in [(1, 0, 0), (0.8, 0, 0)]]
```

| Attribute | Use it for |
|---|---|
| `size` | heading levels, footnotes, fine print |
| `fontname` contains `Bold` | labels, totals, column headers |
| `fontname` contains `Italic`/`Oblique` | notes, effective dates, captions |
| `non_stroking_color` | brand-coloured headings, red negatives, grey watermarks |
| `upright` | rotated stamps and watermarks |

> **Tip:** Some fonts encode weight in the name without the word "Bold" (`Calibri,Bold`, `Arial-BoldMT`, `Helvetica-Black`, or a numeric weight such as `Roboto-700`). Match case-insensitively on `bold|black|heavy|semibold|700|800|900` rather than a single string.

### Try It Yourself

```python
import pdfplumber, re
from collections import Counter
from pdfplumber.utils import cluster_objects

BOLD = re.compile(r"bold|black|heavy|semibold|[789]00", re.I)

with pdfplumber.open("policy_manual.pdf") as pdf:
    counts = Counter()
    for page in pdf.pages[:30]:
        counts.update(round(c["size"]) for c in page.chars)
    body = counts.most_common(1)[0][0]
    ranks = {s: f"H{i + 1}" for i, s in enumerate(sorted((s for s in counts if s > body), reverse=True))}
    print("body size:", body, "| heading sizes:", ranks)

    for page in pdf.pages[:30]:
        words = page.extract_words(extra_attrs=["size", "fontname"])
        big = [w for w in words if round(w["size"]) in ranks]
        for line in cluster_objects(big, lambda w: w["top"], tolerance=3):
            line = sorted(line, key=lambda w: w["x0"])
            text = " ".join(w["text"] for w in line)
            tag = ranks[round(line[0]["size"])]
            weight = "bold" if BOLD.search(line[0]["fontname"]) else "regular"
            print(f"p{page.page_number:>3} {tag} ({weight}): {text}")
```

### Quiz

1. What does the `ABCDEE+` prefix in a fontname mean?
- [ ] The font is a system font
- [x] The producer embedded a subset of the font
- [ ] The font is bold
> Subset fonts get a random six-letter tag; strip it before comparing names across files.

2. Which `extract_words()` argument makes words carry font size?
- [ ] `with_size=True`
- [x] `extra_attrs=["size"]`
- [ ] `layout=True`
> `extra_attrs` copies the listed char keys onto each word and prevents words spanning attribute changes.

3. How many elements does `non_stroking_color` have for a CMYK fill?
- [ ] 1
- [ ] 3
- [x] 4
> Grey has 1 component, RGB 3, CMYK 4; check the length before comparing.

### Exercises

1. **Bold totals** — Print every line on a production report page in which *all* words are bold.
<details><summary>Solution</summary>

```python
import pdfplumber, re
from pdfplumber.utils import cluster_objects

BOLD = re.compile(r"bold|black|heavy|semibold|[789]00", re.I)
with pdfplumber.open("weekly_status.pdf") as pdf:
    words = pdf.pages[0].extract_words(extra_attrs=["fontname"])
    for line in cluster_objects(words, lambda w: w["top"], tolerance=3):
        if all(BOLD.search(w["fontname"]) for w in line):
            print(" ".join(w["text"] for w in sorted(line, key=lambda w: w["x0"])))
```

</details>

2. **Font inventory** — For a whole document, list each distinct base font (subset tag removed) with the number of pages it appears on.
<details><summary>Solution</summary>

```python
import pdfplumber
from collections import defaultdict

pages_by_font = defaultdict(set)
with pdfplumber.open("policy_manual.pdf") as pdf:
    for page in pdf.pages:
        for c in page.chars:
            pages_by_font[c["fontname"].split("+")[-1]].add(page.page_number)
for font, pages in sorted(pages_by_font.items(), key=lambda kv: -len(kv[1])):
    print(f"{font:<32} {len(pages)} pages")
```

</details>

### Interview Questions

**Q: How would you generate a table of contents for a PDF that has no bookmarks?**
I sample pages to find the body font size (the most common `size`), treat every larger size as a heading level ranked by size, and then on each page extract words with `extra_attrs=["size", "fontname"]`, keep the heading-sized ones, cluster them into lines by `top`, and record `(level, text, page_number)`. I refine with font weight for templates where H2 differs from body only by boldness. The output feeds either a bookmark writer such as pikepdf or PyMuPDF, or a Word TOC when the client wants the manual rebuilt. On a 767-page handbook this ran in about a minute and found 640 headings; the ones it missed were images of text, which is a different problem.

**Q: Why not just look for lines in ALL CAPS or numbered like "3.2" to find headings?**
Those are text heuristics that break on the first template that uses title case or unnumbered headings, and they also produce false positives from table headers and acronyms. Font metadata is structural: the template author chose a heading style once and the producer embedded it in every heading char. I use text patterns as a secondary signal to disambiguate, for example to distinguish a bold table header from a bold H3, but size and weight do most of the work reliably across sources.

**Q: What pitfalls have you hit comparing `fontname` values?**
Three. Subset prefixes differ between files, so strip everything before `+`. Weight is encoded inconsistently: `-Bold`, `,Bold`, `BoldMT`, `Black`, `Semibold`, or numeric weights, so I match with a regex. And some producers do not embed a bold face at all; they fake bold by double-drawing or by stroking the outline, in which case `fontname` is the regular face and the tell is duplicate chars (fix with `dedupe_chars`) or a non-zero `stroking_color` on text. Rendering the page and looking is always the tie-breaker.

## Pipeline: PDF to pandas to Excel

This chapter assembles everything into the pipeline that produced the **3,346-row combined rate matrix**: 14 underwriter rate cards, each a multi-page PDF with its own layout, extracted into one typed DataFrame and written to a formatted Excel workbook the rating team could load into a calculator. The design goals are repeatability (same input, same output), traceability (every row knows its source file and page) and loud failure (a layout change breaks a check, not a premium).

### Structure

```text
ratex/
  layouts.py     # one settings dict + crop + column spec per source
  extract.py     # PDF -> list of DataFrames, one per page
  clean.py       # normalise names, coerce money, fill-down
  validate.py    # counts, ranges, regex, cross-checks
  export.py      # write Excel with formatting
  run.py         # glue: for each file -> extract -> clean -> validate -> collect
```

Keeping the layout registry separate is what makes onboarding a fifteenth underwriter a data change, not a code change.

### Layout registry

```python
# layouts.py
LAYOUTS = {
    "WY-stewart": dict(
        crop=(0, 72, 612, 740),
        settings={"vertical_strategy": "lines", "horizontal_strategy": "lines"},
        columns=["liability_from", "liability_to", "owner_premium", "loan_premium"],
        header_key="Liability",
    ),
    "TX-basic": dict(
        crop=(0, 60, 612, 752),
        settings={"vertical_strategy": "explicit", "explicit_vertical_lines": [36, 150, 264, 400, 576],
                  "horizontal_strategy": "lines", "join_tolerance": 6},
        columns=["liability_from", "liability_to", "owner_premium", "loan_premium"],
        header_key="From",
    ),
}
```

### Extraction with provenance

```python
# extract.py
import pdfplumber, pandas as pd

def extract_pdf(path, layout):
    frames = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            region = page.within_bbox(layout["crop"], strict=False)
            rows = region.extract_table(layout["settings"])
            if not rows:
                continue
            df = pd.DataFrame(rows)
            df["_source"], df["_page"] = path.name, page.page_number
            frames.append(df)
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()
```

The `_source` and `_page` columns cost nothing and pay for themselves the first time a rating analyst asks "where did this $1,254 come from?".

### Cleaning and header removal

```python
# clean.py
import pandas as pd, re

def money(s):
    return pd.to_numeric(s.astype(str).str.replace(r"[^\d.\-]", "", regex=True).replace("", pd.NA),
                         errors="coerce")

def clean(raw, layout, state, underwriter):
    n = len(layout["columns"])
    df = raw.iloc[:, :n].copy()
    df.columns = layout["columns"]
    is_header = df.iloc[:, 0].astype(str).str.contains(layout["header_key"], case=False, na=False)
    df = df[~is_header]
    for c in df.columns:
        df[c] = money(df[c])
    df = df.dropna(subset=["liability_from", "liability_to"]).reset_index(drop=True)
    df.insert(0, "underwriter", underwriter)
    df.insert(0, "state", state)
    df["_source"], df["_page"] = raw.loc[df.index, "_source"].values, raw.loc[df.index, "_page"].values
    return df
```

### Running all sources

```python
# run.py
import pathlib, pandas as pd
from layouts import LAYOUTS
from extract import extract_pdf
from clean import clean
from validate import validate      # next-level chapter covers it fully
from export import write_excel

parts = []
for pdf_path in sorted(pathlib.Path("rate_cards").glob("*.pdf")):
    state, underwriter = pdf_path.stem.split("-", 1)         # WY-stewart.pdf
    layout = LAYOUTS[pdf_path.stem]
    raw = extract_pdf(pdf_path, layout)
    df = clean(raw, layout, state, underwriter)
    validate(df, pdf_path.stem)
    print(f"{pdf_path.name}: {len(df)} rows")
    parts.append(df)

matrix = pd.concat(parts, ignore_index=True)
assert len(matrix) == 3346, len(matrix)
write_excel(matrix, "combined_rate_matrix.xlsx")
```

### Excel output that people can use

`DataFrame.to_excel` through openpyxl gets the data in; a few lines of openpyxl make it usable: frozen header, autofilter, currency formats, sensible widths, and a second sheet describing provenance.

```python
# export.py
import pandas as pd

def write_excel(df, path):
    with pd.ExcelWriter(path, engine="openpyxl") as xw:
        df.to_excel(xw, sheet_name="rates", index=False)
        df.groupby(["state", "underwriter", "_source"]).size().rename("rows").reset_index() \
          .to_excel(xw, sheet_name="sources", index=False)
        ws = xw.sheets["rates"]
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions
        money_cols = [i + 1 for i, c in enumerate(df.columns) if c.endswith("premium") or c.startswith("liability")]
        for col in money_cols:
            for cell in ws.iter_cols(min_col=col, max_col=col, min_row=2):
                for c in cell:
                    c.number_format = '"$"#,##0.00'
        for i, c in enumerate(df.columns, 1):
            ws.column_dimensions[ws.cell(row=1, column=i).column_letter].width = max(12, len(c) + 2)
```

| Stage | Failure it catches |
|---|---|
| layout lookup | unknown file name (new underwriter) |
| extract | page with no table (layout drift) |
| clean | headers surviving, non-numeric premiums |
| validate | wrong row count, gaps in ranges |
| export | nothing, by design; it only formats |

> **Warning:** Never `assert` inside a loop that swallows exceptions. The pipeline should stop on the first failed check with the file name and page in the message. A rate matrix with one silently shifted column costs far more than a delayed report.

### Try It Yourself

```python
import pdfplumber, pandas as pd, pathlib, re

def money(s):
    return pd.to_numeric(s.astype(str).str.replace(r"[^\d.\-]", "", regex=True).replace("", pd.NA), errors="coerce")

COLS = ["liability_from", "liability_to", "owner_premium", "loan_premium"]
parts = []
for path in sorted(pathlib.Path("rate_cards").glob("*.pdf")):
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            rows = page.crop((0, 60, page.width, page.height - 40)).extract_table()
            if not rows:
                continue
            df = pd.DataFrame([r[:4] for r in rows], columns=COLS)
            df = df[~df["liability_from"].astype(str).str.contains("liab", case=False, na=False)]
            for c in COLS:
                df[c] = money(df[c])
            df = df.dropna(subset=["liability_from"])
            df.insert(0, "source", path.stem); df["page"] = page.page_number
            parts.append(df)

matrix = pd.concat(parts, ignore_index=True)
print(matrix.groupby("source").size())
print("total rows:", len(matrix))
with pd.ExcelWriter("combined_rate_matrix.xlsx", engine="openpyxl") as xw:
    matrix.to_excel(xw, sheet_name="rates", index=False)
    xw.sheets["rates"].freeze_panes = "A2"
print("wrote combined_rate_matrix.xlsx")
```

### Quiz

1. Why add `_source` and `_page` columns during extraction?
- [x] So every row can be traced back to its file and page
- [ ] Because pandas requires them
- [ ] To speed up extraction
> Provenance columns make QA questions answerable in seconds and cost nothing.

2. Where should per-underwriter table settings live?
- [ ] Hard-coded in the extraction loop
- [x] In a registry keyed by source, separate from the code
- [ ] In the Excel output
> A registry turns a new layout into a data change and keeps the pipeline code stable.

3. What does `ws.freeze_panes = "A2"` do?
- [ ] Locks the sheet
- [x] Keeps the header row visible while scrolling
- [ ] Sets the print area
> Freezing at A2 pins row 1, which is the header.

### Exercises

1. **Per-source summary sheet** — Add a sheet `summary` with, for each state, the minimum and maximum `owner_premium` and the row count.
<details><summary>Solution</summary>

```python
summary = matrix.groupby("state").agg(rows=("owner_premium", "size"),
                                      min_owner=("owner_premium", "min"),
                                      max_owner=("owner_premium", "max")).reset_index()
with pd.ExcelWriter("combined_rate_matrix.xlsx", engine="openpyxl", mode="a", if_sheet_exists="replace") as xw:
    summary.to_excel(xw, sheet_name="summary", index=False)
```

</details>

2. **Fail fast on drift** — Wrap the per-file extraction so that a page returning `None` from `extract_table()` raises `ValueError` with the file name and page number.
<details><summary>Solution</summary>

```python
rows = region.extract_table(layout["settings"])
if rows is None:
    raise ValueError(f"{path.name} page {page.page_number}: no table found; layout drift?")
```

</details>

### Interview Questions

**Q: Describe an extraction pipeline you built and how you made it reliable.**
I combined 14 underwriter rate cards into a 3,346-row matrix. Each source had its own entry in a layout registry: crop box, table settings, column names and a header keyword. Extraction ran per page with provenance columns, cleaning normalised names and coerced money with a regex, and validation asserted row counts per file, contiguous liability ranges, monotonic premiums and a currency regex on the raw strings. The output was an openpyxl-formatted workbook with a sources sheet. Reliability came from failing loudly: any page with no table or any failed check stopped the run with the file and page named, and the debug PNGs for each layout were checked into the repo next to the settings that produced them.

**Q: How do you handle a new underwriter whose PDF layout you have never seen?**
I render the first page, count lines and rects to decide between `lines` and `text`, run `debug_tablefinder` with two or three candidate settings, and pick the one that yields the right column count. If none does within a few minutes I read column edges off the image and use explicit lines anchored to header words. I add the entry to the registry, record the expected row count from a manual count of one page times pages plus the last page, add a fixture, and run the full pipeline. The new source is typically done in under an hour, and nothing in the existing sources changes.

**Q: Why write Excel with openpyxl formatting rather than a plain CSV?**
Because the consumer is a rating team, not a program. A frozen header, autofilter and currency formats mean they can sanity-check the matrix immediately, and a `sources` sheet answers "where is this from?" without asking me. CSV loses number formats and encourages Excel's auto-conversion of ranges like `1-5` into dates. When the consumer *is* a program, I also emit Parquet or CSV alongside, but the formatted workbook is the deliverable that gets reviewed.

## Encrypted, broken and scanned PDFs

Client uploads are not clean. Some rate cards are password-protected, some were produced by a buggy generator and fail to parse, and a surprising share of "PDFs" are scans with no text at all. A production extraction pipeline needs a decision tree for all three, and this chapter gives you one.

### Encrypted files

pdfplumber passes a password through to pdfminer. If the file has only an owner password (restrictions but no open password), it opens without one.

```python
import pdfplumber
from pdfminer.pdfdocument import PDFPasswordIncorrect

def open_pdf(path, passwords=("",)):
    for pw in passwords:
        try:
            return pdfplumber.open(path, password=pw)
        except PDFPasswordIncorrect:
            continue
    raise RuntimeError(f"{path}: no password worked")

pdf = open_pdf("secured_rate_card.pdf", passwords=("", "title2026", "stewart"))
print(len(pdf.pages))
pdf.close()
```

AES-256 (PDF 2.0 / R6) encryption requires the `cryptography` package, which pdfminer.six lists as a dependency in current versions; if you see `PDFEncryptionError`, upgrade pdfminer.six.

### Broken files: `repair=True`

Malformed cross-reference tables, truncated streams and wrong offsets produce `PDFSyntaxError` or `PSEOF` from pdfminer. pdfplumber can shell out to Ghostscript to rewrite the file before parsing.

```python
try:
    pdf = pdfplumber.open("truncated.pdf")
except Exception:
    pdf = pdfplumber.open("truncated.pdf", repair=True)     # needs `gs` on PATH
```

`pdfplumber.repair(path, outfile="fixed.pdf")` does the same as a standalone step, and `gs_path="C:/Program Files/gs/gs10.03.1/bin/gswin64c.exe"` points at a Windows install. Ghostscript re-renders the page description, so text objects and their coordinates survive, but it can change font subset names and occasionally the drawing order, so re-run your validation after repair. Where Ghostscript is unavailable, `pikepdf.open(path).save("fixed.pdf")` repairs many structural faults through qpdf without any rendering.

### Detecting scanned pages

A scanned page has no `chars` and one image roughly the size of the page. Some scans also carry an invisible OCR text layer from the scanner software; that layer *does* produce chars, often of dubious quality.

```python
def page_kind(page):
    if page.chars:
        return "text"
    if page.images and any(i["width"] * i["height"] > 0.5 * page.width * page.height for i in page.images):
        return "scan"
    return "blank"
```

Check a whole document's mix before choosing a strategy; a 40-page handbook with 3 scanned appendix pages needs OCR only for those three.

### OCR fallback with Tesseract

Render the page at 300 dpi, hand the PIL image to pytesseract, and, if you need positions, ask for TSV output which includes word boxes.

```python
import pytesseract, pandas as pd

def ocr_words(page, dpi=300):
    img = page.to_image(resolution=dpi).original      # PIL Image
    tsv = pytesseract.image_to_data(img, output_type=pytesseract.Output.DATAFRAME)
    tsv = tsv[tsv["conf"] > 0].dropna(subset=["text"])
    scale = 72 / dpi                                   # pixels -> points
    return pd.DataFrame({
        "text": tsv["text"], "conf": tsv["conf"],
        "x0": tsv["left"] * scale, "top": tsv["top"] * scale,
        "x1": (tsv["left"] + tsv["width"]) * scale, "bottom": (tsv["top"] + tsv["height"]) * scale,
    })
```

Because the columns are named like pdfplumber words, the clustering code from earlier chapters works unchanged on OCR output. For tables on scans, `pytesseract.image_to_string(img, config="--psm 6")` treats the page as a uniform block and preserves row structure well; combine it with `read_fwf` or regexes.

### A decision tree

| Condition | Action |
|---|---|
| `PDFPasswordIncorrect` | try known passwords, then ask the client |
| `PDFSyntaxError` / `PSEOF` | `repair=True`, else pikepdf save, else reject with a clear message |
| `page.chars` empty and page-sized image | OCR at 300 dpi, flag rows as `ocr=True` with confidence |
| chars present but garbled (`(cid:123)`) | font has no ToUnicode map; try OCR or ask for a re-export |
| Unicode decode errors | open with `raise_unicode_errors=False` (0.10.3+) and log the page |

> **Tip:** Mark OCR-derived rows in the output (`source_kind="ocr"`, `min_conf=...`). The rating team must know which premiums came from pixels rather than text, because a misread `8` as `3` in a premium column is the kind of error nobody spots until a policy is issued.

### Try It Yourself

```python
import pdfplumber, pytesseract
from pdfminer.pdfdocument import PDFPasswordIncorrect

PATH, PASSWORDS = "client_upload.pdf", ("", "title2026")

pdf = None
for pw in PASSWORDS:
    try:
        pdf = pdfplumber.open(PATH, password=pw); break
    except PDFPasswordIncorrect:
        continue
    except Exception as e:
        print("parse error:", e, "-> trying repair")
        pdf = pdfplumber.open(PATH, password=pw, repair=True); break
if pdf is None:
    raise SystemExit("could not open file")

with pdf:
    for page in pdf.pages:
        if page.chars:
            kind, text = "text", page.extract_text() or ""
        elif page.images:
            kind = "scan"
            text = pytesseract.image_to_string(page.to_image(resolution=300).original, config="--psm 6")
        else:
            kind, text = "blank", ""
        print(f"page {page.page_number}: {kind:<5} {len(text.split()):5d} words | {text.strip()[:60]!r}")
```

### Quiz

1. What does `repair=True` require?
- [ ] pikepdf installed
- [x] Ghostscript available on the PATH (or `gs_path`)
- [ ] An internet connection
> pdfplumber shells out to Ghostscript to rewrite the file before pdfminer parses it.

2. How do you recognise a scanned page programmatically?
- [x] No chars and an image covering most of the page
- [ ] `page.rotation == 90`
- [ ] `extract_text()` raises an error
> Scans are bitmaps; the text exists only as pixels until OCR runs.

3. Why render at 300 dpi for OCR?
- [ ] pytesseract refuses lower resolutions
- [x] Tesseract accuracy drops sharply for small text below roughly 200 dpi
- [ ] 300 dpi is the PDF default
> 10-point body text needs around 300 dpi to give Tesseract enough pixels per glyph.

### Exercises

1. **Document kind report** — Print how many pages of a PDF are `text`, `scan` or `blank`.
<details><summary>Solution</summary>

```python
import pdfplumber
from collections import Counter

def kind(page):
    if page.chars: return "text"
    if page.images and any(i["width"] * i["height"] > 0.5 * page.width * page.height for i in page.images):
        return "scan"
    return "blank"

with pdfplumber.open("client_upload.pdf") as pdf:
    print(Counter(kind(p) for p in pdf.pages))
```

</details>

2. **Low-confidence flag** — Using `ocr_words()` from this chapter, print every OCR word with confidence below 60 together with its page number.
<details><summary>Solution</summary>

```python
with pdfplumber.open("scanned_card.pdf") as pdf:
    for page in pdf.pages:
        if page.chars:
            continue
        words = ocr_words(page)
        low = words[words["conf"] < 60]
        for _, w in low.iterrows():
            print(page.page_number, repr(w["text"]), round(w["conf"]))
```

</details>

### Interview Questions

**Q: A client uploads a PDF that raises `PDFSyntaxError`. What is your sequence of actions?**
Retry with `repair=True`, which runs Ghostscript and fixes most cross-reference and stream-length faults. If Ghostscript is not available in that environment I try `pikepdf.open(path).save()` since qpdf repairs structure without rendering. If both fail, the file is likely truncated in transfer, so I compare its size against what the client sent and ask for a re-upload. Whatever fixed it, I re-run validation, because repair can reorder content and alter font names, and I log which path succeeded so the ops team sees patterns such as one client's generator consistently producing broken files.

**Q: How do you integrate OCR into an extraction pipeline without compromising data quality?**
I classify each page first, so OCR runs only where there are no chars. I render at 300 dpi, use Tesseract's TSV output to get word boxes and confidences, and map pixel boxes back to points so the same clustering code works. Every row derived from OCR carries a flag and its minimum word confidence, and rows under a threshold go to a human review queue rather than straight into the matrix. For numeric columns I also apply stricter regex validation, because OCR confuses `0/O`, `1/l` and `5/S`. The output workbook shows the OCR flag as a column so the rating team can prioritise checks.

**Q: What does `(cid:123)` in extracted text mean and how do you fix it?**
The font lacks a ToUnicode CMap, so pdfminer knows the glyph ID but not the character it represents. This is common in PDFs produced by some print drivers and by certain design tools with subset fonts. There is no reliable fix at the extraction layer: you can build a manual glyph-to-char map if the font is consistent across the client's documents, but the practical answer is to OCR those pages or ask the client to re-export with standard fonts. I detect it with a regex for `\(cid:\d+\)` and treat affected pages like scans.

# LEVEL: Expert

## Performance and memory at scale

pdfplumber is pure Python on top of pdfminer.six, which is also pure Python. That makes it flexible and easy to debug, and it makes it the slowest mainstream PDF library by a wide margin. A dense rate-card page takes 0.2 to 0.5 seconds to parse; a 767-page handbook takes minutes, and holding every page's objects in memory at once can consume gigabytes. Knowing where the time and memory go lets you run batch jobs over thousands of client files without surprises.

### Where the time goes

| Operation | Cost | Notes |
|---|---|---|
| `pdfplumber.open()` | cheap | reads the xref and page tree only |
| first access to `page.chars` (or any objects) | expensive | pdfminer interprets the whole content stream |
| `extract_text()` / `extract_words()` | moderate | sorting and clustering thousands of dicts |
| `find_tables()` | moderate to expensive | edge snapping is O(n log n); `text` strategy adds word extraction |
| `to_image()` | moderate | PDFium is fast; Pillow drawing of thousands of rects is not |
| `laparams={...}` | expensive | enables pdfminer's layout analysis on every page |

The content-stream parse dominates. It happens once per page and its result is cached on the `Page` object, which is convenient in a notebook and dangerous in a batch loop.

### Page caching and `flush_cache()`

Every `Page` keeps its parsed objects (`chars`, `rects`, and every derived list) in memory until the page is garbage-collected. Because `pdf.pages` holds a reference to each page, nothing is freed until the `PDF` closes. On a 700-page document that means every page's objects accumulate.

```python
import pdfplumber

with pdfplumber.open("handbook.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        process(text)
        page.flush_cache()     # drop parsed objects for this page
```

`flush_cache()` (0.10+; older versions expose `page.close()` with the same effect) clears the cached properties so memory stays flat. If you also need to release pdfminer's own structures, `page.close()` does both. For extreme cases, open with `pages=[n]` in a loop so only one page is ever instantiated.

### Only parse what you need

`pdfplumber.open(path, pages=[...])` avoids instantiating other pages entirely. Combine it with an index step that is cheap, such as reading bookmarks with pikepdf or rendering thumbnails, to decide which pages carry the table you want.

```python
import pdfplumber

wanted = [5, 6, 7, 8]                              # from a bookmark scan or a first pass
with pdfplumber.open("handbook.pdf", pages=wanted) as pdf:
    for page in pdf.pages:                          # only four Page objects exist
        print(page.page_number, len(page.extract_table() or []))
```

### Skip object types you do not use

pdfminer produces every object; pdfplumber converts each to a dict. If you only need text, filtering happens *after* the expensive part, so the win from `page.filter()` is small. What does help is avoiding `laparams` unless you need text boxes, avoiding `to_image()` in production paths, and never calling `extract_words()` and `extract_text()` separately when one call gives you both (`extract_text_lines()` returns text with coordinates in one pass).

### `laparams` and layout analysis

Passing `laparams` (even `{}`) turns on pdfminer's `LAParams` layout analysis, which groups chars into `textline` and `textbox` objects. It is useful for column detection but roughly doubles per-page time and memory. Enable it per document, not globally, and only when you read `page.textboxhorizontals` or similar.

```python
with pdfplumber.open("newsletter.pdf", laparams={"line_margin": 0.4, "char_margin": 1.5}) as pdf:
    boxes = pdf.pages[0].textboxhorizontals
```

### Parallelism

Python's GIL means threads do not speed up pdfminer. Use processes, one file per worker, and keep the worker function self-contained so it opens and closes its own PDF.

```python
from concurrent.futures import ProcessPoolExecutor
import pdfplumber, pathlib

def count_rows(path):
    n = 0
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            n += len(page.extract_table() or [])
            page.flush_cache()
    return path.name, n

if __name__ == "__main__":
    files = sorted(pathlib.Path("rate_cards").glob("*.pdf"))
    with ProcessPoolExecutor(max_workers=6) as ex:
        for name, n in ex.map(count_rows, files):
            print(name, n)
```

Do not pass `Page` or `PDF` objects between processes; they are not picklable, and even if they were, each worker must parse independently.

### Repair costs

`repair=True` spawns Ghostscript, which rewrites the whole file before pdfplumber reads a byte. On a large scanned file that can take longer than the extraction itself. Use it only on files that failed to open, cache the repaired output next to the original, and never repair on every run.

> **Warning:** Measuring is the only way to know. `python -X importtime` and `cProfile` on one representative file show whether time is in pdfminer's interpreter (nothing to do but parallelise or parse fewer pages), in your clustering (vectorise with pandas), or in Pillow drawing (stop rendering in production).

### Try It Yourself

```python
import pdfplumber, time, tracemalloc, sys

path = sys.argv[1] if len(sys.argv) > 1 else "handbook.pdf"
tracemalloc.start()
t0 = time.perf_counter()
words_total = 0
with pdfplumber.open(path) as pdf:
    n = len(pdf.pages)
    for page in pdf.pages:
        words_total += len(page.extract_words())
        page.flush_cache()              # comment out to see memory grow
        if page.page_number % 50 == 0:
            cur, peak = tracemalloc.get_traced_memory()
            print(f"page {page.page_number}/{n}: {time.perf_counter() - t0:6.1f}s  mem {cur/1e6:6.1f} MB (peak {peak/1e6:.1f})")
cur, peak = tracemalloc.get_traced_memory()
print(f"done: {n} pages, {words_total} words, {time.perf_counter() - t0:.1f}s, peak {peak/1e6:.1f} MB")
```

### Quiz

1. Which step dominates pdfplumber's per-page cost?
- [ ] Sorting words
- [x] pdfminer interpreting the content stream on first object access
- [ ] Opening the file
> Parsing happens lazily on first access to any objects and is cached on the page.

2. How do you keep memory flat in a loop over hundreds of pages?
- [ ] Call `gc.collect()` after each page
- [x] Call `page.flush_cache()` (or `page.close()`) after processing each page
- [ ] Use threads
> Cached objects stay referenced via `pdf.pages` until you flush them.

3. Why use processes rather than threads for batch extraction?
- [x] pdfminer is pure Python and the GIL serialises threads
- [ ] Threads cannot open files
- [ ] pdfplumber is not thread-safe at all
> CPU-bound pure-Python work only scales across processes.

### Exercises

1. **Timing per strategy** — Time `find_tables()` with `lines` and with `text` strategies on the same page, printing milliseconds for each.
<details><summary>Solution</summary>

```python
import pdfplumber, time

with pdfplumber.open("tx_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    page.chars                        # force the parse so timing isolates the finder
    for strat in ("lines", "text"):
        s = {"vertical_strategy": strat, "horizontal_strategy": strat}
        t0 = time.perf_counter()
        n = len(page.find_tables(s))
        print(f"{strat:>5}: {n} tables in {(time.perf_counter() - t0) * 1000:.0f} ms")
```

</details>

2. **Chunked opening** — Process a large PDF 25 pages at a time using `pages=` so that at most 25 Page objects exist at once.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("handbook.pdf") as probe:
    total = len(probe.pages)
for start in range(1, total + 1, 25):
    chunk = list(range(start, min(start + 25, total + 1)))
    with pdfplumber.open("handbook.pdf", pages=chunk) as pdf:
        words = sum(len(p.extract_words()) for p in pdf.pages)
    print(f"pages {chunk[0]}-{chunk[-1]}: {words} words")
```

</details>

### Interview Questions

**Q: pdfplumber is slow on a 700-page document. What do you do?**
First I profile one file to confirm the time is in pdfminer's parse rather than my code. Then I reduce work: open with `pages=` for only the pages that matter, avoid `laparams` and `to_image()` in the production path, and call `extract_text_lines()` once instead of `extract_text()` plus `extract_words()`. Memory is kept flat with `flush_cache()` per page. For throughput across many files I use a `ProcessPoolExecutor` with one file per worker, which scales nearly linearly on the CPU count. If a single huge file must be fast and only text is needed, I switch that step to PyMuPDF, which is ten to fifty times faster, and keep pdfplumber for the pages that need its table control.

**Q: Why does memory keep growing even though you process one page at a time?**
Because `pdf.pages` is a list that references every `Page`, and each `Page` caches its parsed objects on first access. Iterating does not release earlier pages. The fix is `page.flush_cache()` after each page, or opening in chunks with `pages=` so the list itself is short. I also avoid keeping the extracted dicts alive by converting to a DataFrame per page and appending only that.

**Q: When is Ghostscript repair worth its cost?**
Only for files that fail to open or that produce obviously wrong objects, and only once per file with the repaired copy cached. Ghostscript re-renders the whole document, which on a scanned 300-page file can take longer than the extraction, so running it unconditionally would double or triple batch time. I gate it behind an exception handler, record in the run log which files needed it, and raise the issue with the client whose generator keeps producing broken output.

## pdfplumber versus camelot, tabula and PyMuPDF

There are four serious table extractors in the Python ecosystem, and a senior document engineer knows which to reach for. They differ in speed, in how they detect tables, in what they need installed, and in how much control they give you when the automatic result is wrong. The correct answer to "which is best?" is "for which table?".

### The candidates

| Tool | Engine | Detects tables by | Needs | Output |
|---|---|---|---|---|
| pdfplumber | pdfminer.six (Python) | lines, rect edges, text alignment, explicit lines | pip only | lists of rows, `Table` objects with cell bboxes |
| camelot | pdfminer.six + OpenCV (lattice) | `lattice`: image processing of drawn lines; `stream`: text alignment | Ghostscript (lattice), OpenCV | `TableList` of DataFrames with accuracy and whitespace scores |
| tabula-py | tabula-java | `lattice` (ruling lines) or `stream` (whitespace) | Java runtime | list of DataFrames |
| PyMuPDF `find_tables()` | MuPDF (C) | vector lines and text clustering, `strategy="lines"|"lines_strict"|"text"` | pip only | `TableFinder` with `to_pandas()`, cell bboxes |

### Speed

PyMuPDF is fastest by an order of magnitude because parsing and geometry run in C; a 100-page rate schedule tables out in a couple of seconds. pdfplumber and camelot share pdfminer's speed, so expect 0.2 to 1 second per page, and camelot's lattice mode adds Ghostscript rendering plus OpenCV line detection. tabula's JVM start-up is a fixed cost of about a second, after which it is reasonably quick.

### Control

pdfplumber wins on control: independent strategies per axis, explicit lines, tolerances for every stage, and a `Table` object whose cells you can inspect and draw. PyMuPDF's `find_tables()` (added in 1.23.0) mirrors the same three strategies and accepts `vertical_lines`/`horizontal_lines` and `snap_tolerance`-style parameters, and in 1.24+ it is competitive for ruled and simple text tables, but its text strategy is less tunable. camelot exposes `table_areas`, `columns` (explicit x positions), `row_tol`, `column_tol` and reports an accuracy score per table, which is genuinely useful for QA. tabula offers `area`, `columns` and `guess`, and little else.

```python
# PyMuPDF equivalent of a pdfplumber extraction
import pymupdf
doc = pymupdf.open("wy_rate_card.pdf")
tabs = doc[0].find_tables(strategy="lines")
df = tabs[0].to_pandas()

# camelot
import camelot
tables = camelot.read_pdf("tx_rate_card.pdf", pages="1-4", flavor="stream", columns=["150,264,400"])
print(tables[0].parsing_report)     # {'accuracy': 98.3, 'whitespace': 4.1, 'order': 1, 'page': 1}
df = tables[0].df

# tabula
import tabula
dfs = tabula.read_pdf("wy_rate_card.pdf", pages="all", lattice=True)
```

### Quality on the hard cases

- **Ruled tables:** all four succeed; PyMuPDF is fastest, camelot lattice is most tolerant of slightly broken lines because it works on pixels.
- **Borderless numeric tables:** pdfplumber with explicit lines or camelot stream with `columns` are the reliable options; PyMuPDF text strategy is decent; tabula stream is hit-and-miss.
- **Merged cells and multi-line cells:** pdfplumber returns `None` for covered cells and `\n` inside wrapped cells; camelot merges text; PyMuPDF reports spans in `table.header` and cells.
- **Scanned tables:** none of them; OCR first (PyMuPDF has built-in Tesseract integration through `get_textpage_ocr()`).
- **Rotated pages:** pdfplumber and PyMuPDF handle `/Rotate`; camelot and tabula are less consistent.

### Deployment

pdfplumber and PyMuPDF are `pip install` on any platform, including Windows laptops in a BPO office and slim Docker images. camelot lattice needs Ghostscript and OpenCV, which are heavy in containers. tabula needs a JVM, which is often a non-starter in locked-down environments. Licensing matters too: PyMuPDF is AGPL (or a commercial licence from Artifex), pdfplumber and camelot are MIT, tabula-py is MIT over an Apache-licensed Java library.

### A pragmatic policy

1. Default to **pdfplumber** for anything that must be tuned, validated cell by cell, or explained to a reviewer.
2. Use **PyMuPDF** when speed matters and the tables are ruled or simple, or as the text-extraction engine in front of pdfplumber for page classification.
3. Use **camelot stream** with explicit `columns` as a second opinion on borderless tables; its accuracy score makes automated QA easier.
4. Avoid **tabula** in new projects unless the team already runs Java.

> **Interview note:** Interviewers who ask "why not camelot?" want to hear about dependencies and control, not "I have always used pdfplumber". Mention the accuracy score as something camelot does better.

### Try It Yourself

```python
import time, pdfplumber
import pymupdf                      # pip install pymupdf

PATH = "wy_rate_card.pdf"

t0 = time.perf_counter()
with pdfplumber.open(PATH) as pdf:
    p_rows = pdf.pages[0].extract_table() or []
t_plumber = time.perf_counter() - t0

t0 = time.perf_counter()
doc = pymupdf.open(PATH)
tabs = doc[0].find_tables(strategy="lines")
m_rows = tabs[0].extract() if tabs.tables else []
t_mu = time.perf_counter() - t0

print(f"pdfplumber: {len(p_rows)} rows in {t_plumber*1000:.0f} ms")
print(f"PyMuPDF   : {len(m_rows)} rows in {t_mu*1000:.0f} ms")
same = [tuple((c or "").strip() for c in r) for r in p_rows] == [tuple((c or "").strip() for c in r) for r in m_rows]
print("identical content:", same)
```

### Quiz

1. Which tool requires a Java runtime?
- [ ] camelot
- [x] tabula-py
- [ ] PyMuPDF
> tabula-py wraps tabula-java and starts a JVM.

2. Which library is fastest for ruled tables?
- [ ] pdfplumber
- [x] PyMuPDF
- [ ] camelot lattice
> MuPDF's C core makes `find_tables()` roughly an order of magnitude faster than pdfminer-based tools.

3. What does camelot provide that helps automated QA?
- [x] A per-table `parsing_report` with an accuracy score
- [ ] Built-in OCR
- [ ] Excel formatting
> `accuracy` and `whitespace` percentages let you flag doubtful tables automatically.

### Exercises

1. **Second opinion** — Extract the same page with pdfplumber and camelot stream, and print the rows where the first cell differs.
<details><summary>Solution</summary>

```python
import pdfplumber, camelot

with pdfplumber.open("tx_rate_card.pdf") as pdf:
    a = pdf.pages[0].extract_table({"vertical_strategy": "text", "horizontal_strategy": "lines"}) or []
b = camelot.read_pdf("tx_rate_card.pdf", pages="1", flavor="stream")[0].df.values.tolist()
for i, (ra, rb) in enumerate(zip(a, b)):
    if (ra[0] or "").strip() != str(rb[0]).strip():
        print(i, repr(ra[0]), "vs", repr(rb[0]))
```

</details>

2. **Fast classifier** — Use PyMuPDF to find which pages of a 300-page document contain the word "Schedule of Rates", then open only those pages with pdfplumber.
<details><summary>Solution</summary>

```python
import pymupdf, pdfplumber

doc = pymupdf.open("handbook.pdf")
hits = [i + 1 for i, page in enumerate(doc) if page.search_for("Schedule of Rates")]
print("pages:", hits)
with pdfplumber.open("handbook.pdf", pages=hits) as pdf:
    for page in pdf.pages:
        print(page.page_number, len(page.extract_table() or []), "rows")
```

</details>

### Interview Questions

**Q: Compare pdfplumber and PyMuPDF for table extraction.**
PyMuPDF's `find_tables()` is far faster because MuPDF does the geometry in C, and since 1.23 it offers the same `lines`, `lines_strict` and `text` strategies plus explicit line lists, with `to_pandas()` as a convenience. pdfplumber is slower but more transparent and tunable: independent strategies per axis, a dozen tolerances, `debug_tablefinder()` visualisation, and cell bboxes you can reason about. Licensing differs too, AGPL versus MIT. My pattern is PyMuPDF for classification and bulk text, pdfplumber for the tables that must be right, and a validation layer that does not care which produced the rows.

**Q: Why might camelot's lattice mode succeed where pdfplumber's `lines` strategy fails?**
Lattice works on a rendered image: it uses OpenCV morphological operations to find horizontal and vertical line segments in pixels, so it does not care whether the borders are lines, rects, images or even slightly misaligned segments. pdfplumber works on vector objects, so borders drawn as an embedded image, or as hundreds of tiny dashes shorter than `edge_min_length`, produce no edges. The cost is Ghostscript and OpenCV as dependencies and no per-axis control. When I hit an image-bordered table I either use camelot lattice or pdfplumber with explicit lines derived from the header words.

**Q: How do you decide on a library for a client engagement rather than a personal script?**
Deployment constraints first: can the client's machines run Java or Ghostscript, is a container allowed, is AGPL acceptable to their legal team. Then the table types in their documents, judged from a sample of five to ten files. Then maintainability: can the person who inherits the script understand why a settings dict looks the way it does, which favours pdfplumber's explicitness. Speed matters last unless volumes are large. For a title-insurance operation on locked-down Windows desktops that ruled out tabula immediately and made pdfplumber plus openpyxl the natural stack.

## Validation and QA of extracted data

Extraction is only half the job. The other half is proving that what came out matches what went in, because a rate matrix with one shifted column will price a policy wrong and nobody will notice until an underwriter audit. Good validation is layered: structural checks on the raw rows, type and range checks on the cleaned frame, cross-checks against totals printed in the document, and a human-readable report of anything doubtful.

### Layer 1: structural checks on raw rows

Run these before any cleaning, while the data still looks like the PDF.

```python
def check_structure(rows, expected_cols, where):
    problems = []
    if not rows:
        problems.append(f"{where}: no table")
        return problems
    widths = {len(r) for r in rows}
    if widths != {expected_cols}:
        problems.append(f"{where}: column counts {sorted(widths)}, expected {expected_cols}")
    empty = sum(1 for r in rows if all(c in (None, "") for c in r))
    if empty:
        problems.append(f"{where}: {empty} fully empty rows")
    return problems
```

A ragged table (rows of different widths) is the earliest, cheapest signal of a merged or phantom column.

### Layer 2: regex checks on raw strings

Before coercing to numbers, assert the *raw* strings look like what they should. This catches OCR errors and shifted columns that `to_numeric(errors="coerce")` would hide as `NaN`.

```python
import re

PATTERNS = {
    "liability_from": re.compile(r"^\$?\d{1,3}(,\d{3})*(\.\d{2})?$"),
    "liability_to":   re.compile(r"^\$?\d{1,3}(,\d{3})*(\.\d{2})?$"),
    "owner_premium":  re.compile(r"^\$?\d{1,3}(,\d{3})*\.\d{2}\*?$"),
    "loan_premium":   re.compile(r"^\$?\d{1,3}(,\d{3})*\.\d{2}\*?$"),
}

def check_patterns(df_raw):
    bad = []
    for col, pat in PATTERNS.items():
        s = df_raw[col].astype(str).str.strip()
        mask = ~s.str.fullmatch(pat) & (s != "") & (s != "None")
        for idx in df_raw.index[mask]:
            bad.append((col, idx, s[idx]))
    return bad
```

A `1O,000` (letter O) from OCR or a `$325.00 $250.00` (two values in one cell) fails here with the exact offending string in the message.

### Layer 3: semantic checks on the cleaned frame

Rate tables have invariants you can assert:

| Invariant | Check |
|---|---|
| ranges are contiguous | within each state, `liability_from` equals previous `liability_to + 1` |
| ranges are ordered | `liability_from` strictly increasing within a state |
| premiums are monotonic | `owner_premium` never decreases as liability increases |
| loan never exceeds owner (in most states) | `loan_premium <= owner_premium` |
| row count matches | `len(df) == expected[state]` |
| no duplicates | `df.duplicated(["state", "underwriter", "liability_from"]).sum() == 0` |

```python
def check_semantics(df, expected_rows):
    issues = []
    for (state, uw), g in df.groupby(["state", "underwriter"], sort=False):
        g = g.sort_values("liability_from")
        gaps = g["liability_from"].iloc[1:].values - g["liability_to"].iloc[:-1].values
        if (gaps != 1).any():
            issues.append(f"{state}/{uw}: {int((gaps != 1).sum())} non-contiguous ranges")
        if (g["owner_premium"].diff().dropna() < 0).any():
            issues.append(f"{state}/{uw}: owner premium decreases somewhere")
        exp = expected_rows.get(f"{state}-{uw}")
        if exp is not None and len(g) != exp:
            issues.append(f"{state}/{uw}: {len(g)} rows, expected {exp}")
    dups = df.duplicated(["state", "underwriter", "liability_from"]).sum()
    if dups:
        issues.append(f"{dups} duplicate range starts")
    return issues
```

### Layer 4: reconcile with numbers printed in the document

Production reports and many rate schedules print totals or counts. Extract those independently with `page.search()` and compare with your sums; a match is strong evidence the whole table came through.

```python
with pdfplumber.open("weekly_status.pdf") as pdf:
    page = pdf.pages[0]
    hit = page.search(r"Total files closed:\s*([\d,]+)")[0]
    printed = int(hit["groups"][0].replace(",", ""))
assert df["files_closed"].sum() == printed, (df["files_closed"].sum(), printed)
```

### Reporting, not just asserting

In a batch of 14 files you want *all* problems, not the first. Collect issues into a list, write them to a QA sheet in the output workbook, and exit non-zero if any are fatal. Distinguish severity: a missing footnote marker is a warning; a non-contiguous range is fatal.

```python
qa = pd.DataFrame(all_issues, columns=["source", "severity", "message"])
with pd.ExcelWriter("combined_rate_matrix.xlsx", engine="openpyxl", mode="a", if_sheet_exists="replace") as xw:
    qa.to_excel(xw, sheet_name="qa", index=False)
if (qa["severity"] == "fatal").any():
    raise SystemExit("fatal QA issues; see qa sheet")
```

> **Interview note:** "How do you know the extraction is correct?" is the question that separates people who have shipped from people who have scripted. Answer with layers, with an example of a bug each layer caught, and with the reconciliation against printed totals.

### Try It Yourself

```python
import pandas as pd, re

df = pd.read_csv("wy_rates_clean.csv")       # output of the cleaning chapter
issues = []

g = df.sort_values("liability_from").reset_index(drop=True)
gaps = g["liability_from"].iloc[1:].values - g["liability_to"].iloc[:-1].values
if (gaps != 1).any():
    issues.append(("fatal", f"{int((gaps != 1).sum())} non-contiguous ranges"))
if (g["owner_s_premium"].diff().dropna() < 0).any():
    issues.append(("fatal", "owner premium decreases"))
if (g["loan_premium"] > g["owner_s_premium"]).any():
    issues.append(("warn", "loan premium exceeds owner premium on some rows"))
if g.duplicated("liability_from").any():
    issues.append(("fatal", "duplicate range starts"))
if len(g) != 30:
    issues.append(("fatal", f"{len(g)} rows, expected 30"))

for sev, msg in issues:
    print(f"[{sev}] {msg}")
print("OK" if not issues else f"{len(issues)} issue(s)")
```

### Quiz

1. Why run regex checks on the raw strings *before* numeric coercion?
- [x] Because coercion with `errors="coerce"` hides bad values as `NaN`
- [ ] Because regex is faster than pandas
- [ ] Because pandas cannot parse currency
> The raw string shows exactly what went wrong, such as an OCR `O` instead of `0`.

2. Which invariant catches a row that was dropped from the middle of a rate table?
- [ ] Monotonic premiums
- [x] Contiguous liability ranges
- [ ] No duplicates
> A missing row leaves a gap between the previous `liability_to` and the next `liability_from`.

3. What is the point of reconciling with totals printed in the PDF?
- [x] It is an independent check that the whole table was captured
- [ ] It replaces the need for row counts
- [ ] It formats the output
> A printed total that matches your sum is strong evidence nothing was lost or shifted.

### Exercises

1. **Ragged-table detector** — For every page of a PDF, print pages whose extracted table has rows of differing widths.
<details><summary>Solution</summary>

```python
import pdfplumber

with pdfplumber.open("tx_rate_schedule.pdf") as pdf:
    for page in pdf.pages:
        rows = page.extract_table() or []
        widths = {len(r) for r in rows}
        if len(widths) > 1:
            print(f"page {page.page_number}: ragged widths {sorted(widths)}")
```

</details>

2. **QA sheet** — Build a DataFrame of `(source, severity, message)` from the checks in this chapter and write it as a sheet named `qa` in an existing workbook.
<details><summary>Solution</summary>

```python
import pandas as pd

rows = [("WY-stewart", "fatal", "2 non-contiguous ranges"), ("TX-basic", "warn", "loan > owner on 3 rows")]
qa = pd.DataFrame(rows, columns=["source", "severity", "message"])
with pd.ExcelWriter("combined_rate_matrix.xlsx", engine="openpyxl", mode="a", if_sheet_exists="replace") as xw:
    qa.to_excel(xw, sheet_name="qa", index=False)
```

</details>

### Interview Questions

**Q: How do you validate a table extracted from a PDF?**
In layers. Structurally, every row must have the expected column count and there must be no fully empty rows. Textually, each raw cell must match a regex for its column before I coerce types, so OCR confusions and merged cells are reported with the offending string. Semantically, I assert the invariants of the domain: contiguous and ordered liability ranges, monotonic premiums, loan not exceeding owner where the state requires it, exact row counts per source, no duplicates. Finally I reconcile against numbers the document itself prints, such as totals in a production report, using `page.search()`. All issues go to a QA sheet with a severity, and fatal ones stop the run. On the 3,346-row matrix the contiguity check caught a page whose last row had been clipped by a crop that was two points too high.

**Q: Give an example of a bug that only a semantic check would catch.**
Two adjacent columns swapped by a phantom empty column: every row still has the right width, every cell still matches a currency regex, and coercion succeeds, so structural and textual checks pass. But now `loan_premium` holds the owner values and vice versa, and the check `loan_premium <= owner_premium` fails on every row. Similarly a repeated header that survived removal passes the width check but fails the regex; a dropped row passes everything except contiguity. Each layer exists because the others have blind spots.

**Q: How do you make validation failures useful to a non-technical reviewer?**
I write issues to a `qa` sheet in the same workbook with source file, page, severity and a plain-English message, and I keep the provenance columns on the data so a reviewer can open the PDF at the right page. Fatal issues also stop the pipeline so a bad matrix never reaches the rating team. Over time the QA sheet becomes a log of which sources drift most, which is useful when negotiating with a client about their template.

## Packaging extraction as a reusable CLI

A script in a notebook helps you; a command-line tool helps the team. Packaging your extraction as an installable CLI means an operations analyst can run `ratex extract rate_cards/ --out matrix.xlsx` on Monday morning without opening Python, and a scheduler can run it unattended. This chapter builds that tool with the standard library's `argparse`, proper logging, exit codes, and a `pyproject.toml` entry point.

### Project layout

```text
ratex/
  pyproject.toml
  src/ratex/
    __init__.py
    cli.py
    layouts.py
    extract.py
    clean.py
    validate.py
    export.py
  tests/
    fixtures/wy_page1.pdf
    test_extract.py
```

The `src/` layout prevents accidentally importing the working copy instead of the installed package, which matters when you test what users will actually run.

### `pyproject.toml`

```toml
[project]
name = "ratex"
version = "1.2.0"
description = "Extract title-insurance rate cards into a combined Excel matrix"
requires-python = ">=3.10"
dependencies = ["pdfplumber>=0.11", "pandas>=2.0", "openpyxl>=3.1"]

[project.optional-dependencies]
ocr = ["pytesseract>=0.3"]

[project.scripts]
ratex = "ratex.cli:main"

[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"
```

`[project.scripts]` creates the `ratex` executable on install. `pip install -e .` during development, `pip install .` or a wheel for users.

### The CLI with subcommands

```python
# src/ratex/cli.py
import argparse, logging, pathlib, sys
from . import extract, clean, validate, export, layouts

log = logging.getLogger("ratex")

def build_parser():
    p = argparse.ArgumentParser(prog="ratex", description="Rate-card extraction toolkit")
    p.add_argument("-v", "--verbose", action="count", default=0)
    sub = p.add_subparsers(dest="cmd", required=True)

    e = sub.add_parser("extract", help="extract every PDF in a folder to one workbook")
    e.add_argument("folder", type=pathlib.Path)
    e.add_argument("--out", type=pathlib.Path, default=pathlib.Path("combined_rate_matrix.xlsx"))
    e.add_argument("--expect", type=int, help="expected total rows; fail if different")
    e.add_argument("--strict", action="store_true", help="treat QA warnings as fatal")

    d = sub.add_parser("debug", help="render debug images for one PDF page")
    d.add_argument("pdf", type=pathlib.Path)
    d.add_argument("--page", type=int, default=1)
    d.add_argument("--layout", required=True, choices=sorted(layouts.LAYOUTS))

    sub.add_parser("layouts", help="list known layouts")
    return p

def cmd_extract(a):
    parts, issues = [], []
    for path in sorted(a.folder.glob("*.pdf")):
        layout = layouts.LAYOUTS.get(path.stem)
        if layout is None:
            issues.append((path.stem, "fatal", "no layout registered")); continue
        raw = extract.extract_pdf(path, layout)
        df = clean.clean(raw, layout, *path.stem.split("-", 1))
        issues += validate.run(df, path.stem)
        log.info("%s: %d rows", path.name, len(df))
        parts.append(df)
    import pandas as pd
    matrix = pd.concat(parts, ignore_index=True) if parts else pd.DataFrame()
    if a.expect is not None and len(matrix) != a.expect:
        issues.append(("ALL", "fatal", f"{len(matrix)} rows, expected {a.expect}"))
    export.write_excel(matrix, a.out, qa=issues)
    fatal = [i for i in issues if i[1] == "fatal" or (a.strict and i[1] == "warn")]
    for src, sev, msg in issues:
        log.log(logging.ERROR if sev == "fatal" else logging.WARNING, "%s: %s", src, msg)
    return 2 if fatal else 0

def main(argv=None):
    a = build_parser().parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if a.verbose > 1 else logging.INFO if a.verbose else logging.WARNING,
                        format="%(levelname)s %(message)s", stream=sys.stderr)
    try:
        if a.cmd == "extract":
            return cmd_extract(a)
        if a.cmd == "debug":
            return cmd_debug(a)
        if a.cmd == "layouts":
            print("\n".join(sorted(layouts.LAYOUTS))); return 0
    except Exception as e:
        log.error("%s", e, exc_info=a.verbose > 1)
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

### Exit codes and logging discipline

| Code | Meaning | Who cares |
|---|---|---|
| 0 | success, no fatal issues | scheduler marks the job green |
| 1 | crashed (bad path, unreadable PDF, bug) | on-call person |
| 2 | ran but QA found fatal issues | the analyst, via the qa sheet |

Log to `stderr` so `stdout` stays clean for piping; use `-v` for progress and `-vv` for stack traces. Never `print()` inside library modules.

### Configuration and layouts

Keep `layouts.py` as Python data so it can hold callables, but allow an override file for analysts: `--layouts extra.json` that merges additional entries. Version the registry with the package (`ratex layouts` prints them) so a bug report can say "ratex 1.2.0, layout TX-basic".

### Tests

```python
# tests/test_extract.py
import pathlib, pdfplumber
from ratex import extract, layouts

FIX = pathlib.Path(__file__).parent / "fixtures"

def test_wy_page1_has_four_columns():
    raw = extract.extract_pdf(FIX / "WY-stewart.pdf", layouts.LAYOUTS["WY-stewart"])
    assert raw.shape[1] >= 4
    assert (raw.iloc[:, :4].notna().all(axis=1)).sum() >= 28
```

Fixtures are one-page PDFs with client identifiers removed. A test per layout costs seconds and is the thing that tells you a pdfplumber upgrade changed word grouping.

> **Tip:** Pin `pdfplumber` to a minor version in `dependencies` and bump it deliberately. Word-grouping and table-finding defaults have changed between minor releases (for example the direction arguments in 0.11), and a silent upgrade on the analyst's laptop is how a working tool starts producing different columns.

### Try It Yourself

```python
import argparse, logging, pathlib, sys, pdfplumber

def main(argv=None):
    p = argparse.ArgumentParser(prog="pdfcount", description="Count table rows per page")
    p.add_argument("pdf", type=pathlib.Path)
    p.add_argument("--pages", help="e.g. 1-3,7")
    p.add_argument("-v", action="count", default=0)
    a = p.parse_args(argv)
    logging.basicConfig(level=logging.INFO if a.v else logging.WARNING, stream=sys.stderr)

    pages = None
    if a.pages:
        pages = []
        for part in a.pages.split(","):
            lo, _, hi = part.partition("-")
            pages += list(range(int(lo), int(hi or lo) + 1))
    if not a.pdf.exists():
        logging.error("no such file: %s", a.pdf); return 1
    total = 0
    with pdfplumber.open(a.pdf, pages=pages) as pdf:
        for page in pdf.pages:
            n = len(page.extract_table() or [])
            logging.info("page %d: %d rows", page.page_number, n)
            print(f"{page.page_number}\t{n}")
            total += n
    print(f"total\t{total}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

### Quiz

1. Which `pyproject.toml` table creates a console command on install?
- [ ] `[project.dependencies]`
- [x] `[project.scripts]`
- [ ] `[build-system]`
> `ratex = "ratex.cli:main"` makes pip generate a `ratex` executable that calls `main()`.

2. Why log to `stderr` rather than `stdout`?
- [x] So machine-readable output on `stdout` can be piped without log noise
- [ ] Because `stdout` is slower
- [ ] Because argparse requires it
> Separating channels lets `ratex extract ... | tee` and schedulers capture each stream appropriately.

3. What should exit code 2 mean in the design above?
- [ ] The program crashed
- [x] The run completed but QA found fatal data issues
- [ ] Verbose mode was enabled
> Distinct codes let a scheduler distinguish a bug from bad data.

### Exercises

1. **Page-range parser** — Write `parse_pages("1-3,7,10-12")` returning `[1,2,3,7,10,11,12]`, with a `ValueError` for malformed input.
<details><summary>Solution</summary>

```python
def parse_pages(spec):
    out = []
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        lo, sep, hi = part.partition("-")
        if not lo.isdigit() or (sep and not hi.isdigit()):
            raise ValueError(f"bad page spec: {part!r}")
        out += list(range(int(lo), int(hi or lo) + 1))
    return out
```

</details>

2. **`debug` subcommand** — Implement `cmd_debug(a)` that renders the requested page with `debug_tablefinder` using the named layout's settings and writes `debug_<stem>_p<page>.png`.
<details><summary>Solution</summary>

```python
def cmd_debug(a):
    layout = layouts.LAYOUTS[a.layout]
    with pdfplumber.open(a.pdf, pages=[a.page]) as pdf:
        page = pdf.pages[0].within_bbox(layout["crop"], strict=False)
        im = page.to_image(resolution=120)
        im.debug_tablefinder(layout["settings"])
        out = f"debug_{a.pdf.stem}_p{a.page}.png"
        im.save(out)
    print(out)
    return 0
```

</details>

### Interview Questions

**Q: How would you turn a working extraction script into something an operations team can run?**
Package it: a `src/` layout, a `pyproject.toml` with pinned dependencies and a `[project.scripts]` entry point, and an `argparse` CLI with subcommands for the real tasks, such as `extract`, `debug` and `layouts`. Logging goes to `stderr` with `-v` levels, results and QA issues go to the workbook, and exit codes distinguish crash from data failure so a scheduler can react. Fixture-based tests per layout protect against dependency upgrades. I also write a one-page README with the three commands people actually run. The goal is that the person running it on Monday never needs to read the code.

**Q: What are the pitfalls of distributing a pdfplumber-based tool to Windows desktops?**
Path handling with spaces and backslashes, which `pathlib` solves; Ghostscript not being installed, so `repair=True` must be optional and its absence reported clearly; antivirus scanning slowing file I/O; and Python version drift across machines. I ship a `requirements.txt` with exact pins or a `pipx`-installable wheel, and I make the tool print its own version and pdfplumber's version at `-v` so support tickets are diagnosable. For pytesseract the Tesseract binary path must be configurable via an environment variable rather than assumed.

**Q: How do you version a layout registry that changes when clients change templates?**
The registry lives in the package and follows its semantic version: a new layout or a tolerance tweak is a patch, a change to the output columns is a minor, and a change to the workbook structure is a major. Each layout entry carries a `since` date and the fixture that validates it. Analysts can add temporary overrides through `--layouts extra.json`, and anything that survives a month gets promoted into the package with a test. That keeps the tool stable while letting the people closest to the documents react quickly.

## pdfplumber interview questions

This chapter is a rehearsal. The questions below are the ones that come up when a document-engineering or data-reporting role involves PDFs, grouped by what the interviewer is really probing: fundamentals, algorithm understanding, judgement under messy inputs, and production practice. Say the concise version first, then offer a concrete example from your own work; the examples in the model answers come from the rate-matrix and production-report pipelines built through this course.

### What interviewers are actually testing

| Question style | What they want to see |
|---|---|
| "What is the difference between X and Y?" | precise vocabulary: char/word/line, crop/within_bbox, lines/text strategy |
| "Why did this extraction go wrong?" | that you reason from the algorithm, not from trial and error |
| "How would you handle...?" | a decision tree with a fallback at every branch |
| "How do you know it is correct?" | layered validation and reconciliation |
| "Which library and why?" | trade-offs, dependencies, licensing, not brand loyalty |

Prepare one story per row of that table. A story is a specific document, the thing that went wrong, the line of code or the setting that fixed it, and the check you added so it cannot recur. Interviewers remember "the Crystal Reports rate card with double-drawn characters that `dedupe_chars()` fixed" long after they have forgotten a list of method names, and a story also proves you have shipped rather than read.

### Fundamentals to have cold

- pdfplumber wraps pdfminer.six; objects are dicts with `x0/x1/top/bottom` (top-left origin) plus `y0/y1` (bottom-left); `doctop` is document-wide.
- `extract_text()` is `extract_words()` plus line joining; `x_tolerance` and `y_tolerance` govern grouping; `layout=True` pads to mirror position.
- The table finder: edges (lines, rect edges, text alignment or explicit) → snap and join → intersections → cells → tables → cell text.
- `crop` clips intersecting objects; `within_bbox` keeps fully contained objects; `filter` uses a predicate.
- `to_image()` (pypdfium2 since 0.10) and `debug_tablefinder()` are how you see what the algorithm sees.
- Scans have no chars; OCR at 300 dpi and flag the rows; `(cid:n)` means a missing ToUnicode map.

### A ten-minute whiteboard exercise you may be given

"Here is a borderless two-column rate table with right-aligned premiums. Extract it." The strong answer, spoken aloud while sketching:

```python
words = page.extract_words(extra_attrs=["size"])
rows = cluster_objects(words, lambda w: w["top"], tolerance=3)     # rows by baseline
right_edges = cluster_objects(words, lambda w: w["x1"], tolerance=2)  # numeric columns align right
# choose column boundaries midway between the strongest right-edge clusters, then:
settings = {"vertical_strategy": "explicit", "explicit_vertical_lines": edges,
            "horizontal_strategy": "text"}
table = page.extract_table(settings)
```

Then say how you would validate it: row count against a manual count, contiguous ranges, currency regex, and a debug image checked into the repo.

> **Interview note:** If you do not know a parameter's exact default, say "around 3 points, I would confirm in the docs" rather than guessing a number confidently. Interviewers penalise false precision more than honest approximation.

### Try It Yourself

```python
# A compact self-test: run against any ruled rate card and explain each printed line aloud.
import pdfplumber
from pdfplumber.utils import cluster_objects

with pdfplumber.open("wy_rate_card.pdf") as pdf:
    page = pdf.pages[0]
    print("objects:", {k: len(v) for k, v in page.objects.items()})
    words = page.extract_words(extra_attrs=["fontname", "size"])
    print("rows by top:", len(cluster_objects(words, lambda w: w["top"], 3)))
    print("cols by x0 :", len([c for c in cluster_objects(words, lambda w: w["x0"], 5) if len(c) >= 3]))
    t = page.find_table()
    print("table bbox :", tuple(round(v) for v in t.bbox) if t else None)
    rows = t.extract() if t else []
    print("rows x cols:", len(rows), "x", len(rows[0]) if rows else 0)
    print("header     :", rows[0] if rows else None)
```

### Quiz

1. An interviewer asks why two adjacent numeric columns merged under the `text` strategy. The best first answer is:
- [ ] "The PDF is corrupt"
- [x] "Right-aligned numbers have scattered left edges, so no strong vertical edge forms between them"
- [ ] "pdfplumber cannot handle numbers"
> Reasoning from the algorithm shows understanding; the fix is tolerances or explicit lines.

2. Which pair correctly describes `crop` and `within_bbox`?
- [x] `crop` keeps and clips intersecting objects; `within_bbox` keeps only fully contained objects
- [ ] Both are identical
- [ ] `crop` is for text, `within_bbox` is for tables
> The difference matters exactly at boundaries where chars straddle the box.

3. "How do you know the extraction is correct?" A strong answer emphasises:
- [ ] Opening the PDF and eyeballing it
- [x] Layered checks: structure, regex on raw strings, domain invariants, reconciliation with printed totals
- [ ] Trusting the library defaults
> Layers have complementary blind spots; reconciliation with the document is the independent check.

### Exercises

1. **Explain a settings dict** — Write, in three sentences each, why every key in `{"vertical_strategy": "explicit", "explicit_vertical_lines": [36, 150, 264, 400, 576], "horizontal_strategy": "lines", "join_tolerance": 6}` is there.
<details><summary>Solution</summary>

`vertical_strategy: explicit` because the columns are borderless and right-aligned, so automatic detection was unstable; the five x positions were read off a `draw_vlines` debug image and sit in the gutters, giving four columns. `horizontal_strategy: lines` because the source draws a rule under every row, which is the most reliable edge source available. `join_tolerance: 6` because those rules are drawn as dashed segments with gaps of roughly 4 pt, and the default of 3 left them fragmented and shorter than `edge_min_length`.

</details>

2. **Mock interview** — Record yourself answering "Walk me through the table-finding algorithm" in under ninety seconds, then check you named all five stages.
<details><summary>Solution</summary>

The five stages to name: (1) collect candidate edges from lines, rect borders, text alignment or explicit lists; (2) snap near-parallel edges and join collinear segments, dropping ones shorter than `edge_min_length`; (3) compute intersections between vertical and horizontal edges within `intersection_tolerance`; (4) build cells from intersection quads and group touching cells into tables; (5) extract the chars inside each cell using the `text_*` tolerances.

</details>

### Interview Questions

**Q: What is pdfplumber best at, and when would you not use it?**
It is best at precise, tunable extraction of text and tables from text-based PDFs where you need coordinates: rate cards, closing statements, production reports, forms. Its explicit-line strategy and debug images make results explainable to a reviewer. I would not use it for scanned documents without an OCR front-end, for high-volume plain text extraction where PyMuPDF is ten times faster, for editing or rendering PDFs, or for image-bordered tables where camelot's lattice mode sees lines that pdfplumber's vector model cannot. It is one tool in a stack, and the validation layer should be independent of which tool produced the rows.

**Q: Tell me about a hard extraction problem and how you solved it.**
Combining 14 underwriters' rate cards into one 3,346-row matrix. The layouts ranged from fully ruled Word tables to borderless Crystal Reports output with fake-bold duplicated characters and one underwriter whose PDF had a `/Rotate 90` landscape appendix. I built a layout registry with per-source settings, used `dedupe_chars()` on the Crystal source, explicit vertical lines derived from header word positions on the borderless ones, and a validation layer that asserted contiguous liability ranges and row counts per source. The contiguity check caught a clipped last row on one page and the row-count check caught a page that had silently returned `None` after a template change. The pipeline now runs weekly as a CLI with a QA sheet in the workbook.

**Q: How do `x_tolerance` and `y_tolerance` interact with table extraction?**
They are used twice. The `text` strategies use word positions, so the word extractor's tolerances determine which edges exist; and cell text is read with `extract_words` using the `text_x_tolerance`/`text_y_tolerance` keys of the settings dict, so a condensed font that needs `x_tolerance=1.5` for `extract_text()` needs `"text_x_tolerance": 1.5` in the table settings too. Forgetting the second one is a classic cause of "the table is found but the cells contain glued words". I set both from the same constant in the layout registry.

**Q: What would you do in your first week maintaining someone else's pdfplumber pipeline?**
Run it on the fixtures and on last week's real inputs, and diff the outputs against the last accepted workbook to establish a baseline. Read the settings registry and regenerate the debug images for each layout so I understand why each setting exists. Check the pinned pdfplumber version against the installed one, since word-grouping defaults have changed across minor releases. Add any missing validation, especially row counts and contiguity, before changing anything else. Only then start on the backlog, because the baseline and the checks are what let me change code without silently changing premiums.

**Q: How do you explain a failed extraction to a non-technical client?**
With a picture. I send the `debug_tablefinder` image with the detected cells overlaid, point at the column the algorithm missed, and explain that their template draws that boundary as an image rather than a line, or that the values are aligned inconsistently. Then I give them two options: I add an explicit boundary on my side, which works until their template changes again, or they export with a real table grid, which fixes it permanently. Clients respond well to seeing the cause and being offered a choice, and it usually leads to a cleaner template that benefits every future extraction.

