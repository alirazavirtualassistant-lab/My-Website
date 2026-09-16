---
id: openpyxl
title: openpyxl
icon: 📗
track: Document Engineering
color: #217346
runner: python
packages: openpyxl
tagline: Read, write and style Excel workbooks from Python.
description: openpyxl from creating a workbook to expert reporting automation: cells and ranges, formulas, number formats, fonts/fills/borders, column widths, merged cells, named ranges, data validation, conditional formatting, charts, images, tables, freeze panes, read-only/write-only modes and building the weekly production-report workbook.
---

# LEVEL: Beginner

## Installing openpyxl and creating your first workbook

**openpyxl** is the Python library for reading and writing modern Excel files (`.xlsx`, `.xlsm`, `.xltx`, `.xltm`). It does not need Excel installed, it runs on Windows, macOS and Linux, and it is the engine that `pandas.DataFrame.to_excel()` uses under the hood. If you have ever produced a weekly status workbook by hand, this is the tool that produces it for you at 2 a.m. without complaint.

Install it with pip. The current stable line is 3.1.x (3.1.5 at the time of writing):

```bash
pip install openpyxl
python -c "import openpyxl; print(openpyxl.__version__)"
```

### The three objects you will use every day

| Object | What it represents | How you get one |
|---|---|---|
| `Workbook` | The whole `.xlsx` file | `Workbook()` or `load_workbook("file.xlsx")` |
| `Worksheet` | One tab in the file | `wb.active`, `wb["Sheet"]`, `wb.create_sheet("Name")` |
| `Cell` | One box on a sheet | `ws["A1"]` or `ws.cell(row=1, column=1)` |

A brand-new workbook always contains one sheet called `Sheet`. `wb.active` returns it:

```python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Production"          # rename the default sheet
ws["A1"] = "Week"
ws["B1"] = "Files closed"
ws["A2"] = 37
ws["B2"] = 412
wb.save("weekly_status.xlsx")
```

Line by line: `Workbook()` creates an empty file in memory. `wb.active` gives you the first sheet. Assigning to `ws["A1"]` writes a value into a cell, creating the cell object on demand. Nothing touches the disk until `wb.save()`, which writes a complete zip archive of XML parts (that is literally what an `.xlsx` file is).

### Saving to memory instead of disk

On a server, in a test, or in this browser sandbox you often want the bytes without a file. `wb.save()` accepts any file-like object, so a `BytesIO` buffer works:

```python
from io import BytesIO
from openpyxl import Workbook

wb = Workbook()
wb.active["A1"] = "Hello"
buf = BytesIO()
wb.save(buf)
print(len(buf.getvalue()), "bytes")   # around 4,800 bytes for one cell
```

Those bytes can be emailed, uploaded to S3, or returned from a Flask/FastAPI endpoint with the content type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

### What openpyxl can and cannot do

- It reads and writes values, formulas, styles, charts, images, tables, validations and comments.
- It **does not calculate formulas**. It writes the formula text; Excel computes the result when the file is opened.
- It does not read the legacy binary `.xls` format (use `xlrd` 1.2 or convert with LibreOffice).
- It does not create PivotTables, though it preserves existing ones when it can.

### Checking your output

Open the saved file in Excel or LibreOffice Calc and confirm the sheet name and the four values. If Excel says the file is corrupt, the usual causes are an exception thrown halfway through `save()` or a value openpyxl could not serialise (for example a NumPy `int64` in very old versions, or a `dict`). Call `wb.close()` when you are done with workbooks opened from disk in read-only mode so the file handle is released.

> **Tip:** Always save to a new filename while developing (`report_v2.xlsx`). If Excel has the target file open on Windows you get `PermissionError: [Errno 13]`, and a crash in the middle of a save can leave a zero-byte file behind.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Production"
ws["A1"] = "Week"
ws["B1"] = "Files closed"
ws["A2"] = 37
ws["B2"] = 412

buf = BytesIO()
wb.save(buf)
print("Sheets:", wb.sheetnames)
print("A1 =", ws["A1"].value, "| B2 =", ws["B2"].value)
print("Workbook size:", len(buf.getvalue()), "bytes")
```

### Quiz

1. Which file formats can openpyxl read?
- [ ] `.xls` and `.xlsx`
- [x] `.xlsx`, `.xlsm`, `.xltx` and `.xltm`
- [ ] Only `.csv`
> openpyxl handles the Office Open XML formats. The old binary `.xls` needs `xlrd` or a conversion step.

2. When is the file actually written to disk?
- [ ] As soon as you assign `ws["A1"] = 5`
- [ ] When the `Workbook()` object is created
- [x] When you call `wb.save()`
> Everything lives in memory until `save()` serialises the zip archive.

3. What does `wb.active` return on a new workbook?
- [x] The single default worksheet named `Sheet`
- [ ] `None`
- [ ] A list of all sheets
> A new `Workbook()` contains one sheet and `active` points at it.

### Exercises

1. **Two sheets** — Create a workbook with sheets named `Summary` and `Detail`, write the text `Q3` into `Summary!A1`, and print `wb.sheetnames`.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook()
ws = wb.active
ws.title = "Summary"
wb.create_sheet("Detail")
ws["A1"] = "Q3"
print(wb.sheetnames)   # ['Summary', 'Detail']
```

</details>

2. **Size check** — Save a workbook with 1,000 rows of the number `1` in column A to a `BytesIO` buffer and print how many bytes it takes.
<details><summary>Solution</summary>

```python
from io import BytesIO
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for r in range(1, 1001):
    ws.cell(row=r, column=1, value=1)
buf = BytesIO(); wb.save(buf)
print(len(buf.getvalue()))
```

</details>

### Interview Questions

**Q: What is an .xlsx file physically, and why does that matter for openpyxl?**
An `.xlsx` file is a ZIP archive containing XML parts: `xl/workbook.xml`, one `xl/worksheets/sheetN.xml` per tab, `xl/styles.xml`, `xl/sharedStrings.xml`, plus relationship files. openpyxl parses and regenerates those parts, which explains its main behaviours: it needs the whole file in memory in normal mode, it cannot evaluate formulas because there is no calculation engine in the XML, and anything it does not understand (some chart types, slicers, VBA project details) may be dropped on save. Knowing this lets you debug a "corrupt file" warning by unzipping the output and reading the XML directly.

**Q: How would you generate an Excel file from a web service without writing to disk?**
Build the workbook with `Workbook()`, then call `wb.save(buffer)` where `buffer` is an `io.BytesIO()`. Read `buffer.getvalue()` and return it with the MIME type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` and a `Content-Disposition: attachment; filename="report.xlsx"` header. This avoids temp-file cleanup, works in read-only containers, and is trivially testable because a unit test can load the buffer back with `load_workbook(BytesIO(data))`.

**Q: When would you choose openpyxl over pandas.to_excel or xlsxwriter?**
pandas is the fastest way to dump a DataFrame, but it gives limited control over styling and cannot edit an existing file. xlsxwriter produces polished output quickly and is faster for large writes, but it is write-only: it cannot open a workbook. openpyxl is the only one of the three that reads, modifies and writes, so it is the choice when a client sends a template that must keep its formatting, when you need to update one sheet in a 20-tab workbook, or when you must read formulas back. In practice I combine them: pandas for data shaping, openpyxl for the final styling pass on the template.

## Writing and reading cells: A1 notation versus row and column

There are two ways to address a cell in openpyxl, and you will use both. **A1 notation** (`ws["C7"]`) is what you see in Excel and is best for fixed positions such as a report title. **Row/column indexing** (`ws.cell(row=7, column=3)`) is what you use inside loops because arithmetic on numbers is easy and arithmetic on letters is not.

### Writing values

```python
from openpyxl import Workbook

wb = Workbook()
ws = wb.active

ws["A1"] = "Agent"                       # A1 style
ws.cell(row=1, column=2, value="QA score")  # row/col style
ws.cell(row=2, column=1).value = "Sana"     # assign through .value
ws["B2"] = 96.5
```

All three forms end up in the same place. Rows and columns are **1-based**, exactly like Excel, so `column=1` is `A` and `row=1` is the first row. Python programmers used to 0-based lists get this wrong for the first week; the error you see is `ValueError: Row or column values must be at least 1`.

### Reading values

Reading returns a `Cell` object, and the content lives in `.value`:

```python
c = ws["B2"]
print(c.value)        # 96.5
print(c.coordinate)   # B2
print(c.row, c.column, c.column_letter)   # 2 2 B
print(type(c.value))  # <class 'float'>
```

openpyxl preserves Python types. Integers stay `int`, decimals become `float`, dates written as `datetime.date` become real Excel dates, `None` produces an empty cell, and `True`/`False` become Excel booleans. Strings that look like numbers stay strings, which is exactly why a client's "numbers stored as text" problem happens: someone wrote `"412"` instead of `412`.

### Converting between letters and numbers

The `openpyxl.utils` module has the two helpers you will call constantly:

```python
from openpyxl.utils import get_column_letter, column_index_from_string

print(get_column_letter(27))            # AA
print(column_index_from_string("AZ"))   # 52
```

Use them to build ranges dynamically: if a report has `n` weeks of data, the last column letter is `get_column_letter(n + 1)`.

### Appending whole rows

`ws.append()` writes one row at a time to the first empty row. It is the fastest way to build a table from a list of lists or tuples:

```python
rows = [
    ("File #", "State", "Premium"),
    ("TX-10432", "TX", 1250.00),
    ("WY-00871", "WY", 980.50),
]
for r in rows:
    ws.append(r)
```

`append` also accepts a dictionary keyed by column letter or index (`{"A": 1, "C": 3}`), which skips the cells you leave out.

### Ranges and slices

Indexing with a range string returns a tuple of tuples of cells:

```python
block = ws["A1:C3"]        # ((A1, B1, C1), (A2, B2, C2), (A3, B3, C3))
for row in block:
    print([cell.value for cell in row])
```

`ws["A"]` returns a whole column, `ws[2]` a whole row, and `ws["A:B"]` two columns. The results are tuples of `Cell` objects, so you still need `.value` to get the contents.

> **Warning:** Accessing a cell creates it. After `print(ws["Z1000"].value)` the sheet's `max_row` becomes 1000 and `max_column` becomes 26 even though nothing was written. Use `ws.iter_rows()` (next chapter) for read-only scans.

### Try It Yourself

```python
from openpyxl import Workbook
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active

# Build a 5-week x 3-metric grid using row/col arithmetic
metrics = ["Files opened", "Files closed", "Rejections"]
ws.cell(row=1, column=1, value="Week")
for i, m in enumerate(metrics, start=2):
    ws.cell(row=1, column=i, value=m)
for week in range(1, 6):
    ws.cell(row=week + 1, column=1, value=f"W{36 + week}")
    for col in range(2, 5):
        ws.cell(row=week + 1, column=col, value=week * col * 10)

last_col = get_column_letter(ws.max_column)
print("Used range:", ws.dimensions, "| last column:", last_col)
for row in ws["A1:D3"]:
    print([c.value for c in row])
```

### Quiz

1. What is `ws.cell(row=1, column=1)` in A1 notation?
- [x] A1
- [ ] B2
- [ ] A0
> openpyxl is 1-based like Excel, so row 1 column 1 is `A1`.

2. What does `get_column_letter(28)` return?
- [ ] Z
- [x] AB
- [ ] BB
> 26 is `Z`, 27 is `AA`, 28 is `AB`.

3. Which statement about `ws.append()` is true?
- [ ] It overwrites row 1 every time
- [x] It writes to the next empty row after the current maximum row
- [ ] It only accepts strings
> `append` tracks the current row and writes each call below the last.

### Exercises

1. **Numbers, not text** — Write the string `"412"` into A1 and the integer `412` into A2, then print the `type()` of each cell's value.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
ws["A1"] = "412"; ws["A2"] = 412
print(type(ws["A1"].value).__name__, type(ws["A2"].value).__name__)  # str int
```

</details>

2. **Multiplication table** — Fill A1:J10 with a 10×10 multiplication table using `ws.cell()` in nested loops.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for r in range(1, 11):
    for c in range(1, 11):
        ws.cell(row=r, column=c, value=r * c)
print(ws["J10"].value)  # 100
```

</details>

### Interview Questions

**Q: Why is openpyxl 1-based when Python is 0-based, and how do you avoid off-by-one bugs?**
openpyxl mirrors Excel's own coordinate system so that `ws.cell(row=5, column=2)` is the `B5` a user sees, which matters when you are debugging with the file open. To avoid errors I use `enumerate(data, start=2)` when writing under a header row, keep header-row and first-data-row numbers as named constants (`HEADER_ROW = 1`, `FIRST_DATA_ROW = 2`), and convert between letters and indexes with `get_column_letter` rather than `chr(64 + n)`, which breaks after column Z.

**Q: What happens when you read a cell that has never been written?**
openpyxl creates the `Cell` object on access and returns `None` for its value. The side effect is that the worksheet's `max_row` and `max_column` now include that coordinate, so a later `iter_rows()` without explicit bounds will walk through thousands of empty cells. In production code I never probe cells to find the end of data; I use `ws.max_row` before touching anything, or better, `iter_rows(values_only=True)` and stop at the first all-`None` row.

**Q: How does openpyxl decide the Excel data type of a value you write?**
It inspects the Python type: `int`/`float`/`Decimal` become numeric cells, `str` becomes a shared string (or an inline string in write-only mode), `bool` becomes a boolean cell, `datetime`/`date`/`time` become numeric serials with a date number format applied, `None` clears the cell, and a string beginning with `=` is stored as a formula. Because of that last rule, a client's text like `=Total` must be written with `cell.data_type = "s"` after assignment, or prefixed with an apostrophe as Excel does, otherwise Excel shows `#NAME?`.

## Iterating rows and columns

Real files have hundreds or thousands of rows, so loops are how you read them. openpyxl gives you three iteration tools and the choice between them affects both readability and speed.

### iter_rows and iter_cols

`ws.iter_rows()` yields one tuple of cells per row. You can restrict the window with `min_row`, `max_row`, `min_col`, `max_col`, and you can ask for plain values instead of `Cell` objects with `values_only=True`:

```python
for row in ws.iter_rows(min_row=2, max_col=3, values_only=True):
    file_no, state, premium = row
    print(file_no, state, premium)
```

`values_only=True` is the single biggest speed-up available in normal mode: it skips creating `Cell` objects and hands you tuples of raw values. `iter_cols()` is the transposed version and yields one tuple per column, which is handy for computing a column total.

### Skipping the header and stopping at blanks

Excel files from clients often have a used range far bigger than the real data because someone formatted 10,000 rows. Stop at the first empty row instead of trusting `max_row`:

```python
data = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if row[0] is None:        # first blank File # ends the table
        break
    data.append(row)
print(len(data), "records")
```

### Building dictionaries from a header row

Most report code wants each row as a dict keyed by column name. Read the header once, then zip:

```python
rows = ws.iter_rows(values_only=True)
header = next(rows)                          # ('File #', 'State', 'Premium')
records = [dict(zip(header, r)) for r in rows]
print(records[0]["Premium"])
```

This is the same shape `csv.DictReader` gives you, so downstream code does not care whether the input was CSV or Excel.

### Aggregating while you iterate

A weekly production report needs totals by state. A `collections.Counter` or a plain dict does it in one pass:

```python
from collections import defaultdict
totals = defaultdict(float)
for file_no, state, premium in ws.iter_rows(min_row=2, values_only=True):
    if file_no is None:
        break
    totals[state] += premium or 0     # guard against blank premiums
for state, amt in sorted(totals.items()):
    print(f"{state}: {amt:,.2f}")
```

The `or 0` guard matters: an empty cell is `None`, and `None + 5.0` raises `TypeError`.

### Keeping the row number while using values_only

`values_only=True` hides coordinates, but you often need the row number to write a result back. Combine it with `enumerate` and the same `min_row` you passed in:

```python
for r, (file_no, state, premium) in enumerate(ws.iter_rows(min_row=2, max_col=3, values_only=True), start=2):
    if premium is None:
        ws.cell(row=r, column=4, value="MISSING PREMIUM")
```

This keeps the fast read path and still lets you annotate exactly the rows that failed a check.

### Which loop to use

| Method | Yields | Best for |
|---|---|---|
| `ws.iter_rows(values_only=True)` | tuples of values | Reading data, fastest |
| `ws.iter_rows()` | tuples of `Cell` | When you need coordinates or styles |
| `ws.rows` / `ws.columns` | generators over the whole used range | Quick scripts |
| `ws["A2:C50"]` | tuple of tuples of `Cell` | Fixed, known ranges |

> **Tip:** `ws.rows` and `ws.columns` always cover the entire used range. On a sheet with formatting down to row 50,000 that is 50,000 iterations. Prefer `iter_rows` with `max_row` set from your own scan.

### Try It Yourself

```python
from openpyxl import Workbook
from collections import defaultdict

wb = Workbook()
ws = wb.active
ws.append(["File #", "State", "Premium"])
sample = [("TX-1", "TX", 1250.0), ("WY-1", "WY", 980.5),
          ("TX-2", "TX", 1310.0), ("NM-1", "NM", None), ("WY-2", "WY", 1002.0)]
for r in sample:
    ws.append(r)

rows = ws.iter_rows(values_only=True)
header = next(rows)
records = [dict(zip(header, r)) for r in rows]
print("Header:", header)
print("First record:", records[0])

totals = defaultdict(float)
for rec in records:
    totals[rec["State"]] += rec["Premium"] or 0
for state, amt in sorted(totals.items()):
    print(f"{state}: {amt:,.2f}")
```

### Quiz

1. What does `values_only=True` change?
- [ ] It converts every value to a string
- [x] It yields raw values instead of `Cell` objects, which is faster
- [ ] It skips empty rows automatically
> Skipping `Cell` creation is the main performance win when reading.

2. Why can `ws.max_row` be larger than the real data?
- [x] Formatting or previously accessed empty cells extend the used range
- [ ] Excel always pads 100 extra rows
- [ ] `max_row` counts the header twice
> The used range includes any cell that exists in the XML, formatted or not.

3. What is `next(ws.iter_rows(values_only=True))`?
- [ ] The last row
- [x] The first row as a tuple of values
- [ ] The number of rows
> `iter_rows` is a generator; `next` pulls its first item, usually the header.

### Exercises

1. **Column total** — Using `iter_cols`, print the sum of column C for a sheet whose C2:C6 contain 10, 20, 30, 40, 50.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for i, v in enumerate([10, 20, 30, 40, 50], start=2):
    ws.cell(row=i, column=3, value=v)
col = next(ws.iter_cols(min_col=3, max_col=3, min_row=2, values_only=True))
print(sum(col))  # 150
```

</details>

2. **Find a cell** — Write a function `find(ws, text)` that returns the coordinate of the first cell equal to `text`, or `None`.
<details><summary>Solution</summary>

```python
def find(ws, text):
    for row in ws.iter_rows():
        for cell in row:
            if cell.value == text:
                return cell.coordinate
    return None
```

</details>

### Interview Questions

**Q: You need to read a 200,000-row sheet and it takes minutes. What do you change?**
First, open the file with `load_workbook(path, read_only=True)` so rows stream from the XML instead of being fully materialised. Second, iterate with `iter_rows(values_only=True)` so no `Cell` objects are created. Third, bound the range with `max_row`/`max_col` after calling `ws.reset_dimensions()` if the file's declared dimensions are wrong. Those three changes typically turn a 3-minute read into 10–15 seconds. If I only need numbers, `pandas.read_excel(engine="openpyxl")` does the same internally and is easier still.

**Q: How do you make code robust to columns being reordered by the client?**
Never hard-code column indexes. Read the header row once, build a mapping `{name: index}` with `enumerate`, and address values as `row[idx["Premium"]]`. Normalise header text with `.strip().lower()` so `"Premium "` and `"premium"` still match, and fail loudly with a clear `KeyError` message listing the headers actually found. This is the same discipline as `csv.DictReader` and it saved my Stewart Title report scripts every time the source export changed.

**Q: What is the difference between `ws.rows` and `ws.iter_rows()`?**
`ws.rows` is a property that returns a generator over the entire used range with no arguments possible. `iter_rows()` is a method that accepts `min_row`, `max_row`, `min_col`, `max_col` and `values_only`, so it can be bounded and made faster. In read-only mode `ws.rows` is still available but `iter_rows()` with limits is the tool you actually want because it avoids walking empty trailing rows.

## Formulas and the data_only flag

openpyxl writes formulas as text and never evaluates them. Understanding that one fact prevents the most common openpyxl bug report on Stack Overflow: "my formula cells read back as `None`".

### Writing a formula

Any string starting with `=` is stored as a formula:

```python
ws["A1"] = 40
ws["A2"] = 2
ws["A3"] = "=A1*A2"
ws["A4"] = "=SUM(A1:A2)"
ws["A5"] = '=IF(A3>50,"High","Low")'
```

Use English function names and commas as argument separators regardless of the user's Excel locale; the file format is locale-independent and Excel translates on display. Double quotes inside formulas mean you should wrap the Python string in single quotes.

### Reading the formula versus reading the result

When you load a file, you choose which one you get:

```python
from openpyxl import load_workbook

wb_f = load_workbook("report.xlsx")                  # formulas as text
wb_v = load_workbook("report.xlsx", data_only=True)  # last calculated values

print(wb_f.active["A3"].value)   # '=A1*A2'
print(wb_v.active["A3"].value)   # 80  (if Excel saved the file after calculating)
```

`data_only=True` returns the **cached value** Excel stored the last time it saved the file. If the file was produced by openpyxl and never opened in Excel, there is no cache and you get `None`. That is not a bug; nothing ever computed the formula.

### Never save a data_only workbook over the original

When you open with `data_only=True` and save, the formulas are gone forever because openpyxl only has the values. Treat `data_only` workbooks as read-only snapshots:

```python
wb = load_workbook("rates.xlsx", data_only=True)
# read what you need ...
# wb.save("rates.xlsx")   # DO NOT: this would replace every formula with its value
```

### Getting formulas calculated

If your pipeline needs real numbers from openpyxl-written formulas, you have three honest options:

1. Compute in Python and write the value instead of the formula (best when Excel will not be used for further editing).
2. Open and re-save in Excel or LibreOffice headless: `soffice --headless --convert-to xlsx --outdir out/ report.xlsx` recalculates on load.
3. Use the `formulas` or `pycel` packages, which implement a subset of Excel functions in Python.

Option 2 is the one I use for automated title-insurance rate checks: write the workbook, recalculate with LibreOffice, then reopen with `data_only=True` to verify totals.

### Array formulas and newer functions

openpyxl 3.1 added `ArrayFormula` for legacy CSE arrays:

```python
from openpyxl.worksheet.formula import ArrayFormula
ws["E2"] = ArrayFormula("E2:E5", "=B2:B5*C2:C5")
```

Dynamic-array functions introduced in Microsoft 365 (`XLOOKUP`, `FILTER`, `UNIQUE`) are stored as formulas fine, but Excel expects the `_xlfn.` prefix in the file: write `"=_xlfn.XLOOKUP(A2,Rates!A:A,Rates!B:B)"` or Excel will show `#NAME?` until the cell is re-entered.

> **Interview note:** The question "does openpyxl calculate formulas?" is asked to see if you understand that the file format stores formula text plus an optional cached result, and that only a calculation engine (Excel, LibreOffice) fills in the cache.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook, load_workbook

wb = Workbook()
ws = wb.active
ws.append(["Qty", "Rate", "Total"])
ws.append([40, 2.5, "=A2*B2"])
ws.append([12, 3.0, "=A3*B3"])
ws["C4"] = "=SUM(C2:C3)"

buf = BytesIO()
wb.save(buf)

wb_formulas = load_workbook(BytesIO(buf.getvalue()))
wb_values = load_workbook(BytesIO(buf.getvalue()), data_only=True)
print("Formula text :", wb_formulas.active["C4"].value)
print("Cached value :", wb_values.active["C4"].value, "(None: never calculated by Excel)")

# Compute in Python if you need the number now
total = sum(a * b for a, b, _ in wb_formulas.active.iter_rows(min_row=2, max_row=3, values_only=True))
print("Python total :", total)
```

### Quiz

1. What does `load_workbook(f, data_only=True)` return for a formula cell?
- [ ] The formula text
- [x] The value Excel cached at last save, or `None` if none exists
- [ ] A freshly calculated result
> openpyxl has no calculation engine; it can only read what Excel stored.

2. Which string is stored as a formula?
- [x] `"=A1+A2"`
- [ ] `"A1+A2"`
- [ ] `"SUM(A1:A2)"`
> Only strings that begin with `=` are treated as formulas.

3. What happens if you save a workbook that was loaded with `data_only=True`?
- [ ] Formulas are recalculated
- [x] Every formula is replaced by its cached value permanently
- [ ] openpyxl raises an error
> The workbook object never held the formulas, so the saved file has only values.

### Exercises

1. **Percent formula** — Write headers `Closed`, `Opened`, `Rate` and a row `412, 500` with a formula in C2 that divides C by B as a percentage.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
ws.append(["Closed", "Opened", "Rate"])
ws.append([412, 500, "=A2/B2"])
ws["C2"].number_format = "0.0%"
print(ws["C2"].value)   # =A2/B2
```

</details>

2. **Formula audit** — Print the coordinate and formula of every formula cell on a sheet.
<details><summary>Solution</summary>

```python
for row in ws.iter_rows():
    for c in row:
        if c.data_type == "f":
            print(c.coordinate, c.value)
```

</details>

### Interview Questions

**Q: Explain the difference between a formula cell's formula and its cached value in the xlsx format.**
In `sheetN.xml` a formula cell looks like `<c r="C4"><f>SUM(C2:C3)</f><v>130</v></c>`. The `<f>` element is the formula text and `<v>` is the value the last calculating application stored. openpyxl reads `<f>` by default and `<v>` with `data_only=True`. When openpyxl writes a formula it emits only `<f>`, so there is no `<v>` until Excel opens, calculates and saves. That is why a freshly generated file reads back `None` and why Excel shows the numbers instantly on open: it calculates them on load.

**Q: A client says the XLOOKUP formulas you wrote show #NAME? until they click into the cell. Why?**
Functions added after Excel 2007 are stored with a `_xlfn.` prefix in the file, for example `_xlfn.XLOOKUP(...)`. When openpyxl writes the bare name, older parsers do not recognise it, and Excel refuses to evaluate until the formula is re-entered by hand. The fix is to write the prefixed name from Python. The same applies to `IFS`, `TEXTJOIN`, `FILTER`, `UNIQUE` and `LET`; `SUM`, `VLOOKUP` and `IF` need no prefix.

**Q: How do you unit-test a workbook that relies on formulas?**
I test the formula text and the computed value separately. For the text, I load without `data_only` and assert that `ws["C4"].value == "=SUM(C2:C3)"` so structural regressions are caught. For the value, I either recompute the expected number in Python from the same inputs, or in CI run LibreOffice headless to recalculate and then load with `data_only=True`. In a title-insurance rate workbook that gave me both a fast unit test and a slower nightly check that the Excel logic matched the Python rate engine to the cent.

## Loading existing files and managing sheets

Most real openpyxl work starts from a file somebody else made: a client template, last week's report, a vendor export. `load_workbook()` opens it and the `Workbook` object lets you add, rename, reorder, copy and delete sheets.

### load_workbook and its flags

```python
from openpyxl import load_workbook

wb = load_workbook("weekly_status.xlsx")
print(wb.sheetnames)          # ['Summary', 'TX', 'WY', 'NM']
ws = wb["TX"]                 # KeyError if the name is wrong
print(ws.max_row, ws.max_column, ws.dimensions)
```

| Flag | Default | Effect |
|---|---|---|
| `data_only` | `False` | Read cached formula results instead of formula text |
| `read_only` | `False` | Stream rows for large files; no writing |
| `keep_vba` | `False` | Preserve the VBA project in `.xlsm` files |
| `keep_links` | `True` | Keep external workbook links |
| `rich_text` | `False` | Load rich text runs (3.1+) |

Pass `keep_vba=True` for macro-enabled templates or the macros silently vanish on save. Pass `data_only=True` only for reading.

### Creating, renaming and reordering sheets

```python
ws_new = wb.create_sheet("Notes")          # appended at the end
ws_first = wb.create_sheet("Cover", 0)     # inserted at index 0
ws_new.title = "Analyst notes"
wb.move_sheet("Analyst notes", offset=-2)  # move two positions left
print(wb.sheetnames)
```

Sheet titles have Excel's rules: at most 31 characters, unique, and none of `\ / ? * [ ] :`. openpyxl raises `ValueError` for invalid characters and appends a number (`Sheet1`) for duplicates.

### Deleting and copying

```python
wb.remove(wb["Notes"])                     # delete a sheet
copy = wb.copy_worksheet(wb["TX"])         # copies cells, styles, dimensions, merges
copy.title = "TX (backup)"
```

`copy_worksheet` works only within the same workbook and does not copy images or charts. To copy a sheet between workbooks, loop over the cells and copy `.value` and the style attributes (`font`, `fill`, `border`, `alignment`, `number_format`) with `copy()` from the `copy` module.

### The active sheet and tab colours

The sheet that opens first in Excel is `wb.active`. Set it by index or object:

```python
wb.active = wb["Summary"]            # or wb.active = 0
wb["Summary"].sheet_properties.tabColor = "1F4E79"
wb["TX"].sheet_state = "hidden"      # 'visible', 'hidden', 'veryHidden'
```

`veryHidden` sheets can only be unhidden from the VBA editor, which is a common trick for lookup tables inside client deliverables.

### Preserving what you did not touch

openpyxl round-trips cell values, styles, merged cells, column widths, defined names, data validation, conditional formatting, tables, comments and most charts. It **drops** images and charts it did not create in some cases, PivotTable caches may be rewritten, and shapes and form controls are lost. Before promising a client "I'll just update the numbers", open their file, save it under a new name, and diff the two in Excel.

> **Warning:** `load_workbook` needs the entire file in memory in normal mode. A 40 MB workbook can take 1–2 GB of RAM because every cell becomes a Python object. Use `read_only=True` for inspection.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook, load_workbook

# Build a "client file" in memory, then reopen it as if it came by email
wb = Workbook()
wb.active.title = "Summary"
for name in ["TX", "WY", "NM"]:
    ws = wb.create_sheet(name)
    ws["A1"] = f"{name} production"
buf = BytesIO(); wb.save(buf)

wb2 = load_workbook(BytesIO(buf.getvalue()))
print("Loaded:", wb2.sheetnames)
wb2.create_sheet("Cover", 0)
wb2.remove(wb2["NM"])
backup = wb2.copy_worksheet(wb2["TX"]); backup.title = "TX (backup)"
wb2.move_sheet("TX (backup)", offset=-1)
wb2["WY"].sheet_state = "hidden"
wb2.active = wb2["Summary"]
print("After edits:", wb2.sheetnames)
print("Active sheet:", wb2.active.title, "| hidden:", [s.title for s in wb2 if s.sheet_state != "visible"])
```

### Quiz

1. Which flag keeps macros in an `.xlsm` file?
- [ ] `data_only=True`
- [x] `keep_vba=True`
- [ ] `read_only=True`
> Without `keep_vba=True` the VBA project part is dropped on save.

2. What does `wb.create_sheet("Cover", 0)` do?
- [x] Inserts a sheet named Cover as the first tab
- [ ] Creates a sheet with zero rows
- [ ] Renames the first sheet to Cover
> The second argument is the index position; 0 is first.

3. Which characters are illegal in a sheet title?
- [ ] Spaces and digits
- [x] `\ / ? * [ ] :`
- [ ] Uppercase letters
> Excel forbids those seven characters and limits titles to 31 characters.

### Exercises

1. **Sheet per state** — Given `states = ["TX", "WY", "NM", "CO"]`, create one sheet per state, each with `A1 = state`, and print the sheet names in reverse order using `move_sheet`.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); wb.remove(wb.active)
for s in ["TX", "WY", "NM", "CO"]:
    wb.create_sheet(s)["A1"] = s
for s in ["TX", "WY", "NM", "CO"]:
    wb.move_sheet(s, offset=-(wb.sheetnames.index(s)))
print(wb.sheetnames)   # ['CO', 'NM', 'WY', 'TX']
```

</details>

2. **Safe lookup** — Write a function that returns `wb[name]` if the sheet exists, otherwise creates it.
<details><summary>Solution</summary>

```python
def get_or_create(wb, name):
    return wb[name] if name in wb.sheetnames else wb.create_sheet(name)
```

</details>

### Interview Questions

**Q: What does openpyxl lose when it round-trips a client's workbook, and how do you protect against that?**
It can drop shapes, form controls, images and charts it did not create, VBA unless `keep_vba=True`, and some PivotTable or slicer details. Cell values, styles, merges, validations, conditional formats, tables and defined names survive. My protection is procedural: never save over the original, save a copy first without changes and compare it to the source in Excel, and if anything is missing, restrict openpyxl to writing a plain data sheet that the client's formulas reference, leaving the presentation workbook untouched.

**Q: How do you copy a worksheet from one workbook into another?**
`copy_worksheet` only works inside one workbook, so across files you copy manually: create the target sheet, iterate `source.iter_rows()`, and for each cell set `.value` plus `copy(cell.font)`, `copy(cell.fill)`, `copy(cell.border)`, `copy(cell.alignment)`, `copy(cell.number_format)` and `copy(cell.protection)`. Then copy `column_dimensions[...].width`, `row_dimensions[...].height`, `merged_cells.ranges` and `freeze_panes`. Use `copy()` because style objects are immutable proxies shared through the workbook's style table; assigning without copying raises `TypeError` or silently shares state.

**Q: When would you use `sheet_state = "veryHidden"`?**
For lookup tables, rate matrices or configuration ranges that formulas depend on but end users must not edit or even see in the Unhide dialog. `veryHidden` can only be reversed from the VBA editor's Properties window, so it survives casual curiosity. I pair it with workbook structure protection so sheets cannot be inserted or deleted, and I document the hidden sheet in a visible "About" tab so the next analyst is not surprised.

# LEVEL: Intermediate

## Styles: Font, PatternFill, Border and Alignment

A report that a manager will actually read needs a bold header row, a coloured band, borders around the totals and centred text. In openpyxl every one of those is a **style object** from `openpyxl.styles` assigned to a cell attribute. Style objects are immutable: you create one and assign it, you do not edit a cell's existing font in place.

### Font

```python
from openpyxl.styles import Font

header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
ws["A1"].font = header_font
ws["A2"].font = Font(italic=True, underline="single")
ws["A3"].font = Font(strike=True, color="FF0000")
```

Colours are hex strings. `"FFFFFF"` is white, `"1F4E79"` is the dark blue used in most corporate templates. openpyxl accepts 6-digit RGB or 8-digit ARGB (`"FF1F4E79"`); it stores ARGB internally.

### PatternFill

A fill is a background. Almost always you want a solid one:

```python
from openpyxl.styles import PatternFill

blue = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
ws["A1"].fill = blue
```

Forgetting `fill_type="solid"` is the classic mistake: the cell silently stays white because the default pattern type is `None`. Other pattern types such as `"lightGray"` or `"darkHorizontal"` exist but look dated; use solid fills and vary the colour.

### Border and Side

A `Border` has four sides, each a `Side` with a style and colour:

```python
from openpyxl.styles import Border, Side

thin = Side(style="thin", color="999999")
thick = Side(style="medium", color="000000")
ws["C10"].border = Border(left=thin, right=thin, top=thick, bottom=Side(style="double"))
```

Valid `Side` styles include `thin`, `medium`, `thick`, `double`, `dashed`, `dotted`, `hair` and `mediumDashed`. A top-medium plus bottom-double combination is the accounting convention for a grand-total row.

### Alignment

```python
from openpyxl.styles import Alignment

ws["A1"].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
ws["B5"].alignment = Alignment(horizontal="right", indent=1)
ws["C1"].alignment = Alignment(text_rotation=90)
```

`horizontal` accepts `left`, `center`, `right`, `fill`, `justify`, `centerContinuous` and `distributed`. `wrap_text=True` combined with a row height (next chapters) is how you get multi-line policy text into a cell.

### Applying styles to a range

Styles are per cell, so loop:

```python
for cell in ws[1]:                     # every cell in row 1
    cell.font = header_font
    cell.fill = blue
    cell.alignment = Alignment(horizontal="center")
for row in ws.iter_rows(min_row=2, max_row=ws.max_row, max_col=4):
    for cell in row:
        cell.border = Border(left=thin, right=thin, top=thin, bottom=thin)
```

### Protection and copying styles

`Protection(locked=True, hidden=False)` controls whether a cell can be edited once the sheet is protected with `ws.protection.sheet = True`. To copy the look of one cell to another, use `copy()` from the standard library because the style proxies cannot be shared directly:

```python
from copy import copy
ws["B2"].font = copy(ws["A1"].font)
ws["B2"].fill = copy(ws["A1"].fill)
ws["B2"].number_format = ws["A1"].number_format
```

### NamedStyle for reuse

When the same look appears on every sheet, register a `NamedStyle` once. It also shows up in Excel's Cell Styles gallery so the client can apply it by hand:

```python
from openpyxl.styles import NamedStyle

total_style = NamedStyle(name="Total row")
total_style.font = Font(bold=True)
total_style.border = Border(top=thick, bottom=Side(style="double"))
total_style.number_format = "#,##0.00"
wb.add_named_style(total_style)      # once per workbook
ws["C10"].style = "Total row"
```

> **Tip:** Style objects are immutable, so `ws["A1"].font.bold = True` fails with `AttributeError`. Build a new font instead: `ws["A1"].font = ws["A1"].font.copy(bold=True)` (deprecated but works) or `Font(**dict(ws["A1"].font.__dict__, bold=True))`. The clean way is to define the fonts you need up front.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment

wb = Workbook(); ws = wb.active; ws.title = "QA"
ws.append(["Agent", "Audited", "Errors", "Accuracy"])
for r in [("Sana", 120, 3, 0.975), ("Bilal", 98, 6, 0.939), ("Hira", 143, 2, 0.986)]:
    ws.append(r)

hdr_font = Font(bold=True, color="FFFFFF")
hdr_fill = PatternFill(start_color="217346", end_color="217346", fill_type="solid")
thin = Side(style="thin", color="BFBFBF")
box = Border(left=thin, right=thin, top=thin, bottom=thin)

for cell in ws[1]:
    cell.font, cell.fill = hdr_font, hdr_fill
    cell.alignment = Alignment(horizontal="center")
for row in ws.iter_rows(min_row=2, max_row=4, max_col=4):
    for cell in row:
        cell.border = box
    row[3].number_format = "0.0%"
    if row[3].value < 0.95:
        row[3].font = Font(bold=True, color="C00000")

buf = BytesIO(); wb.save(buf)
print("Header font bold:", ws["A1"].font.bold, "| fill:", ws["A1"].fill.start_color.rgb)
print("Bilal accuracy font colour:", ws["D3"].font.color.rgb)
print("Bytes:", len(buf.getvalue()))
```

### Quiz

1. Why does `PatternFill(start_color="FFFF00")` show no colour in Excel?
- [ ] The colour must be lowercase
- [x] `fill_type="solid"` was not set, so the pattern type is `None`
- [ ] Yellow is not supported
> The pattern type defaults to none; only a solid (or patterned) fill is painted.

2. What happens with `ws["A1"].font.bold = True`?
- [x] `AttributeError`, because style objects are immutable
- [ ] The cell becomes bold
- [ ] The whole row becomes bold
> Assign a new `Font(...)` object instead of mutating the existing one.

3. Which `Side` style pair marks an accounting grand total?
- [ ] thin top, thin bottom
- [x] medium top, double bottom
- [ ] dashed top, dotted bottom
> A single rule above and a double rule below is the standard total-row convention.

### Exercises

1. **Zebra rows** — Fill every even data row (rows 2, 4, 6...) with light grey `F2F2F2` across columns A:D for a 10-row sheet.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
from openpyxl.styles import PatternFill
wb = Workbook(); ws = wb.active
grey = PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid")
for r in range(2, 11, 2):
    for c in range(1, 5):
        ws.cell(row=r, column=c).fill = grey
print(ws["A4"].fill.fill_type)  # solid
```

</details>

2. **Named style** — Register a `NamedStyle` called `Header` (bold white text on dark blue, centred) and apply it to A1:C1.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
from openpyxl.styles import NamedStyle, Font, PatternFill, Alignment
wb = Workbook(); ws = wb.active
hs = NamedStyle(name="Header")
hs.font = Font(bold=True, color="FFFFFF")
hs.fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
hs.alignment = Alignment(horizontal="center")
wb.add_named_style(hs)
for cell in ws["A1:C1"][0]:
    cell.style = "Header"
```

</details>

### Interview Questions

**Q: Why are openpyxl style objects immutable, and what does that mean for performance?**
The xlsx format stores styles in a shared table (`styles.xml`) and each cell only holds an index into it. openpyxl mirrors this: `Font`, `Fill`, `Border` and `Alignment` are hashable value objects, and when you assign one to a cell openpyxl looks it up or adds it to the workbook's style arrays. Immutability makes that de-duplication safe. The practical consequence is that creating one `Font` object and assigning it to 50,000 cells is cheap, while creating a new `Font(...)` inside the loop for every cell is slower and, in older versions, could bloat the style table.

**Q: How would you apply a consistent corporate look across 30 generated workbooks?**
Define the styles once in a module: a dictionary of `NamedStyle` objects for header, body, currency, percentage and total rows, with the brand colours as constants. Each generator calls `wb.add_named_style()` for the styles it needs and applies them by name, so a colour change is one edit. Named styles also appear in Excel's Cell Styles gallery, which lets a client extend the report by hand without breaking consistency. For very large sheets I still apply styles directly through cell attributes because name lookup has a small overhead.

**Q: A client complains that your generated file "looks different" on their machine. What could cause that?**
Fonts are the usual cause: I specified `Font(name="Aptos")` and their older Office does not have it, so Excel substitutes. Theme colours are another: if I used `Color(theme=4)` it depends on the workbook theme, while hex RGB values are absolute. Column widths are measured in character units of the default font, so a different default font changes the visible width. My defaults are RGB hex colours, Calibri or Arial, and explicit widths, which render identically from Excel 2010 through Microsoft 365 and in LibreOffice.

## Number formats: currency, dates and percentages

A cell's **number format** controls how a value is displayed without changing the value. `0.975` becomes `97.5%`, `45200` becomes `2023-10-01`, and `1250` becomes `$1,250.00`. In openpyxl it is a string on `cell.number_format`, and the string uses exactly Excel's format code syntax, so anything you can type in Excel's Format Cells dialog works here.

### The formats you use most

| Purpose | Format code | `1234.5` displays as |
|---|---|---|
| Thousands separator | `#,##0` | `1,235` |
| Two decimals | `#,##0.00` | `1,234.50` |
| US currency | `"$"#,##0.00` | `$1,234.50` |
| Pakistani rupees | `"Rs "#,##0` | `Rs 1,235` |
| Percentage | `0.0%` | `123450.0%` |
| Date | `yyyy-mm-dd` | `1903-05-18` |
| Date (US) | `mm/dd/yyyy` | `05/18/1903` |
| Time | `hh:mm` | `12:00` |
| Text | `@` | `1234.5` |

```python
ws["B2"] = 1250
ws["B2"].number_format = '"$"#,##0.00'
ws["C2"] = 0.975
ws["C2"].number_format = "0.0%"
```

Remember that a percentage format multiplies by 100 for display, so store `0.975`, not `97.5`.

### Dates are numbers

Excel stores dates as the number of days since 1899-12-30 (the "1900 date system"). openpyxl converts Python `datetime.date` and `datetime.datetime` objects to that serial and applies a default date format automatically:

```python
import datetime as dt
ws["A2"] = dt.date(2026, 9, 14)
print(ws["A2"].number_format)   # yyyy-mm-dd  (default assigned by openpyxl)
ws["A2"].number_format = "dd-mmm-yyyy"   # 14-Sep-2026
```

When you read a date cell back, openpyxl returns a `datetime.datetime` if the cell's format is recognised as a date format (`cell.is_date` is `True`). If a vendor stored dates as text `"9/14/2026"`, you get a string and must `datetime.strptime` it yourself.

### Sections: positive; negative; zero; text

A format string can have up to four sections separated by semicolons. This is how accounting formats show negatives in red parentheses and zeros as dashes:

```python
ws["D2"].number_format = '#,##0.00;[Red](#,##0.00);"-"'
```

The bracketed `[Red]` is a colour code; `[Blue]`, `[Green]` and `[Color 10]` also work. Conditions like `[>=1000]` are allowed but conditional formatting (Advanced level) is the better tool for anything beyond colour.

### Built-in format constants

`openpyxl.styles.numbers` exposes named constants so you avoid typos:

```python
from openpyxl.styles.numbers import FORMAT_CURRENCY_USD_SIMPLE, FORMAT_PERCENTAGE_00, FORMAT_DATE_YYYYMMDD2
ws["B2"].number_format = FORMAT_CURRENCY_USD_SIMPLE   # "$"#,##0.00_-
ws["C2"].number_format = FORMAT_PERCENTAGE_00         # 0.00%
```

### Text that must stay text

ZIP codes, file numbers with leading zeros and phone numbers must not become numbers. Write them as strings and set the `@` format so Excel does not "help":

```python
ws["A2"] = "00871"
ws["A2"].number_format = "@"
```

> **Warning:** A number format never rounds the stored value. `=A2*100` still uses the full precision even if A2 displays two decimals. If a rate matrix must match a printed table to the cent, round in Python with `round(x, 2)` or `decimal.Decimal` before writing.

### Try It Yourself

```python
import datetime as dt
from openpyxl import Workbook

wb = Workbook(); ws = wb.active
ws.append(["File #", "Closed on", "Premium", "Commission", "Net change"])
ws.append(["00871", dt.date(2026, 9, 11), 1250, 0.125, -84.2])
ws["A2"].number_format = "@"
ws["B2"].number_format = "dd-mmm-yyyy"
ws["C2"].number_format = '"$"#,##0.00'
ws["D2"].number_format = "0.0%"
ws["E2"].number_format = '#,##0.00;[Red](#,##0.00);"-"'

for cell in ws[2]:
    print(f"{cell.coordinate}: value={cell.value!r:<28} format={cell.number_format!r} is_date={cell.is_date}")
```

### Quiz

1. What value should you store for a cell that must display `12.5%`?
- [ ] `12.5`
- [x] `0.125`
- [ ] `"12.5%"`
> The `%` format multiplies by 100 for display only.

2. How does Excel store the date 2026-09-14?
- [x] As a serial number of days since 1899-12-30
- [ ] As the text "2026-09-14"
- [ ] As a Unix timestamp
> Dates are floats in the 1900 date system; the number format makes them look like dates.

3. Which format keeps a leading zero in `"00871"`?
- [ ] `0`
- [ ] `#,##0`
- [x] `@`
> `@` is the text format; the value is also written as a string so nothing is lost.

### Exercises

1. **Rupee column** — Write 3 amounts in column B and format them as `Rs 1,234` with no decimals.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for i, v in enumerate([45000, 128500, 9999.6], start=1):
    c = ws.cell(row=i, column=2, value=v)
    c.number_format = '"Rs "#,##0'
print(ws["B3"].number_format)
```

</details>

2. **Date detection** — Given a cell, print `"date"` if `cell.is_date` is true, otherwise print the Python type name.
<details><summary>Solution</summary>

```python
import datetime as dt
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
ws["A1"] = dt.datetime(2026, 1, 5); ws["A2"] = "2026-01-05"
for c in (ws["A1"], ws["A2"]):
    print("date" if c.is_date else type(c.value).__name__)
```

</details>

### Interview Questions

**Q: What is the difference between a value and its number format, and why does it matter for reporting?**
The value is what is stored and calculated; the number format is a display mask. `0.975` with format `0.0%` shows `97.5%` but remains `0.975` in every formula and in every openpyxl read. This matters because analysts sometimes type `97.5` into a percent-formatted cell and get `9750%`, or store currency as strings like `"$1,250"` that cannot be summed. In generated reports I always write the raw numeric value and apply the format separately, which keeps totals exact and lets the client change the display without touching the data.

**Q: Explain the Excel 1900 date system and the leap-year bug.**
Excel counts days from 1899-12-30 as serial 0 in the default 1900 system, but it also treats 1900 as a leap year for Lotus 1-2-3 compatibility, so serial 60 is the non-existent 29 February 1900. Dates from 1 March 1900 onward are correct. openpyxl handles the conversion in `openpyxl.utils.datetime`, and workbooks saved on old Macs may use the 1904 system (`wb.epoch`), which shifts every date by 1,462 days. If a client's dates are all off by four years, that is the cause.

**Q: How do you write a format that shows negatives in parentheses and zeros as a dash?**
Use the four-section format code: `'#,##0.00;[Red](#,##0.00);"-";@'`. The sections are positive, negative, zero and text. The `[Red]` colour applies only to the negative section, parentheses replace the minus sign, and the literal `"-"` shows for zero. This is the accounting convention used in production and revenue reports, and it is more portable than conditional formatting because it lives in the cell's style and survives copy-paste.

## Column widths, row heights and merged cells

Data can be correct and still unreadable if every column is 8.43 characters wide. This chapter covers the layout controls: `column_dimensions`, `row_dimensions`, merging, and the auto-fit that openpyxl does not have but you can approximate.

### Column widths

```python
ws.column_dimensions["A"].width = 14
ws.column_dimensions["B"].width = 32
```

Width is measured in **characters of the default font** (Calibri 11 for most workbooks), not pixels. The Excel default is 8.43. Anything from 10 to 60 is typical; a value of 0 hides the column. You can also group columns and set them together with `ws.column_dimensions.group("D", "F", hidden=True)`.

### Approximating auto-fit

Excel's AutoFit measures rendered text, which openpyxl cannot do. The common approximation is the longest string length plus padding:

```python
from openpyxl.utils import get_column_letter

for col_cells in ws.columns:
    longest = max(len(str(c.value)) if c.value is not None else 0 for c in col_cells)
    letter = get_column_letter(col_cells[0].column)
    ws.column_dimensions[letter].width = min(max(longest + 2, 8), 60)
```

Clamp with `min`/`max` so a policy paragraph does not create a 400-character column. For numbers with formats, estimate from the formatted string length instead.

### Default widths and outline levels

If most columns should share one width, set the sheet default instead of looping: `ws.sheet_format.defaultColWidth = 12`. Columns can also be grouped into collapsible outlines for detail that a manager may not want to see: `ws.column_dimensions.group("E", "H", outline_level=1, hidden=True)` creates the little plus sign above the columns in Excel. Row groups work the same way with `ws.row_dimensions.group(5, 20, hidden=True)`.

### Row heights

```python
ws.row_dimensions[1].height = 30          # points, not characters
ws.row_dimensions[5].hidden = True
```

Row height is in points; the default is 15. If you set `wrap_text=True` and do **not** set a height, Excel auto-sizes the row on open, which is often what you want for wrapped notes.

### Merging cells

Merging combines a range into one cell whose value and style come from the top-left cell:

```python
ws.merge_cells("A1:E1")
ws["A1"] = "Weekly Production Report – Week 37"
ws["A1"].alignment = Alignment(horizontal="center")
ws.merge_cells(start_row=3, start_column=1, end_row=4, end_column=1)
ws.unmerge_cells("A1:E1")
print(ws.merged_cells.ranges)     # list of MergedCellRange objects
```

Only the top-left cell keeps data. Writing to `B1` inside a merged `A1:E1` raises `AttributeError: 'MergedCell' object attribute 'value' is read-only`. Borders on merged ranges must be applied to every cell in the range, not just the top-left, or the right and bottom edges disappear.

### Merged cells versus "Center Across Selection"

Merged cells break sorting, filtering, `Ctrl+Arrow` navigation and pandas reads (`read_excel` returns `NaN` for the non-top-left cells). For a title row merging is fine. For anything in the data area use the alignment `centerContinuous` instead, which visually centres across the columns without merging:

```python
for cell in ws["A1:E1"][0]:
    cell.alignment = Alignment(horizontal="centerContinuous")
```

### Putting the header block together

```python
ws.merge_cells("A1:E1"); ws["A1"] = "Stewart Title – TX Production"
ws.merge_cells("A2:E2"); ws["A2"] = "Week ending 2026-09-11"
ws.row_dimensions[1].height = 24
ws["A1"].font = Font(size=14, bold=True)
ws["A2"].font = Font(italic=True, color="666666")
```

> **Tip:** Set widths after writing data, not before. If you generate the sheet from a pandas DataFrame, run the auto-fit loop as the final step so it sees every value.

### Try It Yourself

```python
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment
from openpyxl.utils import get_column_letter

wb = Workbook(); ws = wb.active
ws.merge_cells("A1:D1"); ws["A1"] = "Weekly Production Report – Week 37"
ws["A1"].font = Font(size=14, bold=True); ws["A1"].alignment = Alignment(horizontal="center")
ws.row_dimensions[1].height = 26
ws.append([])   # leave row 2 blank
ws.append(["File #", "Client", "State", "Premium"])
ws.append(["TX-10432", "Lone Star Escrow & Settlement Services LLC", "TX", 1250])
ws.append(["WY-00871", "Teton Title", "WY", 980.5])

for col_cells in ws.iter_cols(min_row=3, max_row=ws.max_row):
    longest = max(len(str(c.value)) for c in col_cells if c.value is not None)
    letter = get_column_letter(col_cells[0].column)
    ws.column_dimensions[letter].width = min(max(longest + 2, 8), 40)

print("Merged:", [str(r) for r in ws.merged_cells.ranges])
for letter in "ABCD":
    print(letter, "width =", ws.column_dimensions[letter].width)
print("Row 1 height =", ws.row_dimensions[1].height)
```

### Quiz

1. In what unit is `column_dimensions["A"].width` measured?
- [ ] Pixels
- [x] Characters of the default font
- [ ] Points
> Widths are character units, which is why 8.43 is Excel's default.

2. Which cell holds the value of a merged range `A1:E1`?
- [x] A1, the top-left cell
- [ ] E1, the bottom-right cell
- [ ] All five cells
> Only the top-left cell keeps data; the others become read-only `MergedCell` objects.

3. Why does openpyxl have no true AutoFit?
- [ ] It is a paid feature
- [x] Auto-fit needs font rendering metrics that openpyxl does not have
- [ ] Excel forbids it in the file format
> Excel measures rendered glyphs at open time; openpyxl only knows the text length.

### Exercises

1. **Hide helper columns** — Write values in A:F, then hide columns D through F using a group.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
ws.append(list(range(1, 7)))
ws.column_dimensions.group("D", "F", hidden=True)
print(ws.column_dimensions["D"].hidden)  # True
```

</details>

2. **Vertical merge** — Merge A2:A4 for a state label "TX", centre it vertically, and prove that writing to A3 fails.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
from openpyxl.styles import Alignment
wb = Workbook(); ws = wb.active
ws.merge_cells("A2:A4"); ws["A2"] = "TX"
ws["A2"].alignment = Alignment(vertical="center")
try:
    ws["A3"].value = "x"
except AttributeError as e:
    print("Blocked:", e)
```

</details>

### Interview Questions

**Q: Why do many data professionals avoid merged cells, and what do you use instead?**
Merged cells break the one-value-per-cell grid that sorting, filtering, PivotTables, `Ctrl+Shift+Arrow` selection and `pandas.read_excel` all assume; the non-top-left cells come back empty, so a merged "TX" label covering three rows loses the state for rows two and three. For titles above the table I merge freely because nobody sorts a title. Inside the data I repeat the value on every row and, for a visual "centred across" heading, I use `Alignment(horizontal="centerContinuous")`, which looks identical but keeps the cells independent.

**Q: How do you implement auto-fit column widths in openpyxl, and what are its limits?**
Loop over columns, compute the longest formatted string, add padding of about 2 characters and clamp to a sensible range, then assign `column_dimensions[letter].width`. Limits: it ignores font size and bold (a 14-point bold title is much wider than its character count), it does not know how a number format renders, and proportional fonts make `WWW` wider than `iii`. For headers I apply a multiplier of about 1.2 for bold text, and for known numeric columns I set fixed widths. When exact fit matters I ask the client to press `Alt+H, O, I` once after opening; it takes two seconds and is pixel-perfect.

**Q: A merged title row loses its bottom border. Why, and how do you fix it?**
Borders are a cell property, and the merged range is rendered from all of its cells' borders, not just the top-left one. If only `A1` has a bottom border, Excel draws that border under `A1` only. The fix is to apply the border to every cell in the merged range, typically with a helper that iterates `ws[range_string]` and sets the appropriate `Side` on the outer cells. openpyxl 3.1 partially handles this through `MergedCellRange.format()`, but explicit borders are more predictable.

## Freeze panes, autofilter and print settings

A report that opens with the header row frozen, filter dropdowns ready and the page set to landscape with repeating titles looks like an analyst prepared it. All of it is a handful of properties on the worksheet.

### Freeze panes

`ws.freeze_panes` takes the cell **below and to the right** of the frozen area:

```python
ws.freeze_panes = "A2"     # freeze row 1
ws.freeze_panes = "B2"     # freeze row 1 and column A
ws.freeze_panes = None     # unfreeze
```

For a rate matrix with state codes down column A and policy amounts across row 1, `B2` is the right choice: both axes stay visible while scrolling.

### AutoFilter

An autofilter adds the dropdown arrows to a header row. Set the reference range explicitly:

```python
ws.auto_filter.ref = f"A1:{get_column_letter(ws.max_column)}{ws.max_row}"
```

You can also store a filter condition so the file opens already filtered, though Excel will show the filtered rows until it recalculates:

```python
ws.auto_filter.add_filter_column(2, ["TX", "WY"])     # column index 0-based within the range
ws.auto_filter.add_sort_condition("D2:D100", descending=True)
```

openpyxl only writes the filter definition; it does not hide rows. Excel applies the filter when the user reopens the dropdown or presses reapply. For a truly pre-filtered file, hide the rows yourself with `row_dimensions[r].hidden = True`.

### Page setup for printing

Title-insurance production reports get printed and stapled into weekly packs. The `page_setup`, `print_options` and `sheet_properties` objects control that:

```python
ws.page_setup.orientation = "landscape"
ws.page_setup.paperSize = ws.PAPERSIZE_LETTER      # or PAPERSIZE_A4
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 0                       # 0 = as many pages as needed
ws.sheet_properties.pageSetUpPr.fitToPage = True    # required for fitTo* to apply
ws.print_options.horizontalCentered = True
ws.print_options.gridLines = False
ws.page_margins.left = ws.page_margins.right = 0.5  # inches
```

### Repeating header rows and print area

```python
ws.print_title_rows = "1:1"            # repeat row 1 on every printed page
ws.print_title_cols = "A:A"            # repeat column A
ws.print_area = "A1:F200"              # only print this block
```

### Headers and footers

```python
ws.oddHeader.center.text = "&[Tab] – Confidential"
ws.oddFooter.left.text = "Generated &[Date]"
ws.oddFooter.right.text = "Page &[Page] of &[Pages]"
ws.oddFooter.right.size = 8
```

The `&[Page]`, `&[Pages]`, `&[Date]`, `&[Tab]` and `&[File]` codes are Excel's own header/footer field codes.

### Protecting the layout

Once the layout is right, stop users from breaking it. `ws.protection.sheet = True` locks every cell that has `Protection(locked=True)` (the default), and `ws.protection.password = "review"` sets an optional password. Unlock only the input cells with `cell.protection = Protection(locked=False)` before enabling sheet protection, and set `ws.protection.autoFilter = False` if users must still be able to use the filter dropdowns. Workbook structure protection (`wb.security = WorkbookProtection(workbookPassword="x", lockStructure=True)`) prevents sheets from being added, renamed or deleted.

### Sheet view options

```python
ws.sheet_view.showGridLines = False    # dashboard look
ws.sheet_view.zoomScale = 90
ws.sheet_properties.tabColor = "217346"
```

| Setting | Where | Typical value |
|---|---|---|
| Freeze header | `ws.freeze_panes` | `"A2"` |
| Filter arrows | `ws.auto_filter.ref` | `"A1:F500"` |
| Landscape | `ws.page_setup.orientation` | `"landscape"` |
| Fit to 1 page wide | `fitToWidth=1`, `fitToHeight=0`, `fitToPage=True` | |
| Repeat header | `ws.print_title_rows` | `"1:1"` |

> **Tip:** `freeze_panes` and `auto_filter.ref` are the two lines that make a raw data dump feel finished. Add them to every table-writing helper you own so you never forget.

### Try It Yourself

```python
from openpyxl import Workbook
from openpyxl.utils import get_column_letter

wb = Workbook(); ws = wb.active; ws.title = "TX"
ws.append(["File #", "Client", "County", "Premium", "Status"])
for i in range(1, 41):
    ws.append([f"TX-{10400 + i}", f"Client {i}", "Harris" if i % 3 else "Dallas", 900 + i * 12.5, "Closed" if i % 4 else "Open"])

ws.freeze_panes = "B2"
ws.auto_filter.ref = f"A1:{get_column_letter(ws.max_column)}{ws.max_row}"
ws.page_setup.orientation = "landscape"
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 0
ws.sheet_properties.pageSetUpPr.fitToPage = True
ws.print_title_rows = "1:1"
ws.oddFooter.right.text = "Page &[Page] of &[Pages]"
ws.sheet_view.showGridLines = False

print("Freeze:", ws.freeze_panes)
print("Filter:", ws.auto_filter.ref)
print("Orientation:", ws.page_setup.orientation, "| fit to page:", ws.sheet_properties.pageSetUpPr.fitToPage)
print("Print titles:", ws.print_title_rows, "| footer:", ws.oddFooter.right.text)
```

### Quiz

1. Which value freezes the top row and the first column?
- [ ] `"A1"`
- [x] `"B2"`
- [ ] `"A2"`
> The freeze cell is the first unfrozen cell; `B2` leaves row 1 and column A fixed.

2. What does `ws.auto_filter.ref = "A1:F100"` do to the rows?
- [ ] Hides rows that do not match
- [x] Adds filter dropdowns to the header; rows are not hidden
- [ ] Sorts them
> openpyxl writes the filter definition only; Excel applies it interactively.

3. For `fitToWidth=1` to take effect you must also set:
- [x] `ws.sheet_properties.pageSetUpPr.fitToPage = True`
- [ ] `ws.page_setup.scale = 100`
- [ ] `ws.print_area`
> Excel ignores the fit-to values unless the fit-to-page flag is on.

### Exercises

1. **Print pack** — Configure a sheet for portrait A4, fit to one page wide, repeat rows 1 to 2, and put the sheet name in the header centre.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
ws.page_setup.orientation = "portrait"
ws.page_setup.paperSize = ws.PAPERSIZE_A4
ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 0
ws.sheet_properties.pageSetUpPr.fitToPage = True
ws.print_title_rows = "1:2"
ws.oddHeader.center.text = "&[Tab]"
```

</details>

2. **Pre-hidden rows** — Hide every row where column E equals "Open" on a 10-row sheet so the file opens showing closed files only.
<details><summary>Solution</summary>

```python
for row in ws.iter_rows(min_row=2, max_row=ws.max_row):
    if row[4].value == "Open":
        ws.row_dimensions[row[0].row].hidden = True
```

</details>

### Interview Questions

**Q: What is the difference between an autofilter and hiding rows in openpyxl?**
An autofilter is metadata: it tells Excel which range has dropdowns and, optionally, which criteria are selected, but openpyxl never evaluates the criteria, so all rows remain visible until Excel reapplies the filter. Hiding rows through `row_dimensions[n].hidden = True` is a concrete instruction that any viewer honours immediately, including LibreOffice and pandas (which still reads hidden rows). When a manager wants a file that opens showing only open items, I set both: the filter so they can change it, and hidden rows so the first impression is correct.

**Q: How do you make a wide report print on one page width without shrinking it to unreadable size?**
Set landscape orientation, `fitToWidth=1`, `fitToHeight=0` and `fitToPage=True`, then reduce what needs to fit: hide helper columns, shorten headers with `wrap_text`, and set explicit widths. Set `print_title_rows` so headers repeat on every page. If the sheet still scales below about 60 percent, split it into a summary sheet and a detail sheet, or set a `print_area` that excludes the notes column. I check by opening the file and looking at Page Layout view; scale is visible in `ws.page_setup.scale` if I set it manually instead of fit-to.

**Q: Where is `freeze_panes` stored in the file, and why does it sometimes not stick after a pandas write?**
It lives in `sheetN.xml` under `<sheetViews><sheetView><pane .../>`. `DataFrame.to_excel()` has its own `freeze_panes=(1, 0)` argument, but if you write with pandas, then open the file with openpyxl and rewrite the sheet, the pane definition is recreated only if you set `ws.freeze_panes` again. In pipelines I apply all view settings in the final openpyxl pass, after every data write, so nothing earlier can undo them.

## Named ranges and defined names

A **defined name** is a label for a cell or range, like `TaxRate` for `Rates!$B$2` or `PolicyAmounts` for `Matrix!$A$2:$A$3347`. Formulas that use names are readable, and code that writes to a named range does not break when the client inserts a column. openpyxl exposes them through `openpyxl.workbook.defined_name.DefinedName`.

### Creating a workbook-level name

The API changed in openpyxl 3.1. The current form treats `wb.defined_names` as a dictionary:

```python
from openpyxl.workbook.defined_name import DefinedName

dn = DefinedName("TaxRate", attr_text="Rates!$B$2")
wb.defined_names["TaxRate"] = dn          # openpyxl 3.1+
# openpyxl 3.0: wb.defined_names.append(dn)
```

Sheet names with spaces need single quotes inside the reference: `"'Rate Matrix'!$A$2:$C$3347"`. Use absolute references (`$`) so the name does not shift.

### Sheet-scoped names

A name can be local to one worksheet, which lets every state sheet have its own `Total`:

```python
ws = wb["TX"]
ws.defined_names["Total"] = DefinedName("Total", attr_text="TX!$D$50")   # 3.1+
```

Excel resolves a sheet-scoped name first when a formula on that sheet uses it.

### Reading and resolving names

```python
for name, dn in wb.defined_names.items():
    print(name, "->", dn.attr_text)
    for sheet_title, coord in dn.destinations:      # yields (sheet, 'A2:C10') pairs
        cells = wb[sheet_title][coord]
```

`destinations` parses the reference into sheet and cell range, so you can read the data the name points at. Names that hold constants (`=0.0625`) or formulas have no destinations, and `dn.value` gives the raw text.

### Using names in formulas

```python
ws["E2"] = "=D2*TaxRate"
ws["F2"] = "=VLOOKUP(A2,RateMatrix,3,FALSE)"
```

Because the name resolves to the current range, a rate matrix that grows from 3,346 to 3,500 rows only needs its name updated once, in one place, rather than in every VLOOKUP.

### Names for print areas and titles

Excel implements print areas as the reserved names `_xlnm.Print_Area` and `_xlnm.Print_Titles`. openpyxl manages those for you through `ws.print_area` and `ws.print_title_rows`; do not create them by hand or you get duplicates.

### Naming rules and constants

Excel accepts names that start with a letter, underscore or backslash, contain no spaces, are at most 255 characters and do not look like a cell reference (`R1C1` and `TX1` are both rejected). Names are case-insensitive, so `TaxRate` and `taxrate` collide. A name does not have to point at cells: `DefinedName("FiscalYear", attr_text="2026")` stores a constant, and `DefinedName("LastRow", attr_text="COUNTA(Rates!$A:$A)")` stores a formula that Excel evaluates whenever the name is used. Constants are a clean way to ship a version number or a report date inside the workbook without occupying a visible cell.

### Deleting a name

```python
del wb.defined_names["TaxRate"]        # 3.1+
```

| Task | openpyxl 3.1 |
|---|---|
| Add workbook name | `wb.defined_names[n] = DefinedName(n, attr_text=ref)` |
| Add sheet name | `ws.defined_names[n] = DefinedName(n, attr_text=ref)` |
| List | `wb.defined_names.items()` |
| Resolve | `dn.destinations` |
| Delete | `del wb.defined_names[n]` |

> **Interview note:** Candidates are often asked why a `#NAME?` error appears after a workbook is generated. Common causes are a defined name referencing a sheet that was renamed, a name with a space or starting with a digit (both invalid), or a name that looks like a cell reference such as `TX1`.

### Try It Yourself

```python
from openpyxl import Workbook
from openpyxl.workbook.defined_name import DefinedName

wb = Workbook(); rates = wb.active; rates.title = "Rates"
rates.append(["Policy amount", "Rate per $1000"])
for amt, rate in [(50000, 5.75), (100000, 5.25), (250000, 4.60), (500000, 3.95)]:
    rates.append([amt, rate])
rates["D1"], rates["D2"] = "Tax rate", 0.0625

wb.defined_names["RateMatrix"] = DefinedName("RateMatrix", attr_text="Rates!$A$2:$B$5")
wb.defined_names["TaxRate"] = DefinedName("TaxRate", attr_text="Rates!$D$2")

calc = wb.create_sheet("Calc")
calc.append(["Policy amount", "Rate", "Premium", "With tax"])
calc.append([250000, "=VLOOKUP(A2,RateMatrix,2,TRUE)", "=A2/1000*B2", "=C2*(1+TaxRate)"])

for name, dn in wb.defined_names.items():
    for sheet, coord in dn.destinations:
        cells = wb[sheet][coord]
        first = cells[0][0].value if isinstance(cells, tuple) else cells.value
        print(f"{name} -> {sheet}!{coord} (first value: {first})")
print("Calc!D2 =", calc["D2"].value)
```

### Quiz

1. How do you add a workbook-level defined name in openpyxl 3.1?
- [ ] `wb.defined_names.append(dn)`
- [x] `wb.defined_names["Name"] = dn`
- [ ] `wb.add_name(dn)`
> 3.1 made `defined_names` dictionary-like; `append` was the 3.0 API.

2. Which name is invalid in Excel?
- [ ] `Tax_Rate`
- [x] `2024Rates`
- [ ] `RateMatrix`
> Names cannot start with a digit, contain spaces, or look like cell references.

3. What does `dn.destinations` give you?
- [x] Pairs of sheet title and cell range the name refers to
- [ ] The cached value of the name
- [ ] Nothing; it is deprecated
> `destinations` parses the reference text so you can locate the cells.

### Exercises

1. **Name per sheet** — For sheets TX and WY, create a sheet-scoped name `Premiums` pointing at that sheet's `$D$2:$D$100`.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
from openpyxl.workbook.defined_name import DefinedName
wb = Workbook(); wb.active.title = "TX"; wb.create_sheet("WY")
for t in ["TX", "WY"]:
    wb[t].defined_names["Premiums"] = DefinedName("Premiums", attr_text=f"{t}!$D$2:$D$100")
print({t: wb[t].defined_names["Premiums"].attr_text for t in ["TX", "WY"]})
```

</details>

2. **Grow a name** — Write a function `set_name(wb, name, sheet, first_col, last_col, last_row)` that creates or replaces a workbook name covering rows 1 to `last_row`.
<details><summary>Solution</summary>

```python
from openpyxl.workbook.defined_name import DefinedName
def set_name(wb, name, sheet, first_col, last_col, last_row):
    ref = f"'{sheet}'!${first_col}$1:${last_col}${last_row}"
    wb.defined_names[name] = DefinedName(name, attr_text=ref)
```

</details>

### Interview Questions

**Q: Why use defined names in generated workbooks instead of hard-coded ranges?**
Names decouple formulas and code from physical positions. A `VLOOKUP` against `RateMatrix` keeps working when the matrix gains rows or moves to another sheet, whereas `Rates!$A$2:$C$3347` must be edited everywhere it appears. Names also document intent: `=D2*TaxRate` is self-explanatory in an audit, `=D2*Rates!$D$2` is not. In automation, my writer updates the name's reference once after it knows the final row count, and every dependent formula is correct by construction.

**Q: What changed in openpyxl's defined-name API between 3.0 and 3.1, and how do you write code that works on both?**
In 3.0 `wb.defined_names` was a `DefinedNameList` with `.append()`, `.get()` and `.delete()`. In 3.1 it became a dictionary subclass, so you assign with `wb.defined_names[name] = DefinedName(...)`, and sheet-scoped names moved to `ws.defined_names`. To support both I check `hasattr(wb.defined_names, "append")` and branch, or pin the version in `requirements.txt`, which is what I actually recommend because the dict form is cleaner and 3.0 is no longer maintained.

**Q: How do you find every cell a defined name refers to and validate that the range is not empty?**
Iterate `wb.defined_names.items()`, call `dn.destinations` to get `(sheet, coordinate)` pairs, index the worksheet with the coordinate to get the cells, and scan for `None` values. Names with `destinations` empty are constants or formulas and are skipped. I run this as a pre-delivery check on rate workbooks because a name pointing at a range that a client cleared is the number one cause of `#N/A` floods in their lookups, and it takes a second to detect programmatically.

# LEVEL: Advanced

## Conditional formatting: CellIsRule, ColorScaleRule and FormulaRule

Conditional formatting is formatting that Excel applies **at view time** based on a rule, so it stays correct when the numbers change. openpyxl writes the rules; Excel evaluates them. The rules live in `openpyxl.formatting.rule` and you attach them with `ws.conditional_formatting.add(range_string, rule)`.

### CellIsRule: compare a cell against a value

```python
from openpyxl.styles import PatternFill, Font
from openpyxl.formatting.rule import CellIsRule

red = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
green = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")

ws.conditional_formatting.add("D2:D200",
    CellIsRule(operator="lessThan", formula=["0.95"], fill=red, font=Font(color="9C0006")))
ws.conditional_formatting.add("D2:D200",
    CellIsRule(operator="greaterThanOrEqual", formula=["0.95"], fill=green))
```

Operators: `between`, `notBetween`, `equal`, `notEqual`, `greaterThan`, `lessThan`, `greaterThanOrEqual`, `lessThanOrEqual`. `formula` is always a list of strings because `between` needs two: `formula=["0.9", "0.95"]`. A value can reference a cell (`formula=["$H$1"]`) so the threshold is editable.

### ColorScaleRule: heat maps

A colour scale shades every cell in a range relative to the others. This is the standard way to make a 3,346-row rate matrix readable at a glance:

```python
from openpyxl.formatting.rule import ColorScaleRule

ws.conditional_formatting.add("B2:Z3347", ColorScaleRule(
    start_type="min", start_color="63BE7B",
    mid_type="percentile", mid_value=50, mid_color="FFEB84",
    end_type="max", end_color="F8696B"))
```

Types are `min`, `max`, `num`, `percent`, `percentile` and `formula`. Omit the `mid_*` arguments for a two-colour scale.

### DataBarRule and IconSetRule

```python
from openpyxl.formatting.rule import DataBarRule, IconSetRule

ws.conditional_formatting.add("C2:C200", DataBarRule(start_type="min", end_type="max", color="638EC6"))
ws.conditional_formatting.add("E2:E200", IconSetRule("3TrafficLights1", "percent", [0, 33, 67]))
```

Icon set names follow Excel's: `3Arrows`, `3TrafficLights1`, `4Rating`, `5Quarters` and so on.

### FormulaRule: anything Excel can express

A formula rule is evaluated for each cell in the range, with references relative to the **top-left cell** of the range. That lets you highlight whole rows:

```python
from openpyxl.formatting.rule import FormulaRule

ws.conditional_formatting.add("A2:F200",
    FormulaRule(formula=['$E2="Open"'], fill=PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")))
ws.conditional_formatting.add("A2:F200",
    FormulaRule(formula=["MOD(ROW(),2)=0"], fill=PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid")))
ws.conditional_formatting.add("B2:B200",
    FormulaRule(formula=["COUNTIF($B$2:$B$200,B2)>1"], font=Font(color="C00000", bold=True)))
```

Note the mixed reference `$E2`: the column is fixed so every cell in the row looks at column E, while the row shifts. Write the formula without the leading `=`.

### Rule order and stopIfTrue

Rules are evaluated in the order added, and later rules do not override an earlier rule's conflicting property unless the earlier one has `stopIfTrue=False` (the default). Pass `stopIfTrue=True` to a rule to stop evaluating the rest when it matches, exactly as in Excel's Manage Rules dialog.

### Inspecting existing rules

```python
for cf_range, rules in ws.conditional_formatting._cf_rules.items():
    for r in rules:
        print(cf_range.sqref, r.type, r.operator, r.formula)
```

| Rule | Class | Typical use |
|---|---|---|
| Threshold colour | `CellIsRule` | Accuracy below 95 percent in red |
| Heat map | `ColorScaleRule` | Rate matrix, aging buckets |
| In-cell bars | `DataBarRule` | Premium per file |
| Symbols | `IconSetRule` | KPI status |
| Row highlight / duplicates | `FormulaRule` | Open items, repeated file numbers |

> **Warning:** Conditional formats are not visible in `cell.fill`. Reading `ws["D5"].fill` after adding a rule still returns the base fill, because the rule is applied by Excel, not stored per cell. To test rules, assert on `ws.conditional_formatting` contents, not on cell styles.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font
from openpyxl.formatting.rule import CellIsRule, ColorScaleRule, FormulaRule

wb = Workbook(); ws = wb.active; ws.title = "QA"
ws.append(["Agent", "Audited", "Errors", "Accuracy", "Status"])
data = [("Sana", 120, 3, 0.975, "Active"), ("Bilal", 98, 6, 0.939, "Coaching"),
        ("Hira", 143, 2, 0.986, "Active"), ("Umar", 77, 9, 0.883, "Coaching")]
for r in data:
    ws.append(r)
for row in ws.iter_rows(min_row=2, min_col=4, max_col=4):
    row[0].number_format = "0.0%"

red = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")
amber = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
ws.conditional_formatting.add("D2:D5", CellIsRule(operator="lessThan", formula=["0.95"], fill=red, font=Font(color="9C0006")))
ws.conditional_formatting.add("C2:C5", ColorScaleRule(start_type="min", start_color="63BE7B", end_type="max", end_color="F8696B"))
ws.conditional_formatting.add("A2:E5", FormulaRule(formula=['$E2="Coaching"'], fill=amber))

buf = BytesIO(); wb.save(buf)
for cf in ws.conditional_formatting:
    for rule in cf.rules:
        print(f"{cf.sqref}: type={rule.type} operator={rule.operator} formula={rule.formula}")
print("D3 base fill is still:", ws["D3"].fill.fill_type)
```

### Quiz

1. Which reference style highlights an entire row based on column E?
- [ ] `E$2="Open"`
- [x] `$E2="Open"`
- [ ] `$E$2="Open"`
> Fix the column with `$E` and let the row shift for each row in the range.

2. Why is `formula` a list in `CellIsRule`?
- [x] Because operators like `between` need two values
- [ ] Because Excel stores formulas as arrays
- [ ] It is a historical accident
> `between` and `notBetween` take a lower and upper bound.

3. After adding a rule, what does `ws["D5"].fill` return?
- [ ] The rule's fill if the condition is met
- [x] The cell's own base fill, unaffected by rules
- [ ] `None`
> Conditional formats are evaluated by Excel at display time and are not stored on the cell.

### Exercises

1. **Duplicate file numbers** — Add a rule that bolds any value in A2:A500 that appears more than once in the column.
<details><summary>Solution</summary>

```python
from openpyxl.styles import Font
from openpyxl.formatting.rule import FormulaRule
ws.conditional_formatting.add("A2:A500",
    FormulaRule(formula=["COUNTIF($A$2:$A$500,A2)>1"], font=Font(bold=True, color="C00000")))
```

</details>

2. **Aging heat map** — Apply a two-colour scale (white to red) to a Days-Open column G2:G300.
<details><summary>Solution</summary>

```python
from openpyxl.formatting.rule import ColorScaleRule
ws.conditional_formatting.add("G2:G300",
    ColorScaleRule(start_type="min", start_color="FFFFFF", end_type="max", end_color="F8696B"))
```

</details>

### Interview Questions

**Q: When do you choose conditional formatting over static styling in a generated report?**
Static styles are right when the colour is a fact about the layout (header row, totals) or when the file will be consumed by tools that read styles, such as a PDF converter or a pandas-based test. Conditional formatting is right when the colour is a function of the data and the client will edit the numbers: an accuracy threshold, an aging heat map, a duplicate check. It also keeps the file smaller and the code shorter because one rule replaces per-cell decisions. In a weekly QA workbook I use both: static styling for structure and three or four conditional rules that keep working as team leads type in new audits.

**Q: How do relative references work inside a FormulaRule, and what is the classic bug?**
Excel evaluates the formula as if it were entered in the top-left cell of the applied range and then shifts relative references for every other cell. If the range is `A2:F200` and the formula is `$E2="Open"`, cell `A3` evaluates `$E3="Open"`. The classic bug is writing the formula for row 1 or for a different anchor than the range starts at, so every row is checked against the wrong neighbour; the rule then appears to work but one row off. The second bug is forgetting the `$` on the column, so cells in column B check column F.

**Q: How would you test that the right conditional formats exist without opening Excel?**
Load the workbook and iterate `ws.conditional_formatting`; each entry has `sqref` for the range and `rules` for the list of `Rule` objects with `type`, `operator`, `formula` and `dxf` (the differential style). Assert on those. For the visual result I use LibreOffice headless to convert to PDF in CI and compare against an approved rendering, but the structural assertion catches 95 percent of regressions in milliseconds and is what runs on every commit.

## Data validation and dropdown lists

Data validation restricts what a user can type into a cell: a dropdown of allowed statuses, a whole number between 1 and 100, a date after today. For a client deliverable it is the difference between "Closed", "closed" and "Closd" appearing in the same column. openpyxl exposes it through `openpyxl.worksheet.datavalidation.DataValidation`.

### A list dropdown

```python
from openpyxl.worksheet.datavalidation import DataValidation

dv = DataValidation(type="list", formula1='"Open,Closed,Pending"', allow_blank=True)
dv.error = "Choose Open, Closed or Pending"
dv.errorTitle = "Invalid status"
dv.prompt = "Pick a status from the list"
dv.promptTitle = "Status"
ws.add_data_validation(dv)      # register on the sheet first
dv.add("E2:E500")               # then attach ranges
```

The inline list is a quoted, comma-separated string and is limited to 255 characters. For anything longer, or for a list the client maintains, point at a range:

```python
dv = DataValidation(type="list", formula1="=Lists!$A$2:$A$60", allow_blank=False)
```

Put lookup lists on a dedicated sheet, hide it, and use a defined name (`=StatusList`) if the range may grow.

### Numeric, date and length rules

```python
whole = DataValidation(type="whole", operator="between", formula1="1", formula2="100")
dec = DataValidation(type="decimal", operator="greaterThan", formula1="0")
date = DataValidation(type="date", operator="greaterThanOrEqual", formula1="DATE(2026,1,1)")
length = DataValidation(type="textLength", operator="lessThanOrEqual", formula1="8")
custom = DataValidation(type="custom", formula1='=AND(ISNUMBER(D2),D2<=B2)')
```

Types: `whole`, `decimal`, `list`, `date`, `time`, `textLength`, `custom`. Operators are the same set as conditional formatting. A `custom` formula is evaluated relative to the first cell of the range, just like `FormulaRule`.

### Error styles

`dv.errorStyle` accepts `"stop"` (default, rejects the entry), `"warning"` (asks to continue) or `"information"` (informs and accepts). Set `dv.showErrorMessage = True` and `dv.showInputMessage = True`; they default to true in recent versions but being explicit avoids surprises across versions.

### Multiple ranges, one rule

A single `DataValidation` can cover several ranges. Call `dv.add()` more than once or pass a space-separated `sqref`:

```python
dv.add("E2:E500")
dv.add("K2:K500")
print(dv.sqref)     # E2:E500 K2:K500
```

### Reading validations from a client file

```python
for dv in ws.data_validations.dataValidation:
    print(dv.sqref, dv.type, dv.formula1)
```

This is worth running on any template a client sends: hidden validations explain why their "simple" sheet rejects your generated values. If your code writes `"CLOSED"` into a cell validated for `"Closed"`, Excel does **not** complain on open; validation only fires on manual entry. The bad value silently sits there until someone runs Circle Invalid Data.

| Need | `type` | `formula1` example |
|---|---|---|
| Status dropdown | `list` | `'"Open,Closed"'` or `"=Lists!$A$2:$A$9"` |
| Score 0–100 | `whole` | `"0"`, `formula2="100"` |
| Premium > 0 | `decimal` | `"0"` with `operator="greaterThan"` |
| Not in the past | `date` | `"TODAY()"` with `operator="greaterThanOrEqual"` |
| File number of 8 chars | `textLength` | `"8"` with `operator="equal"` |

> **Tip:** Validation does not stop paste. A user can paste over a validated cell and the rule is lost with the paste. If integrity matters, combine validation with sheet protection and a Python-side check when you read the file back.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook
from openpyxl.worksheet.datavalidation import DataValidation

wb = Workbook(); ws = wb.active; ws.title = "Tracker"
lists = wb.create_sheet("Lists"); lists.sheet_state = "hidden"
for i, s in enumerate(["Open", "Closed", "Pending", "On hold"], start=1):
    lists.cell(row=i, column=1, value=s)

ws.append(["File #", "Premium", "Status", "Audit score"])
ws.append(["TX-10432", 1250, "Open", 97])

status = DataValidation(type="list", formula1="=Lists!$A$1:$A$4", allow_blank=False)
status.error, status.errorTitle = "Pick a value from the list", "Invalid status"
premium = DataValidation(type="decimal", operator="greaterThan", formula1="0")
premium.errorStyle = "warning"
score = DataValidation(type="whole", operator="between", formula1="0", formula2="100")
for dv, rng in [(status, "C2:C500"), (premium, "B2:B500"), (score, "D2:D500")]:
    ws.add_data_validation(dv); dv.add(rng)

buf = BytesIO(); wb.save(buf)
for dv in ws.data_validations.dataValidation:
    print(f"{str(dv.sqref):9s} type={dv.type:8s} op={dv.operator} f1={dv.formula1} f2={dv.formula2} style={dv.errorStyle}")
```

### Quiz

1. What is the maximum length of an inline list in `formula1`?
- [ ] 32 characters
- [x] 255 characters
- [ ] Unlimited
> Longer lists must reference a range or a defined name.

2. What must happen before `dv.add("E2:E500")` works correctly?
- [x] `ws.add_data_validation(dv)` registers the validation on the sheet
- [ ] The sheet must be protected
- [ ] The cells must already contain values
> The validation object must belong to a worksheet before ranges are attached and saved.

3. Does Excel reject invalid values that openpyxl wrote into a validated cell?
- [ ] Yes, on open
- [x] No, validation only fires on manual entry
- [ ] Only if the cell is locked
> Validation is an input guard; existing values are never re-checked automatically.

### Exercises

1. **Yes/No column** — Add a dropdown with `Yes` and `No` to F2:F100 with a custom error message.
<details><summary>Solution</summary>

```python
from openpyxl.worksheet.datavalidation import DataValidation
dv = DataValidation(type="list", formula1='"Yes,No"', allow_blank=True)
dv.error = "Enter Yes or No"; dv.errorTitle = "Invalid"
ws.add_data_validation(dv); dv.add("F2:F100")
```

</details>

2. **Dependent check** — Require that the value in D (Commission) is never more than the value in B (Premium) on the same row for rows 2 to 300.
<details><summary>Solution</summary>

```python
from openpyxl.worksheet.datavalidation import DataValidation
dv = DataValidation(type="custom", formula1="=D2<=B2")
dv.error = "Commission cannot exceed premium"
ws.add_data_validation(dv); dv.add("D2:D300")
```

</details>

### Interview Questions

**Q: A client's tracker has a dropdown that works in their file but not in the copy your script generates. What do you check?**
First, whether my code created the validation at all: `ws.data_validations.dataValidation` should list it with the right `sqref`. Second, the source of the list: if `formula1` references a sheet I renamed or a defined name I dropped, Excel silently shows no dropdown. Third, whether the sheet was written in write-only mode, which does not support validations. Fourth, whether I loaded with `read_only=True` and then copied cells, which never carries validations across. In practice the cause is usually the renamed sheet, and pointing the list at a hidden `Lists` sheet with a stable name fixes it permanently.

**Q: How do you enforce data quality when validation can be bypassed by paste?**
Validation is the first line, not the last. I lock the sheet so only input cells are editable, use `stop` error style for hard rules, and add a conditional-format rule that turns any value not in the allowed list red so bad pastes are visible. On the read side, the ingestion script checks every value against the same list and rejects the file with a row-and-column report before anything reaches the database. That mirrors the QA process from BPO data processing: prevention at entry, detection at review, rejection at intake.

**Q: What is the difference between `list` validation with an inline string and one that references a range?**
Inline strings are self-contained and survive copying the sheet to another workbook, but they cap at 255 characters and require a code change to update. Range references can be long, can be edited by the client, and can be made dynamic through a defined name that grows with `COUNTA`, but they break if the referenced sheet is deleted or renamed. For fixed vocabularies under a dozen items I inline; for client-maintained lists such as county names or agent rosters I reference a hidden sheet via a defined name.

## Excel tables (ListObject) and structured references

An Excel **table** (Insert → Table, `Ctrl+T`) is a range that Excel treats as a unit: banded rows, a header with filters, automatic expansion when you add data, and formulas that use column names (`=[@Premium]*[@Rate]`) instead of `D2*E2`. In openpyxl a table is `openpyxl.worksheet.table.Table` and Excel calls the same thing a `ListObject`.

### Creating a table

```python
from openpyxl.worksheet.table import Table, TableStyleInfo

ws.append(["File #", "State", "Premium", "Status"])
for r in rows:
    ws.append(r)

tab = Table(displayName="Production", ref=f"A1:D{ws.max_row}")
tab.tableStyleInfo = TableStyleInfo(name="TableStyleMedium9", showFirstColumn=False,
                                    showLastColumn=False, showRowStripes=True, showColumnStripes=False)
ws.add_table(tab)
```

Rules that will bite you if you skip them:

- `displayName` must be unique in the workbook, contain no spaces, and not look like a cell reference.
- Every header cell must be a **non-empty string**, and the headers must be unique. A numeric header or a blank causes Excel to report the file as corrupt.
- The `ref` must include the header row.
- Do not overlap tables or put a table on a merged cell.

### Style names

Built-in style names follow Excel's gallery: `TableStyleLight1` to `TableStyleLight21`, `TableStyleMedium1` to `TableStyleMedium28`, `TableStyleDark1` to `TableStyleDark11`. `Medium2` (blue) and `Medium9` (green) are the ones people recognise from default Excel.

### Structured references in formulas

Inside a table Excel lets formulas refer to columns by name. openpyxl writes them as plain text:

```python
ws["E1"] = "Tax"
tab.ref = f"A1:E{ws.max_row}"        # widen the table to include the new column
for r in range(2, ws.max_row + 1):
    ws.cell(row=r, column=5, value="=[@Premium]*TaxRate")
```

Outside the table, formulas can address the whole column: `=SUM(Production[Premium])` or `=COUNTIFS(Production[State],"TX",Production[Status],"Open")`. These stay correct as the table grows, which is exactly what a summary sheet on a weekly report needs.

### Totals row and calculated columns

```python
tab.totalsRowCount = 1
tab.totalsRowShown = True
# then write the totals row yourself:
ws.cell(row=ws.max_row + 1, column=1, value="Total")
ws.cell(row=ws.max_row, column=3, value="=SUBTOTAL(109,Production[Premium])")
```

`SUBTOTAL(109, ...)` sums only visible rows, so filtering the table updates the total. For a calculated column, set `tab.tableColumns[4].calculatedColumnFormula` so Excel keeps filling it when rows are added; the simpler approach is to write the formula in every row, which is what most generators do.

### Reading tables from a client file

```python
for name, ref in ws.tables.items():
    print(name, ref)
tab = ws.tables["Production"]
print(tab.ref, [c.name for c in tab.tableColumns])
```

`ws.tables` is a dictionary of name to `Table` in 3.1 (earlier versions exposed a list under `ws._tables`). Combining the table's `ref` with `ws[ref]` gives you the data rows without guessing where the table ends.

### AutoFilter versus Table

| Feature | AutoFilter | Table |
|---|---|---|
| Filter dropdowns | Yes | Yes |
| Banded rows | Manual | Automatic |
| Grows with data | No | Yes |
| Column-name formulas | No | Yes |
| Works with merged cells | Yes | No |
| Can feed a PivotTable by name | No | Yes |

> **Warning:** A table and a sheet-level `ws.auto_filter` cannot coexist on the same range. If you set both, Excel repairs the file and drops one. Tables carry their own `autoFilter`; leave `ws.auto_filter.ref` unset.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook, load_workbook
from openpyxl.worksheet.table import Table, TableStyleInfo

wb = Workbook(); ws = wb.active; ws.title = "Data"
ws.append(["File #", "State", "Premium", "Status"])
for i in range(1, 9):
    ws.append([f"TX-{10400 + i}", "TX" if i % 2 else "WY", 900 + i * 25, "Open" if i % 3 == 0 else "Closed"])

tab = Table(displayName="Production", ref=f"A1:D{ws.max_row}")
tab.tableStyleInfo = TableStyleInfo(name="TableStyleMedium9", showRowStripes=True)
ws.add_table(tab)

summary = wb.create_sheet("Summary")
summary["A1"], summary["B1"] = "Total premium", "=SUM(Production[Premium])"
summary["A2"], summary["B2"] = "Open TX files", '=COUNTIFS(Production[State],"TX",Production[Status],"Open")'

buf = BytesIO(); wb.save(buf)
wb2 = load_workbook(BytesIO(buf.getvalue()))
t = wb2["Data"].tables["Production"]
print("Table:", t.displayName, "ref:", t.ref, "style:", t.tableStyleInfo.name)
print("Columns:", [c.name for c in t.tableColumns])
print("Summary formulas:", wb2["Summary"]["B1"].value, "|", wb2["Summary"]["B2"].value)
```

### Quiz

1. Which header causes Excel to report a corrupt file when used in a Table?
- [ ] `"File #"`
- [x] A blank cell or a number
- [ ] `"Status"`
> Table headers must be unique, non-empty strings.

2. What does `=SUM(Production[Premium])` do as the table grows?
- [x] Keeps summing the whole column automatically
- [ ] Sums only the original rows
- [ ] Returns `#REF!`
> Structured references resolve to the table's current extent.

3. Which is true about tables and `ws.auto_filter`?
- [ ] They must always be used together
- [x] They must not cover the same range
- [ ] Tables do not support filtering
> A table has its own filter; a second sheet-level filter on the range corrupts the file.

### Exercises

1. **Table from tuples** — Given a list of `(agent, audited, errors)` tuples, write them under headers and wrap them in a table named `QA` with `TableStyleLight9`.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
from openpyxl.worksheet.table import Table, TableStyleInfo
rows = [("Sana", 120, 3), ("Bilal", 98, 6)]
wb = Workbook(); ws = wb.active
ws.append(["Agent", "Audited", "Errors"])
for r in rows: ws.append(r)
t = Table(displayName="QA", ref=f"A1:C{ws.max_row}")
t.tableStyleInfo = TableStyleInfo(name="TableStyleLight9", showRowStripes=True)
ws.add_table(t)
```

</details>

2. **Extend a table** — Load a workbook that has table `QA`, append one row, and update the table's `ref` so it includes the new row.
<details><summary>Solution</summary>

```python
t = ws.tables["QA"]
ws.append(["Hira", 143, 2])
start, _ = t.ref.split(":")
t.ref = f"{start}:C{ws.max_row}"
```

</details>

### Interview Questions

**Q: Why would you deliver data as an Excel Table rather than a plain formatted range?**
Tables give the client a growing, self-describing object: filters, banding and column-name formulas come free, PivotTables and Power Query can reference it by name, and anything appended below is absorbed automatically. That means a summary formula like `SUM(Production[Premium])` never needs editing, while `SUM(C2:C412)` breaks the first time a row is added. The cost is strict rules (unique string headers, no merges, no overlapping filters) that a generator must respect, so my table-writing helper validates headers before creating the `Table` object and raises a clear error instead of shipping a file Excel will "repair".

**Q: How do structured references get stored in the file, and does openpyxl understand them?**
They are stored as formula text exactly as typed, for example `SUM(Production[Premium])`, alongside the table definition in `xl/tables/tableN.xml` that maps column names to positions. openpyxl treats the formula as an opaque string and preserves the table part, so the references work when Excel opens the file. openpyxl does not resolve them itself, which means `data_only=True` returns the cached value or `None` like any other formula, and if you rename a column through openpyxl you must update every formula text that mentions the old name because Excel will not do it for you.

**Q: What breaks when you append rows to a sheet that contains a table without updating the table?**
The new rows sit outside the table: they are not banded, not filtered, not included in `Production[Premium]`, and a PivotTable built on the table ignores them. Excel does not auto-expand a table on file open; auto-expansion only happens when a user types directly under it. The fix is one line, resetting `tab.ref` to the new bottom row after appending, and I include it in the same helper that appends so the two never drift apart.

## Charts: BarChart, LineChart, PieChart and Reference

openpyxl can build native Excel charts, the same objects a user creates from Insert → Charts. They render in Excel, LibreOffice and most viewers, and because they reference cells, they update when the data changes. The pattern is always the same: create a chart, add a `Reference` to the data, optionally set categories, then anchor the chart to a cell.

### The Reference object

A `Reference` describes a rectangular block of cells by 1-based bounds:

```python
from openpyxl.chart import Reference

data = Reference(ws, min_col=2, min_row=1, max_col=3, max_row=6)   # B1:C6, headers in row 1
cats = Reference(ws, min_col=1, min_row=2, max_row=6)              # A2:A6
```

Including the header row in `data` and passing `titles_from_data=True` makes the series names come from the headers.

### Bar and column charts

```python
from openpyxl.chart import BarChart

chart = BarChart()
chart.type = "col"                 # "col" vertical, "bar" horizontal
chart.grouping = "clustered"       # or "stacked", "percentStacked"
chart.title = "Files closed by week"
chart.x_axis.title = "Week"
chart.y_axis.title = "Files"
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
chart.width, chart.height = 18, 9  # centimetres
ws.add_chart(chart, "E2")          # top-left corner at E2
```

For stacked charts set `chart.overlap = 100` as well, otherwise the bars sit side by side.

### Line charts

```python
from openpyxl.chart import LineChart

line = LineChart()
line.title = "Accuracy trend"
line.add_data(Reference(ws, min_col=4, min_row=1, max_row=ws.max_row), titles_from_data=True)
line.set_categories(cats)
line.y_axis.number_format = "0%"
line.y_axis.scaling.min = 0.8
line.y_axis.scaling.max = 1.0
s = line.series[0]
s.marker.symbol = "circle"
s.smooth = False
ws.add_chart(line, "E20")
```

### Pie charts

```python
from openpyxl.chart import PieChart
from openpyxl.chart.label import DataLabelList

pie = PieChart()
pie.title = "Premium by state"
pie.add_data(Reference(ws, min_col=2, min_row=1, max_row=5), titles_from_data=True)
pie.set_categories(Reference(ws, min_col=1, min_row=2, max_row=5))
pie.dataLabels = DataLabelList()
pie.dataLabels.showPercent = True
ws.add_chart(pie, "H2")
```

### Combining charts and secondary axes

A bar chart of volume with a line of accuracy on a second axis:

```python
line.y_axis.axId = 200
line.y_axis.crosses = "max"      # put the second axis on the right
chart += line                    # combine
```

### Styling series

```python
s = chart.series[0]
s.graphicalProperties.solidFill = "217346"
s.graphicalProperties.line.solidFill = "217346"
chart.legend.position = "b"      # bottom; or None to remove
chart.style = 10                 # one of Excel's built-in chart styles 1–48
```

### Newer Excel behaviour to know

Since openpyxl 3.1, axes are hidden by default in some Excel versions unless `chart.x_axis.delete = False` and `chart.y_axis.delete = False` are set explicitly. If your chart renders without axis labels in Microsoft 365, add those two lines.

| Chart | Class | Use |
|---|---|---|
| Column/bar | `BarChart` | Volumes by week or state |
| Line | `LineChart` | Trends, accuracy over time |
| Pie / Doughnut | `PieChart`, `DoughnutChart` | Share of premium |
| Scatter | `ScatterChart` | Premium vs policy amount |
| Area | `AreaChart` | Cumulative files |

> **Tip:** Charts are stored in the file as separate parts and are only rendered by the viewer. openpyxl cannot export a PNG of a chart; for an image use matplotlib and insert it (next chapter).

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook
from openpyxl.chart import BarChart, LineChart, Reference

wb = Workbook(); ws = wb.active; ws.title = "Weekly"
ws.append(["Week", "Opened", "Closed", "Accuracy"])
for i, (o, c, a) in enumerate([(120, 98, 0.96), (135, 128, 0.97), (110, 131, 0.95), (150, 142, 0.98), (160, 155, 0.975)], start=33):
    ws.append([f"W{i}", o, c, a])

bar = BarChart(); bar.type = "col"; bar.grouping = "clustered"
bar.title = "Files opened vs closed"; bar.y_axis.title = "Files"; bar.x_axis.title = "Week"
bar.add_data(Reference(ws, min_col=2, min_row=1, max_col=3, max_row=6), titles_from_data=True)
bar.set_categories(Reference(ws, min_col=1, min_row=2, max_row=6))
bar.x_axis.delete = False; bar.y_axis.delete = False

line = LineChart()
line.add_data(Reference(ws, min_col=4, min_row=1, max_row=6), titles_from_data=True)
line.y_axis.axId = 200; line.y_axis.crosses = "max"; line.y_axis.number_format = "0%"
line.y_axis.scaling.min, line.y_axis.scaling.max = 0.9, 1.0
bar += line
bar.width, bar.height = 20, 10
ws.add_chart(bar, "F2")

buf = BytesIO(); wb.save(buf)
print("Charts on sheet:", len(ws._charts))
print("Series names:", [s.tx.strRef.f for s in bar.series])
print("Anchor cell:", bar.anchor, "| size cm:", bar.width, "x", bar.height)
print("Workbook bytes:", len(buf.getvalue()))
```

### Quiz

1. What does `titles_from_data=True` do?
- [x] Uses the first row of the reference as series names
- [ ] Adds a chart title
- [ ] Sorts the series alphabetically
> The first cell of each column in the data reference becomes that series' name.

2. Which setting turns a clustered column chart into a horizontal bar chart?
- [ ] `chart.grouping = "bar"`
- [x] `chart.type = "bar"`
- [ ] `chart.orientation = "horizontal"`
> `type` is `"col"` for vertical and `"bar"` for horizontal; `grouping` controls stacking.

3. What is `chart.width` measured in?
- [ ] Pixels
- [ ] Characters
- [x] Centimetres
> openpyxl sizes charts in centimetres, defaulting to 15 x 7.5.

### Exercises

1. **Stacked by state** — Build a stacked column chart of Open and Closed counts per state from a sheet with headers `State, Open, Closed` and three data rows.
<details><summary>Solution</summary>

```python
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
wb = Workbook(); ws = wb.active
ws.append(["State", "Open", "Closed"])
for r in [("TX", 12, 88), ("WY", 5, 40), ("NM", 8, 31)]: ws.append(r)
c = BarChart(); c.type = "col"; c.grouping = "stacked"; c.overlap = 100
c.add_data(Reference(ws, min_col=2, min_row=1, max_col=3, max_row=4), titles_from_data=True)
c.set_categories(Reference(ws, min_col=1, min_row=2, max_row=4))
ws.add_chart(c, "E2")
```

</details>

2. **Pie with percentages** — Make a pie chart of premium by state with percentage labels and the legend at the bottom.
<details><summary>Solution</summary>

```python
from openpyxl.chart import PieChart, Reference
from openpyxl.chart.label import DataLabelList
p = PieChart(); p.title = "Premium by state"
p.add_data(Reference(ws, min_col=2, min_row=1, max_row=4), titles_from_data=True)
p.set_categories(Reference(ws, min_col=1, min_row=2, max_row=4))
p.dataLabels = DataLabelList(); p.dataLabels.showPercent = True
p.legend.position = "b"
ws.add_chart(p, "E20")
```

</details>

### Interview Questions

**Q: Why do openpyxl charts sometimes appear without axes in Microsoft 365, and how do you fix it?**
Recent Excel builds interpret a missing `delete` element on an axis as "deleted", and openpyxl 3.1 changed its defaults in a way that leaves the element out. The result is a chart with bars but no axis labels. Setting `chart.x_axis.delete = False` and `chart.y_axis.delete = False` writes the element explicitly and the axes render everywhere. I keep those two lines in my chart helper and mention the openpyxl version in comments because it is a pure serialisation quirk, not a data problem.

**Q: How would you add a chart whose data range grows every week?**
Point the chart's `Reference` at a table column or at a defined name rather than a fixed range, or, more simply, regenerate the chart each run from `ws.max_row` so the reference always covers the current data. Because my weekly report is produced from scratch by the pipeline, I take the regeneration approach: the `Reference` bounds are computed from the number of rows written, and there is no stale-range risk. If the client edits the workbook by hand between runs, a table-backed chart is the safer choice since Excel expands table references automatically.

**Q: What are the limits of openpyxl's charting compared to native Excel?**
openpyxl supports the common types (bar, line, pie, doughnut, scatter, area, bubble, radar, stock, surface) and most formatting through `graphicalProperties`, but it does not support newer chart types such as waterfall, treemap, sunburst or histogram, cannot render charts to images, and does not create sparklines or slicers. It also drops charts it did not create in some round-trip cases. When a client needs a waterfall, I build it as a stacked bar with an invisible base series, which is the classic pre-2016 technique, or produce the visual in matplotlib and insert it as an image.

## Images and hyperlinks

Two finishing touches turn a generated workbook into a client-ready deliverable: a logo in the header and clickable links to the source documents. Both are straightforward in openpyxl, with one dependency to remember.

### Inserting an image

Images require **Pillow** (`pip install pillow`). openpyxl uses it to read the image dimensions and format.

```python
from openpyxl.drawing.image import Image

img = Image("logo.png")            # PNG, JPEG, BMP, GIF
img.width, img.height = 160, 48    # pixels; keep the aspect ratio yourself
ws.add_image(img, "A1")            # anchor at the top-left of A1
```

The image floats over the grid, so leave enough row height or empty rows under the anchor. Merging `A1:C3` and setting `row_dimensions[1].height` is a common way to reserve a logo block. The image file is embedded in the `.xlsx`, so the recipient does not need the original.

### Images from memory

If the logo comes from a database or a matplotlib figure, pass a `BytesIO`:

```python
from io import BytesIO
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(6, 3))
ax.bar(weeks, closed)
buf = BytesIO(); fig.savefig(buf, format="png", dpi=150); buf.seek(0)
ws.add_image(Image(buf), "H2")
```

This is the standard workaround for chart types openpyxl cannot create, and for "the chart must look exactly like the one in the PDF".

### Hyperlinks

A hyperlink is a cell property. Set the target and apply the built-in `Hyperlink` style so it turns blue and underlined:

```python
ws["A2"] = "TX-10432"
ws["A2"].hyperlink = "https://docs.example.com/files/TX-10432.pdf"
ws["A2"].style = "Hyperlink"
```

You can also use the `HYPERLINK` formula, which keeps the link and display text together in one formula: `=HYPERLINK("https://...","Open file")`. Formula links work in every spreadsheet application; cell hyperlinks are native Excel links with a tooltip.

### Internal links to other sheets

Links inside the workbook use the `location` attribute of a `Hyperlink` object rather than an external target:

```python
from openpyxl.worksheet.hyperlink import Hyperlink

ws["A5"] = "Go to summary"
ws["A5"].hyperlink = Hyperlink(ref="A5", location="Summary!A1", tooltip="Jump to the summary")
ws["A5"].style = "Hyperlink"
```

Sheet names with spaces need quotes: `location="'Rate Matrix'!A1"`. The shortcut `ws["A5"].hyperlink = "#Summary!A1"` also works because Excel resolves a `#` target as an internal location, but openpyxl stores it as an external relationship, so `location` is the form that round-trips cleanly. A table of contents on the first sheet with one link per state tab is a small touch that clients notice.

### Links to files and email

```python
ws["B2"].hyperlink = r"file:///C:/Reports/Week37/TX-10432.pdf"
ws["C2"].hyperlink = "mailto:ali@example.com?subject=TX-10432"
```

Absolute file links break when the workbook moves; relative links (`"Week37/TX-10432.pdf"`) resolve from the workbook's own folder and are more robust for a deliverable folder.

### Reading links back

```python
for row in ws.iter_rows(min_col=1, max_col=1):
    c = row[0]
    if c.hyperlink:
        print(c.value, "->", c.hyperlink.target or c.hyperlink.location)
```

`target` holds external URLs and `location` holds in-workbook references.

### Cell comments

Comments (notes) are the third annotation tool:

```python
from openpyxl.comments import Comment
ws["D2"].comment = Comment("Premium confirmed against rate matrix v3", "Ali Raza")
ws["D2"].comment.width, ws["D2"].comment.height = 300, 80
```

| Feature | Requires | Stored as |
|---|---|---|
| Image | Pillow | Embedded media part |
| Hyperlink | Nothing | Relationship + cell attribute |
| Internal link | Nothing | `location` attribute |
| Comment | Nothing | VML drawing part |

> **Warning:** Images are not copied by `copy_worksheet()` and are lost when a workbook is opened with `read_only=True`. Re-add the logo in the final pass of your pipeline rather than relying on it surviving from a template.

### Try It Yourself

```python
from io import BytesIO
from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.worksheet.hyperlink import Hyperlink

wb = Workbook(); toc = wb.active; toc.title = "Contents"
toc["A1"] = "Weekly production report – Week 37"
toc["A3"] = "Sheet"; toc["B3"] = "Source"

for state in ["TX", "WY", "NM"]:
    ws = wb.create_sheet(state)
    ws["A1"] = f"{state} files"
    ws["A2"] = f"{state}-10432"
    ws["A2"].hyperlink = f"https://docs.example.com/files/{state}-10432.pdf"
    ws["A2"].style = "Hyperlink"
    ws["B2"] = "Back to contents"
    ws["B2"].hyperlink = Hyperlink(ref="B2", location="Contents!A1"); ws["B2"].style = "Hyperlink"
    r = toc.max_row + 1
    c = toc.cell(row=r, column=1, value=state)
    c.hyperlink = Hyperlink(ref=c.coordinate, location=f"{state}!A1", tooltip=f"Open the {state} sheet")
    c.style = "Hyperlink"
    toc.cell(row=r, column=2, value=f'=HYPERLINK("https://docs.example.com/{state}","{state} folder")')

toc["A1"].comment = Comment("Generated by the reporting pipeline", "Ali Raza")
buf = BytesIO(); wb.save(buf)

for row in toc.iter_rows(min_row=4, max_col=1):
    c = row[0]
    print(c.value, "->", c.hyperlink.location, "| style:", c.style)
print("TX!A2 target:", wb["TX"]["A2"].hyperlink.target)
print("Comment:", toc["A1"].comment.text, "by", toc["A1"].comment.author)
print("Note: images need Pillow – Image('logo.png') then ws.add_image(img, 'A1')")
```

### Quiz

1. What extra package does `openpyxl.drawing.image.Image` need?
- [ ] NumPy
- [x] Pillow
- [ ] matplotlib
> openpyxl uses Pillow to read image size and format before embedding.

2. How do you link to cell A1 on a sheet named `Summary` inside the same workbook?
- [x] `cell.hyperlink = "#Summary!A1"`
- [ ] `cell.hyperlink = "Summary!A1"`
- [ ] `cell.hyperlink = "sheet://Summary/A1"`
> The `#` prefix marks an in-workbook location.

3. Why apply `cell.style = "Hyperlink"` after setting `cell.hyperlink`?
- [ ] The link does not work without it
- [x] The link works but looks like plain text until the built-in style is applied
- [ ] It validates the URL
> The hyperlink is functional either way; the style provides the blue underline users expect.

### Exercises

1. **Table of contents** — For every sheet in a workbook except the first, write its name in column A of the first sheet as an internal link.
<details><summary>Solution</summary>

```python
from openpyxl.worksheet.hyperlink import Hyperlink
first = wb.worksheets[0]
for i, ws in enumerate(wb.worksheets[1:], start=1):
    c = first.cell(row=i, column=1, value=ws.title)
    c.hyperlink = Hyperlink(ref=c.coordinate, location=f"'{ws.title}'!A1")
    c.style = "Hyperlink"
```

</details>

2. **Link audit** — Print every external hyperlink in a worksheet together with its cell.
<details><summary>Solution</summary>

```python
for row in ws.iter_rows():
    for c in row:
        if c.hyperlink and c.hyperlink.target:
            print(c.coordinate, c.hyperlink.target)
```

</details>

### Interview Questions

**Q: A client wants a chart type openpyxl does not support. What are your options?**
Three, in order of preference. First, approximate it with a supported type: a waterfall becomes a stacked column with an invisible base series, a bullet chart becomes overlapping bars. Second, render it with matplotlib or plotly to PNG and insert it with `ws.add_image`, accepting that it is static and will not update with the data. Third, build the workbook with xlsxwriter, which supports some additional chart options, and do any post-editing in a separate openpyxl pass. I explain the trade-off to the client: native charts update, images do not, so for a monthly deliverable regenerated by the pipeline the image route is usually fine.

**Q: Where are images stored in the .xlsx, and why does that matter for file size?**
Each image becomes a part under `xl/media/` (for example `image1.png`) referenced from a drawing part in `xl/drawings/` that positions it on the sheet. The bytes are embedded once per insertion, not once per file, so a 400 KB logo added to 12 state sheets adds nearly 5 MB. I resize the logo to the display size with Pillow before inserting, which usually brings it under 20 KB, and I add it only to the cover sheet and the print header when the client wants it on every page.

**Q: What is the difference between a cell hyperlink and a HYPERLINK formula?**
A cell hyperlink is stored as a relationship plus an attribute on the cell; it supports a tooltip, an internal `location`, and survives as a real link in Excel, LibreOffice and Google Sheets. The `HYPERLINK()` formula stores link and label in the formula text, so it can be built from other cells (`=HYPERLINK("https://docs/" & A2 & ".pdf", A2)`), which is ideal when the file number is in a column and the URL follows a pattern. The formula approach is what I use in generated trackers because one formula written down a column is simpler than setting hundreds of `hyperlink` attributes, and the client can see how the link is built.

# LEVEL: Expert

## Performance: read_only and write_only modes for large files

Normal openpyxl mode turns every cell into a Python object. A 200,000-row by 10-column sheet is two million `Cell` objects, each with a value, a style index and a coordinate, which costs well over a gigabyte of RAM and a noticeable pause. For files of that size openpyxl offers two streaming modes that keep memory flat.

### read_only=True: streaming reads

```python
from openpyxl import load_workbook

wb = load_workbook("export_200k.xlsx", read_only=True)
ws = wb["Data"]
for row in ws.iter_rows(min_row=2, values_only=True):
    process(row)
wb.close()          # releases the underlying zip file handle
```

In read-only mode the worksheet is a `ReadOnlyWorksheet`. It parses the XML row by row with `iterparse`, so memory stays constant regardless of file size. Restrictions: you cannot write, styles are limited to what is needed to detect dates, images and charts are not loaded, and `ws.max_row` comes from the `<dimension>` element in the file, which some producers write incorrectly or not at all. If you see `ValueError: Worksheet is unsized`, call `ws.reset_dimensions()` to force scanning, or `ws.calculate_dimension(force=True)`.

Read-only mode is about **memory**, not raw speed. Measured on a 200,000-row, two-column file: streaming with `iter_rows(values_only=True)` took about 10 seconds, a full `load_workbook` took about 6 seconds plus half a second to iterate, but the full load held all 400,000 cell objects in memory. On a 40 MB, 30-column export the full load simply runs out of RAM on a 4 GB container, while the streaming version finishes.

### write_only=True: streaming writes

```python
from openpyxl import Workbook
from openpyxl.cell import WriteOnlyCell
from openpyxl.styles import Font

wb = Workbook(write_only=True)
ws = wb.create_sheet("Data")         # write-only workbooks start with no sheets
ws.column_dimensions["A"].width = 16 # dimensions and freeze panes BEFORE any rows
ws.freeze_panes = "A2"

hdr = WriteOnlyCell(ws, value="File #"); hdr.font = Font(bold=True)
ws.append([hdr, "Premium"])
for file_no, premium in source():    # a generator, so nothing is held in memory
    ws.append([file_no, premium])
ws.auto_filter.ref = "A1:B200001"
wb.save("big.xlsx")
```

Rows are written straight to a temporary XML file as you append them. 200,000 rows take roughly 5 seconds and a few megabytes of RAM. The rules:

| Works in write-only | Does not work |
|---|---|
| `append()`, `WriteOnlyCell` with styles | `ws["A1"]` or `ws.cell()` access |
| `column_dimensions`, `freeze_panes` (set before rows) | `merge_cells()` |
| `auto_filter`, conditional formatting | `add_data_validation()` |
| `add_table`, `add_chart`, `add_image` | Reading anything back |

Because you cannot revisit a row, compute totals in Python while you stream and append the totals row last.

### Reduce what you write

- Write numbers as `int`/`float`, never as formatted strings; the shared-strings table is the largest part of most files.
- Apply styles to columns and rows rather than to every cell where possible, and reuse one `Font`/`Fill` object.
- Avoid formulas on 100,000 rows; compute in Python and write values, then add one formula row for the totals.
- Keep `values_only=True` on every read loop.

### Profile before optimising

```python
import time, tracemalloc
tracemalloc.start(); t = time.perf_counter()
wb = load_workbook(path, read_only=True)
rows = sum(1 for _ in wb.active.iter_rows(values_only=True))
print(rows, "rows in", round(time.perf_counter() - t, 2), "s; peak MB:", tracemalloc.get_traced_memory()[1] / 1e6)
```

Run this once on the real file. The numbers tell you whether the bottleneck is parsing (switch modes), your own per-row work (vectorise with pandas), or output size (shared strings, styles).

> **Warning:** A write-only workbook that is never saved leaves a temporary file behind in the system temp directory until the process exits. Always call `wb.save()` or wrap generation in a `try/finally` that closes it.

### Try It Yourself

```python
from io import BytesIO
import time
from openpyxl import Workbook, load_workbook
from openpyxl.cell import WriteOnlyCell
from openpyxl.styles import Font

N = 20000
t = time.perf_counter()
wb = Workbook(write_only=True)
ws = wb.create_sheet("Data")
ws.column_dimensions["A"].width = 14
ws.freeze_panes = "A2"
hdr = WriteOnlyCell(ws, value="File #"); hdr.font = Font(bold=True)
ws.append([hdr, "State", "Premium"])
total = 0.0
for i in range(N):
    premium = 900 + (i % 50) * 7.5
    total += premium
    ws.append([f"TX-{10000 + i}", "TX" if i % 2 else "WY", premium])
ws.append(["Total", None, round(total, 2)])
buf = BytesIO(); wb.save(buf)
print(f"write-only: {N} rows in {time.perf_counter() - t:.2f}s, {len(buf.getvalue()) // 1024} KB")

t = time.perf_counter()
rb = load_workbook(BytesIO(buf.getvalue()), read_only=True)
rs = rb["Data"]; rs.reset_dimensions()
count = sum(1 for _ in rs.iter_rows(min_row=2, values_only=True))
rb.close()
print(f"read-only: {count} rows streamed in {time.perf_counter() - t:.2f}s (includes the totals row)")
```

### Quiz

1. What is the main benefit of `read_only=True`?
- [ ] It always makes reads 10x faster
- [x] Memory stays constant because rows are streamed, not materialised
- [ ] It loads styles more accurately
> Streaming avoids creating millions of `Cell` objects; CPU time can be similar or higher.

2. Which operation is impossible in a write-only worksheet?
- [ ] `ws.append([...])`
- [x] `ws["A1"] = 5`
- [ ] `ws.add_chart(chart, "E2")`
> Rows are written as they are appended; cells cannot be addressed or revisited.

3. When must `freeze_panes` and column widths be set in write-only mode?
- [x] Before the first `append()`
- [ ] After the last `append()`
- [ ] It does not matter
> The sheet header XML is emitted when the first row is written.

### Exercises

1. **Streaming filter** — Read a workbook in read-only mode and write only rows where column 2 equals "TX" to a new write-only workbook.
<details><summary>Solution</summary>

```python
from openpyxl import load_workbook, Workbook
src = load_workbook("export.xlsx", read_only=True)["Data"]
out = Workbook(write_only=True); dst = out.create_sheet("TX")
rows = src.iter_rows(values_only=True)
dst.append(next(rows))
for r in rows:
    if r[1] == "TX":
        dst.append(list(r))
out.save("tx_only.xlsx")
```

</details>

2. **Peak memory** — Use `tracemalloc` to print the peak memory of loading a workbook normally versus read-only.
<details><summary>Solution</summary>

```python
import tracemalloc
from openpyxl import load_workbook
for ro in (False, True):
    tracemalloc.start()
    wb = load_workbook("export.xlsx", read_only=ro)
    n = sum(1 for _ in wb.active.iter_rows(values_only=True))
    print("read_only" if ro else "normal", n, tracemalloc.get_traced_memory()[1] // 1_000_000, "MB")
    tracemalloc.stop()
```

</details>

### Interview Questions

**Q: A nightly job that builds a 300,000-row workbook now crashes with MemoryError. What do you change and what do you give up?**
Switch to `Workbook(write_only=True)` and feed it from a generator or a chunked database cursor so no full list exists in memory; that alone drops RAM from gigabytes to tens of megabytes. Set column widths and freeze panes before the first append, style header cells through `WriteOnlyCell`, and compute totals as rows stream past. What I give up is random access: no merged cells, no data validation, no revisiting a row to fix it, so validation moves to the Python side before the write. If the client needs those features, I write the big data sheet in write-only mode and build the small formatted summary sheet in a separate normal workbook, then tell them to link the two.

**Q: Why does read-only mode sometimes report `max_row` as `None` or a wrong number?**
Read-only mode trusts the `<dimension ref="A1:F200001"/>` element at the top of the sheet XML because reading it is instant. Files written by openpyxl's write-only mode, some database exporters and streaming tools omit or mis-state it, so `max_row` is `None` or too small. `ws.reset_dimensions()` clears the cached value and makes `iter_rows()` scan until the real end; `calculate_dimension(force=True)` does a full pass to compute it. I call `reset_dimensions()` unconditionally in ingestion code because the cost is negligible and the failure mode of trusting a wrong dimension is silently dropped rows.

**Q: Compare openpyxl, xlsxwriter and pandas for writing a large report and explain how you decide.**
xlsxwriter is the fastest and produces the smallest files because it streams by design and has an optimised shared-string implementation, but it is write-only and cannot edit an existing workbook. openpyxl in write-only mode is close in speed and is the only choice when the same code must also read or edit files. pandas' `to_excel` is the shortest code but styles are limited and, with the openpyxl engine, it builds the full in-memory workbook. My rule: pandas for a quick dump, xlsxwriter for a large one-shot deliverable with charts, and openpyxl when a template or an existing file is involved, which in title-insurance reporting is most of the time.

## Building a report generator: pandas to openpyxl styling

The weekly production report is the canonical openpyxl project: pull data, aggregate with pandas, write the tables with `to_excel`, then open the result with openpyxl and apply the formatting a manager expects. This chapter builds that pipeline as a reusable module.

### Step 1: shape the data in pandas

```python
import pandas as pd

df = pd.read_csv("production_week37.csv", parse_dates=["closed_on"])
df["week"] = df["closed_on"].dt.isocalendar().week
summary = (df.groupby(["state", "status"])
             .agg(files=("file_no", "count"), premium=("premium", "sum"))
             .reset_index())
by_state = summary.pivot_table(index="state", columns="status", values="files", fill_value=0).reset_index()
```

Everything numeric stays numeric. Do not format in pandas; the number formats come later.

### Step 2: write sheets with a single ExcelWriter

```python
with pd.ExcelWriter("weekly_status.xlsx", engine="openpyxl") as xw:
    by_state.to_excel(xw, sheet_name="Summary", index=False, startrow=3)
    df.to_excel(xw, sheet_name="Detail", index=False)
    ws = xw.sheets["Summary"]          # the live openpyxl worksheet
    ws["A1"] = "Weekly Production Report – Week 37"
```

`xw.sheets` exposes the openpyxl worksheets while the writer is open, so you can style them without closing and reopening. `startrow=3` leaves room for the title block. Prefer `index=False` unless the index carries meaning.

### Step 3: a styling helper you can reuse

```python
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

HEADER_FILL = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
HEADER_FONT = Font(bold=True, color="FFFFFF")
THIN = Side(style="thin", color="BFBFBF")

def style_table(ws, header_row, first_col, last_col, last_row, formats=None):
    for c in range(first_col, last_col + 1):
        cell = ws.cell(row=header_row, column=c)
        cell.font, cell.fill = HEADER_FONT, HEADER_FILL
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    for r in range(header_row + 1, last_row + 1):
        for c in range(first_col, last_col + 1):
            ws.cell(row=r, column=c).border = Border(top=THIN, bottom=THIN, left=THIN, right=THIN)
    for col_name, fmt in (formats or {}).items():
        idx = [ws.cell(row=header_row, column=c).value for c in range(first_col, last_col + 1)].index(col_name) + first_col
        for r in range(header_row + 1, last_row + 1):
            ws.cell(row=r, column=idx).number_format = fmt
    for c in range(first_col, last_col + 1):
        width = max(len(str(ws.cell(row=r, column=c).value or "")) for r in range(header_row, last_row + 1))
        ws.column_dimensions[get_column_letter(c)].width = min(max(width + 2, 10), 45)
    ws.freeze_panes = ws.cell(row=header_row + 1, column=first_col)
    ws.auto_filter.ref = f"{get_column_letter(first_col)}{header_row}:{get_column_letter(last_col)}{last_row}"
```

Call it as `style_table(ws, 4, 1, by_state.shape[1], 4 + len(by_state), {"Premium": '"$"#,##0.00'})`. The helper takes positions, not DataFrames, so it works on any table regardless of how it was written.

### Step 4: totals, charts and the title block

Add a totals row with `SUM` formulas so the client can edit numbers and see totals update, add a `BarChart` referencing the summary block, merge the title across the table width and set print settings. Keep each of those as its own small function; a report is then a script of six calls that reads like the specification.

### Step 5: make it repeatable

- Parameterise the week number and input path; never hard-code dates.
- Write to a temporary file and rename on success so a failed run never overwrites last week's report.
- Log row counts and totals to the console; they are your regression test.
- Keep a `tests/` folder that runs the generator on a 20-row fixture and asserts on cell values, number formats and the presence of the chart.

> **Interview note:** "How would you automate a weekly Excel report?" is answered best by naming the stages (extract, aggregate, write, style, verify, deliver), the library for each, and one concrete failure you guard against, such as a source column being renamed.

### Try It Yourself

```python
# The pandas step is replaced by a list so this runs with openpyxl alone.
from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from openpyxl.utils import get_column_letter

by_state = [("TX", 88, 12, 101250.0), ("WY", 40, 5, 42875.5), ("NM", 31, 8, 30110.25)]
wb = Workbook(); ws = wb.active; ws.title = "Summary"
ws.merge_cells("A1:D1"); ws["A1"] = "Weekly Production Report – Week 37"
ws["A1"].font = Font(size=14, bold=True)
ws.append([]); ws.append([])
ws.append(["State", "Closed", "Open", "Premium"])
for r in by_state:
    ws.append(r)
last = ws.max_row
ws.append(["Total", f"=SUM(B5:B{last})", f"=SUM(C5:C{last})", f"=SUM(D5:D{last})"])

hdr_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
thin = Side(style="thin", color="BFBFBF")
for c in ws[4]:
    c.font, c.fill, c.alignment = Font(bold=True, color="FFFFFF"), hdr_fill, Alignment(horizontal="center")
for row in ws.iter_rows(min_row=5, max_row=last + 1, max_col=4):
    for c in row:
        c.border = Border(top=thin, bottom=thin, left=thin, right=thin)
    row[3].number_format = '"$"#,##0.00'
for c in ws[last + 1]:
    c.font = Font(bold=True)
for i in range(1, 5):
    ws.column_dimensions[get_column_letter(i)].width = 14
ws.freeze_panes = "A5"

chart = BarChart(); chart.type = "col"; chart.title = "Files by state"
chart.add_data(Reference(ws, min_col=2, min_row=4, max_col=3, max_row=last), titles_from_data=True)
chart.set_categories(Reference(ws, min_col=1, min_row=5, max_row=last))
chart.x_axis.delete = False; chart.y_axis.delete = False
ws.add_chart(chart, "F4")

buf = BytesIO(); wb.save(buf)
print("Rows:", ws.max_row, "| totals row:", [c.value for c in ws[last + 1]])
print("Premium format:", ws["D5"].number_format, "| freeze:", ws.freeze_panes, "| charts:", len(ws._charts))
print("Bytes:", len(buf.getvalue()))
```

### Quiz

1. How do you reach the openpyxl worksheet while a `pd.ExcelWriter` is open?
- [x] `writer.sheets["Summary"]`
- [ ] `writer.book.active` only after closing
- [ ] It is not possible
> With `engine="openpyxl"`, `writer.sheets` maps sheet names to live `Worksheet` objects.

2. Why write totals as `=SUM()` formulas instead of Python values?
- [ ] Formulas are faster to write
- [x] The client can edit numbers and the totals stay correct
- [ ] openpyxl cannot write floats
> A formula keeps the workbook self-consistent after manual edits; a value does not.

3. What is the purpose of writing to a temporary file and renaming on success?
- [x] A failed run never leaves a half-written report in place of last week's
- [ ] It makes the file smaller
- [ ] Excel requires it
> Atomic rename is the standard safeguard for scheduled report generation.

### Exercises

1. **DataFrame to styled sheet** — Using `pd.ExcelWriter(engine="openpyxl")`, write a DataFrame to `Detail` and bold the header row through `writer.sheets`.
<details><summary>Solution</summary>

```python
import pandas as pd
from openpyxl.styles import Font
df = pd.DataFrame({"file_no": ["TX-1", "WY-1"], "premium": [1250.0, 980.5]})
with pd.ExcelWriter("detail.xlsx", engine="openpyxl") as xw:
    df.to_excel(xw, sheet_name="Detail", index=False)
    for cell in xw.sheets["Detail"][1]:
        cell.font = Font(bold=True)
```

</details>

2. **Fixture test** — Write a pytest function that generates the report from a 3-row list and asserts the totals formula in the last row of column B.
<details><summary>Solution</summary>

```python
def test_totals_formula(tmp_path):
    path = tmp_path / "r.xlsx"
    build_report([("TX", 1, 0, 10.0), ("WY", 2, 1, 20.0), ("NM", 3, 1, 30.0)], path)
    ws = load_workbook(path)["Summary"]
    assert ws.cell(row=ws.max_row, column=2).value == "=SUM(B5:B7)"
```

</details>

### Interview Questions

**Q: Walk me through how you would automate a weekly production status report end to end.**
Extract: a SQL query or CSV export filtered to the week, loaded with `pandas.read_csv` with explicit dtypes and `parse_dates`. Validate: assert expected columns, no nulls in keys, and row count within a sane range, failing loudly otherwise. Aggregate: `groupby` and `pivot_table` for the summary by state and status. Write: `pd.ExcelWriter(engine="openpyxl")` for the detail and summary sheets. Style: a small openpyxl module that applies header styles, number formats, widths, freeze panes, filters, a totals formula row and a bar chart. Verify: reopen the file, compare totals against pandas, and log them. Deliver: atomic rename into the shared folder and an email with the totals in the body. At Stewart Title the manual version took an afternoon; the scripted one runs in under a minute and has caught two source-export changes because the validation step failed before anything was sent.

**Q: Where should formatting logic live: pandas Styler, xlsxwriter, or openpyxl?**
`DataFrame.style` is designed for HTML and only partially exports to Excel (fonts, fills, borders via `to_excel`, no column widths or freeze panes), so it is convenient for quick colour rules but not a full report. xlsxwriter has an excellent formatting API but cannot open the file again, so a two-pass pipeline is impossible. openpyxl is the right home for formatting when the workbook must be reopened, extended or built on a template, and its objects map one-to-one onto Excel's dialogs, which makes the code easy to explain to a non-programmer. I keep the styling in one module with named constants for brand colours so the same look is applied to every report.

**Q: How do you keep the generator from breaking when the source data changes shape?**
A schema check at the top: a list of required columns with expected dtypes, checked before any transformation, with an error that names the missing or extra columns. Column selection by name, never by position. A small fixture dataset in the repository that the tests run against, so a change in aggregation logic shows up as a failed assertion on a known total. And a smoke check after writing: reload the file, confirm the sheet names, header text and totals, and only then deliver. These are cheap, and each one corresponds to a real incident where a renamed `Premium` column or an extra blank row would otherwise have gone out to a manager.

## Templates and preserving formatting and macros with keep_vba

Clients rarely want "a spreadsheet". They want *their* spreadsheet, with the logo, the sign-off block and the macro that emails it, filled with this week's numbers. The pattern is: load the template, write into the known cells and ranges, save under a new name, and make sure nothing else changed.

### Loading a template safely

```python
from openpyxl import load_workbook

wb = load_workbook("templates/weekly_status_template.xlsm", keep_vba=True)
ws = wb["Summary"]
ws["B2"] = "Week 37"
ws["B3"] = datetime.date(2026, 9, 11)
wb.save("out/weekly_status_W37.xlsm")     # keep the .xlsm extension
```

`keep_vba=True` keeps the `vbaProject.bin` part. Without it the macros disappear silently and the file still opens. Saving an `.xlsm` workbook as `.xlsx` also strips the macros, so match the extension to the content. openpyxl cannot read or edit the VBA code itself; it treats the project as an opaque blob.

### Excel template files (.xltx / .xltm)

```python
wb = load_workbook("brand_template.xltx")
wb.template = False          # save as a normal workbook, not a template
wb.save("report.xlsx")
```

Set `wb.template = True` to save a real `.xltx` that opens as "Book1" when double-clicked. This is how a branded template suite is delivered: the client gets `.xltx` files, your generator consumes the same files with `template=False`.

### Filling ranges without disturbing formatting

Writing `cell.value` never changes a cell's style, so you can overwrite numbers inside a pre-formatted block freely. The risks are structural:

- Do not `ws.append()` on a template sheet; it writes after the last used row, which may be a footer. Use explicit rows.
- If the data block can grow, `ws.insert_rows(idx, amount)` shifts rows below down, but it does **not** shift merged cells, charts, data validations or conditional formats, so insert rows only within a range that has none of those.
- Copy the style of the template's first data row to each new row so the block stays consistent.

```python
from copy import copy
template_row = 6
for i, rec in enumerate(records):
    r = template_row + i
    for c, value in enumerate(rec, start=1):
        src = ws.cell(row=template_row, column=c)
        dst = ws.cell(row=r, column=c, value=value)
        if r != template_row:
            dst.font, dst.fill, dst.border = copy(src.font), copy(src.fill), copy(src.border)
            dst.number_format, dst.alignment = src.number_format, copy(src.alignment)
```

### Use defined names as the contract

Templates change. If your code writes to `B7` and the client inserts a row, you overwrite the wrong cell. Ask for (or add) defined names such as `ReportWeek`, `DataStart` and `SignOff`, and resolve them at runtime:

```python
def cell_for(wb, name):
    sheet, coord = next(wb.defined_names[name].destinations)
    return wb[sheet][coord]

cell_for(wb, "ReportWeek").value = "Week 37"
```

Now the template owner can move things and your generator follows.

### What survives a round trip

| Feature | Preserved? |
|---|---|
| Cell values, styles, number formats | Yes |
| Merged cells, column widths, freeze panes | Yes |
| Data validation, conditional formatting | Yes |
| Defined names, tables | Yes |
| Charts created by Excel | Usually, not always |
| Images, shapes, text boxes, form controls | Images sometimes; shapes and controls no |
| PivotTables | Cache preserved, may need refresh |
| VBA | Only with `keep_vba=True` and `.xlsm` |
| Slicers, sparklines, Power Query connections | No |

> **Tip:** Before building on any client template, run a no-op round trip (load, save as a copy, open both in Excel side by side). Whatever is missing from the copy is what you must not rely on, and the client should hear about it before the first delivery, not after.

### Try It Yourself

```python
from io import BytesIO
from copy import copy
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Border, Side
from openpyxl.workbook.defined_name import DefinedName

# Build a stand-in "client template" in memory
tpl = Workbook(); ws = tpl.active; ws.title = "Summary"
ws["A1"] = "Weekly Status"; ws["A1"].font = Font(size=14, bold=True)
ws["A2"] = "Week:"; ws["B2"] = "<week>"
ws["A5"], ws["B5"], ws["C5"] = "State", "Files", "Premium"
thin = Side(style="thin"); ws["C6"].number_format = '"$"#,##0.00'
for c in ws[6]:
    c.border = Border(top=thin, bottom=thin); c.fill = PatternFill(start_color="F2F2F2", end_color="F2F2F2", fill_type="solid")
ws["A9"] = "Prepared by: ____________"
tpl.defined_names["ReportWeek"] = DefinedName("ReportWeek", attr_text="Summary!$B$2")
tpl.defined_names["DataStart"] = DefinedName("DataStart", attr_text="Summary!$A$6")
buf = BytesIO(); tpl.save(buf)

# Fill the template the way the generator would
wb = load_workbook(BytesIO(buf.getvalue()))
ws = wb["Summary"]
def cell_for(wb, name):
    sheet, coord = next(wb.defined_names[name].destinations)
    return wb[sheet][coord]
cell_for(wb, "ReportWeek").value = "Week 37"
start = cell_for(wb, "DataStart")
for i, rec in enumerate([("TX", 88, 101250.0), ("WY", 40, 42875.5), ("NM", 31, 30110.25)]):
    r = start.row + i
    for c, v in enumerate(rec, start=start.column):
        src = ws.cell(row=start.row, column=c); dst = ws.cell(row=r, column=c, value=v)
        if r != start.row:
            dst.border, dst.fill, dst.number_format = copy(src.border), copy(src.fill), src.number_format

out = BytesIO(); wb.save(out)
print("Week cell:", ws["B2"].value, "| C8 format:", ws["C8"].number_format, "| C8 fill:", ws["C8"].fill.fill_type)
print("Footer untouched:", ws["A9"].value, "| template bytes:", len(buf.getvalue()), "-> filled bytes:", len(out.getvalue()))
```

### Quiz

1. What happens if you load an `.xlsm` without `keep_vba=True` and save it?
- [ ] openpyxl raises an error
- [x] The file saves fine but the macros are gone
- [ ] The macros are converted to Python
> The VBA part is simply not carried over; the workbook still opens in Excel.

2. Why prefer defined names over fixed coordinates when filling a template?
- [x] The template owner can move cells and the generator still writes to the right place
- [ ] Defined names are faster to write
- [ ] Excel requires names for templates
> Names are the contract between the template and the code.

3. What does `ws.insert_rows()` fail to shift?
- [ ] Cell values
- [ ] Row heights
- [x] Merged cells, charts, validations and conditional formats
> openpyxl moves cells only; other sheet objects keep their old coordinates.

### Exercises

1. **Template to workbook** — Load an `.xltx`, set the report date in the cell named `ReportDate`, and save as a normal `.xlsx`.
<details><summary>Solution</summary>

```python
import datetime as dt
from openpyxl import load_workbook
wb = load_workbook("brand_template.xltx")
sheet, coord = next(wb.defined_names["ReportDate"].destinations)
wb[sheet][coord].value = dt.date.today()
wb.template = False
wb.save("report.xlsx")
```

</details>

2. **Round-trip audit** — Write a function that loads a workbook, saves a copy, reloads both and prints any sheet whose number of charts, images or merged ranges differs.
<details><summary>Solution</summary>

```python
from io import BytesIO
from openpyxl import load_workbook
def audit(path):
    a = load_workbook(path); buf = BytesIO(); a.save(buf)
    b = load_workbook(BytesIO(buf.getvalue()))
    for name in a.sheetnames:
        x, y = a[name], b[name]
        stats = lambda ws: (len(ws._charts), len(ws._images), len(ws.merged_cells.ranges))
        if stats(x) != stats(y):
            print(name, stats(x), "->", stats(y))
```

</details>

### Interview Questions

**Q: A client sends a macro-enabled template with a "Send to manager" button. How do you fill it without breaking anything?**
Load with `keep_vba=True`, save with the `.xlsm` extension, and write only values into the cells the macro expects, resolved through defined names or a documented cell map. I do a no-op round trip first and open the result to confirm the button still fires, because form controls and shapes are among the things openpyxl can drop. If the button turns out to be a Forms control that does not survive, I move the entry point to a keyboard-assigned macro or a ribbon button that lives in the VBA project itself, which openpyxl preserves as an opaque blob. I also never let the generator touch the sheet that hosts controls; it writes to a data sheet that the macro reads.

**Q: What are the risks of `insert_rows` and `delete_rows` on a formatted template, and how do you avoid them?**
They shift cell values and styles but not merged ranges, charts, images, data validations, conditional-format ranges, defined names or table references, so everything below the insertion point drifts out of alignment with its formatting. Formulas elsewhere are also not adjusted, unlike in Excel. My approach is to reserve a data block in the template that is large enough for the maximum expected rows, fill it from the top, and hide unused rows, or to keep the growing table on its own sheet with nothing below it. When rows really must be inserted, I update the affected objects explicitly: `ws.merged_cells.ranges`, `dv.sqref`, `table.ref` and the chart `Reference` bounds.

**Q: How would you deliver a branded .xltx template suite and also automate reports from it?**
Author the template once with styles as `NamedStyle` objects, defined names for every input cell, and a hidden `Lists` sheet for validation sources. Save it with `wb.template = True` so it behaves as a real Excel template for staff who fill it by hand. The generator loads the same file, sets `template=False`, resolves the names, fills values and saves `.xlsx` outputs. Because both paths use one source of truth, a branding change (a new logo, a colour update) is made in one file and appears in manual and automated outputs alike, which is the main selling point of a template suite to a client.

## Limitations: no formula calculation, no pivots, and the workarounds

Every expert knows where the tool stops. openpyxl is a file-format library, not a spreadsheet engine, and four limitations come up on almost every real project. Each has a workable answer.

### 1. No formula calculation

Covered in Beginner, but the production workaround deserves the full recipe. LibreOffice can recalculate and re-save headlessly:

```bash
soffice --headless --calc --convert-to xlsx --outdir recalculated/ report.xlsx
```

Then reopen with `data_only=True` and the cached values are present. Wrap it in Python:

```python
import subprocess, pathlib
def recalc(path: pathlib.Path, outdir: pathlib.Path):
    subprocess.run(["soffice", "--headless", "--calc", "--convert-to", "xlsx",
                    "--outdir", str(outdir), str(path)], check=True, timeout=120)
    return outdir / path.name
```

Caveats: LibreOffice's functions are almost but not exactly Excel's (some newer dynamic-array functions differ), a running LibreOffice instance blocks the headless one, and it is slow (about a second per file). For a formula subset you control, the `formulas` package (`pip install formulas`) evaluates workbooks in pure Python, and for a single formula `pycel` compiles it to Python. On Windows with Excel installed, `xlwings` drives the real engine: `app.calculate()` then read values.

### 2. No PivotTable creation

openpyxl can preserve an existing pivot's cache but has no API to build one. Options:

- Compute the pivot in pandas (`pivot_table`) and write it as a formatted static table. This is what most reports actually need.
- Ship a template that already contains a PivotTable pointing at a Table named `Data`, set `pivot.cache.refreshOnLoad = True` through `ws._pivots`, and let Excel refresh on open. openpyxl exposes `ws._pivots` and each pivot's `cache`; the refresh flag is the one property worth touching.
- Use xlwings or the Excel COM API if the environment has Excel.

```python
for pivot in wb["Pivot"]._pivots:
    pivot.cache.refreshOnLoad = True
```

### 3. No rendering

openpyxl cannot produce a PDF or an image of a sheet. LibreOffice does: `soffice --headless --convert-to pdf report.xlsx`, honouring print areas, fit-to-page and headers set in openpyxl. This is how a weekly pack is turned into the PDF that goes to management.

### 4. Round-trip losses

Shapes, slicers, sparklines, Power Query connections and some charts do not survive load-and-save. The mitigation is architectural: keep openpyxl's writes confined to a plain data sheet, and let the presentation workbook link to it by external reference or by Power Query. The presentation file is never opened by openpyxl and never loses anything.

### Other edge cases worth knowing

| Situation | What happens | Workaround |
|---|---|---|
| Strings longer than 32,767 characters | `ValueError` | Truncate or split across cells |
| Illegal XML characters (`\x00`–`\x08`) | `IllegalCharacterError` | Strip with `re.sub(ILLEGAL_CHARACTERS_RE, "", s)` from `openpyxl.cell.cell` |
| NumPy types | `numpy.int64` etc. are converted since 2.6 | Cast with `.item()` on old versions |
| Very old `.xls` | `InvalidFileException` | Convert with LibreOffice or read with `xlrd==1.2.0` |
| Excel opened the file | `PermissionError` on save | Save to a new name and rename |
| Dates before 1900 | Written as text or wrong serial | Store as ISO string |

> **Warning:** `IllegalCharacterError` is the most common crash in pipelines that pull free-text notes from databases. Sanitise every string column before writing; a single control character in one cell fails the whole save.

### Try It Yourself

```python
from io import BytesIO
import re
from openpyxl import Workbook, load_workbook
from openpyxl.cell.cell import ILLEGAL_CHARACTERS_RE

wb = Workbook(); ws = wb.active
ws.append(["File #", "Note", "Qty", "Rate", "Total"])
dirty_note = "Client called\x07 re: closing\x00 date"        # control characters from a database export
ws.append(["TX-10432", re.sub(ILLEGAL_CHARACTERS_RE, "", dirty_note), 40, 2.5, "=C2*D2"])
ws.append(["WY-00871", "OK", 12, 3.0, "=C3*D3"])
ws["E4"] = "=SUM(E2:E3)"

buf = BytesIO(); wb.save(buf)
print("Sanitised note:", repr(ws["B2"].value))

# openpyxl cannot calculate, so a "Python calc engine" fills the gap for simple formulas
vals = load_workbook(BytesIO(buf.getvalue()), data_only=True).active
print("Cached E4 without Excel:", vals["E4"].value)
rows = list(ws.iter_rows(min_row=2, max_row=3, values_only=True))
totals = [q * r for _, _, q, r, _ in rows]
print("Recomputed in Python:", totals, "grand total", sum(totals))
print("For real recalculation: soffice --headless --calc --convert-to xlsx --outdir out/ report.xlsx")
```

### Quiz

1. Which command recalculates an openpyxl-written workbook without Excel?
- [x] `soffice --headless --calc --convert-to xlsx --outdir out/ report.xlsx`
- [ ] `openpyxl --recalc report.xlsx`
- [ ] `python -m openpyxl.calc report.xlsx`
> LibreOffice recalculates on load and writes the cached values on conversion.

2. What is the practical way to give a client a "PivotTable" from openpyxl?
- [ ] `ws.add_pivot()`
- [x] Compute it with pandas `pivot_table` and write a static table, or ship a template pivot with `refreshOnLoad`
- [ ] Pivots are impossible in any workflow
> openpyxl cannot create pivots; it can only preserve one and flag its cache to refresh.

3. What raises `IllegalCharacterError`?
- [ ] Strings longer than 255 characters
- [x] Control characters such as `\x00` in a string value
- [ ] Non-ASCII text like Urdu
> XML forbids most control characters; Unicode text is fine.

### Exercises

1. **Sanitise a column** — Write a function that strips illegal characters from every string in a list of records before they are written.
<details><summary>Solution</summary>

```python
import re
from openpyxl.cell.cell import ILLEGAL_CHARACTERS_RE
def clean(records):
    return [[re.sub(ILLEGAL_CHARACTERS_RE, "", v) if isinstance(v, str) else v for v in rec] for rec in records]
```

</details>

2. **Refresh on open** — Load a workbook, set every PivotTable's cache to refresh on load, and save.
<details><summary>Solution</summary>

```python
from openpyxl import load_workbook
wb = load_workbook("dashboard.xlsx")
for ws in wb.worksheets:
    for pivot in ws._pivots:
        pivot.cache.refreshOnLoad = True
wb.save("dashboard_refresh.xlsx")
```

</details>

### Interview Questions

**Q: A reviewer asks you to prove that the totals in your generated workbook are correct without opening Excel. What do you do?**
Two independent paths. The Python path recomputes every total from the source data with pandas and compares it to the values I wrote; that proves the numbers. The Excel-formula path runs LibreOffice headless to recalculate the workbook, reloads it with `data_only=True`, and asserts that each formula cell equals the pandas figure to the cent; that proves the formulas reference the right ranges. In CI both run on a fixture file. I mention the known gap: LibreOffice implements a few newer Excel functions differently, so for those I compute in Python and write values instead of formulas.

**Q: Why can openpyxl not create PivotTables when it can create charts and tables?**
A PivotTable is three linked parts: a pivot cache definition, the cache records (a snapshot of the source data) and the pivot table definition with its field layout. Excel regenerates the cache from the source on refresh, but the file must contain a consistent cache to open at all, and generating one correctly, including data types, shared items and field indexes, is a large piece of work nobody has contributed to openpyxl. Charts and tables, by contrast, are declarative XML over cell ranges. The practical answer is a pre-built pivot in a template with `refreshOnLoad = True`, or a pandas pivot written as a static table.

**Q: How do you produce the PDF version of a weekly report pack from Python?**
Set the print layout in openpyxl (print area, titles, landscape, fit to width, header and footer), save the workbook, then run `soffice --headless --convert-to pdf --outdir out/ report.xlsx`. LibreOffice honours those page settings, so the PDF matches what Excel would print. For multi-sheet packs I set the print order by sheet position and use `sheet_state = "hidden"` for sheets that must not print. When a client insists on Excel's exact rendering, the fallback is `xlwings` with `sheet.to_pdf()` on a Windows machine that has Excel installed.

## openpyxl interview questions

Interviews for document-automation and reporting roles test openpyxl in three ways: quick-fire API questions, a debugging scenario, and a design question about a pipeline. This chapter organises the most frequent questions by category with the answers a strong candidate gives. Practise saying them aloud in under a minute each.

### Quick-fire API questions

| Question | One-line answer |
|---|---|
| Read a cell? | `ws["A1"].value` or `ws.cell(row=1, column=1).value` |
| Fastest way to read all rows? | `ws.iter_rows(values_only=True)`, `read_only=True` for large files |
| Add a sheet at the front? | `wb.create_sheet("Cover", 0)` |
| Bold a header row? | Loop `ws[1]` and set `cell.font = Font(bold=True)` |
| Currency format? | `cell.number_format = '"$"#,##0.00'` |
| Freeze the header? | `ws.freeze_panes = "A2"` |
| Merge a title? | `ws.merge_cells("A1:F1")` |
| Dropdown list? | `DataValidation(type="list", formula1='"A,B,C"')`, `ws.add_data_validation(dv)`, `dv.add("C2:C100")` |
| Highlight below threshold? | `ws.conditional_formatting.add(rng, CellIsRule(operator="lessThan", formula=["0.95"], fill=red))` |
| Bar chart? | `BarChart()`, `add_data(Reference(...), titles_from_data=True)`, `set_categories`, `ws.add_chart(chart, "E2")` |
| Keep macros? | `load_workbook(path, keep_vba=True)` and save as `.xlsm` |
| Formula result? | `load_workbook(path, data_only=True)`, `None` if never calculated |

### Debugging scenarios

Interviewers describe a symptom and want the cause and fix.

**"The numbers are there but SUM shows 0."** The values were written as strings (`"1250"`), probably from a CSV read without conversion. Fix: cast with `float()` before writing and check `type(cell.value)`.

**"Excel says the file needs repair."** Common causes: a Table with a blank or duplicate header, two Tables or a Table plus `auto_filter` on the same range, an invalid sheet name, or a merged range overlapping another merge. Unzip the file and Excel's repair log points to the part.

**"Dates show as 45912."** The cell holds a serial number without a date number format. Write a `datetime.date` or set `number_format = "yyyy-mm-dd"`.

**"The generated file is 40 MB for 50,000 rows."** Styles applied per cell with new objects, formulas in every row, or long text repeated. Reuse style objects, compute values in Python, and consider write-only mode.

**"Conditional formatting works in row 2 but is wrong below."** The formula was written with absolute rows (`$E$2`) or the range anchor does not match the formula's anchor.

### Design questions

```python
# "Design the module layout for a report generator" – the answer is structure, not code volume
report/
    extract.py     # read_sql / read_csv, schema check
    transform.py   # pandas aggregation, returns DataFrames
    layout.py      # openpyxl: styles, table writer, chart builder, print setup
    build.py       # orchestrates, writes to temp file, atomic rename, logging
    tests/         # fixture data + assertions on cells, formats, charts
```

Say why: separation lets you unit-test transformation without Excel, and swap the writer for xlsxwriter or a PDF renderer later.

### Comparison questions

- **openpyxl vs xlsxwriter:** read and modify vs write-only speed and polish.
- **openpyxl vs pandas:** cell-level control vs one-line DataFrame dumps.
- **openpyxl vs xlwings:** file format vs live Excel automation (needs Excel installed).
- **openpyxl vs LibreOffice UNO:** Python objects vs full engine with calculation and rendering.

### Questions about the format itself

Know that `.xlsx` is a zip of XML parts, that styles are shared through `styles.xml` indexes, that strings live in `sharedStrings.xml`, that dates are serial numbers, and that formulas are text with an optional cached value. Being able to say "I would unzip it and look at `sheet1.xml`" separates candidates who have debugged real files from those who have only read the docs.

> **Interview note:** When asked "what is openpyxl bad at?", answer confidently: no formula engine, no pivot creation, no rendering, some round-trip losses, and memory in normal mode. Then give the workaround for each. Knowing the limits is the expert signal.

### Try It Yourself

```python
# A self-check: five classic interview bugs, fixed in code. Run and read the output.
from io import BytesIO
import datetime as dt
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font

wb = Workbook(); ws = wb.active
# Bug 1: numbers as text -> SUM shows 0. Fix: cast.
ws.append(["Premium", "Closed on", "Status"])
ws.append([float("1250.00"), dt.date(2026, 9, 11), "Closed"])
ws.append([float("980.50"), dt.date(2026, 9, 12), "Open"])
ws["A4"] = "=SUM(A2:A3)"
# Bug 2: date serial shown as number. Fix: write a date object (format applied automatically).
# Bug 3: new Font per cell in a loop. Fix: one shared object.
bold = Font(bold=True)
for c in ws[1]:
    c.font = bold
# Bug 4: reading formula result from an unsaved-by-Excel file. Fix: compute in Python.
py_total = sum(r[0] for r in ws.iter_rows(min_row=2, max_row=3, values_only=True))
# Bug 5: forgetting BytesIO/rewind when reloading.
buf = BytesIO(); wb.save(buf); buf.seek(0)
back = load_workbook(buf)
print("Types:", [type(c.value).__name__ for c in back.active[2]])
print("Date format:", back.active["B2"].number_format, "| is_date:", back.active["B2"].is_date)
print("Header bold:", all(c.font.bold for c in back.active[1]))
print("Formula:", back.active["A4"].value, "| Python total:", py_total)
```

### Quiz

1. "SUM shows 0 although the cells contain numbers" is most likely caused by:
- [x] The values were written as strings
- [ ] The number format is wrong
- [ ] The sheet is protected
> Excel does not sum text; check `type(cell.value)` in openpyxl.

2. Which pair is a correct openpyxl-versus-alternative distinction?
- [ ] openpyxl renders PDFs; LibreOffice does not
- [x] xlsxwriter cannot open existing files; openpyxl can
- [ ] pandas gives cell-level styling; openpyxl does not
> xlsxwriter is write-only by design; openpyxl reads, edits and writes.

3. A file "needs repair" after adding a Table. The first thing to check is:
- [x] Header cells are unique, non-empty strings and the range has no other filter
- [ ] The workbook has too many sheets
- [ ] The font name is not installed
> Table header and range rules are the top cause of repair prompts in generated files.

### Exercises

1. **Explain the bug** — A colleague writes `ws["A1"].font.bold = True` and gets an error. Write the corrected line and a one-sentence explanation.
<details><summary>Solution</summary>

```python
from openpyxl.styles import Font
ws["A1"].font = Font(bold=True)
# Style objects are immutable; assign a new Font instead of mutating the existing one.
```

</details>

2. **Timed drill** — In under five minutes, write code that creates a sheet with headers, three data rows, a `SUM` totals row, bold headers, currency format on column B, a frozen header and an autofilter. Save to `BytesIO`.
<details><summary>Solution</summary>

```python
from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import Font
wb = Workbook(); ws = wb.active
ws.append(["State", "Premium"])
for r in [("TX", 1250), ("WY", 980.5), ("NM", 1002)]: ws.append(r)
ws.append(["Total", "=SUM(B2:B4)"])
for c in ws[1]: c.font = Font(bold=True)
for r in range(2, 6): ws.cell(row=r, column=2).number_format = '"$"#,##0.00'
ws.freeze_panes = "A2"; ws.auto_filter.ref = "A1:B4"
buf = BytesIO(); wb.save(buf); print(len(buf.getvalue()))
```

</details>

### Interview Questions

**Q: Tell me about a time an openpyxl-generated file caused a problem for a client and what you changed.**
A weekly tracker started opening with a repair prompt after I added an Excel Table for filtering. The cause was a header cell that pandas had written as `Unnamed: 4` for an empty source column, which became a duplicate once I renamed another column to the same text. The fix was a header validation step that rejects blanks and duplicates before the `Table` is created, plus a round-trip test in CI that loads the output and checks `ws.tables`. The bigger lesson was to treat Excel's structural rules as constraints to validate in code, not as things to remember.

**Q: How do you decide between writing values and writing formulas in a generated workbook?**
Values when the workbook is a record: audit trails, invoices, anything that must not change after delivery, and anything that will be read back by another program, because openpyxl cannot evaluate formulas. Formulas when the workbook is a working tool: rate calculators, trackers where the client edits inputs, and totals over editable tables. In mixed cases I write values and add a small formula-driven check row that recomputes the totals, so an analyst can see immediately whether the sheet has been edited since generation.

**Q: What would you look for when reviewing a junior colleague's openpyxl code?**
Correctness risks first: 0-based indexes, `data_only` workbooks being saved, `keep_vba` missing on `.xlsm`, `append` on a template, tables with bad headers. Then performance: `Font()` created inside loops, cell access in tight loops instead of `iter_rows(values_only=True)`, normal mode on large files. Then maintainability: hard-coded coordinates instead of defined names, styles scattered rather than centralised, no test fixture. Finally delivery safety: writing directly to the shared path instead of temp-and-rename, and no reload-and-verify step. Each of these is a five-minute fix that prevents a client-facing incident.

**Q: How would you convince a team still building reports by hand to adopt an openpyxl pipeline?**
Measure the current process (hours per week, error rate, delays), automate one report end to end with their exact template so the output is indistinguishable, and run both in parallel for two weeks while comparing totals. Show the diff log: every discrepancy found was a manual error. Then hand over a one-page runbook and a `build.py` with a single command. Adoption follows when the team sees the same file they already trust arriving on time without their afternoon, and when they see the validation step catching a source change before it reached a manager.

