---
id: libreoffice-automation
title: LibreOffice & Headless Automation
icon: 🧰
track: Document Engineering
color: #18A303
runner: none
tagline: Convert, recalculate and batch-process documents on any server.
description: LibreOffice as a production tool: Writer/Calc/Impress essentials for DOCX/XLSX/PPTX fidelity, styles and templates (.ott), soffice --headless conversions (DOCX→PDF, XLSX recalculation, PPTX→PDF), filter options, PDF export settings (PDF/A, tagged), fonts on servers, the UNO API and Python macros, unoserver, Docker deployment, and QA of conversion fidelity.
---

# LEVEL: Beginner

## LibreOffice suite overview & compatibility with Microsoft formats

LibreOffice is a free, open-source office suite maintained by The Document Foundation. For a document engineer it matters for one big reason: it is the only full office engine you can install on a Linux server, run without a display, and drive from a script. Microsoft Office needs Windows or macOS and a logged-in user; LibreOffice converts a DOCX to PDF on a $5 VPS at 3 a.m. with one command.

### The applications

| Application | File type (ODF) | Microsoft counterpart | Typical automation job |
|---|---|---|---|
| Writer | `.odt` | Word `.docx` | DOCX → PDF, mail-merge output, TOC refresh |
| Calc | `.ods` | Excel `.xlsx` | Recalculate formulas, XLSX → CSV/PDF |
| Impress | `.odp` | PowerPoint `.pptx` | PPTX → PDF, slide thumbnails |
| Draw | `.odg` | Visio (roughly) | PDF editing, SVG/PNG export |
| Base | `.odb` | Access | Rarely automated |
| Math | `.odf` | Equation Editor | Formula rendering |

All of them live in one program, `soffice` (on Windows `soffice.exe` inside `C:\Program Files\LibreOffice\program`, on macOS `/Applications/LibreOffice.app/Contents/MacOS/soffice`, on Linux usually `/usr/bin/soffice` or `libreoffice`). The application that opens is chosen by the file type or by a flag such as `--writer`.

### Versions you will meet

LibreOffice ships two release lines: **Fresh** (newest features) and **Still** (older, more tested). Version numbers changed to year-based in 2024: 7.6 was followed by 24.2, 24.8, 25.2, 25.8 and 26.2. Distributions lag: Debian 12 ships 7.4, Ubuntu 24.04 ships 24.2. Several features in this course depend on version, notably JSON-style filter options on the command line (7.4+) and the `XLOOKUP` function in Calc (24.8+). Always record the version your server runs:

```bash
soffice --version
# LibreOffice 24.8.4.2 480(Build:2)
```

### How compatible is it with Microsoft formats?

LibreOffice reads and writes DOCX, XLSX and PPTX through **import/export filters**. The honest picture:

- **Text, headings, styles, tables, images, headers/footers, page numbers, footnotes**: excellent. A policy manual or SOP written with real Word styles converts to PDF almost identically.
- **Fonts**: only identical if the same fonts are installed; otherwise substitution changes line breaks and page counts (covered in the Intermediate level).
- **Fields, TOCs, cross-references**: preserved, but not automatically refreshed on load; a stale TOC in Word stays stale.
- **Tracked changes and comments**: preserved and rendered; tracked changes show as markup in PDF unless accepted.
- **SmartArt, WordArt, some charts, OLE objects, VBA macros**: partial. SmartArt imports as a static drawing or its fallback image; VBA is stored but not executed unless enabled.
- **Excel formulas**: nearly all functions exist; newer dynamic-array functions arrived in 24.8 and 25.2; some behaviours differ (covered in the Calc chapter).
- **XFA/ActiveX/content controls**: content controls supported since 7.4, ActiveX no.

Think of LibreOffice as 95 percent fidelity for well-built documents and 70 percent for documents full of Word-only tricks. The skill is knowing which bucket a client's file falls into before promising output.

### Where it fits in a production pipeline

```text
Word template (.dotx)  ──docx-js / python-docx──▶  filled .docx
                                                        │
                                       soffice --headless --convert-to pdf
                                                        │
                                                   client PDF  ──▶ pdfplumber QA
```

The generation step happens in your language of choice; LibreOffice is the renderer. The same idea applies to Excel: openpyxl writes formulas but cannot compute them, so LibreOffice recalculates and saves cached values; and to PowerPoint decks that need PDF handouts.

### First run and profiles

The first time `soffice` starts it creates a **user profile** (`~/.config/libreoffice/4/user` on Linux, `%APPDATA%\LibreOffice\4\user` on Windows) holding settings, fonts cache, macros and the registry file `registrymodifications.xcu`. Servers care about this because every option you would set in the GUI can be pre-seeded in that file, and because concurrent processes must not share one profile (Expert level).

```bash
# See the profile path from a script
soffice --headless --terminate_after_init
ls ~/.config/libreoffice/4/user
```

> **Tip:** Install the same LibreOffice version on your laptop and the server. "It converts fine on my machine" is nearly always a version or font difference.

### Try It Yourself

```bash
# Confirm the install and do one conversion end to end.
soffice --version
mkdir -p ~/lo-test && cd ~/lo-test
printf 'Policy Manual\n\nSection 1. Purpose\nThis manual sets out the SOPs for the data-processing team.\n' > manual.txt
soffice --headless --convert-to docx --outdir . manual.txt      # txt → docx
soffice --headless --convert-to pdf  --outdir . manual.docx     # docx → pdf
ls -l manual.*
```

### Quiz

1. Why is LibreOffice important for server-side document pipelines?
- [ ] It has better templates than Word
- [x] It runs on Linux without a display and can be driven from the command line
- [ ] It is faster than Word on Windows
> Microsoft Office needs an interactive desktop session; `soffice --headless` needs nothing.

2. Which of these is the least faithful when converting DOCX with LibreOffice?
- [ ] Headings and styles
- [x] SmartArt and VBA
- [ ] Headers, footers and page numbers
> SmartArt becomes a static drawing and VBA does not run; core layout features convert well.

3. What does the LibreOffice user profile contain?
- [x] Settings, the registry file, macros and caches
- [ ] The installed program files
- [ ] Only recent documents
> `registrymodifications.xcu` in the profile is where headless options are pre-seeded.

### Exercises

1. **Locate soffice** — Write the command that prints the path of the `soffice` binary on Linux, macOS and Windows.
<details><summary>Solution</summary>

```bash
which soffice || ls /usr/lib/libreoffice/program/soffice           # Linux
ls /Applications/LibreOffice.app/Contents/MacOS/soffice             # macOS
where soffice   # Windows (cmd), usually "C:\Program Files\LibreOffice\program\soffice.exe"
```

</details>

2. **Fidelity triage** — Classify these features as "converts well" or "needs a workaround": Heading styles, SmartArt, footnotes, VBA button, tracked changes.
<details><summary>Solution</summary>

```text
Heading styles   → converts well
SmartArt         → workaround (accept the fallback image or replace with a picture)
Footnotes        → converts well
VBA button       → workaround (macros do not run; replace with static content)
Tracked changes  → workaround (accept all changes before conversion)
```

</details>

### Interview Questions

**Q: When would you use LibreOffice instead of Microsoft Office in a document pipeline?**
When the pipeline runs on a server, in a container or in CI, where there is no desktop session, and when the volume makes per-seat Office licences or Windows VMs uneconomic. LibreOffice converts DOCX, XLSX and PPTX to PDF from a single command and can be scripted through UNO. The trade-off is fidelity on documents that rely on Word-only features such as SmartArt or VBA, and font availability. In practice I generate documents with python-docx or docx-js from clean templates and let LibreOffice render them, which keeps fidelity high because the input uses only well-supported features.

**Q: What determines whether a DOCX converts faithfully?**
Mostly how it was built: real paragraph and character styles, standard fonts that are installed on the server, tables with fixed widths, images anchored simply, and fields that are already up to date. Documents that hand-format everything, use SmartArt, WordArt, text-box chains or embedded OLE objects lose fidelity. I open the file, inspect the style usage and font list, and run a test conversion before I quote; a page-count comparison between Word's PDF and LibreOffice's PDF is my first metric.

**Q: What is the difference between the Fresh and Still lines and which do you deploy?**
Fresh is the latest feature release, Still is the previous line with more bug-fix releases. On servers I deploy a specific pinned version, usually the current Still or the distribution package, and I record it in the Dockerfile and the QA report, because conversion output can change between versions. I upgrade deliberately, re-running the fidelity test suite against reference PDFs before switching.

## Writer basics & styles

Writer is LibreOffice's word processor and the engine behind every DOCX → PDF conversion. To predict what it will do with a client's document you need to understand how it thinks about **styles**, because everything in Writer, from headings to page layout, is a style.

### The five style families

Press **F11** (or View → Styles) to open the Styles sidebar. Across the top are five families:

| Family | Controls | Word equivalent |
|---|---|---|
| Paragraph styles | Font, spacing, indents, outline level, numbering | Paragraph styles (Heading 1, Normal) |
| Character styles | Inline formatting | Character styles (Strong, Emphasis) |
| Frame styles | Images, text frames | None exactly; picture/text-box formatting |
| Page styles | Size, margins, headers, footers, columns | Sections + page setup |
| List styles | Bullets and numbering | List styles / multilevel lists |
| Table styles | Table formatting (autoformat) | Table styles |

The biggest conceptual difference from Word: **page layout is a style, not a section property**. A document with a landscape appendix has two page styles (Default Page Style and Landscape), and the switch happens at a paragraph whose "Page break with style" property is set.

### Style mapping on DOCX import

When Writer opens a DOCX it maps Word styles to its own names: Word's `Normal` becomes **Default Paragraph Style**, `Heading 1`–`Heading 9` become **Heading 1**–**Heading 9**, `Title` becomes **Title**, `List Paragraph` becomes **List Paragraph**. Unknown Word styles are imported under their own names, so a client's `SOP Body` style arrives intact. On export the mapping runs in reverse. This is why documents built with styles round-trip well and documents built with direct formatting drift.

### The Default Paragraph Style chain

Every paragraph style inherits from another, ending at Default Paragraph Style. Change its font and every non-overriding style changes. In a server pipeline you rarely edit styles by hand, but you must know that a missing font on the server affects the *whole chain*: if Default Paragraph Style asks for Calibri and Calibri is absent, everything falls back.

### Outline levels drive the TOC

Heading 1–10 carry **outline levels** (Tools → Chapter Numbering, called Heading Numbering in 24.x). The table of contents (Insert → Table of Contents and Index → Table of Contents, Index or Bibliography) is built from outline levels, exactly like Word's TOC field. When LibreOffice opens a DOCX, the TOC content is imported as-is; it does **not** refresh until told to (Tools → Update → Update All, or via UNO in the Advanced level). Automating a 767-page handbook's TOC therefore needs an explicit update step.

### Fields

Insert → Field gives Page Number, Page Count, Date, Title, Author and more; Insert → Field → More Fields (Ctrl+F2) opens the full dialog including cross-references, DocInformation and variables. DOCX fields such as `PAGE`, `NUMPAGES`, `DATE`, `REF` and `STYLEREF` map to Writer fields; `DOCPROPERTY` maps to DocInformation; a few Word-only fields (`INCLUDEPICTURE`, `ASK`) become static text.

### Headers, footers and page numbering

Headers and footers belong to the **page style** (Format → Page Style → Header/Footer tabs). "Different first page" and "different odd/even" are page-style options. Word's per-section headers import as separate page styles named `Converted1`, `Converted2` and so on, which is what you see in the Styles sidebar after opening a complex DOCX. That is normal and safe.

### Direct formatting and Clear Direct Formatting

Text with hand-applied fonts and sizes carries **direct formatting**, shown in the sidebar and removable with Ctrl+M (Format → Clear Direct Formatting). Direct formatting converts fine, but it is invisible to style-based automation and is the usual reason a font substitution hits some paragraphs and not others.

```text
Quick health check on a client DOCX in Writer:
1. F11 → Paragraph styles → filter "Applied Styles"  → how many? (few = good)
2. Tools → Update → Update All                           → does the TOC change?
3. File → Properties → Font tab                          → are fonts embedded?
4. View → Field Names (Ctrl+F9)                          → which fields exist?
5. Format → Page Style                                   → how many Converted page styles?
```

> **Tip:** When a client's handbook converts with wrong heading numbers, check Tools → Heading Numbering: Word multilevel lists attached to headings become Writer outline numbering and occasionally arrive with a "restart" flag missing.

### Try It Yourself

```bash
# Apply styles from the command line by round-tripping a Markdown-ish text file through Writer's HTML import,
# then export a PDF. Writer maps <h1>/<h2> to Heading 1/2 and builds outline levels for the TOC.
cat > sop.html <<'HTML'
<html><body>
<h1>Data Processing SOP</h1>
<h2>1. Purpose</h2><p>Defines quality checks for the title-search team.</p>
<h2>2. Scope</h2><p>Applies to all agents on the Systems Limited BPO floor.</p>
</body></html>
HTML
soffice --headless --convert-to odt:writer8 --outdir . sop.html   # HTML → Writer document with real Heading styles
soffice --headless --convert-to pdf --outdir . sop.odt
soffice --headless --convert-to docx:"MS Word 2007 XML" --outdir . sop.odt
ls -l sop.*
```

### Quiz

1. In Writer, where are headers and footers defined?
- [ ] On each paragraph
- [x] In the page style
- [ ] In the document properties
> Page styles own size, margins, headers and footers; Word sections become page styles on import.

2. What happens to a DOCX table of contents when LibreOffice opens the file?
- [ ] It is rebuilt automatically
- [x] It is imported as-is and only updates when told to
- [ ] It is removed
> Tools → Update → Update All (or a UNO call) refreshes it.

3. Which shortcut opens the Styles sidebar?
- [ ] Ctrl+M
- [x] F11
- [ ] Ctrl+F9
> Ctrl+M clears direct formatting; Ctrl+F9 toggles field names.

### Exercises

1. **Landscape appendix** — Describe the Writer steps to make the last chapter of a manual landscape while keeping the rest portrait.
<details><summary>Solution</summary>

```text
F11 → Page Styles → right-click "Landscape" → (it already exists) or New with Orientation: Landscape.
Click at the start of the appendix heading → Format → Paragraph → Text Flow →
Breaks: Insert, Type Page, Position Before, tick "With page style" → choose Landscape.
Everything after the break uses the Landscape page style until another break switches back.
```

</details>

2. **Style census** — List three signs in the Styles sidebar that a DOCX will convert poorly.
<details><summary>Solution</summary>

```text
1. Dozens of "Applied Styles" with names like "Normal + Bold, 11 pt" (direct formatting everywhere).
2. Many page styles named Converted1…Converted12 (fragmented sections/headers).
3. Headings applied as bold Default Paragraph Style instead of Heading 1/2 (no outline levels → empty TOC).
```

</details>

### Interview Questions

**Q: How do Word sections map to LibreOffice Writer, and why does it matter for conversion?**
Writer has no section object in the Word sense; page size, margins, orientation and headers belong to page styles, and a page-style change is a property of a paragraph break. On DOCX import each Word section that differs becomes a page style, often named ConvertedN. It matters because per-section behaviour such as "different first page" or restarting page numbers must land on the right page style; when a converted handbook shows the wrong header on a chapter opener, the fix is in Format → Page Style, not in the paragraph.

**Q: Why does a converted document's TOC show old entries, and how do you fix it in a pipeline?**
LibreOffice imports the TOC's cached entries and does not refresh indexes on load. Word itself refreshes only when the user presses F9 or on print if configured, so both engines keep stale entries by default. In a pipeline I refresh explicitly: through UNO by iterating `doc.getDocumentIndexes()` and calling `update()` on each, then `doc.getTextFields().refresh()`, before exporting to PDF. For a command-line-only setup I run a tiny Python macro on open, or I regenerate the TOC in the document generator so the cache is correct before LibreOffice sees it.

**Q: What is direct formatting and how does it affect automated conversion?**
Direct formatting is formatting applied to a run or paragraph outside any style: a hand-set font, size or colour. It converts, but it cannot be controlled centrally, so a font substitution or a style fix applied at the style level does not reach it, giving mixed results in one document. When I take over a client's template suite I move formatting into styles first, using Clear Direct Formatting and a style census, because every downstream step, from LibreOffice rendering to accessibility tagging, depends on styles.

## Calc basics & differences from Excel

Calc is the spreadsheet engine you use to **recalculate** XLSX files generated by openpyxl, to convert workbooks to CSV or PDF, and occasionally to build rate matrices without Excel. It is very close to Excel, and the differences are exactly the ones that break automation, so this chapter concentrates on them.

### Formula syntax

Calc understands Excel formulas. Two syntax points trip people up. First, the **argument separator** depends on locale settings: en-US LibreOffice uses `;` in the UI by default but accepts `,` when the "Function" separator is set to comma (Tools → Options → LibreOffice Calc → Formula → Separators). Files are unaffected: XLSX stores formulas in Excel's canonical form regardless of the UI separator. Second, sheet references use `.` in ODF and `!` in Excel form; again, Calc translates on load and save.

```excel
=SUMIFS($C:$C; $A:$A; "Wyoming"; $B:$B; ">="&DATE(2026;1;1))   ' Calc UI with ; separators
=SUMIFS($C:$C, $A:$A, "Wyoming", $B:$B, ">="&DATE(2026,1,1))   ' identical meaning, comma setting / Excel
```

### Function coverage

| Function group | Status in Calc | Note |
|---|---|---|
| Classic (SUM, VLOOKUP, INDEX/MATCH, SUMIFS, TEXT) | Full | Identical results |
| IFS, SWITCH, TEXTJOIN, CONCAT, MAXIFS, MINIFS | Full since 5.2–5.4 | |
| XLOOKUP, XMATCH | Since 24.8 | Older servers return `#NAME?` |
| FILTER, SORT, SORTBY, UNIQUE, SEQUENCE, RANDARRAY | Since 25.2 | Spilling behaviour differs (below) |
| LET, LAMBDA | LET since 24.8; LAMBDA not yet | Avoid in files that LibreOffice must recalculate |
| Structured references `Table1[Amount]` | Not supported in formulas | Use ranges or named ranges instead |
| Power Query, Data Model, CUBE functions | None | Bake results before conversion |

The practical rule for a rate calculator that must survive LibreOffice recalculation: use functions from the first two rows, or verify the server version supports the rest.

### Dynamic arrays

Excel 365 spills a formula result into neighbouring cells automatically. Calc's array formulas historically needed Ctrl+Shift+Enter and a fixed output range. Recent versions add dynamic-array functions but spill handling is still evolving, so a workbook relying on spill ranges (`A1#`) may show `#VALUE!` or only the first cell after a headless recalculation. Test before relying on it.

### Recalculation on load

Excel stores each formula's last computed value in the file. When Calc opens an XLSX it can trust those cached values or recompute. The setting is Tools → Options → LibreOffice Calc → Formula → **Recalculation on File Load → Excel 2007 and newer**: *Never recalculate*, *Always recalculate* or *Prompt user*. The default is *Never* (trust the cache), which is fine for Excel-authored files and useless for openpyxl-authored files, whose formulas have **no cached values at all**. The Intermediate level shows how to force *Always* headlessly.

### Other behavioural differences

- **Dates**: both use serial numbers, but Calc's default null date is 1899-12-30 like Excel; the 1904 date system is honoured on import. Text-to-date parsing depends on locale; an en-US profile parses `03/04/2026` as March 4.
- **Text functions and regex**: Calc supports regular expressions in `SEARCH`, `COUNTIF` and friends when enabled (Options → Calc → Calculate → "Enable regular expressions in formulas"); Excel treats the same pattern as literal text. Wildcards `*` and `?` are the compatible choice.
- **Boolean display**: Calc shows `TRUE`/`FALSE` as `1`/`0` in some formats.
- **Sheet limits**: Calc supports 16,384 columns since 7.4 ("jumbo" sheets optional in some builds); older versions stopped at 1,024 (`AMJ`).
- **Pivot tables**: import as Calc pivot tables; refresh is not automatic; slicers and calculated fields may be dropped.
- **Conditional formatting and data validation**: convert well; icon sets mostly; custom-formula rules generally.
- **VBA**: Calc can load VBA (`Option VBASupport 1` compatibility) but only a subset runs; assume macros do not execute headlessly.
- **Named ranges**: fully supported; workbook-scope and sheet-scope both survive.

### CSV import and export details

CSV filter options are positional and matter for headless work. The classic string is `44,34,76,1,,0,false,true,false,false,false,-1`: separator 44 (`,`), text delimiter 34 (`"`), character set 76 (UTF-8), first line 1, column formats blank, language 0, then flags for quoted-as-text, detect special numbers, save cell contents as shown, export formulas, remove spaces, and finally the sheet number to export (`-1` = all sheets, 7.2+).

```bash
soffice --headless --convert-to 'csv:Text - txt - csv (StarCalc):44,34,76,1,,0,false,true,false,false,false,-1' --outdir out rate-matrix.xlsx
# → out/rate-matrix-Sheet1.csv, out/rate-matrix-Sheet2.csv ...
```

> **Warning:** A rate matrix that uses `XLOOKUP` will show `#NAME?` after recalculation on a server running LibreOffice 7.x. Either upgrade the server to 24.8+ or rewrite as `INDEX/MATCH`, which is what I do for anything a client will run on unknown machines.

### Try It Yourself

```bash
# Create a workbook with openpyxl (formulas but no cached values), then let Calc compute and save it.
python3 - <<'PY'
from openpyxl import Workbook
wb = Workbook(); ws = wb.active; ws.title = "Rates"
ws.append(["State", "Amount", "Rate per 1000", "Premium"])
for row in [("TX", 250000, 5.75), ("WY", 180000, 3.90), ("CA", 400000, 4.20)]:
    ws.append(list(row))
for r in range(2, 5):
    ws[f"D{r}"] = f"=ROUND(B{r}/1000*C{r},2)"
ws["D6"] = "=SUM(D2:D4)"
wb.save("premiums.xlsx")
PY
# Convert to CSV: Calc recalculates because there are no cached values, then writes what it computed.
soffice --headless --convert-to 'csv:Text - txt - csv (StarCalc):44,34,76,1,,0,false,true,false,false,false,-1' --outdir . premiums.xlsx
cat premiums-Rates.csv
```

### Quiz

1. Why do openpyxl-generated workbooks show empty cells for formulas in some viewers?
- [ ] openpyxl writes invalid formulas
- [x] openpyxl writes formulas without cached results, and viewers that do not calculate show nothing
- [ ] XLSX cannot store formulas
> A LibreOffice recalculation writes the cached values back so every viewer shows results.

2. Which function group is NOT usable in Calc formulas?
- [ ] SUMIFS
- [x] Structured table references such as `Table1[Amount]`
- [ ] TEXTJOIN
> Use plain ranges or named ranges in files that LibreOffice must process.

3. What does the last `-1` mean in the CSV filter string?
- [ ] Skip the header row
- [x] Export all sheets, one CSV each
- [ ] Use Windows line endings
> Supported since 7.2; a positive number exports that sheet only.

### Exercises

1. **Rewrite for compatibility** — Convert `=XLOOKUP(A2, Rates!A:A, Rates!C:C, 0)` into an INDEX/MATCH formula that LibreOffice 7.x computes.
<details><summary>Solution</summary>

```excel
=IFERROR(INDEX(Rates!$C:$C, MATCH(A2, Rates!$A:$A, 0)), 0)
```

</details>

2. **Locale trap** — A CSV of dates `03/04/2026` is imported on a server whose profile is en-GB. What date results and how do you make the import explicit?
<details><summary>Solution</summary>

```text
en-GB parses 03/04/2026 as 3 April 2026 (en-US would give March 4).
Make it explicit with an infilter that sets column 1 to a date format:
soffice --headless --infilter="Text - txt - csv (StarCalc):44,34,76,1,1/MDY" --convert-to xlsx dates.csv
(column 1 type "MDY"; other codes: 2 text, 3 DMY, 4 MDY, 5 YMD, 9 skip)
```

</details>

### Interview Questions

**Q: What are the main differences between Excel and LibreOffice Calc that affect automation?**
Function coverage on newer functions, notably XLOOKUP only from 24.8, dynamic arrays and LAMBDA still partial, and no structured table references in formulas. Recalculation behaviour: Calc trusts cached values by default, so files written by openpyxl need the "Always recalculate" setting. Locale-dependent parsing of dates and separators, regex versus wildcard matching, and the fact that VBA and Power Query do not run. My rule for workbooks that must survive LibreOffice is to stick to classic functions, avoid spills, and test on the exact server version.

**Q: How would you deliver an Excel rate calculator that a client's Linux system must recalculate?**
I build it with plain ranges and named ranges, classic functions such as INDEX/MATCH and SUMIFS, no macros and no dynamic arrays. I generate or fill it with openpyxl, then run a headless LibreOffice recalculation configured with OOXMLRecalcMode = always, which writes cached values into the file, and I read those values back with openpyxl `data_only=True` to assert a few known premiums. The reference numbers come from the client's published rate matrix, so the test proves both the formulas and the recalculation step.

**Q: Explain the CSV filter option string.**
It is a comma-separated positional list passed after the filter name: field separator as ASCII code, text delimiter, character set number, first line to import, column type map, language, then boolean flags for quoting text cells, detecting special numbers, saving cells as shown, exporting formulas instead of values, trimming spaces, and finally the sheet selector. For exports I mostly vary the sheet selector, `-1` for all sheets, and for imports the column map, such as `1/MDY` to force a date column, because relying on locale parsing produces silent date swaps.

## Templates (.ott/.ots) & document defaults

A template is a document whose styles, page layout, headers and boilerplate are reused for every new file. LibreOffice templates are `.ott` (Writer), `.ots` (Calc) and `.otp` (Impress), the exact counterparts of Word's `.dotx`, Excel's `.xltx` and PowerPoint's `.potx`. On a server, templates are how you control the look of generated documents and how you set defaults such as fonts and page size that the command line cannot express.

### Creating and managing templates

In Writer, set up styles, margins, headers and footers, then **File → Templates → Save as Template…**, give it a name and category, and optionally tick **Set as default template**. **File → Templates → Manage Templates** (Ctrl+Shift+N) lists them and lets you set the default, import an `.ott`, or export one. Templates are stored under the user profile in `user/template/`; system-wide ones live in the installation's `share/template/` folder.

### The default template

The default template decides what "new document" means: font, size, language and page size. Out of the box that is Liberation Serif 12 pt on Letter or A4 depending on locale. Two ways to change it:

1. GUI: Manage Templates → right-click a template → **Set as Default**.
2. Settings: Tools → Options → LibreOffice Writer → **Basic Fonts (Western)** for fonts, and Format → Page Style for size; both live in the profile and can be seeded in `registrymodifications.xcu`.

For servers that convert files created elsewhere, the default template matters less than you think: an incoming DOCX carries its own styles. It matters a lot when you **create** documents from plain text, HTML or CSV, because those inherit the default template.

### Using a template from the command line

`--convert-to` does not accept a template, but you can create a document from one by opening the `.ott` and saving as `.odt`/`.docx`. Headless, the trick is that opening an `.ott` file produces an untitled document based on it:

```bash
# Produce a fresh branded letter document from the template
soffice --headless --convert-to docx --outdir out letterhead.ott     # → out/letterhead.docx
```

For real automation you open the template through UNO with `AsTemplate=True` (Advanced level) or, more commonly, you keep the template as a `.dotx`/`.docx` and fill it with docx-js or python-docx before handing it to LibreOffice for rendering.

### What a template should contain

| Element | Where in Writer | Why it belongs in the template |
|---|---|---|
| Paragraph styles (Body, Heading 1–3, Caption, Quote) | F11 → Paragraph styles | Consistent typography, TOC levels |
| Character styles (Emphasis, Code) | F11 → Character styles | Inline formatting without direct formatting |
| Page styles (First Page, Default, Landscape) | F11 → Page styles | Letterhead on first page only |
| Header/footer with fields | Format → Page Style → Header | Page X of Y, title, date |
| Table of contents placeholder | Insert → TOC | Correct outline levels wired |
| Document properties (Title, Subject, Company) | File → Properties → Description | Feed DocInformation fields |
| Language | Tools → Options → Languages | Spellcheck and hyphenation |

Calc templates (`.ots`) carry cell styles, number formats, print ranges, page style for PDF export and named ranges; Impress templates (`.otp`) carry master slides.

### Templates versus DOCX/DOTX round-trip

LibreOffice can open `.dotx` and save `.ott`, and vice versa, but the conversion loses Word-only pieces: theme colours and fonts become literal values, building blocks disappear, and content-control properties are partially kept (7.4+). If a client's brand suite is in `.dotx`, keep the master in Word format and use LibreOffice only as a renderer; if the whole pipeline is LibreOffice, keep `.ott` masters. Do not maintain both by hand.

### Document defaults you can set in the profile

Many "defaults" are registry settings rather than template content. Examples relevant to servers:

```xml
<!-- registrymodifications.xcu snippets (inside <oor:items>) -->
<item oor:path="/org.openoffice.Office.Writer/Layout/Other"><prop oor:name="MeasureUnit" oor:op="fuse"><value>2</value></prop></item>  <!-- inches -->
<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="OOXMLRecalcMode" oor:op="fuse"><value>0</value></prop></item>   <!-- always recalc -->
<item oor:path="/org.openoffice.Office.Common/Save/Document"><prop oor:name="WarnAlienFormat" oor:op="fuse"><value>false</value></prop></item>
<item oor:path="/org.openoffice.Office.Writer/Layout/Other"><prop oor:name="TabStop" oor:op="fuse"><value>1270</value></prop></item>  <!-- 0.5 in, in 1/100 mm -->
```

Edit the file while LibreOffice is closed, or set values with `soffice --headless` plus a macro; the Intermediate level shows a safe way to seed a fresh profile.

> **Tip:** Export a "golden" profile directory from a configured desktop install, strip caches, and ship it with your Docker image. Then every server starts with the same fonts, defaults, macro-security level and recalculation mode without a single GUI click.

### Try It Yourself

```bash
# Build an .ott from an HTML skeleton, then create a new document from it and render a PDF.
cat > brand.html <<'HTML'
<html><head><style>
body{font-family:"Liberation Sans";font-size:11pt} h1{font-size:18pt;color:#18A303}
</style></head><body><h1>Company Letterhead</h1><p>Body text style goes here.</p></body></html>
HTML
soffice --headless --convert-to odt:writer8 --outdir . brand.html
soffice --headless --convert-to ott:writer8_template --outdir . brand.odt   # save as template
soffice --headless --convert-to docx --outdir out brand.ott                  # new document from template
soffice --headless --convert-to pdf --outdir out out/brand.docx
ls -l brand.ott out/
```

### Quiz

1. What is the LibreOffice equivalent of a Word `.dotx` file?
- [ ] `.odt`
- [x] `.ott`
- [ ] `.ods`
> `.ott` is a Writer template; `.ots` and `.otp` are Calc and Impress templates.

2. When does the default template matter most on a conversion server?
- [ ] When converting DOCX to PDF
- [x] When creating documents from plain text, HTML or CSV
- [ ] Never
> Incoming DOCX files carry their own styles; text and HTML inherit the default template.

3. Where are user templates stored on Linux?
- [x] In the user profile under `user/template/`
- [ ] In `/etc/libreoffice`
- [ ] Inside the document
> System templates live in the install's `share/template/`; user ones in the profile.

### Exercises

1. **Set a default font headlessly** — Which registry path sets Writer's default Western font to Liberation Sans, and how would you apply it without the GUI?
<details><summary>Solution</summary>

```xml
<item oor:path="/org.openoffice.Office.Writer/DefaultFont"><prop oor:name="Standard" oor:op="fuse"><value>Liberation Sans</value></prop></item>
```

```text
Add the item to registrymodifications.xcu in the profile while soffice is not running,
or ship a pre-configured profile directory and point soffice at it with -env:UserInstallation.
```

</details>

2. **Template audit** — List four things to verify in a client's `.ott` before using it on a server.
<details><summary>Solution</summary>

```text
1. Fonts used by every style are installed on the server (fc-list).
2. Page styles: First Page vs Default, headers with Page Number and Page Count fields.
3. Heading 1–3 have outline levels so the TOC works.
4. Document language set (affects hyphenation and date fields).
```

</details>

### Interview Questions

**Q: How do templates fit into a server-side generation pipeline?**
They are the source of truth for styles and layout. If the client's brand is in Word, I keep `.dotx` masters and fill them with docx-js or python-docx, so the generated DOCX already carries the right styles; LibreOffice then only renders. If the pipeline is LibreOffice-native, I keep `.ott` masters and create documents through UNO with `AsTemplate`, filling bookmarks or fields. In both cases the template lives in version control, the server has the template's fonts installed, and the renderer's profile is pre-seeded so defaults never depend on a GUI.

**Q: What is lost when converting a .dotx to .ott?**
Theme-linked fonts and colours become literal values, so later theme changes in Word stop propagating; Quick Parts and building blocks are dropped; content-control properties survive only partially; and some numbering definitions flatten. Styles, page setup, headers, footers and static content survive well. Because of these losses I never maintain the same template in both formats by hand; one is the master and the other is generated when needed.

**Q: Which "defaults" cannot live in a template and where do you set them?**
Application-level behaviour: recalculation mode on XLSX load, measurement units, macro security, warnings about non-ODF formats, default save formats and font replacement tables. These are registry settings in the user profile's `registrymodifications.xcu`. On servers I ship a pre-configured profile and select it with `-env:UserInstallation=file:///path`, which also solves concurrency, rather than relying on a human to click through Tools → Options on each machine.

## Opening/saving DOCX/XLSX safely

Round-tripping Microsoft files through LibreOffice is safe if you follow a few rules; ignoring them produces the "LibreOffice ruined my document" complaints you read online. The rules are: know the filter you are using, never save over the original, preserve VBA where required, and treat ODF as your native format only when the whole team uses LibreOffice.

### Filters: which DOCX is which

LibreOffice has more than one DOCX export filter, and the names matter on the command line:

| Filter name | UI label | Use |
|---|---|---|
| `MS Word 2007 XML` | Word 2007–365 (.docx) | Default; best Word compatibility |
| `Office Open XML Text` | Office Open XML Text (Transitional) | Stricter OOXML; use only if asked |
| `MS Word 97` | Word 97–2003 (.doc) | Legacy |
| `writer8` | ODF Text Document (.odt) | Native |
| `Calc MS Excel 2007 XML` | Excel 2007–365 (.xlsx) | Default Excel |
| `Calc Office Open XML` | Office Open XML Spreadsheet | Stricter OOXML |
| `Impress MS PowerPoint 2007 XML` | PowerPoint 2007–365 (.pptx) | Default PowerPoint |

```bash
soffice --headless --convert-to 'docx:MS Word 2007 XML' --outdir out manual.odt
soffice --headless --convert-to 'xlsx:Calc MS Excel 2007 XML' --outdir out matrix.ods
```

The short form `--convert-to docx` picks `MS Word 2007 XML` automatically, which is what you want.

### Keep Current Format

In the GUI, saving a DOCX shows the dialog "Use Word 2007-365!" versus "Use ODF Format!". Choosing ODF changes the file type. Tools → Options → Load/Save → General → **Warn when not saving in ODF or default format** controls the prompt; **Always save as** sets the default type per application. On servers these prompts never appear because `--headless` answers them silently, but a scripted GUI (UNO) must pass `FilterName` explicitly or the document is saved as ODF.

### Never save over the original

Conversions should write to a separate output directory, and interactive edits should use **File → Save a Copy**. Two reasons: LibreOffice rewrites the entire OOXML package, dropping parts it does not understand (custom XML parts other than content-control bindings, some extensions, `customUI` ribbons); and a failed save can leave a zero-byte file. `--convert-to` always writes a new file in `--outdir`; if you omit `--outdir`, output goes to the current directory, which can be the source folder.

### VBA and macros

Tools → Options → Load/Save → **VBA Properties** has three settings per application: *Load Basic code*, *Executable code*, and *Save original Basic code*. With "Save original Basic code" on (default), the VBA project in a `.docm`/`.xlsm` is preserved byte-for-byte on save, even though it is not executed. Converting `.xlsm` to `.xlsx` naturally strips it. Headless conversions never execute macros unless macro security is lowered, which the Expert level discusses.

### Lock files

Opening a document creates `.~lock.<name>#` beside it. On network shares or shared upload folders this file can outlive a crashed process and make the next open read-only or fail. For headless conversions, copy the input to a private working directory first, or pass `--nolockcheck`; and clean up lock files in your job's error handler.

```bash
cp "$in" "$work/"                       # private copy
soffice --headless --norestore --nolockcheck --convert-to pdf --outdir "$work/out" "$work/$(basename "$in")"
rm -f "$work/.~lock.*#"
```

`--norestore` prevents the document-recovery dialog logic from kicking in after a previous crash, which otherwise can block a headless run.

### Embedded objects, images and links

- Embedded Excel charts in Word documents are OLE objects; LibreOffice renders them from the stored preview image if the object cannot be opened. Chart data edits do not survive.
- Linked images (`INCLUDEPICTURE` with a path) need the path to exist on the server; otherwise a placeholder appears. Embed images before conversion.
- External links in XLSX (`='[budget.xlsx]Sheet1'!A1`) are not updated headlessly; the cached values are used. Tools → Options → Calc → General → *Update links when opening* is "Never" in headless mode by default.

### Password-protected files

LibreOffice can open password-protected DOCX/XLSX interactively, but headless conversion of an encrypted file fails silently (no output). Decrypt first with a tool that knows the password, or pass the password through UNO's `Password` property in `loadComponentFromURL`.

### Validation after saving

Check the output with a different tool: `python-docx` opens the DOCX, `openpyxl` opens the XLSX, and a quick `unzip -l` confirms parts exist. For PDF, `pdfinfo` gives the page count. The Expert level turns these into automated QA.

> **Warning:** Do not use LibreOffice as a DOCX *editor* in a pipeline that also uses Word: each round trip through a different engine drifts formatting slightly (list numbering, table widths, theme colours). Use it as a renderer (DOCX → PDF) or a calculator (XLSX recalc) and let the generating tool own the DOCX.

### Try It Yourself

```bash
# Safe round trip: private copy, explicit filter, separate output dir, verification with another tool.
set -e
in=quarterly-report.docx
work=$(mktemp -d)
cp "$in" "$work/"
soffice --headless --norestore --nolockcheck \
  --convert-to 'pdf:writer_pdf_Export' --outdir "$work/out" "$work/$in"
soffice --headless --norestore --nolockcheck \
  --convert-to 'docx:MS Word 2007 XML' --outdir "$work/roundtrip" "$work/$in"
pdfinfo "$work/out/${in%.docx}.pdf" | grep Pages
python3 -c "import docx,sys; d=docx.Document(sys.argv[1]); print(len(d.paragraphs),'paragraphs')" "$work/roundtrip/$in"
rm -f "$work"/.~lock.*#
```

### Quiz

1. Which filter name produces the most Word-compatible `.docx`?
- [x] `MS Word 2007 XML`
- [ ] `Office Open XML Text`
- [ ] `writer8`
> It is the default for `--convert-to docx` and the "Word 2007–365" label in the GUI.

2. What does `--nolockcheck` do?
- [ ] Disables password prompts
- [x] Ignores existing `.~lock` files when opening
- [ ] Prevents saving
> Stale lock files from crashed runs otherwise block or read-only the document.

3. What happens when you headlessly convert a password-protected DOCX?
- [ ] It converts normally
- [x] No output is produced
- [ ] The password is stripped
> Provide the password via UNO's `Password` property or decrypt first.

### Exercises

1. **Preserve macros** — A client sends `budget.xlsm` and wants a PDF and an updated copy that still has its macros. Give the two commands.
<details><summary>Solution</summary>

```bash
soffice --headless --convert-to pdf --outdir out budget.xlsm
soffice --headless --convert-to 'xlsm:Calc MS Excel 2007 VBA XML' --outdir out budget.xlsm
# "Save original Basic code" (default on) keeps the VBA project intact; it is not executed.
```

</details>

2. **Detect encryption** — Write a shell check that flags a DOCX as password-protected before conversion.
<details><summary>Solution</summary>

```bash
if unzip -l "$f" >/dev/null 2>&1; then echo "plain OOXML zip"; else
  file "$f" | grep -qi "Composite Document" && echo "encrypted (OLE wrapper) → needs password"; fi
```

</details>

### Interview Questions

**Q: Is it safe to round-trip a client's DOCX through LibreOffice?**
For rendering to PDF, yes, with the usual fidelity caveats. For editing and saving back as DOCX, only with care: LibreOffice rewrites the package and drops parts it does not model, theme references become literal values, and repeated round trips between Word and LibreOffice drift list numbering and table widths. My rule is that one engine owns the DOCX; LibreOffice is the renderer or the calculator. When a client needs LibreOffice to produce DOCX, I use the `MS Word 2007 XML` filter, write to a separate directory, and verify the output with python-docx.

**Q: How do you handle lock files and crash recovery on a conversion server?**
Each job copies its input to a private working directory, runs `soffice --headless --norestore --nolockcheck`, and cleans up `.~lock.*#` files in a finally block. `--norestore` stops the recovery logic from blocking after a previous crash, and a per-job user profile prevents one crashed run from poisoning the next. On shared network folders I never point LibreOffice at the original path, because a stale lock there makes the next run open read-only and fail silently.

**Q: What happens to VBA when LibreOffice saves an .xlsm?**
With the default "Save original Basic code" option, the stored VBA project is written back unchanged, so the macros survive for Excel users even though LibreOffice did not run them. Converting to `.xlsx` removes the project by definition. In headless pipelines macros never execute, which is a security feature; if a workbook's values depend on a macro running, I recompute that logic in Python instead of trying to run VBA on the server.

# LEVEL: Intermediate

## soffice --headless --convert-to (syntax, output dir, filters)

`--convert-to` is the command you will run thousands of times. It starts LibreOffice without a window, opens each input, exports it with a filter, and exits. This chapter is the complete syntax, including the filter-name and filter-option forms that the help text barely mentions.

### The basic form

```bash
soffice --headless --convert-to <ext>[:<FilterName>[:<FilterOptions>]] [--outdir <dir>] <file> [<file> ...]
```

- `<ext>` is the output extension and is enough on its own for common targets: `pdf`, `docx`, `xlsx`, `pptx`, `odt`, `ods`, `html`, `txt`, `csv`, `png`, `svg`.
- `<FilterName>` is the internal export filter, needed when one extension has several filters (`docx`), or when the target application is ambiguous (`pdf` from Writer, Calc, Impress or Draw).
- `<FilterOptions>` is a filter-specific string: the CSV positional list, a text encoding, or, since 7.4, a JSON object for PDF and other filters.
- `--outdir` sets the output directory; it is created if missing. Without it, output goes to the **current working directory**.
- Input files can be globbed by the shell; LibreOffice processes them in one process, one after the other.

```bash
soffice --headless --convert-to pdf --outdir out report.docx
soffice --headless --convert-to 'pdf:writer_pdf_Export' --outdir out report.docx        # explicit filter
soffice --headless --convert-to 'pdf:calc_pdf_Export'   --outdir out matrix.xlsx
soffice --headless --convert-to 'pdf:impress_pdf_Export' --outdir out deck.pptx
soffice --headless --convert-to 'txt:Text (encoded):UTF8' --outdir out report.docx      # plain text, UTF-8
soffice --headless --convert-to 'html:XHTML Writer File:UTF8' --outdir out report.docx
soffice --headless --convert-to png --outdir out deck.pptx                              # first slide as PNG
```

### Useful companion flags

| Flag | Effect |
|---|---|
| `--headless` | No GUI, no dialogs; implies `--invisible`, `--nologo`, `--norestore` in recent versions but state them anyway for older builds |
| `--norestore` | Skip crash-recovery attempts |
| `--nologo` | No splash screen |
| `--nolockcheck` | Ignore stale `.~lock` files |
| `--nodefault` | Do not open a blank document when nothing else is requested |
| `--infilter="<name>[:<options>]"` | Force the **import** filter, for CSV column types or ambiguous text files |
| `-env:UserInstallation=file:///tmp/lo-1` | Use a separate profile (essential for concurrency) |
| `--terminate_after_init` | Start, initialise the profile, exit |
| `--convert-images-to <fmt>` | 7.5+: convert embedded images (e.g. to `jpg`) on export |

### Input filters

When the input extension is misleading (a `.txt` that is really CSV, a `.xls` that is HTML), specify the import filter:

```bash
soffice --headless --infilter="Text - txt - csv (StarCalc):59,34,76,1" --convert-to xlsx --outdir out data.txt   # ; separated
soffice --headless --infilter="HTML (StarCalc)" --convert-to xlsx --outdir out export.xls
soffice --headless --infilter="MS Word 2007 XML" --convert-to pdf --outdir out upload.bin
```

### Finding filter names

Filter definitions are XML files in the installation: `share/registry/*.xcd` contain `<node oor:name="writer_pdf_Export"`-style entries. A quick list:

```bash
grep -oh 'oor:name="[^"]*" oor:op="replace"' /usr/lib/libreoffice/share/registry/writer.xcd | sed 's/.*name="\([^"]*\)".*/\1/' | sort | head -50
```

Common names: `writer8`, `writer_pdf_Export`, `MS Word 2007 XML`, `MS Word 97`, `Office Open XML Text`, `HTML (StarWriter)`, `Text (encoded)`, `calc8`, `calc_pdf_Export`, `Calc MS Excel 2007 XML`, `MS Excel 97`, `Text - txt - csv (StarCalc)`, `impress8`, `impress_pdf_Export`, `Impress MS PowerPoint 2007 XML`, `impress_png_Export`, `draw_pdf_Export`, `draw_svg_Export`.

### Exit codes and output detection

`soffice` returns 0 even when conversion fails, for example on an encrypted input or an unknown filter; the only reliable success signal is that the expected output file exists and is non-empty. On success it prints one line per file:

```text
convert /work/report.docx -> /work/out/report.pdf using filter : writer_pdf_Export
```

On an unknown filter it prints `Error: no export filter for /work/out/report.pdf found, aborting.` to stderr and still exits 0 in many versions. Always check the file.

```bash
soffice --headless --convert-to pdf --outdir out report.docx
test -s out/report.pdf || { echo "conversion failed" >&2; exit 1; }
```

### Output naming

The output name is the input base name with the new extension, inside `--outdir`. Two inputs with the same base name from different folders overwrite each other; use per-job output directories. Multi-sheet CSV export appends `-SheetName`.

### Performance notes

Each invocation pays a start-up cost of one to three seconds. Converting ten files in one command is much faster than ten commands. For hundreds of files per hour, keep a running instance and use UNO or unoserver (Advanced level).

> **Interview note:** "Why did my conversion silently produce nothing?" is a favourite. List the causes you have actually hit: encrypted input, a stale lock file, a profile locked by another process, a missing `--outdir` permission, `HOME` not writable, a wrong filter name, or a first-run profile creation timing out in a container.

### Try It Yourself

```bash
# Batch-convert a folder of DOCX to PDF in one process, verify each output, and print a summary.
mkdir -p out
soffice --headless --norestore --nolockcheck --convert-to 'pdf:writer_pdf_Export' --outdir out *.docx
ok=0; fail=0
for f in *.docx; do
  p="out/${f%.docx}.pdf"
  if [ -s "$p" ]; then ok=$((ok+1)); else fail=$((fail+1)); echo "MISSING: $p"; fi
done
echo "converted=$ok failed=$fail"
```

### Quiz

1. Where does `--convert-to` write output when `--outdir` is omitted?
- [ ] Next to the input file
- [x] In the current working directory
- [ ] In the user profile
> This surprises people running from a different folder; always pass `--outdir`.

2. Why specify `pdf:calc_pdf_Export` instead of just `pdf`?
- [ ] It is required for XLSX
- [x] To make the filter explicit when the extension alone could map to several applications
- [ ] It produces smaller files
> The plain form usually guesses right, but explicit names make scripts predictable.

3. What is the reliable way to detect a failed headless conversion?
- [ ] Check the exit code
- [x] Check that the expected output file exists and is non-empty
- [ ] Read stdout for the word "ok"
> `soffice` often exits 0 on failure; the file system is the truth.

### Exercises

1. **Semicolon CSV** — Write the command to import a `;`-separated, Latin-1 CSV and save it as XLSX.
<details><summary>Solution</summary>

```bash
soffice --headless --infilter="Text - txt - csv (StarCalc):59,34,12,1" --convert-to xlsx --outdir out data.csv
# 59 = ';', 34 = '"', 12 = ISO-8859-1 (Latin-1)
```

</details>

2. **Ambiguous PDF** — A `.docx` and a `.xlsx` both named `summary` are converted into the same `out/`. What happens and how do you prevent it?
<details><summary>Solution</summary>

```text
Both become out/summary.pdf; the second overwrites the first.
Prevent it with per-input output directories (out/docx/, out/xlsx/) or by renaming inputs before conversion.
```

</details>

### Interview Questions

**Q: Walk through the full syntax of `--convert-to` and when you need each part.**
The value is `ext[:Filter[:Options]]`. The extension alone works for unambiguous targets like `pdf` or `xlsx`. The filter name is needed when one extension has several filters, for example `docx:MS Word 2007 XML` versus `Office Open XML Text`, or when I want scripts to be explicit. Options are filter-specific: positional lists for CSV and encoded text, and JSON for PDF export since 7.4. `--outdir` sets the destination and `--infilter` forces the import filter for mislabelled inputs. I always pair it with `--headless --norestore --nolockcheck` and a separate profile in production.

**Q: How do you make headless conversion robust in a script?**
Copy the input to a private directory, run with a job-specific `-env:UserInstallation`, wrap the call in `timeout`, and treat the presence of a non-empty output file as the only success signal, because the exit code is unreliable. Log stdout and stderr per job, clean lock files, and retry once on failure with a fresh profile. For throughput, batch many files into one invocation or keep a running instance behind unoserver.

**Q: What causes silent failures in headless mode?**
Encrypted inputs, stale lock files, a profile already locked by another process, an unwritable `HOME` or profile path, a wrong filter name, missing `--outdir` permissions, and, in containers, the first-run profile creation being killed by a short timeout. Fonts do not cause failures but cause wrong output, which I catch with page-count and text checks in QA.

## PDF export options (PDF/A, tagged PDF, bookmarks, quality)

The PDF export filter has dozens of settings that the GUI shows under File → Export As → Export as PDF. Every one of them can be set from the command line since LibreOffice 7.4 using a JSON options string, and from UNO through `FilterData`. This chapter covers the ones that matter for client deliverables: archival PDF/A, tagged (accessible) PDF, bookmarks from headings, image quality, page ranges, form export and passwords.

### The JSON option syntax (7.4+)

```bash
soffice --headless --convert-to 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"},"UseTaggedPDF":{"type":"boolean","value":"true"}}' --outdir out manual.docx
```

Each option is `"Name":{"type":"<long|boolean|string>","value":"<v>"}`. Quote the whole argument for the shell. Versions before 7.4 accept no PDF options on the command line and need UNO.

### The options you will actually use

| Option | Type | Values | Meaning |
|---|---|---|---|
| `SelectPdfVersion` | long | 0 = PDF 1.7, 1 = PDF/A-1b, 2 = PDF/A-2b, 3 = PDF/A-3b, 15 = PDF 1.5, 16 = 1.6, 17 = 1.7 | Archival profiles embed all fonts and forbid transparency in A-1 |
| `PDFUACompliance` | boolean | true/false | Adds PDF/UA metadata; requires `UseTaggedPDF` |
| `UseTaggedPDF` | boolean | | Writes the structure tree from styles and outline levels |
| `ExportBookmarks` | boolean | | Outline (bookmarks) from headings; default true |
| `ExportNotes` | boolean | | Comments as PDF annotations |
| `ExportNotesInMargin` | boolean | | Comments in margin (7.x) |
| `ExportFormFields` | boolean | | Writer form controls become AcroForm fields |
| `FormsType` | long | 0 FDF, 1 PDF, 2 HTML, 3 XML | Submit format for exported forms |
| `UseLosslessCompression` | boolean | | Images lossless (larger) |
| `Quality` | long | 1–100 | JPEG quality when not lossless; default 90 |
| `ReduceImageResolution` | boolean | | Downsample images |
| `MaxImageResolution` | long | 75, 150, 300, 600, 1200 | Target DPI when reducing |
| `PageRange` | string | `"1-3,7"` | Export part of the document |
| `EncryptFile` | boolean | | Require open password |
| `DocumentOpenPassword` | string | | The open password |
| `RestrictPermissions` | boolean | | Owner password permissions |
| `PermissionPassword` | string | | Owner password |
| `Printing` | long | 0 none, 1 low-res, 2 full | Permission |
| `Changes` | long | 0 none … 4 all | Permission |
| `ExportHiddenSlides` | boolean | | Impress |
| `SinglePageSheets` | boolean | | Calc: each sheet as one page |
| `Watermark` | string | | Diagonal text watermark |
| `OpenBookmarkLevels` | long | -1 all, 1–10 | Bookmark panel expansion |
| `InitialView` | long | 0 default, 1 outline, 2 thumbnails | Viewer start pane |

### PDF/A for archival deliverables

PDF/A-2b is the usual request from legal and public-sector clients. It requires every font embedded, no encryption, no JavaScript, and device-independent colour. LibreOffice handles fonts and metadata automatically; the things that break conformance are transparency (allowed in A-2, not A-1), embedded files (only in A-3) and fonts without embedding permission. Verify with veraPDF (`verapdf --flavour 2b out/manual.pdf`).

```bash
soffice --headless --convert-to 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"}}' --outdir out contract.docx
verapdf --flavour 2b out/contract.pdf | grep -E 'isCompliant|failedChecks'
```

### Tagged PDF and PDF/UA

Tagged export builds the structure tree from Writer's paragraph styles: Heading N becomes `<H n>`, body text `<P>`, tables `<Table>`, images `<Figure>` with the image's alt text (Format → Image → Options → Text Alternative). It only works as well as the source document's styles, which is another reason to insist on real heading styles. `PDFUACompliance` adds the PDF/UA identifier; a document with headings that skip levels or images without alt text still fails a checker.

### Bookmarks and the outline

`ExportBookmarks` is on by default and produces the bookmark tree from outline levels, so a 767-page handbook gets a navigable sidebar for free. `OpenBookmarkLevels` decides how many levels are expanded on open. For Calc, bookmarks come from sheet names; for Impress, from slide titles.

### Images, size and quality

Default export is JPEG at 90 percent with no downsampling; a manual full of 300 DPI screenshots stays large. For email-friendly copies: `ReduceImageResolution` true with `MaxImageResolution` 150 and `Quality` 80. For print masters: `UseLosslessCompression` true. Compare sizes with `ls -l` and pages with `pdfinfo`; changing quality never changes page count.

### Security options

`EncryptFile` with `DocumentOpenPassword` sets a user password (AES-256 in current versions). `RestrictPermissions` with `PermissionPassword` plus `Printing`/`Changes` sets owner permissions. PDF/A and encryption are mutually exclusive; the filter silently ignores the archival profile when encryption is on.

### Setting options for older versions or in UNO

Before 7.4, or from Python, pass the same names inside `FilterData`:

```python
from com.sun.star.beans import PropertyValue
def pv(name, value): p = PropertyValue(); p.Name = name; p.Value = value; return p
filter_data = uno.Any("[]com.sun.star.beans.PropertyValue", (pv("SelectPdfVersion", 2), pv("UseTaggedPDF", True), pv("ExportBookmarks", True)))
doc.storeToURL(out_url, (pv("FilterName", "writer_pdf_Export"), pv("FilterData", filter_data)))
```

> **Tip:** Export settings chosen in the GUI's PDF dialog are saved in the profile and are **not** used by `--convert-to`; the command line uses filter defaults plus whatever you pass. Put every option in the command so behaviour does not depend on who last used the GUI on that machine.

### Try It Yourself

```bash
# Three exports of the same handbook: archival PDF/A-2b + tagged, an email copy, and a page-range proof.
doc=handbook.docx
soffice --headless --convert-to 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"},"UseTaggedPDF":{"type":"boolean","value":"true"},"PDFUACompliance":{"type":"boolean","value":"true"},"OpenBookmarkLevels":{"type":"long","value":"2"}}' --outdir out/archive "$doc"
soffice --headless --convert-to 'pdf:writer_pdf_Export:{"ReduceImageResolution":{"type":"boolean","value":"true"},"MaxImageResolution":{"type":"long","value":"150"},"Quality":{"type":"long","value":"75"}}' --outdir out/email "$doc"
soffice --headless --convert-to 'pdf:writer_pdf_Export:{"PageRange":{"type":"string","value":"1-5"},"Watermark":{"type":"string","value":"PROOF"}}' --outdir out/proof "$doc"
ls -l out/*/handbook.pdf
pdfinfo out/archive/handbook.pdf | grep -E 'Pages|Tagged|PDF version'
```

### Quiz

1. Which `SelectPdfVersion` value produces PDF/A-2b?
- [ ] 1
- [x] 2
- [ ] 17
> 1 is PDF/A-1b, 3 is PDF/A-3b and 17 is plain PDF 1.7.

2. Tagged PDF quality depends mostly on…
- [ ] The `Quality` option
- [x] The source document using real heading and paragraph styles
- [ ] The LibreOffice version
> The structure tree is derived from styles and outline levels.

3. Do GUI PDF export settings apply to `--convert-to`?
- [ ] Yes, always
- [x] No; the command line uses filter defaults plus explicit options
- [ ] Only for Writer
> Put every option on the command line so servers behave identically.

### Exercises

1. **Locked review copy** — Write the option JSON for a PDF with open password `review2026`, printing allowed at full resolution and no changes.
<details><summary>Solution</summary>

```json
{"EncryptFile":{"type":"boolean","value":"true"},"DocumentOpenPassword":{"type":"string","value":"review2026"},
 "RestrictPermissions":{"type":"boolean","value":"true"},"PermissionPassword":{"type":"string","value":"OwnerSecret"},
 "Printing":{"type":"long","value":"2"},"Changes":{"type":"long","value":"0"}}
```

</details>

2. **Calc export** — Export only the sheet "Rates" of a workbook as a single-page-per-sheet PDF.
<details><summary>Solution</summary>

```bash
# Set the print range / hide other sheets in the file, or export all with SinglePageSheets and split afterwards:
soffice --headless --convert-to 'pdf:calc_pdf_Export:{"SinglePageSheets":{"type":"boolean","value":"true"}}' --outdir out matrix.xlsx
# Then extract the page whose bookmark is "Rates" with qpdf --pages, or hide other sheets before export via UNO.
```

</details>

### Interview Questions

**Q: How do you produce a PDF/A-2b from DOCX on a server and prove conformance?**
With `--convert-to 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"}}'` on LibreOffice 7.4 or later, or through UNO `FilterData` on older versions. The filter embeds fonts and writes XMP metadata; the failures I watch for are fonts that forbid embedding, transparency in A-1 mode, and encryption, which cancels PDF/A. I validate every archival deliverable with veraPDF and keep the report with the file, because clients in legal and government audit conformance.

**Q: What does tagged PDF export depend on and what still needs manual work?**
It depends on styles: outline levels become heading tags, body paragraphs become `P`, tables and figures are tagged if they are real tables and anchored images with alt text. LibreOffice cannot invent structure that the document lacks, so a document with bold text used as headings produces a flat tag tree. Reading order across text frames and complex tables, alt text for decorative images, and PDF/UA checks like non-skipped heading levels still require a pass in Acrobat or PAC.

**Q: How would you shrink a 400 MB training manual PDF without changing its layout?**
Image settings only: `ReduceImageResolution` with `MaxImageResolution` 150 for screen or 300 for print, and `Quality` around 75–85, or lossless off if it was on. Page count and text are untouched because only image streams change, and I confirm with `pdfinfo` and a text diff. If the source images are already low resolution, the gain is small and the real fix is in the DOCX, replacing pasted screenshots with properly sized ones.

## Batch conversion scripts (bash/PowerShell/Python subprocess)

Real jobs are folders: 340 SOP documents to PDF/A, a night's worth of generated invoices, a client's 12,000-file archive. This chapter turns the single command into batch scripts that are safe to rerun, report failures, and run on Linux, Windows and from Python.

### Principles for every batch script

1. **Idempotent**: skip files whose output already exists and is newer than the input.
2. **Isolated**: private working directory and profile per run.
3. **Bounded**: a timeout per invocation, a fresh process per chunk.
4. **Observable**: a log line per file, a summary at the end, non-zero exit on any failure.
5. **Chunked**: many files per `soffice` call to amortise start-up, but not thousands, so one bad file cannot stall the rest.

### Bash

```bash
#!/usr/bin/env bash
set -euo pipefail
src=${1:?source dir}; dst=${2:?output dir}; chunk=25
profile="file:///tmp/lo-profile-$$"
mkdir -p "$dst"
mapfile -t files < <(find "$src" -maxdepth 1 -type f \( -iname '*.docx' -o -iname '*.doc' -o -iname '*.odt' \) | sort)
pending=()
for f in "${files[@]}"; do
  out="$dst/$(basename "${f%.*}").pdf"
  [[ -s "$out" && "$out" -nt "$f" ]] && continue     # idempotent
  pending+=("$f")
done
echo "to convert: ${#pending[@]} of ${#files[@]}"
fail=0
for ((i=0; i<${#pending[@]}; i+=chunk)); do
  batch=("${pending[@]:i:chunk}")
  if ! timeout 300 soffice --headless --norestore --nolockcheck "-env:UserInstallation=$profile" \
        --convert-to 'pdf:writer_pdf_Export' --outdir "$dst" "${batch[@]}" >>"$dst/convert.log" 2>&1; then
    echo "chunk starting at $i failed or timed out" >&2
  fi
  for f in "${batch[@]}"; do
    out="$dst/$(basename "${f%.*}").pdf"
    [[ -s "$out" ]] || { echo "FAILED: $f" >&2; fail=$((fail+1)); }
  done
done
rm -rf "/tmp/lo-profile-$$"
echo "done, failures=$fail"; exit $(( fail > 0 ))
```

`timeout 300` kills a hung instance; `-env:UserInstallation` keeps this run's profile separate; the per-file existence check is the real success test.

### PowerShell (Windows)

```powershell
param([string]$Src, [string]$Dst)
$soffice = "C:\Program Files\LibreOffice\program\soffice.exe"
$profile = "file:///$($env:TEMP -replace '\\','/')/lo-profile-$PID"
New-Item -ItemType Directory -Force -Path $Dst | Out-Null
$files = Get-ChildItem -Path $Src -Include *.docx,*.doc,*.odt -File -Recurse
$fail = 0
foreach ($chunk in ($files | ForEach-Object -Begin { $i=0 } -Process { [pscustomobject]@{ f=$_; g=[math]::Floor($i++/25) } } | Group-Object g)) {
  $args = @('--headless','--norestore','--nolockcheck',"-env:UserInstallation=$profile",'--convert-to','pdf:writer_pdf_Export','--outdir',$Dst) + ($chunk.Group.f.FullName)
  $p = Start-Process -FilePath $soffice -ArgumentList $args -Wait -PassThru -NoNewWindow
  foreach ($f in $chunk.Group.f) {
    $out = Join-Path $Dst ($f.BaseName + '.pdf')
    if (-not (Test-Path $out) -or (Get-Item $out).Length -eq 0) { Write-Warning "FAILED: $($f.FullName)"; $fail++ }
  }
}
Remove-Item -Recurse -Force ($profile -replace '^file:///','') -ErrorAction SilentlyContinue
Write-Host "done, failures=$fail"; exit ([int]($fail -gt 0))
```

On Windows, `soffice.exe` returns quickly if another instance is running with the same profile; the separate profile avoids the classic "converts on the desktop but not from the scheduled task" issue.

### Python subprocess

```python
import subprocess, shutil, tempfile, pathlib, sys, time

SOFFICE = shutil.which("soffice") or shutil.which("libreoffice") or r"C:\Program Files\LibreOffice\program\soffice.exe"

def convert(files, outdir, target="pdf:writer_pdf_Export", timeout=300):
    outdir = pathlib.Path(outdir); outdir.mkdir(parents=True, exist_ok=True)
    profile = pathlib.Path(tempfile.mkdtemp(prefix="lo-profile-"))
    cmd = [SOFFICE, "--headless", "--norestore", "--nolockcheck",
           f"-env:UserInstallation={profile.as_uri()}",
           "--convert-to", target, "--outdir", str(outdir), *map(str, files)]
    try:
        run = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        log = run.stdout + run.stderr
    except subprocess.TimeoutExpired:
        log = "TIMEOUT"
    finally:
        shutil.rmtree(profile, ignore_errors=True)
    results = {}
    for f in files:
        out = outdir / (pathlib.Path(f).stem + "." + target.split(":")[0])
        results[str(f)] = out.exists() and out.stat().st_size > 0
    return results, log

if __name__ == "__main__":
    src, dst = map(pathlib.Path, sys.argv[1:3])
    files = sorted(p for p in src.iterdir() if p.suffix.lower() in {".docx", ".doc", ".odt"})
    failures = 0
    for i in range(0, len(files), 25):
        res, log = convert(files[i:i+25], dst)
        for f, ok in res.items():
            if not ok: failures += 1; print("FAILED:", f, file=sys.stderr)
    print("done, failures =", failures); sys.exit(1 if failures else 0)
```

Use `capture_output` so a chatty LibreOffice cannot fill a pipe and deadlock, and `profile.as_uri()` so the path is a correct `file://` URL on every platform.

### Recursive folders and preserving structure

Mirror the source tree: compute `rel = f.relative_to(src)` and use `dst / rel.parent` as `--outdir`, grouping files by target directory so each chunk shares one `--outdir`.

### Reporting

Write a CSV with input, output, size, seconds and status; a client receiving 12,000 PDFs wants the two failures listed, not a "done" message. Keep `convert.log` for the raw LibreOffice output.

| Concern | Bash | PowerShell | Python |
|---|---|---|---|
| Timeout | `timeout 300` | `Wait-Process -Timeout` or job | `subprocess.run(timeout=)` |
| Profile isolation | `-env:UserInstallation` | same | same via `as_uri()` |
| Chunking | array slices | `Group-Object` | list slices |
| Success test | `[[ -s out ]]` | `Test-Path` + length | `stat().st_size` |

> **Warning:** Never run two batch scripts sharing one profile at the same time; the second will either hang waiting for the first or hand its files to the first instance and exit without output. The Expert level covers safe parallelism.

### Try It Yourself

```python
# Minimal batch converter with idempotence and a CSV report (run locally where soffice is installed).
import csv, pathlib, shutil, subprocess, tempfile, time
SOFFICE = shutil.which("soffice") or "soffice"
src, dst = pathlib.Path("in"), pathlib.Path("out"); dst.mkdir(exist_ok=True)
rows = []
pending = [p for p in sorted(src.glob("*.docx")) if not (dst / (p.stem + ".pdf")).exists()]
profile = pathlib.Path(tempfile.mkdtemp())
t0 = time.time()
subprocess.run([SOFFICE, "--headless", "--norestore", f"-env:UserInstallation={profile.as_uri()}",
                "--convert-to", "pdf", "--outdir", str(dst), *map(str, pending)], capture_output=True, timeout=600)
for p in pending:
    out = dst / (p.stem + ".pdf")
    rows.append([p.name, out.name, out.stat().st_size if out.exists() else 0, "ok" if out.exists() else "FAILED"])
with open(dst / "report.csv", "w", newline="") as fh:
    csv.writer(fh).writerows([["input", "output", "bytes", "status"], *rows])
shutil.rmtree(profile, ignore_errors=True)
print(f"{len(pending)} files in {time.time()-t0:.1f}s; failures={sum(r[3]=='FAILED' for r in rows)}")
```

### Quiz

1. Why chunk files into groups of about 25 per `soffice` call?
- [ ] LibreOffice cannot open more than 25 files
- [x] To amortise start-up time while limiting the damage of one hung file
- [ ] To keep the log short
> One process per file is slow; one process for thousands lets a single bad file stall everything.

2. What makes a batch script idempotent?
- [x] Skipping inputs whose output already exists and is newer
- [ ] Deleting the output folder first
- [ ] Using `set -e`
> Reruns after a failure then only process what is missing.

3. Why use `capture_output=True` in Python?
- [ ] To hide errors
- [x] To prevent a full pipe from deadlocking the child process
- [ ] It is required for timeouts
> Unread output pipes block the writer; capturing drains them.

### Exercises

1. **Mirror a tree** — Modify the Python converter so `in/a/b/report.docx` becomes `out/a/b/report.pdf`.
<details><summary>Solution</summary>

```python
from collections import defaultdict
groups = defaultdict(list)
for p in src.rglob("*.docx"):
    groups[dst / p.relative_to(src).parent].append(p)
for outdir, files in groups.items():
    outdir.mkdir(parents=True, exist_ok=True)
    subprocess.run([SOFFICE, "--headless", "--convert-to", "pdf", "--outdir", str(outdir), *map(str, files)], capture_output=True, timeout=600)
```

</details>

2. **Retry once** — Add a single retry with a fresh profile for files that failed in a chunk.
<details><summary>Solution</summary>

```python
failed = [p for p in pending if not (dst / (p.stem + ".pdf")).exists()]
if failed:
    profile2 = pathlib.Path(tempfile.mkdtemp())
    subprocess.run([SOFFICE, "--headless", f"-env:UserInstallation={profile2.as_uri()}",
                    "--convert-to", "pdf", "--outdir", str(dst), *map(str, failed)], capture_output=True, timeout=600)
    shutil.rmtree(profile2, ignore_errors=True)
```

</details>

### Interview Questions

**Q: Design a script to convert 12,000 DOCX files to PDF overnight.**
Enumerate inputs, skip those already converted, and split the rest into chunks of about 25. Each chunk runs one `soffice --headless` process with its own profile, wrapped in a timeout, writing to a mirrored output tree. Success per file is the existence of a non-empty PDF; failures are retried once with a fresh profile, then reported in a CSV with sizes and timings. I run several workers in parallel on separate profiles up to the core count, and I sample-check a few outputs against the source with pdfplumber. The whole thing is rerunnable, so a crash at 3 a.m. costs only the remaining files.

**Q: Why not just loop `soffice --convert-to` per file?**
Start-up costs one to three seconds per process, so 12,000 files would spend hours just booting LibreOffice. Batching many files per process removes that overhead. The opposite extreme, one process for everything, means one corrupt file that hangs LibreOffice kills the entire run and you lose the log context. Chunks of a few dozen, each with a timeout, are the balance, and for continuous workloads a persistent instance behind unoserver is better still.

**Q: How do you make the Windows scheduled-task version work when it "works on the desktop"?**
The scheduled task runs as a different user, often without a writable profile path, and may collide with an interactive LibreOffice instance using the same profile. I give the task its own `-env:UserInstallation` under a writable temp directory, use full paths to `soffice.exe`, pass `--headless --norestore`, and check for the output file rather than the exit code. Logging stdout and stderr to a file usually reveals the profile or permission error immediately.

## Fonts on Linux servers (fc-list, fontconfig, matching Word fonts)

Fonts are the number-one cause of "the PDF looks different on the server". Word documents from clients specify Calibri, Cambria, Arial, Times New Roman, Segoe UI and brand fonts; a fresh Linux server has none of them. LibreOffice substitutes the closest installed font, and because substitutes have different widths, lines wrap differently, tables grow, and a 42-page manual becomes 44 pages. This chapter is how to make server output match Word.

### How LibreOffice finds fonts on Linux

LibreOffice uses **fontconfig**, the same library as the rest of the desktop. Fonts are discovered from `/usr/share/fonts`, `/usr/local/share/fonts`, `~/.fonts` and `~/.local/share/fonts`, plus the fonts bundled inside LibreOffice's own `share/fonts/truetype`. Inspect with:

```bash
fc-list | wc -l                       # how many fonts
fc-list : family | sort -u | head     # family names
fc-match Calibri                      # what fontconfig substitutes for Calibri
fc-match "Times New Roman"
fc-cache -f -v                        # rebuild the cache after installing fonts
```

If `fc-match Calibri` prints `DejaVuSans.ttf`, your Calibri documents are being set in DejaVu Sans, which is noticeably wider.

### Metric-compatible substitutes

Some open fonts are designed to have the **same character widths** as Microsoft fonts, so line breaks and page counts match even though glyph shapes differ slightly:

| Microsoft font | Metric-compatible open font | Package (Debian/Ubuntu) |
|---|---|---|
| Arial | Liberation Sans | `fonts-liberation` |
| Times New Roman | Liberation Serif | `fonts-liberation` |
| Courier New | Liberation Mono | `fonts-liberation` |
| Calibri | Carlito | `fonts-crosextra-carlito` |
| Cambria | Caladea | `fonts-crosextra-caladea` |
| Georgia | Gelasio | `fonts-gelasio` (not in all distros) |
| Segoe UI, Verdana, Tahoma | none exact | install the real fonts or accept reflow |

```bash
sudo apt-get install -y fonts-liberation fonts-crosextra-carlito fonts-crosextra-caladea fonts-dejavu fonts-noto-core
fc-cache -f
fc-match Calibri   # → Carlito-Regular.ttf after the alias below
```

These packages ship fontconfig alias rules in `/etc/fonts/conf.d/` (Debian installs `30-0-fonts-crosextra-carlito.conf` with the Carlito package) so `Calibri` resolves to Carlito automatically. If not, add your own alias:

```xml
<!-- /etc/fonts/local.conf -->
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <alias binding="same"><family>Calibri</family><prefer><family>Carlito</family></prefer></alias>
  <alias binding="same"><family>Cambria</family><prefer><family>Caladea</family></prefer></alias>
  <alias binding="same"><family>Segoe UI</family><prefer><family>Noto Sans</family></prefer></alias>
</fontconfig>
```

### Installing the real Microsoft fonts

Where licensing allows (you own an Office licence for the machine, or the client supplies the fonts), copy the `.ttf` files from a Windows machine's `C:\Windows\Fonts` into `/usr/local/share/fonts/msttf/` and run `fc-cache -f`. The `ttf-mscorefonts-installer` package installs the older "core fonts for the web" set (Arial, Times New Roman, Verdana, Georgia, Trebuchet, Comic Sans, Impact, Courier New, Andale Mono, Webdings); it does not include Calibri, Cambria or Segoe UI. Brand fonts come from the client under their licence and go in the same folder; never commit licensed fonts to a public repository.

### LibreOffice's own replacement table

Tools → Options → LibreOffice → Fonts → **Replacement Table** lets LibreOffice substitute a family before fontconfig sees it, either always or only when the font is missing ("Screen only" unticked applies to print/PDF). On servers it is easier to rely on fontconfig aliases, but the table lives in the profile's registry and can be pre-seeded:

```xml
<item oor:path="/org.openoffice.Office.Common/Font/Substitution"><prop oor:name="Replacement" oor:op="fuse"><value>true</value></prop></item>
<item oor:path="/org.openoffice.Office.Common/Font/Substitution/FontPairs"><node oor:name="_0" oor:op="replace">
  <prop oor:name="ReplaceFont"><value>Calibri</value></prop><prop oor:name="SubstituteFont"><value>Carlito</value></prop>
  <prop oor:name="Always"><value>false</value></prop><prop oor:name="OnScreenOnly"><value>false</value></prop></node></item>
```

### Embedded fonts in DOCX

Word can embed fonts (File → Options → Save → Embed fonts in the file). LibreOffice reads embedded fonts from DOCX since 4.x and uses them for rendering, which is the cleanest fix for brand fonts: ask the client to embed. Check with `unzip -l file.docx | grep fonts/`; embedded fonts appear as `word/fonts/font1.odttf`. Note that many commercial fonts are embedded obfuscated and only for "print and preview", which LibreOffice honours.

### Diagnosing font issues

```bash
# Which fonts does the DOCX ask for?
unzip -p manual.docx word/fontTable.xml | grep -o 'w:name="[^"]*"' | sort -u
# Which fonts ended up in the PDF?
pdffonts out/manual.pdf
```

If `pdffonts` lists `DejaVuSans` for a Calibri document, install Carlito and rerun. Compare page counts before and after; with metric-compatible fonts they should match Word's output exactly.

> **Tip:** Docker images forget everything. Put the font install and `fc-cache -f` in the Dockerfile and add `fc-match Calibri` to your image test so a base-image change that drops Carlito fails the build, not the client delivery.

### Try It Yourself

```bash
# Font audit for a folder of DOCX files: list requested fonts, show what fontconfig would substitute, flag mismatches.
for f in *.docx; do
  for fam in $(unzip -p "$f" word/fontTable.xml | grep -o 'w:name="[^"]*"' | sed 's/w:name="//; s/"$//' | tr ' ' '_' | sort -u); do
    name=${fam//_/ }
    match=$(fc-match "$name" | sed 's/:.*//')
    printf '%-30s %-22s -> %s\n' "$f" "$name" "$match"
  done
done | sort -u
# Any line where the requested family is not the match (and not a known metric twin) needs a font install or an alias.
```

### Quiz

1. What is a metric-compatible font?
- [ ] A font with identical glyph shapes
- [x] A font whose character widths match another font, so line breaks stay the same
- [ ] A font that is free of charge
> Carlito matches Calibri's metrics; page counts match even though shapes differ slightly.

2. Which package provides a Calibri substitute on Debian/Ubuntu?
- [ ] `ttf-mscorefonts-installer`
- [x] `fonts-crosextra-carlito`
- [ ] `fonts-dejavu`
> The mscorefonts package has Arial and Times but not Calibri or Cambria.

3. How do you see which fonts actually ended up in a PDF?
- [ ] `fc-list`
- [x] `pdffonts file.pdf`
- [ ] `unzip -l file.pdf`
> `pdffonts` (poppler-utils) lists embedded and referenced fonts per PDF.

### Exercises

1. **Alias Georgia** — Write a fontconfig alias that maps Georgia to Gelasio and, if missing, to Liberation Serif.
<details><summary>Solution</summary>

```xml
<alias binding="same"><family>Georgia</family><prefer><family>Gelasio</family><family>Liberation Serif</family></prefer></alias>
```

</details>

2. **Prove the fix** — Give the commands to compare page counts of a DOCX converted before and after installing Carlito.
<details><summary>Solution</summary>

```bash
soffice --headless --convert-to pdf --outdir before manual.docx; pdfinfo before/manual.pdf | grep Pages
sudo apt-get install -y fonts-crosextra-carlito && fc-cache -f
soffice --headless --convert-to pdf --outdir after manual.docx;  pdfinfo after/manual.pdf  | grep Pages
pdffonts after/manual.pdf | grep -i carlito
```

</details>

### Interview Questions

**Q: A DOCX converts to 44 pages on the server but Word prints 42. What do you check first?**
Fonts. I list the families the document requests from `word/fontTable.xml`, run `fc-match` on each, and check `pdffonts` on the server's PDF. Almost always Calibri or Cambria is being replaced by DejaVu, which is wider. Installing Carlito and Caladea, which are metric-compatible, or the client's licensed fonts, and rebuilding the cache brings the count back to 42. Only if fonts match do I look at other causes such as compatibility options, hyphenation language, or table autofit differences.

**Q: How do you manage fonts in a containerised conversion service?**
The Dockerfile installs Liberation, Carlito, Caladea, DejaVu and Noto, copies any client-licensed fonts from a private volume or build secret into `/usr/local/share/fonts`, adds a `local.conf` with aliases for Segoe UI and other fonts without metric twins, and runs `fc-cache -f`. The image test runs `fc-match` for each critical family and a reference DOCX conversion whose page count and `pdffonts` output are compared with stored expectations, so a base-image change cannot silently regress fidelity.

**Q: What are the licensing considerations for Microsoft fonts on Linux servers?**
Calibri, Cambria and Segoe UI are proprietary and licensed with Windows and Office; copying them to a Linux server is generally outside those licences unless the client owns and supplies them for their own machine. The core-fonts-for-the-web set is redistributable under its old EULA via the mscorefonts installer, but it lacks the modern fonts. The safe default is metric-compatible open fonts, with client-supplied fonts stored privately and never committed to repositories.

## Recalculating XLSX formulas headlessly

Python libraries such as openpyxl and XlsxWriter write formulas but never compute them. Excel calculates on open, but a server has no Excel, and downstream consumers such as `openpyxl` with `data_only=True`, pandas, Power BI refreshes or PDF exports need **cached values** in the file. LibreOffice Calc is the standard way to compute them headlessly.

### Why cached values matter

An XLSX cell with a formula stores both `<f>SUM(B2:B4)</f>` and, optionally, `<v>430000</v>`. openpyxl writes the `<f>` and omits `<v>`. Anything that does not run a calculation engine sees an empty value. LibreOffice opens the file, calculates, and writes `<v>` on save.

```bash
soffice --headless --convert-to xlsx --outdir out premiums.xlsx
```

That single line usually works for openpyxl files because there is nothing cached to trust, so Calc must compute. The problem case is a file that **has** stale cached values, for example a workbook filled by a script that copied an old template: Calc's default is *Never recalculate* for XLSX on load, so the stale numbers survive.

### Forcing recalculation with a profile setting

The setting is `OOXMLRecalcMode` under `/org.openoffice.Office.Calc/Formula/Load`: `0` = always, `1` = never, `2` = prompt. Seed it into the profile used by the server:

```bash
profile=/tmp/lo-recalc
mkdir -p "$profile/user"
cat > "$profile/user/registrymodifications.xcu" <<'XCU'
<?xml version="1.0" encoding="UTF-8"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="OOXMLRecalcMode" oor:op="fuse"><value>0</value></prop></item>
<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="ODFRecalcMode" oor:op="fuse"><value>0</value></prop></item>
</oor:items>
XCU
soffice --headless "-env:UserInstallation=file://$profile" --convert-to xlsx --outdir out premiums.xlsx
```

With that profile every XLSX is fully recalculated on load. Keep this profile separate from your normal conversion profile if you rely on trusting Excel's cached values for speed.

### Recalculating through UNO

When you drive a running instance (Advanced level), call the document's `calculateAll()` before saving, which is version-independent and explicit:

```python
doc = desktop.loadComponentFromURL(in_url, "_blank", 0, (pv("Hidden", True),))
doc.calculateAll()
doc.storeToURL(out_url, (pv("FilterName", "Calc MS Excel 2007 XML"),))
doc.close(True)
```

### Verifying the result

```python
from openpyxl import load_workbook
wb = load_workbook("out/premiums.xlsx", data_only=True)   # read cached values
ws = wb["Rates"]
print(ws["D2"].value, ws["D6"].value)                        # 1437.5 3800.7 (for the example workbook)
assert ws["D6"].value is not None, "no cached values → recalculation did not run"
```

`data_only=True` reads `<v>`; if it returns `None` for formula cells, nothing computed. Compare against known totals from the client's rate matrix for a real test.

### Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Function unsupported in the server's version | `#NAME?` in cached value | Rewrite formula or upgrade (XLOOKUP needs 24.8+) |
| Volatile functions (`NOW`, `RAND`, `TODAY`) | Values differ every run | Expected; freeze them in Python if determinism matters |
| External links | Stale or `#REF!` | Bake linked values before conversion |
| Iterative calculation (circular references) | `Err:522` | Enable iterations in the file (Tools → Options → Calc → Calculate) or remove the loop |
| Array formulas | `#VALUE!` or first cell only | Use CSE ranges or avoid spills |
| Number formats lost | Values fine, formatting odd | openpyxl `number_format` set correctly; Calc preserves it |
| Sheet protection | Recalc fine, later edits blocked | Expected; protection is preserved |
| Large workbooks | Minutes per file | Turn off autocalc chains; consider the `--convert-to csv` path for values only |

### Values-only exports

If the goal is numbers rather than an XLSX, export straight to CSV or PDF; Calc calculates before exporting:

```bash
soffice --headless "-env:UserInstallation=file://$profile" --convert-to 'csv:Text - txt - csv (StarCalc):44,34,76,1,,0,false,true,false,false,false,-1' --outdir out premiums.xlsx
soffice --headless "-env:UserInstallation=file://$profile" --convert-to 'pdf:calc_pdf_Export' --outdir out premiums.xlsx
```

The CSV `false` in position 9 ("export formulas") ensures values, not formulas, are written.

> **Interview note:** Interviewers ask "why does pandas read NaN from my generated workbook?" The answer is cached values: pandas reads `<v>`, openpyxl never wrote one, and a LibreOffice recalculation pass (or opening in Excel) fixes it. Bonus points for naming `OOXMLRecalcMode`.

### Try It Yourself

```python
# Generate a rate workbook with openpyxl, recalculate it with LibreOffice using an "always recalc" profile,
# and verify cached values with openpyxl data_only=True.
import pathlib, shutil, subprocess, tempfile
from openpyxl import Workbook, load_workbook

wb = Workbook(); ws = wb.active; ws.title = "Rates"
ws.append(["State", "Amount", "Rate per 1000", "Premium"])
for state, amt, rate in [("TX", 250000, 5.75), ("WY", 180000, 3.90), ("CA", 400000, 4.20)]:
    ws.append([state, amt, rate, None])
for r in range(2, 5): ws[f"D{r}"] = f"=ROUND(B{r}/1000*C{r},2)"
ws["D6"] = "=SUM(D2:D4)"
wb.save("premiums.xlsx")

profile = pathlib.Path(tempfile.mkdtemp()); (profile / "user").mkdir()
(profile / "user" / "registrymodifications.xcu").write_text(
    '<?xml version="1.0" encoding="UTF-8"?><oor:items xmlns:oor="http://openoffice.org/2001/registry" '
    'xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
    '<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="OOXMLRecalcMode" oor:op="fuse"><value>0</value></prop></item>'
    '</oor:items>')
subprocess.run([shutil.which("soffice") or "soffice", "--headless", "--norestore", f"-env:UserInstallation={profile.as_uri()}",
                "--convert-to", "xlsx", "--outdir", "out", "premiums.xlsx"], check=True, capture_output=True, timeout=300)
vals = load_workbook("out/premiums.xlsx", data_only=True)["Rates"]
print("D2..D4:", [vals[f"D{r}"].value for r in range(2, 5)], "total:", vals["D6"].value)
assert abs(vals["D6"].value - 3800.7) < 0.01
shutil.rmtree(profile, ignore_errors=True)
```

### Quiz

1. Why does `openpyxl.load_workbook(data_only=True)` return `None` for formula cells in a file openpyxl created?
- [ ] openpyxl cannot read formulas
- [x] openpyxl never wrote cached values, and `data_only` reads only cached values
- [ ] The file is corrupt
> A calculation engine such as LibreOffice or Excel must compute and save the values first.

2. Which registry setting forces Calc to recalculate XLSX on load?
- [x] `OOXMLRecalcMode = 0`
- [ ] `ODFRecalcMode = 1`
- [ ] `AutoCalculate = false`
> 0 = always, 1 = never (default), 2 = prompt; ODFRecalcMode is the ODS equivalent.

3. A formula shows `#NAME?` after recalculation on the server but works in Excel. Most likely cause?
- [ ] The profile is corrupt
- [x] The function is not supported by the server's LibreOffice version
- [ ] The sheet is protected
> XLOOKUP before 24.8 and LAMBDA in any version are typical offenders.

### Exercises

1. **Deterministic totals** — A workbook uses `=TODAY()` in a header. How do you keep recalculated outputs reproducible for tests?
<details><summary>Solution</summary>

```python
import datetime
ws["A1"] = datetime.date(2026, 9, 16)   # write the date as a value from Python instead of =TODAY()
# Volatile functions recompute every load; fixed values make PDF/CSV outputs byte-comparable in QA.
```

</details>

2. **Assert a rate** — Write a check that the recalculated premium for TX equals the value from a client's published rate matrix (5.75 per 1,000 on 250,000).
<details><summary>Solution</summary>

```python
expected = round(250000 / 1000 * 5.75, 2)          # 1437.5
assert abs(vals["D2"].value - expected) < 0.005, vals["D2"].value
```

</details>

### Interview Questions

**Q: Your Python service generates Excel reports and Power BI shows blank totals. What is wrong and how do you fix it?**
The generator, openpyxl or XlsxWriter, writes formulas without cached values, and Power BI's import reads cached values only. I add a recalculation step: LibreOffice Calc headless with a profile whose `OOXMLRecalcMode` is 0, converting XLSX to XLSX, or a UNO `calculateAll()` call in a running instance. Then I verify with `load_workbook(data_only=True)` that formula cells are non-null and that a couple of known totals match, and I make that check part of the pipeline so it cannot regress.

**Q: When would you compute values in Python instead of relying on LibreOffice recalculation?**
When the workbook uses functions LibreOffice lacks or computes differently, when determinism matters and the sheet uses volatile functions, or when the throughput requirement makes a LibreOffice pass too slow. In those cases Python calculates the numbers, writes them as values, and keeps formulas only where the client needs to edit inputs later. For rate matrices I often do both: values for the report, formulas in a separate calculator sheet, and a LibreOffice pass to cache the calculator's outputs.

**Q: What is the difference between OOXMLRecalcMode and ODFRecalcMode?**
They are the same setting for different file families: OOXML covers XLSX/XLSM and ODF covers ODS. Each has always/never/prompt. Defaults are "never" for OOXML, trusting Excel's cache, and "never" for ODF written by LibreOffice itself. On a recalculation profile I set both to 0 so behaviour does not depend on the input format, and I keep a second profile with defaults for pure conversions where trusting the cache is faster.

# LEVEL: Advanced

## UNO API basics (Python, connecting to a running instance)

`--convert-to` is a hammer: open, export, exit. When you need to *change* a document before exporting, refresh a TOC, fill fields, hide sheets, set print ranges or convert hundreds of files without paying start-up each time, you use **UNO** (Universal Network Objects), LibreOffice's component API. It is available from Python, Java, C++ and LibreOffice Basic; this chapter uses Python from outside the process, talking to a running `soffice` over a socket.

### Which Python?

UNO's Python module (`uno`) is compiled against the LibreOffice build. Use the interpreter that ships with or is packaged for LibreOffice:

```bash
# Debian/Ubuntu: system python3 with the python3-uno package
sudo apt-get install -y python3-uno
python3 -c "import uno; print('uno ok')"
# Windows: C:\Program Files\LibreOffice\program\python.exe
# macOS:   /Applications/LibreOffice.app/Contents/Resources/python
```

A virtualenv usually cannot import `uno` unless it is created with `--system-site-packages`.

### Start LibreOffice listening

```bash
soffice --headless --norestore --nologo \
  "-env:UserInstallation=file:///tmp/lo-uno" \
  --accept="socket,host=127.0.0.1,port=2002;urp;StarOffice.ComponentContext" &
```

`--accept` opens a URP (UNO Remote Protocol) socket. Bind to localhost only; the socket has no authentication. The process stays up until you terminate it (`desktop.terminate()` from a client or `kill`).

### Connect and open a document

```python
import uno, time
from com.sun.star.beans import PropertyValue
from com.sun.star.connection import NoConnectException

def pv(name, value):
    p = PropertyValue(); p.Name = name; p.Value = value; return p

def connect(port=2002, retries=20):
    local = uno.getComponentContext()
    resolver = local.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver", local)
    for _ in range(retries):
        try:
            return resolver.resolve(f"uno:socket,host=127.0.0.1,port={port};urp;StarOffice.ComponentContext")
        except NoConnectException:
            time.sleep(0.5)
    raise RuntimeError("soffice not listening")

ctx = connect()
smgr = ctx.ServiceManager
desktop = smgr.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)

in_url = uno.systemPathToFileUrl("/work/manual.docx")
doc = desktop.loadComponentFromURL(in_url, "_blank", 0, (pv("Hidden", True), pv("ReadOnly", False)))
```

`loadComponentFromURL` takes a `file://` URL (never a plain path), a target frame (`_blank`), search flags (0) and load properties. `Hidden` keeps no window even if a display exists. Other useful properties: `Password`, `FilterName` (force import filter), `AsTemplate` (create a new untitled document from a template), `MacroExecutionMode`.

### Do something useful: refresh fields and indexes

```python
# Writer: update all TOCs/indexes and fields, then export PDF
if doc.supportsService("com.sun.star.text.TextDocument"):
    indexes = doc.getDocumentIndexes()
    for i in range(indexes.getCount()):
        indexes.getByIndex(i).update()
    doc.getTextFields().refresh()
    doc.refresh()

filter_data = uno.Any("[]com.sun.star.beans.PropertyValue", (pv("SelectPdfVersion", 2), pv("ExportBookmarks", True), pv("UseTaggedPDF", True)))
out_url = uno.systemPathToFileUrl("/work/out/manual.pdf")
doc.storeToURL(out_url, (pv("FilterName", "writer_pdf_Export"), pv("FilterData", filter_data)))
doc.close(True)
```

`storeToURL` exports without changing the document's own location; `storeAsURL` re-targets it (like Save As). `close(True)` releases the document; forgetting it leaks memory in the long-running instance.

### Calc: recalculate, hide sheets, set a print range

```python
doc = desktop.loadComponentFromURL(uno.systemPathToFileUrl("/work/matrix.xlsx"), "_blank", 0, (pv("Hidden", True),))
doc.calculateAll()
sheets = doc.getSheets()
for name in sheets.getElementNames():
    sheets.getByName(name).IsVisible = (name == "Rates")
rates = sheets.getByName("Rates")
rates.setPrintAreas((rates.getCellRangeByName("A1:F60").getRangeAddress(),))
doc.storeToURL(uno.systemPathToFileUrl("/work/out/rates.pdf"), (pv("FilterName", "calc_pdf_Export"),))
doc.close(True)
```

### Dispatching UI commands

Some features exist only as UI commands (accept all tracked changes, update all). Use the dispatch helper with a `.uno:` command:

```python
dispatcher = smgr.createInstanceWithContext("com.sun.star.frame.DispatchHelper", ctx)
frame = doc.getCurrentController().getFrame()
dispatcher.executeDispatch(frame, ".uno:AcceptAllTrackedChanges", "", 0, ())
dispatcher.executeDispatch(frame, ".uno:UpdateAll", "", 0, ())
```

Command names are listed in the LibreOffice wiki's "Development/DispatchCommands" page and in `Tools → Customize → Keyboard` (hover shows the command).

### Introspection

UNO objects are dynamic; discover them at runtime:

```python
print(doc.getImplementationName())
print(doc.getSupportedServiceNames())
# Install the MRI or Xray extension on a desktop for GUI introspection; from Python use dir(doc) on the pyuno proxy.
```

| Task | Service / call |
|---|---|
| Open | `desktop.loadComponentFromURL(url, "_blank", 0, props)` |
| Export | `doc.storeToURL(url, (FilterName, FilterData))` |
| Text of a Writer doc | `doc.getText().getString()` |
| Replace text | `rd = doc.createReplaceDescriptor(); rd.SearchString="{{name}}"; rd.ReplaceString="Ali"; doc.replaceAll(rd)` |
| Cell value | `sheet.getCellRangeByName("B2").getValue()` / `.setValue()` / `.setString()` |
| Page count (Writer) | `doc.getCurrentController().PageCount` (after layout) |
| Close | `doc.close(True)`; stop server: `desktop.terminate()` |

> **Warning:** A single UNO instance handles one call at a time and shares state. A crash in one document kills every client. Run one instance per worker, recycle it every few hundred documents, and always `close()` documents.

### Try It Yourself

```python
# Full UNO session: start soffice, connect, replace placeholders in a DOCX, refresh indexes, export PDF, terminate.
import subprocess, time, uno, pathlib, shutil
from com.sun.star.beans import PropertyValue
def pv(n, v): p = PropertyValue(); p.Name = n; p.Value = v; return p

profile = pathlib.Path("/tmp/lo-uno-demo"); profile.mkdir(exist_ok=True)
srv = subprocess.Popen([shutil.which("soffice") or "soffice", "--headless", "--norestore", f"-env:UserInstallation={profile.as_uri()}",
                        '--accept=socket,host=127.0.0.1,port=2002;urp;StarOffice.ComponentContext'])
local = uno.getComponentContext()
resolver = local.ServiceManager.createInstanceWithContext("com.sun.star.bridge.UnoUrlResolver", local)
for _ in range(40):
    try: ctx = resolver.resolve("uno:socket,host=127.0.0.1,port=2002;urp;StarOffice.ComponentContext"); break
    except Exception: time.sleep(0.5)
desktop = ctx.ServiceManager.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)

doc = desktop.loadComponentFromURL(uno.systemPathToFileUrl(str(pathlib.Path("letter.docx").resolve())), "_blank", 0, (pv("Hidden", True),))
rd = doc.createReplaceDescriptor(); rd.SearchString = "{{client}}"; rd.ReplaceString = "Stewart Title Guaranty"; doc.replaceAll(rd)
idx = doc.getDocumentIndexes()
for i in range(idx.getCount()): idx.getByIndex(i).update()
doc.getTextFields().refresh()
pathlib.Path("out").mkdir(exist_ok=True)
doc.storeToURL(uno.systemPathToFileUrl(str(pathlib.Path("out/letter.pdf").resolve())), (pv("FilterName", "writer_pdf_Export"),))
print("pages:", doc.getCurrentController().PageCount)
doc.close(True)
desktop.terminate(); srv.wait(timeout=30)
```

### Quiz

1. Which Python interpreter can `import uno`?
- [ ] Any Python 3
- [x] The one built for or packaged with LibreOffice (e.g. `python3-uno` on Debian)
- [ ] Only Python 2
> The module is compiled against the LibreOffice build; a plain venv cannot see it.

2. What does `loadComponentFromURL` require as its first argument?
- [ ] A filesystem path
- [x] A `file://` URL, e.g. from `uno.systemPathToFileUrl()`
- [ ] A filter name
> Plain paths fail with an IllegalArgumentException.

3. What is the difference between `storeToURL` and `storeAsURL`?
- [x] `storeToURL` exports a copy; `storeAsURL` changes the document's own location
- [ ] They are identical
- [ ] `storeAsURL` only works for PDF
> Use `storeToURL` for exports so the open document keeps pointing at its source.

### Exercises

1. **Fill a Calc cell** — Write UNO code that sets `Rates.B2` to 275000, recalculates, and prints `D2`.
<details><summary>Solution</summary>

```python
sheet = doc.getSheets().getByName("Rates")
sheet.getCellRangeByName("B2").setValue(275000)
doc.calculateAll()
print(sheet.getCellRangeByName("D2").getValue())
```

</details>

2. **Accept tracked changes** — Give the dispatch command sequence to accept all changes and remove all comments before export.
<details><summary>Solution</summary>

```python
frame = doc.getCurrentController().getFrame()
dispatcher.executeDispatch(frame, ".uno:AcceptAllTrackedChanges", "", 0, ())
dispatcher.executeDispatch(frame, ".uno:DeleteAllNotes", "", 0, ())
```

</details>

### Interview Questions

**Q: When do you move from `--convert-to` to the UNO API?**
When the job needs to change the document before export or needs throughput. Refreshing a TOC and fields, replacing placeholders, accepting tracked changes, hiding sheets, setting print ranges, or passing a password all require UNO. Throughput matters too: a running instance converts in a fraction of a second per file versus one to three seconds of start-up per process. The cost is operational: a long-lived process to supervise, one call at a time per instance, and the need to use LibreOffice's Python for the `uno` module, which is why I wrap it in unoserver or a small worker service.

**Q: How do you connect to LibreOffice from Python and what are the failure modes?**
Start `soffice --headless --accept="socket,host=127.0.0.1,port=2002;urp;..."` with its own profile, then in Python resolve `uno:socket,...;StarOffice.ComponentContext` through `UnoUrlResolver`, retrying while the process starts. Failure modes: `NoConnectException` because the instance is still initialising or the port is taken; `import uno` failing in a virtualenv; a stale profile lock making the new instance hand off to an old one; and documents left open leaking memory until the instance slows down. I bind to localhost only because the socket has no authentication.

**Q: How would you refresh a 767-page handbook's TOC and fields on a server?**
Through UNO: load hidden, iterate `doc.getDocumentIndexes()` calling `update()` on each, then `doc.getTextFields().refresh()`, optionally dispatch `.uno:UpdateAll`, wait for layout, and export with `writer_pdf_Export`. I read `PageCount` from the controller afterwards and compare it against the expected count from the previous release, because a TOC that grew by a page shifts every page reference. If the DOCX is generated by my own tooling I also make sure heading styles carry outline levels so the update produces the right entries.

## Python macros in LibreOffice

Macros run **inside** LibreOffice, with the same UNO objects as the external API but without a socket. They are the right tool when the logic must travel with the installation or the document, when you cannot install `python3-uno` alongside a separate interpreter, or when you want to trigger behaviour from the command line without a client process. LibreOffice supports macros in Basic, Python, JavaScript and BeanShell; Python is the sane choice for anything beyond a few lines.

### Where Python macros live

| Location | Path | Scope |
|---|---|---|
| User scripts | `~/.config/libreoffice/4/user/Scripts/python/` (Linux), `%APPDATA%\LibreOffice\4\user\Scripts\python\` (Windows) | This profile |
| Shared scripts | `<install>/share/Scripts/python/` | All users on the machine |
| Document scripts | `Scripts/python/` inside the ODF zip | Travel with the document (ODF only, not DOCX) |

Create the folder if missing. Each `.py` file is a **library**; each top-level function is a macro. The `g_exportedScripts` tuple restricts which functions the Macro dialog shows.

### A first macro

```python
# ~/.config/libreoffice/4/user/Scripts/python/docs.py
import uno
from com.sun.star.beans import PropertyValue

def pv(name, value):
    p = PropertyValue(); p.Name = name; p.Value = value; return p

def refresh_and_export(*args):
    doc = XSCRIPTCONTEXT.getDocument()
    idx = doc.getDocumentIndexes()
    for i in range(idx.getCount()):
        idx.getByIndex(i).update()
    doc.getTextFields().refresh()
    out = doc.getURL().rsplit(".", 1)[0] + ".pdf"
    doc.storeToURL(out, (pv("FilterName", "writer_pdf_Export"),))

g_exportedScripts = (refresh_and_export,)
```

`XSCRIPTCONTEXT` is injected by the script provider and gives `getDocument()`, `getDesktop()` and `getComponentContext()`. Run it in the GUI with Tools → Macros → Run Macro → My Macros → docs → refresh_and_export.

### Running a macro from the command line

The `vnd.sun.star.script:` URL runs a macro headlessly. Pass the document first so it becomes the current document:

```bash
soffice --headless --norestore manual.docx \
  'macro:///docs.py$refresh_and_export'   # older Basic-style URL; works for Basic, not Python
soffice --headless --norestore manual.docx \
  'vnd.sun.star.script:docs.py$refresh_and_export?language=Python&location=user'
```

The second form is the correct one for Python. `location=user` means the profile's Scripts folder; `location=share` for the installation; `location=document` for embedded scripts. The document opens, the macro runs with it as `XSCRIPTCONTEXT.getDocument()`, and soffice exits when the macro returns and no windows remain (add `desktop.terminate()` at the end of the macro if it lingers).

### Passing arguments

Macro URLs cannot pass arguments directly. Use environment variables or a small JSON file that the macro reads:

```python
import os, json
def export_with_options(*args):
    opts = json.loads(os.environ.get("LO_OPTS", "{}"))
    version = opts.get("pdfa", 2)
    ...
```

```bash
LO_OPTS='{"pdfa":2}' soffice --headless manual.docx 'vnd.sun.star.script:docs.py$export_with_options?language=Python&location=user'
```

### Event-driven macros

Tools → Customize → Events binds macros to **Open Document**, **Save Document**, **Print Document** and more, either for the application or for one document. A common production trick is binding a "refresh all indexes" macro to Open Document on the conversion profile, so `--convert-to` exports always carry a fresh TOC. Assignments are stored in the profile registry, so they can be shipped with the golden profile.

### Debugging

Errors surface as a dialog in the GUI and as a stack trace on stderr in headless mode. The **APSO** extension (Alternative Python Script Organizer) adds an editor and console inside LibreOffice, which makes iterating on macros far faster. For logging, write to a file: `open("/tmp/macro.log", "a").write(...)`; `print()` goes nowhere in the GUI.

### Macro security

Tools → Options → LibreOffice → Security → Macro Security has four levels: Low (run everything), Medium (ask), High (only signed or from trusted locations), Very High (only trusted locations). Scripts in the profile's `Scripts/python` folder are **trusted locations** and always run; scripts embedded in documents are subject to the level. Headless mode cannot answer the "ask" dialog, so document macros silently do not run at Medium; that is a feature when processing untrusted uploads and a trap when you expected them to.

| Need | Best mechanism |
|---|---|
| Change every converted document the same way | Profile macro bound to Open Document |
| One-off scripted transformation | External UNO client |
| Logic bundled in a template for desktop users | Document macro in `.ott` (ODF), signed |
| High throughput service | External UNO via unoserver, not macros |

> **Tip:** Keep macros thin: locate the document, call a function from a normal Python package installed for LibreOffice's interpreter (`<install>/program/python -m pip install …` on Windows/macOS, `python3-pip` for `python3-uno` on Debian), and return. Thin macros are testable outside LibreOffice.

### Try It Yourself

```python
# ~/.config/libreoffice/4/user/Scripts/python/sop.py
# Run: soffice --headless sop.docx 'vnd.sun.star.script:sop.py$stamp_and_export?language=Python&location=user'
import uno, datetime
from com.sun.star.beans import PropertyValue
def pv(n, v): p = PropertyValue(); p.Name = n; p.Value = v; return p

def stamp_and_export(*args):
    doc = XSCRIPTCONTEXT.getDocument()
    # 1. replace a placeholder with today's date
    rd = doc.createReplaceDescriptor(); rd.SearchString = "{{date}}"
    rd.ReplaceString = datetime.date.today().strftime("%d %B %Y"); doc.replaceAll(rd)
    # 2. refresh indexes and fields
    idx = doc.getDocumentIndexes()
    for i in range(idx.getCount()): idx.getByIndex(i).update()
    doc.getTextFields().refresh()
    # 3. export PDF/A-2b with bookmarks next to the source
    fd = uno.Any("[]com.sun.star.beans.PropertyValue", (pv("SelectPdfVersion", 2), pv("ExportBookmarks", True)))
    doc.storeToURL(doc.getURL().rsplit(".", 1)[0] + ".pdf", (pv("FilterName", "writer_pdf_Export"), pv("FilterData", fd)))
    with open("/tmp/sop-macro.log", "a") as fh: fh.write(f"{doc.getURL()} pages={doc.getCurrentController().PageCount}\n")
    doc.close(True)
    XSCRIPTCONTEXT.getDesktop().terminate()

g_exportedScripts = (stamp_and_export,)
```

### Quiz

1. Which object gives a Python macro access to the current document?
- [ ] `uno.getDocument()`
- [x] `XSCRIPTCONTEXT.getDocument()`
- [ ] `desktop.getCurrentDocument()`
> `XSCRIPTCONTEXT` is injected into macro modules by the script provider.

2. Which URL runs a user Python macro headlessly?
- [ ] `macro:///docs.py$fn`
- [x] `vnd.sun.star.script:docs.py$fn?language=Python&location=user`
- [ ] `python://docs.py`
> The `macro:///` form is for Basic; Python needs the `vnd.sun.star.script:` scheme.

3. Why do document-embedded macros not run during headless conversion at Medium security?
- [ ] Headless mode disables Python
- [x] The "allow macros?" prompt cannot be answered, so they are skipped
- [ ] They run but silently
> Profile scripts are trusted locations and always run; document macros depend on the security level.

### Exercises

1. **Bind to Open Document** — Describe how to make every document opened on the conversion profile refresh its indexes automatically.
<details><summary>Solution</summary>

```text
Tools → Customize → Events → select "Open Document" → Macro… → My Macros → docs → refresh_indexes
→ Save In: LibreOffice (application scope) → OK. The binding is stored in the profile and applies to
--convert-to runs using that profile. Put only the update logic in refresh_indexes (no export/terminate).
```

</details>

2. **Log page counts** — Add to `stamp_and_export` a check that logs a warning if the page count differs from an expected number passed via an environment variable.
<details><summary>Solution</summary>

```python
import os
expected = int(os.environ.get("EXPECTED_PAGES", "0"))
pages = doc.getCurrentController().PageCount
if expected and pages != expected:
    open("/tmp/sop-macro.log", "a").write(f"WARNING {doc.getURL()} expected {expected} got {pages}\n")
```

</details>

### Interview Questions

**Q: Macro inside LibreOffice or external UNO client: how do you choose?**
An external client, usually behind unoserver, is my default for services: it runs in my own Python environment, is testable, and scales with worker processes. Macros win when the behaviour must apply to every document a given installation opens, such as auto-refreshing indexes on the conversion profile via the Open Document event, or when the customer's desktop users need a button in a template. I keep macros thin wrappers around importable functions so the logic is unit-tested outside LibreOffice either way.

**Q: How do you run a Python macro headlessly with parameters?**
Invoke `soffice --headless <file> 'vnd.sun.star.script:lib.py$func?language=Python&location=user'`, which opens the file and runs the macro with it as the current document. Because the URL takes no arguments, I pass parameters through environment variables or a JSON file path the macro reads, and I make the macro close the document and call `desktop.terminate()` so the process exits cleanly. The macro must live in a trusted location, the profile's Scripts folder, so macro security cannot block it.

**Q: What are the risks of macros in a conversion service and how do you contain them?**
Untrusted uploads can carry document macros, in VBA or LibreOffice Basic, designed to run on open. The containment is macro security at High or Very High on the service profile, never lowering it to run customer macros, plus running LibreOffice as an unprivileged user in a container without network access. My own macros live only in the profile's trusted Scripts folder, which is baked into the image, and they never execute anything derived from document content.

## unoserver/unoconv & long-running services

Starting `soffice` per job costs seconds; keeping one instance alive and sending it documents costs milliseconds. Several projects package that idea. **unoconv** was the classic; it is unmaintained and increasingly broken with modern LibreOffice. **unoserver** is its maintained successor from the same author, and it is what you should deploy. Alternatives include JODConverter (Java), Gotenberg (Docker HTTP API) and Collabora Online for browser-based editing.

### unoserver architecture

`unoserver` starts a `soffice` process with a UNO socket and exposes an **XML-RPC** interface; `unoconvert` is the client CLI that sends a file and receives the converted bytes. Because the client talks XML-RPC, it does not need `python3-uno`; only the server does.

```bash
# On the server (needs LibreOffice's Python for the uno module)
sudo apt-get install -y libreoffice python3-uno python3-pip
pip install unoserver                     # into the system python that has uno
unoserver --interface 127.0.0.1 --port 2003 --uno-interface 127.0.0.1 --uno-port 2002 \
          --user-installation /var/lib/unoserver/profile &
```

```bash
# Anywhere with network access to port 2003
unoconvert --host 127.0.0.1 --port 2003 --convert-to pdf report.docx out/report.pdf
unoconvert --host 127.0.0.1 --port 2003 --convert-to pdf --filter writer_pdf_Export \
           --filter-option SelectPdfVersion=2 --filter-option UseTaggedPDF=true manual.docx out/manual.pdf
unoconvert --host 127.0.0.1 --port 2003 --convert-to xlsx --input-filter "Calc MS Excel 2007 XML" data.xlsx out/data.xlsx
```

unoserver 2.x also offers `unocompare` (document compare) and `--host-location` options (`auto`, `remote`, `local`) that decide whether file paths are read by the server or streamed by the client.

### Python client

```python
from unoserver.client import UnoClient
client = UnoClient(server="127.0.0.1", port="2003", host_location="local")
client.convert(inpath="report.docx", outpath="out/report.pdf", convert_to="pdf",
               filter_options=["SelectPdfVersion=2", "ExportBookmarks=true"])
# Or in memory:
with open("report.docx", "rb") as fh:
    pdf_bytes = client.convert(indata=fh.read(), convert_to="pdf")
```

`convert()` returns bytes when `outpath` is omitted, which is what a web service wants.

### Running it as a service

```ini
# /etc/systemd/system/unoserver.service
[Unit]
Description=unoserver (LibreOffice conversion)
After=network.target

[Service]
User=unoserver
Environment=HOME=/var/lib/unoserver
ExecStart=/usr/bin/python3 -m unoserver.server --interface 127.0.0.1 --port 2003 --uno-port 2002 --user-installation /var/lib/unoserver/profile
Restart=always
RestartSec=5
TimeoutStopSec=30
MemoryMax=2G

[Install]
WantedBy=multi-user.target
```

`Restart=always` handles the inevitable LibreOffice crash; `MemoryMax` stops a leaking instance from taking the host down. A health check is a tiny conversion of a known DOCX every minute; if it exceeds a timeout, restart the unit.

### Scaling

One unoserver serves one conversion at a time. For parallelism run N instances on different ports with different `--user-installation` directories, and put a queue in front (Celery, RQ, or a simple pool in your API). Rule of thumb: one instance per core, recycle each instance after a few hundred conversions or when RSS exceeds a limit, because memory grows with document complexity.

```python
import itertools, random
PORTS = [2003, 2004, 2005, 2006]
rr = itertools.cycle(PORTS)
def convert_bytes(data, to="pdf", tries=2):
    for _ in range(tries):
        port = next(rr)
        try:
            return UnoClient(server="127.0.0.1", port=str(port)).convert(indata=data, convert_to=to)
        except Exception as e:
            last = e
    raise last
```

### unoconv, JODConverter, Gotenberg

| Tool | Language | Status | Notes |
|---|---|---|---|
| unoconv | Python | Unmaintained (last release 2019) | Breaks with newer LibreOffice; avoid for new work |
| unoserver | Python | Active | XML-RPC, filters and filter options, in-memory conversion |
| JODConverter | Java | Active | Process pool management, Spring integration, REST sample |
| Gotenberg | Go + Docker | Active | HTTP API (`POST /forms/libreoffice/convert`), also Chromium HTML→PDF; easiest drop-in container |
| Collabora Online / CODE | C++ | Active | Browser editing and a conversion endpoint (`/cool/convert-to/pdf`) |

Gotenberg example:

```bash
docker run --rm -p 3000:3000 gotenberg/gotenberg:8
curl -o out/report.pdf -F files=@report.docx -F pdfa=PDF/A-2b http://localhost:3000/forms/libreoffice/convert
```

### Timeouts and poison documents

A malformed document can hang LibreOffice forever. Every client call needs a timeout; on timeout, restart the affected instance, mark the document as poisonous, and do not retry it more than once. Log the document hash so a repeat offender is recognised instantly.

> **Interview note:** The question "how do you scale document conversion?" is answered with three words: pool, queue, recycle. One instance per core with separate profiles, a queue that assigns jobs and enforces timeouts, and instances recycled on memory or count thresholds.

### Try It Yourself

```bash
# Start one unoserver, convert three ways (CLI file, CLI with PDF/A option, Python in-memory), then stop it.
unoserver --interface 127.0.0.1 --port 2003 --uno-port 2002 --user-installation /tmp/unoserver-profile &
UNOPID=$!
sleep 6
mkdir -p out
unoconvert --host 127.0.0.1 --port 2003 --convert-to pdf report.docx out/report.pdf
unoconvert --host 127.0.0.1 --port 2003 --convert-to pdf --filter writer_pdf_Export --filter-option SelectPdfVersion=2 report.docx out/report-pdfa.pdf
python3 - <<'PY'
from unoserver.client import UnoClient
data = open("report.docx", "rb").read()
pdf = UnoClient(server="127.0.0.1", port="2003").convert(indata=data, convert_to="pdf")
open("out/report-mem.pdf", "wb").write(pdf); print("in-memory bytes:", len(pdf))
PY
ls -l out/; kill $UNOPID
```

### Quiz

1. Why is unoserver preferred over unoconv today?
- [ ] It is written in Go
- [x] unoconv is unmaintained and breaks with modern LibreOffice; unoserver is its maintained successor
- [ ] unoconv cannot produce PDF
> Same author, modern architecture with an XML-RPC server and a thin client.

2. How many conversions can one unoserver instance run at a time?
- [x] One
- [ ] One per CPU core
- [ ] Unlimited
> Parallelism comes from multiple instances on different ports and profiles.

3. Which client requirement does unoserver remove compared with raw UNO?
- [ ] The need for LibreOffice on the server
- [x] The need for the `uno` module on the client
- [ ] The need for fonts
> The client speaks XML-RPC; only the server process imports `uno`.

### Exercises

1. **Health check** — Write a bash health check for unoserver that converts a reference DOCX with a 30-second timeout and exits non-zero on failure.
<details><summary>Solution</summary>

```bash
#!/usr/bin/env bash
out=$(mktemp --suffix=.pdf)
if timeout 30 unoconvert --host 127.0.0.1 --port 2003 --convert-to pdf /opt/ref/health.docx "$out" && [ -s "$out" ]; then
  rm -f "$out"; exit 0
else
  rm -f "$out"; echo "unoserver unhealthy" >&2; exit 1
fi
```

</details>

2. **Pool config** — Write systemd unit names and ports for a four-instance pool and the flag that keeps their profiles separate.
<details><summary>Solution</summary>

```text
unoserver@2003.service … unoserver@2006.service (template unit with %i as the port)
ExecStart=… --port %i --uno-port $((%i + 1000))  → implement via a wrapper script since systemd cannot do arithmetic
--user-installation /var/lib/unoserver/profile-%i   ← separate profile per instance
```

</details>

### Interview Questions

**Q: Describe a production architecture for converting uploaded documents to PDF.**
An API accepts the upload, stores it, and enqueues a job. Workers pull jobs and call a pool of unoserver instances, one per core, each with its own profile and port, through the XML-RPC client with a timeout. Successful output goes to object storage and a QA step checks page count and text; failures are retried once on another instance, then quarantined with the file hash recorded. Instances run as an unprivileged user in containers with fonts baked in, are health-checked by a reference conversion, and are recycled on memory or job-count thresholds. Metrics track conversions per minute, p95 latency and failure rate per input type.

**Q: What are the trade-offs between unoserver, Gotenberg and JODConverter?**
unoserver is minimal and Pythonic: a server, a client, filter options; you own the pooling and supervision. Gotenberg is the fastest to deploy, a single container with an HTTP API that also renders HTML through Chromium, but its LibreOffice options are limited to what the API exposes. JODConverter brings a mature process pool and Spring integration for Java shops. I pick unoserver for Python stacks where I need specific filter options, Gotenberg when a team needs a conversion box today with no code, and JODConverter in JVM environments.

**Q: How do you handle a document that hangs LibreOffice?**
Timeouts at the client, always. On timeout the worker kills or restarts the instance, because a hung LibreOffice does not recover, and records the input's hash with a poison flag so it is retried at most once on a different instance. The API returns a clear failure for that file while the rest of the queue continues. Investigating poison files offline usually reveals corrupt embedded objects or gigantic images, which I then handle by pre-processing rules.

## Fidelity issues (tracked changes, fields, numbering, SmartArt) & workarounds

"Converted fine" and "matches Word" are different standards. This chapter catalogues the differences you will actually see between a Word-produced PDF and a LibreOffice-produced PDF of the same DOCX, what causes them, and the workaround for each. Most fixes are applied to the **source document** in the generator, not to LibreOffice.

### Tracked changes and comments

LibreOffice honours the document's "show changes" state: if tracked changes are visible in Word, the PDF shows insertions underlined, deletions struck through, and change bars, exactly like Word's "All Markup" print. Comments are exported as PDF annotations only when `ExportNotes` is set. Workaround for a clean PDF: accept all changes and delete comments before export, either in the generator (python-docx does not accept changes natively; strip `w:ins`/`w:del` with lxml) or via UNO dispatch `.uno:AcceptAllTrackedChanges` and `.uno:DeleteAllNotes`.

```python
# Accept tracked changes at XML level: keep insertions, drop deletions
from docx import Document
from docx.oxml.ns import qn
doc = Document("draft.docx")
body = doc.element.body
for ins in list(body.iter(qn("w:ins"))):
    parent = ins.getparent(); idx = parent.index(ins)
    for child in list(ins): parent.insert(idx, child); idx += 1
    parent.remove(ins)
for dele in list(body.iter(qn("w:del"))):
    dele.getparent().remove(dele)
doc.save("clean.docx")
```

### Fields

| Field | LibreOffice behaviour | Workaround |
|---|---|---|
| `PAGE`, `NUMPAGES`, `SECTIONPAGES` | Correct, computed at layout | none |
| `TOC` | Cached entries kept; not refreshed | UNO `update()` or regenerate in generator |
| `DATE`, `TIME` | Refreshed on load (shows conversion date) | Use `CREATEDATE` or a literal |
| `REF`, `PAGEREF` | Kept; page refs refresh on update | UNO update |
| `STYLEREF` | Supported in headers/footers | Test dictionary-style headers |
| `DOCPROPERTY` | Maps to DocInformation; custom props supported | Set properties in generator |
| `MERGEFIELD` | Shows the field result (placeholder text) | Complete the merge before conversion |
| `IF`, `ASK`, `FILLIN` | Static result only | Avoid |
| `INCLUDEPICTURE` | Needs the path on the server | Embed images |

### Numbering and lists

The classic symptom: a numbered list that restarts at 1 in Word continues from a previous list in LibreOffice, or heading numbers shift. Causes: Word's `w:numId` overrides with `w:lvlOverride/w:startOverride`, lists that share an abstract numbering, and legacy `w:legacy` settings. Workarounds: use distinct `numId` instances per list in the generator; for headings, define numbering on the Heading styles (outline numbering) rather than ad-hoc lists; check Tools → Heading Numbering after import. Bullet glyphs depend on Symbol/Wingdings; install them or map to `OpenSymbol` via fontconfig alias to avoid empty boxes.

### SmartArt, WordArt, charts, OLE

SmartArt is a DrawingML diagram (`word/diagrams/*.xml`). LibreOffice imports the diagram's drawing fallback and renders it as a group of shapes, usually close but sometimes with overlapping text; editing is lost. WordArt becomes Fontwork or plain text. Native charts import via the chart module and render well for standard types; combo charts and some formatting differ. Embedded Excel/Visio OLE objects render from their stored preview image. Workaround for all: replace with a picture (PNG at 300 DPI) in the generator, keeping the source diagram in a separate file. For charts generated by code, render with matplotlib and insert as an image.

### Tables

Word's autofit and "preferred width" semantics differ subtly; a table with `w:tblW w:type="auto"` may expand differently. Set explicit column widths (`w:gridCol` and `w:tcW` in dxa) and disable autofit (`w:tblLayout w:type="fixed"`). Repeating header rows, merged cells and cell shading convert well; "allow row to break across pages" is honoured.

### Text boxes, frames and anchoring

Word text boxes become Writer frames. Anchored "to paragraph" with wrap settings converts well; "in front of text" with absolute positioning relative to page margins is usually fine; linked text boxes (text flowing between boxes) are not supported and show truncated text. Workaround: avoid linked boxes; use a two-column section instead.

### Compatibility options and line breaking

Word documents carry compatibility settings (`w:compat`, `w:compatSetting w:name="compatibilityMode" w:val="15"`). LibreOffice maps many to its own compatibility options (Tools → Options → Writer → Compatibility), including "Use printer metrics", "Add spacing between paragraphs and tables", and "Do not justify lines with a manual line break". Differences in hyphenation dictionaries and kerning also move line breaks by a word here and there. With matched fonts the page count is normally identical; a one-word difference at a page boundary is the residual risk, which is why QA compares page counts and flags anything over a tolerance.

### Headers, footers and section behaviour

Different first page and odd/even headers convert to page-style options. Section breaks "continuous" with different columns are supported. A Word section that changes page orientation mid-page cannot exist, but "next page" orientation changes work. Page numbering restarts map to page-style breaks with an offset.

### Fonts and symbols

Beyond the Intermediate chapter: Symbol-font bullets, Wingdings check marks and private-use characters need the actual fonts or a mapping; East Asian and complex-text layouts (Urdu, Arabic) need fonts with those scripts (Noto Naskh Arabic, Noto Nastaliq Urdu) and correct language tagging in the DOCX for shaping and hyphenation.

> **Warning:** Never "fix" a fidelity issue by editing the DOCX in LibreOffice and saving it back. You trade one engine's quirks for another's. Fix the generator or the source template, then re-render.

### Try It Yourself

```python
# Pre-flight a DOCX for known fidelity risks before sending it to LibreOffice.
import zipfile, re, sys
path = sys.argv[1] if len(sys.argv) > 1 else "draft.docx"
z = zipfile.ZipFile(path)
names = z.namelist()
doc = z.read("word/document.xml").decode("utf8", "ignore")
risks = []
if "<w:ins " in doc or "<w:del " in doc: risks.append("tracked changes present → accept before export")
if any(n.startswith("word/comments") for n in names): risks.append("comments present → export or delete")
if any(n.startswith("word/diagrams/") for n in names): risks.append("SmartArt present → expect static rendering")
if any(n.startswith("word/embeddings/") for n in names): risks.append("OLE embeddings → preview image only")
if "txbxContent" in doc and "w:linkedTxbx" in doc: risks.append("linked text boxes → unsupported")
if re.search(r'w:instrText[^>]*>\s*(DATE|TIME)\b', doc): risks.append("DATE/TIME fields → will show conversion date")
if re.search(r'w:instrText[^>]*>\s*TOC\b', doc): risks.append("TOC field → refresh via UNO before export")
if 'w:tblW w:w="0" w:type="auto"' in doc: risks.append("auto-width tables → set fixed widths")
fonts = set(re.findall(r'w:ascii="([^"]+)"', doc))
print("fonts used:", sorted(fonts))
print("\n".join(risks) if risks else "no known risks detected")
```

### Quiz

1. How does LibreOffice render a DOCX whose tracked changes are visible?
- [ ] It silently accepts them
- [x] As markup (underlines, strikethrough, change bars), like Word's All Markup print
- [ ] It refuses to export
> Accept changes before export for a clean PDF.

2. What happens to a `DATE` field on conversion?
- [ ] It keeps the value from Word
- [x] It refreshes to the conversion date
- [ ] It becomes empty
> Use `CREATEDATE` or a literal date in generated documents.

3. What is the recommended workaround for SmartArt?
- [ ] Convert with a newer LibreOffice
- [x] Replace it with a high-resolution picture in the source document
- [ ] Export to ODT first
> Diagram rendering is approximate and non-editable; a picture is deterministic.

### Exercises

1. **Fixed table widths** — Show the OOXML needed to make a two-column table render identically in Word and LibreOffice.
<details><summary>Solution</summary>

```xml
<w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr>
<w:tblGrid><w:gridCol w:w="3120"/><w:gridCol w:w="6240"/></w:tblGrid>
<!-- every cell: --><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr>
```

</details>

2. **List restart** — Explain in three lines why a numbered list continues instead of restarting, and the generator-side fix.
<details><summary>Solution</summary>

```text
Both lists reference the same w:numId, so LibreOffice treats them as one list and continues numbering.
Word restarts because of a w:lvlOverride/w:startOverride that LibreOffice maps imperfectly.
Fix: create a new w:num (new numId) per list in numbering.xml and reference it; do not rely on overrides.
```

</details>

### Interview Questions

**Q: What are the most common fidelity differences between Word and LibreOffice PDFs and how do you prevent them?**
Fonts first, solved with metric-compatible fonts; then stale fields and TOCs, solved with a UNO refresh or by generating correct caches; tracked changes and comments rendering as markup, solved by accepting and deleting before export; list numbering continuing or restarting wrongly, solved by distinct numbering instances in the generator; SmartArt, WordArt and OLE rendering approximately, solved by replacing them with images; and auto-width tables, solved with fixed layouts. I run a pre-flight script that inspects the DOCX for each of these before conversion and I fix the source rather than editing in LibreOffice.

**Q: A client's SOP shows the heading numbers off by one after conversion. What do you do?**
I check whether the headings use outline numbering on the Heading styles or an ad-hoc multilevel list. Word documents built by hand often mix both, and LibreOffice maps the list overrides imperfectly. The durable fix is in the template: attach numbering to the Heading styles once, remove per-paragraph overrides, and regenerate. For a one-off I can open the file, set Tools → Heading Numbering, and export, but I tell the client that the template is the real problem so the next SOP does not repeat it.

**Q: How do you handle DATE fields and mail-merge placeholders in generated documents?**
`DATE` and `TIME` refresh on load, so the PDF shows the conversion date instead of the issue date; I use `CREATEDATE`, a `DOCPROPERTY`, or write the date as text in the generator. `MERGEFIELD` shows its placeholder result, so the merge must be completed before conversion, which for my pipelines means the generator writes final text, not fields. Fields that remain are page numbers, page counts and cross-references, which LibreOffice computes correctly after an update.

## Comparing outputs (Word vs LibreOffice PDF)

Fidelity claims need evidence. When a client asks "does the server PDF match what Word produces?", you should be able to answer with numbers: same page count, identical text, fonts embedded, and a visual diff of any page that differs. This chapter builds that comparison toolkit with poppler-utils, pdfplumber, PyMuPDF and ImageMagick.

### Level 1: metadata and page count

```bash
pdfinfo word/manual.pdf | grep -E 'Pages|Page size|Producer'
pdfinfo lo/manual.pdf   | grep -E 'Pages|Page size|Producer'
pdffonts word/manual.pdf > word-fonts.txt; pdffonts lo/manual.pdf > lo-fonts.txt; diff word-fonts.txt lo-fonts.txt
```

Different page counts mean reflow, almost always fonts or a stale TOC. Different page sizes mean a page-style or printer-paper issue (Letter versus A4 defaults in the profile locale).

### Level 2: text comparison

```bash
pdftotext -layout word/manual.pdf word.txt
pdftotext -layout lo/manual.pdf lo.txt
diff -u word.txt lo.txt | head -50
```

`-layout` keeps columns, which surfaces table reflow. Expect small differences in whitespace and ligatures; normalise before comparing in a script:

```python
import pdfplumber, difflib, re
def pages_text(path):
    with pdfplumber.open(path) as pdf:
        return [re.sub(r"\s+", " ", (p.extract_text() or "")).strip() for p in pdf.pages]
a, b = pages_text("word/manual.pdf"), pages_text("lo/manual.pdf")
print("pages:", len(a), len(b))
for i, (x, y) in enumerate(zip(a, b), 1):
    if x != y:
        ratio = difflib.SequenceMatcher(None, x, y).ratio()
        print(f"page {i}: similarity {ratio:.3f}")
        if ratio < 0.98:
            for line in difflib.unified_diff(x.split(". "), y.split(". "), lineterm="", n=0): print("   ", line[:120])
```

A per-page similarity ratio under about 0.98 usually marks a real difference; a whole-page mismatch after a certain page marks a reflow point.

### Level 3: visual diff

Rasterise both PDFs at a modest DPI and compare pixels.

```bash
pdftoppm -r 60 -png word/manual.pdf cmp/word
pdftoppm -r 60 -png lo/manual.pdf   cmp/lo
for f in cmp/word-*.png; do
  n=${f#cmp/word-}
  compare -metric AE -fuzz 8% "$f" "cmp/lo-$n" "cmp/diff-$n" 2>>cmp/metrics.txt; echo " $n" >> cmp/metrics.txt
done
sort -n cmp/metrics.txt | tail -5      # pages with the most differing pixels
```

ImageMagick's `compare -metric AE` counts differing pixels; `-fuzz 8%` ignores anti-aliasing noise. The generated `diff-*.png` images highlight differences in red, which is exactly what you attach to a client report. In Python, PyMuPDF renders pages (`page.get_pixmap(dpi=60)`) and Pillow's `ImageChops.difference` gives the same result without ImageMagick.

```python
import pymupdf
from PIL import Image, ImageChops
def render(path, i, dpi=60):
    pix = pymupdf.open(path)[i].get_pixmap(dpi=dpi)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
for i in range(min(len(a), len(b))):
    d = ImageChops.difference(render("word/manual.pdf", i), render("lo/manual.pdf", i)).convert("L")
    changed = sum(1 for px in d.getdata() if px > 40)
    if changed > 500: print(f"page {i+1}: {changed} changed pixels")
```

### Level 4: structural checks

For deliverables with requirements beyond looks:

| Requirement | Check |
|---|---|
| Bookmarks present | `pdfplumber`: `pdf.outline` (PyMuPDF `doc.get_toc()`), compare titles/levels |
| Tagged/PDF-UA | `pdfinfo` shows `Tagged: yes`; PAC or veraPDF for conformance |
| PDF/A | `verapdf --flavour 2b` |
| Fonts embedded | `pdffonts` column `emb` all `yes` |
| Links work | PyMuPDF `page.get_links()` count and URIs |
| Form fields | PyMuPDF `page.widgets()` names |

### Producing the Word reference

You need a Word-produced PDF to compare against. Options: ask the client to "Save as PDF" in Word (the best reference), use a Windows VM with Word and `docx2pdf` (Python, drives Word via COM), or Microsoft Graph's `/content?format=pdf` conversion on OneDrive/SharePoint. Store references in version control next to the source DOCX, named with the Word version used.

### Reporting

A comparison report a client can read:

```text
manual.docx — LibreOffice 24.8.4 vs Word 365 (2026-09)
Pages: 42 / 42          Fonts: Carlito, Caladea, Liberation Sans (all embedded)
Text similarity: 41 pages ≥ 0.995, page 17: 0.982 (hyphenation of "reconciliation")
Visual diff: max 1,240 px on page 17 (line break); all other pages < 200 px
Bookmarks: 58 / 58 match          PDF/A-2b: pass (veraPDF)
Verdict: acceptable; page 17 line break differs, no content change
```

> **Tip:** Tolerances belong in code, not in judgement calls. Encode "page count equal, per-page similarity ≥ 0.98, changed pixels < 1,500 at 60 DPI" as assertions, and the same script becomes the automated QA of the Expert level.

### Try It Yourself

```python
# One-file comparison tool: page counts, per-page text similarity, pixel differences, bookmarks.
import sys, re, difflib, pymupdf
from PIL import Image, ImageChops
ref, out = sys.argv[1:3] if len(sys.argv) > 2 else ("word/manual.pdf", "lo/manual.pdf")
A, B = pymupdf.open(ref), pymupdf.open(out)
print(f"pages: {len(A)} vs {len(B)}")
norm = lambda s: re.sub(r"\s+", " ", s).strip()
worst = []
for i in range(min(len(A), len(B))):
    ta, tb = norm(A[i].get_text()), norm(B[i].get_text())
    sim = difflib.SequenceMatcher(None, ta, tb).ratio()
    pa, pb = (p.get_pixmap(dpi=60) for p in (A[i], B[i]))
    ia, ib = (Image.frombytes("RGB", (p.width, p.height), p.samples) for p in (pa, pb))
    if ia.size != ib.size: px = 10**6
    else: px = sum(1 for v in ImageChops.difference(ia, ib).convert("L").getdata() if v > 40)
    worst.append((sim, px, i + 1))
    if sim < 0.98 or px > 1500: print(f"page {i+1}: text sim {sim:.3f}, changed px {px}")
print("bookmarks:", len(A.get_toc()), "vs", len(B.get_toc()))
print("min similarity:", min(worst)[0] if worst else None, "max px:", max(w[1] for w in worst) if worst else None)
sys.exit(0 if len(A) == len(B) and all(s >= 0.98 and p <= 1500 for s, p, _ in worst) else 1)
```

### Quiz

1. Which check first tells you that reflow happened?
- [ ] `pdffonts`
- [x] Page count from `pdfinfo`
- [ ] Bookmark count
> Different page counts mean lines wrapped differently; fonts are the usual cause.

2. Why normalise whitespace before comparing extracted text?
- [ ] To make the diff faster
- [x] Different engines emit different spacing and line breaks for identical content
- [ ] pdfplumber requires it
> Without normalisation every page differs trivially and real differences are hidden.

3. What does `compare -metric AE -fuzz 8%` measure?
- [ ] Average colour
- [x] Number of pixels differing beyond an 8 percent tolerance
- [ ] File size difference
> AE is absolute error count; fuzz suppresses anti-aliasing noise.

### Exercises

1. **Bookmark diff** — Print bookmark titles present in the Word PDF but missing in the LibreOffice PDF.
<details><summary>Solution</summary>

```python
ta = {t for _, t, _ in A.get_toc()}; tb = {t for _, t, _ in B.get_toc()}
print("missing in LibreOffice PDF:", sorted(ta - tb))
```

</details>

2. **Reference generation** — Give a Python snippet that creates the Word reference PDF on a Windows machine.
<details><summary>Solution</summary>

```python
from docx2pdf import convert      # pip install docx2pdf; requires Microsoft Word installed (Windows/macOS)
convert("manual.docx", "word/manual.pdf")
```

</details>

### Interview Questions

**Q: How do you prove to a client that the server-generated PDF matches Word's?**
With a comparison script and a short report. I obtain a Word-produced reference, then compare page counts and sizes, embedded fonts, per-page normalised text similarity, per-page pixel differences at low DPI with highlighted diff images, and structural items such as bookmarks or PDF/A conformance. The report lists any page under the similarity or pixel threshold with the cause, usually a hyphenation or line-break difference. Having this in code means every LibreOffice upgrade or font change is re-verified automatically against the same references.

**Q: What tolerances do you use and why not demand identical output?**
Identical output is impossible across engines: different hyphenation dictionaries, kerning, and image compression guarantee some pixel differences even with metric-compatible fonts. I require equal page counts, per-page text similarity at or above 0.98 after whitespace normalisation, and fewer than about 1,500 changed pixels per page at 60 DPI, tuned per document class. Anything outside is reviewed by a human with the diff image. These numbers catch reflow, missing content and font substitution while ignoring noise.

**Q: Where does a Word reference PDF come from in a Linux-only pipeline?**
From outside the pipeline: the client saves as PDF from Word, a Windows build agent runs `docx2pdf` against Word, or Microsoft Graph converts the file from SharePoint. References are generated once per template revision, stored beside the source with the Word version noted, and used as fixtures for the comparison tests. Day-to-day conversions never need Word; only the reference set does.

