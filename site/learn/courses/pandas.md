---
id: pandas
title: Python pandas
icon: 🐼
track: Data & Reporting
color: #150458
runner: python
packages: 
tagline: Clean, reshape, aggregate and export data in Python.
description: pandas from Series and DataFrames to expert data engineering: reading CSV/Excel/SQL, selection and filtering, missing data, dtypes and dates, groupby and aggregation, merge/join/concat, pivot and melt, string and datetime accessors, window functions, categorical data, performance, and exporting styled Excel reports.
---

# LEVEL: Beginner

## Installing & Series/DataFrame basics

pandas is the Python library for tables. If Excel is where you look at data, pandas is where you process it: the same weekly production export that takes twenty manual steps in Excel becomes a ten-line script that runs identically every Monday. pandas is built on NumPy and is the standard first import in almost every data job, so learning it well pays off in every later tool, from Power BI scripts to machine learning.

### Installing

```bash
pip install pandas openpyxl
python -c "import pandas as pd; print(pd.__version__)"
```

`openpyxl` is the engine pandas uses to read and write `.xlsx` files. In a Jupyter notebook or the browser runner on this page, pandas is already available. The universal import line is:

```python
import pandas as pd
```

pandas 2.0 (April 2023) tightened a lot of behaviour and pandas 3.0 (2025) changed a few defaults, most notably making string columns a dedicated `str` dtype and enabling copy-on-write. Where this course shows something that differs between versions, it says so.

### Series: one column

A **Series** is a one-dimensional labelled array. Think of one Excel column together with its row labels.

```python
import pandas as pd

files = pd.Series([412, 388, 455], index=["Sana", "Bilal", "Hira"], name="files")
print(files)
print(files["Bilal"])      # 388, by label
print(files.sum())         # 1255
print(files * 2)           # arithmetic applies to every element
```

Output:

```text
Sana     412
Bilal    388
Hira     455
Name: files, dtype: int64
```

The labels on the left are the **index**. Every Series and DataFrame has one. Operations align on the index: adding two Series adds the values with matching labels, not matching positions.

### DataFrame: the table

A **DataFrame** is a two-dimensional table: a dictionary of Series that share one index. The easiest way to build one by hand is from a dictionary of lists:

```python
df = pd.DataFrame({
    "agent":  ["Sana", "Bilal", "Hira"],
    "state":  ["WY", "MT", "WY"],
    "files":  [412, 388, 455],
    "errors": [9, 14, 6],
})
print(df)
print(df.shape)        # (3, 4): rows, columns
print(df.columns)      # Index(['agent', 'state', 'files', 'errors'], dtype='object')
print(df.dtypes)
```

```text
   agent state  files  errors
0   Sana    WY    412       9
1  Bilal    MT    388      14
2   Hira    WY    455       6
```

The `0 1 2` on the left is the default `RangeIndex`. Each column is a Series with its own **dtype**: `files` and `errors` are `int64`, `agent` and `state` are `object` in pandas 2.x (Python strings stored generically) or `str` in pandas 3.x.

### Columns are Series

```python
print(df["files"])             # one column → Series
print(df["files"].mean())      # 418.33
df["rate"] = df["errors"] / df["files"]    # new column from a vectorised expression
print(df)
```

Arithmetic between columns happens element by element, for every row at once, without a loop. This is called **vectorisation** and it is the single most important habit in pandas: whenever you feel a `for` loop coming, look for the column operation instead.

### Rows and the index

```python
df = df.set_index("agent")
print(df.loc["Bilal"])           # one row as a Series, by label
print(df.loc["Bilal", "files"])  # one cell
df = df.reset_index()            # back to a RangeIndex
```

`set_index` promotes a column to be the row labels, which makes `loc` lookups by name possible and makes joins faster. `reset_index` reverses it. Most cleaning code keeps a plain RangeIndex until the end.

### Getting help

`df.head()` shows the first five rows, `type(x)` tells you whether you are holding a Series or a DataFrame, and `help(pd.DataFrame.merge)` or `pd.DataFrame.merge?` in Jupyter prints the documentation. The official docs at pandas.pydata.org have a user guide that is worth reading once cover to cover.

> **Tip:** Keep the distinction straight: `df["files"]` (one set of brackets) returns a Series; `df[["files", "errors"]]` (a list inside the brackets) returns a DataFrame with those columns. Many early errors come from expecting a DataFrame and getting a Series, or the reverse.

### Try It Yourself

```python
import pandas as pd

df = pd.DataFrame({
    "agent":  ["Sana", "Bilal", "Hira", "Usman"],
    "state":  ["WY", "MT", "WY", "ID"],
    "files":  [412, 388, 455, 301],
    "errors": [9, 14, 6, 12],
})
df["rate"] = df["errors"] / df["files"]

print(df)
print()
print("shape:", df.shape)
print("total files:", df["files"].sum())
print("team error rate:", round(df["errors"].sum() / df["files"].sum(), 4))
print()
print(df.set_index("agent").loc["Hira"])
```

### Quiz

1. What is a pandas Series?
- [x] A one-dimensional labelled array, like one column with an index
- [ ] A two-dimensional table
- [ ] A Python list
> A Series has values plus an index; a DataFrame is a collection of Series sharing one index.

2. What does `df["files"]` return?
- [ ] A DataFrame with one column
- [x] A Series
- [ ] A list
> Single brackets with one name return a Series; a list inside the brackets returns a DataFrame.

3. `df["rate"] = df["errors"] / df["files"]` computes the rate for how many rows?
- [x] Every row at once
- [ ] Only the first row
- [ ] It raises an error without a loop
> Column arithmetic is vectorised: it applies element-wise across the whole column.

4. What does `df.shape` return for a table of 3,346 rows and 9 columns?
- [ ] `(9, 3346)`
- [x] `(3346, 9)`
- [ ] `3346`
> shape is a tuple of (rows, columns).

### Exercises

1. **Build a table** — Create a DataFrame of five states with their rate per $1,000 and count how many states have a rate above 5.
<details><summary>Solution</summary>

```python
import pandas as pd
rates = pd.DataFrame({"state": ["WY","MT","ID","CO","UT"], "rate": [5.5, 6.0, 5.2, 4.8, 5.9]})
print((rates["rate"] > 5).sum())   # booleans sum as 1/0 → 4
```

</details>

2. **Premium column** — Add a `coverage` column and compute premium as coverage rounded up to the next $1,000 times the rate, rounded to two decimals.
<details><summary>Solution</summary>

```python
import numpy as np
rates["coverage"] = [187450, 250000, 99999, 500000, 120500]
units = np.ceil(rates["coverage"] / 1000)
rates["premium"] = (units * rates["rate"]).round(2)
print(rates)
```

</details>

3. **Index lookup** — Set `state` as the index and print the rate for Idaho.
<details><summary>Solution</summary>

```python
print(rates.set_index("state").loc["ID", "rate"])   # 5.2
```

</details>

### Interview Questions

**Q: What is the difference between a Series and a DataFrame?**
A Series is one-dimensional: a sequence of values with an index and a single dtype, equivalent to one column. A DataFrame is two-dimensional: an ordered collection of Series that share the same row index, each column with its own dtype. Selecting one column of a DataFrame gives a Series, and most DataFrame operations are implemented column by column over Series. Knowing which you hold matters because methods differ: `Series.value_counts()` exists, `DataFrame.value_counts()` counts row combinations, and `Series.str` exists while `DataFrame.str` does not.

**Q: Why is vectorisation preferred over loops in pandas?**
Vectorised operations run in compiled C on whole arrays, so `df["errors"] / df["files"]` over a million rows takes milliseconds, while a Python `for` loop over the same rows takes seconds and produces harder-to-read code. Vectorisation also aligns on the index automatically and propagates missing values correctly. The practical rule is that a loop over rows is a sign that a column operation, a `groupby`, or a `merge` is being missed. When row-wise logic is genuinely required, `np.where`, `np.select` or `Series.map` are still faster than `iterrows`.

**Q: What is the index and why does pandas have one?**
The index is the set of row labels, and it is what makes pandas different from a plain 2-D array. It enables label-based lookup with `loc`, automatic alignment in arithmetic and joins, time-series operations when the index is a `DatetimeIndex`, and fast repeated lookups because a unique index is hashed. The cost is that operations can silently align on labels you did not intend, such as adding two Series built from different filters and getting `NaN` for non-overlapping rows. For that reason cleaning code usually works with a plain `RangeIndex` and sets a meaningful index only when it is needed for lookups, resampling or joining.

## Reading & writing files (CSV/Excel/JSON)

Real data starts in a file. pandas reads CSV, Excel, JSON, Parquet, SQL and the clipboard with a family of `pd.read_*` functions and writes them back with `DataFrame.to_*` methods. Knowing the important arguments of `read_csv` and `read_excel` saves more time than any other skill, because a file read correctly needs far less cleaning.

### read_csv

```python
import pandas as pd

df = pd.read_csv("production.csv")
```

That works for a well-formed file. Exports rarely are, so learn these arguments:

| Argument | Purpose | Example |
|---|---|---|
| `sep` | Delimiter | `sep=";"` for European CSVs, `sep="\t"` for TSV |
| `encoding` | Character set | `encoding="utf-8-sig"` strips the Excel BOM; `"cp1252"` for old Windows exports |
| `header` | Row containing column names | `header=2` when the file has title lines |
| `skiprows` | Skip lines at the top | `skiprows=3` |
| `usecols` | Read only some columns | `usecols=["Date", "State", "Files"]` |
| `dtype` | Force column types | `dtype={"File": str}` to keep leading zeros |
| `parse_dates` | Parse date columns | `parse_dates=["Date"]` |
| `thousands` | Thousands separator | `thousands=","` so `"1,234"` becomes 1234 |
| `na_values` | Extra missing markers | `na_values=["N/A", "-", ""]` |
| `nrows` | Read only the first N rows | `nrows=1000` to test a huge file |

```python
df = pd.read_csv(
    "production.csv",
    encoding="utf-8-sig",
    dtype={"File": str},
    parse_dates=["Date"],
    thousands=",",
    na_values=["N/A", "-"],
)
```

`dtype={"File": str}` is the pandas equivalent of the Excel apostrophe: without it, `00417` becomes `417`. In pandas 2.x use `dayfirst=True` with `parse_dates` for d/m/y files; the explicit `date_format="%d/%m/%Y"` argument (2.0+) is safer and faster.

### Reading from a string

For testing, and for every Try It block in this course, `io.StringIO` turns a string into a file-like object:

```python
import io
csv = """date,state,agent,files,errors
2026-09-01,WY,Sana,412,9
2026-09-01,MT,Bilal,388,14
"""
df = pd.read_csv(io.StringIO(csv), parse_dates=["date"])
```

### read_excel

```python
df = pd.read_excel("weekly.xlsx", sheet_name="Production", header=1, usecols="A:F")
sheets = pd.read_excel("weekly.xlsx", sheet_name=None)     # dict of every sheet
```

`sheet_name` accepts a name, an index, a list or `None` for all sheets. Excel dates arrive as real `datetime64` values when the cells are real dates, and as strings when they were text in Excel, which mirrors the Excel-side problem from the Excel course. Reading `.xlsx` needs `openpyxl`; old `.xls` needs `xlrd`.

### Writing

```python
df.to_csv("clean.csv", index=False)
df.to_excel("clean.xlsx", sheet_name="Production", index=False)
df.to_json("clean.json", orient="records", indent=2)
df.to_parquet("clean.parquet")          # needs pyarrow; fastest and keeps dtypes
```

`index=False` is almost always what you want: without it the RangeIndex is written as an unnamed first column, and the next read creates `Unnamed: 0`. Multiple sheets in one workbook use a writer context:

```python
with pd.ExcelWriter("report.xlsx", engine="openpyxl") as xw:
    summary.to_excel(xw, sheet_name="Summary", index=False)
    df.to_excel(xw, sheet_name="Detail", index=False)
```

### JSON

`pd.read_json` handles arrays of records; nested API responses need `pd.json_normalize(records, sep="_")`, which flattens nested dictionaries into columns such as `address_city`.

### Other sources

`pd.read_clipboard()` reads whatever you copied from Excel, which is invaluable for quick checks. `pd.read_html(url)` returns every `<table>` on a web page as a list of DataFrames. `pd.read_sql` is covered in the Expert level.

### Formats compared

| Format | Keeps dtypes | Size | Speed | Use |
|---|---|---|---|---|
| CSV | No | Large | Slow | Exchange with anything |
| Excel | Partly | Medium | Slowest | Deliver to people |
| JSON | Partly | Large | Slow | APIs |
| Parquet | Yes | Small | Fast | Intermediate storage, data lakes |

> **Warning:** CSV has no type information. Every `read_csv` guesses, and the guesses change when a column that was all numbers gets one text value. Pin the types you care about with `dtype=` and `parse_dates=`, and prefer Parquet for files that pandas will read again.

### Try It Yourself

```python
import io
import pandas as pd

raw = """Weekly Production Export
Generated 2026-09-15
Date,State,Agent,File,Files,Errors,Coverage
2026-09-01,WY,Sana,00417,412,9,"187,450"
2026-09-01,MT,Bilal,00418,388,14,"250,000"
2026-09-02,WY,Hira,00419,455,N/A,"99,999"
2026-09-02,ID,Usman,00420,301,12,-
"""

df = pd.read_csv(
    io.StringIO(raw),
    skiprows=2,                 # two title lines before the header
    dtype={"File": str},        # keep leading zeros
    parse_dates=["Date"],
    thousands=",",
    na_values=["N/A", "-"],
)
print(df)
print()
print(df.dtypes)

# Round-trip through CSV text and JSON records
csv_text = df.to_csv(index=False)
print()
print(csv_text)
print(df.head(2).to_json(orient="records", date_format="iso"))
```

### Quiz

1. Which argument keeps a policy number like `00417` as text?
- [ ] `parse_dates`
- [x] `dtype={"File": str}`
- [ ] `thousands`
> Without a dtype hint, read_csv converts it to the integer 417.

2. What does `index=False` do in `to_csv`?
- [x] Omits the row index from the file
- [ ] Skips the header row
- [ ] Writes the index as the last column
> Omitting it writes the index, which comes back as `Unnamed: 0` on the next read.

3. Which format preserves dtypes and is smallest?
- [ ] CSV
- [ ] Excel
- [x] Parquet
> Parquet is columnar, compressed and typed; CSV is text with no schema.

4. How do you read every sheet of a workbook at once?
- [ ] `sheet_name="*"`
- [x] `sheet_name=None`
- [ ] `all_sheets=True`
> `None` returns a dictionary mapping sheet names to DataFrames.

### Exercises

1. **European CSV** — Read a file with `;` separators, `,` decimals and Windows-1252 encoding.
<details><summary>Solution</summary>

```python
df = pd.read_csv("export.csv", sep=";", decimal=",", encoding="cp1252")
```

</details>

2. **Two-sheet workbook** — Write a summary and a detail DataFrame to one Excel file.
<details><summary>Solution</summary>

```python
with pd.ExcelWriter("report.xlsx") as xw:
    summary.to_excel(xw, sheet_name="Summary", index=False)
    detail.to_excel(xw, sheet_name="Detail", index=False)
```

</details>

3. **Sample a huge file** — Inspect the first 500 rows and only three columns of a 2 GB CSV.
<details><summary>Solution</summary>

```python
df = pd.read_csv("huge.csv", nrows=500, usecols=["Date", "State", "Files"])
```

</details>

### Interview Questions

**Q: What problems do you commonly hit reading CSV exports and how do you handle them?**
Encoding errors from Windows exports (`cp1252` or a UTF-8 BOM that puts `﻿` in the first column name, fixed with `encoding="utf-8-sig"`), title rows above the header (`skiprows` or `header=`), numbers with thousands separators read as strings (`thousands=","`), identifiers losing leading zeros (`dtype=str` for those columns), dates in d/m/y parsed as m/d/y (`date_format=`), and missing markers such as `N/A` or `-` (`na_values`). I read a sample with `nrows=1000`, check `df.dtypes` and `df.head()`, fix the arguments, then read the full file. The arguments live in one function so every weekly file is read identically.

**Q: When would you choose Parquet over CSV?**
Whenever pandas or another program is the consumer rather than a person. Parquet stores columns with their dtypes, compresses well, reads only the columns requested, and round-trips dates, categoricals and nullable integers exactly, which CSV cannot. A 500 MB CSV of production rows becomes roughly a 50 MB Parquet file that loads ten times faster. CSV remains the right choice for handing data to Excel users or unknown systems, and Excel for delivered reports. In a pipeline I read raw CSVs once, clean, and save Parquet for every downstream step.

**Q: How do you read and write multiple Excel sheets?**
`pd.read_excel(path, sheet_name=None)` returns a dictionary of DataFrames keyed by sheet name, or pass a list of names for a subset. To write several sheets, open `pd.ExcelWriter` as a context manager and call `to_excel` with a different `sheet_name` for each frame; the file is saved when the block exits. With `engine="openpyxl"` I can then reopen the workbook with openpyxl to add formatting, column widths and freeze panes, which is how the weekly report in the Expert level is produced.

## Inspecting data (head/info/describe)

Before cleaning or analysing, look. Five methods tell you almost everything about a new dataset: its size, its columns and types, how many values are missing, what the numbers look like, and what values the categories take. Doing this in the first two minutes prevents hours of debugging later, exactly as checking alignment does in Excel.

### The first look

```python
df.head()          # first 5 rows (head(10) for ten)
df.tail(3)         # last 3 rows: catches totals rows and trailing junk
df.sample(5)       # random rows: catches problems not at the ends
df.shape           # (rows, columns)
df.columns         # column names
```

### info: types and missing values

```python
df.info()
```

```text
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 3346 entries, 0 to 3345
Data columns (total 6 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   date    3346 non-null   datetime64[ns]
 1   state   3346 non-null   object
 2   agent   3340 non-null   object
 3   files   3346 non-null   int64
 4   errors  3301 non-null   float64
 5   status  3346 non-null   object
dtypes: datetime64[ns](1), float64(1), int64(1), object(3)
memory usage: 157.0+ KB
```

Read it like this: `errors` has 45 missing values, and because integer columns cannot hold `NaN` in NumPy, pandas promoted it to `float64`. `agent` has six blanks. `date` parsed correctly as `datetime64`. Anything numeric showing as `object` is the pandas version of numbers stored as text.

### describe: distributions

```python
df.describe()                 # numeric columns: count, mean, std, min, quartiles, max
df.describe(include="object") # text columns: count, unique, top, freq
df.describe(include="all")
```

The numeric summary exposes impossible values instantly: a negative file count, a maximum of 99999 that is clearly a sentinel, a coverage of 0. The object summary shows how many distinct states there are (`unique`) and the most common (`top`).

### Counting values

```python
df["state"].value_counts()                 # frequency, descending
df["state"].value_counts(normalize=True)   # share
df["state"].nunique()                      # number of distinct values
df["state"].unique()                       # the distinct values as an array
df["status"].value_counts(dropna=False)    # include NaN as a category
```

`value_counts` on a supposedly clean category column reveals `WY`, `wy` and `WY ` as three different values, which is the next chapter's job.

### Missing values at a glance

```python
df.isna().sum()                 # missing per column
df.isna().mean().round(3)       # share missing per column
df[df["errors"].isna()].head()  # the rows with missing errors
```

### Duplicates

```python
df.duplicated().sum()                     # fully duplicated rows
df.duplicated(subset=["file"]).sum()      # duplicate file numbers
df[df.duplicated(subset=["file"], keep=False)].sort_values("file")   # see them all
```

### Memory and dtypes

```python
df.dtypes
df.memory_usage(deep=True).sum() / 1e6     # MB, deep counts string contents
```

Object columns of repeated strings are the usual memory hogs; the Advanced level converts them to `category`.

### Display settings

Wide tables are truncated with `...`. Adjust once at the top of a script or notebook:

```python
pd.set_option("display.max_columns", 50)
pd.set_option("display.width", 200)
pd.set_option("display.float_format", "{:,.2f}".format)
```

`df.T` transposes a wide single row for reading, and `df.to_string()` prints everything.

### A checklist function

```python
def profile(df):
    print(df.shape)
    print(df.dtypes.value_counts())
    print("missing:\n", df.isna().sum()[lambda s: s > 0])
    print("duplicate rows:", df.duplicated().sum())
    for col in df.select_dtypes(include="object"):
        print(col, "→", df[col].nunique(), "distinct")
```

Running this on every new file is the pandas equivalent of the Excel `ISNUMBER` check.

> **Tip:** `df.info()` and `df.isna().sum()` before anything else. The two most expensive mistakes in analysis, numbers stored as text and silently missing rows, are both visible in those two outputs.

### Try It Yourself

```python
import io
import pandas as pd

raw = """date,state,agent,file,files,errors,status
2026-09-01,WY,Sana,00417,412,9,Complete
2026-09-01,MT,Bilal,00418,388,,Complete
2026-09-02,WY,Hira,00419,455,6,Late
2026-09-02,wy,Hira,00419,455,6,Late
2026-09-03,ID,,00421,301,12,Complete
2026-09-03,MT,Bilal,00422,-5,1,QA
"""
df = pd.read_csv(io.StringIO(raw), dtype={"file": str}, parse_dates=["date"])

print(df.head(3)); print()
df.info(); print()
print(df.describe()); print()
print(df["state"].value_counts()); print()
print("missing per column:\n", df.isna().sum()); print()
print("duplicate file numbers:", df.duplicated(subset=["file"]).sum())
print(df[df.duplicated(subset=["file"], keep=False)])
```

### Quiz

1. An integer column shows dtype `float64` after `read_csv`. The most likely reason is?
- [ ] The file used decimals
- [x] The column contains missing values, which integers cannot hold
- [ ] pandas always uses float
> NumPy integers cannot represent NaN, so pandas upcasts to float.

2. Which method shows the count of distinct values in a column?
- [ ] `count()`
- [x] `nunique()`
- [ ] `unique()`
> `nunique` returns the number; `unique` returns the values themselves.

3. What does `df.isna().sum()` return?
- [x] The number of missing values per column
- [ ] The number of missing values in total
- [ ] A boolean DataFrame
> Summing booleans column-wise counts the True (missing) cells per column.

4. Which call reveals all rows sharing a duplicated file number?
- [ ] `df.duplicated(subset=["file"])`
- [x] `df[df.duplicated(subset=["file"], keep=False)]`
- [ ] `df.drop_duplicates()`
> `keep=False` marks every member of a duplicate group, not just the later ones.

### Exercises

1. **Profile a file** — Write a function that prints shape, dtypes, missing counts and duplicate-row count.
<details><summary>Solution</summary>

```python
def profile(df):
    print(df.shape)
    print(df.dtypes)
    print(df.isna().sum())
    print("duplicates:", df.duplicated().sum())
```

</details>

2. **Find impossible values** — Report rows where `files` is negative or `errors` exceeds `files`.
<details><summary>Solution</summary>

```python
bad = df[(df["files"] < 0) | (df["errors"] > df["files"])]
print(bad)
```

</details>

3. **Category audit** — List the distinct values of `state` with their counts, including missing.
<details><summary>Solution</summary>

```python
print(df["state"].value_counts(dropna=False))
```

</details>

### Interview Questions

**Q: What do you do first when handed a new dataset?**
I profile it before touching it: `shape`, `info()` for dtypes and non-null counts, `describe()` for numeric ranges, `value_counts()` on each category column, `isna().sum()` and `duplicated().sum()`. That takes two minutes and reveals numbers stored as text, dates that did not parse, sentinel values like 99999, inconsistent category spellings and duplicate keys. I write the findings down because they become the cleaning steps and the validation checks. On a title-insurance production export this routine caught that half the coverage values had been exported with a currency symbol and were strings.

**Q: Why does pandas report an integer column as float, and does it matter?**
NumPy's integer arrays cannot store a missing value, so when a column has any `NaN` pandas promotes it to `float64`. It matters because integer identifiers turn into `417.0`, joins against integer keys fail, and memory doubles. The fixes are the nullable integer dtype `Int64` (capital I), which supports `pd.NA`, either via `dtype={"errors": "Int64"}` at read time or `astype("Int64")` afterwards, or filling the missing values before casting when a default such as zero is legitimate.

**Q: How would you detect duplicate records in a production log?**
`df.duplicated().sum()` counts fully identical rows, but real duplicates are usually the same business key with different timestamps, so I check `df.duplicated(subset=["file"])` and inspect the groups with `keep=False` sorted by key. Then I decide the rule with the business: keep the latest by date (`sort_values("date").drop_duplicates("file", keep="last")`), keep the first, or flag them for review. I also add the duplicate count to the report's validation checks so a re-export that doubles rows is caught before it inflates totals.

## Selecting rows & columns (loc/iloc/boolean masks)

Selecting is the pandas equivalent of filtering in Excel, and it has two clear tools: `loc` for labels and `iloc` for positions. Boolean masks add conditions. Mastering the exact syntax removes the most common source of confusion for beginners and the `SettingWithCopyWarning` that follows them into intermediate work.

### Columns

```python
df["files"]                        # Series
df[["agent", "files"]]             # DataFrame with two columns
df.files                           # attribute access; avoid: fails for names with spaces or that clash with methods
df.select_dtypes(include="number") # all numeric columns
df.drop(columns=["status"])        # everything except
```

### loc: by label

`df.loc[row_labels, column_labels]`. Row labels are index values; with a RangeIndex they happen to be integers.

```python
df.loc[0]                          # row with label 0 → Series
df.loc[0:2]                        # labels 0, 1 and 2 — inclusive of the end
df.loc[0:2, ["agent", "files"]]    # rows and columns
df.loc[:, "files":"errors"]        # column range by name, inclusive
```

Label slices are **inclusive** at both ends, unlike Python lists.

### iloc: by position

`df.iloc[row_positions, column_positions]`, zero-based, exclusive end like Python.

```python
df.iloc[0]               # first row
df.iloc[-1]              # last row
df.iloc[0:3, 0:2]        # first three rows, first two columns
df.iloc[[0, 5, 10], :]   # specific positions
```

Use `iloc` for "the first ten rows" or "the last column"; use `loc` for everything with a name.

### Boolean masks

A comparison on a Series returns a boolean Series. Passing it to `loc` (or directly to `df[...]`) keeps the `True` rows.

```python
mask = df["state"] == "WY"
df.loc[mask]
df.loc[df["files"] >= 400, ["agent", "files"]]
df[(df["state"] == "WY") & (df["status"] == "Late")]      # AND
df[(df["state"] == "WY") | (df["state"] == "MT")]         # OR
df[~(df["status"] == "Complete")]                         # NOT
```

Three rules: use `&`, `|`, `~` (not `and`, `or`, `not`), wrap every comparison in parentheses because `&` binds tighter than `==`, and combine masks with matching indexes.

### Convenience filters

```python
df[df["state"].isin(["WY", "MT", "ID"])]
df[df["files"].between(300, 450)]                     # inclusive
df[df["agent"].str.startswith("S", na=False)]
df[df["errors"].isna()]
df.query("state == 'WY' and files >= 400")            # string expression
df.query("files >= @threshold")                       # @ references a Python variable
df.nlargest(5, "files")                               # top 5 rows
df.nsmallest(3, "rate")
```

`query` reads well for long conditions and is faster on big frames because it uses the `numexpr` engine when installed.

### Selecting single values

```python
df.loc[2, "files"]         # by label and column name
df.iloc[2, 3]              # by positions
df.at[2, "files"]          # fastest scalar access by label
df.iat[2, 3]               # fastest scalar access by position
```

### Assigning with loc

Selection and assignment go together. The correct way to set values for some rows is a single `loc` with both the row mask and the column:

```python
df.loc[df["files"] < 0, "files"] = 0
df.loc[df["state"] == "wy", "state"] = "WY"
```

The wrong way is chained indexing, `df[df["files"] < 0]["files"] = 0`, which selects a copy first and then assigns to it. pandas 2.x warns with `SettingWithCopyWarning` and may or may not modify `df`; pandas 3.x with copy-on-write never modifies the original. Always write `df.loc[mask, col] = value`.

### Copies and views

`sub = df[df["state"] == "WY"]` gives a new DataFrame. In pandas 3 (copy-on-write) it is always safe to modify `sub` without affecting `df`. In pandas 2 you should call `.copy()` explicitly when you intend to modify a filtered subset, so the code behaves the same on both versions.

| Need | Syntax |
|---|---|
| Rows by label | `df.loc[labels]` |
| Rows by position | `df.iloc[positions]` |
| Rows by condition | `df.loc[mask]` or `df[mask]` |
| Cells | `df.loc[label, col]`, `df.at[label, col]` |
| Assign to a subset | `df.loc[mask, col] = value` |

> **Warning:** `df.loc[0:5]` and `df.iloc[0:5]` return different things: `loc` includes label 5 (six rows), `iloc` stops before position 5 (five rows). After sorting or filtering, labels and positions no longer match, which is why mixing them causes silent off-by-one mistakes.

### Try It Yourself

```python
import io
import pandas as pd

raw = """date,state,agent,files,errors,status
2026-09-01,WY,Sana,412,9,Complete
2026-09-01,MT,Bilal,388,14,Complete
2026-09-02,WY,Hira,455,6,Late
2026-09-02,ID,Usman,301,12,QA
2026-09-03,MT,Bilal,-5,1,QA
2026-09-03,WY,Sana,430,4,Late
"""
df = pd.read_csv(io.StringIO(raw), parse_dates=["date"])

print(df.loc[0:2, ["agent", "files"]]); print()          # label slice, inclusive
print(df.iloc[-2:, :3]); print()                          # last two rows, first three columns
print(df[(df["state"] == "WY") & (df["status"] == "Late")]); print()
print(df.query("files >= 400 and state in ['WY', 'MT']")); print()
print(df.nlargest(2, "files")[["agent", "files"]]); print()

df = df.copy()
df.loc[df["files"] < 0, "files"] = 0                      # fix a bad value the safe way
print(df.loc[4])
print("cell via at:", df.at[2, "agent"])
```

### Quiz

1. `df.loc[0:3]` returns how many rows on a default RangeIndex?
- [ ] 3
- [x] 4
- [ ] 2
> Label slicing with loc is inclusive of both ends.

2. Which operator combines two boolean masks with AND?
- [ ] `and`
- [x] `&`
- [ ] `&&`
> Python's `and` does not work element-wise; pandas uses `&`, `|` and `~`, with parentheses around each comparison.

3. What is wrong with `df[df["files"] < 0]["files"] = 0`?
- [x] It is chained indexing that assigns to a copy and may not change `df`
- [ ] The comparison should use `<=`
- [ ] Nothing, it is the standard form
> Use `df.loc[df["files"] < 0, "files"] = 0`.

4. Which accessor selects by integer position?
- [ ] `loc`
- [x] `iloc`
- [ ] `at`
> iloc is positional; loc and at are label-based.

### Exercises

1. **Late Wyoming files** — Select agent and files for rows where state is WY and status is Late, sorted by files descending.
<details><summary>Solution</summary>

```python
out = df.loc[(df["state"] == "WY") & (df["status"] == "Late"), ["agent", "files"]]
print(out.sort_values("files", ascending=False))
```

</details>

2. **Fix casing** — Set any lower-case `wy` in `state` to `WY` without a warning.
<details><summary>Solution</summary>

```python
df.loc[df["state"].str.lower() == "wy", "state"] = "WY"
```

</details>

3. **Positional window** — Return rows 10 to 19 and the first four columns.
<details><summary>Solution</summary>

```python
window = df.iloc[10:20, :4]
```

</details>

### Interview Questions

**Q: Explain the difference between loc and iloc.**
`loc` selects by index labels and column names, with slices inclusive at both ends; `iloc` selects by integer positions with Python-style exclusive ends. On a fresh RangeIndex they look alike, but after filtering, sorting or setting an index the labels are no longer 0..n, so `loc[5]` means the row labelled 5 wherever it now sits, while `iloc[5]` means the sixth row. I use `loc` for anything with a meaning (a date, an ID, a column name) and `iloc` only for "first N" or "last" style positional access. Mixing them is the classic source of off-by-one bugs.

**Q: What is SettingWithCopyWarning and how do you avoid it?**
It is pandas 2.x warning that you assigned to a DataFrame that may be a temporary copy, typically from chained indexing such as `df[mask]["col"] = value`, so the assignment may not reach the original frame. The fix is a single `loc` call with both selectors: `df.loc[mask, "col"] = value`. When you deliberately work on a filtered subset, take an explicit `.copy()` so later assignments are unambiguous. pandas 3 removed the warning by making copy-on-write the rule: chained assignment simply never affects the original, so code must use `loc` to have the intended effect.

**Q: When do you use query instead of boolean indexing?**
For long conditions with several columns, `df.query("state == 'WY' and files >= 400 and status != 'Complete'")` is easier to read than the equivalent chain of parenthesised masks, and on large frames it can be faster because it evaluates with `numexpr` without building intermediate boolean arrays. It references Python variables with `@`. Its limits are that column names with spaces need backticks, complex string methods are awkward, and it cannot be used for assignment, so for assignment and for programmatic conditions built in code I return to `loc` with masks.

## Sorting & basic statistics

Once you can read and select data, the next questions are "in what order" and "how much". Sorting puts rows in a meaningful sequence for reports and for operations that depend on order, such as taking the latest status per file. Descriptive statistics summarise columns, and pandas provides them as methods that work on a Series, a whole DataFrame, or on each group later on.

### Sorting rows

```python
df.sort_values("files")                                 # ascending
df.sort_values("files", ascending=False)
df.sort_values(["state", "files"], ascending=[True, False])   # multi-key
df.sort_values("agent", key=lambda s: s.str.lower())    # case-insensitive
df.sort_values("errors", na_position="first")           # NaN first (default last)
df.sort_index()                                         # by the index
```

`sort_values` returns a new DataFrame. Use `inplace=True` sparingly; the modern style is reassignment (`df = df.sort_values(...)`), which chains and is clearer. The index keeps its old labels after sorting; add `.reset_index(drop=True)` when you want 0..n again.

### Ranking

```python
df["rank"] = df["files"].rank(ascending=False, method="min")   # 1 = most files; ties share the lowest rank
```

`method` accepts `average` (default), `min`, `max`, `first` and `dense`, matching Excel's `RANK.AVG`, `RANK.EQ` and the dense ranking that `RANK` cannot do.

### Statistics on columns

```python
df["files"].sum()
df["files"].mean()
df["files"].median()
df["files"].std()
df["files"].min(), df["files"].max()
df["files"].quantile([0.25, 0.5, 0.75, 0.9])
df["files"].idxmax()            # index label of the largest value
df.loc[df["files"].idxmax()]    # the whole row
df["state"].mode()
df[["files", "errors"]].sum()   # per column
df[["files", "errors"]].corr()  # correlation matrix
```

All of these skip `NaN` by default (`skipna=True`), which matches Excel's `AVERAGE`. Set `skipna=False` when a missing value should poison the result.

### Row-wise operations

```python
df[["files", "errors"]].sum(axis=1)     # per row
df[["q1", "q2", "q3", "q4"]].mean(axis="columns")
```

`axis=0` (or `"index"`) aggregates down a column; `axis=1` (or `"columns"`) across a row.

### Cumulative and running values

```python
df = df.sort_values("date")
df["cum_files"] = df["files"].cumsum()
df["running_max"] = df["files"].cummax()
df["pct_of_total"] = df["files"] / df["files"].sum()
```

### Counting and share

```python
df["state"].value_counts()
df["state"].value_counts(normalize=True).round(3)
(df["files"] >= 400).sum()      # count of rows meeting a condition
(df["files"] >= 400).mean()     # share of rows meeting it
```

Booleans sum as ones and zeros, so `.sum()` counts and `.mean()` gives a proportion. This is the pandas `COUNTIF` and it is used constantly.

### A weighted rate, correctly

The Excel course made the point that a team error rate is total errors divided by total files, not the average of per-agent rates:

```python
weighted = df["errors"].sum() / df["files"].sum()
unweighted = (df["errors"] / df["files"]).mean()
```

Report `weighted`. `numpy.average(values, weights=...)` computes general weighted averages.

### Rounding and formatting

```python
df["rate"].round(4)
df.round({"rate": 4, "premium": 2})
f"{df['files'].sum():,}"              # 1,255 as text for a message
df.style.format({"rate": "{:.2%}"})   # notebook display only
```

Keep full precision in the data and round at output, exactly as with Excel formats.

### Aggregation with agg

```python
df["files"].agg(["sum", "mean", "max"])
df.agg({"files": ["sum", "mean"], "errors": "sum"})
```

`agg` takes function names, callables or a dictionary, and it is the same interface that `groupby` uses, so learning it here pays off in the Intermediate level.

> **Tip:** `sort_values` then `drop_duplicates(keep="last")` is the pandas way to get "the latest row per key". Sort by date ascending, drop duplicates on the key keeping the last, and each file keeps only its most recent status.

### Try It Yourself

```python
import io
import pandas as pd

raw = """date,state,agent,file,files,errors,status
2026-09-01,WY,Sana,417,412,9,Complete
2026-09-01,MT,Bilal,418,388,14,Complete
2026-09-02,WY,Hira,419,455,6,Late
2026-09-02,ID,Usman,420,301,12,QA
2026-09-03,WY,Hira,419,455,6,Complete
2026-09-03,MT,Bilal,421,402,3,QA
"""
df = pd.read_csv(io.StringIO(raw), parse_dates=["date"])

print(df.sort_values(["state", "files"], ascending=[True, False])[["state", "agent", "files"]]); print()
print("files:", df["files"].agg(["sum", "mean", "median", "max"]).round(1).to_dict())
print("weighted rate:", round(df["errors"].sum() / df["files"].sum(), 4))
print("unweighted   :", round((df["errors"] / df["files"]).mean(), 4))
print("share >= 400 :", (df["files"] >= 400).mean())
print("busiest row  :", df.loc[df["files"].idxmax(), ["agent", "files"]].to_dict()); print()

df["rank"] = df["files"].rank(ascending=False, method="min").astype(int)
df = df.sort_values("date")
df["cum_files"] = df["files"].cumsum()
print(df[["date", "agent", "files", "rank", "cum_files"]]); print()

latest = df.sort_values("date").drop_duplicates("file", keep="last")
print(latest[["file", "date", "status"]].sort_values("file"))
```

### Quiz

1. `(df["files"] >= 400).mean()` returns?
- [ ] The mean of files above 400
- [x] The proportion of rows with files ≥ 400
- [ ] The count of such rows
> Booleans average as 1/0, giving a share; `.sum()` gives the count.

2. Which rank method matches Excel's `RANK.EQ`?
- [ ] `average`
- [x] `min`
- [ ] `dense`
> RANK.EQ gives tied values the lowest rank in the tie, like `method="min"`.

3. What does `axis=1` mean in `df.sum(axis=1)`?
- [x] Sum across columns, one result per row
- [ ] Sum down rows, one result per column
- [ ] Sum only the first column
> axis=0 aggregates each column; axis=1 aggregates each row.

4. How do you get the most recent row per file?
- [ ] `df.drop_duplicates("file")`
- [x] `df.sort_values("date").drop_duplicates("file", keep="last")`
- [ ] `df.groupby("file").first()`
> Sorting ascending then keeping the last duplicate retains the latest date per key.

### Exercises

1. **Top three per state** — Sort by state then files descending and show the top three rows overall by files.
<details><summary>Solution</summary>

```python
print(df.sort_values(["state", "files"], ascending=[True, False]))
print(df.nlargest(3, "files"))
```

</details>

2. **Share of total** — Add a column with each row's share of total files as a percentage rounded to one decimal.
<details><summary>Solution</summary>

```python
df["share_pct"] = (df["files"] / df["files"].sum() * 100).round(1)
```

</details>

3. **Percentiles** — Report the 10th, 50th and 90th percentiles of files.
<details><summary>Solution</summary>

```python
print(df["files"].quantile([0.1, 0.5, 0.9]))
```

</details>

### Interview Questions

**Q: How do you compute a count of rows matching a condition without a loop?**
Build the boolean mask and sum it: `(df["status"] == "Late").sum()`. Booleans are treated as 1 and 0 so the sum is the count and the mean is the proportion. For multiple conditions combine masks with `&` and `|`. This is the pandas `COUNTIFS`, and in a `groupby` the same expression gives the count per group. It is vectorised, so it is thousands of times faster than iterating rows, and it reads as the question being asked.

**Q: What is the difference between the rank methods?**
For tied values, `average` assigns the mean of the ranks they would occupy, `min` gives all of them the lowest rank (Excel's `RANK.EQ`), `max` the highest, `first` breaks ties by order of appearance, and `dense` is like `min` but the next distinct value gets the next integer with no gap. For a leaderboard where two agents tie for first I use `min` so both show 1 and the next shows 3, or `dense` if the business wants 1, 1, 2. Always pass `ascending=False` for "highest is rank 1".

**Q: Why should you be careful with mean of a ratio column?**
Because the mean of per-row ratios weights every row equally regardless of its size. Averaging each agent's error rate gives a number that can differ substantially from the team's true rate of total errors over total files, and the difference is larger when volumes vary. The correct aggregate is the ratio of sums, computed as `df["errors"].sum() / df["files"].sum()` or `np.average(rates, weights=files)`. In a groupby, compute sums per group first and divide afterwards rather than taking the mean of a rate column.

# LEVEL: Intermediate

## Missing data (isna/fillna/dropna)

Missing values are the normal state of real data: an agent field left blank, an error count not yet entered, a coverage amount the source system did not have. pandas represents missing data with `NaN` (a float), `NaT` for datetimes, `None` in object columns, and `pd.NA` in the nullable dtypes. How you treat them decides whether totals are right, so the choice must be deliberate, documented and consistent with what the report consumer expects.

### Detecting

```python
df.isna()                 # boolean DataFrame (alias: isnull)
df.notna()                # the inverse
df.isna().sum()           # per column
df.isna().any(axis=1)     # rows with any missing value
df[df["errors"].isna()]   # the affected rows
```

Note that an empty string `""` is **not** missing. Exports often use it, along with `-`, `N/A`, `NULL` or `?`. Convert those at read time with `na_values=[...]`, or afterwards with `df.replace({"": pd.NA, "-": pd.NA})`.

### Dropping

```python
df.dropna()                                  # any missing in any column → drop row
df.dropna(subset=["file", "date"])           # only if key fields are missing
df.dropna(how="all")                         # only rows that are entirely empty
df.dropna(axis=1, thresh=len(df) * 0.5)      # drop columns more than half empty
```

`dropna()` with no arguments is dangerous on wide tables: one optional column with a few blanks removes most rows. Always name the columns that must be present.

### Filling

```python
df["errors"] = df["errors"].fillna(0)                        # a default
df["agent"] = df["agent"].fillna("Unassigned")
df["coverage"] = df["coverage"].fillna(df["coverage"].median())
df = df.fillna({"errors": 0, "agent": "Unassigned"})          # per column in one call
df["status"] = df["status"].ffill()                           # forward fill (previous value)
df["status"] = df["status"].bfill()                           # backward fill
```

`ffill` is the fix for spreadsheets where a value is written once and the cells below are left blank because they "obviously" belong to the same state, the same problem as merged cells in Excel. `fillna(method="ffill")` was removed in pandas 3.0; use the `ffill()` method.

Filling within groups keeps values from leaking across boundaries:

```python
df["rate"] = df.groupby("state")["rate"].transform(lambda s: s.fillna(s.median()))
```

### Interpolation

For numeric series with an order, `interpolate()` estimates missing values from neighbours: `df["reading"].interpolate(method="linear")`, or `method="time"` on a datetime index. Suitable for sensor-like data; not for counts of files.

### Nullable dtypes

NumPy integers cannot hold `NaN`, which is why an integer column with blanks becomes float. pandas' nullable types fix this:

```python
df["errors"] = df["errors"].astype("Int64")     # capital I: integer with pd.NA
df["late"] = df["late"].astype("boolean")       # three-valued boolean
df["agent"] = df["agent"].astype("string")      # pandas 2: string dtype; pandas 3: default "str"
```

Comparisons with `pd.NA` return `pd.NA`, not `False`, so masks on nullable columns need `.fillna(False)` before use in `loc`.

### How aggregations treat missing values

| Operation | Behaviour |
|---|---|
| `sum`, `mean`, `min`, `max` | Skip NaN (`skipna=True`) |
| `count` | Counts non-missing only |
| `size` / `len` | Counts all rows |
| Arithmetic (`a + b`) | Any NaN → NaN |
| `groupby` keys | NaN keys dropped unless `dropna=False` |
| `value_counts` | Drops NaN unless `dropna=False` |
| `==` comparison | `NaN == NaN` is False; use `isna()` |

The last line is the trap that catches everyone once: you cannot find missing values with `df["x"] == np.nan`.

### Reporting missingness

A data-quality section in a weekly report should state how many values were missing and what was done:

```python
missing = df.isna().sum()
report = missing[missing > 0].rename("missing").to_frame()
report["share"] = (report["missing"] / len(df)).round(3)
```

Keep an `imputed` flag column when you fill important fields, so analyses can exclude imputed rows later:

```python
df["errors_imputed"] = df["errors"].isna()
df["errors"] = df["errors"].fillna(0)
```

> **Warning:** `fillna(0)` on a field that is genuinely unknown turns "we do not know" into "zero", and the team error rate silently improves. Fill with zero only when blank truly means none, and say so in the report notes.

### Try It Yourself

```python
import io
import pandas as pd

raw = """date,state,agent,file,files,errors,coverage
2026-09-01,WY,Sana,417,412,9,187450
2026-09-01,,Bilal,418,388,,250000
2026-09-02,WY,,419,455,6,-
2026-09-02,,Usman,420,301,N/A,120500
2026-09-03,MT,Bilal,,402,3,
"""
df = pd.read_csv(io.StringIO(raw), parse_dates=["date"], na_values=["N/A", "-"])
print(df); print()
print(df.isna().sum()); print()

clean = df.copy()
clean["state"] = clean["state"].ffill()                 # blanks mean "same as above"
clean["errors_imputed"] = clean["errors"].isna()
clean["errors"] = clean["errors"].fillna(0).astype("Int64")
clean["agent"] = clean["agent"].fillna("Unassigned")
clean["coverage"] = clean["coverage"].fillna(clean["coverage"].median())
clean = clean.dropna(subset=["file"])                   # a row without a file number is unusable
clean["file"] = clean["file"].astype(int)

print(clean); print()
print(clean.dtypes); print()
print("rows kept:", len(clean), "of", len(df))
print("imputed errors:", clean["errors_imputed"].sum())
print("NaN == NaN is", float("nan") == float("nan"))
```

### Quiz

1. How do you find missing values in a column?
- [ ] `df["x"] == np.nan`
- [x] `df["x"].isna()`
- [ ] `df["x"] is None`
> NaN is not equal to itself, so equality tests fail; isna() is the correct test.

2. What does `df.dropna()` with no arguments do?
- [x] Drops every row with a missing value in any column
- [ ] Drops columns that are all missing
- [ ] Fills missing values with zero
> Always pass `subset=` to limit it to the columns that must be present.

3. Which dtype holds integers with missing values?
- [ ] `int64`
- [x] `Int64`
- [ ] `float64` only
> The nullable `Int64` (capital I) supports pd.NA; NumPy int64 cannot.

4. Which method replaces a blank with the previous row's value?
- [ ] `fillna(0)`
- [x] `ffill()`
- [ ] `interpolate()`
> Forward fill propagates the last valid value downward, like un-merging Excel cells.

### Exercises

1. **Safe drop** — Remove rows missing a file number or a date, but keep rows missing errors.
<details><summary>Solution</summary>

```python
df = df.dropna(subset=["file", "date"])
```

</details>

2. **Group median fill** — Fill missing coverage with the median coverage of the same state.
<details><summary>Solution</summary>

```python
df["coverage"] = df.groupby("state")["coverage"].transform(lambda s: s.fillna(s.median()))
```

</details>

3. **Missingness report** — Produce a table of columns with missing counts and shares, sorted descending.
<details><summary>Solution</summary>

```python
m = df.isna().sum()
rep = m[m > 0].sort_values(ascending=False).to_frame("missing")
rep["share"] = (rep["missing"] / len(df)).round(3)
print(rep)
```

</details>

### Interview Questions

**Q: How do you decide whether to drop or fill missing values?**
It depends on what the blank means and what the analysis needs. If a key field like the file number or date is missing, the row cannot be attributed and I drop it, recording the count. If a blank means "none" by business definition, such as no errors recorded for a completed QA check, I fill zero and note it. If the value is unknown but the row is otherwise useful, I fill with a group-level statistic or leave it missing and let `mean`/`sum` skip it, and I keep an `_imputed` flag so anyone can exclude those rows. I never call `dropna()` without `subset`, and I always report the missingness in the deliverable.

**Q: Why does an integer column become float when it has missing values, and how do you avoid it?**
NumPy's integer arrays have no representation for a missing value, so pandas upcasts the whole column to `float64` where `NaN` is available. This turns IDs into `417.0` and breaks joins with integer keys. The solution is the nullable extension dtype `Int64`, set at read time with `dtype={"errors": "Int64"}` or later with `astype("Int64")`, which stores integers plus a mask and uses `pd.NA`. The trade-off is that comparisons return `pd.NA` for missing entries and some libraries expect NumPy dtypes, so I convert back when handing data to them.

**Q: What is the difference between NaN, None, NaT and pd.NA?**
`NaN` is a float value from IEEE arithmetic, used by NumPy-backed float columns and as the generic missing marker. `None` is Python's null and appears in object columns. `NaT` is "not a time", the missing marker for datetime and timedelta dtypes. `pd.NA` is pandas' own scalar used by the nullable extension dtypes (`Int64`, `boolean`, `string`), and it propagates through comparisons as unknown rather than False. `isna()` recognises all four, which is why it is the only reliable test.

## Data types & conversions (astype, to_datetime, to_numeric)

Every column has a dtype, and most cleaning is getting dtypes right: numbers that arrived as strings, dates that arrived as text, booleans written as `Y`/`N`, identifiers that must stay text. The right dtype makes operations correct (dates subtract, numbers sum), fast (numeric arrays instead of Python objects) and small (a category instead of repeated strings).

### The dtypes you will meet

| dtype | Holds | Notes |
|---|---|---|
| `int64`, `float64` | Numbers | NumPy-backed; int cannot hold NaN |
| `Int64`, `Float64`, `boolean` | Numbers/booleans with `pd.NA` | Nullable extension types |
| `object` | Anything (pandas 2 default for text) | Slow, large |
| `str` / `string` | Text | Default in pandas 3; `string` dtype in pandas 2 |
| `datetime64[ns]` | Timestamps | `[us]`, `[ms]`, `[s]` resolutions allowed since 2.0 |
| `timedelta64[ns]` | Durations | Result of subtracting dates |
| `category` | Repeated labels | Small and fast for groupby |
| `bool` | True/False | Cannot hold missing |

### astype

```python
df["files"] = df["files"].astype(int)
df["coverage"] = df["coverage"].astype(float)
df["file"] = df["file"].astype(str).str.zfill(5)      # 417 → "00417"
df["state"] = df["state"].astype("category")
df = df.astype({"files": "int64", "errors": "Int64"})
```

`astype` raises `ValueError` if any value cannot be converted, which is a feature: it points at the dirty value.

### to_numeric

`pd.to_numeric` converts strings to numbers and handles bad values:

```python
pd.to_numeric(df["coverage"], errors="coerce")     # invalid → NaN
pd.to_numeric(df["coverage"], errors="raise")      # default: stop on the first bad value
pd.to_numeric(df["files"], downcast="integer")     # smallest int type that fits
```

Cleaning currency text first: `df["coverage"].str.replace(r"[$,]", "", regex=True)` then `to_numeric`. After `errors="coerce"`, count the new `NaN`s so you know how many values were unparsable.

### to_datetime

```python
pd.to_datetime(df["date"])                                   # ISO strings parse automatically
pd.to_datetime(df["date"], format="%d/%m/%Y")               # explicit, fast, unambiguous
pd.to_datetime(df["date"], dayfirst=True)
pd.to_datetime(df["date"], errors="coerce")                 # bad → NaT
pd.to_datetime(df["stamp"], unit="s")                       # Unix seconds
pd.to_datetime(df[["year", "month", "day"]])                # from parts
pd.to_datetime(df["excel_serial"], unit="D", origin="1899-12-30")   # Excel serial → date
```

pandas 2.0 infers one format from the first value and applies it to the whole column; a column mixing `01/02/2026` and `2026-02-01` raises unless you pass `format="mixed"`. Always pass `format=` for exports whose layout you know. The Excel serial conversion uses origin `1899-12-30` because of Excel's 1900 leap-year bug.

### Booleans and mapping

```python
df["late"] = df["status"].eq("Late")
df["active"] = df["active"].map({"Y": True, "N": False})
df["active"] = df["active"].str.upper().isin(["Y", "YES", "TRUE", "1"])
```

### Strings and identifiers

Identifiers must stay text. Read them with `dtype={"file": str}`; if they already lost zeros, restore with `str.zfill(width)`. Postal codes, policy numbers and agent IDs are the usual victims.

### Inferring and converting in bulk

```python
df = df.convert_dtypes()      # best nullable dtypes for each column
df.infer_objects()            # object columns that are really numeric
```

`convert_dtypes()` is a good final step after cleaning: integers with blanks become `Int64`, text becomes `string`, and booleans become `boolean`.

### Memory downcasting

```python
for col in df.select_dtypes("int64"):
    df[col] = pd.to_numeric(df[col], downcast="integer")
for col in df.select_dtypes("float64"):
    df[col] = pd.to_numeric(df[col], downcast="float")
```

On a multi-million-row frame this can halve memory. `category` for low-cardinality text (state, status, agent) does even more; the Advanced level covers it.

### A conversion recipe

```python
def coerce_types(df):
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d", errors="coerce")
    df["coverage"] = pd.to_numeric(df["coverage"].astype(str).str.replace(r"[$,]", "", regex=True), errors="coerce")
    df["files"] = pd.to_numeric(df["files"], errors="coerce").astype("Int64")
    df["file"] = df["file"].astype(str).str.zfill(5)
    df["state"] = df["state"].str.strip().str.upper().astype("category")
    return df
```

Then assert: `assert df["date"].isna().sum() == 0`.

> **Tip:** Convert with `errors="coerce"`, then immediately count the resulting `NaN`/`NaT` and look at the original values that produced them. Coercion without inspection is how a thousand rows lose their coverage amount without anyone noticing.

### Try It Yourself

```python
import io
import pandas as pd

raw = """date,state,file,files,coverage,active,excel_date
16/09/2026,wy ,417,412,"$187,450",Y,46281
17/09/2026,MT,418,388,"250,000",N,46282
18/09/2026,WY,419,455,n/a,Y,46283
bad date,ID,420,301,"120,500.50",yes,46284
"""
df = pd.read_csv(io.StringIO(raw), dtype=str)
print(df.dtypes); print()

df["date"] = pd.to_datetime(df["date"], format="%d/%m/%Y", errors="coerce")
df["coverage"] = pd.to_numeric(df["coverage"].str.replace(r"[$,]", "", regex=True), errors="coerce")
df["files"] = pd.to_numeric(df["files"]).astype("Int64")
df["file"] = df["file"].str.zfill(5)
df["state"] = df["state"].str.strip().str.upper().astype("category")
df["active"] = df["active"].str.upper().isin(["Y", "YES"])
df["excel_date"] = pd.to_datetime(pd.to_numeric(df["excel_date"]), unit="D", origin="1899-12-30")

print(df); print()
print(df.dtypes); print()
print("unparsable dates:", df["date"].isna().sum())
print("unparsable coverage:", df["coverage"].isna().sum())
print("days between first two:", (df.loc[1, "date"] - df.loc[0, "date"]).days)
```

### Quiz

1. What does `errors="coerce"` do in `to_numeric`?
- [ ] Raises on the first bad value
- [x] Turns unparsable values into NaN
- [ ] Skips the row
> Coerce converts what it can and marks the rest missing; always count the NaNs afterwards.

2. Why pass `format=` to `to_datetime`?
- [x] It is unambiguous and faster than inference
- [ ] It is required in every call
- [ ] It converts Excel serials
> Inference guesses from the first value; an explicit format avoids day/month swaps.

3. Which origin converts Excel date serials correctly?
- [ ] `1900-01-01`
- [x] `1899-12-30`
- [ ] `1970-01-01`
> Excel's 1900 leap-year bug shifts the epoch by two days.

4. How do you restore lost leading zeros on a 5-digit code?
- [ ] `astype(int)`
- [x] `astype(str).str.zfill(5)`
- [ ] `round(5)`
> zfill pads with zeros on the left to the given width.

### Exercises

1. **Currency column** — Convert `"$1,234.50"` strings to floats and report how many failed.
<details><summary>Solution</summary>

```python
clean = pd.to_numeric(df["amount"].str.replace(r"[$,]", "", regex=True), errors="coerce")
print("failed:", clean.isna().sum() - df["amount"].isna().sum())
df["amount"] = clean
```

</details>

2. **Mixed date formats** — A column contains both `2026-09-16` and `16/09/2026`. Parse it.
<details><summary>Solution</summary>

```python
a = pd.to_datetime(df["d"], format="%Y-%m-%d", errors="coerce")
b = pd.to_datetime(df["d"], format="%d/%m/%Y", errors="coerce")
df["d"] = a.fillna(b)
```

</details>

3. **Downcast** — Reduce memory of all numeric columns without losing values.
<details><summary>Solution</summary>

```python
for c in df.select_dtypes("integer"):
    df[c] = pd.to_numeric(df[c], downcast="integer")
for c in df.select_dtypes("floating"):
    df[c] = pd.to_numeric(df[c], downcast="float")
print(df.memory_usage(deep=True).sum())
```

</details>

### Interview Questions

**Q: How do you convert a messy column of amounts like `$1,234`, `n/a` and blanks to numbers safely?**
Strip the formatting with a regex replace of `[$,]`, then `pd.to_numeric(..., errors="coerce")` so non-numeric tokens become `NaN` rather than crashing. Immediately compare the count of `NaN` before and after to know how many values were unparsable, and inspect those originals with a mask so an unexpected token such as `1.234,50` (European format) is caught and handled rather than lost. I wrap this in a function used for every load so the behaviour is identical each week, and I assert the failure count is below a threshold.

**Q: What changed in date parsing in pandas 2.0 and why does it matter?**
pandas 2.0 stopped parsing each string independently; it infers a format from the first non-null value and applies it to the entire column, raising if later values do not match. That made parsing much faster and stopped silent day/month swaps within one column, but it broke code that relied on mixed formats. The fix is to pass `format=` explicitly, use `format="mixed"` when the data really is mixed, or parse with several explicit formats and combine with `fillna`. 2.0 also allowed non-nanosecond resolutions such as `datetime64[s]`, which matters when reading Parquet or Arrow data.

**Q: Why keep identifiers as strings?**
Because they are labels, not quantities: arithmetic on them is meaningless, leading zeros are significant, and some contain letters or hyphens. If pandas guesses integer, `00417` becomes `417`, joins against the source system's text keys fail, and Excel exports show numbers where codes are expected. I read them with `dtype={"file": str}`, restore zeros with `zfill` where damage already happened, and convert to `category` if the column is large and repetitive.

## String methods (.str) & cleaning

Text columns need the same surgery in pandas as in Excel, and the `.str` accessor provides it: every Python string method plus regular expressions, applied to a whole column at once, skipping missing values. This chapter covers the operations that turn exported names, codes and statuses into consistent keys you can group and join on.

### The accessor

```python
s = df["agent"]
s.str.strip()            # whitespace both ends
s.str.lower(), s.str.upper(), s.str.title()
s.str.len()
s.str.replace("  ", " ", regex=False)
s.str.contains("Late", case=False, na=False)     # boolean mask; na= handles missing
s.str.startswith("WY"), s.str.endswith("A")
s.str.slice(0, 2)  or  s.str[0:2]                # first two characters
s.str.zfill(5), s.str.pad(8, side="left", fillchar="0")
s.str.cat(df["state"], sep=" - ")                # join columns
```

`.str` works on `object`, `string` and `str` columns; on a numeric column it raises `AttributeError`, so cast first with `astype(str)`.

### Splitting

```python
df["last"]  = df["name"].str.split(",").str[0].str.strip()
df["first"] = df["name"].str.split(",").str[1].str.strip()
parts = df["code"].str.split("-", expand=True)          # DataFrame with one column per piece
parts.columns = ["state", "number", "year"]
df = df.join(parts)
df["number"] = df["code"].str.split("-", n=1).str[1]   # split at most once
```

`expand=True` is the pandas `TEXTSPLIT`. `str.rsplit` splits from the right, and `str.partition` returns the piece before, the separator and after.

### Regular expressions

```python
df["code"].str.extract(r"^([A-Z]{2})-(\d{5})-(\d{4})$")          # capture groups → columns
df["code"].str.extract(r"(?P<state>[A-Z]{2})-(?P<num>\d+)")     # named groups become column names
df["notes"].str.findall(r"\d{5}")                               # all matches as lists
df["notes"].str.count(r"\d")
df["phone"].str.replace(r"\D", "", regex=True)                  # keep digits only
df["code"].str.match(r"^[A-Z]{2}-\d{5}")                        # anchored at start
df["code"].str.fullmatch(r"[A-Z]{2}-\d{5}-\d{4}")               # whole string must match
```

`extract` is the workhorse for pulling structured pieces out of semi-structured text: policy numbers from descriptions, counties from addresses, error codes from log lines. A non-matching row returns `NaN` in every group.

### Normalising categories

```python
df["state"] = df["state"].str.strip().str.upper()
df["status"] = (df["status"].str.strip().str.lower()
                .map({"complete": "Complete", "completed": "Complete", "done": "Complete",
                      "late": "Late", "qa": "QA", "in qa": "QA"})
                .fillna("Unknown"))
```

A mapping dictionary is the transparent, reviewable way to standardise variants. Alternatively `str.replace` with a regex for patterns, and `value_counts()` before and after to verify.

### Removing non-printing characters

Web pastes and PDFs bring non-breaking spaces (`\xa0`), zero-width spaces (`​`) and line feeds:

```python
df["agent"] = (df["agent"]
               .str.replace("\xa0", " ", regex=False)
               .str.replace(r"[​\r\n\t]", "", regex=True)
               .str.replace(r"\s+", " ", regex=True)
               .str.strip())
```

`str.normalize("NFKC")` folds Unicode variants (full-width digits, ligatures) into standard forms, which fixes lookups that fail because two strings look identical but are not.

### Case-insensitive matching and accents

```python
df[df["agent"].str.casefold() == "sana"]
df["name"].str.normalize("NFKD").str.encode("ascii", "ignore").str.decode("ascii")   # strip accents
```

### Performance notes

`.str` methods loop in Python under the hood on `object` columns, so they are slower than numeric operations. On pandas 3 (or pandas 2 with `pd.options.future.infer_string = True`), string columns use Arrow-backed storage and most `.str` operations are several times faster. For a fixed set of replacements over millions of rows, convert to `category` first and operate on the categories: `df["state"].cat.rename_categories(str.upper)` touches each distinct value once instead of every row.

### Building keys for joins

A join key must match exactly on both sides. Build it the same way on both tables:

```python
def key(s):
    return s.astype(str).str.strip().str.upper().str.replace(r"\s+", " ", regex=True)
prod["state_key"] = key(prod["state"])
rates["state_key"] = key(rates["state"])
```

> **Interview note:** "How would you extract the county from an address column?" expects `str.extract` with a regex and a fallback plan for non-matching rows, not a loop with `split`.

### Try It Yourself

```python
import io
import pandas as pd

raw = """name,code,status,notes
"Raza, Ali ","wy-00417-2026","complete","Files 00417 and 00418 reviewed"
"KHAN, sana","MT-00418-2026","Done","re-check 00418"
"Ahmed,  Bilal","id-0042-2026","in QA",""
"Malik, Hira","WY-00420-2026","LATE","escalated 00420, 00421"
"""
df = pd.read_csv(io.StringIO(raw), dtype=str)

df["last"]  = df["name"].str.split(",").str[0].str.strip().str.title()
df["first"] = df["name"].str.split(",").str[1].str.strip().str.title()
parts = df["code"].str.upper().str.extract(r"^(?P<state>[A-Z]{2})-(?P<num>\d{5})-(?P<year>\d{4})$")
df = df.join(parts)
df["valid_code"] = df["code"].str.upper().str.fullmatch(r"[A-Z]{2}-\d{5}-\d{4}")

status_map = {"complete": "Complete", "done": "Complete", "in qa": "QA", "late": "Late"}
df["status"] = df["status"].str.strip().str.lower().map(status_map).fillna("Unknown")
df["file_refs"] = df["notes"].fillna("").str.findall(r"\d{5}")

print(df[["first", "last", "state", "num", "year", "valid_code", "status", "file_refs"]])
print()
print(df["status"].value_counts())
```

### Quiz

1. What does `df["name"].str.split(",", expand=True)` return?
- [ ] A Series of lists
- [x] A DataFrame with one column per piece
- [ ] A single string
> Without expand you get lists; with expand=True the pieces become columns.

2. Which method pulls regex capture groups into columns?
- [ ] `str.contains`
- [x] `str.extract`
- [ ] `str.match`
> extract returns one column per group; match and contains return booleans.

3. Why pass `na=False` to `str.contains`?
- [x] So missing values become False and the result can be used as a mask
- [ ] To speed it up
- [ ] To make it case-insensitive
> Without it, NaN rows return NaN and indexing with the mask raises.

4. What does `str.fullmatch` require?
- [ ] The pattern at the start of the string
- [x] The pattern to match the entire string
- [ ] The pattern anywhere in the string
> match anchors at the start; fullmatch anchors both ends; contains searches anywhere.

### Exercises

1. **Clean names** — Turn `"  raza,ali "` style names into `"Ali Raza"`.
<details><summary>Solution</summary>

```python
parts = df["name"].str.split(",", expand=True)
df["full"] = (parts[1].str.strip().str.title() + " " + parts[0].str.strip().str.title())
```

</details>

2. **Validate codes** — Flag codes not matching `XX-00000-0000` and list them.
<details><summary>Solution</summary>

```python
ok = df["code"].str.upper().str.fullmatch(r"[A-Z]{2}-\d{5}-\d{4}").fillna(False)
print(df.loc[~ok, "code"])
```

</details>

3. **Digits only** — Normalise phone numbers to digits and check they are 10 or 11 long.
<details><summary>Solution</summary>

```python
digits = df["phone"].astype(str).str.replace(r"\D", "", regex=True)
df["phone_ok"] = digits.str.len().between(10, 11)
```

</details>

### Interview Questions

**Q: How do you standardise a category column with many spelling variants?**
First `value_counts()` to see every variant, then normalise the obvious noise with `str.strip().str.lower()` and collapse internal whitespace. Then a mapping dictionary from each normalised variant to the canonical label, applied with `map`, with `fillna("Unknown")` so unmapped values are visible rather than silently dropped. I keep the dictionary in the code or a small lookup table so reviewers can see every rule, and I compare `value_counts()` before and after. For fuzzy variants such as typos I may use `difflib` or `rapidfuzz` to propose matches, but the final mapping is always explicit.

**Q: Why are string operations slow in pandas and what can you do about it?**
In pandas 2 text is stored as Python objects in an `object` array, so every `.str` method loops in Python, one string at a time. Options are enabling the Arrow-backed string dtype (`pd.options.future.infer_string = True`, or simply pandas 3 where it is the default), which vectorises most operations in C; converting low-cardinality columns to `category` and transforming the categories rather than the rows; avoiding repeated `.str` chains by combining regexes; and doing heavy text parsing once at load and saving Parquet. On a 5-million-row log, moving state and status to category and using Arrow strings for notes reduced a cleaning step from minutes to seconds.

**Q: Give an example of extracting structured fields from free text.**
A title-search log had a notes column with entries like `Escalated file WY-00417-2026 to QA on 16/09`. `str.extract(r"(?P<state>[A-Z]{2})-(?P<num>\d{5})-(?P<year>\d{4})")` pulled the code into three columns, `str.extract(r"on (\d{2}/\d{2})")` pulled the date fragment, and `str.contains("Escalated")` created a flag. Rows with no match came back as `NaN`, which I counted and sampled to refine the regex. The result joined cleanly to the production table on the extracted file number.

## GroupBy & aggregation (agg/transform)

`groupby` is the PivotTable of pandas and the most important method after selection. It splits a DataFrame into groups by one or more keys, applies a function to each group, and combines the results. Understanding the three combine shapes, one row per group (`agg`), one row per input row (`transform`), and anything (`apply`), lets you express every summary a report needs.

### Basic aggregation

```python
df.groupby("state")["files"].sum()                       # Series indexed by state
df.groupby("state")[["files", "errors"]].sum()           # DataFrame
df.groupby(["state", "agent"])["files"].sum()            # MultiIndex
df.groupby("state").size()                               # rows per group (includes NaN values)
df.groupby("state")["agent"].nunique()                   # distinct agents per state
df.groupby("state", as_index=False)["files"].sum()       # keys as columns, not index
```

Common aggregations: `sum`, `mean`, `median`, `min`, `max`, `count`, `nunique`, `first`, `last`, `std`, `var`, `size`, `any`, `all`, `quantile`.

### agg: several statistics at once

```python
df.groupby("state").agg(
    files=("files", "sum"),
    errors=("errors", "sum"),
    agents=("agent", "nunique"),
    avg_files=("files", "mean"),
    max_day=("date", "max"),
)
```

This **named aggregation** syntax (pandas 0.25+) produces flat, readable column names. The older dictionary form `agg({"files": ["sum", "mean"]})` gives a two-level column header that you then flatten with `summary.columns = ["_".join(c) for c in summary.columns]`.

Custom functions work too: `agg(p90=("files", lambda s: s.quantile(0.9)))`, at Python speed.

### Ratios of sums

The weighted error rate per state is computed from the aggregated sums, never by averaging a rate column:

```python
g = df.groupby("state").agg(files=("files", "sum"), errors=("errors", "sum"))
g["rate"] = g["errors"] / g["files"]
```

### transform: group statistics on every row

`transform` returns a result aligned to the original rows, which is how you add "share of state total" or "difference from agent average" columns:

```python
df["state_total"] = df.groupby("state")["files"].transform("sum")
df["share"] = df["files"] / df["state_total"]
df["vs_agent_avg"] = df["files"] - df.groupby("agent")["files"].transform("mean")
df["rank_in_state"] = df.groupby("state")["files"].rank(ascending=False, method="min")
df["cum_by_agent"] = df.sort_values("date").groupby("agent")["files"].cumsum()
```

`transform` with a string uses fast built-ins; with a lambda it calls Python per group.

### filter: keep whole groups

```python
big = df.groupby("agent").filter(lambda g: g["files"].sum() >= 1000)
```

Keeps every row of agents whose total is at least 1,000.

### apply: arbitrary per-group logic

```python
def top_day(g):
    return g.loc[g["files"].idxmax(), ["date", "files"]]
df.groupby("agent").apply(top_day, include_groups=False)
```

`apply` is flexible but slow and its output shape depends on what the function returns; prefer `agg`/`transform` when they fit. `include_groups=False` (2.2+) stops the deprecated behaviour of passing the grouping columns into the function.

### Grouping by dates and bins

```python
df.groupby(df["date"].dt.to_period("M"))["files"].sum()          # by month
df.groupby(pd.Grouper(key="date", freq="W-MON"))["files"].sum()  # weekly buckets starting Monday
df.groupby(pd.cut(df["coverage"], bins=[0, 100_000, 250_000, 1e9]))["files"].count()   # bands
```

### Missing keys and categoricals

Rows whose key is `NaN` are dropped unless `dropna=False`. Grouping a `category` column returns every category, even empty ones, unless `observed=True`; pandas 2.1+ warns and pandas 3 defaults to `observed=True`.

### Iterating groups

```python
for state, g in df.groupby("state"):
    g.to_csv(f"production_{state}.csv", index=False)
```

That loop is how one export becomes one file per state, the pandas version of the VBA "sheet per state" macro.

### Multi-key results

A two-key groupby returns a MultiIndex. `reset_index()` flattens it to columns; `unstack()` turns the inner key into columns, producing a state-by-month matrix, which is the pivot table of the next level.

| Want | Use |
|---|---|
| One row per group | `agg` |
| Same rows, group value attached | `transform` |
| Keep or drop whole groups | `filter` |
| Anything else | `apply` |

> **Tip:** Name your aggregations. `agg(files=("files", "sum"))` produces a column called `files`; the unnamed form produces `('files', 'sum')` tuples that need flattening and confuse `to_excel`.

### Try It Yourself

```python
import io
import pandas as pd

raw = """date,state,agent,files,errors
2026-09-01,WY,Sana,412,9
2026-09-01,MT,Bilal,388,14
2026-09-02,WY,Hira,455,6
2026-09-02,ID,Usman,301,12
2026-09-03,WY,Sana,430,4
2026-09-03,MT,Bilal,402,3
2026-09-08,WY,Hira,470,5
2026-09-08,MT,Usman,350,7
"""
df = pd.read_csv(io.StringIO(raw), parse_dates=["date"])

summary = df.groupby("state").agg(
    files=("files", "sum"), errors=("errors", "sum"),
    agents=("agent", "nunique"), days=("date", "nunique"),
)
summary["rate"] = (summary["errors"] / summary["files"]).round(4)
print(summary.sort_values("files", ascending=False)); print()

df["state_total"] = df.groupby("state")["files"].transform("sum")
df["share"] = (df["files"] / df["state_total"]).round(3)
df["rank_in_state"] = df.groupby("state")["files"].rank(ascending=False, method="min").astype(int)
print(df[["state", "agent", "files", "state_total", "share", "rank_in_state"]]); print()

weekly = df.groupby(pd.Grouper(key="date", freq="W-SUN"))["files"].sum()
print(weekly); print()

busy = df.groupby("agent").filter(lambda g: g["files"].sum() >= 800)
print("agents with >= 800 files:", sorted(busy["agent"].unique()))
```

### Quiz

1. Which method returns one value per original row, aligned to the frame?
- [ ] `agg`
- [x] `transform`
- [ ] `filter`
> transform broadcasts the group result back to every row of the group.

2. How do you compute a correct error rate per state?
- [ ] `groupby("state")["rate"].mean()`
- [x] Sum errors and files per state, then divide
- [ ] `groupby("state")["rate"].sum()`
> Averaging a rate column ignores volume; the ratio of sums is volume-weighted.

3. What does `groupby("state").size()` count that `["files"].count()` does not?
- [x] Rows with missing files
- [ ] Nothing, they are identical
- [ ] Distinct states
> size counts all rows in the group; count counts non-missing values of the column.

4. Which syntax produces flat, named output columns?
- [ ] `agg({"files": ["sum", "mean"]})`
- [x] `agg(total=("files", "sum"), avg=("files", "mean"))`
- [ ] `agg("sum", "mean")`
> Named aggregation maps output names to (column, function) pairs.

### Exercises

1. **Agent scorecard** — For each agent: total files, total errors, error rate, days worked, best day's files.
<details><summary>Solution</summary>

```python
sc = df.groupby("agent").agg(files=("files","sum"), errors=("errors","sum"),
                             days=("date","nunique"), best_day=("files","max"))
sc["rate"] = sc["errors"] / sc["files"]
```

</details>

2. **Share within month** — Add each row's share of its state's monthly total.
<details><summary>Solution</summary>

```python
month = df["date"].dt.to_period("M")
df["share_month"] = df["files"] / df.groupby(["state", month])["files"].transform("sum")
```

</details>

3. **One CSV per state** — Write a separate file for each state.
<details><summary>Solution</summary>

```python
for state, g in df.groupby("state"):
    g.to_csv(f"production_{state}.csv", index=False)
```

</details>

### Interview Questions

**Q: Explain split-apply-combine and the difference between agg, transform and apply.**
`groupby` splits rows into groups by key, applies a function per group, and combines the results. `agg` reduces each group to one row, giving a summary table like a PivotTable. `transform` applies a function per group but returns a result the same length as the input, aligned to the original index, which is how you attach group totals or z-scores to each row. `apply` passes each group's DataFrame to an arbitrary function and combines whatever comes back, so it is the most flexible and the slowest, and its output shape is only predictable if the function is consistent. I reach for `agg` and `transform` first because they use optimised C paths for built-in functions, and use `apply` only for logic that cannot be expressed otherwise.

**Q: How would you compute each agent's share of their state's total files?**
With `transform`: `df["files"] / df.groupby("state")["files"].transform("sum")`. The transform returns the state total on every row, so the division is row-aligned and needs no merge. If the share needs a second key, such as state and month, group by both. The alternative of aggregating and merging back works but is longer, and the loop version is both slow and error-prone. I then validate that shares within each state sum to one with `df.groupby("state")["share"].sum()`.

**Q: What performance pitfalls exist with groupby?**
Lambdas in `agg`, `transform` and `apply` run in Python per group, so on a million groups they are slow; built-in string names (`"sum"`, `"mean"`) use Cython paths and are orders of magnitude faster. Grouping by object-dtype strings is slower than by `category` or integers. `apply` returning DataFrames triggers expensive concatenation. Grouping on categoricals with `observed=False` materialises every combination, which explodes with two or three keys. Sorting the output (`sort=True` by default) costs time on huge keys and can be disabled. In practice I profile with `%timeit`, switch keys to `category`, and replace lambdas with named built-ins or vectorised pre-computation.

## Merging & joining (merge/join/concat)

Combining tables is where pandas replaces `VLOOKUP`, `XLOOKUP` and Power Query merges. `merge` joins on column values like SQL, `join` joins on the index, and `concat` stacks frames vertically or side by side. Getting the join type right, validating the key cardinality and checking for unmatched rows are the habits that separate a correct report from an inflated one.

### merge

```python
result = pd.merge(prod, rates, on="state", how="left")
result = prod.merge(rates, on="state", how="left")            # same, method form
prod.merge(rates, left_on="state_code", right_on="state")     # different key names
prod.merge(rates, on=["state", "policy_type"])                # composite key
```

The `how` argument:

| how | Keeps | SQL |
|---|---|---|
| `inner` (default) | Keys present in both | INNER JOIN |
| `left` | All rows of the left, NaN where no match | LEFT JOIN |
| `right` | All rows of the right | RIGHT JOIN |
| `outer` | All keys from both | FULL OUTER JOIN |
| `cross` | Every combination | CROSS JOIN |

For a lookup (bring the rate onto every production row) use `how="left"`; a default inner join silently drops production rows whose state has no rate, and the totals shrink without any error.

### Validating a join

```python
prod.merge(rates, on="state", how="left", validate="many_to_one")
```

`validate` raises if the relationship is not what you expect. `many_to_one` guarantees the right table has unique keys; if `rates` accidentally has two rows for `WY`, every Wyoming production row would be duplicated and totals would double. Always use it for lookups.

```python
m = prod.merge(rates, on="state", how="left", indicator=True)
m["_merge"].value_counts()          # both / left_only / right_only
m[m["_merge"] == "left_only"]       # production rows with no rate: the anti-join
```

`indicator=True` adds a `_merge` column that shows where each row came from, which is the fastest way to find unmatched keys.

### Overlapping column names

Non-key columns present in both frames get suffixes `_x` and `_y`. Set them explicitly: `suffixes=("", "_rate")`, or drop and rename before merging so the output is readable.

### join: on the index

```python
prod.set_index("state").join(rates.set_index("state"), how="left")
```

`join` is a convenience for index-aligned joins and is faster for repeated joins on a sorted unique index. Most code uses `merge`.

### concat: stacking

```python
year = pd.concat([jan, feb, mar], ignore_index=True)           # rows, like Append
year = pd.concat({"jan": jan, "feb": feb}, names=["month"])    # adds a key level
side = pd.concat([left, right], axis=1)                        # columns, aligned on index
```

`ignore_index=True` gives a fresh RangeIndex; without it, duplicate labels from each source frame survive and later `loc` calls return several rows. Columns are aligned by name and missing columns filled with `NaN`, so a month file with a renamed column becomes a new, mostly empty column: check `year.columns` after concatenating. `DataFrame.append` was removed in pandas 2.0; use `concat`.

Reading a folder:

```python
from pathlib import Path
frames = [pd.read_csv(p).assign(source=p.name) for p in Path("exports").glob("*.csv")]
year = pd.concat(frames, ignore_index=True)
```

The `assign(source=...)` keeps the file name for traceability, like Power Query's Folder connector.

### Time-aware joins

`pd.merge_asof(quotes, rates, on="date", by="state", direction="backward")` matches each row to the most recent rate effective on or before its date, which is exactly the effective-dated rate-matrix lookup from the Excel course, without sorting tricks. Both frames must be sorted by the `on` key.

### Combining and updating

```python
df["coverage"] = df["coverage"].combine_first(backup["coverage"])   # fill blanks from another frame
df.update(corrections)                                              # overwrite in place by index/columns
```

### A join checklist

1. Choose `how` deliberately; `left` for lookups.
2. Clean both keys identically (strip, upper, same dtype).
3. `validate=` the cardinality.
4. `indicator=True` and inspect `left_only`.
5. Compare row counts and totals before and after.

> **Warning:** A merge that returns more rows than the left table is a duplicated key on the right. Check `len(result) == len(prod)` after every lookup-style merge, or let `validate="many_to_one"` catch it for you.

### Try It Yourself

```python
import io
import pandas as pd

prod = pd.read_csv(io.StringIO("""date,state,file,coverage
2026-09-01,WY,417,187450
2026-09-01,MT,418,250000
2026-09-02,wy,419,99999
2026-09-02,ID,420,120500
2026-09-03,CO,421,300000
"""), parse_dates=["date"])

rates = pd.read_csv(io.StringIO("""state,rate,effective
WY,5.50,2026-01-01
WY,5.75,2026-09-02
MT,6.00,2026-01-01
ID,5.20,2026-01-01
"""), parse_dates=["effective"])

prod["state"] = prod["state"].str.strip().str.upper()

# Latest rate per state as a simple lookup, validated many-to-one
latest = rates.sort_values("effective").drop_duplicates("state", keep="last")[["state", "rate"]]
m = prod.merge(latest, on="state", how="left", validate="many_to_one", indicator=True)
print(m); print()
print(m["_merge"].value_counts()); print()
print("rows before/after:", len(prod), len(m))

# Effective-dated rate: most recent rate on or before each production date
asof = pd.merge_asof(prod.sort_values("date"), rates.sort_values("effective"),
                     left_on="date", right_on="effective", by="state", direction="backward")
print(); print(asof[["date", "state", "file", "rate", "effective"]])

# Stack two monthly exports, keeping the source name
aug = prod.head(2).assign(source="aug.csv")
sep = prod.tail(3).assign(source="sep.csv")
print(); print(pd.concat([aug, sep], ignore_index=True)[["file", "source"]])
```

### Quiz

1. Which join keeps every production row and adds NaN where no rate exists?
- [ ] `inner`
- [x] `left`
- [ ] `outer`
> Left keeps all rows of the left frame; inner drops unmatched rows silently.

2. What does `validate="many_to_one"` check?
- [ ] That the left keys are unique
- [x] That the right keys are unique
- [ ] That every key matches
> It guarantees the lookup table has one row per key so rows are not duplicated.

3. How do you find left rows with no match?
- [ ] `how="anti"`
- [x] `indicator=True` and filter `_merge == "left_only"`
- [ ] `dropna()`
> pandas has no anti-join keyword; the indicator column provides it.

4. What replaced `DataFrame.append`?
- [x] `pd.concat`
- [ ] `merge`
- [ ] `join`
> append was removed in pandas 2.0; concat stacks frames.

### Exercises

1. **Lookup with audit** — Merge rates onto production, report unmatched states and confirm the row count is unchanged.
<details><summary>Solution</summary>

```python
m = prod.merge(rates, on="state", how="left", validate="many_to_one", indicator=True)
print(m.loc[m["_merge"] == "left_only", "state"].unique())
assert len(m) == len(prod)
```

</details>

2. **Folder append** — Combine all `weekly_*.csv` files with a `source` column.
<details><summary>Solution</summary>

```python
from pathlib import Path
year = pd.concat([pd.read_csv(p).assign(source=p.name) for p in Path(".").glob("weekly_*.csv")], ignore_index=True)
```

</details>

3. **Effective-dated rate** — Attach the rate in force on each production date.
<details><summary>Solution</summary>

```python
out = pd.merge_asof(prod.sort_values("date"), rates.sort_values("effective"),
                    left_on="date", right_on="effective", by="state", direction="backward")
```

</details>

### Interview Questions

**Q: A merge doubled your row count. What happened and how do you prevent it?**
The right-hand table had duplicate keys, so each left row matched several right rows and was repeated. It commonly happens when a rate table has multiple effective dates per state or a dimension was appended twice. Prevention is `validate="many_to_one"` on lookup merges, which raises immediately, plus deduplicating the lookup table deliberately (latest effective date, for example) before merging. I also assert `len(result) == len(left)` after every lookup merge and compare a control total such as `files.sum()` before and after.

**Q: Compare merge, join and concat.**
`merge` is the general SQL-style join on column values with `how` controlling the join type and options like `validate` and `indicator`. `join` is a convenience for joining on the index (or index to column) and defaults to a left join; it is handy when frames already share a meaningful index. `concat` does not match keys at all: it stacks frames along rows or columns, aligning on labels, and is the tool for appending monthly exports or placing summaries side by side. Choosing wrongly, such as using `concat(axis=1)` on frames with different indexes, produces misaligned rows full of NaN rather than an error.

**Q: How do you perform a lookup that depends on an effective date?**
With `pd.merge_asof`, which for each left row finds the right row with the closest key on or before (direction `backward`) the left key, optionally within groups via `by`. Sorting both frames by the date key is required. For a rate matrix with several effective dates per state, `merge_asof(prod, rates, left_on="date", right_on="effective", by="state")` attaches exactly the rate in force on the production date. The alternative of a normal merge followed by filtering to `effective <= date` and keeping the latest works but creates the full cross product first and is slower on large tables.

## Apply/map & vectorisation

Sometimes there is no built-in method for the transformation you need. pandas offers `map` for Series element-wise, `apply` for rows or columns, and NumPy's `where` and `select` for conditional logic. Knowing which to use, and when to avoid all of them in favour of a vectorised expression, is the difference between a script that runs in seconds and one that runs in hours.

### Series.map: element-wise with a dict or function

```python
df["region"] = df["state"].map({"WY": "Mountain", "MT": "Mountain", "ID": "Mountain", "TX": "South"})
df["grade"] = df["rate"].map(lambda r: "A" if r <= 0.01 else "B" if r <= 0.02 else "C")
```

With a dictionary, unmapped values become `NaN`; add `.fillna("Other")`. Mapping with a dictionary or a Series is vectorised and fast; mapping with a lambda calls Python once per element.

### DataFrame.apply: per row or per column

```python
df.apply(lambda col: col.max() - col.min())          # per column (axis=0)
df.apply(lambda row: row["errors"] / row["files"] if row["files"] else 0, axis=1)   # per row: slow
```

Row-wise `apply` builds a Series for every row and is roughly 100× slower than a vectorised expression. Use it only when logic genuinely needs several columns and cannot be expressed with array operations.

### DataFrame.map (element-wise on every cell)

`df.map(func)` (pandas 2.1+; formerly `applymap`) applies a function to every cell, for example rounding or stripping every text cell: `df.select_dtypes("object").map(str.strip)`.

### Vectorised conditionals

```python
import numpy as np
df["flag"] = np.where(df["rate"] > 0.02, "High", "OK")

conditions = [df["rate"] <= 0.01, df["rate"] <= 0.02, df["rate"] <= 0.04]
choices = ["A", "B", "C"]
df["grade"] = np.select(conditions, choices, default="D")

df["grade"] = pd.cut(df["rate"], bins=[-np.inf, 0.01, 0.02, 0.04, np.inf], labels=["A", "B", "C", "D"])
```

`np.where` is `IF`, `np.select` is `IFS`, and `pd.cut` is the band lookup. All three operate on whole arrays. `pd.cut` also makes a `category` column with ordered bands, which sorts correctly in reports.

### Vectorised maths

```python
np.ceil(df["coverage"] / 1000)             # units for a rate manual
np.round(df["premium"], 2)
df["premium"] = (np.ceil(df["coverage"] / 1000) * df["rate"]).round(2)
df["premium"] = df["premium"].clip(lower=df["min_premium"])     # floor at the minimum premium
np.log1p(df["files"]), df["files"].abs(), df["files"].pow(2)
```

NumPy ufuncs accept Series directly and return Series with the same index.

### Timing the difference

```python
import time, numpy as np, pandas as pd
n = 1_000_000
df = pd.DataFrame({"files": np.random.randint(1, 500, n), "errors": np.random.randint(0, 20, n)})

t = time.perf_counter(); r1 = df["errors"] / df["files"]; v = time.perf_counter() - t
t = time.perf_counter(); r2 = df.apply(lambda r: r["errors"] / r["files"], axis=1); a = time.perf_counter() - t
print(f"vectorised {v:.3f}s, apply {a:.3f}s, ratio {a/v:.0f}x")
```

Typical results: vectorised in a few milliseconds, `apply` in ten to twenty seconds.

### iterrows and itertuples

`for i, row in df.iterrows()` yields a Series per row and is the slowest way to touch data; it also loses dtypes. `itertuples()` is several times faster and keeps types. Both are acceptable only for side effects (writing one file per row, calling an API per row), never for computing columns.

### When apply is right

- Calling an external function that only works on scalars (a rating engine, a regex too complex for `.str`).
- Logic that returns several columns: `df.apply(func, axis=1, result_type="expand")`.
- Small frames where clarity beats speed.

Even then, look for `map` with a dictionary, `merge` with a lookup table or `np.select` first.

### Decision table

| Need | Use |
|---|---|
| Recode values | `map` with dict, or `replace` |
| IF / IFS | `np.where`, `np.select` |
| Bands | `pd.cut`, `pd.qcut` |
| Column arithmetic | Operators and NumPy ufuncs |
| Lookup from another table | `merge` |
| Per-group values | `groupby().transform` |
| Genuine row logic | `apply(axis=1)` as a last resort |

> **Interview note:** "How would you speed up this apply?" is a standard question. The expected answer is to rewrite it as `np.where`/`np.select`, a `map` with a dictionary, or a merge, and to mention the 100× gap.

### Try It Yourself

```python
import io, time
import numpy as np
import pandas as pd

raw = """state,coverage,files,errors
WY,187450,412,9
MT,250000,388,14
WY,99999,455,6
ID,120500,301,12
TX,500000,0,0
"""
df = pd.read_csv(io.StringIO(raw))
rates = {"WY": 5.5, "MT": 6.0, "ID": 5.2}

df["rate_per_1000"] = df["state"].map(rates).fillna(5.0)
df["premium"] = (np.ceil(df["coverage"] / 1000) * df["rate_per_1000"]).round(2).clip(lower=150)
df["error_rate"] = np.where(df["files"] > 0, df["errors"] / df["files"].replace(0, np.nan), 0.0)
df["grade"] = np.select([df["error_rate"] <= 0.01, df["error_rate"] <= 0.02, df["error_rate"] <= 0.04],
                        ["A", "B", "C"], default="D")
df["band"] = pd.cut(df["coverage"], bins=[0, 100_000, 250_000, np.inf], labels=["<100k", "100-250k", ">250k"])
print(df); print()

# Timing: vectorised vs row-wise apply on 200k rows
n = 200_000
big = pd.DataFrame({"files": np.random.randint(1, 500, n), "errors": np.random.randint(0, 20, n)})
t = time.perf_counter(); v = big["errors"] / big["files"]; tv = time.perf_counter() - t
t = time.perf_counter(); a = big.apply(lambda r: r["errors"] / r["files"], axis=1); ta = time.perf_counter() - t
print(f"vectorised: {tv*1000:.1f} ms   apply(axis=1): {ta*1000:.0f} ms   ratio: {ta/tv:.0f}x")
print("same result:", np.allclose(v, a))
```

### Quiz

1. Which is the vectorised equivalent of Excel's IFS?
- [ ] `apply(axis=1)`
- [x] `np.select`
- [ ] `iterrows`
> np.select evaluates a list of conditions and picks the first matching choice for each element.

2. `df["state"].map({"WY": "Mountain"})` returns what for `"TX"`?
- [x] NaN
- [ ] "TX"
- [ ] An error
> Values missing from the dictionary map to NaN; add fillna for a default.

3. Roughly how much slower is row-wise `apply` than a vectorised expression?
- [ ] 2×
- [x] 100× or more
- [ ] It is the same
> apply builds a Series per row in Python; vectorised ops run in C over whole arrays.

4. Which method bins a numeric column into labelled bands?
- [ ] `np.where`
- [x] `pd.cut`
- [ ] `map`
> pd.cut assigns each value to an interval and can label the intervals.

### Exercises

1. **Recode with default** — Map states to regions with "Other" for unknowns, without apply.
<details><summary>Solution</summary>

```python
df["region"] = df["state"].map(regions).fillna("Other")
```

</details>

2. **Replace an apply** — Rewrite `df.apply(lambda r: r["errors"]/r["files"] if r["files"] else 0, axis=1)` vectorised.
<details><summary>Solution</summary>

```python
df["rate"] = np.where(df["files"] > 0, df["errors"] / df["files"].replace(0, np.nan), 0.0)
```

</details>

3. **Quantile bands** — Split coverage into four equal-frequency bands labelled Q1–Q4.
<details><summary>Solution</summary>

```python
df["quartile"] = pd.qcut(df["coverage"], 4, labels=["Q1", "Q2", "Q3", "Q4"])
```

</details>

### Interview Questions

**Q: What is the difference between map, apply and applymap?**
`Series.map` is element-wise on a Series and accepts a dictionary, a Series or a function; with a dict or Series it is vectorised. `DataFrame.apply` applies a function along an axis: per column by default, or per row with `axis=1`, which is slow. `applymap` applied a function to every cell of a DataFrame and was renamed `DataFrame.map` in pandas 2.1. In practice I use `Series.map` with dictionaries for recoding, column-wise `apply` for per-column summaries, and avoid row-wise `apply` in favour of `np.where`, `np.select` and arithmetic.

**Q: How would you optimise a slow row-wise calculation?**
First express it as column arithmetic: most "if this column then that" logic is `np.where` or `np.select`, most recoding is `map` with a dictionary, and most lookups are `merge`. Second, if it depends on a group, use `groupby().transform`. Third, for scalar functions that cannot be vectorised, try `Series.map` (faster than row-wise apply since it passes scalars, not Series), `itertuples`, or `numba`/`swifter`. I measure with `%timeit` before and after; the usual outcome is a 50–500× speed-up, and on a million-row production file that converts a 10-minute step into a second.

**Q: Explain pd.cut versus pd.qcut.**
`pd.cut` bins by fixed edges you supply (or equal-width bins if you give a count), which matches business bands such as coverage under 100k, 100–250k, above. `pd.qcut` bins by quantiles so each bin has roughly the same number of rows, which suits ranking customers into quartiles. Both return an ordered `category`, so sorting and grouping preserve band order, and both accept `labels=`. Edge cases: `cut` puts values outside the edges as NaN unless the edges include infinities, and `qcut` raises when there are too many duplicate values to form distinct edges unless `duplicates="drop"`.
