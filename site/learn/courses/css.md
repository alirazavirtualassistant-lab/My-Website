---
id: css
title: CSS
icon: 🎨
track: Programming
color: #1572B6
runner: html
tagline: Style web pages, EPUB ebooks and print-ready PDFs.
description: CSS from selectors to expert layout: the box model, colours and typography, Flexbox, Grid, responsive design, transitions and animations, custom properties, print stylesheets and paged media for WeasyPrint/EPUB, plus the specificity and cascade questions interviewers love.
---

# LEVEL: Beginner

## Introduction & three ways to add CSS

CSS (Cascading Style Sheets) is the language that decides how HTML looks: fonts, colours, spacing, layout, and, in print, page size and page numbers. HTML says *what* something is; CSS says *how it appears*. The same HTML report can become a website, an A4 PDF from WeasyPrint and a reflowable EPUB simply by swapping stylesheets. That separation is the whole idea, and it is why you never put looks into the HTML.

### Anatomy of a rule

```css
p {
  color: #333333;
  line-height: 1.5;
}
```

`p` is the **selector**: which elements this applies to. Inside the braces is the **declaration block**, a list of **declarations**, each a **property** (`color`), a colon, a **value** (`#333333`) and a semicolon. The semicolon after the last declaration is optional but always write it, so the next line you add does not silently break the rule.

Comments go between `/*` and `*/`. There is no `//` comment in CSS; a stray `//` will swallow the rest of the line's rule in confusing ways.

### Way 1: an external stylesheet

The professional default. Write CSS in `styles.css` and link it from the head of every page:

```html
<head>
  <meta charset="UTF-8">
  <title>Weekly Production Report</title>
  <link rel="stylesheet" href="styles.css">
</head>
```

One file styles a whole site, the browser caches it, and designers and developers can work on it independently. WeasyPrint reads `<link rel="stylesheet">` too, resolving the path relative to the HTML file (or the `base_url` you pass).

### Way 2: an internal stylesheet

A `<style>` element in the `<head>`. Right for single-file deliverables: a report template rendered by WeasyPrint, an HTML file emailed to a client, a demo like the Try It blocks in this course.

```html
<head>
  <style>
    body { font-family: Georgia, serif; }
    h1   { color: #1572B6; }
  </style>
</head>
```

The rules are identical to an external file; only the container changes.

### Way 3: inline styles

The `style` attribute on a single element:

```html
<p style="color: red; font-weight: bold;">Overdue</p>
```

Inline styles win over almost everything else in the cascade and cannot be reused, so they are a last resort. Two legitimate uses: HTML email, where clients strip stylesheets, and values generated per element from data, such as a bar's width in a chart (`style="width: 63%"`).

| Method | Reusable | Cached | Beats other methods | Use for |
|---|---|---|---|---|
| External `<link>` | Whole site | Yes | Lowest | Everything by default |
| Internal `<style>` | One page | No | Equal to external (later wins) | Single-file templates, demos |
| Inline `style=""` | One element | No | Highest (except `!important`) | Email, data-driven values |

### What the browser does with CSS

The browser parses your stylesheet into the CSSOM, matches every rule against every element in the DOM, resolves conflicts through the **cascade** (which you will study properly in a later chapter), computes a final value for every property of every element, and then lays out and paints. Two things follow: order matters when two rules tie, because the later one wins, and you can override any built-in browser style, since the browser's own stylesheet has the lowest priority.

```css
/* The browser gives h1 a large bold font; this overrides only the colour and size */
h1 { color: #1572B6; font-size: 2rem; }
```

### Your first stylesheet

Save this as `styles.css` next to an HTML file that links it, and open the HTML in the browser:

```css
body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 2rem;
  color: #222;
}
h1 { color: #1572B6; }
p  { max-width: 60ch; line-height: 1.6; }
```

`60ch` limits paragraphs to about sixty characters, which is the comfortable reading measure used in books; you have just applied a typographic rule that most websites ignore.

> **Tip:** If a change does not show up, the browser is probably serving a cached copy of the stylesheet. Press Ctrl+F5 (hard refresh) or open DevTools and tick "Disable cache" in the Network panel. For WeasyPrint, there is no cache: rerun the command.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Three ways to add CSS</title>
  <style>
    /* Internal stylesheet */
    body { font-family: Arial, Helvetica, sans-serif; margin: 2rem; color: #222; }
    h1   { color: #1572B6; }
    p    { max-width: 60ch; line-height: 1.6; }
    .status { font-weight: bold; }
  </style>
</head>
<body>
  <h1>Weekly Production Report</h1>
  <p>This paragraph is styled by the internal stylesheet: Arial, a 60-character measure and relaxed line height.</p>
  <p class="status">Status: on track</p>
  <p class="status" style="color: #c00;">Status: overdue (inline style overrides the colour)</p>
  <p>Edit the CSS above and press Run.</p>
</body>
</html>
```

### Quiz

1. In `h1 { color: red; }`, what is `color: red`?
- [ ] A selector
- [x] A declaration
- [ ] A rule set
> A declaration is a property–value pair; the selector plus block is the rule.

2. Which method is cached by the browser across pages?
- [x] External stylesheet
- [ ] Internal `<style>`
- [ ] Inline `style` attribute
> Only a separate file can be cached and reused by every page.

3. Which comment syntax is valid CSS?
- [ ] `// note`
- [x] `/* note */`
- [ ] `# note`
> CSS has only block comments.

4. Where should a `<link rel="stylesheet">` go?
- [ ] End of body
- [x] Inside `<head>`
- [ ] Before the doctype
> Loading styles in the head avoids a flash of unstyled content.

### Exercises

1. **Link it** — Write the HTML head that links `report.css` and set the body font in that file to Georgia with a fallback.
<details><summary>Solution</summary>

```html
<head>
  <meta charset="UTF-8">
  <title>Report</title>
  <link rel="stylesheet" href="report.css">
</head>
```

```css
/* report.css */
body { font-family: Georgia, "Times New Roman", serif; }
```

</details>

2. **Fix the rule** — What is wrong with `p { color: #333 line-height: 1.5 }`?
<details><summary>Solution</summary>

The semicolon between the two declarations is missing, so the browser reads `#333 line-height: 1.5` as one invalid value and drops the whole `color` declaration. Correct: `p { color: #333; line-height: 1.5; }`.

</details>

### Interview Questions

**Q: What are the three ways to add CSS and when is each appropriate?**
External stylesheets linked from the head are the default: reusable across pages, cacheable and easy to maintain. Internal `<style>` blocks suit single-file outputs such as a WeasyPrint report template, an email-attached HTML file or a prototype. Inline `style` attributes should be reserved for HTML email, where clients strip stylesheets, and for values computed per element from data, like chart bar widths. The trade-off is reuse and caching versus self-containment and precedence; a strong answer notes that inline styles are also a maintenance and CSP problem, since a strict `style-src` policy blocks them.

**Q: Why does "separation of concerns" matter between HTML and CSS?**
HTML carries structure and meaning that screen readers, search engines, PDF engines and e-readers depend on; CSS carries presentation, which differs per medium. Keeping them apart lets one HTML document render as a website, an A4 PDF and a reflowable EPUB by swapping stylesheets, which is exactly how my report pipeline works. It also means a redesign touches CSS only, and content authors cannot break the layout. The exception that proves the rule is HTML email, where the lack of stylesheet support forces presentation back into the markup.

**Q: What is the CSSOM?**
The CSS Object Model is the tree of parsed stylesheets and rules that the browser builds alongside the DOM, and the API JavaScript uses to read and change styles (`document.styleSheets`, `getComputedStyle`, `element.style`). Rendering needs both trees: the browser matches CSSOM rules against DOM elements to compute styles, then lays out and paints. Because the CSSOM must be complete before rendering, stylesheets are render-blocking, which is why they belong in the head and why large stylesheets delay first paint.

## Selectors

A selector chooses which elements a rule applies to. Beginners know three or four; professionals use twenty and combine them, because precise selectors mean fewer classes in the HTML and fewer overrides in the CSS. Everything in this chapter also works in JavaScript's `querySelector`, BeautifulSoup's `select` and WeasyPrint, so it is a skill that pays in three languages.

### The basic selectors

| Selector | Matches | Example |
|---|---|---|
| `*` | Every element | `* { box-sizing: border-box; }` |
| `p` | Elements by tag name | `td { padding: 4px; }` |
| `.warn` | Elements with `class="warn"` | `.kpi { font-weight: bold; }` |
| `#summary` | The element with `id="summary"` | `#toc { columns: 2; }` |
| `[href]` | Elements with that attribute | `a[download] { … }` |
| `[type="date"]` | Attribute equals value | `input[type="date"]` |

```css
.kpi        { font-size: 2rem; }
#summary    { border-top: 2px solid #1572B6; }
a[download] { font-weight: bold; }
```

Classes are your workhorse. An element can carry several (`class="kpi kpi--bad"`), and one class can style hundreds of elements. Ids are unique per page, which makes them useful for anchors and labels but too rigid for styling; prefer classes.

### Attribute selectors in detail

| Syntax | Meaning | Example |
|---|---|---|
| `[attr^="x"]` | Starts with | `a[href^="http"]` external links |
| `[attr$="x"]` | Ends with | `a[href$=".pdf"]` PDF links |
| `[attr*="x"]` | Contains | `img[src*="chart"]` |
| `[attr~="x"]` | Word in space-separated list | `[class~="kpi"]` same as `.kpi` |
| `[attr|="x"]` | `x` or starts with `x-` | `[lang|="en"]` matches `en-US` |

```css
a[href$=".pdf"]::after { content: " (PDF)"; }
a[href^="mailto:"]     { color: #1572B6; }
```

### Grouping

A comma applies one block to several selectors:

```css
h1, h2, h3 { font-family: Montserrat, Arial, sans-serif; color: #1572B6; }
```

### Combinators: selecting by relationship

| Combinator | Written | Matches |
|---|---|---|
| Descendant | `A B` | Any `B` inside `A`, at any depth |
| Child | `A > B` | `B` whose direct parent is `A` |
| Next sibling | `A + B` | The `B` immediately after `A` |
| Subsequent sibling | `A ~ B` | Any `B` after `A` with the same parent |

```css
nav a          { text-decoration: none; }     /* every link anywhere inside nav */
nav > ul > li  { display: inline-block; }     /* only the top-level items */
h2 + p         { margin-top: 0; }             /* the paragraph right after a heading */
h2 ~ p         { color: #444; }               /* all following paragraphs in that section */
```

The child combinator matters in nested lists: `ul li` styles every level, while `ul > li` styles only the first. Descendant selectors are the most common source of "why is this styled?" surprises because they reach deeper than you expect.

### Combining selectors on one element

Write selectors with no space between them to require all conditions on the same element:

```css
td.num        { text-align: right; }     /* td that has class num */
tr.total td   { font-weight: bold; }     /* every td inside a tr with class total */
input[type="checkbox"]:checked + label { font-weight: bold; }
```

`td.num` (no space) is one element; `td .num` (with a space) is a `.num` inside a `td`. That single space is the most common beginner bug.

### Pseudo-classes you need today

`:hover`, `:focus`, `:first-child`, `:last-child` and `:nth-child(even)` are pseudo-classes: states or positions rather than attributes. They get a full chapter later, but zebra-striping a table is too useful to wait for:

```css
tbody tr:nth-child(even) { background: #f4f8fb; }
a:hover, a:focus         { text-decoration: underline; }
```

### Reading a selector

Read right to left, because that is how the browser matches: `nav > ul > li a` means "an `a`, inside an `li`, whose parent is a `ul`, whose parent is a `nav`". Short selectors are faster to match and easier to override; three levels is usually the practical maximum.

> **Warning:** `#id` selectors are very hard to override later because of specificity. A stylesheet full of `#sidebar .widget a` rules becomes a fight of `!important` within a month. Style with classes and keep ids for anchors, form labels and JavaScript.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Selectors</title>
<style>
  body { font-family: Arial, sans-serif; margin: 2rem; }
  nav > ul > li { display: inline-block; margin-right: 1rem; }      /* top-level only */
  nav ul ul li { display: block; font-size: .9em; }                 /* nested items */
  nav a { text-decoration: none; color: #1572B6; }
  a[href$=".pdf"]::after { content: " (PDF)"; color: #777; }
  h2 + p { margin-top: 0; font-weight: bold; }
  table { border-collapse: collapse; margin-top: 1rem; }
  td, th { border: 1px solid #ccc; padding: 4px 10px; }
  td.num { text-align: right; }
  tbody tr:nth-child(even) { background: #eef4fa; }
  tr.total td { font-weight: bold; border-top: 2px solid #1572B6; }
</style></head>
<body>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Reports</a>
        <ul><li><a href="week-37.pdf">Week 37</a></li><li><a href="week-36.pdf">Week 36</a></li></ul>
      </li>
    </ul>
  </nav>
  <h2>Orders by state</h2>
  <p>The paragraph right after the heading is bold because of h2 + p.</p>
  <p>This one is not.</p>
  <table>
    <thead><tr><th>State</th><th>Orders</th></tr></thead>
    <tbody>
      <tr><td>Texas</td><td class="num">180</td></tr>
      <tr><td>Florida</td><td class="num">122</td></tr>
      <tr><td>Wyoming</td><td class="num">41</td></tr>
      <tr class="total"><td>Total</td><td class="num">343</td></tr>
    </tbody>
  </table>
</body>
</html>
```

### Quiz

1. What does `td .num` (with a space) select?
- [ ] A `td` with class `num`
- [x] Any element with class `num` inside a `td`
- [ ] A `td` followed by `.num`
> The space is the descendant combinator; `td.num` without a space is one element.

2. Which selector matches only direct children?
- [ ] `ul li`
- [x] `ul > li`
- [ ] `ul + li`
> `>` is the child combinator; `+` is next sibling.

3. Which selector targets links to PDF files?
- [ ] `a[href^=".pdf"]`
- [x] `a[href$=".pdf"]`
- [ ] `a[href=".pdf"]`
> `$=` means "ends with"; `^=` means "starts with".

4. `h2 + p` matches…
- [x] The single `p` immediately following an `h2`
- [ ] Every `p` after any `h2`
- [ ] The `h2` before a `p`
> `+` selects the next sibling only; `~` selects all subsequent siblings.

### Exercises

1. **External links** — Style every link whose `href` starts with `http` with an arrow after it, and links starting with `mailto:` in green.
<details><summary>Solution</summary>

```css
a[href^="http"]::after { content: " ↗"; }
a[href^="mailto:"]     { color: #080; }
```

</details>

2. **First paragraph** — Make the first paragraph inside every `article` larger, without adding a class.
<details><summary>Solution</summary>

```css
article > p:first-of-type { font-size: 1.2em; }
```

`:first-child` would fail if a heading comes first; `:first-of-type` counts only paragraphs.

</details>

3. **Nested list marker** — Give only second-level list items a square bullet.
<details><summary>Solution</summary>

```css
ul > li > ul > li { list-style-type: square; }
```

</details>

### Interview Questions

**Q: How does the browser match selectors, and why does it matter?**
Browsers match selectors right to left: for `nav ul li a`, they first find every `a`, then check whether each has an `li` ancestor, then a `ul`, then a `nav`. This means the rightmost part (the key selector) determines how much work is done; `.sidebar *` or `div span` are expensive because the key is broad. In practice, selector performance rarely matters on modern engines except for very large DOMs, but the same reasoning explains why short, class-based selectors are easier to read and override. Interviewers want the right-to-left fact and a sensible "it usually does not matter" caveat.

**Q: When should you use an id selector versus a class?**
Almost never for styling. Ids are unique, so they cannot be reused, and their specificity (1,0,0) overpowers any number of classes, which makes later overrides painful and pushes teams toward `!important`. Classes compose, repeat and are easy to override in order. Ids stay valuable for fragment links, `<label for>`, ARIA relationships and `getElementById`. If I need to target a unique element in CSS I still give it a class, or use `[id="summary"]`, which has class-level specificity.

**Q: What is the difference between `ul li` and `ul > li` in a nested list?**
`ul li` matches every `li` that has any `ul` ancestor, so in a two-level list it matches both levels; `ul > li` matches only `li` elements whose direct parent is a `ul`, but since nested `li` elements also have a `ul` parent, it still matches both levels! To target only the top level you scope from a known ancestor, such as `nav > ul > li`, or exclude the nested ones with `li:not(li li)`. This trick question checks whether the candidate actually thinks about the tree rather than reciting definitions.

## Colours & backgrounds

Colour is the first thing a client notices and the first thing a brand guide dictates. CSS gives you several ways to write a colour, a set of properties for text and backgrounds, and, since 2023, colour spaces that go beyond the old sRGB limits. Get comfortable with hex and `rgb()` first; the rest builds on them.

### Ways to write a colour

| Syntax | Example | Notes |
|---|---|---|
| Named | `red`, `steelblue`, `transparent` | 148 names; fine for prototypes |
| Hex | `#1572B6`, `#fff` | Two hex digits per channel; `#fff` = `#ffffff` |
| Hex with alpha | `#1572B680` | Fourth pair is opacity (80 = 50%) |
| `rgb()` | `rgb(21 114 182)` | 0–255 per channel |
| `rgb()` with alpha | `rgb(21 114 182 / 0.5)` | Modern space-separated syntax |
| `hsl()` | `hsl(205 79% 40%)` | Hue 0–360, saturation, lightness |
| `oklch()` | `oklch(52% 0.15 245)` | Perceptually uniform; 2023+ browsers |
| `currentColor` | `border-color: currentColor` | Whatever `color` computes to |

```css
h1      { color: #1572B6; }
.badge  { background: hsl(205 79% 40%); color: #fff; }
.overlay{ background: rgb(0 0 0 / 0.4); }
```

Brand guides give you hex; use it verbatim. HSL is better when you *derive* colours: keep hue and saturation, change lightness for hover states (`hsl(205 79% 32%)`) or tints for table stripes (`hsl(205 79% 96%)`). The legacy comma syntax `rgb(21, 114, 182)` and `rgba(...)` still work everywhere, including WeasyPrint.

### Text colour and opacity

`color` sets text (and, through `currentColor`, borders and SVG icons by default). `opacity` fades the whole element including children, whereas an alpha channel in the colour fades only that colour.

```css
.muted   { color: #666; }
.disabled{ opacity: 0.5; }                 /* text, border and background all fade */
.glass   { background: rgb(255 255 255 / 0.7); }  /* only the background is translucent */
```

### Backgrounds

```css
.hero {
  background-color: #1572B6;
  background-image: url("cover.jpg");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}
```

- `background-color` is the base layer; always set it even with an image, as the fallback while the image loads (or in print, where images may be skipped).
- `background-size: cover` scales the image to fill the box, cropping; `contain` fits it inside without cropping.
- `background-position` accepts keywords, lengths or percentages.
- Several images can stack, comma-separated, first on top.

The shorthand `background: #1572B6 url("cover.jpg") no-repeat center / cover;` sets everything at once; the slash separates position from size.

### Gradients

Gradients are generated images, so they go in `background-image`:

```css
.bar   { background-image: linear-gradient(to right, #1572B6 0%, #1572B6 63%, #ddd 63%); } /* a 63% bar */
.cover { background-image: linear-gradient(135deg, #1572B6, #0b3d61); }
.spot  { background-image: radial-gradient(circle at top left, #fff, #cfe3f5); }
```

The first rule draws a progress bar with no extra markup: two hard stops at the same percentage give a crisp edge. Report dashboards use this trick for KPI bars, and WeasyPrint renders gradients correctly in PDF.

### Contrast and accessibility

Body text needs a contrast ratio of at least 4.5:1 against its background (WCAG AA), large text 3:1. `#1572B6` on white is about 5.0:1, fine for body text; `#777` on white is 4.5:1, just passing; `#999` fails. Chrome DevTools shows the ratio when you hover a colour in the Styles panel, and coolors.co or WebAIM's contrast checker do the same online. Never use colour as the only signal; pair a red status with a word or icon.

### Colour in print

Printers work in CMYK and PDF viewers vary, so pure RGB saturations shift. For WeasyPrint PDFs keep brand colours as given, avoid large dark fills (toner cost, bleed-through) and remember that `background-color` on the body is ignored by browser printing unless the user ticks "Background graphics"; WeasyPrint prints it regardless. `print-color-adjust: exact` forces backgrounds in browser print preview.

> **Tip:** Put brand colours in custom properties once (`--brand: #1572B6;`) and reference them everywhere; when a client rebrands, you change one line. The custom properties chapter covers this in depth.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Colours</title>
<style>
  body { font-family: Arial, sans-serif; margin: 2rem; }
  .swatches span { display: inline-block; width: 90px; padding: 1rem .5rem; margin: .2rem; color: #fff; text-align: center; font-size: .8rem; }
  .hero { background: #1572B6 linear-gradient(135deg, #1572B6, #0b3d61); color: #fff; padding: 2rem; border-radius: 8px; }
  .kpi { margin: 1rem 0; }
  .bar { height: 14px; border-radius: 7px; background-image: linear-gradient(to right, #1572B6 0 63%, #ddd 63%); }
  .glass { background: rgb(255 255 255 / 0.75); padding: .5rem 1rem; display: inline-block; border-radius: 4px; color: #1572B6; }
  .muted { color: #666; } .fail { color: #c00; font-weight: bold; }
</style></head>
<body>
  <div class="hero">
    <h1 style="margin:0 0 .5rem">Weekly Production Report</h1>
    <span class="glass">Translucent label over a gradient</span>
  </div>
  <div class="kpi"><p class="muted">Texas quota: 63% complete</p><div class="bar"></div></div>
  <p class="swatches">
    <span style="background:#1572B6">#1572B6</span>
    <span style="background:hsl(205 79% 32%)">hover</span>
    <span style="background:hsl(205 79% 60%)">tint</span>
    <span style="background:hsl(205 79% 90%);color:#1572B6">stripe</span>
    <span style="background:rgb(0 0 0 / .4)">40% black</span>
  </p>
  <p>Status: <span class="fail">FAILED ✗</span> (colour plus an icon, never colour alone)</p>
</body>
</html>
```

### Quiz

1. What does the fourth pair in `#1572B680` represent?
- [ ] Hue
- [x] Alpha (opacity)
- [ ] Saturation
> Eight-digit hex adds an alpha channel; `80` is about 50%.

2. What is the difference between `opacity: 0.5` and `background: rgb(0 0 0 / 0.5)`?
- [x] `opacity` fades the whole element including its text; the alpha colour fades only the background
- [ ] They are identical
- [ ] `opacity` only affects text
> Alpha in a colour is per-property; `opacity` is per-element.

3. Which `background-size` value fills the box and may crop?
- [ ] `contain`
- [x] `cover`
- [ ] `auto`
> `cover` scales to cover the area; `contain` fits entirely inside.

4. Minimum WCAG AA contrast for normal body text?
- [ ] 3:1
- [x] 4.5:1
- [ ] 10:1
> 4.5:1 for normal text, 3:1 for large text.

### Exercises

1. **Hover shade** — Given brand blue `hsl(205 79% 40%)`, write button and hover styles that darken on hover using the same hue.
<details><summary>Solution</summary>

```css
.btn       { background: hsl(205 79% 40%); color: #fff; }
.btn:hover { background: hsl(205 79% 30%); }
```

</details>

2. **Progress bar** — Draw a 45% progress bar with a single `div` and a gradient.
<details><summary>Solution</summary>

```css
.bar { height: 12px; background-image: linear-gradient(to right, #1572B6 0 45%, #e0e0e0 45%); }
```

</details>

### Interview Questions

**Q: When would you use HSL instead of hex?**
Hex is what brand guides and design tools hand you, so it is the source of truth for fixed colours. HSL shines when colours are derived: hover and active states by lowering lightness, tints for table stripes by raising it, and whole palettes by rotating hue with the same saturation and lightness so they feel related. It is also readable: `hsl(205 79% 40%)` tells me "a medium, saturated blue" while `#1572B6` tells me nothing. The trade-off is that HSL lightness is not perceptually uniform, so yellow at 50% looks far brighter than blue at 50%; `oklch()` fixes that in modern browsers, though WeasyPrint's support for new colour spaces lags.

**Q: How do you ensure colour accessibility in a report or dashboard?**
Check every text/background pair against WCAG AA ratios, 4.5:1 for body text and 3:1 for large text and UI borders, using DevTools or a contrast checker, and fix by darkening text rather than lightening backgrounds. Never rely on colour alone for meaning: pair status colours with text or icons, and use patterns or labels in charts for colour-blind readers, roughly 8% of men. Keep the palette small and consistent so meaning is learnable. For print I also test in greyscale, since many clients print dashboards on monochrome office printers.

**Q: Why might a background colour disappear when a page is printed?**
Browsers default to not printing backgrounds to save ink, controlled by the user's "Background graphics" checkbox; `print-color-adjust: exact` on the element asks the browser to keep them, and a print stylesheet can also swap backgrounds for borders. WeasyPrint prints backgrounds unconditionally, so a template that looks right in WeasyPrint may still print blank cells from a browser. For table headers I set both a background and a bottom border so the structure survives either way.

## Text & fonts (@font-face)

Typography is most of what a document is, and clients notice fonts before they notice anything else. This chapter covers the font properties, font stacks, loading brand fonts with `@font-face`, and the text properties that control alignment, spacing and decoration. Every rule here works in browsers, WeasyPrint and EPUB readers, with notes where they differ.

### The font properties

| Property | Values | Notes |
|---|---|---|
| `font-family` | Comma-separated stack | Quote names with spaces |
| `font-size` | `16px`, `1.125rem`, `12pt` | `pt` for print, `rem` for screen |
| `font-weight` | `400` normal, `700` bold, `100`–`900` | Needs the weight file to exist |
| `font-style` | `normal`, `italic`, `oblique` | |
| `line-height` | `1.5` (unitless preferred) | Unitless scales with font size |
| `font-variant-numeric` | `tabular-nums`, `oldstyle-nums` | Aligns digits in tables |
| `font` | Shorthand | `font: italic 700 16px/1.5 Georgia, serif;` |

```css
body { font: 400 16px/1.6 Georgia, "Times New Roman", serif; }
h1   { font-family: Montserrat, Arial, sans-serif; font-weight: 700; font-size: 2rem; }
td.num { font-variant-numeric: tabular-nums; }
```

### Font stacks

The browser uses the first family in the list that is installed (or loaded via `@font-face`) and falls back down the list. Always end with a generic family: `serif`, `sans-serif`, `monospace`, `cursive`, `system-ui`.

```css
/* Safe stacks that look right on Windows, macOS, Android and in PDFs */
.sans  { font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
.serif { font-family: Georgia, "Times New Roman", Times, serif; }
.mono  { font-family: Consolas, "SF Mono", Menlo, monospace; }
.ui    { font-family: system-ui, sans-serif; }   /* the OS interface font */
```

For WeasyPrint the "installed" fonts are those on the server that renders the PDF, which is usually a Linux box without Calibri or Arial. Embedding with `@font-face` is therefore not optional for print work.

### @font-face

`@font-face` registers a font file under a name you choose. One rule per weight and style.

```css
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
h1, h2 { font-family: "Montserrat", Arial, sans-serif; }
```

- WOFF2 is the web format: compressed, supported everywhere since 2016. Keep TTF/OTF for WeasyPrint and EPUB, which both accept TTF, OTF and WOFF (WeasyPrint also reads WOFF2).
- `font-display: swap` shows fallback text immediately and swaps when the font arrives; `block` hides text briefly; `optional` uses the web font only if it is cached. WeasyPrint ignores this property.
- Declare each weight you use. If you reference `font-weight: 600` without a 600 file, the browser fakes it by smearing the 400 outline ("faux bold"), which looks bad in print.
- Variable fonts pack all weights into one file: `src: url("Montserrat-VF.woff2") format("woff2-variations"); font-weight: 100 900;`.

Google Fonts gives you a ready `<link>` tag, but for client deliverables download the files: a PDF or EPUB cannot fetch from the internet, and licences for embedding differ from licences for web use (check the font's EULA; SIL Open Font License fonts are safe to embed).

### Text properties

```css
p     { text-align: justify; hyphens: auto; text-indent: 1.5em; }
h1    { text-transform: uppercase; letter-spacing: 0.05em; }
a     { text-decoration: underline; text-underline-offset: 2px; }
.lead { word-spacing: 0.1em; }
.code { white-space: pre-wrap; overflow-wrap: anywhere; }
```

| Property | Effect | Print note |
|---|---|---|
| `text-align` | `left`, `right`, `center`, `justify` | Justify only with `hyphens: auto` and `lang` set |
| `text-indent` | First-line indent | Book style: indent, no paragraph gap |
| `text-transform` | Case change without editing content | Screen readers read the original text |
| `letter-spacing` / `word-spacing` | Tracking | Use `em` so it scales |
| `text-decoration` | Underline, overline, line-through | `text-decoration-thickness` for control |
| `white-space` | `nowrap`, `pre`, `pre-wrap` | `nowrap` for table cells with dates |
| `overflow-wrap` | Break long words/URLs | Essential for tables with URLs |
| `hyphens` | `auto` uses the language dictionary | WeasyPrint hyphenates when `lang` is set |

### Sizing text well

Set the base size on `body` and everything else in `rem` or `em`, so a client's "make it bigger" is one edit. For screen, 16px base and a 1.5 line height; for print, 10–11pt with 1.3–1.4; for EPUB, no absolute size at all on body (`font-size: 1em`), because the reader controls it. A modular scale keeps headings related: 1rem, 1.25rem, 1.563rem, 1.953rem (ratio 1.25).

> **Warning:** `text-transform: uppercase` on Turkish or German text produces the wrong characters (dotless i, ß), and `letter-spacing` on lowercase body text harms readability. Uppercase is for short labels and headings only.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Text and fonts</title>
<style>
  @font-face { font-family: "Demo Serif"; src: local("Georgia"), local("Times New Roman"); }
  body { font: 400 16px/1.6 "Demo Serif", serif; margin: 2rem; max-width: 62ch; }
  h1 { font: 700 2rem/1.2 Montserrat, "Segoe UI", Arial, sans-serif; letter-spacing: -0.01em; color: #1572B6; }
  h2 { font: 600 1.25rem/1.3 "Segoe UI", Arial, sans-serif; text-transform: uppercase; letter-spacing: .08em; margin-top: 2rem; }
  p  { text-align: justify; hyphens: auto; margin: 0; }
  p + p { text-indent: 1.5em; }
  .num { font-variant-numeric: tabular-nums; font-family: Consolas, Menlo, monospace; }
  .url { overflow-wrap: anywhere; }
  a { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; color: #1572B6; }
</style></head>
<body>
  <h1>Employee Handbook</h1>
  <h2>1. Leave policy</h2>
  <p>All full-time employees accrue one and a half days of annual leave per calendar month of continuous employment, credited on the last working day of that month and recorded automatically in the human-resources system.</p>
  <p>Requests must be submitted at least ten working days in advance. Book-style typography: justified text, automatic hyphenation, and a first-line indent on paragraphs after the first, with no gap between them.</p>
  <h2>2. Figures</h2>
  <p class="num">Q1 1,113.00<br>Q2 &nbsp;&nbsp;832.50<br>Q3 &nbsp;&nbsp;&nbsp;41.25 (tabular digits line up)</p>
  <p class="url">Long link: <a href="#">https://example.com/reports/2026/week-37/production-summary-by-state-and-policy-type.pdf</a></p>
</body>
</html>
```

### Quiz

1. Why should `line-height` usually be unitless?
- [x] A unitless value scales with each element's own font size
- [ ] Units are not allowed
- [ ] It renders faster
> `line-height: 1.5` on `body` means 1.5× whatever font size each descendant has.

2. What happens if you use `font-weight: 700` but only loaded a 400 file?
- [ ] The text stays regular
- [x] The browser synthesises a fake bold
- [ ] The page fails to load
> Faux bold smears the outline; load a real 700 file.

3. Which font format should you use for web fonts today?
- [ ] TTF
- [x] WOFF2
- [ ] EOT
> WOFF2 is smallest and universally supported; TTF/OTF remain for print and EPUB.

4. What does `font-display: swap` do?
- [x] Shows fallback text immediately, then swaps to the web font
- [ ] Hides text until the font loads
- [ ] Disables the web font
> Swap avoids invisible text at the cost of a brief reflow.

### Exercises

1. **Brand font** — Register "Lato" regular (400) and bold (700) from `fonts/Lato-Regular.woff2` and `fonts/Lato-Bold.woff2`, and apply it to headings.
<details><summary>Solution</summary>

```css
@font-face { font-family: "Lato"; src: url("fonts/Lato-Regular.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Lato"; src: url("fonts/Lato-Bold.woff2") format("woff2"); font-weight: 700; font-display: swap; }
h1, h2, h3 { font-family: "Lato", Arial, sans-serif; }
```

</details>

2. **Table digits** — Make numbers in `td.amount` right-aligned with aligned digits and no wrapping.
<details><summary>Solution</summary>

```css
td.amount { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
```

</details>

### Interview Questions

**Q: How does `@font-face` work and what are the pitfalls?**
`@font-face` maps a family name plus weight and style to a font file, so later `font-family` references can use it like an installed font. Pitfalls: every weight and style needs its own declaration or the browser synthesises fake bold and italic; the file must be served with CORS headers if it lives on another origin; licences differ between web use and PDF/EPUB embedding; large files delay text rendering, which `font-display: swap` and subsetting with `pyftsubset` address; and PDF engines like WeasyPrint need TTF/OTF/WOFF files reachable from the HTML's `base_url`, never a Google Fonts link. I keep a per-client `fonts/` folder with the licence file next to the WOFF2 and TTF versions.

**Q: What is the difference between `em` and `rem` for font sizes?**
`rem` is relative to the root (`html`) font size, so `1.25rem` is the same everywhere; `em` is relative to the current element's inherited font size, so nested `em` values compound (a `1.2em` list inside a `1.2em` section becomes 1.44×). Use `rem` for font sizes and spacing that should be consistent, and `em` for values that should scale with the element's own text, such as `letter-spacing`, `padding` on a button or an icon's size. In EPUB I use `em` throughout because readers change the base size and everything should follow proportionally.

**Q: Why does justified text look bad on the web but good in books?**
Books justify with hyphenation, careful word spacing and a measure of 60–70 characters, so the "rivers" of white space stay small. Browsers historically had no hyphenation and pages have unpredictable widths, so justification produced ugly gaps, especially on narrow phones. Today `hyphens: auto` with a correct `lang` attribute, a limited measure (`max-width: 65ch`) and `text-wrap: pretty` in newer Chrome make justified web text acceptable. WeasyPrint hyphenates with language dictionaries, so for PDF handbooks I justify with hyphens on and keep it left-aligned for screens.

## Box model & units

Every element is a rectangular box, and CSS layout is the art of sizing and spacing those boxes. The **box model** defines what a box is made of; **units** define how big things are. Misunderstanding either produces the classic "why is my 100% width overflowing?" bug that every developer hits in their first week.

### The four layers

From inside out, every box has:

1. **Content**: the text or image, sized by `width` and `height`.
2. **Padding**: space inside the border, takes the background colour.
3. **Border**: the line around the padding.
4. **Margin**: transparent space outside the border, separating boxes.

```css
.card {
  width: 300px;
  padding: 16px;
  border: 2px solid #1572B6;
  margin: 24px;
}
```

In the default box model (`box-sizing: content-box`), `width` sets only the content, so this card is 300 + 32 + 4 = **336px** wide on screen, plus 48px of margin. That surprise is why nearly every stylesheet starts with:

```css
*, *::before, *::after { box-sizing: border-box; }
```

With `border-box`, `width: 300px` means the border edge is 300px and padding and border fit inside. Percent widths finally behave: two `width: 50%` boxes with padding sit side by side instead of wrapping.

### Shorthand order

`margin` and `padding` accept one to four values, clockwise from the top:

| Written | Top | Right | Bottom | Left |
|---|---|---|---|---|
| `margin: 8px` | 8 | 8 | 8 | 8 |
| `margin: 8px 16px` | 8 | 16 | 8 | 16 |
| `margin: 8px 16px 0` | 8 | 16 | 0 | 16 |
| `margin: 8px 16px 0 4px` | 8 | 16 | 0 | 4 |

`margin: 0 auto` on a block with a set width centres it horizontally. Logical properties (`margin-inline`, `padding-block-start`) do the same relative to writing direction, which matters for Urdu and Arabic right-to-left layouts.

### Borders and rounding

```css
.note { border: 1px solid #ccc; border-left: 4px solid #1572B6; border-radius: 6px; }
.avatar { border-radius: 50%; }
hr { border: 0; border-top: 1px solid #ddd; }
```

Border styles include `solid`, `dashed`, `dotted`, `double`. `outline` is drawn outside the border and does not affect layout, which is why it is used for focus rings.

### Margin collapsing

Vertical margins between block siblings do not add; the larger wins. Two paragraphs with `margin: 16px 0` are 16px apart, not 32px. A child's top margin can also "escape" through its parent if the parent has no padding or border. Flex and grid containers do not collapse margins, which is one reason layouts feel more predictable inside them.

### Units

| Unit | Relative to | Use for |
|---|---|---|
| `px` | 1/96 inch (CSS pixel) | Borders, small fixed details |
| `pt` | 1/72 inch | Print font sizes and margins (WeasyPrint) |
| `mm`, `cm`, `in` | Physical | Page size and margins in `@page` |
| `em` | Parent/current font size | Padding on buttons, letter-spacing |
| `rem` | Root font size (16px default) | Font sizes, spacing scale |
| `%` | Parent's corresponding dimension | Widths, fluid columns |
| `vw`, `vh` | 1% of viewport width/height | Full-screen sections, fluid type |
| `dvh`, `svh` | Dynamic/small viewport height | Mobile browsers with collapsing toolbars |
| `ch` | Width of the `0` glyph | Line length (`max-width: 65ch`) |
| `fr` | Fraction of free space (Grid only) | Grid columns |

```css
html   { font-size: 100%; }             /* respects the user's browser setting, 16px by default */
body   { font-size: 1rem; line-height: 1.5; }
h1     { font-size: 2rem; margin: 0 0 1rem; }
.page  { width: 90vw; max-width: 70rem; margin: 0 auto; padding: 1rem; }
.btn   { padding: .5em 1em; }            /* scales with the button's own font size */
@page  { size: A4; margin: 20mm 18mm; }  /* WeasyPrint: physical units */
```

`px` is fine for borders and hairlines; `rem` for type and spacing keeps everything proportional when the user zooms text; physical units belong in print only. `%` height rarely works unless the parent has an explicit height, which is why `vh` exists.

### min, max and clamp

`min-width`, `max-width`, `min-height` and `max-height` constrain a box. `clamp(min, preferred, max)` makes a value fluid within bounds:

```css
.content { width: 100%; max-width: 70rem; }
h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }   /* fluid heading, never too small or too large */
```

### Overflow

When content is bigger than its box, `overflow` decides: `visible` (default, spills out), `hidden` (clipped), `auto` (scrollbars when needed), `scroll`. A wide rate table inside a narrow column needs `overflow-x: auto` on a wrapper.

> **Interview note:** "What is the box model?" is the single most common CSS question. The complete answer names the four layers, explains `content-box` versus `border-box`, and mentions margin collapsing. Bonus: say that you set `border-box` globally and why.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Box model</title>
<style>
  body { font-family: Arial, sans-serif; margin: 2rem; }
  .row { display: flex; gap: 24px; align-items: flex-start; }
  .box { width: 220px; padding: 16px; border: 4px solid #1572B6; background: #eef4fa; }
  .content-box { box-sizing: content-box; }   /* renders 260px wide */
  .border-box  { box-sizing: border-box; }    /* renders 220px wide */
  .label { font-size: .85rem; color: #555; margin-top: .5rem; }
  p.gap { margin: 24px 0; background: #fff3cd; }   /* margins collapse: 24px apart, not 48px */
  h1 { font-size: clamp(1.4rem, 4vw, 2.4rem); color: #1572B6; }
  .wrap { overflow-x: auto; border: 1px dashed #999; max-width: 320px; }
  .wide { width: 600px; height: 30px; background: linear-gradient(to right, #1572B6, #cfe3f5); }
</style></head>
<body>
  <h1>Box model and units</h1>
  <div class="row">
    <div><div class="box content-box">content-box</div><p class="label">width 220 + padding 32 + border 8 = 260px</p></div>
    <div><div class="box border-box">border-box</div><p class="label">everything fits in 220px</p></div>
  </div>
  <p class="gap">Paragraph one, margin 24px top and bottom.</p>
  <p class="gap">Paragraph two: the gap above is 24px, because vertical margins collapse.</p>
  <div class="wrap"><div class="wide"></div></div>
  <p class="label">The wide bar scrolls inside its wrapper because of overflow-x: auto.</p>
</body>
</html>
```

### Quiz

1. With `box-sizing: content-box`, `width: 200px; padding: 10px; border: 5px solid` renders how wide?
- [ ] 200px
- [x] 230px
- [ ] 215px
> Content 200 + padding 20 + border 10; `border-box` would give 200.

2. `margin: 4px 8px 12px` sets the left margin to…
- [ ] 12px
- [x] 8px
- [ ] 4px
> Three values are top, horizontal (right and left), bottom.

3. Two stacked paragraphs each with `margin: 20px 0` are how far apart?
- [x] 20px
- [ ] 40px
- [ ] 0px
> Adjacent vertical margins collapse to the larger value.

4. Which unit is relative to the root font size?
- [ ] `em`
- [x] `rem`
- [ ] `%`
> `rem` = root em; `em` is relative to the element's own font size.

### Exercises

1. **Centred page** — Style `.page` to be 92% wide, never more than 68rem, centred, with 1.5rem padding and border-box sizing.
<details><summary>Solution</summary>

```css
.page { box-sizing: border-box; width: 92%; max-width: 68rem; margin: 0 auto; padding: 1.5rem; }
```

</details>

2. **Callout box** — Create a `.tip` box with a 4px left border in brand blue, light background, 1em padding and rounded corners.
<details><summary>Solution</summary>

```css
.tip { border-left: 4px solid #1572B6; background: #eef4fa; padding: 1em; border-radius: 6px; }
```

</details>

3. **Fluid heading** — Make `h2` scale between 1.2rem and 1.8rem depending on viewport width.
<details><summary>Solution</summary>

```css
h2 { font-size: clamp(1.2rem, 1rem + 1.5vw, 1.8rem); }
```

</details>

### Interview Questions

**Q: Explain the CSS box model and the difference between `content-box` and `border-box`.**
Every element generates a box with content, padding, border and margin layers. With the default `content-box`, `width` and `height` size only the content, so padding and border add to the rendered size; with `border-box`, they size the border edge, so padding and border fit inside. `border-box` makes percentage layouts predictable and matches how designers think, which is why the universal reset `*, *::before, *::after { box-sizing: border-box }` is standard. Margins are never included in either model. A complete answer also mentions margin collapsing between vertical block margins and that `outline` sits outside the box without affecting layout.

**Q: When would you use `em`, `rem`, `%`, `vw` and `px`?**
`rem` for font sizes and a spacing scale, so everything follows the root size and user zoom; `em` for properties that should scale with the element's own text, such as button padding and letter-spacing; `%` for widths relative to a parent in fluid layouts; `vw`/`vh` for viewport-relative sizing such as hero sections or fluid type inside `clamp()`; and `px` for hairline borders, shadows and other details that should not scale. In print CSS I switch to `pt` and `mm` because output is physical. The key point is choosing the reference each value should track, not memorising rules.

**Q: What is margin collapsing and when does it not happen?**
When two vertical margins touch, between siblings or between a parent and its first or last child, they combine into a single margin equal to the larger one rather than adding. It exists so that paragraph spacing stays even regardless of nesting. Collapsing does not happen horizontally, across padding or borders, inside flex or grid containers, for floated or absolutely positioned elements, or when a new block formatting context is created (`display: flow-root`, `overflow: hidden`). The classic bug is a child's top margin pushing its parent down; adding `padding-top: 1px` or `display: flow-root` to the parent fixes it.

