---
id: docx-js
title: docx (docx-js for Node & browser)
icon: 📄
track: Document Engineering
color: #1E5AA8
runner: js
libs: docx
tagline: Generate Word documents from JavaScript, in Node or right in the browser.
description: The docx npm library (v8/v9 API) from first document to expert template engineering: Document/Section/Paragraph/TextRun, styles, numbering, tables, images, headers and footers, page numbers, TOC fields, tabs, fonts, and building reusable branded generators in Node and the browser.
---

# LEVEL: Beginner

## Installing docx & your first document

`docx` is an npm library that builds real `.docx` files (the Office Open XML format that Microsoft Word reads) from plain JavaScript objects. You never touch XML. You describe a document as a tree of `Document` → sections → `Paragraph` → `TextRun`, and a `Packer` turns that tree into a zip file with the right parts inside.

Install it like any other package:

```bash
npm install docx
```

The library ships both a CommonJS build for Node and an ES-module/browser build, so the same code runs on a server, in a Fiverr client's Electron app, or inside a web page. In this course the browser build is preloaded as the global `docx`, and a helper `download(blob, filename)` saves whatever you generate.

### The smallest useful document

```js
const { Document, Packer, Paragraph, TextRun } = docx;

const doc = new Document({
  creator: "Ali Raza",
  title: "First document",
  sections: [
    {
      children: [
        new Paragraph({
          children: [new TextRun("Hello from docx.")],
        }),
      ],
    },
  ],
});
```

Read it from the outside in:

- `Document` is the root. It takes metadata (`creator`, `title`, `description`) and an array of **sections**.
- A **section** is a run of pages that share page size, margins, headers and footers. Most documents have one section.
- `children` of a section are block-level items: `Paragraph` and `Table` (and a few field types like `TableOfContents`).
- A `Paragraph` holds inline **runs**. `TextRun` is a piece of text with one set of formatting.

Nothing is written to disk until you pack the document.

### Packing

`Packer` has static methods that return a Promise of the finished file in different containers:

| Method | Returns | Use it in |
|---|---|---|
| `Packer.toBuffer(doc)` | Node `Buffer` | Node scripts, Express responses |
| `Packer.toBlob(doc)` | `Blob` | Browser downloads |
| `Packer.toBase64String(doc)` | base64 string | Email attachments, JSON APIs |
| `Packer.toStream(doc)` | Node `Readable` | Streaming large files |
| `Packer.toArrayBuffer(doc)` | `ArrayBuffer` | v9+, universal |

In Node the classic ending is:

```js
const fs = require("fs");
Packer.toBuffer(doc).then((buffer) => fs.writeFileSync("first.docx", buffer));
```

In the browser you convert to a `Blob` and trigger a download. Because every Packer method is asynchronous, remember to `await` it.

> **Tip:** A `.docx` file is just a zip. If you ever want to see what docx generated, rename the file to `.zip`, extract it, and open `word/document.xml`. Every option you learn in this course maps to an element in that file.

### Why generate instead of using a template?

Ali's Fiverr clients often want 20 or 30 near-identical documents: one policy manual per state, one letterhead per office, one weekly production report per branch. Editing them by hand is slow and inconsistent. With docx you write the layout once as code and feed it data. Version control shows exactly what changed between "v3" and "v4" of the template, and a rerun is seconds instead of a day.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun } = docx;

const doc = new Document({
  creator: "Ali Raza",
  title: "First document",
  sections: [
    {
      children: [
        new Paragraph({ children: [new TextRun("Hello from docx.")] }),
        new Paragraph({ children: [new TextRun("This file was generated in the browser.")] }),
      ],
    },
  ],
});

download(await docx.Packer.toBlob(doc), "first.docx");
console.log("Generated first.docx");
```

### Quiz

1. Which class is the root of every docx document tree?
- [x] `Document`
- [ ] `Section`
- [ ] `Paragraph`
> `Document` holds metadata plus the `sections` array; everything else nests inside it.

2. What does `Packer.toBlob(doc)` return?
- [ ] A `Blob` synchronously
- [x] A `Promise` that resolves to a `Blob`
- [ ] A base64 string
> Every `Packer` method is asynchronous because zipping happens off the main call.

3. A `.docx` file is really a…
- [ ] Binary Word 97 stream
- [x] Zip archive of XML parts
- [ ] Single XML file
> Office Open XML packages are zips; `word/document.xml` holds the body.

### Exercises

1. **Three paragraphs** — Generate a document with three paragraphs: your name, your city, and today's date as text.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph } = docx;
const lines = ["Ali Raza", "Lahore, Pakistan", new Date().toDateString()];
const doc = new Document({
  sections: [{ children: lines.map((t) => new Paragraph(t)) }],
});
download(await Packer.toBlob(doc), "three.docx");
```

</details>

2. **Metadata** — Set `creator`, `title` and `description` and confirm them in Word under File → Info.
<details><summary>Solution</summary>

```js
const doc = new docx.Document({
  creator: "Ali Raza",
  title: "Rate Matrix Cover",
  description: "Generated by the docx course",
  sections: [{ children: [new docx.Paragraph("Cover")] }],
});
download(await docx.Packer.toBlob(doc), "meta.docx");
```

</details>

### Interview Questions

**Q: What is the docx library and how does it differ from editing a Word file with a template engine like docxtemplater?**
docx builds a document from scratch as a JavaScript object tree and serialises it to Office Open XML, so the code is the single source of truth for layout, styles and content. docxtemplater instead opens an existing `.docx` designed in Word and replaces `{tags}` inside it. docx is better when you own the design and want everything reproducible from data, for example a suite of 21 branded templates generated from one config. docxtemplater is better when a client insists on a Word-designed layout that non-developers maintain. I usually combine them: docx for generated reports, docxtemplater or docx's own `patchDocument` for filling client-supplied letterheads.

**Q: Why are all Packer methods asynchronous?**
Packing means serialising the XML parts and compressing them into a zip with JSZip, and JSZip's generation API is Promise-based so it can yield in the browser instead of freezing the UI. Returning a Promise also lets the same API surface produce a Buffer, Blob, base64 string or stream depending on the environment. In practice you `await Packer.toBuffer(doc)` in Node or `await Packer.toBlob(doc)` in the browser and only then write or download the result.

**Q: Explain the Document → Section → Paragraph → TextRun hierarchy.**
`Document` is the package root and owns metadata, styles, numbering and sections. A section is a group of pages sharing page setup, headers and footers; Word's "section break" is exactly this boundary. Sections contain block content: paragraphs and tables. Paragraphs contain runs, and a `TextRun` is text with a single formatting set, so a bold word inside a normal sentence is three runs. Understanding this hierarchy explains why bold is a run property but alignment is a paragraph property, and why margins live on the section.

## Paragraphs, TextRun & formatting

A **paragraph** is the unit Word uses for alignment, spacing and indentation. A **run** is the unit for character formatting: bold, italics, colour, size, font. Every visible piece of text lives in a run inside a paragraph, so mastering these two classes is most of the day-to-day work.

### Paragraph shorthand versus children

For a plain line you can pass a string:

```js
new Paragraph("Weekly Production Report");
```

For anything formatted you pass `children`, an array of runs:

```js
const { Paragraph, TextRun } = docx;

new Paragraph({
  children: [
    new TextRun({ text: "Client: ", bold: true }),
    new TextRun("Stewart Title of Wyoming"),
    new TextRun({ text: " (draft)", italics: true, color: "888888" }),
  ],
});
```

Three runs produce one visual line: a bold label, plain text, grey italics. If you tried to put `bold: true` on the paragraph it would be ignored, because bold is a run property.

### The most used run options

| Option | Type | Example |
|---|---|---|
| `bold`, `italics`, `strike`, `allCaps`, `smallCaps` | boolean | `bold: true` |
| `underline` | object | `underline: { type: docx.UnderlineType.SINGLE }` |
| `color` | hex string, no `#` | `color: "1E5AA8"` |
| `size` | half-points | `size: 24` is 12 pt |
| `font` | string | `font: "Arial"` |
| `highlight` | named colour | `highlight: "yellow"` |
| `superScript`, `subScript` | boolean | footnote-style markers |
| `break` | number | `break: 1` inserts a line break before the text |

The half-point rule surprises everyone: Word stores font sizes as half-points, so 11 pt is `size: 22`. The same is true in styles later.

### Paragraph options

```js
const { AlignmentType } = docx;

new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 120, after: 120, line: 276 },
  indent: { left: 720, hanging: 360 },
  children: [new TextRun("Body text for a policy manual paragraph.")],
});
```

- `alignment`: `LEFT`, `CENTER`, `RIGHT`, `JUSTIFIED` (also `START`/`END`).
- `spacing.before`/`after` are in **twips** (twentieths of a point): 120 = 6 pt.
- `spacing.line` of 240 is single spacing, 276 is 1.15, 360 is 1.5, 480 is double.
- `indent` is also twips: 720 = 0.5 inch, 1440 = 1 inch. `hanging` pulls the first line back, which is how numbered lists look right.

Helpers `convertInchesToTwip(0.5)` and `convertMillimetersToTwip(12.7)` exist so you never multiply by 1440 by hand.

### Line breaks inside a paragraph

Word treats Enter as "new paragraph" and Shift+Enter as "line break within the paragraph". docx gives you both:

```js
new Paragraph({
  children: [
    new TextRun("Systems Limited"),
    new TextRun({ text: "Data Processing Team", break: 1 }),
    new TextRun({ text: "Lahore", break: 1 }),
  ],
});
```

This keeps an address block as one paragraph, so paragraph spacing does not open gaps between the lines. That is exactly how a letterhead address should be built.

> **Warning:** Do not put newline characters (`\n`) inside `text`. docx does not convert them; Word shows them as nothing or as a stray glyph. Use `break: 1` or separate paragraphs.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, AlignmentType, UnderlineType } = docx;

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "WEEKLY PRODUCTION REPORT", bold: true, size: 32, color: "1E5AA8" })],
      }),
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "Branch: ", bold: true }),
          new TextRun("Cheyenne, WY"),
          new TextRun({ text: "   Week ending: ", bold: true }),
          new TextRun({ text: "12 Sep 2026", underline: { type: UnderlineType.SINGLE } }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 276 },
        children: [
          new TextRun("Files opened this week rose to 148, a 6% increase over the prior week. "),
          new TextRun({ text: "Turnaround averaged 2.3 days.", italics: true }),
        ],
      }),
    ],
  }],
});

download(await docx.Packer.toBlob(doc), "formatting.docx");
console.log("Generated formatting.docx");
```

### Quiz

1. Which run option produces 14 pt text?
- [ ] `size: 14`
- [x] `size: 28`
- [ ] `fontSize: 14`
> Sizes are in half-points, so 14 pt is 28.

2. Where does `alignment` belong?
- [x] On the `Paragraph`
- [ ] On the `TextRun`
- [ ] On the `Document`
> Alignment is paragraph-level formatting in Word and in docx.

3. What does `spacing: { after: 240 }` mean?
- [ ] 240 pt after the paragraph
- [x] 12 pt after the paragraph
- [ ] 240 px after the paragraph
> Spacing is in twips; 240 twips = 12 pt.

### Exercises

1. **Address block** — Build a three-line letterhead address as a single paragraph using `break`.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun } = docx;
const doc = new Document({ sections: [{ children: [
  new Paragraph({ children: [
    new TextRun({ text: "Stewart Title of Wyoming", bold: true }),
    new TextRun({ text: "1620 Central Avenue", break: 1 }),
    new TextRun({ text: "Cheyenne, WY 82001", break: 1 }),
  ]}),
]}]});
download(await Packer.toBlob(doc), "address.docx");
```

</details>

2. **Hanging indent** — Create a paragraph with a 0.5" left indent and a 0.25" hanging indent using the helper functions.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, convertInchesToTwip } = docx;
const doc = new Document({ sections: [{ children: [
  new Paragraph({
    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
    text: "1. Agents must log every call within 15 minutes of completion, including calls that were not answered.",
  }),
]}]});
download(await Packer.toBlob(doc), "indent.docx");
```

</details>

### Interview Questions

**Q: Why does docx use half-points and twips instead of points and inches?**
Because those are the units Office Open XML itself uses: `w:sz` is in half-points and `w:spacing`, `w:ind` and page dimensions are in twentieths of a point. docx is a thin, faithful mapping over the XML rather than an abstraction, which means anything you read in the ECMA-376 spec or see in an unzipped `document.xml` translates directly. The library provides `convertInchesToTwip` and `convertMillimetersToTwip` for readability, and I usually wrap sizes in small helpers like `pt(11)` returning 22 so template code stays legible.

**Q: How would you render a sentence with one bold word?**
Split it into three `TextRun`s inside one `Paragraph`: the text before, the bold word with `bold: true`, and the text after. Runs are the unit of character formatting, so a mixed-format sentence is always several runs. In a data-driven generator I write a tiny helper that takes a string with markers like `**word**` and returns the run array, which keeps content files readable for non-developers.

**Q: What is the difference between a line break and a new paragraph, and when does it matter?**
A new paragraph gets its own spacing before and after, its own alignment and its own style, while a line break (`break: 1`, Shift+Enter in Word) just wraps inside the same paragraph. It matters for address blocks, signature blocks and poetry-style content where you do not want paragraph spacing between lines, and for numbered lists where a new paragraph would create a new number. Getting this wrong is the most common reason a generated letterhead looks "too airy" compared to the client's original.

## Headings & built-in styles

Word ships with a set of built-in paragraph styles: Title, Subtitle, Heading 1 through Heading 9, Normal, Quote, List Paragraph and so on. Using them instead of manually bolding text has three payoffs: the Navigation Pane works, the Table of Contents can be generated automatically, and the client can restyle the whole document by editing one style.

### Applying a heading

```js
const { Paragraph, HeadingLevel } = docx;

new Paragraph({ text: "1. Purpose", heading: HeadingLevel.HEADING_1 });
new Paragraph({ text: "1.1 Scope", heading: HeadingLevel.HEADING_2 });
new Paragraph({ text: "Employee Handbook", heading: HeadingLevel.TITLE });
```

`HeadingLevel` has `TITLE`, `HEADING_1` … `HEADING_6`. Under the hood this sets `w:pStyle w:val="Heading1"`; Word then supplies the look from its default style set.

### Changing what the built-ins look like

docx lets you override the default appearance of these styles through `styles.default`:

```js
const doc = new docx.Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } },
      heading1: {
        run: { font: "Calibri Light", size: 32, bold: true, color: "1E5AA8" },
        paragraph: { spacing: { before: 360, after: 120 }, keepNext: true },
      },
      heading2: {
        run: { font: "Calibri Light", size: 26, bold: true, color: "2E74B5" },
        paragraph: { spacing: { before: 240, after: 80 }, keepNext: true },
      },
      title: {
        run: { size: 56, bold: true, color: "1E5AA8" },
        paragraph: { alignment: docx.AlignmentType.CENTER, spacing: { after: 240 } },
      },
    },
  },
  sections: [/* … */],
});
```

`default.document` is the document default: every run inherits the font and size you set there unless a style or run overrides it. `heading1`…`heading6`, `title`, `listParagraph`, `hyperlink` and `footnoteReference` are the other keys available.

`keepNext: true` tells Word to keep a heading on the same page as the paragraph after it, which stops orphaned headings at the bottom of a page: a classic complaint from clients reviewing a 700-page handbook.

### Style names and IDs

| Word name | Style ID used by docx | Typical use |
|---|---|---|
| Normal | `Normal` | body text |
| Heading 1 | `Heading1` | chapter |
| Heading 2 | `Heading2` | section |
| Title | `Title` | document title |
| List Paragraph | `ListParagraph` | bullets and numbering |
| Quote | `Quote` | pull quotes |

You can also apply any of these explicitly with `style: "Heading1"`, which is the same as `heading: HeadingLevel.HEADING_1`. The `style` route is what you will use for your own custom styles later.

### Outline levels and the Navigation Pane

Word's Navigation Pane (View → Navigation Pane) lists paragraphs by outline level. Heading 1 is level 0, Heading 2 is level 1, and so on. That mapping is built into the heading styles, so simply using `HeadingLevel` makes long documents navigable. For a custom style that should appear in the pane, set `paragraph: { outlineLevel: 0 }` on the style definition.

> **Interview note:** "Why not just make the text bold and bigger?" is a favourite question. Answer: styles give semantic structure. TOC generation, navigation, accessibility (screen readers announce heading levels) and one-click restyling all depend on it.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } },
      heading1: { run: { size: 32, bold: true, color: "1E5AA8" }, paragraph: { spacing: { before: 360, after: 120 }, keepNext: true } },
      heading2: { run: { size: 26, bold: true, color: "2E74B5" }, paragraph: { spacing: { before: 240, after: 80 }, keepNext: true } },
      title: { run: { size: 52, bold: true }, paragraph: { alignment: AlignmentType.CENTER } },
    },
  },
  sections: [{
    children: [
      new Paragraph({ text: "Call Centre Quality SOP", heading: HeadingLevel.TITLE }),
      new Paragraph({ text: "1. Purpose", heading: HeadingLevel.HEADING_1 }),
      new Paragraph("This SOP defines how quality checkers score inbound calls."),
      new Paragraph({ text: "1.1 Scope", heading: HeadingLevel.HEADING_2 }),
      new Paragraph("Applies to all agents on the data-processing floor."),
      new Paragraph({ text: "2. Scoring", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ children: [new TextRun("Each call is scored out of 100 across five criteria.")] }),
    ],
  }],
});

download(await docx.Packer.toBlob(doc), "headings.docx");
console.log("Generated headings.docx – open View → Navigation Pane in Word");
```

### Quiz

1. What does `heading: HeadingLevel.HEADING_2` set in the XML?
- [ ] A bold 13 pt run
- [x] `w:pStyle` with value `Heading2`
- [ ] An outline level of 2
> It references the built-in style; the look comes from the style definition.

2. Which key restyles the document-wide default font?
- [x] `styles.default.document.run`
- [ ] `styles.default.normal`
- [ ] `Document.font`
> `default.document` is the document defaults part; every run inherits from it.

3. Which property keeps a heading with the following paragraph?
- [ ] `keepLines`
- [x] `keepNext`
- [ ] `pageBreakBefore`
> `keepNext` prevents a heading from being stranded at the bottom of a page.

### Exercises

1. **Numbered chapters** — Generate Heading 1 paragraphs for chapters 1–5 of a policy manual, each followed by a Normal paragraph.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, HeadingLevel } = docx;
const chapters = ["Purpose", "Definitions", "Responsibilities", "Procedure", "Records"];
const children = [];
chapters.forEach((c, i) => {
  children.push(new Paragraph({ text: `${i + 1}. ${c}`, heading: HeadingLevel.HEADING_1 }));
  children.push(new Paragraph(`Content for the ${c.toLowerCase()} chapter.`));
});
download(await Packer.toBlob(new Document({ sections: [{ children }] })), "chapters.docx");
```

</details>

2. **Brand the title** — Make the Title style red (`CB4335`), 28 pt, centred, with 18 pt space after.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, HeadingLevel, AlignmentType } = docx;
const doc = new Document({
  styles: { default: { title: {
    run: { size: 56, bold: true, color: "CB4335" },
    paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 360 } },
  } } },
  sections: [{ children: [new Paragraph({ text: "Rate Manual", heading: HeadingLevel.TITLE })] }],
});
download(await Packer.toBlob(doc), "title.docx");
```

</details>

### Interview Questions

**Q: Why should generated documents use heading styles rather than direct formatting?**
Direct formatting produces text that looks like a heading but has no structure, so Word cannot build a TOC from it, the Navigation Pane stays empty, and screen readers cannot announce it as a heading. Styles carry semantics and inheritance: change Heading 1 once and every chapter updates. For a 767-page handbook that difference is the difference between an automatic TOC and a week of manual page-number typing. In docx I always set `heading: HeadingLevel.X` or `style: "MyHeading"` and put the look in the style definition, never on the run.

**Q: What is the relationship between `styles.default.document` and the Normal style?**
`styles.default.document` writes the `w:docDefaults` element, which is the base every style inherits from, including Normal. Normal then inherits and can override, and body paragraphs use Normal. Setting the font and size in document defaults therefore changes everything that has not been explicitly overridden, headings included, while defining a `Normal` paragraph style affects only paragraphs using Normal and styles based on it. For brand templates I set the font family once in document defaults and sizes per style.

**Q: How does Word decide what appears in the Navigation Pane and TOC?**
Both are driven by outline level. The built-in Heading n styles carry outline level n−1. A custom style appears if you give it `paragraph.outlineLevel`, and the TOC field can additionally be told to include specific styles via its `\t` switch, which docx exposes through `stylesWithLevels` on `TableOfContents`. Direct formatting never appears because it has no outline level.

## Sections & page setup

Every docx document has at least one section, and the section is where page size, orientation, margins, headers, footers and page numbering live. If a client wants a landscape rate matrix in the middle of a portrait manual, that is a second section.

### Section properties

```js
const { Document, Paragraph, convertInchesToTwip, PageOrientation } = docx;

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: convertInchesToTwip(8.5), height: convertInchesToTwip(11) },
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.25),
            right: convertInchesToTwip(1.25),
            header: convertInchesToTwip(0.5),
            footer: convertInchesToTwip(0.5),
            gutter: 0,
          },
        },
      },
      children: [new Paragraph("US Letter, 1\" top/bottom, 1.25\" sides.")],
    },
  ],
});
```

The default page is US Letter with 1-inch margins when you omit `page`. For A4, which most of Ali's non-US clients want, use `width: convertMillimetersToTwip(210)` and `height: convertMillimetersToTwip(297)`.

`margin.header` and `margin.footer` are the distances from the page edge to the header and footer text, matching Word's Layout → Margins → Custom → "Header/Footer from edge".

### Orientation

```js
properties: {
  page: {
    size: {
      orientation: PageOrientation.LANDSCAPE,
      width: convertInchesToTwip(11),
      height: convertInchesToTwip(8.5),
    },
  },
}
```

docx does **not** swap width and height for you when you set `LANDSCAPE`. If you set only the orientation, Word may show a landscape flag with portrait dimensions and some viewers render it incorrectly. Always set all three.

### Multiple sections

```js
sections: [
  { properties: { /* portrait */ }, children: [/* manual chapters */] },
  {
    properties: {
      type: docx.SectionType.NEXT_PAGE,
      page: { size: { orientation: PageOrientation.LANDSCAPE, width: convertInchesToTwip(11), height: convertInchesToTwip(8.5) } },
    },
    children: [/* wide rate matrix table */],
  },
  { properties: { type: docx.SectionType.NEXT_PAGE }, children: [/* back to portrait */] },
]
```

`SectionType` values: `NEXT_PAGE` (default), `CONTINUOUS`, `EVEN_PAGE`, `ODD_PAGE`. A continuous section break is how you switch column count mid-page; odd-page breaks are used in print books so every chapter starts on a right-hand page.

### Other section-level options

| Option | Meaning |
|---|---|
| `titlePage: true` | enables a different first-page header/footer |
| `page.pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN }` | restart and format page numbers |
| `column: { count: 2, space: 720 }` | multi-column layout |
| `lineNumbers` | legal-style line numbering |
| `verticalAlign` | vertical alignment of the page content |
| `headers` / `footers` | header and footer objects (next level) |

> **Tip:** Keep a `pageSetup.js` module with named presets (`LETTER_PORTRAIT`, `A4_PORTRAIT`, `LETTER_LANDSCAPE_MATRIX`) and spread them into `properties`. Every generator in the suite then agrees on margins, and a client-wide change is one edit.

### Try It Yourself

```js
const { Document, Packer, Paragraph, HeadingLevel, PageOrientation, SectionType, convertInchesToTwip } = docx;

const portrait = { width: convertInchesToTwip(8.5), height: convertInchesToTwip(11) };
const landscape = { orientation: PageOrientation.LANDSCAPE, width: convertInchesToTwip(11), height: convertInchesToTwip(8.5) };
const margin = { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1), right: convertInchesToTwip(1) };

const doc = new Document({
  sections: [
    {
      properties: { page: { size: portrait, margin } },
      children: [
        new Paragraph({ text: "Rate Manual", heading: HeadingLevel.TITLE }),
        new Paragraph("This portrait section holds the narrative chapters."),
      ],
    },
    {
      properties: { type: SectionType.NEXT_PAGE, page: { size: landscape, margin } },
      children: [
        new Paragraph({ text: "Appendix A – Rate Matrix", heading: HeadingLevel.HEADING_1 }),
        new Paragraph("This landscape section will hold the wide table."),
      ],
    },
    {
      properties: { type: SectionType.NEXT_PAGE, page: { size: portrait, margin } },
      children: [new Paragraph("Back to portrait for the index.")],
    },
  ],
});

download(await docx.Packer.toBlob(doc), "sections.docx");
console.log("Generated sections.docx with 3 sections");
```

### Quiz

1. Where do page margins live?
- [ ] On the `Document`
- [x] On a section's `properties.page.margin`
- [ ] On each `Paragraph`
> Page setup is per section, matching Word's section breaks.

2. What must you do besides setting `orientation: LANDSCAPE`?
- [x] Swap `width` and `height` yourself
- [ ] Nothing; docx swaps automatically
- [ ] Set `rotate: 90`
> docx writes exactly what you pass; the orientation flag alone does not resize the page.

3. Which `SectionType` starts the new section on the same page?
- [ ] `NEXT_PAGE`
- [x] `CONTINUOUS`
- [ ] `ODD_PAGE`
> Continuous breaks are used to change columns or margins mid-page.

### Exercises

1. **A4 preset** — Write an `A4` page preset with 25 mm margins and use it in a document.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, convertMillimetersToTwip: mm } = docx;
const A4 = { size: { width: mm(210), height: mm(297) }, margin: { top: mm(25), bottom: mm(25), left: mm(25), right: mm(25) } };
const doc = new Document({ sections: [{ properties: { page: A4 }, children: [new Paragraph("A4 with 25 mm margins")] }] });
download(await Packer.toBlob(doc), "a4.docx");
```

</details>

2. **Odd-page chapters** — Create three sections that each start on an odd page.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, SectionType, HeadingLevel } = docx;
const sections = ["Purpose", "Procedure", "Records"].map((t, i) => ({
  properties: i === 0 ? {} : { type: SectionType.ODD_PAGE },
  children: [new Paragraph({ text: `Chapter ${i + 1}: ${t}`, heading: HeadingLevel.HEADING_1 })],
}));
download(await Packer.toBlob(new Document({ sections })), "odd.docx");
```

</details>

### Interview Questions

**Q: A client wants one landscape page inside a portrait manual. How do you do it in docx and what goes wrong most often?**
Split the content into three sections: portrait, landscape, portrait, with `type: SectionType.NEXT_PAGE` on the second and third. The landscape section needs `orientation: PageOrientation.LANDSCAPE` plus explicitly swapped width and height, because docx does not swap them. The common mistakes are forgetting the swap, forgetting that headers and footers are per section (so the landscape page loses the footer unless you provide one), and forgetting that page numbering continues by default, which is usually what you want.

**Q: What is the difference between a page break and a section break?**
A page break just moves content to the next page inside the same section; margins, orientation, headers and page numbering stay the same. A section break creates a new `w:sectPr` boundary with its own page setup, headers and footers and numbering. Use `PageBreak` for "start the next chapter on a new page" and a new section for "this chapter is landscape" or "front matter uses roman numerals".

**Q: How do you keep page setup consistent across a suite of 21 templates?**
Centralise it. I keep a module that exports page presets (Letter portrait, Letter landscape, A4) and margin sets, and each template spreads a preset into its section properties. Brand changes, such as a new 0.75-inch margin request from the client's print vendor, become one commit. I also write a small test that packs every template and asserts the `w:pgSz` and `w:pgMar` values in the output XML so regressions are caught before delivery.

## Saving in Node vs browser

The document tree is identical everywhere; only the last step differs. Choosing the right `Packer` method and delivery mechanism is what makes the same generator work in a CLI script, an Express API and a static web page.

### Node: write to disk

```js
const fs = require("fs");
const { Document, Packer, Paragraph } = require("docx");

const doc = new Document({ sections: [{ children: [new Paragraph("Report")] }] });

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("report.docx", buffer);
  console.log("Wrote report.docx", buffer.length, "bytes");
});
```

With ES modules use `import { Document, Packer, Paragraph } from "docx"` and top-level `await`. Both builds are in the package; Node picks the right one from the `exports` map.

### Node: send from Express

```js
app.get("/report/:branch", async (req, res) => {
  const doc = buildReport(req.params.branch);
  const buffer = await Packer.toBuffer(doc);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename="report-${req.params.branch}.docx"`);
  res.send(buffer);
});
```

The MIME type string is long but exact; browsers use it and the `.docx` extension to hand the file to Word. For very large files, `Packer.toStream(doc)` returns a readable stream you can `pipe(res)` so the whole file never sits in memory.

### Browser: Blob and download

```js
const blob = await Packer.toBlob(doc);
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "report.docx";
a.click();
URL.revokeObjectURL(url);
```

That is exactly what the `download()` helper in this course does. Many people use the small `file-saver` package (`saveAs(blob, "report.docx")`) for the same thing. Because `Packer.toBlob` runs entirely client-side, no server is involved: a static HTML page hosted anywhere can generate branded Word documents.

### Base64 for APIs and email

```js
const b64 = await Packer.toBase64String(doc);
// attach to an email with nodemailer
await transporter.sendMail({
  to: client,
  subject: "Weekly report",
  attachments: [{ filename: "report.docx", content: b64, encoding: "base64" }],
});
```

### Which build am I using?

| Environment | Import | Packer method |
|---|---|---|
| Node CommonJS | `require("docx")` | `toBuffer`, `toStream` |
| Node ESM | `import … from "docx"` | `toBuffer`, `toStream` |
| Bundled browser (Vite/webpack) | `import … from "docx"` | `toBlob`, `toBase64String` |
| Script tag / CDN | global `docx` (`docx.Document`) | `toBlob` |

The CDN build is what this course's runner loads: `https://unpkg.com/docx/build/index.umd.js` exposes `window.docx`. If you use a bundler the browser build is selected automatically via the package's `browser` field.

> **Warning:** `Packer.toBuffer` in the browser returns a `Buffer` polyfill only if your bundler provides one. Prefer `toBlob` in browsers and `toBuffer` in Node so you never depend on polyfills.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun } = docx;

const doc = new Document({
  sections: [{ children: [
    new Paragraph({ children: [new TextRun({ text: "Saved from the browser", bold: true })] }),
    new Paragraph("The same tree could be written to disk with Packer.toBuffer in Node."),
  ]}],
});

const blob = await Packer.toBlob(doc);
console.log("Blob size:", blob.size, "bytes, type:", blob.type);

const b64 = await Packer.toBase64String(doc);
console.log("Base64 prefix:", b64.slice(0, 12), "(PK header = zip)");

download(blob, "saved.docx");
```

### Quiz

1. Which Packer method should a browser use?
- [ ] `toBuffer`
- [x] `toBlob`
- [ ] `toStream`
> `Blob` is the browser's native binary container and feeds `URL.createObjectURL`.

2. What is the correct MIME type for a `.docx` response?
- [ ] `application/msword`
- [x] `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- [ ] `application/zip`
> `application/msword` is the legacy `.doc` type.

3. Why might `Packer.toStream` be preferred in an API?
- [x] It avoids holding the whole file in memory
- [ ] It is synchronous
- [ ] It produces smaller files
> Streams pipe zipped bytes to the response as they are produced.

### Exercises

1. **Size report** — Generate a document with 500 paragraphs and log the Blob size.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph } = docx;
const children = Array.from({ length: 500 }, (_, i) => new Paragraph(`Paragraph ${i + 1}`));
const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
console.log(blob.size, "bytes");
download(blob, "five-hundred.docx");
```

</details>

2. **Node script** — Write the Node version that saves the same file to disk (run locally).
<details><summary>Solution</summary>

```js
// Node-only: run locally
const fs = require("fs");
const { Document, Packer, Paragraph } = require("docx");
const children = Array.from({ length: 500 }, (_, i) => new Paragraph(`Paragraph ${i + 1}`));
Packer.toBuffer(new Document({ sections: [{ children }] })).then((b) => fs.writeFileSync("five-hundred.docx", b));
```

</details>

### Interview Questions

**Q: How would you deliver a generated Word document from a REST API?**
Build the `Document`, call `await Packer.toBuffer(doc)`, and send it with `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document` and a `Content-Disposition: attachment; filename="…"` header. For large documents I use `Packer.toStream(doc).pipe(res)` so memory stays flat under concurrent requests. I also set a cache-control of no-store because reports contain client data, and I generate the filename from sanitised parameters so a branch name cannot inject header characters.

**Q: Can docx run entirely in the browser, and what are the trade-offs?**
Yes; the library has no Node dependencies at runtime and `Packer.toBlob` produces a downloadable file client-side. Advantages are zero server cost, no client data leaving the machine, and instant feedback while a user edits inputs. Trade-offs are that fonts and images must be fetched or embedded client-side, very large documents block the main thread unless you move generation into a Web Worker, and you cannot use `fs` to read templates so assets come via `fetch` as `ArrayBuffer`.

**Q: What is the difference between `toBuffer`, `toBlob` and `toBase64String` internally?**
All three build the same zip via JSZip and differ only in the `type` requested from `zip.generateAsync`: `nodebuffer`, `blob` or `base64`. So there is no quality or fidelity difference, only container. Base64 is about 33% larger, which matters when embedding a 10 MB handbook in a JSON payload; Buffer is the natural fit for Node file and HTTP APIs; Blob is the browser's binary type and is what `URL.createObjectURL` needs.

# LEVEL: Intermediate

## Custom styles: paragraph, character & defaults

Built-in styles get you started, but a branded template suite needs its own: `BodyText`, `Callout`, `TableHeader`, `Caption`, `FooterSmall`. docx lets you define paragraph styles and character styles in the `styles` option of `Document`, and then reference them by `id` from paragraphs and runs.

### Defining a paragraph style

```js
const { Document, AlignmentType } = docx;

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      {
        id: "Callout",
        name: "Callout",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { italics: true, color: "1E5AA8" },
        paragraph: {
          indent: { left: 720, right: 720 },
          spacing: { before: 120, after: 120 },
          border: { left: { style: docx.BorderStyle.SINGLE, size: 24, color: "1E5AA8", space: 8 } },
        },
      },
      {
        id: "Caption",
        name: "Caption",
        basedOn: "Normal",
        run: { size: 18, color: "666666", italics: true },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 240 } },
      },
    ],
  },
  sections: [{ children: [
    new docx.Paragraph({ style: "Callout", text: "All rate changes must be approved by the underwriter." }),
    new docx.Paragraph({ style: "Caption", text: "Figure 1 – Approval flow" }),
  ]}],
});
```

Key fields:

- `id` is what you reference in code and what Word stores in `w:pStyle`. Keep it free of spaces.
- `name` is what the user sees in Word's Styles gallery.
- `basedOn` inherits everything from another style; `next` is the style Word switches to when the user presses Enter.
- `quickFormat: true` shows the style in the Home ribbon gallery, which clients appreciate.
- `run` and `paragraph` take the same options you already know from `TextRun` and `Paragraph`.

### Character styles

Character styles apply to runs. They are perfect for things like product codes, keyboard keys or a client's brand accent colour:

```js
characterStyles: [
  {
    id: "Code",
    name: "Code",
    basedOn: "DefaultParagraphFont",
    run: { font: "Consolas", size: 20, shading: { type: docx.ShadingType.CLEAR, fill: "EEEEEE" } },
  },
],
```

Then `new TextRun({ text: "RATE-WY-2026", style: "Code" })`. The built-in `Hyperlink` character style is referenced the same way when you add links later.

### Overriding a built-in by id

You can redefine the built-in heading styles through `paragraphStyles` using their ids (`Heading1`, `Heading2`, `Title`). This is equivalent to `styles.default.heading1` and is useful when you also want `next` and `basedOn` control:

```js
{ id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
  run: { size: 32, bold: true, color: "1E5AA8", font: "Calibri Light" },
  paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0, keepNext: true } }
```

Set `outlineLevel` explicitly when you override a heading, otherwise the TOC may not pick it up in some viewers.

### Style inheritance order

Word resolves formatting from the bottom up:

| Priority | Source |
|---|---|
| lowest | document defaults (`styles.default.document`) |
| ↓ | paragraph style chain (`basedOn` … Normal) |
| ↓ | character style on the run |
| highest | direct formatting on the `Paragraph`/`TextRun` |

Direct formatting always wins. That is why a `TextRun({ bold: true })` inside a `Callout` paragraph is bold and italic: the style provides italics, the run adds bold.

> **Tip:** Name styles for their role, not their look (`Callout`, not `BlueItalic`). When the client rebrands from blue to green, the names still make sense and only the definitions change.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, ShadingType, AlignmentType } = docx;

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Callout", name: "Callout", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { italics: true, color: "1E5AA8" },
        paragraph: { indent: { left: 720, right: 720 }, spacing: { before: 120, after: 120 },
          border: { left: { style: BorderStyle.SINGLE, size: 24, color: "1E5AA8", space: 8 } } } },
      { id: "Caption", name: "Caption", basedOn: "Normal",
        run: { size: 18, color: "666666", italics: true },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 240 } } },
    ],
    characterStyles: [
      { id: "Code", name: "Code", basedOn: "DefaultParagraphFont",
        run: { font: "Consolas", size: 20, shading: { type: ShadingType.CLEAR, fill: "EEEEEE" } } },
    ],
  },
  sections: [{ children: [
    new Paragraph({ text: "Rate Filing Procedure", heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ style: "Callout", text: "All rate changes must be approved by the underwriter before publication." }),
    new Paragraph({ children: [new TextRun("Reference the filing as "), new TextRun({ text: "RATE-WY-2026-03", style: "Code" }), new TextRun(" in every email.")] }),
    new Paragraph({ style: "Caption", text: "Figure 1 – Approval flow" }),
  ]}],
});

download(await docx.Packer.toBlob(doc), "styles.docx");
console.log("Generated styles.docx – check the Styles gallery in Word");
```

### Quiz

1. Which field of a paragraph style is referenced by `new Paragraph({ style: "..." })`?
- [x] `id`
- [ ] `name`
- [ ] `basedOn`
> `id` is stored in the XML; `name` is only the label Word shows.

2. What does `next` control?
- [ ] The style of the previous paragraph
- [x] The style applied when the user presses Enter after this paragraph
- [ ] The outline level
> Headings usually set `next: "Normal"` so typing continues in body text.

3. Which wins when a style and direct formatting disagree?
- [ ] The style
- [x] Direct formatting on the run or paragraph
- [ ] Document defaults
> Direct formatting has the highest priority in Word's resolution order.

### Exercises

1. **Table header style** — Define `TableHeader`: bold, white text, 10 pt, centred. Use it in a paragraph.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, AlignmentType } = docx;
const doc = new Document({
  styles: { paragraphStyles: [{ id: "TableHeader", name: "Table Header", basedOn: "Normal",
    run: { bold: true, color: "FFFFFF", size: 20 }, paragraph: { alignment: AlignmentType.CENTER } }] },
  sections: [{ children: [new Paragraph({ style: "TableHeader", text: "COUNTY" })] }],
});
download(await Packer.toBlob(doc), "th.docx");
```

</details>

2. **Brand accent** — Create a character style `Accent` in colour `B7472A`, bold, and use it on one word inside a sentence.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun } = docx;
const doc = new Document({
  styles: { characterStyles: [{ id: "Accent", name: "Accent", run: { bold: true, color: "B7472A" } }] },
  sections: [{ children: [new Paragraph({ children: [
    new TextRun("Turnaround is now "), new TextRun({ text: "2.3 days", style: "Accent" }), new TextRun("."),
  ]})]}],
});
download(await Packer.toBlob(doc), "accent.docx");
```

</details>

### Interview Questions

**Q: What is the difference between a paragraph style and a character style, and when do you use each?**
A paragraph style applies to the whole paragraph and can carry both paragraph properties (alignment, spacing, indent, borders) and default run properties; a character style applies to a run and carries only run properties. Use paragraph styles for structural roles (body, callout, caption, table header) and character styles for inline roles (code, product codes, brand accent, hyperlink). In docx, paragraph styles go in `paragraphStyles` and are referenced with `style` on `Paragraph`; character styles go in `characterStyles` and are referenced with `style` on `TextRun`.

**Q: How do `basedOn` and `next` help maintain a template suite?**
`basedOn` creates inheritance so `Callout` based on `BodyText` picks up font and spacing changes automatically; a brand-wide font change is then one edit. `next` makes the template pleasant to edit in Word: after a heading, Enter drops the user into `BodyText`, after a `Caption` it returns to body. For the 21-template suite I keep a shared `styles.js` exporting the array, so every template imports the same definitions and diverges only where the client asked.

**Q: A client says the generated document's headings look different on their machine. What do you check?**
First whether the heading style is actually defined in the document or is relying on Word's defaults, because Word's defaults differ between versions and languages. Then font availability: if the style asks for Calibri Light and the machine lacks it, Word substitutes. Then direct formatting overrides that might be hiding the style. Finally I unzip the file and read `word/styles.xml` to confirm the style, its `basedOn` chain and `docDefaults` are what I expect. Defining every style explicitly and using widely available fonts eliminates most of these reports.

## Numbering & bullets

Lists in Word are not just paragraphs with a dash in front. They are paragraphs that reference a **numbering definition**: a set of levels, each with a format (decimal, bullet, letter), a text pattern, and an indent. docx gives you a quick `bullet` shortcut and a full `numbering` config for real control.

### Quick bullets

```js
new docx.Paragraph({ text: "Verify grantor name", bullet: { level: 0 } });
new docx.Paragraph({ text: "Check legal description", bullet: { level: 1 } });
```

`bullet.level` is zero-based. This uses a default bullet definition docx creates for you. It is fine for simple lists but you cannot control the bullet character or indent.

### Full numbering config

```js
const { Document, Paragraph, LevelFormat, AlignmentType } = docx;

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "sop-steps",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.LOWER_LETTER, text: "%2)", alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
          { level: 2, format: LevelFormat.LOWER_ROMAN, text: "%3.", alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: 2160, hanging: 360 } } } },
        ],
      },
      {
        reference: "brand-bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "▪", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { color: "1E5AA8" } } },
        ],
      },
    ],
  },
  sections: [{ children: [
    new Paragraph({ text: "Open the file in the title plant", numbering: { reference: "sop-steps", level: 0 } }),
    new Paragraph({ text: "Confirm the legal description", numbering: { reference: "sop-steps", level: 1 } }),
    new Paragraph({ text: "Compare with the vesting deed", numbering: { reference: "sop-steps", level: 1 } }),
    new Paragraph({ text: "Record the search in the log", numbering: { reference: "sop-steps", level: 0 } }),
    new Paragraph({ text: "Square brand bullet", numbering: { reference: "brand-bullets", level: 0 } }),
  ]}],
});
```

Reading a level:

- `format`: `DECIMAL`, `UPPER_ROMAN`, `LOWER_ROMAN`, `UPPER_LETTER`, `LOWER_LETTER`, `BULLET`, `NONE` and more from `LevelFormat`.
- `text`: the pattern. `%1` is the level-0 counter, `%2` the level-1 counter, so `"%1.%2"` gives `1.1`, `1.2`. For bullets it is the literal character.
- `style.paragraph.indent`: `left` is where the text starts, `hanging` is how far the number sits back from it. 360 twips (0.25") is Word's default gap.
- `style.run`: colour or font for the number itself; this is how you make a coloured square bullet with Wingdings-free Unicode.

### Restarting numbering

Every paragraph with the same `reference` continues the same count. To start a fresh `1.` for a second list, add `instance`:

```js
new Paragraph({ text: "First list, step one", numbering: { reference: "sop-steps", level: 0, instance: 0 } });
new Paragraph({ text: "Second list, step one", numbering: { reference: "sop-steps", level: 0, instance: 1 } });
```

Each distinct `instance` number creates a separate `w:num` pointing at the same abstract definition, which is precisely what Word does when you click "Restart at 1".

### Bullet characters that work everywhere

| Character | Code | Notes |
|---|---|---|
| • | `•` | standard round bullet |
| ▪ | `▪` | small square |
| – | `–` | en dash, popular in SOPs |
| ✓ | `✓` | checklist; needs a font with the glyph (Segoe UI Symbol) |

Word's own default bullets use the Symbol font; Unicode characters avoid the font dependency and survive conversion to PDF and EPUB.

> **Warning:** A paragraph with both `bullet` and `numbering` is invalid. Pick one. Also remember that headings with automatic chapter numbers (`1.`, `1.1`) are just Heading styles attached to a numbering reference, which is how "multilevel list linked to headings" works in Word.

### Try It Yourself

```js
const { Document, Packer, Paragraph, LevelFormat, AlignmentType, HeadingLevel } = docx;

const doc = new Document({
  numbering: { config: [
    { reference: "steps", levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      { level: 1, format: LevelFormat.LOWER_LETTER, text: "%2)", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
    ]},
    { reference: "sq", levels: [
      { level: 0, format: LevelFormat.BULLET, text: "▪", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { color: "1E5AA8" } } },
    ]},
  ]},
  sections: [{ children: [
    new Paragraph({ text: "Title Search Procedure", heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ text: "Open the order in the title plant", numbering: { reference: "steps", level: 0 } }),
    new Paragraph({ text: "Confirm the legal description", numbering: { reference: "steps", level: 1 } }),
    new Paragraph({ text: "Compare with the vesting deed", numbering: { reference: "steps", level: 1 } }),
    new Paragraph({ text: "Record the search in the log", numbering: { reference: "steps", level: 0 } }),
    new Paragraph({ text: "Quality checklist", heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ text: "Names match on all instruments", numbering: { reference: "sq", level: 0 } }),
    new Paragraph({ text: "No open liens", numbering: { reference: "sq", level: 0 } }),
    new Paragraph({ text: "Restarted list", numbering: { reference: "steps", level: 0, instance: 1 } }),
  ]}],
});

download(await docx.Packer.toBlob(doc), "numbering.docx");
console.log("Generated numbering.docx");
```

### Quiz

1. In a level's `text`, what does `%2` mean?
- [ ] Two percent indent
- [x] The counter of level 1 (the second level)
- [ ] Two digits of padding
> `%n` inserts the counter for level n−1, so `"%1.%2"` yields 1.1, 1.2 and so on.

2. How do you make a second list restart at 1 with the same reference?
- [ ] Use a different `level`
- [x] Give the paragraphs a different `instance`
- [ ] Add `restart: true` to the paragraph
> Each `instance` becomes a separate `w:num` pointing at the same abstract numbering.

3. What does `hanging: 360` do?
- [x] Pulls the first line back so the number sits in the margin
- [ ] Adds 360 twips after the paragraph
- [ ] Indents every line by 360 twips
> Hanging indents are how Word aligns list text after the number.

### Exercises

1. **Legal numbering** — Define three levels producing `1.`, `1.1`, `1.1.1` and generate a sample.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, LevelFormat, AlignmentType } = docx;
const lvl = (level, text, left) => ({ level, format: LevelFormat.DECIMAL, text, alignment: AlignmentType.START, style: { paragraph: { indent: { left, hanging: 500 } } } });
const doc = new Document({
  numbering: { config: [{ reference: "legal", levels: [lvl(0, "%1.", 500), lvl(1, "%1.%2", 1000), lvl(2, "%1.%2.%3", 1500)] }] },
  sections: [{ children: [
    new Paragraph({ text: "Definitions", numbering: { reference: "legal", level: 0 } }),
    new Paragraph({ text: "Insured", numbering: { reference: "legal", level: 1 } }),
    new Paragraph({ text: "Named insured", numbering: { reference: "legal", level: 2 } }),
  ]}],
});
download(await Packer.toBlob(doc), "legal.docx");
```

</details>

2. **Checklist bullets** — Make a bullet list using ✓ (`✓`) in green.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, LevelFormat, AlignmentType } = docx;
const doc = new Document({
  numbering: { config: [{ reference: "check", levels: [{ level: 0, format: LevelFormat.BULLET, text: "✓", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { color: "2E8B57", font: "Segoe UI Symbol" } } }] }] },
  sections: [{ children: ["Names verified", "Liens cleared"].map((t) => new Paragraph({ text: t, numbering: { reference: "check", level: 0 } })) }],
});
download(await Packer.toBlob(doc), "check.docx");
```

</details>

### Interview Questions

**Q: How does list numbering actually work in a .docx, and how does docx expose it?**
`word/numbering.xml` holds abstract numbering definitions (`w:abstractNum`) describing each level's format, text pattern and indent, and concrete `w:num` instances that point at an abstract definition. A paragraph references a `w:num` id and a level in its `w:numPr`. docx's `numbering.config` array creates one abstract definition per `reference`, and `numbering: { reference, level, instance }` on a paragraph creates or reuses the `w:num` for that instance. Understanding this is what lets you restart lists correctly and explains why copying paragraphs between documents sometimes continues the wrong count.

**Q: When would you use the `bullet` shortcut versus a numbering config?**
`bullet: { level }` is fine for throwaway documents or quick prototypes because it needs no setup. For anything branded I use a config: I can choose the glyph, colour it, set exact indents that match the client's Word template, and keep numbered and bulleted styles consistent across the suite. A config also lets me attach numbering to heading styles for automatic chapter numbers, which the shortcut cannot do.

**Q: A client's SOP needs numbered steps that restart in every section. How do you implement that?**
Keep one `reference` for step numbering and increment the `instance` each time a new section starts. I compute the instance from the section index when I map data to paragraphs, so section 3's steps use `instance: 2` and begin again at 1. The alternative of creating a new reference per section bloats `numbering.xml` and confuses users who later edit the file, because each reference shows as a separate list style.

## Tables: rows, cells, widths, borders & merges

Tables carry most of the structured data in Ali's world: rate matrices, weekly production counts, QA scorecards. docx models them as `Table` → `TableRow` → `TableCell` → block content (`Paragraph`s). Because a cell holds paragraphs, every text-formatting trick you know works inside a cell.

### Minimal table

```js
const { Table, TableRow, TableCell, Paragraph, WidthType } = docx;

const table = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ tableHeader: true, children: [
      new TableCell({ children: [new Paragraph("County")] }),
      new TableCell({ children: [new Paragraph("Files")] }),
    ]}),
    new TableRow({ children: [
      new TableCell({ children: [new Paragraph("Laramie")] }),
      new TableCell({ children: [new Paragraph("62")] }),
    ]}),
  ],
});
```

`tableHeader: true` marks the row to repeat at the top of every page: essential for a rate matrix that runs six pages. `width` can be `PERCENTAGE`, `DXA` (twips) or `AUTO`.

### Column widths

Word needs a hint per column or it will guess. Give both the table `columnWidths` and each cell a matching `width`:

```js
new Table({
  columnWidths: [4000, 2000, 2000],   // twips, must sum to the table width you want
  rows: rows.map((r) => new TableRow({ children: r.map((text, i) =>
    new TableCell({ width: { size: [4000, 2000, 2000][i], type: WidthType.DXA }, children: [new Paragraph(text)] })
  )})),
});
```

Add `layout: docx.TableLayoutType.FIXED` to stop Word auto-fitting content, which is what you want for matrices that must align with a printed form.

### Borders and shading

```js
const { BorderStyle, ShadingType } = docx;
const thin = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };  // size in eighths of a point

new Table({
  borders: { top: thin, bottom: thin, left: thin, right: thin, insideHorizontal: thin, insideVertical: thin },
  rows: [
    new TableRow({ tableHeader: true, children: [
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: "1E5AA8", color: "auto" },
        children: [new Paragraph({ children: [new docx.TextRun({ text: "County", bold: true, color: "FFFFFF" })] })],
      }),
    ]}),
  ],
});
```

Borders can be set at table level (default for all cells) or per cell to override. `BorderStyle.NONE` with `size: 0` removes them. Alternating row shading is just `fill: i % 2 ? "F2F2F2" : "FFFFFF"` when you map data rows.

### Merging cells

```js
// horizontal merge: one cell spans 3 columns
new TableCell({ columnSpan: 3, children: [new Paragraph("Q3 2026 Totals")] });

// vertical merge: the top cell has rowSpan; the rows below simply omit that cell
new TableRow({ children: [
  new TableCell({ rowSpan: 2, children: [new Paragraph("Wyoming")] }),
  new TableCell({ children: [new Paragraph("Laramie")] }),
]}),
new TableRow({ children: [
  new TableCell({ children: [new Paragraph("Natrona")] }),   // only one cell here
]}),
```

Vertical merges trip people up: after a `rowSpan`, the following rows must have fewer cells, exactly as the merged area occupies that position.

### Cell-level extras

| Option | Effect |
|---|---|
| `verticalAlign: VerticalAlign.CENTER` | vertical alignment of content |
| `margins: { top: 60, bottom: 60, left: 100, right: 100 }` | cell padding in twips |
| `textDirection: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT` | rotated header text |
| row `height: { value: 400, rule: HeightRule.ATLEAST }` | minimum row height |
| row `cantSplit: true` | never break a row across pages |

> **Tip:** Build tables with a helper: `cell(text, { bold, fill, align, width })` returning a `TableCell`. A rate matrix with 30 columns and 200 rows becomes a two-line `map` instead of thousands of lines of constructor calls.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType, HeadingLevel } = docx;

const thin = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const widths = [3600, 1800, 1800, 1800];
const cell = (text, { bold = false, fill, color = "000000", align = AlignmentType.LEFT, width } = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ alignment: align, children: [new TextRun({ text, bold, color })] })],
  });

const data = [["Laramie", 62, 58, "93.5%"], ["Natrona", 41, 40, "97.6%"], ["Campbell", 27, 25, "92.6%"], ["Sweetwater", 18, 18, "100%"]];
const header = ["County", "Opened", "Closed", "QA pass"];

const rows = [
  new TableRow({ tableHeader: true, children: header.map((h, i) => cell(h, { bold: true, fill: "1E5AA8", color: "FFFFFF", width: widths[i], align: i ? AlignmentType.RIGHT : AlignmentType.LEFT })) }),
  ...data.map((r, ri) => new TableRow({ children: r.map((v, i) => cell(String(v), { fill: ri % 2 ? "F2F2F2" : undefined, width: widths[i], align: i ? AlignmentType.RIGHT : AlignmentType.LEFT })) })),
  new TableRow({ children: [
    new TableCell({ columnSpan: 3, width: { size: 7200, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Total opened", bold: true })] })] }),
    cell("148", { bold: true, width: 1800, align: AlignmentType.RIGHT }),
  ]}),
];

const doc = new Document({ sections: [{ children: [
  new Paragraph({ text: "Weekly Production by County", heading: HeadingLevel.HEADING_1 }),
  new Table({ columnWidths: widths, width: { size: 9000, type: WidthType.DXA }, borders: { top: thin, bottom: thin, left: thin, right: thin, insideHorizontal: thin, insideVertical: thin }, rows }),
]}]});

download(await docx.Packer.toBlob(doc), "table.docx");
console.log("Generated table.docx");
```

### Quiz

1. What does `tableHeader: true` on a `TableRow` do?
- [ ] Makes the text bold
- [x] Repeats the row at the top of each page the table spans
- [ ] Freezes the row in Word's window
> It writes `w:tblHeader`, Word's "Repeat as header row" option.

2. Border `size: 8` means…
- [ ] 8 pt
- [x] 1 pt (eighths of a point)
- [ ] 8 twips
> Border widths are in eighths of a point in Office Open XML.

3. After a cell with `rowSpan: 2`, the next row must…
- [x] Omit the cell at that position
- [ ] Include an empty cell there
- [ ] Also set `rowSpan: 2`
> The merged region occupies that slot; supplying a cell shifts the row.

### Exercises

1. **Rate matrix** — Build a 4×4 grid of premiums where the first row and first column are shaded headers.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, Table, TableRow, TableCell, ShadingType } = docx;
const amounts = ["$100k", "$200k", "$300k"], rates = [[550, 900, 1250], [600, 980, 1360], [650, 1060, 1470]];
const hdr = (t) => new TableCell({ shading: { type: ShadingType.CLEAR, fill: "D9E2F3", color: "auto" }, children: [new Paragraph(t)] });
const rows = [new TableRow({ children: [hdr("Zone"), ...amounts.map(hdr)] }),
  ...rates.map((r, i) => new TableRow({ children: [hdr(`Zone ${i + 1}`), ...r.map((v) => new TableCell({ children: [new Paragraph(`$${v}`)] }))] }))];
download(await Packer.toBlob(new Document({ sections: [{ children: [new Table({ rows })] }] })), "matrix.docx");
```

</details>

2. **Vertical merge** — Create a two-row table where the first column is merged vertically with the label "Wyoming".
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, Table, TableRow, TableCell } = docx;
const rows = [
  new TableRow({ children: [new TableCell({ rowSpan: 2, children: [new Paragraph("Wyoming")] }), new TableCell({ children: [new Paragraph("Laramie")] })] }),
  new TableRow({ children: [new TableCell({ children: [new Paragraph("Natrona")] })] }),
];
download(await Packer.toBlob(new Document({ sections: [{ children: [new Table({ rows })] }] })), "merge.docx");
```

</details>

### Interview Questions

**Q: Why do you specify both `columnWidths` on the table and `width` on each cell?**
`columnWidths` writes the `w:tblGrid`, which is the grid Word and other renderers use to lay out the table, while cell `width` writes `w:tcW` for each cell. Word tolerates a missing grid and recomputes it, but LibreOffice, Google Docs and PDF converters are stricter and can render unequal or collapsed columns without it. Providing both, and setting `layout: FIXED` when exact alignment matters, is the only combination I have found that renders identically across Word, LibreOffice and the PDF export a client will eventually send to print.

**Q: How would you generate a 200-row, 30-column rate matrix without unreadable code?**
Data first, layout second. I keep the matrix as an array of arrays plus a header array, then write two small helpers: `cell(value, opts)` that returns a `TableCell` with width, shading and alignment, and `row(values, opts)`. The table becomes `data.map(...)`. Header row gets `tableHeader: true` so it repeats across pages, numeric columns are right-aligned, and I apply alternating shading by row index. Column widths come from a `widths` array that I also use to compute the table width so the `w:tblGrid` and `w:tblW` agree.

**Q: What are common table rendering problems and their fixes?**
Columns collapsing in LibreOffice or Google Docs: missing `columnWidths`. A row splitting across pages: set `cantSplit: true`. Header not repeating: forgot `tableHeader: true`. Cell padding looks cramped: set table-level `margins`. Text touching borders in PDF export: add cell `margins`. Vertical merge producing shifted cells: the subsequent rows included a cell where the merge occupies. And the classic "table wider than the page": widths in twips summing beyond the text width; I compute the text width from page width minus margins and scale the widths array to fit.

## Images: ImageRun & sizing

Logos on letterheads, signature images, charts exported from Excel: all of them go into a document through `ImageRun`. An `ImageRun` is an inline run, so it lives inside a `Paragraph` just like text, which means you position it with paragraph alignment and size it in pixels.

### Basic inline image

```js
const { Paragraph, ImageRun } = docx;

new Paragraph({
  children: [
    new ImageRun({
      type: "png",                     // required in docx v9; ignored in v8
      data: logoBytes,                 // Buffer, Uint8Array or ArrayBuffer
      transformation: { width: 180, height: 60 },
      altText: { title: "Logo", description: "Stewart Title logo", name: "logo" },
    }),
  ],
});
```

`transformation.width` and `height` are in **pixels at 96 DPI**. docx converts them to EMUs (English Metric Units, 9525 per pixel) in the XML. A 600×200 px logo rendered at `width: 180, height: 60` is 1.875 inches wide on the page.

### Where the bytes come from

| Environment | Code |
|---|---|
| Node | `fs.readFileSync("logo.png")` |
| Browser fetch | `await (await fetch("/logo.png")).arrayBuffer()` |
| Browser canvas | `await new Promise(r => canvas.toBlob(r, "image/png"))` then `.arrayBuffer()` |
| Base64 string | `Buffer.from(b64, "base64")` in Node, or `Uint8Array.from(atob(b64), c => c.charCodeAt(0))` |

Supported types are `png`, `jpg`, `gif`, `bmp` and, in v9, `svg` with a required raster `fallback` image for viewers that cannot draw SVG.

### Keeping aspect ratio

docx does not read the image dimensions; you give both numbers. To avoid stretched logos, compute one from the other:

```js
const natural = { w: 600, h: 200 };
const width = 180;
const height = Math.round((natural.h / natural.w) * width);   // 60
```

In the browser you can get the natural size by loading the bytes into an `Image` first. In Node, a tiny dependency like `image-size` reads the header without decoding the pixels.

### Floating images

Inline images push text; floating images sit at a position and let text wrap. Letterhead logos anchored to the top-right corner are the classic use:

```js
const { HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, TextWrappingSide } = docx;

new ImageRun({
  type: "png",
  data: logoBytes,
  transformation: { width: 150, height: 50 },
  floating: {
    horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 6000000 },   // EMU
    verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 400000 },
    wrap: { type: TextWrappingType.SQUARE, side: TextWrappingSide.BOTH_SIDES },
    margins: { top: 0, bottom: 91440 },
    behindDocument: false,
  },
});
```

Floating offsets are in EMUs: 914400 per inch, 360000 per centimetre. `behindDocument: true` is how you place a watermark image behind the text.

### Rotation and flipping

`transformation: { width, height, rotation: 90, flip: { vertical: true } }` rotates in degrees. Useful for rotated stamps on scanned-look documents.

> **Warning:** Word compresses nothing on your behalf. A 4 MB PNG logo embedded in 21 templates gives the client 84 MB of files. Resize logos to the display size at 2× for print (a 180 px wide logo should be about 360 px in the file) and use JPEG for photos.

### Try It Yourself

```js
const { Document, Packer, Paragraph, ImageRun, TextRun, AlignmentType } = docx;

// Draw a logo on a canvas so there is no external file to fetch
const c = document.createElement("canvas");
c.width = 600; c.height = 200;
const g = c.getContext("2d");
g.fillStyle = "#1E5AA8"; g.fillRect(0, 0, 600, 200);
g.fillStyle = "#FFFFFF"; g.font = "bold 90px sans-serif"; g.fillText("STEWART", 40, 130);
const pngBlob = await new Promise((r) => c.toBlob(r, "image/png"));
const bytes = await pngBlob.arrayBuffer();

const width = 180, height = Math.round(200 / 600 * width);

const doc = new Document({ sections: [{ children: [
  new Paragraph({ alignment: AlignmentType.RIGHT, children: [
    new ImageRun({ type: "png", data: bytes, transformation: { width, height }, altText: { title: "Logo", description: "Company logo", name: "logo" } }),
  ]}),
  new Paragraph({ children: [new TextRun({ text: "Letterhead body starts here.", size: 22 })] }),
]}]});

download(await docx.Packer.toBlob(doc), "image.docx");
console.log(`Generated image.docx with a ${width}x${height}px logo (${bytes.byteLength} bytes)`);
```

### Quiz

1. `transformation.width` is measured in…
- [ ] Twips
- [ ] Inches
- [x] Pixels
> docx converts pixels to EMUs at 9525 EMU per pixel.

2. What is required for `ImageRun` in docx v9 that was optional before?
- [x] `type`
- [ ] `altText`
- [ ] `floating`
> v9 removed automatic type sniffing; you must state `png`, `jpg`, `gif`, `bmp` or `svg`.

3. How do you put an image behind the text as a watermark?
- [ ] `transformation.rotation`
- [x] `floating.behindDocument: true`
- [ ] Put it in a header
> Floating images with `behindDocument` render under the body text.

### Exercises

1. **Aspect-safe helper** — Write `img(bytes, naturalW, naturalH, width)` that returns an `ImageRun` with the height computed.
<details><summary>Solution</summary>

```js
const img = (bytes, nw, nh, width, type = "png") =>
  new docx.ImageRun({ type, data: bytes, transformation: { width, height: Math.round((nh / nw) * width) } });
const c = document.createElement("canvas"); c.width = 400; c.height = 100;
const bytes = await (await new Promise((r) => c.toBlob(r, "image/png"))).arrayBuffer();
const doc = new docx.Document({ sections: [{ children: [new docx.Paragraph({ children: [img(bytes, 400, 100, 200)] })] }] });
download(await docx.Packer.toBlob(doc), "img.docx");
```

</details>

2. **Two logos** — Place two images side by side in one paragraph separated by a tab-like spacer text.
<details><summary>Solution</summary>

```js
const mk = async (color) => { const c = document.createElement("canvas"); c.width = 200; c.height = 100; const g = c.getContext("2d"); g.fillStyle = color; g.fillRect(0, 0, 200, 100); return (await new Promise((r) => c.toBlob(r, "image/png"))).arrayBuffer(); };
const a = await mk("#1E5AA8"), b = await mk("#B7472A");
const run = (d) => new docx.ImageRun({ type: "png", data: d, transformation: { width: 100, height: 50 } });
const doc = new docx.Document({ sections: [{ children: [new docx.Paragraph({ children: [run(a), new docx.TextRun("     "), run(b)] })] }] });
download(await docx.Packer.toBlob(doc), "two.docx");
```

</details>

### Interview Questions

**Q: How does docx position and size images in the XML, and why does that matter?**
An `ImageRun` becomes a `w:drawing` containing either `wp:inline` or `wp:anchor`. Sizes go into `wp:extent` in EMUs, and docx converts your pixel values at 9525 EMU per pixel, which corresponds to 96 DPI. Knowing this lets me reason about print size: 180 px is 1.875 inches regardless of the source image's own DPI. It also explains why a high-resolution logo must still be given explicit dimensions, because the XML extent, not the image header, controls the rendered size.

**Q: What changed for images between docx v8 and v9?**
In v8 `ImageRun` sniffed the image type from the bytes; in v9 the `type` option is mandatory and must be one of `png`, `jpg`, `gif`, `bmp` or `svg`. v9 also added SVG support with a required `fallback` raster image, because Word 2016 and older, LibreOffice and many converters cannot render SVG drawings. When I upgraded the template suite I added a `type` derived from the file extension in my asset loader so the change was one function.

**Q: When would you use a floating image instead of inline, and what are the pitfalls?**
Floating for letterhead logos anchored to the page corner, watermarks behind text, and pull-out figures with wrapped text. Inline for anything that should flow with content, such as charts in a report. Pitfalls: floating positions are relative to page, margin, column or paragraph and the wrong `relative` value moves the logo when margins change; offsets are in EMUs, not pixels; and PDF converters handle `behindDocument` inconsistently, so for watermarks I test the exact converter the client uses.

## Headers, footers & page numbers

Headers and footers are per section and can differ for the first page and for even pages. Page numbers are **fields**, so Word computes them at display time; docx gives you the `PageNumber` constants to insert those fields.

### A header and a footer

```js
const { Header, Footer, Paragraph, TextRun, AlignmentType, PageNumber } = docx;

sections: [{
  headers: {
    default: new Header({ children: [
      new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Rate Manual – Wyoming", color: "888888", size: 18 })] }),
    ]}),
  },
  footers: {
    default: new Footer({ children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], size: 18 }),
      ]}),
    ]}),
  },
  children: [/* body */],
}]
```

`PageNumber.CURRENT` becomes a `PAGE` field and `PageNumber.TOTAL_PAGES` a `NUMPAGES` field. Both go in the `children` array of a `TextRun`, mixed with plain strings. `PageNumber.TOTAL_PAGES_IN_SECTION` maps to `SECTIONPAGES`, useful when each section is numbered independently.

### Different first page

Title pages should not show "Page 1 of 300". Set `titlePage: true` and provide a `first` header/footer (which may be empty):

```js
properties: { titlePage: true },
headers: { default: runningHeader, first: new Header({ children: [] }) },
footers: { default: pageFooter, first: new Footer({ children: [] }) },
```

For book-style layouts use `even` too, and set `evenAndOddHeaderAndFooters: true` at the `Document` level so Word honours it.

### Restarting and formatting numbers

Front matter in roman numerals, body in decimal, both restarting at 1:

```js
const { NumberFormat } = docx;

sections: [
  { properties: { page: { pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } } }, footers: { default: pageFooter }, children: frontMatter },
  { properties: { page: { pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } }, footers: { default: pageFooter }, children: body },
]
```

Because headers and footers are section properties, each section needs its own reference, even if it is the same object. Word's "Link to previous" behaviour is what you get when you omit them: the section inherits the previous section's header and footer.

### Tables and logos in headers

A header's `children` accept the same block content as a section: paragraphs, tables and images. A two-column letterhead header is a borderless table with the logo in the left cell and the address in the right cell. Keep header images small; they are repeated in the layout of every page and slow Word's scrolling if large.

| Task | Where |
|---|---|
| Company name top-left, page top-right | one paragraph with a right tab stop |
| Logo + address | borderless 2-cell table |
| "Confidential" watermark | floating image with `behindDocument` in the header |
| Chapter title in header | `STYLEREF` field; not built into docx, use `SimpleField` |

> **Tip:** Word renders fields such as `NUMPAGES` at open time, so generated files always show the correct total even after the client edits them. This is why you should never hard-code "of 42".

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber, AlignmentType, HeadingLevel, PageBreak, NumberFormat } = docx;

const running = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Employee Handbook 2026", color: "888888", size: 18 })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], size: 18, color: "888888" }),
]})]});

const doc = new Document({
  sections: [
    {
      properties: { titlePage: true, page: { pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } } },
      headers: { default: running, first: new Header({ children: [] }) },
      footers: { default: footer, first: new Footer({ children: [] }) },
      children: [
        new Paragraph({ text: "Employee Handbook", heading: HeadingLevel.TITLE }),
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ text: "Preface", heading: HeadingLevel.HEADING_1 }),
        new Paragraph("This page is numbered ii in roman numerals."),
      ],
    },
    {
      properties: { page: { pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      headers: { default: running },
      footers: { default: footer },
      children: [
        new Paragraph({ text: "1. Welcome", heading: HeadingLevel.HEADING_1 }),
        new Paragraph("Body numbering restarts at 1 here."),
      ],
    },
  ],
});

download(await docx.Packer.toBlob(doc), "headers.docx");
console.log("Generated headers.docx");
```

### Quiz

1. `PageNumber.CURRENT` inserts which Word field?
- [x] `PAGE`
- [ ] `NUMPAGES`
- [ ] `SECTIONPAGES`
> `TOTAL_PAGES` is `NUMPAGES` and `TOTAL_PAGES_IN_SECTION` is `SECTIONPAGES`.

2. To hide the footer on a title page you…
- [ ] Set `footer: null`
- [x] Set `titlePage: true` and provide an empty `first` footer
- [ ] Start the body in a new document
> The first-page footer is a separate footer part that you leave empty.

3. Where is the page-number format (roman/decimal) configured?
- [ ] On the `Footer`
- [x] In the section's `page.pageNumbers`
- [ ] On the `TextRun`
> Numbering start and format are section properties in `w:pgNumType`.

### Exercises

1. **Left/right footer** — Put the document title on the left and the page number on the right of the footer using a right tab stop.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, Footer, PageNumber, TabStopType, TabStopPosition, Tab } = docx;
const footer = new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
  children: [new TextRun("Rate Manual"), new TextRun({ children: [new Tab(), "Page ", PageNumber.CURRENT] })],
})]});
const doc = new Document({ sections: [{ footers: { default: footer }, children: [new Paragraph("Body")] }] });
download(await Packer.toBlob(doc), "footer.docx");
```

</details>

2. **Section page counts** — Make a footer that shows "Page X of Y in this section".
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, Footer, PageNumber } = docx;
const footer = new Footer({ children: [new Paragraph({ children: [new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES_IN_SECTION, " in this section"] })] })] });
const doc = new Document({ sections: [{ footers: { default: footer }, children: [new Paragraph("Body")] }] });
download(await Packer.toBlob(doc), "section-pages.docx");
```

</details>

### Interview Questions

**Q: How are page numbers implemented in a .docx, and what does that mean for generated files?**
They are fields: `w:fldSimple w:instr="PAGE"` or a complex field with `PAGE`/`NUMPAGES` instructions. Word evaluates them at layout time, so the document itself never stores a number. docx writes those fields when you use `PageNumber.CURRENT` and `PageNumber.TOTAL_PAGES` inside a run. The consequence is that generated documents are always correct even after editing, but converters that do not lay out pages, like some HTML exporters, show the cached value or nothing, so I test the client's downstream tools.

**Q: Explain how different first-page and section-specific headers work.**
Each section can have `default`, `first` and `even` header and footer parts. The `first` variants are only used when the section has `titlePage: true`, and `even` only when the document sets `evenAndOddHeaderAndFooters`. A section that does not specify headers inherits the previous section's, which is Word's "Link to Previous". For a handbook I typically have a cover section with empty first header and footer, a front-matter section with roman numerals, and a body section with decimal numbering restarting at 1.

**Q: A client wants the current chapter title in the header. How do you do it?**
Word does this with a `STYLEREF "Heading 1"` field, which docx does not have a dedicated class for, so I emit it with `new SimpleField('STYLEREF "Heading 1"')` inside the header paragraph. Word evaluates it per page and shows the nearest Heading 1 text. The alternative is one section per chapter with a hard-coded header, which is more work but renders in every viewer, so I choose based on whether the deliverable is Word-only or also PDF from LibreOffice.

# LEVEL: Advanced

## Tabs & alignment

Tab stops are how Word aligns text in columns without a table: a right-aligned page number after dot leaders, a label on the left with a value flush right, a decimal-aligned column of amounts. docx exposes them through `tabStops` on `Paragraph` and the `Tab` run element.

### Defining tab stops

```js
const { Paragraph, TextRun, Tab, TabStopType, TabStopPosition, LeaderType } = docx;

new Paragraph({
  tabStops: [
    { type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: LeaderType.DOT },
  ],
  children: [
    new TextRun("Owner's policy premium"),
    new TextRun({ children: [new Tab(), "$1,250.00"] }),
  ],
});
```

`position` is in twips from the left margin. `TabStopPosition.MAX` is 9026 twips, roughly the right margin of a US Letter page with 1-inch margins. `new Tab()` inserts the tab character as its own run child; the text after it aligns to the next stop.

Types available in `TabStopType`: `LEFT`, `CENTER`, `RIGHT`, `DECIMAL`, `BAR`, `CLEAR`, `NUM`. Leaders in `LeaderType`: `DOT`, `HYPHEN`, `UNDERSCORE`, `MIDDLE_DOT`, `HEAVY`, `NONE`.

### Decimal alignment for money

```js
new Paragraph({
  tabStops: [{ type: TabStopType.DECIMAL, position: 5000 }],
  children: [new TextRun("Endorsement 100"), new TextRun({ children: [new Tab(), "25.00"] })],
});
new Paragraph({
  tabStops: [{ type: TabStopType.DECIMAL, position: 5000 }],
  children: [new TextRun("Endorsement 116"), new TextRun({ children: [new Tab(), "1,125.50"] })],
});
```

Decimal points line up at 5000 twips regardless of how many digits precede them: the same look as a rate card produced in Word by hand, but generated from data.

### Multiple stops in one line

A signature line often needs three columns: name, title, date.

```js
new Paragraph({
  tabStops: [
    { type: TabStopType.LEFT, position: 3600 },
    { type: TabStopType.LEFT, position: 6800 },
  ],
  children: [
    new TextRun({ children: ["Signed: ____________", new Tab(), "Title: __________", new Tab(), "Date: ________"] }),
  ],
});
```

### Tabs in styles

A tab stop defined on a paragraph style applies to every paragraph using it, which keeps TOC-like lists or price lists consistent:

```js
paragraphStyles: [{
  id: "PriceLine", name: "Price Line", basedOn: "Normal",
  paragraph: { tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: LeaderType.DOT }] },
}]
```

### Alignment beyond tabs

| Need | Tool |
|---|---|
| Whole paragraph centred | `alignment: AlignmentType.CENTER` |
| Left text with right-aligned value | right tab stop |
| Columns of numbers | decimal tab stop or a table |
| Text vertically centred on a page | section `verticalAlign: VerticalAlign.CENTER` |
| Justified body text | `alignment: AlignmentType.JUSTIFIED` |

> **Interview note:** "Why not just use spaces?" Spaces are proportional-font gambling; alignment breaks the moment the font changes or the file is opened on a Mac. Tabs and tables are deterministic.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, Tab, TabStopType, TabStopPosition, LeaderType, HeadingLevel } = docx;

const line = (label, value) => new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: LeaderType.DOT }],
  children: [new TextRun(label), new TextRun({ children: [new Tab(), value] })],
});
const money = (label, value) => new Paragraph({
  tabStops: [{ type: TabStopType.DECIMAL, position: 5400 }],
  children: [new TextRun(label), new TextRun({ children: [new Tab(), value] })],
});

const doc = new Document({ sections: [{ children: [
  new Paragraph({ text: "Premium Quote", heading: HeadingLevel.HEADING_1 }),
  line("Owner's policy", "$1,250.00"),
  line("Lender's policy (simultaneous issue)", "$150.00"),
  line("Endorsements", "$75.00"),
  new Paragraph({ text: "Decimal aligned", heading: HeadingLevel.HEADING_2 }),
  money("ALTA 8.1", "25.00"),
  money("ALTA 9", "1,125.50"),
  money("ALTA 22", "5.00"),
  new Paragraph({
    spacing: { before: 600 },
    tabStops: [{ type: TabStopType.LEFT, position: 3600 }, { type: TabStopType.LEFT, position: 6800 }],
    children: [new TextRun({ children: ["Signed: ____________", new Tab(), "Title: __________", new Tab(), "Date: ________"] })],
  }),
]}]});

download(await docx.Packer.toBlob(doc), "tabs.docx");
console.log("Generated tabs.docx");
```

### Quiz

1. What does `TabStopPosition.MAX` represent?
- [ ] The page width
- [x] About 9026 twips, near the right margin of a Letter page with 1" margins
- [ ] Infinity
> It is a convenience constant for a right-margin tab on the default page.

2. Which tab type lines up currency amounts on the decimal point?
- [ ] `RIGHT`
- [x] `DECIMAL`
- [ ] `CENTER`
> A decimal tab aligns the decimal separator at the stop position.

3. How is a tab character inserted into a run?
- [x] `new Tab()` inside the run's `children`
- [ ] `tab: true` on the paragraph
- [ ] A literal `\t` in a `Paragraph` string argument
> `Tab` is a run-level element; the paragraph only defines where stops are.

### Exercises

1. **Manual TOC line** — Produce three lines "Chapter … page" using a dot leader.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, Tab, TabStopType, TabStopPosition, LeaderType } = docx;
const rows = [["1. Purpose", "1"], ["2. Definitions", "3"], ["3. Procedure", "7"]];
const children = rows.map(([t, p]) => new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: LeaderType.DOT }],
  children: [new TextRun(t), new TextRun({ children: [new Tab(), p] })],
}));
download(await Packer.toBlob(new Document({ sections: [{ children }] })), "manual-toc.docx");
```

</details>

2. **Centred header line** — Use a centre tab at 4513 twips and a right tab at 9026 so a line shows Left | Centre | Right text.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, Tab, TabStopType } = docx;
const p = new Paragraph({
  tabStops: [{ type: TabStopType.CENTER, position: 4513 }, { type: TabStopType.RIGHT, position: 9026 }],
  children: [new TextRun({ children: ["Stewart Title", new Tab(), "Weekly Report", new Tab(), "12 Sep 2026"] })],
});
download(await Packer.toBlob(new Document({ sections: [{ children: [p] }] })), "three-col.docx");
```

</details>

### Interview Questions

**Q: When do you choose tab stops over a table for aligned content?**
Tabs for single-line, label/value or list-like content where the client expects a "typed" look: price lists, TOC-style lines, signature blocks, header bars. Tables when content wraps to multiple lines, needs borders or shading, or has more than three columns. Tabs keep the document lighter and behave naturally when the user edits text; tables are more robust when values are long. In generated documents I make the decision per component and encode it in a helper so all 21 templates agree.

**Q: How do tab stops interact with styles and indents?**
Tab stops can live on the paragraph or on its style, and the paragraph's stops add to or clear the style's. Positions are measured from the left margin, not from the indent, so a paragraph with a 720-twip left indent and a stop at 720 has text starting right at the indent. Word also has default tab stops every 720 twips when no custom stop is beyond the current position, which is why text sometimes jumps unexpectedly; defining an explicit stop removes the ambiguity.

**Q: How would you generate a dot-leader price list that stays aligned in both Word and the PDF export?**
Use one paragraph per line with a single `RIGHT` tab stop at the text width with `LeaderType.DOT`, and put the amount after a `Tab` in the same paragraph. I compute the position from page width minus margins rather than using `TabStopPosition.MAX` when the page is A4 or has non-standard margins, otherwise the leader runs past the margin in PDF. I also avoid trailing spaces before the tab, which produce visible gaps in the leader.

## Table of contents with updateFields

A Word TOC is a field: `TOC \o "1-3" \h \z \u`. Word evaluates it, scanning heading paragraphs and their page numbers. docx inserts the field with `TableOfContents`; because the library does not lay out pages, it cannot compute the numbers itself, so it asks Word to update all fields on open.

### Inserting a TOC

```js
const { Document, TableOfContents, Paragraph, HeadingLevel, PageBreak } = docx;

const doc = new Document({
  features: { updateFields: true },
  sections: [{ children: [
    new Paragraph({ text: "Contents", heading: HeadingLevel.HEADING_1 }),
    new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ text: "1. Purpose", heading: HeadingLevel.HEADING_1 }),
    // ...
  ]}],
});
```

- The first argument is an alias/caption for the field.
- `headingStyleRange: "1-3"` includes Heading 1 to Heading 3 (the `\o` switch).
- `hyperlink: true` makes entries clickable (`\h`).
- `features.updateFields` writes `w:updateFields` in `settings.xml`, so Word shows "This document contains fields that may refer to other files. Do you want to update the fields?" on open. Clicking Yes fills the TOC.

Without `updateFields` the TOC appears empty until the user presses F9 or right-clicks → Update Field.

### Including custom styles

If chapters use your own `ChapterTitle` style, tell the TOC to include it with a level:

```js
const { StyleLevel } = docx;

new TableOfContents("Contents", {
  hyperlink: true,
  headingStyleRange: "1-2",
  stylesWithLevels: [new StyleLevel("ChapterTitle", 1), new StyleLevel("AppendixTitle", 1)],
});
```

This adds the `\t "ChapterTitle,1,AppendixTitle,1"` switch. The custom style should also carry `outlineLevel` so the Navigation Pane agrees with the TOC.

### Other options

| Option | Switch | Effect |
|---|---|---|
| `hideTabAndPageNumbersInWebLayout` | `\z` | hides page numbers in Web view |
| `useAppliedParagraphOutlineLevel` | `\u` | includes paragraphs with an outline level but no heading style |
| `preserveTabInEntries` | `\w` | keeps tabs inside entries |
| `preserveNewLineInEntries` | `\x` | keeps manual line breaks |
| `entriesFromBookmark` | `\b` | builds the TOC from a bookmarked range only |
| `captionLabel` | `\c` | builds a table of figures from captions |

### Styling the entries

Word formats TOC lines with built-in styles `TOC 1`, `TOC 2`, `TOC 3`. Define them in `paragraphStyles` with ids `TOC1`, `TOC2`, `TOC3` to control font, indent and dot leaders:

```js
{ id: "TOC1", name: "toc 1", basedOn: "Normal", next: "Normal",
  run: { bold: true, size: 22 },
  paragraph: { spacing: { before: 120 }, tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX, leader: docx.LeaderType.DOT }] } },
{ id: "TOC2", name: "toc 2", basedOn: "Normal", next: "Normal",
  run: { size: 20 }, paragraph: { indent: { left: 440 }, tabStops: [{ type: docx.TabStopType.RIGHT, position: docx.TabStopPosition.MAX, leader: docx.LeaderType.DOT }] } },
```

### Non-Word viewers

LibreOffice updates the TOC through Tools → Update → Update All; Google Docs ignores the update flag entirely and shows an empty field until the user inserts its own TOC. For a PDF deliverable, the reliable path is: generate `.docx` → open in Word or LibreOffice headless → update fields → export PDF. A 767-page handbook needs this pipeline scripted, not clicked.

> **Warning:** The update prompt cannot be suppressed without a macro. Tell clients to expect it, or run the file through LibreOffice headless (`soffice --headless --convert-to docx`) which updates fields and saves a copy with a filled TOC and no prompt.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TableOfContents, HeadingLevel, PageBreak, TabStopType, TabStopPosition, LeaderType } = docx;

const tocTab = { type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: LeaderType.DOT };
const chapters = [
  ["1. Purpose", ["1.1 Scope", "1.2 Audience"]],
  ["2. Title Search Procedure", ["2.1 Opening the order", "2.2 Chain of title", "2.3 Liens and judgments"]],
  ["3. Quality Control", ["3.1 Sampling", "3.2 Scoring"]],
];
const body = [];
chapters.forEach(([h1, subs], i) => {
  body.push(new Paragraph({ text: h1, heading: HeadingLevel.HEADING_1, pageBreakBefore: i > 0 }));
  subs.forEach((h2) => { body.push(new Paragraph({ text: h2, heading: HeadingLevel.HEADING_2 })); body.push(new Paragraph("Section text.")); });
});

const doc = new Document({
  features: { updateFields: true },
  styles: { paragraphStyles: [
    { id: "TOC1", name: "toc 1", basedOn: "Normal", next: "Normal", run: { bold: true }, paragraph: { spacing: { before: 120 }, tabStops: [tocTab] } },
    { id: "TOC2", name: "toc 2", basedOn: "Normal", next: "Normal", paragraph: { indent: { left: 440 }, tabStops: [tocTab] } },
  ]},
  sections: [{ children: [
    new Paragraph({ text: "Contents", heading: HeadingLevel.HEADING_1 }),
    new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }),
    new Paragraph({ children: [new PageBreak()] }),
    ...body,
  ]}],
});

download(await docx.Packer.toBlob(doc), "toc.docx");
console.log("Generated toc.docx – click Yes when Word asks to update fields");
```

### Quiz

1. Why is the TOC empty until Word updates fields?
- [x] docx writes the field code but does not lay out pages, so it cannot know page numbers
- [ ] The headings are missing outline levels
- [ ] `hyperlink` was not set
> Page numbers require pagination, which only a layout engine performs.

2. Which option triggers Word's "update fields" prompt on open?
- [ ] `TableOfContents.autoUpdate`
- [x] `features: { updateFields: true }` on `Document`
- [ ] `headingStyleRange`
> It writes `w:updateFields` into `settings.xml`.

3. How do you include a custom style in the TOC?
- [ ] Give it `bold: true`
- [x] `stylesWithLevels: [new StyleLevel("MyStyle", 1)]`
- [ ] Name it `Heading1`
> This adds the `\t` switch listing styles and their levels.

### Exercises

1. **Table of figures** — Insert a second TOC field that lists only paragraphs styled `Caption`.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TableOfContents, StyleLevel } = docx;
const doc = new Document({
  features: { updateFields: true },
  styles: { paragraphStyles: [{ id: "Caption", name: "Caption", basedOn: "Normal", run: { italics: true } }] },
  sections: [{ children: [
    new TableOfContents("Figures", { stylesWithLevels: [new StyleLevel("Caption", 1)], hyperlink: true }),
    new Paragraph({ style: "Caption", text: "Figure 1 – Approval flow" }),
    new Paragraph({ style: "Caption", text: "Figure 2 – Rate zones" }),
  ]}],
});
download(await Packer.toBlob(doc), "figures.docx");
```

</details>

2. **Deep TOC** — Generate headings to level 3 and a TOC with `headingStyleRange: "1-3"`.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TableOfContents, HeadingLevel } = docx;
const doc = new Document({ features: { updateFields: true }, sections: [{ children: [
  new TableOfContents("Contents", { headingStyleRange: "1-3", hyperlink: true }),
  new Paragraph({ text: "1 Rates", heading: HeadingLevel.HEADING_1 }),
  new Paragraph({ text: "1.1 Owner", heading: HeadingLevel.HEADING_2 }),
  new Paragraph({ text: "1.1.1 Standard", heading: HeadingLevel.HEADING_3 }),
]}]});
download(await Packer.toBlob(doc), "deep-toc.docx");
```

</details>

### Interview Questions

**Q: How does a Word table of contents work, and what does docx actually write?**
A TOC is a complex field with an instruction like `TOC \o "1-3" \h \z \u`. Word evaluates the instruction, walks paragraphs with heading styles or outline levels, and writes entries styled `TOC 1..n` with page numbers inside the field result. docx writes the field begin, instruction and end plus an empty result, and optionally sets `updateFields` in settings so Word rebuilds it on open. That is why generated files show a prompt and why the TOC is blank in viewers that never evaluate fields.

**Q: How do you produce a PDF with a correct TOC from a generated docx without a human clicking Yes?**
Run the file through a layout engine headlessly. LibreOffice with `soffice --headless --convert-to pdf` updates fields during conversion in most versions; if the client needs Word fidelity, I use a Word automation step (PowerShell with `Document.Fields.Update()` then `ExportAsFixedFormat`) on a Windows box. For the 767-page handbook I scripted the LibreOffice route and diffed the TOC page numbers against Word's once to confirm they matched, then documented that the PDF comes from LibreOffice.

**Q: What are the pitfalls of TOCs in generated documents?**
Custom heading styles without `outlineLevel` are missed unless listed in `stylesWithLevels`. Headings inside tables or text boxes may appear with wrong numbers. Long entries wrap under the page number unless `TOC n` styles have a right indent. Word's update prompt confuses non-technical users, so the delivery notes must mention it. And a TOC placed before a title page shifts page numbers unless the sections restart numbering appropriately; I always verify by opening the file, updating, and checking the last entry against the actual page.

## Hyperlinks, bookmarks & footnotes

Long documents need internal navigation ("see Section 4.2"), external links (the state insurance department's rate filing portal) and footnotes for sources. docx supports all three with dedicated classes.

### External hyperlinks

```js
const { Paragraph, TextRun, ExternalHyperlink } = docx;

new Paragraph({
  children: [
    new TextRun("Rates are filed with the "),
    new ExternalHyperlink({
      link: "https://doi.wyo.gov/",
      children: [new TextRun({ text: "Wyoming Department of Insurance", style: "Hyperlink" })],
    }),
    new TextRun("."),
  ],
});
```

`ExternalHyperlink` goes in a paragraph's `children`, and its own `children` are runs. The built-in `Hyperlink` character style gives the blue underline; docx defines it for you, and you can restyle it via `styles.default.hyperlink`. The link can also be `mailto:` or a file path.

### Bookmarks and internal hyperlinks

A bookmark marks a range with an id; an internal hyperlink jumps to it.

```js
const { Bookmark, InternalHyperlink, HeadingLevel } = docx;

// target
new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new Bookmark({ id: "rate-matrix", children: [new TextRun("4.2 Rate Matrix")] })],
});

// link
new Paragraph({
  children: [
    new TextRun("Premiums are listed in "),
    new InternalHyperlink({ anchor: "rate-matrix", children: [new TextRun({ text: "Section 4.2", style: "Hyperlink" })] }),
    new TextRun("."),
  ],
});
```

Bookmark ids must be unique in the document, start with a letter, and avoid spaces. Word's own "top of document" bookmark is `_top`.

### Page references

"See page 17" that updates itself is a `PAGEREF` field:

```js
const { PageReference } = docx;
new Paragraph({ children: [new TextRun("See page "), new PageReference("rate-matrix", { hyperlink: true })] });
```

Like the TOC, it needs a field update in Word to show the number, so pair it with `features: { updateFields: true }`.

### Footnotes

Footnotes are declared on the `Document` and referenced by number:

```js
const { FootnoteReferenceRun } = docx;

const doc = new Document({
  footnotes: {
    1: { children: [new Paragraph("Rates effective 1 Jan 2026 per filing WY-2025-118.")] },
    2: { children: [new Paragraph("Simultaneous issue applies when both policies close together.")] },
  },
  sections: [{ children: [
    new Paragraph({ children: [
      new TextRun("Owner's premium is calculated from the rate matrix"),
      new FootnoteReferenceRun(1),
      new TextRun(". A lender's policy issued at the same time is discounted"),
      new FootnoteReferenceRun(2),
      new TextRun("."),
    ]}),
  ]}],
});
```

Word renders the numbers as superscripts using the `FootnoteReference` style and places the notes at the bottom of the page. Numbering is automatic and sequential in document order, regardless of the keys you use, so the keys are just labels for your code.

### Comments

Review comments are similar: declare `comments: { children: [{ id: 0, author: "Ali Raza", date: new Date(), children: [new Paragraph("Confirm this rate.")] }] }` on the document, then wrap the target text in `CommentRangeStart(0)`, the runs, `CommentRangeEnd(0)` and a `CommentReference(0)` run. This is useful when generating a draft for the client to review.

| Feature | Declared on | Referenced with |
|---|---|---|
| External link | inline | `ExternalHyperlink` |
| Internal link | `Bookmark` | `InternalHyperlink`, `PageReference` |
| Footnote | `Document.footnotes` | `FootnoteReferenceRun(n)` |
| Comment | `Document.comments` | `CommentRangeStart/End`, `CommentReference` |

> **Tip:** Generate bookmark ids from heading text with a slugify function and keep a map of heading → id. Then any "see Section X" reference in your content data can be turned into a working link automatically.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink, InternalHyperlink, Bookmark, FootnoteReferenceRun, HeadingLevel, PageBreak } = docx;

const doc = new Document({
  footnotes: {
    1: { children: [new Paragraph("Rates effective 1 Jan 2026 per filing WY-2025-118.")] },
  },
  sections: [{ children: [
    new Paragraph({ text: "1. Overview", heading: HeadingLevel.HEADING_1 }),
    new Paragraph({ children: [
      new TextRun("Premiums are taken from the "),
      new InternalHyperlink({ anchor: "rate-matrix", children: [new TextRun({ text: "rate matrix in Section 2", style: "Hyperlink" })] }),
      new TextRun(" and are filed with the "),
      new ExternalHyperlink({ link: "https://doi.wyo.gov/", children: [new TextRun({ text: "Wyoming Department of Insurance", style: "Hyperlink" })] }),
      new FootnoteReferenceRun(1),
      new TextRun("."),
    ]}),
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new Bookmark({ id: "rate-matrix", children: [new TextRun("2. Rate Matrix")] })] }),
    new Paragraph("The matrix table would follow here."),
  ]}],
});

download(await docx.Packer.toBlob(doc), "links.docx");
console.log("Generated links.docx – Ctrl+click the links in Word");
```

### Quiz

1. Which class marks the destination of an internal link?
- [ ] `InternalHyperlink`
- [x] `Bookmark`
- [ ] `PageReference`
> Bookmarks define a named range; internal hyperlinks and page references point to them.

2. Footnote content is declared where?
- [x] In `Document`'s `footnotes` option
- [ ] Inside `FootnoteReferenceRun`
- [ ] In the section footer
> The run only references the footnote by its key.

3. What gives a link its blue underline?
- [ ] `ExternalHyperlink` adds it automatically to the text
- [x] The `Hyperlink` character style on the inner `TextRun`
- [ ] `underline: true` is mandatory
> Without `style: "Hyperlink"` the link works but looks like normal text.

### Exercises

1. **Email link** — Make "Contact the underwriter" a `mailto:` link.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink } = docx;
const p = new Paragraph({ children: [new ExternalHyperlink({ link: "mailto:underwriting@example.com?subject=Rate%20question",
  children: [new TextRun({ text: "Contact the underwriter", style: "Hyperlink" })] })] });
download(await Packer.toBlob(new Document({ sections: [{ children: [p] }] })), "mailto.docx");
```

</details>

2. **Auto bookmarks** — Given an array of heading strings, generate bookmarked headings and a list of internal links to each.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, Bookmark, InternalHyperlink, HeadingLevel } = docx;
const slug = (s) => "h-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const heads = ["Purpose", "Procedure", "Records"];
const links = heads.map((h) => new Paragraph({ children: [new InternalHyperlink({ anchor: slug(h), children: [new TextRun({ text: h, style: "Hyperlink" })] })] }));
const targets = heads.map((h) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new Bookmark({ id: slug(h), children: [new TextRun(h)] })] }));
download(await Packer.toBlob(new Document({ sections: [{ children: [...links, ...targets] }] })), "auto-bm.docx");
```

</details>

### Interview Questions

**Q: How are hyperlinks stored in a .docx and how does that affect generation?**
External links are relationships: `w:hyperlink r:id="rIdN"` in the document points at an entry in `document.xml.rels` with the target URL and `TargetMode="External"`. Internal links use `w:hyperlink w:anchor="bookmark"` and need a matching `w:bookmarkStart`/`w:bookmarkEnd` pair. docx manages the relationship ids for you, which is one of the reasons hand-editing XML is painful and a library is worth using. It also means a broken bookmark id produces a link that silently does nothing, so I validate that every anchor has a bookmark before packing.

**Q: How do footnotes differ from endnotes and how would you support both?**
Footnotes appear at the bottom of the page containing the reference; endnotes collect at the end of the document or section. docx supports footnotes natively through `Document.footnotes` and `FootnoteReferenceRun`. Endnotes are not exposed as a first-class API, so for a legal client who required endnotes I generated the references as superscript runs with internal hyperlinks to a numbered "Notes" section at the end, which renders identically in Word and PDF and is editable by the client.

**Q: A generated document has 300 cross-references. How do you keep them correct?**
Treat headings as data with stable ids. Each heading in the content model gets a slug-based bookmark id, and references in the content are written as `{ref: "rate-matrix"}` rather than typed text. The generator resolves each ref to an `InternalHyperlink` plus a `PageReference`, and a pre-pack check throws if a ref has no target. With `updateFields` on, Word fills in page numbers at open time, so renumbering chapters never breaks references.

## Fonts & brand typography

A brand template is mostly typography: the right family, sizes and weights applied consistently. docx controls fonts at three levels (document defaults, styles, runs) and, since v9.1, can embed font files so the client sees the brand font even without it installed.

### Setting fonts

```js
const doc = new docx.Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },   // body: Calibri 11 pt
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Georgia", size: 32, bold: true, color: "1E5AA8" }, paragraph: { outlineLevel: 0, spacing: { before: 360, after: 120 } } },
    ],
  },
  sections: [{ children: [
    new docx.Paragraph({ children: [new docx.TextRun({ text: "Inline override in Consolas", font: "Consolas" })] }),
  ]}],
});
```

The `font` string must be the family name exactly as Windows or macOS reports it: "Calibri Light", "Segoe UI Semibold", "Times New Roman".

### Font slots

Office Open XML actually stores four font slots per run: ASCII, high ANSI, East Asian and complex script. `font: "Calibri"` sets all of them. When a document mixes Latin text with Urdu or Arabic (complex script), set them separately:

```js
new docx.TextRun({
  text: "Policy — پالیسی",
  font: { name: "Calibri", hint: "cs" },
  rightToLeft: false,
})
```

The object form accepts `name` plus `hint`, and the underlying style supports `ascii`, `hAnsi`, `eastAsia` and `cs` names. For bidirectional paragraphs also set `bidirectional: true` on the paragraph.

### Theme fonts versus explicit fonts

Word templates often reference theme fonts ("+Headings", "+Body") so that changing the theme changes everything. docx writes explicit family names, which is more predictable across machines. If a client's `.dotx` uses theme fonts and you must match it, use the same family names the theme resolves to (visible in Word under Design → Fonts).

### Embedding fonts (v9.1+)

```js
const doc = new docx.Document({
  fonts: [
    { name: "Inter", data: fs.readFileSync("fonts/Inter-Regular.ttf"), characterSet: docx.CharacterSet.ANSI },
    { name: "Inter Bold", data: fs.readFileSync("fonts/Inter-Bold.ttf") },
  ],
  styles: { default: { document: { run: { font: "Inter" } } } },
  sections: [/* … */],
});
```

Embedded fonts are obfuscated and stored under `word/fonts/`, the same mechanism as Word's "Embed fonts in the file" option. Check the font licence: many commercial fonts forbid embedding, and Google Fonts (OFL) allow it.

### Safe font choices

| Need | Windows | macOS | Cross-platform fallback |
|---|---|---|---|
| Body sans | Calibri, Segoe UI | Helvetica Neue | Arial |
| Body serif | Cambria, Georgia | Georgia | Times New Roman |
| Monospace | Consolas | Menlo | Courier New |
| Symbols/check marks | Segoe UI Symbol | Apple Symbols | embed a font |

Word substitutes silently when a font is missing, which changes line breaks and page counts: a 767-page handbook can become 780 pages on a Mac. Either embed the font, choose one available on both platforms, or deliver PDF alongside the DOCX.

> **Interview note:** Ask "who opens this file and on what?" before choosing fonts. The answer decides between embedding, substitution-safe families, or PDF delivery.

### Character-level typography

```js
new docx.TextRun({ text: "STEWART TITLE", allCaps: true, characterSpacing: 40, size: 20, font: "Calibri" })
```

`characterSpacing` is in twips (40 = 2 pt tracking), and `allCaps`/`smallCaps` are the brand-friendly alternatives to typing capitals, because the underlying text stays editable and searchable.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Georgia", size: 32, bold: true, color: "1E5AA8" }, paragraph: { outlineLevel: 0, spacing: { before: 360, after: 120 } } },
      { id: "Brand", name: "Brand", basedOn: "Normal", run: { font: "Calibri", allCaps: true, characterSpacing: 40, size: 20, color: "888888" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 480 } } },
    ],
  },
  sections: [{ children: [
    new Paragraph({ style: "Brand", text: "Stewart Title of Wyoming" }),
    new Paragraph({ text: "Rate Manual", heading: HeadingLevel.HEADING_1 }),
    new Paragraph("Body text inherits Calibri 11 pt from the document defaults."),
    new Paragraph({ children: [new TextRun({ text: "Filing number RATE-WY-2026-03", font: "Consolas", size: 20 })] }),
    new Paragraph({ children: [new TextRun({ text: "Serif emphasis for quotes.", font: "Georgia", italics: true })] }),
  ]}],
});

download(await docx.Packer.toBlob(doc), "fonts.docx");
console.log("Generated fonts.docx");
```

### Quiz

1. Where should the brand body font be set so every paragraph inherits it?
- [x] `styles.default.document.run.font`
- [ ] On each `TextRun`
- [ ] In `Document.creator`
> Document defaults are the base of the inheritance chain.

2. What happens when a document asks for a font the reader's machine lacks?
- [ ] Word refuses to open it
- [x] Word substitutes silently, possibly changing pagination
- [ ] The text becomes invisible
> Substitution alters metrics, which is why page counts drift across machines.

3. Font embedding in docx requires which version?
- [ ] v7
- [ ] v8
- [x] v9.1 or later
> The `fonts` option on `Document` was added in the 9.1 release.

### Exercises

1. **Letter-spaced footer** — Create a paragraph in small caps with 1.5 pt tracking.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun } = docx;
const p = new Paragraph({ children: [new TextRun({ text: "Confidential – Internal Use Only", smallCaps: true, characterSpacing: 30, size: 18 })] });
download(await Packer.toBlob(new Document({ sections: [{ children: [p] }] })), "smallcaps.docx");
```

</details>

2. **Font audit** — Write a function that takes the fonts used in a template and returns those not in a safe list.
<details><summary>Solution</summary>

```js
const SAFE = new Set(["Calibri", "Arial", "Georgia", "Times New Roman", "Consolas", "Courier New"]);
const audit = (fonts) => fonts.filter((f) => !SAFE.has(f));
console.log(audit(["Calibri", "Georgia", "Proxima Nova", "Segoe UI Semibold"]));  // ["Proxima Nova", "Segoe UI Semibold"]
const doc = new docx.Document({ sections: [{ children: [new docx.Paragraph("Audit complete")] }] });
download(await docx.Packer.toBlob(doc), "audit.docx");
```

</details>

### Interview Questions

**Q: How do you guarantee a generated document looks the same on the client's machine?**
There is no absolute guarantee with DOCX because Word re-lays out on open, but I reduce variance: use fonts present on both Windows and macOS or embed them (docx v9.1 `fonts`), set every size and spacing explicitly in styles rather than relying on Word defaults, avoid theme fonts, and specify all four font slots when non-Latin text is present. Then I open the output in Word for Windows, Word for Mac and LibreOffice and compare page counts. When fidelity is contractual, I deliver PDF as the reference and DOCX as the editable source.

**Q: What are the four font slots and when do they matter?**
`w:rFonts` has `ascii`, `hAnsi`, `eastAsia` and `cs` attributes, selecting the font for basic Latin, extended Latin, East Asian scripts and complex scripts like Arabic and Urdu. A single `font` string sets all four; the object form lets you differ. They matter for bilingual documents such as a Lahore client's English/Urdu employee handbook, where the Latin font has no Urdu glyphs and Word would otherwise fall back unpredictably. I set `cs` to a Nastaliq-capable family and keep Latin in Calibri.

**Q: When is font embedding the wrong choice?**
When the licence forbids it, when file size matters (each embedded face adds hundreds of kilobytes across a 21-file suite), when the recipient uses Google Docs or LibreOffice which ignore embedded fonts, or when the font is standard on every target machine anyway. In those cases I choose a substitution-safe family, or deliver PDF with fonts embedded there, where embedding is universal and reliable.

## Page breaks, sections, orientation & columns

You have seen sections for page setup; this chapter combines the layout tools you use to control flow in long documents: hard page breaks, keep-together rules, mixed orientation, multi-column layouts and section starts.

### Page breaks

```js
const { Paragraph, PageBreak, HeadingLevel } = docx;

new Paragraph({ children: [new PageBreak()] });                      // explicit break paragraph
new Paragraph({ text: "2. Definitions", heading: HeadingLevel.HEADING_1, pageBreakBefore: true });   // property on the paragraph
```

`pageBreakBefore` is the cleaner option for "every chapter starts on a new page": put it on the heading and it never leaves a stray empty paragraph. In a paragraph style it applies automatically (`paragraph: { pageBreakBefore: true }` on `Heading1` is common in handbooks).

### Keeping things together

| Property | Effect |
|---|---|
| `keepNext: true` | keep with the next paragraph (headings) |
| `keepLines: true` | do not split this paragraph across pages |
| `widowControl: true` | avoid single lines at page top/bottom (default in Normal) |
| row `cantSplit: true` | table row stays on one page |

Combining `keepNext` on headings with `keepLines` on short callouts eliminates most "orphaned heading" complaints in review.

### Columns

```js
const { SectionType } = docx;

sections: [
  { children: [new Paragraph({ text: "Glossary", heading: HeadingLevel.HEADING_1 })] },
  {
    properties: { type: SectionType.CONTINUOUS, column: { count: 2, space: 720, equalWidth: true } },
    children: glossaryParagraphs,
  },
  { properties: { type: SectionType.CONTINUOUS }, children: [new Paragraph("Back to one column.")] },
]
```

A continuous section break lets columns start under a full-width heading on the same page. `space` is the gutter in twips; `separate: true` draws a line between columns. To force a column break, insert `new Paragraph({ children: [new docx.ColumnBreak()] })`.

Unequal columns use `column: { count: 2, equalWidth: false, children: [new docx.Column({ width: 5000, space: 500 }), new docx.Column({ width: 3000 })] }`.

### Section types

| Type | Use |
|---|---|
| `NEXT_PAGE` | orientation changes, chapters |
| `CONTINUOUS` | column changes, margin changes mid-page |
| `ODD_PAGE` / `EVEN_PAGE` | print books; new chapter on a right-hand page |

Headers, footers and page numbering are set per section, so when you introduce a landscape section for a table, pass the same header and footer objects again or the landscape pages come out blank.

### Page background and borders

`new Document({ background: { color: "FAFAFA" } })` colours the page; section `page.borders` draws page borders (`pageBorderTop: { style: BorderStyle.SINGLE, size: 8, color: "1E5AA8" }` and so on). Word only prints page colour if "Print background colors" is enabled, so use it for on-screen documents.

### A complete long-document skeleton

```js
sections: [
  cover,                              // titlePage, no numbers
  frontMatter,                        // roman numerals, TOC
  ...chapters.map(chapterSection),    // decimal numbers, pageBreakBefore headings
  landscapeAppendix,                  // rate matrices
  index,                              // two columns
]
```

Each function returns a section object spreading the shared page preset and header/footer objects. This shape has carried Ali's handbooks from 40 to 767 pages without structural changes.

> **Tip:** Generate section boundaries from data, not by hand: a `layout: "landscape"` flag on a chapter object in the JSON is enough for the generator to emit the right section properties.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, HeadingLevel, SectionType, PageOrientation, ColumnBreak, PageNumber, Footer, AlignmentType, convertInchesToTwip: inch } = docx;

const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ["Page ", PageNumber.CURRENT], size: 18 })] })] });
const portrait = { width: inch(8.5), height: inch(11) };
const landscape = { orientation: PageOrientation.LANDSCAPE, width: inch(11), height: inch(8.5) };
const terms = ["Abstract", "Chain of title", "Easement", "Encumbrance", "Grantor", "Lien", "Plat", "Vesting deed"];

const doc = new Document({
  sections: [
    { properties: { page: { size: portrait } }, footers: { default: footer }, children: [
      new Paragraph({ text: "1. Purpose", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "Short chapter.", keepLines: true }),
      new Paragraph({ text: "2. Definitions", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
      new Paragraph("Glossary below in two columns."),
    ]},
    { properties: { type: SectionType.CONTINUOUS, column: { count: 2, space: 720, equalWidth: true } }, footers: { default: footer }, children: [
      ...terms.slice(0, 4).map((t) => new Paragraph({ children: [new TextRun({ text: t, bold: true })] })),
      new Paragraph({ children: [new ColumnBreak()] }),
      ...terms.slice(4).map((t) => new Paragraph({ children: [new TextRun({ text: t, bold: true })] })),
    ]},
    { properties: { type: SectionType.NEXT_PAGE, page: { size: landscape } }, footers: { default: footer }, children: [
      new Paragraph({ text: "Appendix A – Rate Matrix (landscape)", heading: HeadingLevel.HEADING_1 }),
    ]},
  ],
});

download(await docx.Packer.toBlob(doc), "layout.docx");
console.log("Generated layout.docx");
```

### Quiz

1. Which is the cleanest way to start every chapter on a new page?
- [ ] An empty paragraph with `PageBreak` after each chapter
- [x] `pageBreakBefore: true` on the chapter heading (or its style)
- [ ] A new `Document` per chapter
> It leaves no stray paragraphs and travels with the style.

2. To start two columns directly under a full-width heading you need…
- [ ] `SectionType.NEXT_PAGE`
- [x] `SectionType.CONTINUOUS`
- [ ] A table with two cells
> Continuous breaks change layout without moving to a new page.

3. Which property stops a table row from splitting across pages?
- [x] `cantSplit: true` on the `TableRow`
- [ ] `keepLines` on the cell
- [ ] `tableHeader: true`
> `cantSplit` writes `w:cantSplit` in the row properties.

### Exercises

1. **Chapter style break** — Define `Heading1` so every Heading 1 starts a new page automatically.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, HeadingLevel } = docx;
const doc = new Document({
  styles: { paragraphStyles: [{ id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 32, bold: true }, paragraph: { pageBreakBefore: true, outlineLevel: 0 } }] },
  sections: [{ children: ["A", "B", "C"].map((t) => new Paragraph({ text: `Chapter ${t}`, heading: HeadingLevel.HEADING_1 })) }],
});
download(await Packer.toBlob(doc), "chapter-breaks.docx");
```

</details>

2. **Three columns with a rule** — Create a continuous three-column section with a separator line.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, SectionType } = docx;
const doc = new Document({ sections: [
  { children: [new Paragraph("Heading across the page")] },
  { properties: { type: SectionType.CONTINUOUS, column: { count: 3, space: 500, separate: true, equalWidth: true } },
    children: Array.from({ length: 30 }, (_, i) => new Paragraph(`Item ${i + 1}`)) },
]});
download(await Packer.toBlob(doc), "three-col.docx");
```

</details>

### Interview Questions

**Q: How do you structure a 700-page handbook in docx so it stays maintainable?**
As data plus a small number of section factories. The content lives in JSON or Markdown: chapters with headings, paragraphs, tables and flags such as `landscape` or `startOnOddPage`. The generator maps each chapter to a section using shared page presets and header/footer objects, applies `pageBreakBefore` through the Heading 1 style, and adds a front-matter section with roman numerals and a TOC. Because the structure is generated, adding chapter 41 or moving an appendix is a data change, and the whole 767-page build reruns in seconds.

**Q: What is the difference between a column break, a page break and a section break in the XML?**
Page and column breaks are run-level `w:br` elements with `w:type="page"` or `"column"`; they only move the following content. A section break is a `w:sectPr` inside the last paragraph of the section (or the body for the final section) carrying page size, margins, columns, header references and the break type. docx writes the run-level breaks from `PageBreak`/`ColumnBreak` and the `sectPr` from each section object, which is why section-level things like headers cannot be changed with a `PageBreak`.

**Q: A client reports blank headers on the landscape pages. What happened?**
Headers and footers are section properties. When the generator created a new section for the landscape appendix it did not pass `headers` and `footers`, so Word treated it as a section with no header references. Because docx does not implement "Link to Previous" as an automatic default in every case, the fix is to pass the same `Header`/`Footer` instances to every section, ideally through the section factory so it cannot be forgotten.

# LEVEL: Expert

## Data-driven generation: JSON to a 21-template branded suite

Once a single document generator works, the next step is a **suite**: one code base that produces every document a client needs (letterhead, memo, invoice, SOP, policy, report cover, meeting minutes and so on) from one brand definition and one JSON payload per document. This is exactly the shape of Ali's Fiverr "branded template suite" deliverables, where a client wants 15 to 21 matching documents and later wants the accent colour changed in all of them at once.

### Separate three things

| Layer | What it holds | Changes when… |
|---|---|---|
| Brand tokens | colours, fonts, logo bytes, margins, footer text | the client rebrands |
| Template functions | how a memo, invoice or SOP is laid out | the layout is redesigned |
| Payload (JSON) | the words, numbers and table rows of one document | every single run |

A template must never contain a colour literal, and a payload must never contain layout. Keeping this discipline is what makes 21 templates maintainable by one person.

### Brand tokens

```js
const brand = {
  name: "Stewart Title Lahore Ops",
  font: "Calibri",
  accent: "1E5AA8",
  muted: "6B7280",
  margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  footer: "Confidential – internal use only",
};
```

### A style factory driven by tokens

```js
function makeStyles(b) {
  return {
    default: { document: { run: { font: b.font, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: b.accent }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: b.accent }, paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 } },
      { id: "Meta", name: "Meta", basedOn: "Normal", run: { size: 18, color: b.muted, italics: true } },
    ],
  };
}
```

Every template calls `makeStyles(brand)` so all 21 documents share identical style ids. That matters later: a client can copy a paragraph from the memo into the SOP and the formatting stays consistent because `Heading1` means the same thing in both files.

### Block renderers

Payloads are lists of typed blocks. A single `renderBlocks` maps each block to docx objects and every template reuses it:

```js
const { Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType } = docx;

const renderers = {
  h1: (b) => new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_1 }),
  h2: (b) => new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_2 }),
  p:  (b) => new Paragraph({ children: [new TextRun(b.text)] }),
  bullets: (b) => b.items.map((t) => new Paragraph({ text: t, bullet: { level: 0 } })),
  table: (b) => new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [b.header, ...b.rows].map((cells, i) => new TableRow({
      tableHeader: i === 0,
      children: cells.map((c) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(c), bold: i === 0 })] })] })),
    })),
  }),
};

function renderBlocks(blocks) {
  return blocks.flatMap((b) => {
    const fn = renderers[b.type];
    if (!fn) throw new Error(`Unknown block type "${b.type}"`);
    return fn(b);
  });
}
```

`flatMap` lets a renderer return one object or an array (bullets return several paragraphs). Throwing on unknown types is deliberate: silently skipping a block is how a policy manual ships without its penalties section.

### The template registry

```js
const templates = {
  memo:    (payload, b) => [memoHeader(payload, b), ...renderBlocks(payload.blocks)],
  sop:     (payload, b) => [sopBanner(payload, b), ...renderBlocks(payload.blocks), revisionTable(payload)],
  invoice: (payload, b) => [invoiceHead(payload, b), lineItems(payload.items), totals(payload.items)],
  // ...18 more
};

function buildDocument(kind, payload, b) {
  const template = templates[kind];
  if (!template) throw new Error(`No template "${kind}"`);
  return new docx.Document({
    creator: b.name,
    title: payload.title,
    styles: makeStyles(b),
    sections: [{ properties: { page: { margin: b.margins } }, headers: { default: brandHeader(b) }, footers: { default: brandFooter(b) }, children: template(payload, b) }],
  });
}
```

Producing every document in a batch is now a loop over a manifest: `for (const job of manifest) await Packer.toBuffer(buildDocument(job.kind, job.payload, brand))`. Adding template 22 means adding one function to the registry; changing the accent means editing one token.

### Validate the payload first

Check the payload shape (a hand-written function, or Zod or Ajv in Node) before building anything. A missing `header` array in a table block otherwise produces a cryptic `Cannot read properties of undefined` from deep inside docx, long after the real mistake.

> **Interview note:** When asked "how would you design a document generator", describe these three layers explicitly and mention that the brand layer includes the logo bytes and footer text, not only colours. Interviewers are checking whether you separate content from presentation.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, Header, Footer, AlignmentType } = docx;

const brand = { name: "Stewart Title Lahore Ops", font: "Calibri", accent: "1E5AA8", muted: "6B7280", footer: "Confidential – internal use only" };
const makeStyles = (b) => ({
  default: { document: { run: { font: b.font, size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", run: { size: 32, bold: true, color: b.accent }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
    { id: "Meta", name: "Meta", basedOn: "Normal", run: { size: 18, color: b.muted, italics: true } },
  ],
});
const renderers = {
  h1: (b) => new Paragraph({ text: b.text, heading: HeadingLevel.HEADING_1 }),
  p: (b) => new Paragraph({ children: [new TextRun(b.text)] }),
  bullets: (b) => b.items.map((t) => new Paragraph({ text: t, bullet: { level: 0 } })),
  table: (b) => new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [b.header, ...b.rows].map((cells, i) => new TableRow({ tableHeader: i === 0, children: cells.map((c) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(c), bold: i === 0 })] })] })) })) }),
};
const renderBlocks = (blocks) => blocks.flatMap((b) => { const fn = renderers[b.type]; if (!fn) throw new Error("Unknown block " + b.type); return fn(b); });

const templates = {
  memo: (p) => [new Paragraph({ text: `MEMO: ${p.title}`, heading: HeadingLevel.HEADING_1 }), new Paragraph({ text: `To: ${p.to}   From: ${p.from}   Date: ${p.date}`, style: "Meta" }), ...renderBlocks(p.blocks)],
  sop: (p) => [new Paragraph({ text: `SOP ${p.code}: ${p.title}`, heading: HeadingLevel.HEADING_1 }), new Paragraph({ text: `Owner: ${p.owner}  Rev: ${p.rev}`, style: "Meta" }), ...renderBlocks(p.blocks)],
};

function buildDocument(kind, payload, b) {
  return new Document({ creator: b.name, title: payload.title, styles: makeStyles(b), sections: [{
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: b.name, bold: true, color: b.accent })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: b.footer, size: 16, color: b.muted })] })] }) },
    children: templates[kind](payload, b),
  }] });
}

const payload = { title: "Weekly QA sampling", code: "QA-07", owner: "Ali Raza", rev: "3", blocks: [
  { type: "p", text: "Sample 5% of processed title orders every Friday." },
  { type: "bullets", items: ["Pick orders at random", "Score against the 12-point checklist", "Log results in the QA tracker"] },
  { type: "table", header: ["Score", "Action"], rows: [[">= 95%", "None"], ["85-94%", "Coaching"], ["< 85%", "Re-training"]] },
]};

const doc = buildDocument("sop", payload, brand);
download(await docx.Packer.toBlob(doc), "QA-07-sop.docx");
console.log("Built SOP from JSON with", payload.blocks.length, "blocks");
```

### Quiz

1. Where should the accent colour `1E5AA8` live in a template suite?
- [ ] Inside each template function
- [x] In the brand token object passed to a style factory
- [ ] In the JSON payload of each document
> One token, one change, 21 documents updated.

2. Why does `renderBlocks` use `flatMap` rather than `map`?
- [x] Some renderers return several paragraphs (bullets)
- [ ] `map` cannot be used with objects
- [ ] `flatMap` is faster
> A bullet list becomes one `Paragraph` per item, so the renderer returns an array that must be flattened.

3. What should happen when a payload contains an unknown block type?
- [ ] Skip it silently
- [x] Throw so the batch fails loudly
- [ ] Render it as plain text
> Silent skipping ships incomplete documents; an exception surfaces the bad data before delivery.

### Exercises

1. **Add a `quote` block** — Extend the renderer map with a `quote` block that renders indented italic text and prove it works with a one-block payload.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun } = docx;
const renderers = {
  quote: (b) => new Paragraph({ indent: { left: 720, right: 720 }, children: [new TextRun({ text: b.text, italics: true })] }),
};
const blocks = [{ type: "quote", text: "Quality is remembered long after the deadline is forgotten." }];
const doc = new Document({ sections: [{ children: blocks.map((b) => renderers[b.type](b)) }] });
download(await Packer.toBlob(doc), "quote.docx");
```

</details>

2. **Payload validator** — Write `validate(payload)` that throws if `title` is missing, `blocks` is not an array, or any table block lacks `header`.
<details><summary>Solution</summary>

```js
function validate(p) {
  if (typeof p.title !== "string" || !p.title.trim()) throw new Error("title is required");
  if (!Array.isArray(p.blocks)) throw new Error("blocks must be an array");
  p.blocks.forEach((b, i) => {
    if (b.type === "table" && !Array.isArray(b.header)) throw new Error(`block ${i}: table needs a header array`);
  });
  return true;
}
console.log(validate({ title: "Memo", blocks: [{ type: "table", header: ["A"], rows: [] }] }));
```

</details>

### Interview Questions

**Q: How do you keep 21 branded templates consistent when the client changes the brand?**
By never letting a template know a colour, font or margin. All of those live in one brand object that a style factory turns into `styles.default` and `paragraphStyles`, and that header/footer factories turn into the letterhead. Templates only reference style ids such as `Heading1` and `Meta`. A rebrand is a change to the token object followed by a batch regeneration, which I verify by opening two or three outputs and by a script that unzips each file and greps `styles.xml` for the old colour hex. In one Fiverr suite the client changed accent colour twice and the font once, and each change was a five-minute job.

**Q: What does a JSON payload for a document look like, and why blocks instead of free text?**
A payload has document-level metadata (`title`, `owner`, `date`) and an ordered array of typed blocks: `h1`, `p`, `bullets`, `table`, `image`, `pageBreak`. Blocks are the smallest units that map one-to-one onto docx objects, so rendering is a lookup table rather than a parser. Free text would force me to write a Markdown parser and guess at structure, whereas blocks can be produced by a form, a database query or an LLM and validated with a schema before any document is built. It also makes diffs meaningful: a changed table row is one line in the JSON.

**Q: How would you test a generator that produces dozens of document types?**
Three layers. Unit tests on renderers assert that a `table` block with 3 rows produces a `Table` with 4 `TableRow`s including the header. Snapshot tests unzip the generated `.docx` and compare `word/document.xml` after normalising ids, so a layout regression shows up as a diff. Finally a smoke test opens each output with LibreOffice headless (`soffice --headless --convert-to pdf`) to catch anything Word would flag as corrupt. Visual review of the PDF is still done by a human before delivery, but the automated layers catch most regressions.

## Patching existing documents with patchDocument

Not every job starts from a blank page. A client sends a beautifully formatted Word letterhead built by a designer and asks for 300 personalised letters. Rebuilding that design in code is slow and never pixel-perfect. `patchDocument` (added in docx 8.1, signature changed in 9.0) takes an existing `.docx`, finds placeholders such as `{{client_name}}` and replaces them with docx content while leaving everything else untouched.

### The v9 call

```js
import { patchDocument, PatchType, TextRun, Paragraph } from "docx";
import * as fs from "fs";

const out = await patchDocument({
  outputType: "nodebuffer",                    // "nodebuffer" | "blob" | "uint8array" | "base64" | "arraybuffer"
  data: fs.readFileSync("letterhead.docx"),
  patches: {
    client_name: { type: PatchType.PARAGRAPH, children: [new TextRun("Meridian Escrow LLC")] },
    date:        { type: PatchType.PARAGRAPH, children: [new TextRun({ text: "16 September 2026", bold: true })] },
    body: {
      type: PatchType.DOCUMENT,
      children: [
        new Paragraph("Thank you for choosing us for your closing package."),
        new Paragraph("Please find the settlement statement attached."),
      ],
    },
  },
});
fs.writeFileSync("letter.docx", out);
```

In v8 the signature was `patchDocument(data, { patches })` and it always returned a `Uint8Array`/Buffer; v9 moved everything into one options object and made `outputType` required. If you see `TypeError: Cannot read properties of undefined (reading 'patches')`, you are calling the v8 form against v9.

### The two patch types

| Type | Replaces | Use for |
|---|---|---|
| `PatchType.PARAGRAPH` | the `{{token}}` text only, inside its paragraph, keeping the paragraph and surrounding runs | names, dates, amounts, single lines |
| `PatchType.DOCUMENT` | the whole paragraph containing `{{token}}` with a list of block elements | multi-paragraph bodies, tables, images |

A `DOCUMENT` patch can contain `Paragraph`, `Table` and paragraphs with `ImageRun`, so a `{{signature}}` placeholder can become a picture. A `PARAGRAPH` patch may only contain runs (`TextRun`, `ImageRun`, hyperlinks).

### Placeholders in the template

Type `{{token}}` in Word with the exact formatting you want the replacement to inherit. Word often splits typed text into several runs (spell check, autocorrect and editing history do this), and docx reassembles the runs before matching, so the split is handled for you. Two rules avoid pain:

- Do not put spaces inside the braces: `{{ client_name }}` will not match `client_name`.
- Keep tokens in body text, headers, footers and table cells; docx patches all of them.

### Keeping formatting

By default the replacement inherits the run formatting of the placeholder. `keepOriginalStyles: true` (v8.5+) preserves the original run properties even when your `TextRun` sets its own, which is what you want when the designer's font choices must win.

```js
await patchDocument({ outputType: "blob", data, patches, keepOriginalStyles: true });
```

Newer 9.x releases add `placeholderDelimiters: { start: "[[", end: "]]" }` for templates that already use curly braces in their text.

### Patching in the browser

The same function is exported in the browser bundle, and `outputType: "blob"` gives you something to download directly. The template can come from an `<input type="file">` or a `fetch`:

```js
const data = await (await fetch("/templates/letterhead.docx")).arrayBuffer();
const blob = await docx.patchDocument({ outputType: "blob", data, patches });
download(blob, "letter.docx");
```

### When patching is the wrong tool

Patching cannot add sections, change page setup, restyle headings or repeat a table row per data item. If the client's template is a rate matrix that needs a variable number of rows, generate the table with a `DOCUMENT` patch rather than trying to fill a fixed table. If the change is structural (new landscape appendix, different numbering), build the document from scratch with the suite approach from the previous chapter and copy the design tokens out of the client's file.

> **Warning:** Word's "Track Changes" leaves `w:ins`/`w:del` wrappers around text. A placeholder inside a tracked insertion is not matched. Accept all changes in the template before shipping it to the pipeline.

### Try It Yourself

```js
// The browser runner has no template file, so we build one with docx first, then patch it.
const { Document, Packer, Paragraph, TextRun, HeadingLevel, patchDocument, PatchType, Table, TableRow, TableCell, WidthType } = docx;

const template = new Document({ sections: [{ children: [
  new Paragraph({ text: "Stewart Title – Client Letter", heading: HeadingLevel.HEADING_1 }),
  new Paragraph({ children: [new TextRun({ text: "Dear {{client_name}},", size: 24 })] }),
  new Paragraph("{{body}}"),
  new Paragraph({ children: [new TextRun({ text: "Order reference: {{order}}", italics: true })] }),
]}]});
const data = await Packer.toArrayBuffer(template);

const rows = [["Owner's policy", "$1,250.00"], ["Lender's policy", "$425.00"], ["Endorsements", "$75.00"]];
const blob = await patchDocument({
  outputType: "blob",
  data,
  patches: {
    client_name: { type: PatchType.PARAGRAPH, children: [new TextRun({ text: "Meridian Escrow LLC", bold: true })] },
    order: { type: PatchType.PARAGRAPH, children: [new TextRun("ST-2026-04471")] },
    body: { type: PatchType.DOCUMENT, children: [
      new Paragraph("Your premium breakdown is below."),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((r) => new TableRow({ children: r.map((c) => new TableCell({ children: [new Paragraph(c)] })) })) }),
      new Paragraph("Please contact us with any questions."),
    ]},
  },
});
download(blob, "patched-letter.docx");
console.log("Patched", 3, "placeholders; table rows:", rows.length);
```

### Quiz

1. Which patch type replaces the whole paragraph containing the placeholder with several blocks?
- [ ] `PatchType.PARAGRAPH`
- [x] `PatchType.DOCUMENT`
- [ ] `PatchType.SECTION`
> `DOCUMENT` patches accept paragraphs and tables; `PARAGRAPH` patches accept only runs.

2. What changed in `patchDocument` between docx 8 and 9?
- [x] It now takes one options object and requires `outputType`
- [ ] It was removed
- [ ] It now requires a file path
> v8: `patchDocument(data, { patches })`; v9: `patchDocument({ outputType, data, patches })`.

3. A `{{token}}` inside a tracked change in the template is…
- [ ] matched and replaced
- [x] not matched until changes are accepted
- [ ] matched twice
> `w:ins`/`w:del` wrappers break run reassembly; accept all changes in the template first.

### Exercises

1. **Header patch** — Build a template whose header contains `{{doc_id}}`, patch it, and download the result.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, Header, patchDocument, PatchType } = docx;
const template = new Document({ sections: [{ headers: { default: new Header({ children: [new Paragraph("Doc ID: {{doc_id}}")] }) }, children: [new Paragraph("Body text.")] }] });
const data = await Packer.toArrayBuffer(template);
const blob = await patchDocument({ outputType: "blob", data, patches: { doc_id: { type: PatchType.PARAGRAPH, children: [new TextRun("SOP-2026-011")] } } });
download(blob, "header-patched.docx");
```

</details>

2. **Batch letters** — Given an array of three clients, generate three patched blobs and report their sizes (download only the first).
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, patchDocument, PatchType } = docx;
const template = new Document({ sections: [{ children: [new Paragraph("Dear {{name}},"), new Paragraph("Your file is ready.")] }] });
const data = await Packer.toArrayBuffer(template);
const clients = ["Ayesha Khan", "Meridian Escrow LLC", "R. Patel"];
const blobs = [];
for (const name of clients) {
  blobs.push(await patchDocument({ outputType: "blob", data, patches: { name: { type: PatchType.PARAGRAPH, children: [new TextRun(name)] } } }));
}
console.log(blobs.map((b) => b.size));
download(blobs[0], "letter-1.docx");
```

</details>

### Interview Questions

**Q: When do you patch an existing document instead of generating from scratch?**
When the client's design is the deliverable and only the data changes: letterheads from a designer, contracts approved by legal, certificates with artwork. Patching keeps their fonts, spacing and drawing objects byte-for-byte, which I could not reproduce reliably in code. I generate from scratch when structure varies per run, such as a handbook whose chapter count changes, or when the same brand must drive many document types. In practice I combine them: the letterhead is patched, and a `DOCUMENT` patch inserts a generated table or bullet list into the body.

**Q: How does docx find `{{token}}` when Word has split it across several runs?**
`patchDocument` walks each paragraph, concatenates the text of its runs, searches for the delimiters, and then rewrites the runs so the placeholder occupies a single run before replacing it. That means run splitting from spell check or editing history does not matter, but anything that breaks the paragraph text flow does: a tracked change, a content control boundary or a field code between the braces prevents a match. My template checklist is therefore: accept all changes, remove content controls around tokens, and use plain text with no spaces inside the braces.

**Q: A patched document opens fine in Word but the replaced text has the wrong font. Why?**
Because the `TextRun` in the patch carried its own run properties, which override the placeholder's formatting, or because the placeholder's formatting came from a character style that the patch dropped. Passing `keepOriginalStyles: true` keeps the template's run properties, and supplying a bare `new TextRun("text")` with no formatting lets the inherited properties show through. I check by unzipping the output and comparing the `w:rPr` of the patched run with the template's original run.

## Performance with big documents

A 40-page memo builds in a blink. A 767-page handbook with 900 tables, 200 images and a TOC is where docx starts to cost real seconds and hundreds of megabytes of memory. This chapter is about where the time goes and the handful of changes that make the difference between a 90-second build and a 6-second one.

### Where the time goes

`Packer` does three things: it serialises your object tree into XML strings (`document.xml`, `styles.xml`, `numbering.xml`, one part per header and footer), it copies image buffers into `word/media`, and it zips the lot with JSZip. Measured on a 700-page handbook in Node 20:

| Phase | Typical share | Dominated by |
|---|---|---|
| Building the object tree | 20% | number of `TextRun`/`Paragraph` objects |
| XML serialisation | 50% | size of `document.xml` (inline formatting multiplies it) |
| Zipping | 30% | image bytes and compression level |

The lever that matters most is the **size of `document.xml`**. Every inline `run: { font, size, color }` writes a `w:rPr` block on every run; a document with 50,000 runs each carrying five properties is tens of megabytes of XML before compression.

### Use styles, not inline formatting

```js
// slow and big: 4 properties on every run
new TextRun({ text: cell, font: "Calibri", size: 18, color: "333333" })

// fast and small: the properties live once in styles.xml
new Paragraph({ style: "CellText", children: [new TextRun(cell)] })
```

Moving the rate-matrix cell formatting into a `CellText` paragraph style reduced one of Ali's generated appendices from 38 MB of XML to 9 MB, and build time fell proportionally.

### Batch tables sensibly

A `Table` with 5,000 rows is legal, but Word itself becomes sluggish beyond roughly a thousand rows, and reviewers complain before docx does. Split large matrices into one table per state or per section heading, and set `tableHeader: true` on the header row of each so the column labels repeat.

### Images

Each `ImageRun` writes its own media part, even when you pass the same bytes twice. For a logo that appears on every page, put a single `ImageRun` in the **header**: one part, referenced by every page. For photos, resize before embedding (`sharp` in Node, a canvas in the browser); docx stores the bytes you give it, so a 4 MB photo scaled to 2 inches wide is still 4 MB in the ZIP. Prefer JPEG for photographs and PNG only for logos and screenshots.

### Node: buffers and streams

```js
import { Packer } from "docx";
import { createWriteStream } from "fs";

// One buffer in memory, then write (fine up to a few hundred MB)
const buf = await Packer.toBuffer(doc);
await fs.promises.writeFile("handbook.docx", buf);

// Stream: the ZIP is piped to disk chunk by chunk
const stream = await Packer.toStream(doc);
stream.pipe(createWriteStream("handbook.docx"));
```

Streaming does not avoid building the object tree or the XML string, but it does avoid holding the finished ZIP in memory next to them, which is the difference between a build that finishes and one that dies with `JavaScript heap out of memory` on a 2 GB CI runner. If you must raise the heap, `node --max-old-space-size=4096 build.js` is the flag.

### Avoid re-work inside loops

Creating style objects, brand headers or numbering configs inside a per-chapter loop is a common mistake that multiplies allocations. Build them once and pass references:

```js
const header = brandHeader(brand);          // once
const sections = chapters.map((ch) => ({ headers: { default: header }, children: renderChapter(ch) }));
```

### Measure before optimising

```js
console.time("build");
const doc = buildHandbook(data);
console.timeEnd("build");
console.time("pack");
const buf = await Packer.toBuffer(doc);
console.timeEnd("pack");
console.log((buf.length / 1024 / 1024).toFixed(1), "MB");
```

If "pack" dominates, look at XML size and images. If "build" dominates, look at your own loops (a `find` inside a `map` over 30,000 rows is quadratic).

### Browser specifics

The browser has one thread and a smaller heap. Generating a 500-page file in the page thread freezes the UI for the duration; move the build into a **Web Worker** and post the `Blob` back. `Packer.toBlob` works inside workers because it uses no DOM.

> **Tip:** Compression is not the bottleneck you think. JSZip's default DEFLATE level is fast; the XML text is what takes time to produce. Reduce the XML first.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } = docx;

// Compare inline formatting vs a style on a 600-row table and measure size.
const rows = Array.from({ length: 600 }, (_, i) => [`WY-${String(i + 1).padStart(4, "0")}`, `$${(100000 + i * 2500).toLocaleString()}`, `$${(450 + i * 1.75).toFixed(2)}`]);

function build(inline) {
  const cell = (t) => new TableCell({ children: [new Paragraph(inline
    ? { children: [new TextRun({ text: t, font: "Calibri", size: 18, color: "333333" })] }
    : { style: "CellText", children: [new TextRun(t)] })] });
  return new Document({
    styles: { paragraphStyles: [{ id: "CellText", name: "Cell Text", basedOn: "Normal", run: { font: "Calibri", size: 18, color: "333333" } }] },
    sections: [{ children: [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((r) => new TableRow({ children: r.map(cell) })) })] }],
  });
}

console.time("inline");
const inlineBlob = await Packer.toBlob(build(true));
console.timeEnd("inline");
console.time("styled");
const styledBlob = await Packer.toBlob(build(false));
console.timeEnd("styled");
console.log("inline bytes:", inlineBlob.size, " styled bytes:", styledBlob.size);
download(styledBlob, "rate-matrix-styled.docx");
```

### Quiz

1. Which single factor most affects docx build time on large documents?
- [ ] The number of sections
- [x] The size of `document.xml`, driven by inline run formatting
- [ ] The ZIP compression level
> Every inline property is repeated on every run; styles write it once.

2. How do you place a logo on every page without duplicating the image bytes?
- [x] One `ImageRun` in the section header
- [ ] An `ImageRun` at the top of every page's first paragraph
- [ ] Pass the same buffer, docx deduplicates
> Each `ImageRun` creates its own media part; the header is emitted once per section.

3. What does `Packer.toStream` save compared with `toBuffer`?
- [ ] XML serialisation time
- [x] Holding the entire finished ZIP in memory
- [ ] Object tree construction
> The tree and XML are still built; only the output buffer is avoided.

### Exercises

1. **Timing harness** — Write a function that builds a document with `n` paragraphs and logs the pack time for n = 1000 and 5000.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph } = docx;
async function bench(n) {
  const doc = new Document({ sections: [{ children: Array.from({ length: n }, (_, i) => new Paragraph(`Line ${i + 1}`)) }] });
  const t0 = performance.now();
  const blob = await Packer.toBlob(doc);
  console.log(n, "paragraphs:", (performance.now() - t0).toFixed(0), "ms,", blob.size, "bytes");
  return blob;
}
await bench(1000);
download(await bench(5000), "bench.docx");
```

</details>

2. **Split a big table** — Given 300 rows tagged with a `state` field, emit one table per state with a heading paragraph before each.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel } = docx;
const data = Array.from({ length: 300 }, (_, i) => ({ state: ["WY", "CO", "UT"][i % 3], order: `ORD-${i}` }));
const groups = data.reduce((m, r) => ((m[r.state] ||= []).push(r), m), {});
const children = Object.entries(groups).flatMap(([state, rows]) => [
  new Paragraph({ text: state, heading: HeadingLevel.HEADING_2 }),
  new Table({ rows: rows.map((r) => new TableRow({ children: [new TableCell({ children: [new Paragraph(r.order)] })] })) }),
]);
download(await Packer.toBlob(new Document({ sections: [{ children }] })), "by-state.docx");
```

</details>

### Interview Questions

**Q: A handbook build takes 90 seconds and sometimes crashes with heap out of memory. Walk me through your diagnosis.**
First I time the two phases separately with `console.time` around tree construction and around `Packer.toBuffer`. If packing dominates, I unzip a previous output and check `document.xml` size; a huge file usually means inline formatting on every run, which I move into paragraph and character styles, cutting XML by three to four times. I check `word/media` for duplicated or oversized images and move repeated logos into headers and resize photos. If construction dominates, I profile my own loops, since a nested `find` over rows is the usual quadratic culprit. Finally I switch to `Packer.toStream` piped to disk so the ZIP is not held in memory, and only then consider `--max-old-space-size`.

**Q: Why does moving formatting into styles reduce size so dramatically?**
Because OOXML has no cascading shorthand for runs: each `w:r` carries a complete `w:rPr` with every property you set, so five properties on 50,000 runs is 250,000 property elements. A style writes those five properties once in `styles.xml` and each paragraph references it with a single `w:pStyle` element. The ZIP compresses repeated text well, so the file on disk shrinks less than the XML, but serialisation time and Word's open time both scale with the uncompressed XML, which is why the user-visible effect is large.

**Q: How would you generate a very large document in the browser without freezing the page?**
Run the build inside a Web Worker: the worker imports the docx bundle, receives the JSON payload via `postMessage`, builds the `Document`, calls `Packer.toBlob`, and posts the `Blob` back for the main thread to download. The UI stays responsive and the worker can be terminated if the user cancels. For very large outputs I also chunk the data into sections and report progress from the worker after each section is built, which is not faster but tells the user the build is alive.

## Common pitfalls & version differences (v7 → v8 → v9)

docx has been through several breaking releases, and most of the "it worked in the tutorial" complaints on Stack Overflow are version mismatches. This chapter is the checklist to read before upgrading and the map of the traps that catch even experienced users.

### Version timeline

| Version | Year | Headline changes |
|---|---|---|
| 7.x | 2022 | `sections` must be passed to the `Document` constructor; `doc.addSection()` removed; `ImageRun` replaces `Media.addImage` |
| 8.x | 2023 | `patchDocument` (8.1) and `keepOriginalStyles` (8.5); TypeScript types tightened so invalid options fail at compile time; `Packer.toBuffer(doc, prettify)` |
| 9.x | 2024–2025 | `ImageRun` requires `type` (`"png"`, `"jpg"`, `"gif"`, `"bmp"`, `"svg"`) and `fallback` for SVG; `patchDocument` takes one options object with `outputType`; `Packer.toArrayBuffer`; browser build published as `build/index.umd.js` |

The runner on this site loads a 9.x browser bundle, so the examples in this course are v9 code. Old snippets that call `new Document()` then `doc.addSection(...)` or `Media.addImage(doc, buffer)` are v5/v6 code and will throw.

### Pitfall: `ImageRun` without `type`

```js
// v9 throws "type is required" or silently writes a broken image
new ImageRun({ data: bytes, transformation: { width: 120, height: 40 } });
// correct in v9
new ImageRun({ type: "png", data: bytes, transformation: { width: 120, height: 40 } });
```

For SVG you must also pass `fallback: { type: "png", data: pngBytes }` because Word renders SVG only in recent builds and needs a raster twin.

### Pitfall: colours with `#`

`color: "#1E5AA8"` writes `w:color w:val="#1E5AA8"`, which Word treats as invalid and shows as black. docx expects six hex digits with no hash. Fill colours in `shading` follow the same rule.

### Pitfall: units

Almost everything is in **twips** (1/20 pt, 1440 per inch) except font `size`, which is **half-points** (`size: 24` is 12 pt), image `transformation` in **pixels at 96 dpi**, and `w:spacing line` where `240` means single spacing. Mixing these produces 12-inch margins and 1 pt text. Use the helpers: `convertInchesToTwip(1)`, `convertMillimetersToTwip(25)`.

### Pitfall: `text` and `children` together

```js
new Paragraph({ text: "Hello", children: [new TextRun(" world")] }) // "text" wins, " world" is dropped
```

Pick one. `text` is a shortcut for a single unformatted run.

### Pitfall: numbering references that do not exist

`numbering: { reference: "steps", level: 0 }` on a paragraph whose `reference` was never declared in `numbering.config` produces a document Word opens with no numbers and no error. docx does not validate the reference at build time in all versions, so misspellings are silent.

### Pitfall: a `Header` object shared between different `Document`s

Sharing `Header`/`Footer` instances across sections of the same document is correct and recommended. Sharing them across two different `Document` instances in one process can produce duplicate relationship ids in older 8.x builds; create the header via a factory per document.

### Pitfall: TOC that never fills

`TableOfContents` writes a field; Word fills it when it updates fields. Without `features: { updateFields: true }` on the `Document`, the reader sees "No table of contents entries found" until they press F9. LibreOffice ignores the flag, so PDF conversion with `soffice --headless` needs a macro or a post-step to refresh the TOC.

### Pitfall: browser bundle import

```html
<!-- v9 -->
<script src="https://unpkg.com/docx@9/build/index.umd.js"></script>
<!-- pre-9 -->
<script src="https://unpkg.com/docx@8/build/index.js"></script>
```

In ESM projects, `import { Document } from "docx"` works for both Node and bundlers; the deep path only matters for plain `<script>` tags.

### Pitfall: Node `Buffer` in the browser

`Packer.toBuffer` relies on Node's `Buffer`. In the browser call `toBlob`, `toBase64String` or `toArrayBuffer`; a bundler polyfill can hide the error until production.

### Upgrade procedure that works

1. Read the release notes for every major between your version and the target.
2. Search the code for `addSection`, `Media.addImage`, `new ImageRun({` without `type`, and `patchDocument(` with two arguments.
3. Regenerate a known document and diff `word/document.xml` against the last good output.
4. Open the result in Word and in LibreOffice, not only one of them.

> **Warning:** Locking the version in `package.json` (`"docx": "9.5.1"` rather than `"^9"`) is cheap insurance for production generators. A patch release once changed default table borders and a client's 21 templates all shipped with visible grid lines.

### Try It Yourself

```js
const { Document, Packer, Paragraph, TextRun, ImageRun, convertInchesToTwip } = docx;

// A tiny 2x2 PNG so the example has real image bytes without a network call
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQIW2P8z8Dwn4GBgYGJgYEBAB8UAgO1qiXFAAAAAElFTkSuQmCC";
const png = Uint8Array.from(atob(pngBase64), (c) => c.charCodeAt(0));

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1), right: convertInchesToTwip(1) } } },
    children: [
      new Paragraph({ children: [new TextRun({ text: "Correct colour (no #), 12pt (size 24):", color: "1E5AA8", size: 24 })] }),
      new Paragraph({ children: [new TextRun({ text: "Wrong colour with # renders black in Word:", color: "#1E5AA8", size: 24 })] }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: png, transformation: { width: 48, height: 48 } })] }),
    ],
  }],
});
download(await docx.Packer.toBlob(doc), "pitfalls.docx");
console.log("Open in Word: line 2 is black, the image is a 48px square");
```

### Quiz

1. Which docx version made `type` mandatory on `ImageRun`?
- [ ] 7.0
- [ ] 8.0
- [x] 9.0
> 9.0 also requires an SVG `fallback` and moved `patchDocument` to an options object.

2. `size: 24` on a `TextRun` renders as…
- [ ] 24 pt
- [x] 12 pt
- [ ] 24 px
> `size` is in half-points.

3. What happens when `color: "#FF0000"` is written?
- [ ] Bright red text
- [x] Word treats the value as invalid and shows black
- [ ] docx strips the hash automatically
> The XML value must be six hex digits with no prefix.

### Exercises

1. **Version sniffer** — Write a snippet that tells you whether the loaded docx bundle is v9+ by checking for `Packer.toArrayBuffer`.
<details><summary>Solution</summary>

```js
const isV9 = typeof docx.Packer.toArrayBuffer === "function" && typeof docx.patchDocument === "function";
console.log(isV9 ? "v9 or later" : "pre-9 bundle");
const { Document, Packer, Paragraph } = docx;
download(await Packer.toBlob(new Document({ sections: [{ children: [new Paragraph(isV9 ? "v9+" : "older")] }] })), "version.docx");
```

</details>

2. **Unit helper** — Write `pt(n)` and `inch(n)` helpers and use them to set 11 pt text and a 0.75-inch margin.
<details><summary>Solution</summary>

```js
const { Document, Packer, Paragraph, TextRun, convertInchesToTwip } = docx;
const pt = (n) => n * 2;
const inch = (n) => convertInchesToTwip(n);
const doc = new Document({ sections: [{ properties: { page: { margin: { top: inch(0.75), bottom: inch(0.75), left: inch(0.75), right: inch(0.75) } } },
  children: [new Paragraph({ children: [new TextRun({ text: "11 pt body text", size: pt(11) })] })] }] });
download(await Packer.toBlob(doc), "units.docx");
```

</details>

### Interview Questions

**Q: What broke when you upgraded docx across a major version, and how did you handle it?**
Going from 8 to 9 the two things that broke were every `ImageRun`, because `type` became mandatory, and the `patchDocument` call, which changed from `(data, options)` to a single options object with a required `outputType`. I handled it by grepping the generator for those two call sites, wrapping image creation in one `image(bytes, type, w, h)` helper so future changes touch a single function, and regenerating the regression set of documents to diff `document.xml` against the previous outputs. Pinning the exact version in `package.json` afterwards means upgrades are deliberate rather than a surprise from `npm install`.

**Q: Name three silent failures in docx, ones that do not throw but produce a wrong document.**
A colour with a leading `#`, which Word renders as black; a numbering `reference` that was never declared in `numbering.config`, which produces a list with no numbers; and a `TableOfContents` without `features.updateFields`, which shows a placeholder message until the user presses F9. A fourth is passing both `text` and `children` to a `Paragraph`, where `children` is discarded. Each of these is caught by a regression diff of the XML or by opening the file, never by the build succeeding.

**Q: How do you keep a generator working in both Node and the browser?**
By keeping the document-building code free of platform APIs and isolating the two edges: input bytes and output bytes. Images arrive as `Uint8Array`, which both `fs.readFileSync` and `fetch().arrayBuffer()` can produce; output uses `Packer.toBuffer` in Node and `Packer.toBlob` in the browser behind one `save(doc, name)` function. Fonts are referenced by name, never embedded from disk paths, and the bundle is imported with `import { ... } from "docx"` so the bundler picks the right entry. The shared code is tested once in Node with a snapshot of `document.xml`, and a small browser smoke test downloads one document.

## docx-js interview questions

This closing chapter collects the questions that come up when a hiring manager or a Fiverr client with a technical reviewer probes docx experience. Each answer is short enough to say aloud, and where a code snippet proves the point it is included. Practise saying the answers, not reading them.

### How interviewers frame docx questions

| Angle | What they are really testing |
|---|---|
| "Why docx instead of python-docx or a template engine?" | whether you understand build-from-scratch versus edit-existing |
| "How do you handle X in the XML?" | whether you know that docx writes OOXML and can read the output |
| "What happens at 700 pages?" | performance instincts |
| "A client reports Y is wrong" | debugging method: unzip, diff, reproduce |

### Core vocabulary you must own

- **Document, Section, Paragraph, TextRun**: the object tree that maps one-to-one onto `w:document`, `w:sectPr`, `w:p` and `w:r`.
- **Packer**: serialises the tree and zips it; `toBuffer`, `toBlob`, `toBase64String`, `toStream`, `toArrayBuffer`.
- **Styles versus inline formatting**: `styles.paragraphStyles` and `characterStyles` versus properties on the run.
- **Numbering config**: `numbering.config[].reference` and `levels[]` mapping onto `abstractNum` and `num`.
- **Fields**: `PageNumber`, `TableOfContents`, `SimpleField`, and `features.updateFields`.
- **patchDocument**: filling placeholders in an existing file.

### A debugging story to tell

Interviewers love a concrete failure. One from Ali's work: a 767-page handbook where the TOC showed only the first 200 headings. The cause was chapters generated from JSON where `heading: HeadingLevel.HEADING_1` was set on the paragraph but the chapter template also passed `style: "ChapterTitle"`, a custom style with no `outlineLevel`. `style` won, the paragraphs lost their outline level, and the TOC (which is built from outline levels) skipped them. The fix was adding `paragraph: { outlineLevel: 0 }` to `ChapterTitle`. The diagnosis came from unzipping the file and noticing `w:pStyle w:val="ChapterTitle"` with no `w:outlineLvl` in the style definition.

### Reading the XML you generate

```bash
unzip -o handbook.docx -d out && xmllint --format out/word/document.xml | head -60
```

Being able to say "I unzip the output and read `document.xml`" in an interview separates library users from document engineers. A `w:p` with `w:pPr/w:pStyle`, then `w:r` with `w:rPr` and `w:t`, is the whole story of most documents.

### Comparison questions

| Tool | Best at | Weak at |
|---|---|---|
| docx (JS) | generating new documents from data, browser generation | editing arbitrary existing files |
| python-docx | opening and editing existing files, quick scripts | headers/footers per section, fields, numbering definitions |
| docxtemplater | mail-merge style templates with loops | anything not expressible as a tag in the template |
| LibreOffice headless | converting to PDF, refreshing fields | generation logic |

> **Interview note:** When asked to compare, always end with "and in production I combine them": docx to generate, LibreOffice to convert to PDF, and a Python check that counts pages and headings in the result.

### Try It Yourself

```js
// A self-check: build a small document and inspect the generated XML in the console before downloading it.
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

const doc = new Document({
  styles: { paragraphStyles: [{ id: "ChapterTitle", name: "Chapter Title", basedOn: "Normal", run: { size: 36, bold: true }, paragraph: { outlineLevel: 0 } }] },
  sections: [{ children: [
    new Paragraph({ text: "1. Purpose", style: "ChapterTitle" }),
    new Paragraph({ text: "1.1 Scope", heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ children: [new TextRun({ text: "Body text.", size: 22 })] }),
  ]}],
});

const blob = await Packer.toBlob(doc);
// Peek inside the ZIP with the browser's DecompressionStream is overkill; the base64 length is a quick sanity check.
const b64 = await Packer.toBase64String(doc);
console.log("base64 length:", b64.length, "bytes on disk:", blob.size);
console.log("Check styles.xml for <w:outlineLvl w:val=\"0\"/> under ChapterTitle after unzipping.");
download(blob, "interview-check.docx");
```

### Quiz

1. A custom heading style is used but the TOC skips those headings. The most likely missing property is…
- [x] `paragraph.outlineLevel` on the style
- [ ] `quickFormat: true`
- [ ] `next: "Normal"`
> The TOC field collects paragraphs by outline level, which built-in headings set and custom styles must set explicitly.

2. Which tool is the better fit for filling a legal contract template that has loops over line items?
- [ ] docx from scratch
- [x] docxtemplater or `patchDocument` with a generated table
- [ ] LibreOffice headless
> Template-filling tools keep the approved design; generating from scratch would re-create it.

3. What is the fastest way to prove what docx actually wrote?
- [ ] Open in Word and look
- [x] Unzip the file and read `word/document.xml`
- [ ] Print the `Document` object
> The XML is the ground truth; Word's rendering hides details such as missing outline levels.

### Exercises

1. **Explain a bug** — A client says every bullet in a generated SOP is numbered "1." Without running code, list two causes and the fix for each.
<details><summary>Solution</summary>

Cause 1: each bullet paragraph was created with its own `numbering.config` entry (a new `reference` per paragraph), so each is a separate list starting at 1; fix by declaring one config and reusing the same `reference` and `instance`. Cause 2: the level uses `format: LevelFormat.DECIMAL` with `text: "%1."` and the paragraphs were meant to be bullets; fix by using `format: LevelFormat.BULLET` with `text: "•"`, or use `bullet: { level: 0 }` on the paragraph.

</details>

2. **Thirty-second pitch** — Write, in three sentences, why you would choose docx over generating HTML and converting it to Word.
<details><summary>Solution</summary>

HTML-to-Word converters produce documents with inline formatting, no real styles, no proper numbering definitions and no section properties, so clients cannot maintain them in Word. docx writes native styles, numbering, headers, footers, fields and sections, which is what a Word user expects when they open the file and press F9 or change a heading style. The output is also deterministic and testable at the XML level, which converters are not.

</details>

### Interview Questions

**Q: Tell me about a document generator you built and what you would change today.**
I built a Node generator that turns a JSON manifest into a branded suite of 21 Word templates plus a 767-page policy handbook with automated TOC, numbered headings, per-section headers and landscape appendices for rate matrices. The architecture is brand tokens, a style factory, block renderers and a template registry, with LibreOffice headless converting to PDF and a Python check counting pages and headings. What I would change is adding schema validation on the payload from day one and snapshot tests on `document.xml`; both were added after a silent numbering bug reached a client. I would also pin the docx version from the start, since the 9.0 `ImageRun` change cost an afternoon.

**Q: How do headers, footers and page numbers work in docx and where do people go wrong?**
Headers and footers are section properties: each section object has `headers.default`, `headers.first` and `headers.even`, and page numbers are `PageNumber.CURRENT` and `PageNumber.TOTAL_PAGES` children of a `TextRun` inside the footer. The first-page header only appears if `properties.titlePage` is true, and even headers only if the document has `evenAndOddHeaderAndFooters: true`. People go wrong by adding a new section for a landscape appendix and forgetting to pass the same header and footer objects, so those pages come out blank, or by restarting numbering with `pageNumberStart` and expecting `TOTAL_PAGES` to reset, which it does not because it is the whole document's `NUMPAGES` field; `SECTIONPAGES` is the per-section count.

**Q: How would you convert generated documents to PDF at scale and verify them?**
LibreOffice headless in a container: `soffice --headless --convert-to pdf --outdir out/ *.docx`, run in parallel with one process per core because a single soffice instance serialises jobs. Before conversion I make sure fields are static, since LibreOffice does not honour `updateFields`; for TOCs I either accept LibreOffice's own TOC refresh via a macro or generate TOC entries as plain paragraphs with hyperlinks for PDF-only deliverables. Verification is a pikepdf or PyMuPDF script that checks page count against the expected range, confirms the first heading text appears on page 1, and flags any PDF whose fonts are not embedded. Failures go into a report instead of stopping the batch.

**Q: What is the difference between a character style and a paragraph style in docx, and when do you use each?**
A paragraph style (`styles.paragraphStyles`, written to `w:style w:type="paragraph"`) carries both paragraph properties such as spacing and outline level and default run properties, and applies to the whole paragraph through `w:pStyle`. A character style (`styles.characterStyles`, `w:type="character"`) carries only run properties and applies to individual runs via `style` on the `TextRun`, writing `w:rStyle`. I use paragraph styles for structure, headings, body, captions and table cell text, and character styles for inline roles such as a defined term, a keyboard key or a code identifier, so a client can change "all defined terms to blue" from Word's style pane without touching the generator.
