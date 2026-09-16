---
id: leadership-qa
title: Team Leadership, QA & SLA Management
icon: 👥
track: Operations & Career
color: #6E2C00
runner: none
tagline: Lead a 20-agent team, hit 100% daily targets and prove accuracy with numbers.
description: Operations leadership for BPO and back-office teams: the team lead role, daily huddles and attendance, target setting and workload allocation, quality checking and sampling, accuracy and error taxonomies, SLA/TAT/KPI management, coaching and feedback, escalations, daily/weekly/monthly production reporting, SOP and process documentation, root-cause analysis, continuous improvement (Lean/Six Sigma basics), client communication, and the behavioural interview questions for lead roles.
---

# LEVEL: Beginner

## BPO & back-office operations 101

A **BPO** (Business Process Outsourcing) company performs a business process on behalf of a client. A **back-office** process is one the client's customers never see: data entry, document indexing, title searches, invoice keying, claims coding. Systems Limited in Lahore running a data-processing floor for a US title company is a textbook example.

Every back-office operation is built from the same four pieces. Learn the vocabulary once and every floor you ever walk onto will make sense.

| Term | Meaning | Example |
|---|---|---|
| **Client** | The company that owns the work and pays for it | A US title underwriter |
| **Process** | A repeatable set of steps with a defined input and output | Index a recorded deed into the title plant |
| **Queue** | The list of work items waiting to be processed | 1,240 unindexed documents received overnight |
| **Work item** | One unit of work with its own status | One deed, one file, one form |

### How work flows

Work arrives in batches (usually overnight from the US, because Lahore is UTC+5 and the client is in Central or Eastern time). It lands in a queue, gets allocated to agents, is processed, is quality-checked, and is returned to the client before a deadline. That deadline is the **TAT** (turnaround time), and the promise to meet it is written into an **SLA** (service level agreement).

```text
Client upload (overnight)  →  Queue  →  Allocation  →  Processing (agents)
     →  QC sampling  →  Rework (if needed)  →  Delivery  →  Client acceptance
```

Each arrow is a place where time can be lost. When a team lead says "we are behind", they mean a queue is larger than the team can clear before the TAT.

### Statuses every work item carries

A work item is never "just there". It is always in exactly one status, and the counts per status are the raw material of every report you will ever build.

```text
NEW        received, not yet allocated
WIP        allocated to an agent, in progress
QC         processed, waiting for a quality check
REWORK     QC found an error, sent back to the agent
DONE       accepted, ready for delivery
HOLD       blocked (missing image, client query pending)
```

If you know the count in each status at 9:00 and again at 18:00, you can compute throughput, backlog and the number of items at risk of missing TAT. That is the whole job in one sentence.

### The people on the floor

- **Agents** (also called processors or associates) do the work.
- **Quality checkers (QCs)** sample finished work and record errors.
- **Team leads** own the queue, the people and the numbers for one process or one client.
- **Operations managers** own several team leads and the client relationship.
- **Workforce/MIS analysts** produce the reports and staffing forecasts.

> **Tip:** When you join a new process, ask for three things on day one: the SOP, the SLA document and the last month's daily production report. Together they tell you what the work is, what "good" means, and how the team is actually doing.

### Why the client outsourced it

Clients outsource for cost, for coverage (your night is their day, so files processed in Lahore are ready when Texas wakes up), and for scale (a title company cannot hire 20 indexers for a two-month backlog project). Everything the team lead does is judged against those three reasons: are we cheaper, faster and able to scale without breaking quality?

### Try It Yourself

```text
Daily queue snapshot (fill in at 09:00 and 18:00)

Status    09:00   18:00   Change
NEW        1240       0    -1240
WIP           0      35      +35
QC            0      60      +60
REWORK        0       8       +8
DONE          0    1137    +1137
HOLD          0       0        0
-------------------------------------
Total      1240    1240        0     <- totals must balance
Throughput today = DONE(18:00) - DONE(09:00) = 1137
```

### Quiz

1. What is a back-office process?
- [ ] Any process performed at night
- [x] A process the client's customers never see directly
- [ ] A process done by the team lead only
> Back-office work such as indexing and data entry supports the business without customer contact.

2. What does TAT stand for?
- [ ] Total agent time
- [x] Turnaround time
- [ ] Target attainment threshold
> TAT is the time allowed from receipt of a work item to its delivery.

3. Which status means an item is blocked waiting on the client?
- [ ] REWORK
- [ ] WIP
- [x] HOLD
> HOLD is used when the agent cannot proceed, for example when an image is missing.

### Exercises

1. **Map a process** — Draw the flow for "convert a client's Word policy manual to a print-ready PDF" using the same arrow notation, with at least one QC step.
<details><summary>Solution</summary>

```text
Receive DOCX → Check brief (page size, fonts, branding) → Apply template & styles
→ Generate TOC & page numbers → Export PDF/X → QC (fonts embedded, bleed, page count)
→ Rework if needed → Deliver → Client acceptance
```

</details>

2. **Balance the snapshot** — At 09:00 a queue has 800 NEW items. At 18:00 there are 20 WIP, 40 QC, 5 REWORK, 730 DONE and 0 HOLD. Does it balance? What is today's throughput?
<details><summary>Solution</summary>

20 + 40 + 5 + 730 + 0 = 795, not 800. Five items are unaccounted for (probably deleted or moved without logging), which must be investigated before the report goes out. Throughput = 730 DONE.

</details>

### Interview Questions

**Q: Explain what a BPO back-office process is and give an example from your experience.**
A back-office process is work a client outsources that does not involve contact with the client's own customers. At Systems Limited I led a data-processing team of 20 agents on a title-search project for a US title-insurance client: recorded documents arrived overnight, we indexed and abstracted them, ran QC sampling, and delivered before the client's morning. The client cared about cost, overnight coverage and the ability to scale up for backlog projects, and my job was to deliver all three without letting accuracy slip.

**Q: What is the difference between an SLA and a TAT?**
TAT is a single metric: the time from receipt to delivery of a work item, for example 24 hours. The SLA is the contract that bundles several such commitments together, typically TAT, accuracy (say 98.5%), volume capacity and reporting frequency, plus what happens when they are missed. A team lead manages TAT hour by hour, but reports against the SLA as a whole, because a client can penalise you for accuracy even when every file was on time.

**Q: Why do clients care about item statuses?**
Because statuses are the only honest way to answer "where is my work?". If I can tell a client that 1,137 of 1,240 items are DONE, 60 are in QC and 8 are in rework, they can plan their own day. Statuses also make reporting reproducible: throughput, backlog and ageing are all derived from status counts, so two analysts running the same query get the same number.

## The team lead role & a day in the life

A **team lead** (TL) is the first line of management. In a BPO the TL typically owns 15–25 agents, one or two processes, and the daily numbers for those processes. You are measured on three things: did the team hit the target, was the work accurate, and did the people show up and stay?

### The three hats

| Hat | What it means daily | Evidence you are doing it |
|---|---|---|
| **Operator** | Own the queue: allocate, monitor, re-balance, deliver | Daily target met, TAT met |
| **Quality owner** | Make sure QC happens and errors are fixed at the source | Accuracy above SLA, error trend falling |
| **People lead** | Attendance, coaching, motivation, escalations | Low attrition, no unexplained absences |

Most new TLs over-invest in the first hat because it is urgent. The second and third are what get you promoted.

### A realistic day (night shift, Lahore, US client)

```text
20:45  Arrive. Check emails from the client's day (Outlook 365), any escalations.
21:00  Attendance in the roster. Who is absent? Who is on leave? Rebalance.
21:10  Pull the overnight queue count. Compute per-agent target.
21:15  Huddle (10 min): yesterday's accuracy, today's volume, one process reminder.
21:30  Allocation sent. Agents start.
23:00  First checkpoint: % complete vs plan. Nudge slow starters.
01:00  QC sampling begins on completed work. Review first errors.
02:30  Second checkpoint. Reallocate from fast agents to the tail of the queue.
04:00  Rework returned to agents. Client query emails drafted.
05:00  Final push. Confirm 100% or list the exceptions with reasons.
05:30  Delivery confirmation. Daily production report sent.
05:45  Notes for the day manager: issues, IT tickets, tomorrow's risks.
```

Notice how the day alternates between **checkpoints** (measuring) and **actions** (rebalancing, coaching, escalating). A TL who only measures at the end of the shift has no time left to fix anything.

### The huddle

A huddle is a 5–10 minute standing meeting at the start of shift. It has a fixed agenda so it never drifts:

1. Yesterday's numbers: volume, accuracy, any missed TAT.
2. Today's plan: volume expected, per-agent target, any special instructions from the client.
3. One quality reminder drawn from yesterday's top error.
4. Questions.

Keep it short. If a topic needs more than two minutes, take it offline with the people involved.

### What "100% daily target" really means

When a resume says "consistently achieved 100% daily targets", an interviewer will ask how. The honest answer has three parts: accurate allocation (the target per agent matched their measured speed), mid-shift rebalancing (moving work from the queue tail to agents who finished early), and a rule that no item is left in WIP overnight without a logged reason. Targets are hit by design, not by hoping.

```text
Per-agent target = (Total items due today - Items already DONE) / Agents present
Example: (1240 - 0) / 19 present = 65.3 -> allocate 66 to the 6 fastest, 65 to the rest
```

> **Interview note:** "How do you start your shift?" is a favourite for lead roles. A strong answer walks through attendance, queue count, allocation and huddle in that order, and mentions the first checkpoint time.

### Try It Yourself

```text
Huddle template (copy into OneNote or a Teams post)

Date: ____   Shift: Night   Present: __ / 20   Absent: ____________
Yesterday: Volume ____  Accuracy ____%  TAT missed: ____
Today:     Expected volume ____  Per-agent target ____  Due by ____
Quality reminder: (top error from yesterday) _____________________
Client instructions: _____________________________________________
Checkpoints: 23:00 ___%   02:30 ___%   05:00 ___%
```

### Quiz

1. Which of these is NOT one of the three things a team lead is measured on?
- [ ] Target attainment
- [ ] Accuracy
- [x] Number of emails sent
- [ ] Attendance and retention
> Leads are judged on output, quality and people; email volume is activity, not a result.

2. When should the first mid-shift checkpoint happen?
- [ ] At the end of the shift
- [x] Early enough to reallocate work if the team is behind
- [ ] Only when the client asks
> A checkpoint is only useful if there is still time to act on it.

3. What is the purpose of the huddle?
- [x] A short, fixed-agenda briefing on yesterday's results and today's plan
- [ ] A one-hour training session
- [ ] A meeting to discuss salaries
> Huddles are 5–10 minutes with a fixed agenda; anything longer goes offline.

### Exercises

1. **Compute the allocation** — 1,500 items are due. 18 of 20 agents are present. Two agents are known to be 20% faster than average. Propose a per-agent allocation.
<details><summary>Solution</summary>

Average share = 1500 / 18 = 83.3. Give the two fast agents 100 each (200 total). The remaining 1,300 go to 16 agents = 81.25, so 4 agents get 82 and 12 get 81. Check: 200 + 328 + 972 = 1,500.

</details>

2. **Write a huddle script** — Yesterday the team processed 1,180 of 1,200 items with 97.8% accuracy; the top error was wrong document type on 9 items. Write the four-point huddle.
<details><summary>Solution</summary>

1. Yesterday: 1,180 / 1,200 (98.3% of volume), 20 items delivered late; accuracy 97.8%, below our 98.5% SLA.
2. Today: 1,300 expected, 19 present, target 69 each, due 05:00.
3. Quality: 9 of yesterday's errors were document type. Check the header stamp before the body; if "Assignment of Mortgage" appears anywhere in the first 5 lines, it is not a Mortgage.
4. Questions?

</details>

### Interview Questions

**Q: Walk me through your typical shift as a team lead.**
I started with attendance and the queue count, because those two numbers set everything else. Then I computed per-agent targets, ran a 10-minute huddle covering yesterday's accuracy and today's plan, and sent allocations by 21:30. I set checkpoints at 23:00 and 02:30 to compare percentage complete against plan and moved work between agents when someone fell behind. QC sampling started as soon as the first batch was done so that rework came back while agents still remembered the file. I closed the shift by confirming delivery, sending the daily production report and leaving handover notes for the day manager.

**Q: How did you consistently hit 100% of the daily target?**
By allocation, checkpoints and a no-carryover rule. Allocation was based on each agent's measured throughput rather than an equal split, so fast agents got more and new agents got less. Checkpoints twice a shift let me see who was behind early enough to redistribute. And no item stayed in WIP at shift end without a reason logged against it, which forced problems into the open rather than into tomorrow's backlog. The few days we missed were documented with the cause, usually a late client upload, so the client saw the miss as theirs, not ours.

**Q: What would you do if 5 of 20 agents called in sick on a high-volume day?**
First I would recompute the per-agent target with 15 people and see whether it is within a realistic stretch, roughly 10–15% above normal. If yes, I would announce it in the huddle and offer a small incentive such as an early leave the next day. If not, I would immediately tell my manager and the client with a number: "we can deliver 1,100 of 1,400 by TAT; the remaining 300 by 10:00 your time", and ask for priority guidance on which items to do first. Then I would borrow trained agents from a sister process if any were available. Silence until the deadline is the worst option.

## Attendance, shifts & workforce basics

Attendance is the most basic input to any operation: you cannot process 1,240 items with agents who are not there. **Workforce management (WFM)** is the discipline of making sure the right number of trained people are on shift at the right time. At team-lead level you handle the daily version of it: rosters, shift patterns, leave, and the metrics that describe them.

### Shift patterns

Most Pakistan-based BPOs serving US clients run a night shift, since 21:00–06:00 PKT covers 11:00–20:00 Central time. Common patterns:

| Pattern | Description | When used |
|---|---|---|
| Fixed | Same shift every day, e.g. 21:00–06:00 | Steady-volume back-office processes |
| Rotational | Teams rotate morning/evening/night weekly or monthly | 24-hour coverage, customer support |
| Split | Two shorter blocks with a break | Peak-volume windows such as US morning and afternoon uploads |
| Staggered | Start times spread across 2–3 hours | Smooth the handoff between queues and QC |

A roster shows who is on which shift and which day off. Weekly offs are usually rotated so that at least 80% of the team is present every working day.

### Attendance metrics

```text
Shrinkage %  = (Scheduled hours - Productive hours) / Scheduled hours * 100
Absenteeism % = Unplanned absent days / Scheduled days * 100
Adherence %   = Time logged in during scheduled hours / Scheduled hours * 100
Occupancy %   = Productive time / Logged-in time * 100
```

**Shrinkage** is everything that takes an agent away from processing: leave, sickness, breaks, training, meetings, system downtime. In a healthy back-office team it is 25–35%. If you plan capacity without shrinkage you will always miss target.

Worked example: 20 agents, 8-hour shifts, 22 working days. Scheduled = 3,520 hours. Actual productive = 2,464 hours. Shrinkage = (3520 − 2464) / 3520 = 30%.

### Leave management

Leave needs a policy that everyone can see. A workable one for a 20-agent team:

- Planned leave requested at least 7 days ahead in the roster tool (or a shared Excel).
- No more than 2 agents on planned leave on any day (10%).
- Unplanned absence must be informed before shift start by call or message, not by silence.
- Three unexplained absences in a month trigger a documented conversation and HR notification.

The point is not discipline for its own sake; it is that you cannot plan an allocation at 21:00 if you do not know who is coming.

### The attendance register

Keep it in a form you can sum. A daily row per agent with a one-letter code is enough:

```excel
Codes: P=Present, A=Absent (unplanned), L=Leave (planned), W=Weekly off, H=Holiday, T=Training
Present count for the day:  =COUNTIF(C2:C21,"P")
Absenteeism % this month:   =COUNTIF(C2:AA21,"A")/COUNTIF(C2:AA21,"<>W")
Per-agent attendance %:     =COUNTIF(C2:AA2,"P")/(COUNTIF(C2:AA2,"<>W")-COUNTIF(C2:AA2,"H"))
```

Put the codes in a data-validation dropdown (Data → Data Validation → List) so nobody types "present" in five different spellings and breaks the COUNTIF.

### Late login and early logout

Small losses compound. Fifteen minutes late for 20 agents is 5 lost hours a day, or roughly 60 work items on a 12-per-hour process. Track login time from the production tool, not from a signature sheet, and raise it in the huddle as a team number rather than naming individuals on the first occurrence.

> **Warning:** Never adjust an agent's attendance record after the fact without a written note of why. Attendance feeds payroll, and unexplained edits are the fastest way to lose the team's trust and to fail an audit.

### Try It Yourself

```excel
' Monthly attendance sheet layout
' A: Agent name   B: Employee ID   C..AA: day 1..25 codes   AB: Present   AC: Absent   AD: Attendance %
AB2: =COUNTIF(C2:AA2,"P")
AC2: =COUNTIF(C2:AA2,"A")
AD2: =IFERROR(AB2/(COUNTIF(C2:AA2,"<>W")-COUNTIF(C2:AA2,"H")),0)
' Team present today (column of today's codes in C):
=COUNTIF(C2:C21,"P")&" / "&COUNTA(A2:A21)
' Highlight agents under 90%: Home → Conditional Formatting → New Rule → =AD2<0.9
```

### Quiz

1. What is shrinkage?
- [ ] The number of agents who resigned
- [x] Scheduled time lost to leave, breaks, training, downtime and similar
- [ ] The reduction in queue size during a shift
> Shrinkage is non-productive scheduled time; capacity plans must include it.

2. A team has 20 agents on 8-hour shifts for 20 days and logs 2,400 productive hours. What is shrinkage?
- [ ] 15%
- [x] 25%
- [ ] 40%
> Scheduled = 3,200 hours; (3200 − 2400) / 3200 = 25%.

3. Why use a dropdown for attendance codes?
- [x] So COUNTIF formulas work reliably on consistent values
- [ ] Because Excel requires it
- [ ] To hide the codes from agents
> Consistent codes make every count formula accurate.

### Exercises

1. **Roster for 20 agents** — Design a weekly-off rotation so that no more than 4 agents are off on any day and everyone gets one fixed off day per week.
<details><summary>Solution</summary>

Split 20 agents into 5 groups of 4 and assign each group a different off day from Monday to Friday (Saturday and Sunday are typically full-team offs for a US client that does not upload on weekends, or use a 7-day rotation with groups of 3 if weekend coverage is needed). Any working day then has exactly 16 present at full attendance.

</details>

2. **Cost of lateness** — Agents process 14 items per hour. On average 6 agents log in 20 minutes late. How many items are lost per day and per 22-day month?
<details><summary>Solution</summary>

6 × 20 min = 120 min = 2 hours/day × 14 = 28 items per day; × 22 = 616 items per month, roughly half a day of team output.

</details>

### Interview Questions

**Q: How do you handle attendance issues on your team?**
Prevention first: a visible leave policy, a roster that caps planned leave at 10% per day, and a rule that unplanned absence is informed before shift start. Then measurement: I tracked attendance codes daily in a sheet with COUNTIF-based summaries so I could see a pattern within a week rather than at month end. For repeat offenders I held a documented one-to-one to understand the cause, because the reason was often transport, a family issue or a health problem that a shift swap could solve. Only when that failed did it become an HR matter. The result on my team was absenteeism consistently under 5%.

**Q: What is shrinkage and why does it matter for planning?**
Shrinkage is the share of scheduled hours that is not productive: breaks, leave, sickness, training, meetings and downtime. It matters because the client's volume is planned against productive hours, not headcount. If I plan for 20 agents × 8 hours = 160 hours but real shrinkage is 30%, I only have 112 productive hours, so a target that assumed 160 will be missed every day. Good plans state the shrinkage assumption explicitly and revisit it monthly.

**Q: An agent has been late four times this week. What do you do?**
Talk to them privately the same day, state the facts with times, and ask what is going on before assuming anything. If there is a fixable cause such as a transport problem, I try a schedule adjustment. I make the expectation clear, agree a date to review, and note the conversation. If lateness continues I escalate to HR with the documented record. I do not raise it by name in the huddle; I raise the team's login metric instead, so nobody is embarrassed but everyone knows it is watched.

## Targets & productivity metrics

A **target** is the number of work items an agent or team is expected to complete in a period, at the required quality. Setting targets is where new team leads either earn trust or lose it: too high and the team burns out and hides work; too low and the client's cost model breaks.

### The core productivity metrics

| Metric | Formula | Typical use |
|---|---|---|
| **Throughput** | Items completed / period | Team output per day |
| **AHT** (average handling time) | Total processing time / items completed | Per-agent speed |
| **Items per hour (IPH)** | 60 / AHT (in minutes) | Target setting |
| **Utilisation** | Productive time / scheduled time | Capacity planning |
| **Target attainment** | Items completed / items targeted × 100 | Daily scorecard |
| **Backlog** | Items received but not completed | Risk to TAT |

AHT is measured from the production tool's timestamps, never from an agent's estimate. If your tool does not stamp start and end, add two columns to the tracking sheet and make it the agent's first and last action on each item.

### Setting a fair target

The fair target comes from data, not from the client's wish. The standard method:

1. Measure AHT for every agent over at least 10 working days.
2. Take the **median**, not the mean, so one very fast or very slow agent does not distort it.
3. Apply a productive-hours figure that already includes shrinkage (e.g. 6.5 productive hours in an 8-hour shift).
4. Set the team target at median IPH × productive hours × agents present.

```excel
' AHT in minutes per agent from a log with StartTime (E) and EndTime (F) and Agent (B)
=AVERAGEIFS((F:F-E:E)*1440, B:B, "Ali")            ' ordinary average
' Median AHT across the whole team (array formula in older Excel: Ctrl+Shift+Enter)
=MEDIAN((F2:F5000-E2:E5000)*1440)
' Items per hour from a 4.5-minute AHT
=60/4.5                                             ' 13.3
' Daily team target: 13.3 IPH * 6.5 productive hours * 19 present
=ROUNDDOWN(60/4.5*6.5*19,0)                         ' 1643
```

### Per-agent vs per-process targets

Different processes have different AHTs, so one target number for a mixed team is meaningless. On a title-search project, "index a deed" might take 3 minutes while "abstract a mortgage with riders" takes 12. Set the target per process, and when an agent works on two processes in a day, express their target in **weighted units**:

```text
Weight = AHT of process / AHT of the base process
Deed (3 min)      weight 1.0
Mortgage (12 min) weight 4.0
Agent day: 40 deeds + 15 mortgages = 40*1.0 + 15*4.0 = 100 units
Target in units = base IPH (20/hr) * 6.5 hours = 130 units -> attainment 77%
```

Weighted units let you compare agents fairly and let the client see a single productivity number per person.

### The daily scorecard

Every agent should see their own numbers every day. A one-row scorecard per agent:

```text
Agent   Target  Done  Attain%  AHT   Errors  Accuracy
Sana       66    68    103%    4.2m     1     98.5%
Bilal      66    59     89%    5.1m     0    100.0%
Hamza      66    66    100%    4.5m     3     95.5%
```

Read the three rows together. Sana is above target and accurate. Bilal is slow but perfect, so coach speed, not care. Hamza hit target with three errors, which is the most expensive pattern because rework costs QC time plus his own time; coach accuracy first.

> **Tip:** Publish the team scorecard but discuss individual rows privately. Public rankings work for a week and then create resentment and gaming.

### When to change the target

Change it when the process changes (new fields, new client rules), when the mix changes, or when the measured median AHT has moved by more than 10% for two consecutive weeks. Announce the reason and the data. Never change a target silently mid-month.

### Try It Yourself

```excel
' Productivity sheet: A Agent, B Items, C ProductiveMinutes, D Errors
' E: AHT (minutes)
=IFERROR(C2/B2,0)
' F: Items per hour
=IFERROR(B2/(C2/60),0)
' G: Attainment vs team target in cell $K$1
=B2/$K$1
' H: Accuracy
=IFERROR(1-D2/B2,0)
' Team median AHT (Excel 365 dynamic array, no Ctrl+Shift+Enter needed)
=MEDIAN(C2:C21/B2:B21)
' Suggested daily target (19 present, 6.5 productive hours)
=ROUNDDOWN(60/MEDIAN(C2:C21/B2:B21)*6.5*19,0)
```

### Quiz

1. Why use the median AHT instead of the mean when setting a target?
- [x] One extremely fast or slow agent does not distort it
- [ ] The median is always smaller
- [ ] Excel has no AVERAGE function
> The median resists outliers, so the target reflects a typical agent.

2. An agent's AHT is 5 minutes. With 6.5 productive hours, what is a realistic daily target?
- [ ] 96
- [x] 78
- [ ] 120
> 60 / 5 = 12 per hour × 6.5 hours = 78.

3. An agent hits 100% of target with 3 errors out of 66. Which should you coach first?
- [ ] Speed
- [x] Accuracy
- [ ] Nothing, target was met
> Errors cost QC time and rework; 95.5% accuracy is below a typical 98% SLA.

### Exercises

1. **Weighted units** — Deeds take 3 minutes, mortgages 12, releases 2. An agent completes 30 deeds, 10 mortgages and 40 releases. Compute units with deed as base and attainment against a 130-unit target.
<details><summary>Solution</summary>

Weights: deed 1.0, mortgage 4.0, release 0.667. Units = 30 + 40 + 26.7 = 96.7. Attainment = 96.7 / 130 = 74%.

</details>

2. **Set a target** — Ten days of data give median AHT 4.8 minutes. Shrinkage is 30% on an 8-hour shift. 20 agents on roster, 2 on leave. What daily team target do you set?
<details><summary>Solution</summary>

Productive hours = 8 × 0.7 = 5.6. IPH = 60 / 4.8 = 12.5. Target = 12.5 × 5.6 × 18 = 1,260 items.

</details>

### Interview Questions

**Q: How do you set productivity targets for your team?**
From measured data. I log start and end timestamps per item, compute AHT per agent over at least ten days, and take the team median so one outlier does not skew it. I convert that to items per hour, multiply by productive hours after shrinkage, and by the agents actually present, which gives a daily team target I can defend to both the client and the agents. When the process mix varies, I use weighted units so a mortgage abstract counts more than a deed index. I revisit the target when the median AHT moves by more than 10% for two weeks or when the client changes the process.

**Q: What is AHT and how is it different from throughput?**
AHT is the average time to complete one item; throughput is the number of items completed in a period. They are linked (throughput ≈ productive time / AHT) but tell you different things. AHT is a per-agent skill and process measure, useful for coaching and target setting. Throughput is the outcome the client sees. A team can have great AHT and poor throughput if attendance or utilisation is bad, which is why I report both.

**Q: An agent is consistently at 85% of target. What do you do?**
First I check whether the target is right for their process mix, because a wrong target is my error, not theirs. Then I look at their AHT distribution: consistently slow means a skill or tooling issue, while long idle gaps mean a focus or workload-management issue. I sit with them for an hour of live work, which usually reveals the cause, for example not using keyboard shortcuts or re-opening the SOP for every item. Then we agree a specific improvement plan with a two-week review. In my experience most 85% agents reach 100% within a month with that approach.

## Quality checking basics

A **quality checker (QC)** reviews finished work and records whether it meets the standard. Quality checking exists because agents make errors at a predictable rate, and the client's SLA sets a maximum error rate. Before you can lead quality you need to understand what a QC actually does hour by hour; Ali did this job at Systems Limited before leading the team, and that experience is why his accuracy reporting was trusted.

### What a QC does

1. Pulls a **sample** of completed items (all of them for new agents, a percentage for experienced ones).
2. Compares each field the agent entered against the source document.
3. Records every discrepancy as an **error** with a type and a severity.
4. Sends items with errors back as **rework**, with a note the agent can act on.
5. Compiles the daily accuracy numbers per agent and per error type.

The QC does not fix the error silently. Silent fixing hides the true accuracy and removes the agent's chance to learn.

### Field-level vs item-level accuracy

There are two ways to count, and you must be clear which one the SLA uses.

```text
Item-level accuracy  = Items with zero errors / Items checked * 100
Field-level accuracy = Fields correct / Fields checked * 100

Example: 100 items checked, 10 fields each, 12 items had one wrong field.
Item-level  = 88 / 100        = 88.0%
Field-level = 988 / 1000      = 98.8%
```

Both numbers are true. The client usually contracts on field-level accuracy (98.5% is common for indexing), but a 12% item rework rate is what your team feels. Report both.

### The QC log

A QC log is a table with one row per error, not one row per item. That is what lets you later group by type, by agent and by document.

```text
Date       Item_ID   Agent   Field         Type          Severity  Note
2026-09-14 TN-00412  Hamza   DocType       Wrong value   Major     Assignment coded as Mortgage
2026-09-14 TN-00412  Hamza   Grantor       Spelling      Minor     "Willams" for "Williams"
2026-09-14 TN-00419  Sana    RecordingDate Transposed    Major     09/04 entered as 04/09
2026-09-14 TN-00433  Bilal   Book/Page     Missing       Critical  Page left blank
```

Every row has a type from a fixed list and a note that tells the agent exactly what to change. "Wrong" alone is not a note.

### Severity

| Severity | Definition | Example |
|---|---|---|
| Critical | Makes the item unusable or creates legal/financial risk | Wrong parcel number, missing book/page |
| Major | Client would have to correct it before use | Wrong document type, wrong party name |
| Minor | Cosmetic, does not change meaning | Extra space, lowercase vs uppercase |

Severity changes how you react. One critical error per day is a process problem to fix tonight. Ten minors a day is a coaching topic for next week.

### QC output for the day

```excel
' From the QC log (Type in D, Agent in C, Severity in E) and a Checked sheet with items per agent
' Errors per agent
=COUNTIF(QCLog!C:C,"Hamza")
' Critical errors today
=COUNTIFS(QCLog!A:A,TODAY(),QCLog!E:E,"Critical")
' Top error type
=INDEX(Types!A:A, MATCH(MAX(COUNTIF(QCLog!D:D,Types!A:A)), COUNTIF(QCLog!D:D,Types!A:A), 0))
' Item-level accuracy for Hamza (Checked!B = agent, Checked!C = items checked)
=1 - COUNTIFS(QCLog!C:C,"Hamza") / SUMIF(Checked!B:B,"Hamza",Checked!C:C)
```

> **Warning:** A QC who checks their friends lightly and everyone else strictly destroys the data. Rotate QC assignments and calibrate weekly (covered in the Intermediate level).

### The QC mindset

A good QC is not looking for reasons to fail work. They are looking for the truth about how the process is performing so the team can improve. That means the same standard for every agent, a note on every error, and an honest number even when it is bad. Your accuracy figure is the client's main evidence that the outsourcing decision was right; if they ever discover it was flattered, the account is at risk.

### Try It Yourself

```text
QC daily summary (fill from the QC log)

Items completed today      : 1137
Items sampled              :  228  (20%)
Items with >= 1 error      :   19
Item-level accuracy        : 91.7%   = (228-19)/228
Fields checked (10/item)   : 2280
Field errors               :   23
Field-level accuracy       : 99.0%   = (2280-23)/2280
Critical / Major / Minor   :   1 / 9 / 13
Top error type             : Wrong document type (7)
Action tonight             : Critical item TN-00433 fixed and re-QC'd; DocType reminder in tomorrow's huddle
```

### Quiz

1. 200 items are checked, 8 fields each. 15 items have exactly one wrong field. What is field-level accuracy?
- [ ] 92.5%
- [x] 99.06%
- [ ] 85%
> 1,600 fields, 15 wrong: 1585 / 1600 = 99.06%. Item-level would be 92.5%.

2. Why should the QC log have one row per error rather than one per item?
- [x] So errors can be grouped by type, agent and severity later
- [ ] It uses less space
- [ ] The client requires it
> One row per error is the shape that supports Pareto and trend analysis.

3. A QC finds an error and quietly fixes it. What is the problem?
- [ ] There is no problem, the item is now correct
- [x] The true accuracy is hidden and the agent cannot learn
- [ ] The item must be deleted
> Silent fixes flatter the metric and remove the feedback loop.

### Exercises

1. **Classify severity** — Assign a severity to each: (a) grantee name has a trailing space, (b) recording date off by one year, (c) mortgage amount entered as 15,000 instead of 150,000.
<details><summary>Solution</summary>

(a) Minor, cosmetic. (b) Major, the client must correct it before use and it affects chain-of-title ordering. (c) Critical, a financial figure wrong by a factor of ten creates real risk.

</details>

2. **Compute both accuracies** — From a log: 150 items sampled, 12 fields each, 21 field errors across 17 items. Give item-level and field-level accuracy.
<details><summary>Solution</summary>

Item-level = (150 − 17) / 150 = 88.7%. Field-level = (1800 − 21) / 1800 = 98.83%.

</details>

### Interview Questions

**Q: What did you do as a quality checker and what did you learn from it?**
I sampled completed title-search and data-entry items, compared every field to the source image, and logged each error with a type, a severity and a note the agent could act on. I compiled daily accuracy per agent and per error type. What I learned is that most errors cluster: a handful of types such as wrong document type or transposed dates accounted for most of the volume, and a few agents accounted for most of those. That insight later shaped how I coached as a team lead, because it told me the problem was usually a specific misunderstanding rather than carelessness.

**Q: What is the difference between item-level and field-level accuracy, and which do you report?**
Item-level counts an item as wrong if any field is wrong; field-level counts each field separately. Field-level is almost always higher and is what most indexing SLAs specify, often 98.5% or above. I report both, because field-level is the contractual number while item-level tells the team how much rework they are generating. When the two diverge widely, for example 99% field-level but 85% item-level, it means errors are spread thinly across many items, which is a training problem rather than a single bad agent.

**Q: How do you make sure QC results are trusted?**
Consistency and transparency. Every error has a type from a fixed taxonomy, a severity with a written definition, and a note. QC assignments rotate so nobody checks the same agents every day, and once a week the QCs check the same 20 items independently and compare results, which is calibration. The daily numbers are published to the team with the log available for anyone to inspect. When an agent disputes an error, it goes through a short review and the outcome is logged either way. Trust comes from the process being visible, not from the QC's seniority.

# LEVEL: Intermediate

## Sampling & QA scorecards

You cannot check every item once volume passes a few hundred a day, so QC works on a **sample**. Sampling done badly produces an accuracy number nobody should trust. This chapter covers how to choose the sample, how to build an **error taxonomy**, and how to keep several QCs consistent through **calibration**.

### How much to sample

| Situation | Sample rate | Why |
|---|---|---|
| Agent in first 2 weeks | 100% | No baseline yet; every error is a training moment |
| Agent below SLA last week | 50% | Confirm the trend and catch regressions |
| Experienced agent above SLA | 10–20% | Enough to detect a drop within a day or two |
| New client rule introduced | 100% of affected items for 3 days | Rules change error patterns |

A useful statistical check: to be reasonably confident (95%) that a true error rate of 2% is detected, you need around 150 sampled items. At 20% sampling of 1,100 items you get 220, which is comfortably enough. At 5% you get 55, and a 2% error rate gives one expected error, which tells you almost nothing.

### How to pick the sample

Random, not convenient. If the QC takes the first 20% of each agent's items, it is the early-shift work when everyone is fresh, and accuracy will be flattered. Use a random draw:

```excel
' Column A = Item_ID, B = Agent. In C: =RAND()
' Sort by C, then take the top 20% per agent with a helper:
' D: rank within agent
=COUNTIFS(B:B,B2,C:C,">"&C2)+1
' E: flag for sampling if within the agent's 20%
=D2<=ROUNDUP(COUNTIF(B:B,B2)*0.2,0)
' Freeze the sample: copy column C and Paste Values before sorting, or RAND() will recalculate
```

Stratify by agent (each agent gets their own 20%) and, when the process mix varies, by document type too, so the hard items are not under-sampled.

### The error taxonomy

An error taxonomy is a fixed list of error types. Without it, one QC writes "wrong", another "incorrect value" and a third "typo", and you can never group them. A working taxonomy for an indexing process:

```text
Code  Type                  Definition
E01   Missing value         Required field left blank
E02   Wrong value           Value present but does not match source
E03   Transposition         Correct characters in wrong order (dates, digits)
E04   Spelling / format     Name or address misspelled or wrongly formatted
E05   Wrong document type   Item classified as the wrong instrument
E06   Duplicate             Item processed twice
E07   Wrong party role      Grantor / grantee swapped
E08   Extra data            Data entered that is not in the source
E09   Procedure             SOP step skipped (e.g. no rider pages checked)
```

Keep it under 12 types. If a type is used less than 1% of the time for three months, merge it. If "Wrong value" is over 40% of errors, split it, because it is hiding something.

### The QA scorecard

The scorecard converts the log into a per-agent, per-week view that a manager can read in ten seconds.

```text
Week 37     Sampled  Errors  Field-Acc  Item-Acc  Crit  Maj  Min  Top type  Trend
Sana          212       3     99.86%     98.6%     0     1    2   E04       ↑
Bilal         205       2     99.90%     99.0%     0     0    2   E04       →
Hamza         220      14     99.36%     93.6%     1     6    7   E05       ↓
Team        4,180     96     99.77%     97.7%     2    31   63   E05       →
SLA target                   99.50%     n/a       0
```

Weight the score if the client does: a common scheme is critical = 5 points, major = 2, minor = 1, and the scorecard reports points per 100 items alongside raw accuracy.

### Calibration

Calibration is the practice of having every QC check the **same** set of items independently and then comparing results. Run it weekly on 20–30 items:

1. Pick 25 items, including some known-tricky ones.
2. Each QC checks them alone and logs errors with type and severity.
3. Compare. Every disagreement is discussed until the group agrees on the right call.
4. Update the taxonomy definitions or the SOP if the disagreement came from ambiguity.
5. Record the **agreement rate**: items where all QCs gave the same result / 25.

Agreement below 85% means your accuracy number is partly measuring which QC looked at the item, not the agent.

> **Interview note:** "How do you make sure your quality numbers are reliable?" is answered with sampling method, taxonomy and calibration, in that order, with the agreement rate as the proof.

### Try It Yourself

```excel
' Weighted quality score per agent from the QC log
' QCLog: A Date, B Item, C Agent, D TypeCode, E Severity
' Points: Critical 5, Major 2, Minor 1. Sampled items per agent in Checked!B:C
=(COUNTIFS(QCLog!C:C,"Hamza",QCLog!E:E,"Critical")*5
 +COUNTIFS(QCLog!C:C,"Hamza",QCLog!E:E,"Major")*2
 +COUNTIFS(QCLog!C:C,"Hamza",QCLog!E:E,"Minor")*1)
 / SUMIF(Checked!B:B,"Hamza",Checked!C:C) * 100
' Result = penalty points per 100 sampled items; lower is better
' Calibration agreement rate: Calib!B:D hold each QC's verdict for 25 items
=SUMPRODUCT((Calib!B2:B26=Calib!C2:C26)*(Calib!C2:C26=Calib!D2:D26))/25
```

### Quiz

1. Why should the QC sample be random rather than the first items of the shift?
- [x] Early-shift work is typically more accurate, so the sample would be flattered
- [ ] Random sampling is faster
- [ ] The client insists on it
> Convenience samples are biased toward the conditions under which they were taken.

2. What is calibration?
- [ ] Adjusting the target after a process change
- [x] Multiple QCs checking the same items independently and reconciling differences
- [ ] Training new agents on the SOP
> Calibration measures and improves consistency between checkers.

3. If "Wrong value" is 55% of all logged errors, what should you do?
- [ ] Nothing, it is the most common error
- [x] Split it into more specific types
- [ ] Remove it from the taxonomy
> A dominant catch-all type hides the real causes you need for root-cause analysis.

### Exercises

1. **Size the sample** — The team completes 900 items a day. You want at least 150 sampled items per agent per week for 20 agents. What daily sample rate is required?
<details><summary>Solution</summary>

Per agent per day ≈ 45 items. 150 per week / 5 days = 30 per day per agent = 30 / 45 = 67%. That is expensive, so either accept a two-week window (33%) or focus 100% sampling on the agents currently below SLA and 20% on the rest.

</details>

2. **Design a taxonomy** — Write six error types for a PDF-form-building process (fillable AcroForm deliverables), with one-line definitions.
<details><summary>Solution</summary>

F01 Missing field (a required field in the brief was not created); F02 Wrong field type (text where checkbox required); F03 Tab order (fields not in reading order); F04 Naming (field name does not follow the agreed convention); F05 Formatting (font, size or alignment differs from the template); F06 Calculation (a computed field returns the wrong value).

</details>

### Interview Questions

**Q: How did you decide how much work to sample?**
By risk and by statistics. New agents and anyone below SLA the previous week were checked at 100% or 50%; experienced agents at 20%, drawn randomly and stratified per agent so each person's number rested on enough items. The statistical reason is that detecting a 2% error rate with confidence needs roughly 150 items, so I sized weekly sampling to reach that per agent. When the client changed a rule, I temporarily went to 100% on affected items for three days because rule changes create new error types that old sampling rates would miss.

**Q: What is an error taxonomy and why does it matter?**
A fixed list of error types with written definitions that every QC uses. It matters because the value of a QC log is in aggregation: which type is rising, which agents make it, which document types trigger it. Free-text descriptions cannot be aggregated. On my team we used nine codes, and the single most valuable outcome was seeing that E05 wrong-document-type accounted for a third of errors, which turned into a one-page visual guide of instrument headers that cut that type by 70% within a month.

**Q: Two QCs give different accuracy scores for the same agent. How do you handle it?**
That is a calibration failure, not an agent problem. I run a calibration set: both QCs check the same 25 items independently, we compare every difference, and we agree the correct call for each. Usually the cause is an ambiguous taxonomy definition or an SOP gap, so we fix the wording. I track the agreement rate weekly and expect above 90%. Until the two QCs are calibrated, I avoid drawing conclusions about the agent from either score.

## Accuracy, TAT & SLA definitions and formulas

An SLA is only enforceable if every metric in it has a precise definition. "98% accuracy" means nothing until you say accuracy of what, measured how, over what period. This chapter gives you the definitions and Excel formulas that stand up in a client review.

### The metrics in a typical back-office SLA

| Metric | Definition | Typical target |
|---|---|---|
| Field-level accuracy | Correct fields / checked fields | ≥ 98.5% |
| Critical error rate | Critical errors / checked items | 0 |
| TAT compliance | Items delivered within TAT / items due | ≥ 98% |
| Average TAT | Mean of (delivered − received) in hours | ≤ 20 h |
| Volume capacity | Items the team commits to per day | 1,200 |
| Backlog ageing | Items older than TAT still open | 0 |
| Report delivery | Daily report by 07:00 client time | 100% |

### TAT precisely

TAT is measured per item from a **received** timestamp to a **delivered** timestamp. Both must be defined: is "received" when the client uploads, or when your team downloads? Is "delivered" when the file is uploaded, or when the client acknowledges? Write it down and put the definition on the report.

Business hours matter. A 24-hour TAT on a Friday-evening upload either means Saturday evening (calendar) or Monday evening (business days). Most title-industry clients use business hours, and Excel can do it:

```excel
' Calendar TAT in hours
=(Delivered - Received) * 24
' Business-day TAT in whole days, excluding weekends and US holidays listed in Holidays!A:A
=NETWORKDAYS(Received, Delivered, Holidays!A:A) - 1
' TAT compliance (Received in B, Delivered in C, SLA hours in $K$1)
=COUNTIFS(D:D,"<="&$K$1) / COUNTA(D:D)          ' D = (C-B)*24
' Percentile view: 95% of items were delivered within how many hours?
=PERCENTILE.INC(D2:D2000, 0.95)
```

Report the 95th percentile alongside the average. A 20-hour average can hide 5% of items taking 60 hours.

### Accuracy precisely

Field-level accuracy is the standard, but state the sampling basis: "Field-level accuracy 99.2% on a 20% stratified random sample of 4,180 items". Include the sample size, because 100% on 10 items is not evidence of anything.

```excel
' Weekly field-level accuracy: FieldsChecked in Checked!D, errors in QCLog
=1 - COUNTIFS(QCLog!A:A,">="&WeekStart, QCLog!A:A,"<="&WeekEnd)
     / SUMIFS(Checked!D:D, Checked!A:A,">="&WeekStart, Checked!A:A,"<="&WeekEnd)
' Critical error rate per 1,000 items
=COUNTIFS(QCLog!E:E,"Critical", QCLog!A:A,">="&WeekStart, QCLog!A:A,"<="&WeekEnd)
     / SUMIFS(Checked!C:C, Checked!A:A,">="&WeekStart, Checked!A:A,"<="&WeekEnd) * 1000
```

### KPIs vs SLA metrics

A **KPI** is any number you use to run the operation. An **SLA metric** is a KPI the client has written into the contract, usually with a penalty. All SLA metrics are KPIs; most KPIs are not SLA metrics. Internal KPIs such as AHT, utilisation and rework rate are what let you hit the SLA metrics; the client rarely sees them, but you manage them daily.

### Penalties and credits

SLAs often include a **service credit**: if accuracy falls below 98.5% for a month, the client is credited, say, 5% of that month's invoice. Some include an **earn-back**: exceeding target for three consecutive months cancels a credit. Know these clauses. A team lead who knows that one more critical error this month costs the company a credit prioritises differently from one who does not.

### The SLA dashboard row

The whole SLA fits in one row per period:

```text
Month   Volume  Field-Acc  Crit  TAT-Comp  Avg-TAT  P95-TAT  Backlog>TAT  Report-OnTime
Aug-26  25,480   99.31%      1    98.9%     16.2h    23.5h        0         100%
Sep-26  18,920   99.44%      0    99.4%     15.8h    22.1h        0         100%
Target           98.50%      0    98.0%     20.0h     n/a         0         100%
```

> **Warning:** Never let the client's definition of a metric and your report's definition drift apart. Put the formula, in words, in a footnote on every report. Disputes about definitions in a review meeting always end badly for the supplier.

### Try It Yourself

```excel
' SLA calculation sheet: Items!A ItemID, B Received, C Delivered, D FieldsChecked, E FieldErrors
' F: TAT hours
=(C2-B2)*24
' G: Within SLA (24h)?
=IF(F2<=24,1,0)
' Summary block
TAT compliance:      =SUM(G:G)/COUNT(G:G)
Average TAT (h):     =AVERAGE(F:F)
P95 TAT (h):         =PERCENTILE.INC(F:F,0.95)
Field accuracy:      =1-SUM(E:E)/SUM(D:D)
Late items list:     =FILTER(A:A, G:G=0)          ' Excel 365
```

### Quiz

1. Why report the 95th-percentile TAT and not only the average?
- [x] The average can hide a small share of very late items
- [ ] The percentile is easier to compute
- [ ] Clients only understand percentiles
> P95 shows the experience of the slowest 5%, which is what generates complaints.

2. Which Excel function counts business days between two dates while skipping listed holidays?
- [ ] DAYS
- [x] NETWORKDAYS
- [ ] WORKDAY
> NETWORKDAYS returns the count; WORKDAY returns a date offset by working days.

3. What is a service credit?
- [ ] A bonus paid to the team
- [x] A reduction in the client's invoice triggered by an SLA miss
- [ ] Extra time granted on TAT
> Service credits are the financial penalty mechanism written into most SLAs.

### Exercises

1. **Compute compliance** — Of 1,200 items, 1,176 were delivered within 24 hours. 30 items exceeded 30 hours. What is TAT compliance, and did the team meet a 98% target?
<details><summary>Solution</summary>

1176 / 1200 = 98.0%, exactly at target. The 30 items over 30 hours (2.5%) mean the P95 is above SLA, so it should be flagged even though compliance technically passed.

</details>

2. **Write a definition** — Draft the footnote definition for "Field-level accuracy" as it should appear on the daily report.
<details><summary>Solution</summary>

"Field-level accuracy = (fields checked − field errors) / fields checked, measured on a stratified random sample of at least 20% of delivered items per agent per day, checked against the source image by a QC other than the processing agent. Sample size is shown alongside the figure."

</details>

### Interview Questions

**Q: How do you define and measure TAT?**
Per item, from a received timestamp to a delivered timestamp, with both events defined in writing and agreed with the client, for example received = time of upload to the shared folder, delivered = time of our upload of the completed batch. I compute it in business hours when that is what the contract says, using NETWORKDAYS with a holiday list. I report compliance (share within SLA), average, and the 95th percentile, because a good average can hide a tail of late files that drives client complaints. Every late item gets a reason code so the monthly review can separate client-caused delays from ours.

**Q: What is the difference between a KPI and an SLA metric?**
An SLA metric is a contractually committed number with a consequence, such as 98.5% field-level accuracy with a service credit if missed. A KPI is any metric I use to manage, including internal ones like AHT, utilisation, rework rate and login adherence that the client never sees. I manage KPIs daily so the SLA metrics take care of themselves; for example, keeping rework under 5% and utilisation above 85% is how TAT compliance stays at 99%.

**Q: Your accuracy is 98.3% against a 98.5% SLA with five days left in the month. What do you do?**
First I check the arithmetic and the sample, because a 0.2% gap can be one bad day or one miscalibrated QC. Then I run a quick Pareto of the month's errors by type and agent to find the largest contributor, and target that specifically: extra sampling and same-day feedback for those agents, plus a huddle reminder on the top error type. I also increase the sample on the remaining days so that improved work is reflected in the number. And I tell my manager and the client contact now, with the plan, rather than hoping; a supplier who flags a risk early is treated very differently from one who reports a miss after the fact.

## Daily, weekly & monthly production reports

The production report is the team lead's most visible product. The client reads it before they read anything else, and management uses it to judge you. A good report answers, in order: did we deliver, how accurately, and what needs attention. Ali produced these at Systems Limited and later, in a different form, as weekly status reports for multi-state title production at Stewart Title.

### The three cadences

| Report | Audience | Contents | Length |
|---|---|---|---|
| **Daily** | Client operations contact, own manager | Volume received/completed, TAT, accuracy, exceptions | Half a page |
| **Weekly** | Client manager, operations manager | Trends vs last week, per-agent scorecard, top errors, actions | 1–2 pages |
| **Monthly** | Client leadership, own leadership | SLA compliance, trend charts, attrition, improvement initiatives, next month's risks | 3–5 pages plus appendix |

The daily report is a snapshot; the weekly is a trend; the monthly is a review. Do not put weekly content in the daily or the client will stop reading it.

### The daily report structure

```text
Subject: Daily Production Report – Title Indexing – 14 Sep 2026

1. Summary
   Received 1,240 | Completed 1,240 (100%) | Delivered by 05:30 PKT (all within TAT)
   Field accuracy 99.2% (sample 248) | Critical errors 0 | Rework 1.5%
2. Volume by process
   Deeds 812 | Mortgages 301 | Releases 127
3. Exceptions
   3 items on HOLD: missing page 2 image (IDs TN-00517, TN-00522, TN-00590) – client query sent 03:40
4. Quality
   Top error: E05 wrong document type (5). Corrective action: header guide re-issued in huddle.
5. Attendance
   19 / 20 present (1 planned leave)
6. Tomorrow
   Expected 1,300 (client advised). Capacity 1,350. No risk.
```

Six sections, every number with its denominator, every exception with an ID and an action.

### Building it from data, not by hand

Type the report once as a template and fill it from a data sheet. Keep raw data in one sheet with one row per item, and a summary sheet with formulas:

```excel
' Data!A ItemID, B Process, C Agent, D Received, E Delivered, F Status
' Summary for a date in $B$1
Received:     =COUNTIFS(Data!D:D,">="&$B$1, Data!D:D,"<"&$B$1+1)
Completed:    =COUNTIFS(Data!E:E,">="&$B$1, Data!E:E,"<"&$B$1+1, Data!F:F,"DONE")
By process:   =COUNTIFS(Data!B:B,"Deed", Data!E:E,">="&$B$1, Data!E:E,"<"&$B$1+1)
On hold:      =COUNTIFS(Data!F:F,"HOLD")
Hold IDs:     =TEXTJOIN(", ",TRUE,FILTER(Data!A:A,Data!F:F="HOLD"))
Within TAT:   =COUNTIFS(Data!G:G,"<=24", Data!E:E,">="&$B$1, Data!E:E,"<"&$B$1+1)
```

A PivotTable (Insert → PivotTable, rows = Agent, columns = Process, values = Count of ItemID) gives the per-agent by-process table in seconds and refreshes with a right-click.

### The weekly report adds trend and people

- A 5-day table of the daily summary numbers with week-on-week change.
- The per-agent scorecard (sampled, accuracy, attainment, trend arrow).
- Pareto of error types for the week with the top three and the actions taken.
- Any TAT misses with root cause and whether it was client-caused.
- Planned leave and training next week.

Use conditional formatting for trend arrows so the reader sees red and green before reading a number: Home → Conditional Formatting → Icon Sets → 3 Arrows, applied to the change column.

### The monthly report is a story

Open with the SLA table (target vs actual for each metric). Then one chart per SLA metric showing the last six months. Then the narrative: what went wrong, what you did, what changed. Then people (attrition, hires, training completed). Then next month's risks and asks (for example, "volume forecast up 20% in October; two additional agents required by 25 September"). Close with an appendix of the weekly scorecards.

> **Tip:** Every number in a report should be traceable to a row in a data sheet. When a client asks "which 20 items were late?", you should be able to answer in under a minute with a FILTER.

### Try It Yourself

```excel
' Weekly trend block. Row per day in Weekly!A (date), fill with formulas referencing Data!
' B Received  C Completed  D Completion%  E FieldAcc  F TATComp  G Critical
D2: =C2/B2
' Week-on-week change for the summary row (this week in B8, last week in B9)
=(B8-B9)/B9
' Trend arrow (text version if icon sets are unavailable)
=IF(E8>E9+0.001,"↑",IF(E8<E9-0.001,"↓","→"))
' Top 3 error types this week from QCLog (Excel 365)
=TAKE(SORTBY(UNIQUE(QCLog!D2:D5000), COUNTIF(QCLog!D2:D5000, UNIQUE(QCLog!D2:D5000)), -1), 3)
```

### Quiz

1. What is the main purpose of the daily report?
- [x] A snapshot: did we deliver, how accurately, what needs attention
- [ ] A six-month trend analysis
- [ ] A list of every item processed
> Daily reports are short snapshots; trends belong in weekly and monthly reports.

2. Which should appear with every metric in a report?
- [ ] The name of the QC
- [x] Its denominator or sample size
- [ ] A colour
> "99.2% on a sample of 248" is evidence; "99.2%" alone is a claim.

3. Which Excel feature gives a per-agent by-process count table fastest?
- [ ] VLOOKUP
- [x] PivotTable
- [ ] Data Validation
> A PivotTable cross-tabulates two fields with a count in seconds and refreshes on demand.

### Exercises

1. **Write an exceptions section** — 4 items are on hold because the images are illegible; 2 items missed TAT by 3 hours because the client uploaded them at 04:00 PKT. Write section 3 of the daily report.
<details><summary>Solution</summary>

3. Exceptions: 4 items on HOLD, illegible images (IDs TN-00611, TN-00618, TN-00640, TN-00652); re-scan requested from client at 02:15 PKT, awaiting response. 2 items delivered 3 h beyond TAT (TN-00700, TN-00701): received 04:00 PKT, i.e. after the agreed 22:00 cut-off; classified as client-caused delay, delivered 08:00 PKT.

</details>

2. **Design the monthly SLA table** — List the columns and the six months of headers you would use, and where the target row goes.
<details><summary>Solution</summary>

Rows: one per SLA metric (Field accuracy, Critical errors, TAT compliance, Average TAT, P95 TAT, Backlog > TAT, Report on time). Columns: Target, Apr-26, May-26, Jun-26, Jul-26, Aug-26, Sep-26, then a Status column (Met / Missed) computed against Target for the latest month. Target sits in the first data column so every month can be compared to it visually, with conditional formatting red for misses.

</details>

### Interview Questions

**Q: What did your daily production report contain and who read it?**
Six sections: a summary line with received, completed, delivery time, accuracy with sample size and critical errors; volume by process; exceptions with item IDs and the action taken; the top error type with the corrective action; attendance; and tomorrow's expected volume against capacity. It went to the client's operations contact and my operations manager before 06:00 PKT so it was on their desk at the start of the US day. It was generated from a data sheet with COUNTIFS and a PivotTable rather than typed, which meant it took ten minutes and never had arithmetic errors.

**Q: How do the daily, weekly and monthly reports differ?**
By purpose and audience. The daily is a snapshot for the people running the work: what happened last night and what needs attention this morning. The weekly is a trend for managers: five days side by side, per-agent scorecards, the error Pareto and actions. The monthly is a review for leadership: SLA table with target versus actual, six-month charts, people changes and next month's risks and asks. At Stewart Title my weekly status reports for multi-state production followed the same logic: a headline table, then the variances, then what I needed from management.

**Q: A client says your report numbers do not match theirs. How do you respond?**
I ask for their number and their definition, then compare definitions before comparing numbers, because that is almost always where the difference is: calendar versus business-hour TAT, received-at-upload versus received-at-download, item-level versus field-level accuracy. Then I reconcile at the item level, since my report is built from one row per item and I can list exactly which items each side counted. I present the reconciliation as a table and propose a single agreed definition to be printed on the report footer going forward. In one case the entire gap was 14 items the client had uploaded twice.

## Coaching & feedback

Coaching is how a team lead converts QC data into better agents. The QC log tells you what went wrong; coaching changes what happens tomorrow. It is a skill with a structure, not a personality trait, and interviewers for lead roles test it with scenarios.

### The feedback loop

```text
QC finds error → logged with type + note → returned to agent same shift
   → agent fixes and acknowledges → weekly 1:1 reviews the pattern
   → coaching plan if a pattern persists → re-measure in 2 weeks
```

Speed is the key variable. Feedback on an item the agent processed an hour ago is instantly useful; feedback on an item from last week is a history lesson.

### Feedback in the moment

For a single error, use a short, factual pattern: **what** was observed, **why** it matters, **what** to do instead. Under a minute, at the agent's desk or in a chat message.

```text
"TN-00412 was coded as Mortgage; the header on page 1 says Assignment of Mortgage.
 The client uses that to trace the lender chain, so the wrong type breaks their search.
 When 'Assignment' appears in the first five lines, code it E-ASGN. Can you re-do it now?"
```

No preamble, no apology, no lecture. The agent needs the item ID, the fact, the impact and the rule.

### The weekly 1:1

Fifteen minutes per agent per week, scheduled, not skipped when the shift is busy. Fixed agenda:

1. Their scorecard: attainment, accuracy, top error type.
2. What they found difficult this week.
3. One thing to improve and how (specific, measurable).
4. Anything they need from you.

Keep notes in one sheet per agent: date, numbers, agreed action, review date. When you later need to justify a promotion or a performance plan, this sheet is your evidence.

### Diagnosing before coaching

Not every performance gap is a skill gap. Ask which of these it is before choosing a response:

| Cause | Symptom | Response |
|---|---|---|
| Does not know | Same error type repeatedly, follows SOP literally | Training, examples, job aid |
| Cannot do | Knows the rule but slow or inconsistent | Practice with feedback, shortcuts, tooling |
| Will not do | Capable on some days, not others | Motivation conversation, expectations, consequences |
| Cannot because of the system | Errors cluster on certain document types or tools | Fix the process, not the person |

The fourth row is the one most leads miss. If eight agents all make the same error on the same document type, the SOP is wrong.

### The performance improvement plan (PIP)

When coaching has not worked over 4–6 weeks, formalise it. A PIP is a written document with: the current numbers, the required numbers, the specific support provided, weekly check-in dates and a final review date (typically 30 days). It is signed by both parties and shared with HR. It is not a punishment; it is a clear last chance with support, and a fair number of agents pass it.

```text
PERFORMANCE IMPROVEMENT PLAN – 30 days
Agent: ______   Process: Title indexing   Start: 15 Sep 2026   Review: 15 Oct 2026
Current: attainment 82%, field accuracy 97.6%  |  Required: 95%, 98.5%
Support: 2 h refresher on document types (Wk1); daily 100% QC with same-shift feedback (Wk1–2);
         paired with senior agent 1 h/day (Wk1–3)
Check-ins: every Monday 21:30 with the TL, numbers recorded below
Outcome if met: plan closed, normal sampling resumes. If not met: HR review.
```

### Recognition is coaching too

Publicly recognise specific behaviours, not just numbers: "Bilal caught a duplicate upload today before it reached QC" teaches the team what good looks like. Rotate recognition; if the same two names come up every week the rest of the team stops listening.

> **Interview note:** Scenario questions ("an agent's accuracy dropped from 99% to 96% this week") want to hear diagnosis before action: look at the errors, talk to the agent, rule out a process cause, then coach.

### Try It Yourself

```text
1:1 notes sheet (one tab per agent)

Date        Attain  FieldAcc  TopErr  Discussed                      Agreed action                    Review
2026-09-08   91%    98.1%     E05     Confusing ASGN vs MTG headers  Header guide; 100% QC for 5 days  2026-09-15
2026-09-15   97%    99.0%     E04     Name spelling on hand-written   Zoom to 200% on handwriting       2026-09-22
2026-09-22  101%    99.4%     -       Back on track                   Resume 20% sampling               2026-10-06
```

### Quiz

1. What is the most important property of feedback on an error?
- [ ] It is delivered by the manager
- [x] It is fast, specific and includes what to do instead
- [ ] It is written in the monthly report
> Same-shift feedback with item ID, impact and rule changes behaviour; late feedback does not.

2. Eight agents make the same error on the same document type. What is the likely cause?
- [ ] Eight careless agents
- [x] A process or SOP problem
- [ ] Bad luck
> When an error is widespread and specific, fix the process rather than coaching individuals.

3. What is a PIP?
- [x] A written, time-bound plan with required numbers, support and review dates
- [ ] A verbal warning
- [ ] A bonus scheme
> A PIP formalises expectations and support after informal coaching has not worked.

### Exercises

1. **Write in-the-moment feedback** — An agent entered the mortgage amount as 15,000 instead of 150,000 on item TN-00433. Write the message.
<details><summary>Solution</summary>

"TN-00433: amount entered 15,000; the instrument shows $150,000.00 on page 1 line 4. The amount feeds the client's lien search, so a factor-of-ten error is critical. Read the amount in words on the same line and match it to the digits before entering. Please correct it now and I'll re-QC."

</details>

2. **Diagnose** — An agent's accuracy is 99% on deeds but 94% on mortgages; every other agent is above 98% on both. Which cause row applies and what do you do?
<details><summary>Solution</summary>

"Does not know" or "cannot do" specific to mortgages, not a process problem since others are fine. Sit with them on five mortgages, identify the missed step (often rider pages or multiple borrowers), provide a job aid, and run 100% QC on their mortgages for a week with same-shift feedback.

</details>

### Interview Questions

**Q: How do you give feedback to an underperforming agent?**
Quickly, privately and specifically. For an individual error I give the item ID, what was wrong, why it matters to the client and the rule to apply, within the same shift so the item is fresh. For a pattern I use the weekly 1:1: we look at their scorecard together, I ask what they find difficult, and we agree one specific improvement with a review date, recorded in their notes sheet. Before coaching I diagnose whether it is a knowledge, skill, motivation or process cause, because the response is different for each. One agent on my team went from 82% to 100% attainment in three weeks once we discovered the real issue was not knowing the keyboard shortcuts in the indexing tool.

**Q: Tell me about a time you had to put someone on a performance plan.**
An agent's accuracy had been under SLA for five weeks despite informal coaching. I drafted a 30-day plan with the current and required numbers, the specific support (a refresher session, daily 100% QC with same-shift feedback, and pairing with a senior agent for an hour a day), weekly check-ins on Mondays and a review date, and shared it with HR. I framed it as support with a clear bar, not a threat. He reached 98.7% by week three and the plan closed successfully; the honest framing and the visible support were what made the difference.

**Q: How do you balance coaching time with hitting the daily target?**
By scheduling coaching rather than hoping for a quiet moment. Fifteen-minute 1:1s were booked for the first hour of the shift when the queue was being allocated and QC had not yet started, four agents a day, so the whole team was covered weekly. In-the-moment feedback took under a minute and was tied to rework anyway, so it cost nothing extra. The trade-off is real on peak days, and on those I would push 1:1s by a day but never cancel the week, because every skipped 1:1 shows up as errors two weeks later.

## Escalations & client queries

An **escalation** is any issue that a team lead cannot resolve alone and must pass upward or across: a missing image the client must resend, a rule the SOP does not cover, a system outage, a TAT at risk. Handling escalations well is what separates a lead the client trusts from one they route around. Most of this happens over Outlook 365 and Microsoft Teams chat, so the writing matters as much as the judgement.

### What escalates and to whom

| Issue | Escalate to | Timing |
|---|---|---|
| Illegible or missing source image | Client operations contact | Same shift, batched every 2 hours |
| Rule not covered by SOP | Client process owner (copy own manager) | Before processing affected items; HOLD them |
| TAT at risk (> 5% of volume) | Own manager, then client | As soon as known, with a number |
| Production tool outage | IT service desk, own manager | Immediately, with ticket number |
| Agent conduct or HR matter | Own manager, HR | Same day, in private |

The rule is: escalate **early**, with a **number**, and with a **proposed action**. "We may be late" is a worry; "we will deliver 1,050 of 1,300 by TAT, the remaining 250 by 10:00 CT, unless you prefer we prioritise mortgages" is an escalation.

### Writing a client query email

Client queries are batched (not one email per item), numbered, and written so the client can answer with minimal effort. A working template:

```text
Subject: Query Batch 14-Sep – Title Indexing – 3 items on HOLD

Hi Jennifer,

Three items from tonight's batch are on hold. Details below; the rest of the batch
(1,237 items) is on track for delivery by 05:30 PKT / 19:30 CT.

#  Item ID    Issue                          Our proposal
1  TN-00517   Page 2 image missing            Re-scan needed; will process on receipt
2  TN-00522   Handwritten grantor illegible   Index as "ILLEGIBLE" per SOP 4.3 unless you advise
3  TN-00590   Instrument type not in SOP list Suggest "Affidavit of Heirship" (new code?)

Could you confirm items 2 and 3 by your end of day? Item 1 will be processed as soon
as the re-scan arrives.

Thanks,
Ali Raza | Team Lead, Data Processing | Systems Limited
```

Notice: the subject says what and how many; the first line says what is fine; the table has an ID, an issue and a proposal; the ask is explicit with a deadline.

### Outlook 365 habits that save time

- **Rules**: Home → Rules → Manage Rules & Alerts → New Rule: move client emails with "Query" in the subject to a Queries folder and flag them.
- **Quick Parts** (Insert → Quick Parts → Save Selection): store the query template so it is two clicks away.
- **Categories** with colours for Open / Awaiting client / Closed, and a search folder for "Awaiting client older than 1 day".
- **Delay Delivery** (Options → Delay Delivery) to send a batch at 07:00 CT so it is at the top of the client's inbox.
- Track every open query in a sheet: ID, date sent, question, response date, resolution. Follow up if there is no response within one client business day.

### Teams chat with the client

Chat is for urgent, short, binary questions ("is a re-scan of TN-00517 coming tonight?"). Anything that needs a record goes to email. When a chat produces a decision, paste it into the email thread or the query sheet the same shift, because chat history is not something you can attach to an audit.

### Handling the angry escalation

When the client escalates to you (a late batch, a critical error they found):

1. Acknowledge within 15 minutes, even if the answer is "investigating, update in one hour".
2. State the facts you have, not the ones you hope for.
3. Give the fix, the time, and the preventive action.
4. Follow up in writing when it is closed.

Never argue definitions in the heat of it; agree to reconcile the numbers separately.

> **Tip:** Keep an escalation log: date, issue, raised to, response time, resolution. In the monthly report it becomes a table that shows the client how responsive both sides were.

### Try It Yourself

```text
Escalation log (Excel tab)

Date        Type        Item/Ref     Raised to        Raised at  Responded  Resolution                  Status
2026-09-14  Missing img TN-00517     J. Moore (client) 03:40      09:15      Re-scan received, processed  Closed
2026-09-14  SOP gap     TN-00590     R. Patel (client) 03:40      -          Awaiting new code decision   Open
2026-09-13  Tool outage INC0048812   IT Service Desk   22:10      22:25      Restored 23:05; 55 min lost  Closed
2026-09-12  TAT risk    Batch 12-Sep Ops Manager       01:30      01:40      2 agents borrowed from QC    Closed
```

### Quiz

1. What are the three components of a good escalation?
- [ ] Apology, explanation, promise
- [x] Early timing, a number, a proposed action
- [ ] Subject line, greeting, signature
> "We will deliver 1,050 of 1,300 by TAT; propose prioritising mortgages" is early, numeric and actionable.

2. How should client queries be sent?
- [ ] One email per item as soon as it is found
- [x] Batched, numbered, with a proposal for each item and an explicit ask
- [ ] By chat only
> Batching respects the client's time; a proposal per item lets them answer with a yes.

3. A decision is agreed in Teams chat. What should you do?
- [ ] Nothing, the chat is the record
- [x] Copy it into the email thread or the query sheet the same shift
- [ ] Delete the chat
> Chat is not a durable record; decisions must be captured where they can be audited.

### Exercises

1. **Write a TAT-risk escalation** — At 01:30 you have 1,300 items due at 05:30 and the team is at 40% instead of the planned 55%. Two agents are absent. Write the message to your manager.
<details><summary>Solution</summary>

"TAT risk – Batch 14-Sep. At 01:30 we are at 40% (520/1,300) vs plan 55%; two unplanned absences. Projection: 1,100 by 05:30, remaining 200 by 08:00 PKT. Options: (a) borrow 2 QC staff for processing for 3 hours, which closes the gap; (b) inform the client now and prioritise mortgages. I recommend (a) plus a heads-up to the client. Please confirm by 01:45."

</details>

2. **Set up an Outlook rule** — Describe the exact steps to move any email from the client domain with "Query" in the subject into a folder and flag it.
<details><summary>Solution</summary>

Home → Rules → Manage Rules & Alerts → New Rule → "Apply rule on messages I receive" → conditions: "from people or public group" (enter the client domain) and "with specific words in the subject" (Query) → actions: "move it to the specified folder" (Queries) and "flag message for follow up" → name the rule → Finish, and tick "Run this rule now on messages already in the Inbox" if needed.

</details>

### Interview Questions

**Q: How do you handle client queries and escalations?**
With a batching-and-proposal approach. Queries are collected during the shift and sent every two hours or at a fixed time, numbered, with an item ID, the issue and my proposed handling for each, so the client can approve with one word. The first line always states that the rest of the batch is on track, because the client's first fear is the whole delivery. Everything is tracked in a query log with sent and response times, and I follow up after one client business day. For risks on our side, I escalate as soon as I know, with a number and options, because a client who hears "1,100 of 1,300 by TAT, rest by 08:00, here are two options" at 01:30 is a partner; the same client hearing nothing until 05:30 is a complaint.

**Q: Tell me about a time a client was unhappy with your team's work.**
A client found a critical error in a delivered batch: a mortgage amount off by a factor of ten. I acknowledged within ten minutes, confirmed the error, corrected and re-delivered the item within the hour, and then ran a targeted check of every amount field in that batch, which found one more. I sent a short written summary the same day: what happened, the two corrected items, and the preventive step, which was adding a check that the amount in words matches the digits to the SOP and the QC checklist. The client's reply was that the response was the reason they kept the account with us. The lesson I carry is that speed and honesty in the first hour matter more than anything said later.

**Q: When should a team lead escalate versus solve it themselves?**
Solve it when it is within my authority and the SOP: reallocating work, coaching, re-sending a query, restarting a tool. Escalate when it needs a decision I cannot make (a new rule or code), a resource I do not control (extra agents, IT), or when a risk to the SLA exceeds a threshold I have agreed with my manager, typically 5% of daily volume. The mistake is escalating problems without a proposal, which just moves the work upward. I bring the number, two options and a recommendation, and I escalate early enough that the option still exists.

## Handling IT & facility issues

Production stops when the tools stop. A team lead does not fix servers, but is responsible for minimising lost time, keeping the record and making sure the client hears about downtime from you before they notice it. This chapter covers the IT service desk, the most common failures on a BPO floor and how to keep the queue moving when something breaks.

### The common failures

| Failure | Typical cause | Immediate action |
|---|---|---|
| Production tool down for everyone | Server, database or VPN outage | Raise a P1 ticket; call the desk; switch to offline work |
| Tool slow for everyone | Network congestion, batch job on the server | Ticket; ask agents to log AHT impact; adjust target |
| One agent cannot log in | Password expiry, locked account, profile corruption | Reset via desk; agent works from a spare machine |
| Client SFTP / shared drive unreachable | Credential change, firewall, client-side outage | Ticket both sides; confirm with client contact |
| Power or internet failure (facility) | Generator failover, ISP outage | Facilities; failover check; inform client of delay |
| Machine hardware failure | Disk, RAM, monitor | Swap to spare; ticket for repair |

### The ticket

Every IT issue gets a ticket, even if it is fixed in five minutes, because the ticket history is your evidence in the monthly report when downtime caused a TAT miss. A useful ticket contains:

```text
Title:     Indexing tool (TitleIndex v4.2) unavailable for all 20 users – Floor 3
Priority:  P1 (production stopped)
Impact:    20 agents idle; 1,300 items due 05:30 PKT; client SLA at risk after 60 min
Started:   22:10 PKT, 14 Sep 2026
Symptoms:  Login page returns "HTTP 503 Service Unavailable"; VPN connected; other sites fine
Tried:     Browser cache cleared, 2 machines tested, VPN reconnected
Contact:   Ali Raza, ext 4412, Teams
```

Priority definitions matter. P1 usually means production stopped for many users, P2 degraded or one user stopped, P3 no production impact. Do not raise everything as P1 or the desk stops believing you; do not raise a floor outage as P3 out of politeness.

### While the tool is down

Idle agents are the most expensive thing on the floor. Keep a **downtime plan** ready and start it within ten minutes:

1. Switch to any offline work: pre-sorting images, reviewing SOP updates, calibration exercises, pending rework that can be prepared from the image.
2. Note the outage start time in the shift log and start a downtime timer.
3. Inform your manager at 15 minutes, the client at 30 minutes (or sooner if TAT is threatened), with the ticket number.
4. Recompute the target at restoration: remaining items / remaining productive hours / agents.

```excel
' Downtime impact
Lost minutes:     =(Restored-Started)*1440              ' 55
Lost items:       =ROUND(Lost_minutes/60*IPH*Agents,0)  ' 55/60*13.3*19 = 232
Revised per-agent target for remaining hours:
=ROUNDUP((Total_due - Done_so_far)/Agents_present,0)
Feasible by TAT?  =IF(Revised_target <= IPH*Remaining_hours,"Yes","No – escalate")
```

### Facility basics a lead is responsible for

Seating plan (who sits where, which machines have the special scanner software), spare machines (at least one per ten agents, logged in and tested weekly), backup power test dates, and the ISP failover contact. Once a month, walk the floor and test the spare machine yourself.

### Security hygiene

BPO floors handling US real-estate data are under confidentiality obligations. The lead enforces: no USB storage, no personal phones on the floor with the client's images visible, screen lock at 5 minutes (Windows: Settings → Accounts → Sign-in options → "If you've been away"), unique logins (no shared accounts, ever), and an immediate ticket if an agent's account behaves oddly. A single confidentiality breach ends accounts faster than any accuracy miss.

> **Warning:** Never let agents "work around" an outage by processing from screenshots on personal devices or emailing client images to themselves. The convenience is small and the contractual risk is enormous.

### Try It Yourself

```text
Shift log entries for an outage (keep in OneNote or a Teams post, one line per event)

22:10  Indexing tool 503 for all users. Ticket INC0048812 raised P1. Downtime plan started.
22:12  Agents switched to image pre-sort for batch 15-Sep.
22:25  IT desk confirms database node failover in progress, ETA 30 min.
22:40  Manager informed (15 min mark). Client contact informed via Teams with ticket no. and ETA.
23:05  Tool restored. Downtime 55 min. Lost capacity est. 232 items.
23:08  Target recomputed: 1,300 - 40 done = 1,260 / 19 = 67 each over 5.9 h -> 11.4/h needed vs 13.3 capacity. Feasible.
05:20  Delivered 1,300 / 1,300. Outage noted in daily report section 3 with ticket no.
```

### Quiz

1. Why raise a ticket for an issue fixed in five minutes?
- [ ] IT requires it
- [x] The ticket history is the evidence for downtime in reports and reviews
- [ ] To get the agent in trouble
> Downtime records explain TAT misses and support requests for infrastructure investment.

2. The production tool goes down for all 20 agents. What priority should the ticket be?
- [x] P1
- [ ] P3
- [ ] No ticket needed
> Production stopped for many users is the definition of P1.

3. An agent suggests taking photos of the screen to keep processing during an outage. What do you say?
- [ ] Good initiative
- [x] No; client data on personal devices is a confidentiality breach
- [ ] Only if the client agrees by chat
> Security obligations override the convenience of continuing work.

### Exercises

1. **Compute the impact** — An outage runs 21:30–22:45 with 18 agents at 12 items per hour. How many items were lost, and if 1,200 are due at 05:30 with 0 done, what per-hour rate per agent is now required?
<details><summary>Solution</summary>

75 minutes = 1.25 h × 12 × 18 = 270 items lost. Remaining time 22:45–05:30 = 6.75 h, minus roughly 0.75 h shrinkage = 6 h. 1,200 / 18 = 66.7 per agent / 6 h = 11.1 per hour, under the 12 capacity, so feasible with no slack.

</details>

2. **Write the client notification** — Draft the 30-minute Teams message to the client for the outage above.
<details><summary>Solution</summary>

"Hi Jennifer, heads-up: our indexing tool has been down since 21:30 PKT (ticket INC0048812, P1, ETA 30 min). Team is pre-sorting images meanwhile. Current projection is still full delivery of 1,200 by 05:30 PKT; I'll confirm at 23:30 or sooner if that changes."

</details>

### Interview Questions

**Q: How do you handle a production system outage during your shift?**
I have a downtime plan ready before it happens. Within ten minutes of an outage I raise a P1 ticket with impact, start time, symptoms and what we have tried, switch agents to offline work such as image pre-sorting or rework preparation, and start a downtime timer in the shift log. I inform my manager at 15 minutes and the client at 30 with the ticket number and ETA. When the tool is back I recompute the per-agent target for the remaining hours and check it against capacity; if it is not feasible I escalate with options. Afterwards the outage goes into the daily report with the ticket number so a TAT miss is explained with evidence rather than excuses.

**Q: What would you do if an agent could not log in but everyone else could?**
Move them to the spare machine first so they are productive within five minutes, then raise a P2 ticket for the account, since it is a single-user issue. Common causes are password expiry or a locked account, which the desk resolves quickly. If the spare also fails for that user, the account itself is the problem and I would ask the desk to check whether it has been disabled, because in a regulated environment an unexpected disable can also mean a security flag that I need to know about.

**Q: What security practices did you enforce on the floor?**
No USB storage, no personal phones where client images were visible, five-minute screen lock, unique logins with no shared credentials, and no client data leaving the production tool by any route including screenshots or personal email. I did a monthly floor walk to check screen locks and spare machines, and any odd account behaviour became an immediate ticket. The reason I was strict is that US title data includes names, addresses and loan amounts, and the client's contract with us depended on their confidence in our handling; one breach would have cost more than a year of accuracy misses.

# LEVEL: Advanced

## SOP & process documentation

A **Standard Operating Procedure (SOP)** is the written definition of how a process is performed. It is the contract between the client's expectations and the agent's keystrokes. A bad SOP produces the "eight agents make the same error" pattern from the coaching chapter. Ali's document-production background is a genuine advantage here: an SOP is a technical document with structure, versioning and screenshots, and the same Word discipline (styles, captions, automated TOC) that builds a 767-page handbook builds a usable SOP.

### Start with a SIPOC

Before writing steps, draw the boundaries. **SIPOC** stands for Suppliers, Inputs, Process, Outputs, Customers. It fits on one page and prevents the most common SOP failure: documenting the keystrokes without saying where the work comes from or who consumes it.

```text
SUPPLIERS      INPUTS                 PROCESS (5–7 steps)         OUTPUTS               CUSTOMERS
Client SFTP    Recorded doc images    1 Download batch            Indexed records (CSV)  Client title plant
County clerk   Batch manifest (.xlsx) 2 Validate manifest count   Exception list         Client ops contact
Client SOP     Instrument code list   3 Allocate to agents        Daily report           Ops manager
               Holiday calendar       4 Index fields per doc      QC log
                                      5 QC sample & rework
                                      6 Export & upload
                                      7 Report
```

### Structure of the SOP

| Section | Contents |
|---|---|
| 0. Control block | Title, ID (SOP-TI-004), version, effective date, owner, approver, review date |
| 1. Purpose & scope | What the process is for, what is in and out of scope |
| 2. Definitions | Terms and codes (instrument types, statuses) |
| 3. Roles | Who does what (agent, QC, TL) |
| 4. Procedure | Numbered steps, one action per step, screenshot where the screen matters |
| 5. Exceptions | What to do when the input is not as expected (illegible, missing page, unknown type) |
| 6. Quality criteria | What QC checks, the taxonomy, severity |
| 7. References | Client documents, related SOPs, job aids |
| 8. Revision history | Version, date, change summary, author |

Section 5 is the one that separates a real SOP from a training deck. Most errors happen on exceptions, and most SOPs do not describe them.

### Writing the procedure steps

One action per step, in the imperative, with the expected result:

```text
4.6  Select the instrument type from the Doc Type dropdown.
     Read the title in the first five lines of page 1. Use Table 2.1 to map the title to a code.
     Expected: the code appears in the Doc Type field and the field turns green.
     If the title is not in Table 2.1, go to 5.3 (Unknown instrument type).
4.7  Enter the recording date exactly as stamped, in MM/DD/YYYY.
     Expected: no red border. A red border means the date is in the future or before 1900; re-check the stamp.
```

Screenshots: crop to the relevant area, add a numbered red box for the field, caption it with a Word caption (References → Insert Caption) so figures number automatically and the list of figures updates itself. Blur any real party names before the screenshot leaves the client's environment.

### Versioning

Use semantic-style numbering: 1.0 is the first approved version, 1.1 a minor clarification, 2.0 a change in the procedure itself. Every change goes into the revision history with what changed and why, and the effective date is when agents must start following it. Keep the current version in one place (SharePoint or the client's portal) with a read-only link; agents must not keep local copies, because a stale local SOP is the most common source of "but the SOP said" arguments.

```text
Version  Date        Author    Change
1.0      2026-03-02  A. Raza   Initial release
1.1      2026-04-15  A. Raza   Added "Affidavit of Heirship" (code AFHR) to Table 2.1 after client query 14-Apr
1.2      2026-06-01  A. Raza   Clarified 5.2 illegible-name rule: enter ILLEGIBLE, do not guess
2.0      2026-09-01  A. Raza   Procedure change: rider pages now indexed separately (client change request CR-22)
```

### Job aids

An SOP is for reference; a **job aid** is a one-page extract for the desk: the instrument-code table, the exception decision tree, the top-five errors and how to avoid them. Job aids are where SOP content actually changes behaviour. Every SOP release should ship with an updated job aid.

> **Tip:** Test the SOP by giving it to a new agent with no verbal explanation and watching where they stop. Every stop is a missing step or an ambiguous sentence.

### Try It Yourself

```text
SOP-TI-004  Title Indexing – Deeds & Mortgages            Version 2.0   Effective 2026-09-01
Owner: Team Lead, Data Processing        Approver: Client Process Owner      Review: 2027-03-01

1. Purpose: Index recorded deed and mortgage instruments into the client title plant format.
   Scope: Batches received via client SFTP for TN and WY counties. Out of scope: plats, UCC filings.
2. Definitions: Instrument = one recorded document. Batch = one manifest and its images.
   Codes: see Table 2.1 (WD Warranty Deed, QCD Quitclaim Deed, MTG Mortgage, ASGN Assignment, REL Release, AFHR Affidavit of Heirship)
3. Roles: Agent indexes; QC samples 20% (100% for agents in training); TL allocates, escalates, reports.
4. Procedure: 4.1 Download batch ... 4.12 Mark item DONE.
5. Exceptions: 5.1 Missing page → HOLD + query. 5.2 Illegible name → "ILLEGIBLE". 5.3 Unknown type → HOLD + query.
6. Quality: taxonomy E01–E09; critical = wrong parcel, wrong amount, missing book/page.
7. References: Client Indexing Standards v3 (2026-02); SOP-QC-001 Sampling.
8. Revision history: see table.
```

### Quiz

1. What does SIPOC stand for?
- [ ] Steps, Inputs, People, Outputs, Controls
- [x] Suppliers, Inputs, Process, Outputs, Customers
- [ ] Scope, Instructions, Procedure, Outcome, Checklist
> SIPOC is a one-page boundary map drawn before the detailed procedure is written.

2. Which SOP section is most often missing and most responsible for errors?
- [ ] Definitions
- [x] Exceptions
- [ ] Revision history
> Errors cluster on inputs that are not as expected, which is exactly what the exceptions section covers.

3. What version number should a change to the procedure itself get?
- [ ] 1.1 → 1.2
- [x] 1.2 → 2.0
- [ ] No change, just update the date
> Minor clarifications increment the second digit; procedure changes increment the first.

### Exercises

1. **Write three exception rules** — For a form-building process: the client's brief lists a field with no type; two fields have the same name; a required logo file is missing.
<details><summary>Solution</summary>

5.1 Field with no type: create it as a text field, flag it in the delivery note under "Assumptions", and ask the client to confirm. 5.2 Duplicate field names: rename the second with a numeric suffix (Name_2) only if it is visually distinct; otherwise HOLD and query, since identical names would mirror values. 5.3 Missing logo: HOLD the cover page, complete everything else, and request the file with the required format (PNG or SVG, minimum 300 dpi).

</details>

2. **Draw a SIPOC** — For "produce the weekly status report for multi-state title production".
<details><summary>Solution</summary>

Suppliers: state production teams, QC, the production database. Inputs: weekly volume extracts per state, QC logs, TAT data, escalation log. Process: extract data, validate totals against the daily reports, compute KPIs per state, build variance commentary, review with manager, publish. Outputs: weekly status report (PDF + Excel), action list. Customers: production management, state managers, client account team.

</details>

### Interview Questions

**Q: How do you write an SOP that agents actually follow?**
I start with a SIPOC so the boundaries are clear, then write numbered steps with one action each, the expected result and where to go if it is not as expected, with cropped, captioned screenshots. The exceptions section gets as much attention as the main procedure, because that is where errors happen. I test it by giving it to a new agent without explanation and noting every place they stop. Each release ships with a one-page job aid for the desk and a versioned revision history, and the current version lives in one read-only location so nobody works from a stale copy. Following the SOP is then enforced through the QC taxonomy, which includes a "procedure" error type.

**Q: How did you manage SOP changes when the client changed a rule?**
Through a small change-control loop. The client's request was logged with a reference, I drafted the change and the affected steps, the client approved it in writing, and it was released as a new version with an effective date, a revision-history line and an updated job aid. I briefed it in the huddle and ran 100% QC on affected items for three days. When the client asked us to index rider pages separately, that became version 2.0 because the procedure itself changed, and the three-day 100% QC caught a misunderstanding on the first night rather than a week later.

**Q: What is the difference between an SOP and a job aid?**
An SOP is the complete, controlled reference: purpose, scope, roles, every step, every exception, quality criteria and history. A job aid is a one-page extract that sits on the desk and answers the questions agents actually have during work, such as the instrument-code table or the exception decision tree. The SOP is for training, audit and dispute resolution; the job aid is for speed. Both come from the same source, and updating one without the other is how teams drift.

## Root-cause analysis for accuracy drops

When accuracy drops, the instinct is to tell the team to be more careful. That is not a corrective action; it is a wish. **Root-cause analysis (RCA)** is a set of tools for finding the cause you can actually fix. This chapter covers the three you will use most: **Pareto**, **5 Whys** and the **fishbone (Ishikawa)** diagram, applied to a real-style accuracy drop.

### Start with the data: Pareto

The Pareto principle says a few causes produce most of the effect. A Pareto chart is a bar chart of error counts by type, sorted descending, with a cumulative-percentage line. It tells you where to look.

```text
Week 37 errors (n = 96)
Type                     Count   %     Cumulative
E05 Wrong document type    34   35.4%    35.4%
E03 Transposition          21   21.9%    57.3%
E04 Spelling / format      17   17.7%    75.0%
E02 Wrong value            12   12.5%    87.5%
E01 Missing value           8    8.3%    95.8%
Other                       4    4.2%   100.0%
```

Three types account for 75% of errors. Fixing E05 alone would lift item-level accuracy more than any general "be careful" reminder.

Build it in Excel: PivotTable of the QC log with rows = Type and values = Count, sort descending (right-click → Sort → Largest to Smallest), then Insert → Insert Statistic Chart → Pareto (Excel 2016+), or add a cumulative column manually and chart it as a combo.

### Slice the top type

Once you have the top type, cut it by every dimension in the log: agent, document type, time of shift, source county. Patterns appear quickly.

```excel
' E05 errors by agent
=COUNTIFS(QCLog!D:D,"E05", QCLog!C:C, A2)
' E05 errors by hour of shift (Time in QCLog!F)
=COUNTIFS(QCLog!D:D,"E05", QCLog!F:F,">="&TIME(A2,0,0), QCLog!F:F,"<"&TIME(A2+1,0,0))
' E05 errors by source county (County in QCLog!G)
=COUNTIFS(QCLog!D:D,"E05", QCLog!G:G, A2)
```

Suppose the slice shows 28 of the 34 E05 errors are from one county whose deeds arrived this week for the first time, spread across 11 agents. That is not an agent problem.

### 5 Whys

Ask "why" repeatedly until you reach something you can change.

```text
Problem: 34 wrong-document-type errors this week, up from 6.
Why? 28 are on Shelby County documents, misread as Mortgage instead of Deed of Trust.
Why? Shelby County uses "Deed of Trust" as the instrument title; agents mapped it to MTG.
Why? Table 2.1 in the SOP has no entry for "Deed of Trust"; agents picked the closest.
Why? The SOP was written for Wyoming, where the instrument is called a Mortgage; Tennessee was added without updating the code table.
Why? There is no checklist step for "review instrument code table" when a new state or county is onboarded.
Root cause: onboarding a new county does not trigger an SOP code-table review.
```

Stop at the "why" that yields a fix within your control. Going further ("why does the company not have a process team?") is not useful.

### Fishbone for complex drops

When the Pareto does not point to one thing, brainstorm causes in categories. The classic six for operations are **Method, Machine, Material, Manpower, Measurement, Environment**.

```text
                       Method                Machine              Material
             SOP missing DoT code      Tool dropdown order      New county image quality
             No new-county checklist   Slow tool at 02:00       Handwritten margins
                          \                  |                     /
                           \                 |                    /
   ------------------------------------------------------------------>  Accuracy fell 99.4% → 98.6%
                           /                 |                    \
             2 new agents in wk 36    QC sampled first 20%     Heat, AC fault 12–13 Sep
             Overtime 3 nights        Calibration skipped wk 37
                       Manpower             Measurement           Environment
```

Then test each candidate with data. "QC sampled the first 20%" is a **measurement** cause: the number might have been wrong, not the work. Check that before anything else.

### Corrective vs preventive action

| Type | Definition | Example |
|---|---|---|
| Correction | Fix the affected items | Re-code the 28 Shelby County items |
| Corrective action | Remove the cause of this occurrence | Add "Deed of Trust → DOT" to Table 2.1, release SOP 2.1 |
| Preventive action | Stop the class of problem recurring | Add a code-table review step to the new-county onboarding checklist |

A client review expects all three. Most teams stop at the first.

### The RCA record

One page: problem statement with numbers and dates, data (Pareto and slices), analysis (5 Whys or fishbone), root cause, actions with owners and dates, and a verification date with the metric that will show it worked. Keep them; a folder of RCAs is the best evidence in an audit that quality is managed rather than hoped for.

> **Interview note:** When asked "tell me about a time quality dropped", interviewers listen for whether you looked at the data before acting and whether your fix was to the process or just to the people.

### Try It Yourself

```excel
' Pareto table from the QC log (Excel 365)
' A: unique types sorted by count desc
=SORTBY(UNIQUE(QCLog!D2:D5000), COUNTIF(QCLog!D2:D5000, UNIQUE(QCLog!D2:D5000)), -1)
' B: count per type
=COUNTIF(QCLog!D:D, A2)
' C: share
=B2/SUM(B:B)
' D: cumulative share
=SUM($B$2:B2)/SUM(B:B)
' E: flag "vital few" (within first 80%)
=IF(D2<=0.8,"Focus","")
' Then Insert → Combo chart: B as clustered column, D as line on secondary axis
```

### Quiz

1. What does a Pareto chart show?
- [ ] Errors over time
- [x] Error counts by category, sorted, with cumulative percentage
- [ ] Accuracy per agent
> Pareto sorts causes by size so you can see the vital few.

2. When should you stop asking "why" in a 5 Whys analysis?
- [ ] After exactly five
- [x] When you reach a cause you can actually change
- [ ] When the agent admits fault
> The goal is an actionable root cause, not a fixed count.

3. Which is a preventive action?
- [ ] Re-coding the 28 wrong items
- [ ] Adding the missing code to the SOP
- [x] Adding a code-table review to the new-county onboarding checklist
> Preventive actions stop the class of problem recurring, not just this instance.

### Exercises

1. **Run the 5 Whys** — Transposed recording dates (E03) tripled in week 38. Slicing shows 80% happened between 03:00 and 05:00. Write a plausible 5 Whys.
<details><summary>Solution</summary>

Why? Most transpositions are in the last two hours of the shift. Why? Agents rush to hit target before the 05:00 checkpoint. Why? The allocation front-loads easy items so the hard ones are left for the end. Why? Allocation is done by item ID order, and the client's batch lists deeds before mortgages. Why? The allocation step in the SOP does not say to mix document types per agent. Root cause: allocation method concentrates difficult work at the end of the shift. Corrective: shuffle allocation by type. Preventive: add the mixing rule to SOP 4.3 and monitor E03 by hour weekly.

</details>

2. **Classify the actions** — For the Shelby County case, list one correction, one corrective action and one preventive action, each with an owner and a verification metric.
<details><summary>Solution</summary>

Correction: re-code 28 items (owner: QC lead, verified by 100% re-QC of the batch). Corrective: SOP 2.1 with DOT code and huddle briefing (owner: TL, verified by E05 count on Shelby County items next week ≤ 2). Preventive: onboarding checklist step "review code table with client for new state/county" (owner: ops manager, verified at the next county onboarding by checklist sign-off).

</details>

### Interview Questions

**Q: Tell me about a time accuracy dropped on your team and what you did.**
Field accuracy fell from 99.4% to 98.6% in one week, below our 98.5% margin of comfort. Before saying anything to the team I ran a Pareto on the QC log: one type, wrong document type, was 35% of errors, and slicing by county showed 28 of those 34 were from a newly added Tennessee county whose instruments are titled "Deed of Trust", spread across eleven agents. A 5 Whys took me to the SOP code table, which had no entry for that instrument because the SOP was written for Wyoming. I fixed the 28 items, released SOP 2.1 with the code, and added a code-table review to the new-county onboarding checklist so it could not recur. Accuracy was back at 99.3% the following week, and no agent was blamed, because none was at fault.

**Q: What tools do you use for root-cause analysis?**
Pareto first, because it tells me where to look; then slicing the top category by agent, document type, hour and source to find the pattern; then 5 Whys when the pattern points one way, or a fishbone across method, machine, material, manpower, measurement and environment when it does not. I always test the measurement branch early: if the QC sample was biased or a QC was uncalibrated, the drop may not be real. Every RCA ends with a correction, a corrective action and a preventive action, each with an owner, a date and a verification metric.

**Q: How do you distinguish a real accuracy drop from a measurement problem?**
Check the sample and the checkers before the agents. Was the sample random and the usual size? Did the QC roster change? Was calibration skipped? Did the taxonomy change? I compare the drop across QCs: if one QC's sample shows the drop and the others do not, that is calibration. I also compare item-level and field-level movement: a real process problem usually moves both, while a stricter QC tends to inflate minor errors and move field-level more than critical or major counts. Only when measurement is ruled out do I treat it as a production issue.

## Continuous improvement: Lean & Six Sigma basics

**Continuous improvement (CI)** is the habit of making the process a little better every week, with data. Two frameworks dominate operations: **Lean**, which removes waste, and **Six Sigma**, which reduces variation. At team-lead level you do not need a belt certification; you need the vocabulary, the DMAIC structure and two or three tools you can actually run on a BPO floor.

### Lean: the eight wastes

Lean's core idea is that anything that does not add value for the customer is waste. The classic list (DOWNTIME) mapped to a data-processing floor:

| Waste | On the floor |
|---|---|
| **D**efects | Rework from QC errors |
| **O**verproduction | Processing items the client did not ask for yet |
| **W**aiting | Agents idle for the batch, the tool, or a QC decision |
| **N**on-utilised talent | Senior agents doing simple indexing while juniors struggle with mortgages |
| **T**ransportation | Files moved between folders and tools manually |
| **I**nventory | Backlog and items sitting in QC |
| **M**otion | Alt-tabbing between the image viewer and the entry tool 40 times per item |
| **E**xtra processing | Double-keying fields the client does not use |

Walk the floor once a week with this list and you will always find something.

### A Lean tool you can run tonight: time observation

Sit with an agent, time each step of one item ten times, and write it down.

```text
Step                              Avg (s)   Value-adding?
Open image                            8      no (waiting)
Find instrument title                12      yes
Select doc type                       6      yes
Alt-tab to image, read parties       25      yes
Alt-tab back, type parties           20      yes
Scroll for recording stamp           18      no (motion)
Enter date / book / page             15      yes
Save, wait for confirmation           9      no (waiting)
Total                               113      non-value 35 s = 31%
```

Two monitors (image on one, tool on the other) remove the alt-tabbing; a keyboard shortcut to jump to the stamp removes the scroll. That is a 25% AHT improvement with no extra effort from the agent.

### Six Sigma: DMAIC

DMAIC is the project structure: **Define, Measure, Analyse, Improve, Control**.

1. **Define** the problem in numbers with a goal: "E03 transposition errors are 22% of errors; reduce to under 8% by end of October."
2. **Measure** the current state reliably: two weeks of QC data, calibrated QCs, sample size known.
3. **Analyse** with Pareto, slicing, 5 Whys, fishbone (previous chapter).
4. **Improve** with a tested change: pilot the fix with 5 agents for a week, compare against the other 15.
5. **Control** so it stays fixed: SOP update, job aid, a weekly check on the metric, a trigger if it rises again.

The pilot in step 4 is what makes it Six Sigma rather than guessing. If the 5 pilot agents drop to 6% while the 15 stay at 22%, you have evidence.

### Sigma level and DPMO

Six Sigma measures quality in **defects per million opportunities**. For a field-level accuracy figure:

```text
DPMO = Field errors / Fields checked * 1,000,000
Example: 23 errors in 2,280 fields  →  10,088 DPMO
Sigma level (approx, with 1.5 shift):  10,088 DPMO ≈ 3.8 sigma
Reference: 3 sigma ≈ 66,807 DPMO (93.3%);  4 sigma ≈ 6,210 (99.38%);  5 sigma ≈ 233 (99.977%);  6 sigma ≈ 3.4
```

Clients rarely ask for sigma levels in back-office contracts, but knowing that 99.0% field accuracy is "about 3.8 sigma" and that reaching 4 sigma means halving errors gives you a shared language with a client's process-excellence team.

### Control charts, briefly

A control chart plots the daily metric with a centre line (the mean) and upper/lower control limits (mean ± 3 standard deviations). A point outside the limits, or eight in a row on one side of the centre, is a **signal** to investigate; everything else is normal variation you should not react to.

```excel
' Daily field accuracy in B2:B31
Mean:  =AVERAGE(B2:B31)
SD:    =STDEV.S(B2:B31)
UCL:   =Mean+3*SD
LCL:   =Mean-3*SD
Signal: =IF(OR(B31>UCL,B31<LCL),"Investigate","Normal")
' Chart: line of B with three flat series for Mean, UCL, LCL
```

Reacting to every dip below yesterday is the single most common way leads waste their coaching time.

> **Tip:** Run one small CI project a month and write it up on one page: problem, baseline, change, result. Twelve of those is a promotion case.

### Try It Yourself

```text
DMAIC one-pager

DEFINE   E03 transposition errors = 22% of errors (21/wk). Goal: < 8% by 31 Oct. Owner: TL.
MEASURE  Baseline wk 36–37: 21, 19 per week; 80% between 03:00–05:00; all agents affected.
ANALYSE  Allocation front-loads deeds; hard items land in last 2 hours; fatigue + rush.
IMPROVE  Pilot wk 39: mixed-type allocation for 5 agents. Result: pilot 5% E03, control 21%.
         Roll-out wk 40 to all 20 agents.
CONTROL  SOP 4.3 updated (v2.1); weekly E03-by-hour check in the weekly report; trigger if > 10%.
RESULT   Wk 41–44 average 6% (5/wk). Field accuracy up 0.3 pts. AHT unchanged.
```

### Quiz

1. Which of these is a Lean waste?
- [x] Agents waiting for the tool to save
- [ ] Time spent reading the instrument title
- [ ] Entering the recording date
> Waiting is one of the eight wastes; reading and entering required data are value-adding.

2. What is the purpose of the Improve phase's pilot?
- [ ] To train the agents
- [x] To get evidence the change works by comparing pilot and control groups
- [ ] To delay the roll-out
> A pilot with a comparison group turns a guess into a measured result.

3. A daily accuracy point is below yesterday's but inside the control limits. What should you do?
- [ ] Coach the team immediately
- [x] Nothing special; it is normal variation
- [ ] Change the target
> Reacting to normal variation wastes effort; act on signals outside the limits or sustained runs.

### Exercises

1. **Compute DPMO** — A week's QC checked 3,100 items with 12 fields each and found 41 field errors. Give DPMO and approximate sigma level.
<details><summary>Solution</summary>

Opportunities = 37,200. DPMO = 41 / 37,200 × 1,000,000 ≈ 1,102. That is between 4 sigma (6,210) and 5 sigma (233), roughly 4.6 sigma; field accuracy 99.89%.

</details>

2. **Find the waste** — An agent's item requires opening the image in one tool, copying the parcel number into a browser search on the county site, then pasting the result into the entry tool. Name the wastes and propose one fix.
<details><summary>Solution</summary>

Motion (switching between three applications) and transportation (copying data by hand); potentially waiting on the county site. Fix: a small script or bookmarklet that opens the county search with the parcel number pre-filled, or a request to the client for a parcel lookup file so the search is a local VLOOKUP instead of a web query.

</details>

### Interview Questions

**Q: What continuous-improvement methods have you used?**
Mostly Lean waste-walks and DMAIC-structured small projects. A time observation on one agent showed 31% of item time was alt-tabbing and scrolling; a second monitor and a shortcut cut AHT by about 25% across the team. For a transposition-error problem I used DMAIC: defined a numeric goal, measured two weeks of baseline, analysed by hour of shift, piloted a mixed-type allocation with five agents against fifteen controls, rolled out when the pilot showed a fourfold drop, and put the check into the weekly report. I keep each project to one page so that the results are reviewable and the habit survives busy months.

**Q: Explain DMAIC in your own words.**
Define the problem with a number and a goal so everyone agrees what success means. Measure the current state properly, which usually means checking that the data collection itself is trustworthy. Analyse to find the cause, with Pareto and 5 Whys, not opinions. Improve by piloting a change with a comparison group so you have evidence rather than a hope. Control by changing the SOP, the job aid and the reporting so the improvement does not decay when attention moves on. The phases people skip are Measure and Control, and that is why so many improvements do not stick.

**Q: How do you decide whether a dip in a metric needs action?**
With a control chart. I plot the daily metric with its mean and three-sigma limits over the last 30 days; a point outside the limits or a run of eight on one side of the mean is a signal, and anything else is noise I should not react to. That discipline matters because reacting to noise produces random coaching and a team that stops trusting the numbers. When there is a signal, I go to the QC log and run the root-cause tools before I talk to anyone.

## Managing change & new client processes

New processes arrive constantly in a BPO: a new client, a new state's documents, a new field the client wants captured. The **ramp-up** is the most dangerous period for quality and TAT, and how a team lead manages it decides whether the client expands or leaves. This chapter gives a repeatable ramp-up plan: pilot, training, hypercare and steady state.

### The four phases

| Phase | Duration | Volume | QC rate | Goal |
|---|---|---|---|---|
| **Pilot** | 1–2 weeks | 5–10% of expected | 100% | Validate SOP, find exceptions, measure AHT |
| **Ramp** | 2–4 weeks | 25% → 100% | 100% → 50% | Train all agents, stabilise AHT |
| **Hypercare** | 2 weeks | 100% | 50% → 20% | Daily client calls, fast fixes |
| **Steady state** | ongoing | 100% | 20% | Normal SLA reporting |

Agree the phases and their exit criteria with the client before day one. The exit criterion for pilot is typically "AHT measured, SOP v1.0 signed off, accuracy ≥ 97% on 100% QC". Without written criteria, ramp-ups drift and the client starts counting the pilot against the SLA.

### The training plan

Train in layers: the process context first, then the tool, then the rules, then the exceptions, then supervised practice.

```text
Day 1  AM: Client & process overview (SIPOC), sample documents, why each field matters (1.5 h)
       PM: Tool walkthrough, 5 items done by the trainer on screen, 10 items paired (2 h)
Day 2  AM: SOP sections 4–5 with the job aid; instrument-code quiz (1 h); 20 items each, 100% QC (3 h)
       PM: Error review from the morning; exceptions workshop with 10 real tricky items (2 h)
Day 3  Full shift at 50% target, 100% QC, feedback within the hour
Day 4–5  Full shift at 75% target, 100% QC
Week 2  100% target, 100% QC; certification: 200 consecutive items at ≥ 98% field accuracy
Week 3+ Normal sampling; "certified" status recorded in the skills matrix
```

Certification is a number, not a feeling. An agent is certified on a process when they have met the accuracy bar on a defined volume, and the skills matrix records the date.

### The skills matrix

A grid of agents against processes with a level in each cell: 0 not trained, 1 in training, 2 certified, 3 can train others. It is the tool that lets you answer "can we take on 300 extra Tennessee mortgages tomorrow?" in ten seconds, and it is where cross-training gaps become visible.

```excel
' Skills!A agents, B..F processes with 0–3 levels
Certified for TN mortgages:   =COUNTIF(Skills!D:D,">=2")
Capacity tomorrow (items):    =COUNTIF(Skills!D:D,">=2")*IPH_TN_MTG*6.5
Single point of failure flag: =IF(COUNTIF(Skills!F:F,">=2")<3,"Risk: fewer than 3 certified","OK")
```

### Managing the client during ramp

Daily 15-minute calls during pilot and hypercare with a fixed agenda: volume done, accuracy, open queries, SOP changes, tomorrow's plan. Keep a **decision log**: every rule the client clarifies goes in with the date and the person, and feeds the next SOP version. In a typical pilot, thirty to fifty such clarifications happen; without a log they are lost in chat.

### Managing the team during change

People resist change when they do not know why it is happening or fear they will be judged on a process they have not learned. Counter both: explain the client's reason in the huddle, and state explicitly that the ramp targets are lower and that accuracy during training is measured for feedback, not for the scorecard. Pick two senior agents as **process champions** who learn first, help train and become the level-3 entries in the matrix.

### Risks to plan for

- AHT turns out higher than the client's estimate: report it in week one with data and renegotiate the volume or the price, not in week six.
- Image quality worse than the samples: collect ten examples and send them with the pilot report.
- Exceptions more frequent than expected: track the exception rate; above 10% the SOP needs work, not the agents.
- Key person absent during ramp: certify at least three agents before hypercare ends.

> **Warning:** Do not accept full volume before the pilot exit criteria are met, no matter how much pressure there is. A failed ramp-up costs far more than a two-week delay.

### Try It Yourself

```text
Ramp-up plan – TN Mortgages (new process)               Kick-off: 22 Sep 2026

Phase       Dates          Volume/day  Agents  QC    Exit criteria
Pilot       22 Sep–3 Oct        60        4    100%  SOP v1.0 signed; AHT ≤ 12 min; accuracy ≥ 97%
Ramp        6 Oct–24 Oct    150→600     4→16   100%→50%  12 agents certified (200 items @ ≥ 98%)
Hypercare   27 Oct–7 Nov       600       16    50%→20%  2 weeks at SLA; open queries < 5
Steady      10 Nov+            600       16    20%   Normal reporting

Roles: Champions – Sana, Bilal. Trainer – TL. QC – 2 dedicated during pilot/ramp.
Client calls: daily 21:30 PKT during pilot and hypercare; weekly thereafter.
Decision log: SharePoint → TN-MTG → Decisions.xlsx (owner TL).
```

### Quiz

1. What should be agreed with the client before a pilot starts?
- [ ] The bonus structure
- [x] The phases and their exit criteria
- [ ] The final SLA credit
> Written exit criteria stop the pilot being counted against the SLA and stop ramp drift.

2. What does "certified" mean in a skills matrix?
- [ ] The agent attended training
- [x] The agent met a defined accuracy bar over a defined volume
- [ ] The agent has been on the team for a year
> Certification is evidence-based, for example 200 consecutive items at 98% accuracy.

3. The measured AHT in pilot is 40% above the client's estimate. When do you raise it?
- [x] In the week-one pilot report, with data
- [ ] After hypercare
- [ ] Never; absorb it
> Early, data-backed renegotiation is expected; late surprises damage trust.

### Exercises

1. **Size the ramp** — The client wants 600 items/day at 12-minute AHT. With 6.5 productive hours, how many certified agents are needed, and how many should you certify for safety?
<details><summary>Solution</summary>

IPH = 5; per agent per day = 32.5; 600 / 32.5 = 18.5 → 19 agents. Certify at least 22 (about 15% buffer) to cover shrinkage and single-point-of-failure risk.

</details>

2. **Write the pilot exit report headline** — Pilot processed 540 items over 9 days, AHT 13.1 min, accuracy 97.4%, 38 clarifications logged, 7% exception rate.
<details><summary>Solution</summary>

"Pilot complete: 540 items, field accuracy 97.4% (100% QC), AHT 13.1 min vs 12.0 estimate (+9%), exception rate 7%, 38 client clarifications incorporated into SOP v1.0 (signed 3 Oct). Recommend proceeding to ramp with volume commitment revised to 550/day at current staffing, or 600/day with one additional agent; decision requested by 6 Oct."

</details>

### Interview Questions

**Q: How do you onboard a new client process?**
With a phased plan agreed in writing: a pilot at 5–10% volume with 100% QC to validate the SOP and measure real AHT, a ramp that grows volume as agents certify, a hypercare period with daily client calls, then steady state. Training is layered from context to tool to rules to exceptions to supervised practice, and certification is a number, for example 200 consecutive items at 98%, recorded in a skills matrix. I keep a decision log of every client clarification so the SOP stays current, and I report AHT and exception rate in week one so that any gap against the client's estimate is renegotiated early. On a Tennessee mortgage onboarding this approach surfaced a 9% AHT gap in week one, which we resolved by adding one agent rather than missing SLA for a month.

**Q: How do you handle resistance to change on your team?**
By explaining the why, lowering the stakes during learning, and using peers. In the huddle I explain the client's reason for the change and what it means for the account. I state that ramp-period accuracy is for feedback, not for the scorecard, which removes the fear of being judged on something new. I choose two respected senior agents as champions who learn first and help train, because agents listen to peers more than to leads. And I make the early wins visible: the first agent to certify gets recognised. The remaining resistance is usually a legitimate problem with the process, which I want to hear.

**Q: What is a skills matrix and how did you use it?**
A grid of agents by process with a level in each cell from not trained to able to train others. I used it for daily allocation (who can take mortgages tonight), for risk (any process with fewer than three certified agents is a single point of failure), for capacity answers to the client (how many Tennessee items can we absorb tomorrow), and for development (who should be cross-trained next). It also drove fairness, because cross-training opportunities went to agents by level and tenure rather than by who asked loudest.

## Motivation, conflict & attrition

Back-office work is repetitive, the shift is at night, and the pay is modest. Agents leave. **Attrition** in Pakistani BPOs commonly runs 30–50% a year, and every departure costs weeks of training and a dip in accuracy. A team lead's people skills are measured in the attrition number, the engagement of the agents who stay and how quickly conflicts are resolved before they reach HR.

### What actually motivates agents

Money matters but it is mostly outside your control. What you control:

| Lever | What it looks like in practice |
|---|---|
| Clarity | Everyone knows the target, the rules and how they are doing today |
| Fairness | Allocation, recognition and leave are visibly rule-based |
| Progress | A visible path: certification, QC role, senior agent, trainer, lead |
| Recognition | Specific, timely, rotated; in the huddle and in writing to the manager |
| Respect | 1:1s happen, feedback is private, absence reasons are heard |
| Autonomy | Certified agents choose their own item order; seniors self-allocate |

The cheapest and most neglected lever is progress. An agent who can see that certification on a second process leads to a QC role in six months behaves differently from one who sees the same queue forever.

### Measuring engagement without a survey

You do not need an HR survey to see engagement. Track three things monthly:

```excel
' Voluntary overtime take-up when offered
=COUNTIF(OT!C:C,"Yes")/COUNTA(OT!C:C)
' Unplanned absence rate (from attendance sheet)
=COUNTIF(Att!C2:AA21,"A")/COUNTIF(Att!C2:AA21,"<>W")
' Improvement ideas submitted (from a simple ideas log)
=COUNTIFS(Ideas!A:A,">="&EOMONTH(TODAY(),-1)+1)
```

Falling overtime take-up and rising unplanned absence are early warnings that precede resignations by a month or two.

### Attrition arithmetic

```text
Monthly attrition % = Leavers in month / Average headcount in month * 100
Annualised          = Monthly % * 12
Cost of one leaver  ≈ Recruiting + (Training days * daily cost) + (Ramp weeks * lost productivity)
Example: 2 leavers / 20 = 10% monthly = 120% annualised  →  crisis
         1 leaver in 3 months / 20 = 1.7% monthly = 20% annualised  →  healthy
```

Track leavers by reason (better pay, shift, transport, study, manager, personal). Exit conversations are worth having even when the answer is uncomfortable; "manager" as a reason twice in a quarter is a message.

### Handling conflict between agents

Most floor conflicts are about fairness: who got the easy batch, who got recognised, who got leave. The method:

1. Separate the people from the problem: hear each privately first, same day.
2. Find the rule that should have decided it (allocation by skills matrix, leave cap, recognition rotation). If there was no rule, that is the real problem.
3. Bring them together only to agree the rule going forward, not to relitigate.
4. Write the rule into the team norms and mention it, without names, in the huddle.

Conflicts about behaviour (rudeness, harassment, dishonesty) are not mediated; they go to HR the same day with a written account.

### The difficult conversation

When you must tell someone something they do not want to hear (a PIP, a denied promotion, an escalation of conduct), structure it: state the purpose in the first sentence, give the facts, listen, state what happens next, and confirm in writing. Do it in private, never at the end of a shift when they cannot respond, and never through a peer.

### Retaining your best people

Your top three agents are the ones a competitor will hire. Give them the QC rotation, the champion role in new processes, the trainer slot, and say to your manager in writing that they should be next for promotion. Ask them quarterly what would make them leave. The answer is usually "nothing yet", and the act of asking is itself retention.

> **Interview note:** "How do you motivate a team doing repetitive work?" wants levers you control, with one concrete example and, ideally, an attrition number.

### Try It Yourself

```text
Monthly people dashboard (team of 20)

Metric                        Aug-26   Sep-26   Trend   Note
Headcount (avg)                 20       19.5     ↓      1 resignation (better pay, 12 Sep)
Attrition (monthly %)          0.0%     5.1%     ↑      annualised 61% if repeated – watch
Unplanned absence %            3.2%     4.8%     ↑      concentrated in 3 agents; 1:1s scheduled
OT take-up %                    85%      70%     ↓      early warning
1:1s completed                 80/80    76/80    ↓      4 missed in peak week; rescheduled
Certifications added             2        3      ↑      TN mortgages
Recognitions (distinct agents)   6        8      ↑
Ideas submitted                  3        5      ↑      2 adopted (shortcut sheet, rescan template)
```

### Quiz

1. Which motivation lever is most under a team lead's direct control?
- [ ] Salary
- [x] A visible progression path and fair, rule-based decisions
- [ ] Office location
> Pay is set elsewhere; clarity, fairness, progress and recognition are the lead's tools.

2. Two leavers in one month from a team of 20 is what annualised attrition?
- [ ] 10%
- [ ] 60%
- [x] 120%
> 2/20 = 10% monthly × 12 = 120% annualised, a crisis level.

3. Two agents argue about who received the easier batch. What is the first step?
- [ ] Bring them together immediately
- [x] Hear each privately and identify the rule that should have decided it
- [ ] Report both to HR
> Fairness conflicts are resolved by rules; behaviour conflicts go to HR.

### Exercises

1. **Design a progression ladder** — Write five rungs from new agent to team lead, each with an objective entry criterion.
<details><summary>Solution</summary>

1 Trainee: hired, in training. 2 Certified agent: 200 items at ≥ 98% on one process. 3 Senior agent: certified on 3 processes, ≥ 100% attainment for 3 months, no conduct issues. 4 QC / Trainer: senior for 6 months, calibration agreement ≥ 90%, has trained 2 agents to certification. 5 Team lead: QC/Trainer for 12 months, has led a CI project with measured results, passed the internal lead assessment.

</details>

2. **Interpret the dashboard** — Using the Try It table, list the two actions you would take this month.
<details><summary>Solution</summary>

(1) Address the early-warning cluster: overtime take-up fell and unplanned absence rose; hold 1:1s with the three agents driving the absences this week and ask directly about intentions. (2) Protect retention of the top performers after a pay-driven resignation: confirm with the manager which agents are next for QC rotation or promotion and tell them, in writing, this month.

</details>

### Interview Questions

**Q: How do you motivate a team doing repetitive night-shift work?**
With the levers I control: clarity, fairness, progress and recognition. Every agent saw their own scorecard daily, allocation and leave followed visible rules, and there was a five-rung ladder from trainee to lead with objective criteria, so certification on a second process meant something. Recognition was specific and rotated, in the huddle and in writing to my manager. I also tracked leading indicators such as overtime take-up and unplanned absence, which fall before resignations happen. On my 20-agent team that combination kept attrition around 20% annualised in a market where 40% is common.

**Q: Tell me about a conflict on your team and how you resolved it.**
Two agents fell out over allocation: one believed the other was consistently given easier deed batches. I heard each privately the same day and found the real cause was that allocation was done by item order, which happened to favour whoever was first on the list. There was no fairness rule, so the complaint was legitimate. I changed allocation to mixed document types per agent from the skills matrix, explained the rule in the huddle without naming anyone, and brought the two together only to confirm they were both fine with it. The conflict ended because the system changed, not because anyone apologised, and the change also reduced transposition errors, which I had not expected.

**Q: How do you handle a resignation from one of your best agents?**
First a conversation to understand the real reason, because a counter-offer is only possible if the reason is money and only sensible if the person is worth it, which I would have documented already. Then a plan for the two-week notice period: knowledge transfer on anything they alone knew, and updating the skills matrix to show the gap. Then the honest analysis: if the reason was pay, it goes to my manager with data on the cost of the leaver versus a raise; if it was something on the team, it goes into my own improvement plan. I keep a relationship with good leavers; two of mine came back within a year.

# LEVEL: Expert

## Building a metrics dashboard for management

Management does not read the daily report; they look at a dashboard for thirty seconds and ask one question. Your job is to make sure the dashboard answers it before they ask. This chapter covers the design of an operations dashboard, the data model behind it, the Excel and Power BI mechanics, and the choices that make a dashboard trusted rather than decorative.

### Decide the questions first

A dashboard is a set of answers. For a back-office operation the management questions are stable:

1. Are we meeting the SLA this month? (accuracy, TAT compliance, critical errors)
2. Is the trend improving or worsening? (six months of each SLA metric)
3. Are we staffed for next month's volume? (capacity vs forecast)
4. Where is the risk? (backlog ageing, attrition, open escalations)
5. What is it costing? (cost per item, rework cost)

Every tile on the dashboard must map to one of those. A tile that does not answer a management question is removed.

### The data model

Keep three tables, one row per event, and build every metric from them:

```text
Items      ItemID, Process, State, Agent, Received, Delivered, Status, TATHours
QCLog      Date, ItemID, Agent, QC, TypeCode, Severity, Note
Roster     Date, Agent, Code (P/A/L/W/H/T), ProductiveMinutes
Lookups    Calendar (Date, Month, Week, IsHoliday), Agents (Agent, Team, Process, StartDate), Targets (Metric, Target)
```

This is a star schema: fact tables (Items, QCLog, Roster) joined to dimension tables (Calendar, Agents) on Date and Agent. In Power BI, mark Calendar as the date table (Table tools → Mark as date table) so time intelligence works.

### Core measures in DAX

```dax
Items Delivered = CALCULATE(COUNTROWS(Items), Items[Status] = "DONE")
TAT Compliance % =
    DIVIDE(
        CALCULATE(COUNTROWS(Items), Items[Status] = "DONE", Items[TATHours] <= 24),
        [Items Delivered]
    )
Field Accuracy % =
    VAR Errors = COUNTROWS(QCLog)
    VAR Fields = SUMX(FILTER(Items, Items[Sampled] = TRUE()), Items[FieldCount])
    RETURN DIVIDE(Fields - Errors, Fields)
Critical Errors = CALCULATE(COUNTROWS(QCLog), QCLog[Severity] = "Critical")
Accuracy vs Target = [Field Accuracy %] - LOOKUPVALUE(Targets[Target], Targets[Metric], "Field Accuracy")
Accuracy MoM = [Field Accuracy %] - CALCULATE([Field Accuracy %], DATEADD('Calendar'[Date], -1, MONTH))
```

Each measure has a denominator that is explicit, and the target comes from a table so it can change without editing a formula.

### Layout

Top row: five KPI cards (this month's value, target, delta arrow). Middle: one line chart per SLA metric, six months, with the target as a constant line (Analytics pane → Constant line). Bottom left: backlog ageing bars (0–12 h, 12–24 h, 24–48 h, > 48 h). Bottom right: capacity vs forecast for the next four weeks. A slicer for Process and State at the top. That is the whole page. A second page holds the per-agent scorecard for team leads; management does not get agent names on page one.

Conventions: red only for SLA misses, one accent colour for actuals, grey for targets, no 3-D, no gauges. Percentages to one decimal. Every chart title is a sentence that states the finding ("TAT compliance held above 98% for six months"), not a label.

### In Excel instead

The same design works in Excel with a data sheet, PivotTables on a hidden sheet, and a dashboard sheet of linked cells and PivotCharts, with slicers connected to all pivots (PivotTable Analyze → Insert Slicer → Report Connections). Refresh with Data → Refresh All. Use Power Query (Data → Get Data → From Folder) to load the daily CSVs so nobody pastes data by hand.

```excel
' KPI card cells on the dashboard sheet
Field accuracy this month:  =GETPIVOTDATA("FieldAcc",Pivots!$A$3,"Month",TEXT(EOMONTH(TODAY(),0),"mmm-yy"))
Delta vs target:            =B2-Targets!B2
Arrow:                      =IF(B3>=0,"▲","▼")
Colour: Conditional Formatting → Icon Sets on the delta, or a font-colour rule =B3<0 → red
```

### Trust

A dashboard is trusted when its numbers reconcile to the reports management already receives, when the definitions are printed on the page (a footnote or an info tooltip), when the refresh time is visible ("Data as of 15 Sep 05:30 PKT"), and when it has never been quietly changed. Version the measure definitions with the same discipline as an SOP.

> **Tip:** Before showing a dashboard to management, reconcile every KPI card to last month's report by hand. The first discrepancy they find is the last time they look at the dashboard.

### Try It Yourself

```dax
-- Backlog ageing buckets as a calculated column on Items (Power BI)
Ageing Bucket =
VAR Hours = IF(ISBLANK(Items[Delivered]), DATEDIFF(Items[Received], NOW(), HOUR), BLANK())
RETURN
    SWITCH(TRUE(),
        ISBLANK(Hours), "Delivered",
        Hours <= 12, "0–12 h",
        Hours <= 24, "12–24 h",
        Hours <= 48, "24–48 h",
        "> 48 h")

-- Open backlog beyond TAT (measure)
Backlog Beyond TAT = CALCULATE(COUNTROWS(Items), Items[Ageing Bucket] IN {"24–48 h", "> 48 h"})
```

### Quiz

1. What should decide which tiles appear on a management dashboard?
- [ ] Which charts look best
- [x] The specific questions management asks
- [ ] The number of available metrics
> Every tile maps to a management question; the rest is noise.

2. Why keep targets in a table rather than in the DAX measure?
- [x] Targets can change without editing formulas, and history is preserved
- [ ] DAX cannot contain numbers
- [ ] Tables are faster
> A target table is data, so changes are visible and auditable.

3. What is the most important property of a dashboard for management trust?
- [ ] Animation
- [x] Numbers that reconcile to existing reports, with visible definitions and refresh time
- [ ] Many pages
> Trust comes from reconciliation and transparency, not visual richness.

### Exercises

1. **Write the measure** — In DAX, define "Rework Rate %" as items with at least one QC error divided by sampled items.
<details><summary>Solution</summary>

```dax
Rework Rate % =
VAR ItemsWithErrors = CALCULATE(DISTINCTCOUNT(QCLog[ItemID]))
VAR Sampled = CALCULATE(COUNTROWS(Items), Items[Sampled] = TRUE())
RETURN DIVIDE(ItemsWithErrors, Sampled)
```

</details>

2. **Design the capacity tile** — Describe the data and the visual for "capacity vs forecast for the next four weeks".
<details><summary>Solution</summary>

Data: a Forecast table (WeekStart, Process, ForecastItems) from the client, and a computed Capacity per week = certified agents on roster that week × IPH × productive hours × working days, from the Roster and Skills tables. Visual: clustered column for Forecast with a line for Capacity per week; conditional colour on any week where Forecast > Capacity; a card showing the earliest week with a shortfall and the number of additional agents needed (shortfall / per-agent weekly capacity, rounded up).

</details>

### Interview Questions

**Q: How would you build an operations dashboard for management?**
I would start by writing down the five questions management actually asks: SLA status this month, six-month trend, staffing versus forecast, where the risk is, and cost per item. Then I would model three fact tables, items, QC log and roster, joined to a calendar and an agents dimension, so every measure has an explicit denominator and time intelligence works. Measures in DAX with targets from a table; a single page with KPI cards, trend lines with target lines, backlog ageing and capacity versus forecast; agent-level detail on a second page for leads only. Before release I would reconcile every card to the existing monthly report, print the definitions and refresh time on the page, and version the measures like an SOP. I built exactly this kind of reporting for weekly multi-state title production, where reconciling to the state teams' own numbers was what made management use it.

**Q: What is the difference between a report and a dashboard?**
A report is a narrative for a period: numbers, commentary, actions, read once. A dashboard is a standing view that answers a fixed set of questions on demand and is refreshed automatically. Reports explain; dashboards monitor. The failure mode is treating a dashboard as a report and cramming in commentary and thirty charts, or treating a report as a dashboard and sending a page of numbers with no explanation of what changed and why. In practice the dashboard feeds the report: the monthly narrative is written by looking at the dashboard and explaining the variances.

**Q: How do you make sure a dashboard's numbers are trusted?**
Reconciliation, definitions and stability. Every KPI is reconciled to the reports management already receives before the dashboard is shown, and any difference is resolved by fixing definitions, not by choosing whichever number looks better. Definitions are visible on the page. The refresh timestamp is shown so nobody argues about stale data. Measures are versioned and changes announced. And the underlying data is one row per item so that any number can be drilled to the items behind it in a minute, which is the fastest way to end a "your number is wrong" conversation.

## Workforce planning & capacity models

**Workforce planning** answers one question: how many trained people do we need, on which days, to meet the forecast volume at SLA? Get it wrong on the low side and TAT fails; on the high side and the account loses money. The team lead supplies the inputs and validates the model; the expert team lead builds it.

### The capacity equation

```text
Required FTE = (Forecast volume × AHT in hours) / (Productive hours per FTE per period)
Productive hours per FTE = Scheduled hours × (1 − Shrinkage) × Occupancy

Example (monthly): 26,000 items × (4.8 / 60) h = 2,080 processing hours
Scheduled per FTE = 22 days × 8 h = 176 h; shrinkage 30% → 123.2 h; occupancy 90% → 110.9 h
Required FTE = 2,080 / 110.9 = 18.8  →  19 agents, plus buffer
```

Three assumptions drive the whole thing: AHT, shrinkage and occupancy. Document them on the model with their sources and review them monthly against actuals.

### Forecasting volume

Back-office volume is usually driven by something you can see in advance: the client's order intake, the number of recordings per county, refinance activity following interest-rate moves. The simple methods work:

| Method | When | Excel |
|---|---|---|
| Moving average | Stable volume | `=AVERAGE(B2:B13)` for last 12 weeks |
| Seasonal index | Yearly pattern (month-end spikes, holidays) | month avg / overall avg, applied to the trend |
| Client forecast | Client provides it | Use it, but track forecast accuracy |
| Linear trend | Steady growth | `=FORECAST.LINEAR(next_week, volumes, weeks)` |

Always measure **forecast accuracy** afterwards: `=1-ABS(Actual-Forecast)/Actual`. A client whose forecast is 70% accurate needs a larger buffer than one at 95%.

### Daily and intra-week shaping

Monthly FTE is not enough; volume is lumpy. US title volume peaks at month-end closings and drops on US holidays. Build the model at the daily level:

```excel
' Daily model: A Date, B ForecastItems, C AHT(min), D ProcHours =B2*C2/60
' E AgentsRostered (from roster), F Shrinkage, G Capacity =E2*8*(1-F2)*0.9
' H Gap hours =G2-D2, I Agents short =IF(H2<0,ROUNDUP(-H2/(8*(1-F2)*0.9),0),0)
' Weekly summary
=SUMIFS(D:D, A:A,">="&WeekStart, A:A,"<="&WeekEnd)     ' hours needed
=SUMIFS(G:G, A:A,">="&WeekStart, A:A,"<="&WeekEnd)     ' hours available
' Flag days needing overtime or borrowed staff
=IF(I2>0,"Short "&I2&" agents","OK")
```

Options for a short day, in order of cost: reshuffle weekly offs, voluntary overtime, borrow certified agents from a sister team, temporary hires, negotiate a delivery extension with the client for the surplus.

### Buffers and cross-training

A buffer of 10–15% over required FTE covers forecast error and unplanned absence. Cross-training is a cheaper buffer than headcount: if 30% of a sister team is certified on your process, you can borrow on peak days instead of carrying idle FTE. The skills matrix from the Advanced level is the input.

### Hiring lead time

If training plus certification takes three weeks and recruitment takes four, a headcount need must be identified seven weeks ahead. The model therefore forecasts at least eight weeks out, and the weekly report includes a line "hiring decisions needed by date X". Missing this lead time is the most common cause of ramp failures.

### Cost per item

Management ultimately manages cost. Compute it and show it on the model:

```text
Cost per item = (Agent cost + QC cost + TL cost share + overhead) / Items delivered
Rework cost   = Rework items × (AHT + QC time) × hourly cost
Example: 19 agents at PKR 70,000 + 2 QC at 90,000 + TL share 60,000 + overhead 300,000 = PKR 1,870,000
          / 26,000 items = PKR 72 per item (≈ USD 0.26)
```

When the client asks for a price on a new volume, this number plus margin is the answer, and the capacity model is the evidence.

> **Warning:** A capacity model that uses the mean AHT of your best week is a plan to fail. Use the trailing three-month median and state it.

### Try It Yourself

```excel
' Monthly capacity model – inputs block
Forecast items (month):        26000
Median AHT (min, trailing 3m):  4.8
Working days:                    22
Shift hours:                      8
Shrinkage:                      30%
Occupancy:                      90%
Buffer:                         12%
' Calculations
Processing hours needed:   =B2*B3/60                       ' 2080
Productive hrs per FTE:    =B4*B5*(1-B6)*B7                ' 110.9
Required FTE:              =B9/B10                          ' 18.8
FTE with buffer:           =ROUNDUP(B11*(1+B8),0)           ' 22
Current certified:         =COUNTIF(Skills!C:C,">=2")       ' 19
Hiring need:               =MAX(0,B12-B13)                  ' 3
Decision needed by:        =WORKDAY(FirstDayOfMonth,-35)    ' 7 weeks lead time
```

### Quiz

1. Which three assumptions most affect a capacity model?
- [ ] Salary, rent, electricity
- [x] AHT, shrinkage and occupancy
- [ ] Number of QCs, number of leads, number of clients
> These three convert volume into required hours and hours into people.

2. Why forecast at least eight weeks ahead?
- [x] Recruitment and training lead time means decisions are needed weeks before the volume arrives
- [ ] The client requires it
- [ ] Excel cannot forecast shorter periods
> Hiring plus certification takes about seven weeks; the model must see beyond that.

3. What is the cheapest buffer against peak days?
- [ ] Permanent extra headcount
- [x] Cross-trained agents on a sister team
- [ ] Missing the SLA occasionally
> Cross-training gives borrowable capacity without idle cost.

### Exercises

1. **Compute FTE** — 40,000 items next month, AHT 6 minutes, 21 working days, 8-hour shifts, 28% shrinkage, 88% occupancy, 10% buffer. Required FTE with buffer?
<details><summary>Solution</summary>

Hours needed = 40,000 × 0.1 = 4,000. Productive per FTE = 21 × 8 × 0.72 × 0.88 = 106.4. Required = 37.6; with buffer = 41.4 → 42 agents.

</details>

2. **Handle a month-end peak** — Daily average is 1,200 items but the last three business days of the month run 2,000 each. 20 agents at 13 IPH and 6.5 productive hours. What do you do?
<details><summary>Solution</summary>

Daily capacity = 20 × 13 × 6.5 = 1,690; peak shortfall = 310 items/day × 3 days = 930 items ≈ 72 agent-hours. Options: move weekly offs away from those three days (adds up to 4 agents = 338 items/day, covers it), or two hours voluntary overtime for 12 agents, or borrow 4 certified agents from the sister team, or pre-agree with the client a 36-hour TAT for the month-end surplus.

</details>

### Interview Questions

**Q: How do you plan staffing for your team?**
From a capacity model with explicit assumptions. Forecast volume comes from the client and from seasonal patterns such as US month-end closings; AHT is the trailing three-month median; shrinkage and occupancy are measured from the roster and production tool. Required FTE is processing hours divided by productive hours per person, with a 10–15% buffer for forecast error and absence. I build it daily, not monthly, because title volume is lumpy, and I look eight weeks ahead because hiring plus certification takes about seven. The weekly report carries a line saying which hiring or overtime decision is needed by which date, and I measure forecast accuracy afterwards so the buffer can shrink as the forecast improves.

**Q: What is shrinkage and what value do you use?**
Shrinkage is the share of scheduled hours that are not available for production: leave, sickness, breaks, training, meetings and downtime. I measure it from the roster and downtime log rather than assuming it; on my team it ran 28–32%, so I plan at 30% and review monthly. Using a lower figure to make the model look cheaper is the most common way capacity plans fail, because the missing hours are real and appear as missed TAT.

**Q: The client asks whether you can absorb 30% more volume from next month. How do you answer?**
With the model, within a day. Thirty percent more volume at current AHT means about 30% more processing hours; I check certified headcount and the buffer, the cross-trained pool on sister teams, and the hiring lead time. The honest answer is usually "yes for the first two weeks with overtime and borrowed agents, and yes sustainably from week seven if you confirm by Friday so we can recruit three agents now". I give them the number, the date and the condition, and the cost per item at the new volume, because that is the decision they actually need to make.

## Quality frameworks (COPC/ISO 9001) & audits

Clients with mature vendor management ask whether your operation is run to a **quality framework**, and their auditors will check. The two you will meet are **ISO 9001** (the general quality-management standard) and **COPC** (the framework built specifically for customer-contact and BPO operations). A team lead does not run the certification, but is the person the auditor interviews, and the person whose records are sampled.

### ISO 9001 in one page

ISO 9001:2015 requires an organisation to have a **quality management system (QMS)**: documented processes, defined responsibilities, measured performance, controlled records, and a loop of internal audit, management review and corrective action. Its structure is the Plan-Do-Check-Act cycle. The clauses a team lead touches:

| Clause | Topic | What the auditor asks the TL |
|---|---|---|
| 7.1.6 / 7.2 | Knowledge & competence | "How do you know this agent is competent on this process?" (skills matrix, certification records) |
| 7.5 | Documented information | "Which SOP version is current and how do agents know?" (control block, single location) |
| 8.5 | Control of production | "How is work checked?" (sampling plan, QC log) |
| 9.1 | Monitoring & measurement | "Show me the last three months of accuracy and TAT." (reports, dashboard) |
| 10.2 | Nonconformity & corrective action | "Show me a recent quality problem and what you did." (RCA record) |

Notice that everything in this course is already an answer. The framework does not ask for new work; it asks for evidence of the work.

### COPC in one page

COPC (Customer Operations Performance Center) is a standard for contact centres and BPO, with a strong focus on metrics. Its practices for a back-office operation include: defining **key customer-related processes (KCRPs)** with metrics and targets; calibrated **transaction monitoring** (your QC and calibration); **forecasting and staffing** to service levels (your capacity model); **attrition and absenteeism** tracking; and reviewing all of it in a structured monthly performance review. COPC certification requires sustained target attainment on the metrics, not only having the processes.

### Records an auditor will sample

Auditors work by sampling. They pick an item, an agent or a month and follow the trail. Have these retrievable within minutes:

```text
For an agent:   training record, certification date and evidence, skills-matrix entry, 1:1 notes, coaching plan
For an item:    who processed it, who QC'd it, the QC result, rework trail, delivery timestamp
For a month:    daily/weekly/monthly reports, SLA table, calibration records, RCA records, escalation log
For a process:  current SOP with control block, revision history, job aid, client sign-off
For a change:   change request, approval, SOP version, training/briefing record, 100%-QC period results
```

The gap that fails most audits is not the absence of a practice but the absence of a record: calibration was done but not written down, or the SOP was updated but the briefing was not recorded.

### Preparing for an audit

1. Two weeks before: run an internal audit yourself with the checklist above; fix gaps.
2. One week before: brief the team on what an audit is (an interview about how we work, answer honestly, "I would check the SOP" is a fine answer).
3. Day of: have the records open, not on a USB stick; answer the question asked, not the question you wish they had asked; if you do not know, say who does.
4. After: every finding gets an owner, a date and a corrective action, tracked like an RCA.

### Findings language

Auditors use graded language: **major nonconformity** (a required element is missing or the system has failed), **minor nonconformity** (an isolated lapse), **observation** (a risk or improvement opportunity). A major must be closed before certification; a pattern of minors becomes a major.

```text
Finding: Minor NC – Clause 7.5. SOP-TI-004 v1.2 was found on agent desk; current version is 2.0.
Root cause: agents printed local copies before the read-only link was introduced.
Correction: all printed copies removed 16 Sep.  Corrective: job aid now carries version and QR to the live SOP;
            monthly floor check added to TL checklist. Verification: next internal audit 15 Oct.
```

> **Interview note:** "Have you worked in an ISO or COPC environment?" is best answered with which records you owned and one audit finding you closed, rather than with a description of the standard.

### Try It Yourself

```text
Internal audit checklist – Data Processing Team (run monthly, 45 minutes)

#  Check                                                     Evidence                    Result
1  Current SOP version on the shared link matches the control block   SharePoint, SOP header     OK
2  No local/printed SOP copies older than current version    Floor walk                 1 found – NC
3  Every agent on the process has a certification record     Skills matrix + records    OK
4  Sampling plan followed last 4 weeks (rate per agent)       QC log vs plan             OK
5  Calibration held weekly with agreement rate recorded       Calibration sheet          Wk 36 missing – NC
6  Daily reports sent by 06:00 PKT, 20/20 days               Sent-items log             OK
7  Every TAT miss has a reason code                           Items table                OK
8  RCA on file for any month with an SLA metric below target  RCA folder                 n/a
9  Escalation log complete (response times filled)            Escalation log             2 blanks – Obs
10 Training/briefing record for last SOP change               Huddle notes 1 Sep         OK
```

### Quiz

1. What does ISO 9001 primarily require?
- [ ] A specific accuracy target
- [x] A documented, measured quality management system with corrective action
- [ ] Six Sigma certification for all leads
> ISO 9001 specifies the system, not the numbers; COPC adds metric targets.

2. What most often fails an audit?
- [ ] Bad accuracy numbers
- [x] A practice that was done but not recorded
- [ ] Too many SOP versions
> Auditors need evidence; undocumented work is treated as not done.

3. Which finding must be closed before certification?
- [x] Major nonconformity
- [ ] Observation
- [ ] Any finding
> Majors block certification; minors and observations are tracked and closed over time.

### Exercises

1. **Write the record** — Calibration was held on 8 Sep with three QCs on 25 items; 22 items fully agreed. Write the calibration record entry.
<details><summary>Solution</summary>

"Calibration 2026-09-08, process TI-004, QCs: Sana, Bilal, Hamza; 25 items (IDs in Calib sheet); agreement 22/25 = 88%; disagreements: TN-00612 (severity major vs minor on E04), TN-00630 (E02 vs E05), TN-00644 (E09 applicability); resolutions recorded; taxonomy definition for E09 clarified in SOP v2.1 draft. Facilitator: A. Raza."

</details>

2. **Map the course to the clauses** — For each of clauses 7.2, 7.5, 8.5, 9.1 and 10.2, name the artefact from earlier chapters that satisfies it.
<details><summary>Solution</summary>

7.2 Competence: skills matrix and certification records (Managing change chapter). 7.5 Documented information: SOP control block and revision history (SOP chapter). 8.5 Control of production: sampling plan and QC log (Sampling chapter). 9.1 Monitoring: daily/weekly/monthly reports and SLA table (Reports chapter). 10.2 Corrective action: RCA record with correction, corrective and preventive actions (RCA chapter).

</details>

### Interview Questions

**Q: Have you worked in an ISO 9001 or COPC environment, and what did that mean day to day?**
Yes, in a BPO environment where the client's vendor audits followed ISO 9001 logic. Day to day it meant that everything I did had to leave a record: the SOP had a control block and a revision history, the skills matrix showed certification evidence, QC sampling followed a written plan, calibration was recorded weekly with the agreement rate, and every SLA miss had an RCA with corrective and preventive actions. In one internal audit the finding was a stale printed SOP on a desk; I closed it by adding the version and a link to the job aid and a monthly floor check. The standard did not add work; it forced the work to be visible.

**Q: How do you prepare your team for a client audit?**
Two weeks out I run the internal checklist myself and close gaps, because the auditor will find what I find. A week out I brief the team: an audit is an interview about how we actually work, answer honestly, and "I would check the SOP" or "my team lead handles that" are good answers. On the day I have the records open and answer the question that was asked. Afterwards each finding gets an owner, a date and a corrective action tracked like an RCA. The key attitude is that the audit is free consulting; the findings are things that would have failed eventually anyway.

**Q: What is the difference between ISO 9001 and COPC?**
ISO 9001 is a general standard for a quality management system in any industry: documented processes, competence, measurement, corrective action, management review. It does not set performance targets. COPC is specific to contact-centre and BPO operations and is metric-driven: it defines which processes and metrics must be managed, requires calibrated monitoring, forecasting and staffing to service level, and requires sustained attainment of targets for certification. A BPO can be ISO-certified with poor accuracy; it cannot be COPC-certified with poor accuracy.

## Leading remote/hybrid teams & cross-cultural client communication

Since 2020 most BPO leads manage at least some agents remotely, and every lead serving a US client communicates across a large cultural and time-zone gap. The mechanics of the job do not change, but the visibility does: you cannot walk the floor, and the client cannot see your team. This chapter covers the practices that replace physical presence, and the communication habits that make a Lahore team feel like a local partner to a Texas client.

### What changes when the team is remote

| On the floor | Remote equivalent |
|---|---|
| Walk past desks to see who is working | Production-tool activity log; status in Teams; checkpoint numbers |
| Huddle in the corner | Teams call, camera on, 10 minutes, same agenda |
| QC hands rework across the desk | Rework queue in the tool with a Teams notification |
| Notice someone struggling | AHT spikes and idle gaps in the tool; 1:1s become non-negotiable |
| Spare machine | Documented home setup requirements; VPN; a loan laptop policy |
| Floor security | Endpoint controls, no personal-device access, camera-on rule for client data work if the client requires it |

The biggest loss is informal signal. Replace it with structured signal: two checkpoints become three, 1:1s become weekly without exception, and the production tool's idle-time report is reviewed daily.

### Remote operating rhythm

```text
21:00  Teams huddle (camera on). Attendance = who is on the call and logged in to the tool.
21:15  Allocation posted in the team channel with @mentions.
23:00  Checkpoint 1: TL posts % complete per agent (from the tool) in the channel.
01:00  Checkpoint 2 + QC rework wave 1.
03:00  Checkpoint 3 + rework wave 2.
05:00  Final push; agents post "done" with counts.
05:30  Delivery; daily report; end-of-shift channel post with tomorrow's expected volume.
```

Public checkpoint posts create peer visibility that replaces the floor. Keep them factual, never shaming: numbers, no adjectives.

### Connectivity and downtime rules

Home internet and power in Pakistan are less reliable than an office with generators. Have written rules: agents must have a mobile hotspot backup; a loss of connection over 30 minutes is reported to the TL by phone, not left to be discovered; the downtime log records it per agent; repeated home-infrastructure downtime is a conversation about returning to the office, not a disciplinary matter.

### Communicating with a US client

Time: state every time in both zones, PKT and the client's (CT or ET), every time. Say "05:30 PKT / 19:30 CT", never "tomorrow morning".

Directness: US business writing is short and explicit. Lead with the answer, then the reason, then the ask. Avoid softening phrases that read as evasive ("kindly do the needful", "we will try our level best"); write "we will deliver by 19:30 CT" or "we cannot deliver 300 of the items by TAT; here are two options".

Ownership language: "We missed it, here is why and here is the fix" builds more trust than any explanation that starts with the client's late upload, even when the upload was late. Put the client's contribution in the facts, not in the tone.

```text
Weak:   "Dear Sir, kindly note that due to some issues at the client end the batch was delayed
         and we tried our level best to complete it. Please do the needful."
Strong: "Hi Jennifer – batch 14-Sep delivered 07:10 CT, 90 minutes past TAT. Cause: 300 items
         arrived at 04:00 PKT (after the 22:00 cut-off). We processed them in 3 hours.
         Proposal: items received after cut-off carry a 12-hour TAT from receipt; can we agree that
         for the report footnote? Everything else was on time."
```

Meetings: confirm agenda in advance, start on time, one person speaks for the team, decisions summarised in writing within the hour. US clients notice punctuality and follow-through more than accent or vocabulary.

Holidays: keep both calendars visible. Pakistan's Eid and Muharram holidays and US Thanksgiving, July 4th and Memorial Day all affect volume and staffing, and the client should hear about your holidays a month ahead with the coverage plan.

### Building the relationship

A monthly 20-minute call with the client's operations contact that has no agenda item except "what could we do better" is the cheapest account-retention tool there is. Send a short note when the team does something good ("the team caught 14 duplicate uploads this week before they reached your plant"). Learn the names of the client's team and use them.

> **Tip:** Record every client decision from a call in an email within the hour: "As discussed: 1. … 2. … Please reply if anything is inaccurate." Silence becomes agreement, and the record protects both sides.

### Try It Yourself

```text
Client communication checklist – before sending any email or message

[ ] First sentence is the answer or the status, not background
[ ] Every time is in both zones (PKT / CT)
[ ] Every number has a denominator (1,137 of 1,240; 99.2% on 248 sampled)
[ ] Every problem has a proposed action or two options
[ ] The ask is explicit with a deadline ("please confirm by 12:00 CT Tuesday")
[ ] No softening filler ("kindly do the needful", "as per", "revert back")
[ ] Item IDs, ticket numbers and SOP section numbers are included where relevant
[ ] Decisions from calls are recorded within the hour
[ ] Subject line says what, which process, which date
```

### Quiz

1. What replaces "walking the floor" for a remote team?
- [ ] Nothing; remote teams cannot be managed
- [x] Structured signals: tool activity logs, public checkpoint posts and weekly 1:1s
- [ ] Daily surveys
> Informal observation is replaced by structured, visible measurement.

2. Which sentence follows US business-writing norms?
- [ ] "Kindly note that we will try our level best to deliver soon."
- [x] "Batch delivered 07:10 CT, 90 minutes past TAT; cause and proposal below."
- [ ] "Dear Sir, as per our discussion please do the needful."
> Lead with the fact, then the cause, then the proposal; avoid softening filler.

3. How should times be written to a US client?
- [ ] In PKT only, since that is where the team is
- [ ] In words such as "tomorrow morning"
- [x] In both PKT and the client's zone every time
> Dual-zone times prevent the most common cross-border misunderstanding.

### Exercises

1. **Rewrite the message** — "Dear Madam, we regret to inform that the tool was not working and therefore the work could not be done. Kindly bear with us." (Tool down 22:10–23:05 PKT; delivery still expected on time.)
<details><summary>Solution</summary>

"Hi Jennifer – heads-up: our indexing tool was down 22:10–23:05 PKT (12:10–13:05 CT), ticket INC0048812. The team switched to image pre-sorting during the outage. Delivery of tonight's 1,300 items is still expected by 05:30 PKT / 19:30 CT; I'll confirm at 03:00 PKT."

</details>

2. **Design the remote 1:1** — List the four data points you would open a remote 1:1 with, and where each comes from.
<details><summary>Solution</summary>

Attainment this week (production tool), field accuracy and top error type (QC log), idle gaps and connectivity downtime (tool activity log and downtime log), and the agreed action from last week with its result (1:1 notes sheet). Opening with data keeps a remote 1:1 concrete and short.

</details>

### Interview Questions

**Q: How do you manage a team you cannot see?**
By replacing informal observation with structured signals. Attendance is the huddle call plus the tool login. Three checkpoints a shift are posted in the team channel with per-agent progress from the production tool, which creates peer visibility without shaming. QC rework flows through the tool with notifications, 1:1s are weekly without exception and open with data, and the idle-time report is reviewed daily. There are written rules for connectivity and downtime reporting. The remote team I led hit the same targets as on the floor; what changed was that I spent more time on data and messages and less time walking.

**Q: How do you communicate with US clients effectively from Pakistan?**
Lead with the answer, give every time in both zones, put a denominator on every number and a proposal on every problem, and make the ask explicit with a deadline. I avoid the softening phrases common in South Asian business English because they read as evasive to a US reader, and I use ownership language even when the cause was on their side, putting their contribution in the facts rather than in the tone. Decisions from calls go into an email within the hour. I also keep both holiday calendars visible and tell the client about ours a month ahead with the coverage plan. Over time the client's team stopped treating us as a vendor and started copying us on their internal planning, which is the outcome I aim for.

**Q: Describe a misunderstanding with a client and how you fixed it.**
A client read "we will deliver tomorrow morning" as their morning, and we meant ours, which was twelve hours later; they escalated a late delivery that from our side was on time. I apologised for the ambiguity rather than defending the intent, delivered immediately, and changed our standard: every time in every message is written in both PKT and CT, and TAT is defined in the report footer in the client's zone. I also added that check to the team's communication checklist. It never happened again, and the client later said the dual-zone habit was something they wished all their vendors did.

## Behavioural interview questions for team-lead, QA & operations roles

Interviews for lead, QA and operations roles are mostly behavioural: "tell me about a time when…". The interviewer is checking that you have actually done the things on your resume, and how you think. The method that works is **STAR**: Situation, Task, Action, Result, with numbers in the Result. This chapter builds the story bank from Ali's history and shows how each story maps to the questions you will be asked.

### The STAR shape, with the right proportions

Roughly 10% situation, 10% task, 60% action, 20% result. Candidates fail by spending half the answer on context. The action section must be in the first person ("I decided", "I built"), not "we".

```text
S  Night-shift data-processing team of 20 at Systems Limited, US title-search client, 98.5% accuracy SLA.
T  Accuracy fell from 99.4% to 98.6% in one week; I had to find the cause and recover before month-end.
A  Ran a Pareto on the QC log; one error type was 35%. Sliced by county: 28 of 34 from a new
   Tennessee county whose "Deed of Trust" was not in the SOP code table. Fixed the 28 items,
   released SOP 2.1 with the code, added a code-table review to the new-county checklist,
   briefed it in the huddle and ran 100% QC on that county for three days.
R  Accuracy back to 99.3% the next week; the error type fell 70%; no agent was blamed;
   the checklist step caught a similar gap on the next county onboarding.
```

### The story bank

Prepare ten stories, each usable for several questions. From Ali's history:

| # | Story | Numbers | Questions it answers |
|---|---|---|---|
| 1 | Accuracy drop traced to SOP code table | 99.4→98.6→99.3%, 70% reduction | Quality problem, RCA, process vs people |
| 2 | Hitting 100% daily target through allocation and checkpoints | 20 agents, 1,200–1,400/day | Targets, prioritisation, results |
| 3 | Five agents absent on a peak day | 15 agents, 1,400 items, options to client | Pressure, decision-making, communication |
| 4 | PIP that succeeded | 82%→100% attainment in 3 weeks | Underperformer, coaching, difficult conversation |
| 5 | Allocation conflict fixed by changing the rule | Mixed-type allocation, E03 down 4x | Conflict, fairness, unexpected benefit |
| 6 | Client-found critical error, one-hour response | Amount ×10 error, SOP + QC step added | Failure, ownership, client relationship |
| 7 | Tool outage handled with downtime plan | 55 min, 232 items lost, delivered 100% | Crisis, IT, planning |
| 8 | TN mortgage ramp-up with 9% AHT gap flagged in week one | 540 items pilot, 38 clarifications | Change, onboarding, stakeholder honesty |
| 9 | Weekly status reports for multi-state title production at Stewart | Reconciled to state teams, rate matrices, 3,346-row TN matrix | Reporting, data accuracy, management communication |
| 10 | 400+ Fiverr reviews: 168-field form, 767-page handbook | Deadlines, client specs, quality without a QC team | Self-management, attention to detail, customer focus |

Each story is written out in STAR form, rehearsed aloud, and trimmed to 90 seconds.

### The questions and which story to use

```text
"Tell me about a time you improved a process."                   → 1 or 5
"Describe a time you missed a target."                            → 3 (with what you did) or 6
"How do you handle an underperforming team member?"               → 4
"Tell me about a conflict on your team."                          → 5
"Describe a situation where you had to deliver bad news to a client." → 3 or 8
"How do you prioritise when everything is urgent?"                → 3 or 7
"Give an example of using data to make a decision."               → 1 or 9
"Tell me about a time you had to learn something quickly."        → 8 or 10
"What is your biggest failure?"                                   → 6, with the preventive action
"Why should we hire you as a team lead / QA lead?"                → 2 + 1 in summary form
```

### Questions that are not STAR

Some questions are about judgement, not history. Answer them with a principle, a trade-off and a short example:

- "What is more important, quality or speed?" — Quality, because rework costs both; but the SLA defines both, and a lead's job is to hit both, which is done by allocation and early QC rather than by choosing. Example: same-shift QC feedback keeps rework under 2% without slowing throughput.
- "How would you handle a client who keeps changing requirements?" — A decision log, a change-control loop with versioned SOPs, and a weekly summary of changes back to the client so they see the cost of churn.
- "What would you do in your first 30 days?" — Read the SOP, SLA and last month's reports; sit with QC for a week; meet every agent; reconcile the reports to the raw data; identify the top error type; change nothing until week three.

### Questions to ask them

Ask about the numbers: current accuracy and TAT against SLA, attrition, the biggest quality problem in the last quarter, how QC is calibrated, how success in the role is measured at six months. The answers tell you whether the operation is run on data, and asking them signals that you are.

> **Interview note:** Interviewers for lead roles listen for three things in every story: did you look at data before acting, did you fix the process or only the person, and can you state the result as a number. Build every answer to hit all three.

### Try It Yourself

```text
Story card template (one per story, keep to 90 seconds spoken)

Title:        Accuracy drop traced to SOP code table
Situation:    20-agent night team, US title client, 98.5% SLA (1 sentence)
Task:         Find the cause of a 0.8-point weekly drop and recover before month-end (1 sentence)
Actions (I):  1 Pareto on QC log → one type 35%   2 Slice by county → new TN county   3 5 Whys → SOP table
              4 Fix items, SOP v2.1, checklist step, huddle, 3-day 100% QC
Result:       99.3% next week; type −70%; recurrence prevented on next onboarding
Also answers: process improvement / data-driven decision / process vs people / quality problem
Trade-off to mention: 3 days of 100% QC cost ~15% QC capacity; worth it for a new county
```

### Quiz

1. What proportion of a STAR answer should be the Action?
- [ ] About 10%
- [x] About 60%
- [ ] About 90%
> Situation and task set the scene briefly; the action is where the interviewer learns how you work.

2. Which question is NOT best answered with a STAR story?
- [ ] "Tell me about a time you improved a process."
- [x] "What is more important, quality or speed?"
- [ ] "Describe a conflict on your team."
> Judgement questions take a principle, a trade-off and a short example rather than a full story.

3. What three things do lead-role interviewers listen for in every story?
- [x] Data before action, process fix over blame, a numeric result
- [ ] Confidence, vocabulary, length
- [ ] Team size, tenure, title
> These three signal a lead who manages by evidence and systems.

### Exercises

1. **Write story 3 in STAR** — Five of 20 agents absent on a 1,400-item day.
<details><summary>Solution</summary>

S: Night shift, 1,400 items due by 05:30 PKT, five unplanned absences at 21:00. T: Deliver the SLA or give the client a credible plan within the hour. A: I recomputed per-agent target with 15 present (93 each vs the normal 70, a 33% stretch, not feasible). I borrowed two certified QC staff for four hours, offered two hours' voluntary overtime which eight agents took, and at 21:30 messaged the client with the projection: 1,250 by TAT, remaining 150 by 08:00 CT, asking whether to prioritise mortgages. The client chose mortgages first. R: 1,290 delivered by TAT, the rest by 07:00 CT, no SLA credit, and the client thanked us for the early heads-up; I added a standing overtime volunteer list afterwards so the response was faster the next time.

</details>

2. **Prepare a judgement answer** — "How would you handle an agent who is excellent at accuracy but 20% slow?"
<details><summary>Solution</summary>

Principle: coach speed without touching the accuracy habit. Trade-off: a slow accurate agent costs less than a fast inaccurate one, so this is not urgent, but 80% attainment is unfair to the rest of the team. Example: I would sit with them for an hour of live work to find the cause, usually tool navigation or re-reading the SOP; fix that with shortcuts and a job aid; set a stretch target of 90% for two weeks then 100%; and consider whether they are a QC candidate, because accurate and careful is exactly the QC profile.

</details>

### Interview Questions

**Q: Tell me about a time you used data to solve a problem on your team.**
When weekly field accuracy dropped from 99.4% to 98.6%, I went to the QC log before speaking to anyone. A Pareto showed wrong-document-type errors were 35% of the total, and slicing by county showed 28 of those 34 came from a newly added Tennessee county whose instruments are titled "Deed of Trust", spread across eleven agents. That ruled out an agent problem; a 5 Whys led to the SOP code table, which had no entry because the SOP had been written for Wyoming. I corrected the 28 items, released SOP 2.1, added a code-table review step to the new-county onboarding checklist, and ran three days of 100% QC on that county. Accuracy was 99.3% the following week and the error type fell by 70%.

**Q: Describe your biggest failure as a lead and what you learned.**
A client found a critical error we had delivered: a mortgage amount entered as 15,000 instead of 150,000. The QC sample had not caught it, and the SOP had no explicit check for amounts. I owned it immediately, corrected and re-delivered within the hour, re-checked every amount field in the batch and found one more, and sent a written summary the same day with the preventive action: an amount-in-words versus digits check added to the SOP and the QC checklist, with amount errors classified as critical in the taxonomy. What I learned is that a sampling rate is not a safety net for critical fields; critical fields need a specific check on every item, and I now design QC plans with that distinction from the start.

**Q: Why should we hire you as a team lead?**
Because I have run a 20-agent operation to 100% daily targets and above-SLA accuracy for a US client, and I can show how: allocation from measured AHT, three checkpoints a shift, same-shift QC feedback, calibrated sampling and a taxonomy that makes root-cause analysis possible. I fix processes rather than blame people, and I can prove it with the SOP versions, the RCA records and the attrition number. I also bring a second skill most leads lack: I build the reporting myself, from the daily production report to weekly multi-state status reports and Power BI dashboards, so management gets numbers that reconcile. And I write clearly to US clients, in their time zone and their style, which is what turns a vendor relationship into a partnership.

**Q: What would you do in your first 30 days in this role?**
Week one: read the SOPs, the SLA and the last three months of reports, and sit with QC to see the work and the errors first-hand. Week two: meet every agent in a 1:1, reconcile the reports to the raw data, and review the sampling and calibration practice. Week three: run a Pareto on the QC log and pick the single largest error type as my first improvement project, agreed with my manager and the client. Week four: deliver the first fix with a measured result and present a short 30-day review: what I found, what I changed, and the three things I would tackle next. I would deliberately change nothing structural in the first two weeks, because the team's trust is built by listening first and by the first change being visibly right.
