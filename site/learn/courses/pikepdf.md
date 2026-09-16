---
id: pikepdf
title: pikepdf
icon: 🔐
track: Document Engineering
color: #7D3C98
runner: none
tagline: Low-level, standards-correct PDF manipulation built on qpdf.
description: pikepdf from first open to expert object-level editing: the PDF object model (dictionaries, arrays, streams, names), pages and page trees, merging/splitting/rotating, metadata (Info & XMP), encryption and permissions, linearization, repairing damaged files, attachments, form field internals, content streams, images, and compliance checks.
---

# LEVEL: Beginner

## Installing, opening and saving

pikepdf is a Python library built on **qpdf**, the C++ toolkit that Adobe-level tools use to inspect and repair PDFs. Where PyMuPDF thinks in pages and pixels, pikepdf thinks in PDF **objects**: it gives you the file exactly as the specification describes it, and it writes files that are structurally correct down to the byte. That makes it the tool for encryption, metadata, repair and anything a picky validator complains about.

### Installing

pikepdf ships wheels with qpdf bundled, so there is nothing to compile on Windows, macOS or Linux:

```bash
python -m pip install --upgrade pikepdf
python -c "import pikepdf; print(pikepdf.__version__, pikepdf.__libqpdf_version__)"
```

You should see something like `9.x.x 11.x.x`. pikepdf 9 needs Python 3.9 or newer. Pillow is installed automatically for image support.

### Opening

```python
import pikepdf

pdf = pikepdf.open("policy_manual.pdf")
print(len(pdf.pages))          # 135
print(pdf.pdf_version)         # '1.7'
print(pdf.is_encrypted)        # False
print(pdf.filename)
pdf.close()
```

`pikepdf.open()` (an alias of `pikepdf.Pdf.open()`) accepts a path, a `pathlib.Path`, or a binary file object such as `io.BytesIO`. It returns a `Pdf`. Like any file, use it as a context manager so it closes reliably:

```python
with pikepdf.open("policy_manual.pdf") as pdf:
    print(len(pdf.pages), "pages")
```

Useful keyword arguments:

| Argument | Meaning |
|---|---|
| `password="..."` | user or owner password for encrypted files |
| `allow_overwriting_input=True` | lets you `save()` back to the same path |
| `attempt_recovery=True` | (default) try to repair a damaged cross-reference table |
| `suppress_warnings=True` | (default) hide qpdf warnings; read them later with `pdf.get_warnings()` |
| `inherit_page_attributes=True` | (default) push inherited page attributes such as MediaBox down onto each page |

### Saving

```python
with pikepdf.open("policy_manual.pdf") as pdf:
    pdf.save("policy_manual_copy.pdf")
```

`save()` always writes a **complete, freshly serialised** file: qpdf re-walks the object graph, drops unreferenced objects, recompresses streams and writes a clean cross-reference table. There is no incremental-update mode, which is a feature for archival work and a limitation for signed documents (saving invalidates existing digital signatures).

By default you cannot save over the file you opened, because pikepdf still reads lazily from it:

```python
pdf = pikepdf.open("draft.pdf")
pdf.save("draft.pdf")     # raises ValueError: Cannot overwrite input file
```

Pass `allow_overwriting_input=True` to `open()` when you really want in-place editing. pikepdf then reads the whole file into memory first, so it is safe, at the cost of RAM.

### Creating a new PDF

```python
pdf = pikepdf.new()
pdf.add_blank_page(page_size=(612, 792))     # US Letter, in points
pdf.save("blank.pdf")
```

`pikepdf.new()` returns an empty document with a catalog and an empty page tree. `add_blank_page` is the quickest way to get a page to draw on later.

### Saving to memory

```python
import io
buf = io.BytesIO()
pdf.save(buf)
data = buf.getvalue()          # bytes ready for an HTTP response or S3
```

### Errors you will meet

| Exception | Cause |
|---|---|
| `pikepdf.PasswordError` | file is encrypted and the password is missing or wrong |
| `pikepdf.PdfError` | qpdf could not parse the file even after recovery |
| `FileNotFoundError` | wrong path |
| `pikepdf.ForeignObjectError` | you assigned an object from one `Pdf` into another without copying |

> **Tip:** Even when a file opens fine, call `pdf.get_warnings()` after `open()` in a batch job and log the result. "xref table damaged, reconstructing" on a client upload tells you the file has been mangled somewhere upstream, which is worth knowing before you promise a turnaround.

### Try It Yourself

```python
import pikepdf, sys

path = sys.argv[1] if len(sys.argv) > 1 else "policy_manual.pdf"
try:
    with pikepdf.open(path) as pdf:
        print("pikepdf", pikepdf.__version__, "| qpdf", pikepdf.__libqpdf_version__)
        print("File     :", pdf.filename)
        print("Version  :", pdf.pdf_version)
        print("Pages    :", len(pdf.pages))
        print("Encrypted:", pdf.is_encrypted)
        print("Objects  :", len(pdf.objects))
        warnings = pdf.get_warnings()
        print("Warnings :", warnings if warnings else "none")
        pdf.save(path.replace(".pdf", "_resaved.pdf"))
        print("saved a clean copy")
except pikepdf.PasswordError:
    print("Encrypted: pass password='...' to pikepdf.open()")
except pikepdf.PdfError as e:
    print("qpdf could not parse the file:", e)
```

### Quiz

1. What does `pdf.save()` do to the file structure?
- [ ] Appends the changes to the end of the file
- [x] Rewrites the whole file with a fresh, clean cross-reference table
- [ ] Only updates the changed pages in place
> pikepdf always serialises a complete new file; there is no incremental update.

2. How do you save back to the same path you opened?
- [ ] It always works
- [x] Open with `allow_overwriting_input=True`
- [ ] Call `pdf.save()` with no arguments
> Without that flag, pikepdf raises an error because it still reads lazily from the input.

3. Which exception signals a wrong or missing password?
- [x] `pikepdf.PasswordError`
- [ ] `pikepdf.PdfError`
- [ ] `PermissionError`
> `PasswordError` is raised by `open()` for encrypted files that cannot be unlocked.

### Exercises

1. **Re-save everything** — Walk a folder, open every PDF, and write a clean copy to `clean/`, printing any qpdf warnings per file.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib

out = pathlib.Path("clean"); out.mkdir(exist_ok=True)
for f in sorted(pathlib.Path("inbox").glob("*.pdf")):
    try:
        with pikepdf.open(f) as pdf:
            pdf.save(out / f.name)
            for w in pdf.get_warnings():
                print(f"{f.name}: WARNING {w}")
    except pikepdf.PdfError as e:
        print(f"{f.name}: FAILED {e}")
```

</details>

2. **Blank separator sheets** — Create a new PDF with three blank A4 pages (595 × 842 pt) and save it.
<details><summary>Solution</summary>

```python
import pikepdf

pdf = pikepdf.new()
for _ in range(3):
    pdf.add_blank_page(page_size=(595, 842))
pdf.save("separators.pdf")
print(len(pdf.pages), "pages")
```

</details>

### Interview Questions

**Q: What is pikepdf and how does it relate to qpdf?**
pikepdf is a Python binding, written with pybind11, around qpdf, a mature C++ library for reading, transforming and writing PDF at the object level. qpdf is the engine behind the `qpdf` command-line tool that many document teams use for `--check`, `--linearize` and `--decrypt`; pikepdf exposes the same capabilities as Python objects that behave like dicts, lists and bytes. It does not render pages or extract text, so it is usually paired with PyMuPDF or pdfplumber, but for structural correctness, encryption and repair it is the most trustworthy Python option, and its MPL licence is friendlier for commercial products than PyMuPDF's AGPL.

**Q: Why does pikepdf refuse to save over its input by default?**
Because `Pdf.open` reads objects lazily from the file as you touch them; overwriting that file mid-read would corrupt both the source and the output. With `allow_overwriting_input=True`, pikepdf reads the entire file into memory at open time so the on-disk file is no longer needed, which is safe but costs RAM proportional to the file size. In pipelines I prefer writing to a temporary path and renaming atomically afterwards, which also protects the original if the process dies half-way through the write.

**Q: What are the consequences of pikepdf always rewriting the whole file?**
The output is clean: unreferenced objects vanish, streams are recompressed, the xref is rebuilt, and object numbers may change. That is ideal for repair and optimisation, but it breaks anything that depends on the original bytes, most importantly existing digital signatures, which become invalid, and incremental-update history, which is discarded. It also means a save is proportional to file size, so appending one annotation to a 500 MB scan costs a full rewrite, which is where PyMuPDF's incremental save is the better tool.

## The PDF object model

To use pikepdf well you need the mental model of a PDF file: a graph of eight kinds of objects that the specification defines. pikepdf maps each kind to a Python type, so once you know the eight, you can read any PDF structure and change it.

### The eight object types

| PDF type | Example in a file | pikepdf type | Python feel |
|---|---|---|---|
| Boolean | `true` | `bool` | `True` |
| Integer / Real | `42`, `3.5` | `int`, `Decimal` | numbers |
| String | `(Hello)` or `<48656C6C6F>` | `pikepdf.String` | `str`/`bytes` |
| Name | `/Type` | `pikepdf.Name` | an atom starting with `/` |
| Array | `[0 0 612 792]` | `pikepdf.Array` | list |
| Dictionary | `<< /Type /Page >>` | `pikepdf.Dictionary` | dict with Name keys |
| Stream | dictionary + binary data | `pikepdf.Stream` | dict plus bytes |
| Null | `null` | `None` | `None` |

Everything else in a PDF (pages, fonts, images, annotations, the catalog) is just a dictionary or a stream with agreed keys.

### Names

```python
import pikepdf
from pikepdf import Name

Name.Type                # /Type
Name("/Type")            # same thing
Name.Type == Name("/Type")   # True
```

Names are interned atoms. Attribute access `Name.Foo` is convenient; the string form is needed when the name contains characters that are not valid Python identifiers, such as `Name("/Fx-1")`.

### Dictionaries

```python
with pikepdf.open("sop.pdf") as pdf:
    page = pdf.pages[0].obj          # the underlying Dictionary
    print(page.Type)                 # /Page
    print(page["/MediaBox"])         # [0 0 612 792]
    print(page.get("/Rotate", 0))    # 0 if absent
    print(Name.Annots in page)       # True/False
    for key, value in page.items():
        print(key, type(value).__name__)
```

Keys are names; you can use attribute style (`page.MediaBox`) or item style (`page["/MediaBox"]`). Assignment works the same way, and values may be any of the eight types or plain Python values, which pikepdf converts:

```python
page.Rotate = 90
page["/CustomTag"] = pikepdf.String("Reviewed")
del page["/CustomTag"]
```

### Arrays and numbers

```python
mb = page.MediaBox
print(list(mb))                      # [Decimal('0'), Decimal('0'), Decimal('612'), Decimal('792')]
print(float(mb[2]) / 72, "inches wide")
page.MediaBox = pikepdf.Array([0, 0, 595, 842])   # switch to A4
```

Reals come back as `Decimal` to preserve exact values; convert with `float()` when you need arithmetic.

### Strings

PDF strings may be text or arbitrary bytes. `pikepdf.String` converts to `str` (decoding PDFDocEncoding or UTF-16) or `bytes`:

```python
title = pdf.docinfo.get("/Title")
print(str(title), bytes(title))
pdf.docinfo["/Title"] = "Data Processing SOP v3"   # plain str is converted
```

### Streams

A stream is a dictionary plus binary data, used for page content, images, fonts and XMP:

```python
content = pdf.pages[0].Contents      # a Stream (or an Array of Streams)
print(content.Length, content.get("/Filter"))
raw = content.read_raw_bytes()       # still compressed
data = content.read_bytes()          # decoded, e.g. b'BT /F1 12 Tf 72 720 Td (Hello) Tj ET'
print(data[:80])
```

Create one with `pdf.make_stream(b"...")` or `pikepdf.Stream(pdf, b"...")`; write new data with `stream.write(data, filter=Name.FlateDecode)`.

### Direct versus indirect objects

An object stored inline is **direct**; one stored separately with an object number like `12 0 obj` is **indirect**, and other objects refer to it. Pages and streams must be indirect. `obj.is_indirect` tells you which, `obj.objgen` gives the `(number, generation)` pair, and `pdf.make_indirect(obj)` promotes a direct object so it can be shared:

```python
box = pikepdf.Dictionary(Type=Name.Annot, Subtype=Name.Square, Rect=[72, 72, 200, 120])
ind = pdf.make_indirect(box)
print(ind.is_indirect, ind.objgen)  # True (231, 0)
```

### Walking from the trailer

```python
print(pdf.trailer.keys())          # /Root, /Info, /ID, /Size ...
print(pdf.Root.keys())             # /Type /Pages /Metadata /Outlines /AcroForm ...
print(pdf.Root.Pages.Count)        # page count as stored
print(pdf.docinfo)                 # the /Info dictionary
```

`pdf.Root` is the catalog. Every structure you will edit in this course hangs off it.

> **Warning:** `repr(obj)` prints the object in PDF syntax, which is fantastic for learning but will dump megabytes if the object is an image stream. Use `obj.keys()` or `obj.stream_dict` on streams first.

### Try It Yourself

```python
import pikepdf
from pikepdf import Name

with pikepdf.open("sop.pdf") as pdf:
    print("Trailer keys:", list(pdf.trailer.keys()))
    print("Catalog keys:", list(pdf.Root.keys()))
    page = pdf.pages[0].obj
    print("Page keys   :", list(page.keys()))
    print("MediaBox    :", [float(v) for v in page.MediaBox])
    print("Rotate      :", page.get("/Rotate", 0))
    print("Resources   :", list(page.Resources.keys()))
    fonts = page.Resources.get("/Font", pikepdf.Dictionary())
    for name, font in fonts.items():
        print(f"  font {name}: {font.get('/BaseFont')} ({font.get('/Subtype')})")
    c = page.Contents
    stream = c if isinstance(c, pikepdf.Stream) else c[0]
    print("Content start:", stream.read_bytes()[:100])
```

### Quiz

1. Which pikepdf type represents `/Type`?
- [ ] `pikepdf.String`
- [x] `pikepdf.Name`
- [ ] `str`
> Names are atoms beginning with a slash; strings are `(...)` or `<...>` literals.

2. What does `stream.read_bytes()` return?
- [x] The decoded (decompressed) data
- [ ] The raw compressed data
- [ ] The stream dictionary
> `read_raw_bytes()` gives the stored bytes; `read_bytes()` applies the filters.

3. What does `pdf.make_indirect(obj)` do?
- [ ] Deletes the object
- [x] Stores the object with its own object number so it can be referenced from several places
- [ ] Converts it to a stream
> Indirect objects are shared by reference; pages and streams must be indirect.

### Exercises

1. **Object census** — Count how many objects in a PDF are dictionaries, streams and arrays, and how many streams are images (`/Subtype /Image`).
<details><summary>Solution</summary>

```python
import pikepdf, collections
from pikepdf import Name

counts = collections.Counter()
with pikepdf.open("sop.pdf") as pdf:
    for obj in pdf.objects:
        if isinstance(obj, pikepdf.Stream):
            counts["stream"] += 1
            if obj.get("/Subtype") == Name.Image:
                counts["image"] += 1
        elif isinstance(obj, pikepdf.Dictionary):
            counts["dictionary"] += 1
        elif isinstance(obj, pikepdf.Array):
            counts["array"] += 1
print(dict(counts))
```

</details>

2. **Set a custom key** — Add `/Department (Production Support)` to the Info dictionary and verify by reopening.
<details><summary>Solution</summary>

```python
import pikepdf

with pikepdf.open("sop.pdf") as pdf:
    pdf.docinfo["/Department"] = "Production Support"
    pdf.save("sop_dept.pdf")
with pikepdf.open("sop_dept.pdf") as check:
    print(str(check.docinfo["/Department"]))
```

</details>

### Interview Questions

**Q: Describe the structure of a PDF file at the object level.**
A PDF is a header, a body of numbered indirect objects, a cross-reference table giving each object's byte offset, and a trailer pointing at the catalog (`/Root`) and the Info dictionary. Objects are one of eight types: booleans, numbers, strings, names, arrays, dictionaries, streams and null. The catalog references the page tree, whose leaf `/Page` dictionaries reference content streams and a `/Resources` dictionary of fonts, images and graphics states. Everything else, from bookmarks to form fields to XMP metadata, is a dictionary or stream reachable from the catalog, which is why pikepdf can express any edit as ordinary dictionary manipulation.

**Q: What is the difference between a direct and an indirect object, and when does it matter?**
A direct object is written inline where it is used; an indirect object has an object number and is referenced with `n g R`, so several places can share it and it can be updated independently. The specification requires streams and pages to be indirect, and sharing is how one embedded font serves 500 pages. In pikepdf, assigning a large dictionary directly into several places duplicates it on save; calling `pdf.make_indirect()` first creates one object that all references point to. It also matters for foreign objects: you cannot reference an indirect object from another `Pdf` without `copy_foreign`.

**Q: Why does pikepdf return `Decimal` for real numbers?**
PDF real numbers are decimal text in the file, and converting them to binary floats could change their textual representation on rewrite, for example `0.1` becoming `0.10000000000000001`. Preserving them as `Decimal` keeps round-tripping exact, which matters for PDF/A validators and for byte-for-byte comparisons in tests. When you need arithmetic, convert with `float()` and convert back when assigning; pikepdf accepts Python floats and writes them with a sensible precision.

## Pages and the page tree

Pages in a PDF are leaves of a **page tree**: the catalog points to a root `/Pages` node, which holds `/Kids` that are either further `/Pages` nodes or `/Page` leaves. Viewers walk this tree to find page N. pikepdf hides the tree behind `pdf.pages`, a list-like object, but knowing the tree explains a whole class of bugs in broken files.

### The `pages` list

```python
import pikepdf

with pikepdf.open("handbook.pdf") as pdf:
    print(len(pdf.pages))
    first = pdf.pages[0]           # a pikepdf.Page
    last  = pdf.pages[-1]
    for i, page in enumerate(pdf.pages):
        print(i, page.mediabox)
```

`pdf.pages` supports indexing, negative indices, slicing, iteration, `len`, `del`, `append`, `extend`, `insert` and `reverse`. Indices are **zero-based**; the helper `pdf.pages.p(1)` returns the first page using one-based numbering, matching what a viewer displays.

### The `Page` object

`pdf.pages[i]` returns a `Page`, a convenience wrapper around the underlying `/Page` dictionary, which is available as `page.obj`. Attribute access falls through to the dictionary:

```python
page = pdf.pages[0]
print(page.MediaBox)              # raw array from the dictionary
print(page.mediabox)              # helper property, same values
print(page.get("/Rotate", 0))
print(page.Resources.keys())
print(page.index, page.label)     # position, and the page label if defined
```

Important page keys:

| Key | Meaning |
|---|---|
| `/Type /Page` | marks a leaf |
| `/Parent` | the `/Pages` node above it |
| `/MediaBox` | physical page rectangle in points |
| `/CropBox`, `/TrimBox`, `/BleedBox`, `/ArtBox` | optional sub-rectangles |
| `/Rotate` | 0, 90, 180, 270 |
| `/Contents` | a content stream or an array of them |
| `/Resources` | fonts, images, graphics states used by `/Contents` |
| `/Annots` | array of annotation dictionaries |

### Inherited attributes

`/MediaBox`, `/CropBox`, `/Rotate` and `/Resources` may be stored on a parent `/Pages` node and inherited by all children. A page dictionary might therefore lack `/MediaBox` entirely. pikepdf's default `inherit_page_attributes=True` pushes these down when opening, so `page.MediaBox` works, but if you build pages by hand or walk `pdf.Root.Pages` yourself, remember that inheritance exists.

### Walking the tree manually

```python
def walk(node, depth=0):
    kind = node.Type
    if kind == pikepdf.Name.Pages:
        print("  " * depth + f"Pages node with {node.Count} pages, {len(node.Kids)} kids")
        for kid in node.Kids:
            walk(kid, depth + 1)
    else:
        print("  " * depth + f"Page {[float(v) for v in node.MediaBox]}")

walk(pdf.Root.Pages)
```

Well-formed files from Word have a flat tree; large files from InDesign or after many merges have balanced trees with several levels. A tree whose `/Count` values do not add up, or whose `/Kids` contain a loop, is the usual reason a viewer says "page not found" and qpdf reports "page tree damaged".

### Adding pages

```python
blank = pdf.add_blank_page(page_size=(612, 792))      # appended at the end
pdf.pages.insert(0, blank)                            # move a page reference to the front (copies)
del pdf.pages[-1]                                     # remove the original position
```

To add pages from another file, use `append` or `extend`; pikepdf copies the page and all of its resources into the target automatically:

```python
with pikepdf.open("cover.pdf") as cover:
    pdf.pages.insert(0, cover.pages[0])
```

### Page boxes as `Rectangle`

pikepdf 8 and later offer `pikepdf.Rectangle`:

```python
r = pikepdf.Rectangle(page.mediabox)
print(r.width, r.height, r.llx, r.lly, r.urx, r.ury)
page.cropbox = pikepdf.Rectangle(36, 36, r.urx - 36, r.ury - 36)   # trim half an inch
```

`Rectangle` uses PDF's bottom-left origin: `llx, lly` is the lower-left corner and `urx, ury` the upper-right. This is different from PyMuPDF's top-left origin.

> **Interview note:** Interviewers like to ask why a PDF might display 10 pages in one viewer and 12 in another. The answer is a damaged page tree: `/Count` claims one number while `/Kids` contains another, and viewers differ in whether they trust `/Count` or walk the kids. `qpdf --check` and pikepdf's `pdf.check()` report this, and a plain `save()` rebuilds the tree from the kids.

### Try It Yourself

```python
import pikepdf

with pikepdf.open("handbook.pdf") as pdf:
    print(f"{len(pdf.pages)} pages; tree root has {len(pdf.Root.Pages.Kids)} kids, Count={pdf.Root.Pages.Count}")
    sizes = {}
    for page in pdf.pages:
        r = pikepdf.Rectangle(page.mediabox)
        key = (round(r.width), round(r.height), int(page.get("/Rotate", 0)))
        sizes[key] = sizes.get(key, 0) + 1
    for (w, h, rot), n in sorted(sizes.items(), key=lambda kv: -kv[1]):
        print(f"{n:4} pages of {w}x{h} pt rotate={rot}")
    first = pdf.pages[0]
    print("first page keys:", list(first.obj.keys()))
    print("label of page 1:", first.label)
```

### Quiz

1. What does `pdf.pages.p(1)` return?
- [x] The first page (one-based helper)
- [ ] The second page
- [ ] The page count
> `p()` uses one-based numbering to match viewers; `pages[0]` is zero-based.

2. Which attributes can be inherited from a `/Pages` node?
- [ ] `/Contents` and `/Annots`
- [x] `/MediaBox`, `/CropBox`, `/Rotate` and `/Resources`
- [ ] `/Type` only
> The specification allows exactly those four to be inherited down the tree.

3. In `pikepdf.Rectangle`, where is `(llx, lly)`?
- [ ] Top-left corner
- [x] Lower-left corner
- [ ] Centre
> pikepdf keeps PDF's native bottom-left origin, unlike PyMuPDF.

### Exercises

1. **Page tree depth** — Compute the maximum depth of the page tree in a document.
<details><summary>Solution</summary>

```python
import pikepdf
from pikepdf import Name

def depth(node):
    if node.get("/Type") == Name.Pages:
        return 1 + max((depth(k) for k in node.Kids), default=0)
    return 1

with pikepdf.open("handbook.pdf") as pdf:
    print("page tree depth:", depth(pdf.Root.Pages))
```

</details>

2. **Uniform crop** — Set a CropBox on every page that removes 0.25 inch from each edge, then verify the first page's cropbox width.
<details><summary>Solution</summary>

```python
import pikepdf

with pikepdf.open("handbook.pdf") as pdf:
    for page in pdf.pages:
        r = pikepdf.Rectangle(page.mediabox)
        page.cropbox = pikepdf.Rectangle(r.llx + 18, r.lly + 18, r.urx - 18, r.ury - 18)
    print(pikepdf.Rectangle(pdf.pages[0].cropbox).width)
    pdf.save("handbook_cropped.pdf")
```

</details>

### Interview Questions

**Q: How does a PDF viewer find page 57 of a document?**
It starts at the catalog's `/Pages` root and walks the balanced tree of `/Pages` nodes, using each node's `/Count` to skip whole subtrees until it reaches the leaf `/Page` at index 56. This makes random access logarithmic even in a 3,000-page bundle. pikepdf's `pdf.pages` performs this walk for you and caches results, so `pdf.pages[56]` is cheap, but the underlying structure explains why corrupt `/Count` values break navigation and why a linearised file additionally stores hints so the first page can be shown before the tree is fully downloaded.

**Q: What are inherited page attributes and what problem can they cause?**
`/Resources`, `/MediaBox`, `/CropBox` and `/Rotate` may be placed on an ancestor `/Pages` node and apply to every descendant that does not override them. Generators use this to save space when all pages share a size. The problem arises when you move a page to another document: the page dictionary alone lacks the inherited values, so it arrives with no MediaBox or no fonts. pikepdf avoids this by pushing inherited attributes down onto each page when opening (`inherit_page_attributes=True`) and by copying resources during `pages.append`, but hand-written tree manipulation must handle it explicitly.

**Q: What is the difference between `pikepdf.Page` and the page's dictionary?**
`Page` is a thin wrapper that adds helpers such as `mediabox`, `rotate()`, `add_overlay()`, `images`, `index` and `label`, and forwards unknown attribute access to the underlying `/Page` dictionary available as `page.obj`. You can wrap any page dictionary with `pikepdf.Page(dictionary)` and unwrap with `.obj`, and equality compares the underlying objects. The distinction matters when you pass pages to functions expecting raw objects or when you check `isinstance`; most day-to-day code simply uses the `Page` API.

## Rotating, deleting and reversing pages

Fixing page orientation and order is the everyday work that arrives from scanners and from clients who assemble documents by hand. pikepdf does it with plain list operations on `pdf.pages` and one dictionary key, `/Rotate`.

### Rotating

`/Rotate` tells the viewer to turn the page clockwise by a multiple of 90 degrees. Setting it is the cheapest possible fix and does not touch the content:

```python
import pikepdf

with pikepdf.open("scan.pdf", allow_overwriting_input=True) as pdf:
    page = pdf.pages[0]
    page.Rotate = 90                        # absolute
    page.rotate(90, relative=True)          # add 90° to whatever is there
    pdf.save("scan.pdf")
```

`Page.rotate(angle, relative)` normalises the result into 0–270, so `rotate(270, relative=True)` on a page already at 180 yields 90. Reading is `page.get("/Rotate", 0)` because the key may be absent.

Rotating every landscape page to portrait:

```python
for page in pdf.pages:
    r = pikepdf.Rectangle(page.mediabox)
    if r.width > r.height:
        page.rotate(90, relative=True)
```

### Deleting

```python
del pdf.pages[0]           # first page
del pdf.pages[-1]          # last page
del pdf.pages[2:5]         # pages 3, 4, 5 (zero-based slice 2, 3, 4)
pdf.pages.remove(p=1)      # one-based convenience: remove page 1
```

Deleting from a list while iterating it skips elements, so collect the indices first and delete from the highest to the lowest:

```python
blank_indices = [i for i, page in enumerate(pdf.pages) if is_blank(page)]
for i in reversed(blank_indices):
    del pdf.pages[i]
```

pikepdf does not render, so `is_blank` must be based on structure: a page whose content stream is empty and which has no `/XObject` resources is blank. A more reliable check renders with PyMuPDF and measures ink coverage.

### Reversing and reordering

```python
pdf.pages.reverse()                       # whole document backwards, in place
```

For arbitrary order, build a list of pages and rebuild:

```python
order = [0, 2, 1, 3]                      # swap pages 2 and 3
pages = [pdf.pages[i] for i in order]
new = pikepdf.new()
new.pages.extend(pages)
new.save("reordered.pdf")
```

`extend` copies each page (with its resources) into the new document, so the original is untouched. Doing the reorder in place is also possible with `insert` and `del`, but the copy-into-new pattern is easier to reason about and cannot leave the page tree in a half-edited state.

### Interleaving front and back scans

```python
with pikepdf.open("fronts.pdf") as fronts, pikepdf.open("backs.pdf") as backs, pikepdf.new() as out:
    n = len(fronts.pages)
    for i in range(n):
        out.pages.append(fronts.pages[i])
        out.pages.append(backs.pages[n - 1 - i])      # backs were scanned last-to-first
    out.save("duplex.pdf")
```

### Moving one page

```python
page = pdf.pages[5]
del pdf.pages[5]
pdf.pages.insert(0, page)
```

Because `page` still holds a reference to the page dictionary, inserting it after deletion works; pikepdf will copy if needed.

### Content-level rotation versus `/Rotate`

`/Rotate` is metadata. Some downstream tools, notably a few print RIPs and old image converters, ignore it. If a consumer needs the content itself rotated, place the page as a Form XObject on a new page with a rotation matrix (Expert level), or rasterise with PyMuPDF. For 99 percent of jobs `/Rotate` is correct and reversible, and it keeps text extractable.

| Task | Code |
|---|---|
| rotate one page | `pdf.pages[i].rotate(90, relative=True)` |
| delete a range | `del pdf.pages[a:b]` |
| reverse | `pdf.pages.reverse()` |
| keep only some pages | `new.pages.extend([pdf.pages[i] for i in keep])` |
| move | `del` then `insert` |

> **Tip:** After heavy page surgery, save with `pdf.save(path)` and reopen before doing more work. The reopened file has a rebuilt page tree and fresh object numbers, which avoids confusing yourself with stale references.

### Try It Yourself

```python
import pikepdf

with pikepdf.open("scan.pdf") as pdf:
    fixed = 0
    for page in pdf.pages:
        r = pikepdf.Rectangle(page.mediabox)
        rot = int(page.get("/Rotate", 0))
        landscape = (r.width > r.height) != (rot in (90, 270))
        if landscape:
            page.rotate(90, relative=True); fixed += 1
    # drop the last page if it is a blank separator: no XObjects and tiny content
    last = pdf.pages[-1]
    c = last.get("/Contents")
    size = len(c.read_bytes()) if isinstance(c, pikepdf.Stream) else -1
    if 0 <= size < 20 and "/XObject" not in last.get("/Resources", {}):
        del pdf.pages[-1]; print("removed blank last page")
    pdf.pages.reverse()
    pdf.save("scan_fixed.pdf")
    print(f"rotated {fixed} pages, reversed order, now {len(pdf.pages)} pages")
```

### Quiz

1. What does `page.rotate(90, relative=True)` do on a page with `/Rotate 270`?
- [ ] Sets it to 270
- [x] Sets it to 0
- [ ] Raises an error
> Relative rotation adds and normalises modulo 360, so 270 + 90 becomes 0.

2. Which is the safe way to delete several pages by index?
- [ ] Delete while iterating `pdf.pages`
- [x] Collect indices first and delete from highest to lowest
- [ ] Set each page's `/Type` to null
> Deleting in reverse order keeps the remaining indices valid.

3. Does setting `/Rotate` change the content stream?
- [ ] Yes, glyphs are transformed
- [x] No, it is a viewer instruction only
- [ ] Only for images
> Rotation is a page attribute; content and text extraction are unaffected.

### Exercises

1. **Odd pages only** — Create `odd.pdf` containing pages 1, 3, 5, ... of a source document.
<details><summary>Solution</summary>

```python
import pikepdf

with pikepdf.open("handbook.pdf") as src, pikepdf.new() as out:
    out.pages.extend(src.pages[0::2])
    out.save("odd.pdf")
    print(len(out.pages))
```

</details>

2. **Normalise rotation** — Set `/Rotate` to 0 on every page and report how many changed.
<details><summary>Solution</summary>

```python
import pikepdf

with pikepdf.open("scan.pdf") as pdf:
    changed = 0
    for page in pdf.pages:
        if int(page.get("/Rotate", 0)) != 0:
            page.Rotate = 0; changed += 1
    pdf.save("scan_norotate.pdf")
    print("changed", changed)
```

</details>

### Interview Questions

**Q: A scanned batch has every other page upside down. How do you fix it with pikepdf, and what are the limits?**
Iterate `pdf.pages` and call `page.rotate(180, relative=True)` on the odd-indexed pages, then save. That edits only the `/Rotate` key, so it is instant even for a 2,000-page scan and fully reversible. The limit is that pikepdf cannot look at the pixels, so if the pattern is not strictly alternating I need an orientation detector, typically PyMuPDF rendering plus Tesseract's OSD or a text-direction heuristic, to decide per page. The other limit is consumers that ignore `/Rotate`; for those I rasterise or apply a content-level transform.

**Q: What happens to shared resources when you delete a page?**
Nothing immediately: `del pdf.pages[i]` removes the page from the tree, but its content stream, fonts and images remain objects in memory. On `save()`, qpdf writes only objects reachable from the trailer, so resources used solely by the deleted page are dropped, while resources shared with surviving pages are kept. That is why pikepdf output is naturally free of orphaned objects and why deleting pages in pikepdf also shrinks the file, unlike an incremental save in other tools.

**Q: Why copy pages into a new `Pdf` instead of reordering in place?**
Reordering in place with repeated `del` and `insert` is error-prone because indices shift after each operation and a mistake can produce a page tree with a page referenced twice or not at all. Building the desired list of page objects and calling `new.pages.extend(list)` expresses the final order in one place, keeps the source file untouched for comparison, and produces a freshly serialised output. The cost is copying resources, which pikepdf de-duplicates within one save, so the output is not larger; the copy approach is my default for anything more complex than a single move.

## Merging and splitting

Combining several PDFs into one and cutting one into many are the most requested operations in document production, and pikepdf handles both with the `pages` list. Because pikepdf copies at the object level, merged output keeps fonts, images, annotations and even form fields intact, and the output is a clean file every time.

### Merging

```python
import pikepdf

sources = ["cover.pdf", "body.pdf", "appendix.pdf"]
with pikepdf.new() as out:
    for name in sources:
        with pikepdf.open(name) as src:
            out.pages.extend(src.pages)
    out.save("handbook_merged.pdf")
```

`extend` copies every page and the resources it references into `out`. You can also append individual pages or slices:

```python
out.pages.append(src.pages[0])         # just the first page
out.pages.extend(src.pages[2:7])       # pages 3-7
```

Keep the source open until you save, or at least until the pages are appended; pikepdf copies lazily in some versions, and closing the source too early raises an error.

### Copying pages with their annotations and fields

Page-level annotations travel with the page because they are referenced from `/Annots`. Form **fields**, however, live in the catalog's `/AcroForm /Fields` array, so a merged file may show widgets that no longer belong to any field. pikepdf ≥ 8 handles this in `pages.append` by copying the AcroForm entries; for older versions, or when field names collide across sources, flatten forms first or rename fields (see the Advanced form chapter).

### Splitting into single pages

```python
with pikepdf.open("scan_batch.pdf") as src:
    for i, page in enumerate(src.pages, start=1):
        with pikepdf.new() as part:
            part.pages.append(page)
            part.save(f"page_{i:04}.pdf")
```

### Splitting into chunks

```python
def split(src_path, chunk):
    with pikepdf.open(src_path) as src:
        n = len(src.pages)
        for k, start in enumerate(range(0, n, chunk), start=1):
            with pikepdf.new() as part:
                part.pages.extend(src.pages[start:start + chunk])
                part.save(f"part_{k:03}.pdf")

split("closing_package.pdf", 25)
```

### Splitting on a marker page

pikepdf does not extract text, so use a text library to find boundaries and pikepdf to cut. A common pattern with PyMuPDF for detection and pikepdf for the (standards-correct, signature-friendly) output:

```python
import pymupdf, pikepdf

with pymupdf.open("orders.pdf") as doc:
    starts = [p.number for p in doc if "ORDER NO" in p.get_text()]
with pikepdf.open("orders.pdf") as src:
    bounds = zip(starts, starts[1:] + [len(src.pages)])
    for k, (a, b) in enumerate(bounds, start=1):
        with pikepdf.new() as part:
            part.pages.extend(src.pages[a:b])
            part.save(f"order_{k:03}.pdf")
```

### Preserving metadata and bookmarks

A new `Pdf` has empty metadata and no outline. Copy what the client expects:

```python
with pikepdf.open("body.pdf") as body, pikepdf.new() as out:
    out.pages.extend(body.pages)
    out.docinfo.update(body.docinfo)            # copies Info entries, values are converted
    out.save("out.pdf")
```

Outlines reference page objects, so they must be rebuilt after merging; the Advanced chapter on outlines shows how.

### Merging with the qpdf CLI

For a one-off from the terminal, the same engine is available as a command:

```bash
qpdf --empty --pages cover.pdf body.pdf 1-50 appendix.pdf -- handbook.pdf
qpdf --split-pages=25 closing_package.pdf part_%d.pdf
```

`--pages` takes any number of `file [range]` groups; ranges accept `1-5`, `z` for the last page, `r1` for reverse counting and `1-z:odd`.

| Need | pikepdf | qpdf CLI |
|---|---|---|
| merge all pages | `out.pages.extend(src.pages)` | `qpdf --empty --pages a.pdf b.pdf -- out.pdf` |
| range | `src.pages[2:7]` | `b.pdf 3-7` |
| split every N | loop with slices | `--split-pages=N` |
| reverse | `pdf.pages.reverse()` | `--pages in.pdf z-1 --` |

> **Warning:** Merging documents with different `/Rotate` values or page sizes is legal, but viewers will show a mixed document. Normalise rotation before merging, and if the client wants uniform Letter pages, place each page as a Form XObject on a fresh Letter page (Expert level) or scale with PyMuPDF's `show_pdf_page`.

### Try It Yourself

```python
import pikepdf, pathlib

parts = sorted(pathlib.Path("parts").glob("*.pdf"))
with pikepdf.new() as out:
    for f in parts:
        with pikepdf.open(f) as src:
            before = len(out.pages)
            out.pages.extend(src.pages)
            print(f"{f.name:30} pages {before + 1}-{len(out.pages)}")
    out.docinfo["/Title"] = "Combined closing package"
    out.docinfo["/Author"] = "Ali Raza"
    out.save("combined.pdf")
    print("total:", len(out.pages), "pages")
with pikepdf.open("combined.pdf") as check:
    assert len(check.pages) == sum(len(pikepdf.open(f).pages) for f in parts)
    print("page count verified")
```

### Quiz

1. Which call copies all pages of `src` to the end of `out`?
- [ ] `out.pages.merge(src)`
- [x] `out.pages.extend(src.pages)`
- [ ] `out.insert_pdf(src)`
> `extend` accepts any iterable of pages and copies each with its resources.

2. Where do form field definitions live, which is why they can be lost in a naive merge?
- [ ] In each page's `/Annots`
- [x] In the catalog's `/AcroForm /Fields` array
- [ ] In the trailer
> Widgets are on pages, but the field tree hangs off the catalog and must be merged separately.

3. What does the qpdf range `1-z:odd` mean?
- [x] Odd pages from 1 to the last page
- [ ] Pages 1 to 26
- [ ] Every page except odd ones
> `z` is the last page and `:odd` keeps every second page starting from the first.

### Exercises

1. **Merge with a cover on top** — Merge all PDFs in `parts/` but ensure `cover.pdf` always comes first even if alphabetical order puts it elsewhere.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib

files = sorted(pathlib.Path("parts").glob("*.pdf"), key=lambda p: (p.name != "cover.pdf", p.name))
with pikepdf.new() as out:
    for f in files:
        with pikepdf.open(f) as src:
            out.pages.extend(src.pages)
    out.save("merged_cover_first.pdf")
print([f.name for f in files][:3])
```

</details>

2. **Split by size** — Split a PDF into parts such that each part has at most 40 pages, naming them `part_001.pdf` and so on, and print each part's page count.
<details><summary>Solution</summary>

```python
import pikepdf

with pikepdf.open("closing_package.pdf") as src:
    n = len(src.pages)
    for k, start in enumerate(range(0, n, 40), start=1):
        with pikepdf.new() as part:
            part.pages.extend(src.pages[start:start + 40])
            part.save(f"part_{k:03}.pdf")
            print(f"part_{k:03}.pdf: {len(part.pages)} pages")
```

</details>

### Interview Questions

**Q: How does pikepdf avoid duplicating shared resources when merging?**
When a page is appended from another `Pdf`, qpdf's foreign-object copier walks the page's object graph and copies every reachable indirect object once, keeping a map from source objects to their copies for the lifetime of that source document. Two pages from the same source sharing a font therefore share the copied font in the output. Across different source files no de-duplication happens, because byte-identical fonts from two Word exports are still distinct objects; if that bloats the output I post-process with PyMuPDF's `garbage=3` or subset fonts.

**Q: Why might merged forms behave strangely, and how do you prevent it?**
Form fields are defined in the catalog's `/AcroForm`, not on pages, so a naive page copy brings the widget annotations but not the field entries, or brings two fields with the same fully qualified name from different sources, which viewers then treat as one linked field showing the same value everywhere. Prevention options are flattening the forms before merging, renaming fields with a per-source prefix by editing `/T`, or relying on newer pikepdf versions that merge AcroForm entries during `append`. I always open the merged file and count `AcroForm.Fields` against the sum of the sources as a check.

**Q: When would you use the qpdf CLI instead of pikepdf?**
For one-off operations on a server without a Python environment, for shell pipelines where `qpdf --pages` expresses the task in one line, and for `--check`, `--qdf` and `--show-xref` diagnostics that are handy at a terminal. pikepdf wins whenever logic is involved, such as deciding split points from content, preserving metadata, or looping over thousands of files with error handling. Both use the same engine, so results are identical, and `pikepdf.Job` even lets you run qpdf's job configuration from Python when you want the CLI semantics without a subprocess.

# LEVEL: Intermediate

## Metadata: DocInfo vs XMP (open_metadata)

A PDF carries metadata in two places that can disagree. The **Info dictionary** (DocInfo) is the old, trailer-referenced dictionary with keys such as `/Title` and `/Author`. **XMP** is an XML packet stored in a stream referenced from the catalog's `/Metadata` entry; it is what PDF/A requires and what Acrobat and most modern tools read first. pikepdf exposes both: `pdf.docinfo` for the dictionary and `pdf.open_metadata()` for XMP, and it can keep them in sync.

### DocInfo

```python
import pikepdf

with pikepdf.open("policy_manual.pdf") as pdf:
    print(dict(pdf.docinfo))
    pdf.docinfo["/Title"] = "Employee Policy Manual 2026"
    pdf.docinfo["/Author"] = "Ali Raza"
    pdf.docinfo["/Subject"] = "HR policies"
    pdf.docinfo["/Keywords"] = "policy, HR, handbook"
    pdf.save("policy_manual_meta.pdf")
```

Values are PDF strings; pikepdf converts Python `str` to `pikepdf.String` automatically. Dates are strings in the form `D:20260916143000+05'00'`. The `/Producer` and `/CreationDate` keys are worth leaving alone unless the client asks, because some workflows use them for provenance.

### XMP with open_metadata

```python
with pikepdf.open("policy_manual.pdf") as pdf:
    with pdf.open_metadata() as meta:
        meta["dc:title"] = "Employee Policy Manual 2026"
        meta["dc:creator"] = ["Ali Raza"]          # dc:creator is a sequence
        meta["dc:description"] = "HR policies"
        meta["pdf:Keywords"] = "policy, HR, handbook"
        meta["xmp:CreatorTool"] = "docx + LibreOffice 24.2"
    pdf.save("policy_manual_xmp.pdf")
```

`open_metadata()` returns a `PdfMetadata` object used as a context manager; the XMP packet is written back on exit. Keys use the namespace prefixes XMP defines: `dc:` (Dublin Core), `xmp:`, `pdf:`, `pdfaid:` for PDF/A identification, `xmpMM:` for document IDs.

### Keeping the two in sync

By default `open_metadata(set_pikepdf_as_editor=True, update_docinfo=True)` copies the standard fields into DocInfo when the packet is saved, so `dc:title` becomes `/Title`. The reverse, DocInfo to XMP, is a one-liner:

```python
with pdf.open_metadata() as meta:
    meta.load_from_docinfo(pdf.docinfo, delete_missing=True)
```

`delete_missing=True` removes XMP fields that have no DocInfo counterpart, which is what you want when a client's old file has stale XMP from a previous title.

### Reading without editing

```python
with pikepdf.open("scan.pdf") as pdf:
    meta = pdf.open_metadata()
    print(meta.get("dc:title"), meta.get("pdfaid:part"), meta.get("xmp:CreateDate"))
    print(meta.pdfa_status, meta.pdfx_status)     # "" if not claimed, e.g. "2B"
```

`pdfa_status` reports the PDF/A part and conformance level the file **claims**; it is a claim, not a validation.

### Which one wins?

| Reader | Prefers |
|---|---|
| Acrobat, Preview, Chrome | XMP if present, else DocInfo |
| Windows Explorer properties | DocInfo |
| Old command-line tools (`pdfinfo`) | DocInfo |
| PDF/A validators | XMP, and require consistency with DocInfo |

Because of that last row, a PDF/A file whose `/Title` differs from `dc:title` fails validation. Always update both, and let pikepdf's sync do it.

### Removing metadata

Clients sometimes need a file scrubbed before sending to a counterparty:

```python
with pikepdf.open("draft.pdf") as pdf:
    for key in list(pdf.docinfo.keys()):
        del pdf.docinfo[key]
    if "/Metadata" in pdf.Root:
        del pdf.Root["/Metadata"]
    pdf.save("draft_clean.pdf")
```

This removes document-level metadata but not per-page XMP on images or embedded file metadata; a thorough scrub also checks `/Names /EmbeddedFiles` and image `/Metadata` streams.

> **Tip:** Store the document ID (`xmpMM:DocumentID`) when you generate a family of PDFs from one source. It lets you prove later that six client copies came from the same build even after they were renamed.

### Try It Yourself

```python
import pikepdf, datetime

with pikepdf.open("input.pdf") as pdf:
    print("DocInfo before:", dict(pdf.docinfo))
    with pdf.open_metadata() as meta:
        meta["dc:title"] = "Title Commitment – Order ST-2026-04471"
        meta["dc:creator"] = ["Ali Raza"]
        meta["dc:description"] = "Production copy"
        meta["xmp:ModifyDate"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    # update_docinfo=True (default) copied dc:title into /Title on exit
    print("DocInfo after :", dict(pdf.docinfo))
    pdf.save("output_meta.pdf")

with pikepdf.open("output_meta.pdf") as check:
    m = check.open_metadata()
    print("XMP title:", m.get("dc:title"))
    print("Info title:", check.docinfo.get("/Title"))
    print("Claims PDF/A:", repr(m.pdfa_status))
```

### Quiz

1. Where is the XMP packet stored?
- [ ] In the trailer's `/Info` dictionary
- [x] In a stream referenced by the catalog's `/Metadata`
- [ ] In each page's `/Resources`
> `pdf.Root.Metadata` is the stream; `open_metadata()` parses it.

2. What does `meta.load_from_docinfo(pdf.docinfo, delete_missing=True)` do?
- [x] Copies DocInfo fields into XMP and removes XMP fields absent from DocInfo
- [ ] Copies XMP into DocInfo
- [ ] Deletes DocInfo
> It is the DocInfo-to-XMP direction; the default save syncs the other way.

3. `meta.pdfa_status == "2B"` means the file…
- [ ] has been validated as PDF/A-2b
- [x] claims to be PDF/A-2b in its XMP
- [ ] is encrypted
> Claims must be verified with a validator such as veraPDF.

### Exercises

1. **Metadata report** — Print title, author, creation date and whether XMP exists for every PDF in a folder.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
for f in pathlib.Path("pdfs").glob("*.pdf"):
    with pikepdf.open(f) as pdf:
        info = pdf.docinfo
        has_xmp = "/Metadata" in pdf.Root
        print(f.name, info.get("/Title"), info.get("/Author"), info.get("/CreationDate"), "xmp" if has_xmp else "no-xmp")
```

</details>

2. **Sync check** — Report files where `/Title` and `dc:title` differ.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
for f in pathlib.Path("pdfs").glob("*.pdf"):
    with pikepdf.open(f) as pdf:
        info_title = str(pdf.docinfo.get("/Title", ""))
        xmp_title = pdf.open_metadata().get("dc:title", "") if "/Metadata" in pdf.Root else ""
        if info_title != xmp_title:
            print(f"{f.name}: Info={info_title!r} XMP={xmp_title!r}")
```

</details>

### Interview Questions

**Q: Why does a PDF have two metadata systems and how do you handle them?**
DocInfo dates from PDF 1.0 and is a flat dictionary in the trailer; XMP was added in PDF 1.4 as an extensible RDF/XML packet shared with images and other Adobe formats, and PDF/A made it mandatory. Modern viewers prefer XMP while older tools and Windows Explorer read DocInfo, so a file with only one updated shows different titles in different places. I always write through pikepdf's `open_metadata()` with `update_docinfo=True`, which writes XMP and mirrors the standard fields to DocInfo, and for PDF/A I run veraPDF afterwards because it checks the two agree. In PDF 2.0 DocInfo is deprecated except for dates, which reinforces XMP as the primary store.

**Q: How would you scrub metadata from a batch of client deliverables?**
Delete every DocInfo key, remove `/Root /Metadata`, and then look further: image XObjects can carry `/Metadata` streams with camera data, embedded files under `/Names /EmbeddedFiles` have their own DocInfo, and the file ID in the trailer can be regenerated by saving with a fresh `pikepdf.Pdf`. I keep `/Producer` out of the scrub if the client's compliance team wants to know which tool produced the file. After saving I re-open each file and assert that `pdf.docinfo` is empty and `/Metadata` is absent, and log the checked files so the batch is auditable.

**Q: What is the difference between `pikepdf.String` and a Python `str` when setting `/Title`?**
pikepdf converts a `str` to a PDF string object on assignment, choosing PDFDocEncoding when the characters fit and UTF-16BE with a byte-order mark otherwise, which is what the PDF spec requires for text strings. Reading back gives a `pikepdf.String` that behaves like `str` for comparison and printing. The trap is binary data or names: assigning `"/Title"` as a Python string value writes a string that starts with a slash rather than a name object, so for keys and name values use `pikepdf.Name` explicitly.

## Encryption, passwords and permissions

PDF encryption protects two things: opening the file (the **user password**) and changing it (the **owner password** plus a permissions bitfield). pikepdf reads encrypted files when given the password and writes encryption through `pikepdf.Encryption`. This chapter covers the algorithms, the permission flags, and the practical limits of what "no printing" actually enforces.

### Opening an encrypted file

```python
import pikepdf

try:
    pdf = pikepdf.open("closing_package.pdf", password="client-2026")
except pikepdf.PasswordError:
    print("wrong or missing password")
```

Either password opens the file. If you open with the **owner** password you may change anything; with the **user** password pikepdf still lets you edit in memory (it is a library, not a viewer), but `pdf.is_encrypted` and `pdf.allow` tell you what the author intended:

```python
print(pdf.is_encrypted, pdf.encryption.R, pdf.encryption.bits)     # True 6 256
print(pdf.allow)   # Permissions(accessibility=True, extract=False, modify_annotation=True, ...)
```

`pdf.encryption` is an `EncryptionInfo` with `R` (revision), `V`, `bits`, `stream_method`, `string_method` and `user_password_matched` / `owner_password_matched`.

### Encrypting on save

```python
from pikepdf import Pdf, Encryption, Permissions

perms = Permissions(extract=False, print_lowres=True, print_highres=False, modify_other=False, modify_form=True, accessibility=True)
with Pdf.open("handbook.pdf") as pdf:
    pdf.save("handbook_secured.pdf",
             encryption=Encryption(user="", owner="Ow!ner#2026", R=6, allow=perms))
```

- `user=""` means anyone can open the file; the permissions still apply.
- `owner` is required for a meaningful restriction; an empty owner password lets any tool lift the restrictions.
- `R=6` is AES-256 (PDF 2.0 / Acrobat X+). `R=4` gives AES-128, `R=3` RC4-128, `R=2` RC4-40, which are legacy and should only be used for very old readers.
- `allow` is a `Permissions` namedtuple; every flag defaults to `True`.

### The permission flags

| Flag | Controls |
|---|---|
| `accessibility` | screen-reader text extraction (keep `True`, required by accessibility law in many places) |
| `extract` | copy text and images |
| `modify_annotation` | add or edit comments |
| `modify_assembly` | insert, rotate, delete pages |
| `modify_form` | fill form fields |
| `modify_other` | any other edit |
| `print_lowres` | print at reduced quality |
| `print_highres` | full-quality print |

`print_highres=True` with `print_lowres=False` is contradictory; pikepdf and qpdf treat "print" as allowed if either is set.

### What permissions really enforce

Permissions are honoured **by cooperating viewers only**. Any tool that opens the file with the user password has the decryption key and can ignore the bits; `qpdf --decrypt` removes them in one command when the owner password is known or empty. For a client, the honest framing is: a user password keeps outsiders out, an owner password stops casual editing in Acrobat, and neither stops a determined recipient. For real control, the answer is not sending the file at all, or a DRM platform.

### Removing encryption

```python
with pikepdf.open("secured.pdf", password="Ow!ner#2026") as pdf:
    pdf.save("open.pdf")      # saving without encryption= writes an unencrypted file
```

To keep the existing encryption while editing, pass `encryption=True`; to keep it only when the owner password was supplied, check `pdf.encryption.owner_password_matched` first.

### Metadata and encryption

By default the XMP metadata stream is encrypted too, so search indexers cannot read titles. `Encryption(..., metadata=False)` leaves `/Metadata` in the clear, which is what Acrobat's "Encrypt all document contents except metadata" does.

> **Warning:** RC4 (`R=2` and `R=3`) is broken and is rejected by PDF 2.0 and by PDF/A. Only produce `R=4` or `R=6` unless a client's software demonstrably cannot open AES files, and note that PDF/A forbids encryption of any kind.

### Try It Yourself

```python
import pikepdf
from pikepdf import Encryption, Permissions

perms = Permissions(extract=False, print_lowres=True, print_highres=True, modify_other=False, modify_form=True, modify_annotation=False, modify_assembly=False, accessibility=True)
with pikepdf.open("input.pdf") as pdf:
    pdf.save("secured.pdf", encryption=Encryption(user="", owner="Ow!ner#2026", R=6, allow=perms))

with pikepdf.open("secured.pdf") as pdf:         # opens with the empty user password
    e = pdf.encryption
    print("encrypted:", pdf.is_encrypted, "R:", e.R, "bits:", e.bits, "stream:", e.stream_method)
    print("owner matched:", e.owner_password_matched, "user matched:", e.user_password_matched)
    for name, allowed in pdf.allow._asdict().items():
        print(f"  {name:20} {'yes' if allowed else 'no'}")

with pikepdf.open("secured.pdf", password="Ow!ner#2026") as pdf:
    print("as owner:", pdf.encryption.owner_password_matched)
    pdf.save("unlocked.pdf")
print("unlocked.pdf encrypted:", pikepdf.open("unlocked.pdf").is_encrypted)
```

### Quiz

1. Which revision value produces AES-256 encryption?
- [ ] `R=3`
- [ ] `R=4`
- [x] `R=6`
> `R=4` is AES-128; `R=2`/`R=3` are RC4 and should be avoided.

2. With `user=""` and an owner password set, who can open the file?
- [x] Anyone, but permissions apply in cooperating viewers
- [ ] Only the owner
- [ ] Nobody until decrypted
> An empty user password means opening is unrestricted; the owner password gates changing permissions.

3. What do permission flags actually guarantee?
- [ ] That extraction is cryptographically impossible
- [x] That viewers which respect the flags will refuse the action
- [ ] That the file cannot be printed anywhere
> The decryption key is available to any reader, so enforcement is by convention.

### Exercises

1. **Encryption audit** — For every PDF in a folder, print whether it is encrypted, the algorithm, and whether extraction is allowed; handle files that need a password.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
for f in pathlib.Path("pdfs").glob("*.pdf"):
    try:
        with pikepdf.open(f) as pdf:
            if pdf.is_encrypted:
                print(f.name, f"R={pdf.encryption.R}", f"{pdf.encryption.bits}-bit", "extract" if pdf.allow.extract else "no-extract")
            else:
                print(f.name, "not encrypted")
    except pikepdf.PasswordError:
        print(f.name, "needs a user password")
```

</details>

2. **Re-encrypt legacy files** — Upgrade any RC4-encrypted file (R < 4) to AES-256 with the same owner password, keeping the existing permissions.
<details><summary>Solution</summary>

```python
import pikepdf
from pikepdf import Encryption
OWNER = "Ow!ner#2026"
with pikepdf.open("legacy.pdf", password=OWNER) as pdf:
    if pdf.encryption.R < 4:
        pdf.save("legacy_aes.pdf", encryption=Encryption(user="", owner=OWNER, R=6, allow=pdf.allow))
        print("upgraded to AES-256")
```

</details>

### Interview Questions

**Q: A client wants a PDF that "cannot be copied or edited". What do you deliver and what do you tell them?**
I deliver a file encrypted with AES-256 (`R=6`), an empty user password so it opens normally, a strong owner password, and permissions with `extract=False`, `modify_other=False` and `modify_assembly=False`, keeping `accessibility=True` so screen readers work. I tell them plainly that permissions are honoured by Acrobat and most viewers but not enforced cryptographically, because anyone who can open the file has the key; `qpdf --decrypt` or a screenshot defeats it. If the content is genuinely sensitive, the protection has to be a user password shared out of band, watermarking with the recipient's name, or not distributing the file at all.

**Q: What is the difference between the user and owner passwords at the cryptographic level?**
Both derive the same file encryption key; the difference is in what the reader checks. With `R=6`, the user password is validated against `/U` and the key is unwrapped from `/UE`; the owner password is validated against `/O` and unwraps the same key from `/OE`. The permissions bits `/P` are additionally encrypted into `/Perms` so a reader can detect tampering. Because both paths yield the same key, an empty user password means the content is effectively unencrypted for anyone, and the owner password only tells cooperative software whether to honour `/P`.

**Q: Why does PDF/A forbid encryption, and how do you reconcile that with a client who wants both?**
PDF/A is about long-term reproducibility: an archive must be readable decades later without keys, so the standard forbids encryption entirely and validators fail any encrypted file. When a client asks for a "PDF/A that is password protected", I explain the conflict and offer two files: the archival PDF/A master stored securely, and a distribution copy encrypted with AES-256 for sending out. If they need integrity rather than secrecy, a digital signature is compatible with PDF/A and proves the file has not changed, which is often what they actually wanted.

## Linearization and save options

`Pdf.save()` has options that decide how the bytes are laid out, how streams are compressed, and how compatible or debuggable the output is. Defaults are sensible, but for web delivery, archival, diffing and size targets you need to know what each switch does. All of these map to qpdf features, so the qpdf documentation is the reference when pikepdf's is terse.

### Linearization (Fast Web View)

A linearized PDF is written so the first page's objects and a hint table are at the start of the file, allowing a browser to display page 1 while the rest downloads.

```python
with pikepdf.open("handbook.pdf") as pdf:
    pdf.save("handbook_web.pdf", linearize=True)

with pikepdf.open("handbook_web.pdf") as pdf:
    print(pdf.is_linearized)                # True
    pdf.check_linearization()               # raises or prints problems
```

Any edit and save without `linearize=True` produces a non-linearized file again, so linearize as the very last step of a pipeline. Linearization adds a small overhead and is pointless for files under a few hundred kilobytes.

### Object streams

PDF 1.5 allows non-stream objects to be packed into compressed **object streams**, which shrinks files with many small objects (forms with 168 fields, documents with thousands of annotations).

```python
pdf.save("out.pdf", object_stream_mode=pikepdf.ObjectStreamMode.generate)   # pack everything possible
pdf.save("out.pdf", object_stream_mode=pikepdf.ObjectStreamMode.preserve)   # default: keep what the input had
pdf.save("out.pdf", object_stream_mode=pikepdf.ObjectStreamMode.disable)    # unpack, for PDF 1.4 readers
```

`generate` is safe for any reader from Acrobat 6 onward and typically cuts 10 to 30 percent from form-heavy files.

### Stream compression

```python
pdf.save("out.pdf", compress_streams=True)     # default: Flate-compress uncompressed streams
pdf.save("out.pdf", compress_streams=False)    # leave streams as they are
pdf.save("out.pdf", stream_decode_level=pikepdf.StreamDecodeLevel.generalized)
```

`compress_streams` only applies Flate to streams that are currently uncompressed; it never re-encodes images. `stream_decode_level` controls what pikepdf decodes before writing: `none`, `generalized` (Flate, LZW, ASCII filters), `specialized` (adds RunLength and lossless image filters) and `all` (including DCT, which would re-encode JPEGs and is almost never wanted).

### QDF mode: readable PDFs for diffing

```python
pdf.save("debug.pdf", qdf=True)
```

QDF writes every object uncompressed, one per line, with `%QDF` comments and normalised numbering. It is the way to open a PDF in a text editor to see what a content stream or an AcroForm entry contains, and to diff two versions with `git diff`. Never ship a QDF file; run it back through `pikepdf.open(...).save()` or `fix-qdf` after editing.

### Other useful options

| Option | Effect |
|---|---|
| `min_version="1.7"` / `force_version="1.4"` | raise or force the header version (forcing lower can break features) |
| `preserve_pdfa=True` | default; keeps PDF/A markers unless an incompatible option is used |
| `deterministic_id=True` | trailer `/ID` derived from content, so identical inputs give identical bytes |
| `normalize_content=True` | reformat content streams for diffing (whitespace only) |
| `recompress_flate=True` | re-Flate existing streams at qpdf's compression level, sometimes smaller |
| `fix_metadata_version=True` | default; updates `pdf:PDFVersion` in XMP to match the output |
| `encryption=` | see the previous chapter |

`deterministic_id` matters for reproducible builds: a CI job that regenerates a client's handbook and compares bytes with the previous run needs it, otherwise the random `/ID` makes every build differ.

### Saving in place and to streams

pikepdf refuses `pdf.save(same_path)` on a file it opened lazily, because it may still be reading from it. Options: open with `allow_overwriting_input=True`, save to a temporary name and rename, or save to a `BytesIO`:

```python
import io
buf = io.BytesIO()
pdf.save(buf)                       # any writable binary stream
data = buf.getvalue()
```

### A production save preset

```python
def save_for_delivery(pdf, path):
    pdf.save(path,
             linearize=True,
             object_stream_mode=pikepdf.ObjectStreamMode.generate,
             compress_streams=True,
             deterministic_id=True,
             min_version="1.6")
```

> **Tip:** Measure before promising size reductions. `object_stream_mode=generate` and `recompress_flate` help documents full of small objects; they do almost nothing for scan-heavy PDFs where JPEG images dominate, and for those the tool is image recompression, not qpdf options.

### Try It Yourself

```python
import pikepdf, os

opts = {
    "default": {},
    "objstm": {"object_stream_mode": pikepdf.ObjectStreamMode.generate},
    "objstm+recompress": {"object_stream_mode": pikepdf.ObjectStreamMode.generate, "recompress_flate": True},
    "linearized": {"linearize": True, "object_stream_mode": pikepdf.ObjectStreamMode.generate},
    "qdf": {"qdf": True},
}
src = "input.pdf"
print(f"{'variant':20} {'bytes':>10}  linearized")
for name, kw in opts.items():
    out = f"out_{name.replace('+', '_')}.pdf"
    with pikepdf.open(src) as pdf:
        pdf.save(out, **kw)
    with pikepdf.open(out) as check:
        print(f"{name:20} {os.path.getsize(out):>10}  {check.is_linearized}")
with open("out_qdf.pdf", "rb") as f:
    print(f.read(200).decode("latin-1"))
```

### Quiz

1. What does linearization optimise?
- [ ] File size
- [x] Time to display the first page over a network
- [ ] Compression of images
> Objects for page 1 and a hint table are placed at the start of the file.

2. Which option packs small objects into compressed object streams?
- [x] `object_stream_mode=pikepdf.ObjectStreamMode.generate`
- [ ] `compress_streams=True`
- [ ] `linearize=True`
> `compress_streams` only Flate-compresses stream data; object streams pack dictionaries and arrays.

3. When is QDF mode appropriate?
- [ ] For delivering to clients
- [x] For inspecting and diffing a PDF's objects in a text editor
- [ ] For reducing file size
> QDF expands everything into readable text and must be re-saved before delivery.

### Exercises

1. **Reproducible save** — Save the same input twice with `deterministic_id=True` and prove the outputs are byte-identical.
<details><summary>Solution</summary>

```python
import pikepdf, hashlib
def save(path):
    with pikepdf.open("input.pdf") as pdf:
        pdf.save(path, deterministic_id=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
    return hashlib.sha256(open(path, "rb").read()).hexdigest()
print(save("a.pdf") == save("b.pdf"))
```

</details>

2. **Web-ready batch** — Linearize every PDF in a folder into a `web/` subfolder and print any file whose `check_linearization()` reports issues.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
out_dir = pathlib.Path("web"); out_dir.mkdir(exist_ok=True)
for f in pathlib.Path(".").glob("*.pdf"):
    with pikepdf.open(f) as pdf:
        pdf.save(out_dir / f.name, linearize=True)
    with pikepdf.open(out_dir / f.name) as check:
        if not check.is_linearized or not check.check_linearization():
            print("problem:", f.name)
```

</details>

### Interview Questions

**Q: What is a linearized PDF and when do you produce one?**
A linearized file is ordered so that the objects needed to render the first page, plus a hint table describing where each later page's objects are, appear at the beginning, which lets a viewer with HTTP range requests show page 1 before the download finishes. I produce one for anything served on the web, such as a 767-page handbook hosted on a client portal, and always as the final step, because any subsequent incremental save destroys the ordering. It does nothing for email attachments or small files, and it slightly increases size, so it is not a default in my pipelines.

**Q: How would you reduce the size of a PDF with pikepdf, and what are the limits?**
First I measure where the bytes are: `pikepdf` can iterate objects and sum stream lengths by type, and for images `PdfImage` gives dimensions and filters. If the file has many small objects, such as a form with 168 fields and their appearance streams, `object_stream_mode=generate` plus `recompress_flate=True` gives 10 to 30 percent. If images dominate, qpdf options do nothing useful; I downsample or re-encode with Pillow through `PdfImage` or with Ghostscript's `pdfwrite` and re-embed. Removing unused objects happens automatically on save, since qpdf only writes reachable objects, so "garbage collection" is free. I never use `stream_decode_level=all`, which would re-encode JPEGs losslessly into Flate and make the file larger.

**Q: Why does `pdf.save()` refuse to overwrite the input file, and what are the correct alternatives?**
pikepdf opens files lazily; the `Pdf` object holds the file handle and reads object bytes on demand, so writing to the same path would overwrite data it has yet to read. The alternatives are opening with `allow_overwriting_input=True`, which makes pikepdf read the whole file into memory first, saving to a temporary path and renaming atomically with `os.replace`, or saving to a `BytesIO`. I use the temp-and-rename pattern in batch jobs because a crash mid-save leaves the original intact.

## Copying pages between documents and foreign objects

You have merged whole documents with `pages.extend`. Copying *parts* of documents, such as a single page onto a new page, a form XObject, a font or a logo image, requires understanding **foreign objects**: an object from one `Pdf` cannot be inserted into another directly, it must be copied with `copy_foreign()`, and pikepdf tracks the copies so shared resources are copied once.

### Pages are the easy case

```python
import pikepdf

with pikepdf.open("cover.pdf") as cover, pikepdf.open("body.pdf") as body:
    body.pages.insert(0, cover.pages[0])      # page copied with its resources
    body.pages.append(cover.pages[-1])
    body.save("with_cover.pdf")
```

`pages.insert`, `pages.append`, `pages.extend` and slice assignment all accept pages from another `Pdf` and copy the page dictionary and everything it references. The page object in `body.pages[0]` is a new object; changing it does not affect `cover`.

### The rule for everything else

```python
with pikepdf.open("logo_source.pdf") as src, pikepdf.open("target.pdf") as dst:
    logo_xobj = src.pages[0].Resources.XObject.Im0
    dst.pages[0].Resources.XObject.Logo = logo_xobj          # TypeError: foreign object
    dst.pages[0].Resources.XObject.Logo = dst.copy_foreign(logo_xobj)   # correct
    dst.save("target_with_logo.pdf")
```

`copy_foreign` deep-copies the object graph reachable from the argument into `dst`, returning the new indirect object. Calling it twice on the same source object returns the same copy for as long as `src` stays open, which is how a font shared by ten pages is copied once.

### Direct versus indirect objects

Direct objects (numbers, names, small dictionaries written inline) can be assigned across documents freely; only indirect objects (those with an object number) are foreign. `copy_foreign` on a direct object copies it too, so there is no harm in always calling it. `obj.is_indirect` tells you which you have.

### Turning a page into a form XObject

The most useful copy is a page converted into a reusable **Form XObject** so it can be drawn onto other pages (a letterhead, a "DRAFT" stamp, a background):

```python
with pikepdf.open("letterhead.pdf") as lh, pikepdf.open("letter.pdf") as pdf:
    xobj = pdf.copy_foreign(lh.pages[0].as_form_xobject())
    for page in pdf.pages:
        name = page.add_resource(xobj, pikepdf.Name.XObject)          # returns e.g. /Fx0
        page.contents_add(pikepdf.Stream(pdf, f"q {name} Do Q".encode()), prepend=True)
    pdf.save("letter_on_letterhead.pdf")
```

`Page.as_form_xobject()` wraps the page's content and resources as a Form XObject with `/BBox` from the media box; `add_resource` registers it under a unique name; `contents_add` with `prepend=True` draws it beneath the existing content. The Expert overlay chapter builds on this with scaling and positioning.

### Keeping the source alive

Copies reference bytes read lazily from the source file, so the source `Pdf` must remain open until `dst.save()` completes. This pattern is wrong:

```python
def get_page(path):
    with pikepdf.open(path) as src:
        return src.pages[0]          # src closes here; using the page later fails
```

Keep sources in a list or an `ExitStack` until after saving.

### Page-level properties that do not travel

Copying a page brings its `/Resources`, `/Contents`, `/Annots`, `/MediaBox` and `/Rotate`. It does not bring:

- Form field definitions in `/AcroForm` (widget annotations come, the field tree does not, unless pikepdf's newer versions handle it in `pages.append`).
- Outlines and page labels, which live in the catalog.
- Optional content groups (`/OCProperties`) that layers on the page reference; copy them or the layers become always-visible.
- Document-level `/Names` such as embedded files and named destinations that links point to.

Check for broken links after copying: an annotation with `/Dest` naming a destination that does not exist in the target simply does nothing when clicked.

> **Tip:** `pikepdf.Pdf.pages` supports `pages.remove(p=…)`, `del pages[i]`, `pages.reverse()` and slice assignment such as `pdf.pages[2:4] = other.pages[0:2]`, which copies and replaces in one step.

### Try It Yourself

```python
import pikepdf

with pikepdf.open("letterhead.pdf") as lh, pikepdf.open("letter.pdf") as pdf:
    page0 = lh.pages[0]
    print("source page is indirect:", page0.obj.is_indirect)
    xobj = pdf.copy_foreign(page0.as_form_xobject())
    again = pdf.copy_foreign(page0.as_form_xobject())
    print("bbox:", list(xobj.BBox), "form type:", xobj.get("/Subtype"))
    for i, page in enumerate(pdf.pages):
        name = page.add_resource(xobj, pikepdf.Name.XObject, prefix="Letterhead")
        page.contents_add(pikepdf.Stream(pdf, f"q {name} Do Q".encode()), prepend=True)
        print(f"page {i + 1}: drew {name}")
    pdf.pages.append(lh.pages[0])                 # also add the letterhead as a final page
    pdf.save("letter_on_letterhead.pdf")
print("objects in output:", len(pikepdf.open("letter_on_letterhead.pdf").objects))
```

### Quiz

1. What happens when you assign an indirect object from one `Pdf` into another without `copy_foreign`?
- [ ] It is copied automatically
- [x] pikepdf raises a `TypeError` about foreign objects
- [ ] It is linked by reference
> Only pages are copied implicitly; other objects need `copy_foreign`.

2. Why must the source `Pdf` stay open until the destination is saved?
- [x] Copied objects read stream data lazily from the source file
- [ ] Because of file locking
- [ ] It does not need to
> Closing early produces errors or empty streams at save time.

3. What does `Page.as_form_xobject()` return?
- [ ] A new page
- [x] A Form XObject stream with the page's content and resources
- [ ] A rasterised image
> It is the standard way to draw one page's content onto another.

### Exercises

1. **N-up imposition** — Place pages 1 and 2 of a source side by side on one landscape Letter page.
<details><summary>Solution</summary>

```python
import pikepdf
with pikepdf.open("source.pdf") as src, pikepdf.new() as out:
    page = out.add_blank_page(page_size=(792, 612))
    for i, x in enumerate((0, 396)):
        xobj = out.copy_foreign(src.pages[i].as_form_xobject())
        name = page.add_resource(xobj, pikepdf.Name.XObject)
        page.contents_add(pikepdf.Stream(out, f"q 0.5 0 0 0.5 {x} 0 cm {name} Do Q".encode()))
    out.save("2up.pdf")
```

</details>

2. **Shared copy check** — Prove that copying the same font object twice from one source yields one object in the destination.
<details><summary>Solution</summary>

```python
import pikepdf
with pikepdf.open("source.pdf") as src, pikepdf.new() as dst:
    font = src.pages[0].Resources.Font[list(src.pages[0].Resources.Font.keys())[0]]
    a = dst.copy_foreign(font); b = dst.copy_foreign(font)
    print("same object:", a.objgen == b.objgen)
```

</details>

### Interview Questions

**Q: Explain what `copy_foreign` does and why pikepdf needs it.**
Every indirect object belongs to one `Pdf`, identified by object number and generation within that file, so a reference from file A means nothing inside file B. `copy_foreign` walks the graph reachable from the source object, allocates new object numbers in the destination, copies dictionaries, arrays and stream data, and records the mapping so subsequent copies of the same source object return the existing copy. That mapping is what keeps a shared font or image from being duplicated when ten pages that use it are copied, and it is why the source must stay open, since stream data is read on demand when the destination is written. Pages get this treatment automatically through the `pages` API; anything else you must copy explicitly.

**Q: How would you stamp a letterhead under 5,000 generated letters efficiently?**
Open the letterhead once, convert its first page to a Form XObject once per destination with `copy_foreign(as_form_xobject())`, register it on each page with `add_resource`, and prepend a two-token content stream `q /Fx0 Do Q` so it draws beneath the text. Each letter costs one small stream and one dictionary entry rather than a page copy, and the letterhead's fonts and images are stored once per file. For 5,000 files I run this in a multiprocessing pool because pikepdf releases the GIL in qpdf calls only partly, keep the letterhead open in each worker, and save with `object_stream_mode=generate` and `linearize=True` if they go to a portal.

**Q: What breaks when you copy pages that contain form fields, links or layers?**
Widget annotations are copied because they hang off the page's `/Annots`, but the field dictionaries they belong to live in the catalog's `/AcroForm /Fields`, so the copied widgets may be orphaned or, if names collide, silently linked to fields in the destination; newer pikepdf versions merge AcroForm entries on `pages.append`, older ones need a manual copy. Link annotations with named destinations lose their targets unless the `/Names /Dests` tree is copied. Optional content layers keep their `/OC` references but the destination has no matching `/OCProperties`, so the content renders as always visible. My post-copy checklist verifies each of these three and fixes them explicitly.

## Attachments and embedded files

A PDF can carry other files inside it, either as document-level attachments listed in the catalog's `/Names /EmbeddedFiles` tree or as file attachment annotations pinned to a page. Closing packages carry the signed settlement statement as XLSX, invoices embed their XML for e-invoicing, and PDF/A-3 exists specifically to allow arbitrary embedded files. pikepdf exposes this through `pdf.attachments`.

### Listing and extracting

```python
import pikepdf

with pikepdf.open("closing_package.pdf") as pdf:
    for name, spec in pdf.attachments.items():
        f = spec.get_file()                          # AttachedFile
        print(name, f.size, f.mime_type, f.creation_date, spec.description)
        with open(f"extracted_{name}", "wb") as out:
            out.write(f.read_bytes())
```

`pdf.attachments` is a mapping from file name to `AttachedFileSpec`. Each spec can hold several platform-specific versions of a file, which is why `get_file()` exists; in practice there is one.

### Adding an attachment

```python
with pikepdf.open("invoice.pdf") as pdf:
    spec = pikepdf.AttachedFileSpec.from_filepath(pdf, "invoice.xml", description="Machine-readable invoice")
    spec.get_file().mime_type = "application/xml"
    pdf.attachments["invoice.xml"] = spec
    pdf.save("invoice_with_xml.pdf")
```

From bytes rather than a path:

```python
spec = pikepdf.AttachedFileSpec(pdf, data_bytes, description="Rate matrix", mime_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename="rates.xlsx")
pdf.attachments["rates.xlsx"] = spec
```

`from_filepath` fills the size, MIME type (guessed from the extension) and dates; the bytes are stored in an `/EmbeddedFile` stream, Flate-compressed by default on save.

### Removing and replacing

```python
del pdf.attachments["old_rates.xlsx"]
pdf.attachments["rates.xlsx"] = new_spec          # replaces if the name exists
```

### What the objects look like

```
/Root /Names /EmbeddedFiles /Names [ (rates.xlsx) 12 0 R ... ]
12 0 obj << /Type /Filespec /F (rates.xlsx) /UF (rates.xlsx) /Desc (Rate matrix)
             /EF << /F 13 0 R /UF 13 0 R >> /AFRelationship /Data >>
13 0 obj << /Type /EmbeddedFile /Subtype /application#2Fvnd... /Length ... /Params << /Size 48213 /ModDate (D:2026...) >> >> stream
```

`/AFRelationship` is required for PDF/A-3 and describes why the file is there: `/Source`, `/Data`, `/Alternative`, `/Supplement` or `/Unspecified`. pikepdf lets you set it through `spec.relationship = pikepdf.Name.Data`.

### Page-level attachment annotations

An attachment pinned to a page is a `/FileAttachment` annotation with an icon:

```python
page = pdf.pages[0]
spec = pikepdf.AttachedFileSpec.from_filepath(pdf, "survey.pdf")
annot = pikepdf.Dictionary(Type=pikepdf.Name.Annot, Subtype=pikepdf.Name.FileAttachment,
                           Rect=[50, 700, 70, 720], FS=spec.obj, Name=pikepdf.Name.Paperclip, Contents="Property survey")
page.Annots = page.get("/Annots", pikepdf.Array()) + [pdf.make_indirect(annot)]
```

Such files do not appear in `pdf.attachments`, which only reads the document-level name tree; scan `/Annots` for `/FileAttachment` when auditing.

### Security and compliance notes

Attachments are the classic way to smuggle executables through email filters, so many gateways strip or block PDFs with embedded files. Some viewers refuse to open attachments with executable extensions. PDF/A-1 and PDF/A-2 forbid embedded files except, in A-2, other PDF/A files; PDF/A-3 allows any type but requires `/AFRelationship` and a MIME type. The Expert PDF/A chapter returns to this.

> **Warning:** Encryption applies to embedded file streams too, but viewers that show attachment names read the name tree, which is not hidden. Do not rely on file names being confidential.

### Try It Yourself

```python
import pikepdf, io, csv

rows = [["State", "Liability", "Rate"], ["WY", "100000", "575.00"], ["CO", "100000", "610.00"]]
buf = io.StringIO(); csv.writer(buf).writerows(rows)
data = buf.getvalue().encode()

with pikepdf.open("input.pdf") as pdf:
    spec = pikepdf.AttachedFileSpec(pdf, data, description="Rate matrix (CSV)", mime_type="text/csv", filename="rates.csv")
    spec.relationship = pikepdf.Name.Data
    pdf.attachments["rates.csv"] = spec
    pdf.save("with_attachment.pdf")

with pikepdf.open("with_attachment.pdf") as pdf:
    for name, spec in pdf.attachments.items():
        f = spec.get_file()
        print(f"{name}: {f.size} bytes, {f.mime_type}, rel={spec.relationship}, desc={spec.description!r}")
        print(f.read_bytes().decode().splitlines()[0])
    print("name tree entries:", len(pdf.Root.Names.EmbeddedFiles.Names) // 2)
```

### Quiz

1. Where are document-level attachments listed?
- [ ] In each page's `/Annots`
- [x] In the catalog's `/Names /EmbeddedFiles` name tree
- [ ] In the Info dictionary
> `pdf.attachments` reads and writes that tree.

2. Which PDF/A level allows arbitrary embedded file types?
- [ ] PDF/A-1b
- [ ] PDF/A-2b
- [x] PDF/A-3
> A-3 requires `/AFRelationship` and a MIME type on each file.

3. `pdf.attachments` does not show…
- [ ] files added with `from_filepath`
- [x] files pinned to pages as `/FileAttachment` annotations
- [ ] files with a description
> Annotation attachments must be found by scanning page `/Annots`.

### Exercises

1. **Attachment audit** — For each PDF in a folder, list attachment names, sizes and MIME types, flagging any with executable extensions.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
RISKY = {".exe", ".js", ".vbs", ".bat", ".cmd", ".scr"}
for f in pathlib.Path("pdfs").glob("*.pdf"):
    with pikepdf.open(f) as pdf:
        for name, spec in pdf.attachments.items():
            af = spec.get_file()
            flag = " RISKY" if pathlib.Path(name).suffix.lower() in RISKY else ""
            print(f"{f.name}: {name} {af.size} {af.mime_type}{flag}")
```

</details>

2. **Extract all** — Extract every document-level attachment and every page-level file attachment annotation into an `attachments/` folder.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
out = pathlib.Path("attachments"); out.mkdir(exist_ok=True)
with pikepdf.open("package.pdf") as pdf:
    for name, spec in pdf.attachments.items():
        (out / name).write_bytes(spec.get_file().read_bytes())
    for i, page in enumerate(pdf.pages, 1):
        for annot in page.get("/Annots", []):
            if annot.get("/Subtype") == pikepdf.Name.FileAttachment:
                fs = annot.FS                                   # the /Filespec dictionary
                name = str(fs.get("/UF", fs.get("/F")))
                (out / f"page{i}_{name}").write_bytes(fs.EF.F.read_bytes())
print(sorted(p.name for p in out.iterdir()))
```

</details>

### Interview Questions

**Q: How are embedded files structured in a PDF, and how does pikepdf expose them?**
The catalog's `/Names` dictionary has an `/EmbeddedFiles` name tree mapping file names to `/Filespec` dictionaries; each Filespec has `/F` and `/UF` names, an optional `/Desc`, an `/EF` dictionary pointing at one or more `/EmbeddedFile` streams that hold the bytes with `/Params` for size and dates, and for PDF/A-3 an `/AFRelationship`. pikepdf wraps this as `pdf.attachments`, a mapping of names to `AttachedFileSpec` objects, each giving an `AttachedFile` with `read_bytes()`, `size`, `mime_type` and dates. Page-level attachments are separate `/FileAttachment` annotations that reference a Filespec, and those are not in the mapping, so an audit must also scan annotations.

**Q: A client wants the Excel rate matrix inside the PDF handbook and still wants PDF/A. What do you deliver?**
PDF/A-3, because A-1 forbids embedded files and A-2 allows only other PDF/A files. I attach the XLSX with `AttachedFileSpec`, set `mime_type` to the spreadsheet type, set `spec.relationship` to `/Data` or `/Supplement`, and also add the Filespec to the catalog's `/AF` array as the standard expects for associated files. The XMP must declare `pdfaid:part` 3 and the appropriate conformance level, and the whole file has to pass veraPDF's PDF/A-3 profile. I explain that A-3 validators check the attachment's metadata but not the XLSX content itself, so an archive reader in 2050 may open the PDF and not the spreadsheet.

**Q: Why might a PDF with attachments be rejected by an email gateway, and what do you do about it?**
Gateways flag embedded files because a PDF can carry executables or macro-enabled documents that bypass extension filters, and some enforce a blanket policy of stripping or quarantining any PDF whose name tree is non-empty. When a client's deliverable keeps bouncing I first check `pdf.attachments` and annotation attachments, remove anything not needed, and rename or repackage risky types. If the attachment is essential I deliver it separately through a share link and keep the PDF clean, or convert the attached data to a visible appendix table so the information is in the PDF without an embedded file.

# LEVEL: Advanced

## Content streams: parse_content_stream and unparse

Everything drawn on a page comes from its **content stream**: a sequence of operands and operators in PDF's PostScript-like syntax (`BT /F1 12 Tf 72 720 Td (Hello) Tj ET`). pikepdf can parse a content stream into a list of instructions, let you inspect or modify them, and serialise them back. This is how you find text positions without a text library, strip a watermark, recolour a logo, or remove an operator that a validator complains about.

### Parsing

```python
import pikepdf
from pikepdf import parse_content_stream, unparse_content_stream, Operator

with pikepdf.open("letter.pdf") as pdf:
    page = pdf.pages[0]
    for operands, operator in parse_content_stream(page):
        print(operator, list(operands))
```

Each item is a `ContentStreamInstruction` behaving like a `(operands, operator)` pair, with `operator` a `pikepdf.Operator` and `operands` a list of pikepdf objects. Passing the page (rather than `page.Contents`) concatenates multiple content streams into one sequence the way a viewer does. Inline images become `ContentStreamInlineImage` items with operator `INLINE IMAGE`.

### The operators that matter

| Group | Operators | Meaning |
|---|---|---|
| Graphics state | `q` `Q` `cm` `w` `gs` | save, restore, transform, line width, ext state |
| Path | `m` `l` `c` `re` `h` | move, line, curve, rectangle, close |
| Paint | `S` `f` `B` `n` `W` | stroke, fill, both, no-op, clip |
| Colour | `g` `rg` `k` `cs` `sc` `scn` (lowercase fill, uppercase stroke) | grey, RGB, CMYK, colour space |
| Text | `BT` `ET` `Tf` `Td` `Tm` `Tj` `TJ` `'` `"` | text object, font, position, show |
| XObjects | `Do` | draw an image or form |
| Marked content | `BMC` `BDC` `EMC` | tagging, optional content, watermark markers |

Text is drawn by `Tj` (a string) or `TJ` (an array of strings and kerning numbers). The string bytes are in the font's encoding, so for simple fonts with WinAnsi they read like ASCII; for subsetted CID fonts they are glyph ids, which is why pikepdf alone cannot reliably extract text and PyMuPDF or pdfminer are used for that.

### Modifying and writing back

```python
from pikepdf import Name, Operator

with pikepdf.open("draft.pdf") as pdf:
    for page in pdf.pages:
        new = []
        for operands, operator in parse_content_stream(page):
            if operator == Operator("rg") and [float(o) for o in operands] == [1.0, 0.0, 0.0]:
                operands = [0, 0, 0]                 # red fill -> black
            new.append((operands, operator))
        page.Contents = pdf.make_stream(unparse_content_stream(new))
    pdf.save("draft_black.pdf")
```

`unparse_content_stream` returns bytes; `pdf.make_stream` wraps them in a new stream object. Assigning `page.Contents` replaces any array of streams with one stream, which is fine because the sequence was already concatenated.

### Removing a watermark drawn as marked content

Watermarks added by Acrobat are wrapped in `/Artifact` marked content with a `/Subtype /Watermark`:

```python
def strip_watermark(page, pdf):
    out, depth, skipping = [], 0, False
    for operands, op in parse_content_stream(page):
        if op == Operator("BDC") and len(operands) == 2 and operands[0] == Name.Artifact and operands[1].get("/Subtype") == Name.Watermark:
            skipping, depth = True, 1; continue
        if skipping:
            if op in (Operator("BDC"), Operator("BMC")): depth += 1
            elif op == Operator("EMC"):
                depth -= 1
                if depth == 0: skipping = False
            continue
        out.append((operands, op))
    page.Contents = pdf.make_stream(unparse_content_stream(out))
```

Watermarks added as separate Form XObjects are simpler: delete the `Do` instruction that names them and remove the XObject from `/Resources`.

### Finding where text is drawn

Tracking the text matrix gives approximate positions for simple fonts:

```python
x = y = 0.0
for operands, op in parse_content_stream(page):
    if op == Operator("Td"): x += float(operands[0]); y += float(operands[1])
    elif op == Operator("Tm"): x, y = float(operands[4]), float(operands[5])
    elif op == Operator("Tj"): print(f"({x:.0f},{y:.0f}) {bytes(operands[0])[:40]}")
```

Good enough to find "SIGN HERE" anchors in a settlement statement; not good enough for a text extractor.

### Form XObjects have content streams too

`xobj = page.Resources.XObject.Fx0` is a stream whose bytes are a content stream with its own `/Resources`. `parse_content_stream(xobj)` works the same way, and `pikepdf.Page(xobj)` is not needed; pass the stream directly.

> **Warning:** Content streams depend on the graphics state built by every preceding operator. Deleting a `q` without its `Q`, or an operator inside a `BT`…`ET` block that another depends on, produces a page that renders differently in every viewer. Always remove whole balanced groups.

### Try It Yourself

```python
import pikepdf
from pikepdf import parse_content_stream, unparse_content_stream, Operator, Name
from collections import Counter

with pikepdf.open("input.pdf") as pdf:
    page = pdf.pages[0]
    instructions = list(parse_content_stream(page))
    ops = Counter(str(op) for _, op in instructions)
    print("instructions:", len(instructions))
    print("top operators:", ops.most_common(8))

    fonts = {str(operands[0]): float(operands[1]) for operands, op in instructions if op == Operator("Tf")}
    print("fonts used (name: size):", fonts)

    # Draw a red "DRAFT" box over the top-left corner without touching existing content
    extra = [
        ([], Operator("q")),
        ([1, 0, 0], Operator("rg")),
        ([36, 720, 120, 24], Operator("re")),
        ([], Operator("f")),
        ([], Operator("Q")),
    ]
    page.contents_add(pdf.make_stream(unparse_content_stream(extra)))
    print("new instruction count:", len(list(parse_content_stream(page))))
    pdf.save("with_box.pdf")
```

### Quiz

1. What does `parse_content_stream(page)` return?
- [ ] The raw bytes of the stream
- [x] A list of (operands, operator) instructions, concatenating all content streams
- [ ] The extracted text
> Passing the page joins multiple `/Contents` streams into one sequence.

2. Which operator draws an image or Form XObject?
- [ ] `Tj`
- [x] `Do`
- [ ] `re`
> `Do` takes an XObject name from the page's `/Resources /XObject`.

3. Why can pikepdf not reliably extract text from `Tj` strings?
- [ ] They are encrypted
- [x] The bytes are in the font's encoding, often glyph ids for subsetted fonts
- [ ] `Tj` is deprecated
> Mapping bytes to Unicode needs the font's `/ToUnicode` CMap, which text libraries implement.

### Exercises

1. **Colour census** — Count how many distinct RGB fill colours a page uses.
<details><summary>Solution</summary>

```python
import pikepdf
from pikepdf import parse_content_stream, Operator
with pikepdf.open("input.pdf") as pdf:
    colours = {tuple(round(float(o), 3) for o in ops) for ops, op in parse_content_stream(pdf.pages[0]) if op == Operator("rg")}
    print(len(colours), sorted(colours))
```

</details>

2. **Remove every image** — Strip all `Do` instructions that reference Image XObjects on every page, leaving Form XObjects alone.
<details><summary>Solution</summary>

```python
import pikepdf
from pikepdf import parse_content_stream, unparse_content_stream, Operator, Name
with pikepdf.open("input.pdf") as pdf:
    for page in pdf.pages:
        xobjs = page.Resources.get("/XObject", {})
        keep = []
        for operands, op in parse_content_stream(page):
            if op == Operator("Do") and xobjs.get(operands[0], {}).get("/Subtype") == Name.Image:
                continue
            keep.append((operands, op))
        page.Contents = pdf.make_stream(unparse_content_stream(keep))
    pdf.save("no_images.pdf")
```

</details>

### Interview Questions

**Q: Describe the structure of a PDF content stream and how you would modify one safely.**
A content stream is a sequence of operands followed by an operator, executed against a graphics state: `q`/`Q` push and pop state, `cm` changes the transformation matrix, `BT`…`ET` brackets text objects where `Tf`, `Td` and `Tj` set the font, move and draw, and `Do` paints XObjects from the page's resources. Safe modification means parsing to instructions with `parse_content_stream`, changing or removing whole balanced groups such as a `q`…`Q` block or a `BDC`…`EMC` marked content section, and serialising with `unparse_content_stream` into a new stream assigned to `page.Contents`. I never edit the bytes with regex, because operators can be split across streams, strings may contain what looks like operators, and inline images embed binary data; and I re-render the page with a viewer afterwards to confirm the graphics state still balances.

**Q: How would you remove a "DRAFT" watermark from 300 PDFs?**
First I inspect one page's instructions to see how the watermark was added. If it is a `BDC /Artifact <</Subtype /Watermark>>` block, I skip everything between that `BDC` and its matching `EMC`, tracking nesting depth. If it is a Form XObject drawn with `Do`, I drop that instruction and the XObject resource; if it is text drawn directly with a distinctive font or colour, I remove the `BT`…`ET` group containing that `Tj`. If the watermark lives in an annotation, no content stream editing is needed and I delete the annotation instead. The script logs the method used per file and a count of removed instructions, and I spot-check rendered pages, because a watermark added by a scanner can be burned into the page image and cannot be removed this way.

**Q: What are inline images and why do they complicate parsing?**
An inline image is image data embedded directly in the content stream between `BI`, `ID` and `EI` operators rather than as a separate XObject; it is used for tiny images such as bullets and rules. The binary data after `ID` can contain any bytes, including sequences that look like operators or `EI`, so a naive tokenizer breaks. pikepdf's parser understands the construct and yields a `ContentStreamInlineImage` item, and `unparse_content_stream` writes it back correctly, which is one reason to use the library's parser rather than splitting on whitespace.

## Images: PdfImage, extracting and replacing

Images in a PDF are **Image XObjects**: streams with `/Subtype /Image`, a width and height, a colour space, bits per component and a filter such as `/DCTDecode` (JPEG), `/FlateDecode` or `/JPXDecode`. pikepdf's `PdfImage` wrapper decodes them to Pillow images or extracts the original bytes without re-encoding, and lets you replace the stream data for compression or redaction.

### Listing images on a page

```python
import pikepdf
from pikepdf import PdfImage

with pikepdf.open("scan.pdf") as pdf:
    for i, page in enumerate(pdf.pages, 1):
        for name, raw in page.images.items():        # dict of /Name -> stream
            img = PdfImage(raw)
            print(i, name, img.width, img.height, img.colorspace, img.bits_per_component, img.filters)
```

`page.images` walks the page's `/Resources /XObject` for `/Image` entries; it does not descend into Form XObjects, so for those iterate `Resources.XObject` recursively.

### Extracting without recompression

```python
img = PdfImage(raw)
path = img.extract_to(fileprefix="page1_logo")      # writes page1_logo.jpg / .png / .tiff
print(path)
```

`extract_to` writes the original data when possible: a `/DCTDecode` stream becomes a `.jpg` with the exact original bytes; Flate images become PNG; JBIG2 and CCITT become TIFF where supported. This is the right call for "give me the original photos from this PDF".

### Decoding to Pillow

```python
pil = img.as_pil_image()          # PIL.Image
pil.thumbnail((200, 200))
pil.save("thumb.png")
```

`as_pil_image` handles most colour spaces (`DeviceRGB`, `DeviceGray`, `DeviceCMYK`, `Indexed`, `ICCBased`) and applies `/Decode` arrays and `/SMask` transparency where it can. Some `/Separation` and `/DeviceN` images raise `UnsupportedImageTypeError`; catch it and fall back to a renderer.

### Replacing image data (downsampling)

```python
from PIL import Image
import io

with pikepdf.open("brochure.pdf") as pdf:
    for page in pdf.pages:
        for name, raw in page.images.items():
            img = PdfImage(raw)
            if img.width < 1500 or img.colorspace not in ("/DeviceRGB", "/DeviceGray"):
                continue
            pil = img.as_pil_image()
            pil.thumbnail((1200, 1200))
            buf = io.BytesIO(); pil.save(buf, "JPEG", quality=80)
            raw.write(buf.getvalue(), filter=pikepdf.Name.DCTDecode)
            raw.Width, raw.Height = pil.width, pil.height
            raw.ColorSpace = pikepdf.Name.DeviceRGB if pil.mode == "RGB" else pikepdf.Name.DeviceGray
            raw.BitsPerComponent = 8
            for key in ("/SMask", "/Decode", "/DecodeParms"):
                if key in raw: del raw[key]
    pdf.save("brochure_small.pdf")
```

`stream.write(data, filter=…)` sets the bytes and the `/Filter`, and pikepdf updates `/Length`. You must keep the dictionary consistent: dimensions, colour space, bits and any masks. Deleting `/SMask` loses transparency, so skip images that have one unless you flatten them onto white first.

### Replacing with a different picture

To swap a logo, keep the XObject name and dictionary shape and write new data with matching dimensions; if dimensions change, the page still draws it into the same rectangle set by the `cm` matrix, so the image is scaled to that box. That is convenient for a same-ratio logo and a distortion for anything else.

### Redaction is not replacement

Overwriting an image's bytes with a blank image removes the pixels, but the old stream may survive in the file if it is referenced elsewhere or if you save incrementally. Save normally (not `incremental`) so unreferenced objects are dropped, and check that no other page shares the same XObject before redacting.

### Image masks and stencil masks

`/ImageMask true` images are 1-bit stencils painted with the current fill colour; `PdfImage.is_image_mask` flags them. `/SMask` is a soft mask image for alpha; `/Mask` is either a colour-key array or a stencil. Scanned faxes are `/CCITTFaxDecode` bilevel images, often 1-bit `/DeviceGray`, and JBIG2 (`/JBIG2Decode`) needs the optional `jbig2dec` decoder installed for `as_pil_image` to work.

> **Tip:** Before compressing, sort images by `raw.Length` (their compressed byte size) and look at the top ten. In most bloated PDFs three or four images account for 80 percent of the file.

### Try It Yourself

```python
import pikepdf
from pikepdf import PdfImage

with pikepdf.open("input.pdf") as pdf:
    rows = []
    for pno, page in enumerate(pdf.pages, 1):
        for name, raw in page.images.items():
            img = PdfImage(raw)
            rows.append((int(raw.get("/Length", 0)), pno, str(name), img.width, img.height, str(img.colorspace), img.bits_per_component, ",".join(str(f) for f in img.filters)))
    rows.sort(reverse=True)
    total = sum(r[0] for r in rows)
    print(f"{len(rows)} images, {total / 1024:.0f} KB total")
    for size, pno, name, w, h, cs, bpc, filt in rows[:10]:
        print(f"page {pno:3} {name:8} {w:5}x{h:<5} {cs:14} {bpc}bpc {filt:12} {size / 1024:7.0f} KB")
    if rows:
        _, pno, name, *_ = rows[0]
        biggest = PdfImage(pdf.pages[pno - 1].images[name])
        print("largest image written to:", biggest.extract_to(fileprefix="largest"))
```

### Quiz

1. Which method extracts the original JPEG bytes without re-encoding?
- [ ] `as_pil_image().save()`
- [x] `PdfImage.extract_to(fileprefix=...)`
- [ ] `raw.read_bytes()`
> `extract_to` writes the native format when the filter allows; `read_bytes` gives raw stream data without a file header for some filters.

2. After downsampling and calling `raw.write(jpeg_bytes, filter=Name.DCTDecode)`, what else must you update?
- [x] `/Width`, `/Height`, `/ColorSpace`, `/BitsPerComponent` and remove stale masks
- [ ] Nothing, pikepdf infers it
- [ ] Only `/Length`
> The dictionary must describe the new data or viewers render garbage.

3. What is an `/ImageMask true` image?
- [ ] A transparent PNG
- [x] A 1-bit stencil painted with the current fill colour
- [ ] A JPEG with alpha
> Stencil masks have no colour of their own.

### Exercises

1. **Extract all images** — Save every image from a PDF as `p<page>_<name>.<ext>` and print a count.
<details><summary>Solution</summary>

```python
import pikepdf
from pikepdf import PdfImage
count = 0
with pikepdf.open("input.pdf") as pdf:
    for pno, page in enumerate(pdf.pages, 1):
        for name, raw in page.images.items():
            try:
                PdfImage(raw).extract_to(fileprefix=f"p{pno}_{str(name)[1:]}"); count += 1
            except pikepdf.UnsupportedImageTypeError as e:
                print("skipped", pno, name, e)
print(count, "images")
```

</details>

2. **Greyscale conversion** — Convert every RGB image to 8-bit grey JPEG, skipping images with soft masks.
<details><summary>Solution</summary>

```python
import pikepdf, io
from pikepdf import PdfImage, Name
with pikepdf.open("input.pdf") as pdf:
    for page in pdf.pages:
        for name, raw in page.images.items():
            if "/SMask" in raw or PdfImage(raw).colorspace != "/DeviceRGB": continue
            pil = PdfImage(raw).as_pil_image().convert("L")
            buf = io.BytesIO(); pil.save(buf, "JPEG", quality=85)
            raw.write(buf.getvalue(), filter=Name.DCTDecode)
            raw.ColorSpace = Name.DeviceGray; raw.BitsPerComponent = 8
            for k in ("/Decode", "/DecodeParms"):
                if k in raw: del raw[k]
    pdf.save("grey.pdf")
```

</details>

### Interview Questions

**Q: How is an image stored in a PDF, and what does pikepdf's `PdfImage` add?**
As an Image XObject: a stream whose dictionary has `/Subtype /Image`, `/Width`, `/Height`, `/ColorSpace`, `/BitsPerComponent`, an optional `/Filter` such as `/DCTDecode` for JPEG or `/FlateDecode` for lossless data, and optional `/SMask`, `/Mask`, `/Decode` and `/ImageMask` entries; the page draws it with `Do` after a `cm` that sets the destination rectangle. `PdfImage` wraps that stream and interprets the dictionary: it reports size, colour space and filters, extracts native bytes with `extract_to` without re-encoding, and decodes to Pillow with `as_pil_image`, applying indexed palettes, ICC-based spaces and masks where it can. What it does not do is find where the image is drawn on the page; that needs the content stream and the transformation matrix.

**Q: A 40 MB scanned closing package must go under 10 MB. What is your approach with pikepdf?**
Profile first: list every image with its compressed `/Length`, dimensions and filter. Scans are usually 300 dpi RGB JPEGs or lossless Flate images of full-page scans, so the wins are downsampling to 150 dpi for text pages, converting colour scans of black-and-white documents to grey or bilevel, and re-encoding Flate images as JPEG at quality 70 to 80. I do this per image with `as_pil_image`, Pillow resizing and `raw.write` with `/DCTDecode`, keeping the dictionary consistent and skipping images with soft masks. If pages are pure text scans I consider JBIG2 through an external encoder or CCITT G4 through Pillow's TIFF encoder for 1-bit images, which gives ten-to-one over JPEG. After saving with object streams enabled I compare page renders side by side, because compression that destroys signature legibility is not acceptable on a title document.

**Q: Why can replacing image bytes leave the old image recoverable, and how do you make redaction stick?**
If the file is saved incrementally, the original stream stays in the file with the new object appended, and if the XObject is shared by several pages, editing one reference edits all of them while another copy may exist under a different name. To make redaction stick I save a full rewrite (the default, never `incremental`), which drops unreferenced objects; I check with `pdf.objects` or `qpdf --show-npages` and a text search of the output bytes that the old data is gone; and I remember that image redaction does not touch text drawn over or under the image, so a real redaction workflow also edits the content stream or uses a purpose-built tool that rasterises the region.

## Form fields and AcroForm dictionary internals

A fillable PDF stores its fields in the catalog's `/AcroForm` dictionary as a tree of field dictionaries, and shows them on pages through **widget annotations**. Ali's 168-field intake forms live here. pikepdf does not have a high-level "fill form" API like PyMuPDF; it gives you the dictionaries, which is exactly what you need when a form is broken, when field names must be renamed for a merge, or when a fill must be done in a standards-correct way that survives signing.

### The AcroForm dictionary

```python
import pikepdf

with pikepdf.open("intake.pdf") as pdf:
    af = pdf.Root.AcroForm
    print(af.keys())        # /Fields /DA /DR /NeedAppearances /SigFlags ...
    print(len(af.Fields), "top-level fields")
```

| Key | Meaning |
|---|---|
| `/Fields` | array of top-level field dictionaries |
| `/DR` | default resources: fonts (`/Font /Helv`) used by appearance streams |
| `/DA` | default appearance string, e.g. `/Helv 0 Tf 0 g` |
| `/NeedAppearances` | `true` asks viewers to regenerate appearance streams from values |
| `/SigFlags` | 1 = has signature fields, 2 = append-only (do not rewrite the file) |
| `/XFA` | XFA form data; pikepdf leaves it alone, and most tools cannot fill XFA |

### Field dictionaries

```python
def walk(fields, prefix=""):
    for f in fields:
        name = str(f.get("/T", ""))
        full = f"{prefix}.{name}" if prefix and name else prefix or name
        if "/Kids" in f and any("/T" in k for k in f.Kids):
            yield from walk(f.Kids, full)          # non-terminal: children are fields
        else:
            yield full, f
```

| Key | Meaning |
|---|---|
| `/FT` | field type: `/Tx` text, `/Btn` button (check box, radio, push), `/Ch` choice, `/Sig` signature |
| `/T` | partial name; the fully qualified name joins ancestors with dots |
| `/V` | value: string for text, name (`/Yes`, `/Off`) for check boxes, string or array for choices |
| `/DV` | default value |
| `/Ff` | flags bitfield: bit 1 read-only, bit 2 required, bit 13 multiline, bit 14 password, bit 16 radio, bit 17 pushbutton, bit 18 combo |
| `/Kids` | child fields or widgets |
| `/Opt` | options for choice fields and export values for radio groups |
| `/MaxLen` | text length limit |

Field type and flags are inheritable: a child without `/FT` uses its parent's. Use `f.get("/FT")` and walk up `/Parent` when missing.

### Widgets: where fields appear

A widget is an annotation with `/Subtype /Widget`, a `/Rect`, an `/AP` appearance dictionary and a `/Parent` pointing at its field (or it *is* the field when a field has one widget and the dictionaries are merged). Pages list them in `/Annots`. A check box widget's `/AP /N` dictionary has one stream per state (`/Yes` and `/Off`), and `/AS` selects the current one.

### Filling a text field correctly

```python
with pikepdf.open("intake.pdf") as pdf:
    for name, field in walk(pdf.Root.AcroForm.Fields):
        if name == "client.name":
            field.V = pikepdf.String("Meridian Escrow LLC")
    pdf.Root.AcroForm.NeedAppearances = True
    pdf.save("intake_filled.pdf")
```

Setting `/V` changes the data; the visible text comes from the widget's `/AP /N` stream, which still shows the old value until regenerated. `NeedAppearances true` tells Acrobat and most viewers to rebuild appearances on open, which is enough for review copies. For print-ready or flattened output, generate the appearance stream yourself (a small content stream using `/DR` fonts) or use PyMuPDF, which builds appearances. pikepdf 8+ also offers `pikepdf.form` helpers in newer releases for common cases; check `dir(pikepdf)` for your version.

### Check boxes and radio buttons

```python
field.V = pikepdf.Name.Yes          # must match a state name in the widget's /AP /N
for widget in field.get("/Kids", [field]):
    widget.AS = pikepdf.Name.Yes if pikepdf.Name.Yes in widget.AP.N else pikepdf.Name.Off
```

The on-state name is whatever the form author used: `/Yes`, `/On`, `/1`, `/Option1`. Read `widget.AP.N.keys()` to find it; guessing `/Yes` is the most common filling bug.

### Renaming fields for a merge

Two forms merged into one file with duplicate `/T` names become one field with one value. Prefix names per source before merging:

```python
def prefix_fields(pdf, prefix):
    for f in pdf.Root.AcroForm.Fields:
        f.T = pikepdf.String(f"{prefix}.{f.T}")
```

Only top-level fields need the prefix because children inherit the qualified name.

### Flattening

Flattening means drawing each widget's appearance into the page content and removing the field. With pikepdf: for each widget, wrap its `/AP /N` stream (or the `/AS` state's stream) as a Form XObject, add it to the page with a `cm` translation to the widget's `/Rect`, then delete the annotation and the field. pikepdf ≥ 8 provides `pdf.flatten_annotations("all")` (or `"screen"` / `"print"`) which does exactly this through qpdf's `--flatten-annotations`, and afterwards `/AcroForm` should be removed.

> **Warning:** Do not rewrite a file whose `/SigFlags` has bit 2 set or that contains a signed `/Sig` field: any full save invalidates the signature. Such files may only be extended with an incremental update, `pdf.save(path, incremental=True)` — and even that must not change signed content.

### Try It Yourself

```python
import pikepdf

def walk(fields, prefix=""):
    for f in fields:
        name = str(f.get("/T", ""))
        full = f"{prefix}.{name}" if prefix and name else prefix or name
        if "/Kids" in f and any("/T" in k for k in f.Kids):
            yield from walk(f.Kids, full)
        else:
            yield full, f

def field_type(f):
    node = f
    while node is not None:
        if "/FT" in node: return str(node.FT)
        node = node.get("/Parent")
    return "?"

with pikepdf.open("form.pdf") as pdf:
    af = pdf.Root.get("/AcroForm")
    if af is None:
        print("no AcroForm"); raise SystemExit
    print("NeedAppearances:", af.get("/NeedAppearances"), " SigFlags:", af.get("/SigFlags"), " DR fonts:", list(af.get("/DR", {}).get("/Font", {}).keys()))
    fields = list(walk(af.Fields))
    print(len(fields), "terminal fields")
    for name, f in fields[:15]:
        ft = field_type(f)
        widgets = f.get("/Kids", [f])
        states = [str(k) for k in widgets[0].AP.N.keys()] if ft == "/Btn" and "/AP" in widgets[0] else ""
        print(f"{name:35} {ft:5} value={str(f.get('/V', ''))[:20]!r:24} flags={int(f.get('/Ff', 0)):6} {states}")
    # Fill the first text field and mark appearances for regeneration
    for name, f in fields:
        if field_type(f) == "/Tx":
            f.V = pikepdf.String("Meridian Escrow LLC"); print("filled", name); break
    af.NeedAppearances = True
    pdf.save("form_filled.pdf")
```

### Quiz

1. Where are form field definitions stored?
- [ ] On each page's `/Annots`
- [x] In the catalog's `/AcroForm /Fields` tree
- [ ] In the Info dictionary
> Widgets on pages display fields; the field tree is document-level.

2. After setting a text field's `/V`, why might a viewer still show the old text?
- [x] The widget's `/AP /N` appearance stream was not regenerated
- [ ] The file was not linearized
- [ ] `/DV` overrides `/V`
> Set `/NeedAppearances true` or write a new appearance stream.

3. What is the correct on-state name for a check box?
- [ ] Always `/Yes`
- [x] Whatever name appears in the widget's `/AP /N` dictionary besides `/Off`
- [ ] `/True`
> Authors choose the export name; read it from the appearance dictionary.

### Exercises

1. **Field export** — Dump every terminal field's qualified name, type and value to CSV.
<details><summary>Solution</summary>

```python
import pikepdf, csv
with pikepdf.open("form.pdf") as pdf, open("fields.csv", "w", newline="") as fh:
    wr = csv.writer(fh); wr.writerow(["name", "type", "value"])
    for name, f in walk(pdf.Root.AcroForm.Fields):
        wr.writerow([name, field_type(f), str(f.get("/V", ""))])
```

</details>

2. **Set read-only** — Mark every filled field as read-only by setting bit 1 of `/Ff`.
<details><summary>Solution</summary>

```python
import pikepdf
with pikepdf.open("form_filled.pdf") as pdf:
    for name, f in walk(pdf.Root.AcroForm.Fields):
        if "/V" in f and str(f.V) not in ("", "/Off"):
            f.Ff = int(f.get("/Ff", 0)) | 1
    pdf.save("form_locked.pdf")
```

</details>

### Interview Questions

**Q: Explain the relationship between fields, widgets and appearance streams.**
A field is a data node in the `/AcroForm /Fields` tree with a type, name, flags and value; a widget is an annotation on a page with a rectangle that displays a field, linked through `/Parent` or merged into one dictionary when a field has a single widget; and an appearance stream in the widget's `/AP /N` is the actual drawing a viewer paints, selected by `/AS` for multi-state buttons. Changing `/V` changes the data but not the picture, which is why forms filled by naive scripts look empty in some viewers and correct in Acrobat, which rebuilds appearances when `/NeedAppearances` is true. A robust fill sets the value, updates `/AS` for check boxes, and either sets `/NeedAppearances` or writes a fresh appearance stream using the `/DA` font from `/DR`.

**Q: You built a 168-field form and a client merged it with another form; now values leak between fields. Why?**
Both forms had fields with the same fully qualified names, for example `Name` or `Date`, and in a merged AcroForm two fields with one name are the same field, so every widget shows the same value. The fix before merging is to prefix each source's top-level `/T` values, which renames the whole subtree because children inherit qualified names, and to merge `/DR` fonts and `/DA` so appearances still find their resources. When the merge has already happened I split the offending field back into two by cloning the field dictionary, re-pointing half of the widgets' `/Parent` to the clone, and appending it to `/Fields`, then verify that the field count matches the sum of the sources.

**Q: How do you flatten a form and when should you not?**
Flattening paints each widget's current appearance into the page content and removes the annotations and the AcroForm, producing a static PDF that looks filled and cannot be edited; with pikepdf that is `pdf.flatten_annotations("all")` followed by deleting `/AcroForm`, or a manual loop that wraps each `/AP /N` stream as a Form XObject positioned at the widget's `/Rect`. You should not flatten when the recipient must edit or sign, when the form contains a digital signature since any rewrite invalidates it, or when appearances have not been regenerated after filling, because you would flatten the stale picture; I regenerate or verify appearances first and keep the unflattened original for the record.

## Outlines, bookmarks and page labels

The bookmark panel in a viewer is the **outline**: a linked list of dictionaries hanging off the catalog's `/Outlines`, each with a title and a destination. **Page labels** are the separate feature that shows "iii" or "A-1" in the viewer's page box instead of the physical index. Both are document-level structures that merging destroys and generators forget, and pikepdf has a friendly API for the outline and a plain-dictionary approach for labels.

### Reading the outline

```python
import pikepdf

with pikepdf.open("handbook.pdf") as pdf:
    with pdf.open_outline() as outline:
        def show(items, depth=0):
            for item in items:
                page_idx = None
                if item.destination is not None:
                    dest = item.destination
                    page_idx = pdf.pages.index(dest[0]) if isinstance(dest, pikepdf.Array) else None
                print("  " * depth + f"{item.title}  -> page {page_idx + 1 if page_idx is not None else '?'}")
                show(item.children, depth + 1)
        show(outline.root)
```

`open_outline()` parses `/Outlines` into `OutlineItem` objects with `title`, `destination`, `action`, `is_closed` and `children`. Destinations may be explicit arrays (`[page /XYZ left top zoom]`), named destinations (a string looked up in `/Names /Dests`), or missing when the item uses an `/A` action such as a URI.

### Building an outline

```python
from pikepdf import OutlineItem

with pikepdf.open("handbook.pdf") as pdf:
    with pdf.open_outline() as outline:
        outline.root.clear()
        ch1 = OutlineItem("1. Purpose", 0)                       # page index 0
        ch1.children.append(OutlineItem("1.1 Scope", 1))
        ch1.children.append(OutlineItem("1.2 Definitions", 2))
        ch2 = OutlineItem("2. Procedures", 5)
        outline.root.extend([ch1, ch2])
    pdf.save("handbook_bookmarked.pdf")
```

`OutlineItem(title, page_index)` creates a `/Fit` destination to that page by default; pass `page_location=pikepdf.PageLocation.XYZ` with `top=…` for a specific scroll position. Titles are Unicode; pikepdf encodes them correctly (UTF-16 with BOM when needed). Writing back happens when the context manager exits.

### Generating bookmarks from headings

For handbooks produced from DOCX via LibreOffice, headings already become bookmarks. For merged packages, build the outline from the merge manifest: one top-level entry per source document at the page where it starts, which is the loop from the Beginner merge chapter with `before = len(out.pages)` recorded per file.

### Bookmarks after merging or deleting pages

Outline destinations reference page **objects**, so deleting a page leaves items pointing at nothing (viewers ignore them) and merging brings none of the source outlines. Rebuild after structural changes; a helper that maps each item's page object to its index before the change and re-creates items afterwards is a dozen lines.

### Page labels

Labels live in `/Root /PageLabels`, a number tree mapping a starting page index to a label dictionary:

```python
with pikepdf.open("handbook.pdf") as pdf:
    pdf.Root.PageLabels = pikepdf.Dictionary(Nums=pikepdf.Array([
        0, pikepdf.Dictionary(S=pikepdf.Name.r),                      # i, ii, iii for the front matter
        4, pikepdf.Dictionary(S=pikepdf.Name.D, St=1),                # 1, 2, 3 from physical page 5
        60, pikepdf.Dictionary(S=pikepdf.Name.A, P="Appendix ", St=1) # Appendix A, Appendix B
    ]))
    pdf.save("handbook_labels.pdf")
```

| `/S` | Style |
|---|---|
| `/D` | decimal |
| `/R` / `/r` | upper / lower roman |
| `/A` / `/a` | upper / lower letters |
| omitted | prefix only, e.g. `P="Cover"` |

`/P` is a prefix and `/St` the starting number (default 1). Each entry applies from its page index until the next entry. Viewers show labels in the page box and "Go to page" accepts them, so a title handbook whose PDF page 5 is "page 1" behaves the way the printed book does.

### Named destinations and links

Internal links from a TOC are `/Link` annotations with `/Dest` arrays or names. Named destinations sit in `/Root /Names /Dests` (a name tree) or the older `/Root /Dests` dictionary. When you delete pages, check links the same way as outline items; when you merge, copy the name trees or links become dead.

> **Tip:** `pikepdf` outlines and PyMuPDF's `doc.set_toc()` produce equivalent structures. Use pikepdf when you are already editing at object level or need to preserve everything else byte-for-byte; use PyMuPDF when you also need to find heading text positions to build the outline from.

### Try It Yourself

```python
import pikepdf
from pikepdf import OutlineItem, Name, Dictionary, Array

manifest = [("Cover", 0), ("Title Commitment", 1), ("Schedule A", 3), ("Schedule B", 6), ("Closing Statement", 9)]

with pikepdf.open("input.pdf") as pdf:
    n = len(pdf.pages)
    with pdf.open_outline() as outline:
        outline.root.clear()
        for title, page in manifest:
            if page < n:
                outline.root.append(OutlineItem(title, page))
        outline.root[1].children.append(OutlineItem("Requirements", min(2, n - 1)))
    pdf.Root.PageLabels = Dictionary(Nums=Array([0, Dictionary(S=Name.r), min(1, n - 1), Dictionary(S=Name.D, St=1)]))
    pdf.save("bookmarked.pdf")

with pikepdf.open("bookmarked.pdf") as pdf:
    with pdf.open_outline() as outline:
        def show(items, depth=0):
            for it in items:
                idx = pdf.pages.index(it.destination[0]) if it.destination is not None else None
                print("  " * depth + f"{it.title} -> page {idx + 1 if idx is not None else '?'}")
                show(it.children, depth + 1)
        show(outline.root)
    print("page labels:", [str(x) if not isinstance(x, pikepdf.Dictionary) else dict(x) for x in pdf.Root.PageLabels.Nums])
```

### Quiz

1. What does `OutlineItem("Scope", 3)` point at?
- [ ] Physical page 3
- [x] Page index 3, which is the fourth page
- [ ] Page labelled "3"
> Indices are zero-based; labels are unrelated.

2. Why do outlines break when pages are deleted?
- [x] Destinations reference page objects, which no longer exist
- [ ] Outlines are stored per page
- [ ] pikepdf deletes the outline automatically
> Rebuild the outline after structural edits.

3. Which `/PageLabels` entry produces "Appendix A, Appendix B"?
- [ ] `S=/D, P="Appendix "`
- [x] `S=/A, P="Appendix ", St=1`
- [ ] `S=/r`
> `/A` is uppercase letters and `/P` the prefix.

### Exercises

1. **Outline from merge** — Merge the PDFs in `parts/` and create one top-level bookmark per file at its first page.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
from pikepdf import OutlineItem
with pikepdf.new() as out:
    starts = []
    for f in sorted(pathlib.Path("parts").glob("*.pdf")):
        with pikepdf.open(f) as src:
            starts.append((f.stem, len(out.pages))); out.pages.extend(src.pages)
    with out.open_outline() as outline:
        for title, idx in starts: outline.root.append(OutlineItem(title, idx))
    out.save("merged_bookmarked.pdf")
```

</details>

2. **Dead bookmark finder** — Report outline items whose destination page no longer exists in the document.
<details><summary>Solution</summary>

```python
import pikepdf
with pikepdf.open("edited.pdf") as pdf:
    page_ids = {p.obj.objgen for p in pdf.pages}
    with pdf.open_outline() as outline:
        def check(items, path=""):
            for it in items:
                ok = it.destination is not None and it.destination[0].objgen in page_ids
                if not ok: print("dead:", path + it.title)
                check(it.children, path + it.title + " > ")
        check(outline.root)
```

</details>

### Interview Questions

**Q: How are bookmarks stored in a PDF and how does pikepdf expose them?**
The catalog's `/Outlines` dictionary points at a doubly linked tree: each item has `/Title`, `/Parent`, `/Prev`, `/Next`, `/First`, `/Last`, `/Count` (negative when collapsed) and either a `/Dest` or an `/A` action; destinations are arrays like `[page /XYZ left top zoom]`, or names resolved through the `/Names /Dests` tree. pikepdf's `open_outline()` reads that into a list of `OutlineItem` objects with children, and on exit of the context manager rewrites all the linkage so you never touch `/Prev` and `/Next` yourself. Because destinations reference page objects rather than indices, any operation that removes or reorders pages needs the outline rebuilt, which I do from a manifest or from the heading list in the source document.

**Q: What are page labels and why do they matter for a title-insurance handbook?**
Page labels are a number tree in `/Root /PageLabels` that assigns display labels to ranges of physical pages: roman numerals for the front matter, decimals restarting at 1 for the body, prefixed letters for appendices. Viewers show the label in the page box and jump to it when the user types it, so a reference like "see page 42" in the printed handbook works in the PDF even though page 42 is physically page 48. For handbooks converted from DOCX, LibreOffice writes them from the section numbering formats, but merged packages lose them, so my merge script rebuilds labels from the same manifest it uses for bookmarks.

**Q: A merged closing package has links in the TOC that no longer work. What happened and how do you fix it?**
The TOC links were `/Link` annotations with named destinations, and the names lived in the source file's `/Names /Dests` tree, which `pages.extend` does not copy; the link annotations came along but resolve nothing in the merged file. The fix is either to copy the name tree entries with `copy_foreign` and re-point them to the copied page objects, or to convert each link's `/Dest` name to an explicit array destination before merging using the source's lookup, which is what I do because explicit destinations survive any later page manipulation. Afterwards I walk every link annotation and assert that its destination page is in `pdf.pages`.

## Repairing and recovering damaged PDFs, and the qpdf CLI

Files arrive truncated by email gateways, with broken cross-reference tables from buggy generators, with the wrong `/Length` on streams, or with a `%%EOF` missing. pikepdf, through qpdf, reconstructs most of them automatically and reports what it did; the qpdf command line adds checks and diagnostics that are faster than Python for a first look. This chapter is the triage procedure.

### What "damaged" usually means

| Symptom | Underlying problem |
|---|---|
| "Cannot open" in Acrobat, opens in Chrome | broken xref table or `startxref` offset; Chrome (pdfium) rebuilds silently |
| Blank pages | stream `/Length` wrong, or fonts missing |
| "Expected EOF" / truncated | file cut off mid-object |
| Text garbled | font `/ToUnicode` missing; the file is fine, the text layer is not |
| "Unsupported filter" | JPX or JBIG2 with no decoder in that viewer |

### Opening with recovery

```python
import pikepdf

try:
    pdf = pikepdf.open("damaged.pdf")
except pikepdf.PdfError as e:
    print("unrecoverable:", e)
else:
    print(pdf.get_warnings())          # list of strings qpdf produced while recovering
    pdf.save("repaired.pdf")
```

qpdf's recovery scans the file for `N G obj` patterns and rebuilds the xref, so a wrong `startxref` or a corrupt table is transparently fixed on open, and saving writes a correct table. `get_warnings()` lists the issues; if the list is non-empty on a file that should be clean, the generator that made it is buggy. `pikepdf.open(path, suppress_warnings=False)` prints warnings as they occur, and `attempt_recovery=False` makes pikepdf raise instead of repairing, useful when you must know a file is bad.

### Truncated files

If the trailer and part of the object data are missing, recovery yields whatever objects were complete. Pages whose content streams were cut off appear blank or partial. There is no way to invent the missing bytes; the honest fix is to request the file again, and a script can detect this case by checking the tail:

```python
tail = open("suspect.pdf", "rb").read()[-1024:]
print(b"%%EOF" in tail, b"startxref" in tail)
```

### qpdf --check and friends

```bash
qpdf --check damaged.pdf                     # structural check, exit code 0/2/3
qpdf --check --warning-exit-0 file.pdf       # warnings do not fail the pipeline
qpdf --show-xref file.pdf | head             # xref table as parsed
qpdf --show-npages file.pdf
qpdf --show-object=12 --raw-stream-data file.pdf > obj12.bin
qpdf --qdf --object-streams=disable file.pdf readable.pdf
qpdf --json file.pdf | jq '.pages | length'  # JSON description of the whole object graph
```

Exit codes: 0 fine, 2 errors, 3 warnings only. `--check` also validates linearization and, with `--password`, encryption. `--json` (qpdf 10+) gives an inspectable dump of every object, which is how you find, for example, all pages missing `/Resources`.

### Common surgical repairs in pikepdf

**Missing MediaBox** (pages render at nothing or default size):

```python
for page in pdf.pages:
    if "/MediaBox" not in page.obj and page.obj.get("/Parent") is not None and "/MediaBox" not in page.obj.Parent:
        page.MediaBox = [0, 0, 612, 792]
```

**Pages without `/Type /Page`** or **orphan page objects**: rebuild the page tree by iterating `pdf.pages` (pikepdf repairs `/Kids` and `/Count` on save).

**Duplicate or broken `/Annots`**: filter to dictionaries with `/Subtype`:

```python
page.Annots = pikepdf.Array([a for a in page.get("/Annots", []) if isinstance(a, pikepdf.Dictionary) and "/Subtype" in a])
```

**Wrong stream `/Length`**: qpdf recomputes lengths on save, so open-and-save fixes it.

**Font without `/ToUnicode`** cannot be "repaired" without the font's encoding knowledge; the practical route is OCR (OCRmyPDF, which uses pikepdf internally) to add a proper text layer.

### The pikepdf.Job interface

qpdf's job configuration is available from Python without a subprocess:

```python
job = pikepdf.Job({"inputFile": "damaged.pdf", "outputFile": "fixed.pdf", "check": "", "linearize": "", "objectStreams": "generate"})
job.run()
print(job.exit_code, job.has_warnings)
```

The keys mirror CLI flags in camelCase. This is how to get `--check` semantics, page ranges with qpdf syntax, or `--flatten-annotations` in a Python pipeline that already uses pikepdf.

### Triage procedure

1. `qpdf --check` to classify: clean, warnings, errors, cannot open.
2. Open with pikepdf, read `get_warnings()`, save to a new file.
3. Compare page counts and render a few pages with a viewer or PyMuPDF.
4. If pages are blank, inspect content stream lengths and `/Resources`.
5. If text is garbled, it is a font issue, not corruption; go to OCR.
6. Log the warnings per file; a batch with the same warning on every file points at the generator, not the files.

> **Warning:** Recovery can silently drop objects it cannot parse, including form fields and annotations. After repairing a form, count fields before and after and compare with the client's expectation, not just the page count.

### Try It Yourself

```python
import pikepdf, subprocess, shutil, pathlib

src = pathlib.Path("suspect.pdf")
tail = src.read_bytes()[-2048:]
print("has %%EOF:", b"%%EOF" in tail, " has startxref:", b"startxref" in tail)

if shutil.which("qpdf"):
    r = subprocess.run(["qpdf", "--check", "--warning-exit-0", str(src)], capture_output=True, text=True)
    print("qpdf --check exit:", r.returncode)
    print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr.strip()[:300])

try:
    with pikepdf.open(src) as pdf:
        warnings = pdf.get_warnings()
        print(f"opened: {len(pdf.pages)} pages, {len(warnings)} warnings")
        for w in warnings[:5]: print("  -", w)
        fields_before = len(pdf.Root.AcroForm.Fields) if "/AcroForm" in pdf.Root else 0
        for page in pdf.pages:
            if "/MediaBox" not in page.obj and "/MediaBox" not in page.obj.get("/Parent", {}):
                page.MediaBox = [0, 0, 612, 792]; print("  added MediaBox")
        pdf.save("repaired.pdf", object_stream_mode=pikepdf.ObjectStreamMode.generate)
    with pikepdf.open("repaired.pdf") as check:
        fields_after = len(check.Root.AcroForm.Fields) if "/AcroForm" in check.Root else 0
        print("repaired.pdf:", len(check.pages), "pages, warnings:", len(check.get_warnings()), "fields:", fields_before, "->", fields_after)
except pikepdf.PdfError as e:
    print("unrecoverable:", e)
```

### Quiz

1. What does qpdf do when `startxref` points to the wrong offset?
- [ ] Refuses to open the file
- [x] Scans for objects and rebuilds the cross-reference table, reporting a warning
- [ ] Opens the file read-only
> Saving then writes a correct xref.

2. Which qpdf exit code means "warnings but no errors"?
- [ ] 0
- [ ] 2
- [x] 3
> `--warning-exit-0` turns that into 0 for pipelines.

3. Garbled text in a PDF that renders perfectly is usually…
- [ ] a corrupt xref
- [x] a font without a usable `/ToUnicode` map
- [ ] a truncated file
> The file is structurally fine; OCR is the practical fix.

### Exercises

1. **Batch triage** — For a folder of PDFs, print each file's status: clean, recovered (with warning count) or unrecoverable.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
for f in sorted(pathlib.Path("inbox").glob("*.pdf")):
    try:
        with pikepdf.open(f) as pdf:
            w = pdf.get_warnings()
            print(f.name, "clean" if not w else f"recovered ({len(w)} warnings)")
    except pikepdf.PdfError as e:
        print(f.name, "UNRECOVERABLE:", str(e)[:80])
```

</details>

2. **Strict mode** — Open a file with recovery disabled so that any damage raises, and report which files fail.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
for f in pathlib.Path("inbox").glob("*.pdf"):
    try:
        pikepdf.open(f, attempt_recovery=False).close(); print(f.name, "strictly valid")
    except pikepdf.PdfError as e:
        print(f.name, "damaged:", str(e)[:80])
```

</details>

### Interview Questions

**Q: A client sends a PDF that Acrobat refuses to open but Chrome displays. Walk through what you do.**
Chrome's pdfium rebuilds broken cross-reference tables silently while Acrobat is stricter, so the file almost certainly has a bad `startxref` or xref table. I run `qpdf --check` to get the exact complaint, then open with pikepdf, print `get_warnings()`, and save to a new path, which writes a correct xref and stream lengths. I then verify page count, render a few pages, and if the file has a form, compare field counts before and after because recovery can drop unparseable objects. If it was truncated, `%%EOF` is missing from the tail and later pages are blank; then no tool can recover the missing bytes and I ask for a re-send rather than deliver a partial file.

**Q: When do you use the qpdf CLI rather than pikepdf, and how do you combine them?**
The CLI is faster for diagnosis (`--check`, `--show-xref`, `--show-object`, `--json`) and for one-line transformations in shell pipelines, and it is available on servers without Python. pikepdf is for anything with logic: conditional repairs, loops with error handling, reading warnings into a report. `pikepdf.Job` bridges them by running qpdf's job configuration in-process, so a pipeline can call `--check` semantics or `--flatten-annotations` without a subprocess and still edit objects before and after. In my batch repair tool the first pass is `qpdf --check` in parallel to classify files, the second is pikepdf for the ones with warnings.

**Q: What can recovery not fix, and how do you communicate that to a client?**
It cannot recreate bytes that are gone from a truncated file, cannot invent a `/ToUnicode` map for a font with no Unicode mapping, cannot decode JPX or JBIG2 images without the decoders, and cannot restore objects so mangled that qpdf skips them. I tell clients which pages or fields were affected specifically, show the `qpdf --check` output as evidence, and offer the realistic alternatives: re-export from the original source, OCR for text layers, or rasterising the pages that render correctly in one viewer to create a clean file. Being precise about what was lost matters more than the repair itself in a title-insurance context, where a missing schedule page has legal consequences.

# LEVEL: Expert

## Overlays and underlays: watermarks via Form XObjects

Stamping "DRAFT" across every page, putting a letterhead beneath a generated letter, adding a per-recipient watermark to 200 copies of a handbook, or placing a "Bates" number in the corner: all of these are the same operation. You draw a **Form XObject** onto a page's content stream, either before the existing content (underlay) or after it (overlay). pikepdf gives you the primitives; this chapter turns them into a reliable, scale-aware stamping function.

### Where the stamp comes from

| Source | How to get a Form XObject |
|---|---|
| A page of another PDF | `pdf.copy_foreign(src.pages[0].as_form_xobject())` |
| Text or shapes you draw | write a content stream by hand and wrap it in a stream with `/Type /XObject /Subtype /Form` |
| A PDF generated by reportlab, PyMuPDF or LibreOffice | same as row one; generating with a text library and stamping with pikepdf is the usual pipeline |

Drawing the stamp with another tool keeps font embedding and text encoding correct; pikepdf is then only concerned with placement.

### A hand-built text stamp

Plain text with a standard font is possible without any other library:

```python
import pikepdf
from pikepdf import Name, Dictionary, Array

def draft_stamp(pdf, text="DRAFT"):
    font = pdf.make_indirect(Dictionary(Type=Name.Font, Subtype=Name.Type1, BaseFont=Name.Helvetica, Encoding=Name.WinAnsiEncoding))
    content = f"""q /GS0 gs 0.8 0 0 rg BT /F0 96 Tf 1 0 0 1 0 0 Tm ({text}) Tj ET Q""".encode()
    xobj = pdf.make_stream(content)
    xobj.Type, xobj.Subtype, xobj.FormType = Name.XObject, Name.Form, 1
    xobj.BBox = Array([0, 0, 400, 100])
    xobj.Resources = Dictionary(Font=Dictionary(F0=font),
                                ExtGState=Dictionary(GS0=Dictionary(Type=Name.ExtGState, CA=0.35, ca=0.35)))
    return xobj
```

`ExtGState` with `ca` (fill alpha) makes the stamp translucent. Helvetica is one of the 14 standard fonts that viewers must supply, so no embedding is needed; a PDF/A output would need an embedded font instead, which is why real pipelines generate the stamp with a text library.

### Placing with the right matrix

The `cm` operator maps the XObject's coordinate space onto the page. To centre and rotate a 400 × 100 stamp on a page of size `w × h` at 45 degrees and scale `s`:

```python
import math

def placement(w, h, bw, bh, angle_deg, scale):
    a = math.radians(angle_deg)
    cos, sin = math.cos(a) * scale, math.sin(a) * scale
    # translate so the stamp's centre lands on the page centre
    cx, cy = bw / 2, bh / 2
    tx = w / 2 - (cos * cx - sin * cy)
    ty = h / 2 - (sin * cx + cos * cy)
    return f"{cos:.4f} {sin:.4f} {-sin:.4f} {cos:.4f} {tx:.2f} {ty:.2f} cm"
```

Page dimensions come from the `/MediaBox` (or `/CropBox` if the client cares about the visible area), and if the page has `/Rotate 90` the stamp must be rotated the opposite way or it prints sideways. Handle that by adding `-rotate` to the angle and swapping `w` and `h`.

### Overlay versus underlay

```python
def stamp_page(pdf, page, xobj, matrix, under=False):
    name = page.add_resource(xobj, Name.XObject, prefix="Stamp")
    ops = f"q {matrix} {name} Do Q".encode()
    page.contents_add(pikepdf.Stream(pdf, ops), prepend=under)
```

`prepend=True` puts the stamp beneath existing content, correct for letterheads and backgrounds; `prepend=False` appends it on top for watermarks and Bates numbers. Wrapping in `q`…`Q` isolates the graphics state so a page whose content stream never restored its own state cannot distort the stamp, and pikepdf's `contents_add` also wraps existing content in `q`/`Q` when needed so the reverse holds.

### Unbalanced content streams

Some generators leave a content stream with more `q` than `Q`, which would otherwise make the appended stamp inherit a clip or transform. `page.contents_coalesce()` merges the page's content array into one stream, and `pikepdf`'s `contents_add` protects against unbalanced state by wrapping; if you build the streams yourself, add `Q` operators to balance before appending.

### Per-page and per-recipient variation

Bates numbering or "Copy for: Meridian Escrow" needs a different stamp per page or per file. Build the XObject once per distinct text, not per page; for Bates numbers that is one per page, so use a minimal stream and share the font dictionary through `make_indirect`.

```python
for i, page in enumerate(pdf.pages, 1):
    xobj = number_stamp(pdf, font, f"STW-{i:06}")
    stamp_page(pdf, page, xobj, "1 0 0 1 480 20 cm")
```

### Removing your own stamps later

Because the stamp is a separate `Do` instruction naming a resource with a recognisable prefix, removal is the content stream edit from the Advanced level: drop the instruction whose operand starts with `/Stamp`, and delete the XObject from `/Resources`. Keep the prefix consistent across the pipeline so this stays possible.

> **Warning:** A stamp on top of a signed document invalidates the signature just like any other edit. For signed files, add the watermark as an annotation with an incremental save instead, or watermark before signing.

### Try It Yourself

```python
import pikepdf, math
from pikepdf import Name, Dictionary, Array

def text_xobject(pdf, text, size=96, rgb=(0.8, 0, 0), alpha=0.35):
    font = pdf.make_indirect(Dictionary(Type=Name.Font, Subtype=Name.Type1, BaseFont=Name.Helvetica, Encoding=Name.WinAnsiEncoding))
    width = 0.6 * size * len(text)                       # rough Helvetica width estimate
    stream = pdf.make_stream(f"q /GS0 gs {rgb[0]} {rgb[1]} {rgb[2]} rg BT /F0 {size} Tf 0 {size * 0.25} Td ({text}) Tj ET Q".encode())
    stream.Type, stream.Subtype, stream.FormType = Name.XObject, Name.Form, 1
    stream.BBox = Array([0, 0, width, size])
    stream.Resources = Dictionary(Font=Dictionary(F0=font), ExtGState=Dictionary(GS0=Dictionary(Type=Name.ExtGState, CA=alpha, ca=alpha)))
    return stream, width, size

def centred_matrix(w, h, bw, bh, angle_deg, scale):
    a = math.radians(angle_deg); c, s = math.cos(a) * scale, math.sin(a) * scale
    tx = w / 2 - (c * bw / 2 - s * bh / 2); ty = h / 2 - (s * bw / 2 + c * bh / 2)
    return f"{c:.4f} {s:.4f} {-s:.4f} {c:.4f} {tx:.2f} {ty:.2f} cm"

with pikepdf.open("input.pdf") as pdf:
    stamp, bw, bh = text_xobject(pdf, "DRAFT")
    for i, page in enumerate(pdf.pages, 1):
        box = [float(x) for x in page.mediabox]
        w, h = box[2] - box[0], box[3] - box[1]
        rotate = int(page.get("/Rotate", 0)) % 360
        if rotate in (90, 270): w, h = h, w
        scale = min(w / bw, h / bh) * 0.8
        name = page.add_resource(stamp, Name.XObject, prefix="Stamp")
        page.contents_add(pikepdf.Stream(pdf, f"q {centred_matrix(w, h, bw, bh, 45 - rotate, scale)} {name} Do Q".encode()))
        print(f"page {i}: {w:.0f}x{h:.0f} rotate={rotate} stamp={name} scale={scale:.2f}")
    pdf.save("draft_stamped.pdf")
```

### Quiz

1. Which call places a stamp beneath the existing page content?
- [ ] `page.contents_add(stream)`
- [x] `page.contents_add(stream, prepend=True)`
- [ ] `page.Contents = stream`
> Prepending draws first, so the page content paints over it.

2. Why wrap the stamp instruction in `q` … `Q`?
- [x] To isolate graphics state changes from the page's own content
- [ ] To compress the stream
- [ ] It is required syntax for `Do`
> Without it, the page's leftover transforms or clips would affect the stamp and vice versa.

3. A page has `/Rotate 90`. A stamp drawn at 45 degrees will appear…
- [ ] correctly
- [x] rotated by the page rotation as well, so compensate by subtracting 90
- [ ] mirrored
> Page rotation applies to everything drawn, including your overlay.

### Exercises

1. **Letterhead underlay** — Place the first page of `letterhead.pdf` beneath every page of `letter.pdf`, scaled to fit the page size.
<details><summary>Solution</summary>

```python
import pikepdf
from pikepdf import Name
with pikepdf.open("letterhead.pdf") as lh, pikepdf.open("letter.pdf") as pdf:
    xobj = pdf.copy_foreign(lh.pages[0].as_form_xobject())
    bw, bh = float(xobj.BBox[2]) - float(xobj.BBox[0]), float(xobj.BBox[3]) - float(xobj.BBox[1])
    for page in pdf.pages:
        w, h = float(page.mediabox[2]), float(page.mediabox[3])
        s = min(w / bw, h / bh)
        name = page.add_resource(xobj, Name.XObject, prefix="Letterhead")
        page.contents_add(pikepdf.Stream(pdf, f"q {s} 0 0 {s} 0 0 cm {name} Do Q".encode()), prepend=True)
    pdf.save("letter_lh.pdf")
```

</details>

2. **Bates numbers** — Stamp `STW-000001`, `STW-000002`… in the bottom-right corner of each page in 9 pt.
<details><summary>Solution</summary>

```python
import pikepdf
from pikepdf import Name, Dictionary, Array
with pikepdf.open("package.pdf") as pdf:
    font = pdf.make_indirect(Dictionary(Type=Name.Font, Subtype=Name.Type1, BaseFont=Name.Helvetica))
    for i, page in enumerate(pdf.pages, 1):
        label = f"STW-{i:06}"
        x = float(page.mediabox[2]) - 90
        xo = pdf.make_stream(f"BT /F0 9 Tf 0 0 Td ({label}) Tj ET".encode())
        xo.Type, xo.Subtype, xo.BBox, xo.Resources = Name.XObject, Name.Form, Array([0, 0, 80, 12]), Dictionary(Font=Dictionary(F0=font))
        name = page.add_resource(xo, Name.XObject, prefix="Bates")
        page.contents_add(pikepdf.Stream(pdf, f"q 1 0 0 1 {x:.0f} 18 cm {name} Do Q".encode()))
    pdf.save("bates.pdf")
```

</details>

### Interview Questions

**Q: How do you add a watermark to a PDF at the object level, and what can go wrong?**
Create a Form XObject holding the watermark drawing, either from another PDF page with `as_form_xobject` and `copy_foreign` or hand-written with a content stream, a `/BBox` and its own `/Resources`; register it on each page with `add_resource`; and append a `q cm Do Q` instruction with a transformation matrix that scales, rotates and positions it, prepending for underlays. What goes wrong: page rotation not compensated, so stamps print sideways; using `/MediaBox` when the visible area is `/CropBox`; unbalanced graphics state in the original content leaking into the stamp; hand-drawn text using non-embedded fonts that break PDF/A; and stamping signed documents, which invalidates signatures. I also namespace resource names with a prefix so stamps can be removed later.

**Q: When would you use an annotation instead of a content stream overlay for a watermark?**
When the file is signed and may only be extended incrementally, when the client wants users to be able to remove or hide the watermark in Acrobat, or when the watermark must not affect text extraction and accessibility order. A `/Watermark` or `/Stamp` annotation with its own appearance stream sits in the page's `/Annots`, renders on top, can be flagged print-only or screen-only through annotation flags, and is trivially deleted. A content stream overlay is permanent, renders in every viewer including ones that ignore annotations, and is what I use for legal deliverables where "DRAFT" must survive printing and flattening.

**Q: How do you make watermarking 10,000 files fast?**
Build the watermark XObject once per worker process and `copy_foreign` it into each file, which is cheap because it is a single small object graph; avoid rasterising anything. Use a multiprocessing pool with one process per core since qpdf work is CPU-bound, open each file, add one small content stream per page rather than rewriting page contents, and save with object streams and no linearization unless the files go to the web. Skip pages that already contain a resource with the stamp prefix so re-runs are idempotent. Measured on typical 20-page files this is well under a second per file per core, so the batch is a coffee break rather than an overnight job.

## Fonts and resources dictionaries

Every page has a `/Resources` dictionary telling the viewer what the names in its content stream mean: `/F1` is a font, `/Im0` an image, `/GS0` a transparency setting, `/CS0` a colour space. Font dictionaries are the deepest part of it, and they explain most "text looks wrong" and "text cannot be copied" problems. pikepdf exposes all of it as plain dictionaries, so you can audit, repair and de-duplicate.

### The resources dictionary

```python
import pikepdf

with pikepdf.open("handbook.pdf") as pdf:
    res = pdf.pages[0].Resources
    print(res.keys())                # /Font /XObject /ExtGState /ColorSpace /ProcSet ...
    for name, font in res.get("/Font", {}).items():
        print(name, font.get("/Subtype"), font.get("/BaseFont"))
```

Resources may be **inherited** from the page tree (`/Parent` nodes) in old files; `page.Resources` in pikepdf resolves inheritance for you, but writing back must go to the page's own dictionary. Form XObjects have their own `/Resources`, and a missing one legally falls back to the page's, which is a compatibility mess; always give Form XObjects explicit resources.

### Font dictionary types

| `/Subtype` | Description | Text bytes are |
|---|---|---|
| `/Type1` | PostScript Type 1, including the 14 standard fonts | single-byte codes via `/Encoding` |
| `/TrueType` | TrueType with a simple encoding | single-byte codes |
| `/Type3` | glyphs defined as PDF content streams | single-byte codes |
| `/Type0` | composite font wrapping a `/CIDFontType0` or `/CIDFontType2` descendant | multi-byte CIDs via a CMap (`/Identity-H` usually) |

Modern generators (Word, LibreOffice, Chrome) write `/Type0` with `/Identity-H` and a subsetted TrueType descendant. The bytes in `Tj` strings are then glyph ids, and the only way back to Unicode is the `/ToUnicode` CMap stream.

### The pieces that must be present

```python
font = res.Font.F1
desc = font.DescendantFonts[0].FontDescriptor if font.Subtype == "/Type0" else font.FontDescriptor
embedded = any(k in desc for k in ("/FontFile", "/FontFile2", "/FontFile3"))
print(font.BaseFont, "embedded" if embedded else "NOT embedded", "ToUnicode" if "/ToUnicode" in font else "no ToUnicode")
```

- `/FontDescriptor` holds metrics and flags, and the `/FontFile` (Type 1), `/FontFile2` (TrueType) or `/FontFile3` (CFF/OpenType) stream with the actual glyph program.
- A subset font has a `/BaseFont` like `/ABCDEF+Calibri`; the six-letter tag marks it as partial, so you cannot reuse it for new text.
- `/Widths` (simple fonts) or `/W` (CID fonts) give advance widths; missing widths make text spacing collapse.
- `/ToUnicode` maps codes to Unicode for copy, search and accessibility.

### Auditing a document's fonts

```python
def font_report(pdf):
    seen = {}
    for pno, page in enumerate(pdf.pages, 1):
        for name, f in page.Resources.get("/Font", {}).items():
            key = f.objgen if f.is_indirect else (pno, str(name))
            if key in seen: continue
            d = f.DescendantFonts[0].FontDescriptor if f.get("/Subtype") == "/Type0" else f.get("/FontDescriptor")
            seen[key] = (str(f.get("/BaseFont")), str(f.get("/Subtype")), d is not None and any(k in d for k in ("/FontFile", "/FontFile2", "/FontFile3")), "/ToUnicode" in f)
    return seen
```

This is `pdffonts` in Python, and it is what tells you a client's "PDF/A" from a cheap converter has Arial unembedded on page 40.

### Why merged files bloat

Two PDFs from the same Word template each carry their own subset of Calibri; merged, the output has two `/ABCDEF+Calibri` and `/GHIJKL+Calibri` fonts with overlapping glyphs. pikepdf cannot merge subsets (that requires re-encoding text and rebuilding glyph tables), and neither can qpdf. Ghostscript's `pdfwrite` can merge identical fonts to some extent; for real de-duplication generate the combined document from source instead of merging PDFs.

### De-duplicating identical resources

Byte-identical objects such as the same logo image copied into a hundred files and later merged can be de-duplicated safely:

```python
import hashlib

def dedupe_images(pdf):
    seen = {}
    for page in pdf.pages:
        xobjs = page.Resources.get("/XObject", {})
        for name, x in list(xobjs.items()):
            if x.get("/Subtype") != "/Image": continue
            h = hashlib.sha256(x.read_raw_bytes() + str(dict((k, str(v)) for k, v in x.items() if k != "/Length")).encode()).hexdigest()
            if h in seen: xobjs[name] = seen[h]
            else: seen[h] = x
```

After replacing references the orphaned duplicates are dropped at save time.

### ExtGState, colour spaces and patterns

`/ExtGState` entries hold transparency (`/ca`, `/CA`, `/BM` blend mode, `/SMask`); PDF/A-1 forbids transparency entirely, which is why converting to A-1b fails on files with translucent watermarks. `/ColorSpace` entries name ICC-based, separation or indexed spaces; PDF/A requires an output intent when device colour spaces are used. `/Pattern` and `/Shading` hold gradients. None of these need editing often, but a preflight report names them, and pikepdf lets you inspect exactly what a validator complains about.

> **Tip:** `pdf.pages[i].Resources.Font` may be shared between pages as one indirect dictionary. Editing it edits every page; if you need a page-specific change, replace it with a copy first (`pikepdf.Dictionary(existing)` creates a shallow copy).

### Try It Yourself

```python
import pikepdf

def describe_font(f):
    sub = str(f.get("/Subtype"))
    if sub == "/Type0":
        desc_font = f.DescendantFonts[0]; d = desc_font.get("/FontDescriptor"); enc = str(f.get("/Encoding"))
        kind = f"Type0/{str(desc_font.get('/Subtype'))[1:]} {enc}"
    else:
        d = f.get("/FontDescriptor"); kind = sub[1:]
    embedded = d is not None and any(k in d for k in ("/FontFile", "/FontFile2", "/FontFile3"))
    return str(f.get("/BaseFont")), kind, embedded, "/ToUnicode" in f

with pikepdf.open("input.pdf") as pdf:
    fonts = {}
    for pno, page in enumerate(pdf.pages, 1):
        for name, f in page.Resources.get("/Font", {}).items():
            key = f.objgen if f.is_indirect else (pno, str(name))
            fonts.setdefault(key, (describe_font(f), set()))[1].add(pno)
    print(f"{'font':32} {'type':28} {'emb':4} {'uni':4} pages")
    for (base, kind, emb, uni), pages in fonts.values():
        print(f"{base:32} {kind:28} {'yes' if emb else 'NO':4} {'yes' if uni else 'NO':4} {min(pages)}-{max(pages)}")
    problems = [b for (b, k, e, u), _ in fonts.values() if not e]
    print("unembedded fonts:", problems or "none")
    res = pdf.pages[0].Resources
    print("page 1 resource kinds:", {str(k): len(v) if isinstance(v, pikepdf.Dictionary) else "-" for k, v in res.items()})
```

### Quiz

1. Which entry proves a font is embedded?
- [ ] `/BaseFont`
- [x] `/FontFile`, `/FontFile2` or `/FontFile3` in the `/FontDescriptor`
- [ ] `/ToUnicode`
> `/ToUnicode` is about text extraction, not glyph availability.

2. What does the `ABCDEF+` prefix on a `/BaseFont` mean?
- [ ] The font is a standard font
- [x] The embedded font is a subset containing only used glyphs
- [ ] The font is encrypted
> Subsets cannot be reused to draw new text with other glyphs.

3. Why can pikepdf not merge duplicate subset fonts after a merge?
- [x] Glyph tables and text encodings would have to be rebuilt
- [ ] The fonts are copyrighted
- [ ] qpdf forbids it
> Only a re-encoding tool such as Ghostscript can, and only partially.

### Exercises

1. **Unembedded font finder** — Print the names of PDFs in a folder that use any non-embedded, non-standard font.
<details><summary>Solution</summary>

```python
import pikepdf, pathlib
STD = {"Helvetica", "Times-Roman", "Courier", "Symbol", "ZapfDingbats"}
for path in pathlib.Path("pdfs").glob("*.pdf"):
    with pikepdf.open(path) as pdf:
        bad = set()
        for page in pdf.pages:
            for f in page.Resources.get("/Font", {}).values():
                d = f.DescendantFonts[0].get("/FontDescriptor") if f.get("/Subtype") == "/Type0" else f.get("/FontDescriptor")
                base = str(f.get("/BaseFont", "")).lstrip("/").split("+")[-1]
                if not (d is not None and any(k in d for k in ("/FontFile", "/FontFile2", "/FontFile3"))) and base.split("-")[0] not in STD:
                    bad.add(base)
        if bad: print(path.name, sorted(bad))
```

</details>

2. **Extract an embedded font** — Write the first embedded TrueType font program to a `.ttf` file.
<details><summary>Solution</summary>

```python
import pikepdf
with pikepdf.open("input.pdf") as pdf:
    for page in pdf.pages:
        for f in page.Resources.get("/Font", {}).values():
            d = f.DescendantFonts[0].get("/FontDescriptor") if f.get("/Subtype") == "/Type0" else f.get("/FontDescriptor")
            if d is not None and "/FontFile2" in d:
                open("extracted.ttf", "wb").write(d.FontFile2.read_bytes()); print("wrote extracted.ttf from", f.BaseFont); raise SystemExit
```

</details>

### Interview Questions

**Q: Explain how text in a PDF gets from bytes in a content stream to glyphs on screen and characters in the clipboard.**
The `Tf` operator selects a font resource by name from the page's `/Resources /Font`; `Tj` supplies bytes that the font's encoding maps to codes: a single-byte `/Encoding` for simple fonts or a CMap such as `/Identity-H` for `/Type0` composite fonts, where the codes are glyph ids. The font descriptor's embedded program (`/FontFile2` for TrueType) renders those glyphs, and `/Widths` or `/W` advance the cursor. Copying or searching uses the separate `/ToUnicode` CMap to turn codes into Unicode; if it is missing or wrong the page renders perfectly and the clipboard gets garbage. That separation is why "text looks fine but cannot be searched" is a font metadata problem, and OCR or regeneration from source, not repair, is the fix.

**Q: A client's PDF fails their printer's preflight with "font not embedded". How do you diagnose and fix it?**
I run a font report with pikepdf: for each font resource, check the descriptor for a `/FontFile*` stream and note the base name and pages. Standard 14 fonts like Helvetica are allowed unembedded by PDF 1.x but not by PDF/A or PDF/X, and Arial or Calibri unembedded means the producing tool was told not to embed. pikepdf cannot embed a font after the fact because the text is encoded against the missing font's metrics. The fix is at the source: re-export from Word or LibreOffice with embedding on, or run Ghostscript `pdfwrite` with `-dEmbedAllFonts=true` if the font is installed on the machine, then re-run the report to confirm.

**Q: What are `/ExtGState` and `/ColorSpace` resources and why do PDF/A validators care?**
`/ExtGState` entries set graphics state parameters that operators cannot: transparency (`/ca`, `/CA`, `/SMask`, `/BM`), overprint, halftones and line styles. PDF/A-1 forbids transparency outright and A-2/A-3 allow it only with a page group or output intent, so a translucent watermark fails A-1b. `/ColorSpace` entries define ICC-based, Lab, indexed, separation and DeviceN spaces; PDF/A requires that any device space (DeviceRGB, DeviceCMYK) be anchored by an `/OutputIntent` with an ICC profile so colours are reproducible, and forbids some spaces without profiles. veraPDF reports the object number of the offending resource, and with pikepdf I open that object directly to see what to change or which producing tool to reconfigure.

## PDF/A and preflight: Ghostscript and veraPDF

PDF/A is the archival profile clients ask for when a document must be readable in twenty years: fonts embedded, no encryption, no JavaScript, colour anchored by an output intent, metadata in XMP, and for accessibility-oriented levels, tagged structure. pikepdf can read and write the metadata that declares conformance, preserve conformance through edits, and inspect what a validator flags, but it cannot convert a file to PDF/A on its own. The working pipeline is Ghostscript or the producing application to convert, veraPDF to verify, and pikepdf to fix and preserve.

### The parts and levels

| Part | Based on | Levels | Notes |
|---|---|---|---|
| PDF/A-1 (2005) | PDF 1.4 | `a` accessible, `b` basic | no transparency, no JPX, no attachments |
| PDF/A-2 (2011) | PDF 1.7 | `a`, `b`, `u` (Unicode) | allows transparency, JPX, layers, PDF/A attachments |
| PDF/A-3 (2012) | PDF 1.7 | `a`, `b`, `u` | any embedded file with `/AFRelationship` |
| PDF/A-4 (2020) | PDF 2.0 | `f` (files), `e` (engineering) | replaces the a/b/u scheme |

For most document-production clients PDF/A-2b is the right target; A-1b fails on anything with transparency, and A-3 only when files must be embedded.

### Declaring conformance in XMP

```python
import pikepdf

with pikepdf.open("handbook.pdf") as pdf:
    with pdf.open_metadata() as meta:
        meta["pdfaid:part"] = "2"
        meta["pdfaid:conformance"] = "B"
    print(meta.pdfa_status)          # "2B"
    pdf.save("handbook_claimed.pdf")
```

That is a **claim**. Nothing in the file has been made compliant; a validator will now check it against A-2b and list every violation. Never set these keys unless the file actually passes.

### What pikepdf preserves

`pdf.save()` defaults to `preserve_pdfa=True`: pikepdf keeps the XMP claim and avoids options that would break conformance, and it warns if you pass `encryption=` on a PDF/A file. Structural edits are on you: adding an unembedded-font stamp, a translucent overlay to an A-1 file, or a non-PDF/A attachment to an A-2 file invalidates the claim while the metadata still says compliant. The rule is validate after every pipeline stage that touches a PDF/A file.

### Converting with Ghostscript

```bash
gs -dPDFA=2 -dBATCH -dNOPAUSE -sColorConversionStrategy=RGB \
   -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=1 \
   -sOutputFile=out_pdfa.pdf PDFA_def.ps in.pdf
```

`PDFA_def.ps` (shipped with Ghostscript under `lib/`) sets the output intent and ICC profile; edit it to point at an sRGB profile. `-dPDFACompatibilityPolicy=1` makes Ghostscript drop features it cannot convert rather than abort. Ghostscript re-writes the whole file: fonts are embedded and subsetted, colour is converted, transparency may be flattened for A-1. Text and structure tags survive only partly, so A-1a/A-2a (accessible) targets should come from the producing application (Word's "PDF/A compliant" export, LibreOffice's Archive option) rather than Ghostscript.

### Validating with veraPDF

```bash
verapdf --flavour 2b --format text handbook_pdfa.pdf
verapdf --flavour 2b --format json handbook_pdfa.pdf > report.json
```

Output lists each failed rule with its clause (`6.2.11.4` for font embedding, `6.1.13` for optional content, `6.6.4` for metadata), the number of failed checks, and, in JSON, the object references. veraPDF is the reference implementation the PDF Association maintains; Acrobat's preflight is comparable but not scriptable on Linux.

### A validate-and-explain loop with pikepdf

```python
import json, subprocess, pikepdf

r = subprocess.run(["verapdf", "--flavour", "2b", "--format", "json", "file.pdf"], capture_output=True, text=True)
report = json.loads(r.stdout)
job = report["report"]["jobs"][0]
for rule in job["validationResult"]["details"]["ruleSummaries"]:
    if rule["ruleStatus"] == "FAILED":
        print(rule["clause"], rule["description"][:80], "failed:", rule["failedChecks"])
        for check in rule.get("checks", [])[:3]:
            print("   at", check.get("context"))
```

The `context` strings name object paths such as `root/document[0]/pages[3]/resources/fonts[1]`; with pikepdf you open page 4 and inspect that font to decide whether to re-export the page or fix the resource.

### Fixes pikepdf can apply

- **Metadata inconsistencies** (clause 6.6): sync DocInfo and XMP with `load_from_docinfo`, set `pdf:Producer`, ensure `xmp:CreateDate` is well formed.
- **Missing `/OutputIntent`**: add one referencing an embedded sRGB ICC stream (`/Type /OutputIntent /S /GTS_PDFA1 /OutputConditionIdentifier (sRGB) /DestOutputProfile <stream>`).
- **Forbidden entries**: remove `/OpenAction` JavaScript, `/AA` additional actions, `/Encrypt`, embedded files on A-1/A-2.
- **Annotation flags**: PDF/A requires `/F` with the Print flag set and Hidden unset on every annotation; loop `/Annots` and fix.
- **Attachments on A-3**: add `/AFRelationship` and MIME type, and the `/AF` array in the catalog.

What pikepdf cannot fix: unembedded fonts, device colour spaces without profiles inside content, transparency on A-1, missing structure tags for level `a`. Those go back to Ghostscript or the source application.

> **Interview note:** The sentence that shows expertise is "PDF/A is a property of the whole file that any edit can break, so I validate at the end of the pipeline, not at the start, and I never write `pdfaid:part` myself unless veraPDF passes."

### Try It Yourself

```python
import pikepdf, subprocess, shutil, json
from pikepdf import Name, Dictionary, Array

with pikepdf.open("candidate.pdf") as pdf:
    meta = pdf.open_metadata()
    print("claimed PDF/A:", repr(meta.pdfa_status), " encrypted:", pdf.is_encrypted)
    print("output intents:", len(pdf.Root.get("/OutputIntents", [])))
    print("JavaScript open action:", "/OpenAction" in pdf.Root and pdf.Root.OpenAction.get("/S") == Name.JavaScript)
    print("embedded files:", len(pdf.attachments))
    unembedded = set()
    for page in pdf.pages:
        for f in page.Resources.get("/Font", {}).values():
            d = f.DescendantFonts[0].get("/FontDescriptor") if f.get("/Subtype") == "/Type0" else f.get("/FontDescriptor")
            if not (d is not None and any(k in d for k in ("/FontFile", "/FontFile2", "/FontFile3"))): unembedded.add(str(f.get("/BaseFont")))
    print("unembedded fonts:", sorted(unembedded) or "none")
    bad_annots = sum(1 for p in pdf.pages for a in p.get("/Annots", []) if not (int(a.get("/F", 0)) & 4))
    print("annotations without Print flag:", bad_annots)

if shutil.which("verapdf"):
    r = subprocess.run(["verapdf", "--flavour", "2b", "--format", "json", "candidate.pdf"], capture_output=True, text=True)
    job = json.loads(r.stdout)["report"]["jobs"][0]["validationResult"]
    print("veraPDF compliant:", job["compliant"], " failed rules:", job["details"]["failedRules"])
    for rule in job["details"]["ruleSummaries"]:
        if rule["ruleStatus"] == "FAILED": print("  ", rule["clause"], rule["description"][:90])
else:
    print("veraPDF not installed; install from verapdf.org to validate")
```

### Quiz

1. What does setting `pdfaid:part` and `pdfaid:conformance` in XMP do?
- [ ] Converts the file to PDF/A
- [x] Declares a claim that validators will check
- [ ] Embeds all fonts
> The claim must be earned by conversion and verified with veraPDF.

2. Which PDF/A level should a translucent-watermarked handbook target?
- [ ] A-1b
- [x] A-2b
- [ ] A-3a
> A-1 forbids transparency; A-3 is only needed for arbitrary attachments.

3. Which of these can pikepdf fix on its own?
- [ ] An unembedded font
- [x] A missing Print flag on annotations
- [ ] Missing structure tags for level `a`
> Font embedding and tagging require regeneration or Ghostscript.

### Exercises

1. **Annotation flag fixer** — Set the Print flag and clear the Hidden flag on every annotation, then save preserving PDF/A.
<details><summary>Solution</summary>

```python
import pikepdf
with pikepdf.open("candidate.pdf") as pdf:
    for page in pdf.pages:
        for a in page.get("/Annots", []):
            a.F = (int(a.get("/F", 0)) | 4) & ~2
    pdf.save("candidate_flags.pdf")
```

</details>

2. **Batch validation report** — Run veraPDF on every PDF in a folder and write a CSV of file, compliant, failed rule count.
<details><summary>Solution</summary>

```python
import subprocess, json, csv, pathlib
with open("pdfa_report.csv", "w", newline="") as fh:
    wr = csv.writer(fh); wr.writerow(["file", "compliant", "failed_rules"])
    for f in pathlib.Path("out").glob("*.pdf"):
        r = subprocess.run(["verapdf", "--flavour", "2b", "--format", "json", str(f)], capture_output=True, text=True)
        v = json.loads(r.stdout)["report"]["jobs"][0]["validationResult"]
        wr.writerow([f.name, v["compliant"], v["details"]["failedRules"]])
```

</details>

### Interview Questions

**Q: A client wants their 767-page handbook delivered as PDF/A-2b. Describe your pipeline end to end.**
Generate the DOCX from data, convert with LibreOffice headless using the PDF/A-2b export option (or Word's ISO 19005 export when available) so fonts are embedded and the output intent is written by the producer; do not post-process with anything that re-renders. If a watermark or Bates numbering is required, apply it with pikepdf using an embedded font drawn by the same producer rather than Helvetica, keep `preserve_pdfa` on save, and add nothing forbidden. Sync XMP and DocInfo with `open_metadata`. Finally run veraPDF with flavour 2b and archive the JSON report with the file; if any rule fails, fix the cause at the stage that introduced it, and only deliver a file whose report says compliant. The client gets the PDF, the report, and a note that any later edit in Acrobat can break conformance.

**Q: What can Ghostscript do for PDF/A that pikepdf cannot, and vice versa?**
Ghostscript's `pdfwrite` device re-interprets the whole file: it embeds and subsets fonts it can find, converts colour spaces to a target with an ICC output intent, flattens transparency for A-1, and drops forbidden features, so it can turn a non-compliant file into a compliant A-1b or A-2b in one pass at the cost of re-encoding everything and losing tags and some metadata. pikepdf never re-renders; it edits objects exactly, so it preserves a compliant file through surgical changes, fixes metadata, output intents, annotation flags and attachments, and keeps signatures and structure intact. In a pipeline Ghostscript is the conversion hammer used once, and pikepdf is the scalpel used for every edit afterwards.

**Q: Why is PDF/A validation more than checking the XMP claim?**
Because the claim is two strings anyone can write. veraPDF checks the file against the actual ISO 19005 rules: every font embedded with proper widths and encodings, no encryption, no JavaScript or launch actions, an output intent with a valid ICC profile for device colours, XMP well-formed and consistent with DocInfo with a schema for any custom properties, annotation flags, no transparency on A-1, attachment rules per part, and structure tags for level a. Tools such as `pdfa_status` in pikepdf report the claim only, and I have seen files from cheap converters that claimed A-1b while using unembedded Arial. Delivering with the veraPDF report attached is what makes the compliance claim credible.
