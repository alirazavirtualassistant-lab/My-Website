---
id: sql
title: SQL
icon: 🗄️
track: Programming
color: #00618A
runner: sql
tagline: Query, join, aggregate and shape data for every report and dashboard.
description: SQL from SELECT to expert analytics: filtering, sorting, aggregation, joins, subqueries, CTEs, window functions, data modification, constraints, indexes, views, transactions and the query-optimisation questions asked in analyst and engineering interviews. Runs live in your browser (SQLite).
---

# LEVEL: Beginner

## Introduction & SELECT

SQL (Structured Query Language) is the language you use to ask questions of a **relational database**. A relational database stores data in **tables**. A table has named **columns** (each with a type) and any number of **rows**. If you have ever kept a title-insurance production log in Excel with one row per file and columns for state, county, premium and status, you already understand the model.

The engine you will use here is **SQLite**, a small file-based database that runs entirely in your browser. The same `SELECT` syntax works, with tiny differences, in MySQL, PostgreSQL, SQL Server and Oracle. Later chapters point out where the dialects differ.

### Your first query

The `SELECT` statement reads rows from a table. The simplest form lists the columns you want and the table they come from:

```sql
SELECT file_no, state, premium
FROM orders;
```

Read it aloud: *select the columns file_no, state and premium from the table orders*. The result is itself a table, which is why SQL composes so well: the output of one query can feed another.

### Selecting every column

The asterisk `*` means *all columns in the order they were defined*:

```sql
SELECT * FROM orders;
```

`SELECT *` is fine while exploring. In production reports, name the columns explicitly so the report does not silently change when someone adds a column to the table.

### Aliases and expressions

A column in the result does not have to exist in the table. You can compute it and give it a name with `AS`:

```sql
SELECT file_no,
       premium,
       premium * 0.85 AS agent_share,
       state || '-' || county AS location
FROM orders;
```

| Piece | Meaning |
|---|---|
| `premium * 0.85` | arithmetic on a column, evaluated for every row |
| `AS agent_share` | the result column's name (an **alias**) |
| `\|\|` | string concatenation in SQLite/PostgreSQL (MySQL uses `CONCAT()`) |

### DISTINCT removes duplicate rows

```sql
SELECT DISTINCT state FROM orders;
```

If 40 orders come from Texas, `DISTINCT` returns the value `Texas` once. It applies to the whole row, so `SELECT DISTINCT state, county` returns each *pair* once.

### Formatting rules that matter

- SQL keywords are case-insensitive: `select` and `SELECT` are identical. Convention is upper-case keywords, lower-case identifiers.
- Statements end with a semicolon. SQLite tolerates a missing one on the last statement, but write it anyway.
- Comments start with `--` (single line) or sit inside `/* ... */`.
- Text values use **single** quotes: `'Texas'`. Double quotes are for identifiers such as `"Order Date"`.

> **Tip:** Keep a scratch file of the queries you reuse. Most weekly status reports at a title-production desk are the same six queries run against new data.

### Try It Yourself

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  file_no  TEXT NOT NULL,
  state    TEXT,
  county   TEXT,
  product  TEXT,
  liability REAL,
  premium  REAL,
  status   TEXT
);
INSERT INTO orders (file_no, state, county, product, liability, premium, status) VALUES
 ('TX-1001','Texas','Harris','Owner',350000,2150.00,'Closed'),
 ('TX-1002','Texas','Dallas','Lender',280000,1180.00,'Open'),
 ('FL-2001','Florida','Miami-Dade','Owner',510000,2645.50,'Closed'),
 ('WY-3001','Wyoming','Laramie','Both',190000,1425.00,'Cancelled'),
 ('FL-2002','Florida','Orange','Lender',225000,1012.75,'Open');

SELECT file_no,
       state || ' / ' || county AS location,
       premium,
       ROUND(premium * 0.85, 2) AS agent_share
FROM orders;
```

### Quiz

1. Which keyword introduces the table a query reads from?
- [ ] `SELECT`
- [x] `FROM`
- [ ] `TABLE`
> `SELECT` lists columns; `FROM` names the source table.

2. What does `SELECT DISTINCT state, county FROM orders` return?
- [ ] Each state once
- [x] Each unique state–county pair once
- [ ] Every row of the table
> `DISTINCT` de-duplicates whole result rows, not individual columns.

3. Which quote style is correct for a text value in SQL?
- [x] `'Texas'`
- [ ] `"Texas"`
- [ ] `` `Texas` ``
> Single quotes delimit string literals; double quotes and backticks are for identifiers.

### Exercises

1. **Product list** — Write a query that returns each distinct `product` value in `orders`.
<details><summary>Solution</summary>

```sql
SELECT DISTINCT product FROM orders;
```

</details>

2. **Rate per thousand** — Return `file_no` and the premium expressed per $1,000 of liability, rounded to 2 decimals and named `rate_per_k`.
<details><summary>Solution</summary>

```sql
SELECT file_no, ROUND(premium / liability * 1000, 2) AS rate_per_k
FROM orders;
```

</details>

### Interview Questions

**Q: What is the difference between SQL and a database engine such as SQLite or PostgreSQL?**
SQL is the standard query language; the engine is the software that stores data and executes the language. Every engine implements the ANSI core (`SELECT`, `WHERE`, `JOIN`, `GROUP BY`) but adds its own functions, types and procedural extensions, which is why the same report often needs small edits when it moves from SQLite to SQL Server. A strong answer names a concrete difference, for example string concatenation being `||` in SQLite and PostgreSQL but `+` in T-SQL and `CONCAT()` in MySQL.

**Q: Why is `SELECT *` discouraged in production code?**
Three reasons: it couples your code to the physical column order, it fetches columns you do not need (more I/O and network), and it breaks silently when columns are added or reordered, for example when a downstream `INSERT INTO ... SELECT *` suddenly has a different column count. Naming columns also documents intent. `SELECT *` is fine in an ad-hoc console session.

**Q: What does a query return, conceptually?**
A query returns a result set, which is itself a table: an ordered list of rows with named, typed columns. Because the output has the same shape as the input, queries compose: you can nest a `SELECT` inside another as a subquery or a CTE. This closure property is what makes relational algebra work and is worth mentioning explicitly in an interview.

## WHERE & Operators

`SELECT` chooses columns; `WHERE` chooses **rows**. The `WHERE` clause holds a condition that is evaluated for every row, and only rows where the condition is true are returned.

```sql
SELECT file_no, premium
FROM orders
WHERE state = 'Texas';
```

### Comparison operators

| Operator | Meaning | Example |
|---|---|---|
| `=` | equal | `status = 'Closed'` |
| `<>` or `!=` | not equal | `state <> 'Texas'` |
| `<`, `>`, `<=`, `>=` | ordering | `premium >= 2000` |
| `BETWEEN a AND b` | inclusive range | `liability BETWEEN 200000 AND 400000` |
| `IN (...)` | matches any listed value | `state IN ('Texas','Florida')` |
| `LIKE` | pattern match | `file_no LIKE 'TX-%'` |
| `IS NULL` / `IS NOT NULL` | missing value test | `closed IS NULL` |

`BETWEEN` includes both ends. `liability BETWEEN 200000 AND 400000` is the same as `liability >= 200000 AND liability <= 400000`.

### Combining conditions with AND, OR, NOT

```sql
SELECT file_no, state, premium
FROM orders
WHERE state = 'Texas'
  AND (product = 'Owner' OR product = 'Both')
  AND NOT status = 'Cancelled';
```

`AND` binds tighter than `OR`, exactly like multiplication before addition. Without the parentheses, the query above would mean *Texas owner policies, or any policy of type Both*. Always bracket mixed `AND`/`OR` conditions; it is the single most common logic bug in report queries.

### Pattern matching with LIKE

`LIKE` uses two wildcards: `%` matches any run of characters (including none) and `_` matches exactly one character.

```sql
SELECT file_no FROM orders WHERE file_no LIKE 'FL-2__1';   -- FL-2001, FL-2011 ...
SELECT county  FROM orders WHERE county LIKE '%dade%';     -- Miami-Dade
```

In SQLite `LIKE` is case-insensitive for ASCII letters by default; in PostgreSQL it is case-sensitive and you use `ILIKE` for the insensitive version. SQLite also has `GLOB`, which is case-sensitive and uses `*` and `?`.

### NULL is not a value

`NULL` means *unknown or missing*. Nothing equals `NULL`, not even `NULL` itself, so `WHERE closed = NULL` returns no rows. Use `IS NULL`:

```sql
SELECT file_no FROM orders WHERE closed IS NULL;   -- still open
```

A comparison involving `NULL` yields `NULL`, which `WHERE` treats as *not true*. Chapter "NULL Handling" covers the full three-valued logic; for now remember `IS NULL`.

> **Warning:** `WHERE status <> 'Cancelled'` silently drops rows whose status is `NULL`. If those rows should be kept, write `WHERE status <> 'Cancelled' OR status IS NULL`.

### Comparing text and dates

Text comparisons are done character by character using the column's collation. In SQLite `'apple' < 'Banana'` is true because upper-case letters sort before lower-case in binary order; add `COLLATE NOCASE` to compare case-insensitively. Dates stored as ISO text (`'2026-03-04'`) compare correctly with `<` and `>` precisely because the year–month–day order sorts the same as the calendar, which is why every production table in this course stores dates that way.

```sql
SELECT file_no FROM orders
WHERE closed >= '2026-03-01' AND closed < '2026-04-01';   -- all of March
```

The half-open range (`>=` start, `<` next month) is safer than `BETWEEN` when the column may later hold a time component.

### Try It Yourself

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  file_no TEXT, state TEXT, county TEXT, product TEXT,
  liability REAL, premium REAL, status TEXT, closed TEXT
);
INSERT INTO orders (file_no,state,county,product,liability,premium,status,closed) VALUES
 ('TX-1001','Texas','Harris','Owner',350000,2150.00,'Closed','2026-03-04'),
 ('TX-1002','Texas','Dallas','Lender',280000,1180.00,'Open',NULL),
 ('TX-1003','Texas','Travis','Both',420000,2510.00,'Closed','2026-03-11'),
 ('FL-2001','Florida','Miami-Dade','Owner',510000,2645.50,'Closed','2026-03-02'),
 ('WY-3001','Wyoming','Laramie','Both',190000,1425.00,'Cancelled',NULL),
 ('FL-2002','Florida','Orange','Lender',225000,1012.75,NULL,NULL);

SELECT file_no, state, product, premium, status
FROM orders
WHERE state IN ('Texas','Florida')
  AND premium BETWEEN 1000 AND 2600
  AND (status <> 'Cancelled' OR status IS NULL);
```

### Quiz

1. Which condition finds rows where `closed` has no value?
- [ ] `closed = NULL`
- [x] `closed IS NULL`
- [ ] `closed == ''`
> Nothing compares equal to NULL; you must use the `IS NULL` predicate.

2. What does `file_no LIKE 'TX-1__'` match?
- [ ] Any file number starting with TX-1
- [x] TX-1 followed by exactly two characters
- [ ] Only the literal string `TX-1__`
> `_` matches exactly one character; `%` would match any number.

3. Without parentheses, how is `a = 1 OR b = 2 AND c = 3` evaluated?
- [x] `a = 1 OR (b = 2 AND c = 3)`
- [ ] `(a = 1 OR b = 2) AND c = 3`
- [ ] Left to right
> `AND` has higher precedence than `OR`.

### Exercises

1. **High-value owner policies** — List `file_no` and `liability` for Owner or Both policies with liability above $300,000.
<details><summary>Solution</summary>

```sql
SELECT file_no, liability
FROM orders
WHERE product IN ('Owner','Both') AND liability > 300000;
```

</details>

2. **Not yet closed** — Return every order that is not closed, including those with a `NULL` status.
<details><summary>Solution</summary>

```sql
SELECT * FROM orders
WHERE status IS NULL OR status <> 'Closed';
```

</details>

### Interview Questions

**Q: Why does `WHERE status <> 'Cancelled'` not return rows where status is NULL?**
Because `NULL <> 'Cancelled'` evaluates to `NULL` (unknown), and `WHERE` only keeps rows whose condition is true. This is SQL's three-valued logic. To include unknown statuses, add `OR status IS NULL`, or use `COALESCE(status, '') <> 'Cancelled'`. I mention that the same trap applies to `NOT IN` with a subquery that can return `NULL`, which returns no rows at all.

**Q: What is the difference between `IN` and `BETWEEN`?**
`IN` tests membership in an explicit list or subquery result and works for any type; `BETWEEN` tests an inclusive range and relies on ordering. `state IN ('TX','FL')` is a set test, while `premium BETWEEN 1000 AND 2000` is a range test equivalent to `premium >= 1000 AND premium <= 2000`. A good candidate notes that `BETWEEN` on dates with a time component is a classic off-by-one: `closed BETWEEN '2026-03-01' AND '2026-03-31'` misses rows timestamped later on the 31st.

**Q: How would you match a literal percent sign with LIKE?**
Use an escape character: `WHERE note LIKE '%50\%%' ESCAPE '\'`. SQLite, PostgreSQL and SQL Server all support the `ESCAPE` clause; MySQL defaults the escape character to backslash. In SQL Server you can also wrap the wildcard in brackets: `LIKE '%50[%]%'`.

## ORDER BY & LIMIT

A table has no inherent order. Unless you say otherwise, the database returns rows in whatever order is cheapest for it, and that order can change after an index is added or data is reorganised. `ORDER BY` makes the order explicit.

```sql
SELECT file_no, premium
FROM orders
ORDER BY premium DESC;
```

`ASC` (ascending) is the default; `DESC` sorts largest first. You can sort by several columns, and each may have its own direction:

```sql
SELECT state, county, premium
FROM orders
ORDER BY state ASC, premium DESC;
```

Rows are sorted by `state`; within each state, ties are broken by `premium` from high to low.

### Sorting by expressions and aliases

You may sort by a computed expression or by an alias defined in the `SELECT` list:

```sql
SELECT file_no, premium / liability * 1000 AS rate_per_k
FROM orders
ORDER BY rate_per_k DESC;
```

Sorting by column position (`ORDER BY 2 DESC`) also works but is fragile; avoid it in saved reports.

### Where do NULLs go?

SQLite and MySQL treat `NULL` as smaller than any value, so `NULL`s come first in `ASC` order. PostgreSQL and Oracle treat them as largest. SQLite (3.30+) and PostgreSQL accept `NULLS FIRST` / `NULLS LAST` to make it explicit:

```sql
SELECT file_no, closed FROM orders ORDER BY closed DESC NULLS LAST;
```

### LIMIT and OFFSET

`LIMIT n` returns at most `n` rows. `OFFSET k` skips the first `k`. Together they implement paging and top-N reports.

```sql
-- top 3 premiums
SELECT file_no, premium FROM orders ORDER BY premium DESC LIMIT 3;

-- page 2 of a 10-row grid
SELECT file_no, premium FROM orders ORDER BY order_id LIMIT 10 OFFSET 10;
```

`LIMIT` without `ORDER BY` returns an arbitrary set of rows, so the two clauses almost always appear together.

### Sorting text: collation

Text sorts by **collation**, the rule that decides whether `a` comes before `B`. SQLite's default `BINARY` collation puts all upper-case letters before all lower-case ones, so `Zebra` sorts before `apple`. For human-friendly ordering in county lists and agent names add `COLLATE NOCASE`:

```sql
SELECT county FROM orders ORDER BY county COLLATE NOCASE;
```

MySQL's default collations are already case-insensitive; PostgreSQL follows the operating-system locale. Sorting numbers stored as text is another trap: `'10'` sorts before `'9'`. Cast first (`ORDER BY CAST(file_seq AS INTEGER)`) or, better, store numbers as numbers.

| Dialect | Top-N syntax |
|---|---|
| SQLite, MySQL, PostgreSQL | `... ORDER BY x LIMIT 3` |
| SQL Server (T-SQL) | `SELECT TOP 3 ... ORDER BY x` or `OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY` |
| Oracle 12c+ | `... ORDER BY x FETCH FIRST 3 ROWS ONLY` |

### Order of evaluation

Even though you write `SELECT` first, the engine logically processes clauses in this order: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. That is why `ORDER BY` can use a `SELECT` alias (it runs after `SELECT`) but `WHERE` cannot (it runs before).

> **Interview note:** "Explain the logical order of SQL clauses" is asked in almost every analyst screen. Memorise the sequence above and be able to explain why `WHERE rate_per_k > 5` fails while `ORDER BY rate_per_k` works.

### Try It Yourself

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT,
  liability REAL, premium REAL, closed TEXT
);
INSERT INTO orders (file_no,state,liability,premium,closed) VALUES
 ('TX-1001','Texas',350000,2150.00,'2026-03-04'),
 ('TX-1002','Texas',280000,1180.00,NULL),
 ('TX-1003','Texas',420000,2510.00,'2026-03-11'),
 ('FL-2001','Florida',510000,2645.50,'2026-03-02'),
 ('WY-3001','Wyoming',190000,1425.00,NULL),
 ('FL-2002','Florida',225000,1012.75,'2026-03-15'),
 ('FL-2003','Florida',640000,3105.00,'2026-03-20');

SELECT file_no, state, premium,
       ROUND(premium / liability * 1000, 2) AS rate_per_k
FROM orders
ORDER BY state ASC, rate_per_k DESC
LIMIT 5;
```

### Quiz

1. What is the default sort direction of `ORDER BY`?
- [x] Ascending
- [ ] Descending
- [ ] Insertion order
> `ASC` is implied when no direction is given.

2. Which query returns rows 21–30 of a result?
- [ ] `LIMIT 30 OFFSET 20` without `ORDER BY`
- [x] `ORDER BY order_id LIMIT 10 OFFSET 20`
- [ ] `LIMIT 20 OFFSET 10`
> Skip 20 rows, take the next 10, and sort first so paging is stable.

3. Why can `ORDER BY` reference a `SELECT` alias but `WHERE` cannot?
- [x] `ORDER BY` is evaluated after `SELECT`; `WHERE` before it
- [ ] Aliases are only allowed in `ORDER BY`
- [ ] It is a SQLite quirk
> Logical processing order is FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.

### Exercises

1. **Oldest open files** — List open orders (closed is NULL) sorted by `order_id` so the oldest appear first, limited to 2.
<details><summary>Solution</summary>

```sql
SELECT file_no FROM orders
WHERE closed IS NULL
ORDER BY order_id
LIMIT 2;
```

</details>

2. **Second-highest premium** — Return only the row with the second-highest premium.
<details><summary>Solution</summary>

```sql
SELECT file_no, premium FROM orders
ORDER BY premium DESC
LIMIT 1 OFFSET 1;
```

</details>

### Interview Questions

**Q: Is the row order of a query without ORDER BY guaranteed?**
No. The engine returns rows in whatever order the chosen access path produces: heap order, index order, or hash-join output order. That order can change after a `VACUUM`, a new index, or a different plan for a bigger table. Any report or pagination that depends on order must state it with `ORDER BY`, ideally including a unique tiebreaker such as the primary key so that ties do not shuffle between pages.

**Q: What is wrong with OFFSET-based pagination on large tables?**
`OFFSET 100000` still reads and discards 100,000 rows, so page load time grows linearly with page number. Keyset (seek) pagination avoids this: remember the last key seen and query `WHERE (closed, order_id) > (:last_closed, :last_id) ORDER BY closed, order_id LIMIT 50`, which uses the index directly. I would use OFFSET for small admin grids and keyset for anything user-facing with thousands of pages.

**Q: How do you get the top 3 rows in SQL Server versus MySQL?**
SQL Server uses `SELECT TOP 3 ... ORDER BY premium DESC` or the standard `ORDER BY premium DESC OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY`; MySQL, PostgreSQL and SQLite use `ORDER BY premium DESC LIMIT 3`. `TOP` without `ORDER BY` is meaningless, and `TOP 3 WITH TIES` returns extra rows that tie on the sort key, which is sometimes exactly what a "top producers" report needs.

## Aggregates & GROUP BY

Reports rarely want individual rows; they want totals, counts and averages. **Aggregate functions** collapse many rows into one value.

```sql
SELECT COUNT(*)      AS files,
       SUM(premium)  AS total_premium,
       AVG(premium)  AS avg_premium,
       MIN(premium)  AS smallest,
       MAX(premium)  AS largest
FROM orders;
```

With no `GROUP BY`, the whole table is one group and you get exactly one row.

| Function | Returns | Notes |
|---|---|---|
| `COUNT(*)` | number of rows | counts rows with NULLs |
| `COUNT(col)` | number of non-NULL values in `col` | skips NULLs |
| `COUNT(DISTINCT col)` | number of distinct non-NULL values | |
| `SUM`, `AVG` | total / mean of non-NULL values | `AVG` of integers is a float in SQLite |
| `MIN`, `MAX` | smallest / largest | works on text and dates too |
| `GROUP_CONCAT(col, ', ')` | values joined into one string | SQLite/MySQL; `STRING_AGG` in PostgreSQL/SQL Server |

### GROUP BY makes one row per group

Add `GROUP BY state` and the aggregates are computed separately for each state:

```sql
SELECT state, COUNT(*) AS files, SUM(premium) AS total_premium
FROM orders
GROUP BY state
ORDER BY total_premium DESC;
```

This is exactly a PivotTable with `state` in Rows and `premium` in Values. Every column in the `SELECT` list must be either in the `GROUP BY` or wrapped in an aggregate; otherwise the engine does not know which row's value to show. SQLite and MySQL (without `ONLY_FULL_GROUP_BY`) will quietly pick an arbitrary row, which produces wrong reports; PostgreSQL and SQL Server raise an error.

### Grouping by several columns

```sql
SELECT state, product, COUNT(*) AS files, ROUND(AVG(liability)) AS avg_liability
FROM orders
GROUP BY state, product;
```

You get one row per state–product combination that actually appears in the data.

### Grouping by an expression

You can group by anything computable from the row, such as the month a file closed:

```sql
SELECT substr(closed, 1, 7) AS month, COUNT(*) AS closed_files
FROM orders
WHERE closed IS NOT NULL
GROUP BY month
ORDER BY month;
```

`WHERE` runs before grouping, so it decides which rows are counted. To filter on the aggregate itself you need `HAVING`, which is the next chapter.

### Counting carefully

`COUNT(*)` counts rows. `COUNT(closed)` counts rows where `closed` is not `NULL`, which gives you *closed files* without any `WHERE`:

```sql
SELECT state, COUNT(*) AS all_files, COUNT(closed) AS closed_files
FROM orders GROUP BY state;
```

> **Tip:** `SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END)` counts rows matching a condition inside a wider group, the SQL equivalent of `COUNTIFS`. The CASE chapter covers this pattern in depth.

### Aggregates over an empty set

If the `WHERE` clause matches nothing, an aggregate query without `GROUP BY` still returns one row: `COUNT(*)` gives `0`, but `SUM`, `AVG`, `MIN` and `MAX` give `NULL`. A weekly report that prints `SUM(premium)` for a state with no activity therefore shows blank instead of zero. Wrap it as `COALESCE(SUM(premium), 0)` when the dashboard expects a number. With `GROUP BY`, an empty input produces zero rows, which means a state with no files simply disappears from the report; the Joins chapter shows how to keep it with a `LEFT JOIN` from a states table.

### Try It Yourself

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT, product TEXT,
  liability REAL, premium REAL, status TEXT, closed TEXT
);
INSERT INTO orders (file_no,state,product,liability,premium,status,closed) VALUES
 ('TX-1001','Texas','Owner',350000,2150.00,'Closed','2026-03-04'),
 ('TX-1002','Texas','Lender',280000,1180.00,'Open',NULL),
 ('TX-1003','Texas','Both',420000,2510.00,'Closed','2026-03-11'),
 ('FL-2001','Florida','Owner',510000,2645.50,'Closed','2026-03-02'),
 ('WY-3001','Wyoming','Both',190000,1425.00,'Cancelled',NULL),
 ('FL-2002','Florida','Lender',225000,1012.75,'Open',NULL),
 ('FL-2003','Florida','Owner',640000,3105.00,'Closed','2026-04-01');

SELECT state,
       COUNT(*)                 AS all_files,
       COUNT(closed)            AS closed_files,
       ROUND(SUM(premium), 2)   AS total_premium,
       ROUND(AVG(liability))    AS avg_liability,
       GROUP_CONCAT(DISTINCT product) AS products
FROM orders
GROUP BY state
ORDER BY total_premium DESC;
```

### Quiz

1. What does `COUNT(closed)` count?
- [ ] All rows
- [x] Rows where `closed` is not NULL
- [ ] Distinct closed dates
> `COUNT(column)` ignores NULLs; `COUNT(*)` counts every row.

2. A query selects `state, county, SUM(premium)` and groups by `state` only. In PostgreSQL this…
- [x] raises an error because `county` is not grouped or aggregated
- [ ] returns the first county per state
- [ ] groups by both automatically
> Every non-aggregated column must appear in `GROUP BY`; SQLite and lenient MySQL silently pick a value, which is dangerous.

3. Which clause decides which rows enter the groups?
- [x] `WHERE`
- [ ] `HAVING`
- [ ] `ORDER BY`
> `WHERE` filters rows before aggregation; `HAVING` filters the groups afterwards.

### Exercises

1. **Product mix** — For each product, return the number of files and the average premium rounded to 2 decimals.
<details><summary>Solution</summary>

```sql
SELECT product, COUNT(*) AS files, ROUND(AVG(premium), 2) AS avg_premium
FROM orders
GROUP BY product;
```

</details>

2. **Monthly closings** — Count closed files per `YYYY-MM` month, ignoring open ones.
<details><summary>Solution</summary>

```sql
SELECT substr(closed, 1, 7) AS month, COUNT(*) AS closed_files
FROM orders
WHERE closed IS NOT NULL
GROUP BY month
ORDER BY month;
```

</details>

### Interview Questions

**Q: What is the difference between COUNT(*), COUNT(1) and COUNT(column)?**
`COUNT(*)` and `COUNT(1)` both count rows and are optimised identically in every mainstream engine, so the old belief that `COUNT(1)` is faster is a myth. `COUNT(column)` counts only rows where that column is not NULL, which makes it a handy way to count "completed" items without a `WHERE`. `COUNT(DISTINCT column)` counts unique non-NULL values and is usually the most expensive of the four because it needs a hash or sort to de-duplicate.

**Q: Why does AVG ignore NULLs, and when is that a problem?**
Aggregates skip NULLs by definition, so `AVG(premium)` divides by the number of non-NULL premiums, not the number of rows. That is right when NULL means "not applicable", but wrong when NULL should count as zero, for example missing endorsement fees in a per-file average. In that case write `AVG(COALESCE(premium, 0))`, and say explicitly in the report which convention you used.

**Q: How does the database execute GROUP BY?**
Two main strategies: hash aggregation builds an in-memory hash table keyed on the grouping columns and updates running totals as rows stream through; sort-based aggregation sorts rows by the group key and emits a group when the key changes. Hash is faster when groups fit in memory; sort is chosen when an index already delivers rows in key order or memory is tight. Knowing this explains why an index on the `GROUP BY` column can make a report dramatically faster.

## HAVING

`WHERE` cannot see aggregates because it runs before grouping. To keep only groups that satisfy a condition, use `HAVING`:

```sql
SELECT state, COUNT(*) AS files, SUM(premium) AS total_premium
FROM orders
GROUP BY state
HAVING COUNT(*) >= 3;
```

Read: *group the orders by state, then keep only states with at least three files*.

### WHERE and HAVING together

Use both in one query when you need to filter rows *and* groups:

```sql
SELECT state, product, SUM(premium) AS total_premium
FROM orders
WHERE status = 'Closed'                  -- rows first
GROUP BY state, product
HAVING SUM(premium) > 2000               -- groups second
ORDER BY total_premium DESC;
```

| Clause | Filters | Can use aggregates? | Runs |
|---|---|---|---|
| `WHERE` | individual rows | no | before grouping |
| `HAVING` | groups | yes | after grouping |

Putting a row condition into `HAVING` (for example `HAVING status = 'Closed'`) is a mistake: it either errors in strict engines or, in SQLite, evaluates against an arbitrary row of each group.

### Aliases in HAVING

SQLite and MySQL let you write `HAVING total_premium > 2000` using the alias; PostgreSQL and SQL Server require you to repeat the expression `HAVING SUM(premium) > 2000`. Repeating the expression is portable, so prefer it in shared code.

### Typical HAVING questions

Finding duplicates is the classic use. If `file_no` should be unique, this query lists violations:

```sql
SELECT file_no, COUNT(*) AS copies
FROM orders
GROUP BY file_no
HAVING COUNT(*) > 1;
```

Finding groups that meet a condition on **every** row is done by comparing counts:

```sql
-- states where every file is closed
SELECT state
FROM orders
GROUP BY state
HAVING COUNT(*) = COUNT(closed);
```

And finding groups with at least one matching row:

```sql
-- states with at least one cancellation
SELECT state
FROM orders
GROUP BY state
HAVING SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) > 0;
```

### HAVING without GROUP BY

SQL allows `HAVING` with no `GROUP BY`; the whole table is one group. It is rare in practice but explains why `SELECT SUM(premium) FROM orders HAVING SUM(premium) > 10000` returns either one row or none.

> **Interview note:** Expect the question "when would you use HAVING instead of WHERE?" The crisp answer is: whenever the condition refers to an aggregate. Then give the duplicate-finder above as an example; it is the most common real-world `HAVING` query.

### Performance: filter early

Because `WHERE` runs first, every row it removes is a row the grouping step never has to hash or sort. A condition that *could* be expressed either way, such as restricting to one year, belongs in `WHERE`. Consider a two-million-row orders table: `WHERE closed >= '2026-01-01'` might leave 150,000 rows to aggregate, whereas grouping everything and then applying `HAVING MIN(closed) >= '2026-01-01'` aggregates all two million and also changes the meaning, because it keeps only groups whose *earliest* file is in 2026. Correctness and speed both point to the same rule: row filters in `WHERE`, group filters in `HAVING`.

### Try It Yourself

```sql
CREATE TABLE qa_reviews (
  review_id INTEGER PRIMARY KEY, agent TEXT, file_no TEXT,
  errors INTEGER, reviewed TEXT
);
INSERT INTO qa_reviews (agent,file_no,errors,reviewed) VALUES
 ('Sana','TX-1001',0,'2026-03-01'),('Sana','TX-1002',2,'2026-03-02'),
 ('Sana','TX-1003',0,'2026-03-03'),('Bilal','FL-2001',1,'2026-03-01'),
 ('Bilal','FL-2002',3,'2026-03-02'),('Hira','WY-3001',0,'2026-03-01'),
 ('Hira','WY-3002',0,'2026-03-02'),('Hira','WY-3003',0,'2026-03-03'),
 ('Hira','WY-3004',1,'2026-03-04'),('Usman','TX-1004',4,'2026-03-05');

-- agents with at least 3 reviews and an average error rate under 1
SELECT agent,
       COUNT(*)              AS reviews,
       ROUND(AVG(errors), 2) AS avg_errors,
       SUM(errors)           AS total_errors
FROM qa_reviews
GROUP BY agent
HAVING COUNT(*) >= 3 AND AVG(errors) < 1
ORDER BY avg_errors;
```

### Quiz

1. Which query correctly finds states with more than two files?
- [ ] `SELECT state FROM orders WHERE COUNT(*) > 2 GROUP BY state`
- [x] `SELECT state FROM orders GROUP BY state HAVING COUNT(*) > 2`
- [ ] `SELECT state FROM orders GROUP BY state WHERE COUNT(*) > 2`
> Aggregates are only available after grouping, so the filter belongs in `HAVING`.

2. What does `HAVING COUNT(*) = COUNT(closed)` express?
- [ ] No file in the group is closed
- [x] Every file in the group is closed
- [ ] At least one file is closed
> `COUNT(closed)` skips NULLs, so equality with `COUNT(*)` means no NULLs remain.

3. Where should a condition like `status = 'Closed'` go?
- [x] `WHERE`
- [ ] `HAVING`
- [ ] Either, with identical results everywhere
> Row-level conditions belong in `WHERE`; putting them in `HAVING` is invalid or ambiguous.

### Exercises

1. **Duplicate file numbers** — Write a query that lists any `file_no` appearing more than once in `qa_reviews`.
<details><summary>Solution</summary>

```sql
SELECT file_no, COUNT(*) AS copies
FROM qa_reviews
GROUP BY file_no
HAVING COUNT(*) > 1;
```

</details>

2. **Zero-error agents** — Return agents whose reviews contain no errors at all, along with their review count.
<details><summary>Solution</summary>

```sql
SELECT agent, COUNT(*) AS reviews
FROM qa_reviews
GROUP BY agent
HAVING SUM(errors) = 0;
```

</details>

### Interview Questions

**Q: Explain the difference between WHERE and HAVING with an example.**
`WHERE` filters rows before they are grouped, so it cannot reference aggregates; `HAVING` filters the groups produced by `GROUP BY`, so it can. To report agents whose March reviews average under one error, I would put `reviewed >= '2026-03-01'` in `WHERE` and `AVG(errors) < 1` in `HAVING`. Filtering in `WHERE` first is also cheaper, because fewer rows reach the aggregation step.

**Q: How do you find duplicate rows in a table?**
Group by the columns that define a duplicate and keep groups with a count above one: `SELECT file_no, COUNT(*) FROM orders GROUP BY file_no HAVING COUNT(*) > 1`. To see the actual duplicate rows rather than just the keys, join back to the table or use `ROW_NUMBER() OVER (PARTITION BY file_no ORDER BY order_id)` and keep rows numbered above one; the window approach also lets you delete the extras in one statement.

**Q: Can you use HAVING without GROUP BY?**
Yes. The whole table is treated as a single group, so `SELECT SUM(premium) FROM orders HAVING SUM(premium) > 10000` returns one row when the total exceeds the threshold and zero rows otherwise. It is mostly useful in existence checks and generated SQL; in hand-written reports a subquery is usually clearer.

# LEVEL: Intermediate

## Joins

Real data lives in several tables. Orders reference agents by `agent_id`; agents reference offices; rates reference states. A **join** combines rows from two tables based on a matching condition, usually a foreign key equalling a primary key.

```sql
SELECT o.file_no, o.premium, a.name AS agent
FROM orders AS o
JOIN agents AS a ON a.agent_id = o.agent_id;
```

Each order row is paired with the agent row whose `agent_id` matches. Table aliases (`o`, `a`) keep the query short and make it clear which table each column comes from. Without them, columns with the same name in both tables (`agent_id`) would be ambiguous.

### INNER JOIN

`JOIN` means `INNER JOIN`. Only rows with a match on **both** sides appear. An order whose `agent_id` is `NULL`, or points at a deleted agent, is dropped.

### LEFT JOIN keeps unmatched rows from the left

```sql
SELECT a.name, COUNT(o.order_id) AS files
FROM agents a
LEFT JOIN orders o ON o.agent_id = a.agent_id
GROUP BY a.name;
```

Every agent is returned; agents with no orders get `NULL` in every `orders` column, and `COUNT(o.order_id)` correctly counts them as 0 because `COUNT(col)` skips NULLs. This is *the* pattern for "show everyone, including those with nothing".

| Join | Rows returned |
|---|---|
| `INNER JOIN` | only matches |
| `LEFT [OUTER] JOIN` | all left rows + matches |
| `RIGHT [OUTER] JOIN` | all right rows + matches |
| `FULL [OUTER] JOIN` | all rows from both sides |
| `CROSS JOIN` | every combination (Cartesian product) |

`RIGHT JOIN` is just a `LEFT JOIN` with the tables swapped; most teams standardise on `LEFT`. SQLite added `RIGHT` and `FULL OUTER JOIN` in version 3.39 (2022); older builds need the `LEFT JOIN ... UNION ... LEFT JOIN` emulation shown in the Try It block.

### Filtering an outer join: ON versus WHERE

With an outer join, the placement of a condition changes the result:

```sql
-- Agents and their CLOSED orders; agents with none still appear
SELECT a.name, o.file_no
FROM agents a
LEFT JOIN orders o ON o.agent_id = a.agent_id AND o.status = 'Closed';

-- Only agents who have a closed order (the WHERE turns it into an inner join)
SELECT a.name, o.file_no
FROM agents a
LEFT JOIN orders o ON o.agent_id = a.agent_id
WHERE o.status = 'Closed';
```

In the second query, unmatched agents have `o.status = NULL`, which fails the `WHERE`, so they disappear. Put conditions on the *optional* table in `ON`.

### Finding rows with no match (anti-join)

```sql
SELECT a.name
FROM agents a
LEFT JOIN orders o ON o.agent_id = a.agent_id
WHERE o.order_id IS NULL;
```

Agents who have never handled a file. The same result comes from `NOT EXISTS`, covered in the Subqueries chapter.

### Self join

A table can be joined to itself when rows relate to other rows in the same table, such as agents and their team leads:

```sql
SELECT e.name AS agent, m.name AS team_lead
FROM agents e
LEFT JOIN agents m ON m.agent_id = e.lead_id;
```

### Joining more than two tables

Joins chain left to right. Each `JOIN ... ON` adds one table:

```sql
SELECT o.file_no, a.name, s.state_name
FROM orders o
JOIN agents a ON a.agent_id = o.agent_id
JOIN states s ON s.code = o.state;
```

> **Warning:** If the join condition is not unique on one side (for example joining orders to a rates table with several rows per state), rows multiply and `SUM(premium)` is inflated. Always know the cardinality (one-to-one, one-to-many) of every join you write. Check with `COUNT(*)` before and after.

### Try It Yourself

```sql
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT, lead_id INTEGER);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, agent_id INTEGER, premium REAL, status TEXT);
INSERT INTO agents VALUES (1,'Sana',NULL),(2,'Bilal',1),(3,'Hira',1),(4,'Usman',1);
INSERT INTO orders (file_no,agent_id,premium,status) VALUES
 ('TX-1001',2,2150.00,'Closed'),('TX-1002',2,1180.00,'Open'),
 ('FL-2001',3,2645.50,'Closed'),('WY-3001',3,1425.00,'Cancelled'),
 ('FL-2002',NULL,1012.75,'Open');

-- every agent, their lead, and closed-premium total (0 for none)
SELECT a.name AS agent,
       COALESCE(m.name, '-') AS team_lead,
       COUNT(o.order_id) AS closed_files,
       COALESCE(SUM(o.premium), 0) AS closed_premium
FROM agents a
LEFT JOIN agents m ON m.agent_id = a.lead_id
LEFT JOIN orders o ON o.agent_id = a.agent_id AND o.status = 'Closed'
GROUP BY a.agent_id
ORDER BY closed_premium DESC;
```

### Quiz

1. Which join returns every agent even if they have no orders?
- [ ] `INNER JOIN`
- [x] `LEFT JOIN` from agents to orders
- [ ] `CROSS JOIN`
> Outer joins preserve unmatched rows from the specified side; agents is the left table.

2. In `agents LEFT JOIN orders ... WHERE orders.status = 'Closed'`, what happens to agents with no orders?
- [ ] They appear with NULL status
- [x] They are removed because `NULL = 'Closed'` is not true
- [ ] They cause an error
> A `WHERE` filter on the optional side converts the outer join into an inner join; move the condition into `ON`.

3. What does `CROSS JOIN` produce?
- [x] Every combination of rows from both tables
- [ ] Only matching rows
- [ ] Rows from the left table only
> A Cartesian product: m × n rows, useful for generating calendars and matrices.

### Exercises

1. **Unassigned files** — Return orders that have no matching agent (agent_id is NULL or refers to no agent).
<details><summary>Solution</summary>

```sql
SELECT o.file_no
FROM orders o
LEFT JOIN agents a ON a.agent_id = o.agent_id
WHERE a.agent_id IS NULL;
```

</details>

2. **Team lead totals** — For each team lead, total the premium of all files handled by agents reporting to them.
<details><summary>Solution</summary>

```sql
SELECT m.name AS team_lead, COALESCE(SUM(o.premium), 0) AS team_premium
FROM agents m
JOIN agents e ON e.lead_id = m.agent_id
LEFT JOIN orders o ON o.agent_id = e.agent_id
GROUP BY m.agent_id;
```

</details>

### Interview Questions

**Q: Explain the difference between INNER JOIN and LEFT JOIN with an example.**
An inner join returns only rows that match on both sides; a left join returns every row from the left table and fills the right side with NULLs where there is no match. For a weekly productivity report I left-join agents to orders so that an agent with zero files still appears with a count of 0; with an inner join that agent would vanish and the team lead would never notice the idle seat. I also mention that `COUNT(o.order_id)` rather than `COUNT(*)` is needed to get 0 rather than 1 for those agents.

**Q: Why does a filter on the right-hand table in WHERE defeat a LEFT JOIN?**
Because the `WHERE` clause runs after the join has produced its rows. Unmatched left rows carry NULLs in every right-hand column, so a predicate such as `o.status = 'Closed'` evaluates to NULL and the row is discarded, making the result identical to an inner join. The fix is to move the predicate into the `ON` clause, or to test `o.status IS NULL OR o.status = 'Closed'`. Recognising this in someone else's query is a common code-review catch.

**Q: How do you detect that a join is multiplying rows?**
Compare `COUNT(*)` of the driving table with `COUNT(*)` of the joined result; if it grew, the join key is not unique on the many side. I check uniqueness directly with `SELECT key, COUNT(*) FROM t GROUP BY key HAVING COUNT(*) > 1`. When a lookup table legitimately has several rows per key, such as a rate table with effective dates, I pick the right row first in a subquery or CTE (latest effective date) and join to that, rather than joining and aggregating the inflated result.

**Q: What is a self join used for?**
Relating rows of one table to other rows in the same table: employees to managers, an order to the previous order for the same customer, or a document version to its parent version. It is an ordinary join with two aliases of the same table. For hierarchies deeper than one level, a self join only goes one step; a recursive CTE is the tool for arbitrary depth.

## Subqueries & Set Operations

A **subquery** is a `SELECT` nested inside another statement. It can return a single value, a list, or a whole table, and it can appear in `WHERE`, `FROM`, `SELECT` or `HAVING`.

### Scalar subqueries (one value)

```sql
SELECT file_no, premium
FROM orders
WHERE premium > (SELECT AVG(premium) FROM orders);
```

The inner query runs once and returns one number; the outer query compares each row to it. A scalar subquery can also be a column: `SELECT file_no, premium - (SELECT AVG(premium) FROM orders) AS vs_avg FROM orders`.

### IN and NOT IN (a list)

```sql
SELECT name FROM agents
WHERE agent_id IN (SELECT agent_id FROM orders WHERE status = 'Cancelled');
```

`NOT IN` has a famous trap: if the subquery returns any `NULL`, the whole `NOT IN` yields no rows, because `x <> NULL` is unknown. Prefer `NOT EXISTS`.

### EXISTS and correlated subqueries

A **correlated** subquery references the outer row and is logically evaluated once per outer row:

```sql
SELECT a.name
FROM agents a
WHERE EXISTS (SELECT 1 FROM orders o
              WHERE o.agent_id = a.agent_id AND o.premium > 2500);
```

`EXISTS` stops at the first matching row, so it is efficient and NULL-safe. `NOT EXISTS` is the standard anti-join.

### Subqueries in FROM (derived tables)

```sql
SELECT state, MAX(total) AS best_month
FROM (SELECT state, substr(closed,1,7) AS month, SUM(premium) AS total
      FROM orders WHERE closed IS NOT NULL
      GROUP BY state, month) AS monthly
GROUP BY state;
```

The inner query builds a monthly table; the outer query aggregates it again. Derived tables must have an alias in most engines (SQLite is lenient, PostgreSQL and SQL Server are not). Once nesting gets two levels deep, a CTE (next level) reads better.

### Set operations combine result sets

Set operators stack two queries with the same number of compatible columns:

| Operator | Result |
|---|---|
| `UNION` | rows from both, duplicates removed |
| `UNION ALL` | rows from both, duplicates kept (faster) |
| `INTERSECT` | rows present in both |
| `EXCEPT` (`MINUS` in Oracle) | rows in the first but not the second |

```sql
SELECT file_no FROM orders_2025
UNION ALL
SELECT file_no FROM orders_2026;
```

Column names come from the first query. `ORDER BY` applies to the whole combined result and goes at the very end. Use `UNION ALL` unless you specifically need de-duplication; `UNION` has to sort or hash every row to remove duplicates.

`EXCEPT` is a neat data-validation tool: rows in the source extract that never reached the reporting table.

```sql
SELECT file_no FROM staging_orders
EXCEPT
SELECT file_no FROM orders;
```

> **Tip:** `INTERSECT` and `EXCEPT` compare whole rows including NULLs as equal, unlike `=`. Comparing two tables column-for-column with `EXCEPT` in both directions is the fastest way to prove two extracts are identical.

### Try It Yourself

```sql
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, agent_id INTEGER, premium REAL, status TEXT);
CREATE TABLE staging (file_no TEXT);
INSERT INTO agents VALUES (1,'Sana'),(2,'Bilal'),(3,'Hira'),(4,'Usman');
INSERT INTO orders (file_no,agent_id,premium,status) VALUES
 ('TX-1001',2,2150.00,'Closed'),('TX-1002',2,1180.00,'Open'),
 ('FL-2001',3,2645.50,'Closed'),('WY-3001',3,1425.00,'Cancelled'),
 ('FL-2002',1,1012.75,'Open');
INSERT INTO staging VALUES ('TX-1001'),('FL-2001'),('FL-2003'),('WY-3001');

-- 1) agents who have never had a cancellation (NOT EXISTS)
SELECT name, 'no cancellations' AS note FROM agents a
WHERE NOT EXISTS (SELECT 1 FROM orders o
                  WHERE o.agent_id = a.agent_id AND o.status = 'Cancelled')
UNION ALL
-- 2) staging files missing from orders (EXCEPT)
SELECT file_no, 'missing from orders' FROM (
  SELECT file_no FROM staging EXCEPT SELECT file_no FROM orders
);
```

### Quiz

1. Why is `NOT IN (subquery)` dangerous?
- [x] If the subquery returns a NULL, no rows are returned
- [ ] It is not supported in SQLite
- [ ] It ignores duplicates
> `x NOT IN (1, NULL)` evaluates to unknown for every x; use `NOT EXISTS`.

2. Which operator keeps duplicate rows?
- [ ] `UNION`
- [x] `UNION ALL`
- [ ] `INTERSECT`
> `UNION` de-duplicates (and pays for it); `UNION ALL` simply appends.

3. What does a correlated subquery reference?
- [ ] Only its own tables
- [x] Columns from the outer query's current row
- [ ] The previous row
> Correlation is what makes `EXISTS (... WHERE o.agent_id = a.agent_id)` work per row.

### Exercises

1. **Above-average agents** — List agents whose total premium exceeds the average total premium per agent.
<details><summary>Solution</summary>

```sql
SELECT agent_id, SUM(premium) AS total
FROM orders
GROUP BY agent_id
HAVING SUM(premium) > (
  SELECT AVG(t) FROM (SELECT SUM(premium) AS t FROM orders GROUP BY agent_id)
);
```

</details>

2. **Files in both** — Return file numbers present in both `staging` and `orders`.
<details><summary>Solution</summary>

```sql
SELECT file_no FROM staging
INTERSECT
SELECT file_no FROM orders;
```

</details>

### Interview Questions

**Q: When would you use EXISTS instead of IN?**
`EXISTS` is preferable when the subquery is correlated, when it could return NULLs, or when the list would be large: the engine can stop scanning at the first match and use an index on the correlated column. `IN` reads naturally for short static lists and for uncorrelated subqueries, and modern optimisers often rewrite an uncorrelated `IN` into a semi-join anyway. The one rule I state firmly is never `NOT IN` against a nullable column; always `NOT EXISTS`.

**Q: What is the difference between UNION and UNION ALL, and which is faster?**
`UNION` removes duplicate rows across the combined result, which requires a sort or hash over every row; `UNION ALL` appends the results with no extra work. `UNION ALL` is therefore faster and should be the default when the inputs are known to be disjoint, such as this year's and last year's order tables. If someone uses `UNION` by habit on 5 million rows, the query can take minutes for no benefit.

**Q: How would you compare two tables to prove they hold the same data?**
Run `EXCEPT` in both directions and check both results are empty: `(SELECT * FROM a EXCEPT SELECT * FROM b)` and `(SELECT * FROM b EXCEPT SELECT * FROM a)`. Also compare `COUNT(*)`, because `EXCEPT` is a set operation and would miss a row that appears twice in one table and once in the other. I did exactly this when validating rate-matrix uploads: the old matrix and the new extract had to match row-for-row before the calculator went live.

## String, Date & Numeric Functions

Report queries spend much of their time reshaping values: trimming file numbers, pulling the year out of a date, rounding money. SQL provides built-in functions for these tasks; the names vary slightly across engines, so the tables below list SQLite first and note the others.

### String functions

| SQLite | Purpose | Elsewhere |
|---|---|---|
| `length(s)` | number of characters | `LEN` in T-SQL |
| `upper(s)`, `lower(s)` | change case | same |
| `trim(s)`, `ltrim`, `rtrim` | strip spaces (or given chars) | same |
| `substr(s, start, len)` | substring, 1-based | `SUBSTRING` in T-SQL/MySQL |
| `instr(s, sub)` | position of `sub`, 0 if absent | `CHARINDEX` (T-SQL), `POSITION` (PostgreSQL) |
| `replace(s, from, to)` | replace all occurrences | same |
| `s \|\| t` | concatenate | `CONCAT()` MySQL, `+` T-SQL |
| `printf('%08.2f', x)` | formatted string (3.38+ also `format()`) | `FORMAT` in MySQL/T-SQL |

```sql
SELECT file_no,
       substr(file_no, 1, 2)          AS state_code,
       CAST(substr(file_no, 4) AS INTEGER) AS seq,
       upper(trim(county))            AS county_clean,
       replace(file_no, '-', '')      AS compact
FROM orders;
```

`substr(file_no, 4)` with no length means *from position 4 to the end*. `CAST(... AS INTEGER)` turns the text `'1001'` into a number so it sorts numerically.

### Date and time functions

SQLite has no native date type; it stores dates as ISO-8601 text, Julian-day reals or Unix integers and provides functions to work with them:

```sql
SELECT date('now')                               AS today,
       strftime('%Y-%m', closed)                 AS ym,
       date(closed, '+30 days')                  AS follow_up,
       date(closed, 'start of month', '+1 month', '-1 day') AS month_end,
       julianday('2026-03-31') - julianday(opened) AS days_open,
       CAST(strftime('%w', closed) AS INTEGER)   AS weekday_0_sun
FROM orders;
```

`strftime` format codes: `%Y` year, `%m` month, `%d` day, `%W` ISO week, `%w` weekday (0 = Sunday), `%H:%M:%S` time. Modifiers chain left to right, which is how `month_end` is computed.

| Task | SQLite | PostgreSQL | SQL Server |
|---|---|---|---|
| current date | `date('now')` | `CURRENT_DATE` | `CAST(GETDATE() AS date)` |
| add 30 days | `date(d,'+30 days')` | `d + INTERVAL '30 days'` | `DATEADD(day, 30, d)` |
| year part | `strftime('%Y', d)` | `EXTRACT(YEAR FROM d)` | `YEAR(d)` |
| days between | `julianday(b) - julianday(a)` | `b - a` | `DATEDIFF(day, a, b)` |

### Numeric functions

```sql
SELECT premium,
       round(premium, 2)          AS cents,
       round(premium / 1000) * 1000 AS nearest_k,
       abs(premium - 2000)        AS distance,
       premium % 100              AS remainder,
       CAST(premium AS INTEGER)   AS truncated
FROM orders;
```

Integer division is a classic trap: in SQLite `7 / 2` is `3` because both operands are integers, while `7 / 2.0` is `3.5`. PostgreSQL and SQL Server behave the same; MySQL returns `3.5000`. When computing a rate, cast at least one side: `premium * 1000.0 / liability`.

### Type conversion and COALESCE

`CAST(x AS type)` converts explicitly. `COALESCE(a, b, c)` returns the first non-NULL argument and is the standard way to supply defaults: `COALESCE(closed, 'open')`. `NULLIF(a, b)` returns `NULL` when `a = b`, which protects against division by zero: `premium / NULLIF(liability, 0)`.

> **Tip:** Keep formatting (currency symbols, thousands separators) out of the database layer whenever you can. Return numbers and let Excel, Power BI or the report template format them; formatted strings cannot be summed later.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, county TEXT,
                     liability REAL, premium REAL, opened TEXT, closed TEXT);
INSERT INTO orders (file_no,county,liability,premium,opened,closed) VALUES
 ('TX-1001',' harris ',350000,2150.00,'2026-02-10','2026-03-04'),
 ('TX-1002','Dallas',280000,1180.00,'2026-02-25',NULL),
 ('FL-2001','Miami-Dade',510000,2645.50,'2026-01-30','2026-03-02'),
 ('FL-2002','Orange',0,1012.75,'2026-03-05','2026-03-15');

SELECT file_no,
       substr(file_no, 1, 2)                               AS st,
       upper(trim(county))                                 AS county,
       strftime('%Y-%m', opened)                           AS opened_ym,
       CAST(julianday(COALESCE(closed, date('2026-03-31')))
            - julianday(opened) AS INTEGER)                AS days_open,
       date(opened, 'start of month', '+1 month', '-1 day') AS month_end,
       round(premium * 1000.0 / NULLIF(liability, 0), 2)   AS rate_per_k,
       printf('$%.2f', premium)                            AS premium_fmt
FROM orders;
```

### Quiz

1. What does `substr('TX-1001', 4)` return in SQLite?
- [ ] `TX-`
- [x] `1001`
- [ ] `-1001`
> Positions are 1-based; starting at 4 with no length runs to the end.

2. What is `7 / 2` in SQLite?
- [x] 3
- [ ] 3.5
- [ ] 4
> Both operands are integers, so the division is integer division.

3. What does `NULLIF(liability, 0)` do?
- [ ] Replaces NULL with 0
- [x] Returns NULL when liability is 0
- [ ] Raises an error on 0
> It turns a zero denominator into NULL so the division yields NULL instead of failing.

### Exercises

1. **Quarter label** — Produce a label like `2026-Q1` from the `opened` date.
<details><summary>Solution</summary>

```sql
SELECT file_no,
       strftime('%Y', opened) || '-Q' ||
       ((CAST(strftime('%m', opened) AS INTEGER) + 2) / 3) AS quarter
FROM orders;
```

</details>

2. **Ageing buckets** — Compute days open as of 2026-03-31 for open files only, and show the result as text `"<n> days"`.
<details><summary>Solution</summary>

```sql
SELECT file_no,
       CAST(julianday('2026-03-31') - julianday(opened) AS INTEGER) || ' days' AS age
FROM orders
WHERE closed IS NULL;
```

</details>

### Interview Questions

**Q: How does SQLite store dates, and what are the implications?**
SQLite has no DATE type; it stores whatever you give it, typically ISO-8601 text like `2026-03-04`, a Julian-day REAL, or a Unix-epoch INTEGER. Functions such as `date()`, `strftime()` and `julianday()` interpret those. The implication is discipline: store one format consistently (ISO text sorts and compares correctly) and never mix `03/04/2026` strings into the same column, or comparisons silently break. In PostgreSQL or SQL Server I would use a real `date` or `datetime2` column and let the type system enforce it.

**Q: Why should you avoid applying functions to indexed columns in WHERE?**
Because `WHERE strftime('%Y', closed) = '2026'` has to compute the function for every row and cannot use an index on `closed`; the predicate is not *sargable*. Rewrite it as a range: `WHERE closed >= '2026-01-01' AND closed < '2027-01-01'`, which seeks straight to the range in the index. The same applies to `UPPER(name) = 'SANA'`; use a case-insensitive collation or an expression index instead.

**Q: How do you safely divide in SQL when the denominator may be zero?**
Use `NULLIF(denominator, 0)`, which turns zero into NULL and makes the division return NULL instead of raising an error (or, in SQLite, returning NULL silently for zero anyway). Then decide explicitly what the report should show for that case, usually `COALESCE(..., 0)` or leaving it blank. I also cast one operand to a real number so integer division does not truncate a rate of 0.7 down to 0.

## CASE Expressions

`CASE` is SQL's if/else. It is an **expression**, so it can appear anywhere a value can: in `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY` and inside aggregates. It lets you categorise, pivot and conditionally count without leaving SQL.

### Searched CASE

```sql
SELECT file_no, liability,
       CASE
         WHEN liability >= 500000 THEN 'Jumbo'
         WHEN liability >= 250000 THEN 'Standard'
         WHEN liability > 0       THEN 'Small'
         ELSE 'Unknown'
       END AS band
FROM orders;
```

Conditions are tested top to bottom; the first true `WHEN` wins, so the order matters. If no `WHEN` matches and there is no `ELSE`, the result is `NULL`.

### Simple CASE

When you compare a single expression to constants, the shorter form reads well:

```sql
SELECT file_no,
       CASE product
         WHEN 'Owner'  THEN 'OP'
         WHEN 'Lender' THEN 'LP'
         WHEN 'Both'   THEN 'OP+LP'
         ELSE product
       END AS product_code
FROM orders;
```

Simple `CASE` uses `=` internally, so it cannot match `NULL`; use the searched form with `IS NULL` for that.

### Conditional aggregation (the COUNTIFS pattern)

Wrapping `CASE` in an aggregate produces one column per condition in a single pass over the table:

```sql
SELECT state,
       SUM(CASE WHEN status = 'Closed'    THEN 1 ELSE 0 END) AS closed,
       SUM(CASE WHEN status = 'Open'      THEN 1 ELSE 0 END) AS open,
       SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled,
       SUM(CASE WHEN status = 'Closed'    THEN premium END)  AS closed_premium
FROM orders
GROUP BY state;
```

In `closed_premium` there is no `ELSE`, so non-closed rows contribute `NULL`, which `SUM` ignores. This is the standard way to build a wide status report from a long table, and it is exactly how you pivot in engines without a `PIVOT` keyword.

### CASE in WHERE and ORDER BY

```sql
-- custom sort: Open first, then Closed, then everything else
SELECT file_no, status
FROM orders
ORDER BY CASE status WHEN 'Open' THEN 1 WHEN 'Closed' THEN 2 ELSE 3 END, file_no;
```

Business ordering that is not alphabetical (statuses, priority levels, weekday names) is the classic use.

### Shortcuts: IIF, COALESCE, NULLIF

SQLite 3.32+, SQL Server and MySQL support `IIF(cond, a, b)` as a two-branch `CASE`. `COALESCE(x, 0)` is `CASE WHEN x IS NOT NULL THEN x ELSE 0 END`. `NULLIF(a, b)` is `CASE WHEN a = b THEN NULL ELSE a END`. Use the shortcut when it is clearer and full `CASE` when there are three or more branches.

| Need | Write |
|---|---|
| default for NULL | `COALESCE(col, default)` |
| two-way branch | `IIF(cond, a, b)` |
| bucket / band | searched `CASE` |
| pivot counts | `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` |

> **Interview note:** "Write a query that shows closed, open and cancelled counts per state as three columns" is a top-five analyst question. Conditional aggregation with `CASE` is the expected answer; mentioning that SQL Server's `PIVOT` does the same thing earns bonus points.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT,
                     product TEXT, liability REAL, premium REAL, status TEXT);
INSERT INTO orders (file_no,state,product,liability,premium,status) VALUES
 ('TX-1001','Texas','Owner',350000,2150.00,'Closed'),
 ('TX-1002','Texas','Lender',280000,1180.00,'Open'),
 ('TX-1003','Texas','Both',620000,3510.00,'Closed'),
 ('FL-2001','Florida','Owner',510000,2645.50,'Closed'),
 ('FL-2002','Florida','Lender',225000,1012.75,'Cancelled'),
 ('WY-3001','Wyoming','Both',190000,1425.00,'Open'),
 ('WY-3002','Wyoming','Owner',90000,610.00,NULL);

SELECT state,
       SUM(CASE WHEN status = 'Closed'    THEN 1 ELSE 0 END) AS closed,
       SUM(CASE WHEN status = 'Open'      THEN 1 ELSE 0 END) AS open,
       SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled,
       SUM(CASE WHEN status IS NULL       THEN 1 ELSE 0 END) AS unknown,
       SUM(CASE WHEN liability >= 500000  THEN 1 ELSE 0 END) AS jumbo_files,
       ROUND(SUM(CASE WHEN status = 'Closed' THEN premium END), 2) AS closed_premium
FROM orders
GROUP BY state
ORDER BY CASE state WHEN 'Texas' THEN 1 WHEN 'Florida' THEN 2 ELSE 9 END;
```

### Quiz

1. In a searched CASE, which WHEN branch is used when several conditions are true?
- [x] The first true one, top to bottom
- [ ] The last true one
- [ ] All of them, concatenated
> Evaluation stops at the first satisfied `WHEN`.

2. What does a CASE with no ELSE return when nothing matches?
- [ ] 0
- [ ] An empty string
- [x] NULL
> The implicit `ELSE` is `ELSE NULL`.

3. Which expression counts cancelled rows inside a GROUP BY?
- [x] `SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END)`
- [ ] `COUNT(status = 'Cancelled')`
- [ ] `COUNT(*) WHERE status = 'Cancelled'`
> `COUNT` of a boolean counts all non-NULL results (both true and false); the CASE sum counts only matches.

### Exercises

1. **Premium bands** — Count files per band where bands are `< 1500`, `1500–2499`, `>= 2500`.
<details><summary>Solution</summary>

```sql
SELECT CASE WHEN premium < 1500 THEN 'A: <1500'
            WHEN premium < 2500 THEN 'B: 1500-2499'
            ELSE 'C: 2500+' END AS band,
       COUNT(*) AS files
FROM orders
GROUP BY band
ORDER BY band;
```

</details>

2. **Close rate** — For each state, compute closed files divided by all non-cancelled files as a percentage.
<details><summary>Solution</summary>

```sql
SELECT state,
       ROUND(100.0 * SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END)
             / NULLIF(SUM(CASE WHEN status IS NULL OR status <> 'Cancelled' THEN 1 ELSE 0 END), 0), 1) AS close_rate_pct
FROM orders
GROUP BY state;
```

</details>

### Interview Questions

**Q: How do you pivot rows into columns in SQL?**
With conditional aggregation: group by the row key and write one `SUM(CASE WHEN category = 'X' THEN value END)` per desired column. It is portable to every engine and runs in a single pass. SQL Server and Oracle also have a `PIVOT` operator, and PostgreSQL has `crosstab` in the tablefunc extension, but they require the column list to be known in advance just like `CASE` does. For a dynamic column list you generate the SQL text from a query of the distinct categories, or leave the pivoting to Power BI.

**Q: What is the difference between simple and searched CASE?**
Simple `CASE expr WHEN value THEN ...` compares one expression for equality against constants; searched `CASE WHEN condition THEN ...` evaluates arbitrary boolean conditions in each branch. The simple form is shorter for code mapping, but because it uses `=`, it can never match `NULL`, so a `WHEN NULL` branch is dead code. I use the searched form whenever ranges, multiple columns or NULL tests are involved.

**Q: Is CASE evaluated lazily?**
Branches are evaluated in order and evaluation stops at the first true condition, so later branches are not computed. That lets `CASE WHEN liability = 0 THEN NULL ELSE premium / liability END` avoid dividing by zero. One caveat: some engines evaluate aggregate arguments regardless of the branch, so `CASE WHEN COUNT(*) > 0 THEN SUM(x) / COUNT(*) END` is safe, but relying on CASE to guard against errors in constant-folded expressions can differ across engines.

## INSERT, UPDATE & DELETE

`SELECT` reads data. The three **DML** (Data Manipulation Language) statements change it. Each one can touch many rows at once, which is powerful and dangerous in equal measure.

### INSERT

```sql
INSERT INTO orders (file_no, state, premium, status)
VALUES ('TX-1010', 'Texas', 1875.00, 'Open'),
       ('TX-1011', 'Texas', 2210.50, 'Open');
```

List the columns explicitly; columns you leave out receive their `DEFAULT` or `NULL`. An `INTEGER PRIMARY KEY` in SQLite is auto-assigned when omitted (PostgreSQL uses `SERIAL`/`IDENTITY`, MySQL `AUTO_INCREMENT`, SQL Server `IDENTITY`).

You can also insert the result of a query, which is how staging tables are loaded into reporting tables:

```sql
INSERT INTO orders (file_no, state, premium, status)
SELECT file_no, state, premium, 'Open'
FROM staging
WHERE file_no NOT IN (SELECT file_no FROM orders WHERE file_no IS NOT NULL);
```

### UPDATE

```sql
UPDATE orders
SET status = 'Closed',
    closed = date('now')
WHERE file_no = 'TX-1010';
```

Every row matching `WHERE` is changed. **An UPDATE with no WHERE changes every row in the table.** Assignments in `SET` can reference the row's current values: `SET premium = round(premium * 1.05, 2)`.

Updating from another table (correlated update):

```sql
UPDATE orders
SET agent_id = (SELECT agent_id FROM assignments a WHERE a.file_no = orders.file_no)
WHERE file_no IN (SELECT file_no FROM assignments);
```

SQLite 3.33+ and PostgreSQL also support `UPDATE ... FROM`; SQL Server uses `UPDATE o SET ... FROM orders o JOIN ...`.

### DELETE

```sql
DELETE FROM orders WHERE status = 'Cancelled' AND opened < '2025-01-01';
```

`DELETE` removes whole rows. Like `UPDATE`, without `WHERE` it empties the table (`TRUNCATE TABLE` does the same faster in other engines; SQLite optimises the bare `DELETE`).

### The safe workflow

1. Write the `WHERE` as a `SELECT COUNT(*)` first and check the number is what you expect.
2. Wrap the change in a transaction: `BEGIN; ... ; COMMIT;` (or `ROLLBACK;` if the count looks wrong).
3. In SQLite 3.35+, PostgreSQL and SQL Server (`OUTPUT`), use `RETURNING` to see exactly what changed:

```sql
UPDATE orders SET status = 'Closed' WHERE file_no = 'TX-1010'
RETURNING order_id, file_no, status;
```

### Upsert: insert or update

When a row may already exist, `INSERT ... ON CONFLICT` (SQLite 3.24+, PostgreSQL) updates instead of failing:

```sql
INSERT INTO orders (file_no, state, premium, status)
VALUES ('TX-1010', 'Texas', 1900.00, 'Open')
ON CONFLICT(file_no) DO UPDATE SET premium = excluded.premium;
```

`excluded` refers to the row that would have been inserted. This needs a `UNIQUE` constraint on `file_no`. MySQL spells it `ON DUPLICATE KEY UPDATE`; SQL Server and Oracle use `MERGE`.

| Statement | Without WHERE | Reversible? |
|---|---|---|
| `INSERT` | n/a | yes, `DELETE` the new rows |
| `UPDATE` | changes every row | only via backup or transaction rollback |
| `DELETE` | removes every row | only via backup or transaction rollback |

> **Warning:** Before running any `UPDATE` or `DELETE` on a production table, select the affected rows into a backup table: `CREATE TABLE orders_bak_20260315 AS SELECT * FROM orders WHERE <same condition>;`. It costs seconds and has saved many careers.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT UNIQUE,
                     state TEXT, premium REAL, status TEXT DEFAULT 'Open', closed TEXT);
INSERT INTO orders (file_no,state,premium) VALUES
 ('TX-1001','Texas',2150.00),('TX-1002','Texas',1180.00),('FL-2001','Florida',2645.50);

-- close one file
UPDATE orders SET status = 'Closed', closed = '2026-03-04' WHERE file_no = 'TX-1001';

-- upsert: TX-1002 exists (premium corrected), FL-2002 is new
INSERT INTO orders (file_no,state,premium) VALUES ('TX-1002','Texas',1195.00),('FL-2002','Florida',1012.75)
ON CONFLICT(file_no) DO UPDATE SET premium = excluded.premium;

-- delete cancelled (none yet) and show the result
DELETE FROM orders WHERE status = 'Cancelled';
SELECT * FROM orders ORDER BY order_id;
```

### Quiz

1. What happens if you run `UPDATE orders SET status = 'Closed';`?
- [ ] Only the first row changes
- [x] Every row in the table changes
- [ ] An error, because WHERE is required
> Without `WHERE` the statement applies to all rows; always test the condition with a `SELECT` first.

2. What does `excluded.premium` refer to in an upsert?
- [x] The value from the row that could not be inserted
- [ ] The existing value in the table
- [ ] The default value of the column
> `excluded` is the proposed row; the existing row is referenced by the table name.

3. Which statement copies rows from one table to another?
- [ ] `UPDATE ... FROM`
- [x] `INSERT INTO ... SELECT ...`
- [ ] `COPY`
> `INSERT ... SELECT` inserts every row the query returns.

### Exercises

1. **Bulk price change** — Increase premiums by 3% for open Texas files, rounded to cents.
<details><summary>Solution</summary>

```sql
UPDATE orders
SET premium = round(premium * 1.03, 2)
WHERE state = 'Texas' AND status = 'Open';
```

</details>

2. **Archive then delete** — Copy all closed files into `orders_archive` (same columns) and remove them from `orders`.
<details><summary>Solution</summary>

```sql
CREATE TABLE orders_archive AS SELECT * FROM orders WHERE 0;
INSERT INTO orders_archive SELECT * FROM orders WHERE status = 'Closed';
DELETE FROM orders WHERE status = 'Closed';
```

</details>

### Interview Questions

**Q: What is the difference between DELETE and TRUNCATE?**
`DELETE` is DML: it removes rows one by one (optionally filtered by `WHERE`), fires row triggers, is fully logged and can be rolled back inside a transaction. `TRUNCATE` is DDL in most engines: it deallocates the table's pages, cannot take a `WHERE`, resets identity counters, is minimally logged and is much faster on large tables; in SQL Server it still rolls back inside a transaction, in MySQL it does not. SQLite has no `TRUNCATE`; a `DELETE` with no `WHERE` uses an internal truncate optimisation.

**Q: How do you implement "insert if new, otherwise update"?**
With an upsert: SQLite and PostgreSQL use `INSERT ... ON CONFLICT (key) DO UPDATE SET col = excluded.col`, MySQL uses `INSERT ... ON DUPLICATE KEY UPDATE`, and SQL Server or Oracle use `MERGE`. It requires a unique constraint on the conflict key. The atomic form beats a `SELECT` followed by `INSERT` or `UPDATE` because two concurrent sessions can both see "not found" and then one fails with a duplicate-key error.

**Q: How would you safely update 50,000 rows in a production table?**
First run the `WHERE` as a `SELECT COUNT(*)` and spot-check a sample; back up the affected rows into a dated table; then run the update inside a transaction and verify the row count reported before committing. For very large updates I batch in chunks of a few thousand keyed on the primary key, so each transaction is short, locks are held briefly and replication or log growth stays manageable. Finally I keep the script in version control with the ticket number so the change is auditable.

# LEVEL: Advanced

## CTEs & Recursive CTEs

A **Common Table Expression** (CTE) is a named, temporary result set defined with `WITH` at the top of a query. It does the same job as a derived table in `FROM`, but reads top-down like a script instead of inside-out.

```sql
WITH monthly AS (
  SELECT state, substr(closed, 1, 7) AS month, SUM(premium) AS total
  FROM orders
  WHERE closed IS NOT NULL
  GROUP BY state, month
)
SELECT state, MAX(total) AS best_month_total
FROM monthly
GROUP BY state;
```

The CTE `monthly` exists only for the duration of this statement. You can define several CTEs separated by commas, and a later CTE may reference an earlier one:

```sql
WITH closed AS (
  SELECT * FROM orders WHERE status = 'Closed'
),
per_agent AS (
  SELECT agent_id, COUNT(*) AS files, SUM(premium) AS total FROM closed GROUP BY agent_id
)
SELECT a.name, p.files, p.total
FROM per_agent p JOIN agents a ON a.agent_id = p.agent_id
ORDER BY p.total DESC;
```

### Why use CTEs?

- **Readability**: each step has a name; a reviewer reads the pipeline in order.
- **Reuse**: a CTE can be referenced more than once in the main query (for example joined to itself).
- **Testing**: replace the final `SELECT` with `SELECT * FROM per_agent` to inspect an intermediate step.

CTEs are not a performance feature. SQLite, MySQL 8 and PostgreSQL 12+ inline them like a subquery unless the CTE is referenced multiple times or marked `MATERIALIZED` (PostgreSQL) . Older PostgreSQL always materialised, which was an optimisation fence.

### CTEs with INSERT, UPDATE and DELETE

A CTE can feed a data-modification statement:

```sql
WITH dupes AS (
  SELECT MIN(order_id) AS keep_id, file_no FROM orders GROUP BY file_no HAVING COUNT(*) > 1
)
DELETE FROM orders
WHERE file_no IN (SELECT file_no FROM dupes)
  AND order_id NOT IN (SELECT keep_id FROM dupes);
```

### Recursive CTEs

`WITH RECURSIVE` lets a CTE reference itself, which is how SQL walks hierarchies and generates sequences. A recursive CTE has an **anchor** query, `UNION ALL`, and a **recursive** query that reads from the CTE:

```sql
WITH RECURSIVE chain(agent_id, name, lead_id, depth) AS (
  SELECT agent_id, name, lead_id, 0 FROM agents WHERE lead_id IS NULL   -- anchor: top of org
  UNION ALL
  SELECT a.agent_id, a.name, a.lead_id, c.depth + 1                     -- recursive step
  FROM agents a JOIN chain c ON a.lead_id = c.agent_id
)
SELECT printf('%*s%s', depth * 2, '', name) AS org_chart FROM chain;
```

The engine runs the anchor, then repeatedly runs the recursive part against the rows produced in the previous round until a round produces nothing. `printf('%*s', n, '')` pads with `n` spaces to indent by depth.

Generating a series is the other everyday use, for example every day in a month so that days with zero closings still appear on a chart:

```sql
WITH RECURSIVE days(d) AS (
  SELECT date('2026-03-01')
  UNION ALL
  SELECT date(d, '+1 day') FROM days WHERE d < '2026-03-31'
)
SELECT d, COUNT(o.order_id) AS closings
FROM days LEFT JOIN orders o ON o.closed = days.d
GROUP BY d;
```

| Engine | Keyword |
|---|---|
| SQLite, PostgreSQL, MySQL 8 | `WITH RECURSIVE` |
| SQL Server, Oracle | plain `WITH` (recursion detected automatically) |

> **Warning:** A recursive CTE with no terminating condition loops forever. Always include a `WHERE` in the recursive part (or `LIMIT` in SQLite; `OPTION (MAXRECURSION n)` in SQL Server, default 100).

### Try It Yourself

```sql
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT, lead_id INTEGER);
INSERT INTO agents VALUES (1,'Ali (Team Lead)',NULL),(2,'Sana',1),(3,'Bilal',1),
                          (4,'Hira',2),(5,'Usman',2),(6,'Zara',3);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, agent_id INTEGER, premium REAL);
INSERT INTO orders (agent_id,premium) VALUES (4,2150),(4,1180),(5,2645.5),(6,1425),(2,900),(3,1012.75);

WITH RECURSIVE chain(agent_id, name, depth, path) AS (
  SELECT agent_id, name, 0, name FROM agents WHERE lead_id IS NULL
  UNION ALL
  SELECT a.agent_id, a.name, c.depth + 1, c.path || ' > ' || a.name
  FROM agents a JOIN chain c ON a.lead_id = c.agent_id
),
totals AS (
  SELECT agent_id, SUM(premium) AS own_premium FROM orders GROUP BY agent_id
)
SELECT printf('%*s%s', depth * 2, '', name) AS org_chart,
       COALESCE(own_premium, 0) AS own_premium,
       path
FROM chain LEFT JOIN totals USING (agent_id)
ORDER BY path;
```

### Quiz

1. What are the two parts of a recursive CTE?
- [x] An anchor query and a recursive query joined by UNION ALL
- [ ] A SELECT and a WHERE
- [ ] A base table and an index
> The anchor seeds the result; the recursive member is re-run until it returns no rows.

2. Can a CTE be referenced twice in the same statement?
- [x] Yes
- [ ] No, only once
- [ ] Only if it is recursive
> That reuse is one of the main reasons to prefer a CTE over a derived table.

3. Does defining a CTE make a query faster?
- [ ] Always
- [x] Not by itself; most engines inline it like a subquery
- [ ] Only in SQLite
> CTEs are about readability; the planner treats an inlined CTE just like a subquery.

### Exercises

1. **Level totals** — Using the Try It tables, return the total premium handled at each `depth` of the org chart.
<details><summary>Solution</summary>

```sql
WITH RECURSIVE chain(agent_id, depth) AS (
  SELECT agent_id, 0 FROM agents WHERE lead_id IS NULL
  UNION ALL
  SELECT a.agent_id, c.depth + 1 FROM agents a JOIN chain c ON a.lead_id = c.agent_id
)
SELECT depth, COALESCE(SUM(o.premium), 0) AS premium
FROM chain LEFT JOIN orders o USING (agent_id)
GROUP BY depth;
```

</details>

2. **Number series** — Generate the numbers 1 to 10 with a recursive CTE.
<details><summary>Solution</summary>

```sql
WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x + 1 FROM n WHERE x < 10)
SELECT x FROM n;
```

</details>

### Interview Questions

**Q: What is the difference between a CTE and a temporary table?**
A CTE is scoped to a single statement, has no storage of its own and is usually inlined by the optimiser, so it behaves like a named subquery. A temporary table is a real table that lives for the session, can be indexed, can have statistics, and can be reused across many statements. I reach for a CTE for readability inside one query, and for a temp table when an intermediate result is large, reused several times, or needs an index to make the following joins fast.

**Q: How does a recursive CTE terminate, and what happens if it does not?**
Each iteration runs the recursive member against only the rows produced in the previous iteration; when an iteration produces zero rows the recursion ends. If the data contains a cycle (an agent whose lead chain loops back) or the `WHERE` condition never fails, it runs until a recursion limit is hit: SQL Server stops at 100 levels by default with an error, PostgreSQL and SQLite run until memory or a `LIMIT` stops them. In hierarchies I guard by tracking the path and adding `WHERE path NOT LIKE '%' || a.agent_id || '%'`, or by capping depth.

**Q: When is a CTE an optimisation fence, and why does it matter?**
In PostgreSQL before version 12 every CTE was materialised: computed fully into a temporary result before the outer query ran, so predicates from the outer query could not be pushed into it and indexes were unusable. Since 12 the planner inlines single-reference CTEs unless you write `WITH x AS MATERIALIZED (...)`. It matters because a query that filters a huge CTE down to one state could scan the entire table in the old behaviour; knowing the version tells you whether the rewrite is needed.

## Window Functions

A **window function** computes a value for each row using a set of related rows (its *window*) without collapsing them the way `GROUP BY` does. Every row stays in the result and gains an extra column: a rank, a running total, the previous row's value.

```sql
SELECT file_no, state, premium,
       SUM(premium) OVER (PARTITION BY state)                 AS state_total,
       ROUND(100.0 * premium / SUM(premium) OVER (PARTITION BY state), 1) AS pct_of_state
FROM orders;
```

`OVER (...)` turns an aggregate into a window function. `PARTITION BY state` splits rows into groups (like `GROUP BY`), but each row keeps its identity. SQLite has supported window functions since 3.25 (2018).

### Ranking functions

```sql
SELECT file_no, premium,
       ROW_NUMBER() OVER (ORDER BY premium DESC) AS rn,
       RANK()       OVER (ORDER BY premium DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY premium DESC) AS drnk,
       NTILE(4)     OVER (ORDER BY premium DESC) AS quartile
FROM orders;
```

| Function | Ties | Gaps after ties | Example on 100, 90, 90, 80 |
|---|---|---|---|
| `ROW_NUMBER()` | broken arbitrarily | – | 1, 2, 3, 4 |
| `RANK()` | same rank | yes | 1, 2, 2, 4 |
| `DENSE_RANK()` | same rank | no | 1, 2, 2, 3 |
| `NTILE(n)` | – | – | buckets rows into n groups |

Add `PARTITION BY state` inside `OVER` to restart the ranking per state; that is how **top-N per group** works:

```sql
SELECT * FROM (
  SELECT file_no, state, premium,
         ROW_NUMBER() OVER (PARTITION BY state ORDER BY premium DESC) AS rn
  FROM orders
) WHERE rn <= 2;
```

Window functions cannot go in `WHERE` (they are evaluated after it), hence the subquery.

### Running totals and frames

`ORDER BY` inside `OVER` creates a **frame**: by default *from the first row of the partition to the current row*. That is a running total:

```sql
SELECT closed, premium,
       SUM(premium) OVER (ORDER BY closed, order_id) AS running_total,
       AVG(premium) OVER (ORDER BY closed ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg_3
FROM orders WHERE closed IS NOT NULL;
```

`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` is a three-row moving window. The default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which treats rows with equal `ORDER BY` values as peers and includes all of them, so ties on `closed` get the same running total. Use `ROWS` when you want strict row-by-row behaviour, and include a tiebreaker such as `order_id`.

### LAG and LEAD

```sql
SELECT month, total,
       LAG(total)  OVER (ORDER BY month)        AS prev_month,
       total - LAG(total) OVER (ORDER BY month) AS change,
       LEAD(total, 1, 0) OVER (ORDER BY month)  AS next_month
FROM monthly_totals;
```

`LAG(col, offset, default)` reads the previous row's value; `LEAD` reads the next. Month-over-month change, gap detection and "days since last order" all start with `LAG`. `FIRST_VALUE`, `LAST_VALUE` and `NTH_VALUE` return values from the frame edges.

### The WINDOW clause

When several columns share the same window, name it once:

```sql
SELECT file_no, premium,
       RANK() OVER w AS rnk, SUM(premium) OVER w AS running
FROM orders
WINDOW w AS (PARTITION BY state ORDER BY premium DESC);
```

> **Interview note:** "Find the top 2 files per state", "compute a running total" and "compare each month to the previous month" are the three window-function questions you will be asked. Know `ROW_NUMBER` with `PARTITION BY`, `SUM() OVER (ORDER BY)`, and `LAG` cold.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT, premium REAL, closed TEXT);
INSERT INTO orders (file_no,state,premium,closed) VALUES
 ('TX-1001','Texas',2150.00,'2026-03-04'),('TX-1002','Texas',1180.00,'2026-03-06'),
 ('TX-1003','Texas',2510.00,'2026-03-11'),('TX-1004','Texas',2510.00,'2026-03-12'),
 ('FL-2001','Florida',2645.50,'2026-03-02'),('FL-2002','Florida',1012.75,'2026-03-15'),
 ('FL-2003','Florida',3105.00,'2026-03-20'),('WY-3001','Wyoming',1425.00,'2026-03-09');

SELECT state, file_no, premium, closed,
       ROW_NUMBER() OVER w                              AS rn,
       RANK()       OVER w                              AS rnk,
       DENSE_RANK() OVER w                              AS drnk,
       SUM(premium) OVER (PARTITION BY state ORDER BY closed, order_id) AS running_state_total,
       LAG(closed)  OVER (PARTITION BY state ORDER BY closed)          AS prev_close,
       CAST(julianday(closed) - julianday(LAG(closed) OVER (PARTITION BY state ORDER BY closed)) AS INTEGER) AS days_since_prev
FROM orders
WINDOW w AS (PARTITION BY state ORDER BY premium DESC)
ORDER BY state, rn;
```

### Quiz

1. How does `RANK()` differ from `DENSE_RANK()` after a tie?
- [x] `RANK` skips numbers after a tie; `DENSE_RANK` does not
- [ ] They are identical
- [ ] `DENSE_RANK` breaks ties arbitrarily
> On 100, 90, 90, 80: RANK gives 1,2,2,4 and DENSE_RANK gives 1,2,2,3.

2. What does `SUM(premium) OVER (ORDER BY closed)` compute?
- [ ] The grand total on every row
- [x] A running total up to and including each row's peers
- [ ] The total per closed date only
> An `ORDER BY` in `OVER` defaults to a frame from the partition start to the current row (and its ties).

3. Why can't a window function be used directly in WHERE?
- [x] Windows are evaluated after WHERE, so the value does not exist yet
- [ ] Syntax forbids OVER anywhere except SELECT
- [ ] It can, in every engine
> Wrap the query in a subquery or CTE and filter on the computed column.

### Exercises

1. **Top file per state** — Return the single highest-premium file in each state.
<details><summary>Solution</summary>

```sql
SELECT state, file_no, premium FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY state ORDER BY premium DESC, order_id) AS rn
  FROM orders
) WHERE rn = 1;
```

</details>

2. **Share of state** — Show each file's premium as a percentage of its state's total, rounded to one decimal.
<details><summary>Solution</summary>

```sql
SELECT file_no, state,
       ROUND(100.0 * premium / SUM(premium) OVER (PARTITION BY state), 1) AS pct
FROM orders;
```

</details>

### Interview Questions

**Q: What is the difference between GROUP BY and a window function?**
`GROUP BY` collapses each group into one output row, so you lose the individual rows; a window function computes an aggregate over a partition but returns it alongside every original row. If I need a state total next to each file, or the share of each file in its state, a window function does it in one pass, whereas with `GROUP BY` I would have to aggregate and then join back to the detail rows. Both can appear in the same query, in which case the window runs over the grouped result.

**Q: Explain ROWS versus RANGE in a window frame.**
`ROWS` counts physical rows: `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` is exactly three rows. `RANGE` groups peers with equal `ORDER BY` values, so the default frame `RANGE UNBOUNDED PRECEDING` includes all rows tied with the current one, which makes a running total jump in steps when dates repeat. For a strict cumulative sum I write `ROWS UNBOUNDED PRECEDING` and add a unique tiebreaker to the `ORDER BY`; for "everything up to this date inclusive" `RANGE` is actually the correct semantics.

**Q: How would you find the previous order for each customer and the gap in days?**
Use `LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)` to pull the previous date onto each row, then subtract: in SQLite `julianday(order_date) - julianday(prev)`, in PostgreSQL a plain date subtraction, in SQL Server `DATEDIFF(day, prev, order_date)`. The first order per customer gets NULL, which I leave as NULL rather than zero because "no gap" and "zero-day gap" mean different things in a churn analysis.

**Q: Why is ROW_NUMBER the right tool for de-duplication?**
Because it assigns a unique sequence within each partition even when rows are identical, unlike `RANK`, which would give duplicates the same number. `ROW_NUMBER() OVER (PARTITION BY file_no ORDER BY updated_at DESC)` marks the newest copy as 1; deleting or filtering `rn > 1` leaves exactly one row per key. The `ORDER BY` inside the window is where the business rule lives: keep the latest, keep the one with the fewest NULLs, or keep the lowest id.

## Data Types, Constraints & CREATE TABLE

So far the tables have been given to you. Designing them is **DDL** (Data Definition Language): `CREATE`, `ALTER` and `DROP`. A good table definition documents the data and refuses bad rows before they reach a report.

```sql
CREATE TABLE orders (
  order_id   INTEGER PRIMARY KEY,
  file_no    TEXT    NOT NULL UNIQUE,
  state      TEXT    NOT NULL CHECK (length(state) = 2),
  product    TEXT    NOT NULL CHECK (product IN ('Owner','Lender','Both')),
  liability  REAL    NOT NULL CHECK (liability > 0),
  premium    REAL    NOT NULL DEFAULT 0,
  status     TEXT    NOT NULL DEFAULT 'Open',
  agent_id   INTEGER REFERENCES agents(agent_id),
  opened     TEXT    NOT NULL DEFAULT (date('now')),
  closed     TEXT,
  CHECK (closed IS NULL OR closed >= opened)
);
```

### Data types

SQLite uses **type affinity**: a column has a preferred type but will store almost anything. The five storage classes are `NULL`, `INTEGER`, `REAL`, `TEXT` and `BLOB`. Declaring `VARCHAR(50)` or `DATE` is accepted and mapped to an affinity (`TEXT` and `NUMERIC` respectively) but the length is not enforced. Since SQLite 3.37 you can add `STRICT` after the column list to enforce types.

| Concept | SQLite | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|---|
| integer | `INTEGER` | `INTEGER`, `BIGINT` | `INT`, `BIGINT` | `INT`, `BIGINT` |
| money | `REAL` (or integer cents) | `NUMERIC(12,2)` | `DECIMAL(12,2)` | `DECIMAL(12,2)` |
| text | `TEXT` | `TEXT`, `VARCHAR(n)` | `NVARCHAR(n)` | `VARCHAR(n)` |
| date | `TEXT` ISO-8601 | `DATE`, `TIMESTAMP` | `DATE`, `DATETIME2` | `DATE`, `DATETIME` |
| boolean | `INTEGER` 0/1 | `BOOLEAN` | `BIT` | `TINYINT(1)` |
| auto id | `INTEGER PRIMARY KEY` | `GENERATED ALWAYS AS IDENTITY` | `INT IDENTITY(1,1)` | `INT AUTO_INCREMENT` |

Store money as `DECIMAL`/`NUMERIC` in real databases; floating point cannot represent `0.10` exactly, and summed premiums will drift by cents. In SQLite either store integer cents or accept `REAL` and round on output.

### Constraints

| Constraint | Guarantees |
|---|---|
| `NOT NULL` | a value is always present |
| `UNIQUE` | no two rows share the value (NULLs are allowed, and multiple NULLs are permitted) |
| `PRIMARY KEY` | unique and (in most engines) not null; one per table; may be composite |
| `CHECK (expr)` | expression is true (or NULL) for every row |
| `DEFAULT` | value used when the column is omitted |
| `FOREIGN KEY ... REFERENCES` | value must exist in the parent table |

Composite keys and named constraints:

```sql
CREATE TABLE rate_matrix (
  state      TEXT NOT NULL,
  product    TEXT NOT NULL,
  band_from  INTEGER NOT NULL,
  band_to    INTEGER NOT NULL,
  rate_per_k REAL NOT NULL,
  CONSTRAINT pk_rate PRIMARY KEY (state, product, band_from),
  CONSTRAINT ck_band CHECK (band_to > band_from)
);
```

### Foreign keys and cascading

```sql
CREATE TABLE endorsements (
  endorsement_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  fee  REAL NOT NULL DEFAULT 0
);
```

`ON DELETE CASCADE` deletes endorsements when their order is deleted; alternatives are `RESTRICT` (refuse), `SET NULL` and `SET DEFAULT`. **SQLite does not enforce foreign keys unless you run `PRAGMA foreign_keys = ON;` on each connection.** Other engines enforce them always.

### ALTER and DROP

```sql
ALTER TABLE orders ADD COLUMN county TEXT;
ALTER TABLE orders RENAME COLUMN county TO county_name;
ALTER TABLE orders DROP COLUMN county_name;      -- SQLite 3.35+
DROP TABLE IF EXISTS staging;
```

SQLite's `ALTER TABLE` is limited (no changing a column's type or adding a constraint); the documented workaround is create-new-table, copy, drop, rename inside a transaction. PostgreSQL and SQL Server support `ALTER COLUMN` and `ADD CONSTRAINT`.

> **Tip:** Write `CREATE TABLE` scripts into version control and treat schema changes as migrations with a number and a date. Being able to rebuild an empty copy of the reporting database from scripts is what makes a test environment possible.

### Try It Yourself

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE orders (
  order_id  INTEGER PRIMARY KEY,
  file_no   TEXT NOT NULL UNIQUE,
  state     TEXT NOT NULL CHECK (length(state) = 2),
  product   TEXT NOT NULL CHECK (product IN ('Owner','Lender','Both')),
  liability REAL NOT NULL CHECK (liability > 0),
  premium   REAL NOT NULL DEFAULT 0,
  agent_id  INTEGER REFERENCES agents(agent_id) ON DELETE SET NULL,
  opened    TEXT NOT NULL DEFAULT (date('2026-03-01')),
  closed    TEXT,
  CHECK (closed IS NULL OR closed >= opened)
);
INSERT INTO agents (name) VALUES ('Sana'),('Bilal');
INSERT INTO orders (file_no,state,product,liability,premium,agent_id) VALUES
 ('TX-1001','TX','Owner',350000,2150,1),
 ('FL-2001','FL','Lender',280000,1180,2);
DELETE FROM agents WHERE name = 'Bilal';    -- agent_id on FL-2001 becomes NULL

-- Try uncommenting one of these to see the constraint fire:
-- INSERT INTO orders (file_no,state,product,liability) VALUES ('TX-1001','TX','Owner',1);   -- UNIQUE
-- INSERT INTO orders (file_no,state,product,liability) VALUES ('TX-1002','TX','Title',1);   -- CHECK
SELECT o.file_no, o.state, o.product, o.premium, o.opened, a.name AS agent
FROM orders o LEFT JOIN agents a USING (agent_id);
```

### Quiz

1. What does `PRAGMA foreign_keys = ON;` do in SQLite?
- [x] Enables foreign-key enforcement for the current connection
- [ ] Creates the foreign keys
- [ ] Turns on cascading deletes globally
> SQLite parses `REFERENCES` clauses always but only enforces them when this pragma is on.

2. Can a `UNIQUE` column contain more than one NULL?
- [x] Yes, in SQLite, PostgreSQL and MySQL
- [ ] Never
- [ ] Only if it is also the primary key
> NULLs are not considered equal, so they do not violate uniqueness (SQL Server treats them as equal in a unique index unless filtered).

3. Why store money as DECIMAL rather than FLOAT?
- [x] Binary floating point cannot represent most decimal fractions exactly
- [ ] FLOAT is slower
- [ ] DECIMAL uses less storage
> `0.1 + 0.2` in floating point is `0.30000000000000004`; premium totals drift.

### Exercises

1. **QA table** — Create a `qa_reviews` table with an auto id, a required agent reference, a required `errors` count that cannot be negative and a review date defaulting to today.
<details><summary>Solution</summary>

```sql
CREATE TABLE qa_reviews (
  review_id INTEGER PRIMARY KEY,
  agent_id  INTEGER NOT NULL REFERENCES agents(agent_id),
  errors    INTEGER NOT NULL CHECK (errors >= 0),
  reviewed  TEXT NOT NULL DEFAULT (date('now'))
);
```

</details>

2. **Composite key** — Define a `rate_matrix` table keyed by state, product and band start, and insert two rows for Texas owner policies.
<details><summary>Solution</summary>

```sql
CREATE TABLE rate_matrix (
  state TEXT NOT NULL, product TEXT NOT NULL,
  band_from INTEGER NOT NULL, band_to INTEGER NOT NULL, rate_per_k REAL NOT NULL,
  PRIMARY KEY (state, product, band_from),
  CHECK (band_to > band_from)
);
INSERT INTO rate_matrix VALUES ('TX','Owner',0,100000,5.75),('TX','Owner',100001,1000000,4.55);
```

</details>

### Interview Questions

**Q: What is the difference between a primary key and a unique constraint?**
Both enforce uniqueness, but a table has at most one primary key, which also implies `NOT NULL` and is the default target for foreign keys and, in clustered engines like SQL Server and InnoDB, the physical row order. Unique constraints can be many per table and allow NULLs (multiple NULLs in most engines). I use the primary key for the surrogate identifier and unique constraints for natural business keys such as `file_no`, so both the join key and the business rule are enforced.

**Q: When would you use a natural key versus a surrogate key?**
A natural key (file number, ISO state code) carries meaning and is already unique in the business, but it can change, be long, or turn out not to be unique across acquisitions. A surrogate key (an auto-increment integer or UUID) is stable, compact and never changes, at the cost of one extra column and a join to show meaningful values. My default is a surrogate primary key plus a unique constraint on the natural key, which gives stability for foreign keys and still enforces the business rule.

**Q: What is SQLite type affinity, and how does it bite you?**
SQLite columns have a preferred storage class rather than a strict type: a `TEXT` column will store the integer you insert as text, and an `INTEGER` column will store `'abc'` unchanged as text. So a `premium REAL` column can end up with a text value that sorts and sums incorrectly if an import passed a string with a comma. Mitigations are `STRICT` tables (3.37+), `CHECK (typeof(premium) = 'real')`, and cleaning types in the import script. In PostgreSQL or SQL Server the insert would simply fail, which is safer.

## Indexes & Views

An **index** is a separate, sorted data structure (a B-tree) that maps column values to the rows holding them. Without an index, `WHERE file_no = 'TX-1001'` reads every row (a **full table scan**). With one, the engine seeks directly to the matching entries, turning a million-row scan into a handful of page reads.

```sql
CREATE INDEX idx_orders_file_no ON orders(file_no);
CREATE UNIQUE INDEX ux_orders_file_no ON orders(file_no);   -- also enforces uniqueness
```

Primary keys and `UNIQUE` constraints create indexes automatically. Foreign-key columns do **not** get an index automatically in SQLite or PostgreSQL (MySQL InnoDB adds one), and they are the columns you join on, so index them.

### Composite indexes and column order

An index on `(state, closed)` is sorted by `state` first, then by `closed` within each state. It serves:

- `WHERE state = 'TX'`
- `WHERE state = 'TX' AND closed >= '2026-03-01'`
- `WHERE state = 'TX' ORDER BY closed`

but not `WHERE closed >= '2026-03-01'` alone, because `closed` is not the leading column. Rule: put equality columns first, then the range or sort column.

### Covering indexes

If every column the query needs is inside the index, the engine never touches the table. `EXPLAIN QUERY PLAN` shows `USING COVERING INDEX`:

```sql
CREATE INDEX idx_orders_state_closed_premium ON orders(state, closed, premium);
EXPLAIN QUERY PLAN
SELECT SUM(premium) FROM orders WHERE state = 'TX' AND closed >= '2026-03-01';
```

PostgreSQL and SQL Server let you add non-key columns with `INCLUDE (premium)`, keeping the index narrower.

### Partial and expression indexes

```sql
CREATE INDEX idx_open_orders ON orders(agent_id) WHERE closed IS NULL;   -- partial
CREATE INDEX idx_orders_lower_county ON orders(lower(county));           -- expression
```

A partial index covers only open files, which is small and hot. An expression index makes `WHERE lower(county) = 'harris'` sargable. Both are supported by SQLite and PostgreSQL; SQL Server calls partial indexes *filtered indexes*.

### The cost of indexes

Every `INSERT`, `UPDATE` and `DELETE` must also update every index on the table, and indexes take disk space. A reporting table loaded nightly and read all day can carry many indexes; a high-write transactional table should have few, well-chosen ones. Indexes on low-cardinality columns (`status` with three values) rarely help unless they are partial or part of a composite key.

| Query shape | Helpful index |
|---|---|
| `WHERE a = ?` | `(a)` |
| `WHERE a = ? AND b > ?` | `(a, b)` |
| `WHERE a = ? ORDER BY b` | `(a, b)` |
| `JOIN t2 ON t2.fk = t1.pk` | `t2(fk)` |
| `WHERE lower(a) = ?` | expression index on `lower(a)` |

### Views: saved queries

A **view** is a named `SELECT`. Querying a view runs the underlying query each time; it stores no data.

```sql
CREATE VIEW v_closed_orders AS
SELECT o.order_id, o.file_no, o.state, o.premium, a.name AS agent
FROM orders o LEFT JOIN agents a ON a.agent_id = o.agent_id
WHERE o.status = 'Closed';

SELECT state, SUM(premium) FROM v_closed_orders GROUP BY state;
```

Views give report writers a stable, friendly interface over messy tables, hide columns users should not see, and centralise business rules such as "closed means status = Closed and closed date not null". They can be layered: a `v_monthly_production` view built on `v_closed_orders`. The engine merges the view definition into your query, so a view is only as fast as its underlying query.

When a view is expensive and queried often, engines offer **materialized views** (PostgreSQL `CREATE MATERIALIZED VIEW ... REFRESH`, SQL Server *indexed views*, Oracle) that store the result physically. SQLite has none; the substitute is a table refreshed by a script.

> **Warning:** Views built with `SELECT *` freeze the column list at creation time in most engines; adding a column to the base table does not add it to the view until you recreate it. List columns explicitly.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT,
                     premium REAL, status TEXT, closed TEXT);
WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x < 2000)
INSERT INTO orders (file_no,state,premium,status,closed)
SELECT 'F-' || x,
       CASE x % 3 WHEN 0 THEN 'TX' WHEN 1 THEN 'FL' ELSE 'WY' END,
       500 + (x * 37) % 3000,
       CASE WHEN x % 5 = 0 THEN 'Open' ELSE 'Closed' END,
       CASE WHEN x % 5 = 0 THEN NULL ELSE date('2026-01-01', '+' || (x % 90) || ' days') END
FROM n;

CREATE INDEX idx_orders_state_closed ON orders(state, closed);
CREATE VIEW v_closed AS SELECT * FROM orders WHERE status = 'Closed';

-- plan shows the composite index being used (SEARCH ... USING INDEX)
EXPLAIN QUERY PLAN
SELECT SUM(premium) FROM v_closed WHERE state = 'TX' AND closed >= '2026-03-01';
```

### Quiz

1. An index exists on `(state, closed)`. Which query cannot use it efficiently?
- [ ] `WHERE state = 'TX'`
- [ ] `WHERE state = 'TX' AND closed > '2026-01-01'`
- [x] `WHERE closed > '2026-01-01'`
> The leading column must be constrained for a B-tree composite index to seek.

2. Does a view store data?
- [ ] Yes, a copy of the rows
- [x] No, it stores a query that runs when the view is read
- [ ] Only if indexed
> Materialized views store data; ordinary views do not.

3. What is the main cost of adding an index?
- [x] Slower writes and extra storage
- [ ] Slower reads
- [ ] Locks the table permanently
> Every write must maintain every index; reads generally get faster.

### Exercises

1. **Index for a join** — Given `endorsements(order_id)` referencing `orders`, create the index that speeds up `JOIN endorsements e ON e.order_id = o.order_id`.
<details><summary>Solution</summary>

```sql
CREATE INDEX idx_endorsements_order_id ON endorsements(order_id);
```

</details>

2. **Production view** — Create a view `v_monthly_state` giving closed premium totals per state and `YYYY-MM` month.
<details><summary>Solution</summary>

```sql
CREATE VIEW v_monthly_state AS
SELECT state, substr(closed, 1, 7) AS month, SUM(premium) AS premium, COUNT(*) AS files
FROM orders
WHERE status = 'Closed' AND closed IS NOT NULL
GROUP BY state, month;
```

</details>

### Interview Questions

**Q: How do you decide which columns to index?**
Start from the queries: columns in `WHERE` equality predicates, join keys (especially foreign keys), and columns used for `ORDER BY` after an equality filter. Build composite indexes with equality columns first and the range or sort column last, and check selectivity: an index on a three-value `status` column is rarely used unless it is partial. Then verify with `EXPLAIN` that the plan actually uses it, and measure the write cost, since a table taking 500 inserts per second cannot afford ten indexes.

**Q: What is a covering index and when is it worth it?**
An index that contains every column a query reads, so the engine answers the query from the index alone and never visits the table. For a hot report such as `SELECT SUM(premium) FROM orders WHERE state = ? AND closed BETWEEN ? AND ?`, an index on `(state, closed, premium)` or `(state, closed) INCLUDE (premium)` can make the query an order of magnitude faster. It is worth it for frequent, narrow queries; it is not worth it for wide row reads, where the index would duplicate most of the table.

**Q: What are the advantages and disadvantages of views?**
Advantages: a stable interface that hides schema complexity, one place to define business rules, and row or column security by granting access to the view rather than the table. Disadvantages: no performance gain by themselves, nested views can hide expensive joins and make plans hard to read, and `SELECT *` views break silently on schema change. Materialized views trade freshness for speed and are the right tool when a dashboard hits the same heavy aggregate thousands of times a day.

## NULL Handling

`NULL` is not zero, not an empty string and not false. It means *the value is unknown or does not apply*, and it obeys **three-valued logic**: every comparison with `NULL` yields `NULL` (unknown), which `WHERE`, `HAVING` and `CASE` treat as *not true*.

| Expression | Result |
|---|---|
| `NULL = NULL` | NULL |
| `NULL <> 5` | NULL |
| `NULL AND TRUE` | NULL |
| `NULL AND FALSE` | FALSE |
| `NULL OR TRUE` | TRUE |
| `NOT NULL` | NULL |
| `NULL + 10` | NULL |
| `'abc' \|\| NULL` | NULL |

`NULL AND FALSE` is false because the result is false regardless of the unknown; `NULL OR TRUE` is true for the same reason. This is what makes `NOT IN` with NULLs return nothing: `x NOT IN (1, NULL)` is `x <> 1 AND x <> NULL`, which is `TRUE AND NULL` = `NULL`.

### Testing for NULL

```sql
SELECT file_no FROM orders WHERE closed IS NULL;
SELECT file_no FROM orders WHERE closed IS NOT NULL;
SELECT file_no FROM orders WHERE agent_id IS NOT DISTINCT FROM prev_agent_id;   -- PostgreSQL
SELECT file_no FROM orders WHERE agent_id IS prev_agent_id;                     -- SQLite equivalent
```

`IS` in SQLite (and `IS NOT DISTINCT FROM` in PostgreSQL/SQL Server 2022) is a NULL-safe equality: it returns true when both sides are NULL. MySQL spells it `<=>`.

### Replacing NULLs

```sql
SELECT file_no,
       COALESCE(closed, 'open')             AS closed_display,
       COALESCE(premium, 0)                 AS premium_or_zero,
       IFNULL(county, 'n/a')                AS county_display,   -- SQLite/MySQL; ISNULL in T-SQL
       NULLIF(status, '')                   AS status_clean      -- turn blanks into NULL
FROM orders;
```

`COALESCE` is standard SQL and takes any number of arguments; use it in shared code. `NULLIF` goes the other way and is how you normalise imports where empty strings were used instead of NULL.

### NULLs in aggregates, joins, and sorting

- Aggregates ignore NULLs: `AVG(premium)` averages only non-NULL premiums; `COUNT(premium)` counts them. `SUM` over all-NULL input is NULL, not 0.
- `GROUP BY` and `DISTINCT` treat NULLs as one group, so you get a single NULL row.
- Joins never match on NULL keys: an order with `agent_id = NULL` is dropped by an inner join even if an agent row had a NULL id.
- `ORDER BY` puts NULLs first in SQLite/MySQL and last in PostgreSQL/Oracle (ascending); use `NULLS FIRST/LAST` where supported.
- `UNIQUE` allows several NULLs in SQLite, PostgreSQL and MySQL; SQL Server allows only one unless the index is filtered.

### Empty string is not NULL

Oracle treats `''` as NULL; every other engine treats it as a real, zero-length string. A column that mixes both breaks counts: `COUNT(county)` counts the blanks. Normalise on import with `NULLIF(trim(county), '')`.

### CASE and NULL

```sql
SELECT file_no,
       CASE WHEN closed IS NULL THEN 'Open'
            WHEN closed < '2026-01-01' THEN 'Closed (prior year)'
            ELSE 'Closed' END AS state_label
FROM orders;
```

Put the `IS NULL` branch first; once `closed` is NULL, every later comparison would be unknown and would fall through to `ELSE`, which may not be the label you want.

> **Interview note:** "What does `SELECT COUNT(*) FROM t WHERE col NOT IN (SELECT col FROM u)` return if `u.col` contains a NULL?" is a favourite trick question. The answer is zero rows, and the fix is `NOT EXISTS`.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, county TEXT,
                     premium REAL, agent_id INTEGER, closed TEXT);
INSERT INTO orders (file_no,county,premium,agent_id,closed) VALUES
 ('TX-1001','Harris',2150,1,'2026-03-04'),
 ('TX-1002','',      NULL,NULL,NULL),
 ('FL-2001',NULL,    2645.5,2,'2026-03-02'),
 ('WY-3001','Laramie',NULL,NULL,NULL);
CREATE TABLE excluded_agents (agent_id INTEGER);
INSERT INTO excluded_agents VALUES (2),(NULL);

SELECT 'rows'                                  AS metric, COUNT(*)               AS value FROM orders
UNION ALL SELECT 'count(premium)',             COUNT(premium)                   FROM orders
UNION ALL SELECT 'sum(premium)',               SUM(premium)                     FROM orders
UNION ALL SELECT 'avg(premium)',               AVG(premium)                     FROM orders
UNION ALL SELECT 'avg(coalesce(premium,0))',   AVG(COALESCE(premium,0))         FROM orders
UNION ALL SELECT 'blank counties (not NULL)',  COUNT(*) FROM orders WHERE county = ''
UNION ALL SELECT 'NOT IN with NULL in list',   COUNT(*) FROM orders WHERE agent_id NOT IN (SELECT agent_id FROM excluded_agents)
UNION ALL SELECT 'NOT EXISTS instead',         COUNT(*) FROM orders o WHERE NOT EXISTS (SELECT 1 FROM excluded_agents e WHERE e.agent_id = o.agent_id)
UNION ALL SELECT 'NULL IS NULL (SQLite IS)',   COUNT(*) FROM orders WHERE agent_id IS NULL;
```

### Quiz

1. What is the result of `NULL = NULL`?
- [ ] TRUE
- [ ] FALSE
- [x] NULL
> Comparisons with NULL are unknown; use `IS NULL` or a NULL-safe operator.

2. What does `SUM(premium)` return when every premium is NULL?
- [ ] 0
- [x] NULL
- [ ] An error
> Aggregates skip NULLs; with nothing left to sum, the result is NULL.

3. Which of these is equivalent to `a IS NOT DISTINCT FROM b` in SQLite?
- [x] `a IS b`
- [ ] `a = b`
- [ ] `COALESCE(a, b)`
> SQLite's `IS` operator compares NULL-safely.

### Exercises

1. **Clean import** — Write an UPDATE that converts empty-string counties to NULL and NULL premiums to 0.
<details><summary>Solution</summary>

```sql
UPDATE orders SET county = NULLIF(trim(county), ''), premium = COALESCE(premium, 0);
```

</details>

2. **Safe anti-join** — Return orders whose agent is not in `excluded_agents`, correctly handling the NULL in that table.
<details><summary>Solution</summary>

```sql
SELECT o.file_no FROM orders o
WHERE NOT EXISTS (SELECT 1 FROM excluded_agents e WHERE e.agent_id = o.agent_id);
```

</details>

### Interview Questions

**Q: Explain three-valued logic and one bug it causes.**
SQL predicates evaluate to TRUE, FALSE or UNKNOWN (NULL), and filtering clauses only keep TRUE. Any comparison involving NULL is UNKNOWN, `UNKNOWN AND TRUE` is UNKNOWN, and `NOT UNKNOWN` is still UNKNOWN. The classic bug is `WHERE status <> 'Cancelled'`, which drops rows with NULL status, so a report meant to show all active files under-counts them; the fix is `OR status IS NULL` or `COALESCE(status, '') <> 'Cancelled'`. The other classic is `NOT IN` against a list containing NULL, which returns no rows at all.

**Q: What is the difference between COALESCE and ISNULL/IFNULL?**
`COALESCE` is ANSI standard, accepts any number of arguments and returns the first non-NULL one, with the result type determined by standard type precedence. `ISNULL` (T-SQL) and `IFNULL` (SQLite, MySQL) take exactly two arguments and are engine-specific; T-SQL's `ISNULL` also uses the type of the first argument, which can truncate a longer replacement string. I write `COALESCE` in anything that might be ported and only use the two-argument forms when matching existing code style.

**Q: How do NULLs affect indexes and uniqueness?**
Most engines index NULLs and can use the index for `IS NULL` predicates, but PostgreSQL and SQLite treat NULLs as distinct in unique indexes, so a unique column can hold many NULLs; SQL Server treats them as equal and allows only one, unless you create a filtered unique index `WHERE col IS NOT NULL`. Oracle does not index rows where all indexed columns are NULL, so `WHERE col IS NULL` cannot use a single-column index there. In practice I decide explicitly whether "unknown" rows must be unique and pick the constraint accordingly.

# LEVEL: Expert

## Query Optimisation & EXPLAIN

A SQL statement says *what* you want; the **query planner** decides *how* to get it: which table to read first, which index to use, how to join, whether to sort. When a report takes minutes instead of seconds, you read the plan, find the expensive step and change the query, the indexes or the schema so the planner can do better.

### Reading a plan

```sql
EXPLAIN QUERY PLAN
SELECT o.file_no, a.name
FROM orders o JOIN agents a ON a.agent_id = o.agent_id
WHERE o.state = 'TX' AND o.closed >= '2026-03-01';
```

SQLite's output is a tree of lines such as:

```text
QUERY PLAN
|--SEARCH o USING INDEX idx_orders_state_closed (state=? AND closed>?)
`--SEARCH a USING INTEGER PRIMARY KEY (rowid=?)
```

| Word | Meaning |
|---|---|
| `SCAN t` | full table scan: every row is read |
| `SEARCH t USING INDEX` | index seek to a subset of rows |
| `USING COVERING INDEX` | answered from the index alone |
| `USE TEMP B-TREE FOR ORDER BY` | a sort was needed (no index provided the order) |
| `AUTOMATIC INDEX` | SQLite built a throw-away index because none existed; a hint to create one |

PostgreSQL's `EXPLAIN (ANALYZE, BUFFERS)` shows estimated versus actual row counts and time per node; SQL Server shows a graphical plan with `SET STATISTICS IO ON` for logical reads; MySQL uses `EXPLAIN ANALYZE` (8.0.18+). The vocabulary differs, but the questions are the same: *where is the scan, where is the sort, and is the row estimate wildly wrong?*

### Sargable predicates

A predicate is **sargable** (Search ARGument able) when an index can seek on it. Wrapping the column in a function, or putting arithmetic on the column side, defeats the index:

```sql
-- not sargable: function on the column
WHERE strftime('%Y', closed) = '2026'
WHERE premium * 1.1 > 2000
WHERE file_no LIKE '%1001'

-- sargable rewrites
WHERE closed >= '2026-01-01' AND closed < '2027-01-01'
WHERE premium > 2000 / 1.1
WHERE file_no LIKE 'TX-%'
```

A leading wildcard in `LIKE` cannot use a B-tree; a trailing one can (in SQLite only if the column has `COLLATE NOCASE` or the `LIKE` optimisation conditions are met, otherwise use `GLOB` or a range `>= 'TX-' AND < 'TX.'`).

### Join order and statistics

The planner estimates row counts from **statistics**. Run `ANALYZE` in SQLite/PostgreSQL (`UPDATE STATISTICS` in SQL Server) after bulk loads, or the planner may choose a nested loop expecting 10 rows and get 10 million. Join algorithms:

| Algorithm | Best when |
|---|---|
| Nested loop | outer input small, inner side indexed on the join key |
| Hash join | large unsorted inputs, equality join; builds a hash table of the smaller side |
| Merge join | both inputs already sorted on the key (indexes or prior sort) |

SQLite only implements nested loops (with automatic indexes), which is why indexing the join column matters so much there.

### Common fixes, in order of payoff

1. Add the missing index for the `WHERE`/join column (check with `EXPLAIN` that it is used).
2. Make predicates sargable.
3. Select fewer columns and rows: filter early, avoid `SELECT *`, push conditions into the CTE.
4. Replace correlated subqueries that run per row with a join or window function.
5. Replace `DISTINCT`/`UNION` used to hide a row-multiplying join with the correct join.
6. Pre-aggregate: a nightly summary table for dashboards instead of scanning detail rows on every refresh.
7. Batch large writes and keep transactions short.

### Measuring, not guessing

```sql
.timer on                         -- sqlite3 shell
EXPLAIN ANALYZE SELECT ...;       -- PostgreSQL / MySQL 8
SET STATISTICS TIME, IO ON;       -- SQL Server
```

Always measure with realistic data volumes and a warm and a cold cache. A query that is fast on a 5,000-row development copy can be a different plan on the 20-million-row production table.

> **Interview note:** When asked "a report is slow, what do you do?", walk through: get the plan, find scans and sorts, check indexes and statistics, rewrite non-sargable predicates, verify with timing. Then mention the trade-off that every index slows writes. That sequence is what senior interviewers listen for.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT, premium REAL, closed TEXT);
WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x < 5000)
INSERT INTO orders (file_no,state,premium,closed)
SELECT 'F-' || x, CASE x % 4 WHEN 0 THEN 'TX' WHEN 1 THEN 'FL' WHEN 2 THEN 'WY' ELSE 'CO' END,
       500 + (x * 37) % 3000, date('2026-01-01', '+' || (x % 120) || ' days')
FROM n;

-- With the index the plan says SEARCH ... USING INDEX.
-- Comment out the CREATE INDEX line and run again to see SCAN orders instead.
CREATE INDEX idx_orders_state_closed ON orders(state, closed);
EXPLAIN QUERY PLAN
SELECT SUM(premium) FROM orders WHERE state = 'TX' AND closed >= '2026-03-01';
```

### Quiz

1. Which predicate can use an index on `closed`?
- [ ] `strftime('%Y', closed) = '2026'`
- [x] `closed >= '2026-01-01' AND closed < '2027-01-01'`
- [ ] `substr(closed, 1, 4) = '2026'`
> Functions on the column make the predicate non-sargable; a range on the raw column seeks.

2. What does `SCAN orders` in a SQLite plan mean?
- [x] Every row of the table is read
- [ ] An index seek
- [ ] The table is empty
> `SCAN` is a full table scan; `SEARCH ... USING INDEX` is a seek.

3. Why run `ANALYZE` after a bulk load?
- [x] So the planner has accurate row-count statistics
- [ ] To rebuild the indexes
- [ ] To free disk space
> Stale statistics lead to bad join orders and wrong algorithm choices.

### Exercises

1. **Fix the predicate** — Rewrite `WHERE upper(state) = 'TX' AND premium / 1000 > 2` so both conditions are sargable.
<details><summary>Solution</summary>

```sql
WHERE state = 'TX' AND premium > 2000
-- (or create an expression index on upper(state) if the case really varies)
```

</details>

2. **Spot the multiplier** — A query joins `orders` to `rate_matrix` on `state` and returns `SUM(premium)` three times too high. Explain and fix.
<details><summary>Solution</summary>

The rate table has several rows per state (one per band), so each order matches several rate rows. Filter the rate table to the single applicable band before joining:

```sql
SELECT SUM(o.premium)
FROM orders o
JOIN rate_matrix r ON r.state = o.state
  AND o.liability BETWEEN r.band_from AND r.band_to;
```

</details>

### Interview Questions

**Q: A report that used to take 3 seconds now takes 4 minutes. How do you diagnose it?**
First I confirm what changed: data volume, a new index, a dropped index, a schema change or stale statistics after a large load. Then I capture the actual execution plan and look for full scans on large tables, sorts spilling to disk, and nodes where estimated rows differ from actual rows by orders of magnitude, which points at statistics. I check that the predicates are sargable and that join columns are indexed, apply the fix in a test copy, and measure before and after with the same parameters. I close by documenting the root cause, because "someone dropped the index during a migration" is a process problem, not a SQL problem.

**Q: What is a sargable query and why does it matter?**
A sargable predicate lets the engine seek into an index rather than evaluate an expression for every row. `WHERE closed >= '2026-01-01'` is sargable; `WHERE YEAR(closed) = 2026` is not, because the index stores `closed`, not `YEAR(closed)`. On a 20-million-row table that is the difference between reading a few hundred pages and reading all of them. Where a function is unavoidable, an expression or computed-column index restores sargability.

**Q: Explain the difference between a nested-loop join, a hash join and a merge join.**
A nested loop reads each row of the outer input and probes the inner input, which is fast when the outer side is small and the inner side has an index on the join key. A hash join builds an in-memory hash table on the smaller input and probes it with the larger one, which suits large equality joins with no useful indexes. A merge join walks two inputs sorted on the join key in lockstep, ideal when both are already ordered by an index. The optimiser picks based on estimated sizes and available indexes, which is why accurate statistics matter and why SQLite, which only has nested loops, depends on indexes so heavily.

**Q: When would you denormalise or pre-aggregate for performance?**
When the same expensive aggregate is read far more often than the underlying rows change, for example a Power BI dashboard refreshing state-level monthly totals every hour from a 50-million-row order table. A nightly summary table (or a materialized view in PostgreSQL) turns each refresh from a full scan into a lookup. The trade-offs are staleness, extra storage and the risk of the summary drifting from the detail, so I always keep a reconciliation query that compares the two and alerts on mismatch.

## Transactions & Isolation

A **transaction** groups several statements into one unit that either all succeed or all fail. Posting a closing means inserting the policy, updating the order status and writing an audit row; if the third statement fails, the first two must be undone. Without a transaction you get a half-posted closing that no report can explain.

```sql
BEGIN;
UPDATE orders SET status = 'Closed', closed = '2026-03-04' WHERE file_no = 'TX-1001';
INSERT INTO policies (file_no, policy_no, premium) VALUES ('TX-1001', 'OP-88121', 2150.00);
INSERT INTO audit (file_no, action) VALUES ('TX-1001', 'closed');
COMMIT;
```

`BEGIN` (or `BEGIN TRANSACTION`, `START TRANSACTION` in MySQL) starts it; `COMMIT` makes the changes permanent; `ROLLBACK` discards them. If the connection drops before `COMMIT`, the engine rolls back automatically. By default SQLite, PostgreSQL and MySQL run each statement in its own **autocommit** transaction, so an explicit `BEGIN` is what lets you group them.

### ACID

| Property | Meaning | Provided by |
|---|---|---|
| Atomicity | all or nothing | rollback journal / write-ahead log |
| Consistency | constraints hold before and after | constraint checks at statement/commit |
| Isolation | concurrent transactions do not see each other's partial work | locks or MVCC |
| Durability | committed data survives a crash | fsync of the log before COMMIT returns |

### Savepoints

```sql
BEGIN;
INSERT INTO orders (file_no, state) VALUES ('TX-1010', 'TX');
SAVEPOINT before_endorsements;
INSERT INTO endorsements (order_id, code) VALUES (last_insert_rowid(), 'T-19');
ROLLBACK TO before_endorsements;     -- undo just the endorsement
RELEASE before_endorsements;
COMMIT;                              -- the order still commits
```

Savepoints give partial rollback inside a transaction, useful in import scripts that should skip one bad row without abandoning the batch.

### Isolation levels and anomalies

Isolation controls what a transaction can see of others' uncommitted or newly committed work. The SQL standard defines four levels by which anomalies they permit:

| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| READ UNCOMMITTED | possible | possible | possible |
| READ COMMITTED | prevented | possible | possible |
| REPEATABLE READ | prevented | prevented | possible (not in PostgreSQL/InnoDB) |
| SERIALIZABLE | prevented | prevented | prevented |

- **Dirty read**: seeing rows another transaction has not yet committed (and may roll back).
- **Non-repeatable read**: re-reading a row and getting a different value because someone committed in between.
- **Phantom read**: re-running a query and getting new rows.

Defaults: PostgreSQL, SQL Server and Oracle use READ COMMITTED; MySQL InnoDB uses REPEATABLE READ; SQLite is always SERIALIZABLE because writers take the whole database lock (in WAL mode readers do not block the writer and see a consistent snapshot).

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;      -- PostgreSQL / SQL Server, before the first statement
```

### Locking versus MVCC

SQL Server (by default) and older engines implement isolation with **locks**: readers block writers and vice versa, and higher isolation means more blocking and more deadlocks. PostgreSQL, Oracle, InnoDB and SQLite-WAL use **MVCC** (multi-version concurrency control): each transaction sees a snapshot as of its start, readers never block writers, and conflicting writers are detected at commit. SQL Server offers the same with `READ_COMMITTED_SNAPSHOT`.

### Deadlocks

Two transactions each hold a lock the other needs. Engines detect this and kill one (the *victim*), which the application must retry. Prevention: touch tables and rows in the same order in every code path, keep transactions short, and never wait for user input inside one.

> **Warning:** Long-running report queries inside an explicit transaction can hold locks (SQL Server) or prevent vacuum/cleanup (PostgreSQL) for their whole duration. Run read-only reports in autocommit mode or on a replica.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT UNIQUE, status TEXT, premium REAL);
CREATE TABLE audit (id INTEGER PRIMARY KEY, file_no TEXT, action TEXT);
INSERT INTO orders (file_no,status,premium) VALUES ('TX-1001','Open',2150),('TX-1002','Open',1180);

BEGIN;
UPDATE orders SET status = 'Closed' WHERE file_no = 'TX-1001';
INSERT INTO audit (file_no, action) VALUES ('TX-1001','closed');
SAVEPOINT sp1;
UPDATE orders SET premium = premium * 2;              -- oops, no WHERE
ROLLBACK TO sp1;                                      -- undo only the bad update
RELEASE sp1;
COMMIT;

BEGIN;
DELETE FROM orders;                                   -- would empty the table
ROLLBACK;                                             -- but we change our mind

SELECT o.file_no, o.status, o.premium, (SELECT COUNT(*) FROM audit) AS audit_rows
FROM orders o ORDER BY o.order_id;
```

### Quiz

1. Which statement makes a transaction's changes permanent?
- [ ] `END`
- [x] `COMMIT`
- [ ] `SAVE`
> `COMMIT` durably applies the work; `ROLLBACK` discards it.

2. A transaction reads a row twice and sees two different committed values. Which anomaly is that?
- [ ] Dirty read
- [x] Non-repeatable read
- [ ] Phantom read
> Non-repeatable reads are allowed at READ COMMITTED and prevented at REPEATABLE READ and above.

3. Under MVCC, do readers block writers?
- [ ] Yes, always
- [x] No; readers see a snapshot while writers proceed
- [ ] Only at SERIALIZABLE
> Multi-versioning keeps old row versions for readers instead of locking them.

### Exercises

1. **Atomic transfer** — Write a transaction that moves file `TX-1002` from agent 2 to agent 3 and logs the reassignment, rolling back if anything fails.
<details><summary>Solution</summary>

```sql
BEGIN;
UPDATE orders SET agent_id = 3 WHERE file_no = 'TX-1002' AND agent_id = 2;
INSERT INTO audit (file_no, action) VALUES ('TX-1002', 'reassigned 2 -> 3');
-- application checks changes() = 1 on the UPDATE; if not, ROLLBACK; else
COMMIT;
```

</details>

2. **Name the level** — For each case choose the lowest isolation level that prevents it: (a) reading uncommitted data, (b) a row changing between two reads, (c) new rows appearing in a repeated range query.
<details><summary>Solution</summary>

(a) READ COMMITTED; (b) REPEATABLE READ; (c) SERIALIZABLE (in PostgreSQL and InnoDB, REPEATABLE READ already prevents phantoms for plain reads).

</details>

### Interview Questions

**Q: Explain ACID with a concrete example.**
Closing a title order touches three tables: the order status, the policy row and the audit log. Atomicity means all three writes commit or none do, so a crash after the second leaves nothing. Consistency means the foreign key from policy to order and the check that premium is positive hold at commit. Isolation means a report running at the same moment sees either the pre-closing or post-closing state, never one table updated and another not. Durability means once `COMMIT` returns, a power failure a millisecond later does not lose the closing, because the write-ahead log was flushed to disk first.

**Q: What is the difference between READ COMMITTED and REPEATABLE READ, and which is the default in your database?**
READ COMMITTED guarantees you never see uncommitted data, but each statement sees the latest committed state, so the same row can change between two reads in one transaction. REPEATABLE READ pins the snapshot for the transaction, so re-reads return the same values; phantoms may still appear in strict lock-based engines. PostgreSQL, SQL Server and Oracle default to READ COMMITTED; MySQL InnoDB defaults to REPEATABLE READ; SQLite is effectively SERIALIZABLE. For a month-end report that runs several queries that must agree with each other, I run them in one REPEATABLE READ or snapshot transaction.

**Q: How do you handle deadlocks in application code?**
Detect the engine's deadlock error (SQL Server 1205, PostgreSQL 40P01, MySQL 1213), roll back, wait a short random back-off, and retry the whole transaction a bounded number of times. To reduce their frequency: acquire locks in a consistent order across code paths, keep transactions short, avoid user interaction inside them, and use appropriate indexes so updates lock a few rows instead of scanning and locking many. Persistent deadlocks between two specific procedures usually mean their statement order should be aligned.

**Q: What does MVCC cost, and where does it show up?**
Every update creates a new row version and leaves the old one for transactions that may still need it, so storage grows until a cleanup process (PostgreSQL VACUUM, InnoDB purge, SQLite WAL checkpoint) reclaims it. A long-running transaction pins old versions and blocks that cleanup, causing table bloat and, in PostgreSQL, eventual transaction-ID wraparound warnings. The benefit is that readers and writers do not block each other, which is why analytical queries on an OLTP PostgreSQL database are far less disruptive than on lock-based SQL Server without snapshot isolation.

## Dialect Differences

The core of SQL is portable; the edges are not. Analysts move between SQLite in a notebook, MySQL behind a web app, PostgreSQL in a data warehouse and SQL Server (T-SQL) in a corporate reporting stack, and each has its own spelling for the same tasks. Knowing the mapping saves hours and is a frequent interview screen ("you have used MySQL; how would you do X in SQL Server?").

### Syntax cheat sheet

| Task | SQLite | MySQL | PostgreSQL | SQL Server (T-SQL) |
|---|---|---|---|---|
| Limit rows | `LIMIT 10` | `LIMIT 10` | `LIMIT 10` / `FETCH FIRST 10 ROWS ONLY` | `TOP 10` / `OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY` |
| Concatenate | `a \|\| b` | `CONCAT(a, b)` | `a \|\| b` | `a + b` / `CONCAT(a, b)` |
| Auto id | `INTEGER PRIMARY KEY` | `AUTO_INCREMENT` | `GENERATED AS IDENTITY` / `SERIAL` | `IDENTITY(1,1)` |
| Boolean | 0/1 | `TINYINT(1)` | `BOOLEAN` | `BIT` |
| Current date | `date('now')` | `CURDATE()` | `CURRENT_DATE` | `CAST(GETDATE() AS date)` |
| Add days | `date(d,'+7 days')` | `DATE_ADD(d, INTERVAL 7 DAY)` | `d + 7` | `DATEADD(day, 7, d)` |
| Date diff | `julianday(b)-julianday(a)` | `DATEDIFF(b, a)` | `b - a` | `DATEDIFF(day, a, b)` |
| If/else | `IIF()` / `CASE` | `IF()` / `CASE` | `CASE` | `IIF()` / `CASE` |
| Null default | `IFNULL`, `COALESCE` | `IFNULL`, `COALESCE` | `COALESCE` | `ISNULL`, `COALESCE` |
| String agg | `GROUP_CONCAT(x, ',')` | `GROUP_CONCAT(x SEPARATOR ',')` | `STRING_AGG(x, ',')` | `STRING_AGG(x, ',')` (2017+) |
| Upsert | `ON CONFLICT DO UPDATE` | `ON DUPLICATE KEY UPDATE` | `ON CONFLICT DO UPDATE` | `MERGE` |
| Identifier quotes | `"name"` or `[name]` | `` `name` `` | `"name"` | `[name]` |
| Case-insensitive LIKE | default (ASCII) | default (most collations) | `ILIKE` | depends on collation |

### Things that behave differently, not just spell differently

- **Integer division**: `7/2` is `3` in SQLite, PostgreSQL and SQL Server; MySQL returns `3.5`. MySQL's integer division operator is `DIV`.
- **GROUP BY strictness**: PostgreSQL and SQL Server error on non-aggregated, non-grouped columns; SQLite always allows them; MySQL depends on `ONLY_FULL_GROUP_BY` (on by default since 5.7).
- **Empty string versus NULL**: Oracle treats `''` as NULL; nobody else does.
- **String comparison case**: MySQL default collations are case-insensitive; PostgreSQL and SQLite are case-sensitive for `=`.
- **Boolean expressions in SELECT**: `SELECT premium > 2000` works in SQLite/MySQL (returns 0/1) and PostgreSQL (returns a boolean) but is a syntax error in T-SQL, where you need `CASE`.
- **Date literals**: ISO `'2026-03-04'` works everywhere; `'03/04/2026'` depends on server language settings in SQL Server and is rejected by PostgreSQL in some `DateStyle` settings.
- **Transactions on DDL**: PostgreSQL and SQLite can roll back `CREATE TABLE`; MySQL commits implicitly on DDL.

### T-SQL specifics worth knowing

```sql
DECLARE @from date = '2026-03-01';
SELECT TOP (5) WITH TIES file_no, premium
FROM dbo.orders
WHERE closed >= @from
ORDER BY premium DESC;

SELECT state, premium FROM dbo.orders
WHERE state IN ('TX','FL')
FOR JSON AUTO;            -- returns JSON text
```

T-SQL adds variables, `TOP ... WITH TIES`, `OUTPUT` on DML, `MERGE`, `CROSS APPLY`, table-valued parameters, `TRY/CATCH` and stored procedures with `EXEC`. Schema-qualified names (`dbo.orders`) are the norm.

### PostgreSQL specifics

```sql
SELECT state, array_agg(file_no ORDER BY file_no) AS files,
       percentile_cont(0.5) WITHIN GROUP (ORDER BY premium) AS median_premium
FROM orders GROUP BY state;
```

Arrays, `jsonb` with indexing, `DISTINCT ON`, `GENERATE_SERIES`, `FILTER (WHERE ...)` on aggregates, `RETURNING`, rich window support and CTEs that can modify data.

### Writing portable SQL

- Use ANSI forms: `COALESCE`, `CASE`, `FETCH FIRST`, `||` where accepted, explicit `JOIN ... ON`, ISO date literals.
- Keep dialect-specific pieces (pagination, date arithmetic) in small, isolated functions or a query-building layer.
- Test on every target engine; a SQLite unit test proves logic, not SQL Server behaviour.

> **Tip:** When an interviewer asks about a dialect you have not used, answer with the concept, name the syntax you do know, and say how you would confirm the equivalent: "In PostgreSQL that is `STRING_AGG`; in SQL Server I would check whether the version is 2017 or later, where the same function exists."

### Try It Yourself

```sql
-- SQLite spellings of things that differ elsewhere
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT, premium REAL, closed TEXT);
INSERT INTO orders (file_no,state,premium,closed) VALUES
 ('TX-1001','TX',2150,'2026-03-04'),('TX-1002','TX',1180,'2026-03-06'),
 ('FL-2001','FL',2645.5,'2026-03-02'),('FL-2002','FL',1012.75,'2026-03-15');

SELECT state,
       GROUP_CONCAT(file_no, ', ')                    AS files,        -- STRING_AGG elsewhere
       IIF(SUM(premium) > 3500, 'high', 'normal')     AS band,         -- IF()/CASE elsewhere
       date(MAX(closed), '+7 days')                   AS follow_up,    -- DATEADD elsewhere
       7 / 2                                          AS int_div,      -- 3 here, 3.5 in MySQL
       'Total: ' || printf('%.2f', SUM(premium))      AS label,        -- CONCAT / + elsewhere
       (SUM(premium) > 3500)                          AS is_high       -- not allowed in T-SQL
FROM orders
GROUP BY state
ORDER BY state
LIMIT 10;                                             -- TOP 10 in T-SQL
```

### Quiz

1. Which engine returns 3.5 for `7 / 2`?
- [ ] SQL Server
- [x] MySQL
- [ ] PostgreSQL
> MySQL's `/` always yields a decimal; use `DIV` for integer division there.

2. How do you take the top 10 rows in T-SQL?
- [ ] `LIMIT 10`
- [x] `SELECT TOP 10 ... ORDER BY ...`
- [ ] `FIRST 10`
> `TOP` (or `OFFSET ... FETCH`) is the SQL Server form; `LIMIT` is a syntax error there.

3. Which function is standard SQL for replacing NULLs?
- [ ] `ISNULL`
- [ ] `IFNULL`
- [x] `COALESCE`
> `COALESCE` is ANSI and works in every engine; the others are dialect-specific.

### Exercises

1. **Translate** — Rewrite this SQLite query for SQL Server: `SELECT file_no, date(closed, '+30 days') AS due FROM orders ORDER BY closed DESC LIMIT 5;`
<details><summary>Solution</summary>

```sql
SELECT TOP 5 file_no, DATEADD(day, 30, closed) AS due
FROM orders
ORDER BY closed DESC;
```

</details>

2. **Translate** — Rewrite `GROUP_CONCAT(file_no, ', ')` for PostgreSQL with the files sorted.
<details><summary>Solution</summary>

```sql
STRING_AGG(file_no, ', ' ORDER BY file_no)
```

</details>

### Interview Questions

**Q: You have mostly used MySQL. How would you approach a SQL Server role?**
The relational model, joins, aggregation, window functions and indexing concepts transfer unchanged; what differs is syntax and defaults. I would map the common tasks up front: `TOP`/`OFFSET FETCH` for `LIMIT`, `DATEADD`/`DATEDIFF` for date arithmetic, `ISNULL`/`COALESCE`, `+` or `CONCAT` for strings, `IDENTITY` for auto-increment, `MERGE` for upserts, and `STRING_AGG` from 2017. I would also learn what is different in behaviour: strict `GROUP BY`, lock-based isolation with `READ_COMMITTED_SNAPSHOT`, and T-SQL procedural features such as variables, `TRY/CATCH` and table-valued parameters. Then I would read execution plans in SSMS, since performance tuning is where the engine-specific knowledge really lives.

**Q: Name three differences between PostgreSQL and MySQL that affect query correctness.**
Integer division: PostgreSQL truncates `7/2` to 3, MySQL returns 3.5. Case sensitivity: PostgreSQL string comparison is case-sensitive and `LIKE` needs `ILIKE` for insensitivity, while MySQL's default collations are case-insensitive. `GROUP BY` strictness: PostgreSQL rejects ungrouped columns, MySQL rejects them only with `ONLY_FULL_GROUP_BY` (default since 5.7, but often disabled on legacy servers). A fourth is DDL in transactions: PostgreSQL rolls back a failed migration including `CREATE TABLE`; MySQL commits implicitly on DDL, so a half-applied migration must be cleaned up by hand.

**Q: How do you keep SQL portable across engines?**
I stick to ANSI constructs (`COALESCE`, `CASE`, explicit `JOIN ... ON`, ISO dates, `FETCH FIRST` where supported) and isolate the unavoidable dialect pieces, such as pagination, date arithmetic and upserts, in a small adapter layer or ORM dialect. Tests run against each real engine, not just SQLite, because SQLite's lenient typing and `GROUP BY` would hide errors that PostgreSQL raises. Where performance requires engine-specific features such as `jsonb` indexing or `CROSS APPLY`, I document that the query is engine-bound rather than pretending it is portable.

## Analytical Patterns

Certain report questions come up in every business and have well-known SQL solutions. Learning the patterns lets you recognise a problem in an interview and write the answer from memory, then adapt the details.

### Pivoting (long to wide)

Conditional aggregation, one column per category:

```sql
SELECT state,
       SUM(CASE WHEN product = 'Owner'  THEN premium ELSE 0 END) AS owner_premium,
       SUM(CASE WHEN product = 'Lender' THEN premium ELSE 0 END) AS lender_premium,
       SUM(CASE WHEN product = 'Both'   THEN premium ELSE 0 END) AS both_premium
FROM orders GROUP BY state;
```

**Unpivoting** (wide to long) is the reverse: one `SELECT` per column glued with `UNION ALL`, or `CROSS JOIN` against a small values table (`CROSS APPLY (VALUES ...)` in T-SQL, `UNNEST` in PostgreSQL).

### Top-N per group

```sql
SELECT state, file_no, premium FROM (
  SELECT state, file_no, premium,
         ROW_NUMBER() OVER (PARTITION BY state ORDER BY premium DESC, order_id) AS rn
  FROM orders
) WHERE rn <= 3;
```

Use `RANK` or `DENSE_RANK` instead if ties should all be included. Before window functions existed, the answer was a correlated subquery counting rows with a higher value; it still works but is O(n²).

### Deduplication

```sql
DELETE FROM orders
WHERE order_id NOT IN (
  SELECT MIN(order_id) FROM orders GROUP BY file_no
);
```

Or keep the newest with `ROW_NUMBER() OVER (PARTITION BY file_no ORDER BY updated_at DESC)` and delete `rn > 1` (in engines that allow deleting from a CTE; in SQLite use `DELETE ... WHERE order_id IN (SELECT order_id FROM ranked WHERE rn > 1)`).

### Running totals, cumulative share and percent of total

```sql
SELECT closed, premium,
       SUM(premium) OVER (ORDER BY closed, order_id)                                   AS running,
       ROUND(100.0 * SUM(premium) OVER (ORDER BY closed, order_id) / SUM(premium) OVER (), 1) AS cum_pct
FROM orders WHERE closed IS NOT NULL;
```

`SUM(premium) OVER ()` with an empty `OVER` is the grand total on every row. Cumulative percentage is how you find "the 20% of files producing 80% of premium".

### Gaps and islands

Given a list of dates or sequence numbers, find continuous runs (islands) and missing stretches (gaps). The classic trick: subtract a row number from the value; rows in the same run share the same difference.

```sql
WITH d AS (
  SELECT work_date,
         julianday(work_date) - ROW_NUMBER() OVER (ORDER BY work_date) AS grp
  FROM agent_days WHERE agent = 'Sana'
)
SELECT MIN(work_date) AS run_start, MAX(work_date) AS run_end, COUNT(*) AS days
FROM d GROUP BY grp ORDER BY run_start;
```

Consecutive dates increase by 1 and the row number increases by 1, so their difference is constant within an island and jumps at a gap. Finding *gaps* in a sequence of file numbers uses `LEAD`: `WHERE LEAD(seq) OVER (ORDER BY seq) - seq > 1`.

### Month-over-month and year-over-year

```sql
WITH m AS (
  SELECT substr(closed,1,7) AS ym, SUM(premium) AS total
  FROM orders WHERE closed IS NOT NULL GROUP BY ym
)
SELECT ym, total,
       LAG(total) OVER (ORDER BY ym)                                  AS prev,
       ROUND(100.0 * (total - LAG(total) OVER (ORDER BY ym)) / LAG(total) OVER (ORDER BY ym), 1) AS mom_pct
FROM m;
```

For year-over-year, `LAG(total, 12)` on a complete monthly series; generate missing months first with a recursive CTE so the offset is correct.

### Histograms and bucketing

`NTILE(4) OVER (ORDER BY premium)` gives quartiles; `CAST(premium / 500 AS INTEGER) * 500` gives fixed-width bins for a histogram; `CASE` gives business bands.

### First and last events per entity

```sql
SELECT agent_id,
       MIN(opened) AS first_file,
       MAX(opened) AS last_file,
       FIRST_VALUE(file_no) OVER (PARTITION BY agent_id ORDER BY opened) AS first_file_no
FROM orders;
```

| Question | Pattern |
|---|---|
| status counts as columns | conditional aggregation |
| best 3 per state | `ROW_NUMBER` + `PARTITION BY` |
| duplicate rows | `GROUP BY ... HAVING COUNT(*) > 1` or `ROW_NUMBER` |
| running total, % of total | `SUM() OVER (ORDER BY)`, `SUM() OVER ()` |
| consecutive days | gaps-and-islands difference trick |
| change vs prior period | `LAG` |
| median | `percentile_cont` (PostgreSQL/SQL Server) or two `ROW_NUMBER`s |

> **Interview note:** Interviewers rarely ask for the pattern by name. They describe a business need ("find agents who worked at least five consecutive days") and watch whether you recognise it. Practise translating the wording into the pattern before writing any SQL.

### Try It Yourself

```sql
CREATE TABLE agent_days (agent TEXT, work_date TEXT);
INSERT INTO agent_days VALUES
 ('Sana','2026-03-02'),('Sana','2026-03-03'),('Sana','2026-03-04'),
 ('Sana','2026-03-06'),('Sana','2026-03-09'),('Sana','2026-03-10'),('Sana','2026-03-11'),('Sana','2026-03-12'),
 ('Bilal','2026-03-02'),('Bilal','2026-03-04'),('Bilal','2026-03-05');

-- gaps and islands: continuous working streaks per agent
WITH d AS (
  SELECT agent, work_date,
         julianday(work_date) - ROW_NUMBER() OVER (PARTITION BY agent ORDER BY work_date) AS grp
  FROM agent_days
)
SELECT agent, MIN(work_date) AS streak_start, MAX(work_date) AS streak_end, COUNT(*) AS days
FROM d
GROUP BY agent, grp
ORDER BY agent, streak_start;
```

### Quiz

1. Which expression gives the grand total on every row?
- [x] `SUM(premium) OVER ()`
- [ ] `SUM(premium)`
- [ ] `SUM(premium) OVER (ORDER BY closed)`
> An empty `OVER ()` makes the whole result one partition with no frame limit.

2. In the gaps-and-islands trick, why subtract ROW_NUMBER from the date?
- [ ] To sort the dates
- [x] So consecutive values share a constant difference that identifies the run
- [ ] To remove duplicates
> Both the value and the row number step by one inside a run, so their difference is constant.

3. Which function returns the prior month's total on the current row?
- [ ] `FIRST_VALUE`
- [x] `LAG`
- [ ] `LEAD`
> `LAG` looks backwards by the given offset; `LEAD` looks forwards.

### Exercises

1. **Four-day streaks** — Using the Try It data, return agents who have a streak of at least 4 consecutive working days.
<details><summary>Solution</summary>

```sql
WITH d AS (
  SELECT agent, work_date,
         julianday(work_date) - ROW_NUMBER() OVER (PARTITION BY agent ORDER BY work_date) AS grp
  FROM agent_days
)
SELECT DISTINCT agent FROM d GROUP BY agent, grp HAVING COUNT(*) >= 4;
```

</details>

2. **Pareto** — Given `orders(file_no, premium)`, list the files that together make up the first 80% of total premium, largest first.
<details><summary>Solution</summary>

```sql
SELECT file_no, premium, cum_pct FROM (
  SELECT file_no, premium,
         100.0 * SUM(premium) OVER (ORDER BY premium DESC, file_no) / SUM(premium) OVER () AS cum_pct
  FROM orders
) WHERE cum_pct - 100.0 * premium / (SELECT SUM(premium) FROM orders) < 80
ORDER BY premium DESC;
```

</details>

### Interview Questions

**Q: Find customers with at least three consecutive days of orders.**
This is gaps and islands. Take the distinct order dates per customer, compute `date - ROW_NUMBER() OVER (PARTITION BY customer ORDER BY date)` as a group key, then `GROUP BY customer, key HAVING COUNT(*) >= 3`. I would mention two details: deduplicate to one row per customer per day first, otherwise multiple orders on one day break the arithmetic; and in engines with real date types the subtraction of an integer from a date is direct, whereas in SQLite I use `julianday`. An alternative with `LAG` twice is easier to read but does not generalise to "at least N".

**Q: How do you compute a median in SQL?**
PostgreSQL and SQL Server 2012+ have `percentile_cont(0.5) WITHIN GROUP (ORDER BY x)` (in SQL Server it is a window function with `OVER`). In engines without it, number the rows in both directions with `ROW_NUMBER() OVER (ORDER BY x)` and `COUNT(*) OVER ()`, keep the rows where the row number is `(n+1)/2` or `n/2 + 1`, and average them, which handles odd and even counts. The naive `LIMIT 1 OFFSET n/2` works for odd counts only and needs a separate count query.

**Q: What is the difference between a running total and a moving average, and how are they written?**
A running total accumulates from the start of the partition to the current row: `SUM(x) OVER (ORDER BY d ROWS UNBOUNDED PRECEDING)`. A moving average looks at a fixed window ending at the current row: `AVG(x) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` for a seven-row average. The frame clause is the whole difference, and I specify `ROWS` explicitly because the default `RANGE` frame treats tied dates as peers, which silently changes both calculations when a day has several rows.

## SQL Interview Questions & Whiteboard Problems

Interviews test SQL in three formats: conceptual questions, live queries against a described schema, and whiteboard problems where you write on a board with no engine to check you. This chapter is a rehearsal for all three, using a schema you should now be able to sketch from memory.

```sql
agents(agent_id, name, lead_id, office)
orders(order_id, file_no, state, product, liability, premium, status, agent_id, opened, closed)
policies(policy_id, order_id, policy_no, issued)
qa_reviews(review_id, order_id, reviewer_id, errors, reviewed)
```

### How to attack a whiteboard SQL problem

1. **Restate the question** in one sentence and confirm the grain of the output (one row per what?).
2. **Identify the tables and joins**, and say whether each join is one-to-one or one-to-many.
3. **Write the FROM/JOIN/WHERE skeleton first**, then the `SELECT` list, then grouping and ordering.
4. **Check edge cases aloud**: NULLs, ties, empty groups, duplicates, date boundaries.
5. **State the complexity and an index** that would make it fast.

Interviewers care more about steps 1, 2 and 4 than about perfect syntax.

### Worked problem 1: agents with no closed files this month

```sql
SELECT a.agent_id, a.name
FROM agents a
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.agent_id = a.agent_id
    AND o.status = 'Closed'
    AND o.closed >= '2026-03-01' AND o.closed < '2026-04-01'
);
```

Say why `NOT EXISTS` rather than `NOT IN` (NULL safety) and why the date range is half-open.

### Worked problem 2: second-highest premium per state

```sql
SELECT state, premium FROM (
  SELECT state, premium, DENSE_RANK() OVER (PARTITION BY state ORDER BY premium DESC) AS r
  FROM orders
) WHERE r = 2;
```

Explain the choice of `DENSE_RANK`: if two files tie for highest, the second-highest *value* is still rank 2. A state with only one distinct premium returns nothing, which is correct unless the interviewer wants NULL, in which case left-join from a states list.

### Worked problem 3: QA error rate per reviewer with a minimum sample

```sql
SELECT r.reviewer_id, a.name,
       COUNT(*) AS reviews,
       ROUND(AVG(r.errors), 2) AS avg_errors,
       ROUND(100.0 * SUM(CASE WHEN r.errors = 0 THEN 1 ELSE 0 END) / COUNT(*), 1) AS clean_pct
FROM qa_reviews r JOIN agents a ON a.agent_id = r.reviewer_id
WHERE r.reviewed >= date('now', '-30 days')
GROUP BY r.reviewer_id, a.name
HAVING COUNT(*) >= 20
ORDER BY avg_errors, reviews DESC;
```

### Worked problem 4: orders whose premium differs from the rate matrix

```sql
SELECT o.file_no, o.premium,
       ROUND(o.liability / 1000.0 * r.rate_per_k, 2) AS expected
FROM orders o
JOIN rate_matrix r
  ON r.state = o.state AND r.product = o.product
 AND o.liability BETWEEN r.band_from AND r.band_to
WHERE ABS(o.premium - o.liability / 1000.0 * r.rate_per_k) > 0.01;
```

This is a real data-validation query: join to the applicable band and compare. Mention the floating-point tolerance and that a file with no matching band would be silently dropped by the inner join, so a `LEFT JOIN ... WHERE r.state IS NULL` check belongs alongside it.

### Rapid-fire conceptual questions

| Question | One-line answer |
|---|---|
| `WHERE` vs `HAVING` | rows before grouping vs groups after |
| `UNION` vs `UNION ALL` | de-duplicated vs everything, `ALL` is faster |
| `RANK` vs `DENSE_RANK` vs `ROW_NUMBER` | gaps after ties / no gaps / always unique |
| `DELETE` vs `TRUNCATE` | logged row removal with `WHERE` vs fast page deallocation |
| Primary key vs unique | one per table, not null vs many, NULLs allowed |
| Clustered vs non-clustered index | table stored in key order vs separate structure pointing to rows |
| `CHAR` vs `VARCHAR` | fixed width padded vs variable width |
| Correlated vs uncorrelated subquery | references outer row (per-row) vs independent (once) |
| Why `NOT IN` fails | a NULL in the list makes every comparison unknown |
| What is a covering index | contains every column the query needs |
| ACID | atomic, consistent, isolated, durable |
| Normalisation goal | remove redundancy and update anomalies |

### Common mistakes under pressure

- Forgetting `GROUP BY` columns or grouping by the wrong grain.
- Filtering the optional side of a `LEFT JOIN` in `WHERE`.
- Using `COUNT(*)` where `COUNT(col)` was needed after an outer join.
- `BETWEEN` on datetime columns clipping the last day.
- Window function directly in `WHERE`.
- Not asking about duplicates in the join key.

> **Tip:** Practise by writing five queries a day against a small SQLite copy of your own production data. In an interview, saying "I do this exact query weekly for our state production report" is far more convincing than reciting syntax.

### Try It Yourself

```sql
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, state TEXT, product TEXT,
                     liability REAL, premium REAL, status TEXT, agent_id INTEGER, closed TEXT);
CREATE TABLE rate_matrix (state TEXT, product TEXT, band_from INTEGER, band_to INTEGER, rate_per_k REAL);
INSERT INTO rate_matrix VALUES
 ('TX','Owner',0,100000,5.75),('TX','Owner',100001,1000000,4.55),
 ('FL','Owner',0,100000,5.75),('FL','Owner',100001,1000000,5.00),
 ('TX','Lender',0,1000000,4.10);
INSERT INTO orders (file_no,state,product,liability,premium,status,agent_id,closed) VALUES
 ('TX-1001','TX','Owner',350000,1592.50,'Closed',2,'2026-03-04'),   -- correct: 350*4.55
 ('TX-1002','TX','Lender',280000,1180.00,'Closed',2,'2026-03-06'),  -- wrong: should be 1148.00
 ('FL-2001','FL','Owner',510000,2550.00,'Closed',3,'2026-03-02'),   -- correct
 ('FL-2002','FL','Lender',225000,1012.75,'Open',3,NULL),            -- no band -> unpriced
 ('TX-1003','TX','Owner',90000,517.50,'Closed',4,'2026-03-11');     -- correct: 90*5.75

-- validation report: mismatched premiums and unpriced products
SELECT o.file_no, o.premium,
       ROUND(o.liability / 1000.0 * r.rate_per_k, 2) AS expected,
       CASE WHEN r.state IS NULL THEN 'no rate band'
            WHEN ABS(o.premium - o.liability / 1000.0 * r.rate_per_k) > 0.01 THEN 'MISMATCH'
            ELSE 'ok' END AS check_result
FROM orders o
LEFT JOIN rate_matrix r
  ON r.state = o.state AND r.product = o.product
 AND o.liability BETWEEN r.band_from AND r.band_to
ORDER BY check_result DESC, o.file_no;
```

### Quiz

1. For "second-highest value per group" with possible ties, which function is most appropriate?
- [ ] `ROW_NUMBER`
- [x] `DENSE_RANK`
- [ ] `NTILE`
> `DENSE_RANK` gives the second distinct value rank 2 even when the top value is tied.

2. What is the first thing to confirm when given a whiteboard SQL problem?
- [x] The grain of the output (one row per what)
- [ ] The engine version
- [ ] The column data types
> The grain drives the `GROUP BY` and the joins; getting it wrong invalidates everything after.

3. A validation query inner-joins orders to rate bands. What does it miss?
- [ ] Orders with tied premiums
- [x] Orders with no matching band
- [ ] Orders with NULL premium only
> Unmatched rows vanish in an inner join; a `LEFT JOIN` with `IS NULL` check finds them.

### Exercises

1. **Never reviewed** — Using the chapter schema, return closed orders that have no row in `qa_reviews`.
<details><summary>Solution</summary>

```sql
SELECT o.file_no
FROM orders o
WHERE o.status = 'Closed'
  AND NOT EXISTS (SELECT 1 FROM qa_reviews q WHERE q.order_id = o.order_id);
```

</details>

2. **Lead's team production** — For each team lead, return the number of agents reporting to them and the total closed premium of those agents in March 2026, including leads whose team closed nothing.
<details><summary>Solution</summary>

```sql
SELECT m.name AS lead,
       COUNT(DISTINCT e.agent_id) AS agents,
       COALESCE(SUM(o.premium), 0) AS march_premium
FROM agents m
JOIN agents e ON e.lead_id = m.agent_id
LEFT JOIN orders o ON o.agent_id = e.agent_id AND o.status = 'Closed'
                  AND o.closed >= '2026-03-01' AND o.closed < '2026-04-01'
GROUP BY m.agent_id, m.name;
```

</details>

3. **Consecutive misses** — Find reviewers who logged errors on three or more consecutive reviews (by `review_id` order).
<details><summary>Solution</summary>

```sql
WITH flagged AS (
  SELECT reviewer_id, review_id,
         review_id - ROW_NUMBER() OVER (PARTITION BY reviewer_id ORDER BY review_id) AS grp
  FROM qa_reviews WHERE errors > 0
)
SELECT DISTINCT reviewer_id FROM flagged GROUP BY reviewer_id, grp HAVING COUNT(*) >= 3;
```

(This assumes review_ids are consecutive per reviewer; otherwise number all reviews first and apply the trick to that sequence.)

</details>

### Interview Questions

**Q: Write a query to find the nth highest salary (or premium).**
With window functions: `SELECT DISTINCT premium FROM (SELECT premium, DENSE_RANK() OVER (ORDER BY premium DESC) AS r FROM orders) WHERE r = :n`. `DENSE_RANK` handles ties so that the nth *distinct* value is returned; `ROW_NUMBER` would return the nth row, which differs when values repeat. Without windows: `SELECT DISTINCT premium FROM orders ORDER BY premium DESC LIMIT 1 OFFSET :n-1`. I would ask whether the interviewer wants NULL when fewer than n distinct values exist and wrap it in a scalar subquery if so.

**Q: How would you find employees who earn more than their manager?**
Self join: `SELECT e.name FROM employees e JOIN employees m ON m.emp_id = e.manager_id WHERE e.salary > m.salary`. The join is one-to-one from employee to manager, so no row multiplication. Employees with a NULL manager are excluded by the inner join, which is the intended behaviour; if the requirement were to include them, I would use a `LEFT JOIN` and decide what "more than nobody" means. It is the same shape as agents versus team leads in a QA hierarchy.

**Q: Given a table of daily production counts, return each day with its 7-day moving average and flag days more than 20% below it.**
Compute the average with a frame: `AVG(files) OVER (ORDER BY work_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7`, then in an outer query `WHERE files < 0.8 * ma7`. Two subtleties I would mention: the first six days have a partial window, so either exclude them with `ROW_NUMBER() OVER (ORDER BY work_date) >= 7` or accept the partial average and say so; and missing days must be generated (recursive CTE or a calendar table) so that the frame counts calendar days, not just rows that happen to exist.

**Q: What questions do you ask before writing a query for a stakeholder?**
The grain (one row per file, per agent, per month?), the definition of each metric (does "closed" mean status or a non-null date, does premium include endorsements?), the time window and whether it is inclusive, how to treat NULLs and cancelled files, the required sort and any top-N cut-off, and the destination, because a Power BI dataset wants long, unaggregated rows while an email report wants a pivoted summary. Asking these first is what stops a correct query from being the wrong report, and interviewers listen for it as a sign of experience.
