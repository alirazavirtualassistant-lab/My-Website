---
id: design-tools
title: Photoshop, CorelDRAW & InPage
icon: 🖌️
track: Office & Tools
color: #31A8FF
runner: none
tagline: Design covers, letterheads and Urdu publications that print correctly.
description: Graphic design fundamentals for document producers: design principles, colour and typography, raster vs vector; Photoshop (layers, selections, masks, adjustments, text, export, print settings, book-cover mockups); CorelDRAW (objects, curves, text, colour palettes, print/export, business cards and letterheads); InPage for Urdu/Arabic typesetting (Nastaliq fonts, RTL, kashida, export); file formats and print-ready export.
---

# LEVEL: Beginner

## Design principles (contrast, repetition, alignment, proximity)

Before you open Photoshop or CorelDRAW you need a way to judge whether a page *works*. Designers use four principles, often remembered by the acronym **CRAP**: Contrast, Repetition, Alignment and Proximity. They apply to a book cover, a letterhead, a Power BI dashboard and a 767-page handbook equally, and interviewers for design and DTP roles will ask you to critique a layout using exactly these words.

### Contrast

Contrast means that two things that are different should look *clearly* different. A heading that is 14 pt next to body text at 12 pt is a weak contrast and looks like a mistake; a heading at 24 pt bold in the brand colour next to 11 pt regular body text is a deliberate hierarchy.

```text
Weak contrast:    Heading 14 pt regular, body 12 pt regular, both black
Strong contrast:  Heading 24 pt bold #1F3A5F, body 11 pt regular #333333
```

Contrast can come from size, weight, colour, typeface (serif vs sans-serif), space or shape. Use one or two, not all of them at once.

### Repetition

Repeat visual elements throughout a piece so the reader recognises the system. On a policy manual this means the same heading colour, the same rule under every chapter title, the same footer with the document code on every page. On a suite of 43 toolkit covers it means the same title position, the same logo size and the same colour bar on every cover, so they look like one product family on a shelf.

```text
Cover template rules (repeat on every cover):
  Title:      Montserrat Bold 48 pt, x = 0.75 in, baseline 3.5 in from top
  Series bar: 0.5 in tall, brand colour, full bleed at the bottom
  Logo:       1.2 in wide, 0.5 in from the top-right corner
```

### Alignment

Nothing should be placed on the page arbitrarily. Every element should share an edge or a centre line with something else. The most common beginner mistake is centring the title, left-aligning the body and right-aligning the logo, which produces three invisible lines instead of one. Pick a strong left edge (or a centre axis) and hang everything off it.

| Alignment | Feels | Use for |
|---|---|---|
| Flush left | Modern, readable, easy to scan | Body text, reports, letterheads |
| Centred | Formal, static | Invitations, book title pages |
| Flush right | Unusual, draws attention | Page numbers, captions beside images |
| Justified | Dense, newspaper-like | Only with hyphenation on and a measure over 60 characters |

### Proximity

Things that belong together should sit close together; things that do not should be separated by space. A business card with the name, title, phone and email spread evenly across the card reads as four unrelated items. Group name + title, then group phone + email + address, and leave a clear gap between the groups.

> **Tip:** When a layout looks "busy" but you cannot say why, check proximity first. Most clutter is equal spacing between unrelated items, not too many items.

### The squint test

Blur your eyes (or zoom out to 25%) and look at the page. You should still see the hierarchy: one dominant element, a secondary element and a mass of body text. If everything becomes a grey blob of equal weight, the contrast is too weak. If your eye jumps around, alignment or proximity is broken.

### Applying CRAP to a letterhead

A typical Fiverr letterhead brief says "logo top-left, contact details in the footer, keep it clean". Turn that into rules:

```text
Contrast:   Company name 18 pt bold; footer contact details 8 pt regular in 60% grey
Repetition: Brand colour used exactly twice: a 4 pt rule under the header and the footer text
Alignment:  Logo, header rule, body margin and footer all share x = 0.75 in
Proximity:  Footer groups: [address] 0.25 in gap [phone | email] 0.25 in gap [website]
```

Those four lines are also your QA checklist when the client sends revisions.

### Try It Yourself

```text
Critique sheet (fill in for any design you receive)
-----------------------------------------------------
Contrast:   Is the most important element clearly biggest/boldest/most colourful? Y/N
Repetition: List the elements repeated on every page/item: ____________________
Alignment:  How many distinct left edges exist? (target: 1 or 2) ______
Proximity:  Are related items grouped and unrelated items separated? Y/N
Squint test: Dominant element still visible at 25% zoom? Y/N
One fix that would improve it most: ________________________________________
```

### Quiz

1. Which principle is violated when a name, title, phone and email are spaced evenly across a business card?
- [ ] Contrast
- [x] Proximity
- [ ] Repetition
> Related items (phone and email) should sit close together, with space separating them from unrelated groups.

2. A heading at 14 pt regular beside 12 pt body text is an example of what?
- [x] Weak contrast that looks like a mistake
- [ ] Good repetition
- [ ] Strong alignment
> Elements that differ should differ clearly; a small difference reads as an error rather than a hierarchy.

3. What does the squint test check?
- [ ] Colour accuracy
- [x] Whether the visual hierarchy survives when detail is removed
- [ ] Font licensing
> Blurring the page removes detail so only size, weight and placement remain visible.

### Exercises

1. **Fix the flyer** — A one-page training flyer has a centred title, left-aligned bullets, a right-aligned logo and equal 12 pt spacing between every line. Write the four changes you would make.
<details><summary>Solution</summary>

1. Alignment: left-align the title and logo to the same margin as the bullets, giving one strong left edge.
2. Contrast: make the title at least twice the body size and bold; keep bullets regular.
3. Proximity: reduce spacing inside a bullet group to 6 pt and increase spacing between sections to 18 pt.
4. Repetition: use the brand colour for the title and for a single rule above the footer, nowhere else.

</details>

2. **Cover family rules** — Write five repetition rules for a series of ten SOP covers so they look like one set.
<details><summary>Solution</summary>

Same title font, size and position; same logo size and corner; same colour bar height and position; same document-code placement in the footer; same background texture or none. Only the title text and a series number change.

</details>

### Interview Questions

**Q: How do you evaluate whether a layout is "good"?**
I use contrast, repetition, alignment and proximity as a checklist rather than relying on taste. I ask whether the most important element is clearly dominant, whether the elements repeat consistently across pages or items, how many distinct alignment edges exist, and whether related items are grouped. Then I do a squint test at 25% zoom to see if the hierarchy survives. For example, on a 43-cover toolkit I fixed the title baseline, logo position and colour-bar height as rules so every cover passed the same check, and revision rounds dropped because the client could see the system.

**Q: A client says the letterhead looks "cluttered" but will not remove anything. What do you do?**
Clutter is usually a proximity and alignment problem, not a quantity problem. I group the footer into address, phone/email and website blocks with clear gaps, put everything on one left margin, reduce the number of font sizes to three and use the brand colour only twice. That keeps every piece of information the client wants while making the page look calmer. I show a before-and-after side by side so the decision is about the layout, not about deleting their content.

**Q: When is justified text acceptable?**
Only when the measure is long enough, roughly 60 to 75 characters per line, and hyphenation is turned on, otherwise you get rivers of white space between words. It suits dense body text in manuals and newspapers. For letterheads, covers, business cards and anything with short lines I use flush-left ragged-right, which is more readable and never produces rivers.

## Colour theory & brand palettes

Colour is the fastest way to make a document look professional or amateur. A brand palette is a small, deliberate set of colours with defined roles, and most client work starts by extracting or building one. You also need to understand *why* a colour looks different on screen and on paper, because that is the source of most print complaints.

### The colour wheel and harmonies

Colours are described by **hue** (where on the wheel), **saturation** (how pure or grey) and **lightness/value** (how light or dark). Harmonies are recipes for choosing hues that work together:

| Harmony | Rule | Typical use |
|---|---|---|
| Monochromatic | One hue, several lightness/saturation steps | Corporate reports, safest choice |
| Analogous | Two or three neighbouring hues | Calm, natural feel |
| Complementary | Two hues opposite on the wheel | High-impact accent (blue + orange) |
| Split-complementary | One hue + the two neighbours of its opposite | Accent with less tension |
| Triadic | Three hues evenly spaced | Playful; hard to keep professional |

For document work, monochromatic plus one complementary accent covers 90% of briefs.

### Colour models: RGB, CMYK, HSB, Hex

Screens emit light and mix **RGB** (red, green, blue, each 0–255). Printers lay down ink and mix **CMYK** (cyan, magenta, yellow, black, each 0–100%). The same "blue" is a different set of numbers in each model, and some RGB colours cannot be printed at all because they are outside the CMYK **gamut**.

```text
Brand navy
  Hex   #1F3A5F
  RGB   31, 58, 95
  CMYK  100, 80, 35, 30   (approximate conversion; confirm on a proof)
  HSB   215°, 67%, 37%
Pantone 2767 C           (spot colour reference for offset printing)
```

Bright RGB greens, oranges and pure blues shift most when converted to CMYK. Photoshop's **View > Gamut Warning** (Shift+Ctrl+Y) greys out the unprintable areas.

### Building a brand palette

A usable palette has roles, not just colours:

| Role | Example | Where used |
|---|---|---|
| Primary | #1F3A5F navy | Headings, cover bar, logo |
| Secondary | #4A6FA5 mid-blue | Sub-headings, table header rows |
| Accent | #E07A1F orange | Call-outs, one highlight per page |
| Neutral dark | #333333 | Body text (never pure black on screen) |
| Neutral light | #F2F2F2 | Table banding, background panels |
| White | #FFFFFF | Page |

Sixty percent of the page should be neutral, thirty percent primary/secondary and ten percent accent. This **60-30-10** rule is the quickest fix for a design that "has too much colour".

### Tints and shades

A tint is a colour mixed with white; a shade is mixed with black. In CorelDRAW you create tints by lowering the colour's percentage in the Color docker; in Photoshop you lower the layer's opacity or use HSB and raise the brightness. Tints of the primary colour give you table banding and background panels that stay on-brand without adding new hues.

```text
Primary  #1F3A5F  100%
Tint 80% #4C6180
Tint 40% #A5B0BF
Tint 15% #DDE1E7   (table banding)
```

### Accessibility: contrast ratios

Text needs enough contrast against its background to be readable. WCAG requires a ratio of at least **4.5:1** for normal text and **3:1** for large text (18 pt regular or 14 pt bold). White text on #E07A1F orange is about 3.1:1, which fails for body text but passes for large headings. Check with any online contrast checker before finalising a palette; the client's marketing team will ask.

> **Warning:** Never trust a colour on your monitor to match a print. Monitors vary, and uncalibrated laptops often show blues as purple. Always ask the printer for a proof, or print a test page on the same paper stock.

### Extracting a palette from a client logo

Most Fiverr clients send a logo and nothing else. In Photoshop, open the logo, pick the Eyedropper (I), click each colour and read the Hex from the Color Picker. In CorelDRAW, select the logo object and read the fill from the Object Properties docker. Write the values down as a palette table and put it in the deliverable notes; it saves the client asking "what blue did you use" three months later.

### Try It Yourself

```text
Brand palette sheet
-------------------
Client: ____________________
Primary    Hex #______  RGB ___,___,___  CMYK ___,___,___,___  Pantone ______
Secondary  Hex #______  RGB ___,___,___  CMYK ___,___,___,___
Accent     Hex #______  RGB ___,___,___  CMYK ___,___,___,___
Text       Hex #333333  RGB 51,51,51     CMYK 0,0,0,80
Banding    Primary tint 15%
Rule: 60% neutral / 30% primary+secondary / 10% accent
Contrast check: body text on white >= 4.5:1  ____  headings on accent >= 3:1 ____
```

### Quiz

1. Which colour model do commercial printers use?
- [ ] RGB
- [x] CMYK
- [ ] HSB
> Printing mixes ink (cyan, magenta, yellow, black); screens mix light (RGB).

2. What is the 60-30-10 rule?
- [x] 60% neutral, 30% primary/secondary, 10% accent
- [ ] 60% accent, 30% neutral, 10% primary
- [ ] 60% text, 30% images, 10% white space
> Keeping accent colour to about a tenth of the page stops designs looking loud.

3. What contrast ratio does WCAG require for normal body text?
- [ ] 2:1
- [ ] 3:1
- [x] 4.5:1
> 3:1 is only acceptable for large text (18 pt regular or 14 pt bold).

### Exercises

1. **Palette from a logo** — A client's logo is dark green and gold. Propose a six-role palette with hex values and say which colour is the accent.
<details><summary>Solution</summary>

Primary #1B4D3E (dark green); Secondary #2E7D5B (mid green, tint of primary hue); Accent #C9A227 (gold); Neutral dark #333333; Neutral light #F1F3F2 (green-tinted grey); White #FFFFFF. Gold is the accent and is limited to call-outs and one rule per page; body text uses neutral dark for contrast above 4.5:1.

</details>

2. **Gamut check** — A client insists on a neon orange #FF6A00 for a printed cover. Explain the problem and a solution.
<details><summary>Solution</summary>

#FF6A00 is outside the CMYK gamut, so digital or offset printing will produce a duller orange than the screen shows. Options: convert to CMYK early (about 0,70,100,0), show the client a proof, or specify a Pantone spot colour such as 1505 C and have the printer run a fifth ink, which costs more but matches.

</details>

### Interview Questions

**Q: A client says the printed letterhead colour does not match their website. How do you explain and fix it?**
The website colour is RGB light and the letterhead is CMYK ink, so the conversion loses some saturation, especially for bright blues and oranges. I check the brand colour against a Pantone reference, convert it in the design file rather than letting the printer convert it, and send a soft proof. If exact matching is critical, I specify a spot colour and ask for a printed proof on the actual stock. I also explain that different monitors already show the website differently, so the printed piece is judged against the Pantone swatch, not a screen.

**Q: How do you keep a document from looking "too colourful"?**
I assign roles: one primary, one secondary, one accent, and neutrals, then apply the 60-30-10 proportion. Table banding and backgrounds use tints of the primary rather than new hues. I also count the number of distinct colours on a page; more than five including neutrals usually means something is off-brand. On a 767-page handbook the only colours were navy headings, a navy 15% banding and one orange for warning call-outs.

**Q: What is a gamut warning and when do you check it?**
It highlights colours in the document that cannot be reproduced in the target colour space, usually CMYK. I check it in Photoshop with Shift+Ctrl+Y after setting the proof profile to the printer's CMYK, and before sending anything to print. It is most useful on covers with bright photography, where sky blues and saturated greens shift the most.

## Typography basics (pairing, hierarchy, measure)

Typography is how text looks and behaves on the page, and it does more for professionalism than any image. Document producers deal with type all day, in Word, in InDesign-style layouts, on covers and in Urdu publications, so the vocabulary here is used throughout the rest of this course.

### Anatomy and classification

A **typeface** is the design (Montserrat); a **font** is one file of it (Montserrat-Bold.ttf). Typefaces fall into families:

| Class | Examples | Feel | Use |
|---|---|---|---|
| Serif | Georgia, Times New Roman, Garamond, Merriweather | Traditional, bookish | Long body text in print |
| Sans-serif | Arial, Calibri, Montserrat, Open Sans, Roboto | Modern, clean | Headings, screen text, corporate |
| Slab serif | Rockwell, Roboto Slab | Sturdy, confident | Covers, headings |
| Script | Great Vibes, Pacifico | Decorative | One word on an invitation, never body |
| Monospace | Consolas, Courier New | Technical | Code, form fields |
| Nastaliq (Urdu) | Jameel Noori Nastaleeq, Noto Nastaliq Urdu | Calligraphic | Urdu body and headings |

### Pairing

Pair a serif with a sans-serif, or two weights of the same family. Never pair two typefaces that are similar but not identical (Arial and Helvetica), because the difference looks like an error. Safe pairs for document work:

```text
Headings                 Body
Montserrat Bold          Merriweather Regular        (modern report)
Georgia Bold             Calibri Regular             (Word default-friendly)
Roboto Slab Bold         Open Sans Regular           (training manual)
Noto Nastaliq Urdu       Noto Sans (for Latin runs)  (bilingual publication)
```

Limit a document to two families. A third is acceptable only for code or captions.

### Hierarchy

Hierarchy tells the reader what to read first. Build it from size, weight and space, and write it down as a type scale:

```text
Cover title    48 pt  Bold      primary colour
H1             24 pt  Bold      primary colour, 24 pt space before, 8 pt after
H2             16 pt  Semibold  neutral dark, 18 pt before, 6 pt after
Body           11 pt  Regular   neutral dark, line height 15 pt (1.4)
Caption         9 pt  Italic    60% grey
Footer          8 pt  Regular   60% grey
```

A **modular scale** multiplies each step by a ratio (1.25 or 1.333) so sizes feel related. Starting from 11 pt with 1.333: 11, 14.7, 19.5, 26, 34.7. Round to 11, 15, 20, 26, 35.

### Measure and leading

**Measure** is the line length. The comfortable range for body text is 45–75 characters per line, about 60 being ideal. On an A4 page with 1-inch margins, 11 pt body text produces roughly 90 characters per line, which is too long, so either increase the margins, use two columns or increase the size. **Leading** (line spacing) should be 120–145% of the size: 11 pt type on 15 pt leading is written "11/15".

### Tracking, kerning and case

**Tracking** adjusts spacing across a whole word or line; **kerning** adjusts the gap between two specific letters (AV, To, Wa). All-caps headings need positive tracking (+50 to +100 in Photoshop's units, +5 to +10% in CorelDRAW) or they look cramped. Body text should never be tracked. Small caps for acronyms in body text (SOP, BPO) stop them shouting.

### Common mistakes

- Fake bold or fake italic when the font has no real bold: the software smears the outline. Use a family that ships the weights you need.
- Widows and orphans: a single line of a paragraph alone at the top or bottom of a page. Turn on widow/orphan control (Word does this by default; InPage and Photoshop do not).
- Double spaces after a full stop: a typewriter habit that leaves visible holes in justified text.
- Straight quotes (") instead of typographic quotes (" ") in printed material.

> **Interview note:** "How many fonts is too many?" The answer they want: two families, and a maximum of about five size/weight combinations, defined once as styles and reused.

### Try It Yourself

```text
Type scale for a training manual (ratio 1.333, base 11 pt)
----------------------------------------------------------
Level    Size   Weight    Family        Space before/after
Title    35 pt  Bold      Montserrat    cover only
H1       26 pt  Bold      Montserrat    24 / 8 pt
H2       20 pt  Semibold  Montserrat    18 / 6 pt
H3       15 pt  Semibold  Montserrat    12 / 4 pt
Body     11 pt  Regular   Merriweather  0 / 6 pt, leading 15 pt
Caption   9 pt  Italic    Merriweather  4 / 10 pt
Measure target: 60 characters per line -> A4, 1.25 in side margins, single column
```

### Quiz

1. What is the ideal measure for body text?
- [ ] 20–30 characters per line
- [x] 45–75 characters per line
- [ ] 90–120 characters per line
> Lines longer than about 75 characters make the eye lose its place on the return sweep.

2. Which is a safe typeface pairing?
- [ ] Arial + Helvetica
- [x] Montserrat Bold + Merriweather Regular
- [ ] Two script faces
> Pair contrasting classes (sans + serif); similar-but-different faces look like a mistake.

3. What does "11/15" mean?
- [x] 11 pt type on 15 pt leading
- [ ] 11 words per 15 lines
- [ ] Size range 11 to 15 pt
> Leading is the baseline-to-baseline distance and is written after the slash.

4. When should tracking be increased?
- [ ] On all body text
- [x] On all-caps headings
- [ ] Never
> Capitals have no ascender/descender rhythm and need extra space; body text should keep its designed spacing.

### Exercises

1. **Diagnose a manual** — A 120-page SOP uses Calibri 11 pt with single spacing, 0.5-inch margins on Letter paper, and Calibri 12 pt bold headings. List the typographic problems and fixes.
<details><summary>Solution</summary>

Measure is about 110 characters per line: increase margins to 1.25 in or use a larger size. Leading at single spacing in Calibri is about 1.2, acceptable, but 1.35 reads better for training material. Heading contrast is too weak (12 vs 11 pt): use 16 pt semibold for H2 and 22 pt bold for H1 with space before. Consider a serif body (Georgia or Merriweather) paired with Calibri or Montserrat headings so heading and body are visibly different classes.

</details>

2. **Build a modular scale** — Starting from 10 pt with a ratio of 1.25, produce five sizes and assign them to caption, body, H3, H2, H1.
<details><summary>Solution</summary>

10 × 1.25 repeatedly gives 10, 12.5, 15.6, 19.5, 24.4. Rounded: caption 10, body 12.5 (or 12), H3 16, H2 20, H1 24. If 12 pt body is too large for the page, shift the whole scale down one step (8, 10, 12.5, 16, 20) rather than picking arbitrary sizes. The point is that every size is the previous one times the same ratio, so the hierarchy feels related.

</details>

### Interview Questions

**Q: How do you choose fonts for a client's brand document?**
I start from whatever the brand guide specifies; if there is none, I look at the logo's character and pick one sans-serif family for headings and one serif or humanist sans for body, checking that both ship at least regular, italic, bold and bold-italic so Word and CorelDRAW never fake styles. I also check the licence: Google Fonts are safe for client delivery, while a font from a design bundle may not be embeddable. Then I write a type scale of five or six levels and turn it into styles, so the client can extend the document without breaking it.

**Q: Explain the difference between tracking and kerning and when you adjust each.**
Kerning is the space between one specific pair of letters, such as the gap in "AV" or "To", and is adjusted only in large display text like a cover title where a bad pair is visible. Tracking is uniform spacing across a range of text; I increase it on all-caps headings and small caps and never on body text. In Photoshop both are in the Character panel; in CorelDRAW tracking is Character Spacing in the Text properties and kerning is done with the Shape tool by dragging individual character nodes.

**Q: Why does a document in Arial look amateurish and what would you change?**
Arial is not bad in itself, but it is the default that everyone uses without thought, and it is usually combined with weak hierarchy and long measure. I would keep the reader's expectations in mind: if the client cannot install fonts, Calibri or Georgia are safer choices already on every Windows machine; if it is a PDF deliverable, I can use Montserrat or Merriweather and embed them. Either way the bigger improvement comes from a proper type scale, a 60-character measure and consistent spacing, not from the font name alone.

## Raster vs vector & file formats (PSD/AI/CDR/SVG/PNG/JPG/PDF)

Every design file is either **raster** (a grid of pixels) or **vector** (mathematical shapes), and choosing wrongly is the root of "the logo is blurry on the letterhead" and "the client cannot open the file". This chapter gives you the map.

### Raster images

A raster image is a fixed grid of pixels, each with a colour. Photographs, scans and anything painted or retouched are raster. Enlarging a raster image spreads the same pixels over more space, so it becomes blurry or blocky. Photoshop is a raster editor.

```text
Raster facts
  Made of:      pixels (e.g. 3000 x 2000)
  Scales up:    badly (interpolation blurs)
  Scales down:  fine
  Best for:     photos, scans, textures, retouching
  Editors:      Photoshop, GIMP, Affinity Photo
```

### Vector graphics

A vector graphic stores shapes as points, curves and fills. It can be scaled to a billboard with no loss. Logos, icons, letterheads, business cards and diagrams should be vector. CorelDRAW and Illustrator are vector editors.

```text
Vector facts
  Made of:      paths (nodes + Bézier curves), fills, strokes
  Scales:       infinitely, no quality loss
  Best for:     logos, type, layouts, line art, anything for print
  Editors:      CorelDRAW, Illustrator, Inkscape, Affinity Designer
```

A vector file can *contain* raster images (a placed photo on a letterhead), but the photo does not become vector.

### Working formats vs delivery formats

| Format | Type | Native app | Layers kept? | Use |
|---|---|---|---|---|
| PSD | Raster | Photoshop | Yes | Working file for covers, photo editing |
| AI | Vector | Illustrator | Yes | Working file; CorelDRAW imports it |
| CDR | Vector | CorelDRAW | Yes | Working file; almost nothing else opens it |
| SVG | Vector | Any | Partly | Web logos, icons, Inkscape exchange |
| EPS | Vector (legacy) | Any | No | Old printers and Word logo placement |
| PDF | Either | Any | Optional | Universal delivery, print-ready output |
| PNG | Raster | Any | No | Screen graphics with transparency |
| JPG | Raster | Any | No | Photos, small file size, lossy |
| TIFF | Raster | Any | Optional | Lossless print photos, scans |
| WebP | Raster | Browsers | No | Web images, smaller than JPG/PNG |

The rule for client delivery: always send the **working file** (PSD/CDR/AI), a **print PDF** and a **preview PNG/JPG**. Clients lose the working file, the printer needs the PDF, and the client previews on their phone.

### PNG vs JPG

JPG compresses by discarding detail (lossy); it is ideal for photographs and terrible for text, flat colour and logos, where it produces fuzzy halos. PNG is lossless and supports transparency, so logos for Word letterheads and website headers should be PNG. PNG-8 has 256 colours and small files; PNG-24 has full colour.

```text
Logo for a Word letterhead:  PNG-24 with transparent background, 300 ppi at final size
Cover photo for a website:   JPG quality 70–80, or WebP
Scanned signature:           PNG with white removed, or a vector trace
Photo for print:             TIFF or high-quality JPG (12) at 300 ppi
```

### What CorelDRAW and Photoshop can open

CorelDRAW opens AI, EPS, PDF, SVG, and imports PSD (as a bitmap with optional layers). Photoshop opens AI/EPS/PDF only by rasterising them at a resolution you choose. CDR files can be opened only by CorelDRAW or, with older versions, by Inkscape. If a client sends a CDR and you have Illustrator, ask for a PDF or AI export.

> **Warning:** A logo received as a JPG is not a logo; it is a picture of a logo. Ask the client for the vector original (AI, EPS, SVG, PDF or CDR). If it truly does not exist, trace it in CorelDRAW (Bitmaps > Outline Trace) and clean the result before using it on print work.

### Transparency and flattening

Layers, masks and soft shadows exist only in working files. PDFs can preserve transparency (PDF 1.4 and later) but some print RIPs want it **flattened** (transparency converted to opaque pixels and shapes). PDF/X-1a flattens everything; PDF/X-4 keeps live transparency. Both come up again at the Advanced level.

### Try It Yourself

```text
Delivery package for a business-card job
----------------------------------------
client-name_business-card_v3.cdr        working file (CorelDRAW)
client-name_business-card_v3_PRINT.pdf  PDF/X-1a, CMYK, 3 mm bleed, crop marks
client-name_business-card_v3_front.png  preview, 1050 x 600 px, RGB
client-name_business-card_v3_back.png   preview
fonts/                                  only if licence allows; otherwise text converted to curves in the PDF
README.txt                              colours used, fonts used, bleed size, printer instructions
```

### Quiz

1. Which format should a logo be delivered in for use on a Word letterhead?
- [ ] JPG
- [x] PNG with transparency
- [ ] CDR
> Word cannot open CDR, and JPG has no transparency and adds artefacts around flat shapes.

2. What happens when you enlarge a raster image to 300%?
- [x] It becomes blurry because the same pixels cover more space
- [ ] Nothing, it stays sharp
- [ ] It converts to vector automatically
> Raster images have a fixed pixel count; scaling up interpolates new pixels from old ones.

3. Which of these is a vector working format?
- [ ] PSD
- [ ] TIFF
- [x] CDR
> CDR is CorelDRAW's native vector file; PSD and TIFF are raster.

### Exercises

1. **Classify the brief** — A client wants: a book cover with a photograph, a company logo, a signature for a PDF form, and a chart for a Power BI report. Say raster or vector for each and which tool.
<details><summary>Solution</summary>

Cover: raster composite in Photoshop (the photo is raster; the title can be a vector text layer inside the PSD). Logo: vector in CorelDRAW, delivered as SVG/PDF/PNG. Signature: vector trace in CorelDRAW for print, or a transparent PNG for the PDF form. Chart: neither tool; charts should be generated natively in Power BI so they stay data-driven.

</details>

2. **Rescue a JPG logo** — The only logo the client has is a 400 × 200 px JPG. Describe the steps to get a usable vector.
<details><summary>Solution</summary>

Open in CorelDRAW, Bitmaps > Outline Trace > Logo, adjust Detail and Smoothing, remove the background colour, then clean the nodes with the Shape tool, replace any text with the real font, and set the fills to the brand palette. Deliver as CDR, SVG and PDF, and tell the client to keep those files.

</details>

### Interview Questions

**Q: A client complains the logo prints blurry on their letterhead. What went wrong?**
The logo was placed as a low-resolution raster, usually a JPG or PNG saved for the web at 72 ppi, and Word or the printer scaled it up. The fix is to obtain the vector original and place it as SVG (Word 2016 and later), EMF or a high-resolution PNG rendered at 300 ppi at the printed size. I explain the raster/vector difference in one sentence: a JPG is a photo of the logo, while the vector is the logo itself, and it scales without loss.

**Q: What files do you deliver for a print job and why each one?**
The native working file so the client or a future designer can edit it, a print-ready PDF (PDF/X-1a or X-4 depending on the printer) with bleed and marks so the printer never has to open the working file, and a PNG or JPG preview for approval and for their website. I also include a short README with fonts, colours and bleed size. This has saved me many revision rounds on Fiverr because the client can forward the PDF to any printer without asking me for a new export.

**Q: When would you choose PNG over JPG and vice versa?**
PNG for anything with flat colour, text, transparency or sharp edges: logos, screenshots, diagrams. JPG for photographs where a slight loss of detail is invisible and file size matters, such as a cover mockup emailed to a client. Using JPG for a logo gives fuzzy halos around edges, and using PNG for a full-page photo gives a file several times larger than it needs to be.

## Resolution & document setup for screen vs print

Most "it looked fine on screen" print disasters are document-setup mistakes made in the first thirty seconds. This chapter covers pixels, inches, ppi, bleed and the exact New Document settings for the jobs you will do most.

### Pixels, ppi and physical size

A raster image has a pixel count (3000 × 2000). Its **physical size** when printed depends on the **ppi** (pixels per inch) you assign. The same 3000 × 2000 image is 10 × 6.67 inches at 300 ppi or 41.7 × 27.8 inches at 72 ppi. Nothing about the pixels changed; only the intended print size did.

```text
Print size = pixels / ppi
  3000 px / 300 ppi = 10 in
  3000 px /  72 ppi = 41.67 in

Pixels needed = print size x ppi
  A4 width 8.27 in x 300 ppi = 2481 px
  6 x 9 in book cover front = 1800 x 2700 px (before bleed)
```

**dpi** (dots per inch) is a printer property; **ppi** is an image property. People use them interchangeably, and interviewers may too, but knowing the difference is a small credibility win.

### Resolution targets

| Output | Resolution | Colour | Notes |
|---|---|---|---|
| Offset/digital print | 300 ppi at final size | CMYK | Photos and covers |
| Large-format banner | 100–150 ppi at final size | CMYK | Viewed from a distance |
| Screen / web | 72–96 ppi, think in pixels | RGB | ppi is irrelevant; pixel size matters |
| Word/PDF documents | 200–300 ppi images | RGB or CMYK | Word downsamples to 220 ppi by default |
| Line art / scanned text | 600–1200 ppi | Bitmap/greyscale | Keeps thin lines crisp |

### Bleed, trim and safe area

Printers cannot cut exactly on the edge. **Bleed** is extra artwork beyond the trim edge (usually 3 mm or 0.125 in) so that no white sliver appears if the cut drifts. The **safe area** (margin) is the zone inside the trim where text and logos must stay, usually 3–5 mm.

```text
Business card 85 x 55 mm (Pakistan / EU) or 3.5 x 2 in (US)
  Trim:   85 x 55 mm
  Bleed:  +3 mm each side -> document 91 x 61 mm
  Safe:   -3 mm each side -> keep content within 79 x 49 mm
```

### Photoshop: New Document for print

```text
File > New (Ctrl+N) > Print tab
  Width:            6.25 in    (6 in trim + 0.125 in bleed each side)
  Height:           9.25 in
  Resolution:       300 Pixels/Inch
  Color Mode:       CMYK Color, 8 bit   (or RGB if the printer converts; ask)
  Background:       White
  Advanced > Color Profile: U.S. Web Coated (SWOP) v2, or the printer's profile
Then: View > New Guide Layout to mark the 0.125 in bleed and 0.25 in safe area
```

### Photoshop: New Document for screen

```text
File > New > Web tab
  Width x Height:   1920 x 1080 px (banner), 1200 x 628 px (social)
  Resolution:       72 (ignored by browsers; pixel dimensions are what count)
  Color Mode:       RGB Color, 8 bit
  Color Profile:    sRGB IEC61966-2.1
```

### CorelDRAW: Document setup

CorelDRAW is vector, so resolution applies only to placed bitmaps and effects. The important settings are size, units, bleed and colour mode.

```text
File > New (Ctrl+N)
  Preset:            Default CMYK for print, Default RGB for web
  Size:              A4 / Letter / Custom 85 x 55 mm
  Primary color mode: CMYK
  Rendering resolution: 300 dpi (for effects and rasterised shadows)
  Color settings:    Coated FOGRA39 (Europe/Pakistan printers) or U.S. Web Coated (SWOP)
Layout > Page Size > Bleed: 3 mm, tick "Show bleed area"
```

### InPage: Document setup

InPage is a page-layout program, so it thinks in pages and columns. **File > New** asks for page size (A4, Letter, custom in inches, cm or points), margins and number of columns. Set the **Default Language** to Urdu for right-to-left flow before typing anything; changing it later reflows the whole document.

### Units and guides

Work in the unit the printer uses: millimetres in Pakistan, Europe and the UK; inches in the US. Change it in Photoshop under **Edit > Preferences > Units & Rulers** and in CorelDRAW on the property bar when nothing is selected. Turn on rulers (Ctrl+R in Photoshop) and drag guides for margins, and in CorelDRAW use **Window > Dockers > Guidelines** to type exact positions.

> **Tip:** Save your print setups as presets (Photoshop: the Save Document Preset icon in the New Document dialog; CorelDRAW: Tools > Options > Document > Save as default). A "6x9 cover CMYK 300" preset removes a whole category of mistakes.

### Try It Yourself

```text
Document setup checklist
------------------------
Job:            [ ] print   [ ] screen
Final size:     ______ x ______ (mm / in)
Bleed:          3 mm / 0.125 in each side -> document ______ x ______
Safe area:      3–5 mm inside trim
Resolution:     300 ppi (print)  |  pixel dimensions (screen)
Colour mode:    CMYK (print)     |  RGB sRGB (screen)
Profile:        FOGRA39 / SWOP   |  sRGB
Units:          mm / in set in preferences
Guides:         bleed + trim + safe placed before any content
Preset saved:   [ ]
```

### Quiz

1. An image is 1200 × 1800 px. How large can it print at 300 ppi?
- [x] 4 × 6 in
- [ ] 12 × 18 in
- [ ] 1200 × 1800 in
> Divide pixels by ppi: 1200/300 = 4 in and 1800/300 = 6 in.

2. What is bleed?
- [ ] The safe zone for text
- [x] Extra artwork beyond the trim edge to survive cutting inaccuracy
- [ ] A colour-management setting
> Without bleed, a slightly off cut leaves a white sliver on the edge.

3. For a web banner, which setting actually matters?
- [ ] 300 ppi
- [x] Pixel dimensions such as 1920 × 1080
- [ ] Bleed of 3 mm
> Browsers show pixels; the ppi value in the file is ignored on screen.

4. Which colour mode should a print document in CorelDRAW use?
- [x] CMYK
- [ ] RGB
- [ ] Greyscale always
> Building in CMYK from the start avoids surprises when the printer converts.

### Exercises

1. **Set up a 6 × 9 in paperback front cover** — Give the Photoshop New Document values including bleed.
<details><summary>Solution</summary>

Width 6.25 in, height 9.25 in (0.125 in bleed each side), 300 ppi, CMYK 8-bit, profile as required by the printer (KDP accepts RGB or CMYK; offset printers usually want FOGRA39 or SWOP). Add guides at 0.125 in from every edge (trim) and 0.375 in (safe area).

</details>

2. **Convert a client request** — A client wants a "2000 × 1000 pixel" banner printed at 1 metre wide. Explain what will happen and what you need instead.
<details><summary>Solution</summary>

1 metre is 39.4 in; 2000 px across 39.4 in is about 51 ppi, which is low even for large format viewed at a distance (100–150 ppi target). Ask for the vector artwork or a raster at least 4000–6000 px wide, or rebuild the banner as a vector in CorelDRAW where size does not matter.

</details>

3. **Business card document** — Give the CorelDRAW settings for an 85 × 55 mm card with bleed.
<details><summary>Solution</summary>

File > New: Custom 85 × 55 mm, CMYK, 300 dpi rendering resolution, FOGRA39. Layout > Page Size > Bleed 3 mm with "Show bleed area" ticked. Add guidelines 3 mm inside each edge for the safe area. Two pages (front/back) so the PDF exports as a two-page file.

</details>

### Interview Questions

**Q: A client sends a 72 ppi image and asks you to "make it 300 ppi". What do you say?**
Changing the ppi number does not add detail; it only changes the intended print size. If I uncheck Resample in Image > Image Size and set 300 ppi, the pixel count stays the same and the print size shrinks to a quarter. If I leave Resample on, Photoshop invents pixels and the result is soft. I explain this and ask for the original camera file or a larger image, or I use the image at the size it genuinely supports, and for a cover photo I sometimes use Photoshop's Preserve Details 2.0 upscaling as a last resort with a warning.

**Q: Why do you set colour mode and profile at document creation instead of at export?**
Because colours chosen in RGB may not exist in CMYK and will shift when converted, and the shift is unpredictable across a whole design. Setting CMYK and the printer's profile at the start means the colour picker, gamut warning and soft proof all show me what will actually print. For screen work the opposite applies: sRGB at creation ensures the exported PNG looks the same in every browser. Converting at the end works for simple documents, but for covers with photographs it produces surprises.

**Q: What is the difference between bleed and safe area, and what values do you use?**
Bleed is artwork extended beyond the trim line so an imperfect cut never shows white; safe area is the zone inside the trim line where text and logos must stay so they are never cut off. I use 3 mm bleed and 3–5 mm safe area for cards and letterheads, and 0.125 in bleed with 0.25–0.375 in safe area for US book covers. The printer's spec overrides these defaults, so I always read it first and put the values in the delivery README.

# LEVEL: Intermediate

## Photoshop: layers, selections & masks

Photoshop is built around three ideas: **layers** stack image content, **selections** limit where an edit applies, and **masks** hide parts of a layer without deleting them. Once these click, every cover, mockup and retouching job is a combination of the same moves. Menu paths below are for Photoshop 2024/2025 (v25/v26); shortcuts are Windows.

### Layers

Every element of a design should be on its own layer: background photo, colour overlay, title text, logo, spine. The **Layers panel** (Window > Layers, F7) lists them top to bottom; the top layer is in front.

```text
Layer > New > Layer                Shift+Ctrl+N
Duplicate layer                    Ctrl+J (duplicates the selection if one exists)
Merge down                         Ctrl+E
Merge visible into new layer       Shift+Ctrl+Alt+E (keeps the originals)
Group selected layers              Ctrl+G
Toggle visibility                  click the eye icon; Alt+click to solo
Lock transparent pixels / position layer panel lock icons
Layer opacity                      type 1–0 with the Move tool active (5 = 50%)
```

Layer types you will use constantly:

| Type | Created by | Why it matters |
|---|---|---|
| Pixel layer | New Layer, paste | Ordinary raster content |
| Type layer | Text tool | Stays editable; vector until rasterised |
| Shape layer | Rectangle/Ellipse tools | Vector shapes with fill and stroke |
| Adjustment layer | Layer > New Adjustment Layer | Non-destructive colour edits (next chapter) |
| Smart Object | Layer > Smart Objects > Convert | Protects the original pixels through transforms and filters |
| Group | Ctrl+G | Folder; can be masked as a unit |

**Blend modes** (the dropdown at the top of the panel) control how a layer combines with those below. Multiply darkens (good for placing a logo with a white background onto a coloured cover), Screen lightens, Overlay adds contrast, and Color applies hue without changing luminance.

### Selections

A selection is the "live" area; anything you paint, fill, delete or adjust happens only inside it. Marching ants show the border.

```text
Rectangular Marquee    M         Shift = add, Alt = subtract, Shift+Alt = intersect
Lasso / Polygonal      L         freehand and straight-edged
Quick Selection        W         paints a selection by edges
Object Selection       W         drag a box; Photoshop finds the object (2020+)
Magic Wand             W         selects similar colour; Tolerance on the option bar
Select > Subject                 AI-driven person/object selection (2018+)
Select > Sky                     sky only (2021+)
Select > Color Range             selects by colour with a Fuzziness slider
Select All / Deselect / Reselect Ctrl+A / Ctrl+D / Shift+Ctrl+D
Inverse                          Shift+Ctrl+I
Select > Select and Mask...      refine hair and soft edges; Output To: Layer Mask
```

Select and Mask is where most "cut out the person for the cover" work happens: use the Refine Edge Brush on hair, set **Decontaminate Colors** to remove background fringing, and output to a **layer mask** rather than deleting pixels.

### Masks

A **layer mask** is a greyscale image attached to a layer: white shows, black hides, grey is partly transparent. It is reversible, which is why professionals never use the Eraser on a real project.

```text
Add mask (reveal all)        Layers panel mask icon, or Layer > Layer Mask > Reveal All
Add mask from selection      make a selection, click the mask icon (Hide Selection: Alt+click)
Paint on the mask            click the mask thumbnail, Brush (B), black hides / white reveals
Invert mask                  Ctrl+I with the mask thumbnail selected
Disable / enable mask        Shift+click the mask thumbnail
View mask alone              Alt+click the mask thumbnail
Unlink mask from layer       click the chain icon between thumbnails
Clipping mask                Alt+click between two layers, or Ctrl+Alt+G (upper layer is clipped to the lower layer's shape)
Vector mask                  Layer > Vector Mask > Current Path (sharp, resolution-independent edge)
```

A **clipping mask** is the standard way to place a photo inside a shape: draw a rectangle shape layer for the cover image area, put the photo above it, press Ctrl+Alt+G, and the photo is visible only inside the rectangle. Move or resize the photo freely; the rectangle stays.

### A worked example: photo behind a title block

1. Open the photo; it is the Background layer. Double-click it to convert to a normal layer.
2. Draw a rectangle shape (U) for the title panel, fill with the brand navy, set opacity to 85%.
3. Add a type layer (T) on top of the panel.
4. Select > Subject on the photo layer, add a mask, then paint the mask so the subject's shoulder overlaps the panel edge for depth.
5. Save as PSD to keep everything editable.

> **Warning:** Rasterising a type or Smart Object layer, flattening (Layer > Flatten Image) or applying a mask permanently are one-way doors. Keep the PSD with layers; make a flattened copy only at export time.

### Try It Yourself

```text
Layer stack for a 6 x 9 in paperback front cover (top to bottom)
----------------------------------------------------------------
[Group] Text
   Author name          (type layer, Montserrat Regular 20 pt, white)
   Title                (type layer, Montserrat Bold 60 pt, white, tracking +20)
[Shape] Title panel     (rectangle, #1F3A5F, opacity 85%, mask fades the left edge)
[Smart Object] Photo    (clipped to the panel below with Ctrl+Alt+G; mask from Select > Subject)
[Shape] Photo frame     (rectangle covering the top 65% of the cover)
[Adjustment] Curves     (darkens the photo slightly so white text reads)
Background              (solid #0F1F33)
Guides: trim 0.125 in, safe 0.375 in, spine edge at the right
```

### Quiz

1. What does black on a layer mask do?
- [ ] Deletes pixels permanently
- [x] Hides that part of the layer reversibly
- [ ] Fills the area with black
> Masks hide rather than erase; paint white to bring the pixels back.

2. Which shortcut clips the selected layer to the layer below?
- [ ] Ctrl+G
- [x] Ctrl+Alt+G
- [ ] Ctrl+E
> Ctrl+G groups; Ctrl+E merges down; Ctrl+Alt+G creates or releases a clipping mask.

3. Why convert a placed photo to a Smart Object before scaling it down and up again?
- [x] The original pixels are preserved so repeated transforms do not degrade it
- [ ] It makes the file smaller
- [ ] It converts the photo to vector
> Smart Objects keep the source data; ordinary layers lose detail every time they are resampled.

4. What is the Select and Mask workspace used for?
- [ ] Setting CMYK profiles
- [x] Refining soft edges such as hair and outputting to a layer mask
- [ ] Creating layer groups
> Its Refine Edge Brush and Decontaminate Colors options are built for cut-outs.

### Exercises

1. **Cut out and place** — Take a portrait, isolate the person and place them on a solid brand-colour background, non-destructively.
<details><summary>Solution</summary>

Select > Subject; Select and Mask; use the Refine Edge Brush on the hair; tick Decontaminate Colors; Output To: New Layer with Layer Mask. Below the new layer add a Solid Color fill layer (Layer > New Fill Layer > Solid Color) in the brand colour. The original photo layer remains intact but hidden.

</details>

2. **Fade a photo into a panel** — Make a cover photo fade smoothly into a navy panel at the bottom.
<details><summary>Solution</summary>

Put the navy Solid Color fill layer under the photo. Add a mask to the photo layer, choose the Gradient tool (G), black to white, and drag upward from the bottom third of the photo. Adjust by repainting the mask with a soft brush at low opacity.

</details>

### Interview Questions

**Q: Why do you insist on non-destructive editing, and what does that mean in practice?**
Non-destructive means every change can be undone or adjusted later without re-doing the work: masks instead of the eraser, adjustment layers instead of Image > Adjustments, Smart Objects instead of raw pixel transforms, and Smart Filters instead of baked-in filters. In practice a client who asks on revision three to "bring back a bit more of the background" gets it in two minutes by painting white on a mask, instead of me starting the cut-out again. The cost is larger PSD files and a slightly slower machine, which is worth it on any paid job.

**Q: How do you place a photograph inside a shape on a cover?**
I draw the shape as a vector shape layer, place the photo as a Smart Object above it, and clip the photo to the shape with Ctrl+Alt+G. The photo can then be repositioned or scaled inside the shape at any time, and the shape edge stays crisp at any resolution because it is vector. If the shape needs a soft edge I add a layer mask to the shape rather than to the photo, so the clipping relationship stays simple.

**Q: What is the difference between a layer mask and a vector mask, and when do you use each?**
A layer mask is greyscale pixels, so it supports soft, feathered and painted edges and is right for photographs, hair and gradients. A vector mask is a path, so its edge is perfectly sharp at any output size and is right for geometric crops on covers, letterhead panels and anything that will be scaled. A layer can carry both at once, which is useful when a photo needs a hard geometric crop plus a soft fade inside it.

## Photoshop: adjustments, retouching & text

With layers and masks in hand, the next skills are making a photo look right (adjustments), cleaning it (retouching) and adding typographically correct text. All three are things a Fiverr cover client expects without asking.

### Adjustment layers

**Layer > New Adjustment Layer** (or the half-filled circle icon in the Layers panel) creates a layer that changes the appearance of everything below it. It has its own mask, can be re-opened by double-clicking, and can be clipped to a single layer with Ctrl+Alt+G.

| Adjustment | Use it for |
|---|---|
| Levels (Ctrl+L as a direct edit) | Set black point, white point and midtones; fix flat scans |
| Curves | Precise tonal control; the professional's default |
| Hue/Saturation | Shift or desaturate individual colour ranges |
| Color Balance | Warm or cool the shadows/midtones/highlights separately |
| Black & White | Convert to mono with per-colour control; much better than Desaturate |
| Vibrance | Boost muted colours without blowing out skin tones |
| Gradient Map | Duotone effects for cover art (map tones to two brand colours) |
| Selective Color | Fine CMYK-style tweaks per colour |

```text
Curves adjustment for a dull cover photo
  Add point at input 64  -> output 52   (deepen shadows)
  Add point at input 192 -> output 205  (lift highlights)
  Result: gentle S-curve, more contrast, no clipping
  Check: Window > Histogram shows no spike at 0 or 255
```

A **Gradient Map** with the brand navy at 0% and the accent at 100% turns any photo into an on-brand duotone, which is the trick behind many consistent series covers.

### Retouching tools

```text
Spot Healing Brush    J   click blemishes/dust; Content-Aware type
Healing Brush         J   Alt+click a clean source, then paint; blends texture and tone
Clone Stamp           S   Alt+click a source, paint an exact copy (no blending)
Patch tool            J   lasso an area, drag it to a clean area
Content-Aware Fill        select an object > Edit > Content-Aware Fill (2019+)
Remove tool           J   paint over an object; AI removes it (2023+)
Dodge / Burn          O   lighten/darken; use Range: Midtones, Exposure 5–10%
Camera Raw Filter         Filter > Camera Raw Filter for global exposure, clarity, dehaze
```

Retouch on a new empty layer with "Sample: Current & Below" ticked on the options bar so the original pixels remain untouched. For a scanned document cover or an old photo, Filter > Noise > Dust & Scratches (Radius 1–2) followed by manual Healing Brush work is faster than healing every speck.

### Sharpening and noise

Sharpen last, at final size. **Filter > Sharpen > Unsharp Mask** with Amount 80–120%, Radius 1.0 px, Threshold 2 is a safe print default for 300 ppi; **Smart Sharpen** handles noise better. Apply it to a Smart Object so the filter stays editable as a **Smart Filter**.

### Text

Photoshop text is vector until rasterised and is controlled by two panels: **Character** (Window > Character) and **Paragraph**.

```text
Horizontal Type tool  T     click for point text (titles); drag a box for paragraph text
Character panel             family, style, size, leading, kerning (Metrics/Optical), tracking,
                            vertical/horizontal scale, baseline shift, colour,
                            faux bold/italic (avoid), all caps, small caps
Paragraph panel             alignment, indents, space before/after, hyphenation
Type > Convert to Paragraph Text / Point Text
Type > Warp Text            arcs and flags (use sparingly)
Layer > Layer Style         drop shadow, stroke, gradient overlay on text
Commit edits                Ctrl+Enter;  Esc cancels
Type > Convert to Shape     makes editable vector outlines (text no longer editable)
```

**Paragraph styles** and **Character styles** (Window > Paragraph Styles) work like Word styles: define "Cover Title" and "Back Cover Body" once and apply them to every cover in a series. This is how a 43-cover suite keeps identical typography.

### Text tips that matter in print

- Set kerning to **Optical** for display sizes above 36 pt; leave Metrics for body sizes.
- Use **Type > Language** and turn on hyphenation for back-cover blurbs so justified text does not river.
- Turn off **Fractional Widths** (Character panel menu) for small screen text; keep it on for print.
- White text over a photo needs either a darkening Curves layer, a panel, or a subtle drop shadow (Opacity 40%, Distance 2 px, Size 4 px); pure black shadows at 100% look cheap.
- Avoid faux bold: if the family lacks a bold, pick a family that has one.

> **Tip:** Keep type as editable type layers until the very last export. Clients change titles, subtitles and author names far more often than they change photographs.

### Try It Yourself

```text
Character panel settings: series cover title
--------------------------------------------
Font family:      Montserrat
Style:            ExtraBold
Size:             64 pt
Leading:          58 pt (tight, 0.9)
Kerning:          Optical
Tracking:         +10
Case:             All Caps
Color:            #FFFFFF
Anti-aliasing:    Sharp (print) / Smooth (web)
Layer Style:      Drop Shadow, Multiply, Opacity 35%, Angle 120, Distance 3 px, Spread 0, Size 6 px
Paragraph:        Align left, Hyphenate off
Saved as Paragraph Style "Cover Title" for the whole series
```

### Quiz

1. Why use a Curves adjustment layer instead of Image > Adjustments > Curves?
- [x] It stays editable and has its own mask
- [ ] It is faster to render
- [ ] It works in CMYK only
> Direct adjustments change pixels permanently; adjustment layers can be re-opened and limited with a mask.

2. Which tool copies pixels exactly without blending?
- [ ] Healing Brush
- [x] Clone Stamp
- [ ] Spot Healing Brush
> Healing tools blend texture with surrounding tone; Clone Stamp paints a literal copy.

3. What is faux bold?
- [ ] A bold weight designed by the type designer
- [x] A synthetic thickening applied when the font has no real bold
- [ ] A layer style
> Faux styles distort letterforms and may not export correctly to PDF; use a real weight.

4. When should sharpening be applied?
- [ ] First, before adjustments
- [x] Last, at final output size
- [ ] Never on print work
> Sharpening depends on pixel size; resizing after sharpening either loses the effect or creates halos.

### Exercises

1. **Duotone series cover** — Turn a colour photo into a navy/orange duotone that matches the brand palette.
<details><summary>Solution</summary>

Add a Black & White adjustment layer to control which colours become light or dark, then a Gradient Map adjustment layer with #1F3A5F at 0%, #E07A1F at 100% (optionally a mid stop of #6B5E52 at 50% for smoother transition). Lower the Gradient Map opacity to 85% if the effect is too strong. Save the two adjustment layers as a group and drag it into every other cover PSD.

</details>

2. **Clean a scanned certificate** — Remove dust, straighten and brighten a scanned certificate for a client PDF.
<details><summary>Solution</summary>

Filter > Camera Raw Filter for exposure and whites; Image > Image Rotation > Arbitrary using the Ruler tool's Straighten Layer; Filter > Noise > Dust & Scratches Radius 1; Spot Healing Brush on remaining marks on a new layer with Sample: Current & Below; Levels to set a clean white point (white eyedropper on the paper). Export at 300 ppi.

</details>

### Interview Questions

**Q: A client's cover photo is flat and dull. Walk me through fixing it.**
I start with a Camera Raw Filter on a Smart Object for exposure, contrast, dehaze and white balance, because those sliders are perceptual and fast. Then a Curves adjustment layer for a gentle S-curve, checking the histogram for clipping. If the colours compete with the brand palette I add a Vibrance layer or, for a series look, a Gradient Map duotone. Everything stays as adjustment layers so when the client says "a bit warmer" it is one slider. Finally Smart Sharpen at output size.

**Q: How do you keep typography consistent across dozens of covers in Photoshop?**
I define Paragraph Styles and Character Styles in a master PSD and load them into the others via the Paragraph Styles panel menu (Load Paragraph Styles). Together with guides and a fixed layer structure, that makes each new cover a matter of replacing the photo and retyping the title. I also keep a Library (Window > Libraries) with the logo, palette swatches and the styles so they follow me between files. This is the same discipline as using Word styles instead of manual formatting.

**Q: What is the difference between the Healing Brush and the Clone Stamp, and when would you choose each?**
The Healing Brush copies texture from the source and blends it into the destination's tone and colour, so it is right for skin, paper and gradients where an exact copy would show a patch. The Clone Stamp copies pixels literally, which is right when I need to extend a hard edge, repeat a pattern or rebuild part of a logo where blending would smear it. For most cover retouching I use Healing first and Clone Stamp only on edges.

## Photoshop: export for web & print (Save As, Export As, CMYK)

Getting a design out of Photoshop correctly is a separate skill from making it. The wrong export produces blurry web images, huge files, colour shifts and PDFs printers reject. This chapter gives you the exact dialogs.

### The three ways out

| Command | Path | Use for |
|---|---|---|
| Save As | File > Save As (Shift+Ctrl+S) | PSD, TIFF, Photoshop PDF: full-fidelity, layers optional |
| Save a Copy | File > Save a Copy (Alt+Ctrl+S, 2021+) | JPG, PNG and other flattened formats from a layered file |
| Export As | File > Export > Export As (Alt+Shift+Ctrl+W) | Web assets: PNG, JPG, GIF, SVG; scaling; sRGB conversion |
| Save for Web (Legacy) | File > Export > Save for Web | Older dialog with precise JPG/PNG-8 control and file-size preview |

Since Photoshop 22.4 (2021), Save As no longer offers JPG/PNG for layered files; use Save a Copy or Export As. Interviewers who ask "why can't I save as JPG" are checking whether you know this.

### Export for web

```text
File > Export > Export As
  Format:         PNG (transparency, flat colour) or JPG (photos)
  Quality (JPG):  70–80 for web; 100 only for archive
  Image Size:     set Width in px (e.g. 1200) with Resample: Bicubic Sharper (reduction)
  Scale:          1x, and add 2x for retina if the web team asks
  Canvas Size:    leave
  Metadata:       None (removes camera data; smaller file)
  Color Space:    tick Convert to sRGB; tick Embed Color Profile
Export All / Export
```

Always convert to sRGB for the web. A CMYK or Adobe RGB PNG shows dull colours in browsers. For a transparent logo, use PNG and make sure the Background layer is hidden or deleted.

### Export for print: PDF

Printers want a PDF with the correct standard, embedded fonts (or outlined text), bleed and marks.

```text
File > Save As > Format: Photoshop PDF
  [ ] Layers (untick for the print copy; keep a PSD master)
  Adobe PDF Preset:    [PDF/X-1a:2001] for most offset printers
                       [PDF/X-4:2008] if the printer accepts live transparency
  Compression:         Do Not Downsample, JPEG Maximum (or ZIP for lossless)
  Output:              Color Conversion: Convert to Destination; Destination: printer profile
                       Profile Inclusion: Include Destination Profile
  Marks and Bleeds:    Crop marks, Bleed: use document bleed (0.125 in / 3 mm)
```

Photoshop includes bleed only if the canvas already contains the bleed area; unlike CorelDRAW it does not add it. That is why the document was set up at 6.25 × 9.25 in for a 6 × 9 in cover.

### RGB to CMYK conversion

If the document was built in RGB, convert before the final print export:

```text
Edit > Color Settings (Shift+Ctrl+K)
  Working Spaces > CMYK: U.S. Web Coated (SWOP) v2  or  Coated FOGRA39 (ISO 12647-2:2004)
View > Proof Setup > Working CMYK, then View > Proof Colors (Ctrl+Y) to preview
View > Gamut Warning (Shift+Ctrl+Y) to see unprintable colours
Image > Mode > CMYK Color   (flatten? No: keep layers; adjustment layers may shift)
   or Edit > Convert to Profile for explicit intent: Relative Colorimetric, Black Point Compensation
```

Converting mode is destructive to some blend modes and adjustment layers, so do it on a **copy** (Image > Duplicate). The intent matters: **Relative Colorimetric** keeps in-gamut colours identical and clips the rest; **Perceptual** compresses the whole range gently and suits photographs with vivid colours.

### Rich black and total ink

Text in CMYK should be **100% K only** (0,0,0,100) so it registers cleanly and stays sharp. Large black areas on a cover should use **rich black** such as 60,40,40,100 so they do not look grey next to photographs. Never exceed the printer's total ink limit (usually 300% for coated stock, 240–280% for uncoated): 100,100,100,100 will not dry and will offset onto the next sheet.

| Element | CMYK | Why |
|---|---|---|
| Body text, thin lines | 0,0,0,100 | No registration fringe |
| Large black panels | 60,40,40,100 | Deep, neutral black |
| Cool rich black | 70,50,30,100 | Matches navy designs |
| Never | 100,100,100,100 | Exceeds ink limit |

### Flattening and transparency

PDF/X-1a flattens transparency, which can create visible white boxes around drop shadows over spot colours or thin white lines ("stitching") where flattened regions meet. Check by opening the exported PDF in Acrobat with **Output Preview** (Print Production tools) and zooming to 400%. PDF/X-4 avoids this but not every printer's RIP accepts it. Ask.

> **Warning:** Do not let the printer receive a JPG "print file". JPG has no bleed information, no CMYK guarantee, no vector text and compression artefacts. A print PDF takes an extra minute and prevents the most common print rejection.

### Try It Yourself

```text
Export checklist: 6 x 9 in cover, offset printer wants PDF/X-1a, FOGRA39
----------------------------------------------------------------------
1. Image > Duplicate  (work on the copy)
2. Edit > Convert to Profile > Coated FOGRA39, Relative Colorimetric, BPC on
3. Check text layers are 0,0,0,100; panels use 60,40,40,100
4. View > Proof Colors (Ctrl+Y); Gamut Warning (Shift+Ctrl+Y) -> fix any grey areas
5. Type layers: leave editable (PDF embeds fonts) or Type > Convert to Shape if licence forbids embedding
6. File > Save As > Photoshop PDF, untick Layers, preset PDF/X-1a:2001, Crop marks, Bleed 0.125 in
7. Open in Acrobat > Print Production > Output Preview: confirm CMYK only, total ink < 300%
8. File > Export > Export As > JPG 80, 1200 px wide, sRGB  (client preview)
```

### Quiz

1. Since Photoshop 22.4, how do you produce a JPG from a layered PSD?
- [ ] File > Save As > JPG
- [x] File > Save a Copy or File > Export > Export As
- [ ] Layer > Flatten then Ctrl+S
> Save As no longer lists flattened formats for layered documents; Save a Copy and Export As do.

2. Which CMYK value should ordinary body text use?
- [x] 0,0,0,100
- [ ] 60,40,40,100
- [ ] 100,100,100,100
> Single-ink black avoids registration fringes; rich black is only for large areas.

3. What does PDF/X-1a do with transparency?
- [x] Flattens it
- [ ] Preserves it
- [ ] Converts it to spot colours
> PDF/X-1a is a flattened, CMYK-only standard; PDF/X-4 keeps live transparency.

4. Which colour space should web exports use?
- [ ] Coated FOGRA39
- [ ] Adobe RGB
- [x] sRGB
> Browsers assume sRGB; other profiles look dull or shifted online.

### Exercises

1. **Two exports from one file** — Produce a print PDF and a web preview from the same cover PSD, listing every setting.
<details><summary>Solution</summary>

Print: duplicate, Convert to Profile (printer CMYK, Relative Colorimetric), Save As Photoshop PDF, PDF/X-1a, no layers, crop marks, bleed 0.125 in, Do Not Downsample. Web: from the original RGB PSD, Export As JPG quality 75, width 1200 px, Convert to sRGB, metadata None. File names: cover_v3_PRINT.pdf and cover_v3_preview.jpg.

</details>

2. **Fix an ink-limit rejection** — The printer rejects a PDF for exceeding 300% total ink. Find and fix the cause.
<details><summary>Solution</summary>

Open the PDF in Acrobat > Print Production > Output Preview, set Total Area Coverage to 300% and the offending areas highlight (usually a rich black made from 100,100,100,100 or a dark photo converted with a bad profile). In Photoshop change panels to 60,40,40,100 and reconvert the photo using the printer's profile, which respects the profile's ink limit. Re-export and re-check.

</details>

### Interview Questions

**Q: A printer says the colours in your PDF look "muddy". What do you check?**
First whether the file was converted to CMYK with the printer's actual profile or with a generic one; SWOP on a FOGRA press or vice versa shifts everything. Then the rendering intent: Perceptual can dull already-muted images, so I compare Relative Colorimetric. Then total ink and rich black recipes. Finally I check whether the source was in a wide space like Adobe RGB and was double-converted. I send a soft-proof screenshot and ask for a printed proof before the run.

**Q: What is the difference between Export As and Save for Web, and why does Photoshop still have both?**
Export As is the modern dialog: it handles large documents, multiple scales for retina, SVG, artboards and automatic sRGB conversion. Save for Web (Legacy) gives finer control over JPG chroma, PNG-8 palette and dithering and shows an exact file size and 2-up/4-up comparison, which is still useful for tight page-weight budgets. I use Export As by default and Save for Web when a client's web developer sets a strict kilobyte limit.

**Q: Explain rich black versus 100% K and where each belongs.**
100% K is a single ink; it is sharp and has no registration problem, so all text and thin lines use it. Rich black adds C, M and Y under the K, giving a denser, more neutral black for large panels and backgrounds, because a large area of K alone looks greyish next to a photograph. The recipe must stay under the printer's total ink limit, so I use around 60,40,40,100. Using rich black on small text causes coloured fringes if the press registration is even slightly off.

## CorelDRAW: objects, curves & the toolbox

CorelDRAW is the vector workhorse for letterheads, business cards, logos, certificates and signage in Pakistan's print industry, so the toolbox must become muscle memory. Paths below refer to CorelDRAW 2021–2024 on Windows; earlier versions (X7, X8) use the same tools with slightly different docker names.

### The workspace

The **Toolbox** is on the left, the **Property Bar** under the menus changes with the selected tool, and **Dockers** (Window > Dockers) on the right hold Objects, Properties, Color, Guidelines and more. The page is the printable area; the surrounding **desktop** is scratch space that does not print.

```text
Window > Dockers > Objects        (Ctrl+F7 in older versions: Object Manager) layers and stacking
Window > Dockers > Properties     fill, outline, transparency, text properties for the selection
Window > Dockers > Guidelines     type exact guideline positions
Window > Dockers > Align and Distribute   Ctrl+Shift+A
Window > Dockers > Transform      Alt+F7 (position), Alt+F8 (rotate), Alt+F9 (scale), Alt+F10 (size)
View > Snap To > Guidelines / Objects / Page
Zoom to page                      Shift+F4;   zoom to selection  Shift+F2;  zoom all objects F4
```

### Core tools

| Tool | Key | Notes |
|---|---|---|
| Pick | Space toggles | Select, move, scale; click twice to rotate/skew |
| Shape | F10 | Edit nodes; also kerns text and rounds rectangle corners |
| Rectangle / Ellipse | F6 / F7 | Ctrl for square/circle; Shift from centre |
| Polygon / Star | Y | Sides on the property bar |
| Freehand / Bézier / Pen | F5 / — / — | Draw curves; Bézier click-drag for smooth nodes |
| Smart Fill | — | Fills any enclosed area, even overlaps |
| Text | F8 | Artistic (click) and Paragraph (drag) text |
| Interactive Fill | G | Drag on an object for a fountain (gradient) fill |
| Eyedropper / Attributes Eyedropper | — | Copy colour or full properties between objects |
| Outline / Fill dialogs | F12 / Shift+F11 | Precise settings |
| Transparency | — | Uniform or fountain transparency |
| Drop Shadow / Contour / Blend | — | Interactive effects; break apart before export if needed |

### Objects and stacking

Everything is an **object** with a fill and an outline. Objects stack in creation order; **Object > Order** moves them (Shift+PgUp to front, Shift+PgDn to back, Ctrl+PgUp/PgDn one step). Group with Ctrl+G, ungroup with Ctrl+U, and use **Layers** in the Objects docker for structure: a locked "Guides & bleed" layer, a "Background" layer, a "Content" layer.

```text
Duplicate in place           Ctrl+D (offset set in Tools > Options > Document > General)
Copy                         + on the numeric keypad while dragging, or right-click drag > Copy Here
Step and Repeat              Ctrl+Shift+D (grid of business cards on a sheet)
Combine                      Ctrl+L (merges into one curve; overlaps become holes)
Break Apart                  Ctrl+K
Weld / Trim / Intersect      Object > Shaping, or the property bar with two objects selected
PowerClip                    Object > PowerClip > Place Inside Frame (photo inside a shape)
Convert to Curves            Ctrl+Q (shapes and text become editable paths)
Lock / Unlock                Object > Lock
```

**Shaping** is how logos are built: draw primitives, weld them for one silhouette, trim to cut holes, intersect for the overlap. **PowerClip** is CorelDRAW's clipping mask: a photo inside a rounded rectangle on a business card, or a pattern inside a letterhead band.

### Curves and nodes

Every shape is ultimately a **curve** made of **nodes** joined by straight or curved segments. Press Ctrl+Q on a rectangle and it becomes four nodes you can edit with the Shape tool (F10).

```text
Node types (Shape tool property bar)
  Cusp      independent control handles; sharp corner
  Smooth    handles in a line, different lengths; smooth curve through the node
  Symmetrical  handles in a line, same length; perfectly even curve
Property bar actions
  Add / Delete nodes; Join two nodes; Break curve; Convert to line / to curve
  Reduce Nodes (simplifies traced logos)
  Close Curve (needed before a fill will show)
Double-click on a segment with the Shape tool = add node
```

An open curve cannot take a fill (unless Tools > Options > "Fill open curves" is on). If a traced logo will not fill, the path has a gap: select two end nodes and click **Join Two Nodes**.

### Tracing bitmaps

**Bitmaps > Outline Trace > Logo** (or Line Art, Detailed Logo, Clipart, High Quality Image) converts a raster logo to curves. Adjust **Detail**, **Smoothing** and **Corner smoothness**, tick **Remove background**, and choose the colour mode (CMYK for print). Then Ungroup, delete stray objects, Reduce Nodes, and recolour with palette swatches.

### Alignment and precision

```text
Align and Distribute (Ctrl+Shift+A)
  Align Left / Right / Top / Bottom / Centre horizontally (C) / vertically (E)
  Align to: Active object (last selected) | Page edge | Page centre | Grid
  Distribute: spacing evenly by centre or by edges
Property bar with an object selected: X, Y, width, height with the lock ratio toggle
Object > Object Properties: exact outline width in pt/mm; set "Scale with object" for logos
```

> **Tip:** Turn on **View > Snap To > Objects** and **Guidelines**, then let the dynamic guides show midpoints and edges. Numeric entry in the Transform docker beats dragging for anything that must repeat across a suite.

### Try It Yourself

```text
Build a simple shield logo in CorelDRAW
---------------------------------------
1. Rectangle (F6) 40 x 50 mm; Shape tool (F10) drag a corner node for 6 mm rounded corners
2. Ellipse (F7) 40 x 30 mm, centred on the rectangle's bottom edge (Align: C then B)
3. Select both, Object > Shaping > Weld  -> one shield curve
4. Ctrl+D duplicate, Alt+F9 scale 85%, centre on original (C, E)  -> inner shield
5. Select outer then inner, Object > Shaping > Trim -> border ring
6. Text (F8) "SL" Montserrat ExtraBold 36 pt, Ctrl+Q convert to curves, centre
7. Fill ring 100,80,35,30 CMYK; fill letters 0,0,0,0 (white); outline none
8. Ctrl+G group; File > Export > SVG and PDF; keep the .cdr
```

### Quiz

1. Which shortcut converts a shape or text into editable curves?
- [ ] Ctrl+L
- [x] Ctrl+Q
- [ ] Ctrl+K
> Ctrl+L combines objects, Ctrl+K breaks apart; Ctrl+Q converts to curves.

2. What does PowerClip do?
- [x] Places an object inside another object's shape, like a clipping mask
- [ ] Deletes the overlapping area
- [ ] Converts a bitmap to vector
> PowerClip is CorelDRAW's container mechanism for photos inside shapes.

3. A traced logo shape will not accept a fill. What is the most likely cause?
- [ ] It is on a locked layer
- [x] The curve is open (has a gap)
- [ ] It is in RGB mode
> Open curves show no fill by default; join the end nodes with the Shape tool.

4. Which node type gives a perfectly even curve through the node?
- [ ] Cusp
- [ ] Smooth
- [x] Symmetrical
> Symmetrical nodes have collinear handles of equal length on both sides.

### Exercises

1. **Photo in a circle** — Place a client's headshot inside a circle with a 1 pt navy outline for a business card.
<details><summary>Solution</summary>

Draw an ellipse with Ctrl held (F7). File > Import (Ctrl+I) the photo. Select the photo, Object > PowerClip > Place Inside Frame, click the circle. Right-click the circle > Edit PowerClip to reposition, then Finish Editing. Set the circle outline to 1 pt, navy, and turn on "Scale with object" in Object Properties.

</details>

2. **Clean a trace** — A traced logo has 3,400 nodes and jagged edges. Reduce it to something printable.
<details><summary>Solution</summary>

Re-trace with Bitmaps > Outline Trace > Logo, raising Smoothing and lowering Detail. Ungroup, delete background and stray specks (select with the Pick tool by dragging tiny marquees or use Edit > Select All > Objects and check the count in the status bar). Select each shape and click Reduce Nodes on the Shape tool property bar; hand-fix corners as cusp nodes. Recolour with palette swatches and replace text with live type.

</details>

### Interview Questions

**Q: How do you build a logo in CorelDRAW so that it prints cleanly at any size?**
I build it from primitives and Bézier curves, combine them with Weld, Trim and Intersect rather than stacking overlapping shapes, keep outlines set to "Scale with object" or avoid outlines entirely, and use only palette swatches in CMYK or a named spot colour. Text is converted to curves in the delivered version but kept live in the master file. The result is a single grouped object with few nodes that exports to SVG, PDF and EPS without effects that need rasterising.

**Q: What is the difference between Combine and Group?**
Group keeps separate objects together for moving and scaling; each keeps its own fill and outline. Combine merges them into one curve with one fill; where the paths overlap, holes appear, which is how a letter "O" or a ring is made. I combine when I need a single path, for example for a die-cut line or for a logo mark, and group when I only need to move things together.

**Q: When do you use Trace versus redrawing a logo?**
Trace is fast for clean, high-contrast originals such as a scanned black-and-white letterhead logo, and with node reduction it can be print-ready in ten minutes. Redrawing is better when the source is a blurry JPG, when the logo contains text (which should always be re-set in the real font) or when geometric precision matters, because a trace never gives perfectly straight lines or true circles. Often I trace to get proportions and then redraw the primary shapes over it.

## CorelDRAW: text, styles & colour palettes

Layout work in CorelDRAW is mostly text and colour done consistently. This chapter covers the two text types, the Object Styles that keep a suite uniform, and the palette and colour dockers that keep print colours correct.

### Artistic vs paragraph text

CorelDRAW's Text tool (F8) makes two very different objects:

| | Artistic text | Paragraph text |
|---|---|---|
| Create | Click once and type | Drag a frame, then type |
| Best for | Titles, names, single lines, text on a path | Body copy, addresses, blurbs |
| Effects | Can be enveloped, fitted to a path, extruded | Limited effects |
| Flow | No wrapping | Wraps inside the frame, can link frames |
| Convert | Ctrl+F8 switches between the two | |

Paragraph text frames can be **linked** (click the bottom tab of one frame, then click the next) so an overflowing back-cover blurb continues in another column.

### Text properties

```text
Window > Dockers > Properties (Text tab)      or  Text > Text Properties (Ctrl+T)
  Character: font, size, kerning, character spacing (tracking %), position, case, colour
  Paragraph: alignment, spacing before/after, line spacing (% of character height or points),
             indents, tabs, bullets, drop caps, hyphenation
  Frame:     columns, gutter, vertical alignment
Text > Fit Text to Path           artistic text follows a curve (rotate/offset on the property bar)
Text > Insert Character (Ctrl+F11)  glyphs and symbols
Text > Writing Tools > Spell Check (Ctrl+F12)
Text > Convert to Curves (Ctrl+Q)   outlines text for delivery to printers without fonts
Text > Font List Options            show only fonts used; find missing fonts
```

Kern individual letters by selecting the text with the **Shape tool (F10)** and dragging the small node under each character; drag the horizontal arrow at the bottom right to track a whole line, the vertical arrow to change leading.

### Object Styles and style sets

**Window > Dockers > Object Styles** (Ctrl+F5) is CorelDRAW's equivalent of Word styles. A **style** holds one property set (character, paragraph, fill, outline); a **style set** holds several. Right-click any formatted object and choose **Object Styles > New Style Set From** to capture it.

```text
Object Styles docker
  Styles:      Character / Paragraph / Fill / Outline / Frame
  Style Sets:  "Letterhead Body" = Character(Open Sans 10 pt) + Paragraph(12 pt leading) + Fill(80% K)
  Apply:       select object(s) and double-click the style set
  Edit:        change the style; every object using it updates
  Default object properties: right-click in the docker > Set as default (new text inherits it)
Save the document as a template: File > Save As Template (.cdt)
```

Style sets are the reason a 15-piece stationery suite can change its brand font in one edit.

### Colour palettes

CorelDRAW shows the **Document palette** (colours used so far) at the bottom and the **Default palette** on the right. For brand work, create a custom palette so everyone picks from the same swatches.

```text
Window > Dockers > Palettes                 open PANTONE, FOGRA, HKS and custom palettes
Window > Dockers > Color                    mix a colour by CMYK/RGB/HSB/Hex; drag it onto the palette
Create a palette: Palettes docker > + > New Empty Palette; drag colours in; name it "ClientName"
Add from document: right-click Document palette > Add From Document
Tools > Color Management > Document Settings  primary mode CMYK, profile FOGRA39/SWOP
Left-click a swatch = fill; right-click = outline; Ctrl+click adds 10% of the swatch
```

**Spot colours**: choose PANTONE+ Solid Coated from the Palettes docker and click, for example, 2767 C. The colour is stored as a named spot, which exports as a separate plate in the PDF. Use spot colours only when the printer will actually run a spot ink; otherwise convert them to CMYK in the Color docker.

### Fills and outlines

```text
Fill dialog (Shift+F11): Uniform, Fountain (linear/elliptical/conical/rectangular), Vector pattern,
                         Bitmap pattern, Two-colour pattern, Texture, PostScript
Outline pen (F12):       width, colour, corners (mitre/round/bevel), line caps, arrows,
                         Behind fill, Scale with object, Overprint outline
Interactive Fill (G):    drag on the object; property bar for angle, transparency and node colours
Attributes Eyedropper:   copy fill + outline + effects to another object with one click
```

Set outline width in **points**, never "hairline" for print work: some RIPs render hairline as 0.25 pt, others as the thinnest line the device can draw, which is invisible on a plate.

### Common text problems

- **Missing fonts** on another machine: on opening, CorelDRAW offers substitution; fix it by embedding fonts in the CDR (File > Save As > Advanced > Embed fonts, if the licence allows) or converting text to curves in delivery copies.
- **Text overflows** show a small arrow at the bottom of the frame; nothing beyond it prints.
- **Fake bold** appears when a font lacks a bold weight; the property bar's B button greys out, so switch families.
- **Urdu or Arabic text** in CorelDRAW needs a Unicode Nastaliq font and the paragraph direction set to RTL (Text Properties > Paragraph > Text direction) in 2019 and later; earlier versions handle it badly, which is why InPage still exists (Advanced level).

> **Interview note:** "How would you change the font across 40 certificate templates?" The strong answer is Object Styles plus Find and Replace (Edit > Find and Replace > Replace Objects > text properties), not opening each file and clicking.

### Try It Yourself

```text
Letterhead text setup in CorelDRAW (A4, 3 mm bleed)
---------------------------------------------------
Style set "LH Company"   Montserrat SemiBold 18 pt, fill 100,80,35,30, tracking 5%
Style set "LH Tagline"   Open Sans Italic 9 pt, fill 0,0,0,60
Style set "LH Footer"    Open Sans Regular 8 pt, fill 0,0,0,70, leading 11 pt, centred
Palette "ClientName":    Navy 100,80,35,30 | Orange 0,60,100,0 | Grey 0,0,0,70 | Band 15% navy
Objects:
  Logo (imported SVG, 30 mm wide) at x=20 mm, y=15 mm from top-left
  Company name (artistic text, "LH Company") baseline aligned to logo centre
  Header rule: 0.75 pt navy line from x=20 mm to 190 mm at y=42 mm
  Footer frame (paragraph text, 170 x 12 mm, "LH Footer") 12 mm from bottom, centred
  Guides: 20 mm side margins, 45 mm top (body starts), 25 mm bottom
Save As Template: ClientName-Letterhead.cdt
```

### Quiz

1. Which text type wraps inside a frame and can link to another frame?
- [ ] Artistic text
- [x] Paragraph text
- [ ] Curve text
> Artistic text is a single line object for titles; paragraph text flows and links.

2. What is the fastest way to change the font on every object using a style set?
- [x] Edit the style set in the Object Styles docker
- [ ] Select all and change the font on the property bar
- [ ] Re-type the text
> Editing the style updates every object linked to it, and Select All would also change unrelated text.

3. Why avoid "hairline" outlines for print?
- [ ] They print too thick
- [x] Different RIPs interpret hairline differently, sometimes invisibly thin
- [ ] Hairline is RGB only
> Specify a real width such as 0.25 pt so every device prints the same line.

4. Left-clicking a palette swatch does what?
- [x] Applies it as the fill
- [ ] Applies it as the outline
- [ ] Deletes the object's colour
> Left-click fills; right-click sets the outline colour.

### Exercises

1. **Text on a curved seal** — Put "SYSTEMS LIMITED • QUALITY ASSURED" around the top of a circular stamp.
<details><summary>Solution</summary>

Draw a circle, create artistic text, then Text > Fit Text to Path and click the circle. On the property bar set text orientation, distance from path (e.g. 2 mm) and offset to centre it at the top. For text along the bottom that reads correctly, duplicate the circle, fit a second text, and click Mirror Text horizontally/vertically on the property bar. Finally Object > Break Text Apart if the circle should not print, or set the circle's outline to none.

</details>

2. **Brand palette file** — Build a custom palette from the client's five brand colours and set it as the document default.
<details><summary>Solution</summary>

Palettes docker > + > New Empty Palette, name it. In the Color docker enter each CMYK value and drag the swatch into the new palette, rename swatches (right-click > Rename). Right-click the palette tab > Set as Default. To share, the .xml palette file lives under Documents\Corel\Corel Content\Palettes; send it with the .cdt template.

</details>

### Interview Questions

**Q: A client's stationery suite must switch from Arial to Montserrat. How do you do it in CorelDRAW?**
If the suite was built with Object Styles, I edit the character style in each template and everything updates. If it was built by hand, I use Edit > Find and Replace > Replace Objects with font properties, replacing Arial Regular and Arial Bold with the Montserrat equivalents, then check for reflow in paragraph frames because Montserrat is wider. I then rebuild the templates properly with style sets so the next rebrand is a one-minute job, and I explain that to the client as part of the deliverable.

**Q: When do you convert text to curves, and what do you lose?**
I convert in the delivery copy sent to a printer who may not have the fonts, or when the font licence forbids embedding. I lose editability, spell-check and the ability to change the font, and very small text can look slightly heavier because hinting is gone, so I keep the master CDR with live text and version the outlined copy separately. With PDF export I usually prefer embedding fonts (subset) over outlining, and outline only when the printer asks.

**Q: What is the difference between a spot colour and a process colour in your CorelDRAW files?**
A process colour is a CMYK mix printed with the four standard inks; a spot colour is a named ink such as PANTONE 2767 C that the printer mixes and runs as its own plate. Spot gives exact, consistent brand colour and can do metallics and fluorescents, but each spot adds a plate and cost. I use spot only when the printer confirms it, and I make sure the same swatch is used everywhere in the file so the PDF shows exactly one extra plate rather than several near-duplicates.

# LEVEL: Advanced

## Letterheads, business cards & branded stationery (bleed, safe area)

Stationery is the bread-and-butter print job: letterhead, business card, envelope, compliment slip, invoice header, sometimes a folder. Clients judge it by whether the printed result matches the screen and whether the Word letterhead template behaves. This chapter is the full production workflow in CorelDRAW with the Word hand-off.

### Sizes and specifications

| Item | Trim size | Bleed | Safe area | Notes |
|---|---|---|---|---|
| Letterhead (A4) | 210 × 297 mm | 3 mm | 10 mm | Also supplied as Word template |
| Letterhead (US) | 8.5 × 11 in | 0.125 in | 0.375 in | Same design, different template |
| Business card (PK/EU) | 85 × 55 mm (or 90 × 55) | 3 mm | 3–4 mm | Confirm with the printer |
| Business card (US) | 3.5 × 2 in | 0.125 in | 0.125 in | |

Ask the printer for a spec sheet before starting; some card printers include bleed in an 88 × 58 mm size, others want 2 mm.

### Document structure in CorelDRAW

```text
File > New: A4, CMYK, FOGRA39, 300 dpi
Layout > Page Size: Bleed 3 mm, Show bleed area
Layers (Objects docker):
  Guides      locked, non-printing: trim, safe area, fold lines, Word body area
  Background  full-bleed panels, patterns
  Artwork     logo, rules, contact block
  Variable    name/title on cards (for multiple staff)
Master page: put the logo and footer on the Master Page layer if all pages share them
```

Guidelines: **Window > Dockers > Guidelines**, add Horizontal 3 (bleed), 10 (safe), and the same from the far edges. Set **Tools > Options > Document > Guidelines** colour to something visible.

### Letterhead design rules

- The letter body will be typed in Word, so keep the top 40–45 mm for the header and the bottom 25 mm for the footer, leaving the middle clean.
- Contact details in 8–9 pt, one weight, grouped by proximity. Include the website without "http://".
- A second, **continuation page** without the full header is standard for multi-page letters.
- Avoid content within 10 mm of the edge; most office printers cannot print there, so the Word version of the letterhead would show a gap.

```text
Header block (A4)
  Logo:         28 mm wide, top-left at (20 mm, 12 mm)
  Company name: Montserrat SemiBold 16 pt, baseline aligned with logo vertical centre
  Rule:         0.75 pt, navy, y = 42 mm, from x = 20 to 190 mm
Footer block
  Text frame:   170 x 12 mm, bottom at 285 mm, centred 8 pt grey, 11 pt leading
  Line 1:       Address | Phone | Email
  Line 2:       Website | NTN / registration number (Pakistan) or company number
```

### Business cards

Front: name, title, phone, email; back: logo and website, or a full-bleed brand colour. Keep type at 7.5 pt minimum and lines at 0.25 pt, and never put a border on the trim line: any cutting drift makes it uneven.

```text
Card front (85 x 55 mm, 3 mm bleed)
  Name:    Montserrat SemiBold 11 pt, navy, x = 8 mm, baseline 22 mm
  Title:   Open Sans Regular 7.5 pt, 60% K, baseline 26 mm
  Contact: Open Sans Regular 7.5 pt, 80% K, three lines, leading 10 pt, bottom-left safe corner
  Logo:    18 mm, top-right safe corner
Card back
  Navy full bleed (91 x 61 mm rectangle)
  Logo reversed to white, 30 mm, centred
```

For multiple staff, keep one master card and use **File > Print Merge** (CorelDRAW's mail merge) with a CSV of names, titles and numbers; it generates a page per person with identical layout.

### Word letterhead template hand-off

The client will type letters in Word, so deliver a `.dotx` alongside the print PDF:

1. Export the header and footer artwork from CorelDRAW as **PNG at 300 dpi** (transparent) or **SVG** (Word 2016+), cropped to the artwork only, not the whole page.
2. In Word: Layout > Margins 25 mm top / 20 mm sides / 30 mm bottom; Insert > Header, place the image, set wrap to Behind Text, position relative to page.
3. Insert > Footer for the contact block, or place it as text in the footer using the brand fonts if the client has them (otherwise Calibri/Arial equivalents).
4. Layout > Page Setup > Layout tab > tick **Different first page** so the continuation page shows a smaller header.
5. Save as Word Template (.dotx) and test-print on the client's actual printer for edge clipping.

> **Warning:** Never place a full-page A4 image in the Word header: office printers have a 4–6 mm unprintable border, the file balloons to several megabytes, and every letter emails slowly. Crop to the artwork and position it.

### Pre-flight before sending

```text
[ ] Trim, bleed and safe guides match the printer spec
[ ] All colours CMYK or one confirmed spot; no RGB objects (Edit > Find and Replace > Find Objects > Fill: RGB)
[ ] Small text 100% K; rich black only on large panels
[ ] Minimum 0.25 pt outlines; no hairlines
[ ] Fonts embedded or converted to curves in the print copy
[ ] Bitmaps 300 dpi at placed size (Bitmaps > Bitmap info / Document Properties)
[ ] Export PDF/X-1a with crop marks; check in Acrobat Output Preview
[ ] Deliver: .cdr master, PRINT.pdf, previews, .dotx, README
```

### Try It Yourself

```text
Print Merge for 12 staff business cards (CorelDRAW)
---------------------------------------------------
staff.csv
  Name,Title,Phone,Email
  Ali Raza,Document Production Specialist,+92 300 0000000,ali@example.com
  ...
File > Print Merge > Create/Load Print Merge
  Import from file > staff.csv > fields Name, Title, Phone, Email
Insert fields: place cursor in each text object > Print Merge toolbar > Insert Field
Preview: Print Merge > Perform Merge > Merge to New Document
Result: 12 pages, one card per page, identical layout; export PDF/X-1a with bleed
```

### Quiz

1. What is the safe area on a business card for?
- [ ] Extra artwork that gets cut off
- [x] Keeping text and logos away from the cutting tolerance
- [ ] Space for the printer's barcode
> Cuts drift by up to 1–2 mm; content inside the safe area survives.

2. Why not put a thin border exactly on the trim line of a card?
- [x] Any cutting drift makes the border visibly uneven
- [ ] Borders are not allowed in CMYK
- [ ] It increases the file size
> A border needs to be well inside the safe area or extended into the bleed as a full panel.

3. How should the letterhead header be delivered for Word?
- [ ] A full-page A4 JPG in the header
- [x] Cropped artwork as 300 dpi transparent PNG or SVG, positioned in the header
- [ ] Pasted from CorelDRAW as an OLE object
> Cropped artwork keeps the .dotx small and avoids unprintable-border clipping.

4. What generates one card per staff member from a master layout?
- [ ] Step and Repeat
- [x] File > Print Merge
- [ ] Object > Duplicate
> Print Merge fills text fields from a CSV; Step and Repeat only copies objects.

### Exercises

1. **Continuation page** — Explain how to set up the second-page letterhead in both CorelDRAW and the Word template.
<details><summary>Solution</summary>

CorelDRAW: add page 2, copy only the small logo (say 15 mm) to the top-left and the footer block; export both pages in one PDF. Word: Page Setup > Layout > Different first page; put the full header in the First Page Header and the small logo in the default Header; the footer can be identical in both.

</details>

2. **RGB audit** — Find and fix every RGB object in a stationery file before export.
<details><summary>Solution</summary>

Edit > Find and Replace > Find Objects, tick Fill and choose Color model RGB, Find All; do the same for Outline. Convert each result via the Color docker (change model to CMYK) or replace with a palette swatch. Also open Document Properties to check imported bitmaps' colour mode and convert with Bitmaps > Mode > CMYK Color where needed.

</details>

### Interview Questions

**Q: A client wants the letterhead they can print themselves and one for the commercial printer. How do the files differ?**
The commercial version is a CorelDRAW file exported as PDF/X-1a with 3 mm bleed, crop marks, CMYK and possibly a spot colour; it can have full-bleed colour panels. The self-print version is a Word .dotx with the artwork cropped and placed in the header and footer, everything at least 10 mm from the edge because office printers have an unprintable border, RGB PNGs at 300 dpi, and no full-bleed elements. I design both at the same time so the two versions match visually, and I test the Word one on a normal laser printer before delivery.

**Q: How do you handle a stationery job for 40 staff members without designing 40 cards?**
One master card in CorelDRAW with Print Merge fields for name, title, phone and email, driven by a CSV the client fills in. I merge to a new document, get one page per person, run a spell-check pass, and export a single multi-page PDF/X-1a with bleed. If a name is too long for the safe area I set the name text as paragraph text with a fixed frame and a slightly smaller size for that record. The client gets the CSV back so future additions are a re-merge, not a design job.

**Q: What pre-flight checks do you run before sending stationery to print?**
Guides against the printer's spec, colour audit for RGB objects and stray spot colours, small text at 100% K, no hairlines, bitmaps at 300 dpi at placed size, fonts embedded or outlined in the print copy, then a PDF/X-1a export with crop marks that I open in Acrobat's Output Preview to confirm plates and total ink. I keep this as a checklist because the failures are always the same small things, and the cost of one missed RGB blue is a reprint the client will not pay for.

## Book covers & case-wrap mockups in Photoshop (spine, smart objects)

Print-on-demand covers are a large slice of freelance document work: the interior is done in Word or InDesign, and the client needs a full wrap (back, spine, front) that KDP, IngramSpark or a local press will accept. Photoshop handles the artwork; the maths must be right first.

### Cover anatomy

A paperback **full wrap** is one image: back cover on the left, spine in the middle, front cover on the right, plus bleed all round. A hardcover **case wrap** adds the wrap-around allowance that is glued under the boards, plus the hinge area near the spine.

```text
Paperback (KDP), 6 x 9 in trim, 300 pages, white paper
  Spine width  = pages x 0.002252 in (white)  = 300 x 0.002252 = 0.6756 in
               (cream paper: 0.0025 in per page; colour interior: 0.002347 in)
  Total width  = bleed + back + spine + front + bleed
               = 0.125 + 6 + 0.6756 + 6 + 0.125 = 12.9256 in
  Total height = 9 + 0.125 x 2 = 9.25 in
Document: 12.9256 x 9.25 in, 300 ppi, CMYK or RGB (KDP accepts both; it converts to CMYK)
Guides (vertical, from left): 0.125 | 6.125 | 6.8006 | 12.8006
Safe area: 0.25 in inside trim; spine text needs 0.0625 in clearance each side and
           KDP requires at least 79 pages for spine text (~100 recommended)
```

IngramSpark provides a downloadable template with exact guides; use it instead of calculating. Local Pakistani presses will give you paper GSM instead of per-page thickness; ask for the spine width in millimetres from a dummy.

### Setting up in Photoshop

1. File > New with the calculated size, 300 ppi, and the printer's colour mode.
2. View > New Guide Layout: set columns manually or simply View > New Guide with the positions above. Also add the safe-area guides.
3. Create layer groups: **Back**, **Spine**, **Front**, **Bleed check**.
4. Put a temporary red rectangle for the spine at 50% opacity so you can see alignment; delete before export.

Barcode: KDP adds its own; IngramSpark gives you an EPS; a local press needs you to place a barcode generated from the ISBN (an EAN-13 at 100% K on white, at least 1.75 × 1 in, in the lower-right of the back cover).

### Smart Objects for editable series covers

Convert every placed image and every reusable panel into a **Smart Object** (Layer > Smart Objects > Convert to Smart Object). Smart Objects keep the original data, so scaling, warping and filters remain non-destructive and can be edited later by double-clicking.

```text
Layer > Smart Objects > Convert to Smart Object
Layer > Smart Objects > Replace Contents...        swap the photo for the next book in the series
Layer > Smart Objects > Edit Contents (double-click)   opens the embedded file; save to update
Layer > Smart Objects > Convert to Linked...       link to an external PSD (updates when it changes)
Filter on a Smart Object = Smart Filter (editable, maskable)
Edit > Free Transform (Ctrl+T) on a Smart Object = lossless, re-editable
```

A **linked** Smart Object is how a shared back-cover block (publisher logo, barcode area, ISBN text) is kept in one external file and updated across every cover in a series.

### Spine

Spine text is rotated 90° clockwise so it reads top to bottom when the book lies face up (English convention). Use the Type tool, set the text, then Edit > Transform > Rotate 90° Clockwise, and align to the spine centre with Align to Selection. Keep 0.0625 in (1.6 mm) from each spine edge. Colour the spine to match either the front or the back so a slight misalignment on the fold is invisible.

### Mockups

Clients love a 3D mockup for their Amazon page and social media. Build one with Smart Objects:

1. Create a 2000 × 2000 px RGB document.
2. Place your flat front cover as a Smart Object.
3. Edit > Transform > Distort to give a slight perspective; add a Layer Style inner shadow near the spine edge; add a soft drop shadow on the background.
4. For a case-wrap mockup use **Edit > Transform > Warp** on the Smart Object for the curved board edge, and a gradient layer in Multiply mode for the hinge shading.
5. Save the mockup PSD; for the next book, right-click the Smart Object > Replace Contents and every distortion re-applies automatically.

Free and paid mockup PSDs work the same way: double-click their Smart Object, paste your cover, save. Check licensing before using one on a client deliverable.

> **Tip:** Keep a "cover-master" PSD per series with guides, groups, styles and Smart Objects in place. A new title in the series then takes fifteen minutes: Replace Contents on the photo, retype the title, update the spine width, export.

### Exporting the wrap

```text
KDP paperback:  PDF, no crop marks (KDP rejects marks), bleed included in the size, fonts embedded,
                File > Save As > Photoshop PDF > High Quality Print, untick Layers
IngramSpark:    PDF/X-1a:2001, CMYK, crop marks per their template
Local press:    PDF/X-1a or high-res TIFF at 300 ppi, CMYK, 3 mm bleed, marks on
Amazon eBook:   JPG, RGB, 1600 x 2560 px (1.6:1), under 50 MB, front cover only
```

### Try It Yourself

```text
Spine and wrap calculator (fill in for each job)
------------------------------------------------
Trim width  W = 6 in          Trim height H = 9 in
Pages       P = 320           Paper: white (0.002252 in/page)
Spine       S = P x 0.002252 = 0.7206 in
Bleed       B = 0.125 in
Doc width   = 2B + 2W + S = 0.25 + 12 + 0.7206 = 12.9706 in
Doc height  = H + 2B = 9.25 in
Guides x:   0.125 | 6.125 | 6.8456 | 12.8456
Safe x:     0.375..5.875 (back)   6.9081..6.7831 clearance (spine text)   7.0956..12.5956 (front)
Resolution  300 ppi -> 3891 x 2775 px
```

### Quiz

1. What determines spine width?
- [ ] Trim size only
- [x] Page count and paper thickness
- [ ] Font size of the spine text
> Spine width is page count multiplied by the paper's per-page thickness.

2. Why use Replace Contents on a Smart Object for the next book in a series?
- [x] The new image inherits the same size, position, transforms and filters
- [ ] It converts the image to CMYK
- [ ] It reduces file size
> Smart Object transforms are stored separately from the content, so swapping content keeps the layout.

3. Which way should English spine text read?
- [ ] Bottom to top
- [x] Top to bottom (rotated 90° clockwise)
- [ ] Horizontal
> When the book lies face up, top-to-bottom text reads correctly; this is the English-language convention.

4. What does KDP reject in a cover PDF?
- [ ] Embedded fonts
- [x] Crop marks
- [ ] Bleed
> KDP wants the bleed included in the page size but no printer marks.

### Exercises

1. **Calculate a hardcover case wrap** — Trim 6 × 9 in, 300 pages, using KDP hardcover: wrap 0.6 in beyond the boards on each side, hinge 0.34 in on each side of the spine, spine 0.9 in (from KDP's calculator). Give the document size.
<details><summary>Solution</summary>

Board width is trim + 0.125 (KDP uses 6.125 × 9.25 boards for a 6 × 9 book). Width = wrap 0.6 + board 6.125 + hinge 0.34 + spine 0.9 + hinge 0.34 + board 6.125 + wrap 0.6 = 15.03 in. Height = wrap 0.6 + board 9.25 + wrap 0.6 = 10.45 in. Always download KDP's hardcover template for the exact numbers because they change per page count.

</details>

2. **Series mockup** — Build a reusable 3D mockup and swap in three covers.
<details><summary>Solution</summary>

Make a 2000 × 2000 px RGB file, place the first cover as a Smart Object, apply Distort for perspective, add inner shadow and drop shadow layer styles, and a slight vignette on a background layer. For covers two and three, Layer > Smart Objects > Replace Contents, choose the next PSD, and export each as JPG. The perspective, shadows and vignette re-apply exactly.

</details>

### Interview Questions

**Q: A client's cover was rejected by KDP for "spine text too close to the edge". What went wrong and how do you fix it?**
Either the spine width was calculated for the wrong page count or paper colour, or the text was set without the 0.0625 in clearance. I recalculate with the final interior page count, using the correct per-page factor (white 0.002252, cream 0.0025, colour 0.002347), rebuild the guides, and reduce or re-centre the spine text with the clearance. I also colour the spine to match the front so a small fold shift is invisible. Then I re-export with the bleed included and no crop marks, which is what KDP expects.

**Q: How do Smart Objects change your cover workflow?**
They make every cover a template: the photo is a Smart Object I can replace, the title is live type styled with a Paragraph Style, the back-cover block is a linked Smart Object shared across the series, and the 3D mockup is a Smart Object that re-applies its perspective on Replace Contents. Free Transform on a Smart Object is lossless, so repeated resizing during client revisions never degrades the image. The cost is larger PSDs and the occasional confusion when a client opens the file and cannot paint directly on the Smart Object, so I document that in the README.

**Q: What are the differences between a KDP and an IngramSpark cover file?**
KDP wants a single PDF with bleed built into the page size, no crop marks, and either RGB or CMYK; it places its own barcode. IngramSpark wants PDF/X-1a in CMYK built on their downloadable template, with their crop marks and their barcode EPS in the marked position, and is stricter on ink coverage. The artwork is the same, so I build one master PSD and export two variants, keeping the barcode area clear for KDP and placing Ingram's EPS for the other.

## CorelDRAW print & export (PDF/X, spot colours, imposition)

Producing the final file that a press accepts without a phone call is the skill that separates a designer from a production designer. This chapter covers the CorelDRAW Publish to PDF dialog in detail, spot colour handling, overprint, imposition and the checks you run in Acrobat.

### Publish to PDF

```text
File > Publish to PDF (or File > Export > PDF)
General tab
  PDF preset:        PDF/X-1a  (flattened, CMYK, most compatible)  or  PDF/X-4 (live transparency)
  Export range:      Current document / Pages 1-2
  Compatibility:     set by the preset (X-1a = Acrobat 4 / PDF 1.3; X-4 = PDF 1.6)
Color tab
  Output all objects as:  CMYK   (or "Native" to keep spot colours)
  Convert spot colors to CMYK:  untick if the printer runs spot inks
  Embed color profile:    tick; Use color proof settings: match Document > Color Management
  Preserve document overprints: tick
Objects tab
  Compress text and line art; Bitmap compression: ZIP (lossless) or JPEG High quality
  Bitmap downsampling: 300 dpi colour/greyscale, 1200 dpi monochrome
  Text and fonts: Embed fonts in document (subset below 100%), or Export all text as curves
Prepress tab
  Bleed limit: 3 mm (tick); Crop marks; Registration marks; Colour calibration bar; File information
  Densitometer scales optional
Security tab: none for print files
```

**Export all text as curves** guarantees no font issues but makes the PDF unsearchable and heavier; **Embed fonts** is preferred when the licence allows, and PDF/X requires embedding.

### PDF/X flavours

| Standard | Transparency | Colour | Use when |
|---|---|---|---|
| PDF/X-1a:2001 | Flattened | CMYK + spot only | Default for offset and most digital printers |
| PDF/X-3:2003 | Flattened | Allows RGB/Lab with profiles | Rare; European workflows |
| PDF/X-4:2008 | Live | CMYK, spot, RGB with profiles, layers | Modern RIPs; avoids flattening artefacts |

If unsure, send X-1a; it fails least often. If the design has many drop shadows over spot colours, X-4 avoids the boxes that flattening can leave.

### Spot colours and plates

Spot colours become extra separations. Check them before export: **Window > Dockers > Color Proof Settings** and the Document palette show which named colours are in use. Duplicated spots (PANTONE 2767 C and "PANTONE 2767 C copy", or the same colour in Coated and Uncoated libraries) create extra plates the printer will charge for or reject.

```text
Fix stray spot colours
  Edit > Find and Replace > Replace Objects > Color: find "PANTONE 2767 U" replace with "PANTONE 2767 C"
  Or: Find Objects > Fill > Spot color > Find All, then apply the correct swatch
Metallic / varnish
  Create a spot colour named "Varnish" or "Metallic" (any visible colour), fill the object, set Overprint fill
  The printer treats the plate as instructed; note it in the README
```

### Overprint and knockout

By default, a coloured object **knocks out** whatever is under it: the press leaves a hole in the lower ink. Black text over a colour panel should **overprint** so a registration shift does not leave a white sliver around every letter. CorelDRAW sets "Overprint black" in the PDF Color tab (**Always overprint black**), or per object: right-click > Overprint Fill / Overprint Outline. White objects must never overprint (they would disappear). Check with **View > Simulate Overprints**.

### Imposition

For a business card sheet, booklet or folded leaflet the pages must be arranged so they fold and cut correctly.

```text
File > Print > Layout tab (Imposition layout)
  Pages per sheet, gutters, binding: Saddle stitch / Perfect
  Preview shows the printer's spreads (page 1 with page 8, 2 with 7 ...)
File > Print > Prepress tab: crop/fold marks, registration marks, bleed limit
Print to a PostScript/PDF printer (Microsoft Print to PDF loses marks; use a PDF driver or
   Publish to PDF after Layout > Page Layout > Facing pages for spreads)
```

Most commercial printers impose in their own software (Preps, Imposition Studio); send **single pages** with bleed unless they explicitly ask for spreads or n-up sheets. Booklets with a page count not divisible by four need blank pages added, decided with the client.

### Rasterised effects

Drop shadows, transparencies, lenses and bitmap fills are rasterised at export. Set the resolution in **Tools > Options > Document > General > Rendering resolution: 300 dpi**, and check Publish to PDF > Objects > "Render complex effects" if present. Fountain fills stay vector but may band; set fountain steps to 256 in Options > Document > General.

### Checking the PDF

Open the exported PDF in Acrobat Pro:

```text
Print Production > Output Preview
  Separations: tick/untick plates; confirm only Cyan, Magenta, Yellow, Black (+ intended spots)
  Total Area Coverage: set to the printer's limit; highlighted areas exceed it
  Simulate Overprinting
Print Production > Preflight > PDF/X-1a compliance check
File > Properties > Fonts: every font "Embedded Subset"
Zoom to 400% on flattened shadows to look for stitching lines
```

> **Warning:** "Microsoft Print to PDF" and browser PDF printers produce RGB files with no bleed, no marks and rasterised text. Always use Publish to PDF for anything going to a press.

### Try It Yourself

```text
Publish to PDF settings: 2-page business card, one spot colour, digital press
-----------------------------------------------------------------------------
General:   Preset PDF/X-1a, Pages 1-2
Color:     Output as Native (keeps PANTONE 2767 C), Convert spot to CMYK: OFF,
           Preserve overprints: ON, Always overprint black: ON, Embed profile: FOGRA39
Objects:   Embed fonts (subset), ZIP compression, downsample colour to 300 dpi
Prepress:  Bleed limit 3 mm ON, Crop marks ON, Registration marks ON, File information OFF
Filename:  ClientName_BusinessCard_v3_PRINT.pdf
Acrobat check: Output Preview shows C, M, Y, K, PANTONE 2767 C (five plates), TAC < 300%
```

### Quiz

1. Which PDF/X standard flattens transparency and allows only CMYK and spot?
- [x] PDF/X-1a
- [ ] PDF/X-4
- [ ] PDF/A
> X-4 keeps live transparency; PDF/A is an archival standard, not a print one.

2. Why should black text overprint?
- [ ] To make it darker
- [x] So slight press misregistration does not leave white gaps around letters
- [ ] To reduce ink cost
> Knockout black leaves a hole in the underlying ink; any shift shows a white fringe.

3. What causes an unexpected fifth plate in Output Preview?
- [ ] Embedded fonts
- [x] A stray or duplicated spot colour in the document
- [ ] Bleed set to 3 mm
> Every named spot becomes a separation; duplicates and unused library colours must be replaced.

4. When should you send imposed sheets instead of single pages?
- [ ] Always
- [ ] Never
- [x] Only when the printer explicitly asks for them
> Printers impose in their own software; single pages with bleed are the safe default.

### Exercises

1. **Diagnose white fringes** — A printed brochure shows thin white edges around navy text on an orange panel. What was wrong in the file and how do you prevent it?
<details><summary>Solution</summary>

The text was set to knock out and the press misregistered slightly. For black text, enable Always overprint black in Publish to PDF; for coloured text on a panel, either overprint (if the colours mix acceptably) or, better, use a shared ink between text and panel, or add a small trap (Outline of the text colour 0.1 pt set to overprint). Check with View > Simulate Overprints before export.

</details>

2. **Prepare an 8-page A5 booklet** — The printer wants single pages with bleed; the client supplied 7 pages. Set it up.
<details><summary>Solution</summary>

Add a blank page 8 (or move content) because saddle-stitch booklets need multiples of four. Set A5 with 3 mm bleed, keep content 8 mm from the outer edges and 12 mm from the spine side on inner pages. Publish to PDF/X-1a, pages 1–8, crop marks, bleed limit 3 mm, fonts embedded. Do not use Facing pages or imposition; note "8 pages, saddle stitch, single pages" in the README.

</details>

### Interview Questions

**Q: A printer says your PDF has "RGB objects and a missing font". How did that happen in CorelDRAW and what is your fix?**
RGB objects usually come from imported PNG/JPG images or from a colour picked in the Color docker while the model was RGB; the missing font means embedding was off or the font's licence blocked embedding. I run Find Objects for RGB fills, outlines and bitmaps and convert them, set Publish to PDF Color tab to CMYK output with the printer's profile, and on the Objects tab embed fonts as subsets; if the font refuses to embed I export that text as curves. Then I verify in Acrobat Output Preview and File > Properties > Fonts before resending.

**Q: When do you choose PDF/X-4 over PDF/X-1a?**
X-4 when the design relies on transparency, drop shadows over spot colours, or layers that the printer's RIP handles natively, because flattening in X-1a can create stitching lines and boxes and rasterises text inside flattened regions. X-1a when the printer is unknown or older, because almost every RIP accepts it. I ask the printer first; if they are unsure, X-1a and a zoomed-in inspection of any flattened area is the safer path.

**Q: Explain overprint, knockout and trapping in one answer.**
Knockout removes the underlying ink where an object sits, so the object prints on clean paper; it is the default. Overprint prints the object on top of the underlying ink; it is right for black text and for varnish plates, and wrong for white or light colours. Trapping is a tiny deliberate overlap between adjacent colours so registration errors do not show a paper-white gap, done either automatically by the printer's RIP or manually by overprinting a thin outline. I set black to overprint, never overprint white, and leave trapping to the RIP unless the printer asks me to build it.

## InPage: Urdu typesetting basics (Nastaliq, RTL, keyboard, ligatures)

InPage is the standard desktop-publishing program for Urdu, Arabic, Persian, Pashto and Sindhi in Pakistan. Publishers, newspapers and government departments still expect Urdu documents in InPage format because its Nastaliq engine produces the calligraphic ligatures that ordinary word processors cannot. This chapter is InPage 3.x (Unicode-capable) with notes where InPage 2000/2009 differ.

### Why Nastaliq is different

Latin and Naskh Arabic sit on a flat baseline. **Nastaliq** hangs words on a sloping baseline: each word starts high and cascades down and to the left, with letters joining in hundreds of context-dependent shapes. InPage ships the **Noori Nastaliq** font as a ligature-based font with about 20,000 pre-drawn ligatures, which is why it renders faster and more traditionally than OpenType Nastaliq fonts (Jameel Noori Nastaleeq, Noto Nastaliq Urdu, Alvi Nastaleeq) that compose shapes on the fly.

| Font | Type | Typical use |
|---|---|---|
| Noori Nastaliq (InPage) | Ligature/Nastaliq | Books, newspapers, official documents |
| Jameel Noori Nastaleeq | OpenType Nastaliq (Unicode) | Word, web, InPage 3 |
| Noto Nastaliq Urdu | OpenType Nastaliq (Unicode) | Web, Android, PDF forms |
| Alvi Nastaleeq | OpenType Nastaliq | Ebooks |
| Naskh fonts (Times New Arabic, Noto Naskh Arabic) | Naskh | Quranic text, Arabic, headings in some magazines |

### Document setup

```text
File > New
  Page size: A4 / Letter / Custom (inches, cm, points)
  Margins:   top/bottom/inside/outside (facing pages for books)
  Columns:   1–4 with gutter
  Default language: Urdu (sets RTL) — Arabic / English also available
View > Rulers, Guides; Zoom with Ctrl+Plus / Ctrl+Minus
Text is placed in text boxes (Text Box tool) that flow RTL; link boxes with the Link tool
```

InPage 3 documents are `.inp` files. InPage 2000/2009 use the same extension but an older, non-Unicode text encoding; opening old files in InPage 3 works, but copy-pasting text out of InPage 2009 to Word gives garbage, which is a very common client complaint.

### Keyboard and typing

InPage supports several Urdu keyboards. **Phonetic** maps Urdu letters to similar-sounding Latin keys (k = ک, g = گ, sh = ش), which is fastest for people who type English. **Monotype** and **CRULP/InPage layouts** are used by professional typists. Switch under **Options > Keyboard** or with the language toggle (Ctrl+Space in InPage 3; older versions use the toolbar). Switching between Urdu and English text in the same box just requires toggling the language: InPage handles the bidirectional run.

```text
Common phonetic keys (InPage phonetic layout)
  a  = ا   b = ب   p = پ   t = ت   T = ٹ   s = س   j = ج   ch = چ   h = ح   kh = خ
  d  = د   D = ڈ   r = ر   R = ڑ   z = ز   sh = ش  k = ک   g = گ    l = ل   m = م
  n  = ن   N = ں   w/v = و  h = ہ   y = ی   e = ے   Shift+y = ئ   ' = ء
  Diacritics (aerab): zabar/zer/pesh via Shift+A / Shift+I / Shift+U (varies by layout)
```

### Ligatures, kashida and justification

Nastaliq **ligatures** are formed automatically as you type. What you control is **justification**: Latin text spreads words apart, but Urdu text is traditionally justified with **kashida** (tatweel), an elongation of the connecting stroke between letters, and by choosing wider or narrower ligature variants.

```text
Format > Paragraph
  Alignment: Right / Centre / Left / Justify / Justify with Kashida
  Kashida: Off / Small / Medium / Large (InPage 3: per-paragraph)
  Line spacing: points or auto (Nastaliq needs generous leading, 1.6–2x the size)
  Space before/after
Format > Character
  Font, size, colour, style (bold/italic only for Naskh/Latin fonts; Nastaliq has no bold)
  Scaling, tracking, baseline shift
Insert > Special characters: ‌ ZWNJ for controlling joins, Urdu numerals, poetry markers
```

Because Nastaliq has no true bold, headings use a larger size, a different font (Naskh or a heavier Nastaliq) or colour. "Faking" bold in InPage stroke-thickens the outline and prints badly.

### Poetry, tables and mixed-direction text

- **Poetry mode** (Format > Poetry / the poetry toolbar) centres couplets and aligns hemistichs; newspapers and literary publishers depend on it.
- **Tables** (Insert > Table) flow RTL: the first column is on the right. For rate matrices or fee schedules bilingual with English numbers, keep numbers in a Latin font set to English language so they read LTR inside the RTL cell.
- **Mixed text**: an English term inside an Urdu sentence is typed by toggling the language; InPage keeps the English run LTR inside the RTL paragraph. Punctuation direction sometimes flips at the run boundary; the fix is to type the punctuation while the Urdu language is active.

### Styles

InPage 3 has **Format > Style Sheets** for paragraph and character styles, similar to Word. Define "Body Urdu 14/26 Noori Nastaliq justify-kashida", "Heading 20 pt Jameel", "Caption 11 pt" and apply them, so a 200-page book can change its body size in one place.

> **Tip:** Set line spacing for Nastaliq body text at roughly 1.8× the font size (14 pt on 26 pt). The hanging baseline makes descending strokes collide with the next line at Latin-style 1.2× leading.

### Try It Yourself

```text
InPage 3 book body setup (Urdu, A5 facing pages)
------------------------------------------------
File > New: A5, facing pages, margins inside 20 mm / outside 15 mm / top 18 mm / bottom 20 mm, 1 column
Default language: Urdu
Style sheet "Body":     Noori Nastaliq 14 pt, line spacing 26 pt, Justify with Kashida (Medium),
                        space after 6 pt, first-line indent 6 mm
Style sheet "Heading":  Jameel Noori Nastaleeq 22 pt, colour navy, centred, space before 18 / after 10
Style sheet "Poetry":   Poetry mode, 15 pt, centred couplets, line spacing 30 pt
Master page: page number (Urdu numerals) in the outer margin footer; running head with book title
Link text boxes across pages with the Link tool; check for overflow markers before export
```

### Quiz

1. What makes Nastaliq different from Naskh for typesetting?
- [x] Words cascade on a sloping baseline with many contextual ligatures, needing more leading
- [ ] It is written left to right
- [ ] It has no ligatures
> The hanging baseline and thousands of ligature forms are why specialised engines like InPage exist.

2. What does "Justify with Kashida" do?
- [ ] Adds spaces between words like Latin justification
- [x] Elongates connecting strokes between letters to fill the line
- [ ] Rotates the text
> Kashida (tatweel) is the traditional Arabic-script way to justify without wide word gaps.

3. Why is there no bold Nastaliq in InPage?
- [ ] Bold is a paid add-on
- [x] The ligature font has one weight; faking bold thickens outlines and prints badly
- [ ] Bold is only available in Arabic
> Use size, a second font or colour for emphasis instead.

4. What happens when text is copied from InPage 2009 into Word?
- [x] It appears as garbage because the old encoding is not Unicode
- [ ] It converts to Arial automatically
- [ ] It loses only the diacritics
> InPage 3 added Unicode; older files need the built-in Unicode export or conversion tools.

### Exercises

1. **Bilingual fee schedule** — Lay out a table with Urdu service names and English amounts in InPage.
<details><summary>Solution</summary>

Insert > Table with the needed rows; the first column (right side) holds Urdu service names in Noori Nastaliq 12 pt. For the amount column, select the cells, set language to English and font to a Latin font (Arial 10 pt) so numbers and "PKR" read left to right. Align amounts right within the cell so digits line up, and set row height to fit Nastaliq descenders (about 2× the font size).

</details>

2. **Fix a broken join** — Two Urdu letters that should be separate keep joining. What do you insert?
<details><summary>Solution</summary>

Insert a zero-width non-joiner (ZWNJ) between them via Insert > Special characters (or the keyboard shortcut for the layout). It breaks the cursive connection without adding a visible space, which matters for words like compound terms and some Persian-style spellings.

</details>

### Interview Questions

**Q: A government client wants an Urdu policy document. Why would you use InPage instead of Word?**
Word with Jameel Noori Nastaleeq works for short documents, but for a long publication InPage gives proper kashida justification, poetry mode, reliable RTL tables and master pages, and the Noori Nastaliq ligature font that Pakistani readers expect. It also produces predictable PDFs; Word's Nastaliq rendering varies by version and can break lines badly. The trade-off is that InPage is a niche tool and the client may not be able to edit the file, so I usually deliver the InPage source, a PDF and a Unicode text export for reuse.

**Q: How do you handle English terms and numbers inside Urdu text?**
I toggle the language to English for the run so InPage keeps it left-to-right inside the right-to-left paragraph, set a matching Latin font and size (Nastaliq at 14 pt pairs with a Latin font at about 10–11 pt because Nastaliq looks larger), and type any punctuation while the Urdu language is active so it does not flip to the wrong side. For tables of figures I put numbers in their own Latin-language cells so column alignment stays clean.

**Q: What leading do you use for Nastaliq body text and why?**
About 1.7 to 2 times the point size, for example 14 on 26. Nastaliq words start high and descend, so the lowest strokes of one line fall much further below the baseline than in Latin or Naskh, and at Latin-style 1.2× leading the lines collide and become unreadable. The leading also depends on the font: Noori Nastaliq is more compact than Noto Nastaliq Urdu, which needs even more space.

## InPage: exporting for print & web (PDF, images, Unicode issues)

An Urdu publication is only finished when it leaves InPage in a format the printer, the website and the client's Word users can all handle. Each route has its own traps, mostly around fonts and Unicode.

### PDF export

InPage 3 exports PDF directly; InPage 2009 and earlier print to a PDF driver instead.

```text
InPage 3:  File > Export > PDF
  Pages:            All / range
  Fonts:            Embed (Noori Nastaliq is embedded as outlines or subsets)
  Resolution:       300 dpi for images
  Bleed and marks:  set page size to include bleed in the document; marks via the PDF driver if needed
InPage 2009:  File > Print > Printer: Adobe PDF / PDFCreator / doPDF
  Printer properties: Adobe PDF Settings > Press Quality; tick "Rely on system fonts only": OFF
  Page size:        custom size with bleed
```

Open the PDF in Acrobat and check **File > Properties > Fonts** for "Embedded" on every Nastaliq font. If a font shows as not embedded, the text will be substituted on another machine and Urdu becomes boxes.

Because Noori Nastaliq is a ligature font, the exported PDF's text layer is often **not searchable or copyable** as real Unicode; the glyphs map to ligature codes. For a printed book that is fine. For a PDF that must be searchable (a government notice on a website, a policy manual), set the body in a Unicode OpenType Nastaliq font such as Jameel Noori Nastaleeq inside InPage 3 before exporting.

### Print-ready PDF checks

```text
Acrobat Print Production > Output Preview: CMYK only (InPage exports RGB by default; the printer converts, or
   convert with Acrobat Print Production > Convert Colors > destination FOGRA39)
Preflight > PDF/X-1a: fix RGB, missing fonts
Zoom 400%: check that ligature glyphs are crisp vector, not rasterised (jagged means the driver rasterised text)
Bleed: 3 mm; Pakistani offset printers usually accept single pages with bleed
```

InPage's colour handling is limited; for a full-colour cover, design it in CorelDRAW or Photoshop and typeset only the interior in InPage.

### Exporting images

For a website banner, a social post or an image to place in Word, export a page or selection as an image:

```text
InPage 3: File > Export > Image (JPG / PNG / BMP / TIFF)
  Resolution: 300 dpi for print placement, 150 dpi for web
  Selection: page or selected text box
Alternative: export PDF, open in Photoshop at 300 ppi (File > Open > choose page), Export As PNG
```

Web use of Urdu images is a last resort; they cannot be searched, resized or read by screen readers. Prefer real Unicode text on the web with Noto Nastaliq Urdu via `@font-face`.

### Unicode export and the "InPage to Word" problem

Clients constantly ask for "the InPage text in Word". InPage 2009 and earlier store text in a proprietary encoding, so pasting gives gibberish.

```text
InPage 3:        File > Export > Unicode Text (UTF-8/UTF-16) -> open in Word, apply Jameel Noori Nastaleeq
                 Or select all, copy, paste into Word (InPage 3 puts Unicode on the clipboard)
InPage 2009:     Use InPage 3 to open the .inp and export Unicode, or
                 Use a converter (e.g. InPage-to-Unicode tools that map the old encoding)
Kashida:         removed or converted to tatweel characters (U+0640) on export; strip them in Word
                 with Find and Replace before reflowing, or Nastaliq fonts will stretch strangely
ZWNJ:            preserved as U+200C; Word handles it
Numbers:         Urdu numerals (۰۱۲۳) export as U+06F0..U+06F9; convert to Latin if the client wants
```

After exporting to Word: set the paragraph direction to RTL (Home > Right-to-Left Text Direction, available when an Arabic-script editing language is installed under File > Options > Language), apply the Nastaliq font, and set line spacing to Exactly 26 pt for 14 pt text. Word's default "Multiple 1.08" clips Nastaliq descenders.

### Common export failures

| Symptom | Cause | Fix |
|---|---|---|
| Boxes or question marks in the PDF on another PC | Font not embedded | Embed in export settings; or export text as outlines |
| Urdu copied from the PDF is garbage | Ligature font, non-Unicode glyphs | Use Unicode OpenType font for searchable output |
| Jagged text in PDF | Printer driver rasterised at 72 dpi | Use InPage 3 direct export or a proper PDF driver at 2400 dpi |
| Lines collide in Word | Multiple line spacing | Set line spacing Exactly ~1.8× size |
| Kashida turns into long lines in Word | Tatweel characters exported | Find ـ (U+0640) and replace with nothing |
| Numbers read backwards in Word | Wrong paragraph direction | Set RTL paragraph, Latin font for numbers |

> **Warning:** Do not promise a client "editable Urdu in Word" from an InPage 2009 file without testing the conversion on a sample chapter first. Some documents need manual clean-up of every heading and table.

### Try It Yourself

```text
Delivery package for an Urdu training manual
--------------------------------------------
manual_v2.inp                     InPage 3 source
manual_v2_PRINT.pdf               fonts embedded, 3 mm bleed, converted to FOGRA39 in Acrobat
manual_v2_WEB.pdf                 Unicode font version (Jameel Noori Nastaleeq), searchable, RGB, 150 dpi images
manual_v2_unicode.txt             File > Export > Unicode Text, tatweel stripped
manual_v2.docx                    Word: RTL paragraphs, Jameel 14 pt, spacing Exactly 26 pt, styles applied
README.txt                        fonts required (Noori Nastaliq for .inp; Jameel for .docx), page count, bleed
```

### Quiz

1. Why is text in a PDF exported from Noori Nastaliq often not searchable?
- [x] The glyphs are ligature codes rather than Unicode characters
- [ ] PDFs never support Urdu
- [ ] The font is not embedded
> Ligature fonts map thousands of pre-drawn shapes; a Unicode OpenType font keeps real characters.

2. What must be true in Acrobat's File > Properties > Fonts for the PDF to display on any machine?
- [ ] Fonts listed as "Substituted"
- [x] Every Nastaliq font listed as Embedded (Subset)
- [ ] No fonts listed
> Unembedded fonts are replaced on machines that lack them, producing boxes.

3. What line spacing should Urdu Nastaliq text use in Word after export?
- [ ] Multiple 1.08
- [ ] Single
- [x] Exactly about 1.8× the font size
> Word's default spacing clips the hanging descenders of Nastaliq.

4. What is the correct route to get editable Unicode text from an InPage 2009 file?
- [ ] Copy and paste into Word directly
- [x] Open in InPage 3 and use File > Export > Unicode Text (or a converter)
- [ ] Export as JPG and OCR it
> InPage 2009 uses a proprietary encoding; only InPage 3 or a converter maps it to Unicode.

### Exercises

1. **Searchable government notice** — A client needs an Urdu notice as a searchable web PDF. Describe the setup and export.
<details><summary>Solution</summary>

In InPage 3, set the body style to Jameel Noori Nastaleeq (Unicode) instead of Noori Nastaliq, keep the layout, and File > Export > PDF with fonts embedded. Verify in Acrobat that Ctrl+F finds an Urdu word and that copy-paste gives readable Unicode. Keep images at 150 dpi for a small file and export RGB.

</details>

2. **Clean a Word export** — After exporting Unicode text to Word, the lines overlap and there are long stretched lines inside words. Fix it.
<details><summary>Solution</summary>

Select all, set paragraph direction to RTL, apply Jameel Noori Nastaleeq 14 pt, Paragraph > Line spacing Exactly 26 pt. Then Find and Replace: find the tatweel character ـ (U+0640, type ^u1600 in Find) and replace with nothing to remove exported kashida. Rebuild headings with Word styles.

</details>

### Interview Questions

**Q: A client says the Urdu PDF you sent shows squares on their laptop. What happened?**
The Nastaliq font was not embedded, usually because the PDF was made through a printer driver with "rely on system fonts" enabled, or because a substitution slipped in. On their machine, which lacks Noori Nastaliq, Acrobat substituted a font with no Urdu glyphs. I re-export from InPage 3 with embedding on, confirm in Acrobat's Fonts properties that every font shows Embedded (Subset), and test on a machine without the fonts installed before sending. For extra safety on print files I can export text as outlines, at the cost of searchability.

**Q: How do you deliver an Urdu publication so the client can reuse the text later?**
I deliver three layers: the InPage source for reprinting, a PDF for distribution and printing, and a Unicode export (UTF-8 text and a cleaned .docx) so the text can go into Word, a website or a future edition without retyping. In the Word file I fix paragraph direction, font, exact line spacing and strip exported kashida. I also tell the client which fonts each file needs, because the InPage file wants Noori Nastaliq while the Word file uses Jameel Noori Nastaleeq, and mixing them up is the most common support question I get.

**Q: When would you typeset Urdu in Word or CorelDRAW instead of InPage?**
Short pieces: a letterhead, a certificate, a one-page notice, or a bilingual business card, where the layout tools of CorelDRAW matter more than kashida justification, and Word for documents the client must edit themselves. Word 2016 and later with Jameel Noori Nastaleeq or Noto Nastaliq Urdu handles a few pages acceptably if line spacing is set exactly. For books, newspapers, poetry and anything over a dozen pages, InPage's justification, poetry mode and stability win, and I keep the cover in CorelDRAW or Photoshop regardless.

# LEVEL: Expert

## Design systems & template suites (43 toolkit covers)

A single cover is design; forty-three covers that must look like one product, ship on time and survive the client's future edits are **systems engineering**. This chapter uses a real job shape, a 43-item toolkit of covers and matching interior templates, to show how to build a design system across Photoshop, CorelDRAW and Word.

### What a design system contains

| Layer | Artefact | Where it lives |
|---|---|---|
| Tokens | Palette (CMYK + RGB + Hex), type scale, spacing units, logo sizes | README / brand sheet, CC Library, CorelDRAW palette .xml |
| Components | Title block, series bar, back-cover block, barcode area, footer | Smart Objects (PSD), symbols/style sets (CDR), building blocks (Word) |
| Templates | cover-master.psd, stationery.cdt, interior.dotx | Versioned folder |
| Rules | Placement grid, naming, what may vary per item | One-page spec |
| Variants | 43 title strings, 43 images, 43 accent colours (optional) | CSV / spreadsheet |

The spec sheet is the important part. It decides, in writing, what is **fixed** (title position, logo, bar height) and what is **variable** (title text, hero image, one accent tint). Everything variable must be data-driven; everything fixed must be locked.

### The grid and the "one-variable" rule

Pick a grid once: for a 6 × 9 in cover, a 0.375 in safe margin and a 12-column grid with 0.125 in gutters. All 43 covers share it. Then allow only one thing to vary visually per item, usually the hero image and its accent tint. If the client wants different layouts for "beginner" and "advanced" toolkits, that is two templates in the system, not 43 ad-hoc decisions.

```text
Toolkit cover spec v1.2
  Trim 6 x 9 in, bleed 0.125 in, safe 0.375 in, 300 ppi, CMYK FOGRA39
  Series bar:  bottom, 0.9 in tall, colour = series colour (5 series -> 5 swatches)
  Title:       Montserrat ExtraBold 54/50, white, all caps, left at 0.5 in, baseline 2.2 in from top
  Subtitle:    Montserrat Regular 18, white, 0.2 in below the title block
  Number:      "Toolkit 17 of 43", Montserrat SemiBold 12, bar-left
  Hero image:  Smart Object clipped to the top 60%, duotone Gradient Map (navy -> series colour)
  Logo:        1.1 in wide, bar-right, reversed white
  Variables:   title, subtitle, number, hero image, series colour
  Fixed:       everything else
```

### Data-driven covers in Photoshop

Photoshop can generate variants from a CSV with **Variables** and **Data Sets**:

```text
1. Name layers exactly: Title (text), Subtitle (text), Number (text), Hero (pixel/Smart Object), Bar (shape)
2. Image > Variables > Define
     Title:    Text Replacement, variable name title
     Hero:     Pixel Replacement, variable name hero, Method: Fill (or Conform)
     Bar:      Visibility per series (one Bar layer per series colour, variable visible_series_A ...)
3. CSV (UTF-8, header row = variable names; image paths absolute or relative to the CSV):
     title,subtitle,number,hero,visible_series_A,visible_series_B
     "Quality Audit Toolkit","For BPO team leads","Toolkit 01 of 43",C:\work\hero\01.jpg,true,false
4. Image > Variables > Data Sets > Import... > select the CSV, tick "Use First Column For Data Set Names"
5. File > Export > Data Sets as Files... > choose folder; each data set becomes a PSD
6. Batch-export the PSDs to PDF/JPG with an Action (next-but-one chapter)
```

Text replacement does not reflow the layout, so long titles must be checked; add a rule in the spec that titles are at most 28 characters or two lines.

### The CorelDRAW side: stationery and interiors

For the matching stationery or printed toolkit dividers, use a `.cdt` template with **Object Styles** and **Symbols** (Window > Dockers > Symbols): a symbol is an instance of a master object, so editing the logo symbol updates every page. **Print Merge** provides the same data-driven step as Photoshop's Data Sets.

### The Word side: interior templates

Each toolkit has an interior `.dotx` with the same palette as theme colours, the same fonts as theme fonts, and heading styles matching the cover typography scaled down. Building Blocks (Insert > Quick Parts) hold the cover page and the "About this toolkit" block. This links the system across apps: a client who changes the series colour changes one swatch in each of the three templates.

### Versioning and hand-off

```text
/ToolkitSuite
  /00_spec           spec_v1.2.pdf, palette.ase, palette.xml (Corel), fonts/ (licence permitting)
  /01_masters        cover-master_v1.2.psd, stationery_v1.2.cdt, interior_v1.2.dotx
  /02_data           covers.csv, hero/ (43 images, named 01.jpg ... 43.jpg)
  /03_output         /print (PDF/X-1a), /web (JPG 1600x2400), /mockups
  CHANGELOG.md       v1.2: series bar 0.8 -> 0.9 in; Montserrat Bold -> ExtraBold
```

Semantic versions on masters, a changelog and a strict naming pattern (`TK17_QualityAudit_cover_v1.2_PRINT.pdf`) let the client's staff find any file without asking. The changelog also protects you when a client says "the bar used to be smaller".

> **Interview note:** Interviewers for production-design roles want to hear "template + data + batch" and "what is fixed vs variable", not "I designed 43 covers". The number that impresses is the time per additional cover, not the total.

### Try It Yourself

```text
covers.csv for Photoshop Data Sets (first 3 of 43 rows)
-------------------------------------------------------
name,title,subtitle,number,hero,visible_A,visible_B,visible_C
TK01,QUALITY AUDIT TOOLKIT,For BPO team leads,Toolkit 01 of 43,hero/01.jpg,true,false,false
TK02,AGENT ONBOARDING KIT,First 30 days,Toolkit 02 of 43,hero/02.jpg,true,false,false
TK03,TITLE SEARCH SOP PACK,Abstractor workflow,Toolkit 03 of 43,hero/03.jpg,false,true,false
Rules: title <= 28 chars or 2 lines; hero images 1800x1620 px minimum; exactly one visible_* true per row
```

### Quiz

1. In a template suite, what should be data-driven?
- [ ] Everything, including the grid
- [x] Only the elements the spec marks as variable (title, image, series colour)
- [ ] Nothing; each cover is hand-made
> Fixed elements are locked in the master; variables come from a CSV so the batch is repeatable.

2. Which Photoshop feature generates one PSD per CSV row?
- [ ] Actions
- [x] Image > Variables and Data Sets, then Export > Data Sets as Files
- [ ] Layer Comps
> Variables map layers to columns; Data Sets are the rows; the export writes a file per row.

3. Why keep a CHANGELOG with the masters?
- [x] To track what changed between versions and settle client disputes
- [ ] Photoshop requires it
- [ ] To store fonts
> Version history is how you prove which template produced which delivered file.

4. What links the Photoshop, CorelDRAW and Word templates into one system?
- [ ] They must all be in the same folder
- [x] Shared tokens: the same palette, type scale and grid applied in each app's native mechanism
- [ ] Copy-pasting objects between apps
> Each app implements the tokens differently (swatches, style sets, theme colours), but the values are identical.

### Exercises

1. **Write the spec** — Produce a one-page spec for a five-item certificate suite (completion, excellence, attendance, trainer, distinction).
<details><summary>Solution</summary>

Fixed: A4 landscape, 3 mm bleed, 15 mm safe, border 2 pt navy at 12 mm, logo 40 mm top-centre, "This certifies that" Open Sans 14 pt, recipient name Montserrat SemiBold 36 pt centred at 105 mm from top, signature lines at 35 mm from bottom, footer with certificate ID. Variables: certificate type title (Montserrat ExtraBold 28 pt), seal colour (5 swatches), recipient, date, ID. Data: CSV of recipients merged in CorelDRAW Print Merge. Output: PDF/X-1a per recipient, named CERT_<type>_<id>.pdf.

</details>

2. **Cost the change** — The client asks for the series bar to move from the bottom to the top on all 43 covers. Explain the work in a system versus without one.
<details><summary>Solution</summary>

With the system: edit cover-master.psd (move the Bar group and adjust the Hero clipping mask), bump to v1.3, re-run Data Sets export and the batch action: about an hour including checks. Without: open 43 files, move objects, re-align titles and re-export each, with high inconsistency risk: a day or more. This is the argument for the setup time invested at the start.

</details>

### Interview Questions

**Q: Tell me about a time you produced a large set of designs consistently.**
For a 43-item toolkit I wrote a one-page spec that fixed the grid, type scale, bar and logo, and defined five variables: title, subtitle, number, hero image and series colour. I built a cover-master PSD with named layers, Paragraph Styles and a duotone group, then used Image > Variables with a CSV to generate 43 PSDs and an Action to export print PDFs and web JPGs. The matching stationery used a CorelDRAW template with style sets and Print Merge, and the interiors used a .dotx with theme colours. When the client changed the bar height late, it was one edit and a re-run rather than 43 corrections.

**Q: How do you decide what a client is allowed to vary in a template?**
I ask what will actually change over the product's life: titles and images always, colours sometimes, layout almost never. Each variable adds a place where the design can break, so I limit variables to what the client will realistically supply through a spreadsheet, and I put constraints in the spec, such as a maximum title length and minimum image size. Anything else becomes a separate template in the suite. This keeps the batch deterministic and makes the client's self-service edits safe.

**Q: How do you keep a design system consistent across Photoshop, CorelDRAW and Word when the apps share nothing?**
By treating the tokens as the source of truth and implementing them natively in each app: a palette .ase for Photoshop and a Library, a palette .xml and Object Styles in CorelDRAW, and theme colours and fonts in the Word template. The type scale is written in points so it translates directly, and the grid is written in millimetres or inches. I keep them in one spec document and in a CHANGELOG, and every change updates all three templates in the same version bump, so the suite never drifts.

## Colour management across apps (ICC, soft-proofing)

Colour management is the system that makes a navy chosen in Photoshop print as the same navy from CorelDRAW and appear consistently in a PDF viewer. It is the topic clients least understand and printers care most about, so an expert must be able to configure it and explain it in plain words.

### The pieces

An **ICC profile** describes how a device (monitor, printer, press) reproduces colour. A **working space** is the profile your document's numbers are interpreted in. A **rendering intent** decides what happens to colours the destination cannot show. A **CMM** (colour management module) does the conversion maths. Photoshop, CorelDRAW and Acrobat each have their own settings; making them agree is the job.

| Profile | Type | Typical use |
|---|---|---|
| sRGB IEC61966-2.1 | RGB working space | Web, Office, most cameras' default |
| Adobe RGB (1998) | RGB working space | Photography with wider gamut |
| Coated FOGRA39 (ISO 12647-2:2004) | CMYK output | European/Asian offset on coated paper; common in Pakistan |
| U.S. Web Coated (SWOP) v2 | CMYK output | North American web offset; Photoshop default |
| Japan Color 2001 Coated | CMYK output | Asian printers using Japanese standards |
| PSO Uncoated ISO12647 | CMYK output | Uncoated stock (letterheads on bond paper) |
| Monitor profile (from calibration) | Display | Created by a colorimeter (X-Rite, Datacolor) |

### Configuring Photoshop

```text
Edit > Color Settings (Shift+Ctrl+K)
  Settings: Europe Prepress 3 (sRGB / FOGRA39) or North America Prepress 2 (Adobe RGB / SWOP)
  Working Spaces: RGB sRGB (or Adobe RGB for photo work), CMYK Coated FOGRA39
  Color Management Policies: Preserve Embedded Profiles; tick Ask When Opening for mismatches
  Conversion Options: Engine Adobe (ACE), Intent Relative Colorimetric, Black Point Compensation ON
Save the settings as "Studio-FOGRA39.csf" and load them on every machine
```

"Preserve Embedded Profiles" keeps an sRGB image's meaning when opened in an Adobe RGB workspace instead of silently reinterpreting its numbers.

### Configuring CorelDRAW

```text
Tools > Color Management > Default Settings
  Presets: Europe Pre-press (FOGRA39) or North America General Purpose
  RGB: sRGB; CMYK: Coated FOGRA39; Grayscale: Dot Gain 15%
  Rendering intent: Relative colorimetric
  Color conversion: Microsoft ICM or Adobe CMM (install Adobe CMM for identical maths to Photoshop)
  Open / Import policies: Use embedded colour profile; warn on mismatch
Tools > Color Management > Document Settings (per file): confirm primary CMYK profile matches
```

Using the **same CMM and the same profiles** in both applications is what makes a swatch export identically from each.

### Soft-proofing

Soft-proofing shows on screen an approximation of the printed result.

```text
Photoshop:  View > Proof Setup > Custom
              Device to Simulate: Coated FOGRA39; Rendering Intent: Relative Colorimetric; BPC on
              Display Options: Simulate Paper Color, Simulate Black Ink (shows the real contrast loss)
            View > Proof Colors (Ctrl+Y) toggles;  View > Gamut Warning (Shift+Ctrl+Y)
CorelDRAW:  Window > Dockers > Color Proof Settings; pick the output profile; tick Proof Colors
            Bitmaps and vectors are both simulated; export a "proof" JPG for the client from here
Acrobat:    Print Production > Output Preview > Simulation Profile: FOGRA39; Simulate Paper Color
```

A soft proof is only meaningful on a **calibrated monitor**: calibrate monthly with a colorimeter to D65, 120 cd/m², gamma 2.2. Without calibration, use soft-proofing only for relative judgements and rely on printed proofs for absolute ones.

### Rendering intents

| Intent | Behaviour | Use for |
|---|---|---|
| Perceptual | Compresses the whole gamut smoothly; every colour moves a little | Photos with saturated colours |
| Relative Colorimetric | In-gamut colours unchanged; out-of-gamut clipped to nearest; white maps to paper white | Logos, brand colours, most print work |
| Absolute Colorimetric | Like Relative but simulates the paper white | Proofing on a different stock |
| Saturation | Keeps saturation, sacrifices accuracy | Charts and business graphics |

Convert brand colours with Relative Colorimetric so in-gamut swatches stay exact; convert a cover photograph with Perceptual if it has vivid out-of-gamut areas, and compare.

### Cross-app workflow

1. Define brand colours in **CMYK** for print and **sRGB** for screen separately in the palette; do not derive one from the other automatically.
2. Photoshop: build RGB, soft-proof against FOGRA39, convert with Edit > Convert to Profile on a copy, export PDF/X with the destination profile embedded as Output Intent.
3. CorelDRAW: document in CMYK FOGRA39 from the start, import Photoshop CMYK TIFF/PSD with "use embedded profile", publish PDF/X-1a with the same profile.
4. Acrobat: Output Preview must show the same Output Intent on both PDFs. **Print Production > Convert Colors** can force a stray sRGB PDF to the destination profile.
5. Printer: ask which profile they want; if they say "just send CMYK", use FOGRA39 for coated stock and PSO Uncoated for bond.

### Spot colour appearance

Pantone swatches display from the library's **Lab** values, so they look the same in both apps. Keep them as spot until the printer confirms process printing, then convert once with the official CMYK equivalent and use the same numbers in every file.

> **Warning:** Pantone libraries were removed from Adobe apps in 2022 and now require the Pantone Connect plug-in; CorelDRAW still ships PANTONE+ libraries. If a client file references Pantone colours that Photoshop shows as black, that is the reason, and the fix is to specify the CMYK or Lab values explicitly in the spec.

### Try It Yourself

```text
Colour handshake sheet (put in every README)
--------------------------------------------
Working spaces:  RGB sRGB IEC61966-2.1 | CMYK Coated FOGRA39 (ISO 12647-2:2004)
CMM:             Adobe (ACE) in Photoshop, Adobe CMM in CorelDRAW
Intent:          Relative Colorimetric + Black Point Compensation (brand colours); Perceptual (cover photo)
Output Intent:   FOGRA39 embedded in every PDF/X
Brand navy:      CMYK 100/80/35/30 | sRGB 31/58/95 | Pantone 2767 C (Lab 20.9, 4.6, -30.0)
Paper:           coated 300 gsm (covers), uncoated 100 gsm bond (letterhead -> PSO Uncoated for that file)
Monitor:         calibrated 2026-09-01, D65, 120 cd/m2, gamma 2.2
Proof:           printed proof approved on 2026-09-05; soft-proof screenshots attached
```

### Quiz

1. What does an ICC profile describe?
- [ ] A font's licence
- [x] How a device reproduces colour, so numbers can be converted between devices
- [ ] The bleed size
> Profiles let the CMM translate colour numbers between monitor, working space and press.

2. Which rendering intent keeps in-gamut brand colours exactly unchanged?
- [ ] Perceptual
- [x] Relative Colorimetric
- [ ] Saturation
> Perceptual moves every colour slightly; Relative Colorimetric only clips out-of-gamut ones.

3. What makes a soft proof meaningful?
- [x] A calibrated monitor and the correct output profile
- [ ] A large screen
- [ ] Exporting to JPG first
> Without calibration the screen is not a reference; the proof only shows relative shifts.

4. Why might Pantone swatches appear black in recent Photoshop versions?
- [ ] The file is corrupted
- [x] Pantone libraries were removed from Adobe apps in 2022 without the Pantone Connect plug-in
- [ ] CMYK mode does not support spot colours
> The fix is to specify CMYK or Lab values explicitly or use CorelDRAW's PANTONE+ libraries.

### Exercises

1. **Match a navy across apps** — A cover in Photoshop and a letterhead in CorelDRAW must print the same navy. Give the exact steps.
<details><summary>Solution</summary>

Define the navy in CMYK (100/80/35/30) in the spec. Photoshop: Color Settings CMYK = FOGRA39; build the cover; convert with Relative Colorimetric; export PDF/X-1a with FOGRA39 as Output Intent. CorelDRAW: Document Settings CMYK = FOGRA39; use the same CMYK swatch from the shared palette .xml; publish PDF/X-1a with FOGRA39. Acrobat Output Preview on both: same Output Intent and the same CMYK readout on the navy. Note the letterhead paper is uncoated so the printed navy will still be slightly duller; explain that to the client.

</details>

2. **Rescue a mismatched PDF** — A client's InDesign PDF is sRGB and the printer wants FOGRA39 CMYK. Convert it without the source file.
<details><summary>Solution</summary>

Acrobat Pro > Print Production > Convert Colors: Matching criteria Any object, Convert command Convert, Conversion profile Coated FOGRA39, Rendering intent Relative Colorimetric, tick Embed as Output Intent; run Preflight "Convert to PDF/X-1a". Check Output Preview for plates and total ink, and zoom into text to confirm it stayed vector.

</details>

### Interview Questions

**Q: Explain colour management to a non-technical client in two sentences, then to a printer in two sentences.**
To the client: every screen and printer shows colours a bit differently, so I use standard profiles and a calibrated monitor to predict the print, and I confirm with a printed proof before the full run. To the printer: the files are PDF/X-1a with Coated FOGRA39 as Output Intent, converted with Relative Colorimetric and black point compensation from sRGB masters, brand colours built in CMYK, and total ink under 300%. Being able to switch registers like this is what stops colour complaints from becoming reprints.

**Q: Why do the same CMYK numbers print differently on the letterhead and the cover?**
Because the letterhead is on uncoated bond and the cover on coated board, and ink spreads and absorbs differently on each; the same 100/80/35/30 is duller on uncoated. The correct handling is to use the uncoated profile (PSO Uncoated) for the letterhead file and to soft-proof each file with its own paper simulation, then to accept that they will match in intent rather than measurement. If a client needs an exact match across stocks, a spot ink is the answer, at a higher cost.

**Q: What is black point compensation and why turn it on?**
Source and destination profiles have different darkest blacks; without compensation, shadows in the source that are darker than the destination's black are clipped to a flat block. Black point compensation maps the source black to the destination black and scales the tones between, preserving shadow detail. It applies to Relative Colorimetric and Perceptual conversions in Photoshop and CorelDRAW, and I leave it on for every print conversion except when I deliberately want to simulate the destination's black on a proof.

## Automation (Photoshop actions/batch, CorelDRAW scripts)

Repetition is where a production designer earns their rate: exporting 43 covers in three formats, resizing 200 product photos, or numbering 500 certificates. Photoshop offers Actions, Batch, Droplets, Image Processor and scripting; CorelDRAW offers macros (VBA and CorelScript) and Print Merge. This chapter shows the reliable recipes and their failure modes.

### Photoshop Actions

An **Action** records a sequence of commands you can replay on any open file.

```text
Window > Actions (Alt+F9)
  Create new set "Covers"; Create new action "Export print+web"
  Record: Image > Duplicate; Edit > Convert to Profile (FOGRA39, Rel. Col., BPC);
          File > Save As Photoshop PDF (PDF/X-1a, no layers); Close;
          File > Export > Export As is NOT recordable -> use File > Save a Copy JPG or Image Processor
          Image > Image Size 1600 px wide (Bicubic Sharper); File > Save a Copy JPG quality 9; Close
  Stop recording
Insert Menu Item / Insert Stop / Insert Conditional (Actions panel menu) for prompts and branching
Toggle the dialog icon next to a step to pause for input (e.g. file name)
Save the set: Actions panel menu > Save Actions (.atn) and share with the team
```

Actions record **absolute** values: an Image Size step records "1600 px wide", not "half", so use **Percent** units for resizes that must scale with the source. Steps that select a layer by name break if the layer is missing, so rely on them only where the spec fixes layer names.

### Batch and Droplets

```text
File > Automate > Batch
  Play: Set "Covers", Action "Export print+web"
  Source: Folder (choose /02_data/psd), tick Suppress File Open Options Dialogs, Suppress Color Profile Warnings
  Destination: Folder (/03_output/print), tick Override Action "Save As" Commands
  File Naming: Document Name + _PRINT + extension; Starting serial # optional
  Errors: Log Errors to File (batch-errors.txt)
File > Automate > Create Droplet: same dialog, saved as an .exe you can drop files onto
```

**Override Action "Save As" Commands** is the step people miss: without it, every file saves to the folder recorded in the action, overwriting the same name.

### Image Processor and scripts

```text
File > Scripts > Image Processor
  Select folder; Save in same location or choose; Save as JPEG (quality 8, Convert to sRGB) / PSD / TIFF
  Resize to Fit: W 1600 H 2400; Run Action: Covers > "Sharpen for web"; Include ICC profile
File > Scripts > Browse... run a .jsx (ExtendScript) file
```

For loops, conditions, CSV input or naming by layer text, use a **script**. Photoshop 2024+ supports **UXP** plug-ins; ExtendScript `.jsx` still runs via File > Scripts.

```javascript
// export-covers.jsx  (ExtendScript; File > Scripts > Browse...)
// Saves every open document as PDF/X-1a-style print PDF and a 1600px JPG.
var outDir = new Folder("C:/work/ToolkitSuite/03_output");
if (!outDir.exists) outDir.create();
for (var i = app.documents.length - 1; i >= 0; i--) {
  var doc = app.documents[i];
  app.activeDocument = doc;
  var base = doc.name.replace(/\.[^\.]+$/, "");
  var pdfOpts = new PDFSaveOptions();
  pdfOpts.PDFStandard = PDFStandard.PDFX1A2001;
  pdfOpts.layers = false; pdfOpts.embedColorProfile = true;
  doc.saveAs(new File(outDir + "/" + base + "_PRINT.pdf"), pdfOpts, true);
  var dup = doc.duplicate(base + "_web", true);        // flattened duplicate
  dup.resizeImage(UnitValue(1600, "px"), null, null, ResampleMethod.BICUBICSHARPER);
  dup.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, true);
  var jpg = new JPEGSaveOptions(); jpg.quality = 9; jpg.embedColorProfile = true;
  dup.saveAs(new File(outDir + "/" + base + "_web.jpg"), jpg, true);
  dup.close(SaveOptions.DONOTSAVECHANGES);
}
```

Run it after Data Sets export has produced the 43 PSDs and they are open (or extend the loop to open files from a folder with `Folder.getFiles("*.psd")`).

### CorelDRAW macros

CorelDRAW includes **VBA** (Tools > Macros > Macro Editor, Alt+F11) and records macros (Tools > Macros > Record Temporary Macro). The object model exposes `ActiveDocument`, `ActivePage`, `Shapes`, `Text.Story`, and `PDFSettings`.

```vba
' CorelDRAW VBA: export each page as its own PDF/X-1a with bleed and marks
Sub ExportPagesAsPDF()
    Dim doc As Document, p As Page, base As String
    Set doc = ActiveDocument
    base = "C:\work\Stationery\out\" & Replace(doc.Name, ".cdr", "")
    With doc.PDFSettings
        .PublishRange = pdfPageRange
        .ColorMode = pdfCMYK
        .Bleed = 3: .BleedLimit = True     ' millimetres if the document unit is mm
        .CropMarks = True
        .EmbedFonts = True
        .pdfVersion = pdfVersion13         ' PDF/X-1a compatibility
    End With
    For Each p In doc.Pages
        doc.PDFSettings.PageRange = CStr(p.Index)
        doc.PublishToPDF base & "_p" & Format(p.Index, "00") & "_PRINT.pdf"
    Next p
End Sub
```

Property names vary slightly between CorelDRAW versions (2019–2024 use `PDFSettings`; older versions differ), so check Tools > Macros > Macro Editor > Object Browser (F2) before relying on one.

### Print Merge as automation

For per-person output (cards, certificates, badges) **File > Print Merge** with a CSV beats a macro: no code, client-editable data, serial numbering, and image substitution via file paths in 2020+.

### Reliability rules

- Test the action or script on three files, then on the whole batch, then spot-check five outputs at 400%.
- Never batch onto originals; write to a separate output folder and keep masters read-only.
- Log errors (Batch's Log Errors to File) and stop on the first failure when developing.
- Run the batch on a machine with the suite's fonts installed; a missing font substitutes silently.

> **Tip:** When a client sends 200 product photos "to be resized for the website", Image Processor with an action for sharpening finishes in minutes and, more importantly, produces identical results, which manual work never does.

### Try It Yourself

```text
Batch dialog for 43 cover PSDs
------------------------------
File > Automate > Batch
  Set:                Covers
  Action:             Export print+web
  Source:             Folder  C:\work\ToolkitSuite\02_data\psd
                      [x] Suppress File Open Options Dialogs   [x] Suppress Color Profile Warnings
  Destination:        Folder  C:\work\ToolkitSuite\03_output\print
                      [x] Override Action "Save As" Commands
  File Naming:        Document Name + _v1.2 + extension        Compatibility: Windows
  Errors:             Log Errors to File  C:\work\ToolkitSuite\03_output\batch-errors.txt
Expected result:      43 x _PRINT.pdf and 43 x _web.jpg; spot-check TK01, TK17, TK43 in Acrobat
```

### Quiz

1. Which Batch option prevents every output overwriting the same file?
- [ ] Suppress Color Profile Warnings
- [x] Override Action "Save As" Commands
- [ ] Log Errors to File
> Without it, the Save As step inside the action uses the recorded path and name every time.

2. Why record image resizes in percent rather than pixels?
- [x] So the action scales relative to each source instead of forcing one absolute size
- [ ] Percent is faster
- [ ] Pixels are not allowed in actions
> Absolute values are correct only when every input has identical dimensions.

3. What should you use for one-certificate-per-person output in CorelDRAW?
- [ ] A VBA loop that retypes names
- [x] File > Print Merge with a CSV
- [ ] Copy and paste per person
> Print Merge handles text substitution and numbering with no code and client-editable data.

4. Which scripting language runs from File > Scripts > Browse in Photoshop?
- [x] ExtendScript (.jsx)
- [ ] VBA
- [ ] PowerShell
> Photoshop scripts are JavaScript-based (ExtendScript, and UXP for modern plug-ins).

### Exercises

1. **Web resize batch** — 200 JPGs must become 1200 px wide, sharpened, sRGB, quality 8. Give the fastest reliable route.
<details><summary>Solution</summary>

Record an action "Sharpen web" with Filter > Sharpen > Unsharp Mask (Amount 60%, Radius 0.8, Threshold 2). File > Scripts > Image Processor: select the folder, Save as JPEG quality 8 with Convert Profile to sRGB, Resize to Fit W 1200 H 1200 (height large enough not to constrain), Run Action: Sharpen web, save in a new folder. Check three outputs.

</details>

2. **Certificate numbering** — 500 certificates need names and sequential IDs CERT-0001 onward, one PDF each.
<details><summary>Solution</summary>

CorelDRAW: master certificate with Print Merge fields Name and ID; CSV with 500 rows generated in Excel (`="CERT-"&TEXT(ROW()-1,"0000")`). Print Merge > Merge to New Document (500 pages), then run the VBA `ExportPagesAsPDF` macro (or Publish to PDF and split in Acrobat) to produce one file per page named by ID.

</details>

### Interview Questions

**Q: How would you automate exporting 43 covers to print and web formats?**
The covers come out of Photoshop Data Sets as 43 PSDs. I record an action that duplicates, converts to the printer's CMYK profile and saves as PDF/X-1a, then resizes a flattened copy to 1600 px, converts to sRGB and saves a JPG. File > Automate > Batch runs it over the folder with Override Save As and error logging on. If naming needs data from the file, for example the toolkit number from a text layer, I use an ExtendScript instead, because actions cannot read layer text. I then spot-check outputs at 400% and in Acrobat's Output Preview.

**Q: What are the common ways an automated batch goes wrong, and how do you guard against them?**
Absolute values recorded in actions applied to differently sized files, the Save As path baked into the action, missing fonts silently substituting, colour profile dialogs stalling the batch, and outputs overwriting masters. I guard by using percent units, Override Save As, suppressing dialogs while logging errors, running on a machine with the suite's fonts, writing to a separate output folder and doing a three-file test before the full run. I also version the action file with the templates so a future re-run uses the same steps.

**Q: When would you write a script instead of recording an action?**
When the job needs logic: loops over files with conditions, reading a CSV, naming outputs from layer contents, branching on document size or colour mode, or calling operations that are not recordable such as Export As. Actions are faster to create and easy for a colleague to inspect, so I use them for linear sequences and scripts for anything with decisions. In CorelDRAW the equivalent split is Print Merge and recorded macros for simple tasks, and VBA with the object model for per-page exports and shape manipulation.

## Client design workflow (briefs, revisions, file delivery)

Technical skill loses money without a process. A repeatable client workflow, from the first message to the final hand-off, is what keeps 400+ reviews positive and prevents unpaid revision spirals. This chapter is the process an experienced freelancer runs on every design job, with the templates to copy.

### The brief

Never start a design from a one-line message. A brief captures what will otherwise arrive as revision requests.

```text
Design brief (send as a form or ask in the first reply)
  1. Deliverable:      letterhead / business card / cover / certificate / InPage book / other
  2. Final use:        print (which printer, stock, size) / web / both
  3. Sizes:            trim size, orientation, page count (for spines)
  4. Brand assets:     vector logo (AI/EPS/SVG/CDR/PDF), brand guide, fonts, colour codes
  5. Content:          final text (copy-edited), images (with rights), ISBN/barcode if any
  6. References:       2–3 examples they like and 1 they dislike, with why
  7. Constraints:      languages (Urdu/English), accessibility, legal lines, deadline
  8. Rounds:           number of revision rounds included (usually 2) and what counts as a round
  9. Delivery formats: working file, print PDF, web previews, Word template, mockups
```

For Urdu jobs add: which InPage version they use, whether a Unicode Word copy is needed, and who proofreads the Urdu. For covers add: page count and paper colour for the spine, and the platform (KDP, IngramSpark, local press).

### Scope and rounds

Define a **round** as one consolidated list of changes. Three separate messages with one change each are three rounds if you do not define it, so say in the offer: "2 rounds of revisions; each round is one combined list; changes to the brief (new size, new content) are a new order". This single sentence prevents most disputes.

### Concept and approval gates

| Gate | What you send | What you ask |
|---|---|---|
| 1. Direction | One or two low-detail concepts as JPG with a watermark | "Which direction?" not "Do you like it?" |
| 2. Design | The chosen concept fully designed, JPG preview + PDF proof | "Confirm text, colours, and layout" |
| 3. Pre-flight | Print PDF with marks, mockup | "Approve for print (spelling is your responsibility after this)" |
| 4. Delivery | Full package | "Please confirm receipt; files remain available for 30 days" |

Watermarked previews at gate 1 and 2 protect against non-payment; the full-resolution files come after the order is complete on Fiverr/Upwork, which also releases the escrow.

### Revision hygiene

- Number your versions (`v1`, `v2`) and ask the client to refer to version numbers.
- Ask for markup, not descriptions: Acrobat comments on the PDF proof, or a screenshot with circles.
- Repeat the change list back before doing it: "v3 will: move the logo left, change the tagline, keep the photo."
- Show before/after side by side when a change is subjective (colour, size).
- Keep every version; clients often return to v2 after seeing v4.

### File delivery

```text
Delivery folder (zip, named ClientName_Job_YYYY-MM-DD)
  01_print/    Job_v3_PRINT.pdf (PDF/X-1a, bleed, marks), README-print.txt (printer instructions)
  02_web/      Job_v3_preview.jpg, Job_v3_social_1080.png
  03_source/   Job_v3.cdr | .psd | .inp  (+ fonts/ if licensed; else list them)
  04_office/   Letterhead.dotx, Signature.png (transparent), Logo.svg / .png set
  05_mockups/  Job_v3_mockup.jpg
  README.txt   fonts used (with links), colours (CMYK/RGB/Hex/Pantone), sizes, bleed,
               which file to send to a printer, how to edit the Word template, licence notes
```

Name files so that the wrong one cannot be sent to the printer: `_PRINT` in the name, and the preview named `_preview`. Put the README at the top level; clients read it months later.

### Rights, licences and stock

Confirm the client owns or licensed every photo; free stock sites (Unsplash, Pexels) are safe for commercial use but check for identifiable people and trademarks. Fonts: Google Fonts and SIL OFL fonts can be embedded and shared; commercial fonts usually cannot be redistributed, so the README lists the font and where to buy it, and the print PDF has it embedded or outlined. Mockup PSDs from marketplaces often forbid resale of the mockup itself; using it to show the client's cover is fine.

### Pricing signals

Price the **outputs**, not the hours: a cover with print and ebook variants, a stationery suite with a Word template, an InPage book by page count. Extras with clear prices: extra round, extra format, rush delivery, source files. Ali's Fiverr experience shows that clear packages with named deliverables produce fewer disputes than "custom quote" offers.

> **Interview note:** Agencies ask "How do you handle a client who keeps changing their mind?" The answer they want is process: a written brief, defined rounds, approval gates with sign-off, versioned files, and a polite "this is outside the brief; here is the price for it".

### Try It Yourself

```text
Revision round reply template
-----------------------------
Hi <Name>, thanks for the notes on v2. Here is what v3 will include, please confirm:
  1. Move the logo to the left margin, aligned with the body text edge
  2. Replace the tagline with: "<exact text>"
  3. Change the accent from orange to the brand green (#2E7D5B / CMYK 75,20,70,5)
  4. Keep the photo and the footer as in v2
Not included (new scope, quoted separately): adding a back page; changing the size to A5.
I will send v3 as a PDF proof and a JPG preview by <date>. This is revision round 2 of 2.
```

### Quiz

1. What is the purpose of defining a "round" in the offer?
- [x] To prevent many small change requests from becoming unlimited free revisions
- [ ] To limit the number of files delivered
- [ ] To set the print resolution
> A round is one consolidated list of changes; the definition keeps scope and price aligned.

2. When should full-resolution, unwatermarked files be delivered on a marketplace job?
- [ ] With the first concept
- [x] After approval, when the order is completed
- [ ] Only if the client asks
> Delivering finals at completion releases escrow and protects against non-payment.

3. What must the README contain?
- [ ] Only the file list
- [x] Fonts, colours, sizes, bleed, which file goes to the printer, and licence notes
- [ ] Your hourly rate
> The README is what the client reads months later when they need to reprint or edit.

4. A client asks for changes described in words like "make it pop". What do you do?
- [ ] Guess and send v3
- [x] Ask for marked-up proof comments or references, then repeat the change list back
- [ ] Refuse the revision
> Vague feedback becomes wasted rounds; markup and confirmation make it concrete.

### Exercises

1. **Write a brief reply** — A client sends "I need a business card, here is my logo (JPG)". Write the questions you send back.
<details><summary>Solution</summary>

Ask for: the vector logo (AI/EPS/SVG/PDF/CDR; if unavailable, whether they want a trace at extra cost), card size (85 × 55 or 3.5 × 2 in) and the printer's spec, the exact text for front and back, brand colours or a reference, single or double-sided, how many people (Print Merge), delivery formats (print PDF, preview, source), and confirm two rounds of revisions and the deadline.

</details>

2. **Handle scope creep** — After approving the letterhead, the client asks for an envelope, a compliment slip and an email signature "since you have the design already". Draft the reply.
<details><summary>Solution</summary>

Thank them, confirm the letterhead is complete and delivered, and offer a stationery add-on: envelope DL, compliment slip A4/3 and an HTML-safe email signature PNG, with a fixed price and delivery time, noting that the brand assets are ready so the price is lower than a fresh job. Offer to start once the add-on order is placed.

</details>

### Interview Questions

**Q: Walk me through your process from a client's first message to delivery.**
I reply with a short brief covering deliverable, use, sizes, assets, content, references, constraints, rounds and delivery formats, and I do not start until the vector logo and final text arrive. I send one or two watermarked direction concepts, then a full design as a PDF proof and JPG preview, then a pre-flight print file for sign-off, each with a specific question. Revisions are numbered versions with the change list confirmed before I make them. Delivery is a structured folder with print, web, source and office files plus a README. The gates are where problems get caught cheaply, and the README is what stops support questions six months later.

**Q: How do you protect yourself against endless revisions without upsetting the client?**
By defining a round in writing before the work starts, repeating each round's change list back for confirmation, and separating "changes within the brief" from "changes to the brief". When something is out of scope I say so kindly and attach a price, which most clients accept because the rule was visible from the start. I also keep versions so that reverting is free and painless, which reduces the emotional temperature of a revision.

**Q: What goes in the hand-off package and why does it matter?**
Print-ready PDF/X with bleed and marks, web previews, the native source, any Word template or logo set for office use, mockups, and a README with fonts, colours, sizes and instructions. It matters because the client will send the wrong file to a printer, lose the source, or try to edit the design in Word, and a clear package prevents all three. On marketplace work the package quality is what turns a five-star review into a repeat client, because they can reuse the assets without hiring anyone again.

## Design & DTP interview questions

This chapter collects the questions that come up for graphic-design, DTP and production-design roles in Pakistan and in remote freelance vetting calls, with the answers that show real production experience rather than software familiarity. Read each answer for its structure: state the principle, give the concrete method with menu paths or numbers, then name the trade-off.

### How interviews for these roles run

Most start with a portfolio walk-through, then a practical test (design a business card in 30 minutes; fix a supplied file so it prints; typeset an Urdu page), then technical questions. Agencies and printers probe **print readiness**; publishers probe **typography and InPage**; corporate teams probe **templates and consistency**. Bring three things: a print-ready PDF you can open in Acrobat's Output Preview live, a template suite (cover master, stationery, Word .dotx) and one InPage sample.

### Quick-fire technical questions

| Question | Strong short answer |
|---|---|
| Raster vs vector? | Pixels vs paths; photos vs logos; Photoshop vs CorelDRAW; vector scales without loss |
| 300 dpi means? | 300 pixels per inch at final print size; a 6 in wide print needs 1800 px |
| Bleed and safe area values? | 3 mm bleed, 3–5 mm safe (cards); 0.125 in / 0.25–0.375 in (US covers) |
| Rich black recipe? | About 60/40/40/100 for large areas; 0/0/0/100 for text; never 400% |
| PDF/X-1a vs X-4? | X-1a flattened CMYK+spot, safest; X-4 live transparency, modern RIPs |
| Overprint black? | Yes for text so misregistration does not show gaps; never overprint white |
| Spot vs process? | Named ink plate vs CMYK mix; exact colour at extra cost |
| Why InPage? | Nastaliq ligatures, kashida justification, poetry, RTL tables |
| Nastaliq leading? | About 1.8× the size (14 on 26) |
| Smart Object benefit? | Non-destructive transforms and filters; replaceable content for series |
| Clipping mask shortcut? | Ctrl+Alt+G in Photoshop; PowerClip in CorelDRAW |
| Convert text to curves when? | Delivery to printers without fonts or when the licence forbids embedding |

### Practical test tips

- Set up the document first: size, bleed, colour mode, guides. Examiners watch for this.
- Use styles and palettes even on a 30-minute test; it signals production habits.
- Export a PDF and open it in Acrobat before saying "done".
- If the supplied logo is a JPG, say so and explain what you would ask for, then trace it.
- For Urdu tests, check the language toggle, set exact leading and use kashida justification.

### Behavioural questions with design framing

**"Tell me about a print job that went wrong."** Use a real one: a stationery job where a stray RGB blue printed purple. Say what you found (Find Objects showed an imported PNG), what you fixed (converted, re-exported PDF/X-1a, checked Output Preview) and what changed afterwards (an RGB audit line in the pre-flight checklist). The structure is problem, cause, fix, prevention.

**"How do you take feedback?"** Describe versioned proofs, marked-up PDFs, repeating the change list, and separating taste from function: if the change breaks readability or print safety you explain why and offer an alternative; if it is taste you do it.

> **Interview note:** When asked which tool you prefer, avoid brand loyalty. Say: Photoshop for raster and covers, CorelDRAW for vector print work because local printers accept CDR, InPage for Urdu long documents, and Word for anything the client edits. Then add that you can move a design between them because you work from a spec, not from a tool.

### Try It Yourself

```text
30-minute practical test plan: business card, front and back, print-ready
-------------------------------------------------------------------------
00:00  New doc 85 x 55 mm, CMYK FOGRA39, bleed 3 mm, guides 3 mm safe; 2 pages
00:03  Import logo (ask for vector; trace if JPG); create palette from logo colours
00:06  Style sets: Name 11 pt SemiBold, Title 7.5 pt, Contact 7.5 pt leading 10
00:10  Front layout on the grid; back full-bleed panel with reversed logo
00:20  Audit: Find Objects RGB; text 100% K; outlines >= 0.25 pt; fonts embed
00:24  Publish to PDF/X-1a, pages 1-2, bleed 3 mm, crop marks
00:27  Open in Acrobat > Output Preview: 4 plates; File > Properties > Fonts embedded
00:29  Export JPG preview; state assumptions (printer spec, fonts) to the examiner
```

### Quiz

1. In a practical test, what should you do first?
- [ ] Place the logo
- [x] Set up size, bleed, colour mode and guides
- [ ] Choose fonts
> Examiners look for production habits; document setup prevents every later category of error.

2. What is the best answer to "which tool do you prefer"?
- [ ] "Photoshop, always"
- [x] Match the tool to the job and explain that you work from a spec
- [ ] "Whatever the client has"
> Production designers are judged on output and process, not on tool loyalty.

3. How should a "print job went wrong" story be structured?
- [ ] Blame the printer
- [x] Problem, cause, fix, prevention
- [ ] Only describe the fix
> The prevention step shows you improve the process, which is what employers pay for.

4. Which item should you be able to demonstrate live in Acrobat?
- [x] Output Preview showing plates and total ink on your own PDF
- [ ] The Photoshop splash screen
- [ ] A CorelDRAW macro compile
> Live verification of a print-ready file is the most convincing proof of production skill.

### Exercises

1. **Prepare your portfolio walkthrough** — Choose three pieces and write two sentences for each: the constraint and the production decision.
<details><summary>Solution</summary>

Example: (1) 43-cover toolkit: constraint was consistency and speed; decision was a data-driven master PSD with Data Sets and a batch export. (2) Bilingual letterhead: constraint was office printers and Urdu text; decision was a cropped-header .dotx with Jameel Noori Nastaleeq at exact leading and a separate PDF/X-1a for the press. (3) Urdu training manual: constraint was searchability; decision was a Unicode Nastaliq font in InPage 3 with embedded-font PDF export and a cleaned Word copy.

</details>

2. **Fix-the-file drill** — You are given a CDR with RGB fills, hairlines, an unembedded font and no bleed. List the fixes in order.
<details><summary>Solution</summary>

Layout > Page Size: bleed 3 mm, extend background objects into it. Find Objects: RGB fills/outlines to CMYK; bitmaps to CMYK. Select hairline outlines and set 0.25 pt. Check the font: embed if licensed, else convert to curves in a delivery copy. Publish to PDF/X-1a with bleed and crop marks; verify in Acrobat.

</details>

### Interview Questions

**Q: What is the difference between a graphic designer and a production/DTP designer, and which are you?**
A graphic designer creates the concept: layout ideas, imagery, typography choices. A production designer makes that concept manufacturable and repeatable: correct sizes, bleed, colour management, fonts, templates, data-driven variants and files that printers and office users accept. I do both, but my strength and most of my paid work is production: 43-cover suites, stationery with Word templates, Urdu books in InPage, and print PDFs that pass pre-flight the first time. In a team I am the person who turns a concept into a template the rest of the company can use.

**Q: A printer calls to say the job cannot run. What are the five most likely reasons and how do you avoid them?**
RGB objects, missing or unembedded fonts, no bleed, hairlines or text below minimum size, and unexpected spot plates. I avoid them with a pre-flight checklist: Find Objects for RGB, embed or outline fonts, bleed set at document level and checked in the PDF, minimum 0.25 pt lines and 6 pt text, and an Acrobat Output Preview check for plates and total ink. I also ask the printer for a spec sheet before starting, because half of these come from guessing their requirements.

**Q: How do you design for a bilingual Urdu and English audience?**
I set two type systems that match in colour and rhythm but not in size: Nastaliq at about 14 pt looks the same weight as a Latin font at 10–11 pt, and Nastaliq needs 1.8× leading. Urdu runs right-to-left with kashida justification and Latin runs left-to-right, so the grid must mirror: Urdu pages align right, English pages align left, and mixed pages use a clear column split. For long Urdu text I use InPage; for short bilingual pieces CorelDRAW 2019+ or Word with Jameel Noori Nastaleeq. The PDF is checked for embedded fonts and searchable Unicode when the client needs it.

**Q: What would you do in your first month in a production-design role?**
Audit the existing templates and files: colour settings on every machine, the palettes in use, the fonts and their licences, the printers' specs, and how files are named and versioned. Then standardise: a shared colour-settings file, a palette per brand, a pre-flight checklist and a delivery folder structure. I would rebuild the most-used template as a proper system with styles and data fields and measure the time per output before and after, because that number is what justifies the rest of the changes to management.
