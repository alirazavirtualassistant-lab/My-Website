---
id: word-expert
title: Microsoft Word Expert
icon: 🅦
track: Office & Tools
color: #185ABD
runner: none
tagline: Templates, styles, TOCs, field codes, fonts and branding at professional-production level.
description: Microsoft Word taught to the expert level a document-production specialist needs: styles and templates (.dotx), multilevel numbering, sections and layouts, tables of contents and captions, field codes, cross-references, fillable legacy forms, font embedding, branding and rebranding, long-document QA, accessibility and PDF export.
---

# LEVEL: Beginner

## The Word interface & views

Word looks like a typewriter with buttons, and that is the trap: people type, then decorate. A production specialist treats Word as a structured document engine, and the first step is knowing where the structure is shown. Everything below refers to Word for Microsoft 365 on Windows (also valid for Word 2019/2021); Mac differences are noted where they matter.

### The window

| Area | What it holds | Open/close |
|---|---|---|
| Ribbon | Home, Insert, Draw, Design, Layout, References, Mailings, Review, View, Developer (hidden by default) | Ctrl+F1 collapses |
| Quick Access Toolbar | Your own most-used commands | Right-click any command > Add to Quick Access Toolbar |
| Navigation pane | Headings outline, page thumbnails, search results | View > Navigation Pane, or Ctrl+F |
| Styles pane | Every style with preview | Alt+Ctrl+Shift+S |
| Ruler | Margins, indents, tab stops | View > Ruler |
| Status bar | Page x of y, word count, language, Track Changes, view buttons, zoom | Right-click to customise |

Turn on the **Developer** tab now (File > Options > Customize Ribbon > tick Developer); forms, macros and content controls live there and you will use it from the Advanced level onward.

### Show formatting marks

Press **Ctrl+Shift+8** (Home > ¶). Word now displays paragraph marks (¶), spaces (·), tabs (→), page breaks and section breaks. Professionals work with marks on permanently, because most "why does this jump to the next page" problems are visible only this way: an empty paragraph, a manual page break, or a section break with a different layout.

```text
¶       end of paragraph; the paragraph's formatting is stored in this mark
·       space (a row of them means someone aligned with the spacebar)
→       tab
........Page Break........          manual page break (Ctrl+Enter)
::::::::Section Break (Next Page)   changes layout from here
°       non-breaking space (Ctrl+Shift+Space)
```

### Views

```text
View > Print Layout   what prints; default for production work
View > Web Layout     no pages; avoid, it hides layout problems
View > Outline        headings as a collapsible tree; promote/demote with Tab / Shift+Tab; move sections by dragging
View > Draft          text only, fast on very long files; shows section breaks as lines
View > Read Mode      for reading, not editing
View > Focus          hides the ribbon
Zoom: Ctrl+scroll; View > Multiple Pages to check facing pages; 100% for text, 25% for layout checks
```

**Outline view** is the fastest way to restructure a long document. A 767-page handbook with 400 headings can be reorganised by dragging chapters in Outline view, and body text moves with its heading.

### The Navigation pane

With headings applied (next chapters), View > Navigation Pane shows the document tree. Click to jump, drag to move whole sections, right-click to promote or delete a section including its content. If the pane is empty, the document has no real headings: it is manually formatted, and that is the first thing to fix.

### Selecting and moving efficiently

```text
Click in the left margin           select the line;  double-click: paragraph;  triple-click: whole document
Ctrl+click in a sentence           select the sentence
Ctrl+Shift+Down                    extend selection to end of paragraph
Alt+drag                           select a vertical block (columns of text)
F8                                 extend-selection mode; Esc to leave
Shift+Alt+Up / Down                move the current paragraph (or table row, or heading with its content in Outline) up/down
Ctrl+Shift+N                       apply Normal style
Alt+Ctrl+1 / 2 / 3                 apply Heading 1 / 2 / 3
Ctrl+Space                         remove direct character formatting
Ctrl+Q                             remove direct paragraph formatting
```

Shift+Alt+Up/Down alone justifies learning shortcuts: it reorders table rows and list items without cut and paste.

### Options every production machine should set

```text
File > Options
  Display:   tick Show all formatting marks (or use Ctrl+Shift+8)
  Proofing:  AutoCorrect Options > AutoFormat As You Type: untick "Automatic bulleted lists",
             "Automatic numbered lists", "Border lines", "Set left- and first-indent with tabs"
  Advanced:  Cut, copy and paste > Pasting from other programs: Keep Text Only
             Show measurements in units of: inches or centimetres to match the client
             Use smart cut and paste: leave on
  Save:      AutoRecover every 5 minutes; Default file format .docx
```

Turning off automatic lists prevents Word from inventing formatting that breaks numbering later; you will apply list styles deliberately instead.

> **Tip:** Right-click the status bar and turn on **Section**, **Line Number** and **Track Changes**. Knowing which section the cursor is in saves minutes every time a header or page number misbehaves.

### Try It Yourself

```text
Setup checklist for a fresh Word install (production machine)
-------------------------------------------------------------
1. File > Options > Customize Ribbon > tick Developer
2. Ctrl+Shift+8 to show formatting marks; leave on
3. View > Navigation Pane on; View > Ruler on
4. Status bar: right-click > Section, Line Number, Word Count, Track Changes
5. File > Options > Proofing > AutoCorrect Options > AutoFormat As You Type: untick automatic lists and borders
6. File > Options > Advanced > Pasting from other programs: Keep Text Only
7. Quick Access Toolbar: add Styles pane, Paste Special, Show Field Codes, Update Field
```

### Quiz

1. Which shortcut shows paragraph marks and other hidden characters?
- [ ] Ctrl+Shift+S
- [x] Ctrl+Shift+8
- [ ] Ctrl+8
> Home > ¶ toggles formatting marks; production work is done with them visible.

2. Where is a paragraph's formatting stored?
- [ ] In the first character
- [x] In the paragraph mark (¶) at its end
- [ ] In the page header
> Deleting a paragraph mark merges the paragraph into the next and it takes the next paragraph's formatting.

3. What does an empty Navigation pane tell you about a document?
- [x] It has no real heading styles applied
- [ ] It is too long
- [ ] It is protected
> The pane lists Heading-styled (or outline-levelled) paragraphs only.

4. Which shortcut moves a paragraph or table row up without cut and paste?
- [ ] Ctrl+Up
- [x] Shift+Alt+Up
- [ ] Alt+Up
> Shift+Alt+Up/Down moves paragraphs, list items, table rows and, in Outline view, whole sections.

### Exercises

1. **Diagnose a jump** — A heading keeps landing at the top of a new page although no page break was inserted. Which marks and settings would you check?
<details><summary>Solution</summary>

Turn on Ctrl+Shift+8 and look above the heading for a manual page break or an empty paragraph with "Page break before". Then check the heading's paragraph settings (Paragraph > Line and Page Breaks): "Page break before" or "Keep with next" chained through several short paragraphs can push it. Finally check the status bar for a section change and a Next Page section break.

</details>

2. **Restructure fast** — Move chapter 7 before chapter 4 in a 200-page manual in under a minute.
<details><summary>Solution</summary>

View > Navigation Pane, drag the "Chapter 7" heading above "Chapter 4". All body text, sub-headings, tables and figures under it move together. Alternatively View > Outline, collapse to Level 1, select the heading and press Shift+Alt+Up three times.

</details>

### Interview Questions

**Q: What is the first thing you do when a client sends a Word file to fix?**
I turn on formatting marks and open the Navigation pane. If the pane is empty, the document was formatted by hand and the fix starts with applying real styles. Marks show me spacebar alignment, empty paragraphs used as spacing, manual page breaks and stray section breaks, which are the causes of almost every "the layout jumps" complaint. Then I check the status bar for section count and the Styles pane for how many ad-hoc styles exist. That five-minute inspection tells me whether it is a two-hour cleanup or a rebuild.

**Q: Why do you keep formatting marks on all the time?**
Because Word stores formatting in invisible characters, and I cannot fix what I cannot see. A paragraph mark holds paragraph formatting, a section break holds page setup, and a non-breaking space or manual line break explains odd wrapping. With marks on I spot double spaces, tab alignment and empty paragraphs immediately, and I never delete a section break by accident. New users find it noisy for a day; after that it is impossible to work without.

**Q: When do you use Outline view rather than the Navigation pane?**
Outline view when I need to see and change structure in bulk: promote or demote many headings with Tab and Shift+Tab, show only Level 1 and 2 to audit chapter structure, or move large sections. The Navigation pane is better for quick jumps and for a client who wants to check the structure without being scared by a strange view. For a 767-page handbook I used Outline view to normalise 400 headings to three levels before generating the table of contents.

## Paragraph & character formatting done right

Word has two formatting layers: **character** (font, size, bold, colour) and **paragraph** (alignment, spacing, indents, line breaks). Learning what each layer controls, and doing spacing with numbers instead of Enter and spacebar, is the foundation for styles in the next chapter.

### Character formatting

```text
Home > Font (Ctrl+D)
  Font, style, size, colour, underline style, effects (strikethrough, superscript, small caps, all caps, hidden)
  Advanced tab: character spacing (scale, expanded/condensed, kerning above N pt), OpenType ligatures, number forms
Shortcuts: Ctrl+B / I / U;  Ctrl+Shift+K small caps;  Ctrl+= subscript;  Ctrl+Shift+= superscript
           Ctrl+] / Ctrl+[ grow or shrink 1 pt;  Ctrl+Shift+> / < grow or shrink by preset steps
           Ctrl+Space   remove all direct character formatting (back to the style)
```

**Hidden** text (Font > Hidden) is useful for reviewer notes in a template; it prints only if File > Options > Display > Print hidden text is on.

### Paragraph formatting

```text
Home > Paragraph (launcher, or Alt+O then P in older versions)
  Indents and Spacing:
     Alignment: Left / Centred / Right / Justified   (Ctrl+L / Ctrl+E / Ctrl+R / Ctrl+J)
     Outline level: Body Text or Level 1–9 (what the Navigation pane and TOC read)
     Indentation: Left, Right, Special (First line / Hanging) by amount
     Spacing: Before, After (in points), Line spacing: Single / 1.5 / Double / At least / Exactly / Multiple
  Line and Page Breaks:
     Widow/Orphan control (on by default), Keep with next, Keep lines together, Page break before
     Suppress line numbers, Don't hyphenate
Shortcuts: Ctrl+0 add/remove 12 pt before; Ctrl+1 / Ctrl+2 / Ctrl+5 line spacing; Ctrl+M indent; Ctrl+Q reset
```

Two rules replace a lot of habit:

1. **Space with Before/After, never with empty paragraphs.** Body text: 0 pt before, 6 pt after. Headings: 18 pt before, 6 pt after. An empty paragraph is a blank line that can land at the top of a page and leave a visible gap.
2. **Use "Keep with next" on headings**, so a heading never sits alone at the bottom of a page. Heading styles have it by default; manually formatted headings do not.

### Line spacing that behaves

| Setting | Behaviour | Use |
|---|---|---|
| Single / Multiple 1.08 | Proportional to font size | Ordinary body text (1.08 is Word's default) |
| Multiple 1.15–1.3 | Slightly open | Training manuals, readability |
| Exactly 14 pt | Fixed baseline regardless of font | Tables, forms, Urdu Nastaliq (set to about 1.8× size) |
| At least 12 pt | Grows for tall characters/images | Paragraphs with inline images |

"Exactly" clips large inline images and tall glyphs; "At least" is the safe fixed-ish option.

### Tabs and indents

Never align with spaces. Use the ruler or **Paragraph > Tabs**: set a position, alignment (left, centre, right, decimal, bar) and an optional leader (dots for a contents-style list). A **right tab at the right margin** puts a date on the right of the same line as a name on the left. A **hanging indent** (Special: Hanging 0.25 in) makes numbered clauses and references wrap under their own text, which is what list styles do internally.

```text
Signature line: "Prepared by" ........ "Date"
  Paragraph > Tabs: 6.5 in, Right, Leader none  ->  type "Prepared by", Tab, "Date"
Clause 4.2.1 with wrapped text:
  Indentation: Left 0.5 in, Special Hanging 0.5 in; a tab after the number aligns the text
```

### Breaks and special characters

```text
Ctrl+Enter          page break (use rarely; prefer "Page break before" on a heading style)
Shift+Enter         line break inside the same paragraph (addresses, poetry)
Ctrl+Shift+Space    non-breaking space (keep "PKR 5,000" or "Mr. Raza" together)
Ctrl+Shift+-        non-breaking hyphen;  Ctrl+-  optional hyphen
Alt+Ctrl+.          ellipsis;  Alt+Ctrl+- em dash;  Ctrl+Num-  en dash
```

### Format Painter and Reveal Formatting

**Format Painter** (Ctrl+Shift+C copies, Ctrl+Shift+V pastes) copies formatting between selections; double-click the brush to paint repeatedly. **Reveal Formatting** (Shift+F1) shows every property of the selected text and what comes from the style versus direct formatting, and it is the tool for answering "why is this paragraph different".

> **Warning:** Every bold, size change or indent applied by hand is **direct formatting** layered on top of the style. It survives style changes, breaks consistency across 700 pages, and is what Ctrl+Space and Ctrl+Q strip away. The next chapter shows how to never need it.

### Try It Yourself

```text
Body paragraph specification (apply, then capture as a style in the next chapter)
--------------------------------------------------------------------------------
Font:            Calibri 11 pt, colour Automatic
Alignment:       Left
Indent:          Left 0, Right 0, First line 0
Spacing:         Before 0 pt, After 6 pt, Line spacing Multiple 1.15
Line/Page:       Widow/Orphan control ON, Keep with next OFF
Heading 2 specification
Font:            Calibri Light 16 pt, colour RGB 24,90,189, bold
Spacing:         Before 18 pt, After 6 pt, Line spacing Single
Line/Page:       Keep with next ON, Keep lines together ON
Outline level:   Level 2
```

### Quiz

1. How should you create space between paragraphs?
- [ ] Press Enter twice
- [x] Set Spacing After (or Before) in points
- [ ] Add a blank line with a space in it
> Empty paragraphs create stray gaps at page tops and break "Keep with next".

2. What does Ctrl+Space do?
- [x] Removes direct character formatting, reverting to the style
- [ ] Inserts a non-breaking space
- [ ] Applies Normal style
> Ctrl+Q does the same for paragraph formatting; Ctrl+Shift+N applies Normal.

3. Which line spacing option clips tall inline images?
- [ ] Multiple 1.15
- [x] Exactly
- [ ] At least
> Exactly fixes the line height; At least grows when content is taller.

4. What keeps a heading on the same page as the paragraph after it?
- [ ] Widow/Orphan control
- [x] Keep with next
- [ ] Page break before
> Keep with next is set on heading styles by default and must be added to manual headings.

### Exercises

1. **Signature block** — Create a line with "Reviewed by: ____" at the left and "Date: ____" ending exactly at the right margin, using no spaces for alignment.
<details><summary>Solution</summary>

Paragraph > Tabs: clear all, set a tab at the right margin position (6.5 in on Letter with 1 in margins), alignment Right, leader None. Type "Reviewed by: ______", press Tab, type "Date: ______". Resizing margins later moves the tab if you use a style with the tab defined.

</details>

2. **Find the difference** — Two paragraphs use Normal style but one has more space below. Explain how to find and remove the cause.
<details><summary>Solution</summary>

Click in the odd paragraph, Shift+F1 (Reveal Formatting) and expand Paragraph > Spacing; it shows the value and, with "Distinguish style source" ticked, whether it is direct formatting. Press Ctrl+Q to strip direct paragraph formatting, or fix the style if both paragraphs are meant to differ by design.

</details>

### Interview Questions

**Q: What is the difference between character and paragraph formatting, and why does the distinction matter?**
Character formatting applies to runs of text: font, size, bold, colour, spacing, and it is stored on the characters. Paragraph formatting applies to the whole paragraph: alignment, indents, spacing, line and page breaks, outline level, and it is stored in the paragraph mark. It matters because styles are built from these two layers, because Ctrl+Space and Ctrl+Q reset them separately, and because copying a paragraph without its mark loses the paragraph formatting. When a client's document "loses formatting on paste", it is almost always the paragraph mark that was left behind.

**Q: How do you stop a table or heading from being split across pages?**
For a heading, Keep with next on its paragraph, which Heading styles already include. For a short table, apply Keep with next to every row except the last and Keep lines together to each row, or set the table row property "Allow row to break across pages" off. For a long table, let it break but repeat the header row. I set these in styles rather than per paragraph so a 700-page document gets the behaviour everywhere.

**Q: Why are empty paragraphs and spacebar alignment a problem in a production document?**
They are fragile: an empty paragraph can float to the top of a page and create a visible gap, and spaces align only in one font and size, so a rebrand or a font substitution shifts everything. They also confuse accessibility tools and screen readers, which announce blank lines. Space Before/After and tab stops are deterministic and survive edits, so I strip empties with Find and Replace (^p^p to ^p) and replace multiple spaces with tabs as the first cleanup step.

## Styles (why never format manually)

A **style** is a named set of formatting. Apply "Heading 1" and Word applies twenty settings at once; change the style and every Heading 1 in the document updates. Styles also drive the Navigation pane, table of contents, cross-references, numbering and accessibility. A production document uses styles for every paragraph and no direct formatting, which is why this is the most important chapter in the course.

### The five style types

| Type | Symbol in Styles pane | Applies to | Examples |
|---|---|---|---|
| Paragraph | ¶ | Whole paragraph, includes font settings | Normal, Heading 1, Body Text, Caption |
| Character | a | Selected text within a paragraph | Strong, Emphasis, Code Char |
| Linked | ¶a | Behaves as paragraph or character depending on selection | Heading 1 (linked by default) |
| Table | table icon | Whole tables | Table Grid, Grid Table 4 Accent 1 |
| List | list icon | Multilevel numbering schemes | List Number, custom "Clause Numbering" |

### Applying and inspecting

```text
Styles gallery      Home tab, Ctrl+Shift+S opens the Apply Styles box (type a name)
Styles pane         Alt+Ctrl+Shift+S; Options > Select styles to show: All styles / In use / In current document
Style Inspector     Styles pane > Style Inspector button: shows paragraph style + direct formatting + character style + direct
Reveal Formatting   Shift+F1
Select All N Instances   right-click a style in the pane > Select All (then apply another style to all)
Clear formatting    Home > Clear All Formatting (removes style and direct formatting -> Normal)
```

### Creating and modifying styles

```text
Styles pane > New Style (or right-click a formatted paragraph > Styles > Create a Style)
  Name:            Body Text  (avoid names that already exist unless you mean to redefine them)
  Style type:      Paragraph
  Style based on:  (no style)  for Normal-like bodies; Normal for everything else
  Style for following paragraph: Body Text (for headings: Body Text, so Enter after a heading gives body)
  Format > Font / Paragraph / Tabs / Border / Numbering / Shortcut key
  [x] Add to the Styles gallery   [ ] Automatically update  (never tick)   (o) New documents based on this template
Modify:   right-click the style > Modify
```

**Style for following paragraph** is what makes a template pleasant: Heading 1 → Body Text, Caption → Body Text, Table Heading → Table Text.

**Automatically update** must stay off: with it on, any direct change to one paragraph rewrites the style for the whole document, which is how a client "accidentally made every heading red".

### Inheritance: "based on"

Styles inherit from their base. If Body Text is based on Normal and Normal's font changes, Body Text changes too unless it overrides the font. Design the tree deliberately:

```text
Normal (Calibri 11, 1.15, 6 pt after)
├── Body Text (no changes; exists so Normal can stay untouched for tables/footers)
│   ├── Body Text Indent (Left 0.5 in)
│   └── Note (Italic, 10 pt, shaded)
├── Heading 1 … Heading 9 (based on Normal, keep with next)
├── Caption (9 pt, italic)
└── Table Text (10 pt, 0 pt after, Exactly 12 pt)
```

Keep **Normal** minimal and base everything on it, or base the body on "(no style)" if you need Normal free for Word's own uses (headers, footers, table cells default to Normal).

### Headings and outline levels

Built-in Heading 1–9 are special: they carry outline levels, feed the TOC and Navigation pane, and can be numbered by a list style. Custom heading styles work if you set **Paragraph > Outline level**, but built-ins are safer for cross-references, accessibility and clients who use the Navigation pane. Rename the look, not the name: modify Heading 1 to your brand rather than creating "Chapter Title".

### Style sets and themes

**Design > Document Formatting** offers Style Sets (a coordinated redefinition of the built-in styles) and **Themes** (colour and font sets). Styles that use theme colours (Accent 1) and theme fonts (+Headings, +Body) rebrand when the theme changes, which is the mechanism behind the Expert-level rebranding chapter. Choose "Blue, Accent 1" rather than an explicit RGB in a style if the brand should be switchable.

### Cleaning a manually formatted document

1. Select All, Ctrl+Space and Ctrl+Q to strip direct formatting (after saving a copy).
2. Apply Heading 1/2/3 with Alt+Ctrl+1/2/3 while scrolling in Outline view; or use Find and Replace with Format > Font (Bold, 14 pt) → Replace with Style Heading 1.
3. Apply Body Text to the rest (right-click Normal > Select All Instances > click Body Text).
4. Check the Styles pane with "In use" filter; delete stray styles ("Normal + Bold, 12 pt" is a sign of Automatically update or of pasted formatting).

> **Interview note:** "Why not just make it bold and bigger?" Because a 767-page handbook needs 400 headings identical, numbered, listed in a TOC and readable by a screen reader; only styles do all four, and a rebrand becomes one dialog instead of 400 edits.

### Try It Yourself

```text
Style definitions for a policy manual template
----------------------------------------------
Normal          Calibri 11, Multiple 1.15, After 6, Left, Widow/Orphan on
Heading 1       +Headings 20 bold, Accent 1, Before 24 After 12, Keep with next, Page break before, Level 1, next: Body Text
Heading 2       +Headings 15 bold, Accent 1, Before 18 After 6, Keep with next, Level 2, next: Body Text
Heading 3       +Headings 12 bold, Text 1, Before 12 After 4, Keep with next, Level 3, next: Body Text
Body Text       based on Normal, no changes
Note            based on Body Text, italic 10 pt, shading Accent 1 lighter 80%, border left 3 pt Accent 1
Caption         9 pt italic, After 10, Keep with next off, next: Body Text
Table Text      10 pt, After 0, Exactly 12 pt
Table Heading   based on Table Text, bold, white, Keep with next
Shortcut keys:  Body Text Ctrl+Shift+B; Note Ctrl+Shift+O (Format > Shortcut key in the style dialog)
```

### Quiz

1. What does "Style for following paragraph" control?
- [x] The style applied to the new paragraph when you press Enter
- [ ] The style of the previous paragraph
- [ ] The style used in the table of contents
> Set headings to be followed by Body Text so typing flows naturally.

2. Why must "Automatically update" stay off?
- [ ] It slows Word down
- [x] Any direct change to one paragraph silently rewrites the style everywhere
- [ ] It disables the Navigation pane
> It is the classic cause of "every heading changed colour when I edited one".

3. Which style property feeds the Navigation pane and TOC?
- [ ] Font size
- [x] Outline level
- [ ] Keep with next
> Built-in Heading styles carry outline levels 1–9; custom styles need the level set explicitly.

4. What does right-click > Select All Instances on a style do?
- [x] Selects every paragraph using that style so another style can be applied to all
- [ ] Deletes the style
- [ ] Copies the style to the template
> It is the fastest way to remap a stray style to the correct one.

### Exercises

1. **Convert a hand-formatted SOP** — The document uses bold 14 pt for headings and bold 12 pt for sub-headings. Convert them to Heading 1 and Heading 2 without clicking each one.
<details><summary>Solution</summary>

Ctrl+H, click in Find what (leave empty), More > Format > Font: Bold, 14 pt; click in Replace with, Format > Style > Heading 1; Replace All. Repeat with 12 pt bold → Heading 2. Then select all and Ctrl+Space to remove the leftover direct bold so the heading style controls the look. Check the Navigation pane.

</details>

2. **Design the style tree** — A client wants body text in Georgia and headings in Montserrat, switchable to another brand later. How do you define the styles?
<details><summary>Solution</summary>

Design > Fonts > Customize Fonts: Heading font Montserrat, Body font Georgia, save as "ClientName". In styles use +Body and +Headings rather than explicit font names, and theme colours rather than RGB. Rebranding is then Design > Fonts and Design > Colors, and the styles follow.

</details>

### Interview Questions

**Q: A client says "styles are too complicated, I just format by hand". How do you respond?**
I show them the Navigation pane and the table of contents, which only work with styles, and I demonstrate changing one heading style and watching 40 headings update. Then I set up their template so that styles are the easy path: headings on Alt+Ctrl+1/2/3, Body Text on a shortcut, and "Style for following paragraph" so Enter does the right thing. The argument that lands with managers is cost: a rebrand or a font change on a hand-formatted 200-page manual is days of work, on a styled one it is minutes.

**Q: Explain style inheritance and how a bad "based on" tree causes problems.**
Every style inherits any property it does not override from its base. If Body Text, Table Text and Footer are all based on Normal and someone changes Normal to 12 pt, all of them grow. That is useful when intended and a disaster when not, for example when a client changes Normal to double-spaced for a letter and the table cells explode. I keep Normal minimal, base body styles on it deliberately, base table and footer styles on "(no style)" or a separate small base, and document the tree in the template notes.

**Q: How do you find and remove rogue styles in a document?**
Open the Styles pane with "In current document" and sort alphabetically; anything like "Normal + Bold" or "Style 1" is a sign of pasted or auto-updated formatting. I use right-click > Select All Instances, apply the correct style, then delete the rogue style, which reassigns any leftovers to its base. The Style Inspector shows what direct formatting remains, and Ctrl+Space plus Ctrl+Q clears it. In a large document I also run the Document Inspector to strip hidden styles from the file itself, which reduces file size and speeds up opening.

## Page setup & margins

Page setup decides whether a document prints correctly, binds correctly and reads well. It is stored per **section**, so a document can mix portrait and landscape, or A4 and Letter, and the decisions belong in the template before any content exists.

### The Page Setup dialog

```text
Layout > Page Setup launcher (or double-click the ruler's grey area)
  Margins:  Top / Bottom / Left / Right (or Inside / Outside), Gutter and Gutter position
            Orientation: Portrait / Landscape
            Multiple pages: Normal / Mirror margins / 2 pages per sheet / Book fold
            Apply to: Whole document / This section / This point forward
  Paper:    Paper size (A4 210 x 297 mm, Letter 8.5 x 11 in, Legal, custom), paper source
  Layout:   Section start; Headers and footers: Different odd and even, Different first page;
            From edge: Header 0.5 in, Footer 0.5 in; Vertical alignment; Line Numbers; Borders
  Set As Default  (writes to the attached template; use only in your own template)
```

### Margins that work

| Document | Margins | Notes |
|---|---|---|
| Letter / memo | 1 in all round | Letterhead may need 1.5 in top on page 1 |
| Policy manual (single-sided) | 1 in, or 1.25 in left for binding | Add Gutter 0.25 in if hole-punched |
| Bound manual (double-sided) | Mirror margins, Inside 1.25 in, Outside 0.75 in | Gutter on the inside |
| Form | 0.75 in | Keep inside printer limits (about 0.25 in minimum) |
| Report with narrow columns | 1 in with two columns | Line length stays readable |

Measure is the reason margins matter: 11 pt Calibri on A4 with 1 in margins gives about 95 characters per line, which is above the comfortable 60–75. Use 1.25 in margins or 12 pt, or accept it for reference documents where scanning matters more than reading.

### Sections carry page setup

Changing orientation or margins for part of a document requires a **section break** (Layout > Breaks > Section Breaks > Next Page). Word inserts one automatically when you set Apply to: This point forward. The next chapter covers sections in depth; here the point is that page setup is a section property, so a document with one landscape rate matrix has at least three sections.

### Paper size and printer reality

Set paper size to what will be printed on. A4 documents printed on Letter (or the reverse) scale or clip depending on driver settings. For US clients (title-insurance reports, for instance) use Letter; for Pakistan and most of the world use A4. File > Options > Advanced > Print > "Scale content for A4 or 8.5 x 11 paper sizes" is on by default and hides mismatches until the printed page looks wrong.

### Headers, footers and the "From edge" setting

Header and footer distance is set in Layout tab > From edge. If the header content is taller than the space between the edge and the top margin, Word pushes the body down and the "top margin" grows silently. For letterheads with a tall header, set the top margin explicitly larger (1.5–1.75 in) so body text starts in a predictable place.

### Columns

```text
Layout > Columns > More Columns
  Presets: One / Two / Three / Left / Right; Number of columns; Width and spacing; Line between
  Apply to: Whole document / This section / This point forward (inserts a Continuous section break)
Layout > Breaks > Column   forces text to the next column
```

Columns are a section property. For a two-column newsletter body with a full-width title, the title sits in a one-column section followed by a Continuous section break and a two-column section.

### Page and paragraph borders, line numbers

**Design > Page Borders** applies to the section (measure from text or from edge). **Layout > Line Numbers** is a section property used in legal drafts and in QA review copies of policy manuals so reviewers can cite "page 12, line 34".

### Vertical alignment and title pages

Layout tab > Vertical alignment: **Center** on a section containing only the title page centres the title block without empty paragraphs. Put the title page in its own section (Next Page break) so the alignment does not apply to the body.

> **Tip:** Save page setup as part of your `.dotx` (Set As Default while editing the template). A client then starts every document with the right paper, margins, header distance and orientation, and the "why is my page wider than yours" conversation never happens.

### Try It Yourself

```text
Page setup for a double-sided bound policy manual (A4)
------------------------------------------------------
Layout > Page Setup
  Margins:   Multiple pages: Mirror margins; Inside 1.25 in (31.75 mm), Outside 0.75 in; Top 1 in; Bottom 1 in
             Gutter 0 (already in Inside), Orientation Portrait, Apply to: Whole document
  Paper:     A4
  Layout:    Different odd and even ON, Different first page ON (for chapter openers), Header 0.5 in, Footer 0.5 in
Title page section: Next Page break after it; Vertical alignment Center; no header/footer
Landscape rate matrix: Next Page section before and after; Orientation Landscape; margins 0.75 in
```

### Quiz

1. Where is page setup stored in Word?
- [ ] In each paragraph
- [x] In the section
- [ ] In the header
> Different orientations or margins in one document require multiple sections.

2. Which setting gives a wider margin on the binding side of double-sided pages?
- [ ] Gutter position: Top
- [x] Mirror margins with a larger Inside margin
- [ ] Book fold
> Mirror margins swap inside/outside for odd and even pages.

3. What happens if the header is taller than the space above the top margin?
- [x] Word pushes the body text down, effectively increasing the top margin
- [ ] The header is clipped
- [ ] Word reduces the header font size
> Set the top margin deliberately larger for tall letterhead headers.

4. How do you centre a title page vertically without blank paragraphs?
- [ ] Press Enter until it looks right
- [x] Put it in its own section and set Layout > Vertical alignment to Center
- [ ] Use a table
> Vertical alignment is a section property; isolate the title page with a Next Page break.

### Exercises

1. **Landscape table in the middle** — A portrait report needs a landscape rate matrix on pages 8–9. Describe the exact steps and the check afterwards.
<details><summary>Solution</summary>

Click before the table, Layout > Breaks > Next Page; click after the table, Next Page again. Click in the middle section, Layout > Orientation > Landscape (applies to this section). Check headers and footers in the landscape section: unlink from previous if the page number position must move, or leave linked; verify the status bar shows three sections and the page numbers continue.

</details>

2. **Fix the wide lines** — A client's A4 manual in Calibri 11 has 95-character lines. Give two page-setup fixes that keep the page count reasonable.
<details><summary>Solution</summary>

Increase side margins to 1.25 in (about 80 characters) or set two columns of 3 in with 0.3 in spacing for reference content. Alternatively raise the body font to 12 pt with 1 in margins (about 85 characters). Do it in the template, then update the Body Text style spacing to keep page count under control.

</details>

### Interview Questions

**Q: A client prints your A4 document and the footer is cut off. What do you check?**
First the printer's paper size and driver: if the printer is set to Letter, the bottom of an A4 page falls outside the printable area. Then the footer's From edge distance: office printers usually cannot print within about 0.25 in of the edge, so a footer at 0.3 in with a two-line footer can be clipped. I set the footer distance to 0.5 in, keep the bottom margin at 1 in, and check File > Print preview at the client's paper size. If they print on both sizes, I build the document on Letter with generous margins so it fits A4 too.

**Q: Why do you put page setup in the template rather than in each document?**
Because consistency across a document suite comes from one source. If every SOP starts from the same .dotx, the paper size, margins, header distance, mirror settings and section layout for a title page are already right, and reviewers never see two SOPs with different margins. It also means a change, such as switching to hole-punched binding with a gutter, is a template edit followed by reattaching or updating documents, not 60 manual changes.

**Q: What is the difference between Gutter and Mirror margins?**
Gutter is extra space added to the binding edge on top of the margin, positioned left or top; Mirror margins turn Left/Right into Inside/Outside so odd and even pages mirror each other for double-sided printing. For a single-sided hole-punched manual I use a 0.25 in left gutter; for a double-sided perfect-bound book I use Mirror margins with a larger inside margin and no separate gutter, because the gutter would then be added to the inside anyway. Both are section properties, so the title page and the body can differ.

## Save formats (docx/dotx/pdf)

Choosing the right file format is a deliverable decision. A document, a template and a print PDF are three different products, and Word's Save dialogs hide options that decide whether fonts embed, whether a PDF is accessible, and whether a client accidentally overwrites the master.

### The formats you use

| Extension | What it is | When |
|---|---|---|
| .docx | Word document (Open XML) | Every editable deliverable since Word 2007 |
| .docm | Macro-enabled document | Only when VBA must travel with the file |
| .dotx | Word template | Master for new documents; opens as a fresh untitled copy |
| .dotm | Macro-enabled template | Templates with VBA (forms with automation) |
| .doc | Word 97–2003 binary | Only for legacy systems; loses newer features |
| .pdf | Portable Document Format | Distribution and print; not for editing |
| .rtf / .txt | Rich or plain text | Exchange with odd systems; plain text for scripts |
| .odt | OpenDocument | Clients on LibreOffice; check formatting |
| .htm | Web page | Rarely; for email signatures or Wix imports |

A `.docx` is a zip of XML parts: `word/document.xml`, `word/styles.xml`, `word/numbering.xml`, `word/settings.xml`, media, and header/footer parts. That structure is why Word files are scriptable (python-docx, docx.js) and why a corrupt file can sometimes be repaired by unzipping it.

### Save, Save As, Save a Copy

```text
Ctrl+S             save; on OneDrive/SharePoint with AutoSave on, saves happen continuously
F12                Save As: choose location, name, type; Tools > Save Options / Compatibility Options
File > Save a Copy (shown instead of Save As when AutoSave is on)
File > Info > Version History        restore earlier versions on OneDrive/SharePoint
File > Options > Save                Save AutoRecover every N minutes; Embed fonts in the file
Compatibility Mode (title bar)       the file is .doc or an old .docx; File > Info > Convert to upgrade
```

**Compatibility Mode** silently disables newer features (some table options, SVG icons, newer numbering behaviour). Convert before doing production work, then save as .docx.

### Saving a template

```text
F12 > Save as type: Word Template (*.dotx)
  Word switches the folder to Custom Office Templates (Documents\Custom Office Templates)
  Saving there makes it appear under File > New > Personal
Double-click a .dotx in Explorer  -> creates a new untitled document from it
Right-click > Open (or File > Open in Word) -> edits the template itself
```

The template's own margins, styles, headers, building blocks and default text travel into every document created from it. The Advanced level covers template attachment and the Normal template.

### PDF export done right

```text
File > Save As > PDF  (or File > Export > Create PDF/XPS)
  Options...
    Page range; Publish what: Document / Document showing markup
    Include non-printing information:
       [x] Create bookmarks using: Headings   (or Word bookmarks)
       [x] Document properties
       [x] Document structure tags for accessibility   (tagged PDF; keep ON)
    PDF options:
       [ ] PDF/A compliant   (archival; embeds all fonts, no transparency; tick for government/legal)
       [x] Optimize for image quality
       [ ] Bitmap text when fonts may not be embedded   (only if a font blocks embedding)
       [ ] Encrypt the document with a password
  Optimize for: Standard (publishing online and printing) / Minimum size (publishing online)
```

"Standard" keeps images at up to 220 ppi (controlled by File > Options > Advanced > Image Size and Quality > "Do not compress images in file" and default resolution). For print-quality PDFs set **Default resolution: High fidelity** and tick **Do not compress images** before inserting images, then export with Standard.

**Microsoft Print to PDF** is different: it is a printer driver, produces no bookmarks, no tags and no hyperlinks. Never use it for deliverables.

### Fonts in PDFs

Word embeds fonts in the PDF when the font's licence allows. Fonts marked "Print & Preview" or "Editable" embed; "Restricted" fonts do not, and the PDF shows a substitute on other machines. Check by opening the PDF in Acrobat > File > Properties > Fonts. Font embedding for the .docx itself is a separate setting covered at Advanced level.

### Reducing file size

- File > Info > Check for Issues > Inspect Document removes hidden data and comments.
- Picture Format > Compress Pictures (220 ppi for print, 150 for screen; tick "Delete cropped areas").
- Delete unused building blocks and styles; remove embedded fonts if not needed.
- Save As a new .docx: Word rewrites the file and drops orphaned parts.

> **Warning:** Never send the `.dotx` itself as the client's "document". They will open it, type into it and save, and the template is gone. Deliver a `.docx` created from the template plus the `.dotx` in a separate "templates" folder with instructions.

### Try It Yourself

```text
Deliverable set for a policy manual
-----------------------------------
PolicyManual_v3.docx          editable, created from the template, fonts embedded if the client lacks them
PolicyManual_v3.pdf           Save As PDF, Standard, bookmarks from Headings, structure tags ON, PDF/A OFF
PolicyManual_v3_PRINT.pdf     as above but with images at high fidelity and PDF/A ON if the printer asks
templates/PolicyManual.dotx   the master; README explains File > New > Personal
README.txt                    fonts required (Montserrat, Merriweather: Google Fonts links), how to update the TOC (Ctrl+A, F9)
```

### Quiz

1. What happens when you double-click a .dotx in File Explorer?
- [x] A new untitled document is created from it
- [ ] The template opens for editing
- [ ] Word asks for a password
> To edit the template itself, use File > Open inside Word or right-click > Open.

2. Which PDF export option produces a tagged, accessible PDF?
- [ ] Optimize for image quality
- [x] Document structure tags for accessibility
- [ ] Bitmap text when fonts may not be embedded
> Tags carry headings, reading order and alt text into the PDF.

3. Why avoid Microsoft Print to PDF for deliverables?
- [ ] It is slower
- [x] It produces no bookmarks, tags or live hyperlinks
- [ ] It cannot handle A4
> Save As PDF and Export keep document structure; a print driver only rasterises pages.

4. What does Compatibility Mode indicate?
- [ ] The file is read-only
- [x] The file is in an older format and newer features are disabled
- [ ] The file is on OneDrive
> Use File > Info > Convert to upgrade before production work.

### Exercises

1. **Print-quality PDF** — A client complains the logo and screenshots are fuzzy in your PDF. Fix the export.
<details><summary>Solution</summary>

File > Options > Advanced > Image Size and Quality: tick Do not compress images in file and set Default resolution to High fidelity (do this before inserting images, or re-insert). Then File > Save As > PDF > Options: Optimize for image quality, Standard. Check the logo is an SVG or 300 ppi PNG, not a low-res JPG.

</details>

2. **Template hand-off** — Explain to a client in three steps how to use the .dotx you delivered.
<details><summary>Solution</summary>

1. Copy PolicyManual.dotx into Documents\Custom Office Templates. 2. In Word, File > New > Personal > PolicyManual to start a new document. 3. To change the template itself, open Word first, File > Open, choose the .dotx, edit, save; never double-click it for editing.

</details>

### Interview Questions

**Q: What is the difference between a .docx and a .dotx, and how do you use each in a client delivery?**
Both are Open XML packages; a .dotx is a template that Word treats as a master, so opening it creates a fresh untitled document while the template stays untouched. I deliver the client's actual content as a .docx created from the template, and the .dotx separately in a templates folder with instructions to place it in Custom Office Templates. The .dotx also acts as the attached template for the .docx, so style updates can be pushed later with Automatically update document styles. Sending only a .dotx leads to clients overwriting the master within a week.

**Q: How do you produce a PDF that is both print-ready and accessible from Word?**
Save As PDF with Document structure tags on, bookmarks from headings, and Optimize for image quality, having first set image quality to high fidelity in Options so screenshots and logos are not downsampled to 220 ppi. I run the Accessibility Checker before export so headings, alt text and table headers are correct, and I verify in Acrobat that fonts show as embedded and that the tags panel has a heading tree. If the printer requires PDF/A I tick it, knowing it forbids transparency and some effects, and I keep a separate screen PDF with hyperlinks.

**Q: A Word file has ballooned to 80 MB. How do you shrink it?**
I check for images pasted at full camera resolution and run Compress Pictures at 220 ppi with cropped areas deleted, unless it is the print master. Then Inspect Document to remove hidden data, comments and revisions, check whether fonts are embedded unnecessarily, and delete unused styles and building blocks. Finally Save As to a new file name so Word rewrites the package without orphaned media. If the file still is huge, I unzip it and look in word/media to find the offending items directly.

# LEVEL: Intermediate

## Multilevel lists & numbering

Numbering is the feature clients complain about most: "the numbers restart", "clause 3 became 1", "the sub-items are indented wrong". The cause is nearly always numbering applied by button instead of by a **list style linked to heading styles**. Set it up once in the template and it never breaks.

### Three kinds of numbering

| Method | How | Reliability |
|---|---|---|
| Home > Numbering button | Direct list formatting on the paragraph | Fragile; each click can create a new list |
| Home > Multilevel List > List Library | A multilevel list applied to paragraphs | Better; still a "list template" without a name |
| Define New **List Style** linked to styles | Named list style whose levels are tied to Heading 1–9 or custom styles | Production standard |

### Defining a list style linked to headings

```text
Home > Multilevel List > Define New List Style
  Name: Clause Numbering
  Format > Numbering... opens Modify Multilevel list; click "More >>"
  For each level:
    Level 1: Enter formatting for number: "1"   Number style: 1, 2, 3   Link level to style: Heading 1
             Follow number with: Tab;  Add tab stop at 0.4 in;  Aligned at 0, Text indent 0.4 in
    Level 2: "1.1"  Include level number from: Level 1; style 1,2,3; Link to: Heading 2; indent 0.6 in
    Level 3: "1.1.1"  Link to: Heading 3; indent 0.8 in
    Level 4: "(a)"   Number style: a, b, c; Link to: List Paragraph or a custom "Clause 4" style
  Restart list after: Level above (default)
  Legal style numbering: tick to force "1.1.1" in Arabic even if a higher level uses Roman
  (o) New documents based on this template
```

Once linked, applying Heading 2 numbers the paragraph as 1.1, and the number is part of the style, not the paragraph. The Navigation pane, TOC and cross-references pick it up automatically.

### Indents that line up

The three values per level are **Aligned at** (where the number starts), **Text indent** (where wrapped lines start; also where the first line's text starts after the tab) and the tab stop. Set Text indent equal to the tab stop, and increase both per level by a constant (0.2–0.3 in). For deep numbers like 10.12.3 give level 3 a wider indent so the text does not collide with the number.

```text
Level  Number   Aligned at   Tab/Text indent
1      1        0.00 in      0.40 in
2      1.1      0.00 in      0.60 in
3      1.1.1    0.00 in      0.80 in
4      (a)      0.80 in      1.10 in
```

Many legal and policy documents prefer all headings flush left with only the text indent varying, which the table above gives.

### Bullets and simple numbered lists

Define **List Bullet** and **List Number** styles (built-in) with their own list template rather than clicking the toolbar buttons. Modify the style > Format > Numbering to fix the bullet character (use Symbol > Wingdings or a plain •) and indent. For second-level bullets use List Bullet 2. Because these are styles, Select All Instances and Modify fix every list at once.

### Restarting and continuing

```text
Right-click a numbered paragraph
  Restart at 1 / Continue Numbering / Set Numbering Value (start at N; or "Continue from previous list" with advance)
Appendix numbering: a second list style "Appendix" with Level 1 = "Appendix A" (style A, B, C) linked to a custom style Heading 1 Appendix (based on Heading 1, outline level 1)
Chapter-based figure numbers: Caption numbering > Include chapter number (needs Heading 1 with a list style)
```

Set Numbering Value with "Continue from previous list" is the fix when a table or a paragraph between list items has broken the sequence. Do not retype numbers.

### Cleaning broken numbering

1. Show the Styles pane with "In use". If you see many "List Paragraph" entries and no linked styles, the numbering is direct.
2. Select all numbered headings, apply the Clause Numbering list style (Multilevel List gallery > List Styles section), then reapply Heading 1/2/3.
3. For body lists, apply List Number / List Bullet styles and strip direct formatting with Ctrl+Q afterwards if indents look wrong (Ctrl+Q resets to the style's indents).
4. Check `numbering.xml` size in a corrupt file: hundreds of abandoned list definitions is a symptom; copy the content into a fresh template as a last resort.

> **Warning:** Do not click the Multilevel List gallery items on a document that already has a linked list style; the gallery's anonymous templates override the links and produce the "1, 1, 1" symptom. Always apply the named list style from the List Styles section.

### Try It Yourself

```text
Field-level definition of a clause numbering scheme (as entered in Modify Multilevel list, More >>)
--------------------------------------------------------------------------------------------------
Level 1  Number format: %1        Style: 1, 2, 3    Link: Heading 1   Follow with: Tab   Tab 0.4"  Text indent 0.4"
Level 2  Number format: %1.%2     Style: 1, 2, 3    Link: Heading 2   Tab 0.6"  Text indent 0.6"
Level 3  Number format: %1.%2.%3  Style: 1, 2, 3    Link: Heading 3   Tab 0.8"  Text indent 0.8"
Level 4  Number format: (%4)      Style: a, b, c    Link: Clause      Aligned 0.8"  Tab 1.1"  Text indent 1.1"
Level 5  Number format: (%5)      Style: i, ii, iii Link: Sub-clause  Aligned 1.1"  Tab 1.4"  Text indent 1.4"
Legal style numbering: ON      Restart after: level above
Test: apply Heading 1, Heading 2, Clause, Sub-clause, Heading 2 and expect 1, 1.1, (a), (i), 1.2
```

### Quiz

1. Which numbering method survives editing in a 700-page manual?
- [ ] Home > Numbering button
- [x] A named list style with levels linked to Heading styles
- [ ] Typing the numbers
> Linked list styles store numbering in the style, so applying a heading numbers it correctly.

2. What is the correct fix when a list continues as 1 instead of 5 after a table?
- [ ] Retype the number
- [x] Right-click > Set Numbering Value > Continue from previous list
- [ ] Delete the table
> Continue from previous list re-links the sequence without direct formatting.

3. What does "Legal style numbering" do?
- [x] Forces sub-level numbers to Arabic (1.1.1) even if a parent uses Roman
- [ ] Adds a section symbol
- [ ] Indents all levels equally
> It is used in contracts where Article I contains clause 1.1, not I.1.

4. Which value controls where wrapped lines of a numbered item begin?
- [ ] Aligned at
- [x] Text indent
- [ ] Number style
> Aligned at positions the number; Text indent positions the text and wrapped lines.

### Exercises

1. **Appendix numbering** — Add appendices lettered A, B, C with headings "Appendix A Glossary" that appear in the TOC and Navigation pane, without disturbing chapter numbers.
<details><summary>Solution</summary>

Create a paragraph style "Heading 1 Appendix" based on Heading 1 with Outline level 1. Define a second list style "Appendix" whose Level 1 has number format "Appendix %1", style A, B, C, linked to Heading 1 Appendix. Apply it to the appendix headings. In the TOC dialog use Options to include Heading 1 Appendix at level 1. Chapter numbering continues independently because it belongs to a different list style.

</details>

2. **Repair 1, 1, 1** — Every Heading 1 shows "1". Diagnose and fix.
<details><summary>Solution</summary>

Someone applied a gallery multilevel template or clicked Restart on each heading. Select all Heading 1 paragraphs (Select All Instances), apply the named list style from the gallery's List Styles section, then check right-click > Continue Numbering. If the list style itself is missing, define it again with Level 1 linked to Heading 1 and "Restart after" defaults.

</details>

### Interview Questions

**Q: A client's policy manual restarts numbering at random. What is your diagnosis and fix?**
Random restarts come from direct numbering applied with the toolbar, where Word creates a new list each time the button is clicked or content is pasted. I confirm it by checking that headings are not linked to a list style. The fix is to define one named multilevel list style with levels linked to Heading 1–3 and the clause styles, apply it, and reapply the heading styles; the numbers then follow the structure. I also turn off automatic numbered lists in AutoCorrect and give the client a one-page guide so they use styles, not buttons.

**Q: How do you number figures and tables by chapter, such as Table 3-2?**
Captions use a SEQ field; in the Caption dialog, Numbering > Include chapter number, chapter starts with style Heading 1, separator hyphen. That requires Heading 1 to be numbered by a list style, because Word reads the chapter number from the heading's list level. Then Table of Figures picks up the caption labels, and cross-references (Reference type Table, Only label and number) show "Table 3-2" and update with F9. If chapters are unnumbered by design I use plain sequential numbering, because forcing chapter numbers on unnumbered headings produces "Table 0-1".

**Q: What are the differences between List Paragraph, List Number and a list style?**
List Paragraph is the paragraph style Word applies when you click the numbering button; it carries no numbering itself, the numbering is direct formatting on top of it. List Number is a built-in paragraph style that can carry numbering inside the style definition, which is more robust for simple lists. A list style is a separate object that defines up to nine levels and can link each level to a paragraph style, which is what multilevel clause and heading numbering needs. In templates I use list styles for headings and clauses and List Bullet/List Number styles for body lists.

## Sections, breaks & different headers/footers

A **section** is the unit that carries page setup, columns, headers and footers, page numbering format and line numbering. Every long document is a chain of sections, and most header and footer problems are section problems. Learn to see the breaks and to control the "Link to Previous" chain.

### Break types

```text
Layout > Breaks
  Page Breaks:
    Page            Ctrl+Enter; text continues on the next page in the same section
    Column          text moves to the next column
    Text Wrapping   ends the line around an object
  Section Breaks:
    Next Page       new section starting on a new page (chapters, landscape pages, title page)
    Continuous      new section on the same page (column changes, different margins mid-page)
    Even Page / Odd Page   new section starting on the next even/odd page (chapters that must open on the right)
```

Show marks (Ctrl+Shift+8) to see `::::Section Break (Next Page)::::`. The break holds the formatting of the section **before** it. Deleting a break merges that section into the following one, which then takes the **following** section's page setup: this is why deleting a break "changes the whole chapter to landscape".

### Headers and footers per section

```text
Double-click the header area (or Insert > Header > Edit Header); the Header & Footer tab appears
  Navigation: Go to Header / Go to Footer, Previous, Next, Link to Previous (toggle)
  Options: Different First Page, Different Odd & Even Pages
  Position: Header from Top 0.5 in, Footer from Bottom 0.5 in; Insert Alignment Tab
  Insert: Page Number, Date & Time, Document Info (Author, File Name, File Path, Document Property...), Quick Parts > Field
Close Header and Footer (Esc)
```

A new section's header is **linked to previous** by default: it displays the same content. To change it, click **Link to Previous** to turn it off, then edit. Each of header, footer, first-page header, even-page header is linked separately, so turn off the link on each part that must differ.

### The typical manual structure

| Section | Break before | Setup | Header/Footer |
|---|---|---|---|
| 1 Title page | none | Vertical centre | none (Different First Page) |
| 2 Front matter | Next Page | Roman page numbers i, ii, iii | Footer: page number, restart at i |
| 3 Body | Next Page (or Odd Page) | Arabic page numbers, start at 1 | Header: chapter title via STYLEREF; footer: page x of y |
| 4 Landscape matrix | Next Page | Landscape | Linked to previous, but page number rotated or repositioned |
| 5 Body continues | Next Page | Portrait | Link to previous restored |
| 6 Appendices | Odd Page | Arabic continues | Header: "Appendix A" via STYLEREF of the appendix style |

### Page number formatting per section

```text
Header & Footer > Page Number > Format Page Numbers
  Number format: 1, 2, 3 / a, b, c / i, ii, iii / A, B, C
  Include chapter number (needs numbered Heading 1)
  Page numbering: Continue from previous section / Start at: 1
```

Roman for front matter and Arabic starting at 1 for the body is done here, section by section, with Link to Previous off for the footer where the format changes.

### Different odd and even

Double-sided documents put the page number on the outside edge: right on odd pages, left on even. Turn on Different Odd & Even Pages (a document-wide setting in Page Setup > Layout), then edit the Odd Page Footer and the Even Page Footer separately. With mirror margins this gives a professional bound look.

### Landscape pages in a portrait document

The page number should still appear at the bottom of the portrait page when the sheet is bound, which means at the left or right side of the landscape page, rotated. Two clean methods:

1. Put the page number in a **text box** in the landscape footer, rotated 90°, positioned at the binding-side margin, with `{ PAGE }` inside; unlink the footer from previous.
2. Keep the table portrait and rotate the **content**: insert the table inside a text box or a one-cell table with rotated text direction (Table Layout > Text Direction). Simpler for reviewers, harder to edit.

### Troubleshooting sections

- **Header disappears in one chapter**: that section's header was unlinked and emptied; relink or re-enter.
- **Page numbers restart unexpectedly**: Format Page Numbers > Start at was set in some section; change to Continue.
- **Blank page after a section break**: an Odd Page break is doing its job, or an empty paragraph after a Next Page break; use Draft view to see breaks as lines.
- **Cannot delete a break**: switch to Draft view, click the break line and press Delete; then fix the merged section's setup.
- **Too many sections**: the status bar "Section" indicator; Continuous breaks left by column changes can be removed if columns are no longer used.

> **Tip:** Before deleting a section break, click inside the section *after* it and note its page setup; after deletion, the merged section will use that setup. If needed, set the page setup on the earlier section first, then delete.

### Try It Yourself

```text
Building the front matter / body split (steps)
---------------------------------------------
1. Click at the end of the front matter; Layout > Breaks > Next Page
2. Double-click the body's footer; Header & Footer > Link to Previous (turn OFF)
3. Page Number > Format Page Numbers: format 1, 2, 3; Start at 1
4. Go to Previous (front matter footer); Format Page Numbers: format i, ii, iii; Start at i
5. Go to Header in the body; Link to Previous OFF; Quick Parts > Field > StyleRef > Heading 1 (chapter title)
6. Check status bar: Section 2 in the body; Print Preview pages 1–6 to confirm i, ii, iii then 1, 2, 3
```

### Quiz

1. Which formatting does a section break store?
- [ ] The formatting of the section after it
- [x] The formatting of the section before it
- [ ] Nothing; it is just a marker
> Deleting a break makes the earlier text adopt the following section's page setup.

2. How do you make one chapter's header different from the previous chapter's?
- [ ] Insert a page break and retype the header
- [x] Insert a section break, turn off Link to Previous, then edit
- [ ] Use a different style
> Headers are per section and linked by default; unlinking allows independent content.

3. What break makes chapters always start on a right-hand page?
- [ ] Continuous
- [ ] Next Page
- [x] Odd Page
> Odd Page inserts a blank even page when needed so the chapter opens on the recto.

4. Where do you set Roman numerals for the front matter?
- [x] Header & Footer > Page Number > Format Page Numbers, in that section
- [ ] File > Options > Display
- [ ] Insert > Symbol
> Number format and Start at are section properties set in Format Page Numbers.

### Exercises

1. **Landscape page numbers** — Add a page number to a landscape section so it prints where the portrait footer would be when bound.
<details><summary>Solution</summary>

In the landscape section's footer, turn off Link to Previous, insert a text box (Insert > Text Box > Draw), type Ctrl+F9 and enter PAGE inside the braces, F9 to update, rotate the box 90° (Shape Format > Rotate) and position it against the right (or binding) margin centred vertically; set Wrap Text to In Front of Text. Repeat for the following portrait section by relinking to the earlier portrait footer.

</details>

2. **Fix the missing chapter header** — Chapter 5's header is blank while others show titles. Restore it without retyping.
<details><summary>Solution</summary>

Open Chapter 5's header; if Link to Previous is off and the header is empty, click Link to Previous to inherit Chapter 4's header, which contains the STYLEREF field that shows the current chapter title automatically. If the header contains typed titles instead of a field, replace them with Quick Parts > Field > StyleRef Heading 1 in the first body section and relink all later sections.

</details>

### Interview Questions

**Q: A client deleted a section break and the whole document turned landscape. Explain why and how you fix it.**
The break they deleted stored the portrait setup of the text before it; once removed, that text merged into the following landscape section and adopted its page setup, because page setup belongs to the section and is stored in the break at its end. The fix is Ctrl+Z if possible; otherwise re-insert a Next Page break at the original point and set the earlier section back to portrait with Apply to: This section, then check that headers, footers and page numbering are relinked correctly. I explain the rule "the break holds the formatting of what comes before it" so it does not recur.

**Q: How do you set up a manual with front matter in Roman numerals and body pages starting at 1?**
A Next Page section break between the two parts, then in the body footer turn off Link to Previous, Format Page Numbers to Arabic starting at 1, and in the front-matter footer set Roman. The TOC then shows i–iv for the front matter and 1 onward for chapters. If the client wants the total in "Page x of y", NUMPAGES counts the whole file including front matter, so I use SECTIONPAGES or a formula field `{ = { NUMPAGES } - 4 }` in the body section, and I document that adjustment in the template notes.

**Q: What causes an unwanted blank page and how do you diagnose it quickly?**
Common causes are an Odd Page or Even Page section break doing its job, an empty paragraph after a table at the end of a page (Word requires a paragraph after a table), a manual page break followed by Page break before on a heading, or a paragraph with "Keep with next" chained to a large object. I check in Draft view where breaks show as lines, then with marks on. For the table case I set the trailing paragraph to 1 pt font and 0 spacing or hidden; for break duplication I remove the manual break and let the style's Page break before do the work.

## Tables (design, repeat header rows, widths)

Tables carry the data in most production documents: rate matrices, SOP step lists, approval grids, QA scorecards. A well-built table has a table style, fixed column behaviour, a repeating header row, and never uses spaces or empty rows for layout.

### Creating and converting

```text
Insert > Table > grid, or Insert Table (rows, columns, AutoFit behaviour: Fixed / to contents / to window)
Insert > Table > Convert Text to Table (choose separator: Tabs, Commas, Paragraphs)
Table Layout > Convert to Text (the reverse)
Paste from Excel: Paste Options > Keep Source Formatting / Use Destination Styles / Link & Keep Source Formatting / Picture
```

**Use Destination Styles** when pasting from Excel so the table takes the Word template's fonts and table style. **Link** only when the workbook will travel with the document; linked tables break when the client moves files.

### Table styles

Design a table style once (Table Design > New Table Style or modify "Grid Table 4 Accent 1") and apply it everywhere. A table style can format the whole table, header row, first column, banded rows, last row and so on; **Table Style Options** checkboxes turn those parts on per table.

```text
Table Design > New Table Style
  Name: Brand Table   Based on: Table Grid
  Apply formatting to: Whole table   -> font 10 pt, borders: inside horizontal 0.5 pt grey, outside none
  Apply formatting to: Header row    -> bold, white text, shading Accent 1, Repeat as header row
  Apply formatting to: Banded rows   -> shading Accent 1 lighter 90%
  Format > Table Properties > Options: default cell margins 0.05 in
  (o) New documents based on this template
Set as default: Table Design > right-click style > Set as Default
```

Pair the style with **Table Text** and **Table Heading** paragraph styles (0 pt after, Exactly 12 pt) so cell text does not inherit body spacing.

### Header rows that repeat

A table that spans pages must repeat its heading: select the header row(s), **Table Layout > Repeat Header Rows** (or Table Properties > Row > Repeat as header row at the top of each page). It only works on the first row(s) of the table and only if the table is not inside a text box or wrapped around.

Also set **Table Properties > Row > untick "Allow row to break across pages"** for tables where a row must stay together (SOP steps with multi-line cells).

### Column widths that stay put

Word's default AutoFit re-flows widths as content changes, which is why tables "keep moving".

```text
Table Layout > AutoFit
  AutoFit Contents   widths follow content (fine while drafting)
  AutoFit Window     table fills the text width and rescales with margins (good for portrait/landscape)
  Fixed Column Width  widths never change (production tables, forms)
Table Properties
  Table tab: Preferred width (inches or percent), Alignment, Text wrapping: None (never Around in long docs)
  Column tab: Preferred width per column; Next/Previous Column to step through
  Cell tab: Vertical alignment; Options: cell margins, Wrap text, Fit text
```

Set the table to a **percent width** (100%) with columns in percent when the same table must live in portrait and landscape sections or in a Letter and an A4 version of the template.

### Rate matrix example

A title-insurance rate matrix is a wide numeric table: coverage band in the first column, rates by policy type in others. Production choices:

- Landscape section, table width 100%, Fixed Column Width after setting percentages.
- Numbers right-aligned with a **decimal tab** in the cell paragraph (Paragraph > Tabs, alignment Decimal), so 1,250.00 and 875.50 line up on the point.
- Header row repeated; first column bold via Table Style Options > First Column.
- Cell margins 0.04 in; Exactly 11 pt line spacing; font 9 pt.

```text
Coverage band (USD)        Owner's        Lender's       Simultaneous
     0 –    100,000        575.00         450.00         100.00
100,001 –   250,000        875.50         650.00         125.00
250,001 –   500,000      1,250.00         900.00         150.00
```

### Sorting, formulas and merging

```text
Table Layout > Sort           by column, text/number/date, with a header row
Table Layout > Formula        =SUM(ABOVE), =SUM(LEFT), =AVERAGE(B2:B6), =A2*1.1  (result is a field; F9 to update)
Merge Cells / Split Cells     use sparingly; merged headers break accessibility and Convert to Text
Table Layout > Text Direction rotate header text for narrow columns
Table Layout > Properties > Alt Text   required for accessibility
```

Formula fields do not recalculate automatically; select the table and press F9 before delivery. For anything beyond totals, calculate in Excel and paste values.

### Tables for layout: when and how

Use a borderless table for forms and signature blocks, never for page layout of running text. Set borders to none, cell margins to give spacing, Fixed Column Width, and "Allow row to break across pages" off. Mark it as a layout table for accessibility by leaving header row off and adding no alt text that implies data.

> **Warning:** Tables with text wrapping set to "Around" float like images and can jump pages, hide behind other content and ignore Repeat Header Rows. Table Properties > Text wrapping: None for every table in a long document.

### Try It Yourself

```text
Production table setup (steps for any data table)
-------------------------------------------------
1. Insert > Table > Insert Table: columns, rows, AutoFit: Fixed column width
2. Table Design > apply "Brand Table"; Table Style Options: Header Row, Banded Rows, First Column as needed
3. Select row 1 > Table Layout > Repeat Header Rows
4. Table Properties > Table: Preferred width 100%, Alignment Center, Text wrapping None
   Row: untick Allow row to break across pages (short rows) ; Column: set percentages 40 / 20 / 20 / 20
   Alt Text: "Rate matrix: owner's and lender's premiums by coverage band"
5. Select numeric columns > Paragraph > Tabs > Decimal tab at 0.6 in > Right-align
6. Apply Table Text to all cells (Select Table, Ctrl+Shift+S, "Table Text"), Table Heading to row 1
7. Ctrl+A, F9 to recalculate any formula fields; check the page break preview
```

### Quiz

1. Which setting keeps a table's column widths from changing as content is edited?
- [ ] AutoFit Contents
- [x] Fixed Column Width
- [ ] AutoFit Window
> Fixed widths are essential for production tables; AutoFit is for drafting.

2. Where is "Repeat as header row" set?
- [ ] Table Design > Header Row checkbox
- [x] Table Layout > Repeat Header Rows or Table Properties > Row
- [ ] Paragraph settings
> The Table Design checkbox only styles the row; repetition is a row property.

3. Why avoid Text wrapping: Around on tables?
- [x] The table floats like an image and can jump pages and ignore header repetition
- [ ] It removes borders
- [ ] It disables sorting
> Long-document tables must be inline (wrapping None) to behave predictably.

4. How do you align currency values on the decimal point in a cell?
- [ ] Add spaces
- [x] A decimal tab stop in the cell paragraphs
- [ ] Merge the cells
> Decimal tabs align digits regardless of length; spaces only work in monospace fonts.

### Exercises

1. **Portrait to landscape safe table** — Build a table that fills the text width correctly in both a portrait and a landscape section of the same document.
<details><summary>Solution</summary>

Table Properties > Table > Preferred width: 100% (Measure in: Percent); Column tab: each column in percent summing to 100; AutoFit: Fixed Column Width after setting percentages. When the table is cut and pasted into a landscape section it expands to the wider text area proportionally.

</details>

2. **Repair a pasted Excel table** — A pasted rate matrix arrived with Calibri 11, Excel colours and columns overflowing the page. Fix it in four steps.
<details><summary>Solution</summary>

Select the table, Table Design > apply Brand Table; Select Table > apply Table Text paragraph style and Ctrl+Space to remove Excel fonts; Table Properties > Preferred width 100%, AutoFit Window then Fixed Column Width; Repeat Header Rows on row 1 and set decimal tabs for numeric columns. If pasting again, use Paste Options > Use Destination Styles to skip most of this.

</details>

### Interview Questions

**Q: A 40-page rate table loses its header on every page after page 1. What are the possible causes?**
Repeat Header Rows is not set, or it is set on a row that is not the first row of the table, or the table has text wrapping Around, or the "table" is actually several tables stacked (each a separate table, so only the first has a header), or the header row is inside a merged cell structure that Word cannot repeat. I check Table Properties for wrapping, click in row 1 and confirm the Repeat toggle, then use Table Layout > Select Table to see whether it is one table; if not, I join them by deleting the paragraph between them.

**Q: How do you build a table that a client can edit without breaking the layout?**
A table style for appearance so they cannot easily override colours, Fixed Column Width so typing does not resize columns, Table Text and Table Heading paragraph styles so spacing is consistent, header rows repeating, and wrapping None. I also set the table to 100% width so margin changes do not push it off the page, and I lock nothing, because locked tables generate support requests. For forms, the same table gets content controls in the cells so the client fills without touching structure.

**Q: When do you use Word table formulas versus linking to Excel?**
Word formulas such as =SUM(ABOVE) are fine for a total row in a document that will not change often, with the caveat that fields update only on F9 or print, which I document. Linking to Excel keeps numbers live but breaks as soon as the workbook moves, so I use it only inside a controlled folder for recurring reports like a weekly production status. For anything with real calculation I compute in Excel and paste as values with Use Destination Styles, so the Word file is self-contained and the table style applies.

## Images, shapes & text wrapping

Images and shapes are where Word documents become unstable: pictures jump to other pages, text boxes vanish, and captions detach. The rule for production documents is **In Line With Text** for almost everything, and anchored, locked positioning for the few objects that must float.

### Inserting images properly

```text
Insert > Pictures > This Device / Stock Images / Online Pictures
Insert > Icons (SVG), Insert > Screenshot, Insert > 3D Models (avoid in print docs)
Picture Format tab: Compress Pictures, Change Picture (keeps size/wrap), Reset Picture, Crop, Alt Text, Wrap Text, Position
Before inserting: File > Options > Advanced > Image Size and Quality: Do not compress images in file (print masters)
```

Prefer PNG for screenshots, diagrams and logos, JPG for photographs, **SVG** for logos and icons (Word 2016+; scales without loss and exports to PDF as vector). Insert at the intended size rather than pasting a 4000 px screenshot and shrinking it.

### Wrap options and the anchor

| Wrap Text | Behaviour | Use |
|---|---|---|
| In Line With Text | The image is a character in the paragraph; moves with the text | Default for manuals, figures with captions |
| Square / Tight / Through | Text flows around the object; object anchored to a paragraph | Sidebars, small logos beside text |
| Top and Bottom | Object on its own line, text above and below; still floating | Wide figures where inline is awkward |
| Behind Text / In Front of Text | Object ignores text flow | Watermarks, letterhead art in headers, signatures |

Every floating object has an **anchor** (visible with marks on) in a paragraph; it moves when that paragraph moves. Right-click > Wrap Text > **Fix Position on Page** or Layout Options > **Move with text** decide whether the object follows the paragraph. For letterhead art in a header choose Behind Text, position relative to Page, and tick **Lock anchor**.

```text
Picture Format > Wrap Text > More Layout Options
  Position tab: Horizontal Absolute position 0.75 in to the right of Page; Vertical Absolute 0.5 in below Page
                [x] Lock anchor   [ ] Move object with text   [x] Allow overlap
  Text Wrapping tab: Behind text
  Size tab: Lock aspect ratio; Scale 100%
```

Set the default for new pictures: File > Options > Advanced > Cut, copy and paste > **Insert/paste pictures as: In line with text**.

### Captions and figures

Insert a caption with **References > Insert Caption** (label Figure or Table; New Label for "Exhibit"; Numbering > Include chapter number). A caption on an inline picture becomes a paragraph below the picture in Caption style; the picture paragraph should have **Keep with next** so figure and caption stay together. For floating pictures Word puts the caption in a text box, which is fragile; convert to inline first.

### Shapes, text boxes and SmartArt

**Insert > Shapes** creates floating objects; **Insert > Text Box** is a shape with text. Use them for call-outs and diagrams, then group (select several with Ctrl+click > Shape Format > Group) and set the group's wrap to Top and Bottom or In Line. For a diagram that must stay stable in a long document, draw it in a **Drawing Canvas** (Insert > Shapes > New Drawing Canvas) so every part moves together, or build it elsewhere and insert an SVG/PNG.

**SmartArt** (Insert > SmartArt) is good for org charts and process flows, exports to PDF cleanly, and is editable by clients; it is inline by default.

### The Selection Pane and layering

Home > Select > **Selection Pane** lists every floating object on the page, lets you hide, rename and reorder them (z-order), and is the only way to grab an object stuck behind text. Shape Format > Bring Forward / Send Backward adjust stacking.

### Alt text and accessibility

Every meaningful image needs **Alt Text** (right-click > View Alt Text): one or two sentences describing the content, or "Mark as decorative" for letterhead art. Screen readers and the PDF tags use it, and the Accessibility Checker flags missing alt text.

### Common problems and fixes

- **Image jumps to the next page**: it is floating and its anchor moved, or it is inline in a paragraph with "Keep with next" chained. Make it inline, put it in its own paragraph with Body Text style, and remove Keep with next except on the figure paragraph itself.
- **Picture appears cut off horizontally**: the paragraph has Exactly line spacing; change to Single or At least.
- **Cannot select an image**: it is Behind Text in the header; double-click the header area, or use the Selection Pane.
- **Compressed logo looks blurry**: Compress Pictures ran at 150 ppi; re-insert as SVG or 300 ppi PNG and set Do not compress images.
- **Text box disappears in PDF**: the box is outside the page margins or set to not print (Shape Format > Layout Options > Move with text off and positioned off-page).

> **Tip:** Draw diagrams as SVG in CorelDRAW or Illustrator and insert them inline. Word's own shapes are fine for one-off call-outs, but fifty floating shapes across a 700-page manual are a maintenance problem, while fifty inline SVGs behave like characters.

### Try It Yourself

```text
Stable figure recipe (inline picture + caption, chapter numbering)
-----------------------------------------------------------------
1. Place the cursor in an empty Body Text paragraph; Insert > Pictures > select PNG/SVG
2. Picture Format > Wrap Text > In Line With Text (or leave default if set in Options)
3. Picture Format > Alt Text: "Screenshot of the QA scorecard form with five rating rows"
4. Paragraph of the picture: apply style "Figure" (based on Body Text, centred, Keep with next, 12 pt before, 0 after)
5. References > Insert Caption: Label Figure, Position Below selected item, Numbering: Include chapter number (Heading 1, hyphen)
6. Caption style: 9 pt italic, centred, 12 pt after; check the Navigation pane is unaffected
7. Cross-reference in text: References > Cross-reference > Figure > Only label and number
```

### Quiz

1. Which wrap setting keeps an image moving with its text like a character?
- [x] In Line With Text
- [ ] Square
- [ ] Behind Text
> Inline images cannot jump pages independently and work with captions and Keep with next.

2. What does the anchor of a floating object determine?
- [ ] Its size
- [x] Which paragraph it is attached to and moves with
- [ ] Its alt text
> With marks on, the anchor icon shows the paragraph; Lock anchor stops it moving.

3. Why do letterhead images belong in the header with Behind Text?
- [ ] Headers print at higher resolution
- [x] They repeat on every page and never interfere with body text flow
- [ ] Behind Text is the only option in headers
> Position relative to Page plus Lock anchor keeps them fixed on all pages of the section.

4. Which pane finds an object hidden behind text?
- [ ] Navigation Pane
- [x] Selection Pane
- [ ] Styles Pane
> Home > Select > Selection Pane lists every floating object, even when it cannot be clicked.

### Exercises

1. **Watermark-style letterhead art** — Place a full-width header graphic that appears on every page of the body, is not selectable by accident, and does not push the body text down.
<details><summary>Solution</summary>

Double-click the header, Insert > Pictures, set Wrap Text > Behind Text, More Layout Options: Horizontal Alignment Centered relative to Page, Vertical Absolute 0 below Page, Lock anchor on, Move with text off. Close the header. Because the image is Behind Text and positioned relative to the page, it does not enlarge the header area; set the top margin explicitly to where body text should start.

</details>

2. **Convert a chaotic document** — A 60-page SOP has 40 floating screenshots that keep moving. Give a fast conversion plan.
<details><summary>Solution</summary>

Set Insert/paste pictures as In line with text in Options. Use the Selection Pane per page or Ctrl+A in the body to select objects, then Wrap Text > In Line With Text (multiple selected floating pictures accept the change together via Picture Format when all are pictures). Put each in its own Figure-style paragraph, re-add captions with Insert Caption, and check that no text boxes were used for captions; convert those to plain paragraphs. Finally Compress Pictures at 220 ppi for the deliverable copy.

</details>

### Interview Questions

**Q: A client complains that images in their manual keep moving to other pages. What is your standard fix?**
The images are floating with anchors that move when text is edited. I convert them to In Line With Text, give each its own paragraph in a Figure style with Keep with next so the caption stays attached, and re-insert captions with References > Insert Caption rather than text boxes. I also set the default insert behaviour to inline in Options so new screenshots do not reintroduce the problem. Floating is reserved for header art and true sidebars, positioned relative to the page with the anchor locked.

**Q: How do you handle logos and diagrams so they stay sharp in the PDF?**
I insert logos as SVG when the client's Word version supports it, which exports as vector to PDF, or as PNG at 300 ppi at final size, and I set Do not compress images in file before inserting so Word does not downsample to 220 ppi. Diagrams come from CorelDRAW as SVG or EMF. Before export I check File > Options for compression settings and export with Optimize for image quality. If a client sends a JPG logo, I ask for the vector and explain that scaling a JPG up is why it looks fuzzy.

**Q: What is the difference between a text box and a table cell for a call-out box, and which do you use?**
A text box floats: it has an anchor, can jump pages, is hard to select behind text, and its contents are not always read in order by screen readers. A single-cell table is inline: it flows with the text, breaks predictably, can carry a table style with shading and a coloured border, and is accessible. For call-outs such as "Note" or "Warning" in manuals I use either a paragraph style with shading and a left border, or a one-cell table, and I reserve text boxes for pull quotes in marketing pieces.

## Headers/footers/page numbering

Headers and footers are the product's packaging: document title, chapter, version, confidentiality notice, page numbers. Built with fields and styles they update themselves; built by typing they go stale on page one of every revision. This chapter shows the field-driven approach that scales to a 767-page handbook.

### Anatomy and styles

Header and footer content uses the **Header** and **Footer** paragraph styles, which by default carry a centre tab at the middle of the text width and a right tab at the right margin. Use those tabs (left text, Tab, centre text, Tab, right text) instead of spaces. Modify the styles in the template: 8–9 pt, grey, 0 pt after. Add a bottom border to Header for a rule under the header.

### Alignment tabs

**Header & Footer > Insert Alignment Tab** creates tabs that stay at the centre and right of the text area even if margins change, unlike fixed tab stops. Use them in templates that ship in A4 and Letter versions.

### Page numbers with fields

```text
Header & Footer > Page Number > Bottom of Page > Plain Number 2  (inserts { PAGE } in a centred paragraph)
Or type it: Ctrl+F9 to insert { }, type PAGE inside, F9 to update; Alt+F9 toggles all field codes
Common patterns
  Page { PAGE } of { NUMPAGES }              whole document count
  Page { PAGE } of { SECTIONPAGES }          pages in this section (each section restarted at 1)
  { PAGE \* ROMAN }  { PAGE \* alphabetic }  format switches (i, ii or a, b)
  { = { NUMPAGES } - 3 }                     "of" count excluding a 3-page front matter (nested fields: Ctrl+F9 twice)
  { PAGE \# "000" }                           zero-padded 001
```

Page Number > Format Page Numbers sets the format and the start value per section (previous chapter). Never type page numbers.

### Document information fields

```text
Header & Footer > Document Info: Author, File Name, File Path, Document Title, Document Property (Company, Subject, Keywords, Category, Status, Comments)
Quick Parts > Field:
  { TITLE }             from File > Info > Title
  { DOCPROPERTY Company }  any built-in property; custom properties via File > Info > Properties > Advanced > Custom
  { FILENAME \p }       file name with path (useful in draft footers; remove for final)
  { SAVEDATE \@ "d MMMM yyyy" }   last saved date;  { DATE } prints today's date (changes on every open: avoid in footers)
  { STYLEREF "Heading 1" }        the text of the nearest Heading 1 above (running chapter title)
  { STYLEREF "Heading 1" \n }     its number only;  \l takes the last occurrence on the page
  { SECTION }           section number
```

**STYLEREF** is the field that puts the current chapter in the header of every page automatically. Combine `{ STYLEREF "Heading 1" \n }` and `{ STYLEREF "Heading 1" }` for "3 Quality Control". For dictionary-style headers use `\l` on the right page to show the last heading on the page.

### Version and confidentiality lines

Store version, status and owner as custom **document properties** (File > Info > Properties > Advanced Properties > Custom: add "Version" = 3.2, "Status" = Approved). Insert them in the footer with `{ DOCPROPERTY Version }`. Changing the property and pressing Ctrl+A, F9 updates every footer, and the same property can appear on the title page and in the TOC header.

```text
Footer layout (left / centre / right using the Footer style tabs)
  { DOCPROPERTY Company } · Confidential     Tab     Page { PAGE } of { NUMPAGES }     Tab     v{ DOCPROPERTY Version } · { SAVEDATE \@ "MMM yyyy" }
```

### First page and odd/even

**Different First Page** removes the header from a title page or gives a letter a full letterhead on page one and a light continuation header afterwards. **Different Odd & Even** mirrors the page number to the outside edge for bound documents. Both options are set per section (Page Setup > Layout) and each variant has its own Link to Previous.

### Updating and locking fields

Fields update on print (File > Options > Display > Update fields before printing, tick it) and with F9 on a selection; Ctrl+A then F9 updates body fields, but header/footer fields must be updated separately (open the header, Ctrl+A, F9) or by toggling Print Preview. **Ctrl+F11** locks a field so it will not update; **Ctrl+Shift+F9** converts a field to plain text permanently, used when the client wants a frozen "as of" date.

### Common mistakes

- Typing the chapter name into every chapter's header instead of STYLEREF: 40 headers to edit on every reorganisation.
- Using `{ DATE }` in a footer: the document dates itself to whenever it is opened.
- Large header images inline in the header paragraph: they enlarge the header and push body text down; use Behind Text positioned relative to the page.
- Header style modified per section with direct formatting: the template's Header style is ignored.

> **Interview note:** Interviewers ask "how would you show the current chapter title in the header". The answer is STYLEREF, and mentioning `\n` and `\l` switches shows you have built real manuals.

### Try It Yourself

```text
Header and footer field codes for a policy manual (Alt+F9 view)
---------------------------------------------------------------
Header (body section, odd pages):
  { STYLEREF "Heading 1" \n } { STYLEREF "Heading 1" }                          [Tab] [Tab] { DOCPROPERTY Title }
Header (even pages):
  { DOCPROPERTY Title }                                                            [Tab] [Tab] { STYLEREF "Heading 2" }
Footer (all body pages):
  { DOCPROPERTY Company } — Internal                                              [Tab] Page { PAGE } of { NUMPAGES } [Tab] v{ DOCPROPERTY Version } · { SAVEDATE \@ "MMM yyyy" }
Front matter footer: { PAGE \* roman } centred, Link to Previous OFF, Start at i
File > Options > Display: [x] Update fields before printing
```

### Quiz

1. Which field shows the current chapter title in a header automatically?
- [ ] TITLE
- [x] STYLEREF "Heading 1"
- [ ] SECTION
> STYLEREF pulls the text of the nearest paragraph in the named style; \n gives its number.

2. Why avoid `{ DATE }` in a footer?
- [x] It shows the date the file is opened or printed, not a fixed date
- [ ] It cannot be formatted
- [ ] It only works in headers
> Use SAVEDATE, CREATEDATE, or a document property for a controlled date.

3. How do you update fields inside headers and footers?
- [ ] Ctrl+A, F9 in the body updates them too
- [x] Open the header/footer area and press Ctrl+A, F9, or enable Update fields before printing
- [ ] They update automatically on every keystroke
> Header/footer stories are separate from the body for field updates.

4. What does Ctrl+Shift+F9 do to a selected field?
- [ ] Locks it temporarily
- [x] Converts it to plain text permanently
- [ ] Toggles the field code display
> Ctrl+F11 locks; Alt+F9 toggles codes; Ctrl+Shift+F9 unlinks.

### Exercises

1. **Version-controlled footer** — Build a footer that shows "v3.2 · Approved · 14 Sep 2026" and can be changed in one place.
<details><summary>Solution</summary>

File > Info > Properties > Advanced Properties > Custom: add Version (3.2), Status (Approved), ApprovedDate (text "14 Sep 2026"). In the footer insert `{ DOCPROPERTY Version }`, `{ DOCPROPERTY Status }`, `{ DOCPROPERTY ApprovedDate }` separated by " · ". To change, edit the properties and update fields (open footer, Ctrl+A, F9). Custom properties can also be set by python-docx or VBA for batch releases.

</details>

2. **Page x of y excluding front matter** — The body starts at page 1 after four Roman-numbered pages; "of y" must show body pages only.
<details><summary>Solution</summary>

In the body footer use `Page { PAGE } of { = { NUMPAGES } - 4 }`, inserting nested braces with Ctrl+F9 inside Ctrl+F9. Alternatively, if the body is one section, `{ SECTIONPAGES }` works without arithmetic. Document the "- 4" in the template notes because it changes if front matter length changes.

</details>

### Interview Questions

**Q: How would you set up headers for a 767-page handbook with 40 chapters so they never need manual editing?**
One body section with Different Odd & Even, the odd header carrying `{ STYLEREF "Heading 1" \n } { STYLEREF "Heading 1" }` and the even header carrying the document title from `{ DOCPROPERTY Title }` plus `{ STYLEREF "Heading 2" }`. Page numbers are `{ PAGE }` with Format Page Numbers, and the footer pulls version and company from custom document properties. The header and footer styles are defined in the template with alignment tabs. Reorganising chapters then changes nothing in the headers because the fields read the structure.

**Q: What is the difference between DOCPROPERTY, TITLE and STYLEREF, and when do you use each?**
TITLE reads the built-in Title property, DOCPROPERTY reads any built-in or custom property by name, and STYLEREF reads the text of the nearest paragraph in a given style. I use DOCPROPERTY for values controlled outside the text, such as version, owner and classification, so they can be changed in one dialog or by a script; TITLE is just a special case of that. STYLEREF is for anything that varies with position in the document, like the running chapter or clause, because it updates itself as the page changes.

**Q: Fields in the client's footer show "Error! Unknown document property name". Why, and how do you fix it?**
The field references a custom property that does not exist in this document, usually because the footer was copied from another file or the property was renamed. I open File > Info > Advanced Properties > Custom and add the property with the expected name and value, then update the fields. If the client should not manage properties, I replace the field with a content control bound to a document property or a plain text field, and I note in the template README which properties the footer depends on so future documents created from the template already contain them.

# LEVEL: Advanced

## Templates (.dotx), the Normal template & attached templates

A template is the product a document-production specialist actually sells: the client gets a `.dotx` that makes every future document correct. Understanding how Word attaches templates, what Normal.dotm does, and how styles flow between template and document is what separates a "nice document" from a maintainable suite.

### What a template contains

| Stored in the .dotx | Notes |
|---|---|
| Styles (paragraph, character, table, list) | The core; includes theme colour/font references |
| Page setup and sections | Margins, paper, header/footer layouts, title page section |
| Boilerplate content | Cover page, approval table, revision history, placeholder headings |
| Headers/footers with fields | STYLEREF, DOCPROPERTY, PAGE fields already in place |
| Building Blocks | Insert > Quick Parts entries (call-out boxes, signature blocks, cover pages) stored in the template |
| Custom document properties | Version, Owner, Classification with default values |
| Theme | Design > Themes > Save Current Theme, embedded in the file |
| Macros (only .dotm) | VBA modules; a .dotx cannot store code |
| Content controls and protection | For forms |

### Normal.dotm

Every new blank document is created from **Normal.dotm** (`%APPDATA%\Microsoft\Templates\Normal.dotm`). It stores Word's default styles, page setup, AutoText and any macros the user records. It is per user and per machine, so nothing a client will ever see should depend on it. Set As Default buttons in the Font, Paragraph and Page Setup dialogs write to Normal, which is fine for your own machine and useless for delivery. If Normal becomes corrupt (odd defaults, crashes), close Word, rename Normal.dotm, and Word rebuilds it.

### Creating a template the right way

1. Start from a blank document, not from an existing client file (which carries hidden junk in styles.xml and numbering.xml).
2. Design > Fonts/Colors: create and save the brand theme.
3. Define the style tree (Beginner level), list styles (Intermediate), table style, Header/Footer styles.
4. Page setup, sections for the title page and body, header/footer fields.
5. Insert boilerplate: cover, revision table, "Purpose" heading, and instructions as **hidden text** or as content-control placeholders.
6. Save Building Blocks into the template: select content > Insert > Quick Parts > Save Selection to Quick Part Gallery > Save in: this template.
7. File > Info > Properties: set defaults for custom properties.
8. F12 > Word Template (.dotx) into Custom Office Templates; test by File > New > Personal.

```text
Template checklist before delivery
  [ ] Styles pane "In current document" shows only intended styles
  [ ] Heading 1–3 linked to the list style; test 1 / 1.1 / 1.1.1
  [ ] TOC field present with correct levels; Update Field works
  [ ] Headers/footers use fields; Different First Page / Odd & Even as designed
  [ ] Building Blocks saved in this template (not Building Blocks.dotx or Normal)
  [ ] Custom properties present with placeholder values
  [ ] Fonts available to the client or embedded (see Fonts chapter)
  [ ] Compatibility mode off; saved as .dotx; opened via File > New to test
```

### Attached templates and style updating

Every document has an **attached template** (Developer > Document Template, or File > Options > Add-ins > Manage: Templates). A document created from `PolicyManual.dotx` remains attached to it by path. Two things flow from the attachment:

```text
Developer > Document Template
  Document template: C:\...\Custom Office Templates\PolicyManual.dotx   [Attach...]
  [ ] Automatically update document styles     <- when ticked, styles in the document are refreshed from the template on every open
  Organizer...                                 <- copy styles, macros and building blocks between files
```

**Automatically update document styles** is how you push a rebrand: update the template's styles, tick the box in the documents (or set it once in the template so new documents inherit it), and each document refreshes its style definitions on open. Direct formatting is not touched, which is another reason to avoid it. Turn the option off again for archived, approved documents so they never change silently.

### The Organizer

**Developer > Document Template > Organizer** (also Styles pane > Manage Styles > Import/Export) copies styles between any two files. Use it to bring a corrected Heading 2 into 60 existing SOPs, or to copy a table style from a template into a document that lost it. Copying from template to document overwrites the document's definition without asking, so keep copies.

### Global templates and add-ins

A template loaded under **Templates and Add-ins > Global templates** makes its macros and Building Blocks available in every document without attaching. Studio macros (numbering repair, field update, export) belong in a global `.dotm` in `%APPDATA%\Microsoft\Word\STARTUP`, where Word loads it at start. This keeps client deliverables macro-free while your own tools stay available.

### Template versioning and distribution

Name templates with a version (`PolicyManual_v1.3.dotx`), keep a CHANGELOG inside the template as hidden text or in a Building Block, and distribute via a shared folder set as the **Workgroup templates** location (File > Options > Advanced > File Locations) so the whole team sees them under File > New > Shared. When a client has SharePoint, the template lives in the library's content types.

> **Warning:** A document attached to a template by an absolute path (C:\Users\Ali\...) will show that path on the client's machine and cannot auto-update. Set the attachment on the client's side, or rely on the styles already copied into the document and treat the .dotx as the master for *new* documents only.

### Try It Yourself

```text
Rebrand push across existing documents (procedure)
--------------------------------------------------
1. Open PolicyManual_v1.3.dotx via File > Open; change Design > Colors and Fonts; adjust Heading 1 colour; save as v1.4
2. Open a document created from v1.3: Developer > Document Template > Attach... > v1.4; tick Automatically update document styles; OK
3. Ctrl+A, F9 to refresh fields; open headers and F9 there too; check Navigation pane and TOC
4. Untick Automatically update document styles (freeze) and save
5. For 60 documents: a VBA loop that opens each, sets ActiveDocument.AttachedTemplate, .UpdateStylesOnOpen = True, saves, then sets it False (Expert level shows the pattern)
```

### Quiz

1. Where should Set As Default in the Font dialog never be used?
- [ ] On your own machine
- [x] As a way to deliver settings to a client
- [ ] In a template
> Set As Default writes to Normal.dotm, which is per user and never travels with the file.

2. What does "Automatically update document styles" do?
- [x] Refreshes the document's style definitions from the attached template on open
- [ ] Updates fields
- [ ] Converts direct formatting to styles
> It is the mechanism for pushing a template change into existing documents.

3. Which file type can store macros?
- [ ] .dotx
- [x] .dotm
- [ ] .pdf
> The x formats are macro-free by design; m formats carry VBA.

4. Where do you store Building Blocks that must travel with the client's template?
- [ ] Building Blocks.dotx
- [ ] Normal.dotm
- [x] The client's .dotx itself (Save in: this template)
> Blocks saved elsewhere exist only on your machine.

### Exercises

1. **Rescue a junk-filled template** — A client's template has 180 styles, six numbering schemes and 40 MB. Rebuild it cleanly without losing the design.
<details><summary>Solution</summary>

Create a new blank document, set the theme and page setup, then use the Organizer to copy only the intended styles (Heading 1–3, Body Text, Table Text, Caption, table style, list style) from the old template. Recreate headers/footers with fields. Re-save Building Blocks from the old file into the new template. Save as .dotx and test numbering and TOC. The 40 MB usually comes from images in Building Blocks or embedded fonts; check and re-add only what is needed.

</details>

2. **Prove template attachment** — Show a client that a document is attached to the template and that style changes flow.
<details><summary>Solution</summary>

Developer > Document Template shows the attached path. Change Heading 1 colour in the template, save; in the document tick Automatically update document styles, close and reopen; Heading 1 changes. Then show that a manually coloured heading does not change, demonstrating why direct formatting is avoided.

</details>

### Interview Questions

**Q: A client says "we have a template" but every document looks different. What is going on?**
Usually the "template" is a .docx people copy and edit, so each copy carries its own drift: direct formatting, styles modified by Automatically update, pasted styles from other files. Nothing is attached, so nothing can be pushed. I convert their best document into a real .dotx with a clean style tree, list style, fields and Building Blocks, place it in a workgroup templates folder, and attach existing documents to it with Automatically update styles for one refresh. Then I give a short guide: new documents come from File > New, not from copying old files.

**Q: Explain the difference between Normal.dotm, an attached template and a global template.**
Normal.dotm is the per-user default for blank documents and for recorded macros; it never travels. An attached template is the .dotx a specific document was created from; it supplies styles on demand or on open and its Building Blocks appear in the galleries when the document is active. A global template is loaded for the whole Word session, typically from STARTUP, and provides macros and blocks to every document without being attached. Client deliverables rely only on attached templates; my own tooling lives in a global .dotm so it never leaks into a client file.

**Q: How do you version and roll out a template change to sixty existing SOPs?**
Bump the template version, record the change in its changelog, and test on one document. Then run a macro that opens each SOP, attaches the new template, sets UpdateStylesOnOpen, updates fields including headers, saves, and turns UpdateStylesOnOpen back off so approved documents freeze. I check a sample of the outputs for reflow, especially pagination near tables and figures, and I regenerate PDFs. The reason the macro can do this at all is that the documents use styles only; anything hand-formatted would need manual review.

## Table of contents, captions & table of figures

A table of contents is a field that reads outline levels, and captions are SEQ fields that a table of figures reads. Once headings and captions are styled, the whole apparatus builds itself and updates with F9. This chapter covers the dialog options, the TOC field switches, customisation of the TOC styles, and the errors that appear when documents were built carelessly.

### Inserting a TOC

```text
References > Table of Contents > Custom Table of Contents...
  Show page numbers; Right align page numbers; Tab leader: dots
  Formats: From template (uses TOC 1–9 styles) / Classic / Distinctive ...
  Show levels: 3
  Options...: Build from: Styles (Heading 1 = 1, Heading 2 = 2, Appendix Heading = 1), Outline levels, Table entry fields
  Modify...: edit TOC 1, TOC 2, TOC 3 styles (font, indent, spacing)
```

The result is a `{ TOC \o "1-3" \h \z \u }` field. Update it with F9 (choose "Update entire table" after heading text changes) or References > Update Table.

### TOC field switches worth knowing

```text
{ TOC \o "1-3" \h \z \u }            headings 1–3, hyperlinks, hide page numbers in Web view, use outline levels
{ TOC \o "1-2" \t "Appendix Heading,1,Annex Heading,2" }   include custom styles at given levels
{ TOC \b Chapter3 \o "1-3" }         only the bookmarked range (per-chapter mini TOCs)
{ TOC \n "3-3" }                     no page numbers for level 3
{ TOC \c "Figure" }                  a table of figures (same as References > Insert Table of Figures)
{ TOC \f "A" }                       from TC fields with identifier A (manual entries)
{ TOC \p "—" }                       separator between entry and page number
```

Alt+F9 shows the code; edit switches directly and press F9. A **chapter mini-TOC** is a `\b` TOC over a bookmark that spans the chapter, placed after the chapter heading.

### TOC styles

TOC 1–9 paragraph styles control the look. Set TOC 1 bold with 6 pt before, TOC 2 regular with 0.25 in indent, TOC 3 with 0.5 in indent and 9 pt. The right tab with dot leader is added by the field; the tab position comes from the right margin, so TOC styles usually need no tab definitions. **Never** format TOC entries directly; the next update discards it.

### Captions

```text
References > Insert Caption
  Label: Figure / Table / Equation / New Label ("Exhibit", "Form")
  Position: Above (tables) / Below (figures)
  Numbering...: Format 1, 2, 3; Include chapter number: Heading 1, separator hyphen
  AutoCaption...: automatically caption every inserted table or picture (helpful in SOP writing)
Result: Figure { SEQ Figure \* ARABIC } plus your text, in Caption style
With chapter numbers: Figure { STYLEREF 1 \s }-{ SEQ Figure \* ARABIC \s 1 }
```

The `\s 1` switch restarts the sequence at each Heading 1 so numbering runs 3-1, 3-2, then 4-1. Caption numbers update on F9 like any field; deleting a figure leaves a gap until you update.

### Table of figures and tables

```text
References > Insert Table of Figures
  Caption label: Figure (repeat for Table with a separate insertion)
  Options: Style: Caption (or build from a custom caption style), Table entry fields
  Formats, leaders and levels as for the TOC
```

Each label gets its own list; a "List of Tables" is simply a Table of Figures with the Table label. Both are `{ TOC \c "Table" }` fields.

### Manual entries: TC fields

For headings that must appear in the TOC with different text (a long chapter title shortened), or for unstyled entries, insert a **TC field**: `{ TC "Short title" \l 1 }` and add `\f` to the TOC or use "Table entry fields" in Options. Mark with Alt+Shift+O. TC fields are hidden text and show only with marks on.

### Bookmark-based partial TOCs

Select the chapter, Insert > Bookmark, name it `Chapter3`, then `{ TOC \b Chapter3 \o "2-3" }` after the chapter heading gives a mini contents list of sections in that chapter; useful in a 767-page handbook where readers open one chapter at a time.

### Common problems

| Symptom | Cause | Fix |
|---|---|---|
| "No table of contents entries found" | Headings are not styled or outline levels missing | Apply Heading styles or set outline levels |
| Body paragraphs appear in the TOC | A paragraph has an outline level or a heading style was applied to body | Reveal Formatting; set Body Text |
| Entries show numbers as "1.1.1" twice | Heading contains typed numbers plus list numbering | Remove typed numbers |
| TOC entries wrap badly | Long titles; right tab missing | Shorten or use TC field; keep right tab in TOC style |
| Figure 0-1 | Heading 1 not numbered by a list style | Link Heading 1 to a list style or drop chapter numbers |
| Update changes formatting | Direct formatting on entries | Modify TOC 1–3 styles instead |

> **Tip:** Before the final PDF: Ctrl+A, F9, choose Update entire table, then check the last page number in the TOC against the document's last page. A stale TOC is the most common defect reviewers find in delivered manuals.

### Try It Yourself

```text
TOC and figure apparatus for a manual (field codes as seen with Alt+F9)
-----------------------------------------------------------------------
Contents            { TOC \o "1-3" \h \z \u \t "Appendix Heading,1" }
List of Figures     { TOC \h \z \c "Figure" }
List of Tables      { TOC \h \z \c "Table" }
Chapter mini TOC    { TOC \b Chap03 \o "2-3" \h \n "3-3" }      (bookmark Chap03 spans chapter 3)
Figure caption      Figure { STYLEREF 1 \s }-{ SEQ Figure \* ARABIC \s 1 }: QA scorecard form
Table caption       Table { STYLEREF 1 \s }-{ SEQ Table \* ARABIC \s 1 }: Owner's policy rates
Update all:         Ctrl+A, F9 > Update entire table; then File > Options > Display > Update fields before printing
```

### Quiz

1. What does the `\o "1-3"` switch in a TOC field do?
- [ ] Sorts entries alphabetically
- [x] Includes outline levels 1 to 3
- [ ] Omits page numbers
> \o sets which heading levels appear; \n suppresses page numbers for a range.

2. How do you change the look of TOC entries safely?
- [ ] Select the TOC and change the font
- [x] Modify the TOC 1, TOC 2, TOC 3 styles
- [ ] Retype the entries
> Direct formatting is lost on every update; styles persist.

3. Why does a caption show "Figure 0-1"?
- [x] Chapter numbering is on but Heading 1 is not numbered by a list style
- [ ] The picture is floating
- [ ] The SEQ field is locked
> STYLEREF 1 \s reads the heading's list number; with none, it returns 0.

4. Which field creates a TOC for one chapter only?
- [ ] { TOC \c "Chapter" }
- [x] { TOC \b BookmarkName \o "2-3" }
- [ ] { TOC \f }
> \b restricts the TOC to a bookmarked range.

### Exercises

1. **Add appendices to the TOC** — Appendix headings use a custom style "Appendix Heading". Make them appear at level 1 and keep chapter headings as they are.
<details><summary>Solution</summary>

References > Table of Contents > Custom > Options: set Appendix Heading TOC level 1 alongside Heading 1 = 1; or edit the field to `{ TOC \o "1-3" \t "Appendix Heading,1" \h \z \u }`. Update entire table. The custom style must have an outline level or be listed with \t.

</details>

2. **Fix 200 captions numbered by hand** — A client typed "Figure 12:" in every caption. Convert them to real captions efficiently.
<details><summary>Solution</summary>

Find and Replace with wildcards: Find `Figure ([0-9]{1,3}):` in Caption-style paragraphs, Replace with `Figure ^&`... wildcards cannot insert fields, so instead: replace `Figure ([0-9]{1,3}):` with `Figure :` to strip numbers, then place the cursor after "Figure " in the first caption, Ctrl+F9, type `SEQ Figure \* ARABIC`, F9, copy the field, and use Find and Replace with `^c` (clipboard contents) in Replace to insert the field after every "Figure ". Update fields; numbers renumber sequentially.

</details>

### Interview Questions

**Q: A 767-page handbook's TOC is 14 pages long and the client wants it shorter but complete. What do you do?**
Reduce Show levels to 2 for the main TOC and add a chapter mini-TOC at level 2–3 after each chapter heading using `\b` bookmarks, so detail is available where readers need it. I tighten TOC 1–3 styles (9 pt, 0 pt spacing) and use `\n "3-3"` to drop page numbers where entries would wrap. For the PDF I keep bookmarks from headings at all levels so navigation is complete even though the printed TOC is compact. This is the design I used for a handbook of that size: 3 pages of main TOC, 40 mini-TOCs.

**Q: Why do captions and cross-references break when a client copies figures between documents?**
Because captions are SEQ fields that number within their document, and cross-references are REF fields pointing to hidden bookmarks that Word creates for each caption; pasted content brings the field but the bookmark may be renamed or lost. After pasting, an Update Fields renumbers the sequence and any dangling REF shows "Error! Reference source not found." I fix by re-inserting the cross-reference, and I advise clients to move figures within the same document with cut and paste rather than across files, or to re-link cross-references afterwards.

**Q: What is the difference between building a TOC from styles versus from outline levels?**
From styles, Word lists paragraphs whose style names appear in the Options table at the assigned level, which lets custom styles like Appendix Heading appear. From outline levels, it uses each paragraph's outline level property regardless of style, which picks up custom styles that set a level but also any body paragraph accidentally given a level. The default `\u` uses outline levels applied by styles, which is the safest, and I add `\t` for custom styles. When body paragraphs appear in a TOC I check outline levels with Reveal Formatting.

## Field codes (PAGE, NUMPAGES, DOCPROPERTY, IF, MERGEFIELD, STYLEREF)

Fields are Word's formulas: small programs embedded in the text that produce a result. Page numbers, dates, TOCs, captions, cross-references, mail merge and conditional text are all fields. Reading and writing field codes directly is the skill that lets you build documents that maintain themselves.

### Mechanics

```text
Ctrl+F9          insert an empty field { } (never type the braces)
Alt+F9           toggle field codes for the whole document;  Shift+F9 for the selection
F9               update selected fields;   Ctrl+A, F9 updates the body
F11 / Shift+F11  next / previous field
Ctrl+F11         lock;  Ctrl+Shift+F11 unlock;  Ctrl+Shift+F9 unlink (convert to text)
Insert > Quick Parts > Field   dialog with every field, its options and switches
File > Options > Advanced > Show field codes instead of their values;  Field shading: Always (recommended while working)
File > Options > Display > Update fields before printing
```

A field has a name, arguments and **switches**. General switches: `\* ` format (`\* Upper`, `\* Caps`, `\* Ordinal`, `\* CardText`, `\* MERGEFORMAT`), `\# ` numeric picture (`\# "#,##0.00"`, `\# "0%"`), `\@ ` date picture (`\@ "d MMMM yyyy"`, `\@ "MMM yy"`).

### The fields you use daily

| Field | Example | Result |
|---|---|---|
| PAGE | `{ PAGE \* roman }` | iv |
| NUMPAGES / SECTIONPAGES | `{ NUMPAGES }` | 767 |
| DOCPROPERTY | `{ DOCPROPERTY Version }` | 3.2 |
| TITLE / AUTHOR / SUBJECT | `{ TITLE \* Upper }` | POLICY MANUAL |
| SAVEDATE / CREATEDATE / DATE / TIME | `{ SAVEDATE \@ "dd/MM/yyyy" }` | 14/09/2026 |
| FILENAME | `{ FILENAME \p }` | C:\...\PolicyManual_v3.docx |
| STYLEREF | `{ STYLEREF "Heading 1" \n }` | 3 |
| SEQ | `{ SEQ Table \* ARABIC \r 1 }` | 1 (restart) |
| REF | `{ REF _Ref12345 \h }` | text of a bookmark, hyperlinked |
| PAGEREF | `{ PAGEREF _Ref12345 \h }` | page of a bookmark |
| HYPERLINK | `{ HYPERLINK "https://..." }` | link |
| INCLUDETEXT / INCLUDEPICTURE | `{ INCLUDETEXT "C:\\parts\\terms.docx" }` | inserts another file's content |
| = (formula) | `{ = { NUMPAGES } - 4 }` | arithmetic on fields or bookmarks |
| ASK / FILLIN / SET | `{ SET Client "Stewart Title" }{ REF Client }` | variables |
| IF | `{ IF { MERGEFIELD State } = "TX" "Texas rate applies" "Standard rate" }` | conditional text |
| MERGEFIELD | `{ MERGEFIELD FirstName \* Caps }` | mail merge value |

### Nesting

Fields nest: press Ctrl+F9 inside an existing field. Word evaluates inner fields first. Braces typed from the keyboard are not fields; they must come from Ctrl+F9 (they render as slightly bold braces).

```text
{ IF { PAGE } = { NUMPAGES } "End of document" "Continued on next page" }
{ = { SEQ Total } * 1.16 \# "#,##0.00" }                      GST-inclusive figure from a sequence value
{ QUOTE { DATE \@ "yyyy" } }                                  literal text built from a field
{ DOCPROPERTY Version \* MERGEFORMAT }                        keep manual formatting on update (usually remove \* MERGEFORMAT)
```

`\* MERGEFORMAT` is inserted by dialogs by default; it preserves character formatting on update but often keeps stale formatting, so I remove it and format the field via its paragraph or character style.

### IF and comparisons

```text
{ IF expression1 operator expression2 "true text" "false text" }
Operators: = <> < > <= >=   (text compares alphabetically; use quotes around text with spaces)
Wildcards in text comparison: ? and * on the right-hand side
Examples
  { IF { MERGEFIELD Balance } > 0 "Amount due: { MERGEFIELD Balance \# "$#,##0.00" }" "Paid in full" }
  { IF { DOCPROPERTY Status } = "Draft" "DRAFT — NOT FOR DISTRIBUTION" "" }
  { IF { MERGEFIELD Middle } = "" "{ MERGEFIELD First } { MERGEFIELD Last }" "{ MERGEFIELD First } { MERGEFIELD Middle } { MERGEFIELD Last }" }
```

An IF around a DOCPROPERTY is a clean way to show or hide a watermark line or a confidentiality banner across a template suite.

### Mail merge fields

**Mailings > Start Mail Merge** attaches a data source (Excel sheet, CSV, Outlook contacts, Access). `{ MERGEFIELD Name }` inserts a value; `{ NEXT }`, `{ NEXTIF }`, `{ SKIPIF }` control records; `{ MERGEREC }` and `{ MERGESEQ }` number them. Number and date formatting from Excel is lost in merge, so add `\#` and `\@` switches to the fields, or use the **DDE** connection (File > Options > Advanced > Confirm file format conversion on open) to keep Excel formats. For hundreds of personalised policy letters, the merge itself is the easy part; the field formatting is the work.

### Formulas and bookmarks

`{ = }` fields compute with + - * / and functions (SUM, AVERAGE, MIN, MAX, ROUND, INT, MOD, ABS, AND, OR, NOT, IF, DEFINED). They can reference table cells (`{ = SUM(B2:B6) }`) and bookmarks: bookmark a number in the text as `Rate` and `{ = Rate * 1.15 \# "0.00" }` uses it. This is how a rate calculator letter shows a computed premium from one bookmarked input.

### Locking, converting and troubleshooting

- Fields showing `Error! Bookmark not defined` : the REF target was deleted; re-insert the cross-reference.
- Results not updating: the field is locked (Ctrl+Shift+F11) or is in a header (update there) or Update fields before printing is off.
- Dialog inserted `\* MERGEFORMAT` and the result keeps old formatting: remove the switch.
- Field shading distracts the client: File > Options > Advanced > Field shading: When selected, before delivery.
- Converting to text for archival: Ctrl+A, Ctrl+Shift+F9 on a copy; keep the field version as the master.

> **Interview note:** A candidate who can type `{ IF { DOCPROPERTY Status } = "Draft" "DRAFT" "" }` from memory, explain nesting with Ctrl+F9 and say why `\* MERGEFORMAT` is usually removed has clearly built production documents.

### Try It Yourself

```text
Field codes for a title-insurance rate letter (Alt+F9 view)
-----------------------------------------------------------
Bookmark "Coverage" wraps the typed coverage amount 250000
Premium:  { = Coverage * 0.0035 \# "$#,##0.00" }
Simultaneous issue: { IF { DOCPROPERTY LoanPolicy } = "Yes" "{ = Coverage * 0.0004 \# "$#,##0.00" }" "Not applicable" }
Total:    { = { = Coverage * 0.0035 } + { IF { DOCPROPERTY LoanPolicy } = "Yes" "{ = Coverage * 0.0004 }" "0" } \# "$#,##0.00" }
Footer:   { IF { DOCPROPERTY Status } = "Draft" "DRAFT — quote not binding" "Quote valid 30 days from { SAVEDATE \@ "d MMMM yyyy" }" }
Update:   Ctrl+A, F9 after changing Coverage or the properties
```

### Quiz

1. How do you create the braces of a field?
- [ ] Type { and }
- [x] Press Ctrl+F9
- [ ] Insert > Symbol
> Typed braces are ordinary characters; only Ctrl+F9 creates field braces.

2. What does `\# "#,##0.00"` do?
- [x] Formats a numeric result with thousands separators and two decimals
- [ ] Formats a date
- [ ] Locks the field
> \# is the numeric picture switch; \@ is for dates; \* for text formats.

3. Why remove `\* MERGEFORMAT` from most fields?
- [ ] It slows updates
- [x] It preserves stale character formatting across updates
- [ ] It is not supported in PDF
> Formatting should come from styles, so the switch usually does more harm than good.

4. Which field shows different text depending on a document property?
- [ ] REF
- [x] IF
- [ ] SEQ
> IF compares expressions, including nested DOCPROPERTY or MERGEFIELD values.

### Exercises

1. **Confidentiality banner** — Show "CONFIDENTIAL" in the header only when a custom property Classification equals "Confidential".
<details><summary>Solution</summary>

Add custom property Classification. In the header insert `{ IF { DOCPROPERTY Classification } = "Confidential" "CONFIDENTIAL" "" }` using Ctrl+F9 for each pair of braces. Style the header paragraph so the banner is red and bold via a character style applied to the whole field. Update header fields after changing the property.

</details>

2. **Merge with formatted currency** — In a mail merge from Excel, amounts show as 1250 instead of $1,250.00. Fix it.
<details><summary>Solution</summary>

Alt+F9, edit the field to `{ MERGEFIELD Amount \# "$#,##0.00" }`, Alt+F9 back, Preview Results. For dates use `{ MERGEFIELD DueDate \@ "d MMMM yyyy" }`. Alternatively connect via DDE to inherit Excel formatting, but the switch approach is more robust when the workbook changes.

</details>

### Interview Questions

**Q: Explain how you would build a document that shows "DRAFT" on every page until it is approved, with no manual editing.**
A custom document property Status with values Draft or Approved, and in the header an IF field comparing DOCPROPERTY Status to "Draft" to output the banner or nothing; optionally a second IF in the footer that switches the date line. Approval is then changing one property and updating fields, which a macro or python-docx can also do for a batch. The header text is styled through a character style so it looks right without \* MERGEFORMAT. I used exactly this pattern on SOP suites where reviewers needed a visible draft state that disappears on release.

**Q: A client's merged letters show 43.2 instead of 43.20% and dates as 45912. What happened?**
Mail merge reads raw values from Excel via OLE DB and discards cell formatting, so percentages arrive as decimals and dates as serial numbers in some configurations. The fix is switches on the merge fields: `\# "0.00%"` after multiplying by 100 with a formula field if needed, and `\@ "d MMM yyyy"` for dates; or connecting through DDE, which honours Excel formatting but is slower and fragile. I standardise on switches and I keep a test record with awkward values in the data source to check formatting before running hundreds of letters.

**Q: What are the risks of INCLUDETEXT and when is it still useful?**
INCLUDETEXT pulls a section of another file into the document, updating on F9, so shared clauses like terms and conditions can live in one master file. The risks are path dependence, which breaks when files move, slow updates, styles from the source overriding the target's, and clients not realising the text is external. I use it only inside a controlled folder structure with relative paths and a documented update step, and for delivered documents I unlink the field so the content is frozen. For most reuse, Building Blocks or a template are safer.

## Cross-references, bookmarks & hyperlinks

Cross-references let text say "see Section 4.2 on page 37" and stay correct after every edit. They are built on **bookmarks**, hidden named ranges that also power `\b` TOCs, formula fields, hyperlinks within the document and PDF navigation. Hyperlinks connect to the web, to files and to bookmarks.

### Bookmarks

```text
Insert > Bookmark: name (letters, digits, underscore; no spaces; must start with a letter), Add / Delete / Go To
File > Options > Advanced > Show bookmarks  (shows [ ] around bookmarked text; I-beam for empty bookmarks)
Ctrl+G > Bookmark  jump
Hidden bookmarks (_Ref123456789, _Toc...) are created by Word for cross-references and TOCs; tick "Hidden bookmarks" to see them
```

Bookmarks are deleted if their whole text is deleted, and they shrink or grow with edits inside them. A bookmark on a number makes it usable in formulas (`{ = Coverage * 0.0035 }`); a bookmark on a chapter makes a `\b` TOC possible.

### Inserting cross-references

```text
References > Cross-reference
  Reference type: Numbered item / Heading / Bookmark / Footnote / Endnote / Equation / Figure / Table
  Insert reference to:
     Heading:       Heading text | Page number | Heading number | Heading number (no context) | Heading number (full context) | Above/below
     Figure/Table:  Entire caption | Only label and number | Only caption text | Page number | Above/below
     Numbered item: Paragraph number | Paragraph text | Page number | Paragraph number (no/full context)
  [x] Insert as hyperlink   [ ] Include above/below
```

Result fields: `{ REF _Ref12345678 \h }` for text, `{ PAGEREF _Ref12345678 \h }` for pages, with `\r` (relative number), `\n` (no context), `\w` (full context), `\p` (above/below). A typical sentence: "See { REF _Ref1 \n \h } { REF _Ref1 \h } on page { PAGEREF _Ref1 \h }." produces "See 4.2 Quality Control on page 37."

### Heading number context

For numbered headings and clauses, "Heading number (full context)" gives 4.2.1 even when referencing from another chapter; "no context" gives just 1; the default "Heading number" gives the shortest unambiguous form relative to the current position, which changes when the reference is moved. Use full context in legal and policy documents so a cross-reference reads identically everywhere.

### Updating and errors

Cross-references update with F9 or on print. "Error! Reference source not found." means the hidden bookmark was deleted, usually because the target heading was retyped rather than edited, or the caption paragraph was replaced. Re-insert the cross-reference. Wildcard search for `Error! ` before delivery is a standard QA step.

### Hyperlinks

```text
Insert > Link (Ctrl+K)
  Existing File or Web Page: URL or file; Text to display; ScreenTip
  Place in This Document: headings and bookmarks
  E-mail Address: mailto with subject
Field: { HYPERLINK "https://example.com/policy" \o "Policy page" }   (\l "BookmarkName" for internal)
Character style: Hyperlink (blue underlined); FollowedHyperlink after clicking
Ctrl+click to follow (File > Options > Advanced > "Use CTRL + Click to follow hyperlink")
Remove: right-click > Remove Hyperlink; strip all with Ctrl+A, Ctrl+Shift+F9 (also unlinks other fields!)
```

Internal hyperlinks to headings survive edits because Word maintains hidden `_Toc` bookmarks; links to user bookmarks survive as long as the bookmark exists. In the PDF, both cross-references (with `\h`) and hyperlinks become clickable when exported via Save As PDF, not through a print driver.

### Footnotes and endnotes

References > Insert Footnote (Alt+Ctrl+F) and Endnote (Alt+Ctrl+D) are auto-numbered and can be cross-referenced (Reference type Footnote). Footnote numbering can restart per section (References > Footnote launcher > Numbering: Restart each section). For legal or academic manuals, footnote text uses the Footnote Text style; keep it 9 pt with 0 pt after.

### Print-friendly cross-references

Screen readers and printed copies need explicit page numbers; on-screen readers prefer links. Include both: "see Section 4.2 (page 37)". Set the Hyperlink character style to the body colour with no underline in print templates, and to blue underlined in screen templates; cross-references inserted with `\h` use no special style, so they look like body text unless you apply one.

> **Tip:** Turn on Show bookmarks while editing a template. Seeing the brackets prevents you from deleting the start of a bookmarked heading and breaking every reference to it.

### Try It Yourself

```text
Cross-reference sentence with its field codes (Alt+F9 view)
-----------------------------------------------------------
"Escalations follow the process in Section { REF _Ref23001 \w \h } { REF _Ref23001 \h } (page { PAGEREF _Ref23001 \h }); see also { REF _Ref23002 \h } { REF _Ref23002 \p }."
Renders: "Escalations follow the process in Section 4.2.1 Escalation Ladder (page 37); see also Table 4-3 above."
Bookmarks used: _Ref23001 (heading), _Ref23002 (table caption)
QA before delivery: Ctrl+H, Find "Error!" (no wildcards) -> expect 0 results; Ctrl+A, F9 first
```

### Quiz

1. What underlies every cross-reference in Word?
- [ ] A hyperlink to a URL
- [x] A hidden bookmark that Word creates on the target
- [ ] A copy of the target text
> REF and PAGEREF fields point to _Ref bookmarks; deleting the target text deletes the bookmark.

2. Which "Insert reference to" option gives 4.2.1 from anywhere in the document?
- [ ] Heading number
- [ ] Heading number (no context)
- [x] Heading number (full context)
> The default option shortens the number relative to the current position.

3. What does "Error! Reference source not found." mean?
- [x] The bookmark the REF field points to no longer exists
- [ ] The field is locked
- [ ] The document is in Compatibility Mode
> Re-insert the cross-reference to the current target.

4. Which export keeps cross-references and hyperlinks clickable in the PDF?
- [ ] Microsoft Print to PDF
- [x] File > Save As > PDF (or Export > Create PDF)
- [ ] Copying into Acrobat
> The Save As PDF path preserves links, bookmarks and tags; a print driver rasterises pages.

### Exercises

1. **Bulk QA of references** — Before delivering a 300-page manual, verify that no cross-reference is broken and all show current page numbers.
<details><summary>Solution</summary>

Ctrl+A, F9 (Update entire table for TOCs), then open headers/footers and F9 there. Ctrl+H, search for "Error!" without wildcards; re-insert any broken references. Spot-check three PAGEREF results against actual pages. Export to PDF and click five links in Acrobat to confirm they resolve.

</details>

2. **Print and screen variants** — The same manual is delivered as a printed PDF and as an interactive PDF. Set up cross-references and hyperlinks so both look right without two documents.
<details><summary>Solution</summary>

Insert every cross-reference with "Insert as hyperlink" and with a page number ("see 4.2, page 37"). Keep the Hyperlink character style in body colour with no underline for the print master. For the interactive PDF, modify the Hyperlink style to blue underlined (Design > Style Set could switch this) or accept body-coloured links that still click. Export once for each variant with Save As PDF, bookmarks from headings on.

</details>

### Interview Questions

**Q: Why do you use cross-reference fields instead of typing "see section 4.2 on page 37" by hand?**
Because typed references rot the moment the document changes. A cross-reference field pulls the live heading text, number and page, so when a section is inserted or the document repaginates, Ctrl+A then F9 updates every reference at once and nothing points to the wrong place. Typing them by hand in a long document guarantees that some will be wrong by delivery, and finding a stale "see page 37" that is now page 41 is exactly the kind of error a client notices and a QA pass should never let through. Fields turn cross-references into something that maintains itself, which is essential in a 700-page manual with hundreds of them.

**Q: A client's cross-references show "Error! Reference source not found." on their machine. What happened and how do you prevent it?**
That error means a cross-reference points to a bookmark that no longer exists — usually the target heading or bookmarked text was deleted, or content was pasted in a way that dropped the hidden bookmark Word uses under the hood. To fix it I locate the broken references, re-insert them against the current targets, and update fields. To prevent it, I avoid deleting bookmarked targets, I am careful when cutting and pasting across documents (which can strip bookmarks), and before delivery I update all fields and scan for the error text so a broken reference is caught by me, not the client. For a truly final deliverable that will not be edited, converting fields to static text or exporting to PDF removes the risk entirely.

**Q: When would you unlink cross-reference and hyperlink fields, converting them to plain text?**
I unlink them only for a final, frozen deliverable that no one will edit further and where I want to guarantee nothing can shift or error — for example a signed-off PDF master or a document leaving my control where the recipient lacks the source structure. Unlinking (Ctrl+6 / Ctrl+Shift+F9 on the selection) bakes the current text in, so "see page 37" stays literally that even if the file is later edited, which is both the benefit and the danger. I never unlink a working document, because it destroys the automatic maintenance that makes fields valuable. The rule is: keep fields live throughout production, and only consider unlinking as a deliberate final step, ideally on a copy, with the live version retained.

## Fonts, embedding & brand typography

A branded document falls apart the moment it opens on a machine that does not have the brand fonts. The screen substitutes Calibri, line breaks shift, a 40-page proposal becomes 43 pages, and the client thinks you delivered a broken file. Font embedding and disciplined font choice are what keep a Word deliverable looking identical everywhere.

### Why fonts substitute

Word stores only the font *name* in the document, not the font itself. When the reader's machine lacks that font, Word picks a substitute using the font's metric hints, and everything reflows. The three defences are: embed the fonts, use fonts the client already has, or convert the risky parts to images or PDF.

### Embedding fonts in Word

File > Options > Save > **Embed fonts in the file**. Two sub-options matter:

| Option | Effect |
|---|---|
| Embed only the characters used | Smaller file, but the client cannot edit text in that font without the font installed |
| Do not embed common system fonts | Skips Arial, Times, etc. to save space |

> **Warning:** Embedding only works if the font's embedding permission (a flag inside the font file) allows it. Many commercial fonts are "Preview & Print" only or "Restricted", and Word silently refuses to embed them. Check the font's licence before you promise a client an embedded-font DOCX.

### Choosing brand typography that survives

For a deliverable the client will edit, the safest choice is a font that ships with Microsoft 365 (Aptos, Calibri, Georgia, Cambria) or one the client licenses organisation-wide. For a fixed deliverable (a proposal that will be read, not edited), embed the brand font, or export to PDF where the font is always embedded and subset.

### Theme fonts vs direct fonts

Set the brand's heading and body fonts as the **theme fonts** (Design > Fonts > Customize Fonts), so styles reference "+Headings" and "+Body" rather than a hard-coded name. Rebranding then becomes a one-click theme-font swap instead of a find-and-replace across every style. This is the same theme mechanism EPUB and PowerPoint use, and it is the backbone of a maintainable template suite.

```text
Font-safety decision tree
  Will the client EDIT the file?
    Yes -> use a font they own org-wide, OR embed (if licence allows), OR deliver DOCX + install the font
    No  -> embed fonts, OR deliver PDF (fonts always embedded/subset)
  Multilingual (Urdu/Arabic)?
    -> set the font for that script separately (Font dialog > Complex scripts),
       e.g. Latin = Merriweather, Arabic = "Jameel Noori Nastaleeq"
```

### Try It Yourself

```text
Task: make a proposal render identically on a client machine that has no brand fonts.

1. Design > Fonts > Customize Fonts:
     Heading font = Merriweather   Body font = Source Sans Pro
2. Confirm every style uses "+Headings"/"+Body", not a hard-coded font name
     (Home > Styles pane > Modify > Format > Font should read the theme font).
3. File > Options > Save > tick "Embed fonts in the file",
     tick "Do not embed common system fonts", LEAVE "Embed only characters used" UNTICKED
     (so the client can still edit).
4. Save, then open on a machine without the fonts (or in LibreOffice with the fonts
     uninstalled) and confirm the page count and line breaks are unchanged.
```

### Quiz

1. Where does Word store the actual font glyphs by default?
- [ ] Inside the .docx as embedded font parts
- [x] Nowhere — only the font *name* is stored, unless you enable embedding
- [ ] In Normal.dotm
> By default a DOCX records only the font name; the reader's machine supplies the glyphs, which is why documents reflow when a font is missing.

2. Why might Word refuse to embed a commercial font?
- [ ] The font is too large
- [x] The font's embedding-permission flag is "Restricted" or print-only
- [ ] DOCX does not support embedding
> Every font file carries an fsType embedding permission; Word honours it and silently skips fonts that disallow editable embedding.

3. What is the advantage of setting brand fonts as *theme* fonts?
- [x] Rebranding is a one-click swap instead of editing every style
- [ ] The file becomes smaller
- [ ] It embeds the fonts automatically
> Styles that reference "+Headings"/"+Body" all follow the theme font, so changing the theme font re-typesets the whole document at once.

4. A proposal must look identical to the client but will not be edited. Best option?
- [ ] Send the DOCX and hope they have the font
- [x] Export to PDF (fonts are always embedded/subset) or embed the fonts
- [ ] Convert all text to Calibri
> A read-only deliverable is safest as PDF, where fonts are embedded and subset automatically regardless of the reader's machine.

### Exercises

1. **Diagnose a reflow** — A client says your 20-page DOCX is 22 pages on their screen. List the two most likely causes and the fix for each.
<details><summary>Solution</summary>

Most likely a missing brand font substituting to a wider font, or a different default printer changing page metrics. Fix: embed the fonts (or deliver PDF) for the font issue; set a consistent page size and avoid printer-dependent layout for the metrics issue.

</details>

2. **Set up multilingual fonts** — Describe how to make English body text use Source Sans Pro and Urdu text use Jameel Noori Nastaleeq in the same paragraph style.
<details><summary>Solution</summary>

In the style's Font dialog, set the Latin text font to Source Sans Pro and the Complex scripts font to Jameel Noori Nastaleeq. Word applies the complex-scripts font to Arabic-script runs automatically, so a mixed paragraph renders each script in the correct face.

</details>

### Interview Questions

**Q: A client needs a Word template their whole team will edit, using a licensed brand font. How do you make sure it renders correctly for everyone?**
The cleanest answer is that the font must be installed on every editor's machine, deployed through the organisation's device management, because embedding a font the team will edit is fragile and may be blocked by the licence. I set the brand font as the theme font so styles follow it, and I confirm the licence covers embedding as a fallback for external readers. For anyone outside the org, I deliver a PDF where the font is embedded and subset. I never rely on "it looks fine on my machine", because the font is the single most common cause of a deliverable reflowing.

**Q: What is the difference between embedding fonts and outlining text, and when would you outline?**
Embedding stores the font inside the file so text stays editable and selectable. Outlining converts glyphs to vector shapes, so the text is no longer editable or searchable but needs no font at all. In Word you rarely outline; it is a prepress technique used in CorelDRAW or Illustrator for a cover or logo where you must guarantee the exact shapes at the print shop. For a Word body document you always prefer embedding or PDF, because outlined body text destroys accessibility and searchability.

**Q: How do theme fonts make a rebrand faster, and where can that break?**
If every style references the theme heading/body fonts, changing the theme font in Design > Fonts re-typesets the entire document instantly, which is how I rebrand a 21-template suite quickly. It breaks when someone has applied a direct font override on top of a style, because direct formatting wins over the theme; those runs keep the old font. Part of QA before delivery is clearing manual font overrides (select all, then reset character formatting where appropriate) so the theme actually controls the typography.

# LEVEL: Expert

## Long-document engineering: the 767-page handbook workflow

A 767-page financial handbook is not just a big document; it is a different discipline. Everything that is merely tedious at 20 pages becomes a genuine risk at 767: a single corrupt style can crash Word, a manual TOC becomes impossible to maintain, and one wrong section break can renumber 300 pages. This is the workflow I use to rebuild and maintain documents at that scale.

### Decide: one file or a master document?

Word's **Master Document** feature (Outline view > Show Document > Insert subdocuments) lets you split a huge document into linked subdocuments. It is tempting but notorious for corruption. My rule:

| Situation | Choice |
|---|---|
| One author, one machine, needs a single continuous TOC/page numbering | **One file** — modern Word handles 700+ pages if styles are clean |
| Multiple authors editing different chapters simultaneously | Separate files, combined only at the end (not live master/subdocuments) |
| History of corruption or crashes | One file, and fix the root cause (styles/numbering), never master documents |

I have rebuilt 700-page documents as a single clean file more reliably than any master-document setup.

### The rebuild pipeline

1. **Extract the content** clean: paste into a fresh document as unformatted text, or open in a text-only view, to shed the inconsistent formatting the client's file carried.
2. **Build the style tree first** in a blank template, then apply styles top-down (headings, then body, then special paragraphs).
3. **Rebuild numbering** with list styles tied to heading styles, never manual numbers.
4. **Insert fields**: TOC, table of figures, cross-references, STYLEREF running headers.
5. **Multi-pass QA** (below).
6. **Update all fields** (Ctrl+A, F9) and repaginate before every delivery.

> **Tip:** Work with Draft view and the Navigation pane for speed; switch to Print Layout only to check pagination. Rendering 767 pages in Print Layout on every keystroke is what makes big documents feel slow.

### Performance and stability at scale

- Turn off background repagination and grammar checking while editing (Options > Advanced / Proofing).
- Keep images **linked or compressed**; hundreds of full-resolution images bloat the file and slow saves. Picture Format > Compress Pictures.
- Save as `.docx` (zipped XML), not `.doc`; the compressed format is smaller and more robust.
- Periodically **maggie** the file — copy everything except the final paragraph mark into a new document based on the same template — to shed accumulated corruption.

### Try It Yourself

```text
767-page handbook: delivery-day checklist

[ ] All content uses named styles (Home > Styles > Options > "Show: In use" — no "Default Paragraph Font" surprises)
[ ] Numbering comes from list styles tied to headings, zero manual numbers
[ ] Ctrl+A then F9: TOC, table of figures, all cross-references and PAGE fields updated
[ ] Section breaks verified (Draft view shows them inline) — no accidental Next Page vs Continuous
[ ] Running headers via STYLEREF pull the current chapter/section title
[ ] Compress Pictures applied; file saved as .docx
[ ] Document Inspector run (remove comments, hidden text, metadata)
[ ] Final PDF exported with "Create bookmarks using: Headings" and reviewed page-count vs DOCX
```

### Quiz

1. Why are Word Master Documents generally avoided for large deliverables?
- [ ] They cannot hold more than 100 pages
- [x] They are prone to corruption
- [ ] They do not support styles
> Master/subdocuments have a long history of corrupting; a single clean file, or files combined only at the end, is more reliable.

2. What is the fastest editing view for a 700-page document?
- [x] Draft view with the Navigation pane
- [ ] Print Layout
- [ ] Web Layout
> Draft view skips rendering page layout on every keystroke; Print Layout re-flows all pages and feels slow at scale.

3. Before every delivery of a long document you should:
- [x] Select all and press F9 to update every field, then repaginate
- [ ] Retype the table of contents
- [ ] Convert it to .doc
> Ctrl+A then F9 updates the TOC, figures, cross-references and page fields so nothing is stale.

4. "Maggie-ing" a document (copy all but the final paragraph mark into a new file) is done to:
- [x] Shed accumulated file corruption
- [ ] Reduce the page count
- [ ] Remove images
> The final paragraph mark stores document-level corruption; copying everything except it into a fresh file based on the same template clears many stability problems.

### Exercises

1. **Plan a rebuild** — A client sends a 300-page manual with manual numbering and a hand-typed TOC. List the first four steps of your rebuild in order.
<details><summary>Solution</summary>

1) Extract content as clean/unformatted text into a fresh template. 2) Build the style tree and apply heading and body styles. 3) Rebuild numbering with list styles tied to the heading styles. 4) Insert a TOC field and STYLEREF running headers. Manual QA and field updates follow.

</details>

2. **Choose an architecture** — Three authors must edit chapters 1, 2 and 3 of a 400-page report at the same time, and it needs one continuous TOC on delivery. One file or master document? Justify.
<details><summary>Solution</summary>

Neither a single shared file nor live master/subdocuments. Have each author work in a separate file for their chapter, then combine the three into one clean file at the end (Insert > Object > Text from File, or paste with "Keep Source Formatting" onto a shared template) and build the single TOC there. This avoids simultaneous-edit conflicts and master-document corruption.

</details>

### Interview Questions

**Q: Walk me through how you would rebuild a 767-page handbook that arrives with inconsistent formatting and a broken table of contents.**
I start by deciding it stays one clean file, not a master document, because a single file with disciplined styles is more stable at that size. I extract the content stripped of its inherited formatting, build the style tree in a fresh branded template, and apply styles top-down. Numbering is rebuilt with list styles tied to the heading styles so nothing is typed by hand, and the TOC, table of figures and running headers are all fields. Then I do multi-pass QA — a styles pass, a numbering pass, a cross-reference pass — update every field with Ctrl+A F9, and export a bookmarked PDF that I check page-for-page against the DOCX. I have delivered exactly this kind of rebuild on time by treating it as an engineering pipeline rather than manual editing.

**Q: What are the specific performance and stability risks in very large Word documents, and how do you mitigate them?**
The main risks are corruption from accumulated edits, slowness from live repagination, and bloat from uncompressed images. I mitigate corruption by keeping the document based on a clean template, avoiding master documents, and occasionally copying the content minus the final paragraph mark into a fresh file. I mitigate slowness by editing in Draft view, turning off background repagination and grammar checking, and using the Navigation pane to move around. I mitigate bloat by compressing pictures and saving as .docx. The underlying principle is that everything is styles and fields, because manual formatting is what makes a large document fragile.

## Legacy & content-control forms

Word can build fillable forms two ways, and choosing the wrong one costs you a redelivery. Legacy form fields are the old Developer-tab controls locked with form protection; content controls are the modern controls with data binding. For investigative, legal and automotive clients I have built both, and the choice depends on how the data will be used.

### The Developer tab

Both mechanisms live on the **Developer** tab (File > Options > Customize Ribbon > tick Developer). It exposes:

| Control type | Use |
|---|---|
| Legacy form fields | Text field, check box, drop-down; require document protection ("Filling in forms") to work |
| Content controls | Rich/plain text, check box, combo/drop-down, date picker, picture, repeating section |
| ActiveX controls | Avoid — poor compatibility, security prompts |

### Legacy fields vs content controls

**Legacy form fields** are simple and universally compatible, but the document must be protected for "Filling in forms", which disables most editing. They are right for a straightforward printed-or-filled form where you want the tab-through-fields experience.

**Content controls** are richer: date pickers, drop-downs bound to data, repeating sections, and placeholder text. They can be bound to document custom XML so the same value appears in multiple places. They are right when the form feeds a data process or needs modern controls, and they can be protected individually (cannot be deleted / cannot be edited) rather than locking the whole document.

> **Warning:** Legacy fields and content controls behave differently in Word for Mac, Word Online and LibreOffice. Always test the form in the environment the client actually uses; a date picker that works in Word for Windows is inert in Word Online.

### Protecting the form

Developer > Restrict Editing > Allow only "Filling in forms" > Yes, Start Enforcing Protection (optionally with a password). For content-control forms you can instead set each control's "Contents cannot be edited" and leave the surrounding document open, or use Restrict Editing with the "No changes (Read only)" plus exceptions approach.

### Try It Yourself

```text
Build a protected legacy-field intake form

1. Developer tab > (Legacy Tools dropdown) insert:
     - Text Form Field for "Client Name"
     - Drop-Down Form Field for "Policy Type" (double-click > add: Owner, Lender, Both)
     - Check Box Form Field for "Rush order"
2. Double-click each field > set Bookmark name (e.g. ClientName) for later reference.
3. Add help text (double-click > Add Help Text) shown on the status bar.
4. Developer > Restrict Editing > Editing restrictions:
     "Allow only this type of editing: Filling in forms" > Yes, Start Enforcing Protection.
5. Test: press Tab to jump field-to-field; confirm body text cannot be changed.
```

### Quiz

1. Legacy form fields require what in order to be fillable?
- [x] Document protection set to "Filling in forms"
- [ ] A macro
- [ ] ActiveX
> Legacy fields only accept input once the document is protected for filling in forms; without protection they behave like static text.

2. Which control type supports a date picker and binding to custom XML?
- [ ] Legacy form field
- [x] Content control
- [ ] ActiveX label
> Content controls are the modern mechanism and include date pickers, drop-downs and data binding via custom XML.

3. Why must you test a form in the client's actual environment?
- [x] Controls behave differently in Word for Mac, Word Online and LibreOffice
- [ ] Fonts change
- [ ] The file size changes
> A control that works in Word for Windows may be inert or rendered differently in Word Online, Mac Word or LibreOffice.

4. To lock only the fields but keep the rest of a content-control form editable, you:
- [x] Set each control's "cannot be edited" property instead of whole-document form protection
- [ ] Password-protect the file
- [ ] Convert to PDF
> Content controls can be individually protected, so the surrounding document stays editable while the control contents are locked.

### Exercises

1. **Choose the mechanism** — A client needs a 40-field intake form whose answers must later be pulled into a database. Legacy fields or content controls? Why?
<details><summary>Solution</summary>

Content controls, because they can be bound to custom XML and carry structured data that a downstream process can read reliably, whereas legacy fields are keyed by bookmark and are clumsier to extract at scale. If the same value must appear in several places (e.g. client name in header and body), content-control binding keeps them in sync automatically.

</details>

2. **Protect correctly** — Describe how to let users fill a legacy-field form but prevent them from altering the questions.
<details><summary>Solution</summary>

Developer > Restrict Editing > Allow only "Filling in forms" > Start Enforcing Protection (optionally with a password). Users can then only type into the form fields and tab between them; the surrounding question text and layout are locked.

</details>

### Interview Questions

**Q: When do you choose legacy form fields over content controls, and vice versa?**
I choose legacy form fields for a simple form that just needs the tab-through-fields fill-in experience and maximum compatibility, accepting that the whole document must be protected for filling in forms. I choose content controls when the form needs modern controls like date pickers or drop-downs, when the data must be structured for a downstream process, or when the same value must appear in several places via custom-XML binding. The deciding question is what happens to the data after the form is filled: if a human just reads it, legacy is fine; if a system consumes it, content controls win. I also weigh where the client opens the form, because both behave differently in Word Online and LibreOffice.

**Q: A client reports that your Word form "doesn't work" — fields won't accept input. What are the first things you check?**
For a legacy-field form the usual cause is that protection is not enforced, so the fields are inert; I check Developer > Restrict Editing and enable "Filling in forms". If it is a content-control form, I check whether the controls were accidentally deleted or set to "cannot be edited", and whether the client is opening it in an environment (Word Online, Mac, LibreOffice) that does not support the control type I used. I reproduce the problem in the client's exact application rather than trusting my own Windows Word, because "doesn't work" almost always means an environment or protection mismatch, not a corrupt file.

## Branding & rebranding a template suite

Rebranding a suite of 21 templates is where the theme mechanism pays off or punishes you. If the templates were built on hard-coded colours and fonts, a rebrand is a multi-day find-and-replace nightmare. If they were built on theme colours and fonts with a disciplined style tree, it is a controlled, testable operation. This chapter is the production workflow for both building and re-skinning a suite.

### The single source of truth: the theme

A Word **theme** (`.thmx`) holds twelve theme colours, a heading font and a body font, and effect styles. Every style, table and shape should reference theme colours ("Accent 1", "Text 1") and theme fonts ("+Headings", "+Body"), never a raw hex or font name. Then a rebrand is: build a new theme, apply it, done.

```text
Theme colour slots (map the brand to these once)
  Text/Background - Dark 1   -> primary text (near-black)
  Text/Background - Light 1  -> page background (white)
  Text/Background - Dark 2   -> secondary text
  Text/Background - Light 2  -> subtle fills
  Accent 1..6                -> brand palette (headings, rules, table headers, callouts)
  Hyperlink / Followed       -> link colours
```

### Building the suite so it can be rebranded

1. Create the theme first (Design > Colors > Customize; Design > Fonts > Customize; Save Current Theme).
2. Build one **base template** with the full style tree referencing only theme colours/fonts.
3. Derive the 21 templates from the base so they share the style definitions.
4. Store shared assets (logo, callout boxes) as **Building Blocks** in the base template.
5. Document the mapping (which Accent slot is which brand colour) in a spec the client signs off.

### The rebrand operation

To re-skin the suite: build the new `.thmx`, then for each template apply Design > Themes > Browse for Themes and select it, update fields, and run QA. Because styles reference theme slots, headings, table headers, rules and callouts all recolour at once. The only manual work is anything that was incorrectly hard-coded — which the QA pass below is designed to catch.

> **Tip:** Keep the logo as a vector (EMF/SVG) placed in the header, and swap the file during a rebrand rather than re-inserting into every template. A raster logo forces you to re-place and re-scale in 21 files.

### Try It Yourself

```text
Rebrand-readiness audit for one template (repeat per template)

[ ] Design > Colors shows a CUSTOM theme palette, not "Office"
[ ] Design > Fonts shows the brand heading/body fonts as the theme fonts
[ ] Spot-check 5 styles (Modify > Format > Font/Border): colours read "Accent n"/"Text n",
      fonts read "+Headings"/"+Body" — NOT a hex value or font name
[ ] Table styles use theme colours for header fill and borders
[ ] Callout Building Blocks use theme colours
[ ] Logo is a single placed vector in the header, swappable in one step
[ ] Apply a test theme (different colours) and confirm the WHOLE document recolours;
      anything that stays the old colour is hard-coded and must be fixed
```

### Quiz

1. What is the single source of truth for a rebrandable Word suite?
- [x] The theme (theme colours + theme fonts) that styles reference
- [ ] The Normal template
- [ ] A find-and-replace macro
> When styles reference theme slots, re-skinning is a theme swap; hard-coded colours/fonts defeat the whole approach.

2. A heading style set to a raw hex colour instead of "Accent 1" will:
- [x] Keep its old colour when the theme changes, breaking the rebrand
- [ ] Recolour automatically
- [ ] Cause an error
> Direct/hard-coded colour overrides ignore the theme, so those elements must be fixed manually during a rebrand.

3. The best way to handle the logo across 21 templates during a rebrand is:
- [x] Place a single vector logo in the header and swap the file once
- [ ] Re-insert a raster logo into each template
- [ ] Convert the logo to text
> A placed vector can be swapped in one step; a raster logo forces re-placement and re-scaling in every file.

4. Theme colours are addressed by:
- [x] Named slots like Accent 1 and Text 1
- [ ] Hex values only
- [ ] Style names
> Themes expose named slots (Text/Background 1–2, Accent 1–6, Hyperlink) that styles bind to, so remapping the slots recolours everything.

### Exercises

1. **Audit a template** — You inherit a "branded" template and must confirm it can be rebranded in one operation. List three checks.
<details><summary>Solution</summary>

Confirm Design > Colors and Design > Fonts show a custom theme (not Office defaults); spot-check several styles to verify colours read "Accent n" and fonts read "+Headings/+Body" rather than raw values; apply a different test theme and confirm the entire document recolours with nothing left on the old colours.

</details>

2. **Plan a rebrand** — A client acquires a new brand palette and font. Outline the steps to rebrand a 21-template suite built correctly on themes.
<details><summary>Solution</summary>

Build the new theme (custom colours mapped to the same Accent slots, new heading/body fonts) and save it as a .thmx. For each template, apply the new theme via Design > Themes > Browse for Themes, swap the placed vector logo, update all fields (Ctrl+A, F9), and run the rebrand-readiness QA to catch any hard-coded overrides. Deliver after a visual spot-check of each template.

</details>

### Interview Questions

**Q: How do you build a template suite so that a future rebrand takes hours, not days?**
Everything references the theme. I define twelve theme colours and the heading/body theme fonts once, then build every style, table style and shape to use theme slots ("Accent 1", "+Headings") rather than raw hex or font names. The logo goes in as a single placed vector so it can be swapped as one file. When the rebrand comes, I build a new theme, apply it to each template, swap the logo, update fields and QA. The rebrand is fast precisely because I refused to hard-code anything during the build; the discipline is front-loaded.

**Q: During a rebrand, some headings kept the old colour. What happened and how do you prevent it?**
Those headings had a direct colour override applied on top of the style, and direct formatting beats the theme, so the theme swap didn't touch them. To fix it I clear the manual override so the style (and therefore the theme) controls the colour again. To prevent it in the first place, the build standard is zero direct formatting: all colour and font come from styles that reference theme slots, and the QA pass includes applying a contrasting test theme to reveal anything that doesn't recolour. That test is the single most useful rebrand-readiness check.

## QA, consistency checks & the Accessibility Checker

The difference between an amateur and a professional Word deliverable is the QA pass. At 767 pages you cannot eyeball everything, so you use Word's own tools — wildcard Find, Document Inspector, the Accessibility Checker, and Compare — as a systematic checklist. This is what I run before any long document leaves my hands.

### Wildcard Find & Replace

Turn on **Use wildcards** (Find and Replace > More) to catch systematic errors regex-style:

| Find (wildcards on) | Catches |
|---|---|
| `  ` (two spaces) | Double spaces after sentences |
| `^13{2,}` | Multiple consecutive paragraph marks (empty paragraphs used as spacing) |
| `[0-9]{1,}\)` | Manually typed list numbers like "1)" that should be list styles |
| `<[A-Z]{2,}>` | Stray all-caps acronyms to check for consistency |
| `[!^13]^13[!^13]` | Single paragraph marks used where a real break is needed |

> **Tip:** Replacing empty paragraphs with proper "space before/after" paragraph spacing is one of the highest-value cleanups: it removes the manual spacing that shifts as content reflows.

### Document Inspector

File > Info > Check for Issues > **Inspect Document** removes comments, tracked changes, hidden text, document properties, custom XML and headers/footers you did not intend to ship. Always run it before delivering to an external client, because comments and metadata are a confidentiality risk.

### The Accessibility Checker

Review > **Check Accessibility** flags missing alt text on images, tables without header rows, low-contrast text, links with non-descriptive text, and improper heading structure (a jump from Heading 1 to Heading 3). Fixing these is both an accessibility requirement and a proxy for structural correctness: a document that passes the checker almost always has clean styles.

### Compare and Combine

Review > Compare produces a redline between two versions — essential when a client says "what changed?" between drafts, and far more reliable than eyeballing. Combine merges tracked changes from multiple reviewers into one document.

### Try It Yourself

```text
Pre-delivery QA sequence (run in order)

1. Wildcard Find/Replace cleanups:
     "  " -> " "                 (double spaces)
     ^13{2,} -> ^p               (collapse empty paragraphs; then apply paragraph spacing)
     manual "N)" list numbers    -> reapply list styles
2. Ctrl+A, F9                    (update TOC, figures, cross-references, page fields)
3. Review > Check Accessibility  (fix alt text, table headers, heading order, link text)
4. File > Info > Inspect Document (remove comments, tracked changes, hidden text, metadata)
5. Export PDF with "Create bookmarks using: Headings"; verify bookmarks and page count
6. Open the PDF and the DOCX side by side; spot-check first/last page of each chapter
```

### Quiz

1. Which tool removes comments, hidden text and metadata before delivery?
- [x] Document Inspector (File > Info > Check for Issues)
- [ ] The Accessibility Checker
- [ ] Wildcard Find
> Document Inspector strips comments, tracked changes, hidden text, properties and custom XML that you should not ship externally.

2. Wildcard Find with `^13{2,}` locates:
- [x] Multiple consecutive paragraph marks (empty spacing paragraphs)
- [ ] Double spaces
- [ ] Manual page breaks
> `^13` is a paragraph mark; `{2,}` finds two or more in a row, i.e. empty paragraphs used for spacing.

3. The Accessibility Checker flags a jump from Heading 1 to Heading 3 because:
- [x] Skipped heading levels break document structure and screen-reader navigation
- [ ] Heading 3 is a smaller font
- [ ] It is a spelling error
> Proper heading order (1 then 2 then 3) is both an accessibility rule and a sign of clean structure; skips are flagged.

4. To show a client exactly what changed between two drafts, use:
- [x] Review > Compare (redline)
- [ ] Document Inspector
- [ ] Save As
> Compare generates a tracked-changes redline between two versions, which is precise and reproducible.

### Exercises

1. **Write the cleanups** — Give three wildcard Find/Replace operations you would run on a client file full of manual formatting, and what each fixes.
<details><summary>Solution</summary>

`  ` → ` ` removes double spaces; `^13{2,}` → `^p` collapses empty spacing paragraphs (then apply real paragraph spacing); a pattern like `[0-9]{1,}\)` locates manually typed list numbers to be replaced with list styles. Each removes a class of manual formatting that would otherwise reflow.

</details>

2. **Sequence the QA** — Put these in the correct order: export PDF, update fields, Inspect Document, run Accessibility Checker. Explain why.
<details><summary>Solution</summary>

Update fields first (so the TOC/page numbers are correct), then run the Accessibility Checker and fix structure, then Inspect Document to strip comments/metadata, then export the PDF last so it reflects the cleaned, updated, inspected document. Exporting before cleaning would bake stale fields or leaked metadata into the PDF.

</details>

### Interview Questions

**Q: Describe your QA process for a long Word document before it goes to a client.**
I run a fixed sequence. First, wildcard Find/Replace cleanups to remove double spaces, empty spacing paragraphs and any manually typed numbering. Then Ctrl+A and F9 to update the TOC, table of figures, cross-references and page fields so nothing is stale. Then the Accessibility Checker to fix alt text, table headers, heading order and link text, which also confirms the structure is clean. Then Document Inspector to strip comments, tracked changes, hidden text and metadata, because leaking those to an external client is a confidentiality failure. Finally I export a bookmarked PDF and spot-check it against the DOCX page by page at chapter boundaries. It is a checklist precisely because at scale you cannot rely on eyeballing.

**Q: Why do you treat the Accessibility Checker as a quality tool and not just a compliance box?**
Because the things it flags — missing alt text, tables without header rows, skipped heading levels, non-descriptive link text — are exactly the structural defects that also cause reflow problems, broken TOCs and fragile documents. A document that passes the checker almost always has a clean style tree and proper heading hierarchy, which is what makes it maintainable. So I use it as a fast proxy for structural health, and fixing its findings improves both accessibility and robustness at the same time. It is one of the highest-value five-minute checks in Word.

## Word macros, VBA basics & interview questions

Even a document specialist who is not a developer benefits from a working knowledge of VBA, because a ten-line macro can do in seconds what would take an hour by hand across a template suite. This chapter covers enough VBA to be useful and safe, and the automation questions that come up when a document role touches code.

### When a macro earns its place

Reach for a macro when a task is repetitive, mechanical and spans many documents or many places in one document: applying a style to every table, inserting a standard header into 21 templates, fixing a systematic formatting error, or generating boilerplate. For one-off edits, wildcard Find/Replace is usually faster than writing code.

### The VBA basics

Open the editor with **Alt+F11**. Macros live in modules; a document that contains macros must be saved as `.docm` or a template as `.dotm` (a `.dotx` cannot hold code).

```vba
Sub ApplyTableGridToAll()
    ' Apply the "Table Grid" style to every table in the document
    Dim t As Table
    For Each t In ActiveDocument.Tables
        t.Style = "Table Grid"
    Next t
End Sub

Sub InsertConfidentialFooter()
    ' Put a STYLEREF-free confidential note in the primary footer of every section
    Dim s As Section
    For Each s In ActiveDocument.Sections
        s.Footers(wdHeaderFooterPrimary).Range.Text = "Confidential - " & _
            ActiveDocument.BuiltInDocumentProperties("Company")
    Next s
End Sub
```

### The object model you actually use

| Object | What it is |
|---|---|
| `ActiveDocument` | The open document |
| `.Paragraphs`, `.Tables`, `.Sections`, `.Fields` | Collections you loop over |
| `.Range` | A span of content you read or rewrite |
| `.Content` | The whole document body as a Range |
| `Selection` | The current cursor/selection (avoid in favour of Range for reliability) |

> **Warning:** Macros are a security surface. Enable macros only from documents you trust, keep macro settings at "Disable with notification", and never ship a `.docm` to a client without telling them it contains code and why. Many organisations block macro-enabled files at the mail gateway.

### Recording vs writing

The macro recorder (View > Macros > Record Macro) writes verbose Selection-based code, but it is the fastest way to discover which object and method a UI action maps to. Record it, then refactor the recording to use Range instead of Selection and to loop where the recorder hard-coded a single action.

### Try It Yourself

```vba
' Standardise a template suite: run on each open document
Sub StandardiseDocument()
    Dim t As Table, f As Field
    ' 1. Normalise all tables to the brand table style
    For Each t In ActiveDocument.Tables
        t.Style = "Brand Table"
        t.Rows(1).HeadingFormat = True   ' repeat header row across pages
    Next t
    ' 2. Update every field (TOC, figures, cross-refs, page numbers)
    For Each f In ActiveDocument.Fields
        f.Update
    Next f
    ' 3. Turn on "update fields on print" as a safety net
    ActiveDocument.Fields.ToggleShowCodes = False
    MsgBox "Standardised " & ActiveDocument.Tables.Count & " tables and " & _
           ActiveDocument.Fields.Count & " fields."
End Sub
```

### Quiz

1. A document containing a macro must be saved as:
- [x] .docm (or .dotm for a template)
- [ ] .docx
- [ ] .dotx
> Only macro-enabled formats (.docm/.dotm) can store VBA code; .docx and .dotx cannot.

2. Which is more reliable in VBA for editing content?
- [x] Range
- [ ] Selection
- [ ] The macro recorder's output unedited
> Range operates directly on content without depending on the cursor, so it is more robust than Selection, which the recorder overuses.

3. When is a macro the wrong tool?
- [x] For a single one-off edit better done with wildcard Find/Replace
- [ ] For applying a style to every table
- [ ] For inserting boilerplate into 21 templates
> Macros pay off on repetitive, multi-place or multi-document tasks; a one-off edit is faster by hand or with Find/Replace.

4. The recommended macro security setting is:
- [x] Disable with notification
- [ ] Enable all macros
- [ ] Disable all without notification (so you never know)
> "Disable with notification" lets you run trusted macros while blocking untrusted code by default.

### Exercises

1. **Read the macro** — What does a loop `For Each t In ActiveDocument.Tables: t.Style = "Table Grid": Next t` do, and when would you use it?
<details><summary>Solution</summary>

It applies the "Table Grid" style to every table in the document. You would use it to standardise a document (or, run per file, a whole suite) where tables were formatted inconsistently, in one action instead of restyling each table by hand.

</details>

2. **Decide** — A client wants a confidential footer added to 21 template files. Macro or manual? Justify and name the risk.
<details><summary>Solution</summary>

A macro that loops the sections and sets the primary footer text is far faster across 21 files. The risk is that macro-enabled delivery files (.dotm) may be blocked by the client's mail gateway and are a security surface, so you run the macro to produce the templates but deliver clean .dotx files, and you tell the client if any delivered file is macro-enabled and why.

</details>

### Interview Questions

**Q: You are not a full-time developer, so why should a document-production role know VBA?**
Because a small macro turns an hour of mechanical work into seconds and makes a template suite consistent in a way manual editing cannot guarantee. Applying a table style to every table, inserting a standard footer across 21 files, or fixing a systematic formatting error are all a few lines of VBA. I know enough to record an action, refactor the recording to use Range and a loop, and run it safely. I also know the limits: macros are a security surface, macro-enabled files get blocked by mail gateways, and for one-off edits wildcard Find/Replace is faster. The value is judgement about when automation pays off, not writing large programs.

**Q: What are the security considerations when a Word deliverable involves macros?**
Macros execute code, so they are a genuine risk vector; I keep macro settings at "disable with notification" and only enable code from sources I trust. I never ship a macro-enabled file to a client without telling them it contains code and why, because unexpected .docm files erode trust and are often quarantined by mail systems. Where possible I use the macro to *produce* clean, code-free .docx/.dotx deliverables rather than shipping the macro itself. And I keep any VBA minimal and readable, because a macro a client cannot audit is one they are right to distrust.
