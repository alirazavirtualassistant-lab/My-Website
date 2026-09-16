---
id: ooxml
title: OOXML & DOCX Internals
icon: 🧬
track: Document Engineering
color: #6C3483
runner: python
packages: 
tagline: What a .docx really is, and how to fix what no GUI can.
description: Office Open XML internals for DOCX, XLSX and PPTX: the ZIP package, parts and relationships, content types, document.xml structure, runs and properties, styles.xml, numbering, sections, headers/footers, fields, fonts, themes, and surgical repairs using Python's zipfile and lxml.
---

# LEVEL: Beginner

## Unzipping a .docx: the package structure

A `.docx` file is a ZIP archive. Rename `report.docx` to `report.zip`, extract it, and you are looking at the whole document as folders of XML and media files. This is the Office Open XML (OOXML) format, standardised as ECMA-376 and ISO/IEC 29500, and used by Word (`.docx`), Excel (`.xlsx`) and PowerPoint (`.pptx`) since Office 2007. Everything Word can do is written somewhere inside that ZIP, which is why a person who can read it can fix problems no dialog box exposes.

```bash
cp report.docx report.zip && unzip -o report.zip -d report_unzipped
find report_unzipped -type f | sort
```

A typical Word document produced by Word 365 contains:

```text
[Content_Types].xml
_rels/.rels
docProps/app.xml
docProps/core.xml
word/document.xml
word/_rels/document.xml.rels
word/styles.xml
word/settings.xml
word/fontTable.xml
word/webSettings.xml
word/theme/theme1.xml
word/numbering.xml          (only if the document has lists)
word/header1.xml            (one per header)
word/footer1.xml
word/media/image1.png       (embedded pictures)
word/comments.xml           (if comments exist)
word/footnotes.xml, word/endnotes.xml
```

Each file inside is called a **part**. The ZIP container plus the rules for parts and their relationships is the Open Packaging Conventions (OPC), which is shared by all three Office formats. A `.pptx` has `ppt/presentation.xml` and `ppt/slides/slide1.xml`; an `.xlsx` has `xl/workbook.xml` and `xl/worksheets/sheet1.xml`. Same container, different vocabulary.

#### The three files that must exist

| Part | Role |
|---|---|
| `[Content_Types].xml` | Declares the media type of every part, by extension or by exact name |
| `_rels/.rels` | The package's root relationships; points at the main document part |
| `word/document.xml` | The main document: the body text |

A file with only those three parts opens in Word. No styles, no settings, no fonts: Word supplies defaults. That minimal document is the foundation of every experiment in this course, and the Try It block builds it.

#### Reading a part with Python

```python
import zipfile
with zipfile.ZipFile("report.docx") as z:
    for info in z.infolist():
        print(f"{info.file_size:>8}  {info.filename}")
    xml = z.read("word/document.xml").decode("utf-8")
print(xml[:500])
```

`zipfile` is in the standard library. The XML Word writes is one long line with no whitespace, so pipe it through `xmllint --format` on the shell, or `xml.dom.minidom.parseString(xml).toprettyxml()` in Python, to read it.

#### Directory names are conventions, not rules

The `word/` folder and the file name `document.xml` are what Word chooses. The specification does not require them: the main part is whatever `_rels/.rels` points to, and other parts are found by following relationships. Some generators name the main part `word/document2.xml` after a save, and Google Docs exports differ again. Code that assumes `word/document.xml` works on 99% of files; code that follows the relationships works on all of them.

#### Compression

Parts are usually stored with Deflate compression. A 767-page handbook can be 40 MB of XML compressed to 3 MB. When writing a package from Python, use `zipfile.ZIP_DEFLATED`; a stored (uncompressed) package is valid but large. Unlike EPUB, there is no rule that a particular part must be first or uncompressed, although Word itself writes `[Content_Types].xml` first and it is good manners to do the same.

> **Tip:** Keep an unzipped copy of a Word-saved document next to your generated one and diff the parts. Word's own output is the most reliable specification of what Word will accept.

#### Why this matters for production work

- A "corrupt" file is usually one part with one bad element; you can open the ZIP, fix the XML and re-zip.
- Batch operations across 300 files (replace a logo, change a footer, swap a font) are a loop over ZIP entries, with no Office licence involved.
- Understanding parts explains library behaviour: python-docx's `doc.part`, docx4j's `MainDocumentPart` and the Open XML SDK's `MainDocumentPart` are all this.

### Try It Yourself

```python
import io, zipfile

CT = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>'''
RELS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''
DOC = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Hello from a hand-made .docx</w:t></w:r></w:p>
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>
  </w:body>
</w:document>'''

buf = io.BytesIO()
with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", CT)
    z.writestr("_rels/.rels", RELS)
    z.writestr("word/document.xml", DOC)
data = buf.getvalue()
print("docx size:", len(data), "bytes; starts with", data[:2])

with zipfile.ZipFile(io.BytesIO(data)) as z:
    for info in z.infolist():
        print(f"{info.file_size:>5} -> {info.compress_size:>4}  {info.filename}")
    print(z.read("word/document.xml").decode()[:120], "...")
```

### Quiz

1. What is a .docx file at the container level?
- [x] A ZIP archive of XML parts and media
- [ ] A single XML file
- [ ] A binary OLE compound file
> The OLE compound format was the old `.doc`; OOXML uses ZIP under the Open Packaging Conventions.

2. Which three parts are the minimum for Word to open a document?
- [ ] document.xml, styles.xml, settings.xml
- [x] [Content_Types].xml, _rels/.rels, word/document.xml
- [ ] core.xml, app.xml, document.xml
> Styles and settings are optional; Word falls back to defaults.

3. Is the path `word/document.xml` required by the standard?
- [ ] Yes, always
- [x] No, the main part is whatever the root relationships point at
- [ ] Only for .dotx files
> Word uses that name by convention; robust code follows `_rels/.rels`.

### Exercises

1. **Part lister** — Write a function that prints every part in a .docx with its uncompressed and compressed size and the compression ratio.
<details><summary>Solution</summary>

```python
import zipfile
def parts(path):
    with zipfile.ZipFile(path) as z:
        for i in z.infolist():
            ratio = (i.compress_size / i.file_size * 100) if i.file_size else 0
            print(f"{i.file_size:>9} {i.compress_size:>8} {ratio:5.1f}%  {i.filename}")
```

</details>

2. **Media finder** — List all files under `word/media/` and their sizes to find the images bloating a document.
<details><summary>Solution</summary>

```python
with zipfile.ZipFile(path) as z:
    media = [(i.filename, i.file_size) for i in z.infolist() if i.filename.startswith("word/media/")]
for name, size in sorted(media, key=lambda x: -x[1]):
    print(f"{size/1024:8.0f} KB  {name}")
```

</details>

### Interview Questions

**Q: What is a .docx file, structurally?**
A ZIP package following the Open Packaging Conventions: a set of parts (XML files and media) plus relationships that link them, with `[Content_Types].xml` declaring each part's media type. The main document part, normally `word/document.xml`, holds the body; styles, numbering, headers, footers, footnotes, comments, fonts and settings are separate parts related to it. The same container is used by `.xlsx` and `.pptx` with different vocabularies. Because it is a ZIP of text, any tool that can handle ZIP and XML can read or repair it without Office installed.

**Q: Why does knowing the package structure matter if libraries exist?**
Libraries model the common cases and stop there. When a client's file will not open, when 300 documents need a footer changed, or when a feature like font embedding or a content control has no library API, the fix is at the package level: open the ZIP, edit one part with lxml, write it back. Every library's escape hatch, from python-docx's `_element` to docx4j's parts, is this structure, so understanding it makes the libraries predictable too.

**Q: A colleague says the main part is always `word/document.xml`. What is your response?**
Almost always, but not by rule: the spec says the main part is the target of the `officeDocument` relationship in `_rels/.rels`. Word writes `word/document.xml`, but some tools and some resaves produce other names, and a hand-built package can use anything. Production code should resolve the path through the root relationships, then resolve `styles.xml` and the rest through the main part's own `.rels`.

## [Content_Types].xml and relationships

Two small XML files hold the package together. `[Content_Types].xml` says what each part *is*; the `.rels` files say how parts *connect*. Get either wrong and Word reports "unreadable content" even though every other byte is perfect.

#### [Content_Types].xml

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Default Extension="png"  ContentType="image/png"/>
  <Override PartName="/word/document.xml"
            ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml"
            ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/header1.xml"
            ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/docProps/core.xml"
            ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>
```

`Default` maps a file extension to a media type; `Override` maps one exact part name. A part with no matching `Default` or `Override` is an error. This is the first thing to check when you add a part: adding `word/header2.xml` without an `Override` (or at least the `xml` Default, which Word does not accept for headers) makes the file unreadable.

Common content types you will type by hand:

| Part | ContentType |
|---|---|
| Main document (.docx) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml` |
| Main document (.dotx template) | `...wordprocessingml.template.main+xml` |
| Main document (.docm macro-enabled) | `application/vnd.ms-word.document.macroEnabled.main+xml` |
| styles.xml | `...wordprocessingml.styles+xml` |
| numbering.xml | `...wordprocessingml.numbering+xml` |
| settings.xml | `...wordprocessingml.settings+xml` |
| fontTable.xml | `...wordprocessingml.fontTable+xml` |
| header / footer | `...wordprocessingml.header+xml` / `footer+xml` |
| comments.xml | `...wordprocessingml.comments+xml` |
| theme1.xml | `application/vnd.openxmlformats-officedocument.theme+xml` |
| core.xml / app.xml | `application/vnd.openxmlformats-package.core-properties+xml` / `...officeDocument.extended-properties+xml` |
| Embedded font (.odttf) | `application/vnd.openxmlformats-officedocument.obfuscatedFont` |

The `...` stands for `application/vnd.openxmlformats-officedocument.` in every row. The `.docx`/`.dotx` difference is *only* this content type on the main part, which is why renaming a `.dotx` to `.docx` does not turn it into a document.

#### Relationships

Every part that references other parts has a companion `.rels` file in a `_rels` folder next to it, named `<part>.rels`. The package root has `_rels/.rels`; the main document has `word/_rels/document.xml.rels`; a header with an image has `word/_rels/header1.xml.rels`.

```xml
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://stewart.com" TargetMode="External"/>
</Relationships>
```

Three facts to memorise:

1. **Targets are relative to the source part's folder.** `Target="media/image1.png"` from `word/document.xml` means `word/media/image1.png`.
2. **Ids are local to one .rels file.** `rId3` in the document's rels and `rId3` in a header's rels are unrelated. The Id is what the XML refers to: `<a:blip r:embed="rId3"/>`, `<w:headerReference r:id="rId2"/>`.
3. **`TargetMode="External"`** means the target is a URL or file path outside the package (hyperlinks, linked images, attached templates).

The relationship *Type* is a URI that identifies the role: `.../relationships/styles`, `/numbering`, `/settings`, `/fontTable`, `/theme`, `/header`, `/footer`, `/image`, `/hyperlink`, `/comments`, `/footnotes`, `/attachedTemplate`, `/customXml`, `/font`. Word finds `styles.xml` by Type, not by name.

#### Resolving the main part properly

```python
import zipfile, posixpath
import xml.etree.ElementTree as ET
PKG = "{http://schemas.openxmlformats.org/package/2006/relationships}"
OFFICE_DOC = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"

def main_part(z):
    root = ET.fromstring(z.read("_rels/.rels"))
    for rel in root.findall(PKG + "Relationship"):
        if rel.get("Type") == OFFICE_DOC:
            return rel.get("Target").lstrip("/")

def rels_of(z, part):
    folder, name = posixpath.split(part)
    path = posixpath.join(folder, "_rels", name + ".rels")
    if path not in z.namelist():
        return {}
    root = ET.fromstring(z.read(path))
    return {r.get("Id"): (r.get("Type").rsplit("/", 1)[1], posixpath.normpath(posixpath.join(folder, r.get("Target"))), r.get("TargetMode"))
            for r in root.findall(PKG + "Relationship")}
```

This pair of functions is the start of every package-level tool: it finds the document and its parts wherever they live.

> **Warning:** Adding a part means three edits, not one: write the part, add a `Relationship` from the part that uses it, and add an `Override` (or rely on a `Default`) in `[Content_Types].xml`. Forgetting any of the three produces a file Word calls corrupt.

#### Orphans and dangling references

A part with no relationship pointing to it is an orphan: harmless but wasted space (old images after edits). A relationship or `r:id` pointing to a missing part is dangling: fatal. The repair chapter builds a checker for both.

### Try It Yourself

```python
import io, zipfile, posixpath
import xml.etree.ElementTree as ET

PKG = "{http://schemas.openxmlformats.org/package/2006/relationships}"
CTNS = "{http://schemas.openxmlformats.org/package/2006/content-types}"
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"

parts = {
 "[Content_Types].xml": '''<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>''',
 "_rels/.rels": '''<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>''',
 "word/_rels/document.xml.rels": '''<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://stewart.com" TargetMode="External"/>
</Relationships>''',
 "word/document.xml": f'<w:document xmlns:w="{W}"><w:body><w:p><w:r><w:t>Body</w:t></w:r></w:p><w:sectPr/></w:body></w:document>',
 "word/styles.xml": f'<w:styles xmlns="{W}" xmlns:w="{W}"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>',
}
buf = io.BytesIO()
with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
    for name, xml in parts.items():
        z.writestr(name, xml)

with zipfile.ZipFile(io.BytesIO(buf.getvalue())) as z:
    ct = ET.fromstring(z.read("[Content_Types].xml"))
    print("defaults :", [(d.get("Extension"), d.get("ContentType").split("/")[-1]) for d in ct.findall(CTNS + "Default")])
    print("overrides:", [o.get("PartName") for o in ct.findall(CTNS + "Override")])
    root = ET.fromstring(z.read("_rels/.rels"))
    main = [r.get("Target") for r in root.findall(PKG + "Relationship")][0]
    print("main part:", main)
    folder = posixpath.dirname(main)
    rels = ET.fromstring(z.read(f"{folder}/_rels/{posixpath.basename(main)}.rels"))
    for r in rels.findall(PKG + "Relationship"):
        target = r.get("Target") if r.get("TargetMode") == "External" else posixpath.join(folder, r.get("Target"))
        print(f"  {r.get('Id')}: {r.get('Type').rsplit('/', 1)[1]:10} -> {target}")
```

### Quiz

1. What distinguishes a .dotx from a .docx inside the package?
- [ ] The folder name
- [x] The main part's ContentType in [Content_Types].xml
- [ ] An extra template.xml part
> `wordprocessingml.template.main+xml` versus `document.main+xml`; everything else can be identical.

2. `Target="media/image1.png"` in `word/_rels/document.xml.rels` refers to:
- [ ] `/media/image1.png`
- [x] `word/media/image1.png`
- [ ] `word/_rels/media/image1.png`
> Targets are resolved relative to the folder of the source part.

3. Are relationship Ids unique across the whole package?
- [ ] Yes
- [x] No, only within one .rels file
- [ ] Only for images
> `rId1` in the document's rels and `rId1` in a header's rels are independent.

### Exercises

1. **Content-type checker** — Write a function that reports parts in a package with no matching `Default` extension or `Override` entry.
<details><summary>Solution</summary>

```python
import zipfile, xml.etree.ElementTree as ET
CTNS = "{http://schemas.openxmlformats.org/package/2006/content-types}"
def uncovered(path):
    with zipfile.ZipFile(path) as z:
        ct = ET.fromstring(z.read("[Content_Types].xml"))
        exts = {d.get("Extension").lower() for d in ct.findall(CTNS + "Default")}
        names = {o.get("PartName") for o in ct.findall(CTNS + "Override")}
        return [n for n in z.namelist() if n != "[Content_Types].xml" and not n.endswith("/")
                and "/" + n not in names and n.rsplit(".", 1)[-1].lower() not in exts]
```

</details>

2. **Relationship graph** — Print every `.rels` file in a package and the Id, type and target of each relationship.
<details><summary>Solution</summary>

```python
PKG = "{http://schemas.openxmlformats.org/package/2006/relationships}"
with zipfile.ZipFile(path) as z:
    for n in z.namelist():
        if n.endswith(".rels"):
            print(n)
            for r in ET.fromstring(z.read(n)).findall(PKG + "Relationship"):
                print("   ", r.get("Id"), r.get("Type").rsplit("/", 1)[1], r.get("Target"), r.get("TargetMode") or "")
```

</details>

### Interview Questions

**Q: What are the three edits needed to add a new part, such as a second header, to a package?**
Write the part itself (`word/header2.xml` with valid `w:hdr` content), add a `Relationship` of type `.../relationships/header` from `word/_rels/document.xml.rels` with a new unique `Id`, and make sure `[Content_Types].xml` covers it with an `Override` for `/word/header2.xml` using the header content type. Then reference the relationship Id from the section's `w:headerReference r:id`. Missing any one of the three produces an unreadable file, so I wrap the whole sequence in one `add_part()` helper.

**Q: How does Word find styles.xml?**
Through the main document part's relationships: it looks for a relationship whose Type ends in `/styles` and follows its Target, resolved relative to the document part's folder. The file name is convention. The same applies to numbering, settings, font table, theme, headers and footers. This is why a package with `styles.xml` present but no relationship shows unstyled text: the part is an orphan.

**Q: What is `TargetMode="External"` used for?**
For relationships whose target lives outside the package: hyperlinks to URLs, linked (not embedded) images, an attached template path in `settings.xml`, and OLE links. The document XML still references them by `r:id`, so a hyperlink's URL is not in `document.xml` at all; it is in the rels file. A find-and-replace on URLs therefore has to edit `.rels`, which surprises people the first time.

## document.xml: body, paragraph and run

The main document part holds the text. Its structure is simple and strict: a `w:document` root, one `w:body`, and inside it a sequence of block-level elements (paragraphs `w:p` and tables `w:tbl`) ending with the final section's properties `w:sectPr`.

```xml
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>Title Search Procedures</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t xml:space="preserve">Files must be </w:t></w:r>
      <w:r><w:rPr><w:b/></w:rPr><w:t>validated</w:t></w:r>
      <w:r><w:t xml:space="preserve"> before release.</w:t></w:r>
    </w:p>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
```

#### The hierarchy

| Element | Meaning | Children |
|---|---|---|
| `w:body` | The document content | `w:p`, `w:tbl`, `w:sdt`, final `w:sectPr` |
| `w:p` | Paragraph | optional `w:pPr`, then `w:r`, `w:hyperlink`, `w:fldSimple`, `w:bookmarkStart`, `w:sdt`, `w:ins`, `w:del` |
| `w:r` | Run: text with one formatting | optional `w:rPr`, then `w:t`, `w:tab`, `w:br`, `w:drawing`, `w:fldChar`, `w:instrText`, `w:sym`, `w:footnoteReference` |
| `w:t` | Literal text | text only |

A paragraph with no runs is an empty line. A run with no `w:rPr` inherits everything from the paragraph style. Word emits a new run whenever formatting changes and also for reasons of its own (proofing marks, edit history), which is why a single sentence often appears as many runs.

#### xml:space="preserve"

XML parsers may trim leading and trailing whitespace in text. `w:t` with a leading or trailing space must carry `xml:space="preserve"` or the space is lost when the file is reopened: "Files must be" + "validated" becomes "Files must bevalidated". Word writes the attribute whenever needed; your code must too. The safe habit is to always add it.

#### Special run content

```xml
<w:r><w:tab/></w:r>                          <!-- a tab character -->
<w:r><w:br/></w:r>                           <!-- soft line break (Shift+Enter) -->
<w:r><w:br w:type="page"/></w:r>             <!-- page break -->
<w:r><w:sym w:font="Wingdings" w:char="F0FC"/></w:r>   <!-- symbol glyph -->
<w:r><w:noBreakHyphen/></w:r>
<w:r><w:softHyphen/></w:r>
```

Tabs and breaks are elements, not characters. If you write a literal `\t` inside `w:t`, Word displays it as a space-like character rather than a tab stop; if you write `\n`, Word ignores it. Text in `w:t` must not contain control characters other than tab, which Word renders unpredictably; encode `&`, `<` and `>` as XML entities.

#### The final sectPr and the table rule

`w:sectPr` must be the last child of `w:body`. Word also requires that a table is never the last content element before it: there must be a `w:p` after the final `w:tbl`. Generators that forget this produce a file Word calls unreadable. Adding an empty `<w:p/>` after the last table is always safe.

#### Reading text with ElementTree

```python
import zipfile
import xml.etree.ElementTree as ET
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

with zipfile.ZipFile("report.docx") as z:
    root = ET.fromstring(z.read("word/document.xml"))
body = root.find(W + "body")
for p in body.iter(W + "p"):
    text = "".join((t.text or "") if t.tag == W + "t" else "\t" if t.tag == W + "tab" else "\n" if t.tag == W + "br" else ""
                   for t in p.iter() if t.tag in (W + "t", W + "tab", W + "br"))
    print(repr(text))
```

`body.iter(W + "p")` descends into tables and text boxes, which is what you want for text extraction and not what you want when you are counting body paragraphs; use `body.findall(W + "p")` for direct children only.

> **Interview note:** "Where is the bold?" is a favourite. Bold is `w:b` inside the run's `w:rPr`, or inherited from a style. It is never an attribute of `w:t` and never on the paragraph, except for the paragraph mark's own formatting, which is `w:rPr` inside `w:pPr`.

#### Tables in the body

A `w:tbl` sits beside paragraphs at body level, with `w:tr` rows and `w:tc` cells, each cell containing at least one `w:p`. The tables chapter dissects it; for now, note that text inside cells is inside paragraphs inside cells, three levels down.

### Try It Yourself

```python
import io, zipfile
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
WN = "{" + W + "}"

def run(text, bold=False):
    rpr = "<w:rPr><w:b/></w:rPr>" if bold else ""
    return f'<w:r>{rpr}<w:t xml:space="preserve">{text}</w:t></w:r>'

document = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="{W}"><w:body>
<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>{run("Title Search Procedures")}</w:p>
<w:p>{run("Files must be ")}{run("validated", bold=True)}{run(" before release.")}</w:p>
<w:p>{run("Name:")}<w:r><w:tab/></w:r>{run("Ali Raza")}<w:r><w:br/></w:r>{run("Lahore")}</w:p>
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr>
</w:body></w:document>'''

CT = '''<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'''
RELS = '''<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'''

buf = io.BytesIO()
with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", CT); z.writestr("_rels/.rels", RELS); z.writestr("word/document.xml", document)
print("package:", len(buf.getvalue()), "bytes")

root = ET.fromstring(document)
body = root.find(WN + "body")
for i, p in enumerate(body.findall(WN + "p")):
    style = p.find(f"{WN}pPr/{WN}pStyle")
    parts = []
    for el in p.iter():
        if el.tag == WN + "t": parts.append(el.text or "")
        elif el.tag == WN + "tab": parts.append("\\t")
        elif el.tag == WN + "br": parts.append("\\n")
    bold_runs = [r.find(WN + "t").text for r in p.findall(WN + "r") if r.find(f"{WN}rPr/{WN}b") is not None and r.find(WN + "t") is not None]
    print(i, style.get(WN + "val") if style is not None else "Normal", "|", "".join(parts), "| bold:", bold_runs)
```

### Quiz

1. Which element must be the last child of `w:body`?
- [ ] `w:p`
- [x] `w:sectPr`
- [ ] `w:tbl`
> The final section's properties close the body; a paragraph must precede it if a table is the last content.

2. Why add `xml:space="preserve"` to `w:t`?
- [x] To keep leading and trailing spaces from being trimmed
- [ ] To enable Unicode
- [ ] To allow tabs
> Without it, "must be " loses its trailing space on reload.

3. How is a tab represented in a run?
- [ ] A `\t` character inside `w:t`
- [x] A `w:tab` element
- [ ] `w:t w:tab="true"`
> Tabs, line breaks and page breaks are elements, not characters.

### Exercises

1. **Text extractor** — Write `docx_text(path)` that returns the body text with paragraphs joined by newlines, handling `w:tab` and `w:br`.
<details><summary>Solution</summary>

```python
import zipfile, xml.etree.ElementTree as ET
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
def docx_text(path):
    with zipfile.ZipFile(path) as z:
        body = ET.fromstring(z.read("word/document.xml")).find(W + "body")
    out = []
    for p in body.iter(W + "p"):
        out.append("".join((e.text or "") if e.tag == W + "t" else "\t" if e.tag == W + "tab" else "\n" if e.tag == W + "br" else "" for e in p.iter()))
    return "\n".join(out)
```

</details>

2. **Run counter** — Count the runs per paragraph to see how fragmented a Word-authored file is.
<details><summary>Solution</summary>

```python
for i, p in enumerate(body.findall(W + "p")):
    print(i, len(p.findall(W + "r")), "runs")
```

</details>

### Interview Questions

**Q: Describe the structure of document.xml from the root down to a bold word.**
`w:document` contains one `w:body`, which holds block-level content: `w:p` paragraphs and `w:tbl` tables, ending with `w:sectPr`. A paragraph has an optional `w:pPr` (style, alignment, spacing) followed by runs. A run `w:r` has an optional `w:rPr` with its character formatting, then content elements such as `w:t` for text. So a bold word is `w:body/w:p/w:r[w:rPr/w:b]/w:t`. Formatting inherits from the paragraph style and document defaults when `w:rPr` is absent.

**Q: Why does Word show text as many runs even when the formatting looks uniform?**
Word splits runs at every formatting change but also keeps run boundaries from editing history, spell-check state (`w:noProof`, proofing errors), language tags, and revision save IDs (`w:rsidR` attributes). None of these are visible, so a sentence typed in several sessions can be ten runs. Any tool that searches text must concatenate run text per paragraph before matching, and any tool that writes text should avoid needless splits so the file stays small.

**Q: What are the rules that make Word reject an otherwise well-formed document.xml?**
`w:sectPr` must be last in the body; a `w:tbl` cannot be the last content element; every `w:tc` needs at least one `w:p`; `w:pPr` must be the first child of `w:p` and `w:rPr` the first child of `w:r`; children of property elements must follow the schema sequence; text with edge whitespace needs `xml:space="preserve"`; and control characters other than tab must not appear in `w:t`. Validating against the schema with the Open XML SDK catches all of these; the repair chapter lists the fixes.

## Run properties (rPr) and paragraph properties (pPr)

Formatting in WordprocessingML is expressed as *property elements*: `w:rPr` for a run and `w:pPr` for a paragraph. Each is a container of small, mostly empty elements whose presence or `w:val` attribute sets one property. Two rules govern them: they must be the first child of their parent, and their own children must appear in the order the schema defines.

#### Run properties

```xml
<w:r>
  <w:rPr>
    <w:rStyle w:val="Strong"/>
    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/>
    <w:b/>
    <w:i w:val="0"/>
    <w:color w:val="2B579A"/>
    <w:sz w:val="22"/>
    <w:szCs w:val="22"/>
    <w:highlight w:val="yellow"/>
    <w:u w:val="single"/>
    <w:vertAlign w:val="superscript"/>
  </w:rPr>
  <w:t>Text</w:t>
</w:r>
```

| Element | Meaning | Unit or values |
|---|---|---|
| `w:rStyle` | Character style reference | style ID |
| `w:rFonts` | Font per script: `ascii`, `hAnsi`, `eastAsia`, `cs`; theme variants `asciiTheme="minorHAnsi"` | font names |
| `w:b`, `w:i`, `w:caps`, `w:smallCaps`, `w:strike`, `w:dstrike`, `w:vanish` | Toggle properties | present = on; `w:val="0"` or `"false"` = off |
| `w:bCs`, `w:iCs` | Bold/italic for complex-script text | toggles |
| `w:color` | Text colour | hex RGB, or `auto`; `w:themeColor="accent1"` |
| `w:sz`, `w:szCs` | Font size | half-points: 22 = 11 pt |
| `w:u` | Underline | `single`, `double`, `dotted`, `none` |
| `w:highlight` | Highlight | 16 named colours (`yellow`, `cyan`, ...) |
| `w:shd` | Shading | `w:fill="D9D9D9"` |
| `w:spacing` | Character spacing | twentieths of a point |
| `w:vertAlign` | Super/subscript | `superscript`, `subscript`, `baseline` |
| `w:lang` | Proofing language | `w:val="en-US"`, `w:bidi="ur-PK"` |
| `w:rtl` | Right-to-left run | toggle |

The order above is the schema order (`rStyle, rFonts, b, bCs, i, iCs, caps, smallCaps, strike, dstrike, outline, shadow, emboss, imprint, noProof, snapToGrid, vanish, webHidden, color, spacing, w, kern, position, sz, szCs, highlight, u, effect, bdr, shd, fitText, vertAlign, rtl, cs, em, lang, eastAsianLayout, specVanish, oMath`). Word is tolerant of some misordering but not all; strict validators and some third-party tools reject any deviation.

#### Toggle properties and inheritance

`w:b` with no attribute means bold on. `w:b w:val="0"` (or `"false"`) means explicitly off, which matters when the style is bold and one word must not be. Toggle properties in *styles* combine by XOR through the style chain: a character style with bold applied to text whose paragraph style is also bold turns bold *off*. Direct formatting on the run does not XOR; it simply wins.

#### Paragraph properties

```xml
<w:p>
  <w:pPr>
    <w:pStyle w:val="ListParagraph"/>
    <w:keepNext/>
    <w:keepLines/>
    <w:pageBreakBefore/>
    <w:numPr><w:ilvl w:val="0"/><w:numId w:val="3"/></w:numPr>
    <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="auto"/></w:pBdr>
    <w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>
    <w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9360"/></w:tabs>
    <w:spacing w:before="120" w:after="120" w:line="276" w:lineRule="auto"/>
    <w:ind w:left="720" w:hanging="360"/>
    <w:jc w:val="both"/>
    <w:outlineLvl w:val="1"/>
    <w:rPr><w:b/></w:rPr>
  </w:pPr>
  ...runs...
</w:p>
```

| Element | Meaning | Unit or values |
|---|---|---|
| `w:pStyle` | Paragraph style | style ID |
| `w:keepNext`, `w:keepLines`, `w:pageBreakBefore`, `w:widowControl` | Pagination controls | toggles |
| `w:numPr` | List membership: level and numbering instance | `w:ilvl`, `w:numId` |
| `w:pBdr`, `w:shd` | Borders and shading | sizes in eighths of a point |
| `w:tabs` | Tab stops | `w:pos` in twips; `left/center/right/decimal`; leaders |
| `w:spacing` | Space before/after (twips), line (`w:line` 240 = single when `lineRule="auto"`) | twips |
| `w:ind` | Indents: `left`, `right`, `firstLine`, `hanging` | twips |
| `w:jc` | Justification | `left` (`start`), `center`, `right` (`end`), `both`, `distribute` |
| `w:outlineLvl` | Outline level 0-8 (Heading 1 = 0) | used by TOC and Navigation Pane |
| `w:rPr` inside `w:pPr` | Formatting of the paragraph mark itself | the ¶ glyph, and what a new run inherits |
| `w:sectPr` inside `w:pPr` | Ends a section here | see the sections chapter |

#### Units cheat sheet

| Unit | Where | Conversion |
|---|---|---|
| Twips (dxa) | indents, spacing, tabs, page size, margins | 1440 per inch, 20 per point |
| Half-points | font size `w:sz` | 24 = 12 pt |
| Eighths of a point | border widths `w:sz` on borders | 8 = 1 pt |
| Twentieths of a point | character spacing | 20 = 1 pt |
| EMU | DrawingML sizes (`wp:extent`) | 914,400 per inch; 12,700 per point |
| Fiftieths of a percent | table widths with `w:type="pct"` | 5000 = 100% |

The same attribute name `w:sz` means half-points on fonts and eighths of a point on borders. Interviewers love that one.

> **Warning:** Direct formatting (`w:rPr` on runs) overrides styles everywhere it appears. A document that "will not change when I edit the style" is full of direct formatting; the fix is to strip run-level `w:rPr` children that duplicate the style, which is a ten-line lxml script.

#### Reading effective formatting

Effective bold = document defaults, then the paragraph style chain, then the character style chain, then direct formatting. Nothing in the file stores the result; every consumer computes it. The styles chapter implements the resolution.

### Try It Yourself

```python
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
WN = "{" + W + "}"
xml = f'''<w:p xmlns:w="{W}">
  <w:pPr><w:pStyle w:val="Heading2"/><w:keepNext/><w:spacing w:before="240" w:after="60" w:line="276" w:lineRule="auto"/>
          <w:ind w:left="720" w:hanging="360"/><w:jc w:val="both"/><w:outlineLvl w:val="1"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:color w:val="2B579A"/><w:sz w:val="28"/></w:rPr><w:t>Rate matrix </w:t></w:r>
  <w:r><w:rPr><w:i/><w:sz w:val="20"/><w:u w:val="single"/></w:rPr><w:t>(draft)</w:t></w:r>
</w:p>'''
p = ET.fromstring(xml)

pPr = p.find(WN + "pPr")
sp = pPr.find(WN + "spacing"); ind = pPr.find(WN + "ind")
print("style:", pPr.find(WN + "pStyle").get(WN + "val"))
print("space before/after (pt):", int(sp.get(WN + "before")) / 20, int(sp.get(WN + "after")) / 20)
print("line spacing (multiple):", int(sp.get(WN + "line")) / 240)
print("left indent (in):", int(ind.get(WN + "left")) / 1440, "hanging (in):", int(ind.get(WN + "hanging")) / 1440)
print("keep with next:", pPr.find(WN + "keepNext") is not None)

for r in p.findall(WN + "r"):
    rPr = r.find(WN + "rPr")
    props = {}
    for el in rPr:
        name = el.tag.split("}")[1]
        val = el.get(WN + "val")
        if name == "sz": props["size_pt"] = int(val) / 2
        elif name == "rFonts": props["font"] = el.get(WN + "ascii")
        elif val is None: props[name] = True
        else: props[name] = val
    print(repr(r.find(WN + "t").text), props)
```

### Quiz

1. `<w:sz w:val="24"/>` in a run means:
- [ ] 24 pt
- [x] 12 pt
- [ ] 24 twips
> Font size is stored in half-points.

2. Where must `w:pPr` appear?
- [x] As the first child of `w:p`
- [ ] As the last child of `w:p`
- [ ] Anywhere inside `w:p`
> Property containers precede content; same for `w:rPr` in `w:r`.

3. Which element makes a paragraph a list item?
- [ ] `w:pStyle w:val="ListBullet"` only
- [x] `w:numPr` with `w:ilvl` and `w:numId`
- [ ] `w:bullet`
> `numPr` links to a numbering instance; a list style may carry numPr in its own pPr.

4. 1440 twips equals:
- [x] 1 inch
- [ ] 1 point
- [ ] 1 centimetre
> Twips are twentieths of a point; 72 pt × 20 = 1440 per inch.

### Exercises

1. **Strip direct fonts** — Given a paragraph element, remove `w:rFonts` and `w:sz` from every run's `w:rPr` (so the style decides), deleting empty `w:rPr` afterwards.
<details><summary>Solution</summary>

```python
def strip_direct(p):
    for r in p.findall(W + "r"):
        rPr = r.find(W + "rPr")
        if rPr is None: continue
        for tag in ("rFonts", "sz", "szCs"):
            for el in rPr.findall(W + tag): rPr.remove(el)
        if len(rPr) == 0: r.remove(rPr)
```

</details>

2. **Twips helper** — Write `twips(value, unit)` converting inches, cm and points to twips, and use it to build a `w:ind` element for a 0.5-inch left indent.
<details><summary>Solution</summary>

```python
def twips(v, unit):
    return int(round({"in": 1440, "cm": 1440 / 2.54, "pt": 20}[unit] * v))
ind = ET.Element(W + "ind"); ind.set(W + "left", str(twips(0.5, "in")))
print(ET.tostring(ind).decode())   # w:left="720"
```

</details>

### Interview Questions

**Q: How is "bold" stored, and what does `w:b w:val="0"` mean?**
Bold is the toggle element `w:b` inside `w:rPr` (direct formatting) or inside a style's `w:rPr`. Present with no attribute means on; `w:val="0"` or `"false"` means explicitly off, which is how one word in a bold heading is made regular. When bold comes from two styles in the chain (paragraph style and character style) toggles combine by XOR, so applying a bold character style to text in a bold paragraph style turns bold off; direct formatting on the run simply overrides. Knowing this explains several "why did my text un-bold" tickets.

**Q: List the units used in WordprocessingML and give one gotcha.**
Twips (1/1440 inch) for spacing, indents, tabs, page geometry and table widths; half-points for `w:sz` font size; eighths of a point for border `w:sz`; twentieths of a point for character spacing; EMUs (914,400 per inch) in DrawingML for image extents; fiftieths of a percent for percentage table widths. The gotcha is that `w:sz` means half-points on a run but eighths of a point on a border, so `w:sz="24"` is 12 pt text or a 3 pt line depending on context.

**Q: Why does element order inside rPr matter, and how do you get it right in code?**
The schema defines `w:rPr` as a sequence, so `w:sz` before `w:b` is a validation error; Word tolerates some cases and rejects others, and third-party tools such as older LibreOffice builds or validators are stricter. In code I keep an ordered list of the child names and insert new elements at the correct index (python-docx's `_insert_*` helpers do this), or I emit the whole `rPr` as a literal string in the right order. I also validate outputs with the Open XML SDK in CI so ordering mistakes never reach a client.

## Namespaces: w:, r:, a: and friends

Every element in OOXML belongs to a namespace, identified by a URI and bound to a prefix in the document. The prefix (`w:`) is cosmetic; the URI is what matters. This chapter lists the namespaces you will meet daily and shows how to work with them in Python's `xml.etree.ElementTree` and lxml.

```xml
<w:document
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  mc:Ignorable="w14">
```

| Prefix | Namespace URI | Used for |
|---|---|---|
| `w` | `http://schemas.openxmlformats.org/wordprocessingml/2006/main` | Everything in Word body, styles, numbering, settings |
| `r` | `http://schemas.openxmlformats.org/officeDocument/2006/relationships` | `r:id`, `r:embed` attributes that point at relationships |
| `a` | `http://schemas.openxmlformats.org/drawingml/2006/main` | DrawingML: shapes, pictures, themes, colours, fonts |
| `wp` | `http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing` | Inline and anchored drawings inside Word |
| `pic` | `http://schemas.openxmlformats.org/drawingml/2006/picture` | The picture element inside a drawing |
| `mc` | `http://schemas.openxmlformats.org/markup-compatibility/2006` | `mc:Ignorable`, `mc:AlternateContent` for newer features |
| `w14`, `w15`, `w16*` | `http://schemas.microsoft.com/office/word/2010/wordml`, `/2012/wordml`, ... | Word 2010+ extensions: check boxes, threaded comments |
| `v` | `urn:schemas-microsoft-com:vml` | Legacy VML: old-style text boxes, watermarks |
| `cp`, `dc`, `dcterms` | `http://schemas.openxmlformats.org/package/2006/metadata/core-properties`, `http://purl.org/dc/elements/1.1/`, `http://purl.org/dc/terms/` | core.xml properties |
| `ds` | `http://schemas.openxmlformats.org/officeDocument/2006/customXml` | Custom XML data store properties |
| (default) | `http://schemas.openxmlformats.org/package/2006/content-types` | `[Content_Types].xml` |
| (default) | `http://schemas.openxmlformats.org/package/2006/relationships` | `.rels` files |

Excel adds `x` (`spreadsheetml/2006/main`), PowerPoint adds `p` (`presentationml/2006/main`); both reuse `a` and `r`.

#### Strict versus transitional

ISO 29500 defines two conformance classes. Word writes **Transitional** by default, with the namespaces above. **Strict** (File, Save As, "Strict Open XML Document") uses different URIs such as `http://purl.oclc.org/ooxml/wordprocessingml/main`. Almost every tool, python-docx included, understands only Transitional. If a file has purl.oclc.org namespaces, resave it as a normal `.docx` from Word before processing.

#### Namespaces in ElementTree

ElementTree uses Clark notation: `{uri}localname`. Attributes are the same.

```python
import xml.etree.ElementTree as ET
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

root = ET.fromstring(xml_bytes)
for p in root.iter(W + "p"):
    style = p.find(W + "pPr/" + W + "pStyle")
    if style is not None:
        print(style.get(W + "val"))
for img in root.iter("{http://schemas.openxmlformats.org/drawingml/2006/main}blip"):
    print("image rel:", img.get(R + "embed"))
```

When writing, register prefixes so the output uses `w:` instead of `ns0:`; Word accepts any prefix, but humans reading the diff will not:

```python
ET.register_namespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
```

ElementTree also drops namespace declarations it thinks unused, including those listed in `mc:Ignorable`. That produces a file Word rejects, because `mc:Ignorable="w14"` requires `xmlns:w14` to be declared. lxml preserves declarations and is the safer parser for round-tripping Word files.

#### Namespaces in lxml

```python
from lxml import etree
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
      "a": "http://schemas.openxmlformats.org/drawingml/2006/main"}
root = etree.fromstring(xml_bytes)
for t in root.xpath("//w:p[w:pPr/w:pStyle/@w:val='Heading1']//w:t", namespaces=NS):
    print(t.text)
new = etree.SubElement(rPr, "{%s}b" % NS["w"])            # creates <w:b/> with the right prefix
```

XPath with a namespace map is the most productive way to query OOXML: `//w:tbl`, `//w:sdt[w:sdtPr/w:tag/@w:val='client']`, `//a:blip/@r:embed`, `//w:instrText`.

#### mc:AlternateContent

Newer features are wrapped so older Word versions can skip them:

```xml
<mc:AlternateContent>
  <mc:Choice Requires="wps"> ...DrawingML text box... </mc:Choice>
  <mc:Fallback> ...VML text box... </mc:Fallback>
</mc:AlternateContent>
```

Text inside such a text box therefore appears twice in `document.xml` (once per branch). Text extractors that count words must pick one branch; the Choice branch is the modern one.

> **Tip:** Copy namespace URIs from a real Word file rather than typing them; a single wrong character makes every element "unknown" and Word silently ignores it, which looks like formatting disappearing for no reason.

### Try It Yourself

```python
import xml.etree.ElementTree as ET

NS = {
 "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
 "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
 "wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
 "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
 "pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
}
for k, v in NS.items(): ET.register_namespace(k, v)
xml = '''<w:document xmlns:w="{w}" xmlns:r="{r}" xmlns:wp="{wp}" xmlns:a="{a}" xmlns:pic="{pic}"><w:body>
<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Letterhead</w:t></w:r></w:p>
<w:p><w:r><w:drawing><wp:inline><wp:extent cx="1371600" cy="457200"/><wp:docPr id="1" name="Logo"/>
<a:graphic><a:graphicData uri="{pic}"><pic:pic><pic:blipFill><a:blip r:embed="rId5"/></pic:blipFill></pic:pic></a:graphicData></a:graphic>
</wp:inline></w:drawing></w:r></w:p>
<w:p><w:hyperlink r:id="rId6"><w:r><w:t>stewart.com</w:t></w:r></w:hyperlink></w:p>
</w:body></w:document>'''.format(**NS)

root = ET.fromstring(xml)
# ElementTree accepts a prefix map in find/findall/iterfind
print("headings:", [t.text for t in root.findall(".//w:p[w:pPr/w:pStyle]//w:t", NS)])
for blip in root.iter("{%s}blip" % NS["a"]):
    print("image relationship:", blip.get("{%s}embed" % NS["r"]))
ext = root.find(".//wp:extent", NS)
print("logo size (in):", int(ext.get("cx")) / 914400, "x", int(ext.get("cy")) / 914400)
for h in root.findall(".//w:hyperlink", NS):
    print("hyperlink rel:", h.get("{%s}id" % NS["r"]), "text:", "".join(t.text for t in h.iter("{%s}t" % NS["w"])))
out = ET.tostring(root, encoding="unicode")
print("prefixes preserved:", out[:60])
```

### Quiz

1. Which part of a namespace identifies it?
- [ ] The prefix such as `w:`
- [x] The URI
- [ ] The element name
> Prefixes are local bindings; two files can bind different prefixes to the same URI.

2. `r:embed="rId5"` on `a:blip` refers to:
- [x] A relationship Id in the containing part's .rels file
- [ ] A file named rId5
- [ ] An image index
> The relationship's Target gives the media path.

3. Why is lxml preferred over ElementTree for rewriting Word XML?
- [ ] It is faster to import
- [x] It preserves namespace declarations such as those required by `mc:Ignorable`
- [ ] ElementTree cannot parse namespaces
> ElementTree drops unused declarations, which breaks `mc:Ignorable` and makes Word reject the file.

### Exercises

1. **Namespace census** — Parse a document.xml string and list every distinct namespace URI used by elements and attributes.
<details><summary>Solution</summary>

```python
def namespaces_used(root):
    uris = set()
    for el in root.iter():
        if el.tag.startswith("{"): uris.add(el.tag[1:].split("}")[0])
        for k in el.attrib:
            if k.startswith("{"): uris.add(k[1:].split("}")[0])
    return sorted(uris)
print(namespaces_used(root))
```

</details>

2. **Strict detector** — Write a check that reports whether a document.xml uses Strict (purl.oclc.org) namespaces.
<details><summary>Solution</summary>

```python
def is_strict(xml_bytes):
    return b"http://purl.oclc.org/ooxml/" in xml_bytes[:2000]
```

</details>

### Interview Questions

**Q: What are the main namespaces in a DOCX and what does each cover?**
`w` (wordprocessingml/2006/main) covers the document body, styles, numbering, settings, headers and footers. `r` (officeDocument/2006/relationships) is only for attributes like `r:id` and `r:embed` that point at relationships. `a` (drawingml/2006/main) is DrawingML: pictures, shapes, themes, colours and fonts, shared with Excel and PowerPoint. `wp` wraps drawings for Word (`wp:inline`, `wp:anchor`), `pic` is the picture element, `mc` handles markup compatibility, and `w14`/`w15` are Microsoft extensions for Word 2010 and later features. Package-level files use the content-types and relationships namespaces as defaults.

**Q: What is `mc:Ignorable` and why did a round-trip through ElementTree break a file?**
`mc:Ignorable="w14 w15"` tells consumers that elements in those namespaces may be skipped if unknown. The attribute's value refers to prefixes, so those prefixes must be declared on the root. ElementTree rewrites namespace declarations and drops ones it considers unused; if no `w14:` element survives in the tree, the `xmlns:w14` declaration is removed while `mc:Ignorable` still names it, and Word reports the file as corrupt. lxml preserves the declarations, or you can remove the prefix from `mc:Ignorable` yourself.

**Q: How do Strict and Transitional OOXML differ in practice?**
Transitional is what Word writes by default and what every library understands; it retains legacy constructs such as VML and uses the schemas.openxmlformats.org namespaces. Strict uses purl.oclc.org namespaces, forbids VML and some legacy attributes, and is what ISO 29500 calls the clean profile. Very few tools read Strict; if a client sends one, I resave it from Word as a regular Word Document before any automation, and I mention that Strict is a red flag when the pipeline suddenly fails on one file.

