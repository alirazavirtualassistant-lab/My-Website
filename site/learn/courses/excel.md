---
id: excel
title: Advanced Excel
icon: 📈
track: Data & Reporting
color: #1D6F42
runner: none
tagline: Formulas, PivotTables, Power Query and dashboards for real reporting work.
description: Excel from cell basics to expert analyst level: references and formulas, text/date/logical functions, lookups (XLOOKUP/INDEX-MATCH), SUMIFS/COUNTIFS, dynamic arrays (FILTER/UNIQUE/SORT/LET/LAMBDA), PivotTables and slicers, Power Query (M), Power Pivot/data model basics, charts and dashboards, data validation, conditional formatting, error handling, performance and interview problems.
---

# LEVEL: Beginner

## The grid, cells & data types

Excel is a grid. Columns are lettered (`A`, `B`, … `Z`, `AA`, `AB` …) and rows are numbered (`1` to `1,048,576`). A **cell** is the intersection of a column and a row and is named by its address: `B3` is column B, row 3. A **range** is a rectangular block of cells written as top-left to bottom-right, such as `A1:D20`. A **worksheet** is one grid (the tabs at the bottom), and a **workbook** is the `.xlsx` file that holds one or more worksheets.

Everything you will ever do in Excel is either putting a value in a cell or writing a formula that reads other cells. So the first thing to understand is what a cell can hold.

### The four data types a cell can hold

| Type | Example | How Excel aligns it by default | How to spot it |
|---|---|---|---|
| Number | `1250`, `3.75`, `-12` | Right | Right-aligned, can be summed |
| Text | `Stewart Title`, `WY-00417` | Left | Left-aligned, `SUM` ignores it |
| Date/time | `16/09/2026`, `09:30` | Right | It is a number underneath (a serial) |
| Boolean | `TRUE`, `FALSE` | Centre | Result of a comparison |

Dates deserve a second look. Excel stores a date as the number of days since 1 January 1900, so 16 September 2026 is serial `46281`. A time is the fraction of a day, so `12:00` is `0.5`. This is why you can subtract two dates to get the number of days between them, and why a date that is accidentally imported as text (left-aligned, cannot be subtracted) is the single most common problem in reports built from exported CSVs.

```excel
=TODAY()          → 16/09/2026 (a number formatted as a date)
=TODAY()+30       → the date 30 days from now
="46281"+0        → 46281 (text coerced to a number)
=ISTEXT(A2)       → TRUE if A2 holds text, even if it looks like a number
```

Type `=ISNUMBER(A2)` next to any imported date column. If it returns `FALSE`, the "dates" are text and every date formula downstream will fail until you fix them (Chapter *Date & time functions* shows how).

### Entering and editing

- Click a cell and type. Press **Enter** to commit and move down, **Tab** to commit and move right.
- Press **F2** to edit the current cell in place instead of retyping it.
- **Esc** cancels an edit.
- **Ctrl+Z** undoes, **Ctrl+Y** redoes.
- **Delete** clears the contents, while right-click → **Delete…** removes the cell itself and shifts neighbours.

A leading apostrophe forces text: typing `'00417` keeps the leading zeros, where `00417` would become the number `417`. Policy numbers, ZIP codes and agent IDs almost always need this treatment.

### Moving around a big sheet

A rate matrix with 3,346 rows is not something you scroll through by hand. Learn these first:

| Keys | Action |
|---|---|
| `Ctrl+Arrow` | Jump to the edge of the current data block |
| `Ctrl+Shift+Arrow` | Select from here to the edge |
| `Ctrl+Home` / `Ctrl+End` | First cell / last used cell |
| `Ctrl+G` (Go To) | Type an address like `C3346` and jump |
| `Ctrl+A` | Select the current region, twice for the whole sheet |
| `Ctrl+Space` / `Shift+Space` | Select the whole column / row |

The **Name Box** (left of the formula bar) shows the current address. You can also type a range there, such as `A2:A3347`, and press Enter to select it instantly.

### Selecting, copying and pasting

Copy is `Ctrl+C`, paste is `Ctrl+V`, and cut is `Ctrl+X`. The important extra is **Paste Special** (`Ctrl+Alt+V`), which lets you paste only **Values** (to freeze formulas into numbers before sending a report to a client), only **Formats**, or **Transpose** (rows become columns). Freezing values before emailing a workbook is a habit worth building on day one: the recipient sees numbers, not `#REF!` errors pointing at a sheet that does not exist on their machine.

> **Tip:** Right-aligned means number, left-aligned means text. Before you trust any column that came from a CSV, glance at its alignment. That two-second check catches most "why is my SUM zero?" problems.

### Try It Yourself

```excel
' Type these into a blank sheet, one per cell in column A, then use column B to test them
A1: 1250
A2: WY-00417
A3: 16/09/2026
A4: '00417

B1: =ISNUMBER(A1)     → TRUE
B2: =ISTEXT(A2)       → TRUE
B3: =A3+30            → a date 30 days later
B4: =ISNUMBER(A4)     → FALSE (the apostrophe made it text)
```

### Quiz

1. What does `A1:C3` describe?
- [ ] Three cells: A1, C3 and the one between them
- [x] A rectangular block of nine cells from A1 to C3
- [ ] The cells A1 and C3 only
> A range is every cell from the top-left address to the bottom-right address, here 3 columns by 3 rows.

2. Excel stores the date 1 January 1900 as which value?
- [x] 1
- [ ] 0
- [ ] 1900
> Dates are day counts starting at serial 1 on 1 January 1900, which is why date arithmetic works.

3. A column of dates imported from a CSV is left-aligned. What does that tell you?
- [ ] They are correctly formatted dates
- [x] They are text and date formulas will not work on them
- [ ] They are negative numbers
> Text aligns left by default; real dates are numbers and align right.

4. Which key edits the active cell without retyping it?
- [ ] F5
- [x] F2
- [ ] F9
> F2 enters edit mode in place; F5 is Go To and F9 recalculates.

### Exercises

1. **Keep the zeros** — Enter the policy number `00417` so that it displays with the leading zeros, then write a formula in the next cell that proves whether it is text or a number.
<details><summary>Solution</summary>

Type `'00417` (leading apostrophe) into `A1`. In `B1` enter `=ISTEXT(A1)`, which returns `TRUE`. Alternatively format `A1` as **Text** first (Home → Number Format → Text) and then type `00417`.

</details>

2. **Days until deadline** — Put today's date in `A1` and a client deadline in `A2`, and compute how many days remain.
<details><summary>Solution</summary>

`A1: =TODAY()`, `A2: 30/09/2026`, `A3: =A2-A1`. If `A3` shows a date instead of a number, set its number format to **General**; the subtraction is right, only the display was inherited from the date cells.

</details>

3. **Jump to the end** — In a sheet with 3,346 rows of data starting at `A2`, select the entire data column with the keyboard only.
<details><summary>Solution</summary>

Click `A2`, then press `Ctrl+Shift+Down`. Excel selects `A2:A3347` in one stroke, stopping at the last non-empty cell.

</details>

### Interview Questions

**Q: How does Excel store dates and why does that matter?**
Excel stores a date as a serial number counting days from 1 January 1900 (serial 1), with times as fractions of a day. That design is why `=B2-A2` gives the days between two dates and why `=A2+7` gives next week. It also explains the two classic bugs: a date imported as text looks right but cannot be subtracted, and a time such as `18:00` is really `0.75`, so summing hours worked past 24 needs the `[h]:mm` format. When I take over a report I check `=ISNUMBER()` on the date column before touching any formula that depends on it.

**Q: What is the difference between a value and a formula in a cell?**
A value is stored literally: the number `1250` or the text `Wyoming`. A formula starts with `=` and is recalculated whenever a cell it references changes; the cell displays the result but the formula bar shows the expression. The practical difference shows up when you send a file: formulas that reference other sheets or external workbooks break on the recipient's machine, so I paste-as-values a delivery copy and keep the formula version as my working file.

**Q: Why might a column of numbers show a SUM of zero?**
Because the entries are text, not numbers. This happens with CSV imports, values pasted from web pages or PDFs, and numbers with non-breaking spaces or currency symbols. The fix is to convert them: multiply by 1 in a helper column, use `=VALUE()`, use **Data → Text to Columns → Finish**, or apply `Number.From` in Power Query. I also check for a leading apostrophe or a green error triangle in the corner of the cell, which is Excel warning that a number is stored as text.

## Formulas & relative/absolute references

A formula is anything that starts with `=`. Excel evaluates it and shows the result in the cell. The power of a spreadsheet is that a formula refers to other cells by address, and when you copy that formula somewhere else, the addresses move with it. Understanding exactly how they move is the difference between a report that fills correctly with one drag and one full of wrong numbers that look right.

### Arithmetic and operators

```excel
=A2+B2          addition
=A2-B2          subtraction
=A2*B2          multiplication
=A2/B2          division
=A2^2           power
=A2&" "&B2      text join (ampersand)
=A2>=1000       comparison, returns TRUE or FALSE
```

Operator precedence follows mathematics: `^` first, then `*` and `/`, then `+` and `-`, then `&`, then comparisons. Use parentheses whenever there is any doubt: `=(A2+B2)/2` is an average; `=A2+B2/2` is not.

### Relative references

Suppose column C should hold each agent's error rate: errors divided by files processed.

```excel
   A        B       C          D
1  Agent    Files   Errors     Rate
2  Sana     412     9          =C2/B2
3  Bilal    388     14         =C3/B3
4  Hira     455     6          =C4/B4
```

You type `=C2/B2` once in `D2` and drag the fill handle (the small square at the bottom-right of the selection) down. Excel does not copy the text `C2/B2`; it copies the *relationship* "the cell one column left divided by the cell two columns left". In `D3` that relationship becomes `=C3/B3`. This is a **relative reference**: it is stored as an offset from the formula's own cell.

### Absolute references with `$`

Now add a target error rate in `F1` (say `2%`) and compute how far each agent is over target.

```excel
E2: =D2-F1     ← wrong when dragged: E3 becomes =D3-F2, which is empty
E2: =D2-$F$1   ← right: every copy keeps pointing at F1
```

The `$` locks the part of the address it precedes. `$F$1` locks both column and row. `F$1` locks only the row (the column can still slide when you copy sideways), and `$F1` locks only the column. Press **F4** while the cursor is inside a reference in the formula bar to cycle through the four forms: `F1` → `$F$1` → `F$1` → `$F1`.

### Mixed references: the multiplication table trick

A rate matrix is a two-way table: one input down the side, another across the top. Mixed references fill the whole grid from a single formula.

```excel
   A          B       C       D
1  Amount →   100000  200000  300000
2  Rate 0.5%  =$A2*B$1
3  Rate 0.6%  (fill right and down from B2)
4  Rate 0.7%
```

In `B2`, `$A2` says "always column A, but slide the row", and `B$1` says "always row 1, but slide the column". Copy `B2` across and down and every cell computes the right rate × amount pair. Title-insurance premium matrices, commission grids and discount tables are all built exactly this way.

### Filling and auto-complete

- Drag the fill handle or double-click it to fill down to the end of the adjacent column.
- `Ctrl+D` fills down from the cell above; `Ctrl+R` fills right.
- `Ctrl+Enter` after typing a formula fills it into every selected cell at once.

### Reading a formula someone else wrote

Press `Ctrl+`` ` (the backtick key, left of `1`) to toggle **Show Formulas** and see every formula on the sheet instead of its result. Click into a cell and Excel colour-codes each referenced range with a matching border, which makes it obvious when a reference is off by one row.

> **Warning:** A formula that looks right in the first row and wrong in the tenth is almost always a missing `$`. Check the tenth row before you trust a filled column, not the first.

### Try It Yourself

```excel
' Build a 3 x 3 premium matrix with one formula
A1: Amount        B1: 100000    C1: 200000    D1: 300000
A2: 0.5%          B2: =$A2*B$1
A3: 0.6%
A4: 0.7%
' Copy B2 to B2:D4. Expected D4 = 300000 * 0.7% = 2100
```

### Quiz

1. You copy `=B2*C2` from `D2` to `D5`. What formula appears in `D5`?
- [ ] `=B2*C2`
- [x] `=B5*C5`
- [ ] `=D5*C5`
> Relative references are stored as offsets, so both references slide down three rows.

2. Which reference keeps the column fixed but lets the row change?
- [ ] `$F$1`
- [x] `$F1`
- [ ] `F$1`
> The `$` locks whatever follows it; `$F1` locks column F only.

3. Which key cycles a reference through its four `$` forms?
- [x] F4
- [ ] F2
- [ ] Ctrl+D
> F4 toggles relative, absolute, row-locked and column-locked while editing a formula.

4. What does `=A2&B2` do?
- [ ] Multiplies A2 by B2
- [x] Joins the text of A2 and B2
- [ ] Compares A2 with B2
> The ampersand is Excel's text-concatenation operator.

### Exercises

1. **Percent of total** — Files per state are in `B2:B10` and the total in `B11`. Write one formula in `C2` that can be filled down to show each state's share of the total.
<details><summary>Solution</summary>

`C2: =B2/$B$11`, then fill down. `B2` slides, `$B$11` stays locked on the total. Format column C as Percentage.

</details>

2. **Commission grid** — Sales amounts are in `B1:F1` and commission rates in `A2:A6`. Fill the grid with a single formula.
<details><summary>Solution</summary>

`B2: =B$1*$A2`, then copy to `B2:F6`. Row 1 is locked for the amount and column A is locked for the rate.

</details>

3. **Spot the bug** — A colleague's sheet has `=C2-F1` in `E2` filled down to `E50`, where `F1` holds the target. Explain what is wrong and fix it.
<details><summary>Solution</summary>

Every row below `E2` points at a different, empty cell in column F (`F2`, `F3`, …), so it subtracts zero. Replace with `=C2-$F$1` and refill.

</details>

### Interview Questions

**Q: Explain relative, absolute and mixed references with an example.**
A relative reference like `B2` is stored as an offset from the formula's cell, so copying the formula moves the reference. An absolute reference `$B$2` is fixed in both directions. Mixed references lock one direction: `$B2` locks the column, `B$2` locks the row. The classic example is a two-way rate matrix: put amounts across the top and rates down the side, write `=$A2*B$1` once, and fill the whole grid. I use F4 to cycle the forms rather than typing dollars by hand, and I check the far corner of the filled range to confirm the locks are right.

**Q: How would you audit a large sheet of formulas quickly?**
First `Ctrl+`` ` to show formulas and scan for inconsistencies, which Excel also flags with the green "inconsistent formula" triangle. Then **Formulas → Trace Precedents** on suspicious cells, and **Go To Special → Formulas** versus **Constants** to find hard-coded numbers hiding in a calculated column. For a report I inherited at Stewart Title I also compared each column's formula in row 2 with the same column in the last row; a mismatch there almost always meant a missing dollar sign.

**Q: What is the fill handle and what does double-clicking it do?**
The fill handle is the small square at the bottom-right of a selection. Dragging it copies the formula or extends a series. Double-clicking it fills down as far as the adjacent column has data, which is how you fill 3,000 rows in one click without scrolling. It stops at the first blank in the neighbouring column, so I make sure the key column has no gaps before relying on it.

## Basic functions (SUM/AVERAGE/COUNT/ROUND)

A **function** is a built-in formula with a name and arguments in parentheses. `=SUM(B2:B10)` adds a range; you could write `=B2+B3+…+B10`, but the function is shorter, does not break when rows are inserted inside the range, and reads clearly. Excel has over 500 functions. You need about thirty for daily reporting, and these six are the foundation.

### SUM, AVERAGE, MIN, MAX

```excel
=SUM(B2:B10)          total files processed
=AVERAGE(B2:B10)      mean per agent
=MIN(B2:B10)          slowest agent's count
=MAX(B2:B10)          fastest agent's count
=SUM(B2:B10, D2:D10)  two ranges added together
```

All of these ignore text and empty cells. That is convenient, but it hides errors: if half the column is text-that-looks-like-numbers, `AVERAGE` silently averages only the real numbers. Pair it with `COUNT` to check.

### COUNT, COUNTA, COUNTBLANK

| Function | Counts | Typical use |
|---|---|---|
| `COUNT(range)` | Cells containing numbers (dates count too) | How many numeric entries |
| `COUNTA(range)` | Non-empty cells of any type | How many rows have anything |
| `COUNTBLANK(range)` | Empty cells | How many entries are missing |

```excel
=COUNTA(A2:A500)-COUNT(B2:B500)   rows that have a name but no numeric value
```

That single formula is a data-quality check you can drop at the bottom of any imported column: if it is not zero, some values are text or missing.

### ROUND, ROUNDUP, ROUNDDOWN

Floating-point arithmetic means `=0.1+0.2` is `0.30000000000000004` inside Excel even though it displays `0.3`. Formatting a cell to two decimals only changes what you see; the underlying value still carries the noise, and it shows up when you compare totals against a client's invoice.

```excel
=ROUND(A2*0.0055, 2)     premium rounded to cents, as the rate manual requires
=ROUNDUP(A2/1000, 0)     number of $1,000 units, always rounded up (rate tables use this)
=ROUNDDOWN(A2, -3)       round down to the nearest thousand
=ROUND(1234.567, -2)     → 1200
```

Title-insurance rate manuals typically price per `$1,000` of coverage, rounded *up* to the next thousand, then rounded to the cent. `ROUNDUP` and `ROUND` together reproduce that rule exactly, and `MROUND(A2, 1000)` rounds to the nearest multiple if a manual asks for that instead.

### Function anatomy and the tooltip

Type `=RO` and Excel lists every function starting with those letters. Press **Tab** to accept one. As you type inside the parentheses a tooltip shows the arguments; the one in bold is the one you are on. Arguments in square brackets are optional. Press `Ctrl+A` after the function name to open the **Function Arguments** dialog, which is useful while learning because it shows each argument's current value.

### AutoSum and the status bar

Select a range of numbers and look at the **status bar** at the bottom of the window: it shows Average, Count and Sum without any formula. Right-click it to add Min and Max. For a permanent total, select the cell under a column and press **Alt+=** (AutoSum); Excel writes `=SUM(...)` for the block above.

### A worked mini-report

```excel
   A        B        C         D
1  Agent    Files    Errors    Rate
2  Sana     412      9         =ROUND(C2/B2, 4)
3  Bilal    388      14        =ROUND(C3/B3, 4)
4  Hira     455      6         =ROUND(C4/B4, 4)
5  Total    =SUM(B2:B4)  =SUM(C2:C4)  =ROUND(C5/B5, 4)
6  Average  =AVERAGE(B2:B4)
7  Agents   =COUNTA(A2:A4)
```

Notice the total rate in `D5` is computed from the totals, not as `AVERAGE(D2:D4)`. Averaging the rates would weight each agent equally regardless of volume, which is wrong when one agent handled 455 files and another 388. Interviewers love this distinction.

> **Interview note:** "Why is the average of the rates different from the rate of the totals?" is a common screening question. The answer is weighting: the rate of totals is a volume-weighted average.

### Try It Yourself

```excel
' Premium per the rate manual: $5.50 per $1,000, rounded up to the next $1,000, then to the cent
A1: Coverage       B1: 187450
A2: Units (1000s)  B2: =ROUNDUP(B1/1000, 0)      → 188
A3: Premium        B3: =ROUND(B2*5.5, 2)         → 1034
A4: Check          B4: =B1*5.5/1000              → 1030.975 (the naive answer)
```

### Quiz

1. `=COUNT(A1:A5)` where the cells hold `10`, `"x"`, blank, `20`, `30` returns?
- [ ] 5
- [x] 3
- [ ] 4
> COUNT only counts numeric cells; text and blanks are skipped.

2. What does `=ROUND(1234.567, -2)` return?
- [ ] 1234.57
- [x] 1200
- [ ] 1230
> A negative number of digits rounds to the left of the decimal point: -2 rounds to hundreds.

3. Which shortcut inserts an AutoSum?
- [x] Alt+=
- [ ] Ctrl+=
- [ ] Alt+S
> Alt+= writes a SUM for the contiguous block above or to the left.

4. Which is the correct overall error rate for a team?
- [x] Total errors divided by total files
- [ ] The average of each agent's rate
- [ ] The maximum agent rate
> The rate of totals weights each agent by volume; averaging rates does not.

### Exercises

1. **Missing values check** — Column A holds file numbers and column B holds processing minutes for 500 rows. Write a formula that returns how many rows have a file number but no numeric minutes.
<details><summary>Solution</summary>

`=COUNTA(A2:A501)-COUNT(B2:B501)`. If it returns anything above zero, filter column B for blanks and text.

</details>

2. **Rate-manual rounding** — Coverage amounts are in `A2:A50`. Compute the premium at $4.25 per $1,000, rounded up to the next full thousand, rounded to cents.
<details><summary>Solution</summary>

`B2: =ROUND(ROUNDUP(A2/1000,0)*4.25, 2)` filled down.

</details>

3. **Team summary** — Below a table of agents with files and errors, add total, average files per agent, and the team error rate.
<details><summary>Solution</summary>

`=SUM(B2:B21)`, `=AVERAGE(B2:B21)` and `=SUM(C2:C21)/SUM(B2:B21)`. Do not average column D.

</details>

### Interview Questions

**Q: What is the difference between COUNT, COUNTA and COUNTBLANK?**
`COUNT` counts numeric cells only, including dates because they are numbers. `COUNTA` counts every non-empty cell regardless of type, including cells holding an empty string `""` returned by a formula, which is a common trap. `COUNTBLANK` counts truly empty cells and also cells containing `""`. I use `COUNTA` minus `COUNT` on an imported column as a quick test for numbers stored as text: on a clean numeric column the difference is zero.

**Q: Why should you round in the formula rather than just formatting to two decimals?**
Formatting changes only the display; the stored value keeps its full precision, so a column of displayed cents can total to a number that differs from the displayed sum by a cent or two. Clients reconciling against an invoice notice that. `ROUND(x, 2)` changes the stored value so downstream sums, lookups and exports agree with what is on screen. There is also a workbook option, **Set precision as displayed**, but it is a blunt instrument that permanently alters every cell, so I avoid it.

**Q: When would you use ROUNDUP instead of ROUND?**
When a business rule says to charge for any part of a unit. Title-insurance rate manuals price per $1,000 of coverage and treat a partial thousand as a full one, so `$187,450` is 188 units, not 187.45. `ROUNDUP(A2/1000, 0)` implements that rule exactly, while `ROUND` would give 187 and under-charge. `CEILING.MATH(A2, 1000)` is an alternative that returns the rounded-up amount in dollars rather than units.

## Formatting & number formats

Formatting never changes a value; it changes how the value is displayed. That single sentence prevents a whole family of bugs. A cell holding `0.0055` can display as `0.55%`, `0.01`, `$0.01` or `5.50‰` depending on its number format, and every formula that reads it still sees `0.0055`.

### The Home ribbon basics

The **Home** tab has font, alignment and number groups. The keyboard equivalents are faster once you know them:

| Keys | Format |
|---|---|
| `Ctrl+B` / `Ctrl+I` / `Ctrl+U` | Bold / italic / underline |
| `Ctrl+Shift+1` | Number with two decimals and thousands separator |
| `Ctrl+Shift+4` | Currency |
| `Ctrl+Shift+5` | Percentage |
| `Ctrl+Shift+3` | Date (`dd-mmm-yy`) |
| `Ctrl+1` | Open the **Format Cells** dialog |

`Ctrl+1` is the one to memorise. It opens the dialog with every option: Number, Alignment, Font, Border, Fill and Protection.

### Number format codes

Under **Format Cells → Number → Custom** you can type a format code. A code has up to four sections separated by semicolons: positive; negative; zero; text.

```excel
#,##0                    1,234
#,##0.00                 1,234.50
0.0%                     55.0%
$#,##0.00;($#,##0.00)    positives normal, negatives in parentheses (accounting style)
#,##0;-#,##0;"-"         zero shows as a dash
0000                     417 displays as 0417 (leading zeros without converting to text)
dd-mmm-yyyy              16-Sep-2026
mmm yy                   Sep 26
[h]:mm                   total hours beyond 24, e.g. 37:30
#,##0" files"            1,234 files (text appended, still a number)
[Green]0.0%;[Red]-0.0%   colour by sign
```

Placeholders: `0` always shows a digit (padding with zeros), `#` shows a digit only if needed, `,` inserts the thousands separator, `.` is the decimal point. Wrap literal text in double quotes. The `0000` code is the professional way to show policy numbers with leading zeros while keeping them numeric for lookups.

### Why "1,234 files" beats typing the word

A cell formatted `#,##0" files"` still holds `1234`, so `=SUM` works and charts plot it. The moment someone types `1234 files` as text, the column stops adding up. Custom formats let a dashboard read naturally without sacrificing arithmetic.

### Alignment, wrap and merge

- **Wrap Text** (Home → Alignment) lets long headers break onto two lines.
- **Center Across Selection** (in `Ctrl+1` → Alignment → Horizontal) centres a title over several columns *without* merging. Prefer it to **Merge & Center**: merged cells break sorting, filtering, `Ctrl+Arrow` navigation and copy-paste of whole columns.
- **Indent** pushes text in from the cell edge for sub-items in a report.

### Column widths and row heights

Double-click the boundary between column letters to auto-fit. Select several columns and drag one boundary to set them all to the same width. A cell showing `#####` is simply too narrow for a number; widen it, the value is intact.

### Format Painter and styles

**Format Painter** (Home → Clipboard, the brush icon) copies formatting from one cell to another. Double-click it to paint repeatedly. **Cell Styles** (Home → Styles) lets you define *Input*, *Calculation* and *Output* styles once and apply them consistently, which is how financial-model conventions work: blue font for inputs, black for formulas, green for links to other sheets.

### Themes and printing

**Page Layout → Themes** changes fonts and colours across the workbook, which is how you match a client's brand across a report suite. **Page Layout → Print Titles** repeats the header row on every printed page, and **Page Setup → Fit to 1 page wide** stops a wide table from splitting columns across sheets. Set the print area with **Page Layout → Print Area → Set Print Area** so the printout excludes scratch columns.

> **Tip:** When a number looks wrong, check its format before its formula. `Ctrl+1` and the **General** format show the raw value, which resolves "the total is off by one cent" and "the date shows as 46281" in seconds.

### Try It Yourself

```excel
' Custom number formats to paste into Format Cells → Custom
#,##0;(#,##0);"-"            accounting-style negatives and dash for zero
0.00%                        rates with two decimals
0000                         4-digit policy numbers with leading zeros
dd-mmm-yyyy                  unambiguous dates for US/UK readers
#,##0" files"                unit label while staying numeric
[Green]▲0.0%;[Red]▼0.0%;0.0% arrows by sign for a KPI tile
```

### Quiz

1. A cell shows `#####`. What is wrong?
- [ ] The formula has an error
- [x] The column is too narrow to display the number
- [ ] The value is text
> Widen the column; the value is intact. Errors start with `#` but spell out a name such as `#VALUE!`.

2. Which format code shows `417` as `0417` while keeping it a number?
- [ ] `"0"000`
- [x] `0000`
- [ ] `@`
> Each `0` forces a digit; `@` is the text placeholder and would not pad.

3. Why prefer Center Across Selection over Merge & Center?
- [x] Merged cells break sorting, selection and copy-paste
- [ ] Merged cells cannot be bold
- [ ] Center Across Selection is faster to calculate
> Merges create irregular cells that many operations refuse to work with.

4. What do the four sections of a custom format represent?
- [ ] Integer; decimal; sign; unit
- [x] Positive; negative; zero; text
- [ ] Number; date; time; percentage
> Format codes are `pos;neg;zero;text`, and omitted sections fall back to the first.

### Exercises

1. **Accounting negatives** — Format a variance column so negatives show in parentheses and zeros show as a dash.
<details><summary>Solution</summary>

Select the column, `Ctrl+1` → Custom, enter `#,##0;(#,##0);"-"`.

</details>

2. **Total hours** — Agents' daily hours are in `B2:B6` as times (e.g. `08:30`). Sum them so the total shows `42:30` rather than `18:30`.
<details><summary>Solution</summary>

`B7: =SUM(B2:B6)` and set the format of `B7` to `[h]:mm`. Without the square brackets the hours roll over at 24.

</details>

3. **Brand the report** — Apply a consistent header style (bold, white text, dark fill) to five sheets without formatting each one by hand.
<details><summary>Solution</summary>

Format one header row, then Home → Cell Styles → **New Cell Style** from that selection and name it `ReportHeader`. On each other sheet select the header row and click the style. Alternatively group the sheets (click the first tab, `Shift`-click the last) and format once; ungroup afterwards.

</details>

### Interview Questions

**Q: What is the difference between a cell's value and its format?**
The value is the data stored in the cell; the format is a display instruction layered over it. `0.0055` can display as `0.55%` or `0.01` but every formula reads `0.0055`. That is why rounding must be done with `ROUND` rather than formatting, why a "date" showing `46281` just needs a date format, and why a policy number formatted `0000` still works in a numeric lookup. I explain this to junior analysts on their first day because most "Excel is calculating wrong" tickets are format confusions.

**Q: How do you show numbers with units, like "1,234 files", without breaking SUM?**
With a custom number format that appends quoted text: `#,##0" files"`. The cell keeps the numeric value, so totals, charts and lookups keep working, but the dashboard reads naturally. The same technique handles `"$"#,##0"K"` for thousands on a KPI tile and `0.0"x"` for ratios. Typing the unit as text is the wrong approach because it converts the column to text.

**Q: Why do financial modellers colour-code cells?**
It makes the flow of a model auditable at a glance: blue for hard-coded inputs, black for formulas, green for references to other sheets, and often a yellow fill for cells the user is expected to change. When a reviewer sees a blue number in the middle of a calculation block they know a formula was overwritten. Excel's Cell Styles let you define these once and apply them consistently, and **Go To Special → Constants** verifies that nothing hard-coded hides among formulas.

## Sorting, filtering & tables (Ctrl+T)

Raw data lands in Excel as a flat list: one header row and one record per row. Everything in later chapters, from SUMIFS to PivotTables to Power Query, assumes this shape. This chapter is about working with lists: putting rows in order, hiding the ones you do not need, and converting the block into an Excel **Table**, which is the most under-used feature in the product.

### Sort

Select any cell in the list and use **Data → Sort**. Add levels for multi-key sorts: by *State*, then by *Files* descending. The dialog's **My data has headers** box must be ticked, otherwise the header row is sorted into the middle of the data. Quick sorts (`A→Z` buttons) sort by the active column and keep whole rows together as long as the block has no fully blank columns or rows inside it; a blank column splits the region and rows on the other side of it will not move, which silently scrambles a dataset.

Custom sort orders exist under **Order → Custom List** for things like *High, Medium, Low* that should not sort alphabetically.

### Filter

`Ctrl+Shift+L` toggles AutoFilter arrows on the header row. Each arrow offers checkboxes for values plus **Text Filters**, **Number Filters** and **Date Filters** with conditions such as *contains*, *greater than* and *this month*. Filtered rows are hidden, not deleted, and the row numbers turn blue to remind you.

Two things happen with hidden rows that catch people out:

- `SUM` still adds hidden rows. Use `=SUBTOTAL(109, B2:B500)` to sum visible rows only (`109` = SUM ignoring hidden; `9` ignores only filtered rows; `103` is COUNTA of visible rows). `AGGREGATE(9, 5, B2:B500)` does the same and can also skip errors.
- Copying a filtered range copies only the visible rows, which is exactly what you want when extracting one state's records.

### Remove duplicates and Text to Columns

**Data → Remove Duplicates** deletes repeated rows based on the columns you tick; run it on a copy because it is destructive. **Data → Text to Columns** splits a column on a delimiter or fixed width and, in its final step, lets you set each output column's type, which is the classic fix for dates and numbers stored as text.

### Tables: Ctrl+T

Select any cell in the list and press **Ctrl+T**. Excel converts the block into a Table. The changes are immediate:

1. Header filters appear, and banded rows make the list readable.
2. The Table gets a name (`Table1`; rename it on the **Table Design** tab to something like `tblProduction`).
3. Formulas use **structured references**: `=SUM(tblProduction[Files])` instead of `=SUM(B2:B500)`.
4. Typing a formula in a new column fills the whole column automatically (a *calculated column*).
5. Adding a row at the bottom extends the Table, and every formula, PivotTable and chart pointing at it picks up the new row.

```excel
=SUM(tblProduction[Files])                      whole column
=tblProduction[@Errors]/tblProduction[@Files]   this row (inside the table)
=COUNTA(tblProduction[Agent])                   number of records
=tblProduction[[#Totals],[Files]]               the total-row cell
```

The `@` means "this row". The Table Design tab has a **Total Row** checkbox that adds a row with a dropdown per column (Sum, Average, Count, …) implemented with `SUBTOTAL`, so it respects filters.

### Why Tables matter for reporting

A weekly production report fed by a range `A2:F500` breaks the first week there are 501 rows. Fed by `tblProduction`, it never breaks. PivotTables built on a Table refresh cleanly, Power Query loads from a Table by name, and data validation lists that reference a Table column grow automatically. When I build a workbook for a client, the first thing I do to any list is `Ctrl+T`.

### Freeze panes and views

**View → Freeze Panes → Freeze Top Row** keeps headers visible while you scroll. For a matrix, select the cell below the header row and right of the label column, then **Freeze Panes** to lock both. Tables also replace the column letters with the header names when you scroll, which is a small feature that makes long lists much easier to read.

> **Warning:** Never sort a list that has a blank column inside it with the quick-sort buttons. Excel treats each side of the blank as a separate region and sorts only one of them, which silently misaligns names and numbers. Convert to a Table first; a Table always sorts as a unit.

### Try It Yourself

```excel
' After Ctrl+T on a list with columns Agent, State, Files, Errors and renaming it tblProduction:
=SUM(tblProduction[Files])
=SUBTOTAL(109, tblProduction[Files])          visible rows only
=[@Errors]/[@Files]                           type this in a new column header "Rate"
=COUNTIF(tblProduction[State], "Wyoming")
```

### Quiz

1. Which function sums only the visible rows of a filtered list?
- [ ] `=SUM(B2:B500)`
- [x] `=SUBTOTAL(109, B2:B500)`
- [ ] `=SUMVISIBLE(B2:B500)`
> SUBTOTAL with function number 109 sums while ignoring hidden and filtered rows.

2. What does `[@Files]` mean inside a Table formula?
- [x] The Files value in the current row
- [ ] The whole Files column
- [ ] The Files header text
> The `@` selector picks the cell of that column on the same row as the formula.

3. Which shortcut creates a Table?
- [ ] Ctrl+L on Mac only
- [x] Ctrl+T
- [ ] Ctrl+Shift+T
> Ctrl+T (and Ctrl+L) opens the Create Table dialog for the current region.

4. What is the risk of the quick-sort buttons on a list containing an empty column?
- [ ] They sort descending by mistake
- [x] Only part of the list is sorted, misaligning rows
- [ ] They delete the empty column
> Blank columns split the current region, so Excel sorts one side only.

### Exercises

1. **State extract** — From a Table of 3,000 production rows, produce a separate sheet with only the Wyoming rows, keeping formatting.
<details><summary>Solution</summary>

Filter the State column to Wyoming, select the visible Table (click a cell, `Ctrl+A`), copy, and paste on a new sheet. Only visible rows are pasted. Clear the filter afterwards with `Ctrl+Shift+L` twice.

</details>

2. **Total row that respects filters** — Add a total row to the Table that shows the sum of Files and the count of Agents, and confirm it changes when you filter a state.
<details><summary>Solution</summary>

Table Design → tick **Total Row**. In the Files total cell choose *Sum*; in the Agent total cell choose *Count*. Both are `SUBTOTAL` formulas (`109` and `103`) so filtering updates them.

</details>

3. **Structured error rate** — Add a calculated column `Rate` to `tblProduction` and reference the team's overall rate from a cell outside the Table.
<details><summary>Solution</summary>

Inside the Table, header `Rate`, formula `=[@Errors]/[@Files]` (fills the column). Outside: `=SUM(tblProduction[Errors])/SUM(tblProduction[Files])`.

</details>

### Interview Questions

**Q: What advantages does an Excel Table give over a plain range?**
Tables auto-expand, so formulas, PivotTables, charts and validation lists pointing at them pick up new rows without editing ranges. Structured references such as `tblProduction[Files]` are self-documenting, calculated columns fill automatically and stay consistent, the header row stays visible on scroll, the total row uses SUBTOTAL so it respects filters, and Power Query can load a Table by name. The main limitation is that Tables cannot be used with shared-workbook mode or with array formulas that spill into them, and merged cells are not allowed inside them. For any list that will be reported on more than once, I convert it on day one.

**Q: How does SUBTOTAL differ from SUM?**
`SUBTOTAL(function_num, range)` performs one of eleven aggregations and, depending on the function number, ignores filtered rows (1–11) or both filtered and manually hidden rows (101–111). It also ignores other SUBTOTAL results inside its range, so nested subtotals never double count. `SUM` counts everything regardless of visibility. In a filterable report I always use `SUBTOTAL(109, …)` or `AGGREGATE`, otherwise the total under a filtered list is wrong and nobody notices until a manager adds the visible rows by hand.

**Q: A colleague sorted a list and the names no longer match the numbers. What probably happened and how do you prevent it?**
They most likely selected a single column and chose *sort the selection only*, or the list contained a blank column that split the region so only part of it moved. Undo immediately if possible; otherwise recover from the previous version. Prevention is converting the list to a Table, which always sorts entire rows, and never leaving blank spacer columns inside data. I also keep an ID column so any accidental re-order can be restored by sorting on it.

# LEVEL: Intermediate

## Logical functions (IF/IFS/AND/OR/IFERROR)

Logical functions let a formula make decisions. The building block is a **condition**: an expression that evaluates to `TRUE` or `FALSE`, such as `B2>=400` or `C2="Wyoming"`. `IF` picks one of two results based on a condition; the rest of this chapter is about combining conditions and handling the cases where a formula cannot produce an answer.

### IF

```excel
=IF(condition, value_if_true, value_if_false)
=IF(B2>=400, "Met target", "Below target")
=IF(D2>0.02, D2-0.02, 0)          excess error rate above 2%, else 0
```

The result can be text, a number, a reference or another formula. Omitting the third argument returns `FALSE`, which usually looks wrong in a report, so always supply it (use `""` for a visually blank cell).

### AND, OR, NOT

Conditions combine with functions, not with symbols:

```excel
=AND(B2>=400, C2<=8)              both must be true
=OR(E2="Wyoming", E2="Montana")   at least one true
=NOT(ISBLANK(F2))                 flips the result
=IF(AND(B2>=400, D2<=0.02), "Bonus", "No bonus")
```

`AND` and `OR` accept up to 255 arguments. A common shortcut for OR across many values is `OR(E2={"WY","MT","ID"})`, an array constant inside braces.

### Nested IF versus IFS

A grading scale used to require nested `IF`s:

```excel
=IF(D2<=0.01, "A", IF(D2<=0.02, "B", IF(D2<=0.04, "C", "D")))
```

Excel 2019 and Microsoft 365 added `IFS`, which reads top to bottom and returns the value beside the first `TRUE`:

```excel
=IFS(D2<=0.01, "A", D2<=0.02, "B", D2<=0.04, "C", TRUE, "D")
```

The final `TRUE, "D"` is the catch-all; without it, an unmatched value returns `#N/A`. Order matters: `IFS` stops at the first match, so conditions must go from most specific to least. For long scales a lookup table with `XLOOKUP(…, match_mode -1)` or `VLOOKUP(…, TRUE)` is cleaner than either form (next chapters).

### SWITCH

When you test one value against several exact matches, `SWITCH` is more readable than `IFS`:

```excel
=SWITCH(E2, "WY", "Wyoming", "MT", "Montana", "ID", "Idaho", "Other")
```

### IFERROR and IFNA

Division by an empty cell gives `#DIV/0!`; a lookup with no match gives `#N/A`. Wrapping a formula in `IFERROR` substitutes a value for any error:

```excel
=IFERROR(C2/B2, 0)                error rate, 0 when files are zero
=IFNA(XLOOKUP(A2, Rates[Code], Rates[Rate]), "no rate")
```

Prefer `IFNA` for lookups: it catches only `#N/A` (no match) and still lets a genuine `#REF!` or `#VALUE!` surface, so a broken formula does not hide behind a friendly message. `IFERROR` on everything is how reports quietly show zeros where a sheet was deleted.

| Error | Meaning | Usual cause |
|---|---|---|
| `#DIV/0!` | Division by zero or blank | Empty denominator |
| `#N/A` | Not available | Lookup found no match |
| `#VALUE!` | Wrong type | Text where a number was expected |
| `#REF!` | Invalid reference | Referenced cell or sheet deleted |
| `#NAME?` | Unknown name | Misspelt function or missing quotes |
| `#SPILL!` | Cannot spill | Dynamic array blocked by a filled cell |

### Boolean arithmetic

`TRUE` is `1` and `FALSE` is `0` in arithmetic, which enables compact formulas:

```excel
=(B2>=400)*50                       50 if target met, else 0
=SUM((E2:E500="Wyoming")*(B2:B500)) files for Wyoming (array logic, see SUMPRODUCT)
```

### Testing functions

`ISBLANK`, `ISNUMBER`, `ISTEXT`, `ISERROR`, `ISNA`, and `ISFORMULA` return booleans for use inside `IF`. `=IF(ISBLANK(F2), "Pending", "Done")` is the standard status column in a tracking sheet.

> **Tip:** Build a complicated condition in its own helper column first, confirm it returns the right `TRUE`/`FALSE` pattern, then fold it into the `IF`. Debugging a nested condition inside a nested `IF` is much harder than debugging two simple columns.

### Try It Yourself

```excel
' Agent QA scoring: B = files, C = errors, D = =C2/B2
E2: =IFS(D2<=0.01,"A", D2<=0.02,"B", D2<=0.04,"C", TRUE,"D")
F2: =IF(AND(B2>=400, E2="A"), "Bonus", "")
G2: =IFERROR(C2/B2, 0)
H2: =SWITCH(E2, "A", 500, "B", 250, 0)
```

### Quiz

1. What does `=IF(B2>400, "Yes")` return when B2 is 300?
- [ ] An empty cell
- [x] FALSE
- [ ] `#VALUE!`
> With no third argument, IF returns the boolean FALSE.

2. Which function catches only `#N/A` errors?
- [ ] IFERROR
- [x] IFNA
- [ ] ISERR
> IFNA leaves other errors visible, so real bugs are not masked.

3. `=IFS(D2<=0.04,"C", D2<=0.01,"A")` with D2 = 0.005 returns?
- [x] C
- [ ] A
- [ ] #N/A
> IFS stops at the first TRUE; 0.005 is ≤ 0.04, so "C" wins despite also qualifying for "A". Order conditions from strictest to loosest.

4. In arithmetic, what is `TRUE*50`?
- [ ] `#VALUE!`
- [x] 50
- [ ] TRUE
> TRUE is coerced to 1 in arithmetic.

### Exercises

1. **Bonus flag** — Pay a bonus when files ≥ 400 and error rate ≤ 2%, or when the agent is a team lead (column G = "Lead"). Write the formula.
<details><summary>Solution</summary>

`=IF(OR(AND(B2>=400, D2<=0.02), G2="Lead"), "Bonus", "")`

</details>

2. **Safe rate** — Write an error-rate formula that shows a blank when Files is blank and 0 when Files is zero.
<details><summary>Solution</summary>

`=IF(ISBLANK(B2), "", IF(B2=0, 0, C2/B2))`

</details>

3. **Replace nested IFs** — Convert `=IF(H2="WY",0.0055,IF(H2="MT",0.006,IF(H2="ID",0.0052,"")))` to a cleaner form.
<details><summary>Solution</summary>

`=SWITCH(H2, "WY", 0.0055, "MT", 0.006, "ID", 0.0052, "")`, or better a rate table and `=XLOOKUP(H2, Rates[State], Rates[Rate], "")`.

</details>

### Interview Questions

**Q: When should you use IFERROR, and when is it dangerous?**
`IFERROR` is right when an error is an expected, legitimate state, such as a division where zero files is normal or an optional lookup where "no match" means "not applicable". It is dangerous as a blanket wrapper, because it also swallows `#REF!`, `#NAME?` and `#VALUE!`, which indicate the formula itself is broken. A report full of `IFERROR(..., 0)` can show zeros for weeks after a sheet was renamed. I use `IFNA` for lookups and leave arithmetic errors visible during development, adding `IFERROR` only at the presentation layer with a value that is clearly a placeholder.

**Q: What is the difference between IFS and nested IF, and which is better?**
Nested `IF` evaluates one condition and branches to another `IF`; `IFS` lists condition–value pairs and returns the first match. `IFS` is flatter and easier to read, but it has no built-in else (you add `TRUE, value`) and, unlike nested `IF`, every condition is evaluated even after a match, so it is marginally slower and errors in a later condition can surface. For more than four or five bands neither is ideal; a lookup table with an approximate-match `XLOOKUP` or `VLOOKUP(..., TRUE)` is easier to maintain because the business owner can edit the bands without touching formulas.

**Q: How do you write an "in list" test without a long chain of ORs?**
Compare against an array constant: `=OR(E2={"WY","MT","ID"})`, or test membership in a range with `=COUNTIF(States, E2)>0` or `=ISNUMBER(MATCH(E2, States, 0))`. The range-based forms are better in production because the list lives in a cell range that can be edited without opening the formula. In Microsoft 365 `=ISNUMBER(XMATCH(E2, States))` reads the cleanest.

## Text functions (LEFT/MID/TEXT/TEXTJOIN/TEXTSPLIT)

Half of data cleaning is string surgery: splitting a policy number from its prefix, trimming stray spaces from an exported name, rebuilding a proper-case address, or turning a date into the text a letter template expects. Excel's text functions handle all of it, and the newer Microsoft 365 functions (`TEXTSPLIT`, `TEXTBEFORE`, `TEXTAFTER`) remove most of the old `FIND`-and-`MID` gymnastics.

### Extracting pieces

```excel
=LEFT("WY-00417-2026", 2)        → WY
=RIGHT("WY-00417-2026", 4)       → 2026
=MID("WY-00417-2026", 4, 5)      → 00417   (start at character 4, take 5)
=LEN("WY-00417-2026")            → 13
```

`MID` is the workhorse when the piece you need is in the middle. To find where it starts, use `FIND` (case-sensitive) or `SEARCH` (case-insensitive, allows wildcards):

```excel
=FIND("-", A2)                              → 3 (position of the first dash)
=MID(A2, FIND("-", A2)+1, FIND("-", A2, FIND("-", A2)+1) - FIND("-", A2) - 1)
```

That second formula extracts the text between the first and second dash. It works, and you will meet it in inherited workbooks, but in Microsoft 365 you should write:

```excel
=TEXTBEFORE(A2, "-")             → WY
=TEXTAFTER(A2, "-", 2)           → 2026 (after the second dash)
=TEXTSPLIT(A2, "-")              → WY | 00417 | 2026 spilled across three cells
=INDEX(TEXTSPLIT(A2, "-"), 2)    → 00417
```

`TEXTSPLIT` also takes a row delimiter as its third argument, so `=TEXTSPLIT(A2, ",", ";")` turns `a,b;c,d` into a 2×2 block.

### Cleaning

| Function | Does | Example |
|---|---|---|
| `TRIM` | Removes leading/trailing spaces and collapses doubles | `TRIM("  Ali   Raza ")` → `Ali Raza` |
| `CLEAN` | Strips non-printing characters (codes 0–31) | line feeds from a PDF paste |
| `SUBSTITUTE` | Replaces text by content | `SUBSTITUTE(A2, CHAR(160), " ")` for non-breaking spaces |
| `REPLACE` | Replaces text by position | `REPLACE(A2, 1, 2, "MT")` |
| `UPPER` / `LOWER` / `PROPER` | Case conversion | `PROPER("stewart title")` → `Stewart Title` |
| `VALUE` / `NUMBERVALUE` | Text to number | `NUMBERVALUE("1.234,50", ",", ".")` for European formats |

`TRIM` does not remove `CHAR(160)`, the non-breaking space that web pages and Word documents love. The robust cleaning formula is:

```excel
=TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))
```

### Joining

```excel
=A2&" "&B2                                    first and last name
=CONCAT(A2:D2)                                joins a range, no separator
=TEXTJOIN(", ", TRUE, A2:D2)                  separator, TRUE skips empty cells
=TEXTJOIN(CHAR(10), TRUE, A2, B2, C2)         multi-line address (turn on Wrap Text)
```

`TEXTJOIN` with `TRUE` is what makes address blocks work when some records have no second line. The old `CONCATENATE` still exists but cannot take a range.

### TEXT: formatting a number as a string

`TEXT(value, format_code)` applies a number format and returns text. It is essential when a number must appear inside a sentence or a filename:

```excel
="Report for "&TEXT(A1, "mmmm yyyy")            → Report for September 2026
="Premium: "&TEXT(B2, "$#,##0.00")              → Premium: $1,034.00
=TEXT(B2, "0000")                                → 0417
=TEXT(TODAY(), "yyyy-mm-dd")&"_production.xlsx"  → 2026-09-16_production.xlsx
```

The format codes are the same ones you learned in the Formatting chapter. Remember the output is text: do not do arithmetic on it.

### Comparison and repetition

`EXACT(a, b)` compares case-sensitively (plain `=` ignores case). `REPT("★", 4)` repeats text, which is a quick in-cell bar chart. `CODE` and `CHAR` convert between characters and their codes, and `UNICHAR(9650)` gives the ▲ symbol for KPI arrows.

### Counting words and occurrences

There is no `COUNTWORDS`, but `LEN` and `SUBSTITUTE` combine:

```excel
=LEN(A2) - LEN(SUBSTITUTE(A2, "-", ""))          number of dashes in A2
=LEN(TRIM(A2)) - LEN(SUBSTITUTE(TRIM(A2), " ", "")) + 1   number of words
```

> **Interview note:** "How would you count how many times a character appears in a cell?" is asked in nearly every Excel test. The `LEN` minus `LEN(SUBSTITUTE)` pattern is the expected answer.

### Try It Yourself

```excel
' A2 holds: "  wy-00417-2026  " pasted from a PDF
B2: =TRIM(CLEAN(SUBSTITUTE(A2, CHAR(160), " ")))       → wy-00417-2026
C2: =UPPER(TEXTBEFORE(B2, "-"))                          → WY
D2: =INDEX(TEXTSPLIT(B2, "-"), 2)                        → 00417
E2: =TEXTAFTER(B2, "-", 2)                               → 2026
F2: =TEXTJOIN(" / ", TRUE, C2, D2, E2)                   → WY / 00417 / 2026
G2: ="File "&D2&" issued "&TEXT(DATE(E2,9,1), "d mmm yyyy")
```

### Quiz

1. What does `=MID("Stewart Title", 9, 5)` return?
- [x] Title
- [ ] Stewa
- [ ] wart
> MID starts at character 9 (the T of Title) and takes 5 characters.

2. Which function removes non-breaking spaces (`CHAR(160)`)?
- [ ] TRIM
- [ ] CLEAN
- [x] SUBSTITUTE
> TRIM only handles regular spaces and CLEAN removes codes 0–31; 160 needs SUBSTITUTE.

3. `=TEXT(1234.5, "#,##0")` returns what type?
- [ ] A number 1,235
- [x] The text "1,235"
- [ ] An error
> TEXT always returns a string, formatted per the code and rounded for display.

4. Which argument of TEXTJOIN skips empty cells?
- [ ] The first (delimiter)
- [x] The second (ignore_empty = TRUE)
- [ ] The last
> `TEXTJOIN(delimiter, ignore_empty, text1, …)`.

### Exercises

1. **Split full names** — Column A holds `Last, First` names. Produce First and Last in B and C using 365 functions, then again using only FIND/LEFT/MID.
<details><summary>Solution</summary>

365: `B2: =TRIM(TEXTAFTER(A2, ","))`, `C2: =TEXTBEFORE(A2, ",")`.
Legacy: `B2: =TRIM(MID(A2, FIND(",", A2)+1, 100))`, `C2: =LEFT(A2, FIND(",", A2)-1)`.

</details>

2. **Filename builder** — Build `WY_2026-09-16_ProductionReport.xlsx` from a state code in A1 and a date in A2.
<details><summary>Solution</summary>

`=A1&"_"&TEXT(A2, "yyyy-mm-dd")&"_ProductionReport.xlsx"`

</details>

3. **Count dashes** — Count how many segments a code like `WY-00417-2026-A` has.
<details><summary>Solution</summary>

`=LEN(A2)-LEN(SUBSTITUTE(A2,"-",""))+1`, or in 365 `=COLUMNS(TEXTSPLIT(A2,"-"))`.

</details>

### Interview Questions

**Q: A VLOOKUP fails even though the key visibly matches. What text issues do you check?**
Trailing or leading spaces, non-breaking spaces from web or Word pastes, numbers stored as text on one side and real numbers on the other, and invisible characters such as line feeds or zero-width spaces. I test with `=LEN(A2)` against the visible length, `=CODE(RIGHT(A2,1))` to identify the last character, and `=A2=B2` to compare directly. The fix is usually `TRIM(CLEAN(SUBSTITUTE(x, CHAR(160), " ")))` on the imported side, or `VALUE()` to align types. In Power Query the equivalent is `Text.Trim` and `Text.Clean` applied once at import so the lookups never see dirty keys.

**Q: How do TEXTSPLIT and Text to Columns differ, and when do you use each?**
Text to Columns is a one-time, static operation that overwrites cells to the right and must be repeated when data changes. `TEXTSPLIT` is a formula that spills its result and recalculates when the source changes, so it belongs in live reports. `TEXTSPLIT` also splits on multiple delimiters at once (pass an array like `{"-",","}`) and into rows as well as columns. For a one-off cleanup of a downloaded file I still use Text to Columns because it also converts types in its last step; for anything refreshed weekly I use `TEXTSPLIT` or Power Query's Split Column.

**Q: Why does `="Total: "&B2` show 1034.567 when B2 displays $1,034.57?**
Concatenation reads the stored value, not the formatted display. To carry the format into text you must apply it explicitly with `TEXT(B2, "$#,##0.00")`. The same applies to dates: `="Due "&A2` shows the serial number 46281 unless wrapped in `TEXT(A2, "d mmm yyyy")`. This is a frequent bug in mail-merge helper columns and report titles.

## Date & time functions (EOMONTH/NETWORKDAYS/DATEDIF)

Because dates are serial numbers, most date logic is arithmetic plus a handful of functions that know about months, weekends and holidays. This chapter covers the functions every production or HR report uses, and the conversion tricks for dates that arrive as text.

### Today, now and building dates

```excel
=TODAY()                        current date (volatile: recalculates on every change)
=NOW()                          current date and time
=DATE(2026, 9, 16)              build a date from parts
=DATE(2026, 13, 1)              → 1 Jan 2027 (months overflow correctly)
=TIME(9, 30, 0)                 09:30
=YEAR(A2), MONTH(A2), DAY(A2)   take a date apart
=WEEKDAY(A2, 2)                 1 = Monday … 7 = Sunday
=WEEKNUM(A2, 21)                ISO week number
```

`DATE` handling overflow is the key trick: `DATE(YEAR(A2), MONTH(A2)+1, 1)` is always the first day of next month, no matter the year boundary.

### End of month and month arithmetic

```excel
=EOMONTH(A2, 0)                 last day of A2's month
=EOMONTH(A2, -1)+1              first day of A2's month
=EOMONTH(A2, 2)                 last day of the month two months ahead
=EDATE(A2, 6)                   same day six months later (clips 31 → 30 where needed)
```

`EOMONTH` is how monthly reports find their period boundaries, and `EDATE` is how a 12-month policy expiry is computed from an effective date.

### Working days

```excel
=NETWORKDAYS(A2, B2)                          business days inclusive, Sat/Sun excluded
=NETWORKDAYS(A2, B2, Holidays!A2:A15)         also skip listed holidays
=NETWORKDAYS.INTL(A2, B2, "0000011")          custom weekend string (1 = weekend day, Mon..Sun)
=WORKDAY(A2, 5, Holidays!A2:A15)              the date 5 business days after A2
=WORKDAY.INTL(A2, 10, 11)                     weekend = Sunday only (code 11)
```

A turnaround-time SLA of "three business days" is `WORKDAY(received, 3, holidays)`. Keep the holiday list on its own sheet as a Table so it can be extended each year without touching formulas.

### Differences between dates

```excel
=B2-A2                          days (plain subtraction)
=DATEDIF(A2, B2, "Y")           whole years
=DATEDIF(A2, B2, "M")           whole months
=DATEDIF(A2, B2, "D")           days
=DATEDIF(A2, B2, "YM")          months ignoring years
=DATEDIF(A2, B2, "MD")          days ignoring months and years
=YEARFRAC(A2, B2)               fractional years (basis 0 = US 30/360 by default)
```

`DATEDIF` is undocumented (it is not in the function list and gives no tooltip) but has worked in every version since Excel 5 and is the standard way to compute age or tenure. It errors with `#NUM!` if the start date is after the end date. The `"MD"` unit has known quirks around month ends; for exact day counts subtract dates instead.

### Times and durations

Times are fractions, so 8 hours is `8/24`. To turn a duration into hours as a number: `=(B2-A2)*24`. To sum shifts that exceed 24 hours, format the total with `[h]:mm`. To round a time to the nearest 15 minutes: `=MROUND(A2, "0:15")`. `HOUR`, `MINUTE` and `SECOND` extract parts.

### Fixing text dates

Exports often deliver `20260916`, `16.09.2026` or `Sep 16 2026` as text. Options, in order of preference:

1. **Data → Text to Columns**, step 3, choose *Date* and the order (`DMY`, `YMD` …). Fast and permanent.
2. `=DATEVALUE(A2)` for strings Excel can already read (`16/09/2026` in a d/m/y locale).
3. Rebuild: `=DATE(LEFT(A2,4), MID(A2,5,2), RIGHT(A2,2))` for `yyyymmdd`.
4. `=--SUBSTITUTE(A2, ".", "/")` for dotted European dates (the double minus coerces text to a number).
5. Power Query: change the column type with **Using Locale** to name the source format.

After conversion the cells align right and `=ISNUMBER()` returns `TRUE`.

### Grouping dates for reports

| Need | Formula |
|---|---|
| Month label | `=TEXT(A2, "mmm yyyy")` (text) or `=EOMONTH(A2,0)` formatted `mmm yyyy` (sortable number) |
| Quarter | `="Q"&ROUNDUP(MONTH(A2)/3, 0)` |
| Fiscal year starting July | `=YEAR(A2)+(MONTH(A2)>=7)` |
| Week starting Monday | `=A2-WEEKDAY(A2, 2)+1` |

Prefer the numeric versions (`EOMONTH`, week-start date) for columns you will sort or pivot; text labels sort alphabetically, putting *Apr* before *Jan*.

> **Warning:** `TODAY()` and `NOW()` are volatile. A workbook with thousands of `TODAY()`-based formulas recalculates all of them on every edit. Put `=TODAY()` in one named cell (`ReportDate`) and reference that.

### Try It Yourself

```excel
' Turnaround-time report: A2 = received date, B2 = completed date, Holidays!A:A = holiday Table
C2: =NETWORKDAYS(A2, B2, Holidays[Date])-1           business days taken (0 = same day)
D2: =WORKDAY(A2, 3, Holidays[Date])                  SLA due date
E2: =IF(B2<=D2, "On time", "Late")
F2: =EOMONTH(A2, 0)                                  period bucket, format as mmm yyyy
G2: =DATEDIF(A2, TODAY(), "M")                       months old
```

### Quiz

1. `=EOMONTH(DATE(2026,2,10), 0)` returns?
- [ ] 1 Feb 2026
- [x] 28 Feb 2026
- [ ] 10 Mar 2026
> EOMONTH with 0 returns the last day of the same month; 2026 is not a leap year.

2. Which function returns a date N working days after a start date?
- [ ] NETWORKDAYS
- [x] WORKDAY
- [ ] EDATE
> WORKDAY steps forward by business days; NETWORKDAYS counts them between two dates.

3. Why should month labels for sorting be `EOMONTH(A2,0)` formatted as `mmm yyyy` rather than `TEXT(A2,"mmm yyyy")`?
- [x] The first is a number that sorts chronologically; the second is text that sorts alphabetically
- [ ] TEXT is volatile
- [ ] EOMONTH is faster
> Text labels put Apr before Jan; the numeric date sorts and groups correctly.

4. What does `DATEDIF(A2, B2, "YM")` return?
- [ ] Years and months as text
- [x] Whole months between the dates ignoring the years
- [ ] Years as a decimal
> "YM" gives the month component of the difference, used with "Y" to write "3 years, 4 months".

### Exercises

1. **Tenure text** — Given a start date in A2, produce `3 years, 4 months`.
<details><summary>Solution</summary>

`=DATEDIF(A2, TODAY(), "Y")&" years, "&DATEDIF(A2, TODAY(), "YM")&" months"`

</details>

2. **Convert yyyymmdd** — Convert the text `20260916` in A2 to a real date.
<details><summary>Solution</summary>

`=DATE(LEFT(A2,4), MID(A2,5,2), RIGHT(A2,2))`, then format as a date.

</details>

3. **Overtime** — Shift start in A2 and end in B2 (end may be after midnight, e.g. 22:00 to 06:00). Compute hours worked as a number.
<details><summary>Solution</summary>

`=MOD(B2-A2, 1)*24`. MOD handles the wrap past midnight because a negative fraction becomes the correct positive remainder.

</details>

### Interview Questions

**Q: How do you calculate business days between two dates, allowing for public holidays?**
`NETWORKDAYS(start, end, holidays)` counts weekdays inclusively and subtracts any dates in the holiday range that fall in the window. The holiday range should be a Table on its own sheet so HR can extend it each year. For non-standard weekends, such as a Friday–Saturday weekend for a Pakistan-based operation, `NETWORKDAYS.INTL` takes a weekend code or a seven-character mask like `"0000110"`. One subtlety: `NETWORKDAYS` is inclusive of both ends, so same-day completion returns 1, and I subtract 1 when the report defines turnaround as elapsed days.

**Q: What is DATEDIF and why is it not in the function list?**
It is a legacy function inherited from Lotus 1-2-3 that Microsoft kept for compatibility but never documented in the wizard. It returns the difference between two dates in whole years, months or days, with the combined units `YM`, `MD` and `YD`. It is the accepted way to compute age or tenure. Its quirks are that it errors when start is after end and the `MD` unit can misbehave at month ends, so for pure day counts I subtract dates directly and reserve `DATEDIF` for the year and month components.

**Q: How would you handle dates that Excel imported as text in a d/m/y versus m/d/y confusion?**
First I determine the source format by finding a value with a day above 12. Then I convert explicitly rather than relying on `DATEVALUE`, which uses the machine locale and silently swaps day and month when both are 12 or below. Text to Columns with the correct `DMY` or `MDY` order is the fastest fix in the grid, and in Power Query I use **Change Type → Using Locale** and choose the source culture. I then validate with a check such as `=MAX(A:A)` to confirm no dates landed in the future.

## Lookups: VLOOKUP → XLOOKUP → INDEX/MATCH

A lookup finds a key in one table and returns a related value from another. Rate by state, agent by ID, county by ZIP: nearly every report joins two lists this way. Excel has three generations of lookup functions, and interviewers ask about all of them because inherited workbooks still use the old ones.

### VLOOKUP

```excel
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
=VLOOKUP(A2, Rates!$A$2:$D$60, 3, FALSE)
```

`VLOOKUP` searches the **first column** of `table_array` for `A2` and returns the value from column `3` of that range. The fourth argument `FALSE` (or `0`) demands an exact match; `TRUE` (the default if omitted) does an approximate match on a sorted first column. Its limitations are why the alternatives exist:

- It can only look to the **right** of the key column.
- The column number is hard-coded, so inserting a column in the rate table silently returns the wrong field.
- Omitting the fourth argument gives approximate match, which returns plausible wrong answers on unsorted data.
- The key must be in the first column of the range.

### HLOOKUP

Same idea with the key in the first **row**: `=HLOOKUP("Q3", A1:E5, 3, FALSE)`. Rarely needed now; `XLOOKUP` handles both orientations.

### INDEX/MATCH

```excel
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
=INDEX(Rates!$C$2:$C$60, MATCH(A2, Rates!$A$2:$A$60, 0))
```

`MATCH` returns the position of `A2` in the key column (the `0` means exact); `INDEX` returns the item at that position from the return column. Because the two ranges are independent, the return column can be to the left, columns can be inserted safely, and only two columns are referenced instead of a whole block, which is faster on large sheets. Two-way lookup uses two `MATCH`es:

```excel
=INDEX($B$2:$F$40, MATCH($A45, $A$2:$A$40, 0), MATCH(B$44, $B$1:$F$1, 0))
```

That formula pulls a premium from a rate matrix by coverage band (rows) and rate type (columns).

### XLOOKUP (Excel 2021 and Microsoft 365)

```excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
=XLOOKUP(A2, Rates[State], Rates[Rate], "no rate")
```

`XLOOKUP` is exact-match by default, looks in any direction, returns a whole row or several columns if `return_array` is wider, and has a built-in not-found argument so `IFNA` is rarely needed. Its optional arguments:

| match_mode | Meaning |
|---|---|
| `0` | Exact match (default) |
| `-1` | Exact or next smaller: the "band" lookup for rate tables |
| `1` | Exact or next larger |
| `2` | Wildcard match with `*` and `?` |

| search_mode | Meaning |
|---|---|
| `1` | First to last (default) |
| `-1` | Last to first: returns the **most recent** entry |
| `2` / `-2` | Binary search on sorted data (fast on huge ranges) |

```excel
=XLOOKUP(B2, Bands[UpTo], Bands[Rate], , 1)          rate band: first band whose UpTo ≥ amount
=XLOOKUP(A2, Log[File], Log[Status], "", 0, -1)       latest status for a file
=XLOOKUP(A2, Rates[State], Rates[[Rate]:[Fee]])       returns two columns, spills
=XLOOKUP(1, (Rates[State]=A2)*(Rates[Type]=B2), Rates[Rate])   multi-criteria
```

The multi-criteria form multiplies two boolean arrays; the product is `1` only where both match, so looking up `1` finds that row. Approximate modes do **not** require sorted data, unlike `VLOOKUP(…, TRUE)`.

### Approximate matches for rate bands

Rate manuals define bands: up to $50,000 pay X, up to $100,000 pay Y. With the band **lower bounds** sorted ascending in column A:

```excel
=VLOOKUP(B2, Bands, 2, TRUE)                         legacy
=XLOOKUP(B2, Bands[From], Bands[Rate], , -1)         modern, no sort needed
```

`-1` returns the exact match or the next smaller key, which is exactly "the band this amount falls in".

### Which one to use

| Situation | Choice |
|---|---|
| Microsoft 365 or 2021 | `XLOOKUP` |
| Must work in Excel 2016/2019 or Google Sheets legacy | `INDEX/MATCH` |
| Quick one-off on a fixed table | `VLOOKUP` is fine |
| Need most recent match | `XLOOKUP` with `search_mode -1` |
| Two-way matrix | `INDEX` with two `MATCH`es or `XLOOKUP` nested in `XLOOKUP` |

Nested `XLOOKUP` for a matrix: `=XLOOKUP(B$44, $B$1:$F$1, XLOOKUP($A45, $A$2:$A$40, $B$2:$F$40))`. The inner one returns a whole row; the outer picks the column.

> **Interview note:** "Why INDEX/MATCH over VLOOKUP?" is the most common Excel interview question of the last decade. Answer with the four limitations above, then add that XLOOKUP resolves all of them if the version allows.

### Try It Yourself

```excel
' Rates table (Ctrl+T, named Rates): State | Rate | Fee
' Production sheet: A2 = state code, B2 = coverage
C2: =XLOOKUP(A2, Rates[State], Rates[Rate], "no rate")
D2: =INDEX(Rates[Rate], MATCH(A2, Rates[State], 0))
E2: =VLOOKUP(A2, Rates, 2, FALSE)
F2: =ROUND(ROUNDUP(B2/1000,0)*C2, 2)
' Bands table: From | Rate
G2: =XLOOKUP(B2, Bands[From], Bands[Rate], , -1)
```

### Quiz

1. `=VLOOKUP("WY", A2:D60, 2)` on unsorted data returns what?
- [ ] Always the exact WY row
- [x] Possibly a wrong row, because the omitted fourth argument means approximate match
- [ ] `#N/A`
> Without FALSE, VLOOKUP assumes a sorted first column and returns the last value ≤ the key.

2. Which XLOOKUP match_mode implements "exact or next smaller"?
- [x] -1
- [ ] 1
- [ ] 2
> -1 is the band lookup; 1 is next larger; 2 is wildcard.

3. What does MATCH return?
- [ ] The matched value
- [x] The position of the match in the range
- [ ] TRUE or FALSE
> MATCH returns an index number that INDEX then uses.

4. How do you return the most recent status for a file with XLOOKUP?
- [ ] Sort the log descending first
- [x] Set search_mode to -1
- [ ] Use match_mode 1
> search_mode -1 searches from the last row upward, returning the latest entry without sorting.

### Exercises

1. **Left lookup** — The ID is in column C and the name you need is in column A. Return the name for the ID in H2 using INDEX/MATCH and again with XLOOKUP.
<details><summary>Solution</summary>

`=INDEX(A:A, MATCH(H2, C:C, 0))` and `=XLOOKUP(H2, C:C, A:A, "not found")`.

</details>

2. **Two-criteria rate** — Rates depend on State and PolicyType. Look up the rate for A2 and B2.
<details><summary>Solution</summary>

`=XLOOKUP(1, (Rates[State]=A2)*(Rates[Type]=B2), Rates[Rate], "n/a")`. Legacy: add a helper column `=[@State]&"|"&[@Type]` in Rates and look up `A2&"|"&B2`.

</details>

3. **Return a whole record** — Return State, Rate and Fee for the code in A2 in one formula.
<details><summary>Solution</summary>

`=XLOOKUP(A2, Rates[State], Rates[[State]:[Fee]])`, which spills three cells to the right.

</details>

### Interview Questions

**Q: Why is INDEX/MATCH preferred over VLOOKUP?**
`VLOOKUP` can only return columns to the right of the key, hard-codes the column number so inserting a column breaks it, references the whole block so it recalculates more, and defaults to approximate match if the last argument is forgotten. `INDEX/MATCH` separates the key column from the return column, so it looks in any direction, survives column insertions, and references only two columns. In a rate-matrix workbook where columns are added every time a new fee is introduced, `INDEX/MATCH` or `XLOOKUP` is the only maintainable choice. If the audience is on Microsoft 365, `XLOOKUP` is my default because it is exact by default and has `if_not_found` built in.

**Q: How does XLOOKUP handle approximate matches differently from VLOOKUP?**
`VLOOKUP(…, TRUE)` performs a binary search and therefore requires the key column sorted ascending; on unsorted data it returns wrong values without an error. `XLOOKUP` with `match_mode` `-1` or `1` does a linear scan for the next smaller or larger key and does not require sorting, though you can request binary search with `search_mode` `2` or `-2` for speed on sorted data. The practical consequence is that a band table can be maintained in any order, and "next larger" is available, which `VLOOKUP` cannot do at all.

**Q: How do you do a lookup with multiple criteria?**
Three approaches. In Microsoft 365, `XLOOKUP(1, (range1=a)*(range2=b), return)` multiplies boolean arrays so only the row matching both yields 1. In older versions, `INDEX(return, MATCH(1, (range1=a)*(range2=b), 0))` entered with `Ctrl+Shift+Enter`. The most robust for large data is a helper key column that concatenates the criteria with a separator, then a plain exact lookup on it; it is fastest, works everywhere, and the key is visible for debugging. For aggregation rather than a single value, `SUMIFS` is often the right tool instead of a lookup.

## SUMIFS/COUNTIFS/AVERAGEIFS & SUMPRODUCT

Conditional aggregation answers the questions managers actually ask: how many files did Wyoming complete in August, what is the average turnaround for agent Sana, what is the total premium for policies over $250,000. The `*IFS` family handles multiple criteria directly, and `SUMPRODUCT` covers the cases they cannot.

### SUMIF and COUNTIF (single condition)

```excel
=SUMIF(range, criteria, [sum_range])
=SUMIF(C2:C500, "Wyoming", D2:D500)       files where state is Wyoming
=COUNTIF(C2:C500, "Wyoming")              number of Wyoming rows
=COUNTIF(D2:D500, ">400")                 rows with more than 400 files
=AVERAGEIF(C2:C500, "Wyoming", E2:E500)
```

Criteria are text strings. Comparisons go inside quotes and cell references join with `&`: `">"&F1`. Wildcards work: `"WY*"` matches anything starting with WY, `"?"` matches one character.

### SUMIFS, COUNTIFS, AVERAGEIFS (multiple conditions)

The argument order changes: the sum range comes **first**, followed by pairs of criteria range and criteria.

```excel
=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], …)
=SUMIFS(D:D, C:C, "Wyoming", B:B, ">="&DATE(2026,8,1), B:B, "<="&EOMONTH(DATE(2026,8,1),0))
=COUNTIFS(C:C, "Wyoming", E:E, "Late")
=AVERAGEIFS(F:F, A:A, "Sana", B:B, ">="&$H$1)
=MAXIFS(D:D, C:C, "Wyoming")     largest single day (Excel 2019+)
=MINIFS(D:D, C:C, "Wyoming")
```

All criteria are combined with AND. Every criteria range must be the same size as the sum range. A date window is two criteria on the same column, as in the second example, which is the standard monthly-report formula.

### Building a summary table

With states down column A and months across row 1 (as first-of-month dates), one formula fills the grid:

```excel
B2: =SUMIFS(Prod[Files], Prod[State], $A2, Prod[Date], ">="&B$1, Prod[Date], "<="&EOMONTH(B$1,0))
```

Mixed references lock the state to column A and the month to row 1. Copy across and down and the whole report is done. Because the ranges are Table columns, new rows are included automatically.

### OR logic with SUMIFS

`SUMIFS` is AND-only. For "Wyoming or Montana" wrap it in `SUM` with an array constant:

```excel
=SUM(SUMIFS(D:D, C:C, {"Wyoming","Montana"}))
```

`SUMIFS` returns one value per array element and `SUM` adds them. For a criteria list in cells, use `SUMPRODUCT(SUMIFS(D:D, C:C, H2:H4))`.

### SUMPRODUCT

`SUMPRODUCT` multiplies arrays element-wise and sums the products. Before dynamic arrays it was the only way to do array logic without `Ctrl+Shift+Enter`, and it still does things `SUMIFS` cannot.

```excel
=SUMPRODUCT(B2:B500, C2:C500)                     Σ quantity × price, a weighted total
=SUMPRODUCT((C2:C500="Wyoming")*(D2:D500))        same as SUMIF, written as arrays
=SUMPRODUCT((C2:C500="Wyoming")*(E2:E500="Late")) count with two conditions
=SUMPRODUCT((MONTH(B2:B500)=8)*D2:D500)           files in August: a function on the criteria range
=SUMPRODUCT(--(LEN(A2:A500)>10))                  count of long codes
```

The last two are the point: `SUMIFS` cannot apply a function such as `MONTH` or `LEN` to its criteria range, while `SUMPRODUCT` can. The double negative `--` converts booleans to numbers when there is nothing to multiply them by. Weighted averages are `=SUMPRODUCT(weights, values)/SUM(weights)`, which is how a team error rate weighted by volume is written in one cell.

### Performance notes

- `SUMIFS` on whole columns (`D:D`) is fine because Excel limits the scan to the used range. `SUMPRODUCT` on whole columns is **not**: it evaluates all 1,048,576 rows. Use Table columns or bounded ranges.
- Ten thousand `SUMIFS` cells over 100,000 rows will feel slow. At that scale a PivotTable or Power Query group-by is the right tool, and the Expert level explains why.

| Need | Function |
|---|---|
| Count rows matching conditions | `COUNTIFS` |
| Sum with AND conditions | `SUMIFS` |
| Sum with OR on one column | `SUM(SUMIFS(…, {list}))` |
| Condition needs a function (MONTH, LEN) | `SUMPRODUCT` |
| Weighted total or average | `SUMPRODUCT` |
| Largest matching value | `MAXIFS` |

> **Tip:** When a `SUMIFS` returns 0 unexpectedly, check for trailing spaces in the criteria column and for numbers stored as text. `"400"` in a text cell does not match the criterion `">300"` because text is never greater than a number.

### Try It Yourself

```excel
' Prod table: Date | State | Agent | Files | Errors | Status
' Summary sheet: A2:A6 states, B1:G1 first-of-month dates
B2: =SUMIFS(Prod[Files], Prod[State], $A2, Prod[Date], ">="&B$1, Prod[Date], "<="&EOMONTH(B$1,0))
' Team error rate, volume-weighted:
=SUMPRODUCT(Prod[Errors])/SUMPRODUCT(Prod[Files])
' Late Wyoming files in August:
=COUNTIFS(Prod[State], "Wyoming", Prod[Status], "Late", Prod[Date], ">="&DATE(2026,8,1), Prod[Date], "<"&DATE(2026,9,1))
' Files by weekday (needs a function on the criteria range):
=SUMPRODUCT((WEEKDAY(Prod[Date],2)=1)*Prod[Files])
```

### Quiz

1. In SUMIFS, where does the sum range go?
- [x] First argument
- [ ] Last argument
- [ ] Anywhere, Excel detects it
> `SUMIFS(sum_range, criteria_range1, criteria1, …)`, unlike SUMIF where it is last.

2. How do you write "greater than the value in F1" as a criterion?
- [ ] `>F1`
- [x] `">"&F1`
- [ ] `"> F1"`
> The operator is a string joined to the cell value with `&`.

3. Which formula counts files processed in August without a helper column?
- [ ] `=COUNTIFS(B:B, MONTH(B:B)=8)`
- [x] `=SUMPRODUCT(--(MONTH(B2:B500)=8))`
- [ ] `=COUNTIF(B:B, "August")`
> COUNTIFS cannot apply a function to its criteria range; SUMPRODUCT can.

4. `=SUM(SUMIFS(D:D, C:C, {"WY","MT"}))` implements which logic?
- [ ] WY AND MT
- [x] WY OR MT
- [ ] WY minus MT
> SUMIFS returns one sum per array element and SUM adds them together.

### Exercises

1. **Monthly matrix** — Build a state-by-month files matrix from a Table `Prod` with a single fillable formula.
<details><summary>Solution</summary>

With states in `A2:A10` and month-start dates in `B1:M1`: `=SUMIFS(Prod[Files], Prod[State], $A2, Prod[Date], ">="&B$1, Prod[Date], "<="&EOMONTH(B$1,0))`.

</details>

2. **Weighted error rate per state** — For the state in A2, compute total errors ÷ total files.
<details><summary>Solution</summary>

`=IFERROR(SUMIFS(Prod[Errors], Prod[State], A2)/SUMIFS(Prod[Files], Prod[State], A2), 0)`

</details>

3. **Count long-running files** — Count files whose turnaround (Completed − Received) exceeds 5 days, without adding a column.
<details><summary>Solution</summary>

`=SUMPRODUCT(--((Prod[Completed]-Prod[Received])>5))`

</details>

### Interview Questions

**Q: When would you use SUMPRODUCT instead of SUMIFS?**
When a criterion needs a calculation on the range, such as `MONTH(dates)=8` or `LEN(code)>10`, because `SUMIFS` only compares raw cell values to a criterion string. Also for weighted sums and weighted averages, where the products of two columns must be totalled, and for OR logic across different columns. `SUMIFS` is faster and handles whole-column references gracefully, so it is my default for plain conditions, and I switch to `SUMPRODUCT` with bounded ranges only when the logic requires it. In Microsoft 365, `SUM` with array expressions or `FILTER` can replace many `SUMPRODUCT` uses.

**Q: Explain how a volume-weighted average differs from a simple average and how you compute it in Excel.**
A simple average of per-agent error rates treats an agent with 50 files the same as one with 500. The weighted average divides total errors by total files, so high-volume agents count more, and it equals the team's true rate. In Excel that is `SUMPRODUCT(rates, files)/SUM(files)` if you only have rates, or simply `SUM(errors)/SUM(files)` if you have the raw counts. In a QA report for a 20-agent BPO team the two numbers can differ by a full percentage point, which changes whether the team hits its SLA.

**Q: Your SUMIFS is returning zero although you can see matching rows. What do you check?**
First, type mismatches: numeric criteria against numbers stored as text, or dates stored as text. Second, invisible characters in the criteria column, tested with `LEN` or a direct `=` comparison. Third, the criterion string itself: a date criterion must be built as `">="&DATE(...)` not typed as `">=1/8/2026"`, which is locale-dependent. Fourth, range sizes: every criteria range must be identical in size to the sum range or the result is `#VALUE!`, but a range that is offset by a row will silently mis-align. I put the criteria in cells and reference them so I can inspect exactly what is being compared.

## Data validation & dropdowns

Data validation restricts what can be typed into a cell. It is the cheapest form of error prevention: a dropdown of valid state codes stops `Wyomming` from ever entering the system, and a date rule stops `2062` typos before they reach the monthly report. This chapter shows how to build validation rules, dependent dropdowns and the input messages that make a workbook self-documenting for the agents who fill it in.

### The dialog

Select the cells, then **Data → Data Validation** (`Alt+A, V, V`). The **Settings** tab defines the rule, **Input Message** shows a tooltip when the cell is selected, and **Error Alert** controls what happens on invalid entry.

| Allow | Use |
|---|---|
| Whole number / Decimal | Between, greater than … |
| List | Dropdown from a range or typed values |
| Date / Time | Between two dates, after today |
| Text length | Maximum characters (e.g. 4 for a code) |
| Custom | Any formula that returns TRUE for valid input |

Error alert styles: **Stop** rejects the entry; **Warning** asks; **Information** just notes it. Use **Stop** for keyed fields such as state codes and **Warning** for values that are unusual but possible.

### Dropdown lists

For a short fixed list type it in the Source box: `Received,In progress,QA,Complete`. For anything maintained, point at a range, ideally a Table column, so additions appear automatically:

```excel
Source: =Lists[State]
```

Validation cannot reference a structured reference directly in older versions; the workaround is a named range. Define the name `States` as `=Lists[State]` (**Formulas → Name Manager**) and use `=States` as the source. In Microsoft 365, `=Lists[State]` in the Source box is refused, but `=INDIRECT("Lists[State]")` or the named range works everywhere.

Since 2022, Microsoft 365 dropdowns include **AutoComplete**: typing filters the list. Users on older versions get the plain list.

### Dependent (cascading) dropdowns

Pick a state in `A2`, then choose from only that state's counties in `B2`. Two approaches:

1. **Named ranges by state** (classic): create a named range per state (`Wyoming`, `Montana`) holding its counties, then the county cell's source is `=INDIRECT(A2)`. Names cannot contain spaces, so `SUBSTITUTE(A2, " ", "_")` is often needed.
2. **Dynamic arrays** (365): on a helper sheet put `=SORT(FILTER(Counties[County], Counties[State]=Input!A2))` in `H1`, then set the dropdown source to `=$H$1#`. The `#` is the spill operator and means "the whole spilled range". When the state changes, the list changes.

The second method is easier to maintain because all counties sit in one Table.

### Custom formula rules

The Custom option accepts any formula relative to the first selected cell:

```excel
=AND(LEN(A2)=8, ISNUMBER(--MID(A2,4,5)))       code like WY-00417: 8 chars, digits at 4..8
=COUNTIF($A$2:$A$500, A2)=1                       no duplicates in the column
=A2<=TODAY()                                      no future dates
=B2>=A2                                           completed date on or after received
=ISNUMBER(MATCH(A2, States, 0))                   must exist in the master list
=AND(A2>=0, A2=INT(A2))                           non-negative whole number
```

A custom rule is evaluated like a formula filled down the selection, so use relative references for the row and absolute references for the fixed list.

### Circling invalid data

Validation only checks new entries. For existing data, **Data → Data Validation → Circle Invalid Data** draws red ovals around every cell that fails its rule, which is how you audit an imported sheet after applying rules retroactively. **Clear Validation Circles** removes them.

### Limitations you must know

- Paste overwrites validation: pasting a value into a validated cell replaces the rule with the source cell's rule (usually none). Protect the sheet or educate users.
- Validation does not fire on values entered by formulas or by VBA.
- The dropdown shows at most the list; it cannot search by substring in older versions.
- Custom rules that reference other sheets work in Excel 2010+; some older versions refuse them.

### Protecting the structure

Combine validation with **Review → Protect Sheet**. First unlock the input cells (`Ctrl+1` → Protection → untick *Locked*), then protect the sheet with a password. Agents can type only in the unlocked cells, and pasting over the validation is blocked because paste onto locked cells fails.

> **Warning:** A dropdown sourced from a plain range such as `Lists!A2:A20` stops at row 20 forever. Always point at a Table column or a dynamic named range so new codes appear without editing every rule.

### Try It Yourself

```excel
' Setup sheet "Lists": Table Lists with columns State, County (Ctrl+T)
' Named range (Formulas → Name Manager):  States  = =Lists[State]
' Input!A2  Data Validation → List → Source:  =States
' Helper Input!H1 (365):  =SORT(UNIQUE(FILTER(Lists[County], Lists[State]=A2)))
' Input!B2  Data Validation → List → Source:  =$H$1#
' Input!C2  Custom:  =AND(C2<=TODAY(), C2>=DATE(2020,1,1))
' Input!D2  Custom:  =COUNTIF($D$2:$D$1000, D2)=1
' Then Review → Protect Sheet after unlocking A2:D1000
```

### Quiz

1. Which validation option accepts any formula returning TRUE?
- [ ] List
- [x] Custom
- [ ] Whole number
> Custom evaluates a formula per cell and rejects entries where it is FALSE.

2. What does `=$H$1#` refer to in a dropdown source?
- [x] The entire spilled range starting at H1
- [ ] Only cell H1
- [ ] A comment on H1
> The `#` spill operator references whatever a dynamic array formula in H1 has spilled.

3. A user pastes a value into a validated cell. What happens?
- [ ] The paste is rejected
- [x] The value and the source cell's validation replace the rule
- [ ] Excel shows the error alert
> Paste is not checked by validation; only typed entries trigger it. Sheet protection prevents this.

4. Which rule prevents duplicate IDs in `A2:A500`?
- [ ] `=UNIQUE(A2:A500)`
- [x] `=COUNTIF($A$2:$A$500, A2)=1`
- [ ] `=A2<>A1`
> The count of the current value in the whole column must be exactly one.

### Exercises

1. **Status dropdown with alert** — Restrict `F2:F1000` to four statuses and show an input message explaining them.
<details><summary>Solution</summary>

Data Validation → List → Source `Received,In progress,QA,Complete`; Input Message tab: title *Status*, message *Pick the current stage; QA means awaiting quality check*. Error Alert: Stop.

</details>

2. **Cascading county list** — Build a state → county dependent dropdown in Microsoft 365.
<details><summary>Solution</summary>

Counties Table with State and County. Helper `=SORT(FILTER(Counties[County], Counties[State]=A2, "none"))` in `H1`. County cell validation List → `=$H$1#`.

</details>

3. **Audit an import** — Apply a rule that dates in column B must be ≤ today and then find the offending rows in an existing sheet.
<details><summary>Solution</summary>

Select `B2:B5000`, Data Validation → Date → less than or equal to `=TODAY()`. Then Data → Data Validation → **Circle Invalid Data** to highlight rows that violate it.

</details>

### Interview Questions

**Q: How would you design an input sheet for 20 agents so that the weekly report never receives bad data?**
Convert the input area to a Table so it grows cleanly, then apply validation per column: dropdowns for state, agent and status sourced from Tables on a Lists sheet via named ranges; date rules bounded to the current year and not after today; whole-number rules for counts; and a custom `COUNTIF` rule to reject duplicate file numbers. I add input messages so the rules are self-explanatory, unlock only the input columns and protect the sheet so pasting cannot bypass validation. Finally I add a validation-summary row using `COUNTIFS` that turns red when anything is out of range, because validation alone does not catch data that arrived by paste or import.

**Q: How do dependent dropdowns work and what are the trade-offs of each approach?**
The classic approach names a range per parent value and uses `=INDIRECT(A2)` as the child list's source. It works in every Excel version but needs one named range per parent, names cannot contain spaces, and `INDIRECT` is volatile. The dynamic-array approach keeps all pairs in one Table, uses `FILTER` in a helper cell and points validation at the spill with `#`. It is easier to maintain and non-volatile, but requires Microsoft 365 or Excel 2021, and the helper cells must be somewhere that will not be overwritten. For client workbooks I ask which Excel version the users have before choosing.

**Q: Does data validation guarantee clean data?**
No. It checks typed entries only: pasted values, values written by formulas, Power Query loads and VBA all bypass it, and a user can copy a cell without validation over one with it. It is a first line of defence for human entry. For guaranteed quality I add a check layer: formulas that count invalid rows, conditional formatting that highlights them, Circle Invalid Data for audits, and in Power Query a step that removes or flags rows failing the rules before the data reaches the report.

# LEVEL: Advanced

## Dynamic arrays (FILTER/UNIQUE/SORT/SEQUENCE)

In September 2018 Microsoft rewrote Excel's calculation engine so that any formula can return an array that **spills** into neighbouring cells. Before that, a formula returned one value unless you pressed `Ctrl+Shift+Enter` and pre-selected the output range. Dynamic arrays (Microsoft 365 and Excel 2021) turn many report-building tasks from "PivotTable, copy, paste values" into a single live formula.

### Spilling

Type `=A2:A10*2` in `C2` and press Enter. Nine results appear in `C2:C10` with a thin blue border. Only `C2` holds the formula; the rest are ghost cells that show `=C2:C10` greyed out in the formula bar. If anything is in the way, the formula returns `#SPILL!` and a warning triangle explains what blocks it. Refer to the whole spill from elsewhere with the spill operator: `=SUM(C2#)`.

### The core functions

```excel
=FILTER(array, include, [if_empty])
=FILTER(Prod, Prod[State]="Wyoming", "no rows")            all Wyoming rows
=FILTER(Prod[File], (Prod[State]="WY")*(Prod[Status]="Late"))   AND
=FILTER(Prod[File], (Prod[State]="WY")+(Prod[State]="MT"))      OR

=UNIQUE(Prod[Agent])                                       distinct agents, in order of first appearance
=UNIQUE(Prod[Agent], , TRUE)                               values that occur exactly once
=SORT(UNIQUE(Prod[State]))                                 sorted distinct list
=SORT(Prod, 4, -1)                                         sort by column 4 descending
=SORTBY(Prod[Agent], Prod[Files], -1)                      sort one column by another

=SEQUENCE(12)                                              1..12 down a column
=SEQUENCE(1, 12)                                           1..12 across a row
=SEQUENCE(12, 1, DATE(2026,1,1), 0)                        needs EDATE for months, see below
=EDATE(DATE(2026,1,1), SEQUENCE(12, 1, 0))                 first of each month for a year

=RANDARRAY(5, 1, 1, 100, TRUE)                             5 random integers
```

Multiplying boolean arrays gives AND; adding gives OR. `FILTER`'s third argument avoids `#CALC!` when nothing matches.

### A live summary without a PivotTable

```excel
A2: =SORT(UNIQUE(Prod[State]))
B2: =SUMIFS(Prod[Files], Prod[State], A2#)
C2: =COUNTIFS(Prod[State], A2#)
D2: =B2#/SUM(B2#)
```

`A2#` feeds every state into `SUMIFS`, which returns one value per state and spills alongside. When a new state appears in the Table, the list and every column extend automatically. This is the pattern for report pages that must never be "refreshed": the formulas *are* the refresh.

### Newer array functions (365, 2022 onward)

| Function | Purpose |
|---|---|
| `TAKE(array, rows, [cols])` | First or last N rows: `TAKE(SORT(…,2,-1), 5)` is a top-5 |
| `DROP(array, rows)` | Remove header rows |
| `CHOOSECOLS(array, 1, 3)` / `CHOOSEROWS` | Pick columns by index |
| `HSTACK` / `VSTACK` | Join arrays side by side or on top of each other |
| `TOCOL` / `TOROW` | Flatten a 2-D range to one column or row |
| `WRAPROWS` / `WRAPCOLS` | Reshape a list into a grid |
| `EXPAND` | Pad an array to a size |
| `GROUPBY` / `PIVOTBY` | Formula-based PivotTable (2024) |

```excel
=TAKE(SORTBY(HSTACK(Prod[Agent], Prod[Files]), Prod[Files], -1), 5)     top 5 agents
=VSTACK(Jan[#All], Feb[#All], Mar[#All])                                  append quarter
=GROUPBY(Prod[State], Prod[Files], SUM)                                   files per state
=PIVOTBY(Prod[State], Prod[Month], Prod[Files], SUM)                      state × month
```

`GROUPBY` and `PIVOTBY` are the newest additions and are the first time Excel offers a formula-based pivot that recalculates live. They are available only in current-channel Microsoft 365.

### Implicit intersection and the `@`

Old formulas that returned arrays into a single cell were resolved by *implicit intersection*: Excel picked the value on the same row. In dynamic-array Excel that behaviour is written explicitly with `@`: `=@A2:A10`. When you open a legacy workbook, Excel inserts `@` where needed to preserve results. If you see `@` appearing in a formula you did not write, that is why, and removing it will make the formula spill.

### Rules of the road

- Spilled ranges cannot go inside an Excel Table; put the formula outside the Table or use a helper sheet.
- Formulas returning arrays in old Excel show as `{=…}` (CSE arrays) and cannot spill; recipients on Excel 2016 see `#NAME?` for `FILTER` and friends.
- Whole-column references such as `A:A` inside `FILTER` are slow: a Table column bounds the work.
- Charts can reference a spilled range via a named range (`=Sheet1!$A$2#`), which makes the chart grow with the data.

> **Tip:** When a spill returns `#SPILL!`, click the warning and choose *Select Obstructing Cells*. Nine times out of ten it is a stray value someone typed far below the formula.

### Try It Yourself

```excel
' Live "top states" block from Table Prod (Date | State | Agent | Files | Errors | Status)
A2: =SORT(UNIQUE(Prod[State]))
B2: =SUMIFS(Prod[Files], Prod[State], A2#)
C2: =SUMIFS(Prod[Errors], Prod[State], A2#)/B2#
' Top 5 agents by files, two columns:
E2: =TAKE(SORTBY(HSTACK(Prod[Agent], Prod[Files]), Prod[Files], -1), 5)
' Late Wyoming files list with an empty-state message:
H2: =FILTER(Prod[File], (Prod[State]="WY")*(Prod[Status]="Late"), "none late")
' Twelve month-start dates for report headers:
=EDATE(DATE(2026,1,1), SEQUENCE(1,12,0))
```

### Quiz

1. What does `A2#` refer to?
- [x] The whole range spilled by the formula in A2
- [ ] Cell A2 only
- [ ] A comment on A2
> The spill operator returns the dynamic range, however large it currently is.

2. Which expression gives OR logic inside FILTER's include argument?
- [ ] `(a)*(b)`
- [x] `(a)+(b)`
- [ ] `OR(a, b)`
> Adding boolean arrays yields non-zero where either is TRUE; OR() would collapse to a single value.

3. Why might a colleague on Excel 2016 see `#NAME?` where you see a list?
- [ ] Their file is corrupted
- [x] FILTER and UNIQUE do not exist in Excel 2016
- [ ] They have calculation set to manual
> Dynamic-array functions require Microsoft 365 or Excel 2021.

4. Which function returns the first five rows of an array?
- [ ] CHOOSEROWS(array, 5)
- [x] TAKE(array, 5)
- [ ] DROP(array, 5)
> TAKE keeps N rows from the top (or bottom with a negative N); DROP removes them.

### Exercises

1. **Distinct sorted agents with counts** — Produce a two-column list of agents and number of files each, sorted by files descending.
<details><summary>Solution</summary>

`=SORT(HSTACK(UNIQUE(Prod[Agent]), COUNTIFS(Prod[Agent], UNIQUE(Prod[Agent]))), 2, -1)` or with `GROUPBY(Prod[Agent], Prod[Files], COUNT)` in current 365.

</details>

2. **Late files per state with fallback** — List the states that have at least one late file; show "All on time" if none.
<details><summary>Solution</summary>

`=IFERROR(UNIQUE(FILTER(Prod[State], Prod[Status]="Late")), "All on time")` or pass `"All on time"` as FILTER's third argument.

</details>

3. **Calendar row** — Generate the 31 dates of a chosen month in `B1` across a row, for a daily attendance grid.
<details><summary>Solution</summary>

`=SEQUENCE(1, DAY(EOMONTH(B1,0)), B1, 1)` returns exactly the days in that month starting from its first day (put the month's first date in B1).

</details>

### Interview Questions

**Q: What changed with dynamic arrays, and what is implicit intersection?**
Before 2018, a formula could only return a single value to its cell unless entered as a CSE array formula into a pre-selected range. When a formula referenced a multi-cell range in a single-cell context, Excel silently applied implicit intersection: it picked the element on the same row or column. The dynamic-array engine makes every formula array-capable; results spill into adjacent cells and are referenced with `#`. To keep old workbooks behaving identically, Excel now writes implicit intersection explicitly as the `@` operator. The practical impact is that functions like `FILTER`, `UNIQUE`, `SORT` and `SEQUENCE` can build live lists and summary tables that previously needed PivotTables or VBA.

**Q: How would you build a top-10 list that updates automatically as data is added?**
With the source as a Table, `=TAKE(SORTBY(HSTACK(Prod[Agent], Prod[Files]), Prod[Files], -1), 10)` returns the ten highest rows and spills two columns. Because the Table grows and the formula references its columns, new rows are included with no edits. If ties matter, I use `SORTBY` with two sort keys, and if agents repeat across days, I first aggregate with `GROUPBY` or a `UNIQUE` plus `SUMIFS` block and then take the top ten from that. On Excel 2019 or earlier the same result needs `LARGE` with `INDEX/MATCH` and a helper column to break ties.

**Q: What are the limitations of spilled ranges in production workbooks?**
They cannot live inside Tables, they break when any cell in their path is occupied, they are invisible to users on older Excel versions who will see `#NAME?`, and a spilled range cannot be referenced directly by a chart series (a named range is needed). Large `FILTER` formulas over unbounded ranges are slow, and because the output size changes, anything positioned below a spill can be overwritten in appearance. My rule is to place spills on dedicated calculation sheets with nothing beneath them, reference them via `#` or named ranges, and confirm the client's Excel version before shipping.

## LET & LAMBDA

Long formulas repeat sub-expressions, which makes them slow and hard to read. `LET` names intermediate values inside a formula, and `LAMBDA` turns a formula into a reusable function with its own name. Together they are the closest Excel gets to programming without VBA, and they are available in Microsoft 365 (LET since 2020, LAMBDA since 2021).

### LET

```excel
=LET(name1, value1, [name2, value2, …], calculation)
```

Consider a premium formula that repeats the units calculation:

```excel
=IF(ROUNDUP(B2/1000,0)*C2 > 5000, ROUNDUP(B2/1000,0)*C2*0.9, ROUNDUP(B2/1000,0)*C2)
```

With `LET`:

```excel
=LET(
   units,   ROUNDUP(B2/1000, 0),
   premium, units * C2,
   IF(premium > 5000, premium * 0.9, premium)
)
```

Excel evaluates `units` once and `premium` once. The formula is faster, and a reader can follow it top to bottom. Names can reference earlier names. `Alt+Enter` inserts line breaks in the formula bar, which Excel ignores when calculating.

`LET` combines well with dynamic arrays because it lets you filter once and reuse the result:

```excel
=LET(
   rows, FILTER(Prod, Prod[State]=A2),
   files, INDEX(rows, , 4),
   errs,  INDEX(rows, , 5),
   SUM(errs)/SUM(files)
)
```

### LAMBDA

`LAMBDA(parameter1, [parameter2, …], calculation)` defines an anonymous function. Test it inline by calling it immediately:

```excel
=LAMBDA(amount, rate, ROUND(ROUNDUP(amount/1000,0)*rate, 2))(187450, 5.5)   → 1034
```

To reuse it, give it a name in **Formulas → Name Manager → New**: Name `PREMIUM`, Refers to `=LAMBDA(amount, rate, ROUND(ROUNDUP(amount/1000,0)*rate, 2))`. Now any cell in the workbook can write:

```excel
=PREMIUM(B2, C2)
```

The rate rule lives in one place. Change the rounding policy in the Name Manager and every formula updates. Add a comment in the name's Comment field so the next analyst knows what the arguments mean. Names are saved in the workbook, so the function travels with the file (but not to other workbooks unless copied via the Name Manager or the **Advanced Formula Environment** add-in, now part of Excel Labs).

### Optional parameters and defaults

`ISOMITTED` tests whether an argument was supplied:

```excel
=LAMBDA(amount, [rate], LET(r, IF(ISOMITTED(rate), 5.5, rate), ROUND(ROUNDUP(amount/1000,0)*r, 2)))
```

Square brackets mark the parameter optional.

### Helper functions for arrays

LAMBDA unlocks a set of functions that apply a function across arrays:

| Function | What it does |
|---|---|
| `MAP(array, LAMBDA(x, …))` | Transform each element |
| `BYROW(array, LAMBDA(row, …))` | One result per row |
| `BYCOL(array, LAMBDA(col, …))` | One result per column |
| `REDUCE(initial, array, LAMBDA(acc, x, …))` | Fold to a single value |
| `SCAN(initial, array, LAMBDA(acc, x, …))` | Running results |
| `MAKEARRAY(rows, cols, LAMBDA(r, c, …))` | Build an array from indices |

```excel
=BYROW(B2:F40, LAMBDA(r, MAX(r)))                    max per row of a matrix
=MAP(A2:A100, LAMBDA(s, TRIM(CLEAN(s))))             clean every cell, spilled
=SCAN(0, Prod[Files], LAMBDA(acc, x, acc + x))       running total
=REDUCE(0, Prod[Files], LAMBDA(acc, x, acc + (x > 400)))   count over 400
=MAKEARRAY(5, 5, LAMBDA(r, c, r * c))                multiplication table
```

`BYROW` over a matrix replaces a helper column of `MAX` formulas; `SCAN` gives a running total without the `=SUM($B$2:B2)` pattern that recalculates in O(n²).

### Recursion

A named LAMBDA can call itself. A classic is removing a list of characters from text:

```excel
' Name: CLEANCHARS
=LAMBDA(text, chars,
   IF(chars = "", text,
      CLEANCHARS(SUBSTITUTE(text, LEFT(chars, 1), ""), MID(chars, 2, 100))))
```

`=CLEANCHARS(A2, "-/ ")` strips dashes, slashes and spaces. Recursion depth is limited (around 1,024 levels), so it suits short lists, not long loops.

### Errors and debugging

- `#NAME?` after typing a LAMBDA name usually means the name was not saved or is misspelt.
- A LAMBDA with the wrong number of arguments returns `#VALUE!`.
- Use `LET` to expose intermediate values: temporarily make the final calculation one of the names to inspect it.
- **Formulas → Evaluate Formula** steps through `LET` bindings one at a time.

> **Interview note:** Interviewers who ask about `LAMBDA` want to know that you have actually named one. Describe a concrete function you have deployed, such as a rate calculator, and mention that it lives in the Name Manager and requires Microsoft 365.

### Try It Yourself

```excel
' 1. Name Manager → New → Name: PREMIUM, Refers to:
=LAMBDA(amount, [rate],
   LET(r, IF(ISOMITTED(rate), 5.5, rate),
       units, ROUNDUP(amount/1000, 0),
       ROUND(units * r, 2)))
' 2. Use it:
=PREMIUM(187450)            → 1034
=PREMIUM(187450, 4.25)      → 799
' 3. Apply across a column and get a running total:
=MAP(Prod[Coverage], LAMBDA(a, PREMIUM(a)))
=SCAN(0, Prod[Files], LAMBDA(acc, x, acc + x))
```

### Quiz

1. What is the main performance benefit of LET?
- [ ] It runs formulas on multiple threads
- [x] Repeated sub-expressions are computed once
- [ ] It caches results between sessions
> Each named value is evaluated a single time, however often it is used.

2. Where do you store a reusable LAMBDA?
- [x] In the Name Manager as a defined name
- [ ] In a VBA module
- [ ] In a cell comment
> A named LAMBDA becomes a custom function available throughout the workbook.

3. Which helper returns one result per row of a range?
- [ ] MAP
- [x] BYROW
- [ ] REDUCE
> BYROW passes each row to the LAMBDA and spills one value per row.

4. `=LAMBDA(x, x*2)(5)` returns?
- [x] 10
- [ ] `#VALUE!`
- [ ] A function
> Calling the LAMBDA immediately with `(5)` evaluates it in place.

### Exercises

1. **Turnaround days function** — Create `TAT(received, completed)` returning business days minus one, using the `Holidays[Date]` Table.
<details><summary>Solution</summary>

Name `TAT` → `=LAMBDA(rcv, cmp, NETWORKDAYS(rcv, cmp, Holidays[Date]) - 1)`. Use `=TAT(A2, B2)`.

</details>

2. **Row-wise QA grade** — Given a matrix of daily error rates (agents down, days across), return one grade per agent based on the agent's average.
<details><summary>Solution</summary>

`=BYROW(B2:F21, LAMBDA(r, IFS(AVERAGE(r)<=0.01,"A", AVERAGE(r)<=0.02,"B", TRUE,"C")))`

</details>

3. **Rewrite with LET** — Simplify `=IF(VLOOKUP(A2,Rates,2,0)="", 0, VLOOKUP(A2,Rates,2,0)*B2)`.
<details><summary>Solution</summary>

`=LET(rate, XLOOKUP(A2, Rates[State], Rates[Rate], ""), IF(rate="", 0, rate*B2))`

</details>

### Interview Questions

**Q: What problems do LET and LAMBDA solve?**
`LET` solves readability and repeated computation: a rate calculation that used the same `ROUNDUP` three times becomes one named value computed once, and the formula reads like a small script. `LAMBDA` solves duplication across the workbook: a business rule such as premium rounding is defined once in the Name Manager and reused everywhere, so a policy change is a single edit rather than a find-and-replace across sheets. Together with `MAP`, `BYROW`, `SCAN` and `REDUCE` they replace helper columns and many VBA user-defined functions, with the advantage that the workbook remains macro-free and recalculates natively.

**Q: What are the drawbacks of LAMBDA in a shared workbook?**
It requires Microsoft 365, so users on perpetual versions see `#NAME?`. Named LAMBDAs are stored per workbook and do not transfer automatically, so a template strategy or the Excel Labs Advanced Formula Environment is needed to share a library. They are harder to discover than a VBA module because they hide in the Name Manager, so documentation in the name's comment is essential. Debugging is also weaker than VBA: there is no breakpoint, only `Evaluate Formula` and exposing intermediates with `LET`. And recursion has a depth limit, so LAMBDA is not a replacement for loops over thousands of items.

**Q: Explain REDUCE versus SCAN with an example.**
Both walk an array with an accumulator. `REDUCE` returns only the final accumulator, so `REDUCE(0, files, LAMBDA(a, x, a + x))` gives the total. `SCAN` returns every intermediate accumulator as an array, so the same LAMBDA with `SCAN` produces a running total that spills next to the data. I use `SCAN` for cumulative columns such as year-to-date files, which previously needed `=SUM($B$2:B2)` in every row and got slower with each row because every cell re-summed from the top.

## PivotTables, slicers & calculated fields

A PivotTable summarises a flat list into a cross-tab in seconds, with no formulas. Drag *State* to Rows, *Month* to Columns, *Files* to Values, and the report exists. It is the fastest exploratory tool in Excel and the backbone of most weekly status packs. Understanding what it does under the hood, and where it stops being the right tool, is what separates an analyst from a user.

### Creating one

Click inside your Table and choose **Insert → PivotTable**. Excel proposes the Table as the source and a new sheet as the destination. The **PivotTable Fields** pane on the right has four areas:

| Area | Effect |
|---|---|
| **Rows** | One row per distinct value, nested if several fields |
| **Columns** | One column per distinct value |
| **Values** | Aggregated numbers (Sum, Count, Average, Min, Max, Product, Count Numbers, StdDev, Var) |
| **Filters** | Page-level filters above the table |

Text fields dropped in Values default to Count; numeric fields default to Sum. Right-click a value → **Summarize Values By** to change the aggregation, and **Show Values As** for percentages of total, running totals, differences from a previous period and rank.

### Grouping dates

Drop a date field on Rows and Excel (2016+) groups it automatically into Years, Quarters and Months. Right-click → **Group** to choose the levels, or **Ungroup** for raw dates. Numeric fields can be grouped into bins (coverage amounts in $50,000 bands) through the same dialog.

### Layout and design

**Design → Report Layout → Show in Tabular Form** with **Repeat All Item Labels** produces a flat table that other tools can consume; the default Compact form nests labels in one column and is hard to use as a data source. **Subtotals → Do Not Show** and **Grand Totals** are on the same tab. Right-click → **PivotTable Options → Layout & Format** lets you set *For empty cells show* to `0` and turn off column autofit on refresh so your widths do not jump.

### Slicers and timelines

**PivotTable Analyze → Insert Slicer** adds clickable buttons for a field. A slicer connected to several PivotTables (right-click → **Report Connections**) filters them all at once, which is how one-page dashboards work. **Insert Timeline** gives a date-range slider for a date field. Slicers can be styled and resized; hold `Ctrl` to multi-select buttons.

### Calculated fields and items

**PivotTable Analyze → Fields, Items & Sets → Calculated Field** creates a new value field from a formula over other fields:

```excel
Name: Error Rate      Formula: =Errors/Files
```

Calculated fields are computed on the **sums** per cell, so `Errors/Files` is correctly volume-weighted. But they are limited: they cannot use `COUNT` of distinct values, cannot reference cells outside the pivot, and a calculated field of an average is the ratio of sums, not the average of ratios. For anything beyond simple arithmetic, the data model with DAX measures (Expert level) is the right tool.

**Calculated Items** add a row or column computed from other items (e.g. `Q3 = Jul + Aug + Sep`). They are rarely a good idea because they double count in grand totals; avoid unless the total is turned off.

### Refresh and the cache

A PivotTable does not read the sheet live. It reads a **pivot cache**, a compressed snapshot taken when the pivot was created. **Right-click → Refresh** (or `Alt+F5`; `Ctrl+Alt+F5` for all) re-reads the source. Set **PivotTable Options → Data → Refresh data when opening the file** for delivered reports. Pivots created from the same source share one cache, so grouping in one affects the others; create the second one with **Insert → PivotTable** rather than copy-paste if you need independent grouping.

### GETPIVOTDATA

Clicking a pivot cell from a formula writes `=GETPIVOTDATA("Files", $A$3, "State", "Wyoming")`. It looks ugly but is the reliable way to pull a pivot number into a formatted management page: it keeps working when the pivot re-orders. Turn it off with **PivotTable Analyze → Options → Generate GetPivotData** if you prefer plain references.

### Distinct count

Tick **Add this data to the Data Model** in the Create PivotTable dialog. Values then offer **Distinct Count** (number of unique agents per state), which a normal pivot cannot do. That checkbox is the door to Power Pivot.

### Where pivots stop

- Fixed-layout reports where cells must stay in place: use `SUMIFS` or `GETPIVOTDATA` on a pivot placed on a hidden sheet.
- Ratios of averages, distinct counts, comparisons with a prior period: use the data model.
- More than a million rows: the data model or Power Query.

> **Tip:** Build every pivot from a Table, never from a plain range. When rows are added, one Refresh picks them up; with a range you must change the source under **Change Data Source** every week.

### Try It Yourself

```excel
' Steps for a weekly production summary
' 1. Click in tblProduction → Insert → PivotTable → New Worksheet
' 2. Rows: State   Columns: Date (auto-grouped to Months)   Values: Sum of Files, Sum of Errors
' 3. Fields, Items & Sets → Calculated Field:
'       Name: Error Rate      Formula: =Errors/Files       (format as 0.00%)
' 4. Design → Report Layout → Show in Tabular Form; Grand Totals → On for Rows and Columns
' 5. Insert Slicer: Agent;  Insert Timeline: Date
' 6. Management sheet cell:
=GETPIVOTDATA("Files", Pivot!$A$3, "State", "Wyoming", "Date", 8)
```

### Quiz

1. A calculated field `=Errors/Files` shows which value for a state?
- [x] Sum of errors divided by sum of files for that state
- [ ] The average of each row's error rate
- [ ] The maximum row error rate
> Calculated fields operate on the aggregated sums in each cell.

2. Why does a pivot not show a row you just added to the source?
- [ ] The row contains text
- [x] The pivot reads a cache and has not been refreshed
- [ ] Pivots only update on file open
> Refresh (Alt+F5) re-reads the source into the pivot cache.

3. Which option enables Distinct Count in a PivotTable?
- [ ] Show Values As → Distinct
- [x] Add this data to the Data Model
- [ ] Calculated Item
> Distinct Count is only available on data-model (Power Pivot) pivots.

4. What does a slicer's Report Connections setting do?
- [ ] Connects the slicer to an external database
- [x] Links the slicer to multiple PivotTables so one click filters all
- [ ] Refreshes connected pivots
> One slicer can drive every pivot that shares its cache.

### Exercises

1. **State × month matrix** — Build a pivot of Files by State (rows) and Month (columns) with a Grand Total, and add a slicer for Agent.
<details><summary>Solution</summary>

Insert → PivotTable from the Table; drag State to Rows, Date to Columns (auto-grouped; remove Years/Quarters if not wanted), Files to Values. PivotTable Analyze → Insert Slicer → Agent.

</details>

2. **Percent of column** — Show each state's share of the month's files instead of raw counts.
<details><summary>Solution</summary>

Right-click a value → Show Values As → **% of Column Total**.

</details>

3. **Distinct agents per state** — Report how many different agents worked each state.
<details><summary>Solution</summary>

Recreate the pivot ticking **Add this data to the Data Model**; add Agent to Values, then Value Field Settings → **Distinct Count**.

</details>

### Interview Questions

**Q: What is the pivot cache and why does it matter?**
When you create a PivotTable, Excel copies the source into an in-memory, compressed structure called the pivot cache, and the pivot summarises the cache, not the sheet. That is why edits to the source do not appear until Refresh, why a workbook with many pivots on the same data can be large (each independent cache is stored in the file), and why pivots built from the same range share grouping and calculated items. In practice I build all pivots for a report from one Table so they share a cache, enable *Refresh data when opening the file* for delivered workbooks, and untick *Save source data with file* when the file must be small and the source is always available.

**Q: What are the limitations of calculated fields, and what do you use instead?**
Calculated fields only operate on summed values, so `Errors/Files` is fine but an average of per-row ratios or a distinct count is impossible. They cannot reference cells outside the pivot, cannot use most functions meaningfully, and cannot compare with a prior period. Calculated items double count in totals. The alternatives are helper columns in the source Table for row-level logic, and DAX measures in the data model for anything aggregate: distinct counts, ratios of measures, time intelligence such as month-over-month change. For a weekly report with a "vs last week" column I always move to the data model.

**Q: How do you deliver a pivot-based report so that it does not break on the recipient's machine?**
Source the pivot from a Table inside the same workbook, not an external connection, so no credentials or paths are needed. Set the pivot to refresh on open, or paste a values-only copy on a presentation sheet if the recipient must not see the raw data. Use `GETPIVOTDATA` for any formulas referencing the pivot so re-ordering does not shift references. Turn off autofit on refresh so the layout stays stable, and if slicers are included, check *Report Connections* so they filter everything intended. Finally, I open the file on a machine without my add-ins to make sure nothing depends on my environment.

## Power Query: import, clean, merge, append, unpivot

Power Query is the ETL engine built into Excel (2016 and later; an add-in for 2010/2013) under **Data → Get & Transform Data**. You connect to a source, apply a recorded sequence of transformation steps, and load the result to a sheet, a Table or the data model. Every step is written in a language called **M**, and the whole sequence replays with one click on **Refresh**. If you have ever spent Monday morning re-cleaning the same CSV export, Power Query removes that job permanently.

### Connecting

**Data → Get Data** lists sources: **From File** (Excel workbook, CSV, JSON, PDF, Folder), **From Database** (SQL Server, Access, ODBC), **From Online Services** (SharePoint, Dataverse), **From Other Sources** (Web, OData, blank query). **From Table/Range** turns the current Table into a query. Choosing a source opens a preview; click **Transform Data** to enter the **Power Query Editor**.

### The editor

The left pane lists queries. The centre shows a preview (up to 1,000 rows by default). The right **Applied Steps** pane is the recorded script: click any step to see the data at that point, and the formula bar shows its M code. Steps are named automatically (`Changed Type`, `Filtered Rows`); rename them with F2 so the pipeline reads like documentation.

Common steps, all from the ribbon or right-click menus:

| Task | Ribbon path |
|---|---|
| Set headers from the first row | Home → Use First Row as Headers |
| Change data type | Click the type icon on the column header (or Transform → Data Type, with **Using Locale** for foreign date formats) |
| Remove columns | Select → Home → Remove Columns (or *Remove Other Columns*) |
| Filter rows | Column dropdown, like AutoFilter |
| Split a column | Transform → Split Column → By Delimiter / By Number of Characters |
| Trim, clean, case | Transform → Format → Trim / Clean / Uppercase |
| Replace values | Transform → Replace Values |
| Fill down blanks | Transform → Fill → Down (for merged-cell layouts) |
| Add a calculated column | Add Column → Custom Column |
| Conditional column | Add Column → Conditional Column |
| Group by | Transform → Group By |

Each click adds a line of M such as:

```powerquery
= Table.TransformColumns(#"Changed Type", {{"Agent", Text.Trim, type text}})
```

### Merge (join) and Append (union)

**Home → Merge Queries** joins two queries on one or more key columns, like a lookup or a SQL `JOIN`. Join kinds: Left Outer (all rows from the first, matches from the second), Right Outer, Full Outer, Inner, Left Anti (rows in the first with no match, which is how you find production files with no rate), Right Anti. After merging, click the expand icon on the new column to pick which fields to bring in. Merging on a cleaned key is more reliable than `VLOOKUP` because types and whitespace are fixed upstream.

**Home → Append Queries** stacks tables with the same columns, which is how twelve monthly exports become one year table. **Get Data → From Folder** appends every file in a folder automatically and re-appends when new files land, which is the standard pattern for weekly exports.

### Unpivot

Reports arrive as matrices (agents down, months across). Analysis needs long format (one row per agent per month). Select the month columns and choose **Transform → Unpivot Columns**, or select the fixed columns and choose **Unpivot Other Columns** so future months are handled automatically. The reverse, **Pivot Column**, builds a matrix from long data.

```powerquery
let
    Source = Excel.CurrentWorkbook(){[Name="tblMatrix"]}[Content],
    Typed = Table.TransformColumnTypes(Source, {{"Agent", type text}}),
    Long = Table.UnpivotOtherColumns(Typed, {"Agent"}, "Month", "Files"),
    Dated = Table.TransformColumnTypes(Long, {{"Month", type date}}, "en-US")
in
    Dated
```

### Reading M

A query is a `let … in` expression: a list of named steps, each usually built on the previous one, and a final result. Names with spaces are written `#"Changed Type"`. M is case-sensitive (`Table.SelectRows`, not `table.selectrows`), and every value has a type. **View → Advanced Editor** shows the whole script and lets you edit it directly, which is faster than clicking once you know the functions:

```powerquery
let
    Source = Csv.Document(File.Contents("C:\Exports\production.csv"), [Delimiter=",", Encoding=65001]),
    Headers = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Headers, {{"Date", type date}, {"Files", Int64.Type}, {"Errors", Int64.Type}}),
    Clean = Table.TransformColumns(Typed, {{"Agent", each Text.Proper(Text.Trim(_)), type text}}),
    Kept = Table.SelectRows(Clean, each [Files] <> null and [Files] > 0),
    Rate = Table.AddColumn(Kept, "Rate", each [Errors] / [Files], type number)
in
    Rate
```

`each` defines a one-argument function whose argument is `_`, and `[Files]` inside it reads the current row's column.

### Loading

**Home → Close & Load To…** offers: Table on a sheet, PivotTable report, Connection only, and the checkbox **Add this data to the Data Model**. Connection-only queries are staging steps that other queries reference. Large sources should load to the data model, not a sheet, because sheets stop at 1,048,576 rows and the model compresses far better.

### Parameters and refresh

**Home → Manage Parameters** creates values such as a folder path that a client can change without opening the editor; reference them in M as `FolderPath`. **Data → Refresh All** (`Ctrl+Alt+F5`) reruns every query. Queries are refreshed in dependency order, and **Query Properties** controls background refresh and refresh-on-open.

> **Warning:** The **Changed Type** step Power Query inserts automatically hard-codes column names. If a source file renames or drops a column, the refresh fails with *column 'X' of the table wasn't found*. Delete that step and type only the columns you need, later in the query, after `Table.SelectColumns`.

### Try It Yourself

```powerquery
// Append every weekly CSV in a folder, clean it, and compute a rate column
let
    Source  = Folder.Files("C:\Exports\Weekly"),
    CsvOnly = Table.SelectRows(Source, each Text.EndsWith([Name], ".csv")),
    Parsed  = Table.AddColumn(CsvOnly, "Data", each Csv.Document([Content], [Delimiter=",", Encoding=65001])),
    Tables  = Table.SelectColumns(Parsed, {"Name", "Data"}),
    Expanded = Table.ExpandTableColumn(Tables, "Data", {"Column1","Column2","Column3","Column4","Column5"},
                                        {"Date","State","Agent","Files","Errors"}),
    NoHeaderRows = Table.SelectRows(Expanded, each [Date] <> "Date"),
    Typed   = Table.TransformColumnTypes(NoHeaderRows, {{"Date", type date}, {"Files", Int64.Type}, {"Errors", Int64.Type}}, "en-US"),
    Clean   = Table.TransformColumns(Typed, {{"Agent", Text.Trim, type text}, {"State", Text.Upper, type text}}),
    Rate    = Table.AddColumn(Clean, "Rate", each if [Files] = 0 then null else [Errors] / [Files], type number)
in
    Rate
```

### Quiz

1. Which join kind returns rows from the first table that have no match in the second?
- [ ] Inner
- [x] Left Anti
- [ ] Full Outer
> Left Anti is the "find orphans" join, useful for files with no rate entry.

2. What does Unpivot Other Columns do?
- [x] Turns every column except the selected ones into attribute/value rows
- [ ] Deletes the unselected columns
- [ ] Transposes the table
> It converts a matrix to long format and automatically includes new columns added later.

3. In M, what is `each [Files] > 0`?
- [ ] A comment
- [x] A one-argument function that tests the current row
- [ ] A column name
> `each` is shorthand for `(_) => …`, and `[Files]` reads a field of the current row.

4. Why is the automatic *Changed Type* step fragile?
- [ ] It slows refresh
- [x] It names every column, so a renamed or missing column breaks the refresh
- [ ] It converts everything to text
> Type only the columns you keep, after selecting them, to survive source changes.

### Exercises

1. **Clean an export** — Import `production.csv`, promote headers, trim the Agent column, remove rows with zero files, and load to a Table.
<details><summary>Solution</summary>

Get Data → From Text/CSV → Transform Data. Home → Use First Row as Headers (if needed). Select Agent → Transform → Format → Trim. Files column filter → Number Filters → Does Not Equal 0. Close & Load.

</details>

2. **Files with no rate** — Merge Production with Rates on State and list production rows that have no rate.
<details><summary>Solution</summary>

Home → Merge Queries → select Production and Rates, click State in both, Join Kind **Left Anti**. The result contains only unmatched production rows.

</details>

3. **Matrix to long** — An agent-by-month matrix Table `tblMatrix` must become Agent, Month, Files rows.
<details><summary>Solution</summary>

From Table/Range on tblMatrix; select the Agent column; Transform → **Unpivot Other Columns**; rename Attribute → Month, Value → Files; set Month to date type.

</details>

### Interview Questions

**Q: When do you reach for Power Query instead of formulas?**
Whenever the same cleaning must happen more than once, whenever data comes from files or databases rather than typed cells, and whenever the volume is large. Formulas are live and transparent but recalculate constantly and need helper columns for every transformation. Power Query records the transformation as steps, runs on refresh, handles millions of rows, folds steps back to a database as SQL where possible, and appends whole folders of files. For a weekly production report I keep raw exports in a folder, let Power Query append and clean them, load to the data model, and drive the report from measures; the analyst's Monday job becomes pressing Refresh All.

**Q: Explain the difference between Merge and Append.**
Merge is a join: it combines columns from two tables based on matching key values, with SQL-style join kinds (Left Outer, Inner, Full, Anti). Append is a union: it stacks rows of tables with the same columns, matching columns by name, and fills missing columns with null. You merge production rows with a rate table to bring in the rate; you append twelve monthly exports to build a year. A common mistake is appending tables whose headers differ slightly (`Files` versus `files`), which silently produces two columns; I standardise headers with `Table.RenameColumns` or a lower-case step before appending.

**Q: What is query folding and why should you care?**
Query folding is Power Query translating your steps into a single native query (SQL, OData) that the source executes, so filtering and grouping happen on the server and only the result travels. Steps that fold include filters, column selection, joins and group-by on databases; steps that do not fold, such as custom M functions, `Table.Buffer` or anything after a non-folding step, force the full table to download. Right-click a step and check whether **View Native Query** is enabled to see if folding holds. For a SQL Server source with millions of rows, ordering steps so filters come before non-folding steps can turn a ten-minute refresh into ten seconds.

## Conditional formatting & KPI indicators

Conditional formatting changes a cell's appearance based on its value or a formula. Used well, it lets a manager see the three problem agents in a 20-row QA table without reading a single number. Used badly, it produces the rainbow spreadsheets everyone ignores. This chapter covers the built-in rules, formula-driven rules, icon sets for KPI tiles, and the management discipline that keeps rules from piling up.

### Built-in rules

**Home → Conditional Formatting** offers:

| Group | Examples |
|---|---|
| Highlight Cells Rules | Greater Than, Between, Text that Contains, A Date Occurring, Duplicate Values |
| Top/Bottom Rules | Top 10 Items, Top 10 %, Above Average |
| Data Bars | In-cell bars proportional to value |
| Color Scales | Two- or three-colour gradients |
| Icon Sets | Arrows, traffic lights, ratings, flags |

**Duplicate Values** on an ID column is a two-click integrity check. **Data Bars** on a Files column give a bar chart with no chart object. **Color Scales** suit heat maps such as agent-by-day error rates.

### Formula-based rules

**New Rule → Use a formula to determine which cells to format** is where the real power is. The formula is written relative to the top-left cell of the selection and evaluated for every cell, exactly like filling a formula:

```excel
Selection A2:F500  Formula: =$F2="Late"           highlight the whole row when status is Late
Selection A2:F500  Formula: =$E2/$D2>0.02          row error rate above 2%
Selection D2:D500  Formula: =D2>AVERAGE($D$2:$D$500)   above-average files
Selection A2:A500  Formula: =COUNTIF($A$2:$A$500, A2)>1   duplicates
Selection B2:B500  Formula: =AND(B2<TODAY(), $F2<>"Complete")   overdue
Selection A2:F500  Formula: =MOD(ROW(),2)=0        banded rows without a Table
Selection A1:Z1    Formula: =A$1=TODAY()           highlight today's column in a calendar
```

The `$` rules are the same as in normal formulas: `$F2` locks the column so every cell in the row tests the same status; `A$1` locks the row so every column tests its own header. Cells that are blank are treated as zero, so add `AND(B2<>"", …)` where blanks must not fire.

### Icon sets for KPI tiles

Icon sets show an arrow or traffic light beside a value. Two changes make them professional:

1. In **Manage Rules → Edit Rule**, set the thresholds to **Number** or **Formula** instead of the default percentiles, so green means "under 2 %" rather than "in the top third of this list".
2. Tick **Show Icon Only** to display just the symbol in a narrow status column.

For a variance column, a custom number format such as `[Green]▲0.0%;[Red]▼0.0%;–` does the same job with no rule at all and is faster to compute.

### Stop If True and rule order

Rules apply in the order listed in **Manage Rules** (top wins for conflicting formats). **Stop If True** prevents lower rules from running when a higher one matches, which is how you keep a "row is complete" grey-out from being overpainted by an "over budget" red. Rules for the same range that set different properties (one fill, one font) both apply.

### Managing rules

Open **Conditional Formatting → Manage Rules → This Worksheet** to see every rule and its *Applies to* range. Rules fragment as rows are copied and inserted: one rule for `A2:F500` becomes fifty rules for individual rows, which slows the sheet and confuses edits. Periodically **Clear Rules from Entire Sheet** and reapply the handful you intend, or apply rules to a Table so they extend with the data.

Copy formatting between sheets with Format Painter, and remove it from an area with **Clear Rules from Selected Cells**.

### Performance

Every conditional rule is evaluated on every screen repaint for every visible cell. Rules with whole-column references (`$A:$A`), volatile functions (`TODAY()`, `INDIRECT`) or `COUNTIF` over large ranges make scrolling sluggish on big sheets. Bound the ranges, reference a single `ReportDate` cell instead of `TODAY()`, and push heavy logic into a helper column so the rule is simply `=$G2=TRUE`.

### Where conditional formatting stops

- It cannot change a value or write text; use `IF` for that.
- It cannot format one cell based on another sheet in Excel 2007 (2010+ allow it).
- Charts do not read conditional colours; chart colours need separate series.

> **Tip:** Design for print and colour-blind readers. Pair colour with an icon, a bold font or a text flag in a status column, so the red-green traffic light still communicates in greyscale.

### Try It Yourself

```excel
' QA sheet A2:G500: Agent | Date | Files | Errors | Rate | Status | Due
' Rule 1 (A2:G500)  =$F2="Complete"                    fill light grey, Stop If True
' Rule 2 (A2:G500)  =AND($G2<ReportDate, $F2<>"Complete")   fill red, white bold font
' Rule 3 (E2:E500)  Icon set, Number thresholds: green <0.01, amber <0.02, red otherwise, Show Icon Only
' Rule 4 (C2:C500)  Data Bar, solid fill, minimum 0, maximum =MAX($C$2:$C$500)
' Rule 5 (A2:A500)  =COUNTIF($A$2:$A$500, A2)>1          yellow fill (duplicate agent-day rows)
' KPI variance tile without a rule:
Format code: [Green]▲0.0%;[Red]▼0.0%;–
```

### Quiz

1. To highlight an entire row when column F says "Late", the rule formula uses which reference?
- [ ] `F2`
- [x] `$F2`
- [ ] `$F$2`
> The column must be locked so each cell in the row tests its own row's status.

2. What does Stop If True do?
- [x] Prevents lower-priority rules from applying to cells matched by this rule
- [ ] Stops recalculating the sheet
- [ ] Deletes the rule after it matches once
> It controls rule precedence in Manage Rules.

3. Why change icon-set thresholds from Percent to Number?
- [ ] Percent is slower
- [x] So colours mean fixed business thresholds, not relative rank within the list
> Percentile thresholds always paint some cells red even when every agent is under target.

4. Which practice keeps conditional formatting fast on large sheets?
- [ ] Use TODAY() directly in each rule
- [x] Bound ranges and move heavy logic into a helper column
- [ ] Apply rules to whole columns
> Rules are evaluated on every repaint, so keep them cheap.

### Exercises

1. **Overdue rows** — Highlight rows in red where the due date has passed and status is not Complete.
<details><summary>Solution</summary>

Select `A2:G500`, New Rule → formula `=AND($G2<>"", $G2<TODAY(), $F2<>"Complete")`, red fill.

</details>

2. **Heat map** — Colour an agent-by-day error-rate matrix from green (0) to red (5 %).
<details><summary>Solution</summary>

Select the matrix, Conditional Formatting → Color Scales → Green-Yellow-Red, then Edit Rule and set Minimum Number 0, Midpoint Number 0.025, Maximum Number 0.05.

</details>

3. **Traffic light column** — Show only a green/amber/red circle for rates under 1 %, under 2 % and above.
<details><summary>Solution</summary>

Select the Rate column → Icon Sets → 3 Traffic Lights; Edit Rule: Type Number, green when < 0.01, amber when < 0.02; tick **Show Icon Only**.

</details>

### Interview Questions

**Q: How do you highlight a whole row based on one column's value?**
Select the full data range starting at the top-left data cell, create a formula rule, and write the condition against the first row with the column locked and the row relative, for example `=$F2="Late"`. Excel evaluates the formula for every cell in the selection as if it were filled, so each cell in row 10 tests `$F10`. I usually apply the rule to a Table so it extends with new rows, and I add `Stop If True` on a "Complete" grey-out rule above it so finished work never shows red.

**Q: What causes conditional formatting to slow a workbook and how do you fix it?**
Rule fragmentation from copy-paste (hundreds of rules on single cells), rules on whole columns, volatile functions such as `TODAY()` or `INDIRECT` inside rules, and expensive functions like `COUNTIF` over large ranges, all evaluated at every repaint. I open Manage Rules for the sheet, clear everything, reapply a handful of rules on bounded ranges or Table columns, replace `TODAY()` with a reference to a single dated cell, and precompute complex conditions in a helper column so the rule becomes a simple comparison. On a 50,000-row QA sheet this took scrolling from stuttering to smooth.

**Q: Would you use icon sets or custom number formats for KPI arrows?**
For a variance column where the sign decides the arrow, a custom number format like `[Green]▲0.0%;[Red]▼0.0%` is better: no rule to manage, no repaint cost, and it prints and copies as text. Icon sets are better when thresholds are not simply the sign, such as three bands on an error rate, or when the icon must appear without the number. In both cases I set explicit numeric thresholds and pair colour with a shape so the indicator survives greyscale printing and is readable by colour-blind managers.

## Charts & dashboard design

A chart is the part of the report the manager actually looks at. Excel's chart engine is powerful but its defaults are poor, so building a clear chart is a sequence of deliberate choices: the right chart type for the question, a clean layout, dynamic ranges so it updates itself, and an arrangement of tiles that reads in the right order. This chapter walks from single charts to a one-page dashboard.

### Choosing the chart type

| Question | Chart |
|---|---|
| How does a value change over time? | Line (many points) or clustered column (few periods) |
| How do categories compare? | Bar (horizontal, sorted) |
| What is the composition of a total? | Stacked column; avoid pie beyond three slices |
| Are two measures related? | Scatter |
| Where is the variance coming from? | Waterfall (2016+) |
| Actual vs target for one KPI | Bullet-style bar or a big number with a delta |
| Distribution | Histogram (2016+) or box & whisker |

**Insert → Recommended Charts** is a reasonable starting point; `Alt+F1` inserts the default chart for the selected data, `F11` puts it on its own sheet.

### Building from a Table

Select any cell in a Table and insert a chart: the series reference the Table columns, so new rows extend the chart on refresh. For a chart that must show only the last 12 weeks, base it on a dynamic named range:

```excel
Name: LastWeeks   Refers to: =OFFSET(Data!$B$2, COUNTA(Data!$B:$B)-13, 0, 12, 1)
Series values:    =Book.xlsx!LastWeeks
```

Or, in Microsoft 365, spill the last 12 rows with `=TAKE(tbl[Files], -12)` on a helper sheet and name that spill (`=Helper!$A$1#`). Chart series accept named ranges but not spill references directly.

### Formatting for clarity

Every default chart needs the same ten edits, which a saved **chart template** (right-click → Save as Template, then Insert → Charts → Templates) applies in one click:

1. Delete the gridlines or lighten them to a pale grey.
2. Remove the chart border and legend if there is one series.
3. Title states the finding: *Wyoming errors fell 40 % after June retraining*, not *Errors by Month*.
4. Axis starts at zero for bars and columns; never truncate.
5. Sort bars by value unless the category has a natural order.
6. Direct-label the series (data labels on the last point) instead of a legend where possible.
7. Use one accent colour for the series that matters and grey for the rest.
8. Number format on the axis matches the data (`#,##0`, `0%`).
9. Font size at least 9 pt; the chart will shrink on the dashboard.
10. Fix the chart size (Format → Size) so tiles align.

A **combo chart** (Insert → Combo) plots files as columns and error rate as a line on a secondary axis. Use secondary axes sparingly and label both clearly.

### Sparklines

**Insert → Sparklines → Line/Column/Win-Loss** places a tiny in-cell chart per row, ideal for a trend column in an agent table. Set **Sparkline → Axis → Same for All Sparklines** so rows are comparable.

### KPI tiles

A tile is a merged-look block (use Center Across Selection, not Merge) with a large number, a label and a delta:

```excel
B3 (large): =SUM(Prod[Files])                                     format #,##0
B4 (small): =TEXT((B3-PrevFiles)/PrevFiles, "[Green]▲0.0%;[Red]▼0.0%")&" vs last week"
```

Linked pictures (**Copy → Paste Special → Linked Picture**, the Camera tool) let you place any range as a resizable image anywhere on the dashboard, which is how tiles from different sheets sit side by side.

### Layout of a one-page dashboard

- Top-left corner holds the headline KPI tiles; eyes start there.
- One row of slicers and a timeline across the top, connected to every pivot behind the charts.
- Charts arranged in a grid with equal sizes; **Align** and **Distribute** are under Shape Format → Arrange.
- Turn off gridlines (View → Gridlines) and headings on the dashboard sheet; set the zoom so the page fills the screen.
- Hide the data and pivot sheets rather than deleting them, and protect the dashboard sheet so charts are not dragged.
- Keep a *Notes* cell with the source, refresh date (`=ReportDate`) and definitions of each measure.

### Interactivity without VBA

Slicers connected to the pivots behind the charts give click-to-filter. A dropdown (data validation) plus `XLOOKUP`/`FILTER` can switch a chart's series between metrics: point the chart at a helper range whose formula reads the dropdown. Charts on the data model respond to slicers and timelines together.

### Exporting

**File → Export → Create PDF/XPS** with the dashboard set to fit one page wide produces the emailable version. **Copy → Paste as Picture** puts a chart into PowerPoint or Word; paste as a linked chart if the deck should update.

> **Interview note:** Expect "how would you present this data to a manager?". Good answers describe the question first, then the chart type, then the single message in the title. Analysts who start by listing chart types they know rarely get the role.

### Try It Yourself

```excel
' Dynamic last-12-weeks chart source (Name Manager)
Name: LastWeeksDates   =OFFSET(Data!$A$2, COUNTA(Data!$A:$A)-13, 0, 12, 1)
Name: LastWeeksFiles   =OFFSET(Data!$B$2, COUNTA(Data!$B:$B)-13, 0, 12, 1)
' Chart → Select Data → Series values: =Report.xlsx!LastWeeksFiles, Category labels: =Report.xlsx!LastWeeksDates

' KPI tile with delta arrow
B3: =SUMIFS(Prod[Files], Prod[Week], ThisWeek)
B4: =TEXT((B3-SUMIFS(Prod[Files], Prod[Week], ThisWeek-7))/SUMIFS(Prod[Files], Prod[Week], ThisWeek-7), "[Green]▲0.0%;[Red]▼0.0%")&" vs last week"

' Sparkline per agent: Insert → Sparklines → Line, Data Range = weekly files, Location = trend column
```

### Quiz

1. Which chart should show ten states compared by file count?
- [ ] Pie
- [x] Sorted horizontal bar
- [ ] Line
> Bars compare categories cleanly and horizontal bars leave room for labels; sorting reveals rank.

2. Why must a bar chart's value axis start at zero?
- [x] Bar length encodes the value, so truncation exaggerates differences
- [ ] Excel requires it
- [ ] Negative values would break otherwise
> Line charts may zoom the axis; bars and columns may not.

3. How can a chart include only the latest 12 rows automatically?
- [ ] Refresh the chart weekly
- [x] Point the series at a dynamic named range using OFFSET or a named spill
- [ ] Use a pie chart
> Named ranges built on OFFSET/COUNTA or on a TAKE spill resize as data grows.

4. What tool places a live image of a range anywhere on a dashboard?
- [ ] Screenshot
- [x] Paste Special → Linked Picture (Camera)
- [ ] Sparkline
> A linked picture updates when the source range changes and can be resized freely.

### Exercises

1. **Combo chart** — Chart weekly files as columns and error rate as a line on a secondary axis, with the title stating the key finding.
<details><summary>Solution</summary>

Select Week, Files and Rate columns → Insert → Combo → Clustered Column–Line on Secondary Axis; tick Secondary for Rate. Edit the title to a sentence, delete gridlines, format the secondary axis as `0.0%`.

</details>

2. **Top-5 chart** — Build a bar chart of the top five agents that re-sorts itself when data changes.
<details><summary>Solution</summary>

Helper: `=TAKE(SORTBY(HSTACK(Prod[Agent], Prod[Files]), Prod[Files], -1), 5)`. Name `Top5Names` as `=Helper!$A$1:$A$5` and `Top5Files` as `=Helper!$B$1:$B$5`, chart those names, and reverse the category axis order so the largest is on top.

</details>

3. **Dashboard skeleton** — Lay out a one-page dashboard with three KPI tiles, two slicers and four charts.
<details><summary>Solution</summary>

New sheet, View → untick Gridlines and Headings. Rows 1–4: three tiles built with Center Across Selection and large fonts. Row 5: slicers for State and Agent, plus a Timeline, all connected to the report pivots via Report Connections. Rows 7–30: four charts sized 12×8 cm each, aligned with Shape Format → Align → Align Top / Distribute Horizontally. Protect the sheet.

</details>

### Interview Questions

**Q: How do you decide which chart to use?**
By the question the reader is asking. Change over time is a line; comparison across categories is a sorted bar; part-of-whole is a stacked bar or, for very few parts, a pie; relationship between two measures is a scatter; contribution to a change is a waterfall. I then check the constraints: bars need a zero baseline, lines need evenly spaced time, more than four series need small multiples rather than one crowded chart. Finally I write the title as the finding, because a chart whose message needs explaining has the wrong type or the wrong data.

**Q: How do you make an Excel dashboard update itself each week?**
All data flows in through Power Query into Tables or the data model, so a Refresh All pulls the new week. Pivots and charts are built on those Tables, and any range-based chart uses dynamic named ranges or spilled arrays so its extent grows. KPI tiles are formulas over Table columns keyed on a `ReportDate` cell that itself derives from the latest date in the data. Slicers are connected to every pivot, so the interaction stays consistent. The Monday routine is Refresh All, a glance at a checks sheet that compares row counts and totals to the source, then Export to PDF.

**Q: What are common mistakes you see in Excel dashboards?**
Truncated axes on bar charts, pies with a dozen slices, 3-D effects, rainbow colours with no meaning, legends far from the series, titles that name the data instead of the message, and charts pointing at fixed ranges that quietly stop updating. Structurally, dashboards built on hard-coded values pasted from other files break the moment the source changes. My review checklist is: does every chart have one message, does every number have a source, can the whole page refresh without manual edits, and does it read correctly printed in black and white.

# LEVEL: Expert

## Power Pivot & the data model & DAX measures in Excel

The **data model** is an in-memory columnar database (the same VertiPaq engine as Power BI) that ships inside Excel. It holds multiple tables, relationships between them and **measures** written in DAX. Where a normal PivotTable needs one flat table and can only sum, count and average, a data-model pivot can join production rows to a rate table and a date table, compute distinct counts, ratios of measures and period-over-period comparisons, and do it over tens of millions of rows that no sheet could hold.

### Enabling Power Pivot

**File → Options → Add-ins → COM Add-ins → Go → Microsoft Power Pivot for Excel**. A **Power Pivot** tab appears with **Manage** (the model window), **Measures** and **KPIs**. Power Pivot is included in Microsoft 365 and Excel 2016+ on Windows; it is not available on Mac, although data-model pivots created on Windows still refresh there.

### Loading tables

Three routes put data in the model:

1. Power Query → **Close & Load To… → Add this data to the Data Model**.
2. An Excel Table → Power Pivot → **Add to Data Model**.
3. In the Create PivotTable dialog, tick **Add this data to the Data Model**.

Load large facts through Power Query so cleaning happens before the model.

### Star schema and relationships

Model a **fact** table (Production: one row per file per day) surrounded by **dimension** tables (Agents, States, Rates, Calendar). In **Manage → Diagram View**, drag `Production[State]` onto `States[State]` to create a relationship. Relationships are one-to-many (one state, many production rows), single-direction by default, and filter from the one side to the many side. That is what lets a slicer on `States[Region]` filter production numbers.

A **Calendar table** with one row per date, marked as a date table (**Design → Mark as Date Table**), is required for time-intelligence functions. Build it in Power Query or with DAX:

```dax
Calendar = CALENDAR(DATE(2024,1,1), DATE(2026,12,31))
```

### Measures versus calculated columns

A **calculated column** is computed row by row when the data loads and stored; it costs memory and cannot respond to filters. A **measure** is computed at query time in the filter context of each pivot cell. Rule: use columns for row-level attributes you slice by (fiscal year, coverage band), and measures for everything you aggregate.

Create a measure via **Power Pivot → Measures → New Measure** or right-click the table in the PivotTable Fields list → **Add Measure**:

```dax
Total Files   := SUM ( Production[Files] )
Total Errors  := SUM ( Production[Errors] )
Error Rate    := DIVIDE ( [Total Errors], [Total Files] )
Active Agents := DISTINCTCOUNT ( Production[Agent] )
Files per Agent := DIVIDE ( [Total Files], [Active Agents] )
```

`DIVIDE` returns blank on division by zero instead of an error. Measures reference each other by name in square brackets, so `Error Rate` is always the ratio of totals in whatever context it is evaluated.

### CALCULATE and filter context

`CALCULATE(expression, filters…)` evaluates a measure under modified filters. It is the most important function in DAX:

```dax
Wyoming Files := CALCULATE ( [Total Files], States[State] = "Wyoming" )
Late Files    := CALCULATE ( [Total Files], Production[Status] = "Late" )
Late %        := DIVIDE ( [Late Files], [Total Files] )
All-State Share := DIVIDE ( [Total Files], CALCULATE ( [Total Files], ALL ( States ) ) )
```

`ALL(States)` removes the state filter, so the denominator is the grand total and the measure yields each state's share, correctly, in every cell of the pivot, including subtotals.

### Time intelligence

With a marked date table on `Calendar[Date]` related to `Production[Date]`:

```dax
Files LM  := CALCULATE ( [Total Files], PREVIOUSMONTH ( Calendar[Date] ) )
Files MoM := DIVIDE ( [Total Files] - [Files LM], [Files LM] )
Files YTD := TOTALYTD ( [Total Files], Calendar[Date] )
Files LY  := CALCULATE ( [Total Files], SAMEPERIODLASTYEAR ( Calendar[Date] ) )
Rolling 4 wk := CALCULATE ( [Total Files], DATESINPERIOD ( Calendar[Date], MAX ( Calendar[Date] ), -28, DAY ) )
```

These are the "vs last month" and "YTD" columns that a normal pivot cannot produce.

### KPIs

**Power Pivot → KPIs → New KPI** attaches a target and thresholds to a measure; the pivot then offers a status icon field. It is the data-model equivalent of an icon set, computed by the engine.

### Iterators and RELATED

```dax
Premium := SUMX ( Production, Production[Units] * RELATED ( Rates[Rate] ) )
```

`SUMX` iterates the fact rows and `RELATED` pulls the rate through the relationship, so a premium is computed per row and summed, all without a helper column.

### Size and performance

VertiPaq compresses by column: a 5-million-row production table with few distinct values per column is often under 50 MB in the file. Keep high-cardinality columns (free-text notes, timestamps to the second) out of the model, prefer integer keys, and remove unused columns in Power Query. Measures over large models stay fast because they run on the compressed columns, not on cells.

> **Warning:** A relationship needs unique values on the one side. If `States[State]` contains a duplicate, the relationship refuses to create or the pivot shows blank rows. Deduplicate dimension tables in Power Query with **Remove Duplicates** before loading.

### Try It Yourself

```dax
-- Measures for the production model (Power Pivot → Measures → New Measure)
Total Files := SUM ( Production[Files] )
Total Errors := SUM ( Production[Errors] )
Error Rate := DIVIDE ( [Total Errors], [Total Files] )
Active Agents := DISTINCTCOUNT ( Production[Agent] )
Files LM := CALCULATE ( [Total Files], PREVIOUSMONTH ( Calendar[Date] ) )
Files MoM % := DIVIDE ( [Total Files] - [Files LM], [Files LM] )
State Share := DIVIDE ( [Total Files], CALCULATE ( [Total Files], ALL ( States ) ) )
Premium := SUMX ( Production, ROUNDUP ( Production[Coverage] / 1000, 0 ) * RELATED ( Rates[Rate] ) )
```

### Quiz

1. Which is evaluated at query time in the filter context of each pivot cell?
- [ ] A calculated column
- [x] A measure
- [ ] A relationship
> Measures recompute per cell; calculated columns are fixed at load.

2. What does `ALL(States)` inside CALCULATE do?
- [x] Removes any filter on the States table for that calculation
- [ ] Selects all states as a text list
- [ ] Counts the states
> ALL clears filters, which is how a share-of-total denominator is built.

3. Why is a marked date table needed?
- [ ] For relationships to work at all
- [x] Time-intelligence functions like TOTALYTD and PREVIOUSMONTH require one
- [ ] To sort months correctly
> DAX time intelligence relies on a contiguous, marked calendar table.

4. Which function gives the number of different agents?
- [ ] COUNT
- [x] DISTINCTCOUNT
- [ ] COUNTROWS
> DISTINCTCOUNT counts unique values of a column and is the reason many people first use the data model.

### Exercises

1. **Late % by state with share of total** — Write measures for late percentage and each state's share of all files.
<details><summary>Solution</summary>

`Late Files := CALCULATE([Total Files], Production[Status] = "Late")`, `Late % := DIVIDE([Late Files], [Total Files])`, `State Share := DIVIDE([Total Files], CALCULATE([Total Files], ALL(States)))`.

</details>

2. **Month-over-month errors** — Compute the change in error rate versus the previous month.
<details><summary>Solution</summary>

`Error Rate LM := CALCULATE([Error Rate], PREVIOUSMONTH(Calendar[Date]))` and `Error Rate Δ := [Error Rate] - [Error Rate LM]`.

</details>

3. **Premium from rates** — Production has Coverage and State; Rates has State and Rate per $1,000. Compute total premium without a helper column.
<details><summary>Solution</summary>

Relate `Production[State]` → `Rates[State]`, then `Premium := SUMX(Production, ROUND(ROUNDUP(Production[Coverage]/1000, 0) * RELATED(Rates[Rate]), 2))`.

</details>

### Interview Questions

**Q: What is the difference between a measure and a calculated column, and when do you use each?**
A calculated column is evaluated row by row at refresh, stored in the model, and can be used on rows, columns, slicers and filters; it consumes memory and never responds to slicers because its value is fixed per row. A measure is a formula evaluated at query time in the filter context of each pivot cell, uses no storage, and is the right tool for any aggregation or ratio. I use columns for attributes such as coverage band or fiscal year that people slice by, and measures for totals, rates, distinct counts and time comparisons. The classic mistake is a calculated column for error rate, which then gets averaged by the pivot and gives an unweighted, wrong number.

**Q: Explain filter context and how CALCULATE changes it.**
Every cell of a pivot carries a filter context: the row headers, column headers, slicers and page filters that apply to it. A measure evaluates its expression under that context, which is why `SUM(Production[Files])` differs in each cell. `CALCULATE` evaluates an expression after modifying the context: adding a filter (`Production[Status]="Late"`), replacing one on the same column, or removing filters with `ALL`, `ALLEXCEPT` or `REMOVEFILTERS`. Share-of-total, "vs last month" and "all states" comparisons are all CALCULATE with a modified context. Understanding that filters from row headers still apply unless explicitly removed is what makes the subtotals come out right.

**Q: How would you convince a team to move a report from formulas to the data model?**
I would show three things: a distinct count of agents per state that SUMIFS cannot produce, a "vs last month" column that took one measure instead of a second SUMIFS grid, and refresh time on the full-year data set where the model answers in under a second while the formula workbook took a minute to recalculate. I would also point out that measures are defined once and reused across every pivot and chart, so the definition of "error rate" is guaranteed consistent, whereas in the formula version it was copied into six sheets. The trade-off is skill: the team needs to learn CALCULATE and relationships, so I pair the migration with a short DAX primer and keep the old workbook for a month as a reconciliation check.

## Rate matrices & competitor comparison models (3,346-row combined rate matrix)

Title-insurance premiums are set by rate manuals: for each state, each policy type and each coverage band, a rate per $1,000 (or a flat amount plus an increment), with rules about rounding, minimum premiums, simultaneous-issue discounts and endorsements. A **rate matrix** in Excel encodes these manuals so a support team can quote instantly and a comparison model can show where one underwriter is cheaper than another. This chapter builds one the way it was done at Stewart Title: a combined matrix of 3,346 rows covering several underwriters and states, with a calculator sheet on top.

### The long-format matrix

The mistake is to build one wide table per underwriter with bands across the top. That looks like the manual but cannot be looked up or appended. The right shape is **long**: one row per underwriter × state × policy type × band.

| Underwriter | State | PolicyType | BandFrom | BandTo | RatePer1000 | FlatAmount | MinPremium | EffectiveDate |
|---|---|---|---|---|---|---|---|---|
| Stewart | WY | Owner | 0 | 100000 | 5.50 | 0 | 150 | 2025-01-01 |
| Stewart | WY | Owner | 100001 | 500000 | 4.25 | 550 | 150 | 2025-01-01 |
| Competitor A | WY | Owner | 0 | 250000 | 5.20 | 0 | 175 | 2025-03-01 |

Bands are cumulative in most manuals: the premium for $187,450 is the flat amount for reaching the band plus the incremental rate on the portion above `BandFrom`. Storing `FlatAmount` (the premium at the bottom of the band) makes each row self-contained. The combined matrix grows to thousands of rows because every underwriter publishes 10–40 bands per policy type per state; 3,346 rows was the size for the states in scope.

### The calculator sheet

Inputs: underwriter, state, policy type, coverage. The lookup selects the band row and computes:

```excel
' Named inputs: UW, ST, PT, COV.  Matrix is a Table named RateMatrix.
Units:   =ROUNDUP(COV/1000, 0)
Row:     =XMATCH(1, (RateMatrix[Underwriter]=UW)*(RateMatrix[State]=ST)*(RateMatrix[PolicyType]=PT)*(RateMatrix[BandFrom]<=COV)*(RateMatrix[BandTo]>=COV))
Rate:    =INDEX(RateMatrix[RatePer1000], Row)
Flat:    =INDEX(RateMatrix[FlatAmount], Row)
From:    =INDEX(RateMatrix[BandFrom], Row)
Raw:     =Flat + ROUNDUP((COV-From)/1000, 0)*Rate
Premium: =MAX(ROUND(Raw, 2), INDEX(RateMatrix[MinPremium], Row))
```

The `XMATCH(1, (…)*(…))` pattern finds the single row meeting all five conditions. For Excel 2016 the same is `MATCH(1, (…)*(…), 0)` entered with `Ctrl+Shift+Enter`. `LET` makes this one cell:

```excel
=LET(
  hit,  (RateMatrix[Underwriter]=UW)*(RateMatrix[State]=ST)*(RateMatrix[PolicyType]=PT)*(RateMatrix[BandFrom]<=COV)*(RateMatrix[BandTo]>=COV),
  row,  XMATCH(1, hit),
  rate, INDEX(RateMatrix[RatePer1000], row),
  flat, INDEX(RateMatrix[FlatAmount], row),
  from, INDEX(RateMatrix[BandFrom], row),
  minp, INDEX(RateMatrix[MinPremium], row),
  MAX(ROUND(flat + ROUNDUP((COV-from)/1000, 0)*rate, 2), minp)
)
```

Wrap the calculation in a named LAMBDA `PREMIUM(uw, st, pt, cov)` so the comparison sheet can call it per underwriter.

### Simultaneous issue and endorsements

A lender's policy issued with an owner's policy is usually a flat simultaneous-issue fee if its coverage does not exceed the owner's, otherwise the difference is rated. Encode it as a rule table (`Underwriter, State, SimultaneousFee, ExcessRateType`) and a formula:

```excel
=IF(LenderCov<=OwnerCov, SimFee, SimFee + PREMIUM(UW, ST, "Lender", LenderCov) - PREMIUM(UW, ST, "Lender", OwnerCov))
```

Endorsements are a lookup table of code → flat fee or percentage of premium, summed with `SUMIFS` over the selected codes.

### Competitor comparison

Put underwriters across the top and a set of test scenarios (state, policy type, coverage) down the side; each cell is `=PREMIUM(B$1, $A2, $B2, $C2)`. Add a column for the minimum and a formula `=INDEX($D$1:$H$1, MATCH(MIN(D2:H2), D2:H2, 0))` naming the cheapest underwriter. Conditional formatting highlights the minimum per row. A second grid shows each underwriter's difference from Stewart as a percentage: `=D2/$D2-1`. Charts of premium against coverage per underwriter reveal where band boundaries make one underwriter cheaper.

### Validating the matrix

- **Band continuity**: for each underwriter/state/type, sorted by `BandFrom`, `BandTo` of one row + 1 must equal `BandFrom` of the next. A Power Query group-by with an index or a `SUMPRODUCT` check flags gaps and overlaps.
- **Manual spot checks**: ten known quotes from the published manual per underwriter, stored on a *Tests* sheet with expected premiums and a `=PREMIUM(...)=Expected` column; any `FALSE` blocks release.
- **Effective dating**: filter on `EffectiveDate <= QuoteDate` and pick the latest with `XLOOKUP(..., search_mode -1)` after sorting by date.
- **Version control**: the matrix is loaded from a maintained CSV through Power Query; the workbook itself never has hand-typed rates.

### Performance at 3,346 rows

Five boolean array multiplications over 3,346 rows per calculator cell is trivial (about 17,000 comparisons). The comparison grid with 200 scenarios × 5 underwriters is a million comparisons, still under a second. If the matrix grows to 100,000 rows or the grid to thousands of scenarios, move the band selection into Power Query (merge on underwriter/state/type, filter by band) or the data model with a `SUMX` over the matrix.

> **Interview note:** A rate-matrix question tests whether you normalise data. The wrong answer is a sheet per underwriter; the right one is a single long table with a key on every column you filter by, and a calculator that never hard-codes a rate.

### Try It Yourself

```excel
' Named LAMBDA: PREMIUM  (Formulas → Name Manager → New)
=LAMBDA(uw, st, pt, cov,
  LET(
    hit,  (RateMatrix[Underwriter]=uw)*(RateMatrix[State]=st)*(RateMatrix[PolicyType]=pt)*(RateMatrix[BandFrom]<=cov)*(RateMatrix[BandTo]>=cov),
    row,  XMATCH(1, hit),
    rate, INDEX(RateMatrix[RatePer1000], row),
    flat, INDEX(RateMatrix[FlatAmount], row),
    from, INDEX(RateMatrix[BandFrom], row),
    minp, INDEX(RateMatrix[MinPremium], row),
    IF(ISNA(row), NA(), MAX(ROUND(flat + ROUNDUP((cov-from)/1000, 0)*rate, 2), minp))
  ))
' Comparison grid: underwriters in D1:H1, scenarios in A2:C200
D2: =PREMIUM(D$1, $A2, $B2, $C2)
I2: =INDEX($D$1:$H$1, MATCH(MIN(D2:H2), D2:H2, 0))        cheapest underwriter
J2: =D2/MIN(D2:H2)-1                                       Stewart premium over the cheapest
' Band continuity check (matrix sorted by Underwriter, State, PolicyType, BandFrom)
=IF(AND(A3=A2, B3=B2, C3=C2), D3=E2+1, TRUE)               must be TRUE on every row
```

### Quiz

1. Why store the rate matrix in long format rather than one wide sheet per underwriter?
- [x] So a single lookup finds any band and new underwriters are appended, not re-built
- [ ] Because wide sheets exceed the column limit
- [ ] Long format is required by PivotTables only
> Normalised long data is lookup-able, appendable and validatable; wide layouts are not.

2. What does `XMATCH(1, (a)*(b)*(c))` return?
- [ ] The count of matching rows
- [x] The position of the first row where every condition is TRUE
- [ ] TRUE or FALSE
> The product of boolean arrays is 1 only where all are true; XMATCH finds that position.

3. What is the purpose of the FlatAmount column?
- [ ] The minimum premium
- [x] The premium accumulated at the bottom of the band, so each row is self-contained
- [ ] The underwriter's flat fee for endorsements
> Cumulative band pricing needs the amount already earned by lower bands.

4. How do you guard against gaps between bands?
- [ ] Sort the matrix descending
- [x] Check that each row's BandFrom equals the previous row's BandTo + 1 within the same key
- [ ] Use approximate-match lookups
> A continuity test on sorted keys catches gaps and overlaps before they misquote.

### Exercises

1. **Effective-dated lookup** — The matrix has several effective dates per band. Return the row valid on the quote date.
<details><summary>Solution</summary>

Add `(RateMatrix[EffectiveDate]<=QuoteDate)` to the boolean product, sort the matrix by EffectiveDate ascending, and use `XMATCH(1, hit, 0, -1)` to take the last (latest) match.

</details>

2. **Cheapest-underwriter summary** — Count how many of 200 scenarios each underwriter wins.
<details><summary>Solution</summary>

With the winner names in `I2:I201`: `=COUNTIF($I$2:$I$201, D$1)` under each underwriter header.

</details>

3. **Manual spot-check sheet** — Build a Tests sheet that fails the workbook if any known quote does not match.
<details><summary>Solution</summary>

Columns: Underwriter, State, Type, Coverage, Expected, Actual `=PREMIUM(A2,B2,C2,D2)`, Pass `=ROUND(E2,2)=ROUND(F2,2)`. Status cell: `=IF(COUNTIF(G:G, FALSE)=0, "ALL TESTS PASS", COUNTIF(G:G, FALSE)&" FAILURES")` with red conditional formatting.

</details>

### Interview Questions

**Q: Walk me through how you built a combined rate matrix for several underwriters.**
I read each manual and normalised it into one long Table: underwriter, state, policy type, band from and to, rate per thousand, flat amount at the band floor, minimum premium and effective date. For the states in scope that produced 3,346 rows. The rates were maintained in a CSV under version control and loaded through Power Query, so nothing was hand-typed into the workbook. On top sat a calculator built as a named LAMBDA that selects the band row with a multi-condition XMATCH and applies the manual's rounding and minimum rules, and a comparison grid that called it for each underwriter across a set of scenarios. A Tests sheet held known quotes from each manual, and a continuity check confirmed bands had no gaps or overlaps. Support staff got a quote in seconds and management got a heat map of where we were undercut.

**Q: How do you implement cumulative band pricing correctly?**
Each band row stores the premium already accumulated at its floor, so the quote is flat amount plus the incremental rate on the coverage above the floor, in whole thousands rounded up, then rounded to cents and floored at the minimum premium. Storing the flat amount avoids recomputing lower bands in the formula and makes each row independently testable against the manual. The alternative of summing all lower bands at quote time is slower and fragile if a band is missing. I verify the flat amounts themselves with a `SCAN` over the sorted bands that recomputes them and compares to the stored values.

**Q: What would you change if the matrix grew to a million rows?**
Formula-based lookups over a million-row Table become slow when hundreds of cells each evaluate five boolean arrays. I would move the matrix into the data model, relate a scenario table to it on underwriter, state and policy type, and compute the premium with a DAX measure using `CALCULATE` with a band filter, or pre-join scenarios to bands in Power Query where filtering folds to the source. The calculator UI would stay in Excel but call a single measure through a data-model pivot or CUBEVALUE. Alternatively the rating logic moves to a Python or SQL service and Excel becomes the front end, which is what happens when more than one system needs the quotes.

## Performance, volatile functions & structured references

A workbook that takes thirty seconds to recalculate after every keystroke is not "big"; it is badly built. Excel's calculation engine is fast when formulas are cheap and dependencies are clear, and slow when the same expensive work is repeated in thousands of cells or when volatile functions force everything to recalculate. This chapter explains how the engine decides what to recalculate, which functions to avoid, and how to structure a large model so it stays responsive.

### How recalculation works

Excel maintains a **dependency tree**: for every formula it knows which cells feed it. When a cell changes, only formulas downstream of it are marked dirty and recalculated (**smart recalc**), in an order determined by the **calculation chain**. The first calculation after opening builds the chain and is slow; subsequent edits are fast unless something forces a full recalc. `F9` recalculates dirty cells, `Ctrl+Alt+F9` forces a full recalculation of everything, and `Ctrl+Alt+Shift+F9` also rebuilds the dependency tree.

**File → Options → Formulas → Calculation options**: Automatic, Automatic except for data tables, Manual. Manual mode is a working tool for heavy models (edit many inputs, press F9 once) but a delivery hazard: a recipient who does not know it is on sees stale numbers. The setting is application-wide and is taken from the first workbook opened in the session.

### Volatile functions

A **volatile** function recalculates on every change anywhere in the workbook, and so does every formula depending on it. The list:

| Function | Volatile alternative |
|---|---|
| `NOW()`, `TODAY()` | One `ReportDate` cell, referenced everywhere |
| `RAND()`, `RANDBETWEEN()`, `RANDARRAY()` | Paste values once generated |
| `OFFSET()` | `INDEX(range, r, c)` or `INDEX:INDEX` ranges |
| `INDIRECT()` | `CHOOSE`, `SWITCH`, or a direct reference; restructure so it is unnecessary |
| `CELL()`, `INFO()` (some arguments) | Avoid |
| `SUMIF` with mismatched range sizes | Make ranges equal |

Conditional formatting rules and data validation formulas that use these are also volatile. One `OFFSET` in a named range used by 5,000 formulas makes those 5,000 formulas recalculate on every edit. `INDEX` returning a reference (`=SUM(INDEX(B:B, 2):INDEX(B:B, COUNTA(B:B)))`) achieves the same dynamic range without volatility.

### Expensive patterns

- **Whole-column references in array formulas**: `SUMPRODUCT((A:A="WY")*B:B)` evaluates a million rows. `SUMIFS` is safe with `A:A`; `SUMPRODUCT`, `FILTER` and array math are not. Use Table columns.
- **Repeated lookups**: 50 columns each doing `XLOOKUP(key, …)` against the same table. Look up the row number once (`XMATCH`) in a helper column and use `INDEX` on it.
- **Running totals as `=SUM($B$2:B2)`**: O(n²). Use `=B2+C1` or `SCAN`.
- **Nested `VLOOKUP` inside `IFERROR` chains**: each miss triggers the next lookup. A single `XLOOKUP` with `if_not_found`.
- **Array formulas over full tables**: `FILTER(Prod, …)` in hundreds of cells. Filter once, reference the spill.
- **Cross-workbook links**: Every open link is re-resolved; consolidate with Power Query.
- **Data tables** (What-If): recalculated fully on every change; switch to *Automatic except for data tables*.
- **Thousands of conditional-formatting rules** from copy-paste fragmentation.

### Measuring

Charles Williams' FastExcel approach still applies: time a full recalc with a small VBA stub or simply watch the status-bar *Calculating (n processors): x %*. Use **Formulas → Calculate Sheet** to isolate a slow sheet. The **Inquire** add-in (Professional Plus) reports formula counts per sheet, and **Workbook Statistics** on the Review tab counts cells and formulas.

```vba
Sub TimeRecalc()
    Dim t As Double: t = Timer
    Application.CalculateFull
    Debug.Print "Full recalc: " & Format(Timer - t, "0.00") & " s"
End Sub
```

### Structured references and performance

Table columns are bounded by the Table's used rows, so `SUMIFS(tbl[Files], tbl[State], "WY")` scans only real data. They also survive inserts and renames. Two costs: Tables with hundreds of thousands of rows and many calculated columns recalculate the whole column when a row is added, and structured references cannot be used in some contexts (data validation source, chart series) without a name. Very large Tables can be converted back to ranges with **Table Design → Convert to Range** once loading is done, but the better design is to keep raw data in the data model and only summaries on sheets.

### Multithreading and file size

Excel uses all cores for independent calculation chains (**Options → Advanced → Enable multi-threaded calculation**). Formulas that depend on one long chain cannot parallelise. File size is driven by the used range (press `Ctrl+End` to see if it extends far beyond the data; delete the empty rows and columns and save), by pivot caches (untick *Save source data with file*), and by formatting applied to whole columns. Saving as `.xlsb` (binary) halves size and load time for large workbooks at the cost of some tooling compatibility.

### A performance checklist

1. Replace volatile functions.
2. Bound every array formula to Table columns.
3. Look up once, index many.
4. Move cleaning to Power Query and aggregation to the data model.
5. Paste values on archived sheets.
6. Clear fragmented conditional formatting.
7. Trim the used range and save as `.xlsb` if still heavy.

> **Tip:** Before optimising, find the slow sheet. Set calculation to Manual, then Calculate Sheet on each in turn while watching the clock. Optimising a sheet that takes 0.1 s of a 30 s recalc is wasted effort.

### Try It Yourself

```excel
' Non-volatile dynamic range replacing OFFSET
Name: FilesRange   =Data!$B$2:INDEX(Data!$B:$B, COUNTA(Data!$B:$B))
' Look up the row once, then INDEX many columns
H2: =XMATCH(A2, Rates[State])
I2: =INDEX(Rates[Rate], H2)
J2: =INDEX(Rates[Fee], H2)
K2: =INDEX(Rates[MinPremium], H2)
' Running total, O(n)
C2: =B2
C3: =C2+B3
' or in 365, one spill:  =SCAN(0, tbl[Files], LAMBDA(a, x, a + x))
' Single report date instead of TODAY() in 5,000 cells
ReportDate: =MAX(Prod[Date])
```

### Quiz

1. Which function is volatile?
- [ ] INDEX
- [x] OFFSET
- [ ] XLOOKUP
> OFFSET, INDIRECT, NOW, TODAY, RAND and CELL recalculate on every change.

2. What does Ctrl+Alt+F9 do?
- [ ] Recalculates only dirty cells
- [x] Forces a full recalculation of all formulas
- [ ] Rebuilds the dependency tree only
> F9 is smart recalc; Ctrl+Alt+F9 is full; Ctrl+Alt+Shift+F9 also rebuilds dependencies.

3. Why is `=SUM($B$2:B2)` filled down slow on 100,000 rows?
- [x] Each row re-sums from the top, so total work grows with the square of the row count
- [ ] SUM is volatile
- [ ] Absolute references are slow
> `=C1+B2` or SCAN does the same in linear time.

4. Which whole-column reference is safe?
- [x] `SUMIFS(C:C, A:A, "WY")`
- [ ] `SUMPRODUCT((A:A="WY")*C:C)`
- [ ] `FILTER(A:C, A:A="WY")`
> SUMIFS limits itself to the used range; array math evaluates every row.

### Exercises

1. **De-volatilise a named range** — Rewrite `=OFFSET(Data!$A$2,0,0,COUNTA(Data!$A:$A)-1,1)` without OFFSET.
<details><summary>Solution</summary>

`=Data!$A$2:INDEX(Data!$A:$A, COUNTA(Data!$A:$A))`. INDEX returning a reference is not volatile.

</details>

2. **Collapse repeated lookups** — Twelve columns each use `XLOOKUP($A2, Rates[State], Rates[col])`. Restructure.
<details><summary>Solution</summary>

Add a hidden helper `=XMATCH($A2, Rates[State])` in `Z2`; each column becomes `=INDEX(Rates[col], $Z2)`. Alternatively one `=XLOOKUP($A2, Rates[State], Rates[[Rate]:[MinPremium]])` that spills all twelve.

</details>

3. **Diagnose a slow file** — Describe the steps to find why a 40 MB workbook takes 45 seconds to open and recalc.
<details><summary>Solution</summary>

Check `Ctrl+End` on each sheet for bloated used ranges; Review → Workbook Statistics for formula counts; Manage Rules for fragmented conditional formatting; Name Manager for OFFSET/INDIRECT names; Data → Queries & Connections for external links; PivotTable Options for saved caches. Fix in that order, then time with `Application.CalculateFull`.

</details>

### Interview Questions

**Q: What are volatile functions and why do they matter?**
Volatile functions recalculate whenever anything in the workbook changes, regardless of whether their inputs changed, and they mark every dependent formula dirty too. `NOW`, `TODAY`, `RAND`, `RANDBETWEEN`, `OFFSET`, `INDIRECT` and `CELL` are the common ones. One `OFFSET`-based named range feeding a thousand `SUMIFS` formulas means a thousand recalculations on every keystroke. I replace `OFFSET` with `INDEX:INDEX` ranges, `INDIRECT` with restructured direct references or `CHOOSE`, and `TODAY()` with a single dated cell. In a status report I inherited this change alone took recalculation from twelve seconds to under one.

**Q: How does Excel decide what to recalculate?**
It keeps a dependency tree and a calculation chain. In automatic mode an edit marks the changed cell's dependents dirty, and only those are recalculated, in chain order, using multiple threads for independent branches. Volatile cells and their dependents are always dirty. A full recalc (`Ctrl+Alt+F9`) ignores the dirty flags, and a rebuild (`Ctrl+Alt+Shift+F9`) reconstructs the tree, which is needed after certain corruptions or when links behave oddly. Knowing this explains why the first calc after open is slow, why manual mode helps during bulk input, and why the goal of optimisation is fewer dirty cells and cheaper formulas rather than "a faster computer".

**Q: A client's 500,000-row workbook is unusable. What is your plan?**
First, a diagnosis: used-range bloat, formula counts, volatile names, conditional-formatting fragmentation, external links and pivot caches. Then an architectural fix rather than tweaks: raw data goes to the data model through Power Query, aggregations become DAX measures, and the sheets keep only inputs, summaries and presentation. Remaining formulas are bounded to Table columns, lookups are done once per row with `XMATCH` plus `INDEX`, running totals become linear, and the file is saved as `.xlsb`. I validate by reconciling totals with the old workbook and by timing a full recalc before and after. Typically the file shrinks by an order of magnitude and recalc drops from minutes to seconds.

## Macros/VBA basics & Office Scripts

When a task cannot be expressed as a formula or a Power Query step, such as saving each state's sheet to its own PDF, renaming forty tabs or emailing a report, you automate it with code. Excel offers two languages: **VBA** (Visual Basic for Applications), available in desktop Excel since 1993, and **Office Scripts** (TypeScript), available in Excel for the web and Microsoft 365 desktop with a business licence. This chapter covers enough of each to automate real reporting work and to know which one to choose.

### Recording a macro

**View → Macros → Record Macro** (or the recorder icon in the status bar). Give it a name, optionally a shortcut, choose *This Workbook* or *Personal Macro Workbook* (available in every file), and perform the steps. Stop recording. **Alt+F11** opens the **Visual Basic Editor** (VBE) where the recorded code sits in `Module1`:

```vba
Sub FormatReport()
    Range("A1:F1").Font.Bold = True
    Columns("A:F").AutoFit
    ActiveSheet.ListObjects.Add(xlSrcRange, Range("A1").CurrentRegion, , xlYes).Name = "tblProduction"
End Sub
```

Recorded code is verbose (`Select` then `Selection.`), and is a starting point, not a finished product. Save the file as `.xlsm`; `.xlsx` silently strips macros.

### The object model

Everything is an object in a hierarchy: `Application → Workbooks → Worksheets → Range`. Objects have properties (`Range("A1").Value`) and methods (`Worksheets("Data").Copy`). Use `With` blocks and object variables instead of `Select`:

```vba
Sub SplitByState()
    Dim ws As Worksheet, tbl As ListObject, states As Object, key As Variant
    Set ws = ThisWorkbook.Worksheets("Data")
    Set tbl = ws.ListObjects("tblProduction")
    Set states = CreateObject("Scripting.Dictionary")
    Dim r As ListRow
    For Each r In tbl.ListRows
        states(r.Range.Cells(1, 2).Value) = 1     ' column 2 = State
    Next r
    For Each key In states.Keys
        tbl.Range.AutoFilter Field:=2, Criteria1:=key
        Dim newWs As Worksheet
        Set newWs = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
        newWs.Name = Left(key, 31)
        tbl.Range.SpecialCells(xlCellTypeVisible).Copy newWs.Range("A1")
        newWs.Columns.AutoFit
    Next key
    tbl.AutoFilter.ShowAllData
End Sub
```

That macro creates one sheet per state from a Table, which is a weekly request in production support. Key points: `Dim` declares variables (put `Option Explicit` at the top of every module so typos fail loudly), `Set` assigns objects, `For Each` loops collections, and `SpecialCells(xlCellTypeVisible)` copies only filtered rows.

### Export each sheet to PDF

```vba
Sub ExportSheetsToPdf()
    Dim ws As Worksheet, folder As String
    folder = ThisWorkbook.Path & "\PDF\"
    If Dir(folder, vbDirectory) = "" Then MkDir folder
    For Each ws In ThisWorkbook.Worksheets
        If ws.Visible = xlSheetVisible And ws.Name <> "Data" Then
            ws.PageSetup.FitToPagesWide = 1
            ws.PageSetup.Zoom = False
            ws.ExportAsFixedFormat Type:=xlTypePDF, _
                Filename:=folder & ws.Name & "_" & Format(Date, "yyyy-mm-dd") & ".pdf", _
                Quality:=xlQualityStandard, OpenAfterPublish:=False
        End If
    Next ws
End Sub
```

### Speed and safety

```vba
Application.ScreenUpdating = False
Application.Calculation = xlCalculationManual
Application.EnableEvents = False
' ... work ...
Application.Calculation = xlCalculationAutomatic
Application.EnableEvents = True
Application.ScreenUpdating = True
```

Reading and writing cells one at a time is slow; read a range into a `Variant` array (`arr = rng.Value`), loop in memory, write back with `rng.Value = arr`. Add `On Error GoTo Handler` with a handler that restores the application settings, otherwise a crash leaves calculation in manual mode.

### Events and UDFs

Sheet and workbook modules can respond to events: `Worksheet_Change` runs when a cell is edited, `Workbook_Open` when the file opens. A **user-defined function** is a `Function` in a module callable from cells: `=PREMIUM(B2, C2)` could be VBA rather than LAMBDA, at the cost of requiring macros enabled.

### Security

Macros are disabled by default and files downloaded from the internet are blocked (**Mark of the Web**). Sign macros with a certificate (**Tools → Digital Signature** in the VBE), store trusted files in a **Trusted Location** (File → Options → Trust Center), and never ask users to lower security globally.

### Office Scripts

In Excel for the web (and desktop 365 with Automate tab), **Automate → Record Actions** or **New Script** opens a TypeScript editor. Scripts are stored in OneDrive/SharePoint, run in the browser, and can be triggered from Power Automate flows on a schedule or when a file lands in a folder.

```ts
function main(workbook: ExcelScript.Workbook) {
  const sheet = workbook.getWorksheet("Data");
  const table = sheet.getTable("tblProduction") ?? sheet.addTable(sheet.getUsedRange(), true);
  table.setName("tblProduction");
  table.getColumnByName("Agent").getRangeBetweenHeaderAndTotal().getFormat().getFont().setBold(false);
  const rows = table.getRangeBetweenHeaderAndTotal().getValues();
  const late = rows.filter(r => r[5] === "Late").length;
  workbook.getWorksheet("Summary").getRange("B2").setValue(late);
}
```

Office Scripts cannot access the local file system, cannot show dialogs, and have no `Application` object, but they run without a desktop, need no security prompts, and integrate with flows. VBA cannot run in the browser or unattended in the cloud.

| Need | Choose |
|---|---|
| Desktop-only, file system, Outlook, dialogs | VBA |
| Runs in browser or on a schedule via Power Automate | Office Scripts |
| Must work in Excel 2016/2019 | VBA |
| Mac users | VBA (limited) or Office Scripts |
| Bulk cell logic | Prefer formulas, Power Query or LAMBDA first |

> **Warning:** Macros are a maintenance liability. Before writing one, ask whether Power Query, a LAMBDA or a PivotTable solves the problem. Reserve VBA and Office Scripts for file operations, output generation and orchestration, not for calculations.

### Try It Yourself

```vba
Option Explicit

' Save every visible sheet except Data as a dated PDF in a PDF subfolder
Sub ExportSheetsToPdf()
    Dim ws As Worksheet, folder As String
    On Error GoTo Handler
    Application.ScreenUpdating = False
    folder = ThisWorkbook.Path & "\PDF\"
    If Dir(folder, vbDirectory) = "" Then MkDir folder
    For Each ws In ThisWorkbook.Worksheets
        If ws.Visible = xlSheetVisible And ws.Name <> "Data" Then
            With ws.PageSetup
                .Zoom = False
                .FitToPagesWide = 1
                .FitToPagesTall = False
            End With
            ws.ExportAsFixedFormat Type:=xlTypePDF, _
                Filename:=folder & ws.Name & "_" & Format(Date, "yyyy-mm-dd") & ".pdf", _
                OpenAfterPublish:=False
        End If
    Next ws
Handler:
    Application.ScreenUpdating = True
    If Err.Number <> 0 Then MsgBox "Export failed: " & Err.Description, vbExclamation
End Sub
```

### Quiz

1. Which file extension keeps VBA macros?
- [ ] .xlsx
- [x] .xlsm
- [ ] .csv
> .xlsx strips code silently; .xlsm and .xlsb keep it.

2. What does `Option Explicit` do?
- [x] Requires every variable to be declared, so typos become errors
- [ ] Turns on screen updating
- [ ] Enables events
> Undeclared variables default to Variant and mistyped names silently create new ones.

3. Which can run on a schedule without a desktop Excel open?
- [ ] VBA
- [x] Office Scripts via Power Automate
- [ ] A recorded macro
> Office Scripts run in the cloud; VBA needs a desktop session.

4. Why read a range into an array before looping?
- [ ] Arrays are required by For loops
- [x] Cell-by-cell access is slow; in-memory loops are far faster
- [ ] Ranges cannot be looped
> Each cell read is a COM call; one `rng.Value` read fetches everything at once.

### Exercises

1. **Sheet per state** — Write a macro that creates one sheet per distinct State from `tblProduction`, copying visible rows.
<details><summary>Solution</summary>

Use the `SplitByState` pattern: collect distinct states in a `Scripting.Dictionary`, loop them, apply `AutoFilter Field:=2, Criteria1:=key`, add a sheet named `Left(key, 31)`, copy `SpecialCells(xlCellTypeVisible)`, then `ShowAllData`.

</details>

2. **Timestamp on edit** — When any cell in column F (Status) changes, write the current time in column G of the same row.
<details><summary>Solution</summary>

In the sheet module:
```vba
Private Sub Worksheet_Change(ByVal Target As Range)
    If Not Intersect(Target, Me.Range("F:F")) Is Nothing Then
        Application.EnableEvents = False
        Target.Offset(0, 1).Value = Now
        Application.EnableEvents = True
    End If
End Sub
```

</details>

3. **Office Script summary** — Count rows where Status is Late and write it to Summary!B2.
<details><summary>Solution</summary>

Use the `main` script shown above: get the table's data body with `getRangeBetweenHeaderAndTotal().getValues()`, `filter` on the status column index, and `setValue` on the target range.

</details>

### Interview Questions

**Q: When would you write a macro rather than use formulas or Power Query?**
Only for things the calculation layer cannot do: creating files, exporting PDFs, sending emails through Outlook, renaming or splitting sheets, or orchestrating a sequence of refreshes and saves. Calculations belong in formulas, measures or LAMBDAs because they are transparent and recalculate live, and data shaping belongs in Power Query because it is repeatable and auditable. For a weekly pack I keep the workbook macro-free and put the export logic in a separate `.xlsm` or an Office Script triggered by Power Automate, so the report itself opens without security prompts for the managers who receive it.

**Q: Compare VBA and Office Scripts.**
VBA is a desktop-only, mature language with full access to the Excel object model, the file system and other Office applications, but it cannot run in the browser or unattended in the cloud, needs security trust, and is not available on Excel for the web. Office Scripts are TypeScript, stored in the cloud, run in Excel for the web and desktop 365, integrate with Power Automate for scheduled or event-driven runs, and need no security prompts, but they cannot touch local files, show dialogs or control other applications, and they require a business licence. For a scheduled export to SharePoint I use Office Scripts; for a desktop tool that emails PDFs from Outlook I use VBA.

**Q: How do you make a macro fast and safe?**
Turn off `ScreenUpdating`, set calculation to manual and disable events during the run, and restore them in an error handler so a failure never leaves Excel in manual mode. Avoid `Select` and `Activate`; work with object variables and `With` blocks. Move data into arrays for loops rather than touching cells individually, and write results back in one assignment. Use `Option Explicit`, meaningful names and a single exit point. Finally, test on a copy of the workbook, because a macro has no undo.

## Error-proofing & auditing (trace precedents, Evaluate Formula)

A report is only as good as the confidence people have in it. A single wrong number found by a manager discredits every other number in the pack. Expert analysts build workbooks that check themselves, and they know Excel's auditing tools well enough to find the cause of any discrepancy in minutes. This chapter covers the auditing toolbar, systematic checks, protection and the review routine before a report leaves your desk.

### The Formula Auditing group

**Formulas → Formula Auditing** contains:

| Tool | Use |
|---|---|
| **Trace Precedents** | Draws arrows from the cells that feed the selected formula. Press again to go a level further back. |
| **Trace Dependents** | Arrows to the cells that use this cell. Essential before deleting or changing anything. |
| **Remove Arrows** | Clear. |
| **Show Formulas** (`Ctrl+`` `) | Display formulas instead of values, sheet-wide. |
| **Error Checking** | Walks through every cell with an error or an inconsistency flag. |
| **Evaluate Formula** | Steps through a formula one operation at a time, showing intermediate results. |
| **Watch Window** | Pins cells from any sheet so you can watch them change while editing elsewhere. |

A dashed arrow with a small sheet icon means the precedent is on another sheet or workbook; double-click the arrow to jump there.

**Evaluate Formula** is the tool for understanding a formula you did not write. Select the cell, open the dialog, and press **Evaluate** repeatedly; the underlined expression is replaced by its value at each step. **Step In** descends into a referenced cell's formula. When a `LET` or nested `IF` gives a surprising result, this shows exactly which branch fired.

### Go To Special

`F5 → Special` (or `Ctrl+G`) selects cells by type:

- **Formulas** vs **Constants**: select the calculation block, choose Constants, and any hard-coded number that should be a formula lights up.
- **Row differences**: select a row of formulas and find the one that differs from the others.
- **Blanks**: find gaps in a column that should be full.
- **Precedents / Dependents**: like the arrows, but as a selection you can colour.

### Inconsistent formula flags

The green triangle in a cell's corner with *Inconsistent formula* means the formula differs from its neighbours in a filled column. Under **Error Checking Options** you can turn each rule on or off; leave *Formulas inconsistent with other formulas in the region* and *Numbers formatted as text* on.

### Building checks into the workbook

A **Checks** sheet is standard practice in financial modelling and worth copying into reporting:

```excel
' Row counts reconcile between source and report
=ROWS(tblProduction) = COUNTA(Report!A:A)-1
' Totals reconcile
=ABS(SUM(tblProduction[Files]) - SUM(Report!B:B)) < 0.005
' No errors anywhere on the report sheet
=SUMPRODUCT(--ISERROR(Report!A1:Z500)) = 0
' No duplicate file numbers
=ROWS(tblProduction) = ROWS(UNIQUE(tblProduction[File]))
' Rates all within a plausible band
=AND(MIN(Rates[Rate]) >= 1, MAX(Rates[Rate]) <= 20)
' Master check
=AND(C2:C6)   → displayed large, green if TRUE, red if FALSE
```

Link the master check to a cell on the dashboard so the status is visible on the page a manager sees. Every unexpected `FALSE` has stopped a wrong report at least once.

### Sheet and workbook protection

- **Format Cells → Protection → Locked/Hidden**: unlock input cells, tick *Hidden* on formula cells you do not want shown in the formula bar, then **Review → Protect Sheet**. Allow only *Select unlocked cells* for a form-like input sheet.
- **Protect Workbook** prevents adding, deleting or renaming sheets.
- Protection is not security: the password can be removed by editing the file's XML. It prevents accidents, not attackers.
- **Allow Edit Ranges** grants specific users editing rights to specific ranges on a protected sheet.

### Inquire and comparing versions

Excel Professional Plus and Microsoft 365 Apps for enterprise include the **Inquire** add-in (Options → Add-ins → COM Add-ins). **Compare Files** shows cell-level differences between two versions of a workbook, **Workbook Analysis** lists formulas, links, hidden sheets and errors, and **Clean Excess Cell Formatting** shrinks bloated files. Without Inquire, a quick comparison is a third workbook with `=IF(Old!A1<>New!A1, "diff", "")` filled across the range.

### Version and change discipline

- Keep an *About* sheet: purpose, owner, source files, refresh steps, change log with dates.
- Name versions `Report_2026-09-16_v3.xlsx`; never `final_final`.
- Store the report in SharePoint or OneDrive for version history and co-authoring.
- Before sending: **File → Info → Check for Issues → Inspect Document** removes hidden names, comments and personal metadata.

### The pre-send review

1. Refresh All, then check the Checks sheet.
2. `Ctrl+`` ` and scan for hard-coded numbers in formula blocks; Go To Special → Constants.
3. Spot-check three numbers against the source by hand.
4. Open every hidden sheet once to confirm nothing sensitive is there.
5. Print preview every visible sheet.
6. Save a values-only PDF alongside the workbook.

> **Interview note:** "Tell me about a time you found an error in a report" is a behavioural question with a technical answer. Describe the check that caught it, the auditing tool that traced it, and the control you added so it cannot recur.

### Try It Yourself

```excel
' Checks sheet for a weekly production report
A1: Check                              B1: Result
A2: Source rows = report rows          B2: =ROWS(tblProduction)=COUNTA(Report!A:A)-1
A3: Files total reconciles             B3: =ABS(SUM(tblProduction[Files])-SUM(Report!C:C))<0.005
A4: No errors on Report                B4: =SUMPRODUCT(--ISERROR(Report!A1:Z500))=0
A5: File numbers unique                B5: =ROWS(tblProduction)=ROWS(UNIQUE(tblProduction[File]))
A6: Dates within period                B6: =AND(MIN(tblProduction[Date])>=PeriodStart, MAX(tblProduction[Date])<=PeriodEnd)
A7: No agent with rate above 10%       B7: =MAXIFS(Report!E:E, Report!E:E, "<1")<=0.1
A9: ALL CHECKS                          B9: =IF(AND(B2:B7), "PASS", "FAIL")
' Conditional formatting on B9: ="PASS" green fill, otherwise red fill
' Dashboard cell:  =Checks!B9
```

### Quiz

1. Which tool shows intermediate results of a formula step by step?
- [ ] Trace Precedents
- [x] Evaluate Formula
- [ ] Watch Window
> Evaluate Formula replaces each underlined sub-expression with its value in turn.

2. How do you find hard-coded numbers inside a block that should be all formulas?
- [x] Go To Special → Constants
- [ ] Trace Dependents
- [ ] Show Formulas only
> Selecting the block and choosing Constants highlights the typed-in values.

3. Is sheet protection a security control?
- [ ] Yes, passwords cannot be bypassed
- [x] No, it prevents accidental edits but can be removed by editing the file
> Protection is a safety rail, not encryption.

4. What is the purpose of a Checks sheet?
- [ ] To store test data
- [x] To reconcile totals and flag errors automatically so a wrong report cannot be sent unnoticed
- [ ] To list keyboard shortcuts
> Self-checking workbooks are the main defence against silent errors.

### Exercises

1. **Trace a wrong total** — A dashboard tile shows fewer files than the source. Describe the tool sequence to locate the cause.
<details><summary>Solution</summary>

Select the tile; Trace Precedents to the SUMIFS or pivot cell; Evaluate Formula to see the criteria values being compared; if a criterion cell is involved, Step In. Compare against `=SUM(tblProduction[Files])` directly. Typical findings: a stale pivot cache (Refresh), a criteria cell with a trailing space, or a range that stops short of new rows.

</details>

2. **Protect an input sheet** — Allow agents to edit only `B2:F1000`, hide formulas in column G, and stop sheet renames.
<details><summary>Solution</summary>

Select all → `Ctrl+1` → Protection → Locked on. Select `B2:F1000` → Locked off. Select `G:G` → Hidden on. Review → Protect Sheet with a password, allowing only *Select unlocked cells*. Review → Protect Workbook → Structure.

</details>

3. **Difference report** — Compare two versions of a rates sheet without Inquire.
<details><summary>Solution</summary>

In a new sheet: `=IF(Old!A1<>New!A1, "diff", "")` filled over the full range, then `=COUNTIF(A:Z, "diff")` as the summary and conditional formatting on "diff". In 365: `=IF(Old!A1:F3346<>New!A1:F3346, "diff", "")` spills the whole comparison.

</details>

### Interview Questions

**Q: How do you make sure a report you send is correct?**
By building the checks into the workbook rather than relying on eyesight. A Checks sheet reconciles row counts and totals between source and report, tests for errors, duplicates and out-of-range values, and rolls up to a single PASS/FAIL cell that is displayed on the dashboard. Before sending I refresh, read that cell, scan the formula blocks for constants with Go To Special, spot-check three numbers by hand against the source, and print-preview. For recurring reports the checks catch upstream changes the moment they happen, such as a source column renamed or a new state that has no rate row.

**Q: Explain Trace Precedents, Trace Dependents and Evaluate Formula, and when you use each.**
Trace Precedents draws arrows from every input to the selected formula, so I use it to answer "where does this number come from" and to find off-sheet links. Trace Dependents shows what uses a cell, which I run before deleting a column or changing a rate so nothing downstream breaks silently. Evaluate Formula executes the selected formula one operation at a time, showing each intermediate value, and is how I debug nested IFs, LET bindings and lookups that return the wrong row. Together with Go To Special and Show Formulas they form the standard audit set, and I expect any analyst I hire to demonstrate them.

**Q: A manager says the number on the dashboard is wrong. What do you do?**
First reproduce: confirm which number, which filter state, and what they expected. Then trace: precedents from the tile to the measure or SUMIFS, Evaluate Formula on the criteria, and a direct recomputation from the raw Table to see whether the source or the logic is at fault. Common causes are a stale pivot cache, a slicer left selected, a text-versus-number mismatch in a key, or new data outside a fixed range. Once fixed, I add a check to the Checks sheet that would have caught it, note the change in the log, and tell the manager what happened and what now prevents it. The explanation matters as much as the fix.

## Excel interview tests (the 20 tasks every analyst test includes)

Most analyst roles include a practical Excel test: a workbook with a few thousand rows and a list of tasks, thirty to sixty minutes, sometimes screen-shared. The tasks repeat across companies because they test the same skills. This chapter lists the twenty you will meet, the fastest correct solution to each, and the habits that make you finish with time to check your work.

### The twenty tasks

| # | Task | Best solution |
|---|---|---|
| 1 | Total, average, max of a column | `SUM`, `AVERAGE`, `MAX`; `Alt+=` |
| 2 | Count rows meeting a condition | `COUNTIFS` |
| 3 | Sum by category and month | `SUMIFS` with `EOMONTH` bounds or a PivotTable |
| 4 | Look up a value from another sheet | `XLOOKUP` (say INDEX/MATCH if version unknown) |
| 5 | Lookup with two keys | `XLOOKUP(1, (a)*(b), r)` or helper key |
| 6 | Categorise values into bands | `XLOOKUP(v, from, label, , -1)` or `IFS` |
| 7 | Find and count duplicates | `COUNTIF(range, cell)>1`, conditional formatting, `UNIQUE` |
| 8 | Remove duplicates | Data → Remove Duplicates, or `UNIQUE` |
| 9 | Split full names / codes | `TEXTSPLIT`, `TEXTBEFORE`/`TEXTAFTER`, Text to Columns |
| 10 | Clean whitespace and case | `TRIM`, `CLEAN`, `PROPER`, `SUBSTITUTE(…, CHAR(160), " ")` |
| 11 | Convert text dates/numbers | `DATEVALUE`, `--`, Text to Columns, `VALUE` |
| 12 | Days or business days between dates | `B2-A2`, `NETWORKDAYS`, `DATEDIF` |
| 13 | Month/quarter/year columns | `EOMONTH`, `TEXT`, `"Q"&ROUNDUP(MONTH/3,0)` |
| 14 | Rank items | `RANK.EQ`, `SORTBY`, `TAKE` for top N |
| 15 | Running total | `=C1+B2` or `SCAN` |
| 16 | Percentage of total and growth vs prior period | `B2/SUM(B:B)`, `(B3-B2)/B2` |
| 17 | PivotTable with a calculated field or % of total | Insert → PivotTable; Show Values As |
| 18 | Chart with a message | Sorted bar or line, title as finding |
| 19 | Conditional formatting rule based on another column | Formula rule `=$F2="Late"` |
| 20 | Error handling / replace #N/A | `IFNA`, `IFERROR` sparingly |

Occasionally: a weighted average (`SUMPRODUCT/SUM`), a Goal Seek (**Data → What-If Analysis**), an `INDEX/MATCH` two-way lookup, a data validation dropdown, freeze panes and print setup, or a simple macro.

### A worked test

The typical file: `Production` sheet with `Date, State, Agent, File, Coverage, Files, Errors, Status`, 4,000 rows; `Rates` sheet with `State, Rate`. Tasks and the formulas a strong candidate writes:

```excel
' 1. Total files, average per row, busiest day
=SUM(Production!F:F)     =AVERAGE(Production!F:F)     =MAXIFS(Production!F:F, Production!A:A, "<>")
' 2. Late files in Wyoming
=COUNTIFS(Production!B:B, "WY", Production!H:H, "Late")
' 3. Files by state and month (Summary sheet, states in A, month starts in row 1)
=SUMIFS(Production!$F:$F, Production!$B:$B, $A2, Production!$A:$A, ">="&B$1, Production!$A:$A, "<="&EOMONTH(B$1,0))
' 4. Rate per row and premium
=XLOOKUP(B2, Rates!A:A, Rates!B:B, 0)
=ROUND(ROUNDUP(E2/1000,0)*I2, 2)
' 5. Duplicate file numbers
=COUNTIF(Production!$D:$D, D2)>1                → then filter TRUE
' 6. Error-rate band
=IFS(G2/F2<=0.01,"A", G2/F2<=0.02,"B", TRUE,"C")
' 7. Rank agents by files (distinct list, then sum, then rank)
=SORTBY(HSTACK(UNIQUE(C2:C4001), SUMIFS(F2:F4001, C2:C4001, UNIQUE(C2:C4001))), SUMIFS(F2:F4001, C2:C4001, UNIQUE(C2:C4001)), -1)
' 8. Growth vs prior month (Summary sheet, months across)
=IFERROR(C2/B2-1, "")
' 9. Highlight rows late
Conditional formatting on A2:H4001: =$H2="Late"
' 10. Weighted error rate
=SUM(G:G)/SUM(F:F)
```

### Habits that win the test

1. **Read every task before starting**; several often share one helper column (a month column serves tasks 3, 8 and 13).
2. **Convert the data to a Table** (`Ctrl+T`) first. Structured references stop off-by-one range errors and pivots refresh cleanly.
3. **Check the data types** in the first minute: `=ISNUMBER()` on the numeric and date columns. Tests are often seeded with text numbers.
4. **Write the formula in the second row and check the last row.**
5. **Label your work**: a header on every helper column, a note next to any assumption ("Late = Status is 'Late'; blanks treated as on time").
6. **Use a PivotTable for exploration and a formula for the deliverable**, unless the task says which.
7. **Ask about the Excel version** in a live test before using `XLOOKUP` or dynamic arrays, and know the fallback.
8. **Leave five minutes** for the checks: totals reconcile, no `#N/A` visible, formats applied, sheet names sensible.

### Common traps

- Merged cells in the header: unmerge before `Ctrl+T`.
- A totals row hidden inside the data: sum double-counts.
- Dates as text in d/m/y where the machine is m/d/y.
- `VLOOKUP` without `FALSE`.
- Averaging percentages instead of computing the rate of totals.
- Whole-column `SUMPRODUCT` freezing the file.
- Sorting a single column and separating it from its rows.

### Screen-share etiquette

Narrate what you are doing and why: "Converting to a Table so my SUMIFS extends if rows are added." Interviewers score the reasoning as much as the result. If you do not know a function, say what you would look up and use the approach you do know; `INDEX/MATCH` is always acceptable.

> **Interview note:** The most frequent verbal follow-ups after a test are "why INDEX/MATCH over VLOOKUP", "what is the difference between a pivot and SUMIFS", "how would you make this refresh automatically", and "what would you check before sending this". Every one of those has a chapter in this course.

### Try It Yourself

```excel
' 30-minute drill on any production-style sheet (Date, State, Agent, File, Coverage, Files, Errors, Status)
' 0. Ctrl+T → name tblP. Check =ISNUMBER(tblP[Date]) and =ISNUMBER(tblP[Files]) in spare cells.
' 1. =SUM(tblP[Files])   =AVERAGE(tblP[Files])   =MAX(tblP[Files])
' 2. =COUNTIFS(tblP[State],"WY", tblP[Status],"Late")
' 3. =SUMIFS(tblP[Files], tblP[State], $A2, tblP[Date], ">="&B$1, tblP[Date], "<="&EOMONTH(B$1,0))
' 4. Rate column: =XLOOKUP([@State], Rates[State], Rates[Rate], 0)
' 5. Premium: =ROUND(ROUNDUP([@Coverage]/1000,0)*[@Rate], 2)
' 6. Dup flag: =COUNTIF(tblP[File], [@File])>1
' 7. Band: =XLOOKUP([@Errors]/[@Files], Bands[From], Bands[Grade], "C", -1)
' 8. Top 5: =TAKE(SORTBY(HSTACK(UNIQUE(tblP[Agent]), SUMIFS(tblP[Files], tblP[Agent], UNIQUE(tblP[Agent]))), SUMIFS(tblP[Files], tblP[Agent], UNIQUE(tblP[Agent])), -1), 5)
' 9. Running total (sorted by Date): =SUM(INDEX(tblP[Files],1):[@Files])
' 10. Weighted rate: =SUM(tblP[Errors])/SUM(tblP[Files])
' 11. Conditional formatting on the Table: =$H2="Late"
' 12. PivotTable: State × Month, Sum of Files, Show Values As % of Column Total
```

### Quiz

1. What is the first thing to do with a test dataset?
- [ ] Insert a PivotTable
- [x] Convert it to a Table and verify data types
- [ ] Sort it by date
> A Table prevents range errors and the type check prevents silent zeros.

2. Which is the correct team error rate?
- [ ] `AVERAGE` of each agent's rate
- [x] `SUM(Errors)/SUM(Files)`
- [ ] `MEDIAN` of rates
> The rate of totals is volume-weighted.

3. The test machine may run Excel 2016. Which lookup do you use?
- [ ] XLOOKUP
- [x] INDEX/MATCH
- [ ] FILTER
> INDEX/MATCH works in every version; XLOOKUP and FILTER need 2021/365.

4. A `#N/A` appears in a lookup column. What is the professional fix?
- [ ] Wrap everything in IFERROR(…, 0)
- [x] Investigate the unmatched key, then use IFNA with a meaningful value
- [ ] Delete the row
> Unmatched keys usually reveal dirty data; masking them hides the problem.

### Exercises

1. **Timed drill** — Take any 2,000-row export, set a 30-minute timer and complete tasks 1–12 in the Try It block.
<details><summary>Solution</summary>

Score yourself: all totals reconcile with a pivot built independently; no `#N/A` visible; every helper column labelled; at least five minutes left for checks. Repeat weekly until under 20 minutes.

</details>

2. **Fallback versions** — Rewrite the top-5 formula for Excel 2016.
<details><summary>Solution</summary>

Helper sheet: distinct agents via Remove Duplicates, `=SUMIFS(tblP[Files], tblP[Agent], A2)` per agent, then `=LARGE($B$2:$B$50, ROWS($1:1))` filled down five rows and `=INDEX($A$2:$A$50, MATCH(D2, $B$2:$B$50, 0))` for the names (add a tiny `ROW()/1e9` tiebreaker if totals can tie).

</details>

3. **Explain your work** — Write a five-line note that would accompany the completed test.
<details><summary>Solution</summary>

*Data converted to Table tblP; dates and numbers verified numeric. Late = Status "Late"; blank statuses treated as on time. Rates from Rates sheet via XLOOKUP, missing rates shown as 0 and flagged in column K. Premium = coverage rounded up to $1,000 × rate, rounded to cents. Totals reconciled to PivotTable on sheet Check.*

</details>

### Interview Questions

**Q: How do you approach a practical Excel test?**
I read every task first so I can plan helper columns that serve several of them, then convert the data to a Table and verify data types before writing any formula. I solve tasks in order of dependency rather than list order, write each formula in the first row and check the last, and label every helper column and assumption. I use a PivotTable to cross-check formula totals, keep the last five minutes for reconciliation, and narrate my reasoning if the session is live. The goal is not clever formulas but a workbook a reviewer can follow and trust.

**Q: What errors do candidates most often make, and how do you avoid them?**
Averaging percentages instead of computing rates of totals, `VLOOKUP` without an exact-match flag, ranges that stop short of the last rows, dates stored as text producing zeros in `SUMIFS`, and sorting a single column away from its rows. I avoid them with three habits: Tables so ranges never stop short, an `ISNUMBER` check in the first minute so text data is converted before anything else, and computing every rate from totals. I also never leave `#N/A` in a deliverable without a note explaining what was unmatched.

**Q: What would you do differently if the test data had 500,000 rows?**
Formulas over whole columns would be slow, so I would load the data through Power Query into the data model, use a PivotTable with measures for the aggregations, and keep only summaries on sheets. Lookups would become relationships to the rates table, and the top-N and growth calculations would be DAX measures rather than spilled formulas. If the test insists on formulas, I would bound everything to Table columns, avoid `SUMPRODUCT` over the full range, and compute lookups once per row with `XMATCH` plus `INDEX`. The answer signals that I know where Excel's grid stops being the right tool.
