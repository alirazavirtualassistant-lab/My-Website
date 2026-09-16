---
id: pptxgenjs
title: PptxGenJS
icon: 📽️
track: Document Engineering
color: #B7472A
runner: js
libs: pptxgenjs
tagline: Generate PowerPoint decks from JavaScript.
description: PptxGenJS (v3.x) from a first slide to expert deck automation: text, shapes, images, tables, charts, slide masters and layouts, placeholders, notes, hyperlinks, media, branding, and generating data-driven report decks in Node and the browser.
---

# LEVEL: Beginner

## Installing PptxGenJS and your first slide

PptxGenJS is a JavaScript library that writes real `.pptx` files, the Office Open XML format PowerPoint, Keynote, Google Slides and LibreOffice all open. You never touch XML. You create a presentation object, add slides, put text, shapes, images, tables and charts on them, and call one method to save. It runs in Node.js, in the browser, and inside React, Angular or Electron apps, which is why it is the tool of choice when a weekly production report has to become a deck without anyone opening PowerPoint.

### Installing

In Node, install from npm. Version 3.12 is the release this course follows; the 4.x line published later keeps the same slide API and mainly changes packaging, so everything here still applies.

```bash
npm install pptxgenjs
```

```js
// Node, CommonJS
const pptxgen = require("pptxgenjs");
// Node, ES modules / bundlers
import pptxgen from "pptxgenjs";
```

In the browser you load one script and get a global constructor named `PptxGenJS`. The `bundle` build includes JSZip, the library used to write the zip container, so nothing else is required.

```html
<script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
<script>
  const pptx = new PptxGenJS();
</script>
```

The Try It runner on this page has already loaded that bundle, so `PptxGenJS` is available in every example.

### The three objects you will use constantly

| Object | Created by | Holds |
|---|---|---|
| presentation (`pptx`) | `new PptxGenJS()` | layout, metadata, slide masters, all slides |
| slide | `pptx.addSlide()` | everything placed on one page |
| element options | plain object literals | position, size, fonts, colours |

### A complete first program

```js
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";            // 10 x 5.625 inches
pptx.author = "Ali Raza";
pptx.title  = "Weekly Production Status";

const slide = pptx.addSlide();
slide.addText("Weekly Production Status", { x: 0.5, y: 2.0, w: 9, h: 1, fontSize: 36, bold: true, color: "1F618D" });
slide.addText("Week ending 13 March 2026", { x: 0.5, y: 3.0, w: 9, h: 0.5, fontSize: 18, color: "666666" });

pptx.writeFile({ fileName: "first-deck.pptx" }).then(name => console.log("saved", name));
```

Three things to notice. Positions and sizes are in **inches** measured from the top-left corner of the slide. Colours are six-digit hex strings **without** the `#`. And `writeFile()` returns a Promise that resolves with the file name; in the browser it triggers a download, in Node it writes to disk.

### Slide layouts

`pptx.layout` sets the slide size for the whole presentation and must be set before adding slides.

| Name | Size (inches) | Use |
|---|---|---|
| `LAYOUT_16x9` | 10 x 5.625 | default, modern widescreen |
| `LAYOUT_16x10` | 10 x 6.25 | older widescreen |
| `LAYOUT_4x3` | 10 x 7.5 | legacy projectors, some client templates |
| `LAYOUT_WIDE` | 13.33 x 7.5 | PowerPoint's own "Widescreen" default |

Custom sizes are defined once and then selected by name:

```js
pptx.defineLayout({ name: "A4", width: 11.69, height: 8.27 });
pptx.layout = "A4";
```

### Metadata

`pptx.author`, `pptx.company`, `pptx.title`, `pptx.subject` and `pptx.revision` land in the file's core properties, which is what File → Info shows in PowerPoint. Set them; clients notice when a deck says "Unknown Author".

> **Tip:** Keep `pptx.layout` as `LAYOUT_16x9` unless a client template dictates otherwise. Every position in this course assumes a 10 x 5.625 inch canvas, and a 16:9 deck exported to PDF fits a landscape page cleanly.

### Try It Yourself

```js
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Ali Raza";
pptx.title = "First Deck";

const slide = pptx.addSlide();
slide.addText("Hello, PptxGenJS", { x: 0.5, y: 1.5, w: 9, h: 1.2, fontSize: 40, bold: true, color: "B7472A", align: "center" });
slide.addText("Generated entirely in the browser", { x: 0.5, y: 2.8, w: 9, h: 0.6, fontSize: 18, color: "555555", align: "center" });

pptx.writeFile({ fileName: "first-deck.pptx" }).then(name => console.log("saved:", name));
```

### Quiz

1. What unit do `x`, `y`, `w` and `h` use by default?
- [ ] Pixels
- [x] Inches
- [ ] Points
> Positions are inches from the top-left corner; a 16:9 slide is 10 by 5.625 inches.

2. Which is a valid colour value for `color`?
- [ ] `"#1F618D"`
- [x] `"1F618D"`
- [ ] `"rgb(31, 97, 141)"`
> Colours are six hex digits with no `#`; a leading hash produces invalid XML.

3. What does `writeFile()` return?
- [ ] The file bytes
- [x] A Promise that resolves with the file name
- [ ] Nothing
> It is asynchronous; chain `.then()` or `await` it.

### Exercises

1. **Title and subtitle** — Create a 4:3 deck with one slide whose title reads `Rate Matrix Review` and whose subtitle shows today's date.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_4x3";
const s = pptx.addSlide();
s.addText("Rate Matrix Review", { x: 0.5, y: 2.5, w: 9, h: 1, fontSize: 36, bold: true });
s.addText(new Date().toLocaleDateString("en-GB"), { x: 0.5, y: 3.5, w: 9, h: 0.5, fontSize: 16 });
pptx.writeFile({ fileName: "review.pptx" });
```

</details>

2. **Three slides** — Add three slides in a loop, each showing `Slide N of 3` centred.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
for (let i = 1; i <= 3; i++) {
  pptx.addSlide().addText(`Slide ${i} of 3`, { x: 0, y: 2.3, w: "100%", h: 1, align: "center", fontSize: 32 });
}
pptx.writeFile({ fileName: "three.pptx" });
```

</details>

### Interview Questions

**Q: What is PptxGenJS and where does it run?**
It is an open-source JavaScript library that generates `.pptx` files from an object model of slides and elements, writing the Office Open XML parts and zipping them with JSZip. It runs in Node.js for server-side or scheduled generation, in the browser as a script or bundled into React, Angular or Vue apps, and in Electron. Because output is standard OOXML, the decks open in PowerPoint, Keynote, Google Slides and LibreOffice. It generates new files only; it cannot open or edit an existing presentation, which is the main thing to know when comparing it with python-pptx.

**Q: Why are positions in inches rather than pixels?**
PowerPoint's internal unit is the EMU (914,400 per inch) and its UI shows inches or centimetres, so inches map directly onto what a designer sees in the ruler and onto printed output. Pixels would need a DPI assumption that varies by screen. PptxGenJS also accepts percentage strings such as `"50%"`, which are resolved against the slide size at write time and are handy for layouts that must survive a switch between 16:9 and 4:3.

**Q: What must be set before adding slides, and why?**
`pptx.layout` (or a custom `defineLayout`), because the slide size is written into the presentation part and percentage positions are resolved against it. Changing it after slides exist does not re-flow those slides. Metadata such as `author` and `title` can be set any time before `writeFile()`.

## Text, fonts and positioning

`slide.addText()` is the method you will call more than any other. It takes the text and an options object; the options control where the text box sits, how big it is, and every typographic property. Master this one method and half of any report deck is done.

### The box comes first

Every text element is a text box with `x`, `y`, `w` and `h`. Text wraps inside the width and, by default, is vertically centred inside the height.

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Files closed this week: 1,877", { x: 0.5, y: 0.5, w: 6, h: 0.75, fontSize: 20 });
```

Sizes and positions accept numbers (inches) or percentage strings. `w: "100%"` spans the slide; `x: "50%"` starts at the horizontal middle.

```js
slide.addText("Centered banner", { x: 0, y: "40%", w: "100%", h: 1, align: "center", fontSize: 28 });
```

### Fonts, size and colour

| Option | Example | Notes |
|---|---|---|
| `fontFace` | `"Calibri"`, `"Segoe UI"` | must exist on the viewer's machine; fonts are not embedded |
| `fontSize` | `18` | points |
| `color` | `"1F618D"` | hex without `#`, or a scheme colour |
| `bold`, `italic` | `true` | |
| `underline` | `{ style: "sng" }` | single underline; `"dbl"` for double |
| `strike` | `"sngStrike"` | strike-through |
| `subscript`, `superscript` | `true` | |
| `charSpacing` | `2` | letter spacing in points |
| `highlight` | `"FFFF00"` | text highlight colour |
| `transparency` | `50` | 0-100 |

```js
slide.addText("Exceptions", {
  x: 0.5, y: 1.5, w: 4, h: 0.6,
  fontFace: "Segoe UI", fontSize: 24, bold: true, color: "C0392B",
  underline: { style: "sng" }, charSpacing: 1,
});
```

Scheme colours follow the presentation theme instead of a fixed hex value, so the deck recolours itself when a client applies their theme:

```js
slide.addText("Themed", { x: 0.5, y: 2.3, w: 3, h: 0.5, color: pptx.SchemeColor.accent1 });
```

### Alignment and margins

`align` is `"left"`, `"center"`, `"right"` or `"justify"`. `valign` is `"top"`, `"middle"` or `"bottom"`. `margin` is the inset between the box edge and the text, in points, either one number or `[top, right, bottom, left]`.

```js
slide.addText("Top-left aligned with a 10pt inset", { x: 0.5, y: 3, w: 5, h: 1.5, align: "left", valign: "top", margin: 10 });
```

### Fills, borders and shapes around text

A text box can have a background fill and an outline, and it can take the geometry of any shape:

```js
slide.addText("412", {
  x: 0.5, y: 4, w: 2, h: 1,
  fontSize: 32, bold: true, color: "FFFFFF", align: "center",
  fill: { color: "1F618D" }, line: { color: "0B3C5D", width: 1 },
  shape: pptx.ShapeType.roundRect, rectRadius: 0.15,
});
```

That is a KPI tile in one call, and the pattern repeats across every dashboard-style slide.

### Line spacing and overflow

`lineSpacing` sets the line height in points; `lineSpacingMultiple` (for example `1.2`) scales the font's natural height. `paraSpaceBefore` and `paraSpaceAfter` add space between paragraphs. When text may overflow, `fit: "shrink"` asks PowerPoint to shrink it on overflow and `fit: "resize"` grows the box; `wrap: false` keeps everything on one line.

```js
slide.addText(longParagraph, { x: 0.5, y: 0.5, w: 9, h: 4, fontSize: 14, lineSpacingMultiple: 1.15, paraSpaceAfter: 6, fit: "shrink" });
```

> **Warning:** `fit: "shrink"` writes the autofit flag, but PowerPoint only recalculates the shrink when the box is edited or the file is re-saved from the desktop app. For decks that go straight to PDF or to Google Slides, size the text yourself based on string length instead of relying on autofit.

### Rotation and vertical text

`rotate: 90` turns the whole box; `vert: "vert"` writes characters vertically, which is useful for row labels on a matrix slide.

### Try It Yourself

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();

slide.addText("Production Support - Week 11", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontFace: "Segoe UI", fontSize: 28, bold: true, color: "1F618D" });
slide.addText("Files opened", { x: 0.5, y: 1.5, w: 2.8, h: 0.4, fontSize: 12, color: "666666" });
slide.addText("2,316", { x: 0.5, y: 1.9, w: 2.8, h: 1, fontSize: 36, bold: true, color: "FFFFFF", align: "center",
  fill: { color: "1F618D" }, shape: pptx.ShapeType.roundRect, rectRadius: 0.1 });
slide.addText("Files closed", { x: 3.6, y: 1.5, w: 2.8, h: 0.4, fontSize: 12, color: "666666" });
slide.addText("2,275", { x: 3.6, y: 1.9, w: 2.8, h: 1, fontSize: 36, bold: true, color: "FFFFFF", align: "center",
  fill: { color: "27AE60" }, shape: pptx.ShapeType.roundRect, rectRadius: 0.1 });
slide.addText("Exceptions", { x: 6.7, y: 1.5, w: 2.8, h: 0.4, fontSize: 12, color: "666666" });
slide.addText("28", { x: 6.7, y: 1.9, w: 2.8, h: 1, fontSize: 36, bold: true, color: "FFFFFF", align: "center",
  fill: { color: "C0392B" }, shape: pptx.ShapeType.roundRect, rectRadius: 0.1 });
slide.addText("Exception rate fell to 1.2%, the lowest in six weeks. TX volume up 4% week on week.",
  { x: 0.5, y: 3.3, w: 9, h: 1.5, fontSize: 14, valign: "top", lineSpacingMultiple: 1.2, margin: 8 });

pptx.writeFile({ fileName: "text-positioning.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. What does `margin: 10` mean on a text box?
- [ ] 10 inches of outer spacing
- [x] A 10-point inset between the box edge and the text
- [ ] 10 pixels of letter spacing
> `margin` is the internal inset in points; letter spacing is `charSpacing`.

2. Which option makes the text box take a rounded-rectangle shape?
- [ ] `rounded: true`
- [x] `shape: pptx.ShapeType.roundRect`
- [ ] `border: "round"`
> Combine `shape` with `rectRadius` to control the corner radius.

3. Why can `fontFace: "Montserrat"` look wrong on a client's laptop?
- [x] Fonts are not embedded; PowerPoint substitutes a font that is not installed
- [ ] PptxGenJS only supports Calibri
- [ ] The name must be uppercase
> Use fonts the audience has, or theme fonts, and test on a machine without your fonts.

### Exercises

1. **Right-aligned figure** — Place a label on the left and a right-aligned currency value on the same line, both in one row 0.5 inches tall.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
const s = pptx.addSlide();
s.addText("Owner's premium", { x: 0.5, y: 1, w: 4, h: 0.5, fontSize: 16 });
s.addText("$1,254.00", { x: 4.5, y: 1, w: 3, h: 0.5, fontSize: 16, bold: true, align: "right" });
pptx.writeFile({ fileName: "aligned.pptx" });
```

</details>

2. **Percent layout** — Put four labels at `x` = 0%, 25%, 50%, 75%, each 25% wide, so the row survives a change to `LAYOUT_4x3`.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
const s = pptx.addSlide();
["WY", "TX", "NM", "CO"].forEach((st, i) => {
  s.addText(st, { x: `${i * 25}%`, y: "45%", w: "25%", h: 0.6, align: "center", fontSize: 24, bold: true });
});
pptx.writeFile({ fileName: "percent.pptx" });
```

</details>

### Interview Questions

**Q: How do you keep text from overflowing a box in a generated deck?**
Three approaches, in order of reliability. Size the font from the content: measure the string length and pick a `fontSize` from a small lookup, which is deterministic and works in every viewer. Constrain the layout: give long paragraphs a taller box and truncate with an ellipsis beyond a character budget. Only then use `fit: "shrink"`, which sets PowerPoint's autofit flag but is applied lazily by the desktop app, so a deck opened in Google Slides or converted to PDF straight away can still overflow. In production report decks I use the first two and keep `fit` as a safety net.

**Q: When would you use a scheme colour instead of a hex value?**
When the deck must adopt a client's theme. `pptx.SchemeColor.accent1` writes a theme reference, so if the client applies their corporate template afterwards the element recolours to their accent, whereas a hex value stays fixed. For our own branded masters I use hex so the palette is exact regardless of theme; for decks a client will restyle, scheme colours keep everything consistent with their template.

**Q: What are the differences between `margin`, `charSpacing` and `paraSpaceAfter`?**
`margin` is the inset in points between the edge of the text box and the text, like padding. `charSpacing` is extra spacing between characters, used sparingly for headings. `paraSpaceAfter` (and `paraSpaceBefore`) add vertical space between paragraphs, which is how you separate bullet items without blank lines. They act at three different levels: box, glyph and paragraph.

## Shapes, lines and colours

Shapes are how a deck gets its structure: header bars, KPI tiles, process arrows, dividers, callouts. `slide.addShape()` takes a shape name from `pptx.ShapeType` and the same positioning options as text, plus fill, line, shadow and rotation options. Learn a dozen shapes and you can draw any status diagram a production report needs.

### Rectangles, rounded rectangles and ellipses

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();

slide.addShape(pptx.ShapeType.rect,      { x: 0, y: 0, w: "100%", h: 0.6, fill: { color: "1F618D" } });          // header bar
slide.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1, w: 3, h: 1.5, fill: { color: "F4F6F7" }, line: { color: "BFC9CA", width: 1 }, rectRadius: 0.2 });
slide.addShape(pptx.ShapeType.ellipse,   { x: 4, y: 1, w: 1.5, h: 1.5, fill: { color: "27AE60" } });
```

`fill` takes `{ color, transparency }` where transparency is 0-100; `line` takes `{ color, width, dashType }`. Omit `line` for no outline, or pass `line: { color: "FFFFFF", width: 0 }` to make sure none is drawn. `rectRadius` is in inches.

### Lines and arrows

A line is a shape with zero height (horizontal) or zero width (vertical). Arrowheads are properties of the `line` option.

```js
slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 3, w: 9, h: 0, line: { color: "BFC9CA", width: 1, dashType: "dash" } });
slide.addShape(pptx.ShapeType.line, { x: 3.5, y: 1.75, w: 0.5, h: 0, line: { color: "1F618D", width: 2, endArrowType: "triangle" } });
```

| `dashType` values | `beginArrowType` / `endArrowType` values |
|---|---|
| `solid`, `dash`, `dashDot`, `lgDash`, `lgDashDot`, `lgDashDotDot`, `sysDash`, `sysDot` | `none`, `arrow`, `diamond`, `oval`, `stealth`, `triangle` |

Diagonal lines use non-zero `w` and `h`; `flipV: true` makes the line run from bottom-left to top-right instead of top-left to bottom-right.

### Process shapes

`chevron`, `rightArrow`, `leftArrow`, `upArrow`, `downArrow`, `triangle`, `diamond`, `hexagon`, `star5`, `cloud`, `pie`, `flowChartProcess` and `wedgeRectCallout` are all available. A pipeline of chevrons is the classic production-status visual:

```js
const stages = ["Opened", "In Production", "QC", "Closed"];
stages.forEach((label, i) => {
  slide.addText(label, {
    x: 0.5 + i * 2.3, y: 3.5, w: 2.2, h: 0.7,
    shape: pptx.ShapeType.chevron, fill: { color: i === 3 ? "27AE60" : "1F618D" },
    color: "FFFFFF", fontSize: 14, bold: true, align: "center",
  });
});
```

Notice this uses `addText` with a `shape` option rather than `addShape`: that is how you get text centred inside a shape in one call. `addShape` is for shapes with no text.

### Shadows, rotation and flips

```js
slide.addShape(pptx.ShapeType.rect, {
  x: 6.5, y: 1, w: 3, h: 1.5, fill: { color: "FFFFFF" }, line: { color: "D5D8DC", width: 0.75 },
  shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 45, opacity: 0.25 },
});
slide.addShape(pptx.ShapeType.rightArrow, { x: 6.5, y: 3, w: 1.5, h: 0.6, fill: { color: "F39C12" }, rotate: 45 });
slide.addShape(pptx.ShapeType.triangle,   { x: 8.5, y: 3, w: 0.8, h: 0.8, fill: { color: "8E44AD" }, flipV: true });
```

Shadow `type` is `"outer"` or `"inner"`, `angle` is in degrees, `offset` and `blur` in points, `opacity` 0-1. Keep shadows subtle; an `opacity` above 0.3 looks dated on screen.

### Colours: a working palette

Define your palette once as constants and reference them everywhere. This makes a client re-brand a one-line change and keeps every slide consistent.

```js
const C = { navy: "1F618D", green: "27AE60", red: "C0392B", amber: "F39C12", grey: "7F8C8D", light: "F4F6F7", ink: "2C3E50" };
slide.addShape(pptx.ShapeType.rect, { x: 0, y: 5.2, w: "100%", h: 0.425, fill: { color: C.navy } });
```

Semi-transparent fills let a shape sit over an image or chart without hiding it:

```js
slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "000000", transparency: 60 } });
```

> **Tip:** Draw order is insertion order. Add background shapes first, then text on top. If a KPI number vanishes, it is usually because the tile rectangle was added after it.

### Try It Yourself

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
const C = { navy: "1F618D", green: "27AE60", red: "C0392B", light: "F4F6F7", ink: "2C3E50" };

slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.7, fill: { color: C.navy } });
slide.addText("File lifecycle", { x: 0.4, y: 0.1, w: 6, h: 0.5, color: "FFFFFF", fontSize: 20, bold: true });

const stages = ["Opened", "Title Search", "Examination", "QC", "Closed"];
stages.forEach((label, i) => {
  slide.addText(label, { x: 0.4 + i * 1.85, y: 1.6, w: 1.8, h: 0.7, shape: pptx.ShapeType.chevron,
    fill: { color: i === stages.length - 1 ? C.green : C.navy }, color: "FFFFFF", fontSize: 12, bold: true, align: "center" });
});

slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: 2.8, w: 9.2, h: 1.6, fill: { color: C.light }, line: { color: "D5D8DC", width: 1 }, rectRadius: 0.15,
  shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 45, opacity: 0.2 } });
slide.addText("Average cycle time: 6.4 days (target 7.0)", { x: 0.6, y: 2.95, w: 8.8, h: 0.5, fontSize: 16, color: C.ink, bold: true });
slide.addShape(pptx.ShapeType.line, { x: 0.6, y: 3.55, w: 8.8, h: 0, line: { color: "BFC9CA", width: 1, dashType: "dash" } });
slide.addText("QC exceptions trending down for the third consecutive week", { x: 0.6, y: 3.7, w: 8.8, h: 0.5, fontSize: 13, color: C.ink });
slide.addShape(pptx.ShapeType.line, { x: 8.6, y: 4.9, w: 0.8, h: 0, line: { color: C.red, width: 2.5, endArrowType: "triangle" } });

pptx.writeFile({ fileName: "shapes.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. How do you draw a horizontal line 9 inches long?
- [x] `addShape(pptx.ShapeType.line, { x: 0.5, y: 3, w: 9, h: 0, line: {...} })`
- [ ] `addLine(0.5, 3, 9)`
- [ ] `addShape("hr", { w: 9 })`
> A line is a shape with zero height; arrowheads and dashes live in the `line` option.

2. What is the easiest way to put centred text inside a chevron?
- [ ] `addShape` then `addText` at the same coordinates
- [x] `addText(label, { shape: pptx.ShapeType.chevron, ... })`
- [ ] `addShape(..., { text: label })`
> `addText` accepts a `shape` option, giving a shape with centred text in one call.

3. What controls stacking order of overlapping elements?
- [ ] The `z` option
- [x] The order in which elements are added
- [ ] Larger elements are always behind
> Elements are drawn in insertion order; add backgrounds first.

### Exercises

1. **Traffic light** — Draw three circles (red, amber, green) in a vertical column inside a dark rounded rectangle.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
const s = pptx.addSlide();
s.addShape(pptx.ShapeType.roundRect, { x: 4.4, y: 1, w: 1.2, h: 3.4, fill: { color: "2C3E50" }, rectRadius: 0.3 });
["C0392B", "F39C12", "27AE60"].forEach((c, i) => {
  s.addShape(pptx.ShapeType.ellipse, { x: 4.6, y: 1.2 + i * 1.05, w: 0.8, h: 0.8, fill: { color: c } });
});
pptx.writeFile({ fileName: "traffic.pptx" });
```

</details>

2. **Divider with label** — Draw a thin grey line across the slide with the word `Details` sitting on it in a white box, so the line appears to break around the word.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
const s = pptx.addSlide();
s.addShape(pptx.ShapeType.line, { x: 0.5, y: 2.8, w: 9, h: 0, line: { color: "BFC9CA", width: 1 } });
s.addText("Details", { x: 4.3, y: 2.55, w: 1.4, h: 0.5, fill: { color: "FFFFFF" }, align: "center", fontSize: 12, color: "7F8C8D" });
pptx.writeFile({ fileName: "divider.pptx" });
```

</details>

### Interview Questions

**Q: How do you build a consistent visual style across a generated deck?**
Constants and helpers. I define the palette, fonts and a spacing grid once, then write small functions such as `kpiTile(slide, x, y, label, value, color)` and `sectionHeader(slide, title)` that use them. Every slide is composed from those helpers, so the deck is consistent by construction and a re-brand changes one object. Combined with a slide master for the static chrome (header bar, footer, logo), the per-slide code contains only the data-specific elements, which keeps it short and reviewable.

**Q: What is the difference between `addShape` and `addText` with a `shape` option?**
`addShape` creates a geometric shape with no text body; `addText` with `shape` creates a shape whose geometry is the named shape and whose text is laid out inside it with all the usual text options such as alignment and margins. They produce nearly identical XML, but the second is one call instead of two and guarantees the text is centred inside the shape regardless of size, which matters when shapes are positioned from data.

**Q: How would you draw a connector between two boxes?**
With a `line` shape whose `x`, `y`, `w`, `h` run from the edge of one box to the edge of the other and `endArrowType: "triangle"`. For a diagonal I set non-zero `w` and `h` and use `flipV` if the line must rise rather than fall. PptxGenJS does not create PowerPoint's "smart connectors" that stay attached when a user drags a box, so if the client will edit the diagram by hand I say so and keep the geometry simple.

## Images

Logos, screenshots, charts rendered elsewhere, signatures and QR codes all go on slides through `slide.addImage()`. The method accepts either a `path` (file path or URL) or `data` (a base64 string), plus positioning and a handful of image-specific options. Choosing correctly between `path` and `data` is what makes image code work identically in Node and in the browser.

### `path` versus `data`

```js
// Node: local file or URL
slide.addImage({ path: "assets/logo.png", x: 0.3, y: 0.2, w: 1.5, h: 0.5 });
slide.addImage({ path: "https://example.com/brand/logo.png", x: 0.3, y: 0.2, w: 1.5, h: 0.5 });

// Anywhere: base64 data with a MIME header
slide.addImage({ data: "image/png;base64,iVBORw0KGgoAAAANSUhEUg...", x: 0.3, y: 0.2, w: 1.5, h: 0.5 });
```

In Node, a relative `path` is read from the filesystem and an `http(s)` URL is fetched. In the browser, `path` is fetched with an HTTP request relative to the page, so it is subject to CORS, and the download only happens when `writeFile()` runs. `data` avoids both problems and is what you use when the image comes from a canvas, a file input or an API response.

The `data` string must start with the MIME type and `;base64,`. A `data:` URL prefix from `canvas.toDataURL()` is also accepted, so you can pass that result straight through.

### Size and aspect ratio

If you give both `w` and `h`, the image is stretched to fit. Give the natural aspect ratio yourself, or use `sizing`:

| `sizing.type` | Behaviour |
|---|---|
| `contain` | scale to fit inside `w` x `h`, preserving aspect ratio, leaving space |
| `cover` | scale to fill `w` x `h`, preserving aspect ratio, cropping the overflow |
| `crop` | show a `w` x `h` window of the image starting at `x`, `y` within the image |

```js
slide.addImage({ path: "screenshot.png", x: 0.5, y: 1, w: 4, h: 3, sizing: { type: "contain", w: 4, h: 3 } });
slide.addImage({ path: "photo.jpg", x: 5, y: 1, w: 4, h: 3, sizing: { type: "cover", w: 4, h: 3 } });
```

In the browser, you can read the natural size before placing it:

```js
async function addFitted(slide, src, x, y, maxW) {
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const h = maxW * (img.naturalHeight / img.naturalWidth);
  slide.addImage({ path: src, x, y, w: maxW, h });
}
```

### Other options

```js
slide.addImage({
  data: logoData, x: 8.3, y: 0.15, w: 1.4, h: 0.45,
  rounding: true,                          // circular / rounded crop
  rotate: 0, flipH: false,
  transparency: 0,                         // 0-100
  hyperlink: { url: "https://stewart.com", tooltip: "Stewart Title" },
  altText: "Stewart Title logo",
  shadow: { type: "outer", color: "000000", blur: 3, offset: 1, angle: 90, opacity: 0.2 },
});
```

`altText` matters for accessibility checks that some clients run on delivered decks; fill it in.

### Formats

PNG and JPEG are the safe choices. GIF is accepted (first frame). SVG is supported in 3.x and renders in PowerPoint 2016 and later; when generating in the browser PptxGenJS rasterises a PNG fallback through a canvas for older viewers. For photographs use JPEG to keep the file small; for logos and screenshots use PNG for sharp edges. A 4000-pixel-wide PNG on every slide makes a 60 MB deck that email will bounce, so resize before embedding.

> **Warning:** Passing `data` without the `image/png;base64,` header, or with the wrong type (a JPEG labelled as PNG), produces a file PowerPoint offers to "repair" and then shows a broken-image icon. Always derive the header from the real format; `canvas.toDataURL("image/png")` and `FileReader.readAsDataURL()` both produce correct ones.

### Try It Yourself

```js
// Build a small badge on a canvas, then embed it as a base64 image.
const canvas = document.createElement("canvas");
canvas.width = 400; canvas.height = 400;
const ctx = canvas.getContext("2d");
const g = ctx.createLinearGradient(0, 0, 400, 400);
g.addColorStop(0, "#1F618D"); g.addColorStop(1, "#B7472A");
ctx.fillStyle = g; ctx.beginPath(); ctx.arc(200, 200, 190, 0, Math.PI * 2); ctx.fill();
ctx.fillStyle = "#FFFFFF"; ctx.font = "bold 120px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
ctx.fillText("AR", 200, 205);
const badge = canvas.toDataURL("image/png");

const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addImage({ data: badge, x: 0.5, y: 0.5, w: 1.5, h: 1.5, altText: "AR badge" });
slide.addImage({ data: badge, x: 2.5, y: 0.5, w: 3, h: 1.5, sizing: { type: "contain", w: 3, h: 1.5 } });
slide.addImage({ data: badge, x: 6, y: 0.5, w: 3, h: 1.5, sizing: { type: "cover", w: 3, h: 1.5 } });
slide.addText("natural / contain / cover", { x: 0.5, y: 2.3, w: 9, h: 0.4, fontSize: 12, color: "666666" });
slide.addImage({ data: badge, x: 0.5, y: 3, w: 1.2, h: 1.2, rounding: true, hyperlink: { url: "https://github.com/gitbrent/PptxGenJS", tooltip: "PptxGenJS" } });

pptx.writeFile({ fileName: "images.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. Which image source works identically in Node and the browser?
- [ ] `path` with a relative file path
- [x] `data` with a base64 string
- [ ] `url`
> Base64 data needs no filesystem and no HTTP fetch, so it behaves the same everywhere.

2. What does `sizing: { type: "cover", w, h }` do?
- [ ] Stretches the image to `w` x `h`
- [x] Scales to fill `w` x `h`, keeping aspect ratio and cropping the overflow
- [ ] Adds a border
> `contain` leaves space; `cover` crops; `crop` shows a window into the image.

3. What happens if the `data` string lacks the `image/png;base64,` header?
- [x] The deck may trigger a PowerPoint repair prompt and show a broken image
- [ ] PptxGenJS detects the format automatically from the bytes
- [ ] The image is silently skipped
> The header tells PptxGenJS the media type to write into the package.

### Exercises

1. **Logo top-right** — Place a base64 logo in the top-right corner of every one of three slides, 1.2 inches wide, 0.15 inches from the edges.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
for (let i = 0; i < 3; i++) {
  const s = pptx.addSlide();
  s.addImage({ data: logoData, x: 10 - 1.2 - 0.15, y: 0.15, w: 1.2, h: 0.4, altText: "logo" });
  s.addText(`Slide ${i + 1}`, { x: 0.5, y: 2.5, w: 9, h: 0.6, fontSize: 24 });
}
pptx.writeFile({ fileName: "logos.pptx" });
```

</details>

2. **File input to slide** — In the browser, read a user-selected image with `FileReader` and add it to a slide at its natural aspect ratio, 6 inches wide.
<details><summary>Solution</summary>

```js
document.querySelector("#file").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const pptx = new PptxGenJS();
      const w = 6, h = w * img.naturalHeight / img.naturalWidth;
      pptx.addSlide().addImage({ data: reader.result, x: 2, y: 0.5, w, h });
      pptx.writeFile({ fileName: "upload.pptx" });
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});
```

</details>

### Interview Questions

**Q: How do you handle images when the same generator runs in Node and in the browser?**
I normalise to base64 `data` at the boundary. In Node a small helper reads the file and prefixes `image/png;base64,`; in the browser the image arrives from a canvas, a `FileReader` or a `fetch` followed by `blob` to data-URL conversion. The slide-building code then only ever sees `data`, so it is identical in both environments and has no CORS or path-resolution surprises. The cost is memory for large images, so I resize photos to the display size before encoding.

**Q: A generated deck is 80 MB. What do you check?**
Images first. Each `addImage` embeds the full source bytes, so a 12-megapixel photo on twenty slides is twenty copies of a 5 MB file. I resize to the rendered size (a full-slide image needs no more than about 1920 pixels wide), use JPEG for photos, and reuse the same data string for repeated logos. Then I enable `compression: true` on `writeFile`, which deflates the XML parts. Charts are XML and tiny; tables are tiny; so a large deck is almost always an image problem.

**Q: Why does an image show as a red X or a "repair" prompt appears?**
Nearly always a media-type mismatch: JPEG bytes declared as PNG, a `data` string missing its header, an SVG on a viewer that predates SVG support without a PNG fallback, or a `path` that failed to fetch in the browser so an empty part was written. I check the header string, confirm the fetch succeeded before building, and open the `.pptx` as a zip to inspect `ppt/media/` and the content types. Using `data` with headers derived from the real format removes the whole class of errors.

## Saving: writeFile, write and blobs

Building slides costs nothing until you serialise the presentation. PptxGenJS offers three output methods, and picking the right one depends on where the bytes need to go: a file on disk, a browser download, an HTTP response, an email attachment or another library.

### `writeFile()`

```js
pptx.writeFile({ fileName: "weekly-status.pptx" })
  .then(fileName => console.log("wrote", fileName));
```

In Node this writes the file relative to the current working directory (or to an absolute path you provide) and resolves with the name. In the browser it creates a Blob, attaches it to a temporary `<a download>` link and clicks it, which triggers the browser's download; there is no file dialog and no access to the user's filesystem. The `.pptx` extension is added if missing.

Add `compression: true` to deflate the zip entries. Decks with many text slides shrink by half; image-heavy decks barely change because image bytes are already compressed.

### `write()` for bytes

`write()` returns the presentation as data instead of saving it. `outputType` selects the shape of that data:

| `outputType` | Returns | Typical use |
|---|---|---|
| `"blob"` (default) | `Blob` | browser downloads, uploads via `FormData` |
| `"arraybuffer"` | `ArrayBuffer` | browser, then wrap in `Uint8Array` |
| `"uint8array"` | `Uint8Array` | passing to other libraries |
| `"base64"` | string | email attachments, JSON APIs |
| `"binarystring"` | string | legacy |
| `"nodebuffer"` | `Buffer` | Node: `fs.writeFile`, S3 upload, HTTP response |

```js
// Node
const fs = require("fs");
const buf = await pptx.write({ outputType: "nodebuffer" });
fs.writeFileSync("/reports/weekly-status.pptx", buf);

// Browser: upload instead of download
const blob = await pptx.write({ outputType: "blob" });
const form = new FormData();
form.append("deck", blob, "weekly-status.pptx");
await fetch("/api/upload", { method: "POST", body: form });
```

### `stream()` for HTTP responses

`stream()` produces the file for piping straight into an HTTP response, so a Node server can generate a deck on request without touching disk:

```js
app.get("/report.pptx", async (req, res) => {
  const pptx = buildReport(await loadData());
  const data = await pptx.stream();
  res.writeHead(200, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "Content-Disposition": "attachment; filename=weekly-status.pptx",
    "Content-Length": data.length,
  });
  res.end(Buffer.from(data, "binary"));
});
```

### Everything is asynchronous

All three methods return Promises because zipping runs asynchronously. Do not forget to `await` or `.then()`, and if the generator is a function, return the promise so callers can chain. A common bug is returning from a request handler before the write completes, which yields an empty response.

```js
async function saveDeck(pptx, name) {
  try {
    const f = await pptx.writeFile({ fileName: name, compression: true });
    return f;
  } catch (err) {
    console.error("deck generation failed:", err);
    throw err;
  }
}
```

### The browser helper on this site

The Try It runner provides `download(blob, filename)` for any Blob. `pptx.writeFile()` already downloads, so you rarely need it for PptxGenJS, but it is the way to save output produced by `write()` after you have inspected or modified it:

```js
const blob = await pptx.write({ outputType: "blob" });
console.log("deck size:", blob.size, "bytes");
download(blob, "inspected.pptx");
```

> **Tip:** Name files with the reporting period, not just "report": `status-2026-W11.pptx` sorts correctly in a folder and tells the recipient what they have before opening it. Build the name from the data, never from `new Date()` at run time, so a re-run for last week produces last week's name.

### Try It Yourself

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Saving demo", { x: 0.5, y: 2, w: 9, h: 1, fontSize: 32, align: "center" });

(async () => {
  const blob = await pptx.write({ outputType: "blob", compression: true });
  console.log("blob type:", blob.type, "| size:", blob.size, "bytes");
  const b64 = await pptx.write({ outputType: "base64" });
  console.log("base64 length:", b64.length, "| starts with:", b64.slice(0, 8));
  const name = await pptx.writeFile({ fileName: "saving-demo.pptx" });
  console.log("downloaded as", name);
})();
```

### Quiz

1. Which `outputType` do you use to hand the deck to `fs.writeFileSync` in Node?
- [ ] `"blob"`
- [x] `"nodebuffer"`
- [ ] `"base64"`
> A Node `Buffer` is what the filesystem and most Node APIs expect.

2. What does `writeFile()` do in the browser?
- [ ] Opens a save dialog
- [x] Creates a Blob and triggers a download via a temporary link
- [ ] Writes to `localStorage`
> Browsers cannot write to the filesystem directly; a download is the only path.

3. Why must you `await` the output methods?
- [x] Serialisation is asynchronous and the Promise resolves when bytes are ready
- [ ] To set the file name
- [ ] They are synchronous; awaiting is optional
> Returning before the Promise resolves gives you nothing, or an empty HTTP response.

### Exercises

1. **Size report** — Build a deck with 10 text slides, then log its size with and without `compression`.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
for (let i = 1; i <= 10; i++) pptx.addSlide().addText("Slide " + i + " " + "lorem ".repeat(200), { x: 0.5, y: 0.5, w: 9, h: 4, fontSize: 10 });
(async () => {
  const a = await pptx.write({ outputType: "blob" });
  const b = await pptx.write({ outputType: "blob", compression: true });
  console.log("plain:", a.size, "compressed:", b.size);
})();
```

</details>

2. **Base64 for an API** — Produce a base64 string and log a JSON payload `{ filename, contentBase64 }` ready to POST to an email service.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
pptx.addSlide().addText("Attachment", { x: 1, y: 1, w: 8, h: 1 });
pptx.write({ outputType: "base64" }).then(b64 => {
  const payload = { filename: "status-2026-W11.pptx", contentBase64: b64 };
  console.log(JSON.stringify(payload).slice(0, 120) + "...");
});
```

</details>

### Interview Questions

**Q: How would you serve generated decks from a web service without writing temp files?**
Build the presentation in memory and use `pptx.stream()` or `write({ outputType: "nodebuffer" })`, then send the bytes in the HTTP response with the PresentationML content type and a `Content-Disposition: attachment` header. No temp files means no cleanup and no collisions between concurrent requests. For large volumes I cap concurrency, because each build holds the whole zip in memory, and I cache the data query rather than the deck so that identical requests within a window reuse the data but still get a fresh file name.

**Q: What are the trade-offs of `compression: true`?**
It deflates every part in the zip, which cuts text-heavy decks roughly in half and makes email and SharePoint uploads faster, at the cost of a slightly longer write. Image-heavy decks gain little because PNG and JPEG bytes are already compressed. PowerPoint opens both forms identically. I turn it on by default for anything that leaves the machine and leave it off in tight loops where I am generating hundreds of decks and measuring throughput.

**Q: When do you prefer `write()` over `writeFile()`?**
Whenever something other than a local save or a browser download needs the bytes: uploading to S3 or SharePoint, attaching to an email as base64, returning from an API, storing in a database, or post-processing with another library. `writeFile()` is a convenience for the two simplest cases; `write()` gives me the data and lets me decide, and it is what I use in any service code so the transport is explicit and testable.

# LEVEL: Intermediate

## Tables: rows, column widths and autoPage

Production reports are tables: files per state, exceptions per agent, rate bands per underwriter. `slide.addTable()` takes an array of rows, where each row is an array of cells, and an options object for position, column widths, borders and fonts. Its `autoPage` feature splits a long table across slides automatically, which is the single biggest time-saver in this library for report decks.

### Rows and cells

A cell is a string, a number, or an object `{ text, options }` when it needs its own formatting.

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();

const header = [
  { text: "State", options: { bold: true, color: "FFFFFF", fill: { color: "1F618D" } } },
  { text: "Opened", options: { bold: true, color: "FFFFFF", fill: { color: "1F618D" }, align: "right" } },
  { text: "Closed", options: { bold: true, color: "FFFFFF", fill: { color: "1F618D" }, align: "right" } },
  { text: "Exceptions", options: { bold: true, color: "FFFFFF", fill: { color: "1F618D" }, align: "right" } },
];
const rows = [
  header,
  ["WY", "412", "398", "7"],
  ["TX", "1,904", "1,877", "21"],
  ["NM", "233", "240", "0"],
];
slide.addTable(rows, { x: 0.5, y: 1, w: 9, colW: [2, 2.3, 2.3, 2.4], fontSize: 12, border: { type: "solid", pt: 0.5, color: "BFC9CA" } });
```

`colW` is an array of column widths in inches (or a single number for equal columns); if you supply it, `w` is derived from the sum. `rowH` works the same way for row heights and is a minimum, since rows grow to fit wrapped text.

### Table-level versus cell-level options

| Option | Table level | Cell level | Notes |
|---|---|---|---|
| `fontFace`, `fontSize`, `color`, `bold`, `italic` | yes | yes | cell overrides table |
| `align`, `valign` | yes | yes | |
| `fill` | yes | yes | `{ color }` |
| `border` | yes | yes | one object or `[top, right, bottom, left]` |
| `margin` | yes | yes | cell padding in points |
| `colspan`, `rowspan` | no | yes | merged cells |
| `hyperlink` | no | yes | |

Borders take `{ type: "solid" | "dash" | "none", pt, color }`. To draw only horizontal rules, set `border: [{ type: "solid", pt: 0.5, color: "BFC9CA" }, { type: "none" }, { type: "solid", pt: 0.5, color: "BFC9CA" }, { type: "none" }]`.

### Merged cells

```js
const rows = [
  [{ text: "Owner's policy", options: { colspan: 2, bold: true, align: "center", fill: { color: "EAF2F8" } } },
   { text: "Loan policy",   options: { colspan: 2, bold: true, align: "center", fill: { color: "EAF2F8" } } }],
  ["From", "To", "From", "To"],
  ["$0", "$50,000", "$0", "$50,000"],
];
```

A cell with `colspan: 2` occupies two columns, and you simply omit the covered cell from that row. `rowspan` works vertically: put the spanning cell in the first row and omit it from the rows below.

### Multi-run cells and numbers

Cell text can be an array of text runs, which is how you get a value with a coloured delta in one cell:

```js
[{ text: [{ text: "1,877 " }, { text: "▲ 2.1%", options: { color: "27AE60", fontSize: 10 } }], options: { align: "right" } }]
```

Format numbers before they reach the table with `Intl.NumberFormat`; PptxGenJS writes strings, not numeric cells, so PowerPoint will not format them for you.

### autoPage: long tables across slides

```js
slide.addTable(bigRows, {
  x: 0.5, y: 1.2, w: 9, colW: [1.5, 2.5, 2.5, 2.5], fontSize: 10,
  autoPage: true,
  autoPageRepeatHeader: true,   // header row(s) repeat on each continuation slide
  autoPageHeaderRows: 1,
  autoPageSlideStartY: 0.8,     // y where the table starts on continuation slides
  autoPageLineWeight: 0,        // -1..1: tune if rows are estimated too tall/short
});
console.log("continuation slides:", slide.newAutoPagedSlides.length);
```

PptxGenJS estimates how many rows fit on each slide from the font size and row heights, creates new slides as needed, and returns them in `slide.newAutoPagedSlides` so you can add a title or a "continued" label to each. If a table runs past the slide bottom, nudge `autoPageLineWeight` toward `1`; if slides are left half-empty, toward `-1`. `autoPageCharWeight` adjusts the estimate of characters per line for wrapped cells the same way.

The continuation slides inherit the master of the original slide when you created it with `masterName`, so headers and footers carry over.

> **Warning:** `h` is ignored when `autoPage` is on, and a `rowH` larger than the estimated row height forces fewer rows per slide than you expect. Test autoPage with the real data volume; a 3,346-row rate matrix produces roughly 120 slides at 10 pt, which is a signal to filter or summarise rather than paginate.

### Try It Yourself

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Files by state, week 11", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, bold: true, color: "1F618D" });

const H = { bold: true, color: "FFFFFF", fill: { color: "1F618D" } };
const header = ["State", "Opened", "Closed", "Exceptions", "Rate"].map((t, i) => ({ text: t, options: { ...H, align: i ? "right" : "left" } }));
const data = [["WY", 412, 398, 7], ["TX", 1904, 1877, 21], ["NM", 233, 240, 0], ["CO", 611, 590, 4], ["UT", 388, 401, 2]];
const fmt = new Intl.NumberFormat("en-US");
const rows = [header, ...data.map(([st, o, c, e], i) => [
  st,
  { text: fmt.format(o), options: { align: "right" } },
  { text: fmt.format(c), options: { align: "right" } },
  { text: String(e), options: { align: "right", color: e > 10 ? "C0392B" : "2C3E50", bold: e > 10 } },
  { text: (100 * e / c).toFixed(1) + "%", options: { align: "right" } },
].map(cell => typeof cell === "string" ? { text: cell, options: { fill: { color: i % 2 ? "F4F6F7" : "FFFFFF" } } }
                                        : { ...cell, options: { ...cell.options, fill: { color: i % 2 ? "F4F6F7" : "FFFFFF" } } }))];

slide.addTable(rows, { x: 0.5, y: 1.1, colW: [1.6, 1.85, 1.85, 1.85, 1.85], fontSize: 12, fontFace: "Calibri",
  border: { type: "solid", pt: 0.5, color: "D5D8DC" }, margin: 4 });

pptx.writeFile({ fileName: "table.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. How do you make the header row repeat on every continuation slide?
- [ ] `repeatHeader: true`
- [x] `autoPage: true, autoPageRepeatHeader: true`
- [ ] Add the header to every row manually
> `autoPageRepeatHeader` with `autoPageHeaderRows` controls how many rows repeat.

2. Where do the automatically created continuation slides end up?
- [ ] They replace the original slide
- [x] In `slide.newAutoPagedSlides`
- [ ] In `pptx.autoSlides`
> The array lets you add titles or "continued" labels to each new slide.

3. Which option merges a cell across two columns?
- [x] `colspan: 2` in the cell's options
- [ ] `merge: [0, 1]` on the table
- [ ] `w: 2` on the cell
> Merged cells are declared per cell; omit the covered cells from that row.

### Exercises

1. **Zebra rows helper** — Write `zebra(rows, colorA, colorB)` that returns a copy of the rows with alternating fills applied to every cell, preserving existing cell options.
<details><summary>Solution</summary>

```js
function zebra(rows, a = "FFFFFF", b = "F4F6F7") {
  return rows.map((row, i) => row.map(cell => {
    const c = typeof cell === "object" && cell !== null ? cell : { text: String(cell) };
    return { ...c, options: { ...(c.options || {}), fill: { color: i % 2 ? b : a } } };
  }));
}
```

</details>

2. **Paged rate table** — Generate 120 rows of `[from, to, premium]` and add them with `autoPage`, then log how many slides were created and add a "continued" label to each continuation slide.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
const s = pptx.addSlide();
const rows = [[{ text: "From", options: { bold: true } }, { text: "To", options: { bold: true } }, { text: "Premium", options: { bold: true } }]];
for (let i = 0; i < 120; i++) rows.push([`$${i * 5000 + 1}`, `$${(i + 1) * 5000}`, `$${(325 + i * 12).toFixed(2)}`]);
s.addTable(rows, { x: 0.5, y: 0.8, colW: [3, 3, 3], fontSize: 10, autoPage: true, autoPageRepeatHeader: true, autoPageSlideStartY: 0.8 });
s.newAutoPagedSlides.forEach(ns => ns.addText("Rate table (continued)", { x: 0.5, y: 0.2, w: 9, h: 0.5, fontSize: 14, color: "7F8C8D" }));
console.log("slides created:", 1 + s.newAutoPagedSlides.length);
pptx.writeFile({ fileName: "paged-table.pptx" });
```

</details>

### Interview Questions

**Q: How do you present a long table in a generated deck?**
First I ask whether it belongs in a deck at all; a 3,000-row matrix belongs in an Excel attachment with a summary slide. If it must be paged, I use `autoPage` with `autoPageRepeatHeader`, set `autoPageSlideStartY` so continuation slides align with the master, and label each slide from `newAutoPagedSlides`. I tune `autoPageLineWeight` against real data because the row-height estimate is approximate, and I keep the font at 10-11 points with no more than six columns so the pages stay readable when projected.

**Q: Why does PptxGenJS not right-align numbers automatically?**
Because table cells are text; the library does not know a string is a number. I format values with `Intl.NumberFormat` before building rows and set `align: "right"` on numeric cells, usually with a small helper that takes the column index and returns the right options. This also gives control over thousands separators, decimals and currency symbols, which vary by client.

**Q: What causes a table to overflow the slide even without autoPage?**
Rows grow to fit wrapped text, so a narrow column with long strings makes every row taller than `rowH`. Fixes are wider `colW` for the text column, a smaller `fontSize`, truncating with an ellipsis, or splitting the table. I estimate height as rows times line height times lines per cell before adding, and switch to `autoPage` when the estimate passes the available space.

## Charts: bar, line and pie

Native charts are one of the best reasons to generate decks with PptxGenJS rather than pasting images: the chart is a real PowerPoint chart object with editable data, it stays crisp at any zoom, and it adopts the theme. `slide.addChart(type, data, options)` covers bar, column, line, area, pie, doughnut, radar, scatter and bubble charts.

### Data series

Every series is an object with a `name`, an array of `labels` (categories) and an array of `values` of the same length. Bar and line charts take one or more series that share labels.

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();

const weeks = ["W08", "W09", "W10", "W11"];
const data = [
  { name: "Opened", labels: weeks, values: [2100, 2240, 2180, 2316] },
  { name: "Closed", labels: weeks, values: [2050, 2190, 2210, 2275] },
];
slide.addChart(pptx.ChartType.bar, data, { x: 0.5, y: 1, w: 6, h: 3.5, barDir: "col", barGrouping: "clustered" });
```

`barDir: "col"` gives vertical columns; `"bar"` gives horizontal bars. `barGrouping` is `"clustered"`, `"stacked"` or `"percentStacked"`.

### The options that matter most

| Group | Options |
|---|---|
| colours | `chartColors: ["1F618D", "27AE60"]` (one per series, or per slice for pie), `chartColorsOpacity` |
| legend | `showLegend`, `legendPos: "b" / "t" / "l" / "r" / "tr"`, `legendFontSize` |
| title | `showTitle`, `title`, `titleFontSize`, `titleColor` |
| data labels | `showValue`, `dataLabelFormatCode: "#,##0"`, `dataLabelFontSize`, `dataLabelColor`, `dataLabelPosition` |
| category axis | `catAxisTitle`, `showCatAxisTitle`, `catAxisLabelFontSize`, `catAxisLabelRotate`, `catAxisHidden` |
| value axis | `valAxisTitle`, `showValAxisTitle`, `valAxisMinVal`, `valAxisMaxVal`, `valAxisMajorUnit`, `valAxisLabelFormatCode`, `valAxisHidden` |
| gridlines | `valGridLine: { style: "dash", color: "D5D8DC", size: 0.5 }` or `{ style: "none" }`, `catGridLine` |

```js
slide.addChart(pptx.ChartType.bar, data, {
  x: 0.5, y: 1, w: 6, h: 3.5, barDir: "col",
  chartColors: ["1F618D", "27AE60"],
  showLegend: true, legendPos: "b",
  showTitle: true, title: "Files opened vs closed", titleFontSize: 14,
  showValue: true, dataLabelFormatCode: "#,##0", dataLabelFontSize: 9,
  valAxisMinVal: 0, valAxisLabelFormatCode: "#,##0", valGridLine: { style: "dash", color: "D5D8DC", size: 0.5 },
  catAxisLabelFontSize: 10, valAxisLabelFontSize: 10,
});
```

Format codes are Excel number formats: `"#,##0"`, `"0.0%"`, `"$#,##0.00"`.

### Line charts

```js
const rate = [{ name: "Exception rate %", labels: weeks, values: [1.9, 1.6, 1.4, 1.2] }];
slide.addChart(pptx.ChartType.line, rate, {
  x: 6.7, y: 1, w: 3, h: 3.5, chartColors: ["C0392B"],
  lineSize: 2, lineDataSymbol: "circle", lineDataSymbolSize: 6, lineSmooth: false,
  valAxisMinVal: 0, valAxisMaxVal: 3, valAxisMajorUnit: 0.5, showLegend: false,
  showValue: true, dataLabelPosition: "t", dataLabelFormatCode: "0.0",
});
```

`lineDataSymbol` is `"none"`, `"circle"`, `"square"`, `"diamond"`, `"triangle"`, `"dash"` or `"dot"`; `lineDash` uses the same values as shape dashes.

### Pie and doughnut

Pie charts take exactly one series; each label is a slice and `chartColors` applies per slice.

```js
const mix = [{ name: "Files by state", labels: ["TX", "CO", "WY", "UT", "NM"], values: [1877, 590, 398, 401, 240] }];
slide.addChart(pptx.ChartType.doughnut, mix, {
  x: 0.5, y: 1, w: 4, h: 3.5, holeSize: 55,
  chartColors: ["1F618D", "27AE60", "F39C12", "8E44AD", "7F8C8D"],
  showPercent: true, showLabel: false, dataLabelPosition: "bestFit", dataLabelColor: "FFFFFF",
  showLegend: true, legendPos: "r",
});
```

`holeSize` (percent) turns a doughnut into a thin ring or a near-pie; `showPercent` computes percentages for you.

### Other chart types

`area` behaves like `line` with fills. `radar` takes `radarStyle: "standard" | "marker" | "filled"`. `scatter` and `bubble` use a different data shape: the first series holds the X values and every following series holds Y values (and `sizes` for bubbles). Check the type before reaching for them; most report decks need only bar, line and pie.

> **Interview note:** Be ready to explain why native charts beat chart images: editable data, theme-aware colours, crisp rendering, accessibility, and a far smaller file. The only reason to embed an image is a chart type PowerPoint cannot draw.

### Try It Yourself

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Production KPIs, weeks 8-11", { x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 20, bold: true, color: "1F618D" });

const weeks = ["W08", "W09", "W10", "W11"];
slide.addChart(pptx.ChartType.bar, [
  { name: "Opened", labels: weeks, values: [2100, 2240, 2180, 2316] },
  { name: "Closed", labels: weeks, values: [2050, 2190, 2210, 2275] },
], { x: 0.4, y: 0.9, w: 4.6, h: 2.4, barDir: "col", chartColors: ["1F618D", "27AE60"], showLegend: true, legendPos: "b",
     legendFontSize: 9, valAxisMinVal: 0, valAxisLabelFormatCode: "#,##0", valGridLine: { style: "dash", color: "D5D8DC", size: 0.5 },
     catAxisLabelFontSize: 9, valAxisLabelFontSize: 9, showTitle: true, title: "Files", titleFontSize: 11 });

slide.addChart(pptx.ChartType.line, [{ name: "Exception %", labels: weeks, values: [1.9, 1.6, 1.4, 1.2] }],
  { x: 5.1, y: 0.9, w: 4.5, h: 2.4, chartColors: ["C0392B"], lineSize: 2, lineDataSymbol: "circle", showLegend: false,
    valAxisMinVal: 0, valAxisMaxVal: 3, valAxisMajorUnit: 1, showValue: true, dataLabelPosition: "t", dataLabelFormatCode: "0.0",
    showTitle: true, title: "Exception rate", titleFontSize: 11, catAxisLabelFontSize: 9, valAxisLabelFontSize: 9 });

slide.addChart(pptx.ChartType.doughnut, [{ name: "By state", labels: ["TX", "CO", "UT", "WY", "NM"], values: [1877, 590, 401, 398, 240] }],
  { x: 0.4, y: 3.4, w: 4.6, h: 2.1, holeSize: 55, chartColors: ["1F618D", "27AE60", "8E44AD", "F39C12", "7F8C8D"],
    showPercent: true, showLabel: false, dataLabelColor: "FFFFFF", dataLabelFontSize: 9, showLegend: true, legendPos: "r", legendFontSize: 9 });

pptx.writeFile({ fileName: "charts.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. How many series can a pie chart have?
- [x] Exactly one
- [ ] Any number
- [ ] Two
> Each label in the single series becomes a slice; `chartColors` applies per slice.

2. Which option gives a horizontal bar chart?
- [ ] `orientation: "horizontal"`
- [x] `barDir: "bar"`
- [ ] `type: "hbar"`
> `barDir` is `"bar"` for horizontal and `"col"` for vertical columns.

3. What format does `dataLabelFormatCode` expect?
- [ ] printf-style, e.g. `%d`
- [x] Excel number format, e.g. `"#,##0"` or `"0.0%"`
- [ ] JavaScript `toFixed` digits
> Charts are Office objects, so all number formats are Excel format codes.

### Exercises

1. **Stacked by state** — Build a stacked column chart with series `Owner` and `Loan` across five states, with totals shown as data labels.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
const s = pptx.addSlide();
const states = ["TX", "CO", "UT", "WY", "NM"];
s.addChart(pptx.ChartType.bar, [
  { name: "Owner", labels: states, values: [1100, 350, 240, 230, 150] },
  { name: "Loan",  labels: states, values: [777, 240, 161, 168, 90] },
], { x: 0.5, y: 1, w: 9, h: 4, barDir: "col", barGrouping: "stacked", chartColors: ["1F618D", "85C1E9"],
     showValue: true, dataLabelFormatCode: "#,##0", showLegend: true, legendPos: "b", valAxisLabelFormatCode: "#,##0" });
pptx.writeFile({ fileName: "stacked.pptx" });
```

</details>

2. **Chart from an object** — Given `{ WY: 398, TX: 1877, NM: 240 }`, convert it into a single-series pie with labels sorted by value descending.
<details><summary>Solution</summary>

```js
const totals = { WY: 398, TX: 1877, NM: 240 };
const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
const pptx = new PptxGenJS();
pptx.addSlide().addChart(pptx.ChartType.pie,
  [{ name: "Closed files", labels: entries.map(e => e[0]), values: entries.map(e => e[1]) }],
  { x: 2, y: 0.8, w: 6, h: 4, showPercent: true, showLegend: true, legendPos: "r" });
pptx.writeFile({ fileName: "pie.pptx" });
```

</details>

### Interview Questions

**Q: How do you keep charts across a deck visually consistent?**
A shared options object: palette order, font sizes for axes and legends, gridline style, number formats and legend position, spread into every `addChart` call with only the data and the title varying. I also fix `valAxisMinVal` at zero for counts so bars are comparable between slides, and choose `valAxisMaxVal` and `valAxisMajorUnit` from the data so that adjacent charts share a scale where comparisons matter. The result is that a reader can scan slides without re-reading axes.

**Q: Explain the data structure `addChart` expects and a common mistake.**
An array of series objects, each with `name`, `labels` and `values` of equal length; all series in one chart should share the same labels in the same order. The common mistake is mismatched lengths, for example a week with missing data producing three values against four labels, which yields a chart that renders oddly or a file PowerPoint wants to repair. I validate lengths before calling and fill gaps with `null` or zero explicitly, choosing based on whether a gap or a zero is the honest representation.

**Q: When would you embed a chart as an image instead?**
Only for chart types PowerPoint cannot draw natively, such as a Sankey, a heat-map calendar or an annotated map, which I would render with a JavaScript library to a canvas and embed as PNG. For everything else native charts win on file size, crispness, editability and theme compliance, and they let the reviewer click into the data to check a figure, which matters for a production report that leadership will interrogate.

## Slide masters, layouts and placeholders

Every report deck has chrome that repeats on every slide: a header bar, a logo, a footer with confidentiality text, a slide number. Drawing those on each slide by hand is repetitive and, worse, they become ordinary editable shapes that a client can nudge out of place. `pptx.defineSlideMaster()` puts them where they belong, on a slide layout, and gives you **placeholders** that per-slide code fills by name.

### Defining a master

```js
const pptx = new PptxGenJS();
pptx.defineSlideMaster({
  title: "CONTENT",                                  // unique name, referenced by addSlide
  background: { color: "FFFFFF" },
  margin: [0.5, 0.25, 1.0, 0.25],                    // top, right, bottom, left, inches
  objects: [
    { rect:  { x: 0, y: 0, w: "100%", h: 0.7, fill: { color: "1F618D" } } },
    { line:  { x: 0.4, y: 5.15, w: 9.2, h: 0, line: { color: "D5D8DC", width: 0.75 } } },
    { text:  { text: "Production Support | Confidential", options: { x: 0.4, y: 5.2, w: 6, h: 0.3, fontSize: 9, color: "7F8C8D" } } },
    { image: { x: 8.6, y: 0.15, w: 1.2, h: 0.4, data: logoData } },
    { placeholder: { options: { name: "title", type: "title", x: 0.4, y: 0.1, w: 8, h: 0.5, fontSize: 20, bold: true, color: "FFFFFF" }, text: "(slide title)" } },
    { placeholder: { options: { name: "body",  type: "body",  x: 0.4, y: 1.0, w: 9.2, h: 4.0, fontSize: 14, color: "2C3E50" }, text: "(content)" } },
  ],
  slideNumber: { x: 9.2, y: 5.2, w: 0.5, h: 0.3, fontSize: 9, color: "7F8C8D" },
});
```

`objects` accepts `rect`, `line`, `text`, `image`, `chart` and `placeholder` entries, each with the same options as the corresponding `slide.add*` call. In PowerPoint the result appears under View → Slide Master as a layout named `CONTENT`; the rect, line, text and image are locked on the layout and cannot be selected on a normal slide.

### Using the master

```js
const slide = pptx.addSlide({ masterName: "CONTENT" });
slide.addText("Weekly status, week 11", { placeholder: "title" });
slide.addText("Volume up 4% week on week\nException rate 1.2%", { placeholder: "body" });
```

An element that names a `placeholder` takes the placeholder's position, size and formatting, and you can still override any option inline, for example `{ placeholder: "title", color: "F39C12" }`. Placeholder `type` is one of `title`, `body`, `pic`, `chart`, `tbl` or `media`; use `pic` with `slide.addImage({ placeholder: "pic", data })`.

Unfilled placeholders show their prompt `text` in edit mode and render as empty in slideshow and PDF, which is exactly how PowerPoint's own layouts behave. That makes a master with a `pic` placeholder ideal for decks a client will finish by hand.

### Several masters for several slide kinds

Real decks need a title layout, a section divider and a content layout. Define each with its own `title` and pick per slide:

```js
pptx.defineSlideMaster({ title: "TITLE", background: { color: "1F618D" }, objects: [
  { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2.0, w: 8.8, h: 1.2, fontSize: 36, bold: true, color: "FFFFFF" } } },
  { placeholder: { options: { name: "body",  type: "body",  x: 0.6, y: 3.2, w: 8.8, h: 0.6, fontSize: 16, color: "D6EAF8" } } },
]});
pptx.defineSlideMaster({ title: "SECTION", background: { color: "F4F6F7" }, objects: [
  { rect: { x: 0, y: 2.4, w: 0.25, h: 0.9, fill: { color: "B7472A" } } },
  { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2.4, w: 8.8, h: 0.9, fontSize: 30, bold: true, color: "2C3E50" } } },
]});

const t = pptx.addSlide({ masterName: "TITLE" });
t.addText("Weekly Production Status", { placeholder: "title" });
t.addText("Week ending 13 March 2026", { placeholder: "body" });
```

### Sections

Sections group slides in PowerPoint's thumbnail pane. Create one, then assign slides to it by title:

```js
pptx.addSection({ title: "Volume" });
pptx.addSlide({ masterName: "CONTENT", sectionTitle: "Volume" });
```

Long automated decks benefit from sections per state or per team, because reviewers collapse what they do not need.

| Where it lives | Editable on a normal slide? | Use for |
|---|---|---|
| master `objects` (rect, text, image, line) | no | chrome: bars, logos, footers |
| master `placeholder` | yes, content only | titles, body text, pictures |
| `slide.add*` | yes | data-specific content |

> **Tip:** Define masters before adding any slide and keep the names in constants (`const M = { title: "TITLE", content: "CONTENT" }`). A typo in `masterName` does not throw; you silently get a blank slide with no chrome.

### Try It Yourself

```js
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";

pptx.defineSlideMaster({
  title: "CONTENT", background: { color: "FFFFFF" },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.7, fill: { color: "1F618D" } } },
    { rect: { x: 0, y: 5.3, w: "100%", h: 0.325, fill: { color: "F4F6F7" } } },
    { text: { text: "Production Support | Confidential", options: { x: 0.4, y: 5.32, w: 6, h: 0.3, fontSize: 9, color: "7F8C8D" } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.4, y: 0.1, w: 8.5, h: 0.5, fontSize: 20, bold: true, color: "FFFFFF" }, text: "Title" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.4, y: 1.0, w: 9.2, h: 4.1, fontSize: 16, color: "2C3E50", valign: "top" }, text: "Body" } },
  ],
  slideNumber: { x: 9.2, y: 5.32, w: 0.5, h: 0.3, fontSize: 9, color: "7F8C8D" },
});
pptx.defineSlideMaster({
  title: "TITLE", background: { color: "1F618D" },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2, w: 8.8, h: 1.2, fontSize: 36, bold: true, color: "FFFFFF" } } },
            { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.2, w: 8.8, h: 0.6, fontSize: 16, color: "D6EAF8" } } }],
});

const t = pptx.addSlide({ masterName: "TITLE" });
t.addText("Weekly Production Status", { placeholder: "title" });
t.addText("Week ending 13 March 2026", { placeholder: "body" });

pptx.addSection({ title: "Summary" });
const s = pptx.addSlide({ masterName: "CONTENT", sectionTitle: "Summary" });
s.addText("Highlights", { placeholder: "title" });
s.addText("Volume up 4% week on week\nException rate down to 1.2%\nTX backlog cleared", { placeholder: "body" });

const u = pptx.addSlide({ masterName: "CONTENT", sectionTitle: "Summary" });
u.addText("Unfilled body placeholder", { placeholder: "title" });

pptx.writeFile({ fileName: "masters.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. What happens to a `rect` defined in a master's `objects`?
- [x] It appears on every slide using that master and cannot be selected on those slides
- [ ] It appears only on the first slide
- [ ] It becomes an editable shape on each slide
> Master objects live on the layout; only placeholders and per-slide elements are editable.

2. How does a slide fill a placeholder named `title`?
- [ ] `slide.title = "..."`
- [x] `slide.addText("...", { placeholder: "title" })`
- [ ] `slide.fill("title", "...")`
> The `placeholder` option on `addText` or `addImage` binds the element to the named placeholder.

3. What happens if `masterName` does not match any defined master?
- [ ] An exception is thrown
- [x] A blank slide with no chrome is created silently
- [ ] The first master is used
> Keep master names in constants to avoid silent typos.

### Exercises

1. **Picture placeholder** — Define a master with a `pic` placeholder on the right half and a `body` placeholder on the left, then fill both on one slide.
<details><summary>Solution</summary>

```js
const pptx = new PptxGenJS();
pptx.defineSlideMaster({ title: "SPLIT", objects: [
  { placeholder: { options: { name: "body", type: "body", x: 0.4, y: 0.6, w: 4.6, h: 4.5, fontSize: 16 } } },
  { placeholder: { options: { name: "pic", type: "pic", x: 5.2, y: 0.6, w: 4.4, h: 4.5 } } },
]});
const s = pptx.addSlide({ masterName: "SPLIT" });
s.addText("Screenshot of the rate calculator", { placeholder: "body" });
s.addImage({ placeholder: "pic", data: screenshotData });
pptx.writeFile({ fileName: "split.pptx" });
```

</details>

2. **Section per state** — For `["TX", "CO", "WY"]`, create a section and one content slide each, with the state as the title.
<details><summary>Solution</summary>

```js
["TX", "CO", "WY"].forEach(st => {
  pptx.addSection({ title: st });
  const s = pptx.addSlide({ masterName: "CONTENT", sectionTitle: st });
  s.addText(`${st} production summary`, { placeholder: "title" });
});
```

</details>

### Interview Questions

**Q: What is the difference between drawing chrome on every slide and using a slide master?**
Per-slide shapes are ordinary editable objects: they add to file size, can be moved or deleted by accident, and make every slide's code longer. Master objects live on the layout part once, are locked on normal slides, and make the deck behave like a proper PowerPoint template, so a client can add their own slides that inherit the chrome. Placeholders on the master also give consistent positions and fonts to titles and body text without repeating options. I use masters for anything that repeats and keep per-slide code for data.

**Q: How do placeholders interact with inline options?**
An element with `placeholder: "title"` inherits the placeholder's position, size and text formatting from the master; any option passed inline on the same call overrides the inherited value for that element only. So the master defines the norm and a slide can deviate, for example a red title on an alert slide. Unfilled placeholders render empty in show mode but display their prompt text in edit mode, which is desirable for partially automated decks that someone finishes by hand.

**Q: How would you build a template a client can reuse manually after you deliver it?**
Define masters for each slide kind with placeholders for every editable region, including `pic` placeholders where photos go, set theme fonts and the palette, and generate a short sample deck that uses every master. Because PptxGenJS writes real layouts, the client opens the deck, chooses New Slide and sees the layouts by name. I document the master names and the intended use of each in speaker notes on the sample slides.

## Bullets and multi-run text

Body text on a content slide is rarely one uniform string. It has bullet points, sub-points, a bold label followed by a value, a red delta after a number. PptxGenJS handles all of that with two mechanisms: bullet options on a paragraph, and arrays of **text runs** where each run carries its own formatting.

### Bullets on a plain string

Newlines in a string create paragraphs; `bullet: true` puts a bullet in front of each one.

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Volume up 4% week on week\nException rate at 1.2%\nTX backlog cleared",
  { x: 0.5, y: 1, w: 9, h: 2, fontSize: 16, bullet: true, paraSpaceAfter: 6 });
```

Bullet variants:

| Option | Effect |
|---|---|
| `bullet: true` | standard round bullet |
| `bullet: { type: "number" }` | numbered list (1. 2. 3.) |
| `bullet: { type: "number", numberType: "alphaLcPeriod" }` | a. b. c.; also `romanLcParenR`, `arabicParenR` and others |
| `bullet: { type: "number", numberStartAt: 5 }` | start numbering at 5 |
| `bullet: { characterCode: "25BA" }` | custom Unicode bullet (▶) |
| `bullet: { indent: 15 }` | space between bullet and text, points |
| `indentLevel: 1` | nested level (0-based) |

### Runs: an array of `{ text, options }`

Passing an array instead of a string gives per-run control. Runs flow together on one line until one sets `breakLine: true`, which ends the paragraph.

```js
slide.addText([
  { text: "Files closed: ", options: { bold: true } },
  { text: "1,877 ", options: { color: "1F618D", bold: true } },
  { text: "▲ 2.1%", options: { color: "27AE60", fontSize: 12, breakLine: true } },
  { text: "Exceptions: ", options: { bold: true } },
  { text: "21 ", options: { color: "1F618D", bold: true } },
  { text: "▼ 30%", options: { color: "27AE60", fontSize: 12 } },
], { x: 0.5, y: 3.2, w: 9, h: 1.2, fontSize: 16 });
```

Options on the outer object are defaults for every run; each run overrides what it needs. Any run that carries a `bullet` option starts its own paragraph automatically, so bulleted lists with mixed formatting are just arrays:

```js
slide.addText([
  { text: "TX", options: { bullet: true, bold: true } },
  { text: " volume up 4%, backlog cleared", options: { breakLine: true } },
  { text: "WY", options: { bullet: true, bold: true } },
  { text: " two new examiners onboarded", options: { breakLine: true } },
  { text: "Training scheduled for week 12", options: { bullet: true, indentLevel: 1, fontSize: 14 } },
], { x: 0.5, y: 1, w: 9, h: 2, fontSize: 16 });
```

### Line breaks inside a paragraph

`softBreakBefore: true` on a run inserts a line break without starting a new paragraph, the equivalent of Shift+Enter, so a bullet's text can wrap at a chosen point while keeping one bullet.

### Paragraph spacing

`paraSpaceBefore` and `paraSpaceAfter` (points) separate paragraphs; `lineSpacing` (points) or `lineSpacingMultiple` (a factor such as `1.15`) controls line height within them. For bullet lists a `paraSpaceAfter` of 4-8 points reads far better than blank lines, which also count as paragraphs and get bullets of their own.

### Building bullet arrays from data

```js
function bulletRuns(items) {
  return items.flatMap(({ label, text, level = 0 }) => [
    { text: label + " ", options: { bullet: true, bold: true, indentLevel: level } },
    { text, options: { breakLine: true } },
  ]);
}
slide.addText(bulletRuns([
  { label: "Volume:", text: "2,316 files opened" },
  { label: "TX:", text: "1,904 opened", level: 1 },
  { label: "Quality:", text: "exception rate 1.2%" },
]), { x: 0.5, y: 1, w: 9, h: 3, fontSize: 16, paraSpaceAfter: 6 });
```

> **Warning:** Text in a run is written verbatim; `<`, `&` and `>` are escaped for you, so never pre-escape them or your slide will show `&amp;`. Also avoid `\r`; use `\n` only.

### Try It Yourself

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Week 11 highlights", { x: 0.5, y: 0.3, w: 9, h: 0.6, fontSize: 22, bold: true, color: "1F618D" });

const kpis = [
  { label: "Files closed", value: "1,877", delta: "▲ 2.1%", good: true },
  { label: "Exceptions", value: "21", delta: "▼ 30%", good: true },
  { label: "Avg cycle time", value: "6.4 days", delta: "▲ 0.3", good: false },
];
slide.addText(kpis.flatMap(k => [
  { text: k.label + ": ", options: { bullet: { characterCode: "25BA" }, bold: true } },
  { text: k.value + " ", options: { color: "1F618D", bold: true } },
  { text: k.delta, options: { color: k.good ? "27AE60" : "C0392B", fontSize: 12, breakLine: true } },
]), { x: 0.5, y: 1.1, w: 5, h: 2, fontSize: 16, paraSpaceAfter: 8 });

slide.addText([
  { text: "Actions", options: { bold: true, breakLine: true } },
  { text: "Confirm TX staffing for week 12", options: { bullet: { type: "number" }, breakLine: true } },
  { text: "Review the three open exceptions", options: { bullet: { type: "number" }, breakLine: true } },
  { text: "Owner: QC lead", options: { bullet: true, indentLevel: 1, fontSize: 12, color: "7F8C8D" } },
], { x: 5.7, y: 1.1, w: 4, h: 2.5, fontSize: 14, valign: "top", fill: { color: "F4F6F7" }, margin: 10 });

pptx.writeFile({ fileName: "bullets.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. In a run array, what ends the current paragraph?
- [ ] A run whose text ends with a space
- [x] `breakLine: true` on a run, or a run with a `bullet` option starting the next paragraph
- [ ] `paragraph: true`
> Runs flow on one line until `breakLine`; bullet runs always begin a new paragraph.

2. How do you make a numbered list start at 5?
- [ ] `bullet: { start: 5 }`
- [x] `bullet: { type: "number", numberStartAt: 5 }`
- [ ] `numbering: 5`
> `numberStartAt` sets the first number; `numberType` chooses the numbering style.

3. What does `softBreakBefore: true` do?
- [x] Inserts a line break inside the same paragraph (like Shift+Enter)
- [ ] Starts a new bulleted paragraph
- [ ] Adds a blank line
> It keeps one bullet while forcing the wrap point.

### Exercises

1. **Two-level agenda** — Render an agenda with three numbered top-level items, each with one indented sub-bullet, from a nested array.
<details><summary>Solution</summary>

```js
const agenda = [["Volume", "By state and product"], ["Quality", "Exceptions and root causes"], ["Staffing", "Week 12 plan"]];
const pptx = new PptxGenJS();
pptx.addSlide().addText(agenda.flatMap(([h, sub]) => [
  { text: h, options: { bullet: { type: "number" }, bold: true, breakLine: true } },
  { text: sub, options: { bullet: true, indentLevel: 1, fontSize: 14, breakLine: true } },
]), { x: 0.5, y: 0.8, w: 9, h: 4, fontSize: 18, valign: "top", paraSpaceAfter: 4 });
pptx.writeFile({ fileName: "agenda.pptx" });
```

</details>

2. **Inline emphasis** — Turn the string `Closed 1,877 files (target 1,800)` into runs where the number is bold blue and the parenthetical is grey and smaller.
<details><summary>Solution</summary>

```js
const runs = [
  { text: "Closed " },
  { text: "1,877", options: { bold: true, color: "1F618D" } },
  { text: " files " },
  { text: "(target 1,800)", options: { color: "7F8C8D", fontSize: 12 } },
];
const pptx = new PptxGenJS();
pptx.addSlide().addText(runs, { x: 0.5, y: 2, w: 9, h: 0.8, fontSize: 18 });
pptx.writeFile({ fileName: "emphasis.pptx" });
```

</details>

### Interview Questions

**Q: How do you render mixed formatting within one text box?**
With an array of runs, each `{ text, options }`, where the outer options are defaults and each run overrides colour, weight or size. `breakLine: true` ends a paragraph, runs with `bullet` start new paragraphs, and `softBreakBefore` gives a line break inside a paragraph. I build these arrays from data with small helper functions, so a KPI line with a coloured delta is one function call and the formatting logic lives in one place rather than in every slide.

**Q: What are common mistakes with bullets in PptxGenJS?**
Using blank lines to space bullets, which produces empty bulleted paragraphs; pre-escaping `&` and getting `&amp;` on the slide; forgetting `breakLine` so two bullet items run together; and setting `bullet: true` on the outer options *and* on runs, which is harmless but confusing. Also, nested levels come from `indentLevel`, not from leading spaces. The fix for all of them is a helper that builds the run array deterministically.

**Q: How do you choose between one text box with paragraphs and several text boxes?**
One box with paragraphs when the content is a flowing list that should reflow together and share spacing, such as an agenda or highlights. Separate boxes when items must sit at fixed positions, like labels next to KPI tiles, or when each needs its own fill or border. Fewer boxes mean simpler editing for the client; fixed boxes mean precise layout. Most content slides end up as a title placeholder, one body box of runs, and a chart or table.

## Notes, hyperlinks and slide numbers

The finishing touches make a generated deck usable by people: speaker notes that explain where the numbers came from, hyperlinks that jump to the source report or to another slide, slide numbers for meetings, and hidden or backgrounded slides for appendices.

### Speaker notes

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Exception summary", { x: 0.5, y: 0.5, w: 9, h: 0.7, fontSize: 24, bold: true });
slide.addNotes("Source: production_2026-W11.csv, generated 2026-03-14 07:02.\nExceptions exclude files reopened within 24h.");
```

Notes appear in the Notes pane and in Presenter View. For automated decks they are the best place to record provenance: the input file, the generation time, the filters applied and the version of the generator. When leadership asks why a figure differs from the dashboard, the answer is already attached.

### External hyperlinks

Text runs, images and shapes accept a `hyperlink` option. External links need a full URL with scheme.

```js
slide.addText("Open the full report", { x: 0.5, y: 4.5, w: 4, h: 0.4, fontSize: 12,
  hyperlink: { url: "https://reports.example.com/2026/W11", tooltip: "Weekly report" } });
slide.addImage({ data: logoData, x: 8.5, y: 0.2, w: 1.2, h: 0.4, hyperlink: { url: "https://stewart.com" } });
```

PowerPoint renders hyperlinked text in the theme's hyperlink colour with an underline, regardless of the `color` you set; for a link that should look like body text, put it on a shape or image instead. Inside a run array, `hyperlink` on a single run links just that word.

### Internal links between slides

`hyperlink: { slide: n }` jumps to slide `n` (1-based, in the final order). That is how you build a clickable agenda or "back to summary" buttons:

```js
const agenda = pptx.addSlide();
["Volume", "Quality", "Staffing"].forEach((t, i) => {
  agenda.addText(t, { x: 0.5, y: 1 + i * 0.6, w: 4, h: 0.5, fontSize: 18, hyperlink: { slide: i + 2, tooltip: "Go to " + t } });
});
```

Because the index depends on final order, compute it from the array of slides you build rather than hard-coding.

### Slide numbers

Per slide:

```js
slide.slideNumber = { x: "92%", y: "92%", w: 0.6, h: 0.3, fontSize: 9, color: "7F8C8D" };
```

Or once on the master through its `slideNumber` property, which is the usual choice. Slide numbers are real PowerPoint fields, so they update if the client reorders slides.

### Hidden slides, backgrounds and default text colour

```js
const appendix = pptx.addSlide();
appendix.hidden = true;                                   // skipped in slideshow, kept in the file
appendix.background = { color: "F4F6F7" };                 // solid colour
appendix.color = "2C3E50";                                 // default text colour for this slide
```

Backgrounds also accept `{ path }` or `{ data }` for images, covered in the Advanced level.

### Presentation-wide settings

| Property | Purpose |
|---|---|
| `pptx.title`, `pptx.subject`, `pptx.author`, `pptx.company` | document properties |
| `pptx.lang = "en-US"` | spell-check language for text |
| `pptx.rtlMode = true` | right-to-left text direction for Urdu or Arabic decks |
| `pptx.theme = { headFontFace, bodyFontFace }` | theme fonts, covered under branding |

> **Tip:** Put the generator's version and the data snapshot in the notes of the *first* slide as well as in `pptx.subject`. Notes are visible to presenters; document properties are visible in File → Info and in SharePoint metadata; together they answer "which run produced this?" from either place.

### Try It Yourself

```js
const pptx = new PptxGenJS();
pptx.title = "Weekly Production Status W11";
pptx.subject = "generator v1.4 | data: production_2026-W11.csv";
pptx.lang = "en-US";

const sections = ["Volume", "Quality", "Staffing"];
const agenda = pptx.addSlide();
agenda.addText("Agenda", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 24, bold: true, color: "1F618D" });
agenda.addNotes("Generated 2026-03-14 07:02 from production_2026-W11.csv by report-deck v1.4.");
agenda.slideNumber = { x: "92%", y: "92%", w: 0.6, h: 0.3, fontSize: 9, color: "7F8C8D" };

sections.forEach((title, i) => {
  agenda.addText(`${i + 1}. ${title}`, { x: 0.7, y: 1.2 + i * 0.6, w: 5, h: 0.5, fontSize: 18, hyperlink: { slide: i + 2, tooltip: "Jump to " + title } });
  const s = pptx.addSlide();
  s.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 24, bold: true, color: "1F618D" });
  s.addText("Back to agenda", { x: 7.5, y: 5.1, w: 2, h: 0.35, fontSize: 10, align: "right", hyperlink: { slide: 1 } });
  s.addNotes(`Section ${i + 1} of ${sections.length}: ${title}. Source figures in the appendix.`);
  s.slideNumber = { x: "92%", y: "92%", w: 0.6, h: 0.3, fontSize: 9, color: "7F8C8D" };
});

const appendix = pptx.addSlide();
appendix.hidden = true;
appendix.background = { color: "F4F6F7" };
appendix.addText("Appendix: raw figures (hidden in slideshow)", { x: 0.5, y: 2.5, w: 9, h: 0.6, fontSize: 16, color: "7F8C8D" });
appendix.addText("Full report", { x: 0.5, y: 3.2, w: 3, h: 0.4, fontSize: 12, hyperlink: { url: "https://example.com/reports/W11", tooltip: "Open report" } });

pptx.writeFile({ fileName: "notes-links.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. How do you link to the third slide of the deck?
- [ ] `hyperlink: { url: "#3" }`
- [x] `hyperlink: { slide: 3 }`
- [ ] `link: 3`
> Internal links use `slide` with a 1-based number in final order.

2. Where do speaker notes appear?
- [x] In the Notes pane and Presenter View, not on the slide
- [ ] At the bottom of the slide
- [ ] In the file properties
> Notes are ideal for provenance information the presenter can see but the audience cannot.

3. What does `slide.hidden = true` do?
- [ ] Deletes the slide
- [x] Keeps the slide in the file but skips it during the slideshow
- [ ] Makes the slide read-only
> Hidden slides are useful for appendices and backup data.

### Exercises

1. **Provenance notes** — Write `addProvenance(slide, meta)` that adds a note listing every key of `meta` as `key: value` lines.
<details><summary>Solution</summary>

```js
function addProvenance(slide, meta) {
  slide.addNotes(Object.entries(meta).map(([k, v]) => `${k}: ${v}`).join("\n"));
}
addProvenance(slide, { source: "production_2026-W11.csv", generated: new Date().toISOString(), generator: "report-deck v1.4" });
```

</details>

2. **Linked table of contents** — Given an array of slide titles, create a TOC slide first and content slides after it, with each TOC entry linking to its slide.
<details><summary>Solution</summary>

```js
const titles = ["Volume", "Quality", "Staffing", "Risks"];
const pptx = new PptxGenJS();
const toc = pptx.addSlide();
titles.forEach((t, i) => {
  toc.addText(t, { x: 0.5, y: 0.8 + i * 0.5, w: 6, h: 0.4, fontSize: 16, hyperlink: { slide: i + 2 } });
  pptx.addSlide().addText(t, { x: 0.5, y: 0.5, w: 9, h: 0.7, fontSize: 24, bold: true });
});
pptx.writeFile({ fileName: "toc.pptx" });
```

</details>

### Interview Questions

**Q: How do you make an automated deck auditable?**
Attach provenance in three places: speaker notes on the title slide and on every data slide (input file, snapshot time, filters, generator version), `pptx.subject` or `pptx.title` so the metadata is visible in File → Info and SharePoint, and a hidden appendix slide with the raw figures the charts were drawn from. Add hyperlinks from each chart slide to the source report. When someone questions a number six weeks later, the deck itself says which data produced it.

**Q: Why can't you recolour hyperlinked text with the `color` option?**
PowerPoint draws hyperlinked runs in the theme's `hlink` colour with an underline as part of its rendering rules for `<a:hlinkClick>`, overriding run colour. Changing the theme's hyperlink colour is possible but affects every link. When a link must look like ordinary text, I attach the hyperlink to a transparent shape placed over the text, or to an image or button shape, which keeps the visual design intact.

**Q: What should be on the master versus on individual slides for slide numbers and footers?**
Slide numbers and confidentiality footers belong on the master so they are identical on every slide, locked from accidental edits, and update automatically when slides are reordered. Per-slide `slideNumber` is for the rare deck without a master, or for one-off slides that use a different position. Anything data-specific, such as a "continued" label, stays on the slide.


# LEVEL: Advanced

## Branding a master (logo, footer, theme colours/fonts)

A branded deck is one where every slide shares the same fonts, colours, logo position and footer without anyone copying and pasting. In PptxGenJS that means a **slide master** defined once in code plus a small **brand object** that holds the palette. The Intermediate level introduced `defineSlideMaster`; this chapter turns it into a reusable brand kit that every automated report deck imports.

### One source of truth for colours and fonts

PptxGenJS does not expose PowerPoint's theme colour scheme (Accent 1 to 6) as an API, so the palette lives in your own constant and every call reads from it. Keep hex values without the `#`, because that is what every `color` and `fill` option expects.

```js
const BRAND = {
  navy: "1F3A5F", teal: "1ABC9C", amber: "F39C12", red: "C0392B",
  grey: "7F8C8D", light: "F4F6F7", ink: "2C3E50", white: "FFFFFF",
  headFont: "Calibri Light", bodyFont: "Calibri",
};
```

Theme *fonts* can be set on the presentation (added in v3.10):

```js
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";                       // 10 x 5.625 in
pptx.theme = { headFontFace: BRAND.headFont, bodyFontFace: BRAND.bodyFont };
```

`pptx.theme` writes the major and minor fonts into `theme1.xml`, so any text you add without a `fontFace` inherits the brand font, and anything the client types later uses it too. Pass `fontFace` explicitly only for deliberate exceptions such as a monospaced file name.

### A content master with header bar, logo and footer

```js
pptx.defineSlideMaster({
  title: "BRAND_CONTENT",
  background: { color: BRAND.white },
  margin: [0.5, 0.5, 0.6, 0.5],
  objects: [
    { rect:  { x: 0, y: 0, w: "100%", h: 0.3, fill: { color: BRAND.navy } } },
    { image: { x: 8.7, y: 0.45, w: 0.9, h: 0.4, data: LOGO_PNG } },
    { line:  { x: 0.5, y: 5.05, w: 9.0, h: 0, line: { color: BRAND.grey, width: 0.75 } } },
    { text:  { text: "Stewart Title Production Support  |  Confidential",
               options: { x: 0.5, y: 5.1, w: 7, h: 0.3, fontSize: 9, color: BRAND.grey } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.45, w: 8, h: 0.8,
                                fontSize: 26, bold: true, color: BRAND.navy }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.5, y: 1.4, w: 9, h: 3.5,
                                fontSize: 14, color: BRAND.ink }, text: "" } },
  ],
  slideNumber: { x: 9.0, y: 5.1, w: 0.5, h: 0.3, fontSize: 9, color: BRAND.grey, align: "right" },
});
```

Objects are drawn in array order, so the header bar goes first and the logo on top of it. `LOGO_PNG` is a base64 string (`image/png;base64,...`); in Node you can use `path: "assets/logo.png"` instead. The footer text and the line are static layout objects: the presenter sees them on every slide but cannot select or move them by accident, which is exactly what you want for a confidentiality notice. The two placeholders give each slide a consistent title and body position.

### A title master

Title slides usually invert the colours. Define a second master rather than restyling the first one on every deck:

```js
pptx.defineSlideMaster({
  title: "BRAND_TITLE",
  background: { color: BRAND.navy },
  objects: [
    { rect: { x: 0, y: 4.6, w: "100%", h: 1.025, fill: { color: BRAND.teal } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.6, w: 8.8, h: 1.2,
                                fontSize: 36, bold: true, color: BRAND.white }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.6, y: 2.9, w: 8.8, h: 0.6,
                                fontSize: 16, color: BRAND.light }, text: "" } },
  ],
});
```

### Using the masters

```js
const cover = pptx.addSlide({ masterName: "BRAND_TITLE" });
cover.addText("Weekly Production Status", { placeholder: "title" });
cover.addText("Week 11  |  9 to 13 March 2026", { placeholder: "sub" });

const s = pptx.addSlide({ masterName: "BRAND_CONTENT" });
s.addText("Volume by state", { placeholder: "title" });
s.addText([{ text: "TX 412 files", options: { bullet: true } },
           { text: "FL 388 files", options: { bullet: true } }], { placeholder: "body" });
```

`addSlide({ masterName })` is the v3 form; v2 code passed the name as a plain string, which still works but is not documented. A slide that names no master gets PowerPoint's blank layout, which is how a branded deck ends up with one unbranded slide, so wrap `addSlide` in a helper that always passes the master.

### Packaging the brand as a module

| Item | Lives in | Why |
|---|---|---|
| Palette, font names | `brand.js` constant | one edit changes every deck |
| Masters (header, logo, footer, placeholders) | `applyBrand(pptx)` in `brand.js` | defined once per presentation |
| Slide numbers, confidentiality footer | master `slideNumber` and static objects | identical and locked on every slide |
| Titles, charts, tables, data text | the slide | changes per slide |

```js
// brand.js (Node)  -> module.exports = { BRAND, applyBrand };
function applyBrand(pptx) {
  pptx.layout = "LAYOUT_16x9";
  pptx.theme = { headFontFace: BRAND.headFont, bodyFontFace: BRAND.bodyFont };
  pptx.defineSlideMaster({ /* BRAND_TITLE as above */ });
  pptx.defineSlideMaster({ /* BRAND_CONTENT as above */ });
  return BRAND;
}
```

> **Tip:** Master titles appear in PowerPoint under Home → Layout, so name them for humans (`BRAND_TITLE`, `BRAND_CONTENT`, `BRAND_SECTION`) rather than `M1`, `M2`. The client will pick them when they add slides by hand.

### Try It Yourself

```js
const BRAND = { navy: "1F3A5F", teal: "1ABC9C", grey: "7F8C8D", light: "F4F6F7", ink: "2C3E50", white: "FFFFFF" };

// Draw a small logo in the browser so the master has a real image
const c = document.createElement("canvas"); c.width = 180; c.height = 80;
const g = c.getContext("2d");
g.fillStyle = "#1ABC9C"; g.fillRect(0, 0, 180, 80);
g.fillStyle = "#FFFFFF"; g.font = "bold 44px sans-serif"; g.fillText("ST", 52, 58);
const LOGO_PNG = c.toDataURL("image/png");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";
pptx.theme = { headFontFace: "Calibri Light", bodyFontFace: "Calibri" };

pptx.defineSlideMaster({
  title: "BRAND_TITLE",
  background: { color: BRAND.navy },
  objects: [
    { rect: { x: 0, y: 4.6, w: "100%", h: 1.025, fill: { color: BRAND.teal } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.6, w: 8.8, h: 1.2, fontSize: 36, bold: true, color: BRAND.white }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.6, y: 2.9, w: 8.8, h: 0.6, fontSize: 16, color: BRAND.light }, text: "" } },
  ],
});
pptx.defineSlideMaster({
  title: "BRAND_CONTENT",
  background: { color: BRAND.white },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.3, fill: { color: BRAND.navy } } },
    { image: { x: 8.7, y: 0.45, w: 0.9, h: 0.4, data: LOGO_PNG } },
    { line: { x: 0.5, y: 5.05, w: 9.0, h: 0, line: { color: BRAND.grey, width: 0.75 } } },
    { text: { text: "Stewart Title Production Support  |  Confidential", options: { x: 0.5, y: 5.1, w: 7, h: 0.3, fontSize: 9, color: BRAND.grey } } },
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.45, w: 8, h: 0.8, fontSize: 26, bold: true, color: BRAND.navy }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.5, y: 1.4, w: 9, h: 3.5, fontSize: 14, color: BRAND.ink }, text: "" } },
  ],
  slideNumber: { x: 9.0, y: 5.1, w: 0.5, h: 0.3, fontSize: 9, color: BRAND.grey, align: "right" },
});

const cover = pptx.addSlide({ masterName: "BRAND_TITLE" });
cover.addText("Weekly Production Status", { placeholder: "title" });
cover.addText("Week 11  |  9 to 13 March 2026", { placeholder: "sub" });

["Volume by state", "Quality", "Staffing"].forEach(t => {
  const s = pptx.addSlide({ masterName: "BRAND_CONTENT" });
  s.addText(t, { placeholder: "title" });
  s.addText([{ text: "Point one", options: { bullet: true } }, { text: "Point two", options: { bullet: true } }], { placeholder: "body" });
});

pptx.writeFile({ fileName: "branded.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. Where should a confidentiality footer that must appear on every slide be defined?
- [ ] On each slide with `addText`
- [x] As a static object in `defineSlideMaster`
- [ ] In `pptx.subject`
> Master objects are drawn on every slide that uses the layout and cannot be moved by the presenter.

2. What does `pptx.theme = { headFontFace, bodyFontFace }` change?
- [x] The theme's major and minor fonts, inherited by text without an explicit `fontFace`
- [ ] The colours of Accent 1 to 6
- [ ] Only the title placeholder
> PptxGenJS sets theme fonts but has no API for the theme colour scheme, hence the `BRAND` constant.

3. What happens if `addSlide()` is called without `masterName` in a branded deck?
- [ ] An error is thrown
- [ ] The last master is reused
- [x] The slide uses PowerPoint's blank layout with no branding
> Wrap `addSlide` in a helper that always passes the brand master.

### Exercises

1. **Section master** — Define a `BRAND_SECTION` master: navy left third, white right two-thirds, a `title` placeholder on the white side and a small section number placeholder named `num`.
<details><summary>Solution</summary>

```js
pptx.defineSlideMaster({
  title: "BRAND_SECTION",
  background: { color: "FFFFFF" },
  objects: [
    { rect: { x: 0, y: 0, w: 3.33, h: "100%", fill: { color: "1F3A5F" } } },
    { placeholder: { options: { name: "num", type: "body", x: 0.4, y: 2.2, w: 2.5, h: 1.2, fontSize: 60, bold: true, color: "1ABC9C" }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: 3.8, y: 2.3, w: 5.7, h: 1.0, fontSize: 30, bold: true, color: "1F3A5F" }, text: "" } },
  ],
});
const sec = pptx.addSlide({ masterName: "BRAND_SECTION" });
sec.addText("02", { placeholder: "num" });
sec.addText("Quality", { placeholder: "title" });
```

</details>

2. **Safe addSlide helper** — Write `newSlide(pptx, kind)` that maps `"title" | "content" | "section"` to the master names and throws on anything else.
<details><summary>Solution</summary>

```js
const MASTERS = { title: "BRAND_TITLE", content: "BRAND_CONTENT", section: "BRAND_SECTION" };
function newSlide(pptx, kind = "content") {
  const masterName = MASTERS[kind];
  if (!masterName) throw new Error("Unknown slide kind: " + kind);
  return pptx.addSlide({ masterName });
}
```

</details>

### Interview Questions

**Q: How do you keep a generated deck on-brand when the client has a corporate template?**
I open the client's `.potx`, read the theme fonts, the six accent colours, the logo position and the footer text, and encode them in a `brand.js` module: a palette constant, `pptx.theme` for fonts, and one `defineSlideMaster` per layout they actually use, with static objects for the header bar, logo and footer and named placeholders for title and body. The generator only ever calls `addSlide({ masterName })` through a helper. The trade-off is that PptxGenJS cannot import their template file directly, so the master is a faithful re-creation rather than the original; if pixel-perfect fidelity to an existing template is a hard requirement, python-pptx filling that template is the better tool.

**Q: Why do you put palette values in a constant rather than in the master?**
The master only covers layout-level objects. Charts, tables, KPI tiles and RAG status colours are per-slide and need the same colours, so a shared `BRAND` object is the only way every call agrees. It also makes rebranding a one-line change and lets tests assert that no hard-coded hex appears outside `brand.js`. In one Fiverr project the client changed from teal to orange two days before delivery; the change took one edit and a regeneration.

**Q: What can and cannot be edited later by the presenter on a master-based slide?**
Everything added with `slide.addText`, `addChart`, `addTable` or `addImage` is a normal shape the presenter can edit. Objects declared in the master's `objects` array live on the slide layout, so they are visible but not selectable on the slide; the presenter must go to View → Slide Master to change them. That is the right place for logos, footers and confidentiality notices, and the wrong place for anything the client expects to tweak, such as a chart title.

## Data-driven decks (loop JSON → slides)

The point of PptxGenJS is that the deck is a *function of the data*. Feed it this week's JSON and it produces this week's deck; feed it last year's and it produces last year's. This chapter builds that pipeline: data in, a view model in the middle, slides out, with helpers for chunking, formatting and status colours.

### The data

A weekly title-production extract, one object per state:

```js
const weekly = [
  { state: "TX", files: 412, errors: 9,  tatDays: 1.8, agents: 6 },
  { state: "FL", files: 388, errors: 14, tatDays: 2.1, agents: 5 },
  { state: "CA", files: 301, errors: 4,  tatDays: 1.6, agents: 4 },
  { state: "AZ", files: 176, errors: 6,  tatDays: 2.4, agents: 3 },
  { state: "WY", files: 58,  errors: 0,  tatDays: 1.2, agents: 1 },
];
```

### Step 1: derive, do not compute on the slide

Compute every figure once, in plain JavaScript, before any slide exists. Slides should only *display* values.

```js
const fmt = new Intl.NumberFormat("en-US");
const pct = n => (n * 100).toFixed(1) + "%";
const rows = weekly
  .map(r => ({ ...r, errRate: r.errors / r.files, perAgent: r.files / r.agents }))
  .sort((a, b) => b.files - a.files);
const totals = rows.reduce((t, r) => ({ files: t.files + r.files, errors: t.errors + r.errors }), { files: 0, errors: 0 });
```

Sorting here makes the deck deterministic: the same data always produces the same slide order, which matters when two runs are compared.

### Step 2: status colours from thresholds

```js
const BRAND = { green: "27AE60", amber: "F39C12", red: "C0392B", navy: "1F3A5F", grey: "7F8C8D" };
const rag = errRate => errRate < 0.02 ? BRAND.green : errRate < 0.04 ? BRAND.amber : BRAND.red;
```

Thresholds belong in one function so the table cell, the KPI tile and the chart colour all agree. Put them in config if the client changes them.

### Step 3: reusable slide builders

A KPI tile is a rectangle plus two text boxes. Write it once:

```js
function kpiTile(slide, x, y, label, value, color) {
  slide.addShape("rect", { x, y, w: 2.1, h: 1.1, fill: { color: "F4F6F7" }, line: { color: "D5DBDB", width: 0.5 } });
  slide.addText(value, { x, y: y + 0.1, w: 2.1, h: 0.6, fontSize: 24, bold: true, color, align: "center" });
  slide.addText(label, { x, y: y + 0.7, w: 2.1, h: 0.3, fontSize: 10, color: BRAND.grey, align: "center" });
}
```

The summary slide then reads like a sentence:

```js
const summary = pptx.addSlide({ masterName: "BRAND_CONTENT" });
summary.addText("Week 11 summary", { placeholder: "title" });
kpiTile(summary, 0.5, 1.5, "Files closed", fmt.format(totals.files), BRAND.navy);
kpiTile(summary, 2.8, 1.5, "Errors", fmt.format(totals.errors), rag(totals.errors / totals.files));
kpiTile(summary, 5.1, 1.5, "Error rate", pct(totals.errors / totals.files), rag(totals.errors / totals.files));
kpiTile(summary, 7.4, 1.5, "States", String(rows.length), BRAND.navy);
```

### Step 4: one slide per record

```js
for (const r of rows) {
  const s = pptx.addSlide({ masterName: "BRAND_CONTENT" });
  s.addText(`${r.state}: ${fmt.format(r.files)} files`, { placeholder: "title" });
  s.addText([
    { text: `Error rate ${pct(r.errRate)}`, options: { bullet: true, color: rag(r.errRate) } },
    { text: `Turnaround ${r.tatDays} days`, options: { bullet: true } },
    { text: `${r.perAgent.toFixed(0)} files per agent`, options: { bullet: true } },
  ], { placeholder: "body" });
  s.addNotes(`Source row: ${JSON.stringify(r)}`);
}
```

Five states make five slides; fifty states make fifty. The code does not change.

### Step 5: chunking long lists across slides

A table of 60 rows will not fit on one slide. `autoPage` handles tables, but for bullet lists, image grids or anything custom you chunk the array yourself:

```js
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

chunk(rows, 8).forEach((page, i, pages) => {
  const s = pptx.addSlide({ masterName: "BRAND_CONTENT" });
  s.addText(`State detail${pages.length > 1 ? ` (${i + 1} of ${pages.length})` : ""}`, { placeholder: "title" });
  s.addTable([["State", "Files", "Errors", "Rate"].map(h => ({ text: h, options: { bold: true, fill: { color: "1F3A5F" }, color: "FFFFFF" } }))]
    .concat(page.map(r => [r.state, fmt.format(r.files), String(r.errors), { text: pct(r.errRate), options: { color: rag(r.errRate) } }])),
    { x: 0.5, y: 1.4, w: 9, colW: [2, 2.5, 2, 2.5], fontSize: 12, border: { type: "solid", color: "D5DBDB", pt: 0.5 } });
});
```

### Guarding the input

| Check | Why |
|---|---|
| Array is non-empty | an empty loop produces a deck with only a cover, which looks like a bug |
| Numbers are numbers (`Number.isFinite`) | strings from CSV make charts fail and `toFixed` throw |
| Required keys present | a missing `agents` gives `Infinity` files per agent |
| Sort key defined | ordering must be deterministic for diffs |

```js
function validate(rows) {
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("No data rows");
  for (const r of rows) for (const k of ["files", "errors", "tatDays", "agents"])
    if (!Number.isFinite(r[k])) throw new Error(`${r.state}: ${k} is not a number`);
}
```

> **Warning:** Table cell values must be strings or `{ text }` objects. Passing a raw number works in most versions but `undefined` or `null` writes an empty `<a:t>` that PowerPoint may flag for repair. Always format through `fmt.format` or `String()`.

### Try It Yourself

```js
const weekly = [
  { state: "TX", files: 412, errors: 9,  tatDays: 1.8, agents: 6 },
  { state: "FL", files: 388, errors: 14, tatDays: 2.1, agents: 5 },
  { state: "CA", files: 301, errors: 4,  tatDays: 1.6, agents: 4 },
  { state: "AZ", files: 176, errors: 6,  tatDays: 2.4, agents: 3 },
  { state: "WY", files: 58,  errors: 0,  tatDays: 1.2, agents: 1 },
];
const BRAND = { green: "27AE60", amber: "F39C12", red: "C0392B", navy: "1F3A5F", grey: "7F8C8D" };
const fmt = new Intl.NumberFormat("en-US");
const pct = n => (n * 100).toFixed(1) + "%";
const rag = e => e < 0.02 ? BRAND.green : e < 0.04 ? BRAND.amber : BRAND.red;
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

const rows = weekly.map(r => ({ ...r, errRate: r.errors / r.files })).sort((a, b) => b.files - a.files);
const totals = rows.reduce((t, r) => ({ files: t.files + r.files, errors: t.errors + r.errors }), { files: 0, errors: 0 });

function kpiTile(slide, x, y, label, value, color) {
  slide.addShape("rect", { x, y, w: 2.1, h: 1.1, fill: { color: "F4F6F7" }, line: { color: "D5DBDB", width: 0.5 } });
  slide.addText(value, { x, y: y + 0.1, w: 2.1, h: 0.6, fontSize: 24, bold: true, color, align: "center" });
  slide.addText(label, { x, y: y + 0.7, w: 2.1, h: 0.3, fontSize: 10, color: BRAND.grey, align: "center" });
}

const pptx = new PptxGenJS();
const summary = pptx.addSlide();
summary.addText("Week 11 summary", { x: 0.5, y: 0.4, w: 9, h: 0.7, fontSize: 24, bold: true, color: BRAND.navy });
kpiTile(summary, 0.5, 1.5, "Files closed", fmt.format(totals.files), BRAND.navy);
kpiTile(summary, 2.8, 1.5, "Errors", fmt.format(totals.errors), rag(totals.errors / totals.files));
kpiTile(summary, 5.1, 1.5, "Error rate", pct(totals.errors / totals.files), rag(totals.errors / totals.files));
kpiTile(summary, 7.4, 1.5, "States", String(rows.length), BRAND.navy);

chunk(rows, 3).forEach((page, i, pages) => {
  const s = pptx.addSlide();
  s.addText(`State detail (${i + 1} of ${pages.length})`, { x: 0.5, y: 0.4, w: 9, h: 0.7, fontSize: 24, bold: true, color: BRAND.navy });
  const header = ["State", "Files", "Errors", "Rate"].map(h => ({ text: h, options: { bold: true, fill: { color: BRAND.navy }, color: "FFFFFF" } }));
  const body = page.map(r => [r.state, fmt.format(r.files), String(r.errors), { text: pct(r.errRate), options: { color: rag(r.errRate), bold: true } }]);
  s.addTable([header, ...body], { x: 0.5, y: 1.4, w: 9, colW: [2, 2.5, 2, 2.5], fontSize: 12, border: { type: "solid", color: "D5DBDB", pt: 0.5 } });
});

console.log("slides:", 1 + Math.ceil(rows.length / 3));
pptx.writeFile({ fileName: "data-driven.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. Where should the error rate be calculated?
- [x] Once, in a mapping step before any slide is created
- [ ] Inside `addText` for each slide
- [ ] In PowerPoint after the deck is generated
> Slides display values; deriving them up front keeps every slide consistent and testable.

2. Why sort the rows before generating slides?
- [ ] PptxGenJS requires sorted input
- [x] So the same data always yields the same slide order
- [ ] To make the file smaller
> Deterministic output lets you diff two runs and catches silent changes.

3. What does `chunk(rows, 8)` return for 20 rows?
- [ ] 8 arrays of up to 20 rows
- [x] 3 arrays: 8, 8 and 4 rows
- [ ] A single array of 20 rows
> `Math.ceil(20 / 8)` is 3 pages, the last one partial.

### Exercises

1. **Top N with "others"** — Given `rows`, build a pie-chart data series of the top 4 states by files with the rest merged into "Other".
<details><summary>Solution</summary>

```js
const top = rows.slice(0, 4);
const other = rows.slice(4).reduce((s, r) => s + r.files, 0);
const labels = top.map(r => r.state).concat(other ? ["Other"] : []);
const values = top.map(r => r.files).concat(other ? [other] : []);
slide.addChart(pptx.ChartType.pie, [{ name: "Files", labels, values }], { x: 0.5, y: 1.3, w: 4.5, h: 3.5, showPercent: true });
```

</details>

2. **Exceptions slide only when needed** — Add an "Exceptions" slide listing states with `errRate >= 0.04`, but skip the slide entirely if there are none.
<details><summary>Solution</summary>

```js
const bad = rows.filter(r => r.errRate >= 0.04);
if (bad.length) {
  const s = pptx.addSlide();
  s.addText("Exceptions", { x: 0.5, y: 0.4, w: 9, h: 0.7, fontSize: 24, bold: true, color: "C0392B" });
  s.addText(bad.map(r => ({ text: `${r.state}: ${pct(r.errRate)} (${r.errors} of ${r.files})`, options: { bullet: true } })), { x: 0.5, y: 1.4, w: 9, h: 3, fontSize: 14 });
}
```

</details>

3. **Validate before build** — Extend `validate` to reject duplicate state codes.
<details><summary>Solution</summary>

```js
function validate(rows) {
  if (!Array.isArray(rows) || rows.length === 0) throw new Error("No data rows");
  const seen = new Set();
  for (const r of rows) {
    if (seen.has(r.state)) throw new Error("Duplicate state: " + r.state);
    seen.add(r.state);
    for (const k of ["files", "errors", "tatDays", "agents"]) if (!Number.isFinite(r[k])) throw new Error(`${r.state}: ${k} is not a number`);
  }
}
```

</details>

### Interview Questions

**Q: Describe the architecture of a data-driven deck generator.**
Three layers. A loader reads the source (CSV, JSON from an API, a database query) and validates it: non-empty, numeric fields finite, required keys present, no duplicates. A view-model step derives everything the deck shows, such as totals, rates, rankings and RAG status, and sorts deterministically. A renderer maps the view model to slides through small builders like `kpiTile`, `stateSlide` and `pagedTable`, each of which only formats and positions. Keeping derivation out of the renderer means the numbers can be unit-tested without generating a file, and the renderer can be swapped for a DOCX or PDF generator that reuses the same view model.

**Q: How do you handle a list that does not fit on one slide?**
For tables I use `autoPage` with `autoPageRepeatHeader`, which PptxGenJS handles natively. For anything else I chunk the array into page-sized slices, generate one slide per slice and label them "(2 of 3)". The page size is a constant chosen from the font size and available height, for example 8 rows at 12pt in 3.5 inches. I never let content overflow the slide, because PowerPoint does not clip and the overflow prints off the page.

**Q: What input problems have you seen break generated decks?**
Numbers arriving as strings from CSV, which makes chart values non-numeric and `toFixed` throw; `null` in a cell that becomes an empty text node; a missing divisor that produces `Infinity` in a KPI; and an unexpectedly empty extract that produced a cover slide and nothing else, which went to a manager. Each became a rule in a `validate()` function that fails loudly before rendering, so the scheduled job errors instead of emailing a wrong deck.

## Charts deep-dive (combo charts, axis options, colours)

The Intermediate level drew bar, line and pie charts with default styling. Production decks need more: a bar and a line on the same chart with two value axes, controlled number formats, brand colours per series, data labels, and gridlines that do not fight the data. PptxGenJS exposes most of PowerPoint's chart XML through options on `addChart`.

### Combo charts: pass an array of chart types

Volume (files, in the hundreds) and error rate (a percentage under 3) cannot share an axis. A combo chart puts bars on the primary axis and a line on a secondary axis:

```js
const weeks = ["W08", "W09", "W10", "W11"];
const files   = { name: "Files closed", labels: weeks, values: [1520, 1610, 1480, 1705] };
const errRate = { name: "Error rate %", labels: weeks, values: [1.2, 0.9, 1.4, 0.8] };

slide.addChart(
  [
    { type: pptx.ChartType.bar,  data: [files],   options: { chartColors: ["1F3A5F"], barGapWidthPct: 60 } },
    { type: pptx.ChartType.line, data: [errRate], options: { chartColors: ["C0392B"], lineSize: 2, lineDataSymbol: "circle",
                                                             lineDataSymbolSize: 8, secondaryValAxis: true, secondaryCatAxis: true } },
  ],
  {
    x: 0.5, y: 1.3, w: 9, h: 3.6,
    valAxes: [
      { showValAxisTitle: true, valAxisTitle: "Files", valAxisLabelFormatCode: "#,##0", valAxisMinVal: 0 },
      { showValAxisTitle: true, valAxisTitle: "Error %", valAxisLabelFormatCode: "0.0", valAxisMinVal: 0, valAxisMaxVal: 3, valGridLine: { style: "none" } },
    ],
    catAxes: [{ showCatAxisTitle: true, catAxisTitle: "Week" }, { catAxisHidden: true }],
    showLegend: true, legendPos: "b", legendFontSize: 10,
  }
);
```

The first argument is an array of `{ type, data, options }` instead of a single type. Series-level options (colours, line style, which axis) go inside each entry; chart-level options (position, axes, legend, title) go in the second argument. `valAxes` and `catAxes` are arrays with one entry per axis; the second category axis is hidden so the week labels are not drawn twice. Both series must share the same `labels` array or the line will be misaligned with the bars.

### Axis options you will actually use

| Option | Effect |
|---|---|
| `valAxisMinVal`, `valAxisMaxVal`, `valAxisMajorUnit` | fix the scale so week-on-week charts are comparable |
| `valAxisLabelFormatCode: "#,##0"` / `"0.0%"` / `"$#,##0"` | Excel-style number format on axis labels |
| `valAxisDisplayUnit: "thousands"` | show 1,520 as 1.52 with a units label |
| `catAxisLabelRotate: -45` | angle long category names |
| `catAxisLabelFontSize`, `valAxisLabelFontSize`, `catAxisLabelColor` | axis typography |
| `valGridLine: { color: "D5DBDB", style: "dash", size: 0.5 }` or `{ style: "none" }` | horizontal gridlines |
| `catGridLine: { style: "none" }` | vertical gridlines |
| `valAxisOrientation: "maxMin"` | flip the axis (useful for rank charts) |
| `valAxisHidden`, `catAxisHidden` | remove an axis entirely |
| `catAxisLabelFrequency: 2` | show every second label on dense series |

Fixed scales matter in weekly decks: if the axis auto-scales, a bad week looks the same height as a good one and readers compare slide to slide by eye.

### Colours

`chartColors` is an array of hex strings. For bar, line, area and scatter charts it is applied **per series**; for pie and doughnut it is applied **per data point**. Add `chartColorsOpacity: 80` for lighter fills, `invertedColors: ["C0392B"]` to colour negative bars differently, and `dataBorder: { pt: 1, color: "FFFFFF" }` for a white separator between stacked segments.

```js
slide.addChart(pptx.ChartType.doughnut, [{ name: "Files", labels: ["TX", "FL", "CA", "Other"], values: [412, 388, 301, 234] }],
  { x: 5.2, y: 1.3, w: 4.3, h: 3.6, chartColors: ["1F3A5F", "1ABC9C", "F39C12", "BDC3C7"], holeSize: 60,
    showPercent: true, showLabel: false, dataLabelColor: "FFFFFF", dataLabelFontSize: 10, legendPos: "r", showLegend: true });
```

### Data labels, titles and stacking

```js
slide.addChart(pptx.ChartType.bar, series, {
  x: 0.5, y: 1.3, w: 4.5, h: 3.6,
  barDir: "col",                 // "bar" for horizontal
  barGrouping: "stacked",        // "clustered" | "stacked" | "percentStacked"
  showValue: true, dataLabelFormatCode: "#,##0", dataLabelPosition: "ctr", dataLabelFontSize: 9, dataLabelColor: "FFFFFF",
  showTitle: true, title: "Files by state and week", titleFontSize: 12, titleColor: "1F3A5F",
  plotArea: { fill: { color: "FFFFFF" } }, chartArea: { fill: { color: "F4F6F7" }, roundedCorners: false },
});
```

Data label positions: `outEnd`, `inEnd`, `ctr`, `inBase` for bars; `t`, `b`, `l`, `r`, `ctr` for lines; `bestFit`, `outEnd`, `inEnd`, `ctr` for pies. Not every position is valid for every type, and PowerPoint will ask to repair the file when it meets an invalid one, so keep to the lists.

### Missing values and scatter data

Line charts accept `null` for a missing week; `displayBlanksAs: "gap" | "span" | "zero"` controls how it is drawn. Scatter and bubble charts use a different data shape: the first series holds the X values and each following series the Y values.

```js
const scatter = [
  { name: "X-Axis", values: [1, 2, 3, 4, 5, 6] },                 // agents
  { name: "Files per day", values: [22, 41, 58, 79, 95, 110] },
];
slide.addChart(pptx.ChartType.scatter, scatter, { x: 0.5, y: 1.3, w: 4.5, h: 3.6, lineSize: 0, lineDataSymbol: "circle", lineDataSymbolSize: 9 });
```

> **Interview note:** Interviewers who know PowerPoint ask "how did you get two axes?" The answer is the combo array with `secondaryValAxis: true` and `secondaryCatAxis: true` on the second entry, plus a two-element `valAxes` array. Mentioning that the secondary category axis is hidden shows you have done it for real.

### Try It Yourself

```js
const pptx = new PptxGenJS();
const slide = pptx.addSlide();
slide.addText("Volume vs error rate, W08 to W11", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 22, bold: true, color: "1F3A5F" });

const weeks = ["W08", "W09", "W10", "W11"];
const files = { name: "Files closed", labels: weeks, values: [1520, 1610, 1480, 1705] };
const errRate = { name: "Error rate %", labels: weeks, values: [1.2, 0.9, 1.4, 0.8] };

slide.addChart(
  [
    { type: pptx.ChartType.bar, data: [files], options: { chartColors: ["1F3A5F"], barGapWidthPct: 60 } },
    { type: pptx.ChartType.line, data: [errRate], options: { chartColors: ["C0392B"], lineSize: 2, lineDataSymbol: "circle", lineDataSymbolSize: 8, secondaryValAxis: true, secondaryCatAxis: true } },
  ],
  {
    x: 0.5, y: 1.2, w: 5.4, h: 3.8,
    valAxes: [
      { showValAxisTitle: true, valAxisTitle: "Files", valAxisLabelFormatCode: "#,##0", valAxisMinVal: 0, valAxisMaxVal: 2000 },
      { showValAxisTitle: true, valAxisTitle: "Error %", valAxisLabelFormatCode: "0.0", valAxisMinVal: 0, valAxisMaxVal: 3, valGridLine: { style: "none" } },
    ],
    catAxes: [{ showCatAxisTitle: true, catAxisTitle: "Week" }, { catAxisHidden: true }],
    showLegend: true, legendPos: "b", legendFontSize: 10,
  }
);

slide.addChart(pptx.ChartType.doughnut, [{ name: "Files", labels: ["TX", "FL", "CA", "Other"], values: [412, 388, 301, 234] }],
  { x: 6.1, y: 1.2, w: 3.5, h: 3.8, chartColors: ["1F3A5F", "1ABC9C", "F39C12", "BDC3C7"], holeSize: 60,
    showPercent: true, showLabel: false, dataLabelColor: "FFFFFF", dataLabelFontSize: 10, showLegend: true, legendPos: "b", legendFontSize: 9,
    showTitle: true, title: "Share of files, W11", titleFontSize: 11 });

pptx.writeFile({ fileName: "combo-chart.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. How do you place a line series on its own value axis in a combo chart?
- [ ] `valAxis: 2` in the chart options
- [x] `secondaryValAxis: true` and `secondaryCatAxis: true` in that series entry's options, plus a two-element `valAxes`
- [ ] Two separate `addChart` calls at the same position
> The combo array plus `valAxes`/`catAxes` arrays is the documented way; overlaying two charts breaks selection and printing.

2. For a pie chart, what does `chartColors` colour?
- [ ] Each series
- [x] Each data point
- [ ] The legend only
> Bar, line, area and scatter apply colours per series; pie and doughnut per point.

3. Why fix `valAxisMinVal` and `valAxisMaxVal` in a weekly deck?
- [ ] PowerPoint requires it
- [x] So charts on different weeks are visually comparable
- [ ] To hide the axis labels
> Auto-scaling makes every week fill the chart, hiding real changes.

### Exercises

1. **Percent-stacked quality chart** — Draw a 100% stacked column chart of "Clean" vs "Error" files per state with white borders between segments and data labels in the centre.
<details><summary>Solution</summary>

```js
const states = ["TX", "FL", "CA", "AZ"];
slide.addChart(pptx.ChartType.bar, [
  { name: "Clean", labels: states, values: [403, 374, 297, 170] },
  { name: "Error", labels: states, values: [9, 14, 4, 6] },
], { x: 0.5, y: 1.3, w: 9, h: 3.6, barDir: "col", barGrouping: "percentStacked", chartColors: ["1ABC9C", "C0392B"],
     dataBorder: { pt: 1, color: "FFFFFF" }, showValue: true, dataLabelPosition: "ctr", dataLabelColor: "FFFFFF", dataLabelFontSize: 9,
     valAxisLabelFormatCode: "0%", showLegend: true, legendPos: "b" });
```

</details>

2. **Gap for a missing week** — Plot a line for six weeks where W03 has no data, drawn as a gap.
<details><summary>Solution</summary>

```js
slide.addChart(pptx.ChartType.line, [{ name: "TAT days", labels: ["W01", "W02", "W03", "W04", "W05", "W06"], values: [1.9, 1.7, null, 2.2, 1.8, 1.6] }],
  { x: 0.5, y: 1.3, w: 9, h: 3.6, displayBlanksAs: "gap", lineDataSymbol: "circle", valAxisMinVal: 0, valAxisMaxVal: 3, chartColors: ["1F3A5F"] });
```

</details>

### Interview Questions

**Q: Walk me through building a chart with two value axes in PptxGenJS.**
I call `slide.addChart` with an array of `{ type, data, options }` entries instead of a single type. The bar entry uses the primary axes; the line entry sets `secondaryValAxis: true` and `secondaryCatAxis: true`. In the chart-level options I pass `valAxes` with two objects, each with its own title, number format and min/max, and `catAxes` with two objects where the second has `catAxisHidden: true` so the category labels appear once. Both series must share the same `labels`. I fix the min and max on both axes so the chart reads the same from week to week, and I disable gridlines on the secondary axis so only one grid is drawn.

**Q: How do you keep chart colours consistent with the rest of the deck?**
Every chart takes `chartColors` from the shared `BRAND` palette in series order, and I keep a fixed mapping such as volume in navy, quality in red, staffing in teal so the same measure is always the same colour across slides and weeks. For pie charts I sort the data before charting and pass colours in the same order, since pie colours are per point. Where a status colour matters, for example RAG, the same `rag()` function that colours the table cell also picks the bar colour, so the two never disagree.

**Q: What chart mistakes have caused PowerPoint's repair prompt?**
Values that were strings or `NaN`, a `labels` array shorter than `values`, a `dataLabelPosition` that is invalid for the chart type such as `outEnd` on a line, and a combo chart where the second entry lacked `secondaryValAxis` while `valAxes` had two entries. I now validate chart data with a small function that checks equal lengths, finite numbers and allowed label positions before `addChart`, and I open generated decks in PowerPoint and LibreOffice in CI-like smoke tests, because LibreOffice tolerates some errors PowerPoint does not and vice versa.

## Media & background images

Beyond pictures, decks carry full-bleed background images, semi-transparent overlays, embedded video or audio, and links to online video. PptxGenJS supports all of these through `slide.background`, `addImage` options and `addMedia`. The rules are mostly about file formats and sizes, because media is the part of a deck that most often fails to play on someone else's laptop.

### Slide backgrounds

The Intermediate level set a solid colour. The same property takes an image:

```js
slide.background = { path: "assets/skyline.jpg" };                  // Node: file path or URL
slide.background = { data: "image/jpeg;base64,/9j/4AAQ..." };      // any environment
slide.background = { color: "1F3A5F", transparency: 0 };           // solid, back to basics
```

`slide.background` replaced the older `slide.bkgd` in v3.4; `bkgd` still works but is deprecated. Background images are stretched to the slide size, so prepare them at the slide's aspect ratio (1920 x 1080 for 16:9) or they distort. A master can carry the image for you: `defineSlideMaster({ title: "COVER", background: { path: "cover.jpg" }, objects: [...] })`.

### Making text readable on a photo

Put a translucent rectangle between the image and the text. Fill transparency is a percentage:

```js
slide.background = { data: PHOTO };
slide.addShape("rect", { x: 0, y: 3.4, w: "100%", h: 2.225, fill: { color: "000000", transparency: 45 } });
slide.addText("Q1 2026 Production Review", { x: 0.5, y: 3.6, w: 9, h: 0.8, fontSize: 30, bold: true, color: "FFFFFF" });
```

### Image options that matter for media-heavy slides

```js
slide.addImage({
  data: PHOTO, x: 0.5, y: 1.2, w: 4, h: 3,
  sizing: { type: "cover", w: 4, h: 3 },        // "contain" | "cover" | "crop"
  rounding: true,                                // circular crop
  transparency: 30,                              // 0..100, watermark effect
  rotate: 0, flipH: false,
  shadow: { type: "outer", blur: 4, offset: 2, angle: 45, color: "000000", opacity: 0.35 },
  altText: "Lahore delivery centre, floor 3",
});
```

`sizing.type: "cover"` fills the box and crops the overflow, `"contain"` fits inside the box leaving space, and `"crop"` takes an explicit `x, y, w, h` window from the source image. PptxGenJS does not read image dimensions, so without `sizing` the image is stretched to `w` x `h`; measure images first (the `image-size` package in Node, or an `Image` object in the browser) or always use `cover`/`contain`.

### Embedded video and audio

```js
slide.addMedia({ type: "video", path: "assets/walkthrough.mp4", x: 1, y: 1, w: 8, h: 4.5, cover: POSTER_PNG });
slide.addMedia({ type: "audio", data: "audio/mp3;base64,SUQzBAAAAA...", x: 0.5, y: 5, w: 1, h: 0.5 });
```

The file is copied into the `.pptx` package (`ppt/media/`), so a 200 MB video makes a 200 MB deck. `cover` is the poster frame shown before play; without it PowerPoint shows a black rectangle in generated decks. Use MP4 with H.264 video and AAC audio for anything that must play on Windows and Mac; PowerPoint 2016 and later play it natively, and LibreOffice relies on the system codecs. MOV and AVI work on some machines only. Keynote and Google Slides transcode on import, sometimes badly, so send MP4.

### Online video

```js
slide.addMedia({ type: "online", link: "https://www.youtube.com/embed/VIDEO_ID", x: 1, y: 1, w: 8, h: 4.5 });
```

The `embed` URL form is required, not the `watch?v=` form. Nothing is stored in the file, so the deck stays small, but playback needs an internet connection and PowerPoint 2013 or later; LibreOffice shows only the frame.

| Media | Stored in file | Plays offline | Notes |
|---|---|---|---|
| Background/slide image (PNG, JPG, GIF, SVG) | yes | yes | SVG renders in PowerPoint 2016+; animated GIF plays in slideshow |
| `video` MP4 (H.264/AAC) | yes | yes | add `cover` poster; watch file size |
| `audio` MP3/M4A/WAV | yes | yes | shows as a speaker icon |
| `online` YouTube/Vimeo embed | no | no | frame only in LibreOffice |

### Image formats and encoding

PNG for screenshots, logos and anything with text; JPEG for photos (quality 80 to 85 is invisible in a deck); GIF only when animation is needed. CMYK JPEGs exported from print workflows render with wrong colours or not at all in PowerPoint, so convert covers and brochure art to sRGB before embedding. The base64 string passed to `data` can be either the docs' `image/png;base64,...` form or a full `data:image/png;base64,...` URI from `canvas.toDataURL()` or `FileReader.readAsDataURL()`; both are accepted.

> **Warning:** A background image is per slide, not per deck. If 40 slides each carry a 3 MB photo the package holds 40 copies of it and the file is 120 MB. Put the image on a master instead, which stores it once in the layout.

### Try It Yourself

```js
// Build a background image in the browser, then use it with an overlay and a heading
const c = document.createElement("canvas"); c.width = 1920; c.height = 1080;
const g = c.getContext("2d");
const grad = g.createLinearGradient(0, 0, 1920, 1080);
grad.addColorStop(0, "#1F3A5F"); grad.addColorStop(1, "#1ABC9C");
g.fillStyle = grad; g.fillRect(0, 0, 1920, 1080);
g.fillStyle = "rgba(255,255,255,0.08)";
for (let i = 0; i < 12; i++) g.fillRect(i * 160, 0, 80, 1080);
const PHOTO = c.toDataURL("image/jpeg", 0.85);

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";

// Slide 1: full-bleed background with a translucent band and title
const cover = pptx.addSlide();
cover.background = { data: PHOTO };
cover.addShape("rect", { x: 0, y: 3.4, w: "100%", h: 2.225, fill: { color: "000000", transparency: 45 } });
cover.addText("Q1 2026 Production Review", { x: 0.5, y: 3.6, w: 9, h: 0.8, fontSize: 30, bold: true, color: "FFFFFF" });
cover.addText("Title-insurance production support  |  Stewart Title", { x: 0.5, y: 4.4, w: 9, h: 0.5, fontSize: 14, color: "F4F6F7" });

// Slide 2: the same image as a rounded thumbnail with a shadow, plus an online video frame
const s2 = pptx.addSlide();
s2.addText("Media examples", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 24, bold: true, color: "1F3A5F" });
s2.addImage({ data: PHOTO, x: 0.5, y: 1.3, w: 3, h: 3, sizing: { type: "cover", w: 3, h: 3 }, rounding: true,
  shadow: { type: "outer", blur: 4, offset: 2, angle: 45, color: "000000", opacity: 0.35 }, altText: "Gradient sample" });
s2.addImage({ data: PHOTO, x: 3.8, y: 1.3, w: 2.5, h: 3, sizing: { type: "contain", w: 2.5, h: 3 }, transparency: 60 });
s2.addMedia({ type: "online", link: "https://www.youtube.com/embed/VIDEO_ID", x: 6.6, y: 1.3, w: 3, h: 1.7 }); // replace VIDEO_ID
s2.addText("cover / contain / online video", { x: 0.5, y: 4.5, w: 9, h: 0.4, fontSize: 11, color: "7F8C8D" });

pptx.writeFile({ fileName: "media.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. Which property sets a slide background image in v3.4 and later?
- [ ] `slide.bkgd = { path }`
- [x] `slide.background = { path }` or `{ data }`
- [ ] `slide.addImage({ background: true })`
> `bkgd` is the deprecated v2 name; `background` also takes `color` and `transparency`.

2. Why add `cover` to an embedded video?
- [x] It is the poster frame; without it PowerPoint shows a black box before playback
- [ ] It compresses the video
- [ ] It is required for MP4
> `cover` is a base64 image used as the still frame.

3. What happens if the same 3 MB photo is set as the background on 40 slides?
- [ ] PptxGenJS stores it once
- [x] The package holds 40 copies and grows by about 120 MB
- [ ] PowerPoint refuses to open it
> Put shared backgrounds on a master, which stores the image once.

### Exercises

1. **Watermark** — Add a diagonal "DRAFT" text and a faint logo image centred on a slide without blocking the content.
<details><summary>Solution</summary>

```js
slide.addImage({ data: LOGO_PNG, x: 3.5, y: 1.8, w: 3, h: 2, sizing: { type: "contain", w: 3, h: 2 }, transparency: 85 });
slide.addText("DRAFT", { x: 1, y: 2, w: 8, h: 1.5, fontSize: 80, bold: true, color: "C0392B", transparency: 80, align: "center", rotate: 330 });
```

</details>

2. **Cover master** — Define a master that carries the background image once and reuse it for three section slides.
<details><summary>Solution</summary>

```js
pptx.defineSlideMaster({ title: "PHOTO_SECTION", background: { data: PHOTO }, objects: [
  { rect: { x: 0, y: 3.4, w: "100%", h: 2.225, fill: { color: "000000", transparency: 45 } } },
  { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 3.6, w: 9, h: 0.8, fontSize: 30, bold: true, color: "FFFFFF" }, text: "" } },
] });
["Volume", "Quality", "Staffing"].forEach(t => pptx.addSlide({ masterName: "PHOTO_SECTION" }).addText(t, { placeholder: "title" }));
```

</details>

### Interview Questions

**Q: A client says the video in a generated deck shows a black box and does not play on their Mac. What do you check?**
First the codec: I re-encode to MP4 with H.264 video and AAC audio, which both PowerPoint for Mac and Windows play without extra codecs; AVI or an H.265 MP4 is the usual culprit. Second, the black box before play is normal when no poster is set, so I pass a `cover` image. Third, I check the deck was not opened in Keynote or Google Slides, which transcode on import. If the file must stay small I switch to `type: "online"` with an embed URL and accept that it needs a connection.

**Q: How do you keep a media-heavy deck at a sensible file size?**
Backgrounds go on masters so they are stored once, photos are resized to the pixel size they will be displayed at (a 4 x 3 inch image needs about 800 x 600 pixels at 200 ppi, not a 24 MP camera file) and saved as JPEG at 80 to 85 quality, logos and screenshots stay PNG, and video is either linked online or trimmed and encoded at 720p. I log the package size after `writeFile` and fail the job if it exceeds an agreed limit, because a 150 MB weekly deck will not go through most email gateways.

**Q: Why might an image look right in the browser preview but wrong in PowerPoint?**
The common causes are a CMYK JPEG from a print workflow, which browsers convert on the fly but PowerPoint renders with inverted or missing colours; an EXIF orientation flag, which browsers honour and PowerPoint ignores, so a phone photo appears rotated; and an SVG using features PowerPoint's renderer lacks, such as filters or embedded fonts. I normalise images before embedding: convert to sRGB, bake in the rotation, and rasterise complex SVGs to PNG.

## Layout math & responsive positioning

Every `x`, `y`, `w` and `h` in PptxGenJS is a number of inches unless you pass a percentage string. Hard-coding those numbers works for one layout and breaks when the client asks for 4:3 or A4. This chapter builds a small grid so positions are computed from the slide size, and covers the arithmetic for fitting text.

### Slide sizes and units

| `pptx.layout` | Width x height (in) | Notes |
|---|---|---|
| `LAYOUT_16x9` | 10 x 5.625 | default |
| `LAYOUT_16x10` | 10 x 6.25 | |
| `LAYOUT_4x3` | 10 x 7.5 | older projectors, some printed handouts |
| `LAYOUT_WIDE` | 13.333 x 7.5 | PowerPoint's default "Widescreen" |
| custom | any | `pptx.defineLayout({ name: "A4", width: 11.69, height: 8.27 })` then `pptx.layout = "A4"` |

Internally PowerPoint uses EMU (English Metric Units): 914,400 per inch, 12,700 per point. `pptx.presLayout` returns the current size in EMU, which is the only place you need the conversion:

```js
const W = pptx.presLayout.width / 914400;   // 10 for LAYOUT_16x9
const H = pptx.presLayout.height / 914400;  // 5.625
```

Percent strings are relative to the slide: `x: "50%"` is the horizontal centre, `w: "100%"` spans the width. They are convenient for full-width bars but cannot express gutters, so a numeric grid is better for content.

### A 12-column grid

```js
function makeGrid(pptx, { cols = 12, margin = 0.5, gutter = 0.2, top = 1.3, bottom = 0.6 } = {}) {
  const W = pptx.presLayout.width / 914400, H = pptx.presLayout.height / 914400;
  const colW = (W - 2 * margin - gutter * (cols - 1)) / cols;
  return {
    W, H, top, contentH: H - top - bottom,
    x: col => margin + col * (colW + gutter),                 // left edge of column `col` (0-based)
    w: span => span * colW + (span - 1) * gutter,             // width of `span` columns
  };
}
const grid = makeGrid(pptx);
slide.addChart(pptx.ChartType.bar, data, { x: grid.x(0), y: grid.top, w: grid.w(7), h: grid.contentH });
slide.addText(notes, { x: grid.x(7), y: grid.top, w: grid.w(5), h: grid.contentH, fontSize: 12 });
```

The chart takes seven columns and the commentary five, and the same two lines produce a correct layout on 16:9, 4:3 or A4 because `W` and `H` come from the presentation. A KPI row is four tiles of three columns each: `for (let i = 0; i < 4; i++) kpiTile(slide, grid.x(i * 3), grid.top, grid.w(3), ...)`.

### Rows and vertical rhythm

Vertical space is the scarce resource on 16:9. Define row heights from the content height rather than absolute inches:

```js
const rows = [0.18, 0.62, 0.2];                                   // proportions: KPI row, main, footer note
let y = grid.top;
const rowY = rows.map(p => { const start = y; y += p * grid.contentH; return start; });
const rowH = rows.map(p => p * grid.contentH);
```

### Estimating text height

PptxGenJS does not measure text. A text box that is too short overflows visibly (PowerPoint does not clip), so estimate before you place. The rule of thumb for Calibri-like fonts: average character width is about 0.5 x font size in points, and line height about 1.2 x font size.

```js
function textHeight(text, { fontSize = 12, w = 9, lineHeight = 1.2 } = {}) {
  const charsPerLine = Math.floor((w * 72) / (fontSize * 0.5));
  const lines = text.split("\n").reduce((n, para) => n + Math.max(1, Math.ceil(para.length / charsPerLine)), 0);
  return (lines * fontSize * lineHeight) / 72;                 // inches
}
const h = textHeight(commentary, { fontSize: 12, w: grid.w(5) });
```

Add the text box margins (the `margin` option, in points) and round up. When the estimate exceeds the space, either drop the font size a step or split the text across slides with the `chunk` helper. `fit: "shrink"` asks PowerPoint to shrink text on overflow, but PowerPoint only applies it when the text is edited, so it is not a substitute for arithmetic in a generated deck.

### Text box options that affect layout

| Option | Meaning |
|---|---|
| `margin` | inset in points, number or `[top, right, bottom, left]` |
| `valign: "top" | "middle" | "bottom"` | vertical anchor inside the box |
| `align` | `"left"`, `"center"`, `"right"`, `"justify"` |
| `lineSpacing` (points) or `lineSpacingMultiple: 1.15` | leading |
| `paraSpaceBefore`, `paraSpaceAfter` (points) | paragraph gaps |
| `wrap: false` | one line, overflow to the right |
| `fit: "shrink" | "resize"` | autofit hints for later editing |

### Aspect-ratio-safe images

```js
function fitImage(imgW, imgH, boxW, boxH) {
  const s = Math.min(boxW / imgW, boxH / imgH);
  const w = imgW * s, h = imgH * s;
  return { w, h, dx: (boxW - w) / 2, dy: (boxH - h) / 2 };     // centred inside the box
}
const f = fitImage(1600, 900, grid.w(6), 3);
slide.addImage({ data: PHOTO, x: grid.x(6) + f.dx, y: grid.top + f.dy, w: f.w, h: f.h });
```

This is what `sizing: { type: "contain" }` does inside the box, but computing it yourself lets you align the image's real edge with a caption below it.

> **Tip:** Keep 0.5 in of margin on every side and never place anything in the bottom 0.6 in on 16:9; that is where footers, slide numbers and projector bezels live. Build the margin into the grid so no slide builder has to remember it.

### Try It Yourself

```js
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";   // change to "LAYOUT_4x3" or "LAYOUT_WIDE" and re-run: the layout adapts

function makeGrid(pptx, { cols = 12, margin = 0.5, gutter = 0.2, top = 1.3, bottom = 0.6 } = {}) {
  const W = pptx.presLayout.width / 914400, H = pptx.presLayout.height / 914400;
  const colW = (W - 2 * margin - gutter * (cols - 1)) / cols;
  return { W, H, top, contentH: H - top - bottom, x: c => margin + c * (colW + gutter), w: s => s * colW + (s - 1) * gutter };
}
function textHeight(text, { fontSize = 12, w = 9 } = {}) {
  const cpl = Math.floor((w * 72) / (fontSize * 0.5));
  const lines = text.split("\n").reduce((n, p) => n + Math.max(1, Math.ceil(p.length / cpl)), 0);
  return (lines * fontSize * 1.2) / 72;
}

const grid = makeGrid(pptx);
console.log(`slide ${grid.W} x ${grid.H} in, content height ${grid.contentH.toFixed(2)} in`);

const slide = pptx.addSlide();
slide.addText("Week 11: volume and commentary", { x: grid.x(0), y: 0.4, w: grid.w(12), h: 0.7, fontSize: 24, bold: true, color: "1F3A5F" });

// KPI row: four tiles of three columns each
const kpis = [["Files", "1,335"], ["Errors", "33"], ["Error rate", "2.5%"], ["TAT", "1.9 d"]];
kpis.forEach(([label, value], i) => {
  const x = grid.x(i * 3), w = grid.w(3);
  slide.addShape("rect", { x, y: grid.top, w, h: 0.9, fill: { color: "F4F6F7" }, line: { color: "D5DBDB", width: 0.5 } });
  slide.addText(value, { x, y: grid.top + 0.05, w, h: 0.5, fontSize: 22, bold: true, color: "1F3A5F", align: "center" });
  slide.addText(label, { x, y: grid.top + 0.55, w, h: 0.3, fontSize: 10, color: "7F8C8D", align: "center" });
});

// Main row: chart on 7 columns, commentary on 5, height computed from what is left
const mainY = grid.top + 1.1, mainH = grid.contentH - 1.1;
slide.addChart(pptx.ChartType.bar, [{ name: "Files", labels: ["TX", "FL", "CA", "AZ", "WY"], values: [412, 388, 301, 176, 58] }],
  { x: grid.x(0), y: mainY, w: grid.w(7), h: mainH, chartColors: ["1F3A5F"], barDir: "col", valAxisLabelFormatCode: "#,##0", catAxisLabelFontSize: 10, valAxisLabelFontSize: 10 });

const commentary = "TX and FL carried 60% of volume. FL error rate rose to 3.6% after two new agents joined; retraining is scheduled for Monday.\nWY closed its first commercial file this quarter.";
const needed = textHeight(commentary, { fontSize: 12, w: grid.w(5) });
console.log(`commentary needs about ${needed.toFixed(2)} in of ${mainH.toFixed(2)} available`);
slide.addText(commentary, { x: grid.x(7), y: mainY, w: grid.w(5), h: mainH, fontSize: needed > mainH ? 10 : 12, valign: "top", margin: 4, color: "2C3E50" });

pptx.writeFile({ fileName: "grid-layout.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. How many EMU are in one inch?
- [ ] 12,700
- [x] 914,400
- [ ] 72
> 12,700 EMU is one point; 914,400 is one inch; `pptx.presLayout` reports EMU.

2. What happens when text does not fit its box in a generated deck?
- [ ] PptxGenJS shrinks the font automatically
- [ ] The text is clipped
- [x] It overflows the box visibly, because PowerPoint does not clip and autofit only runs on edit
> Estimate height before placing, then reduce the size or split across slides.

3. What is the width of one column in a 12-column grid on a 10 in slide with 0.5 in margins and 0.2 in gutters?
- [x] About 0.567 in
- [ ] 0.75 in
- [ ] 0.833 in
> (10 - 1 - 0.2 x 11) / 12 = 6.8 / 12 = 0.567.

### Exercises

1. **A4 landscape handout** — Define an A4 landscape layout and place a title, a full-width table area and a footer note using the grid.
<details><summary>Solution</summary>

```js
pptx.defineLayout({ name: "A4L", width: 11.69, height: 8.27 });
pptx.layout = "A4L";
const grid = makeGrid(pptx, { margin: 0.6, top: 1.4, bottom: 0.7 });
const s = pptx.addSlide();
s.addText("Rate matrix: Texas, effective 2026-04-01", { x: grid.x(0), y: 0.5, w: grid.w(12), h: 0.7, fontSize: 22, bold: true });
s.addTable(rows, { x: grid.x(0), y: grid.top, w: grid.w(12), fontSize: 10, autoPage: true, autoPageRepeatHeader: true });
s.addText("Rates in USD per $1,000 of coverage. Source: TDI Basic Manual.", { x: grid.x(0), y: grid.H - 0.6, w: grid.w(12), h: 0.3, fontSize: 9, color: "7F8C8D" });
```

</details>

2. **Two-up image row** — Place two 1600 x 900 images side by side, each in a 6-column box 3 in high, centred and undistorted, with captions directly under each image edge.
<details><summary>Solution</summary>

```js
[PHOTO_A, PHOTO_B].forEach((img, i) => {
  const boxX = grid.x(i * 6), boxW = grid.w(6);
  const f = fitImage(1600, 900, boxW, 3);
  slide.addImage({ data: img, x: boxX + f.dx, y: grid.top + f.dy, w: f.w, h: f.h });
  slide.addText(`Figure ${i + 1}`, { x: boxX + f.dx, y: grid.top + f.dy + f.h + 0.05, w: f.w, h: 0.3, fontSize: 10, color: "7F8C8D", align: "center" });
});
```

</details>

### Interview Questions

**Q: How do you make a deck generator work for both 16:9 and 4:3 without duplicating code?**
All positions come from a grid object built from `pptx.presLayout`, so column x-positions, spans and the content height are derived from the actual slide size rather than typed in. Slide builders take grid coordinates such as `grid.x(7)` and `grid.w(5)`, and row heights are proportions of `grid.contentH`. Switching layouts is one assignment to `pptx.layout`. The parts that still need care are text, because the same paragraph needs a smaller font on a shorter slide, and images, which I fit with an aspect-ratio helper rather than stretching; both are handled by estimating height before placement.

**Q: PptxGenJS cannot measure text. How do you avoid overflow?**
I estimate: characters per line is the box width in points divided by roughly half the font size, lines is the sum over paragraphs of the ceiling of length over characters per line, and height is lines times font size times 1.2, converted to inches, plus the box margins. If the estimate exceeds the available height I step the font size down to a floor, and beyond that I split the text across slides. For tables I let `autoPage` handle it. I also keep a visual smoke test where the generated deck is converted to PDF with LibreOffice headless and a few pages are eyeballed, because estimates are approximate for narrow fonts and long unbroken tokens like file names.

**Q: What are EMU and when do you meet them?**
English Metric Units are the integer unit inside Office Open XML: 914,400 per inch, 360,000 per centimetre and 12,700 per point, chosen so that inches, centimetres and points all convert to whole numbers. PptxGenJS hides them behind inches and percentages, so the only place they surface is `pptx.presLayout.width` and `height`, or when inspecting the generated XML while debugging a repair prompt. Knowing the conversion lets me read `<a:off x="457200">` as half an inch.

# LEVEL: Expert

## Weekly production-report decks from data

Everything so far comes together in one job: every Monday at 07:00 a script reads last week's production extract, builds the branded deck, checks it, and delivers it. This chapter is the production version of that job as it would run for a title-insurance operations team, with the file layout, the checks and the scheduling that make it trustworthy enough that nobody opens PowerPoint on Monday morning.

### Project layout

```text
report-deck/
  package.json          pptxgenjs, csv-parse, nodemailer, node-cron
  config.json           thresholds, recipients, paths, brand name
  src/brand.js          BRAND palette + applyBrand(pptx)
  src/load.js           read + validate the CSV extract
  src/model.js          derive totals, rates, rankings, exceptions
  src/builders.js       kpiTile, pagedTable, comboChart, exceptionsSlide
  src/build.js          buildDeck(model, config) -> pptx
  src/index.js          CLI: node src/index.js --week 2026-W11
  test/model.test.js    unit tests on derivation with a fixture CSV
  out/                  generated decks, one per week
```

The split matters: `model.js` has no PptxGenJS import and is unit-tested with fixtures; `build.js` has no I/O and is tested by generating a deck from a fixture model and checking slide count and size.

### Loading the extract

```js
// src/load.js
const fs = require("fs");
const { parse } = require("csv-parse/sync");
function loadWeek(path) {
  const rows = parse(fs.readFileSync(path, "utf8"), { columns: true, skip_empty_lines: true, cast: true });
  if (!rows.length) throw new Error(`${path}: no rows`);
  for (const r of rows) for (const k of ["files", "errors", "tat_days", "agents"])
    if (!Number.isFinite(r[k])) throw new Error(`${path}: ${r.state} ${k}="${r[k]}" is not numeric`);
  return rows;
}
module.exports = { loadWeek };
```

`cast: true` turns numeric strings into numbers; the loop catches the ones that did not cast, such as a stray "n/a".

### Deriving the model

```js
// src/model.js
function buildModel(rows, prev, cfg) {
  const byState = rows.map(r => ({ ...r, errRate: r.errors / r.files, perAgent: r.files / r.agents }))
                      .sort((a, b) => b.files - a.files);
  const total = f => byState.reduce((s, r) => s + r[f], 0);
  const files = total("files"), errors = total("errors");
  const prevFiles = prev ? prev.reduce((s, r) => s + r.files, 0) : null;
  return {
    week: cfg.week, files, errors, errRate: errors / files,
    filesDelta: prevFiles ? (files - prevFiles) / prevFiles : null,
    byState,
    exceptions: byState.filter(r => r.errRate >= cfg.thresholds.red),
    trend: cfg.history.map(h => ({ label: h.week, files: h.files, errRate: h.errRate })),
  };
}
module.exports = { buildModel };
```

### Building the deck

```js
// src/build.js
const PptxGenJS = require("pptxgenjs");
const { applyBrand } = require("./brand");
const B = require("./builders");
function buildDeck(m, cfg) {
  const pptx = new PptxGenJS();
  const BRAND = applyBrand(pptx);
  pptx.title = `Production Status ${m.week}`;
  pptx.subject = `report-deck v${cfg.version} | ${cfg.source}`;
  B.cover(pptx, m);                                   // BRAND_TITLE
  B.summary(pptx, m, BRAND);                          // 4 KPI tiles + week-on-week delta
  B.trend(pptx, m.trend, BRAND);                      // combo chart, fixed axes
  B.byState(pptx, m.byState, BRAND);                  // paged table, RAG colours
  if (m.exceptions.length) B.exceptions(pptx, m.exceptions, BRAND);
  B.appendix(pptx, m, cfg);                           // hidden slide with raw figures and provenance
  return pptx;
}
module.exports = { buildDeck };
```

Each builder is 10 to 30 lines from the Advanced level. The conditional exceptions slide is a deliberate design choice: a slide that says "no exceptions" trains readers to skip it, while a slide that appears only when needed gets read.

### The entry point: checks, naming, delivery

```js
// src/index.js
const path = require("path"), fs = require("fs");
const cfg = require("../config.json");
const week = process.argv.includes("--week") ? process.argv[process.argv.indexOf("--week") + 1] : cfg.currentWeek();
const rows = loadWeek(path.join(cfg.inbox, `production_${week}.csv`));
const model = buildModel(rows, loadPrev(week), { ...cfg, week });
const pptx = buildDeck(model, cfg);

const fileName = path.join("out", `Production_Status_${week}_${new Date().toISOString().slice(0, 10)}.pptx`);
pptx.writeFile({ fileName, compression: true }).then(async f => {
  const size = fs.statSync(f).size;
  if (size < 20_000 || size > cfg.maxBytes) throw new Error(`Suspicious deck size ${size} bytes`);
  await sendMail({ to: cfg.recipients, subject: `Production status ${week}`, attachments: [{ path: f }] });
  console.log(`sent ${f} (${(size / 1024).toFixed(0)} KB, ${model.byState.length} states, ${model.exceptions.length} exceptions)`);
});
```

The size check is a cheap smoke test: a deck under 20 KB has no charts or images and means the loop produced nothing. Deterministic file names with the week and the run date let the team find the deck that was actually sent.

### Scheduling

| Where | How |
|---|---|
| Linux server | `crontab`: `0 7 * * 1 cd /srv/report-deck && node src/index.js >> logs/run.log 2>&1` |
| Inside Node | `node-cron`: `cron.schedule("0 7 * * 1", run, { timezone: "Asia/Karachi" })` |
| Windows | Task Scheduler running `node src\index.js` with "Run whether user is logged on or not" |
| GitHub Actions | `on: schedule: - cron: "0 2 * * 1"` (UTC), upload the deck as an artifact and email it |

Log the input file name, row count, output path, size and any exceptions on every run; when someone asks why Monday's deck looks different, the log answers before the code is opened.

> **Interview note:** "How do you know the deck is right before it is sent?" Good answers: unit tests on the model, a size window, a slide-count assertion (`cover + summary + trend + ceil(states / 8) + exceptions? + appendix`), a LibreOffice headless conversion to PDF in CI to confirm the file opens, and a human sign-off for the first three runs.

### Try It Yourself

```js
// The whole pipeline in the browser: CSV text -> model -> deck
const csv = `state,files,errors,tat_days,agents
TX,412,9,1.8,6
FL,388,14,2.1,5
CA,301,4,1.6,4
AZ,176,6,2.4,3
WY,58,0,1.2,1`;
const cfg = { week: "2026-W11", thresholds: { amber: 0.02, red: 0.04 }, version: "1.4",
  history: [{ week: "W08", files: 1520, errRate: 1.2 }, { week: "W09", files: 1610, errRate: 0.9 }, { week: "W10", files: 1480, errRate: 1.4 }, { week: "W11", files: 1335, errRate: 2.5 }] };

// load + validate
const [head, ...lines] = csv.trim().split("\n");
const cols = head.split(",");
const rows = lines.map(l => Object.fromEntries(l.split(",").map((v, i) => [cols[i], i ? Number(v) : v])));
for (const r of rows) for (const k of ["files", "errors", "tat_days", "agents"]) if (!Number.isFinite(r[k])) throw new Error(`${r.state}: ${k} not numeric`);

// model
const byState = rows.map(r => ({ ...r, errRate: r.errors / r.files })).sort((a, b) => b.files - a.files);
const files = byState.reduce((s, r) => s + r.files, 0), errors = byState.reduce((s, r) => s + r.errors, 0);
const exceptions = byState.filter(r => r.errRate >= cfg.thresholds.red);
const BRAND = { navy: "1F3A5F", teal: "1ABC9C", red: "C0392B", amber: "F39C12", green: "27AE60", grey: "7F8C8D" };
const rag = e => e < cfg.thresholds.amber ? BRAND.green : e < cfg.thresholds.red ? BRAND.amber : BRAND.red;
const pct = n => (n * 100).toFixed(1) + "%";

// build
const pptx = new PptxGenJS();
pptx.title = `Production Status ${cfg.week}`; pptx.subject = `report-deck v${cfg.version}`;
const title = (s, t) => s.addText(t, { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 24, bold: true, color: BRAND.navy });

const cover = pptx.addSlide(); cover.background = { color: BRAND.navy };
cover.addText(`Weekly Production Status ${cfg.week}`, { x: 0.6, y: 2, w: 8.8, h: 1, fontSize: 32, bold: true, color: "FFFFFF" });

const sum = pptx.addSlide(); title(sum, "Summary");
[["Files", String(files), BRAND.navy], ["Errors", String(errors), rag(errors / files)], ["Error rate", pct(errors / files), rag(errors / files)], ["Exceptions", String(exceptions.length), exceptions.length ? BRAND.red : BRAND.green]]
  .forEach(([l, v, c], i) => {
    const x = 0.5 + i * 2.3;
    sum.addShape("rect", { x, y: 1.4, w: 2.1, h: 1.1, fill: { color: "F4F6F7" } });
    sum.addText(v, { x, y: 1.5, w: 2.1, h: 0.6, fontSize: 24, bold: true, color: c, align: "center" });
    sum.addText(l, { x, y: 2.1, w: 2.1, h: 0.3, fontSize: 10, color: BRAND.grey, align: "center" });
  });

const trend = pptx.addSlide(); title(trend, "Volume and error rate, last 4 weeks");
trend.addChart([
  { type: pptx.ChartType.bar, data: [{ name: "Files", labels: cfg.history.map(h => h.week), values: cfg.history.map(h => h.files) }], options: { chartColors: [BRAND.navy] } },
  { type: pptx.ChartType.line, data: [{ name: "Error %", labels: cfg.history.map(h => h.week), values: cfg.history.map(h => h.errRate) }], options: { chartColors: [BRAND.red], lineDataSymbol: "circle", secondaryValAxis: true, secondaryCatAxis: true } },
], { x: 0.5, y: 1.2, w: 9, h: 3.8, valAxes: [{ valAxisMinVal: 0, valAxisMaxVal: 2000, valAxisLabelFormatCode: "#,##0" }, { valAxisMinVal: 0, valAxisMaxVal: 3, valGridLine: { style: "none" } }], catAxes: [{}, { catAxisHidden: true }], showLegend: true, legendPos: "b" });

const tbl = pptx.addSlide(); title(tbl, "By state");
tbl.addTable([["State", "Files", "Errors", "Rate"].map(h => ({ text: h, options: { bold: true, fill: { color: BRAND.navy }, color: "FFFFFF" } })),
  ...byState.map(r => [r.state, String(r.files), String(r.errors), { text: pct(r.errRate), options: { color: rag(r.errRate), bold: true } }])],
  { x: 0.5, y: 1.2, w: 9, colW: [2, 2.5, 2, 2.5], fontSize: 12, border: { type: "solid", color: "D5DBDB", pt: 0.5 } });

if (exceptions.length) {
  const ex = pptx.addSlide(); title(ex, "Exceptions");
  ex.addText(exceptions.map(r => ({ text: `${r.state}: ${pct(r.errRate)} error rate (${r.errors} of ${r.files})`, options: { bullet: true, color: BRAND.red } })), { x: 0.5, y: 1.3, w: 9, h: 3, fontSize: 16 });
}
const app = pptx.addSlide(); app.hidden = true; app.addNotes(`report-deck v${cfg.version}; input rows: ${rows.length}`);
app.addText("Appendix: " + JSON.stringify(byState), { x: 0.5, y: 0.5, w: 9, h: 4.5, fontSize: 9, color: BRAND.grey });

const expected = 4 + (exceptions.length ? 1 : 0) + 1;
console.log(`slides expected: ${expected}, exceptions: ${exceptions.map(r => r.state).join(", ") || "none"}`);
pptx.writeFile({ fileName: `Production_Status_${cfg.week}.pptx` }).then(f => console.log("saved", f));
```

### Quiz

1. Why is `model.js` kept free of any PptxGenJS import?
- [x] So derivation can be unit-tested without generating a file
- [ ] PptxGenJS cannot be imported twice
- [ ] To make the deck smaller
> Separating derivation from rendering is what makes the numbers testable.

2. What does the 20 KB lower bound on file size catch?
- [ ] Decks with too many images
- [x] A deck where the loop produced no charts or content, for example from an empty extract
- [ ] Corrupt ZIP files
> A near-empty deck is the classic silent failure of a scheduled job.

3. Why generate the exceptions slide only when there are exceptions?
- [ ] PptxGenJS cannot add empty slides
- [x] A slide that always exists gets skipped; one that appears only when needed gets read
- [ ] To keep the slide count constant
> Slide count is asserted with the conditional taken into account.

### Exercises

1. **Week-on-week delta tile** — Add a KPI tile showing files versus the previous week as a signed percentage, green if up and red if down.
<details><summary>Solution</summary>

```js
function deltaTile(slide, x, y, curr, prev) {
  const d = (curr - prev) / prev;
  const txt = (d >= 0 ? "+" : "") + (d * 100).toFixed(1) + "%";
  kpiTile(slide, x, y, "vs last week", txt, d >= 0 ? "27AE60" : "C0392B");
}
deltaTile(summary, 7.4, 2.8, model.files, prevFiles);
```

</details>

2. **Slide-count assertion** — Write `expectedSlides(model)` and compare it with the number of slides the builder produced.
<details><summary>Solution</summary>

```js
function expectedSlides(m, perPage = 8) {
  return 1 /*cover*/ + 1 /*summary*/ + 1 /*trend*/ + Math.ceil(m.byState.length / perPage) + (m.exceptions.length ? 1 : 0) + 1 /*appendix*/;
}
// PptxGenJS keeps slides in pptx.slides (v3.x)
if (pptx.slides.length !== expectedSlides(model)) throw new Error(`Slide count ${pptx.slides.length} != ${expectedSlides(model)}`);
```

</details>

3. **Dry run flag** — Add `--dry-run` so the CLI builds and checks the deck but does not email it.
<details><summary>Solution</summary>

```js
const dry = process.argv.includes("--dry-run");
pptx.writeFile({ fileName }).then(async f => {
  checkSize(f);
  if (dry) return console.log("dry run: built", f);
  await sendMail({ to: cfg.recipients, attachments: [{ path: f }] });
});
```

</details>

### Interview Questions

**Q: Tell me about an automated report you built and how you made it reliable.**
At Stewart Title the weekly status report was assembled by hand from an extract every Monday. I rebuilt it as a Node job: a loader that parses and validates the CSV, a model step that derives totals, rates, rankings and exceptions and is covered by unit tests with fixture files, and a renderer that maps the model to a branded PptxGenJS deck through small builders. Reliability came from failing loudly on bad input rather than producing a wrong deck, a size window and a slide-count assertion after generation, deterministic file names with week and run date, provenance in the notes and document properties, logs for every run, and a `--dry-run` flag so changes could be tested against last week's data before the schedule picked them up.

**Q: How do you handle a change to the layout or a new metric without breaking the weekly run?**
Changes go in behind the dry-run flag: I regenerate the last four weeks from archived extracts, convert them to PDF with LibreOffice headless and compare page images against the previous version so unrelated slides prove unchanged. New metrics are added to the model first with tests, then to a builder, then to the slide-count assertion. The config file carries thresholds and recipients so the common operational changes need no code change at all. The generator version goes into `pptx.subject`, so any deck can be traced to the code that produced it.

**Q: What would make you choose a PDF or an Excel report instead of a deck?**
A deck suits a meeting: a few numbers per slide, a chart, a narrative, and something leadership can present without editing. If the audience needs to filter or sort, Excel or a Power BI report is better; if the document must be immutable and archived, a PDF. Often I produce both from the same model: the deck for Monday's review and an Excel workbook with the full rows attached to the same email, which is why the model layer is independent of the renderer.

## Node vs browser differences & streaming

The same PptxGenJS code runs in Node.js and in a browser tab, but the environment changes how you import it, where images come from, and what "saving" means. Server-side jobs also need to send decks over HTTP without writing temporary files. This chapter covers the differences and the streaming APIs.

### Importing

```js
// Node, CommonJS
const PptxGenJS = require("pptxgenjs");
// Node or bundlers, ES modules / TypeScript (types ship with the package)
import PptxGenJS from "pptxgenjs";
// Browser, no bundler: the bundle includes JSZip
<script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3/dist/pptxgen.bundle.js"></script>
```

Two browser builds exist: `pptxgen.bundle.js` includes its only dependency, JSZip; `pptxgen.min.js` expects JSZip to be loaded first. Loading the wrong one gives `JSZip is not defined`. In React, Angular or Vue you import from the package and the bundler picks the browser build via the `browser` field in `package.json`.

### Where images come from

| Option | Node | Browser |
|---|---|---|
| `path: "assets/logo.png"` | read from disk with `fs` | fetched with XHR; needs same-origin or CORS headers |
| `path: "https://cdn.example.com/logo.png"` | fetched with `https` | fetched; needs CORS |
| `data: "image/png;base64,..."` | works | works |

`data` is the portable choice. In Node, read the file once at start-up and reuse the string: `const LOGO = "image/png;base64," + fs.readFileSync("assets/logo.png").toString("base64")`. In the browser, draw it on a canvas or read an uploaded `File` with `FileReader.readAsDataURL`. A `path` that fails to load does not throw in all versions; it can produce an empty media part and a repair prompt, which is another reason to prefer `data`.

### Saving: `writeFile`, `write` and `stream`

```js
await pptx.writeFile({ fileName: "deck.pptx", compression: true });
```

In Node `writeFile` writes to disk and resolves with the file name; in the browser it creates a Blob, an object URL and a temporary `<a download>` to trigger the download, then resolves. `compression: true` uses DEFLATE inside the ZIP and typically halves decks that are mostly text and charts; it does little for JPEGs.

`write` returns the deck in memory in the format you ask for:

```js
const buf   = await pptx.write({ outputType: "nodebuffer" });   // Node Buffer
const b64   = await pptx.write({ outputType: "base64" });       // for JSON APIs and email attachments
const blob  = await pptx.write({ outputType: "blob" });         // browser
const bytes = await pptx.write({ outputType: "uint8array" });   // either
```

Other values are `arraybuffer` and `binarystring`. Older code called `pptx.write("base64")` with a string; v3 accepts both but the object form is the documented one.

### Serving a deck from Express without a temp file

```js
app.get("/reports/:week.pptx", async (req, res) => {
  const pptx = buildDeck(await loadModel(req.params.week));
  const buf = await pptx.write({ outputType: "nodebuffer" });
  res.set({
    "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "Content-Disposition": `attachment; filename="Production_${req.params.week}.pptx"`,
    "Content-Length": buf.length,
  });
  res.end(buf);
});
```

`pptx.stream()` is the older name for the same idea; it resolves with the file contents as a string or Buffer for piping into a response. The `nodebuffer` output is simpler to reason about and lets you set `Content-Length`.

### Email attachments

```js
const b64 = await pptx.write({ outputType: "base64" });
await transporter.sendMail({ to, subject, attachments: [{ filename: "deck.pptx", content: b64, encoding: "base64" }] });
```

### Browser specifics

- Generation is synchronous and CPU-bound; a 200-slide deck with charts freezes the tab for a second or two. Move it to a Web Worker: the worker imports the bundle with `importScripts`, calls `write({ outputType: "blob" })` and posts the Blob back, and the page calls `download(blob, name)`.
- Object URLs from `writeFile` are revoked after the click; if you need to keep the file, use `write({ outputType: "blob" })` and hold the Blob yourself.
- Safari on iOS blocks programmatic downloads that are not started by a user gesture, so call `writeFile` inside the click handler, not after an awaited fetch.
- There is no file system; "where did it save?" is the browser's Downloads folder.

### Node specifics

- No DOM, so no canvas: generate dynamic images with `sharp` or `canvas` (node-canvas) and pass base64.
- Long-running services should create a new `PptxGenJS()` per deck; instances accumulate slides and media and are not meant to be reset.
- Memory is the whole ZIP in RAM before it is written; for very large decks with many images, keep image bytes small and prefer `writeFile` over `write` so the buffer is released.

> **Tip:** Keep environment-specific code at the edges. `build.js` takes a model and returns a `PptxGenJS` instance; `index.js` (Node) writes a file or sends a buffer, and `app.js` (browser) calls `writeFile`. The builder never touches `fs`, `fetch` or `document`.

### Try It Yourself

```js
// Browser: build a small deck, get it as a Blob and as bytes, inspect the ZIP signature, then download
const pptx = new PptxGenJS();
const s = pptx.addSlide();
s.addText("write() in the browser", { x: 0.5, y: 2, w: 9, h: 1, fontSize: 28, bold: true, align: "center", color: "1F3A5F" });

(async () => {
  const bytes = await pptx.write({ outputType: "uint8array" });
  const sig = Array.from(bytes.slice(0, 2)).map(b => String.fromCharCode(b)).join("");
  console.log("bytes:", bytes.length, "signature:", sig);   // "PK": a .pptx is a ZIP

  const blob = await pptx.write({ outputType: "blob" });
  console.log("blob:", blob.size, blob.type || "(no type set)");

  const b64 = await pptx.write({ outputType: "base64" });
  console.log("base64 length:", b64.length, "starts with", b64.slice(0, 4));   // "UEsD" is "PK\x03\x04"

  download(blob, "write-demo.pptx");
})();
```

### Quiz

1. Which browser build includes JSZip?
- [x] `pptxgen.bundle.js`
- [ ] `pptxgen.min.js`
- [ ] Both
> `pptxgen.min.js` expects JSZip to be loaded separately; forgetting it gives `JSZip is not defined`.

2. What does `writeFile` do in the browser?
- [ ] Writes to the user's home folder
- [x] Creates a Blob and triggers a download through a temporary anchor
- [ ] Returns a base64 string
> There is no file system in a browser tab; the result is a download.

3. Which `outputType` is best for an Express response?
- [ ] `base64`
- [x] `nodebuffer`
- [ ] `blob`
> A Buffer can be sent directly with `res.end` and lets you set `Content-Length`.

### Exercises

1. **Worker generation** — Sketch a Web Worker that builds a deck from a posted model and returns a Blob.
<details><summary>Solution</summary>

```js
// worker.js
importScripts("https://cdn.jsdelivr.net/npm/pptxgenjs@3/dist/pptxgen.bundle.js");
self.onmessage = async e => {
  const pptx = new PptxGenJS();
  for (const item of e.data.items) pptx.addSlide().addText(item.title, { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 24 });
  self.postMessage(await pptx.write({ outputType: "blob" }));
};
// page.js
const w = new Worker("worker.js");
w.onmessage = e => download(e.data, "deck.pptx");
w.postMessage({ items: model.items });
```

</details>

2. **Portable logo loader** — Write `loadLogo()` that returns a base64 `data` string in Node from a file and in the browser from a fetched URL.
<details><summary>Solution</summary>

```js
async function loadLogo(src) {
  if (typeof window === "undefined") {
    const fs = require("fs");
    return "image/png;base64," + fs.readFileSync(src).toString("base64");
  }
  const blob = await (await fetch(src)).blob();
  return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
}
```

</details>

### Interview Questions

**Q: How do you serve a generated PowerPoint from a web API?**
Build the deck in memory and call `pptx.write({ outputType: "nodebuffer" })`, then respond with the PresentationML MIME type, a `Content-Disposition: attachment` header carrying a deterministic file name, and `Content-Length` from the buffer. No temp file means nothing to clean up and no collisions between concurrent requests. For heavy decks I move generation to a queue worker and return a job id, then a signed download URL, because building a 50-slide deck with charts takes a second or two of CPU and should not block the event loop of the API process.

**Q: What breaks when the same generator code moves from Node to the browser?**
Anything that touches `fs`, `path` or `require` at runtime; image `path` options that now need CORS; large synchronous generation that freezes the UI unless it runs in a Web Worker; and downloads that Safari blocks unless triggered from a user gesture. I keep the builder pure, so the model comes in and a `PptxGenJS` instance comes out, and put the environment-specific loading and saving in thin adapters. Images go through a `loadImage` helper that returns base64 in both environments.

**Q: When would you use `write` with base64 rather than `writeFile`?**
When the deck is a payload rather than a file: an email attachment through nodemailer, a JSON response for a front end that assembles the download itself, an upload to SharePoint or S3 through an SDK that accepts a buffer, or a unit test that inspects the ZIP entries with JSZip without touching disk. The cost is memory, since base64 is a third larger than the binary, so for large decks I prefer `nodebuffer` or a file.

## Troubleshooting (fonts, image encoding, PowerPoint repair prompts)

Generated decks fail in three ways: they open but look wrong (fonts), an image is missing or distorted (encoding), or PowerPoint says "PowerPoint found a problem with content... PowerPoint can attempt to repair the presentation" (invalid XML). This chapter gives a diagnosis method for each, with the causes seen most often in PptxGenJS decks.

### Fonts

PptxGenJS writes font *names*; it never embeds font files. When the viewer's machine lacks the font, PowerPoint substitutes, line breaks move and text overflows boxes that were sized for the original.

| Symptom | Cause | Fix |
|---|---|---|
| Text wraps differently on the client's laptop | `fontFace` not installed there | use fonts that ship with Office (Calibri, Arial, Segoe UI, Georgia) or the client's approved fonts |
| Font ignored entirely | name mismatch, e.g. `"Calibri-Light"` instead of `"Calibri Light"` | use the family name exactly as PowerPoint's font list shows it |
| Urdu or Arabic text shows as boxes or runs left-to-right | complex-script font missing, `rtlMode` off | set `pptx.rtlMode = true`, `lang: "ur-PK"` on the text, and a script font such as Jameel Noori Nastaleeq that the client has |
| Client insists on a licensed brand font | cannot embed from code | after generation, open in PowerPoint and File → Options → Save → "Embed fonts in the file", or agree a fallback font in the brand spec |

Remember `pptx.theme` sets the inherited fonts; a `fontFace` on a run overrides it only for that run.

### Image encoding

| Symptom | Cause | Fix |
|---|---|---|
| Red X or blank where the image should be | `path` failed to load (404, CORS, wrong relative path in Node) | use `data`; check the URL in a browser; use `path.join(__dirname, ...)` in Node |
| Repair prompt after adding an image | `data` missing the `image/png;base64,` prefix, or PNG bytes labelled JPEG | pass the full prefix and the correct type; `canvas.toDataURL()` output is fine |
| Colours inverted or greenish | CMYK JPEG | convert to sRGB before embedding |
| Photo rotated | EXIF orientation ignored by PowerPoint | bake in rotation (`sharp().rotate()`) before embedding |
| SVG blank in older PowerPoint | SVG supported from PowerPoint 2016 | rasterise to PNG for clients on 2013 or LibreOffice |
| Image stretched | no `sizing` and `w`/`h` at the wrong ratio | measure the image or use `sizing: { type: "contain" }` |
| Deck enormous | same image data repeated per slide, full-resolution photos | put shared images on a master; resize to display size |

### The repair prompt: diagnosis

"PowerPoint found a problem with content" means the ZIP opened but some XML part violated the schema. LibreOffice and Google Slides are more forgiving, so a file that opens there and not in PowerPoint is usually a schema problem, not corruption.

```text
1. Reproduce with the smallest deck: comment out builders until the prompt stops. Binary search over slides.
2. Unzip the file: unzip -o deck.pptx -d deck_xml  (a .pptx is a ZIP)
3. Look at ppt/slides/slideN.xml for the suspect slide; ppt/charts/chartN.xml for charts.
4. Check the XML is well-formed: xmllint --noout ppt/slides/slide3.xml
5. Compare against a deck saved by PowerPoint with the same feature; the differences point to the bad attribute.
6. Windows: the Open XML SDK Productivity Tool validates every part and names the offending element.
```

### Causes seen most often

- **Chart data problems**: values that are strings or `NaN`, `labels` and `values` of different lengths, an empty series, a `dataLabelPosition` invalid for the chart type, a combo chart whose second entry lacks `secondaryValAxis` while `valAxes` has two entries.
- **Empty or undefined text**: `addText(undefined)` or a table cell of `null`; always pass a string, even `""`.
- **Hyperlinks**: `hyperlink: { slide: 9 }` in an 8-slide deck, or a `url` without a scheme.
- **Tables**: rows with different cell counts, `colspan` that exceeds the row, `colW` array length not matching the columns.
- **Shapes with zero size**: `w: 0` or `h: 0` on shapes other than lines.
- **Colours with `#`** in some versions, or three-digit hex; always six hex characters without `#`.
- **Bullet `indentLevel`** above the eight levels PowerPoint allows.
- **Duplicate master names** from calling `defineSlideMaster` twice with the same title.

### Defensive wrappers

```js
const safe = {
  text: v => (v === null || v === undefined) ? "" : String(v),
  num: v => Number.isFinite(v) ? v : 0,
  hex: c => /^[0-9A-Fa-f]{6}$/.test(c) ? c.toUpperCase() : (() => { throw new Error("Bad colour " + c); })(),
  series: s => {
    if (s.labels.length !== s.values.length) throw new Error(`${s.name}: ${s.labels.length} labels vs ${s.values.length} values`);
    return { ...s, values: s.values.map(v => v === null ? null : safe.num(v)) };
  },
};
slide.addChart(pptx.ChartType.bar, data.map(safe.series), { chartColors: colors.map(safe.hex) });
```

Throwing early in the generator produces a stack trace that names the builder; a repair prompt names nothing.

### Rendering differences you cannot fix

PowerPoint, LibreOffice, Keynote and Google Slides differ on text autofit, chart label placement, shadows and some line dashes. Decide which viewer is the reference (usually PowerPoint for Windows, because that is what management uses) and test there. Convert with LibreOffice headless in CI only to catch structural errors, not to judge appearance.

> **Warning:** Do not click "Repair" and send the repaired file. Repair silently drops the offending element, so a chart or hyperlink vanishes without a trace. Fix the generator, regenerate, and confirm the prompt is gone.

### Try It Yourself

```js
// A deck built through defensive wrappers; try breaking the inputs and watch the errors fire before writeFile
const safe = {
  text: v => (v === null || v === undefined) ? "" : String(v),
  num: v => Number.isFinite(v) ? v : 0,
  hex: c => { if (!/^[0-9A-Fa-f]{6}$/.test(c)) throw new Error("Bad colour " + c); return c.toUpperCase(); },
  series: s => { if (s.labels.length !== s.values.length) throw new Error(`${s.name}: label/value length mismatch`); return { ...s, values: s.values.map(v => v === null ? null : safe.num(v)) }; },
  link: (n, total) => { if (n < 1 || n > total) throw new Error(`Slide link ${n} outside 1..${total}`); return { slide: n }; },
};

const input = {
  title: "Quality by state",
  colour: "1f3a5f",                                  // try "#1f3a5f" or "1f3" to see the error
  series: { name: "Errors", labels: ["TX", "FL", "CA"], values: [9, "14", null] },   // "14" is coerced, null kept as gap
  cells: [["TX", 412, 9], ["FL", 388, null]],        // null becomes ""
};

const pptx = new PptxGenJS();
const s1 = pptx.addSlide(), s2 = pptx.addSlide();
const total = 2;
s1.addText(safe.text(input.title), { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 24, bold: true, color: safe.hex(input.colour) });
s1.addChart(pptx.ChartType.bar, [safe.series({ ...input.series, values: input.series.values.map(v => typeof v === "string" ? Number(v) : v) })],
  { x: 0.5, y: 1.2, w: 9, h: 3.5, chartColors: [safe.hex(input.colour)], displayBlanksAs: "gap" });
s1.addText("Detail", { x: 8, y: 5, w: 1.5, h: 0.4, fontSize: 11, hyperlink: safe.link(2, total) });
s2.addTable(input.cells.map(row => row.map(safe.text)), { x: 0.5, y: 1, w: 6, fontSize: 12, border: { type: "solid", pt: 0.5, color: "D5DBDB" } });
console.log("all inputs passed the guards");
pptx.writeFile({ fileName: "defensive.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. A deck opens in LibreOffice but PowerPoint asks to repair it. What is the likely cause?
- [ ] The ZIP is corrupt
- [x] An XML part violates the schema and LibreOffice is more tolerant
- [ ] The file is too large
> Unzip the deck and inspect the slide or chart XML; binary-search the builders.

2. Can PptxGenJS embed a font file in the deck?
- [ ] Yes, with `embedFont`
- [x] No; it writes font names only, and embedding is done afterwards in PowerPoint
- [ ] Only in Node
> Use fonts the client has, or embed via File → Options → Save in PowerPoint.

3. Why should you not click Repair and send the result?
- [x] Repair silently drops the offending element, so content disappears
- [ ] Repair changes the theme
- [ ] Repair is only available on Mac
> Fix the generator and regenerate.

### Exercises

1. **Find the bug** — This call triggers a repair prompt. Why?
```js
slide.addChart(pptx.ChartType.line, [{ name: "TAT", labels: ["W1", "W2", "W3"], values: ["1.9", "1.7"] }], { dataLabelPosition: "outEnd", showValue: true });
```
<details><summary>Solution</summary>

Three problems: `values` are strings, `labels` has three entries but `values` two, and `outEnd` is not a valid data label position for a line chart (use `t`, `b`, `l`, `r` or `ctr`). Coerce with `Number`, align the arrays, and use a valid position.

</details>

2. **Font audit** — Write a function that walks a list of text options objects and reports every `fontFace` not in an allowed list.
<details><summary>Solution</summary>

```js
const ALLOWED = new Set(["Calibri", "Calibri Light", "Arial", "Segoe UI"]);
function auditFonts(optionObjects) {
  const bad = optionObjects.map(o => o.fontFace).filter(f => f && !ALLOWED.has(f));
  return [...new Set(bad)];
}
console.log(auditFonts([{ fontFace: "Calibri" }, { fontFace: "Gotham" }, {}]));   // ["Gotham"]
```

</details>

### Interview Questions

**Q: PowerPoint asks to repair a generated deck. Walk me through how you find the cause.**
I confirm it is a schema problem, not corruption, by opening the same file in LibreOffice; if that works, some XML part is invalid. Then I bisect: regenerate with builders disabled one at a time until the prompt disappears, which usually isolates one slide type. I unzip the deck, open that slide's XML or its chart XML, and compare it with the XML PowerPoint writes for the same feature, or run it through the Open XML SDK validator which names the element. The usual suspects are chart data with strings or mismatched lengths, an invalid data label position, an internal hyperlink past the last slide, or an empty text node. I fix the generator, add a guard so the same input throws before rendering, and never ship a repaired file.

**Q: How do you deal with fonts when the client's brand font is not on every machine?**
I explain the constraint: the file stores font names, not font files, so a machine without the font substitutes and layouts shift. Options in order of preference: use the brand's approved fallback that ships with Office; embed the font once in PowerPoint through File → Options → Save if the licence allows embedding; or, for decks that are only viewed, deliver a PDF alongside. Whatever is chosen goes into `pptx.theme` so most text inherits it, and I test the deck on a clean Windows machine with only Office installed.

**Q: What image problems are specific to generated decks rather than hand-made ones?**
Encoding rather than content: base64 without the MIME prefix or with the wrong type, CMYK JPEGs straight from print artwork, EXIF-rotated phone photos, SVGs that use filters, and URL paths that worked on the developer's machine but not on the server or behind CORS. Hand-made decks avoid these because PowerPoint normalises on insert. My fix is a single `loadImage` helper that converts everything to sRGB PNG or JPEG with baked-in orientation and returns a prefixed base64 string, so every builder receives an image PowerPoint is guaranteed to accept.

## Comparison with python-pptx

Both libraries write Office Open XML presentations, and both are free. They differ in language, in whether they can read existing files, and in how they think about layouts. Choosing the wrong one costs weeks, because the gaps are not the kind that a helper function papers over. This chapter maps the two so that the choice is deliberate.

### The one-line summary

PptxGenJS **creates** decks from nothing, in Node or the browser, with masters defined in code and a rich chart API. python-pptx **opens and edits** decks, in Python only, using the layouts and placeholders of a template file the client already has.

### Feature map

| Capability | PptxGenJS 3.x | python-pptx 0.6 / 1.0 |
|---|---|---|
| Open an existing `.pptx` and modify it | no (write-only) | yes: `Presentation("template.pptx")` |
| Use a client's `.potx`/`.pptx` template layouts | re-create in `defineSlideMaster` | native: `prs.slide_layouts[i]` |
| Runs in the browser | yes | no |
| Runs server-side | Node | Python |
| Units | inches (numbers), percent strings | `Inches()`, `Pt()`, `Emu()`, `Cm()` helpers |
| Text runs, bullets, fonts | yes | yes, via `text_frame.paragraphs[].runs[]` |
| Tables with auto-paging | `autoPage` | no; you split rows yourself |
| Charts: bar/line/pie/area/scatter/bubble/radar/doughnut | yes | yes, via `chart_data` classes |
| Combo charts and secondary axes | yes (`addChart([..])`) | not in the API; requires XML editing |
| Speaker notes | `addNotes` | `slide.notes_slide.notes_text_frame` |
| Hyperlinks (external and to slides) | yes | external yes; internal via `click_action.target_slide` |
| Video | `addMedia` | `shapes.add_movie` |
| Read text out of a deck (extraction, QA) | no | yes |
| Delete or reorder slides | n/a (build in order) | possible with XML list manipulation (`prs.slides._sldIdLst`) |

### The same slide in both

PptxGenJS:

```js
const pptx = new PptxGenJS();
const s = pptx.addSlide({ masterName: "BRAND_CONTENT" });
s.addText("Volume by state", { placeholder: "title" });
s.addChart(pptx.ChartType.bar, [{ name: "Files", labels: ["TX", "FL", "CA"], values: [412, 388, 301] }],
  { x: 0.5, y: 1.3, w: 9, h: 3.6, chartColors: ["1F3A5F"], valAxisLabelFormatCode: "#,##0" });
await pptx.writeFile({ fileName: "volume.pptx" });
```

python-pptx:

```python
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE
from pptx.util import Inches
from pptx.dml.color import RGBColor

prs = Presentation("brand_template.pptx")            # client's real template
layout = next(l for l in prs.slide_layouts if l.name == "Title and Content")
slide = prs.slides.add_slide(layout)
slide.shapes.title.text = "Volume by state"
data = CategoryChartData(); data.categories = ["TX", "FL", "CA"]; data.add_series("Files", (412, 388, 301))
chart = slide.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(0.5), Inches(1.3), Inches(9), Inches(3.6), data).chart
chart.plots[0].series[0].format.fill.solid(); chart.plots[0].series[0].format.fill.fore_color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
chart.value_axis.tick_labels.number_format = "#,##0"; chart.value_axis.tick_labels.number_format_is_linked = False
prs.save("volume.pptx")
```

The difference in shape is the point. PptxGenJS is declarative: one call with an options object. python-pptx exposes the object model, so styling is several statements walking `series.format.fill`, but it started from the client's actual template and inherited its theme, fonts and footers for free.

### When to choose which

- **Client template must be used as-is**: python-pptx. Re-creating a 12-layout corporate master in `defineSlideMaster` is possible but the result is a copy, and any later change to the client template must be re-copied.
- **Web app or browser "Download deck" button**: PptxGenJS; python-pptx cannot run in the browser.
- **Node service alongside a JavaScript stack**: PptxGenJS, to avoid a second runtime.
- **Combo charts, secondary axes, auto-paged tables**: PptxGenJS out of the box; in python-pptx these mean editing chart XML with lxml.
- **Reading, auditing or bulk-editing existing decks** (replace a logo on 300 decks, extract every title, translate text): python-pptx; PptxGenJS cannot read a file.
- **Data pipeline already in pandas**: python-pptx keeps everything in one language and one process.
- **Both** is common: python-pptx to fill a template deck the client owns, PptxGenJS for the self-service web tool.

### Portability of skills

The concepts transfer because the file format is the same. Inches and EMU, placeholders on layouts, the difference between a run and a paragraph, chart series and categories, notes slides, and the repair-prompt discipline all apply to both. Someone who has generated decks in one library reads the other's documentation in an afternoon; what does not transfer is the API surface, which is why interviewers ask you to sketch the same slide in both.

> **Interview note:** Have a crisp answer to "why not just use python-pptx for everything?": it cannot run in the browser, it has no combo-chart or auto-paging API, and styling from scratch is verbose; and to the reverse question: PptxGenJS cannot open or edit an existing deck, so template-based work and any post-processing belong to python-pptx.

### Try It Yourself

```js
// Same data, PptxGenJS side. Compare the length of this with the python-pptx version in the chapter body.
const data = [{ name: "Files", labels: ["TX", "FL", "CA"], values: [412, 388, 301] }];
const pptx = new PptxGenJS();
const s = pptx.addSlide();
s.addText("Volume by state", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 24, bold: true, color: "1F3A5F" });
s.addChart(pptx.ChartType.bar, data, { x: 0.5, y: 1.3, w: 9, h: 3.6, barDir: "col", chartColors: ["1F3A5F"], valAxisLabelFormatCode: "#,##0", showValue: true, dataLabelFormatCode: "#,##0" });
s.addNotes("Equivalent python-pptx: Presentation('brand_template.pptx') + add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, ...)");
console.log("PptxGenJS: 1 addChart call with an options object; python-pptx: chart_data + add_chart + per-series formatting statements");
pptx.writeFile({ fileName: "compare.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. Which library can open an existing deck and change a title?
- [ ] PptxGenJS
- [x] python-pptx
- [ ] Both
> PptxGenJS is write-only; python-pptx loads and saves existing files.

2. Which library draws a bar-plus-line chart with a secondary axis without XML editing?
- [x] PptxGenJS
- [ ] python-pptx
- [ ] Neither
> python-pptx has no combo chart API; PptxGenJS accepts an array of chart types.

3. A client sends a `.potx` and wants decks that use its exact layouts. What is the natural choice?
- [ ] PptxGenJS with `defineSlideMaster`
- [x] python-pptx loading the template and using `slide_layouts`
- [ ] Either, identically
> python-pptx inherits the theme, fonts and footers directly from the template file.

### Exercises

1. **Decision table** — For each scenario, choose the library and give one reason: (a) "Export to PowerPoint" button in a React dashboard; (b) replace the legal footer on 240 archived decks; (c) weekly deck from a pandas DataFrame using the client's template.
<details><summary>Solution</summary>

(a) PptxGenJS: runs in the browser, no server round-trip. (b) python-pptx: it must open existing files, which PptxGenJS cannot. (c) python-pptx: the data is already in Python and the template's layouts can be used directly.

</details>

2. **Translate** — Write the python-pptx equivalent of `slide.addNotes("Source: production_W11.csv")`.
<details><summary>Solution</summary>

```python
slide.notes_slide.notes_text_frame.text = "Source: production_W11.csv"
```

</details>

### Interview Questions

**Q: Compare PptxGenJS and python-pptx and say when you would use each.**
PptxGenJS is a write-only generator for Node and the browser with a declarative API: masters defined in code, one-call charts including combo charts with secondary axes, tables that auto-page, and output as a file, buffer or blob. python-pptx is a Python object model that opens existing files, so it can use a client's template layouts and placeholders directly, edit or extract from decks, and fits a pandas pipeline; but it cannot run in a browser, has no combo chart or auto-paging, and styling from scratch is verbose. I use PptxGenJS for web-app downloads and Node services, python-pptx for template-driven decks and bulk editing, and sometimes both in one project.

**Q: A stakeholder asks why the generated deck does not look exactly like the corporate template even though you copied the colours and fonts.**
Because PptxGenJS re-creates the master rather than loading the template, so anything I did not explicitly copy, such as a theme effect, a gradient in the title layout or the footer placeholder positions, is absent, and any later change to the template will not flow through. If fidelity to the real template is the requirement, I switch the generator to python-pptx and fill the template's layouts, or I generate the content slides with PptxGenJS and have a python-pptx step copy them into the template deck. Either way I state the trade-off before the first delivery instead of after.

**Q: What concepts transfer between the two libraries and what does not?**
The OOXML model transfers completely: slides, layouts and masters, placeholders, runs and paragraphs, chart series and categories, notes slides, EMU units and the reasons a file triggers a repair prompt. The API shape does not: PptxGenJS is one call with an options object; python-pptx walks objects and sets properties. Performance characteristics also differ, since python-pptx keeps an lxml tree of the whole deck and PptxGenJS builds strings, so very large edits in python-pptx are memory-heavy while PptxGenJS is limited mostly by media size.

## PptxGenJS interview questions

This chapter is preparation for the interview itself. Questions about PptxGenJS come up in three kinds of role: document-automation or reporting engineer, full-stack developer on a product with an "Export to PowerPoint" feature, and analyst roles where the interviewer wants to know whether your automation claims are real. The questions cluster into predictable groups, and the best answers combine a correct API fact with a story from a real deck.

### What interviewers probe

| Theme | Typical question | What a strong answer contains |
|---|---|---|
| Fundamentals | "How do you create a slide with a title and a chart?" | `addSlide`, `addText`, `addChart(pptx.ChartType.bar, data, opts)`, units in inches, `writeFile` returns a promise |
| Architecture | "How would you structure a weekly report generator?" | loader → validated model → renderer; builders; tests on the model; provenance |
| Branding | "How do you keep decks on-brand?" | `defineSlideMaster` with static objects and placeholders, `pptx.theme`, a palette module |
| Charts | "Two axes?" "Colours per point?" | combo array with `secondaryValAxis`, `valAxes`; per-series vs per-point `chartColors` |
| Environments | "Node vs browser?" "How do you serve it from an API?" | `path` vs `data`, bundle vs min, `write({ outputType })`, workers, CORS |
| Failure modes | "PowerPoint wants to repair the file. Now what?" | bisect, unzip, compare XML, guards; never ship repaired |
| Trade-offs | "Why not python-pptx?" | read vs write, browser, combo charts, templates |
| Judgement | "When is a deck the wrong output?" | audience, editability, archive; produce PDF or Excel from the same model |

### Answer structure

Use three beats: the fact, the reason, the example. "Slide numbers go on the master (fact) because they must be identical and update on reorder (reason); in the weekly deck the master defines `slideNumber` at the bottom right and no builder touches it (example)." Answers that stop at the fact sound memorised; answers that start with the story sound unstructured.

### Live-coding tasks that appear

- Build a deck from an array of `{ title, bullets }` objects. Expect follow-ups on chunking bullets beyond one slide and on a linked agenda.
- Add a bar chart from a JSON array and colour bars above a threshold differently. The trick: bar colours are per series, so split the data into two series ("within target", "above target") with `null` or `0` in the other, and stack or cluster them.
- Write the Express handler that returns a deck. Expect MIME type and `Content-Disposition`.
- Explain why `addText("x", { x: "50%", w: 4 })` is centred at the left edge, not centred as a box. `x` is the left edge; centring needs `x: "50%"` minus half the width, or `align: "center"` inside a full-width box.

### Short-answer drill

```text
Default layout and size?                 LAYOUT_16x9, 10 x 5.625 in
EMU per inch?                            914,400
Set theme fonts?                         pptx.theme = { headFontFace, bodyFontFace }
Slide background image?                  slide.background = { path | data }
Add a hidden appendix slide?             slide.hidden = true
Link to slide 3?                         hyperlink: { slide: 3 }
Repeat table header across pages?        autoPage: true, autoPageRepeatHeader: true
Deck as a Node Buffer?                   await pptx.write({ outputType: "nodebuffer" })
Compressed output?                       writeFile({ fileName, compression: true })
Can PptxGenJS open an existing pptx?     No. Use python-pptx or Open XML SDK.
Combo chart?                             addChart([{ type, data, options }, ...], { valAxes: [...], catAxes: [...] })
Percent strings valid?                   Yes for x, y, w, h, relative to the slide
```

### Portfolio evidence

Bring a repository, not a description. A convincing one has a `README` with a screenshot of the generated deck, a fixture CSV, a test that builds the deck and asserts slide count and size, and a short note on how the file is delivered. For Fiverr-style work, an anonymised sample deck with the client's data replaced by fixtures shows both the output quality and your discretion.

> **Tip:** When you do not know an option name, say how you would find out: the TypeScript definitions in `node_modules/pptxgenjs/types/index.d.ts` list every option with a comment, and the demo deck in the repository exercises each feature. Interviewers value that more than a guessed name.

### Try It Yourself

```js
// Live-coding task: colour bars above a threshold differently (bar colours are per series, so use two series)
const data = [{ state: "TX", rate: 2.2 }, { state: "FL", rate: 3.6 }, { state: "CA", rate: 1.3 }, { state: "AZ", rate: 3.4 }, { state: "WY", rate: 0 }];
const THRESHOLD = 3.0;
const labels = data.map(d => d.state);
const within = { name: "Within target", labels, values: data.map(d => d.rate <= THRESHOLD ? d.rate : 0) };
const above  = { name: "Above target",  labels, values: data.map(d => d.rate >  THRESHOLD ? d.rate : 0) };

const pptx = new PptxGenJS();
const s = pptx.addSlide();
s.addText(`Error rate by state (target ${THRESHOLD}%)`, { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 24, bold: true, color: "1F3A5F" });
s.addChart(pptx.ChartType.bar, [within, above], {
  x: 0.5, y: 1.2, w: 9, h: 3.8, barDir: "col", barGrouping: "stacked", chartColors: ["1ABC9C", "C0392B"],
  valAxisMinVal: 0, valAxisMaxVal: 5, valAxisLabelFormatCode: "0.0", showValue: true, dataLabelFormatCode: "0.0;;", dataLabelPosition: "outEnd",
  showLegend: true, legendPos: "b",
});
s.addShape("line", { x: 0.5, y: 5.05, w: 9, h: 0, line: { color: "7F8C8D", width: 0.5, dashType: "dash" } });
s.addNotes("Two stacked series with zeros in the other series; the ';;' in the label format hides zero labels.");
pptx.writeFile({ fileName: "interview-threshold.pptx" }).then(f => console.log("saved", f));
```

### Quiz

1. An interviewer asks how to colour individual bars in a single-series bar chart. What is the honest answer?
- [ ] `chartColors` applies per bar
- [x] Bar colours are per series, so split the data into two series (within / above threshold)
- [ ] It is impossible in PowerPoint
> Pie and doughnut are per point; bar, line and area are per series.

2. Where do you look up an option name you have forgotten?
- [x] The TypeScript definitions shipped with the package and the demo deck
- [ ] The PowerPoint help menu
- [ ] The generated XML
> `types/index.d.ts` documents every option with comments.

3. What is the best structure for an interview answer?
- [ ] A list of every option you know
- [x] Fact, reason, then a concrete example from a real deck
- [ ] The story first, then the API
> Facts alone sound memorised; stories alone sound unstructured.

### Exercises

1. **Two-minute pitch** — Write a 100-word answer to "Tell me about a PptxGenJS project" using fact, reason, example.
<details><summary>Solution</summary>

I built a Node job that turns the weekly title-production extract into a branded PowerPoint every Monday. The data is validated and derived into a model with unit tests, then rendered through small builders onto a master that carries the logo, footer and slide numbers. The deck has a KPI summary, a combo chart with a secondary axis for error rate, an auto-paged state table with RAG colours and an exceptions slide that only appears when needed. It is checked by a size window and slide-count assertion, delivered by email, and every deck records its data source and generator version in the notes.

</details>

2. **Whiteboard task** — Sketch `bulletsToSlides(items, perSlide)` that returns the number of slides created and links each slide back to an agenda.
<details><summary>Solution</summary>

```js
function bulletsToSlides(pptx, items, perSlide = 6) {
  const agenda = pptx.addSlide();
  const pages = Math.ceil(items.length / perSlide);
  for (let p = 0; p < pages; p++) {
    const s = pptx.addSlide();
    s.addText(items.slice(p * perSlide, (p + 1) * perSlide).map(t => ({ text: t, options: { bullet: true } })), { x: 0.5, y: 1, w: 9, h: 4, fontSize: 16 });
    s.addText("Agenda", { x: 8, y: 5.1, w: 1.5, h: 0.3, fontSize: 10, hyperlink: { slide: 1 } });
    agenda.addText(`Part ${p + 1}`, { x: 0.5, y: 0.8 + p * 0.5, w: 4, h: 0.4, fontSize: 14, hyperlink: { slide: p + 2 } });
  }
  return pages;
}
```

</details>

### Interview Questions

**Q: What is PptxGenJS and what problem does it solve?**
It is an open-source JavaScript library that generates PowerPoint files, Office Open XML `.pptx`, from code, in Node.js and in the browser, with no PowerPoint installation. It solves the "someone rebuilds the same deck by hand every week" problem: the deck becomes a function of data, so it is produced on a schedule or on a button click, consistently branded, and auditable. In my work it replaced a manual Monday routine with a job that reads an extract and emails a deck, and it powers "Export to PowerPoint" in dashboards where the user expects a file they can present and edit.

**Q: Describe the object model: what are the main methods and how do positions work?**
`new PptxGenJS()` is the presentation; `pptx.layout` sets the slide size; `defineSlideMaster` declares layouts with static objects and placeholders; `addSlide` returns a slide; the slide has `addText`, `addShape`, `addImage`, `addTable`, `addChart`, `addMedia`, `addNotes`, plus properties `background`, `hidden` and `slideNumber`. Positions are `x, y, w, h` in inches from the top left, or percent strings relative to the slide; internally they become EMU at 914,400 per inch. Output is `writeFile` for a file or download, or `write({ outputType })` for a buffer, blob or base64 string.

**Q: What are the limits of PptxGenJS you warn stakeholders about up front?**
It cannot open or edit an existing deck, so post-processing and template fidelity need python-pptx or manual work; it cannot embed fonts; it does not measure text, so overflow must be estimated; bar chart colours are per series, not per bar; theme colours are not exposed, only theme fonts; and rendering differs between PowerPoint, LibreOffice and Google Slides, so we agree on PowerPoint for Windows as the reference. None of these blocked a project I have done, but each shaped the design, for example splitting series for conditional colours and putting a height estimator in the text builder.

**Q: How would you test a deck generator?**
Three layers. Unit tests on the model with fixture data assert totals, rates, rankings and which rows become exceptions. Generation tests build the deck from a fixture, assert `pptx.slides.length`, write to a temp path and check the size window, then open the ZIP with JSZip and assert expected parts exist, such as `ppt/charts/chart1.xml` and the notes slides. A smoke test converts the file to PDF with LibreOffice headless in CI to prove it opens, and a manual check in PowerPoint on a clean Windows machine before the first scheduled run and after any layout change.

**Q: What would you do differently on your next deck generator?**
Start with the model and its tests before any slide, because the numbers were where all the real bugs lived; put the height estimator and the image loader in from day one instead of after the first overflow and the first repair prompt; generate a PDF twin from the same model so the archive does not depend on a viewer; and agree thresholds, fonts and the reference viewer with the client in writing before the first delivery, since those were the three conversations that cost the most time afterwards.
