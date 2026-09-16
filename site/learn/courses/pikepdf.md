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

