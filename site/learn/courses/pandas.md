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

# LEVEL: Advanced

## Pivot tables, crosstab, melt & stack

Every weekly production report is a reshaping problem. The system exports one row per file (long format); management wants states down the side, weeks across the top and a total in each cell (wide format). pandas moves between the two shapes with `pivot_table`, `pivot`, `crosstab`, `melt`, `stack` and `unstack`. Master these and you never build a summary by hand in Excel again.

### pivot_table: the PivotTable equivalent

```python
summary = pd.pivot_table(
    df,
    index="state",            # rows
    columns="week",           # columns
    values="files",           # what to aggregate
    aggfunc="sum",            # default is "mean", so always set it
    fill_value=0,
    margins=True, margins_name="Total",
)
```

`pivot_table` groups, aggregates and lays out in one call. `margins=True` adds row and column totals exactly like the Grand Total in Excel. Several measures at once are allowed: `values=["files", "errors"], aggfunc={"files": "sum", "errors": ["sum", "max"]}` produces a two-level column header.

### pivot: reshape without aggregating

```python
wide = df.pivot(index="state", columns="week", values="files")
```

`pivot` is a pure reshape. It raises `ValueError: Index contains duplicate entries` if any (index, column) pair occurs twice, which is a useful check: if you expected one row per state-week and `pivot` fails, your data has duplicates. Use `pivot_table` when you want aggregation, `pivot` when you want the guarantee.

### crosstab: frequency tables

```python
pd.crosstab(df["agent"], df["qa_result"])                          # counts
pd.crosstab(df["agent"], df["qa_result"], normalize="index")       # row percentages
pd.crosstab(df["agent"], df["qa_result"], values=df["files"], aggfunc="sum", margins=True)
```

`crosstab` works on plain arrays or Series, not just DataFrame columns, and `normalize="index"`, `"columns"` or `"all"` gives percentages without a second step. It is the fastest way to build a QA pass/fail matrix per agent.

### melt: wide to long

The reverse trip matters just as much. Clients send rate matrices with one column per coverage band; Power BI and SQL want one row per (state, band, rate).

```python
long = matrix.melt(
    id_vars=["state"],
    value_vars=["0-50k", "50-100k", "100-250k"],
    var_name="band",
    value_name="rate",
)
```

Every column in `value_vars` becomes rows; `id_vars` are repeated. Omit `value_vars` to melt every column not in `id_vars`. `pd.wide_to_long` handles the special case where column names carry a stub and a suffix, such as `rate_2024`, `rate_2025`.

### stack and unstack: move index levels

```python
stacked = wide.stack()            # columns → inner index level (long Series)
back = stacked.unstack()          # inner index level → columns
by_state = df.groupby(["state", "week"])["files"].sum().unstack("week", fill_value=0)
```

`groupby(...).sum().unstack()` is the idiom most experienced users reach for instead of `pivot_table`: it is explicit about the aggregation and gives you the same wide result. In pandas 2.1+ pass `future_stack=True` to `stack` to get the new implementation that keeps NaN rows and is much faster.

### Cleaning up after a pivot

Pivots create MultiIndex columns and an index name that Excel does not need. The usual cleanup is:

```python
out = summary.reset_index()                          # state back to a column
out.columns = [" ".join(map(str, c)).strip() if isinstance(c, tuple) else c for c in out.columns]
out.columns.name = None
```

| Task | Function |
|---|---|
| Summarise with aggregation | `pivot_table` |
| Reshape one value per cell, no duplicates | `pivot` |
| Counts or percentages of two categoricals | `crosstab` |
| Wide to long | `melt`, `wide_to_long` |
| Column level to index and back | `stack` / `unstack` |

> **Tip:** `pivot_table` silently defaults to the mean. A report showing "files = 41.3" instead of the weekly total almost always means someone forgot `aggfunc="sum"`.

### Try It Yourself

```python
import io
import pandas as pd

raw = """week,state,agent,files,errors,qa_result
W36,WY,Asad,120,3,Pass
W36,MT,Hina,95,6,Fail
W36,WY,Hina,80,1,Pass
W37,WY,Asad,130,2,Pass
W37,MT,Asad,60,5,Fail
W37,ID,Hina,110,2,Pass
W38,ID,Asad,90,4,Pass
W38,MT,Hina,105,3,Pass
"""
df = pd.read_csv(io.StringIO(raw))

wide = pd.pivot_table(df, index="state", columns="week", values="files",
                      aggfunc="sum", fill_value=0, margins=True, margins_name="Total")
print("Files by state and week:\n", wide, "\n")

qa = pd.crosstab(df["agent"], df["qa_result"], normalize="index").round(2)
print("QA pass rate per agent:\n", qa, "\n")

long = wide.drop("Total").drop(columns="Total").reset_index().melt(
    id_vars="state", var_name="week", value_name="files")
print("Back to long:\n", long.sort_values(["state", "week"]).to_string(index=False), "\n")

stacked = df.groupby(["state", "week"])["errors"].sum().unstack("week", fill_value=0)
print("Errors via groupby + unstack:\n", stacked)
```

### Quiz

1. What is the default `aggfunc` of `pivot_table`?
- [ ] sum
- [x] mean
- [ ] count
> pivot_table averages unless you say otherwise; always pass aggfunc explicitly for reports.

2. `df.pivot(...)` raises "Index contains duplicate entries". What does that tell you?
- [x] Some (index, column) pair occurs more than once, so a pure reshape is ambiguous
- [ ] The DataFrame index is not sorted
- [ ] You must call reset_index first
> pivot does not aggregate, so it needs exactly one value per cell; use pivot_table to aggregate duplicates.

3. Which function turns one column per week into one row per week?
- [ ] unstack
- [x] melt
- [ ] crosstab
> melt converts wide columns into (variable, value) rows.

4. `pd.crosstab(a, b, normalize="index")` returns what?
- [ ] Counts
- [x] Each row's values as a fraction of that row's total
- [ ] Each column's values as a fraction of the grand total
> normalize="index" divides by row sums, giving per-row percentages.

### Exercises

1. **Two measures** — Build a pivot with states as rows, weeks as columns, showing both the sum of files and the max errors.
<details><summary>Solution</summary>

```python
pd.pivot_table(df, index="state", columns="week",
               values=["files", "errors"],
               aggfunc={"files": "sum", "errors": "max"}, fill_value=0)
```

</details>

2. **Rate matrix to long** — A DataFrame `matrix` has columns `state, 0-50k, 50-100k, 100-250k`. Produce rows of (state, band, rate) sorted by state then band.
<details><summary>Solution</summary>

```python
long = matrix.melt(id_vars="state", var_name="band", value_name="rate")
long = long.sort_values(["state", "band"]).reset_index(drop=True)
```

</details>

3. **Flatten headers** — After a two-measure pivot, flatten the MultiIndex columns into names like `files W36`.
<details><summary>Solution</summary>

```python
p = pd.pivot_table(df, index="state", columns="week", values=["files", "errors"], aggfunc="sum")
p.columns = [f"{m} {w}" for m, w in p.columns]
p = p.reset_index()
```

</details>

### Interview Questions

**Q: What is the difference between pivot and pivot_table?**
`pivot` is a pure reshape: it requires exactly one value for each (index, column) combination and raises on duplicates. `pivot_table` groups and aggregates first, so duplicates are combined by `aggfunc`, and it supports `margins` and `fill_value`. I use `pivot` deliberately when duplicates would be a data-quality bug, because the error is a free assertion, and `pivot_table` when I need totals. Under the hood `pivot_table` is `groupby` followed by `unstack`, which is why many people write that idiom directly.

**Q: When would you melt a DataFrame?**
Whenever the data is wide for human reading but needs to be long for analysis or storage. A rate matrix with one column per coverage band cannot be joined, filtered or charted per band until it is melted into (state, band, rate) rows. Long data is what SQL tables, Power BI models and `groupby` want; wide data is what managers want to look at. A typical pipeline melts on the way in, computes in long form, and pivots on the way out to Excel.

**Q: How does crosstab differ from pivot_table?**
`crosstab` is a convenience for frequency tables of two or more categorical arrays: by default it counts, it accepts raw arrays rather than needing a DataFrame, and it has a `normalize` argument to produce row, column or overall percentages in one step. `pivot_table` needs a DataFrame and a `values` column, and returns raw aggregates. For a QA pass/fail rate per agent, `crosstab(agent, result, normalize="index")` is one line; the equivalent with `pivot_table` needs a count column and a division.

**Q: What does unstack do and when does it produce NaN?**
`unstack` moves the innermost index level (or a named level) into the columns. If a combination of the remaining index and the moved level did not exist in the data, that cell has no value and becomes NaN, which is why `fill_value=0` is common for count-type data. The reverse, `stack`, moves a column level back into the index and by default drops those NaN cells, so `stack` and `unstack` are not perfectly symmetric unless you use `dropna=False` or `future_stack=True` in pandas 2.1+.

## Datetime, resampling & time series

Production data is time-stamped: a file is received, worked and closed, and every report groups those events by day, week or month. pandas has a dedicated `datetime64[ns]` dtype, a `.dt` accessor, a `DatetimeIndex` with calendar-aware slicing, and `resample` for changing the frequency. Doing dates properly means Monday-to-Sunday weeks, month ends that respect February, and time-zone-safe comparisons.

### Parsing dates

```python
df["received"] = pd.to_datetime(df["received"], format="%m/%d/%Y")       # US style, explicit
df["closed"] = pd.to_datetime(df["closed"], errors="coerce")            # bad values → NaT
df = pd.read_csv(path, parse_dates=["received", "closed"])
```

Always pass `format=` when you know it; parsing is faster and unambiguous (`03/04/2026` is 4 March in Lahore and 3 April in Texas). Since pandas 2.0 a mixed-format column raises unless you pass `format="mixed"`. Missing dates are `NaT`, and `isna()` recognises them.

### The .dt accessor

```python
df["year"] = df["received"].dt.year
df["week"] = df["received"].dt.isocalendar().week          # ISO week number
df["dow"] = df["received"].dt.day_name()
df["month"] = df["received"].dt.to_period("M")             # 2026-09
df["days_open"] = (df["closed"] - df["received"]).dt.days
df["due"] = df["received"] + pd.Timedelta(days=5)
df["due_bd"] = df["received"] + pd.offsets.BusinessDay(5)  # skips weekends
```

Subtracting two datetimes gives a `timedelta64` Series; `.dt.days` or `.dt.total_seconds()` turns it into a number. `pd.offsets` covers business days, month ends (`MonthEnd`), quarter starts and custom holiday calendars.

### DatetimeIndex slicing

```python
ts = df.set_index("received").sort_index()
ts.loc["2026-09"]                       # the whole month
ts.loc["2026-09-01":"2026-09-07"]       # inclusive on both ends
ts.between_time("09:00", "17:00")       # only for timestamps with a time part
```

Partial-string indexing is the reason to put dates in the index: a month, a quarter or a date range is one string. Sort the index first, otherwise slicing raises `KeyError` on unsorted data.

### resample: change the frequency

```python
weekly = ts["files"].resample("W-SUN").sum()      # weeks ending Sunday
monthly = ts.resample("ME").agg({"files": "sum", "errors": "sum", "days_open": "mean"})
daily = ts["files"].resample("D").sum().fillna(0) # fills calendar gaps with 0
```

`resample` is a time-aware `groupby`. Common frequency strings: `D` day, `W` or `W-MON` week ending on that day, `ME` month end (`M` before pandas 2.2), `MS` month start, `QE` quarter end, `YE` year end, `h`/`min` for intraday. Days with no rows appear in the output as NaN, which is exactly what a management chart needs so gaps are visible.

### Grouper: resample inside groupby

```python
df.groupby(["state", pd.Grouper(key="received", freq="W-SUN")])["files"].sum().unstack(0)
```

`pd.Grouper` lets you resample per state in one call, and `unstack(0)` gives weeks as rows and states as columns.

### Time zones

```python
s = pd.to_datetime(df["created_utc"]).dt.tz_localize("UTC")
s.dt.tz_convert("America/Chicago")          # Stewart's Texas office
s.dt.tz_convert("Asia/Karachi").dt.tz_localize(None)   # naive local time for Excel
```

`tz_localize` attaches a zone to naive timestamps; `tz_convert` changes zone. Comparing tz-aware and naive timestamps raises `TypeError`, so pick one convention per pipeline. Excel cannot store time zones, so strip them with `tz_localize(None)` before export.

### Rolling calendars and date ranges

```python
pd.date_range("2026-09-01", periods=4, freq="W-MON")           # every Monday
pd.date_range("2026-01-01", "2026-12-31", freq="BME")           # business month ends
ts.reindex(pd.date_range(ts.index.min(), ts.index.max(), freq="D"), fill_value=0)
```

`date_range` builds a complete calendar; `reindex` against it forces every day to appear even when the source had no rows, which stops charts from silently skipping quiet days.

| Frequency alias | Meaning |
|---|---|
| `D`, `B` | Calendar day, business day |
| `W-SUN` | Weekly, periods end on Sunday |
| `ME` / `MS` | Month end / month start |
| `QE` / `YE` | Quarter end / year end |
| `h`, `min`, `s` | Hour, minute, second |

> **Warning:** Excel stores dates as serial numbers and pandas reads them as datetimes correctly through openpyxl, but a CSV exported from Excel contains text like `9/3/26`. Two-digit years and month/day order are the most common source of wrong weekly totals; fix them with an explicit `format=`.

### Try It Yourself

```python
import io
import pandas as pd

raw = """file_id,state,received,closed,files
1,WY,09/01/2026,09/03/2026,12
2,MT,09/01/2026,09/05/2026,9
3,WY,09/04/2026,09/08/2026,15
4,ID,09/09/2026,,7
5,MT,09/10/2026,09/12/2026,11
6,WY,09/16/2026,09/17/2026,14
7,ID,09/22/2026,09/29/2026,6
"""
df = pd.read_csv(io.StringIO(raw))
df["received"] = pd.to_datetime(df["received"], format="%m/%d/%Y")
df["closed"] = pd.to_datetime(df["closed"], format="%m/%d/%Y", errors="coerce")

df["days_open"] = (df["closed"] - df["received"]).dt.days
df["due"] = df["received"] + pd.offsets.BusinessDay(5)
df["iso_week"] = df["received"].dt.isocalendar().week
print(df[["file_id", "received", "closed", "days_open", "due", "iso_week"]], "\n")

ts = df.set_index("received").sort_index()
weekly = ts["files"].resample("W-SUN").sum()
print("Weekly files (weeks ending Sunday):\n", weekly, "\n")

by_state = (df.groupby(["state", pd.Grouper(key="received", freq="W-SUN")])["files"]
              .sum().unstack(0, fill_value=0))
print("Weekly files per state:\n", by_state, "\n")

print("Still open:", df.loc[df["closed"].isna(), "file_id"].tolist())
print("Avg days open:", round(df["days_open"].mean(), 1))
```

### Quiz

1. What does `pd.to_datetime(s, errors="coerce")` do with an unparseable value?
- [ ] Raises ValueError
- [x] Returns NaT for that element
- [ ] Leaves the original string
> coerce converts failures to NaT, the datetime missing value, so the column stays datetime64.

2. Which frequency string means weeks ending on Sunday?
- [x] `W-SUN`
- [ ] `W-MON`
- [ ] `7D`
> W-<DAY> anchors each period to end on that weekday; 7D is unanchored.

3. `ts.loc["2026-09"]` on a sorted DatetimeIndex returns what?
- [ ] Only 1 September 2026
- [x] Every row in September 2026
- [ ] A KeyError
> Partial-string indexing selects the whole period named by the string.

4. Why does `df["received"] + pd.offsets.BusinessDay(5)` differ from `+ pd.Timedelta(days=5)`?
- [x] BusinessDay skips Saturdays and Sundays
- [ ] Timedelta cannot be added to datetimes
- [ ] BusinessDay counts hours, not days
> Offsets are calendar-aware; Timedelta is a fixed duration.

### Exercises

1. **Monthly summary** — From `ts` (DatetimeIndex), compute per month the total files and the mean days open, with month-end labels.
<details><summary>Solution</summary>

```python
monthly = ts.resample("ME").agg({"files": "sum", "days_open": "mean"}).round(1)
```

</details>

2. **Fill the calendar** — Produce a daily Series of files with 0 on days that had no rows.
<details><summary>Solution</summary>

```python
daily = ts["files"].resample("D").sum()
full = daily.reindex(pd.date_range(daily.index.min(), daily.index.max(), freq="D"), fill_value=0)
```

</details>

3. **SLA breach** — Flag files where `closed` is later than `received + 5 business days`, treating unclosed files as breached if today is past the due date.
<details><summary>Solution</summary>

```python
due = df["received"] + pd.offsets.BusinessDay(5)
today = pd.Timestamp("2026-09-16")
df["breach"] = (df["closed"] > due) | (df["closed"].isna() & (today > due))
```

</details>

### Interview Questions

**Q: What is the difference between resample and groupby on a date column?**
`resample` is a `groupby` specialised for a regular time frequency: it requires a DatetimeIndex (or `on=`/`pd.Grouper`), it understands calendar semantics such as month ends and weeks anchored to a weekday, and it emits every period in the range, including empty ones as NaN. A plain `groupby(df.received.dt.month)` only returns months that had data and loses the year unless you add it. For a weekly production report I use `resample("W-SUN")` so an empty week shows as zero rather than vanishing, which a manager would otherwise read as a data error.

**Q: How do you handle mixed date formats in one column?**
First I find out why they are mixed, because it usually means two source systems were concatenated. Then I parse each known format explicitly with `pd.to_datetime(format=..., errors="coerce")` and combine the results with `fillna`, so nothing is guessed. `format="mixed"` (pandas 2.0+) infers per element but is slow and can silently swap day and month, so I only use it for exploration. I finish with an assertion that the count of `NaT` equals the count of originally blank cells.

**Q: Explain tz_localize versus tz_convert.**
`tz_localize` attaches a time zone to naive timestamps without changing the wall-clock value; `tz_convert` shifts an already-aware timestamp to another zone, changing the wall-clock value. If a system logs `2026-09-16 14:00` in Chicago, I `tz_localize("America/Chicago")` and then `tz_convert("UTC")` to store it. Mixing aware and naive values raises a `TypeError`, and Excel cannot hold zones, so I convert to the report's local zone and `tz_localize(None)` right before writing.

**Q: Why put dates in the index at all?**
Three features need it: partial-string slicing (`ts.loc["2026-Q3"]`), `resample`, and alignment when adding or subtracting two time series with different dates. Outside of those, keeping the date as a column is simpler for merges and Excel export. My pattern is to set the index for the time-series computations and `reset_index()` at the end of that block.

## Window functions (rolling, expanding, shift, rank)

A single week's number means little on its own. Managers want the four-week moving average, the change versus last week, the running total for the quarter and each agent's rank. In SQL these are window functions (`OVER (PARTITION BY ... ORDER BY ...)`); in pandas they are `rolling`, `expanding`, `ewm`, `shift`, `diff`, `pct_change`, `cumsum` and `rank`, all of which work per group when chained after `groupby`.

### shift, diff and pct_change

```python
w = weekly.sort_values("week")
w["prev"] = w["files"].shift(1)                  # last week's value
w["change"] = w["files"].diff()                  # files - prev
w["pct"] = w["files"].pct_change() * 100         # (files / prev - 1) * 100
w["next"] = w["files"].shift(-1)                 # look ahead
```

`shift(1)` moves values down one row so each row sees the previous row; the first row gets NaN. This is SQL's `LAG`; `shift(-1)` is `LEAD`. Sort first, always: shift operates on row position, not on the week label.

### rolling: moving windows

```python
w["ma4"] = w["files"].rolling(4).mean()                       # 4-week moving average
w["ma4"] = w["files"].rolling(4, min_periods=1).mean()        # partial windows at the start
w["max8"] = w["errors"].rolling(8).max()
w["ma_centered"] = w["files"].rolling(5, center=True).mean()
```

`rolling(n)` looks at the current row and the `n-1` before it. Without `min_periods` the first `n-1` results are NaN. Any aggregation works: `sum`, `mean`, `std`, `min`, `max`, `median`, `quantile`, `apply(func, raw=True)` and `corr` between two columns. With a DatetimeIndex you can use a time offset instead of a count: `rolling("28D")` uses the last 28 calendar days regardless of how many rows fall in them.

### expanding and ewm

```python
w["ytd"] = w["files"].expanding().sum()          # same as cumsum
w["running_mean"] = w["files"].expanding().mean()
w["ewma"] = w["files"].ewm(span=4).mean()        # recent weeks weighted more
```

`expanding` grows from the first row to the current one. `ewm` (exponentially weighted) gives a smoother trend line than a plain moving average because it never drops an old value suddenly.

### cumulative functions

```python
w["cum_files"] = w["files"].cumsum()
w["record_high"] = w["files"].cummax()
w["cum_errors"] = w.groupby("state")["errors"].cumsum()
```

`cumsum`, `cumprod`, `cummax` and `cummin` are the fast path for running totals.

### Per-group windows

Everything above accepts a `groupby` in front of it, which is `PARTITION BY`:

```python
df = df.sort_values(["state", "week"])
df["prev"] = df.groupby("state")["files"].shift(1)
df["ma4"] = df.groupby("state")["files"].transform(lambda s: s.rolling(4, min_periods=1).mean())
df["ma4"] = df.groupby("state")["files"].rolling(4, min_periods=1).mean().reset_index(level=0, drop=True)
```

`groupby().shift()` and `groupby().cumsum()` return a Series aligned to the original index. `groupby().rolling()` returns a MultiIndex (group, original index), so either drop the group level as shown or wrap the rolling call in `transform`, which keeps alignment automatically.

### rank

```python
df["rank"] = df["files"].rank(ascending=False, method="min")            # 1 = most files
df["rank_in_state"] = df.groupby("state")["files"].rank(ascending=False, method="dense")
df["pctile"] = df["files"].rank(pct=True)
```

| `method` | Ties get | SQL equivalent |
|---|---|---|
| `average` (default) | mean of their positions | none |
| `min` | the lowest position | `RANK()` |
| `dense` | consecutive ranks with no gaps | `DENSE_RANK()` |
| `first` | order of appearance | `ROW_NUMBER()` |

`rank` is what an agent league table needs: rank agents by files within each team, then filter `rank <= 3` for a top-three list.

### nlargest and top-n per group

```python
df.nlargest(3, "files")                                   # top 3 overall
df.sort_values("files", ascending=False).groupby("state").head(2)    # top 2 per state
```

`groupby().head(n)` after sorting is the simplest top-n-per-group; it keeps the original columns and avoids `apply`.

> **Interview note:** "Compute a 4-week moving average per state" is a common pandas screening task. The complete answer is: sort by state and week, then `groupby("state")["files"].transform(lambda s: s.rolling(4, min_periods=1).mean())`, and mention that forgetting to sort or forgetting `min_periods` are the two usual bugs.

### Try It Yourself

```python
import io
import pandas as pd

raw = """week,state,files,errors
1,WY,100,4
2,WY,120,3
3,WY,90,5
4,WY,140,2
5,WY,130,6
1,MT,80,2
2,MT,85,4
3,MT,70,1
4,MT,95,3
5,MT,110,2
"""
df = pd.read_csv(io.StringIO(raw)).sort_values(["state", "week"]).reset_index(drop=True)
g = df.groupby("state")["files"]

df["prev"] = g.shift(1)
df["change_pct"] = (g.pct_change() * 100).round(1)
df["ma3"] = g.transform(lambda s: s.rolling(3, min_periods=1).mean()).round(1)
df["cum"] = g.cumsum()
df["record"] = g.cummax()
df["rank_in_state"] = g.rank(ascending=False, method="dense").astype(int)
df["err_rate_ewm"] = (df["errors"] / df["files"]).groupby(df["state"]).transform(
    lambda s: s.ewm(span=3).mean()).round(4)
print(df.to_string(index=False), "\n")

top = df.sort_values("files", ascending=False).groupby("state").head(2)
print("Top 2 weeks per state:\n", top[["state", "week", "files"]].to_string(index=False))
```

### Quiz

1. `s.shift(1)` corresponds to which SQL window function?
- [ ] LEAD
- [x] LAG
- [ ] ROW_NUMBER
> shift(1) brings the previous row's value forward; shift(-1) is LEAD.

2. Without `min_periods`, what do the first three values of `s.rolling(4).mean()` contain?
- [x] NaN
- [ ] 0
- [ ] The partial mean
> A window of 4 needs four observations; set min_periods=1 to allow partial windows.

3. Which `rank` method matches SQL's `DENSE_RANK()`?
- [ ] min
- [x] dense
- [ ] first
> dense gives tied rows the same rank and the next rank has no gap.

4. Why must you sort before `groupby("state")["files"].shift(1)`?
- [x] shift works by row position, so unsorted rows give the wrong "previous" value
- [ ] groupby requires sorted input
- [ ] shift raises on unsorted data
> Window operations are positional; sorting defines what "previous" means.

### Exercises

1. **Four-week average per state** — Add a column with the 4-week moving average of `files` per state, allowing partial windows.
<details><summary>Solution</summary>

```python
df = df.sort_values(["state", "week"])
df["ma4"] = df.groupby("state")["files"].transform(lambda s: s.rolling(4, min_periods=1).mean())
```

</details>

2. **Week-over-week alert** — Flag rows where files dropped more than 20% versus the previous week in the same state.
<details><summary>Solution</summary>

```python
df["alert"] = df.groupby("state")["files"].pct_change() < -0.20
```

</details>

3. **Agent league table** — Given `agents` with `team, agent, files`, rank agents within each team (1 = most files, ties share the lowest rank) and keep the top 3 per team.
<details><summary>Solution</summary>

```python
agents["rank"] = agents.groupby("team")["files"].rank(ascending=False, method="min")
top3 = agents[agents["rank"] <= 3].sort_values(["team", "rank"])
```

</details>

### Interview Questions

**Q: How do pandas window operations map to SQL window functions?**
`groupby` plays the role of `PARTITION BY`, sorting plays `ORDER BY`, and the method is the function: `shift` is `LAG`/`LEAD`, `cumsum` is `SUM() OVER (ROWS UNBOUNDED PRECEDING)`, `rolling(n).sum()` is `ROWS n-1 PRECEDING`, `rank(method="min")` is `RANK()`, `rank(method="dense")` is `DENSE_RANK()` and `rank(method="first")` or `cumcount()+1` is `ROW_NUMBER()`. The main practical difference is that pandas is positional, so I sort explicitly first, whereas SQL sorts inside the `OVER` clause.

**Q: What is the difference between rolling, expanding and ewm?**
`rolling` uses a fixed-size window (count or time offset), so old values drop out; `expanding` uses everything from the start, giving running totals and running means; `ewm` weights all history with exponentially decaying weights controlled by `span`, `halflife` or `alpha`. For a weekly KPI chart I show a 4-week rolling mean because managers understand it, but for anomaly detection I prefer `ewm` because it reacts faster to a real shift and does not jump when a single outlier leaves the window.

**Q: groupby().rolling() gave me a MultiIndex I cannot assign back. What happened?**
`groupby().rolling()` returns a result indexed by (group key, original index), so its shape does not align with the DataFrame. Two fixes: `reset_index(level=0, drop=True)` to drop the group level and get back the original index, or wrap the rolling call in `groupby().transform(lambda s: s.rolling(...).mean())`, which returns a Series aligned to the original rows. I use `transform` because it is also the pattern for every other per-group calculation, so the code stays uniform.

**Q: How would you compute a time-based rolling window when weeks have missing rows?**
Count-based `rolling(4)` silently spans gaps, so a "4-week" average might cover six calendar weeks. With a DatetimeIndex I use an offset window, `rolling("28D")`, which uses whatever rows fall in the last 28 days. Alternatively I `resample("W")` first so every week exists (with 0 or NaN), then use a count window. Which is right depends on whether a missing week means zero activity or missing data, and I confirm that with the data owner before choosing.

## MultiIndex

A MultiIndex (hierarchical index) is what you get whenever you group by two keys, pivot with two measures or stack a wide table. Many people treat it as an obstacle and `reset_index()` immediately. Understanding it instead gives you fast, readable selection of "Wyoming in week 37" and clean two-level Excel headers, and it is what makes `unstack` and `xs` possible.

### Where a MultiIndex comes from

```python
g = df.groupby(["state", "week"])["files"].sum()
print(g.index.nlevels, g.index.names)            # 2 ['state', 'week']
g.loc[("WY", 37)]                                # one value
g.loc["WY"]                                      # all weeks for WY (Series indexed by week)
```

Grouping by two keys yields a Series whose index has two levels. Tuples address a full key, a scalar addresses the outer level.

### Building one directly

```python
idx = pd.MultiIndex.from_tuples([("WY", 36), ("WY", 37), ("MT", 36)], names=["state", "week"])
idx = pd.MultiIndex.from_product([["WY", "MT"], [36, 37, 38]], names=["state", "week"])
df2 = df.set_index(["state", "week"]).sort_index()
```

`from_product` creates every combination, which is handy for `reindex` when you want missing state-week pairs to appear as zero. `set_index` with a list of columns is the everyday way to get a MultiIndex from flat data. Always `sort_index()` afterwards: unsorted MultiIndex slicing raises `UnsortedIndexError` or a `PerformanceWarning`.

### Selecting with loc, xs and IndexSlice

```python
df2.loc[("WY", 37)]                               # full key
df2.loc["WY"]                                     # outer level
df2.loc[("WY", 36):("WY", 38)]                    # tuple range (sorted index needed)
df2.xs(37, level="week")                          # inner level, any outer
idx = pd.IndexSlice
df2.loc[idx[["WY", "MT"], 36:37], "files"]        # lists and ranges on each level
```

`xs` (cross-section) is the clean way to pick a value on an inner level; `IndexSlice` lets you slice each level independently, which the plain `[:, 37]` syntax cannot express inside `loc` without ambiguity.

### Levels on columns

Pivots with several measures give MultiIndex columns:

```python
p = pd.pivot_table(df, index="state", columns="week", values=["files", "errors"], aggfunc="sum")
p["files"]                     # all weeks of the files measure
p[("files", 37)]               # a single column
p.xs(37, level="week", axis=1) # both measures for week 37
p.columns = p.columns.swaplevel(0, 1)
p = p.sort_index(axis=1)       # week outer, measure inner
```

Column MultiIndexes work with the same tools plus `axis=1`. `swaplevel` and `reorder_levels` change the level order so a report shows weeks then measures; `droplevel` removes a level you do not need.

### Aggregating by level

```python
df2.groupby(level="state").sum()          # total per state
df2.groupby(level=[0, 1]).sum()
df2["files"].sum(level="state")           # removed in pandas 2.0; use groupby(level=)
```

`groupby(level=...)` aggregates across one level of the index. The old `sum(level=)` shortcut was removed in pandas 2.0.

### Flattening for export

```python
flat = p.copy()
flat.columns = [f"{measure}_{week}" for measure, week in flat.columns]
flat = flat.reset_index()
```

openpyxl and CSV need single-level headers. Join the tuple with an underscore or a space, then `reset_index` so the state becomes a normal column. `to_excel` can write a MultiIndex header with merged cells, but the merged header breaks filters and PivotTables downstream, so flat names are safer for anything a client will refresh.

### Common operations table

| Task | Code |
|---|---|
| Create from columns | `df.set_index(["state", "week"])` |
| Select one full key | `df2.loc[("WY", 37)]` |
| Select on inner level | `df2.xs(37, level="week")` |
| Slice both levels | `df2.loc[pd.IndexSlice["WY":"WY", 36:37], :]` |
| Move a level to columns | `df2["files"].unstack("week")` |
| Aggregate one level | `df2.groupby(level="state").sum()` |
| Rename levels | `df2.rename_axis(["State", "Week"])` |
| Back to flat | `df2.reset_index()` |

> **Tip:** If `df2.loc["WY", 37]` gives a confusing result, remember pandas reads `loc[a, b]` as row `a`, column `b`. Use a tuple, `loc[("WY", 37)]`, to mean two index levels.

### Try It Yourself

```python
import io
import pandas as pd

raw = """week,state,files,errors
36,WY,120,3
36,MT,95,6
37,WY,130,2
37,MT,60,5
37,ID,110,2
38,ID,90,4
38,MT,105,3
"""
df = pd.read_csv(io.StringIO(raw))
m = df.set_index(["state", "week"]).sort_index()
print(m, "\n")

print("WY week 37:", m.loc[("WY", 37), "files"])
print("All of WY:\n", m.loc["WY"], "\n")
print("Week 37 across states:\n", m.xs(37, level="week"), "\n")

idx = pd.IndexSlice
print("MT and WY, weeks 36-37:\n", m.loc[idx[["MT", "WY"], 36:37], :], "\n")

full = pd.MultiIndex.from_product([["ID", "MT", "WY"], [36, 37, 38]], names=["state", "week"])
complete = m.reindex(full, fill_value=0)
print("Every state-week, zero-filled:\n", complete["files"].unstack("week"), "\n")

p = pd.pivot_table(df, index="state", columns="week", values=["files", "errors"], aggfunc="sum", fill_value=0)
p.columns = [f"{measure}_{week}" for measure, week in p.columns]
print("Flattened for Excel:\n", p.reset_index().to_string(index=False))
```

### Quiz

1. Which call selects week 37 for every state from a (state, week) MultiIndex?
- [ ] `m.loc[37]`
- [x] `m.xs(37, level="week")`
- [ ] `m.loc["week", 37]`
> loc with a scalar addresses the outer level; xs picks a value on any named level.

2. What does `pd.MultiIndex.from_product([["WY","MT"], [36,37]])` contain?
- [x] Four tuples: every state paired with every week
- [ ] Two tuples: ("WY",36) and ("MT",37)
- [ ] An error, because the lists have equal length
> from_product is the Cartesian product of the level values.

3. Why call `sort_index()` after `set_index(["state","week"])`?
- [ ] It is required for groupby
- [x] Range slicing on a MultiIndex needs a lexsorted index
- [ ] It converts the index to categorical
> Unsorted MultiIndex slices raise UnsortedIndexError or warn about performance.

4. `df["files"].sum(level="state")` in pandas 2.x does what?
- [ ] Sums per state
- [x] Raises, because the level argument was removed
- [ ] Returns the grand total
> Use df.groupby(level="state")["files"].sum() instead.

### Exercises

1. **Error rate per state-week** — Using `m` from the Try It, add an `error_rate` column and select the state-weeks above 4%.
<details><summary>Solution</summary>

```python
m["error_rate"] = m["errors"] / m["files"]
high = m[m["error_rate"] > 0.04]
```

</details>

2. **Swap and sort** — Turn the (state, week) index into (week, state) sorted by week.
<details><summary>Solution</summary>

```python
by_week = m.swaplevel("state", "week").sort_index()
```

</details>

3. **State totals with a subtotal row** — Produce a table of files per state and week with a "Total" row across states.
<details><summary>Solution</summary>

```python
wide = m["files"].unstack("week", fill_value=0)
wide.loc["Total"] = wide.sum()
```

</details>

### Interview Questions

**Q: What is a MultiIndex and when would you keep one rather than reset it?**
A MultiIndex is an index with several levels, so each row (or column) is addressed by a tuple such as ("WY", 37). It arises from `groupby` with multiple keys, `set_index` with a list, `pivot_table` with several values, and `stack`. I keep it when I need level-aware operations: `unstack` to reshape, `xs` to slice an inner level, `groupby(level=)` for subtotals, or `reindex` against `from_product` to force every combination to exist. I reset it at the boundaries, before a merge (which is clearer on columns) and before writing to Excel or SQL.

**Q: How do you slice on an inner level of a MultiIndex?**
`xs(value, level=name)` for a single value, and `pd.IndexSlice` for ranges or lists: `df.loc[pd.IndexSlice[:, 36:37], :]` selects weeks 36 to 37 for every state. The index must be lexsorted with `sort_index()` first, otherwise pandas raises `UnsortedIndexError`. Boolean masks built from `df.index.get_level_values("week")` are a third option and are the most explicit when the condition is complex.

**Q: Why avoid writing MultiIndex headers straight to Excel?**
`to_excel` writes a MultiIndex column header as two rows with merged cells and a blank spacer row. Merged headers break Excel AutoFilter, Tables and PivotTables, and any downstream `read_excel` needs `header=[0,1]` to reconstruct them. For client deliverables I flatten the columns to names like `files_W37`, reset the index and write a single header row, then apply formatting with openpyxl. The exception is a purely visual management summary where nobody will filter the sheet.

**Q: What is the performance implication of an unsorted MultiIndex?**
Lookups on a sorted (lexsorted) MultiIndex use binary search and are O(log n); on an unsorted one pandas falls back to a full scan and emits a `PerformanceWarning`, and range slicing fails outright. `df.index.is_monotonic_increasing` tells you whether it is sorted. In a pipeline I sort once after `set_index` and never append rows to an indexed frame in a loop, because each append destroys the sort.

## Categorical data & memory

A 2-million-row production export has a `state` column with 50 distinct values stored 2 million times as Python strings. The `category` dtype stores each distinct value once and an integer code per row, cutting memory by 10–50× and speeding up `groupby`, `sort` and comparisons. It also gives you ordered bands (`Low < Medium < High`) that sort correctly in reports. Knowing how to measure memory and choose dtypes is what lets a laptop process files that would otherwise need a server.

### Measuring memory

```python
df.info(memory_usage="deep")
df.memory_usage(deep=True).sort_values(ascending=False)
```

Without `deep=True` pandas reports only the 8-byte pointer for each object cell, not the string it points to. `deep=True` tells the truth, and the sorted per-column view shows which columns to fix first: it is nearly always the text columns.

### Converting to category

```python
df["state"] = df["state"].astype("category")
df["agent"] = df["agent"].astype("category")
print(df["state"].cat.categories)           # the distinct values
print(df["state"].cat.codes.head())         # the integer codes
df = pd.read_csv(path, dtype={"state": "category", "agent": "category"})
```

Convert at read time when possible so the object strings never exist. A good rule: convert when the number of unique values is under about 50% of the row count; above that the categories table costs more than it saves.

### Ordered categories

```python
bands = pd.CategoricalDtype(["Low", "Medium", "High"], ordered=True)
df["risk"] = df["risk"].astype(bands)
df.sort_values("risk")                       # Low, Medium, High, not alphabetical
df[df["risk"] >= "Medium"]                   # comparisons work
df["risk"].max()                             # "High"
```

Ordered categories are the correct way to store business bands, priority levels and ISO week labels like `W36`. `pd.cut` and `pd.qcut` return ordered categories automatically.

### Category pitfalls

```python
df["state"] = df["state"].cat.add_categories(["CO"])         # before assigning a new value
df.loc[0, "state"] = "CO"
df["state"] = df["state"].cat.remove_unused_categories()     # after filtering rows
df.groupby("state", observed=True)["files"].sum()           # skip empty categories
```

Assigning a value that is not a category raises `TypeError: Cannot setitem on a Categorical with a new category`. Filtering rows does not drop categories, so `groupby` on a category column returns every category including empty ones (`observed=False` was the old default; pandas 2.1 warns and 3.0 switches to `observed=True`). Concatenating two frames whose categories differ silently produces an object column, so union the categories first with `pd.api.types.union_categoricals` or convert after the concat.

### Smaller numeric dtypes

```python
df["files"] = pd.to_numeric(df["files"], downcast="integer")    # int64 → int16 if it fits
df["rate"] = pd.to_numeric(df["rate"], downcast="float")        # float64 → float32
df["files"] = df["files"].astype("Int32")                       # nullable integer
```

`downcast` picks the smallest type that holds every value. Beware of `float32` for money: it has about 7 significant digits, so premiums above a few million lose cents. Use nullable `Int64`/`Int32` when the column has missing values and must stay an integer rather than becoming `float64`.

### String dtype and Arrow

```python
df["memo"] = df["memo"].astype("string")                  # nullable string dtype
df = pd.read_csv(path, dtype_backend="pyarrow")           # pandas 2.0+: Arrow-backed columns
```

The `string` dtype uses `pd.NA` consistently and, with the `pyarrow` backend, stores text far more compactly than Python objects and runs `.str` operations faster. pandas 3.0 makes the Arrow-backed string dtype the default. Free text such as memos should be `string`; low-cardinality text should be `category`.

| Column type | Best dtype |
|---|---|
| Few distinct values (state, agent, status) | `category` |
| Free text (memo, address) | `string` / `string[pyarrow]` |
| Whole numbers with no NaN | smallest `int` via downcast |
| Whole numbers with NaN | `Int64` (nullable) |
| Money | `float64`, or `Decimal` objects for ledgers |
| Yes/No | `bool`, or `boolean` if NaN possible |
| Dates | `datetime64[ns]` |

> **Warning:** A category's codes are meaningless outside pandas. Never write `.cat.codes` to a file as if they were IDs, and never `merge` on a category column against an object column without converting one side, or you will get an object dtype and a slower join.

### Try It Yourself

```python
import io
import numpy as np
import pandas as pd

states = np.random.choice(["WY", "MT", "ID", "TX", "CO"], size=200_000)
agents = np.random.choice([f"agent_{i:02d}" for i in range(20)], size=200_000)
df = pd.DataFrame({"state": states, "agent": agents,
                   "files": np.random.randint(1, 300, 200_000).astype("int64"),
                   "risk": np.random.choice(["Low", "Medium", "High"], size=200_000)})

before = df.memory_usage(deep=True).sum()
opt = df.copy()
opt["state"] = opt["state"].astype("category")
opt["agent"] = opt["agent"].astype("category")
opt["files"] = pd.to_numeric(opt["files"], downcast="integer")
opt["risk"] = opt["risk"].astype(pd.CategoricalDtype(["Low", "Medium", "High"], ordered=True))
after = opt.memory_usage(deep=True).sum()

print(f"before: {before/1e6:.1f} MB   after: {after/1e6:.1f} MB   saved: {100*(1-after/before):.0f}%")
print(opt.dtypes, "\n")
print("codes for state:", opt["state"].cat.codes.head(3).tolist(), opt["state"].cat.categories.tolist())
print("risk sorted correctly:", opt["risk"].drop_duplicates().sort_values().tolist())
print("High-risk rows:", int((opt["risk"] >= "High").sum()))
print(opt.groupby("risk", observed=True)["files"].mean().round(1))
```

### Quiz

1. Why does `df.info()` under-report memory for text columns?
- [x] Without memory_usage="deep" it counts only the pointer, not the string
- [ ] It ignores text columns entirely
- [ ] It reports memory in kilobytes
> Object columns store pointers to Python strings; deep=True measures the strings too.

2. What happens when you assign a value that is not one of the categories?
- [ ] It is added automatically
- [x] A TypeError is raised
- [ ] It becomes NaN
> Add it first with cat.add_categories, then assign.

3. Which dtype keeps integers when a column has missing values?
- [ ] int64
- [x] Int64
- [ ] float32
> The capitalised nullable integer types support pd.NA; plain int64 cannot hold NaN.

4. After filtering rows, `groupby("risk")` shows a "Medium" group with 0 rows. Why?
- [x] Unused categories remain and observed=False includes them
- [ ] The filter did not work
- [ ] Categorical groupby always adds an empty group
> Use observed=True or cat.remove_unused_categories().

### Exercises

1. **Read lean** — Read a CSV with columns `state, agent, files, memo` using the smallest sensible dtypes at read time.
<details><summary>Solution</summary>

```python
df = pd.read_csv(path, dtype={"state": "category", "agent": "category",
                              "files": "int32", "memo": "string"})
```

</details>

2. **Priority order** — Make a `priority` column with values `P3, P2, P1` sort so that P1 comes first.
<details><summary>Solution</summary>

```python
df["priority"] = df["priority"].astype(pd.CategoricalDtype(["P1", "P2", "P3"], ordered=True))
df = df.sort_values("priority")
```

</details>

3. **Safe concat** — Two frames both have a category `state` column with different category sets. Concatenate them and keep `state` categorical.
<details><summary>Solution</summary>

```python
from pandas.api.types import union_categoricals
cats = union_categoricals([a["state"], b["state"]]).categories
a["state"] = a["state"].cat.set_categories(cats)
b["state"] = b["state"].cat.set_categories(cats)
out = pd.concat([a, b], ignore_index=True)
```

</details>

### Interview Questions

**Q: How does the category dtype save memory and when does it not help?**
A categorical stores an array of integer codes (int8 if there are under 128 categories) plus one copy of each distinct value, so a 2-million-row state column drops from roughly 120 MB of Python strings to about 2 MB. It also speeds up `groupby`, `sort_values` and equality filters because they operate on the integer codes. It does not help, and can hurt, when the cardinality is high, such as a unique file ID per row: the categories table is as big as the column, plus the codes. My rule of thumb is to convert when unique values are below a few percent of the row count.

**Q: A colleague's merge got slower after converting keys to category. Why?**
Merging a category column against an object column forces pandas to convert, producing an object join key and losing the benefit; merging two categoricals with different category sets does the same. The fix is to give both sides the identical `CategoricalDtype` before the merge, at which point the join runs on integer codes and is faster than object strings. This is also why I set dtypes at read time from a shared dictionary rather than converting ad hoc in each script.

**Q: What is the difference between object, string and string[pyarrow] dtypes?**
`object` is a NumPy array of pointers to arbitrary Python objects; it is the pre-1.0 default, mixes types freely and uses `NaN` for missing. `string` (pandas 1.0+) is a dedicated extension dtype that guarantees text, uses `pd.NA` and makes `.str` methods return nullable results. `string[pyarrow]` stores the same data in Arrow buffers, which use far less memory and run vectorised string kernels in C++, often 5–10× faster. pandas 3.0 makes the Arrow-backed string the default, so I already write code that handles `pd.NA` rather than `NaN` in text columns.

**Q: How would you fit a 10 GB CSV into 8 GB of RAM with pandas?**
First reduce width and dtypes: `usecols` to drop unneeded columns, `dtype=` with categories for low-cardinality text and downcast integers, and `parse_dates` for dates. That alone often gives a 5–10× reduction. If it still does not fit, process in `chunksize` batches and aggregate per chunk, or convert once to Parquet and read only needed columns. If the workload is truly larger than memory, I move to Polars, DuckDB or a database and use pandas only for the final report shaping.

# LEVEL: Expert

## Performance (vectorisation, query/eval, chunking, dtypes)

The difference between a pandas script that runs in 4 seconds and one that runs in 40 minutes is rarely the hardware. It is loops where there should be arrays, object columns where there should be categories, a whole file loaded when a column would do, and copies made by accident. This chapter is the checklist a senior analyst applies before asking for a bigger machine.

### Measure first

```python
import time
t0 = time.perf_counter()
result = step(df)
print(f"{time.perf_counter() - t0:.3f}s")
```

In Jupyter use `%timeit step(df)` for a repeated timing and `%prun` for a profile. Profile the pipeline once and fix the slowest step; the top item is usually 80% of the runtime.

### Rule 1: no Python loops over rows

```python
# slow: 1M iterations in Python
for i, row in df.iterrows():
    df.loc[i, "premium"] = row["coverage"] / 1000 * row["rate"]

# fast: one C loop
df["premium"] = df["coverage"] / 1000 * df["rate"]
```

`iterrows` plus `df.loc[i, ...] = ` assignment is the worst pattern in pandas: each assignment may re-check the index and reallocate. The vectorised line is 1000× faster on a million rows.

### Rule 2: the right dtype at read time

```python
df = pd.read_csv(
    "production.csv",
    usecols=["file_id", "state", "received", "coverage", "rate"],
    dtype={"state": "category", "coverage": "float32", "file_id": "int32"},
    parse_dates=["received"],
    engine="pyarrow",             # pandas 2.0+, multithreaded parsing
)
```

`usecols` avoids parsing columns you never use, `dtype` avoids a second conversion pass and the memory of object strings, and `engine="pyarrow"` parses several times faster than the default C engine on wide files.

### Rule 3: query and eval for big expressions

```python
mask = df[(df["state"] == "WY") & (df["coverage"] > 250_000) & (df["rate"] < 0.02)]
mask = df.query("state == 'WY' and coverage > 250000 and rate < 0.02")
df.eval("premium = coverage / 1000 * rate", inplace=True)
limit = 250_000
df.query("coverage > @limit")
```

`query` and `eval` use the `numexpr` engine when it is installed, which evaluates the whole expression in one pass over the data without allocating an intermediate boolean array for every comparison. On frames above ~100k rows they are typically 1.5–3× faster and far more readable. Reference Python variables with `@name`.

### Rule 4: chunking for files larger than memory

```python
totals = {}
for chunk in pd.read_csv("huge.csv", chunksize=500_000, dtype={"state": "category"}):
    part = chunk.groupby("state", observed=True)["files"].sum()
    for state, n in part.items():
        totals[state] = totals.get(state, 0) + n
result = pd.Series(totals).sort_values(ascending=False)
```

`chunksize` returns an iterator of DataFrames. Aggregate each chunk and combine the partial results; this works for sums, counts, min and max, and for means if you carry sum and count separately. It does not work for medians or anything that needs all rows at once, which is where Parquet plus DuckDB or Polars come in.

### Rule 5: Parquet instead of CSV

```python
df.to_parquet("production.parquet", index=False)
df = pd.read_parquet("production.parquet", columns=["state", "coverage"])
```

Parquet stores dtypes, compresses columns and lets you read a subset of columns without touching the rest. Reading is typically 10–50× faster than CSV and the file is 5–10× smaller. Convert once, then every downstream script reads Parquet.

### Rule 6: avoid accidental copies and chained assignment

```python
sub = df[df["state"] == "WY"]
sub["flag"] = True                     # SettingWithCopyWarning: may not modify df
sub = df.loc[df["state"] == "WY"].copy()
sub["flag"] = True                     # clear intent
df.loc[df["state"] == "WY", "flag"] = True   # modify the original in one step
```

pandas 2.x with Copy-on-Write (`pd.options.mode.copy_on_write = True`, default in 3.0) makes every derived frame behave like a copy, removing the warning and the ambiguity. Under CoW, writing `df["x"] = ...` is cheap and chained assignment `df["a"]["b"] = 1` never works, so write `df.loc[...]`.

### Rule 7: concat once, not in a loop

```python
frames = [pd.read_csv(p) for p in paths]
df = pd.concat(frames, ignore_index=True)
```

Appending inside a loop re-allocates the whole frame each time (quadratic). Collect pieces in a list and `concat` once.

| Symptom | Fix |
|---|---|
| Slow row loop | Vectorise, `np.where`, `map`, `merge` |
| High memory | `usecols`, `dtype=category`, downcast, Parquet |
| Slow filter on many conditions | `query` / `eval` with numexpr |
| File does not fit | `chunksize`, Parquet column subsets, DuckDB |
| Slow groupby on strings | Convert keys to `category` |
| Slow repeated `.loc` lookups | `set_index` + sort, or `merge` |

> **Interview note:** Interviewers ask "your pandas job takes an hour, what do you do?" The answer they want is a method, not a trick: profile, then vectorise the hot loop, then fix dtypes and I/O, then chunk or change engine. Quote numbers you measured.

### Try It Yourself

```python
import io, time
import numpy as np
import pandas as pd

n = 300_000
rng = np.random.default_rng(1)
df = pd.DataFrame({
    "state": rng.choice(["WY", "MT", "ID", "TX"], n),
    "coverage": rng.integers(20_000, 900_000, n).astype("float64"),
    "rate": rng.uniform(0.005, 0.03, n),
})

def timed(label, fn):
    t = time.perf_counter(); out = fn(); dt = (time.perf_counter() - t) * 1000
    print(f"{label:<38}{dt:8.1f} ms"); return out

# 1. loop vs vectorised (loop on a 20k slice only, scaled up)
small = df.head(20_000)
def loop():
    out = []
    for r in small.itertuples(index=False):
        out.append(r.coverage / 1000 * r.rate)
    return pd.Series(out)
timed("itertuples loop (20k rows)", loop)
timed("vectorised (300k rows)", lambda: df["coverage"] / 1000 * df["rate"])

# 2. boolean mask vs query
timed("boolean mask", lambda: df[(df["state"] == "WY") & (df["coverage"] > 250_000) & (df["rate"] < 0.02)])
timed("query()", lambda: df.query("state == 'WY' and coverage > 250000 and rate < 0.02"))

# 3. groupby on object vs category
cat = df.assign(state=df["state"].astype("category"))
timed("groupby object key", lambda: df.groupby("state")["coverage"].sum())
timed("groupby category key", lambda: cat.groupby("state", observed=True)["coverage"].sum())

# 4. memory
print(f"object frame: {df.memory_usage(deep=True).sum()/1e6:.1f} MB, "
      f"category frame: {cat.memory_usage(deep=True).sum()/1e6:.1f} MB")

# 5. chunked aggregation from an in-memory CSV
csv = df.to_csv(index=False)
totals = None
for chunk in pd.read_csv(io.StringIO(csv), chunksize=100_000):
    part = chunk.groupby("state")["coverage"].sum()
    totals = part if totals is None else totals.add(part, fill_value=0)
print("\nChunked totals match:", np.allclose(totals.sort_index(), df.groupby("state")["coverage"].sum().sort_index()))
```

### Quiz

1. Which read_csv argument avoids parsing columns you will never use?
- [ ] `nrows`
- [x] `usecols`
- [ ] `skiprows`
> usecols restricts parsing to the named columns, saving time and memory.

2. What does `df.query("coverage > @limit")` do with `@limit`?
- [x] Substitutes the Python variable named limit
- [ ] Treats it as a column named limit
- [ ] Raises a syntax error
> The @ prefix references local Python variables inside query and eval strings.

3. Why is appending to a DataFrame inside a loop slow?
- [ ] DataFrames cannot grow
- [x] Each append copies the whole frame, giving quadratic cost
- [ ] The index must be re-sorted every time
> Build a list of pieces and call pd.concat once.

4. What does Copy-on-Write change?
- [ ] Nothing; it is a linter setting
- [x] Derived frames behave as copies, ending SettingWithCopyWarning ambiguity
- [ ] It makes every operation in place
> CoW (default in pandas 3.0) copies lazily only when a write would affect another object.

### Exercises

1. **Lean read** — Write the `read_csv` call for a 4 GB export where you need only `file_id, state, coverage, received`, with correct dtypes and date parsing.
<details><summary>Solution</summary>

```python
df = pd.read_csv("export.csv",
                 usecols=["file_id", "state", "coverage", "received"],
                 dtype={"file_id": "int64", "state": "category", "coverage": "float64"},
                 parse_dates=["received"], engine="pyarrow")
```

</details>

2. **Chunked mean** — Compute the mean coverage per state from a file too large for memory.
<details><summary>Solution</summary>

```python
s = c = None
for chunk in pd.read_csv("big.csv", chunksize=500_000, usecols=["state", "coverage"]):
    g = chunk.groupby("state")["coverage"].agg(["sum", "count"])
    s = g["sum"] if s is None else s.add(g["sum"], fill_value=0)
    c = g["count"] if c is None else c.add(g["count"], fill_value=0)
mean = (s / c).sort_values(ascending=False)
```

</details>

3. **Rewrite with eval** — Replace three separate column assignments computing `units = ceil(coverage/1000)`, `premium = units * rate`, `premium_floor = max(premium, 150)` with vectorised code that avoids intermediate frames.
<details><summary>Solution</summary>

```python
import numpy as np
df["units"] = np.ceil(df["coverage"] / 1000)
df.eval("premium = units * rate", inplace=True)
df["premium_floor"] = df["premium"].clip(lower=150)
```

</details>

### Interview Questions

**Q: A daily pandas job takes 45 minutes on a 3 GB CSV. Walk me through speeding it up.**
I profile first: time each stage and look at `memory_usage(deep=True)`. Typically the read is a third of the time, so I add `usecols`, explicit `dtype` with categories, `parse_dates` and `engine="pyarrow"`, and I convert the file to Parquet once so subsequent runs skip parsing entirely. Then I search for `iterrows`, `apply(axis=1)` and loops that append, and replace them with vectorised expressions, `map`, `merge` or `groupby().transform`. Finally I check for repeated `.loc` lookups by key, which become a merge or an indexed lookup. On a comparable Stewart production file this sequence took a report from about 40 minutes to under 2, and I keep the before/after timings in the script's docstring.

**Q: When do query and eval actually help, and what are their limits?**
They help on large frames with several conditions because numexpr evaluates the whole expression in one pass with less temporary memory; on small frames the parsing overhead makes them slower. The syntax is a subset of Python: you cannot call arbitrary functions, column names with spaces need backticks, and string comparisons only support `==`, `!=`, `in` and `not in`. I use them for readability in long filters and for memory on frames above roughly 100k rows, and I fall back to boolean masks whenever the logic needs a method call such as `.str.contains`.

**Q: Explain the SettingWithCopyWarning and how Copy-on-Write resolves it.**
Before pandas 2, `df[mask]` might return a view or a copy depending on dtype layout, so assigning into it might or might not modify `df`; the warning flagged that ambiguity. The correct fix was always either `.copy()` when you want an independent frame or a single `df.loc[mask, col] = value` when you want to modify the original. Copy-on-Write, opt-in in 2.x and the default in 3.0, makes every derived object behave as an independent copy and defers the physical copy until a write happens, so the warning disappears and the semantics become predictable at almost no performance cost.

**Q: When would you leave pandas for Polars or DuckDB?**
When the data exceeds memory, when the workload is dominated by joins and groupbys on tens of millions of rows, or when you need multithreading without writing it yourself. Polars has a lazy engine that optimises the whole query and uses all cores; DuckDB runs SQL directly over Parquet and CSV files with almost no memory footprint and returns a pandas DataFrame with `.df()`. My usual split is DuckDB or Polars for the heavy aggregation and pandas for the last mile, formatting the result and writing the Excel report, because that is where pandas' ecosystem is strongest.

## Validation & data-quality checks (schemas, assertions)

A report that is wrong is worse than a report that is late. In title-insurance production a rate applied to the wrong state, a duplicated file ID or a week that silently lost half its rows costs real money and trust. Expert pandas users build validation into the pipeline so that bad input stops the run with a clear message instead of producing a plausible-looking Excel file. This chapter shows lightweight assertions, a reusable check function, and the `pandera` schema library.

### Assertions at the boundaries

```python
expected = ["file_id", "state", "received", "coverage", "rate"]
missing = set(expected) - set(df.columns)
assert not missing, f"missing columns: {missing}"

assert df["file_id"].is_unique, "duplicate file_id"
assert df["state"].isin(valid_states).all(), df.loc[~df["state"].isin(valid_states), "state"].unique()
assert df["coverage"].between(1, 50_000_000).all()
assert df["received"].notna().all() and (df["received"] <= pd.Timestamp.today()).all()
assert len(df) > 0.5 * last_week_rows, f"row count dropped to {len(df)}"
```

Check inputs right after reading and outputs right before writing. Every assertion message should say what was wrong and show the offending values, because the person reading the error at 7 a.m. on Monday will not have the script open.

### A reusable check function

```python
def check(df, name, mask, sample=5):
    bad = df.loc[~mask]
    if len(bad):
        raise ValueError(f"{name}: {len(bad)} rows failed\n{bad.head(sample).to_string()}")
    return df

df = (df.pipe(check, "positive coverage", df["coverage"] > 0)
        .pipe(check, "known state", df["state"].isin(valid_states))
        .pipe(check, "rate in range", df["rate"].between(0.001, 0.05)))
```

`pipe` keeps validation inline in a method chain. Collecting all failures before raising is friendlier than stopping at the first, so a production version appends messages to a list and raises once at the end.

### Reconciliation checks

```python
assert abs(df["premium"].sum() - source_total) < 0.01, "premium total does not reconcile"
counts = df.groupby("state", observed=True).size()
assert (counts == expected_counts).all()
pd.testing.assert_frame_equal(new_report, old_report, check_like=True)
```

Reconciling to a control total from the source system is the single most valuable check in a reporting pipeline. `pd.testing.assert_frame_equal` and `assert_series_equal` compare two frames with tolerances (`rtol`, `atol`) and ignore column order with `check_like=True`; they are the backbone of pandas unit tests.

### pandera schemas

```python
import pandera.pandas as pa       # pandas 2 + pandera 0.20+; older: import pandera as pa

schema = pa.DataFrameSchema(
    {
        "file_id": pa.Column(int, unique=True),
        "state": pa.Column(str, pa.Check.isin(["WY", "MT", "ID", "TX"])),
        "received": pa.Column("datetime64[ns]", pa.Check.le(pd.Timestamp("2026-12-31"))),
        "coverage": pa.Column(float, pa.Check.between(1, 50_000_000)),
        "rate": pa.Column(float, pa.Check.in_range(0.001, 0.05), nullable=False),
        "memo": pa.Column(str, nullable=True, required=False),
    },
    strict=True,        # no unexpected columns
    coerce=True,        # cast to the declared dtype before checking
)
clean = schema.validate(df, lazy=True)     # lazy: collect every failure, then raise SchemaErrors
```

A schema documents the contract in one place and produces a table of every failing row and check. `lazy=True` reports all problems at once. Decorate pipeline functions with `@pa.check_input(schema)` and `@pa.check_output(schema)` to validate automatically. The alternative library `great_expectations` suits teams that want HTML data-docs and scheduled suites; pandera is lighter and lives in code.

### Profiling for unknown data

```python
df.describe(include="all").T
df.isna().mean().sort_values(ascending=False)          # missing rate per column
df.nunique()
df.duplicated(subset=["file_id"]).sum()
df.select_dtypes("object").apply(lambda s: s.str.strip().ne(s).sum())   # cells with stray whitespace
```

Before you write checks for a new client file, profile it. The missing-rate view and the duplicate count expose most surprises in a minute.

| Check type | Example |
|---|---|
| Schema | Columns present, dtypes correct, no extras |
| Domain | State in list, rate in range, dates not in future |
| Uniqueness | `file_id.is_unique` |
| Completeness | Required columns have no NaN |
| Reconciliation | Totals match source, row count near last week |
| Referential | Every `state` exists in the rate table |

> **Tip:** Save the failing rows to `rejects_<date>.csv` before raising. The operations team can fix the source while you re-run, and the file is evidence when a client asks why the report was late.

### Try It Yourself

```python
import io
import pandas as pd

raw = """file_id,state,received,coverage,rate
1001,WY,2026-09-01,187450,0.0055
1002,MT,2026-09-02,250000,0.0060
1003,XX,2026-09-02,99999,0.0052
1004,ID,2026-09-03,-5,0.0050
1002,MT,2026-09-04,300000,0.0060
1006,TX,2027-01-15,500000,0.0999
"""
df = pd.read_csv(io.StringIO(raw), parse_dates=["received"])
valid_states = {"WY", "MT", "ID", "TX"}
today = pd.Timestamp("2026-09-16")

problems = []
def check(name, mask):
    bad = df.loc[~mask]
    if len(bad):
        problems.append((name, bad.index.tolist()))

check("file_id unique", ~df["file_id"].duplicated(keep=False))
check("state known", df["state"].isin(valid_states))
check("coverage positive", df["coverage"] > 0)
check("rate in range", df["rate"].between(0.001, 0.05))
check("received not in future", df["received"] <= today)

if problems:
    print("VALIDATION FAILED")
    for name, rows in problems:
        print(f"  {name}: rows {rows}")
    bad_rows = sorted({r for _, rows in problems for r in rows})
    print("\nRejected rows:\n", df.loc[bad_rows].to_string())
    clean = df.drop(index=bad_rows)
else:
    clean = df

print(f"\n{len(clean)} of {len(df)} rows passed")
control_total = 187450   # accepted rows per the source system (only file 1001 survives)
assert abs(clean["coverage"].sum() - control_total) < 0.01, "does not reconcile"
print("Reconciled to control total:", control_total)
```

### Quiz

1. Which check most directly catches "the source system only sent half the rows"?
- [ ] `df["file_id"].is_unique`
- [x] Comparing the row count or total to last run's or to a control total
- [ ] `df.dtypes`
> Reconciliation to a known total detects silent truncation.

2. What does `lazy=True` do in `schema.validate`?
- [x] Collects every failure before raising
- [ ] Skips validation until the data is used
- [ ] Validates only the first 100 rows
> Lazy validation reports all failing checks and rows in one SchemaErrors.

3. Which function compares two DataFrames with a numeric tolerance?
- [ ] `df.equals`
- [x] `pd.testing.assert_frame_equal`
- [ ] `df.compare`
> assert_frame_equal supports rtol/atol and check_like; equals is exact.

4. Where should input validation run?
- [ ] After the report is written
- [x] Immediately after reading, before any transformation
- [ ] Only in unit tests
> Failing early with the raw rows makes the cause obvious and prevents bad output.

### Exercises

1. **Referential check** — Assert that every `state` in `df` exists in `rates["state"]`, printing the missing ones.
<details><summary>Solution</summary>

```python
missing = set(df["state"]) - set(rates["state"])
assert not missing, f"states with no rate: {sorted(missing)}"
```

</details>

2. **Collect all failures** — Rewrite the `check` helper so it returns a DataFrame of (check, file_id) pairs for every failing row instead of raising.
<details><summary>Solution</summary>

```python
def run_checks(df, checks):
    out = []
    for name, mask in checks.items():
        for fid in df.loc[~mask, "file_id"]:
            out.append({"check": name, "file_id": fid})
    return pd.DataFrame(out, columns=["check", "file_id"])

rejects = run_checks(df, {"state known": df["state"].isin(valid_states),
                          "coverage positive": df["coverage"] > 0})
```

</details>

3. **pandera schema** — Write a schema for a QA sheet with `agent` (str), `files` (int ≥ 0), `errors` (int ≥ 0, must not exceed files).
<details><summary>Solution</summary>

```python
import pandera.pandas as pa
schema = pa.DataFrameSchema(
    {"agent": pa.Column(str), "files": pa.Column(int, pa.Check.ge(0)),
     "errors": pa.Column(int, pa.Check.ge(0))},
    checks=pa.Check(lambda d: d["errors"] <= d["files"], error="errors exceed files"),
    coerce=True)
```

</details>

### Interview Questions

**Q: How do you make sure a weekly report is correct before it goes out?**
Three layers. Input validation right after reading: schema, domains, uniqueness and a row-count comparison with the previous run. Reconciliation: the report's totals must match a control total from the source system to the cent, and per-state counts must match the raw file. Output tests: `assert_frame_equal` against a golden copy in a unit test for a fixed sample input, so any change in logic is caught before it reaches production. When any layer fails the script writes a rejects file, sends the error and does not produce the Excel, because a missing report triggers a question while a wrong one triggers a decision.

**Q: Why use pandera instead of plain asserts?**
Plain asserts are fine for three or four checks, but they stop at the first failure, scatter the contract across the code and give terse messages. A pandera schema is one declarative object that documents column names, dtypes, nullability and domain rules, validates lazily to report every failing row and check at once, coerces dtypes on the way in, and can be attached to functions with decorators so validation is not forgotten. The trade-off is a dependency and a small learning curve, so for one-off notebooks I still use asserts, and for anything scheduled I use a schema.

**Q: What is the difference between df.equals and assert_frame_equal?**
`equals` returns a boolean and requires exact equality of values, dtypes and the order of rows and columns, treating NaN as equal to NaN in the same position. `assert_frame_equal` raises with a detailed diff showing the first differing values, supports `rtol`/`atol` for floats, `check_like=True` to ignore row and column order, `check_dtype=False` and similar switches. In tests I always use `assert_frame_equal` because the failure message tells me which cell differs; `equals` only tells me that something does.

**Q: How do you validate data you have never seen before, such as a new client's rate matrix?**
I profile before I write rules: `describe(include="all")`, missing rates, `nunique`, duplicate keys, and string columns checked for stray whitespace and case variants. From that I draft a schema with the client's stated rules, run it lazily, and review the failures with them, because half the time a failure is a rule I misunderstood rather than bad data. The agreed schema then becomes the acceptance test for every future file, and I version it alongside the pipeline so the contract history is visible.

## Building the weekly production report (pandas → Excel with formatting via openpyxl/xlsxwriter)

This chapter assembles the whole course into the deliverable that pays the bills: a Monday-morning workbook with a summary sheet, per-state detail, conditional formatting, number formats, frozen headers and a chart, produced by one script from the raw export. `to_excel` gets the numbers in; openpyxl or XlsxWriter make it look like something a manager opens without asking for "the nice version".

### Step 1: compute the tables

```python
raw = pd.read_csv("production_export.csv", parse_dates=["received", "closed"],
                  dtype={"state": "category", "agent": "category"})
raw["week"] = raw["received"].dt.to_period("W-SUN").astype(str)
raw["days_open"] = (raw["closed"] - raw["received"]).dt.days

summary = (raw.groupby(["state", "week"], observed=True)
              .agg(files=("file_id", "count"), errors=("errors", "sum"),
                   avg_days=("days_open", "mean"))
              .assign(error_rate=lambda d: d["errors"] / d["files"])
              .reset_index())
wide = summary.pivot_table(index="state", columns="week", values="files",
                           aggfunc="sum", fill_value=0, margins=True, margins_name="Total")
```

Keep the computation separate from the formatting: `summary` and `wide` are plain DataFrames you can unit-test.

### Step 2: write several sheets with ExcelWriter

```python
with pd.ExcelWriter("weekly_report.xlsx", engine="openpyxl") as xw:
    wide.to_excel(xw, sheet_name="Summary")
    summary.to_excel(xw, sheet_name="Detail", index=False)
    for state, part in raw.groupby("state", observed=True):
        part.drop(columns="state").to_excel(xw, sheet_name=str(state)[:31], index=False)
```

`ExcelWriter` as a context manager saves on exit. Sheet names are limited to 31 characters and cannot contain `[]:*?/\`. `engine="xlsxwriter"` is faster for large sheets and has richer formatting; `openpyxl` can also re-open and edit existing files, which XlsxWriter cannot.

### Step 3: format with openpyxl

```python
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule, ColorScaleRule
from openpyxl.utils import get_column_letter

wb = load_workbook("weekly_report.xlsx")
ws = wb["Detail"]
header_fill = PatternFill("solid", fgColor="150458")
for cell in ws[1]:
    cell.font = Font(bold=True, color="FFFFFF"); cell.fill = header_fill
    cell.alignment = Alignment(horizontal="center")
ws.freeze_panes = "A2"
ws.auto_filter.ref = ws.dimensions

for col_cells in ws.columns:
    width = max(len(str(c.value)) if c.value is not None else 0 for c in col_cells) + 2
    ws.column_dimensions[get_column_letter(col_cells[0].column)].width = min(width, 40)

rate_col = get_column_letter(list(summary.columns).index("error_rate") + 1)
for cell in ws[rate_col][1:]:
    cell.number_format = "0.0%"
ws.conditional_formatting.add(f"{rate_col}2:{rate_col}{ws.max_row}",
    CellIsRule(operator="greaterThan", formula=["0.04"], fill=PatternFill("solid", fgColor="F8CBAD")))
wb.save("weekly_report.xlsx")
```

Number formats are Excel format strings (`"#,##0"`, `"0.0%"`, `"$#,##0.00"`, `"yyyy-mm-dd"`). Conditional formatting rules live in the workbook, so they keep working when the client edits values. `freeze_panes` and `auto_filter` are the two touches managers notice most.

### Step 3 alternative: XlsxWriter in one pass

```python
with pd.ExcelWriter("weekly_report.xlsx", engine="xlsxwriter") as xw:
    summary.to_excel(xw, sheet_name="Detail", index=False)
    wb, ws = xw.book, xw.sheets["Detail"]
    hdr = wb.add_format({"bold": True, "bg_color": "#150458", "font_color": "white", "border": 1})
    pct = wb.add_format({"num_format": "0.0%"})
    for i, name in enumerate(summary.columns):
        ws.write(0, i, name, hdr)
    ws.set_column("F:F", 12, pct)
    ws.freeze_panes(1, 0); ws.autofilter(0, 0, len(summary), len(summary.columns) - 1)
    ws.conditional_format(f"F2:F{len(summary)+1}",
        {"type": "cell", "criteria": ">", "value": 0.04, "format": wb.add_format({"bg_color": "#F8CBAD"})})
    chart = wb.add_chart({"type": "column"})
    chart.add_series({"name": "Files", "categories": ["Detail", 1, 1, len(summary), 1],
                      "values": ["Detail", 1, 2, len(summary), 2]})
    ws.insert_chart("H2", chart)
```

XlsxWriter formats are applied as you write, in one pass, and native charts are simple. Choose it for new files you generate from scratch; choose openpyxl when you must fill a client's existing template.

### Step 4: Styler for quick colour-coded output

```python
styled = (summary.style
            .format({"error_rate": "{:.1%}", "avg_days": "{:.1f}", "files": "{:,}"})
            .background_gradient(subset=["error_rate"], cmap="Reds")
            .highlight_max(subset=["files"], color="#C6EFCE"))
styled.to_excel("styled.xlsx", engine="openpyxl", index=False)
```

`DataFrame.style` exports static fills and number formats through openpyxl. It is the fastest route to a heat-mapped table, but it bakes colours in as static styles rather than rules, so it suits one-off snapshots more than templates.

| Need | Tool |
|---|---|
| Numbers into sheets | `to_excel`, `ExcelWriter` |
| Edit an existing template | openpyxl |
| Fast new file with charts | XlsxWriter |
| Quick heat map | `Styler.to_excel` |
| Formulas that recalc in Excel | write strings starting with `=` (either engine) |

> **Warning:** openpyxl writes formulas as text and does not calculate them; the cached value is empty until Excel opens the file. If a downstream script reads the file with `read_excel`, it will see NaN for formula cells. Compute values in pandas and write numbers unless the client specifically needs live formulas.

### Try It Yourself

```python
import io
import pandas as pd

raw = """file_id,state,agent,received,closed,errors
1,WY,Asad,2026-09-01,2026-09-03,0
2,MT,Hina,2026-09-01,2026-09-05,2
3,WY,Hina,2026-09-04,2026-09-08,1
4,ID,Asad,2026-09-09,2026-09-11,0
5,MT,Asad,2026-09-10,2026-09-12,3
6,WY,Asad,2026-09-16,2026-09-17,0
7,ID,Hina,2026-09-15,2026-09-19,1
"""
df = pd.read_csv(io.StringIO(raw), parse_dates=["received", "closed"])
df["week"] = df["received"].dt.to_period("W-SUN").astype(str)
df["days_open"] = (df["closed"] - df["received"]).dt.days

summary = (df.groupby(["state", "week"])
             .agg(files=("file_id", "count"), errors=("errors", "sum"), avg_days=("days_open", "mean"))
             .assign(error_rate=lambda d: d["errors"] / d["files"]).reset_index())
wide = summary.pivot_table(index="state", columns="week", values="files",
                           aggfunc="sum", fill_value=0, margins=True, margins_name="Total")
print("Summary sheet:\n", wide, "\n")
print("Detail sheet:\n", summary.round(3).to_string(index=False), "\n")

try:
    import openpyxl
    from openpyxl.styles import Font, PatternFill
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as xw:
        wide.to_excel(xw, sheet_name="Summary")
        summary.to_excel(xw, sheet_name="Detail", index=False)
        ws = xw.sheets["Detail"]
        for cell in ws[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill("solid", fgColor="150458")
        ws.freeze_panes = "A2"
        for cell in ws["F"][1:]:
            cell.number_format = "0.0%"
    print(f"weekly_report.xlsx built in memory: {len(buf.getvalue()):,} bytes, sheets: Summary, Detail")
except ImportError:
    print("openpyxl is not installed in this runner; the same code writes the workbook locally.")
    print("CSV fallback of the Detail sheet:\n", summary.to_csv(index=False))
```

### Quiz

1. Which engine can open and modify an existing .xlsx file?
- [x] openpyxl
- [ ] xlsxwriter
- [ ] Both
> XlsxWriter only creates new files; openpyxl reads and writes.

2. What is the maximum length of an Excel sheet name?
- [ ] 255
- [x] 31
- [ ] 64
> Excel limits sheet names to 31 characters and forbids []:*?/\ characters.

3. A formula written by openpyxl shows as NaN in `read_excel`. Why?
- [ ] openpyxl wrote it as text
- [x] The cached value is empty until Excel recalculates the file
- [ ] read_excel cannot read formulas
> Python engines do not evaluate formulas; write computed values or open in Excel first.

4. Which approach keeps conditional colours working after the client edits values?
- [ ] `Styler.background_gradient`
- [x] A conditional formatting rule (CellIsRule or `conditional_format`)
- [ ] Static fills per cell
> Rules are evaluated by Excel; Styler and static fills are frozen colours.

### Exercises

1. **One sheet per agent** — Write a workbook with a sheet per agent, each containing only that agent's rows, index omitted.
<details><summary>Solution</summary>

```python
with pd.ExcelWriter("by_agent.xlsx", engine="openpyxl") as xw:
    for agent, part in df.groupby("agent"):
        part.to_excel(xw, sheet_name=str(agent)[:31], index=False)
```

</details>

2. **Currency and dates** — Using openpyxl, format column `premium` as `$#,##0.00` and column `received` as `yyyy-mm-dd` on sheet "Detail".
<details><summary>Solution</summary>

```python
from openpyxl import load_workbook
from openpyxl.utils import get_column_letter
wb = load_workbook("weekly_report.xlsx"); ws = wb["Detail"]
cols = {c.value: get_column_letter(c.column) for c in ws[1]}
for cell in ws[cols["premium"]][1:]: cell.number_format = "$#,##0.00"
for cell in ws[cols["received"]][1:]: cell.number_format = "yyyy-mm-dd"
wb.save("weekly_report.xlsx")
```

</details>

3. **Live total row** — Add a row under the Detail table with an Excel `SUM` formula for the files column so it recalculates in Excel.
<details><summary>Solution</summary>

```python
n = ws.max_row
ws.cell(row=n + 1, column=1, value="Total")
ws.cell(row=n + 1, column=3, value=f"=SUM(C2:C{n})")
wb.save("weekly_report.xlsx")
```

</details>

### Interview Questions

**Q: Describe how you would automate a weekly Excel report end to end.**
Read the export with explicit dtypes and validate it (schema, uniqueness, reconciliation to a control total). Compute the tables in pandas as plain DataFrames: a pivot summary, a detail table and per-state slices. Write them with `ExcelWriter`, then apply formatting: bold header fill, frozen header row, autofilter, column widths, number formats for percentages, currency and dates, and conditional formatting rules for thresholds such as error rate above 4%. Name the file with the ISO week, log row counts and totals, and run it from Task Scheduler or cron. At Stewart the equivalent manual process took about two hours of a Monday; the script ran in under a minute and the reconciliation step caught a truncated export twice in the first quarter.

**Q: openpyxl or XlsxWriter?**
XlsxWriter is write-only, faster, has cleaner formatting and native chart APIs, and is the better choice for generating a new workbook from scratch every run. openpyxl can load an existing workbook, so it is the only option when the client has a template with their logo, named ranges and formulas that must be preserved, or when I need to append a sheet to last week's file. Neither calculates formulas; for that I either compute in pandas or open the file through Excel automation. In practice I keep both installed and pick per deliverable.

**Q: How do you handle a client template with merged cells and formulas?**
I load it with openpyxl, never rewrite the sheet wholesale, and write values cell by cell into the data region below the fixed header, using the template's own column positions found by scanning the header row. Merged header cells are left untouched; I only write to the top-left cell of a merged range if I must change it. Formula cells are preserved because openpyxl keeps them as strings, but their cached values are dropped, so I tell the client the file needs opening in Excel or I compute and write the values instead. I keep the untouched template under version control and generate a fresh copy each run.

**Q: What are the pitfalls of to_excel with a MultiIndex or a large frame?**
A MultiIndex header writes as merged cells plus a blank row, which breaks filters, so I flatten columns first. A DatetimeIndex with time zones raises, so I strip zones with `tz_localize(None)`. Frames over about a million rows exceed Excel's row limit (1,048,576) and must be split across sheets or delivered as CSV or Parquet. Writing is single-threaded and can take minutes for wide frames; `engine="xlsxwriter"` with `options={"constant_memory": True}` streams rows and keeps memory flat. Finally, `NaN` writes as an empty cell and `inf` raises unless replaced.

## pandas + SQL (read_sql, to_sql with sqlite3)

Most production data lives in a database, not a CSV. pandas talks to any DB-API or SQLAlchemy connection: `read_sql` pulls a query into a DataFrame, `to_sql` pushes a DataFrame into a table. The skill is knowing where to draw the line: aggregate and filter in SQL where the data is, shape and format in pandas where the tools are. SQLite ships with Python, so everything here runs without a server.

### Reading

```python
import sqlite3
import pandas as pd

con = sqlite3.connect("production.db")
df = pd.read_sql("SELECT * FROM files WHERE state = ?", con, params=("WY",))
df = pd.read_sql("SELECT * FROM files WHERE received >= :start", con, params={"start": "2026-09-01"})
df = pd.read_sql_query("SELECT state, COUNT(*) n FROM files GROUP BY state", con, index_col="state")
df = pd.read_sql_table("files", engine)     # SQLAlchemy engine only
```

Always pass parameters with `params=`, never with f-strings: it prevents SQL injection and handles quoting. `read_sql` dispatches to `read_sql_query` for SQL text and `read_sql_table` for a table name; the table form requires SQLAlchemy. Add `parse_dates=["received"]` because SQLite stores dates as text.

### Writing

```python
df.to_sql("weekly_summary", con, if_exists="replace", index=False)
df.to_sql("files", con, if_exists="append", index=False, chunksize=10_000, method="multi")
```

`if_exists` is `fail` (default), `replace` (drop and recreate) or `append`. `index=False` stops the pandas index becoming a column. `chunksize` batches inserts; `method="multi"` sends many rows per `INSERT`, which is much faster on PostgreSQL and MySQL. For SQLite, the default executemany is already fast. `dtype={"rate": "REAL"}` overrides the guessed column types.

### SQLAlchemy for real databases

```python
from sqlalchemy import create_engine, text
engine = create_engine("postgresql+psycopg2://user:pw@host:5432/prod")
engine = create_engine("mssql+pyodbc://user:pw@dsn_name")             # SQL Server via ODBC
with engine.begin() as con:                                             # transaction
    df = pd.read_sql(text("SELECT * FROM files WHERE state = :s"), con, params={"s": "WY"})
    out.to_sql("summary", con, if_exists="replace", index=False)
```

pandas 2.2+ warns if you pass a raw DB-API connection other than sqlite3; SQLAlchemy is the supported route to PostgreSQL, MySQL, SQL Server and Oracle. `engine.begin()` wraps the block in a transaction so a failed write rolls back.

### Push work to the database

```python
# bad: pull 5M rows, group in pandas
df = pd.read_sql("SELECT * FROM files", con).groupby("state").size()

# good: 50 rows cross the wire
df = pd.read_sql("""
    SELECT state, strftime('%Y-%W', received) AS week, COUNT(*) AS files, SUM(errors) AS errors
    FROM files
    WHERE received >= date('now', '-90 days')
    GROUP BY state, week
""", con)
```

Filtering, joining and aggregating are what databases are optimised for. Pull only the columns and rows the report needs. Window functions in SQL (`SUM() OVER`) and in pandas do the same job; choose based on where the data already is.

### Round trips and dtypes

| pandas dtype | SQLite type via to_sql | Comes back as |
|---|---|---|
| int64 | INTEGER | int64 |
| float64 | REAL | float64 |
| object / string | TEXT | object |
| datetime64 | TIMESTAMP (stored as text) | object unless `parse_dates` |
| bool | INTEGER | int64 |
| category | TEXT | object |

SQLite has no date or boolean type, so re-apply `parse_dates` and `astype("bool")` after reading. On PostgreSQL the mapping is exact.

### Upserts and incremental loads

```python
last = pd.read_sql("SELECT MAX(received) AS m FROM files", con)["m"][0]
new = source[source["received"] > pd.Timestamp(last)]
new.to_sql("files", con, if_exists="append", index=False)
```

`to_sql` has no upsert. For an insert-or-update pattern write the frame to a staging table with `if_exists="replace"`, then run one SQL statement: `INSERT INTO files SELECT * FROM staging WHERE true ON CONFLICT(file_id) DO UPDATE SET ...` (SQLite 3.24+ and PostgreSQL) or `MERGE` on SQL Server.

### Executing statements

```python
con.execute("CREATE INDEX IF NOT EXISTS ix_files_state ON files(state)")
con.executemany("UPDATE files SET status = ? WHERE file_id = ?", list(df[["status", "file_id"]].itertuples(index=False)))
con.commit()
```

Anything that is not a `SELECT` goes through the connection directly. `itertuples(index=False)` is the right way to feed a DataFrame to `executemany`. Remember to `commit()` on sqlite3 connections; `to_sql` commits for you, `execute` does not.

> **Interview note:** "Would you do this join in SQL or pandas?" The strong answer weighs data location, size and reuse: join in SQL when both tables are in the database and the result is small; join in pandas when one side is a file, when you need fuzzy or `merge_asof` logic, or when the shaped result feeds further pandas steps anyway.

### Try It Yourself

```python
import io, sqlite3
import pandas as pd

raw = """file_id,state,received,coverage,errors
1001,WY,2026-09-01,187450,0
1002,MT,2026-09-02,250000,2
1003,WY,2026-09-04,99999,1
1004,ID,2026-09-09,120500,0
1005,MT,2026-09-10,300000,3
1006,WY,2026-09-16,410000,0
"""
files = pd.read_csv(io.StringIO(raw))
rates = pd.DataFrame({"state": ["WY", "MT", "ID"], "rate_per_1000": [5.5, 6.0, 5.2]})

con = sqlite3.connect(":memory:")
files.to_sql("files", con, index=False, if_exists="replace")
rates.to_sql("rates", con, index=False, if_exists="replace")
con.execute("CREATE INDEX ix_files_state ON files(state)")

q = """
SELECT f.state,
       strftime('%Y-%W', f.received)              AS week,
       COUNT(*)                                   AS files,
       SUM(f.errors)                              AS errors,
       ROUND(SUM(CEIL(f.coverage / 1000.0) * r.rate_per_1000), 2) AS premium
FROM files f JOIN rates r ON r.state = f.state
WHERE f.received >= :start
GROUP BY f.state, week
ORDER BY f.state, week
"""
summary = pd.read_sql(q, con, params={"start": "2026-09-01"})
print("Aggregated in SQL:\n", summary.to_string(index=False), "\n")

summary.to_sql("weekly_summary", con, index=False, if_exists="replace")
back = pd.read_sql("SELECT * FROM weekly_summary WHERE premium > :p", con, params={"p": 1000})
print("Rows with premium > 1000:\n", back.to_string(index=False), "\n")

# incremental append: only new file_ids
new = pd.DataFrame({"file_id": [1006, 1007], "state": ["WY", "ID"], "received": ["2026-09-16", "2026-09-18"],
                    "coverage": [410000, 75000], "errors": [0, 1]})
existing = pd.read_sql("SELECT file_id FROM files", con)["file_id"]
to_add = new[~new["file_id"].isin(existing)]
to_add.to_sql("files", con, index=False, if_exists="append")
print("Appended", len(to_add), "new row(s); files now:", pd.read_sql("SELECT COUNT(*) n FROM files", con)["n"][0])

dates = pd.read_sql("SELECT file_id, received FROM files", con, parse_dates=["received"])
print("received dtype after parse_dates:", dates["received"].dtype)
```

### Quiz

1. Why pass `params=` to `read_sql` instead of formatting the SQL string?
- [x] It prevents SQL injection and handles quoting
- [ ] It makes the query run faster
- [ ] Formatting strings is not allowed in pandas
> Parameter binding lets the driver escape values safely.

2. What does `to_sql(..., if_exists="replace")` do?
- [ ] Updates matching rows
- [x] Drops the table and creates it again from the DataFrame
- [ ] Appends only new rows
> replace is destructive; append adds rows; fail raises if the table exists.

3. Why do dates come back as strings from SQLite?
- [x] SQLite has no native date type; pass parse_dates
- [ ] read_sql never parses dates
- [ ] to_sql stores dates as integers
> SQLite stores TIMESTAMP as text; parse_dates restores datetime64.

4. When should aggregation happen in SQL rather than pandas?
- [ ] Never; pandas is always faster
- [x] When the data is already in the database and the result is much smaller than the input
- [ ] Only for joins
> Moving 50 aggregated rows across the network beats moving 5 million raw rows.

### Exercises

1. **Parameterised report** — Write a function `weekly(con, state, start)` that returns files and errors per ISO week for one state from `files`.
<details><summary>Solution</summary>

```python
def weekly(con, state, start):
    q = """SELECT strftime('%Y-%W', received) AS week, COUNT(*) AS files, SUM(errors) AS errors
           FROM files WHERE state = :s AND received >= :start GROUP BY week ORDER BY week"""
    return pd.read_sql(q, con, params={"s": state, "start": start})
```

</details>

2. **Upsert via staging** — Load `new` into a staging table and upsert into `files` keyed on `file_id`, updating `coverage` and `errors`.
<details><summary>Solution</summary>

```python
new.to_sql("staging", con, index=False, if_exists="replace")
con.execute("""
    INSERT INTO files (file_id, state, received, coverage, errors)
    SELECT file_id, state, received, coverage, errors FROM staging WHERE true
    ON CONFLICT(file_id) DO UPDATE SET coverage = excluded.coverage, errors = excluded.errors
""")
con.commit()
```

</details>

3. **Chunked pull** — Read a 20-million-row table in 500k-row chunks and compute total coverage per state.
<details><summary>Solution</summary>

```python
total = None
for chunk in pd.read_sql("SELECT state, coverage FROM files", con, chunksize=500_000):
    part = chunk.groupby("state")["coverage"].sum()
    total = part if total is None else total.add(part, fill_value=0)
```

</details>

### Interview Questions

**Q: How do you decide what to do in SQL versus pandas?**
Do in SQL what reduces data volume and uses indexes: filtering by date and state, joining tables that already live together, and grouping to the report grain. Do in pandas what SQL does badly or what depends on files: reshaping to wide, `merge_asof` against rate tables effective by date, string cleaning, percentile bands, and Excel formatting. The heuristic is to pull the smallest result set that still lets pandas finish the job, and to keep the SQL in a version-controlled `.sql` file so DBAs can review it. If the same aggregation is needed by three reports, it becomes a view.

**Q: What are the limits of to_sql and how do you load large frames fast?**
`to_sql` issues row inserts, has no upsert, guesses column types (TEXT for objects, no primary key) and is slow for millions of rows. For speed I create the table myself with proper types and keys, then use `method="multi"` with `chunksize` on PostgreSQL or MySQL, `fast_executemany=True` on the SQL Server ODBC engine, or bypass pandas with the database's bulk loader: `COPY` on PostgreSQL via `psycopg2.copy_expert` from an in-memory CSV, or `bcp`/`BULK INSERT` on SQL Server. For upserts I load into a staging table and run one `INSERT ... ON CONFLICT` or `MERGE` statement.

**Q: Why does pandas warn about a raw DB-API connection?**
Since pandas 2.2, `read_sql` and `to_sql` are tested only against SQLAlchemy connectables and sqlite3 connections; other raw DB-API connections such as psycopg2 or pyodbc still work in many cases but emit a `UserWarning` because parameter styles and type handling differ per driver. The fix is `create_engine` with the driver URL and passing the engine or a connection from `engine.begin()`. This also gives transactions, connection pooling and a consistent `:name` parameter style through `sqlalchemy.text`.

**Q: How do you keep a database-backed report reproducible?**
I record the exact query text, the parameters (report week, as-of date) and the row count and checksum of what was pulled, and I write them to a log next to the output file. Where possible the query filters by a stable "as of" column rather than `now()`, so re-running for last week returns last week's data. Results that must never change, such as month-end numbers, are snapshotted to Parquet at run time so a later database correction does not silently rewrite history. That combination has let me answer "why does the March number differ from what you sent" with evidence instead of guesses.

## pandas interview questions & coding tasks

pandas interviews come in three shapes: rapid-fire concept questions, a live coding task on a small DataFrame, and a "tell me about a pipeline you built" conversation. This chapter is a rehearsal for all three. Work every task in the runner before reading the solution, and say your reasoning out loud the way you would on a call, because interviewers grade the thinking as much as the code.

### Concept questions you will be asked

| Question | The one-line answer to expand on |
|---|---|
| loc vs iloc | Label-based vs position-based; loc slices are inclusive |
| merge vs join vs concat | Key-based SQL joins; index-based join; stacking along an axis |
| apply vs vectorised | Python per row vs C over arrays; 100× gap |
| groupby agg vs transform | Reduces to one row per group vs returns aligned same-length result |
| NaN vs None vs pd.NA | float sentinel; Python object; pandas nullable missing |
| Copy vs view | Ambiguous before Copy-on-Write; use `.loc` or `.copy()` |
| category dtype | Integer codes plus a categories table; ordered comparisons |
| pivot vs pivot_table | Pure reshape vs aggregate then reshape |
| inplace=True | Rarely faster, breaks method chains, being deprecated |
| Series vs DataFrame | 1-D labelled array vs 2-D dict of aligned Series |

For each, have a concrete example from your own work ready, such as the rate-matrix melt or the reconciliation assertion.

### Coding task 1: second-highest per group

"Given `files(state, agent, files)`, return each state's second-best agent."

```python
ranked = df.assign(r=df.groupby("state")["files"].rank(method="first", ascending=False))
second = ranked[ranked["r"] == 2].drop(columns="r")
# or
second = df.sort_values("files", ascending=False).groupby("state").nth(1)
```

Mention that `nth(1)` is positional and needs the sort, and that `rank(method="first")` breaks ties deterministically.

### Coding task 2: sessionise events

"Rows of `(agent, timestamp)`; start a new session when the gap exceeds 30 minutes; count sessions per agent."

```python
df = df.sort_values(["agent", "ts"])
gap = df.groupby("agent")["ts"].diff() > pd.Timedelta(minutes=30)
df["session"] = gap.groupby(df["agent"]).cumsum()
sessions = df.groupby("agent")["session"].nunique()
```

The trick is `diff` per group, a boolean for "new session", and `cumsum` to label sessions. It is a common pattern for QA-review sessions and web logs.

### Coding task 3: fill gaps in a calendar

"Daily counts have missing dates; produce a complete series with zeros."

```python
s = df.set_index("date")["files"]
full = s.reindex(pd.date_range(s.index.min(), s.index.max(), freq="D"), fill_value=0)
```

### Coding task 4: as-of join

"Apply the rate that was effective on each file's received date."

```python
out = pd.merge_asof(files.sort_values("received"), rates.sort_values("effective"),
                    left_on="received", right_on="effective", by="state", direction="backward")
```

`merge_asof` is the answer whenever the join condition is "most recent row on or before". Say that both sides must be sorted by the key.

### Coding task 5: deduplicate keeping the latest

```python
latest = df.sort_values("updated_at").drop_duplicates("file_id", keep="last")
```

Follow up: explain why `sort_values` then `keep="last"` is clearer than `groupby().tail(1)`, and that `drop_duplicates` keeps the first by default.

### Coding task 6: percentage of total within group

```python
df["share"] = df["files"] / df.groupby("state")["files"].transform("sum")
```

This is the canonical `transform` example: the denominator is broadcast back to every row.

### Coding task 7: reshape a rate matrix

"Columns `state, 0-50k, 50-100k, 100-250k`; produce long rows and then a pivot back with a Total column."

```python
long = matrix.melt(id_vars="state", var_name="band", value_name="rate")
back = long.pivot(index="state", columns="band", values="rate")
back["Total"] = back.sum(axis=1)
```

### The "tell me about a pipeline" conversation

Structure the answer as input, validation, transformation, output and impact, with numbers:

1. Input: the weekly export, 400k rows, 60 columns, CSV with US dates.
2. Validation: schema, uniqueness on `file_id`, reconciliation to the source total, reject file on failure.
3. Transformation: category dtypes, `merge_asof` against the rate table, `pivot_table` per state and week, window columns for the 4-week trend.
4. Output: `ExcelWriter` with openpyxl formatting, frozen headers, conditional formatting on error rate.
5. Impact: two hours of manual work to one minute, and the reconciliation caught a truncated export.

### Questions to ask the interviewer

- Which pandas version is in production, and is Copy-on-Write enabled?
- Is the data in a warehouse, files or both, and who owns validation?
- How are reports delivered: Excel, Power BI, email, an internal app?

> **Interview note:** When you do not know a method name, describe the operation ("I would do a per-group cumulative sum after a sorted diff") and then look it up. Interviewers care far more about recognising the pattern than recalling the signature.

### Try It Yourself

```python
import io
import pandas as pd

files = pd.read_csv(io.StringIO("""state,agent,files,received
WY,Asad,120,2026-09-01
WY,Hina,110,2026-09-02
WY,Sara,90,2026-09-03
MT,Asad,60,2026-09-04
MT,Hina,95,2026-09-05
MT,Sara,95,2026-09-06
"""), parse_dates=["received"])
rates = pd.DataFrame({"state": ["WY", "WY", "MT"],
                      "effective": pd.to_datetime(["2026-08-01", "2026-09-02", "2026-08-01"]),
                      "rate": [5.5, 5.8, 6.0]})

# Task 1: second-best agent per state
ranked = files.assign(r=files.groupby("state")["files"].rank(method="first", ascending=False))
print("Second per state:\n", ranked[ranked["r"] == 2][["state", "agent", "files"]].to_string(index=False), "\n")

# Task 4: as-of join to the rate effective on the received date
asof = pd.merge_asof(files.sort_values("received"), rates.sort_values("effective"),
                     left_on="received", right_on="effective", by="state", direction="backward")
print("Effective rate per file:\n", asof[["state", "agent", "received", "rate"]].to_string(index=False), "\n")

# Task 6: share of state total
files["share"] = (files["files"] / files.groupby("state")["files"].transform("sum")).round(3)
print("Share within state:\n", files[["state", "agent", "files", "share"]].to_string(index=False), "\n")

# Task 2: sessionise QA review timestamps with a 30-minute gap
events = pd.DataFrame({"agent": ["Asad"] * 5 + ["Hina"] * 3,
                       "ts": pd.to_datetime(["09:00", "09:10", "09:20", "11:00", "11:05",
                                             "13:00", "13:45", "13:50"], format="%H:%M")})
events = events.sort_values(["agent", "ts"])
new = events.groupby("agent")["ts"].diff() > pd.Timedelta(minutes=30)
events["session"] = new.groupby(events["agent"]).cumsum() + 1
print("Sessions per agent:\n", events.groupby("agent")["session"].nunique())
```

### Quiz

1. Which idiom returns each row's share of its group total?
- [ ] `df.groupby("state")["files"].sum()`
- [x] `df["files"] / df.groupby("state")["files"].transform("sum")`
- [ ] `df["files"].pct_change()`
> transform broadcasts the group sum back to every row for element-wise division.

2. Which function performs a "most recent rate on or before this date" join?
- [ ] `merge(how="left")`
- [x] `merge_asof`
- [ ] `join`
> merge_asof matches on the nearest key, optionally within groups via by=.

3. To label sessions from sorted timestamps, which pair of operations do you use?
- [x] `diff` compared to a threshold, then `cumsum`
- [ ] `shift` then `rank`
- [ ] `rolling` then `apply`
> A boolean "new session" flag summed cumulatively gives a session id.

4. What does `drop_duplicates("file_id")` keep by default?
- [x] The first occurrence
- [ ] The last occurrence
- [ ] A random occurrence
> keep="first" is the default; sort first when you need the latest row.

### Exercises

1. **Top-2 per state with ties kept** — Return all agents whose files are within the top two distinct values per state.
<details><summary>Solution</summary>

```python
r = files.groupby("state")["files"].rank(method="dense", ascending=False)
top2 = files[r <= 2].sort_values(["state", "files"], ascending=[True, False])
```

</details>

2. **Days since previous file per agent** — Add a column with the number of days since the same agent's previous received date.
<details><summary>Solution</summary>

```python
files = files.sort_values(["agent", "received"])
files["days_since"] = files.groupby("agent")["received"].diff().dt.days
```

</details>

3. **Explain a pipeline** — Write, in five bullet points, the input, validation, transformation, output and impact of a pipeline you built, with at least three numbers.
<details><summary>Solution</summary>

```text
- Input: weekly production export, ~400k rows, 60 columns, CSV with US-format dates.
- Validation: schema and uniqueness on file_id, reconciliation to the source premium total.
- Transformation: category dtypes, merge_asof to effective rates, pivot per state/week, 4-week trend.
- Output: ExcelWriter with openpyxl formatting, frozen headers, conditional formatting on error rate.
- Impact: 2 hours of manual work to under 1 minute; caught a truncated export twice in Q1.
```

</details>

### Interview Questions

**Q: Walk me through how you would find the top three agents by files per state, and what could go wrong.**
Sort by files descending and take `groupby("state").head(3)`, or rank within group with `rank(method="first", ascending=False)` and filter `<= 3`. What goes wrong: ties, where `head(3)` cuts arbitrarily and `method="dense"` may return more than three; NaN in files, which `rank` places last or drops depending on `na_option`; and a category `state` column with unused categories producing empty groups unless `observed=True`. I would state the tie rule I chose and show the result on a five-row example before running it on the full file.

**Q: How do you approach a pandas coding question you have not seen before?**
Restate the input and output shapes, including the grain of each, because most pandas problems are "what is one row of the answer". Decide whether it is a filter, a reshape, a group aggregation, a window or a join, and name the primitive: `groupby().transform`, `melt`, `merge_asof`, `diff` plus `cumsum`. Write a three-row example by hand to check edge cases such as ties, missing values and the first row of each group. Then code it as a method chain and print intermediate steps. Interviewers reward this because it is how the work is actually done, and it recovers gracefully when you forget a method name.

**Q: What is the difference between agg, transform, filter and apply on a GroupBy?**
`agg` reduces each group to one row per aggregation, returning a frame with one row per group. `transform` applies a function per group and returns a result the same length as the input, aligned to the original index, which is what you need for shares, z-scores and per-group fills. `filter` keeps or drops whole groups based on a boolean function, such as states with more than 100 files. `apply` is the general escape hatch that can return anything and is therefore the slowest and the hardest to reason about. In reviews I replace `apply` with one of the other three whenever possible.

**Q: Describe a bug you found in a pandas report and how you prevented it recurring.**
A weekly summary showed the average files per state instead of totals because a `pivot_table` had no `aggfunc`, and the values looked plausible for two weeks. The fix was the one-word `aggfunc="sum"`, but the prevention was a reconciliation assertion that the pivot's grand total equals the sum of the input column, plus a unit test with a fixed six-row input and a golden output compared with `assert_frame_equal`. Since then every report script has a reconciliation block, and the tests run before deployment, so a wrong default cannot reach a manager's inbox.

**Q: Which pandas features changed recently that a candidate should know?**
pandas 2.0 (April 2023) added the pyarrow dtype backend and `dtype_backend="pyarrow"`, removed `append` and `sum(level=)`, and made `to_datetime` strict about mixed formats. pandas 2.1 renamed `applymap` to `DataFrame.map` and began warning about `observed=False` on categorical groupby. pandas 2.2 renamed frequency aliases (`M` to `ME`, `Q` to `QE`, `Y` to `YE`, `H` to `h`) and warned about non-SQLAlchemy connections. pandas 3.0 makes Copy-on-Write and the Arrow-backed string dtype the default and switches `observed=True`. Knowing these shows you maintain code rather than only write it once.
