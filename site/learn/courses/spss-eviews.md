---
id: spss-eviews
title: SPSS & EViews (Statistics & Econometrics)
icon: 📉
track: Data & Reporting
color: #C0392B
runner: python
packages: 
tagline: Statistical and econometric analysis for reports, research and economics interviews.
description: Applied statistics with SPSS and econometrics with EViews, plus the theory behind them: descriptive statistics, distributions, hypothesis tests (t, chi-square, ANOVA), correlation and regression, non-parametric tests, reliability, time-series basics, OLS assumptions, stationarity and unit roots, ARIMA, and how to present results in reports.
---

# LEVEL: Beginner

## Types of data and levels of measurement

Before any statistic is calculated, you must know what kind of variable you are looking at, because the type decides which summary, chart and test are valid. Averaging state codes is meaningless; averaging turnaround hours is not. SPSS forces this decision on you in **Variable View** through the *Measure* column, and EViews assumes it through the series type. This chapter gives the vocabulary that every later chapter depends on.

### Qualitative versus quantitative

A **qualitative** (categorical) variable places each case in a category: state, underwriter, defect type, agent shift. A **quantitative** (numeric) variable measures an amount: files completed, premium in dollars, turnaround in hours. Quantitative variables split further into **discrete** (counts: 0, 1, 2 files) and **continuous** (any value in a range: 3.75 hours).

### The four levels of measurement

Stevens' four levels, from least to most informative:

| Level | Meaning | Example | Allowed statistics | SPSS Measure |
|---|---|---|---|---|
| Nominal | Labels with no order | State, DefectType, Gender | Mode, frequencies, chi-square | Nominal |
| Ordinal | Ordered categories, unequal gaps | QA rating (Poor/Fair/Good), Likert 1–5 | Median, percentiles, rank tests | Ordinal |
| Interval | Equal gaps, arbitrary zero | Temperature in °C, calendar year | Mean, SD, t-tests | Scale |
| Ratio | Equal gaps and a true zero | Files, hours, dollars, age | Everything, including ratios ("twice as many") | Scale |

SPSS collapses interval and ratio into **Scale**. The practical rule: if you can say "twice as much" it is ratio; if the order matters but the gaps do not, it is ordinal; if it is just a name, it is nominal.

### Why the level matters

Take a Likert item "The SOP is clear" scored 1 to 5. Treating it as scale lets you compute a mean of 3.8, which many reports do. Strictly it is ordinal: the gap between 1 and 2 need not equal the gap between 4 and 5. The safe summary is the median and the percentage agreeing (4 or 5). Interviewers ask about this exact point, and the mature answer is: "Ordinal by nature; treat as interval only when items are summed into a scale with acceptable reliability, and say so."

### Coding categorical data

Statistical software wants numbers. A nominal variable is stored as codes with **value labels**: `1 = Texas, 2 = Wyoming, 3 = Colorado`. The numbers carry no meaning; SPSS only uses them to group. In regression a nominal variable with k categories becomes k − 1 **dummy variables** (0/1), which the Expert level covers.

```python
# Levels of measurement decide the valid summary
import statistics

states = ["TX", "WY", "TX", "CO", "TX", "WY"]          # nominal
ratings = [3, 4, 4, 5, 2, 4]                           # ordinal (Likert)
tat_hours = [18.5, 22.0, 30.2, 12.7, 25.9, 19.4]       # ratio

print("Mode of state:", statistics.mode(states))
print("Median rating:", statistics.median(ratings))
print("Mean TAT:", round(statistics.mean(tat_hours), 2), "hours")
```

The mode is the only centre that makes sense for states, the median is the honest centre for ratings, and the mean is fine for hours.

### Cases, variables and the data matrix

A dataset is a rectangle: one **row per case** (a file, an agent, a survey respondent, a month) and one **column per variable**. The unit of analysis must be consistent. A production file where some rows are files and some are daily totals cannot be analysed until it is split. Time-series data in EViews is the same rectangle with the row identified by date.

### Population, sample and parameter

The **population** is everything you care about (all files processed in 2025). A **sample** is the part you measured (the 400 files QA audited). A **parameter** describes the population (true defect rate); a **statistic** describes the sample (observed defect rate 2.3%). Inferential statistics, from Intermediate onwards, is the machinery for saying something about the parameter from the statistic.

> **Interview note:** "What is the difference between ordinal and interval data, and give an example of each" is the standard opener. Answer with Likert versus temperature and mention that the mean is only meaningful from interval upwards.

### Try It Yourself

```python
import statistics

# One variable of each level from a QA audit
defect_type = ["Typo", "Missing seal", "Typo", "Wrong date", "Typo"]     # nominal
severity = [1, 3, 1, 2, 2]                                              # ordinal: 1 low .. 3 high
rework_minutes = [4.0, 25.0, 3.5, 12.0, 6.0]                            # ratio

print("Most common defect:", statistics.mode(defect_type))
print("Median severity:", statistics.median(severity))
print("Mean rework:", statistics.mean(rework_minutes), "min")
print("Ratio statement valid for rework:", rework_minutes[1] / rework_minutes[0], "x longer")
```

### Quiz

1. Which level of measurement has a true zero?
- [ ] Interval
- [x] Ratio
- [ ] Ordinal
> Ratio scales (hours, dollars, counts) allow statements like "twice as many"; interval scales like °C do not.

2. A 5-point Likert item is strictly which level?
- [ ] Nominal
- [x] Ordinal
- [ ] Ratio
> Categories are ordered but gaps between them are not known to be equal.

3. In SPSS Variable View, which Measure setting covers both interval and ratio?
- [x] Scale
- [ ] Ordinal
- [ ] Nominal
> SPSS uses Scale for any numeric variable with meaningful arithmetic.

### Exercises

1. **Classify** — Assign a level to: underwriter name, policy premium, agent tenure band (0–1, 1–3, 3+ years), QA pass/fail, month number.
<details><summary>Solution</summary>

Underwriter: nominal. Premium: ratio. Tenure band: ordinal. Pass/fail: nominal (binary). Month number: ordinal if used as a label, interval if treated as elapsed time; state your choice.

</details>

2. **Choose the summary** — For each variable above, name the appropriate measure of centre.
<details><summary>Solution</summary>

Underwriter: mode. Premium: mean (or median if skewed). Tenure band: median. Pass/fail: proportion passing. Month: not summarised by centre; used as an axis.

</details>

### Interview Questions

**Q: Why does the level of measurement matter for choosing a statistical test?**
Because tests make assumptions about the arithmetic you can do on the variable. Means and standard deviations, and therefore t-tests and ANOVA, require at least interval data where differences are meaningful. Ordinal data supports medians and rank-based tests such as Mann-Whitney or Spearman correlation. Nominal data supports frequencies and chi-square. Using a t-test on a single Likert item is technically invalid, though widely done; a defensible practice is to sum several items into a scale, check Cronbach's alpha, and then treat the scale score as interval. The interviewer wants to hear that you match the test to the data type and can articulate the compromise.

**Q: What is the difference between a parameter and a statistic?**
A parameter is a fixed but usually unknown number describing a population, such as the true defect rate across all files in a year. A statistic is the corresponding number computed from a sample, such as the 2.3% defect rate in the 400 audited files. Inferential statistics uses the sampling distribution of the statistic to estimate the parameter with a confidence interval or to test a claim about it. Notation follows this split: μ and σ for population mean and standard deviation, x̄ and s for the sample.

**Q: How would you store a variable like "State" in SPSS and why?**
As a numeric variable with value labels, for example 1 = TX, 2 = WY, 3 = CO, with Measure set to Nominal. Numeric codes are faster, sort predictably, and are what procedures like CROSSTABS and dummy coding expect; value labels keep output readable. A string variable also works for frequencies but cannot be used in most modelling procedures without AUTORECODE. In practice I keep a codebook listing each code and label so the file is understandable a year later.

## Descriptive statistics and distributions

Descriptive statistics compress a column of numbers into a few figures a manager can read: where the centre is, how spread out the values are, and what shape the distribution has. Every report starts here, and every inferential test in later chapters is built from these quantities.

### Measures of centre

- **Mean**: sum divided by count. Sensitive to outliers: one 200-hour turnaround pulls the mean up.
- **Median**: the middle value when sorted. Robust to outliers. Preferred for skewed data like turnaround times or incomes.
- **Mode**: the most frequent value. The only centre for nominal data.

```python
import statistics
tat = [14, 16, 18, 19, 21, 22, 24, 26, 30, 190]   # hours; one extreme file
print("Mean  :", statistics.mean(tat))     # 38.0
print("Median:", statistics.median(tat))   # 21.5
```

The mean says a typical file takes 38 hours; the median says 21.5. When mean and median differ this much, report the median and explain the outlier.

### Measures of spread

- **Range**: max − min. Crude, driven by extremes.
- **Interquartile range (IQR)**: Q3 − Q1, the middle 50%. Pairs with the median.
- **Variance**: mean of squared deviations from the mean.
- **Standard deviation (SD)**: square root of variance, in the original units. Pairs with the mean.

Sample variance divides by n − 1, not n (Bessel's correction), because the sample mean is itself estimated from the data. SPSS and `statistics.stdev` use n − 1; `statistics.pstdev` uses n.

```python
import statistics
files = [38, 41, 35, 44, 40, 39, 42, 37]
mean = statistics.mean(files)
sd = statistics.stdev(files)          # sample SD, n-1
print(f"Mean {mean:.2f}, SD {sd:.2f}, CV {sd/mean:.1%}")
```

The **coefficient of variation** (SD / mean) lets you compare spread across variables with different units: agent volume with CV 7% is more consistent than accuracy with CV 12%.

### Shape: skewness and kurtosis

- **Skewness** measures asymmetry. Positive skew has a long right tail (turnaround times, premiums). Negative skew has a long left tail (accuracy percentages piling up near 100%). Values beyond ±1 are usually considered substantially skewed.
- **Kurtosis** measures tail heaviness. SPSS reports excess kurtosis, where 0 is normal; positive means more outliers than a normal distribution.

Both appear in SPSS under **Analyze → Descriptive Statistics → Descriptives → Options**, or in the more complete **Explore** procedure, which also gives a stem-and-leaf plot, box plot and normality tests.

### Percentiles and box plots

The p-th percentile is the value below which p% of cases fall. Q1, median and Q3 are the 25th, 50th and 75th percentiles. A **box plot** draws the box from Q1 to Q3, a line at the median, whiskers to the last value within 1.5 × IQR, and dots beyond as outliers. One box per state on the same axis is the fastest way to compare turnaround distributions.

### Frequency distributions and histograms

Group a continuous variable into bins and count: a histogram. Bin width changes the picture, so try two or three widths. For a categorical variable the equivalent is a bar chart of frequencies.

| Statistic | Report with | Use when |
|---|---|---|
| Mean, SD | Symmetric data, t-tests to follow | Files per agent per day |
| Median, IQR | Skewed data, outliers present | Turnaround hours, premium |
| Mode, % | Nominal data | Defect type |
| Min, max, n | Always, for context | Every table |

### SPSS: the Descriptives and Explore procedures

Menu: **Analyze → Descriptive Statistics → Descriptives**, move variables, tick Mean, Std. deviation, Minimum, Maximum, Skewness, Kurtosis. Syntax equivalent:

```spss
DESCRIPTIVES VARIABLES=tat_hours files_per_day accuracy
  /STATISTICS=MEAN STDDEV MIN MAX SKEWNESS KURTOSIS.

EXAMINE VARIABLES=tat_hours BY state
  /PLOT BOXPLOT HISTOGRAM NPPLOT
  /STATISTICS DESCRIPTIVES
  /MISSING LISTWISE.
```

`EXAMINE` is the Explore procedure; `BY state` produces one set of statistics and one box per state; `NPPLOT` adds normal Q-Q plots and the Shapiro-Wilk test.

> **Tip:** Always report n alongside any statistic. A mean accuracy of 99.1% from 12 files and from 4 000 files are different claims.

### Try It Yourself

```python
import statistics, math

tat = [14, 16, 18, 19, 21, 22, 24, 26, 30, 190]
n = len(tat)
mean = statistics.mean(tat)
sd = statistics.stdev(tat)
q = statistics.quantiles(tat, n=4)            # Q1, median, Q3
skew = (sum((x - mean) ** 3 for x in tat) / n) / (statistics.pstdev(tat) ** 3)

print(f"n={n} mean={mean:.1f} median={q[1]:.1f} sd={sd:.1f}")
print(f"Q1={q[0]:.1f} Q3={q[2]:.1f} IQR={q[2]-q[0]:.1f}")
print(f"skewness={skew:.2f}  (positive = long right tail)")
upper_fence = q[2] + 1.5 * (q[2] - q[0])
print("Outliers above", upper_fence, ":", [x for x in tat if x > upper_fence])
```

### Quiz

1. Which centre is most affected by a single extreme value?
- [x] Mean
- [ ] Median
- [ ] Mode
> The mean includes every value's magnitude; the median only depends on order.

2. Sample standard deviation divides the sum of squared deviations by:
- [ ] n
- [x] n − 1
- [ ] n + 1
> Bessel's correction compensates for estimating the mean from the same sample.

3. Positive skewness means:
- [ ] Values cluster on the right
- [x] A long tail to the right, mean above median
- [ ] The distribution is normal
> Turnaround and income data are typically right-skewed.

### Exercises

1. **Summarise per state** — For TX = [18, 22, 30, 19, 25] and WY = [40, 35, 52, 38, 44] compute mean, median and SD, and state which state has more variable turnaround relative to its mean.
<details><summary>Solution</summary>

```python
import statistics
for name, d in {"TX": [18,22,30,19,25], "WY": [40,35,52,38,44]}.items():
    m, s = statistics.mean(d), statistics.stdev(d)
    print(name, round(m,1), statistics.median(d), round(s,2), f"CV={s/m:.1%}")
```

TX: mean 22.8, CV about 21%; WY: mean 41.8, CV about 16%. TX is relatively more variable despite lower SD in absolute terms? Check: TX SD 4.87, WY SD 6.72; CV TX 21.4%, WY 16.1%.

</details>

2. **SPSS syntax** — Write the syntax to get median, IQR and a box plot of `premium` by `underwriter`.
<details><summary>Solution</summary>

```spss
EXAMINE VARIABLES=premium BY underwriter
  /PLOT BOXPLOT
  /STATISTICS DESCRIPTIVES
  /PERCENTILES(25,50,75).
```

</details>

### Interview Questions

**Q: When would you report the median instead of the mean?**
When the distribution is skewed or contains outliers, so that the mean no longer represents a typical case: turnaround times, premiums, incomes, file sizes. The median is robust because it depends only on the ordering, and it pairs naturally with the IQR. In a management report I often show both, with a note explaining the gap, because the mean still matters for capacity planning (total hours equals mean times count) while the median describes the typical file. If the mean and median are close, the choice does not matter and I report the mean with its SD.

**Q: Why is the sample variance divided by n − 1?**
Because deviations are measured from the sample mean rather than the true population mean, and the sample mean is by construction the value that minimises the sum of squared deviations, so the sum is slightly too small. Dividing by n − 1 instead of n corrects this bias and makes the sample variance an unbiased estimator of the population variance; the n − 1 is the degrees of freedom left after estimating one parameter. For large n the difference is negligible; for a QA sample of 10 files it changes the SD noticeably. SPSS always uses n − 1 for the sample SD.

**Q: What does a coefficient of variation tell you that the SD does not?**
The CV is the SD divided by the mean, so it expresses spread relative to the typical size and is unit-free. Comparing an SD of 5 files across agents averaging 40 with an SD of 5 hours across turnaround averaging 20 hours is meaningless; the CVs of 12.5% and 25% are comparable. It is only meaningful for ratio data with a positive mean, so it is not used for temperature or for variables centred near zero. In production QA it is a natural consistency metric: a team with a low CV of daily output is predictable, which matters as much as the mean for staffing.

## Getting data into SPSS: Variable View, labels and missing values

SPSS Statistics stores data in `.sav` files and shows them in the **Data Editor**, which has two tabs at the bottom: **Data View** (the grid of cases) and **Variable View** (one row per variable describing its properties). Getting these properties right is most of the work of a clean analysis, and it is where most SPSS output errors originate.

### Importing a file

**File → Import Data → Excel** (or CSV Data). In the dialog: tick **Read variable names from first row of data**, set the worksheet, and for CSV set the delimiter and decimal symbol. SPSS guesses types from the first rows; a column that has a stray text value becomes a **String** variable and cannot be analysed numerically until fixed. Import via syntax for repeatability:

```spss
GET DATA
  /TYPE=XLSX
  /FILE='C:\Reports\QA_Audit_2026.xlsx'
  /SHEET=name 'Audit'
  /CELLRANGE=FULL
  /READNAMES=ON.
DATASET NAME audit WINDOW=FRONT.
```

### Variable View columns

| Column | What to set | Example |
|---|---|---|
| Name | Short, no spaces, starts with a letter, max 64 chars | `tat_hours` |
| Type | Numeric, String, Date, Dollar | Numeric |
| Width / Decimals | Display only | 8 / 2 |
| Label | Full description shown in output | Turnaround time (hours) |
| Values | Codes and labels for categorical variables | 1 = "Pass", 0 = "Fail" |
| Missing | Codes to treat as missing | 999, -1 |
| Measure | Nominal, Ordinal, Scale | Scale |
| Role | Input, Target, Both, None | Input |

Fill **Label** and **Values** for every variable that appears in a report. Output tables then say "Turnaround time (hours)" and "Pass" rather than `tat_hours` and `1`, which saves an hour of editing later.

### Value labels

Double-click the Values cell, or use syntax:

```spss
VALUE LABELS qa_result 0 'Fail' 1 'Pass'
  / state 1 'Texas' 2 'Wyoming' 3 'Colorado'
  / shift 1 'Morning' 2 'Evening' 3 'Night'.
VARIABLE LABELS tat_hours 'Turnaround time (hours)'
  / files_day 'Files completed per day'.
VARIABLE LEVEL state shift (NOMINAL) / severity (ORDINAL) / tat_hours files_day (SCALE).
```

Toggle between codes and labels in Data View with **View → Value Labels**.

### Missing values

SPSS has two kinds:

- **System-missing**: an empty numeric cell, shown as a dot. Created automatically on import.
- **User-missing**: real values you declare as missing, for example `999` for "not recorded" or `-1` for "not applicable". Declared in the Missing column, or with `MISSING VALUES tat_hours (999, -1).` Different codes can be reported separately in frequencies while still being excluded from means.

String variables are never system-missing; an empty string is a valid value unless declared user-missing (`MISSING VALUES comment ('').`).

How procedures handle missing:

- **Listwise**: drop the case from the analysis if any variable used is missing (default for regression).
- **Pairwise**: use every available pair (an option in CORRELATIONS). Sample sizes vary per cell.
- **Analysis by analysis**: each test uses its own complete cases.

Report how many cases were excluded and why; a regression on 260 of 400 files is a different study from one on 400.

### Dates

Import dates as SPSS Date type (`DATE11` or `DATETIME20` formats). Compute differences with `DATEDIFF`:

```spss
COMPUTE tat_hours = DATEDIFF(completed_at, received_at, 'hours').
EXECUTE.
```

Transformations from `COMPUTE`, `RECODE` and `IF` do not run until `EXECUTE` or the next procedure.

### Recoding and computing

```spss
RECODE tat_hours (LOWEST THRU 24=1) (24.0001 THRU 48=2) (48.0001 THRU HIGHEST=3) INTO tat_band.
VALUE LABELS tat_band 1 'Within 24h' 2 '24-48h' 3 'Over 48h'.
COMPUTE accuracy = 1 - defects / files.
EXECUTE.
```

**Transform → Recode into Different Variables** is the menu version; always recode *into a different variable* so the original survives.

> **Warning:** Excel cells with a space, a hyphen or "N/A" turn a whole numeric column into a String on import. Clean them in Excel or Power Query first, or use `ALTER TYPE tat_hours (F8.2).` after replacing the text with blanks.

### Try It Yourself

```python
# The same variable-definition logic in plain Python: codes, labels and missing codes
value_labels = {"qa_result": {0: "Fail", 1: "Pass"}, "state": {1: "Texas", 2: "Wyoming", 3: "Colorado"}}
missing_codes = {"tat_hours": {999, -1}}

rows = [
    {"file": "A1", "state": 1, "qa_result": 1, "tat_hours": 18.5},
    {"file": "A2", "state": 2, "qa_result": 0, "tat_hours": 999},   # not recorded
    {"file": "A3", "state": 1, "qa_result": 1, "tat_hours": 30.0},
    {"file": "A4", "state": 3, "qa_result": 1, "tat_hours": None},  # system-missing
]

valid = [r["tat_hours"] for r in rows
         if r["tat_hours"] is not None and r["tat_hours"] not in missing_codes["tat_hours"]]
print("Valid TAT values:", valid, "-> n =", len(valid), "mean =", sum(valid) / len(valid))
for r in rows:
    print(r["file"], value_labels["state"][r["state"]], value_labels["qa_result"][r["qa_result"]])
```

### Quiz

1. Which SPSS tab defines labels, value codes and missing values?
- [ ] Data View
- [x] Variable View
- [ ] Output Viewer
> Variable View has one row per variable with its metadata.

2. What is the difference between system-missing and user-missing?
- [x] System-missing is an empty cell; user-missing is a real code you declare as missing
- [ ] They are the same
- [ ] User-missing applies only to strings
> User-missing codes like 999 let you distinguish reasons while excluding them from calculations.

3. Listwise deletion means:
- [ ] Replace missing with the mean
- [x] Drop the whole case if any analysis variable is missing
- [ ] Use each available pair of variables
> Listwise is the default for regression and reduces n; report the resulting sample size.

### Exercises

1. **Define a survey file** — Write syntax to label `satisfaction` (1–5), declare 9 as missing, and set it as ordinal.
<details><summary>Solution</summary>

```spss
VARIABLE LABELS satisfaction 'Satisfaction with SOP clarity (1-5)'.
VALUE LABELS satisfaction 1 'Very poor' 2 'Poor' 3 'Neutral' 4 'Good' 5 'Very good' 9 'No answer'.
MISSING VALUES satisfaction (9).
VARIABLE LEVEL satisfaction (ORDINAL).
```

</details>

2. **Band a variable** — Recode `files_day` into Low (< 20), Normal (20–39) and High (40+) as a new variable with labels.
<details><summary>Solution</summary>

```spss
RECODE files_day (LOWEST THRU 19=1) (20 THRU 39=2) (40 THRU HIGHEST=3) INTO volume_band.
VALUE LABELS volume_band 1 'Low' 2 'Normal' 3 'High'.
VARIABLE LEVEL volume_band (ORDINAL).
EXECUTE.
```

</details>

### Interview Questions

**Q: How do you handle missing data in SPSS and how do you decide?**
First I describe it: how much is missing per variable, and whether it is missing at random or related to other variables (a Missing Value Analysis or a simple crosstab of missingness against group). For small, random missingness, listwise deletion is acceptable and simplest to explain. Pairwise deletion keeps more data for correlations but gives inconsistent sample sizes. For modelling with substantial missingness, multiple imputation (Analyze → Multiple Imputation) is the defensible choice; mean substitution is not, because it shrinks variance and biases relationships. Whatever the method, I report the number of cases used and the method in the report.

**Q: Why use syntax rather than menus in SPSS?**
Syntax is reproducible: the analysis can be rerun on next month's file with one change, reviewed by a colleague, and kept with the report as an audit trail. Menus are fine for exploration, and every dialog has a Paste button that writes the syntax, so the workflow is to explore in dialogs and paste into a syntax file. Syntax also exposes options that dialogs hide and lets you loop over variables with DO REPEAT. For a weekly QA analysis I keep one `.sps` file that imports, labels, recodes and runs the tables end to end.

**Q: A numeric column imported as a string. What happened and what do you do?**
A non-numeric token in at least one cell, such as "N/A", a dash, or a number with a trailing space, made SPSS assign String type. The fix is to inspect with FREQUENCIES to find the offending values, replace them with blank or a declared missing code using RECODE or in the source, then convert with `ALTER TYPE var (F8.2)` or by computing a new variable with `NUMBER(var, F8.2)`. I would also fix the export upstream, because the same cell will break next month's import.

## Frequencies, crosstabs and charts in SPSS

The first look at any categorical or survey data in SPSS is **Frequencies**; the first look at the relationship between two categorical variables is **Crosstabs**. These two procedures, plus the Chart Builder, produce most of the tables in a QA or survey report.

### Frequencies

**Analyze → Descriptive Statistics → Frequencies**. Move `defect_type`, tick **Display frequency tables**, and under **Charts** choose Bar chart with percentages. The output table has columns Frequency, Percent, Valid Percent and Cumulative Percent.

```spss
FREQUENCIES VARIABLES=defect_type severity
  /STATISTICS=MODE MEDIAN
  /BARCHART PERCENT
  /ORDER=ANALYSIS.
```

**Percent** divides by all cases including missing; **Valid Percent** divides by non-missing cases and is the figure to report. Cumulative percent is useful for ordinal variables ("62% rated Good or better").

For a scale variable, add `/FORMAT=NOTABLE` to suppress the table of every distinct value and request `/STATISTICS=MEAN STDDEV MEDIAN /HISTOGRAM NORMAL` for a histogram with a normal curve overlaid.

### Crosstabs

A crosstab (contingency table) counts cases in each combination of two categorical variables: QA result by shift, defect type by state.

**Analyze → Descriptive Statistics → Crosstabs**: Rows `shift`, Columns `qa_result`. Under **Cells**, tick Observed counts and **Row percentages**; under **Statistics**, tick Chi-square (covered in Intermediate).

```spss
CROSSTABS
  /TABLES=shift BY qa_result
  /FORMAT=AVALUE TABLES
  /STATISTICS=CHISQ
  /CELLS=COUNT ROW
  /COUNT ROUND CELL.
```

Which percentage to show depends on the question. Row percentages answer "what share of night-shift files failed?"; column percentages answer "what share of failures came from night shift?". The two read very differently and picking the wrong one is a common report error.

| | Pass | Fail | Total |
|---|---|---|---|
| Morning | 480 (96.0%) | 20 (4.0%) | 500 |
| Evening | 465 (93.0%) | 35 (7.0%) | 500 |
| Night | 440 (88.0%) | 60 (12.0%) | 500 |

Row percentages make the comparison of fail rates across shifts immediate.

### Layered crosstabs

Add a third variable in the **Layer** box to get one table per category, for example shift by result for each state. In syntax: `/TABLES=shift BY qa_result BY state`.

### Custom Tables

**Analyze → Tables → Custom Tables** (an add-on module in some licences) builds publication-ready tables with multiple variables stacked, which is the fastest route to a one-page survey summary.

### Charts

**Graphs → Chart Builder** is drag-and-drop: choose a gallery type, drag variables to axes, set Element Properties. The chart types you need:

- Simple bar for frequencies of one categorical variable.
- Clustered bar for two categorical variables (shift by result).
- Histogram for a scale variable's distribution.
- Box plot by group for a scale variable across categories.
- Scatter for two scale variables.

The syntax behind Chart Builder is the **GGRAPH** / GPL language, which is verbose; the legacy dialogs (**Graphs → Legacy Dialogs**) generate shorter `GRAPH` syntax that is easier to edit:

```spss
GRAPH /BAR(GROUPED)=PCT BY shift BY qa_result.
GRAPH /HISTOGRAM(NORMAL)=tat_hours.
```

Double-click any chart in the Output Viewer to open the **Chart Editor** for titles, colours, data labels and axis ranges. Save a **chart template** (`.sgt`) with the team's colours and apply it in Chart Builder options.

### Output management

Everything appears in the **Output Viewer** (`.spv`). Right-click a table → **Copy** pastes it into Word as a formatted table; **Export** (File → Export) writes all output to Word, Excel or PDF. Use **Edit → Options → Pivot Tables** to set a default table look, and **TableLooks** such as *APA* for academic reports.

> **Tip:** Set **Edit → Options → Output → Variables in labels shown as: Labels** and values as Labels so the viewer never shows raw codes. Do it once; it persists across sessions.

### Try It Yourself

```python
# A crosstab with row percentages, computed by hand
rows = [("Morning","Pass")]*480 + [("Morning","Fail")]*20 \
     + [("Evening","Pass")]*465 + [("Evening","Fail")]*35 \
     + [("Night","Pass")]*440 + [("Night","Fail")]*60

from collections import Counter
counts = Counter(rows)
shifts = ["Morning", "Evening", "Night"]
print(f"{'Shift':<9}{'Pass':>8}{'Fail':>8}{'Fail %':>9}")
for s in shifts:
    p, f = counts[(s, "Pass")], counts[(s, "Fail")]
    print(f"{s:<9}{p:>8}{f:>8}{f/(p+f):>9.1%}")
total_fail = sum(counts[(s, "Fail")] for s in shifts)
print("Column %: share of all failures from Night =", f"{counts[('Night','Fail')]/total_fail:.1%}")
```

### Quiz

1. Which percentage column in a Frequencies table excludes missing cases?
- [ ] Percent
- [x] Valid Percent
- [ ] Cumulative Percent
> Valid Percent uses only non-missing cases as the denominator.

2. To answer "what share of night-shift files failed?" you need:
- [x] Row percentages with shift in rows
- [ ] Column percentages with shift in rows
- [ ] Total percentages
> Row percentages divide by the row total, i.e. all night-shift files.

3. Which SPSS feature produces the syntax behind a dialog?
- [ ] Chart Editor
- [x] The Paste button
- [ ] TableLooks
> Every dialog can paste its equivalent syntax into a syntax window.

### Exercises

1. **Defect profile** — Write syntax for a frequency table and bar chart of `defect_type` sorted by descending count.
<details><summary>Solution</summary>

```spss
FREQUENCIES VARIABLES=defect_type
  /ORDER=DFREQ
  /BARCHART FREQ.
```

`/ORDER=DFREQ` sorts categories by descending frequency.

</details>

2. **Two-way table per state** — Produce QA result by shift with row percentages, one table per state.
<details><summary>Solution</summary>

```spss
CROSSTABS /TABLES=shift BY qa_result BY state /CELLS=COUNT ROW.
```

The third BY variable becomes the layer, giving one sub-table per state.

</details>

### Interview Questions

**Q: What is the difference between row, column and total percentages in a crosstab, and how do you choose?**
Row percentages divide each cell by its row total, column percentages by the column total, and total percentages by the grand total. Choose based on which variable is the explanatory one: put it in rows and use row percentages so each row shows the outcome distribution for that group, making groups directly comparable. With shift in rows and QA result in columns, row percentages give the fail rate per shift, which is what a team lead wants. Column percentages would instead describe the composition of failures, useful for a Pareto-style view. Reporting the wrong one is a classic error that reverses the reader's interpretation.

**Q: How do you produce a report-ready table from SPSS?**
Set variable and value labels so the output reads in plain language, choose a TableLook (APA or a corporate look) under Options, run the procedure, then either copy the pivot table into Word, where it pastes as an editable table, or use File → Export to Word, Excel or PDF for the whole output. For repeated reports I use OUTPUT MODIFY or Custom Tables to standardise formatting in syntax. I also pivot the table in the Output Viewer's pivoting trays when rows and columns need swapping, rather than rebuilding in Excel.

**Q: What would you look at first in a new survey dataset?**
Frequencies of every variable, with missing counts, to check ranges and codes are plausible (no 7s on a 5-point scale), to see the missing pattern, and to catch string versus numeric issues. Then crosstabs of key outcomes by demographic or operational groups, and histograms or box plots of scale variables for skew and outliers. This profiling step catches import errors and reversed items before any test is run, and it produces the descriptive section of the report at the same time.

## Sampling and the normal distribution

Inferential statistics answers the question "what can 400 audited files tell me about all 20 000 files?". The answer depends on how the sample was drawn and on the behaviour of averages, which is described by the normal distribution and the Central Limit Theorem. This chapter is the theory that makes p-values and confidence intervals meaningful.

### Sampling methods

| Method | How | Use |
|---|---|---|
| Simple random | Every case has an equal chance (random numbers) | QA audit of files |
| Systematic | Every k-th case from a random start | Auditing every 50th file in a queue |
| Stratified | Random sample within each stratum (state, shift) | Guarantee each state is represented |
| Cluster | Randomly pick groups, take all cases in them | Sampling whole days or teams |
| Convenience | Whatever is at hand | Avoid; biased |

The QA lead who "audits the files that look risky" produces a biased sample: its defect rate does not estimate the population rate. Random selection is what justifies the inference. In SPSS: **Data → Select Cases → Random sample of cases**, or `SAMPLE 0.05.` for a 5% sample.

### The normal distribution

Many measurements, and almost all averages, follow the bell-shaped **normal distribution**, defined by mean μ and standard deviation σ. The empirical rule: 68% of values fall within ±1σ, 95% within ±1.96σ, 99.7% within ±3σ.

A **z-score** expresses a value in SD units: `z = (x − μ) / σ`. A file with turnaround 40 hours when μ = 22, σ = 6 has z = 3, more extreme than 99.7% of files. SPSS produces z-scores with **Descriptives → Save standardized values as variables**.

```python
import math
def normal_cdf(z):
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))
mu, sigma = 22, 6
x = 30
z = (x - mu) / sigma
print(f"z = {z:.2f}, P(X <= {x}) = {normal_cdf(z):.3f}, P(X > {x}) = {1 - normal_cdf(z):.3f}")
```

`math.erf` gives the normal CDF without any library; this is the calculation behind every z-table.

### Sampling distribution and the Central Limit Theorem

Take a random sample of n files, compute the mean turnaround. Take another sample, compute again. The means vary from sample to sample; their distribution is the **sampling distribution of the mean**. The Central Limit Theorem (CLT) says that, regardless of the shape of the population, the sampling distribution of the mean is approximately normal for large n (30 is the usual rule of thumb), centred on μ, with standard deviation `σ / √n`, called the **standard error (SE)**.

Consequences:

- Larger samples give a smaller SE; quadrupling n halves it.
- Even though turnaround times are skewed, the *mean* of 50 turnaround times is approximately normal, so t-tests on means are valid.
- The SE, not the SD, is what determines how precise an estimate is.

### Confidence intervals

A 95% confidence interval for a mean is `x̄ ± 1.96 × SE` (using t instead of 1.96 when σ is estimated from a small sample). Meaning: if we repeated the sampling many times, 95% of such intervals would contain μ. It is not "95% probability that μ is in this interval", which interviewers will pick you up on.

For a proportion, `SE = √(p(1−p)/n)`. A defect rate of 2.3% from 400 files has SE = 0.0075, so the 95% CI is roughly 0.8% to 3.8%. That width is why a sample of 400 cannot distinguish a 2% rate from a 3% rate.

### Sample size

To estimate a proportion within margin E at 95% confidence: `n = 1.96² × p(1−p) / E²`. For p = 0.05 and E = 0.01, n ≈ 1 825 files. For a mean: `n = (1.96 × σ / E)²`. Decide the margin before the audit; do not audit 50 files and then report a rate to one decimal.

### Checking normality in SPSS

**Analyze → Descriptive Statistics → Explore → Plots → Normality plots with tests** gives a Q-Q plot and the Kolmogorov-Smirnov and Shapiro-Wilk tests. Shapiro-Wilk is preferred for n < 50; both are over-sensitive for large n, where a histogram and skewness are more useful. Normality of the *residuals* or of the *sampling distribution* is what tests need, not normality of the raw variable.

> **Interview note:** Be ready to state the CLT precisely: the distribution of the sample mean approaches normal as n grows, with mean μ and SD σ/√n, whatever the population's shape (provided finite variance).

### Try It Yourself

```python
import random, statistics
random.seed(7)
# A skewed population of turnaround hours (exponential-like), mean about 22
population = [random.expovariate(1/22) for _ in range(20000)]
print("Population mean %.2f, SD %.2f" % (statistics.mean(population), statistics.pstdev(population)))

n = 50
sample_means = [statistics.mean(random.sample(population, n)) for _ in range(2000)]
se_theory = statistics.pstdev(population) / n ** 0.5
print("Mean of sample means %.2f" % statistics.mean(sample_means))
print("SD of sample means %.2f  vs  sigma/sqrt(n) = %.2f" % (statistics.stdev(sample_means), se_theory))
within = sum(abs(m - statistics.mean(population)) <= 1.96 * se_theory for m in sample_means) / len(sample_means)
print("Share of sample means within 1.96 SE: %.1f%%" % (100 * within))
```

### Quiz

1. What does the Central Limit Theorem say?
- [x] The sampling distribution of the mean approaches normal as n grows, with SD σ/√n
- [ ] All data become normal if you collect enough of it
- [ ] The population must be normal for any test
> The CLT concerns the distribution of sample means, not the raw data.

2. Doubling the sample size changes the standard error by a factor of:
- [ ] 1/2
- [x] 1/√2
- [ ] It does not change
> SE = σ/√n, so n must quadruple to halve the SE.

3. A correct reading of a 95% confidence interval is:
- [ ] There is a 95% chance the parameter lies in this specific interval
- [x] 95% of intervals built this way would contain the parameter
- [ ] 95% of the data lie in the interval
> The parameter is fixed; the interval is random. The probability statement is about the procedure.

### Exercises

1. **Audit size** — How many files must be audited to estimate a defect rate near 4% within ±1 percentage point at 95% confidence?
<details><summary>Solution</summary>

n = 1.96² × 0.04 × 0.96 / 0.01² ≈ 3.8416 × 0.0384 / 0.0001 ≈ 1 475 files.

</details>

2. **Interval for a mean** — 36 files have mean turnaround 24.5 h with SD 9 h. Give the 95% CI.
<details><summary>Solution</summary>

SE = 9 / √36 = 1.5. With df = 35, t ≈ 2.03 (1.96 is close enough at this size): 24.5 ± 2.03 × 1.5 = 21.5 to 27.5 hours.

</details>

### Interview Questions

**Q: Explain the difference between standard deviation and standard error.**
Standard deviation describes the spread of individual values in the data: how different one file's turnaround is from another. Standard error describes the spread of a statistic across repeated samples, most often the mean, and equals σ/√n for the mean. SD is a property of the data and does not shrink with more data; SE shrinks as n grows because averages of bigger samples are more stable. Reports should show SD when describing the population and SE or a confidence interval when stating how precise an estimate is. Confusing them, for example putting SE error bars on a chart to make groups look tighter than they are, is a recognised abuse.

**Q: Why does a random sample matter more than a large sample?**
Because bias does not shrink with size. A large convenience sample of the files a checker happened to pull, or of respondents who chose to answer, estimates the wrong quantity precisely. A modest random sample estimates the right quantity with quantifiable uncertainty, which is what confidence intervals and p-values assume. The classic example is a survey with a huge but self-selected sample that predicted the wrong outcome. In QA practice this means using a random number or every-k-th rule to choose files, and stratifying by state or shift if each group must be represented.

**Q: What is a p-value's connection to the normal distribution?**
Most test statistics (z, t, and asymptotically chi-square and F) are built on the fact that, under the null hypothesis and the CLT, a standardised estimate follows a known distribution. The p-value is the tail probability of that distribution beyond the observed statistic, computed with the same CDF I would use for a z-score. For a mean, the t-distribution replaces the normal to account for estimating σ, converging to normal as degrees of freedom grow. So the normal distribution is not an assumption about the raw data; it is the reference distribution for the statistic.


# LEVEL: Intermediate

## Hypothesis testing and p-values

A hypothesis test is a formal procedure for deciding whether the data are compatible with a claim about the population. Every test in SPSS and EViews, from a t-test to an ADF unit-root test, follows the same five steps, so learning them once means you can read any output window.

### The five steps

1. **State the null hypothesis H₀** (no effect, no difference, "the mean turnaround is 24 hours") and the **alternative H₁** (there is an effect; two-sided "≠ 24" or one-sided "< 24").
2. **Choose a significance level α**, almost always 0.05, before looking at the data.
3. **Compute a test statistic** that measures how far the sample is from H₀ in standard-error units (z, t, χ², F).
4. **Find the p-value**: the probability, if H₀ were true, of a statistic at least this extreme.
5. **Decide**: if p ≤ α reject H₀; otherwise fail to reject (never "accept") H₀.

```text
H0: mu = 24 hours       H1: mu != 24 hours      alpha = 0.05
Sample: n = 40, mean = 22.1, sd = 6.0
t = (22.1 - 24) / (6.0 / sqrt(40)) = -1.9 / 0.949 = -2.00
p (two-sided, df = 39) = 0.052  ->  fail to reject H0 at 5%
```

The statistic is −2.00 standard errors below the hypothesised mean. That is borderline: p = 0.052 is not below 0.05, so the evidence is not strong enough at the 5% level, even though the sample mean is lower than 24.

### What a p-value is and is not

| Statement | Correct? |
|---|---|
| Probability of data at least this extreme if H₀ is true | Yes |
| Probability that H₀ is true | No |
| Probability the result happened by chance | No |
| 1 − p is the probability H₁ is true | No |
| A smaller p means a bigger effect | No, it means stronger evidence, which also grows with n |

The last row matters in production analytics. With 20 000 files, a 0.3-hour difference in turnaround between two teams will have p < 0.001 and still be operationally meaningless. Always report the **effect size** (the difference, a correlation, Cohen's d) next to the p-value.

### Type I and Type II errors, power

- **Type I error** (false positive): rejecting a true H₀. Its probability is α.
- **Type II error** (false negative): failing to reject a false H₀. Its probability is β.
- **Power** = 1 − β: the chance of detecting a real effect. Power rises with sample size, effect size and α, and falls with variance.

A QA audit that tests whether a new checklist reduced errors from 3% to 2% needs thousands of files for 80% power; 200 files will almost always "find nothing" regardless of the truth. Interviewers like the question "the test was not significant, does that mean there is no effect?" and the answer is "not necessarily; the study may have been underpowered".

### One-sided versus two-sided

SPSS 27 and later print both "One-Sided p" and "Two-Sided p" in the t-test table; older versions print only "Sig. (2-tailed)" and you halve it for a one-sided test when the effect is in the predicted direction. Choose the sidedness from the research question before running the test, not after seeing which one is significant.

### Reading SPSS output

SPSS labels the p-value **Sig.**, and prints `.000` when p < 0.0005. Report that as `p < .001`, never as `p = .000`. EViews labels it **Prob.** and behaves the same way.

```spss
* One-sample t-test of turnaround against 24 hours.
T-TEST
  /TESTVAL=24
  /VARIABLES=turnaround_hours
  /CRITERIA=CI(.95).
```

The output has two tables: **One-Sample Statistics** (n, mean, SD, SE mean) and **One-Sample Test** (t, df, Sig., mean difference, 95% CI of the difference). If the confidence interval of the difference includes 0, the two-sided p is above 0.05; the two views always agree.

> **Warning:** Running twenty tests at α = 0.05 gives roughly a 64% chance of at least one false positive (1 − 0.95²⁰). When you screen many variables, use a Bonferroni correction (α / number of tests) or report that the analysis was exploratory.

### Try It Yourself

```python
import math, statistics

def t_cdf(t, df):
    # Student t CDF via numeric integration of the density (no scipy needed)
    def pdf(x):
        return math.gamma((df + 1) / 2) / (math.sqrt(df * math.pi) * math.gamma(df / 2)) * (1 + x * x / df) ** (-(df + 1) / 2)
    steps, lo = 4000, -60.0
    h = (t - lo) / steps
    area = sum((pdf(lo + i * h) + pdf(lo + (i + 1) * h)) / 2 * h for i in range(steps))
    return area

turnaround = [22.5, 19.0, 27.4, 21.1, 18.6, 25.0, 23.3, 20.2, 24.8, 17.9,
              21.7, 26.1, 22.9, 19.5, 23.0, 20.8, 24.1, 18.2, 22.0, 21.3]
mu0 = 24
n = len(turnaround)
mean, sd = statistics.mean(turnaround), statistics.stdev(turnaround)
se = sd / math.sqrt(n)
t = (mean - mu0) / se
p_two = 2 * (1 - t_cdf(abs(t), n - 1))
print(f"n={n} mean={mean:.2f} sd={sd:.2f} se={se:.3f}")
print(f"t({n-1}) = {t:.3f}, two-sided p = {p_two:.4f}")
print("Decision at 5%:", "reject H0" if p_two <= 0.05 else "fail to reject H0")
```

### Quiz

1. A p-value of 0.03 means:
- [ ] There is a 3% chance the null hypothesis is true
- [x] If H₀ were true, data this extreme would occur about 3% of the time
- [ ] The effect is large
> The p-value conditions on H₀ being true; it says nothing directly about the probability of H₀ or the size of the effect.

2. Which error does α control?
- [x] Type I (rejecting a true H₀)
- [ ] Type II (missing a real effect)
- [ ] Sampling error
> α is the tolerated false-positive rate; β is the false-negative rate and power is 1 − β.

3. SPSS prints Sig. = .000. You should report:
- [ ] p = 0
- [ ] p = .000
- [x] p < .001
> SPSS rounds to three decimals; the true p is small but not zero.

4. A non-significant result with n = 15 most likely means:
- [ ] There is definitely no effect
- [x] The test may not have had enough power to detect an effect
- [ ] The data were not normal
> Small samples have low power; absence of evidence is not evidence of absence.

### Exercises

1. **Write the hypotheses** — A manager claims the average QA score is at least 95. You suspect it is lower. State H₀, H₁ and the sidedness.
<details><summary>Solution</summary>

H₀: μ ≥ 95 (or μ = 95 for the test), H₁: μ < 95, one-sided (lower tail). In SPSS 27+ read the One-Sided p; in older versions halve Sig. (2-tailed) only if the sample mean is below 95.

</details>

2. **Multiple testing** — You compare defect rates across 12 states, each against the overall rate. What α should each test use under Bonferroni?
<details><summary>Solution</summary>

0.05 / 12 ≈ 0.0042. Equivalently, multiply each p-value by 12 and compare to 0.05.

</details>

3. **CI and p agree** — The 95% CI for a mean difference is [−0.4, 2.6]. Is the two-sided p below 0.05?
<details><summary>Solution</summary>

No. The interval includes 0, so H₀ (difference = 0) cannot be rejected at the 5% level; p > 0.05.

</details>

### Interview Questions

**Q: Explain a p-value to a non-technical manager.**
I would say: "We assume the change made no difference, then ask how surprising our numbers would be under that assumption. The p-value is that surprise level: 0.02 means results like ours would show up only 2 times in 100 if nothing had really changed, so we are fairly confident something did." I would then immediately add the size of the effect, for example "turnaround fell by 1.9 hours, from 24 to 22.1", because the manager needs to know whether it matters, not just whether it is real. I would avoid saying "98% sure it worked", which is the common misreading.

**Q: What is statistical power and when have you had to think about it?**
Power is the probability of detecting an effect of a given size if it exists, 1 − β. When we tested whether a new QA checklist reduced the error rate from about 3% to 2%, a quick calculation showed that 80% power at α = 0.05 needs roughly 3 000 files per group, so a two-week pilot of 300 files could never have been conclusive. We extended the pilot instead of reporting "no significant change", which would have been misleading. Power calculations should be done before data collection; SPSS has no built-in power module without the Power Analysis add-on in version 27+, so I use G*Power or the formula n = 2 × ((z_α + z_β) × σ / δ)².

**Q: Why should you decide α and sidedness before seeing the data?**
Because choosing them afterwards inflates the false-positive rate. If I look at the data, see the effect goes in one direction, and then pick a one-sided test, I have effectively doubled my α. Likewise, running many tests and reporting only the significant ones (p-hacking) turns a 5% error rate into something much higher. Pre-registering the hypothesis, the test, and the α, even just in an analysis plan email, protects the credibility of the result. Exploratory analyses are fine as long as they are labelled as such and confirmed on new data.

**Q: What is the difference between statistical and practical significance?**
Statistical significance says an effect is unlikely to be zero; practical significance says it is big enough to act on. With large production datasets almost everything is statistically significant: a 0.2-hour difference in turnaround across 15 000 files gives p < 0.001. Practical significance needs a threshold set by the business, such as "we care about a change of 2 hours or more", and an effect size with a confidence interval. I always present both, typically as "difference = 0.2 h, 95% CI [0.1, 0.3], p < .001, below the 2-hour threshold we agreed matters".

## t-tests in SPSS: one-sample, independent and paired

The t-test compares means. There are three versions and choosing the right one depends purely on the design: one group against a fixed number, two separate groups, or the same cases measured twice. SPSS puts all three under **Analyze → Compare Means**.

### One-sample t-test

Compares one mean to a known value: is the mean turnaround different from the 24-hour SLA?

```spss
T-TEST /TESTVAL=24 /VARIABLES=turnaround /CRITERIA=CI(.95).
```

Formula: `t = (x̄ − μ₀) / (s / √n)`, df = n − 1. Assumption: the sampling distribution of the mean is approximately normal (fine for n ≥ 30 by the CLT, or for smaller n if the data are not badly skewed).

### Independent-samples t-test

Compares two different groups: day shift versus night shift QA scores. Menu: **Analyze → Compare Means → Independent-Samples T Test**, put `qa_score` in Test Variable(s), `shift` in Grouping Variable, click **Define Groups** and enter the two codes (1 and 2).

```spss
T-TEST GROUPS=shift(1 2)
  /VARIABLES=qa_score
  /CRITERIA=CI(.95).
```

The output table has two rows, and this is where most beginners go wrong:

| Row | When to read it |
|---|---|
| Equal variances assumed | Levene's test Sig. > 0.05 (variances similar) |
| Equal variances not assumed | Levene's test Sig. ≤ 0.05 (Welch's t-test, fractional df) |

**Levene's Test for Equality of Variances** sits in the first two columns of the same table. Many statisticians now recommend always reading the Welch row, because it costs almost nothing when variances are equal and protects you when they are not.

Formula (equal variances): `t = (x̄₁ − x̄₂) / √(s²ₚ(1/n₁ + 1/n₂))` with the pooled variance `s²ₚ = ((n₁−1)s₁² + (n₂−1)s₂²) / (n₁+n₂−2)`, df = n₁ + n₂ − 2.

### Paired-samples t-test

Same cases measured twice: each agent's QA score before and after training. Menu: **Analyze → Compare Means → Paired-Samples T Test**, drag `score_before` and `score_after` as a pair.

```spss
T-TEST PAIRS=score_before WITH score_after (PAIRED)
  /CRITERIA=CI(.95).
```

Under the hood it is a one-sample t-test on the differences `d = after − before` against 0: `t = d̄ / (s_d / √n)`, df = n − 1. Pairing removes between-agent variability, which is why a paired test on 20 agents can be far more powerful than an independent test on 40.

### Effect size: Cohen's d

SPSS 27+ prints Cohen's d and Hedges' g in an **Effect Sizes** table. By hand, `d = (x̄₁ − x̄₂) / s_pooled`. Conventional labels: 0.2 small, 0.5 medium, 0.8 large. A training programme that lifts QA scores by d = 0.6 is worth talking about; a d of 0.05 with p < .001 from a huge sample is not.

### Checking assumptions

- **Independence** of observations: no agent appears in both groups (independent test) and pairs are genuinely matched (paired test).
- **Approximate normality** of each group (or of the differences). Use **Explore** with Shapiro-Wilk for small n; for n > 30 rely on the CLT unless there are extreme outliers.
- **Homogeneity of variance** for the independent test, judged with Levene's test.

If normality fails badly with a small sample, use the non-parametric equivalents covered in the Advanced level: Mann-Whitney U instead of the independent t-test, Wilcoxon signed-rank instead of the paired test.

> **Tip:** Report a t-test as: *t*(df) = value, *p* = value, mean difference with 95% CI, and *d*. Example: "Night shift scored lower than day shift, *t*(58) = 2.41, *p* = .019, difference = 2.3 points, 95% CI [0.4, 4.2], *d* = 0.62."

### Try It Yourself

```python
import math, statistics

def t_two_sided_p(t, df):
    # Student t two-sided p-value by numeric integration
    def pdf(x):
        return math.gamma((df + 1) / 2) / (math.sqrt(df * math.pi) * math.gamma(df / 2)) * (1 + x * x / df) ** (-(df + 1) / 2)
    t = abs(t); steps = 3000; hi = t + 40
    h = (hi - t) / steps
    tail = sum((pdf(t + i * h) + pdf(t + (i + 1) * h)) / 2 * h for i in range(steps))
    return 2 * tail

day   = [93, 96, 91, 95, 97, 92, 94, 96, 90, 95, 98, 93]
night = [90, 92, 88, 94, 91, 89, 93, 90, 87, 92, 91, 89]

# Independent samples (equal variances) and Welch
m1, m2 = statistics.mean(day), statistics.mean(night)
v1, v2 = statistics.variance(day), statistics.variance(night)
n1, n2 = len(day), len(night)
sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2)
t_pooled = (m1 - m2) / math.sqrt(sp2 * (1 / n1 + 1 / n2))
d = (m1 - m2) / math.sqrt(sp2)
print(f"Pooled t({n1+n2-2}) = {t_pooled:.3f}, p = {t_two_sided_p(t_pooled, n1+n2-2):.4f}, Cohen d = {d:.2f}")

se_w = math.sqrt(v1 / n1 + v2 / n2)
df_w = se_w ** 4 / ((v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1))
t_w = (m1 - m2) / se_w
print(f"Welch t({df_w:.1f}) = {t_w:.3f}, p = {t_two_sided_p(t_w, df_w):.4f}")

# Paired: the same 12 agents before and after training
before = [88, 91, 85, 90, 93, 87, 89, 92, 84, 90, 94, 88]
after  = [91, 93, 88, 92, 95, 88, 92, 94, 87, 91, 96, 90]
diffs = [a - b for a, b in zip(after, before)]
t_p = statistics.mean(diffs) / (statistics.stdev(diffs) / math.sqrt(len(diffs)))
print(f"Paired t({len(diffs)-1}) = {t_p:.3f}, p = {t_two_sided_p(t_p, len(diffs)-1):.5f}, mean gain = {statistics.mean(diffs):.2f}")
```

### Quiz

1. Levene's test gives Sig. = .012. Which row of the Independent Samples Test table do you read?
- [ ] Equal variances assumed
- [x] Equal variances not assumed
- [ ] Either; they are always identical
> A significant Levene's test means the variances differ, so use the Welch (unequal variances) row.

2. Comparing each agent's score before and after training calls for:
- [ ] Independent-samples t-test
- [x] Paired-samples t-test
- [ ] One-sample t-test
> The same agents are measured twice, so the observations are paired.

3. Cohen's d = 0.8 is conventionally:
- [ ] Small
- [ ] Medium
- [x] Large
> Cohen's benchmarks are 0.2, 0.5 and 0.8.

4. The degrees of freedom of a paired t-test on 25 pairs are:
- [ ] 48
- [x] 24
- [ ] 50
> The test is a one-sample test on 25 differences, so df = 25 − 1.

### Exercises

1. **Pick the test** — You want to know whether files from Texas take longer than files from Florida. Which t-test, and what SPSS syntax?
<details><summary>Solution</summary>

Independent-samples t-test with `state` as grouping variable.

```spss
T-TEST GROUPS=state('TX' 'FL') /VARIABLES=turnaround /CRITERIA=CI(.95).
```

Read the Welch row if Levene's test is significant.

</details>

2. **Compute by hand** — Group A: n = 30, mean 20, SD 4. Group B: n = 30, mean 18, SD 4. Compute t and d.
<details><summary>Solution</summary>

Pooled variance = 16. SE = √(16 × (1/30 + 1/30)) = √1.067 = 1.033. t = 2 / 1.033 = 1.94 (df = 58, p ≈ 0.06). d = 2 / 4 = 0.5, a medium effect.

</details>

3. **Why pairing helps** — Explain in two sentences why a paired design can find an effect an independent design misses.
<details><summary>Solution</summary>

Differences within the same agent remove the large stable between-agent variation from the error term. The denominator (SE of the differences) is therefore much smaller, so the same mean change produces a larger t.

</details>

### Interview Questions

**Q: When would you use Welch's t-test instead of the classic Student t-test?**
Whenever the two groups may have different variances or different sizes, which in practice is almost always. The classic test pools the variances and can give badly wrong p-values when the smaller group has the larger variance. Welch's version uses separate variances and the Satterthwaite degrees of freedom, and loses almost no power when the variances happen to be equal. In SPSS it is the "Equal variances not assumed" row; I read it by default and only mention Levene's test if the audience expects it. Comparing turnaround for a state with 2 000 files and a state with 80 files is a classic case where Welch matters.

**Q: What assumptions does the paired t-test make and how do you check them?**
It assumes the pairs are independent of one another and that the differences are approximately normally distributed; the raw scores do not need to be normal, only the differences. I check the differences with a histogram and Shapiro-Wilk in **Explore**, and look for outliers, because a single agent whose score jumped 30 points can drive the whole result. If the differences are clearly non-normal and n is small, I switch to the Wilcoxon signed-rank test. I also verify the pairing itself: the "before" and "after" rows must belong to the same agent, which is a data-preparation problem more than a statistical one.

**Q: A t-test shows p = .04 on 5 000 files. What do you report to management?**
The effect size and the confidence interval first, the p-value second. With 5 000 files a tiny difference is significant, so I would say something like "Night shift is 0.4 hours slower on average, 95% CI [0.02, 0.78], which is statistically significant but well below the 2-hour threshold we consider operationally important." I would also check whether the difference is stable across weeks rather than driven by one bad day. Reporting only "significant difference between shifts" would invite an unnecessary intervention.

**Q: How does a t-test relate to a confidence interval?**
They are the same information in two forms. A two-sided test at α = 0.05 rejects H₀: μ = μ₀ exactly when the 95% CI excludes μ₀, because both use the same estimate, SE and t critical value. The CI is more informative because it shows all the values of the parameter compatible with the data, so I lean on the CI in reports and use the p-value as a footnote. SPSS prints the CI of the difference in every t-test table for this reason.

## Chi-square and one-way ANOVA

t-tests handle two means. Two further workhorses cover the other common situations: the **chi-square test of independence** for two categorical variables (does defect status depend on state?) and **one-way ANOVA** for comparing the means of three or more groups (does turnaround differ across four teams?).

### Chi-square test of independence

Data: a crosstab of two nominal variables, for example `state` (TX, FL, CA) by `has_defect` (Yes, No). The null hypothesis is that the two variables are independent: the defect rate is the same in every state.

For each cell, the expected count under independence is `E = (row total × column total) / grand total`. The statistic is `χ² = Σ (O − E)² / E` with df = (rows − 1)(columns − 1).

```spss
CROSSTABS
  /TABLES=state BY has_defect
  /STATISTICS=CHISQ PHI
  /CELLS=COUNT EXPECTED ROW.
```

Menu: **Analyze → Descriptive Statistics → Crosstabs → Statistics → Chi-square** and **Cells → Expected, Row percentages**. The **Chi-Square Tests** table gives Pearson Chi-Square, its df and Asymptotic Significance. The footnote "0 cells (0.0%) have expected count less than 5" is the assumption check: if more than 20% of cells have expected counts below 5, use Fisher's exact test (printed automatically for 2×2 tables) or merge categories.

Effect size: **phi** for 2×2 tables, **Cramér's V** for larger ones (0.1 small, 0.3 medium, 0.5 large). Both appear when you tick **Phi and Cramer's V** in Statistics.

```text
                 Defect   No defect   Total   Defect rate
TX                  48        1152     1200        4.0%
FL                  22         878      900        2.4%
CA                  30         570      600        5.0%
Total              100        2600     2700        3.7%
Pearson chi-square = 8.05, df = 2, p = 0.018
```

Expected defects in TX = 1200 × 100 / 2700 = 44.4; observed 48. Rates differ by state; the row percentages tell you where (CA highest, FL lowest).

### One-way ANOVA

ANOVA (analysis of variance) tests H₀: μ₁ = μ₂ = … = μ_k. It compares variance *between* group means with variance *within* groups:

- `SS_between = Σ nⱼ(x̄ⱼ − x̄)²`, df = k − 1
- `SS_within = Σ Σ (xᵢⱼ − x̄ⱼ)²`, df = N − k
- `F = MS_between / MS_within` where MS = SS / df

If the groups share a common mean, F is around 1; large F means the group means spread out more than random noise would explain.

```spss
ONEWAY turnaround BY team
  /STATISTICS=DESCRIPTIVES HOMOGENEITY WELCH
  /POSTHOC=TUKEY BONFERRONI ALPHA(0.05).
```

Menu: **Analyze → Compare Means → One-Way ANOVA**. Options: Descriptives, Homogeneity of variance test, Welch. Post Hoc: Tukey (equal variances) or Games-Howell (unequal).

### Why not many t-tests?

Comparing four teams pairwise means six t-tests, and the chance of at least one false positive climbs to about 26%. ANOVA asks one question ("are any means different?") at α = 0.05, and post-hoc tests then compare pairs while controlling the family-wise error rate.

| Post-hoc | Use when |
|---|---|
| Tukey HSD | Equal variances, all pairwise comparisons |
| Bonferroni | Few planned comparisons; conservative |
| Games-Howell | Variances unequal (Levene significant) |
| Dunnett | Every group against one control group |

### Effect size and assumptions

Eta squared `η² = SS_between / SS_total` is the share of variance explained by group membership (0.01 small, 0.06 medium, 0.14 large); SPSS 27+ prints it under **ANOVA Effect Sizes**. Assumptions: independent groups, approximately normal residuals, equal variances (Levene). When Levene's test is significant, report the **Welch** F in the Robust Tests of Equality of Means table and use Games-Howell post-hocs. With k = 2, ANOVA and the t-test are identical: F = t².

> **Interview note:** Be ready to say why ANOVA is called "analysis of variance" even though it compares means: it partitions the total variance into between-group and within-group parts and tests their ratio.

### Try It Yourself

```python
import statistics

# One-way ANOVA by hand: turnaround hours for four production teams
teams = {
    "Team A": [21, 24, 19, 23, 22, 20, 25, 21],
    "Team B": [26, 28, 24, 27, 29, 25, 26, 27],
    "Team C": [22, 20, 23, 21, 24, 22, 20, 23],
    "Team D": [25, 23, 27, 24, 26, 25, 28, 24],
}
allv = [v for g in teams.values() for v in g]
grand = statistics.mean(allv)
N, k = len(allv), len(teams)
ss_between = sum(len(g) * (statistics.mean(g) - grand) ** 2 for g in teams.values())
ss_within = sum((v - statistics.mean(g)) ** 2 for g in teams.values() for v in g)
df_b, df_w = k - 1, N - k
F = (ss_between / df_b) / (ss_within / df_w)
eta2 = ss_between / (ss_between + ss_within)
for name, g in teams.items():
    print(f"{name}: mean {statistics.mean(g):.2f}, sd {statistics.stdev(g):.2f}")
print(f"SS_between={ss_between:.1f} (df {df_b}), SS_within={ss_within:.1f} (df {df_w})")
print(f"F({df_b},{df_w}) = {F:.2f}, eta^2 = {eta2:.3f}")
print("F critical at 5% for (3,28) is about 2.95 ->", "reject H0" if F > 2.95 else "fail to reject")

# Chi-square by hand: state x defect
obs = {"TX": (48, 1152), "FL": (22, 878), "CA": (30, 570)}
col = [sum(r[i] for r in obs.values()) for i in range(2)]
total = sum(col)
chi2 = 0
for state, row in obs.items():
    rt = sum(row)
    for i, o in enumerate(row):
        e = rt * col[i] / total
        chi2 += (o - e) ** 2 / e
print(f"chi-square = {chi2:.2f}, df = {(len(obs)-1)*(2-1)}, critical at 5% (df 2) = 5.99")
```

### Quiz

1. The chi-square test of independence needs which data?
- [x] Counts in a crosstab of two categorical variables
- [ ] Means and SDs of two groups
- [ ] A continuous outcome and a continuous predictor
> Chi-square compares observed and expected cell counts.

2. If more than 20% of expected cell counts are below 5 you should:
- [ ] Ignore it; SPSS corrects automatically
- [x] Use Fisher's exact test or merge categories
- [ ] Switch to a t-test
> Small expected counts make the chi-square approximation unreliable.

3. ANOVA with four groups gives F = 4.2, p = .01. What do you know?
- [x] At least one group mean differs; post-hoc tests say which
- [ ] All four means differ from each other
- [ ] Team A differs from Team D
> The omnibus F only says the means are not all equal.

4. With two groups, F from one-way ANOVA equals:
- [ ] t
- [x] t²
- [ ] 2t
> The two tests are algebraically equivalent when k = 2.

### Exercises

1. **Expected counts** — In a 2×2 table with row totals 300 and 700 and column totals 100 and 900, compute the expected count of the top-left cell.
<details><summary>Solution</summary>

E = 300 × 100 / 1000 = 30.

</details>

2. **Choose the post-hoc** — Levene's test is significant in a 5-group ANOVA. Which post-hoc do you request in SPSS?
<details><summary>Solution</summary>

Games-Howell (`/POSTHOC=GH`), together with the Welch F from `/STATISTICS=WELCH`.

</details>

3. **Write the syntax** — Test whether `qa_score` differs across `shift` (3 levels) with descriptives and Tukey post-hocs.
<details><summary>Solution</summary>

```spss
ONEWAY qa_score BY shift
  /STATISTICS=DESCRIPTIVES HOMOGENEITY
  /POSTHOC=TUKEY ALPHA(0.05).
```

</details>

### Interview Questions

**Q: Explain the logic of ANOVA without formulas.**
Imagine four teams' turnaround times. If the teams are really the same, their averages should differ from each other only as much as individual files differ within a team. ANOVA measures both spreads: how far the team averages are from the overall average (between) and how far files are from their own team average (within), and takes the ratio F. A ratio near 1 says the team differences are just noise; a large ratio says the teams genuinely differ. Then post-hoc tests, which adjust for the number of comparisons, tell you which teams differ. On real data I once found F significant only because one team had two 60-hour outliers, so I always look at the descriptives and a boxplot before believing the F.

**Q: What are the assumptions of the chi-square test and what do you do when they fail?**
Observations must be independent (each file counted once, in one cell), the variables categorical, and expected counts adequate: no more than 20% of cells below 5 and none below 1. If expected counts are small, for a 2×2 table I report Fisher's exact test, which SPSS prints automatically; for larger tables I collapse sparse categories, for example merging rare states into "Other", or use the exact test from the Exact Tests module. If the same file appears twice, say once per underwriter, independence is violated and the p-value is meaningless; the fix is to restructure the data, not to use a different test. I also always report the row percentages and Cramér's V, since a significant chi-square on 10 000 files can reflect a trivial difference in rates.

**Q: When would you use ANOVA versus regression with dummy variables?**
They are the same model: one-way ANOVA is a regression of the outcome on k − 1 dummies, and the F-test for the dummies equals the ANOVA F. I use the ANOVA procedure when the question is purely "do group means differ?" and I want post-hoc comparisons and effect sizes conveniently. I switch to regression (UNIANOVA or REGRESSION in SPSS, LS in EViews) when I also need to adjust for continuous covariates like file complexity, or when I want the coefficients expressed as differences from a reference group for a report. Knowing they are equivalent lets me choose the output format that the audience will understand.

**Q: What does a significant Levene's test change in your ANOVA workflow?**
It tells me the equal-variance assumption behind the classic F and Tukey's test is doubtful. I then report the Welch F from the Robust Tests table, which adjusts the degrees of freedom, and use Games-Howell post-hoc tests, which do not assume equal variances or equal group sizes. In production data unequal variances are common because a slow team also tends to be a variable team, so I now request Welch and Games-Howell by default. If the variances differ by an order of magnitude, I also consider a log transformation of turnaround or a Kruskal-Wallis test.

## Correlation: Pearson and Spearman

Correlation measures how strongly two variables move together. It is the first thing to compute before any regression, and the most misinterpreted statistic in business reporting. This chapter covers the two coefficients you will use daily, how SPSS presents them, and the traps.

### Pearson's r

Pearson's correlation coefficient measures the strength and direction of a **linear** relationship between two interval or ratio variables:

`r = Σ(xᵢ − x̄)(yᵢ − ȳ) / √(Σ(xᵢ − x̄)² Σ(yᵢ − ȳ)²)`

Equivalently, r is the covariance divided by the product of the two standard deviations, which is why it is unit-free and bounded between −1 and +1.

| r | Interpretation (Cohen) |
|---|---|
| ±0.1 | Small |
| ±0.3 | Medium |
| ±0.5 and beyond | Large |
| 0 | No linear relationship (but possibly a curved one) |

`r²` is the share of variance in one variable linearly explained by the other. r = 0.5 explains 25% of the variance; r = 0.7 explains about half.

```spss
CORRELATIONS
  /VARIABLES=pages_in_file turnaround qa_score
  /PRINT=TWOTAIL NOSIG
  /MISSING=PAIRWISE.
```

Menu: **Analyze → Correlate → Bivariate**, tick Pearson and/or Spearman. The output is a symmetric matrix with r, Sig. (2-tailed) and N in each cell. `/MISSING=PAIRWISE` uses all available pairs for each correlation; `LISTWISE` drops any case with a missing value anywhere, keeping N constant.

### Spearman's rho

Spearman's rank correlation replaces each value with its rank and computes Pearson's r on the ranks. Use it when:

- either variable is ordinal (a 1–5 satisfaction rating, a difficulty grade);
- the relationship is monotonic but not linear (turnaround rises with pages, but at a decreasing rate);
- outliers would dominate Pearson's r.

With no ties the shortcut formula is `ρ = 1 − 6Σd² / (n(n² − 1))` where d is the difference between the two ranks of each case. SPSS uses the full ranked-Pearson version, which handles ties correctly. Kendall's tau-b is a third option for small samples with many ties.

### Testing significance

H₀: ρ = 0. The test statistic is `t = r √(n − 2) / √(1 − r²)` with df = n − 2. With n = 1 000, an r of 0.07 is significant at p = .03 and explains 0.5% of the variance: significant and useless. Always report r itself and n.

### Always plot first

Anscombe's quartet is four datasets with the same r = 0.82 and radically different scatterplots. In SPSS: **Graphs → Chart Builder → Scatter/Dot**, or the syntax:

```spss
GRAPH /SCATTERPLOT(BIVAR)=pages_in_file WITH turnaround.
```

Look for curvature (Spearman or a transformation), outliers (an 800-page handbook among 20-page letters), clusters (two states with different processes), and restricted range (only files under 50 pages, which shrinks r).

### Correlation is not causation

Turnaround correlates with pages, and pages correlate with the number of QA rejections, but the rejections may be caused by file complexity, which also drives pages. Confounders, reverse causation and selection effects all produce correlations without a causal link. A correlation justifies a hypothesis and a regression with controls; it never justifies "pages cause defects" in a report.

> **Warning:** Pearson's r is only about the linear component. A perfect U-shaped relationship has r ≈ 0. Reporting "no correlation" without a scatterplot can hide a strong, real, non-linear dependency.

### Partial correlation

**Analyze → Correlate → Partial** (`PARTIAL CORR /VARIABLES=turnaround qa_score BY pages_in_file.`) gives the correlation between two variables after removing the linear effect of a third. It is the bridge to multiple regression: a strong raw correlation that vanishes after controlling for pages was probably driven by pages.

### Try It Yourself

```python
import statistics

pages      = [12, 25, 40, 18, 60, 33, 8, 75, 22, 50, 15, 90]
turnaround = [11, 13, 22, 10, 27, 19, 9, 41, 12, 24, 14, 40]   # hours
qa_score   = [96, 95, 93, 97, 90, 94, 98, 88, 95, 91, 97, 86]

def pearson(x, y):
    mx, my = statistics.mean(x), statistics.mean(y)
    num = sum((a - mx) * (b - my) for a, b in zip(x, y))
    den = (sum((a - mx) ** 2 for a in x) * sum((b - my) ** 2 for b in y)) ** 0.5
    return num / den

def ranks(v):
    order = sorted(range(len(v)), key=lambda i: v[i])
    r = [0.0] * len(v)
    i = 0
    while i < len(order):          # average ranks for ties
        j = i
        while j + 1 < len(order) and v[order[j + 1]] == v[order[i]]:
            j += 1
        for k in range(i, j + 1):
            r[order[k]] = (i + j) / 2 + 1
        i = j + 1
    return r

def spearman(x, y):
    return pearson(ranks(x), ranks(y))

r = pearson(pages, turnaround)
n = len(pages)
t = r * (n - 2) ** 0.5 / (1 - r * r) ** 0.5
print(f"Pearson r(pages, turnaround) = {r:.3f}, r^2 = {r*r:.3f}, t({n-2}) = {t:.2f}")
print(f"Spearman rho(pages, turnaround) = {spearman(pages, turnaround):.3f}")
print(f"Pearson r(pages, qa_score) = {pearson(pages, qa_score):.3f}")

# Add one outlier and watch Pearson move while Spearman barely does
pages2, turn2 = pages + [30], turnaround + [120]
print(f"With outlier: Pearson {pearson(pages2, turn2):.3f}, Spearman {spearman(pages2, turn2):.3f}")
```

### Quiz

1. Pearson's r = −0.6 between pages and QA score means:
- [x] Longer files tend to score lower, a fairly strong linear relationship
- [ ] Pages cause low scores
- [ ] 60% of files with many pages score low
> r measures linear association and direction; it says nothing about causation or percentages of cases.

2. Which coefficient should you use for a 1–5 satisfaction rating against turnaround?
- [ ] Pearson
- [x] Spearman
- [ ] Neither; use a t-test
> Ordinal data call for a rank-based coefficient.

3. r = 0.8 means the variance explained is:
- [ ] 80%
- [x] 64%
- [ ] 8%
> r² = 0.64.

4. A scatterplot shows a clear U shape. Pearson's r will be:
- [x] Close to 0
- [ ] Close to 1
- [ ] Undefined
> r captures only linear trend; a symmetric curve cancels out.

### Exercises

1. **Rank correlation by hand** — Ranks of five agents on speed: 1,2,3,4,5; on quality: 2,1,4,3,5. Compute Spearman's ρ.
<details><summary>Solution</summary>

d = (−1, 1, −1, 1, 0), Σd² = 4. ρ = 1 − 6 × 4 / (5 × 24) = 1 − 0.2 = 0.8.

</details>

2. **Significance** — r = 0.25 with n = 66. Is it significant at 5%?
<details><summary>Solution</summary>

t = 0.25 × √64 / √(1 − 0.0625) = 2 / 0.968 = 2.07, df = 64, p ≈ 0.043. Yes, just.

</details>

3. **SPSS syntax** — Produce a Spearman correlation matrix of `rating`, `turnaround` and `pages` with listwise deletion.
<details><summary>Solution</summary>

```spss
NONPAR CORR
  /VARIABLES=rating turnaround pages
  /PRINT=SPEARMAN TWOTAIL NOSIG
  /MISSING=LISTWISE.
```

</details>

### Interview Questions

**Q: What is the difference between correlation and regression?**
Correlation is symmetric and unit-free: it measures how tightly two variables cluster around a straight line, and r(x, y) = r(y, x). Regression is directional: it models y as a function of x, gives a slope in the units of y per unit of x, and can include several predictors and controls. For a report I use correlation to screen relationships and regression to quantify them: "each additional 10 pages adds 4.2 hours of turnaround, holding state constant" is a regression statement that a correlation of 0.85 cannot make. In simple regression the two are linked by r² = R² and slope = r × s_y / s_x.

**Q: How would you explain a spurious correlation to a stakeholder?**
With a concrete example from their world. Monthly defect counts and monthly file volume are strongly correlated, but that is because both grow with the number of files, not because volume causes defects; the defect *rate* may be flat. I would show the rate instead of the count, or the correlation after controlling for volume with a partial correlation. Time-series spurious correlations are especially common: two series that both trend upward will correlate strongly whatever they are, which is why the econometrics part of this course spends so much time on stationarity.

**Q: When does Spearman beat Pearson, and does it have downsides?**
Spearman is better for ordinal data, for monotonic non-linear relationships, and when outliers are present, because ranking bounds each case's influence. Its downsides are that it discards magnitude information, so it cannot distinguish "twice as many pages" from "slightly more pages", and its confidence intervals and tests are less standard. For continuous, roughly linear data with no outliers, Pearson is more powerful and directly interpretable as r². In practice I compute both; a big gap between them is itself diagnostic of outliers or curvature and sends me back to the scatterplot.

**Q: Explain restriction of range with an example.**
If you compute the correlation between an entrance test and job performance only among the people you hired, the correlation is much lower than in the full applicant pool, because you cut off the low scorers. The same happens when a QA study only includes files that passed the first check, or only files under 50 pages. The formula for r depends on the variance of x, and truncating x shrinks that variance and therefore r. When I see an unexpectedly weak correlation, I ask how the sample was selected before concluding the relationship is weak.

## Simple and multiple linear regression in SPSS

Regression is the model behind most business analytics: predict an outcome from one or more predictors and quantify each predictor's contribution. This chapter builds the simple model, extends it to several predictors, and teaches you to read every table SPSS prints.

### The simple linear model

`y = β₀ + β₁x + ε`

- `β₀` intercept: predicted y when x = 0.
- `β₁` slope: change in y for a one-unit increase in x.
- `ε` error: everything the line does not explain, assumed to have mean 0 and constant variance.

Ordinary least squares (OLS) chooses β₀ and β₁ to minimise Σ(yᵢ − ŷᵢ)², the sum of squared residuals. The closed form is `β₁ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²` and `β₀ = ȳ − β₁x̄`.

```spss
REGRESSION
  /STATISTICS COEFF OUTS R ANOVA CI(95)
  /DEPENDENT turnaround
  /METHOD=ENTER pages_in_file
  /SCATTERPLOT=(*ZRESID ,*ZPRED)
  /RESIDUALS HISTOGRAM(ZRESID).
```

Menu: **Analyze → Regression → Linear**, Dependent = `turnaround`, Independent(s) = `pages_in_file`, Statistics → Confidence intervals, Plots → ZRESID against ZPRED and Histogram.

### Reading the output

| Table | What to read |
|---|---|
| Model Summary | R, R², Adjusted R², Std. Error of the Estimate |
| ANOVA | F and Sig.: does the model explain anything at all? |
| Coefficients | B (unstandardised), Std. Error, Beta (standardised), t, Sig., 95% CI |

```text
Model Summary: R = .912, R Square = .831, Adjusted R Square = .827, Std. Error = 3.41
Coefficients:            B      Std. Error   Beta      t      Sig.
  (Constant)          6.214       0.812              7.65   .000
  pages_in_file       0.412       0.028     .912    14.71   .000
```

Read: turnaround ≈ 6.2 + 0.41 × pages. Each extra page adds about 25 minutes; the model explains 83% of the variance; the residual SD is 3.4 hours, which is the typical size of a prediction error.

### Multiple regression

`y = β₀ + β₁x₁ + β₂x₂ + … + βₖxₖ + ε`

Each coefficient is now the effect of that predictor **holding the others constant**. Adding `is_commercial` (0/1) and `agent_experience_months`:

```spss
REGRESSION
  /STATISTICS COEFF OUTS R ANOVA COLLIN TOL CI(95) CHANGE
  /DEPENDENT turnaround
  /METHOD=ENTER pages_in_file is_commercial agent_experience_months.
```

The **Beta** column (standardised coefficients) lets you compare predictors measured in different units: a Beta of 0.60 for pages and −0.25 for experience says pages matter more. B is what you report to operations because it is in hours.

**Adjusted R²** penalises extra predictors: `1 − (1 − R²)(n − 1)/(n − k − 1)`. Use it to compare models with different numbers of predictors. `/STATISTICS CHANGE` with several `/METHOD=ENTER` blocks prints the R² change of each block (hierarchical regression).

### Categorical predictors

A binary variable coded 0/1 enters directly; its B is the difference between the two groups holding everything else constant. A variable with k categories needs k − 1 dummies; SPSS does not create them automatically in REGRESSION (use `RECODE` or `UNIANOVA`, or the **Create Dummy Variables** dialog under Transform in version 22+).

### Assumptions (LINE)

- **L**inearity: residuals show no pattern against predicted values.
- **I**ndependence of errors: Durbin-Watson near 2 (`/RESIDUALS DURBIN`); matters for time-ordered data.
- **N**ormality of residuals: histogram or P-P plot of ZRESID.
- **E**qual variance (homoscedasticity): the ZRESID vs ZPRED scatter is a flat band, not a funnel.

Plus **no severe multicollinearity**: VIF below 10 (some say 5) and Tolerance above 0.1 in the Coefficients table. Standardised residuals beyond ±3 are outliers worth inspecting with **Casewise diagnostics**.

> **Tip:** Save predicted values and residuals to the dataset with `/SAVE PRED RESID`; a residual sorted descending is the fastest way to find the files your model cannot explain, which is often where the data errors are.

### Try It Yourself

```python
import statistics

pages  = [12, 25, 40, 18, 60, 33, 8, 75, 22, 50, 15, 90, 45, 28, 66]
comm   = [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1]      # commercial file?
hours  = [10, 14, 24, 12, 34, 17, 9, 42, 13, 30, 11, 48, 27, 15, 37]

# Simple regression by closed form
mx, my = statistics.mean(pages), statistics.mean(hours)
b1 = sum((x - mx) * (y - my) for x, y in zip(pages, hours)) / sum((x - mx) ** 2 for x in pages)
b0 = my - b1 * mx
pred = [b0 + b1 * x for x in pages]
ss_res = sum((y - p) ** 2 for y, p in zip(hours, pred))
ss_tot = sum((y - my) ** 2 for y in hours)
print(f"Simple: hours = {b0:.2f} + {b1:.3f} * pages, R^2 = {1 - ss_res/ss_tot:.3f}")

# Multiple regression via normal equations solved with Gaussian elimination (no numpy needed)
X = [[1, p, c] for p, c in zip(pages, comm)]
n, k = len(X), 3
XtX = [[sum(X[r][i] * X[r][j] for r in range(n)) for j in range(k)] for i in range(k)]
Xty = [sum(X[r][i] * hours[r] for r in range(n)) for i in range(k)]
A = [row[:] + [Xty[i]] for i, row in enumerate(XtX)]
for i in range(k):
    piv = A[i][i]
    A[i] = [v / piv for v in A[i]]
    for r in range(k):
        if r != i:
            f = A[r][i]
            A[r] = [a - f * b for a, b in zip(A[r], A[i])]
beta = [A[i][k] for i in range(k)]
pred2 = [sum(b * x for b, x in zip(beta, row)) for row in X]
ss_res2 = sum((y - p) ** 2 for y, p in zip(hours, pred2))
r2 = 1 - ss_res2 / ss_tot
adj = 1 - (1 - r2) * (n - 1) / (n - k)
print(f"Multiple: hours = {beta[0]:.2f} + {beta[1]:.3f}*pages + {beta[2]:.2f}*commercial")
print(f"R^2 = {r2:.3f}, adjusted R^2 = {adj:.3f}, residual SD = {(ss_res2/(n-k))**0.5:.2f} h")
```

### Quiz

1. In `turnaround = 6.2 + 0.41 × pages`, the 0.41 means:
- [x] Each extra page adds 0.41 hours on average
- [ ] 41% of turnaround is explained by pages
- [ ] Pages explain 0.41 hours in total
> The slope is the change in y per one-unit change in x.

2. Which statistic should you use to compare a 2-predictor model with a 5-predictor model?
- [ ] R²
- [x] Adjusted R²
- [ ] The intercept
> R² never falls when predictors are added; adjusted R² penalises them.

3. A VIF of 14 on one predictor indicates:
- [ ] Heteroskedasticity
- [x] Severe multicollinearity
- [ ] Non-normal residuals
> VIF above 10 means the predictor is nearly a linear combination of the others.

4. The Beta (standardised) column is useful for:
- [x] Comparing the relative importance of predictors in different units
- [ ] Reporting effects in hours to operations
- [ ] Testing normality
> Standardised coefficients are in SD units, so they are comparable across predictors.

### Exercises

1. **Interpret** — B for `is_commercial` = 5.8, Sig. = .002, 95% CI [2.2, 9.4]. Write the sentence for the report.
<details><summary>Solution</summary>

"Holding pages and agent experience constant, commercial files take 5.8 hours longer on average than residential files (95% CI 2.2 to 9.4 h, p = .002)."

</details>

2. **Dummy coding** — `state` has values TX, FL, CA. Write SPSS RECODE syntax to create dummies with TX as reference.
<details><summary>Solution</summary>

```spss
RECODE state ('FL'=1) (ELSE=0) INTO d_FL.
RECODE state ('CA'=1) (ELSE=0) INTO d_CA.
EXECUTE.
```

Enter `d_FL` and `d_CA`; each B is the difference from Texas.

</details>

3. **Diagnose** — The ZRESID vs ZPRED plot fans out to the right. What is the problem and one fix?
<details><summary>Solution</summary>

Heteroskedasticity: error variance grows with the predicted value. Fixes: log-transform the outcome (`COMPUTE ln_turn = LN(turnaround).`), use weighted least squares, or use robust (HC3) standard errors, available in SPSS 27+ under Options → Heteroskedasticity-consistent standard errors.

</details>

### Interview Questions

**Q: What does "holding other variables constant" really mean for a coefficient?**
In multiple regression each coefficient is the partial effect: the association between that predictor and the outcome after the linear influence of the other predictors has been removed from both. Mechanically, it equals the slope from regressing the residuals of y-on-others against the residuals of x-on-others (the Frisch-Waugh-Lovell theorem). Practically, if pages and commercial status are correlated, the simple slope for pages absorbs some of the commercial effect, and the multiple-regression slope for pages is what remains once commercial status is in the model. This is why coefficients change when you add controls, and why "the effect of pages" without stating the other variables in the model is incomplete.

**Q: How do you decide which predictors to include?**
Primarily by theory and the purpose of the model, not by stepwise selection. For an explanatory model I include the variables the question is about plus known confounders, then check whether the coefficients are stable when I add or drop controls. For a prediction model I care about out-of-sample accuracy, so I hold out data or cross-validate rather than chase adjusted R². I avoid SPSS's STEPWISE method for anything I will report, because it inflates R², produces biased p-values, and picks different variables on a new sample. I do check VIFs and drop or combine near-duplicate predictors, such as page count and word count.

**Q: What is R² and can it be misleading?**
R² is the share of the outcome's variance explained by the model, SS_regression / SS_total. It is misleading in several ways: it rises with every added predictor even if the predictor is noise, so adjusted R² is better for comparison; it is not comparable across different outcome variables or transformations (a model of log turnaround and a model of turnaround have incomparable R²); and a high R² does not mean the model is correct, since trending time series give R² of 0.95 for nonsense relationships. A low R² can still be a useful model if the coefficient of interest is precisely estimated. I treat R² as a description of fit, not as a quality score.

**Q: Walk me through checking regression assumptions in SPSS.**
I request `/SCATTERPLOT=(*ZRESID,*ZPRED)` and look for a flat, patternless band: curvature means a missing non-linear term, a funnel means heteroskedasticity. I request `/RESIDUALS HISTOGRAM(ZRESID) NORMPROB(ZRESID) DURBIN` for normality and independence; a Durbin-Watson well away from 2 in time-ordered data means autocorrelated errors. I add `/STATISTICS COLLIN TOL` and look at VIF, and `/CASEWISE PLOT(ZRESID) OUTLIERS(3)` to list cases with standardised residuals beyond 3, plus `/SAVE COOK LEVER` to find influential points. I then fix problems in that order: model form first, then variance, then outliers that turn out to be data errors, which in production data they usually are.

## SPSS syntax basics

Every click in an SPSS dialog can be expressed as a command. Working in the **Syntax Editor** (File → New → Syntax) makes analyses reproducible, reviewable and re-runnable on next week's data, which is exactly what a weekly production report needs. This chapter teaches the grammar and the twenty commands that cover 90% of daily work.

### Grammar

- Each command starts at the beginning of a line with a keyword (`FREQUENCIES`, `COMPUTE`) and ends with a period `.`
- Subcommands begin with `/` and can span several lines.
- Comments begin with `*` and end with a period, or use `/* … */` inline.
- Keywords are case-insensitive; string values are case-sensitive and quoted with single or double quotes.
- Transformations (`COMPUTE`, `RECODE`, `IF`) are queued until an `EXECUTE.` or the next procedure runs.

The fastest way to learn is the **Paste** button in any dialog: it writes the syntax into the editor instead of running. Select lines and press **Ctrl+R** to run.

### Loading and describing data

```spss
GET FILE='C:\Reports\production_week37.sav'.
GET DATA /TYPE=TXT /FILE='C:\Reports\week37.csv'
  /DELIMITERS="," /QUALIFIER='"' /FIRSTCASE=2
  /VARIABLES=file_id A12 state A2 pages F4.0 turnaround F6.2 qa_score F5.1.
DATASET NAME week37 WINDOW=FRONT.
DISPLAY DICTIONARY.
FREQUENCIES VARIABLES=state qa_band /ORDER=ANALYSIS.
DESCRIPTIVES VARIABLES=pages turnaround qa_score /STATISTICS=MEAN STDDEV MIN MAX.
```

`GET DATA /TYPE=TXT` is the syntax behind the Text Import Wizard. The format codes are `A` for string with width, `F` for numeric with width and decimals, `DATE11` or `ADATE10` for dates. For Excel, `GET DATA /TYPE=XLSX /FILE='…' /SHEET=name 'Data' /READNAMES=ON.`

### Transforming variables

```spss
COMPUTE turnaround_days = turnaround / 24.
COMPUTE ln_pages = LN(pages).
IF (state = 'TX' OR state = 'FL') region = 1.
IF (state = 'CA') region = 2.
RECODE qa_score (LO THRU 89.99=1) (90 THRU 94.99=2) (95 THRU HI=3) INTO qa_band.
VARIABLE LABELS qa_band 'QA score band' region 'Region'.
VALUE LABELS qa_band 1 'Fail' 2 'Pass' 3 'Excellent'
  / region 1 'South' 2 'West'.
MISSING VALUES qa_score (-9).
FORMATS turnaround_days (F6.2).
EXECUTE.
```

`COMPUTE` creates or overwrites a numeric variable; string results need `STRING newvar (A20).` first. `RECODE … INTO` keeps the original; without `INTO` it overwrites. `MISSING VALUES` declares user-missing codes so they drop out of statistics.

### Selecting, sorting and splitting

```spss
SORT CASES BY state (A) turnaround (D).
SELECT IF (pages > 0 AND NOT MISSING(turnaround)).
TEMPORARY.
SELECT IF (state = 'TX').
DESCRIPTIVES VARIABLES=turnaround.
SPLIT FILE LAYERED BY state.
DESCRIPTIVES VARIABLES=turnaround qa_score.
SPLIT FILE OFF.
FILTER BY is_commercial.
FILTER OFF.
```

| Command | Effect |
|---|---|
| `SELECT IF` | Permanently deletes non-matching cases (from the active dataset) |
| `TEMPORARY.` + `SELECT IF` | Applies only to the next procedure |
| `FILTER BY var` | Hides cases where var = 0 or missing; reversible with `FILTER OFF` |
| `SPLIT FILE` | Runs every following procedure separately per group |

Use `TEMPORARY` or `FILTER` unless you truly want to discard cases; a `SELECT IF` followed by `SAVE` has erased many datasets.

### Aggregating and merging

```spss
AGGREGATE /OUTFILE='C:\Reports\by_state.sav'
  /BREAK=state
  /files=N /mean_turn=MEAN(turnaround) /defect_rate=MEAN(has_defect).
MATCH FILES /FILE=* /TABLE='C:\Reports\state_targets.sav' /BY state.
ADD FILES /FILE='week36.sav' /FILE='week37.sav'.
```

`AGGREGATE` is GROUP BY; `MATCH FILES … /TABLE` is a lookup join (both files must be sorted by the key); `ADD FILES` stacks rows.

### Output control

```spss
OUTPUT NEW.
TITLE 'Weekly production report - week 37'.
OMS /SELECT TABLES /IF COMMANDS=['Descriptives'] /DESTINATION FORMAT=XLSX OUTFILE='C:\Reports\desc.xlsx'.
DESCRIPTIVES VARIABLES=turnaround.
OMSEND.
OUTPUT EXPORT /XLSX DOCUMENTFILE='C:\Reports\week37_output.xlsx'.
SAVE OUTFILE='C:\Reports\week37_clean.sav' /COMPRESSED.
```

The **Output Management System** (`OMS`) routes specific tables to Excel, CSV or SPSS datasets, which is how you automate a report that must land in a workbook every Monday. **Utilities → Production Facility** (or `stats.exe -f job.sps -o out.spv` on the command line) runs a syntax file unattended.

> **Interview note:** "How do you make an SPSS analysis reproducible?" The answer is: save every step as syntax, never edit data by hand in Data View, keep the raw file read-only, version the .sps file, and use OMS to export tables rather than copy-pasting from the Viewer.

### Try It Yourself

```python
# A tiny SPSS-syntax-style pipeline in Python: RECODE, AGGREGATE, SPLIT FILE equivalents.
import statistics
rows = [
    {"file_id": "TX-1001", "state": "TX", "pages": 20, "turnaround": 18.5, "qa_score": 96},
    {"file_id": "TX-1002", "state": "TX", "pages": 55, "turnaround": 31.0, "qa_score": 88},
    {"file_id": "FL-2001", "state": "FL", "pages": 12, "turnaround": 12.0, "qa_score": 97},
    {"file_id": "FL-2002", "state": "FL", "pages": 33, "turnaround": 22.4, "qa_score": 93},
    {"file_id": "CA-3001", "state": "CA", "pages": 70, "turnaround": 40.2, "qa_score": -9},   # -9 = user missing
    {"file_id": "CA-3002", "state": "CA", "pages": 41, "turnaround": 26.1, "qa_score": 91},
]
# MISSING VALUES qa_score (-9).
for r in rows:
    if r["qa_score"] == -9:
        r["qa_score"] = None
# RECODE qa_score (LO THRU 89.99=1)(90 THRU 94.99=2)(95 THRU HI=3) INTO qa_band.
def band(s):
    if s is None: return None
    return 1 if s < 90 else 2 if s < 95 else 3
for r in rows:
    r["qa_band"] = band(r["qa_score"])
    r["turnaround_days"] = round(r["turnaround"] / 24, 2)      # COMPUTE
# AGGREGATE /BREAK=state /files=N /mean_turn=MEAN(turnaround).
by_state = {}
for r in rows:
    by_state.setdefault(r["state"], []).append(r)
print("state  files  mean_turn  mean_qa")
for st, grp in sorted(by_state.items()):
    qa = [g["qa_score"] for g in grp if g["qa_score"] is not None]
    print(f"{st:5}  {len(grp):5}  {statistics.mean(g['turnaround'] for g in grp):9.2f}  {statistics.mean(qa) if qa else float('nan'):7.2f}")
# FREQUENCIES qa_band.
labels = {1: "Fail", 2: "Pass", 3: "Excellent", None: "Missing"}
counts = {}
for r in rows:
    counts[r["qa_band"]] = counts.get(r["qa_band"], 0) + 1
for k in [1, 2, 3, None]:
    print(f"{labels[k]:10} {counts.get(k, 0)}")
```

### Quiz

1. What ends an SPSS command?
- [x] A period
- [ ] A semicolon
- [ ] A blank line
> Every command terminates with `.`; subcommands are introduced by `/`.

2. Which command removes cases only for the next procedure?
- [ ] `SELECT IF` on its own
- [x] `TEMPORARY.` followed by `SELECT IF`
- [ ] `SPLIT FILE`
> `TEMPORARY` makes the following transformations apply to one procedure only.

3. `RECODE score (LO THRU 89=1) (ELSE=2).` without `INTO`:
- [x] Overwrites `score`
- [ ] Creates a new variable named `score_1`
- [ ] Fails with an error
> Without `INTO newvar`, RECODE changes the variable in place.

4. Which feature exports a specific output table to Excel automatically?
- [ ] `SAVE OUTFILE`
- [x] `OMS`
- [ ] `DISPLAY DICTIONARY`
> The Output Management System routes selected tables to files.

### Exercises

1. **Import and label** — Write syntax to read `agents.csv` (columns agent_id, shift, score; header row) and label shift 1 = Day, 2 = Night.
<details><summary>Solution</summary>

```spss
GET DATA /TYPE=TXT /FILE='C:\Data\agents.csv'
  /DELIMITERS="," /FIRSTCASE=2
  /VARIABLES=agent_id A8 shift F1.0 score F5.1.
VALUE LABELS shift 1 'Day' 2 'Night'.
EXECUTE.
```

</details>

2. **Per-state descriptives** — Produce mean and SD of turnaround separately for each state, then turn the split off.
<details><summary>Solution</summary>

```spss
SORT CASES BY state.
SPLIT FILE LAYERED BY state.
DESCRIPTIVES VARIABLES=turnaround /STATISTICS=MEAN STDDEV.
SPLIT FILE OFF.
```

</details>

3. **Flag outliers** — Create `slow_flag` = 1 when turnaround exceeds 48 hours, else 0, and count them.
<details><summary>Solution</summary>

```spss
COMPUTE slow_flag = (turnaround > 48).
EXECUTE.
FREQUENCIES VARIABLES=slow_flag.
```

A logical expression in COMPUTE evaluates to 1 or 0.

</details>

### Interview Questions

**Q: Why use SPSS syntax instead of the menus?**
Reproducibility, speed and auditability. A weekly report that takes forty clicks becomes a syntax file I run in ten seconds, and next week's analyst can read exactly what was done. Syntax is also how you do things the dialogs cannot, such as `OMS` exports, loops with `DO REPEAT`, and conditional logic with `DO IF`. It doubles as documentation for a QA reviewer and can be versioned in Git. My workflow is to click through a dialog once, press Paste, then edit and keep the syntax; I never leave an analysis that exists only in the Viewer.

**Q: What is the difference between system-missing and user-missing values?**
System-missing is SPSS's own blank (shown as a dot) for numeric cells with no value or an impossible computation. User-missing is a real code I declare with `MISSING VALUES`, such as −9 for "not audited" or 99 for "refused", that should be excluded from statistics but still carries meaning I can tabulate. Both are excluded from means and tests by default, but `FREQUENCIES` shows user-missing categories separately so I can report how many files were not audited. Strings cannot be system-missing, only blank, so for string variables I declare the blank as user-missing explicitly. Getting this right is what stops −9 being averaged into a QA score.

**Q: How would you automate a weekly SPSS report?**
Keep a single `.sps` file that reads the week's CSV with `GET DATA`, applies the cleaning transformations, runs the descriptives, crosstabs and any tests, and uses `OMS` to write the tables to an XLSX, plus `SAVE` for the clean dataset. Parameterise the file name and week with `DEFINE` macros or the `INSERT` command, then run it unattended through the Production Facility or `stats.exe -f`. I add sanity checks at the top, such as `FREQUENCIES` on the state codes and a `SELECT IF` that fails loudly if the row count is zero, so a bad extract does not produce a plausible-looking empty report. The exported tables then feed a fixed Excel or Power BI template.

**Q: Explain SPLIT FILE and when it bites.**
`SPLIT FILE BY var` makes every subsequent procedure run once per group, either as separate output blocks (`SEPARATE`) or as a single table with group layers (`LAYERED`). The data must be sorted by the split variable first or groups will be fragmented. It bites when you forget `SPLIT FILE OFF`: every later analysis, including a regression that should use the whole file, silently runs per group, and the status bar's "Split File On" is easy to miss. I put `SPLIT FILE OFF.` immediately after the block that needs it and also at the top of every syntax file as a reset.

# LEVEL: Advanced

## Non-parametric tests

Parametric tests (t, ANOVA, Pearson) assume roughly normal sampling distributions and interval-scale data. When the data are ordinal, the sample is small and skewed, or outliers dominate, rank-based **non-parametric** tests give valid p-values with fewer assumptions. SPSS groups them under **Analyze → Nonparametric Tests**, with the classic dialogs under **Legacy Dialogs**.

### The parallel table

| Parametric test | Non-parametric equivalent | SPSS legacy syntax |
|---|---|---|
| One-sample t | Wilcoxon signed-rank vs a value; sign test | `NPTESTS /ONESAMPLE` |
| Independent-samples t | Mann-Whitney U (Wilcoxon rank-sum) | `NPAR TESTS /M-W=` |
| Paired-samples t | Wilcoxon signed-rank | `NPAR TESTS /WILCOXON=` |
| One-way ANOVA | Kruskal-Wallis H | `NPAR TESTS /K-W=` |
| Repeated-measures ANOVA | Friedman | `NPAR TESTS /FRIEDMAN=` |
| Pearson r | Spearman ρ / Kendall τ | `NONPAR CORR` |
| Chi-square goodness of fit | (already non-parametric) | `NPAR TESTS /CHISQUARE=` |

Rank tests compare distributions, usually summarised as medians or mean ranks, rather than means.

### Mann-Whitney U

Question: do satisfaction ratings (1–5) differ between clients served by two teams? Pool all ratings, rank them (ties get the average rank), sum the ranks per group. U = R₁ − n₁(n₁+1)/2, and the smaller U is compared to a table, or for n > 20 converted to z = (U − n₁n₂/2) / √(n₁n₂(n₁+n₂+1)/12).

```spss
NPAR TESTS /M-W=rating BY team(1 2)
  /STATISTICS=DESCRIPTIVES.
```

Output: Mean Rank per group, U, W, Z and Asymp. Sig. (2-tailed); for small samples an Exact Sig. line too. SPSS's modern **Independent Samples** dialog (`NPTESTS /INDEPENDENT TEST (rating) GROUP (team) MANN_WHITNEY`) shows the same result with a model viewer.

Effect size: `r = |z| / √N` (0.1 small, 0.3 medium, 0.5 large).

### Wilcoxon signed-rank

Paired ordinal data, or paired differences that are badly skewed: an agent's rating before and after coaching. Compute each difference, drop zeros, rank the absolute differences, sum the ranks of the positive and the negative differences. The smaller sum is T.

```spss
NPAR TESTS /WILCOXON=rating_before WITH rating_after (PAIRED).
```

The **sign test** (`/SIGN=`) uses only the direction of each difference, so it has less power but works when the differences are not even ordinal.

### Kruskal-Wallis and post-hoc

For three or more groups: `NPAR TESTS /K-W=turnaround BY team(1 4).` H is a chi-square-distributed statistic with k − 1 df. A significant H needs pairwise follow-up; the modern `NPTESTS` procedure produces Dunn-Bonferroni pairwise comparisons automatically (double-click the output to open the Model Viewer and choose Pairwise Comparisons).

### Chi-square goodness of fit

Tests whether observed category frequencies match expected proportions. Are defects spread evenly across five defect types?

```spss
NPAR TESTS /CHISQUARE=defect_type /EXPECTED=EQUAL.
NPAR TESTS /CHISQUARE=state /EXPECTED=0.45 0.35 0.20.
```

### When to prefer non-parametric

- Ordinal outcomes (Likert scales, grades, severity codes).
- Small samples (n < 15 per group) with visible skew or outliers.
- Data with floor or ceiling effects, such as QA scores bunched at 100.

And when not to: with large samples the CLT makes t-tests robust, and rank tests lose information, interpret less directly, and cannot easily include covariates. A common pragmatic route is to run both and report the parametric result if they agree.

> **Warning:** Mann-Whitney tests whether one distribution is stochastically larger, not strictly whether medians differ. If the two groups have different shapes, the medians can be equal and U still significant. Say "distributions differ" unless you have checked the shapes.

### Try It Yourself

```python
import math

def rank_all(values):
    order = sorted(range(len(values)), key=lambda i: values[i])
    r = [0.0] * len(values)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and values[order[j + 1]] == values[order[i]]:
            j += 1
        for k in range(i, j + 1):
            r[order[k]] = (i + j) / 2 + 1
        i = j + 1
    return r

def normal_two_sided_p(z):
    return 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))

# Mann-Whitney U: client satisfaction ratings (1-5) for two teams
team1 = [5, 4, 5, 3, 4, 5, 5, 4, 2, 5, 4, 5]
team2 = [3, 4, 2, 3, 3, 4, 2, 3, 1, 4, 3, 2]
n1, n2 = len(team1), len(team2)
ranks = rank_all(team1 + team2)
R1 = sum(ranks[:n1]); R2 = sum(ranks[n1:])
U1 = R1 - n1 * (n1 + 1) / 2
U2 = R2 - n2 * (n2 + 1) / 2
U = min(U1, U2)
mu = n1 * n2 / 2
sigma = math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12)   # without tie correction
z = (U - mu) / sigma
print(f"Mean rank team1 {R1/n1:.2f}, team2 {R2/n2:.2f}")
print(f"U = {U:.1f}, z = {z:.2f}, approx p = {normal_two_sided_p(z):.4f}, effect r = {abs(z)/math.sqrt(n1+n2):.2f}")

# Wilcoxon signed-rank: ratings before and after coaching (same 10 agents)
before = [3, 2, 4, 3, 2, 3, 4, 2, 3, 3]
after  = [4, 3, 4, 5, 3, 4, 4, 3, 5, 4]
diffs = [a - b for a, b in zip(after, before) if a != b]
absr = rank_all([abs(d) for d in diffs])
Wpos = sum(r for r, d in zip(absr, diffs) if d > 0)
Wneg = sum(r for r, d in zip(absr, diffs) if d < 0)
n = len(diffs)
T = min(Wpos, Wneg)
zw = (T - n * (n + 1) / 4) / math.sqrt(n * (n + 1) * (2 * n + 1) / 24)
print(f"Wilcoxon: n(non-zero)={n}, W+={Wpos}, W-={Wneg}, z = {zw:.2f}, approx p = {normal_two_sided_p(zw):.4f}")
```

### Quiz

1. Ordinal 1–5 ratings for two independent groups call for:
- [ ] Independent-samples t-test
- [x] Mann-Whitney U
- [ ] Wilcoxon signed-rank
> Two independent groups with ordinal data: Mann-Whitney.

2. The non-parametric equivalent of one-way ANOVA is:
- [ ] Friedman
- [x] Kruskal-Wallis
- [ ] Sign test
> Kruskal-Wallis compares k independent groups by ranks; Friedman is for repeated measures.

3. What does the effect size r = |z|/√N of 0.45 indicate?
- [ ] Negligible effect
- [x] Medium-to-large effect
- [ ] The test is invalid
> Cohen's guide for r: 0.1 small, 0.3 medium, 0.5 large.

4. A significant Mann-Whitney result strictly means:
- [ ] The medians differ
- [x] One distribution tends to produce larger values than the other
- [ ] The means differ
> Only when shapes are similar can you translate that into a difference of medians.

### Exercises

1. **Pick the test** — Five agents rated three document templates (1–10) each. Which test compares the templates?
<details><summary>Solution</summary>

Friedman test: three related measurements (templates) on the same agents, ordinal outcome. `NPAR TESTS /FRIEDMAN=tpl_a tpl_b tpl_c.`

</details>

2. **Goodness of fit** — Defects observed by type: A 40, B 30, C 20, D 10. Test H₀ "all types equally likely" by hand.
<details><summary>Solution</summary>

Expected 25 each. χ² = (15² + 5² + 5² + 15²)/25 = (225 + 25 + 25 + 225)/25 = 20, df = 3, critical 7.81, p < .001: the types are not equally likely.

</details>

3. **Report it** — Write one sentence reporting a Mann-Whitney result with U = 23, z = −2.61, p = .009, n = 24.
<details><summary>Solution</summary>

"Ratings were higher for Team 1 (mean rank 16.6) than Team 2 (mean rank 8.4), U = 23, z = −2.61, p = .009, r = 0.53."

</details>

### Interview Questions

**Q: When would you choose a non-parametric test, and what do you give up?**
I choose one when the outcome is ordinal, when the sample is small and clearly non-normal, or when a few outliers would otherwise dominate a mean-based test. What I give up is power when the parametric assumptions actually hold, the ability to state results in original units (a Mann-Whitney does not give "3.2 hours faster"), and easy adjustment for covariates. For a 1–5 client rating comparison between two teams I go straight to Mann-Whitney and report mean ranks and the effect size r. For turnaround hours on 2 000 files I use a t-test on the log, because with that n the CLT protects the t-test and the log fixes the skew.

**Q: How do the ranks in Mann-Whitney handle ties, and why does it matter?**
Tied values receive the average of the ranks they would have occupied; three files tied for ranks 4, 5 and 6 each get rank 5. Ties reduce the variance of the rank sum, so SPSS applies a tie correction to the denominator of z; with many ties, such as a 1–5 rating scale, the uncorrected formula gives a z that is slightly too small and a p that is too large. This is one reason to use the SPSS output rather than a hand calculation for Likert data, and one reason Kendall's tau-b, which is built around ties, is sometimes preferred for correlations on such scales.

**Q: Is a non-parametric test "assumption-free"?**
No. Mann-Whitney still assumes independent observations and that the two samples come from distributions of similar shape if you want to interpret the result as a difference in medians. Wilcoxon signed-rank assumes the distribution of differences is symmetric. Kruskal-Wallis assumes independent groups. What they drop is the normality assumption and the sensitivity to outliers. Calling them distribution-free refers to the null distribution of the statistic, not to the absence of any assumptions, and interviewers like candidates who make that distinction.

**Q: A colleague ran a t-test on a 1–5 satisfaction scale with n = 400 per group. Is that wrong?**
Not necessarily wrong, but it needs a caveat. With 400 per group the sampling distribution of the mean is very close to normal, so the p-value from the t-test is reliable, and the mean rating is a familiar summary. The issue is interpretation: a mean of 3.7 assumes the gaps between scale points are equal, which they may not be. I would run Mann-Whitney alongside; if both agree, report the means for readability and note the rank test confirmed it. If they disagree, look at the distributions, because that usually indicates a ceiling effect where one group is piled up at 5.

## Reliability and factor analysis (Cronbach's alpha)

Surveys and audit checklists measure things that cannot be observed directly: client satisfaction, agent engagement, document quality. A ten-item quality checklist is only useful if the items hang together (reliability) and if they measure the intended dimensions (validity, explored with factor analysis). This chapter covers both in SPSS.

### Reliability: Cronbach's alpha

Cronbach's alpha measures **internal consistency**: how strongly the items of a scale correlate with each other. With k items, item variances σᵢ² and total-score variance σ²ₜ:

`α = (k / (k − 1)) × (1 − Σσᵢ² / σ²ₜ)`

| α | Usual reading |
|---|---|
| ≥ 0.9 | Excellent (may indicate redundant items) |
| 0.8–0.9 | Good |
| 0.7–0.8 | Acceptable |
| < 0.7 | Questionable; revise items |

```spss
RELIABILITY
  /VARIABLES=q1 q2 q3 q4 q5 q6
  /SCALE('Client satisfaction') ALL
  /MODEL=ALPHA
  /STATISTICS=DESCRIPTIVE SCALE CORR
  /SUMMARY=TOTAL.
```

Menu: **Analyze → Scale → Reliability Analysis**, Statistics → Scale if item deleted, Inter-Item Correlations.

The key output is **Item-Total Statistics**:

- **Corrected Item-Total Correlation**: how well each item correlates with the sum of the others. Below 0.3 means the item is measuring something else.
- **Cronbach's Alpha if Item Deleted**: if removing an item raises α noticeably, the item is dragging the scale down.

Before running it, reverse-score negatively worded items (`RECODE q4 (1=5)(2=4)(3=3)(4=2)(5=1).`); otherwise they lower α artificially and show negative item-total correlations.

Alpha rises with the number of items even when the average inter-item correlation is modest, so a 20-item scale with α = 0.85 may be no more coherent than a 5-item scale with α = 0.75. Report the number of items and, ideally, the mean inter-item correlation (0.15–0.50 is the healthy range).

### Exploratory factor analysis (EFA)

EFA asks: how many underlying dimensions explain the correlations among the items? Twelve checklist items about a produced document might reduce to three factors: formatting, accuracy, completeness.

```spss
FACTOR
  /VARIABLES=q1 TO q12
  /MISSING LISTWISE
  /PRINT=INITIAL KMO EXTRACTION ROTATION
  /FORMAT=SORT BLANK(.30)
  /PLOT=EIGEN
  /CRITERIA=MINEIGEN(1) ITERATE(25)
  /EXTRACTION=PAF
  /ROTATION=VARIMAX.
```

Menu: **Analyze → Dimension Reduction → Factor**. Choices that matter:

| Decision | Options | Guidance |
|---|---|---|
| Extraction | Principal Components (PC), Principal Axis Factoring (PAF), Maximum Likelihood | PC for data reduction; PAF/ML for latent constructs |
| Number of factors | Eigenvalue > 1 (Kaiser), scree plot, parallel analysis | Kaiser over-extracts; look at the scree elbow and interpretability |
| Rotation | Varimax (orthogonal), Promax / Oblimin (oblique) | Oblique when factors are expected to correlate, which is usual |
| Suitability | KMO > 0.6, Bartlett's test p < .05 | Both printed with `/PRINT=KMO` |

Output to read: **KMO and Bartlett's Test**, **Total Variance Explained** (eigenvalues and cumulative %), **Rotated Factor Matrix** (loadings). A loading is the correlation between an item and a factor; `BLANK(.30)` hides trivial ones so the structure is easy to see. Items loading on two factors (cross-loadings > 0.3 on both) or on none are candidates for removal.

Sample size: at least 5–10 cases per item and preferably n > 200. The **Communalities** table shows the share of each item's variance explained by the retained factors; below 0.3 is poor.

### Factor scores and reliability per factor

After settling on factors, compute a scale score for each (`COMPUTE fmt = MEAN(q1,q2,q5,q7).`) and run RELIABILITY per subscale. `/SAVE REG` in FACTOR saves regression-based factor scores as new variables instead.

> **Tip:** PCA and factor analysis are not the same thing. PCA explains total variance and produces components that are exact linear combinations of the items; factor analysis explains shared variance with latent factors and treats the rest as error. Interviewers ask this; the SPSS default (Principal Components) is the one many people use without knowing the difference.

### Try It Yourself

```python
import statistics

# Six-item client satisfaction scale (1-5) for 12 clients; q4 is negatively worded
data = {
    "q1": [5, 4, 4, 5, 3, 4, 5, 2, 4, 5, 3, 4],
    "q2": [5, 4, 5, 4, 3, 4, 5, 2, 4, 4, 3, 5],
    "q3": [4, 4, 4, 5, 2, 3, 5, 3, 4, 5, 3, 4],
    "q4": [1, 2, 2, 1, 3, 2, 1, 4, 2, 1, 3, 2],   # reverse-scored below
    "q5": [5, 3, 4, 5, 3, 4, 4, 2, 3, 5, 2, 4],
    "q6": [3, 5, 2, 4, 4, 2, 3, 5, 3, 2, 4, 3],   # a poorly-fitting item
}
data["q4"] = [6 - v for v in data["q4"]]        # RECODE (1=5)(2=4)...(5=1)
items = list(data)
n = len(data["q1"])

def alpha(keys):
    k = len(keys)
    totals = [sum(data[q][i] for q in keys) for i in range(n)]
    item_var = sum(statistics.variance(data[q]) for q in keys)
    return k / (k - 1) * (1 - item_var / statistics.variance(totals))

def pearson(x, y):
    mx, my = statistics.mean(x), statistics.mean(y)
    num = sum((a - mx) * (b - my) for a, b in zip(x, y))
    den = (sum((a - mx) ** 2 for a in x) * sum((b - my) ** 2 for b in y)) ** 0.5
    return num / den

print(f"Cronbach's alpha (all 6 items): {alpha(items):.3f}")
print("item  corrected item-total r   alpha if deleted")
for q in items:
    rest = [k for k in items if k != q]
    rest_total = [sum(data[k][i] for k in rest) for i in range(n)]
    print(f"{q:4}  {pearson(data[q], rest_total):22.3f}   {alpha(rest):16.3f}")
```

### Quiz

1. Cronbach's alpha measures:
- [ ] Whether a scale measures what it claims to measure
- [x] Internal consistency of a set of items
- [ ] Test-retest stability
> Alpha is a reliability (consistency) coefficient, not a validity coefficient.

2. An item with corrected item-total correlation of 0.08 and "alpha if deleted" above the current alpha should be:
- [x] Removed or rewritten
- [ ] Kept because more items always help
- [ ] Reverse-scored
> It does not correlate with the rest of the scale and removing it improves consistency.

3. Which rotation allows factors to correlate?
- [ ] Varimax
- [x] Promax or Direct Oblimin
- [ ] Quartimax
> Varimax and Quartimax are orthogonal; Promax and Oblimin are oblique.

4. A KMO of 0.48 means:
- [ ] The data are ideal for factor analysis
- [x] The correlations are too weak or diffuse for factor analysis
- [ ] There are exactly two factors
> KMO below 0.5 is unacceptable; 0.6 is the usual minimum.

### Exercises

1. **Compute alpha** — Three items have variances 1.2, 1.0 and 1.4; the total-score variance is 8.1. Find α.
<details><summary>Solution</summary>

α = (3/2) × (1 − 3.6 / 8.1) = 1.5 × 0.5556 = 0.833.

</details>

2. **Reverse scoring** — Write the SPSS syntax to reverse a 1–7 item `q9` into `q9r`.
<details><summary>Solution</summary>

```spss
COMPUTE q9r = 8 - q9.
EXECUTE.
```

Equivalent to `RECODE q9 (1=7)(2=6)(3=5)(4=4)(5=3)(6=2)(7=1) INTO q9r.`

</details>

3. **Choose the number of factors** — Eigenvalues: 4.8, 2.1, 1.05, 0.7, 0.4. Kaiser says three; the scree plot bends after two. What do you do?
<details><summary>Solution</summary>

Run both two- and three-factor solutions and keep the one whose rotated loadings are interpretable and where the third factor has at least three items loading above 0.4. An eigenvalue of 1.05 is borderline and Kaiser's rule tends to over-extract; parallel analysis would settle it.

</details>

### Interview Questions

**Q: What is the difference between reliability and validity?**
Reliability is consistency: does the instrument give the same result on repeated use or across its items? Validity is accuracy: does it measure the construct it claims to? A scale can be reliable but not valid, like a QA checklist whose items all agree but actually measure formatting rather than accuracy. Cronbach's alpha, test-retest correlation and inter-rater agreement (Cohen's kappa for two QA checkers) are reliability evidence; content review, factor structure and correlation with an external criterion such as client complaints are validity evidence. Reliability caps validity, because a measure cannot correlate with anything more strongly than it correlates with itself.

**Q: What are the limitations of Cronbach's alpha?**
It assumes the items are tau-equivalent (each measures the construct with the same loading), which is rarely true; when it is violated alpha underestimates reliability, and McDonald's omega, available in SPSS 27+ under Reliability → Model, is better. Alpha also inflates with the number of items, so a long scale of weakly related items can reach 0.8. It is not a measure of unidimensionality: a scale with two distinct factors can still have high alpha. And it is sensitive to negatively worded items that were not reversed. I report alpha because reviewers expect it, but I always look at the item-total correlations and the factor structure before trusting it.

**Q: How would you build a document quality index from a 15-item audit checklist?**
First I would check item-level frequencies to drop items with no variance, such as one every file passes. Then an EFA with principal axis factoring and oblique rotation to see whether the items form interpretable dimensions like formatting, content accuracy and completeness. I would compute a subscale mean per dimension, check each subscale's alpha, and only then build a weighted index, with weights agreed with the QA lead rather than taken blindly from factor loadings. Finally I would validate the index against an external outcome, such as client rejections, and document the whole procedure in syntax so the index is reproducible month to month.

**Q: Explain eigenvalues and the scree plot in plain words.**
Each factor's eigenvalue is the amount of total item variance it accounts for, measured in "item units": an eigenvalue of 3 means the factor explains as much variance as three average items. The scree plot lists these values in descending order; the early factors explain a lot and then the curve flattens into rubble, the scree. Factors before the elbow carry structure, those after it carry noise. Kaiser's rule keeps eigenvalues above 1 because a factor explaining less than one item's worth is not summarising anything, but on large item sets it keeps too many, so I combine the scree plot with interpretability and, when I can, parallel analysis.

## Logistic regression

Many outcomes in production data are binary: did the file fail QA, was the invoice paid late, did the client leave a 5-star review. Linear regression on a 0/1 outcome produces predicted probabilities below 0 and above 1 and violates every assumption. **Binary logistic regression** models the probability directly through the logit link.

### The model

`logit(p) = ln(p / (1 − p)) = β₀ + β₁x₁ + … + βₖxₖ`

`p / (1 − p)` is the **odds**. A one-unit increase in xᵢ multiplies the odds by `exp(βᵢ)`, the **odds ratio (OR)**. To get a probability back: `p = 1 / (1 + e^−(β₀ + Σβᵢxᵢ))`.

| OR | Meaning |
|---|---|
| 1.0 | No effect |
| 1.5 | Odds are 50% higher per unit |
| 0.6 | Odds are 40% lower per unit |
| 2.0 | Odds double per unit |

Odds ratios are not risk ratios. If the base defect rate is 3%, an OR of 2 roughly doubles the risk (odds and probability are close for rare events). If the base rate is 50%, an OR of 2 moves the probability from 50% to 67%, not to 100%.

### Running it in SPSS

```spss
LOGISTIC REGRESSION VARIABLES has_defect
  /METHOD=ENTER pages_in_file is_commercial agent_experience_months state
  /CONTRAST (state)=Indicator(1)
  /PRINT=CI(95) GOODFIT ITER(1)
  /CLASSPLOT
  /CRITERIA=PIN(.05) POUT(.10) ITERATE(20) CUT(.5).
```

Menu: **Analyze → Regression → Binary Logistic**. Dependent = `has_defect` (coded 0/1; SPSS models the probability of the higher value). Put categorical predictors into **Categorical…** and choose the reference category (First or Last). Options: CI for exp(B), Hosmer-Lemeshow goodness of fit, classification cut-off.

### Reading the output

| Table | What to read |
|---|---|
| Omnibus Tests of Model Coefficients | Chi-square for the whole model versus intercept-only |
| Model Summary | −2 Log Likelihood, Cox & Snell R², Nagelkerke R² (pseudo-R²) |
| Hosmer and Lemeshow Test | p > .05 means no evidence of poor calibration |
| Classification Table | Overall % correct, sensitivity, specificity at the cut-off |
| Variables in the Equation | B, S.E., Wald, df, Sig., Exp(B) and its CI |

```text
Variables in the Equation
                          B      S.E.    Wald    df   Sig.   Exp(B)   95% CI
  pages_in_file        .021    .005    17.64    1   .000    1.021   1.011-1.031
  is_commercial(1)     .688    .241     8.15    1   .004    1.990   1.241-3.191
  experience_months   -.032    .009    12.64    1   .000     .969    .952-.986
  Constant           -3.912    .402    94.70    1   .000     .020
```

Read: each extra page raises the odds of a defect by 2.1%; commercial files have twice the odds of a defect; each month of agent experience lowers the odds by 3.1%. Because exp(B) for pages is per page, report it per 10 pages (1.021¹⁰ = 1.23) for readability.

### Classification, sensitivity and ROC

The default cut-off of 0.5 is wrong for rare events: with a 3% defect rate the model predicts "no defect" for everyone and scores 97% correct while catching nothing. Lower the cut-off (`CUT(.1)`) or, better, judge the model by the **ROC curve** (**Analyze → ROC Curve** on the saved predicted probabilities: `/SAVE PRED`). The area under the curve (AUC) summarises discrimination: 0.5 is chance, 0.7–0.8 acceptable, above 0.8 good.

### Assumptions and diagnostics

- Binary outcome with independent observations.
- Linearity in the logit for continuous predictors (Box-Tidwell test: add x × ln(x) terms and check they are non-significant).
- No severe multicollinearity (run the same predictors through linear REGRESSION with `/STATISTICS COLLIN` to get VIFs).
- Enough events: at least 10 events per predictor, so with 100 defects you can afford about 10 predictors.
- No **complete separation**: if a predictor perfectly predicts the outcome, coefficients blow up and SPSS warns about iterations not converging.

> **Interview note:** Be ready to translate an odds ratio into a probability change at a stated base rate. "OR = 2 at a 3% base rate: odds go from 0.031 to 0.062, probability from 3.0% to 5.8%."

### Beyond binary

**Multinomial Logistic** (`NOMREG`) handles unordered outcomes with three or more categories (defect type); **Ordinal** (`PLUM`) handles ordered ones (severity low/medium/high) with the proportional-odds assumption.

### Try It Yourself

```python
import math

# Logistic regression by Newton-Raphson (IRLS), no libraries: defect ~ pages + commercial
pages = [36, 44, 20, 56, 68, 24, 16, 16, 8, 56, 76, 44, 12, 36, 72, 76, 52, 40, 28, 20, 40, 32, 8, 88, 40, 40, 32, 28, 44, 44]
comm  = [1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1]
defect= [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1]
X = [[1.0, p / 10, c] for p, c in zip(pages, comm)]   # pages per 10 for readable OR
n, k = len(X), 3
beta = [0.0] * k

def solve(A, b):
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for i in range(k):
        piv = M[i][i]
        M[i] = [v / piv for v in M[i]]
        for r in range(k):
            if r != i:
                f = M[r][i]
                M[r] = [a - f * c for a, c in zip(M[r], M[i])]
    return [M[i][k] for i in range(k)]

for it in range(25):
    p = [1 / (1 + math.exp(-sum(b * x for b, x in zip(beta, row)))) for row in X]
    grad = [sum((defect[r] - p[r]) * X[r][j] for r in range(n)) for j in range(k)]
    H = [[sum(p[r] * (1 - p[r]) * X[r][i] * X[r][j] for r in range(n)) for j in range(k)] for i in range(k)]
    step = solve(H, grad)
    beta = [b + s for b, s in zip(beta, step)]
    if max(abs(s) for s in step) < 1e-8:
        break
ll = sum(d * math.log(pp) + (1 - d) * math.log(1 - pp) for d, pp in zip(defect, p))
names = ["Constant", "pages (per 10)", "commercial"]
print(f"Converged in {it+1} iterations, -2LL = {-2*ll:.2f}")
for nm, b in zip(names, beta):
    print(f"{nm:15} B = {b:7.3f}   Exp(B) = {math.exp(b):7.3f}")
p60 = 1 / (1 + math.exp(-(beta[0] + beta[1] * 6 + beta[2] * 1)))
print(f"P(defect | 60 pages, commercial) = {p60:.3f}")
```

### Quiz

1. Exp(B) = 1.99 for `is_commercial` means:
- [x] Commercial files have about twice the odds of a defect, other things equal
- [ ] Commercial files are 99% likely to have a defect
- [ ] The probability of a defect doubles for commercial files
> Exp(B) is an odds ratio; the probability change depends on the base rate.

2. With a 3% event rate, a classification table at cut-off 0.5 showing 97% correct tells you:
- [ ] The model is excellent
- [x] Almost nothing; the model may predict "no event" for everyone
- [ ] Sensitivity is 97%
> Accuracy equals the base rate when the model never predicts the event; use ROC/AUC instead.

3. Nagelkerke R² is:
- [ ] The share of variance explained, exactly as in OLS
- [x] A pseudo-R² that rescales likelihood improvement to a 0–1 range
- [ ] The AUC
> Pseudo-R² values are not variance explained and are typically lower than OLS R².

4. The rule of thumb for events per predictor is at least:
- [ ] 1
- [x] 10
- [ ] 100
> Fewer than 10 events per parameter gives unstable, biased coefficients.

### Exercises

1. **Probability from a logit** — B₀ = −3.9, B_pages = 0.021, B_comm = 0.69. Compute P(defect) for a 50-page commercial file.
<details><summary>Solution</summary>

logit = −3.9 + 0.021 × 50 + 0.69 = −2.16; p = 1 / (1 + e^2.16) = 1 / (1 + 8.67) = 0.103, about 10%.

</details>

2. **Reference category** — Write the LOGISTIC REGRESSION syntax with `state` (3 levels) as categorical with the last category as reference.
<details><summary>Solution</summary>

```spss
LOGISTIC REGRESSION VARIABLES has_defect
  /METHOD=ENTER pages_in_file state
  /CONTRAST (state)=Indicator
  /PRINT=CI(95).
```

`Indicator` defaults to the last category as reference; `Indicator(1)` uses the first.

</details>

3. **Separation** — SPSS warns "Estimation terminated at iteration 20 because maximum iterations reached" and one B is 21.4 with S.E. 4000. What happened?
<details><summary>Solution</summary>

Complete or quasi-complete separation: that predictor (or a category of it) perfectly predicts the outcome, so the MLE does not exist. Merge the category, drop the predictor, or use penalised (Firth) logistic regression, which SPSS lacks natively but R and Python offer.

</details>

### Interview Questions

**Q: Why not use linear regression for a binary outcome?**
Because the linear probability model gives predictions outside 0–1, has heteroskedastic errors by construction (variance p(1 − p) depends on x), and assumes a constant effect on probability, which cannot hold near the boundaries. Logistic regression models the log-odds, which is unbounded, so any linear combination maps to a valid probability through the sigmoid, and the effect on probability is naturally larger in the middle and smaller near 0 and 1. The linear probability model is still used in economics for its easy interpretation of marginal effects, with robust standard errors, but for prediction and for rare events like a 3% defect rate logistic is the right tool.

**Q: How would you evaluate whether a logistic model is good?**
On three axes. Discrimination: does it rank defective files above clean ones, measured by the AUC of the ROC curve on held-out data. Calibration: when it says 10%, do about 10% actually fail, checked with the Hosmer-Lemeshow test or a calibration plot of predicted deciles versus observed rates. Usefulness: at the cut-off the business will actually use, what are sensitivity, specificity and the number of files flagged per real defect caught. I distrust the overall % correct, and I distrust in-sample results, so I split the data or use cross-validation. A model with AUC 0.78 that flags 15% of files and catches 60% of defects is a concrete, decision-ready statement.

**Q: Explain the Wald test and its weakness.**
The Wald statistic for a coefficient is (B / S.E.)², which follows a chi-square with 1 df under H₀: β = 0; it is what SPSS prints in the Sig. column. Its weakness is that with large coefficients the standard error also inflates, so Wald can become non-significant precisely when the effect is huge, the Hauck-Donner effect. The likelihood-ratio test, comparing −2LL with and without the variable, is more reliable; in SPSS I get it by running the model with and without the predictor, or by using the Step statistics with a BACKWARD LR method. For categorical predictors with several dummies I always use the likelihood-ratio or the overall Wald for the factor, not the individual dummies.

**Q: What is the difference between odds ratio and relative risk, and when does it matter?**
Relative risk is the ratio of probabilities, P₁/P₀; the odds ratio is the ratio of odds, [P₁/(1−P₁)] / [P₀/(1−P₀)]. For rare outcomes the two are close, so an OR of 2 for a 3% defect rate is roughly a doubling of risk. For common outcomes the OR exaggerates: with a 40% base rate an OR of 2 corresponds to a relative risk of only 1.43. It matters when reporting to management, who will read "twice the odds" as "twice as likely"; I convert to predicted probabilities at representative values ("from 40% to 57%") for the report and keep the OR in the technical appendix. Logistic regression gives ORs because they are estimable in any sampling design; log-binomial or Poisson regression with robust errors gives relative risks directly.

## Introduction to EViews: workfiles, series and equations

EViews (Econometric Views) is the standard desktop package for time-series econometrics, used in central banks, ministries of finance and economics departments. Where SPSS thinks in cases and variables, EViews thinks in **workfiles**, **series** observed over a date range, and **equation objects** that hold estimated models. This chapter is your orientation.

### The workfile

A workfile is the container. Its **structure** defines the frequency and range of observations, and every series inside shares that structure.

| Structure | Example | Created with |
|---|---|---|
| Dated, regular frequency | Monthly 2015M01–2025M12, quarterly 2010Q1–2024Q4, annual, weekly, daily (5 or 7 day) | `wfcreate m 2015m01 2025m12` |
| Undated (cross-section) | 2 700 files, one row each | `wfcreate u 2700` |
| Panel | 50 states × 10 years | `wfcreate a 2015 2024` then `pagestruct` or import with cross-section id |

Menu: **File → New → Workfile**, choose frequency and dates. Everything you can click has a command equivalent typed in the command window at the top of the screen, and the command log can be saved as a **program** (`.prg`) and run with `run myprog.prg`.

```text
wfcreate(wf=production, page=monthly) m 2018m01 2025m12
import "C:\Data\monthly_volume.xlsx" range="Sheet1" colhead=1 names=(files, defects, staff) @freq m @date(date)
save "C:\Data\production.wf1"
```

Import is easiest with **File → Import → Import from file**, which reads Excel, CSV, Stata, SPSS `.sav` and text; check that the date column is recognised and the frequency matches the workfile.

### Series and the two default objects

Every workfile starts with `c` (the coefficient vector, filled after each estimation) and `resid` (residuals of the last equation). You create series with `genr` or `series`:

```text
series defect_rate = defects / files
series log_files = log(files)
series d_files = d(files)                ' first difference: files - files(-1)
series growth = @pch(files) * 100        ' percentage change
series files_l1 = files(-1)              ' one-period lag
series files_ma3 = @movav(files, 3)      ' 3-period moving average
genr trend = @trend                      ' 0,1,2,... time trend
```

Lags are written with `(-1)`, leads with `(1)`. Functions starting with `@` are built-ins: `@mean(files)`, `@stdev`, `@obs`, `@year`, `@month`, `@quarter`, `@seas(1)` for a January dummy, `@recode(condition, a, b)`.

Double-click a series to open it, then **View → Descriptive Statistics & Tests**, **View → Graph** (line, bar, histogram) or **View → Correlogram** (autocorrelations, essential later).

### The sample statement

`smpl` sets the observations used by every subsequent command:

```text
smpl 2018m01 2019m12          ' pre-pandemic training window
smpl @all                     ' back to the full range
smpl @first 2023m12           ' from start to Dec 2023
smpl if files > 0             ' conditional sample
smpl 2018m01 2025m12 if state = "TX"
```

Forgetting the current sample is the most common EViews mistake: an equation estimated on `2018m01 2019m12` silently stays on that window until you reset it.

### Groups and quick looks

A **group** is a bundle of series for joint viewing: `group g1 files defects staff`, then **View → Correlations**, **View → Graph → Multiple** or `show g1` for a spreadsheet view. `scat files defects` draws a scatterplot; `plot files defects` a line chart.

### Equation objects

An equation is estimated with `ls` (least squares) and stored by name:

```text
equation eq1.ls defect_rate c log_files staff
show eq1
eq1.fit fitted_rate          ' fitted values into a series
eq1.makeresids e1            ' residuals into a series
```

Menu: **Quick → Estimate Equation**, type the specification `defect_rate c log_files staff` (dependent variable first, `c` for the constant, regressors separated by spaces), choose method LS. The equation window has **View** (representations, actual-fitted-residual graph, coefficient tests, residual tests, stability tests) and **Proc** (forecast, make residual series). Every diagnostic in the next chapter lives under those two menus.

### Objects and saving

Objects in a workfile: series, groups, equations, graphs, tables, samples, models, programs. Right-click to rename, freeze (a graph or table becomes a static object), or copy to Word/Excel. `wfsave production.wf1` saves everything; export a series with `write(t=xlsx) out.xlsx files defects` or File → Export.

> **Tip:** Keep a `.prg` file with the import, the transformations and the estimation commands, and run it from the top when data are updated. It is the EViews equivalent of an SPSS syntax file and the only way to make a monthly forecast reproducible.

### Try It Yourself

```python
# EViews-style series operations on a monthly production series, in plain Python
import statistics
files = [820, 860, 905, 880, 940, 990, 1010, 970, 1020, 1080, 1120, 1090,
         1150, 1180, 1210, 1170, 1240, 1300, 1320, 1290, 1350, 1400, 1440, 1420]
months = [f"{2024 + (i // 12)}M{(i % 12) + 1:02d}" for i in range(len(files))]

def lag(s, k=1):            # files(-1)
    return [None] * k + s[:-k]
def diff(s):                # d(files)
    return [None] + [b - a for a, b in zip(s, s[1:])]
def pch(s):                 # @pch(files)
    return [None] + [(b - a) / a for a, b in zip(s, s[1:])]
def movav(s, w=3):          # @movav(files, 3)
    return [None] * (w - 1) + [statistics.mean(s[i - w + 1:i + 1]) for i in range(w - 1, len(s))]

d, g, ma = diff(files), pch(files), movav(files, 3)
print("obs      files  files(-1)  d(files)   @pch%   @movav3")
for i in range(len(files)):
    row = [months[i], files[i], lag(files)[i], d[i], None if g[i] is None else round(100 * g[i], 2), None if ma[i] is None else round(ma[i], 1)]
    print("  ".join(f"{'' if v is None else v:>8}" if not isinstance(v, str) else f"{v:8}" for v in row))
print("\n@mean(files) =", statistics.mean(files), " @obs(d(files)) =", sum(v is not None for v in d))
# smpl 2025m01 2025m12
sub = [v for m, v in zip(months, files) if m.startswith("2025")]
print("smpl 2025m01 2025m12 -> @mean(files) =", statistics.mean(sub))
```

### Quiz

1. In EViews, `files(-1)` refers to:
- [x] The value of files one period earlier
- [ ] The value one period later
- [ ] The first observation
> Negative numbers in parentheses are lags; positive are leads.

2. What does `smpl 2020m01 2022m12` do?
- [ ] Deletes all other observations
- [x] Restricts subsequent commands to that date range until changed
- [ ] Creates a new workfile page
> The sample is a global setting; `smpl @all` restores the full range.

3. Which object is automatically overwritten after every estimation?
- [ ] `trend`
- [x] `resid` and `c`
- [ ] `eq1`
> `c` holds the latest coefficients and `resid` the latest residuals.

4. In `ls defect_rate c log_files staff`, `c` stands for:
- [ ] The dependent variable
- [x] The constant (intercept)
- [ ] A categorical variable
> `c` is the coefficient vector object and, in a specification, the intercept.

### Exercises

1. **Create and populate** — Write the commands to create a quarterly workfile 2015Q1–2024Q4, import `gdp.xlsx`, and generate the log and growth rate of GDP.
<details><summary>Solution</summary>

```text
wfcreate q 2015q1 2024q4
import "C:\Data\gdp.xlsx" colhead=1 names=(gdp) @freq q @date(date)
series lgdp = log(gdp)
series ggdp = @pch(gdp) * 100
```

</details>

2. **Seasonal dummies** — Create dummies for Q1 to Q3 (Q4 as reference) in one line each.
<details><summary>Solution</summary>

```text
series q1 = @seas(1)
series q2 = @seas(2)
series q3 = @seas(3)
```

`@seas(n)` is 1 in season n and 0 otherwise; include only k − 1 of them with a constant.

</details>

3. **Estimate and store** — Estimate defect_rate on a constant, staff and a trend, save fitted values and residuals.
<details><summary>Solution</summary>

```text
equation eq_trend.ls defect_rate c staff @trend
eq_trend.fit fit_trend
eq_trend.makeresids res_trend
```

</details>

### Interview Questions

**Q: How does EViews differ from SPSS, and when do you pick each?**
SPSS is built around cross-sectional survey and business data: cases in rows, a rich set of descriptive, comparison and multivariate procedures, and a Viewer designed for report tables. EViews is built around time: workfiles carry a frequency, lags and differences are one keystroke, and its strengths are OLS with full diagnostic menus, unit-root and cointegration tests, ARIMA, VAR and forecasting. I use SPSS for surveys, QA audits and anything with Likert scales or factor analysis, and EViews for monthly volumes, prices, macro series and anything where autocorrelation and stationarity matter. Both are scriptable, and for heavy automation I move either one's output into Python.

**Q: What is the difference between `genr`, `series` and `frml` in EViews?**
`series x = expr` and `genr x = expr` both evaluate the expression once, over the current sample, and store numeric values; `genr` is the legacy spelling and `series` is preferred. `frml x = expr` creates an auto-updating series that re-evaluates whenever its inputs change, similar to an Excel formula cell. Auto-updating is handy for a defect rate that must always equal defects/files after each import, but it is slower and can surprise you when a source series is edited. In a program I use `series` for transformations and `frml` only for a few live ratios.

**Q: Why does the sample setting matter so much for time-series work?**
Because the sample determines which observations estimation, tests and forecasts use, and it persists silently. Standard practice is to estimate on a training window, say 2018m01 to 2023m12, then forecast over 2024m01 to 2024m12 and compare with actuals; if I forget to reset `smpl` before the next estimation, I have just estimated on the wrong period without any error message. Lags also interact with the sample: a regression with two lags on `smpl 2018m01 2025m12` actually starts in 2018m03 because the first two observations are lost, which EViews reports as "Sample (adjusted)". I put explicit `smpl` lines before every estimation in a program for this reason.

**Q: How would you set up a panel of 50 states over 10 years in EViews?**
Import a long-format file with a state identifier and a year column, then apply a panel structure: **Proc → Structure/Resize Current Page**, choose Dated Panel, set the cross-section ID to `state` and the date ID to `year`, or use `pagestruct(freq=a) state @date(year)`. EViews then understands `@expand(state)` for state dummies, fixed and random effects in the equation's Panel Options, and cross-section versus period lags. Before estimating I check that each state has the same date range (a balanced panel) with **View → Statistics by Classification**, and I keep the raw stacked data in a separate page so I can rebuild the panel if the import is corrected.

## OLS in EViews and diagnostics: heteroskedasticity, autocorrelation, multicollinearity

OLS is only "best linear unbiased" when the Gauss-Markov assumptions hold. In real economic and production data they routinely fail, and EViews puts the tests two clicks from the estimation window. This chapter walks through the output, the three classic problems, how to detect them and what to do.

### The estimation output

```text
Dependent Variable: DEFECT_RATE     Method: Least Squares     Sample: 2018M01 2025M12
Included observations: 96

Variable        Coefficient   Std. Error   t-Statistic   Prob.
C                  0.0412       0.0091        4.53        0.0000
LOG_FILES          0.0068       0.0021        3.24        0.0017
STAFF             -0.0009       0.0003       -3.00        0.0035

R-squared            0.412    Mean dependent var     0.033
Adjusted R-squared   0.399    S.D. dependent var     0.008
S.E. of regression   0.0062   Akaike info criterion -7.31
Sum squared resid    0.0036   Schwarz criterion     -7.23
Log likelihood     353.9      F-statistic           32.6
Durbin-Watson stat   0.84     Prob(F-statistic)      0.0000
```

Read: coefficients, standard errors, t and p (Prob.) per variable; R² and adjusted R²; the standard error of regression (residual SD); information criteria (AIC, SC) for comparing models, lower is better; the F-statistic for joint significance; and **Durbin-Watson**, which at 0.84 is already a warning.

### Assumptions in one table

| Assumption | Violation | Consequence | Test in EViews |
|---|---|---|---|
| Linear in parameters, correct specification | Omitted variable, wrong functional form | Biased coefficients | View → Stability → Ramsey RESET |
| E(ε) = 0, regressors exogenous | Endogeneity | Biased, inconsistent | Theory; instrumental variables (TSLS) |
| Constant error variance | Heteroskedasticity | SEs wrong, t-tests invalid | Residual → Heteroskedasticity Tests (Breusch-Pagan-Godfrey, White) |
| No autocorrelation of errors | Serial correlation | SEs wrong, R² inflated | Durbin-Watson; Residual → Serial Correlation LM (Breusch-Godfrey) |
| No perfect multicollinearity | Near-collinearity | Huge SEs, unstable signs | View → Coefficient Diagnostics → Variance Inflation Factors |
| Normal errors (for small-sample inference) | Fat tails, skew | t and F approximate | Residual → Histogram - Normality Test (Jarque-Bera) |

### Heteroskedasticity

The error variance changes with the level of a regressor: defect-rate noise is larger in low-volume months. OLS coefficients stay unbiased but the standard errors are wrong.

Detect: **View → Residual Diagnostics → Heteroskedasticity Tests**, choose Breusch-Pagan-Godfrey (regress squared residuals on the regressors) or White (adds squares and cross-products). Read `Prob. Chi-Square(df)` of the `Obs*R-squared` line; below 0.05 means heteroskedasticity.

Fix: re-estimate with **robust standard errors**: in the Estimate dialog, Options → Coefficient covariance matrix → **White** (or `HAC (Newey-West)` if autocorrelation is also present). Command: `equation eq1.ls(cov=white) defect_rate c log_files staff`. Alternatively model the variance (weighted LS, `ls(w=1/files)`) or transform the dependent variable with a log.

### Autocorrelation

Errors correlated across time: a shock in one month persists into the next. Almost universal in monthly data. OLS remains unbiased but SEs are understated, t-statistics inflated, and R² is misleading if the series trend.

Detect: Durbin-Watson ≈ 2 means no first-order autocorrelation; below about 1.5 positive, above 2.5 negative. DW is invalid when lagged dependent variables are regressors, so use the **Breusch-Godfrey Serial Correlation LM Test** (**View → Residual Diagnostics → Serial Correlation LM Test**, lags = 2 for monthly, 4 for quarterly) and the residual **correlogram** (Q-statistics).

Fix, in order of preference: respecify (add lags of the dependent variable or regressors, a trend, seasonal dummies; check stationarity, covered in the Expert level); use **HAC (Newey-West)** standard errors, `ls(cov=hac)`; or model the error explicitly with an AR term, `ls defect_rate c log_files staff ar(1)`.

### Multicollinearity

Regressors nearly linear combinations of each other: `staff` and `files` move together because staffing follows volume. Coefficients stay unbiased but standard errors balloon, signs flip when one observation changes, and the model may show a significant F with no significant t.

Detect: **View → Coefficient Diagnostics → Variance Inflation Factors**. Centered VIF above 10 (some say 5) is trouble. Also look at the regressor correlation matrix in a group.

Fix: drop or combine variables (use `files` per `staff`), use ratios or differences, gather more data, or accept it if the goal is prediction rather than interpreting individual coefficients. Ridge regression is not native to EViews.

### Specification and stability

**Ramsey RESET** (View → Stability Diagnostics) adds powers of the fitted values and tests them; significance suggests a missing non-linearity. The **Chow breakpoint test** checks whether coefficients changed at a date (a process change in 2022M03), and **CUSUM / CUSUM of squares** plots show instability over time.

> **Warning:** A high R² with DW near 0.3 in a regression of two trending series is the signature of a **spurious regression**. The fix is not robust standard errors; it is testing for unit roots and working in differences or a cointegrating framework, which is the subject of the next level.

### Try It Yourself

```python
import math, random
random.seed(3)
# Simulate 96 months of a defect-rate regression with autocorrelated AND heteroskedastic errors
n = 96
log_files = [math.log(800 + 6 * t + random.gauss(0, 40)) for t in range(n)]
staff = [20 + 0.05 * t + random.gauss(0, 1) for t in range(n)]
e, eps = [], 0.0
for t in range(n):
    eps = 0.7 * eps + random.gauss(0, 0.004) * (1 + 0.5 * (staff[t] > 22))   # AR(1) + variance shift
    e.append(eps)
y = [0.04 + 0.007 * lf - 0.001 * s + err for lf, s, err in zip(log_files, staff, e)]

# OLS via normal equations
X = [[1.0, lf, s] for lf, s in zip(log_files, staff)]
k = 3
XtX = [[sum(X[r][i] * X[r][j] for r in range(n)) for j in range(k)] for i in range(k)]
Xty = [sum(X[r][i] * y[r] for r in range(n)) for i in range(k)]
M = [row[:] + [Xty[i]] for i, row in enumerate(XtX)]
for i in range(k):
    piv = M[i][i]; M[i] = [v / piv for v in M[i]]
    for r in range(k):
        if r != i:
            f = M[r][i]; M[r] = [a - f * b for a, b in zip(M[r], M[i])]
beta = [M[i][k] for i in range(k)]
resid = [yy - sum(b * x for b, x in zip(beta, row)) for yy, row in zip(y, X)]
print("Coefficients:", [round(b, 4) for b in beta])

# Durbin-Watson
dw = sum((resid[t] - resid[t - 1]) ** 2 for t in range(1, n)) / sum(r * r for r in resid)
print(f"Durbin-Watson = {dw:.2f}  (2 = no autocorrelation)")

# Breusch-Pagan (regress squared residuals on regressors; LM = n * R^2)
r2 = [r * r for r in resid]
Xty2 = [sum(X[r][i] * r2[r] for r in range(n)) for i in range(k)]
M = [row[:] + [Xty2[i]] for i, row in enumerate(XtX)]
for i in range(k):
    piv = M[i][i]; M[i] = [v / piv for v in M[i]]
    for r in range(k):
        if r != i:
            f = M[r][i]; M[r] = [a - f * b for a, b in zip(M[r], M[i])]
g = [M[i][k] for i in range(k)]
fit2 = [sum(b * x for b, x in zip(g, row)) for row in X]
mean_r2 = sum(r2) / n
R2_aux = 1 - sum((a - f) ** 2 for a, f in zip(r2, fit2)) / sum((a - mean_r2) ** 2 for a in r2)
print(f"Breusch-Pagan LM = n*R2 = {n * R2_aux:.2f}, chi-square(2) critical 5.99")

# VIF between log_files and staff
mx, ms = sum(log_files) / n, sum(staff) / n
r = sum((a - mx) * (b - ms) for a, b in zip(log_files, staff)) / math.sqrt(sum((a - mx) ** 2 for a in log_files) * sum((b - ms) ** 2 for b in staff))
print(f"corr(log_files, staff) = {r:.3f}, VIF = {1 / (1 - r * r):.2f}")
```

### Quiz

1. Heteroskedasticity makes OLS coefficients:
- [ ] Biased
- [x] Unbiased but with incorrect standard errors
- [ ] Impossible to estimate
> Only the variance formula is wrong; use White or HAC standard errors.

2. Durbin-Watson = 0.84 suggests:
- [x] Positive first-order autocorrelation
- [ ] No autocorrelation
- [ ] Multicollinearity
> DW near 2 is clean; values well below 2 indicate positive serial correlation.

3. Which test should replace Durbin-Watson when a lagged dependent variable is a regressor?
- [ ] White test
- [x] Breusch-Godfrey serial correlation LM test
- [ ] Jarque-Bera
> DW is biased toward 2 in that case; the LM test is valid.

4. A VIF of 25 for `staff` means:
- [ ] Staff has a large effect
- [x] Staff is highly collinear with other regressors; its SE is inflated
- [ ] The residuals are heteroskedastic
> VIF = 1/(1 − R²ⱼ); 25 means 96% of staff's variance is explained by the other regressors.

### Exercises

1. **Robust SEs** — Write the EViews command to estimate `sales c price adv` with Newey-West standard errors.
<details><summary>Solution</summary>

```text
equation eq_sales.ls(cov=hac) sales c price adv
```

Or in the dialog: Options → Coefficient covariance → HAC (Newey-West).

</details>

2. **Diagnose** — Your regression has R² = 0.97, DW = 0.21, both series trend upward. Name the problem and the first thing you would do.
<details><summary>Solution</summary>

Likely a spurious regression between non-stationary series. First run ADF unit-root tests on each series; if both are I(1), test for cointegration or re-estimate in first differences.

</details>

3. **Read the test** — Breusch-Pagan-Godfrey output: Obs*R-squared = 11.4, Prob. Chi-Square(3) = 0.0097. Conclusion?
<details><summary>Solution</summary>

Reject homoskedasticity at the 1% level. Re-estimate with White standard errors or model the variance; coefficient estimates themselves remain unbiased.

</details>

### Interview Questions

**Q: What are the Gauss-Markov assumptions and what does each buy you?**
Linearity in parameters and correct specification give you a model that can be unbiased at all. Zero conditional mean of the errors (exogeneity) is what makes OLS unbiased and consistent; it fails with omitted variables, measurement error and simultaneity. Homoskedasticity and no autocorrelation together make OLS efficient, the BLUE result, and make the usual standard-error formula correct. No perfect multicollinearity is needed just to compute the estimates. Normality is not a Gauss-Markov assumption; it is added for exact small-sample t and F distributions, and with 96 observations the CLT makes it nearly irrelevant. In practice I care most about exogeneity, because robust standard errors can repair the variance assumptions but nothing in the output repairs bias.

**Q: Your monthly regression shows DW = 0.5. Walk me through what you do.**
First I look at the residual plot and correlogram to see whether the pattern is smooth persistence, seasonality (spikes at lag 12) or a level shift after a specific month. Then I ask whether the specification is wrong rather than the errors: a missing trend, missing seasonal dummies, a missing lag of the dependent variable, or non-stationary series often produce exactly this. If the series have unit roots I move to differences or an error-correction model. Only after respecifying do I run the Breusch-Godfrey test again and, if mild autocorrelation remains, use Newey-West HAC standard errors so the inference is valid. Adding `ar(1)` to soak up the autocorrelation is a last resort because it treats a symptom.

**Q: How do you distinguish a real relationship from a spurious regression?**
A spurious regression shows a high R², significant t-statistics and a very low Durbin-Watson between two series that are each non-stationary, typically both trending. The textbook rule of thumb is R² greater than DW as a red flag. The real test is to check stationarity with ADF tests; if both series are I(1), I regress the differences or, if theory suggests a long-run link, test for cointegration with the Engle-Granger residual test or Johansen. If the differenced regression shows nothing and the series are not cointegrated, the level relationship was an artefact of shared trends. Monthly file volume and monthly defect counts regressed in levels is a classic example from production reporting.

**Q: When is multicollinearity not a problem?**
When the goal is prediction rather than interpretation, because collinear regressors still produce accurate fitted values inside the range of the data even if the individual coefficients are unstable. It is also harmless when the collinear variables are control variables I do not intend to interpret; the coefficient of interest keeps its precision if it is not itself collinear with them. And polynomial or interaction terms are collinear with their components by construction, which centring reduces but which is expected. Multicollinearity is a problem when I need to say "staff, holding volume constant, does X", and the data barely contain variation in staff that is independent of volume; then no estimator can extract that information and the honest answer is more or different data.

# LEVEL: Expert

## Time series: stationarity and ADF unit-root tests

Time-series econometrics starts with one question: is the series **stationary**? Regression, correlation and forecasting theory all assume it, and most economic and production series are not. This chapter explains what stationarity means, why it matters, and how to test for it with the Augmented Dickey-Fuller test in EViews.

### What stationarity means

A series is (weakly) stationary if its mean, variance and autocovariances do not depend on time. Turnaround hours fluctuating around 22 with a stable spread is stationary. Cumulative files processed, a price index, or monthly volume growing 6% a year are not: the mean drifts.

| Type | Example | Fix |
|---|---|---|
| Trend-stationary | Stationary fluctuations around a deterministic trend | Include `@trend` in the regression, or detrend |
| Difference-stationary (unit root, I(1)) | Random walk with or without drift | First-difference: `d(y)` |
| I(2) | Price level whose inflation rate also has a unit root (rare) | Difference twice |

A **random walk** `yₜ = yₜ₋₁ + εₜ` has a unit root: the coefficient on the lag is exactly 1, shocks never die out, and the variance grows with t. A random walk with drift adds a constant. Two independent random walks regressed on each other give a significant t-statistic about 75% of the time, the **spurious regression** problem, so testing for unit roots is not optional.

### The correlogram as first look

Open the series, **View → Correlogram**. A stationary series has autocorrelations that die out quickly; a unit-root series shows autocorrelations starting near 1 and declining very slowly, with the partial autocorrelation having one big spike at lag 1. The Ljung-Box Q-statistics test whether autocorrelations up to lag k are jointly zero.

### The Augmented Dickey-Fuller test

The test regresses the change in y on its lagged level and lagged changes:

`Δyₜ = α + βt + γyₜ₋₁ + Σ δᵢΔyₜ₋ᵢ + εₜ`

H₀: γ = 0 (unit root, non-stationary). H₁: γ < 0 (stationary). The extra lagged differences "augment" the regression to soak up autocorrelation so εₜ is white noise. The t-statistic on γ does not follow a t-distribution under H₀; EViews uses MacKinnon critical values and reports them alongside a p-value.

```text
Null Hypothesis: LOG_FILES has a unit root
Exogenous: Constant, Linear Trend
Lag Length: 2 (Automatic - based on SIC, maxlag=11)

                                        t-Statistic   Prob.*
Augmented Dickey-Fuller test statistic    -1.874       0.6612
Test critical values:   1% level          -4.058
                        5% level          -3.458
                       10% level          -3.155
```

The statistic −1.87 is less negative than −3.46, so H₀ is not rejected: log files has a unit root. Repeat on the first difference; a statistic like −7.2 with p = 0.0000 confirms d(log_files) is stationary, so the series is I(1).

Menu: open the series, **View → Unit Root Tests → Standard Unit Root Test**. Choose: Test type (ADF), Test for unit root in Level / 1st difference, Include in test equation: Intercept, Trend and intercept, or None, and lag selection (automatic by SIC is the default). Command: `log_files.uroot(adf, trend, info=sic)` and `log_files.uroot(adf, dif=1, const)`.

### Choosing the deterministic terms

- Series that trends visibly: **Trend and intercept** in levels.
- Series that fluctuates around a non-zero mean: **Intercept**.
- Series already differenced and centred on zero: **None** or intercept.

Including a trend when there is none costs power; omitting one when there is makes the test biased toward finding a unit root. Look at the plot first. The lag length should be enough to whiten the residuals; too many lags also cost power, so let SIC choose and check the residual correlogram of the test equation.

### Other tests and the power problem

The ADF test has low power near the unit root: it often fails to reject when the series is stationary but persistent (AR coefficient 0.95). Confirm with **Phillips-Perron** (same H₀, non-parametric correction) and **KPSS**, whose null is the opposite (stationarity). If ADF fails to reject and KPSS rejects, the series is I(1) with confidence; if both fail to reject, the data are inconclusive and you need a longer sample.

### Cointegration in one paragraph

Two I(1) series are **cointegrated** if some linear combination is I(0), meaning they share a long-run equilibrium: file volume and staffing, or two title-premium indices. Then a levels regression is meaningful and its residuals are stationary (Engle-Granger: run ADF on the residuals with special critical values), and the dynamics are captured by an **error-correction model** `Δyₜ = α + λ(yₜ₋₁ − βxₜ₋₁) + … `. EViews: **Quick → Group Statistics → Johansen Cointegration Test**, or the ARDL bounds test in the equation dialog.

> **Interview note:** Be precise: a unit root means a shock has a permanent effect; stationarity means shocks fade. The ADF null is "unit root", so a large negative statistic rejects it. Candidates who get the direction wrong under pressure lose the question.

### Try It Yourself

```python
import random, math
random.seed(11)
n = 200
# Simulate a stationary AR(1) and a random walk, then run a Dickey-Fuller regression on each
def ar1(phi):
    y, s = [0.0], 0.0
    for _ in range(n - 1):
        s = phi * s + random.gauss(0, 1)
        y.append(s)
    return y
def acf(y, k):
    m = sum(y) / len(y)
    num = sum((y[t] - m) * (y[t - k] - m) for t in range(k, len(y)))
    return num / sum((v - m) ** 2 for v in y)

def df_stat(y):
    # Regress d(y) on constant and y(-1): t-statistic on y(-1) (no augmentation lags)
    dy = [y[t] - y[t - 1] for t in range(1, len(y))]
    lag = y[:-1]
    m_x, m_y = sum(lag) / len(lag), sum(dy) / len(dy)
    sxx = sum((x - m_x) ** 2 for x in lag)
    gamma = sum((x - m_x) * (d - m_y) for x, d in zip(lag, dy)) / sxx
    alpha = m_y - gamma * m_x
    resid = [d - alpha - gamma * x for x, d in zip(lag, dy)]
    s2 = sum(r * r for r in resid) / (len(dy) - 2)
    return gamma, gamma / math.sqrt(s2 / sxx)

for name, y in [("AR(1) phi=0.6", ar1(0.6)), ("AR(1) phi=0.95", ar1(0.95)), ("Random walk", ar1(1.0))]:
    g, t = df_stat(y)
    print(f"{name:16} acf(1)={acf(y,1):.2f} acf(10)={acf(y,10):.2f}  gamma={g:.3f}  DF t={t:.2f}  ->",
          "reject unit root (5% cv -2.88)" if t < -2.88 else "cannot reject unit root")
rw = ar1(1.0)
d_rw = [rw[t] - rw[t - 1] for t in range(1, n)]
print(f"First difference of random walk: DF t = {df_stat(d_rw)[1]:.2f}")
```

### Quiz

1. The null hypothesis of the ADF test is:
- [x] The series has a unit root (non-stationary)
- [ ] The series is stationary
- [ ] The series has no trend
> ADF's null is non-stationarity; KPSS reverses it.

2. ADF statistic −2.1 with 5% critical value −3.46. Conclusion:
- [ ] Reject the unit root; the series is stationary
- [x] Fail to reject; treat the series as non-stationary
- [ ] The test is invalid
> The statistic must be more negative than the critical value to reject.

3. A series is I(1) if:
- [ ] It is stationary in levels
- [x] Its first difference is stationary
- [ ] It must be differenced twice
> I(d) means d differences are needed to reach stationarity.

4. Two I(1) series are cointegrated when:
- [x] A linear combination of them is stationary
- [ ] Both have the same trend slope
- [ ] Their correlation is above 0.9
> Cointegration means a stable long-run relationship despite each series wandering.

### Exercises

1. **Command line** — Write the EViews commands to test `cpi` for a unit root in levels (trend and intercept, SIC lags) and in first differences (intercept).
<details><summary>Solution</summary>

```text
cpi.uroot(adf, trend, info=sic)
cpi.uroot(adf, dif=1, const, info=sic)
```

</details>

2. **Interpret** — KPSS rejects stationarity at 5%; ADF fails to reject a unit root. What do you conclude?
<details><summary>Solution</summary>

The two tests agree: the series is non-stationary (I(1) if its difference passes). Difference it or model it in a cointegrating framework.

</details>

3. **Spurious check** — Regression of monthly volume on monthly defects in levels gives R² = 0.93, DW = 0.3. Outline a three-step plan.
<details><summary>Solution</summary>

(1) ADF on each series in levels and differences to establish integration order. (2) If both I(1), Engle-Granger or Johansen cointegration test. (3) If cointegrated, estimate an error-correction model; if not, regress in first differences and interpret short-run effects only.

</details>

### Interview Questions

**Q: Explain a unit root to someone who knows regression but not time series.**
Write the series as a regression on its own past: yₜ = ρyₜ₋₁ + εₜ. If ρ is below 1, any shock fades geometrically and the series keeps returning to its mean, which is stationarity. If ρ equals 1, the series is a random walk: every shock is permanent, the best forecast of next month is this month, and the variance grows without limit. A unit root is exactly ρ = 1. The trouble is that ordinary t-tests on ρ are invalid at that boundary, which is why Dickey and Fuller derived special critical values, and why we test γ = ρ − 1 = 0 in the differenced form. Monthly production volume with steady growth behaves like a random walk with drift, and the cure is to model the monthly change rather than the level.

**Q: Why does the ADF test include lagged differences and how many should you use?**
The basic Dickey-Fuller regression assumes the error is white noise; if the series has richer dynamics, such as an AR(3) structure, the residuals are autocorrelated and the test size is wrong. Adding lagged differences of y absorbs that autocorrelation so the remaining error is white, which is the "augmented" part. Too few lags leave autocorrelation and distort the test; too many waste degrees of freedom and reduce power. EViews picks the number automatically by SIC or AIC up to a maximum of about 12(T/100)^0.25; I accept that default, check the residual correlogram of the test regression, and try one or two alternatives to make sure the conclusion is not sensitive to the choice.

**Q: How do you decide between differencing and detrending?**
By testing which kind of non-stationarity is present. If the ADF test with a trend rejects the unit root, the series is trend-stationary and I detrend, either by regressing on time or by including @trend in the model; differencing such a series over-differences it and introduces a moving-average unit root in the errors. If the ADF test fails to reject, the series is difference-stationary and detrending leaves a random walk in the residuals; I difference. Economic series like GDP or a price index are usually I(1), while a ratio such as the defect rate or capacity utilisation is often stationary around a mean. When the tests disagree, I report results both ways and note the sensitivity.

**Q: What is the practical consequence of ignoring non-stationarity in a business report?**
Confident nonsense. Regressing two trending series produces a high R² and tiny p-values that describe nothing but their shared growth; you might conclude that increasing marketing spend raises defect counts because both grew. Forecast intervals from a levels model on a random walk are also badly understated, so a management report shows a narrow band around a forecast that has no basis. Correlations between levels of volume, revenue and headcount across years will all be above 0.9 regardless of any causal link. The defence is routine: plot the series, run ADF, work in differences or growth rates, and report relationships as "a 10% rise in volume is associated with a 0.4-point rise in the defect rate in the same month", which is a statement about changes, not levels.

## ARIMA and forecasting in EViews

Once you know a series' integration order you can build an **ARIMA** model, the workhorse of univariate forecasting: it predicts a series from its own past values and past shocks. This chapter covers the Box-Jenkins procedure (identify, estimate, check, forecast) and how EViews implements each step.

### The building blocks

| Component | Equation | Signature |
|---|---|---|
| AR(p) | yₜ = c + φ₁yₜ₋₁ + … + φₚyₜ₋ₚ + εₜ | ACF decays gradually; PACF cuts off after lag p |
| MA(q) | yₜ = c + εₜ + θ₁εₜ₋₁ + … + θ_qεₜ₋_q | ACF cuts off after lag q; PACF decays |
| I(d) | Difference d times first | Needed when ADF finds a unit root |
| ARIMA(p,d,q) | AR and MA applied to the d-th difference | Mixed patterns |
| SARIMA(p,d,q)(P,D,Q)ₛ | Adds seasonal AR/MA at lag s (12 for monthly) | Spikes at lags 12, 24 in the ACF |

### Step 1: identify

Establish d with the ADF test (previous chapter). Then look at the correlogram of the differenced series: **View → Correlogram** on `d(log_files)`. Read the ACF and PACF bars against the dashed significance bands (±2/√T). A spike at lag 12 says seasonal differencing or a seasonal term is needed.

### Step 2: estimate

In EViews the ARIMA specification goes in the `ls` command with `ar()` and `ma()` terms, and differencing with `d()`:

```text
equation arima1.ls d(log_files) c ar(1) ma(1)
equation sarima1.ls d(log_files,1,12) c ar(1) sar(12) ma(1) sma(12)
```

`d(x,1,12)` takes the first difference and the seasonal (12th) difference. `sar(12)` and `sma(12)` are seasonal AR and MA terms. EViews 9+ also has **Quick → Estimate Equation → Method: ARMA** with maximum likelihood (`ARMA` method, `ls` uses conditional least squares by default), and **Proc → Automatic ARIMA Forecasting** which searches p, q, P, Q by information criterion.

Output to read: the coefficients on `AR(1)`, `MA(1)` and their p-values; **Inverted AR Roots** and **Inverted MA Roots** must be inside the unit circle (modulus < 1) for stationarity and invertibility; and AIC / SIC for comparing candidate models.

### Step 3: check

**View → Residual Diagnostics → Correlogram - Q-statistics**: all residual autocorrelations should be inside the bands and the Ljung-Box Q p-values above 0.05, which means the model has extracted all the linear structure. Also check the residual histogram and Jarque-Bera. If lag-12 autocorrelation remains, add seasonal terms. If two models both pass, prefer the one with lower SIC (parsimony).

### Step 4: forecast

Estimate on a training sample, then forecast the hold-out:

```text
smpl 2018m01 2024m12
equation arima1.ls d(log_files) c ar(1) ma(1)
smpl 2025m01 2025m12
arima1.forecast(e) log_files_f log_files_se
smpl @all
plot log_files log_files_f
```

Menu: in the equation window click **Forecast**, choose the series to forecast (EViews offers `log_files`, undoing the difference automatically), the forecast sample, and **Dynamic** versus **Static**:

- **Dynamic**: multi-step, uses its own previous forecasts; what you need for a real 12-month-ahead forecast.
- **Static**: one-step-ahead, uses actual lagged values; measures how well the model tracks.

The forecast window prints **RMSE, MAE, MAPE** and the **Theil inequality coefficient** with its bias, variance and covariance proportions (you want most of it in covariance). Standard-error series `log_files_se` gives the interval: forecast ± 1.96 × se, widening with horizon for ARIMA models with d ≥ 1.

### Comparing to a naive benchmark

Always compare with the naive forecast (last value, or last year's same month for seasonal data). A model that cannot beat "same as last month" on RMSE is not worth its complexity. For monthly production volume, seasonal naive is a surprisingly strong baseline.

### Beyond ARIMA

Exponential smoothing (**Proc → Exponential Smoothing**, Holt-Winters additive or multiplicative) is simpler and often as accurate for short horizons. ARIMAX / regression with ARMA errors adds explanatory variables (`ls log_files c staff ar(1)`). VAR models forecast several series jointly. For daily data with multiple seasonalities, EViews is not the best tool; Python's `statsmodels` or Prophet are.

> **Tip:** Forecast the log of a positive, growing series and exponentiate the result; the intervals become asymmetric and cannot go negative, and the model captures proportional rather than absolute growth. Remember the bias correction `exp(f + se²/2)` for the mean if it matters.

### Try It Yourself

```python
import random, math
random.seed(19)
# Fit AR(1) to the first difference of a simulated monthly log-volume series, forecast 12 months, compare to naive
n = 84
y = [math.log(800)]
eps_prev = 0.0
for t in range(1, n):
    shock = random.gauss(0, 0.03)
    y.append(y[-1] + 0.006 + 0.5 * (y[-1] - y[-2] - 0.006 if t > 1 else 0) + shock)
train, test = y[:72], y[72:]
dy = [train[t] - train[t - 1] for t in range(1, len(train))]
# AR(1) on dy: dy_t = c + phi * dy_{t-1}
x, z = dy[:-1], dy[1:]
mx, mz = sum(x) / len(x), sum(z) / len(z)
phi = sum((a - mx) * (b - mz) for a, b in zip(x, z)) / sum((a - mx) ** 2 for a in x)
c = mz - phi * mx
resid = [b - c - phi * a for a, b in zip(x, z)]
sigma = math.sqrt(sum(r * r for r in resid) / (len(resid) - 2))
print(f"d(y) = {c:.4f} + {phi:.3f} d(y)(-1),  sigma = {sigma:.4f}")
# Dynamic forecast (ARIMA(1,1,0))
level, last_d = train[-1], dy[-1]
fc = []
for h in range(12):
    last_d = c + phi * last_d
    level += last_d
    fc.append(level)
naive = [train[-1] + (h + 1) * (sum(dy) / len(dy)) for h in range(12)]   # drift forecast
def rmse(a, b): return math.sqrt(sum((p - q) ** 2 for p, q in zip(a, b)) / len(a))
def mape(a, b): return 100 * sum(abs((p - q) / q) for p, q in zip(a, b)) / len(a)
print(f"ARIMA(1,1,0): RMSE(log) {rmse(fc, test):.4f}, MAPE on volumes {mape([math.exp(v) for v in fc], [math.exp(v) for v in test]):.2f}%")
print(f"Drift naive : RMSE(log) {rmse(naive, test):.4f}, MAPE on volumes {mape([math.exp(v) for v in naive], [math.exp(v) for v in test]):.2f}%")
print("h  actual   forecast   95% interval (volumes)")
for h in range(12):
    se = sigma * math.sqrt(sum(((1 - phi ** (j + 1)) / (1 - phi)) ** 2 for j in range(h + 1)))
    print(f"{h+1:2} {math.exp(test[h]):7.0f}  {math.exp(fc[h]):8.0f}   [{math.exp(fc[h]-1.96*se):.0f}, {math.exp(fc[h]+1.96*se):.0f}]")
```

### Quiz

1. An ACF that cuts off after lag 2 with a slowly decaying PACF suggests:
- [ ] AR(2)
- [x] MA(2)
- [ ] A unit root
> MA(q) processes have ACFs that cut off at q; AR processes have PACFs that cut off.

2. "Inverted AR Roots .98" in EViews output warns that:
- [x] The AR part is close to non-stationary; the series may need differencing
- [ ] The model is perfect
- [ ] The MA part is invertible
> A root near 1 means near-unit-root behaviour; reconsider d.

3. For a genuine 6-month-ahead forecast you use:
- [ ] Static forecast
- [x] Dynamic forecast
- [ ] In-sample fit
> Dynamic forecasts feed their own predictions forward; static uses actual lags, which you will not have.

4. Residual Ljung-Box Q p-values all above 0.05 mean:
- [x] No remaining autocorrelation; the model captured the linear dynamics
- [ ] The forecast is unbiased
- [ ] The model is over-fitted
> White-noise residuals are the adequacy check in Box-Jenkins.

### Exercises

1. **Specify** — Monthly data, ADF says I(1), seasonal spikes at lags 12 and 24 in the ACF of the differenced series. Write a plausible EViews specification.
<details><summary>Solution</summary>

```text
equation sarima1.ls d(log_files,1,12) c ar(1) sar(12) ma(1) sma(12)
```

Or with automatic search: **Proc → Automatic ARIMA Forecasting** with seasonal differencing allowed, choosing by SIC.

</details>

2. **Evaluate** — Model A: RMSE 41, MAPE 3.2%, SIC −7.1. Model B: RMSE 44, MAPE 3.4%, SIC −7.3. Which do you choose and why?
<details><summary>Solution</summary>

It depends on the goal. For forecasting, out-of-sample RMSE/MAPE matters most, so Model A. SIC favours B for parsimony in-sample. If the difference in RMSE is within noise across several hold-out windows, prefer the simpler B; otherwise A.

</details>

3. **Undo the log** — A forecast of log volume is 7.20 with SE 0.05. Give the point forecast and 95% interval in files.
<details><summary>Solution</summary>

Point (median): e^7.20 ≈ 1 339 files. Interval: e^(7.20 ± 0.098) = 1 214 to 1 477. Mean-corrected point: e^(7.20 + 0.00125) ≈ 1 341.

</details>

### Interview Questions

**Q: Walk me through building a forecast for monthly file volume.**
I start by plotting the series and its log, and running ADF in levels and differences to find d; monthly volume with growth is typically I(1) in logs. I inspect the correlogram of d(log volume) for AR and MA signatures and for seasonal spikes at lag 12, then estimate two or three candidate ARIMA or SARIMA models, keeping the ones whose residuals pass the Ljung-Box test and whose roots are inside the unit circle. I hold out the last 12 months, produce dynamic forecasts from each candidate and from a seasonal naive benchmark, and compare RMSE and MAPE. The winner is re-estimated on the full sample to forecast the next 12 months with intervals, which I present in original units with the interval drawn as a band and the assumptions stated, especially that no structural change is expected.

**Q: Why does the forecast interval widen with the horizon, and does it always?**
Because uncertainty accumulates: a one-step forecast is wrong by one shock, a two-step forecast by that shock plus the next, propagated through the model dynamics. For a stationary ARMA model the variance converges to the unconditional variance of the series, so the interval widens and then flattens; for an integrated model (d ≥ 1) it grows without bound, roughly with the square root of the horizon for a random walk. Interviewers sometimes ask why a stationary model's interval stops widening: because far enough ahead the best forecast is just the mean and the uncertainty is the series' own variance. Intervals from EViews also ignore parameter uncertainty, so they are somewhat too narrow in small samples.

**Q: When would you prefer exponential smoothing to ARIMA?**
When the series is short, the goal is a quick short-horizon operational forecast, or the audience needs something explainable. Holt-Winters handles trend and seasonality with three intuitive smoothing parameters and often matches ARIMA accuracy on monthly business series a few months out. ARIMA is better when I need to include explanatory variables, model complex autocorrelation, or produce statistically grounded intervals, and when I have at least five or six years of monthly data. In practice I run both and the seasonal naive, and let a rolling hold-out decide; being able to show that comparison is worth more than any single model's sophistication.

**Q: How do you detect over-fitting in a time-series model?**
The signs are an in-sample fit that is much better than the hold-out fit, many insignificant AR and MA terms that individually seem to help the AIC, roots near the unit circle or AR and MA roots that nearly cancel each other, and forecasts that change dramatically when one more month of data arrives. My defences are to prefer SIC over AIC for model selection, to use rolling-origin evaluation rather than a single hold-out, to compare against the naive benchmark, and to keep the model as simple as the residual diagnostics allow. In production reporting, a model that is re-fitted monthly and drifts in specification every time is a warning that the dynamics are not stable enough for the model to be trusted.

## Panel data and dummy variables

A **panel** (longitudinal data) observes the same units repeatedly: 50 states over 10 years, 20 agents over 52 weeks, 6 underwriters over 36 months. Panels let you control for everything that is constant within a unit, even things you never measured, which is the closest observational data gets to an experiment. Dummy variables are the mechanism, so this chapter starts there.

### Dummy variables

A dummy is a 0/1 variable that marks membership: `commercial = 1`, `post_policy = 1` for months after March 2022, `q1 = 1` in the first quarter. Rules:

- For a categorical variable with k levels, include k − 1 dummies plus a constant; including all k causes the **dummy variable trap** (perfect multicollinearity with the intercept).
- The omitted level is the **reference**; each coefficient is the difference from it.
- An **interaction** `dummy × x` lets the slope differ between groups.

```text
' EViews: state dummies, a policy-change dummy, and an interaction
series post = @date >= @dateval("2022/03")            ' 1 from March 2022 onward
series tx = (state = "TX")                              ' comparison returns 1 or 0
equation eq_dum.ls defect_rate c @expand(state, @dropfirst) post post*log_files log_files
```

`@expand(state, @dropfirst)` creates the full set of state dummies minus the first level, which is the fastest way to add fixed effects in a small panel. In SPSS: `UNIANOVA defect_rate BY state WITH log_files` handles the dummies automatically, or `RECODE` to build them for `REGRESSION`.

### Difference-in-differences with dummies

The classic policy evaluation: some units get a treatment at a date, others do not.

`yᵢₜ = β₀ + β₁ treatᵢ + β₂ postₜ + β₃ (treatᵢ × postₜ) + εᵢₜ`

β₃ is the treatment effect: the change in treated units minus the change in control units. If a new QA checklist was rolled out to the Texas team in March 2022 and the Florida team kept the old process, `treat = tx`, `post` as above, and β₃ on `tx*post` is the checklist's effect on the defect rate, assuming parallel trends before the rollout.

### Panel structure in EViews

Set the structure (**Proc → Structure/Resize Current Page → Dated Panel**, cross-section id `state`, date id `month`). Then **Quick → Estimate Equation**, and the **Panel Options** tab offers:

| Estimator | What it does | When |
|---|---|---|
| Pooled OLS | Ignores the panel; one intercept | Only if units are truly homogeneous |
| Fixed effects (cross-section) | A separate intercept per unit (within estimator) | Unit-level unobservables correlate with regressors; the usual choice |
| Random effects | Unit intercepts as random draws; GLS | Unobservables uncorrelated with regressors; more efficient |
| Period fixed effects | Intercept per time period | Common shocks (a market-wide slowdown) |
| Two-way fixed effects | Both | Standard for difference-in-differences |

Command form: `equation panel1.ls(cx=f, per=f, cov=cxwhite) defect_rate c log_files staff` estimates two-way fixed effects with standard errors clustered by cross-section (`cov=cxwhite`, "White cross-section"). Clustered SEs matter because observations within a state are correlated over time.

### Fixed or random? The Hausman test

**View → Fixed/Random Effects Testing → Correlated Random Effects – Hausman Test** after estimating random effects. H₀: random effects is consistent (no correlation between unit effects and regressors). A small p-value rejects random effects; use fixed effects. In practice, for economic panels fixed effects win almost always; random effects is chosen when the regressors of interest do not vary within units (a state's land area), because fixed effects cannot estimate time-invariant variables at all.

### Redundant fixed effects test

**View → Fixed/Random Effects Testing → Redundant Fixed Effects – Likelihood Ratio** tests whether the unit intercepts are all equal, i.e. whether pooled OLS would do. Rejection confirms unit heterogeneity.

### Within and between variation

Fixed effects use only **within** variation: how a state's defect rate moves when its own staffing moves. Variables that barely change within units (a team's location, an underwriter's founding year) are poorly identified. Check with **View → Statistics by Classification** or by computing the within-unit standard deviation of each regressor before you interpret a small, insignificant coefficient as "no effect".

> **Warning:** Adding a lagged dependent variable to a fixed-effects model produces the Nickell bias in short panels (T small). With 36 months it is modest; with 5 years it is not. Arellano-Bond GMM (**Method: GMM / Dynamic Panel** in EViews) is the standard fix.

### Panel diagnostics

Serial correlation within units (Wooldridge-type test, or inspect residual correlograms per unit), cross-sectional dependence (Pesaran CD test under **View → Residual Diagnostics → Cross-section Dependence Test**), and heteroskedasticity across units (use `cov=cxwhite` or period SUR weights). Panel unit-root tests (Levin-Lin-Chu, Im-Pesaran-Shin) live under the series' **View → Unit Root Tests** when the page is a panel.

### Try It Yourself

```python
# Difference-in-differences and fixed effects "by hand": 2 teams x 8 months, checklist rolled out to TX in month 5
import statistics
months = list(range(1, 9))
tx = {1: 3.6, 2: 3.5, 3: 3.7, 4: 3.6, 5: 2.9, 6: 2.8, 7: 2.7, 8: 2.8}   # defect rate %, treated from month 5
fl = {1: 3.0, 2: 3.1, 3: 3.0, 4: 3.2, 5: 3.1, 6: 3.2, 7: 3.1, 8: 3.2}   # control
pre, post = [1, 2, 3, 4], [5, 6, 7, 8]
did = (statistics.mean(tx[m] for m in post) - statistics.mean(tx[m] for m in pre)) \
    - (statistics.mean(fl[m] for m in post) - statistics.mean(fl[m] for m in pre))
print(f"TX change: {statistics.mean(tx[m] for m in post) - statistics.mean(tx[m] for m in pre):+.2f} pts")
print(f"FL change: {statistics.mean(fl[m] for m in post) - statistics.mean(fl[m] for m in pre):+.2f} pts")
print(f"Difference-in-differences estimate of the checklist effect: {did:+.2f} points")

# The same via OLS with dummies: y = b0 + b1*treat + b2*post + b3*treat*post
rows = [(1, int(m >= 5), tx[m]) for m in months] + [(0, int(m >= 5), fl[m]) for m in months]
X = [[1, t, p, t * p] for t, p, _ in rows]; y = [v for *_, v in rows]
k, n = 4, len(rows)
A = [[sum(X[r][i] * X[r][j] for r in range(n)) for j in range(k)] + [sum(X[r][i] * y[r] for r in range(n))] for i in range(k)]
for i in range(k):
    piv = A[i][i]; A[i] = [v / piv for v in A[i]]
    for r in range(k):
        if r != i:
            f = A[r][i]; A[r] = [a - f * b for a, b in zip(A[r], A[i])]
b = [A[i][k] for i in range(k)]
print(f"OLS: const {b[0]:.2f}, treat {b[1]:+.2f}, post {b[2]:+.2f}, treat*post {b[3]:+.2f}  (matches DiD)")

# Within transformation (fixed effects): demean by team, then regress on demeaned post
for name, d in [("TX", tx), ("FL", fl)]:
    m = statistics.mean(d.values())
    print(f"{name} team effect (mean) = {m:.2f}; within-team deviations:", [round(d[mm] - m, 2) for mm in months])
```

### Quiz

1. A categorical variable with 6 states enters a regression with a constant using:
- [ ] 6 dummies
- [x] 5 dummies
- [ ] 1 dummy coded 1–6
> Six dummies plus a constant are perfectly collinear: the dummy variable trap.

2. In a difference-in-differences model, the treatment effect is the coefficient on:
- [ ] `treat`
- [ ] `post`
- [x] `treat × post`
> The interaction captures the extra change in the treated group after treatment.

3. The Hausman test rejects H₀. You should use:
- [x] Fixed effects
- [ ] Random effects
- [ ] Pooled OLS
> Rejection means unit effects correlate with regressors, so random effects is inconsistent.

4. Fixed effects cannot estimate the effect of:
- [ ] Variables that vary over time within units
- [x] Variables that are constant within each unit
- [ ] Interactions
> The within transformation removes everything constant within a unit, including such regressors.

### Exercises

1. **Write the spec** — Two-way fixed effects of `qa_score` on `experience` and `caseload` across agents and weeks, with clustered SEs, in EViews.
<details><summary>Solution</summary>

```text
equation fe2.ls(cx=f, per=f, cov=cxwhite) qa_score c experience caseload
```

</details>

2. **Interpret a DiD** — treat×post = −0.71, SE 0.22. Write the sentence.
<details><summary>Solution</summary>

"After the checklist rollout, the treated team's defect rate fell by 0.71 percentage points more than the control team's (SE 0.22, p ≈ .001), our estimate of the checklist's causal effect under the parallel-trends assumption."

</details>

3. **Parallel trends** — How would you check the key DiD assumption?
<details><summary>Solution</summary>

Plot both groups' outcome over the pre-period and confirm they move together; formally, regress the outcome on treat × (pre-period month dummies) and test that those interactions are jointly zero (an event-study plot). If pre-trends differ, DiD is not credible.

</details>

### Interview Questions

**Q: Explain fixed effects to a manager.**
Every team has a permanent personality: some are naturally slower because of the kind of files they get, others faster because of tenure. If I compare teams to each other I mix up the effect of staffing with those personalities. Fixed effects compare each team only to itself over time: when Team A's staffing goes up, does Team A's turnaround go down? Everything about a team that does not change is removed automatically, so I do not need to have measured it. The cost is that I cannot say anything about things that never change within a team, and I need enough movement over time within teams to learn from.

**Q: What is the difference between fixed and random effects, and how do you choose?**
Both allow each unit its own intercept. Fixed effects treat the intercepts as parameters to estimate, which is robust to any correlation between the unit effect and the regressors but uses only within-unit variation. Random effects treat them as random draws from a distribution and use both within and between variation, which is more efficient, but consistent only if the unit effects are uncorrelated with the regressors, an assumption that fails whenever unobserved unit characteristics drive both the regressor and the outcome. I run the Hausman test, but the decision is mostly theoretical: for teams, states or firms in an observational setting I default to fixed effects, and I only use random effects when the regressor of interest is time-invariant or the units are a genuine random sample from a large population, such as survey respondents.

**Q: A colleague included all 12 monthly dummies and a constant, and EViews dropped one. What happened and does it matter?**
The twelve dummies sum to one in every observation, which is identical to the constant, so the design matrix is singular; EViews (and SPSS) drop one column automatically or report a near-singular matrix. It does not change the fitted values, but it changes the interpretation: the dropped month becomes the reference and each coefficient is a difference from it, which may not be the month the colleague intended. The clean approach is to drop the reference deliberately, say December, with `@expand(@month, @droplast)`, so the coefficients read as "January is 0.3 points above December". Alternatively drop the constant and keep all twelve, in which case each coefficient is that month's level.

**Q: How do clustered standard errors differ from robust standard errors, and when do you cluster?**
White (robust) standard errors allow each observation its own error variance but still assume errors are independent across observations. Clustered standard errors additionally allow arbitrary correlation among errors within a cluster, such as all months belonging to the same state, which is almost always present in panels because unit-level shocks persist. Ignoring within-cluster correlation understates standard errors, sometimes by a factor of two or three, so "significant" results evaporate once clustered. I cluster at the level at which treatment or the unit effect operates, typically the cross-section, and I want at least 30 to 50 clusters for the asymptotics to be reliable; with 6 underwriters clustered SEs are unreliable and I would use a wild cluster bootstrap or report the limitation.

## Interpreting and reporting results: APA tables and economic interpretation

An analysis is only as good as the paragraph and table that report it. Two audiences matter: academic or technical readers who expect **APA-style** reporting (the American Psychological Association format used across social science and most business research), and managers who want the **economic interpretation**: what changed, by how much, and what to do. This chapter gives templates for both.

### APA reporting sentences

| Analysis | Template |
|---|---|
| Descriptives | Turnaround averaged 22.4 h (*SD* = 6.1, *n* = 400). |
| Independent t | Day shift (*M* = 94.1, *SD* = 2.8) scored higher than night shift (*M* = 91.6, *SD* = 3.1), *t*(58) = 3.21, *p* = .002, *d* = 0.85, 95% CI [0.9, 4.1]. |
| Paired t | Scores rose from *M* = 88.4 to *M* = 91.1 after training, *t*(11) = 5.62, *p* < .001, *d* = 1.62. |
| Chi-square | Defect status was associated with state, χ²(2, *N* = 2700) = 8.05, *p* = .018, Cramér's *V* = .055. |
| One-way ANOVA | Turnaround differed by team, *F*(3, 28) = 9.87, *p* < .001, η² = .51; Tukey tests showed Team B slower than Teams A and C (*p* < .01). |
| Correlation | Pages and turnaround were strongly correlated, *r*(13) = .95, *p* < .001. |
| Regression | Pages predicted turnaround, *b* = 0.41, *SE* = 0.03, β = .91, *t*(13) = 14.71, *p* < .001; the model explained 83% of variance, *F*(1, 13) = 216.4, *p* < .001, adj. *R*² = .83. |
| Logistic | Commercial files had higher odds of a defect, *OR* = 1.99, 95% CI [1.24, 3.19], *p* = .004. |

Conventions: statistics in italics, two decimals for statistics, three for *p* with no leading zero, exact *p* unless below .001, degrees of freedom in parentheses, effect size and CI always. Never write "*p* = .000" or "highly significant".

### The APA regression table

```text
Table 2
Regression of Turnaround Hours on File Characteristics (N = 400)

Predictor                B       SE B     beta       t        p      95% CI for B
Constant               6.21     0.81               7.65   < .001   [4.62, 7.80]
Pages                  0.41     0.03     .68     14.71   < .001   [0.36, 0.47]
Commercial (1 = yes)   5.80     1.83     .19      3.17     .002   [2.20, 9.40]
Experience (months)   -0.09     0.02    -.16     -4.12   < .001   [-0.13, -0.05]

R^2 = .83, adjusted R^2 = .83, F(3, 396) = 641.2, p < .001.
Note. Reference category for Commercial is residential.
```

Build it in SPSS by pivoting the Coefficients table (double-click, Pivot → Pivoting Trays) or with `OMS` to Excel, then format in Word with a **table style** from a `.dotx` template: no vertical rules, horizontal rules only above and below the header and at the bottom. In EViews, **Freeze** the equation output, then **Proc → Make Table** or copy to Excel.

### Economic interpretation

Coefficients must be turned into statements in the units the reader thinks in.

| Model form | Coefficient means |
|---|---|
| y on x (levels) | One more unit of x → b more units of y |
| ln y on x | One more unit of x → 100 × b % change in y (exactly (e^b − 1) × 100 %) |
| y on ln x | 1% more x → b/100 more units of y |
| ln y on ln x (elasticity) | 1% more x → b % more y |
| y on dummy | The group is b units above the reference |
| ln y on dummy | The group is (e^b − 1) × 100 % above the reference |

Example: in `ln(turnaround) = … + 0.32 × commercial`, commercial files take (e^0.32 − 1) = 38% longer, not 32%. An elasticity of 0.85 for pages means a 10% longer document takes about 8.5% longer to produce: returns to scale in production, a point worth making to a manager who prices per page.

### From statistic to decision

A results paragraph for management has four moves:

1. **Finding in plain units**: "Night shift takes 2.3 hours longer per file."
2. **Confidence**: "95% CI 0.9 to 3.7 hours; consistent across all 12 weeks."
3. **Materiality**: "That is 9% of average turnaround and about 240 agent-hours per month."
4. **Action or caveat**: "Recommend reviewing night-shift file allocation; the difference is not explained by file size or state mix, which the model controls for."

Add a **limitations** line: observational data, unmeasured confounders, the period covered, and what would strengthen the conclusion.

### Charts that report statistics honestly

- Error bars show 95% CIs, and the caption says so; SE bars look tighter and mislead.
- Bar charts of means start at zero; line charts of indices may not, but say so.
- For regression, show the scatter with the fitted line and the CI band, not just the line.
- For forecasts, draw the interval band and mark where the data end.

> **Interview note:** Reporting questions are usually "here is an output table, explain it to me". Practise reading a Coefficients table aloud in one breath: variable, direction, size in units, significance, effect size, caveat. Fluency here signals real experience more than any formula.

### Try It Yourself

```python
import math
# Turn regression output into APA text and economic interpretations automatically
coefs = [
    # name, B, SE, beta, form ("level", "log_y", "log_x", "log_log", "dummy", "log_y_dummy")
    ("pages", 0.412, 0.028, 0.68, "level"),
    ("commercial", 0.32, 0.09, 0.19, "log_y_dummy"),
    ("ln_pages", 0.85, 0.05, 0.71, "log_log"),
    ("experience", -0.09, 0.022, -0.16, "level"),
]
df_resid = 396

def t_p(t, df):
    # two-sided p from a normal approximation for large df
    z = abs(t)
    return 2 * (1 - 0.5 * (1 + math.erf(z / math.sqrt(2))))

def fmt_p(p):
    return "< .001" if p < 0.001 else f"= {p:.3f}".replace("0.", ".")

for name, B, SE, beta, form in coefs:
    t = B / SE
    p = t_p(t, df_resid)
    lo, hi = B - 1.96 * SE, B + 1.96 * SE
    apa = f"b = {B:.2f}, SE = {SE:.2f}, beta = {beta:.2f}, t({df_resid}) = {t:.2f}, p {fmt_p(p)}, 95% CI [{lo:.2f}, {hi:.2f}]"
    if form == "level":
        econ = f"one more unit of {name} changes the outcome by {B:+.2f} units"
    elif form == "log_y_dummy":
        econ = f"{name} = 1 is {(math.exp(B) - 1) * 100:+.1f}% versus the reference group"
    elif form == "log_log":
        econ = f"a 1% rise in {name[3:]} is associated with a {B:+.2f}% change in the outcome (elasticity)"
    print(f"{name:11} APA: {apa}\n            Economic: {econ}\n")
```

### Quiz

1. APA format for a p-value of 0.0004 is:
- [ ] *p* = .000
- [x] *p* < .001
- [ ] *p* = 0.0004
> Report exact p to three decimals, except below .001.

2. In `ln(y) = … + 0.25 × dummy`, the group effect is:
- [ ] 25% higher
- [x] About 28% higher (e^0.25 − 1)
- [ ] 0.25 units higher
> Exponentiate a log-outcome coefficient to get a percentage; 0.25 is only an approximation.

3. A coefficient of 0.85 in a log-log model is:
- [x] An elasticity: a 1% change in x gives a 0.85% change in y
- [ ] 85% of variance explained
- [ ] A probability
> Log-log coefficients are elasticities.

4. Which is required in an APA t-test sentence?
- [ ] Only the p-value
- [x] The statistic, df, p, effect size and, ideally, the CI
- [ ] The raw data
> APA 7 expects effect sizes and confidence intervals, not just significance.

### Exercises

1. **Write it** — Chi-square = 12.4, df = 3, N = 1 800, p = .006, Cramér's V = .083. Write the APA sentence.
<details><summary>Solution</summary>

"Defect type was associated with state, χ²(3, *N* = 1800) = 12.40, *p* = .006, Cramér's *V* = .08, a small effect."

</details>

2. **Interpret** — `ln(volume)` on `ln(staff)` gives 0.62 (SE 0.08). Explain to operations.
<details><summary>Solution</summary>

"A 10% increase in staff is associated with about a 6.2% increase in volume (95% CI 4.6% to 7.8%). Returns to additional staff are diminishing: doubling staff would not double output, so the constraint is probably elsewhere in the process."

</details>

3. **Fix the sentence** — "The result was highly significant (p = .000), proving that training causes better scores." List the problems.
<details><summary>Solution</summary>

(1) "p = .000" should be "p < .001". (2) "Highly significant" is discouraged; report the effect size. (3) "Proving" and "causes" overstate an observational result; say "associated with" unless the design was experimental. (4) No effect size, CI or n.

</details>

### Interview Questions

**Q: Read this output to me: B = 0.41, SE = 0.03, Beta = .68, Sig. = .000 for pages predicting turnaround.**
Each additional page adds 0.41 hours, about 25 minutes, to turnaround, holding the other predictors constant; the standard error of 0.03 gives a 95% interval of roughly 0.35 to 0.47 hours, and the t-statistic near 14 means the estimate is very precise, with p below .001. The standardised Beta of .68 says pages is the dominant predictor in the model, a one-SD increase in pages moving turnaround by 0.68 SD. For a report I would restate it per 10 pages, 4.1 hours, and add the caveat that this is an average over the range observed, so it should not be extrapolated to an 800-page handbook if the sample topped out at 150 pages.

**Q: How do you present statistical results to a non-technical management audience?**
Lead with the decision-relevant finding in plain units, then the confidence in one clause, then the action. One chart with confidence bands rather than a table of p-values; effect sizes translated into hours, dollars or percentage points; and every number tied to a business threshold that was agreed in advance. I keep the statistical detail in an appendix table in APA format so a technical reviewer can audit it, and I state limitations honestly but briefly, such as "observational data, six months, controls for file size and state". The worst presentations I have seen were SPSS Viewer tables pasted into slides; the best were a single sentence, a single chart and a single recommendation with the evidence behind it available on request.

**Q: What are the most common misinterpretations you correct in others' reports?**
Treating a non-significant result as proof of no effect, usually with a tiny sample. Reporting percentage changes directly from log-model coefficients without exponentiating, which is fine at 0.05 and wrong at 0.5. Confusing odds ratios with relative risks in front of managers. Quoting R² as if it measured the model's correctness, and comparing R² across models with different dependent variables. Drawing causal conclusions from cross-sectional correlations, especially when a confounder such as file complexity is obvious. And finally, error bars that are standard errors presented as if they were confidence intervals, which makes groups look more different than they are.

**Q: How would you structure the results section of an econometric report on the drivers of turnaround?**
Descriptive statistics table first, with means, SDs and n per group, and a correlation matrix. Then the main regression table in APA format with nested specifications side by side: baseline, plus controls, plus fixed effects, so the reader sees how the coefficient of interest moves. Diagnostics next, briefly: heteroskedasticity and autocorrelation tests, the standard-error correction used, VIFs. Then robustness: alternative functional form, excluding outliers, a different sample window. A single figure showing the key relationship with its confidence band. Finally an interpretation section that converts coefficients into operational magnitudes and states what the analysis cannot claim. The narrative order matters as much as the tables: each table should answer a question the previous one raised.

## Statistics and econometrics interview questions

Interviews for analyst, reporting and economics roles probe three things: whether you can pick the right method, whether you understand what its output really means, and whether you have used it on messy real data. This chapter organises the questions that recur, gives the structure of a strong answer, and includes a practice set with model answers. Treat it as a revision map for the whole course.

### How the questions are asked

| Format | Example | What they are checking |
|---|---|---|
| Method choice | "Two groups, ordinal outcome, which test?" | You know the decision tree |
| Output reading | "Here is an SPSS Coefficients table, talk me through it" | Interpretation and units |
| Concept in plain words | "Explain a confidence interval to a client" | Real understanding, communication |
| Trap questions | "p = .06, so there is no effect?" | You know the common fallacies |
| Experience | "Tell me about an analysis that changed a decision" | You have done this for real |
| Whiteboard | "Derive the OLS slope" or "write the DiD equation" | Technical depth |

### The method decision tree

1. What type is the outcome? Continuous → means; ordinal → ranks; categorical → counts; binary → logistic.
2. How many groups, and are they independent or paired?
3. Is there a time dimension? Then stationarity first, then dynamics.
4. Are there covariates to control for? Regression, not a bare test.
5. Is the question causal? Then design (experiment, DiD, panel fixed effects) matters more than the test.

```text
Continuous outcome
  1 group vs value ............ one-sample t
  2 independent groups ........ independent t (Welch) / Mann-Whitney
  2 paired measurements ....... paired t / Wilcoxon
  3+ groups ................... one-way ANOVA / Kruskal-Wallis
  continuous predictor(s) ..... correlation, linear regression
Categorical outcome
  2 categorical variables ..... chi-square / Fisher
  binary with predictors ...... logistic regression
Time series
  single series forecast ...... ARIMA / exponential smoothing
  relationship in levels ...... unit roots -> differences or cointegration
Panel
  units over time ............. fixed effects, DiD, clustered SEs
```

### Answer structure that works

State the method, the assumption that matters most, the output statistic you would read, how you would report it in units, and one thing that could go wrong. Forty seconds. Then stop and let the interviewer dig.

> **Tip:** Bring one story per family: a t-test that mattered (shift comparison), a regression that mattered (turnaround drivers), a time-series that mattered (volume forecast), and a QA-audit sample-size calculation. Real numbers, real decisions, and what you would do differently.

### Practice set with model answers

**Q: What is the difference between a population and a sample, and why does it matter for a QA audit?** The population is every file produced in the period; the sample is the subset audited. Inference from sample to population is only valid if the sample is random or stratified, and its precision depends on n, not on the population size. A 400-file random audit estimates a 3% defect rate to within about ±1.7 points.

**Q: Explain Type I and Type II errors with a production example.** Type I: concluding a new checklist reduced defects when it did not, leading to a costly rollout. Type II: missing a real improvement and shelving a good idea. α controls the first, power controls the second; small pilots have plenty of the second.

**Q: A regression coefficient is significant but the sign is opposite to theory. What do you do?** Suspect omitted-variable bias, multicollinearity, a coding error, or reverse causality, in that order. Check the raw correlation, add plausible confounders, check VIFs, verify the variable's coding and units, and think about the data-generating process before reporting anything.

**Q: What is endogeneity and how is it fixed?** Correlation between a regressor and the error term, from omitted variables, measurement error or simultaneity, which biases OLS. Fixes: add the omitted variable, use panel fixed effects, use an instrumental variable (TSLS in EViews) that affects the regressor but not the outcome directly, or exploit a natural experiment with DiD.

**Q: Explain R² versus adjusted R² versus AIC.** R² is the share of variance explained and rises with any added regressor; adjusted R² penalises the count of regressors; AIC and SIC penalise it more formally on the likelihood scale and are used to compare non-nested and time-series models, lower being better. None of them says whether the model is causally right.

**Q: What is heteroskedasticity and does it bias coefficients?** Non-constant error variance. It does not bias OLS coefficients; it invalidates the usual standard errors. Detect with Breusch-Pagan or White; fix with robust (White) standard errors or by modelling the variance.

**Q: Why would you log-transform a variable?** To turn multiplicative relationships into additive ones so coefficients become percentages or elasticities, to reduce right skew and heteroskedasticity, and to keep predictions positive. Costs: zeros and negatives cannot be logged, and the retransformation to levels needs a bias correction.

**Q: What is the difference between forecasting and explaining?** A forecasting model is judged on out-of-sample accuracy and may use variables with no causal meaning; an explanatory model is judged on unbiased, interpretable coefficients and needs a causal design. Stepwise regression is acceptable for the first and dangerous for the second.

### Try It Yourself

```python
# Interview self-test: a decision-tree function plus a scored drill.
def choose_test(outcome, groups=None, paired=False, time_series=False, covariates=False, panel=False):
    if panel:
        return "panel regression with fixed effects (and DiD if there is a treatment), clustered SEs"
    if time_series:
        return "check stationarity (ADF); ARIMA for forecasting, differences/cointegration for relationships"
    if covariates:
        return {"continuous": "multiple linear regression", "binary": "logistic regression",
                "ordinal": "ordinal logistic regression", "categorical": "multinomial logistic"}[outcome]
    if outcome == "categorical" or outcome == "binary":
        return "chi-square test of independence (Fisher's exact if expected counts < 5)"
    if outcome == "ordinal":
        return {1: "Wilcoxon signed-rank vs a value", 2: "Wilcoxon signed-rank" if paired else "Mann-Whitney U"}.get(groups, "Friedman" if paired else "Kruskal-Wallis")
    if outcome == "continuous":
        return {1: "one-sample t-test", 2: "paired t-test" if paired else "independent t-test (Welch)"}.get(groups, "repeated-measures ANOVA" if paired else "one-way ANOVA + post-hoc")
    return "clarify the outcome type"

drill = [
    (dict(outcome="continuous", groups=2), "independent t-test (Welch)"),
    (dict(outcome="ordinal", groups=2, paired=True), "Wilcoxon signed-rank"),
    (dict(outcome="binary", covariates=True), "logistic regression"),
    (dict(outcome="continuous", groups=4), "one-way ANOVA + post-hoc"),
    (dict(outcome="continuous", time_series=True), "check stationarity (ADF); ARIMA for forecasting, differences/cointegration for relationships"),
    (dict(outcome="categorical", groups=3), "chi-square test of independence (Fisher's exact if expected counts < 5)"),
]
score = 0
for args, expected in drill:
    got = choose_test(**args)
    ok = got == expected
    score += ok
    print(("PASS " if ok else "FAIL ") + str(args) + " -> " + got)
print(f"\nScore: {score}/{len(drill)}")
```

### Quiz

1. Two independent groups, a 1–5 rating outcome. Best test:
- [ ] Independent t-test
- [x] Mann-Whitney U
- [ ] Chi-square goodness of fit
> Ordinal outcome, two independent groups: rank-based comparison.

2. "The result was not significant, so the intervention has no effect." The flaw is:
- [x] Absence of evidence is not evidence of absence; power may be low
- [ ] p-values cannot be used for interventions
- [ ] The test should have been one-sided
> A non-significant test with low power says little either way.

3. Heteroskedasticity in OLS causes:
- [ ] Biased coefficients
- [x] Invalid standard errors
- [ ] Non-stationarity
> Coefficients stay unbiased; inference needs robust SEs.

4. Before regressing two monthly economic series on each other you should:
- [ ] Standardise them
- [x] Test each for a unit root
- [ ] Remove the constant
> Non-stationary series produce spurious regressions.

5. Which design gives the most credible causal estimate from observational data?
- [ ] Cross-sectional regression with many controls
- [x] Difference-in-differences with parallel pre-trends
- [ ] Correlation with a large n
> DiD removes time-invariant differences and common shocks, given parallel trends.

### Exercises

1. **Sixty-second answer** — Write your spoken answer to "How would you test whether a new template reduced production time?" in under 120 words.
<details><summary>Solution</summary>

"I would compare time per document before and after the template on the same document types, ideally with a control team that kept the old template so I can use difference-in-differences and rule out a general slowdown. Outcome is continuous but skewed, so I would model log time with OLS, include document type and page count as controls, cluster standard errors by team, and report the effect as a percentage with a 95% CI. I would check parallel pre-trends on a chart. If only before-after data exist, a paired comparison per document type with a caveat about confounding changes over time."

</details>

2. **Output reading** — Exp(B) = 0.72, 95% CI [0.61, 0.85] for `experience_years` predicting `late_delivery`. Interpret.
<details><summary>Solution</summary>

Each additional year of experience reduces the odds of a late delivery by 28% (OR 0.72), with the CI excluding 1, so the effect is statistically reliable. Translate to probabilities at typical values for the report, for example from 8% to 5.9% for one extra year at an 8% base rate.

</details>

3. **Trap** — Interviewer: "R² is 0.96, so the model is excellent." Respond.
<details><summary>Solution</summary>

"Not necessarily. If the series trend, a 0.96 R² can be spurious; I would check Durbin-Watson and unit roots. R² also rises with any added variable, says nothing about causal validity, and is not comparable across dependent variables. I would judge the model on out-of-sample accuracy for forecasting or on the precision and stability of the coefficient of interest for explanation."

</details>

### Interview Questions

**Q: Tell me about a statistical analysis that changed a business decision.**
A weekly status report showed the night shift's turnaround was consistently 2 to 3 hours above the day shift's. The initial reaction was to schedule retraining. Before that, I ran a regression of turnaround on shift with controls for page count, state and commercial status, because the night shift received a different file mix. The shift coefficient fell from 2.6 hours to 0.7 with a confidence interval that included zero, while commercial status and pages explained most of the gap. The decision changed from retraining to rebalancing file allocation between shifts, and the following quarter's report showed the gap closed without any training cost. The lesson I take into interviews is that controlling for composition is often the entire analysis.

**Q: How would you estimate the sample size for a QA audit that must detect a drop in accuracy from 97% to 95%?**
This is a two-proportion test. With α = 0.05 two-sided and 80% power, n per group ≈ (z_α/2 √(2p̄(1−p̄)) + z_β √(p₁(1−p₁) + p₂(1−p₂)))² / (p₁ − p₂)², which with p₁ = 0.03 and p₂ = 0.05 defect rates gives about 1 100 files per period. I would state that an audit of 200 files cannot detect a 2-point drop, propose either the larger sample or a longer monitoring window with control charts, and remind the stakeholder that detecting a 5-point drop needs far fewer files because power rises with the square of the effect. In SPSS 27+ I can confirm it under Analyze → Power Analysis → Proportions → Independent Samples.

**Q: What econometric tool would you use to evaluate a policy that applied to some US states and not others?**
Difference-in-differences on a state-year panel with two-way fixed effects, clustering standard errors by state. State fixed effects absorb permanent differences, year fixed effects absorb national shocks, and the treatment-by-post interaction gives the effect. I would check parallel pre-trends with an event-study specification, and worry about staggered adoption, where recent econometrics shows the plain two-way fixed-effects estimator can be biased; the Callaway-Sant'Anna or Sun-Abraham estimators address that, though they are not in EViews natively. With few treated states I would also use permutation inference rather than trust clustered standard errors. The economics degree matters here: the interviewer wants to hear the identification argument, not the software.

**Q: What do you do when the data violate every assumption at once?**
Prioritise by consequence. Bias comes first: endogeneity and omitted variables cannot be fixed by standard-error corrections, so I think about design, controls, fixed effects or instruments. Then non-stationarity, because it invalidates the whole regression, so I difference or test for cointegration. Then inference: heteroskedasticity and autocorrelation are handled with HAC or clustered standard errors. Then outliers and influential points, which in production data are usually data errors to correct at source. Normality comes last and rarely matters with reasonable n. I document each choice and show that the headline coefficient is stable across them; if it is not, that instability is itself the finding.

**Q: How do you keep your statistics honest under pressure to deliver a particular answer?**
By committing to the analysis plan before seeing results, keeping the syntax file as an audit trail, and reporting effect sizes with intervals rather than a yes/no verdict. When a manager wants "significant", I show the interval and what a decisive answer would cost in additional data. I distinguish exploratory from confirmatory results explicitly, and I never remove observations without a documented, data-quality reason. If a result is inconvenient, the report still states it, with limitations, because a reporting analyst's only real asset is that people trust the numbers. In practice this has meant presenting "no detectable effect, here is the sample we would need" more than once, and it has always been received better than a fudge would have been.
