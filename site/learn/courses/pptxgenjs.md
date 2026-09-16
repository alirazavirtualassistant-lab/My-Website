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

