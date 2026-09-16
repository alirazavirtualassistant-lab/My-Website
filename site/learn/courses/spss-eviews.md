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

