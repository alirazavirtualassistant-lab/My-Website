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


# LEVEL: Intermediate

## Display & positioning

Every box on a page is laid out by two decisions: what kind of box it is (`display`) and whether it takes part in normal flow or is taken out of it (`position`). Get these two properties right and most "why is this element over there?" bugs disappear.

### The display property

`display` controls how an element and its children generate boxes. The values you use daily:

| Value | Behaviour |
|---|---|
| `block` | Starts on a new line, fills the available width, respects `width`/`height` and all margins (`div`, `p`, `h1`, `section`) |
| `inline` | Flows within text, ignores `width`/`height` and vertical margins (`span`, `a`, `strong`) |
| `inline-block` | Flows within text but respects `width`, `height` and vertical padding/margins (buttons, badges) |
| `none` | Removed from layout entirely and from the accessibility tree |
| `flex` / `grid` | Block-level container whose children are laid out by Flexbox or Grid |
| `inline-flex` / `inline-grid` | Same, but the container itself sits inline |
| `flow-root` | A block that creates a new block formatting context (contains floats, stops margin collapse) |
| `contents` | The element's own box disappears; its children are laid out as if they were direct children of its parent |

```css
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #1572B6; color: #fff; }
.hidden { display: none; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
```

`display: none` hides an element from screen readers as well as sight, which is right for a closed menu but wrong for a label you only want visually hidden. The `.sr-only` pattern keeps the text available to assistive technology. `visibility: hidden` hides the element but keeps its space; `opacity: 0` keeps space and still receives clicks.

### Normal flow

In normal flow, block boxes stack vertically and inline boxes flow horizontally inside line boxes. Nothing overlaps. Positioning is how you deliberately leave that flow.

### The position property

```css
.static   { position: static; }     /* default: in flow, top/left ignored */
.relative { position: relative; top: 4px; left: 8px; }   /* nudged, original space kept */
.absolute { position: absolute; top: 0; right: 0; }      /* removed from flow */
.fixed    { position: fixed; bottom: 16px; right: 16px; } /* pinned to the viewport */
.sticky   { position: sticky; top: 0; }                   /* in flow until it hits the edge */
```

- **relative**: the element stays in flow and its original space is preserved; `top`/`left` shift the painted box. Its main job is to become the **containing block** for absolutely positioned children.
- **absolute**: taken out of flow, so siblings behave as if it were gone. It is placed relative to the nearest ancestor with a `position` other than `static` (or the initial containing block if none exists). This is the classic "close button in the top-right corner of a card" tool.
- **fixed**: like absolute, but relative to the viewport, so it stays put while scrolling. A `transform` or `filter` on an ancestor turns that ancestor into the containing block, which is a famous gotcha.
- **sticky**: a hybrid. The element scrolls normally until it reaches the offset (`top: 0`), then sticks while its parent is on screen. Sticky table headers for a long rate matrix need `position: sticky; top: 0` on `th` and no `overflow: hidden` on any ancestor.

```css
.card { position: relative; }
.card .close { position: absolute; top: 8px; right: 8px; }
thead th { position: sticky; top: 0; background: #fff; }
```

### Inset shorthand

`inset: 0` sets `top`, `right`, `bottom` and `left` to 0 at once, which stretches an absolutely positioned child to fill its containing block. `inset-inline-end` is the writing-direction-aware version of `right`.

### Stacking and z-index

Positioned elements can overlap, and `z-index` decides who is on top. It only works on positioned elements (or flex/grid items), and it is scoped to the **stacking context**: an element with `position` plus a `z-index`, or with `opacity < 1`, `transform`, `filter` or `isolation: isolate`, creates a new context, and its children can never escape it. A dropdown with `z-index: 9999` still hides behind a sibling if its parent created a context with `z-index: 1`.

> **Warning:** Do not solve overlap bugs with ever larger `z-index` values. Find which ancestor creates the stacking context and restructure, or use `isolation: isolate` deliberately on components so their internal z-indexes never leak.

### Floats

`float: left|right` pushes an element to one side and lets text wrap around it. It is still the right tool for a pull-quote or a photo inside an article, and it is the only "layout" tool older EPUB readers reliably support. A parent with only floated children collapses to zero height; fix it with `display: flow-root` on the parent.

```css
figure.pull { float: right; width: 40%; margin: 0 0 1rem 1.5rem; }
.article { display: flow-root; }
```

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Positioning</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; }
  header { position: sticky; top: 0; background: #1572B6; color: #fff; padding: 12px 16px; }
  .card { position: relative; width: 260px; margin: 16px; padding: 16px 16px 16px; border: 1px solid #ccc; border-radius: 8px; }
  .card .close { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; background: #c0392b; color: #fff; text-align: center; line-height: 24px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #eef4fa; color: #1572B6; font-size: .8rem; }
  .fab { position: fixed; bottom: 16px; right: 16px; padding: 12px 18px; border-radius: 999px; background: #27ae60; color: #fff; }
  .tall { height: 900px; margin: 16px; background: linear-gradient(#fff, #eee); }
  figure { float: right; width: 120px; margin: 0 0 8px 12px; padding: 8px; background: #fff3cd; font-size: .8rem; }
  .article { display: flow-root; margin: 16px; }
</style></head>
<body>
  <header>Sticky header, scroll to test</header>
  <div class="card"><span class="close">x</span><strong>Rate matrix v3</strong><br><span class="badge">approved</span><p>Absolute close button inside a relative card.</p></div>
  <div class="article"><figure>Floated pull-quote: text wraps around this box.</figure>
    <p>Title-insurance production reports are generated weekly. Each report lists the number of files opened, examined and closed per state. The float on the right keeps this paragraph wrapping around the figure while the article stays a proper block thanks to flow-root.</p></div>
  <div class="tall">Scroll down. The green button is fixed to the viewport.</div>
  <div class="fab">Fixed button</div>
</body>
</html>
```

### Quiz

1. An absolutely positioned element is placed relative to…
- [ ] its parent, always
- [x] the nearest ancestor whose `position` is not `static`
- [ ] the viewport, always
> If no such ancestor exists it falls back to the initial containing block, which behaves like the viewport at load.

2. Which value keeps the element's space but hides it visually and from screen readers?
- [ ] `display: none`
- [x] `visibility: hidden`
- [ ] `opacity: 0`
> `display: none` removes the space; `opacity: 0` keeps it visible to assistive tech and clickable.

3. `z-index` has no effect on an element when…
- [x] its `position` is `static` and it is not a flex or grid item
- [ ] it has a background colour
- [ ] it is inside a `div`
> `z-index` applies to positioned elements and flex/grid items only.

4. Why might `position: sticky` fail to stick?
- [ ] Because `top` is set
- [x] Because an ancestor has `overflow: hidden` or the parent is no taller than the element
- [ ] Because it is inside a table
> Sticky needs a scrolling ancestor without clipping and a parent tall enough to scroll within.

### Exercises

1. **Corner ribbon** — Put a small "DRAFT" label in the top-left corner of a `.page` box without affecting the flow of the page content.
<details><summary>Solution</summary>

```css
.page { position: relative; }
.page::before { content: "DRAFT"; position: absolute; top: 0; left: 0; padding: 2px 8px; background: #c0392b; color: #fff; font-size: .75rem; }
```

</details>

2. **Sticky table header** — Make the header row of `table.rates` stay visible while the body scrolls inside a 300px-tall wrapper.
<details><summary>Solution</summary>

```css
.wrap { max-height: 300px; overflow-y: auto; }
table.rates thead th { position: sticky; top: 0; background: #fff; box-shadow: 0 1px 0 #ccc; }
```

</details>

3. **Overlay** — Cover the whole viewport with a semi-transparent dark layer and centre a dialog inside it.
<details><summary>Solution</summary>

```css
.overlay { position: fixed; inset: 0; background: rgb(0 0 0 / .5); display: grid; place-items: center; }
.dialog { background: #fff; padding: 24px; border-radius: 8px; max-width: 480px; }
```

</details>

### Interview Questions

**Q: Explain the difference between `relative`, `absolute`, `fixed` and `sticky`.**
`relative` keeps the element in normal flow, preserves its original space and offsets the painted box; its most important side effect is becoming the containing block for absolutely positioned descendants. `absolute` removes the element from flow and positions it against the nearest positioned ancestor. `fixed` is the same idea but against the viewport, so it does not move on scroll, unless an ancestor has a `transform`, which then becomes the containing block. `sticky` stays in flow and toggles to fixed-like behaviour when its scroll offset is reached, but only within its parent's bounds and only if no ancestor clips overflow. In a report viewer I use sticky for table headers, absolute for badges inside cards, and fixed for a "back to top" control.

**Q: What is a stacking context and why does a huge `z-index` sometimes not work?**
A stacking context is a self-contained layer group; elements inside it are ordered among themselves, then the whole context is placed as one unit in its parent context. Contexts are created by the root, by positioned elements with a `z-index`, by `opacity` below 1, `transform`, `filter`, `will-change`, `isolation: isolate` and a few others. A child cannot escape its context, so a menu with `z-index: 9999` inside a header with `z-index: 1` still sits behind a sibling with `z-index: 2`. The fix is to identify the ancestor creating the context with DevTools' Layers panel and either raise that ancestor or restructure the DOM so the overlay is a sibling of the content, which is why modals are usually appended to `body`.

**Q: What does `display: flow-root` do and when would you use it?**
It makes the element a block that establishes a new block formatting context. Practically that means it contains its floated children, so the parent no longer collapses to zero height, and it prevents its children's margins from collapsing through it. It replaces the old clearfix hack (`::after { content: ""; display: table; clear: both }`) and is cleaner than `overflow: hidden`, which also clips shadows and tooltips. I use it on article wrappers that contain floated figures and on card bodies where a first-child heading's margin was escaping the card.

## Flexbox

**Flexbox** (Flexible Box Layout) lays out items in a single direction, a row or a column, and distributes free space between them. It is the tool for toolbars, navigation, card rows, centring, and any "put these things in a line and spread them out" problem. Grid, in the next chapter, handles two dimensions.

### Container and items

Set `display: flex` on a parent and its direct children become **flex items**:

```css
.toolbar { display: flex; gap: 12px; align-items: center; }
```

Four container properties do most of the work:

| Property | What it controls | Common values |
|---|---|---|
| `flex-direction` | Main axis | `row` (default), `column`, `row-reverse` |
| `justify-content` | Distribution along the main axis | `flex-start`, `center`, `space-between`, `space-around`, `space-evenly` |
| `align-items` | Alignment on the cross axis | `stretch` (default), `center`, `flex-start`, `flex-end`, `baseline` |
| `flex-wrap` | Whether items wrap to new lines | `nowrap` (default), `wrap` |

`gap` (and `row-gap`/`column-gap`) adds space between items without the margin hacks of the past. `align-content` aligns the wrapped lines themselves when there is more than one line.

### The classic centring

```css
.hero { display: flex; justify-content: center; align-items: center; min-height: 60vh; }
```

Two lines centre anything horizontally and vertically. This was genuinely hard before Flexbox.

### Item properties

Each item can control how it grows and shrinks:

```css
.sidebar { flex: 0 0 240px; }   /* grow 0, shrink 0, basis 240px: fixed column */
.main    { flex: 1 1 0; }       /* take all remaining space */
.logo    { margin-right: auto; } /* pushes everything after it to the far end */
```

- `flex-grow`: share of *extra* space the item receives (0 = none).
- `flex-shrink`: how much it shrinks when space is short (0 = never).
- `flex-basis`: starting size before growing or shrinking (`auto` = content size or `width`).

`flex: 1` expands to `1 1 0%`, so all `flex: 1` items get equal widths regardless of content. `flex: auto` is `1 1 auto`, so bigger content gets a bigger share. `min-width: 0` is often needed on a growing item that contains long text or a table, because flex items default to `min-width: auto` and refuse to shrink below their content.

`align-self` overrides `align-items` for one item, and `order` changes visual order without touching the HTML (use sparingly: keyboard order still follows the DOM).

### Auto margins

`margin-left: auto` on an item absorbs all free space on that side. It is the cleanest way to push a "Log out" button to the right of a nav bar while the other links stay left.

### A status bar for a production report

```html
<div class="status">
  <span class="title">Weekly Production, Wyoming</span>
  <span class="badge">124 files</span>
  <span class="badge">98% on time</span>
  <button class="print">Print</button>
</div>
```

```css
.status { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #eef4fa; }
.title  { font-weight: bold; }
.print  { margin-left: auto; }
```

The title and badges sit on the left, and the button is pushed right by its auto margin. Add `flex-wrap: wrap` and the badges drop to a second line on narrow screens instead of overflowing.

### Column direction

`flex-direction: column` turns the main axis vertical, so `justify-content` now controls vertical distribution. A card whose footer must stay at the bottom regardless of content length:

```css
.card { display: flex; flex-direction: column; height: 100%; }
.card .body { flex: 1; }
```

### Where Flexbox is the wrong tool

Flexbox aligns along one axis at a time. If you need columns to line up across rows, that is a grid. Flexbox is also unsupported or partial in many EPUB2 readers and in older Kindle firmware, so ebook stylesheets keep a block-and-float fallback.

> **Interview note:** Be ready to explain `flex: 1` versus `flex: auto`, and why `min-width: 0` fixes an overflowing flex child. Both come from real bugs and interviewers know it.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Flexbox</title>
<style>
  body { font-family: Arial, sans-serif; margin: 16px; }
  nav { display: flex; align-items: center; gap: 16px; padding: 10px 16px; background: #1572B6; color: #fff; border-radius: 6px; }
  nav a { color: #fff; text-decoration: none; }
  nav .logout { margin-left: auto; }
  .cards { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; }
  .card { flex: 1 1 200px; display: flex; flex-direction: column; border: 1px solid #ccc; border-radius: 8px; padding: 12px; }
  .card .body { flex: 1; }
  .card footer { font-size: .8rem; color: #555; border-top: 1px solid #eee; padding-top: 6px; }
  .centre { display: flex; justify-content: center; align-items: center; height: 100px; margin-top: 16px; background: #eef4fa; }
</style></head>
<body>
  <nav><strong>TitleOps</strong><a href="#">Reports</a><a href="#">Rate matrix</a><a class="logout" href="#">Log out</a></nav>
  <div class="cards">
    <div class="card"><div class="body"><strong>Wyoming</strong><p>124 files, 98% on time.</p></div><footer>Updated Monday</footer></div>
    <div class="card"><div class="body"><strong>Colorado</strong><p>310 files, 94% on time. A longer note here to show the footer still sits at the bottom of every card in the row.</p></div><footer>Updated Monday</footer></div>
    <div class="card"><div class="body"><strong>Texas</strong><p>77 files.</p></div><footer>Updated Friday</footer></div>
  </div>
  <div class="centre">Centred with two lines of CSS</div>
</body>
</html>
```

### Quiz

1. `justify-content` aligns items along the…
- [x] main axis
- [ ] cross axis
- [ ] z axis
> With `flex-direction: row` that is horizontal; with `column` it becomes vertical.

2. What does `flex: 1` expand to?
- [ ] `1 0 auto`
- [x] `1 1 0%`
- [ ] `0 1 auto`
> A basis of 0 means all `flex: 1` siblings share space equally, ignoring content width.

3. Which property pushes one item to the far end of a flex row?
- [ ] `justify-self: end`
- [x] `margin-left: auto`
- [ ] `float: right`
> Auto margins absorb free space; `justify-self` has no effect on flex items.

4. A flex child with a wide table overflows its container. The usual fix is…
- [ ] `flex-shrink: 0`
- [x] `min-width: 0` on the child
- [ ] `overflow: visible`
> Flex items default to `min-width: auto`, so they will not shrink below their content until you allow it.

### Exercises

1. **Split header** — Build a header with a logo on the left, a centred title, and a date on the right, all vertically centred.
<details><summary>Solution</summary>

```css
header { display: flex; align-items: center; }
header .title { flex: 1; text-align: center; }
```

</details>

2. **Equal-height cards** — Make three cards in a row equal height with their "Read more" links aligned at the bottom.
<details><summary>Solution</summary>

```css
.row  { display: flex; gap: 16px; }
.card { flex: 1; display: flex; flex-direction: column; }
.card .body { flex: 1; }
```

</details>

3. **Wrapping tag list** — Style a list of tags so they flow onto multiple lines with 8px gaps and no bullets.
<details><summary>Solution</summary>

```css
ul.tags { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
```

</details>

### Interview Questions

**Q: When would you choose Flexbox over Grid?**
Flexbox distributes items along one axis and lets content size decide the layout, so it fits toolbars, navigation, button groups, tag lists and vertical stacks where items should size to their content and wrap naturally. Grid places items in two dimensions against explicit tracks, so it fits page scaffolds, dashboards and forms where columns must align across rows. A practical rule is content-out versus layout-in: if I am asking "spread these things out", Flexbox; if I am asking "put this in row 2, columns 1 to 3", Grid. They nest well, and a typical page is a Grid shell with Flexbox components inside.

**Q: Explain `flex-grow`, `flex-shrink` and `flex-basis` with an example.**
`flex-basis` is the item's starting size on the main axis, `flex-grow` is its share of any leftover space, and `flex-shrink` its share of any deficit, both weighted relative to siblings. For a sidebar layout, `.sidebar { flex: 0 0 240px }` never grows or shrinks and starts at 240px, while `.main { flex: 1 1 0 }` starts from zero and takes all remaining space. If two items have `flex-grow: 1` and `2`, the second gets twice as much of the extra space, not twice the width. Shrinking is additionally weighted by basis size, which is why a long item shrinks more than a short one with the same `flex-shrink`.

**Q: Why does a flex item sometimes refuse to shrink and overflow its container?**
Because the default `min-width` for flex items is `auto`, which resolves to the item's minimum content size; a long unbroken URL or a wide table sets a floor the item will not go below, so it overflows. Setting `min-width: 0` (or `overflow: hidden`) on the item lets it shrink, after which `overflow-x: auto` or `overflow-wrap: anywhere` inside it handles the content. The same applies to `min-height: auto` in column direction. It is one of the most searched CSS bugs and a good candidate explains both the cause and the fix.

## Grid

**CSS Grid** lays out content in rows and columns at the same time. You define tracks on the container and place items into cells, so a page skeleton, a dashboard of KPI tiles or a two-column form becomes a few lines of CSS with no wrapper elements.

### Defining tracks

```css
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
}
```

`grid-template-columns` lists the column widths; `fr` is a fraction of the free space after fixed tracks are subtracted. Here the first column is fixed at 240px and the other two share what is left equally. Rows are `auto` (as tall as content), `1fr` (fill) and `auto`.

Useful functions for track lists:

| Function | Meaning |
|---|---|
| `repeat(3, 1fr)` | Three equal columns |
| `repeat(auto-fill, minmax(200px, 1fr))` | As many 200px-or-wider columns as fit; empty tracks kept |
| `repeat(auto-fit, minmax(200px, 1fr))` | Same, but empty tracks collapse so items stretch |
| `minmax(0, 1fr)` | A fraction that is allowed to shrink below content size |
| `fit-content(300px)` | Content width, capped at 300px |

The `auto-fit` + `minmax` pattern is the famous responsive card grid that needs no media queries at all.

### Placing items

By default items fill cells in order, left to right, top to bottom. To place explicitly, use line numbers (lines start at 1, and negative numbers count from the end):

```css
.header  { grid-column: 1 / -1; }        /* span all columns */
.sidebar { grid-row: 2 / 3; grid-column: 1; }
.main    { grid-column: 2 / span 2; }    /* start at line 2, span two tracks */
```

`grid-area: row-start / column-start / row-end / column-end` sets all four at once.

### Named areas

For page layouts, named areas read like a picture of the page:

```css
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "nav    main"
    "footer footer";
  min-height: 100vh;
}
header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
footer { grid-area: footer; }
```

A single media query can redraw the picture for phones: `grid-template-areas: "header" "main" "nav" "footer"` with one column.

### Alignment

Grid has two families of alignment properties. `justify-*` works on the inline (horizontal) axis and `align-*` on the block (vertical) axis:

- `justify-items` / `align-items`: how items sit inside their cells (`stretch`, `start`, `center`, `end`).
- `justify-content` / `align-content`: how the whole track set sits inside the container when there is spare space.
- `justify-self` / `align-self`: per-item overrides.
- `place-items: center` is the shorthand that centres content in every cell, so `display: grid; place-items: center` is the shortest centring recipe in CSS.

### Implicit tracks

If you place an item outside the defined rows, or content overflows the template, Grid creates **implicit** tracks. `grid-auto-rows: minmax(120px, auto)` sizes them; `grid-auto-flow: dense` back-fills holes left by spanning items, which is handy for image galleries and KPI tiles of mixed sizes.

### Subgrid

`grid-template-columns: subgrid` on a grid item lets its children use the parent's column lines, so card titles, prices and buttons line up across cards even though each card is its own grid. It is supported in all current browsers since 2023.

### A KPI dashboard

```css
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.kpi  { padding: 16px; border-radius: 8px; background: #eef4fa; }
.kpi.wide { grid-column: span 2; }
```

Each tile is at least 160px; the browser decides how many fit per row, and the "wide" tile takes two tracks. This is the same layout Ali builds in Power BI, now in nine lines.

> **Tip:** Open DevTools, click the "grid" badge next to a grid container in the Elements panel, and the browser draws every line number and area name over the page. It turns Grid debugging from guesswork into reading.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Grid</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; }
  .page { display: grid; min-height: 100vh; gap: 12px; padding: 12px;
          grid-template-columns: 200px 1fr; grid-template-rows: auto 1fr auto;
          grid-template-areas: "header header" "nav main" "footer footer"; }
  header { grid-area: header; background: #1572B6; color: #fff; padding: 12px; border-radius: 6px; }
  nav    { grid-area: nav; background: #eef4fa; padding: 12px; border-radius: 6px; }
  main   { grid-area: main; }
  footer { grid-area: footer; background: #eee; padding: 8px; font-size: .8rem; text-align: center; }
  .kpis  { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
  .kpi   { padding: 14px; border: 1px solid #cfe3f5; border-radius: 8px; }
  .kpi b { display: block; font-size: 1.6rem; color: #1572B6; }
  .kpi.wide { grid-column: span 2; background: #fff3cd; }
  @media (max-width: 600px) { .page { grid-template-columns: 1fr; grid-template-areas: "header" "main" "nav" "footer"; } }
</style></head>
<body>
  <div class="page">
    <header><strong>Production dashboard</strong>, week 37</header>
    <nav>Reports<br>Rate matrix<br>QA scores</nav>
    <main>
      <div class="kpis">
        <div class="kpi"><b>124</b>Files opened</div>
        <div class="kpi"><b>118</b>Files closed</div>
        <div class="kpi"><b>98%</b>On time</div>
        <div class="kpi wide"><b>3</b>Escalations (spans two columns)</div>
        <div class="kpi"><b>4.7</b>QA score</div>
      </div>
    </main>
    <footer>Resize the preview: below 600px the layout becomes one column.</footer>
  </div>
</body>
</html>
```

### Quiz

1. `grid-template-columns: 200px 1fr 2fr` in a 1000px container gives the last column…
- [ ] 400px
- [x] about 533px
- [ ] 666px
> 800px of free space is split 1:2, so the third column receives two thirds, roughly 533px.

2. `grid-column: 1 / -1` means…
- [x] span from the first line to the last line
- [ ] one column wide, starting at column -1
- [ ] the item is hidden
> Negative line numbers count from the end, so `-1` is the final column line.

3. Which recipe collapses empty tracks so items stretch to fill the row?
- [ ] `repeat(auto-fill, minmax(200px, 1fr))`
- [x] `repeat(auto-fit, minmax(200px, 1fr))`
- [ ] `repeat(3, auto)`
> `auto-fit` collapses empty tracks; `auto-fill` keeps them, leaving gaps.

4. What does `place-items: center` do on a grid container?
- [ ] Centres the grid within the page
- [x] Centres every item inside its own cell on both axes
- [ ] Centres only text
> It is the shorthand for `align-items: center; justify-items: center`.

### Exercises

1. **Two-column form** — Lay out a form so labels sit in a 160px column and inputs fill the rest, with 8px row gaps.
<details><summary>Solution</summary>

```css
form { display: grid; grid-template-columns: 160px 1fr; gap: 8px 12px; align-items: center; }
form .full { grid-column: 1 / -1; }
```

</details>

2. **Responsive gallery** — Show thumbnails in as many 180px columns as fit, with every item square.
<details><summary>Solution</summary>

```css
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.gallery img { width: 100%; aspect-ratio: 1; object-fit: cover; }
```

</details>

3. **Holy grail** — Build header, left nav, main, right aside and footer with named areas, collapsing to a single column under 700px.
<details><summary>Solution</summary>

```css
.layout { display: grid; grid-template-columns: 200px 1fr 200px; grid-template-rows: auto 1fr auto;
  grid-template-areas: "h h h" "n m a" "f f f"; }
@media (max-width: 700px) { .layout { grid-template-columns: 1fr; grid-template-areas: "h" "m" "n" "a" "f"; } }
```

</details>

### Interview Questions

**Q: What is the difference between `auto-fill` and `auto-fit`?**
Both create as many columns as fit the container using the `minmax()` size you give them. `auto-fill` keeps any empty tracks, so with three cards in a row that could hold five you get three cards and two blank slots, which keeps card widths stable. `auto-fit` collapses the empty tracks to zero, so the three cards stretch to fill the row. I use `auto-fit` for card grids that should always look full, and `auto-fill` when consistent item width matters, such as a form where a lone field should not become enormously wide.

**Q: How do implicit and explicit grids differ?**
The explicit grid is what you declare with `grid-template-columns`, `grid-template-rows` and `grid-template-areas`. When items are auto-placed beyond it, or placed at a line that does not exist, the browser creates implicit tracks, sized by `grid-auto-rows` and `grid-auto-columns` (default `auto`). `grid-auto-flow` controls placement direction and `dense` packing. A typical bug is defining two rows, adding a fifth item, and wondering why the third row has no height: it is implicit and needs `grid-auto-rows`.

**Q: How would you build a responsive layout with Grid without media queries?**
Use intrinsic sizing: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr))` makes columns that are at least 240px, collapse to a single column when the container is narrower, and never overflow thanks to `min(100%, 240px)`. Combine it with `gap` and `fr` units, and with container queries for component-level changes, and most dashboards never need a viewport breakpoint. Named areas with a media query are still simpler for page-level reflows such as moving navigation below content, so I use both: intrinsic grids for components, one or two queries for the shell.

## Pseudo-classes & pseudo-elements

Selectors can target more than tags, classes and IDs. **Pseudo-classes** select elements by *state or position* (`:hover`, `:first-child`, `:not()`), and **pseudo-elements** create or style *parts* of an element that are not in the HTML (`::before`, `::first-line`). Together they remove a lot of helper classes and JavaScript.

### Pseudo-classes: state

```css
a:hover, a:focus-visible { text-decoration: underline; }
button:active { transform: translateY(1px); }
input:focus { outline: 2px solid #1572B6; outline-offset: 2px; }
input:disabled { background: #eee; color: #888; }
input:checked + label { font-weight: bold; }
a:visited { color: #6c3483; }
```

The link states have a required order, remembered as LoVe HAte: `:link`, `:visited`, `:hover`, `:active`, because later rules of equal specificity win. `:focus-visible` shows a focus ring only when the browser thinks it is useful (keyboard navigation), so mouse users do not see rings on every click. Never remove focus styles without replacing them; keyboard users depend on them.

### Pseudo-classes: form validation

```css
input:required { border-left: 3px solid #1572B6; }
input:invalid  { border-color: #c0392b; }
input:user-invalid { border-color: #c0392b; }   /* only after the user interacted */
input:placeholder-shown + .hint { display: none; }
```

`:invalid` fires as soon as the page loads for an empty required field, which is why `:user-invalid` (Chrome 119+, Firefox 88+, Safari 16.5+) exists.

### Pseudo-classes: structure

| Selector | Matches |
|---|---|
| `:first-child`, `:last-child` | First/last element among siblings |
| `:nth-child(2n)`, `:nth-child(odd)` | Every second child; zebra stripes |
| `:nth-child(3n+1)` | Items 1, 4, 7… |
| `:nth-of-type(2)` | Second element *of this tag* among siblings |
| `:only-child` | Element with no siblings |
| `:empty` | Element with no children or text |
| `:not(.done)` | Anything that does not match |
| `:is(h1, h2, h3)` | Any of the list, specificity of the most specific argument |
| `:where(h1, h2, h3)` | Same, but zero specificity |
| `:has(> img)` | Element that contains a matching descendant (the "parent selector") |

```css
tbody tr:nth-child(even) { background: #f6f9fc; }
li:not(:last-child) { border-bottom: 1px solid #eee; }
.card:has(img) { padding: 0; }
figure:has(> figcaption) img { margin-bottom: .5rem; }
```

`:has()` is supported everywhere since December 2023 and answers the decades-old request for a parent selector: style a card differently when it contains an image, or highlight a form row whose input is invalid.

### Pseudo-elements

Pseudo-elements use a double colon (the single-colon form still works for the four old ones, for compatibility). The important ones:

```css
h2::before { content: "§ "; color: #1572B6; }
a[href^="http"]::after { content: " ↗"; font-size: .8em; }
p::first-line { font-variant: small-caps; }
p::first-letter { font-size: 3em; float: left; line-height: 1; margin-right: 4px; }
::selection { background: #1572B6; color: #fff; }
input::placeholder { color: #999; }
li::marker { color: #1572B6; }
```

`::before` and `::after` insert a generated box as the first or last child of the element and require the `content` property, even if it is `""`. They are perfect for icons, decorative lines, "Figure 3:" prefixes and, in print CSS, page numbers. They do not work on replaced elements such as `<img>` and `<input>` because those have no content box to insert into.

`content` can combine strings, `attr()`, counters and quotes:

```css
a[href]::after { content: " (" attr(href) ")"; }          /* print stylesheets */
blockquote::before { content: open-quote; }
h3::before { counter-increment: section; content: counter(section) ". "; }
```

### A drop-cap and numbered headings

```css
body { counter-reset: h2; }
h2 { counter-increment: h2; }
h2::before { content: counter(h2) ". "; }
.chapter > p:first-of-type::first-letter { font-size: 3.2em; float: left; line-height: .8; margin: .05em .1em 0 0; }
```

Counters are plain CSS: `counter-reset` starts one, `counter-increment` bumps it, `counter()` prints it. They are the engine behind automatic heading numbers and, in paged media, "Page 3 of 12".

> **Warning:** Generated content is not in the DOM. Screen readers read most of it but do not always, and it cannot be selected or copied reliably. Use it for decoration and print-only extras, never for the only copy of important text.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Pseudo-classes</title>
<style>
  body { font-family: Georgia, serif; margin: 16px; counter-reset: sec; }
  h2 { counter-increment: sec; font-family: Arial, sans-serif; color: #1572B6; }
  h2::before { content: counter(sec) ". "; }
  p:first-of-type::first-letter { font-size: 3em; float: left; line-height: .8; margin: .05em .1em 0 0; }
  table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: .9rem; }
  th, td { padding: 6px 10px; border-bottom: 1px solid #ddd; text-align: left; }
  tbody tr:nth-child(even) { background: #f6f9fc; }
  tbody tr:hover { background: #fff3cd; }
  td:last-child { text-align: right; }
  a[href^="http"]::after { content: " ↗"; }
  input:focus-visible { outline: 3px solid #1572B6; outline-offset: 2px; }
  input:user-invalid { border: 2px solid #c0392b; }
  .row:has(input:user-invalid) label { color: #c0392b; }
  input:checked + span { font-weight: bold; color: #27ae60; }
</style></head>
<body>
  <h2>Weekly production</h2>
  <p>Rate matrices are checked every Monday by the production support team before the weekly report is sent to management.</p>
  <table><thead><tr><th>State</th><th>Files</th></tr></thead>
  <tbody><tr><td>Wyoming</td><td>124</td></tr><tr><td>Colorado</td><td>310</td></tr><tr><td>Texas</td><td>77</td></tr><tr><td>Utah</td><td>52</td></tr></tbody></table>
  <h2>Sign-off</h2>
  <p class="row"><label>Email <input type="email" required placeholder="name@example.com"></label> (type an invalid address, then tab away)</p>
  <p><label><input type="checkbox"> <span>Report reviewed</span></label></p>
  <p>Source: <a href="https://www.w3.org/TR/selectors-4/">Selectors Level 4</a></p>
</body>
</html>
```

### Quiz

1. Which selector matches the second `<p>` inside a `<div>` even if a heading comes first?
- [ ] `p:nth-child(2)`
- [x] `p:nth-of-type(2)`
- [ ] `p:second`
> `nth-child` counts all siblings; `nth-of-type` counts only elements of the same tag.

2. `::before` produces nothing unless you set…
- [ ] `display: block`
- [x] `content`
- [ ] `position`
> Without a `content` value (even `""`) the pseudo-element is not generated.

3. `:where(.a, .b)` differs from `:is(.a, .b)` in that it…
- [x] has zero specificity
- [ ] matches descendants too
- [ ] only works in Firefox
> `:where` is the tool for low-specificity resets and library defaults.

4. Which pseudo-class lets you style a form row whose input is invalid?
- [ ] `.row:invalid`
- [x] `.row:has(input:invalid)`
- [ ] `.row > :invalid::parent`
> `:has()` selects an element based on its descendants.

### Exercises

1. **Zebra table with totals** — Stripe even body rows and make the last row bold with a top border.
<details><summary>Solution</summary>

```css
tbody tr:nth-child(even) { background: #f6f9fc; }
tbody tr:last-child { font-weight: bold; border-top: 2px solid #333; }
```

</details>

2. **External link icon** — Add an arrow after links that start with `http` but not after links to your own domain.
<details><summary>Solution</summary>

```css
a[href^="http"]:not([href*="alirazadocs.com"])::after { content: " ↗"; }
```

</details>

3. **Numbered figures** — Automatically prefix every `figcaption` with "Figure N:".
<details><summary>Solution</summary>

```css
body { counter-reset: fig; }
figure { counter-increment: fig; }
figcaption::before { content: "Figure " counter(fig) ": "; font-weight: bold; }
```

</details>

### Interview Questions

**Q: What is the difference between a pseudo-class and a pseudo-element?**
A pseudo-class selects existing elements based on a state or position the markup does not express, such as `:hover`, `:checked`, `:nth-child(odd)` or `:has(img)`; it uses one colon and adds specificity like a class. A pseudo-element addresses a part of an element or a generated box, such as `::before`, `::first-line` or `::placeholder`; it uses two colons and counts like a tag in specificity. Only one pseudo-element may appear per selector and it must be last. A typical use combining both is `li:not(:last-child)::after { content: "," }` to render a comma-separated list from plain markup.

**Q: How do `:is()`, `:where()` and `:has()` change how you write CSS?**
`:is()` shortens selector lists (`:is(h1, h2, h3) a` instead of three rules) and takes the specificity of its most specific argument. `:where()` is identical but contributes zero specificity, which makes it ideal for resets and framework defaults that authors should override with a single class. `:has()` is the parent and sibling selector CSS never had: `label:has(+ input:invalid)` or `.card:has(> img)` change styling based on descendants, replacing JavaScript class toggling for many cases. The cost of `:has()` is that the browser must re-evaluate it when descendants change, so avoid `:has()` with deep unbounded descendant selectors on large DOMs.

**Q: How do CSS counters work and where have you used them?**
`counter-reset: name` creates a counter on an element, `counter-increment: name` bumps it on each matching element, and `counter(name)` or `counters(name, ".")` prints it inside `content`. Nested counters give "2.3.1" outline numbering when you reset the child counter on each parent. I use them for heading numbers, figure and table captions, and page numbers in print stylesheets with `content: counter(page) " of " counter(pages)`, which WeasyPrint supports. They keep numbering correct when sections are reordered, which was a constant source of errors in hand-numbered Word manuals.

## Cascade, specificity & inheritance

When two rules target the same element, which wins? That question is the **cascade**, and it is the single most asked CSS topic in interviews. It resolves in a fixed order: origin and importance, then cascade layers, then specificity, then source order. Separately, **inheritance** explains why a child gets a colour it was never given.

### Origins and !important

Declarations come from three origins: the browser's user-agent stylesheet, the user's own styles, and the author (you). Normal author rules beat user rules, which beat user-agent rules. `!important` reverses the order: important user-agent rules beat important user rules, which beat important author rules. That is why `!important` is a last resort: it is hard to override and it reverses the normal precedence you rely on.

```css
.btn { color: white !important; }   /* wins over any later normal .btn rule */
```

Legitimate uses are utility classes that must always apply (`.hidden { display: none !important }`) and overriding third-party inline styles you cannot edit.

### Cascade layers

`@layer` (all browsers since 2022) lets you declare precedence between whole groups of rules regardless of specificity:

```css
@layer reset, base, components, utilities;
@layer reset { * { margin: 0; } }
@layer components { .card h2 { color: #1572B6; } }
@layer utilities { .text-red { color: #c0392b; } }
```

Later layers beat earlier ones, and unlayered styles beat all layers. So `.text-red` beats `.card h2` even though `.card h2` is more specific. This is how modern design systems stop specificity wars.

### Specificity

Within the same origin and layer, the most **specific** selector wins. Specificity is three numbers (A, B, C), compared left to right:

| Column | Counts | Example |
|---|---|---|
| A | ID selectors | `#report` |
| B | Classes, attributes, pseudo-classes | `.row`, `[type=email]`, `:hover` |
| C | Type selectors and pseudo-elements | `td`, `::before` |

`*`, combinators (`>`, `+`, `~`, space) and `:where()` add nothing. `:is()`, `:not()` and `:has()` take the specificity of their most specific argument. Inline `style=""` beats any selector, and `!important` beats inline.

```css
td            { color: black; }        /* 0,0,1 */
.rates td     { color: #333; }         /* 0,1,1 */
#report td    { color: #1572B6; }      /* 1,0,1 */
tbody tr:hover td { color: red; }      /* 0,1,3 */
```

A single ID (1,0,0) beats any number of classes (0,20,0). Columns never carry over, which is why ten classes cannot beat one ID.

### Source order

Equal specificity: the later declaration wins. Order is by *declaration* position in the final cascade, not by where the selector was first mentioned, and it spans across files in the order the stylesheets are loaded. This is the whole reason the link-state order matters and why a component library must be loaded before your overrides.

### Putting the algorithm together

For each property on each element, the browser:

1. Collects all matching declarations.
2. Keeps the winning origin and importance.
3. Keeps the winning cascade layer.
4. Keeps the highest specificity.
5. Keeps the last in source order.

The survivor is the **cascaded value**. Tools help: DevTools crosses out losing declarations and hovering a selector shows its specificity.

### Inheritance

Some properties, when not set on an element, take the computed value from the parent. Text properties inherit: `color`, `font-*`, `line-height`, `letter-spacing`, `text-align`, `visibility`, `cursor`, `list-style`. Box properties do not: `margin`, `padding`, `border`, `background`, `width`, `display`, `position`.

```css
body { font-family: Georgia, serif; color: #222; line-height: 1.5; }   /* every element inherits these */
.card { border: 1px solid #ccc; }                                        /* children do not get a border */
```

Form controls (`button`, `input`, `select`) do *not* inherit font by default because the user-agent stylesheet sets `font: -webkit-small-control`. Every reset includes `button, input, select, textarea { font: inherit; }` for this reason.

### The universal keywords

Every property accepts:

- `inherit`: take the parent's computed value, even for non-inherited properties.
- `initial`: the property's spec default (for `display` that is `inline`, rarely what you want).
- `unset`: `inherit` if the property inherits, otherwise `initial`.
- `revert`: roll back to the user-agent (or previous origin) value, the sane "undo my styling" option.
- `revert-layer`: roll back to the previous cascade layer.

`all: unset` on a button strips every author and UA style in one line, then you rebuild.

> **Interview note:** The classic trick question is "which wins, `#a .b` or `.a .b .c .d`?" The ID wins (1,1,0 vs 0,4,0). Follow up with why you avoid IDs in selectors: they make overrides require another ID or `!important`, escalating forever.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Cascade</title>
<style>
  @layer base, theme;
  @layer base { p { color: gray; } .note { color: #1572B6; } }
  @layer theme { p { color: #222; } }              /* later layer beats base even for .note? no: see below */
  body { font-family: Georgia, serif; line-height: 1.6; margin: 16px; }
  .box { border: 2px solid #1572B6; padding: 12px; margin-bottom: 12px; }
  .box p { margin: 0; }
  #special p { color: #27ae60; }                   /* 1,0,1 beats every class rule */
  .a .b .c .d { color: purple; }                   /* 0,4,0 */
  #x .d { color: orange; }                         /* 1,1,0 wins */
  .important { color: crimson !important; }
  button { font: inherit; }                        /* form controls do not inherit font by default */
  .reset { all: unset; cursor: pointer; text-decoration: underline; }
</style></head>
<body>
  <p>1. Layered: <span class="note">.note</span> in layer base loses to plain <code>p</code> in layer theme, so this paragraph is dark, not blue.</p>
  <div class="box" id="special"><p>2. #special p (1,0,1) makes this green over any class rule.</p></div>
  <div class="a" id="x"><div class="b"><div class="c"><p class="d">3. One ID (#x .d) beats four classes: this is orange.</p></div></div></div>
  <p class="important" style="color: blue">4. !important beats the inline style: crimson.</p>
  <div class="box"><p>5. Inherited font and line-height from body; the border is not inherited.<br>
  <button>Button with font: inherit</button> <button class="reset">all: unset button</button></p></div>
</body>
</html>
```

### Quiz

1. Which selector wins: `#nav a` or `ul.menu li a:hover`?
- [x] `#nav a`
- [ ] `ul.menu li a:hover`
- [ ] Whichever comes last
> (1,0,1) beats (0,2,3); an ID outranks any number of classes.

2. `!important` in an author stylesheet loses to…
- [ ] any inline style
- [x] an `!important` user or user-agent declaration
- [ ] a later normal rule
> Importance reverses the origin order, so important UA and user rules rank highest.

3. Which property is inherited by default?
- [ ] `margin`
- [x] `line-height`
- [ ] `border`
> Text-related properties inherit; box properties do not.

4. Unlayered author styles compared with `@layer` styles…
- [x] beat every layer
- [ ] lose to every layer
- [ ] are ignored
> Unlayered normal declarations have the highest priority among normal author styles.

5. What does `revert` do?
- [ ] Sets the spec default
- [x] Rolls the property back to the previous origin's value, usually the browser default
- [ ] Deletes the property
> `initial` is the spec value (`display: inline`); `revert` restores the user-agent stylesheet's value (`display: block` for `div`).

### Exercises

1. **Specificity calculation** — Compute the specificity of `header nav ul li a.active:hover::before` and of `#main .active`.
<details><summary>Solution</summary>

```text
header nav ul li a.active:hover::before  -> A=0, B=2 (.active, :hover), C=6 (header nav ul li a ::before) = (0,2,6)
#main .active                             -> A=1, B=1, C=0 = (1,1,0)  -> wins
```

</details>

2. **Override without !important** — A framework rule `.btn.btn-primary { background: navy }` must become brand blue. Write a selector that beats it without `!important` or IDs.
<details><summary>Solution</summary>

```css
.btn.btn-primary.brand { background: #1572B6; }   /* (0,3,0) beats (0,2,0); or put the framework in a lower @layer */
```

</details>

3. **Layer a reset** — Place a normalize stylesheet in a layer so any later unlayered rule beats it regardless of specificity.
<details><summary>Solution</summary>

```css
@import url("normalize.css") layer(reset);
@layer reset;
/* everything below, even a bare `p {}`, now beats normalize's rules */
```

</details>

### Interview Questions

**Q: Walk me through how the browser decides which declaration wins.**
For each property on each element it gathers every matching declaration, then filters in a fixed order: origin and importance first (normal author beats user beats user-agent, and `!important` reverses that), then cascade layers (later layer wins, unlayered author styles beat all layers), then specificity as an (ID, class, type) triple compared left to right, then source order, where the last declaration wins. Inline styles act as if they had specificity above any selector, and `!important` beats inline. Only after the cascade does inheritance fill in properties that no rule set, using the parent's computed value for inherited properties or the initial value otherwise. Being able to say this in order, and to name `@layer`, is what distinguishes a current answer from a 2015 one.

**Q: Why are IDs and `!important` discouraged in selectors?**
Both break the escalation ladder. An ID selector can only be overridden by another ID or `!important`, so a component styled with `#header a` forces every theme to repeat the ID; `!important` can only be beaten by another `!important` later in source, so once one appears they multiply. Low, flat specificity, one class per rule with `:where()` for defaults, keeps overrides predictable: a later class wins. Cascade layers solve the same problem structurally, letting a utilities layer beat components without any specificity contest. I keep `!important` for utility classes and print overrides where "always" is genuinely the intent.

**Q: What is the difference between `initial`, `inherit`, `unset` and `revert`?**
`inherit` copies the parent's computed value even for non-inherited properties like `border`. `initial` sets the specification's initial value, which is frequently surprising: `display: initial` is `inline` and `color: initial` is black regardless of the UA stylesheet. `unset` behaves as `inherit` for inherited properties and `initial` for the rest, so it is what `all: unset` uses to strip an element. `revert` rolls back to the value the previous origin would have given, so `display: revert` on a `div` is `block`, making it the right choice for "undo my styling but keep browser defaults", and `revert-layer` does the same one cascade layer up.

# LEVEL: Advanced

## Responsive design & media queries

**Responsive design** means one HTML document that looks right on a 360px phone, a 1440px monitor and an A4 page. The tools are a fluid layout by default, media queries for the moments the layout must change, container queries for components, and a viewport meta tag so phones do not pretend to be desktops.

### The viewport meta tag

Without this line a phone renders the page at 980px wide and zooms out:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Never add `maximum-scale=1` or `user-scalable=no`; they block pinch zoom and fail accessibility audits.

### Mobile-first media queries

A media query applies rules only when a condition holds. Write the small-screen styles first with no query, then add complexity as the screen grows with `min-width`:

```css
.cards { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 40em)  { .cards { grid-template-columns: repeat(2, 1fr); } }   /* 640px */
@media (min-width: 64em)  { .cards { grid-template-columns: repeat(3, 1fr); } }   /* 1024px */
```

Use `em` in queries: they scale with the user's font-size setting, whereas `px` breakpoints ignore it. Breakpoints should come from where *your content* breaks, not from device lists; resize the window until the layout looks wrong, and put a breakpoint there.

Range syntax (all modern browsers since 2023) reads more naturally:

```css
@media (width >= 40em) { … }
@media (40em <= width < 64em) { … }
```

### Other media features

| Feature | Use |
|---|---|
| `orientation: landscape` | Tablets and phone rotation |
| `hover: hover` / `pointer: fine` | Only show hover effects on devices that can hover |
| `prefers-color-scheme: dark` | Dark mode |
| `prefers-reduced-motion: reduce` | Turn off animations for users who asked |
| `prefers-contrast: more` | Stronger borders and text |
| `print` | Paper output (next level covers this in depth) |
| `resolution >= 2dppx` | High-density screens, sharper background images |

```css
@media (hover: hover) { .card:hover { box-shadow: 0 4px 12px rgb(0 0 0 / .15); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
@media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #eee; } }
```

### Fluid before breakpoints

Most responsive behaviour should come from CSS that flexes on its own, so you need fewer queries:

- `max-width: 100%` on images and `height: auto`.
- `clamp()` for fluid type: `font-size: clamp(1rem, .9rem + .5vw, 1.25rem)`.
- Grid `auto-fit` / `minmax()` for card rows.
- `flex-wrap: wrap` for toolbars.
- `min()` and `max()` for widths: `width: min(90%, 70rem)`.
- `overflow-x: auto` wrappers for wide tables, which cannot shrink below their content.

### Container queries

Media queries measure the viewport, but a KPI tile in a narrow sidebar needs to know how wide *its container* is. Container queries (all browsers since 2023) do exactly that:

```css
.sidebar, .main { container-type: inline-size; }
.kpi { display: grid; grid-template-columns: 1fr; }
@container (min-width: 320px) { .kpi { grid-template-columns: auto 1fr; } }
```

Any ancestor with `container-type: inline-size` becomes the measured container. Name containers with `container-name` when nesting. Container query units `cqw` and `cqh` (1% of the container) give fluid type relative to the component rather than the viewport.

### Responsive images

```html
<img src="cover-800.jpg" srcset="cover-400.jpg 400w, cover-800.jpg 800w, cover-1600.jpg 1600w"
     sizes="(min-width: 64em) 33vw, 100vw" alt="Handbook cover" width="800" height="1000" loading="lazy">
```

`srcset` lists candidates with their real widths; `sizes` tells the browser how wide the image will be displayed so it can pick the smallest adequate file before CSS loads. `width`/`height` attributes reserve space and prevent layout shift.

### Testing

Chrome DevTools device toolbar (Ctrl+Shift+M) emulates widths, DPR, touch and `prefers-*` settings. Test at 320px, 375px, 768px, 1024px and 1440px, plus 200% browser zoom, which behaves like a smaller viewport and is a WCAG requirement (reflow at 320 CSS pixels).

> **Tip:** Readers of a client's SOP on a phone need the table more than the sidebar. Reorder with Grid areas or `order` on small screens, and put the table in an `overflow-x: auto` wrapper with `position: sticky; left: 0` on the first column so row labels stay visible while scrolling sideways.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Responsive</title>
<style>
  :root { --bg: #fff; --fg: #222; --brand: #1572B6; }
  @media (prefers-color-scheme: dark) { :root { --bg: #1b1b1b; --fg: #eee; } }
  body { margin: 0; font-family: Arial, sans-serif; background: var(--bg); color: var(--fg); }
  h1 { font-size: clamp(1.25rem, 1rem + 2vw, 2.25rem); padding: 0 16px; }
  .layout { display: grid; gap: 16px; padding: 16px; grid-template-columns: 1fr; }
  @media (width >= 48em) { .layout { grid-template-columns: 260px 1fr; } }
  .sidebar, .main { container-type: inline-size; }
  .kpi { display: grid; gap: 4px; padding: 12px; border: 1px solid var(--brand); border-radius: 8px; margin-bottom: 12px; }
  .kpi b { font-size: 1.6rem; color: var(--brand); }
  @container (min-width: 300px) { .kpi { grid-template-columns: auto 1fr; align-items: center; } }
  .tablewrap { overflow-x: auto; }
  table { border-collapse: collapse; min-width: 560px; width: 100%; }
  th, td { padding: 6px 10px; border-bottom: 1px solid #999; text-align: left; white-space: nowrap; }
  th:first-child, td:first-child { position: sticky; left: 0; background: var(--bg); }
  @media (hover: hover) { tbody tr:hover { background: rgb(21 114 182 / .12); } }
</style></head>
<body>
  <h1>Responsive production report</h1>
  <div class="layout">
    <aside class="sidebar">
      <div class="kpi"><b>124</b><span>Files opened (stacked in a narrow container)</span></div>
      <div class="kpi"><b>98%</b><span>On time</span></div>
    </aside>
    <main class="main">
      <div class="kpi"><b>3</b><span>Escalations (side by side in a wide container)</span></div>
      <div class="tablewrap"><table>
        <thead><tr><th>State</th><th>Opened</th><th>Closed</th><th>On time</th><th>Escalations</th><th>QA</th></tr></thead>
        <tbody><tr><td>Wyoming</td><td>124</td><td>118</td><td>98%</td><td>1</td><td>4.7</td></tr>
        <tr><td>Colorado</td><td>310</td><td>290</td><td>94%</td><td>2</td><td>4.5</td></tr></tbody>
      </table></div>
      <p>Narrow the preview: the first column of the table stays put while you scroll it sideways.</p>
    </main>
  </div>
</body>
</html>
```

### Quiz

1. Mobile-first CSS uses mostly which query type?
- [x] `min-width`
- [ ] `max-width`
- [ ] `device-width`
> Base styles serve small screens; `min-width` queries add complexity as space grows.

2. Why prefer `em` over `px` in media queries?
- [ ] `px` is not allowed
- [x] `em` queries respond to the user's font-size setting and zoom consistently
- [ ] `em` queries are faster
> A user with a 20px default font reaches the "tablet" layout sooner, which keeps text readable.

3. A container query requires the ancestor to have…
- [ ] `display: grid`
- [x] `container-type: inline-size` (or `size`)
- [ ] `position: relative`
> Without a declared containment type the element is not a query container.

4. The `sizes` attribute on `<img>` tells the browser…
- [ ] the image's intrinsic size
- [x] how wide the image will be displayed, so it can choose from `srcset`
- [ ] the file size in bytes
> The browser picks the smallest candidate whose width covers the display width times the device pixel ratio.

### Exercises

1. **Three-to-one columns** — Write mobile-first CSS for `.grid` with one column, two from 36em and three from 60em.
<details><summary>Solution</summary>

```css
.grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
@media (width >= 36em) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (width >= 60em) { .grid { grid-template-columns: repeat(3, 1fr); } }
```

</details>

2. **Respect reduced motion** — Turn a 300ms hover transition off for users who prefer reduced motion.
<details><summary>Solution</summary>

```css
.card { transition: transform .3s; }
.card:hover { transform: translateY(-4px); }
@media (prefers-reduced-motion: reduce) { .card { transition: none; } .card:hover { transform: none; } }
```

</details>

3. **Component query** — Make `.profile` show its avatar beside the text only when the component itself is at least 400px wide.
<details><summary>Solution</summary>

```css
.profile-wrap { container-type: inline-size; }
.profile { display: grid; grid-template-columns: 1fr; }
@container (min-width: 400px) { .profile { grid-template-columns: 80px 1fr; } }
```

</details>

### Interview Questions

**Q: What is mobile-first design and why is it the default recommendation?**
Mobile-first means the base stylesheet, with no media queries, targets the smallest screen, and `min-width` queries progressively add layout as room appears. It forces content priority decisions early, produces smaller CSS for phones because they skip the queries entirely, and matches how CSS naturally works: a single-column stack is the default flow, so you add complexity rather than undoing it. Desktop-first with `max-width` queries tends to accumulate overrides that reset floats, widths and grids. The exception is a genuinely desktop-only internal tool, where the extra work has no audience.

**Q: How do container queries differ from media queries and when do you use each?**
Media queries test the viewport (or print) and are right for page-level decisions such as the number of layout columns or hiding a sidebar. Container queries test the size of a declared ancestor with `container-type`, so a component can adapt to where it is placed: the same KPI card renders stacked in a 240px sidebar and side-by-side in the main column on the same screen. They make components portable between pages and design systems, which media queries cannot because the component does not know its context. The rule I follow is shell decisions in media queries, component decisions in container queries, and fluid techniques like `clamp()` and `auto-fit` grids before either.

**Q: How do you keep a wide data table usable on phones?**
First accept that tables cannot reflow below their content, so wrap them in `overflow-x: auto` with `-webkit-overflow-scrolling` no longer needed, and make the first column sticky so row labels stay visible. Reduce padding and font size slightly, hide low-priority columns with a `max-width` query, and consider a "cards" transformation where each row becomes a block with `td::before { content: attr(data-label) }` supplying the column name. For very long reports, offer a download or a landscape print stylesheet rather than fighting the viewport. I have shipped all of these for rate matrices with fifteen columns.

## Transitions & animations

CSS can animate property changes smoothly without JavaScript. **Transitions** animate from one state to another when a property changes, such as on hover. **Animations** run keyframe sequences on their own, looping or once. Both run on the compositor when you animate `transform` and `opacity`, which makes them cheap.

### Transitions

```css
.btn { background: #1572B6; transition: background-color .2s ease, transform .15s ease-out; }
.btn:hover { background: #0f5a92; }
.btn:active { transform: scale(.97); }
```

The `transition` shorthand is `property duration timing-function delay`. List several separated by commas or use `transition: all .2s` (convenient, but animates properties you forgot about, including `width` during layout changes; be explicit in production).

Timing functions: `ease` (default), `linear`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier(x1, y1, x2, y2)` for custom curves and `steps(n)` for sprite or typewriter effects. Most UI feels best with `ease-out` for things appearing and `ease-in` for things leaving.

Not every property animates. Colours, lengths, numbers, transforms and shadows do; `display`, `visibility` (except at the ends), and `auto` values do not. Animating `height: auto` was impossible for years; now `interpolate-size: allow-keywords` (Chrome 129+) or a `grid-template-rows: 0fr` to `1fr` trick handles the expanding-panel case:

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s; }
.panel.open { grid-template-rows: 1fr; }
.panel > div { overflow: hidden; }
```

### Transforms

`transform` moves, scales, rotates and skews without affecting layout, so neighbours stay put and the browser can animate it on the GPU:

```css
.card:hover { transform: translateY(-4px) scale(1.02); }
.icon.spin  { transform: rotate(180deg); }
.thumb      { transform-origin: top left; }
```

Individual properties `translate`, `rotate` and `scale` (all browsers since 2022) let you animate one without rewriting the others.

### Keyframe animations

```css
@keyframes pulse {
  0%   { transform: scale(1);   opacity: 1; }
  50%  { transform: scale(1.1); opacity: .7; }
  100% { transform: scale(1);   opacity: 1; }
}
.saving { animation: pulse 1.2s ease-in-out infinite; }
```

The `animation` shorthand covers `name duration timing-function delay iteration-count direction fill-mode play-state`:

| Property | Values worth knowing |
|---|---|
| `animation-iteration-count` | number or `infinite` |
| `animation-direction` | `normal`, `reverse`, `alternate` |
| `animation-fill-mode` | `forwards` keeps the last frame, `backwards` applies the first frame during the delay, `both` |
| `animation-play-state` | `running`, `paused` |
| `animation-timing-function` | applies per keyframe segment, not to the whole animation |

`forwards` is the one you will need most: without it, a fade-in snaps back to the start state when it ends.

### A skeleton loader and a progress bar

```css
@keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
.skeleton { background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%); background-size: 200% 100%; animation: shimmer 1.5s linear infinite; }

@keyframes fill { from { width: 0; } to { width: var(--pct); } }
.bar > span { display: block; height: 8px; background: #1572B6; animation: fill 1s ease-out forwards; }
```

### Performance rules

The browser renders in stages: style, layout, paint, composite. Animating `width`, `margin` or `top` triggers layout every frame; `background` or `color` triggers paint; `transform` and `opacity` can be handled by the compositor alone. Stick to the last two for anything that runs continuously, and use `will-change: transform` sparingly to promote an element ahead of a heavy animation (it costs memory when left on permanently).

### Motion and accessibility

Vestibular disorders make large movements uncomfortable. Always honour the user's setting:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

Using a near-zero duration rather than `none` keeps `animationend` events firing for scripts that wait on them.

### Scroll-driven animations

`animation-timeline: scroll()` (Chromium 115+, with Safari and Firefox following in 2025) ties keyframes to scroll position instead of time, giving reading-progress bars and reveal-on-scroll effects with no JavaScript:

```css
.progress { animation: fill linear both; animation-timeline: scroll(root); }
```

> **Warning:** Animations in EPUB and print are ignored or, worse, frozen at frame 0. A fade-in with `opacity: 0` in the base state leaves invisible content in a PDF export. Keep the base state visible and add motion only inside `@media (prefers-reduced-motion: no-preference)`.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Motion</title>
<style>
  body { font-family: Arial, sans-serif; margin: 24px; }
  .btn { padding: 10px 18px; border: 0; border-radius: 6px; background: #1572B6; color: #fff; font: inherit; cursor: pointer;
         transition: background-color .2s ease, transform .15s ease-out, box-shadow .2s; }
  .btn:hover { background: #0f5a92; box-shadow: 0 4px 12px rgb(21 114 182 / .4); transform: translateY(-2px); }
  .btn:active { transform: scale(.97); }
  @keyframes pulse { 50% { transform: scale(1.08); opacity: .6; } }
  .saving { display: inline-block; margin-left: 12px; color: #27ae60; animation: pulse 1.2s ease-in-out infinite; }
  @keyframes fill { from { width: 0; } }
  .bar { height: 10px; background: #eee; border-radius: 5px; margin: 16px 0; overflow: hidden; }
  .bar > span { display: block; height: 100%; width: var(--pct); background: #1572B6; animation: fill 1.2s ease-out both; }
  .panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s ease; }
  .panel > div { overflow: hidden; }
  #toggle:checked ~ .panel { grid-template-rows: 1fr; }
  .card { display: inline-block; padding: 16px; border: 1px solid #ccc; border-radius: 8px; transition: transform .25s, box-shadow .25s; }
  .card:hover { transform: translateY(-4px) rotate(-1deg); box-shadow: 0 8px 20px rgb(0 0 0 / .15); }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
</style></head>
<body>
  <button class="btn">Save report</button><span class="saving">Saving…</span>
  <div class="bar"><span style="--pct: 72%"></span></div>
  <label><input type="checkbox" id="toggle"> Show details (animated height with grid rows)</label>
  <div class="panel"><div><p>Closed 118 of 124 files this week. Two escalations remain open with the underwriter and one file is waiting on a corrected legal description.</p></div></div>
  <p><span class="card">Hover me: transform and shadow only, no layout work.</span></p>
</body>
</html>
```

### Quiz

1. Which two properties animate most cheaply?
- [ ] `width` and `height`
- [x] `transform` and `opacity`
- [ ] `margin` and `padding`
> They can be composited without layout or paint.

2. A fade-in animation snaps back to invisible when it ends. Which fixes it?
- [ ] `animation-direction: reverse`
- [x] `animation-fill-mode: forwards`
- [ ] `animation-delay: 0s`
> `forwards` keeps the final keyframe's values after the animation completes.

3. `transition: all .3s` is discouraged because…
- [ ] it is invalid
- [x] it animates every changed property, including layout-triggering ones you did not intend
- [ ] it only works on hover
> Being explicit avoids janky width or margin transitions and unexpected side effects.

4. How do you respect users who turned off animations at OS level?
- [ ] `animation: none` everywhere
- [x] A `@media (prefers-reduced-motion: reduce)` block that shortens or removes motion
- [ ] Check the user agent string
> The media feature reflects the OS accessibility setting.

### Exercises

1. **Underline slide** — Make a link's underline grow from left to right on hover using a pseudo-element.
<details><summary>Solution</summary>

```css
a { position: relative; text-decoration: none; }
a::after { content: ""; position: absolute; left: 0; bottom: -2px; width: 100%; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .25s ease-out; }
a:hover::after { transform: scaleX(1); }
```

</details>

2. **Spinner** — Create a 32px circular loading spinner with a single rotating border.
<details><summary>Solution</summary>

```css
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { width: 32px; height: 32px; border: 4px solid #ddd; border-top-color: #1572B6; border-radius: 50%; animation: spin .8s linear infinite; }
```

</details>

3. **Staggered list** — Fade and slide in five list items one after another, 80ms apart.
<details><summary>Solution</summary>

```css
@keyframes rise { from { opacity: 0; transform: translateY(8px); } }
li { animation: rise .4s ease-out both; }
li:nth-child(2) { animation-delay: 80ms; } li:nth-child(3) { animation-delay: 160ms; }
li:nth-child(4) { animation-delay: 240ms; } li:nth-child(5) { animation-delay: 320ms; }
```

</details>

### Interview Questions

**Q: What is the difference between a transition and an animation?**
A transition interpolates a property between its old and new value when something changes it, such as a class toggle or `:hover`; it has one implicit start and end and cannot loop or define intermediate steps. An animation is defined by `@keyframes` with any number of steps, runs as soon as it is applied, can repeat, alternate and pause, and does not need a state change to start. Use transitions for interactive feedback and animations for attention, loading and entrance effects. Both fire DOM events (`transitionend`, `animationend`) and both are cancelled if the element is removed or `display: none` is applied.

**Q: Why are `transform` and `opacity` recommended for animation, and what is `will-change`?**
The rendering pipeline is style, layout, paint and composite. Changing geometry properties such as `width` or `top` forces layout of the element and possibly its neighbours on every frame; changing `background` forces repaint. `transform` and `opacity` can be applied by the compositor to an already-painted layer, so a 60fps animation costs almost nothing on the main thread. `will-change: transform` hints the browser to promote the element to its own layer in advance so the first frame does not stutter, but each layer costs GPU memory, so apply it just before the animation and remove it after, or only to a handful of elements.

**Q: How would you animate an accordion whose content height is unknown?**
`height: auto` cannot be transitioned in most browsers. The robust CSS-only approach is a grid wrapper: `grid-template-rows: 0fr` closed and `1fr` open, with the inner element set to `overflow: hidden`, and `fr` values interpolate smoothly. Alternatives are `max-height` with a generous cap (easing looks wrong because the interpolation runs to the cap), measuring `scrollHeight` in JavaScript and setting an explicit height, or `interpolate-size: allow-keywords` in Chromium 129+. I choose the grid method by default because it needs no measurement and survives content changes.

## Custom properties & calc()

**Custom properties** (CSS variables) let you define a value once and reuse it everywhere, and unlike preprocessor variables they live in the cascade: they inherit, change per component, per media query and per theme, and JavaScript can read and set them. **`calc()`** and its siblings let you mix units and compute values in the browser.

### Declaring and using

```css
:root {
  --brand: #1572B6;
  --brand-dark: #0f5a92;
  --space: 8px;
  --radius: 6px;
  --font-body: "Source Sans 3", Arial, sans-serif;
}
.btn { background: var(--brand); border-radius: var(--radius); padding: calc(var(--space) * 1.5) calc(var(--space) * 3); }
.btn:hover { background: var(--brand-dark); }
```

Names start with `--` and are case sensitive. `:root` is the usual home for global tokens because everything inherits from it. `var(--name, fallback)` supplies a fallback when the property is undefined:

```css
color: var(--fg, #222);
```

### They cascade and inherit

A custom property set on `.card` is seen by every descendant, so components can be re-skinned without new selectors:

```css
.card { --accent: var(--brand); border-top: 4px solid var(--accent); }
.card.warning { --accent: #e67e22; }
.card h3 { color: var(--accent); }
```

This is why themes are trivial: redefine tokens under a media query or a class and every rule that uses them updates.

```css
@media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #eee; --brand: #5aa9e6; } }
:root[data-theme="dark"] { --bg: #111; --fg: #eee; --brand: #5aa9e6; }
```

### Invalid at computed time

If a variable resolves to something the property cannot accept (`width: var(--brand)` with a colour), the declaration is not ignored the way an invalid literal would be; instead the property becomes `unset`. That surprises people: the element may lose its width entirely rather than keep the previous rule. `@property` fixes this by giving the variable a type and initial value, and also makes it animatable:

```css
@property --pct { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
.bar > span { width: var(--pct); transition: --pct .6s; }
```

`@property` is in all browsers since 2024 (Firefox 128).

### calc() and friends

`calc()` mixes units and expressions: `width: calc(100% - 240px)`, `margin-left: calc(var(--space) * -1)`. Whitespace around `+` and `-` is required. Division and multiplication need one unitless side.

| Function | Example | Meaning |
|---|---|---|
| `min()` | `width: min(90%, 70rem)` | The smaller value |
| `max()` | `font-size: max(1rem, 2vw)` | The larger value |
| `clamp()` | `padding: clamp(8px, 2vw, 24px)` | Preferred value bounded by min and max |
| `round()`, `mod()`, `rem()` | `round(down, 13px, 4px)` | Rounding arithmetic (2023+) |
| `abs()`, `sign()` | `abs(var(--x))` | Absolute value and sign (2024+) |
| `sin()`, `cos()`, `pow()`, `sqrt()` | `translate(calc(cos(45deg) * 100px))` | Trigonometry for radial layouts |

### A spacing scale

Design systems define spacing as multiples of a base to keep rhythm consistent:

```css
:root { --s-1: 4px; --s-2: 8px; --s-3: 16px; --s-4: 24px; --s-5: 40px; }
```

Or computed from one number so the scale changes together:

```css
:root { --unit: 8px; --s-3: calc(var(--unit) * 2); --s-4: calc(var(--unit) * 3); }
```

Both work; the explicit list is easier to read in DevTools, the computed one is easier to retune.

### JavaScript interop

```js
const root = document.documentElement;
getComputedStyle(root).getPropertyValue("--brand");   // " #1572B6"
root.style.setProperty("--brand", "#8E44AD");
bar.style.setProperty("--pct", "72%");
```

Passing a single value from JS and letting CSS do the layout is cleaner than setting many properties from script. Progress bars, chart heights and colour pickers all work this way.

### Where variables do not work

Custom properties cannot be used in media query conditions (`@media (min-width: var(--bp))` is invalid), in selectors, or in `url()`. For breakpoints use a preprocessor or `@custom-media` via PostCSS. WeasyPrint supports `var()` and `calc()` since version 53, and EPUB readers based on modern WebKit or Chromium support them, but older Kindle and ADE 2.x do not, so ebook stylesheets keep literal values or generate them at build time.

> **Interview note:** Interviewers ask "why use CSS variables when Sass has variables?" The answer is runtime: Sass variables are gone after compilation, while custom properties can change per element, per media query, per theme, and from JavaScript, and they are read by `calc()` in the browser with the real viewport size.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Custom properties</title>
<style>
  :root { --brand: #1572B6; --bg: #fff; --fg: #222; --unit: 8px; --radius: 8px; --sidebar: 200px; }
  :root[data-theme="dark"] { --brand: #5aa9e6; --bg: #1b1b1b; --fg: #eee; }
  body { margin: 0; font-family: Arial, sans-serif; background: var(--bg); color: var(--fg); transition: background-color .3s, color .3s; }
  .layout { display: grid; grid-template-columns: var(--sidebar) calc(100% - var(--sidebar)); }
  aside { padding: calc(var(--unit) * 2); background: color-mix(in srgb, var(--brand) 12%, var(--bg)); }
  main { padding: calc(var(--unit) * 3); }
  .card { --accent: var(--brand); border-left: 5px solid var(--accent); border-radius: var(--radius); padding: calc(var(--unit) * 2); margin-bottom: calc(var(--unit) * 2); box-shadow: 0 1px 4px rgb(0 0 0 / .1); }
  .card.warning { --accent: #e67e22; }
  .card.danger  { --accent: #c0392b; }
  .card h3 { margin: 0 0 var(--unit); color: var(--accent); }
  @property --pct { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
  .bar { height: 10px; background: #ddd; border-radius: 5px; overflow: hidden; }
  .bar > span { display: block; height: 100%; width: var(--pct); background: var(--accent, var(--brand)); transition: --pct .8s ease-out; }
  button { font: inherit; padding: var(--unit) calc(var(--unit) * 2); border: 0; border-radius: var(--radius); background: var(--brand); color: #fff; cursor: pointer; }
</style></head>
<body>
  <div class="layout">
    <aside><button onclick="document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? '' : 'dark'">Toggle theme</button>
      <p><button onclick="document.querySelectorAll('.bar > span').forEach(s => s.style.setProperty('--pct', (40 + Math.random() * 60) + '%'))">Randomise progress</button></p></aside>
    <main>
      <div class="card"><h3>Wyoming</h3><div class="bar"><span style="--pct: 98%"></span></div></div>
      <div class="card warning"><h3>Colorado (accent overridden per card)</h3><div class="bar"><span style="--pct: 74%"></span></div></div>
      <div class="card danger"><h3>Texas</h3><div class="bar"><span style="--pct: 41%"></span></div></div>
    </main>
  </div>
</body>
</html>
```

### Quiz

1. Where are global design tokens usually declared?
- [ ] `body`
- [x] `:root`
- [ ] `html *`
> `:root` matches `<html>` and has higher specificity than `html`; everything inherits from it.

2. `width: var(--brand)` where `--brand` is a colour results in…
- [ ] the previous valid width being kept
- [x] the property becoming `unset` (invalid at computed time)
- [ ] a parse error that removes the whole rule
> Variables are substituted at computed-value time, after parsing, so the fallback is `unset`, not the earlier declaration.

3. Which is invalid?
- [ ] `calc(100% - 2rem)`
- [x] `@media (min-width: var(--bp))`
- [ ] `var(--gap, 8px)`
> Custom properties cannot appear in media query conditions or selectors.

4. What does `@property` add?
- [x] A type, inheritance flag and initial value, making the variable animatable and type-safe
- [ ] A way to use variables in selectors
- [ ] Sass-style compile-time constants
> Typed properties transition smoothly and fall back to their initial value when invalid.

### Exercises

1. **Theme switch** — Define light and dark tokens for background, text and link colour, switched by `data-theme="dark"` on `<html>` and by the OS preference.
<details><summary>Solution</summary>

```css
:root { --bg: #fff; --fg: #222; --link: #1572B6; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #111; --fg: #eee; --link: #5aa9e6; } }
:root[data-theme="dark"] { --bg: #111; --fg: #eee; --link: #5aa9e6; }
body { background: var(--bg); color: var(--fg); } a { color: var(--link); }
```

</details>

2. **Fluid gutter** — Set `--gutter` to at least 16px, ideally 4vw, at most 48px, and use it as page padding.
<details><summary>Solution</summary>

```css
:root { --gutter: clamp(16px, 4vw, 48px); }
.page { padding-inline: var(--gutter); }
```

</details>

3. **Column count from a variable** — Let `.grid` read `--cols` (default 3) and lay out that many equal columns.
<details><summary>Solution</summary>

```css
.grid { display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr)); gap: 1rem; }
.grid.wide { --cols: 4; }
```

</details>

### Interview Questions

**Q: How do CSS custom properties differ from Sass variables?**
Sass variables are resolved at compile time into literal values and disappear from the output, so they cannot respond to the viewport, a theme class, a component's ancestor or JavaScript. Custom properties are real cascaded, inherited values evaluated in the browser: `--accent` set on `.card.warning` re-colours every descendant rule, a media query can redefine tokens for dark mode, and `element.style.setProperty` updates them live. Sass still wins for things CSS cannot do at runtime, such as breakpoints, loops and mixins, so many teams use Sass for structure and custom properties for tokens and theming.

**Q: What does "invalid at computed-value time" mean and how do you guard against it?**
When a `var()` substitution produces a value the property cannot parse, the browser has already discarded other declarations for that property during cascade, so it cannot fall back to an earlier rule; the property becomes `unset`, which is `inherit` for inherited properties and `initial` otherwise. That can silently drop a width or turn text the parent's colour. Guards are a fallback in `var(--x, 16px)`, always defining tokens on `:root`, and registering the property with `@property` and an `initial-value`, which also gives typed interpolation. Linting with Stylelint's `custom-property-no-missing-var-function` and a token file that is the single source of truth catch most mistakes.

**Q: Give an example where `calc()` with a custom property removed JavaScript from a project.**
A progress bar and a chart with bars sized from data: the server renders `style="--pct: 72%"` on each row and CSS does `width: var(--pct)`, with `@property` making the value animate on update. Another is a sidebar layout where `--sidebar: 240px` drives both the sidebar width and `calc(100% - var(--sidebar))` for the main column, so collapsing the sidebar is a single variable change on a class rather than resizing two elements in script. In a WeasyPrint report I also used `calc()` to compute column widths from a `--cols` variable so one stylesheet served five-column and seven-column rate matrices.

## Typography systems & brand fonts

Typography is most of what a reader sees. A **type system** is a small set of decisions, font families, a size scale, line-height, measure and spacing, applied consistently so a 767-page handbook and its one-page summary look like they came from the same hand. This chapter builds one and shows how brand fonts are loaded reliably for web, PDF and EPUB.

### Choosing and stacking families

Pick two families at most: a body face (high x-height, generous spacing) and a display face for headings. Provide fallbacks that share proportions so layout barely moves if the web font fails:

```css
:root {
  --font-body: "Source Serif 4", Georgia, "Times New Roman", serif;
  --font-head: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: "JetBrains Mono", Consolas, "Courier New", monospace;
}
body { font-family: var(--font-body); }
h1, h2, h3 { font-family: var(--font-head); }
```

System stacks (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) load instantly and suit dashboards; brand faces suit marketing and client deliverables.

### Loading brand fonts

For a client's `.dotx` template suite, Ali receives the brand font as OTF/TTF. For the web, convert to WOFF2 (30–50% smaller) and declare:

```css
@font-face {
  font-family: "Brand Sans";
  src: url("fonts/brand-sans-regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Brand Sans";
  src: url("fonts/brand-sans-bold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}
```

One `@font-face` per weight and style, with the same `font-family` name, so `font-weight: 700` picks the real bold rather than a synthesised one. `font-display: swap` shows fallback text immediately and swaps when the font arrives; `optional` skips the font on slow connections; `block` hides text briefly (use for icon fonts only). Preload the critical file: `<link rel="preload" href="fonts/brand-sans-regular.woff2" as="font" type="font/woff2" crossorigin>`.

Variable fonts pack all weights into one file: `font-weight: 100 900;` in the descriptor and any weight works. Subset with `unicode-range` so Latin-only pages skip Arabic or Cyrillic glyph blocks.

For WeasyPrint, the same `@font-face` works with a `file://` or relative URL; for EPUB, fonts go inside the container, and the OPF manifest lists them with `media-type="font/woff2"` (or `application/vnd.ms-opentype` for OTF). Kindle ignores embedded fonts unless the reader chooses "Publisher font".

### A modular size scale

Sizes chosen by ratio look intentional. With a 1rem base and a 1.25 ratio:

| Token | Size | Use |
|---|---|---|
| `--fs--1` | 0.8rem | Captions, footnotes |
| `--fs-0` | 1rem | Body |
| `--fs-1` | 1.25rem | h4, lead paragraph |
| `--fs-2` | 1.563rem | h3 |
| `--fs-3` | 1.953rem | h2 |
| `--fs-4` | 2.441rem | h1 |

Make each step fluid with `clamp()` so headings shrink on phones:

```css
:root { --fs-4: clamp(1.8rem, 1.3rem + 2.5vw, 2.441rem); }
```

### Line-height, measure and spacing

- **Line-height**: 1.4–1.6 for body text, tighter (1.1–1.2) for large headings. Always unitless (`line-height: 1.5`), so it scales with each element's font size instead of inheriting a fixed length.
- **Measure**: 45–75 characters per line; `max-width: 65ch` on text containers.
- **Vertical rhythm**: margins in multiples of the body line-height (`margin-block: 0 1.5rem`).
- **Letter-spacing**: slight positive tracking for all-caps labels (`letter-spacing: .05em; text-transform: uppercase`), never for lowercase body text.

```css
p { max-width: 65ch; line-height: 1.55; margin: 0 0 1.5rem; }
h2 { font-size: var(--fs-3); line-height: 1.2; margin: 3rem 0 1rem; letter-spacing: -.01em; }
```

### OpenType features and details

```css
body { font-kerning: normal; font-variant-ligatures: common-ligatures; text-rendering: optimizeLegibility; }
.num { font-variant-numeric: tabular-nums; }           /* columns of figures line up */
h1   { font-variant-numeric: lining-nums; }
.smallcaps { font-variant-caps: small-caps; }
p    { hanging-punctuation: first; text-wrap: pretty; }  /* pretty: avoids orphans, Chrome 117+ */
h1   { text-wrap: balance; }                            /* even heading lines */
```

Tabular numerals are essential in any rate matrix or financial table; proportional figures make columns wobble. `hyphens: auto` with `lang="en"` on the `<html>` element enables dictionary hyphenation, which WeasyPrint honours through the Pyphen dictionaries it bundles.

### Text properties recap

`text-align` (`start`, `end`, `justify`: justify only with hyphenation on), `text-indent` (classic novel style: indent all but the first paragraph with `p + p { text-indent: 1.5em }`), `text-decoration-thickness` and `text-underline-offset` for tasteful links, `text-overflow: ellipsis` (needs `white-space: nowrap` and `overflow: hidden`), and `-webkit-line-clamp` for multi-line truncation.

> **Tip:** Keep a `typography.css` that only defines tokens and element defaults, and reuse it across the website, the WeasyPrint stylesheet and the EPUB. The print version changes the units (`pt`), the sizes and `hyphens`, nothing else, and clients see one brand everywhere.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Type system</title>
<style>
  :root {
    --font-body: Georgia, "Times New Roman", serif;
    --font-head: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --fs--1: .8rem; --fs-0: 1rem; --fs-1: 1.25rem; --fs-2: 1.563rem; --fs-3: 1.953rem;
    --fs-4: clamp(1.8rem, 1.3rem + 2.5vw, 2.441rem);
    --lh: 1.55; --brand: #1572B6;
  }
  body { font-family: var(--font-body); font-size: var(--fs-0); line-height: var(--lh); margin: 0 auto; padding: 2rem 1rem; max-width: 42rem; color: #222;
         font-kerning: normal; font-variant-ligatures: common-ligatures; }
  h1, h2, h3 { font-family: var(--font-head); line-height: 1.2; letter-spacing: -.01em; text-wrap: balance; }
  h1 { font-size: var(--fs-4); margin: 0 0 .5rem; color: var(--brand); }
  h2 { font-size: var(--fs-2); margin: 2.5rem 0 .75rem; }
  .lead { font-size: var(--fs-1); color: #444; }
  p { margin: 0 0 1.5rem; max-width: 65ch; text-wrap: pretty; hyphens: auto; }
  p + p { text-indent: 1.5em; margin-top: -1.5rem; }
  .label { font-family: var(--font-head); font-size: var(--fs--1); text-transform: uppercase; letter-spacing: .08em; color: #666; }
  table { border-collapse: collapse; font-family: var(--font-head); font-size: var(--fs--1); }
  td, th { padding: 4px 12px; border-bottom: 1px solid #ddd; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.prop { text-align: right; font-variant-numeric: proportional-nums; }
  a { color: var(--brand); text-decoration-thickness: 1px; text-underline-offset: 3px; }
</style></head>
<body>
  <p class="label">Policy manual, section 4</p>
  <h1>Escrow disbursement procedures and the weekly reconciliation</h1>
  <p class="lead">A lead paragraph one step up the scale introduces the section with a slightly larger, lighter voice.</p>
  <h2>Reconciliation</h2>
  <p>Every disbursement is matched against the settlement statement before the weekly production report is released to management. Discrepancies larger than fifty dollars are escalated to the underwriter the same day.</p>
  <p>This second paragraph has a first-line indent and no top margin, the classic book convention, and the measure is capped at sixty-five characters so lines stay comfortable to read.</p>
  <table><tr><th>State</th><th>Tabular</th><th>Proportional</th></tr>
  <tr><td>Wyoming</td><td class="num">1,118.00</td><td class="prop">1,118.00</td></tr>
  <tr><td>Texas</td><td class="num">7,111.11</td><td class="prop">7,111.11</td></tr></table>
  <p style="margin-top:1rem">Note how the tabular column aligns digit for digit. <a href="#">Read the full SOP</a>.</p>
</body>
</html>
```

### Quiz

1. Why declare `line-height: 1.5` instead of `line-height: 24px` on `body`?
- [x] A unitless value is recomputed against each element's own font size
- [ ] Pixels are not allowed on `body`
- [ ] Unitless values render faster
> A fixed 24px inherited by a 32px heading gives overlapping lines; `1.5` gives 48px.

2. Which `font-display` value shows fallback text immediately and swaps when the web font loads?
- [ ] `block`
- [x] `swap`
- [ ] `auto`
> `swap` avoids invisible text; `optional` may skip the font entirely on slow networks.

3. Columns of numbers in a rate table should use…
- [ ] `font-variant-numeric: oldstyle-nums`
- [x] `font-variant-numeric: tabular-nums`
- [ ] `letter-spacing: .1em`
> Tabular figures share one advance width so digits align vertically.

4. A recommended body measure is about…
- [ ] 30 characters
- [x] 45–75 characters
- [ ] 120 characters
> `max-width: 65ch` is the usual implementation.

### Exercises

1. **Variable font** — Declare a variable font "Brand VF" from a single WOFF2 supporting weights 300 to 800, then use weight 650 for headings.
<details><summary>Solution</summary>

```css
@font-face { font-family: "Brand VF"; src: url("brand-vf.woff2") format("woff2"); font-weight: 300 800; font-display: swap; }
h1, h2 { font-family: "Brand VF", sans-serif; font-weight: 650; }
```

</details>

2. **Two-line clamp** — Truncate card descriptions after two lines with an ellipsis.
<details><summary>Solution</summary>

```css
.desc { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
/* the unprefixed `line-clamp` property is arriving in 2025 browsers; keep the prefixed form until support is universal */
```

</details>

3. **Print units** — Rewrite the body and h1 sizes of the type system for a WeasyPrint stylesheet in points.
<details><summary>Solution</summary>

```css
@media print { body { font-size: 10.5pt; line-height: 1.4; } h1 { font-size: 22pt; } h2 { font-size: 15pt; } p { hyphens: auto; } }
```

</details>

### Interview Questions

**Q: How do you load a brand web font without hurting performance or layout stability?**
Convert to WOFF2, subset it to the scripts actually used, and declare one `@font-face` per weight with `font-display: swap` so text is never invisible. Preload the body regular weight with `<link rel="preload" as="font" crossorigin>` so it starts downloading before CSS is parsed, and self-host rather than using a third-party CDN to avoid an extra connection. To limit layout shift, choose a fallback with similar metrics and tune it with `size-adjust`, `ascent-override` and `descent-override` in a second `@font-face` for the fallback family. Measure with Lighthouse's CLS and the font-display audit, and prefer a variable font when three or more weights are needed.

**Q: What makes a good typographic scale and how do you implement it?**
A scale is a small set of sizes related by a consistent ratio (1.2 to 1.333 for text-heavy sites, larger for marketing) so heading hierarchy is visible without being arbitrary. Implement it as custom properties (`--fs-0` to `--fs-4`) computed from a base, wrap the large steps in `clamp()` so they scale fluidly with the viewport, and pair each step with an appropriate line-height, tight for display sizes and 1.5 for body. Spacing then follows the same rhythm, using multiples of the body line-height for margins. Tools like Utopia generate the clamp values; the important part is that every element references a token rather than a literal size.

**Q: How does typography differ between web, PDF and EPUB outputs of the same document?**
On the web I use `rem` sizes, fluid `clamp()` headings, `max-width: 65ch` and `text-wrap: pretty`. For print via WeasyPrint I switch to points and millimetres, enable `hyphens: auto` with `text-align: justify`, set `orphans: 2; widows: 2`, and embed fonts by file path since there is no network. For EPUB I keep sizes in `em` relative to the reader's chosen base, avoid fixed line-height and `!important` so user settings win, keep font stacks simple because embedded fonts are optional on most readers, and never rely on `ch` or `clamp()` for older devices. The shared part is the token names and hierarchy; only the values and units change per target.

## Tables & forms styling

Tables and forms are where CSS meets the browser's own opinions. Both come with strong default styling, and both are where Ali's deliverables live: rate matrices, production reports, intake forms. This chapter makes them readable, accessible and consistent across browsers.

### Table basics

```css
table { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; }
th, td { padding: 8px 12px; border-bottom: 1px solid #ddd; text-align: left; vertical-align: top; }
thead th { background: #eef4fa; color: #1572B6; border-bottom: 2px solid #1572B6; }
tbody tr:nth-child(even) { background: #fafcfe; }
tbody tr:hover { background: #fff3cd; }
td.num, th.num { text-align: right; }
caption { caption-side: top; text-align: left; font-weight: bold; padding: 8px 0; }
```

`border-collapse: collapse` merges adjacent borders into one line; the default `separate` model with `border-spacing` is what gives the double-line look. Right-align numbers and give every column a consistent alignment, otherwise figures are hard to compare. `caption` is the accessible title and should be used instead of a heading above the table.

### Column widths

Browsers size columns automatically from content, which can be slow and unpredictable on large tables. `table-layout: fixed` uses the first row's widths (or `<col>` elements) and renders faster:

```css
table.rates { table-layout: fixed; }
```

```html
<colgroup><col style="width: 30%"><col style="width: 20%"><col><col></colgroup>
```

With fixed layout, long text wraps within its column instead of stretching it; combine with `overflow-wrap: anywhere` for unbroken IDs.

### Sticky headers and scroll

```css
.tablewrap { max-height: 60vh; overflow: auto; }
thead th { position: sticky; top: 0; z-index: 1; }
tbody th, td:first-child { position: sticky; left: 0; background: #fff; }
```

Sticky cells need an opaque background or rows will show through. In print, `thead` automatically repeats on every page in browsers and WeasyPrint; `display: table-header-group` is the default that makes it happen.

### Responsive tables

Two approaches: horizontal scroll inside a wrapper (safe, keeps data intact) or a "stacked" transformation for small screens:

```css
@media (max-width: 40em) {
  table.stack thead { display: none; }
  table.stack tr { display: block; margin-bottom: 1rem; border: 1px solid #ddd; }
  table.stack td { display: flex; justify-content: space-between; border: 0; padding: 6px 12px; }
  table.stack td::before { content: attr(data-label); font-weight: bold; color: #555; }
}
```

Each `<td>` carries `data-label="State"`; the pseudo-element prints it as a row label.

### Form controls

Browsers style inputs differently. A consistent base:

```css
input, select, textarea, button { font: inherit; color: inherit; }
input:not([type=checkbox]):not([type=radio]), select, textarea {
  width: 100%; padding: 8px 10px; border: 1px solid #999; border-radius: 6px; background: #fff;
}
input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid #1572B6; outline-offset: 2px; border-color: #1572B6; }
textarea { min-height: 6rem; resize: vertical; }
input:disabled { background: #f3f3f3; color: #777; cursor: not-allowed; }
```

Always set `font: inherit`: controls do not inherit fonts by default, and the 13px default on desktop is the reason forms look off-brand. On iOS, any input smaller than 16px triggers zoom on focus, so keep controls at 1rem.

`appearance: none` strips native chrome from `select`, checkboxes and radios so you can restyle them; then draw your own arrow with a background SVG or use `accent-color` to keep the native control but tint it:

```css
input[type=checkbox], input[type=radio], input[type=range], progress { accent-color: #1572B6; }
select { appearance: none; background: #fff url("data:image/svg+xml,...") no-repeat right 10px center; padding-right: 32px; }
```

`accent-color` (all browsers since 2022) is the low-effort path and keeps accessibility features intact.

### Layout and labels

```css
.field { display: grid; gap: 4px; margin-bottom: 1rem; }
.field label { font-weight: 600; }
.field .hint { font-size: .85rem; color: #666; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
fieldset { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; }
legend { padding: 0 .5em; font-weight: bold; color: #1572B6; }
```

Every control needs a `<label for>` or wrapping label; placeholder text is not a label because it vanishes on input. Stack labels above inputs on all screen sizes unless the form is a dense internal tool; side-by-side labels need a two-column grid with `align-items: baseline`.

### Validation states

```css
input:user-invalid { border-color: #c0392b; }
input:user-invalid + .error { display: block; }
.error { display: none; color: #c0392b; font-size: .85rem; }
input:user-valid { border-color: #27ae60; }
```

Pair colour with text or an icon; colour alone fails WCAG for colour-blind users. Wire `aria-describedby` from the input to its hint and error message so screen readers announce them.

> **Warning:** Never hide the focus outline globally with `*:focus { outline: none }`. Replace it with `:focus-visible` styling that has at least 3:1 contrast against the background, otherwise keyboard users cannot see where they are, and accessibility audits fail the whole form.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Tables and forms</title>
<style>
  body { font-family: Arial, sans-serif; margin: 16px; color: #222; }
  table { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; table-layout: fixed; }
  caption { caption-side: top; text-align: left; font-weight: bold; padding: 8px 0; }
  th, td { padding: 8px 12px; border-bottom: 1px solid #ddd; text-align: left; overflow-wrap: anywhere; }
  thead th { background: #eef4fa; color: #1572B6; border-bottom: 2px solid #1572B6; position: sticky; top: 0; }
  tbody tr:nth-child(even) { background: #fafcfe; }
  tbody tr:hover { background: #fff3cd; }
  .num { text-align: right; }
  tfoot td { font-weight: bold; border-top: 2px solid #333; }
  @media (max-width: 40em) {
    table.stack thead { display: none; }
    table.stack tr { display: block; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 6px; }
    table.stack td { display: flex; justify-content: space-between; border: 0; }
    table.stack td::before { content: attr(data-label); font-weight: bold; color: #555; }
  }
  form { margin-top: 2rem; max-width: 520px; }
  input, select, textarea, button { font: inherit; color: inherit; }
  .field { display: grid; gap: 4px; margin-bottom: 1rem; }
  .field label { font-weight: 600; }
  input:not([type=checkbox]), select, textarea { width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #999; border-radius: 6px; }
  :focus-visible { outline: 2px solid #1572B6; outline-offset: 2px; }
  input:user-invalid { border-color: #c0392b; }
  input:user-invalid + .error { display: block; }
  .error { display: none; color: #c0392b; font-size: .85rem; }
  input[type=checkbox] { accent-color: #1572B6; width: 1.1em; height: 1.1em; }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  button { padding: 10px 18px; border: 0; border-radius: 6px; background: #1572B6; color: #fff; cursor: pointer; }
</style></head>
<body>
  <table class="stack"><caption>Owner's policy rate matrix (excerpt)</caption>
    <colgroup><col style="width:34%"><col><col><col></colgroup>
    <thead><tr><th>Coverage up to</th><th class="num">Standard</th><th class="num">Reissue</th><th class="num">Simultaneous</th></tr></thead>
    <tbody>
      <tr><td data-label="Coverage">$100,000</td><td class="num" data-label="Standard">575.00</td><td class="num" data-label="Reissue">345.00</td><td class="num" data-label="Simultaneous">100.00</td></tr>
      <tr><td data-label="Coverage">$250,000</td><td class="num" data-label="Standard">1,118.00</td><td class="num" data-label="Reissue">670.80</td><td class="num" data-label="Simultaneous">100.00</td></tr>
      <tr><td data-label="Coverage">$500,000</td><td class="num" data-label="Standard">1,830.00</td><td class="num" data-label="Reissue">1,098.00</td><td class="num" data-label="Simultaneous">100.00</td></tr>
    </tbody>
    <tfoot><tr><td>Rates shown</td><td class="num">3</td><td class="num">3</td><td class="num">3</td></tr></tfoot>
  </table>
  <form onsubmit="return false">
    <div class="row2">
      <div class="field"><label for="f">File number</label><input id="f" required pattern="[A-Z]{2}-\d{6}" placeholder="WY-123456" aria-describedby="fe"><span class="error" id="fe">Format: two letters, dash, six digits.</span></div>
      <div class="field"><label for="s">State</label><select id="s"><option>Wyoming</option><option>Colorado</option><option>Texas</option></select></div>
    </div>
    <div class="field"><label for="n">Notes</label><textarea id="n"></textarea></div>
    <label><input type="checkbox"> Reviewed by QA</label>
    <p><button>Submit</button></p>
  </form>
</body>
</html>
```

### Quiz

1. Which property merges adjacent table cell borders into single lines?
- [x] `border-collapse: collapse`
- [ ] `border-spacing: 0`
- [ ] `table-layout: fixed`
> `border-spacing: 0` still draws two touching borders; collapse merges them.

2. Why add `font: inherit` to `input`, `select` and `button`?
- [ ] To make them bold
- [x] Because form controls do not inherit the page font by default
- [ ] It is required for `:focus`
> The user-agent stylesheet sets a system font and size on controls.

3. The quickest way to tint native checkboxes and radios with the brand colour is…
- [ ] `background-color`
- [x] `accent-color`
- [ ] `appearance: none` plus a custom drawing
> `accent-color` keeps native behaviour and accessibility while recolouring.

4. On a sticky `thead th` rows show through when scrolling. The fix is…
- [ ] `z-index: 9999`
- [x] give the sticky cell an opaque `background`
- [ ] `overflow: hidden` on the table
> Sticky cells are transparent by default, so content scrolls behind them visibly.

### Exercises

1. **Financial table** — Style `table.fin` with right-aligned tabular numbers, a bold total row and negative values in red via a `.neg` class.
<details><summary>Solution</summary>

```css
table.fin td:not(:first-child) { text-align: right; font-variant-numeric: tabular-nums; }
table.fin tr.total td { font-weight: bold; border-top: 2px solid #333; }
table.fin .neg { color: #c0392b; }
```

</details>

2. **Inline label form** — Lay out labels in a 160px column beside their inputs, aligned on the text baseline, collapsing to stacked labels below 30em.
<details><summary>Solution</summary>

```css
.field { display: grid; grid-template-columns: 160px 1fr; gap: 8px 12px; align-items: baseline; }
@media (max-width: 30em) { .field { grid-template-columns: 1fr; } }
```

</details>

3. **Custom select arrow** — Remove the native select appearance and draw a chevron with an inline SVG background.
<details><summary>Solution</summary>

```css
select { appearance: none; padding-right: 32px;
  background: #fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' fill='none' stroke='%23333' stroke-width='2'/></svg>") no-repeat right 10px center; }
```

</details>

### Interview Questions

**Q: How do you make a wide data table work on a phone without losing information?**
The first option is a scroll wrapper with `overflow-x: auto` and a sticky first column, which keeps the table semantics and works for any column count. The second is the stacked pattern: under a `max-width` query, hide `thead`, display each row as a block and each cell as a flex row with `td::before { content: attr(data-label) }` supplying the header text, which reads naturally on a narrow screen but needs the `data-label` attributes generated in the template. I choose scrolling for numeric matrices where comparing columns matters and stacking for record-style tables such as a list of files with a few fields each. In both cases `table-layout: fixed` and `overflow-wrap: anywhere` prevent a single long value from breaking the layout.

**Q: What are the accessibility essentials of a styled form?**
Every control has a programmatically associated label (`<label for>` or wrapping), placeholders are hints not labels, and hints and errors are linked with `aria-describedby`. Focus is always visible with a `:focus-visible` style of at least 3:1 contrast, and hover effects do not replace it. Validation states use text or icons in addition to colour, errors appear near the field and are announced, and required fields are marked in text, not only with an asterisk colour. Controls have at least 24 by 24 CSS pixel targets, `font-size` of 1rem to avoid iOS zoom, and native semantics are kept where possible (`accent-color` instead of rebuilding checkboxes) so keyboard and screen-reader behaviour comes for free.

**Q: `table-layout: auto` versus `fixed`: what changes?**
With `auto`, the browser reads every cell to compute column widths, so the widest content wins and rendering a 5,000-row table waits on the whole table. With `fixed`, widths come from the table's width plus the first row or `<col>` elements, the browser can render rows as they arrive, and long content wraps or overflows within its column rather than resizing it. `fixed` is faster and predictable and is what I use for rate matrices and reports; `auto` is better for small tables whose content varies wildly. `fixed` requires an explicit `width` on the table, otherwise it behaves like `auto`.

# LEVEL: Expert

## Print CSS & paged media (WeasyPrint)

Browsers paginate a page only when you print it, but a **paged media** engine such as **WeasyPrint** treats pagination as the main job: page size, margins, running headers and footers, page numbers, and control over where content breaks. This is the CSS that turns an HTML policy manual into a print-ready PDF with "Page 12 of 767" in the footer, and it is Ali's daily tool.

### The @page rule

```css
@page {
  size: A4;                 /* or letter, legal, A5, 210mm 297mm, A4 landscape */
  margin: 20mm 18mm 22mm;   /* top, sides, bottom */
}
@page :first { margin-top: 40mm; }        /* title page */
@page :left  { margin-right: 25mm; }      /* inner margins for binding */
@page :right { margin-left: 25mm; }
@page cover  { margin: 0; }               /* a named page */
.cover { page: cover; }                   /* elements that use it */
```

`size` is the physical paper size. `:first`, `:left`, `:right` and `:blank` select page types; named pages (`page: cover`) let one document mix portrait and landscape sections: `@page wide { size: A4 landscape; }` with `table.rates { page: wide; }` puts every rate matrix on its own landscape page.

### Margin boxes: running headers and footers

Each page has sixteen margin boxes (`@top-left`, `@top-center`, `@top-right`, `@bottom-left`, `@bottom-center`, `@bottom-right`, plus corners and side boxes). Content goes in with `content`:

```css
@page {
  @top-left    { content: "Employee Handbook"; font-size: 9pt; color: #666; }
  @top-right   { content: string(chapter); font-size: 9pt; }
  @bottom-center { content: "Page " counter(page) " of " counter(pages); font-size: 9pt; }
}
h1 { string-set: chapter content(); }
```

`counter(page)` is the current page and `counter(pages)` the total. `string-set` copies the text of the current `h1` into a named string, and `string(chapter)` prints it in the header: running headers that update per chapter, exactly like Word's "StyleRef" field. `string(chapter, first)` or `last` chooses which heading to use when several appear on one page.

For rich headers (logo plus text), use **running elements**:

```css
.pagehead { position: running(header); }
@page { @top-center { content: element(header); } }
```

```html
<div class="pagehead"><img src="logo.svg" alt=""> Title Production SOP</div>
```

The element is removed from flow and repeated in the margin box on every page.

### Controlling breaks

| Property | Values | Use |
|---|---|---|
| `break-before` / `break-after` | `page`, `avoid`, `left`, `right`, `auto` | `h1 { break-before: page }` starts chapters on a new page |
| `break-inside` | `avoid` | Keep figures, tables rows and callouts whole |
| `orphans` / `widows` | integer | Minimum lines at bottom/top of a page (default 2) |
| `page-break-*` | legacy aliases | Still supported everywhere |

```css
h1 { break-before: right; }               /* chapters open on a right-hand page */
h2, h3 { break-after: avoid; }             /* never leave a heading alone at the bottom */
figure, tr, .callout { break-inside: avoid; }
p { orphans: 3; widows: 3; }
```

`thead` repeats automatically on every page a table spans, and `tfoot` too. Add `table { break-inside: auto; }` so long tables are allowed to split, and `tr { break-inside: avoid; }` so rows are not cut in half.

### Counters, cross references and TOC

```css
body { counter-reset: chapter; }
h1 { counter-increment: chapter; }
h1::before { content: "Chapter " counter(chapter) ". "; }
.toc a::after { content: leader(".") target-counter(attr(href), page); }
.xref::after { content: " (see page " target-counter(attr(href), page) ")"; }
```

`target-counter(attr(href), page)` prints the page number where the link target lands, which is how an automatic table of contents and "see page 42" references are built. `leader(".")` fills the gap with dots. Both are Generated Content for Paged Media features supported by WeasyPrint, Prince and Paged.js, not by browsers' print mode.

### Bookmarks and links

```css
h1 { bookmark-level: 1; bookmark-label: content(); }
h2 { bookmark-level: 2; }
a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 8pt; }
```

WeasyPrint turns `bookmark-level` into PDF outline entries (the sidebar navigation in Acrobat). Internal `href="#id"` links become clickable PDF links automatically. Printing the URL after external links keeps the paper copy useful.

### Print-specific resets

```css
@media print {
  nav, .no-print, video { display: none; }
  a { color: inherit; text-decoration: none; }
  body { font-size: 10.5pt; line-height: 1.4; color: #000; background: none; }
  * { box-shadow: none !important; text-shadow: none !important; }
  img { max-width: 100% !important; }
  pre { white-space: pre-wrap; }
}
```

In a browser, everything in `@media print` applies when the user prints or saves as PDF. WeasyPrint applies `print` media by default, so both `@media print` and unwrapped rules are used.

### Running WeasyPrint

```bash
pip install weasyprint
weasyprint handbook.html handbook.pdf --stylesheet print.css --presentational-hints
```

```python
from weasyprint import HTML, CSS
HTML("handbook.html", base_url=".").write_pdf("handbook.pdf", stylesheets=[CSS("print.css")])
```

Recent WeasyPrint versions support Flexbox, Grid (since 62), `var()` and `calc()` (since 53), `@font-face` from local files, `hyphens: auto`, and PDF/A and PDF/UA output with `--pdf-variant`. It does not run JavaScript; anything generated by script must be rendered server-side first.

> **Interview note:** The question "how would you generate 767 numbered pages with a TOC from HTML?" is really asking whether you know `counter(page)`, `target-counter()`, `string-set`, `break-*` and a paged-media engine. Naming those five plus the `@page` margin boxes is a complete answer.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Print stylesheet</title>
<style>
  /* Open the preview's print dialog (Ctrl+P) to see the pagination, margins and counters in action. */
  @page { size: A4; margin: 20mm 18mm 22mm; @bottom-center { content: "Page " counter(page) " of " counter(pages); font-size: 9pt; color: #666; } @top-right { content: string(chapter); font-size: 9pt; color: #666; } }
  @page :first { @top-right { content: none; } }
  body { font-family: Georgia, serif; font-size: 11pt; line-height: 1.45; color: #222; max-width: 700px; margin: 0 auto; padding: 16px; counter-reset: chapter; }
  h1 { font-family: Arial, sans-serif; color: #1572B6; counter-increment: chapter; string-set: chapter content(); break-before: page; break-after: avoid; }
  h1::before { content: "Chapter " counter(chapter) ". "; }
  h1.first { break-before: auto; }
  h2 { break-after: avoid; }
  p { orphans: 3; widows: 3; }
  figure, .callout, tr { break-inside: avoid; }
  .callout { border-left: 4px solid #1572B6; padding: 8px 12px; background: #eef4fa; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; }
  th, td { border: 1px solid #999; padding: 4px 8px; }
  thead { display: table-header-group; }
  .no-print { color: #666; font-size: .85rem; }
  @media print { .no-print { display: none; } a { color: inherit; text-decoration: none; } a[href^="http"]::after { content: " (" attr(href) ")"; } }
  @media screen { .page-break { border-top: 1px dashed #bbb; margin: 2rem 0; } }
</style></head>
<body>
  <p class="no-print">Screen-only note: press Ctrl+P (or Cmd+P) and choose "Save as PDF" to see page numbers, the running chapter header and the forced page breaks.</p>
  <h1 class="first">Purpose and scope</h1>
  <p>This handbook describes the title production process for the Wyoming and Colorado desks. It is generated from HTML with WeasyPrint, so page numbers, headers and the table of contents are produced by CSS rather than by hand.</p>
  <div class="callout">Callouts use break-inside: avoid so they are never split across pages.</div>
  <h1>Weekly reporting</h1>
  <h2>Rate matrix review</h2>
  <p>The table header repeats on each printed page automatically because thead is a table-header-group.</p>
  <table><thead><tr><th>Coverage</th><th>Standard</th><th>Reissue</th></tr></thead>
  <tbody><tr><td>$100,000</td><td>575.00</td><td>345.00</td></tr><tr><td>$250,000</td><td>1,118.00</td><td>670.80</td></tr></tbody></table>
  <p>Reference: <a href="https://weasyprint.org/">WeasyPrint documentation</a>.</p>
</body>
</html>
```

### Quiz

1. Which selector targets only the first page of a document?
- [ ] `@page :root`
- [x] `@page :first`
- [ ] `@page 1`
> `:first`, `:left`, `:right` and `:blank` are the page pseudo-classes.

2. `content: counter(pages)` prints…
- [ ] the current page number
- [x] the total number of pages
- [ ] the number of `@page` rules
> `counter(page)` is the current page; `counter(pages)` the total.

3. How do you show the current chapter title in a running header?
- [ ] `content: attr(h1)`
- [x] `h1 { string-set: chapter content(); }` and `@top-right { content: string(chapter); }`
- [ ] JavaScript on each page
> Named strings are copied from elements and read in margin boxes.

4. `target-counter(attr(href), page)` is used for…
- [x] printing the page number a link points to, as in a TOC
- [ ] counting links
- [ ] page totals
> It resolves the target element's page, which browsers' print mode does not support but WeasyPrint does.

### Exercises

1. **Landscape matrices** — Make every `table.matrix` appear on its own A4 landscape page while the rest of the document stays portrait.
<details><summary>Solution</summary>

```css
@page { size: A4; }
@page wide { size: A4 landscape; margin: 15mm; }
table.matrix { page: wide; break-before: page; break-after: page; }
```

</details>

2. **Confidential footer** — Print "CONFIDENTIAL" bottom-left and the document title (taken from the `h1.doctitle` on the cover) top-left on every page except the first.
<details><summary>Solution</summary>

```css
h1.doctitle { string-set: doctitle content(); }   /* copied from the cover heading into a named string */
@page { @top-left { content: string(doctitle); font-size: 9pt; } @bottom-left { content: "CONFIDENTIAL"; font-size: 8pt; color: #c0392b; } }
@page :first { @top-left { content: none; } @bottom-left { content: none; } }
```

</details>

3. **TOC with dot leaders** — Style a `nav.toc` list so each entry shows its target page number after dot leaders.
<details><summary>Solution</summary>

```css
nav.toc a { text-decoration: none; color: inherit; }
nav.toc a::after { content: leader(".") target-counter(attr(href), page); }
nav.toc li { margin: 2pt 0; }
```

</details>

### Interview Questions

**Q: How do you produce automatic page numbers, running headers and a TOC from HTML?**
With a paged-media engine such as WeasyPrint, Prince or Paged.js, the `@page` rule defines size and margins and its margin boxes (`@top-left`, `@bottom-center` and so on) hold generated content. `counter(page)` and `counter(pages)` give "Page X of Y"; `string-set: chapter content()` on `h1` plus `content: string(chapter)` in a margin box gives a running header that changes per chapter, and `position: running()` with `element()` does the same with rich HTML. A TOC is a list of links whose `::after` prints `target-counter(attr(href), page)` with `leader(".")` for dots. Breaks are controlled with `break-before: page` on chapters, `break-after: avoid` on headings and `break-inside: avoid` on figures and rows. Browsers only implement a subset (page size, margins, breaks), so the full stack needs the dedicated engine.

**Q: What are the main differences between browser print and WeasyPrint, and how do you develop for both?**
Browsers support `@page size` and margins, `break-*`, `orphans`/`widows` and repeat `thead`, but not margin boxes, `string-set`, `target-counter`, `leader()` or PDF bookmarks, and Chrome's `counter(pages)` is missing. WeasyPrint supports all of those but runs no JavaScript, has partial support for some newer layout features depending on version, and loads fonts and images from file paths. I develop the layout in the browser with `@media print` and DevTools' print emulation for fast iteration, then add a `print.css` layer with the paged-media features and check the PDF in WeasyPrint with `--debug` logging for unsupported declarations. Keeping content and structure in HTML and pagination in CSS means the same source also renders as a web page and an EPUB.

**Q: A 700-page PDF from WeasyPrint takes too long or too much memory. What do you do?**
First profile: WeasyPrint's cost is dominated by layout of huge tables and by images, so split enormous tables into per-page chunks or use `table-layout: fixed`, downscale images to the print resolution (300 dpi at final size, not 4000px originals), and convert PNG screenshots to JPEG where transparency is not needed. Avoid `break-inside: avoid` on large blocks because the engine retries layout, and remove unused `@font-face` declarations. Render chapters as separate PDFs in parallel and merge with pikepdf or pypdf, then rebuild bookmarks, which also lets a change in one chapter re-render only that chapter. Finally, keep WeasyPrint current: versions 60 and later are substantially faster than 52, and its image optimisation options shrink output.

## CSS for EPUB (reflowable vs fixed layout)

An **EPUB** is a zipped website: XHTML content files, CSS, fonts and images, described by an OPF package. The CSS is standard, but the reading systems are not: Apple Books, Kobo, Adobe Digital Editions, Google Play Books, Thorium and Kindle (after KindleGen conversion) each support a different subset and each lets the reader override your styles. Writing EPUB CSS is the discipline of styling for a hostile, unpredictable renderer.

### Reflowable vs fixed layout

| | Reflowable | Fixed layout (FXL) |
|---|---|---|
| Text | Reflows to screen size and user font settings | Locked positions on a page of fixed dimensions |
| Use | Novels, handbooks, manuals, most ebooks | Children's picture books, comics, cookbooks, magazines |
| Package hint | default | `<meta property="rendition:layout">pre-paginated</meta>` |
| Page size | none | `<meta name="viewport" content="width=1200, height=1600">` in each XHTML head |
| CSS style | flow-based, `em` units, minimal | absolute positioning, `px`, backgrounds, per-page SVG/image |

Reflowable is what a 400-page employee handbook needs; fixed layout is for a designed brochure where a caption must sit exactly under its photo. Never choose fixed layout for text-heavy books: it cannot resize fonts and is unreadable on phones.

### Reflowable rules

1. **Use `em` and `%`, never `px`, for font sizes and spacing.** Readers set their own base size; `px` overrides them and fails accessibility review at distributors.
2. **Do not set `font-size` on `body`** (or set it to `100%`), so the reader's choice is the base.
3. **Do not set `line-height` in fixed units** and do not set `color: #000` on body; night mode inverts colours and hard-coded black text on inverted backgrounds disappears. Many publishers omit `color` on body entirely.
4. **No `!important`** on text properties; readers apply user settings with their own stylesheet and `!important` fights them.
5. **Avoid Flexbox and Grid for essential layout.** Support is good in Apple Books and Thorium and poor in ADE and older Kobo firmware. Use them progressively for decoration only.
6. **Widths in `%` or `em`,** images with `max-width: 100%` and `height: auto`.
7. **Page breaks with both properties:** `page-break-before: always; break-before: page;` because older readers know only the legacy name.

```css
body { margin: 0 5%; text-align: left; }
h1 { font-size: 1.6em; margin: 2em 0 1em; page-break-before: always; break-before: page; text-align: center; }
h2 { font-size: 1.3em; margin: 1.5em 0 .5em; page-break-after: avoid; break-after: avoid; }
p  { margin: 0; text-indent: 1.2em; line-height: 1.4; }
p.first, h1 + p, h2 + p { text-indent: 0; }
img { max-width: 100%; height: auto; }
figure { margin: 1em 0; page-break-inside: avoid; break-inside: avoid; text-align: center; }
figcaption { font-size: .85em; font-style: italic; }
blockquote { margin: 1em 2em; }
.callout { border: 1px solid #888; padding: .8em; margin: 1em 0; }
```

Notice there is no `font-family` on `body`. Embedding a body font is allowed but most readers ignore it unless the user selects "publisher font", so the design must work with the reader's serif.

### Embedding fonts

Fonts live in the container (`OEBPS/fonts/`) and are listed in the OPF manifest. The CSS is the usual `@font-face` with relative paths:

```css
@font-face { font-family: "Brand Serif"; src: url("../fonts/BrandSerif-Regular.otf"); font-weight: normal; font-style: normal; }
h1, h2 { font-family: "Brand Serif", serif; }
```

Use OTF/TTF or WOFF; WOFF2 became a core media type in EPUB 3.2, so older readers may not load it. Obfuscation (the EPUB font mangling algorithm) is optional; Kindle drops embedded fonts on some devices, so keep everything readable with fallbacks.

### EPUB-specific features

- **`epub:type`** on elements (`<section epub:type="chapter">`, `<aside epub:type="footnote">`) drives pop-up footnotes in Apple Books and Kobo: an `<a epub:type="noteref" href="#n1">` opens the `<aside epub:type="footnote" id="n1">` as a pop-up, so hide the aside visually only in readers that support pop-ups (they hide it for you) and leave it visible otherwise.
- **`-epub-` prefixed properties** (`-epub-hyphens`, `-epub-writing-mode`) exist for older readers; write both prefixed and standard forms.
- **Media queries in EPUB:** `@media amzn-kf8` and `@media amzn-mobi` target Kindle formats; `@media (prefers-color-scheme: dark)` works in Apple Books and Thorium.
- **`nav.xhtml`** is the required navigation document; `hidden="hidden"` on its `<nav>` keeps it out of the reading order while still available to the reader's menu.

### Fixed layout essentials

Each page is an XHTML file with a viewport meta and absolutely positioned boxes at pixel coordinates over a background image or SVG:

```css
body { margin: 0; width: 1200px; height: 1600px; position: relative; background: url("../images/p12.jpg") no-repeat; }
.caption { position: absolute; left: 80px; top: 1380px; width: 1040px; font-size: 28px; }
```

Text stays selectable and searchable, which is why FXL beats an image-only PDF conversion. `rendition:spread` and `page-spread-left/right` properties in the spine control two-page spreads.

### Validation

`epubcheck book.epub` reports CSS errors, missing manifest entries and unsupported properties. Distributors (Apple, Kobo, Amazon KDP, Draft2Digital) reject files that fail. Test in Thorium (Readium engine), Apple Books, Kobo, ADE 4.5 and Kindle Previewer, because a book that is perfect in one is frequently broken in another.

> **Warning:** Readers cache CSS per book. When a client says "I can still see the old formatting", it is almost always their app's cached copy. Change the `dc:identifier` or bump `dcterms:modified` in the OPF and reload.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>EPUB chapter preview</title>
<style>
  /* Reflowable EPUB chapter styles: em units, no body font-size, no colours on text, legacy and modern break properties. */
  body { margin: 0 5%; max-width: 38em; line-height: 1.4; text-align: left; font-family: Georgia, serif; /* font-family only for this preview */ }
  h1 { font-size: 1.6em; margin: 2em 0 1em; text-align: center; page-break-before: always; break-before: page; }
  h2 { font-size: 1.3em; margin: 1.5em 0 .5em; page-break-after: avoid; break-after: avoid; }
  p  { margin: 0; text-indent: 1.2em; }
  h1 + p, h2 + p, p.first { text-indent: 0; }
  img { max-width: 100%; height: auto; }
  figure { margin: 1em 0; text-align: center; page-break-inside: avoid; break-inside: avoid; }
  figcaption { font-size: .85em; font-style: italic; }
  .callout { border: 1px solid #888; padding: .8em; margin: 1em 0; }
  aside.footnote { font-size: .85em; border-top: 1px solid #888; margin-top: 2em; padding-top: .5em; }
  a.noteref { vertical-align: super; font-size: .7em; text-decoration: none; }
  @media (prefers-color-scheme: dark) { .callout { border-color: #aaa; } }
  .preview-note { font-size: .8em; opacity: .7; margin-top: 3em; }
</style></head>
<body>
  <section>
    <h1>Chapter 3<br>Escrow Reconciliation</h1>
    <p>The first paragraph after a heading has no indent, following book convention, while the paragraphs that follow are indented instead of spaced.</p>
    <p>Every disbursement is matched against the settlement statement before the weekly report is released.<a class="noteref" href="#n1" id="r1">1</a> Discrepancies are escalated the same day.</p>
    <h2>Tolerances</h2>
    <div class="callout">Callouts use a neutral border and no background colour so they survive night mode in every reader.</div>
    <figure><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='120'><rect width='300' height='120' fill='%23eef4fa'/><text x='150' y='65' text-anchor='middle' font-family='Arial' font-size='16' fill='%231572B6'>Figure placeholder 300x120</text></svg>" alt="Reconciliation flow"><figcaption>Figure 3.1: Weekly reconciliation flow.</figcaption></figure>
    <aside class="footnote" id="n1"><p class="first"><a href="#r1">1.</a> In EPUB this aside carries epub:type="footnote" and opens as a pop-up in Apple Books and Kobo.</p></aside>
    <p class="preview-note">Resize the preview or change the browser font size: everything scales because sizes are in em and there is no fixed body font-size.</p>
  </section>
</body>
</html>
```

### Quiz

1. Why avoid `px` font sizes in reflowable EPUB CSS?
- [x] They override the reader's chosen text size and fail accessibility checks
- [ ] Readers do not support `px`
- [ ] `px` renders blurry on e-ink
> `em` and `%` scale with the user's base size; `px` locks it.

2. Which meta property switches a package to fixed layout?
- [ ] `rendition:flow`
- [x] `rendition:layout` set to `pre-paginated`
- [ ] `rendition:spread`
> `pre-paginated` tells the reader each XHTML file is one fixed page with a viewport.

3. Why write both `page-break-before` and `break-before`?
- [ ] They do different things
- [x] Older reading systems know only the legacy property, newer ones prefer the modern one
- [ ] `break-before` is invalid in EPUB
> Redundancy is cheap and covers ADE 2.x through current Readium.

4. Hard-coding `color: #000` on `body` causes problems because…
- [ ] It is not valid CSS
- [x] Night mode inverts the background but the forced black text becomes unreadable
- [ ] Kindle ignores `body`
> Leave text colour to the reader; set colours only on decorative elements.

### Exercises

1. **Chapter opener** — Style `h1.chapter` to start on a new page in all readers, centred, with a small-caps label above it from `::before` reading "Chapter".
<details><summary>Solution</summary>

```css
h1.chapter { page-break-before: always; break-before: page; text-align: center; margin-top: 3em; }
h1.chapter::before { content: "Chapter"; display: block; font-size: .6em; font-variant: small-caps; letter-spacing: .1em; margin-bottom: .5em; }
```

</details>

2. **Poetry block** — Preserve line breaks in a poem, indent wrapped lines, keep stanzas together.
<details><summary>Solution</summary>

```css
.poem { margin: 1em 2em; page-break-inside: avoid; break-inside: avoid; }
.poem p { margin: 0; text-indent: -1.5em; padding-left: 1.5em; }
.poem .stanza + .stanza { margin-top: 1em; }
```

</details>

3. **Kindle-only tweak** — Reduce heading top margin only in Kindle KF8 while keeping the standard value elsewhere.
<details><summary>Solution</summary>

```css
h1 { margin-top: 2em; }
@media amzn-kf8 { h1 { margin-top: 1em; } }
```

</details>

### Interview Questions

**Q: How does EPUB CSS differ from website CSS?**
The renderer is not one browser but a dozen reading systems with partial CSS support and a user stylesheet that must win, so EPUB CSS is deliberately minimal and defensive: `em` units, no body font size or colour, legacy and modern break properties side by side, no Flexbox or Grid for essential layout, no `!important`, images capped at 100% width, and fonts embedded but never required. EPUB also has features the web lacks or rarely uses: `epub:type` semantics for pop-up footnotes, vendor media queries such as `amzn-kf8`, the `rendition:` properties for fixed layout and spreads, and a required navigation document. The test matrix is Thorium, Apple Books, Kobo, ADE and Kindle Previewer plus `epubcheck`, not Chrome and Firefox.

**Q: When would you choose fixed layout, and what does it cost?**
Fixed layout is right when the page design is the content: children's picture books, comics, illustrated cookbooks, brochures and magazines where text must sit at a precise spot over an image. It costs reflow and accessibility: fonts cannot be enlarged, phones show tiny pages, screen readers get a worse experience, and the file is much larger. Distributors also limit it; Kindle wants a special KF8 fixed-layout package and Kobo's FXL support is uneven. For a client's illustrated brochure I produce FXL with selectable text over an SVG background and, where feasible, a reflowable companion edition for accessibility.

**Q: How do you handle fonts and colours so a book works in night mode and with user settings?**
I leave `color` and `background` off `body` and paragraphs entirely so the reader's theme provides both, and use borders rather than fills for callouts, with any decorative colours chosen to be legible on both white and black. Font sizes are `em` relative to the reader's base; line-height is unitless; headings may use an embedded display face declared with `@font-face` but with a generic fallback and no `!important`. Images with transparent backgrounds and dark line art get a light backing colour or are exported as JPEG with white, because transparent PNGs on a black night-mode page vanish. Then I test in Apple Books night mode, Kobo's dark theme and Thorium's sepia to confirm nothing disappears.

## Architecture: BEM & utility classes

On a one-page site any CSS works. On a product with fifty components and five contributors, unstructured CSS turns into specificity wars and "I added a class and something else broke". **CSS architecture** is a set of naming and layering conventions that keep styles predictable. The two dominant approaches are component naming (BEM) and utility-first (Tailwind-style), and mature codebases combine them with cascade layers.

### The problems to solve

- Global scope: every class is visible everywhere.
- Specificity creep: `#sidebar .nav li a.active` cannot be overridden without escalation.
- Dead CSS: nobody dares delete a rule because nobody knows what uses it.
- Order dependence: moving a stylesheet import changes the page.

### BEM: Block, Element, Modifier

BEM names classes so that structure is explicit and specificity stays flat at one class:

```html
<article class="card card--warning"><h3 class="card__title">Colorado</h3>
  <p class="card__body">310 files</p>
  <button class="card__action card__action--primary">Open</button>
</article>
```

```css
.card { border: 1px solid #ccc; border-radius: 8px; padding: 16px; }
.card--warning { border-color: #e67e22; }
.card__title { margin: 0 0 8px; font-size: 1.1rem; }
.card__action--primary { background: #1572B6; color: #fff; }
```

| Part | Syntax | Meaning |
|---|---|---|
| Block | `.card` | A standalone component |
| Element | `.card__title` | A part that only makes sense inside its block |
| Modifier | `.card--warning`, `.card__action--primary` | A variant or state of a block or element |

Rules: never nest selectors (`.card .card__title` is wrong, `.card__title` alone is right), never style tags or IDs inside components, and never write element-of-element names (`.card__body__text`): elements belong to the block, not to other elements. State that changes at runtime often uses `is-` prefixes (`.card.is-open`) or `aria-*` attributes (`.card[aria-expanded="true"]`), which double as accessibility hooks.

BEM is verbose but self-documenting: reading the HTML tells you which component a node belongs to, and grep for `card__` finds every use.

### Utility classes

Utility-first CSS provides single-purpose classes and composes them in HTML:

```html
<article class="rounded-lg border border-gray-300 p-4"><h3 class="mb-2 text-lg font-semibold">Colorado</h3>
</article>
```

Tailwind is the mainstream implementation; its build scans your templates and emits only the classes used, so the CSS stays small. Advantages: no naming decisions, no dead CSS, the design system (spacing scale, colours) is enforced because only token classes exist, and changes are local to the markup. Costs: long class strings, repetition across templates unless components (React, Jinja macros, Blade) wrap them, and HTML that is harder to read for designers who think in components.

A pragmatic middle path: BEM or plain component classes for the structure of reusable components, a small set of utilities for spacing and alignment tweaks (`.mt-2`, `.text-right`, `.sr-only`, `.hidden`), and cascade layers to make utilities always win:

```css
@layer reset, base, components, utilities;
@layer utilities { .mt-2 { margin-top: .5rem; } .hidden { display: none; } }
```

### File organisation

Group by component rather than by property type, with a tokens file first:

```text
css/
  tokens.css        custom properties: colours, spacing, type scale
  reset.css         normalisation, box-sizing, font: inherit on controls
  base.css          element defaults: body, headings, links, tables
  components/
    card.css
    table.css
    form.css
  utilities.css
  print.css
```

ITCSS (Inverted Triangle CSS) formalises this order from generic to specific: settings, tools, generic, elements, objects, components, utilities. Specificity should rise gently through the files, never spike.

### Scoping with modern CSS

- **Nesting** (all browsers since 2023) lets you write BEM without repeating the block: `.card { &__title { … } &--warning { … } }`. Keep nesting shallow; it compiles to the same flat selectors only if you use `&` concatenation carefully (`&__title` is supported in Sass; native CSS nesting needs `.card__title` spelled out, since `&__title` is not valid there).
- **`@scope`** (Chrome 118+, Safari 17.4+, Firefox more recently) limits rules to a subtree with a lower boundary: `@scope (.card) to (.card__slot) { h3 { … } }` styles headings in the card but not inside nested slotted content.
- **CSS Modules / Shadow DOM** scope by build tooling or by the platform, and generate unique class names so collisions are impossible.

### Design tokens as the contract

Whichever naming you choose, colours, spacing and type come from tokens (`--color-brand`, `--space-3`) defined once. Component CSS references tokens, never literals; a theme change or a client rebrand is then a tokens file swap. Ali's branded `.dotx` suites work the same way with Word theme colours and styles: the components (styles) reference the theme, not hard-coded values.

> **Tip:** Run Stylelint with `stylelint-config-standard` and the `selector-max-specificity: "0,3,0"` and `selector-max-id: 0` rules. A linter that refuses IDs and deep selectors enforces the architecture better than a wiki page.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>BEM and utilities</title>
<style>
  @layer reset, base, components, utilities;
  @layer reset { *, *::before, *::after { box-sizing: border-box; } body { margin: 0; } button { font: inherit; } }
  @layer base {
    :root { --color-brand: #1572B6; --color-warn: #e67e22; --color-danger: #c0392b; --space-1: 4px; --space-2: 8px; --space-3: 16px; --radius: 8px; }
    body { font-family: Arial, sans-serif; padding: var(--space-3); color: #222; }
  }
  @layer components {
    .card { border: 1px solid #ccc; border-left: 5px solid var(--color-brand); border-radius: var(--radius); padding: var(--space-3); max-width: 320px; }
    .card--warning { border-left-color: var(--color-warn); }
    .card--danger  { border-left-color: var(--color-danger); }
    .card__title { margin: 0 0 var(--space-2); font-size: 1.1rem; }
    .card__meta { color: #666; font-size: .85rem; }
    .card__actions { display: flex; gap: var(--space-2); margin-top: var(--space-3); }
    .btn { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-brand); border-radius: var(--radius); background: #fff; color: var(--color-brand); cursor: pointer; }
    .btn--primary { background: var(--color-brand); color: #fff; }
    .card.is-open .card__details { display: block; }
    .card__details { display: none; margin-top: var(--space-2); }
  }
  @layer utilities { .mt-3 { margin-top: var(--space-3); } .text-right { text-align: right; } .hidden { display: none; } .flex { display: flex; } .gap-2 { gap: var(--space-2); } }
</style></head>
<body>
  <div class="flex gap-2" style="flex-wrap: wrap">
    <article class="card"><h3 class="card__title">Wyoming</h3><p class="card__meta">124 files, 98% on time</p>
      <div class="card__actions"><button class="btn btn--primary" onclick="this.closest('.card').classList.toggle('is-open')">Details</button><button class="btn">Export</button></div>
      <p class="card__details">One escalation pending with the underwriter.</p></article>
    <article class="card card--warning"><h3 class="card__title">Colorado</h3><p class="card__meta">310 files, 94% on time</p>
      <div class="card__actions"><button class="btn btn--primary" onclick="this.closest('.card').classList.toggle('is-open')">Details</button></div>
      <p class="card__details">Two escalations, one corrected legal description outstanding.</p></article>
    <article class="card card--danger"><h3 class="card__title text-right">Texas (utility beats component)</h3><p class="card__meta">77 files</p></article>
  </div>
  <p class="mt-3">Inspect any card: every rule has one class of specificity and the utilities layer wins without !important.</p>
</body>
</html>
```

### Quiz

1. In BEM, `.card__title` is a…
- [ ] block
- [x] element
- [ ] modifier
> Double underscore marks an element, double hyphen a modifier.

2. Which selector violates BEM guidance?
- [ ] `.card--warning`
- [x] `.card .card__title`
- [ ] `.card__title`
> Elements are styled by their own class; nesting adds specificity and couples structure.

3. Utility-first CSS keeps the stylesheet small mainly because…
- [ ] classes are shorter
- [x] the build emits only the utilities actually used in templates
- [ ] utilities do not use the cascade
> Unused utilities are purged at build time.

4. What guarantees utilities override component styles without `!important`?
- [ ] Loading utilities first
- [x] Declaring them in a later `@layer`
- [ ] Using IDs on utilities
> Later cascade layers beat earlier ones regardless of specificity.

### Exercises

1. **Name the component** — Write BEM classes and CSS for a notification with an icon, a message, a close button, and success/error variants.
<details><summary>Solution</summary>

```html
<div class="toast toast--success"><span class="toast__icon"></span><p class="toast__message">Saved</p><button class="toast__close">x</button></div>
```

```css
.toast { display: flex; gap: 8px; align-items: center; padding: 12px; border-radius: 6px; border: 1px solid #ccc; }
.toast--success { border-color: #27ae60; } .toast--error { border-color: #c0392b; }
.toast__message { flex: 1; margin: 0; } .toast__close { margin-left: auto; }
```

</details>

2. **Layer order** — Declare layers so a third-party datepicker stylesheet can be overridden by your components with a single class.
<details><summary>Solution</summary>

```css
@layer vendor, components;
@import url("datepicker.css") layer(vendor);
@layer components { .datepicker { font: inherit; } }
```

</details>

3. **Refactor** — Rewrite `#sidebar ul li a.active { color: navy }` to follow flat-specificity architecture.
<details><summary>Solution</summary>

```css
.sidebar-nav__link--active { color: var(--color-brand); }
/* or with a state hook: */
.sidebar-nav__link[aria-current="page"] { color: var(--color-brand); }
```

</details>

### Interview Questions

**Q: Compare BEM and utility-first CSS. Which would you choose for a new project?**
BEM gives every component an explicit, greppable name with flat one-class specificity, and the HTML stays readable, but you spend effort naming and you accumulate dead rules unless disciplined. Utility-first removes naming and dead CSS, enforces the design tokens because only token-valued classes exist, and keeps changes local to the template, at the cost of long class lists and repetition unless you have a component layer in the templating system. For a design-system-driven app with React or Jinja components I would go utility-first with extracted components; for a content site, a WeasyPrint report or an EPUB, where the HTML is the deliverable and must stay clean, I would use BEM-style component classes with a handful of utilities. In either case cascade layers and a linter enforcing no IDs and low specificity do more for maintainability than the naming scheme.

**Q: How do you prevent specificity wars in a large codebase?**
Keep specificity flat and rising only with intent: single-class selectors for components, `:where()` for element defaults so any class overrides them, no IDs in selectors, no `!important` outside utilities, and `@layer` to express precedence structurally (reset, base, components, utilities) so a utility beats a component without escalation. Vendor CSS goes in its own low layer via `@import … layer()`. Stylelint enforces the rules on every pull request. When an override is still needed, add a modifier class rather than a longer selector, and if two rules with the same specificity conflict, source order in a defined file sequence decides, which is documented rather than accidental.

**Q: What are cascade layers and how would you migrate an existing stylesheet to them?**
`@layer` groups rules into named layers with a declared order; a later layer always beats an earlier one for normal declarations regardless of selector specificity, and unlayered styles beat all layers. To migrate, first declare the order at the top (`@layer reset, vendor, base, components, utilities`), then move third-party imports into `layer(vendor)` since they are the most common override problem, then wrap your reset and base. Existing component CSS can stay unlayered temporarily because unlayered styles have top priority, which means nothing visibly changes; finally move components and utilities into their layers and delete the `!important`s that were only there to beat the vendor styles. `revert-layer` helps when a component needs to fall back to base styling inside a layer.

## Performance & rendering

CSS is rarely the biggest cost on a page, but it is on the critical path: the browser will not paint anything until it has the CSS, and bad selectors or layout-triggering animations can make a page feel slow on every interaction. This chapter covers how the browser turns CSS into pixels, what to measure, and the handful of techniques that matter.

### The rendering pipeline

1. **Parse** HTML into the DOM and CSS into the CSSOM.
2. **Style**: match selectors to elements and compute the final value of every property (the render tree).
3. **Layout** (reflow): compute geometry, the position and size of every box.
4. **Paint**: fill in pixels, text, colours, borders, shadows, into layers.
5. **Composite**: combine layers on the GPU, applying transforms and opacity.

Changing a property can invalidate from a certain stage down. `width` triggers layout, paint and composite; `background-color` triggers paint and composite; `transform` and `opacity` only composite. This is the whole basis of animation performance.

### CSS blocks rendering

Every `<link rel="stylesheet">` in `<head>` blocks first paint until it downloads and parses. Techniques:

- Keep the critical CSS small; inline the above-the-fold rules for the very fastest first paint on large sites (measure before doing this; it complicates caching).
- Split by media: `<link rel="stylesheet" href="print.css" media="print">` still downloads but does not block rendering.
- `<link rel="preload" as="style">` for stylesheets discovered late; `rel="preconnect"` for font origins.
- Avoid `@import` in CSS: it serialises downloads (the browser learns about the second file only after parsing the first).
- Minify and compress (Brotli), and cache with long `max-age` plus a content hash in the filename.

### Selector performance

Browsers match selectors right to left, so `.sidebar ul li a` first finds every `a` and walks up. In practice selector cost is negligible for normal pages; what matters is the number of elements times the number of rules evaluated during style recalculation. Avoid universal selectors combined with descendant selectors on huge DOMs (`.report * { }`), extremely deep `:has()` chains, and `:nth-child` with complex formulas on tables with tens of thousands of rows. Otherwise, write for maintainability.

### Layout thrashing

JavaScript that reads a layout value (`offsetHeight`, `getBoundingClientRect()`) after writing a style forces a synchronous layout. In a loop this becomes hundreds of layouts per frame. Batch reads, then writes, or use `requestAnimationFrame`. CSS can help by making the layout cheaper:

```css
.report-row { contain: layout paint; }             /* changes inside do not affect outside */
.long-list > li { content-visibility: auto; contain-intrinsic-size: auto 60px; }
```

`content-visibility: auto` skips rendering work for off-screen elements entirely; a 5,000-row production log renders as fast as a 50-row one on first paint. `contain-intrinsic-size` reserves a placeholder height so the scrollbar stays stable.

### Layers, compositing and memory

Elements with `transform`, `opacity` animations, `will-change`, `position: fixed`, `video` and `canvas` get their own compositor layer. Layers make animation cheap but each costs GPU memory proportional to its area. Too many layers (from a blanket `will-change: transform` on every card) crashes mobile Safari tabs. Use Chrome DevTools' Layers panel and the Rendering tab's "Paint flashing" and "Layout Shift Regions" to see what is being repainted.

### Expensive paint properties

`box-shadow` with large blur radii, `filter: blur()`, `backdrop-filter`, `mix-blend-mode` and large `border-radius` on scrolling content are the paint-heavy properties. A frosted-glass header with `backdrop-filter` repaints on every scroll frame; keep such elements small and give them their own layer.

### Fonts and images

- Fonts: `font-display: swap`, preload the primary weight, subset with `unicode-range`, use a variable font instead of six files, and add `size-adjust` metrics overrides on the fallback to reduce layout shift.
- Images: `width` and `height` attributes or `aspect-ratio` reserve space (prevents CLS), `loading="lazy"` below the fold, `object-fit: cover` instead of background images so they can be responsive with `srcset`.
- Backgrounds: `image-set()` for DPR-specific background images; avoid `background-attachment: fixed` on mobile (it disables compositing shortcuts).

### Core Web Vitals and CSS

| Metric | CSS influence |
|---|---|
| LCP (Largest Contentful Paint) | Render-blocking CSS, web font of the hero text, hero image preloading |
| CLS (Cumulative Layout Shift) | Missing image dimensions, late-loading fonts, injected banners without reserved space |
| INP (Interaction to Next Paint) | Heavy style recalculation on class toggles, layout-triggering transitions, `:has()` on large trees |

Lighthouse, WebPageTest and the Performance panel show each. Measure on a mid-range Android phone with throttled CPU; a laptop hides everything.

### Unused CSS

Coverage tab in DevTools reports the percentage of CSS unused on the current page. Frameworks that purge (Tailwind, PurgeCSS) or code-split per route keep bundles small; for a WeasyPrint stylesheet nothing needs purging, because the engine parses once and there is no network.

> **Interview note:** "Why is animating `left` worse than `transform: translateX()`?" is the standard question. Answer with the pipeline: `left` invalidates layout for the element and potentially siblings every frame and runs on the main thread; `translateX` changes only the compositor's matrix for an existing layer and can run on the GPU even while the main thread is busy.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Rendering performance</title>
<style>
  body { font-family: Arial, sans-serif; margin: 16px; }
  .row { display: flex; gap: 24px; align-items: center; margin-bottom: 16px; }
  .box { width: 80px; height: 80px; border-radius: 8px; color: #fff; display: grid; place-items: center; font-size: .75rem; text-align: center; }
  .layout { position: relative; background: #c0392b; animation: move-left 1.5s ease-in-out infinite alternate; }
  .composite { background: #27ae60; animation: move-transform 1.5s ease-in-out infinite alternate; will-change: transform; }
  @keyframes move-left { from { left: 0; } to { left: 160px; } }
  @keyframes move-transform { from { transform: translateX(0); } to { transform: translateX(160px); } }
  .log { height: 220px; overflow: auto; border: 1px solid #ccc; }
  .log > div { padding: 4px 8px; border-bottom: 1px solid #eee; content-visibility: auto; contain-intrinsic-size: auto 26px; }
  .stats { font-size: .85rem; color: #555; }
  @media (prefers-reduced-motion: reduce) { .layout, .composite { animation: none; } }
</style></head>
<body>
  <div class="row"><div class="box layout">animates<br>left</div><span class="stats">Red: animating <code>left</code> forces layout every frame (turn on "Paint flashing" in DevTools Rendering to see it).</span></div>
  <div class="row"><div class="box composite">animates<br>transform</div><span class="stats">Green: <code>transform</code> is composited on its own layer; no layout or paint.</span></div>
  <p class="stats">Below: 5,000 rows with <code>content-visibility: auto</code>. Off-screen rows skip layout and paint, so the page stays responsive.</p>
  <div class="log" id="log"></div>
  <script>
    const t0 = performance.now();
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= 5000; i++) { const d = document.createElement('div'); d.textContent = `File WY-${String(100000 + i)} examined, QA score ${(4 + Math.random()).toFixed(1)}`; frag.appendChild(d); }
    document.getElementById('log').appendChild(frag);
    requestAnimationFrame(() => { const p = document.createElement('p'); p.className = 'stats'; p.textContent = `Rendered 5,000 rows in ${(performance.now() - t0).toFixed(0)} ms. Remove content-visibility in the CSS and compare.`; document.body.appendChild(p); });
  </script>
</body>
</html>
```

### Quiz

1. Which change skips both layout and paint?
- [ ] `margin-left`
- [ ] `background-color`
- [x] `transform`
> Transforms and opacity are applied at composite time.

2. Why avoid `@import` inside CSS files?
- [x] The browser discovers the imported file only after parsing the parent, serialising downloads
- [ ] It is deprecated
- [ ] It ignores media queries
> Use multiple `<link>` tags or bundle at build time instead.

3. `content-visibility: auto` mainly helps by…
- [ ] compressing the HTML
- [x] skipping rendering work for off-screen content
- [ ] caching images
> Pair it with `contain-intrinsic-size` so scroll height stays stable.

4. Which metric is most affected by web fonts loading late and images without dimensions?
- [ ] INP
- [x] CLS
- [ ] TTFB
> Layout shift happens when late resources change the size of already-painted content.

### Exercises

1. **Non-blocking print CSS** — Link a print stylesheet so it never delays first paint.
<details><summary>Solution</summary>

```html
<link rel="stylesheet" href="print.css" media="print">
```

</details>

2. **Fix a janky hover** — Replace this with a compositor-friendly version: `.card { transition: margin-top .2s } .card:hover { margin-top: -4px }`.
<details><summary>Solution</summary>

```css
.card { transition: transform .2s; }
.card:hover { transform: translateY(-4px); }
```

</details>

3. **Stable images** — Prevent layout shift for a 3:2 hero image that loads late.
<details><summary>Solution</summary>

```html
<img src="hero.jpg" width="1200" height="800" alt="" fetchpriority="high">
```

```css
img { max-width: 100%; height: auto; aspect-ratio: 3 / 2; }
```

</details>

### Interview Questions

**Q: Explain the browser's critical rendering path and where CSS sits in it.**
The browser parses HTML into the DOM, discovers stylesheets and parses them into the CSSOM, combines the two into a render tree of visible elements with computed styles, lays out geometry, paints layers and composites them. CSS is render-blocking: nothing paints until every stylesheet in `<head>` that matches the current media has arrived, and scripts that read styles wait for the CSSOM too. So the levers are fewer and smaller stylesheets, no `@import` chains, `media` attributes to unblock non-matching sheets, preloading late-discovered CSS and fonts, and inlining a small critical subset when first paint is the priority. After load, the same pipeline runs on every change, so the second concern is which stage a property change invalidates.

**Q: How would you diagnose a page that scrolls or animates at 20 fps?**
Record with the Performance panel while reproducing, and look for long frames: purple bars are layout and style recalculation, green are paint. If style recalculation dominates, find the class toggle or `:has()`/universal selector on a large subtree and narrow it, or use `contain`. If layout dominates, look for animated geometry properties or JavaScript that reads layout inside a write loop (layout thrashing), and switch to `transform`, batch reads with writes, or apply `content-visibility: auto` to long lists. If paint dominates, enable Paint flashing and look for large repainting areas from `box-shadow`, `backdrop-filter` or a fixed background, then isolate the animated element on its own layer with `will-change` for the duration of the animation. Verify on a throttled mobile profile and compare frame times before and after.

**Q: What is CLS and how do CSS decisions cause or prevent it?**
Cumulative Layout Shift measures how much visible content moves without user interaction. CSS causes it when space is not reserved: images and iframes without `width`/`height` or `aspect-ratio`, web fonts that swap in with different metrics, ads or banners injected at the top, and animating properties like `height` or `top` on elements that push neighbours. Prevention is reserving space with intrinsic dimensions and `aspect-ratio`, matching fallback font metrics with `size-adjust` and `ascent-override`, using `font-display: optional` where a font swap is worse than a system font, `min-height` on containers whose content arrives later, and animating only `transform` and `opacity`. In a client's dashboard, adding `aspect-ratio` on chart containers took CLS from 0.31 to under 0.05.

## CSS interview questions

This chapter is a rehearsal. The questions below are the ones that recur in front-end, full-stack and document-engineering interviews, grouped by theme, with the shape of a strong answer. Practise saying them out loud in under a minute each; interviewers judge clarity as much as correctness.

### How CSS interviews work

Expect three formats. **Rapid-fire concept checks** (specificity, box model, `display` values) test vocabulary; answer in two sentences with one example. **Live coding** ("centre this", "build this card", "make this responsive") tests fluency; talk while you type and name the alternatives you rejected. **Debugging** ("why does this overflow?", "why is the z-index ignored?") tests mental models; state the rule, then the fix. For document roles, expect a fourth: **output-specific** questions about print, PDF and EPUB, which most web candidates cannot answer and which is your edge.

### Layout questions

| Question | Core of a strong answer |
|---|---|
| Centre a div horizontally and vertically | `display: grid; place-items: center` on the parent; mention Flexbox with `justify-content`/`align-items`, and absolute + `translate(-50%, -50%)` for legacy |
| Flexbox vs Grid | One axis, content-out vs two axes, layout-in; they nest |
| Why is my flex child overflowing? | `min-width: auto` default; set `min-width: 0` |
| Holy grail layout | Grid with `grid-template-areas`, one media query to stack |
| Sticky not sticking | Ancestor `overflow` clips, or parent not taller than element |
| Equal-height columns | Flex or grid stretch by default; explain why floats could not |
| Difference between `inline`, `block`, `inline-block` | Line participation and whether `width`/vertical margins apply |

### Cascade questions

- **Specificity of `#a .b c::before`?** (1,1,2). Explain the three columns and that they never carry over.
- **Order of `!important`, inline, ID, class?** `!important` > inline > ID > class > type; within equal specificity, source order.
- **`@layer` purpose?** Ordering groups regardless of specificity; unlayered beats layered.
- **Inherited vs non-inherited properties?** Text props inherit, box props do not; `inherit`, `initial`, `unset`, `revert` keywords.
- **Why avoid `!important`?** It can only be beaten by another `!important`, escalating; keep it for utilities.

### Rendering and performance questions

- Critical rendering path and why CSS is render-blocking.
- `transform`/`opacity` vs `left`/`width` for animation, and `will-change` trade-offs.
- Causes of CLS and the CSS fixes.
- `content-visibility` and `contain`.
- How you would find unused CSS and shrink a bundle.

### Modern CSS questions

Interviewers increasingly check whether you have kept up:

```css
.card:has(img) { padding: 0; }                          /* parent selector */
@container (min-width: 400px) { .card { display: flex; } } /* container queries */
.card { & .title { color: var(--brand); } }              /* native nesting */
h1 { text-wrap: balance; }                               /* typography */
.a { color: color-mix(in oklch, var(--brand), white 20%); } /* colour functions */
@property --pct { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
.panel { grid-template-rows: 0fr; transition: grid-template-rows .3s; } /* animate to auto */
```

Be able to say the year each became widely available (roughly 2022–2024) and what the fallback is.

### Document-production questions

- "Generate a paginated PDF with page numbers and a TOC from HTML": `@page`, margin boxes, `counter(page)`, `string-set`, `target-counter`, `break-*`, and WeasyPrint versus Prince versus Paged.js.
- "Reflowable vs fixed-layout EPUB": explain the reader override model, `em` units, no body colour, legacy plus modern break properties.
- "Same content to web, PDF and EPUB": shared tokens and structure, per-target stylesheets that change units and features; give the type-system example.
- "Why did the client's PDF have blank pages?": `break-before: right` on chapters creates blank left pages; `:blank` page selector to style them.

### Live coding tips

1. Start with the reset (`box-sizing`, `font: inherit` on controls) and tokens; interviewers notice.
2. Name the approach before writing: "I'll use Grid with named areas so the stacking order on mobile is a one-line change."
3. Write mobile-first and add one `min-width` query.
4. Use `gap`, `clamp()`, `minmax()` and logical properties; they signal current knowledge.
5. Check accessibility out loud: focus styles, contrast, reduced motion.
6. When stuck, describe the mental model (containing block, stacking context, formatting context) and reason from it.

### Questions to ask them

- "Which browsers and reading systems do you support?" (reveals whether modern CSS is allowed)
- "Do you have a design token system, and how are themes handled?"
- "How is CSS reviewed and linted?"
- "For document output, which PDF engine is in the pipeline?"

> **Tip:** Bring one artefact: a link to a page or a PDF you styled, with a two-sentence story of a problem you solved (the 168-field form that had to print on two pages, the 767-page handbook whose TOC page numbers came from `target-counter`). Concrete stories beat memorised definitions in every interview.

### Try It Yourself

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Interview kata</title>
<style>
  /* Kata: the classic 45-minute live-coding brief, solved with current CSS. Talk through each block as if explaining it. */
  *, *::before, *::after { box-sizing: border-box; }
  :root { --brand: #1572B6; --space: 8px; --radius: 8px; --fg: #222; --bg: #fff; }
  body { margin: 0; font-family: system-ui, sans-serif; color: var(--fg); background: var(--bg); }
  button, input { font: inherit; }
  .app { display: grid; min-height: 100vh; grid-template-rows: auto 1fr auto; grid-template-areas: "header" "main" "footer"; }
  @media (width >= 48em) { .app { grid-template-columns: 220px 1fr; grid-template-areas: "header header" "nav main" "footer footer"; } .app > nav { display: block; } }
  .app > header { grid-area: header; display: flex; align-items: center; gap: var(--space); padding: calc(var(--space) * 1.5) calc(var(--space) * 2); background: var(--brand); color: #fff; }
  .app > header .spacer { margin-left: auto; }
  .app > nav { grid-area: nav; display: none; padding: calc(var(--space) * 2); background: #eef4fa; }
  .app > main { grid-area: main; padding: calc(var(--space) * 2); }
  .app > footer { grid-area: footer; padding: var(--space); text-align: center; font-size: .8rem; color: #666; }
  .cards { display: grid; gap: calc(var(--space) * 2); grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); }
  .card { display: flex; flex-direction: column; border: 1px solid #ddd; border-radius: var(--radius); padding: calc(var(--space) * 2); transition: transform .2s, box-shadow .2s; }
  .card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgb(0 0 0 / .12); }
  .card:has(.badge--late) { border-color: #c0392b; }
  .card h3 { margin: 0 0 var(--space); font-size: 1.05rem; text-wrap: balance; }
  .card p { flex: 1; margin: 0 0 var(--space); }
  .badge { align-self: flex-start; padding: 2px 8px; border-radius: 999px; font-size: .75rem; background: #eef4fa; color: var(--brand); }
  .badge--late { background: #fdecea; color: #c0392b; }
  .centre { display: grid; place-items: center; height: 80px; margin-top: calc(var(--space) * 2); border: 1px dashed #bbb; }
  :focus-visible { outline: 3px solid var(--brand); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .card { transition: none; } .card:hover { transform: none; } }
  @media print { .app > nav, .app > header button { display: none; } .card { break-inside: avoid; box-shadow: none; } }
</style></head>
<body>
  <div class="app">
    <header><strong>Production</strong><span class="spacer"></span><button>Export</button></header>
    <nav>Reports<br>Rate matrix<br>QA</nav>
    <main>
      <div class="cards">
        <article class="card"><h3>Wyoming weekly production report</h3><p>124 files, 98% on time.</p><span class="badge">on track</span></article>
        <article class="card"><h3>Colorado</h3><p>310 files, 94% on time. Card border turns red via :has() when the badge is late.</p><span class="badge badge--late">2 late</span></article>
        <article class="card"><h3>Texas</h3><p>77 files.</p><span class="badge">on track</span></article>
      </div>
      <div class="centre">Centred in two declarations</div>
    </main>
    <footer>Resize the preview to see the shell reflow; print preview hides the nav.</footer>
  </div>
</body>
</html>
```

### Quiz

1. The shortest modern way to centre content both ways is…
- [ ] `margin: auto` on the child
- [x] `display: grid; place-items: center` on the parent
- [ ] `text-align: center; vertical-align: middle`
> Flexbox needs two properties; Grid's `place-items` does it in one.

2. What is the specificity of `nav ul li.active > a:hover`?
- [ ] (0,1,4)
- [x] (0,2,4)
- [ ] (0,3,3)
> Two class-level parts (`.active`, `:hover`) and four type selectors; the combinator adds nothing.

3. Which question is specifically about paged media rather than web CSS?
- [ ] Why does `z-index` fail?
- [x] How do you print "Page 3 of 12" in a footer?
- [ ] What is `min-width: 0` for?
> Margin boxes with `counter(page)` and `counter(pages)` are paged-media features.

4. When an interviewer asks you to build a layout live, the recommended first step is…
- [ ] Write the media queries
- [x] Add a reset and tokens, then state the approach before coding
- [ ] Add `!important` to be safe
> It shows structure and lets the interviewer follow your reasoning.

### Exercises

1. **Sixty-second answers** — Write two-sentence answers for: box model, specificity, Flexbox vs Grid, stacking context, `rem` vs `em`.
<details><summary>Solution</summary>

```text
Box model: content, padding, border, margin; border-box makes width include padding and border, so set it globally.
Specificity: (IDs, classes/attributes/pseudo-classes, types) compared left to right; equal specificity falls to source order; layers and !important sit above it.
Flexbox vs Grid: Flexbox distributes items on one axis from content size; Grid places items on two axes against explicit tracks; use both, nested.
Stacking context: a group whose children are z-ordered together and cannot escape it; created by positioned z-index, opacity < 1, transform, filter, isolation.
rem vs em: rem is relative to the root font size, em to the element's own; rem for type and spacing scales, em for things that should follow the element's text.
```

</details>

2. **Debug** — A dropdown inside a `header { position: sticky; top: 0; z-index: 10 }` renders behind a later `section { position: relative; z-index: 20 }`. Fix it.
<details><summary>Solution</summary>

```css
/* The header's z-index: 10 creates a stacking context; the dropdown cannot escape it.
   Either raise the header above the section, or lower the section: */
header { z-index: 30; }
/* or render the dropdown in a portal appended to body with its own z-index */
```

</details>

3. **Print brief** — Sketch the CSS for a two-column landscape rate matrix PDF with a running title and "Page X of Y".
<details><summary>Solution</summary>

```css
@page { size: A4 landscape; margin: 15mm 12mm 18mm; @top-left { content: "Owner's Policy Rate Matrix"; font-size: 9pt; } @bottom-right { content: "Page " counter(page) " of " counter(pages); font-size: 9pt; } }
.matrix { columns: 2; column-gap: 12mm; }
table { width: 100%; break-inside: auto; font-size: 8.5pt; } tr { break-inside: avoid; } thead { display: table-header-group; }
```

</details>

### Interview Questions

**Q: You are handed a broken layout with no context. How do you approach it?**
Open DevTools and inspect the misbehaving element, checking the computed box (size, padding, margins) and the crossed-out declarations to see which rules lost the cascade and why. Then identify which formatting context it lives in: is the parent a flex or grid container, is anything positioned, is there a stacking context or an `overflow` clip above it, and what is the containing block? Most bugs resolve to one of five causes: `min-width: auto` in flex, `content-box` sizing, margin collapse, a stacking context, or a sticky/fixed element trapped by `overflow` or `transform`. I explain the cause before proposing the smallest fix, and I add a comment at the fix so the next person understands the constraint.

**Q: How do you keep your CSS knowledge current, and what has changed recently that you use?**
I read the release notes for Chrome, Firefox and Safari, follow the Interop project's yearly focus areas, and check caniuse before shipping. In the last two to three years I have moved to `:has()` for state-based styling, container queries for components, native nesting, `@layer` to structure precedence, `color-mix()` and OKLCH for palettes, `text-wrap: balance` and `pretty` for typography, `@property` for animated variables, the `0fr`/`1fr` grid trick for animating height, and `content-visibility` for long lists. For documents I track WeasyPrint's changelog, since its support for Grid, `var()` and PDF/UA arrived in specific versions, which matters when a client's server pins an old one.

**Q: Tell me about a hard CSS problem you solved in a real project.**
A strong answer has a constraint, a mechanism and a measurable result. Example: a 767-page employee handbook had to be produced as a PDF from the same HTML as the web version, with a clickable TOC showing page numbers and chapter titles in running headers. Browsers' print mode could not do the page references, so I moved generation to WeasyPrint, built the TOC with `target-counter(attr(href), page)` and `leader(".")`, used `string-set` on `h1` for the header, forced chapters to open on right-hand pages with `break-before: right`, and styled the resulting blank pages with `@page :blank` so they carried no header. Rendering took eleven minutes at first; splitting chapters into parallel renders and merging with pikepdf brought it under two, and the client's QA reduced its manual page-number checks from a full day to a spot check.
