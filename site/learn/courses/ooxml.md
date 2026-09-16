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

# LEVEL: Intermediate

## styles.xml and style inheritance

Every paragraph and run in a Word document gets its formatting from a chain: document defaults, then the style hierarchy, then direct formatting on the element. `word/styles.xml` holds the first two layers. Understanding the chain is what lets you answer "why is this paragraph 11 pt when the style says 10?" without guessing.

### The three layers

| Layer | Where | Example |
|---|---|---|
| Document defaults | `w:docDefaults` in styles.xml | Calibri 11 pt, 8 pt after, 1.08 line spacing |
| Styles | `w:style` elements, chained by `w:basedOn` | `Heading1` based on `Normal` |
| Direct formatting | `w:pPr` / `w:rPr` on the paragraph or run | a single bold word |

Later layers override earlier ones property by property. A run in a `Heading1` paragraph with direct `w:sz w:val="20"` is 10 pt even though the heading style says 16 pt, but it still inherits the heading's colour and bold.

### Anatomy of styles.xml

```xml
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="22"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/><w:qFormat/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading1Char"/>
    <w:uiPriority w:val="9"/><w:qFormat/>
    <w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="240" w:after="0"/><w:outlineLvl w:val="0"/></w:pPr>
    <w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:hAnsiTheme="majorHAnsi"/><w:color w:val="2F5496" w:themeColor="accent1" w:themeShade="BF"/><w:sz w:val="32"/></w:rPr>
  </w:style>
  <w:style w:type="character" w:styleId="Heading1Char">
    <w:name w:val="Heading 1 Char"/><w:link w:val="Heading1"/>
    <w:rPr><w:rFonts w:asciiTheme="majorHAnsi"/><w:color w:val="2F5496"/><w:sz w:val="32"/></w:rPr>
  </w:style>
</w:styles>
```

Read the important attributes:

- `w:styleId` is what paragraphs reference in `w:pStyle w:val="Heading1"`. It has no spaces and is case sensitive.
- `w:name` is the display name; Word maps the lowercase `heading 1` to the localised "Heading 1" in the UI and it is the key Word uses to recognise **built-in** styles.
- `w:basedOn` sets the parent. Missing means the style inherits only from document defaults.
- `w:next` is the style of the paragraph created when you press Enter.
- `w:link` pairs a paragraph style with its character twin so the style can be applied to a selection inside a paragraph.
- `w:default="1"` marks the style used when a paragraph has no `w:pStyle` (`Normal`) or a run has no `w:rStyle` (`DefaultParagraphFont`).
- `w:qFormat` puts the style in the Quick Styles gallery; `w:uiPriority` sorts it; `w:semiHidden` and `w:unhideWhenUsed` hide it until used.

### Style types

| `w:type` | Applies to | Referenced by |
|---|---|---|
| `paragraph` | whole paragraphs, may carry `w:rPr` for runs | `w:pPr/w:pStyle` |
| `character` | runs | `w:rPr/w:rStyle` |
| `table` | tables, with conditional `w:tblStylePr` for first row, banding | `w:tblPr/w:tblStyle` |
| `numbering` | ties a list definition to a style | `w:pPr/w:pStyle` plus `w:numPr` inside the style |

### Resolving a property in code

To know a paragraph's effective font size you walk the chain yourself. This is what python-docx does not do for you, and what renderers do internally.

```python
def resolve(styles, style_id, tag):
    """Walk basedOn chain until a value for tag is found, else None."""
    seen = set()
    while style_id and style_id not in seen:
        seen.add(style_id)
        st = styles[style_id]
        val = st["rPr"].get(tag)
        if val is not None:
            return val
        style_id = st["basedOn"]
    return None
```

### Latent styles

`w:latentStyles` lists Word's 370-odd built-in styles with their default visibility. Word uses it when a user applies a built-in style that does not yet exist in the file. You rarely need to edit it; leave it alone when creating a minimal `styles.xml`, or copy it from a Word-saved document.

### Common surgery

**Change the body font in every style at once**: edit `w:rPrDefault` and remove any `w:rFonts` that appear in `Normal`. Because most styles are based on `Normal`, one edit changes the whole document, which is the single most useful fix for "the client wants Arial everywhere".

**Remove direct formatting so styles take over**: delete `w:rPr` children such as `w:sz`, `w:rFonts` and `w:color` from runs in `document.xml`. Ali's SOP clean-up script does exactly this on files that arrived from six different authors.

> **Warning:** Deleting a style that paragraphs reference does not corrupt the file, but Word silently falls back to `Normal`, which looks like "all my headings disappeared". Grep `document.xml` for `w:pStyle w:val="X"` before removing style `X`.

### Try It Yourself

```python
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", W)
styles_xml = f'''<w:styles xmlns:w="{W}">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Body"><w:name w:val="Body"/><w:basedOn w:val="Normal"/><w:rPr><w:sz w:val="20"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="1E5AA8"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="SOPTitle"><w:name w:val="SOP Title"/><w:basedOn w:val="Heading1"/><w:rPr><w:sz w:val="40"/></w:rPr></w:style>
</w:styles>'''

root = ET.fromstring(styles_xml)
styles = {}
for st in root.findall(f"{{{W}}}style"):
    sid = st.get(f"{{{W}}}styleId")
    based = st.find(f"{{{W}}}basedOn")
    rpr = st.find(f"{{{W}}}rPr")
    props = {}
    if rpr is not None:
        for child in rpr:
            tag = child.tag.split("}")[1]
            props[tag] = child.get(f"{{{W}}}val", "on")
    styles[sid] = {"basedOn": based.get(f"{{{W}}}val") if based is not None else None, "rPr": props}
defaults = {c.tag.split("}")[1]: c.get(f"{{{W}}}val", "on") for c in root.find(f".//{{{W}}}rPrDefault/{{{W}}}rPr")}

def resolve(sid, tag):
    seen = set()
    while sid and sid not in seen:
        seen.add(sid)
        if tag in styles[sid]["rPr"]:
            return styles[sid]["rPr"][tag], sid
        sid = styles[sid]["basedOn"]
    return defaults.get(tag), "docDefaults"

for sid in ["Body", "Heading1", "SOPTitle"]:
    for tag in ["sz", "b", "color", "rFonts"]:
        val, src = resolve(sid, tag)
        print(f"{sid:9} {tag:7} = {val!s:6} (from {src})")
```

### Quiz

1. Which element defines the parent of a style?
- [ ] `w:next`
- [x] `w:basedOn`
- [ ] `w:link`
> `w:next` is the follow-on paragraph style; `w:link` pairs paragraph and character twins.

2. A run has direct `w:sz w:val="20"` inside a `Heading1` paragraph whose style says `w:sz w:val="32"`. The run renders at…
- [x] 10 pt
- [ ] 16 pt
- [ ] 11 pt
> Direct formatting is the last layer and wins property by property.

3. Where do you change the font for the whole document in one edit?
- [ ] Every `w:rPr` in document.xml
- [x] `w:docDefaults/w:rPrDefault` in styles.xml (removing overrides in Normal)
- [ ] `word/fontTable.xml`
> Most styles chain back to Normal and Normal to the defaults.

### Exercises

1. **Style census** — List every `w:styleId` referenced in a document.xml string that does not exist in styles.xml.
<details><summary>Solution</summary>

```python
def missing_styles(doc_root, styles_root):
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    defined = {s.get(W + "styleId") for s in styles_root.iter(W + "style")}
    used = {e.get(W + "val") for e in doc_root.iter(W + "pStyle")} | {e.get(W + "val") for e in doc_root.iter(W + "rStyle")}
    return sorted(used - defined)
```

</details>

2. **Chain printer** — Print the inheritance chain for a style id, e.g. `SOPTitle -> Heading1 -> Normal -> docDefaults`.
<details><summary>Solution</summary>

```python
def chain(styles, sid):
    out = []
    while sid:
        out.append(sid)
        sid = styles[sid]["basedOn"]
    return " -> ".join(out + ["docDefaults"])
print(chain(styles, "SOPTitle"))
```

</details>

### Interview Questions

**Q: Explain how Word decides the final formatting of a run.**
It starts with `w:docDefaults` in styles.xml, applies the paragraph style chain from the root of the `w:basedOn` tree down to the paragraph's `w:pStyle`, then the character style referenced by `w:rStyle`, then the paragraph's direct `w:pPr/w:rPr` (which only affects the paragraph mark) and finally the run's direct `w:rPr`. Each layer overrides individual properties, not the whole set, so a run can inherit colour from the heading style while overriding size directly. Table styles add conditional formatting layers such as first row and banded rows before the paragraph layer. When I debug "wrong font" complaints I print this chain for the run, and the culprit is almost always direct formatting pasted from another document.

**Q: What is the difference between `w:styleId` and `w:name`, and why does it matter for automation?**
`w:styleId` is the internal key referenced by `w:pStyle` and `w:rStyle`; `w:name` is the display name and, for built-in styles, the identity Word uses to recognise them (the lowercase `heading 1`). Word generates ids by stripping spaces from names, but a localised Word or a converter can produce ids like `berschrift1` for German headings while keeping `w:name` as `heading 1`. Automation that matches on ids breaks on such files; matching on `w:name` is robust, which is why python-docx exposes names and looks up ids internally.

**Q: A client's SOP has 40 slightly different "Heading 1" looks. How do you normalise it?**
The variations come from direct formatting layered over the style. I write a script that, for every paragraph with `w:pStyle w:val="Heading1"`, strips `w:rPr` children like `w:sz`, `w:rFonts`, `w:color` and `w:b` from its runs and removes paragraph-level `w:spacing` and `w:ind`, then fixes `Heading1` in styles.xml to the brand spec. If some headings were formatted manually without the style, I detect them by run properties (bold, size 32) and assign `Heading1`. The result is a document where the client changes the heading style once and every heading follows, which is the whole point of styles.

## numbering.xml: how lists really work

Bullets and numbered lists are not stored on the paragraph. A paragraph only says "I am level 1 of list number 3" through `w:numPr`, and `word/numbering.xml` defines what list 3 looks like. This indirection is why copying a numbered paragraph between documents can renumber it, and why "restart numbering" is such a common support ticket.

### Two-level indirection: abstractNum and num

```xml
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:multiLevelType w:val="hybridMultilevel"/>
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
    </w:lvl>
    <w:lvl w:ilvl="1">
      <w:start w:val="1"/><w:numFmt w:val="lowerLetter"/><w:lvlText w:val="%2)"/><w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="1440" w:hanging="360"/></w:pPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="2"><w:abstractNumId w:val="0"/>
    <w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride>
  </w:num>
</w:numbering>
```

- `w:abstractNum` is the **definition**: up to nine `w:lvl` levels with format, text pattern, indent and run properties.
- `w:num` is an **instance** that paragraphs reference by `w:numId`. Several instances can share one abstract definition, and each instance keeps its own counter.
- `w:lvlOverride` with `w:startOverride` is how Word implements "Restart at 1": a new `w:num` pointing at the same abstract definition.

The paragraph side:

```xml
<w:p>
  <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr>
  <w:r><w:t>Verify grantor name on the vesting deed</w:t></w:r>
</w:p>
```

### The lvl element in detail

| Child | Meaning | Example |
|---|---|---|
| `w:start` | first number | `1` |
| `w:numFmt` | `decimal`, `lowerLetter`, `upperRoman`, `bullet`, `none`, `decimalZero` | `lowerRoman` |
| `w:lvlText` | pattern; `%1` is level 1's number, `%2` level 2's | `%1.%2` for "3.2" |
| `w:lvlJc` | alignment of the number | `left`, `right` (for right-aligned roman numerals) |
| `w:pPr/w:ind` | indent; `w:hanging` puts the number in the margin | `left=720 hanging=360` |
| `w:rPr` | formatting of the number/bullet only | `w:rFonts w:ascii="Symbol"` for bullets |
| `w:pStyle` | link the level to a paragraph style | `ListNumber` |
| `w:isLgl` | show all levels as decimal regardless of their format | legal numbering |

Bullets are simply a level with `w:numFmt w:val="bullet"` and `w:lvlText w:val=""` (the private-use character U+F0B7 from the Symbol font). The Wingdings squares and check marks you see in SOPs are the same mechanism with different `w:rFonts`.

### Why lists renumber when copied

Paragraphs carry only `numId`. Pasting into another document brings the definition along and gives it a fresh `numId`, but two lists that happened to share one `w:num` in the source now continue each other's count. When you generate documents, always allocate one `w:num` per logical list and never reuse a `numId` for unrelated lists.

### Numbering through styles

Instead of `w:numPr` on every paragraph, a paragraph style can carry it:

```xml
<w:style w:type="paragraph" w:styleId="Heading1">
  <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr><w:outlineLvl w:val="0"/></w:pPr>
</w:style>
```

with the level in the abstract definition pointing back: `<w:pStyle w:val="Heading1"/>`. This is how "1. Purpose / 1.1 Scope" heading numbering is done in every policy manual, and it survives users applying the style from the gallery.

### Finding and fixing broken numbering

Typical symptoms and their XML cause:

- **Every item shows "1."**: each paragraph references a different `w:num`.
- **List continues from a previous list**: same `numId` reused; add a new `w:num` with `startOverride`.
- **Number appears but no indent**: `w:lvl` lacks `w:pPr/w:ind`; paragraph has direct `w:ind w:left="0"`.
- **Bullet shows as a box**: `w:rPr/w:rFonts` on the level names a font not installed (usually Symbol on Linux).

> **Interview note:** "Where does Word store list numbering?" is a classic. The answer they want: not on the paragraph; `numPr` points to a `num` instance which points to an `abstractNum` definition in numbering.xml, and restart is an override on the instance.

### Try It Yourself

```python
import xml.etree.ElementTree as ET, zipfile, io

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", W)
numbering = f'''<w:numbering xmlns:w="{W}">
<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="multilevel"/>
 <w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl>
 <w:lvl w:ilvl="1"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1.%2"/><w:pPr><w:ind w:left="1440" w:hanging="360"/></w:pPr></w:lvl>
</w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
<w:num w:numId="2"><w:abstractNumId w:val="0"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>
</w:numbering>'''

paras = [(1, 0, "Purpose"), (1, 1, "Scope"), (1, 1, "Audience"), (1, 0, "Procedure"), (2, 0, "Appendix list restarts")]
doc = f'<w:document xmlns:w="{W}"><w:body>' + "".join(
    f'<w:p><w:pPr><w:numPr><w:ilvl w:val="{lvl}"/><w:numId w:val="{nid}"/></w:numPr></w:pPr><w:r><w:t>{t}</w:t></w:r></w:p>'
    for nid, lvl, t in paras) + "</w:body></w:document>"

# Simulate Word's counters to render the visible numbers
root = ET.fromstring(numbering)
abstract = {a.get(f"{{{W}}}abstractNumId"): a for a in root.iter(f"{{{W}}}abstractNum")}
nums = {n.get(f"{{{W}}}numId"): n.find(f"{{{W}}}abstractNumId").get(f"{{{W}}}val") for n in root.iter(f"{{{W}}}num")}
counters = {}
for p in ET.fromstring(doc).iter(f"{{{W}}}p"):
    npr = p.find(f"{{{W}}}pPr/{{{W}}}numPr")
    nid, lvl = npr.find(f"{{{W}}}numId").get(f"{{{W}}}val"), int(npr.find(f"{{{W}}}ilvl").get(f"{{{W}}}val"))
    c = counters.setdefault(nid, [0] * 9)
    c[lvl] += 1
    for deeper in range(lvl + 1, 9): c[deeper] = 0
    lvl_el = abstract[nums[nid]].findall(f"{{{W}}}lvl")[lvl]
    text = lvl_el.find(f"{{{W}}}lvlText").get(f"{{{W}}}val")
    for i in range(9): text = text.replace(f"%{i+1}", str(c[i]))
    print(f"{'  ' * lvl}{text} {p.find(f'.//{{{W}}}t').text}")

# Package the two parts to prove they zip cleanly
buf = io.BytesIO()
with zipfile.ZipFile(buf, "w") as z:
    z.writestr("word/numbering.xml", numbering); z.writestr("word/document.xml", doc)
print("package bytes:", len(buf.getvalue()))
```

### Quiz

1. What does a paragraph store to say it is part of a list?
- [ ] The bullet character
- [x] `w:numPr` with `w:ilvl` and `w:numId`
- [ ] A reference to `w:abstractNum`
> The paragraph references a `w:num` instance, which references the abstract definition.

2. How does Word implement "Restart numbering at 1"?
- [x] A new `w:num` with a `w:lvlOverride/w:startOverride`
- [ ] Editing `w:start` in the abstract definition
- [ ] A `w:restart` attribute on the paragraph
> Overrides live on the instance so other lists sharing the definition are unaffected.

3. Which `w:lvlText` produces "2.3" style numbers on level 2?
- [ ] `%2.%3`
- [x] `%1.%2`
- [ ] `%1.`
> `%1` is level 1's counter and `%2` is level 2's; the pattern is written on the level-2 `w:lvl`.

### Exercises

1. **List instances** — Count how many distinct `w:numId` values a document.xml uses and how many `w:num` elements numbering.xml defines; report unused definitions.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
used = {e.get(W + "val") for e in doc_root.iter(W + "numId")}
defined = {n.get(W + "numId") for n in num_root.iter(W + "num")}
print("used:", len(used), "defined:", len(defined), "unused:", sorted(defined - used))
```

</details>

2. **Restart helper** — Write a function that adds a new `w:num` restarting a given abstract definition and returns its new numId.
<details><summary>Solution</summary>

```python
def add_restart(num_root, abstract_id):
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    ids = [int(n.get(W + "numId")) for n in num_root.iter(W + "num")]
    new_id = str(max(ids, default=0) + 1)
    num = ET.SubElement(num_root, W + "num", {W + "numId": new_id})
    ET.SubElement(num, W + "abstractNumId", {W + "val": str(abstract_id)})
    ov = ET.SubElement(num, W + "lvlOverride", {W + "ilvl": "0"})
    ET.SubElement(ov, W + "startOverride", {W + "val": "1"})
    return new_id
```

</details>

### Interview Questions

**Q: Why do numbered lists sometimes continue from an earlier list after a copy-paste, and how do you fix it in the XML?**
Because numbering state is not on the paragraph; the paragraph's `w:numPr/w:numId` points at a `w:num` instance whose counter is shared by every paragraph referencing it. When two logically separate lists share one `numId`, the second continues where the first stopped. The XML fix is to create a new `w:num` that references the same `w:abstractNumId` and carries a `w:lvlOverride ilvl="0"` with `w:startOverride val="1"`, then point the second list's paragraphs at the new id. That is exactly what Word does when you click "Restart at 1", which is why numbering.xml in a long-edited document contains dozens of near-identical `w:num` entries.

**Q: How would you implement legal-style heading numbering (1, 1.1, 1.1.1) that users cannot break?**
Define one `w:abstractNum` with `w:multiLevelType w:val="multilevel"`, levels whose `w:lvlText` are `%1`, `%1.%2` and `%1.%2.%3`, and a `w:pStyle` on each level pointing at `Heading1`, `Heading2`, `Heading3`. In styles.xml give each heading style a `w:numPr` referencing a single `w:num` for that definition. Users then get numbers by applying the style and cannot accidentally create a second list, and the TOC picks up the numbers automatically. I set `w:isLgl` only when the client wants every level as decimals even if a level's own format is roman.

**Q: A bullet renders as an empty box on Linux and fine on Windows. What is happening?**
The bullet level's `w:rPr/w:rFonts` names Symbol or Wingdings and `w:lvlText` is a private-use character such as U+F0B7 that only that font maps to a glyph. Linux without those fonts substitutes another font that has no glyph at that code point, so a box appears. Fixes are to install the Microsoft core fonts or metric-compatible equivalents, or to change the level to a Unicode bullet U+2022 with a normal font, which I do in generated documents so they render identically in LibreOffice conversions.

## Sections (sectPr) and page setup

Page size, orientation, margins, columns, header and footer references and page numbering all live in **section properties**, `w:sectPr`. A document always has at least one section, and every extra section is a place where any of these can change. Understanding where `w:sectPr` sits in the XML explains most "my landscape page lost its header" tickets.

### Where sectPr lives

- The **last section** of the document stores its `w:sectPr` as the final child of `w:body`.
- Every **other section** stores its `w:sectPr` inside the `w:pPr` of the last paragraph of that section.

```xml
<w:body>
  <w:p><w:r><w:t>Chapter 1 text</w:t></w:r></w:p>
  <w:p>
    <w:pPr>
      <w:sectPr>                                   <!-- ends section 1 -->
        <w:type w:val="nextPage"/>
        <w:pgSz w:w="12240" w:h="15840"/>
        <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
      </w:sectPr>
    </w:pPr>
  </w:p>
  <w:p><w:r><w:t>Landscape appendix</w:t></w:r></w:p>
  <w:sectPr>                                       <!-- final section -->
    <w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/>
    <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
  </w:sectPr>
</w:body>
```

That paragraph-embedded `w:sectPr` is why deleting "the section break" in Word means deleting the paragraph mark, and why a section's properties describe the content **before** the break, not after.

### The children of sectPr

| Element | Purpose | Notes |
|---|---|---|
| `w:type` | how the section starts: `nextPage`, `continuous`, `oddPage`, `evenPage`, `nextColumn` | default `nextPage` |
| `w:pgSz` | `w:w`, `w:h` in twips, `w:orient="landscape"` | Letter 12240×15840, A4 11906×16838 |
| `w:pgMar` | margins plus `w:header`/`w:footer` distance from edge and `w:gutter` | all twips |
| `w:cols` | `w:num`, `w:space`, `w:equalWidth`, optional `w:col` children | columns |
| `w:headerReference` / `w:footerReference` | `w:type="default|first|even"` and `r:id` | the link to header parts |
| `w:titlePg` | enable the "first" header/footer | presence is enough |
| `w:pgNumType` | `w:fmt="lowerRoman"`, `w:start="1"`, `w:chapStyle` | page number format and restart |
| `w:docGrid` | line grid for East Asian layout | `w:linePitch="360"` is Word's default |
| `w:lnNumType` | line numbering for legal drafts | `w:countBy="1" w:restart="continuous"` |
| `w:vAlign` | vertical alignment on the page | `center` for cover pages |
| `w:footnotePr` / `w:endnotePr` | per-section footnote numbering | restart per section |

Orientation is only a flag; you must swap `w:w` and `w:h` yourself. A landscape section with `w:orient="landscape"` but portrait dimensions prints portrait.

### Section inheritance

Headers and footers do **not** cascade in the XML. If a section has no `w:headerReference`, Word displays the previous section's header, which is what "Link to Previous" means in the ribbon. Generators that create a new section for a landscape page and omit the references therefore appear to work in Word, but LibreOffice and some converters render a blank header. Copy the references explicitly.

Page size and margins likewise do not inherit: every `w:sectPr` must carry its own `w:pgSz` and `w:pgMar`, otherwise Word applies its defaults (Letter with 1-inch margins in US locales).

### Page numbering across sections

Roman numerals for front matter and decimals starting at 1 for the body is two sections:

```xml
<w:sectPr>  <!-- front matter -->
  <w:pgNumType w:fmt="lowerRoman" w:start="1"/> ...
</w:sectPr>
<w:sectPr>  <!-- body -->
  <w:pgNumType w:fmt="decimal" w:start="1"/> ...
</w:sectPr>
```

The `PAGE` field in the footer renders according to the section it is on; `NUMPAGES` always counts the whole document, `SECTIONPAGES` counts the current section.

### Continuous sections and columns

A `w:type w:val="continuous"` break is how a two-column glossary sits under a full-width heading. The columns are declared in the section **after** the break with `w:cols w:num="2" w:space="720"`. A continuous section cannot change page size or orientation; Word silently promotes it to `nextPage` if you try.

> **Warning:** A `w:sectPr` inside a paragraph that also contains text is legal, but Word shows the section break mark at the end of that text. Generators usually emit an empty paragraph holding the `w:sectPr` so the break is easy to see and delete.

### Try It Yourself

```python
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
ET.register_namespace("w", W); ET.register_namespace("r", R)

doc = f'''<w:document xmlns:w="{W}" xmlns:r="{R}"><w:body>
<w:p><w:r><w:t>Front matter</w:t></w:r></w:p>
<w:p><w:pPr><w:sectPr><w:headerReference w:type="default" r:id="rId7"/><w:type w:val="nextPage"/>
  <w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
  <w:pgNumType w:fmt="lowerRoman" w:start="1"/></w:sectPr></w:pPr></w:p>
<w:p><w:r><w:t>Body chapter 1</w:t></w:r></w:p>
<w:p><w:pPr><w:sectPr><w:headerReference w:type="default" r:id="rId7"/><w:type w:val="nextPage"/>
  <w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
  <w:pgNumType w:fmt="decimal" w:start="1"/></w:sectPr></w:pPr></w:p>
<w:p><w:r><w:t>Appendix A rate matrix</w:t></w:r></w:p>
<w:sectPr><w:type w:val="nextPage"/><w:pgSz w:w="15840" w:h="12240" w:orient="landscape"/>
  <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>
</w:body></w:document>'''

root = ET.fromstring(doc)
body = root.find(f"{{{W}}}body")
sections = list(body.iter(f"{{{W}}}sectPr"))
print("sections:", len(sections))
for i, s in enumerate(sections, 1):
    pg = s.find(f"{{{W}}}pgSz"); num = s.find(f"{{{W}}}pgNumType"); hdr = s.find(f"{{{W}}}headerReference")
    w_in, h_in = int(pg.get(f"{{{W}}}w")) / 1440, int(pg.get(f"{{{W}}}h")) / 1440
    print(f"  section {i}: {w_in:.1f}x{h_in:.1f} in, orient={pg.get(f'{{{W}}}orient', 'portrait')}, "
          f"numbering={num.get(f'{{{W}}}fmt') if num is not None else 'inherit'}, header={'yes' if hdr is not None else 'NONE (blank in LibreOffice)'}")

# Fix: copy the header reference from the previous section into the last one
last = sections[-1]
if last.find(f"{{{W}}}headerReference") is None:
    last.insert(0, ET.fromstring(ET.tostring(sections[-2].find(f"{{{W}}}headerReference"))))
    print("added headerReference to final section")
print(ET.tostring(last, encoding="unicode")[:120])
```

### Quiz

1. Where is the `w:sectPr` of the last section stored?
- [x] As the final child of `w:body`
- [ ] In the last paragraph's `w:pPr`
- [ ] In settings.xml
> Only non-final sections store their properties inside the last paragraph.

2. What happens if a new section has no `w:headerReference`?
- [ ] Word shows an error
- [x] Word shows the previous section's header ("Link to Previous"); other renderers may show none
- [ ] The header is deleted document-wide
> References do not cascade in the XML; Word's behaviour is a convenience.

3. To make a section landscape you must…
- [ ] set `w:orient="landscape"` only
- [x] set `w:orient="landscape"` and swap `w:w` and `w:h`
- [ ] set `w:pgMar` to landscape
> The orientation flag does not resize the page.

### Exercises

1. **Section report** — For a document.xml string, print each section's page size in inches, orientation and column count.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
for i, s in enumerate(root.iter(W + "sectPr"), 1):
    pg, cols = s.find(W + "pgSz"), s.find(W + "cols")
    print(i, int(pg.get(W + "w")) / 1440, int(pg.get(W + "h")) / 1440, pg.get(W + "orient", "portrait"), cols.get(W + "num", "1") if cols is not None else "1")
```

</details>

2. **Margin normaliser** — Set every section's margins to 0.75 inch without touching anything else.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
for s in root.iter(W + "sectPr"):
    m = s.find(W + "pgMar")
    for side in ("top", "right", "bottom", "left"):
        m.set(W + side, "1080")
```

</details>

### Interview Questions

**Q: Explain how section properties are stored and why it matters for automation.**
A document's final section stores its `w:sectPr` at the end of `w:body`; every earlier section stores it inside the `w:pPr` of its last paragraph, so the properties describe the content that precedes the break. For automation that means inserting a section break is inserting a paragraph with a `w:sectPr`, and deleting one merges the preceding content into the following section's layout, not the other way round. It also means nothing inherits: page size, margins and header references must be written on every `w:sectPr`, or Word applies defaults and converters render blank headers, which is the most common bug in generated documents with landscape appendices.

**Q: How do you get roman numerals in the front matter and decimals starting at 1 in the body?**
Two sections: the front matter's `w:sectPr` has `w:pgNumType w:fmt="lowerRoman" w:start="1"` and the body's has `w:fmt="decimal" w:start="1"`. Both footers contain a `PAGE` field, which formats itself according to the section it is rendered in. If the client also wants "Page x of y" within the body only, the second field must be `SECTIONPAGES`, not `NUMPAGES`, because `NUMPAGES` counts the whole document including the front matter. I always verify by converting to PDF and checking the page label on the first body page.

**Q: What is a continuous section break used for and what can it not do?**
It changes layout properties mid-page: column count, margins, line numbering, footnote restart, or a different header from that point on. It cannot change page size or orientation, since those describe the physical page; Word converts such a break to `nextPage` silently. The classic use in Ali's handbooks is a two-column glossary under a full-width heading: a `continuous` break after the heading, then `w:cols w:num="2"`, then another `continuous` break back to one column.

## Headers, footers and relationships

Headers and footers are separate parts, `word/header1.xml` and `word/footer1.xml`, connected to a section through relationships. Three files must agree for a header to appear: the part itself, `word/_rels/document.xml.rels` declaring it, `[Content_Types].xml` giving its content type, and the `w:headerReference` in `w:sectPr`. Miss one and Word either shows nothing or reports a corrupt file.

### The four pieces

**1. The part** (`word/header1.xml`):

```xml
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p><w:pPr><w:pStyle w:val="Header"/></w:pPr>
    <w:r><w:t>Stewart Title – Production SOP</w:t></w:r></w:p>
</w:hdr>
```

The root is `w:hdr` for headers and `w:ftr` for footers. Inside, the content is ordinary block content: paragraphs, tables, drawings.

**2. The relationship** (`word/_rels/document.xml.rels`):

```xml
<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
<Relationship Id="rId8" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
```

`Target` is relative to the `word/` folder because the source part is `word/document.xml`.

**3. The content type** (`[Content_Types].xml`):

```xml
<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
```

**4. The reference** in the section:

```xml
<w:sectPr>
  <w:headerReference w:type="default" r:id="rId7"/>
  <w:footerReference w:type="default" r:id="rId8"/>
  <w:titlePg/>
</w:sectPr>
```

### The three header types

| `w:type` | Shown on | Requires |
|---|---|---|
| `default` | every page (odd pages when even headers are on) | nothing |
| `first` | first page of the section | `w:titlePg` in the same `w:sectPr` |
| `even` | even pages | `w:evenAndOddHeaders` in `settings.xml` |

A `first` reference without `w:titlePg` is ignored, which is the number one cause of "my cover page still shows the header".

### Page numbers inside a footer

Page numbers are fields, covered fully at the Advanced level, but a footer needs the simple form now:

```xml
<w:p><w:pPr><w:jc w:val="center"/></w:pPr>
  <w:r><w:t xml:space="preserve">Page </w:t></w:r>
  <w:fldSimple w:instr="PAGE"><w:r><w:t>1</w:t></w:r></w:fldSimple>
  <w:r><w:t xml:space="preserve"> of </w:t></w:r>
  <w:fldSimple w:instr="NUMPAGES"><w:r><w:t>1</w:t></w:r></w:fldSimple>
</w:p>
```

The `w:t` inside the field is the cached result; Word recalculates on open or print.

### Header parts have their own relationships

A logo in a header is an image referenced from `word/_rels/header1.xml.rels`, **not** from `document.xml.rels`. Each part that references something has its own `.rels` file beside it. Copying a header between documents therefore means copying the part, its `.rels`, and every target the `.rels` mentions.

### Adding a header with Python

```python
import zipfile, shutil

def add_header(src, dst, text):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "[Content_Types].xml":
                data = data.replace(b"</Types>", b'<Override PartName="/word/header9.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/></Types>')
            elif item.filename == "word/_rels/document.xml.rels":
                data = data.replace(b"</Relationships>", b'<Relationship Id="rIdHdr9" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header9.xml"/></Relationships>')
            elif item.filename == "word/document.xml":
                data = data.replace(b"<w:sectPr>", b'<w:sectPr><w:headerReference w:type="default" r:id="rIdHdr9"/>', 1)
            zout.writestr(item, data)
        zout.writestr("word/header9.xml", f'<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:r><w:t>{text}</w:t></w:r></w:p></w:hdr>')
```

Byte replacement is crude but illustrates the four edits; the Expert level does the same with lxml and proper id allocation. Note the relationship id must be unique within that `.rels` file only, which is why a distinctive id like `rIdHdr9` avoids clashes with Word's `rId1..rIdN`.

### Header and footer distance

`w:pgMar w:header="720" w:footer="720"` sets the distance from the page edge to the header and footer text, separate from the body margin. A header that grows (two-line letterhead) pushes body text down automatically; a fixed-height footer with a logo needs the body's bottom margin large enough to leave room, or Word overlaps them.

> **Tip:** When a client reports "the header is different on page 3", look for a second `w:sectPr` between pages 2 and 3 with its own `w:headerReference`, or none at all. Diffing the two `w:sectPr` blocks answers it in seconds.

### Try It Yourself

```python
import zipfile, io, xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
CT = "http://schemas.openxmlformats.org/package/2006/content-types"
PR = "http://schemas.openxmlformats.org/package/2006/relationships"

parts = {
 "[Content_Types].xml": f'<Types xmlns="{CT}"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
   f'<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
   f'<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'
   f'<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>',
 "_rels/.rels": f'<Relationships xmlns="{PR}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
 "word/_rels/document.xml.rels": f'<Relationships xmlns="{PR}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>'
   f'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>',
 "word/header1.xml": f'<w:hdr xmlns:w="{W}"><w:p><w:r><w:t>Stewart Title – Production SOP</w:t></w:r></w:p></w:hdr>',
 "word/footer1.xml": f'<w:ftr xmlns:w="{W}"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t xml:space="preserve">Page </w:t></w:r><w:fldSimple w:instr="PAGE"><w:r><w:t>1</w:t></w:r></w:fldSimple></w:p></w:ftr>',
 "word/document.xml": f'<w:document xmlns:w="{W}" xmlns:r="{R}"><w:body><w:p><w:r><w:t>Body</w:t></w:r></w:p>'
   f'<w:sectPr><w:headerReference w:type="default" r:id="rId1"/><w:footerReference w:type="default" r:id="rId2"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>',
}
buf = io.BytesIO()
with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
    for name, xml in parts.items(): z.writestr(name, xml)

# Verify the chain: sectPr reference -> rels target -> part exists -> content type declared
with zipfile.ZipFile(io.BytesIO(buf.getvalue())) as z:
    names = set(z.namelist())
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("word/_rels/document.xml.rels"))}
    types = {o.get("PartName") for o in ET.fromstring(z.read("[Content_Types].xml")) if o.tag.endswith("Override")}
    doc = ET.fromstring(z.read("word/document.xml"))
    for ref in doc.iter():
        if ref.tag in (f"{{{W}}}headerReference", f"{{{W}}}footerReference"):
            rid = ref.get(f"{{{R}}}id"); target = "word/" + rels[rid]
            print(ref.tag.split("}")[1], ref.get(f"{{{W}}}type"), rid, "->", target,
                  "part:", target in names, "content-type:", "/" + target in types)
print("package size:", len(buf.getvalue()), "bytes")
```

### Quiz

1. A `w:headerReference w:type="first"` shows on the first page only if…
- [ ] it is listed first in `w:sectPr`
- [x] the same `w:sectPr` contains `w:titlePg`
- [ ] settings.xml has `w:evenAndOddHeaders`
> `w:titlePg` enables the first-page header/footer for that section.

2. Where is a logo used inside `header1.xml` registered?
- [ ] `word/_rels/document.xml.rels`
- [x] `word/_rels/header1.xml.rels`
- [ ] `[Content_Types].xml` only
> Every part has its own relationships file for the things it references.

3. Which of these is NOT required for a header to work?
- [ ] An Override in `[Content_Types].xml`
- [ ] A relationship in `document.xml.rels`
- [x] An entry in `settings.xml`
> Settings only matter for even/odd headers.

### Exercises

1. **Orphan finder** — List header/footer parts in a package that no `w:sectPr` references.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"; R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("word/_rels/document.xml.rels"))}
used = {rels[e.get(R + "id")] for e in doc.iter() if e.tag in (W + "headerReference", W + "footerReference")}
parts = [n[5:] for n in z.namelist() if n.startswith("word/header") or n.startswith("word/footer")]
print("orphans:", sorted(set(parts) - used))
```

</details>

2. **Enable a cover page** — Given a `w:sectPr` element, add `w:titlePg` if missing and a `first` header reference pointing at a given rId.
<details><summary>Solution</summary>

```python
def enable_first_page(sect, rid):
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"; R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
    if sect.find(W + "titlePg") is None: ET.SubElement(sect, W + "titlePg")
    ref = ET.Element(W + "headerReference", {W + "type": "first", R + "id": rid})
    sect.insert(0, ref)
```

</details>

### Interview Questions

**Q: List everything that must exist for a footer to appear on a page.**
The footer part `word/footerN.xml` with a `w:ftr` root; an `Override` in `[Content_Types].xml` mapping that part name to the footer content type; a `Relationship` of type `.../relationships/footer` in `word/_rels/document.xml.rels` whose `Target` is the part; and a `w:footerReference` with the matching `r:id` and a `w:type` inside the `w:sectPr` of the section that should show it. If the type is `first`, the section also needs `w:titlePg`; if `even`, settings.xml needs `w:evenAndOddHeaders`. Anything the footer references, such as a logo, needs its own `word/_rels/footerN.xml.rels`. I check these four in that order when a footer is missing, because a missing content type shows as a corrupt-file dialog while a missing reference shows as a silent blank.

**Q: How do you copy a letterhead header from one document to another programmatically?**
Copy the header part and its `.rels` file, then every target those relationships point at, typically `media/logo.png`, renaming them if names clash. Add content type entries for the new parts, add a header relationship in the destination's `document.xml.rels` with a fresh id, and insert a `w:headerReference` into the target `w:sectPr`. If the header uses paragraph or character styles that the destination lacks, copy those `w:style` elements too, or the text falls back to Normal. python-docx does not do this, which is why Ali keeps a small lxml script for exactly this job when merging branded templates.

**Q: Why might the same document show a different header in Word and in LibreOffice?**
Because a section has no `w:headerReference` of its own. Word implements "Link to Previous" by displaying the preceding section's header when a reference is missing, whereas LibreOffice and several converters treat a missing reference as "no header". The XML is technically valid either way. Generators should always write explicit references on every section; when fixing an existing file I copy the previous section's reference elements into any `w:sectPr` that lacks them.

## Images and media parts

A picture in a Word document is three things: the binary file under `word/media/`, a relationship from the part that uses it, and a `w:drawing` element in a run that positions it and says how big it should be. The XML is verbose because DrawingML is shared with Excel and PowerPoint, but only a few values ever change.

### The media part and its relationship

```
word/media/image1.png
word/_rels/document.xml.rels:
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/>
[Content_Types].xml:
  <Default Extension="png" ContentType="image/png"/>
```

Images use a `Default` by extension rather than a per-part `Override`. Add a `Default` for each extension you use: `png`, `jpeg` (Word writes `jpeg` even for `.jpg`), `gif`, `emf`, `svg`.

### The inline drawing

```xml
<w:r>
  <w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0">
      <wp:extent cx="1371600" cy="457200"/>
      <wp:docPr id="1" name="Picture 1" descr="Company logo"/>
      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:nvPicPr><pic:cNvPr id="0" name="logo.png"/><pic:cNvPicPr/></pic:nvPicPr>
            <pic:blipFill><a:blip r:embed="rId5"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
            <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1371600" cy="457200"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing>
</w:r>
```

The values that matter:

| Element | Meaning |
|---|---|
| `wp:extent cx cy` | displayed size in **EMUs** (914400 per inch, 360000 per cm); 1371600 × 457200 is 1.5 × 0.5 inch |
| `wp:docPr id name descr` | unique id per document, name shown in the selection pane, `descr` is the alt text |
| `a:blip r:embed` | relationship id of the media part; `r:link` instead means a linked, not embedded, file |
| `a:ext cx cy` inside `a:xfrm` | must match `wp:extent` or Word shows a distorted picture |
| `a:srcRect l t r b` | cropping in thousandths of a percent |

`wp:docPr/@id` must be unique across the whole document including headers. Duplicate ids are a classic cause of "Word found unreadable content".

### Anchored (floating) images

Replace `wp:inline` with `wp:anchor` to float the picture with text wrapping:

```xml
<wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="251658240" behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1">
  <wp:simplePos x="0" y="0"/>
  <wp:positionH relativeFrom="page"><wp:posOffset>457200</wp:posOffset></wp:positionH>
  <wp:positionV relativeFrom="page"><wp:posOffset>457200</wp:posOffset></wp:positionV>
  <wp:extent cx="1371600" cy="457200"/>
  <wp:wrapNone/>
  <wp:docPr id="2" name="Watermark"/>
  <a:graphic>...</a:graphic>
</wp:anchor>
```

`behindDoc="1"` with `wp:wrapNone` is a watermark; `wp:wrapSquare wrapText="bothSides"` is a floated figure; `relativeFrom="page"` versus `"margin"` versus `"paragraph"` decides what the offset is measured from.

### Replacing an image without touching the XML

Because the drawing only references `rId5`, swapping a logo across a 21-template suite is a binary replacement of `word/media/image1.png` with a file of the same aspect ratio. If the aspect ratio differs, update `wp:extent` and `a:ext` too or the new logo stretches.

```python
import zipfile
with zipfile.ZipFile("template.docx") as zin, zipfile.ZipFile("rebranded.docx", "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = open("new_logo.png", "rb").read() if item.filename == "word/media/image1.png" else zin.read(item.filename)
        zout.writestr(item, data)
```

### Image size versus display size

Word never resamples on insert: a 4000 × 1333 px logo displayed at 1.5 inches is still 4000 px in the ZIP. `w:settings` can carry `w:doNotCompressPictures` or a default DPI, but the reliable fix is resizing the file before it goes into `media/`. Ali's rebrand script checks each image's pixel size against its `wp:extent` and warns when the effective DPI exceeds 300.

### EMF, WMF and SVG

Vector logos arrive as EMF or SVG. Word 2016+ embeds SVG with a PNG fallback: the `a:blip` references the PNG and an `a:extLst` extension (`asvg:svgBlip r:embed="rId6"`) references the SVG. Older readers use the PNG; new Word renders the SVG. If you strip the extension the SVG is lost but the file still opens.

> **Warning:** `w:drawing` must be inside a `w:r`. A drawing placed directly inside `w:p` is invalid and Word refuses the file. The same applies to the legacy `w:pict` VML element.

### Try It Yourself

```python
import zipfile, io, struct, xml.etree.ElementTree as ET

# Build a tiny valid 1x1 PNG in memory
def png_1x1():
    import zlib
    def chunk(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    idat = zlib.compress(b"\x00\x1e\x5a\xa8")
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
WP = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
PIC = "http://schemas.openxmlformats.org/drawingml/2006/picture"
EMU = 914400
cx, cy = int(1.5 * EMU), int(0.5 * EMU)
drawing = f'''<w:drawing xmlns:w="{W}" xmlns:r="{R}" xmlns:wp="{WP}" xmlns:a="{A}" xmlns:pic="{PIC}"><wp:inline><wp:extent cx="{cx}" cy="{cy}"/><wp:docPr id="1" name="Logo" descr="Company logo"/>
<a:graphic><a:graphicData uri="{PIC}"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="logo.png"/><pic:cNvPicPr/></pic:nvPicPr>
<pic:blipFill><a:blip r:embed="rId5"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>'''

buf = io.BytesIO()
with zipfile.ZipFile(buf, "w") as z:
    z.writestr("word/media/image1.png", png_1x1())
    z.writestr("word/_rels/document.xml.rels", f'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/></Relationships>')
    z.writestr("word/document.xml", f'<w:document xmlns:w="{W}"><w:body><w:p><w:r>{drawing}</w:r></w:p></w:body></w:document>')

with zipfile.ZipFile(io.BytesIO(buf.getvalue())) as z:
    doc = ET.fromstring(z.read("word/document.xml"))
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("word/_rels/document.xml.rels"))}
    for blip in doc.iter(f"{{{A}}}blip"):
        rid = blip.get(f"{{{R}}}embed"); target = "word/" + rels[rid]
        data = z.read(target)
        w_px, h_px = struct.unpack(">II", data[16:24])
        ext = doc.find(f".//{{{WP}}}extent")
        w_in, h_in = int(ext.get("cx")) / EMU, int(ext.get("cy")) / EMU
        print(f"{rid} -> {target}: {len(data)} bytes, {w_px}x{h_px} px, displayed {w_in}x{h_in} in, effective {w_px / w_in:.0f} dpi")
    ids = [d.get("id") for d in doc.iter(f"{{{WP}}}docPr")]
    print("docPr ids unique:", len(ids) == len(set(ids)))
```

### Quiz

1. Which unit does `wp:extent` use?
- [ ] Twips
- [ ] Pixels
- [x] EMUs (914400 per inch)
> DrawingML uses English Metric Units everywhere.

2. How is an image's content type declared?
- [x] A `Default` entry for its extension in `[Content_Types].xml`
- [ ] An `Override` for each image part
- [ ] Inside the relationship element
> Media use extension defaults; XML parts use overrides.

3. What breaks if two drawings share the same `wp:docPr/@id`?
- [ ] Nothing, ids are cosmetic
- [x] Word may report unreadable content or mis-select pictures
- [ ] The second image is not shown
> Ids must be unique across the document, headers and footers.

### Exercises

1. **Image inventory** — For a package, list each media file with its size in bytes and how many `a:blip` elements reference it.
<details><summary>Solution</summary>

```python
from collections import Counter
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"; R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("word/_rels/document.xml.rels"))}
refs = Counter("word/" + rels[b.get(R + "embed")] for b in doc.iter(A + "blip"))
for name in z.namelist():
    if name.startswith("word/media/"):
        print(name, z.getinfo(name).file_size, "bytes, referenced", refs.get(name, 0), "times")
```

</details>

2. **Resize in place** — Change every inline image wider than 6 inches to exactly 6 inches wide, keeping its aspect ratio.
<details><summary>Solution</summary>

```python
WP = "{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}"; A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
limit = 6 * 914400
for inline in doc.iter(WP + "inline"):
    ext = inline.find(WP + "extent"); cx, cy = int(ext.get("cx")), int(ext.get("cy"))
    if cx > limit:
        scale = limit / cx
        ext.set("cx", str(limit)); ext.set("cy", str(int(cy * scale)))
        x = inline.find(".//" + A + "xfrm/" + A + "ext"); x.set("cx", str(limit)); x.set("cy", str(int(cy * scale)))
```

</details>

### Interview Questions

**Q: Walk me through what is written when you insert a picture into a Word document.**
Word copies the file into `word/media/imageN.ext`, adds a `Default` content type for the extension if absent, adds an image relationship in the `.rels` of the part receiving the picture, and writes a `w:drawing` inside a run. The drawing contains `wp:inline` or `wp:anchor` with `wp:extent` for the displayed size in EMUs, a `wp:docPr` with a unique id and alt text, and an `a:graphic` wrapping a `pic:pic` whose `a:blip r:embed` names the relationship and whose `a:xfrm/a:ext` repeats the size. The binary is never resampled, so a 4 MB photo stays 4 MB; and everything but the relationship id and the two size pairs is boilerplate that can be copied verbatim between documents.

**Q: How would you swap the logo in 21 branded templates without breaking layout?**
If the new logo has the same aspect ratio, I replace `word/media/imageN.png` bytes in each package after confirming through the header's `.rels` which media file is the logo, and I re-zip with `[Content_Types].xml` first. If the ratio changes, I also recompute `wp:extent` and `a:ext` from the new pixel dimensions, keeping the width and adjusting height so the letterhead does not stretch. The script then opens each output with a validator that checks every `a:blip` resolves and every `wp:docPr` id is unique, and I eyeball two rendered PDFs. Doing it at the package level takes seconds per file, which matters when a client rebrands twice in a year.

**Q: What is the difference between an inline and an anchored drawing, and when does a watermark need which?**
An inline drawing (`wp:inline`) behaves like a big character in the run and moves with the text; an anchored drawing (`wp:anchor`) is positioned relative to the page, margin, paragraph or column with explicit offsets and a wrapping mode. A watermark must be anchored with `behindDoc="1"`, `wp:wrapNone` and page-relative positioning, and it lives in the header so it repeats on every page; Word's built-in watermarks use legacy VML in `w:pict` for the same effect. Inline is the right choice for logos in letterheads and figures in SOPs because it never overlaps text and converters handle it reliably.

## Tables: tbl, tr and tc

A Word table is a `w:tbl` containing `w:tr` rows containing `w:tc` cells, each cell containing at least one paragraph. Widths, borders, merges and repeating header rows are all properties on those three elements. Rate matrices, revision histories and QA scorecards are all tables, so this is XML worth knowing well.

### Minimal table

```xml
<w:tbl>
  <w:tblPr>
    <w:tblStyle w:val="TableGrid"/>
    <w:tblW w:w="0" w:type="auto"/>
    <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
  </w:tblPr>
  <w:tblGrid><w:gridCol w:w="4675"/><w:gridCol w:w="4675"/></w:tblGrid>
  <w:tr>
    <w:trPr><w:tblHeader/></w:trPr>
    <w:tc><w:tcPr><w:tcW w:w="4675" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Coverage</w:t></w:r></w:p></w:tc>
    <w:tc><w:tcPr><w:tcW w:w="4675" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Rate</w:t></w:r></w:p></w:tc>
  </w:tr>
  <w:tr>
    <w:tc><w:tcPr><w:tcW w:w="4675" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>$100,000</w:t></w:r></w:p></w:tc>
    <w:tc><w:tcPr><w:tcW w:w="4675" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>$575.00</w:t></w:r></w:p></w:tc>
  </w:tr>
</w:tbl>
```

Rules the schema enforces:

- `w:tblGrid` must have one `w:gridCol` per column; it is the layout skeleton.
- Every `w:tc` must end with a `w:p`, even an empty one. A cell with no paragraph is the most frequent cause of a corrupt generated table.
- `w:tblPr`, `w:trPr` and `w:tcPr` must come first inside their parents.

### Widths

| Element | Type values | Meaning |
|---|---|---|
| `w:tblW` | `auto`, `dxa` (twips), `pct` (fiftieths of a percent: `5000` = 100%) | overall table width |
| `w:gridCol w:w` | twips | grid column width |
| `w:tcW` | `dxa`, `pct`, `auto` | cell width, should agree with the grid |
| `w:tblLayout w:type="fixed"` | | stop Word autofitting to content |

When `w:tcW` and `w:gridCol` disagree, Word trusts the cells and recomputes the grid; LibreOffice trusts the grid. Generators should write both consistently and set `w:tblLayout fixed` for matrices that must not reflow.

### Borders and shading

```xml
<w:tblBorders>
  <w:top w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>
  <w:left w:val="nil"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/><w:right w:val="nil"/>
  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/><w:insideV w:val="nil"/>
</w:tblBorders>
```

`w:sz` is in eighths of a point (`4` = 0.5 pt). Cell-level `w:tcBorders` override table borders, and `w:shd w:val="clear" w:fill="1E5AA8"` inside `w:tcPr` fills a cell. `w:tcMar` sets cell padding; `w:tblCellMar` sets it for the whole table.

### Merged cells

Horizontal merge uses `w:gridSpan`; vertical merge uses `w:vMerge`:

```xml
<w:tc><w:tcPr><w:gridSpan w:val="2"/></w:tcPr><w:p><w:r><w:t>Owner's policy rates</w:t></w:r></w:p></w:tc>

<!-- row 1 -->  <w:tc><w:tcPr><w:vMerge w:val="restart"/></w:tcPr><w:p><w:r><w:t>Wyoming</w:t></w:r></w:p></w:tc>
<!-- row 2 -->  <w:tc><w:tcPr><w:vMerge/></w:tcPr><w:p/></w:tc>
```

A vertically merged continuation cell still exists in the XML with an empty paragraph; only the `restart` cell holds content. Text extractors that ignore `w:vMerge` therefore see blank cells, and generators must emit the continuation cells or the grid breaks.

### Row properties

| `w:trPr` child | Effect |
|---|---|
| `w:tblHeader` | repeat this row at the top of each page |
| `w:cantSplit` | keep the row on one page |
| `w:trHeight w:val="400" w:hRule="atLeast"` | minimum height; `exact` fixes it |

Header rows must be the first rows of the table; a `w:tblHeader` on row 5 is ignored.

### Cell content and alignment

`w:vAlign w:val="center"` in `w:tcPr` centres vertically. Horizontal alignment is on the paragraph inside the cell (`w:jc`), not the cell. Text direction is `w:textDirection w:val="btLr"` for rotated header cells in wide rate matrices.

### Nested tables and table styles

A `w:tc` may contain another `w:tbl`; Word supports it, converters vary. Table styles (`w:style w:type="table"`) carry `w:tblStylePr w:type="firstRow"` blocks whose conditional formatting is applied according to the `w:tblLook` flags. If a generated table looks unstyled, `w:tblLook` is usually missing so Word applies none of the conditional parts.

> **Interview note:** "How does Word represent a merged cell?" is asked to see if you know that the merged-away cells still exist. Horizontal merge removes cells and adds `w:gridSpan`; vertical merge keeps the cells with `w:vMerge`.

### Try It Yourself

```python
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", W)
w = lambda t: f"{{{W}}}{t}"

def cell(text, width, span=1, vmerge=None, fill=None):
    tc = ET.Element(w("tc")); pr = ET.SubElement(tc, w("tcPr"))
    ET.SubElement(pr, w("tcW"), {w("w"): str(width), w("type"): "dxa"})
    if span > 1: ET.SubElement(pr, w("gridSpan"), {w("val"): str(span)})
    if vmerge is not None:
        ET.SubElement(pr, w("vMerge"), {w("val"): "restart"} if vmerge == "restart" else {})
    if fill: ET.SubElement(pr, w("shd"), {w("val"): "clear", w("fill"): fill})
    p = ET.SubElement(tc, w("p"))
    if text:
        r = ET.SubElement(p, w("r")); t = ET.SubElement(r, w("t")); t.text = text
    return tc

rates = [("Wyoming", "$100,000", "$575.00"), ("Wyoming", "$200,000", "$925.00"), ("Colorado", "$100,000", "$610.00")]
tbl = ET.Element(w("tbl")); pr = ET.SubElement(tbl, w("tblPr"))
ET.SubElement(pr, w("tblW"), {w("w"): "9000", w("type"): "dxa"}); ET.SubElement(pr, w("tblLayout"), {w("type"): "fixed"})
grid = ET.SubElement(tbl, w("tblGrid"))
for width in (3000, 3000, 3000): ET.SubElement(grid, w("gridCol"), {w("w"): str(width)})

hdr = ET.SubElement(tbl, w("tr")); ET.SubElement(ET.SubElement(hdr, w("trPr")), w("tblHeader"))
hdr.append(cell("State", 3000, fill="D9E2F3")); hdr.append(cell("Owner's policy rates", 6000, span=2, fill="D9E2F3"))
prev = None
for state, liability, rate in rates:
    tr = ET.SubElement(tbl, w("tr"))
    tr.append(cell(state if state != prev else "", 3000, vmerge="restart" if state != prev else "continue"))
    tr.append(cell(liability, 3000)); tr.append(cell(rate, 3000))
    prev = state

# Validate the structure the way Word would
cols = len(grid)
for i, tr in enumerate(tbl.findall(w("tr"))):
    span_total = sum(int(tc.find(w("tcPr") + "/" + w("gridSpan")).get(w("val"))) if tc.find(w("tcPr") + "/" + w("gridSpan")) is not None else 1 for tc in tr.findall(w("tc")))
    has_p = all(tc.find(w("p")) is not None for tc in tr.findall(w("tc")))
    print(f"row {i}: spans={span_total}/{cols} ok={span_total == cols and has_p}")
print(ET.tostring(tbl, encoding="unicode")[:160], "...")
```

### Quiz

1. What must every `w:tc` contain?
- [ ] A `w:tcW`
- [x] At least one `w:p`
- [ ] A `w:r`
> A cell without a paragraph makes Word report the file as corrupt.

2. How is a vertically merged cell represented in the rows below the first?
- [ ] The cell is omitted
- [x] A `w:tc` with `w:vMerge` (no value) and an empty paragraph
- [ ] `w:gridSpan` on the row
> Vertical merge keeps the cells; horizontal merge removes them and uses `w:gridSpan`.

3. `w:tblW w:w="5000" w:type="pct"` means…
- [ ] 5000 twips
- [x] 100% of the available width
- [ ] 50%
> `pct` is in fiftieths of a percent.

### Exercises

1. **Table to rows** — Convert a `w:tbl` element into a list of lists of cell text, repeating horizontally spanned values so every row has the same length.
<details><summary>Solution</summary>

```python
def table_rows(tbl):
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    rows = []
    for tr in tbl.findall(W + "tr"):
        row = []
        for tc in tr.findall(W + "tc"):
            text = "".join(t.text or "" for t in tc.iter(W + "t"))
            span = tc.find(W + "tcPr/" + W + "gridSpan")
            row += [text] * (int(span.get(W + "val")) if span is not None else 1)
        rows.append(row)
    return rows
```

</details>

2. **Repeat header** — Given a table element, mark its first row as a repeating header and stop every row from splitting across pages.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
for i, tr in enumerate(tbl.findall(W + "tr")):
    trpr = tr.find(W + "trPr")
    if trpr is None:
        trpr = ET.Element(W + "trPr"); tr.insert(0, trpr)
    if i == 0 and trpr.find(W + "tblHeader") is None: ET.SubElement(trpr, W + "tblHeader")
    if trpr.find(W + "cantSplit") is None: ET.SubElement(trpr, W + "cantSplit")
```

</details>

### Interview Questions

**Q: A generated rate matrix opens with columns of the wrong width in LibreOffice but fine in Word. Why?**
Word resolves widths from the cells' `w:tcW` and recalculates the grid, whereas LibreOffice trusts `w:tblGrid`. The generator wrote correct `w:tcW` values but a `w:tblGrid` with equal or placeholder `w:gridCol` widths, so the two renderers disagree. The fix is to compute the grid from the real column widths, write `w:tcW` values that sum to `w:tblW`, and set `w:tblLayout w:type="fixed"` so neither application autofits to content. I keep a check in the build that sums `w:gridCol` widths per table and compares them with the `w:tblW` and with each row's `w:tcW` totals.

**Q: How are merged cells represented, and why does that matter for data extraction?**
Horizontal merges remove the covered cells and put `w:gridSpan` on the surviving cell; vertical merges keep every cell, marking the top one `w:vMerge w:val="restart"` and the rest `w:vMerge` with an empty paragraph. An extractor that just reads `w:tc` elements will produce short rows where cells span horizontally and blank cells where they span vertically, which corrupts a rate matrix converted to Excel. Correct extraction expands spans by repeating the value, and fills vertical continuations with the value from the restart cell above, exactly what a human sees on the page.

**Q: Why do tables generated by scripts often appear without any style formatting?**
Table styles apply conditional formatting blocks such as header row shading through `w:tblStylePr`, and Word only applies those when the table's `w:tblLook` flags request them (`w:firstRow="1"` and so on). Scripts that write `w:tblStyle` but omit `w:tblLook` get the base borders and nothing else. A second cause is a style id that does not exist in styles.xml, since table styles are not built in unless the file was saved by Word; a generated `styles.xml` must define `TableGrid` itself. I add `w:tblLook w:val="04A0" w:firstRow="1" w:noVBand="1"` and verify the style exists.

# LEVEL: Advanced

## Fields and field codes: TOC, PAGE, DOCPROPERTY

A **field** is a placeholder that Word computes: page numbers, tables of contents, dates, document properties, cross-references and merge fields. In the XML a field is an instruction string plus a cached result. Understanding both forms, `w:fldSimple` and the three-part `w:fldChar` sequence, is what lets you generate TOCs and page numbers that Word updates correctly and that converters render sensibly.

### Simple fields

```xml
<w:fldSimple w:instr=" PAGE \* MERGEFORMAT ">
  <w:r><w:t>12</w:t></w:r>
</w:fldSimple>
```

`w:instr` is the field code exactly as you would see with Alt+F9 in Word, and the runs inside are the last computed result. Simple fields cannot span paragraphs and cannot contain nested fields, so Word writes them only for the simplest cases.

### Complex fields (fldChar)

Most fields are written as a run sequence:

```xml
<w:r><w:fldChar w:fldCharType="begin"/></w:r>
<w:r><w:instrText xml:space="preserve"> TOC \o "1-3" \h \z \u </w:instrText></w:r>
<w:r><w:fldChar w:fldCharType="separate"/></w:r>
<w:r><w:t>Cached result shown until update…</w:t></w:r>
<w:r><w:fldChar w:fldCharType="end"/></w:r>
```

| Part | Meaning |
|---|---|
| `begin` | start of the field |
| `w:instrText` | the instruction, may be split across several runs |
| `separate` | end of instruction, start of the result (optional if there is no cached result) |
| result runs | anything, including paragraphs and nested fields, until `end` |
| `end` | end of the field |

The TOC field's result spans dozens of paragraphs, each a `TOC1`/`TOC2` styled paragraph with a hyperlink and a `PAGEREF` field inside, which is why it must use the complex form. `w:fldChar w:fldCharType="begin" w:dirty="true"` asks Word to recompute that one field on open.

### Field codes worth memorising

| Code | Result |
|---|---|
| `PAGE` / `NUMPAGES` / `SECTIONPAGES` | current page, total pages, pages in section |
| `TOC \o "1-3" \h \z \u` | TOC from outline levels 1–3, hyperlinked, hide page numbers in web view, use applied paragraph outline levels |
| `TOC \t "SOPTitle,1,SOPStep,2"` | TOC built from custom styles |
| `DOCPROPERTY Title` / `DOCPROPERTY Company` | built-in or custom document property |
| `STYLEREF "Heading 1"` | text of the nearest Heading 1, used in running headers |
| `REF bookmark \h` / `PAGEREF bookmark \h` | cross-reference text or page of a bookmark |
| `DATE \@ "d MMMM yyyy"` / `SAVEDATE` / `PRINTDATE` | dates |
| `MERGEFIELD ClientName` | mail-merge placeholder |
| `SEQ Figure \* ARABIC` | auto-numbered captions |
| `HYPERLINK "https://…"` | link (Word usually writes `w:hyperlink` instead) |

Switches: `\* MERGEFORMAT` keeps manual formatting after update, `\* Upper`, `\# "#,##0.00"` for numbers, `\@` for dates.

### Making Word update fields on open

Cached results are stale after generation. Set the flag in `word/settings.xml`:

```xml
<w:settings><w:updateFields w:val="true"/></w:settings>
```

Word then prompts "This document contains fields that may refer to other files. Update?" on open and recomputes everything. `w:dirty="true"` on individual fields avoids the prompt but is only honoured for some field types. LibreOffice ignores both, so PDF pipelines either generate the TOC content themselves or refresh through a LibreOffice macro (`UpdateAll` on the text document's indexes).

### DOCPROPERTY and custom properties

`docProps/core.xml` holds `dc:title`, `dc:creator`, `cp:keywords`; `docProps/app.xml` holds `Company`, `Pages`, `Words`; `docProps/custom.xml` holds anything you define:

```xml
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="2" name="PolicyVersion"><vt:lpwstr>3.2</vt:lpwstr></property>
</Properties>
```

A `DOCPROPERTY PolicyVersion` field then shows `3.2` everywhere it is used, including headers, and a script can change the version in one place. `pid` starts at 2 and increments; the `fmtid` is a fixed GUID.

### Reading fields from XML

Because instructions can be split across runs and nested, a robust reader tracks depth:

```python
def fields(paragraph_runs):
    depth, instr, out = 0, [], []
    for r in paragraph_runs:
        fc = r.find(W + "fldChar"); it = r.find(W + "instrText")
        if fc is not None and fc.get(W + "fldCharType") == "begin": depth += 1; instr.append("")
        elif it is not None and depth: instr[-1] += it.text or ""
        elif fc is not None and fc.get(W + "fldCharType") == "end": out.append(instr.pop().strip()); depth -= 1
    return out
```

> **Interview note:** Expect "how is a TOC stored?" The answer: a complex field whose instruction is `TOC \o "1-3" \h \z \u` and whose cached result is a series of TOC-styled paragraphs with hyperlinks and `PAGEREF` fields; Word rebuilds it on update from outline levels.

### Try It Yourself

```python
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
w = lambda t: f"{{{W}}}{t}"
doc = f'''<w:document xmlns:w="{W}"><w:body>
<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-3" </w:instrText></w:r><w:r><w:instrText xml:space="preserve">\\h \\z \\u </w:instrText></w:r>
 <w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1 Purpose</w:t></w:r>
 <w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGEREF _Toc1 \\h </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>3</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>
 <w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>
<w:p><w:r><w:t xml:space="preserve">Page </w:t></w:r><w:fldSimple w:instr=" PAGE "><w:r><w:t>1</w:t></w:r></w:fldSimple><w:r><w:t xml:space="preserve"> of </w:t></w:r><w:fldSimple w:instr=" NUMPAGES "><w:r><w:t>1</w:t></w:r></w:fldSimple></w:p>
<w:p><w:fldSimple w:instr=" DOCPROPERTY PolicyVersion \\* MERGEFORMAT "><w:r><w:t>3.1</w:t></w:r></w:fldSimple></w:p>
</w:body></w:document>'''

root = ET.fromstring(doc)
for fs in root.iter(w("fldSimple")):
    print("simple :", fs.get(w("instr")).strip(), "=>", "".join(t.text for t in fs.iter(w("t"))))

for p in root.iter(w("p")):
    stack, found = [], []
    for r in p.findall(w("r")):
        fc, it = r.find(w("fldChar")), r.find(w("instrText"))
        if fc is not None and fc.get(w("fldCharType")) == "begin": stack.append({"instr": "", "depth": len(stack) + 1})
        elif it is not None and stack: stack[-1]["instr"] += it.text or ""
        elif fc is not None and fc.get(w("fldCharType")) == "end": found.append(stack.pop())
    for f in found: print(f"complex: depth={f['depth']} {f['instr'].strip()}")

settings = f'<w:settings xmlns:w="{W}"><w:updateFields w:val="true"/></w:settings>'
print("updateFields:", ET.fromstring(settings).find(w("updateFields")).get(w("val")))
```

### Quiz

1. Which element holds a complex field's instruction?
- [ ] `w:fldSimple`
- [x] `w:instrText` between `begin` and `separate`
- [ ] `w:t`
> The result lives between `separate` and `end`.

2. What does `w:updateFields w:val="true"` in settings.xml do?
- [x] Makes Word recompute all fields when the document opens
- [ ] Recomputes fields at save time
- [ ] Deletes cached results
> LibreOffice ignores it; Word prompts the user then updates.

3. `TOC \o "1-3" \h \z \u` builds entries from…
- [ ] Paragraphs styled TOC1–TOC3
- [x] Outline levels 1–3, including custom styles with those levels
- [ ] Bookmarks
> `\o` is outline levels; `\t` would list specific styles.

### Exercises

1. **Field census** — Count occurrences of each field type (first word of the instruction) in a document, including nested ones.
<details><summary>Solution</summary>

```python
from collections import Counter
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
counts = Counter()
for fs in root.iter(W + "fldSimple"): counts[fs.get(W + "instr").split()[0]] += 1
for p in root.iter(W + "p"):
    stack = []
    for r in p.findall(W + "r"):
        fc, it = r.find(W + "fldChar"), r.find(W + "instrText")
        if fc is not None and fc.get(W + "fldCharType") == "begin": stack.append("")
        elif it is not None and stack: stack[-1] += it.text or ""
        elif fc is not None and fc.get(W + "fldCharType") == "end": counts[stack.pop().split()[0]] += 1
print(counts)
```

</details>

2. **Custom property writer** — Produce a `docProps/custom.xml` string for a dictionary of string properties with correct `pid` values.
<details><summary>Solution</summary>

```python
def custom_props(props):
    NS = 'xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"'
    body = "".join(f'<property fmtid="{{D5CDD505-2E9C-101B-9397-08002B2CF9AE}}" pid="{i}" name="{k}"><vt:lpwstr>{v}</vt:lpwstr></property>' for i, (k, v) in enumerate(props.items(), start=2))
    return f"<Properties {NS}>{body}</Properties>"
print(custom_props({"PolicyVersion": "3.2", "Owner": "Ali Raza"}))
```

</details>

### Interview Questions

**Q: How is a table of contents stored in a DOCX, and why is it often wrong in generated files?**
As a complex field: a run with `w:fldChar begin`, runs of `w:instrText` holding `TOC \o "1-3" \h \z \u`, a `separate` marker, then the cached result, which is a sequence of paragraphs styled TOC1 to TOC3 containing hyperlinks to `_Toc` bookmarks and nested `PAGEREF` fields, and finally `end`. Generators cannot compute page numbers, so they write an empty or placeholder result and rely on Word updating the field; if `w:updateFields` is not set in settings.xml and no `w:dirty` flag is present, the user sees the placeholder. LibreOffice never updates it, so for PDF output I either drive LibreOffice with a macro that updates indexes or generate the TOC entries myself from the heading list and accept that page numbers come from a two-pass render.

**Q: When would you use `DOCPROPERTY` fields instead of plain text in a template suite?**
For values that appear in many places and change per document or per revision, such as the policy version, the client name in a header, or a document control number. Setting the value once in `docProps/custom.xml` and updating fields changes every occurrence, including headers and footers that a find-and-replace might miss inside field results. It also gives the client a supported way to change the value from File, Info, Properties without touching the layout. The limitation is that fields need an update to display the new value, so I set `w:updateFields` and, for PDF pipelines, verify the value in the rendered output rather than trusting the XML.

**Q: What are the pitfalls of parsing fields from document.xml?**
Instructions can be split across several `w:instrText` runs, sometimes mid-word, so they must be concatenated per field. Fields nest, since a TOC contains `PAGEREF` and `HYPERLINK` fields inside its result, so a depth counter is needed to know which `end` closes which `begin`. A field can span paragraphs, so per-paragraph parsing loses TOCs and multi-line `IF` fields; the state has to persist across paragraphs within the body. Finally the same field may be written as `w:fldSimple` by one tool and as a `w:fldChar` sequence by another, so both forms must be handled, which is exactly why text extractors that only read `w:t` show stale cached results for page numbers.

## Fonts and font embedding: fontTable.xml and odttf

Word does not store glyphs unless asked, so a document that looks perfect on the designer's machine can fall back to Arial on a client's laptop. `word/fontTable.xml` describes the fonts a document uses so that Word can pick a good substitute, and font embedding stores obfuscated font files inside the package. This chapter shows both, and the practical rules for branded templates.

### fontTable.xml

```xml
<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:font w:name="Calibri">
    <w:panose1 w:val="020F0502020204030204"/>
    <w:charset w:val="00"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
    <w:sig w:usb0="E4002EFF" w:usb1="C000247B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/>
  </w:font>
  <w:font w:name="Montserrat">
    <w:panose1 w:val="00000500000000000000"/>
    <w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/>
    <w:embedRegular r:id="rId1" w:fontKey="{1A2B3C4D-0000-0000-0000-000000000001}"/>
    <w:embedBold r:id="rId2" w:fontKey="{1A2B3C4D-0000-0000-0000-000000000002}"/>
  </w:font>
</w:fonts>
```

| Element | Purpose |
|---|---|
| `w:panose1` | 10-byte classification used to choose a similar substitute (serif/sans, weight, width) |
| `w:family` | `roman`, `swiss`, `modern`, `script`, `decorative`, `auto` — the coarse fallback class |
| `w:pitch` | `fixed` or `variable` |
| `w:sig` | Unicode and code-page coverage bits |
| `w:altName` | an explicit substitute name |
| `w:embedRegular` / `Bold` / `Italic` / `BoldItalic` | relationships to embedded font parts |

A fontTable is not required for the file to open, but without an entry Word substitutes by name only, and a missing brand font like Montserrat becomes Calibri rather than a similar geometric sans.

### How runs name fonts

```xml
<w:rFonts w:ascii="Montserrat" w:hAnsi="Montserrat" w:cs="Arial" w:eastAsia="SimSun"/>
<w:rFonts w:asciiTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/>
```

`w:ascii` covers characters 0–127, `w:hAnsi` other Latin characters, `w:cs` complex scripts (Arabic, Urdu), `w:eastAsia` CJK. The `Theme` variants defer to `theme1.xml` so the font follows the theme (next chapter). A run whose text is Urdu with only `w:ascii` set renders in the default complex-script font, which is how the Urdu portions of a bilingual SOP end up in a different typeface.

### Embedding: the odttf parts

Embedded fonts are stored as `word/fonts/font1.odttf`, an **obfuscated** TrueType/OpenType file: the first 32 bytes are XORed with the GUID from `w:fontKey`. The parts are related from `word/_rels/fontTable.xml.rels`:

```xml
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font1.odttf"/>
```

and given a content type by extension: `<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/>`.

De-obfuscating in Python:

```python
import uuid

def deobfuscate(odttf_bytes, font_key):
    guid = uuid.UUID(font_key.strip("{}"))
    key = guid.bytes_le[::-1]          # 16 bytes, reversed little-endian GUID
    data = bytearray(odttf_bytes)
    for i in range(32):
        data[i] ^= key[i % 16]
    return bytes(data)
```

Obfuscation is not encryption; it exists so that the font cannot be copied out and installed by simply renaming the file, satisfying licence terms that allow "document embedding" but not "distribution".

### Embedding settings

`word/settings.xml` controls what Word does when the user saves:

```xml
<w:embedTrueTypeFonts/>
<w:embedSystemFonts w:val="false"/>
<w:saveSubsetFonts/>
<w:doNotEmbedSmartTags/>
```

`w:saveSubsetFonts` embeds only the glyphs used, which shrinks the package but breaks editing with new characters on a machine without the font. The OpenType `fsType` flag in the font file decides whether Word will embed at all: restricted-licence fonts (fsType 2) are refused, preview-and-print (4) are embedded read-only, editable (8) and installable (0) are embedded fully.

### Rules for branded templates

1. Prefer fonts the client can install (their own licence) or fonts that ship with Office (Calibri, Cambria, Arial, Georgia, Segoe UI).
2. If a brand font is mandatory, embed it, set `w:embedTrueTypeFonts` in the template so re-saves keep it, and check `fsType`.
3. Always set `w:altName` or a panose so substitution on Mac and mobile is sane.
4. For PDFs, embedding happens at conversion time, so LibreOffice needs the font installed on the conversion server regardless of what the DOCX contains.

> **Warning:** Google Fonts such as Montserrat are OFL-licensed and safe to embed. Commercial fonts often forbid it; embedding a restricted font in a client deliverable is a licence breach on the client's behalf. Check `fsType` and the EULA before setting `w:embedTrueTypeFonts`.

### Try It Yourself

```python
import zipfile, io, uuid, xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
key = "{1A2B3C4D-0000-0000-0000-000000000001}"

# Fake font bytes: a TrueType header "\x00\x01\x00\x00" followed by filler
font = b"\x00\x01\x00\x00" + bytes(range(28)) + b"GLYPHDATA" * 4

def obfuscate(data, font_key):
    guid_key = uuid.UUID(font_key.strip("{}")).bytes_le[::-1]
    out = bytearray(data)
    for i in range(32): out[i] ^= guid_key[i % 16]
    return bytes(out)

odttf = obfuscate(font, key)
print("obfuscated header:", odttf[:4].hex(), " original:", font[:4].hex())
print("round-trip ok:", obfuscate(odttf, key) == font)

font_table = f'''<w:fonts xmlns:w="{W}" xmlns:r="{R}">
<w:font w:name="Montserrat"><w:panose1 w:val="00000500000000000000"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/>
<w:embedRegular r:id="rId1" w:fontKey="{key}"/></w:font>
<w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font></w:fonts>'''
buf = io.BytesIO()
with zipfile.ZipFile(buf, "w") as z:
    z.writestr("word/fontTable.xml", font_table)
    z.writestr("word/_rels/fontTable.xml.rels", f'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font1.odttf"/></Relationships>')
    z.writestr("word/fonts/font1.odttf", odttf)

with zipfile.ZipFile(io.BytesIO(buf.getvalue())) as z:
    ft = ET.fromstring(z.read("word/fontTable.xml"))
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("word/_rels/fontTable.xml.rels"))}
    for f in ft.findall(f"{{{W}}}font"):
        emb = [c for c in f if c.tag.startswith(f"{{{W}}}embed")]
        fam = f.find(f"{{{W}}}family")
        print(f.get(f"{{{W}}}name"), "family=" + (fam.get(f"{{{W}}}val") if fam is not None else "?"), "embedded:" if emb else "not embedded", [rels[e.get(f"{{{R}}}id")] for e in emb])
```

### Quiz

1. What does `w:panose1` help Word do?
- [ ] Render the font
- [x] Choose a visually similar substitute when the font is missing
- [ ] Embed the font
> PANOSE classifies fonts by shape so fallback is sensible.

2. How are embedded fonts protected in a DOCX?
- [ ] AES encryption
- [x] The first 32 bytes are XORed with the GUID from `w:fontKey`
- [ ] They are not protected
> This obfuscation prevents trivial extraction, not determined copying.

3. Which `w:rFonts` attribute controls Arabic or Urdu text?
- [ ] `w:ascii`
- [ ] `w:hAnsi`
- [x] `w:cs`
> Complex-script runs use `w:cs`; the run also needs `w:rtl`/`w:lang` for correct shaping.

### Exercises

1. **Font usage report** — List every distinct font named in `w:rFonts` attributes across document.xml and styles.xml, and mark which have a fontTable entry.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
used = set()
for root in (doc_root, styles_root):
    for rf in root.iter(W + "rFonts"):
        for attr in ("ascii", "hAnsi", "cs", "eastAsia"):
            if rf.get(W + attr): used.add(rf.get(W + attr))
table = {f.get(W + "name") for f in font_root.iter(W + "font")}
for name in sorted(used): print(name, "in fontTable" if name in table else "MISSING from fontTable")
```

</details>

2. **Extract embedded fonts** — Write the de-obfuscated `.ttf` files out of a package using the keys in fontTable.xml.
<details><summary>Solution</summary>

```python
import uuid, zipfile, xml.etree.ElementTree as ET
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"; R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
with zipfile.ZipFile("branded.docx") as z:
    ft = ET.fromstring(z.read("word/fontTable.xml"))
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("word/_rels/fontTable.xml.rels"))}
    for f in ft.iter(W + "font"):
        for e in f:
            if e.tag.startswith(W + "embed"):
                data = bytearray(z.read("word/" + rels[e.get(R + "id")]))
                key = uuid.UUID(e.get(W + "fontKey").strip("{}")).bytes_le[::-1]
                for i in range(32): data[i] ^= key[i % 16]
                open(f"{f.get(W + 'name')}-{e.tag.split('embed')[1]}.ttf", "wb").write(data)
```

</details>

### Interview Questions

**Q: A client says the SOP "looks different" on their Mac. What is the font-related diagnosis?**
The document uses a font not installed on the Mac, so Word substitutes. I unzip and read `w:rFonts` in styles.xml and document.xml to list the fonts, then check fontTable.xml for those names: if there is no `w:font` entry with a panose value, the substitution is by name alone and can be far off; if the font is a brand font like Montserrat, it is probably not embedded. The fix is either to embed with `w:embedTrueTypeFonts` after confirming the font's `fsType` licence bits allow it, or to switch the template to fonts Office ships on both platforms, and in either case to add `w:altName` so the fallback is a similar sans rather than Times. I also check `w:cs` for any Urdu or Arabic runs, since those use a separate font slot.

**Q: How does font embedding work at the package level?**
Each embedded face is stored as `word/fonts/fontN.odttf`, the TrueType or OpenType bytes with the first 32 bytes XORed against the GUID given in `w:fontKey`; the fontTable entry references it through `w:embedRegular`, `w:embedBold`, `w:embedItalic` or `w:embedBoldItalic` with an `r:id` into `word/_rels/fontTable.xml.rels`, and `[Content_Types].xml` maps the `odttf` extension to the obfuscated-font type. Settings in settings.xml (`w:embedTrueTypeFonts`, `w:saveSubsetFonts`, `w:embedSystemFonts`) control whether Word keeps embedding on re-save and whether it subsets to used glyphs. The obfuscation is trivially reversible and exists only to satisfy licence terms about not distributing installable font files.

**Q: Why does a DOCX with embedded fonts still produce a PDF with the wrong font on your Linux conversion server?**
LibreOffice does not use the embedded odttf parts when rendering; it looks the font up in the system font configuration, so a font present only inside the DOCX is substituted by fontconfig rules. The conversion server therefore needs the brand fonts installed under `/usr/share/fonts` or `~/.fonts`, with `fc-cache` refreshed, and I keep a font manifest per client in the container image. A quick check is `fc-match Montserrat`, which prints the substitute if the real font is missing, and I verify the PDF with `pdffonts` or pikepdf to confirm the embedded font names match the template.

## Themes and theme colours

When a run says `w:color w:val="2F5496" w:themeColor="accent1" w:themeShade="BF"`, the literal hex is only a cache. The real instruction is "accent 1, darkened to 75 percent", and the value of accent 1 lives in `word/theme/theme1.xml`. Change the theme and every theme-linked colour and font in the document follows, which is exactly how Word's Design tab restyles a document in one click, and how a generated template suite can be rebranded by editing one file.

### theme1.xml structure

```xml
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
  <a:themeElements>
    <a:clrScheme name="Office">
      <a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>
      <a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="44546A"/></a:dk2>
      <a:lt2><a:srgbClr val="E7E6E6"/></a:lt2>
      <a:accent1><a:srgbClr val="4472C4"/></a:accent1>
      <a:accent2><a:srgbClr val="ED7D31"/></a:accent2>
      <a:accent3><a:srgbClr val="A5A5A5"/></a:accent3>
      <a:accent4><a:srgbClr val="FFC000"/></a:accent4>
      <a:accent5><a:srgbClr val="5B9BD5"/></a:accent5>
      <a:accent6><a:srgbClr val="70AD47"/></a:accent6>
      <a:hlink><a:srgbClr val="0563C1"/></a:hlink>
      <a:folHlink><a:srgbClr val="954F72"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Office">
      <a:majorFont><a:latin typeface="Calibri Light"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>
      <a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Office"> ...fill, line and effect styles for shapes... </a:fmtScheme>
  </a:themeElements>
</a:theme>
```

The theme is DrawingML (`a:` namespace) and is shared with Excel and PowerPoint; a PPTX theme file can be dropped into a DOCX.

### The twelve theme colours

| Slot | Word's name | Typical use |
|---|---|---|
| `dk1` / `lt1` | Text/Background – Dark 1 / Light 1 | body text, page |
| `dk2` / `lt2` | Text/Background – Dark 2 / Light 2 | headings, subtle fills |
| `accent1`–`accent6` | Accent 1–6 | headings, table styles, charts |
| `hlink` / `folHlink` | Hyperlink / Followed hyperlink | links |

In `w:themeColor` the names are slightly different: `text1`, `background1`, `text2`, `background2`, `accent1`…`accent6`, `hyperlink`, `followedHyperlink`. The mapping from `text1` to `dk1` is done by `w:clrSchemeMapping` in settings.xml, which normally maps them straight but can swap dark and light for a "dark background" document.

### Tints and shades

`w:themeTint="99"` and `w:themeShade="BF"` are hex fractions of 255. Tint mixes toward white, shade toward black:

```python
def apply(hex_rgb, tint=None, shade=None):
    r, g, b = (int(hex_rgb[i:i + 2], 16) for i in (0, 2, 4))
    if tint is not None:
        f = int(tint, 16) / 255
        r, g, b = (round(255 - (255 - c) * f) for c in (r, g, b))
    if shade is not None:
        f = int(shade, 16) / 255
        r, g, b = (round(c * f) for c in (r, g, b))
    return f"{r:02X}{g:02X}{b:02X}"

apply("4472C4", shade="BF")   # '335792' - Word writes 2F5496 using HSL math, close enough for checks
```

Word actually performs tint and shade in HSL space, so your RGB approximation differs by a few units. When you edit the theme, also update the cached `w:val` values or Word will show the new colour only after it recalculates, which it does on open for styles but not always for direct formatting.

### Theme fonts

`w:rFonts w:asciiTheme="majorHAnsi"` means "the major Latin font", `minorHAnsi` the minor one. Headings use major, body uses minor. Setting `a:majorFont/a:latin typeface="Montserrat"` and `a:minorFont/a:latin typeface="Open Sans"` rebrands every theme-linked style. `a:ea` and `a:cs` slots cover East Asian and complex script fonts; leave them empty to inherit Word's defaults, or set `a:cs` to a Nastaliq or Naskh face for Urdu documents.

### Rebranding a suite through the theme

```python
import zipfile, re

def retheme(src, dst, accent1, major, minor):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "word/theme/theme1.xml":
                text = data.decode("utf-8")
                text = re.sub(r'(<a:accent1>\s*<a:srgbClr val=")[0-9A-Fa-f]{6}', r"\g<1>" + accent1, text)
                text = re.sub(r'(<a:majorFont>\s*<a:latin typeface=")[^"]*', r"\g<1>" + major, text)
                text = re.sub(r'(<a:minorFont>\s*<a:latin typeface=")[^"]*', r"\g<1>" + minor, text)
                data = text.encode("utf-8")
            zout.writestr(item, data)
```

This works only for content that references the theme. Literal `w:color w:val="4472C4"` with no `w:themeColor` stays blue; Ali's template audit script counts such literals and converts them to theme references where they match a theme colour.

### Theme in styles versus direct formatting

Word's built-in styles reference the theme (`Heading1` uses `accent1` shade BF and `majorHAnsi`). docx-js and python-docx write literal colours unless you set them explicitly through the XML, so generated documents often lose theme linkage. For rebrandable templates, write `w:themeColor` and `w:asciiTheme` attributes in styles.xml rather than literals.

> **Tip:** `w:clrSchemeMapping` in settings.xml must exist for `w:themeColor="text1"` to resolve. A minimal generated settings.xml without it makes Word fall back to the literal `w:val`, which hides the fact that theming is broken until the client changes the theme.

### Try It Yourself

```python
import xml.etree.ElementTree as ET, colorsys

A = "http://schemas.openxmlformats.org/drawingml/2006/main"
theme = f'''<a:theme xmlns:a="{A}" name="Brand"><a:themeElements>
<a:clrScheme name="Brand"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>
<a:dk2><a:srgbClr val="1F2937"/></a:dk2><a:lt2><a:srgbClr val="F3F4F6"/></a:lt2>
<a:accent1><a:srgbClr val="1E5AA8"/></a:accent1><a:accent2><a:srgbClr val="F59E0B"/></a:accent2>
<a:accent3><a:srgbClr val="10B981"/></a:accent3><a:accent4><a:srgbClr val="EF4444"/></a:accent4>
<a:accent5><a:srgbClr val="8B5CF6"/></a:accent5><a:accent6><a:srgbClr val="6B7280"/></a:accent6>
<a:hlink><a:srgbClr val="1D4ED8"/></a:hlink><a:folHlink><a:srgbClr val="6D28D9"/></a:folHlink></a:clrScheme>
<a:fontScheme name="Brand"><a:majorFont><a:latin typeface="Montserrat"/></a:majorFont><a:minorFont><a:latin typeface="Open Sans"/></a:minorFont></a:fontScheme>
</a:themeElements></a:theme>'''

root = ET.fromstring(theme)
scheme = {}
for slot in root.find(f".//{{{A}}}clrScheme"):
    c = slot[0]
    scheme[slot.tag.split("}")[1]] = c.get("val") if c.tag.endswith("srgbClr") else c.get("lastClr")
mapping = {"text1": "dk1", "background1": "lt1", "text2": "dk2", "background2": "lt2", "hyperlink": "hlink", "followedHyperlink": "folHlink"}

def resolve(theme_color, tint=None, shade=None):
    hex_rgb = scheme[mapping.get(theme_color, theme_color)]
    r, g, b = (int(hex_rgb[i:i + 2], 16) / 255 for i in (0, 2, 4))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    if tint: l = l * (int(tint, 16) / 255) + (1 - int(tint, 16) / 255)
    if shade: l = l * (int(shade, 16) / 255)
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return f"{round(r * 255):02X}{round(g * 255):02X}{round(b * 255):02X}"

print("accent1:", scheme["accent1"], " heading (shade BF):", resolve("accent1", shade="BF"), " light fill (tint 33):", resolve("accent1", tint="33"))
print("text1 ->", resolve("text1"), " hyperlink ->", resolve("hyperlink"))
fonts = root.find(f".//{{{A}}}fontScheme")
print("major:", fonts.find(f"{{{A}}}majorFont/{{{A}}}latin").get("typeface"), " minor:", fonts.find(f"{{{A}}}minorFont/{{{A}}}latin").get("typeface"))
```

### Quiz

1. In `w:color w:val="2F5496" w:themeColor="accent1" w:themeShade="BF"`, what does Word use when the theme changes?
- [ ] `w:val`
- [x] `accent1` from theme1.xml, darkened by BF/FF
- [ ] Neither; the colour is fixed
> `w:val` is a cached literal; the theme reference is authoritative.

2. Which settings.xml element maps `text1` to `dk1`?
- [ ] `w:themeFontLang`
- [x] `w:clrSchemeMapping`
- [ ] `w:docVars`
> Without it the mapping is undefined and Word falls back to literals.

3. Which font slot do headings normally use?
- [x] `majorHAnsi`
- [ ] `minorHAnsi`
- [ ] `csTheme`
> Body text uses the minor font; headings use the major font.

### Exercises

1. **Literal colour finder** — List all `w:color` elements in a document that have no `w:themeColor`, with a count per hex value.
<details><summary>Solution</summary>

```python
from collections import Counter
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
literals = Counter(c.get(W + "val") for c in doc_root.iter(W + "color") if c.get(W + "themeColor") is None)
print(literals.most_common())
```

</details>

2. **Theme swap** — Replace `accent1` in a theme XML string with a new hex and return the modified string using ElementTree rather than regex.
<details><summary>Solution</summary>

```python
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
ET.register_namespace("a", A[1:-1])
root = ET.fromstring(theme)
root.find(".//" + A + "accent1/" + A + "srgbClr").set("val", "7D3C98")
print(ET.tostring(root, encoding="unicode")[:200])
```

</details>

### Interview Questions

**Q: How does Word's theme system work under the hood, and how do you use it for rebrandable templates?**
`word/theme/theme1.xml` defines twelve colour slots, a major and minor font, and shape format styles. Styles and direct formatting can reference those slots with `w:themeColor`, `w:themeTint`, `w:themeShade`, `w:asciiTheme` and similar attributes, keeping a literal `w:val` as a cache; settings.xml maps the `text1`/`background1` names to `dk1`/`lt1` slots. For a rebrandable suite I make every style reference the theme rather than literals, keep one theme file per client and apply it across all templates, so changing accent 1 and the two fonts in one file rebrands twenty-one documents, and Word's Design tab keeps working for the client afterwards. I audit generated documents for literal colours, since docx-js and python-docx write literals unless told otherwise.

**Q: Why does a colour look slightly different after you compute a shade in RGB compared with Word?**
Word applies tints and shades in HSL: it converts the base colour to hue, saturation and luminance, scales luminance toward white or black by the tint or shade fraction, and converts back. A simple RGB multiplication gives a close but not identical value, typically off by a few units per channel, which is visible when placed next to Word's own cached values. For validation scripts that compare generated files with Word-saved ones I compute in HSL with `colorsys` and allow a tolerance of three or four units, and I never treat the cached `w:val` as ground truth.

**Q: A client changed the theme in Word and half the document did not follow. What happened?**
Half the content used literal colours and fonts rather than theme references. That happens when text was pasted from another document with "Keep Source Formatting", when a generator wrote `w:color w:val` without `w:themeColor`, or when someone picked a "More Colors" custom colour instead of a theme swatch. The fix is a script that finds literals matching the old theme values and rewrites them as theme references with the right tint or shade, and that replaces `w:rFonts w:ascii="Calibri"` with `w:asciiTheme="minorHAnsi"` where they match the old theme font; afterwards the Design tab works as the client expects.

## Content controls (SDT) and custom XML

A **structured document tag**, `w:sdt`, is Word's content control: the grey-boxed date pickers, dropdowns, rich text fields and check boxes in forms and templates. Content controls can be bound to XML data stored in the package through **custom XML parts**, which turns a Word template into a form whose values live in a small XML file that a script can read and write without touching the document body. This is how Ali builds fillable DOCX intake forms and how SharePoint document properties appear in Word headers.

### Anatomy of an sdt

```xml
<w:sdt>
  <w:sdtPr>
    <w:alias w:val="Client name"/>
    <w:tag w:val="client_name"/>
    <w:id w:val="1846209874"/>
    <w:placeholder><w:docPart w:val="DefaultPlaceholder_-1854013440"/></w:placeholder>
    <w:showingPlcHdr/>
    <w:text/>
  </w:sdtPr>
  <w:sdtContent>
    <w:r><w:rPr><w:rStyle w:val="PlaceholderText"/></w:rPr><w:t>Click here to enter the client name</w:t></w:r>
  </w:sdtContent>
</w:sdt>
```

| Part | Meaning |
|---|---|
| `w:sdtPr` | properties: alias (label), tag (machine name), id, type, lock, data binding |
| `w:sdtContent` | the visible content; runs for inline controls, paragraphs or tables for block controls |
| `w:showingPlcHdr` | the content is the placeholder, not a real value |
| `w:text`, `w:date`, `w:comboBox`, `w:dropDownList`, `w:picture`, `w:richText`, `w14:checkbox`, `w:group`, `w:repeatingSection` | the control type |
| `w:lock w:val="sdtLocked"` / `"contentLocked"` / `"sdtContentLocked"` | prevent deleting the control, editing its content, or both |

An sdt can sit at run level (inside `w:p`), block level (inside `w:body` or `w:tc` wrapping paragraphs), row level and cell level. The tag is what scripts search for; the alias is what users see.

### Control types

```xml
<w:dropDownList>
  <w:listItem w:displayText="Wyoming" w:value="WY"/>
  <w:listItem w:displayText="Colorado" w:value="CO"/>
</w:dropDownList>

<w:date w:fullDate="2026-09-16T00:00:00Z">
  <w:dateFormat w:val="d MMMM yyyy"/><w:lid w:val="en-US"/><w:storeMappedDataAs w:val="dateTime"/><w:calendar w:val="gregorian"/>
</w:date>

<w14:checkbox xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">
  <w14:checked w14:val="1"/>
  <w14:checkedState w14:val="2612" w14:font="MS Gothic"/>
  <w14:uncheckedState w14:val="2610" w14:font="MS Gothic"/>
</w14:checkbox>
```

The check box's visible content is a run containing the ☒ or ☐ character; scripts that toggle it must update both `w14:checked` and the character, or Word shows one state and stores another.

### Data binding to custom XML

A custom XML part is a file such as `customXml/item1.xml` with its own `customXml/itemProps1.xml` (holding a `ds:datastoreItem` with a GUID and the schema namespaces) and a relationship from `document.xml.rels` of type `.../customXml`. The control binds with an XPath:

```xml
<w:sdtPr>
  <w:tag w:val="client_name"/>
  <w:dataBinding w:prefixMappings="xmlns:ns0='urn:stewart:intake'" w:xpath="/ns0:intake[1]/ns0:client[1]/ns0:name[1]" w:storeItemID="{8F2C1C9A-5B4B-4E4F-9C3D-1234567890AB}"/>
  <w:text/>
</w:sdtPr>
```

and the data lives in:

```xml
<intake xmlns="urn:stewart:intake"><client><name>Meridian Escrow LLC</name></client></intake>
```

When the user types in the control, Word writes to the custom XML part; when a script changes the XML and the user opens the file, Word refreshes every bound control. Because the binding is two-way, a settlement statement can carry its own data payload, and the same value can appear in the header, the body and a summary table from one binding.

### Built-in document property bindings

Word's Quick Parts, Document Property controls bind to `customXml` parts with the namespace `http://schemas.openxmlformats.org/package/2006/metadata/core-properties` (title, author) or `http://schemas.microsoft.com/office/2006/metadata/properties` (SharePoint columns). Changing `docProps/core.xml` therefore updates those controls on open.

### Reading and writing controls with Python

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

def sdt_values(root):
    out = {}
    for sdt in root.iter(W + "sdt"):
        tag = sdt.find(W + "sdtPr/" + W + "tag")
        if tag is None: continue
        content = sdt.find(W + "sdtContent")
        placeholder = sdt.find(W + "sdtPr/" + W + "showingPlcHdr") is not None
        out[tag.get(W + "val")] = None if placeholder else "".join(t.text or "" for t in content.iter(W + "t"))
    return out
```

Writing a plain text control means replacing the runs inside `w:sdtContent` with a single run and removing `w:showingPlcHdr`. For bound controls, write the custom XML part instead and let Word refresh.

### Locking and protecting forms

`w:lock w:val="sdtContentLocked"` keeps the text fixed; `sdtLocked` prevents deletion. Combined with `w:documentProtection w:edit="forms"` in settings.xml, users can only type into controls, which is the DOCX equivalent of a fillable PDF. Group controls (`w:group`) wrap whole sections so users cannot add paragraphs outside the fields.

> **Warning:** Word regenerates `w:id` values when it wants and ids must be unique. Generators that copy an sdt template for each row of a table must assign new ids, or Word merges or drops controls on open.

### Try It Yourself

```python
import zipfile, io, xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
W14 = "http://schemas.microsoft.com/office/word/2010/wordml"
NS = "urn:stewart:intake"
w = lambda t: f"{{{W}}}{t}"

doc = f'''<w:document xmlns:w="{W}" xmlns:w14="{W14}"><w:body>
<w:p><w:sdt><w:sdtPr><w:alias w:val="Client name"/><w:tag w:val="client_name"/><w:id w:val="1001"/>
  <w:dataBinding w:prefixMappings="xmlns:ns0='{NS}'" w:xpath="/ns0:intake[1]/ns0:client[1]/ns0:name[1]" w:storeItemID="{{8F2C1C9A-5B4B-4E4F-9C3D-1234567890AB}}"/><w:text/></w:sdtPr>
  <w:sdtContent><w:r><w:t>Meridian Escrow LLC</w:t></w:r></w:sdtContent></w:sdt></w:p>
<w:p><w:sdt><w:sdtPr><w:alias w:val="State"/><w:tag w:val="state"/><w:id w:val="1002"/>
  <w:dropDownList><w:listItem w:displayText="Wyoming" w:value="WY"/><w:listItem w:displayText="Colorado" w:value="CO"/></w:dropDownList></w:sdtPr>
  <w:sdtContent><w:r><w:t>Wyoming</w:t></w:r></w:sdtContent></w:sdt></w:p>
<w:p><w:sdt><w:sdtPr><w:tag w:val="rush"/><w:id w:val="1003"/><w14:checkbox><w14:checked w14:val="1"/></w14:checkbox></w:sdtPr>
  <w:sdtContent><w:r><w:t>☒</w:t></w:r></w:sdtContent></w:sdt></w:p>
<w:p><w:sdt><w:sdtPr><w:tag w:val="notes"/><w:id w:val="1004"/><w:showingPlcHdr/><w:text/></w:sdtPr>
  <w:sdtContent><w:r><w:t>Click here to enter notes</w:t></w:r></w:sdtContent></w:sdt></w:p>
</w:body></w:document>'''
custom = f'<intake xmlns="{NS}"><client><name>Meridian Escrow LLC</name></client></intake>'

root = ET.fromstring(doc)
for sdt in root.iter(w("sdt")):
    pr, content = sdt.find(w("sdtPr")), sdt.find(w("sdtContent"))
    tag = pr.find(w("tag")).get(w("val"))
    kind = next((c.tag.split("}")[1] for c in pr if c.tag.split("}")[1] in ("text", "dropDownList", "date", "checkbox", "richText")), "richText")
    placeholder = pr.find(w("showingPlcHdr")) is not None
    bound = pr.find(w("dataBinding"))
    value = None if placeholder else "".join(t.text or "" for t in content.iter(w("t")))
    if kind == "checkbox":
        value = pr.find(f"{{{W14}}}checkbox/{{{W14}}}checked").get(f"{{{W14}}}val") == "1"
    print(f"{tag:12} type={kind:12} value={value!r} bound={'yes: ' + bound.get(w('xpath')) if bound is not None else 'no'}")

# Change the bound value in the custom XML part, as a script would before the user opens the file
cx = ET.fromstring(custom)
cx.find(f"{{{NS}}}client/{{{NS}}}name").text = "Northline Title Services"
buf = io.BytesIO()
with zipfile.ZipFile(buf, "w") as z:
    z.writestr("word/document.xml", doc); z.writestr("customXml/item1.xml", ET.tostring(cx, encoding="unicode"))
print("custom XML now:", ET.tostring(cx, encoding="unicode"))
```

### Quiz

1. Which child of `w:sdtPr` should scripts use to identify a control?
- [ ] `w:alias`
- [x] `w:tag`
- [ ] `w:id`
> Aliases are user labels and ids are regenerated by Word; tags are stable machine names.

2. What does `w:dataBinding` do?
- [x] Links the control's value to a node in a custom XML part via XPath
- [ ] Binds the control to a style
- [ ] Locks the control
> Editing the control writes the XML; editing the XML refreshes the control on open.

3. To make a DOCX behave like a fillable form where only fields can be edited you combine content controls with…
- [ ] `w:lock` on every paragraph
- [x] `w:documentProtection w:edit="forms"` in settings.xml
- [ ] A macro
> Forms protection limits editing to controls (and legacy form fields).

### Exercises

1. **Fill a text control** — Write a function that sets a text control's value by tag, replacing its content and removing the placeholder flag.
<details><summary>Solution</summary>

```python
def set_sdt(root, tag_name, value):
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    for sdt in root.iter(W + "sdt"):
        tag = sdt.find(W + "sdtPr/" + W + "tag")
        if tag is not None and tag.get(W + "val") == tag_name:
            pr, content = sdt.find(W + "sdtPr"), sdt.find(W + "sdtContent")
            ph = pr.find(W + "showingPlcHdr")
            if ph is not None: pr.remove(ph)
            for child in list(content): content.remove(child)
            r = ET.SubElement(content, W + "r"); t = ET.SubElement(r, W + "t"); t.text = value
            return True
    return False
```

</details>

2. **Toggle a check box** — Set a `w14:checkbox` control to checked or unchecked, updating both the property and the glyph.
<details><summary>Solution</summary>

```python
def set_checkbox(sdt, checked):
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"; W14 = "{http://schemas.microsoft.com/office/word/2010/wordml}"
    sdt.find(W + "sdtPr/" + W14 + "checkbox/" + W14 + "checked").set(W14 + "val", "1" if checked else "0")
    for t in sdt.find(W + "sdtContent").iter(W + "t"): t.text = "☒" if checked else "☐"
```

</details>

### Interview Questions

**Q: What is a content control and how does it differ from a legacy form field or a placeholder string?**
A content control is a `w:sdt` element with properties (alias, tag, type, lock, optional data binding) and content; it is a first-class structure Word understands, so it can be typed (date, dropdown, checkbox), locked, and bound to XML. Legacy form fields are `w:fldChar` `FORMTEXT`/`FORMCHECKBOX` fields from Word 97 that need forms protection and have no data binding. A placeholder string such as `{{client}}` is just text: easy for find-and-replace, invisible to Word, and fragile because Word splits runs. For client templates that humans fill, I use content controls with tags; for machine-generated documents I use placeholders with a patcher; and for both I put the values in a custom XML part when the same data must appear in several places.

**Q: Explain data binding and a real use for it.**
`w:dataBinding` on a control holds an XPath, prefix mappings and the GUID of a custom XML part in `customXml/`; Word keeps the control's text and the XML node in sync in both directions. A real use is a settlement statement template where the buyer's name appears in the header, the body and a signature block: one custom XML node, three bound controls, and a Python script that writes the XML part from the production database before the file is opened, without touching document.xml at all. The same mechanism lets a reviewer's edits in Word be read back by a script as clean XML, which is how I collect data from returned intake forms.

**Q: What are the common ways scripts corrupt documents with content controls?**
Duplicating an sdt without assigning a fresh `w:id`, so Word finds two controls with the same id and drops or merges them; writing a check box's glyph without `w14:checked` or vice versa, giving a control that displays one state and stores another; replacing `w:sdtContent` with runs at block level or paragraphs at run level, which violates the schema; and deleting a custom XML part that bound controls still reference, so every bound control shows stale text and Word reports an error when the user edits it. I validate ids for uniqueness, keep the content level consistent with the control's position, and remove `w:dataBinding` if I remove the part.

## Comments and tracked changes XML

Review workflows leave two kinds of marks in a DOCX: **comments**, stored in a separate part and anchored by range markers, and **tracked changes**, stored inline as `w:ins`, `w:del` and property-change elements. Reading them lets you build audit reports and accept or reject changes programmatically; misunderstanding them lets an extractor silently include deleted text or miss inserted text.

### Comments

Three pieces again: the part, the relationship, and the anchors.

`word/comments.xml`:

```xml
<w:comments xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:comment w:id="0" w:author="Ali Raza" w:date="2026-09-16T10:15:00Z" w:initials="AR">
    <w:p><w:pPr><w:pStyle w:val="CommentText"/></w:pPr>
      <w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:annotationRef/></w:r>
      <w:r><w:t>Confirm the 2026 rate before publishing.</w:t></w:r></w:p>
  </w:comment>
</w:comments>
```

Anchors in `document.xml`:

```xml
<w:p>
  <w:commentRangeStart w:id="0"/>
  <w:r><w:t>Owner's policy rate: $575.00</w:t></w:r>
  <w:commentRangeEnd w:id="0"/>
  <w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="0"/></w:r>
</w:p>
```

The relationship type is `.../relationships/comments` and the content type is `application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml`. Word 2013+ adds `commentsExtended.xml` (`w15:commentEx` with `w15:paraIdParent` for replies and `w15:done` for resolved), `commentsIds.xml` and `commentsExtensible.xml`; deleting comments.xml without these leaves dangling references, so remove all four parts and their relationships together.

### Tracked changes

Insertions wrap runs; deletions wrap runs whose text uses `w:delText`:

```xml
<w:p>
  <w:r><w:t xml:space="preserve">The premium is </w:t></w:r>
  <w:del w:id="3" w:author="Ali Raza" w:date="2026-09-16T10:20:00Z">
    <w:r><w:delText>$550.00</w:delText></w:r>
  </w:del>
  <w:ins w:id="4" w:author="Ali Raza" w:date="2026-09-16T10:20:00Z">
    <w:r><w:t>$575.00</w:t></w:r>
  </w:ins>
</w:p>
```

Other revision types:

| Element | Where | Meaning |
|---|---|---|
| `w:rPrChange` | inside `w:rPr` | run formatting changed; holds the old `w:rPr` |
| `w:pPrChange` | inside `w:pPr` | paragraph formatting changed |
| `w:ins` / `w:del` inside `w:rPr` of the paragraph mark | `w:pPr/w:rPr` | paragraph inserted or paragraphs merged |
| `w:tblPrChange`, `w:trPrChange`, `w:tcPrChange` | tables | table formatting changes |
| `w:cellIns`, `w:cellDel`, `w:cellMerge` | `w:tcPr` | table cell structure changes |
| `w:moveFrom` / `w:moveTo` with range markers | body | moved text, shown green in Word |
| `w:numberingChange` | `w:numPr` | list numbering changed |

`w:trackRevisions` in settings.xml turns tracking on for future edits; it does not affect existing marks.

### Accepting and rejecting in code

Accept all: unwrap `w:ins` (keep children), remove `w:del` entirely, drop `w:rPrChange`/`w:pPrChange`. Reject all: remove `w:ins`, unwrap `w:del` and rename `w:delText` to `w:t`, restore properties from the change elements.

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

def accept_all(root):
    for parent in root.iter():
        for child in list(parent):
            if child.tag == W + "ins":
                idx = list(parent).index(child)
                for grand in list(child): parent.insert(idx, grand); idx += 1
                parent.remove(child)
            elif child.tag == W + "del":
                parent.remove(child)
            elif child.tag in (W + "rPrChange", W + "pPrChange"):
                parent.remove(child)
```

Iterating while mutating needs care in ElementTree; a two-pass approach (collect, then edit) or lxml's `getparent()` makes this cleaner, which the Expert level uses.

### Text extraction with revisions

An extractor that joins every `w:t` produces the accepted text, because deleted text is in `w:delText`. To produce the *original* text, take `w:delText` and skip runs inside `w:ins`. Reports for a client often need both: "what changed", which is a diff of the two.

### Author and date hygiene

Every `w:ins`, `w:del` and `w:comment` carries `w:author` and `w:date`. `w:removePersonalInformation` and `w:removeDateAndTime` in settings.xml make Word anonymise on save, and scripts can rewrite authors to "Reviewer" before a document leaves the company. `w:rsid` attributes (revision save ids) on runs are unrelated to tracked changes; they are session identifiers and can be stripped without effect.

> **Interview note:** "How do you get the text of a document with tracked changes?" The answer depends on which version they want, and saying so is the point: `w:t` gives the accepted version, `w:delText` plus non-inserted `w:t` gives the original.

### Try It Yourself

```python
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
w = lambda t: f"{{{W}}}{t}"
doc = f'''<w:document xmlns:w="{W}"><w:body>
<w:p><w:commentRangeStart w:id="0"/><w:r><w:t xml:space="preserve">The premium is </w:t></w:r>
<w:del w:id="3" w:author="Ali Raza" w:date="2026-09-16T10:20:00Z"><w:r><w:delText>$550.00</w:delText></w:r></w:del>
<w:ins w:id="4" w:author="Ali Raza" w:date="2026-09-16T10:20:00Z"><w:r><w:t>$575.00</w:t></w:r></w:ins>
<w:r><w:t xml:space="preserve"> per policy.</w:t></w:r><w:commentRangeEnd w:id="0"/><w:r><w:commentReference w:id="0"/></w:r></w:p>
<w:p><w:ins w:id="5" w:author="QA Lead" w:date="2026-09-16T11:00:00Z"><w:r><w:t>Rates effective 1 October 2026.</w:t></w:r></w:ins></w:p>
</w:body></w:document>'''
comments = f'''<w:comments xmlns:w="{W}"><w:comment w:id="0" w:author="QA Lead" w:date="2026-09-16T10:30:00Z"><w:p><w:r><w:t>Confirm with underwriting.</w:t></w:r></w:p></w:comment></w:comments>'''

root = ET.fromstring(doc)

def text(p, version):
    out = []
    for el in p.iter():
        if el.tag == w("t"):
            inside_ins = any(a.tag == w("ins") for a in ancestors(p, el))
            if version == "accepted" or not inside_ins: out.append(el.text or "")
        elif el.tag == w("delText") and version == "original":
            out.append(el.text or "")
    return "".join(out)

def ancestors(root_el, target):
    parents = {c: p for p in root_el.iter() for c in p}
    chain, node = [], target
    while node in parents: node = parents[node]; chain.append(node)
    return chain

for i, p in enumerate(root.iter(w("p")), 1):
    print(f"p{i} original: {text(p, 'original')!r}")
    print(f"p{i} accepted: {text(p, 'accepted')!r}")

revs = [(el.tag.split('}')[1], el.get(w("author")), el.get(w("date"))) for el in root.iter() if el.tag in (w("ins"), w("del"))]
print("revisions:", revs)
for c in ET.fromstring(comments).iter(w("comment")):
    anchor_p = next(p for p in root.iter(w("p")) if p.find(f".//{w('commentRangeStart')}[@{w('id')}='{c.get(w('id'))}']") is not None)
    print(f"comment {c.get(w('id'))} by {c.get(w('author'))}: {''.join(t.text for t in c.iter(w('t')))!r} on {text(anchor_p, 'accepted')!r}")
```

### Quiz

1. Where is the text of a tracked deletion stored?
- [ ] In `w:t` inside `w:del`
- [x] In `w:delText` inside `w:del`
- [ ] In comments.xml
> Using `w:delText` keeps naive extractors from including deleted text.

2. Which parts must be removed together to delete all comments from a modern Word file?
- [ ] comments.xml only
- [x] comments.xml, commentsExtended.xml, commentsIds.xml, commentsExtensible.xml and their relationships, plus the anchors in document.xml
- [ ] document.xml anchors only
> Leaving any reference dangling produces errors or ghost comments.

3. What does `w:rPrChange` contain?
- [x] The run properties as they were before the tracked formatting change
- [ ] The new properties
- [ ] The author only
> The current properties are the siblings in `w:rPr`; the change element preserves the old ones.

### Exercises

1. **Revision report** — Produce a list of (author, type, text) for every insertion and deletion in a document.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
report = []
for el in root.iter():
    if el.tag in (W + "ins", W + "del"):
        kind = el.tag.split("}")[1]
        txt = "".join(t.text or "" for t in el.iter() if t.tag in (W + "t", W + "delText"))
        report.append((el.get(W + "author"), kind, txt))
for row in report: print(row)
```

</details>

2. **Anonymise reviewers** — Replace every `w:author` and `w:initials` with "Reviewer" and strip `w:date` from revisions and comments.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
for r in (doc_root, comments_root):
    for el in r.iter():
        if el.get(W + "author") is not None:
            el.set(W + "author", "Reviewer")
            if el.get(W + "initials") is not None: el.set(W + "initials", "R")
            if el.get(W + "date") is not None: del el.attrib[W + "date"]
```

</details>

### Interview Questions

**Q: How are tracked changes stored, and how would you accept all changes without Word?**
Insertions wrap runs in `w:ins`, deletions wrap them in `w:del` with the text in `w:delText`, formatting changes keep the previous properties in `w:rPrChange` or `w:pPrChange`, paragraph-mark changes sit in `w:pPr/w:rPr`, and tables have their own `w:cellIns`, `w:cellDel` and property-change elements; every mark has an author, date and id. Accepting all means unwrapping `w:ins` so its runs join the parent, deleting `w:del` subtrees, removing the property-change elements, and handling paragraph-mark deletions by merging the paragraph with the next one. I do it with lxml because parent access makes unwrapping safe, then verify by confirming no `w:ins`, `w:del`, `w:delText` or `*Change` elements remain and by comparing the extracted text with Word's own accept-all on a sample.

**Q: What is the difference between comments and tracked changes from a data-model view?**
Tracked changes are inline: they change the structure of the body and affect what the text "is" depending on whether you accept or reject them. Comments are external annotations: the comment text lives in comments.xml (with modern extensions for replies and resolution in commentsExtended.xml and related parts) and the body only carries range-start, range-end and reference markers with matching ids that do not alter the content. That is why removing comments is a matter of deleting parts and markers, while removing revisions requires deciding accept or reject for each.

**Q: A client asks for a report of everything a reviewer changed in a 300-page manual. How do you build it?**
I walk document.xml with lxml collecting every `w:ins`, `w:del`, `w:moveFrom`, `w:moveTo`, `w:rPrChange` and `w:pPrChange`, recording author, date, the affected text, the surrounding paragraph's heading (found by walking back to the nearest `Heading` styled paragraph) and the page if a PDF render is available. I add comments from comments.xml with their anchored text and resolution state from commentsExtended.xml. The output is an Excel sheet grouped by section with counts per author, which is what a QA lead at a BPO actually wants, and the same script can then accept or reject by id once the client decides.

# LEVEL: Expert

## Editing DOCX safely with zipfile and lxml

Every earlier chapter edited XML in memory. Production work means opening a client's real file, changing one part, and writing a package that Word opens without complaint. The rules are few but unforgiving: rewrite the ZIP rather than patching it, keep `[Content_Types].xml` first, preserve every namespace declaration, and never let ElementTree near a file you intend to give back. This chapter is the reusable pattern Ali's repair and rebrand scripts share.

### Why not edit the ZIP in place

`zipfile` cannot replace an entry; `ZipFile("x.docx", "a")` with a duplicate name appends a second entry and Word reads whichever it finds first, usually reporting corruption. The correct pattern copies every entry to a new archive and substitutes the ones you changed:

```python
import zipfile, shutil, os

def rewrite_docx(src, dst, edits):
    """edits: dict of {zip_name: bytes or callable(bytes) -> bytes}"""
    tmp = dst + ".tmp"
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            edit = edits.get(item.filename)
            if callable(edit): data = edit(data)
            elif edit is not None: data = edit
            zout.writestr(item, data)
        for name, data in edits.items():
            if name not in zin.namelist():
                zout.writestr(name, data if not callable(data) else data(b""))
    os.replace(tmp, dst)
```

Passing `item` (the `ZipInfo`) rather than the name preserves timestamps and compression type. Writing to a temporary path and `os.replace` means a crash never leaves a half-written deliverable.

### Entry order and compression

Word tolerates any order, but the OPC spec recommends `[Content_Types].xml` first and some validators and older readers expect it. Copying in the original order keeps that. Everything should be `ZIP_DEFLATED`; `ZIP_STORED` is legal but inflates the file. Never use `ZIP_BZIP2` or `ZIP_LZMA`, which Word does not read.

### lxml for the XML

```python
from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}

def edit_document(xml_bytes):
    root = etree.fromstring(xml_bytes)
    for t in root.xpath("//w:t[contains(text(), '2025')]", namespaces=NS):
        t.text = t.text.replace("2025", "2026")
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
```

Three details make lxml safe where ElementTree is not:

- It preserves every namespace declaration on the root, including those only referenced by `mc:Ignorable`.
- `xml_declaration=True, encoding="UTF-8", standalone=True` reproduces Word's `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` header.
- `getparent()` and `addnext()` make structural edits (unwrap `w:ins`, insert a paragraph after a heading) straightforward.

Parse with `etree.XMLParser(remove_blank_text=False)` (the default); pretty-printing changes whitespace inside `w:t` and corrupts text with `xml:space="preserve"`.

### Text spanning runs

The classic failure of naive find-and-replace is text split across runs: `Stew`, `art Ti`, `tle`. A robust replace joins the paragraph's text, finds matches, and then rewrites the runs:

```python
def replace_in_paragraph(p, old, new):
    runs = p.xpath(".//w:r[w:t]", namespaces=NS)
    texts = [r.find("w:t", NS).text or "" for r in runs]
    full = "".join(texts)
    if old not in full: return False
    full = full.replace(old, new)
    # put all text in the first run, empty the rest (keeps first run's formatting)
    runs[0].find("w:t", NS).text = full
    runs[0].find("w:t", NS).set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    for r in runs[1:]:
        r.find("w:t", NS).text = ""
    return True
```

This loses formatting differences between runs, which is acceptable for placeholders and wrong for mixed-format sentences; a formatting-preserving version maps character offsets back to runs and only edits the runs the match touches.

### Structural edits with lxml

```python
def insert_after(p, new_p):        # add a paragraph after p
    p.addnext(new_p)

def unwrap(el):                     # replace element with its children (accept a w:ins)
    parent = el.getparent(); idx = parent.index(el)
    for child in list(el): parent.insert(idx, child); idx += 1
    parent.remove(el)

def clone(el):
    return etree.fromstring(etree.tostring(el))
```

`w:sectPr` must remain the last child of `w:body`; when appending paragraphs use `body.insert(body.index(sectPr), p)`.

### Validating before you ship

A generated or edited package should pass three checks before it goes to a client:

1. Every relationship target exists and every part with a non-default extension has a content type.
2. `document.xml` parses and `w:body` ends with `w:sectPr`.
3. LibreOffice headless can convert it to PDF (`soffice --headless --convert-to pdf`), which catches most schema violations Word would refuse.

The Open XML SDK's validator (`dotnet` tool `OpenXmlValidator`) is the gold standard when available; it reports the exact element and rule.

> **Warning:** A file that opens in LibreOffice can still fail in Word. Word enforces element order inside `w:pPr`/`w:rPr` (for example `w:rFonts` before `w:b` before `w:sz`) and unique `wp:docPr` ids; LibreOffice does not. Test in Word before delivery whenever the edit touches property elements.

### Try It Yourself

```python
import zipfile, io, xml.etree.ElementTree as ET

# Build a minimal package, then rewrite it with a substituted part, preserving order and metadata.
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", W)
src = io.BytesIO()
with zipfile.ZipFile(src, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
    z.writestr("_rels/.rels", '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
    z.writestr("word/document.xml", f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="{W}"><w:body><w:p><w:r><w:t>Stew</w:t></w:r><w:r><w:t>art Title 2025</w:t></w:r></w:p><w:sectPr/></w:body></w:document>')

def replace_split_text(xml_bytes, old, new):
    root = ET.fromstring(xml_bytes)
    changed = 0
    for p in root.iter(f"{{{W}}}p"):
        ts = [r.find(f"{{{W}}}t") for r in p.findall(f"{{{W}}}r") if r.find(f"{{{W}}}t") is not None]
        full = "".join(t.text or "" for t in ts)
        if old in full:
            ts[0].text = full.replace(old, new); ts[0].set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
            for t in ts[1:]: t.text = ""
            changed += 1
    return b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + ET.tostring(root, encoding="utf-8"), changed

dst = io.BytesIO()
with zipfile.ZipFile(io.BytesIO(src.getvalue())) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "word/document.xml":
            data, n = replace_split_text(data, "Stewart Title 2025", "Stewart Title 2026")
            print("paragraphs changed:", n)
        zout.writestr(item, data)

with zipfile.ZipFile(io.BytesIO(dst.getvalue())) as z:
    print("entry order:", z.namelist())
    print("first entry is content types:", z.namelist()[0] == "[Content_Types].xml")
    doc = z.read("word/document.xml").decode()
    print("declaration kept:", doc.startswith("<?xml"), "| text:", "".join(t.text or "" for t in ET.fromstring(doc).iter(f"{{{W}}}t")))
```

### Quiz

1. Why can you not replace `word/document.xml` inside an existing ZIP with `zipfile` in append mode?
- [ ] Append mode is read-only
- [x] It adds a duplicate entry instead of replacing, and Word reads the wrong one
- [ ] The file becomes uncompressed
> Always copy to a new archive, substituting the changed parts.

2. Which lxml `tostring` options reproduce Word's XML header?
- [x] `xml_declaration=True, encoding="UTF-8", standalone=True`
- [ ] `pretty_print=True`
- [ ] `method="html"`
> Pretty printing changes whitespace and can corrupt preserved-space text.

3. What is the risk in a naive `w:t` find-and-replace?
- [ ] It is slow
- [x] Matches split across runs are missed
- [ ] It changes styles
> Join the paragraph text first, then rewrite runs.

### Exercises

1. **Generic part editor** — Write `edit_part(src, dst, part_name, fn)` that applies `fn(bytes) -> bytes` to one part and copies everything else unchanged, atomically.
<details><summary>Solution</summary>

```python
import zipfile, os
def edit_part(src, dst, part_name, fn):
    tmp = dst + ".tmp"
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            zout.writestr(item, fn(data) if item.filename == part_name else data)
    os.replace(tmp, dst)
```

</details>

2. **Package lint** — Check that every relationship target in every `.rels` file exists in the package and report missing ones.
<details><summary>Solution</summary>

```python
import zipfile, posixpath, xml.etree.ElementTree as ET
def lint(path):
    with zipfile.ZipFile(path) as z:
        names = set(z.namelist()); missing = []
        for n in names:
            if not n.endswith(".rels"): continue
            base = posixpath.dirname(posixpath.dirname(n))      # word/_rels/document.xml.rels -> word
            for r in ET.fromstring(z.read(n)):
                if r.get("TargetMode") == "External": continue
                target = posixpath.normpath(posixpath.join(base, r.get("Target"))).lstrip("/")
                if target not in names: missing.append((n, r.get("Target")))
    return missing
```

</details>

### Interview Questions

**Q: Describe your procedure for safely editing a client's DOCX programmatically.**
Copy the package entry by entry into a new archive using the original `ZipInfo` so order, timestamps and DEFLATE are preserved, substituting only the parts I change; write to a temporary path and `os.replace` it so a crash never damages the deliverable. Parse the XML with lxml, never ElementTree, so namespace declarations required by `mc:Ignorable` survive, and serialise with an explicit UTF-8 declaration and `standalone="yes"`. Text edits join run text per paragraph before matching, structural edits keep `w:sectPr` last in the body and property elements in schema order, and every new drawing or control gets a unique id. Then I run a package lint for relationships and content types, convert with LibreOffice as a smoke test, and open in Word for anything that touched property elements, because Word is stricter about element order.

**Q: What are the differences between python-docx and direct lxml editing, and when do you choose each?**
python-docx is a typed wrapper over the same lxml tree: it handles the package, relationships and common operations such as paragraphs, runs, tables and pictures, and exposes `element` for anything else. I use it when the task fits its API, because it manages content types and relationship ids for me. I drop to lxml directly for headers and footers per section, fields, content controls, comments, tracked changes, numbering definitions and any bulk transformation across parts, where python-docx has no API or is too slow because it re-walks the tree per call. The two combine well: open with python-docx, edit `document.element.body` with XPath, and let python-docx save the package.

**Q: How do you make a bulk edit across 5,000 documents both fast and safe?**
Process files in a multiprocessing pool with one worker per core, each doing the copy-and-substitute rewrite in memory with `io.BytesIO` and writing atomically. Each worker returns a small result record: file name, number of edits, warnings, and a hash of the output, and the driver writes a CSV report. Before the bulk run I take a random sample of fifty, run the same code, convert the outputs with LibreOffice, and diff extracted text against expectations. Files that produce zero edits or unexpected warnings are quarantined for manual review rather than delivered, since "the script ran on all 5,000" is not the same as "all 5,000 are right".

## Repairing corrupt documents and validation errors

"Word found unreadable content in X.docx. Do you want to recover the contents?" is the message clients send with a screenshot. Nine times out of ten the cause is one of a short list of package or schema mistakes, and the file can be fixed in minutes once you know how to find the offending element. This chapter is the diagnostic method and the catalogue of causes.

### Step 1: is it a ZIP?

```python
import zipfile
print(zipfile.is_zipfile("broken.docx"))
with zipfile.ZipFile("broken.docx") as z:
    print(z.testzip())          # None if all CRCs pass, else the first bad entry
    print(z.namelist()[:5])
```

A file that is not a ZIP is either a renamed `.doc` (starts with `D0 CF 11 E0`), an HTML or RTF file, or truncated. A bad CRC means a transfer error; ask for the file again. If `[Content_Types].xml` is not present, the package cannot be opened by any Office application.

### Step 2: does every part parse?

```python
from lxml import etree
with zipfile.ZipFile("broken.docx") as z:
    for name in z.namelist():
        if name.endswith((".xml", ".rels")):
            try: etree.fromstring(z.read(name))
            except etree.XMLSyntaxError as e: print(name, e)
```

Malformed XML comes from string templating: an unescaped `&` in a client name (`Smith & Sons`), a `<` in text, or a control character such as `\x0b` pasted from Excel. Escape with `xml.sax.saxutils.escape` and strip characters outside the XML 1.0 range before building text.

### Step 3: package-level checks

| Problem | Symptom | Fix |
|---|---|---|
| Relationship target missing | unreadable content, image placeholders | add the part or remove the relationship and its reference |
| Part without content type | unreadable content | add `Override` or `Default` |
| Duplicate ZIP entries | opens as blank or corrupt | rewrite the ZIP |
| `_rels/.rels` not pointing at `word/document.xml` | "file is corrupt and cannot be opened" | fix the officeDocument relationship |
| Header/footer referenced with a wrong `r:id` | blank headers or corrupt | align ids between `.rels` and `w:sectPr` |

### Step 4: schema-level checks

These are the ones LibreOffice forgives and Word does not:

- **Element order** in `w:rPr`: `w:rStyle, w:rFonts, w:b, w:bCs, w:i, w:iCs, w:caps, w:smallCaps, w:strike, w:dstrike, w:outline, w:shadow, w:emboss, w:imprint, w:noProof, w:snapToGrid, w:vanish, w:webHidden, w:color, w:spacing, w:w, w:kern, w:position, w:sz, w:szCs, w:highlight, w:u, w:effect, w:bdr, w:shd, w:fitText, w:vertAlign, w:rtl, w:cs, w:em, w:lang, w:eastAsianLayout, w:specVanish, w:oMath`. A `w:sz` before `w:b` is rejected.
- **Element order** in `w:pPr`: `w:pStyle, w:keepNext, w:keepLines, w:pageBreakBefore, w:framePr, w:widowControl, w:numPr, w:suppressLineNumbers, w:pBdr, w:shd, w:tabs, w:suppressAutoHyphens, w:kinsoku, w:wordWrap, w:overflowPunct, w:topLinePunct, w:autoSpaceDE, w:autoSpaceDN, w:bidi, w:adjustRightInd, w:snapToGrid, w:spacing, w:ind, w:contextualSpacing, w:mirrorIndents, w:suppressOverlap, w:jc, w:textDirection, w:textAlignment, w:textboxTightWrap, w:outlineLvl, w:divId, w:cnfStyle, w:rPr, w:sectPr, w:pPrChange`.
- **`w:tc` without a `w:p`**, or a `w:tr` with no `w:tc`.
- **`w:tblGrid` column count** smaller than the widest row's cell count.
- **Duplicate `wp:docPr/@id`** across body, headers and footers.
- **Duplicate bookmark or comment ids**, or a `w:bookmarkStart` without its `w:bookmarkEnd`.
- **`w:sectPr` not last** in `w:body`, or content after it.
- **`w:hyperlink` with `r:id`** whose relationship lacks `TargetMode="External"`.
- **A drawing outside a run**, or `w:t` directly inside `w:p`.
- **Invalid attribute values**: `w:color w:val="#FF0000"`, `w:val="true"` where the schema wants `1`/`0`/`on`/`off` (Word accepts `true` in Transitional but some validators do not), negative `w:sz`.

### Bisecting a large document

When the error is somewhere in 700 pages, bisect: save a copy with the second half of `w:body` removed (keep `w:sectPr`), test in Word, and halve again. Ten iterations locate one paragraph in a thousand. Automate the "test" with LibreOffice for the package-level class of errors, but the schema-order class needs Word or the Open XML SDK validator.

### Using the Open XML SDK validator

```bash
dotnet tool install -g OpenXmlPowerTools-Cli    # or a small C# script using DocumentFormat.OpenXml.Validation
```

`OpenXmlValidator.Validate(doc)` returns each error with `Description`, `Path.XPath` and the part, which points straight at the offending element. Keep a Windows or Linux `.NET` container for this; it is the single most time-saving tool for generator development.

### Recovery when the client only has the broken file

Word's own "Recover" often succeeds; ask the client to open, accept recovery, and Save As a new name, then send that. If Word cannot recover, LibreOffice frequently can, and a round-trip through LibreOffice (open, save as DOCX) produces a valid if slightly restyled file. As a last resort, extract text and tables from `document.xml` with lxml `recover=True` and rebuild.

> **Interview note:** Interviewers ask "how do you debug a corrupt DOCX?" to hear a method, not a guess: verify ZIP, parse each part, check relationships and content types, then schema order, then bisect. Naming the Open XML SDK validator shows real experience.

### Try It Yourself

```python
import zipfile, io, xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
CT = "http://schemas.openxmlformats.org/package/2006/content-types"
PR = "http://schemas.openxmlformats.org/package/2006/relationships"

RPR_ORDER = ["rStyle", "rFonts", "b", "bCs", "i", "iCs", "caps", "smallCaps", "strike", "dstrike", "outline", "shadow", "emboss", "imprint", "noProof", "snapToGrid", "vanish", "webHidden", "color", "spacing", "w", "kern", "position", "sz", "szCs", "highlight", "u", "effect", "bdr", "shd", "fitText", "vertAlign", "rtl", "cs", "em", "lang", "eastAsianLayout", "specVanish", "oMath"]

client = "Smith & Sons <Title>"
bad_doc = f'<w:document xmlns:w="{W}"><w:body><w:p><w:r><w:rPr><w:sz w:val="24"/><w:b/></w:rPr><w:t>{client}</w:t></w:r></w:p><w:tbl><w:tblGrid><w:gridCol w:w="100"/></w:tblGrid><w:tr><w:tc><w:tcPr/></w:tc></w:tr></w:tbl><w:sectPr/></w:body></w:document>'

def diagnose(xml_text):
    problems = []
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as e:
        return [f"XML not well-formed: {e}"]
    for rpr in root.iter(f"{{{W}}}rPr"):
        order = [c.tag.split('}')[1] for c in rpr]
        if order != sorted(order, key=lambda t: RPR_ORDER.index(t) if t in RPR_ORDER else 999):
            problems.append(f"rPr children out of schema order: {order}")
    for tc in root.iter(f"{{{W}}}tc"):
        if tc.find(f"{{{W}}}p") is None: problems.append("w:tc without w:p")
    body = root.find(f"{{{W}}}body")
    if body is not None and list(body)[-1].tag != f"{{{W}}}sectPr": problems.append("w:sectPr is not the last child of w:body")
    return problems

print("before:", diagnose(bad_doc))
fixed = bad_doc.replace(client, escape(client)).replace('<w:sz w:val="24"/><w:b/>', '<w:b/><w:sz w:val="24"/>').replace("<w:tcPr/></w:tc>", "<w:tcPr/><w:p/></w:tc>")
print("after :", diagnose(fixed) or "no problems found")
print("escaped text:", escape(client))
```

### Quiz

1. Word says "unreadable content" but LibreOffice opens the file fine. The most likely class of error is…
- [ ] A bad ZIP CRC
- [x] Schema violations such as property element order or duplicate ids
- [ ] Missing `[Content_Types].xml`
> LibreOffice is lenient about schema order; Word is not.

2. What does an unescaped `&` in a client name cause?
- [x] Malformed XML, so the part fails to parse
- [ ] A missing relationship
- [ ] A font substitution
> Escape text with `xml.sax.saxutils.escape` before templating.

3. How do you find one bad paragraph in a 700-page document?
- [ ] Read the XML from the top
- [x] Bisect the body, testing each half
- [ ] Re-save from LibreOffice
> Ten halvings isolate one paragraph in a thousand.

### Exercises

1. **Well-formedness scan** — Report every XML part in a package that fails to parse, with the parser's message.
<details><summary>Solution</summary>

```python
import zipfile, xml.etree.ElementTree as ET
def scan(path):
    with zipfile.ZipFile(path) as z:
        for name in z.namelist():
            if name.endswith((".xml", ".rels")):
                try: ET.fromstring(z.read(name))
                except ET.ParseError as e: print(name, "->", e)
```

</details>

2. **Property reorder** — Reorder the children of every `w:rPr` in a tree into schema order.
<details><summary>Solution</summary>

```python
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
def fix_rpr_order(root):
    for rpr in root.iter(W + "rPr"):
        kids = list(rpr)
        kids.sort(key=lambda c: RPR_ORDER.index(c.tag.split("}")[1]) if c.tag.split("}")[1] in RPR_ORDER else 999)
        for c in list(rpr): rpr.remove(c)
        for c in kids: rpr.append(c)
```

</details>

### Interview Questions

**Q: Give me your ordered checklist for a DOCX that Word calls corrupt.**
First `zipfile.is_zipfile` and `testzip` to rule out transfer damage and renamed `.doc` files. Second, parse every `.xml` and `.rels` part with lxml to catch malformed XML from unescaped characters. Third, package integrity: every relationship target exists, every part has a content type, `_rels/.rels` points at `word/document.xml`, no duplicate entries. Fourth, schema: property element order in `w:rPr` and `w:pPr`, cells without paragraphs, `w:sectPr` last, unique `wp:docPr` and bookmark ids, drawings inside runs. If the cause is still unknown, bisect the body and test halves in Word, or run the Open XML SDK validator, which names the element directly. I keep this as a script that prints findings in that order so the report goes to the client with the fix already applied.

**Q: Why does element order matter in OOXML when XML in general is order-insensitive?**
The OOXML schemas define most property groups as `xsd:sequence`, so order is part of the grammar, not a style choice. Word validates against that schema on open and treats a `w:sz` before `w:b` as unreadable content, while LibreOffice uses a tolerant parser that reads elements by name. Generators built by hand from string templates get this wrong easily; libraries like docx-js and python-docx emit the correct order because their serialisers are generated from the schema. When editing with lxml I insert new property elements at the schema position rather than appending, and I keep the canonical order lists in the code.

**Q: A generator that has worked for a year suddenly produces files Word rejects, for some clients only. How do you find the cause?**
Something in those clients' data reaches the XML unescaped or out of range: an ampersand in a company name, a control character pasted from a spreadsheet, an emoji outside the BMP that the template encodes incorrectly, or a very long value that breaks an attribute limit such as a 256-character bookmark name. I diff a failing and a passing output at the part level, parse the failing parts with lxml to get the exact line and column, and trace that text back to the input field. The fix is escaping and character sanitising at the boundary where data enters the generator, plus a regression test with the offending record, so the same class of input never reaches XML unescaped again.

## XLSX internals and PPTX internals overview

The same package rules cover Excel and PowerPoint. Knowing their main parts lets you fix a spreadsheet whose shared strings are broken, read a rate matrix without loading openpyxl, or swap a logo across 40 slides. This chapter maps the parts, shows the cell and slide XML, and points out where each format differs from Word.

### XLSX layout

```
[Content_Types].xml
_rels/.rels
xl/workbook.xml              sheet list, defined names, calc settings
xl/_rels/workbook.xml.rels   sheet parts, styles, sharedStrings, theme
xl/worksheets/sheet1.xml     cells
xl/sharedStrings.xml         de-duplicated text values
xl/styles.xml                number formats, fonts, fills, borders, cellXfs
xl/theme/theme1.xml          same DrawingML theme as Word
xl/calcChain.xml             formula evaluation order (optional, safe to delete)
xl/tables/table1.xml         structured tables
xl/drawings/, xl/charts/     shapes and charts
docProps/core.xml, app.xml
```

### Sheet XML

```xml
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:C3"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <cols><col min="1" max="1" width="18" customWidth="1"/></cols>
  <sheetData>
    <row r="1">
      <c r="A1" t="s" s="1"><v>0</v></c>          <!-- shared string index 0, style 1 -->
      <c r="B1" t="s"><v>1</v></c>
    </row>
    <row r="2">
      <c r="A2"><v>100000</v></c>                  <!-- number -->
      <c r="B2" s="2"><f>A2*0.00575</f><v>575</v></c>   <!-- formula with cached value -->
      <c r="C2" t="inlineStr"><is><t>Wyoming</t></is></c>
    </row>
  </sheetData>
  <mergeCells count="1"><mergeCell ref="A3:C3"/></mergeCells>
</worksheet>
```

| Attribute | Meaning |
|---|---|
| `r` | cell reference; rows and cells must be in ascending order |
| `t` | type: `s` shared string, `str` formula string result, `inlineStr`, `b` boolean, `n` number (default), `e` error, `d` ISO date (rare) |
| `s` | index into `styles.xml` `cellXfs` |
| `<f>` | formula without the leading `=`; `<v>` is the cached result |

Dates are numbers (days since 1899-12-30) with a date number format in the style; there is no date type in normal files. Formulas' cached values are what a reader sees unless it recalculates, so a file written by a script without `<v>` shows empty cells in viewers that do not calculate, and `workbook.xml` needs `<calcPr fullCalcOnLoad="1"/>` to force Excel to recalculate on open.

### sharedStrings.xml

```xml
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="5" uniqueCount="3">
  <si><t>State</t></si>
  <si><t>Liability</t></si>
  <si><r><rPr><b/></rPr><t>Rich </t></r><r><t>text</t></r></si>
</sst>
```

Cells with `t="s"` hold an index into this list. Deleting an `si` shifts every index after it, which is the classic way scripts corrupt spreadsheets: cells suddenly show the wrong words. Append only, or rewrite every reference.

### styles.xml essentials

`numFmts` (custom formats with ids ≥ 164), `fonts`, `fills`, `borders`, then `cellXfs` whose entries combine indexes into those lists; a cell's `s` attribute points at a `cellXfs` entry. Built-in number formats do not appear in `numFmts`: `0` general, `2` `0.00`, `9` `0%`, `14` short date, `44` accounting.

### Reading a sheet without openpyxl

```python
import zipfile, xml.etree.ElementTree as ET
X = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
with zipfile.ZipFile("rates.xlsx") as z:
    sst = [ "".join(t.text or "" for t in si.iter(X + "t")) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).iter(X + "si") ]
    sheet = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    for c in sheet.iter(X + "c"):
        v = c.find(X + "v"); t = c.get("t")
        value = sst[int(v.text)] if t == "s" else (c.find(X + "is/" + X + "t").text if t == "inlineStr" else (v.text if v is not None else None))
        print(c.get("r"), value)
```

This is how Ali's validation scripts check a rate matrix delivered as XLSX against the DOCX table without depending on library versions.

### PPTX layout

```
ppt/presentation.xml          slide id list, slide size
ppt/_rels/presentation.xml.rels
ppt/slides/slide1.xml         one part per slide
ppt/slides/_rels/slide1.xml.rels   layout, images, notes
ppt/slideLayouts/, ppt/slideMasters/
ppt/notesSlides/
ppt/media/
ppt/theme/theme1.xml
```

Slides inherit from a layout, which inherits from a master; placeholders (`p:ph type="title"`) on a slide take position and formatting from the layout unless overridden. A slide:

```xml
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>
    <p:sp>
      <p:nvSpPr><p:cNvPr id="2" name="Title 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
      <p:spPr/>
      <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/><a:t>Q3 Production Report</a:t></a:r></a:p></p:txBody>
    </p:sp>
    <p:pic>...<a:blip r:embed="rId2"/>...</p:pic>
  </p:spTree></p:cSld>
</p:sld>
```

Text in PowerPoint is DrawingML (`a:p`, `a:r`, `a:t`) inside `p:txBody`, positions are EMUs in `a:xfrm`, and every shape needs a unique `p:cNvPr/@id` within its slide. Slide order is the `p:sldIdLst` in `presentation.xml`, not file names; deleting a slide means removing its id entry, its relationship, the part and its `.rels`, and its notes slide.

### Cross-format facts worth knowing

| | DOCX | XLSX | PPTX |
|---|---|---|---|
| Main part | `word/document.xml` | `xl/workbook.xml` | `ppt/presentation.xml` |
| Text element | `w:t` | `<v>`/`sharedStrings` | `a:t` |
| Units | twips, EMU for drawings | column widths in characters, EMU for drawings | EMU |
| Theme | `word/theme/theme1.xml` | `xl/theme/theme1.xml` | `ppt/theme/theme1.xml` |
| Style sheet | `styles.xml` | `styles.xml` (cellXfs) | masters and layouts |

> **Tip:** `xl/calcChain.xml` can be deleted (together with its relationship and content type) when a script has changed formulas; Excel rebuilds it. Leaving a stale calcChain is a common cause of "Excel found unreadable content" in generated workbooks.

### Try It Yourself

```python
import zipfile, io, xml.etree.ElementTree as ET

X = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
ET.register_namespace("", X)
rows = [("State", "Liability", "Rate"), ("Wyoming", 100000, None), ("Colorado", 100000, None)]
strings = []
def sidx(s):
    if s not in strings: strings.append(s)
    return strings.index(s)

def col(n): return chr(ord("A") + n)
cells = []
for r, row in enumerate(rows, start=1):
    cs = []
    for c, val in enumerate(row):
        ref = f"{col(c)}{r}"
        if isinstance(val, str): cs.append(f'<c r="{ref}" t="s"><v>{sidx(val)}</v></c>')
        elif val is None: cs.append(f'<c r="{ref}"><f>B{r}*0.00575</f><v>{100000 * 0.00575}</v></c>')
        else: cs.append(f'<c r="{ref}"><v>{val}</v></c>')
    cells.append(f'<row r="{r}">{"".join(cs)}</row>')
sheet = f'<worksheet xmlns="{X}"><sheetData>{"".join(cells)}</sheetData></worksheet>'
sst = f'<sst xmlns="{X}" count="{len(strings)}" uniqueCount="{len(strings)}">' + "".join(f"<si><t>{s}</t></si>" for s in strings) + "</sst>"
workbook = f'<workbook xmlns="{X}"><sheets><sheet name="Rates" sheetId="1" r:id="rId1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/></sheets><calcPr fullCalcOnLoad="1"/></workbook>'

buf = io.BytesIO()
with zipfile.ZipFile(buf, "w") as z:
    z.writestr("xl/workbook.xml", workbook); z.writestr("xl/worksheets/sheet1.xml", sheet); z.writestr("xl/sharedStrings.xml", sst)

# Read it back the generic way
with zipfile.ZipFile(io.BytesIO(buf.getvalue())) as z:
    sst_list = ["".join(t.text or "" for t in si.iter(f"{{{X}}}t")) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).iter(f"{{{X}}}si")]
    for row in ET.fromstring(z.read("xl/worksheets/sheet1.xml")).iter(f"{{{X}}}row"):
        out = []
        for c in row.iter(f"{{{X}}}c"):
            v, f = c.find(f"{{{X}}}v"), c.find(f"{{{X}}}f")
            val = sst_list[int(v.text)] if c.get("t") == "s" else v.text
            out.append(f"{c.get('r')}={val}" + (f" (={f.text})" if f is not None else ""))
        print("  ".join(out))
print("shared strings:", sst_list)
```

### Quiz

1. In sheet XML, `<c r="A1" t="s"><v>3</v></c>` means…
- [ ] The number 3
- [x] The fourth entry of sharedStrings.xml
- [ ] The string "3"
> `t="s"` marks a shared string index.

2. Why does deleting an `si` element from sharedStrings.xml corrupt a workbook?
- [x] Every later index shifts, so cells show the wrong text
- [ ] Excel requires at least 100 strings
- [ ] It changes the styles
> Append only, or rewrite every `t="s"` cell.

3. What determines slide order in a PPTX?
- [ ] File names `slide1.xml`, `slide2.xml`
- [x] The `p:sldIdLst` in `presentation.xml`
- [ ] The order in `[Content_Types].xml`
> Ids map to relationships, which map to parts.

### Exercises

1. **Formula census** — List every formula in a worksheet with its cell reference and cached value.
<details><summary>Solution</summary>

```python
X = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
for c in sheet_root.iter(X + "c"):
    f = c.find(X + "f")
    if f is not None:
        v = c.find(X + "v")
        print(c.get("r"), "=" + (f.text or ""), "->", v.text if v is not None else "(no cached value)")
```

</details>

2. **Slide text dump** — Print all text from every slide in a PPTX in slide order.
<details><summary>Solution</summary>

```python
import zipfile, xml.etree.ElementTree as ET
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"; A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"; R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
with zipfile.ZipFile("deck.pptx") as z:
    pres = ET.fromstring(z.read("ppt/presentation.xml"))
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("ppt/_rels/presentation.xml.rels"))}
    for sid in pres.iter(P + "sldId"):
        part = "ppt/" + rels[sid.get(R + "id")]
        slide = ET.fromstring(z.read(part))
        print(part, "|", " ".join(t.text or "" for t in slide.iter(A + "t")))
```

</details>

### Interview Questions

**Q: How are cell values stored in XLSX and what trips up people writing it by hand?**
Each `c` element has a reference, an optional type and style index, and a value; numbers are plain `<v>`, text is normally a `t="s"` index into `sharedStrings.xml`, formulas are `<f>` with a cached `<v>`, and dates are just numbers with a date number format. The traps are shared string indexes shifting when the list is edited, rows and cells written out of order, formulas without cached values that show blank in viewers that do not calculate, a stale `calcChain.xml`, and dates written as text. I write `fullCalcOnLoad="1"` when formulas change, append to shared strings rather than editing, and validate that every `c/@r` is ascending within its row.

**Q: What are the structural differences between DOCX, XLSX and PPTX that matter for a converter or validator?**
All three share the OPC package, relationships, content types, DrawingML and theme, so the package-level checks are identical. DOCX is a single flowing main part with styles and numbering as separate parts and section properties embedded in paragraphs. XLSX splits data across one part per sheet with a workbook index, and pulls text out into a shared string table and formatting into `cellXfs`, so a cell cannot be interpreted without two other parts. PPTX is one part per slide with inheritance from layouts and masters, and slide order held in `presentation.xml`; text is DrawingML rather than WordprocessingML. A validator therefore needs format-specific checks after the common package checks: shared string bounds and ascending cell order for XLSX, placeholder and id uniqueness for PPTX, and property order for DOCX.

**Q: How would you replace a logo across a 40-slide deck at package level?**
Find the media file by following each slide's `.rels` for image relationships, or more simply by hashing every file under `ppt/media/` and matching the old logo's hash, since the same picture inserted on multiple slides is often stored once and referenced from many `.rels` files. Replace the bytes with a same-ratio PNG, update the extension and content type default if the format changed, and if the aspect ratio changed, adjust the `a:xfrm/a:ext` of each `p:pic` that references it. Rezip with the copy-and-substitute pattern, then open in PowerPoint and LibreOffice Impress to confirm; it is a two-minute job that the same task done by hand in the application takes an hour.
