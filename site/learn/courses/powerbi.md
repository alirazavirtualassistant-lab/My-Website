---
id: powerbi
title: Power BI
icon: 📊
track: Data & Reporting
color: #C79A00
runner: none
tagline: Model, measure and visualise production data into management dashboards.
description: Power BI Desktop and Service from first import to expert modelling: Power Query transformations, star schemas and relationships, DAX measures and calculated columns, filter context and CALCULATE, time intelligence, visuals and interactions, bookmarks and drill-through, row-level security, publishing, refresh and gateways, performance tuning and the DAX questions asked in analyst interviews.
---

# LEVEL: Beginner

## The Power BI ecosystem and installing Desktop

Power BI is Microsoft's business-intelligence platform. You use it to connect to data (Excel sheets, SQL Server, SharePoint lists, CSV exports from a production system), shape that data, build a **data model**, write calculations, and publish interactive reports that managers open in a browser or on a phone. If you have ever emailed a weekly status workbook with six tabs of pivot tables, Power BI is the tool that replaces that workbook with one refreshable dashboard.

### The three pieces

| Piece | What it is | Where it runs | Cost |
|---|---|---|---|
| **Power BI Desktop** | The authoring tool. Import, model, write DAX, design pages. | Windows only (`.pbix` files) | Free |
| **Power BI Service** | The cloud (app.powerbi.com). Workspaces, sharing, scheduled refresh, apps, dashboards. | Browser | Free tier, Pro (per user), Premium Per User, Fabric capacity |
| **Power BI Mobile** | Read-only viewer for phones and tablets with touch-friendly layouts. | iOS, Android, Windows | Free |

You build in Desktop, publish to the Service, and consumers read in the browser or Mobile. A **Pro** licence is what most analysts need: it lets you publish to shared workspaces and lets colleagues with Pro open the report. Free-licence users can only publish to *My workspace* and cannot share.

### Installing Desktop

Two routes exist and they differ in how updates arrive:

1. **Microsoft Store** (recommended): open the Store, search *Power BI Desktop*, click **Get**. Updates install automatically every month.
2. **Download Center** (`.exe` installer): use this when IT blocks the Store. You must download the new build yourself each month; Desktop shows a banner when a newer version exists.

Power BI Desktop releases monthly. Files saved by a newer version may not open in an older one, so a team that shares `.pbix` files should agree on a version. Check yours under **Help → About**.

### The Desktop window

When you open Desktop and close the splash screen you see three icons on the left rail:

- **Report view**: the canvas where visuals live. Each report has one or more pages (tabs at the bottom).
- **Table view** (called *Data view* before 2023): a spreadsheet-like grid of each table after transformation.
- **Model view**: a diagram of tables and the relationship lines between them.

The right side has the **Data pane** (tables and fields), the **Visualizations pane** (chart types and their field wells) and the **Filters pane**. Everything you do in Beginner and Intermediate lives in these panes.

### Your first file

Click **Get data → Text/CSV**, pick a small CSV such as a daily production export with columns `Date, State, Agent, FilesCompleted, Errors`, and press **Load**. The table appears in the Data pane. Drag `FilesCompleted` onto the empty canvas: Power BI creates a card visual showing the sum. Drag `State` onto the same visual: it becomes a bar chart. That is the entire loop of Power BI: load, drag, look.

Save the file with `Ctrl+S`. The result is a `.pbix`, which is a ZIP containing the data model, the report layout and the imported data. A `.pbix` of a 500 000-row production table is often under 10 MB because the storage engine compresses columns heavily.

```text
Get data  →  Transform (Power Query)  →  Load into model  →  Build visuals  →  Publish
```

That pipeline is the shape of every chapter that follows. Power Query owns "shape the data", the model owns "relate and calculate", and the report owns "show".

### Import versus DirectQuery

When you connect to a database Desktop asks for a **storage mode**:

- **Import** copies the data into the file. Fast, works offline, needs refresh to see new rows. Use it by default.
- **DirectQuery** sends a query to the source every time a visual renders. Always current, but slower and only some DAX works. Use it for very large or real-time sources.

> **Tip:** Keep a scratch `.pbix` where you test ideas before touching the management report. Desktop has no branching, so an experiment on the real file that you cannot undo means restoring from a backup copy.

### Try It Yourself

```dax
// Your first measure: paste this in Report view → Modeling → New measure
Total Files = SUM ( Production[FilesCompleted] )
```

### Quiz

1. Which component is used to author a `.pbix` report?
- [x] Power BI Desktop
- [ ] Power BI Mobile
- [ ] Power BI Service
> Desktop is the free Windows authoring tool; the Service hosts and shares what Desktop publishes.

2. What does a Free licence allow?
- [ ] Publishing to any shared workspace
- [x] Publishing only to My workspace, without sharing
- [ ] Nothing at all in the Service
> Free users can publish to their personal workspace but cannot share content or publish to shared workspaces; that needs Pro or PPU.

3. Which storage mode copies data into the file?
- [x] Import
- [ ] DirectQuery
- [ ] Live connection
> Import loads a compressed copy into the VertiPaq engine, so the report works offline and renders fastest.

### Exercises

1. **Install and inspect** — Install Power BI Desktop from the Microsoft Store, open it, and write down the version shown under Help → About and the names of the three views in the left rail.
<details><summary>Solution</summary>

The version reads like `2.14x.xxxx.0 64-bit (Month Year)`. The three views are Report view, Table view and Model view. Knowing the version matters because `.pbix` files are not always backward compatible.

</details>

2. **First card** — Load any CSV with a numeric column and produce a card visual that shows its total, then convert it to a bar chart split by a text column.
<details><summary>Solution</summary>

Get data → Text/CSV → Load. Drag the numeric field to the canvas (card appears). With the card selected, click the *Clustered bar chart* icon in Visualizations, then drag the text field to the Y-axis well.

</details>

### Interview Questions

**Q: What is the difference between Power BI Desktop and Power BI Service?**
Desktop is the free Windows application where you connect, transform, model and design; it produces a `.pbix`. The Service is the cloud tenant where the `.pbix` is published: it handles workspaces, sharing, apps, dashboards, scheduled refresh, gateways and row-level security assignment. Some things exist only in one place. Dataflows, deployment pipelines and scheduled refresh live only in the Service; Power Query authoring, DAX authoring and page design live mainly in Desktop, although the Service now allows light editing. A strong answer also notes licensing: publishing to a shared workspace and consuming it both require Pro (or PPU, or a Premium/Fabric capacity for free viewers).

**Q: When would you choose DirectQuery over Import?**
Choose DirectQuery when the data is too large to import within refresh windows, when the business needs near-real-time figures, or when security policy forbids copying data out of the source. The trade-offs are slower visuals (every interaction becomes a SQL query), a limited DAX surface, and heavy load on the source. For a weekly production dashboard built from an Excel export, Import is the right call; for a 2-billion-row telemetry table in Synapse, DirectQuery or a hybrid table makes more sense. A composite model can mix both.

**Q: What is inside a .pbix file?**
It is a ZIP archive. It contains the compressed data model (the VertiPaq tables, if Import mode), the Power Query M definitions, the DAX measures, the report layout JSON, and metadata such as the Desktop version. Because the data is inside, a `.pbix` can be large and should not be emailed around; publish to the Service instead. Since 2023 there is also the `.pbip` project format, which splits the model and report into text files that work with git.

## Getting data and Power Query basics

Every Power BI report starts by importing data, and almost every import needs cleaning. **Power Query** is the transformation tool built into Desktop (the same engine that lives in Excel under Data → Get & Transform). You open it with **Home → Transform data**. It records each cleaning step you click, writes it in a language called **M**, and replays the whole recipe on every refresh.

### Connecting to a source

**Home → Get data** lists more than a hundred connectors. The ones an analyst uses weekly:

| Connector | Typical use |
|---|---|
| Excel workbook | The daily production tracker, rate sheets |
| Text/CSV | System exports, agent QA logs |
| Folder | A folder of identical daily CSVs combined into one table |
| SQL Server | Operational databases |
| SharePoint folder / list | Team files stored in SharePoint |
| Web | A public table or a REST API returning JSON |

Choose Excel, pick the file, and the **Navigator** shows each sheet and named table. Tick the sheet, then choose **Transform Data** (opens Power Query) rather than **Load** so you can inspect before importing.

### The Power Query Editor

The editor has four areas: the **Queries** list on the left, the data preview in the middle, the **Applied Steps** list on the right, and the ribbon on top. Each ribbon click adds a step. Click any step to see the data as it was at that point. Delete a step with the small X. Right-click a step to rename it so that `Removed Columns1` becomes `Drop audit columns`.

### The five steps you will always take

1. **Promote headers** — if the first row holds column names: Home → Use First Row as Headers.
2. **Fix data types** — click the icon at the left of a column header. A date column stored as text must become **Date**; a number-as-text must become **Whole Number** or **Decimal Number**. Type errors show as `Error` cells.
3. **Remove columns** — select the ones you keep, then Home → Remove Columns → Remove Other Columns.
4. **Filter rows** — the drop-down arrow on a column header removes blanks, totals rows and test data.
5. **Rename** — double-click a header. Names become the labels in your visuals, so write `Files Completed`, not `fls_cmp`.

Here is what those steps look like in M, visible under **View → Advanced Editor**:

```powerquery
let
    Source = Excel.Workbook(File.Contents("C:\Reports\Production.xlsx"), null, true),
    Sheet = Source{[Item="Daily",Kind="Sheet"]}[Data],
    Headers = Table.PromoteHeaders(Sheet, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Headers, {{"Date", type date}, {"Files", Int64.Type}, {"Errors", Int64.Type}}),
    Kept = Table.SelectColumns(Typed, {"Date", "State", "Agent", "Files", "Errors"}),
    NoBlanks = Table.SelectRows(Kept, each [Date] <> null)
in
    NoBlanks
```

Each line is one applied step, named on the left of the `=`. The `in` line names the step that becomes the output. You rarely write M by hand at this stage, but reading it tells you exactly what the recipe does.

### Combining a folder of daily files

Production systems often produce one CSV per day. Choose **Get data → Folder**, point at the folder, and click **Combine & Transform**. Power Query builds a helper function, applies it to each file, and stacks them with a `Source.Name` column telling you which file each row came from. Tomorrow's file appears automatically after a refresh.

### Locale and dates

A file created in a US system writes `03/04/2026` meaning 4 March. Pakistani Windows may read that as 3 April. Use **Change Type → Using Locale**, choose Date and *English (United States)*, and the parse becomes unambiguous. This single setting fixes more "wrong month" complaints than any other.

> **Warning:** Power Query previews the first 1 000 rows. A column that looks clean in the preview may contain text in row 40 000 and produce `Error` after Load. Always check the **Column quality** and **Column profile** toggles under View, and set profiling to the *entire data set* via the status bar.

### Close and apply

**Home → Close & Apply** runs the recipe and loads the result into the model. Later changes to the source file are picked up with **Home → Refresh** in Desktop. Nothing you did in Power Query alters the source file; it is read-only.

### Try It Yourself

```powerquery
// Paste into Home → New Source → Blank Query → Advanced Editor
let
    Source = #table(
        {"Date", "State", "Files"},
        {{"2026-03-02", "TX", "41"}, {"2026-03-02", "WY", "12"}, {"2026-03-03", "TX", "38"}}
    ),
    Typed = Table.TransformColumnTypes(Source, {{"Date", type date}, {"Files", Int64.Type}}),
    Totals = Table.Group(Typed, {"State"}, {{"Total Files", each List.Sum([Files]), Int64.Type}})
in
    Totals
```

### Quiz

1. Where does Power BI record the cleaning steps you click?
- [ ] In a DAX measure
- [x] In the Applied Steps list, written in M
- [ ] In the Filters pane
> Each ribbon action becomes an M step that replays on every refresh.

2. Why prefer Transform Data over Load in the Navigator?
- [x] To inspect and fix data types before importing
- [ ] Load is not available for Excel
- [ ] Transform Data is faster
> Loading without inspection lets wrong types and totals rows into the model.

3. Which connector stacks many identical daily CSVs into one table?
- [ ] Web
- [ ] Text/CSV
- [x] Folder
> Folder with Combine & Transform builds a function applied to every file.

### Exercises

1. **Clean an export** — Import a CSV whose first row is a title, second row is headers, and last row is a "Total" line. Produce a clean typed table.
<details><summary>Solution</summary>

Home → Remove Rows → Remove Top Rows (1); Home → Use First Row as Headers; filter the first column to exclude "Total"; set the types; rename columns; Close & Apply.

</details>

2. **US dates** — A column holds `03/04/2026` meaning 4 March. Convert it correctly.
<details><summary>Solution</summary>

Right-click the header → Change Type → Using Locale → Data Type: Date, Locale: English (United States). Verify that the row now shows 4 March 2026 in the preview.

</details>

### Interview Questions

**Q: What is the difference between Power Query and DAX?**
Power Query (M) runs before load: it shapes rows and columns, cleans text, merges tables and combines files, and its output is materialised into the model on refresh. DAX runs after load, at query time, computing measures and calculated columns against the stored model. Rule of thumb: do it as far upstream as possible. Cleaning, unpivoting and type fixes belong in Power Query; business calculations that must respond to slicers belong in DAX measures. A candidate should mention that M is case-sensitive and functional, and that Power Query steps can fold to the source as SQL (query folding) when the connector supports it.

**Q: What is query folding and why do you care?**
Query folding is when Power Query translates your applied steps into a single native query (usually SQL) that the source executes, instead of pulling all rows and transforming them locally. It makes refresh dramatically faster and is required for incremental refresh to work. Steps like filtering, column removal and grouping fold; steps like adding an index column or calling a custom M function usually break folding, and every step after the break runs locally. Right-click a step and check whether **View Native Query** is enabled to see whether folding is still happening.

**Q: How would you handle a folder of daily production exports whose column order changes between months?**
Use the Folder connector with Combine, but edit the generated *Transform Sample File* query so that it selects columns by name rather than position, and applies `Table.SelectColumns` with `MissingField.Ignore` for columns that may be absent. Promote headers before selecting, so the names are stable. Add a validation query that lists distinct column names across files to detect a new schema before it corrupts the report.

## Data model view and relationships

Once tables are loaded, Power BI needs to know how they connect. That is the **data model**, and you edit it in **Model view**. A model with correct relationships lets you drop `State` from one table and `Premium` from another into the same chart and get the right numbers. A model with wrong relationships produces the same number repeated on every row, which is the most common beginner bug.

### Why not one big table?

You could flatten everything into a single 40-column table in Power Query. That works for tiny data, but it repeats agent names and state names on every row, makes the file larger, and makes it awkward to add a second fact such as QA errors. Instead, keep **fact tables** (events: one row per file completed, per QA check, per invoice) separate from **dimension tables** (who, what, where, when: agents, states, dates) and connect them.

### Creating a relationship

Load two tables: `Production` (Date, AgentID, State, Files) and `Agents` (AgentID, AgentName, Team, Shift). In Model view, drag `AgentID` from `Production` onto `AgentID` in `Agents`. A line appears with a **1** at the Agents end and a **\*** at the Production end. Power BI also auto-detects relationships on load when column names match; check them, because auto-detection is sometimes wrong.

Double-click the line to open the relationship editor:

| Setting | Options | Meaning |
|---|---|---|
| Cardinality | One-to-many, Many-to-one, One-to-one, Many-to-many | How many rows on each side share a key |
| Cross-filter direction | Single, Both | Which way filters travel |
| Make this relationship active | On/Off | Only one active path may exist between two tables |
| Assume referential integrity | On/Off | DirectQuery only: allows inner joins |

### One-to-many and filter direction

In a one-to-many relationship, the **one** side is the dimension (each AgentID appears once) and the **many** side is the fact. Filters flow from the one side to the many side: select an agent, and the Production rows filter to that agent. That is the direction you want almost all of the time. Setting cross-filter to **Both** is tempting but slows the model and creates ambiguity; leave it Single unless you have a specific reason.

### Inactive relationships

A `Production` table might have both `CompletedDate` and `ReceivedDate`. Both can relate to the `Date` table, but only one can be active. The second shows as a dashed line. You activate it inside a measure with `USERELATIONSHIP`:

```dax
Files by Received Date =
CALCULATE (
    SUM ( Production[Files] ),
    USERELATIONSHIP ( Production[ReceivedDate], 'Date'[Date] )
)
```

### Checking a relationship works

Build a table visual with `Agents[AgentName]` and `Production[Files]`. If every agent shows the same grand total, the relationship is missing, inactive, or the key columns have different data types (a text `AgentID` will not match a numeric one). Fix the types in Power Query.

```text
Agents (1)  ──AgentID──>  (*) Production  <──Date──  (1) Date
States (1)  ──StateCode──>  (*) Production
```

This is the shape called a **star schema**: facts in the middle, dimensions around them. The Intermediate level goes into designing one properly.

### Hiding and organising

In Model view, right-click a column and choose **Hide in report view** for keys such as `AgentID` that users should never drag into a visual. Mark the `Date` table as a date table via **Table tools → Mark as date table** so time-intelligence functions work. Set the **Sort by column** of `MonthName` to `MonthNumber` so months order correctly instead of alphabetically.

> **Interview note:** Interviewers love asking why a bar chart shows the same value in every bar. The answer is always a relationship problem: missing, inactive, wrong direction, or key type mismatch.

### Try It Yourself

```dax
// A relationship test measure: returns the number of Production rows
// that have no matching agent in the Agents dimension.
Orphan Rows =
CALCULATE (
    COUNTROWS ( Production ),
    ISBLANK ( RELATED ( Agents[AgentName] ) )
)
```

### Quiz

1. In a one-to-many relationship, which side is the dimension table?
- [x] The one side
- [ ] The many side
- [ ] Either side
> Dimensions have unique keys (one row per agent); facts repeat the key many times.

2. Every bar in your chart shows the same number. Most likely cause?
- [ ] The measure uses SUM instead of AVERAGE
- [x] The relationship is missing, inactive or the keys do not match
- [ ] The visual needs a slicer
> Without a working relationship the filter from the dimension never reaches the fact table.

3. How many active relationships can exist between two tables?
- [x] One
- [ ] Two
- [ ] Unlimited
> Additional paths are inactive and activated per measure with USERELATIONSHIP.

### Exercises

1. **Build the star** — Load `Production`, `Agents` and `States` tables and create the two relationships, then verify with a table visual.
<details><summary>Solution</summary>

Model view: drag `Production[AgentID]` to `Agents[AgentID]` and `Production[State]` to `States[StateCode]`. Both should show 1 to *, single direction. Table visual with `Agents[Team]` and `Sum of Files` must show different totals per team.

</details>

2. **Two dates** — Relate both `CompletedDate` and `ReceivedDate` to the Date table and write a measure that counts files by received date.
<details><summary>Solution</summary>

Create both relationships; the second becomes inactive automatically. Measure: `CALCULATE(COUNTROWS(Production), USERELATIONSHIP(Production[ReceivedDate], 'Date'[Date]))`.

</details>

### Interview Questions

**Q: Explain cross-filter direction and when you would use Both.**
Single direction means filters travel from the one side to the many side only: choosing a state filters production rows, but choosing a production row does not filter states. Both lets filters travel either way. It is useful when a slicer on a dimension must be limited by a second dimension through a fact table (show only agents who worked in the selected state), or for some many-to-many designs. The costs are performance, ambiguity when several paths exist, and unexpected filtering. Best practice is to keep Single and use `CROSSFILTER` inside a measure when bidirectional behaviour is needed for one calculation.

**Q: What are the requirements for a column to be on the one side of a relationship?**
The column must contain unique values with no duplicates and at most one blank; otherwise Desktop refuses to create the relationship or forces many-to-many. The data type should match the many-side column exactly (integer to integer, text to text). Good practice is to use integer surrogate keys because they compress better in VertiPaq and compare faster than text. If duplicates exist, fix them in Power Query with Remove Duplicates after deciding which row wins.

**Q: What does marking a table as a date table do?**
It tells the engine which column is the contiguous date key so that time-intelligence functions like `TOTALYTD`, `SAMEPERIODLASTYEAR` and `DATEADD` can operate on it, and it disables the automatic hidden date hierarchies for that table. The column must be of type Date, have no blanks, no duplicates and cover every day between its minimum and maximum. Without marking, time intelligence may still work through the relationship but is less reliable and auto date/time bloats the model.

## Your first visuals: bar, line, card and table

A visual is a chart or table on the report canvas. Each visual has **field wells** (Axis, Legend, Values, Tooltips) and each well accepts columns or measures from the Data pane. The trick to Power BI is choosing the right visual for the question and dropping the right fields into the right wells.

### Card: one number

A **card** shows a single value. Managers read the card before anything else, so use it for headline KPIs: *Files completed this week*, *Accuracy %*, *Backlog*. Click the card icon in Visualizations, drag `Files` into the Fields well. To show accuracy rather than a raw sum, drag a measure (covered in Intermediate) instead. Format → Callout value lets you set decimals and display units (thousands, millions).

### Clustered bar or column: compare categories

Bar charts compare values across categories. Choose **Clustered column chart**, put `State` on the X-axis and `Files` in Y-axis. Sort by clicking **… → Sort axis → Sort by Files** so the largest state comes first. Use bars (horizontal) when category labels are long, such as county names, so the text does not rotate.

Add `Team` to the **Legend** well and each state splits into one bar per team. Change to **Stacked column** when you want the total height to matter more than the per-team comparison.

### Line chart: trend over time

Put `Date` on the X-axis and `Files` on Y-axis. Power BI builds a date hierarchy (Year → Quarter → Month → Day); click the **Expand all down** arrow in the visual header to show months. Add `State` to Legend for one line per state. A line chart with more than five lines is unreadable; filter or use a small multiple instead.

### Table and matrix

A **table** lists rows and columns exactly as fields are dropped. A **matrix** is a pivot table: rows, columns and values with subtotals. Put `Agent` in Rows, `Week` in Columns and `Files` in Values and you have the classic weekly production sheet. Right-click a value → **Conditional formatting → Background color** to colour cells below target.

| Question | Visual | Fields |
|---|---|---|
| How many files this week? | Card | Files |
| Which state is biggest? | Bar/column | State, Files |
| Is volume rising? | Line | Date, Files |
| Agent by week detail | Matrix | Agent, Week, Files |
| Share of total | Donut (max 5 slices) | Team, Files |

### Aggregation and implicit measures

When you drop a numeric column into Values, Power BI applies a default aggregation, usually **Sum**. Click the field's drop-down in the well to change it to Average, Count, Min, Max, Count (Distinct). These are called **implicit measures**. They are convenient but cannot be reused; the Intermediate level replaces them with explicit DAX measures.

```dax
// Explicit measure equivalent to the implicit "Average of Files"
Avg Files per Row = AVERAGE ( Production[Files] )
```

Once you have one explicit measure, it appears with a calculator icon in the Data pane and can be dropped into any visual on any page.

### Formatting essentials

Select the visual, open the **Format** pane (paint-roller icon). The settings you change most:

- **Title**: turn on and write what the reader should see, e.g. *Files completed by state, last 4 weeks*.
- **Data labels**: on for bars and cards, off for dense line charts.
- **Y-axis start**: never start a bar axis above zero; it exaggerates differences.
- **Colors**: one colour for a single series; reserve red for problems.

> **Tip:** Hold `Ctrl` and click several visuals, then use **Format → Align** and **Distribute** to line them up. A tidy grid reads as professional even before any styling.

### Try It Yourself

```dax
// Three explicit measures to replace implicit aggregations
Total Files  = SUM ( Production[Files] )
Total Errors = SUM ( Production[Errors] )
Accuracy %   = DIVIDE ( [Total Files] - [Total Errors], [Total Files] )
```

### Quiz

1. Which visual shows one headline number?
- [ ] Matrix
- [x] Card
- [ ] Line chart
> A card displays a single aggregated value such as total files or accuracy.

2. You have long county names as categories. Which visual is better?
- [x] Clustered bar chart (horizontal)
- [ ] Clustered column chart (vertical)
- [ ] Donut chart
> Horizontal bars keep long labels readable without rotation.

3. What is the default aggregation when a number column is dropped into Values?
- [x] Sum
- [ ] Average
- [ ] Count
> Numeric columns default to Sum; text columns default to Count.

### Exercises

1. **Weekly matrix** — Build a matrix with agents as rows, weeks as columns and files as values, coloured red where a cell is below 30.
<details><summary>Solution</summary>

Matrix visual; Rows: Agent; Columns: Date hierarchy at week level or a `Week` column; Values: Total Files. Then Values → Conditional formatting → Background color → Rules: if value < 30 then red.

</details>

2. **Trend page** — Create a line chart of files per month for the current year with one line per state, limited to the top 3 states.
<details><summary>Solution</summary>

Line chart: X-axis Date (expand to Month), Y-axis Total Files, Legend State. Filters pane → State → Filter type Top N → Top 3 by Total Files. Add a page-level filter Year = current.

</details>

### Interview Questions

**Q: What is the difference between a table and a matrix visual?**
A table is flat: one column per field, no pivoting, no subtotals by default. A matrix is a pivot: fields in Rows and Columns cross-tabulate and Values fill the grid, with expandable hierarchies and row/column subtotals. Use a table for detail listings such as the last 20 files with errors, and a matrix for agent-by-week or state-by-month summaries. Matrices also support stepped layout and drill down on rows, which tables do not.

**Q: Why should you prefer explicit measures over implicit aggregations?**
Explicit measures are reusable across visuals and pages, can be referenced by other measures, carry consistent formatting, appear in the Data pane with a clear name, and are the only kind visible to Excel Analyze in Excel and to other reports connecting live to the dataset. Implicit measures are recreated per visual, so *Accuracy %* defined as an implicit average would silently compute the wrong thing (an average of ratios rather than a ratio of totals). Analysts working on shared datasets are usually asked to disable implicit measures entirely.

**Q: How do you decide which chart to use?**
Start from the question the reader asks. Comparison across categories: bar or column. Change over time: line. Single value against target: card or KPI. Part of whole with few parts: stacked bar or donut with at most five slices. Detail: table or matrix. Then check readability: fewer than six series per chart, axes starting at zero for bars, one colour unless the colour carries meaning. A concrete example is a weekly production dashboard: cards for volume, accuracy and backlog on top; a column chart by state; a line of daily volume; and a matrix of agents at the bottom for drill-down.

## Slicers, filters and interactions

Interactivity is what separates a Power BI report from a PDF. A reader clicks a state in one chart and every other visual updates. A slicer lets them choose a week. This chapter explains the three ways filtering happens and how to control it.

### Slicers

A **slicer** is a visual whose only job is to filter other visuals. Add one via the slicer icon and drop `State` into the field well. Slicer styles (Format → Slicer settings → Style):

| Style | Best for |
|---|---|
| Vertical list | Short lists, multi-select with Ctrl-click |
| Dropdown | Long lists, saves canvas space |
| Tile | A handful of options shown as buttons |
| Between / Before / After | Date or numeric ranges with a slider |
| Relative date | "Last 4 weeks", "This month" |

Turn on **Select all** and **Single select** in Slicer settings when appropriate. A date slicer set to *Relative date → Last 4 weeks* is the standard way to make a weekly report open on the right window without anyone editing it.

### The Filters pane

The **Filters pane** on the right has three levels:

- **Filters on this visual**: apply only to the selected visual.
- **Filters on this page**: apply to every visual on the page.
- **Filters on all pages**: apply to the whole report.

Drag a field into a level and pick a filter type: Basic (tick values), Advanced (contains, greater than, is blank), Top N, or Relative date. A filter on all pages for `Status = "Complete"` is how you exclude test rows once and for all. You can hide or lock a filter so readers cannot change it (the lock and eye icons).

### Cross-filtering and cross-highlighting

Click a bar in the *Files by State* chart. Other visuals react in one of two ways:

- **Cross-highlight**: the other chart keeps all bars but highlights the portion belonging to the selected state. This is the default for bar and column charts.
- **Cross-filter**: the other visual filters to only the selected state. Cards, tables and matrices always filter.

Change the default under **File → Options → Report settings → Change default visual interaction from cross highlighting to cross filtering**. Most management readers understand filtering better than highlighting.

### Edit interactions

Sometimes one visual should not react to another. A card showing *Company total* must not change when the user clicks a state. Select the source visual, then **Format → Edit interactions**. Every other visual shows three small icons in its corner: filter, highlight, none. Click **none** on the card. Repeat for each source visual that should leave it alone.

```text
Source visual clicked  →  Target visual reacts:
   filter    (funnel icon)     target shows only the clicked value
   highlight (bar icon)        target dims the rest
   none      (circle icon)     target ignores the click
```

### Sync slicers across pages

A report with five pages should not require choosing the week five times. Select the slicer, open **View → Sync slicers**, and tick the pages where it should apply and be visible. The slicer's selection then travels with the reader.

### Persisting selection

By default the Service remembers each reader's last slicer state (**Persistent filters**). Readers can reset with the **Reset to default** button in the top bar. If you want everyone to always open on the same view, disable persistence under File → Options → Report settings.

> **Warning:** A slicer with **Single select** off and nothing selected means *no filter*, not *nothing selected*. Readers sometimes think the empty slicer is broken. Label it with a title such as *State (all when empty)*.

### Try It Yourself

```dax
// Measure that reports the current slicer selection for a page title
Selected State =
IF (
    ISFILTERED ( States[StateName] ),
    CONCATENATEX ( VALUES ( States[StateName] ), States[StateName], ", " ),
    "All states"
)
```

### Quiz

1. Which Filters pane level applies to every page?
- [ ] Filters on this visual
- [ ] Filters on this page
- [x] Filters on all pages
> Report-level filters affect all pages; use them for permanent exclusions like test data.

2. A total card must not change when a user clicks a state bar. What do you use?
- [x] Edit interactions and set the card to None
- [ ] Delete the relationship
- [ ] Lock the slicer
> Edit interactions controls how each target visual responds to each source visual.

3. What does cross-highlighting do?
- [ ] Removes non-selected bars from other charts
- [x] Dims non-selected portions while keeping the full bars visible
- [ ] Changes the colour of the selected slicer
> Highlighting keeps context; filtering removes it. The default can be switched in report settings.

### Exercises

1. **Relative week slicer** — Add a date slicer that always shows the last 4 calendar weeks and sync it across all pages.
<details><summary>Solution</summary>

Slicer visual with `Date[Date]`; Slicer settings → Style: Relative date; choose Last, 4, Weeks (calendar). View → Sync slicers → tick Sync and Visible for every page.

</details>

2. **Locked exclusion** — Ensure no reader can include rows where `Agent = "TEST"` on any page.
<details><summary>Solution</summary>

Filters on all pages → drag `Agent` → Basic filtering → tick everything except TEST (or Advanced: is not TEST) → click the lock icon and the hide icon so it cannot be edited or seen.

</details>

### Interview Questions

**Q: What is the difference between a slicer and a filter in the Filters pane?**
Both restrict the data a visual sees, but a slicer is a visual on the canvas that readers interact with directly and can be synced across pages, while the Filters pane is a side panel with visual, page and report scopes that can be hidden or locked from readers. Slicers take canvas space and support styles such as relative date ranges and tiles; pane filters support Top N and advanced conditions. Use slicers for choices the audience makes every time (week, state, team) and pane filters for author-controlled scope such as excluding test rows.

**Q: How do you stop one visual from filtering another?**
Select the source visual and choose Format → Edit interactions, then click the None icon on the target visual. This is set per source-target pair, so a page with ten visuals may need several passes. Typical uses are a company total card that should stay fixed, or a reference line chart that should not respond to a category click. A related technique inside DAX is `ALL` or `REMOVEFILTERS` in a measure to compute a total ignoring the current selection, which is the right choice when only one measure, not the whole visual, should ignore the filter.

**Q: Why might a slicer show values that have no data?**
Because a slicer lists the distinct values of the dimension column regardless of whether any fact rows relate to them, unless cross-filter direction is Both or the slicer is itself filtered. Options include filtering the slicer visual by a measure such as Total Files is not blank, enabling bidirectional filtering on that one relationship, or cleaning the dimension in Power Query so retired agents or unused states are flagged and excluded. The first option is safest for performance.

# LEVEL: Intermediate

## Star schema and fact and dimension design

Beginner chapters loaded whatever the export gave you. Intermediate work starts with designing the model deliberately, and the design that Power BI is built to run fastest is the **star schema**: one or more **fact tables** in the centre, each surrounded by **dimension tables** joined on single-column keys. Every DAX function, every visual and every performance feature assumes this shape.

### Facts and dimensions

A **fact** is a measurable event with numbers you aggregate: a file completed, a QA check performed, a policy issued with a premium. Fact tables are long (many rows) and narrow (keys plus numeric columns). A **dimension** describes the context of the event: which agent, which state, which underwriter, which date. Dimensions are short and wide, with one row per entity and descriptive text columns.

| Table | Type | Grain (one row per) | Example columns |
|---|---|---|---|
| `FactProduction` | Fact | Agent per file per day | DateKey, AgentKey, StateKey, Files, Errors, MinutesWorked |
| `FactQA` | Fact | QA check | DateKey, AgentKey, CheckerKey, Passed, DefectType |
| `DimAgent` | Dimension | Agent | AgentKey, AgentName, Team, Shift, HireDate |
| `DimState` | Dimension | State | StateKey, StateCode, StateName, Region, Underwriter |
| `DimDate` | Dimension | Calendar day | DateKey, Date, Year, MonthNumber, MonthName, WeekOfYear, IsWorkingDay |

Both fact tables share `DimDate` and `DimAgent`. That sharing is the point: one date slicer filters production and QA together, and a measure such as *Defects per 100 files* can divide a number from `FactQA` by a number from `FactProduction`.

### Grain

The **grain** is what one fact row represents. Decide it first and write it down. If `FactProduction` is one row per agent per day, you cannot later ask "which file took longest", because file detail is not in the grain. If you need both, keep two facts at two grains rather than mixing them. Mixed grain is the source of double-counted totals.

### Keys

Use integer surrogate keys (`AgentKey = 17`) rather than text (`"Ali Raza"`) to join. Integers compress better, compare faster and survive a name change. Generate them in Power Query with **Add Column → Index Column** on the dimension, then merge into the fact to look up the key. Keep the natural key (`AgentID` from HR) as a normal column in the dimension for reference.

### Snowflakes and why to flatten them

A snowflake is a dimension that itself references another dimension: `DimState → DimRegion → DimCountry`. Power BI handles it, but each extra hop costs performance and confuses users. Flatten it in Power Query by merging `Region` and `Country` into `DimState` as columns. The result is a pure star.

### Role-playing dimensions

`FactProduction` has `ReceivedDateKey` and `CompletedDateKey`. Both point to `DimDate`. The date dimension is said to play two roles. Options: one active relationship plus `USERELATIONSHIP` in measures (compact, the usual choice), or two physical copies `DimReceivedDate` and `DimCompletedDate` created by referencing the same query (clearer for readers, doubles the slicers).

### Building it in Power Query

```powerquery
// DimAgent from the HR export: distinct agents plus a surrogate key
let
    Source = Excel.Workbook(File.Contents("C:\Reports\HR.xlsx"), null, true),
    Agents = Source{[Item="Agents",Kind="Sheet"]}[Data],
    Headers = Table.PromoteHeaders(Agents, [PromoteAllScalars=true]),
    Distinct = Table.Distinct(Table.SelectColumns(Headers, {"AgentID", "AgentName", "Team", "Shift"})),
    Keyed = Table.AddIndexColumn(Distinct, "AgentKey", 1, 1, Int64.Type)
in
    Keyed
```

Then in the fact query: **Home → Merge Queries** on `AgentID`, expand only `AgentKey`, and remove the text `AgentID` column from the fact. The fact now carries a 4-byte integer instead of a repeated name.

### Hide, sort and format at model level

After relationships are set: hide every key column, set `MonthName` to sort by `MonthNumber`, set default formats (`Files` as whole number with thousands separator, `Premium` as currency), and create display folders in Model view so *Measures* group by topic. Doing this once in the model means every visual inherits it.

> **Interview note:** "Why star schema?" is the first modelling question in most Power BI interviews. Answer with three points: VertiPaq compresses narrow facts and low-cardinality dimensions best, single-direction one-to-many relationships are unambiguous for filter propagation, and DAX time intelligence and `RELATED` assume the pattern.

### Try It Yourself

```dax
// Cross-fact measure that works because both facts share DimAgent and DimDate
Defects per 100 Files =
DIVIDE (
    SUM ( FactQA[Defects] ),
    SUM ( FactProduction[Files] )
) * 100
```

### Quiz

1. Which table type is long and narrow?
- [x] Fact
- [ ] Dimension
- [ ] Date
> Facts hold many event rows with keys and numbers; dimensions are short and descriptive.

2. What is the grain of a fact table?
- [ ] Its number of columns
- [x] What one row represents
- [ ] Its refresh frequency
> Grain defines the level of detail, e.g. one row per agent per day.

3. Why prefer integer surrogate keys?
- [ ] DAX cannot join on text
- [x] Better compression, faster comparison, stable when names change
- [ ] Power Query requires them
> Text keys work, but integers are smaller in VertiPaq and survive renames.

### Exercises

1. **Design the schema** — Given a raw export with columns Date, AgentName, Team, State, Region, Underwriter, Files, Errors, list the fact and dimension tables you would build and their keys.
<details><summary>Solution</summary>

`FactProduction(DateKey, AgentKey, StateKey, Files, Errors)`; `DimAgent(AgentKey, AgentName, Team)`; `DimState(StateKey, State, Region, Underwriter)`; `DimDate(DateKey, Date, Year, Month, Week)`. Region and Underwriter are flattened into DimState rather than snowflaked.

</details>

2. **Second date role** — Add `ReceivedDate` to the fact and write a measure that counts files received in the selected period.
<details><summary>Solution</summary>

Create an inactive relationship `FactProduction[ReceivedDateKey] → DimDate[DateKey]`. Measure: `Files Received = CALCULATE(SUM(FactProduction[Files]), USERELATIONSHIP(FactProduction[ReceivedDateKey], DimDate[DateKey]))`.

</details>

### Interview Questions

**Q: What is a star schema and why does Power BI prefer it?**
A star schema has central fact tables with numeric measures and foreign keys, joined one-to-many to surrounding dimension tables that carry descriptive attributes. Power BI prefers it because VertiPaq compresses low-cardinality dimension columns and narrow fact tables extremely well, single-direction relationships give unambiguous filter propagation, and DAX patterns such as time intelligence, `RELATED` and `USERELATIONSHIP` assume this structure. In practice a 2-million-row flat table with 40 columns might occupy 400 MB, while the same data as a star can be under 100 MB and render visuals several times faster.

**Q: How do you handle a many-to-many relationship, such as files that belong to several underwriters?**
The classic solution is a bridge table: `BridgeFileUnderwriter(FileKey, UnderwriterKey)` joined one-to-many from both `DimFile` and `DimUnderwriter`, with the bridge-to-dimension relationship set to bidirectional or handled with `CROSSFILTER` inside measures. Power BI also offers a native many-to-many cardinality since 2018, which is simpler but hides the ambiguity and can produce unexpected totals. I would use the bridge for anything that feeds management numbers and document how the totals behave when a file counts under two underwriters.

**Q: What is a slowly changing dimension and how would you model an agent moving teams?**
A slowly changing dimension tracks attribute changes over time. Type 1 overwrites (the agent now shows the new team for all history), Type 2 adds a new row with validity dates and a new surrogate key so historical production stays with the old team. For team performance reporting Type 2 is correct, because last quarter's numbers should not move when an agent transfers. Implementation: the HR export includes `EffectiveFrom` and `EffectiveTo`, the fact merge looks up the key where the production date falls within that range, and the current row is flagged `IsCurrent` for slicers.

## DAX basics: calculated columns versus measures

**DAX** (Data Analysis Expressions) is the formula language of the Power BI model. It looks like Excel formulas but operates on whole tables and columns instead of cells. There are two things you can create with it, and choosing the wrong one is the classic intermediate mistake.

### Calculated columns

A calculated column is evaluated **once per row when the data refreshes**, and the result is stored in the model like any imported column. Create one with **Table tools → New column**:

```dax
Accuracy Flag =
IF ( FactProduction[Errors] = 0, "Clean", "Has errors" )
```

The formula sees one row at a time (this is **row context**), so `FactProduction[Errors]` means "the Errors value on this row". Use calculated columns when you need a value to slice, group or filter by, such as a category, a bucket, or a flag. They cost memory because every row stores the result.

### Measures

A measure is evaluated **at query time**, once per cell of a visual, using whatever filters that cell has (this is **filter context**). Create one with **New measure**:

```dax
Total Files = SUM ( FactProduction[Files] )
```

Nothing is stored. When the measure sits in a matrix with agents on rows and weeks on columns, it is recalculated for every agent-week cell, each seeing only that agent's rows for that week. Measures respond to slicers; calculated columns do not.

| | Calculated column | Measure |
|---|---|---|
| Evaluated | On refresh, per row | On query, per visual cell |
| Stored | Yes (uses RAM) | No |
| Sees | Row context | Filter context |
| Reacts to slicers | No | Yes |
| Use for | Categories, flags, keys | Sums, ratios, KPIs |

### The aggregators

| Function | Returns |
|---|---|
| `SUM(col)` | Total of a numeric column |
| `AVERAGE(col)` | Arithmetic mean, ignoring blanks |
| `MIN(col)` / `MAX(col)` | Smallest / largest value |
| `COUNT(col)` | Non-blank numeric values |
| `COUNTROWS(table)` | Number of rows in the table |
| `DISTINCTCOUNT(col)` | Number of distinct values |
| `DIVIDE(a, b, [alt])` | `a / b`, returning `alt` (default blank) when `b` is 0 |

```dax
Files per Agent =
DIVIDE ( [Total Files], DISTINCTCOUNT ( FactProduction[AgentKey] ) )

Accuracy % =
DIVIDE ( [Total Files] - SUM ( FactProduction[Errors] ), [Total Files] )
```

`DIVIDE` instead of `/` matters: an agent with zero files would otherwise produce an error or infinity in the visual. Format `Accuracy %` as a percentage with one decimal in the Measure tools ribbon.

### Measures referencing measures

`[Total Files]` in square brackets without a table name is a measure reference. Build small measures and compose them. If the definition of *Total Files* changes (say, excluding cancelled files), every measure built on it updates automatically. This is why the earlier chapter said to avoid implicit aggregations.

### Where to put measures

Measures belong to a table but do not need to be related to it. Create an empty table via **Enter data** named `_Measures`, put all measures there, and hide its one column. It floats to the top of the Data pane with a calculator icon.

### Common errors

- *"A single value for column X cannot be determined"*: you used a column where a measure expected a scalar. Wrap it in an aggregator or use `SELECTEDVALUE`.
- *"The expression refers to multiple columns"*: you compared columns from different tables without `RELATED`.
- Blank result instead of zero: use `[Total Files] + 0` or `COALESCE([Total Files], 0)` when a visual must show 0.

> **Tip:** Format DAX with a line break after each function and two-space indentation, or paste it into daxformatter.com. Interviewers judge readability.

### Try It Yourself

```dax
// A small measure set for a production dashboard
Total Files   = SUM ( FactProduction[Files] )
Total Errors  = SUM ( FactProduction[Errors] )
Active Agents = DISTINCTCOUNT ( FactProduction[AgentKey] )
Accuracy %    = DIVIDE ( [Total Files] - [Total Errors], [Total Files] )
Files / Agent = DIVIDE ( [Total Files], [Active Agents], 0 )
```

### Quiz

1. When is a calculated column evaluated?
- [x] Once per row at refresh time
- [ ] Every time a visual renders
- [ ] Only when a slicer changes
> Calculated columns are materialised and stored; they never react to slicers.

2. Which function safely handles division by zero?
- [ ] `SUM`
- [x] `DIVIDE`
- [ ] `IFERROR`
> DIVIDE returns blank (or an alternate value) when the denominator is zero.

3. You need to slice a report by "Clean" vs "Has errors". What do you create?
- [x] A calculated column
- [ ] A measure
- [ ] A relationship
> Slicers need stored column values; measures cannot be placed in a slicer.

### Exercises

1. **Bucket column** — Create a calculated column that labels each production row "Low" (< 20 files), "Normal" (20 to 39) or "High" (40+).
<details><summary>Solution</summary>

```dax
Volume Bucket =
SWITCH (
    TRUE (),
    FactProduction[Files] < 20, "Low",
    FactProduction[Files] < 40, "Normal",
    "High"
)
```

</details>

2. **Zero instead of blank** — Write a measure that shows 0 errors for agents with no error rows.
<details><summary>Solution</summary>

`Errors (0) = COALESCE ( SUM ( FactProduction[Errors] ), 0 )` or `SUM ( FactProduction[Errors] ) + 0`. Note that forcing zeros makes visuals show every agent even with no data, which may or may not be wanted.

</details>

### Interview Questions

**Q: Explain the difference between a calculated column and a measure, with an example of when each is wrong.**
A calculated column is computed per row at refresh and stored, evaluated in row context; a measure is computed per visual cell at query time in filter context and stored nowhere. A ratio as a calculated column is wrong because it stores a per-row percentage that then gets summed or averaged incorrectly in visuals, so Accuracy % must be a measure. A category label as a measure is wrong because measures cannot be placed in slicers or on axes, so a volume bucket must be a column. The memory cost of columns and the slicer-responsiveness of measures are the two facts to state.

**Q: Why does DAX return blank rather than zero, and how do you deal with it?**
Aggregating an empty set yields BLANK, and blank rows are removed from visuals, which keeps matrices compact and improves performance because the engine skips empty combinations. If a report must show zeros, use `COALESCE([Measure], 0)` or add `+ 0`, but understand that this forces every combination to appear, so a matrix of 200 agents by 365 days becomes 73 000 cells. A more targeted fix is to show zeros only where a row exists using `IF(NOT ISEMPTY(FactProduction), COALESCE([Measure], 0))`.

**Q: What does DISTINCTCOUNT do and what is its performance profile?**
It returns the number of distinct non-blank values of a column in the current filter context. It is more expensive than SUM because the engine must build a hash of distinct values for every cell rather than adding pre-encoded integers, and on high-cardinality columns such as file numbers it is often the slowest measure in a report. Mitigations include counting on an integer key rather than text, pre-aggregating in Power Query when the grain allows, or using `SUMX(VALUES(col), 1)` patterns only when they are measurably faster.

## Date tables and time intelligence

Almost every management question involves time: this week versus last week, year to date, same month last year. DAX has a family of **time-intelligence** functions for these, and they all depend on one thing: a proper **date table**.

### Why you need a date table

The fact table's `Date` column only contains dates that have rows. If no files were completed on a public holiday, that day is missing, and "last 7 days" arithmetic breaks. A date table has **one row for every calendar day** from the first to the last date you care about, with no gaps, and columns for year, month, week and working-day flags.

### Building one in DAX

**Table tools → New table**:

```dax
DimDate =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2024, 1, 1 ), DATE ( 2026, 12, 31 ) ),
    "Year", YEAR ( [Date] ),
    "MonthNumber", MONTH ( [Date] ),
    "MonthName", FORMAT ( [Date], "MMM" ),
    "YearMonth", FORMAT ( [Date], "YYYY-MM" ),
    "WeekOfYear", WEEKNUM ( [Date], 2 ),
    "WeekStart", [Date] - WEEKDAY ( [Date], 2 ) + 1,
    "IsWorkingDay", IF ( WEEKDAY ( [Date], 2 ) <= 5, 1, 0 )
)
```

`CALENDAR` generates the contiguous range. `WEEKDAY(.., 2)` makes Monday = 1 so weeks start on Monday, which matches most production schedules. Then **Table tools → Mark as date table** with `[Date]` as the column, relate `FactProduction[DateKey]` to `DimDate[Date]`, and set `MonthName` to sort by `MonthNumber`. You can equally build the table in Power Query with `List.Dates`; the DAX version is faster to write, the M version is better when the table must be shared through a dataflow.

### Turn off auto date/time

**File → Options → Current file → Data load → Auto date/time** should be off. With it on, Power BI creates a hidden date table for every date column, bloating the model and encouraging the built-in hierarchy instead of your own.

### The core functions

| Function | Question it answers |
|---|---|
| `TOTALYTD(expr, DimDate[Date])` | Running total from 1 January to the current date in context |
| `TOTALMTD`, `TOTALQTD` | Same for month and quarter |
| `SAMEPERIODLASTYEAR(DimDate[Date])` | The same dates one year earlier |
| `DATEADD(DimDate[Date], -1, MONTH)` | Shift the date range by N days/months/quarters/years |
| `PREVIOUSMONTH(DimDate[Date])` | The whole previous month |
| `DATESINPERIOD(DimDate[Date], MAX(DimDate[Date]), -28, DAY)` | A rolling window ending at the last date in context |

```dax
Files YTD = TOTALYTD ( [Total Files], DimDate[Date] )

Files LY = CALCULATE ( [Total Files], SAMEPERIODLASTYEAR ( DimDate[Date] ) )

Files YoY % = DIVIDE ( [Total Files] - [Files LY], [Files LY] )

Files Prev Week =
CALCULATE ( [Total Files], DATEADD ( DimDate[Date], -7, DAY ) )

Files Rolling 4 Weeks =
CALCULATE (
    [Total Files],
    DATESINPERIOD ( DimDate[Date], MAX ( DimDate[Date] ), -28, DAY )
)
```

Each time-intelligence function returns a **table of dates**, and `CALCULATE` uses that table to replace the date filter. `TOTALYTD` is a shortcut that wraps `CALCULATE` and `DATESYTD` for you. The Advanced level explains `CALCULATE` in full; for now, read `CALCULATE(measure, dates)` as "evaluate the measure over these dates instead".

### Fiscal years

If the fiscal year starts in July, pass the year-end day: `TOTALYTD([Total Files], DimDate[Date], "06-30")`. Add `FiscalYear` and `FiscalMonth` columns to the date table so slicers and axes agree with the measures.

### Week-based reporting

Weekly production reports do not fit the month/quarter functions. Use the `WeekStart` column and simple arithmetic instead of `DATEADD`:

```dax
Files Prev Week (by WeekStart) =
VAR CurrentWeek = MAX ( DimDate[WeekStart] )
RETURN
    CALCULATE ( [Total Files], DimDate[WeekStart] = CurrentWeek - 7, REMOVEFILTERS ( DimDate ) )
```

> **Warning:** Time intelligence gives blank or wrong answers when the date table has gaps, when the relationship is to the fact's date column instead of the date table, or when the table is not marked as a date table. Check those three before debugging the formula.

### Try It Yourself

```dax
// Week-over-week pack for a production report
Files This Week = [Total Files]
Files Last Week = CALCULATE ( [Total Files], DATEADD ( DimDate[Date], -7, DAY ) )
WoW Change      = [Files This Week] - [Files Last Week]
WoW %           = DIVIDE ( [WoW Change], [Files Last Week] )
```

### Quiz

1. What must be true of a date table's date column?
- [x] Contiguous daily values with no gaps or duplicates
- [ ] Only dates that appear in the fact table
- [ ] Text formatted as YYYY-MM-DD
> Time-intelligence functions walk the calendar, so missing days break shifts and running totals.

2. Which function returns the same date range one year earlier?
- [ ] `TOTALYTD`
- [x] `SAMEPERIODLASTYEAR`
- [ ] `PREVIOUSMONTH`
> SAMEPERIODLASTYEAR is equivalent to DATEADD(dates, -1, YEAR).

3. Why turn off Auto date/time?
- [x] It creates hidden date tables per date column and bloats the model
- [ ] It disables DAX
- [ ] It deletes the Date table
> Auto date/time adds a hidden table for every date column, increasing size and slowing refresh.

### Exercises

1. **Month-to-date comparison** — Write measures for files month-to-date and the same MTD window last month, plus the percentage change.
<details><summary>Solution</summary>

```dax
Files MTD = TOTALMTD ( [Total Files], DimDate[Date] )
Files MTD LM = CALCULATE ( [Files MTD], DATEADD ( DimDate[Date], -1, MONTH ) )
MTD vs LM % = DIVIDE ( [Files MTD] - [Files MTD LM], [Files MTD LM] )
```

</details>

2. **Working-day average** — Compute average files per working day in the selected period using the IsWorkingDay column.
<details><summary>Solution</summary>

```dax
Working Days = CALCULATE ( COUNTROWS ( DimDate ), DimDate[IsWorkingDay] = 1 )
Files per Working Day = DIVIDE ( [Total Files], [Working Days] )
```

</details>

### Interview Questions

**Q: Why do time-intelligence functions require a separate date table rather than the fact's date column?**
Functions such as DATEADD and DATESYTD shift or expand a set of dates and need every calendar day present to compute correctly; a fact column only has dates with activity, so shifting a week back over a holiday produces gaps and wrong totals. The date table must be contiguous, unique and of Date type, and marking it tells the engine which column is the key so it can bypass the relationship when applying date filters. It also gives you the attribute columns (fiscal periods, week starts, working-day flags) that every report needs on axes and slicers.

**Q: How would you calculate a rolling 4-week average of files?**
Use DATESINPERIOD to build the window ending at the last date in context: `CALCULATE([Total Files], DATESINPERIOD(DimDate[Date], MAX(DimDate[Date]), -28, DAY))` then divide by 4 or by the number of working days in that window. The subtlety is that `MAX(DimDate[Date])` is evaluated in the current filter context, so in a daily line chart each point gets its own trailing window, while in a card it uses the last selected day. If the report is week-based, I would instead filter on a WeekStart column between `CurrentWeek - 21` and `CurrentWeek` with `REMOVEFILTERS(DimDate)` to avoid partial-week edges.

**Q: What is the difference between DATEADD and PARALLELPERIOD?**
DATEADD shifts each date in the current context by the interval, preserving the shape of the selection (10 selected days become the corresponding 10 days a month earlier); PARALLELPERIOD returns the whole period containing the shifted dates (any selection in March returns all of February). DATEADD is right for like-for-like comparisons such as MTD versus same MTD last month; PARALLELPERIOD is right when the comparison is the full prior period. DATEADD also handles month-end edge cases by moving 31 March back to 28 February, which trips people up in tests.

## Power Query deeper: merge, append, unpivot, parameters and M

Beginner Power Query fixed types and removed columns. Real production data needs restructuring: rate sheets arrive with one column per state, lookups need joining, and the file path changes between your laptop and the gateway machine. This chapter covers the transformations that solve those.

### Append: stacking tables

**Append Queries** stacks rows from tables with the same columns, like `UNION ALL` in SQL. Use it when January and February production exports are separate files with the same layout. **Home → Append Queries → Append Queries as New**, pick the tables, and the result has all rows. Columns are matched by name, so rename before appending; a column present in one table only becomes null in the other rows.

### Merge: joining tables

**Merge Queries** joins two tables on matching columns, like a SQL `JOIN` or an Excel `XLOOKUP`. Select the fact query, **Home → Merge Queries**, choose `DimState`, click `StateCode` in both, and pick the join kind:

| Join kind | Keeps |
|---|---|
| Left Outer | All rows from the first table, matches from the second |
| Inner | Only rows that match in both |
| Left Anti | Rows in the first table with **no** match (perfect for finding orphan codes) |
| Full Outer | All rows from both |

The result is a column of nested tables. Click the expand icon and tick only the columns you need. A Left Anti merge of the production export against the state master is the fastest audit for misspelled state codes.

### Unpivot: wide to long

A rate matrix arrives with one row per rate band and one column per state:

```text
Band      | TX    | WY    | CO
0-50000   | 5.75  | 4.20  | 4.95
50001-100k| 4.50  | 3.60  | 4.10
```

Visuals need one row per band per state. Select the `Band` column, then **Transform → Unpivot Other Columns**. The result has columns `Band, Attribute, Value`; rename them to `Band, State, Rate`. Unpivot Other Columns rather than Unpivot Columns means a new state column next month is handled automatically. **Pivot Column** does the reverse when you need a wide table for export.

```powerquery
let
    Source = Excel.CurrentWorkbook(){[Name="RateMatrix"]}[Content],
    Unpivoted = Table.UnpivotOtherColumns(Source, {"Band"}, "State", "Rate"),
    Typed = Table.TransformColumnTypes(Unpivoted, {{"Rate", type number}})
in
    Typed
```

### Parameters

A **parameter** is a named value used inside queries. **Home → Manage Parameters → New Parameter**, name it `SourceFolder`, type Text, current value `C:\Reports\`. In the source step replace the literal path with `SourceFolder & "Production.xlsx"`. When the report moves to the gateway machine, change one parameter instead of twenty queries. Parameters also appear in the Service dataset settings, where they can be edited without republishing. `RangeStart` and `RangeEnd` datetime parameters are required for incremental refresh (Expert level).

### Reading and writing M

Every step is an M expression. The most useful things to know when editing the Advanced Editor:

- M is **case-sensitive**: `table.selectrows` fails.
- `each` introduces a function of one argument; `[Column]` inside it reads that row's column; `_` is the row itself.
- Lists use `{}` and records use `[]`; `Table.FromRecords({[a=1],[a=2]})` builds a table.
- Errors are values: wrap a step with `try ... otherwise` to substitute a default.

```powerquery
// Add a column that classifies the file's state region, with a safe default
Regioned = Table.AddColumn(Typed, "Region",
    each try
        if List.Contains({"TX","OK","LA"}, [State]) then "South"
        else if List.Contains({"WY","CO","MT"}, [State]) then "Mountain"
        else "Other"
    otherwise "Unknown",
    type text)
```

### Custom functions

Turn a query into a function by adding parameters in the Advanced Editor: `(path as text) => let ... in ...`. Invoke it per row with **Add Column → Invoke Custom Function**. This is how the Folder connector combines files, and it is how you would apply one cleaning recipe to six underwriter rate sheets.

### Reference versus duplicate

Right-click a query: **Reference** creates a new query starting from the output of the original (changes flow through); **Duplicate** copies the steps (independent). Use Reference to build `DimState` from a staging query, and disable load on the staging query so it does not bloat the model.

> **Tip:** Keep a `Staging` query group with load disabled and a `Model` group that references it. The model group holds exactly the tables the report needs; everything else is plumbing.

### Try It Yourself

```powerquery
// Merge production rows with a state lookup and flag unknown codes
let
    Production = #table({"State","Files"}, {{"TX",41},{"WY",12},{"XX",3}}),
    States = #table({"StateCode","StateName"}, {{"TX","Texas"},{"WY","Wyoming"}}),
    Merged = Table.NestedJoin(Production, {"State"}, States, {"StateCode"}, "S", JoinKind.LeftOuter),
    Expanded = Table.ExpandTableColumn(Merged, "S", {"StateName"}),
    Flagged = Table.AddColumn(Expanded, "Valid", each [StateName] <> null, type logical)
in
    Flagged
```

### Quiz

1. Which operation stacks rows from two tables with the same columns?
- [ ] Merge
- [x] Append
- [ ] Pivot
> Append is UNION ALL; Merge is JOIN.

2. Which join kind returns rows with no match in the second table?
- [ ] Inner
- [ ] Left Outer
- [x] Left Anti
> Left Anti is the quickest way to find orphan codes such as unknown states.

3. Why choose Unpivot Other Columns over Unpivot Columns?
- [x] New columns added later are unpivoted automatically
- [ ] It is faster
- [ ] It keeps the original column order
> Unpivot Other Columns names the columns to keep fixed, so any new column is treated as data.

### Exercises

1. **Six rate sheets** — Six underwriter workbooks share one layout. Build one function that cleans a sheet and apply it to all six, producing one long table with an Underwriter column.
<details><summary>Solution</summary>

Create a query on one file, convert it to a function `(path as text, uw as text) =>` that reads, promotes headers, unpivots and adds `Underwriter = uw`. Build a small Enter Data table with Path and Underwriter columns, Invoke Custom Function per row, expand, then Append is not even needed because expansion already stacks the rows.

</details>

2. **Portable path** — Replace a hard-coded file path with a parameter and verify the query still refreshes.
<details><summary>Solution</summary>

Manage Parameters → New: `DataFolder`, Text, `C:\Reports\`. Edit the Source step: `File.Contents(DataFolder & "Production.xlsx")`. Refresh preview; change the parameter to test an invalid path and confirm the error appears at the Source step only.

</details>

### Interview Questions

**Q: How would you combine rate matrices from six underwriters into one table when each uses slightly different column names?**
Build a custom M function that takes a file path and an underwriter name, promotes headers, then normalises column names with a mapping table using `Table.RenameColumns` with `MissingField.Ignore`, unpivots the state columns with `Table.UnpivotOtherColumns`, and returns a standard schema such as Underwriter, State, Zone, Band, Rate. Invoke the function over a driver table of six rows and expand. Add a validation step that counts rows per underwriter and asserts each state appears, so a structural change in one sheet fails loudly rather than silently dropping rows. Any zone harmonisation (different counties grouped differently) is done with a separate lookup merge after the standard schema exists.

**Q: What is the difference between Reference and Duplicate?**
Duplicate copies the query's steps into an independent new query; later edits to the original do not affect it. Reference creates a new query whose Source step is the original's output, so changes flow downstream and the original is evaluated once and shared, which keeps refresh efficient and logic in one place. The pattern is a staging query with load disabled and several referenced model queries. One caveat: Power Query may still evaluate a referenced query multiple times during refresh because of its lazy evaluation, so heavy staging queries benefit from `Table.Buffer` or from being moved to a dataflow.

**Q: When would you use Power Query parameters?**
For anything that differs between environments or between refreshes without changing logic: file paths and server names when moving from a laptop to a gateway, a fiscal year cut-off, a list of states to include, and the RangeStart and RangeEnd datetime parameters that incremental refresh requires. Parameters are editable in the Service dataset settings, so an admin can repoint the source without opening Desktop. They also drive custom functions, letting one cleaning recipe run against many files.

## Formatting and report design for management

A correct model with ugly pages fails. Managers judge a dashboard in the first five seconds, and a page that looks like an Excel sheet pasted onto a canvas will not be opened twice. This chapter is about layout, hierarchy and the formatting settings that make a report read like a status report rather than a data dump.

### Start with the questions

Before placing a visual, write the three questions the audience asks every Monday. For a title-production team lead they are: *Did we hit volume?*, *Is accuracy within SLA?*, *What is the backlog and who is behind?* Each question becomes one region of the page, in that order, top to bottom. Anything that does not answer one of the three goes on a detail page reached by drill-through.

### Layout grid

Desktop's canvas defaults to 1280×720. Turn on **View → Gridlines** and **Snap to grid**. A dependable layout:

```text
+------------------------------------------------------------+
| Title                          Week slicer   Last refresh  |
+-----------+-----------+-----------+------------------------+
| Files     | Accuracy  | Backlog   | TAT (hrs)              |  <- KPI cards
+-----------+-----------+-----------+------------------------+
| Files by day (line)               | Files by state (bar)   |
+-----------------------------------+------------------------+
| Agent matrix (rows: agent, cols: day, values: files, acc%) |
+------------------------------------------------------------+
```

Cards top-left, trend centre, detail bottom. Left-to-right, top-to-bottom, the same way the eye reads text.

### Themes

**View → Themes** applies a JSON theme to the whole report: colours, fonts, default visual settings. Write one for the team and reuse it in every report so nobody is choosing colours by hand.

```json
{
  "name": "Production Ops",
  "dataColors": ["#1F4E79", "#C79A00", "#7F7F7F", "#C0392B", "#117A65"],
  "background": "#FFFFFF",
  "foreground": "#252423",
  "tableAccent": "#1F4E79",
  "textClasses": { "title": { "fontSize": 14, "fontFace": "Segoe UI Semibold" } }
}
```

Save as `production-theme.json` and import via **Themes → Browse for themes**. Use one primary colour for most series and a single alert colour (red) that only appears when something is wrong.

### Card and KPI formatting

- Display units: **Auto** turns 41 250 into 41.25K; for counts under 100 000 prefer **None** with a thousands separator.
- Decimals: whole numbers for counts, one decimal for percentages, none for currency in management views.
- Add a small text below each card via the **Callout label** or a separate measure showing *vs last week +3.2%*.

### Number formats live in the model

Set format strings on the measure (Measure tools → Format), not per visual. `#,##0` for counts, `0.0%` for ratios, `"$"#,##0` for premium. Custom: `+0.0%;-0.0%;0.0%` shows an explicit plus sign for growth.

### Titles and text

Every visual gets a title that states the insight or the question: *Accuracy dipped below 98% SLA on Wed* beats *Accuracy by day*. Titles can be dynamic: **Format → Title → fx** and bind it to a measure:

```dax
Accuracy Title =
"Accuracy " & FORMAT ( [Accuracy %], "0.0%" )
    & IF ( [Accuracy %] < 0.98, " — below SLA", " — within SLA" )
```

Add a text box for the page header, and a small text at the bottom-right showing the refresh time from a `Last Refresh` table created in Power Query with `DateTime.LocalNow()`.

### Conditional formatting

In a matrix, colour the *Accuracy %* cells: **Values → Conditional formatting → Background color → Rules**: below 0.95 red, 0.95–0.98 amber, above 0.98 green. For icons, use **Icons → Rules**. Keep it to one formatted column per matrix; a rainbow grid conveys nothing.

### Accessibility and print

Check contrast (dark text on light background), keep font size at 10pt or above, and add **Alt text** in Format → General for screen readers. If the page will be exported to PDF for a Monday email, set the page size to **Letter** under Format page → Canvas settings and avoid scrolling visuals, because the export captures only what is visible.

> **Interview note:** Asked "how do you design a dashboard for executives?", answer with audience, questions, hierarchy (cards first, exceptions highlighted, detail last), consistent theme, and one action per page. Mention that you test with the actual reader and watch where their eyes go.

### Try It Yourself

```dax
// Dynamic subtitle for the weekly production page
Page Subtitle =
VAR StartDate = MIN ( DimDate[Date] )
VAR EndDate   = MAX ( DimDate[Date] )
RETURN
    "Week of " & FORMAT ( StartDate, "d MMM" ) & " to " & FORMAT ( EndDate, "d MMM yyyy" )
    & "  |  " & FORMAT ( [Total Files], "#,##0" ) & " files  |  "
    & FORMAT ( [Accuracy %], "0.0%" ) & " accuracy"
```

### Quiz

1. Where should number formats such as `0.0%` be set?
- [ ] On each visual
- [x] On the measure in the model
- [ ] In Power Query
> Model-level formats apply everywhere the measure is used and keep reports consistent.

2. What is the recommended top-to-bottom order for a management page?
- [x] KPI cards, trends, detail
- [ ] Detail, trends, KPI cards
- [ ] Slicers only
> Readers scan top-left first; headline numbers belong there, detail belongs at the bottom.

3. How do you apply consistent colours and fonts across many reports?
- [ ] Copy visuals between files
- [x] A JSON theme imported under View → Themes
- [ ] Conditional formatting
> A theme file defines dataColors, fonts and visual defaults once.

### Exercises

1. **Exception colouring** — Format an accuracy column so cells below 95% are red, 95–98% amber, above 98% green, and explain why only one column is coloured.
<details><summary>Solution</summary>

Matrix → Values → Accuracy % → Conditional formatting → Background color → Format style Rules with three ranges. Only one column is coloured so that red unambiguously means "below SLA" rather than competing with other colours.

</details>

2. **Refresh stamp** — Add a "Last refreshed" text to the page.
<details><summary>Solution</summary>

Power Query: Blank query with `= #table({"Refreshed"}, {{DateTime.LocalNow()}})`, load it. Measure `Last Refresh = "Refreshed " & FORMAT(MAX(LastRefresh[Refreshed]), "d MMM yyyy HH:mm")` in a card with the callout value at 9pt bottom-right. Note that the Service records UTC unless you convert with `DateTimeZone.SwitchZone`.

</details>

### Interview Questions

**Q: How do you design a Power BI page for senior management?**
Begin by agreeing the three to five questions the page must answer and the decision each answer supports. Put headline KPIs as cards across the top with comparison to target or prior period, a trend chart in the middle, and category or detail breakdowns at the bottom, so the reader gets the answer in five seconds and the evidence in thirty. Apply a single theme, use colour only for meaning (red for out-of-SLA), give every visual a title that states the insight, and expose detail through drill-through instead of crowding the page. For the weekly title-production dashboard I would show files, accuracy, backlog and turnaround as cards with week-over-week deltas, then daily volume and agent matrix, and I would review it with the team lead who reads it before publishing.

**Q: How do you create a dynamic title in Power BI?**
Write a measure that returns a text value, then select the visual, open Format → Title, click the fx button next to Text, and bind it to that measure. The measure can use FORMAT for numbers and dates, SELECTEDVALUE or CONCATENATEX to reflect slicer selections, and IF logic to add warnings such as "below SLA". The same conditional-formatting fx approach works for subtitles, colours, and even URLs for images, which lets a single page adapt to the selected state or week without duplicating pages.

**Q: What are common dashboard design mistakes you avoid?**
Too many visuals on one page, pie charts with a dozen slices, bar axes that do not start at zero, rainbow colours that carry no meaning, inconsistent number formats across visuals, missing titles and refresh time, and slicers that readers cannot see. Another is building for the author rather than the audience: an analyst wants every dimension available, a manager wants the exception list. I limit a page to one question per region, apply formats in the model, use a theme, and test the page at the resolution the audience actually uses, which is often a laptop with a 125% zoom rather than a 4K monitor.

# LEVEL: Advanced

## Filter context, CALCULATE and ALL

Every DAX measure is evaluated inside a **filter context**: the set of filters coming from slicers, the Filters pane, the rows and columns of the visual, and cross-filtering from other visuals. `[Total Files]` in the cell for agent *Sara*, week 12 is really "sum of Files where AgentName = Sara and WeekOfYear = 12". `CALCULATE` is the function that **modifies** that filter context, and understanding it is the difference between an intermediate and an advanced Power BI developer.

### CALCULATE

```dax
CALCULATE ( <expression>, <filter1>, <filter2>, ... )
```

`CALCULATE` evaluates the expression after applying each filter argument to the current context. A filter argument like `DimState[StateCode] = "TX"` is shorthand for a table: `FILTER ( ALL ( DimState[StateCode] ), DimState[StateCode] = "TX" )`. That expansion matters: the filter **replaces** any existing filter on `StateCode`, it does not intersect with it.

```dax
Files TX = CALCULATE ( [Total Files], DimState[StateCode] = "TX" )
```

Put `Files TX` in a matrix with states on rows. Every row shows the Texas number, because the row filter on `StateCode` was overwritten. That is correct behaviour and it is the thing that confuses everyone at first.

### ALL: removing filters

`ALL(table)` or `ALL(column)` returns the table or column with all filters removed. Inside `CALCULATE` it acts as a filter modifier that clears filters:

```dax
Files All States = CALCULATE ( [Total Files], ALL ( DimState ) )

State Share % = DIVIDE ( [Total Files], [Files All States] )
```

In a state-by-row matrix, `Files All States` shows the grand total in every row and `State Share %` shows each state's percentage. Slicers on other tables (date, agent) still apply, because only `DimState` was cleared. `REMOVEFILTERS` is a newer, clearer alias for this use of `ALL`.

### ALLEXCEPT and ALLSELECTED

| Function | Effect inside CALCULATE |
|---|---|
| `ALL(DimState)` | Remove every filter on DimState |
| `ALL(DimState[Region])` | Remove filters on that column only |
| `ALLEXCEPT(DimState, DimState[Region])` | Remove all DimState filters except Region |
| `ALLSELECTED(DimState)` | Remove visual-level filters but keep slicer selections |
| `KEEPFILTERS(...)` | Make a filter argument intersect instead of replace |

`ALLSELECTED` is the one for *share of the visible total*: with two states picked in a slicer, `DIVIDE([Total Files], CALCULATE([Total Files], ALLSELECTED(DimState)))` gives each state's share of those two, summing to 100%.

```dax
Files Region Total = CALCULATE ( [Total Files], ALLEXCEPT ( DimState, DimState[Region] ) )
State Share of Region = DIVIDE ( [Total Files], [Files Region Total] )
```

### Filters as tables

Filter arguments can be whole tables. This is how you filter by a measure, which a boolean shorthand cannot do:

```dax
Files from High-Volume Agents =
CALCULATE (
    [Total Files],
    FILTER ( VALUES ( DimAgent[AgentKey] ), [Total Files] > 500 )
)
```

`VALUES` returns the agents visible in the current context; `FILTER` keeps those whose total exceeds 500; `CALCULATE` restricts the sum to them.

### Context transition

When `CALCULATE` is called inside a row context (a calculated column, or an iterator such as `SUMX`), it converts the current row into an equivalent filter context. This is **context transition** and it is why a measure reference inside a calculated column returns the row's value rather than the grand total: every measure reference is implicitly wrapped in `CALCULATE`.

```dax
// Calculated column on DimAgent: total files for this agent
Agent Lifetime Files = CALCULATE ( SUM ( FactProduction[Files] ) )
```

Without `CALCULATE`, the column would show the whole table's total on every row.

### Order of evaluation

1. Filter arguments are evaluated in the **original** context.
2. Context transition happens (if in a row context).
3. Filter modifiers (`ALL`, `KEEPFILTERS`, `USERELATIONSHIP`) apply.
4. Filters replace existing ones on the same columns.
5. The expression evaluates in the new context.

> **Warning:** `CALCULATE ( [Total Files], DimState[StateCode] = "TX" )` and `CALCULATE ( [Total Files], KEEPFILTERS ( DimState[StateCode] = "TX" ) )` differ. The first shows Texas everywhere; the second shows Texas only on the Texas row and blank elsewhere. Know which one you want.

### Try It Yourself

```dax
// Share-of-total pattern that respects slicers but ignores the visual's rows
Files All Visible = CALCULATE ( [Total Files], ALLSELECTED ( DimState ) )
State Share %     = DIVIDE ( [Total Files], [Files All Visible] )
// Rank agents only within their team
Agent Rank in Team =
RANKX ( ALLEXCEPT ( DimAgent, DimAgent[Team] ), [Total Files], , DESC, DENSE )
```

### Quiz

1. `CALCULATE([Total Files], DimState[StateCode] = "TX")` placed in a matrix with states on rows shows:
- [x] The Texas total on every row
- [ ] Texas on the Texas row and blank elsewhere
- [ ] An error
> A boolean filter argument replaces the existing filter on that column.

2. Which function keeps slicer selections but removes filters from the visual's rows?
- [ ] `ALL`
- [x] `ALLSELECTED`
- [ ] `ALLEXCEPT`
> ALLSELECTED restores the filter context from outside the visual, making shares sum to 100% of what is selected.

3. What is context transition?
- [ ] Converting text to numbers
- [x] CALCULATE turning a row context into a filter context
- [ ] Switching between Import and DirectQuery
> Any CALCULATE (including implicit ones around measure references) converts the current row into filters.

### Exercises

1. **Share of region** — Write a measure giving each state's share of its region's files and check that the shares in each region sum to 100%.
<details><summary>Solution</summary>

`Region Files = CALCULATE([Total Files], ALLEXCEPT(DimState, DimState[Region]))`, then `Share = DIVIDE([Total Files], [Region Files])`. In a matrix with Region then State on rows, each region's states sum to 1.

</details>

2. **Above-average agents** — Count agents whose total files exceed the average across visible agents.
<details><summary>Solution</summary>

```dax
Above Avg Agents =
VAR Avg = AVERAGEX ( VALUES ( DimAgent[AgentKey] ), [Total Files] )
RETURN COUNTROWS ( FILTER ( VALUES ( DimAgent[AgentKey] ), [Total Files] > Avg ) )
```

</details>

### Interview Questions

**Q: Explain what CALCULATE does.**
CALCULATE evaluates an expression in a modified filter context. Its filter arguments are tables (boolean shorthand expands to FILTER over ALL of the column), and each replaces the existing filter on the same columns unless wrapped in KEEPFILTERS; modifiers such as ALL, ALLSELECTED and USERELATIONSHIP remove or alter filters. It also performs context transition when invoked in a row context, which is why measures work inside calculated columns and iterators. A classic example is share of total: `DIVIDE([Sales], CALCULATE([Sales], ALL(Product)))`, where ALL clears the product filter from the denominator while every other filter, like the selected year, still applies.

**Q: What is the difference between ALL, ALLSELECTED and ALLEXCEPT?**
ALL removes all filters from a table or the listed columns. ALLEXCEPT removes all filters from a table except those on the named columns, so `ALLEXCEPT(DimState, DimState[Region])` keeps the region filter while clearing state. ALLSELECTED removes filters that come from inside the visual (rows, columns) while keeping those from slicers and the Filters pane, which gives "percent of visible total". ALLSELECTED has subtle semantics with nested iterators (shadow filter contexts), so in interviews I say I use it only at the top level of a measure and verify totals in a test visual.

**Q: Why does a measure inside a calculated column not return the grand total?**
Because referencing a measure implicitly wraps it in CALCULATE, which triggers context transition: the current row's column values become filters, so the sum is restricted to that row's related fact rows. If you write the raw aggregation `SUM(FactProduction[Files])` in the column instead, there is no transition and every row shows the total. This is also why iterators like SUMX over a dimension with a measure inside give per-row results, and why context transition on a table with duplicate rows can double-count, since the "row" becomes a filter that matches all identical rows.

## Row context and iterators: SUMX and AVERAGEX

`SUM` adds up a column. It cannot add up an expression such as `Files * Minutes` or a measure per agent. For that DAX has **iterators**: functions ending in X that walk a table row by row, evaluate an expression for each row in a **row context**, and then aggregate the results.

### The X family

| Iterator | Aggregation | Example |
|---|---|---|
| `SUMX(table, expr)` | Sum | Revenue = SUMX(Sales, Sales[Qty] * Sales[Price]) |
| `AVERAGEX(table, expr)` | Mean of per-row results | Average files per agent |
| `MINX` / `MAXX` | Min / max | Slowest agent's turnaround |
| `COUNTX` | Count of non-blank results | Agents with any errors |
| `RANKX` | Rank of a value among results | Agent ranking |
| `CONCATENATEX` | Join text results | List of selected states |

### Row context

Inside `SUMX(FactProduction, FactProduction[Files] * FactProduction[MinutesPerFile])`, the expression sees one row at a time and `FactProduction[Files]` means the current row's value. This is the same row context as a calculated column, but it exists only during the iteration and never stores anything. The result is then summed in the outer filter context, so slicers still apply.

```dax
Total Minutes = SUMX ( FactProduction, FactProduction[Files] * FactProduction[MinutesPerFile] )
```

Contrast with a calculated column `Minutes = Files * MinutesPerFile` followed by `SUM(Minutes)`: same number, but the column costs storage for every row. Iterators over a fact table are fast enough that the column is rarely justified.

### Average of averages versus true average

Managers ask for *average files per agent*. Two measures give different answers:

```dax
Avg Files per Row   = AVERAGE ( FactProduction[Files] )                   // mean of daily rows
Avg Files per Agent = AVERAGEX ( VALUES ( DimAgent[AgentKey] ), [Total Files] )  // mean of agent totals
```

`AVERAGEX` over `VALUES(DimAgent[AgentKey])` iterates the agents visible in the current context, evaluates `[Total Files]` for each (context transition makes it that agent's total), then averages. This is the number a team lead means. The first measure is the average of daily entries, which is smaller and rarely what was asked.

### Iterating a dimension with a measure

The pattern `X ( VALUES ( Dim[Key] ), [Measure] )` is the workhorse of advanced DAX:

```dax
Best Agent Files = MAXX ( VALUES ( DimAgent[AgentKey] ), [Total Files] )

Agents Below Target =
COUNTX ( VALUES ( DimAgent[AgentKey] ), IF ( [Total Files] < [Target Files], 1 ) )

Selected States = CONCATENATEX ( VALUES ( DimState[StateCode] ), DimState[StateCode], ", ", DimState[StateCode], ASC )
```

`COUNTX` counts non-blank results, and `IF` without an else branch returns blank, so only agents below target count.

### Nested row contexts and EARLIER

A calculated column that ranks rows within the same table needs the outer row inside an inner iteration:

```dax
// On DimAgent: rank by HireDate within Team
Seniority Rank =
COUNTROWS (
    FILTER ( DimAgent,
        DimAgent[Team] = EARLIER ( DimAgent[Team] ) && DimAgent[HireDate] < EARLIER ( DimAgent[HireDate] ) )
) + 1
```

`EARLIER` reaches the previous (outer) row context. Modern DAX replaces it with variables, which read more clearly:

```dax
Seniority Rank =
VAR T = DimAgent[Team]
VAR H = DimAgent[HireDate]
RETURN COUNTROWS ( FILTER ( DimAgent, DimAgent[Team] = T && DimAgent[HireDate] < H ) ) + 1
```

### Performance

Iterators run in the **formula engine**, row by row, unless the storage engine can handle the expression. `SUMX(Fact, Fact[a] * Fact[b])` is pushed down and is fast. `SUMX(Fact, [SomeMeasure])` over millions of rows triggers a context transition per row and is slow. Rule: iterate dimensions (hundreds of rows) with measures, iterate facts (millions) only with plain column arithmetic.

> **Tip:** `SUMX(VALUES(col), 1)` and `COUNTROWS(VALUES(col))` both count distinct values; the second is clearer. Reach for an iterator only when a plain aggregator cannot express the calculation.

### Try It Yourself

```dax
// Weighted average accuracy across agents, weighted by files handled
Weighted Accuracy =
DIVIDE (
    SUMX ( VALUES ( DimAgent[AgentKey] ), [Total Files] * [Accuracy %] ),
    SUMX ( VALUES ( DimAgent[AgentKey] ), [Total Files] )
)
// Compare with the unweighted mean of agent accuracies
Mean Agent Accuracy = AVERAGEX ( VALUES ( DimAgent[AgentKey] ), [Accuracy %] )
```

### Quiz

1. Which measure gives the average of agent totals?
- [ ] `AVERAGE(FactProduction[Files])`
- [x] `AVERAGEX(VALUES(DimAgent[AgentKey]), [Total Files])`
- [ ] `SUM(FactProduction[Files]) / 2`
> AVERAGEX evaluates the measure once per agent (context transition) and then averages those results.

2. Which iteration is slow on large data?
- [ ] `SUMX(Fact, Fact[a] * Fact[b])`
- [x] `SUMX(Fact, [Measure])`
- [ ] `SUMX(VALUES(Dim[Key]), [Measure])`
> A measure inside an iterator over a fact table forces a context transition per fact row.

3. What does EARLIER return?
- [x] The value from the outer row context
- [ ] The previous date
- [ ] The prior row in the table
> EARLIER accesses an outer row context in nested iterations; variables usually replace it.

### Exercises

1. **Longest turnaround** — Given `FactProduction[ReceivedDate]` and `[CompletedDate]`, compute the maximum turnaround in days without a calculated column.
<details><summary>Solution</summary>

`Max TAT Days = MAXX ( FactProduction, DATEDIFF ( FactProduction[ReceivedDate], FactProduction[CompletedDate], DAY ) )`

</details>

2. **Agents with errors** — Count agents in the current context who logged at least one error.
<details><summary>Solution</summary>

`Agents With Errors = COUNTX ( VALUES ( DimAgent[AgentKey] ), IF ( [Total Errors] > 0, 1 ) )` or equivalently `COUNTROWS ( FILTER ( VALUES ( DimAgent[AgentKey] ), [Total Errors] > 0 ) )`.

</details>

### Interview Questions

**Q: What is the difference between SUM and SUMX?**
SUM aggregates a single physical column and is executed almost entirely by the storage engine. SUMX iterates a table, evaluates an expression in row context for each row, and sums the results; it can multiply columns, call measures, or operate on virtual tables such as VALUES or FILTER. SUMX with simple column arithmetic over a fact is still pushed to the storage engine and is fast, but SUMX with a measure reference over a large table causes per-row context transition and becomes formula-engine bound. Interviewers also want to hear that SUM(col) is literally SUMX(table, table[col]) under the hood.

**Q: How would you compute a weighted average in DAX?**
Iterate the granularity at which the weights are defined and divide the sum of value times weight by the sum of weights: `DIVIDE(SUMX(VALUES(DimAgent[AgentKey]), [Files] * [Accuracy %]), SUMX(VALUES(DimAgent[AgentKey]), [Files]))`. When the fact table already holds the numerator and denominator components, the weighted average collapses to a simple ratio of sums, `DIVIDE(SUM(Correct), SUM(Files))`, which is faster and should be preferred. The trap to call out is AVERAGE of a ratio column, which equals a weighted average only if every row has the same weight.

**Q: Explain row context versus filter context in one example.**
In `SUMX(FactProduction, FactProduction[Files] * FactProduction[Rate])`, row context is the current row the iterator is on, so the column references resolve to that row's values; filter context is the set of filters from the visual and slicers that determine which rows of FactProduction the iterator sees at all. Row context does not filter anything and filter context does not give you a current row. The bridge is context transition: wrapping a measure in CALCULATE inside the iteration turns the current row into a filter so the measure sees only that row's related data.

## Variables, RANKX, TOPN and SWITCH measures

Advanced DAX is mostly about writing measures that a manager would otherwise ask for as a separate report: rankings, top-N lists, and one measure that changes meaning based on a selector. Variables make those measures readable and fast.

### VAR and RETURN

```dax
WoW Files % =
VAR ThisWeek = [Total Files]
VAR LastWeek = CALCULATE ( [Total Files], DATEADD ( DimDate[Date], -7, DAY ) )
RETURN
    IF ( NOT ISBLANK ( LastWeek ), DIVIDE ( ThisWeek - LastWeek, LastWeek ) )
```

A variable is evaluated **once**, in the filter context where it is defined, and reused. Benefits: no repeated computation, readable names, and easier debugging (temporarily `RETURN LastWeek` to inspect it). Variables can hold scalars or tables. A variable's value is fixed at definition, so a `CALCULATE` later in the measure does not change it, which is often exactly what you want and occasionally a trap.

### RANKX

```dax
Agent Rank =
RANKX ( ALLSELECTED ( DimAgent[AgentName] ), [Total Files], , DESC, DENSE )
```

`RANKX(table, expression, [value], [order], [ties])` evaluates the expression for every row in `table` (in row context with context transition) to build the list of values, then ranks the current context's value against it. `ALLSELECTED` makes the ranking cover the agents the user has selected rather than only the current row. `DENSE` gives 1, 2, 2, 3; `SKIP` gives 1, 2, 2, 4. Common bugs: using `VALUES` instead of `ALL`/`ALLSELECTED` (every agent ranks 1), and ranking on a text column with a measure that is blank for some rows (they rank last or cause ties).

Ranking within groups: change the first argument to `ALLEXCEPT(DimAgent, DimAgent[Team])` and the rank restarts per team.

### TOPN

`TOPN(n, table, orderBy, order)` returns a table of the top N rows. It is used inside `CALCULATE` or an iterator:

```dax
Files Top 5 Agents =
CALCULATE ( [Total Files], TOPN ( 5, ALLSELECTED ( DimAgent[AgentName] ), [Total Files], DESC ) )

Top 5 Share % = DIVIDE ( [Files Top 5 Agents], CALCULATE ( [Total Files], ALLSELECTED ( DimAgent ) ) )
```

`TOPN` includes ties, so it may return more than N rows. A visual-level Top N filter (Filters pane) is simpler for a plain bar chart; `TOPN` in a measure is needed when the value feeds another calculation or a card.

### SWITCH for selectable measures

Management wants one chart that can show Files, Errors or Accuracy depending on a button. Build a disconnected table with **Enter data** (`Metric`: Files, Errors, Accuracy %) and a slicer on it, then:

```dax
Selected Metric =
VAR Pick = SELECTEDVALUE ( MetricSelector[Metric], "Files" )
RETURN
    SWITCH ( Pick,
        "Files", [Total Files],
        "Errors", [Total Errors],
        "Accuracy %", [Accuracy %]
    )
```

`SELECTEDVALUE` returns the single selected value or the default. The measure's format cannot change per branch, so either keep metrics of one type per selector or use a dynamic format string (Measure tools → Format → Dynamic, available since 2023). Since 2020 the built-in **field parameters** feature (Modeling → New parameter → Fields) does this without DAX for both measures and axis columns and is preferred for simple cases.

### SWITCH(TRUE()) for banding

```dax
Accuracy Band =
SWITCH ( TRUE (),
    [Accuracy %] >= 0.98, "Green",
    [Accuracy %] >= 0.95, "Amber",
    "Red"
)
```

The first true branch wins, so order conditions from strictest to loosest. This measure feeds conditional formatting by field value.

### Debugging measures

- Build a table visual with the dimension and each variable exposed as its own measure.
- Use `CONCATENATEX(VALUES(...))` to see what a table variable contains.
- In DAX query view (2023+), write `EVALUATE SUMMARIZECOLUMNS(...)` to see results as a grid.

> **Interview note:** A frequent whiteboard task is "rank agents within team and show the top 3 per team". Answer: `RANKX(ALLEXCEPT(DimAgent, DimAgent[Team]), [Total Files], , DESC, DENSE)` as a measure, then a visual filter `Rank <= 3`.

### Try It Yourself

```dax
// Top 3 per team as one measure, usable as a visual filter
Rank In Team =
VAR R = RANKX ( ALLEXCEPT ( DimAgent, DimAgent[Team] ), [Total Files], , DESC, DENSE )
RETURN IF ( NOT ISBLANK ( [Total Files] ), R )

Is Top 3 In Team = IF ( [Rank In Team] <= 3, 1, 0 )
```

### Quiz

1. When is a DAX variable evaluated?
- [x] Once, where it is defined, and reused
- [ ] Every time it is referenced
- [ ] Only inside RETURN
> Variables are lazily evaluated once in the defining context; later CALCULATE does not change them.

2. `RANKX(VALUES(DimAgent[AgentName]), [Total Files])` in a matrix by agent shows 1 on every row. Why?
- [ ] DENSE ties
- [x] VALUES returns only the current agent, so every agent is ranked against itself
- [ ] The measure is blank
> Use ALL or ALLSELECTED so the ranking table includes all agents.

3. Which built-in feature replaces a SWITCH measure for choosing metrics?
- [ ] Bookmarks
- [x] Field parameters
- [ ] Drill-through
> Field parameters let a slicer swap measures or axis fields without DAX.

### Exercises

1. **Others bucket** — Show the top 5 states by files and a single "Others" bar for the rest.
<details><summary>Solution</summary>

Create a `StateGroup` calculated table with the states plus an "Others" row, or simpler: a measure `Files Grouped = IF(RANKX(ALL(DimState[StateCode]), [Total Files],,DESC) <= 5, [Total Files], BLANK())` for the top 5 and `Others = CALCULATE([Total Files], ALL(DimState)) - SUMX(TOPN(5, ALL(DimState[StateCode]), [Total Files]), [Total Files])` shown in a separate card or a union calculated table.

</details>

2. **Dynamic comparison** — Let the user choose "vs Last Week" or "vs Last Year" and return the percentage change.
<details><summary>Solution</summary>

```dax
Change % =
VAR Mode = SELECTEDVALUE ( CompareSelector[Mode], "vs Last Week" )
VAR Prior = SWITCH ( Mode,
    "vs Last Week", CALCULATE ( [Total Files], DATEADD ( DimDate[Date], -7, DAY ) ),
    "vs Last Year", CALCULATE ( [Total Files], SAMEPERIODLASTYEAR ( DimDate[Date] ) ) )
RETURN DIVIDE ( [Total Files] - Prior, Prior )
```

</details>

### Interview Questions

**Q: How does RANKX work and what are its common pitfalls?**
RANKX takes a table, evaluates the expression for each row of that table to build a sorted list, then evaluates the expression in the current context and returns its position. The pitfalls are: using VALUES instead of ALL or ALLSELECTED so the list has one row and everything ranks first; blanks in the expression, which rank last or tie unexpectedly unless you wrap the result in IF(NOT ISBLANK()); ranking in the total row, where the current value is the grand total and should be suppressed with HASONEVALUE; and choosing DENSE versus SKIP for ties. For ranking within groups, ALLEXCEPT on the grouping column keeps that filter while removing the rest.

**Q: Why use variables in DAX?**
Variables improve readability by naming intermediate results, improve performance because each variable is computed once rather than every time the expression is repeated, and remove the need for EARLIER in nested row contexts. They also make debugging practical, since you can RETURN any variable to inspect it. The semantic point to mention is that a variable is evaluated in the context where it is defined, not where it is used, so `VAR Total = [Sales]` followed by `CALCULATE(Total, ALL(Product))` still returns the filtered sales, which surprises people who expect the ALL to apply.

**Q: How would you let a user choose which measure a chart shows?**
The modern answer is a field parameter (Modeling → New parameter → Fields), which builds a table of measure references that a slicer selects and that a visual can bind to directly, including dynamic axis titles. The DAX answer is a disconnected selector table plus SELECTEDVALUE and SWITCH inside a measure, which is still needed when the choice must affect logic beyond a single well, such as a target or a colour, or when formats differ and you use a dynamic format string. I would mention that SWITCH evaluates only the matching branch, so unselected measures do not cost query time.

## Bookmarks, drill-through, tooltips, buttons and KPI visuals

Advanced report features let one page do the work of five. This chapter covers navigation and detail-on-demand features (bookmarks, drill-through, report-page tooltips, buttons) and the visuals built for targets (KPI, gauge).

### Drill-through

A drill-through page shows detail for one selected item. Create a page named *Agent Detail*, drag `DimAgent[AgentName]` into the **Drill through** well in the Visualizations pane, and build the page with daily production, error list and accuracy trend. Right-click any agent in any other page and choose **Drill through → Agent Detail**; the page opens filtered to that agent, with a back button added automatically. Tick **Keep all filters** so the week slicer travels along. Hide the detail page (right-click the tab → Hide) so it is reachable only by drill-through.

### Report-page tooltips

Create a small page (Format page → Canvas settings → Type: Tooltip), build a mini chart such as last 4 weeks of accuracy for the hovered agent, and set **Page information → Allow use as tooltip**. On the source visual, Format → Tooltips → Type: Report page, choose the page. Hovering a bar now shows a live mini chart for that bar's context.

### Bookmarks

A bookmark captures the state of a page: filters, slicer values, visual visibility, sort, and drill position. **View → Bookmarks → Add**. Uses:

- A **reset** bookmark that clears every slicer, tied to a button.
- Toggling between a chart and its table (two visuals stacked, two bookmarks showing one each).
- A guided story for a monthly review using **View** mode to step through bookmarks.

When updating a bookmark, right-click it → **Update**. Uncheck **Data** in the bookmark options when the bookmark should only change visibility, not filters; forgetting this is why "show table" bookmarks unexpectedly reset slicers.

```text
Bookmark options
  Data      : capture slicer and filter state
  Display   : capture visibility, spotlight, sort
  Current page : navigate to this page when applied
```

### Buttons and navigation

**Insert → Buttons** offers Back, Reset, Bookmark, Page navigation and Blank. A page-navigation button set to *Destination: fx* can read a measure, giving data-driven navigation. Format states (default, hover, pressed) with different fills so buttons feel clickable. A left-hand navigation strip of five buttons is the standard multi-page pattern.

### The Selection pane and layering

**View → Selection** lists visuals with eye icons. Bookmarks use this list to show or hide. Group visuals (Ctrl-click, right-click → Group) so a bookmark toggles a whole panel. Hidden visuals still render, so keep hidden layers small.

### KPI visual

The **KPI** visual shows a value, its trend and a colour versus a goal:

- **Value**: `[Total Files]`
- **Trend axis**: `DimDate[Date]` or `DimDate[WeekStart]`
- **Target**: `[Target Files]` (a measure from a targets table)

It turns green when value ≥ target and red otherwise (configurable). The trend sparkline needs the axis at the granularity of the report, so a weekly report should use `WeekStart`.

### Gauge

The **gauge** visual shows progress toward a maximum: Value `[Accuracy %]`, Minimum 0.9, Maximum 1, Target 0.98. Gauges take space; use one for the single most important SLA and cards for the rest.

### Conditional formatting by measure

Any colour can be driven by a measure returning a hex string:

```dax
Accuracy Colour =
SWITCH ( TRUE (),
    [Accuracy %] >= 0.98, "#117A65",
    [Accuracy %] >= 0.95, "#C79A00",
    "#C0392B"
)
```

Format → Columns → Color → fx → Format style: Field value → pick the measure. Bar colours, card callouts and matrix cells then follow the same rule.

> **Tip:** Every drill-through page should show, in its header, the value it is filtered to (`SELECTEDVALUE(DimAgent[AgentName])`), and a Back button top-left. Readers who land on a hidden page must always know where they are and how to return.

### Try It Yourself

```dax
// Target measure from a small targets table (State, WeeklyTarget) and status text
Target Files = SUM ( Targets[WeeklyTarget] )
Target Status =
VAR Gap = [Total Files] - [Target Files]
RETURN
    IF ( Gap >= 0, "On target (+" & FORMAT ( Gap, "#,##0" ) & ")", "Behind by " & FORMAT ( -Gap, "#,##0" ) )
```

### Quiz

1. What does a drill-through page need?
- [x] A field in its Drill through well
- [ ] A bookmark
- [ ] A gauge visual
> The drill-through well defines the field whose selected value filters the page.

2. Your "show table" bookmark resets the slicers. Fix?
- [ ] Delete the slicers
- [x] Untick Data in the bookmark options and update it
- [ ] Use a gauge instead
> With Data unticked the bookmark captures only display state.

3. Which visual shows value, trend and target together?
- [ ] Card
- [x] KPI
- [ ] Table
> KPI combines a callout value, a sparkline trend axis and a target with status colour.

### Exercises

1. **Agent detail** — Build a hidden drill-through page for agents that keeps the current week filter and shows the agent's name in the header.
<details><summary>Solution</summary>

New page; drag `DimAgent[AgentName]` to Drill through; toggle Keep all filters on; add a card with `SELECTEDVALUE(DimAgent[AgentName])`; add daily line chart and error table; hide the page. Test by right-clicking an agent bar on the main page.

</details>

2. **Chart/table toggle** — Two buttons switch a region between a column chart and a matrix without touching filters.
<details><summary>Solution</summary>

Stack the chart and matrix; in Selection pane hide the matrix, add bookmark "Chart" with Data unticked; hide chart, show matrix, add bookmark "Table"; insert two Bookmark buttons pointing to each.

</details>

### Interview Questions

**Q: What is the difference between drill-down and drill-through?**
Drill-down moves within a hierarchy inside a single visual, for example year to quarter to month, using the arrows in the visual header. Drill-through navigates to a different page that is filtered to the selected value, such as an agent detail page, and can carry other filters with Keep all filters. Drill-down is for exploration in place; drill-through is for detail-on-demand while keeping the summary page clean. A related feature is cross-report drill-through, which jumps to a page in a different report in the same workspace when both share the field.

**Q: How do bookmarks work and where do they go wrong?**
A bookmark stores a snapshot of page state: filter and slicer values (Data), visual visibility, spotlight and sort (Display), and the current page. Buttons or the Bookmarks pane apply it. They go wrong when Data is captured unintentionally, resetting slicers when the user only wanted a layout change; when visuals are added later and are not included because the bookmark was scoped to selected visuals; and when there are dozens of bookmarks for what a field parameter or a single measure could do. My rule is to use bookmarks for display toggles and resets, and to name them by action.

**Q: How would you show accuracy against an SLA in a way an executive understands immediately?**
Use a KPI or card with the accuracy value in large type, a colour driven by a measure that returns green above 98%, amber between 95% and 98% and red below, and a one-line status text such as "0.6 points below SLA". Next to it a sparkline of the last eight weeks gives direction. I would avoid a gauge for more than one metric because gauges consume space without adding precision, and I would put the threshold in a targets table rather than hard-coding it in DAX so the SLA can change without editing the report.

## Row-level security

**Row-level security (RLS)** restricts which rows of the model a user can see. A regional manager opening the production report sees only their region; a team lead sees only their agents; the operations director sees everything. RLS is defined in Desktop as DAX filters on tables, then users are assigned to roles in the Service.

### Static roles

**Modeling → Manage roles → Create**. Name the role `Texas`, select `DimState`, and enter a filter expression:

```dax
[StateCode] = "TX"
```

The filter behaves like a permanent filter on `DimState`; through the one-to-many relationship it also restricts `FactProduction`. Test with **Modeling → View as → Texas**, which shows the report as that role sees it. Static roles suit a handful of fixed groups.

### Dynamic RLS with USERPRINCIPALNAME

Static roles do not scale to fifty team leads. Instead, add a `Security` table mapping user email to what they may see:

| UserEmail | Team |
|---|---|
| lead1@company.com | Team A |
| lead2@company.com | Team B |
| director@company.com | Team A |
| director@company.com | Team B |

Relate `Security[Team]` to `DimAgent[Team]` (many-to-one from Security to a `DimTeam`, or use a filter expression). Create one role, `Dynamic`, with this filter on `DimAgent`:

```dax
[Team] IN
    CALCULATETABLE (
        VALUES ( Security[Team] ),
        Security[UserEmail] = USERPRINCIPALNAME ()
    )
```

`USERPRINCIPALNAME()` returns the signed-in user's email in the Service (and your own in Desktop, which is why *View as → Other user* exists for testing). A user with no row in `Security` sees nothing, which is the safe default.

A simpler dynamic pattern: put the filter on `Security` itself, `[UserEmail] = USERPRINCIPALNAME()`, and set the `Security → DimTeam` relationship to bidirectional with **Apply security filter in both directions** ticked in the relationship dialog. Then the filter flows from Security to DimTeam to DimAgent to the fact. This avoids `CALCULATETABLE` in the role and performs well.

### Assigning users in the Service

After publishing: workspace → dataset (semantic model) → **… → Security**. Select the role and add users or, better, Azure AD security groups. Membership changes in the group then require no report changes. Workspace admins, members and contributors bypass RLS; only **Viewer** role users are filtered. That catches many teams out during testing: test with a viewer account.

### RLS and other features

- **Apps**: RLS applies to app audiences who have Viewer permission.
- **Excel Analyze in Excel** and **paginated reports** honour RLS.
- **Composite models / DirectQuery**: RLS is defined in the source model and honoured downstream.
- **Object-level security** (hiding tables or columns) needs Tabular Editor and applies to the whole role.
- **Performance**: RLS filters are applied to every query; a filter on a large fact table or one that uses complex DAX slows everything. Filter dimensions, not facts.

```text
Security table (email → team)  →  DimTeam  →  DimAgent  →  FactProduction
                     filtered by USERPRINCIPALNAME()
```

### Testing checklist

1. View as each role in Desktop and check cards show only the expected rows.
2. Publish, share with a real viewer account, open in a private browser window.
3. Check a user missing from the Security table sees blank visuals, not everything.
4. Verify totals: the sum across roles equals the unfiltered total.

> **Warning:** A measure using `ALL(DimState)` inside a report with RLS still respects RLS; `ALL` removes report filters, not security filters. But a `Security` table with a blank email row can match no one, or, if the relationship is misconfigured, everyone. Always test with an account that has no row.

### Try It Yourself

```dax
// Role filter on DimAgent for dynamic team-level security
[Team] IN
    CALCULATETABLE (
        VALUES ( Security[Team] ),
        Security[UserEmail] = USERPRINCIPALNAME ()
    )
// Diagnostic measure (hide before publishing): shows who the engine thinks you are
Current User = USERPRINCIPALNAME ()
```

### Quiz

1. Where are users assigned to RLS roles?
- [ ] In Power BI Desktop under Manage roles
- [x] In the Service, on the dataset's Security page
- [ ] In Power Query
> Desktop defines roles and filters; membership is managed on the published dataset.

2. Which workspace roles bypass RLS?
- [x] Admin, Member and Contributor
- [ ] Viewer only
- [ ] None
> Only Viewers are filtered; always test with a viewer account.

3. What does USERPRINCIPALNAME() return?
- [ ] The workspace name
- [x] The signed-in user's principal name (email)
- [ ] The dataset owner
> It is the key for dynamic RLS lookups against a security table.

### Exercises

1. **Static regions** — Create roles for South and Mountain regions and verify with View as.
<details><summary>Solution</summary>

Manage roles → Create "South" → DimState filter `[Region] = "South"`; repeat for "Mountain". View as → tick South: cards and charts show only southern states; combined with Mountain the union appears.

</details>

2. **Dynamic with fallback** — Team leads see their team; anyone in the Security table with Team = "ALL" sees everything.
<details><summary>Solution</summary>

```dax
VAR Teams = CALCULATETABLE ( VALUES ( Security[Team] ), Security[UserEmail] = USERPRINCIPALNAME () )
RETURN "ALL" IN Teams || [Team] IN Teams
```

Enter this as the DimAgent filter for the single dynamic role.

</details>

### Interview Questions

**Q: How do you implement row-level security in Power BI?**
Define roles in Desktop under Manage roles with DAX filter expressions on dimension tables, either static (`[Region] = "South"`) or dynamic using USERPRINCIPALNAME() against a security mapping table. Test with View as, publish, then add users or Azure AD groups to roles on the dataset's Security page in the Service. Filters propagate through relationships to fact tables, so filtering a small dimension is enough. Key points to state: workspace admins, members and contributors bypass RLS, so testing needs a viewer; a user with no mapping should see nothing; and RLS filters run on every query so they must be simple.

**Q: What is the difference between static and dynamic RLS, and when do you use each?**
Static RLS hard-codes the filter value in the role, so each group needs its own role: fine for three regions. Dynamic RLS uses one role whose filter looks up the current user in a security table, so adding a team lead is a data change rather than a model change and the mapping can be maintained by the business in SharePoint or a database. Dynamic is the default for anything beyond a handful of groups. The trade-off is that the security table becomes part of the refresh and must be validated, and a stale or malformed row can silently over- or under-expose data.

**Q: Does RLS protect data if the user can download the PBIX?**
No. RLS is enforced by the engine when queries run through the Service or a live connection. A user who can download the `.pbix` from the Service gets the whole model, which is why the Download this file permission should be off for viewers, or the export settings restricted at tenant level. Similarly, Build permission on the dataset lets a user create their own reports but still within RLS, while workspace Member access bypasses it entirely. For sensitive data, combine RLS with sensitivity labels and tenant export controls, and keep report authors out of viewer workspaces.

# LEVEL: Expert

## Publishing, workspaces, apps, scheduled refresh and gateways

A report only creates value when the right people open the right version at the right time. This chapter covers the Service side: how content is organised, how it is distributed, and how it stays fresh without anyone pressing Refresh.

### Publish

**Home → Publish** in Desktop asks for a destination workspace and uploads two objects: the **semantic model** (dataset: tables, relationships, measures) and the **report** (pages). They are separate items in the Service. Several reports can connect to one semantic model, which is the basis of the "one model, many reports" discipline. Republishing overwrites both; if someone edited the report online, Desktop warns you.

### Workspaces

A **workspace** is a container with its own membership:

| Role | Can |
|---|---|
| Admin | Everything including deleting the workspace and managing roles |
| Member | Publish, share, update apps, add Contributors |
| Contributor | Publish and edit content, schedule refresh |
| Viewer | View and interact only; RLS applies |

Structure workspaces by team or subject (`Production Ops`, `Finance`), not by person. Use **Dev / Test / Prod** workspaces with **Deployment pipelines** (Premium/PPU/Fabric) to promote content and swap data-source rules per stage.

### Sharing and apps

Three ways to distribute:

1. **Share a report link**: quick, but each share is a separate permission to manage.
2. **Workspace Viewer access**: readers see everything in the workspace.
3. **App**: a packaged, read-only view of selected reports with a navigation menu and **audiences** (each audience sees a subset). Apps are the correct choice for management consumption; publish updates with **Update app** after testing in the workspace.

Consumers need a Pro licence unless the workspace is on Premium or Fabric F64+ capacity, where free users can view.

### Scheduled refresh

Import models need refresh. On the semantic model → **Settings → Refresh**, set a schedule. Limits: 8 refreshes per day on shared capacity (Pro), 48 on Premium/PPU. Times are in the tenant's time zone unless changed. Refresh failure notifications go to the owner by email; add colleagues under **Send refresh failure notifications to**.

Before a schedule can run, every data source must have credentials configured under **Settings → Data source credentials**, and on-premises sources need a gateway.

### Gateways

The **On-premises data gateway** is a Windows service that lets the Service reach data behind your firewall: a SQL Server, a network share holding the daily Excel exports, a SharePoint on-prem server. Modes:

- **Standard (enterprise) mode**: installed on a server, shared by many users and datasets, supports DirectQuery and clustering for high availability. Managed under Settings → Manage connections and gateways.
- **Personal mode**: installed on your own PC, only for your Import datasets, cannot be shared. Fine for a single analyst, wrong for a team because it dies when your laptop sleeps.

Setup: install the gateway on an always-on machine, sign in with the org account, register it, then in the Service add a data source to the gateway with the exact path or server name the dataset uses and stored credentials. On the dataset settings, map each source to that gateway connection.

```text
Desktop (path \\fileserver\reports\Production.xlsx)
   → publish → Service dataset
   → Settings: gateway connection "FileServer Reports" (same UNC path, service account creds)
   → Scheduled refresh 07:00, 13:00
```

Paths must match exactly between the `.pbix` and the gateway data source, which is why Power Query parameters for folder paths pay off here. Local drive letters (`C:\`) work only if the gateway machine has that path; use UNC paths.

### Refresh history and troubleshooting

**Settings → Refresh history** lists each run with duration and error. Common failures: credentials expired (re-enter them), file locked by an open Excel session, gateway offline, a column type change in the source that breaks a Power Query step, or the 2-hour (shared) / 5-hour (Premium) refresh time limit.

### Endorsement, lineage and sensitivity

Mark the production semantic model **Certified** or **Promoted** in its settings so people connect to the right one. **Lineage view** in the workspace shows source → dataset → report → app. Sensitivity labels (Microsoft Purview) travel with exports to Excel and PDF.

> **Interview note:** "Why did the refresh fail at 7 am and how would you fix it?" is a practical question. Walk through Refresh history, the error class, the gateway status page, the credentials, and finally the Power Query step named in the error.

### Try It Yourself

```powerquery
// Parameterised UNC source so Desktop and the gateway resolve the same path
let
    Root = SourceFolder, // parameter, e.g. "\\fileserver\reports\"
    Source = Folder.Files(Root & "daily"),
    Csvs = Table.SelectRows(Source, each Text.EndsWith([Name], ".csv")),
    Latest = Table.Sort(Csvs, {{"Date modified", Order.Descending}})
in
    Latest
```

### Quiz

1. What does Publish upload to the Service?
- [x] A semantic model and a report as separate items
- [ ] Only the report pages
- [ ] Only the data
> Datasets and reports are distinct; many reports can share one dataset.

2. Which gateway mode should a team use?
- [ ] Personal mode on the analyst's laptop
- [x] Standard mode on an always-on server
- [ ] No gateway; the Service reads local files directly
> Standard mode is shared, supports DirectQuery and can be clustered; personal mode is single-user.

3. How many scheduled refreshes per day does shared (Pro) capacity allow?
- [ ] Unlimited
- [x] 8
- [ ] 48
> Pro allows 8 per day; Premium and PPU allow 48.

### Exercises

1. **App with audiences** — Publish a workspace app where team leads see the agent detail report and the director sees the executive summary only.
<details><summary>Solution</summary>

Workspace → Create app → Content: add both reports → Audience: create "Team Leads" with the detail report and "Executives" with the summary, assign the corresponding security groups → Publish app. Update app after changes.

</details>

2. **Refresh failure drill** — A 7 am refresh failed with "The credentials provided for the File source are invalid". List the fix steps.
<details><summary>Solution</summary>

Open dataset Settings → Data source credentials → Edit credentials → re-enter the service account (Windows auth for file shares). If the source goes through a gateway, check Manage connections and gateways → the connection → Settings and update there. Run Refresh now, confirm in Refresh history.

</details>

### Interview Questions

**Q: Explain the difference between a workspace, a report, a semantic model and an app.**
A workspace is a collaboration container with role-based membership. A semantic model (dataset) is the published data model with tables, relationships and measures; a report is a set of pages bound to a model; the two are separate items so one model can serve many reports. An app is a packaged, read-only distribution layer over selected workspace content with navigation and audiences, updated deliberately by the publisher. Authors work in the workspace, consumers use the app, and that separation is what lets you test changes before readers see them.

**Q: How does scheduled refresh work for a file on a network share?**
The Service cannot reach on-premises paths, so an on-premises data gateway in standard mode must be installed on an always-on machine with access to the share. A gateway admin adds a data source of type File or Folder with the same UNC path the `.pbix` uses and stored credentials. In the dataset settings the source is mapped to that gateway connection, credentials are validated, and a schedule is set within the 8-per-day Pro limit. I would use a Power Query parameter for the root path so Desktop and the gateway use identical strings, and I would subscribe a second person to failure notifications.

**Q: What are deployment pipelines and why use them?**
Deployment pipelines (Premium, PPU or Fabric capacity) chain Development, Test and Production workspaces and let you deploy items between stages with a comparison of what changed. Data-source rules and parameter rules per stage let Test point at a test database and Production at the live one without editing the model. This gives a controlled release process: build in Dev, validate numbers in Test against last week's signed-off report, then promote to Prod and update the app. Without capacity, the manual equivalent is separate workspaces and disciplined republishing with parameters.

## Performance: VertiPaq, Performance Analyzer and DAX Studio

A dashboard that takes eight seconds per click is abandoned. Performance work in Power BI has three layers: the model (how VertiPaq stores data), the DAX (how measures query it), and the report (how many visuals ask questions at once). This chapter gives the tools to find which layer is the problem.

### How VertiPaq stores data

Import mode uses the **VertiPaq** in-memory column store. Each column is stored separately and compressed with:

- **Value encoding**: integers stored directly with an offset.
- **Hash (dictionary) encoding**: each distinct value gets an integer ID; the column stores IDs.
- **Run-length encoding** on top of both when consecutive values repeat.

Consequences: memory is driven by **cardinality** (number of distinct values), not row count. A `FileNumber` text column with 2 million distinct values may take more space than the other 20 columns combined. A `DateTime` column with seconds is high-cardinality; split it into Date and Time, or drop the time. Columns you never use in visuals or measures should be removed in Power Query.

### Measuring the model

**DAX Studio** (free, daxstudio.org) connects to the Desktop model. **Advanced → View Metrics** runs VertiPaq Analyzer and lists every column with cardinality, size and encoding. Sort by size, and the first three rows usually explain most of the file. Typical wins:

| Finding | Fix |
|---|---|
| Text key column 40% of model | Replace with integer surrogate key |
| DateTime with seconds | Split into Date and Time columns or round |
| Decimal column with 8 decimals | Round to 2 in Power Query (fixed decimal type) |
| Column never referenced | Remove |
| Auto date/time tables | Turn off the option |

### Performance Analyzer

**View → Performance Analyzer → Start recording**, then interact with the page. Each visual shows three timings: **DAX query** (engine time), **Visual display** (render time) and **Other** (waiting for other visuals). Sort by duration. If DAX query dominates, copy the query and go to DAX Studio; if visual display dominates, the visual is drawing too many points (a scatter with 100 000 marks, a matrix with 50 000 cells); if Other dominates, the page has too many visuals competing.

### Reading a query in DAX Studio

Paste the query, enable **Server Timings** and **Query Plan**, run it. Server Timings splits time into **SE** (storage engine, fast, multi-threaded, scans compressed columns) and **FE** (formula engine, single-threaded, evaluates DAX logic). A healthy query is mostly SE. A slow one shows high FE time or many SE queries (thousands of `SE` events mean a per-row context transition) or **CallbackDataID** in the xmSQL, which means the storage engine had to call back to the formula engine for each row.

```dax
// Slow: measure inside an iterator over the fact triggers per-row callbacks
Slow Minutes = SUMX ( FactProduction, [Minutes Per File Measure] * FactProduction[Files] )
// Fast: pure column arithmetic is pushed to the storage engine
Fast Minutes = SUMX ( FactProduction, FactProduction[MinutesPerFile] * FactProduction[Files] )
```

### DAX patterns that hurt

- `FILTER(FactTable, ...)` as a CALCULATE argument: filters the whole fact; filter a column or dimension instead.
- `DISTINCTCOUNT` on a high-cardinality text column.
- `IF` inside iterators over facts (`SUMX(Fact, IF(...))`) causes callbacks; move the condition to a CALCULATE filter.
- Bidirectional relationships everywhere, multiplying the filter propagation work.
- Measures that call `ALL` on the fact table.

### Report-level tuning

- Fewer visuals per page: each is at least one query. A page with 30 visuals fires 30+ queries on every slicer change.
- Replace multiple cards with one multi-row card or a matrix.
- Turn off **interactions** where not needed (Edit interactions), so a click does not requery everything.
- Avoid slicers on high-cardinality columns; use search-enabled dropdowns.
- Use **Apply** buttons on slicers (Format → Slicer settings → Selection → Show Apply button) so users set several values then run once.

### Aggregations and hybrid tables

For very large fact tables, Power BI can keep a small Import aggregation table (files per day per state) and fall through to DirectQuery for detail. **Manage aggregations** maps the summary columns; queries that can be answered by the summary never touch the source.

> **Tip:** Measure before and after. Record the Performance Analyzer numbers for the three slowest visuals, make one change, re-record. Optimisation without numbers is guessing.

### Try It Yourself

```dax
// DAX Studio: EVALUATE the query behind a slow visual and compare two measure versions
EVALUATE
SUMMARIZECOLUMNS (
    DimState[StateCode],
    "Slow", [Slow Minutes],
    "Fast", [Fast Minutes]
)
ORDER BY DimState[StateCode]
```

### Quiz

1. What most determines a column's size in VertiPaq?
- [ ] Number of rows
- [x] Number of distinct values (cardinality)
- [ ] Column name length
> Dictionary encoding stores each distinct value once; high cardinality means a big dictionary and poor compression.

2. In DAX Studio Server Timings, which engine is single-threaded?
- [ ] Storage engine
- [x] Formula engine
- [ ] Both
> The formula engine evaluates DAX logic on one thread; keeping work in the storage engine is the goal.

3. Performance Analyzer shows a visual with high "Other" time. Likely cause?
- [x] Too many visuals on the page waiting for each other
- [ ] A slow DAX measure
- [ ] Row-level security
> Other measures waiting time caused by other visuals' queries and rendering.

### Exercises

1. **Shrink the model** — A model is 900 MB. Using VertiPaq Analyzer you find `FileNumber` (text, 3 million distinct) and `CompletedDateTime` (with seconds). Propose changes and estimate the effect.
<details><summary>Solution</summary>

Remove `FileNumber` from the model if only used for counting (use COUNTROWS), or keep an integer surrogate; split `CompletedDateTime` into `CompletedDate` (365 distinct values per year) and drop the time or round to hour. These two changes typically remove more than half of the model size because both columns have near-unique dictionaries.

</details>

2. **Find the slow visual** — Describe the steps to identify and fix a page that takes 6 seconds per slicer click.
<details><summary>Solution</summary>

Performance Analyzer → Start recording → change the slicer → sort by duration. For the top visual, check whether DAX query or Visual display dominates. Copy the query to DAX Studio with Server Timings; if FE-heavy, rewrite the measure (avoid FILTER on the fact, avoid measure-in-iterator). If display-heavy, reduce data points or switch visual type. Re-record and compare.

</details>

### Interview Questions

**Q: How do you troubleshoot a slow Power BI report?**
First reproduce it and measure with Performance Analyzer to see per-visual DAX, display and other time. If DAX dominates, take the query into DAX Studio with Server Timings to see whether the formula engine or the storage engine is the bottleneck and whether there are callbacks or thousands of storage-engine queries, then rewrite the measure: filter columns instead of tables, move conditions into CALCULATE, avoid measures inside iterators over facts. If display dominates, reduce marks or change the visual. In parallel I check the model with VertiPaq Analyzer for high-cardinality columns and bidirectional relationships. Finally I reduce visual count and interactions on the page and re-measure to prove the improvement.

**Q: What is the difference between the storage engine and the formula engine?**
The storage engine (VertiPaq for Import) scans compressed column data in parallel and answers simple aggregations and filters expressed as xmSQL; it is fast and multi-threaded and caches results. The formula engine executes the DAX logic tree single-threaded, orchestrating storage-engine requests and doing whatever the storage engine cannot, such as complex conditional logic or per-row callbacks. Well-performing DAX pushes most work to the storage engine; a measure that forces the formula engine to iterate millions of rows or that generates CallbackDataID in xmSQL is the usual source of slowness.

**Q: Why should a DateTime column be split into Date and Time?**
VertiPaq compresses by dictionary, so a DateTime column with second precision has nearly one distinct value per row and compresses poorly, inflating memory and slowing scans. Splitting yields a Date column with a few thousand distinct values and a Time column with at most 86 400, both of which compress very well, and lets Date relate to the date dimension for time intelligence. If time of day is not needed for analysis, drop it entirely. In a production export with completion timestamps I would keep Date, round Time to the hour for shift analysis, and see model size fall substantially.

## Incremental refresh and dataflows

Two Service features move a report from "analyst's laptop project" to "shared data platform": **incremental refresh**, which refreshes only recent data so a large model reloads in minutes, and **dataflows**, which move Power Query logic into the cloud where several reports can reuse it.

### Why incremental refresh

A full refresh of five years of production rows every morning reads all five years every time. With incremental refresh, historical partitions are loaded once and only the last N days are reloaded. Requirements: an Import (or hybrid) table with a date or datetime column, a source that supports query folding (SQL Server, Dataverse, folding-capable folders do not; plain Excel does not fold), and a Pro or higher licence (available in Pro since 2020).

### Setting it up

1. In Power Query, create two **datetime** parameters named exactly `RangeStart` and `RangeEnd`. Give them any current values.
2. Filter the fact table's datetime column with them: **Date filter → Custom** → is after or equal to `RangeStart` and before `RangeEnd`. The half-open interval avoids duplicating rows on the boundary.
3. Close & Apply. In Report view, right-click the table → **Incremental refresh**: archive data starting 5 years before refresh date; incrementally refresh data starting 7 days before refresh date. Optional: **Detect data changes** on a `ModifiedDate` column to refresh only partitions with changes, and **Only refresh complete days**.
4. Publish. The first Service refresh builds the partitions; subsequent refreshes touch only the recent ones.

```powerquery
let
    Source = Sql.Database("prodsql", "Title"),
    Fact = Source{[Schema="dbo", Item="Production"]}[Data],
    Ranged = Table.SelectRows(Fact, each [CompletedDateTime] >= RangeStart and [CompletedDateTime] < RangeEnd)
in
    Ranged
```

The policy replaces `RangeStart`/`RangeEnd` per partition; the filter must fold so each partition's query is executed at the source. Verify with **View Native Query** on the last step.

### Caveats

- After publishing you cannot download the `.pbix` from the Service, because the partitions live only in the cloud. Keep the source file.
- Changing the model schema requires a full refresh of all partitions (the Service does this automatically on the next refresh after publishing).
- Use **XMLA endpoint** (Premium/Fabric) with SQL Server Management Studio or Tabular Editor to inspect partitions and refresh a single one.
- Partitions are by the date column; a late-arriving row dated 60 days ago will not be picked up unless the incremental window covers it or Detect data changes is on.

### Dataflows

A **dataflow** is Power Query running in the Service, writing its output to storage (a CSV-backed table in the Dataverse-style storage, or OneLake in Fabric as Dataflow Gen2). Create one in a workspace with **New → Dataflow**, define queries in the online editor (same ribbon as Desktop), and set a refresh schedule. Reports then use **Get data → Dataflows** to import the prepared tables.

Why bother:

| Problem | Dataflow solution |
|---|---|
| Six reports each clean the same six rate sheets | One dataflow cleans them once; reports import the result |
| Cleaning logic lives in whoever's laptop has the pbix | Logic is in the Service, visible and versioned |
| Source is slow; every report refresh hits it | Dataflow hits it once; reports read the stored result |
| Analysts need a curated agent dimension | `DimAgent` dataflow becomes the single source |

Dataflows support **linked entities** (referencing another dataflow's table without copying) and **computed entities** (transforming a linked entity) on Premium/PPU. Incremental refresh is also available on dataflow tables.

### Layering

```text
Sources (SQL, SharePoint, Excel)
   → Dataflow "Staging": raw pulls, typed, no logic
   → Dataflow "Curated": DimAgent, DimState, FactProduction with business rules
   → Semantic models per subject import curated tables
   → Reports and apps
```

This is the same staging/model idea from Power Query, lifted to the workspace. In Microsoft Fabric the layers become Lakehouse tables and Dataflows Gen2 write directly to OneLake; Direct Lake mode then lets a semantic model read those tables without Import or DirectQuery.

> **Warning:** Incremental refresh on a non-folding source silently degrades to reading the whole source per partition, which can be slower than a normal full refresh. Always confirm folding before enabling the policy.

### Try It Yourself

```powerquery
// The two required parameters, as they appear in the Advanced Editor
// RangeStart
#datetime(2026, 1, 1, 0, 0, 0) meta [IsParameterQuery=true, Type="DateTime", IsParameterQueryRequired=true]
// RangeEnd
#datetime(2026, 12, 31, 0, 0, 0) meta [IsParameterQuery=true, Type="DateTime", IsParameterQueryRequired=true]
```

### Quiz

1. What must the parameters for incremental refresh be named?
- [ ] StartDate and EndDate
- [x] RangeStart and RangeEnd
- [ ] From and To
> The Service looks for these exact names and datetime type.

2. Why must the incremental filter fold?
- [x] So each partition's query runs at the source instead of pulling everything
- [ ] Folding is required for DAX
- [ ] It is not required
> Without folding, every partition refresh reads the whole source, defeating the purpose.

3. What is a dataflow?
- [ ] A DAX table
- [x] Power Query running in the Service with stored output that reports can import
- [ ] A gateway feature
> Dataflows centralise transformation logic and let many datasets reuse the result.

### Exercises

1. **Configure the policy** — Set up incremental refresh on a SQL-backed production table: keep 3 years, refresh 14 days, only complete days.
<details><summary>Solution</summary>

Create RangeStart/RangeEnd datetime parameters; filter `CompletedDateTime >= RangeStart and < RangeEnd`; check View Native Query; right-click table → Incremental refresh: Archive 3 Years, Incrementally refresh 14 Days, tick Only refresh complete days; publish; run first refresh and check Refresh history duration.

</details>

2. **Shared rate dimension** — Move the six-underwriter rate matrix cleaning into a dataflow and connect a report to it.
<details><summary>Solution</summary>

Workspace → New → Dataflow → Add new tables → SharePoint folder → apply the same combine-and-unpivot steps → Save and refresh. In Desktop: Get data → Dataflows → select the workspace and table → Load. Schedule the dataflow to refresh before the datasets that depend on it.

</details>

### Interview Questions

**Q: How does incremental refresh work in Power BI?**
You define RangeStart and RangeEnd datetime parameters, filter the fact table on them in Power Query with a half-open interval, and set a policy on the table stating how much history to keep and how many recent days to refresh. On publish the Service partitions the table by period; each refresh only re-queries the recent partitions, substituting the parameter values per partition. It requires query folding so partition filters execute at the source, works only on Import or hybrid tables, and the pbix can no longer be downloaded afterwards. Optional Detect data changes refreshes only partitions whose max modified date changed, which is ideal for corrections to older production records.

**Q: When would you use a dataflow instead of Power Query in the pbix?**
When the same transformation feeds more than one semantic model, when the transformation logic should be visible and maintained centrally rather than inside someone's file, when the source is slow or rate-limited and should be read once, or when business users need curated tables (a certified agent dimension) they can build on. Inside a single report with a single author, Power Query in the pbix is simpler. The trade-offs are an extra refresh dependency to schedule, slightly more latency, and the need for Premium or PPU for linked and computed entities.

**Q: What is Direct Lake and how does it differ from Import and DirectQuery?**
Direct Lake is a Fabric storage mode where the semantic model reads Delta/Parquet tables in OneLake directly into memory on demand, giving Import-like query performance without a scheduled copy and DirectQuery-like freshness without sending SQL per visual. It falls back to DirectQuery when a table or query is not supported. Compared with Import it removes the refresh step and file size limits; compared with DirectQuery it avoids source load and the DAX restrictions. It requires the data to be in OneLake, typically written by Dataflows Gen2 or pipelines, so it is relevant when the organisation has adopted Fabric.

## Case study: the weekly production dashboard

This chapter builds, end to end, the report a title-insurance production team lead needs every Monday: files completed by state and agent, accuracy against SLA, turnaround time, backlog, and who is behind. It combines everything in the course and is the shape of the take-home test analysts are given in interviews.

### Requirements

| Question | Metric | SLA / target |
|---|---|---|
| Did we hit volume? | Files completed per week, by state | Weekly target table per state |
| Are we accurate? | Accuracy % = (files − QA defects) / files | ≥ 98% |
| Are we fast? | Turnaround (TAT) hours from received to completed, median and % within 24h | 90% within 24h |
| What is waiting? | Backlog = received − completed, cumulative | Below 150 files |
| Who needs help? | Agents below target or below 95% accuracy | Exception list |

### Sources

- `Production.csv` daily export: `FileNo, State, County, AgentID, ReceivedAt, CompletedAt, Status`.
- `QA.xlsx`: `FileNo, CheckerID, CheckedAt, DefectType` (one row per defect; a file with no row is clean).
- `Agents.xlsx` from HR: `AgentID, AgentName, Team, Shift, StartDate, EndDate`.
- `Targets.xlsx`: `State, WeekStart, TargetFiles`.

### Model

```text
DimDate ─┬─< FactProduction (grain: one file)  >─ DimAgent
         ├─< FactQA (grain: one defect)         >─ DimAgent (checker, inactive)
         └─< Targets (grain: state-week)        >─ DimState
FactProduction >─ DimState
```

`FactProduction` keeps one row per file with `ReceivedDate`, `CompletedDate` (active to DimDate), `TATHours` computed in Power Query as `Duration.TotalHours([CompletedAt] - [ReceivedAt])`, and `IsCompleted`. Time parts are dropped after computing TAT. `FactQA` relates to `DimDate` on `CheckedAt` date and to `FactProduction` only through `FileNo` in Power Query, where each production row gets a `DefectCount` via a Group-and-Merge so the accuracy measure is a simple ratio.

### Measures

```dax
Files Completed = CALCULATE ( COUNTROWS ( FactProduction ), FactProduction[IsCompleted] = 1 )
Files Received  = CALCULATE ( COUNTROWS ( FactProduction ),
                    USERELATIONSHIP ( FactProduction[ReceivedDate], DimDate[Date] ) )
Defects         = SUM ( FactProduction[DefectCount] )
Accuracy %      = DIVIDE ( [Files Completed] - [Defects], [Files Completed] )
Median TAT Hrs  = MEDIANX ( FILTER ( FactProduction, FactProduction[IsCompleted] = 1 ), FactProduction[TATHours] )
Within 24h %    = DIVIDE ( CALCULATE ( [Files Completed], FactProduction[TATHours] <= 24 ), [Files Completed] )
Backlog         =
    VAR LastDay = MAX ( DimDate[Date] )
    RETURN CALCULATE ( [Files Received] - [Files Completed],
             ALL ( DimDate ), DimDate[Date] <= LastDay )
Target Files    = SUM ( Targets[TargetFiles] )
Volume vs Target % = DIVIDE ( [Files Completed], [Target Files] )
Agents Behind   = COUNTX ( VALUES ( DimAgent[AgentKey] ),
                    IF ( [Accuracy %] < 0.95 || [Volume vs Target %] < 0.9, 1 ) )
```

`Backlog` is a running difference: everything received minus everything completed up to the last date in context, computed by removing the date filter and re-applying a "to date" filter. `MEDIANX` over a filtered fact is acceptable at this size (tens of thousands of rows per week).

### Pages

1. **Summary**: title with dynamic subtitle (week range); cards for Files Completed vs target, Accuracy % with colour, Within 24h %, Backlog; KPI visual with weekly trend; column chart files by state with target line (Analytics pane → Constant line bound to Target); line chart of daily received vs completed.
2. **Agents**: matrix of agents (rows) by day (columns) with Files and Accuracy %, conditional colour on accuracy; slicer by team; button to Agent Detail drill-through.
3. **Agent Detail** (hidden, drill-through): agent header, daily files, list of defects with type, TAT distribution.
4. **Exceptions**: table filtered to `Agents Behind` and states under 90% of target, exported weekly to the ops email.

The week slicer is Relative date, Last 1 week (calendar), synced to all pages. Interactions are edited so the target cards ignore state clicks.

### Refresh and distribution

Files land on a SharePoint folder each night at 02:00. A dataflow combines and types them at 05:00; the semantic model refreshes at 06:00 via the workspace's standard gateway (for the HR share) and at 12:00; the app audience *Production Leads* opens the Summary page. A Power Automate flow exports the Exceptions page to PDF every Monday 07:30 and emails it.

### Validation

Before the first Monday: reconcile `Files Completed` for a past week against the legacy Excel status report; check backlog against the queue count in the production system; confirm accuracy with QA's own numbers. Document each tie-out in the report's About page.

> **Interview note:** In a take-home test, the reviewer checks three things first: is there a date table, are ratios measures rather than columns, and does the summary page answer the business question without scrolling. Get those right before polishing.

### Try It Yourself

```dax
// Exception flag measure used as a visual-level filter on the Exceptions page
Exception Reason =
VAR Acc = [Accuracy %]
VAR Vol = [Volume vs Target %]
RETURN
    SWITCH ( TRUE (),
        Acc < 0.95 && Vol < 0.9, "Accuracy and volume",
        Acc < 0.95, "Accuracy below 95%",
        Vol < 0.9, "Volume below 90% of target",
        BLANK ()
    )
```

### Quiz

1. Why is `DefectCount` merged into FactProduction in Power Query rather than computed in DAX across two facts?
- [x] So Accuracy % becomes a simple ratio of columns in one table, which is faster and easier to validate
- [ ] DAX cannot count rows in another table
- [ ] Merges are always faster than relationships
> Pre-joining at the file grain avoids cross-fact iteration and makes tie-outs straightforward.

2. What does the Backlog measure do with ALL(DimDate)?
- [ ] Removes all dates permanently
- [x] Clears the date filter so it can apply its own "up to the last selected day" filter
- [ ] Nothing; it is decorative
> Running totals need to see all history up to the current point, not just the selected week.

3. Which page should be hidden?
- [ ] Summary
- [ ] Exceptions
- [x] Agent Detail (drill-through)
> Drill-through pages are reached from context; hiding them keeps navigation clean.

### Exercises

1. **State target line** — Add a per-state target to the files-by-state column chart.
<details><summary>Solution</summary>

Simplest: add `[Target Files]` as a second series in a line-and-clustered-column chart, target as the line. Alternative: Analytics pane → Constant line does not vary by category, so it is only for a single overall target.

</details>

2. **Shift analysis** — Compare accuracy by shift (Morning, Evening, Night) and identify whether one shift drives the defects.
<details><summary>Solution</summary>

Matrix with `DimAgent[Shift]` on rows and Accuracy %, Defects, Files Completed as values; add a defects-per-100-files measure `DIVIDE([Defects], [Files Completed]) * 100`; sort descending. Add `DefectType` as a second row level to see whether a specific defect concentrates in one shift.

</details>

### Interview Questions

**Q: Walk me through how you would build a weekly production dashboard from raw exports.**
Start by agreeing the questions and SLAs with the team lead: volume versus target, accuracy, turnaround and backlog, plus an exception list. Then design the model: a file-grain fact from the daily CSVs, a defect count merged in from QA at the same grain, agent and state dimensions, a proper date table and a targets table. Build measures for each KPI with DIVIDE and time intelligence, a running-total backlog, and an exception flag. Lay out a summary page with cards, trend and state breakdown, an agent matrix, a hidden drill-through detail page and an exceptions table. Automate refresh through a dataflow and gateway, distribute as an app, and reconcile the first week's numbers against the old Excel report before go-live.

**Q: How do you calculate backlog correctly in DAX?**
Backlog at a date is cumulative received minus cumulative completed up to that date, so the measure must ignore the visual's date filter and apply its own "less than or equal to the last date in context" filter: `CALCULATE([Received] - [Completed], ALL(DimDate), DimDate[Date] <= MAX(DimDate[Date]))`, with Received using an inactive relationship activated by USERELATIONSHIP. The subtlety is the two dates per file; counting received by ReceivedDate and completed by CompletedDate through the same date table is what makes the running difference correct. I validate it against the queue count in the production system for two or three dates.

**Q: How would you validate the dashboard before showing it to management?**
Tie every headline number to an independent source: file counts against the system's completed-files report for the same window, accuracy against QA's own defect summary, backlog against the live queue, and targets against the planning sheet. Check totals across slicers add up, that a week with a public holiday behaves, that RLS shows each lead only their team, and that refresh completes within its window with credentials owned by a service account. Record the tie-outs on an About page with the refresh timestamp so that the first question in the meeting, "are these numbers right?", is already answered.

## Power BI and DAX interview questions

This chapter is the interview drill. It collects the questions asked for data analyst, BI developer and reporting specialist roles, grouped by theme, with the answer structure that separates a candidate who has built reports from one who has watched videos. Practise saying the answers out loud with a concrete example from your own reports.

### How interviewers probe

Power BI interviews tend to follow a ladder:

1. **Concepts**: Desktop versus Service, Import versus DirectQuery, star schema, measures versus columns.
2. **DAX**: CALCULATE, filter context, time intelligence, iterators, a live problem such as "rank agents within team".
3. **Modelling scenarios**: two date columns, many-to-many, slowly changing dimensions.
4. **Operations**: refresh, gateways, RLS, performance.
5. **A case**: "here is a CSV, build a summary in 45 minutes" or a take-home.

Answer with the structure: definition, why it matters, a concrete example, a trade-off or pitfall.

### Rapid-fire concept answers

| Question | Core answer |
|---|---|
| What is a semantic model? | The published data model: tables, relationships, measures; separate from reports |
| Import vs DirectQuery? | Copy into VertiPaq vs query source per visual; speed vs freshness |
| Calculated column vs measure? | Row-context at refresh, stored; filter-context at query, not stored |
| Why a date table? | Contiguous dates for time intelligence, attributes for axes |
| Active vs inactive relationship? | One active path; inactive used via USERELATIONSHIP |
| What is filter context? | The set of filters applied when a measure is evaluated |
| What does CALCULATE do? | Modifies filter context, performs context transition |
| ALL vs ALLSELECTED? | Remove all filters vs remove visual filters only |
| Bookmark? | Snapshot of page state applied by button |
| RLS? | DAX filters per role, users assigned in Service |

### Live DAX tasks

Interviewers hand you a small model and ask for measures. Practise these until they are automatic:

```dax
// 1. Percentage of total ignoring the category on the axis
Pct of Total = DIVIDE ( [Total Files], CALCULATE ( [Total Files], ALL ( DimState ) ) )

// 2. Year-over-year growth
YoY % = DIVIDE ( [Total Files] - CALCULATE ( [Total Files], SAMEPERIODLASTYEAR ( DimDate[Date] ) ),
                 CALCULATE ( [Total Files], SAMEPERIODLASTYEAR ( DimDate[Date] ) ) )

// 3. Running total
Files Running = CALCULATE ( [Total Files], FILTER ( ALL ( DimDate[Date] ), DimDate[Date] <= MAX ( DimDate[Date] ) ) )

// 4. Count of customers with more than N orders (agents with more than 100 files)
Agents Over 100 = COUNTROWS ( FILTER ( VALUES ( DimAgent[AgentKey] ), [Total Files] > 100 ) )

// 5. Last non-blank value (latest known backlog)
Latest Backlog = CALCULATE ( [Backlog], LASTNONBLANK ( DimDate[Date], [Backlog] ) )
```

For each, be ready to explain what happens in the total row and how the measure behaves under a slicer.

### Scenario questions and strong answers

**Sales by order date and ship date**: two relationships to the date table, one inactive, USERELATIONSHIP in a measure; alternatively two date tables if both must be sliced simultaneously.

**Report shows the same number in every row**: relationship missing, inactive, wrong direction, or key type mismatch; check Model view and column types.

**Totals do not add up**: measure uses a non-additive calculation (ratio, distinct count) so the total is computed independently; explain it is correct and, if a sum of rows is required, use SUMX over VALUES.

**Slow report**: Performance Analyzer, DAX Studio, VertiPaq Analyzer; remove high-cardinality columns, fix DAX patterns, reduce visuals.

**Refresh fails**: refresh history, credentials, gateway status, source schema change; parameters for paths.

### Questions about your own work

Prepare two stories using the STAR shape (situation, task, action, result) with numbers:

- The weekly production dashboard: replaced a six-tab Excel status report; sources, model, SLAs, refresh, who used it, what changed after (for example, exceptions reviewed on Monday instead of Thursday).
- A rate matrix consolidation: six underwriters, zone harmonisation in Power Query, unpivot to a long table, validation by row counts, published as a dataflow.

### Questions to ask them

Ask about licensing (Pro, PPU, Fabric), whether datasets are centralised or per report, who owns the gateway, and how changes are tested. The answers tell you how mature the environment is, and asking them signals experience.

> **Tip:** When you do not know, say what you would check. "I have not used composite models with that source, but I would check whether it supports DirectQuery and whether RLS is defined upstream" is a better answer than a guess.

### Try It Yourself

```dax
// Whiteboard classic: top 3 agents per team plus an "Others" total, in one calculated table
Top3PerTeam =
VAR Ranked =
    ADDCOLUMNS (
        SUMMARIZE ( DimAgent, DimAgent[Team], DimAgent[AgentName] ),
        "Files", [Total Files],
        "Rank", RANKX ( ALLEXCEPT ( DimAgent, DimAgent[Team] ), [Total Files], , DESC, DENSE )
    )
RETURN
    FILTER ( Ranked, [Rank] <= 3 )
```

### Quiz

1. An interviewer asks why totals of a distinct count do not equal the sum of rows. Best answer?
- [x] Distinct count is non-additive; the total is computed on the whole set and an agent in two states counts once
- [ ] It is a Power BI bug
- [ ] The relationship is broken
> Non-additive measures are evaluated independently in the total cell; that is correct behaviour.

2. "Sales by order date and ship date" tests which concept?
- [ ] Bookmarks
- [x] Inactive relationships and USERELATIONSHIP
- [ ] Incremental refresh
> Role-playing date dimensions are the canonical inactive-relationship scenario.

3. What should you do when asked about a feature you have not used?
- [ ] Guess confidently
- [x] Say what you would check and relate it to something you have done
- [ ] Change the subject
> Interviewers value method over memorised answers.

### Exercises

1. **Five-minute drill** — Without notes, write measures for percentage of total, YoY growth, running total, agents over 100 files and latest backlog, then compare with the chapter.
<details><summary>Solution</summary>

Compare to the five measures in the Live DAX tasks section. Check that each explanation covers the total row: Pct of Total shows 100%, YoY blank for the first year, running total equals the grand total, Agents Over 100 counts across all visible agents, Latest Backlog shows the last date's value rather than a sum.

</details>

2. **STAR story** — Write a 90-second story about a dashboard you built with situation, task, action and a numeric result.
<details><summary>Solution</summary>

Example shape: "The production team spent Thursday afternoons compiling a six-tab Excel status report (situation). I was asked to make it available on Monday morning (task). I built a star-schema model from the daily exports, defined accuracy, TAT and backlog measures against SLAs, and automated refresh through a gateway (action). The report was ready by 07:00 Monday, the compilation time dropped from four hours to zero, and exceptions were actioned three days earlier (result)."

</details>

### Interview Questions

**Q: Explain filter context, row context and context transition to a non-technical manager.**
Filter context is the set of choices currently narrowing the data: the week picked in the slicer, the state clicked in a chart, the row of the table the number sits in. Row context is being "on one row" of a table, as when a formula computes something for each file. Context transition is what happens when a calculation that is on one row asks for a total: Power BI turns that row into a filter, so the total becomes the total for that file, agent or day. For example, a column that computes each agent's lifetime files works because the agent row becomes a filter on the production table.

**Q: What is the most common DAX mistake you see, and how do you avoid it?**
Using FILTER on a whole table as a CALCULATE argument, such as `CALCULATE([Files], FILTER(FactProduction, FactProduction[State] = "TX"))`, when the boolean shorthand on a column does the same thing with far less work; the table version materialises and iterates every fact row and breaks the ability of the storage engine to push the filter down. The related mistake is putting a measure inside an iterator over the fact table. I avoid both by filtering columns or dimensions, by iterating VALUES of a dimension key rather than the fact, and by checking Server Timings in DAX Studio whenever a measure takes more than a few hundred milliseconds.

**Q: How do you keep a shared semantic model maintainable across many reports?**
Publish one certified model per subject with a naming convention, display folders and descriptions on every measure, hidden keys, and measures organised in a dedicated table. Use Tabular Editor or the pbip project format so the model is text under source control and changes can be reviewed. Give report authors Build permission instead of copies of the pbix, put transformations in dataflows so the model's Power Query is thin, use deployment pipelines or at least Dev and Prod workspaces, and document tie-outs and definitions on an About page. The measure of success is that a new analyst can build a correct report from the model without asking what Accuracy % means.

