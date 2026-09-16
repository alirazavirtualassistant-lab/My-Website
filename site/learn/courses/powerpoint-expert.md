---
id: powerpoint-expert
title: Microsoft PowerPoint Expert
icon: 📽
track: Office & Tools
color: #B7472A
runner: none
tagline: Slide masters, branded templates and data-driven decks at production quality.
description: PowerPoint from first slide to expert template engineering: slide masters and layouts, placeholders, themes (colours/fonts/effects), branded .potx templates, tables and charts linked to Excel, SmartArt and shapes, alignment and design principles, animations and transitions done tastefully, sections, notes and handouts, exporting to PDF/video, accessibility, and productivity shortcuts.
---

# LEVEL: Beginner

## Interface, views & slide basics

PowerPoint is a page-layout tool that happens to have a slideshow button. Every deck you will ever build for a client, a manager or an interview panel is a stack of **slides**, and each slide is a fixed canvas (by default 13.333 × 7.5 inches, the 16:9 widescreen size). Understanding the window before you type anything saves hours later, because most "PowerPoint is fighting me" moments are really "I am in the wrong view".

### The four parts of the window

| Area | What it does | Shortcut |
|---|---|---|
| Ribbon | Tabs of commands: Home, Insert, Design, Transitions, Animations, Slide Show, Record, Review, View | Ctrl+F1 collapses it |
| Thumbnail pane (left) | One thumbnail per slide; drag to reorder, click to select | Ctrl+M inserts a new slide after the selected one |
| Slide canvas (centre) | The slide you are editing | Ctrl+scroll to zoom |
| Notes pane (bottom) | Speaker notes that the audience never sees | View > Notes or the Notes button on the status bar |

The **status bar** at the bottom shows the slide number ("Slide 3 of 12"), the accessibility checker status, the current theme name and the view buttons.

### Views and when to use each

PowerPoint has several views, and each one is right for a different job.

```text
View > Normal        editing one slide at a time (the default)
View > Outline View  type titles and bullets as an outline; fastest way to draft a deck
View > Slide Sorter  see all slides as thumbnails; reorder, add sections, spot inconsistent layouts
View > Notes Page    one slide + its notes on a printable page
View > Reading View  full-window playback inside the window, not full screen
View > Slide Master  edit the design of every slide at once (covered at Intermediate level)
Slide Show           F5 from the first slide, Shift+F5 from the current slide, Esc to leave
```

Outline View deserves a special mention. If you have a Word document with Heading 1 and Heading 2 styles, for example a policy manual you produced last month, **Home > New Slide > Slides from Outline** turns each Heading 1 into a slide title and each Heading 2 into a bullet. That is the fastest route from a 40-page SOP to a 15-slide training deck.

### Creating, duplicating and deleting slides

A new slide picks up the **layout** of the slide before it. Click the arrow under **Home > New Slide** to choose a different layout (Title Slide, Title and Content, Two Content, Comparison, Section Header, Blank and so on). These layouts come from the slide master, which is why two decks built from different templates show different lists here.

```text
Ctrl+M          new slide with the same layout as the current one
Ctrl+D          duplicate the selected slide(s) or the selected shape
Delete          delete the selected slide in the thumbnail pane
Ctrl+Shift+D    duplicate the selected slide
Home > Layout   change the layout of an existing slide without losing its content
```

Duplicate rather than recreate. If slide 4 is a formatted status-report slide, Ctrl+D it and edit the numbers; the alignment, fonts and colours stay consistent.

### Slide size and orientation

Set the size **before** you build anything. **Design > Slide Size** offers Standard (4:3) and Widescreen (16:9), and **Custom Slide Size** lets you type A4, Letter or an exact size such as 8.5 × 11 in portrait for a printable one-pager. Changing the size later rescales every object and usually breaks alignment, so decide first.

> **Tip:** For a deck that will be projected on a modern screen or shared as a PDF, keep 16:9. For a deck that a title-insurance client will print and staple, use Custom Slide Size = Letter (11 × 8.5 in) so nothing is cropped.

### Working faster from day one

- **Ctrl+Z / Ctrl+Y** undo and redo up to 150 steps (File > Options > Advanced > Maximum number of undos).
- **Ctrl+S** early and often. AutoSave only works for files stored on OneDrive or SharePoint.
- **Tell me** (Alt+Q) finds any command by name, which is faster than hunting through tabs.
- Right-click any command and choose **Add to Quick Access Toolbar** for the five or six commands you use constantly (Align, Distribute, Format Painter, Selection Pane).

### Try It Yourself

```text
1. Open PowerPoint > Blank Presentation.
2. Design > Slide Size > Widescreen (16:9).
3. Press Ctrl+M four times. You now have five slides.
4. Click slide 2, Home > Layout > Section Header.
5. View > Slide Sorter, drag slide 5 between 1 and 2.
6. Press F5, then Esc.
7. View > Outline View and type a title and two bullets on slide 3.
```

### Quiz

1. Which shortcut starts the slideshow from the current slide?
- [ ] F5
- [x] Shift+F5
- [ ] Ctrl+F5
> F5 starts from slide 1; Shift+F5 starts from the slide you are editing, which is what you want while rehearsing one section.

2. Where do the choices under Home > New Slide come from?
- [ ] They are fixed by Microsoft
- [x] From the layouts of the current slide master
- [ ] From the last five layouts you used
> Layouts belong to the slide master, so a branded template can add, remove or rename them.

3. When should slide size be set?
- [x] Before building any content
- [ ] After the content is final
- [ ] It does not matter
> Changing size later rescales objects and breaks alignment across the deck.

### Exercises

1. **Outline import** — Create a Word file with three Heading 1 lines and two Heading 2 lines under each, then bring it into PowerPoint as slides.
<details><summary>Solution</summary>

Save the Word file as .docx. In PowerPoint use Home > New Slide (arrow) > Slides from Outline, pick the file. You get three slides, each with a title and two bullets. Only paragraphs formatted with heading styles are imported; body text is ignored.

</details>

2. **Print-sized deck** — Set up a deck that prints on Letter paper in landscape with no cropping.
<details><summary>Solution</summary>

Design > Slide Size > Custom Slide Size > Slides sized for: Letter Paper (8.5x11 in), Orientation: Landscape. Because the ratio matches the paper, File > Print > Full Page Slides will not scale or crop.

</details>

### Interview Questions

**Q: How would you turn a 40-page SOP into a training deck quickly?**
I would first make sure the SOP uses real heading styles, because PowerPoint's Slides from Outline command maps Heading 1 to slide titles and Heading 2 to bullets. Then I import it, apply the company template, and go through in Slide Sorter to merge or split slides. That gets a structurally complete deck in under an hour, and the remaining time goes into visuals rather than typing. The trade-off is that outline import brings no images or tables, so those are added by hand from the source document.

**Q: What is the difference between Normal, Slide Sorter and Outline view, and when do you use each?**
Normal is for editing a single slide's objects. Slide Sorter shows thumbnails, so it is where I reorder, add sections and check that every slide uses the intended layout. Outline view shows only text in placeholders, so it is the fastest way to draft or to check that every slide has a real title, which also matters for accessibility. I typically draft in Outline, design in Normal and review in Slide Sorter.

**Q: Why does a deck sometimes look wrong after changing from 4:3 to 16:9?**
Because PowerPoint scales content to fit the new canvas, either by maximising or by ensuring fit, and the layouts on the master are also redrawn. Objects that were positioned manually end up off-grid, and images may be stretched if the scaling is non-uniform. The fix is to decide size first, or, if the change is unavoidable, to reset each slide's layout (Home > Reset) and re-check alignment.

## Text, bullets & placeholders

Almost every slide is text plus a picture, so the way you handle text decides whether a deck looks professional. PowerPoint gives you two kinds of text containers, and choosing the right one is the single most important beginner habit.

### Placeholders versus text boxes

A **placeholder** is a container defined by the slide layout: "Click to add title", "Click to add text". It has a position, a size, a font and bullet settings that come from the slide master. A **text box** (Insert > Text Box) is a free object that you draw anywhere; it inherits the theme font but none of the layout positioning.

| | Placeholder | Text box |
|---|---|---|
| Comes from | Layout on the slide master | You draw it |
| Position | Fixed by the design; Home > Reset restores it | Wherever you put it |
| Appears in Outline view | Yes | No |
| Read by accessibility tools as title | Title placeholder: yes | Never |
| Changes when template changes | Yes, automatically | No |

Rule: put content in placeholders whenever possible. A deck of 60 slides built with text boxes cannot be rebranded automatically; a deck built with placeholders rebrands in one click when the template changes.

### Typing and formatting text

Click inside a placeholder and type. Enter creates a new paragraph (a new bullet in a body placeholder); Shift+Enter creates a line break inside the same bullet. Tab **demotes** a bullet one level, Shift+Tab **promotes** it.

```text
Ctrl+B / Ctrl+I / Ctrl+U   bold, italic, underline
Ctrl+Shift+> / Ctrl+Shift+<   grow or shrink the font one step
Ctrl+E / Ctrl+L / Ctrl+R      centre, left, right align
Ctrl+Shift+C / Ctrl+Shift+V   copy and paste formatting only
Alt+H, then U                 opens the bullet library (keyboard access to the ribbon)
```

The Mini Toolbar appears when you select text and shows font, size and colour. For everything else, right-click > **Format Shape** opens the pane with Text Options: text direction, vertical alignment, internal margins and, importantly, **Autofit**.

### Autofit: the setting that causes tiny fonts

When you type more than fits, the default body placeholder shrinks the text ("Shrink text on overflow"). That is why so many decks have an 11-point bullet slide next to a 24-point one. Set the rule yourself under Format Shape > Text Options > Text Box:

- **Do not Autofit** — text overflows the box; you notice and fix the content.
- **Shrink text on overflow** — the default; convenient, inconsistent.
- **Resize shape to fit text** — the box grows; good for labels, bad for placeholders.

> **Warning:** A slide with more than about six bullets or 40 words is a document, not a slide. Split it, or move the detail to the notes pane and keep the slide as the headline.

### Bullets, numbering and levels

Home > Bullets and Home > Numbering toggle list markers. The arrow next to each opens **Bullets and Numbering**, where you can pick a symbol (Wingdings check marks are common in SOP decks), set the size as a percentage of the text and set the colour. Bullet indents are controlled by the ruler (View > Ruler): the top triangle is the bullet position, the bottom triangle is the text position, and dragging the square moves both.

A common production standard for management decks:

```text
Level 1  24 pt, square bullet in Accent 1, 0.25 in hanging indent
Level 2  20 pt, en dash, 0.5 in
Level 3  18 pt, no bullet, 0.75 in   (avoid going deeper than this)
```

You set these once on the slide master so every slide inherits them, which is exactly what the Intermediate level teaches.

### Paragraph spacing instead of empty lines

Never press Enter twice to make space. Use Home > Line Spacing > Line Spacing Options (or Format Shape) and set **Before** or **After** paragraph spacing, typically 6–12 pt. Empty paragraphs create phantom bullets, break screen readers and vanish when the client's template is applied.

### Find, replace and proofing

Ctrl+H opens Find and Replace across the whole deck, including notes. Home > Replace > **Replace Fonts** swaps every occurrence of one font for another, which is the fix when a client sends a deck in Calibri and the brand is Segoe UI. F7 runs spelling; Review > Language sets the proofing language for selected text, which is how you stop English (US) red underlines in a deck written in English (UK).

### Try It Yourself

```text
1. Insert a Title and Content slide.
2. Title: "Q3 Production Summary".
3. In the body type three bullets; press Tab on the third to demote it.
4. Select the body, Format Shape > Text Options > Text Box > Do not Autofit.
5. Home > Line Spacing > Line Spacing Options > After: 8 pt.
6. Ctrl+H: replace "Q3" with "Q4" in the whole deck.
```

### Quiz

1. Which container appears in Outline view and is read as the slide title by screen readers?
- [x] The title placeholder
- [ ] A text box named "Title"
- [ ] Any bold text
> Only placeholders are part of the outline structure; text boxes are decoration to accessibility tools.

2. What does Shift+Enter do inside a bullet?
- [ ] Creates a new bullet
- [x] Creates a line break inside the same bullet
- [ ] Promotes the bullet
> Enter makes a new paragraph (bullet); Shift+Enter makes a soft line break.

3. Why do some slides in a deck end up with much smaller text than others?
- [ ] The theme font is broken
- [x] Autofit shrank the text where too much was typed
- [ ] PowerPoint randomises sizes
> "Shrink text on overflow" is the default for body placeholders.

### Exercises

1. **Bullet standard** — Configure a body placeholder so Level 1 is 24 pt with a square bullet and Level 2 is 20 pt with an en dash.
<details><summary>Solution</summary>

Select the body placeholder, Home > Bullets arrow > Bullets and Numbering > Customize, pick the square from Wingdings, size 80%. Put the cursor on a level-2 line, repeat with the en dash character (Font: normal text, character code 2013). Set sizes via Home > Font Size on each level. To make it permanent, do this on the slide master instead.

</details>

2. **Font swap** — A client sends a deck in Times New Roman. Change every occurrence to Georgia without touching each slide.
<details><summary>Solution</summary>

Home > Replace arrow > Replace Fonts, Replace: Times New Roman, With: Georgia, Replace. If the master itself uses Times New Roman, change the theme fonts (Design > Variants > Fonts > Customize Fonts) so new slides inherit Georgia too.

</details>

### Interview Questions

**Q: A client complains that their rebranded deck still shows the old font on many slides. What happened?**
Those slides almost certainly use text boxes rather than placeholders, or the text has direct formatting applied on top of the placeholder. Theme changes only flow to text that inherits from the master. My fix is Home > Replace Fonts for the font name, then Home > Reset on slides with placeholders to remove direct formatting, and finally converting the worst offenders back into placeholders by pasting their text into the layout's body. I also explain to the client that the deck was built without structure and quote for a proper rebuild if it is more than a handful of slides.

**Q: How do you keep text size consistent across a 60-slide deck?**
Set the sizes on the slide master and turn off "Shrink text on overflow" so overflow is visible rather than silently shrunk. During review I use Outline view to see which slides carry too many words, and I move detail to the notes pane. I also avoid manual size changes on individual slides; if a slide genuinely needs a different treatment I create a layout for it rather than hand-formatting.

**Q: What is the difference between paragraph spacing and line spacing, and why does it matter for slides?**
Line spacing is the distance between lines within a paragraph; paragraph spacing (before/after) is the gap between bullets. Using empty paragraphs to make gaps creates invisible bullets that show up in accessibility checks and break when a template is applied. Setting After = 8 pt on the master gives consistent breathing room on every slide with zero maintenance.

## Shapes, icons & images

Words carry the argument; shapes and pictures carry attention. This chapter covers the objects you insert most often and the settings that make them look intentional instead of pasted in.

### Inserting shapes

**Insert > Shapes** opens the gallery: rectangles, rounded rectangles, arrows, callouts, flowchart symbols and action buttons. Click a shape and drag on the slide. Hold **Shift** while dragging to constrain proportions (a perfect square or circle), hold **Ctrl** to draw from the centre. Once drawn, the **Shape Format** tab appears with Shape Fill, Shape Outline and Shape Effects.

```text
Shift+drag       constrain to square/circle or straight line
Ctrl+drag        draw or move from the centre / copy on move
Alt+drag         disable snap-to-grid for pixel-precise placement
Arrow keys       nudge 1 grid unit; Ctrl+arrow nudges 1 pixel
Shift+arrow      resize the selected shape one grid unit
Ctrl+G           group; Ctrl+Shift+G ungroup
```

Set a default once: right-click a formatted shape > **Set as Default Shape**. Every new shape in this deck now uses that fill and outline, which is how you keep 80 boxes in a process diagram identical.

### Editing points and merging shapes

Any shape can be converted to a freeform: right-click > **Edit Points**. Drag the black vertices, or right-click a vertex for Smooth, Straight or Corner point. For combining shapes, select two or more and use **Shape Format > Merge Shapes**:

| Operation | Result |
|---|---|
| Union | One shape from the outline of all |
| Combine | Union minus the overlaps (creates holes) |
| Fragment | Every overlap becomes its own piece |
| Intersect | Only the overlap remains |
| Subtract | First shape minus the others |

Merge Shapes also works with text: type a word in a text box, draw a picture over it, select the picture first and then the text, and Intersect gives you an image-filled headline.

### Icons and stock images

**Insert > Icons** (Microsoft 365) gives thousands of line icons as SVG. They recolour with Graphics Format > Graphics Fill, resize without blurring and can be converted to shapes (**Graphics Format > Convert to Shape**) so you can edit or recolour a single part. **Insert > Pictures > Stock Images** offers photos, cutout people and stickers licensed for use inside Office. For a client's own imagery use Insert > Pictures > This Device.

### Working with pictures

Once a picture is selected, the **Picture Format** tab offers:

- **Crop** (and Crop to Shape, Aspect Ratio 16:9, Fill and Fit) — crop rather than resize when a photo does not fit the box.
- **Remove Background** — automatic cut-out with Mark Areas to Keep/Remove.
- **Corrections / Color / Artistic Effects** — brightness, saturation, recolour to a theme colour.
- **Compress Pictures** — reduce resolution to 150 ppi for screen decks; this is the first thing to try when a file is 80 MB.
- **Reset Picture** — undo all of the above.

Never stretch a photo by dragging a side handle; always drag a corner handle (which keeps proportions) and then crop. Distorted logos are the fastest way to lose a client's trust.

### Layering, selecting and naming

Objects stack in the order you created them. **Shape Format > Bring Forward / Send Backward** moves them, and the **Selection Pane** (Alt+F10, or Home > Select > Selection Pane) lists every object on the slide, lets you hide, reorder and, crucially, **rename** them. Rename objects as you build ("Logo", "KPI-1 box", "Chart-Revenue"): it makes the Morph transition and accessibility reading order predictable later.

```text
Selection Pane order = z-order. Top of the list is the front-most object.
Click the eye icon to hide an object while you work on something underneath.
Tab cycles through objects on the slide; Shift+Tab goes backwards.
```

> **Tip:** Pictures inserted from the web often arrive as 4000-pixel JPEGs. Insert them, crop, then Picture Format > Compress Pictures > "Apply only to this picture" off, "Delete cropped areas" on, resolution "Web (150 ppi)". A 60 MB deck typically drops to 8 MB.

### Alt text for every picture

Right-click a picture > **View Alt Text** and describe what it shows ("Bar chart of closed files by state, Texas highest"). Decorative lines and shapes get the **Mark as decorative** checkbox. This is a legal requirement for many US and EU clients and takes ten seconds per image.

### Try It Yourself

```text
1. Insert > Shapes > Rounded Rectangle; Shift+drag a 2x2 in square.
2. Shape Format > Shape Fill: Accent 1; Shape Outline: No Outline.
3. Right-click > Set as Default Shape. Draw three more; they match.
4. Insert > Icons, search "document", insert, Graphics Fill: white, place on box 1.
5. Insert a picture, Picture Format > Crop > Aspect Ratio > 16:9, then Compress Pictures (150 ppi).
6. Alt+F10 and rename the four boxes "Step 1" to "Step 4".
```

### Quiz

1. Which key keeps a shape's proportions while drawing?
- [x] Shift
- [ ] Ctrl
- [ ] Alt
> Shift constrains; Ctrl draws from the centre; Alt disables snapping.

2. Which Merge Shapes option leaves only the overlapping area?
- [ ] Union
- [ ] Subtract
- [x] Intersect
> Intersect keeps the common region; Subtract removes the later shapes from the first.

3. The correct way to make a photo fit a smaller box without distortion is:
- [ ] Drag a side handle
- [x] Drag a corner handle, then crop
- [ ] Use Shape Effects
> Corner handles keep the aspect ratio; cropping trims what does not fit.

### Exercises

1. **Process strip** — Build a four-step process with identical rounded boxes, an icon in each and connector arrows.
<details><summary>Solution</summary>

Draw one rounded rectangle, format it, Set as Default Shape, Ctrl+D three times and place them. Insert > Shapes > Block Arrow between boxes, or use connectors (Lines > Elbow Connector) that snap to shape handles. Insert > Icons for each step. Select all, Home > Arrange > Align > Align Middle and Distribute Horizontally. Group with Ctrl+G.

</details>

2. **Deck diet** — A 70 MB deck must be emailed. Reduce it without changing how it looks on screen.
<details><summary>Solution</summary>

Select any picture, Picture Format > Compress Pictures, untick "Apply only to this picture", tick "Delete cropped areas of pictures", choose Web (150 ppi) or Email (96 ppi). Also File > Info > Compress Media for embedded video. Save As a new file to compare sizes.

</details>

### Interview Questions

**Q: A logo on a client deck looks slightly squashed. How do you fix and prevent it?**
I reset the picture (Picture Format > Reset Picture and Size) to restore the original aspect ratio, then resize with a corner handle and crop if needed. To prevent it, I lock the aspect ratio in Format Picture > Size > Lock aspect ratio and, on the template, put the logo on the slide master so nobody handles it slide by slide. For a template suite I also keep the logo as SVG so it scales cleanly on any screen.

**Q: When would you convert an icon to shapes, and what is the downside?**
When I need to recolour or delete part of it, for example turning the check mark inside a document icon green while keeping the page grey. Convert to Shape turns the SVG into a group of freeforms. The downside is that it is no longer a single graphic: it is heavier, harder to swap for another icon later and its alt text has to be re-entered on the group.

**Q: What is the Selection Pane and why do you use it on every complex slide?**
It is the list of all objects on the slide in z-order. I use it to select objects hidden under others, to hide layers temporarily while I work, and to name objects. Named objects make Morph transitions and the accessibility reading order predictable, and they make VBA or python-pptx automation possible because the code can find "KPI-1 box" by name instead of by index.

## Alignment, distribute & guides

An audience cannot say why a slide looks amateur, but it is almost always misalignment: boxes two pixels apart, text not on the same baseline, uneven gaps. PowerPoint has precise tools for this, and using them takes less time than eyeballing.

### Smart Guides, grid and drawing guides

**Smart Guides** are the red dashed lines that appear while you drag an object; they show when edges or centres line up with other objects and when spacing is equal. They are on by default (View > Show launcher > Smart Guides).

**Gridlines** (Shift+F9) draw a dot grid, and objects snap to it. **Guides** (Alt+F9) are the horizontal and vertical lines you position yourself. Drag a guide to move it; Ctrl+drag to duplicate. Right-click a guide for **Add Vertical Guide / Add Horizontal Guide** and to colour it. Guides placed in Slide Master view are locked on every slide; guides placed in Normal view are per-deck and can be moved by mistake.

```text
View > Guides       Alt+F9
View > Gridlines    Shift+F9
View > Ruler        shows inches or cm (set in Windows regional settings)
Alt+drag            temporarily ignore snapping
Grid settings       View > Show launcher: spacing 0.083 in (1/12) is typical; "Snap objects to grid"
```

A production template usually has six guides: left and right margins (0.5 in on a 13.333 in slide), top of content area (below the title), bottom of content area (above the footer) and a centre guide in each direction.

### Align and Distribute

Select two or more objects, then **Home > Arrange > Align** (or Shape Format > Align):

| Command | Effect |
|---|---|
| Align Left / Center / Right | Lines up the selected edges or centres |
| Align Top / Middle / Bottom | Same, vertically |
| Distribute Horizontally / Vertically | Equal gaps between objects; the outer two stay put |
| Align to Slide vs Align Selected Objects | Whether to align relative to the canvas or to the selection |

The last option is the one people miss. With **Align to Slide** on, Align Center puts one object in the exact middle of the slide, and Distribute Horizontally spreads objects evenly across the full width.

Workflow for a row of KPI boxes: place the first and last where you want them, select all, Align Top, Distribute Horizontally. Two commands, perfectly even.

### Exact size and position

For pixel-perfect work, do not drag. Right-click > **Format Shape > Size & Properties** (or Shape Format > Size group) and type Height, Width, Horizontal position and Vertical position, measured from the top-left corner. A standard KPI card on a 16:9 slide might be Width 2.9 in, Height 1.6 in, Vertical 1.6 in, with Horizontal positions at 0.5, 3.6, 6.7 and 9.8 in (a 0.2 in gutter).

```text
Slide width 13.333 in, margins 0.5 in => content width 12.333 in
Four cards with three 0.2 in gutters: (12.333 - 0.6) / 4 = 2.933 in each
Positions: 0.5 | 3.633 | 6.767 | 9.9
```

Typing sizes is also how you make objects on different slides match: copy the numbers, not the shape.

### Groups, rotation and Format Painter

Ctrl+G groups objects so they move and resize together; double-click inside a group to edit one member. Rotation is under Size & Properties (type 90 or 270) or by dragging the rotate handle with Shift for 15° steps. **Format Painter** (Home) copies fill, outline, effects and text formatting from one object to another; double-click the brush to paint many objects in a row and Esc to stop.

### Design Ideas (Designer)

Design > **Designer** proposes layouts for the current slide's content. It is useful for a quick title slide, but it inserts free-floating objects rather than placeholders, so for a client template you will usually switch it off (File > Options > General > untick "Automatically show me design ideas").

> **Interview note:** Interviewers for document-production roles sometimes hand you a messy slide and ask you to fix it in two minutes. The answer is: Selection Pane to see what is there, Ctrl+A, Align Left, Distribute Vertically, then type exact sizes. Say the commands out loud as you go.

### Try It Yourself

```text
1. Alt+F9 to show guides; drag the vertical guide to 6.17 in left of centre (x = 0.5 in).
2. Right-click the guide > Add Vertical Guide; place it at 0.5 in from the right edge.
3. Draw four rectangles roughly in a row.
4. Select all four, Home > Arrange > Align > Align Top.
5. Align > Distribute Horizontally.
6. Select one, Shape Format > Size: Height 1.6, Width 2.93; Format Painter to the others (sizes are not copied; type them).
```

### Quiz

1. Which shortcut toggles drawing guides?
- [ ] Shift+F9
- [x] Alt+F9
- [ ] Ctrl+F9
> Shift+F9 is gridlines, Alt+F9 is guides.

2. Distribute Horizontally with "Align to Slide" ticked does what?
- [ ] Makes all objects the same width
- [x] Spreads the objects evenly across the full slide width
- [ ] Centres each object
> With Align Selected Objects instead, only the gaps between the outer objects are equalised.

3. Guides drawn in Slide Master view are:
- [x] Fixed on every slide and cannot be dragged in Normal view
- [ ] Only visible on the master
- [ ] Deleted when you save as .potx
> Master guides are the way to give a template a protected layout grid.

### Exercises

1. **Four-card layout** — Compute and set exact positions for four equal cards with 0.5 in margins and 0.25 in gutters on a 13.333 in wide slide.
<details><summary>Solution</summary>

Content width = 13.333 − 1.0 = 12.333 in. Card width = (12.333 − 3 × 0.25) / 4 = 2.896 in. Horizontal positions: 0.5, 3.646, 6.792, 9.938 in. Enter these under Shape Format > Size & Properties > Position for each card.

</details>

2. **Fix a messy slide** — Six text boxes at random positions must become two aligned columns of three.
<details><summary>Solution</summary>

Select the three left boxes, Align Left, Distribute Vertically. Repeat for the right three. Then select the top-left and top-right boxes and Align Top; repeat for the middle and bottom rows. Finally select all and check Smart Guides show equal gaps.

</details>

### Interview Questions

**Q: How do you make sure objects are in the same place on every slide of a deck?**
Two ways, depending on whether the object is content or design. Design objects (logos, footers, rules) go on the slide master or layout so they physically cannot move. Content objects get typed positions via Size & Properties, and I keep a small table of standard positions for KPI cards, charts and images so every slide uses the same numbers. Guides on the master give the visual grid, and the Selection Pane confirms nothing has drifted. On a large rebuild I check positions with a VBA loop that prints each shape's Left and Top so drift is caught numerically rather than by eye.

**Q: What is the difference between Distribute and Align?**
Align moves objects so a chosen edge or centre coincides; Distribute equalises the spacing between three or more objects, leaving the outer two in place unless Align to Slide is on. Typical use is Align Top followed by Distribute Horizontally for a row. People confuse the two and end up nudging by hand, which is slower and never exact.

**Q: Why might you turn off Design Ideas in a corporate template?**
Designer inserts its own shapes and pictures outside the template's layouts and colour discipline, so users produce slides that do not match the brand and cannot be rebranded later. For a governed template I disable it and provide enough purpose-built layouts that users do not need it.

## Saving & exporting (pptx/potx/pdf)

Getting the file out of PowerPoint in the right format is part of the job. A client rarely wants "the PowerPoint"; they want a PDF for email, a .potx their team can start from, or a .ppsx that opens straight into a slideshow. This chapter covers each format and the settings that matter.

### The file formats

| Extension | Type | Use it for |
|---|---|---|
| .pptx | Presentation | Everyday editing and sharing |
| .potx | Template | A starting point; File > New creates a new .pptx from it and leaves the template untouched |
| .ppsx | Show | Double-click opens directly in slideshow mode; good for kiosks and email |
| .pptm / .potm / .ppsm | Macro-enabled versions | Only when the file contains VBA |
| .thmx | Theme | Colours, fonts, effects and master only, applied via Design > Themes |
| .pdf | Portable document | Final delivery, printing, anything the recipient must not edit |
| .odp | OpenDocument | LibreOffice/Google interoperability; expect layout differences |

All the Office formats are ZIP archives of XML. Rename `deck.pptx` to `deck.zip` and you will find `ppt/slides/slide1.xml`, `ppt/slideMasters`, `ppt/slideLayouts`, `ppt/theme/theme1.xml` and `ppt/media` for images. Knowing this helps when a file is corrupt or a font will not embed.

### Save As versus Export

**File > Save As** (F12) chooses a location and a format from the "Save as type" list. **File > Export** offers Create PDF/XPS Document, Create a Video, Package Presentation for CD, Create Handouts (sends slides to Word) and Change File Type.

Saving as a template:

```text
File > Save As > Browse
Save as type: PowerPoint Template (*.potx)
PowerPoint switches the folder to:
  %USERPROFILE%\Documents\Custom Office Templates
Now File > New > Personal (or Custom) shows the template.
```

If you save the .potx somewhere else it still works when double-clicked, but it will not appear under File > New.

### Exporting to PDF the right way

File > Export > Create PDF/XPS, then click **Options** before publishing:

- **Range**: All, Current slide, Selection, or a custom range like 1-5,9.
- **Publish what**: Slides, Handouts (choose slides per page), Notes pages, Outline view.
- **Frame slides**: draws a thin border, useful on white backgrounds.
- **Include hidden slides**: usually off.
- **PDF options**: PDF/A compliance for archival deliveries; Bitmap text when fonts cannot be embedded (avoid; it makes text unsearchable).
- **Document structure tags for accessibility**: keep on, so the PDF has a reading order.

Optimize for **Standard** (print quality) or **Minimum size** (screen). Standard embeds images at up to 220 ppi; Minimum size resamples to 150 ppi and typically halves the file.

> **Tip:** Hyperlinks, slide transitions and animations do not survive PDF export; each slide is a single flat page. If a build-up animation must survive, duplicate the slide and delete objects on each copy so the PDF shows the sequence.

### Fonts and Package for CD

Fonts are the top reason a deck looks different on the client's machine. Either use fonts that ship with Windows and Office (Segoe UI, Calibri, Aptos, Arial, Georgia) or embed: File > Options > Save > **Embed fonts in the file**, choosing "Embed only the characters used" (smaller, cannot be edited) or "Embed all characters" (editable). Fonts with restrictive licences will not embed, and PowerPoint for Mac only started embedding in 2019.

File > Export > **Package Presentation for CD** copies the deck, linked files (linked Excel charts, videos) and the viewer into one folder, which is the safe way to hand a deck with linked media to another team.

### Versions and recovery

Files on OneDrive/SharePoint have **File > Info > Version History**. For local files, File > Info > Manage Presentation shows AutoRecover copies (default every 10 minutes, set under File > Options > Save). Use **Save a Copy** rather than editing a client's master file directly, and name versions explicitly: `ClientName_Deck_v03_2026-09-15.pptx`.

### Try It Yourself

```text
1. File > Save As > Browse, type: PowerPoint Template (*.potx), name "Client_Base".
2. Close. File > New > Personal > Client_Base: a new Presentation1 opens.
3. File > Export > Create PDF/XPS > Options: Handouts, 3 slides per page, Frame slides.
4. File > Options > Save > Embed fonts in the file > Embed only the characters used.
5. Rename a copy of the .pptx to .zip and open ppt/slides/slide1.xml in a text editor.
```

### Quiz

1. Which format opens straight into slideshow mode when double-clicked?
- [ ] .potx
- [x] .ppsx
- [ ] .thmx
> A PowerPoint Show launches the show; Esc reveals nothing editable unless opened via File > Open.

2. Where must a .potx be saved to appear under File > New > Personal?
- [x] Documents\Custom Office Templates
- [ ] The Desktop
- [ ] C:\Program Files\Microsoft Office
> That folder is the default personal templates location; it can be changed under File > Options > Save.

3. What happens to animations in a PDF export?
- [ ] They are converted to page transitions
- [x] They are lost; each slide becomes one flat page
- [ ] They are embedded as video
> PDF is static; duplicate slides if the build sequence matters.

### Exercises

1. **Client delivery pack** — Produce, from one deck, a PDF handout with notes, a .ppsx and a font-embedded .pptx.
<details><summary>Solution</summary>

Export > Create PDF/XPS > Options > Publish what: Notes pages. Save As > PowerPoint Show (*.ppsx). File > Options > Save > Embed fonts (all characters), then Save As > .pptx with a "_fonts" suffix. Zip the three files with a README noting the PowerPoint version used.

</details>

2. **Corrupt file** — A deck will not open ("PowerPoint found a problem with content"). List the steps you take.
<details><summary>Solution</summary>

Try File > Open > arrow next to Open > Open and Repair. If that fails, rename to .zip, extract, and open ppt/slides/ files to find the broken XML (often a malformed image relationship); remove the offending slide's relationship or media file, re-zip, rename to .pptx. As a last resort, create a new deck and use Home > New Slide > Reuse Slides to pull in the intact slides.

</details>

### Interview Questions

**Q: A client says the PDF you sent has different fonts than the deck. What went wrong?**
Nothing went wrong in the PDF; it embeds the fonts PowerPoint used at export time. The mismatch means the deck itself used a font that was substituted on my machine, or the client is viewing the PDF in a browser that swaps fonts. I check File > Options > Save for the embedding setting, confirm the font is installed where the export happened, and re-export with Standard quality. If the font is licence-restricted, I either switch the theme font to a cloud font available in Microsoft 365 or convert the affected text to an image for the PDF only.

**Q: When do you deliver a .potx instead of a .pptx?**
When the client will create many decks from the design and must not accidentally overwrite the master. A .potx opens as a fresh untitled presentation every time, and it lives under File > New > Personal so their staff can find it. I still deliver a sample .pptx built from the template so they can see the layouts in use, and a one-page guide explaining which layout to use for which purpose.

**Q: Explain what a .pptx file actually is and why that matters.**
It is a ZIP container following the Office Open XML standard: a [Content_Types].xml, relationship files and folders for slides, layouts, masters, theme and media. It matters because you can repair a corrupt file by editing the XML, batch-replace text or colours with a script, extract every image from ppt/media without opening PowerPoint, and generate decks with libraries such as python-pptx or PptxGenJS that write this XML directly.

# LEVEL: Intermediate

## Themes: colours, fonts & effects

A **theme** is the design DNA of a deck: twelve colours, two fonts and a set of effects, plus the slide master and layouts that use them. Everything you format "with theme colours" changes automatically when the theme changes, and everything you format with a hard-coded colour does not. That single distinction separates a template that can be rebranded in one minute from one that needs a week of manual work.

### The twelve theme colours

Open **Design > Variants > More (the arrow) > Colors > Customize Colors** and you see the full set:

| Slot | Role | Typical brand value |
|---|---|---|
| Text/Background – Dark 1 | Main text | Near-black, e.g. #1F1F1F |
| Text/Background – Light 1 | Main background | White |
| Text/Background – Dark 2 | Secondary text, dark backgrounds | Brand navy |
| Text/Background – Light 2 | Light panels, table banding | Light grey #F2F2F2 |
| Accent 1 – Accent 6 | Charts, shapes, SmartArt, in order | Brand primary first, then supporting colours |
| Hyperlink | Links | Brand blue |
| Followed Hyperlink | Visited links | Muted version |

Charts use Accent 1 for the first series, Accent 2 for the second and so on, which is why the order matters: put the brand primary in Accent 1 and a contrasting colour in Accent 2 so a two-series chart is readable without manual recolouring. Each theme colour also generates five tints/shades in the colour picker (Lighter 80% to Darker 50%), and those tints are also theme-linked.

Colours on a slide come from three places in the picker: **Theme Colors** (linked), **Standard Colors** (hard-coded) and **More Colors** (hard-coded). Only the first block updates when the client rebrands.

### Theme fonts

**Design > Variants > Fonts > Customize Fonts** sets a **Heading font** and a **Body font**. In the file these are stored as `+mj-lt` (major Latin) and `+mn-lt` (minor Latin), and every placeholder references those names rather than "Segoe UI". Change the pair and the whole deck follows. Pick fonts the client's staff actually have: Aptos, Segoe UI, Calibri and Arial are safe on Windows; custom brand fonts need embedding or a cloud-font fallback.

```xml
<!-- ppt/theme/theme1.xml (excerpt) -->
<a:fontScheme name="Stewart Fonts">
  <a:majorFont><a:latin typeface="Segoe UI Semibold"/></a:majorFont>
  <a:minorFont><a:latin typeface="Segoe UI"/></a:minorFont>
</a:fontScheme>
```

### Effects and background styles

**Effects** control the look of shape fills, lines and shadows in three intensity levels (subtle, moderate, intense) that SmartArt and shape styles draw from. For management decks choose a flat effect set (for example "Office" or "Flat") and avoid bevels and glows. **Background Styles** (Design > Variants > Background Styles) offer twelve backgrounds built from Dark/Light 1 and 2; **Format Background** applies a solid, gradient, picture or pattern to one slide or, with Apply to All, to the master.

### Applying, saving and sharing themes

- **Design > Themes** applies a theme to the current deck. Right-click a theme thumbnail for **Apply to Selected Slides** when only a section should change.
- **Design > Variants > More > Save Current Theme** writes a `.thmx` that any deck, Word document or Excel workbook can apply, which keeps a client's Word letterhead and PowerPoint deck on the same palette.
- The theme travels inside the .potx, so most of the time the template is the delivery unit and the .thmx is a convenience.

```text
Design > Variants ▾ > Colors > Customize Colors...   name it "<Client> 2026"
Design > Variants ▾ > Fonts  > Customize Fonts...    Heading + Body
Design > Variants ▾ > Effects                         choose a flat set
Design > Variants ▾ > Save Current Theme...           Client.thmx
```

Custom colour and font sets are saved as XML under `%APPDATA%\Microsoft\Templates\Document Themes\Theme Colors` and `\Theme Fonts`, so they can be copied to a colleague's machine.

> **Warning:** Copying a slide between decks with different themes shows a paste option: **Use Destination Theme** (recommended, the slide adopts the new colours) or **Keep Source Formatting** (the source master is copied into the deck, silently adding a second master). Decks with five stray masters are almost always the result of Keep Source Formatting.

### Checking a deck for hard-coded colours

There is no built-in report, but two quick checks work: change Accent 1 to a lurid colour temporarily and flip through in Slide Sorter (anything that did not change is hard-coded), and inspect the XML for `<a:srgbClr` (hard-coded) versus `<a:schemeClr val="accent1"/>` (linked). The Expert level automates this with python-pptx.

### Try It Yourself

```xml
<!-- Paste into a file named Client.xml under
     %APPDATA%\Microsoft\Templates\Document Themes\Theme Colors
     and it appears under Design > Variants > Colors -->
<a:clrScheme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Client 2026">
  <a:dk1><a:srgbClr val="1F1F1F"/></a:dk1>
  <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
  <a:dk2><a:srgbClr val="1B365D"/></a:dk2>
  <a:lt2><a:srgbClr val="F2F2F2"/></a:lt2>
  <a:accent1><a:srgbClr val="B7472A"/></a:accent1>
  <a:accent2><a:srgbClr val="1B365D"/></a:accent2>
  <a:accent3><a:srgbClr val="E8A33D"/></a:accent3>
  <a:accent4><a:srgbClr val="4E8B7C"/></a:accent4>
  <a:accent5><a:srgbClr val="7F7F7F"/></a:accent5>
  <a:accent6><a:srgbClr val="9C2F5A"/></a:accent6>
  <a:hlink><a:srgbClr val="0563C1"/></a:hlink>
  <a:folHlink><a:srgbClr val="954F72"/></a:folHlink>
</a:clrScheme>
```

### Quiz

1. Which theme colour does the first chart series use by default?
- [ ] Dark 2
- [x] Accent 1
- [ ] Hyperlink
> Series follow Accent 1 to Accent 6 in order, so the accent order is a design decision.

2. In theme XML, what does `+mn-lt` refer to?
- [ ] The minimum font size
- [x] The theme body (minor) font
- [ ] A hidden font
> `+mj-lt` is the heading (major) font; `+mn-lt` is the body (minor) font.

3. Pasting a slide with "Keep Source Formatting" does what to the destination deck?
- [x] Adds the source slide master to the deck
- [ ] Converts colours to theme colours
- [ ] Nothing beyond the slide
> That is how decks accumulate multiple masters and grow in size.

### Exercises

1. **Build a brand palette** — Given brand colours navy #1B365D and rust #B7472A, assign all twelve slots sensibly.
<details><summary>Solution</summary>

Dark 1 #1F1F1F (text), Light 1 #FFFFFF, Dark 2 #1B365D (navy, for section headers), Light 2 #F2F2F2, Accent 1 #B7472A (rust, primary), Accent 2 #1B365D (navy, contrast), Accent 3–6 supporting colours (amber, teal, grey, plum) that are distinguishable in a chart legend, Hyperlink #0563C1, Followed #954F72. Save as "Client 2026".

</details>

2. **Find hard-coded colours** — Describe a two-minute test for a 40-slide deck.
<details><summary>Solution</summary>

Design > Variants > Colors > Customize Colors, set Accent 1 to bright green, OK. View > Slide Sorter at 66% zoom: every object that stayed rust is hard-coded. Note the slide numbers, Ctrl+Z to restore the palette, then fix those objects by choosing the Theme Colors block.

</details>

### Interview Questions

**Q: A client wants their deck suite rebranded from blue to green next quarter. How do you prepare for that today?**
By making sure every colour in the template is a theme colour or a tint of one, every font is the theme heading or body font, and every chart uses the default series colours. Then rebranding is Customize Colors and Customize Fonts on the master, followed by Save Current Theme, and applying that theme to each existing deck. I would also keep the logo on the master as a single SVG so swapping it is one edit. The trade-off is that theme colours limit designers to twelve slots plus tints, so occasionally a data visualisation needs a hard-coded colour; I document those exceptions in the template guide.

**Q: What is the difference between a theme, a template and a master?**
A theme is the colours, fonts and effects (and can be saved as .thmx and applied in Word and Excel too). A master is the top-level slide design inside a presentation with its layouts. A template (.potx) is a file that packages one or more masters, their layouts, the theme and optionally sample slides, and that creates a new presentation when opened. Interviewers like to hear that a deck can contain several masters, each with its own theme, and that this is usually a defect rather than a feature.

**Q: Why should Accent 1 and Accent 2 contrast strongly?**
Because they are the first two chart series colours and the first two SmartArt colours, and a two-series clustered column chart with similar accents is unreadable in greyscale printing and for colour-blind readers. I choose Accent 1 and 2 with a luminance difference as well as a hue difference, then check the chart with Windows' greyscale filter or PowerPoint's View > Grayscale.

## Slide master & layouts

The **slide master** is the parent of every slide. It holds the background, the theme, the default placeholder formatting and the footer objects; beneath it sit the **layouts** (Title Slide, Title and Content, Two Content, and any you create), and every slide in the deck is an instance of one layout. Edit the master once and hundreds of slides update. This is the mechanism behind every professional template.

### Entering Slide Master view

**View > Slide Master** opens a new ribbon tab. The thumbnail pane now shows the master (the large thumbnail at the top) with its layouts indented beneath it. Hover a layout to see which slides use it ("used by slides 3-7"). Click **Close Master View** to return.

```text
Slide Master tab
  Insert Slide Master   adds a second master (rarely what you want)
  Insert Layout         adds a blank layout under the current master
  Insert Placeholder    Content, Text, Picture, Chart, Table, SmartArt, Media, Online Image
  Rename                names the layout as it appears under Home > Layout
  Preserve              stops PowerPoint deleting an unused master
  Master Layout         toggles Title, Text, Date, Slide Number, Footer on the master
  Background > Hide Background Graphics   per layout, hides master decorations
  Slide Size            same as Design > Slide Size
```

### Inheritance: master > layout > slide

Formatting cascades downward. If the master's title is 36 pt Segoe UI Semibold in Dark 2, every layout title inherits that, and every slide inherits from its layout. A layout can override (a Section Header layout may have a 48 pt white title on a navy background), and a slide can override again with direct formatting. **Home > Reset** on a slide strips the slide-level overrides and returns it to its layout. That is why Reset sometimes "changes everything": the slide had been hand-formatted.

Objects placed on the master itself (a logo, a footer rule) appear on every layout unless that layout has **Hide Background Graphics** ticked. Objects placed on a layout appear only on slides that use that layout. Neither can be selected from a normal slide, which is exactly the protection a template needs.

### Building a layout properly

1. In Slide Master view, select the master and set the title and body styles once: font sizes for all five bullet levels, bullet characters, paragraph spacing, text colour.
2. Insert Layout, Rename it ("KPI 4-up", "Chart + commentary", "Section divider").
3. Insert Placeholder for each region. Use a **Content** placeholder where the user may put text, a table, a chart or a picture; use a **Picture** placeholder when only an image is allowed (it crops to fit automatically); use a **Text** placeholder for a caption.
4. Type prompt text into each placeholder: "Add commentary (max 3 bullets)". Prompt text is only visible when empty, so it is free documentation.
5. Position placeholders with exact sizes (Shape Format > Size) on the guide grid from the Beginner level.

```text
Layout: "Chart + commentary"
  Title placeholder      x 0.5  y 0.35  w 12.33  h 0.9
  Chart placeholder      x 0.5  y 1.5   w 8.0    h 5.2
  Text placeholder       x 8.8  y 1.5   w 4.03   h 5.2   prompt: "Key message (1-3 bullets)"
  Footer / slide number  inherited from master
```

### Footers, dates and slide numbers

The three small placeholders at the bottom of the master (Date, Footer, Slide Number) only appear on slides after **Insert > Header & Footer > Apply to All**. Untick "Don't show on title slide" if the title also needs them. Their content is per-deck text; their position and style come from the master.

### Multiple masters and cleaning up

A deck can hold several masters, and PowerPoint adds one every time someone pastes with Keep Source Formatting. In Slide Master view, unused masters show no "used by" tooltip and can be deleted. **Preserve** protects a master you intend to keep even if no slide uses it yet (essential in a .potx that ships with an empty deck). Most templates should have exactly one master and eight to fifteen layouts; more than twenty layouts and users stop reading the list.

> **Tip:** Copy layouts between templates by copying them in Slide Master view of one deck and pasting under the master of the other. Use Destination Theme keeps the target colours; this is how you migrate a good "KPI 4-up" layout into every client template.

### Try It Yourself

```text
1. View > Slide Master. Click the large master thumbnail.
2. Set the title to 32 pt, the body Level 1 to 20 pt, Level 2 to 18 pt.
3. Insert Layout > Rename: "KPI 4-up".
4. Insert Placeholder > Text, four times; size each 2.9 x 1.6 in, positions 0.5 / 3.6 / 6.7 / 9.8 in.
5. Type prompt text "KPI value" in each. Insert Placeholder > Text below each for the label.
6. Close Master View. Home > New Slide > KPI 4-up. Type four numbers.
7. Insert > Header & Footer > Slide number > Apply to All.
```

### Quiz

1. An object placed on the slide master appears on:
- [x] Every layout unless Hide Background Graphics is ticked on that layout
- [ ] Only the Title Slide layout
- [ ] Only slides you paste it to
> Master objects cascade to all layouts; layouts can opt out.

2. What does Home > Reset do to a slide?
- [ ] Deletes its content
- [x] Removes slide-level formatting overrides and restores the layout's positions and styles
- [ ] Changes its layout to Title and Content
> Reset returns the slide to its layout definition while keeping the text.

3. Which placeholder type crops an inserted image to fit automatically?
- [ ] Content
- [x] Picture
- [ ] Text
> A Picture placeholder fills its frame and crops; a Content placeholder inserts the image at its own aspect ratio.

### Exercises

1. **Section divider layout** — Create a layout with a full-bleed navy background, a 44 pt white title and no footer.
<details><summary>Solution</summary>

Slide Master > Insert Layout > Rename "Section divider". Background > Format Background > Solid fill > Dark 2, tick Hide Background Graphics. Select the title placeholder, set 44 pt, font colour Light 1, position at the lower left. Slide Master > Master Layout (for the layout) and untick Footers so no footer placeholders appear.

</details>

2. **Layout audit** — A deck has 14 slides using 9 different layouts including three named "Custom Layout". Fix it.
<details><summary>Solution</summary>

In Slide Master view, hover each layout to see usage. Rename the three custom layouts by purpose or, if they duplicate a standard one, select each slide using them and Home > Layout to the standard one, then delete the empty layouts. Preserve the master. Final state: one master, the layouts actually used, all named.

</details>

### Interview Questions

**Q: Explain the inheritance chain in PowerPoint and how it affects a rebrand.**
Theme defines colours and fonts; the master applies them to default placeholder styles and holds shared objects; layouts inherit from the master and position placeholders for a purpose; slides inherit from layouts and hold content. A rebrand ideally touches only the theme and the master, and cascades down. It fails wherever a slide has direct formatting or a text box, so a rebrand estimate depends on how much of the deck breaks the chain, which I measure by selecting all slides and pressing Reset on a copy to see what changes.

**Q: How many layouts should a corporate template have, and how do you decide?**
Enough that nobody needs to hand-build a slide, few enough that the list is readable: typically ten to fifteen. I derive them from the last 100 slides the team actually produced: title, section divider, agenda, one-column, two-column, chart with commentary, KPI cards, table, image with caption, quote, closing. Each gets a descriptive name and prompt text. I resist one-off layouts; if a layout is used on one slide in a year, it does not belong in the template.

**Q: A slide's footer shows on some slides and not others. Why, and how do you fix it?**
Footer placeholders only render on slides where Header & Footer has been applied, and each layout can include or exclude the footer placeholders. Slides pasted from another deck bring their own setting. I open Insert > Header & Footer, tick Slide number and Footer, click Apply to All, then check in Slide Master view that every layout has the footer placeholders enabled under Master Layout. If a layout intentionally omits them (section dividers), I document that in the template guide.

## Tables

Tables carry the numbers in a status report, a rate comparison or a QA scorecard. PowerPoint tables are simpler than Word's or Excel's, but with a few settings they look sharp and stay readable from the back of a room.

### Creating a table

**Insert > Table** offers a grid picker (drag to 6 × 4 for six columns and four rows), **Insert Table** for typing counts, **Draw Table** for irregular grids and **Excel Spreadsheet** for an embedded worksheet. In a Content placeholder, the table icon in the middle does the same. Two ribbon tabs appear when a table is selected: **Table Design** (styles, shading, borders, effects) and **Layout** (rows, columns, merge, size, alignment, text direction).

Tab moves to the next cell and adds a row at the end; Shift+Tab goes back; Enter starts a new paragraph inside the cell (it does not add a row).

### Table styles and the banding checkboxes

Table Design starts with the checkboxes **Header Row, Total Row, Banded Rows, First Column, Last Column, Banded Columns**. These decide which parts of the chosen style are applied. For a management deck the usual setting is Header Row + Banded Rows only. The style gallery is generated from the theme colours: "Medium Style 2 – Accent 1" gives a brand-coloured header with light banding and changes with the theme.

To make your own style permanent, format one table exactly, then right-click it > **Set as Default** is not available for tables; instead keep a formatted table on a hidden "library" slide in the template and copy it, or build the table style into a layout's sample content.

### Sizing and alignment

- **Layout > Table Size** sets exact width and height; drag the column borders for individual widths, or **Distribute Columns** / **Distribute Rows** for equal ones.
- **Layout > Cell Margins** (Normal, None, Narrow, Wide) controls internal padding; Narrow (0.05 in) fits more without looking cramped.
- **Layout > Alignment**: numbers right-aligned, text left-aligned, headers matching their column. **Center Vertically** on all cells fixes the "text stuck at the top" look.
- Font size: 14 pt minimum for projection, 11 pt for a printed one-pager. If the numbers do not fit at 14 pt, the table has too many columns for a slide.

```text
Layout tab
  Delete / Insert Above / Insert Below / Insert Left / Insert Right
  Merge Cells / Split Cells
  Height, Width, Distribute Rows, Distribute Columns
  Align Left/Center/Right, Align Top/Center/Bottom, Text Direction, Cell Margins
  Table Size: Width, Height, Lock Aspect Ratio
```

### Borders and shading

Table Design > **Borders** applies to the selected cells; pick the pen weight and colour first (Draw Borders group), then choose Inside Horizontal Border, for example. A clean production standard is: no vertical borders, a 1 pt Accent 1 line under the header, 0.5 pt Light 2 lines between body rows, no outer border. **Shading** colours the selection; use Light 2 for a totals row.

### Pasting from Excel

Copy a range in Excel and paste into PowerPoint. The paste options are:

| Option | Result |
|---|---|
| Use Destination Styles | A native PowerPoint table using the theme; best for most cases |
| Keep Source Formatting | A native table with Excel's colours and fonts |
| Embed | An Excel object; double-click to edit in Excel inside the slide |
| Picture | A static image; small and safe, not editable |
| Keep Text Only | Tab-separated text |

**Paste Special > Paste Link** (Microsoft Excel Worksheet Object) creates a **linked** table that updates from the workbook via File > Info > Edit Links to Files. Linked objects break if the workbook moves, so use them only when the deck and workbook live together, for example a weekly status report in one SharePoint folder.

> **Warning:** Native PowerPoint tables cannot calculate. If the totals must be right every week, calculate in Excel and paste values, or embed the worksheet. Do not retype numbers into a slide.

### Making a table readable

Highlight the row that carries the message (shade it Light 2 or bold it), remove decimals that do not matter (rate matrices are usually shown to two decimals, counts to none), align decimal points by right-aligning, and put units in the header ("Files closed (n)", "Premium (USD)") not in every cell. If the table has more than eight rows, consider a chart or a two-slide split.

### Try It Yourself

```text
1. Insert > Table > 4 columns x 6 rows.
2. Header: State | Files | Closed | Closed %  (type it; Tab moves cells).
3. Table Design: tick Header Row and Banded Rows only; choose Medium Style 2 - Accent 1.
4. Layout > Cell Margins > Narrow; select all, Center Vertically; select columns 2-4, Align Right.
5. Borders: pen 1 pt Accent 1, select header row, Borders > Bottom Border.
6. Copy a 4x6 range from Excel and paste with Use Destination Styles to compare.
```

### Quiz

1. Which paste option produces a PowerPoint-native table that follows the theme?
- [x] Use Destination Styles
- [ ] Picture
- [ ] Embed
> Destination Styles converts the cells into a PowerPoint table using theme fonts and colours.

2. Pressing Enter inside a table cell:
- [ ] Adds a new row
- [x] Starts a new paragraph in that cell
- [ ] Moves to the next cell
> Tab moves cells and adds a row at the end; Enter stays inside the cell.

3. Where do the colours in the Table Styles gallery come from?
- [ ] They are fixed
- [x] The theme colours (Accents and Light/Dark 2)
- [ ] The last table you formatted
> Styles are generated from the theme, so rebranding recolours tables automatically.

### Exercises

1. **Rate comparison table** — Build a five-row table comparing basic, extended and simultaneous-issue premiums for three loan amounts, styled for projection.
<details><summary>Solution</summary>

Insert Table 4 x 4 (header + three rows). Header: Loan amount | Basic | Extended | Simultaneous. Right-align the three numeric columns, format values to two decimals in Excel before pasting, 16 pt text, Header Row + Banded Rows, no vertical borders, 1 pt Accent 1 bottom border on the header. Shade the row for the most common loan amount in Light 2.

</details>

2. **Linked weekly table** — Set up a status-report slide whose table updates from Excel each Friday.
<details><summary>Solution</summary>

Keep the workbook and deck in the same SharePoint folder. In Excel copy the report range; in PowerPoint Home > Paste arrow > Paste Special > Paste link > Microsoft Excel Worksheet Object. Each week, File > Info > Edit Links to Files > Update Now, or accept the prompt on opening. Before sending, Break Link on a copy so the recipient does not get a security prompt.

</details>

### Interview Questions

**Q: When do you use a native table, an embedded worksheet or a picture of a table in a deck?**
Native when the numbers are final and the table must follow the brand and be editable by the client. Embedded when the recipient needs to change inputs and see totals recalculate, accepting a larger file and a security prompt. Picture when the table is a snapshot from a system I do not control, or when the deck goes to a client whose PowerPoint version renders tables differently. In a weekly status report I usually go native with values pasted from Excel, because linked objects break the moment someone moves the workbook.

**Q: A table with 14 columns does not fit on a slide. What do you do?**
First I ask what the slide is for; a 14-column table is usually reference material and belongs in an appendix or the notes, with the slide showing only the three columns that support the message. If all columns are genuinely needed, I split into two slides with the key column repeated, or rotate the header text, reduce cell margins to Narrow and use 12 pt, but only for a printed handout. I never go below 11 pt on a slide that will be projected.

**Q: How do you keep tables consistent across a 30-slide report?**
By building one table exactly right on a hidden library slide in the template and duplicating it, and by fixing the table style checkboxes and cell margins as a written standard. Because Table Styles derive from the theme, colours stay consistent; the variables are column widths and alignment, which I set with Distribute Columns and a rule of "numbers right, text left, headers match their column". A quick pass in Slide Sorter at 50% zoom catches any outlier.

## Charts (and linking to Excel data)

A chart in PowerPoint is a real Office chart with an embedded or linked Excel workbook behind it. That means it respects the theme, can be edited in Excel and can be updated from the source data every week. It also means there are three ways to create one, and the choice matters.

### Three ways to get a chart onto a slide

| Method | How | Data lives | Best for |
|---|---|---|---|
| Insert > Chart | Pick a type; a small Excel window opens | Embedded in the deck | One-off charts, small data |
| Copy from Excel, paste | Paste options: Use Destination Theme & Embed Workbook (default), Keep Source Formatting & Embed, Use Destination Theme & **Link** Data, Keep Source & Link, Picture | Embedded copy or linked | Charts already built in Excel |
| Paste Special > Paste Link (Excel Chart Object) | OLE object | Linked | Legacy, avoid |

**Use Destination Theme & Link Data** is the one for a recurring report: the chart takes the deck's colours and fonts, and its data comes from the workbook. Refresh via **Chart Design > Refresh Data** or File > Info > Edit Links to Files. The link stores the full path, so keep the workbook and deck together and never rename the sheet.

### Editing data

Select the chart, **Chart Design > Edit Data** (small grid) or **Edit Data in Excel** (full Excel). **Select Data** lets you switch rows and columns, add series or set how empty cells are shown (gaps, zero, connect). For an embedded chart the workbook is inside the .pptx; for a linked chart the same command opens the external file.

### The parts you actually format

Click the plus sign next to a selected chart (**Chart Elements**) to toggle Axes, Axis Titles, Chart Title, Data Labels, Data Table, Error Bars, Gridlines, Legend, Trendline. For most management charts the standard is:

```text
Chart title       off (the slide title states the message)
Legend            off if one series; else top or right, never inside the plot
Gridlines         major horizontal only, Light 2 colour, 0.5 pt
Axis              hide the vertical axis when data labels are shown
Data labels       on, number format "#,##0" or "0.0%", positioned Outside End
Series colours    Accent 1 for the series that matters, Light 2 (grey) for context
Gap width         50-80% for column charts (Format Data Series > Series Options)
```

Number formats come from the Format pane: Format Axis > Number, or Format Data Labels > Number, with Category = Custom and a code such as `#,##0` or `0.0%;-0.0%;"-"`. Untick "Linked to source" if the format should not follow Excel.

### Choosing the chart type

- **Clustered column / bar**: compare categories (files by state). Bar when labels are long.
- **Line**: change over time (weekly closed files). One line per series, at most four.
- **Stacked column**: composition per period, but only when totals matter more than parts.
- **Pie / doughnut**: parts of a whole with at most four slices; a bar chart is usually better.
- **Combo** (Chart Design > Change Chart Type > Combo): columns for volume, line on the secondary axis for a rate, such as files processed and error rate per week.
- **Waterfall, funnel, treemap, sunburst** exist since PowerPoint 2016; they cannot be linked to older versions.

### Chart templates

Once a chart is formatted, right-click > **Save as Template** writes a `.crtx` under `%APPDATA%\Microsoft\Templates\Charts`. Apply it with Chart Design > Change Chart Type > Templates. Chart templates store formatting and colours as theme references when you used theme colours, so they follow the brand.

### Chart placeholders in a layout

On a layout, **Insert Placeholder > Chart** creates a region sized for a chart; users click the icon and get the right size every time. Combine this with the "Chart + commentary" layout from the previous chapter.

> **Interview note:** The classic question is "linked or embedded?". Embedded is portable but stale; linked is current but fragile. Say which one you chose on a real report and why. For a weekly status deck stored beside its workbook on SharePoint, linked; for a deck emailed to a client, embedded or picture.

### Try It Yourself

```excel
// In Excel, build this table and a clustered column chart from it,
// then copy the chart and paste into PowerPoint with
// "Use Destination Theme & Link Data".
State     | Received | Closed
Texas     | 412      | 388
Florida   | 296      | 271
Arizona   | 181      | 175
Colorado  | 94       | 93
// Data labels number format:  #,##0
// Closed % (add as a third column for a combo chart): =C2/B2  formatted 0.0%
```

### Quiz

1. Which paste option keeps a chart current with its Excel source while using the deck's colours?
- [ ] Keep Source Formatting & Embed Workbook
- [x] Use Destination Theme & Link Data
- [ ] Picture
> "Link Data" points to the external workbook; "Use Destination Theme" applies the deck theme.

2. Where are chart templates (.crtx) stored?
- [x] %APPDATA%\Microsoft\Templates\Charts
- [ ] Inside the .pptx
- [ ] Documents\Custom Office Templates
> Chart templates are per-user files, separate from the presentation.

3. Which chart type is appropriate for files processed (count) and error rate (%) per week on one chart?
- [ ] Pie
- [x] Combo with a secondary axis
- [ ] Stacked column
> A combo chart puts counts as columns and the rate as a line on a secondary axis.

### Exercises

1. **Highlight one bar** — Make a column chart where only Texas is in Accent 1 and the others are grey.
<details><summary>Solution</summary>

Click the series once (selects all columns), click the Texas column again (selects one point), Format Data Point > Fill > Solid > Light 2 Darker 25% for the others, or simpler: set the series fill to grey, then select the Texas point and set it to Accent 1. Add data labels, remove the vertical axis and gridlines.

</details>

2. **Repair a broken link** — A linked chart shows "Linked file not available". Fix it without recreating the chart.
<details><summary>Solution</summary>

File > Info > Edit Links to Files, select the link, Change Source, browse to the moved workbook, Update Now. If the workbook is permanently gone, Break Link keeps the last values as an embedded chart. Then move both files into one folder and re-link so it does not recur.

</details>

### Interview Questions

**Q: Walk me through building a weekly status chart that updates without manual work.**
The data lives in an Excel table on SharePoint that the team already maintains; a PivotChart or a chart on a summary sheet reads that table. I copy the chart into the deck with Use Destination Theme & Link Data, so it inherits brand colours. Each Friday the deck is opened, links update, I glance at Slide Sorter, then export to PDF. The risk is path changes, so both files sit in one folder with a naming convention and nobody renames the sheet. For a client who wants it fully hands-off, I move to Power BI or a python-pptx script that regenerates the deck.

**Q: Why do you remove chart titles and legends so often?**
Because the slide title should state the finding ("Texas closed 94% of files, highest of any state") and the chart is evidence, so a second title is noise. A single-series chart needs no legend, and for multiple series I prefer direct labels at the end of lines. This follows the data-ink principle: every mark should carry information. The exception is a chart that will be reused outside the slide, where I keep a title.

**Q: How do you make chart colours consistent across a 20-chart deck?**
By using theme accents and never hand-picking colours from More Colors. Series 1 is always Accent 1, comparison or prior-period series are always Light 2 Darker 25%, and I save that formatting as a chart template so new charts start correct. If a chart was pasted with Keep Source Formatting I re-paste with Use Destination Theme, because fixing colours by hand does not survive a rebrand.

## SmartArt & diagrams

Process flows, org charts, cycles and hierarchies appear in almost every SOP or training deck. **SmartArt** builds them from a bulleted list and keeps them editable; shapes with connectors give more control. Knowing when to use each saves rework.

### Inserting SmartArt

**Insert > SmartArt** opens a dialog grouped by purpose: List, Process, Cycle, Hierarchy, Relationship, Matrix, Pyramid, Picture. Choose one and a **Text Pane** appears on the left (toggle it with SmartArt Design > Text Pane). Type one line per shape; Tab demotes a line to a sub-item (a second-level shape or a bullet inside the shape depending on the layout), Shift+Tab promotes. Enter adds a shape.

You can also convert existing bullets: select a body placeholder, **Home > Convert to SmartArt**, and pick a layout. This is the quickest way to turn a five-step procedure into a chevron process.

```text
SmartArt Design tab
  Add Shape (After/Before/Above/Below)   Promote / Demote   Right to Left
  Layouts gallery      switch diagram type without retyping
  Change Colors        Colorful (Accents), Colored Fill Accent 1, Gradient...
  SmartArt Styles      flat, subtle, 3-D (use the flat ones)
  Reset Graphic        removes all manual formatting
  Convert > Convert to Text / Convert to Shapes
```

### Which layout for which job

| Need | Layout |
|---|---|
| Steps in order | Basic Process, Chevron Process, Step Down Process |
| Repeating loop (QA cycle: check, log, coach, re-check) | Basic Cycle, Block Cycle |
| Org chart or approval hierarchy | Organization Chart, Hierarchy (Hierarchy layouts support assistants and hanging layouts) |
| Options with icons | Vertical Picture Accent List, Basic Block List |
| Comparing two things | Counterbalance Arrows, Basic Matrix |
| Timeline | Basic Timeline, Circle Accent Timeline |

SmartArt uses the theme's effects and Accent colours. Change Colors > **Colorful – Accent Colors** cycles through accents; **Colored Fill – Accent 1** is the safe branded choice.

### Formatting and its limits

Individual shapes can be formatted (right-click > Format Shape), resized (drag a handle) or given a different shape (SmartArt Format > Change Shape). Text sizes auto-scale to the smallest shape by default; to stop that, select all shapes and set a fixed size in Home > Font Size. Reset Graphic undoes everything.

Limits: SmartArt cannot have connectors that cross in custom ways, cannot mix layouts, and its automatic text scaling can produce 9 pt labels. When you hit those walls, **Convert to Shapes** turns the diagram into ordinary grouped shapes you can edit freely; there is no way back except Undo.

### Drawing diagrams with shapes and connectors

For a flowchart with decisions and loops, use shapes directly. Insert > Shapes > Flowchart has Process (rectangle), Decision (diamond), Terminator (rounded), Document, Data and more. Then use **Lines > Elbow Connector** (or Straight Arrow Connector): when you hover over a shape, green connection points appear; drag from one point to another shape's point and the line stays attached when shapes move. Right-click a connector for **Straight / Elbow / Curved** and **Reroute Connectors**.

Standard for an SOP flowchart:

```text
Shapes    Process 2.2 x 0.8 in, Decision 1.6 x 1.0 in, 14 pt text, No Outline, Accent 1 fill (process) / Accent 3 fill (decision)
Lines     Elbow connectors, 1 pt, Dark 1, arrow end; label Yes/No with a small text box
Spacing   0.4 in between shapes; Align + Distribute per row
Flow      left to right or top to bottom, never both; loops go back on the right side
```

### Icons and SmartArt pictures

Picture layouts (e.g. Vertical Picture Accent List) have picture frames that accept Insert > Icons or photos; click the icon symbol inside the frame. This gives a consistent icon-plus-text list in seconds.

> **Tip:** SmartArt is accessible by default because the text remains real text in reading order. A diagram converted to shapes needs alt text on the group and a sensible order in the Selection Pane.

### Try It Yourself

```text
1. Insert > SmartArt > Process > Chevron Process.
2. In the Text Pane type: Receive order | Title search | Examine | Commit | Close.
3. SmartArt Design > Change Colors > Colored Fill - Accent 1; SmartArt Styles > Simple Fill.
4. Select all shapes (click the border, Ctrl+A) and set 16 pt.
5. Duplicate the slide; on the copy SmartArt Design > Convert > Convert to Shapes and drag one chevron: notice it is now free.
6. Insert > Shapes > Flowchart: Decision; connect to a Process box with an Elbow Connector.
```

### Quiz

1. Which command turns an existing bulleted list into a diagram?
- [ ] Insert > Shapes
- [x] Home > Convert to SmartArt
- [ ] Insert > Icons
> Convert to SmartArt reads the bullet levels as shapes and sub-shapes.

2. After Convert to Shapes, can you return to SmartArt editing?
- [ ] Yes, via SmartArt Design
- [x] No, only by Undo
- [ ] Yes, via Reset Graphic
> Convert to Shapes is one-way; keep a copy of the SmartArt slide.

3. Why use connectors rather than plain lines in a flowchart?
- [x] They stay attached when shapes move
- [ ] They are thinner
- [ ] They print better
> Connectors glue to connection points; lines have to be redrawn after every move.

### Exercises

1. **QA cycle** — Build a four-stage cycle diagram (Sample calls, Score, Coach, Re-sample) in brand colours with 16 pt text.
<details><summary>Solution</summary>

Insert > SmartArt > Cycle > Basic Cycle; type the four items in the Text Pane; Change Colors > Colored Fill – Accent 1; SmartArt Styles > Simple Fill; select all shapes and set 16 pt. Optionally add an icon in each via Insert > Icons and align with the Selection Pane.

</details>

2. **Decision flowchart** — Draw a title-order flow with one decision ("Liens found?") and a loop back to "Examine".
<details><summary>Solution</summary>

Use Flowchart shapes: Terminator (Start) > Process (Receive order) > Process (Title search) > Process (Examine) > Decision (Liens found?) with Yes going to Process (Clear liens) which loops back to Examine via an elbow connector on the right side, and No going to Process (Commit) > Terminator (Close). Set one process shape as default before drawing the rest.

</details>

### Interview Questions

**Q: SmartArt or shapes for a 12-step SOP process? Justify.**
SmartArt for the first draft, because it is built from the SOP's own numbered list in seconds, stays editable and accessible, and follows the theme. But twelve chevrons on one slide produce unreadable text, so I would split into three slides of four steps with a small "steps 1-4 of 12" indicator, or convert to shapes on a single overview slide and add detail slides. If the process has decisions or loops, SmartArt cannot express them and I go straight to flowchart shapes with connectors.

**Q: A client's org chart in SmartArt has 60 boxes and 8 pt text. What do you propose?**
That the slide is being asked to do a document's job. I propose a top-level chart with the first two levels on one slide, then one slide per department, using the Organization Chart layout's Hanging Layout for teams to save width. If they insist on one page, I produce it as an A3 PDF from a custom slide size rather than shrinking the text, and I also offer an Excel or Visio source that generates the chart from a list so it stays current.

**Q: What breaks when you convert SmartArt to shapes, and when is it worth it?**
You lose the Text Pane, automatic layout, Add Shape and Change Layout; the result is a group of freeform shapes and text boxes. Accessibility also suffers because the reading order becomes the z-order. It is worth it when the design needs something SmartArt cannot do: unequal shape sizes, custom connectors, a Morph transition between states, or mixing a diagram with a chart. I always keep the original SmartArt slide hidden as a source.

## Transitions & animations (restraint)

Motion draws the eye, which is exactly why most decks use too much of it. Used with restraint, a transition signals a change of section and an animation reveals one idea at a time. This chapter shows how to set them up, keep them consistent and avoid the effects that make a professional audience wince.

### Transitions

A **transition** happens between slides. Select slides in the thumbnail pane, choose one on the **Transitions** tab, set **Effect Options**, **Duration** and **Sound** (never), and click **Apply To All** if it should be the deck standard.

```text
Recommended
  None or Fade (0.5 s)      for every ordinary slide
  Push or Wipe (0.5 s)      between sections only, applied to section-divider slides
  Morph (0.75-1 s)          for before/after or zoom-in effects between two similar slides
Avoid
  Vortex, Honeycomb, Origami, Airplane, Curtains   (Exciting group) in business decks
  Sounds of any kind
  Different transitions on different slides
```

**Advance Slide** on the same tab controls whether the slide moves on click, after a timer, or both; timed advance is for kiosk and video exports.

### Morph

**Morph** (PowerPoint 2019 and Microsoft 365) animates the difference between two consecutive slides: duplicate a slide, move, resize or recolour objects on the copy, apply Morph to the second slide, and PowerPoint tweens the objects. It matches objects by identity when the slide was duplicated; for objects that were created separately, name them in the Selection Pane with the same name prefixed by two exclamation marks (`!!Card1` on both slides) and Morph pairs them. Effect Options offers Objects, Words or Characters. Morph is the one flashy effect that reads as sophisticated: zooming into a region of a process diagram, or moving a highlighted bar in a chart.

### Animations

An **animation** happens to an object on a slide. Select the object, pick an effect on the **Animations** tab, then open the **Animation Pane** to see the sequence.

| Type | Colour in gallery | Use |
|---|---|---|
| Entrance | Green | Appear, Fade, Wipe: reveal bullets or shapes one at a time |
| Emphasis | Yellow | Grow/Shrink, Color Pulse: draw attention to one item |
| Exit | Red | Fade out an item that is no longer relevant |
| Motion Paths | Lines | Move an object along a path, rarely needed |

Settings that matter: **Start** (On Click, With Previous, After Previous), **Duration** (0.3-0.5 s for Fade), **Delay**, and **Effect Options** (By Paragraph for bullets, By Series or By Category for charts). **Add Animation** stacks a second effect on the same object; clicking a gallery effect again *replaces* it, which is a common surprise.

```text
Standard build for a bullet list
  Select body placeholder > Animations > Fade
  Effect Options > By Paragraph
  Start: On Click, Duration 0.5 s
  Animation Pane > expand > check each paragraph is a separate step
Standard chart build
  Select chart > Wipe (From Bottom) > Effect Options > By Category
```

**Animation Painter** (Animations tab) copies the animation set from one object to another, like Format Painter; double-click to paint several. **Triggers** start an animation when another object is clicked (interactive "reveal answer" slides). **Reorder** by dragging in the pane.

### Restraint rules that professionals follow

1. One transition for the deck, one for section dividers, nothing else.
2. Animate to control pacing (reveal bullets as you speak) or to explain (build a diagram), never to decorate.
3. Every animation is Fade or Appear unless there is a stated reason.
4. Nothing longer than one second.
5. No animation on slides that will be sent as PDF, or duplicate the slide for the PDF version.
6. Test in Slide Show, not in the editor; timing feels different.

> **Warning:** Animations survive Slides from Outline and Reuse Slides but not PDF export, and they are flattened in Google Slides and older PowerPoint viewers. Ask where the deck will be shown before adding any.

### Timing and rehearsal

**Slide Show > Rehearse Timings** records how long you spend per slide and offers to keep the timings as automatic advance; **Slide Show > Set Up Slide Show** chooses Manually or Using timings, if present, and **Browsed at a kiosk** for looping displays. **Record** (Record tab) captures narration and timings for video export, covered at the Expert level.

### Try It Yourself

```text
1. Select all slides, Transitions > Fade, Duration 0.5, Apply To All.
2. Select the section-divider slides only, Transitions > Push, Effect Options > From Right.
3. On a bullet slide: select the body, Animations > Fade, Effect Options > By Paragraph.
4. Animations > Animation Pane; confirm each bullet is its own On Click step.
5. Duplicate a slide with a chart; enlarge the chart on the copy; apply Transitions > Morph to the copy.
6. Shift+F5 to test; Esc.
```

### Quiz

1. Clicking a second effect in the Animations gallery on an already-animated object:
- [x] Replaces the existing animation
- [ ] Adds a second animation
- [ ] Removes all animations
> Use Add Animation to stack effects; the gallery replaces.

2. How does Morph pair objects that were not duplicated from the same slide?
- [ ] By position
- [x] By identical names starting with `!!` in the Selection Pane
- [ ] It cannot
> The `!!name` convention forces matching across slides.

3. Which Effect Option reveals chart bars group by group?
- [ ] By Paragraph
- [x] By Category
- [ ] As One Object
> By Category animates each category's bars together; By Series animates each series.

### Exercises

1. **Deck-wide standard** — Apply a consistent, restrained transition scheme and a bullet build to a 10-slide deck.
<details><summary>Solution</summary>

Ctrl+A in the thumbnail pane, Transitions > Fade, 0.5 s, Apply To All. Select the divider slides (Ctrl+click), Transitions > Push. On each bullet slide select the body and apply Fade, By Paragraph; use Animation Painter to copy it to the other bullet slides. Check the Animation Pane on two slides and run Shift+F5.

</details>

2. **Before/after with Morph** — Show a cluttered slide becoming a clean one.
<details><summary>Solution</summary>

Build the cluttered version, Ctrl+D the slide, on the copy delete the noise objects and move the remaining ones to their final positions and sizes. Apply Transitions > Morph to the copy, Duration 1 s. Deleted objects fade out and surviving objects glide, because Morph recognises them as the same objects from the duplicate.

</details>

### Interview Questions

**Q: What is your policy on animations in a management deck?**
Fade only, and only where it controls pacing or explains a build. A management audience reads a slide in three seconds and any movement after that competes with the speaker. I set one Fade transition for the deck and a Push for section dividers, and I remove every animation from a deck that will be sent as a PDF or read without a presenter. The exception is Morph for a before/after or a zoom into a diagram, which explains something that a static slide cannot.

**Q: Explain how Morph decides what to animate.**
It compares consecutive slides and, for objects it recognises as the same (same object copied via duplicate, or same `!!name` in the Selection Pane), it interpolates position, size, rotation, colour and, with the Words or Characters option, text. Objects present only on the first slide fade out; objects only on the second fade in. That is why I duplicate the slide rather than rebuilding it, and why I name objects during construction.

**Q: Why might animations appear to be missing on the client's screen?**
The client may be viewing a PDF, Google Slides, PowerPoint for the web with some effects unsupported, or an older PowerPoint without Morph (pre-2019 shows a Fade instead). Hardware graphics acceleration being disabled also removes some effects. I ask about the viewing environment before designing, and I keep animations to Fade and Appear, which work everywhere.

# LEVEL: Advanced

## Building a branded .potx template

A template is a product, not a file. When a Fiverr client orders "a PowerPoint template for our 43 product toolkits", they are buying a system that lets their staff produce 43 consistent cover slides and hundreds of content slides without a designer. This chapter walks through building that system as a `.potx`, using the same discipline as a `.dotx` suite in Word.

### Gather the brand inputs first

Before opening PowerPoint, collect: logo files (SVG or high-resolution PNG with transparency, in colour and reversed-out white), brand colours as hex values, brand fonts and their licence status, a sample of existing decks (to learn which layouts they really use), and any legal text (confidentiality footer). Check every font on a clean Windows machine; if "Gotham" is the brand font and staff do not have it, agree on a fallback (Segoe UI or Aptos) in writing before you start.

### Step 1: theme and master

1. Blank presentation, Design > Slide Size 16:9.
2. Customize Colors and Customize Fonts (Intermediate level), name them after the client, choose a flat Effects set.
3. View > Slide Master, select the master: set title (Heading font, 30 pt, Dark 2), body levels (20/18/16 pt, spacing After 6 pt, brand bullets), place the logo top-right at exact coordinates, add a 0.5 pt rule above the footer, position Date, Footer and Slide Number placeholders.
4. Add master guides at the margins and content area so they are locked on every slide.

### Step 2: the layouts

Delete the layouts the client will not use, rename the rest by purpose and build the missing ones. For the toolkit-cover pattern the key layout is a **Cover** with a Picture placeholder for the product image, a Title placeholder for the toolkit name, a Text placeholder for the toolkit number ("Toolkit 17 of 43") and a colour band that comes from a theme colour so it can be varied per product family.

```text
Suggested layout set (12)
  Cover                 picture + title + toolkit number + colour band
  Section divider       full Dark 2 background, white title
  Agenda                numbered list, no bullets
  Title and Content     standard
  Two Content           standard
  Chart + commentary    chart placeholder 8 in wide, text 4 in
  KPI 4-up              four text placeholders with labels
  Table                 title + one content placeholder sized for a table
  Image with caption    picture placeholder full-bleed left, caption right
  Quote                 large italic text, attribution
  Closing / contact     logo, address, confidentiality note
  Blank (branded)       only master graphics
```

Each layout gets prompt text in every placeholder ("Product image: 1600×900 px, no text in image"). Do not put sample content on layouts; sample content goes on demo slides.

### Step 3: variants for the 43 covers

The client has product families (say five), each with a colour. Instead of five templates, create one **Cover** layout per family, with the band filled from Accent 2 to Accent 6, named "Cover – Finance", "Cover – HR" and so on. The user picks the layout, drops in the picture and types the title; nothing else is editable. If the client later adds a family, you add a layout, not a template.

For a one-off production job (you produce all 43 covers yourself), you can go further: keep a spreadsheet with toolkit number, title, family and image path, and generate the 43 slides with python-pptx (Expert level) from the template's layouts. Same template, zero hand alignment.

### Step 4: demo slides, hidden library and documentation

Build eight to ten demo slides showing each layout used correctly, plus a hidden **library** slide (right-click > Hide Slide) containing a formatted table, a formatted chart and a formatted process diagram to copy from. Add a final hidden slide with the usage rules. Then delete nothing: a .potx can ship with slides, and File > New creates a copy with them included. Some clients prefer an empty template plus a separate `Examples.pptx`; ask.

### Step 5: save, test and deliver

- File > Options > Save > Embed fonts if any font is non-standard and its licence allows it.
- File > Info > Check for Issues > Inspect Document to remove personal information and off-slide content; Check Accessibility to confirm every layout has a title placeholder and pictures have alt text prompts.
- Save As > PowerPoint Template (*.potx). Also save a `.thmx` (Save Current Theme) for Word and Excel.
- Test on a second machine: File > New > Personal > template, build a slide of every layout, change the theme colours to something absurd and back to confirm nothing is hard-coded.
- Deliver: `Client_Template_v1.0.potx`, `Client_Theme.thmx`, `Client_Examples.pptx`, `Client_Template_Guide.pdf` (two pages: which layout for what, the do-not list), plus the logo assets.

> **Tip:** Version the template in the file name and in the footer of the hidden guide slide ("Template v1.2, 2026-09"). When a rebrand comes, staff and you can tell which decks were built on which version.

### Try It Yourself

```text
Template build checklist (copy into your project notes)
[ ] Slide size 16:9, custom colours + fonts named after the client
[ ] Master: title/body styles, logo at x=12.1 y=0.3 (0.9 in wide), footer rule, guides
[ ] 12 layouts renamed by purpose, prompt text in every placeholder
[ ] Cover layouts per product family, band = theme accent
[ ] Demo slides + hidden library slide + hidden guide slide
[ ] Inspect Document, Check Accessibility, fonts embedded (if licensed)
[ ] Save As .potx to Custom Office Templates; Save Current Theme .thmx
[ ] Tested on a second machine with an absurd palette swap
[ ] Delivered with Examples.pptx and a 2-page PDF guide
```

### Quiz

1. Where should sample content live in a template?
- [ ] On the layouts
- [x] On demo slides or a hidden library slide
- [ ] In the notes of the master
> Layouts hold placeholders and prompt text only; sample content on a layout appears on every slide using it.

2. How do you support five product families with different cover colours?
- [ ] Five separate .potx files
- [x] Five Cover layouts in one template, each using a theme accent
- [ ] Ask users to recolour the band
> One template, multiple layouts keeps the master and rebranding in one place.

3. What does "Hide Slide" achieve in a template?
- [x] The slide is kept but skipped in Slide Show and can be excluded from PDF export
- [ ] The slide is deleted when saving as .potx
- [ ] The slide becomes a layout
> Hidden slides are ideal for a library and usage notes.

### Exercises

1. **Cover layout** — Build the toolkit Cover layout with a Picture placeholder, title, toolkit number and colour band.
<details><summary>Solution</summary>

Slide Master > Insert Layout > Rename "Cover – Finance". Draw a rectangle band at the bottom (full width, 1.2 in high, fill Accent 2, No Outline). Insert Placeholder > Picture sized 13.333 × 5.5 in at the top, prompt "Product image 1600×900". Move the title placeholder into the band, 28 pt, Light 1. Insert Placeholder > Text at the band's right for "Toolkit 00 of 43". Untick Footers for this layout. Duplicate the layout for each family and change the band fill.

</details>

2. **Hard-coded colour hunt** — Prove to a client that the template is fully theme-driven.
<details><summary>Solution</summary>

Open a deck built from the template, Design > Variants > Colors > Customize Colors, set every accent to bright magenta, and export a PDF of Slide Sorter (or screenshots). Every band, chart and shape is magenta. Undo. Include the two screenshots in the guide as evidence, and note the deliberate exceptions if any (e.g. a red/amber/green status legend that must stay fixed).

</details>

### Interview Questions

**Q: Describe how you would deliver a template suite for 43 product toolkits so that non-designers get consistent results.**
I would start by categorising the 43 into families and agreeing the brand inputs, then build one .potx with a master, a Cover layout per family and a dozen content layouts, each with locked positions and prompt text. Staff only choose a layout and fill placeholders, so alignment and colour cannot drift. I would produce the first 43 cover slides myself, ideally generated from a spreadsheet with python-pptx, hand over an Examples deck and a two-page guide, and test on a clean machine. The trade-off is upfront time: a proper template takes two to three days, but it eliminates the per-deck fixes that otherwise arrive as change requests for months.

**Q: A client asks for the template as a .pptx "so it is easier". What do you say?**
I explain the difference: a .pptx opens for editing and staff will overwrite the master file within a week; a .potx opens as a new untitled deck every time and appears under File > New > Personal. I give them both: the .potx as the working template and a .pptx examples deck built from it. If their IT team distributes templates centrally, I also mention the Workgroup Templates path in File > Options > Save, so the .potx appears for everyone.

**Q: What checks do you run before shipping a template?**
Theme colour swap to detect hard-coded colours, Replace Fonts to confirm only theme fonts are present, Check Accessibility for missing titles and alt text, Inspect Document to remove hidden data, open on a second machine without the brand fonts to see fallbacks, a print to PDF of every layout, and a file size check (the .potx should be under 5 MB unless it carries fonts). I also open the .potx as a ZIP to confirm there is exactly one slide master.

## Sections, navigation, notes & presenter view

A deck that is more than fifteen slides needs structure for the presenter as well as the audience. Sections organise the file, hyperlinks and Zoom let the presenter jump, notes hold what is said, handouts are what the audience keeps, and Presenter View ties it together on the day.

### Sections

Right-click between slides in the thumbnail pane, or **Home > Section > Add Section**, and name it. Sections collapse and expand, can be dragged as a unit in Slide Sorter, and can be selected and printed as a range. A production report typically has: Summary, Volume, Quality, Issues, Appendix. Section names appear in Presenter View and in the Section Zoom feature, so name them for the audience, not "Part 2".

```text
Home > Section > Add Section / Rename Section / Remove Section / Remove All Sections / Collapse All / Expand All
Slide Sorter: right-click a section header > Move Section Up/Down
File > Print > Custom Range: type slide numbers such as 3-9 (section names are not accepted); or select the section in Slide Sorter and print Selection
```

### Hyperlinks and action buttons

Select text or a shape, **Insert > Link** (Ctrl+K). Targets: Existing File or Web Page, **Place in This Document** (a specific slide, First/Last/Next/Previous, or a Custom Show), Create New Document, E-mail Address. Links on shapes are better than links on text because the whole shape is clickable and the text colour is not forced to the Hyperlink theme colour.

**Insert > Shapes > Action Buttons** (Home, Back, Forward, Information) and **Insert > Action** attach Mouse Click or Mouse Over actions, including Run Program and Run Macro. An agenda slide with each item linked to its section, plus a small "Home" action button on the master pointing back to the agenda, gives the presenter random access without leaving Slide Show.

### Zoom (Summary, Section, Slide)

**Insert > Zoom** creates live thumbnails that act as links: **Summary Zoom** builds an overview slide with a thumbnail per section and automatically creates sections; **Section Zoom** inserts one section's thumbnail; **Slide Zoom** inserts thumbnails of chosen slides. In Slide Show, clicking a thumbnail zooms into that content and, with **Zoom Tools > Return to Zoom** ticked, comes back afterwards. It is the non-linear navigation that clients ask for in training decks.

### Custom shows

**Slide Show > Custom Slide Show > Custom Shows** defines named subsets of slides ("Executive 10-minute", "Full 45-minute"). Start one via Slide Show > Custom Slide Show, or hyperlink to it. Hidden slides remain hidden in custom shows unless included explicitly.

### Speaker notes

The notes pane under the slide holds speaker notes; **View > Notes Page** shows the printable page and lets you format the notes master (View > Notes Master) with the logo and a smaller slide image. Notes are also where you put the data source, the date the numbers were pulled and any caveats: a reviewer reading the deck a year later needs that more than the presenter does. Notes are exported when you choose Notes Pages in PDF export and when you Create Handouts in Word.

### Handouts

- **File > Print > Full Page Slides dropdown**: Handouts with 1, 2, 3 (with lines for writing), 4, 6 or 9 slides per page; Notes Pages; Outline.
- **File > Export > Create Handouts**: sends slides and notes to a Word document with layouts such as "Notes next to slides", and can paste as links so the Word file updates.
- The **Handout Master** (View > Handout Master) sets the header, footer, date and page number of printed handouts.
- Export > Create PDF/XPS > Options > Publish what: Handouts gives a PDF handout in one step.

### Presenter View

Connect a second display, **Slide Show > Use Presenter View** (Alt+F5 starts it without a second screen, useful for practice). The presenter sees the current slide, the next slide, notes with adjustable text size, a timer, a slide navigator (grid of all slides, sections visible), pen and laser pointer tools, and **See all slides** for jumping. **Blank screen** (B for black, W for white) pauses the audience display. If the wrong screen shows the slides, click **Swap Displays** in Presenter View or set Slide Show > Monitor.

```text
Slide Show keys
  N / Space / Right   next          P / Backspace / Left   previous
  <number> + Enter    go to slide   B / W                  black / white screen
  Ctrl+P              pen           Ctrl+L                 laser pointer
  G                   slide grid    Esc                    end show
```

> **Interview note:** Employers who run client webinars ask about Presenter View in Teams or Zoom. The answer: share the slide window, not the screen, or use PowerPoint Live in Teams, which streams the deck and gives the audience their own navigation while you keep notes.

### Try It Yourself

```text
1. Home > Section > Add Section before slides 1, 4 and 8; name them Summary, Volume, Quality.
2. Insert > Zoom > Summary Zoom; tick the three sections; a new overview slide appears.
3. On the master, Insert > Shapes > Action Buttons > Home, link to the overview slide.
4. Type notes on slide 2 including "Source: Production_2026-09.xlsx, pulled 15 Sep".
5. Slide Show > Custom Slide Show > Custom Shows > New: "Executive", slides 1, 2, 5, 9.
6. Alt+F5 to preview Presenter View; press G to see the grid; Esc.
```

### Quiz

1. Which feature creates an overview slide with clickable thumbnails per section?
- [ ] Slide Zoom
- [x] Summary Zoom
- [ ] Custom Show
> Summary Zoom builds the overview and the sections at once.

2. What is the shortcut to start Presenter View on a single monitor?
- [ ] F5
- [x] Alt+F5
- [ ] Ctrl+F5
> Alt+F5 starts Presenter View without a second display, ideal for rehearsal.

3. Where should the data source and extraction date of a report slide be recorded?
- [ ] In a tiny text box on the slide
- [x] In the speaker notes
- [ ] Nowhere; it is in the file name
> Notes travel with the slide, export to PDF Notes Pages and do not clutter the design.

### Exercises

1. **Navigable training deck** — Build an agenda where each item jumps to its section and every slide has a way back.
<details><summary>Solution</summary>

Create sections. On the agenda slide draw one rounded rectangle per section with the section name, Ctrl+K > Place in This Document > first slide of that section. On the slide master add a small Home action button bottom-left linked to the agenda slide (Insert > Action > Hyperlink to: Slide...). Test in Slide Show; note that master objects are clickable in Slide Show even though they cannot be selected in Normal view.

</details>

2. **Two audiences, one deck** — Deliver a 10-minute executive version and a 45-minute full version without duplicating files.
<details><summary>Solution</summary>

Define two custom shows under Slide Show > Custom Slide Show. For the executive show pick the summary and KPI slides only. Start the required show from the dialog, or set Slide Show > Set Up Slide Show > Custom show. For PDF versions export twice with Options > Range > Custom show.

</details>

### Interview Questions

**Q: How do you structure a 60-slide quarterly report so a manager can find anything in ten seconds?**
Sections with audience-facing names, a Summary Zoom slide up front, a Home action button on the master, and consistent slide titles that state the finding. In Presenter View the section names appear in the grid, and in the PDF export the sections are represented by divider slides. I also keep an appendix section for the detailed tables so the main flow stays short, and I define an executive custom show for the ten-minute version.

**Q: What goes in speaker notes for a data slide, and why?**
The verbal message in one or two sentences, the data source and extraction date, the definition of any metric that could be questioned ("closed = policy issued, not commitment"), and known caveats. Notes make the deck self-explaining for whoever presents it next quarter and are the audit trail when a number is challenged. They also flow into Notes Pages PDFs and Word handouts, so the effort is reused.

**Q: The projector shows Presenter View and the laptop shows the slides. What do you do?**
Click Swap Displays at the top of Presenter View, or press Esc, go to Slide Show > Monitor and pick the projector explicitly, then restart. I also check Windows display settings are set to Extend, not Duplicate, because Duplicate makes Presenter View impossible. Before any client presentation I run Alt+F5 in the room to confirm this.

## Design principles for management decks

Managers do not read slides; they scan them. A management deck therefore has one job per slide, states it in the title, proves it with a single visual and stops. This chapter turns that into rules you can apply and defend, including the data-ink principle that separates a reporting analyst's charts from a marketing department's.

### One message per slide, in the title

The slide title is a full sentence that states the conclusion: "Texas closings rose 12% while error rate fell to 1.8%", not "Texas performance". A reader who only reads titles (most executives) should get the whole story: this is the **action title** or assertion-evidence structure. Test: read every title in Outline view in order; if it does not read like an executive summary, rewrite the titles.

```text
Weak title                      Action title
Q3 Volume                       Q3 volume up 8% on Q2, driven by refinance orders
QA Results                      QA pass rate stable at 96%; two agents below threshold
Timeline                        Phase 2 completes 30 Oct if vendor delivers on 1 Oct
```

Keep titles to two lines at 24-28 pt; if a title needs three lines, the slide has two messages.

### Evidence: one visual, minimal decoration

Below the title, one chart, one table or one diagram, with a short "so what" comment where the eye lands last (bottom or right). Use the "Chart + commentary" layout. Bullets are the fallback, not the default, and never more than four.

### Data-ink ratio

Edward Tufte's rule: maximise the share of ink that carries data and erase the rest. Applied to a PowerPoint chart:

| Remove | Because |
|---|---|
| Chart title, chart border, plot area fill | Redundant with the slide title and background |
| Vertical axis when data labels are shown | The same number twice |
| Vertical gridlines, most horizontal gridlines | They compete with bars and lines |
| 3-D effects, shadows, gradients, bevels | Distort values and add no information |
| Legend for a single series | Nothing to distinguish |
| Decimal places beyond what decisions need | Precision theatre |

Then add back only what aids reading: a light baseline, data labels, direct series labels at the end of lines, one highlighted series in Accent 1 with the rest in grey. A greyed comparison ("last quarter") with a coloured focus ("this quarter") is the most common good pattern.

### Visual hierarchy and white space

Three levels of size and weight are enough: title (28 pt semibold), body/labels (16-18 pt), footnotes (10-12 pt grey). Everything on the grid from the master guides, margins at least 0.5 in, and empty space around the visual rather than a bigger visual. Consistency matters more than any single choice: the same layout for the same kind of slide throughout the deck.

### Colour with a purpose

- Brand colour for the thing you want the audience to look at; grey for everything else.
- Red/amber/green only for status, and always with a second cue (icon or text) for colour-blind readers.
- Never more than four colours on a slide including grey.
- Check the deck in View > Grayscale (View tab > Color/Grayscale) because it will be printed in black and white by someone.

### Tables versus charts

A table when the reader needs exact values or will look up one row (rate matrix); a chart when the reader needs the pattern (trend, ranking, share). A table with ten rows and a coloured "attention" row can beat a chart. A chart with 30 categories is a table in disguise; sort it, show the top eight and an "others" bar.

### Storyline before slides

Write the storyline first as a list of action titles (the **ghost deck**), get it agreed, then build slides. Structure for a status report: situation, what changed, why, what we recommend, what we need. For each slide ask "if this slide were removed, would the argument break?" and delete it if not; move the reference material to the appendix.

> **Tip:** Keep a **so-what box**: a 4 in wide text placeholder on the chart layout with the prompt "What should the reader do with this?" Slides without an answer are the ones to cut.

### Try It Yourself

```text
Slide review checklist (apply to every slide before delivery)
[ ] Title is a full-sentence conclusion, max 2 lines
[ ] One visual; the message is visible in 3 seconds
[ ] Chart: no chart title, no 3-D, no vertical gridlines, labels not axis, focus series coloured, rest grey
[ ] Max 4 bullets, max 4 colours, min 12 pt (footnotes) / 16 pt (body)
[ ] Source + date in notes; units in headers
[ ] Consistent layout with sibling slides; readable in Grayscale view
[ ] Would the argument break without this slide? If not, move to appendix
```

### Quiz

1. What is an "action title"?
- [ ] A title with an animation
- [x] A full-sentence title stating the slide's conclusion
- [ ] A hyperlinked title
> Titles that read as an executive summary in Outline view are the core of a management deck.

2. The data-ink ratio suggests removing:
- [x] Non-data decoration such as 3-D effects and redundant axes
- [ ] All colour
- [ ] Data labels
> Data-ink is ink that carries information; the goal is to erase everything else.

3. When is a table the better choice over a chart?
- [ ] Always for numbers
- [x] When the reader needs exact values or looks up a single row
- [ ] Never in a management deck
> Charts show patterns; tables give values. A rate matrix is a table.

### Exercises

1. **Rewrite titles** — Turn "Agent QA Scores", "Volumes by state" and "Next steps" into action titles for a September production report.
<details><summary>Solution</summary>

"QA pass rate held at 96% in September; two agents need coaching before month-end" / "Texas and Florida delivered 71% of September volume; Arizona grew fastest at +14%" / "We recommend adding one examiner in Texas by 1 October to keep TAT under 48 hours". Each names the finding and, where relevant, the action.

</details>

2. **Chart makeover** — Describe every change you make to a default Excel column chart pasted into a slide.
<details><summary>Solution</summary>

Delete the chart title, legend (single series) and vertical axis; set gridlines to one light major line or none; set gap width to 60%; set the series to Light 2 Darker 25% and the focus bar to Accent 1; add data labels Outside End formatted #,##0; set label font 14 pt Dark 1; add a direct text label if a comparison series exists; write the finding as the slide title and one sentence of commentary in the so-what box.

</details>

### Interview Questions

**Q: How do you decide what goes on a slide and what goes in the appendix?**
The deck's storyline is a chain of action titles; a slide stays in the main flow only if removing it breaks the chain. Detail that supports but does not advance the argument, such as full state-by-state tables or methodology, goes to an appendix section that the presenter can jump to via a link if asked. In a weekly title-production report that means five main slides (summary, volume, TAT, quality, issues) and a ten-slide appendix, which is what my Stewart Title status reports looked like.

**Q: A manager insists on 3-D pie charts because "they look nicer". How do you handle it?**
I show the same data both ways side by side and ask them to read two values off each; the 3-D pie almost always loses because perspective distorts the slices. I offer a compromise that satisfies the desire for polish: a clean doughnut with a large central number, or a horizontal bar chart in brand colours with labels. If they still insist, I comply on that deck, because it is their deck, but I document the recommendation. The goal is the reader's accuracy, not winning an argument.

**Q: What is the data-ink ratio and how do you apply it in PowerPoint specifically?**
It is the share of a chart's ink that represents data, and the principle is to erase non-data ink and redundant data ink. In PowerPoint that means Chart Elements off for title and legend where possible, Format Axis to hide the value axis when labels are present, gridlines to Light 2 or none, no effects, and grey for context series. I save that formatting as a chart template so every chart starts already stripped down, which is faster than cleaning each one.

## Accessibility & reading order

Accessible decks are a legal requirement for many US government, university and enterprise clients (Section 508, ADA, WCAG 2.1 AA and the EU Accessibility Act), and they are simply better decks: a logical reading order, real titles and good contrast help every reader. PowerPoint's Accessibility Checker makes most of it mechanical.

### The Accessibility Checker

**Review > Check Accessibility** opens a pane that lists Errors (content that is unreadable for people with disabilities), Warnings (hard to read) and Tips. The status bar shows "Accessibility: Investigate" or "Good to go". Keep the checker running while you build (tick "Keep accessibility checker running while I work" under File > Options > Accessibility).

| Finding | Fix |
|---|---|
| Missing alternative text | Right-click picture > View Alt Text; describe or Mark as decorative |
| Missing slide title | Use the title placeholder; for a visual-only slide, add the title and hide it via Accessibility > Slide Title > Hidden Title, or position off-slide |
| Duplicate slide titles | Make each title unique ("Volume by state (1 of 2)") |
| Check reading order | Accessibility pane > Reading Order, or Selection Pane bottom-to-top |
| Hard-to-read text contrast | Use Dark 1 on Light 1; check 4.5:1 for body text, 3:1 for 18 pt+ |
| Table has no header row | Table Design > tick Header Row; avoid merged and split cells |
| Use of colour only | Add icons, labels or patterns for status |
| Hyperlink text unclear | Link text says where it goes, not "click here" |
| Video without captions | Insert captions (.vtt) via Playback > Insert Captions |

### Reading order

Screen readers read objects in the order they were added to the slide, which is the z-order shown in the Selection Pane read from **bottom to top**. The **Reading Order** pane (Accessibility ribbon > Reading Order, in Microsoft 365) shows the same list top-down with a checkbox to exclude decorative objects. Drag items to fix the order: title first, then content left-to-right, top-to-bottom, then footers. On a layout-driven slide the placeholders are already in a sensible order; free-drawn shapes and text boxes are the usual culprits.

```text
Selection Pane (Alt+F10) order, top = frontmost = read LAST
   Footer text box
   Commentary text box
   Chart 3
   Title 1            <-- read first (bottom of the list)
Reading Order pane shows it the other way up; both are the same order.
```

### Alt text that helps

Describe content and purpose in one or two sentences: "Column chart: closed files by state, Texas 388 highest, Colorado 93 lowest." For complex charts, put the key numbers in the alt text or in the notes and say so. Do not start with "image of". Mark decorative shapes, lines and background photos as decorative. Microsoft 365 auto-generates alt text for photos; always replace it.

### Text, fonts and contrast

- Minimum 18 pt for body text on projected slides, 12 pt for footnotes, sans-serif theme fonts.
- Contrast: Dark 1 on Light 1 passes; grey text on grey panels often fails. The Accessibility Checker flags some contrast problems; for exact ratios use a contrast checker with the hex values.
- Real bullets and numbering (Home > Bullets), not typed dashes.
- Avoid text in images; if unavoidable, repeat the text in alt text.
- Avoid flashing or rapidly moving animations (WCAG 2.3).

### Tables

Insert real tables (Insert > Table), tick Header Row, keep one header row and no merged cells; screen readers announce the header for each cell. Do not use a table for layout.

### Captions and subtitles

**Slide Show > Always Use Subtitles** turns on live captions in the spoken language, which can be translated. For embedded video, **Playback > Insert Captions** takes a WebVTT file.

### Exporting an accessible PDF

File > Export > Create PDF/XPS > Options: tick **Document structure tags for accessibility** and untick Bitmap text. Set the document title in File > Info > Properties > Title, because PDF readers announce it. Adobe Acrobat's accessibility checker will then report the tagged structure; PowerPoint's tags are good for titles, lists, tables and alt text but not perfect for reading order of overlapping shapes, so fix order in PowerPoint first.

> **Warning:** Slides built with only text boxes and no title placeholder fail every accessibility audit, and they cannot be fixed by a script. Building on layouts is the accessibility strategy.

### Try It Yourself

```text
1. Review > Check Accessibility; note the count of errors.
2. For each picture: right-click > View Alt Text, write a description or Mark as decorative.
3. On a slide with no title: Accessibility ribbon > Slide Title > Add Hidden Slide Title, type it.
4. Accessibility ribbon > Reading Order; drag the title to the top, footers to the bottom.
5. Select each table: Table Design > tick Header Row.
6. File > Info > Properties > Title = deck name; Export PDF with structure tags on.
```

### Quiz

1. In the Selection Pane, which object is read first by a screen reader?
- [ ] The top of the list
- [x] The bottom of the list
- [ ] The largest object
> Selection Pane order is z-order; reading order runs from the back (bottom) to the front (top).

2. What is the minimum contrast ratio for normal body text under WCAG AA?
- [ ] 2:1
- [x] 4.5:1
- [ ] 7:1
> 4.5:1 for normal text, 3:1 for large text (18 pt regular or 14 pt bold); 7:1 is AAA.

3. How should a purely visual slide satisfy the "missing title" rule?
- [ ] Leave it; visuals do not need titles
- [x] Add a hidden slide title
- [ ] Put the title in the notes
> A hidden title keeps the design clean while giving screen readers a title.

### Exercises

1. **Audit and fix** — Run the checker on a 12-slide deck and describe your order of operations.
<details><summary>Solution</summary>

Fix errors first: alt text on each image (decorative for backgrounds), titles on every slide (hidden where needed), header rows on tables. Then warnings: reading order on any slide with free shapes, contrast on grey text, unclear link text. Then tips: duplicate titles. Re-run until "Good to go", set document Title, export tagged PDF.

</details>

2. **Status colours** — A RAG status table uses red, amber and green fills only. Make it accessible.
<details><summary>Solution</summary>

Add a symbol or word in each cell ("● On track", "▲ At risk", "■ Late") so status is not conveyed by colour alone, ensure the text contrast on each fill passes 4.5:1 (dark text on amber and green, white text on a darker red), and describe the legend in the slide's notes or a footnote.

</details>

### Interview Questions

**Q: A US university client requires 508-compliant training decks. What is your process?**
Build from a template whose layouts all have a title placeholder and real bullet placeholders so structure is automatic; use SmartArt or real tables rather than drawn grids; write alt text as I insert each image; keep the checker running and fix as I go rather than at the end; set reading order with the Reading Order pane on any slide with free objects; check contrast for every colour pair in the theme once and document it; export a tagged PDF and verify in Acrobat. I keep a checklist in the hidden guide slide so the client's staff can maintain compliance after handover.

**Q: Why is reading order a problem in PowerPoint and how do you control it?**
Because the order is the creation order, so a designer who adds the title last makes it read last. I control it by building on layouts (placeholders are already in order), naming objects in the Selection Pane, and using the Reading Order pane to reorder and mark decoration. On a large deck I spot-check with Narrator (Windows key + Ctrl + Enter) in Slide Show.

**Q: What does the "Document structure tags" option do in PDF export?**
It writes PDF tags (headings, paragraphs, lists, tables, figures with alt text) so assistive technology can navigate the PDF and it can be checked in Acrobat. Without it the PDF is a set of pictures of text. It slightly increases file size and is required for an accessible deliverable; I always leave it on, alongside Bitmap text off so text remains real and searchable.

# LEVEL: Expert

## Template governance & rebranding a deck suite

Templates decay. Six months after delivery, a client has four versions of the .potx circulating, staff have pasted slides from old decks with Keep Source Formatting, and the brand team has announced new colours. **Governance** is the set of practices that keeps a template suite usable at scale, and a **rebrand** is the stress test. This chapter covers both from a production engineer's view.

### Distribution: where the template lives

| Method | How | Trade-off |
|---|---|---|
| Personal templates folder | Each user copies the .potx to Documents\Custom Office Templates | Simple; no central update |
| Workgroup templates | File > Options > Save > Default personal templates location pointing to a network/OneDrive path, or the legacy Workgroup Templates registry setting | One copy; users need the path configured |
| SharePoint/Teams organisation assets library | Admin registers a SharePoint library as an Office template source (`Add-SPOOrgAssetsLibrary -OrgAssetType OfficeTemplateLibrary`) | Appears under File > New > <Organisation>; needs a SharePoint admin |
| Intune / Group Policy | Push the .potx to the templates folder on managed PCs | Full control; IT project |

For a small business client on Microsoft 365, the organisation assets library is the right answer; for a freelancer's client on ten laptops, a OneDrive shared folder plus a one-line instruction is realistic.

### Versioning and change control

Put the version in the file name (`Acme_Template_v1.3.potx`), in the hidden guide slide and in File > Info > Properties > Comments. Keep a changelog in the guide slide: date, version, what changed, who approved. Never edit the live template in place; copy, edit, test, then replace, so a broken edit can be rolled back. Store the previous two versions.

### Detecting drift in decks

Decks drift from the template when users paste, hand-format and add masters. A quick audit of a deck:

```text
1. View > Slide Master: count masters (should be 1) and hover layouts for "not used by any slides".
2. Home > Replace > Replace Fonts: the "Replace" dropdown lists every font in the deck; anything not a theme font is drift.
3. Design > Variants > Colors: temporarily swap Accent 1; unchanged objects are hard-coded.
4. Review > Check Accessibility: "Missing slide title" reveals slides built from text boxes.
5. File size and ppt/media contents: uncompressed images and duplicate masters.
```

At scale, script it: python-pptx can walk every `.pptx` in a folder and report master count, fonts used, `srgbClr` occurrences and slides without a title placeholder. The Automation chapter shows the pattern.

### Rebranding a deck suite

A rebrand touches theme (colours, fonts), master objects (logo, footer), layouts (band colours, positions) and possibly slide size. The procedure that scales:

1. Build the new template version from the old one (copy, then Customize Colors/Fonts, replace the logo on the master, adjust layouts). Keep layout **names identical** so existing slides keep their mapping.
2. For each existing deck: Design > Themes > Browse for Themes and pick the new .potx or .thmx. Slides re-map to the same-named layouts and pick up the new theme colours.
3. Home > Reset on slides that lost formatting (they had direct formatting).
4. Delete old masters that the theme application left behind (Slide Master view; Preserve off, delete).
5. Replace Fonts for any hard-coded fonts; hunt hard-coded colours with the Accent swap.
6. Re-run Check Accessibility and export a PDF for sign-off.

When the layout names differ between old and new template, PowerPoint maps by position in the list, and decks land on wrong layouts. Renaming layouts in the old template to match the new one *before* applying the theme avoids most manual work.

### Governance rules for users (the two-page guide)

- Always start from File > New > Personal > the template, never from an old deck.
- Paste slides with **Use Destination Theme**; when reusing slides, use Home > New Slide > Reuse Slides with "Use source formatting" unticked.
- Use the layout for the purpose; do not draw text boxes over the Blank layout.
- Theme Colors block only; never More Colors.
- Report a missing layout to the template owner rather than improvising.

> **Interview note:** Governance questions probe whether you think in systems. Say how you measure drift (master count, font list, colour audit), how versions are distributed and rolled back, and what you do when the brand changes.

### Try It Yourself

```powershell
# Inventory every deck in a client folder: size, modified date, and number of slide masters
Get-ChildItem "C:\Clients\Acme\Decks" -Filter *.pptx -Recurse | ForEach-Object {
  $zip = [System.IO.Compression.ZipFile]::OpenRead($_.FullName)
  $masters = ($zip.Entries | Where-Object { $_.FullName -like "ppt/slideMasters/slideMaster*.xml" }).Count
  $zip.Dispose()
  [PSCustomObject]@{ File = $_.Name; MB = [math]::Round($_.Length/1MB,1); Modified = $_.LastWriteTime; Masters = $masters }
} | Sort-Object Masters -Descending | Format-Table -AutoSize
```

### Quiz

1. Why keep layout names identical between template versions?
- [x] So existing slides re-map to the right layout when the new theme is applied
- [ ] PowerPoint refuses to open templates with new names
- [ ] To keep file size down
> Theme application maps layouts by name first; mismatched names cause slides to land on wrong layouts.

2. Which is the best central distribution method for a Microsoft 365 organisation?
- [ ] Email the .potx to everyone
- [x] A SharePoint organisation assets library registered as a template source
- [ ] A hidden slide in every deck
> The organisation assets library shows the template under File > New for all users and updates centrally.

3. Multiple slide masters in a deck usually indicate:
- [ ] A deliberate multi-brand design
- [x] Slides pasted with Keep Source Formatting
- [ ] A corrupt file
> Each such paste imports the source master; deleting unused masters is part of cleanup.

### Exercises

1. **Rebrand plan** — Write the step list to rebrand 25 existing decks after the template colours and logo change.
<details><summary>Solution</summary>

Build v2.0 of the template from v1.x with identical layout names; save .potx and .thmx; audit the 25 decks with the PowerShell inventory; for each deck apply the new theme via Design > Themes > Browse for Themes, delete leftover masters, Reset direct-formatted slides, Replace Fonts, run the Accent swap test, check accessibility, export PDF, and record the deck as migrated in a tracking sheet. Budget 15-30 minutes per deck depending on drift.

</details>

2. **Drift report** — Define five metrics you would report per deck and the threshold that triggers a rebuild.
<details><summary>Solution</summary>

Number of masters (>1 triggers cleanup), non-theme fonts (>0), hard-coded colours as a percentage of coloured shapes (>10% suggests rebuild), slides without a title placeholder (>20% suggests rebuild), and file size per slide (>1 MB/slide means uncompressed media). Report in a table with a red/amber/green column and the estimated fix time.

</details>

### Interview Questions

**Q: A client with 200 decks is rebranding. How do you scope and price the work?**
I sample twenty decks and run the drift audit to classify them: clean (theme swap, 15 minutes), moderate (theme swap plus resets and font replacement, 45 minutes), rebuild (text-box decks, several hours). I extrapolate to 200, add the template rebuild itself, and quote per class rather than per deck so the client sees why old decks cost more. I also propose automation: a python-pptx script that applies the theme, removes extra masters and reports the leftovers, which shifts most decks into the clean class. Finally I recommend they only migrate decks still in use and archive the rest as PDF.

**Q: How do you stop a template suite decaying after handover?**
Central distribution so there is one source of truth, a version number visible in the file, a two-page guide with the five rules, a named template owner on the client side, and a quarterly audit script that reports masters, fonts and colours across the shared drive. I also offer a small retainer for layout requests so people do not improvise. Decay is a process problem, so the fix is process plus a little tooling, not another template.

**Q: What breaks when you apply a new theme to an old deck, and how do you handle it?**
Slides on layouts that no longer exist go to the closest match by name or position, direct formatting stays and now clashes, hard-coded colours stay old, and the old master often remains as a second master. I handle it in order: rename layouts before applying, apply, delete leftover masters, Reset where safe, Replace Fonts, colour audit, then visual pass in Slide Sorter. On a valuable deck I keep the old version alongside for comparison.

## Automation (python-pptx / PptxGenJS / VBA)

When a job is "43 covers", "one slide per state" or "rebuild this deck every Monday", you stop clicking and generate the file. Three tools cover almost every case: **python-pptx** for generating and inspecting decks from Python, **PptxGenJS** for generating decks in JavaScript (browser or Node), and **VBA** for automating PowerPoint itself while it is open. Each has a distinct sweet spot.

### python-pptx: generate from a template

python-pptx (`pip install python-pptx`, version 1.0.x) writes Office Open XML directly. It opens an existing presentation and adds slides using its layouts, which is how you keep the brand: the template does the design, the script does the data.

One limitation: python-pptx cannot open a `.potx` and save a valid `.pptx` directly, because the content type inside says "template". Keep a slide-free `.pptx` copy of the template (`Acme_Base.pptx`) as the base for scripts.

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE
import csv

prs = Presentation("Acme_Base.pptx")            # template saved as .pptx with no slides
layouts = {l.name: l for l in prs.slide_layouts}  # look layouts up by the names you gave them

# 43 covers from a CSV: number,title,family,image
with open("toolkits.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        slide = prs.slides.add_slide(layouts[f"Cover – {row['family']}"])
        slide.shapes.title.text = row["title"]
        for ph in slide.placeholders:
            if ph.placeholder_format.type == 18:              # PICTURE placeholder
                ph.insert_picture(row["image"])               # crops to the frame
            elif ph.placeholder_format.idx == 10:             # the "Toolkit 00 of 43" text placeholder
                ph.text = f"Toolkit {int(row['number']):02d} of 43"

# a chart slide from data
slide = prs.slides.add_slide(layouts["Chart + commentary"])
slide.shapes.title.text = "Texas closed 94% of September files, highest of any state"
data = CategoryChartData()
data.categories = ["Texas", "Florida", "Arizona", "Colorado"]
data.add_series("Closed", (388, 271, 175, 93))
chart_ph = [p for p in slide.placeholders if p.placeholder_format.type == 12][0]  # CHART
gf = chart_ph.insert_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, data)
gf.chart.has_legend = False
gf.chart.plots[0].has_data_labels = True
prs.save("Acme_Toolkits_2026-09.pptx")
```

Find placeholder `idx` values once by printing them from a slide made from the layout: `for p in slide.placeholders: print(p.placeholder_format.idx, p.placeholder_format.type, p.name)`. Types are `PP_PLACEHOLDER` enums (TITLE=1, BODY=2, CHART=12, PICTURE=18, TABLE=12 is not; TABLE=13).

python-pptx also **reads** decks, which is how you audit: iterate `prs.slides`, `slide.shapes`, `shape.text_frame.paragraphs[].runs[].font.name`, and count `srgbClr` in `shape._element.xml`. It cannot render, so it cannot make thumbnails; use PowerPoint or LibreOffice headless for that.

### PptxGenJS: generate in the browser or Node

PptxGenJS (v3.12+) builds a deck in JavaScript and downloads it, with no server. It defines its own masters rather than reading a .potx, so you translate the template's positions into a `defineSlideMaster` call once.

```js
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";                              // 13.333 x 7.5 in
pptx.defineSlideMaster({
  title: "CHART_COMMENTARY",
  background: { color: "FFFFFF" },
  objects: [
    { rect: { x: 0, y: 7.1, w: "100%", h: 0.4, fill: { color: "B7472A" } } },
    { image: { x: 12.1, y: 0.3, w: 0.9, h: 0.9, path: "logo.png" } },
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.35, w: 12.33, h: 0.9, fontFace: "Segoe UI Semibold", fontSize: 28, color: "1B365D" } } },
    { placeholder: { options: { name: "comment", type: "body", x: 8.8, y: 1.5, w: 4.03, h: 5.2, fontSize: 16 } } },
  ],
});
const s = pptx.addSlide({ masterName: "CHART_COMMENTARY" });
s.addText("Texas closed 94% of September files", { placeholder: "title" });
s.addText("Two examiners added mid-month; TAT held at 41 h.", { placeholder: "comment" });
s.addChart(pptx.ChartType.bar, [{ name: "Closed", labels: ["TX","FL","AZ","CO"], values: [388,271,175,93] }],
  { x: 0.5, y: 1.5, w: 8, h: 5.2, barDir: "col", chartColors: ["B7472A"], showValue: true, showLegend: false });
pptx.writeFile({ fileName: "Status_2026-09-15.pptx" });
```

PptxGenJS is the right choice for a web dashboard's "Export to PowerPoint" button and for Power Automate/Node pipelines; it is the wrong choice when the client's .potx must be used as-is.

### VBA: automate PowerPoint itself

VBA runs inside PowerPoint (Alt+F11) and can do what the libraries cannot: use the live rendering engine, apply a template (`ApplyTemplate`), export images, update links, and manipulate anything in the object model. Typical production macros:

```vb
Sub AuditFontsAndTitles()
    Dim sld As Slide, shp As Shape, r As TextRange, msg As String
    For Each sld In ActivePresentation.Slides
        Dim hasTitle As Boolean: hasTitle = False
        For Each shp In sld.Shapes
            If shp.Type = msoPlaceholder Then
                If shp.PlaceholderFormat.Type = ppPlaceholderTitle Or _
                   shp.PlaceholderFormat.Type = ppPlaceholderCenterTitle Then hasTitle = True
            End If
            If shp.HasTextFrame Then
                Set r = shp.TextFrame.TextRange
                If r.Font.Name <> "+mn-lt" And r.Font.Name <> "+mj-lt" And r.Length > 0 Then
                    msg = msg & "Slide " & sld.SlideIndex & ": " & shp.Name & " uses " & r.Font.Name & vbCrLf
                End If
            End If
        Next shp
        If Not hasTitle Then msg = msg & "Slide " & sld.SlideIndex & ": no title placeholder" & vbCrLf
    Next sld
    Debug.Print msg
End Sub

Sub ApplyNewTemplate()
    ActivePresentation.ApplyTemplate "C:\Templates\Acme_Template_v2.0.potx"
End Sub
```

Save macro-enabled files as `.pptm`; better, keep macros in a personal add-in (`.ppam`) so client decks stay macro-free. Office Scripts for PowerPoint (in PowerPoint for the web) are a newer, limited alternative for Microsoft 365 tenants.

### Choosing

| Need | Tool |
|---|---|
| Generate decks from data using the client's .potx layouts | python-pptx |
| Export to PowerPoint from a web app | PptxGenJS |
| Fix or audit open decks, apply templates, batch export | VBA |
| Read text from thousands of decks | python-pptx |
| Render thumbnails or PDF server-side | LibreOffice headless (`soffice --headless --convert-to pdf`) |

> **Tip:** Whatever the tool, the design stays in the template. Scripts should only choose a layout and fill placeholders; the moment a script starts hard-coding fonts and colours you have created a second, invisible template.

### Try It Yourself

```python
# Audit a folder of decks: masters, fonts, hard-coded colours, untitled slides
from pathlib import Path
from pptx import Presentation

for path in Path("decks").glob("*.pptx"):
    prs = Presentation(path)
    fonts, srgb, untitled = set(), 0, 0
    for slide in prs.slides:
        if slide.shapes.title is None:
            untitled += 1
        for shp in slide.shapes:
            srgb += shp._element.xml.count("srgbClr")
            if shp.has_text_frame:
                for p in shp.text_frame.paragraphs:
                    for r in p.runs:
                        if r.font.name:
                            fonts.add(r.font.name)
    print(f"{path.name}: masters={len(prs.slide_masters)} slides={len(prs.slides)} "
          f"untitled={untitled} srgbClr={srgb} fonts={sorted(fonts)}")
```

### Quiz

1. Why keep a slide-free .pptx copy of a template for python-pptx?
- [x] python-pptx cannot turn a .potx into a valid .pptx on save
- [ ] .potx files are encrypted
- [ ] python-pptx cannot read layouts
> The content type of a .potx marks it as a template; saving from python-pptx keeps that, so PowerPoint opens the result as a template.

2. Which tool can apply a .potx to an open deck using PowerPoint's own engine?
- [ ] python-pptx
- [ ] PptxGenJS
- [x] VBA (`ApplyTemplate`)
> Only automation inside PowerPoint uses its rendering and theme-application logic.

3. In python-pptx, what does `placeholder_format.idx` identify?
- [ ] The slide number
- [x] The specific placeholder on a layout, matching the layout's XML idx
- [ ] The z-order
> idx is the stable key linking a slide placeholder to its layout placeholder.

### Exercises

1. **One slide per state** — Generate a deck with a title slide and one "Chart + commentary" slide per state from a CSV with state, received, closed.
<details><summary>Solution</summary>

```python
import csv
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE
prs = Presentation("Acme_Base.pptx")
L = {l.name: l for l in prs.slide_layouts}
t = prs.slides.add_slide(L["Title Slide"]); t.shapes.title.text = "September production by state"
for row in csv.DictReader(open("states.csv", newline="")):
    s = prs.slides.add_slide(L["Chart + commentary"])
    pct = int(row["closed"]) / int(row["received"])
    s.shapes.title.text = f"{row['state']} closed {pct:.0%} of received files"
    d = CategoryChartData(); d.categories = ["Received", "Closed"]
    d.add_series("Files", (int(row["received"]), int(row["closed"])))
    ph = [p for p in s.placeholders if p.placeholder_format.type == 12][0]
    ph.insert_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, d).chart.has_legend = False
prs.save("States.pptx")
```

</details>

2. **Batch PDF export** — Export every .pptx in a folder to PDF without opening each by hand.
<details><summary>Solution</summary>

Either LibreOffice: `soffice --headless --convert-to pdf --outdir out *.pptx` (fonts must be installed; rendering differs slightly from PowerPoint), or a VBA/PowerShell COM loop: `$app = New-Object -ComObject PowerPoint.Application; $p = $app.Presentations.Open($file, $true, $false, $false); $p.SaveAs($pdf, 32); $p.Close()` where 32 is `ppSaveAsPDF`. Use COM when fidelity matters, LibreOffice on a server without Office.

</details>

### Interview Questions

**Q: When would you choose python-pptx over VBA, and vice versa?**
python-pptx when the job is generating decks from data or auditing many files, especially on a schedule or a server without PowerPoint: it is fast, testable and version-controlled. VBA when I need PowerPoint's engine, for example applying a template with correct layout mapping, exporting rendered images, updating linked charts, or fixing decks interactively while the user watches. In practice the 43-cover job was python-pptx from a CSV against the client's template layouts, and the cleanup of their legacy decks was a VBA add-in run by their staff.

**Q: How do you keep generated decks on-brand?**
The script never sets fonts or colours; it only picks a named layout from the client's template and fills placeholders by idx. Charts are inserted into chart placeholders so they inherit theme colours. I keep the base .pptx under version control next to the script, and a test that generates one slide per layout and compares placeholder counts to the template's. When the brand changes, the template changes and the script is untouched.

**Q: What are the limits of python-pptx you have hit in production?**
No rendering, so no thumbnails or PDF; limited chart formatting compared with the UI (data label number formats and axis options need XML tweaks); no support for SmartArt creation; and templates must be .pptx. I work around rendering with LibreOffice headless or a COM step on a Windows box, and around chart limits by pre-formatting a chart in the template and copying its XML, or by inserting a chart template via VBA afterwards.

## Troubleshooting (fonts, embedded media, file size)

Production decks fail in predictable ways: fonts substitute, video will not play, the file is 300 MB, links break, or the file will not open. Most fixes are mechanical once you know where PowerPoint keeps things.

### Fonts substitute on another machine

Symptoms: text reflows, bullets misalign, a serif appears where a sans should be. Cause: the font is not installed there and PowerPoint substituted (Home > Replace > Replace Fonts lists fonts in the deck; File > Options > Advanced lacks a substitution table, so the UI does not warn). Fixes, in order of preference:

1. Use theme fonts that ship with Office (Aptos, Segoe UI, Calibri, Arial) or **cloud fonts** that Microsoft 365 downloads on demand (marked with a cloud icon in the font list).
2. **Embed**: File > Options > Save > Embed fonts in the file. "Embed only the characters used" is smaller; "Embed all characters" allows editing. Fonts marked non-embeddable by their licence are skipped silently; check by reopening on another PC. PowerPoint for Mac has embedded fonts since version 16.17 (2019), and older Mac versions ignore embedded fonts.
3. Convert unavoidable brand-font text (a logo lock-up) to a picture or an SVG.

Fonts in **charts** and **embedded Excel objects** are not covered by embedding; set them to theme fonts inside the chart.

### File size

Open the .pptx as a ZIP and look at `ppt/media`: that is where the bytes are.

| Cause | Fix |
|---|---|
| Uncompressed photos (4000 px JPEG/PNG) | Picture Format > Compress Pictures, all pictures, Web 150 ppi, delete cropped areas |
| Embedded video/audio | File > Info > Compress Media > Full HD or HD; or link instead of embed |
| Embedded Excel workbooks behind charts (each carries the whole workbook) | In Excel, copy only the chart's data to a small workbook before pasting, or paste as linked |
| Multiple slide masters with their own media | Delete unused masters |
| Embedded fonts (all characters) | Embed only used characters |
| Undo history is not saved; but hidden slides and notes images are | Delete unused hidden slides |
| PNG with transparency used as a photo | Convert to JPEG before insertion |

File > Info > Compress Media and Compress Pictures both keep a full-quality original until you save, so save to a new name and compare.

### Video and audio

- **Insert > Video > This Device** embeds MP4 (H.264 + AAC); prefer that format because it plays on Windows, Mac and the web. WMV and MOV cause "cannot play media" on other machines.
- **Playback** tab: Start (In Click Sequence, Automatically, When Clicked On), Play Full Screen, Trim Video, Fade, Insert Captions.
- Online videos (YouTube) insert as an embedded player and require internet; they do not export to PDF or video.
- If audio plays in the editor but not in Slide Show, check Playback > Start and whether Hide During Show is on; for narration recorded per slide, the audio object sits on each slide.
- **Optimize Media Compatibility** appears under File > Info when PowerPoint detects a format risk; run it.

### Links and embedded objects

File > Info > **Edit Links to Files** lists every linked chart, worksheet and video with its path. Update Now, Change Source, Break Link. A deck emailed with links shows a security prompt and then stale data; break links on the copy you send. Embedded objects (double-click opens Excel) can fail with "server application cannot be found" when the recipient lacks Excel or the object was created in a much newer version; paste as picture for delivery.

### Corruption and recovery

- "PowerPoint found a problem with content" and Repair: accept repair, then Save As a new name.
- If Repair fails, unzip, validate the XML of each `ppt/slides/slideN.xml` (an XML editor shows the broken one), remove the slide's entries from `ppt/_rels/presentation.xml.rels` and `presentation.xml`, re-zip.
- File > Open > Recover Unsaved Presentations for AutoRecover copies.
- Slow decks: Slide Sorter loads all thumbnails; File > Options > Advanced > Disable hardware graphics acceleration helps on some GPUs; enormous embedded workbooks and hundreds of animations also slow the editor.

### Rendering differences

PowerPoint for the web, Mac, Google Slides and LibreOffice each render slightly differently: no Morph or some effects, different kerning, unsupported fonts, SmartArt converted to pictures in Google Slides. For a deck that must look identical everywhere, deliver PDF and keep the .pptx for editing.

> **Warning:** Compress Pictures with "Delete cropped areas" is irreversible after saving. Keep the client's originals in a separate assets folder.

### Try It Yourself

```powershell
# Which media files make this deck heavy? List the biggest entries in ppt/media.
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("C:\Clients\Acme\Board_Deck.pptx")
$zip.Entries | Where-Object { $_.FullName -like "ppt/media/*" -or $_.FullName -like "ppt/embeddings/*" } |
  Sort-Object Length -Descending | Select-Object -First 15 FullName, @{n="MB";e={[math]::Round($_.Length/1MB,2)}}
$zip.Dispose()
```

### Quiz

1. Which video format is safest to embed for playback on Windows, Mac and the web?
- [ ] WMV
- [x] MP4 (H.264 video, AAC audio)
- [ ] MOV
> MP4/H.264 is supported by every current PowerPoint platform.

2. Font embedding does not cover text in:
- [ ] Placeholders
- [x] Charts and embedded Excel objects
- [ ] Notes
> Charts and OLE objects use their own font references; set theme fonts inside them.

3. Where do you look to find out why a deck is 300 MB?
- [x] The ppt/media and ppt/embeddings folders inside the ZIP
- [ ] The notes pane
- [ ] File > Options > Save
> Media and embedded workbooks are almost always the cause.

### Exercises

1. **Shrink a board deck** — A 280 MB deck with 40 photos, two videos and six charts pasted from a 30 MB workbook must be under 25 MB.
<details><summary>Solution</summary>

Compress Pictures (all, Web 150 ppi, delete cropped areas): photos drop from ~200 MB to ~10 MB. File > Info > Compress Media > HD for the videos, or replace them with links to SharePoint. For the charts, in Excel copy each chart's source range to a new small workbook, rebuild the charts there and re-paste with Use Destination Theme & Embed, or paste as linked and break links before sending. Delete unused masters and hidden slides. Save As a new name and check the ZIP.

</details>

2. **Font rescue** — A deck arrives in "Gotham" and the client has no licence for it. Deliver an editable version.
<details><summary>Solution</summary>

Home > Replace Fonts: Gotham to Segoe UI (or Montserrat as a free look-alike, installed from Google Fonts on the client's machines). Check the theme fonts under Design > Variants > Fonts and change the theme pair so new slides follow. Verify in Slide Sorter for reflow, fix any titles that now wrap, and note the change in the delivery email.

</details>

### Interview Questions

**Q: A client says the deck you sent looks broken on their laptop. Walk me through your diagnosis.**
I ask for a screenshot and their PowerPoint version and platform. Reflowed text points to fonts, so I check whether I used non-standard fonts and whether embedding applied; missing media points to format or links, so I check Edit Links and video codecs; missing effects point to an older version or the web app. I reproduce on a clean machine or in PowerPoint for the web, fix at the source (theme fonts, MP4, break links, compress), and send both a corrected .pptx and a PDF so they have a guaranteed-correct view immediately.

**Q: How do you keep a weekly report deck small when it has charts pasted from a large workbook?**
Every embedded chart carries a copy of the whole workbook, so six charts from a 30 MB file give a 180 MB deck. I either link the charts to the workbook (Use Destination Theme & Link Data) and break links on the distributed copy, or I keep a small "chart data" workbook that holds only the summary ranges and build the charts there. I also compress pictures on the master once so logos are not re-encoded on every slide.

**Q: What is the difference between Compress Pictures and Compress Media?**
Compress Pictures resamples raster images to a chosen ppi and can discard cropped pixels; it applies to one or all pictures. Compress Media re-encodes embedded audio and video to Full HD, HD or Standard quality. Both are lossy and permanent after saving, so I save to a new file name. Neither touches embedded Excel workbooks or fonts, which need their own fixes.

## Video export & recording

Clients increasingly want a deck as an MP4 for a website, an LMS or a client onboarding portal. PowerPoint records narration, ink and webcam per slide, then renders the whole deck to video with transitions and animations intact. Done well, it replaces a screen recorder for training content.

### Recording narration and timings

The **Record** tab (Microsoft 365; older versions use Slide Show > Record Slide Show) opens a recording window with the current slide, notes, camera and microphone toggles, pen tools and a Record button. Each slide's audio is stored as an audio object on that slide, and the time spent becomes the slide's automatic advance timing. You can re-record a single slide without touching the rest, which is the key advantage over a screen recorder.

```text
Record > From Beginning / From Current Slide
   Mic on, camera on/off (Cameo places the webcam feed as an object on the slide)
   Record, speak, click through animations, Stop, Export or close
Slide Show > Rehearse Timings           timings only, no audio
Slide Show > Set Up Slide Show          Advance slides: Using timings, if present
Slide Show > Clear                      Clear Timings / Clear Narrations on this or all slides
Insert > Screen Recording               records a region of the screen and inserts it as a video object
```

Tips for clean audio: a USB microphone, a quiet room, a script in the notes pane at a large size, and a 0.5 s pause at the start and end of each slide because PowerPoint trims nothing.

### Exporting to video

**File > Export > Create a Video** (or Record > Export to Video):

| Setting | Options | Guidance |
|---|---|---|
| Quality | Ultra HD (4K), Full HD (1080p), HD (720p), Standard (480p) | Full HD for web; 720p for email or LMS limits |
| Timings and narrations | Use Recorded Timings and Narrations / Don't Use | Without recordings, "Seconds spent on each slide" applies to every slide |
| Format | MP4 (H.264) or WMV | Always MP4 |

Rendering runs in the background (progress bar on the status bar). A 30-slide 1080p deck takes a few minutes; 4K much longer. Animations, transitions, ink, embedded video and Cameo are rendered; hyperlinks, triggers and Zoom navigation are not, because a video has no clicks.

### Preparing a deck for video

- Set every slide's advance time (Transitions > After) or record timings; a slide with no timing uses the default seconds.
- Convert online videos to embedded MP4; online video does not render.
- Replace triggered or click-dependent animations with automatic ones (Start: After Previous).
- Add captions: export a transcript from the recording or write one, save as WebVTT, and add to the final MP4 in a video editor or on the platform; PowerPoint's video export does not burn in captions.
- For a 16:9 video keep the 16:9 slide size; a 4:3 deck exports letterboxed.

### Alternatives and when to use them

- **Save as PowerPoint Show (.ppsx)** when the audience has PowerPoint and needs navigation.
- **Export > Create an Animated GIF** for short loops (Microsoft 365).
- **PowerPoint Live in Teams / Stream recording** when the session is live and should be recorded with Q&A.
- A screen recorder (OBS, Clipchamp) when you must show software, not slides; you can still insert the recording via Insert > Video.

### Encoding notes

The MP4 uses H.264 video and AAC audio at a bitrate chosen by the quality preset. If a platform demands a particular size or bitrate, re-encode with a tool such as HandBrake or ffmpeg rather than fighting PowerPoint:

```bash
# Re-encode a PowerPoint export to a web-friendly size, keeping quality reasonable
ffmpeg -i "Onboarding_1080p.mp4" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart "Onboarding_web.mp4"
```

`-movflags +faststart` moves the index to the front so browsers start playing before the download finishes.

> **Tip:** Record in short segments (one section at a time) and re-record individual slides. A 40-minute training video recorded in one take will be re-recorded in full when a number changes; a deck recorded per slide is updated in two minutes.

### Try It Yourself

```text
1. On slide 1: Record > From Beginning. Speak the title, click Stop, close the recorder.
2. Note the audio icon on slide 1 and the timing under Transitions > After.
3. Transitions > After: 00:05.00 for all remaining slides (select them, tick After, Apply To All excluded).
4. File > Export > Create a Video > Full HD (1080p) > Use Recorded Timings and Narrations.
5. Seconds spent on each slide: 5 (applies to slides without a recording). Create Video.
6. Play the MP4; then re-record only slide 1 via Record > From Current Slide and export again.
```

### Quiz

1. What happens to hyperlinks and triggered animations in a video export?
- [ ] They become clickable chapters
- [x] They are ignored; a video has no clicks
- [ ] They pause the video
> Convert click-dependent builds to automatic ones before exporting.

2. Where is each slide's narration stored?
- [x] As an audio object on that slide
- [ ] In a single track in the file
- [ ] In the notes pane
> Per-slide storage is why single slides can be re-recorded.

3. Which export resolution is the sensible default for web training content?
- [ ] Standard (480p)
- [x] Full HD (1080p)
- [ ] Ultra HD (4K)
> 1080p balances quality and file size; 4K multiplies size and render time for little gain.

### Exercises

1. **LMS-ready module** — A 25-slide onboarding deck must become an MP4 under 200 MB with captions.
<details><summary>Solution</summary>

Record per slide with a script in the notes; set automatic animations; Export > Create a Video > Full HD, Use Recorded Timings; check size, and if over 200 MB re-encode with ffmpeg at CRF 23. Generate captions from the transcript (Clipchamp or the LMS's auto-captioning) as a .vtt and upload alongside the MP4, or burn in via the editor if the LMS lacks caption support.

</details>

2. **Silent looping display** — Create a 10-slide kiosk loop video for a reception screen.
<details><summary>Solution</summary>

Set Transitions > After to 8 seconds and Apply To All, use Fade transitions, no narration. Export > Create a Video > HD (720p) > Don't Use Recorded Timings and Narrations is wrong here because timings are wanted; choose Use Recorded Timings (slide timings count) and set Seconds spent on each slide as fallback. Play the MP4 in the screen's media player with repeat enabled.

</details>

### Interview Questions

**Q: A client wants their 40-slide SOP training as a video that they can update quarterly. What do you build?**
A deck recorded per slide with the narration script in the notes, so any slide can be re-recorded in isolation, plus an export checklist. Animations are automatic, videos embedded as MP4, captions generated from the script as a .vtt. I hand over the .pptx with recordings intact, the exported MP4 and the caption file, and a one-page procedure for re-recording a slide and re-exporting. This costs more upfront than a one-take screen recording but makes quarterly updates a fifteen-minute job.

**Q: Why might an exported video be silent on some slides?**
Those slides have no audio object, usually because recording was stopped and restarted from a later slide, or Clear Narrations was run on them, or the audio was recorded with the wrong microphone. I check each slide for the speaker icon, re-record the silent ones with Record > From Current Slide, and confirm the playback settings show Start: Automatically. If the whole video is silent, the export used "Don't Use Recorded Timings and Narrations".

**Q: Compare recording in PowerPoint with a screen recorder for training content.**
PowerPoint keeps slides editable and lets you re-record per slide, renders animations at full quality, and gives you the notes as a teleprompter; a screen recorder captures anything on screen including live software and is better for demos. For slide-based SOP training I use PowerPoint and insert screen recordings via Insert > Screen Recording where a demo is needed, which gets both benefits in one file.

## PowerPoint interview questions

Interviews for document production, analyst and operations roles rarely ask "do you know PowerPoint"; they ask you to fix a slide, explain a template decision or describe a report you built. This chapter gathers the questions that come up most, with the reasoning behind strong answers, and a practical test format you should expect.

### The practical test

Common format: a messy 8-slide deck and 20 minutes. What they observe:

```text
Structure   Do you check View > Slide Master first, or start nudging shapes?
Speed       Ctrl+M, Ctrl+D, Alt+F10, Align/Distribute, Format Painter, Replace Fonts
Judgement   Do you rewrite titles as messages and cut decoration, or make it prettier?
Data        Do you re-paste the Excel chart with Use Destination Theme & Link Data?
Finish      Check Accessibility, Inspect Document, export a PDF, sensible file name
```

Narrate as you work. "I am resetting the layout because someone hand-formatted this slide; the master already has the right styles" tells them more than a silent fix.

### Question bank by theme

| Theme | Typical question | What a strong answer contains |
|---|---|---|
| Structure | Difference between master, layout, theme, template | Inheritance chain; .potx vs .thmx; why placeholders matter |
| Rebranding | How would you rebrand 50 decks? | Theme swap, layout names, Reset, Replace Fonts, colour audit, scripting |
| Data | Linked vs embedded charts | Portability vs freshness; where files live; break links before sending |
| Design | What makes a slide effective? | Action title, one visual, data-ink, consistency |
| Accessibility | What do you check for a 508 client? | Titles, alt text, reading order, contrast, tables, tagged PDF |
| Automation | Have you generated decks programmatically? | python-pptx from layouts, PptxGenJS for web, VBA for cleanup |
| Troubleshooting | Fonts changed / file too large / video fails | Embedding, cloud fonts, Compress Pictures/Media, MP4 |
| Process | How do you handle 20 rounds of client revisions? | Versioned file names, change log in notes, PDF proofs, template fixes over slide fixes |

### Behavioural questions with PowerPoint content

- *Tell me about a deck you are proud of.* Describe the problem (weekly status report took four hours), the system (template with linked charts and a notes-based data log), the outcome (40 minutes, no formatting errors in six months).
- *Tell me about a time a deliverable went wrong.* Fonts substituted on the client's Mac; fix was cloud fonts and a PDF; lesson was to ask about the viewing environment in the brief.
- *How do you handle a client who wants everything on one slide?* Show two versions, explain the reading test, keep the dense version in the appendix.

### Rapid-fire facts interviewers check

```text
Default widescreen size           13.333 x 7.5 in (16:9)
Theme colour slots                12: Dark/Light 1-2, Accent 1-6, Hyperlink, Followed Hyperlink
Theme fonts                       Heading (+mj-lt) and Body (+mn-lt)
Start show / from current         F5 / Shift+F5; Presenter View Alt+F5
Selection Pane                    Alt+F10; guides Alt+F9; grid Shift+F9
Duplicate / group / ungroup       Ctrl+D / Ctrl+G / Ctrl+Shift+G
Personal templates folder         Documents\Custom Office Templates
File is a ZIP of                  ppt/slides, slideLayouts, slideMasters, theme, media
Morph object matching             duplicate the slide, or name objects !!Name
Video export formats              MP4 (H.264/AAC) up to 4K; WMV legacy
Accessible PDF                    Export > Options > Document structure tags, no bitmap text
```

### How to prepare in a week

1. Build one complete branded .potx with twelve layouts and a hidden guide slide; bring it on a USB drive and be ready to walk through it.
2. Rebuild one of your real reports as a five-slide action-title deck with data-ink charts.
3. Practise the 20-minute cleanup on a deliberately messy deck until it takes ten.
4. Write and run one python-pptx script that generates slides from a CSV using your template.
5. Rehearse the three behavioural stories with numbers.

> **Interview note:** When you do not know a feature, say how you would find out ("I would check whether the Reading Order pane exists in that version; otherwise the Selection Pane gives the same order") rather than guessing. Interviewers for production roles value method over memorised menus.

### Try It Yourself

```text
Mock test (20 minutes, time yourself)
1. Open a deck with 3 masters, 6 fonts, text-box titles and a 3-D pie chart.
2. Slide Master: delete unused masters; rename layouts.
3. Replace Fonts to theme fonts; Reset every slide; move text-box titles into title placeholders.
4. Re-paste the chart from Excel with Use Destination Theme & Link Data; strip to data-ink; action title.
5. Align/Distribute the KPI row; Selection Pane names; alt text on images.
6. Check Accessibility to "Good to go"; Inspect Document; Save As Client_Deck_v02_2026-09-15.pptx; Export PDF.
```

### Quiz

1. In a practical test, what should you do first with a messy deck?
- [ ] Start aligning shapes on slide 1
- [x] Open Slide Master view to understand masters and layouts
- [ ] Apply a new theme immediately
> Understanding the structure explains most symptoms and prevents fixing the same problem on every slide.

2. How many theme colour slots are there?
- [ ] 6
- [x] 12
- [ ] 16
> Two dark, two light, six accents, two hyperlink colours.

3. The best answer to "linked or embedded charts?" is:
- [ ] Always linked
- [ ] Always embedded
- [x] It depends on where the files live and who receives the deck; explain both cases
> Trade-off answers with a concrete example show judgement.

### Exercises

1. **Story with numbers** — Write your "deck you are proud of" answer in five sentences with at least three numbers.
<details><summary>Solution</summary>

Example: "At Stewart Title the weekly production status deck took about four hours because charts were rebuilt by hand. I built a .potx with a Chart + commentary layout and linked the six charts to the reporting workbook on SharePoint. Titles became one-sentence findings and notes recorded the extraction date. Production time dropped to about 40 minutes and the deck went through two rebrands with a theme swap. The linked-chart approach required a strict folder convention, which I documented in a one-page guide."

</details>

2. **Explain inheritance in 60 seconds** — Write a spoken-word explanation of theme, master, layout and slide.
<details><summary>Solution</summary>

"A theme is the palette and fonts. The master applies them to default text styles and holds the logo. Layouts sit under the master and position placeholders for a purpose, such as a chart with commentary. Every slide is an instance of a layout, so it inherits everything above it. Rebranding changes the theme and master and cascades down; it fails wherever someone bypassed the chain with text boxes or hand-picked colours, which is why I build strictly on placeholders."

</details>

### Interview Questions

**Q: What is the single most important habit for producing professional decks quickly?**
Building on the slide master and layouts rather than on individual slides. It sounds like a design detail but it determines everything else: consistency, rebranding cost, accessibility, automation and speed. Every other technique, from Align and Distribute to python-pptx, works better on a deck that respects the inheritance chain. When I inherit a deck that does not, I estimate the cost of restructuring it before promising any redesign.

**Q: How do you handle a client who keeps asking for changes to individual slides?**
I look for the pattern behind the requests: five requests to move the logo mean the master is wrong; repeated font fixes mean the theme fonts are wrong. I fix the template once and re-apply it, then explain the change so the client sees fewer future rounds. I keep versioned files and a change log in the notes so any revision can be traced, and I send PDF proofs for approval to prevent edits landing on the wrong version.

**Q: Which PowerPoint feature do you think is most underused, and why?**
Slide layouts with prompt text. Most teams have a template with the default eleven layouts and build every real slide by hand on Blank. Purpose-built layouts with prompt text ("Key message, max 3 bullets") remove decisions, enforce the grid and make decks accessible and automatable by default. It is a few hours of work that removes weeks of slide fixing over a year.

**Q: What would you do in your first week owning a company's presentation templates?**
Inventory what exists and how decks are actually built, audit twenty recent decks for drift, interview three heavy users about what they hand-build, then produce a single versioned .potx with the layouts they need, a two-page guide, and a distribution plan through the organisation assets library. I would also set up the audit script so drift is measured, not guessed, and schedule a quarterly review with the brand owner.
