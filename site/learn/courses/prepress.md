---
id: prepress
title: Print-Ready PDF & Prepress
icon: 🖼️
track: Document Engineering
color: #7B241C
runner: none
tagline: Deliver files a commercial printer will accept the first time.
description: Prepress for document producers and cover designers: colour (RGB vs CMYK, spot, ICC profiles), resolution and DPI, bleed, trim and safe areas, crop marks, fonts (embedding, outlines), transparency and overprint, PDF/X standards, preflight in Acrobat, hardcover case-wrap and paperback cover templates (spine width), imposition basics, and print-shop communication.
---

# LEVEL: Beginner

## How printing works: offset versus digital

Prepress is everything that happens between "the design is finished" and "the press starts". Most rejected files fail because the person who made them did not know what the press needs. So the course starts with the machines, because every rule later (CMYK, bleed, 300 ppi, PDF/X) exists to satisfy a physical process.

### Offset lithography

Offset is the workhorse of commercial printing: magazines, books, brochures, packaging. The image is put onto a thin aluminium **plate**, one plate per ink. The plate is wetted and inked; ink sticks only to the image areas. The plate transfers ("offsets") the image to a rubber **blanket** cylinder, which presses it onto paper. A four-colour press has four units, one each for Cyan, Magenta, Yellow and Black (CMYK); a six-colour press adds units for spot inks or varnish.

Because each ink is a separate plate, the file must be separable into those inks. That is why designers speak of **separations** and why an RGB file is a problem: there is no red plate, only C, M, Y and K.

```text
Offset cost structure
  Plates + makeready: fixed cost per job (setup, colour balancing, waste sheets)
  Running cost: very low per sheet once the press is running
  => cheap per unit at 1,000+ copies, expensive for 20 copies
```

### Digital printing

Digital presses (HP Indigo, Xerox iGen, Konica Minolta, Canon imagePRESS) are high-end laser or liquid-toner devices. There are no plates; each sheet can be different, which enables variable data (a personalised letter per policyholder) and short runs. Print-on-demand book services such as Amazon KDP and IngramSpark use digital inkjet or toner lines. Digital still images in CMYK toner, so the same colour rules apply, but the RIP (raster image processor) tolerates RGB input better because it converts on the fly.

| Factor | Offset | Digital |
|---|---|---|
| Setup cost | High (plates, makeready) | Near zero |
| Per-unit cost at 5,000 | Low | Higher |
| Per-unit cost at 50 | Very high | Low |
| Spot colours (Pantone) | Yes, real ink | Simulated with CMYK (some presses add orange, green, violet) |
| Variable data | No | Yes |
| Colour consistency across the run | Excellent once balanced | Good, may drift slightly |
| Paper range | Very wide | Wide, some limits on thickness and texture |
| Turnaround | Days | Hours |

### Other processes you will meet

- **Flexography**: flexible plates for packaging, labels, corrugated boxes. Coarser detail; heavier trapping needs.
- **Gravure**: engraved cylinders for very long runs (catalogues, packaging).
- **Screen printing**: ink pushed through a mesh; T-shirts, signs. Works in spot colours only.
- **Large-format inkjet**: banners, posters, exhibition graphics; often 6 to 12 inks, RGB workflow acceptable.
- **Print-on-demand (POD)**: KDP, IngramSpark, Lulu. Specific templates and strict PDF specs.

### What the press needs from you

Every process needs a file that answers these questions unambiguously: what is the final size (trim), what extends past the edge (bleed), which inks are used, what resolution are the images, are the fonts embedded, and where are the folds. A print-ready PDF is a document that answers them without a phone call.

```text
Print-ready checklist (short form)
  [ ] Trim size correct, bleed 3 mm / 0.125 in on all outer edges
  [ ] Colour mode CMYK (or as agreed), no stray RGB or unwanted spot plates
  [ ] Images 300 ppi at final size (line art 1200 ppi)
  [ ] All fonts embedded (or outlined)
  [ ] Transparency handled per PDF/X version
  [ ] Crop marks outside the bleed, no marks inside the trim
  [ ] PDF/X-1a or PDF/X-4 as requested, output intent set
```

> **Tip:** Ask the printer two questions before you design: "What PDF/X version and ICC profile do you want?" and "What is your bleed and safe-zone requirement?" Their answers decide half of the settings in this course.

### Try It Yourself

```text
Job spec worksheet (fill this in before opening the design tool)

Product ............: 36-page policy manual, saddle-stitched
Quantity ...........: 250 copies         -> digital (short run, no plates)
Trim size ..........: 210 x 297 mm (A4)
Bleed ..............: 3 mm all round     -> page size with bleed = 216 x 303 mm
Colour .............: 4/4 CMYK cover, 1/1 black text pages
Paper ..............: cover 300 gsm silk, text 100 gsm uncoated
Finishing ..........: matt lamination on cover, saddle stitch (pages must be a multiple of 4)
PDF standard .......: PDF/X-4, output intent: PSO Coated v3 (FOGRA51)
Proof ..............: soft proof PDF + 1 hard proof of cover
```

### Quiz

1. Why is an RGB file a problem for an offset press?
- [x] The press has one plate per ink (C, M, Y, K); there is no red plate
- [ ] RGB files are too large
- [ ] Offset presses only print black
> Offset separates the image into ink plates, so the file must be expressible in those inks.

2. Which process is cheapest for 40 copies of a training manual?
- [ ] Offset
- [x] Digital
- [ ] Gravure
> Digital has no plate or makeready cost, so short runs are cheap per unit.

3. Which process can print a real Pantone spot ink?
- [x] Offset (with an extra unit)
- [ ] Standard four-colour digital toner
- [ ] Neither
> Offset uses a real premixed ink on its own plate; standard digital presses simulate it with CMYK.

### Exercises

1. **Choose the process** — A client needs 5,000 tri-fold brochures with a metallic silver logo. Which process and why?
<details><summary>Solution</summary>

Offset. At 5,000 copies the plate cost is spread thin, and the metallic silver needs a real spot ink (for example Pantone 877 C) on a fifth unit; digital toner cannot reproduce metallic. Specify 4/4 + spot silver, and supply the logo as a named spot colour swatch.

</details>

2. **Page count** — A saddle-stitched booklet has 22 pages of content. What page count do you tell the printer, and what do you do with the difference?
<details><summary>Solution</summary>

Saddle stitch requires a multiple of 4, so 24 pages. Add two pages: typically a blank inside back cover and a notes page, or expand the content. Never leave the printer to add blanks unannounced.

</details>

### Interview Questions

**Q: Explain the difference between offset and digital printing to a client choosing between them.**
Offset uses metal plates, one per ink, and has a fixed setup cost, so it is economical from roughly a thousand copies upward and offers real spot inks and the widest paper choice. Digital has no plates, so short runs and variable data are cheap and fast, but spot colours are simulated and very long runs cost more per unit. For a 250-copy policy manual I would go digital; for 10,000 brochures with a Pantone brand colour I would go offset. Either way the file needs bleed, correct resolution and embedded fonts, so the design work is the same.

**Q: What does a RIP do?**
The raster image processor takes the PDF and turns it into the bitmaps that drive the plate-setter or the digital press engine, one per ink. It interprets the PDF, applies colour management using the output profile, flattens or renders transparency, screens continuous-tone images into halftone dots and applies trapping if configured. Most preflight rules exist because of what the RIP cannot fix: it cannot invent bleed, it cannot add missing fonts, and it converts unexpected RGB using defaults you did not choose.

**Q: Why does a saddle-stitched booklet need a page count divisible by four?**
Because each folded sheet produces four pages: two on each side of the fold. A 22-page file cannot be imposed onto whole sheets, so the printer adds blank pages. I plan the count early, put deliberate content on the extra pages, and check with the printer whether covers count toward the total in their quote.

## RGB versus CMYK and why colours shift

Screens make colour by adding light; presses make colour by subtracting it with ink on paper. That single physical difference explains every "the print looks dull" complaint.

### Additive and subtractive

**RGB** (Red, Green, Blue) is additive: full intensity of all three gives white, none gives black. Monitors, phones and cameras use it. **CMYK** (Cyan, Magenta, Yellow, Key/black) is subtractive: inks absorb light, so more ink means darker. In theory C+M+Y makes black; in practice it makes muddy brown, which is why black ink (K) exists.

### Gamut

A **gamut** is the range of colours a device can reproduce. sRGB, the usual screen space, includes vivid greens, oranges and electric blues that no CMYK press can print. When an RGB colour outside the CMYK gamut is converted, it is pulled to the nearest printable colour, and the loss is most visible in saturated blues, greens and oranges.

| Colour | RGB | CMYK approximation | What happens in print |
|---|---|---|---|
| Pure blue | 0, 0, 255 | 100, 90, 0, 0 | Prints as a violet-blue |
| Bright green | 0, 255, 0 | 60, 0, 100, 0 | Duller, yellower |
| Orange | 255, 128, 0 | 0, 55, 100, 0 | Slightly muted |
| Dark navy | 20, 30, 80 | 100, 90, 40, 40 | Close |
| Mid grey | 128, 128, 128 | 0, 0, 0, 55 | Close (if converted as K only) |

### Why "convert to CMYK" is not one operation

Converting depends on the destination profile (which press, which paper) and the rendering intent. Photoshop's Image > Mode > CMYK uses the working CMYK profile in Edit > Color Settings, by default U.S. Web Coated (SWOP) v2, which is not what a European sheet-fed printer wants. Convert with Edit > Convert to Profile and choose the profile the printer named (for example PSO Coated v3, or GRACoL2013). The Intermediate and Advanced levels cover profiles in depth; for now, the rule is: convert once, to the printer's profile, at the end.

### Blacks

Black is where RGB-to-CMYK conversions do the most damage. RGB `#000000` converts to a four-colour build such as C75 M68 Y67 K90, which is fine for a large area but disastrous for 9pt body text, because any misregistration between four plates makes text fuzzy with coloured fringes. Body text must be **100% K only**. Large black panels use a **rich black** (for example C60 M40 Y40 K100) for depth. The Intermediate level covers ink limits and rich black rules.

```text
Body text and thin rules ...... C0 M0 Y0 K100  (single plate, sharp)
Large solid black areas ....... C60 M40 Y40 K100 (rich black, deeper)
Never for text ................ C100 M100 Y100 K100 (registration black: marks only)
```

### Soft proofing

Photoshop and Acrobat can simulate the press on screen. In Photoshop: View > Proof Setup > Custom, choose the printer's CMYK profile, tick "Simulate Paper Color", then View > Gamut Warning highlights unprintable colours in grey. In Acrobat Pro: Tools > Print Production > Output Preview, choose the simulation profile. Soft proofs are approximate because the monitor is still emitting light, but they catch the big surprises.

### Brand colours

Clients specify brand colours as HEX. Ask for, or define, the CMYK build and the Pantone reference too, and record all three in the brand sheet you deliver. Do not let Word or Canva convert on the fly; they use generic conversions that vary between versions.

> **Warning:** Never convert to CMYK, then back to RGB, then to CMYK again. Every conversion clips the gamut and rounds values; after two round trips a brand teal drifts visibly. Keep the RGB master, convert a copy once for print.

### Try It Yourself

```text
Convert a brand colour for print (worksheet)

Brand teal (web) ........: #16A085  = R22 G160 B133
Photoshop Color Picker ..: enter 16A085, read CMYK with working space set to the printer's profile
PSO Coated v3 (FOGRA51) ..: C79 M14 Y55 K1   (example values; verify in your own profile)
Nearest Pantone .........: 3268 C (Pantone Connect / Color Libraries: Solid Coated)
Decision ................: use the CMYK build for 4-colour jobs; spot 3268 C for stationery run offset
Record in brand sheet ...: HEX, RGB, CMYK (profile named), Pantone
```

### Quiz

1. Why can a vivid RGB green not be printed exactly in CMYK?
- [x] It lies outside the CMYK gamut, so it is clipped to the nearest printable colour
- [ ] Green ink is expensive
- [ ] CMYK has no green channel so green is impossible
> CMYK can print greens, but not the most saturated ones that a screen can show.

2. What CMYK value should 9pt body text use?
- [ ] C75 M68 Y67 K90
- [x] C0 M0 Y0 K100
- [ ] C100 M100 Y100 K100
> Single-plate black stays sharp regardless of registration; four-colour black text fringes.

3. Which Photoshop command converts to a specific press profile?
- [ ] Image > Mode > CMYK Color
- [x] Edit > Convert to Profile
- [ ] Filter > Other > Offset
> Mode change uses the default working space; Convert to Profile lets you choose the printer's profile and intent.

### Exercises

1. **Diagnose a complaint** — A client's printed brochure shows orange buttons that look brown compared with the website. Explain the cause and the fix for the reprint.
<details><summary>Solution</summary>

The orange was an out-of-gamut sRGB colour (around R255 G120 B0) converted by the printer's RIP with a default profile, which desaturated it. For the reprint, soft-proof the layout with the printer's CMYK profile, pick an in-gamut orange (about C0 M60 Y100 K0) or specify a Pantone orange as a fifth ink if the budget allows, and supply a PDF/X file already converted to that profile with an output intent set. Manage the client's expectation that a screen orange will never match exactly.

</details>

2. **Black audit** — List where in a 36-page manual you would use K-only black, rich black and registration black.
<details><summary>Solution</summary>

K-only: all body text, table rules, small headings, thin borders. Rich black: the full-bleed cover background and large chapter-opener panels. Registration black: nowhere in the artwork; only in crop and registration marks, which the export dialog generates.

</details>

### Interview Questions

**Q: Why do printed colours look duller than on screen, and how do you manage client expectations?**
Screens are additive light with a wide gamut; print is subtractive ink on paper with a smaller gamut, so saturated blues, greens and oranges cannot be reproduced and are clipped when converted. I manage it by soft-proofing with the printer's ICC profile and showing the client the gamut warning early, by choosing in-gamut brand builds or a spot ink for a critical colour, and by ordering a hard proof for colour-critical jobs. I put the CMYK values in the brand sheet so every future job starts from the printable version.

**Q: What is a rich black and when do you use it?**
A rich black adds cyan, magenta and yellow under 100% black to make large areas look deeper and more neutral, since K alone prints as a dark grey on most papers. A typical build is C60 M40 Y40 K100, kept under the printer's total ink limit. I use it only for large solids, never for text, rules or small elements, because four plates must register perfectly and any misregistration produces coloured fringes. A cool or warm rich black is a design choice: more cyan for cool, more magenta and yellow for warm.

**Q: How does an RGB black become a problem in body text?**
When a Word or Canva document with RGB `#000000` text is converted by a RIP, the black becomes a four-colour build, so every letter is printed by four plates. On a digital press it looks slightly soft; on an offset press with tiny misregistration the text shows coloured edges and fills in at small sizes. The fix is to set text to K-only in the source, or to use a conversion with "preserve black" or a preflight fixup in Acrobat that maps rich black text to 100K.

## Resolution, DPI and image size

"Is this 300 DPI?" is the most common prepress question and the most misunderstood. A pixel count is what an image has; DPI or PPI is only meaningful together with a physical size.

### PPI versus DPI versus LPI

| Term | Means | Applies to |
|---|---|---|
| PPI (pixels per inch) | Image pixels per inch of printed size | Raster images |
| DPI (dots per inch) | Device dots per inch | Printers, plate-setters (1200 to 2400 dpi) |
| LPI (lines per inch) | Halftone screen frequency | Offset presses (133 to 200 lpi) |

People say DPI when they mean PPI; do not fight it, but know the difference. The press does not print pixels; it prints halftone dots arranged in lines. The rule of thumb is that image resolution should be 1.5 to 2 times the screen ruling: at 150 lpi, 225 to 300 ppi. That is where the 300 ppi standard comes from.

### Effective resolution

The number that matters is the **effective PPI** at the size the image is placed:

```text
effective ppi = image pixel width / placed width in inches

Example: 1800 px wide photo placed at 6 in  -> 300 ppi  (good)
         1800 px wide photo placed at 12 in -> 150 ppi  (soft in print)
         1800 px wide photo placed at 3 in  -> 600 ppi  (wasted data, larger file)
```

InDesign shows Actual PPI and Effective PPI in the Links panel; Acrobat's Preflight and Output Preview > Object Inspector report it per image.

### Requirements by content type

| Content | Minimum effective resolution |
|---|---|
| Photographs, gradients (colour or greyscale) | 300 ppi (250 acceptable on uncoated stock) |
| Line art, scanned signatures, logos as bitmaps | 1200 ppi (bitmap/1-bit mode) |
| Large-format posters viewed from 1 m+ | 100 to 150 ppi at final size |
| Billboards | 20 to 50 ppi at final size |
| Screen only | 72 to 96 ppi |

Scanned signatures and stamps for letterheads are the classic error: a 200 ppi greyscale scan prints jagged edges. Scan as line art at 1200 ppi, or trace it to vector.

### Upsampling does not help

Resampling a 72 ppi web image to 300 ppi in Photoshop adds interpolated pixels, not detail. The image prints just as soft, only larger. If a client sends a logo from their website, ask for the vector original (AI, EPS, SVG, PDF). If none exists, redraw it or trace it (Illustrator's Image Trace) and get the client to approve the result.

### Downsampling in the PDF

Export dialogs downsample images above a threshold. For print: bicubic downsampling to 300 ppi for images above 450 ppi, and 1200 ppi for monochrome bitmaps. Acrobat's "Reduce File Size" and WeasyPrint's `dpi=` option are for screen copies only; never run them on the print master.

### Vector versus raster

Vector graphics (fonts, logos in AI/SVG/EPS, InDesign shapes) have no resolution; they are rendered at the device's DPI and are always sharp. Keep logos, diagrams, charts and text as vector whenever possible. Rasterise only when an effect forces it, and then at 300 ppi or more at final size.

### Checking a PDF

```bash
pdfimages -list cover.pdf
# page num type width height color comp bpc enc interp object ID x-ppi y-ppi size ratio
#    1   0 image 2480  3508  rgb     3   8  jpeg  no      12  0   300   300  1.1M  4%
```

`x-ppi`/`y-ppi` are the effective resolutions at placed size. Acrobat Pro's Preflight profile "Sheetfed offset (CMYK)" also flags images under 250 ppi.

> **Tip:** Size the image in Photoshop to its final printed dimensions at 300 ppi (Image > Image Size with Resample off to see what size the pixels support, then with Resample on only to reduce). Placing a 6000 px photo at 4 cm wastes megabytes in every proof.

### Try It Yourself

```text
Effective resolution calculator

Given:   image width W_px (pixels), placed width W_in (inches)
Formula: ppi = W_px / W_in            (1 in = 25.4 mm)

Cover photo: 3000 px wide, placed at 152.4 mm (6 in)   -> 3000 / 6    = 500 ppi  OK (will be downsampled to 300 on export)
Author photo: 640 px wide, placed at 38 mm (1.5 in)   -> 640 / 1.5   = 427 ppi  OK
Web logo: 400 px wide, placed at 76 mm (3 in)         -> 400 / 3     = 133 ppi  REJECT: request vector
Signature scan: 600 px wide greyscale at 50 mm        -> 600 / 1.97  = 305 ppi  soft edges: rescan as 1200 ppi bitmap or vectorise

Minimum pixels needed = required ppi x placed inches
  Full-bleed A4 image: 216 mm x 303 mm = 8.5 x 11.93 in  -> 2551 x 3579 px at 300 ppi
```

### Quiz

1. What is the effective resolution of a 2400 px wide image placed at 4 inches?
- [ ] 300 ppi
- [x] 600 ppi
- [ ] 150 ppi
> 2400 / 4 = 600 pixels per inch.

2. Which content needs 1200 ppi?
- [ ] Colour photographs
- [x] Line art and 1-bit scans such as signatures
- [ ] Posters viewed from a distance
> Hard edges reveal pixels; bitmap line art needs far more resolution than continuous tone.

3. Does upsampling a 72 ppi image to 300 ppi make it print sharply?
- [ ] Yes, Photoshop adds detail
- [x] No, it interpolates pixels without adding detail
- [ ] Only for JPEGs
> Interpolation cannot recover information that was never captured.

### Exercises

1. **Size a full-bleed cover image** — A 6 x 9 in paperback with 0.125 in bleed needs a full-cover background photo. What pixel dimensions at 300 ppi?
<details><summary>Solution</summary>

Front cover with bleed: (6 + 0.125) x (9 + 0.25) = 6.125 x 9.25 in (only the outer edge bleeds horizontally, top and bottom both bleed). At 300 ppi: 1838 x 2775 px. For a wraparound (back + spine + front) multiply width accordingly, for example a 0.5 in spine gives (6.125 + 0.5 + 6.125) = 12.75 in = 3825 px wide.

</details>

2. **Check a client PDF** — Give the command that lists every image's effective resolution and the rule you apply to the output.
<details><summary>Solution</summary>

```bash
pdfimages -list client-brochure.pdf
```

Reject or replace any colour or greyscale image whose `x-ppi` or `y-ppi` is below 250, and any `mono` image below 1000.

</details>

### Interview Questions

**Q: A client insists an image is 300 DPI because Photoshop says so, but it prints blurry. Explain.**
The 300 in the file's metadata is just a tag; what matters is pixel count divided by the placed size. A 900 px image tagged 300 ppi is 3 inches wide at 300 ppi, and if it was scaled to 9 inches in the layout its effective resolution is 100 ppi. I show them the Effective PPI in the InDesign Links panel or `pdfimages -list`, and explain that only more original pixels (a larger source file) or a smaller placed size fixes it.

**Q: What resolutions do you require for different content, and why do they differ?**
Continuous-tone images need about twice the halftone screen ruling, so 300 ppi for 150 lpi offset work; uncoated stock at 133 lpi tolerates 250. Line art has hard edges that show stair-stepping, so bitmap scans need 1200 ppi. Large-format work is viewed from far away, so 100 to 150 ppi at final size is enough and keeps files manageable. Vector art has no resolution and is always preferred for logos and text.

**Q: How do you handle a logo the client only has as a small PNG?**
First I ask for the original vector, because most companies have one from their designer or printer. If it truly does not exist, I redraw or auto-trace it in Illustrator, clean the paths, match the colours to the brand CMYK or Pantone, and get written approval, because a traced logo is a new artwork. I then deliver the vector back to the client so the problem never recurs.

## Bleed, trim and safe zone

Paper is printed on oversized sheets and cut down. Cutting is accurate to about a millimetre, not to a hair. Three zones make that tolerance invisible: **bleed** outside the trim, the **trim** line itself, and a **safe zone** inside it.

### Definitions

```text
+--------------------------------------------------+  <- bleed edge (trim + 3 mm)
|  bleed area: backgrounds and images extend here   |
|  +--------------------------------------------+  |  <- trim line (final size)
|  |  margin / unsafe band (3-5 mm)              |  |
|  |  +--------------------------------------+  |  |  <- safe zone boundary
|  |  |  safe zone: text, logos, page numbers |  |  |
|  |  |                                      |  |  |
|  |  +--------------------------------------+  |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

- **Trim**: the finished size, for example A4 = 210 x 297 mm.
- **Bleed**: artwork that touches the edge must extend past the trim, typically 3 mm (Europe) or 0.125 in (US). After cutting, no white slivers show even if the cut drifts.
- **Safe zone** (also quiet area, live area): keep text and important elements at least 3 to 5 mm inside the trim so a drifted cut does not clip them. Book services are stricter: KDP and IngramSpark want 0.25 in (6.35 mm), and more on the spine side of interior pages.

### Setting it up in the tools

| Tool | Where |
|---|---|
| InDesign | File > Document Setup > Bleed and Slug; export with "Use Document Bleed Settings" |
| Illustrator | File > Document Setup > Bleed; Save As PDF with bleed |
| Affinity Publisher | File > Spread Setup > Bleed |
| Scribus | File > Document Setup > Bleeds |
| Word / LibreOffice | No bleed concept: make the page size trim + 2 x bleed and place the artwork oversize |
| WeasyPrint (CSS) | `@page { size: 216mm 303mm; bleed: 3mm; marks: crop; }` |
| Canva | Share > Download > PDF Print, tick "Crop marks and bleed" |

Word is the trap. A Word user who sets an A4 page cannot add bleed; they must set a custom page size of 216 x 303 mm and design to it, and the printer must be told that the page includes the bleed. Better still, move the cover to a real layout tool.

### PDF page boxes

A PDF carries several rectangles per page:

| Box | Meaning |
|---|---|
| MediaBox | The whole page as stored, including marks |
| BleedBox | Trim plus bleed |
| TrimBox | The final size after cutting |
| ArtBox | Meaningful content (rarely used) |
| CropBox | What viewers display; irrelevant to printing |

A good print PDF has TrimBox = trim size and BleedBox = trim + bleed, with the MediaBox larger if marks are present. Acrobat shows them under Tools > Print Production > Set Page Boxes; `pdfinfo -box` prints them. Printers impose using the TrimBox, so if a file only has a MediaBox that already includes bleed, they must guess, and guesses cause misalignment.

```bash
pdfinfo -box cover.pdf | grep -i box
# MediaBox:   0.00  0.00 643.46 918.43
# BleedBox:   0.00  0.00 643.46 918.43
# TrimBox:    8.50  8.50 634.96 909.93
```

### Common bleed mistakes

- A white border "bleed" made by scaling the design down: the printer sees no bleed at all.
- Backgrounds that stop exactly at the trim: a hairline of white after cutting.
- Text in the bleed: it is cut off.
- Bleed on the spine edge of an interior page: interior pages usually need bleed only if artwork touches the outer edges; check the binder's spec.
- A drop shadow or border 1 mm from the trim: looks uneven after cutting because the cut tolerance is visible against the thin band. Either bleed it or move it 5 mm inside.

> **Warning:** Borders close to the trim are the number one cause of "the printing is crooked" complaints. The cut is within tolerance; the design made the tolerance visible. Keep frames at least 5 mm from the edge or bleed them fully.

### Try It Yourself

```text
Page geometry for common jobs (trim / with bleed / safe zone)

A4 flyer ............: 210 x 297 mm  /  216 x 303 mm  /  keep text inside 204 x 291 mm
US Letter flyer .....: 8.5 x 11 in   /  8.75 x 11.25 in / keep text inside 8.0 x 10.5 in
Business card (EU) ..: 85 x 55 mm    /  91 x 61 mm    /  keep text inside 79 x 49 mm
6 x 9 in book page ..: 6 x 9 in      /  6.125 x 9.25 in (outer edges only) / KDP: 0.25 in from edge, gutter by page count

CSS (WeasyPrint) for a bleed-ready A4 cover:
  @page cover { size: 210mm 297mm; bleed: 3mm; marks: crop cross; margin: 0; }

pikepdf: set TrimBox on an existing PDF that already contains 3 mm bleed
  import pikepdf
  pdf = pikepdf.open("cover-with-bleed.pdf")
  for page in pdf.pages:
      mb = [float(v) for v in page.MediaBox]
      b = 3 / 25.4 * 72            # 3 mm in points = 8.5 pt
      page.TrimBox = [mb[0] + b, mb[1] + b, mb[2] - b, mb[3] - b]
      page.BleedBox = page.MediaBox
  pdf.save("cover-trimbox.pdf")
```

### Quiz

1. What is the standard bleed in Europe and in the US?
- [x] 3 mm and 0.125 in
- [ ] 1 mm and 0.5 in
- [ ] 10 mm and 1 in
> Both are about an eighth of an inch, enough to hide cutting drift.

2. Which PDF box defines the final cut size?
- [ ] MediaBox
- [x] TrimBox
- [ ] CropBox
> Printers impose on the TrimBox; the MediaBox includes bleed and marks.

3. Why do thin borders near the trim cause complaints?
- [ ] Ink cannot print near the edge
- [x] Normal cutting tolerance becomes visible as an uneven border
- [ ] Borders are always cut off
> A 1 mm drift is invisible on a plain page and obvious next to a 1 mm frame.

### Exercises

1. **Word cover rescue** — A client made an A5 booklet cover in Word with a full-page background. What do you tell them and what do you do?
<details><summary>Solution</summary>

Word cannot add bleed, so set Layout > Size > More Paper Sizes to 154 x 216 mm (A5 148 x 210 plus 3 mm each side), stretch the background to the new page edge, keep text 8 mm from the edge, and export to PDF. Tell the printer the PDF includes 3 mm bleed with no marks, or post-process with pikepdf to set the TrimBox. Recommend rebuilding future covers in InDesign or Affinity.

</details>

2. **Inspect page boxes** — Show the command that prints the page boxes of a PDF and state what you expect for a correct A4 file with 3 mm bleed and no marks.
<details><summary>Solution</summary>

```bash
pdfinfo -box cover.pdf
```

MediaBox and BleedBox 612.28 x 858.90 pt (216 x 303 mm); TrimBox inset 8.5 pt on each side, 595.28 x 841.89 pt (210 x 297 mm).

</details>

### Interview Questions

**Q: Explain bleed, trim and safe zone and why each exists.**
Trim is the final cut size. Bleed is artwork extended 3 mm or 0.125 in beyond the trim so that when the guillotine drifts by a millimetre, no unprinted paper shows at the edge. The safe zone is the band inside the trim where nothing important sits, so the same drift never clips text or logos. All three exist because cutting stacks of paper is mechanically accurate only to about a millimetre, and a design that ignores that tolerance makes it visible. I set them in the document setup, export with bleed and marks, and confirm the TrimBox and BleedBox in the PDF.

**Q: A printer says your PDF "has no bleed" although the background extends to the page edge. What happened?**
Most likely the page size in the PDF equals the trim size, so the background stops at the trim; or the page includes bleed but there is no TrimBox, so the printer's imposition software reads the MediaBox as the trim and sees nothing beyond it. I check with `pdfinfo -box`. The fix is to re-export with document bleed settings enabled so the page is trim plus bleed and the TrimBox is set, or to add the TrimBox with pikepdf if the artwork already extends far enough.

**Q: How do bleed requirements differ for book interiors versus covers?**
Covers almost always bleed on all outer edges because they carry full-bleed artwork, and cover templates from KDP and IngramSpark include the bleed in the template dimensions. Interiors usually only need bleed if pages have edge-to-edge images or coloured bars; KDP then requires the interior PDF to be sized at trim plus 0.125 in on the top, bottom and outer edge, with no bleed on the gutter side. Safe margins for interiors also grow with page count because the gutter swallows more of the page in thick books.

## Page sizes and paper

Page size decides the imposition, the paper waste and sometimes the price bracket. Paper decides how colour, ink and folds behave. Both belong in the job spec before design starts.

### Standard page sizes

| Series | Size | Millimetres | Inches | Typical use |
|---|---|---|---|---|
| ISO A | A3 | 297 x 420 | 11.69 x 16.54 | Posters, drawings |
| ISO A | A4 | 210 x 297 | 8.27 x 11.69 | Manuals, letters (most of the world) |
| ISO A | A5 | 148 x 210 | 5.83 x 8.27 | Booklets, notebooks |
| ISO A | A6 | 105 x 148 | 4.13 x 5.83 | Postcards |
| ISO B | B5 | 176 x 250 | 6.93 x 9.84 | Books |
| US | Letter | 215.9 x 279.4 | 8.5 x 11 | Manuals, letters (US, Canada) |
| US | Legal | 215.9 x 355.6 | 8.5 x 14 | Contracts |
| US | Tabloid/Ledger | 279.4 x 431.8 | 11 x 17 | Spreadsheets, posters |
| Book trims | 5 x 8, 5.5 x 8.5, 6 x 9 in | | | Trade paperbacks (KDP, IngramSpark) |
| Book trims | 8.5 x 11 in | | | Workbooks, manuals, textbooks |

The ISO A series halves neatly: two A5 make an A4, two A4 make an A3. That makes imposition of A-series booklets efficient on SRA3 sheets (320 x 450 mm), which are A3 plus room for bleed and marks. US sizes do not halve cleanly (half Letter is 5.5 x 8.5), which is why US digest booklets are 5.5 x 8.5 in.

### Paper weight

Europe uses grams per square metre (gsm); the US uses pounds per ream of a basis size, which differs by paper category, so "80 lb cover" is heavier than "80 lb text".

| gsm | US approximate | Feel | Use |
|---|---|---|---|
| 70 to 80 | 20 to 24 lb bond | Copier paper | Internal manuals, forms |
| 90 to 120 | 60 to 80 lb text | Quality letterhead, brochure text | Letterheads, book interiors (90 to 100 gsm) |
| 130 to 170 | 80 to 100 lb text | Heavy brochure | Flyers, brochure interiors |
| 250 to 300 | 80 to 110 lb cover | Card | Covers, business cards |
| 350+ | 130 lb cover | Board | Premium cards, packaging |

Book interiors: KDP uses 50 lb white (about 75 gsm) or cream; IngramSpark offers 50 lb white and cream and 70 lb white. Weight and paper type change thickness, which changes the spine width (Advanced level).

### Coated versus uncoated

**Coated** (gloss, silk, matt) paper has a clay layer: ink sits on the surface, so colours are sharper and more saturated, images crisp, dot gain lower. **Uncoated** absorbs ink: softer look, easier to write on, higher dot gain, colours less vivid. The ICC profile must match: PSO Coated v3 for coated, PSO Uncoated v3 for uncoated, or the US equivalents. Printing a design proofed on a coated profile onto uncoated stock looks flat and dark.

### Grain direction

Paper fibres align in one direction during manufacture. Folds parallel to the grain are clean; folds across the grain crack, especially on coated card with heavy ink. Book pages should have the grain parallel to the spine so they turn easily and lie flat. Specify "grain long" or "grain short" for folded work, or say "grain parallel to spine" and let the printer plan.

### Finishing that affects the file

- **Lamination** (gloss or matt) on covers: darkens colours slightly; matt lamination scuffs, so avoid large flat blacks or add a soft-touch coat.
- **Spot UV**: needs a separate spot colour layer named for the varnish, set to overprint.
- **Die-cutting**: a dieline on its own spot colour layer, non-printing.
- **Perforation and scoring**: mark with a distinct spot colour, off the artwork.
- **Rounded corners**: safe zone must respect the corner radius.

> **Tip:** Get the printer's sheet size and imposition before choosing an unusual trim. A 200 x 200 mm square brochure that wastes half of every SRA3 sheet costs almost as much as A4; 210 x 210 mm might impose better on their press. Five minutes on the phone can cut the paper bill.

### Try It Yourself

```text
Paper and size spec for a 767-page employee handbook (POD)

Trim ..............: 8.5 x 11 in (workbook reading on a desk; tables need width)
Interior paper ....: 50 lb white (KDP) -> 0.002252 in per page
Spine .............: 767 x 0.002252 = 1.727 in (needs cover template at that width)
Bleed .............: interior no bleed (no edge art); cover 0.125 in
Gutter ............: KDP minimum for 700+ pages = 0.875 in inside margin
Outer margins .....: 0.5 in (KDP minimum 0.25 in, but tables and binding need air)
Cover paper .......: standard 10 pt C1S (coated one side) in POD; gloss or matte finish
Alternative .......: split into two volumes of ~384 pages (0.86 in spine) for durability
```

### Quiz

1. Which sheet size do European printers use to impose A4 with bleed and marks?
- [ ] A3
- [x] SRA3 (320 x 450 mm)
- [ ] A2
> SRA sizes are slightly larger than A sizes to make room for bleed and marks.

2. What does 300 gsm typically indicate?
- [ ] Standard copier paper
- [x] Card suitable for covers and business cards
- [ ] Newsprint
> 250 to 350 gsm is the cover and card range.

3. Why does grain direction matter for a folded brochure?
- [x] Folds across the grain crack, especially on coated stock
- [ ] Grain changes the colour profile
- [ ] Grain affects font embedding
> Fibres bend cleanly along their length and crack when folded across.

### Exercises

1. **Convert units** — Express 6 x 9 in and 5.5 x 8.5 in in millimetres, and A5 in inches, to three decimals where needed.
<details><summary>Solution</summary>

6 x 9 in = 152.4 x 228.6 mm; 5.5 x 8.5 in = 139.7 x 215.9 mm; A5 = 148 x 210 mm = 5.827 x 8.268 in.

</details>

2. **Choose paper** — A client wants a 16-page price list that field agents will annotate with pen. Recommend interior and cover paper and explain.
<details><summary>Solution</summary>

Interior 100 to 120 gsm uncoated (takes pen and pencil, no glare, feels substantial); cover 250 to 300 gsm uncoated or silk with matt lamination for durability. Proof the colours with an uncoated profile such as PSO Uncoated v3 so the client does not expect gloss-paper saturation.

</details>

### Interview Questions

**Q: How do you decide the trim size for a book or manual?**
By content and channel. Text-heavy narrative reads well at 5.5 x 8.5 or 6 x 9 in; tables, forms and workbooks need 8.5 x 11 in or A4 so rate matrices are legible. Print-on-demand platforms constrain the choice: KDP and IngramSpark support specific trims and each trim has its own cover template and spine formula. I also consider paper economy: A-series and SRA sheets impose efficiently, while odd sizes waste stock. Finally, page count and paper thickness set the spine, and a 767-page handbook at 8.5 x 11 in is heavy enough that I would propose two volumes.

**Q: What is the difference between coated and uncoated stock for colour?**
Coated paper holds ink on the surface, so dots stay small and colours are saturated and sharp; uncoated absorbs ink, dots spread (higher dot gain) and colours look softer and darker. The same CMYK values print noticeably differently, so each stock has its own ICC profile, and the total ink limit is lower for uncoated. I proof with the matching profile and, for a job moving from coated to uncoated, I re-check images for shadow detail because it fills in.

**Q: Explain paper weight to a US client who asks for "80 lb".**
US basis weights depend on the paper category: 80 lb text is about 118 gsm, a heavy brochure paper, while 80 lb cover is about 216 gsm, a light card. So "80 lb" alone is ambiguous. I ask whether they mean text or cover, translate to gsm for the printer, and confirm the intended use, because a brochure interior at 80 lb cover would be stiff and hard to fold.

# LEVEL: Intermediate

## Fonts: embedding, subsetting and outlining

A PDF that references a font the printer does not have gets substituted with Courier or Arial at the RIP, and the reflow moves every line. Font problems are the most common preflight failure after bleed, and they are entirely preventable.

### Embedding

Embedding stores the font program inside the PDF so any device can render the glyphs. PDF/X requires every font to be embedded, no exceptions. Most export dialogs do it by default, but Word and some online tools silently skip fonts whose licence forbids embedding, and some PDF printers (older "Microsoft Print to PDF" setups) do not embed the base 14 fonts at all.

### Subsetting

A subset embeds only the glyphs used. It keeps files small and is standard practice; InDesign subsets when fewer than 100% of the glyphs are used (the threshold is in the export dialog, Advanced tab, "Subset fonts when percent of characters used is less than"). Subset fonts appear with a six-letter tag prefix like `KLMNOP+Minion-Regular`. Printers accept subsets; the only downside is that text cannot be edited with glyphs that are not embedded, which is why last-minute corrections at the printer are risky.

### Checking

```bash
pdffonts brochure.pdf
# name                                 type              encoding         emb sub uni object ID
# KLMNOP+MinionPro-Regular             Type 1C           Custom           yes yes yes     14  0
# QRSTUV+Montserrat-Bold               CID TrueType      Identity-H       yes yes yes     18  0
# Arial                                TrueType          WinAnsi          no  no  no      22  0   <- problem
```

Any `emb no` row fails preflight. In Acrobat Pro: File > Properties > Fonts lists each font with "(Embedded Subset)"; Preflight (Tools > Print Production > Preflight) has the check "Font not embedded".

### Font types in PDFs

| Type | Notes |
|---|---|
| Type 1 / Type 1C (CFF) | Classic PostScript fonts; fine when embedded |
| TrueType / CID TrueType | Fine when embedded; CID for large Unicode sets |
| OpenType (CFF or TT flavour) | Fine; PDF 1.6+ can embed OpenType directly |
| Type 3 | Glyphs as PDF drawings; produced by some converters and by TeX for bitmap fonts; RIPs handle them but they cannot be outlined or searched reliably; avoid |
| Multiple Master instances | Legacy; avoid |

### Outlining (converting to curves)

Outlining replaces text with vector paths. The PDF then contains no fonts at all, so substitution is impossible. Used for logos, for signage where the printer's software is old, and for fonts with embedding restrictions. Costs: the text is no longer searchable, small text loses hinting and can look slightly heavier, the file grows, and the artwork can no longer be edited as text. Outline logos and display type, not body copy.

| Tool | Command |
|---|---|
| Illustrator | Type > Create Outlines (Shift+Ctrl+O) |
| InDesign | Type > Create Outlines, or export with flattener preset "Convert all text to outlines" |
| CorelDRAW | Object > Convert to Curves (Ctrl+Q) |
| Affinity | Layer > Convert to Curves |
| Acrobat Pro | Preflight fixup "Convert fonts to outlines" |
| Ghostscript | `gs -o out.pdf -sDEVICE=pdfwrite -dNoOutputFonts in.pdf` |

### Licensing

The OpenType `fsType` flag declares whether a font may be embedded. Values: 0 installable, 2 restricted (no embedding), 4 preview and print, 8 editable. Restricted fonts cannot legally be embedded even if a tool does it. Desktop licences from Adobe Fonts, Google Fonts (OFL) and most foundries allow print embedding; some corporate fonts require a separate licence for outsourced print. Check before you commit a brand to a font.

### Fonts inside placed graphics

A placed PDF or EPS with its own fonts must have them embedded in that file; the layout app cannot supply them. InDesign's Links panel flags missing fonts in placed files. Charts pasted from Excel as EMF can carry unembedded fonts; export the chart to PDF from Excel with embedding on, or convert it to SVG.

> **Warning:** Do not "fix" a missing font at the printer by asking them to substitute. Substitution changes metrics, so line breaks move and a page that ended exactly at the bottom now spills. Fix the source and re-export.

### Try It Yourself

```bash
# Font audit for every PDF in a delivery folder
for f in deliverables/*.pdf; do
  echo "== $f"
  pdffonts "$f" | tail -n +3 | awk '$(NF-4) == "no" { print "  NOT EMBEDDED:", $1 }'
  pdffonts "$f" | grep -q "Type 3" && echo "  WARNING: Type 3 font present"
done

# Outline everything in a logo PDF (last resort, keeps vectors, removes fonts)
gs -o logo-outlined.pdf -sDEVICE=pdfwrite -dNoOutputFonts logo.pdf
pdffonts logo-outlined.pdf   # should list no fonts
```

### Quiz

1. What does the `KLMNOP+` prefix on a font name mean?
- [ ] The font is missing
- [x] The font is an embedded subset
- [ ] The font is Type 3
> Subset tags are six random uppercase letters followed by a plus sign.

2. When is outlining text appropriate?
- [x] Logos and display type, especially with restricted fonts
- [ ] All body text in a book
- [ ] Never
> Outlining removes searchability and hinting; it is for small amounts of critical text.

3. Which fsType value forbids embedding?
- [ ] 0
- [x] 2
- [ ] 8
> 2 is "restricted licence embedding"; 0 is installable, 4 preview and print, 8 editable.

### Exercises

1. **Diagnose** — A preflight report lists "Arial (not embedded)" in a PDF exported from Word. What are the likely causes and the fix?
<details><summary>Solution</summary>

Word's PDF export was run with "ISO 19005-1 compliant" off and "Embed fonts" off, or the file was printed to a PDF driver that does not embed base fonts. Re-export with File > Save As > PDF > Options > "ISO 19005-1 compliant (PDF/A)" ticked, which forces embedding, or in Word Options > Save tick "Embed fonts in the file". Verify with `pdffonts`.

</details>

2. **Font plan for a brand** — The client's brand font is a commercial font with fsType 4. The job goes to an outside printer. What do you deliver?
<details><summary>Solution</summary>

fsType 4 allows preview and print embedding, so a PDF/X with the font embedded (subset) is legal and the printer needs no font files. Do not send the font files themselves, which the licence usually forbids. Note the licence status in the job ticket.

</details>

### Interview Questions

**Q: What is the difference between embedding, subsetting and outlining, and when do you use each?**
Embedding stores the font in the PDF so the printer's RIP renders it exactly; it is mandatory for PDF/X. Subsetting embeds only used glyphs, which is the default and keeps files small; the cost is that the printer cannot edit the text with missing glyphs. Outlining converts glyphs to paths so no font exists at all; I use it for logos and display type when a font has embedding restrictions or when a legacy workflow demands it, but never for body text because it loses hinting and searchability. In every case I verify with `pdffonts` or Acrobat's Fonts tab before delivery.

**Q: A client PDF contains Type 3 fonts. What does that tell you and what do you do?**
Type 3 fonts are glyphs described as PDF drawing procedures, usually created by converters that rasterise or by LaTeX with bitmap fonts, or by some label printers. They print but can look jagged if they are bitmaps, cannot be reliably outlined or searched, and some preflight profiles flag them. I trace back to the source: re-export with vector fonts (for LaTeX, use Type 1 or OpenType fonts; for Office, use a proper PDF export rather than a print driver). If the source is gone, I rasterise that element at high resolution as a last resort.

**Q: How do fonts in placed graphics cause preflight failures?**
The layout application only embeds fonts it uses directly; a placed PDF, EPS or EMF carries its own font references, and if those were not embedded in the graphic, the final PDF inherits the problem. Excel charts pasted into Word are the classic case. I open placed PDFs with `pdffonts` before placing, and I convert charts to SVG or export them from the source app with embedding on.

## Rich black versus 100K and ink limits

Black is one ink on the press but many choices in the file. Getting it wrong produces grey-looking panels, fuzzy text, or sheets that will not dry. This chapter gives the rules and the numbers.

### 100K (plain black)

`C0 M0 Y0 K100` prints from a single plate. It is sharp, registration-proof and cheap. Use it for body text, headings under about 24pt, table rules, thin lines, barcodes and any small object. On its own it looks like a very dark grey on large areas, which is the only reason rich black exists.

### Rich black

Rich black adds the other three inks under the black to deepen it. Typical recipes:

| Name | Build | Character |
|---|---|---|
| Standard rich black | C60 M40 Y40 K100 | Neutral, safe on coated |
| Cool black | C70 M35 Y40 K100 | Slight blue cast |
| Warm black | C35 M60 Y60 K100 | Slight red-brown cast |
| Photoshop default | C75 M68 Y67 K90 | From RGB conversion, TAC 300, acceptable for panels only |
| Registration | C100 M100 Y100 K100 | Marks only, never artwork |

Rules: use rich black only for areas larger than about 10 mm and never for text or lines below 24pt. Keep the same recipe throughout a job, or panels will look different next to each other. Check the total against the ink limit.

### Total area coverage (TAC) and ink limits

TAC (also total ink coverage or total ink limit) is the sum of the four percentages. Too much ink does not dry, sets off onto the next sheet, cracks on folds and causes mottle. Limits depend on the profile and stock:

| Profile / stock | Typical TAC limit |
|---|---|
| PSO Coated v3 (FOGRA51) | 300% |
| ISO Coated v2 300% (FOGRA39, the "300" version) | 300% |
| ISO Coated v2 (FOGRA39, original) | 330% |
| U.S. Web Coated (SWOP) v2 | 300% |
| GRACoL2013 CRPC6 | 320 to 340% |
| Uncoated stocks (PSO Uncoated v3, US Sheetfed Uncoated) | 260 to 280% |
| Newsprint (ISOnewspaper26v4) | 240% |
| Digital toner presses | often 260 to 280% |

C60 M40 Y40 K100 is 240%, safe everywhere. C75 M68 Y67 K90 is 300%, at the limit for coated and over it for uncoated. Registration black is 400%.

### Checking TAC in Acrobat

Tools > Print Production > Output Preview: choose the simulation profile, tick "Total Area Coverage" and set the limit (for example 300). Every area above the limit is highlighted in green. The Preflight tool has a check "Total ink coverage above X%" that reports it as an error. Photoshop shows TAC in the Info panel when you set a readout to Total Ink.

### Grey and black text on colour

Small black text on a coloured background must be K-only and set to **overprint** (Advanced level), otherwise a white knockout under each letter shows a coloured halo if registration drifts. Grey text should be a tint of K (K60), not a four-colour grey, for the same reason.

### Screen to print: why RGB black is wrong twice

RGB `#000000` converted with a standard profile gives a rich black around 300% TAC. That is the wrong choice for text (four plates) and marginal for TAC. A conversion with "preserve black" or "black point compensation" does not change that; it is the profile's black generation (GCR/UCR) that decides. Acrobat's Preflight fixup "Convert rich black text to 100% K" handles documents you cannot re-export; for your own work, define text as K-only from the start.

### Large solids and mottle

Big flat areas of rich black or heavy colour reveal press unevenness (mottle) and paper texture. Coated paper and a well-balanced rich black hide it; uncoated paper shows it. If the design demands a full-bleed black cover on uncoated stock, warn the client and suggest a coated stock or a lamination.

> **Interview note:** Interviewers love "what black do you use for text and why". The answer is 100K, and the reason is registration; add the TAC limit for rich black and you have shown you understand both plates and ink.

### Try It Yourself

```text
Black recipes and TAC check

TAC = C + M + Y + K

C0   M0   Y0   K100  -> TAC 100  Text, rules, barcodes
C60  M40  Y40  K100  -> TAC 240  Rich black panels (safe on all stocks)
C75  M68  Y67  K90   -> TAC 300  Photoshop RGB->CMYK black: OK for panels on coated, NOT for text
C100 M100 Y100 K100  -> TAC 400  Registration marks only

Ghostscript: convert RGB to CMYK while keeping pure black as K-only (KPreserve)
  gs -o out.pdf -sDEVICE=pdfwrite -sColorConversionStrategy=CMYK \
     -dProcessColorModel=/DeviceCMYK -dKPreserve=2 -dBlackText=true in.pdf
  (-dBlackText and -dBlackVector are available in Ghostscript 9.55 and later)

Acrobat: Output Preview -> Total Area Coverage 300 -> green highlights = over limit
```

### Quiz

1. What is the TAC of C60 M40 Y40 K100?
- [ ] 100%
- [x] 240%
- [ ] 300%
> Add the four percentages: 60 + 40 + 40 + 100.

2. Why is rich black wrong for 10pt text?
- [x] Four plates must register perfectly; any drift fringes the letters
- [ ] It costs more ink per letter
- [ ] Rich black does not print on digital presses
> Small type printed from four plates shows coloured edges with even slight misregistration.

3. What is a typical TAC limit for coated sheetfed offset?
- [ ] 400%
- [x] 300 to 330%
- [ ] 200%
> FOGRA51 is 300%; older FOGRA39 allows 330%; uncoated is lower.

### Exercises

1. **Fix a cover** — A cover has a full-bleed background of C90 M85 Y80 K100 and the title in the same black at 60pt. Evaluate and correct.
<details><summary>Solution</summary>

The background TAC is 355%, above every coated limit; change it to C60 M40 Y40 K100 (240%). The 60pt title is large enough for rich black, but since it sits on the same black panel it is invisible anyway; if the title is on a light area, keep it rich black at 60pt or use K100 for consistency with smaller headings.

</details>

2. **Preflight rule** — Write the Acrobat Preflight checks you would include in a custom profile for black handling.
<details><summary>Solution</summary>

- Text smaller than 24pt uses more than one colourant (error).
- Total ink coverage above 300% (error, or the printer's limit).
- Registration colour used in page content (error).
- Black text not set to overprint (warning, Advanced level).
- Lines thinner than 0.25pt (warning).

</details>

### Interview Questions

**Q: Explain total area coverage and why it matters.**
TAC is the sum of C, M, Y and K percentages at any point. Above the limit for the paper and press, the ink cannot dry properly: it sets off onto the next sheet in the pile, cracks at folds, and causes mottling. Coated sheetfed profiles allow around 300 to 330%, uncoated 260 to 280%, newsprint 240%. I check it in Acrobat's Output Preview with the printer's profile and I define rich black as C60 M40 Y40 K100 so it never approaches the limit. An RGB-to-CMYK conversion can produce 300% or more in shadows, which is the usual way a photo-heavy job fails this check.

**Q: What are GCR and UCR?**
Both are black generation strategies in the CMYK conversion. UCR (under colour removal) replaces CMY in neutral shadow areas with K to reduce ink; GCR (grey component replacement) replaces the grey component of all colours with K across the tonal range. Heavier GCR gives more stable neutrals on press and lower TAC but less colour "body"; it is chosen in the ICC profile or in Photoshop's Custom CMYK settings. For most jobs I use the printer's profile as supplied, which bakes in their preferred black generation, rather than rolling my own.

**Q: A client's printed business cards have grey text that looks muddy and slightly coloured. What went wrong?**
The grey was a four-colour build, probably from an RGB grey converted to something like C45 M37 Y37 K2, so tiny text was printed from four plates and any registration drift added colour fringes. The fix is a K-only tint, for example K65, which prints from one plate and stays neutral. I would also check whether the text was set to knock out of a background, which compounds the problem.

## Crop marks and registration

Marks tell the finishing department where to cut, fold and check alignment. They live outside the trim, in the slug area, and the export dialog generates them; you should never draw them by hand inside the artwork.

### The marks

| Mark | Purpose |
|---|---|
| Crop (trim) marks | Thin lines at each corner showing the trim line; offset from the trim by at least the bleed so they are not printed inside the bleed area |
| Bleed marks | Optional lines showing the bleed edge |
| Registration marks | Crosshair targets printed in registration colour on every plate; the press operator aligns plates by them |
| Colour bars | Patches of each ink at 100% and tints; the operator measures density and dot gain with a densitometer |
| Page information | File name, date, plate name and page number, printed in the slug |
| Fold marks | Dashed lines in the slug showing fold positions; drawn manually or by the imposition software |

### Settings in the export dialog

InDesign: File > Export > Adobe PDF (Print) > Marks and Bleeds. Tick Crop Marks, Bleed Marks (optional), Registration Marks, Colour Bars and Page Information as required. Set Weight to 0.25pt, Offset to at least the bleed (3 mm / 0.125 in) so the crop marks start outside the bleed. Tick "Use Document Bleed Settings" or enter the bleed manually, and include the slug if the document has one.

Illustrator and Affinity have equivalent panels; Scribus has File > Export > Save as PDF > Pre-Press. Word has none, which is one more reason covers do not belong in Word.

### Registration colour

Registration is a special swatch that prints at 100% on every plate. It exists so that marks appear on all separations. Using it in the artwork prints 400% ink and looks black; it is a classic preflight error, usually from a designer picking "Registration" instead of "Black" in the swatches panel because they sit next to each other.

### Do printers want marks?

It depends. Sheetfed printers who impose your single pages themselves prefer a PDF with TrimBox and BleedBox set and no marks, because their imposition software adds its own. POD services (KDP, IngramSpark) explicitly reject marks: the PDF must be exactly the trim plus bleed. Digital print shops that print directly from your PDF often want marks. Ask, and default to "TrimBox and BleedBox set, no marks" for offset and "no marks" for POD.

### Marks and page boxes

When marks are included, the MediaBox grows to contain them and the TrimBox still records the trim, so the imposition software can ignore the marks. If a PDF has marks but no TrimBox (common with older export tools and with hand-drawn marks), the printer must measure the marks by eye. Always verify with `pdfinfo -box`.

### Hand-drawn marks and the slug

Some clients draw crop marks as lines inside the page. If the lines reach into the bleed or trim they print on the piece. Remove them and export properly. The **slug** area, outside the bleed, is the legitimate place for hand-added information: version numbers, approval boxes, a note about the spot varnish. InDesign's Document Setup has a slug field and the export dialog includes it.

### Colour bars in practice

Colour bars are only useful on the printer's press sheet, not on your single-page PDF, because imposition software places its own control strips. Include them only when the printer asks, for example when they print your PDF one-up on a digital press and want to verify density.

> **Tip:** Set crop mark offset equal to the bleed plus about 1 mm. Marks that start inside the bleed leave ink in the bleed zone, which can show as a tiny black tick at the corner if the cut drifts outward.

### Try It Yourself

```text
InDesign export settings for an offset cover (Adobe PDF (Print) dialog)

General ........: Compatibility PDF 1.4 (for PDF/X-1a) or 1.6 (PDF/X-4); Standard: PDF/X-4:2010
Compression ....: Bicubic to 300 ppi for images above 450 ppi; 1200 ppi for monochrome; JPEG Maximum or ZIP
Marks and Bleeds: Crop Marks [x]  Weight 0.25 pt  Offset 4 mm (bleed 3 mm + 1 mm)
                  Bleed Marks [ ]  Registration Marks [ ]  Colour Bars [ ]  Page Information [x]
                  Use Document Bleed Settings [x] (3 mm all sides)  Include Slug Area [x]
Output .........: Colour Conversion: Convert to Destination (Preserve Numbers)
                  Destination: PSO Coated v3 (or the printer's profile)
                  Output Intent Profile Name: same as destination
Advanced .......: Subset fonts when percent of characters used is less than 100%
                  Transparency Flattener: High Resolution (PDF/X-1a only)

Verify:
  pdfinfo -box cover.pdf      -> TrimBox = 210 x 297 mm, BleedBox = trim + 3 mm, MediaBox larger (marks)
  pdffonts cover.pdf          -> all emb yes
```

### Quiz

1. Where must crop marks sit relative to the bleed?
- [x] Outside the bleed, offset by at least the bleed amount
- [ ] On the trim line
- [ ] Inside the safe zone
> Marks printed inside the bleed can appear on the finished piece if the cut drifts.

2. What is the registration swatch for?
- [ ] Rich black panels
- [x] Marks that must appear on every plate
- [ ] Barcodes
> Registration prints 100% on all separations; in artwork it is a 400% TAC error.

3. Do POD services such as KDP want crop marks?
- [ ] Yes, always
- [x] No, the PDF must be trim plus bleed with no marks
- [ ] Only on the spine
> Their automated pipeline uses the page size itself; marks cause rejection.

### Exercises

1. **Set up a job** — A digital print shop will print your A5 flyer directly from your PDF and asks for marks. List the export settings.
<details><summary>Solution</summary>

Document 148 x 210 mm with 3 mm bleed; export with crop marks at 0.25pt, offset 4 mm, page information on, registration marks and colour bars off unless requested, "Use Document Bleed Settings" on, PDF/X-4 with the shop's profile as output intent. Confirm the resulting TrimBox is 148 x 210 mm.

</details>

2. **Find the error** — Preflight reports "Registration colour used on page 3". Where would you look?
<details><summary>Solution</summary>

Open page 3 in Acrobat Output Preview with "Show: Registration Color" or use the Preflight result's "Show in Object Inspector" to locate the object. It is usually a black rectangle, rule or text set to the Registration swatch by mistake. Fix in the source by changing the swatch to Black (K100), or apply Acrobat's fixup "Convert registration colour to black".

</details>

### Interview Questions

**Q: When do you include crop marks and when do you leave them out?**
I include them when the printer prints directly from my PDF, typically digital shops and some small offset shops, and when a proof needs to show the trim. I leave them out for print-on-demand platforms, which reject them, and for offset printers who impose themselves and prefer clean pages with TrimBox and BleedBox set. Either way the PDF carries the page boxes, so the choice is only about the visible marks. I confirm the preference in the job ticket rather than assuming.

**Q: Why should marks be generated by the export dialog instead of drawn?**
Generated marks sit in the slug outside the bleed, use registration colour so they appear on every plate, and are accompanied by correct TrimBox and BleedBox values, which imposition software reads. Hand-drawn marks are inside the page content, often in K only (so they vanish on the other plates), sometimes inside the bleed where they print on the piece, and they give the printer nothing machine-readable. If a client's file has drawn marks, I strip them and set the boxes with pikepdf or re-export from the source.

**Q: What are colour bars and registration marks used for on press?**
Registration marks are crosshairs printed identically on each plate; the operator aligns the plates so the crosshairs coincide, then checks with a loupe. Colour bars are patches of each ink and tint combinations that the operator measures with a densitometer or spectrophotometer to hold solid ink density and dot gain within tolerance across the run. Both belong to the press sheet, so imposition software normally adds them; a designer only supplies them when printing one-up directly from the PDF.

## Exporting print PDFs from Word, LibreOffice, InDesign, Photoshop and CorelDRAW

Every tool can produce a PDF; not every PDF is printable. This chapter gives the exact settings per application and the limitations you must work around. The target is a PDF with embedded fonts, correct page size, 300 ppi images, and, where the tool allows, PDF/X compliance.

### Microsoft Word

Word is where most manuals and letterheads are born. It cannot set bleed, cannot output CMYK, and cannot produce PDF/X. What it can do:

```text
File > Save As > PDF > Options:
  [x] ISO 19005-1 compliant (PDF/A)   -> forces font embedding, flattens transparency
  Optimize for: Standard (not Minimum size)
  [ ] Bitmap text when fonts may not be embedded  (leave unticked; fix the font instead)
File > Options > Advanced > Image Size and Quality:
  [x] Do not compress images in file; Default resolution: High fidelity (or 330 ppi)
Page size: set to trim + 2 x bleed under Layout > Size > More Paper Sizes if bleed is needed
```

Deliver Word PDFs to digital shops or POD that accept RGB; for offset, convert with Acrobat (Convert Colours) or Ghostscript afterwards and check the black text.

### LibreOffice Writer / Draw

File > Export As > Export as PDF. On the General tab tick "Archive (PDF/A, ISO 19005)" for guaranteed font embedding; there is no PDF/X option in any LibreOffice version, although fonts embed by default even without PDF/A. Set "Reduce image resolution" off (or 300 dpi) and JPEG quality 95 or lossless. Bleed is handled as in Word, by enlarging the page under Format > Page Style > Page. LibreOffice cannot generate crop marks and outputs RGB only, so it needs the same post-processing as Word.

### Adobe InDesign

The reference tool. File > Export > Adobe PDF (Print). Start from the preset that matches the printer: "[PDF/X-1a:2001]" for older workflows and flattened transparency, "[PDF/X-4:2008]" for modern workflows with live transparency. Then adjust Marks and Bleeds and Output as covered in the previous chapter. Package (File > Package) collects fonts and links for the printer if they want native files, and it runs a preflight of missing links, RGB images and overset text. InDesign's own Preflight panel (Window > Output > Preflight) can use a printer-supplied profile that flags low-resolution images and small type in rich black live while you design.

### Adobe Photoshop

For covers built as flat images. Set Image > Mode > CMYK Color only after converting with Edit > Convert to Profile to the printer's profile; keep the RGB master. Resolution 300 ppi at final size including bleed. Save As > Photoshop PDF: preset "[PDF/X-1a:2001]" or "[PDF/X-4:2008]", tick "Preserve Photoshop Editing Capabilities" off for a smaller file, compression ZIP or JPEG Maximum, and no downsampling. Text layers stay vector if you do not flatten; but for covers with type, InDesign or Illustrator over a Photoshop background is better because text is sharper and editable.

### CorelDRAW

File > Publish to PDF. Choose the "PDF/X-1a" or "PDF/X-4" preset in the PDF Preset list; on the Objects tab set "Export all text as curves" off unless a font has restrictions, and "Embed fonts" on; on the Prepress tab set Bleed limit (3 mm) and Crop marks; on the Color tab choose "Output colours as CMYK" and select the output intent. Corel is widely used in Pakistan and South Asia print shops, so know that its "Print Merge" and "Impose" features exist for booklets and business cards.

### Canva and other online tools

Canva: Share > Download > File type "PDF Print", tick "Crop marks and bleed" and "Flatten PDF", and choose CMYK colour profile (Canva Pro). The CMYK conversion is generic; check with Acrobat before sending to offset.

### Comparison

| Tool | Bleed | Marks | CMYK | PDF/X | Font embedding |
|---|---|---|---|---|---|
| Word | Manual page enlargement | No | No | No (PDF/A only) | Yes with PDF/A option |
| LibreOffice | Manual | No | No | No | Yes |
| InDesign | Yes | Yes | Yes | X-1a, X-3, X-4 | Yes |
| Illustrator | Yes | Yes | Yes | X-1a, X-3, X-4 | Yes |
| Photoshop | Via canvas size | Yes | Yes | X-1a, X-3, X-4 | Yes (vector text) |
| CorelDRAW | Yes | Yes | Yes | X-1a, X-3, X-4 | Yes |
| Affinity Publisher | Yes | Yes | Yes | X-1a, X-3, X-4 | Yes |
| Scribus | Yes | Yes | Yes | X-1a, X-3, X-4 | Yes |
| Canva Pro | Yes | Yes | Generic | No | Yes |
| WeasyPrint | Yes (`bleed`) | Yes (`marks`) | No (post-convert) | No (PDF/A yes) | Yes |

### Post-processing an RGB PDF for offset

```bash
# Convert to CMYK with an ICC profile and keep black text K-only (Ghostscript 9.55+)
gs -o manual-cmyk.pdf -sDEVICE=pdfwrite \
   -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK \
   -sOutputICCProfile=PSOcoated_v3.icc -dKPreserve=2 -dBlackText=true \
   -dPDFSETTINGS=/prepress manual.pdf
```

Acrobat Pro's Tools > Print Production > Convert Colors does the same with a GUI and can set an output intent for PDF/X afterwards via Preflight.

> **Warning:** "Print to PDF" (Microsoft Print to PDF, macOS Save as PDF from the print dialog) is not an export. It goes through the OS print pipeline, may rasterise gradients, may not embed fonts, and loses bookmarks and page boxes. Always use the application's own PDF export.

### Try It Yourself

```text
Per-tool export cheat sheet (print master)

Word ..........: Save As PDF > Options > [x] ISO 19005-1 (PDF/A); images High fidelity; page = trim + bleed
LibreOffice ...: Export as PDF > [x] Archive (PDF/A); JPEG quality 95; no resolution reduction
InDesign ......: Export > Adobe PDF (Print) > [PDF/X-4:2008]; Marks and Bleeds; Output: Convert to Destination (Preserve Numbers)
Photoshop .....: Convert to Profile > printer CMYK; Save As Photoshop PDF > [PDF/X-4:2008]; no downsampling
CorelDRAW .....: Publish to PDF > PDF/X-4 preset; Prepress: bleed 3 mm + crop marks; Color: CMYK + output intent
Canva Pro .....: Download > PDF Print > [x] crop marks and bleed, [x] flatten, CMYK

Then, for every file:
  pdffonts file.pdf          # emb yes on every row
  pdfimages -list file.pdf   # x-ppi >= 250 for photos
  pdfinfo -box file.pdf      # TrimBox correct
  Acrobat Preflight          # PDF/X profile matching the printer's request
```

### Quiz

1. Which Word option guarantees font embedding in the exported PDF?
- [ ] Optimize for Minimum size
- [x] ISO 19005-1 compliant (PDF/A)
- [ ] Bitmap text when fonts may not be embedded
> PDF/A requires embedded fonts, so Word embeds everything when this is ticked.

2. Which tools can natively produce PDF/X-4?
- [x] InDesign, Illustrator, CorelDRAW, Affinity, Scribus
- [ ] Word and LibreOffice
- [ ] Only Acrobat
> Office tools have no PDF/X support; layout tools do.

3. Why avoid "Print to PDF" for print masters?
- [ ] It creates PDF/X-1a automatically
- [x] It may rasterise, skip font embedding and drop page boxes
- [ ] It is slower
> The OS print path is meant for screen output, not for prepress.

### Exercises

1. **Word letterhead for offset** — A client's letterhead is a Word file with a logo and a coloured band that bleeds. Describe the delivery pipeline.
<details><summary>Solution</summary>

Rebuild the static artwork (logo, band) in InDesign or Affinity at 216 x 303 mm with bleed, export PDF/X-4 with the printer's profile for the pre-printed stock; keep the Word file as the client's typing template with a plain A4 page and a placeholder where the printed band will be. If they insist on printing from Word, enlarge the Word page to 216 x 303 mm, export with PDF/A on, convert with Ghostscript to CMYK preserving black, and verify with `pdffonts` and Preflight.

</details>

2. **Choose the preset** — The printer asks for "PDF/X-1a, FOGRA39, 3 mm bleed, no marks". Give the InDesign settings.
<details><summary>Solution</summary>

Export preset [PDF/X-1a:2001]; Output: Convert to Destination (Preserve Numbers), destination ISO Coated v2 (ECI) (FOGRA39), output intent same; Marks and Bleeds: no marks, Use Document Bleed Settings (3 mm); Advanced: flattener High Resolution; Compression: 300 ppi bicubic for images above 450 ppi.

</details>

### Interview Questions

**Q: A client can only give you a Word file. How do you get a printable PDF from it?**
I export from Word with the PDF/A option to force font embedding and high-fidelity images, after enlarging the page to trim plus bleed if any artwork bleeds. The result is RGB, so for offset I convert it with Acrobat's Convert Colors or Ghostscript using the printer's ICC profile, with black preservation so body text stays K-only, then run Preflight for the requested PDF/X standard and check the TrimBox. I tell the client the limits: no true spot colours, generic colour conversion, no marks, and I recommend rebuilding covers or brand pieces in a layout tool.

**Q: What does InDesign's Package command do and when do you use it?**
Package gathers the document, its fonts (where the licence allows), linked images and a report into one folder, and runs a preflight for missing links and fonts, RGB images and overset text. I use it when the printer asks for native files so they can make late changes or impose in their own system, and I always include a PDF/X alongside as the reference of record. For most jobs the PDF alone is what I deliver; Package is the fallback for editable handover.

**Q: Explain "Convert to Destination (Preserve Numbers)" in the InDesign export dialog.**
It converts colours whose profile differs from the destination (typically RGB images) to the destination CMYK profile, but leaves objects already in CMYK untouched, so a C0 M0 Y0 K100 text stays exactly K100 and brand builds keep their numbers. Plain "Convert to Destination" would re-map existing CMYK values through the profiles and could turn 100K into a rich build. I use Preserve Numbers on almost every job for that reason, and "No Colour Conversion" only when the printer explicitly wants to manage everything themselves.

## Spot colours and Pantone

A spot colour is a premixed ink printed from its own plate. Brand colours, metallics, fluorescents and varnishes are spot colours. They match exactly across jobs and printers, which CMYK builds never quite do, and they add a plate, so they cost more.

### When to use spot colours

- A brand colour that must match exactly (a bank's blue, a logo red).
- Colours outside the CMYK gamut: oranges, bright greens, purples, metallics, fluorescents.
- Two-colour jobs (black plus one spot) that are cheaper than four-colour on offset.
- Varnishes, white ink on dark stock, foil and die lines, which are represented as spot "colours" even though they are not inks in the ordinary sense.

### The Pantone system

Pantone Matching System (PMS) swatch books define solid colours by number with a suffix for paper: **C** coated, **U** uncoated, **M** matte. Pantone 3268 C and 3268 U are the same ink shown on different papers, and they look different. Pantone also publishes CMYK builds (Pantone Color Bridge) that show the nearest process simulation next to each spot; those builds are what you use when the job is four-colour only.

Since 2022 Pantone libraries are no longer bundled with Adobe apps; they come through the Pantone Connect plugin (subscription) or you enter the values from a physical book. Illustrator, InDesign and CorelDRAW still recognise a swatch named "PANTONE 3268 C" as a spot and output a plate of that name.

### Defining a spot in the file

In InDesign: Swatches panel > New Colour Swatch > Colour Type: Spot, Colour Mode: PANTONE+ Solid Coated (if the library is installed) or Lab/CMYK with a name. The name is what matters to the RIP: every object using the swatch separates onto a plate with that exact name. Two swatches "PANTONE 3268 C" and "Pantone 3268 C" produce two plates, which is a common and expensive mistake, fixed with Ink Manager (InDesign Swatches panel menu > Ink Manager) by aliasing one to the other.

### Checking separations

Acrobat Pro: Tools > Print Production > Output Preview > Separations. The list shows Process Cyan, Magenta, Yellow, Black and every spot plate with an eyeball to toggle. A job quoted as 4-colour that shows "PANTONE 185 C" and "Dieline" plates will either be rejected or converted at the printer's discretion. Preflight has the check "Spot colour used" with a count, and a fixup "Convert spot colours to process".

### Converting spot to process

When the job is CMYK only, convert spots deliberately: Ink Manager > "All Spots to Process" in InDesign, or the Acrobat fixup. The conversion uses the swatch's Lab or CMYK definition; for Pantone, prefer the Color Bridge build the client has approved, since the automatic conversion may differ. Tints of spots (a 30% tint of 3268 C) convert as tints of the build.

### Spot colour in Word and Office

Office cannot produce spot separations. A two-colour letterhead designed in Word arrives as RGB; the printer must recreate the spot manually or print four-colour. Design spot jobs in a layout tool.

### Special plates

| Plate name | Purpose | Settings |
|---|---|---|
| Dieline / Cut | Cutting path for boxes, cards | Spot colour, 0.25pt stroke, overprint on, non-printing note |
| Varnish / Spot UV | Gloss areas | Spot colour, 100%, overprint on, often on its own layer or page |
| White | White ink on dark or clear stock | Spot named "White", printed first or last per printer instruction |
| Foil | Hot foil stamping | Spot colour, solid, overprint off (it is a physical process) |
| Emboss | Blind emboss die | Spot colour, on its own layer |

All must be set to **overprint** (except foil where the printer says otherwise) so they do not knock a hole in the artwork underneath.

> **Tip:** Deliver a spot-colour job with a one-page "plate map": the plate names, what each is for, and the Pantone reference or process build. Printers love it, and it prevents the dieline from being printed in pink.

### Try It Yourself

```text
Brand colour specification (deliver with every brand template suite)

Primary teal
  Pantone ......: 3268 C (coated) / 3268 U (uncoated)
  CMYK build ...: C79 M14 Y55 K1 (Color Bridge, verify against printer profile)
  RGB / HEX ....: R22 G160 B133 / #16A085
  Usage ........: spot on stationery (offset, 2-colour: black + 3268 C); CMYK build on digital and brochures

Accent maroon
  Pantone ......: 7421 C
  CMYK build ...: C35 M95 Y70 K45
  RGB / HEX ....: R123 G36 B28 / #7B241C

Plate map for the business card job
  Black (K) ...........: text, rules
  PANTONE 3268 C ......: logo, band
  Dieline (spot) ......: rounded-corner cut path, 0.25 pt, overprint, DO NOT PRINT
```

### Quiz

1. What is the difference between Pantone 3268 C and 3268 U?
- [ ] Different inks
- [x] The same ink printed on coated versus uncoated paper
- [ ] C is CMYK and U is uncoated
> Suffixes indicate the paper the swatch simulates; the ink formula is the same.

2. Why do "PANTONE 185 C" and "Pantone 185 C" cause a problem?
- [x] They separate onto two different plates
- [ ] One is RGB
- [ ] Pantone names must be uppercase
> The RIP separates by exact name; alias them in Ink Manager.

3. How should a dieline be set?
- [ ] As registration colour
- [x] As a named spot colour with overprint on
- [ ] As K100 with knockout
> A spot plate for the die that overprints leaves the artwork beneath intact.

### Exercises

1. **Inspect a file** — A brochure PDF was quoted as 4/4. List how you check for unexpected plates and what to do if you find "PANTONE 300 C".
<details><summary>Solution</summary>

Open Acrobat Output Preview > Separations and read the plate list; or run Preflight "Spot colour used". If PANTONE 300 C appears, either convert it to process (Acrobat fixup "Convert spot colours to process" or InDesign Ink Manager > All Spots to Process) after confirming the client accepts the CMYK simulation, or re-quote the job as 5-colour if the exact match matters.

</details>

2. **Two-colour letterhead** — Design brief: black text plus the brand teal, offset, 2,000 sheets. Describe the file setup and delivery.
<details><summary>Solution</summary>

InDesign A4 with 3 mm bleed; swatches: Black (K) and a spot swatch named PANTONE 3268 C; all artwork uses only those two plus tints; export PDF/X-1a or X-4, no marks unless requested, output intent per printer; verify in Output Preview that exactly two plates exist (Process Black, PANTONE 3268 C); deliver with the plate map and Pantone reference.

</details>

### Interview Questions

**Q: When do you recommend a spot colour and when a CMYK build?**
A spot colour when exact, repeatable brand matching matters, when the colour is outside the CMYK gamut, when a job is two-colour and offset (cheaper than four), or for specials like metallics and varnish. A CMYK build when the job is already four-colour and the extra plate would only add cost, on digital presses that cannot run spot inks, and for pieces where a close match is acceptable. I keep both definitions in the brand sheet so every job starts with an approved value instead of an automatic conversion.

**Q: What is Ink Manager and what problems does it solve?**
InDesign's and Acrobat's Ink Manager lists every ink the document will separate into and lets you alias one spot to another (fixing duplicate names from placed graphics), convert individual spots or all spots to process, and set ink type and neutral density for trapping. It solves the "five plates instead of four" problem that comes from a logo EPS carrying its own spot swatch, and it lets you switch a spot job to process for a digital reprint without editing every object.

**Q: How do you handle Pantone now that the libraries are not bundled with Adobe apps?**
I use the Pantone Connect extension where the client has a subscription, otherwise I create the spot swatch manually with the exact Pantone name and its published Lab or CMYK values from the physical book or the client's brand guide. The name is what drives the plate, so a manually created "PANTONE 3268 C" works identically at the RIP. For process simulations I use the Color Bridge build and get it approved on a hard proof.

# LEVEL: Advanced

## PDF/X-1a versus PDF/X-4 and flattening transparency

PDF/X is the ISO 15930 family of "blind exchange" standards: a PDF/X file contains everything the printer needs and nothing that could render unpredictably. Two versions matter in daily work, and the difference between them is mostly about transparency.

### What every PDF/X file guarantees

- All fonts embedded.
- No RGB or device-independent colour unless the version allows it.
- An **output intent**: the ICC profile (or its registered name) describing the intended press condition, stored in the file so the RIP knows what the CMYK numbers mean.
- TrimBox or ArtBox present; BleedBox if there is bleed.
- No JavaScript, no encryption, no annotations that print, no external references.
- The version and conformance declared in the XMP metadata (`pdfx:GTS_PDFXVersion`).

### PDF/X-1a:2001 and :2003

Based on PDF 1.3 (2001) or 1.4 (2003). Colour must be CMYK and spot only; no ICC-based colour. **Transparency is not allowed**, so the exporter flattens it: every place where objects overlap with transparency, blend modes or drop shadows is broken into opaque pieces and, where necessary, rasterised. Layers are not allowed. It is the safest lowest common denominator and still what many packaging and newspaper workflows request.

### PDF/X-4:2008 and :2010

Based on PDF 1.6. **Live transparency** is preserved and flattened by the RIP with its own settings, which is more predictable and keeps text as text. ICC-based colour is allowed, so RGB images can travel with their profile and be converted at the RIP ("late binding"), and optional content (layers) is allowed for versioning. Modern sheetfed and digital workflows want X-4. PDF/X-3 sits between them (ICC colour, no transparency) and is rarely requested now.

| | PDF/X-1a | PDF/X-4 |
|---|---|---|
| PDF version | 1.3 / 1.4 | 1.6 |
| Transparency | Flattened at export | Live, flattened at RIP |
| Colour | CMYK + spot only | CMYK, spot, ICC-based RGB/Lab allowed |
| Layers | No | Yes (optional content) |
| Typical use | Packaging, newspapers, legacy RIPs | Sheetfed offset, digital, most modern shops |
| File size | Larger when flattening rasterises | Smaller |
| Risk | Rasterised text near transparency; stitching artefacts | RIP must handle transparency (all modern RIPs do) |

### What flattening does

Transparency flattening converts overlapping transparent objects into opaque regions. Where a drop shadow crosses text, the flattener may split the text into pieces or rasterise the region at the flattener's resolution. Artefacts:

- **Stitching**: faint white or dark lines where rasterised tiles meet, often invisible on screen and visible on press.
- **Text outlined or rasterised** near shadows and glows, looking heavier.
- **Colour shifts** where spot colours interact with transparency and the flattener converts them to process.
- **Huge files** when large images under soft masks are rasterised.

InDesign's flattener presets (Edit > Transparency Flattener Presets): "High Resolution" uses 300 ppi for gradients and 1200 ppi for line art and keeps as much vector as possible; use it for X-1a. Preview problems with Window > Output > Flattener Preview, which highlights affected objects. Acrobat's Flattener Preview is under Tools > Print Production.

### Blend modes and spot colours

Multiply, screen and other blend modes rely on transparency. In X-1a they are flattened; in X-4 they are kept and the RIP must composite them. A spot colour in a multiply blend over CMYK is a known trouble spot: some RIPs produce unexpected results. Ask the printer or convert the affected element to process.

### Choosing

Ask the printer. If they say "either", choose X-4 for anything with transparency, shadows or placed RGB photos, and X-1a for simple flat CMYK jobs or when the printer's RIP is old. Never send X-4 to a printer who asked for X-1a: their workflow may not flatten correctly and they will re-export your file with their settings.

### Verification

Acrobat Pro: Tools > Print Production > Preflight > PDF Standards, run "Verify compliance with PDF/X-4" (or X-1a). The Standards panel (View > Show/Hide > Navigation Panes > Standards) shows the declared version and output intent for any open file. Command line: `pdfinfo` shows the PDF version; the output intent is visible in the XMP or with a Python check:

```python
import pikepdf
with pikepdf.open("cover.pdf") as pdf:
    meta = pdf.open_metadata()
    print(meta.get("pdfx:GTS_PDFXVersion"))            # e.g. PDF/X-4
    intents = pdf.Root.get("/OutputIntents", [])
    for oi in intents:
        print(oi.get("/OutputConditionIdentifier"), oi.get("/Info"))
```

> **Warning:** Saving a PDF/X file from Acrobat with edits, or running "Reduce File Size", can silently remove the output intent or add features that break compliance. Re-run the compliance check after any edit, and prefer editing the source and re-exporting.

### Try It Yourself

```bash
# Produce a PDF/X-1a-style flattened, CMYK file from a PDF/X-4 or plain PDF with Ghostscript.
# PDFX_def.ps is a small PostScript file naming the output intent; copy it from Ghostscript's
# lib folder and edit /OutputConditionIdentifier and /ICCProfile to match the printer's profile.
gs -dPDFX -dBATCH -dNOPAUSE -dNOOUTERSAVE \
   -sDEVICE=pdfwrite -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK \
   -dCompatibilityLevel=1.3 -dHaveTransparency=false \
   -sOutputFile=cover-x1a.pdf PDFX_def.ps cover.pdf

# Check declared standard and output intent
python3 -c "import pikepdf;p=pikepdf.open('cover-x1a.pdf');print(p.open_metadata().get('pdfx:GTS_PDFXVersion'));print([str(o.get('/OutputConditionIdentifier')) for o in p.Root.get('/OutputIntents',[])])"
```

### Quiz

1. Which standard keeps live transparency?
- [ ] PDF/X-1a
- [x] PDF/X-4
- [ ] Neither
> X-4 is based on PDF 1.6 and lets the RIP flatten; X-1a must be flattened on export.

2. What is an output intent?
- [x] The ICC profile or condition name that says which press the CMYK values are meant for
- [ ] The printer's email address in the metadata
- [ ] The trim size
> Without it, the RIP cannot know whether K100 means FOGRA51 black or SWOP black.

3. What is a stitching artefact?
- [ ] A binding fault
- [x] Fine lines where flattened raster tiles meet
- [ ] A font substitution
> Flattening breaks areas into tiles; edges can show as hairlines on press.

### Exercises

1. **Decide the standard** — A brochure has drop shadows on photos, a placed RGB image with profile, and the printer runs a current Heidelberg Prinect workflow. Which PDF/X and why?
<details><summary>Solution</summary>

PDF/X-4. Shadows stay as live transparency for the RIP to flatten cleanly, the RGB image travels with its profile and converts at the RIP with the printer's exact settings, and Prinect fully supports X-4. Set the output intent to the profile they name (likely PSO Coated v3).

</details>

2. **Inspect a client file** — Write a short Python snippet that prints the PDF version, declared PDF/X version and output intent identifiers for every PDF in a folder.
<details><summary>Solution</summary>

```python
import pathlib, pikepdf
for f in pathlib.Path("in").glob("*.pdf"):
    with pikepdf.open(f) as pdf:
        std = pdf.open_metadata().get("pdfx:GTS_PDFXVersion")
        ois = [str(o.get("/OutputConditionIdentifier")) for o in pdf.Root.get("/OutputIntents", [])]
        print(f.name, pdf.pdf_version, std, ois)
```

</details>

### Interview Questions

**Q: Explain the difference between PDF/X-1a and PDF/X-4 and how you choose.**
Both are ISO print-exchange standards guaranteeing embedded fonts, defined colour and an output intent. X-1a, from 2001, forbids transparency and ICC colour, so the exporter flattens everything to opaque CMYK and spot objects, which is safe on any RIP but can rasterise text near shadows and produce stitching lines. X-4, from 2008, allows live transparency, ICC-based colour and layers, so the RIP does the flattening with full information; it is smaller and cleaner and what modern shops want. I ask the printer; without guidance I send X-4 for anything with transparency and X-1a only for flat work or legacy workflows.

**Q: What can go wrong with transparency flattening and how do you prevent it?**
Rasterised text and vectors near transparent objects look heavier or blurry; tile edges create stitching lines; spot colours under blend modes convert unexpectedly; and files balloon when soft-masked images rasterise. I prevent it by using the High Resolution flattener preset, keeping text above transparent objects in the stacking order where possible, avoiding blend modes on spot colours, previewing with Flattener Preview, and preferring PDF/X-4 so the RIP flattens instead of my export.

**Q: How do you verify that a file is really PDF/X compliant?**
With Acrobat Pro's Preflight "Verify compliance" profile for the requested version, which checks fonts, colour spaces, output intent, boxes and forbidden features and produces a report I can attach to the delivery. The Standards pane shows the declared version and intent at a glance. For automation, I read `pdfx:GTS_PDFXVersion` and `/OutputIntents` with pikepdf and run `pdffonts`, and for full validation I use callas pdfToolbox or the printer's own preflight portal.

## Preflight in Acrobat Pro: Output Preview, profiles and fixups

Preflight is the systematic check of a PDF against a printing condition before it is sent. Acrobat Pro's Print Production tools are the industry baseline; every printer runs something equivalent (callas pdfToolbox, Enfocus PitStop, or their MIS portal), and matching their checks before you send saves a round trip.

### Output Preview

Tools > Print Production > Output Preview. It simulates the press on screen and exposes the file's colour structure.

| Control | Use |
|---|---|
| Simulation Profile | Choose the printer's profile (the output intent is pre-selected for PDF/X files) |
| Simulate Overprinting | Shows how overprinting objects will look on press; always on when checking |
| Simulate Paper Colour / Black Ink | Closer soft proof |
| Show: All / RGB / CMYK / Spot / Registration | Isolate objects by colour space to find stray RGB |
| Separations | Plate list with percentages under the cursor; toggle plates |
| Total Area Coverage | Highlights areas above a limit (set 300 or the printer's value) |
| Object Inspector | Click an object to see its colour space, effective resolution, font, overprint and transparency |

A ten-second routine: open Output Preview, set the profile, choose Show: RGB (nothing should appear), check Separations for unexpected plates, set TAC 300 and scan for green.

### Preflight

Tools > Print Production > Preflight. Profiles are grouped: PDF Standards (verify or convert to PDF/X, PDF/A, PDF/UA), Prepress (sheetfed offset CMYK, digital printing, newspaper, large format), and custom. Run "Sheetfed offset (CMYK)" and read the report: errors (must fix), warnings (judgement) and info.

Common errors and their meaning:

| Error | Meaning | Fix |
|---|---|---|
| Font not embedded | Substitution at the RIP | Re-export; fixup "Embed fonts" works only if the font is installed |
| Image resolution below 250 ppi | Soft print | Replace image in source |
| RGB object | Uncontrolled conversion | Convert Colors, or fix in source |
| Total ink coverage above 300% | Drying and set-off | Convert with profile that limits TAC; lighten shadows |
| Line weight below 0.25pt | Hairlines may vanish | Fixup "Set minimum line width" |
| Registration colour used | 400% ink in artwork | Fixup "Convert registration colour to black" |
| TrimBox missing | Printer cannot impose | Set Page Boxes |
| Transparency present (X-1a profile) | Not allowed | Fixup "Flatten transparency" or move to X-4 |
| Spot colour used | Unexpected plate | Convert to process or approve |
| Text smaller than 5pt / white text under 6pt | Illegible on press | Design change |

### Fixups

Fixups change the file. Useful ones: Convert to PDF/X-4, Convert colours to CMYK (with a chosen profile and preserve black), Embed missing fonts, Set TrimBox based on crop marks, Add bleed by mirroring/extending (only for emergencies; it stretches edge pixels), Convert rich black text to K, Flatten transparency, Downsample images, Remove annotations and form fields, Discard hidden layers. Every fixup is a last resort compared with fixing the source, but for third-party files they are often the only option.

### Custom profiles

Build a profile per printer: Preflight > Options > Create New Preflight Profile. Add checks with the printer's numbers (TAC 300, 3 mm bleed, X-4, profile name) and fixups you allow. Save it and export as `.kfp` to share with colleagues. Run it as a **droplet** (Preflight > Options > Create Preflight Droplet) to drag a folder of PDFs onto and get pass/fail folders, which is how a Fiverr delivery of thirty brochures gets checked in one action.

### Reports

Preflight > Create Report produces a PDF report with hit lists and optional overlay masks showing where each problem sits. Attach it to the delivery when the printer asks for evidence, or when you need to explain to a client why their supplied file will not print.

### Free and command-line alternatives

- `pdffonts`, `pdfimages -list`, `pdfinfo -box` (poppler-utils) cover fonts, resolution and boxes.
- veraPDF validates PDF/A, not PDF/X.
- Ghostscript can convert but not report compliance.
- PDF-XChange, Foxit and PDFsam have limited preflight; callas pdfToolbox has a CLI and is the professional option when Acrobat is unavailable.

> **Tip:** Keep the printer's preflight report next to yours. If theirs flags something yours did not, add that check to your custom profile. Over a year the profile becomes an exact model of what that printer accepts.

### Try It Yourself

```text
Acrobat Pro preflight routine (do this on every print master)

1. Output Preview
   Simulation Profile = printer's profile     (auto for PDF/X)
   Show: RGB                                  -> nothing should appear
   Separations                                -> only expected plates
   Total Area Coverage = 300                  -> no green areas
   Object Inspector on smallest black text    -> K only, overprint on

2. Preflight > Prepress > Sheetfed offset (CMYK)   (or the printer's .kfp profile)
   Errors: 0 required.  Warnings: read each, decide, note in job ticket.

3. Preflight > PDF Standards > Verify compliance with PDF/X-4
   Standards pane shows: PDF/X-4, Output intent = PSO Coated v3

4. Page boxes: Tools > Print Production > Set Page Boxes
   TrimBox = trim, BleedBox = trim + bleed

5. Create Report (with overlay masks) -> attach to delivery

Command line equivalent for the basics:
   pdffonts f.pdf; pdfimages -list f.pdf; pdfinfo -box f.pdf
```

### Quiz

1. Which Output Preview control finds stray RGB objects fastest?
- [ ] Separations
- [x] Show: RGB
- [ ] Total Area Coverage
> Filtering the display by colour space shows only RGB objects.

2. What does a preflight fixup do that a check does not?
- [x] Modifies the PDF to correct the problem
- [ ] Emails the printer
- [ ] Rasterises the page
> Checks report; fixups change the file.

3. Why build a custom profile per printer?
- [ ] Acrobat requires it
- [x] Each printer's limits (TAC, bleed, standard, profile) differ
- [ ] To speed up rendering
> A profile encodes one printer's acceptance criteria and can be run as a droplet.

### Exercises

1. **Triage a report** — Preflight lists: 2 fonts not embedded, 14 images at 180 ppi, TAC up to 340%, registration colour on page 1, no TrimBox. Rank and fix.
<details><summary>Solution</summary>

1. Fonts: re-export from source with embedding; fixup only if fonts are installed. 2. TrimBox: Set Page Boxes (quick). 3. Registration colour: fixup "Convert registration colour to black". 4. TAC: run Convert Colors with a 300% profile or fix shadow areas in the source. 5. Images at 180 ppi: cannot be fixed in the PDF; obtain higher-resolution originals or reduce placed size; warn the client if unavailable.

</details>

2. **Droplet** — Describe how you would batch-check thirty flyers against a printer's profile and organise the results.
<details><summary>Solution</summary>

Import the printer's `.kfp` (or build a custom profile), Preflight > Options > Create Preflight Droplet, set "On success: move to Passed" and "On error: move to Failed" with report creation on, save the droplet on the desktop, drag the folder of PDFs onto it, then review the Failed folder's reports and fix in source.

</details>

### Interview Questions

**Q: Walk me through your preflight routine before sending a file to an offset printer.**
Output Preview first: set the printer's profile, filter for RGB objects, check the separations list for unexpected plates, scan total area coverage at the printer's limit and inspect the smallest black text with the Object Inspector for K-only and overprint. Then the Preflight profile that mirrors their requirements, usually my custom copy of "Sheetfed offset (CMYK)" with their TAC, bleed and PDF/X version, aiming for zero errors and documented warnings. Then compliance verification for the PDF/X version, a look at the page boxes, and a report attached to the delivery. On the command line I mirror the basics with `pdffonts`, `pdfimages -list` and `pdfinfo -box` so the check can run without Acrobat.

**Q: When is it acceptable to use fixups rather than fixing the source?**
When the source is unavailable or not mine, when the fix is deterministic and safe (setting the TrimBox, converting registration colour to black, embedding an installed font), or when the deadline makes re-export impossible and the printer agrees. I avoid fixups that invent data, like adding bleed by stretching pixels, and I never use them for resolution problems because a fixup cannot add detail. Every fixup I apply goes in the job notes so the client knows their master differs from the source.

**Q: What tools do you use when Acrobat Pro is not available?**
poppler-utils for fonts, images and boxes, pikepdf for reading output intents and metadata and for setting boxes, Ghostscript for colour conversion and PDF/X-style output, veraPDF for PDF/A. For a true PDF/X compliance report I rely on callas pdfToolbox or the printer's upload portal, which almost every commercial printer now offers. The command-line set covers 90% of what goes wrong; the remaining 10% is colour and transparency judgement that needs a proper preflight engine.

## ICC profiles and colour management

An ICC profile describes how a device reproduces colour. Colour management uses profiles to translate between devices so that a photograph looks as intended on the monitor, on the proof and on the press. Without it, "C79 M14 Y55 K1" is just numbers whose appearance depends on whoever prints them.

### The pieces

- **Source profile**: describes the colours in the file (sRGB, Adobe RGB, a camera profile, or an embedded CMYK profile).
- **Destination or output profile**: describes the press condition (paper, ink, screening). Examples: PSO Coated v3 (FOGRA51), ISO Coated v2 (FOGRA39), PSO Uncoated v3 (FOGRA52), U.S. Web Coated (SWOP) v2, GRACoL2013 CRPC6, U.S. Sheetfed Uncoated v2.
- **Profile Connection Space**: Lab or XYZ, the device-independent middle step.
- **CMM** (colour management module): the engine doing the maths, for example Adobe ACE or LittleCMS.
- **Rendering intent**: how out-of-gamut colours are handled.

### Rendering intents

| Intent | Behaviour | Use |
|---|---|---|
| Perceptual | Compresses the whole gamut smoothly; preserves relationships | Photographs with many out-of-gamut colours |
| Relative colorimetric | In-gamut colours exact; out-of-gamut clipped to nearest; white point mapped | Most graphics and photos; the default |
| Absolute colorimetric | Like relative but keeps the source white (simulates paper colour) | Proofing one press on another |
| Saturation | Keeps saturation, sacrifices accuracy | Charts, business graphics |

**Black point compensation** (BPC) maps the source black to the destination black so shadows are not crushed; leave it on for relative colorimetric.

### Where profiles come from

Standard profiles: ECI (eci.org) for FOGRA-based profiles, Idealliance for GRACoL and SWOP, Adobe bundles a set with Creative Cloud. Printers may supply a custom profile for a specific press and paper; use it if given. Install profiles in `C:\Windows\System32\spool\drivers\color` or `/Library/ColorSync/Profiles` (macOS) or `~/.color/icc` (Linux).

### Colour settings in the Adobe apps

Edit > Color Settings (synchronised through Bridge). For European work: Working Spaces RGB = Adobe RGB (1998) or sRGB, CMYK = PSO Coated v3; Colour Management Policies = Preserve Embedded Profiles; tick "Ask When Opening" for mismatches. For US work: CMYK = GRACoL2013 CRPC6 or U.S. Web Coated (SWOP) v2. The "North America General Purpose 2" default is what causes European jobs to be converted with SWOP.

### Late binding versus early binding

Early binding converts images to the destination CMYK in Photoshop before layout; you see exactly what will print and can retouch after conversion. Late binding keeps images RGB with embedded profiles through layout and converts at PDF export or at the RIP (allowed by PDF/X-4); one master serves several printers and the conversion is done once with the right profile. Modern practice favours late binding with a soft proof for checking, and early binding for colour-critical images that need retouching in CMYK.

### Soft proofing and monitor calibration

A soft proof is only meaningful on a calibrated monitor (a hardware calibrator such as X-Rite i1Display or Calibrite, target D50 or D65 white point, 120 cd/m2, gamma 2.2) in controlled light. Photoshop: View > Proof Setup > Custom > choose the output profile, relative colorimetric, BPC on, Simulate Paper Colour. Acrobat's Output Preview does the same with the output intent.

### Untagged and mismatched colour

An untagged RGB image is assumed to be the working space, which may be wrong; an image tagged Adobe RGB opened as sRGB looks dull; a CMYK image tagged SWOP placed in a FOGRA job gets converted twice if policies are not set to preserve numbers. Rules: tag everything, preserve embedded profiles, convert once at the end to the printer's profile with "preserve numbers" for existing CMYK.

### Grey and black

Greyscale images have their own profiles (Dot Gain 15% or Gray Gamma 2.2). Converting a grey image to CMYK produces four-colour greys that are hard to keep neutral on press; keep greyscale images as greyscale (which prints on the K plate only) unless a duotone effect is intended.

> **Interview note:** Be ready to define a rendering intent and to say which one you use by default and why. "Relative colorimetric with black point compensation, perceptual for photographs with a lot of saturated colour" is the answer that shows you have made the decision consciously.

### Try It Yourself

```bash
# Inspect and convert profiles from the command line (LittleCMS tools and ImageMagick)

# 1. What profile is embedded in an image?
identify -verbose photo.jpg | grep -i "profile"
exiftool -ICC_Profile:ProfileDescription photo.jpg

# 2. Convert an sRGB photo to the printer's CMYK profile with relative colorimetric + BPC
magick photo.jpg -profile sRGB.icc -intent Relative -black-point-compensation \
       -profile PSOcoated_v3.icc photo-cmyk.tif

# 3. Convert a whole PDF's colours with Ghostscript using explicit profiles
gs -o out.pdf -sDEVICE=pdfwrite -sColorConversionStrategy=CMYK \
   -sDefaultRGBProfile=sRGB.icc -sOutputICCProfile=PSOcoated_v3.icc \
   -dRenderIntent=1 -dKPreserve=2 in.pdf
#  RenderIntent: 0 perceptual, 1 relative colorimetric, 2 saturation, 3 absolute colorimetric
```

### Quiz

1. Which rendering intent is the usual default for graphics and most photos?
- [ ] Perceptual
- [x] Relative colorimetric with black point compensation
- [ ] Saturation
> It keeps in-gamut colours exact and clips only what cannot be printed.

2. What is an output intent in a PDF/X file in ICC terms?
- [x] The destination profile describing the press condition
- [ ] The monitor profile
- [ ] The camera profile
> It tells the RIP what press the CMYK values are meant for.

3. Why keep greyscale images as greyscale?
- [ ] They are smaller
- [x] They print on the K plate only and stay neutral
- [ ] CMYK cannot represent grey
> Four-colour greys drift with any ink imbalance on press.

### Exercises

1. **Diagnose dull photos** — Photos tagged Adobe RGB look flat in the client's InDesign layout and in the PDF. What is wrong and how do you fix it?
<details><summary>Solution</summary>

InDesign's colour settings are probably set to "Off" or to ignore embedded profiles, so the Adobe RGB data is interpreted as sRGB, which desaturates it. Set Edit > Color Settings to Preserve Embedded Profiles, re-link or relink the images, and export with Convert to Destination (Preserve Numbers) so the Adobe RGB images convert properly to the output profile.

</details>

2. **Set up for a US printer** — The printer asks for GRACoL. List the settings from Photoshop to export.
<details><summary>Solution</summary>

Colour Settings: CMYK working space GRACoL2013 CRPC6 (or Coated GRACoL 2006), policies Preserve Embedded; soft-proof with that profile; InDesign export PDF/X-4, Convert to Destination (Preserve Numbers), destination and output intent GRACoL2013 CRPC6; TAC check at 320%.

</details>

### Interview Questions

**Q: Explain how ICC-based colour management gets a photo from camera to press.**
The camera or editing app tags the image with a source profile such as Adobe RGB. When the image is placed and exported, the colour management module converts it through a device-independent connection space (Lab) into the destination profile that describes the press and paper, using a rendering intent to decide what happens to colours the press cannot print. The destination profile is also written into the PDF as the output intent so the RIP knows the numbers' meaning. On a calibrated monitor I soft-proof with the same profile to see the result before printing. Every step depends on tagging and on converting exactly once.

**Q: When would you choose perceptual over relative colorimetric?**
For photographs with large areas outside the press gamut, like saturated sunsets or product shots of bright fabrics, because perceptual compresses the whole gamut and keeps tonal relationships smooth instead of clipping many colours to the same edge value. For logos, flat graphics and most everyday photos I use relative colorimetric with black point compensation so in-gamut colours stay exactly as specified. I make the decision per image, not per document, when it matters.

**Q: What is the risk of converting CMYK to CMYK?**
Re-mapping existing CMYK through two profiles changes the numbers: pure K100 text can become a four-colour black, brand builds drift, and TAC can change. That is why InDesign's export has "Preserve Numbers" and why I only convert CMYK to CMYK deliberately, for example moving a job proofed for coated stock to uncoated, where I want the profile to reduce ink to the new limit, and even then I check text and brand swatches afterwards.

## Book covers: spine width, case-wrap and dust jackets

A cover is one flat piece of artwork that wraps a book: back cover, spine and front cover, plus bleed, and for hardcovers the wrap around the boards or a jacket with flaps. Its dimensions depend on the page count and paper, so the cover is the last file you finalise.

### Spine width

Spine width depends on the number of pages and the paper's thickness. Two equivalent ways to express paper thickness:

```text
Spine width = page count x paper thickness per page (caliper)
Spine width = page count / PPI                       (PPI = pages per inch, a paper spec)

Note: "pages" means printed sides; a 200-page book has 100 leaves.

KDP paperback (per-page thickness):
  White paper ........... 0.002252 in   (444 PPI)
  Cream paper ........... 0.0025   in   (400 PPI)
  Premium colour ........ 0.002347 in   (426 PPI)
  Standard colour ....... 0.002252 in   (444 PPI)

Examples:
  300 pages, white  -> 300 x 0.002252 = 0.6756 in  (17.16 mm)
  300 pages, cream  -> 300 x 0.0025   = 0.75   in  (19.05 mm)
  767 pages, white  -> 767 x 0.002252 = 1.727  in  (43.9 mm)

IngramSpark: use their online spine calculator; typical values are
  50 lb white 444 PPI, 50 lb cream 426 PPI, 70 lb white 370 PPI (confirm on their calculator)

Offset printers: ask for the caliper of the actual stock, e.g. 100 gsm uncoated ~ 0.125 mm per leaf
  spine = leaves x caliper + cover board allowance (for hardcover) = (pages / 2) x 0.125 mm
```

Always round to the platform's precision and re-run the calculation if the page count changes by even a few pages: a 5% error is visible as spine text creeping onto the front cover.

### Paperback template dimensions

```text
Cover width  = bleed + back cover width + spine + front cover width + bleed
Cover height = bleed + trim height + bleed

6 x 9 in, 300 pages white, KDP (bleed 0.125 in):
  width  = 0.125 + 6 + 0.6756 + 6 + 0.125 = 12.9256 in
  height = 0.125 + 9 + 0.125             = 9.25 in
Safe zone: 0.25 in inside trim on all edges; spine text at least 0.0625 in from spine edges
KDP: no spine text under 79 pages; IngramSpark: no spine text under 48 pages
Barcode area (KDP): 2 x 1.2 in, lower right of back cover, 0.25 in from edges (Advanced barcode chapter)
```

Download the platform's template for the exact trim, page count and paper (KDP Cover Calculator, IngramSpark Cover Template Generator). The template is a PDF or PNG with the trim, bleed, spine and barcode guides; place it on a non-printing layer, design over it, and delete or hide it before export.

### Hardcover case-wrap

A case-laminate hardcover's printed sheet wraps around the boards and is glued inside. The template adds a **wrap** (typically 0.75 in / 19 mm on each outer edge) that folds over the board edges, and a **hinge** or joint gap (around 0.25 in) on each side of the spine where the cover flexes. The spine itself is wider than the paperback spine because it includes board thickness and the rounding of the block; KDP's hardcover calculator and IngramSpark's case-wrap template give the exact value. Keep artwork that must not be lost out of the wrap area, and extend backgrounds fully through it.

### Dust jackets

A jacket is: front flap + front cover + spine + back cover + back flap, plus bleed. Flaps are commonly 3 to 3.5 in (76 to 89 mm). Author biography and price go on the flaps; the barcode on the back cover. The jacket spine is the case spine plus a little clearance. IngramSpark's jacket template sets these; for offset, the binder supplies the case dimensions after the block is measured.

### Design rules that survive production

- Spine text reads top to bottom (English-language convention in the US and UK) so the title is readable when the book lies face up.
- Keep spine text at least 1.5 mm from the spine edges; the spine can shift by up to 1.5 mm in binding.
- Do not put a hard colour change exactly at the spine edge; either bleed the spine colour 2 to 3 mm onto the covers or wrap a single background across.
- Rich black or dark covers show scuffing under matte lamination; gloss hides it.
- Leave the barcode area white or very light and never place it in a busy image.
- Fonts embedded, images 300 ppi at final size, PDF/X-1a or the platform's stated preference (KDP accepts PDF with fonts embedded and flattened transparency; IngramSpark asks for PDF/X-1a:2001).

> **Warning:** KDP and IngramSpark reject covers whose dimensions differ from the template by more than a small tolerance. Recompute the spine with the final page count from the interior PDF, not from the manuscript's word processor page count, because interior typesetting changes the number of pages.

### Try It Yourself

```text
Cover spec sheet for a 6 x 9 in paperback, 312 pages, cream paper, KDP

Spine ......: 312 x 0.0025 = 0.78 in (19.81 mm)
Full width .: 0.125 + 6 + 0.78 + 6 + 0.125 = 13.03 in
Full height : 9.25 in
Document ...: 13.03 x 9.25 in, 300 ppi, CMYK (KDP converts RGB, but supply CMYK for predictable colour)
Guides .....: back cover 0.125 to 6.125 in; spine 6.125 to 6.905 in; front cover 6.905 to 12.905 in
Safe zones .: 0.25 in inside trim; spine text within 0.78 - 2 x 0.0625 = 0.655 in wide band
Barcode ....: KDP places its own if none supplied; reserve 2 x 1.2 in white at back-cover lower right
Export .....: PDF, fonts embedded, no marks, single page, size exactly 13.03 x 9.25 in

Python one-liner to compute spine for any count:
  python3 -c "p=312; t={'white':0.002252,'cream':0.0025,'colour':0.002347}; print({k: round(p*v,4) for k,v in t.items()})"
```

### Quiz

1. What is the spine width of a 400-page KDP paperback on white paper?
- [ ] 1.0 in
- [x] 0.9008 in
- [ ] 0.5 in
> 400 x 0.002252 in = 0.9008 in.

2. In the formula spine = pages / PPI, what is PPI?
- [ ] Pixels per inch
- [x] Pages per inch, a paper thickness spec
- [ ] Points per inch
> Paper is specified by how many pages (sides) fit in an inch of stack.

3. What is the wrap on a case-wrap hardcover template?
- [x] The extra material that folds around the board edges
- [ ] The dust jacket flap
- [ ] The bleed
> Case-wrap covers wrap about 0.75 in over the boards and are glued inside.

### Exercises

1. **Compute a jacket** — A 6 x 9 in hardcover with a 1.1 in case spine, 3.5 in flaps and 0.125 in bleed. Give the flat jacket size.
<details><summary>Solution</summary>

Width = 0.125 + 3.5 (flap) + 6 (back) + 1.1 (spine) + 6 (front) + 3.5 (flap) + 0.125 = 20.35 in; height = 0.125 + 9 + 0.125 = 9.25 in. Confirm the case spine and any wrap allowance with the binder or the platform template, since hardcover boards add to the trim dimensions.

</details>

2. **Catch the error** — A designer built a cover for a 296-page cream book but the final interior is 310 pages. What changes and by how much?
<details><summary>Solution</summary>

Spine grows by 14 x 0.0025 = 0.035 in (0.89 mm); full cover width grows by the same. The spine text band and the front cover guides shift; re-download the template for 310 pages and re-centre the spine text. Left unfixed, the front cover art would print 0.035 in onto the spine and the spine text would sit off-centre.

</details>

### Interview Questions

**Q: How do you produce a print-ready paperback cover for KDP or IngramSpark?**
I finalise the interior first to get the true page count, then compute the spine from the platform's per-page thickness (KDP white 0.002252 in, cream 0.0025 in) or IngramSpark's calculator, and download their template for that trim and count. I design in InDesign or Affinity over the template on a non-printing layer, keep text inside the 0.25 in safe zone and 1.5 mm from the spine edges, reserve the barcode area, use 300 ppi images and CMYK, and export a single-page PDF with embedded fonts and no marks at exactly the template size (PDF/X-1a for IngramSpark). Then I check page size with `pdfinfo`, fonts with `pdffonts`, and upload to the platform's previewer for a final look.

**Q: What is the difference between a case-wrap and a dust jacket, from a file perspective?**
A case-wrap is printed on paper that is laminated and glued directly to the boards, so its template includes wrap allowances of about 0.75 in on the outer edges that fold inside the boards, and hinge gaps beside the spine; artwork must extend through the wrap. A dust jacket is a separate loose sheet with flaps, usually 3 to 3.5 in, that carries biography and price; its spine is slightly wider than the case for clearance. Both need bleed, and both depend on the case dimensions, which for offset come from the binder after the book block is made.

**Q: What are the most common cover rejections you have seen and how do you prevent them?**
Wrong dimensions from a stale page count, spine text on books under the minimum page count, text inside the bleed or outside the safe zone, low-resolution images (web logos), unembedded fonts, and barcode areas covered by artwork. I prevent them with a spec sheet computed from the final interior, the platform template as a guide layer, a preflight droplet that checks fonts and resolution, and the platform's online previewer before I tell the client it is done.

## Barcodes and ISBN placement

Retail books need an EAN-13 barcode encoding the ISBN, and most products need some barcode. Barcodes are unforgiving: wrong size, wrong colour or a busy background and the scanner fails at the till.

### ISBN

An ISBN-13 has five parts: prefix (978 or 979), registration group (language or country), registrant (publisher), publication element (the title) and a check digit. The check digit is computed with alternating weights 1 and 3:

```text
ISBN-13 check digit
  digits d1..d12, weights 1,3,1,3,...
  sum = d1*1 + d2*3 + d3*1 + ... + d12*3
  check = (10 - (sum mod 10)) mod 10

Example 978-0-306-40615-?:
  9 7 8 0 3 0 6 4 0 6 1 5
  x1 x3 x1 x3 x1 x3 x1 x3 x1 x3 x1 x3
  = 9+21+8+0+3+0+6+12+0+18+1+15 = 93 -> 10 - 3 = 7  -> ISBN 978-0-306-40615-7
```

Each format (paperback, hardcover, EPUB) needs its own ISBN. Publishers buy ISBNs from the national agency (Bowker in the US, Nielsen in the UK, the National Library in Pakistan). KDP offers free ISBNs that list Amazon as the publisher; IngramSpark requires you to supply one.

### The Bookland EAN barcode

The ISBN is encoded as an EAN-13 (the "Bookland" barcode), optionally with a five-digit add-on for price: `5` followed by the US dollar price in cents, for example `51499` for $14.99; `90000` means no price. Retailers in the US expect the add-on; elsewhere it is optional.

```text
Nominal EAN-13 size (100%): 37.29 x 25.93 mm (1.469 x 1.02 in) including quiet zones
Allowed magnification: 80% to 200%. Do not go below 80%.
Quiet zones: at least 3.63 mm left, 2.31 mm right at 100% (light margin indicators show the limit)
Bar height: may be truncated slightly, never below 60% of nominal
Colour: bars 100% K on white or very light background; never rich black, never reversed (white on dark)
Bar width reduction: 0 for digital; ask offset printers if they want BWR for dot gain
```

### Generating the barcode

- InDesign: no built-in generator; use a plugin or a generated vector.
- Illustrator/CorelDRAW: CorelDRAW has Object > Insert > Barcode with EAN-13 and add-on support; Illustrator via plugins.
- Online: Bookow, ISBN agencies and KDP's own generator (KDP adds a barcode automatically if you leave the area blank).
- Command line: `zint` produces EAN-13 with add-on as SVG or EPS: `zint -b 13 --addongap 9 -d "9780306406157+51499" -o barcode.svg` (`-b 13` is EANX; add-on after `+`).
- Python: `python-barcode` with the `EAN13` class, writer options for module width, output SVG.

Always place barcodes as vector (SVG, EPS, PDF), never as a JPEG; JPEG artefacts blur the bars.

### Placement

| Product | Placement |
|---|---|
| Paperback | Back cover, lower right (US and UK convention); KDP reserves 2 x 1.2 in, 0.25 in from bottom and right |
| Hardcover with jacket | Back of the jacket, lower right; some publishers also on the case |
| Magazine | Front cover, lower left, above the address area |
| Product packaging | Any flat, uncurved panel; avoid seams and edges; at least 8 mm from an edge |

Reserve a white rectangle a few millimetres larger than the barcode on all sides so the quiet zones are clean. If the cover is dark, the white box is expected and not a design failure.

### Verification

Scan the printed proof with a phone app or, for production, a barcode verifier that grades per ISO/IEC 15416 (A to F); most retailers require grade C or better. Check that the human-readable digits match the ISBN on the copyright page, and that the add-on price matches the cover price.

### Other barcodes you will meet

QR codes on flyers (vector, minimum 20 mm, error correction level M or better, test after the CMYK conversion since a rich black QR is fine but a coloured one needs contrast), Code 128 for internal document tracking and shipping labels, and UPC-A for US retail products (12 digits, similar rules).

> **Tip:** Put the ISBN text in the barcode's human-readable line and also above the barcode in a normal font ("ISBN 978-0-306-40615-7"). If the barcode is damaged, staff can key it in.

### Try It Yourself

```python
# Compute an ISBN-13 check digit and generate an EAN-13 barcode as SVG (pip install python-barcode)
def isbn13_check(twelve: str) -> str:
    total = sum(int(d) * (1 if i % 2 == 0 else 3) for i, d in enumerate(twelve))
    return str((10 - total % 10) % 10)

body = "978030640615"
isbn = body + isbn13_check(body)
print("ISBN-13:", isbn)                       # 9780306406157

from barcode import EAN13
from barcode.writer import SVGWriter
EAN13(isbn, writer=SVGWriter()).save("isbn-barcode", options={"module_width": 0.33, "module_height": 22.85, "quiet_zone": 6.5})
# Place isbn-barcode.svg at 100% (about 37 x 26 mm) in a white box, lower right of the back cover.
# For a price add-on, use zint: zint -b 13 --addongap 9 -d "9780306406157+51499" -o isbn.svg
```

### Quiz

1. What are the ISBN-13 check digit weights?
- [x] Alternating 1 and 3
- [ ] 10 down to 2
- [ ] All 1
> ISBN-13 uses the EAN weighting; ISBN-10 used 10 down to 2 with mod 11.

2. What does the add-on `90000` mean?
- [ ] Price $900.00
- [x] No price encoded
- [ ] Hardcover edition
> 5xxxx encodes a US price in cents; 90000 is the conventional "no price".

3. Why must a barcode be vector and K-only?
- [ ] Scanners only read black
- [x] Sharp edges and single-plate printing keep bars accurate; rich black or JPEG blurs them
> Registration error on a four-colour barcode widens the bars and the scan fails.

### Exercises

1. **Check an ISBN** — Verify whether 978-1-4028-9462-6 is valid.
<details><summary>Solution</summary>

Digits 9 7 8 1 4 0 2 8 9 4 6 2 with weights 1,3 alternating: 9+21+8+3+4+0+2+24+9+12+6+6 = 104; 10 - 4 = 6. Check digit 6 matches, so it is valid.

</details>

2. **Back cover layout** — Specify the barcode box for a 6 x 9 in KDP paperback with a dark cover.
<details><summary>Solution</summary>

White rectangle 2 x 1.2 in at the lower right of the back cover, its right and bottom edges 0.25 in from the trim (so within the safe zone); barcode at 100% (about 1.47 x 1.02 in) centred in the box with quiet zones clear; bars K100; ISBN printed above in 7 to 8pt; if using KDP's free barcode, leave the box empty and white.

</details>

### Interview Questions

**Q: What are the rules for a book barcode that scans reliably?**
EAN-13 encoding the ISBN with the optional five-digit price add-on, placed as vector art at 80 to 200% of the nominal 37.29 x 25.93 mm, bars in 100% K on a white or very light box with the quiet zones respected, never reversed and never on a busy image. On offset jobs I ask about bar width reduction for dot gain. I place it lower right on the back cover within the safe zone, match the human-readable digits to the copyright page, and scan the hard proof. For KDP I can leave the reserved area blank and let them add it.

**Q: Explain how an ISBN-13 check digit works and why it matters in prepress.**
Multiply the first twelve digits alternately by 1 and 3, sum, and the check digit is what brings the total to a multiple of 10. It matters because a barcode with a mistyped ISBN encodes a valid-looking but wrong number, or an invalid one that the generator rejects; I compute the check digit in a script before generating the barcode and compare it to the ISBN on the copyright page and the metadata form. A mismatch between the cover barcode and the catalogue ISBN means retailers cannot find the book.

**Q: How do you handle QR codes on printed marketing material?**
As vector art at least 20 mm square, error correction M or Q so scuffs and folds do not defeat it, quiet zone of four modules, high contrast (dark on light; K100 is safest), never over an image, and I test the code from the CMYK PDF and again from the printed proof with more than one phone. I also make the URL short and trackable so the client can measure scans.

