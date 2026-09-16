---
id: pdf-forms
title: Fillable PDF & DOCX Forms
icon: 🗂️
track: Document Engineering
color: #CB4335
runner: js
libs: pdf-lib
tagline: Design AcroForm PDFs and Word forms that clients can actually fill in.
description: Fillable forms end to end: AcroForm field types, naming conventions, radio groups, checkboxes, dropdowns, calculations and validation, tab order, appearance and fonts, building forms in Acrobat and programmatically (pdf-lib, PyMuPDF, ReportLab), flattening and filling, legacy and content-control DOCX forms, and QA for 168-field forms.
---

# LEVEL: Beginner

## What is an AcroForm & PDF form basics

A **fillable PDF** is an ordinary PDF that carries an extra layer of interactive **fields** on top of the page content. The page (the letterhead, the boxes, the labels) is static drawing; the fields are separate objects that a viewer such as Adobe Acrobat Reader, Chrome or macOS Preview lets the user type into. The technology that describes those fields is called **AcroForm**, and it has been part of the PDF specification since PDF 1.2 (1996). Every fillable form you build for a client on Fiverr or Upwork, from a one-page intake sheet to a 168-field loan application, is an AcroForm unless it was built with the older Adobe LiveCycle/XFA technology, which we cover at the Expert level.

### How a form is stored inside the file

Inside the PDF there is a document-level dictionary called `/AcroForm`. It owns a `/Fields` array that lists the top-level fields. Each field is a dictionary with a type, a name and a value, and each field is usually also a **widget annotation** placed on a page so the viewer knows where to draw it.

```text
/AcroForm <<
  /Fields [ 12 0 R 13 0 R 14 0 R ]      % the fields
  /DA (/Helv 0 Tf 0 g)                  % default appearance: Helvetica, auto size, black
  /DR << /Font << /Helv 20 0 R >> >>    % default resources (fonts the fields may use)
  /NeedAppearances false
>>

12 0 obj <<
  /FT /Tx                % field type: Tx = text
  /T (client.name)       % partial field name
  /V (Ali Raza)          % current value
  /Subtype /Widget       % this dictionary is also the on-page widget
  /Rect [72 700 300 720] % position in points, from the bottom-left corner
  /F 4                   % annotation flag 4 = Print
  /P 5 0 R               % the page it sits on
>>
```

Read this slowly, because everything else in the course maps back to it. `/FT` is the **field type**. `/T` is the **name**. `/V` is the **value** the user typed. `/Rect` is the box on the page measured in PDF points (72 points = 1 inch), with the origin at the bottom-left of the page, which is why `700` is near the top of a US Letter page (792 points tall).

### Field types at a glance

| `/FT` | What it is | Typical use on a client form |
|---|---|---|
| `/Tx` | Text field | Name, address, policy number, comments |
| `/Btn` | Button: checkbox, radio button or push button | Yes/No, "I agree", Submit/Reset |
| `/Ch` | Choice: dropdown (combo) or list box | State, title-insurance product, department |
| `/Sig` | Signature field | Applicant signature, notary |

### Viewer behaviour you must understand on day one

The **appearance** of a field (the glyphs you see) is normally a small drawing stored with the field, called an **appearance stream**. When a user types, the viewer regenerates that drawing. When a program such as pdf-lib or PyMuPDF sets a value, it must also regenerate the appearance, or some viewers will show an empty box even though the value is present. That single fact explains most "the client says the form is blank" tickets you will ever receive.

```js
// A field's value and its appearance are two different things.
// pdf-lib regenerates appearances for you when you call save().
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();
const name = form.createTextField('client.name');
name.setText('Ali Raza');
name.addToPage(page, { x: 72, y: 700, width: 228, height: 20 });
const bytes = await pdfDoc.save(); // appearance streams are generated here
console.log('PDF size in bytes:', bytes.length);
```

The example creates a blank US Letter page, adds one text field named `client.name` at the same coordinates as the dictionary above, and saves. The `save()` call is where pdf-lib writes the appearance stream, so the text "Ali Raza" is visible in every viewer.

> **Tip:** Points, not pixels. US Letter is 612 × 792 pt, A4 is 595.28 × 841.89 pt. A field 20 pt tall fits 10–12 pt text comfortably; 14 pt tall is the practical minimum for readable input.

### Why clients pay for this

Most freelance form briefs sound like "make my PDF fillable". What they actually need is: fields that line up with the printed boxes, sensible names so the data can be exported, checkboxes that behave as a group, a tab order that follows reading order, and a file that works in Reader, Chrome and on a phone. The rest of this course teaches exactly those things, in that order.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, rgb } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
page.drawText('Client Intake Form', { x: 72, y: 740, size: 18, font, color: rgb(0.8, 0.26, 0.21) });
page.drawText('Full name:', { x: 72, y: 705, size: 11, font });

const form = pdfDoc.getForm();
const name = form.createTextField('client.name');
name.addToPage(page, { x: 150, y: 698, width: 300, height: 22, borderColor: rgb(0.6, 0.6, 0.6) });

const bytes = await pdfDoc.save();
console.log('Fields:', form.getFields().map(f => f.getName()));
download(new Blob([bytes], { type: 'application/pdf' }), 'intake-form.pdf');
```

### Quiz

1. Which dictionary key stores the name of a field?
- [ ] `/V`
- [x] `/T`
- [ ] `/FT`
> `/T` is the partial field name; `/V` is the value and `/FT` is the field type.

2. A field's value is set by a script but the box looks empty in the viewer. What is the most likely cause?
- [ ] The field is on the wrong page
- [x] The appearance stream was not regenerated
- [ ] The PDF is not version 1.7
> Value and appearance are separate; some viewers only draw the stored appearance stream.

3. Where is the origin (0,0) of a PDF page's coordinate system?
- [ ] Top-left
- [x] Bottom-left
- [ ] Centre
> PDF coordinates grow upward from the bottom-left corner, unlike screens.

### Exercises

1. **Two fields** — Extend the Try It code to add an `client.email` text field 30 pt below the name field and print both names.
<details><summary>Solution</summary>

```js
const email = form.createTextField('client.email');
email.addToPage(page, { x: 150, y: 668, width: 300, height: 22 });
console.log(form.getFields().map(f => f.getName())); // ['client.name', 'client.email']
```

</details>

2. **Convert units** — A client's printed box is 2.5 inches wide and 0.3 inches tall. Compute the `width` and `height` in points.
<details><summary>Solution</summary>

```text
width  = 2.5 × 72 = 180 pt
height = 0.3 × 72 = 21.6 pt
```

</details>

### Interview Questions

**Q: What is an AcroForm and how does it relate to the visible page?**
An AcroForm is the interactive-form layer defined in the PDF specification. The page content stream draws the static artwork (labels, boxes, logo), while the `/AcroForm` dictionary lists field objects that are also widget annotations positioned with `/Rect` on the page. The two are independent: you can move a field without redrawing the page, and you can flatten fields into the page when you want a non-editable copy. In practice, I place widgets so they overlay the printed boxes, and I keep the design in the page layer so the client's brand does not depend on the viewer's field styling.

**Q: Why does a programmatically filled form sometimes look blank?**
Because a field's value (`/V`) and its appearance stream (`/AP`) are separate objects. Libraries that write only `/V` leave the old, empty appearance in place, and viewers that trust `/AP` show nothing. The fixes are to regenerate appearances (pdf-lib does it in `save()`, PyMuPDF needs `widget.update()`), or to set `/NeedAppearances true` so Acrobat rebuilds them on open, which is a weaker fix because Chrome and Preview may ignore it. I always open the output in at least Acrobat Reader and Chrome before delivering.

**Q: What unit does a PDF use for positions and why does it matter for forms?**
PDF uses points, 72 per inch, measured from the bottom-left corner. A form designer who thinks in pixels or in top-left coordinates will place fields upside down or off the page. When I map a scanned paper form, I measure box positions in inches from the ruler in Acrobat, convert to points, and remember that `y` is the distance from the bottom edge to the bottom of the field.

## Field types (text/checkbox/radio/dropdown/list/button/signature)

AcroForm gives you seven practical field kinds. Learning what each one is *for* saves you from the two most common design mistakes: using checkboxes where the answers are mutually exclusive, and using a dropdown where the user may need to type an answer that is not on the list.

### Text fields (`/Tx`)

The workhorse. One line by default; can be multiline, password, comb (one character per cell), file-select or rich text. Every free-text answer on a form is a text field.

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();

const notes = form.createTextField('notes');
notes.enableMultiline();
notes.addToPage(page, { x: 72, y: 560, width: 468, height: 80 });
```

### Checkboxes (`/Btn`, independent)

A checkbox has two states: an **on** state with an export name such as `Yes`, and the `Off` state. Each checkbox is independent, so a list of "documents enclosed" (deed, survey, tax bill) is a set of checkboxes.

```js
const deed = form.createCheckBox('enclosed.deed');
deed.addToPage(page, { x: 72, y: 520, width: 14, height: 14 });
deed.check();
```

### Radio buttons (`/Btn`, grouped)

A radio group is one field with several widgets; only one widget can be on. Use it for "Marital status: Single / Married / Divorced" or for "Property type". Each option carries its own export value.

```js
const type = form.createRadioGroup('property.type');
type.addOptionToPage('Residential', page, { x: 72, y: 480, width: 14, height: 14 });
type.addOptionToPage('Commercial', page, { x: 200, y: 480, width: 14, height: 14 });
type.select('Residential');
```

### Dropdowns (`/Ch`, combo box)

A dropdown shows one line and opens a list. It can optionally be **editable**, meaning the user may type a value that is not in the list. Use it for long, fixed lists such as the 50 US states.

```js
const state = form.createDropdown('property.state');
state.addOptions(['TX', 'CA', 'NY', 'WY']);
state.select('TX');
state.addToPage(page, { x: 72, y: 440, width: 80, height: 20 });
```

### List boxes (`/Ch`, list)

A list box shows several rows at once and can allow multiple selections. It is rarely used on printed-style forms because it takes vertical space, but it is the right choice for "Select all coverages that apply".

```js
const cov = form.createOptionList('coverages');
cov.addOptions(["Owner's policy", "Lender's policy", 'Endorsement 9']);
cov.enableMultiselect();
cov.addToPage(page, { x: 72, y: 360, width: 200, height: 60 });
```

### Push buttons (`/Btn`, pushbutton)

Buttons do not store data; they trigger actions such as Reset Form, Submit Form, Print or a JavaScript. In pdf-lib you create one with `form.createButton('reset')` and give it a label when adding it to a page.

### Signature fields (`/Sig`)

A signature field is a placeholder that Acrobat, Reader, DocuSign-style tools and PyMuPDF can sign digitally. pdf-lib cannot create or sign `/Sig` fields; you either add them in Acrobat (Prepare Form → Digital Signature tool) or draw a labelled rectangle and let the client's e-signature platform place its own tag there.

### Choosing the right type

| Question on the form | Correct field | Why |
|---|---|---|
| "Do you own other property?" | Radio group Yes/No | Mutually exclusive |
| "Documents enclosed" (many) | Checkboxes | Independent |
| "State" | Dropdown | Long fixed list |
| "Explain" | Multiline text | Free text |
| "Coverages required" (several) | Multi-select list box | Several from a fixed list |
| "Signature" | Signature field | Must be signable |

> **Warning:** Never model Yes/No as two independent checkboxes. Clients will tick both, and your exported data will be ambiguous. Use a radio group with export values `Yes` and `No`.

### Try It Yourself

```js
const { PDFDocument, StandardFonts } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

page.drawText('Property type:', { x: 72, y: 720, size: 11, font });
const type = form.createRadioGroup('property.type');
type.addOptionToPage('Residential', page, { x: 170, y: 716, width: 14, height: 14 });
type.addOptionToPage('Commercial', page, { x: 260, y: 716, width: 14, height: 14 });
page.drawText('Residential', { x: 190, y: 719, size: 10, font });
page.drawText('Commercial', { x: 280, y: 719, size: 10, font });

page.drawText('State:', { x: 72, y: 680, size: 11, font });
const state = form.createDropdown('property.state');
state.addOptions(['TX', 'CA', 'NY', 'WY']);
state.addToPage(page, { x: 170, y: 674, width: 80, height: 20 });

page.drawText('Documents enclosed:', { x: 72, y: 640, size: 11, font });
['deed', 'survey', 'taxbill'].forEach((k, i) => {
  const cb = form.createCheckBox('enclosed.' + k);
  cb.addToPage(page, { x: 72, y: 610 - i * 22, width: 14, height: 14 });
  page.drawText(k, { x: 92, y: 613 - i * 22, size: 10, font });
});

const bytes = await pdfDoc.save();
console.log(form.getFields().map(f => `${f.getName()} (${f.constructor.name})`));
download(new Blob([bytes], { type: 'application/pdf' }), 'field-types.pdf');
```

### Quiz

1. Which field type should be used for "Marital status: Single / Married / Divorced"?
- [ ] Three checkboxes
- [x] One radio group with three options
- [ ] Three text fields
> The options are mutually exclusive, which is exactly what a radio group enforces.

2. What does an *editable* dropdown allow?
- [x] Typing a value not in the list
- [ ] Selecting several values
- [ ] Sorting the list
> Editable (combo with the Edit flag) lets the user enter free text; multi-select belongs to list boxes.

3. Which of these can pdf-lib NOT create?
- [ ] A multiline text field
- [ ] A push button
- [x] A signature field
> pdf-lib has no `/Sig` support; add signature fields in Acrobat or via a signing platform.

### Exercises

1. **Yes/No pair** — Add a radio group `owns.other` with options `Yes` and `No` and preselect `No`.
<details><summary>Solution</summary>

```js
const owns = form.createRadioGroup('owns.other');
owns.addOptionToPage('Yes', page, { x: 170, y: 560, width: 14, height: 14 });
owns.addOptionToPage('No', page, { x: 220, y: 560, width: 14, height: 14 });
owns.select('No');
```

</details>

2. **Multi-select** — Create an option list of four endorsements that allows multiple selection and preselect two of them.
<details><summary>Solution</summary>

```js
const end = form.createOptionList('endorsements');
end.addOptions(['ALTA 4', 'ALTA 8.1', 'ALTA 9', 'ALTA 22']);
end.enableMultiselect();
end.select(['ALTA 8.1', 'ALTA 9']);
end.addToPage(page, { x: 72, y: 420, width: 160, height: 70 });
```

</details>

### Interview Questions

**Q: Checkbox versus radio button — when do you use each?**
A checkbox is an independent two-state field, so it is right when each option can be true on its own, such as a list of attached documents. A radio group is one field whose widgets are mutually exclusive, so it is right when exactly one answer is valid, such as Yes/No or a property type. The tell-tale design smell is two checkboxes labelled Yes and No; the exported data can contain both or neither. I model those as a radio group with export values `Yes` and `No` so the value is always one of two strings.

**Q: What is the difference between a combo box and a list box in PDF?**
Both are `/Ch` fields. A combo box (the Combo flag, bit 18) collapses to one line and drops down; it can also be editable so the user can type a value. A list box shows multiple rows and can be multi-select (bit 22). On printed-style forms I use combos almost everywhere because they fit a single row of the layout; I reserve list boxes for "select all that apply" questions where a checkbox grid would be clumsy.

**Q: How do you handle a signature requirement if your tool cannot create signature fields?**
I separate the two jobs. The fillable layer is built with pdf-lib or PyMuPDF, and the signature field is added afterwards in Acrobat's Prepare Form tool as a Digital Signature field, or I leave a clearly labelled rectangle and the client's e-signature platform places its own signature tag at those coordinates. If the client only needs a wet-signature print copy, a plain text label "Signature" plus a line is enough, and I flatten the rest so the print is stable.

## Designing the layout first

Fields are the last thing you add, not the first. A form that is drawn well is easy to make fillable; a form that is a Word document full of underscores is a nightmare to align. This chapter is about the layout decisions that make the field work fast and the client happy.

### Start from the printed page

Most briefs come with an existing paper or Word form: an HR onboarding sheet, a title-order form, a client questionnaire. Before you touch fields, decide the page size (US Letter for US clients, A4 for almost everyone else) and set up a **grid**: consistent margins (0.75 in / 54 pt is a good default), a label column and a field column, and a fixed row height.

```text
Page: US Letter, 612 × 792 pt
Margins: 54 pt all sides            → usable width 504 pt
Row height: 26 pt                   → 22 pt field + 4 pt gap
Label column: 54 → 180 pt (126 pt)  → right-aligned labels
Field column: 186 → 558 pt (372 pt)
```

With those numbers every field on the page has the same height and left edge, which is what makes a form look professional and what makes tab order predictable.

### Draw boxes, not underscores

Clients love `Name: ________________`. Underscores are text glyphs; they never line up with a field rectangle and they show through the typed value. Replace them with a drawn rectangle (a light 0.5 pt border or a pale fill) and put the field exactly over it.

```js
const { PDFDocument, StandardFonts, rgb } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

function row(label, name, y) {
  page.drawText(label, { x: 54, y: y + 6, size: 10, font });
  page.drawRectangle({ x: 186, y, width: 372, height: 22,
    borderColor: rgb(0.75, 0.75, 0.75), borderWidth: 0.5, color: rgb(0.97, 0.97, 0.97) });
  const f = form.createTextField(name);
  f.addToPage(page, { x: 186, y, width: 372, height: 22, borderWidth: 0 });
  return f;
}
row('Full name', 'client.name', 700);
row('Email', 'client.email', 674);
row('Phone', 'client.phone', 648);
```

The helper does three things per row: draws the label, draws the printed box, and places a border-less field over the box. Because the printed box lives in the page layer, flattening or printing later still shows the box.

### Group by section and number the questions

Long forms (loan applications, KYC packs, employee handbooks' acknowledgement sheets) should be broken into titled sections: Applicant, Property, Loan, Declarations, Signatures. Number questions (1, 2, 3…) so support staff can say "question 14 is missing" and so your field names can carry the same number.

### Plan the data before the pixels

Ask the client what happens to the answers. If they will be exported to Excel or pushed into a CRM, agree the field-name list *before* building. A spreadsheet like the one below becomes your build sheet, your QA checklist and the client's data dictionary.

| # | Section | Label | Field name | Type | Export values |
|---|---|---|---|---|---|
| 1 | Applicant | Full name | `applicant.name` | text | |
| 2 | Applicant | Marital status | `applicant.marital` | radio | Single, Married, Divorced |
| 3 | Property | State | `property.state` | dropdown | TX, CA, … |
| 4 | Declarations | I certify | `declaration.certify` | checkbox | Yes |

### Typography and spacing rules that survive every viewer

- Field font: Helvetica (pdf-lib's `StandardFonts.Helvetica`, Acrobat's `Helv`) at 10 pt, or auto-size (0) for narrow fields.
- Minimum field height 18 pt; 22 pt is comfortable; 14 pt checkboxes.
- Leave 4 pt between rows; 12–18 pt between sections.
- Never place fields closer than 6 pt to the page edge; printers clip.
- Right-align numeric fields such as amounts and rates.

> **Tip:** Build the page artwork once (in Word, InDesign, ReportLab or pdf-lib), export it as a static PDF, and keep it as the "background". Every later revision of the fields loads that background with `PDFDocument.load()` and re-adds fields, so you never fight with a client's stray text edit.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, rgb } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const body = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

page.drawText('TITLE ORDER FORM', { x: 54, y: 740, size: 16, font, color: rgb(0.8, 0.26, 0.21) });
page.drawText('1. Applicant', { x: 54, y: 712, size: 12, font });

const rows = [['Full name', 'applicant.name'], ['Email', 'applicant.email'], ['Phone', 'applicant.phone'], ['Property address', 'property.address']];
rows.forEach(([label, name], i) => {
  const y = 680 - i * 26;
  page.drawText(label, { x: 54, y: y + 6, size: 10, font: body });
  page.drawRectangle({ x: 186, y, width: 372, height: 22, borderColor: rgb(0.75, 0.75, 0.75), borderWidth: 0.5 });
  form.createTextField(name).addToPage(page, { x: 186, y, width: 372, height: 22, borderWidth: 0 });
});

const bytes = await pdfDoc.save();
console.log('rows built:', rows.length);
download(new Blob([bytes], { type: 'application/pdf' }), 'layout-first.pdf');
```

### Quiz

1. Why are underscores a poor way to mark a fill-in area?
- [ ] They are not allowed in PDF
- [x] They are text glyphs that never align with the field and show through typed values
- [ ] They cannot be printed
> Draw a rectangle in the page layer and overlay a field on it instead.

2. What should be agreed with the client before building a form whose data will be exported?
- [x] The list of field names and export values
- [ ] The PDF version
- [ ] The viewer they use
> Field names become column headers in the export, so they are part of the deliverable.

3. What is a sensible minimum height for a text field?
- [ ] 8 pt
- [x] 18 pt
- [ ] 40 pt
> Below about 18 pt a 10 pt font is clipped in several viewers.

### Exercises

1. **Section spacing** — Add a second section "2. Property" 18 pt below the last row of the Try It form with two rows: `property.county` and `property.parcel`.
<details><summary>Solution</summary>

```js
const startY = 680 - 3 * 26 - 18 - 22;
page.drawText('2. Property', { x: 54, y: startY + 28, size: 12, font });
[['County', 'property.county'], ['Parcel #', 'property.parcel']].forEach(([label, name], i) => {
  const y = startY - i * 26;
  page.drawText(label, { x: 54, y: y + 6, size: 10, font: body });
  form.createTextField(name).addToPage(page, { x: 186, y, width: 372, height: 22 });
});
```

</details>

2. **Build sheet** — Write the build-sheet rows for a Yes/No question "Is the property your primary residence?" and a "Loan amount" field.
<details><summary>Solution</summary>

```text
# | Section | Label                         | Field name         | Type  | Export values
5 | Loan    | Primary residence?            | loan.primary       | radio | Yes, No
6 | Loan    | Loan amount                   | loan.amount        | text  | (number format, right-aligned)
```

</details>

### Interview Questions

**Q: How do you approach converting a client's Word form with underscores into a fillable PDF?**
I first rebuild the page as artwork with real boxes on a consistent grid, either in Word with bordered table cells or directly in pdf-lib/ReportLab, and export a static PDF. Then I overlay fields on the boxes, which is fast because every row shares the same coordinates. I also agree the field names and export values with the client up front, because those become their data. Rebuilding the artwork costs an hour on a short form but saves days of nudging fields over ragged underscores and gives me a background I can reuse when the client asks for revisions.

**Q: What layout decisions affect tab order and accessibility later?**
A consistent grid with one field per row and left-aligned field edges makes "order by rows" tab ordering correct without manual work. Clear text labels placed immediately left of or above each field become the visible label a screen reader can associate with the field tooltip. Grouping questions into titled sections gives the tagged structure something meaningful to reflect. Random placement, multi-column layouts without clear reading order, and labels that float far from fields all produce tab-order and accessibility defects that must be fixed by hand.

**Q: Why keep a static background PDF separate from the field layer?**
Because the artwork and the interactive layer change for different reasons. The client changes wording; you change fields. If the artwork is a separate file, I load it with `PDFDocument.load()`, re-run the field script and regenerate the deliverable in seconds. It also gives a clean flattened version for print and a safe fallback if a viewer mangles the fields.

## Creating fields in Adobe Acrobat (Prepare Form)

Adobe Acrobat Pro is still the reference tool for AcroForms. Even when you build forms in code, you will use Acrobat to inspect, fix, add signature fields and prove to a client that the file is correct. This chapter walks the exact menu paths in Acrobat Pro (the 2020s "new experience" and classic UI use the same tool names).

### Opening the tool

Open your static PDF, then choose **All tools → Prepare Form** (in older builds: **Tools → Prepare Form**). Acrobat asks whether to run **auto-detection**. Leave it on for a first pass: it scans for boxes, lines and checkbox-like squares and creates fields named after the nearest label text, such as `Full name` or `Check Box 3`. Auto-detect is a starting point, never a deliverable; you will rename and resize everything.

### The field toolbar

Across the top you get one button per field type: Text Field, Check Box, Radio Button, List Box, Dropdown, Button, Image, Date, Digital Signature, Barcode. Click a tool, then click-drag on the page. A small popup asks for the **Field Name**; type it immediately, in your naming convention, and press Enter.

```text
Text Field       → Ali types:  applicant.name
Radio Button     → Group name: applicant.marital   Button value: Single
Check Box        → Name: declaration.certify        Export value: Yes
Dropdown         → Name: property.state             Options tab: TX, CA, NY …
Date             → Name: signed.date  (a Text field pre-formatted mm/dd/yyyy)
```

### The Properties dialog

Double-click a field (or right-click → **Properties**) to open the dialog. Its tabs are where every setting in this course lives:

| Tab | What you set |
|---|---|
| General | Name, Tooltip (accessible label), Read Only, Required, Visibility |
| Appearance | Border and fill colour, line thickness, font, size (Auto), text colour |
| Position | Exact left/top/width/height in inches or points |
| Options | Multiline, Scroll, Comb, Max characters, Alignment; checkbox style and export value; dropdown items |
| Actions | Mouse Up → Run JavaScript / Reset a form / Submit a form |
| Format | Number, Percentage, Date, Time, Special, Custom |
| Validate | Range checks or custom validation script |
| Calculate | Sum/Product/Average of fields, Simplified field notation, or custom script |

The **Position** tab is the secret weapon: instead of dragging, type `Left 2.583 in`, `Width 5.167 in`, `Height 0.306 in` so every row matches your grid exactly.

### Duplicating fields across pages and rows

Right-click a field → **Duplicate Across Pages** copies it to the same position on other pages (useful for "Applicant initials" on every page). For a column of identical rows, select one field, hold Ctrl (Cmd on Mac) and drag to copy, then use **Align → Left** and **Distribute → Vertically** from the right-click menu. Acrobat appends `_2`, `_3` to duplicates; rename them.

### Fields list and the right pane

The right-hand **Fields** pane lists every field in the document, grouped hierarchically when names contain dots. Click one to select it on the page; double-click to open Properties. The pane's **More** menu contains **Set Field Calculation Order**, **Show Tab Numbers**, **Set Tab Order**, **Import/Export Data** and **Remove All Fields**.

### Preview and edit modes

Click **Preview** (top right) to test the form as a user would; click **Edit** to return. Test typing into every field, tabbing through a section, and checking that a radio group toggles correctly, before you deliver.

### Saving and distributing

Save with **File → Save As** (not Print to PDF, which destroys the fields). If the client uses only the free Reader, note that modern Reader can fill and save AcroForms without any special "Reader extensions"; those were only needed for very old Reader versions.

> **Interview note:** Interviewers often ask "what does auto-detect get wrong?" The honest answer: it splits one box into several fields when a line crosses it, misses boxes with light borders, names fields after the wrong label, and never creates radio groups (every square becomes an independent checkbox).

```js
// The same field you drew in Acrobat, expressed in pdf-lib, so the two worlds line up:
// Position tab: Left 2.583 in, Top 1.25 in (from top), Width 5.167 in, Height 0.306 in
const left = 2.583 * 72, width = 5.167 * 72, height = 0.306 * 72;
const y = 792 - 1.25 * 72 - height; // convert top-based inches to bottom-based points
console.log({ left: left.toFixed(1), y: y.toFixed(1), width: width.toFixed(1), height: height.toFixed(1) });
```

### Try It Yourself

```js
// Recreate an Acrobat "Position tab" layout in code and download it.
const { PDFDocument, StandardFonts, rgb } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

function fromAcrobat(leftIn, topIn, widthIn, heightIn) {
  const w = widthIn * 72, h = heightIn * 72;
  return { x: leftIn * 72, y: 792 - topIn * 72 - h, width: w, height: h };
}
const spec = [
  ['applicant.name', 'Full name', 1.25],
  ['applicant.address', 'Address', 1.65],
  ['applicant.city', 'City', 2.05],
];
spec.forEach(([name, label, topIn]) => {
  const box = fromAcrobat(2.583, topIn, 5.167, 0.306);
  page.drawText(label, { x: 54, y: box.y + 6, size: 10, font });
  form.createTextField(name).addToPage(page, { ...box, borderColor: rgb(0.6, 0.6, 0.6) });
});
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'acrobat-positions.pdf');
console.log('Open this in Acrobat → Prepare Form → double-click a field → Position tab');
```

### Quiz

1. Which Acrobat tab lets you type an exact left/top/width/height for a field?
- [ ] Appearance
- [x] Position
- [ ] Options
> Position accepts inches, points or millimetres and is how you match a grid precisely.

2. What does Acrobat's auto-detect never create?
- [ ] Text fields
- [ ] Checkboxes
- [x] Radio groups
> Every detected square becomes an independent checkbox; you must convert groups by hand.

3. Which save method destroys form fields?
- [ ] File → Save As
- [x] Print to PDF
- [ ] File → Save
> Printing rasterises or flattens the page; fields do not survive.

### Exercises

1. **Menu path** — Write the exact steps to set a field's tooltip and mark it required in Acrobat.
<details><summary>Solution</summary>

```text
All tools → Prepare Form → double-click the field → General tab
→ Tooltip: "Applicant full name (required)" → tick Required → Close
```

</details>

2. **Convert coordinates** — Acrobat shows Left 0.75 in, Top 3.0 in, Width 2 in, Height 0.25 in. Give the pdf-lib `addToPage` options.
<details><summary>Solution</summary>

```js
// height = 18 pt, top 216 pt from top → y = 792 - 216 - 18 = 558
{ x: 54, y: 558, width: 144, height: 18 }
```

</details>

### Interview Questions

**Q: Walk me through making a static PDF fillable in Acrobat.**
Open the PDF, choose All tools → Prepare Form and let auto-detect run for a first pass. Then I go field by field: rename to my convention (`applicant.name`), fix the type (convert Yes/No squares into a radio group with export values), set tooltips, and use the Position tab to snap each field to the grid. I duplicate repeated fields across pages, set tab order by rows in the Fields pane, add a Digital Signature field, then switch to Preview to test filling and tabbing. Finally I Save As, never Print to PDF, and test the file in Reader and Chrome.

**Q: What are the limitations of Acrobat's auto-detect?**
It guesses fields from drawn boxes and lines, so it splits boxes crossed by rules, misses light borders, produces names like `Text12` or the wrong nearby label, and makes every square an independent checkbox instead of a radio group. It also cannot know export values, formats or calculations. On a 168-field form I estimate auto-detect gets me 40 percent of the way and the remaining hour or two is renaming, regrouping and aligning.

**Q: How do you keep a form built in Acrobat consistent with one built in code?**
I keep a single build sheet with names, types, export values and positions in inches, and I convert positions with the same formula in both places: `x = left × 72`, `y = 792 − top × 72 − height`. That way a client who edits fields in Acrobat and a script that regenerates the form from the sheet agree on every coordinate and name, and the QA export from `pdftk dump_data_fields` can be diffed against the sheet.

## Naming conventions & hierarchical names

Field names are the part of a form the client never sees but depends on most. They become the keys in FDF/XFDF exports, the column headers in Excel, the JSON properties your fill script uses and the identifiers a CRM maps to. A weak naming scheme (`Text1`, `Check Box 27`) turns a 168-field form into an unmaintainable puzzle.

### Fully qualified names

PDF field names are **hierarchical**. A field named `applicant.name.first` is really a tree: a parent `applicant`, a child `name`, and a terminal field `first`. The full dotted string is the **fully qualified name**; each segment is the `/T` of a node, and children are listed in the parent's `/Kids` array.

```text
applicant                (non-terminal, /Kids)
├── name
│   ├── first            (terminal text field: /FT /Tx)
│   └── last
└── marital              (terminal radio group with widgets Single/Married)
```

Acrobat's Fields pane shows the tree, Reader exports it as nested structure in FDF, and pdf-lib and PyMuPDF both address a field by its full name.

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();
form.createTextField('applicant.name.first').addToPage(page, { x: 72, y: 700, width: 150, height: 20 });
form.createTextField('applicant.name.last').addToPage(page, { x: 240, y: 700, width: 150, height: 20 });
form.createTextField('coapplicant.name.first').addToPage(page, { x: 72, y: 660, width: 150, height: 20 });
console.log(form.getFields().map(f => f.getName()));
// ['applicant.name.first', 'applicant.name.last', 'coapplicant.name.first']
```

pdf-lib creates the intermediate nodes for you when you use dots. Two fields can share a prefix but the full name must be unique.

### Same name = same value

If two widgets share exactly the same fully qualified name, they are **one field with two appearances**. Type in one and the other updates. This is a feature: put `applicant.name` in the page-2 header and it mirrors page 1 automatically. It is also the classic bug: Acrobat's duplicate-and-rename step gets skipped, and "Employer address" on page 3 mysteriously fills with the applicant's address.

### A convention that scales to 168 fields

| Rule | Example | Why |
|---|---|---|
| lowercase, dot-separated sections | `loan.amount` | Sorts cleanly, exports as nested keys |
| section prefix = form section | `declarations.q3` | Makes the Fields pane group correctly |
| numbered repeating rows with zero-padding | `assets.row03.value` | Sorts `row03` before `row10` |
| radio groups end with the question, options are export values | group `property.type`, values `Residential`/`Commercial` | Value is the answer, not the widget |
| checkbox export is `Yes` unless it maps to a code | `enclosed.deed` = `Yes` | Excel column reads naturally |
| no spaces, no special characters, no leading digits | `applicant.dob` not `DOB (mm/dd)` | Survives CRM mapping and JavaScript |

Avoid periods inside a segment because the period *is* the hierarchy separator: a field literally named `Q1.5` becomes a parent `Q1` with child `5`.

### Mapping names to data

A good scheme turns the export straight into structured data. XFDF from Acrobat or `pdftk generate_fdf` lists the full names; a few lines of JavaScript rebuild the tree.

```js
const flat = { 'applicant.name.first': 'Ali', 'applicant.name.last': 'Raza', 'loan.amount': '250000' };
const nested = {};
for (const [k, v] of Object.entries(flat)) {
  const parts = k.split('.');
  let cur = nested;
  parts.slice(0, -1).forEach(p => { cur = cur[p] = cur[p] || {}; });
  cur[parts.at(-1)] = v;
}
console.log(JSON.stringify(nested));
// {"applicant":{"name":{"first":"Ali","last":"Raza"}},"loan":{"amount":"250000"}}
```

### Renaming safely

In Acrobat: Fields pane → right-click → **Rename Field**. Renaming a parent renames every child. In pdf-lib, there is no rename API; you read the old field's value and position, create a new field, and remove the old one with `form.removeField(oldField)`. In PyMuPDF you set `widget.field_name` and call `widget.update()`. Whenever you rename, regenerate the build sheet and re-run your data round-trip test, because any external mapping (FDF templates, CRM integrations) now points at a name that no longer exists.

> **Warning:** Acrobat's auto-detect produces names with spaces such as `Full name` and duplicates like `Text1_2`. Rename before you do anything else; every later step (calculations, scripts, exports) references names, and renaming late means editing all of them twice.

### Try It Yourself

```js
const { PDFDocument, StandardFonts } = PDFLib;
const pdfDoc = await PDFDocument.create();
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();
const p1 = pdfDoc.addPage([612, 792]);
const p2 = pdfDoc.addPage([612, 792]);

// One field, two widgets: the applicant name mirrors onto page 2's header.
const name = form.createTextField('applicant.name');
p1.drawText('Applicant name', { x: 72, y: 725, size: 10, font });
name.addToPage(p1, { x: 72, y: 700, width: 250, height: 20 });
p2.drawText('Applicant (continued)', { x: 72, y: 760, size: 10, font });
name.addToPage(p2, { x: 200, y: 755, width: 250, height: 18 });
name.setText('Ali Raza');

// Hierarchical siblings
['first', 'last'].forEach((k, i) => form.createTextField('coapplicant.name.' + k)
  .addToPage(p1, { x: 72 + i * 170, y: 650, width: 150, height: 20 }));

const bytes = await pdfDoc.save();
console.log(form.getFields().map(f => f.getName()));
download(new Blob([bytes], { type: 'application/pdf' }), 'names.pdf');
```

### Quiz

1. What happens when two widgets on different pages have exactly the same fully qualified name?
- [x] They are one field and always show the same value
- [ ] Acrobat refuses to save
- [ ] The second one is ignored
> Shared names mean shared values; use it deliberately for mirrored fields.

2. What does the field name `Q1.5` create?
- [ ] A field named "Q1.5"
- [x] A parent `Q1` with a child `5`
- [ ] An error
> The period is the hierarchy separator in AcroForm names.

3. Why zero-pad repeating row names (`row03`)?
- [ ] PDF requires it
- [x] So text sorting keeps rows in order
- [ ] To make them shorter
> `row10` sorts before `row3` without padding, which scrambles exports and QA lists.

### Exercises

1. **Design names** — Propose names for: applicant date of birth, co-applicant date of birth, the "Yes/No" question "US citizen?" for each, and a three-row assets table with description and value columns.
<details><summary>Solution</summary>

```text
applicant.dob            coapplicant.dob
applicant.citizen (radio: Yes/No)   coapplicant.citizen (radio: Yes/No)
assets.row01.description assets.row01.value
assets.row02.description assets.row02.value
assets.row03.description assets.row03.value
```

</details>

2. **Find duplicates** — Given the list `['a.b','a.c','a.b','d']`, write JavaScript that prints the duplicated names.
<details><summary>Solution</summary>

```js
const names = ['a.b', 'a.c', 'a.b', 'd'];
const seen = new Set(), dup = new Set();
names.forEach(n => (seen.has(n) ? dup.add(n) : seen.add(n)));
console.log([...dup]); // ['a.b']
```

</details>

### Interview Questions

**Q: How do hierarchical field names work in PDF and why use them?**
A dotted name like `applicant.name.first` is stored as a tree of field dictionaries: parent nodes carry `/T` and `/Kids`, and the terminal node carries the type and value. Viewers and libraries address the field by the fully qualified dotted string. I use hierarchy because it groups the Fields pane by section, exports naturally as nested JSON or XML, lets me rename a whole section at once, and makes 168-field forms navigable. The trade-off is that a stray period inside a label becomes an accidental parent, so I forbid periods inside segments.

**Q: What naming rules would you enforce on a large multi-page form and how would you check them?**
Lowercase dot-separated names with a section prefix, zero-padded row numbers for repeating tables, export values that equal the human answer, no spaces or punctuation, and deliberate reuse of an identical name only for mirrored fields. I check them by dumping every field with `pdftk dump_data_fields` or PyMuPDF, loading the list into a script that flags names not matching a regex, unexpected duplicates and empty export values, and comparing the list to the build sheet. That check runs before every delivery so a late rename in Acrobat cannot slip through.

**Q: A client says page 3's employer address is showing the applicant's address. What happened?**
Two widgets share the same fully qualified name, almost certainly because a field was duplicated across pages or copy-pasted and never renamed, so both widgets display one value. The fix is to rename the page-3 widget to its own name (`employer.address`), confirm in the Fields pane that it is now a separate field, and re-run the duplicate check. I would also look for other duplicates created in the same session, because the mistake rarely happens once.

# LEVEL: Intermediate

## Radio groups & export values

A radio group is a single button field with the **Radio** flag set (bit 16 of `/Ff`) and one widget per option. The group has one value, `/V`, which is the name of the widget currently on. That name is the option's **export value**, and choosing it well is what makes the exported data meaningful.

### Anatomy of a radio group

```text
20 0 obj <<                       % the group (terminal field)
  /FT /Btn  /Ff 49152             % 49152 = Radio (bit 16) + NoToggleToOff (bit 15)
  /T (property.type)
  /V /Commercial                  % current selection, a NAME object
  /Kids [21 0 R 22 0 R]
>>
21 0 obj << /Subtype /Widget /Parent 20 0 R /Rect [72 480 86 494]
  /AS /Off                        % this widget's current appearance state
  /AP << /N << /Residential 30 0 R /Off 31 0 R >> >> >>
22 0 obj << /Subtype /Widget /Parent 20 0 R /Rect [200 480 214 494]
  /AS /Commercial
  /AP << /N << /Commercial 32 0 R /Off 33 0 R >> >> >>
```

Each widget has two appearances in `/AP /N`: one keyed by its export value and one keyed `Off`. The widget's `/AS` says which one is showing. The group's `/V` matches the `/AS` of the selected widget. That is all a radio group is.

### Creating one in pdf-lib

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();

const marital = form.createRadioGroup('applicant.marital');
marital.addOptionToPage('Single', page, { x: 72, y: 700, width: 14, height: 14 });
marital.addOptionToPage('Married', page, { x: 172, y: 700, width: 14, height: 14 });
marital.addOptionToPage('Divorced', page, { x: 272, y: 700, width: 14, height: 14 });
marital.select('Married');
console.log(marital.getOptions(), marital.getSelected()); // ['Single','Married','Divorced'] 'Married'
```

`addOptionToPage(exportValue, page, rect)` creates one widget. Export values must be unique inside the group. `getSelected()` returns the export value or `undefined`.

### Export values in Acrobat

In Acrobat's Prepare Form, draw a Radio Button, and the popup asks for **Radio Button Name** (the group) and **Button Value** (the export value). Draw the second option and give it the *same* group name and a different value. The Options tab has **Button style** (Circle, Check, Cross, Diamond, Square, Star) and the checkbox **Buttons with the same name and choice are selected in unison** (the RadiosInUnison flag, bit 26), which lets two widgets with the same export value act as one option on two pages.

### Codes versus labels

Choose export values to match the downstream system. If the client's CRM stores marital status as `S`, `M`, `D`, export those codes and keep the human word only as printed text on the page. If the data goes to a human-read Excel sheet, export the words. Never export `Choice1`, `Choice2`, which is Acrobat's default.

| Printed label | Export for Excel | Export for CRM code list |
|---|---|---|
| Residential | `Residential` | `RES` |
| Commercial | `Commercial` | `COM` |
| Vacant land | `Vacant land` | `LND` |

### Can the user un-select?

With **NoToggleToOff** set (Acrobat sets it by default), clicking the selected option again does nothing; the group can never return to "no answer" once touched. If "no answer" must be possible, add an explicit `Not applicable` option rather than clearing the flag, because viewers disagree about toggle-off behaviour.

### Reading the value programmatically

```js
const selected = form.getRadioGroup('applicant.marital').getSelected();
console.log(selected ?? '(unanswered)');
```

In PyMuPDF the group appears as several widgets sharing `field_name`; the one whose `field_value` is not `Off` is the selection. In pdftk's `dump_data_fields`, the group is one entry with `FieldStateOption` lines listing every export value and `FieldValue` showing the current one.

> **Interview note:** "Why is the radio value a `/Name` and the text value a string?" Because the value must match an appearance-state key in `/AP /N`, and those keys are PDF name objects. That is also why export values should avoid spaces and non-ASCII characters: `/Vacant#20land` works but is fragile in some tools.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, rgb } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

page.drawText('Property type (choose one):', { x: 72, y: 725, size: 11, font });
const options = [['RES', 'Residential'], ['COM', 'Commercial'], ['LND', 'Vacant land']];
const group = form.createRadioGroup('property.type');
options.forEach(([code, label], i) => {
  const x = 72 + i * 130;
  group.addOptionToPage(code, page, { x, y: 700, width: 14, height: 14, borderColor: rgb(0.3, 0.3, 0.3) });
  page.drawText(label, { x: x + 20, y: 703, size: 10, font });
});
group.select('COM');

console.log('options:', group.getOptions());
console.log('selected export value:', group.getSelected());
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'radio-group.pdf');
```

### Quiz

1. What does a radio group's `/V` contain?
- [ ] The index of the selected widget
- [x] The export value (a name object) of the selected widget
- [ ] The printed label
> `/V` must match a key in the selected widget's `/AP /N` dictionary.

2. In Acrobat, how do you add a second option to an existing radio group?
- [x] Draw another radio button with the same group name and a different button value
- [ ] Duplicate the field with a new name
- [ ] Use a checkbox
> Same name joins the group; the button value becomes that option's export value.

3. What does the NoToggleToOff flag do?
- [ ] Hides the Off appearance
- [x] Prevents clicking the selected option to clear the group
- [ ] Makes the group required
> It stops the group returning to "no answer" once a choice has been made.

### Exercises

1. **Yes/No with N/A** — Build a radio group `property.hoa` with export values `Y`, `N`, `NA`, and print the selected value after selecting `NA`.
<details><summary>Solution</summary>

```js
const hoa = form.createRadioGroup('property.hoa');
['Y', 'N', 'NA'].forEach((v, i) => hoa.addOptionToPage(v, page, { x: 72 + i * 60, y: 660, width: 14, height: 14 }));
hoa.select('NA');
console.log(hoa.getSelected()); // 'NA'
```

</details>

2. **Validate export values** — Write a function that rejects export values containing spaces or non-ASCII characters.
<details><summary>Solution</summary>

```js
const ok = v => /^[A-Za-z0-9_-]+$/.test(v);
console.log(ok('Vacant land'), ok('LND')); // false true
```

</details>

### Interview Questions

**Q: Explain how a radio group is represented in a PDF.**
It is one `/Btn` field with the Radio flag set and a `/Kids` array of widget annotations, one per option. Each widget's `/AP /N` dictionary has two appearance streams, one keyed by the widget's export value and one keyed `Off`, and its `/AS` entry names the state currently displayed. The group's `/V` holds the export value of the selected widget as a name object. Selecting an option means setting `/V` and flipping every widget's `/AS` accordingly, which is what viewers and pdf-lib's `select()` do for you.

**Q: How do you choose export values?**
I match them to where the data goes. For a CRM or database with a code list I use the codes (`RES`, `COM`), for a human-read spreadsheet I use the words, and I never leave Acrobat's `Choice1` defaults. I keep them short, ASCII and free of spaces because they are stored as PDF names, and I document them in the build sheet so the client's integration team knows the exact strings. For Yes/No questions I standardise on `Yes` and `No` across the whole form.

**Q: A radio group on a two-page form must appear on both pages. How?**
Give both widgets the same group name and the same export value and enable "selected in unison" (RadiosInUnison). Then selecting on either page selects both, and the exported value is still a single answer. Without the unison flag, two widgets with the same export value are treated as distinct options by some viewers and only one will appear selected, which confuses users.

## Checkbox on/off states

A checkbox is a `/Btn` field without the Radio or Pushbutton flags. It has exactly two states, but almost every checkbox bug comes from not knowing what the **on** state is called, because different tools invent different names.

### The on state has a name

The off state is always called `Off`. The on state is whatever key the appearance dictionary uses: Acrobat defaults to `Yes`, pdf-lib uses `Yes`, PyMuPDF respects whatever is already there, and forms exported from some tools use `On`, `1`, `True` or the field name itself. The field's `/V` and the widget's `/AS` must use that exact name.

```text
/FT /Btn  /T (declaration.certify)
/V /Yes   /AS /Yes
/AP << /N << /Yes 40 0 R /Off 41 0 R >> >>
/MK << /CA (4) >>          % caption "4" in ZapfDingbats is a check mark
```

The `/MK /CA` entry sets the glyph drawn when checked. ZapfDingbats characters: `4` check, `8` cross, `l` circle, `n` square, `u` diamond, `H` star. Acrobat's Options tab "Check box style" writes these for you.

### Creating and reading in pdf-lib

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();

const certify = form.createCheckBox('declaration.certify');
certify.addToPage(page, { x: 72, y: 700, width: 14, height: 14 });
certify.check();
console.log(certify.isChecked()); // true
certify.uncheck();
console.log(certify.isChecked()); // false
```

pdf-lib's checkbox always uses the on-state name `Yes`. If you load an existing form whose checkbox uses `On`, `check()` still works because pdf-lib reads the existing on-state name from the appearance dictionary; you only need to care about the name when you fill from FDF, pdftk or PyMuPDF.

### Filling from other tools

| Tool | How to check | Notes |
|---|---|---|
| pdftk FDF | `/V /Yes` or the actual on-state name | Wrong name leaves it unchecked silently |
| PyMuPDF | `widget.field_value = widget.on_state()` then `widget.update()` | `on_state()` returns the real name, so it never guesses |
| Acrobat JavaScript | `this.getField("declaration.certify").value = "Yes"` | Must equal the export value |
| pdf-lib | `form.getCheckBox(name).check()` | Reads the on-state from `/AP` |

### Export value versus on state

In Acrobat the Options tab labels the on state as **Export Value**. It defaults to `Yes`. Change it when the data needs a code, such as `X` for legacy mail-merge systems or `1` for databases. A group of checkboxes with the same field name and different export values behaves like a radio group, which is an old trick you will meet in inherited forms; do not build new forms that way.

### Tri-state and required checkboxes

PDF checkboxes have no "indeterminate" state. If the form needs "Yes / No / Not answered", use a radio group. A required checkbox (Required flag, bit 2) is only enforced by Acrobat's submit action and by your own validation script; Chrome and Preview ignore it, so an "I agree" checkbox should also be checked server-side or in the QA script.

### Reading many checkboxes at once

```js
const enclosed = form.getFields()
  .filter(f => f.getName().startsWith('enclosed.'))
  .map(f => [f.getName(), form.getCheckBox(f.getName()).isChecked()]);
console.log(Object.fromEntries(enclosed));
```

The pattern above uses the naming prefix to collect a whole section, which is another reason prefixes matter.

> **Tip:** When a checkbox appears checked in Acrobat but unchecked in Chrome, the `/AS` and `/V` disagree, or `/V` uses a name that does not exist in `/AP /N`. Regenerate the appearance (pdf-lib `save()`, PyMuPDF `update()`) rather than hand-editing.

### Try It Yourself

```js
const { PDFDocument, StandardFonts } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

page.drawText('Documents enclosed:', { x: 72, y: 725, size: 11, font });
const docs = { deed: 'Warranty deed', survey: 'Survey', taxbill: 'Tax bill', hoa: 'HOA statement' };
Object.entries(docs).forEach(([key, label], i) => {
  const cb = form.createCheckBox('enclosed.' + key);
  cb.addToPage(page, { x: 72, y: 700 - i * 22, width: 14, height: 14 });
  page.drawText(label, { x: 92, y: 703 - i * 22, size: 10, font });
  if (key === 'deed' || key === 'survey') cb.check();
});

const state = Object.fromEntries(form.getFields()
  .filter(f => f.getName().startsWith('enclosed.'))
  .map(f => [f.getName(), form.getCheckBox(f.getName()).isChecked() ? 'Yes' : 'Off']));
console.log(state);
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'checkboxes.pdf');
```

### Quiz

1. What is the name of a checkbox's unchecked state?
- [ ] `No`
- [x] `Off`
- [ ] `False`
> `Off` is fixed by the specification; only the on state is configurable.

2. You fill `/V /Yes` via FDF but the box stays empty. Why?
- [ ] FDF cannot fill checkboxes
- [x] The checkbox's on state is named something else, such as `On`
- [ ] The field is read-only
> The value must equal the on-state key in `/AP /N`; PyMuPDF's `on_state()` avoids guessing.

3. Which ZapfDingbats character draws a check mark in `/MK /CA`?
- [x] `4`
- [ ] `8`
- [ ] `l`
> `8` is a cross and `l` is a filled circle.

### Exercises

1. **Count checked** — Given the Try It form, print how many `enclosed.*` boxes are checked.
<details><summary>Solution</summary>

```js
const n = form.getFields().filter(f => f.getName().startsWith('enclosed.') && form.getCheckBox(f.getName()).isChecked()).length;
console.log(n); // 2
```

</details>

2. **Required agree** — Add an `agree.terms` checkbox and mark it required.
<details><summary>Solution</summary>

```js
const agree = form.createCheckBox('agree.terms');
agree.addToPage(page, { x: 72, y: 600, width: 14, height: 14 });
agree.enableRequired();
```

</details>

### Interview Questions

**Q: Why do checkbox fills fail silently across tools?**
Because the checked value is not a boolean; it is the name of an appearance state, and only `Off` is standardised. Acrobat defaults to `Yes`, but inherited forms use `On`, `1`, `True` or arbitrary export values. A fill that writes `/V /Yes` to a box whose on state is `On` is simply a value with no matching appearance, so it renders unchecked. I always read the real on-state name first, with PyMuPDF's `on_state()`, pdftk's `FieldStateOption` lines or pdf-lib's appearance dictionary, and fill with that.

**Q: How would you enforce that an "I agree" checkbox is ticked?**
In the PDF itself, mark it Required and add a validation or submit-time script in Acrobat, but only Acrobat and Reader honour that. Because Chrome, Preview and mobile viewers ignore Required, I treat the PDF-side check as a convenience and enforce the rule where the data lands: the intake script that reads the returned form rejects it if `agree.terms` is not `Yes`. That way the business rule holds no matter which viewer the client used.

**Q: What is the `/MK` dictionary and why would you touch it?**
`/MK` is the widget's appearance characteristics: border colour `/BC`, background `/BG`, caption `/CA` and rotation `/R`. For checkboxes `/CA` chooses the ZapfDingbats glyph, so setting `/CA (8)` gives a cross instead of a check. I touch it when a client's brand guide wants square boxes with crosses, or when I need to regenerate appearances consistently across a form built by several people.

## Dropdowns & combo boxes

A dropdown is a `/Ch` field with the **Combo** flag (bit 18). Its `/Opt` array holds the options, `/V` holds the selected value, and two more flags control behaviour: **Edit** (bit 19) lets the user type a value not in the list, and **Sort** (bit 20) tells the viewer to sort the displayed options.

### Options with display and export values

Each entry in `/Opt` is either a plain string or a two-element array `[export, display]`. That lets the user see "Texas" while the data exports as `TX`.

```text
/FT /Ch  /Ff 131072          % 131072 = Combo (bit 18)
/T (property.state)
/Opt [ [(TX) (Texas)] [(CA) (California)] [(WY) (Wyoming)] ]
/V (TX)
```

Acrobat's Options tab shows two columns, **Item** and **Export Value**; if export is blank the item text is used.

### pdf-lib dropdowns

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();

const state = form.createDropdown('property.state');
state.addOptions(['TX', 'CA', 'NY', 'WY']);
state.select('WY');
state.addToPage(page, { x: 72, y: 700, width: 90, height: 20 });
console.log(state.getOptions(), state.getSelected()); // [...] ['WY']
```

`getSelected()` returns an **array** for both dropdowns and option lists, because option lists can be multi-select. pdf-lib's `addOptions()` takes plain strings only; it does not write display/export pairs, so for "Texas → TX" you either accept the code in the display or add the pairs in Acrobat afterwards.

### Editable combos

```js
const product = form.createDropdown('order.product');
product.addOptions(["Owner's policy", "Lender's policy", 'Both']);
product.enableEditing();   // user may type "Commitment only"
product.enableSorting();   // viewer displays sorted
```

Use editable combos when the list is a suggestion, not a constraint. Remember the exported value can then be anything, so downstream validation must handle free text.

### Long lists and the states problem

A 50-state list is fine; a 3,000-county list is not, because the dropdown becomes unusable and the file grows with every widget copy. For very long lists, use an editable combo with the most common values, or a text field with a comb layout and a validation script. In PyMuPDF the option list is `widget.choice_values`; in pdftk's dump it appears as repeated `FieldStateOption` lines.

### Reacting to a selection

Acrobat can run JavaScript when the selection changes if **Commit selected value immediately** (CommitOnSelChange, bit 27) is on. A typical use: choosing a state fills the state's sales-tax rate into a read-only field.

```js
// Acrobat "Format"/custom keystroke script on property.state (runs in Acrobat/Reader only)
if (!event.willCommit) {
  var rates = { TX: 0.0625, CA: 0.0725, WY: 0.04 };
  this.getField("tax.rate").value = rates[event.changeEx] || 0;
}
```

`event.changeEx` carries the export value of the item being chosen in a keystroke event. This runs only in Acrobat/Reader; Chrome and Preview ignore it, so also keep the rate table in whatever consumes the data.

### Filling dropdowns from data

When you fill a form from JSON, a dropdown value must be one of its options unless the Edit flag is set; pdf-lib throws if you `select()` a value that is not in the list. Guard for it:

```js
function safeSelect(dd, value) {
  if (dd.getOptions().includes(value)) dd.select(value);
  else console.warn('not an option:', value);
}
```

| Setting | Flag bit | Acrobat checkbox | pdf-lib method |
|---|---|---|---|
| Dropdown vs list | 18 Combo | Field type choice | `createDropdown` vs `createOptionList` |
| Allow custom text | 19 Edit | "Allow user to enter custom text" | `enableEditing()` |
| Sort | 20 Sort | "Sort items" | `enableSorting()` |
| Spell check off | 23 DoNotSpellCheck | "Check spelling" unticked | `disableSpellChecking()` |
| Commit immediately | 27 CommitOnSelChange | "Commit selected value immediately" | `enableSelectOnClick()` |

> **Warning:** Preview on macOS renders dropdowns but does not always regenerate their appearance after saving, so the file may show the old value in Acrobat. Ask Mac clients to test in Acrobat Reader, or regenerate appearances with pdf-lib after receiving the file.

### Try It Yourself

```js
const { PDFDocument, StandardFonts } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

page.drawText('State:', { x: 72, y: 705, size: 11, font });
const state = form.createDropdown('property.state');
state.addOptions(['AZ', 'CA', 'NY', 'TX', 'WY']);
state.addToPage(page, { x: 120, y: 698, width: 70, height: 20 });

page.drawText('Product:', { x: 72, y: 675, size: 11, font });
const product = form.createDropdown('order.product');
product.addOptions(["Owner's policy", "Lender's policy", 'Both']);
product.enableEditing();
product.addToPage(page, { x: 120, y: 668, width: 200, height: 20 });

function safeSelect(dd, value) {
  if (dd.getOptions().includes(value)) { dd.select(value); return true; }
  console.warn('not an option:', value); return false;
}
safeSelect(state, 'TX');
safeSelect(state, 'Texas');
safeSelect(product, 'Both');
console.log(state.getSelected(), product.getSelected());
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'dropdowns.pdf');
```

### Quiz

1. What does `dropdown.getSelected()` return in pdf-lib?
- [ ] A string
- [x] An array of selected values
- [ ] A boolean
> Choice fields share one API with multi-select option lists, so the result is always an array.

2. How does a PDF store "show Texas, export TX"?
- [x] An `/Opt` entry `[(TX) (Texas)]`
- [ ] Two separate fields
- [ ] A JavaScript action
> Two-element arrays in `/Opt` pair export and display values.

3. Which flag lets the user type a value not in the list?
- [ ] Sort
- [x] Edit
- [ ] Combo
> Edit (bit 19) turns a combo into an editable combo; Combo only makes it a dropdown.

### Exercises

1. **County list** — Create a dropdown `property.county` with five counties, enable sorting, and preselect the third.
<details><summary>Solution</summary>

```js
const county = form.createDropdown('property.county');
const list = ['Travis', 'Harris', 'Dallas', 'Bexar', 'Tarrant'];
county.addOptions(list);
county.enableSorting();
county.select(list[2]);
county.addToPage(page, { x: 120, y: 638, width: 120, height: 20 });
```

</details>

2. **Options audit** — Print every dropdown in a form with its option count.
<details><summary>Solution</summary>

```js
form.getFields().forEach(f => {
  if (f.constructor.name === 'PDFDropdown') console.log(f.getName(), f.getOptions().length);
});
```

</details>

### Interview Questions

**Q: When would you use an editable dropdown, and what does it cost?**
When the list is guidance rather than a constraint, for example product names where new endorsements appear every quarter, or a "Referred by" field. The cost is that the exported value can be any string, so I lose the guarantee that the data matches a code list; downstream validation must normalise it, and reporting needs a mapping step. I use non-editable dropdowns for anything that feeds a lookup, such as state codes and rate-matrix keys.

**Q: How do display values and export values differ in a choice field?**
The `/Opt` array can hold pairs where the first element is what is exported in `/V` and the second is what the user sees. That lets a form show "Texas" but store `TX`, which keeps exports compatible with rate matrices and CRMs. pdf-lib only writes plain strings, so I either display the codes or finish the pairs in Acrobat, and I document the mapping in the build sheet so QA can check that `getSelected()` returns the export side.

**Q: A client filled a dropdown on a Mac and the value is missing in Acrobat. What do you suspect?**
Preview saved the value but did not regenerate the widget appearance, so Acrobat shows the stale appearance stream. I confirm by reading the field with pdf-lib or pdftk, which shows the value is present, and I fix by loading the file with pdf-lib and saving, which regenerates appearances, or by setting `NeedAppearances`. For the future I advise the client to use Acrobat Reader or I flatten the returned form on receipt so what they see is what we store.

## Text field properties (multiline, comb, max length, formats)

Text fields carry most of a form's data, and their properties decide whether the client's users can actually enter what the form asks for. This chapter covers the flags in `/Ff`, the `/MaxLen` and `/Q` entries, and the Acrobat Format tab that formats numbers, dates and phone numbers.

### Flags every text field may use

| Flag | Bit | Acrobat option | Effect |
|---|---|---|---|
| Multiline | 13 | Options → Multi-line | Wraps text; Enter adds a line |
| Password | 14 | Options → Password | Shows asterisks |
| FileSelect | 21 | Options → Field is used for file selection | Path picker |
| DoNotSpellCheck | 23 | Options → Check spelling (off) | No red underlines |
| DoNotScroll | 24 | Options → Scroll long text (off) | Input stops at the box edge |
| Comb | 25 | Options → Comb of N characters | One character per cell |
| RichText | 26 | Options → Allow Rich Text Formatting | Bold/italic allowed |

The universal flags ReadOnly (bit 1), Required (bit 2) and NoExport (bit 3) apply too.

### Multiline and scrolling

A comments box should be multiline **and** should not scroll if it will be printed, otherwise text that the user typed disappears below the visible area on paper. In pdf-lib:

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();

const notes = form.createTextField('notes');
notes.enableMultiline();
notes.disableScrolling();
notes.setFontSize(10);
notes.addToPage(page, { x: 72, y: 560, width: 468, height: 90 });
```

### Comb fields and maximum length

A comb field divides its width into `/MaxLen` equal cells, ideal for ZIP codes, SSNs, account numbers and date boxes on government-style forms. Comb requires MaxLen and works only when Multiline, Password and FileSelect are off.

```js
const zip = form.createTextField('property.zip');
zip.setMaxLength(5);
zip.enableCombing();
zip.addToPage(page, { x: 72, y: 500, width: 100, height: 22 });
```

Max length without comb is also useful on its own: a 2-character state abbreviation or a 9-digit routing number.

### Alignment, font size and default values

`/Q` is the quadding: 0 left, 1 centre, 2 right. Amount fields should be right-aligned. Font size 0 means **auto**, which shrinks to fit; it is convenient for names on narrow boxes but produces inconsistent sizes down a column, so prefer a fixed 10 pt for aligned rows.

```js
const { TextAlignment } = PDFLib;
const amount = form.createTextField('loan.amount');
amount.setAlignment(TextAlignment.Right);
amount.setFontSize(10);
amount.setText('250,000.00');
amount.addToPage(page, { x: 72, y: 460, width: 120, height: 22 });
```

pdf-lib has no default-value API; `/DV` is what Acrobat's Reset action restores, and you set it in Acrobat's Options tab **Default Value** or with a low-level `field.acroField.dict.set(PDFName.of('DV'), PDFString.of('0.00'))`.

### The Acrobat Format tab

Format scripts are Acrobat-only JavaScript, but they are what clients expect on number and date fields:

| Category | Example setting | What it writes |
|---|---|---|
| Number | 2 decimals, separator 1,234.56, currency $ | `AFNumber_Format(2, 0, 0, 0, "$", true)` |
| Percentage | 2 decimals | `AFPercent_Format(2, 0)` |
| Date | `mm/dd/yyyy` | `AFDate_FormatEx("mm/dd/yyyy")` |
| Time | `HH:MM` | `AFTime_Format(0)` |
| Special | Zip, Zip+4, Phone, SSN | `AFSpecial_Format(0..3)` |
| Custom | Your own | Custom Format script |

Each Format choice also installs a matching **Keystroke** script (`AFNumber_Keystroke`, `AFDate_KeystrokeEx`) that rejects invalid characters as the user types. Chrome runs many `AF*` functions because PDFium implements them; Preview runs none, so formats are a convenience, not validation.

### Placeholder text and tooltips

PDF has no placeholder attribute. Use the tooltip (`/TU`, Acrobat General tab) for guidance like "mm/dd/yyyy", and optionally print a light hint in the page layer under the field. The tooltip doubles as the accessible name for screen readers.

> **Tip:** For a 767-page handbook's acknowledgement sheet or any form that will be printed after filling, turn scrolling off on every multiline field and size the box for the longest plausible answer. Nothing annoys a client more than missing text on the printed copy.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, TextAlignment } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

page.drawText('ZIP (comb of 5):', { x: 72, y: 730, size: 10, font });
const zip = form.createTextField('property.zip');
zip.setMaxLength(5); zip.enableCombing(); zip.setText('78701');
zip.addToPage(page, { x: 200, y: 724, width: 100, height: 22 });

page.drawText('Loan amount (right-aligned):', { x: 72, y: 700, size: 10, font });
const amount = form.createTextField('loan.amount');
amount.setAlignment(TextAlignment.Right); amount.setFontSize(10); amount.setText('250,000.00');
amount.addToPage(page, { x: 200, y: 694, width: 120, height: 22 });

page.drawText('Comments (multiline, no scroll):', { x: 72, y: 670, size: 10, font });
const notes = form.createTextField('notes');
notes.enableMultiline(); notes.disableScrolling(); notes.setFontSize(10);
notes.setText('Buyer requests closing before month end.\nSurvey attached.');
notes.addToPage(page, { x: 72, y: 580, width: 468, height: 80 });

console.log(zip.getText(), '|', amount.getText(), '|', notes.getText().split('\n').length, 'lines');
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'text-props.pdf');
```

### Quiz

1. A comb field requires which other setting?
- [ ] Multiline
- [x] A maximum length
- [ ] Rich text
> Comb divides the width into MaxLen cells; without MaxLen there is nothing to divide by.

2. What does font size 0 mean in a field's `/DA`?
- [x] Auto-size to fit the box
- [ ] Hidden text
- [ ] Use the page default
> Auto-size is handy for narrow boxes but gives uneven sizes down a column.

3. Which viewer ignores Acrobat Format scripts entirely?
- [ ] Acrobat Reader
- [ ] Chrome
- [x] macOS Preview
> Preview runs no JavaScript; PDFium in Chrome implements many `AF*` helpers.

### Exercises

1. **SSN comb** — Create a 9-cell comb field `applicant.ssn` with spell-check disabled.
<details><summary>Solution</summary>

```js
const ssn = form.createTextField('applicant.ssn');
ssn.setMaxLength(9); ssn.enableCombing(); ssn.disableSpellChecking();
ssn.addToPage(page, { x: 200, y: 540, width: 180, height: 22 });
```

</details>

2. **Audit multiline scroll** — Print the names of multiline fields that still allow scrolling.
<details><summary>Solution</summary>

```js
form.getFields().forEach(f => {
  if (f.constructor.name === 'PDFTextField' && f.isMultiline() && f.isScrollable()) console.log(f.getName());
});
```

</details>

### Interview Questions

**Q: How do you make a comments box safe for printing?**
Multiline on, scrolling off, a fixed font size and a box sized for the longest realistic answer. With scrolling off the viewer refuses input beyond the visible area, so what the user sees is exactly what prints. I also set a MaxLen roughly equal to the capacity so exports do not carry text that never appeared on paper. If the client insists on unlimited comments, I add a second page "continuation" field rather than a scrolling box.

**Q: Explain the difference between Format, Keystroke and Validate scripts on a text field.**
Keystroke runs on every character and can reject it; Format runs when the field is displayed and controls how the stored value looks, for example adding a currency symbol; Validate runs when the value is committed and can reject the whole value with `event.rc = false`. Acrobat's Format tab installs matched Keystroke and Format pairs like `AFNumber_Keystroke` and `AFNumber_Format`. Because only Acrobat, Reader and partially Chrome run them, I treat them as user experience, and I re-validate the data where it is consumed.

**Q: Why prefer a fixed font size over auto-size on aligned rows?**
Auto-size picks a size per field based on its content, so a column of names ends up with 12 pt in one row and 7 pt in the next, which looks broken and hurts readability. Fixed 10 pt keeps rows uniform and predictable in every viewer. I use auto-size only for single narrow boxes where overflow is likely, such as an email field on a compact layout.

## Tab order & alignment/distribution

Two things make a form feel professional to the person filling it: the fields line up, and pressing Tab moves to the next logical field. Both are cheap to get right and embarrassing to get wrong.

### What tab order really is

Tab order is the order of widget annotations in each page's `/Annots` array, unless the page or document sets `/Tabs` to `/R` (row order), `/C` (column order) or `/S` (structure order). Acrobat's "Order Tabs Manually" simply reorders `/Annots`. Because it is per page, the order across pages is page 1 then page 2, always.

```text
5 0 obj <<              % page
  /Type /Page
  /Tabs /R              % optional: rows, columns or structure
  /Annots [21 0 R 22 0 R 23 0 R]   % this order is the manual tab order
>>
```

### Setting tab order in Acrobat

Prepare Form → right pane **Fields** → **More** → **Set Tab Order**, then choose **Order Tabs by Rows**, **by Columns**, **by Structure** (uses tags), or **Order Tabs Manually**. Turn on **Show Tab Numbers** to see a number badge on every field. In manual mode you click fields in the desired order, or drag entries in the Fields pane. For most single-column forms, "by Rows" is correct and takes one click.

### Tab order in code

pdf-lib adds widgets to `/Annots` in the order you call `addToPage`, so **create fields in reading order** and the tab order is right for free. If you must fix an existing file, reorder the array:

```js
const { PDFDocument, PDFName } = PDFLib;
// Reorder a page's /Annots so widgets follow a list of field names.
function setTabOrder(pdfDoc, page, form, orderedNames) {
  const annots = page.node.lookup(PDFName.of('Annots'));
  const refs = annots.asArray();
  const byName = new Map();
  orderedNames.forEach((name, i) => {
    form.getField(name).acroField.getWidgets().forEach(w => byName.set(pdfDoc.context.getObjectRef(w.dict), i));
  });
  refs.sort((a, b) => (byName.get(a) ?? 999) - (byName.get(b) ?? 999));
  page.node.set(PDFName.of('Annots'), pdfDoc.context.obj(refs));
}
```

Alternatively set the page's `/Tabs` to `/R` and let the viewer compute row order, which every modern viewer honours.

### Alignment and distribution in Acrobat

Select several fields (Shift-click, or drag a marquee), right-click, and use **Align** (Left, Right, Top, Bottom, Vertical Center, Horizontal Center), **Distribute** (Vertically, Horizontally) and **Center** (Vertically, Horizontally on page). The field you selected *last* is the anchor for alignment. **Match size** (Height, Width, Both) makes fields identical. Do this per column and the form snaps into a grid in minutes.

### Alignment in code

In code, alignment is arithmetic. Keep the grid constants in one place and derive every rect from them.

```js
const GRID = { left: 186, width: 372, height: 22, gap: 4, top: 700 };
const rowY = i => GRID.top - i * (GRID.height + GRID.gap);
const rect = i => ({ x: GRID.left, y: rowY(i), width: GRID.width, height: GRID.height });
console.log(rect(0), rect(5)); // y: 700 then y: 570
```

To distribute N fields evenly between two positions: `x_i = x0 + i * (x1 - x0) / (N - 1)`.

### Checking tab order without Acrobat

Dump each page's annotation order and print the field names; if the list reads top-to-bottom, left-to-right, the order is right.

```js
function tabReport(pdfDoc, form) {
  pdfDoc.getPages().forEach((page, p) => {
    const annots = page.node.lookup(PDFName.of('Annots'));
    if (!annots) return;
    const names = annots.asArray().map(ref => {
      const d = pdfDoc.context.lookup(ref);
      const t = d.get(PDFName.of('T')) || pdfDoc.context.lookup(d.get(PDFName.of('Parent')))?.get(PDFName.of('T'));
      return t ? t.decodeText() : '?';
    });
    console.log('page', p + 1, names.join(' → '));
  });
}
```

| Symptom | Cause | Fix |
|---|---|---|
| Tab jumps to page bottom then back up | Fields added out of order | Set `/Tabs /R` or reorder `/Annots` |
| Radio options tab in the wrong order | Widgets created out of order | Create options left to right |
| Column 2 tabs before column 1 finishes | Two-column layout with row order | Use manual order or `/Tabs /C` |
| Fields look ragged | Hand-dragged rects | Align/Distribute or grid constants |

> **Interview note:** "Is tab order a document setting?" No, it is per page (`/Annots` order or `/Tabs`). That is why fixing page 1 does not fix page 2, and why scripts that fix tab order loop over every page.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, PDFName } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

const GRID = { left: 186, width: 372, height: 22, gap: 4, top: 700 };
const rect = i => ({ x: GRID.left, y: GRID.top - i * (GRID.height + GRID.gap), width: GRID.width, height: GRID.height });
const names = ['applicant.name', 'applicant.email', 'applicant.phone', 'property.address', 'property.city'];

// Deliberately create out of order, then fix by setting /Tabs /R
[4, 2, 0, 3, 1].forEach(i => {
  page.drawText(names[i], { x: 54, y: rect(i).y + 6, size: 9, font });
  form.createTextField(names[i]).addToPage(page, rect(i));
});
page.node.set(PDFName.of('Tabs'), PDFName.of('R'));

const annots = page.node.lookup(PDFName.of('Annots')).asArray();
console.log('/Annots order:', annots.map(r => pdfDoc.context.lookup(r).get(PDFName.of('T')).decodeText()).join(' → '));
console.log('/Tabs set to R, so viewers tab by rows regardless.');
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'tab-order.pdf');
```

### Quiz

1. Where is manual tab order stored?
- [ ] In the `/AcroForm` dictionary
- [x] In the order of each page's `/Annots` array
- [ ] In the field names
> Tab order is per page; `/Tabs` can override it with row, column or structure order.

2. In Acrobat's Align commands, which field is the anchor?
- [ ] The first selected
- [x] The last selected
- [ ] The largest
> The last-selected field (highlighted differently) stays put and the others move to it.

3. What is the simplest way to get correct tab order when generating a form in pdf-lib?
- [x] Create fields in reading order
- [ ] Sort field names alphabetically
- [ ] Set `/NeedAppearances`
> `addToPage` appends to `/Annots`, so creation order is tab order.

### Exercises

1. **Distribute horizontally** — Compute x positions for four 14-pt checkboxes evenly spaced between x=72 and x=372.
<details><summary>Solution</summary>

```js
const xs = [0, 1, 2, 3].map(i => 72 + i * (372 - 72) / 3);
console.log(xs); // [72, 172, 272, 372]
```

</details>

2. **Column order** — Change the Try It page so tab order goes down columns instead of across rows.
<details><summary>Solution</summary>

```js
page.node.set(PDFName.of('Tabs'), PDFName.of('C'));
```

</details>

### Interview Questions

**Q: How do you fix tab order on a 12-page form quickly?**
If the layout is single-column I set every page's tab order to Rows: in Acrobat, Fields pane → More → Set Tab Order → Order Tabs by Rows, or in code set `/Tabs /R` on each page dictionary in a loop. For two-column pages I use Columns or manual order, and for tagged forms Structure order keeps tab order and screen-reader order identical. Then I test by tabbing through each page in Preview mode and by dumping `/Annots` names per page in a script so the check is repeatable after every revision.

**Q: Why did a form generated by a script tab in a strange order?**
Because the script created fields in data order rather than reading order, for example looping over a dictionary whose keys were alphabetical, and pdf-lib appends widgets to `/Annots` in creation order. The fix is to build from an ordered build sheet or to set `/Tabs /R`. I mention this because it is a common review comment on generated forms and it costs nothing to avoid.

**Q: How do you align 168 fields without dragging each one?**
By never dragging in the first place: fields come from a grid in code or from typed values in Acrobat's Position tab. When I inherit a ragged form, I select each column with a marquee, Align Left to the best-placed field, Match Width, then Distribute Vertically in sections that share a row pitch. A column of 20 fields takes under a minute that way, and I finish by checking the Fields pane order and tab numbers.

# LEVEL: Advanced

## Creating forms with pdf-lib (JavaScript)

pdf-lib is a pure-JavaScript PDF library that runs in Node and in the browser with no native dependencies. Its `PDFForm` API covers every AcroForm field type except signatures, regenerates appearance streams on save, and can both create new forms and edit existing ones. This chapter builds a complete, data-driven form generator, the pattern behind every Fiverr form delivery where the client sends a spreadsheet of questions.

### Setup

```js
// Node: npm install pdf-lib
import { PDFDocument, StandardFonts, rgb, TextAlignment } from 'pdf-lib';
// Browser (this site): the global PDFLib is already loaded
const { PDFDocument, StandardFonts, rgb, TextAlignment } = PDFLib;
```

### A spec-driven generator

Describe the form as data, then let one function render it. This keeps the build sheet, the code and the QA export in sync.

```js
const spec = [
  { section: 'Applicant' },
  { name: 'applicant.name',    label: 'Full name',      type: 'text' },
  { name: 'applicant.dob',     label: 'Date of birth',  type: 'text', tooltip: 'mm/dd/yyyy', maxLen: 10 },
  { name: 'applicant.marital', label: 'Marital status', type: 'radio', options: ['Single', 'Married', 'Divorced'] },
  { section: 'Property' },
  { name: 'property.state',    label: 'State',          type: 'dropdown', options: ['TX', 'CA', 'NY', 'WY'] },
  { name: 'property.primary',  label: 'Primary residence', type: 'checkbox' },
  { name: 'loan.amount',       label: 'Loan amount',    type: 'text', align: 'right' },
  { name: 'notes',             label: 'Notes',          type: 'multiline', height: 70 },
];
```

```js
async function buildForm(spec) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle('Loan Intake Form');
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const form = pdfDoc.getForm();
  let page = pdfDoc.addPage([612, 792]);
  let y = 740;
  const L = 54, FX = 186, FW = 372;

  const ensureRoom = h => { if (y - h < 54) { page = pdfDoc.addPage([612, 792]); y = 740; } };

  for (const item of spec) {
    if (item.section) { ensureRoom(30); y -= 10; page.drawText(item.section, { x: L, y, size: 12, font: bold }); y -= 22; continue; }
    const h = item.height || 22;
    ensureRoom(h + 4);
    page.drawText(item.label, { x: L, y: y - h + 6, size: 10, font });
    const rect = { x: FX, y: y - h, width: FW, height: h, borderColor: rgb(0.7, 0.7, 0.7) };
    switch (item.type) {
      case 'text':
      case 'multiline': {
        const f = form.createTextField(item.name);
        if (item.type === 'multiline') { f.enableMultiline(); f.disableScrolling(); }
        if (item.maxLen) f.setMaxLength(item.maxLen);
        if (item.align === 'right') f.setAlignment(TextAlignment.Right);
        f.setFontSize(10);
        f.addToPage(page, rect);
        break;
      }
      case 'checkbox':
        form.createCheckBox(item.name).addToPage(page, { ...rect, width: 14, height: 14, y: y - 16 });
        break;
      case 'radio': {
        const g = form.createRadioGroup(item.name);
        item.options.forEach((opt, i) => {
          g.addOptionToPage(opt, page, { x: FX + i * 110, y: y - 16, width: 14, height: 14 });
          page.drawText(opt, { x: FX + i * 110 + 20, y: y - 13, size: 10, font });
        });
        break;
      }
      case 'dropdown': {
        const d = form.createDropdown(item.name);
        d.addOptions(item.options);
        d.addToPage(page, { ...rect, width: 120 });
        break;
      }
    }
    y -= h + 6;
  }
  return pdfDoc;
}
```

The generator draws labels in the page layer, creates fields in reading order (so tab order is right), paginates when it runs out of room, and takes every property from the spec. Adding a field to the form is now a one-line edit to `spec`.

### Editing an existing PDF

Load a static background or a client's existing form, then add or modify fields:

```js
const existing = await PDFDocument.load(bytesFromClient, { ignoreEncryption: true });
const form = existing.getForm();
form.getFields().forEach(f => console.log(f.constructor.name, f.getName()));
const pageOne = existing.getPage(0);
form.createTextField('reviewer.initials').addToPage(pageOne, { x: 480, y: 740, width: 60, height: 20 });
```

`ignoreEncryption` lets you open owner-password-restricted files; it does not decrypt user-password files.

### Fonts and non-Latin text

Standard fonts (Helvetica, Times, Courier) only cover WinAnsi characters. For Urdu, Arabic, Chinese or even curly quotes in a filled value, embed a TrueType font with `pdfDoc.registerFontkit(fontkit)` (the `@pdf-lib/fontkit` package) and `pdfDoc.embedFont(fontBytes)`, then pass it to `form.updateFieldAppearances(font)` before saving. Without that, `setText('Lahore – Punjab')` throws on the en dash.

### Common pdf-lib pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Duplicate name | `createTextField` throws "field already exists" | Unique names; reuse the field for mirrored widgets |
| Unsupported glyph | `WinAnsi cannot encode` error | Embed a TTF via fontkit |
| Saved with `updateFieldAppearances: false` | Blank fields in Chrome | Leave the default (`true`) |
| Field on page not yet added | Widget missing | Add pages before `addToPage` |
| Editing a flattened form | No fields found | Fields are gone; rebuild on the flattened background |

> **Tip:** `pdfDoc.save({ useObjectStreams: false })` produces files that older tools such as pdftk 2.02 can read; object streams are fine for every modern viewer.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, rgb, TextAlignment } = PDFLib;
const spec = [
  { section: 'Applicant' },
  { name: 'applicant.name', label: 'Full name', type: 'text' },
  { name: 'applicant.marital', label: 'Marital status', type: 'radio', options: ['Single', 'Married'] },
  { section: 'Property' },
  { name: 'property.state', label: 'State', type: 'dropdown', options: ['TX', 'CA', 'WY'] },
  { name: 'property.primary', label: 'Primary residence', type: 'checkbox' },
  { name: 'loan.amount', label: 'Loan amount', type: 'text', align: 'right' },
  { name: 'notes', label: 'Notes', type: 'multiline', height: 70 },
];
const pdfDoc = await PDFDocument.create();
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const form = pdfDoc.getForm();
const page = pdfDoc.addPage([612, 792]);
let y = 740; const L = 54, FX = 186, FW = 372;
for (const it of spec) {
  if (it.section) { y -= 10; page.drawText(it.section, { x: L, y, size: 12, font: bold }); y -= 22; continue; }
  const h = it.height || 22;
  page.drawText(it.label, { x: L, y: y - h + 6, size: 10, font });
  const rect = { x: FX, y: y - h, width: FW, height: h, borderColor: rgb(0.7, 0.7, 0.7) };
  if (it.type === 'text' || it.type === 'multiline') {
    const f = form.createTextField(it.name); f.setFontSize(10);
    if (it.type === 'multiline') { f.enableMultiline(); f.disableScrolling(); }
    if (it.align === 'right') f.setAlignment(TextAlignment.Right);
    f.addToPage(page, rect);
  } else if (it.type === 'checkbox') {
    form.createCheckBox(it.name).addToPage(page, { x: FX, y: y - 16, width: 14, height: 14 });
  } else if (it.type === 'radio') {
    const g = form.createRadioGroup(it.name);
    it.options.forEach((o, i) => { g.addOptionToPage(o, page, { x: FX + i * 110, y: y - 16, width: 14, height: 14 }); page.drawText(o, { x: FX + i * 110 + 20, y: y - 13, size: 10, font }); });
  } else if (it.type === 'dropdown') {
    const d = form.createDropdown(it.name); d.addOptions(it.options); d.addToPage(page, { ...rect, width: 120 });
  }
  y -= h + 6;
}
console.log(form.getFields().map(f => f.getName()));
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'generated-form.pdf');
```

### Quiz

1. Why does `setText('Lahore – Punjab')` throw with a standard font?
- [ ] The text is too long
- [x] The en dash is not in WinAnsi encoding
- [ ] Text fields cannot contain spaces
> Standard 14 fonts only cover WinAnsi; embed a TrueType font via fontkit for other glyphs.

2. What does `PDFDocument.load(bytes, { ignoreEncryption: true })` do?
- [x] Opens owner-password-restricted files without decrypting user-password files
- [ ] Removes all passwords
- [ ] Encrypts the output
> It bypasses permission restrictions only; a user password still blocks loading.

3. What is the advantage of a spec-driven generator?
- [ ] Smaller files
- [x] One source of truth for build sheet, code and QA
- [ ] Faster rendering
> Adding or renaming a field becomes a data change, and the same spec can drive the field audit.

### Exercises

1. **Add pagination** — Extend the Try It generator so that when `y` would drop below 54 a new page is added.
<details><summary>Solution</summary>

```js
let pg = page;
const ensureRoom = h => { if (y - h < 54) { pg = pdfDoc.addPage([612, 792]); y = 740; } };
// call ensureRoom(h + 6) before drawing each item and use pg instead of page
```

</details>

2. **Field inventory** — Print a Markdown table of name, type and page index for every field.
<details><summary>Solution</summary>

```js
const pages = pdfDoc.getPages();
console.log('| name | type | page |\n|---|---|---|');
form.getFields().forEach(f => {
  const ref = f.acroField.getWidgets()[0].P();
  const idx = pages.findIndex(p => p.ref === ref);
  console.log(`| ${f.getName()} | ${f.constructor.name} | ${idx + 1} |`);
});
```

</details>

### Interview Questions

**Q: Why choose pdf-lib for form generation over Acrobat or ReportLab?**
pdf-lib is scriptable, runs in Node and the browser without native dependencies, and can both create fields and edit existing PDFs, which ReportLab cannot (ReportLab only writes new files). Compared with Acrobat, a spec-driven generator is repeatable: a client's change to question 37 is a data edit, not a manual re-layout of 168 fields. The trade-offs are no signature fields, no Acrobat-style JavaScript wizard, and the need to embed a TrueType font for non-WinAnsi text. I typically generate with pdf-lib and finish signatures and JavaScript in Acrobat.

**Q: How do you handle a client's existing PDF that needs fields added?**
Load it with `PDFDocument.load`, using `ignoreEncryption` if it is permission-restricted, inspect `form.getFields()` to learn what is already there and the naming style, then add fields in reading order onto the right page objects. I never rebuild fields that already work; I extend them, and I run the same inventory script before and after so I can show the client exactly which fields changed.

**Q: What breaks when a generated form is opened in Chrome but not in Acrobat?**
Usually appearance streams: if the file was saved with `updateFieldAppearances: false` or a value was set by a tool that skips appearances, Acrobat may regenerate on open while Chrome shows the stale stream. Fonts are the other cause: a `/DA` string referencing a font missing from `/DR` renders in Acrobat's fallback but blank in PDFium. I keep the default appearance update on, embed the font used in `/DA`, and test in both viewers.

## Filling & reading forms programmatically (pdf-lib, PyMuPDF, pdftk)

Building the form is half of the job. The other half is the round trip: filling it from data, and reading the values back when the client returns it. The three tools you will reach for are pdf-lib (JavaScript), PyMuPDF (Python) and pdftk (command line), and they differ in how they handle appearances, checkboxes and encoding.

### Filling with pdf-lib

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.load(templateBytes);
const form = pdfDoc.getForm();
const data = { 'applicant.name': 'Ali Raza', 'property.state': 'TX', 'property.primary': true, 'applicant.marital': 'Married' };

for (const [name, value] of Object.entries(data)) {
  const field = form.getField(name);
  switch (field.constructor.name) {
    case 'PDFTextField':  field.setText(String(value)); break;
    case 'PDFCheckBox':   value ? field.check() : field.uncheck(); break;
    case 'PDFRadioGroup': field.select(value); break;
    case 'PDFDropdown':
    case 'PDFOptionList': field.select(value); break;
  }
}
const bytes = await pdfDoc.save(); // appearances regenerated
```

Reading is the mirror image: `getText()`, `isChecked()`, `getSelected()`. `form.getField(name)` throws if the name does not exist, which is a useful guard against renamed fields.

### Filling with PyMuPDF (Python)

PyMuPDF exposes every widget on a page. Set `field_value`, call `update()`, and save. It never guesses the on-state name.

```python
import pymupdf  # pip install pymupdf (import name was "fitz" before 1.24)

data = {"applicant.name": "Ali Raza", "property.state": "TX", "property.primary": True, "applicant.marital": "Married"}
doc = pymupdf.open("intake.pdf")
for page in doc:
    for w in page.widgets():
        if w.field_name not in data:
            continue
        v = data[w.field_name]
        if w.field_type == pymupdf.PDF_WIDGET_TYPE_CHECKBOX:
            w.field_value = w.on_state() if v else "Off"
        elif w.field_type == pymupdf.PDF_WIDGET_TYPE_RADIOBUTTON:
            w.field_value = (w.on_state() == v)          # True only on the matching widget
        else:
            w.field_value = str(v)
        w.update()                                        # regenerates the appearance
doc.save("intake-filled.pdf", garbage=3, deflate=True)
```

Reading values:

```python
for page in doc:
    for w in page.widgets():
        print(w.field_name, w.field_type_string, repr(w.field_value))
```

`field_type_string` gives `Text`, `CheckBox`, `RadioButton`, `ComboBox`, `ListBox`, `Button`, `Signature`. For radio groups, each widget reports its own state, so collect the one whose `field_value` is not `Off`.

### pdftk: dump, generate, fill

```bash
pdftk intake.pdf dump_data_fields_utf8 > fields.txt      # inventory: FieldType, FieldName, FieldStateOption, FieldValue
pdftk intake.pdf generate_fdf output blank.fdf           # FDF template with every field name
pdftk intake.pdf fill_form data.fdf output filled.pdf    # add "flatten" at the end to bake it
pdftk intake.pdf fill_form data.xfdf output filled.pdf need_appearances
```

A minimal FDF:

```text
%FDF-1.2
1 0 obj << /FDF << /Fields [
  << /T (applicant.name) /V (Ali Raza) >>
  << /T (property.primary) /V /Yes >>
  << /T (applicant.marital) /V /Married >>
] >> >>
endobj
trailer << /Root 1 0 R >>
%%EOF
```

XFDF is the XML equivalent Acrobat exports (`<field name="applicant.name"><value>Ali Raza</value></field>`); use it when data contains non-Latin text, because FDF strings are PDFDocEncoding unless you write UTF-16 with a BOM. pdftk (the Java rewrite `pdftk-java` on modern Linux) does not regenerate appearances; `need_appearances` asks the viewer to do it.

### Comparison

| Concern | pdf-lib | PyMuPDF | pdftk |
|---|---|---|---|
| Regenerates appearances | Yes, on save | Yes, `update()` | No (`need_appearances` flag only) |
| Checkbox on-state | Reads from `/AP` | `on_state()` | You must know it |
| Unicode text | Needs embedded TTF | Handles via base-14 or embedded fonts | XFDF only |
| Flatten | `form.flatten()` | `doc.bake()` (1.23.8+) | `flatten` keyword |
| Runs where | Node, browser | Python, servers | Shell, CI |
| Edits page content too | Yes | Yes | No |

### Round-trip test

Every delivery should include a script that fills each field with a unique marker (`applicant.name = "F001"`), reads it back with a different tool, and diffs the two lists. That catches duplicate names, wrong on-states and encoding issues before the client does.

```js
const marker = {};
form.getFields().forEach((f, i) => { if (f.constructor.name === 'PDFTextField') marker[f.getName()] = 'F' + String(i).padStart(3, '0'); });
Object.entries(marker).forEach(([n, v]) => form.getTextField(n).setText(v));
const back = Object.fromEntries(Object.keys(marker).map(n => [n, form.getTextField(n).getText()]));
console.log(JSON.stringify(marker) === JSON.stringify(back) ? 'round trip OK' : 'MISMATCH');
```

> **Warning:** PyMuPDF's `widget.field_value` for a checkbox is a string state, not a boolean, on read; on write it accepts `True`/`False` for checkboxes but treats radio widgets individually. Always read back after writing.

### Try It Yourself

```js
const { PDFDocument, StandardFonts } = PDFLib;
// Build a small template, then fill it from JSON and read back.
const tpl = await PDFDocument.create();
const page = tpl.addPage([612, 792]);
const font = await tpl.embedFont(StandardFonts.Helvetica);
const f = tpl.getForm();
f.createTextField('applicant.name').addToPage(page, { x: 186, y: 700, width: 300, height: 22 });
f.createCheckBox('property.primary').addToPage(page, { x: 186, y: 670, width: 14, height: 14 });
const g = f.createRadioGroup('applicant.marital');
g.addOptionToPage('Single', page, { x: 186, y: 640, width: 14, height: 14 });
g.addOptionToPage('Married', page, { x: 286, y: 640, width: 14, height: 14 });
const dd = f.createDropdown('property.state'); dd.addOptions(['TX', 'CA', 'WY']); dd.addToPage(page, { x: 186, y: 600, width: 80, height: 20 });
['Full name', 'Primary?', 'Marital', 'State'].forEach((t, i) => page.drawText(t, { x: 54, y: [706, 673, 643, 606][i], size: 10, font }));
const templateBytes = await tpl.save();

// --- fill step, as a separate load ---
const data = { 'applicant.name': 'Ali Raza', 'property.primary': true, 'applicant.marital': 'Married', 'property.state': 'TX' };
const pdfDoc = await PDFDocument.load(templateBytes);
const form = pdfDoc.getForm();
for (const [name, value] of Object.entries(data)) {
  const field = form.getField(name);
  const t = field.constructor.name;
  if (t === 'PDFTextField') field.setText(String(value));
  else if (t === 'PDFCheckBox') value ? field.check() : field.uncheck();
  else field.select(value);
}
const readBack = {
  'applicant.name': form.getTextField('applicant.name').getText(),
  'property.primary': form.getCheckBox('property.primary').isChecked(),
  'applicant.marital': form.getRadioGroup('applicant.marital').getSelected(),
  'property.state': form.getDropdown('property.state').getSelected()[0],
};
console.log(JSON.stringify(readBack) === JSON.stringify(data) ? 'round trip OK' : 'MISMATCH', readBack);
download(new Blob([await pdfDoc.save()], { type: 'application/pdf' }), 'filled.pdf');
```

### Quiz

1. Which tool does NOT regenerate appearance streams when filling?
- [ ] pdf-lib
- [ ] PyMuPDF
- [x] pdftk
> pdftk writes values only; `need_appearances` asks the viewer to rebuild them on open.

2. In PyMuPDF, how do you get the checkbox's on-state name safely?
- [x] `widget.on_state()`
- [ ] `widget.field_value`
- [ ] It is always `Yes`
> `on_state()` reads the real appearance key, avoiding the `Yes`/`On` guessing problem.

3. Why prefer XFDF over FDF for Urdu or accented names?
- [ ] FDF is deprecated
- [x] XFDF is XML in UTF-8; FDF strings default to PDFDocEncoding
- [ ] pdftk cannot read FDF
> FDF needs UTF-16 with a byte-order mark for non-Latin text, which is easy to get wrong.

### Exercises

1. **Missing-field report** — Fill from a data object and print any keys that do not exist as fields instead of throwing.
<details><summary>Solution</summary>

```js
const names = new Set(form.getFields().map(f => f.getName()));
const missing = Object.keys(data).filter(k => !names.has(k));
console.log('missing:', missing);
```

</details>

2. **PyMuPDF dump** — Write Python that prints one line per field with page number, name, type and value.
<details><summary>Solution</summary>

```python
import pymupdf
doc = pymupdf.open("intake.pdf")
for pno, page in enumerate(doc, 1):
    for w in page.widgets():
        print(pno, w.field_name, w.field_type_string, repr(w.field_value))
```

</details>

### Interview Questions

**Q: Compare pdf-lib, PyMuPDF and pdftk for filling forms in production.**
pdf-lib is my choice inside Node services and browser apps: it regenerates appearances on save and edits page content too, but needs an embedded TTF for non-WinAnsi text and cannot sign. PyMuPDF is the fastest and most complete in Python: widgets expose `on_state()`, `update()` regenerates appearances, and `bake()` flattens. pdftk is a shell tool ideal for CI checks and bulk FDF fills, but it does not rebuild appearances, so I only use it for inventories (`dump_data_fields`) and quick tests. For a client pipeline I pick the language the rest of the stack uses and always add a read-back check.

**Q: How do you verify a filled form is correct before sending it to a client?**
I run a round-trip script: fill every field with a unique marker, save, reload with a different library and compare. That catches duplicate names, checkbox on-state mismatches and encoding problems. I then open the file in Acrobat Reader and Chrome to confirm the appearances render, and for a batch job I sample files and compare a PyMuPDF text extraction of the page against the source data. The check takes seconds and has caught every "the form came back blank" issue before delivery.

**Q: What is FDF and when do you still use it?**
FDF is Adobe's Forms Data Format, a tiny PDF-syntax file containing `/T` name and `/V` value pairs that Acrobat and pdftk can import into a form. XFDF is its XML twin. I use XFDF as a portable, human-readable export of a completed form, for mail-merge style batch fills with pdftk, and for regression tests, because a diff of two XFDF files shows exactly which answers changed. For anything with non-Latin text I always choose XFDF.

## Calculations & JavaScript validation in Acrobat

Acrobat and Acrobat Reader run a JavaScript engine with a document object model for forms. Clients ask for totals that add themselves, dates that validate, and fields that appear only when a checkbox is ticked. All of this lives in the field Properties dialog under **Actions**, **Format**, **Validate** and **Calculate**, and it runs in Acrobat/Reader, partially in Chrome (PDFium implements the `AF*` helpers and most of the `Doc`/`Field` API) and not at all in Preview or most mobile viewers.

### Simple calculations without code

Properties → Calculate tab offers **Value is the sum (+) of** with a field picker. Behind it Acrobat stores:

```js
AFSimple_Calculate("SUM", new Array("fee.search", "fee.exam", "fee.policy"));
```

`AFSimple_Calculate` accepts `SUM`, `PRD`, `AVG`, `MIN`, `MAX`. The second option, **Simplified field notation**, lets you write `fee.search + fee.exam * 1.05` but only with names that contain no spaces or special characters, another argument for clean naming.

### Custom calculation scripts

For anything else use **Custom calculation script**. The result is assigned to `event.value`.

```js
// Calculate tab of field "premium.total": title premium from a rate matrix look-up
var amount = Number(this.getField("loan.amount").value) || 0;
var state = this.getField("property.state").value;
var rate = { TX: 5.75, CA: 4.20, WY: 3.90 }[state] || 0;   // per $1,000, illustrative
event.value = Math.round(amount / 1000 * rate * 100) / 100;
```

`this` is the document, `getField(name)` returns the field object, and `event.value` is the value the field will hold when the script ends. Assigning an empty string clears it.

### Calculation order

Acrobat runs calculation scripts in the order set under Fields pane → More → **Set Field Calculation Order**. If `premium.total` depends on `fee.subtotal`, the subtotal must be earlier, otherwise totals lag one edit behind. Check this whenever you add a calculated field; Acrobat appends new fields to the end of the `/CO` array.

### Validation scripts

Validate runs after the user commits a value. Set `event.rc = false` to reject it.

```js
// Validate tab of "loan.amount"
if (event.value !== "" && (isNaN(event.value) || Number(event.value) <= 0)) {
  app.alert("Loan amount must be a positive number.", 0);
  event.rc = false;
}
```

The Validate tab also offers a no-code **Field value is in range** option for number and date formats.

### Keystroke and format scripts

Keystroke scripts run per character. `event.change` is the typed character, `event.willCommit` is true on the final commit. The built-in `AFNumber_Keystroke(2, 0, 0, 0, "", true)` blocks letters in a number field. A custom uppercase filter:

```js
// Keystroke script on "property.state" (a text field): force uppercase, letters only
if (!event.willCommit) {
  event.change = event.change.toUpperCase();
  if (!/^[A-Z]*$/.test(event.change)) event.rc = false;
}
```

### Showing and hiding fields

Actions tab → Mouse Up → Run a JavaScript, typically on a checkbox or radio:

```js
// On checkbox "coapplicant.present": reveal the co-applicant section
var show = event.target.value !== "Off";
var names = ["coapplicant.name", "coapplicant.dob", "coapplicant.ssn"];
for (var i = 0; i < names.length; i++) {
  this.getField(names[i]).display = show ? display.visible : display.hidden;
}
```

`display.visible`, `display.hidden`, `display.noPrint` and `display.noView` map to the widget's annotation flags.

### Document-level scripts and buttons

Tools → JavaScript → **Document JavaScripts** holds functions shared by many fields, such as a `validateSSN(s)` helper. Push buttons wire to `this.resetForm()`, `this.print()`, `this.submitForm("https://…", cSubmitAs: "XFDF")` or `this.mailDoc({cTo: "orders@example.com"})`. Submit and mailDoc are blocked or prompt in most viewers; do not promise clients an email button that works everywhere.

### Where JavaScript does not run

| Viewer | `AF*` format/calc | Custom scripts | Notes |
|---|---|---|---|
| Acrobat / Reader | Yes | Yes | Reference behaviour |
| Chrome / Edge (PDFium) | Yes | Mostly | No `app.alert` in some builds; no submit |
| Firefox (pdf.js) | Partial | Partial | Scripting sandbox; many `AF*` supported |
| macOS Preview | No | No | Values still save |
| iOS/Android default viewers | No | No | Fill-only |

> **Warning:** Because Preview and mobile viewers skip scripts, a total field can be left blank or stale. Make calculated fields read-only, print a note "totals compute in Adobe Reader", and recompute the numbers in whatever system ingests the form.

### Try It Yourself

```js
// Attach Acrobat JavaScript to fields with pdf-lib. The scripts run when the PDF is opened in Acrobat/Reader/Chrome.
const { PDFDocument, StandardFonts, PDFName, PDFString, PDFDict } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

const mk = (name, label, y) => { page.drawText(label, { x: 54, y: y + 6, size: 10, font }); const f = form.createTextField(name); f.setFontSize(10); f.addToPage(page, { x: 186, y, width: 150, height: 22 }); return f; };
const a = mk('fee.search', 'Search fee', 700);
const b = mk('fee.exam', 'Exam fee', 670);
const total = mk('fee.total', 'Total (auto)', 640);
total.enableReadOnly();

// Build an /AA (additional actions) dictionary with a /C (calculate) JavaScript action
const js = pdfDoc.context.obj({ Type: 'Action', S: 'JavaScript', JS: PDFString.of('AFSimple_Calculate("SUM", new Array("fee.search","fee.exam"));') });
const aa = pdfDoc.context.obj({ C: pdfDoc.context.register(js) });
total.acroField.dict.set(PDFName.of('AA'), aa);
// Register calculation order so Acrobat runs it
form.acroForm.dict.set(PDFName.of('CO'), pdfDoc.context.obj([total.ref]));

console.log('Calculate action attached to', total.getName());
const bytes = await pdfDoc.save();
download(new Blob([bytes], { type: 'application/pdf' }), 'calc-form.pdf');
```

### Quiz

1. Where does a custom calculation script put its result?
- [ ] `this.value`
- [x] `event.value`
- [ ] `return`
> Calculation scripts assign to `event.value`; the field takes that value when the script finishes.

2. Totals update one edit late. What should you check?
- [ ] The field font
- [x] The field calculation order
- [ ] The tab order
> Dependent fields must be calculated after the fields they read; set it in the Fields pane.

3. Which viewer runs no form JavaScript at all?
- [ ] Chrome
- [x] macOS Preview
- [ ] Acrobat Reader
> Preview saves values but never executes scripts, so calculated fields stay blank there.

### Exercises

1. **Date validation** — Write a Validate script that rejects a `signed.date` value earlier than today.
<details><summary>Solution</summary>

```js
if (event.value !== "") {
  var d = util.scand("mm/dd/yyyy", event.value);
  var today = new Date(); today.setHours(0, 0, 0, 0);
  if (d === null || d < today) { app.alert("Date must be today or later."); event.rc = false; }
}
```

</details>

2. **Percentage split** — A `fee.total` and `fee.split` (percent). Compute `fee.buyer = total × split/100` and `fee.seller = total − buyer` in one custom script on `fee.buyer` and one on `fee.seller`, and state the calculation order.
<details><summary>Solution</summary>

```js
// fee.buyer
var t = Number(this.getField("fee.total").value) || 0, p = Number(this.getField("fee.split").value) || 0;
event.value = Math.round(t * p) / 100;
// fee.seller
event.value = (Number(this.getField("fee.total").value) || 0) - (Number(this.getField("fee.buyer").value) || 0);
// Order: fee.total (if calculated) → fee.buyer → fee.seller
```

</details>

### Interview Questions

**Q: A client wants a self-totalling invoice PDF. How do you build it and what do you warn them about?**
I make the line-amount fields number-formatted (`AFNumber_Format`), the total field read-only with a Calculate action (`AFSimple_Calculate("SUM", …)` or a custom script for tax), and I set the calculation order so subtotals precede totals. I warn that the arithmetic runs in Acrobat, Reader and Chrome but not in Preview or most phone viewers, so I make the total visually distinct, add a note about Adobe Reader, and recommend the ingesting system recompute totals rather than trusting the PDF value.

**Q: Explain `event.rc`, `event.value` and `event.change`.**
They are properties of the event object Acrobat passes to every field script. `event.value` is the value being formatted, validated or calculated; assigning to it in a Calculate or Format script changes what is stored or displayed. `event.change` is the character or pasted string in a Keystroke event, and you can modify it, for example to uppercase input. `event.rc` is the return code: setting it to `false` in Keystroke or Validate rejects the change and leaves the old value in place.

**Q: How would you make a section appear only when a checkbox is ticked, and what happens on print?**
I attach a Mouse Up JavaScript to the checkbox that sets `display` on each field in the section to `display.visible` or `display.hidden`. Hidden fields also do not print, so the printed copy matches the screen. Because the script does not run in Preview, I design the layout so the hidden section is harmless when visible, for example labelled "Co-applicant (if any)", rather than relying on hiding for correctness.

## Appearance streams, fonts & DA strings

To debug "it looks different in Chrome", "the text is tiny" or "the field is blank", you need to know how a viewer decides what to draw inside a field. Three things control it: the **appearance stream** (`/AP`), the **default appearance string** (`/DA`) and the fonts available in **default resources** (`/DR`).

### The appearance stream

`/AP /N` points at a Form XObject, a small content stream with its own `/BBox`, that draws the field's current look. Acrobat, pdf-lib and PyMuPDF write one whenever the value changes. A text field's stream looks like this:

```text
/Tx BMC                     % begin marked content for the text
  q
  1 1 226 18 re W n         % clip to the field's interior
  BT
    /Helv 10 Tf 0 g         % font Helv at 10 pt, black fill
    2 6 Td                  % start position inside the box
    (Ali Raza) Tj           % show the text
  ET
  Q
EMC
```

Checkbox streams draw a ZapfDingbats glyph; radio streams draw a circle or dot. Because the stream is just drawing instructions, a viewer that trusts it never needs to know the value, which is why a stale stream shows stale text.

### The DA string

`/DA` is the recipe a viewer uses to *regenerate* the appearance: a font resource name, a size and a colour operator.

```text
/DA (/Helv 10 Tf 0 g)          % Helvetica 10 pt, black (grayscale 0)
/DA (/Helv 0 Tf 0 0 1 rg)      % auto size, blue (RGB)
/DA (/TiRo 12 Tf 0.5 g)        % Times Roman 12 pt, 50% gray
```

`Tf` sets font and size, `g` grayscale fill, `rg` RGB fill, `k` CMYK fill. Size `0` means auto. The field's `/DA` overrides the document's `/AcroForm /DA`.

### Default resources

The font name in `/DA` must exist in `/DR /Font`. Acrobat's abbreviations are `Helv` (Helvetica), `HeBo` (Helvetica-Bold), `TiRo` (Times-Roman), `Cour` (Courier), `ZaDb` (ZapfDingbats). If `/DA` says `/Calibri` and `/DR` has no `Calibri`, Acrobat falls back silently while PDFium may draw nothing.

```js
const { PDFDocument, StandardFonts, PDFName } = PDFLib;
const pdfDoc = await PDFDocument.create();
const form = pdfDoc.getForm();
const dr = form.acroForm.dict.lookup(PDFName.of('DR'));
console.log('DR fonts:', dr ? dr.lookup(PDFName.of('Font')).keys().map(k => k.decodeText()) : 'none yet');
```

pdf-lib adds `Helv` and `ZaDb` to `/DR` when it first generates appearances.

### Changing a field's font in pdf-lib

```js
const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
const name = form.getTextField('applicant.name');
name.setFontSize(11);
name.updateAppearances(font);           // rewrite this field's /AP with this font
form.updateFieldAppearances(font);      // or every field at once
```

For a custom TTF (brand font, Urdu, CJK): `pdfDoc.registerFontkit(fontkit)`, `const brand = await pdfDoc.embedFont(ttfBytes, { subset: false })`, then `updateFieldAppearances(brand)`. Do not subset a font used by form fields; the viewer needs every glyph the user might type.

### NeedAppearances

`/AcroForm /NeedAppearances true` tells the viewer to ignore stored appearances and rebuild all of them from `/DA` and `/V` on open. Acrobat obeys; Chrome and pdf.js partly; Preview ignores. It is a patch for files produced by tools that cannot draw (pdftk), never a substitute for real appearance streams. Also, Acrobat may prompt to save on close when it is set, which annoys users.

### Rich text and multi-line details

Multiline fields regenerate with line wrapping based on the font's widths; a different font in `/DA` changes the wraps. Rich text fields store an XHTML `/RV` alongside `/V`; almost nothing outside Acrobat renders it, so avoid the RichText flag on client forms.

### Diagnosing appearance problems

| Symptom | Look at | Likely fix |
|---|---|---|
| Blank in Chrome, fine in Acrobat | `/AP` missing or stale | Regenerate appearances with pdf-lib/PyMuPDF |
| Tiny or huge text | `/DA` size 0 vs fixed | Set a fixed size, same for the column |
| Wrong font in one field | Field `/DA` overrides document `/DA` | Reset field DA in Acrobat Appearance tab |
| Squares instead of glyphs | Font lacks glyphs or was subset | Embed full TTF, `subset: false` |
| Check mark missing | `/MK /CA` refers to ZaDb but `/DR` lacks it | Add ZapfDingbats to `/DR` |

> **Interview note:** "What does `/Helv 0 Tf 0 g` mean?" is a classic. Answer it operator by operator: font resource Helv, size 0 (auto), then `0 g` sets the fill colour to black in the DeviceGray space.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, PDFName, rgb } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
const form = pdfDoc.getForm();

const a = form.createTextField('name.helv'); a.setText('Ali Raza — Helvetica'.replace('—', '-')); a.setFontSize(11);
a.addToPage(page, { x: 72, y: 700, width: 250, height: 24 });
const b = form.createTextField('name.times'); b.setText('Ali Raza - Times'); b.setFontSize(11);
b.addToPage(page, { x: 72, y: 660, width: 250, height: 24, textColor: rgb(0, 0, 0.6) });
b.updateAppearances(times);

// Inspect the DA strings and the DR font list that pdf-lib wrote
console.log('DA a:', a.acroField.dict.get(PDFName.of('DA'))?.decodeText());
console.log('DA b:', b.acroField.dict.get(PDFName.of('DA'))?.decodeText());
const bytes = await pdfDoc.save();
const dr = form.acroForm.dict.lookup(PDFName.of('DR')).lookup(PDFName.of('Font'));
console.log('DR fonts:', dr.keys().map(k => k.decodeText()));
download(new Blob([bytes], { type: 'application/pdf' }), 'appearances.pdf');
```

### Quiz

1. What does `/DA (/Helv 0 Tf 0 g)` specify?
- [x] Helvetica, auto size, black text
- [ ] Helvetica, 0 pt, invisible text
- [ ] Any font, 0 pt, gray
> `Tf` size 0 means auto-fit; `0 g` is black in DeviceGray.

2. `/NeedAppearances true` is best described as:
- [ ] The standard way to store field values
- [x] A request for the viewer to rebuild appearances on open
- [ ] A security flag
> It is honoured by Acrobat but not reliably by Chrome or Preview.

3. Why should a font used by form fields not be subset?
- [ ] Subsetting is not allowed in PDF 1.7
- [x] The viewer needs glyphs for whatever the user may type
- [ ] It makes the file larger
> A subset only has glyphs for text present at embed time; new input would show as boxes.

### Exercises

1. **Set DA manually** — Write pdf-lib code that sets a field's `/DA` to Courier 9 pt, 50% gray.
<details><summary>Solution</summary>

```js
const { PDFString } = PDFLib;
const cour = await pdfDoc.embedFont(StandardFonts.Courier);
const f = form.getTextField('name.helv');
f.acroField.dict.set(PDFName.of('DA'), PDFString.of('/Cour 9 Tf 0.5 g'));
f.updateAppearances(cour);
```

</details>

2. **Audit DA sizes** — Print every text field whose DA uses auto size (`0 Tf`).
<details><summary>Solution</summary>

```js
form.getFields().forEach(f => {
  const da = f.acroField.dict.get(PDFName.of('DA'))?.decodeText() || '';
  if (/\s0 Tf/.test(da)) console.log('auto-size:', f.getName(), da);
});
```

</details>

### Interview Questions

**Q: Explain the relationship between `/V`, `/AP` and `/DA`.**
`/V` is the data, `/AP` is the cached drawing of that data, and `/DA` is the recipe (font, size, colour) a viewer uses to redraw `/AP` when the value changes. Viewers display `/AP` and only rebuild it on edit or when `/NeedAppearances` is set. So a tool that changes `/V` without touching `/AP` produces a file whose data and picture disagree, which is exactly the "blank in Chrome" bug. My rule is that whatever writes `/V` must also write `/AP`, and `/DA` must reference a font present in `/DR`.

**Q: How do you get a brand font, or Urdu text, into form fields?**
Embed the full TrueType font with fontkit in pdf-lib (or let PyMuPDF embed it), add it to the AcroForm `/DR` under a resource name, reference that name in every field's `/DA`, and regenerate appearances. I avoid subsetting because the user may type any glyph. I also test in Chrome, since PDFium is strict about `/DR`, and I keep a Helvetica fallback for fields that only hold ASCII, to limit file size on long forms.

**Q: A field shows correctly in Acrobat but tiny in Chrome. Why?**
Almost always auto-size: `/DA` has `0 Tf`, and the two engines compute the auto size differently, especially for multiline or narrow fields. Acrobat also honours a minimum size that PDFium does not. The fix is a fixed size in `/DA` for the whole column and regenerating appearances. I set fixed sizes by default and reserve auto-size for isolated fields where overflow is the bigger risk.

## Flattening & security

Once a form is filled, the client often needs a copy that cannot be changed: a signed contract, an archived application, a print master. **Flattening** converts fields into ordinary page content. **Security** restricts what a viewer may do, using PDF encryption and permission flags. Both are one-way decisions that you must explain to clients before doing them.

### What flattening does

Flattening draws each widget's appearance stream into the page content and deletes the field. The result has no `/AcroForm`, cannot be filled or exported, and looks identical to the filled form in every viewer, because the page now contains the same drawing the widget used.

```js
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.load(filledBytes);
pdfDoc.getForm().flatten();             // all fields → page content
const flat = await pdfDoc.save();
```

Flatten a subset by removing what you want to keep first, or by flattening individual fields: `form.flatten({ updateFieldAppearances: true })` accepts no field list, but `form.removeField(f)` before flattening keeps a field editable if you re-add it afterwards, which is rarely worth the effort. In PyMuPDF, `doc.bake()` (1.23.8+) flattens annotations and widgets; `doc.bake(annots=False, widgets=True)` keeps comments. pdftk uses `... fill_form data.fdf output out.pdf flatten`. In Acrobat: Print Production → Preflight → PDF fixups → **Flatten annotations and form fields**, or the simpler route of Print → Adobe PDF, which also flattens.

### When to flatten and when not to

| Deliverable | Flatten? | Reason |
|---|---|---|
| Blank template for clients | No | Must stay fillable |
| Signed application for archive | Yes | Evidence must not change |
| Print master for a handbook's tear-off sheet | Yes | Print shops want static art |
| Draft returned for corrections | No | Client edits again |
| Data extraction later | No, or keep an unflattened copy | Flattened fields cannot be read as fields |

> **Warning:** Flattening also flattens signature fields, which invalidates digital signatures. Flatten *before* signing, or never.

### Restricting editing

PDF permissions live in the encryption dictionary. An **owner password** encrypts the file with a permission set; a **user password** is required to open it. pdf-lib cannot encrypt, so use qpdf, pikepdf or Acrobat.

```bash
# qpdf: allow form filling only, AES-256, no open password
qpdf --encrypt "" "OwnerSecret" 256 --modify=form --extract=n -- form.pdf form-locked.pdf
# Verify
qpdf --show-encryption form-locked.pdf
```

```python
import pikepdf
with pikepdf.open("form.pdf") as pdf:
    pdf.save("form-locked.pdf", encryption=pikepdf.Encryption(
        user="", owner="OwnerSecret", R=6,
        allow=pikepdf.Permissions(modify_form=True, modify_other=False, modify_annotation=False, extract=False)))
```

Acrobat: **Protect Using Password → Restrict editing** → Permissions → Changes allowed: **Filling in form fields and signing existing signature fields**. This is the setting clients mean by "lock the layout but let people fill it".

### Honesty about permissions

Permission flags are advisory: any tool that opens the file with the empty user password can ignore them (pdf-lib's `ignoreEncryption` does exactly that). They stop casual editing in Acrobat and Preview, not a determined user. Real integrity comes from a **digital signature** (certificate-based, Acrobat's Certify tool or a signing service), which makes any later change detectable, and from keeping the authoritative copy on your side.

### Read-only fields versus locked documents

Marking a field ReadOnly (`/Ff` bit 1) stops users typing into it but leaves it a field, so it can still be filled by scripts and still exports. Use ReadOnly for calculated totals and pre-filled reference numbers; use encryption when the whole layout must not change; use flattening when nothing may change.

### Removing data before delivery

Before sending a template built on a client's filled sample, clear values and remove JavaScript and metadata you do not want to leak: `form.getFields().forEach(f => f.constructor.name === 'PDFTextField' && f.setText(''))`, `pdfDoc.setAuthor('')`, and check attachments and hidden layers. qpdf's `--remove-page-labels` and `--empty` are not needed; a fresh `save()` from pdf-lib already drops unreferenced objects.

### Try It Yourself

```js
const { PDFDocument, StandardFonts } = PDFLib;
// Build → fill → keep one fillable copy, one flattened copy.
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();
page.drawText('Applicant:', { x: 54, y: 706, size: 10, font });
const name = form.createTextField('applicant.name'); name.setText('Ali Raza'); name.setFontSize(10);
name.addToPage(page, { x: 186, y: 700, width: 300, height: 22 });
const ok = form.createCheckBox('agree.terms'); ok.check(); ok.addToPage(page, { x: 186, y: 670, width: 14, height: 14 });
const ref = form.createTextField('file.ref'); ref.setText('TX-2026-00417'); ref.enableReadOnly();
ref.addToPage(page, { x: 186, y: 640, width: 150, height: 22 });

const fillable = await pdfDoc.save();
const copy = await PDFDocument.load(fillable);
copy.getForm().flatten();
const flat = await copy.save();
console.log('fields before:', form.getFields().length, '| after flatten:', copy.getForm().getFields().length);
console.log('bytes fillable:', fillable.length, '| flattened:', flat.length);
download(new Blob([flat], { type: 'application/pdf' }), 'application-flattened.pdf');
```

### Quiz

1. What does flattening do to a form?
- [ ] Removes the page content
- [x] Draws the field appearances into the page and deletes the fields
- [ ] Encrypts the fields
> After flattening there is no `/AcroForm`; the values are just page graphics.

2. Which permission setting matches "lock the layout but let people fill it"?
- [x] Changes allowed: filling in form fields and signing
- [ ] No changes allowed
- [ ] Commenting only
> Owner-password permissions can allow form filling while forbidding other edits.

3. Why is a permission-restricted PDF not truly secure?
- [ ] Encryption is weak
- [x] Tools opening with the empty user password can ignore the flags
- [ ] Permissions expire
> Permissions are advisory; digital signatures make tampering detectable instead.

### Exercises

1. **Flatten only after signing check** — Write a guard that refuses to flatten if any field is a signature.
<details><summary>Solution</summary>

```js
const hasSig = form.getFields().some(f => f.constructor.name === 'PDFSignature');
if (hasSig) console.warn('Signature field present; flatten before signing or not at all');
else form.flatten();
```

</details>

2. **qpdf command** — Write a qpdf command that requires the password `open123` to open and allows printing but no changes.
<details><summary>Solution</summary>

```bash
qpdf --encrypt "open123" "OwnerSecret" 256 --modify=none --print=full -- in.pdf out.pdf
```

</details>

### Interview Questions

**Q: A client asks for a "locked" version of a filled application. What do you deliver?**
I ask what "locked" must achieve. For an archive copy nobody edits, I flatten it, which removes the fields, and I keep the unflattened original for data extraction. For a template that people fill but must not restructure, I apply owner-password permissions allowing only form filling and signing, using qpdf or Acrobat, and I explain that these flags deter casual edits but are not tamper-proof. When integrity matters legally, I recommend a certificate-based signature so any change is detectable.

**Q: What are the differences between ReadOnly fields, permission restrictions and flattening?**
ReadOnly is a per-field flag: the user cannot type, but the field still exists, exports, and can be set by scripts, ideal for totals and reference numbers. Permission restrictions are document-level encryption settings that tell compliant viewers what to allow, and they can be bypassed by tools that ignore them. Flattening is irreversible: fields become page drawings, there is nothing left to fill or extract. I choose by asking whether the data must remain machine-readable and whether anyone must still edit anything.

**Q: Why does flattening after signing break the signature?**
A digital signature covers a byte range of the file; flattening rewrites the page content and removes the signature field's widget, changing those bytes, so validation fails or the signature disappears entirely. The correct order is fill, flatten everything except the signature field if required, then sign; and once signed, never modify the file, only add incremental updates such as a second signature.

# LEVEL: Expert

## XFA vs AcroForm & compatibility (Chrome, Preview, mobile)

Every few months a client sends a "fillable PDF that only works in Adobe" and asks why their customers see a page saying *Please wait… If this message is not eventually replaced by the proper contents of the document, your PDF viewer may not be able to display this type of document.* That page is the signature of an **XFA form**, and knowing the difference between XFA and AcroForm is the difference between a quick fix and a rebuild.

### What XFA is

XFA (XML Forms Architecture) is Adobe's XML-based form technology from LiveCycle Designer (now AEM Forms Designer). The form's layout, fields, scripts and data are an XML package stored in `/AcroForm /XFA`, and the PDF pages are either a real rendering (**static XFA**) or a placeholder (**dynamic XFA**) that only Adobe products can lay out at runtime.

```text
/AcroForm << /XFA [ (preamble) 10 0 R (config) 11 0 R (template) 12 0 R (datasets) 13 0 R ... ] >>
```

ISO 32000-2 (PDF 2.0, 2017) deprecated XFA. It survives in government and banking forms built years ago.

### Support matrix

| Viewer | AcroForm | Static XFA | Dynamic XFA | Form JavaScript |
|---|---|---|---|---|
| Acrobat / Reader (desktop) | Full | Full | Full | Full |
| Acrobat Reader mobile | Fill and save | Limited | No | Little |
| Chrome / Edge (PDFium) | Full | Partial (falls back to AcroForm layer) | No | Most `AF*` and field API |
| Firefox (pdf.js, since v93) | Full | Partial renderer | Partial | Sandboxed subset |
| macOS Preview | Fill (appearance quirks) | Page image only | Placeholder page | None |
| iOS Files / Mail | Fill (basic) | Image | Placeholder | None |
| pdf-lib / PyMuPDF / pdftk | Full | AcroForm layer only | Nothing to read | n/a |

The practical rule: **if the audience is not guaranteed to use Adobe desktop products, the form must be AcroForm.**

### Detecting XFA programmatically

```js
const { PDFDocument, PDFName } = PDFLib;
async function formKind(bytes) {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const acro = doc.catalog.lookup(PDFName.of('AcroForm'));
  if (!acro) return 'no form';
  return acro.has(PDFName.of('XFA')) ? 'XFA (check if static or dynamic)' : 'AcroForm';
}
```

In Python, `pymupdf.open(p).is_form_pdf` is true for AcroForms, and `doc.xref_get_key(doc.pdf_catalog(), "AcroForm/XFA")` reveals an XFA entry; `pikepdf` shows it as `pdf.Root.AcroForm.XFA`.

### Converting XFA to AcroForm

There is no clean converter. The options, in order of quality:

1. **Rebuild** as an AcroForm using the XFA form's printed layout as the background (print to PDF from Acrobat, or export the static pages), then place fields with pdf-lib or Acrobat. Field names come from the XFA `template` XML (`<field name="ApplicantName">`), so the data dictionary survives.
2. **Static XFA with an AcroForm shadow**: some LiveCycle exports include a full AcroForm layer; deleting the `/XFA` key (`del pdf.Root.AcroForm.XFA` in pikepdf) makes Chrome and Preview use it. Test every field; calculations written in FormCalc are lost.
3. **Flatten** to a static PDF if only a print copy is needed.

### AcroForm compatibility issues that are not XFA

Even a well-built AcroForm hits viewer differences:

- **Preview** saves values but sometimes writes appearance streams that Acrobat ignores or shows differently; and it does not run scripts, so calculated fields stay empty. Regenerate appearances with pdf-lib on receipt.
- **Chrome** ignores `/NeedAppearances` in some versions and is strict about `/DR` fonts. Chrome also cannot submit forms or send email.
- **Mobile viewers** frequently support text and checkboxes but not dropdown editing or radio unison. iOS Mail's quick-look is read-only.
- **Rich text**, **comb with auto-size** and **date pickers** (Acrobat's Date field is a text field plus a picker widget) render inconsistently. Keep fields plain.
- **Fonts**: only the standard 14 and embedded fonts render everywhere; a `/DA` referencing Arial without embedding is a lottery.

### A compatibility test plan

```text
1. Acrobat Reader (Windows)  fill → save → reopen → export XFDF
2. Chrome                    fill → print to PDF → check values visible
3. Edge                      same as Chrome (PDFium) + check downloads keep data
4. macOS Preview             fill → save → open in Acrobat Reader → values visible?
5. iOS Files / Android Drive fill text + checkbox → save → open in Reader
6. pdf-lib script            load each saved file → getText()/isChecked() equals typed input
```

Record results in the delivery notes. A client who knows "totals calculate in Adobe Reader and Chrome" does not file a ticket.

> **Interview note:** Interviewers who work with government forms will ask why a form "only opens in Adobe". Name XFA, explain static versus dynamic, cite the deprecation in PDF 2.0, and describe the rebuild path with preserved field names.

### Try It Yourself

```js
const { PDFDocument, PDFName } = PDFLib;
// Build an AcroForm, then inspect the catalog the way a compatibility checker would.
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();
form.createTextField('applicant.name').addToPage(page, { x: 72, y: 700, width: 300, height: 22 });
const bytes = await pdfDoc.save();

const doc = await PDFDocument.load(bytes);
const acro = doc.catalog.lookup(PDFName.of('AcroForm'));
const report = {
  hasAcroForm: !!acro,
  hasXFA: !!acro && acro.has(PDFName.of('XFA')),
  needAppearances: !!acro && acro.has(PDFName.of('NeedAppearances')),
  fields: doc.getForm().getFields().length,
  drFonts: acro && acro.lookup(PDFName.of('DR')) ? acro.lookup(PDFName.of('DR')).lookup(PDFName.of('Font')).keys().map(k => k.decodeText()) : [],
};
console.log(report);
console.log(report.hasXFA ? 'XFA: expect failures outside Adobe' : 'AcroForm: universal viewer support');
download(new Blob([bytes], { type: 'application/pdf' }), 'compat-check.pdf');
```

### Quiz

1. What does the "Please wait… your PDF viewer may not be able to display this type of document" page indicate?
- [ ] A corrupt file
- [x] A dynamic XFA form opened in a non-Adobe viewer
- [ ] Missing fonts
> Dynamic XFA has only a placeholder page; the real form is XML that only Adobe products render.

2. Which standard deprecated XFA?
- [ ] PDF/A-1
- [x] ISO 32000-2 (PDF 2.0)
- [ ] PDF/UA
> PDF 2.0 removed XFA from the standard, which is why new forms should be AcroForm.

3. What is the most reliable way to make an XFA form work in Chrome?
- [ ] Set `/NeedAppearances`
- [x] Rebuild it as an AcroForm, reusing the field names
- [ ] Rename the file to `.pdf`
> There is no clean converter; a rebuild on the printed layout with the same names preserves the data contract.

### Exercises

1. **Detect XFA in Python** — Write pikepdf code that prints whether a file has XFA and, if static, removes it.
<details><summary>Solution</summary>

```python
import pikepdf
with pikepdf.open("gov-form.pdf") as pdf:
    acro = pdf.Root.get("/AcroForm")
    has_xfa = acro is not None and "/XFA" in acro
    print("XFA:", has_xfa)
    if has_xfa and "/Fields" in acro and len(acro.Fields) > 0:   # AcroForm shadow present
        del acro["/XFA"]
        pdf.save("gov-form-acroform.pdf")
```

</details>

2. **Delivery note** — Draft the compatibility paragraph you would include with a delivered form containing calculations.
<details><summary>Solution</summary>

```text
This form is an AcroForm and can be filled in Adobe Acrobat Reader (recommended), Chrome, Edge,
Firefox, macOS Preview and most mobile viewers. Automatic totals and date validation run in
Adobe Reader, Chrome and Edge only; in other viewers please enter totals manually. Save with
File → Save (not Print to PDF) to keep your entries.
```

</details>

### Interview Questions

**Q: What is the difference between static and dynamic XFA, and how does it affect support?**
Both store the form as XML under `/AcroForm /XFA`. A static XFA form has a fixed layout and the PDF also contains real page content, so non-Adobe viewers can at least display it and sometimes fill an accompanying AcroForm layer. A dynamic XFA form lays itself out at runtime, growing tables and sections from data, so the PDF contains only a placeholder page; Chrome, Preview, pdf.js and every library see nothing useful. Since PDF 2.0 deprecated XFA, my recommendation is always to rebuild as AcroForm unless the client's users are all on Adobe desktop.

**Q: How do you approach a client's request to make a LiveCycle form "work on phones"?**
I first check whether the XFA is static with an AcroForm shadow; if so, removing the `/XFA` key and testing may be enough. Otherwise I export the printed layout as a static PDF, extract the field names from the XFA template XML, and rebuild the fields with pdf-lib or Acrobat under the same names so their data integration keeps working. FormCalc and XFA JavaScript are rewritten as Acrobat JavaScript where they matter and documented as Adobe-only. Then I run the six-viewer test plan and deliver a compatibility note.

**Q: Why do forms filled in macOS Preview cause trouble, and how do you handle returned files?**
Preview writes values but its appearance streams and some structures differ from Acrobat's, so a Preview-saved form can appear blank or stale in Acrobat, and Preview never runs calculations. On receipt I load every returned PDF with pdf-lib or PyMuPDF, read the values as data, regenerate appearances, and, if the form has totals, recompute them in the ingest step. That makes my pipeline viewer-agnostic instead of asking every client to install Acrobat.

## DOCX forms: legacy form fields vs content controls & protection

Not every fillable form should be a PDF. HR departments, law firms and BPO teams often need a Word form that staff complete and then convert to PDF, or that a mail-merge fills. Word offers two field systems, **legacy form fields** and **content controls**, plus document protection that turns a normal document into a form.

### Enabling the Developer tab

File → Options → Customize Ribbon → tick **Developer**. On Mac: Word → Preferences → Ribbon & Toolbar → Developer. Everything in this chapter lives on that tab.

### Legacy form fields

Developer → **Legacy Tools** (the toolbox icon) → Legacy Forms: Text Form Field, Check Box Form Field, Drop-Down Form Field. They are implemented as Word fields (`FORMTEXT`, `FORMCHECKBOX`, `FORMDROPDOWN`) with a `w:ffData` block in the XML.

```xml
<w:fldChar w:fldCharType="begin">
  <w:ffData>
    <w:name w:val="ApplicantName"/>
    <w:enabled/>
    <w:calcOnExit w:val="0"/>
    <w:textInput><w:maxLength w:val="60"/><w:format w:val="TITLE CASE"/></w:textInput>
  </w:ffData>
</w:fldChar>
<w:instrText xml:space="preserve"> FORMTEXT </w:instrText>
```

Double-click a legacy field for its Options: bookmark name, type (Regular text, Number, Date, Current date, Calculation), max length, format, default text, and **Fill-in enabled**. Legacy fields work only when the document is protected for *Filling in forms*; unprotected, they are just gray text. They support the `Calculate on exit` option and simple `=SUM(ABOVE)`-style calculations, and macros on entry/exit.

### Content controls

Developer → Controls group: Rich Text, Plain Text, Picture, Building Block Gallery, Check Box, Combo Box, Drop-Down List, Date Picker, Repeating Section. They are `w:sdt` elements in the XML:

```xml
<w:sdt>
  <w:sdtPr>
    <w:alias w:val="Applicant name"/>
    <w:tag w:val="applicant.name"/>
    <w:id w:val="184213"/>
    <w:lock w:val="sdtLocked"/>          <!-- cannot be deleted -->
    <w:showingPlcHdr/>
    <w:text/>                            <!-- plain-text control -->
  </w:sdtPr>
  <w:sdtContent><w:p><w:r><w:t>Click here to enter text.</w:t></w:r></w:p></w:sdtContent>
</w:sdt>
```

Properties (Developer → Properties): **Title** (shown on the control's tab), **Tag** (your machine-readable name, use the same dotted convention as PDF), **Content control cannot be deleted**, **Contents cannot be edited**, style, and for lists the display/value pairs. Content controls can bind to a custom XML part (`w:dataBinding`), which is how document-assembly systems and Power Automate fill Word templates.

### Which one to use

| Need | Legacy fields | Content controls |
|---|---|---|
| Works without protection | No | Yes |
| Rich text / pictures / repeating rows | No | Yes |
| Date picker | No (text with date format) | Yes |
| Calculations in Word | Yes (`Calculate on exit`) | No (use fields or VBA) |
| Fill from python-docx / docx-js | Fiddly (edit `w:ffData` XML) | Easier (`w:sdt` + tag), docx-js has `CheckBox`; python-docx via XML |
| LibreOffice compatibility | Good | Basic support since LO 7.4, improving |
| Mac Word | Good | Good in Word 2016+ |
| Tab between fields | Yes when protected | Yes when protected, otherwise click |

Rule of thumb: content controls for anything new, legacy fields only when the client's macros or LibreOffice users depend on them.

### Protecting the document

Developer → **Restrict Editing** → 2. Editing restrictions → *Allow only this type of editing in the document* → **Filling in forms** → 3. **Yes, Start Enforcing Protection** → optional password. Word protects section by section (the **Select sections…** link), so a cover letter section can stay editable while the form section is locked. With content controls you can instead set each control to *Contents cannot be edited* for labels and use *No changes (Read only)* with **Exceptions** for the fillable regions.

Remember the password is not encryption: `w:documentProtection` in `settings.xml` stores a hash that any XML editor can delete. It prevents accidents, not tampering.

### Filling DOCX forms programmatically

```python
from docx import Document
from docx.oxml.ns import qn

doc = Document("intake.docx")
data = {"applicant.name": "Ali Raza", "property.state": "TX"}
for sdt in doc.element.body.iter(qn("w:sdt")):
    tag = sdt.find(qn("w:sdtPr")).find(qn("w:tag"))
    if tag is None or tag.get(qn("w:val")) not in data:
        continue
    content = sdt.find(qn("w:sdtContent"))
    runs = list(content.iter(qn("w:t")))
    runs[0].text = data[tag.get(qn("w:val"))]
    for r in runs[1:]:
        r.text = ""
    pr = sdt.find(qn("w:sdtPr")); ph = pr.find(qn("w:showingPlcHdr"))
    if ph is not None: pr.remove(ph)        # no longer showing placeholder
doc.save("intake-filled.docx")
```

The loop finds every content control by tag, replaces its text, and clears the placeholder flag. Checkbox controls store state in `w14:checked w14:val="1"` plus the glyph `☒`/`☐` in the run; update both.

### Converting to PDF and keeping fillability

Word's Save as PDF does **not** create AcroForm fields; content controls become static text. If the client needs a fillable PDF from a Word form, export the static PDF and overlay AcroForm fields using the content-control tags as field names, or maintain both files from one build sheet.

> **Tip:** Set the content control **Tag** to the exact PDF field name (`applicant.name`). One build sheet then drives the Word form, the PDF form and the data import, and QA can diff the tag list against the PDF field list.

### Try It Yourself

```js
// The DOCX runner is not loaded here, so this block builds the XML for a content control
// the way docx-js or python-docx would, so you can see exactly what ends up in document.xml.
function sdt(tag, title, placeholder, type = 'text') {
  const kind = type === 'checkbox' ? '<w14:checkbox><w14:checked w14:val="0"/></w14:checkbox>' : '<w:text/>';
  const content = type === 'checkbox' ? '☐' : placeholder;
  return `<w:sdt><w:sdtPr><w:alias w:val="${title}"/><w:tag w:val="${tag}"/><w:lock w:val="sdtLocked"/>${type === 'checkbox' ? '' : '<w:showingPlcHdr/>'}${kind}</w:sdtPr>` +
         `<w:sdtContent><w:r><w:t>${content}</w:t></w:r></w:sdtContent></w:sdt>`;
}
const controls = [
  sdt('applicant.name', 'Applicant name', 'Enter full name'),
  sdt('property.state', 'State', 'TX'),
  sdt('agree.terms', 'I agree', '', 'checkbox'),
];
controls.forEach(x => console.log(x, '\n'));
console.log('tags:', controls.map(x => x.match(/w:tag w:val="([^"]+)"/)[1]));
```

### Quiz

1. Legacy form fields only accept input when…
- [ ] The Developer tab is visible
- [x] The document is protected for "Filling in forms"
- [ ] A macro is enabled
> Without forms protection, legacy fields are just shaded text.

2. Which content-control property should carry your machine-readable field name?
- [ ] Title
- [x] Tag
- [ ] Style
> Title is the visible label; Tag is what scripts and data bindings use.

3. What happens to content controls when Word saves as PDF?
- [ ] They become AcroForm text fields
- [x] They become static text
- [ ] They are removed
> Word never emits AcroForm fields; overlay them afterwards if a fillable PDF is needed.

### Exercises

1. **Section protection** — Describe how to protect only the form section of a document that also has an editable cover letter.
<details><summary>Solution</summary>

```text
Insert a section break (Layout → Breaks → Continuous) between letter and form.
Developer → Restrict Editing → Allow only: Filling in forms → click "Select sections…"
→ tick only Section 2 → Yes, Start Enforcing Protection → set password.
```

</details>

2. **Tag audit** — Write Python that lists every content-control tag in a DOCX and flags duplicates.
<details><summary>Solution</summary>

```python
from docx import Document
from docx.oxml.ns import qn
from collections import Counter
doc = Document("intake.docx")
tags = [t.get(qn("w:val")) for t in doc.element.body.iter(qn("w:tag"))]
print(tags)
print("duplicates:", [t for t, n in Counter(tags).items() if n > 1])
```

</details>

### Interview Questions

**Q: Legacy form fields or content controls for a new HR onboarding form?**
Content controls. They work without protection, support date pickers, repeating sections and pictures, expose a Tag that scripts and data bindings can target, and render well in Word 2016+ on both platforms. Legacy fields still win in two situations: the client has VBA that reads `ActiveDocument.FormFields`, or the form must be filled in older LibreOffice, whose content-control support only matured around 7.4. Whichever I choose, I keep the tag or bookmark names identical to the PDF field names so one build sheet drives both deliverables.

**Q: How does Word document protection work and what does it actually protect against?**
Restrict Editing writes a `w:documentProtection` element with an edit mode (forms, comments, tracked changes, read-only) and an optional password hash into `settings.xml`, and it can apply per section. Word then only allows input inside form fields or content controls. It protects against accidental edits by staff and keeps Tab moving between fields, but it is not security: anyone can unzip the DOCX and delete the element. For confidential or tamper-evident forms I convert to PDF and use encryption or a digital signature.

**Q: A client wants one form as both a Word file and a fillable PDF. How do you keep them consistent?**
I maintain a single build sheet with names, labels, types and options, and I generate both artifacts from it: content controls tagged with the field names in the DOCX (docx-js or python-docx), and pdf-lib fields with the same names overlaid on the PDF exported from that DOCX. QA scripts extract the tag list from the DOCX and the field list from the PDF and diff them, so a question added to one without the other fails the check.

## Large-form QA (168 fields: naming, export, data round-trip via FDF/XFDF)

The forms that earn the best reviews are the large ones: a 168-field mortgage or KYC package across eight pages. They are also where errors hide. This chapter is the QA discipline that lets you deliver a form that size with confidence: inventory, rule checks, data round-trip, visual checks, and a sign-off report.

### Step 1: Inventory

Dump every field into a table. Do it with two tools so a bug in one is caught by the other.

```bash
pdftk loan-app.pdf dump_data_fields_utf8 > inventory.txt
grep -c '^FieldName:' inventory.txt        # expect 168
```

```python
import pymupdf, csv
doc = pymupdf.open("loan-app.pdf")
with open("inventory.csv", "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["page", "name", "type", "rect", "flags", "max_len", "options", "on_state"])
    for pno, page in enumerate(doc, 1):
        for wd in page.widgets():
            w.writerow([pno, wd.field_name, wd.field_type_string, [round(v) for v in wd.rect],
                        wd.field_flags, wd.text_maxlen, wd.choice_values, wd.on_state() if wd.field_type in (2, 5) else ""])
```

### Step 2: Rule checks

Turn your naming and design rules into assertions. Every failure lists the field.

```python
import re, collections
rows = list(csv.DictReader(open("inventory.csv")))
name_ok = re.compile(r"^[a-z][a-z0-9]*(\.[a-z0-9]+)*$")
problems = []
counts = collections.Counter(r["name"] for r in rows)
mirrored = {"applicant.name", "file.ref"}                   # allowed duplicates
for r in rows:
    n = r["name"]
    if not name_ok.match(n): problems.append(("bad name", n))
    if counts[n] > 1 and n not in mirrored: problems.append(("unexpected duplicate", n))
    if r["type"] == "CheckBox" and r["on_state"] not in ("Yes",) : problems.append(("on-state", n, r["on_state"]))
    if r["type"] == "Text" and int(r["rect"].strip("[]").split(",")[3]) - int(r["rect"].strip("[]").split(",")[1]) < 16:
        problems.append(("too short", n))
for p in problems: print(p)
print(len(problems), "problems")
```

Typical rules: names match the regex; duplicates only in the allow-list; every radio group has 2+ options and no `Choice1`; checkboxes use a consistent on-state; text heights ≥ 16 pt; every field has a tooltip; comb fields have MaxLen; required fields listed in the spec are flagged Required.

### Step 3: Data round-trip with XFDF

Fill every field with a unique, recognisable marker, save, and read it back through a different path. Use XFDF so the test file is human-readable and diffable.

```python
import xml.etree.ElementTree as ET
NS = "http://ns.adobe.com/xfdf/"
xfdf = ET.Element("{%s}xfdf" % NS, {"{http://www.w3.org/XML/1998/namespace}space": "preserve"})
fields = ET.SubElement(xfdf, "{%s}fields" % NS)
markers = {}
for i, r in enumerate(rows):
    if r["type"] == "Text":
        markers[r["name"]] = f"F{i:03d}"
        f = ET.SubElement(fields, "{%s}field" % NS, name=r["name"]); ET.SubElement(f, "{%s}value" % NS).text = markers[r["name"]]
ET.ElementTree(xfdf).write("markers.xfdf", encoding="utf-8", xml_declaration=True)
```

```bash
pdftk loan-app.pdf fill_form markers.xfdf output filled.pdf need_appearances
pdftk filled.pdf generate_fdf output back.fdf
grep -c 'F[0-9][0-9][0-9]' back.fdf         # expect the number of text fields
```

Then read `filled.pdf` with PyMuPDF and compare against `markers`. Any mismatch is a duplicate name, a hidden field, a ReadOnly field you forgot, or an encoding fault. Repeat for checkboxes (check all, expect all `Yes`) and radios (select the last option of each group).

### Step 4: Visual and behavioural checks

| Check | How | Pass criterion |
|---|---|---|
| Alignment | Render pages with `page.get_pixmap(dpi=72)` and overlay rects | Left edges within 1 pt per column |
| Tab order | Print `/Annots` names per page | Reading order on every page |
| Overflow | Fill text fields with 60 × "W" and render | No clipped glyph outside the rect |
| Calculations | Open in Acrobat, enter 1, 2, 3 | Totals correct, order set |
| Cross-viewer | Reader, Chrome, Edge, Preview, iOS | Values persist after save |
| Print | Print to PDF from Chrome | Field values visible |

### Step 5: Sign-off report

Deliver a short QA report with the inventory count, the rule-check output (zero problems), the round-trip result, viewers tested, and known limitations (scripts in Adobe/Chrome only). Clients who receive a report rarely come back with "does it work on a Mac?".

```text
Loan Application v3 — QA summary
Fields: 168 (text 121, checkbox 29, radio groups 9, dropdowns 8, signature 1)
Naming rules: 0 violations   Duplicates: 2 (mirrored, by design)
XFDF round-trip: 121/121 text, 29/29 checkbox, 9/9 radio OK
Tab order: rows, verified pages 1–8
Viewers: Acrobat Reader 2026, Chrome 140, Edge, Preview 15, iOS Files
Known limits: totals calculate in Adobe/Chrome/Edge only
```

> **Warning:** Do the round-trip on the *final* file. A late rename in Acrobat, a duplicated page, or a re-export from the background silently breaks the data contract, and the client's integration will be the first to notice.

### Try It Yourself

```js
const { PDFDocument } = PDFLib;
// Generate a 40-field mock form, then run inventory + rule checks + round-trip in one go.
const pdfDoc = await PDFDocument.create();
const form = pdfDoc.getForm();
let page = pdfDoc.addPage([612, 792]);
const names = [];
for (let i = 0; i < 40; i++) {
  if (i % 20 === 0 && i) page = pdfDoc.addPage([612, 792]);
  const n = i === 7 ? 'applicant.name' : `section${Math.floor(i / 10)}.q${String(i).padStart(2, '0')}`; // i=7 duplicates name below
  names.push(n);
}
names[3] = 'applicant.name';                        // intentional mirrored duplicate
names[15] = 'Bad Name 15';                          // rule violation
const created = new Map();
names.forEach((n, i) => {
  const p = pdfDoc.getPages()[Math.floor(i / 20)];
  const y = 720 - (i % 20) * 30;
  if (created.has(n)) created.get(n).addToPage(p, { x: 72, y, width: 200, height: 20 });
  else { const f = form.createTextField(n); f.addToPage(p, { x: 72, y, width: 200, height: 20 }); created.set(n, f); }
});

// Inventory + rules
const rule = /^[a-z][a-z0-9]*(\.[a-z0-9]+)*$/;
const problems = [];
form.getFields().forEach(f => {
  const n = f.getName();
  if (!rule.test(n)) problems.push(['bad name', n]);
  const widgets = f.acroField.getWidgets().length;
  if (widgets > 1 && n !== 'applicant.name') problems.push(['unexpected mirror', n]);
});
console.log('fields:', form.getFields().length, 'problems:', problems);

// Round trip
const markers = {};
form.getFields().forEach((f, i) => { markers[f.getName()] = 'F' + String(i).padStart(3, '0'); f.setText(markers[f.getName()]); });
const reloaded = await PDFDocument.load(await pdfDoc.save());
const back = Object.fromEntries(reloaded.getForm().getFields().map(f => [f.getName(), f.getText()]));
const bad = Object.keys(markers).filter(k => back[k] !== markers[k]);
console.log(bad.length ? 'ROUND TRIP FAILED ' + bad : 'round trip OK for ' + Object.keys(markers).length + ' fields');
download(new Blob([await reloaded.save()], { type: 'application/pdf' }), 'qa-mock.pdf');
```

### Quiz

1. Why fill every field with a unique marker instead of the same word?
- [ ] It is faster
- [x] Duplicate names and cross-wired fields show up as mismatches
- [ ] pdftk requires unique values
> Identical values would make a duplicated name invisible to the test.

2. Which two artifacts should the QA diff to prove the data contract?
- [x] The build sheet and the field inventory
- [ ] The PDF and its thumbnail
- [ ] The FDF and XFDF specs
> The build sheet is what the client's integration expects; the inventory is what the file actually has.

3. When must the round-trip be run?
- [ ] Only after auto-detect
- [x] On the final delivered file, after every change
- [ ] Once per project
> Late edits in Acrobat routinely rename or duplicate fields.

### Exercises

1. **Overflow test** — Write pdf-lib code that fills every text field with 60 W characters and reports fields whose width is under 150 pt (likely to clip).
<details><summary>Solution</summary>

```js
form.getFields().forEach(f => {
  if (f.constructor.name !== 'PDFTextField') return;
  f.setText('W'.repeat(60));
  const r = f.acroField.getWidgets()[0].getRectangle();
  if (r.width < 150) console.log('likely clip:', f.getName(), r.width);
});
```

</details>

2. **Checkbox round-trip** — In Python with PyMuPDF, check every checkbox, save, reopen and report any that are not on.
<details><summary>Solution</summary>

```python
import pymupdf
doc = pymupdf.open("loan-app.pdf")
for page in doc:
    for w in page.widgets():
        if w.field_type == pymupdf.PDF_WIDGET_TYPE_CHECKBOX:
            w.field_value = w.on_state(); w.update()
doc.save("all-checked.pdf")
chk = pymupdf.open("all-checked.pdf")
bad = [w.field_name for p in chk for w in p.widgets() if w.field_type == pymupdf.PDF_WIDGET_TYPE_CHECKBOX and w.field_value == "Off"]
print("not checked:", bad)
```

</details>

### Interview Questions

**Q: Describe your QA process for a 168-field form.**
Inventory first, with two tools, so I know the exact count and types. Then automated rule checks: names match the convention, duplicates are only the mirrored ones on an allow-list, checkboxes share one on-state, radio groups have real export values, text heights are adequate, and tooltips exist. Then a data round-trip: unique markers via XFDF or pdf-lib, saved, read back with a different library and diffed. Then visual and behavioural checks across Acrobat, Chrome, Edge, Preview and a phone, including tab order and printing. I finish with a one-page QA summary, and I rerun the whole thing on the final file because late edits are where regressions come from.

**Q: What kinds of defects does the round-trip catch that visual inspection misses?**
Cross-wired duplicates, where two boxes that look independent are one field; hidden or off-page widgets that hold values nobody sees; ReadOnly flags left on fields that should be fillable; checkbox on-state mismatches that make FDF fills silently fail; and encoding problems with non-Latin data. Visually, a form with all of these can look perfect. The marker approach makes each defect a concrete mismatch line with a field name, which is what I need to fix it quickly.

**Q: How do you keep QA cheap enough to run on every revision?**
By scripting it: the inventory, rule checks and round-trip are one Python or Node script that runs in a few seconds and exits non-zero on problems, so it can live in CI or a pre-delivery hook. The only manual part is the cross-viewer spot check, which I keep to a fixed six-step list. The build sheet is the single source of truth, so the script compares against it rather than against my memory, and the QA summary is generated from the same run.

## Accessibility & tagging for forms

Government, education and enterprise clients increasingly require forms that work with screen readers, and US Section 508, EU EN 301 549 and the ISO 14289 (PDF/UA) standard all say what that means. For forms, the essentials are: every field has an accessible name, fields sit in a logical reading order inside a tagged structure, required fields are announced, and nothing depends on colour alone.

### The accessible name is the tooltip

Screen readers announce the widget's `/TU` entry (Acrobat's **Tooltip**). Without it, NVDA or JAWS reads "edit" and the user has no idea what to type. Write tooltips as full instructions: "Applicant's full legal name", "Date of birth, format mm/dd/yyyy", "Required: I agree to the terms". Keep them under about 100 characters.

```js
const { PDFDocument, PDFName, PDFString } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();
const f = form.createTextField('applicant.dob');
f.addToPage(page, { x: 186, y: 700, width: 120, height: 22 });
f.acroField.dict.set(PDFName.of('TU'), PDFString.of('Date of birth, format mm/dd/yyyy'));
```

pdf-lib has no high-level tooltip API, so the `/TU` entry is set on the underlying dictionary. PyMuPDF exposes `widget.field_label`; Acrobat sets it on the General tab.

### Tagged structure

A tagged PDF has a `/StructTreeRoot` with a tree of structure elements (`/Document`, `/H1`, `/P`, `/Form`, `/Table`). For forms, each widget must be referenced by a `/Form` structure element through an object reference (`/OBJR`), so the screen reader encounters the field at the right point in the reading order. Acrobat does this for you: **Accessibility → Autotag Document**, then check the Tags pane and fix the order in the Reading Order tool. pdf-lib and PyMuPDF do not create structure trees; when a client requires PDF/UA, the tagging step happens in Acrobat Pro after the fields are placed.

```text
/StructTreeRoot
  /Document
    /H1 "Loan Application"
    /P "1. Applicant"
    /Form  → /OBJR  (widget applicant.name)   /Alt (Applicant full name)
    /Form  → /OBJR  (widget applicant.dob)
```

### Tab order must follow structure

Set each page's `/Tabs /S` (Order Tabs by Structure) so keyboard order equals reading order; Acrobat's accessibility checker flags pages that lack it. The PDF/UA requirement is that tab order is meaningful, and "Structure" is the safest way to satisfy it on tagged forms.

### Labels, required markers and colour

- Visible labels must match the tooltip closely, so sighted users and screen-reader users hear and see the same thing.
- Mark required fields with text ("(required)") or an asterisk explained in a legend, plus the Required flag; never with colour alone.
- Keep field text at least 4.5:1 contrast against the field background; light-gray placeholder text usually fails.
- Radio groups need a group-level label: put the question in each option's tooltip ("Marital status: Married") because PDF has no fieldset.

### Checking

| Tool | What it checks |
|---|---|
| Acrobat Pro: Accessibility → **Accessibility Check** (Full Check) | Tags, tooltips, tab order, language, title |
| PAC 2024 (free, Windows) | PDF/UA conformance, screen-reader preview |
| NVDA + Acrobat Reader | Real user experience: Tab through the form and listen |
| `pdfplumber` / PyMuPDF script | Every widget has `/TU`; every page has `/Tabs /S` |

```python
import pymupdf
doc = pymupdf.open("loan-app.pdf")
missing = [w.field_name for p in doc for w in p.widgets() if not w.field_label]
no_tabs = [i + 1 for i, p in enumerate(doc) if doc.xref_get_key(p.xref, "Tabs")[1] != "/S"]
print("fields without tooltip:", missing)
print("pages without structure tab order:", no_tabs)
```

### Document-level requirements

Set the document title (`pdfDoc.setTitle('Loan Application')`) and make the viewer show it (Acrobat: File → Properties → Initial View → Show: Document Title). Set the language (`pdfDoc.setLanguage('en-US')`); PDF/UA requires it. Add bookmarks for sections on long forms. Provide alt text for the logo, or mark it as an artifact so it is skipped.

> **Interview note:** "What makes a PDF form accessible?" Answer with four items in order: tooltips as accessible names, a tagged structure with `/Form` elements in reading order, structure-based tab order, and visible labels plus required indicators that do not rely on colour. Then name the checker you use.

### Try It Yourself

```js
const { PDFDocument, StandardFonts, PDFName, PDFString } = PDFLib;
const pdfDoc = await PDFDocument.create();
pdfDoc.setTitle('Client Intake Form');
pdfDoc.setLanguage('en-US');
const page = pdfDoc.addPage([612, 792]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const form = pdfDoc.getForm();

const spec = [
  ['applicant.name', 'Full name (required)', "Applicant's full legal name. Required."],
  ['applicant.dob', 'Date of birth', 'Date of birth, format mm/dd/yyyy'],
  ['applicant.email', 'Email', 'Email address used for correspondence'],
];
spec.forEach(([name, label, tooltip], i) => {
  const y = 700 - i * 30;
  page.drawText(label, { x: 54, y: y + 6, size: 10, font });
  const f = form.createTextField(name);
  f.addToPage(page, { x: 200, y, width: 300, height: 22 });
  f.acroField.dict.set(PDFName.of('TU'), PDFString.of(tooltip));
  if (label.includes('required')) f.enableRequired();
});
page.node.set(PDFName.of('Tabs'), PDFName.of('S'));

// Audit: every field has a tooltip, page uses structure tab order, doc has title + language
const missing = form.getFields().filter(f => !f.acroField.dict.has(PDFName.of('TU'))).map(f => f.getName());
console.log({ missingTooltips: missing, tabs: page.node.get(PDFName.of('Tabs')).decodeText(), title: pdfDoc.getTitle() });
console.log('Next step for PDF/UA: Acrobat Pro → Accessibility → Autotag Document → Accessibility Check');
download(new Blob([await pdfDoc.save()], { type: 'application/pdf' }), 'accessible-fields.pdf');
```

### Quiz

1. What does a screen reader announce as the name of a field?
- [ ] The field's `/T` name
- [x] The `/TU` tooltip
- [ ] The nearest printed label
> Without a tooltip the user hears only the field type.

2. Which tab-order setting keeps keyboard order equal to reading order on a tagged form?
- [ ] `/Tabs /R`
- [x] `/Tabs /S`
- [ ] `/Tabs /C`
> Structure order follows the tag tree; Acrobat's checker expects it.

3. Which library builds a full structure tree for PDF/UA forms?
- [ ] pdf-lib
- [ ] PyMuPDF
- [x] None of these; use Acrobat Pro's Autotag and Tags pane
> Tagging remains an Acrobat (or specialised tool) step after fields are placed.

### Exercises

1. **Tooltip audit** — Print every field whose tooltip is missing or shorter than 10 characters.
<details><summary>Solution</summary>

```js
form.getFields().forEach(f => {
  const tu = f.acroField.dict.get(PDFName.of('TU'));
  const text = tu ? tu.decodeText() : '';
  if (text.length < 10) console.log('weak tooltip:', f.getName(), JSON.stringify(text));
});
```

</details>

2. **Radio labels** — Write tooltips for a radio group "Marital status" with options Single, Married, Divorced.
<details><summary>Solution</summary>

```text
Single:   "Marital status: Single"
Married:  "Marital status: Married"
Divorced: "Marital status: Divorced"
(PDF has no fieldset, so each option must repeat the question.)
```

</details>

### Interview Questions

**Q: What are the concrete requirements for an accessible PDF form?**
Every widget needs a `/TU` tooltip that acts as its accessible name and includes format hints and "required" where relevant. The document must be tagged, with `/Form` structure elements referencing each widget in reading order, and each page should use structure tab order so Tab follows the tags. Visible labels must match tooltips, required fields must be indicated by text not colour, contrast must meet 4.5:1, and the document needs a title displayed in the window and a language. I verify with Acrobat's Accessibility Check and PAC, then Tab through it with NVDA.

**Q: You generate forms with pdf-lib. How do you meet a PDF/UA requirement?**
I do everything the library can do at generation time: tooltips, Required flags, `/Tabs /S`, title, language, consistent labels, and fields created in reading order. Then the tagging pass happens in Acrobat Pro: Autotag Document, correct the Tags pane, ensure each `/Form` element wraps the right widget, mark decorative graphics as artifacts, and run the Accessibility Check. I keep the background artwork simple, single column, so Autotag produces the right order the first time and revisions are quick.

**Q: Why are radio groups a special accessibility problem in PDF?**
PDF has no fieldset or legend, so a screen reader announcing a radio widget only hears that widget's tooltip. If the tooltip says "Married", the user does not know the question. The fix is to repeat the question in each option's tooltip ("Marital status: Married") and, in the tag tree, to place the group's label paragraph immediately before the `/Form` elements. I apply the same rule to checkbox grids.

## Forms interview questions

This closing chapter is a mock interview. The questions are the ones hiring managers, agency leads and enterprise clients actually ask a document-production specialist, grouped by theme, with the answer structure a strong candidate uses. Study the *shape* of each answer: definition, trade-off, concrete example from your own work.

### How to answer form questions

1. Name the mechanism (AcroForm, `/AP`, XFA, content control).
2. Say where it breaks (viewer, tool, version).
3. Give the fix you actually shipped, with a number (fields, pages, minutes saved).

Interviewers are testing whether you have debugged real forms, not whether you can recite the specification.

### Rapid-fire fundamentals

| Question | Core of the answer |
|---|---|
| What is the difference between a field and a widget? | Field holds data (`/FT`, `/T`, `/V`); widget is the annotation that draws it; one field may have many widgets |
| What is `/NeedAppearances`? | A request for the viewer to rebuild appearances; not honoured everywhere |
| Why must radio export values be unique? | `/V` must match exactly one widget's appearance state |
| What is a comb field? | Text field with MaxLen and the Comb flag; one character per cell |
| How is tab order stored? | Per page: `/Annots` order or `/Tabs` R/C/S |
| Can pdf-lib sign a PDF? | No; it creates every field type except `/Sig` |

### Scenario questions

**A client's returned forms have empty fields but the data is there.** Explain value versus appearance, name the viewer (Preview, pdftk fills), and describe your intake step that regenerates appearances and reads values as data.

**Chrome shows the form differently from Acrobat.** Auto-size fonts, `/DR` fonts missing, `/NeedAppearances` ignored, JavaScript subset. Your fix: fixed sizes, embedded fonts, appearances regenerated, scripts treated as convenience.

**The government form only opens in Adobe.** XFA, dynamic versus static, deprecation in PDF 2.0, rebuild as AcroForm keeping field names.

**How would you build 168 fields in a day?** Build sheet, static background, spec-driven pdf-lib generator, Acrobat for signatures and calculations, scripted QA with XFDF round-trip, six-viewer test, QA summary.

### Coding questions you may be asked live

```js
// "Write a function that returns all field values of a PDF as a flat object."
async function readValues(bytes) {
  const { PDFDocument } = PDFLib;
  const form = (await PDFDocument.load(bytes, { ignoreEncryption: true })).getForm();
  const out = {};
  for (const f of form.getFields()) {
    const t = f.constructor.name, n = f.getName();
    if (t === 'PDFTextField') out[n] = f.getText() ?? '';
    else if (t === 'PDFCheckBox') out[n] = f.isChecked();
    else if (t === 'PDFRadioGroup') out[n] = f.getSelected() ?? null;
    else if (t === 'PDFDropdown' || t === 'PDFOptionList') out[n] = f.getSelected();
  }
  return out;
}
```

```python
# "Flatten a filled form in Python."
import pymupdf
doc = pymupdf.open("filled.pdf")
doc.bake()                      # widgets and annotations become page content (PyMuPDF ≥ 1.23.8)
doc.save("flat.pdf", garbage=3, deflate=True)
```

Be ready to explain each line, especially why `ignoreEncryption` is safe for reading and why `bake()` must come after signing decisions.

### Process and communication questions

**How do you scope a form job?** Count pages and questions, classify field types, ask about data export, signatures, calculations, accessibility and the viewers of the audience. Quote on field count and complexity; a 168-field, 8-page form with calculations and XFDF QA is a different job from a 12-field intake sheet.

**How do you hand over?** Fillable PDF, flattened print copy, build sheet with names and export values, sample XFDF, QA summary, and a one-paragraph compatibility note.

**What would you do differently on your hardest form?** Have a real answer: for example, agreeing names before building, because renaming after the client's CRM mapping was done cost a day.

> **Interview note:** When you do not know a detail, say how you would find out: "I would dump the AcroForm dictionary with qpdf --json and check `/AP`." Demonstrating the debugging path is worth more than a guessed answer.

### Try It Yourself

```js
// Live-coding warm-up: build a 3-field form, read it back as a flat object, and print a build sheet row per field.
const { PDFDocument } = PDFLib;
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([612, 792]);
const form = pdfDoc.getForm();
form.createTextField('applicant.name').addToPage(page, { x: 186, y: 700, width: 300, height: 22 });
const cb = form.createCheckBox('agree.terms'); cb.addToPage(page, { x: 186, y: 670, width: 14, height: 14 }); cb.check();
const rg = form.createRadioGroup('property.type'); rg.addOptionToPage('RES', page, { x: 186, y: 640, width: 14, height: 14 }); rg.addOptionToPage('COM', page, { x: 250, y: 640, width: 14, height: 14 }); rg.select('COM');
form.getTextField('applicant.name').setText('Ali Raza');
const bytes = await pdfDoc.save();

async function readValues(b) {
  const f = (await PDFDocument.load(b)).getForm(); const out = {};
  for (const x of f.getFields()) {
    const t = x.constructor.name, n = x.getName();
    if (t === 'PDFTextField') out[n] = x.getText() ?? '';
    else if (t === 'PDFCheckBox') out[n] = x.isChecked();
    else if (t === 'PDFRadioGroup') out[n] = x.getSelected() ?? null;
    else out[n] = x.getSelected();
  }
  return out;
}
console.log(await readValues(bytes));
console.log('| name | type | options |\n|---|---|---|');
form.getFields().forEach(x => console.log(`| ${x.getName()} | ${x.constructor.name.replace('PDF', '')} | ${x.getOptions ? x.getOptions().join(', ') : ''} |`));
download(new Blob([bytes], { type: 'application/pdf' }), 'interview-warmup.pdf');
```

### Quiz

1. An interviewer asks "field versus widget". The best one-line answer is:
- [x] The field stores the data; the widget is the annotation that draws it, and a field can have several widgets
- [ ] They are the same object
- [ ] Widgets are only for buttons
> Mirrored fields on multiple pages are the everyday example of one field, many widgets.

2. Which answer shows real experience when asked about blank returned forms?
- [ ] "The client used the wrong PDF"
- [x] "Value and appearance are separate; Preview-saved files need appearances regenerated, which my intake script does"
- [ ] "Ask the client to retype everything"
> Naming the mechanism, the viewer and the shipped fix is the pattern interviewers reward.

3. What should you say when you do not know a detail?
- [ ] Guess confidently
- [x] Explain how you would find out, for example by dumping the dictionary with qpdf --json
- [ ] Change the subject
> Showing the debugging path proves competence more than a lucky guess.

### Exercises

1. **Two-minute pitch** — Write a 4-sentence answer to "Tell me about the most complex form you have built."
<details><summary>Solution</summary>

```text
The largest was an 8-page, 168-field mortgage intake for a title agency. I built it from a
build sheet with a pdf-lib generator over a static background, added signature fields and
calculations in Acrobat, and set structure-based tab order. QA was scripted: naming rules,
an XFDF round-trip of every field, and tests in Reader, Chrome, Edge, Preview and iOS.
The client's CRM imported the XFDF unchanged, and revisions took minutes instead of hours.
```

</details>

2. **Scoping checklist** — List eight questions you ask before quoting a form job.
<details><summary>Solution</summary>

```text
1. Page count and approximate field count?   2. Existing PDF/Word artwork or from scratch?
3. Where does the data go (Excel, CRM, XFDF)? 4. Signatures: wet, digital, e-sign platform?
5. Calculations or validation needed?          6. Which viewers will users have?
7. Accessibility/PDF-UA requirement?           8. Deadline and revision rounds?
```

</details>

### Interview Questions

**Q: Tell me about a time a form failed after delivery and what you changed.**
A client's returned intake forms looked blank in their Acrobat because their customers filled them in macOS Preview and one older pdftk-based fill; the values were there but the appearance streams were stale. I added an intake step that loads every returned PDF with PyMuPDF, reads values as data, calls `update()` to regenerate appearances, and stores a flattened copy, so the pipeline stopped depending on the customer's viewer. I also added a compatibility note to the form itself. The change took an afternoon and removed that ticket category entirely.

**Q: How do you decide between a PDF form and a Word form for a client?**
By who fills it and what happens next. If external users on unknown devices fill it and the layout must not move, PDF AcroForm wins: fixed layout, fields work in Reader, Chrome and phones, exportable as XFDF. If internal staff edit it in Word, need repeating sections or rich text, or the output is a letter that flows, content controls in DOCX win, protected for filling. Often the answer is both from one build sheet: a DOCX with tagged content controls for staff and a PDF with identically named fields for external use.

**Q: What would you check first when a client says calculations do not work?**
Which viewer they use, because Preview and most mobile viewers run no JavaScript, and Chrome runs a subset. If they are in Acrobat or Reader, I check the field calculation order, then whether the calculated field is read-only with a valid Calculate action, then whether the input fields have number formats so values are numeric. I reproduce with 1, 2, 3 in the inputs. In my experience calculation order is the culprit most often after viewer choice.

**Q: How do you estimate effort for a large form?**
I count fields by type from the source document and apply rough unit times: text fields are fastest, radio groups and dropdowns with option lists take longer, calculations and scripts longest. I add fixed costs for the background rebuild, tab order, signatures, QA round-trip and cross-viewer testing, then a revision allowance. For a 168-field form with calculations I quote in days, not hours, and I explain that most of the time is naming discipline and QA, which is what makes the data import work first time.

