---
id: data-cleaning-reporting
title: Data Cleaning, Validation & KPI Reporting
icon: 🧹
track: Data & Reporting
color: #117A65
runner: python
packages: 
tagline: Turn raw production data into trustworthy weekly reports and rate matrices.
description: The analyst's real job: profiling and cleaning messy data, validation rules and QA checks, deduplication and standardisation, building comparison matrices (multi-state, multi-underwriter rate matrices with zone harmonisation), defining KPIs and SLAs, designing daily/weekly/monthly production reports, automating them, and presenting findings to management.
---

# LEVEL: Beginner

## What data cleaning is and why it matters

Every report, dashboard and rate matrix is built on data that somebody typed, exported, pasted or scraped. That data is dirty: a state written as "Tx", "TX " and "Texas" in the same column, a premium stored as text, a file counted twice because it was re-opened, a date in two formats. **Data cleaning** is the set of steps that turn such raw input into a dataset you can trust enough to put your name on.

### The cost of dirty data

A weekly production report for a title-insurance client said Texas volume fell 18%. The real cause: an exported spreadsheet had 340 rows with state `"TX "` (trailing space), which the PivotTable counted as a different state. The number was wrong, the client was alarmed, and the analyst spent two days rebuilding trust. Cleaning would have taken five minutes.

| Symptom in the report | Usual root cause |
|---|---|
| Totals do not match the source system | Duplicates, filtered rows, missing rows |
| A category appears twice with slightly different names | Inconsistent codes, casing, whitespace |
| Averages look impossible (turnaround of 900 hours) | Wrong units, typos, dates parsed incorrectly |
| Sums show `#VALUE!` or zero | Numbers stored as text |
| Rates change when the report is re-run | Non-deterministic joins, unstable lookups |

### The cleaning pipeline

Cleaning is not a single action; it is a repeatable sequence. The same order works whether you are using Excel, Power Query, SQL or Python:

1. **Acquire** the raw file and never edit it. Keep it read-only.
2. **Profile**: what columns, what types, what ranges, how many blanks, how many distinct values.
3. **Standardise**: trim whitespace, unify casing, parse dates and numbers, map codes to canonical values.
4. **Validate**: apply rules (state must be one of 50 codes; premium must be positive; close date after open date).
5. **Deduplicate**: define what "the same record" means and keep one.
6. **Handle missing values**: decide per column whether to fill, flag or drop.
7. **Reconcile**: totals and counts tie back to the source.
8. **Document**: what was changed, how many rows, and why.

```python
raw = [" tx ", "TX", "Texas", "tx", "TX "]
clean = [s.strip().upper() for s in raw]
print(clean)   # ['TX', 'TX', 'TEXAS', 'TX', 'TX']
```

Two lines fix four of the five variants. The fifth, `"TEXAS"`, needs a lookup table, which is the standardisation step you will build in the Intermediate level. The point: most dirt is mechanical and fixable with a rule, and rules can be re-run every week.

### Garbage in, garbage out, and the analyst's role

The people who produce the data (agents keying files, systems exporting logs) are optimising for their own task, not for your report. The analyst is the last line of defence, which means the job is not "make a chart" but "make a number that survives scrutiny". In a BPO data-processing team of 20 agents, a 1% keying error rate produces 200 wrong cells in a 20 000-cell weekly batch; the cleaning rules find them before the client does.

### Principles

- **Never modify the raw file.** Cleaning creates a new version; the raw one is evidence.
- **Make every change a rule, not a manual edit.** A rule can be re-run, audited and explained.
- **Count everything.** Rows in, rows out, rows changed by each rule. If you cannot say "the trim rule affected 340 rows", you cannot defend the report.
- **Flag before you fix.** When a value is suspicious but you are not sure, add a flag column instead of overwriting.
- **Cleaning is not the same as changing the answer.** Removing inconvenient rows is fraud, not cleaning.

> **Warning:** Excel's Find & Replace across a whole sheet is the most common way analysts destroy data. It is untracked, it is easy to run on the wrong column, and "TX" inside "TEXTURE" gets replaced too. Prefer formulas in new columns, Power Query steps, or code.

### Try It Yourself

```python
# A first cleaning pass on a tiny production extract, counting what each rule changes.
rows = [
    {"file_id": "TX-1001", "state": " tx ", "premium": "1,250.00", "closed": "2026-03-04"},
    {"file_id": "TX-1002", "state": "TX", "premium": "980", "closed": "03/05/2026"},
    {"file_id": "FL-2001", "state": "Florida", "premium": "", "closed": "2026-03-05"},
    {"file_id": "TX-1001", "state": "TX", "premium": "1,250.00", "closed": "2026-03-04"},   # duplicate
    {"file_id": "CA-3001", "state": "ca", "premium": "-40", "closed": "2026-03-06"},
]
state_map = {"TEXAS": "TX", "FLORIDA": "FL", "CALIFORNIA": "CA"}
changed = {"trim/case": 0, "state lookup": 0, "premium parsed": 0, "premium missing": 0, "premium negative": 0, "duplicates": 0}
seen, clean = set(), []
for r in rows:
    s = r["state"].strip().upper()
    if s != r["state"]:
        changed["trim/case"] += 1
    if s in state_map:
        s = state_map[s]; changed["state lookup"] += 1
    p = r["premium"].replace(",", "").strip()
    if p == "":
        prem = None; changed["premium missing"] += 1
    else:
        prem = float(p); changed["premium parsed"] += 1
        if prem < 0:
            changed["premium negative"] += 1
    if r["file_id"] in seen:
        changed["duplicates"] += 1
        continue
    seen.add(r["file_id"])
    clean.append({"file_id": r["file_id"], "state": s, "premium": prem, "flag_neg": prem is not None and prem < 0})
print(f"rows in: {len(rows)}, rows out: {len(clean)}")
for k, v in changed.items():
    print(f"  {k:17} {v}")
for c in clean:
    print(c)
```

### Quiz

1. What is the first rule of working with a raw data file?
- [x] Never edit it; clean into a new version
- [ ] Sort it by date
- [ ] Delete blank rows immediately
> The raw file is your evidence and your rollback point.

2. A PivotTable shows "TX" and "TX " as separate states. The root cause is:
- [ ] A PivotTable bug
- [x] Trailing whitespace in the source column
- [ ] Two different states
> Whitespace makes strings unequal; trimming fixes it.

3. Which is cleaning and which is not?
- [ ] Removing rows that make the KPI look bad
- [x] Removing rows that are exact duplicates of another row
- [ ] Changing a premium to match the expected total
> Cleaning applies documented rules; it never changes the answer to fit expectations.

4. Why count the rows affected by each cleaning rule?
- [x] So you can explain and defend every change in the report
- [ ] Because Excel requires it
- [ ] To make the file larger
> Counts turn cleaning into an auditable process.

### Exercises

1. **Spot the dirt** — List every problem in this row: `{"state": "fl ", "premium": "$1,200", "open": "3/4/26", "close": "2026-03-02"}`.
<details><summary>Solution</summary>

Trailing space and lowercase in state; currency symbol and thousands separator in premium (text, not number); ambiguous short date format in open; close date earlier than open date (logical error, needs a validation rule).

</details>

2. **Order the steps** — Put in order: deduplicate, profile, validate, standardise, reconcile.
<details><summary>Solution</summary>

Profile → standardise → validate → deduplicate → reconcile. Standardise before validating (otherwise "tx" fails the state rule) and before deduplicating (otherwise "TX" and "tx " rows look different).

</details>

3. **Write a rule** — In words, write a rule that would have caught the trailing-space Texas problem before the report went out.
<details><summary>Solution</summary>

"Every value in `state` must, after trimming and upper-casing, be in the list of 50 valid codes; report the count of rows changed by trimming and the count failing the list." The count of changed rows (340) would have been visible before the pivot was built.

</details>

### Interview Questions

**Q: What does data cleaning mean to you, and how do you approach a new dataset?**
Cleaning means turning raw input into a dataset whose every column has a known type, a known set of valid values, and a known level of completeness, with every change made by a documented rule. When I get a new extract I start with profiling: row count, column types, distinct values per categorical column, min/max per numeric column, blanks per column, and duplicate keys. That ten-minute pass tells me what rules I need. I then apply standardisation, validation and deduplication as re-runnable steps, count the rows each step affects, and reconcile totals back to the source before anything reaches a report. For a weekly title-production extract this became a Power Query script that ran in seconds and printed a small "cleaning log" table at the top of the workbook.

**Q: Tell me about a time bad data caused a wrong report, and what you changed afterwards.**
A weekly status report showed a state's volume dropping sharply; the cause was trailing spaces in the state column from a new export template, which split one state into two in the pivot. The fix was trivial, but the process change mattered: I added a profiling step that lists distinct values of every code column with counts, and a validation rule that fails the report if any code is not in the master list. I also added a reconciliation line comparing the report's total file count with the source system's count, so any split or loss is visible before distribution. Since then, new dirt shows up as a failed check rather than a wrong number in front of the client.

**Q: Where is the line between cleaning data and manipulating it?**
Cleaning applies rules that are independent of the result: trimming, type conversion, code mapping, deduplication by a defined key, and exclusion by a documented, pre-agreed criterion such as "test files with IDs beginning TEST-". Manipulation is any change made because of the value it produces: dropping outliers because they hurt the KPI, "correcting" a premium to match an expected total, or changing a rule after seeing the report. The practical safeguards are that rules are written before the report is built, every exclusion is counted and listed in an appendix, and the raw file is retained so anyone can re-derive the numbers. If I cannot explain a change without referring to the outcome, it is not cleaning.

**Q: How much of an analyst's time should go on cleaning?**
More than anyone plans for, usually 50 to 70% of a new project, dropping sharply once the rules are automated. The mistake is treating cleaning as a one-off manual chore rather than building the rule set as a reusable asset; the second week's report should take minutes, not days. I measure the trend: if cleaning time is not falling, either the source is unstable or the rules are not being captured in code. The other lever is upstream: a validation rule in the data-entry form or a fixed export template removes a class of dirt permanently, which is cheaper than cleaning it every week.

## Profiling a dataset: types, ranges and uniqueness

Before you fix anything you must know what you have. **Profiling** is the systematic description of every column: its type, its range, how many values are missing, how many are distinct, and which values are frequent. It takes minutes and it decides every cleaning rule that follows.

### What to profile, column by column

| Question | Numeric column | Text / code column | Date column |
|---|---|---|---|
| Type consistency | Are any values text? | Any numbers hiding here? | Any values that fail to parse? |
| Range | Min, max, mean, median | Shortest and longest length | Earliest, latest |
| Missing | Count of blanks / null / 0 used as blank | Blanks, "N/A", "-", "null" | Blanks, 1900-01-01, 9999-12-31 |
| Distinct values | Number of distinct; any suspicious spikes | Full list with counts if under 50 | Distinct years and months |
| Outliers | Values beyond plausible bounds | Very long strings, odd characters | Future dates, weekend closings |
| Uniqueness | Is this a key? Duplicated keys? | Same | Same |

### Profiling in Excel

- **Type**: `=COUNT(B:B)` versus `=COUNTA(B:B)`; the difference is non-numeric cells in a numeric column. `=SUMPRODUCT(--ISTEXT(B2:B5000))` counts text cells directly.
- **Range**: `=MIN`, `=MAX`, `=AVERAGE`, `=MEDIAN`, `=QUARTILE.INC(B:B,1)` and `=QUARTILE.INC(B:B,3)`.
- **Blanks**: `=COUNTBLANK(B2:B5000)`.
- **Distinct values**: a PivotTable with the column as Rows and Count as Values, or `=UNIQUE(A2:A5000)` in Microsoft 365 with `=COUNTIF` alongside.
- **Duplicates**: `=COUNTIF($A$2:$A$5000, A2) > 1` in a helper column, or Conditional Formatting → Highlight Duplicate Values.

Power Query has this built in: **View → Column quality, Column distribution, Column profile** show valid/error/empty percentages, distinct and unique counts, and a value histogram for every column, based on the first 1 000 rows by default (change to the entire dataset in the status bar).

### Profiling in Python

```python
import pandas as pd
df = pd.read_csv("production_week37.csv")
print(df.shape)                       # (rows, columns)
print(df.dtypes)                      # object means text or mixed
print(df.isna().sum())                # blanks per column
print(df.describe(include="all").T)   # count, unique, top, freq, mean, min, max
print(df["state"].value_counts(dropna=False).head(60))
print(df["file_id"].is_unique, df["file_id"].duplicated().sum())
```

`describe(include="all")` is the single most useful profiling call: for text columns it gives `unique` (distinct count), `top` (most frequent) and `freq`; for numeric columns it gives the five-number summary. A column you expected to be numeric showing as `object` means at least one value is text, such as `"1,250.00"` or `"N/A"`.

### Profiling in SQL

```sql
SELECT COUNT(*) AS rows_total,
       COUNT(DISTINCT file_id) AS distinct_ids,
       SUM(CASE WHEN premium IS NULL THEN 1 ELSE 0 END) AS premium_null,
       MIN(premium), MAX(premium), AVG(premium),
       MIN(close_date), MAX(close_date)
FROM production;
SELECT state, COUNT(*) FROM production GROUP BY state ORDER BY 2 DESC;
```

If `rows_total` and `distinct_ids` differ, `file_id` is not unique and you have duplicates to investigate before anything else.

### Reading the profile

The profile is a list of questions for the data owner and a list of rules for you:

- `state`: 53 distinct values in a US dataset → three are dirty variants; build a lookup.
- `premium`: min −40, max 2 400 000 → negatives are refunds or errors; the max is a typo or a genuine commercial policy. Ask.
- `close_date`: 12 rows in 1900 → Excel's zero date; treat as missing.
- `file_id`: 2 700 rows, 2 655 distinct → 45 duplicates; define the dedup rule.
- `underwriter`: "Stewart", "STEWART TITLE", "Stewart Title Guaranty Co." → one entity, three spellings.

Write these observations down. They become the **data-issues log** that the Intermediate level formalises.

> **Tip:** Profile the *whole* file, not the first screen. The dirt is usually at the bottom (a totals row pasted under the data, a second header from a concatenated export) or in the rare categories.

### Try It Yourself

```python
# A dependency-free profiler for a list of dicts: type mix, range, blanks, distinct values.
rows = [
    {"file_id": "TX-1001", "state": "TX", "premium": "1250", "pages": 42, "close": "2026-03-04"},
    {"file_id": "TX-1002", "state": "TX ", "premium": "980", "pages": 18, "close": "2026-03-05"},
    {"file_id": "FL-2001", "state": "FL", "premium": "", "pages": "n/a", "close": "1900-01-01"},
    {"file_id": "FL-2002", "state": "Florida", "premium": "2,100", "pages": 60, "close": "2026-03-05"},
    {"file_id": "TX-1002", "state": "TX", "premium": "980", "pages": 18, "close": "2026-03-05"},
    {"file_id": "CA-3001", "state": "CA", "premium": "-40", "pages": 7, "close": "2026-03-09"},
    {"file_id": "CA-3002", "state": "CA", "premium": "2400000", "pages": 300, "close": "2027-01-01"},
]
def to_num(v):
    try:
        return float(str(v).replace(",", ""))
    except ValueError:
        return None

print(f"rows: {len(rows)}")
for col in rows[0]:
    vals = [r[col] for r in rows]
    blanks = sum(v in ("", None) for v in vals)
    nums = [to_num(v) for v in vals if v not in ("", None)]
    numeric = [x for x in nums if x is not None]
    distinct = sorted(set(str(v) for v in vals))
    line = f"{col:8} blanks={blanks} distinct={len(distinct)}"
    if numeric and len(numeric) == len(nums):
        line += f" numeric min={min(numeric):g} max={max(numeric):g}"
    elif numeric:
        line += f" MIXED: {len(numeric)} numeric, {len(nums) - len(numeric)} text"
    else:
        line += f" text values={distinct if len(distinct) <= 8 else distinct[:8] + ['...']}"
    print(line)
ids = [r["file_id"] for r in rows]
dups = sorted({i for i in ids if ids.count(i) > 1})
print(f"file_id unique? {len(set(ids)) == len(ids)}  duplicated keys: {dups}")
```

### Quiz

1. `COUNTA` returns 5 000 and `COUNT` returns 4 870 on a premium column. What does that mean?
- [x] 130 cells contain text rather than numbers
- [ ] 130 cells are blank
- [ ] The column has 130 duplicates
> `COUNT` counts numbers only; `COUNTA` counts any non-blank cell.

2. In pandas, a column showing dtype `object` when you expected numbers means:
- [ ] The column is empty
- [x] At least one value could not be interpreted as a number
- [ ] The file is corrupt
> One text value forces the whole column to object dtype.

3. Row count 2 700, distinct `file_id` 2 655. Conclusion:
- [ ] 45 files are missing
- [x] Some file IDs appear more than once; investigate duplicates
- [ ] The IDs are wrong
> Distinct < total means repeated keys.

4. Which Power Query view shows valid/error/empty percentages per column?
- [ ] Data → Data Validation
- [x] View → Column quality
- [ ] Home → Remove Rows
> Column quality, distribution and profile are Power Query's built-in profiler.

### Exercises

1. **Profile plan** — You receive a 21-column weekly extract for the first time. List the six checks you run before touching a chart.
<details><summary>Solution</summary>

Row count vs source; types per column (text in numeric columns); blanks per column; distinct values with counts for every code column; min/max for numbers and dates; duplicate keys. Record each result in the issues log.

</details>

2. **Excel formula** — Write a formula that counts how many cells in `C2:C5000` are text.
<details><summary>Solution</summary>

`=SUMPRODUCT(--ISTEXT(C2:C5000))`

</details>

3. **Interpret** — `close_date` min is 1900-01-01, max is 2031-06-30. What are the likely causes?
<details><summary>Solution</summary>

1900-01-01 is Excel's serial date 0/1, meaning blank or zero was formatted as a date; treat as missing. A 2031 date is a typo (2031 for 2021) or a projected date; flag rows with dates after today for review.

</details>

### Interview Questions

**Q: What is the first thing you look at in a new dataset?**
Row count and key uniqueness, because if the grain is wrong nothing else matters: if I expect one row per file and find duplicates, every count and sum will be inflated. Then column types, because numbers stored as text silently drop out of sums, and then distinct values of every code column with their frequencies, which is where inconsistent spellings and unexpected categories show. Finally min, max and blanks per column. I do this in Power Query's column profile or a pandas `describe`, and I keep the output as the first entry in the project's issues log, so I can show later what the data looked like before cleaning.

**Q: How do you profile a file too large for Excel?**
Excel stops at 1 048 576 rows, and Power Query's profile samples 1 000 rows unless told otherwise, so I move to a tool that streams: pandas reading in chunks, DuckDB or SQLite querying the CSV directly, or a database if the data already lives in one. The queries are the same: counts, distinct counts, min/max, null counts, group-by frequencies. For a 5-million-row export I would load it into SQLite with the command-line `.import`, index the key column, and run the profile as a handful of SQL statements. The output is a small table that fits in Excel, and that is what I share with the data owner.

**Q: What are the most common surprises a profile reveals?**
Duplicate keys from re-exported or re-opened records; a totals or footer row sitting inside the data; two header rows from concatenated exports; codes with more distinct values than the domain allows, which means spelling variants; numbers stored as text because of currency symbols or thousands separators; dates in mixed formats where day and month are swapped for the first twelve days of each month; sentinel values like 0, −1, 9999 or 1900-01-01 standing in for missing; and columns that are entirely blank or entirely constant, which are useless and can be dropped. Each of these becomes a rule; the profile is the requirements document for the cleaning script.

**Q: Why do you profile distinct values with counts rather than just the distinct list?**
Because the counts tell me which value is canonical and which is the dirty variant: "TX" 1 800 rows and "Tx" 4 rows means map the four, whereas 900 versus 900 means two real categories or a change in the export template mid-period. Counts also reveal spikes, such as one agent code responsible for half the rows, and sparse categories that will make any breakdown by that field meaningless. And they give me the numbers I need for the reconciliation: after mapping, the canonical "TX" should have exactly 1 804 rows, and if it does not, my mapping missed something.

## Common dirt: whitespace, casing, dates and numbers-as-text

Four kinds of dirt account for most cleaning work, and each has a standard fix in Excel, Power Query and Python. Learn the fixes as reflexes: you will apply them to every code column, every amount column and every date column of every file you ever receive.

### Whitespace

Leading, trailing and doubled spaces, plus invisible characters: non-breaking spaces (`CHAR(160)`, common in data copied from web pages), tabs, and carriage returns inside cells.

| Tool | Fix |
|---|---|
| Excel | `=TRIM(A2)` removes leading/trailing/double spaces; `=TRIM(SUBSTITUTE(A2, CHAR(160), " "))` also kills non-breaking spaces; `=CLEAN(A2)` strips non-printing characters |
| Power Query | Transform → Format → Trim, then Clean |
| Python | `s.strip()`, or `" ".join(s.split())` to collapse internal runs; `s.replace(" ", " ")` first |
| SQL | `TRIM(col)`; SQL Server 2017+ `TRIM`, older `LTRIM(RTRIM(col))` |

### Casing

`"Stewart"`, `"STEWART"`, `"stewart"` are three values to a computer. Choose one canonical form per column: codes upper-case (`TX`, `FL`), names in a fixed display case stored once in a lookup.

- Excel: `=UPPER`, `=LOWER`, `=PROPER` (which wrongly gives `Mcdonald`, so use it only for display).
- Power Query: Transform → Format → UPPERCASE / lowercase / Capitalize Each Word.
- Python: `.upper()`, `.lower()`, `.title()`, `.casefold()` for comparison.

Compare in one case, display in another. Matching keys should always be compared after `strip().upper()`.

### Numbers stored as text

`"1,250.00"`, `"$980"`, `"1 200"`, `"(40)"` for negative, `"12.5%"`. Excel shows a green triangle; sums silently exclude them.

```python
def parse_amount(s):
    s = str(s).strip().replace(",", "").replace("$", "").replace(" ", "")
    neg = s.startswith("(") and s.endswith(")")
    s = s.strip("()")
    if s.endswith("%"):
        return float(s[:-1]) / 100
    if s in ("", "-", "n/a", "N/A", "null"):
        return None
    v = float(s)
    return -v if neg else v
```

Excel: `=VALUE(SUBSTITUTE(SUBSTITUTE(A2,",",""),"$",""))`, or Data → Text to Columns → Finish, which forces re-evaluation of a whole column. Power Query: set the column type to Decimal Number with the correct **locale** (Transform → Data Type → Using Locale) so `1.250,00` in a European file parses correctly. Pandas: `pd.to_numeric(df["premium"].str.replace(r"[$,]", "", regex=True), errors="coerce")`, with `coerce` turning unparseable values into `NaN` you can count.

### Dates

The worst category, because a wrong parse is silent. `03/04/2026` is 4 March in the US and 3 April in most of the world. `20260304`, `4-Mar-26`, `2026-03-04T14:22:00Z`, Excel serial `46085`: all the same day.

Rules:

1. Find out the source format from the data owner, not from guessing.
2. Convert to ISO `YYYY-MM-DD` (or a true date type) as early as possible.
3. Never store dates as text in the clean file.

```python
from datetime import datetime, date, timedelta
formats = ["%Y-%m-%d", "%m/%d/%Y", "%d-%b-%y", "%Y%m%d", "%Y-%m-%dT%H:%M:%SZ"]
def parse_date(s):
    s = str(s).strip()
    if s.isdigit() and len(s) == 5:                       # Excel serial number
        return date(1899, 12, 30) + timedelta(days=int(s))
    for f in formats:
        try:
            return datetime.strptime(s, f).date()
        except ValueError:
            pass
    return None
```

Excel serials count days from 30 December 1899 (because of a deliberate 1900 leap-year bug). In Excel itself, `=DATEVALUE` handles text that matches your regional settings; Text to Columns with the **Date: MDY / DMY** option handles the rest. Power Query: Transform → Data Type → Date **Using Locale** with the source locale, not yours. Pandas: `pd.to_datetime(col, format="%m/%d/%Y", errors="coerce")`; always pass `format`, because inference can switch between day-first and month-first partway through a column.

### Other regulars

- **Sentinels**: `0`, `-1`, `9999`, `N/A`, `.`, `NULL` used as "no value". Convert to real nulls.
- **Encoding**: `Ã©` instead of `é` means a UTF-8 file was opened as Windows-1252. Re-open with the right encoding rather than replacing characters.
- **Leading zeros**: ZIP `02134` becomes `2134` if the column is numeric. Keep codes as text.
- **Merged cells and header rows**: unmerge and fill down (Power Query: Transform → Fill → Down).

> **Tip:** Fix order matters: trim and case first, then parse numbers and dates, then map codes. Parsing `" 1,250 "` fails until it is trimmed; mapping `"tx "` fails until it is trimmed and upper-cased.

### Try It Yourself

```python
from datetime import datetime, date, timedelta

raw = [
    {"id": "TX-1001", "underwriter": " stewart title ", "premium": "$1,250.00", "closed": "03/04/2026", "zip": "02134"},
    {"id": "TX-1002", "underwriter": "STEWART TITLE ", "premium": "(40)", "closed": "46085", "zip": "75001"},
    {"id": "FL-2001", "underwriter": "First American", "premium": "n/a", "closed": "2026-03-05", "zip": "33101"},
    {"id": "FL-2002", "underwriter": "first  american", "premium": "12.5%", "closed": "5-Mar-26", "zip": "33101"},
]
def clean_text(s):
    return " ".join(str(s).replace(" ", " ").split()).upper()
def parse_amount(s):
    s = str(s).strip().replace(",", "").replace("$", "")
    neg = s.startswith("(") and s.endswith(")")
    s = s.strip("()")
    if s.lower() in ("", "-", "n/a", "null"):
        return None
    if s.endswith("%"):
        return float(s[:-1]) / 100
    return -float(s) if neg else float(s)
def parse_date(s):
    s = str(s).strip()
    if s.isdigit() and len(s) == 5:
        return date(1899, 12, 30) + timedelta(days=int(s))
    for f in ("%Y-%m-%d", "%m/%d/%Y", "%d-%b-%y"):
        try:
            return datetime.strptime(s, f).date()
        except ValueError:
            pass
    return None
for r in raw:
    out = {"id": r["id"], "underwriter": clean_text(r["underwriter"]), "premium": parse_amount(r["premium"]),
           "closed": parse_date(r["closed"]), "zip": r["zip"].zfill(5)}
    print(out)
```

### Quiz

1. `=TRIM(A2)` leaves a space at the end of the cell. The likely cause:
- [ ] TRIM only removes leading spaces
- [x] The character is a non-breaking space (CHAR(160)), which TRIM ignores
- [ ] The cell is a number
> Use `SUBSTITUTE(A2, CHAR(160), " ")` before TRIM.

2. Excel serial date 46085 corresponds to:
- [ ] 46 085 seconds after midnight
- [x] The number of days since 30 December 1899
- [ ] A ZIP code
> Excel dates are day counts; formatting the cell as a date reveals 4 March 2026.

3. The safest way to parse `03/04/2026` is:
- [ ] Let the tool guess
- [x] Confirm the source's day/month order and pass an explicit format
- [ ] Assume day-first because most countries use it
> Ambiguous dates must be resolved from the source's convention, never inferred.

4. A ZIP code column shows `2134` instead of `02134` because:
- [x] The column was treated as numeric and lost the leading zero
- [ ] The ZIP is invalid
- [ ] TRIM removed it
> Codes with leading zeros must be stored as text.

### Exercises

1. **Excel formula** — Convert text `"$1,250.00"` in A2 to a number.
<details><summary>Solution</summary>

`=VALUE(SUBSTITUTE(SUBSTITUTE(A2,"$",""),",",""))`. In Microsoft 365, `=NUMBERVALUE(A2)` also handles the currency symbol in many locales.

</details>

2. **Locale** — A European partner sends premiums as `1.250,50`. What do you do in Power Query?
<details><summary>Solution</summary>

Transform → Data Type → Using Locale → Decimal Number with locale "German (Germany)" (or any locale using comma decimals), so the value parses as 1250.50 rather than 1.25050 or an error.

</details>

3. **Diagnose** — After import, half the dates in a column are wrong by swapping day and month. Explain.
<details><summary>Solution</summary>

The parser inferred month-first; values with day ≤ 12 parsed "successfully" but wrong, values with day > 12 either failed or forced a day-first parse. Re-import with an explicit day-first format for the whole column.

</details>

### Interview Questions

**Q: A sum in Excel is lower than expected. Walk through how you find the cause.**
First I compare `COUNT` and `COUNTA` on the column; a gap means text cells that the SUM is ignoring, usually from currency symbols, thousands separators, or a leading apostrophe from an export. I check for the green triangle and for right-versus-left alignment, since text aligns left by default. If the counts match, I look for filtered or hidden rows, a `SUM` range that stops short of the last row, and values that are visually numbers but contain a non-breaking space. Then I check whether negatives are stored as `(40)` text. The fix is a helper column with `VALUE(SUBSTITUTE(...))` or Text to Columns, and the permanent fix is parsing the export properly in Power Query so the workbook never sees text amounts.

**Q: Why are dates the most dangerous kind of dirty data?**
Because a wrong date parse produces a valid-looking date rather than an error. Swapping day and month silently moves a March closing to April and changes every monthly KPI; an Excel serial read as text sorts alphabetically; a two-digit year `26` may become 1926 in some tools. The errors are also selective, hitting only days 1 to 12, so spot checks on a few rows can miss them. My defences are to confirm the source convention in writing, parse with an explicit format, convert to ISO or a true date type at the first step, and add a validation rule that the date range matches the reporting period, which catches most swaps because they push dates out of the expected month.

**Q: How do you handle a file where the encoding is wrong?**
Symptoms like `Ã©` for `é` or `â€™` for an apostrophe mean UTF-8 bytes were decoded as Windows-1252. The right fix is to re-read the file with the correct encoding, `encoding="utf-8"` in pandas or File Origin 65001 in Power Query and Excel's import wizard, rather than search-and-replacing the garbled sequences, which misses cases and corrupts real text. If the file is genuinely mixed, I decode with `errors="replace"`, count the replacement characters, and report them as a data-quality issue to the sender. For names of counties or clients that must match a lookup, I also normalise Unicode (NFC) and strip accents in the comparison key while keeping the original for display.

**Q: In what order do you apply cleaning transformations and why?**
Text normalisation first: trim, remove non-breaking spaces, unify case, because every later step compares strings and fails on invisible differences. Then type conversion of numbers and dates, since parsing needs clean strings and later validation needs real types. Then code mapping through lookup tables, which needs both clean strings and, sometimes, parsed values to decide. Then validation rules, which need correct types and canonical codes. Then deduplication, because the duplicate key is only reliable after standardisation. Finally missing-value handling and reconciliation. Running validation before standardisation floods the issues log with false failures, and deduplicating before trimming misses duplicates.

## Handling missing values

A blank cell is a decision waiting to be made. Was the premium never entered, not applicable, or lost in export? Treating all three the same way produces wrong averages, wrong counts and, worst of all, wrong denominators for KPIs. This chapter shows how to find missing values, classify them, and choose the right treatment per column.

### Recognising missingness

Missing values hide behind many masks:

| Appearance | Meaning | Action |
|---|---|---|
| Empty cell, `NULL`, `NaN`, `None` | Truly missing | Treat as null |
| `N/A`, `n/a`, `-`, `.`, `?`, `none` | Human-entered "no value" | Convert to null; keep a note of which token |
| `0` in an amount column | Ambiguous: zero or missing? | Ask the owner; often missing |
| `9999`, `-1`, `1900-01-01`, `12/31/9999` | System sentinels | Convert to null |
| A whole column blank for one week | Export change | Escalate; do not fill |
| `Unknown`, `Other` | Category for missing | Keep as a category, report it |

Profile them: count per column, and count per column *per source or per week*, because a jump from 2% to 40% missing in one week is an export failure, not a data property.

### Why it matters: the denominator problem

Accuracy rate = files without defects ÷ files audited. If 300 of 2 000 files have a blank audit result, is the denominator 2 000 or 1 700? Count them as passes and accuracy is inflated; count them as fails and it is deflated; exclude them and the rate is honest but the coverage is 85%, which must be stated. Every KPI definition must say what happens to missing values.

### The three mechanisms

Statisticians distinguish why data are missing, and it changes what you may do:

- **MCAR** (missing completely at random): a random 3% of premiums lost in export. Dropping them biases nothing.
- **MAR** (missing at random given other columns): commercial files more often lack a page count, but within commercial files it is random. Dropping biases the page-count average; imputing by group is defensible.
- **MNAR** (missing not at random): high-premium files are the ones missing premiums because agents skip the hard ones. No simple fix; report the gap.

You rarely know for certain, but comparing the rows with and without the value on other columns (state, agent, week, file type) tells you which is plausible.

### Treatments

1. **Leave as null and report coverage.** Default for reporting: "average premium based on 1 700 of 2 000 files (85%)".
2. **Drop rows.** Only when the missing field is essential to the row's meaning (no file ID) and the count is small and documented.
3. **Fill from another source.** Look it up: the premium exists in the billing system; the county follows from the ZIP.
4. **Fill with a constant.** `0` only when missing genuinely means zero (no defects recorded = 0 defects, if the audit happened); `"UNKNOWN"` for categories.
5. **Impute statistically.** Mean/median per group, or a regression. Acceptable for analysis, dangerous in operational reports, and always flagged in a separate column.
6. **Forward fill.** Appropriate for repeated headers or "same as above" layouts (Power Query Fill Down), never for measurements.

```python
import pandas as pd
df = pd.read_csv("week37.csv", na_values=["N/A", "n/a", "-", ".", "9999"])
missing_report = df.isna().mean().mul(100).round(1).sort_values(ascending=False)
df["premium_missing"] = df["premium"].isna()                       # flag before filling
df["pages"] = df["pages"].fillna(df.groupby("file_type")["pages"].transform("median"))
df = df.dropna(subset=["file_id"])                                # essential key
```

Excel: `=IF(A2="", NA(), A2)` to make blanks explicit; `=AVERAGEIF(B:B, "<>")` is unnecessary because AVERAGE already skips blanks but *not* zeros, which is the classic mistake. `=COUNTBLANK` for the report. Power Query: Replace Values (`null` → something) and Fill Down, and remember that `null` in a numeric column is ignored by aggregations while `0` is not.

### Missing rows versus missing cells

A file that is entirely absent is invisible in the data. Compare the row count to the expected count (last week's, or the source system's), and check that every expected group is present: every state, every agent, every business day. A day with zero rows in a production log is almost never a day with zero production.

> **Warning:** Filling missing values with the mean preserves the average and destroys the variance, so any spread, percentile or SLA-breach count computed afterwards is wrong. Impute only for the specific calculation that needs it, and never save the imputed values back into the "clean" dataset without a flag.

### Try It Yourself

```python
import statistics
files = [
    {"id": "TX-1", "type": "res", "premium": 1250.0, "audited": "pass"},
    {"id": "TX-2", "type": "res", "premium": None,   "audited": "fail"},
    {"id": "TX-3", "type": "com", "premium": 8800.0, "audited": None},
    {"id": "TX-4", "type": "com", "premium": None,   "audited": "pass"},
    {"id": "FL-1", "type": "res", "premium": 990.0,  "audited": "pass"},
    {"id": "FL-2", "type": "res", "premium": 0.0,    "audited": None},      # 0: zero or missing?
    {"id": "FL-3", "type": "com", "premium": 12400.0, "audited": "pass"},
    {"id": "FL-4", "type": "res", "premium": 1100.0, "audited": "pass"},
]
n = len(files)
for col in ("premium", "audited"):
    miss = sum(f[col] is None for f in files)
    print(f"{col}: {miss}/{n} missing ({100*miss/n:.0f}%)")

# Missing by group: is 'premium' missing at random across file types?
for t in ("res", "com"):
    grp = [f for f in files if f["type"] == t]
    print(f"  premium missing in {t}: {sum(f['premium'] is None for f in grp)}/{len(grp)}")

# Accuracy KPI under three policies for missing audit results
audited = [f for f in files if f["audited"] is not None]
passes = sum(f["audited"] == "pass" for f in audited)
print(f"\nAccuracy excluding missing: {passes}/{len(audited)} = {100*passes/len(audited):.1f}% (coverage {len(audited)}/{n})")
print(f"Accuracy counting missing as pass: {100*(passes + n - len(audited))/n:.1f}%")
print(f"Accuracy counting missing as fail: {100*passes/n:.1f}%")

# Mean premium with and without treating 0 as missing, and median imputation by type with a flag
prem = [f["premium"] for f in files if f["premium"] is not None]
print(f"\nMean premium (0 kept): {statistics.mean(prem):.0f}; (0 as missing): {statistics.mean([p for p in prem if p != 0]):.0f}")
for f in files:
    f["premium_imputed"] = f["premium"] is None
    if f["premium"] is None:
        same = [g["premium"] for g in files if g["type"] == f["type"] and g["premium"] not in (None, 0.0)]
        f["premium"] = statistics.median(same)
print([(f["id"], f["premium"], f["premium_imputed"]) for f in files if f["premium_imputed"]])
```

### Quiz

1. AVERAGE in Excel ignores:
- [x] Blank cells but not zeros
- [ ] Zeros but not blank cells
- [ ] Both blanks and zeros
> Blank cells are skipped; zeros are real values and pull the average down.

2. An accuracy KPI has 15% of audit results missing. The honest report:
- [ ] Counts them as passes
- [x] Excludes them and states the coverage (85%)
- [ ] Counts them as fails
> Excluding with stated coverage avoids inventing outcomes; the gap itself is a finding.

3. Missingness that depends on the missing value itself (high premiums skipped) is:
- [ ] MCAR
- [ ] MAR
- [x] MNAR
> Missing not at random cannot be fixed by imputation from other columns.

4. Why flag imputed values in a separate column?
- [x] So downstream users can exclude or examine them and the imputation is auditable
- [ ] To make the file wider
- [ ] Because pandas requires it
> A flag preserves the distinction between observed and estimated data.

### Exercises

1. **Define the rule** — Write the missing-value rule for a "turnaround hours" column used in an SLA report.
<details><summary>Solution</summary>

"Turnaround is null when open or close timestamp is missing. Null rows are excluded from the SLA rate and reported as 'unmeasured' with their count. Turnaround of 0 is treated as null (a file cannot close instantly) and flagged for the data owner. No imputation."

</details>

2. **Detect the export failure** — How would you automatically detect that a column went from 2% to 40% missing this week?
<details><summary>Solution</summary>

Compute missing % per column per week; compare this week to the trailing 4-week average; raise a check failure if the increase exceeds a threshold (e.g. 10 percentage points). In pandas: `df.groupby("week")[cols].apply(lambda g: g.isna().mean())`.

</details>

3. **Choose a treatment** — County is missing for 120 files but ZIP is present. What do you do?
<details><summary>Solution</summary>

Fill from another source: a ZIP-to-county lookup table. Flag the filled rows, and note that a few ZIPs span two counties, in which case leave null and list them.

</details>

### Interview Questions

**Q: How do you decide whether to drop, fill or keep missing values?**
By asking what the value means and how it will be used. If the missing field is the row's identity, such as a file ID, the row is unusable and I drop it with a count. If the value exists elsewhere, I fill it from that source and flag it. If missingness is small and plausibly random and the field is a measurement, I leave it null and report coverage; averages skip nulls correctly, and the coverage line is honest. I impute only for a specific analysis that requires complete cases, such as a regression, and never in an operational KPI, because a filled value in an SLA report is a fabricated result. And if a column suddenly becomes mostly missing, that is an incident with the source, not a cleaning task.

**Q: What is the danger of zero as a missing-value stand-in?**
Zero is a legitimate number, so every aggregate treats it as data: averages fall, minimums become zero, rates of "zero-premium files" appear, and an SLA check on turnaround shows instant closings. In a production extract I once found 8% of premiums as 0 because the export wrote 0 for unpriced files, which cut the average premium by 8% and made a real decline look worse. The fix is to convert sentinel zeros to null at import, based on a rule agreed with the data owner such as "premium 0 with status unpriced means missing", and to profile the zero count separately from the null count every week so a change in the export shows up.

**Q: Explain MCAR, MAR and MNAR with a reporting example.**
If a random 2% of rows lose their page count in every export, it is MCAR: dropping them changes nothing but the sample size. If commercial files often lack a page count because their workflow skips it, but within commercial files the gaps are random, it is MAR: the overall page average is biased toward residential files, but a per-type calculation or imputation by type is fine. If the files missing turnaround are precisely the ones that took longest, because agents forget to close slow files, it is MNAR: every treatment understates turnaround and the honest report says "12% of files have no close time; the SLA figure is an upper bound on performance". Knowing which case you are in is what separates a defensible number from a guess.

**Q: How do you report missing data to management without burying the finding?**
As a coverage line under every KPI and as a trend, not as a footnote. "Accuracy 96.8% on 1 700 audited files, coverage 85% (was 97% last week)" makes the drop in coverage visible, and the drop is often the real story: an audit backlog or a broken export. I include a small data-quality panel in the weekly report with rows in, rows failing each rule, and missing % for the key fields, with a red/amber/green threshold. Management does not need the mechanisms; they need to know whether the number can be trusted and whether trust is changing.

## Deduplication

Duplicates inflate every count and sum, and they are the most common reason a report's total disagrees with the source system. But "duplicate" is not a property of the data; it is a definition you must make. Two rows with the same file ID but different statuses may be one file updated twice, or two genuinely different orders. This chapter teaches how to define, find, and resolve duplicates, and how to prove afterwards that the result is right.

### Three kinds of duplicate

| Kind | Example | Detection |
|---|---|---|
| Exact | Two identical rows from a double export | Compare all columns |
| Key duplicate | Same `file_id`, different `status` or `updated_at` | Compare the business key |
| Fuzzy | `"Stewart Title Guaranty"` vs `"Stewart Title Guaranty Co."`, or same borrower with a typo | Normalise, then compare; similarity scoring |

Exact duplicates are safe to remove. Key duplicates require a **survivorship rule**: which row wins? Fuzzy duplicates require a **matching rule** and usually human review.

### Defining the grain and the key

Ask: "what does one row represent?" A file, a file-version, a file-per-underwriter, a task? That is the **grain**. The **business key** is the smallest set of columns that identifies one thing at that grain: `file_id` for files, `file_id + underwriter` for a rate-comparison matrix, `file_id + task_type` for a task log. Deduplicate on the key, never on "rows that look similar".

### Finding duplicates

Excel:

- Helper column `=COUNTIFS($A$2:$A$5000, A2) > 1` marks every row of every duplicated key.
- `=COUNTIFS($A$2:A2, A2)` numbers occurrences 1, 2, 3 so you can keep occurrence 1.
- Data → Remove Duplicates removes rows by chosen columns, keeping the **first** occurrence, with no log of which rows were removed. Sort deliberately before using it.

Power Query: Home → Remove Rows → Remove Duplicates on the selected columns (keeps the first row in current order; sort first, and note that Power Query may not honour the sort unless you buffer with `Table.Buffer`). Or Group By the key with Max of `updated_at` and All Rows, then expand.

SQL:

```sql
-- Which keys are duplicated, and how often
SELECT file_id, COUNT(*) AS n FROM production GROUP BY file_id HAVING COUNT(*) > 1;

-- Keep the latest version per file
SELECT * FROM (
  SELECT p.*, ROW_NUMBER() OVER (PARTITION BY file_id ORDER BY updated_at DESC, status_rank) AS rn
  FROM production p
) t WHERE rn = 1;
```

Python:

```python
df["dup_key"] = df.duplicated(subset=["file_id"], keep=False)          # mark all copies
latest = (df.sort_values(["file_id", "updated_at"], ascending=[True, False])
            .drop_duplicates(subset=["file_id"], keep="first"))
```

### Survivorship rules

Write them down before running anything:

1. Prefer the row with the latest `updated_at`.
2. Ties: prefer status `Closed` over `Open` over `Cancelled`.
3. Ties: prefer the row with fewer nulls.
4. Ties: prefer the row from the primary source system.
5. Otherwise keep the first and log the key for review.

Sometimes the right answer is to **merge** rather than choose: take the non-null premium from row A and the non-null county from row B. That is a coalesce per column, and it must be documented per column.

### Fuzzy matching

For names of underwriters, counties or clients, normalise first: upper-case, strip punctuation, remove legal suffixes (`CO`, `INC`, `LLC`, `GUARANTY`), collapse spaces. Then compare with a similarity measure: Levenshtein distance, Jaro-Winkler, or token overlap. `difflib.SequenceMatcher(None, a, b).ratio()` in the standard library gives 0 to 1; above 0.9 is usually the same entity, 0.7 to 0.9 needs review, below is different. Excel has no native fuzzy match except the Fuzzy Lookup add-in and Power Query's **Merge with fuzzy matching** (similarity threshold, transformation table).

Never auto-merge fuzzy matches into a report without a reviewed mapping table. Once reviewed, the mapping table becomes the lookup you apply every week, and the fuzzy step is only run on new values.

### Proving it

After deduplication, report: rows in, rows out, rows removed, distinct keys before and after (must equal rows out), and a sample of removed rows with the reason. The key column must now be unique: `df["file_id"].is_unique` or a `COUNTIF` max of 1. Then reconcile a total (premium sum or file count) to the source system.

> **Interview note:** "How do you deduplicate?" is really "do you know your grain?" Say the grain, the key, the survivorship rule and the proof, in that order.

### Try It Yourself

```python
from difflib import SequenceMatcher
rows = [
    {"file_id": "TX-1001", "status": "Open",   "updated": "2026-03-04 09:00", "premium": 1250.0},
    {"file_id": "TX-1001", "status": "Closed", "updated": "2026-03-05 16:30", "premium": 1250.0},
    {"file_id": "TX-1002", "status": "Closed", "updated": "2026-03-05 10:00", "premium": None},
    {"file_id": "TX-1002", "status": "Closed", "updated": "2026-03-05 10:00", "premium": None},   # exact dup
    {"file_id": "FL-2001", "status": "Closed", "updated": "2026-03-06 11:00", "premium": 990.0},
    {"file_id": "FL-2001", "status": "Cancelled", "updated": "2026-03-06 11:00", "premium": 990.0},
]
rank = {"Closed": 0, "Open": 1, "Cancelled": 2}
# 1) exact duplicates
seen, exact = set(), []
for r in rows:
    key = tuple(sorted(r.items()))
    if key in seen:
        continue
    seen.add(key); exact.append(r)
# 2) key duplicates with survivorship: latest updated, then status rank
best = {}
for r in exact:
    k = r["file_id"]
    if k not in best or (r["updated"], -rank[r["status"]]) > (best[k]["updated"], -rank[best[k]["status"]]):
        best[k] = r
clean = list(best.values())
print(f"rows in {len(rows)}, after exact dedup {len(exact)}, after key dedup {len(clean)}")
print("distinct keys:", len({r['file_id'] for r in rows}), "== rows out:", len(clean))
for r in clean:
    print(" ", r)
# 3) fuzzy matching of underwriter names against a master list
master = ["STEWART TITLE GUARANTY", "FIRST AMERICAN TITLE", "OLD REPUBLIC NATIONAL TITLE", "FIDELITY NATIONAL TITLE"]
def norm(s):
    s = " ".join(s.upper().replace(".", "").replace(",", "").split())
    for suffix in (" CO", " COMPANY", " INC", " LLC", " INSURANCE"):
        s = s.replace(suffix, "")
    return s.strip()
incoming = ["Stewart Title Guaranty Co.", "First American Title Insurance Company", "Old Republic Natl Title", "Fidelty National Title", "Chicago Title"]
for name in incoming:
    scored = sorted(((SequenceMatcher(None, norm(name), m).ratio(), m) for m in master), reverse=True)
    score, match = scored[0]
    verdict = "auto" if score >= 0.9 else "review" if score >= 0.7 else "no match"
    print(f"{name:42} -> {match:30} {score:.2f} {verdict}")
```

### Quiz

1. Before removing duplicates you must define:
- [ ] The sort order of the sheet
- [x] The grain of a row and the business key
- [ ] The number of columns
> Duplicates only exist relative to a key at a stated grain.

2. Excel's Remove Duplicates keeps:
- [x] The first occurrence in the current order, without logging removals
- [ ] The most recent occurrence by date
- [ ] A random occurrence
> Sort first so the row you want is first, and keep a copy for the log.

3. A survivorship rule is:
- [ ] A rule for which report survives review
- [x] The rule deciding which of several rows with the same key is kept
- [ ] A fuzzy matching threshold
> It resolves key duplicates deterministically.

4. A fuzzy match with similarity 0.78 should be:
- [ ] Merged automatically
- [x] Sent for human review and added to a mapping table once confirmed
- [ ] Discarded
> Mid-range similarities are ambiguous; the reviewed mapping becomes the reusable rule.

### Exercises

1. **SQL** — Keep one row per `file_id` and `underwriter`, preferring the highest `version`.
<details><summary>Solution</summary>

```sql
SELECT * FROM (
  SELECT r.*, ROW_NUMBER() OVER (PARTITION BY file_id, underwriter ORDER BY version DESC) AS rn
  FROM rates r
) t WHERE rn = 1;
```

</details>

2. **Excel** — Mark every row whose `file_id` (column A) appears more than once, and number its occurrence.
<details><summary>Solution</summary>

Duplicate flag: `=COUNTIF($A$2:$A$5000, A2) > 1`. Occurrence number: `=COUNTIF($A$2:A2, A2)`. Filter occurrence = 1 to keep the first after sorting by date descending.

</details>

3. **Grain question** — A rate matrix has one row per state, county and underwriter. What is the key, and what would a duplicate mean?
<details><summary>Solution</summary>

Key: state + county + underwriter (+ effective date if rates change over time). A duplicate means two rates for the same cell of the matrix, which must be resolved by effective date or escalated; it cannot be averaged.

</details>

### Interview Questions

**Q: How do you approach deduplication on a dataset you have never seen?**
I start by establishing the grain with the data owner: what one row is supposed to be. Then I test the candidate key for uniqueness; if `file_id` repeats, I look at what differs between the copies, because that tells me whether they are re-exports (identical), updates (different timestamps or statuses) or genuinely different things (the key is incomplete and needs another column). I write a survivorship rule that matches the business meaning, such as the latest version or the closed status, apply it in code or SQL with a window function, and then prove the result: key is unique, rows out equals distinct keys, and a total reconciles to the source. The removed rows go to a log sheet. For a weekly title-production feed this turned a recurring 3 to 5% over-count into an exact match.

**Q: What goes wrong with Excel's Remove Duplicates?**
It keeps the first occurrence in the current row order with no record of what it removed, so if the sheet is not sorted the way you intend, you keep the stale row; it compares cell text exactly, so `"TX"` and `"TX "` are different; it silently treats numbers formatted differently as duplicates or not depending on the stored value; and it is a destructive, unlogged action on the sheet. I use it only on a copy, after sorting deliberately, and I record before and after counts. For anything repeatable I use Power Query or a formula-based occurrence number so the logic is visible and re-runnable.

**Q: When is fuzzy matching appropriate and how do you keep it safe?**
When the same real-world entity arrives under different spellings and there is no shared code: underwriter names from six different sources, county names with abbreviations, client names typed by hand. It is safe when the output is a mapping table that a person reviews, not an automatic merge. I normalise aggressively first, then score with a string similarity, auto-accept only very high scores where the normalised strings are essentially identical, and route the middle band to review with the top three candidates shown. Once reviewed, the mapping is a lookup that runs every week deterministically; the fuzzy code only runs for values not yet in the table, and new mappings are added to it.

**Q: Explain a window function for deduplication to someone who only knows Excel.**
`ROW_NUMBER() OVER (PARTITION BY file_id ORDER BY updated_at DESC)` is the SQL equivalent of sorting the sheet by file ID and date descending and then writing `=COUNTIF($A$2:A2, A2)` in a helper column: it numbers the rows within each file ID starting at 1 for the newest. Filtering `rn = 1` keeps the newest row per file. The advantages over Excel are that the sort is part of the expression, so it cannot be forgotten, and the tie-break order can include several columns such as status and source. The same idea exists in Power Query as Group By with All Rows followed by taking the first row of each sorted group.

# LEVEL: Intermediate

## Validation rules and QA checks: ranges, referential integrity, totals

Cleaning fixes what you can see; **validation** catches what you cannot, every time the pipeline runs. A validation rule is a statement about the data that must be true, a check that tests it, and a defined action when it fails. A set of rules turns "I looked at it and it seemed fine" into "all 38 checks passed; 2 warnings listed below".

### Types of rule

| Type | Example | Failure means |
|---|---|---|
| Type | `premium` is numeric; `close_date` is a date | Parsing problem |
| Presence | `file_id`, `state` never null | Incomplete extract |
| Domain | `state` in the 50-code list; `status` in {Open, Closed, Cancelled} | Unknown code |
| Range | `0 < premium < 500 000`; `0 < pages < 2 000` | Typo, unit error |
| Format | `file_id` matches `^[A-Z]{2}-\d{4,6}$`; ZIP matches `^\d{5}$` | Keying error |
| Cross-field | `close_date >= open_date`; `defects <= items_checked` | Logic error |
| Uniqueness | `file_id` unique | Duplicates |
| Referential integrity | Every `county` exists in the county master for that state; every `agent_id` in the roster | Orphan records |
| Totals / reconciliation | Sum of premium = source total; row count = source count ± 0 | Rows lost or added |
| Statistical | This week's volume within ±30% of the 4-week average | Export or process anomaly |

### Severity and action

Each rule has a severity: **error** stops the report (a wrong grain, a lost 10% of rows), **warning** allows the report with a note (three unknown county names), **info** is logged. Decide the action in advance: reject the file, quarantine the failing rows into an exceptions sheet, fix by rule (map the code) or fix at source (send back to the data-entry team).

### Writing the rules

Keep them in a table, not in someone's head:

```text
rule_id  column      rule                                   severity  action
R01      file_id     not null and unique                    error     reject file
R02      state       in ref_states.code                     error     quarantine row
R03      county      exists in ref_counties for state       warning   quarantine row
R04      premium     numeric, > 0, < 500000                 warning   quarantine row
R05      close_date  >= open_date                           error     quarantine row
R06      close_date  within reporting week                  warning   flag
R07      (file)      row count = control total from source  error     reject file
R08      (file)      sum(premium) = control total            error     reject file
R09      volume      within 30% of trailing 4-week average  warning   flag report
```

The table is the contract with the data owner: they can read it, argue about it and sign off on it.

### Referential integrity

The most valuable rule class. A county name that is not in the county master for its state is either a spelling variant (add to the lookup) or a real error (wrong state). Implementation: a **left join** from the data to the master; rows where the master side is null fail.

```sql
SELECT p.file_id, p.state, p.county
FROM production p
LEFT JOIN ref_counties c ON c.state = p.state AND c.county = p.county
WHERE c.county IS NULL;
```

Excel: `=ISNUMBER(MATCH(B2&"|"&C2, ref!D:D, 0))` against a concatenated key column in the reference sheet, or `=COUNTIFS(ref!A:A, B2, ref!B:B, C2) > 0`. Power Query: Merge Queries with Left Anti join gives the failing rows directly.

### Totals and control totals

Every extract should come with control totals: row count, sum of a key amount, and count per major category, produced by the source system. Your first check compares them. Without control totals from the source, compare to the previous period and to an independent path (billing versus production). A report that cannot show its file count matches the system of record has no defence when challenged.

### Statistical checks

Type and domain rules catch bad values; statistical rules catch bad *files*. Weekly volume, average premium, share of commercial files and missing rates all have normal ranges; compute the trailing mean and standard deviation and flag values more than 2 to 3 SD away. These checks caught, in practice, a week where an export was run twice (volume doubled), a week where one state was omitted (volume −15%, that state 0) and a week where the date filter shifted (half the files had last week's dates).

### Running the checks

In Excel, a **Checks** sheet with one row per rule, a formula computing pass/fail, and a summary cell `=COUNTIF(D:D,"FAIL")` that conditional-formats red. In Power Query, each rule is a step that adds a boolean column, plus a final query that filters to failures. In Python, a list of functions each returning the failing rows, run in order, with counts printed.

> **Tip:** Keep the exceptions, not just the counts. "R03 failed for 7 rows" is useless to the person who must fix them; the seven rows with file IDs and the offending county are what they need. Exceptions sheets are the output that makes validation actionable.

### Try It Yourself

```python
import re
from datetime import date
ref_states = {"TX", "FL", "CA"}
ref_counties = {("TX", "HARRIS"), ("TX", "DALLAS"), ("FL", "MIAMI-DADE"), ("FL", "ORANGE"), ("CA", "LOS ANGELES")}
control = {"rows": 6, "premium_sum": 17390.0}
rows = [
    {"file_id": "TX-100231", "state": "TX", "county": "HARRIS", "premium": 1250.0, "open": date(2026,3,2), "close": date(2026,3,4)},
    {"file_id": "TX-100232", "state": "TX", "county": "DALAS",  "premium": 980.0,  "open": date(2026,3,2), "close": date(2026,3,5)},
    {"file_id": "FL-200118", "state": "FL", "county": "ORANGE", "premium": 2100.0, "open": date(2026,3,6), "close": date(2026,3,5)},
    {"file_id": "FL-200119", "state": "FL", "county": "MIAMI-DADE", "premium": 0.0, "open": date(2026,3,3), "close": date(2026,3,6)},
    {"file_id": "CA-3001",   "state": "CA", "county": "LOS ANGELES", "premium": 12400.0, "open": date(2026,3,3), "close": date(2026,3,9)},
    {"file_id": "CA-300224", "state": "cA", "county": "LOS ANGELES", "premium": 660.0, "open": date(2026,3,4), "close": date(2026,3,6)},
]
rules = [
    ("R01", "error",   "file_id format AA-nnnnnn", lambda r: bool(re.fullmatch(r"[A-Z]{2}-\d{6}", r["file_id"]))),
    ("R02", "error",   "state in reference list",  lambda r: r["state"] in ref_states),
    ("R03", "warning", "county exists for state",  lambda r: (r["state"], r["county"]) in ref_counties),
    ("R04", "warning", "0 < premium < 500000",     lambda r: 0 < r["premium"] < 500000),
    ("R05", "error",   "close >= open",            lambda r: r["close"] >= r["open"]),
]
exceptions = []
for rid, sev, desc, test in rules:
    failed = [r["file_id"] for r in rows if not test(r)]
    print(f"{rid} [{sev:7}] {desc:28} {'PASS' if not failed else 'FAIL ' + str(len(failed))}")
    exceptions += [(rid, f) for f in failed]
ids = [r["file_id"] for r in rows]
print(f"R06 [error  ] file_id unique               {'PASS' if len(set(ids)) == len(ids) else 'FAIL'}")
print(f"R07 [error  ] row count = control          {'PASS' if len(rows) == control['rows'] else 'FAIL'}")
psum = sum(r["premium"] for r in rows)
print(f"R08 [error  ] premium sum = control        {'PASS' if abs(psum - control['premium_sum']) < 0.005 else f'FAIL (got {psum:.2f})'}")
print("\nExceptions for the data owner:")
for rid, f in exceptions:
    print(f"  {rid} {f}")
errors = [e for e in exceptions if e[0] in ("R01", "R02", "R05")]
print("\nReport status:", "BLOCKED (errors present)" if errors else "OK to publish")
```

### Quiz

1. A referential-integrity rule checks that:
- [ ] Values are within a numeric range
- [x] Each code exists in a reference (master) table
- [ ] The file has the right number of columns
> It guards against orphan values like a county that does not exist in its state.

2. Which join isolates rows that fail a lookup?
- [ ] Inner join
- [x] Left anti join (left join where the right side is null)
- [ ] Cross join
> Rows without a match on the reference side are the failures.

3. A control total is:
- [x] A count or sum produced by the source system, used to confirm nothing was lost
- [ ] The total row at the bottom of a report
- [ ] A budget figure
> Control totals are the reconciliation anchor for an extract.

4. Weekly volume is 2.1× the trailing average. The most likely explanation is:
- [ ] A genuine doubling of business
- [x] The export was run twice or the date filter widened
- [ ] A rounding error
> Statistical checks exist to catch exactly this kind of file-level anomaly.

### Exercises

1. **Write three rules** — For a QA audit log with columns `file_id, checker, items_checked, defects, audit_date`, write three validation rules with severity.
<details><summary>Solution</summary>

`defects <= items_checked` (error); `checker` exists in the checker roster (error); `audit_date` within the reporting week and not in the future (warning). Optionally `items_checked > 0` (error).

</details>

2. **Excel** — Flag rows whose (state, county) pair is not in a reference sheet with columns A (state) and B (county).
<details><summary>Solution</summary>

`=IF(COUNTIFS(ref!$A:$A, B2, ref!$B:$B, C2)=0, "FAIL", "OK")`

</details>

3. **Design the action** — R04 (premium range) fails on 40 rows out of 5 000. Should the report go out?
<details><summary>Solution</summary>

R04 is a warning: publish with the 40 rows quarantined into an exceptions sheet, the KPI computed without them, the coverage stated (4 960 of 5 000), and the exceptions sent to the data owner. If the failures were 400, escalate before publishing because the pattern suggests a systematic unit or export error.

</details>

### Interview Questions

**Q: What validation do you run before a report goes out?**
A fixed checklist that runs automatically: structure (expected columns, types), presence and uniqueness of the key, domain checks of every code column against master lists, range checks on amounts and dates, cross-field logic such as close after open, reconciliation of row count and a key sum to the source's control totals, and statistical checks of the week's volume and mix against the trailing four weeks. Each rule has a severity; errors block distribution, warnings go into an exceptions sheet attached to the report. For the weekly title-production report this was about forty rules in a Checks sheet, and the top of the report showed "38 pass, 2 warnings" so the reader could see the data had been tested.

**Q: How do you handle a validation failure at 4 pm on report day?**
Triage by severity and cause. If it is a warning with a handful of rows, quarantine them, publish with the exceptions listed, and follow up. If it is an error such as a reconciliation gap, I do not publish a number I cannot defend; I find the cause, which is usually visible from the exceptions (a missing state, a duplicated batch), fix it by rule if the fix is mechanical, or send a short note that the report is delayed with the reason and an ETA. A delayed correct report costs less than a retracted wrong one. Afterwards the failure becomes a new rule or an earlier check so the same problem is caught at import rather than at 4 pm.

**Q: How would you validate a rate matrix rather than a transaction file?**
Different grain, different rules. Uniqueness of (state, county, underwriter, effective date); completeness: every county in the state master appears for every underwriter, with a count of gaps; range and monotonicity: rates must be positive and, for tiered rate tables, non-decreasing with the coverage amount; cross-source: spot-check a sample of cells against the underwriter's published rate card and record the sample; version control: effective dates do not overlap for the same cell; and a total-count reconciliation of cells against the previous version with a list of changed cells. The changed-cell list is the most valuable output because it is what a reviewer actually needs to approve.

**Q: What is the difference between validation and cleaning, and why keep them separate?**
Cleaning changes values by rule; validation tests values and produces pass, fail and exceptions without changing anything. Keeping them separate means the checks are an independent judgement of the cleaned output rather than part of the process that produced it, so a bug in a cleaning rule shows up as a validation failure instead of being hidden. It also makes ownership clear: cleaning rules belong to the analyst, validation rules are agreed with the data owner and the report's consumer, and a rule change is a visible decision. In practice the pipeline runs clean, then validate, then reconcile, and the validation summary is printed on the report.

## Standardising codes and lookups: states, counties, underwriters

Every dataset that combines sources needs one vocabulary. Six underwriters send rate sheets with six ways of writing "Miami-Dade County"; three systems abbreviate Texas three ways; one agent types "Old Republic" and another "ORNTIC". **Standardisation** replaces every variant with a canonical code through a **lookup table**, and the lookup tables become assets you maintain for years.

### Canonical codes

Choose a code that is short, stable and unambiguous, and store the display name separately:

| Entity | Canonical code | Display name | Notes |
|---|---|---|---|
| State | USPS two-letter (`TX`) | Texas | Also FIPS numeric `48` for federal data |
| County | State + FIPS (`48201`) | Harris County, TX | Names repeat across states (Orange County exists in 8 states) |
| Underwriter | Your own short code (`STG`, `FATIC`, `ORNTIC`, `FNTIC`, `CTIC`, `WFG`) | Stewart Title Guaranty Company | Legal names change; codes should not |
| Agent | Employee ID | Name | Names are not unique |
| Status | Fixed set (`OPEN`, `CLOSED`, `CANCELLED`) | Open | Never free text |

The lesson of county names is that the name alone is not a key; the (state, county) pair or the FIPS code is. A rate matrix keyed on county name alone will merge Orange County, FL with Orange County, CA.

### The lookup table

A lookup has three columns at minimum: the raw variant, the canonical code, and where it came from or when it was added.

```text
variant                          code    added       note
TEXAS                            TX      2025-01-10  initial
TX.                              TX      2025-02-03  export from system B
TEX                              TX      2025-04-22  agent keying
STEWART TITLE GUARANTY CO        STG     2025-01-10  initial
STEWART TITLE GUARANTY COMPANY   STG     2025-01-10  initial
STEWART                          STG     2025-03-15  rate sheet header
```

The variant column is stored **normalised** (trimmed, upper-cased, punctuation removed), and incoming values are normalised the same way before lookup. Never store `" tx"` as a variant; store the normalised form and normalise the input.

### Applying lookups

Excel: `=XLOOKUP(TRIM(UPPER(A2)), lookup!A:A, lookup!B:B, "UNMAPPED")` (Microsoft 365) or `=IFERROR(VLOOKUP(TRIM(UPPER(A2)), lookup!A:B, 2, FALSE), "UNMAPPED")`. The fourth argument `FALSE` (exact match) is mandatory; approximate match silently returns the wrong neighbour.

Power Query: Merge Queries (Left Outer) on the normalised column, expand the code, then replace null with `"UNMAPPED"`. Keep the lookup as its own query loaded from a maintained table.

Python:

```python
import pandas as pd
lookup = pd.read_csv("lookup_underwriters.csv")                # variant, code
norm = lambda s: " ".join(str(s).upper().replace(".", "").replace(",", "").split())
df["uw_norm"] = df["underwriter"].map(norm)
mapping = dict(zip(lookup["variant"].map(norm), lookup["code"]))
df["uw_code"] = df["uw_norm"].map(mapping).fillna("UNMAPPED")
unmapped = df.loc[df["uw_code"] == "UNMAPPED", "uw_norm"].value_counts()
```

SQL: a `LEFT JOIN lookup ON UPPER(TRIM(p.underwriter)) = lookup.variant`, with `COALESCE(lookup.code, 'UNMAPPED')`.

### The UNMAPPED loop

The most important output of standardisation is the list of values that did not map, with counts. Each week: run the lookup, list unmapped values, decide for each whether it is a new variant (add to the lookup), a new real entity (add to the master and the lookup) or an error (send back). The lookup grows and the unmapped list shrinks to zero within a few cycles. Never let `UNMAPPED` reach a report as a category; it is a to-do list.

### Hierarchies and derived attributes

Once codes are canonical, attributes follow from master tables: state → region, county → FIPS → rate zone, underwriter → parent group, agent → team → shift. Store these in master tables joined at report time, not typed into the data. When Harris County moves to a different rate zone, you change one row in the master, not 4 000 rows of history.

### Standardising units and formats

Codes are not the only thing to standardise: amounts in dollars not thousands, percentages as decimals (0.125) not `12.5`, dates in ISO, times in one time zone, phone numbers as digits, names as `LAST, FIRST`. Document the choice in the data dictionary (next chapters) and convert at import.

> **Warning:** `VLOOKUP` with `TRUE` or an omitted fourth argument does an approximate match on a sorted range and returns the nearest lower value. On an unsorted lookup it returns garbage without an error. It is the single most common silent lookup bug in reporting workbooks.

### Try It Yourself

```python
# Build and apply a normalised lookup, then produce the UNMAPPED to-do list.
def norm(s):
    s = " ".join(str(s).upper().replace(".", "").replace(",", "").replace("&", "AND").split())
    return s
lookup_raw = [
    ("Texas", "TX"), ("TX", "TX"), ("Tex.", "TX"), ("Florida", "FL"), ("FL", "FL"), ("California", "CA"), ("CA", "CA"),
    ("Stewart Title Guaranty Co.", "STG"), ("Stewart Title Guaranty Company", "STG"), ("Stewart", "STG"),
    ("First American Title Insurance Company", "FATIC"), ("First American", "FATIC"),
    ("Old Republic National Title Insurance Company", "ORNTIC"), ("Old Republic", "ORNTIC"),
    ("Fidelity National Title", "FNTIC"), ("Chicago Title", "CTIC"), ("WFG National Title", "WFG"),
]
lookup = {norm(v): c for v, c in lookup_raw}
incoming_states = [" tx", "Texas", "TX.", "florida", "Fl", "Calif", "CA", "TEX"]
incoming_uw = ["stewart title guaranty co", "STEWART", "First American Title Insurance Co.", "Old Republic Natl", "WFG National Title", "Chicago Title", "Fidelity National Title Ins Co", "Westcor"]
def apply(values):
    out, unmapped = [], {}
    for v in values:
        code = lookup.get(norm(v))
        if code is None:
            code = "UNMAPPED"; unmapped[norm(v)] = unmapped.get(norm(v), 0) + 1
        out.append((v, code))
    return out, unmapped
for label, values in (("states", incoming_states), ("underwriters", incoming_uw)):
    mapped, unmapped = apply(values)
    print(label)
    for v, c in mapped:
        print(f"  {v!r:42} -> {c}")
    print("  UNMAPPED to review:", unmapped, "\n")
# county key: name alone is ambiguous
counties = [("FL", "ORANGE", "12095"), ("CA", "ORANGE", "06059"), ("TX", "ORANGE", "48361")]
print("Orange County by name only ->", len({c[1] for c in counties}), "key;  by (state, county) ->", len({(c[0], c[1]) for c in counties}), "keys; FIPS:", [c[2] for c in counties])
```

### Quiz

1. Why is county name alone a bad key?
- [x] The same county name exists in several states
- [ ] County names are too long
- [ ] Counties change names every year
> Use (state, county) or the FIPS code.

2. A lookup table's variant column should store:
- [ ] The raw value exactly as received, including spaces
- [x] The normalised form, with incoming values normalised the same way
- [ ] Only the canonical code
> Normalising both sides makes the match deterministic.

3. `=VLOOKUP(A2, lookup!A:B, 2)` with the fourth argument omitted:
- [ ] Performs an exact match
- [x] Performs an approximate match and can silently return the wrong row
- [ ] Returns an error if not found
> Always pass `FALSE` (or use `XLOOKUP`, which defaults to exact match).

4. What should happen to values coded `UNMAPPED`?
- [ ] They appear as a category in the report
- [x] They are reviewed each cycle and added to the lookup or master, or sent back as errors
- [ ] They are deleted
> UNMAPPED is a work queue, never a reporting category.

### Exercises

1. **Excel** — Map `A2` (underwriter as typed) to a code using an exact-match lookup on sheet `uw` (A = variant, B = code), returning `UNMAPPED` if absent.
<details><summary>Solution</summary>

`=XLOOKUP(TRIM(UPPER(A2)), uw!$A:$A, uw!$B:$B, "UNMAPPED")` or `=IFERROR(VLOOKUP(TRIM(UPPER(A2)), uw!$A:$B, 2, FALSE), "UNMAPPED")`. The `uw` variants must already be upper-case and trimmed.

</details>

2. **Design the master** — List the columns of an underwriter master table that supports reporting by parent group and effective dates.
<details><summary>Solution</summary>

`uw_code` (key), `legal_name`, `display_name`, `parent_group`, `naic_number`, `active_from`, `active_to`, `notes`. Variants live in the separate lookup table keyed to `uw_code`.

</details>

3. **Process** — Describe the weekly loop that keeps the lookup complete.
<details><summary>Solution</summary>

Run the mapping; export the UNMAPPED values with counts; for each, decide variant / new entity / error; add rows to the lookup or master with the date and reason; re-run; confirm zero UNMAPPED before the report is published.

</details>

### Interview Questions

**Q: How do you standardise names that arrive differently from several sources?**
With a normalise-then-lookup pattern. I normalise every incoming value the same way, upper-case, trimmed, punctuation removed, legal suffixes stripped, and look it up in a maintained variant-to-code table; the code joins to a master table that holds the display name and attributes. Values that do not map are listed with counts and reviewed weekly; each decision is added to the lookup with a date, so the table grows and the unmapped list goes to zero. For six underwriters' rate sheets this meant a lookup of about 40 variants that stabilised after three weeks, and afterwards a new spelling was a one-row addition rather than a manual search through the matrix. Fuzzy matching helps propose candidates for review, but the reviewed table is what runs in production.

**Q: Why separate the code from the display name?**
Because codes are for joining and names are for reading, and they change at different rates. A legal name changes when a company merges, a display name changes when marketing rebrands, but the code stays, so history stays joined. Names also contain characters and lengths that make bad keys, and users will inevitably type them inconsistently. With a code, the report can show whatever name the audience wants by joining the master table at render time; with the name as key, every rename means rewriting history or breaking joins. The same logic applies to states, counties, products and people.

**Q: Tell me about a subtle lookup bug you have seen.**
The classic is `VLOOKUP` without the exact-match flag on an unsorted list, which returned the code of a neighbouring row for around 5% of underwriters and produced a rate comparison that was wrong in a way nobody noticed for two weeks, because the values were plausible. Others: a lookup keyed on a value with a trailing space that matched nothing, so every row fell to the `IFERROR` default and one whole category silently became "Other"; a county lookup keyed on name that merged Orange County, Florida with Orange County, California; and a lookup sheet where someone sorted only the variant column and not the code column. The common defence is exact matching on normalised keys, a count of defaults returned, and a reconciliation of category totals against the previous week.

**Q: How do you keep a lookup table from becoming a mess over years?**
Treat it as a governed asset: it has an owner, a change log with dates and reasons, and a review when the master changes. Store it in one place, a maintained sheet or table that every workbook and script reads, not copies inside each report. Keep variants normalised and unique so two variants cannot map to different codes; a validation check on the lookup itself enforces that. Retire variants that have not been seen in a year to keep it readable, and never encode logic in it that belongs in the master, such as region or rate zone. And version it: when a rate matrix from last year is questioned, I need the lookup as it was then, which a dated export or Git history provides.

## Reconciliation and tie-outs

A report is defensible when its numbers can be traced back to an independent source and the differences explained to the cent. That process is **reconciliation**, and the sign-off that "report total equals source total" is a **tie-out**. Accountants do it daily; analysts who do it stop getting the Monday-morning "why does your number not match ours?" email.

### What to reconcile against

| Report figure | Reconcile to | Why it can differ |
|---|---|---|
| File count | Source system count for the period | Duplicates, date filter, excluded statuses |
| Premium total | Billing / accounting ledger | Timing (booked vs closed), refunds, cancelled files |
| Files per state | Previous week + new − closed | Reassignments, late entries |
| QA accuracy | Audit system log | Missing audit results, re-audits |
| Rate matrix cell count | Number of counties × underwriters | Missing counties, extra zones |
| Dashboard total | The report it was built from | Refresh timing, filters left on |

Two independent paths to the same number is the standard: production log versus billing, matrix cells versus county master, your pivot versus the source system's own summary.

### The tie-out sheet

A tie-out is a short table: expected, actual, difference, and an explanation for every non-zero difference. The difference should be **zero or explained**, never "close enough".

```text
Item                       Source     Report    Diff   Explanation
Files closed, week 37       2,714      2,700     -14   14 test files (ID prefix TEST-) excluded by rule X02
Premium closed ($)     3,412,880  3,404,120  -8,760   2 refunds booked in billing, not in production log
Files TX                      968        968       0
Files FL                      721        721       0
Files CA                      411        411       0
Other states                  614        600     -14   test files, as above
```

The explanations are rules or documented events, and the reader can verify each. The sheet is part of the report package, not a private working.

### Finding the difference

When totals differ, do not stare at totals. Reconcile at a finer grain until the difference isolates:

1. Compare counts per state, per day, per status. The difference usually sits in one bucket.
2. Within that bucket, compare keys: which IDs are in the source but not the report (lost) and which are in the report but not the source (added)? A left anti join both ways, or Excel `COUNTIF` across the two lists.
3. For amount differences with matching keys, compare row by row: `source_amount − report_amount` and filter non-zero.

```python
src = {"TX-1": 1250, "TX-2": 980, "FL-1": 2100, "FL-2": 660, "TEST-9": 10}
rep = {"TX-1": 1250, "TX-2": 890, "FL-1": 2100, "CA-1": 400}
lost  = sorted(set(src) - set(rep))            # in source, not report
added = sorted(set(rep) - set(src))            # in report, not source
diffs = {k: rep[k] - src[k] for k in src.keys() & rep.keys() if rep[k] != src[k]}
```

### Timing differences

The biggest legitimate source of differences is timing: a file closed at 11:58 pm Friday in one system's time zone and Saturday in another; premium booked when invoiced versus when closed; a re-opened file counted in two weeks. Define the cut-off precisely in the report's definitions (the KPI chapter formalises this) and reconcile on the same cut-off. When a difference is timing, show it moving: −14 this week should appear as +14 next week.

### Roll-forward reconciliation

For stock-like quantities such as backlog: opening backlog + received − completed − cancelled = closing backlog. If the identity does not hold, something was miscounted; the size and sign of the gap tell you where. This is the single best check on a queue or WIP report, and a version of it applies to any balance: matrix cells last version + added − removed = cells this version.

### Excel mechanics

- Compare two lists: in list A, `=COUNTIF(B:B, A2)=0` flags IDs missing from B; repeat the other way.
- `=SUMIFS` per bucket on both sides and a difference column.
- Round consistently: reconcile on stored values, not displayed ones; `=ROUND(x, 2)` both sides if the source is cents.
- Freeze the source extract as values with a timestamp; a live query that refreshes will never reconcile twice.

> **Interview note:** "How do you know your report is right?" The strong answer names the independent source, the grain at which you tie out, the tolerance (zero), and what you do with explained differences. "I double-check it" is the weak answer.

### Try It Yourself

```python
from collections import defaultdict
source = [  # system of record: (file_id, state, premium)
    ("TX-1", "TX", 1250), ("TX-2", "TX", 980), ("TX-3", "TX", 1400), ("FL-1", "FL", 2100),
    ("FL-2", "FL", 660), ("CA-1", "CA", 400), ("TEST-9", "TX", 10), ("FL-3", "FL", 900),
]
report = [  # what the report used
    ("TX-1", "TX", 1250), ("TX-2", "TX", 890), ("TX-3", "TX", 1400), ("FL-1", "FL", 2100),
    ("FL-2", "FL", 660), ("CA-1", "CA", 400), ("CA-1", "CA", 400), ("FL-3", "FL", 900),
]
excluded_by_rule = {"TEST-9": "X02 test file"}
def by_state(rows):
    d = defaultdict(lambda: [0, 0])
    for _, st, p in rows:
        d[st][0] += 1; d[st][1] += p
    return d
s, r = by_state(source), by_state(report)
print(f"{'state':6}{'src_n':>6}{'rep_n':>6}{'diff':>6}{'src_$':>9}{'rep_$':>9}{'diff_$':>8}")
for st in sorted(set(s) | set(r)):
    print(f"{st:6}{s[st][0]:6}{r[st][0]:6}{r[st][0]-s[st][0]:6}{s[st][1]:9}{r[st][1]:9}{r[st][1]-s[st][1]:8}")
src_ids = [x[0] for x in source]; rep_ids = [x[0] for x in report]
lost = [i for i in src_ids if i not in rep_ids]
added = [i for i in rep_ids if i not in src_ids]
dup_in_report = sorted({i for i in rep_ids if rep_ids.count(i) > 1})
amount_diffs = {a[0]: b[2] - a[2] for a in source for b in report if a[0] == b[0] and a[2] != b[2]}
print("\nLost from report:", [(i, excluded_by_rule.get(i, "UNEXPLAINED")) for i in lost])
print("Added in report :", added or "none")
print("Duplicated in report:", dup_in_report)
print("Amount differences  :", amount_diffs)
unexplained = [i for i in lost if i not in excluded_by_rule] + added + dup_in_report + list(amount_diffs)
print("\nTie-out:", "PASS" if not unexplained else f"FAIL - unexplained items {unexplained}")
```

### Quiz

1. A tie-out difference is acceptable when it is:
- [ ] Less than 1%
- [x] Zero, or fully explained by a documented rule or event
- [ ] Smaller than last week's
> "Close enough" is not a reconciliation.

2. The fastest way to locate a total difference is to:
- [ ] Recompute the total
- [x] Break both sides into buckets (state, day, status) and compare each
- [ ] Sort the sheet
> Differences isolate at a finer grain.

3. Opening backlog 120, received 300, completed 280, cancelled 10, closing backlog reported 135. What is wrong?
- [x] The identity gives 130, so 5 items are miscounted somewhere
- [ ] Nothing; 135 is close to 130
- [ ] Received should be 305
> Roll-forward reconciliation: 120 + 300 − 280 − 10 = 130.

4. Why freeze the source extract as values with a timestamp?
- [ ] To reduce file size
- [x] So the reconciliation can be reproduced later against the same snapshot
- [ ] Because live queries are slow
> A live source changes; a frozen snapshot is evidence.

### Exercises

1. **Excel** — In sheet `src` (IDs in column A) flag IDs that do not appear in sheet `rep` column A.
<details><summary>Solution</summary>

In `src!B2`: `=IF(COUNTIF(rep!$A:$A, A2)=0, "MISSING FROM REPORT", "")`. Repeat in `rep` against `src` for added IDs.

</details>

2. **Explain the difference** — Premium total is $8 760 lower in the report than in billing; file counts match exactly. Where do you look?
<details><summary>Solution</summary>

Row-level amount comparison on matching keys: filter rows where report premium ≠ billing premium. With matching counts, the cause is amount differences (refunds, endorsements booked later, a rounding or unit issue on a few files), not lost rows.

</details>

3. **Design** — Write the roll-forward identity for a rate matrix version.
<details><summary>Solution</summary>

Cells(previous version) + cells added (new counties or underwriters) − cells removed (retired) = cells(current version); plus a separate count of cells whose rate changed, listed by key.

</details>

### Interview Questions

**Q: How do you make sure a weekly report matches the source system?**
By reconciling at three levels before distribution. File-level: the count and a key amount tie to the source's control totals, with any difference explained by a written exclusion rule such as test files. Bucket-level: counts per state, per day and per status match, which localises any gap. Key-level: an anti-join both ways lists IDs present on one side only, and a row comparison lists amount differences. The results go on a tie-out sheet in the report package with expected, actual, difference and explanation. On the Stewart weekly report this was automated as a Power Query step and a Checks sheet, so a mismatch showed up as a red cell before anyone read the numbers, and the explanations were mostly timing items that reversed the following week.

**Q: The report total and the source total differ by a small amount every week. What do you do?**
Find the cause once rather than tolerate it forever. Small persistent differences are usually a rule mismatch: the source includes cancelled files and the report excludes them, or the cut-off is midnight in different time zones, or refunds are netted on one side. I reconcile at the row level for one week, identify the exact rows, and then either align the definitions or document the difference as an expected, rule-based adjustment on the tie-out sheet with its own line. A difference that is explained and stable is fine; an unexplained one, however small, is a warning that something else could be wrong and I would not sign off on it.

**Q: What is a roll-forward and when do you use it?**
A roll-forward is an identity between an opening balance, the flows during a period and the closing balance: opening backlog plus received minus completed minus cancelled equals closing backlog. It applies to any stock: work in progress, open files, matrix cells, headcount. It is the strongest check on a queue report because it uses four independently counted numbers and any miscount breaks the identity. When it fails, the size and sign of the gap points to the cause: a positive gap of exactly the number of re-opened files means re-opens were completed twice; a negative gap suggests items cancelled without being logged. I put the roll-forward at the top of every backlog report.

**Q: Why is reconciliation part of the analyst's job and not just accounting's?**
Because the analyst is the one who will be asked to explain the number, and "the query said so" is not an explanation. Reconciliation is how I know my joins did not duplicate rows, my filters did not drop a state, my date cut-off matches the business's, and my lookups did not default a category to "Other". It is also cheap: once built, the tie-out runs with the report. And it protects the relationship with the client: a report that arrives with its own tie-out sheet says "this has been tested", which is the difference between being trusted and being checked.

## Building a data matrix: schema design and 21-column schemas

Once the data are clean you need somewhere to put them. A **data matrix** is a rectangular table with a fixed, documented set of columns, one row per unit at a defined grain, that every report and dashboard reads from. Designing its **schema**, the list of columns, their types, keys and rules, is the step that decides whether the next six months of reporting are easy or painful. This chapter uses a 21-column production-file schema as the worked example.

### Principles of a good schema

- **One grain per table.** A file table has one row per file; a task table has one row per task. Never mix.
- **A declared primary key**, unique and never null.
- **Atomic columns.** `city, state, zip` in three columns, not one address string. `first_name, last_name`, not `name`.
- **Codes, not names**, for anything joined to a master (state, county FIPS, underwriter, agent ID).
- **Explicit types and units** in the column name or dictionary: `premium_usd`, `turnaround_hours`, `pages`.
- **No calculated columns that depend on report logic** (no "week" column computed from a cut-off that might change; derive it at report time), except for stable derivations documented as such.
- **Audit columns**: `source_system`, `loaded_at`, `source_file`, `row_hash` or version.
- **Tidy layout**: long, not wide. Six underwriters' rates are six rows with an `underwriter` column, not six columns.

### The 21-column production schema

```text
#   column               type      key/rule                                   example
1   file_id              text      PK, ^[A-Z]{2}-\d{6}$                       TX-100231
2   state                text(2)   FK ref_states                              TX
3   county_fips          text(5)   FK ref_counties                            48201
4   county_name          text      derived from FIPS at load                  Harris
5   underwriter_code     text      FK ref_underwriters                        STG
6   file_type            text      {RES, COM, REFI}                           RES
7   transaction_type     text      {PURCHASE, REFINANCE, CONSTRUCTION}        PURCHASE
8   status               text      {OPEN, CLOSED, CANCELLED}                  CLOSED
9   open_date            date      not null                                   2026-03-02
10  close_date           date      >= open_date when status = CLOSED          2026-03-04
11  turnaround_hours     decimal   derived: close - open, business hours      18.5
12  pages                integer   > 0, < 2000                                42
13  coverage_amount_usd  decimal   > 0                                        350000.00
14  premium_usd          decimal   > 0, < 500000                              1250.00
15  endorsements_count   integer   >= 0                                       2
16  agent_id             text      FK roster                                  A0417
17  qa_checked           boolean                                              TRUE
18  qa_defects           integer   null unless qa_checked; <= items checked   0
19  client_code          text      FK ref_clients                             LNDR-023
20  source_system        text      {SYS_A, SYS_B, MANUAL}                     SYS_A
21  loaded_at            datetime  set by pipeline                            2026-03-09 06:15
```

Every column has a type, a rule and an example, which is exactly the content of the data dictionary (next chapter). The order groups identity, geography, parties, dates, measures, QA and audit, which helps readers.

### Keys and relationships

The **primary key** is `file_id`. **Foreign keys** point to master tables: states, counties, underwriters, clients, agents. Each master has its own schema (code, name, attributes, active dates). This is a small star schema: the production table is the fact table, masters are dimensions. Power BI, pivot tables and SQL all work best on this shape.

For entities observed repeatedly, such as rates by county by underwriter by effective date, the key is composite: `(state, county_fips, underwriter_code, effective_date)`. A **rate matrix** in the Advanced level is exactly this table, pivoted for display.

### Wide versus long

The comparison table management wants to see (counties down, underwriters across) is a **presentation**, produced by pivoting. The stored matrix is long: one row per county-underwriter-rate. Long tables accept a seventh underwriter without a schema change, filter and aggregate cleanly, and do not need 21 × 6 columns. Excel: build long in Power Query, pivot with a PivotTable. Pandas: `df.pivot_table(index=["state", "county_name"], columns="underwriter_code", values="rate")`.

### Types in each tool

| Concept | Excel | Power Query | SQL (SQLite / SQL Server) | pandas |
|---|---|---|---|---|
| Text code | Text (leading apostrophe or Text format) | Text | TEXT / VARCHAR(5) | object or string |
| Integer | Number, 0 decimals | Whole Number | INTEGER / INT | int64 |
| Money | Number, 2 decimals | Fixed decimal number | NUMERIC(12,2) / DECIMAL(12,2) | float64 or Decimal |
| Date | Date (serial) | Date | TEXT ISO / DATE | datetime64 |
| Boolean | TRUE/FALSE | True/False | INTEGER 0/1 / BIT | bool |

Store money as fixed decimals where you can; floating point gives 0.1 + 0.2 = 0.30000000000000004 and cents that do not tie out.

### Evolving the schema

Schemas change. Adding a column is safe if it is nullable and appended; renaming or retyping breaks every consumer. Keep a **schema version** and a change log; when a column is added, record when it started being populated so reports do not compare a fully populated month against a half-populated one.

> **Tip:** Write the schema before you receive the data. Send it to the data owner as the required export layout. Half of cleaning disappears when the export is built to your schema instead of the other way round.

### Try It Yourself

```python
import re
from datetime import date, datetime
# A schema as data: validate rows against it, then pivot a long rate table for display.
schema = [
    ("file_id", "text", lambda v: bool(re.fullmatch(r"[A-Z]{2}-\d{6}", v))),
    ("state", "text", lambda v: v in {"TX", "FL", "CA"}),
    ("county_fips", "text", lambda v: bool(re.fullmatch(r"\d{5}", v))),
    ("underwriter_code", "text", lambda v: v in {"STG", "FATIC", "ORNTIC", "FNTIC", "CTIC", "WFG"}),
    ("status", "text", lambda v: v in {"OPEN", "CLOSED", "CANCELLED"}),
    ("open_date", "date", lambda v: isinstance(v, date)),
    ("close_date", "date", lambda v: v is None or isinstance(v, date)),
    ("pages", "int", lambda v: isinstance(v, int) and 0 < v < 2000),
    ("premium_usd", "decimal", lambda v: isinstance(v, (int, float)) and 0 < v < 500000),
]
rows = [
    {"file_id": "TX-100231", "state": "TX", "county_fips": "48201", "underwriter_code": "STG", "status": "CLOSED",
     "open_date": date(2026, 3, 2), "close_date": date(2026, 3, 4), "pages": 42, "premium_usd": 1250.00},
    {"file_id": "FL-2001", "state": "FL", "county_fips": "12086", "underwriter_code": "FATIC", "status": "CLOSED",
     "open_date": date(2026, 3, 3), "close_date": date(2026, 3, 2), "pages": 18, "premium_usd": "980"},
]
for r in rows:
    problems = [c for c, _, ok in schema if not ok(r.get(c))]
    if r.get("status") == "CLOSED" and r.get("close_date") and r["close_date"] < r["open_date"]:
        problems.append("close_date < open_date")
    print(r["file_id"], "OK" if not problems else "FAIL: " + ", ".join(problems))

# Long storage -> wide presentation
long_rates = [
    ("TX", "Harris", "STG", 5.75), ("TX", "Harris", "FATIC", 5.90), ("TX", "Harris", "ORNTIC", 5.60),
    ("TX", "Dallas", "STG", 5.75), ("TX", "Dallas", "FATIC", 5.85), ("TX", "Dallas", "ORNTIC", 5.60),
    ("FL", "Orange", "STG", 5.75), ("FL", "Orange", "FATIC", 5.75),
]
uws = sorted({u for _, _, u, _ in long_rates})
counties = sorted({(s, c) for s, c, _, _ in long_rates})
print("\n" + f"{'state':6}{'county':8}" + "".join(f"{u:>8}" for u in uws))
for s, c in counties:
    cells = {u: r for ss, cc, u, r in long_rates if (ss, cc) == (s, c)}
    print(f"{s:6}{c:8}" + "".join(f"{cells.get(u, '-'):>8}" for u in uws))
print("\nlong rows:", len(long_rates), "-> wide cells:", len(counties) * len(uws), "(missing shown as '-')")
```

### Quiz

1. The grain of a table is:
- [x] What one row represents
- [ ] The number of columns
- [ ] The file size
> Every schema decision follows from the grain.

2. Rates for six underwriters should be stored as:
- [ ] Six columns, one per underwriter
- [x] One row per county-underwriter with an `underwriter_code` column
- [ ] Six separate tables
> Long storage scales and pivots; wide storage breaks on the seventh underwriter.

3. Money should be stored as:
- [ ] Floating point
- [x] Fixed decimal (e.g. NUMERIC(12,2))
- [ ] Text with a $ sign
> Floating point produces cents that do not add up exactly.

4. Which schema change is backward compatible?
- [x] Appending a nullable column
- [ ] Renaming `premium` to `premium_usd`
- [ ] Changing `pages` from integer to text
> Consumers keep working when columns are only added.

### Exercises

1. **Design** — Write a 10-column schema for a QA audit table at the grain "one row per audited file per audit".
<details><summary>Solution</summary>

`audit_id` (PK), `file_id` (FK production), `audit_date`, `checker_id` (FK roster), `checklist_version`, `items_checked` (int > 0), `defects` (int, ≤ items_checked), `defect_categories` (text, delimited codes or separate child table), `result` ({PASS, FAIL}), `loaded_at`. A file audited twice gives two rows, which is why `audit_id`, not `file_id`, is the key.

</details>

2. **Fix the grain** — A sheet has one row per file with columns `defect_1, defect_2, defect_3`. What is wrong and how do you restructure?
<details><summary>Solution</summary>

Repeating groups break the atomic-column rule and cap defects at three. Unpivot into a child table `file_defects(file_id, seq, defect_code)` with one row per defect; Power Query → Unpivot Columns does it in one step.

</details>

3. **pandas** — Pivot a long rate table `df(state, county, underwriter, rate)` into counties down, underwriters across.
<details><summary>Solution</summary>

```python
wide = df.pivot_table(index=["state", "county"], columns="underwriter", values="rate", aggfunc="first")
```

Use `aggfunc="first"` after confirming the key is unique; if it is not, `pivot_table` would silently average duplicates.

</details>

### Interview Questions

**Q: How would you design the table behind a weekly production report?**
I would start from the grain, one row per file, and a primary key that the source system guarantees. Then identity and classification columns as codes with foreign keys to master tables for state, county, underwriter, client and agent; date columns as true dates with the business rule for each; measures with units in the name such as premium_usd and turnaround_hours; QA columns; and audit columns recording the source system, source file and load time. About twenty columns, each with a type, rule and example in a data dictionary. Anything that depends on report logic, like the reporting week, is derived at report time from the dates and the documented cut-off. Masters live in their own tables so a county's rate zone or an underwriter's name can change without touching history.

**Q: Why long format rather than a wide comparison table, when the client wants the wide view?**
Because the wide view is a presentation of the data, not the data. A long table with one row per county-underwriter-rate has a clear key, validates cleanly, accepts new underwriters or new attributes without a schema change, and pivots into any layout in seconds with a PivotTable or pandas. A wide table has the underwriter names baked into column headers, so adding one means editing every formula, and a missing cell is indistinguishable from a blank. I build long, validate long, store long, and deliver the wide matrix as an output that is regenerated from it. The client never sees the difference, but the analyst who inherits the file will.

**Q: What are audit columns and why do you insist on them?**
Columns that record where and when each row came from: source system, source file name, load timestamp, and often a row hash or version number. They cost nothing and they answer the questions that come up later: which export introduced the bad rows, whether a value changed between loads, and which rows are affected when a source is found to be wrong. When a client asked why a county's figures changed between two versions of a matrix, the load timestamp and source file columns let me show that the change came from the underwriter's revised rate sheet dated the 14th, not from an error. Without them I would have been guessing.

**Q: How do you handle a schema change requested mid-year?**
Additively where possible: a new nullable column, populated from the date the source provides it, with the start date recorded in the dictionary and a note on reports that compare periods across that date. If a column must change meaning or type, I add a new column with a new name and keep the old one until every consumer has moved, then retire it with a version bump; I never silently change what an existing column means, because every historical report would become unreproducible. Each change is a row in the schema change log with the reason, the date and who approved it. This is boring discipline, but it is why a report from last February can still be re-run today.

## Documenting data issues and a data dictionary

Two documents separate a professional reporting operation from a pile of spreadsheets: the **data dictionary**, which defines every column, and the **data issues log**, which records every problem found, its impact and its resolution. Both are short, both are living, and both are what you hand over when you go on leave, change roles, or are asked "how is this number defined?".

### The data dictionary

One row per column of every table you publish or depend on:

| Field | Content |
|---|---|
| Table, column | `production.premium_usd` |
| Type and format | decimal(12,2), USD, no tax |
| Definition | Total title premium invoiced for the file, including endorsements, excluding escrow fees |
| Source | SYS_A `POLICY.PREM_AMT`, loaded nightly |
| Allowed values / range | > 0 and < 500 000; null only when status = OPEN |
| Derivation | none (raw) or `close_ts − open_ts` in business hours, Mon–Fri 8–6 CT |
| Owner | Production reporting (A. Raza) |
| Used in | Weekly status report §2, Premium dashboard |
| Since / changes | Populated from 2025-01; endorsements included from 2025-07 (change log #12) |

The definition column is where arguments get settled. "Turnaround" means nothing until it says business hours, the time zone, and whether re-opened files restart the clock. Write the definition so that two analysts implementing it independently get the same number.

Keep it where people will find it: a `Dictionary` sheet in the report workbook, a page in the team wiki, or a `README` beside the pipeline code. Generate the skeleton automatically (column names and types from the schema) and fill the definitions by hand.

### The data issues log

One row per issue, from discovery to closure:

```text
id   found       table.column          issue                                  rows   impact                     severity  status   owner    resolution                                   closed
D031 2026-03-09  production.state      trailing space in 340 rows from SYS_B  340    TX split into two states   high      closed   AR       trim rule C02 added; SYS_B export fixed 03-12  2026-03-12
D032 2026-03-09  production.premium    0 used for unpriced files              212    avg premium understated    medium    open     SYS_B    rule C07 maps 0 + status OPEN to null; owner to fix export
D033 2026-03-16  rates.county_name     "Miami Dade" vs "Miami-Dade" in FATIC  67     matrix join failed         high      closed   AR       lookup L014 added
D034 2026-03-16  qa.audit_result       28% missing in week 11                 560    accuracy coverage 72%      high      open     QA lead  audit backlog; coverage shown on report
```

Columns that matter: the row count affected (quantifies), the impact on which report figure (translates to business), a severity, an owner, and the resolution as a rule ID or upstream fix. Issues found by validation rules should log automatically; issues found by people are entered by hand.

### Why the log matters

- **It stops re-discovery.** Without a log, next month's analyst re-finds the same trailing-space problem.
- **It proves diligence.** When a number is challenged, the log shows what was known and handled.
- **It drives upstream fixes.** A count of "212 rows per week for eight weeks" is what persuades a system owner to fix an export.
- **It measures data quality over time.** Open issues, new issues per week and mean time to close are themselves KPIs for the data function.

### Report definitions

Alongside the dictionary, every report needs a **definitions block**: period and cut-off, inclusion and exclusion rules, KPI formulas with numerator and denominator, and the version of the lookups and masters used. Put it on the last page of every report. When a reader asks "does this include cancelled files?", the answer is on the page, not in your head.

### Change log

Every change to a rule, a definition, a lookup or a schema gets an entry: date, what changed, why, who approved, and which reports are affected from which period. Number the entries and cite them in the dictionary. A definition change without a change-log entry is how a KPI "improves" mysteriously.

### Tooling

A plain sheet works. So does a Markdown file in the pipeline's Git repository, which gives history for free. For larger teams, data-catalog tools (Microsoft Purview, Collibra, open-source DataHub or OpenMetadata) store dictionaries and lineage, but the discipline matters more than the tool. Automate what you can: a script that reads the schema and writes the dictionary skeleton, a validation step that appends failures to the issues log.

> **Warning:** A dictionary that is not maintained is worse than none, because readers trust it. Tie updates to the change process: no rule or column changes without a dictionary and change-log edit in the same commit or the same email.

### Try It Yourself

```python
# Generate a dictionary skeleton from a schema, and an issues log from validation failures.
from datetime import date
schema = {
    "file_id": ("text", "Primary key, format AA-nnnnnn", "SYS_A FILE.ID"),
    "state": ("text(2)", "USPS state code of the property", "SYS_A FILE.ST"),
    "premium_usd": ("decimal(12,2)", "Title premium invoiced incl. endorsements, excl. escrow fees", "SYS_A POLICY.PREM_AMT"),
    "turnaround_hours": ("decimal", "close_ts - open_ts in business hours (Mon-Fri 8-18 CT)", "derived"),
}
print(f"{'column':18}{'type':16}{'definition':62}{'source'}")
for col, (typ, definition, source) in schema.items():
    print(f"{col:18}{typ:16}{definition:62}{source}")

issues = []
def log_issue(column, issue, rows, impact, severity):
    issues.append({"id": f"D{len(issues)+31:03d}", "found": date(2026, 3, 9), "column": column, "issue": issue,
                   "rows": rows, "impact": impact, "severity": severity, "status": "open", "resolution": ""})

# Pretend these came from this week's validation run
log_issue("state", "trailing space from SYS_B export", 340, "TX split into two states in pivot", "high")
log_issue("premium_usd", "0 used for unpriced files", 212, "average premium understated ~8%", "medium")
log_issue("qa.audit_result", "28% missing", 560, "accuracy coverage 72%", "high")
# Resolve one
issues[0].update(status="closed", resolution="trim rule C02; SYS_B export fixed 2026-03-12")

print("\nIssues log")
for i in issues:
    print(f"{i['id']} {i['found']} {i['column']:16} {i['issue']:36} rows={i['rows']:<4} {i['severity']:6} {i['status']:6} {i['resolution']}")
open_by_sev = {}
for i in issues:
    if i["status"] == "open":
        open_by_sev[i["severity"]] = open_by_sev.get(i["severity"], 0) + 1
print("\nOpen issues by severity:", open_by_sev, "| rows affected by open issues:", sum(i["rows"] for i in issues if i["status"] == "open"))
```

### Quiz

1. The most important field in a data dictionary entry is:
- [ ] The column's position in the table
- [x] A definition precise enough that two people would compute the same number
- [ ] The Excel number format
> Definitions settle arguments; formats are cosmetic.

2. An issues log entry should always include:
- [x] Rows affected, impact on which report figure, owner and resolution
- [ ] A screenshot
- [ ] The analyst's opinion of the source system
> Quantified impact and ownership are what make the log actionable.

3. A KPI definition changes in week 20. Where must that be recorded?
- [ ] Nowhere; the new definition replaces the old
- [x] In the change log with date and reason, cited in the dictionary and noted on reports comparing across week 20
- [ ] Only in an email
> Undocumented definition changes make trends meaningless.

4. Where should the report's definitions block live?
- [ ] In the analyst's notes
- [x] On the report itself, typically the last page
- [ ] In a separate system nobody opens
> Readers must be able to answer "does this include X?" from the report.

### Exercises

1. **Write a definition** — Define "accuracy rate" for a QA report precisely enough to implement.
<details><summary>Solution</summary>

"Accuracy rate = files with zero defects ÷ files with a completed audit in the period, expressed as a percentage to one decimal. Period = audit_date within the reporting week (Mon 00:00 to Sun 23:59 CT). Excludes files with audit_result null (reported separately as coverage). A file audited twice counts once, using the latest audit."

</details>

2. **Log an issue** — Write the issues-log row for: 67 FATIC rate rows failed to join because "Miami Dade" lacks the hyphen.
<details><summary>Solution</summary>

`D033 | 2026-03-16 | rates.county_name | "Miami Dade" vs master "Miami-Dade" in FATIC sheet | 67 rows | FATIC column blank for Miami-Dade in matrix | high | closed | AR | lookup L014 maps variant; FATIC asked to use FIPS | 2026-03-16`

</details>

3. **Data-quality KPIs** — Propose three metrics computed from the issues log.
<details><summary>Solution</summary>

Open issues by severity (weekly); new issues found per week (trend); mean days to close by severity; and optionally rows affected by open issues as a share of total rows.

</details>

### Interview Questions

**Q: What documentation do you keep for a recurring report?**
Four artefacts. A data dictionary with every column's type, definition, source, allowed values and owner. A definitions block on the report itself: period, cut-off, inclusions, exclusions and each KPI's numerator and denominator. An issues log with every data problem found, rows affected, impact, owner and resolution. And a change log for rules, definitions, lookups and schema, cited from the other documents. I keep them in the same workbook or repository as the report so they cannot drift, and I generate what I can from the schema and the validation output. When a stakeholder questioned a turnaround figure, the definition block answered in one line that business hours were used, and the change log showed when that had been agreed.

**Q: How do you get a team to actually maintain a data dictionary?**
By making it part of the change, not a separate task. No new column, rule or lookup is accepted without its dictionary entry, enforced by review of the same change; the skeleton is generated from the schema so the effort is writing one sentence, not building a document. I make it useful to the maintainers themselves: the dictionary is where the report definitions live, so analysts consult it to answer questions rather than asking each other, and that habit sustains it. And I keep it small: one row per column, one sentence per definition, no essays. A dictionary that takes an hour to update will not be updated.

**Q: Describe an issues log entry that led to an upstream fix.**
An export from a secondary system wrote 0 for unpriced files, which cut the average premium by about 8% every week. Cleaning could map it to null, and did, but the log recorded 212 rows a week for eight weeks with a quantified impact on the premium KPI and the owner as the system team. That running count, with the impact expressed in the metric management cared about, is what got the export changed to emit a null, and the log entry closed with the fix date. The cleaning rule stayed in place as a guard, and the weekly count of rows it touched went to zero, which confirmed the fix. A log entry with a number and an impact is a business case; one that says "premiums look wrong" is a complaint.

**Q: What is the difference between a data dictionary and a data catalog, and when do you need the latter?**
A dictionary documents the columns of the tables you own: definitions, types, rules, sources. A catalog is an organisation-wide inventory of datasets with ownership, lineage, sensitivity and search, typically a tool such as Purview or DataHub, and it usually contains dictionaries as one of its components. A single analyst or small team needs the dictionary and disciplined change logging; a catalog becomes worth its cost when many teams share data and the question shifts from "what does this column mean" to "which datasets exist, who owns them, and what breaks if this one changes". Even then, the catalog is only as good as the dictionaries feeding it.

# LEVEL: Advanced

## Rate matrices and zone harmonisation: six underwriters in one comparable table

A title-insurance **rate matrix** answers one question for an agent or lender: for a policy of this amount, in this county, what does each underwriter charge? Each underwriter publishes its own rate manual with its own structure: some price by county, some by **zone** (groups of counties), some by state with county surcharges, some by tiers of coverage amount with different breakpoints. Building one table that compares six of them fairly is a data-integration problem, and **zone harmonisation** is the heart of it.

### What a rate manual looks like

| Underwriter | Structure | Example |
|---|---|---|
| A | Per $1 000 of coverage, statewide, tiered: up to $100k $5.75; next $400k $4.50; above $500k $3.50 | Owner's policy $350k = 100×5.75 + 250×4.50 = $1 700 |
| B | Zone 1 / Zone 2 / Zone 3, counties listed per zone, tiered rate per zone | Harris in Zone 1: $5.90 per $1 000 first $100k |
| C | Flat minimum $250 plus per-$1 000 rate by county group | Dallas group: $4.95 |
| D | Promulgated (state-set) rate, same for all underwriters in TX | Texas basic rate table by amount |
| E | Statewide rate with county surcharge percentages | Base $5.60 + 3% in coastal counties |
| F | Lookup table by amount bracket, one column per region | $300 001–$350 000: $1 690 (Region North) |

Some states, such as Texas and Florida, promulgate rates, so every underwriter charges the same base and differences arise in endorsements and simultaneous-issue discounts; other states are file-and-use, with real differences. The matrix must handle both.

### The harmonised schema

Store everything long, at the finest grain any underwriter uses:

```text
rate_cells(state, county_fips, underwriter_code, policy_type, tier_from, tier_to, rate_per_1000, flat_min, surcharge_pct, effective_date, source_doc, source_page)
```

- `policy_type`: OWNER, LOAN, SIMULTANEOUS.
- Tiers: a row per bracket. A statewide flat rate becomes one row per county (exploded), so every underwriter has the same grain.
- `surcharge_pct` and `flat_min` capture structures that are not pure per-$1 000 rates.
- `source_doc, source_page`: the rate manual and page, so every cell is traceable.

### Zone harmonisation

Underwriter B's "Zone 1" and underwriter F's "Region North" are not the same counties. Harmonisation means mapping every underwriter's zone to the county level:

1. Build a **zone master** per underwriter: `(underwriter_code, zone_name, county_fips)`, one row per county in the zone, from the manual's county list. Counties not listed go to the manual's default zone if it defines one, otherwise to a gap list.
2. Join rates by zone to the zone master to produce county-level rows.
3. Validate: every county in the state appears exactly once per underwriter per policy type per tier. Missing counties are gaps to chase; duplicates are zone-list errors in the manual (they exist).
4. Record county name variants in the county lookup ("Miami Dade", "Miami-Dade", "Dade").

The result is a table where each county has, for each underwriter, a complete tier structure, whatever the manual's original shape.

### Computing a comparable premium

Rates per $1 000 with different tier breakpoints cannot be compared as rates. Compare **premiums at benchmark amounts**: compute the premium for, say, $150k, $250k, $350k, $500k and $1M in every county for every underwriter, applying tiers, minimums and surcharges.

```python
def premium(tiers, amount, flat_min=0.0, surcharge_pct=0.0):
    total, prev = 0.0, 0.0
    for tier_to, rate in tiers:               # tiers: [(upper_bound, rate_per_1000), ...], last bound may be None
        upper = amount if tier_to is None else min(amount, tier_to)
        if upper > prev:
            total += (upper - prev) / 1000 * rate
            prev = upper
        if tier_to is not None and amount <= tier_to:
            break
    total = max(total, flat_min)
    return round(total * (1 + surcharge_pct), 2)
```

Round only at the end, to the cent, and check a sample of cells against the manual's own examples (most manuals include worked examples; use them as test cases).

### Presenting the matrix

The presentation table is a pivot: counties down, underwriters across, one sheet per benchmark amount and policy type, with the lowest premium per row highlighted and the spread (max − min) as a column. In Excel: a PivotTable from the long table, conditional formatting for the row minimum (`=B2=MIN($B2:$G2)`), and a slicer for amount and policy type. Add a `Gaps` sheet listing counties with fewer than six underwriters and a `Sources` sheet with document, version and effective date per underwriter.

### Versioning

Rate manuals change. Never overwrite: each load carries an `effective_date` and a `loaded_at`, and the matrix for a date is the set of rows effective on that date. The change report between two versions (cells added, removed, changed with old and new value) is the deliverable a reviewer needs, and it is a simple anti-join and value comparison on the long table.

> **Interview note:** The question "how would you combine six rate sheets into one?" is testing whether you go to county grain, whether you compare premiums rather than rates, and whether you keep every cell traceable to a source page. Say those three things first.

### Try It Yourself

```python
# Harmonise three underwriters with different structures to county level and compare premiums at benchmark amounts.
counties = {"48201": "Harris", "48113": "Dallas", "48029": "Bexar", "48453": "Travis"}
# Underwriter A: statewide tiers.  B: zones with tiers.  C: county-group flat rate with minimum, coastal surcharge.
A = {"tiers": [(100000, 5.75), (500000, 4.50), (None, 3.50)]}
B = {"zones": {"Zone 1": ["48201", "48113"], "Zone 2": ["48029", "48453"]},
     "tiers": {"Zone 1": [(100000, 5.90), (None, 4.25)], "Zone 2": [(100000, 5.50), (None, 4.10)]}}
C = {"groups": {"Metro": ["48201", "48113", "48453"]}, "rate": {"Metro": 4.95, "DEFAULT": 5.20},
     "flat_min": 250.0, "surcharge": {"48201": 0.03}}
def premium(tiers, amount, flat_min=0.0, surcharge_pct=0.0):
    total, prev = 0.0, 0.0
    for tier_to, rate in tiers:
        upper = amount if tier_to is None else min(amount, tier_to)
        if upper > prev:
            total += (upper - prev) / 1000 * rate; prev = upper
        if tier_to is not None and amount <= tier_to:
            break
    return round(max(total, flat_min) * (1 + surcharge_pct), 2)
# Explode every underwriter to county grain: rows of (county, uw, tiers, flat_min, surcharge)
cells = []
for fips in counties:
    cells.append((fips, "A", A["tiers"], 0.0, 0.0))
    zone = next((z for z, lst in B["zones"].items() if fips in lst), None)
    if zone:
        cells.append((fips, "B", B["tiers"][zone], 0.0, 0.0))
    grp = next((g for g, lst in C["groups"].items() if fips in lst), "DEFAULT")
    cells.append((fips, "C", [(None, C["rate"][grp])], C["flat_min"], C["surcharge"].get(fips, 0.0)))
uws = ["A", "B", "C"]
for amount in (150000, 350000):
    print(f"\nOwner's policy ${amount:,}")
    print(f"{'county':8}" + "".join(f"{u:>10}" for u in uws) + f"{'lowest':>9}{'spread':>9}")
    for fips, name in counties.items():
        vals = {}
        for c_fips, uw, tiers, fm, sp in cells:
            if c_fips == fips:
                vals[uw] = premium(tiers, amount, fm, sp)
        row = "".join(f"{vals[u]:10.2f}" if u in vals else f"{'GAP':>10}" for u in uws)
        present = [v for v in vals.values()]
        print(f"{name:8}{row}{min(vals, key=vals.get):>9}{max(present)-min(present):9.2f}")
gaps = [(counties[f], u) for f in counties for u in uws if not any(c[0] == f and c[1] == u for c in cells)]
print("\nGaps to chase:", gaps)
```

### Quiz

1. Why compare premiums at benchmark amounts rather than rates per $1 000?
- [x] Tier breakpoints, minimums and surcharges make per-$1 000 rates non-comparable
- [ ] Rates are confidential
- [ ] Premiums are always lower
> Only the computed premium reflects each manual's full structure.

2. Zone harmonisation means:
- [ ] Renaming every underwriter's zones to Zone 1–3
- [x] Mapping each underwriter's zones to the county level so all share one grain
- [ ] Averaging rates across zones
> County is the common grain; zones are each underwriter's grouping of it.

3. A county appears in two of underwriter B's zones. You should:
- [ ] Average the two rates
- [x] Log it as a source error, query the underwriter, and exclude or flag the cell until resolved
- [ ] Use the lower rate
> Duplicate zone membership is a manual error, not a pricing choice.

4. Every matrix cell should be traceable to:
- [ ] The analyst who typed it
- [x] The source document, page and effective date
- [ ] The Excel file name
> Traceability is what makes the matrix reviewable and defensible.

### Exercises

1. **Compute** — Tiers: up to $100k at $5.75, $100k–$500k at $4.50, above at $3.50. Premium for $650 000?
<details><summary>Solution</summary>

100 × 5.75 + 400 × 4.50 + 150 × 3.50 = 575 + 1 800 + 525 = $2 900.

</details>

2. **Design** — Write the validation rules for the harmonised rate table.
<details><summary>Solution</summary>

Uniqueness of (state, county_fips, underwriter, policy_type, tier_from, effective_date); completeness: every county in the state master present per underwriter (list gaps); tiers contiguous and non-overlapping per cell; rates > 0; effective dates non-overlapping per cell; sample of computed premiums equals the manual's worked examples.

</details>

3. **Excel** — Highlight the lowest premium in each row of a matrix with underwriters in columns B:G.
<details><summary>Solution</summary>

Select B2:G500, Conditional Formatting → New Rule → Use a formula: `=B2=MIN($B2:$G2)`, choose a fill. Add a Spread column: `=MAX(B2:G2)-MIN(B2:G2)`.

</details>

### Interview Questions

**Q: Walk me through building a multi-underwriter rate matrix from scratch.**
I start by collecting each underwriter's current rate manual with its effective date and reading its structure: tiers, zones, minimums, surcharges, simultaneous-issue rules. I design one long schema at county grain with tier rows, and for each underwriter I build a zone master mapping its zones or groups to county FIPS codes, exploding statewide rates to every county. Then I load the rates, join to the zone masters, and validate: every county present per underwriter, tiers contiguous, no duplicate cells, and computed premiums matching the worked examples in the manuals. Comparison is at benchmark amounts, premiums not rates, pivoted to counties by underwriters with the row minimum highlighted and a gap list. Every cell carries the source document and page, and each load is versioned by effective date with a change report. On the Stewart project the hard part was not the arithmetic but the county name variants and the zone lists, which is why the lookups and zone masters are the real assets.

**Q: How do you handle an underwriter whose manual is structured completely differently from the others?**
By adding structure to the schema rather than forcing the manual into the wrong shape. A flat-minimum-plus-rate structure gets `flat_min`; a surcharge structure gets `surcharge_pct`; a bracket lookup table becomes tier rows with the bracket premium converted to an equivalent per-$1 000 rate or stored as a `bracket_premium` column with the calculation function branching on which is present. The premium function is the one place that knows about every structure, and it is tested against each manual's examples. What I never do is hand-type a comparable rate into a wide sheet, because that loses traceability and breaks when the manual changes.

**Q: How do you keep the matrix correct when manuals change?**
Loads are versioned by effective date and never overwrite. When a new manual arrives, I load it as new rows with the new effective date and run a change report against the previous version: cells added, removed and changed with old and new values and the source page for each. That report is what a reviewer approves, rather than re-checking the whole matrix. Validation runs on the new version as usual, and the presentation pivot is regenerated for the effective date the client asks for. A subscription or periodic check with each underwriter for revised manuals, logged with dates, closes the loop so the matrix does not silently go stale.

**Q: In a promulgated-rate state, what does a comparison matrix still tell you?**
Base premiums are identical by law, so the comparison shifts to everything that is not promulgated: endorsement pricing, simultaneous-issue and reissue credits, minimum premiums, closing-service fees where allowed, and turnaround or underwriting appetite, which are qualitative. The matrix then shows the base once and compares the differentiators, and the useful analysis becomes total cost for a typical transaction bundle rather than the base rate. It is also a check that each underwriter's manual matches the promulgated table; discrepancies are errors to report, and I have found them.

## Competitor comparison analysis

A rate matrix is a comparison of prices; a **competitor comparison** is the broader exercise of putting several vendors, underwriters, teams or products side by side on the dimensions that matter to a decision. The analyst's job is to make the comparison fair (same definitions, same period, same grain), complete (no silent gaps), and honest about uncertainty. The output is a matrix plus a short narrative that says what is different and why it matters.

### Framing the comparison

Before collecting anything, write down:

1. **Decision**: what will the reader do with this? Choose an underwriter for a county? Renegotiate a vendor? Reallocate agents?
2. **Alternatives**: the six underwriters, the three BPO vendors, the four teams.
3. **Criteria**: the 5 to 8 dimensions that drive the decision, with a weight if the reader wants a score.
4. **Benchmarks**: the concrete scenarios to price or measure (a $350k owner's policy in Harris County; a 100-file weekly batch with 24-hour SLA).
5. **Period and sources**: the same period for everyone, and the source of each number.

Without step 1 you produce a comparison of everything, which informs nothing.

### Criteria and normalisation

Criteria come in different units and directions. Normalise before combining:

| Criterion | Raw | Direction | Normalised (0–1) |
|---|---|---|---|
| Premium at $350k | $1 690 | lower better | (max − x)/(max − min) |
| Counties covered | 248 of 254 | higher better | x / 254 |
| Turnaround, median hours | 18.5 | lower better | (max − x)/(max − min) |
| Accuracy | 97.8% | higher better | (x − min)/(max − min) |
| Endorsement cost, typical bundle | $225 | lower better | as premium |

A weighted score `Σ wᵢ × nᵢ` gives a ranking, but show the raw values next to it; the score is a summary, not evidence. Min-max normalisation is sensitive to one extreme entry; when an outlier distorts it, use rank-based or capped scaling and say so.

### Building the comparison table

Long storage again: `(entity, criterion, scenario, value, unit, period, source, as_of)`. Then pivot: entities across, criteria down, one block per scenario. Include:

- **Coverage**: how many cells are filled per entity; a vendor with half the cells missing cannot be ranked.
- **Rank** per criterion, and the gap to the best.
- **Confidence**: measured (from data), quoted (from the vendor), estimated (by the analyst), each marked.

```text
Scenario: $350k owner's policy, Harris County, TX      Period: Mar 2026
Criterion                     A        B        C        D        E        F     best   spread
Premium ($)              1,700.00 1,652.50 1,782.75 1,700.00 1,762.30    GAP      B    130.25
Endorsement bundle ($)      225      210      250      225      190      240      E       60
Counties covered (of 254)   254      231      254      254      248      202      A/C/D   52
Median turnaround (h)      18.5     22.0     16.2     19.1     24.8     20.3      C      8.6
Accuracy (%)               97.8     96.1     98.4     97.2     95.0     96.9      C      3.4
Coverage of cells           5/5      5/5      5/5      5/5      5/5      4/5
```

### Making it fair

- **Same definitions**: turnaround in business hours for everyone; accuracy on the same checklist.
- **Same period**: seasonality makes a January vendor look slower than a June vendor.
- **Same grain**: compare county-level to county-level, not one vendor's state average to another's county figure.
- **Volume weighting**: an average across counties should weight by transaction volume if the decision is about total cost.
- **Total cost of the bundle**, not the headline rate: base plus endorsements plus fees.
- **Disclose gaps**: "F not quoted for 52 counties" is a finding, not a footnote.

### Sensitivity

Show how the ranking changes when the weights move or a scenario changes: at $150k underwriter B may win on premium; at $1M underwriter A's low top tier wins. A small table of "winner by scenario" communicates more than one blended score. If the ranking flips with a plausible change in weights, say the alternatives are close and the decision should rest on the qualitative criteria.

### Narrative

The table needs three to five sentences: what the reader should conclude, the two or three numbers that drive it, the biggest caveat, and the recommended action. Write the narrative from the numbers, then re-check that every claim in it has a cell in the table.

> **Tip:** Keep a "how measured" column or footnote for every criterion. Comparisons get challenged by the entity that came last, and "median turnaround from 1 842 files closed in March, business hours, both systems" ends the argument.

### Try It Yourself

```python
# Weighted, normalised comparison of six underwriters with coverage checks and a weight-sensitivity test.
criteria = {  # name: (direction, weight)
    "premium_350k": ("low", 0.35), "endorsements": ("low", 0.15), "counties": ("high", 0.15),
    "turnaround_h": ("low", 0.20), "accuracy_pct": ("high", 0.15),
}
data = {
    "A": {"premium_350k": 1700.00, "endorsements": 225, "counties": 254, "turnaround_h": 18.5, "accuracy_pct": 97.8},
    "B": {"premium_350k": 1652.50, "endorsements": 210, "counties": 231, "turnaround_h": 22.0, "accuracy_pct": 96.1},
    "C": {"premium_350k": 1782.75, "endorsements": 250, "counties": 254, "turnaround_h": 16.2, "accuracy_pct": 98.4},
    "D": {"premium_350k": 1700.00, "endorsements": 225, "counties": 254, "turnaround_h": 19.1, "accuracy_pct": 97.2},
    "E": {"premium_350k": 1762.30, "endorsements": 190, "counties": 248, "turnaround_h": 24.8, "accuracy_pct": 95.0},
    "F": {"premium_350k": None,    "endorsements": 240, "counties": 202, "turnaround_h": 20.3, "accuracy_pct": 96.9},
}
def scores(weights):
    norm = {e: {} for e in data}
    for c, (direction, _) in criteria.items():
        vals = [d[c] for d in data.values() if d[c] is not None]
        lo, hi = min(vals), max(vals)
        for e, d in data.items():
            if d[c] is None:
                continue
            x = (d[c] - lo) / (hi - lo) if hi > lo else 1.0
            norm[e][c] = x if direction == "high" else 1 - x
    out = {}
    for e in data:
        covered = [c for c in criteria if c in norm[e]]
        w = sum(weights[c] for c in covered)
        out[e] = (sum(weights[c] * norm[e][c] for c in covered) / w, len(covered))
    return out
base = {c: w for c, (_, w) in criteria.items()}
print(f"{'uw':4}{'score':>7}{'coverage':>10}")
for e, (s, cov) in sorted(scores(base).items(), key=lambda kv: -kv[1][0]):
    print(f"{e:4}{s:7.3f}{cov:>6}/5" + ("   (incomplete - not rankable)" if cov < 5 else ""))
# Sensitivity: shift weight from price to turnaround
alt = dict(base, premium_350k=0.20, turnaround_h=0.35)
rank_base = [e for e, _ in sorted(scores(base).items(), key=lambda kv: -kv[1][0])]
rank_alt = [e for e, _ in sorted(scores(alt).items(), key=lambda kv: -kv[1][0])]
print("\nRanking with base weights :", rank_base)
print("Ranking, turnaround-heavy :", rank_alt)
print("Winner changes with weights:", rank_base[0] != rank_alt[0])
```

### Quiz

1. The first step of a competitor comparison is:
- [ ] Collecting every available number
- [x] Stating the decision the comparison must support
- [ ] Choosing chart colours
> The decision determines the criteria, scenarios and alternatives.

2. Why normalise criteria before weighting?
- [x] They have different units and directions; raw values cannot be added
- [ ] To hide the raw numbers
- [ ] Because Excel requires it
> Normalisation puts a $1 690 premium and a 97.8% accuracy on the same 0–1 scale.

3. An entity with 4 of 5 criteria filled should be:
- [ ] Ranked normally on the four
- [x] Shown with its coverage flagged and excluded from the overall ranking until complete
- [ ] Removed from the table
> Partial coverage makes a blended score misleading.

4. The most useful sensitivity check is:
- [ ] Changing the font
- [x] Re-ranking under different weights and scenarios to see whether the winner changes
- [ ] Removing the worst entity
> A ranking that flips under plausible weights means the decision is close.

### Exercises

1. **Normalise** — Turnaround hours for five vendors: 16.2, 18.5, 19.1, 22.0, 24.8. Compute the 0–1 score for 19.1 (lower is better).
<details><summary>Solution</summary>

(max − x)/(max − min) = (24.8 − 19.1)/(24.8 − 16.2) = 5.7/8.6 = 0.663.

</details>

2. **Fairness** — Vendor X's accuracy is from its own QA; vendor Y's is from your audit. Can you compare them?
<details><summary>Solution</summary>

Not directly. Mark the source (quoted vs measured), audit a sample of X's files with your checklist to get a measured figure, or compare only on measured criteria and list X's accuracy as unverified.

</details>

3. **Narrative** — Write the three-sentence conclusion for the table in this chapter.
<details><summary>Solution</summary>

"For a $350k Harris County policy, B is cheapest on premium ($1 652.50) but covers 23 fewer counties and is 5.8 hours slower than C, which leads on turnaround and accuracy at a $130 premium. A and D are equivalent on price and coverage; E's cheap endorsements do not offset the slowest turnaround. F cannot be ranked until its Harris premium and 52 missing counties are supplied."

</details>

### Interview Questions

**Q: How do you make a vendor comparison fair when the vendors report their own numbers?**
By separating measured from quoted figures and measuring what matters most myself. Turnaround and accuracy can be measured from our own file logs and QA audits with one checklist and one period, and those columns carry the most weight. Vendor-quoted numbers are shown, labelled as quoted, and where a decision hinges on one I audit a sample to verify. Definitions are aligned in writing before collection, such as turnaround in business hours from receipt to delivery, so nobody is comparing calendar hours to business hours. The table shows coverage per vendor, and a vendor missing a key cell is not ranked. When one BPO vendor's self-reported accuracy of 99% became 96% on our audit sample, showing both numbers with their sources was more persuasive than any argument.

**Q: When is a weighted score misleading?**
When the weights are arbitrary and the ranking is sensitive to them, when one criterion's normalisation is distorted by an outlier so the others barely matter, when entities have different coverage so the score is computed on different criteria, and when criteria are correlated so the same underlying factor is counted twice. It also misleads when a hard constraint is treated as a weight: a vendor that fails a compliance requirement should be excluded, not scored low. My practice is to show the raw table, the ranks per criterion, and a score with a sensitivity check, and to let the narrative say whether the decision is clear or close. The score is a summary for the busy reader, never the argument.

**Q: How do you present a comparison where your own team is one of the alternatives?**
With the same rules and more transparency. Definitions, period and sources are identical for all entities and stated on the page; measured figures come from the same system for everyone; and I show the criteria where my team ranks worst as plainly as those where it ranks best. If the reader suspects bias, the sensitivity table and the "how measured" column are the defence, and I invite the other teams to check their own rows before publication. The credibility of every future report depends on this one not looking like advocacy, so I would rather under-claim than be caught over-claiming.

**Q: Give an example of a comparison where the total-cost view changed the conclusion.**
Comparing underwriters on base premium alone, one was cheapest by about $50 at $350k. Adding a typical endorsement bundle and the simultaneous-issue loan policy, it became the second most expensive because its endorsement pricing was high and its simultaneous-issue credit was small, while a mid-priced base underwriter had the lowest bundle cost by roughly $90. Weighting by county transaction volume also mattered, since the cheap underwriter did not cover several high-volume counties. The lesson I bring to interviews is that the headline rate is one cell; the decision needs the scenario a real client faces, computed the same way for every alternative.
