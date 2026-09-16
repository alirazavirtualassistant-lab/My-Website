---
id: python-docx
title: python-docx
icon: 📝
track: Document Engineering
color: #2B579A
runner: python
packages: python-docx
tagline: Generate and edit Word documents from Python.
description: python-docx from installation to expert document automation: paragraphs, runs, styles, tables, images, sections, headers and footers, page setup, templates, find-and-replace, working at the OOXML level with lxml when the API runs out, and building brand-compliant report generators.
---

# LEVEL: Beginner

## Installing python-docx and the Document object

`python-docx` is the standard Python library for creating and editing `.docx` files. It does not need Microsoft Word installed, it runs on Windows, macOS and Linux, and it works on a `.docx` the same way Word does: as a ZIP package of XML parts that it loads into memory, edits, and writes back out.

Install it with pip. The package name on PyPI is `python-docx`, but the module you import is called `docx`:

```bash
pip install python-docx
python -c "import docx; print(docx.__version__)"
```

Version 1.0 (2023) dropped Python 2 and added `iter_inner_content()`; version 1.1 added type hints; version 1.2 (2025) added a public comments API. Anything you learn here works on 1.1 and later. If `import docx` fails with "No module named docx", you probably installed a different package called `docx` (an old, unrelated library). Uninstall it and install `python-docx`.

#### The Document object

Everything starts with `Document`. Calling it with no argument gives you a blank document based on the default template that ships with the library, which already contains styles such as `Normal`, `Heading 1`, `Title`, `List Bullet` and `Table Grid`.

```python
from docx import Document

doc = Document()                      # new, blank document
doc.add_heading("Policy Manual", level=0)
doc.add_paragraph("Version 3.1, effective 1 October 2026.")
doc.save("policy-manual.docx")
```

Run this and open the file in Word. `level=0` uses the `Title` style; `level=1` to `9` use `Heading 1` to `Heading 9`. `add_paragraph` appends a paragraph in the `Normal` style, and `save` writes the ZIP package to disk. The file is a normal Word document that anyone can open and edit.

#### The three objects you will use constantly

| Object | What it represents | How you get one |
|---|---|---|
| `Document` | The whole file: body, sections, styles, properties | `Document()` or `Document("file.docx")` |
| `Paragraph` | One block of text ending in a paragraph mark | `doc.add_paragraph()` or `doc.paragraphs[i]` |
| `Run` | A stretch of text inside a paragraph with one set of formatting | `paragraph.add_run()` or `paragraph.runs[i]` |

A document is a list of block items (paragraphs and tables) in body order. `doc.paragraphs` gives you the top-level paragraphs, `doc.tables` the top-level tables, and `doc.sections` the page-layout sections. Content inside table cells is reached through the cell, not through `doc.paragraphs`.

```python
doc = Document()
doc.add_paragraph("Stewart Title weekly production report")
doc.add_paragraph("Files opened: 412")
for i, p in enumerate(doc.paragraphs):
    print(i, p.style.name, "->", p.text)
```

Output:

```text
0 Normal -> Stewart Title weekly production report
1 Normal -> Files opened: 412
```

`p.text` is the concatenated text of all runs in that paragraph, and `p.style.name` is the human-readable style name exactly as Word shows it in the Styles pane.

> **Tip:** `Document()` with no argument uses the library's built-in template, which is Calibri 11pt, Letter size, 1-inch margins. If your client's deliverables must be A4 with brand fonts, start from their `.dotx` instead (`Document("brand.dotx")`); the Templates chapter covers the details.

#### Saving to memory instead of disk

In a web app, a Lambda function, or the browser runner used on this site, you often want the bytes rather than a file. `save()` accepts any file-like object:

```python
from io import BytesIO
buf = BytesIO()
doc.save(buf)
data = buf.getvalue()
print(len(data), "bytes")
```

This is exactly what you do when emailing a generated document, returning it from a Flask route, or uploading it to S3. The bytes are a complete `.docx`.

### Try It Yourself

```python
from io import BytesIO
from docx import Document

doc = Document()
doc.add_heading("Policy Manual", level=0)
doc.add_heading("1. Purpose", level=1)
doc.add_paragraph("This manual defines how title-search files are processed.")
doc.add_paragraph("It applies to all production agents.")

buf = BytesIO()
doc.save(buf)
print("Saved", len(buf.getvalue()), "bytes")

# read it back to prove it is a real document
doc2 = Document(BytesIO(buf.getvalue()))
for p in doc2.paragraphs:
    print(f"[{p.style.name}] {p.text}")
```

### Quiz

1. Which line imports the library after `pip install python-docx`?
- [ ] `import python_docx`
- [x] `from docx import Document`
- [ ] `import word`
> The PyPI name is python-docx but the importable package is `docx`.

2. What style does `doc.add_heading("X", level=0)` apply?
- [ ] Heading 0
- [x] Title
- [ ] Normal
> Level 0 is special and maps to the built-in Title style; 1 to 9 map to Heading 1 to Heading 9.

3. What does `doc.save(BytesIO())` do?
- [x] Writes the complete .docx package into the in-memory buffer
- [ ] Saves only the text
- [ ] Raises an error because save needs a path
> `save` accepts a path or any binary file-like object, so you can keep the whole document in memory.

### Exercises

1. **Three paragraphs** — Create a document with a Title "SOP: Order Intake" and three Normal paragraphs, then print the number of paragraphs.
<details><summary>Solution</summary>

```python
from docx import Document
doc = Document()
doc.add_heading("SOP: Order Intake", 0)
for t in ["Receive the order.", "Validate the legal description.", "Assign to an examiner."]:
    doc.add_paragraph(t)
print(len(doc.paragraphs))   # 4 (title + 3)
```

</details>

2. **Style census** — Open any document from memory and count how many paragraphs use each style name.
<details><summary>Solution</summary>

```python
from collections import Counter
counts = Counter(p.style.name for p in doc.paragraphs)
for name, n in counts.most_common():
    print(name, n)
```

</details>

### Interview Questions

**Q: Does python-docx require Microsoft Word to be installed?**
No. It reads and writes the Office Open XML package directly using lxml, so it runs on Linux servers and in containers with no Office licence. The trade-off is that it never *renders* the document: it cannot tell you what page a paragraph lands on, cannot update a table of contents, and cannot convert to PDF. For those you pair it with LibreOffice headless or Word itself. In practice I generate with python-docx, then run `soffice --headless --convert-to pdf` when a client needs a PDF proof.

**Q: What is the difference between `doc.paragraphs` and the content of the document?**
`doc.paragraphs` returns only paragraphs that are direct children of the body. Text inside table cells, headers, footers, footnotes and text boxes is not included. To walk the body in true order, including tables, use `doc.iter_inner_content()` (added in v1.0), which yields `Paragraph` and `Table` objects interleaved exactly as they appear. When I audit a 767-page handbook for stray manual formatting, I recurse into every table cell as well, otherwise I miss half the content.

**Q: Why would you save a document to BytesIO rather than a path?**
Because the consumer is often not a file system: an HTTP response, an email attachment, an S3 upload, or a test assertion. `BytesIO` avoids temp-file cleanup and permission issues in serverless environments, and it makes tests fast because you can reopen the same bytes with `Document(BytesIO(data))` and assert on the structure without touching disk.

## Paragraphs, runs and text formatting

A **paragraph** in Word is everything between two paragraph marks. A **run** is a piece of text inside a paragraph that shares one set of character formatting. The sentence "Files must be **validated** before release" is one paragraph made of three runs: plain, bold, plain. Understanding this split is the single most important idea in python-docx, because formatting lives on runs, not on paragraphs.

```python
from docx import Document
doc = Document()
p = doc.add_paragraph("Files must be ")
p.add_run("validated").bold = True
p.add_run(" before release.")
```

`add_paragraph(text)` creates a paragraph with one run containing `text`. Each `add_run` appends another run and returns it, so you can set properties on it directly.

#### Character formatting on a run

| Property | Values | Example |
|---|---|---|
| `run.bold` | `True`, `False`, `None` | `run.bold = True` |
| `run.italic` | same | `run.italic = True` |
| `run.underline` | `True` or a `WD_UNDERLINE` member | `run.underline = True` |
| `run.font.size` | a `Length` such as `Pt(12)` | `run.font.size = Pt(10.5)` |
| `run.font.name` | font family string | `run.font.name = "Arial"` |
| `run.font.color.rgb` | `RGBColor` | `RGBColor(0x2B, 0x57, 0x9A)` |
| `run.font.highlight_color` | `WD_COLOR_INDEX` member | `WD_COLOR_INDEX.YELLOW` |
| `run.font.all_caps`, `small_caps`, `strike`, `superscript`, `subscript` | booleans | `run.font.superscript = True` |

`None` means "inherit from the style", which is different from `False` ("explicitly off"). Leave properties at `None` whenever the style already does what you want; that keeps the XML small and the document easy to rebrand.

```python
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_COLOR_INDEX

p = doc.add_paragraph()
r = p.add_run("URGENT: ")
r.bold = True
r.font.color.rgb = RGBColor(0xC0, 0x00, 0x00)
r = p.add_run("rate matrix for Wyoming changes on 1 Nov")
r.font.highlight_color = WD_COLOR_INDEX.YELLOW
r.font.size = Pt(12)
```

`Pt`, `Inches`, `Cm`, `Mm` and `Emu` in `docx.shared` all return a `Length`, which is an integer number of English Metric Units (914,400 per inch). You never need to convert by hand.

#### Paragraph formatting

Alignment, spacing and indentation belong to the paragraph, reached through `paragraph.paragraph_format` (or `paragraph.alignment` as a shortcut).

```python
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.shared import Inches

p = doc.add_paragraph("Confidential. Prepared for Stewart Title.")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
pf = p.paragraph_format
pf.space_before = Pt(0)
pf.space_after = Pt(6)
pf.line_spacing = 1.15            # a float means "multiple"
pf.left_indent = Inches(0.5)
pf.first_line_indent = Inches(-0.25)   # negative = hanging indent
pf.keep_with_next = True
```

`line_spacing` accepts either a float (multiple of single spacing) or a `Length` (exact spacing in points). `keep_with_next`, `keep_together`, `page_break_before` and `widow_control` are the same check boxes as Word's Paragraph dialog, Line and Page Breaks tab.

#### Breaks and tabs inside runs

```python
from docx.enum.text import WD_BREAK
r = doc.add_paragraph().add_run("End of section")
r.add_break(WD_BREAK.PAGE)      # page break inside the paragraph
r2 = doc.add_paragraph().add_run("Name:")
r2.add_tab()
r2.add_text("Ali Raza")
doc.add_page_break()            # shortcut: a new paragraph containing a page break
```

`WD_BREAK.LINE` inserts a soft line break (Shift+Enter in Word), which is what you want inside an address block where the lines belong to one paragraph.

> **Warning:** Do not simulate spacing with empty paragraphs or a row of spaces. Use `space_after` and tab stops. Empty paragraphs are the number one reason generated documents look wrong after a client edits them.

#### Reading runs back

When you open an existing document, Word may have split a sentence into many runs for reasons invisible to you (spell-check marks, edits at different times). Always inspect before you edit:

```python
for p in doc.paragraphs:
    print([r.text for r in p.runs])
```

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX

doc = Document()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("WEEKLY PRODUCTION REPORT")
r.bold = True
r.font.size = Pt(16)
r.font.color.rgb = RGBColor(0x2B, 0x57, 0x9A)

p2 = doc.add_paragraph("Files closed this week: ")
n = p2.add_run("128")
n.bold = True
n.font.highlight_color = WD_COLOR_INDEX.YELLOW
p2.add_run(" (target 120).")
p2.paragraph_format.space_after = Pt(12)

buf = BytesIO(); doc.save(buf)
print("bytes:", len(buf.getvalue()))
for para in doc.paragraphs:
    print("runs:", [(run.text, bool(run.bold)) for run in para.runs])
```

### Quiz

1. Where does bold formatting live in python-docx?
- [ ] On the Document
- [ ] On the Paragraph
- [x] On the Run
> Character formatting (bold, font, size, colour) is a run property; paragraphs hold alignment and spacing.

2. What does `run.bold = None` mean?
- [x] Inherit boldness from the paragraph style
- [ ] Bold is off
- [ ] Raises TypeError
> `None` removes the explicit setting so the style decides; `False` forces it off.

3. Which call produces a hanging indent?
- [ ] `left_indent = Inches(-0.25)`
- [x] `first_line_indent = Inches(-0.25)` with a positive `left_indent`
- [ ] `space_before = Pt(-6)`
> A negative first-line indent pulls the first line back toward the margin while the rest stays indented.

4. `pf.line_spacing = 1.5` sets what?
- [x] One-and-a-half line spacing (a multiple)
- [ ] 1.5 points of spacing
- [ ] 1.5 inches
> A float is interpreted as a multiple of single spacing; pass `Pt(...)` for an exact value.

### Exercises

1. **Mixed run sentence** — Produce the paragraph "Status: APPROVED by QA on 12 Sep" where APPROVED is bold green and the date is italic.
<details><summary>Solution</summary>

```python
from docx.shared import RGBColor
p = doc.add_paragraph("Status: ")
a = p.add_run("APPROVED"); a.bold = True; a.font.color.rgb = RGBColor(0x00, 0x80, 0x00)
p.add_run(" by QA on ")
d = p.add_run("12 Sep"); d.italic = True
```

</details>

2. **Address block** — Write a four-line client address as a single paragraph using line breaks, right-aligned.
<details><summary>Solution</summary>

```python
from docx.enum.text import WD_BREAK, WD_ALIGN_PARAGRAPH
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
lines = ["Stewart Title Guaranty", "1360 Post Oak Blvd", "Houston, TX 77056", "USA"]
for i, line in enumerate(lines):
    r = p.add_run(line)
    if i < len(lines) - 1:
        r.add_break(WD_BREAK.LINE)
```

</details>

### Interview Questions

**Q: Explain the paragraph/run model and why it matters for find-and-replace.**
A paragraph is a block; runs are the formatting segments inside it. Word splits text into runs whenever formatting changes, but also for invisible reasons such as proofing state or edit history, so the token `{{client}}` can end up as three runs `{{cli`, `ent`, `}}`. A naive `run.text.replace()` then misses it. The robust approach is to join the paragraph's run texts, find the match, and rewrite the affected runs while keeping the first run's formatting, which is exactly what the find-and-replace chapter implements.

**Q: What is the difference between `paragraph.text = "x"` and editing runs?**
Assigning `paragraph.text` (supported since v0.8) removes all existing runs and creates a single new run with the text, so any mixed formatting in that paragraph is lost, though paragraph-level style and alignment survive. Editing `run.text` preserves the run's own formatting. I assign `paragraph.text` only when I know the paragraph was uniformly formatted, for example a table cell I created myself.

**Q: How do you keep generated documents easy to rebrand later?**
Put formatting in styles, not on runs. If every heading is `Heading 2` with no direct overrides, a designer can change the template's Heading 2 once and all 400 headings follow. I only set run properties for genuinely local emphasis (one bold word) and I use `None` rather than `False` so the style remains the source of truth.

## Headings and styles

Word has three kinds of styles that python-docx exposes: **paragraph styles** (Normal, Heading 1, List Bullet), **character styles** (Emphasis, Strong, Hyperlink) and **table styles** (Table Grid, Light List Accent 1). Numbering styles exist in the file but are not editable through the API. A style is a named bundle of formatting; applying it is one line of code and changes everything at once.

```python
from docx import Document
doc = Document()
doc.add_heading("Title Search Procedures", level=1)
doc.add_heading("Scope", level=2)
doc.add_paragraph("Applies to all counties in Wyoming and Montana.", style="Normal")
doc.add_paragraph("Definition of a chain of title.", style="Intense Quote")
```

You can pass a style by name or by object: `style="Heading 3"` or `style=doc.styles["Heading 3"]`. Names are the display names Word shows, with spaces and capitals (`"Heading 1"`, `"List Bullet"`, `"Table Grid"`). Passing a name that does not exist in the document raises `KeyError`, which is a common failure when you start from a client template that renamed or deleted styles.

#### Listing the styles in a document

```python
from docx.enum.style import WD_STYLE_TYPE
for s in doc.styles:
    if s.type == WD_STYLE_TYPE.PARAGRAPH:
        print(s.name, "| based on:", s.base_style.name if s.base_style else None)
```

The default template defines about 40 paragraph styles, but a client's `.dotx` might carry 200. Latent styles (defined in Word's built-in list but not yet materialised in the file) do not appear until used; `doc.styles` only lists styles actually present in `styles.xml`.

#### Modifying a style

Changing the style changes every paragraph that uses it, which is exactly the point.

```python
from docx.shared import Pt, RGBColor
h1 = doc.styles["Heading 1"]
h1.font.name = "Georgia"
h1.font.size = Pt(18)
h1.font.color.rgb = RGBColor(0x2B, 0x57, 0x9A)
h1.font.bold = True
h1.paragraph_format.space_before = Pt(24)
h1.paragraph_format.space_after = Pt(6)
h1.paragraph_format.keep_with_next = True
h1.paragraph_format.page_break_before = False
```

`style.font` and `style.paragraph_format` are the same objects you used on runs and paragraphs. `style.base_style` sets inheritance ("Style based on" in Word), and `style.next_paragraph_style` sets what you get when you press Enter after it ("Style for following paragraph").

#### Creating a custom style

```python
from docx.enum.style import WD_STYLE_TYPE
st = doc.styles.add_style("SOP Step", WD_STYLE_TYPE.PARAGRAPH)
st.base_style = doc.styles["Normal"]
st.font.size = Pt(11)
st.paragraph_format.left_indent = Inches(0.4)
st.paragraph_format.space_after = Pt(4)
st.next_paragraph_style = st
st.quick_style = True          # show in the Styles gallery
doc.add_paragraph("Open the order in ResWare.", style="SOP Step")
```

A character style works the same with `WD_STYLE_TYPE.CHARACTER` and is applied with `paragraph.add_run("text", style="My Char Style")`. Word requires the style to already exist in the document, so create it before you use it.

| Attribute | Word dialog equivalent |
|---|---|
| `base_style` | Style based on |
| `next_paragraph_style` | Style for following paragraph |
| `hidden` | Hide until used / hidden |
| `quick_style` | Add to the Styles gallery |
| `priority` | Sort order in the Styles pane |
| `locked` | Restrict editing lock |

> **Interview note:** Interviewers who work in document production ask "why not just set bold and 18pt on the run?" The answer is consistency, navigation and automation: headings styled as `Heading 1` appear in the Navigation Pane, feed the table of contents, become PDF bookmarks, and can be re-themed in one place. Direct formatting does none of that.

#### Heading text and the outline

`add_heading` returns the paragraph, so you can still add runs to it:

```python
h = doc.add_heading(level=2)
h.add_run("Section 4.2 ")
h.add_run("(revised)").italic = True
```

Because headings are just paragraphs with a style, you can find all of them later with `if p.style.name.startswith("Heading")`, and that is how a table-of-contents preview or a chapter splitter is written.

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.style import WD_STYLE_TYPE

doc = Document()
h1 = doc.styles["Heading 1"]
h1.font.name = "Georgia"; h1.font.size = Pt(18)
h1.font.color.rgb = RGBColor(0x2B, 0x57, 0x9A)

step = doc.styles.add_style("SOP Step", WD_STYLE_TYPE.PARAGRAPH)
step.base_style = doc.styles["Normal"]
step.paragraph_format.left_indent = Inches(0.4)

doc.add_heading("Order Intake SOP", 1)
for s in ["Receive order via email.", "Log it in the tracker.", "Assign an examiner."]:
    doc.add_paragraph(s, style="SOP Step")

para_styles = [s.name for s in doc.styles if s.type == WD_STYLE_TYPE.PARAGRAPH]
print(len(para_styles), "paragraph styles; custom present:", "SOP Step" in para_styles)
for p in doc.paragraphs:
    print(f"{p.style.name:10} {p.text}")
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. Which name applies the built-in bullet style?
- [x] `"List Bullet"`
- [ ] `"ListBullet"`
- [ ] `"Bullet List"`
> python-docx uses Word's display names, including the space.

2. What happens when you pass a style name that is not in the document?
- [ ] It is created automatically
- [x] A `KeyError` is raised
- [ ] The paragraph gets Normal silently
> The style must exist in `styles.xml`; create it with `add_style` first.

3. Changing `doc.styles["Heading 2"].font.size` affects what?
- [ ] Only the next heading you add
- [x] Every paragraph that uses Heading 2 without a direct override
- [ ] Nothing until you call `update()`
> Styles are shared definitions; direct run formatting still overrides them.

### Exercises

1. **Brand the headings** — Set Heading 1 to 20pt bold navy and Heading 2 to 14pt bold grey, then add one of each.
<details><summary>Solution</summary>

```python
from docx.shared import Pt, RGBColor
for name, size, rgb in [("Heading 1", 20, (0x1F, 0x38, 0x64)), ("Heading 2", 14, (0x59, 0x59, 0x59))]:
    s = doc.styles[name]; s.font.size = Pt(size); s.font.bold = True
    s.font.color.rgb = RGBColor(*rgb)
doc.add_heading("Chapter 1", 1); doc.add_heading("1.1 Overview", 2)
```

</details>

2. **Character style** — Create a character style "Field Name" (bold, small caps) and use it inside a sentence.
<details><summary>Solution</summary>

```python
from docx.enum.style import WD_STYLE_TYPE
cs = doc.styles.add_style("Field Name", WD_STYLE_TYPE.CHARACTER)
cs.font.bold = True; cs.font.small_caps = True
p = doc.add_paragraph("Enter the ")
p.add_run("Legal Description", style="Field Name")
p.add_run(" exactly as on the deed.")
```

</details>

### Interview Questions

**Q: Why should generated headings use heading styles rather than bold runs?**
Heading styles carry outline levels, so Word builds the Navigation Pane, the TOC field and PDF bookmarks from them, and screen readers announce them as headings for accessibility. They also make rebranding a one-line change in the style rather than a crawl through every run. A bold 16pt run looks like a heading to a human but is invisible to every automated consumer of the file.

**Q: What is the difference between a style's display name and its style ID?**
Word shows names like "Heading 1"; inside `styles.xml` the `w:styleId` is "Heading1" and the `w:name` is "heading 1" in lower case for built-ins. python-docx translates between them so you use display names, but if you drop to the XML level (for example setting `w:pStyle`) you must use the ID. A client template with a renamed style can have a mismatch between ID and name, which is why `doc.styles["X"]` sometimes fails when Word appears to show "X".

**Q: How would you copy a style from one document to another?**
There is no `copy_style` API. Practical options: start the new document from the source template so the styles are already there, or deep-copy the `w:style` element from the source's `styles.xml` into the target's styles element with lxml, then check that any `basedOn` or `link` targets also exist. I do the first whenever possible; a branded `.dotx` is the right home for shared styles.

## Lists and bullets

python-docx does not have a dedicated list API. Lists in Word are ordinary paragraphs with a list style, and the numbering definition lives in a separate part (`numbering.xml`). For most documents the built-in list styles are enough, and they are one line of code.

```python
from docx import Document
doc = Document()
doc.add_paragraph("Required documents", style="Heading 2")
for item in ["Deed of trust", "Prior policy", "Survey", "Tax certificate"]:
    doc.add_paragraph(item, style="List Bullet")
```

The default template provides these list styles:

| Style name | Effect |
|---|---|
| `List Bullet`, `List Bullet 2`, `List Bullet 3` | Bulleted, each level indented further |
| `List Number`, `List Number 2`, `List Number 3` | Numbered 1., 2., 3. with nested levels |
| `List Paragraph` | Indented paragraph with no marker; what Word uses for its own lists |
| `List`, `List 2`, `List Continue` | Legacy indent-only styles |

Nested levels are separate styles, so a two-level checklist is:

```python
doc.add_paragraph("Search the county records", style="List Number")
doc.add_paragraph("Grantor index", style="List Bullet 2")
doc.add_paragraph("Grantee index", style="List Bullet 2")
doc.add_paragraph("Summarise findings in the commitment", style="List Number")
```

#### The restart problem

Every `List Number` paragraph in a document shares one numbering instance, so a second numbered list later in the file continues from where the first stopped (5., 6., 7.). Word restarts numbering when you right-click and choose "Restart at 1"; python-docx has no method for that. The fix is to create a new `w:num` that points at the same abstract numbering definition with a start override, then attach it to the first paragraph of the new list. This is the first place you will meet the XML layer.

```python
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def restart_numbering(doc, paragraph):
    """Give `paragraph` (and following List Number paragraphs) a fresh 1."""
    numbering = doc.part.numbering_part.numbering_definitions._numbering
    style_num_id = doc.styles["List Number"].element.pPr.numPr.numId.val
    abstract_id = numbering.num_having_numId(style_num_id).abstractNumId.val
    new_num = numbering.add_num(abstract_id)
    new_num.add_lvlOverride(ilvl=0).add_startOverride(1)
    numPr = paragraph._p.get_or_add_pPr().get_or_add_numPr()
    numPr.get_or_add_ilvl().val = 0
    numPr.get_or_add_numId().val = new_num.numId
    return new_num.numId
```

Use it on the first item of the second list. Following paragraphs that use the same `numId` join it, so set the same `numId` on the rest of that list with `paragraph._p.get_or_add_pPr().get_or_add_numPr().get_or_add_numId().val = num_id`. The chapter on the underlying XML explains `_p`, `get_or_add_*` and why these private-looking names are stable.

#### Manual lists when you need full control

For a legal-style outline (1., 1.1, 1.1.1) or a client template with custom bullets, the cleanest approach is to rely on the template's own list styles and simply apply them by name. Inspect what exists first:

```python
print([s.name for s in doc.styles if "List" in s.name])
```

If a client's `.dotx` defines "Bullet Level 1" and "Numbered Step", use those. Never rebuild numbering from scratch when a designer has already done it.

> **Tip:** `List Paragraph` is what you get when you press the bullet button in Word: the style provides the indent and the numbering is attached directly to the paragraph. Documents made in Word therefore show `List Paragraph` for their bullets, and the bullet itself is in `numPr`, not in the style. When you read such a document, check `p._p.pPr.numPr` to know it is a list item.

#### Detecting list items when reading

```python
for p in doc.paragraphs:
    numPr = p._p.pPr.numPr if p._p.pPr is not None else None
    is_list = numPr is not None or p.style.name.startswith("List")
    if is_list:
        print("•", p.text)
```

This dual check catches both styled lists (from your generator) and Word-made `List Paragraph` lists.

### Try It Yourself

```python
from io import BytesIO
from docx import Document

doc = Document()
doc.add_heading("QA checklist for closed files", 1)
checks = ["Legal description matches deed", "All liens addressed",
          "Signatures notarised", "Policy amount equals purchase price"]
for c in checks:
    doc.add_paragraph(c, style="List Number")

doc.add_paragraph("Common exceptions", style="Heading 2")
for e in ["Easements of record", "Mineral reservations"]:
    doc.add_paragraph(e, style="List Bullet")
    doc.add_paragraph("Confirm with underwriter", style="List Bullet 2")

for p in doc.paragraphs:
    marker = "  " * (2 if p.style.name.endswith("2") else 1) if p.style.name.startswith("List") else ""
    print(f"{p.style.name:14}|{marker}{p.text}")
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. How do you make a bulleted paragraph in python-docx?
- [ ] `doc.add_bullet("x")`
- [x] `doc.add_paragraph("x", style="List Bullet")`
- [ ] `doc.add_list(["x"])`
> Lists are paragraphs with a list style; there is no list-specific method.

2. Two separate `List Number` lists in one document will, by default:
- [ ] Each start at 1
- [x] Continue numbering across both lists
- [ ] Raise an error
> They share a single numbering instance; restarting requires a new `w:num` with a start override.

3. Which style does Word itself apply when you click the bullet button?
- [ ] List Bullet
- [x] List Paragraph
- [ ] Normal
> Word attaches numbering directly to the paragraph and uses List Paragraph for indentation.

### Exercises

1. **Two-level SOP** — Produce a numbered list of three steps where step 2 has two bulleted sub-points.
<details><summary>Solution</summary>

```python
doc.add_paragraph("Open the file", style="List Number")
doc.add_paragraph("Review the commitment", style="List Number")
doc.add_paragraph("Schedule A vesting", style="List Bullet 2")
doc.add_paragraph("Schedule B exceptions", style="List Bullet 2")
doc.add_paragraph("Release to closer", style="List Number")
```

</details>

2. **List detector** — Write a function that returns the texts of all list items in a document, including Word-made `List Paragraph` items.
<details><summary>Solution</summary>

```python
def list_items(doc):
    out = []
    for p in doc.paragraphs:
        pPr = p._p.pPr
        if (pPr is not None and pPr.numPr is not None) or p.style.name.startswith("List"):
            out.append(p.text)
    return out
```

</details>

### Interview Questions

**Q: Why does python-docx have no list API, and how do you cope?**
Word lists are a combination of three things: a paragraph, a numbering instance (`w:num`) and an abstract definition (`w:abstractNum`) in `numbering.xml`. Modelling that properly is complex, and the maintainers chose to expose only the style-based path. In practice I apply the template's list styles by name for 90% of cases, and for restarts or custom levels I add a `w:num` with a `startOverride` through the oxml layer. The key is to start from a template whose list styles are already correct so the code stays tiny.

**Q: A client says "the numbering continues from the previous section". What happened and how do you fix it?**
All `List Number` paragraphs reference the same `numId`, so Word treats them as one list. The fix is to create a new numbering instance pointing to the same abstract definition with `lvlOverride/startOverride = 1`, and set that `numId` on every paragraph of the new list. I wrap that in a `restart_numbering()` helper and call it once per list, and I verify by opening the document in LibreOffice headless and exporting to text.

**Q: How do you tell whether a paragraph read from a Word-authored file is a list item?**
Check `p._p.pPr.numPr`: if present, numbering is attached directly, regardless of style. Also check whether the style itself carries `numPr` (e.g. `List Bullet`). Style name alone is unreliable because Word uses `List Paragraph` for its own bullets, and a template might name styles arbitrarily.

## Saving and opening existing documents

Generating from scratch is half the job. The other half is opening a document a client sent, changing something, and saving it without breaking anything else. `Document(path)` opens any `.docx` (and `.docm` or `.dotx`, with caveats), and `save()` writes it back.

```python
from docx import Document
doc = Document("client-letterhead.docx")
print(len(doc.paragraphs), "paragraphs,", len(doc.tables), "tables,", len(doc.sections), "sections")
doc.paragraphs[0].text = "Amended letter"
doc.save("client-letterhead-amended.docx")
```

Always save to a **new path** during development. `save()` overwrites without confirmation, and if your code raises halfway through you want the original intact.

#### What survives a round trip

python-docx preserves every part it does not understand: comments, footnotes, embedded fonts, custom XML, macros, tracked changes and images all pass through unchanged because the package is rewritten part by part. What does not survive is anything Word computes on open: the table of contents keeps its cached text, fields keep their old results, and page counts in `app.xml` are stale. The document is valid; it is simply not re-paginated.

| Content | Survives `Document()` then `save()`? |
|---|---|
| Text, styles, tables, images | Yes |
| Headers, footers, sections | Yes |
| Comments, footnotes, tracked changes | Yes, untouched |
| VBA macros in `.docm` | Yes, the `vbaProject.bin` part is preserved |
| Field results (TOC, PAGE) | Kept as cached; not recalculated |
| Document statistics in `app.xml` | Stale until Word resaves |

#### Opening from bytes, URLs and uploads

`Document()` accepts a path or a binary file-like object, so an uploaded file in Flask or Django is opened directly:

```python
from io import BytesIO
data = request.files["docx"].read()
doc = Document(BytesIO(data))
```

The same works for `requests.get(url).content`, S3 `get_object()["Body"].read()` and email attachments.

#### Opening a .dotx template

`Document("brand.dotx")` works, but when you save the result Word will still treat it as a template because the main part's content type says "template". Fix the content type before saving:

```python
from docx.opc.constants import CONTENT_TYPE as CT
doc = Document("brand.dotx")
doc.part._content_type = CT.WML_DOCUMENT_MAIN
doc.save("from-template.docx")
```

The Templates chapter goes deeper; this snippet is the essential trick.

#### Errors you will meet

- `PackageNotFoundError: Package not found at 'x.docx'`: the path is wrong, or the file is a `.doc` (binary Word 97) renamed to `.docx`. Check the first two bytes; a real `.docx` starts with `PK`.
- `KeyError: "no style with name 'X'"`: the document lacks that style. List `doc.styles` and pick one that exists.
- `ValueError: file ... is not a Word file, content type is ...`: you opened a `.xlsx` or `.pptx`.
- A document that opens in Word with "unreadable content" after your save: you inserted XML in the wrong order or referenced a missing relationship. The XML chapter covers how to debug it.

```python
with open("mystery.docx", "rb") as f:
    print(f.read(2))       # b'PK' means it is a ZIP-based Office file
```

> **Warning:** Word keeps documents locked while open. Saving to a path that Word currently has open raises `PermissionError` on Windows. Close the file or save elsewhere.

#### Reading the body in order

`doc.paragraphs` and `doc.tables` are two separate lists, so you cannot tell whether a table comes before or after a given paragraph. Use `iter_inner_content()`:

```python
from docx.table import Table
from docx.text.paragraph import Paragraph
for block in doc.iter_inner_content():
    if isinstance(block, Paragraph):
        print("P:", block.text[:50])
    elif isinstance(block, Table):
        print("T:", len(block.rows), "rows")
```

This is how you write a document-to-Markdown converter or a structural QA report.

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph

# build a "client file" in memory
src = Document()
src.add_heading("Commitment Summary", 1)
src.add_paragraph("Prepared by Ali Raza.")
t = src.add_table(rows=2, cols=2, style="Table Grid")
t.cell(0, 0).text = "File"; t.cell(0, 1).text = "WY-2026-0412"
t.cell(1, 0).text = "Status"; t.cell(1, 1).text = "Open"
src.add_paragraph("End of summary.")
buf = BytesIO(); src.save(buf)
print("first bytes:", buf.getvalue()[:2])

# open it again, edit, and save to a second buffer
doc = Document(BytesIO(buf.getvalue()))
doc.tables[0].cell(1, 1).text = "Closed"
for block in doc.iter_inner_content():
    if isinstance(block, Paragraph):
        print("P:", block.text)
    elif isinstance(block, Table):
        print("T:", [[c.text for c in r.cells] for r in block.rows])
out = BytesIO(); doc.save(out)
print("in:", len(buf.getvalue()), "out:", len(out.getvalue()))
```

### Quiz

1. What does a real .docx file start with?
- [x] The bytes `PK`
- [ ] `<?xml`
- [ ] `DOCX`
> A .docx is a ZIP archive, and ZIP local file headers begin with the signature `PK`.

2. After opening and saving with python-docx, the table of contents will:
- [ ] Be regenerated
- [x] Keep its previously cached text
- [ ] Be removed
> python-docx never lays out pages; field results are stored text until Word or LibreOffice updates them.

3. Which method walks paragraphs and tables in true body order?
- [ ] `doc.paragraphs + doc.tables`
- [x] `doc.iter_inner_content()`
- [ ] `doc.body()`
> `iter_inner_content()` (v1.0+) yields Paragraph and Table objects interleaved as they appear.

### Exercises

1. **Safe save** — Write a function `amend(path, new_title)` that opens a document, replaces the first paragraph's text and saves to `<name>-amended.docx` without touching the original.
<details><summary>Solution</summary>

```python
from pathlib import Path
from docx import Document
def amend(path, new_title):
    p = Path(path)
    doc = Document(p)
    doc.paragraphs[0].text = new_title
    out = p.with_name(p.stem + "-amended.docx")
    doc.save(out)
    return out
```

</details>

2. **Block outline** — Print a one-line outline for a document: `P` for paragraphs (with style) and `T rxc` for tables.
<details><summary>Solution</summary>

```python
from docx.table import Table
for b in doc.iter_inner_content():
    if isinstance(b, Table):
        print(f"T {len(b.rows)}x{len(b.columns)}")
    else:
        print("P", b.style.name)
```

</details>

### Interview Questions

**Q: A client sends a .doc file. Can python-docx open it?**
No. `.doc` is the binary Word 97-2003 format, not a ZIP of XML, and python-docx raises `PackageNotFoundError` or a "not a Word file" error. Convert first with LibreOffice: `soffice --headless --convert-to docx file.doc`, or with Word itself via `docx2pdf`-style COM automation on Windows. I check the magic bytes (`PK` for OOXML, `D0 CF 11 E0` for the old OLE format) before dispatching in any intake pipeline.

**Q: What is preserved and what is lost when you open and save a document with python-docx?**
Everything in the package is preserved part by part, including comments, macros, embedded fonts and content the library does not model. What is not refreshed is computed content: TOC text, PAGE and NUMPAGES results, and the statistics in `docProps/app.xml`. So the risk is not corruption but staleness. For deliverables I either set `w:updateFields` in `settings.xml` so Word refreshes on open, or run a LibreOffice conversion step that repaginates.

**Q: How do you open an uploaded file safely in a web service?**
Read the bytes, verify the `PK` signature and a reasonable size limit, then pass `BytesIO(data)` to `Document`. I catch `PackageNotFoundError` and `ValueError` to return a clean 400, never let a stack trace leak, and I never write the upload to a predictable temp path. Processing happens in memory, and the result is streamed back from another `BytesIO`.

# LEVEL: Intermediate

## Tables: create, merge, widths and styles

Tables carry most of the structured data in reports: rate matrices, production counts, exception schedules. `doc.add_table(rows, cols)` creates one; you then address cells by row and column.

```python
from docx import Document
doc = Document()
table = doc.add_table(rows=1, cols=3)
table.style = "Table Grid"
hdr = table.rows[0].cells
hdr[0].text, hdr[1].text, hdr[2].text = "County", "Files", "Avg days"
for county, files, days in [("Laramie", 88, 4.2), ("Natrona", 61, 5.1), ("Teton", 23, 6.8)]:
    row = table.add_row().cells
    row[0].text = county
    row[1].text = str(files)
    row[2].text = f"{days:.1f}"
```

`table.cell(r, c)`, `table.rows[r].cells[c]` and `table.columns[c].cells[r]` all return `_Cell` objects. A cell contains paragraphs (at least one, always), so `cell.text = "x"` replaces its content with one paragraph, while `cell.paragraphs[0].add_run()` lets you format text inside. `cell.add_paragraph()` and `cell.add_table()` nest more content.

#### Styles and alignment

The default template ships with `Table Grid`, `Light Shading`, `Light List Accent 1`, `Medium Shading 1 Accent 1` and dozens more; list them with `[s.name for s in doc.styles if s.type == WD_STYLE_TYPE.TABLE]`. Beyond the style:

```python
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.text import WD_ALIGN_PARAGRAPH
table.alignment = WD_TABLE_ALIGNMENT.CENTER
for cell in table.columns[1].cells:
    cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
```

Header row formatting is per-run, so loop over `hdr` and set `bold = True` on `cell.paragraphs[0].runs[0]`.

#### Column widths, the honest version

Word stores widths per cell, not per column, and it also has an "autofit" behaviour that recomputes widths from content. To get fixed widths that Word respects, disable autofit and set every cell in the column:

```python
from docx.shared import Inches
table.autofit = False
widths = [Inches(2.0), Inches(1.0), Inches(1.2)]
for row in table.rows:
    for cell, w in zip(row.cells, widths):
        cell.width = w
```

Setting `table.columns[i].width` alone is not enough for Word (LibreOffice honours it, Word often ignores it). Set the cells.

#### Merging cells

`cell_a.merge(cell_b)` merges the rectangular range spanning both cells and returns the merged cell. Text from all merged cells is concatenated into paragraphs of the result.

```python
t = doc.add_table(rows=3, cols=4, style="Table Grid")
title = t.cell(0, 0).merge(t.cell(0, 3))      # whole first row
title.text = "Wyoming Rate Matrix, effective 2026-11-01"
side = t.cell(1, 0).merge(t.cell(2, 0))       # vertical merge
side.text = "Owner's policy"
```

After a merge, `row.cells` still returns one `_Cell` per grid column, and merged positions return the same underlying cell object repeatedly. When you iterate, de-duplicate by identity if you need each cell once.

#### Repeating header rows and row breaking

There is no property for "repeat as header row"; it is a small XML flag on the row:

```python
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
def repeat_header(row):
    trPr = row._tr.get_or_add_trPr()
    el = OxmlElement("w:tblHeader"); el.set(qn("w:val"), "true")
    trPr.append(el)
def no_split(row):
    trPr = row._tr.get_or_add_trPr()
    trPr.append(OxmlElement("w:cantSplit"))
repeat_header(table.rows[0])
```

Row height is available directly: `row.height = Cm(0.8)` with `row.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST` (or `EXACTLY`).

| Task | API |
|---|---|
| Add row / column | `table.add_row()`, `table.add_column(Inches(1))` |
| Delete a row | `row._tr.getparent().remove(row._tr)` (no public API) |
| Cell shading | `w:shd` element via OxmlElement (see XML chapter) |
| Cell margins | `w:tcMar` via XML |
| Table from a list of dicts | loop rows; set `cell.text` |

> **Warning:** `table.cell(r, c)` and `row.cells` rebuild the cell list each call. In a 2,000-row table, calling `table.cell()` inside a double loop is quadratic. Grab `cells = table._cells` once or iterate `row._tr.tc_lst` directly; the performance chapter measures it.

#### Reading tables

```python
for table in doc.tables:
    for row in table.rows:
        print([c.text for c in row.cells])
```

To convert to pandas: `pd.DataFrame([[c.text for c in r.cells] for r in t.rows[1:]], columns=[c.text for c in t.rows[0].cells])`.

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.shared import Inches
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH

data = [("Laramie", 88, 4.2), ("Natrona", 61, 5.1), ("Teton", 23, 6.8)]
doc = Document()
doc.add_heading("Production by county", 1)
t = doc.add_table(rows=1, cols=3, style="Table Grid")
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.autofit = False
for cell, name in zip(t.rows[0].cells, ["County", "Files", "Avg days"]):
    cell.text = name
    cell.paragraphs[0].runs[0].bold = True
for county, files, days in data:
    c = t.add_row().cells
    c[0].text = county; c[1].text = str(files); c[2].text = f"{days:.1f}"
    c[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
widths = [Inches(2.0), Inches(1.0), Inches(1.2)]
for row in t.rows:
    for cell, w in zip(row.cells, widths):
        cell.width = w
total = t.add_row().cells
merged = total[0].merge(total[1]); merged.text = "Total"
total[2].text = str(sum(d[1] for d in data))

print("rows:", len(t.rows), "cols:", len(t.columns))
for row in t.rows:
    print([c.text for c in row.cells])
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. Why is setting `table.columns[0].width` often not enough in Word?
- [x] Word stores widths per cell, so each cell in the column must be set
- [ ] Column widths are read-only
- [ ] Widths must be in twips
> Word reads `w:tcW` on cells; python-docx exposes `cell.width` for exactly this reason.

2. What does `a.merge(b)` return?
- [ ] None
- [x] The merged cell spanning the rectangle from a to b
- [ ] A new table
> Merge is rectangular and returns the resulting `_Cell` so you can set its text.

3. How do you mark a row to repeat at the top of each page?
- [ ] `row.repeat = True`
- [x] Add a `w:tblHeader` element to the row's `w:trPr`
- [ ] `table.header_rows = 1`
> There is no public property; a one-line OxmlElement addition does it.

### Exercises

1. **Rate matrix** — Build a 4x4 table where the first row and first column are headers (bold) and the body shows premiums for coverage amounts 100k, 250k, 500k against three policy types.
<details><summary>Solution</summary>

```python
types = ["Owner", "Lender", "Combined"]; amts = ["100k", "250k", "500k"]
prem = {"Owner": [480, 900, 1500], "Lender": [420, 800, 1350], "Combined": [650, 1200, 2000]}
t = doc.add_table(rows=4, cols=4, style="Table Grid")
t.cell(0, 0).text = "Amount"
for j, ty in enumerate(types, 1):
    t.cell(0, j).text = ty; t.cell(0, j).paragraphs[0].runs[0].bold = True
for i, a in enumerate(amts, 1):
    t.cell(i, 0).text = a; t.cell(i, 0).paragraphs[0].runs[0].bold = True
    for j, ty in enumerate(types, 1):
        t.cell(i, j).text = f"${prem[ty][i-1]:,}"
```

</details>

2. **Table to rows of dicts** — Convert the first table of a document to a list of dicts keyed by header text.
<details><summary>Solution</summary>

```python
t = doc.tables[0]
keys = [c.text.strip() for c in t.rows[0].cells]
rows = [dict(zip(keys, [c.text.strip() for c in r.cells])) for r in t.rows[1:]]
```

</details>

### Interview Questions

**Q: How do you make a table look right in Word, not just in LibreOffice?**
Set `table.autofit = False`, set `cell.width` on every cell of each column, and choose a table style rather than borders per cell. Word ignores column-level width unless the cells agree, and with autofit on it re-measures content on open. For long tables I add `w:tblHeader` to the header row and `w:cantSplit` to data rows so a row never straddles a page break. I verify by opening the file in Word itself, because LibreOffice is more forgiving.

**Q: What are the pitfalls of merged cells when reading a table?**
`row.cells` returns one entry per grid column, so a merged cell appears several times, and its text would be counted repeatedly if you sum a column. De-duplicate with `id(cell._tc)` or check `cell._tc.grid_span` and `vMerge`. Also, a vertically merged continuation cell has no text of its own; the content lives in the first cell of the merge.

**Q: A 3,000-row table takes minutes to build. Why, and what do you change?**
`table.cell()` and `row.cells` each rebuild the full cell list, so nested loops become quadratic, and `add_row()` deep-copies the previous row's XML. The fix is to build `w:tr` elements directly with lxml (or `OxmlElement`) and append them to `table._tbl`, setting text through `w:t`. That takes seconds. If the table has a fixed shape, creating it with `add_table(rows=n, cols=m)` once and then filling `table._cells` in a single pass is a middle ground.

## Images and captions

Images arrive as logos, signatures, charts exported from matplotlib or Power BI, and scanned signature blocks. python-docx supports PNG, JPEG, GIF, TIFF and BMP, inserted inline (as part of the text flow). Floating images with text wrapping are not supported by the API.

```python
from docx import Document
from docx.shared import Inches
doc = Document()
doc.add_picture("logo.png", width=Inches(1.5))
```

`add_picture` creates a new paragraph containing the picture. Pass `width` or `height` (or both); if you pass one, the other scales proportionally from the image's pixel size and DPI. With neither, the image is placed at its native size, where a 3000px 300-dpi scan becomes 10 inches wide and overflows the page. Always give a width.

#### Inline in an existing paragraph

To put a logo next to text, or centre it, add the picture to a run:

```python
from docx.enum.text import WD_ALIGN_PARAGRAPH
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run().add_picture("chart.png", width=Inches(5.5))
```

Both `doc.add_picture` and `run.add_picture` accept a path or a file-like object, so charts straight from matplotlib never touch disk:

```python
import matplotlib.pyplot as plt
from io import BytesIO
fig, ax = plt.subplots(figsize=(6, 3))
ax.bar(["Mon", "Tue", "Wed"], [42, 55, 38])
img = BytesIO(); fig.savefig(img, format="png", dpi=200); img.seek(0)
doc.add_picture(img, width=Inches(6))
```

Remember `img.seek(0)` after writing; python-docx reads from the current position.

#### Sizing rules

| Situation | What to do |
|---|---|
| Full-width figure on Letter with 1" margins | `width=Inches(6.5)` |
| Full-width on A4 with 2.54 cm margins | `width=Cm(15.92)` |
| Logo in a header | `width=Inches(1.2)` or less |
| Keep aspect ratio | pass only one dimension |
| Read back the size | `shape.width.inches`, `shape.height.inches` |

`add_picture` returns an `InlineShape`; `doc.inline_shapes` lists all of them, with `.type`, `.width`, `.height`. You can resize after insertion by assigning to those properties.

#### Captions

Word captions are paragraphs in the `Caption` style whose number is a `SEQ` field. python-docx can apply the style but does not create fields, so for a plain caption:

```python
doc.add_paragraph("Figure 3: Files closed per day, week 37", style="Caption")
```

For a caption that Word can renumber and pull into a Table of Figures, build the `SEQ` field with runs of `w:fldChar` and `w:instrText`. This helper is worth keeping:

```python
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def add_field(paragraph, instr, cached="1"):
    def fld(type_):
        r = OxmlElement("w:r"); fc = OxmlElement("w:fldChar")
        fc.set(qn("w:fldCharType"), type_); r.append(fc); return r
    paragraph._p.append(fld("begin"))
    r = OxmlElement("w:r"); it = OxmlElement("w:instrText")
    it.set(qn("xml:space"), "preserve"); it.text = f" {instr} "; r.append(it)
    paragraph._p.append(r)
    paragraph._p.append(fld("separate"))
    r = OxmlElement("w:r"); t = OxmlElement("w:t"); t.text = cached; r.append(t)
    paragraph._p.append(r)
    paragraph._p.append(fld("end"))

cap = doc.add_paragraph("Figure ", style="Caption")
add_field(cap, r"SEQ Figure \* ARABIC", "3")
cap.add_run(": Files closed per day, week 37")
```

Word displays the cached "3" until fields are updated (Ctrl+A, F9), then renumbers correctly. `add_field` appends raw runs, so call `add_run` for the text that follows only after the field.

> **Tip:** Keep the figure and its caption together: set `keep_with_next = True` on the picture's paragraph so a page break never separates them.

#### Image formats and DPI

python-docx reads the image header to get pixel dimensions and DPI (defaulting to 72 dpi when the file carries none). A PNG saved at 300 dpi and inserted with no explicit size comes out at pixels/300 inches wide; the same pixels at 72 dpi come out four times larger. Passing an explicit `width` sidesteps all of this. SVG and WebP are not supported; convert to PNG first (cairosvg or Pillow).

Images are stored once per unique file: inserting the same logo bytes ten times creates ten relationships but python-docx de-duplicates the media part by SHA1, so the package does not grow tenfold.

### Try It Yourself

```python
from io import BytesIO
import zlib, struct
from docx import Document
from docx.shared import Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def png(w, h, rgb):
    """Build a solid-colour PNG in pure Python (no Pillow needed)."""
    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))

doc = Document()
logo = BytesIO(png(300, 100, (0x2B, 0x57, 0x9A)))
shape = doc.add_picture(logo, width=Inches(1.5))
print(f"logo: {shape.width.inches:.2f} x {shape.height.inches:.2f} in")

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
chart = BytesIO(png(600, 300, (0xDD, 0xDD, 0xDD)))
p.add_run().add_picture(chart, width=Inches(6))
doc.add_paragraph("Figure 1: Files closed per day", style="Caption")

print("inline shapes:", len(doc.inline_shapes))
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. What happens if you call `add_picture` with no width or height?
- [ ] The image is scaled to the page width
- [x] It is placed at its native size from pixels and DPI
- [ ] An error is raised
> Native size is often wrong for scans; always pass one dimension.

2. Which image types can python-docx insert?
- [x] PNG, JPEG, GIF, TIFF, BMP
- [ ] Any file
- [ ] SVG and PNG only
> SVG and WebP are not supported and must be converted first.

3. A caption that Word can renumber needs what?
- [ ] The Caption style only
- [x] A SEQ field built from fldChar and instrText runs
- [ ] A bookmark
> Word numbers captions with `SEQ` fields; the style alone is just formatting.

### Exercises

1. **Signature block** — Add a right-aligned paragraph with a 1.2-inch signature image followed by the line "Ali Raza, Production Lead".
<details><summary>Solution</summary>

```python
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = p.add_run(); r.add_picture("signature.png", width=Inches(1.2))
r.add_break(WD_BREAK.LINE)
p.add_run("Ali Raza, Production Lead")
```

</details>

2. **Resize all images** — Shrink every inline image wider than 6 inches to 6 inches, keeping the aspect ratio.
<details><summary>Solution</summary>

```python
for s in doc.inline_shapes:
    if s.width.inches > 6:
        ratio = s.height / s.width
        s.width = Inches(6); s.height = int(Inches(6) * ratio)
```

</details>

### Interview Questions

**Q: Why can't python-docx insert a floating image with text wrapping?**
The API only emits `wp:inline` drawing XML. A floating image needs `wp:anchor` with positioning, wrap type and z-order elements, which the library does not model. When a client needs a logo behind text or a wrapped figure, I either place it in the header via an inline picture in a table cell, or I insert the picture inline and then replace the `wp:inline` element with a hand-built `wp:anchor` using lxml, copying the `a:graphic` child across.

**Q: How do you get charts from Python into a Word report without temp files?**
Render with matplotlib into a `BytesIO` at 200 dpi, `seek(0)`, and pass the buffer to `add_picture` with an explicit width. For a weekly production report I generate one chart per team, insert each under a Heading 2, and add a Caption paragraph with a `SEQ Figure` field so the numbering is Word-native. Everything stays in memory and the whole report builds in under a second.

**Q: What controls the physical size of an inserted image?**
The `wp:extent` in EMUs, which python-docx computes from the width/height you pass, or from the image's pixel dimensions divided by its DPI when you pass nothing. DPI defaults to 72 if the file has none, which is why untouched screenshots come out huge. I always pass width, and for print work I also make sure the source has at least 300 pixels per inch at the printed size.

## Sections, page setup and orientation

A **section** is a run of pages that share page size, margins, orientation, columns and header/footer definitions. Every document has at least one. You need more when a landscape rate matrix sits in the middle of a portrait report, or when the front matter uses roman numerals.

```python
from docx import Document
from docx.shared import Inches, Cm
doc = Document()
sec = doc.sections[0]
print(sec.page_width.inches, sec.page_height.inches)   # 8.5 11.0 (Letter)
sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)    # A4
sec.left_margin = sec.right_margin = Cm(2.5)
sec.top_margin = sec.bottom_margin = Cm(2.0)
```

`doc.sections` is a list-like of `Section` objects. All lengths are `Length` values, so `.inches`, `.cm`, `.pt` and `.emu` are available for reading.

#### Orientation

Switching to landscape is two steps: set the orientation flag *and* swap width and height. Word does not swap them for you.

```python
from docx.enum.section import WD_ORIENT
sec.orientation = WD_ORIENT.LANDSCAPE
sec.page_width, sec.page_height = sec.page_height, sec.page_width
```

#### Adding a section

`doc.add_section(start_type)` appends a new section that begins after the current content. Start types come from `WD_SECTION`:

| `WD_SECTION` member | Word name | Use |
|---|---|---|
| `NEW_PAGE` | Next Page | Landscape pages, new chapters |
| `CONTINUOUS` | Continuous | Change columns mid-page |
| `EVEN_PAGE`, `ODD_PAGE` | Even/Odd Page | Chapters starting on a right-hand page |
| `NEW_COLUMN` | New Column | Multi-column layouts |

```python
from docx.enum.section import WD_SECTION, WD_ORIENT
doc.add_paragraph("Narrative in portrait.")
land = doc.add_section(WD_SECTION.NEW_PAGE)
land.orientation = WD_ORIENT.LANDSCAPE
land.page_width, land.page_height = land.page_height, land.page_width
doc.add_paragraph("Wide rate matrix goes here.")
back = doc.add_section(WD_SECTION.NEW_PAGE)
back.orientation = WD_ORIENT.PORTRAIT
back.page_width, back.page_height = back.page_height, back.page_width
doc.add_paragraph("Back to portrait.")
```

A new section inherits the previous section's settings, which is why you must explicitly flip the orientation back. Content added after `add_section` belongs to the new section.

#### Which section does a paragraph belong to?

In the XML, a section's properties (`w:sectPr`) are stored at the *end* of the section: inside the last paragraph of that section, except for the final section whose `sectPr` sits at the end of the body. This means "add a section" really means "close the current one here". `doc.add_section()` moves the body's `sectPr` into a new paragraph and creates a fresh body-level one.

#### Other page settings

```python
sec.header_distance = Cm(1.0)      # header from top edge
sec.footer_distance = Cm(1.0)
sec.gutter = Cm(0.5)               # extra binding margin
sec.different_first_page_header_footer = True
print(sec.start_type)              # WD_SECTION.NEW_PAGE
```

Columns, line numbers, vertical alignment and page-number format have no property yet; they are one `OxmlElement` each on `sec._sectPr`. Page numbering restart, for instance, is `w:pgNumType w:start="1"`:

```python
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
def restart_page_numbers(section, start=1, fmt=None):
    pg = section._sectPr.find(qn("w:pgNumType"))
    if pg is None:
        pg = OxmlElement("w:pgNumType"); section._sectPr.append(pg)
    pg.set(qn("w:start"), str(start))
    if fmt: pg.set(qn("w:fmt"), fmt)      # "lowerRoman", "decimal", "upperLetter"
```

Element order inside `sectPr` matters to strict validators; `pgNumType` belongs after `pgMar` and before `cols`. Word is lenient about this particular element, but the XML chapter shows how to insert in schema order.

> **Interview note:** "How do you put one landscape page in a portrait document?" is a classic. Answer with the three-section pattern (portrait, landscape, portrait), mention that width/height must be swapped manually, and mention that headers and footers of the new sections are linked to the previous one by default so the landscape page inherits them.

#### Reading layout for QA

```python
for i, s in enumerate(doc.sections):
    print(i, s.orientation, f"{s.page_width.cm:.1f}x{s.page_height.cm:.1f} cm",
          f"margins L{s.left_margin.cm:.1f} R{s.right_margin.cm:.1f}")
```

I run this on every client template before generating, because a "Letter" template that is secretly A4 with 0.7-inch margins is a common cause of "the layout looks different on my side".

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.shared import Cm
from docx.enum.section import WD_ORIENT, WD_SECTION

doc = Document()
s0 = doc.sections[0]
s0.page_width, s0.page_height = Cm(21.0), Cm(29.7)
s0.left_margin = s0.right_margin = Cm(2.5)
doc.add_heading("Wyoming Title Rates", 1)
doc.add_paragraph("Narrative section in portrait A4.")

s1 = doc.add_section(WD_SECTION.NEW_PAGE)
s1.orientation = WD_ORIENT.LANDSCAPE
s1.page_width, s1.page_height = s1.page_height, s1.page_width
doc.add_paragraph("Landscape page for the rate matrix.")

s2 = doc.add_section(WD_SECTION.NEW_PAGE)
s2.orientation = WD_ORIENT.PORTRAIT
s2.page_width, s2.page_height = s2.page_height, s2.page_width
doc.add_paragraph("Appendix, back in portrait.")

for i, s in enumerate(doc.sections):
    print(i, s.orientation, f"{s.page_width.cm:.1f} x {s.page_height.cm:.1f} cm, start={s.start_type}")
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. To make a section landscape you must:
- [ ] Set `orientation` only
- [x] Set `orientation` and swap `page_width` with `page_height`
- [ ] Set `page_width` larger than `page_height` only
> Word stores orientation and dimensions separately; both must agree.

2. Where does the XML store a non-final section's properties?
- [ ] At the start of the section
- [x] In the last paragraph of that section
- [ ] In `settings.xml`
> `w:sectPr` marks the end of a section; the final one lives at the end of the body.

3. What does a new section inherit?
- [x] The previous section's page size, margins and linked headers/footers
- [ ] Nothing; it uses the template defaults
- [ ] Only the margins
> `add_section` copies the previous `sectPr`, so explicitly reset what should differ.

### Exercises

1. **Booklet margins** — Set the first section to Letter, mirror-like inner margin 1.25" and outer 0.75", top and bottom 1".
<details><summary>Solution</summary>

```python
from docx.shared import Inches
s = doc.sections[0]
s.page_width, s.page_height = Inches(8.5), Inches(11)
s.left_margin, s.right_margin = Inches(1.25), Inches(0.75)
s.top_margin = s.bottom_margin = Inches(1)
s.gutter = Inches(0)
```

</details>

2. **Layout audit** — Write `audit(doc)` that returns a list of `(index, orientation, width_cm, height_cm)` tuples for every section.
<details><summary>Solution</summary>

```python
def audit(doc):
    return [(i, str(s.orientation), round(s.page_width.cm, 1), round(s.page_height.cm, 1))
            for i, s in enumerate(doc.sections)]
```

</details>

### Interview Questions

**Q: Explain how sections are represented in a .docx and what that means for `add_section`.**
Each section's properties live in a `w:sectPr` element placed at the end of the section: inside the `w:pPr` of the last paragraph for all but the final section, whose `sectPr` is the last child of `w:body`. So a section break is a property of the paragraph that ends the section, not a standalone element. `add_section` therefore adds a paragraph carrying a copy of the current body `sectPr` and creates a new body-level `sectPr`, and everything added afterwards falls into the new section.

**Q: How do you restart page numbering at 1 in the body after a roman-numbered front matter?**
Create the body as a new section, then set `w:pgNumType w:start="1"` on its `sectPr`; give the front matter section `w:pgNumType w:fmt="lowerRoman"`. python-docx has no property for this, so it is a small OxmlElement helper. The footer must also be unlinked from the previous section if the format of the PAGE field display differs, but usually the same `PAGE` field works in both because formatting comes from `pgNumType`.

**Q: What layout differences between a client template and your generator cause "it looks different on my machine" complaints?**
Page size (A4 vs Letter), margins, gutter, header distance and default fonts that differ between their `.dotx` and python-docx's default template. I print a section audit for every template before generating and compare it with the client's brand guide. The second cause is font substitution when a brand font is missing on the generating machine, which changes line breaks; that is a font issue, not a section issue, and is covered in the fonts chapter.

## Headers, footers and page numbers

Headers and footers belong to sections. Each section has a default header and footer, and optionally a different first-page pair and an even-page pair. python-docx exposes all three, and each is a container of paragraphs and tables just like the body.

```python
from docx import Document
doc = Document()
sec = doc.sections[0]
header = sec.header
header.paragraphs[0].text = "Stewart Title, Production Support, Confidential"
footer = sec.footer
footer.paragraphs[0].text = "Generated by the reporting pipeline"
```

A new header already contains one empty paragraph, so use `paragraphs[0]` first and `add_paragraph()` for more. A header can hold a table (the classic three-cell letterhead: logo left, title centre, date right) via `header.add_table(rows, cols, width)`.

#### Linked to previous

By default every section after the first has `is_linked_to_previous = True`, meaning it shows the previous section's header. Setting it to `False` creates an independent header part you can edit; setting it back to `True` deletes that section's own header content.

```python
sec2 = doc.add_section()
sec2.header.is_linked_to_previous = False
sec2.header.paragraphs[0].text = "Appendix A: Rate Tables"
```

#### First page and even pages

```python
sec.different_first_page_header_footer = True
sec.first_page_header.paragraphs[0].text = ""          # blank on the cover
doc.settings.odd_and_even_pages_header_footer = True   # document-wide switch
sec.even_page_header.paragraphs[0].text = "Policy Manual"
```

Odd/even is a document-level setting (`w:evenAndOddHeaders` in `settings.xml`); the even-page header content is per section.

#### Page numbers with field codes

python-docx cannot insert fields, but a `PAGE` field is just three runs of XML. This helper is the workhorse of every footer I generate:

```python
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_field(run, instr):
    """Append a complex field (begin/instr/separate/end) inside `run`."""
    for kind, payload in (("begin", None), ("instr", instr), ("separate", None), ("end", None)):
        if kind == "instr":
            el = OxmlElement("w:instrText"); el.set(qn("xml:space"), "preserve"); el.text = f" {payload} "
        else:
            el = OxmlElement("w:fldChar"); el.set(qn("w:fldCharType"), kind)
        run._r.append(el)

p = doc.sections[0].footer.paragraphs[0]
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run("Page ")
add_field(p.add_run(), "PAGE")
p.add_run(" of ")
add_field(p.add_run(), "NUMPAGES")
```

Word computes the value when it lays out the page. Because there is no cached result between `separate` and `end`, the field shows blank until Word or LibreOffice renders it, which happens immediately on open. `SECTIONPAGES` gives the count within the section, and `PAGE \* ROMAN` or `\* ArabicDash` change the format.

| Field | Result |
|---|---|
| `PAGE` | Current page number |
| `NUMPAGES` | Total pages in the document |
| `SECTIONPAGES` | Pages in the current section |
| `STYLEREF "Heading 1"` | Text of the latest Heading 1 (running head) |
| `DATE \@ "d MMMM yyyy"` | Today's date, formatted |
| `DOCPROPERTY Title` | Document title property |
| `FILENAME \p` | File name with path |

#### Alignment with tabs

The three-part footer (left text, centred page number, right date) uses tab stops in Word rather than tables:

```python
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.shared import Inches
p = doc.sections[0].footer.add_paragraph()
ts = p.paragraph_format.tab_stops
ts.add_tab_stop(Inches(3.25), WD_TAB_ALIGNMENT.CENTER)
ts.add_tab_stop(Inches(6.5), WD_TAB_ALIGNMENT.RIGHT)
p.add_run("Confidential\t")
add_field(p.add_run(), "PAGE")
p.add_run("\tv3.1")
```

The default template's `Header` and `Footer` styles already define centre and right tab stops at 3.25" and 6.5" for Letter, which is why `"\t"` in a plain footer paragraph often just works.

> **Warning:** A header with a picture must size it explicitly; a native-size logo in the header pushes the body down on every page. Use `header.paragraphs[0].add_run().add_picture(path, height=Cm(1.2))`.

#### Reading headers for QA

```python
for i, s in enumerate(doc.sections):
    print(i, "linked" if s.header.is_linked_to_previous else "own", "|", s.header.paragraphs[0].text)
```

Header and footer text does not appear in `doc.paragraphs`; audits and find-and-replace must walk each section's header and footer (and the first-page and even variants) separately.

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_field(run, instr):
    for kind in ("begin", "instr", "separate", "end"):
        if kind == "instr":
            el = OxmlElement("w:instrText"); el.set(qn("xml:space"), "preserve"); el.text = f" {instr} "
        else:
            el = OxmlElement("w:fldChar"); el.set(qn("w:fldCharType"), kind)
        run._r.append(el)

doc = Document()
sec = doc.sections[0]
sec.header.paragraphs[0].text = "Weekly Production Report | Stewart Title"
f = sec.footer.paragraphs[0]; f.alignment = WD_ALIGN_PARAGRAPH.CENTER
f.add_run("Page "); add_field(f.add_run(), "PAGE"); f.add_run(" of "); add_field(f.add_run(), "NUMPAGES")
doc.add_paragraph("Body text.")

xml = sec.footer._element.xml
print("PAGE field present:", "PAGE" in xml, "| fldChar count:", xml.count("fldChar"))
print("header:", sec.header.paragraphs[0].text)
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. What does `section.header.is_linked_to_previous = True` do to a section that had its own header?
- [ ] Nothing
- [x] Removes that section's header content and shows the previous section's header
- [ ] Copies the previous header into it
> Linking deletes the section's own header definition.

2. A `PAGE` field built with fldChar shows what before Word opens the file?
- [x] Nothing (or the cached result you supplied)
- [ ] The correct page number
- [ ] An error
> Field results are computed by the renderer; python-docx only writes the instruction.

3. Which setting enables different even-page headers?
- [ ] `section.even_pages = True`
- [x] `doc.settings.odd_and_even_pages_header_footer = True`
- [ ] `section.different_first_page_header_footer = True`
> Odd/even is document-wide in `settings.xml`; first-page is per section.

### Exercises

1. **Running head** — Put a `STYLEREF "Heading 1"` field in the header so each page shows its chapter title.
<details><summary>Solution</summary>

```python
h = doc.sections[0].header.paragraphs[0]
h.text = ""
add_field(h.add_run(), 'STYLEREF "Heading 1"')
```

</details>

2. **Cover page without header** — Make the first page of section 0 have an empty header and footer while other pages show "Confidential".
<details><summary>Solution</summary>

```python
s = doc.sections[0]
s.different_first_page_header_footer = True
s.header.paragraphs[0].text = "Confidential"
s.first_page_header.paragraphs[0].text = ""
s.first_page_footer.paragraphs[0].text = ""
```

</details>

### Interview Questions

**Q: How do you insert "Page X of Y" with python-docx?**
The library has no field API, so I emit a complex field: a run with `w:fldChar fldCharType="begin"`, a run with `w:instrText` containing `PAGE`, a `separate` run, and an `end` run, then the same for `NUMPAGES`. Word evaluates it on open. I wrap this in an `add_field(run, instr)` helper and reuse it for `STYLEREF`, `DATE` and `DOCPROPERTY`. The alternative `w:fldSimple` element is shorter but Word rewrites it to the complex form anyway.

**Q: Why does a header edit not show up on page 1?**
Because the section has `different_first_page_header_footer` enabled (`w:titlePg`), so page 1 uses `first_page_header`, which is a separate part. Or the document has odd/even headers enabled and you edited only the default (odd) header. I always print which of the three header variants each section has before editing a client template.

**Q: Where does header text hide from a naive find-and-replace, and how do you cover it?**
Headers and footers are separate parts per section, with up to three variants each (default, first, even), and the text can also be inside tables in those headers. `doc.paragraphs` sees none of it. My replace routine builds a list of containers: the body, every table cell recursively, and for each section all six header/footer variants, then runs the same run-aware replace over each. Footnotes and text boxes need XML-level handling on top of that.

## Fonts and character formatting

Setting `run.font.name = "Arial"` looks complete, but Word chooses fonts per script. A run's font is defined by four attributes on `w:rFonts`: `ascii` (Latin), `hAnsi` (high ANSI, accented Latin), `eastAsia` (CJK) and `cs` (complex scripts such as Arabic and Urdu). python-docx sets `ascii` and `hAnsi`; the other two stay at the style's or theme's default.

```python
from docx import Document
from docx.shared import Pt
doc = Document()
r = doc.add_paragraph().add_run("Title Commitment")
r.font.name = "Arial"
r.font.size = Pt(11)
```

For text that contains Urdu, Arabic or Chinese characters, or when a client insists on one font for everything, set the remaining attributes explicitly:

```python
from docx.oxml.ns import qn
rPr = r._r.get_or_add_rPr()
rFonts = rPr.get_or_add_rFonts()
rFonts.set(qn("w:eastAsia"), "Arial")
rFonts.set(qn("w:cs"), "Arial")
```

For Urdu deliverables the complex-script font is what matters: `rFonts.set(qn("w:cs"), "Jameel Noori Nastaleeq")` together with `run.font.complex_script = True` and `run.font.rtl = True` for right-to-left runs. The size of complex-script text is a separate property, `w:szCs`; python-docx sets `w:sz` only, so add `szCs` via XML when mixing scripts:

```python
from docx.oxml import OxmlElement
sz = OxmlElement("w:szCs"); sz.set(qn("w:val"), "28")   # half-points: 28 = 14pt
rPr.append(sz)
```

#### Theme fonts versus explicit fonts

A style whose font is "+Body" or "+Headings" uses the document theme (`theme1.xml`), which is how one template can switch from Calibri/Cambria to a brand pair in one click. When you set `font.name` you override the theme for that run, so the text no longer follows a rebrand. Prefer leaving `font.name` unset and configuring the style or theme instead. Reading back `run.font.name` returns `None` for theme-driven text, which surprises people auditing documents: `None` means inherited, not missing.

#### The font properties table

| Property | XML | Notes |
|---|---|---|
| `font.name` | `w:rFonts ascii/hAnsi` | eastAsia/cs need XML |
| `font.size` | `w:sz` (half-points) | `Pt(11)` becomes 22 |
| `font.bold`, `italic` | `w:b`, `w:i` | `w:bCs`, `w:iCs` for complex script |
| `font.color.rgb` | `w:color` | `font.color.theme_color` for theme colours |
| `font.underline` | `w:u` | `WD_UNDERLINE.DOUBLE`, `.DOTTED` |
| `font.highlight_color` | `w:highlight` | 16 fixed `WD_COLOR_INDEX` values |
| `font.all_caps`, `small_caps` | `w:caps`, `w:smallCaps` | |
| `font.strike`, `double_strike` | `w:strike`, `w:dstrike` | |
| `font.superscript`, `subscript` | `w:vertAlign` | |
| `font.hidden` | `w:vanish` | Hidden text |
| `font.shadow`, `outline`, `emboss`, `imprint` | legacy effects | Rarely used |

Character spacing (expanded/condensed), kerning and OpenType features (ligatures, stylistic sets) have no property; they are `w:spacing`, `w:kern` and `w14:ligatures` elements added through XML.

#### Theme colours

```python
from docx.enum.dml import MSO_THEME_COLOR
r.font.color.theme_color = MSO_THEME_COLOR.ACCENT_1
```

Theme colours rebrand with the template; RGB does not. For a brand template that will be re-themed later, use `theme_color` in your styles and reserve `rgb` for one-off highlights.

#### Embedded fonts

Word can embed fonts (File, Options, Save, "Embed fonts in the file") so a document renders identically on a machine without the brand font. python-docx cannot embed fonts, but it preserves fonts already embedded in a template: the `word/fonts/*.odttf` parts and `fontTable.xml` entries pass through untouched. So the workflow is: embed once in the `.dotx` using Word, then generate from that template. Note the licence caveat: only fonts whose embedding permission allows it can be embedded, and Word silently skips restricted fonts.

> **Tip:** When a generated document shows a different font than expected, open it and look at the Font box in Word. If it shows the right name but the wrong glyphs, the font is missing on that machine and Word substituted; if it shows a different name, your `rFonts` attributes are incomplete for that script.

#### Auditing fonts in a document

```python
from collections import Counter
fonts = Counter()
for p in doc.paragraphs:
    for r in p.runs:
        fonts[r.font.name or f"(style: {p.style.font.name or 'theme'})"] += 1
print(fonts.most_common())
```

This is a five-line check I run before delivering any Fiverr order, because clients often paste text from other documents and bring stray fonts with it.

### Try It Yourself

```python
from io import BytesIO
from collections import Counter
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.dml import MSO_THEME_COLOR
from docx.oxml.ns import qn

doc = Document()
p = doc.add_paragraph()
a = p.add_run("Title Commitment "); a.font.name = "Arial"; a.font.size = Pt(11)
rPr = a._r.get_or_add_rPr(); rf = rPr.get_or_add_rFonts()
rf.set(qn("w:eastAsia"), "Arial"); rf.set(qn("w:cs"), "Arial")
b = p.add_run("(draft)"); b.italic = True; b.font.color.theme_color = MSO_THEME_COLOR.ACCENT_1
c = doc.add_paragraph().add_run("Inherits the Normal style font")

print("rFonts on run a:", dict(rf.attrib))
for para in doc.paragraphs:
    for run in para.runs:
        print(repr(run.text), "font:", run.font.name, "size:", run.font.size.pt if run.font.size else None)
print("Normal style font:", doc.styles["Normal"].font.name)
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. `run.font.name = "Arial"` sets which `w:rFonts` attributes?
- [x] `ascii` and `hAnsi`
- [ ] All four
- [ ] `eastAsia` only
> Complex-script and East Asian fonts need `qn("w:cs")` and `qn("w:eastAsia")` via XML.

2. `run.font.name` returns `None`. What does it mean?
- [ ] The run has no font and will not render
- [x] The font is inherited from the style or theme
- [ ] The document is corrupt
> `None` is "not set here", which is the healthy state for style-driven text.

3. Can python-docx embed a font in the document?
- [ ] Yes, with `doc.embed_font()`
- [x] No, but it preserves fonts already embedded in the template
- [ ] Only TrueType fonts
> Embed once in the .dotx with Word, then generate from it.

### Exercises

1. **All-script font** — Write `set_font(run, name, size_pt)` that sets Latin, East Asian and complex-script fonts and both size attributes.
<details><summary>Solution</summary>

```python
from docx.shared import Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
def set_font(run, name, size_pt):
    run.font.name = name; run.font.size = Pt(size_pt)
    rPr = run._r.get_or_add_rPr(); rf = rPr.get_or_add_rFonts()
    for attr in ("w:eastAsia", "w:cs"):
        rf.set(qn(attr), name)
    szCs = OxmlElement("w:szCs"); szCs.set(qn("w:val"), str(int(size_pt * 2))); rPr.append(szCs)
```

</details>

2. **Stray font report** — List every run whose explicit font differs from the Normal style's font.
<details><summary>Solution</summary>

```python
base = doc.styles["Normal"].font.name
for p in doc.paragraphs:
    for r in p.runs:
        if r.font.name and r.font.name != base:
            print(r.font.name, "|", r.text[:40])
```

</details>

### Interview Questions

**Q: A client's Urdu text renders in the wrong font although you set `font.name`. Why?**
Word picks the font per script: Latin from `ascii`/`hAnsi`, Arabic-script text from `cs`. python-docx sets only the first two, so the complex-script font falls back to the style or theme default, typically Arial or Times. The fix is to set `w:cs` on `rFonts` (and `w:szCs` for size) and mark the run `complex_script`/`rtl` where appropriate. I keep a `set_font()` helper that writes all four attributes so I never hit this again.

**Q: Theme fonts or explicit fonts in a brand template?**
Theme fonts. If the styles reference +Headings and +Body and the theme defines the brand pair, a later rebrand is a theme change. Explicit `font.name` on runs freezes the choice and has to be found and replaced run by run. I reserve explicit fonts for cases the theme cannot express, such as a monospace font for code samples or a specific Nastaliq font for Urdu.

**Q: How do you guarantee a generated document looks identical on the client's machine?**
Three layers: use fonts the client actually has (their brand fonts, confirmed), embed those fonts in the `.dotx` using Word so the package carries them, and deliver a PDF alongside the DOCX for the authoritative rendering. I also avoid font-dependent tricks like aligning columns with spaces, and I test the file on a machine without the fonts installed to see the substitution before the client does.

# LEVEL: Advanced

## Templates and style reuse

A generator that starts from `Document()` inherits python-docx's plain default template. Real deliverables start from the client's branded template: their fonts, heading colours, table styles, cover page, letterhead header and legal footer. The rule is simple: **design in Word, generate in Python**. Every visual decision lives in the `.dotx`; the code only adds content and applies styles by name.

```python
from docx import Document
from docx.opc.constants import CONTENT_TYPE as CT

doc = Document("templates/StewartTitle-Report.dotx")
doc.part._content_type = CT.WML_DOCUMENT_MAIN   # save as a document, not a template
doc.add_heading("Weekly Production Report", 1)
doc.save("out/report-2026-W37.docx")
```

Opening a `.dotx` works out of the box; the one gotcha is the content type of the main part. Without the second line, Word opens the saved file and treats it as a template (Save As defaults to `.dotx`, and double-clicking spawns a copy). Some teams avoid the issue by saving the template as a `.docx` named `template.docx`; that also works and needs no content-type fix.

#### Keep the template's styles, discard its sample content

Designers often leave sample text in the template so they can see the styles. A generator should clear the body but keep the section properties (the trailing `w:sectPr`), otherwise the page setup and header links disappear:

```python
def clear_body(doc):
    body = doc.element.body
    for child in list(body):
        if child.tag.endswith("}sectPr"):
            continue
        body.remove(child)
clear_body(doc)
```

After this, `doc.paragraphs` is empty, headers and footers are intact, and every style is still available.

#### Verify the styles you rely on

Fail fast if the template changed:

```python
REQUIRED = ["Heading 1", "Heading 2", "Body Text", "Table Grid", "Caption", "List Bullet"]
missing = [s for s in REQUIRED if s not in [st.name for st in doc.styles]]
if missing:
    raise SystemExit(f"Template is missing styles: {missing}")
```

A designer renaming "Body Text" to "Body" silently breaks generation weeks later; this check turns it into a clear error at the start of the run.

#### Insert content at a marker, not at the end

Templates usually have a cover page and a TOC before the body. `add_paragraph` always appends at the end of the body, which puts your content after the back matter. The technique is to find a marker paragraph and insert before it:

```python
import copy
from docx.text.paragraph import Paragraph

def insert_paragraph_before(marker, text="", style=None):
    return marker.insert_paragraph_before(text, style)   # public API since 0.8

def insert_table_before(marker, table):
    marker._p.addprevious(table._tbl)

marker = next(p for p in doc.paragraphs if p.text.strip() == "[[BODY]]")
insert_paragraph_before(marker, "1. Summary", style="Heading 1")
insert_paragraph_before(marker, "Files opened rose 4% week over week.", style="Body Text")
t = doc.add_table(rows=2, cols=2, style="Table Grid")    # created at the end
insert_table_before(marker, t)                           # moved into place
marker._p.getparent().remove(marker._p)                  # delete the marker
```

`Paragraph.insert_paragraph_before()` is public. Tables have no such helper, so create the table anywhere and move its `w:tbl` element with lxml's `addprevious`. Moving an element in lxml removes it from its old position automatically.

#### Reusing a template across documents

Load once, deep-copy per document? Not with python-docx: the `Document` object wraps a package with many parts, and `copy.deepcopy` does not reliably clone it. Load the template freshly for each output; on a 1 MB template that costs about 50 ms, which is negligible against the rest of the work.

| Practice | Why |
|---|---|
| Store templates in version control with a version number in `docProps/core.xml` | Reproducible output |
| Never modify styles from code | Designers own styles; code owns content |
| Keep a `[[BODY]]` marker paragraph in Body Text style | Predictable insertion point |
| Embed brand fonts in the `.dotx` with Word | Identical rendering everywhere |
| Clear sample content programmatically, not by hand | Template stays self-documenting |

> **Interview note:** Interviewers ask "why not build the styles in code?" Because a designer with Word can iterate a heading style in seconds, and the same `.dotx` serves human-authored documents and generated ones, so the brand stays consistent. Code-defined styles drift from the manual documents within a month.

#### Attached templates and the Organizer

Word documents can be *attached* to a template (`w:attachedTemplate` in `settings.xml`), which is how "Automatically update document styles" pulls style changes into old documents. python-docx does not manage this; when a client wants 300 old reports restyled, the practical route is Word's Organizer or a VBA loop, or regenerating from data if you still have it.

### Try It Yourself

```python
from io import BytesIO
from docx import Document

# stand-in for a designer's template: has a cover, a TOC line and a [[BODY]] marker
tpl = Document()
tpl.add_heading("COVER: Weekly Production Report", 0)
tpl.add_paragraph("Table of contents goes here")
tpl.add_paragraph("[[BODY]]")
tpl.add_paragraph("Back matter: legal notice.")
tbuf = BytesIO(); tpl.save(tbuf)

doc = Document(BytesIO(tbuf.getvalue()))
REQUIRED = ["Heading 1", "Table Grid", "List Bullet"]
names = [s.name for s in doc.styles]
print("missing styles:", [s for s in REQUIRED if s not in names])

marker = next(p for p in doc.paragraphs if p.text.strip() == "[[BODY]]")
marker.insert_paragraph_before("1. Summary", style="Heading 1")
marker.insert_paragraph_before("Files opened rose 4% week over week.")
t = doc.add_table(rows=1, cols=2, style="Table Grid")
t.cell(0, 0).text = "Files"; t.cell(0, 1).text = "412"
marker._p.addprevious(t._tbl)
marker._p.getparent().remove(marker._p)

for b in doc.iter_inner_content():
    print(type(b).__name__, "->", getattr(b, "text", "[table]"))
out = BytesIO(); doc.save(out); print(len(out.getvalue()), "bytes")
```

### Quiz

1. After `Document("brand.dotx")` and `save("x.docx")`, Word treats the file as a template. Why?
- [x] The main part's content type still says template
- [ ] The file extension is wrong
- [ ] python-docx cannot open .dotx files
> Set `doc.part._content_type = CT.WML_DOCUMENT_MAIN` before saving.

2. When clearing a template's body you must keep:
- [ ] The first paragraph
- [x] The trailing `w:sectPr`
- [ ] All tables
> Removing the body-level section properties loses page setup and header links.

3. How do you place a table before a marker paragraph?
- [ ] `doc.add_table(..., before=marker)`
- [x] Create it, then `marker._p.addprevious(table._tbl)`
- [ ] Tables can only be appended
> lxml moves the element; python-docx has no insert-before for tables.

### Exercises

1. **Template guard** — Write `load_template(path, required)` that opens a template, fixes the content type, checks required styles and clears the body.
<details><summary>Solution</summary>

```python
from docx import Document
from docx.opc.constants import CONTENT_TYPE as CT
def load_template(path, required):
    doc = Document(path)
    doc.part._content_type = CT.WML_DOCUMENT_MAIN
    have = {s.name for s in doc.styles}
    missing = [s for s in required if s not in have]
    if missing:
        raise ValueError(f"missing styles: {missing}")
    body = doc.element.body
    for child in list(body):
        if not child.tag.endswith("}sectPr"):
            body.remove(child)
    return doc
```

</details>

2. **Marker filler** — Replace every paragraph whose text is `[[SECTION:name]]` with a Heading 1 containing `name`.
<details><summary>Solution</summary>

```python
import re
for p in list(doc.paragraphs):
    m = re.fullmatch(r"\[\[SECTION:(.+)\]\]", p.text.strip())
    if m:
        p.text = m.group(1)
        p.style = doc.styles["Heading 1"]
```

</details>

### Interview Questions

**Q: Describe your template workflow for a branded report generator.**
The designer builds a `.dotx` with styles, header/footer, cover and a `[[BODY]]` marker; I keep it in git with a version in its core properties. The generator opens it, switches the content type to document, asserts the styles it needs, clears the body but keeps the `sectPr`, and inserts content before the marker using `insert_paragraph_before` and lxml `addprevious` for tables. Styles are never modified in code. When the brand changes, the designer ships a new `.dotx` and no code changes.

**Q: What breaks when you `copy.deepcopy` a Document to reuse a loaded template?**
The `Document` object is a thin proxy over an OPC package with many related parts and lxml trees that hold parent references. Deep copy either fails or produces a package whose parts still point at the original, so images and headers get shared or lost. Reloading the template per document is cheap and correct, and for high volume I keep the template bytes in memory and call `Document(BytesIO(bytes))` each time.

**Q: How would you restyle hundreds of existing documents to a new brand?**
If the original data exists, regenerate from the new template; that is cleanest. Otherwise, in Word attach the new template to each file with "Automatically update document styles" (via a VBA loop over the folder), or copy styles with the Organizer. A python-docx approach is to replace `word/styles.xml` and `theme1.xml` in each package with the new template's parts, which works when style names match but needs QA for direct formatting that overrides the styles.

## Find-and-replace across runs

The most common automation request is "fill this template": replace `{{CLIENT}}`, `{{DATE}}` and `{{POLICY_NO}}` in a Word document written by a human. The naive loop fails on real files:

```python
for p in doc.paragraphs:
    for r in p.runs:
        r.text = r.text.replace("{{CLIENT}}", "Stewart Title")   # misses split tokens
```

Word splits text into runs whenever formatting changes, when spell-check marks a word, when the author paused typing, or when a tracked change was accepted. `{{CLIENT}}` regularly lands as `{{`, `CLIENT`, `}}` in three runs, so run-level replace never matches. A robust replacer works at paragraph level and then writes the result back into runs.

#### The algorithm

1. Join the run texts into one string and remember each run's start offset.
2. Find matches in the joined string.
3. For each match, put the replacement into the run where the match starts, and delete the matched characters from the runs it spans.
4. Formatting of the first run wins, which is almost always what the author intended.

```python
import re

def replace_in_paragraph(paragraph, pattern, repl):
    runs = paragraph.runs
    if not runs:
        return 0
    full = "".join(r.text for r in runs)
    matches = list(re.finditer(pattern, full))
    if not matches:
        return 0
    # run boundaries
    bounds, pos = [], 0
    for r in runs:
        bounds.append((pos, pos + len(r.text))); pos += len(r.text)
    for m in reversed(matches):                  # right to left keeps offsets valid
        s, e = m.span()
        new = m.expand(repl) if isinstance(repl, str) else repl(m)
        for i, (rs, re_) in enumerate(bounds):
            if re_ <= s or rs >= e:
                continue                          # run not touched
            cut_s, cut_e = max(s, rs) - rs, min(e, re_) - rs
            t = runs[i].text
            if rs <= s < re_:                     # run containing the start
                runs[i].text = t[:cut_s] + new + t[cut_e:]
            else:
                runs[i].text = t[:cut_s] + t[cut_e:]
    return len(matches)
```

Because the algorithm edits `run.text` only, every run keeps its bold, colour and style. Deleted runs simply end up empty, which Word ignores.

#### Covering the whole document

Text hides in tables, nested tables, headers, footers and their first-page and even-page variants. One generator yields every paragraph in a document:

```python
def iter_paragraphs(doc):
    def walk(container):
        for p in container.paragraphs:
            yield p
        for t in container.tables:
            for row in t.rows:
                for cell in row.cells:
                    yield from walk(cell)
    yield from walk(doc)
    for s in doc.sections:
        for hf in (s.header, s.footer, s.first_page_header, s.first_page_footer,
                   s.even_page_header, s.even_page_footer):
            yield from walk(hf)

def replace_everywhere(doc, mapping):
    total = 0
    for p in iter_paragraphs(doc):
        for key, val in mapping.items():
            total += replace_in_paragraph(p, re.escape(key), lambda m, v=val: v)
    return total
```

Merged cells appear more than once in `row.cells`; the replace is idempotent after the first pass, so this is harmless. Text boxes and footnotes are separate stories not reached here; the XML chapter shows how to xpath into `w:txbxContent`.

#### Choosing token syntax

| Syntax | Pros | Cons |
|---|---|---|
| `{{name}}` | Familiar from Jinja; rarely appears in prose | Word autocorrect can turn `{{` into a smart quote sequence in some locales |
| `[[NAME]]` | Never autocorrected; easy to see | Looks technical to clients |
| `«name»` | Word's own merge-field look | Hard to type |
| `DOCPROPERTY` fields | Word-native, updates itself | Needs field update on open |

Tell the template author to type tokens in one go and not to spell-check them, but never rely on it: the paragraph-level algorithm handles the split anyway.

> **Warning:** Replacing a token with multi-line text (`\n`) does not create paragraphs; Word shows the newline as nothing or a box. For multi-paragraph content, insert new paragraphs with `insert_paragraph_before` and remove the token paragraph.

#### docxtpl: when the template author can learn Jinja

`python-docx-template` (`pip install docxtpl`) wraps python-docx and lets template authors write `{{ client }}`, `{% for row in rows %}` inside a real Word file, including loops over table rows (`{%tr for r in rows %}`). It merges split runs before rendering, so it solves the same problem. I use docxtpl when the client's staff will maintain the template; I use the hand-written replacer when the template must stay a plain Word file with no Jinja knowledge required.

### Try It Yourself

```python
import re
from io import BytesIO
from docx import Document

def replace_in_paragraph(paragraph, pattern, repl):
    runs = paragraph.runs
    full = "".join(r.text for r in runs)
    matches = list(re.finditer(pattern, full))
    bounds, pos = [], 0
    for r in runs:
        bounds.append((pos, pos + len(r.text))); pos += len(r.text)
    for m in reversed(matches):
        s, e = m.span()
        for i, (rs, re_) in enumerate(bounds):
            if re_ <= s or rs >= e: continue
            cs, ce = max(s, rs) - rs, min(e, re_) - rs
            t = runs[i].text
            runs[i].text = (t[:cs] + repl + t[ce:]) if rs <= s < re_ else (t[:cs] + t[ce:])
    return len(matches)

doc = Document()
p = doc.add_paragraph("Prepared for ")
p.add_run("{{").bold = True          # deliberately split token, like Word does
p.add_run("CLIENT").bold = True
p.add_run("}}").bold = True
p.add_run(" on {{DATE}}.")
print("before:", [r.text for r in p.runs])
n = replace_in_paragraph(p, re.escape("{{CLIENT}}"), "Stewart Title")
n += replace_in_paragraph(p, re.escape("{{DATE}}"), "15 Sep 2026")
print("replacements:", n)
print("after: ", [(r.text, bool(r.bold)) for r in p.runs])
print("text:  ", p.text)
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. Why does `run.text.replace("{{X}}", v)` miss tokens?
- [x] Word often splits a token across several runs
- [ ] Runs are read-only
- [ ] Curly braces are escaped in XML
> Only the joined paragraph text reliably contains the whole token.

2. In the paragraph-level algorithm, whose formatting does the replacement text get?
- [ ] The paragraph style only
- [x] The run in which the match started
- [ ] The last run of the match
> Text is written into the first touched run; other runs lose only the matched characters.

3. What does `"\n"` in a replacement produce in Word?
- [ ] A new paragraph
- [x] Nothing useful; paragraphs must be inserted explicitly
- [ ] A page break
> `w:t` text cannot contain paragraph breaks; use `insert_paragraph_before` or `w:br`.

### Exercises

1. **Dictionary fill** — Using `replace_in_paragraph`, replace all `{{KEY}}` tokens in a paragraph from a dict in one pass with a callable replacement.
<details><summary>Solution</summary>

```python
data = {"CLIENT": "Stewart Title", "DATE": "15 Sep 2026"}
def fill(p):
    runs = p.runs; full = "".join(r.text for r in runs)
    for m in reversed(list(re.finditer(r"\{\{(\w+)\}\}", full))):
        key = m.group(1)
        replace_in_paragraph(p, re.escape(m.group(0)), data.get(key, m.group(0)))
```

</details>

2. **Header coverage** — Extend the search to the default header and footer of every section and count replacements.
<details><summary>Solution</summary>

```python
total = 0
for s in doc.sections:
    for hf in (s.header, s.footer):
        for p in hf.paragraphs:
            total += replace_in_paragraph(p, re.escape("{{CLIENT}}"), "Stewart Title")
print(total)
```

</details>

### Interview Questions

**Q: How do you implement reliable find-and-replace in a Word document?**
At paragraph level: concatenate run texts, locate matches with a regex, then write the replacement into the run where the match begins and delete the matched characters from the other runs it spans, processing matches right to left so offsets remain valid. Formatting is preserved because only `run.text` changes. Then apply it to every paragraph container: body, table cells recursively, and all six header/footer variants per section. I ship this as a tested function with a fixture document that deliberately splits tokens across runs.

**Q: When do you choose docxtpl over a custom replacer?**
When the template needs logic, such as loops over table rows or conditional sections, and the template's maintainers can learn a little Jinja. docxtpl handles split runs, table-row loops and image insertion, and it keeps the template a real Word file. For a legal client whose staff must only ever see plain tokens and never a `{% for %}`, the custom replacer is safer, and it has no dependency beyond python-docx.

**Q: What are the failure modes of token replacement that you test for?**
Tokens split across runs; tokens inside tables, headers and footers; two tokens in one run; a token adjacent to bold text where the replacement should inherit bold; replacement text containing characters like `&` that are fine in `w:t` but would break a naive XML string replace; and multi-paragraph replacement values. My test suite builds documents that reproduce each case and asserts on `paragraph.text` and on run formatting after the replace.

## Table of contents field and updating on open

A Word table of contents is a field. Word builds its entries from heading styles (or outline levels) when the field is updated. python-docx can write the field instruction, but it cannot compute page numbers, so the TOC is empty until Word updates it. There are two practical strategies: make Word update fields when the document opens, or run LibreOffice to update and save.

#### Inserting the TOC field

```python
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def add_toc(paragraph, levels="1-3"):
    def run_with(child):
        r = OxmlElement("w:r"); r.append(child); paragraph._p.append(r)
    fc = OxmlElement("w:fldChar"); fc.set(qn("w:fldCharType"), "begin"); fc.set(qn("w:dirty"), "true")
    run_with(fc)
    it = OxmlElement("w:instrText"); it.set(qn("xml:space"), "preserve")
    it.text = f' TOC \\o "{levels}" \\h \\z \\u '
    run_with(it)
    fc = OxmlElement("w:fldChar"); fc.set(qn("w:fldCharType"), "separate"); run_with(fc)
    t = OxmlElement("w:t"); t.text = "Right-click and choose Update Field, or press F9."; run_with(t)
    fc = OxmlElement("w:fldChar"); fc.set(qn("w:fldCharType"), "end"); run_with(fc)

doc = Document()
doc.add_heading("Contents", 1)
add_toc(doc.add_paragraph())
doc.add_page_break()
doc.add_heading("1. Introduction", 1)
doc.add_heading("1.1 Scope", 2)
```

The switches are the same ones Word writes: `\o "1-3"` builds from Heading 1 to 3, `\h` makes entries hyperlinks, `\z` hides tab leaders and page numbers in Web view, and `\u` uses outline levels applied to paragraphs. `w:dirty="true"` on the begin marker asks Word to refresh this specific field when it opens the document.

#### Asking Word to update everything on open

`w:updateFields` in `settings.xml` makes Word prompt "This document contains fields that may refer to other files. Update?" on open, and on Yes it updates every field including the TOC:

```python
def update_fields_on_open(doc):
    settings = doc.settings.element
    el = settings.find(qn("w:updateFields"))
    if el is None:
        el = OxmlElement("w:updateFields"); settings.append(el)
    el.set(qn("w:val"), "true")
update_fields_on_open(doc)
```

The prompt is the price. Many clients accept it; law firms sometimes do not, because it looks like a security warning. Word also clears `updateFields` after the user saves, so the prompt appears once.

#### Updating without Word: LibreOffice headless

LibreOffice can open the DOCX, update indexes and fields, and save a DOCX or PDF. From the shell:

```bash
soffice --headless --convert-to docx --outdir out/ report.docx
```

Plain conversion does not always refresh a TOC; a small Basic macro or a UNO script that calls `document.DocumentIndexes.getByIndex(i).update()` and `document.TextFields.refresh()` does. For PDF proofs I use the UNO route because the client sees correct page numbers immediately.

#### The TOC as a content control

Word wraps its own TOCs in a structured document tag (`w:sdt` with `w:docPartGallery w:val="Table of Contents"`), which gives the "Update Table" button on hover. python-docx does not need that; a bare field works and updates with F9. If a client insists on the button, build the `w:sdt` wrapper with `parse_xml`, which the XML chapter demonstrates.

| Approach | Page numbers correct when delivered? | Side effects |
|---|---|---|
| Bare `TOC` field with `\o` | No, until F9 | None |
| `w:dirty="true"` on the field | On open, silently in most Word versions | Some versions still prompt |
| `w:updateFields` in settings | On open after the user clicks Yes | A dialog on first open |
| LibreOffice UNO update | Yes | LibreOffice must be installed; minor layout differences from Word |
| Word COM automation (`win32com`) | Yes, exactly as Word renders | Windows plus Word licence |

> **Tip:** Number your headings in the text ("3.2 Exceptions") rather than relying on multilevel list numbering when generating from data. Numbered text survives every tool; list numbering must be reconstructed by the renderer and is a frequent source of "the TOC shows 1., 1., 1.".

#### Outline levels for custom styles

A TOC built with `\o` picks up paragraphs whose style has an outline level. If a template uses "Chapter Title" instead of Heading 1, either set the style's outline level in Word (Paragraph dialog, Outline level) or add the `\t "Chapter Title,1"` switch to the field: `TOC \o "1-3" \t "Chapter Title,1,Section Title,2" \h \z \u`.

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def add_toc(paragraph, levels="1-3"):
    def add(child):
        r = OxmlElement("w:r"); r.append(child); paragraph._p.append(r)
    b = OxmlElement("w:fldChar"); b.set(qn("w:fldCharType"), "begin"); b.set(qn("w:dirty"), "true"); add(b)
    it = OxmlElement("w:instrText"); it.set(qn("xml:space"), "preserve")
    it.text = f' TOC \\o "{levels}" \\h \\z \\u '; add(it)
    s = OxmlElement("w:fldChar"); s.set(qn("w:fldCharType"), "separate"); add(s)
    t = OxmlElement("w:t"); t.text = "Press F9 to update the table of contents."; add(t)
    e = OxmlElement("w:fldChar"); e.set(qn("w:fldCharType"), "end"); add(e)

doc = Document()
doc.add_heading("Contents", 1)
toc_p = doc.add_paragraph(); add_toc(toc_p)
doc.add_page_break()
for ch in ["1. Purpose", "2. Scope", "3. Procedure"]:
    doc.add_heading(ch, 1); doc.add_heading(ch + ".1 Details", 2); doc.add_paragraph("Body.")

settings = doc.settings.element
uf = OxmlElement("w:updateFields"); uf.set(qn("w:val"), "true"); settings.append(uf)

print("instrText:", toc_p._p.xpath(".//w:instrText")[0].text)
print("updateFields:", settings.find(qn("w:updateFields")).get(qn("w:val")))
print("headings:", [p.text for p in doc.paragraphs if p.style.name.startswith("Heading")])
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. After python-docx inserts a TOC field, what does the TOC contain?
- [ ] The correct entries and page numbers
- [x] Only the cached text you provided, until a renderer updates it
- [ ] An error
> Page layout is the renderer's job; python-docx writes the instruction only.

2. Which setting makes Word offer to update all fields on open?
- [ ] `w:dirty` on the body
- [x] `w:updateFields w:val="true"` in `settings.xml`
- [ ] `w:autoUpdate`
> Word shows a one-time prompt and refreshes every field on Yes.

3. The `\h` switch in `TOC \o "1-3" \h` does what?
- [x] Makes each entry a hyperlink to its heading
- [ ] Hides the TOC
- [ ] Includes headers
> `\h` is why PDF exports get clickable contents.

### Exercises

1. **TOC with custom style** — Modify `add_toc` to accept an extra mapping like `{"Chapter Title": 1}` and emit the `\t` switch.
<details><summary>Solution</summary>

```python
def add_toc2(paragraph, levels="1-3", extra=None):
    switch = ""
    if extra:
        switch = ' \\t "' + ",".join(f"{k},{v}" for k, v in extra.items()) + '"'
    instr = f' TOC \\o "{levels}"{switch} \\h \\z \\u '
    # then emit begin / instrText(instr) / separate / cached / end as in add_toc
    return instr
print(add_toc2(None, extra={"Chapter Title": 1}))
```

</details>

2. **Heading preview** — Print a fake TOC (indented by level) from the document's heading paragraphs, useful for a QA log.
<details><summary>Solution</summary>

```python
for p in doc.paragraphs:
    if p.style.name.startswith("Heading "):
        lvl = int(p.style.name.split()[-1])
        print("  " * (lvl - 1) + p.text)
```

</details>

### Interview Questions

**Q: How do you deliver a generated document with a correct table of contents?**
Insert the `TOC` field with `\o "1-3" \h \z \u` and mark it dirty, set `w:updateFields` so Word refreshes on open, and for clients who want the file final on arrival run LibreOffice via UNO to update indexes and save, or Word COM on a Windows box. For PDFs I always update through a real renderer, because there is no other way to get page numbers. I also number headings in the text so the entries are meaningful even before the update.

**Q: Why can't python-docx compute page numbers?**
Page numbers depend on layout: fonts, kerning, hyphenation, image sizes, table row heights and widow control all decide where a page ends. That is a full text layout engine, which python-docx deliberately does not include. Word and LibreOffice each have one, and they do not agree perfectly, which is why "page 47 in Word" can be page 46 in LibreOffice. For pixel-exact results the renderer must be the same application the client will use.

**Q: A client's TOC shows entries for body paragraphs. What went wrong?**
Some body paragraphs carry an outline level, usually because someone applied "Heading 2" and then reformatted it to look like body text, or used References, Add Text, which sets an outline level on Normal paragraphs. With `\u` in the field, those paragraphs are included. I audit with python-docx by listing paragraphs whose `pPr/outlineLvl` is set while their style is not a heading, then clear the level or the field switch.

## Working with the underlying XML

python-docx exposes a public API for the common 80% and leaves the rest to you, but it does so gracefully: every object has an `_element` (`_p`, `_r`, `_tbl`, `_tc`, `_sectPr`) that is an lxml element with python-docx's custom element classes attached. Learning four tools unlocks everything Word can do: `OxmlElement`, `qn`, `parse_xml` with `nsdecls`, and lxml's `xpath`.

```python
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls
```

#### qn: qualified names

XML elements in a DOCX carry namespaces. `qn("w:shd")` expands to `{http://schemas.openxmlformats.org/wordprocessingml/2006/main}shd`, which is the form lxml uses for tag names and attribute names.

```python
print(qn("w:val"))
# {http://schemas.openxmlformats.org/wordprocessingml/2006/main}val
```

#### OxmlElement: build elements one at a time

```python
def shade_cell(cell, hex_fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_fill)
    tcPr.append(shd)
shade_cell(table.cell(0, 0), "2B579A")
```

`get_or_add_tcPr()`, `get_or_add_pPr()`, `get_or_add_rPr()` and `get_or_add_trPr()` are generated methods on python-docx's element classes: they return the properties child, creating it in the schema-correct position if absent. The `_p`, `_r` names look private but they have been stable for a decade and the maintainers document them as the escape hatch.

#### parse_xml: build a subtree from a string

For anything bigger than two elements, write the XML literally:

```python
def set_cell_borders(cell, sz=4, color="000000"):
    xml = (
        f'<w:tcBorders {nsdecls("w")}>'
        + "".join(f'<w:{side} w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
                  for side in ("top", "left", "bottom", "right"))
        + "</w:tcBorders>"
    )
    cell._tc.get_or_add_tcPr().append(parse_xml(xml))
```

`nsdecls("w")` emits the `xmlns:w="..."` declaration so the fragment parses standalone; `nsdecls("w", "r")` declares several.

#### Element order matters

OOXML schemas define child order, and Word rejects some out-of-order elements with "unreadable content". `w:rPr` children go in a fixed sequence (`rStyle, rFonts, b, bCs, i, ... color, ... sz, szCs, highlight, u, ... vertAlign, ...`). `append` puts your element last, which is fine when it belongs last (`w:shd` in `tcPr` is near the end) but wrong for, say, `w:rFonts`. python-docx's `_insert_*` helpers know the order:

```python
rPr = run._r.get_or_add_rPr()
rPr._insert_rFonts(OxmlElement("w:rFonts"))    # placed in the correct slot
```

When no helper exists, look at the schema sequence and use `addprevious`/`addnext` on a sibling that you know is in place.

#### xpath: find anything

python-docx elements have an `xpath()` method with the `w:` and other common prefixes pre-registered:

```python
# every text box paragraph in the body
for p in doc.element.body.xpath(".//w:txbxContent//w:p"):
    print("".join(t.text or "" for t in p.xpath(".//w:t")))

# all field instructions in the document
for it in doc.element.xpath("//w:instrText"):
    print(it.text.strip())

# paragraphs with direct outline levels
for p in doc.element.body.xpath(".//w:p[w:pPr/w:outlineLvl]"):
    print(p.xpath("string(.)")[:60])
```

Wrap raw elements back into python-docx objects when you want the friendly API: `Paragraph(p_element, parent)` from `docx.text.paragraph`, `Table(tbl, parent)` from `docx.table`.

#### Hyperlinks: a complete example

Adding a hyperlink needs a relationship on the part plus a `w:hyperlink` element:

```python
from docx.opc.constants import RELATIONSHIP_TYPE as RT

def add_hyperlink(paragraph, url, text):
    part = paragraph.part
    r_id = part.relate_to(url, RT.HYPERLINK, is_external=True)
    link = OxmlElement("w:hyperlink"); link.set(qn("r:id"), r_id)
    r = OxmlElement("w:r"); rPr = OxmlElement("w:rPr")
    rs = OxmlElement("w:rStyle"); rs.set(qn("w:val"), "Hyperlink"); rPr.append(rs)
    r.append(rPr)
    t = OxmlElement("w:t"); t.text = text; t.set(qn("xml:space"), "preserve"); r.append(t)
    link.append(r); paragraph._p.append(link)
    return link
```

The `Hyperlink` character style exists in the default template; a client template may lack it, in which case set blue and underline on the run explicitly.

| Tool | Use it for |
|---|---|
| `qn()` | Any tag or attribute name |
| `OxmlElement()` | Single elements, attributes set with `.set(qn(...), value)` |
| `parse_xml()` + `nsdecls()` | Multi-element fragments |
| `element.xpath()` | Searching, auditing, reaching text boxes and fields |
| `get_or_add_*` / `_insert_*` | Schema-correct placement |
| `element.xml` | Pretty-printed debugging output |

> **Warning:** Inspect first, then write. `print(paragraph._p.xml)` shows exactly what Word produced; copying Word's own structure is the fastest way to a valid result.

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

doc = Document()
t = doc.add_table(rows=2, cols=2, style="Table Grid")
t.cell(0, 0).text = "Shaded header"; t.cell(0, 1).text = "Plain"

# 1) OxmlElement: shade a cell
tcPr = t.cell(0, 0)._tc.get_or_add_tcPr()
shd = OxmlElement("w:shd")
for k, v in (("w:val", "clear"), ("w:color", "auto"), ("w:fill", "2B579A")): shd.set(qn(k), v)
tcPr.append(shd)

# 2) parse_xml: thick borders on another cell
borders = parse_xml(f'<w:tcBorders {nsdecls("w")}>' + "".join(
    f'<w:{s} w:val="single" w:sz="12" w:space="0" w:color="C00000"/>' for s in ("top","left","bottom","right"))
    + "</w:tcBorders>")
t.cell(1, 1)._tc.get_or_add_tcPr().append(borders)

# 3) xpath: find what we did
print("shaded fills:", [e.get(qn("w:fill")) for e in doc.element.body.xpath(".//w:shd")])
print("border sides:", len(doc.element.body.xpath(".//w:tcBorders/*")))
print("qn example:", qn("w:val"))
print(t.cell(0, 0)._tc.xml[:300])
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. What does `qn("w:val")` return?
- [ ] `"w:val"`
- [x] The Clark-notation name `{namespace-uri}val`
- [ ] An lxml element
> lxml identifies tags and attributes by full namespace URI in braces.

2. Which helper places a child in schema order?
- [ ] `element.append`
- [x] `element._insert_rFonts(...)` style helpers or `get_or_add_*`
- [ ] `element.insert(0, ...)`
> `append` puts elements last, which can violate the OOXML sequence.

3. Adding a hyperlink requires what besides the `w:hyperlink` element?
- [x] A relationship on the part via `part.relate_to(url, RT.HYPERLINK, is_external=True)`
- [ ] A bookmark
- [ ] Nothing else
> The element only holds `r:id`; the URL lives in the part's relationships.

### Exercises

1. **Paragraph shading** — Write `shade_paragraph(p, fill)` that adds `w:shd` to the paragraph properties.
<details><summary>Solution</summary>

```python
def shade_paragraph(p, fill):
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), fill)
    pPr.append(shd)
```

</details>

2. **Field inventory** — List every field instruction (both `w:instrText` and `w:fldSimple`) in a document.
<details><summary>Solution</summary>

```python
instrs = [e.text.strip() for e in doc.element.xpath("//w:instrText") if e.text]
instrs += [e.get(qn("w:instr")).strip() for e in doc.element.xpath("//w:fldSimple")]
print(instrs)
```

</details>

### Interview Questions

**Q: When do you drop from the python-docx API to the XML level, and how do you keep it safe?**
Whenever the feature has no property: cell shading, borders, repeat header rows, page-number formats, fields, hyperlinks, content controls, floating images. I keep it safe by first printing the XML Word itself produces for the same feature and copying its structure, by inserting in schema order with `get_or_add_*` or `_insert_*` helpers, and by reopening the saved file in Word as part of the test suite. Each XML tweak becomes a small named helper with one responsibility.

**Q: Explain `parse_xml` versus `OxmlElement`.**
`OxmlElement("w:shd")` builds one element with the correct namespace and python-docx's custom class; you set attributes with `qn` names. `parse_xml(text)` parses a fragment, so it suits multi-element trees like `w:tcBorders` with four sides; `nsdecls("w")` supplies the namespace declaration the fragment needs. Both return lxml elements you can append or insert. I use `OxmlElement` for one-liners and `parse_xml` when the fragment reads better as literal XML.

**Q: Why might Word report "unreadable content" after an XML edit that lxml accepted?**
lxml only checks well-formedness; Word validates against the OOXML schema. Common causes are child elements out of sequence (an `rFonts` appended after `sz`), a `w:tc` with no `w:p`, a table immediately followed by `sectPr` without a paragraph, an `r:id` that does not exist in the part's relationships, or duplicate `wp:docPr` ids on images. I debug by unzipping the output and diffing `document.xml` against a Word-saved version, or by running the Open XML SDK validator on the file.

## Document properties and core metadata

Every `.docx` carries metadata in `docProps/core.xml` (Dublin Core: title, author, subject, keywords, created, modified) and `docProps/app.xml` (application statistics: pages, words, company). python-docx exposes the core properties directly; the app properties and custom properties need the XML layer.

```python
from datetime import datetime, timezone
from docx import Document
doc = Document()
cp = doc.core_properties
cp.title = "Weekly Production Report, Week 37"
cp.subject = "Title production statistics"
cp.author = "Ali Raza"
cp.last_modified_by = "reporting-bot"
cp.keywords = "production; weekly; Wyoming"
cp.category = "Report"
cp.comments = "Generated automatically from the production database."
cp.created = datetime(2026, 9, 15, 9, 0, tzinfo=timezone.utc)
cp.modified = datetime.now(timezone.utc)
cp.revision = 1
```

| Property | Word shows it as | Notes |
|---|---|---|
| `title` | Title (File, Info) | Used by `DOCPROPERTY Title` and PDF metadata |
| `author` | Author | Defaults to "python-docx" if you forget it |
| `last_modified_by` | Last modified by | |
| `created`, `modified`, `last_printed` | Dates | Use timezone-aware UTC datetimes |
| `revision` | Revision number | Integer |
| `keywords`, `subject`, `category`, `comments` | Tags, Subject, Category, Comments | |
| `content_status`, `identifier`, `language`, `version` | Status, Identifier, Language, Version | Rarely shown but stored |

#### The "python-docx" author problem

The default template ships with `author = "python-docx"` and a `created` date from 2013. Clients notice this in File, Info, and so do document inspectors in law firms. Set `author`, `created` and `modified` in every generator; a shared `stamp(doc)` helper is the usual solution.

#### Reading metadata for intake

```python
doc = Document("client.docx")
cp = doc.core_properties
print(cp.title, cp.author, cp.created, cp.last_modified_by, cp.revision)
```

Useful in a BPO intake workflow: flag files whose `last_modified_by` is outside the client's domain, or whose `created` is newer than the purchase order.

#### Fields that read properties

`DOCPROPERTY Title` in a header displays the title property and updates with it, so a single `cp.title` assignment drives the cover page, the header and the PDF title. Use the `add_field(run, 'DOCPROPERTY Title')` helper from the headers chapter.

#### App properties and custom properties

`docProps/app.xml` holds `Company`, `Manager`, `Pages`, `Words` and similar. python-docx has no API for it, but the part is reachable:

```python
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from lxml import etree

def set_app_property(doc, name, value):
    part = doc.part.package.part_related_by(RT.EXTENDED_PROPERTIES)
    ns = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
    root = etree.fromstring(part.blob)
    el = root.find(f"{{{ns}}}{name}")
    if el is None:
        el = etree.SubElement(root, f"{{{ns}}}{name}")
    el.text = str(value)
    part._blob = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)

set_app_property(doc, "Company", "Stewart Title Guaranty")
```

The extended-properties part is a plain `Part` whose content is a byte blob, so you parse, edit and reassign `_blob`. Custom properties (`docProps/custom.xml`, the ones behind `DOCPROPERTY MyProp`) live in a part that may not exist yet; creating it means adding the part, its content type and a relationship from the package, which is a job for the OOXML course's zipfile approach or for Word itself.

#### Stripping metadata before delivery

Clients sometimes require documents free of internal names. Reset what you can:

```python
def scrub(doc):
    cp = doc.core_properties
    for attr in ("author", "last_modified_by", "comments", "keywords", "category", "subject"):
        setattr(cp, attr, "")
    cp.revision = 1
```

Remember that `app.xml` (`Company`, `Manager`) and comments in `comments.xml` are separate; Word's Document Inspector removes everything at once, and for automated pipelines a zipfile pass that rewrites `docProps/*.xml` is the equivalent.

> **Interview note:** "What metadata does a generated document leak?" Core author, last modified by, created and modified dates, revision count, template name in `app.xml`, company, total editing time, and any comments or tracked changes. A strong answer names the two parts, `core.xml` and `app.xml`, and describes scrubbing both.

### Try It Yourself

```python
from io import BytesIO
from datetime import datetime, timezone
from docx import Document

doc = Document()
print("default author:", repr(doc.core_properties.author), "created:", doc.core_properties.created)

cp = doc.core_properties
cp.title = "Weekly Production Report, Week 37"
cp.author = "Ali Raza"
cp.last_modified_by = "reporting-bot"
cp.keywords = "production; weekly; Wyoming"
cp.created = datetime(2026, 9, 15, 9, 0, tzinfo=timezone.utc)
cp.modified = datetime.now(timezone.utc)
cp.revision = 3
doc.add_paragraph("Body.")

buf = BytesIO(); doc.save(buf)
again = Document(BytesIO(buf.getvalue()))
c2 = again.core_properties
for k in ("title", "author", "last_modified_by", "keywords", "created", "revision"):
    print(f"{k:17} {getattr(c2, k)}")
print(len(buf.getvalue()), "bytes")
```

### Quiz

1. Which part stores title, author and keywords?
- [x] `docProps/core.xml`
- [ ] `word/settings.xml`
- [ ] `docProps/app.xml`
> Core properties follow Dublin Core; app.xml stores application statistics like Company and Pages.

2. What author does a fresh `Document()` carry?
- [ ] Empty
- [x] "python-docx"
- [ ] The OS user name
> The default template's metadata must be overwritten before delivery.

3. Which of these is not exposed by `doc.core_properties`?
- [ ] `revision`
- [x] `Company`
- [ ] `last_modified_by`
> Company lives in the extended properties part and needs XML editing.

### Exercises

1. **Stamp helper** — Write `stamp(doc, title, author)` that sets title, author, last_modified_by, created and modified (now, UTC) and revision 1.
<details><summary>Solution</summary>

```python
from datetime import datetime, timezone
def stamp(doc, title, author):
    cp = doc.core_properties
    now = datetime.now(timezone.utc)
    cp.title = title; cp.author = author; cp.last_modified_by = author
    cp.created = now; cp.modified = now; cp.revision = 1
```

</details>

2. **Metadata report** — Given a list of document paths, print a table of file name, author, last modified by and modified date.
<details><summary>Solution</summary>

```python
from docx import Document
for path in paths:
    cp = Document(path).core_properties
    print(f"{path:30} {cp.author or '-':15} {cp.last_modified_by or '-':15} {cp.modified}")
```

</details>

### Interview Questions

**Q: What metadata should a generated document carry and how do you set it?**
Title, subject and keywords for search and PDF metadata, author and last-modified-by set to a real name or a clearly labelled bot account, created and modified as timezone-aware UTC datetimes, and a revision number that increments per regeneration. All of that is `doc.core_properties`. Company and Manager live in `app.xml` and need a small lxml edit of that part's blob. I make this a `stamp()` helper called by every generator so no document leaves with the default "python-docx" author.

**Q: How would you drive a header title and the cover title from one value?**
Set `core_properties.title` and use a `DOCPROPERTY Title` field in both places. When Word updates fields, both reflect the property; the PDF exporter also uses it for the PDF title. In python-docx that means one `cp.title = ...` plus the `add_field` helper for each location, with `w:updateFields` set so the fields refresh on open.

**Q: How do you scrub a document of personal information before delivery in an automated pipeline?**
Clear author, last_modified_by, comments, keywords and category through `core_properties`; rewrite `docProps/app.xml` to remove Company, Manager and TotalTime; remove `word/comments.xml` and any `w:ins`/`w:del` revision markup, or better, reject documents with tracked changes at intake. Then verify by reopening and asserting each field is empty, and optionally run Word's Document Inspector on a sample as a second opinion.

# LEVEL: Expert

## Building a data-driven report generator

Everything so far combines into one deliverable pattern: JSON in, branded DOCX out. The weekly production report at Stewart Title, a Fiverr client's monthly KPI pack, and a BPO team's QA scorecard are all the same program with different data and templates. This chapter designs that program properly.

#### Separate the three concerns

| Layer | Owns | Changes when |
|---|---|---|
| Data (JSON, SQL, CSV) | Numbers, names, dates | Every run |
| Template (`.dotx`) | Fonts, colours, header, footer, cover | Brand changes |
| Generator (Python) | Structure: which sections, tables, charts | Report design changes |

Input example:

```json
{
  "title": "Weekly Production Report",
  "period": "Week 37, 2026",
  "prepared_by": "Ali Raza",
  "summary": "Files opened rose 4% week over week; turnaround improved to 4.6 days.",
  "kpis": [{"name": "Files opened", "value": 412, "target": 400},
           {"name": "Files closed", "value": 388, "target": 390},
           {"name": "Avg turnaround (days)", "value": 4.6, "target": 5.0}],
  "counties": [{"county": "Laramie", "files": 88, "days": 4.2},
               {"county": "Natrona", "files": 61, "days": 5.1}]
}
```

#### The generator skeleton

```python
import json
from pathlib import Path
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.opc.constants import CONTENT_TYPE as CT

class ReportBuilder:
    REQUIRED_STYLES = ["Heading 1", "Heading 2", "Table Grid", "Caption"]

    def __init__(self, template: Path):
        self.doc = Document(template)
        self.doc.part._content_type = CT.WML_DOCUMENT_MAIN
        have = {s.name for s in self.doc.styles}
        missing = [s for s in self.REQUIRED_STYLES if s not in have]
        if missing:
            raise ValueError(f"template missing styles {missing}")

    def build(self, data: dict) -> Document:
        d = self.doc
        d.core_properties.title = f"{data['title']} ({data['period']})"
        d.core_properties.author = data["prepared_by"]
        d.add_heading(data["title"], 0)
        d.add_paragraph(data["period"]).alignment = WD_ALIGN_PARAGRAPH.CENTER
        d.add_heading("1. Summary", 1)
        d.add_paragraph(data["summary"])
        d.add_heading("2. Key indicators", 1)
        self.kpi_table(data["kpis"])
        d.add_heading("3. Production by county", 1)
        self.table(data["counties"], [("county", "County", "l"), ("files", "Files", "r"), ("days", "Avg days", "r")])
        return d

    def kpi_table(self, kpis):
        rows = [{"name": k["name"], "value": k["value"], "target": k["target"],
                 "status": "On target" if k["value"] >= k["target"] or "turnaround" in k["name"].lower() and k["value"] <= k["target"] else "Below"} for k in kpis]
        self.table(rows, [("name", "Indicator", "l"), ("value", "Actual", "r"), ("target", "Target", "r"), ("status", "Status", "l")])

    def table(self, rows, columns):
        t = self.doc.add_table(rows=1, cols=len(columns), style="Table Grid")
        for cell, (_, label, _) in zip(t.rows[0].cells, columns):
            cell.text = label
            cell.paragraphs[0].runs[0].bold = True
        for row in rows:
            cells = t.add_row().cells
            for cell, (key, _, align) in zip(cells, columns):
                v = row[key]
                cell.text = f"{v:,}" if isinstance(v, int) else (f"{v:.1f}" if isinstance(v, float) else str(v))
                if align == "r":
                    cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        return t
```

Usage:

```python
data = json.loads(Path("week37.json").read_text())
doc = ReportBuilder(Path("templates/report.dotx")).build(data)
doc.save(f"out/report-{data['period'].replace(' ', '_')}.docx")
```

#### Design rules that survive contact with clients

- **Column specs, not ad hoc loops.** The `(key, label, align)` tuple list makes every table consistent and lets one function own formatting.
- **Numbers formatted in one place.** Thousands separators, decimals and negative numbers in parentheses belong to a `fmt()` function, never scattered in f-strings.
- **Status logic in data, not in Word.** Compute "Below target" in Python and emit the text (and a theme colour if needed). Do not try to build Word IF fields.
- **Deterministic output.** Same JSON, same template, byte-identical DOCX except the `modified` timestamp. This makes diffs meaningful and tests reliable; set `modified` from the data or freeze it in tests.
- **Validate input with a schema.** `pydantic` or `jsonschema` catches a missing `target` before it becomes a `KeyError` in the middle of a 60-page render.
- **Charts as images.** Render with matplotlib into `BytesIO`, insert at page width, caption with a `SEQ Figure` field.

#### Conditional sections and repeated blocks

Reports have optional parts ("Exceptions" only if any exist) and repeated parts (one subsection per team). Express them as ordinary Python:

```python
if data.get("exceptions"):
    d.add_heading("4. Exceptions", 1)
    for e in data["exceptions"]:
        d.add_paragraph(f"{e['file']}: {e['issue']}", style="List Bullet")
for team in data.get("teams", []):
    d.add_heading(team["name"], 2)
    self.table(team["agents"], [("agent", "Agent", "l"), ("qa", "QA %", "r")])
```

> **Tip:** Number sections in code (`f"{n}. {title}"` with a counter) rather than relying on list numbering, and keep a `section()` helper that increments the counter so optional sections never leave a gap.

#### Outputs beyond DOCX

The same builder can emit a PDF (next-but-one chapter), an HTML preview for email, and a JSON manifest listing the sections and figures for the QA log. Keeping the builder free of file-system calls (accept and return objects) is what makes those extra outputs cheap.

### Try It Yourself

```python
import json
from io import BytesIO
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH

data = json.loads('''{
 "title": "Weekly Production Report", "period": "Week 37, 2026", "prepared_by": "Ali Raza",
 "summary": "Files opened rose 4% week over week.",
 "kpis": [{"name": "Files opened", "value": 412, "target": 400},
          {"name": "Files closed", "value": 388, "target": 390}],
 "counties": [{"county": "Laramie", "files": 88, "days": 4.2},
              {"county": "Natrona", "files": 61, "days": 5.1}]}''')

def fmt(v):
    return f"{v:,}" if isinstance(v, int) else (f"{v:.1f}" if isinstance(v, float) else str(v))

def table(doc, rows, columns):
    t = doc.add_table(rows=1, cols=len(columns), style="Table Grid")
    for cell, (_, label, _) in zip(t.rows[0].cells, columns):
        cell.text = label; cell.paragraphs[0].runs[0].bold = True
    for row in rows:
        for cell, (key, _, align) in zip(t.add_row().cells, columns):
            cell.text = fmt(row[key])
            if align == "r": cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    return t

doc = Document()
doc.core_properties.title = f"{data['title']} ({data['period']})"; doc.core_properties.author = data["prepared_by"]
doc.add_heading(data["title"], 0); doc.add_paragraph(data["period"])
n = 0
def section(title):
    global n; n += 1; doc.add_heading(f"{n}. {title}", 1)
section("Summary"); doc.add_paragraph(data["summary"])
section("Key indicators")
kpis = [dict(k, status="On target" if k["value"] >= k["target"] else "Below") for k in data["kpis"]]
table(doc, kpis, [("name", "Indicator", "l"), ("value", "Actual", "r"), ("target", "Target", "r"), ("status", "Status", "l")])
section("Production by county")
table(doc, data["counties"], [("county", "County", "l"), ("files", "Files", "r"), ("days", "Avg days", "r")])

print("sections:", [p.text for p in doc.paragraphs if p.style.name == "Heading 1"])
print("tables:", [(len(t.rows), len(t.columns)) for t in doc.tables])
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. Where should the "Below target" decision be made?
- [ ] In a Word IF field
- [x] In Python, before writing the cell text
- [ ] In the template's conditional formatting
> Word has no conditional formatting for tables; computing in code is simpler and testable.

2. Why format numbers in a single `fmt()` function?
- [x] Every table then shows thousands separators and decimals consistently
- [ ] Word requires it
- [ ] It is faster
> Consistency across 30 tables is a product requirement; one function guarantees it.

3. What makes generated output deterministic?
- [ ] Using `Document()` instead of a template
- [x] Same data plus same template, with timestamps controlled
- [ ] Saving to BytesIO
> Determinism lets you diff outputs and write byte-level regression tests.

### Exercises

1. **Section counter** — Implement a `Sections` class with `add(title)` that returns the numbered heading text and tracks the count.
<details><summary>Solution</summary>

```python
class Sections:
    def __init__(self, doc): self.doc, self.n = doc, 0
    def add(self, title, level=1):
        self.n += 1
        text = f"{self.n}. {title}"
        self.doc.add_heading(text, level)
        return text
```

</details>

2. **Optional exceptions** — Add an "Exceptions" section only when `data["exceptions"]` is non-empty, as a bulleted list.
<details><summary>Solution</summary>

```python
exc = data.get("exceptions") or []
if exc:
    doc.add_heading("Exceptions", 1)
    for e in exc:
        doc.add_paragraph(f"{e['file']}: {e['issue']}", style="List Bullet")
```

</details>

### Interview Questions

**Q: Walk me through the architecture of a report generator you built.**
Three layers: data (a JSON export from the production database, validated with a pydantic model), a designer-owned `.dotx` template with the styles and letterhead, and a `ReportBuilder` class that opens the template, checks required styles, and emits sections through small helpers: `section()`, `table(rows, columns)`, `figure(png, caption)`. Column specs are declarative tuples so all 20 tables share alignment and number formatting. Output is a `Document` returned to the caller; a thin CLI saves DOCX, converts to PDF through LibreOffice and writes a manifest. Same JSON in, byte-identical DOCX out, which is what makes the regression tests possible.

**Q: How do you handle a client request like "highlight KPIs below target in red"?**
Compute the status in Python, then set a theme colour or an explicit RGB on the cell's run, or shade the cell with `w:shd`. I prefer a character style called "Status Bad" defined in the template so the designer controls what "red" means; code applies the style name. That keeps the rule ("below target") in code and the appearance in the template.

**Q: What would you do differently for a 200-page report with 150 tables?**
Build tables at the XML level for speed, stream charts through `BytesIO`, keep the per-run formatting to zero by relying on table styles, and generate section by section so memory stays flat. I would also add a QA manifest listing every heading, table shape and figure caption, then diff it against the previous week's manifest to catch missing sections before the client does.

## Performance with large documents

A 767-page employee handbook with 400 headings, 120 tables and 90 images is normal work. python-docx handles it, but a few patterns turn a 20-second build into a 20-minute one, and a few others cause Word to choke on the result. This chapter is about where time goes and how to keep the file lean.

#### Where the time goes

Measured on a laptop with python-docx 1.1, roughly:

| Operation | Cost | Why |
|---|---|---|
| `Document(template)` | 30-100 ms | Unzips and parses all parts once |
| `add_paragraph` | ~50 µs | Appends one element |
| `add_run` with formatting | ~30 µs per property | Each property is an element or attribute |
| `table.cell(r, c)` | O(rows × cols) | Rebuilds the cell matrix each call |
| `table.add_row()` | O(cols) plus a deep copy | Copies the previous row's XML |
| `doc.save()` | 0.5-3 s for 700 pages | Serialises every part and deflates the ZIP |
| Reopening in Word | Seconds to minutes | Word paginates the whole document |

#### Tables: the quadratic trap

```python
# slow: table.cell() inside a double loop on a 2000-row table
for r in range(rows):
    for c in range(cols):
        table.cell(r, c).text = data[r][c]
```

`table.cell()` calls `table._cells`, which walks every `w:tc` to account for merges. Grab the cells once:

```python
cells = table._cells                       # one walk
for r in range(rows):
    for c in range(cols):
        cells[r * cols + c].text = data[r][c]
```

For thousands of rows go one step further and build rows as XML strings with `parse_xml`, then append to `table._tbl`. A 10,000-row table builds in about two seconds this way:

```python
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
from xml.sax.saxutils import escape

def fast_rows(table, rows):
    tbl = table._tbl
    for row in rows:
        tcs = "".join(f"<w:tc><w:p><w:r><w:t xml:space=\"preserve\">{escape(str(v))}</w:t></w:r></w:p></w:tc>" for v in row)
        tbl.append(parse_xml(f"<w:tr {nsdecls('w')}>{tcs}</w:tr>"))
```

Escaping with `xml.sax.saxutils.escape` is mandatory: a client name with `&` will otherwise corrupt the document.

#### Keep the XML small

File size drives Word's open time more than page count. The usual bloat:

- **Run-level formatting on every run** because the generator set `font.name` and `font.size` everywhere. A style does it in one place; 50,000 runs with `w:rPr` blocks add megabytes.
- **Uncompressed images.** A 4 MB PNG screenshot placed at 2 inches wide still stores 4 MB. Resize with Pillow to the printed size at 200 dpi before inserting.
- **Duplicate images.** python-docx de-duplicates identical bytes by hash, but a logo re-rendered per page with different bytes is stored per page.
- **Empty paragraphs used as spacing.** Thousands of `<w:p/>` plus their properties.

A handbook of 767 pages of text and styles should be under 3 MB; with 90 well-sized images under 15 MB.

#### Memory and streaming

python-docx keeps the whole document tree in memory: roughly 10 times the XML size. A 30 MB `document.xml` costs about 300 MB of RAM, which is fine on a server but not in a 512 MB Lambda. Options: build per chapter and merge with LibreOffice, or generate directly with `zipfile` and lxml when the structure is simple. For generation the tree is unavoidable; for *reading* very large documents, `lxml.etree.iterparse` on the raw `document.xml` from the ZIP streams paragraphs without building the tree.

#### Profiling a build

```python
import cProfile, pstats
cProfile.run("build(data)", "build.prof")
pstats.Stats("build.prof").sort_stats("cumulative").print_stats(15)
```

Look for `_cells`, `add_row`, `deepcopy` and `xpath` near the top; each has a cheaper alternative. `xpath` calls in a loop (for example looking up a style per paragraph) should be cached with `functools.lru_cache` or replaced by direct child access.

#### What makes Word slow after generation

Word's cost is layout, not parsing. Long tables without fixed widths (autofit on), thousands of floating objects, many sections with different headers, and a document-wide "keep with next" chain (every paragraph tries to stay with the next) make pagination crawl. Fixed column widths, `w:tblHeader` on header rows, and `keep_with_next` only on headings keep a 767-page document opening in a few seconds.

> **Warning:** Never generate a 700-page document by concatenating `Document` objects in Python. There is no merge API; copying body elements across documents loses styles, numbering and images unless you also merge the parts. Generate in one pass from one template, or merge finished files with LibreOffice or Word.

#### Batch generation

For 300 client letters, the loop cost is dominated by `Document(template)` and `save()`. Keep the template bytes in memory and, if the machine has cores to spare, use `concurrent.futures.ProcessPoolExecutor`; python-docx is CPU bound and lxml releases the GIL only partly, so processes beat threads.

### Try It Yourself

```python
import time
from io import BytesIO
from xml.sax.saxutils import escape
from docx import Document
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

ROWS, COLS = 300, 5
data = [[f"r{r}c{c}" for c in range(COLS)] for r in range(ROWS)]

# slow path: add_row + cell() per cell
doc = Document(); t = doc.add_table(rows=1, cols=COLS, style="Table Grid")
t0 = time.perf_counter()
for row in data:
    t.add_row()
for r in range(1, ROWS + 1):
    for c in range(COLS):
        t.cell(r, c).text = data[r - 1][c]
slow = time.perf_counter() - t0

# fast path: build w:tr XML and append
doc2 = Document(); t2 = doc2.add_table(rows=1, cols=COLS, style="Table Grid")
t0 = time.perf_counter()
for row in data:
    tcs = "".join(f'<w:tc><w:p><w:r><w:t xml:space="preserve">{escape(v)}</w:t></w:r></w:p></w:tc>' for v in row)
    t2._tbl.append(parse_xml(f"<w:tr {nsdecls('w')}>{tcs}</w:tr>"))
fast = time.perf_counter() - t0

print(f"cell() loop: {slow:.3f}s   xml rows: {fast:.3f}s   speedup: {slow / fast:.0f}x")
print("rows:", len(t.rows), len(t2.rows), "| last cell:", t2.rows[-1].cells[-1].text)
b1, b2 = BytesIO(), BytesIO(); doc.save(b1); doc2.save(b2)
print("sizes:", len(b1.getvalue()), len(b2.getvalue()))
```

### Quiz

1. Why is `table.cell(r, c)` in a nested loop quadratic?
- [x] Each call rebuilds the full cell list to account for merges
- [ ] It re-parses the document
- [ ] It saves the file each time
> Cache `table._cells` once, or append XML rows directly.

2. What most affects Word's time to open a generated file?
- [ ] Number of styles
- [x] XML size and layout complexity (autofit tables, floating objects)
- [ ] The author property
> Word must paginate everything; lean XML and fixed widths keep it fast.

3. Why must values be escaped in `fast_rows`?
- [ ] For speed
- [x] Characters like `&` and `<` would otherwise break the XML
- [ ] Word requires uppercase text
> `parse_xml` builds real XML; unescaped data corrupts the document.

### Exercises

1. **Image diet** — Write a function that takes image bytes and returns PNG bytes resized so the width is at most 1600 px, using Pillow.
<details><summary>Solution</summary>

```python
from io import BytesIO
from PIL import Image
def slim(img_bytes, max_w=1600):
    im = Image.open(BytesIO(img_bytes))
    if im.width > max_w:
        im = im.resize((max_w, int(im.height * max_w / im.width)))
    out = BytesIO(); im.save(out, "PNG", optimize=True); return out.getvalue()
```

</details>

2. **Run-property census** — Count how many runs carry explicit `w:rPr` in a document, to measure formatting bloat.
<details><summary>Solution</summary>

```python
runs = doc.element.body.xpath(".//w:r")
with_rpr = doc.element.body.xpath(".//w:r[w:rPr]")
print(len(with_rpr), "of", len(runs), "runs have direct formatting")
```

</details>

### Interview Questions

**Q: A 700-page generated handbook takes 15 minutes to build. How do you diagnose and fix it?**
Profile with cProfile first; in every case I have seen, the top entries are `_cells` from `table.cell()` in nested loops and `add_row` deep-copying rows. Replace both with direct `w:tr` XML built from escaped strings and appended to `table._tbl`, cache style lookups, and stop setting fonts per run in favour of styles. That typically brings the build under 30 seconds. Then I check the output size: if it is over 20 MB, images are the culprit and I resize them before insertion.

**Q: How do you keep Word responsive when it opens your generated document?**
Fixed table widths with autofit off, repeat-header rows, `keep_with_next` only on headings and captions, no floating objects unless essential, images resized to their printed size, and styles instead of run formatting so `document.xml` stays small. I also avoid dozens of sections with unlinked headers, because each header part is laid out per page. The handbook I maintain opens in about four seconds at 767 pages.

**Q: Can you merge several generated DOCX files in python-docx?**
Not safely with the public API. Copying `w:body` children moves text but not the styles, numbering definitions, images or header parts they reference, so you get missing pictures and broken lists. The reliable options are generating in one pass from one template, using LibreOffice or Word to append documents, or a purpose-built merger like `docxcompose` that rewrites relationships and numbering. I explain the trade-off rather than pretend a body copy is a merge.

## Comments, tracked changes and content controls

Clients ask for three Word features that python-docx supports only partly: comments, tracked changes and content controls. Knowing exactly what the library does, what survives a round trip, and how to work around the gaps is the difference between a confident "yes, by Friday" and a broken deliverable.

#### Comments

python-docx 1.2.0 (2025) added a public comments API. Earlier versions could only preserve existing comments.

```python
from docx import Document
doc = Document()
p = doc.add_paragraph("The premium for Laramie County rises to $1,500.")
run = p.runs[0]
doc.add_comment(runs=[run], text="Confirm against the November rate filing.",
                author="Ali Raza", initials="AR")
for c in doc.comments:
    print(c.author, c.initials, c.timestamp, "->", c.text)
```

`add_comment` anchors the comment to one or more runs (the highlighted range in Word) and returns a `Comment` object; `doc.comments` iterates existing ones. On versions before 1.2, the same result requires creating `word/comments.xml`, its content type and relationship, then inserting `w:commentRangeStart`, `w:commentRangeEnd` and a `w:commentReference` run; that is a zipfile-level job covered in the OOXML course. Threaded replies and "resolved" state live in `commentsExtended.xml`, which python-docx does not write.

#### Tracked changes

There is no API to create or accept revisions. What you can do:

- **Detect** them: `doc.element.xpath("//w:ins | //w:del")` returns revision elements.
- **Preserve** them: opening and saving keeps all `w:ins`/`w:del` markup.
- **Accept all** them at the XML level: unwrap `w:ins` (keep children) and remove `w:del` elements.

```python
from docx.oxml.ns import qn

def accept_all_changes(doc):
    body = doc.element.body
    for d in body.xpath(".//w:del"):
        d.getparent().remove(d)
    for ins in body.xpath(".//w:ins"):
        parent = ins.getparent()
        idx = parent.index(ins)
        for child in list(ins):
            parent.insert(idx, child); idx += 1
        parent.remove(ins)
    for chg in body.xpath(".//w:rPrChange | .//w:pPrChange | .//w:sectPrChange | .//w:tblPrChange"):
        chg.getparent().remove(chg)
```

Paragraph-mark deletions (`w:rPr/w:del` inside `w:pPr`) merge two paragraphs in Word; handle them by removing the mark and moving the next paragraph's runs, or reject such files at intake. **Rejecting** all changes is the inverse: unwrap `w:del` (converting `w:delText` to `w:t`) and remove `w:ins`. For production work I run `accept_all_changes` before any find-and-replace, otherwise a token split by a revision is invisible.

Reading `paragraph.text` on a paragraph with tracked changes returns only accepted content: inserted runs inside `w:ins` are *not* included because they are not direct `w:r` children, and `w:delText` is ignored. That is a frequent surprise in QA scripts.

#### Content controls (SDTs)

Content controls (`w:sdt`) are what Word's Developer tab inserts: plain-text boxes, drop-downs, date pickers, check boxes and repeating sections. python-docx neither creates them nor reads them as first-class objects: runs inside `w:sdtContent` within a paragraph are skipped by `paragraph.runs`, and block-level SDTs are skipped by `doc.paragraphs` entirely. Two practical patterns:

**Fill by tag.** Word gives each control a `w:tag`; find it and set the text:

```python
def fill_sdt(doc, tag, value):
    for sdt in doc.element.xpath(f'//w:sdt[w:sdtPr/w:tag/@w:val="{tag}"]'):
        content = sdt.find(qn("w:sdtContent"))
        ts = content.xpath(".//w:t")
        if ts:
            ts[0].text = value
            for extra in ts[1:]:
                extra.text = ""
        prompt = sdt.find(qn("w:sdtPr")).find(qn("w:showingPlcHdr"))
        if prompt is not None:
            prompt.getparent().remove(prompt)     # no longer showing the grey prompt text
```

Removing `w:showingPlcHdr` matters: without that, Word still styles the text as the grey prompt.

**Unwrap after filling.** Once a document is final, replace each `w:sdt` with its content so downstream tools (including python-docx's own `paragraph.runs`) see plain runs:

```python
def unwrap_sdts(doc):
    for sdt in doc.element.xpath("//w:sdt"):
        content = sdt.find(qn("w:sdtContent"))
        parent = sdt.getparent(); idx = parent.index(sdt)
        for child in list(content):
            parent.insert(idx, child); idx += 1
        parent.remove(sdt)
```

Check boxes are SDTs with `w14:checkbox` in `sdtPr` and a glyph (`☐`/`☒`) in the content; set `w14:checked w14:val` and swap the glyph together.

| Feature | Create | Read | Preserve | Workaround |
|---|---|---|---|---|
| Comments | 1.2+ | 1.2+ | Yes | XML for threads/resolved |
| Tracked changes | No | XPath | Yes | Accept/reject at XML level |
| Content controls | No | XPath | Yes | Fill by tag, unwrap |
| Footnotes | No | XPath | Yes | Edit `footnotes.xml` part |
| Text boxes | No | XPath (`w:txbxContent`) | Yes | Edit in place |

> **Interview note:** Be precise about versions. "python-docx cannot do comments" was true until 1.2.0; a candidate who knows the release and the limits (no threads, no resolve) sounds current.

### Try It Yourself

```python
from io import BytesIO
from docx import Document
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls, qn

doc = Document()
p = doc.add_paragraph("Rate for Laramie County: ")
# simulate a content control that Word's Developer tab would create
sdt = parse_xml(f'''<w:sdt {nsdecls("w")}><w:sdtPr><w:tag w:val="rate"/><w:showingPlcHdr/></w:sdtPr>
<w:sdtContent><w:r><w:t>Click to enter rate</w:t></w:r></w:sdtContent></w:sdt>''')
p._p.append(sdt)
print("runs seen by python-docx before:", [r.text for r in p.runs])

def fill_sdt(doc, tag, value):
    for s in doc.element.xpath(f'//w:sdt[w:sdtPr/w:tag/@w:val="{tag}"]'):
        ts = s.find(qn("w:sdtContent")).xpath(".//w:t")
        ts[0].text = value
        for extra in ts[1:]: extra.text = ""
        ph = s.find(qn("w:sdtPr")).find(qn("w:showingPlcHdr"))
        if ph is not None: ph.getparent().remove(ph)

def unwrap_sdts(doc):
    for s in doc.element.xpath("//w:sdt"):
        content = s.find(qn("w:sdtContent")); parent = s.getparent(); i = parent.index(s)
        for child in list(content):
            parent.insert(i, child); i += 1
        parent.remove(s)

fill_sdt(doc, "rate", "$1,500")
unwrap_sdts(doc)
print("runs after fill+unwrap:", [r.text for r in p.runs])
print("paragraph text:", p.text)
has_comments_api = hasattr(doc, "add_comment")
print("comments API available (python-docx >= 1.2):", has_comments_api)
buf = BytesIO(); doc.save(buf); print(len(buf.getvalue()), "bytes")
```

### Quiz

1. Which python-docx version introduced `Document.add_comment`?
- [ ] 0.8
- [ ] 1.0
- [x] 1.2
> Before 1.2.0 comments could only be preserved, not created.

2. `paragraph.text` on a paragraph with a tracked insertion returns:
- [ ] The inserted text too
- [x] Only text in direct runs, so inserted text is missing
- [ ] An error
> Runs inside `w:ins` are not direct children; accept changes before processing.

3. After filling a content control's text, why remove `w:showingPlcHdr`?
- [x] Otherwise Word keeps styling the text as the grey prompt
- [ ] It deletes the control
- [ ] Word refuses to open the file
> The flag tells Word the control still shows its prompt text.

### Exercises

1. **Revision report** — Count insertions and deletions per author in a document.
<details><summary>Solution</summary>

```python
from collections import Counter
from docx.oxml.ns import qn
c = Counter()
for el in doc.element.body.xpath(".//w:ins | .//w:del"):
    kind = el.tag.split("}")[1]
    c[(el.get(qn("w:author")), kind)] += 1
print(c)
```

</details>

2. **SDT inventory** — List every content control's tag and current text.
<details><summary>Solution</summary>

```python
for s in doc.element.xpath("//w:sdt"):
    tag = s.xpath("string(w:sdtPr/w:tag/@w:val)")
    text = "".join(t.text or "" for t in s.xpath(".//w:sdtContent//w:t"))
    print(tag or "(no tag)", "->", text)
```

</details>

### Interview Questions

**Q: A client wants generated contracts with review comments at each clause. How do you do it?**
With python-docx 1.2 or later, `doc.add_comment(runs=[...], text=..., author=..., initials=...)` anchors a comment to the clause's runs, and I generate them from the same JSON that drives the clauses. On an older pinned version I would create `comments.xml` by hand: add the part with the comments content type, relate it from the document part, and insert the range markers and reference run around the clause. I tell the client that replies and "resolved" state are not created, since those live in Word's extended comments parts.

**Q: How do you process a document that contains tracked changes?**
First decide the policy: accept, reject, or refuse. For automation I usually accept all at the XML level before doing anything else: remove `w:del`, unwrap `w:ins`, drop `rPrChange`/`pPrChange`, and handle deleted paragraph marks. Then the document is plain and `paragraph.text`, find-and-replace and audits behave. I log that revisions were accepted, because silently accepting an editor's pending changes is a governance issue in legal work.

**Q: Why does python-docx skip content controls, and how do you fill a form built with them?**
`paragraph.runs` only returns direct `w:r` children, and an SDT wraps its runs in `w:sdtContent`, so they are invisible; block-level SDTs are likewise invisible to `doc.paragraphs`. To fill a form I xpath by `w:tag`, set the first `w:t`, blank the rest, remove `w:showingPlcHdr`, and for check boxes update both the `w14:checked` value and the glyph. If the client does not need the controls afterwards, I unwrap them so the file behaves like a normal document.

## Converting to PDF with LibreOffice headless

Clients want a PDF proof, an archive copy, or a print file. python-docx cannot render, so conversion needs a layout engine. The two dependable options are LibreOffice in headless mode (any OS, free) and Microsoft Word through COM automation (Windows, exact fidelity). This chapter shows both and how to make them reliable in production.

#### LibreOffice from the command line

```bash
soffice --headless --convert-to pdf --outdir out/ report.docx
soffice --headless --convert-to "pdf:writer_pdf_Export:{\"SelectPdfVersion\":{\"type\":\"long\",\"value\":\"1\"}}" report.docx   # PDF/A-1b
```

On Windows the binary is `soffice.exe` in `C:\Program Files\LibreOffice\program`; on macOS `/Applications/LibreOffice.app/Contents/MacOS/soffice`; on Debian/Ubuntu `apt install libreoffice-writer` provides `soffice`. The filter options JSON (LibreOffice 7.4+) is how you select PDF/A, tagged PDF (`UseTaggedPDF`), bookmarks (`ExportBookmarks`) and image quality.

From Python:

```python
import subprocess, shutil
from pathlib import Path

def to_pdf(docx_path: Path, out_dir: Path, timeout=120) -> Path:
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        raise RuntimeError("LibreOffice not found on PATH")
    out_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run([soffice, "--headless", "--norestore", "--convert-to", "pdf",
                    "--outdir", str(out_dir), str(docx_path)],
                   check=True, timeout=timeout, capture_output=True)
    pdf = out_dir / docx_path.with_suffix(".pdf").name
    if not pdf.exists():
        raise RuntimeError("conversion produced no file")
    return pdf
```

#### Production gotchas

| Problem | Cause | Fix |
|---|---|---|
| Second conversion hangs | Only one soffice instance per user profile | Pass `-env:UserInstallation=file:///tmp/lo-$PID` for parallel runs, or serialise with a queue |
| Fonts differ from Word | Brand fonts not installed on the server | Install the TTF/OTF files in `~/.fonts` or `/usr/share/fonts` and run `fc-cache -f` |
| TOC page numbers stale | Conversion does not update indexes | Update via UNO macro, or accept `updateFields` in Word first |
| Slight pagination differences | Different layout engine | Deliver Word-rendered PDF for legal/print; LibreOffice for previews |
| Conversion takes 20 s the first time | Profile creation | Warm up once at container start |
| Fails in Docker with no output | Missing fonts/Java/`HOME` | Set `HOME`, install `fonts-dejavu`, `fonts-liberation`; Java is not required for Writer |

#### Updating fields and TOC during conversion

A small LibreOffice Basic macro, or Python via `unoconv`-style UNO scripting, refreshes indexes before export. The UNO version in Python (run with LibreOffice's bundled interpreter, or `pip install unoserver` which wraps the lifecycle):

```python
# with unoserver running: unoserver &  ; then:
from unoserver.client import UnoClient
UnoClient().convert(inpath="report.docx", outpath="report.pdf", convert_to="pdf", update_index=True)
```

`unoserver` (2023+) has `update_index=True`, which updates all indexes (TOC, table of figures) before saving. This is the cleanest fix for the "TOC is empty" problem in a Linux pipeline.

#### Word COM on Windows

When exact Word rendering is required:

```python
import win32com.client as win32
word = win32.gencache.EnsureDispatch("Word.Application")
word.Visible = False
d = word.Documents.Open(r"C:\jobs\report.docx")
d.Fields.Update()
for toc in d.TablesOfContents:
    toc.Update()
d.ExportAsFixedFormat(r"C:\jobs\report.pdf", 17,          # 17 = wdExportFormatPDF
                      CreateBookmarks=1)                  # 1 = wdExportCreateHeadingBookmarks
d.Close(False); word.Quit()
```

`docx2pdf` (`pip install docx2pdf`) wraps this and also works on macOS via AppleScript, but it does not update fields. COM must run in an interactive session (not a service) and one document at a time; it is for a desk, not a server.

#### Checking the result

```python
from pypdf import PdfReader
r = PdfReader("out/report.pdf")
print(len(r.pages), "pages;", r.metadata.title)
print(r.pages[0].extract_text()[:200])
```

Assert on page count within a tolerance, the title metadata (which comes from `core_properties.title`), and that the first page contains the report title. For print jobs also check page size: `r.pages[0].mediabox` should be 612 × 792 points for Letter.

> **Tip:** Deliver both files. The DOCX is editable, the PDF is what the client sees on a phone. Name them identically except for the extension, and put the version in the file name and in `core_properties.version`.

### Try It Yourself

```python
# The browser cannot run LibreOffice; this simulates the pipeline: build the DOCX,
# then show the exact command and the checks you would run on the PDF.
from io import BytesIO
from docx import Document
import shutil

doc = Document()
doc.core_properties.title = "Weekly Production Report"
doc.add_heading("Weekly Production Report", 0)
doc.add_paragraph("Rendered to PDF by LibreOffice headless in production.")
buf = BytesIO(); doc.save(buf)
print("DOCX bytes:", len(buf.getvalue()))

soffice = shutil.which("soffice") or shutil.which("libreoffice")
print("LibreOffice on PATH here:", bool(soffice))
cmd = ["soffice", "--headless", "--norestore", "--convert-to", "pdf", "--outdir", "out/", "report.docx"]
print("command:", " ".join(cmd))
checks = {"pages": "len(PdfReader(pdf).pages) between 1 and 3",
          "title": "reader.metadata.title == core_properties.title",
          "page size": "mediabox == (612, 792) for Letter"}
for k, v in checks.items():
    print(f"check {k:9} -> {v}")
```

### Quiz

1. Which command converts a DOCX to PDF without a GUI?
- [x] `soffice --headless --convert-to pdf --outdir out/ file.docx`
- [ ] `docx --pdf file.docx`
- [ ] `python -m docx pdf file.docx`
> LibreOffice's `soffice` binary does the rendering; python-docx cannot.

2. Why do parallel LibreOffice conversions hang?
- [ ] PDF export is single-threaded by law
- [x] One instance per user profile; use separate `-env:UserInstallation` paths
- [ ] The files are locked
> Each worker needs its own profile directory, or conversions must be queued.

3. What does the TOC show in a plain LibreOffice conversion of a python-docx file?
- [ ] Correct entries
- [x] The cached result, unless indexes are updated first
- [ ] Nothing at all
> Use `unoserver` with `update_index=True` or update in Word before converting.

### Exercises

1. **Robust converter** — Extend `to_pdf` to use a unique user profile per call so it can run in parallel.
<details><summary>Solution</summary>

```python
import os, subprocess, tempfile
def to_pdf_parallel(soffice, docx_path, out_dir):
    with tempfile.TemporaryDirectory() as prof:
        subprocess.run([soffice, f"-env:UserInstallation=file://{prof}", "--headless", "--norestore",
                        "--convert-to", "pdf", "--outdir", str(out_dir), str(docx_path)],
                       check=True, timeout=180, capture_output=True)
    return os.path.join(out_dir, os.path.splitext(os.path.basename(docx_path))[0] + ".pdf")
```

</details>

2. **PDF assertions** — Write a pytest test that converts a fixture DOCX and asserts page count is 2 and the title metadata matches.
<details><summary>Solution</summary>

```python
from pypdf import PdfReader
def test_pdf(tmp_path):
    pdf = to_pdf(Path("tests/fixtures/report.docx"), tmp_path)
    r = PdfReader(pdf)
    assert len(r.pages) == 2
    assert r.metadata.title == "Weekly Production Report"
```

</details>

### Interview Questions

**Q: How do you produce PDFs from generated Word documents on a Linux server?**
LibreOffice headless: `soffice --headless --convert-to pdf`, wrapped in a subprocess call with a timeout, a per-worker `UserInstallation` profile so conversions can run in parallel, and the brand fonts installed with `fc-cache`. For documents with a TOC I use `unoserver` with `update_index=True` so indexes refresh before export. The output is checked with pypdf for page count and metadata. For legal deliverables where Word-exact pagination matters, a Windows box running Word COM produces the final file.

**Q: What are the differences between a Word-rendered PDF and a LibreOffice one?**
Line breaking, kerning and table row heights differ slightly, so page counts can differ by a page or two on long documents; LibreOffice may substitute fonts if they are not installed; some field types (`STYLEREF`, complex `IF`) are evaluated differently; and LibreOffice does not update the TOC unless told to. Word's export also creates PDF bookmarks from headings and tags for accessibility when asked. For previews LibreOffice is fine; for print-ready or court filings I render with Word.

**Q: How do you make the conversion step reliable in Docker?**
Install `libreoffice-writer` and the fonts (`fonts-liberation`, `fonts-dejavu`, plus the brand TTFs), set `HOME` to a writable directory, warm up LibreOffice once at container start to create the profile, enforce a timeout and kill stray `soffice.bin` processes on failure, and never run two conversions in the same profile concurrently. I also pin the LibreOffice version because rendering changes between releases.

## Testing document output and interview questions

A document generator without tests breaks silently: a renamed style, a changed template or a new Word version and the client gets a broken file. This chapter shows how to test at three levels: structure (fast, in memory), rendering (slow, via LibreOffice) and regression (golden files). It closes with the questions interviewers ask about python-docx work.

#### Level 1: structural tests in memory

Build the document, round-trip it through `BytesIO`, and assert on the structure with python-docx itself:

```python
from io import BytesIO
from docx import Document
import pytest

@pytest.fixture
def report():
    doc = build_report(SAMPLE_DATA)          # your generator
    buf = BytesIO(); doc.save(buf); buf.seek(0)
    return Document(buf)                     # reopened: proves it is a valid package

def test_headings(report):
    h1 = [p.text for p in report.paragraphs if p.style.name == "Heading 1"]
    assert h1 == ["1. Summary", "2. Key indicators", "3. Production by county"]

def test_kpi_table(report):
    t = report.tables[0]
    assert [c.text for c in t.rows[0].cells] == ["Indicator", "Actual", "Target", "Status"]
    assert t.rows[1].cells[1].text == "412"

def test_metadata(report):
    assert report.core_properties.author == "Ali Raza"
    assert report.core_properties.author != "python-docx"

def test_no_direct_fonts(report):
    stray = report.element.body.xpath(".//w:rFonts")
    assert stray == [], "run-level fonts found; use styles"

def test_fields_present(report):
    instrs = [e.text.strip() for e in report.element.xpath("//w:instrText")]
    assert "PAGE" in instrs and any(i.startswith("TOC") for i in instrs)
```

Reopening through `BytesIO` matters: it catches package-level mistakes (a missing relationship, invalid XML) that the in-memory object would not reveal.

#### Level 2: XML validity checks

Word's "unreadable content" errors usually come from schema-order mistakes. Cheap checks that catch most of them:

```python
def test_every_cell_has_paragraph(report):
    for tc in report.element.body.xpath(".//w:tc"):
        assert tc.xpath("./w:p"), "empty w:tc corrupts the document"

def test_body_ends_with_paragraph_before_sectPr(report):
    body = report.element.body
    children = [c.tag.split("}")[1] for c in body]
    assert children[-1] == "sectPr" and children[-2] == "p"   # a table cannot be last

def test_unique_drawing_ids(report):
    ids = [d.get("id") for d in report.element.xpath("//wp:docPr")]
    assert len(ids) == len(set(ids))
```

For full validation, run the Open XML SDK validator (`dotnet` tool `OpenXmlValidator` or the SDK's `OpenXmlValidator` class) in CI on a sample of outputs.

#### Level 3: rendering and golden files

Render with LibreOffice and compare against a golden PDF's text and page count; compare images only when layout is the product (covers, letterheads):

```python
def test_render(tmp_path):
    pdf = to_pdf(Path("tests/fixtures/report.docx"), tmp_path)
    reader = PdfReader(pdf)
    assert 5 <= len(reader.pages) <= 6
    assert "Weekly Production Report" in reader.pages[0].extract_text()
```

For byte-level regression, freeze `created`/`modified` in tests and compare the unzipped `document.xml` with the golden copy, normalising whitespace. A diff of XML is far more readable than a diff of ZIP bytes.

#### Test data that hurts

Include in fixtures: names with `&`, `<` and non-Latin characters (Urdu, Chinese); empty lists; a KPI exactly at target; a very long county name that wraps; zero rows in a table; an image that is 4000 px wide. These are the cases that have failed in real deliveries.

> **Interview note:** Saying "I test by opening it in Word" is a red flag. Describe structural tests, a validator, and a rendering check, and mention that reopening the saved bytes is itself a test.

#### Interview questions specific to python-docx

The questions below are asked in interviews for document automation, reporting and back-office engineering roles. The answers are in the Interview Questions section.

- What are the limits of python-docx, and how do you work around them?
- How do you insert a page number, a TOC, a hyperlink?
- Explain runs and why find-and-replace is hard.
- How would you build a template-based generator that survives brand changes?
- How do you convert to PDF and update fields on a Linux server?
- What is the risk of editing XML directly, and how do you mitigate it?
- How do you test a document generator?

| Topic | One-line answer to expand |
|---|---|
| Limits | No rendering, no fields API, no list creation, no comments before 1.2, no tracked changes, no floating images |
| Escape hatch | `_element` + `OxmlElement`/`parse_xml` + `qn`, following Word's own XML |
| Templates | `.dotx` by designer, content type fix, style check, marker insertion |
| PDF | LibreOffice headless or Word COM; `unoserver` for index updates |
| Testing | Reopen from BytesIO, structural asserts, schema checks, render check |

### Try It Yourself

```python
from io import BytesIO
from docx import Document

def build_report():
    doc = Document()
    doc.core_properties.author = "Ali Raza"
    doc.add_heading("1. Summary", 1)
    t = doc.add_table(rows=2, cols=2, style="Table Grid")
    t.cell(0, 0).text = "Indicator"; t.cell(0, 1).text = "Actual"
    t.cell(1, 0).text = "Files opened"; t.cell(1, 1).text = "412"
    doc.add_paragraph("End.")
    return doc

def roundtrip(doc):
    buf = BytesIO(); doc.save(buf); buf.seek(0); return Document(buf)

report = roundtrip(build_report())
results = {}
results["headings"] = [p.text for p in report.paragraphs if p.style.name == "Heading 1"] == ["1. Summary"]
results["table header"] = [c.text for c in report.tables[0].rows[0].cells] == ["Indicator", "Actual"]
results["author set"] = report.core_properties.author != "python-docx"
results["cells have p"] = all(tc.xpath("./w:p") for tc in report.element.body.xpath(".//w:tc"))
tags = [c.tag.split("}")[1] for c in report.element.body]
results["p before sectPr"] = tags[-1] == "sectPr" and tags[-2] == "p"
results["no direct fonts"] = not report.element.body.xpath(".//w:rFonts")
for name, ok in results.items():
    print(f"{'PASS' if ok else 'FAIL'}  {name}")
print("all passed:", all(results.values()))
```

### Quiz

1. Why reopen the saved bytes in tests instead of asserting on the in-memory Document?
- [x] Reopening proves the package is valid and catches relationship or XML errors
- [ ] It is faster
- [ ] python-docx requires it
> The in-memory object can look fine while the saved file is unreadable.

2. Which structural mistake does "a table cannot be the last body element" refer to?
- [ ] Tables must be first
- [x] Word needs a paragraph between the final table and `w:sectPr`
- [ ] Tables need captions
> Word reports unreadable content when a `w:tbl` immediately precedes `sectPr`.

3. What is the best way to do byte-level regression on generated DOCX?
- [ ] Compare ZIP bytes directly
- [x] Freeze timestamps and diff the unzipped `document.xml`
- [ ] Compare file sizes
> ZIP bytes change with timestamps and ordering; XML diffs are stable and readable.

### Exercises

1. **Fixture with hostile data** — Build a document from a row containing `Smith & Sons <Title>` and assert the text survives a round trip unchanged.
<details><summary>Solution</summary>

```python
doc = Document(); doc.add_paragraph("Smith & Sons <Title>")
buf = BytesIO(); doc.save(buf); buf.seek(0)
assert Document(buf).paragraphs[0].text == "Smith & Sons <Title>"
```

</details>

2. **Style guard test** — Write a test asserting that every paragraph in the output uses one of an allowed set of styles.
<details><summary>Solution</summary>

```python
ALLOWED = {"Title", "Heading 1", "Heading 2", "Normal", "List Bullet", "Caption"}
def test_styles(report):
    used = {p.style.name for p in report.paragraphs}
    assert used <= ALLOWED, used - ALLOWED
```

</details>

### Interview Questions

**Q: What are the main limitations of python-docx and how do you work around each?**
It does not render, so no page numbers, TOC computation or PDF: pair it with LibreOffice or Word. It has no field API: emit `fldChar`/`instrText` runs. It cannot create list numbering definitions: apply template list styles and add `w:num` overrides for restarts. No floating images: use inline images or hand-built `wp:anchor` XML. No tracked changes: accept or reject at the XML level. Comments only since 1.2. Content controls are invisible to `paragraph.runs`: fill via XPath by tag. Each workaround is a small, tested helper; the library's stable `_element` escape hatch is what makes them possible.

**Q: How do you test a document generator?**
Three layers. Structural tests build the document, save to `BytesIO`, reopen, and assert on headings, table shapes, metadata and the absence of direct formatting. Schema-hygiene tests check every `w:tc` has a `w:p`, the body ends with a paragraph before `sectPr`, and drawing IDs are unique, with the Open XML SDK validator run in CI on samples. Rendering tests convert to PDF with LibreOffice and assert on page count and extracted text. Fixtures include hostile data: ampersands, Urdu text, empty tables and oversized images. Timestamps are frozen so `document.xml` can be diffed against golden files.

**Q: Describe a document automation failure you have seen and what you changed afterwards.**
A weekly report started arriving with an empty second table because the client's designer renamed "Body Text" to "Body" in the template and the generator's `KeyError` was swallowed by a broad `except`. The fix was a style assertion at template load, no bare `except`, a structural test that counts rows in every table, and a manifest of headings and table shapes emailed with each run. Since then a template change fails loudly in CI before anything reaches the client.

**Q: How do you explain to a non-technical client why the TOC is empty when they open the file?**
I tell them Word builds the table of contents when it lays out the pages, and our generator does not run Word; the file asks Word to refresh on open, so clicking Yes fills it in, or we deliver a PDF where it is already computed. Then I offer the LibreOffice or Word rendering step so the DOCX arrives complete. Framing it as "Word does the pagination" avoids the impression that the document is broken.

**Q: What would you look for when reviewing someone else's python-docx code?**
Formatting set on runs instead of styles; `table.cell()` in nested loops; string-based XML edits without escaping; hard-coded `Document()` instead of a template; the default "python-docx" author left in place; find-and-replace at run level; no reopening of saved output in tests; bare `except` around generation; and any `copy.deepcopy` of a `Document`. I also check that every XML helper mirrors what Word itself writes, because that is the only reliable specification of what Word will accept.

